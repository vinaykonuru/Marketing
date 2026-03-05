"""Generate digest summaries, repost captions, and formatted output (text + HTML)."""

import json
import re
from datetime import datetime, timezone

import anthropic

import config


def _extract_json(text: str) -> str:
    """Extract raw JSON from a response that may be wrapped in markdown fences."""
    text = text.strip()
    match = re.search(r"```(?:json)?\s*([\s\S]*?)```", text)
    if match:
        return match.group(1).strip()
    idx = text.find("[")
    if idx != -1:
        return text[idx:]
    return text


def _enrich_articles(articles: list[dict]) -> list[dict]:
    """
    Call Claude once to generate a one-liner summary and repost caption for
    every article. Returns articles with 'one_liner' and 'caption' added.
    """
    client = anthropic.Anthropic(api_key=config.ANTHROPIC_API_KEY)

    article_lines = []
    for i, a in enumerate(articles, 1):
        article_lines.append(
            f"[{i}] Title: {a['title']}\n"
            f"    Source: {a['source']}\n"
            f"    Why relevant: {a.get('relevance_reason', '')}\n"
            f"    Content: {a.get('summary', '')[:400]}"
        )
    articles_block = "\n\n".join(article_lines)

    prompt = f"""You are a content strategist for an aerospace manufacturing executive whose core narrative is:
"{config.NARRATIVE}"

For each article, produce:
1. one_liner: A single factual sentence (≤25 words) summarizing the news.
2. caption: A ready-to-post LinkedIn/Twitter caption (≤280 chars) that connects the news to the narrative. Include 2–3 relevant hashtags (e.g. #AerospaceMfg #DefenseIndustry #SupplyChain). Make it authoritative and insight-driven — not salesy.

Articles:

{articles_block}

Return ONLY a valid JSON array — no markdown, no explanation:
[{{"index": 1, "one_liner": "...", "caption": "..."}}, ...]
"""

    try:
        response = client.messages.create(
            model=config.CLAUDE_MODEL,
            max_tokens=4096,
            messages=[{"role": "user", "content": prompt}],
        )
        raw = response.content[0].text
        enrichments: list[dict] = json.loads(_extract_json(raw))
    except Exception as e:
        print(f"  [warn] Enrichment failed: {e}. Captions will be empty.")
        enrichments = []

    enrichment_map = {e["index"]: e for e in enrichments}

    result = []
    for i, article in enumerate(articles, 1):
        enrich = enrichment_map.get(i, {})
        result.append({
            **article,
            "one_liner": enrich.get("one_liner", article.get("summary", "")[:120]),
            "caption": enrich.get("caption", ""),
        })
    return result


def generate_tweet_digest(tweets: list[dict]) -> dict:
    """
    Build the tweet digest — all tweets, sorted by engagement, with
    a suggested quote-tweet commentary for each.
    """
    date_str = datetime.now(timezone.utc).strftime("%B %d, %Y")

    if not tweets:
        return {"date": date_str, "narrative": config.NARRATIVE, "items": []}

    # Sort by engagement descending, then apply per-account cap
    sorted_tweets = sorted(tweets, key=lambda t: t.get("engagement", 0), reverse=True)
    account_counts: dict[str, int] = {}
    selected = []
    for t in sorted_tweets:
        acct = t.get("source", "")
        if account_counts.get(acct, 0) < config.MAX_TWEETS_PER_ACCOUNT:
            selected.append(t)
            account_counts[acct] = account_counts.get(acct, 0) + 1
        if len(selected) >= config.MAX_TWEETS_IN_DIGEST:
            break

    # Generate captions in one batch call
    client = anthropic.Anthropic(api_key=config.ANTHROPIC_API_KEY)
    tweet_lines = []
    for i, t in enumerate(selected, 1):
        tweet_lines.append(
            f"[{i}] @handle: {t['source']}\n"
            f"    Tweet: {t['summary']}\n"
            f"    Engagement: {t.get('engagement', 0)} likes+retweets"
        )

    prompt = f"""You are a content strategist for an aerospace and defense manufacturing executive.
Their narrative: "{config.NARRATIVE}"

For each tweet below, produce three things:
1. context: One sentence describing what the tweet is actually about or linking to (strip away the engagement — just explain the substance).
2. reception: One sentence characterizing the engagement level and audience signal (e.g. "Going viral at 11K likes+RT — strong resonance in defense/tech circles" or "Modest traction at 54 likes — niche but relevant audience").
3. caption: A suggested caption (≤280 chars) the executive could post as their own commentary, connecting to manufacturing capacity/demand/supply chain where relevant. Include 2–3 hashtags. Sharp industry insider tone, not a press release.

Tweets:

{chr(10).join(tweet_lines)}

Return ONLY a valid JSON array:
[{{"index": 1, "context": "...", "reception": "...", "caption": "..."}}, ...]
"""

    try:
        response = client.messages.create(
            model=config.CLAUDE_MODEL,
            max_tokens=8192,
            messages=[{"role": "user", "content": prompt}],
        )
        raw = response.content[0].text
        enrichments: list[dict] = json.loads(_extract_json(raw))
    except Exception as e:
        print(f"  [warn] Tweet caption generation failed: {e}.")
        enrichments = []

    enrichment_map = {e["index"]: e for e in enrichments}

    items = []
    for i, t in enumerate(selected, 1):
        enrich = enrichment_map.get(i, {})
        items.append({
            "handle": t["source"],
            "tweet_text": t["summary"],
            "url": t["url"],
            "published": t.get("published", ""),
            "engagement": t.get("engagement", 0),
            "context": enrich.get("context", ""),
            "reception": enrich.get("reception", ""),
            "caption": enrich.get("caption", ""),
        })

    return {"date": date_str, "narrative": config.NARRATIVE, "items": items}


# ── Tweet digest formatters ───────────────────────────────────────────────────

def format_tweet_digest_text(digest: dict) -> str:
    lines = [
        f"X TWEET DIGEST — {digest['date']}",
        f"Narrative: {digest['narrative']}",
        "=" * 62,
        "",
    ]
    if not digest["items"]:
        lines.append("No tweets found in the last 24 hours.")
        return "\n".join(lines)

    for i, item in enumerate(digest["items"], 1):
        lines += [
            f"{i}. {item['handle']}",
            f"   Tweet   : {item['tweet_text']}",
            f"   Link    : {item['url']}",
            f"   Context : {item['context']}",
            f"   Reception: {item['reception']}",
            f"   Caption : {item['caption']}",
            "",
        ]
    lines += [
        "=" * 62,
        f"{len(digest['items'])} tweets · sorted by engagement · review before posting.",
    ]
    return "\n".join(lines)


def format_tweet_digest_html(digest: dict) -> str:
    items_html = ""
    for i, item in enumerate(digest["items"], 1):
        engage = item["engagement"]
        items_html += f"""
        <div style="margin-bottom:24px;padding:18px;border:1px solid #e0e0e0;border-radius:8px;background:#fff;">
          <p style="margin:0 0 6px 0;font-size:12px;color:#1da1f2;font-weight:700;">{item['handle']}</p>
          <p style="margin:0 0 10px 0;font-size:14px;color:#212121;line-height:1.5;">
            <a href="{item['url']}" style="color:#212121;text-decoration:none;">{item['tweet_text']}</a>
          </p>
          <p style="margin:0 0 4px 0;font-size:12px;color:#555;">
            <strong>Context:</strong> {item['context']}
          </p>
          <p style="margin:0 0 12px 0;font-size:12px;color:#9e9e9e;">
            <strong>Reception:</strong> {item['reception']} &nbsp;·&nbsp; {item['published']}
          </p>
          <div style="background:#e8f5e9;border-left:4px solid #388e3c;padding:10px 14px;border-radius:0 6px 6px 0;">
            <p style="margin:0 0 3px 0;font-size:11px;color:#2e7d32;font-weight:700;letter-spacing:.5px;">YOUR CAPTION</p>
            <p style="margin:0;font-size:13px;color:#333;line-height:1.5;">{item['caption']}</p>
          </div>
        </div>"""

    empty_msg = "" if digest["items"] else "<p style='color:#757575;'>No tweets found in the last 24 hours.</p>"

    return f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:680px;margin:24px auto;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.12);">
    <div style="background:#1da1f2;color:#fff;padding:28px 28px 20px;">
      <p style="margin:0 0 4px;font-size:12px;letter-spacing:1px;opacity:.8;text-transform:uppercase;">Daily X Digest</p>
      <h1 style="margin:0 0 6px;font-size:22px;font-weight:700;">Tweets · Top {len(digest['items'])} by Engagement</h1>
      <p style="margin:0;font-size:13px;opacity:.85;">{digest['date']}</p>
      <p style="margin:6px 0 0;font-size:12px;opacity:.7;font-style:italic;">Narrative: {digest['narrative']}</p>
    </div>
    <div style="padding:24px 28px;background:#fafafa;">
      {items_html or empty_msg}
    </div>
    <div style="background:#eceff1;padding:14px 28px;font-size:11px;color:#90a4ae;text-align:center;">
      Auto-generated · Sorted by engagement · Review before posting
    </div>
  </div>
</body>
</html>"""


# ── News digest functions (unchanged names, kept for main.py) ─────────────────

def generate_digest(articles: list[dict]) -> dict:
    """Build the full digest data structure."""
    date_str = datetime.now(timezone.utc).strftime("%B %d, %Y")

    if not articles:
        return {
            "date": date_str,
            "narrative": config.NARRATIVE,
            "items": [],
        }

    enriched = _enrich_articles(articles)
    items = [
        {
            "headline": a["title"],
            "source": a["source"],
            "url": a["url"],
            "published": a.get("published", ""),
            "one_liner": a["one_liner"],
            "caption": a["caption"],
            "relevance_score": a.get("relevance_score", 0),
        }
        for a in enriched
    ]

    return {
        "date": date_str,
        "narrative": config.NARRATIVE,
        "items": items,
    }


# ── Plain-text formatter ──────────────────────────────────────────────────────

def format_digest_text(digest: dict) -> str:
    lines = [
        f"AEROSPACE MANUFACTURING DIGEST — {digest['date']}",
        f"Narrative: {digest['narrative']}",
        "=" * 62,
        "",
    ]

    if not digest["items"]:
        lines.append("No relevant articles found in the last 24 hours.")
        return "\n".join(lines)

    for i, item in enumerate(digest["items"], 1):
        score = item["relevance_score"]
        lines += [
            f"{i}. {item['headline']}",
            f"   Source : {item['source']}  |  Relevance: {score}/10",
            f"   Link   : {item['url']}",
            f"   Summary: {item['one_liner']}",
            f"   Caption: {item['caption']}",
            "",
        ]

    lines += [
        "=" * 62,
        f"Digest contains {len(digest['items'])} articles. Review links and post manually.",
    ]
    return "\n".join(lines)


# ── HTML email formatter ──────────────────────────────────────────────────────

def format_digest_html(digest: dict) -> str:
    def score_badge(score: int) -> str:
        filled = "●" * score
        empty = "○" * (10 - score)
        color = "#2e7d32" if score >= 7 else "#f57c00" if score >= 5 else "#c62828"
        return f'<span style="color:{color};font-size:13px;">{filled}{empty}</span> {score}/10'

    items_html = ""
    for i, item in enumerate(digest["items"], 1):
        items_html += f"""
        <div style="margin-bottom:28px;padding:20px;border:1px solid #e0e0e0;border-radius:8px;background:#fff;">
          <h3 style="margin:0 0 6px 0;font-size:15px;line-height:1.4;">
            {i}. <a href="{item['url']}" style="color:#1565c0;text-decoration:none;">{item['headline']}</a>
          </h3>
          <p style="margin:0 0 10px 0;font-size:12px;color:#757575;">
            <strong>{item['source']}</strong> &nbsp;·&nbsp; {item['published']}
            &nbsp;·&nbsp; Relevance: {score_badge(item['relevance_score'])}
          </p>
          <p style="margin:0 0 12px 0;font-size:14px;color:#212121;">
            <strong>Summary:</strong> {item['one_liner']}
          </p>
          <div style="background:#e8f0fe;border-left:4px solid #1565c0;padding:12px 14px;border-radius:0 6px 6px 0;">
            <p style="margin:0 0 4px 0;font-size:11px;color:#5c6bc0;font-weight:700;letter-spacing:.5px;">SUGGESTED REPOST CAPTION</p>
            <p style="margin:0;font-size:13px;color:#333;line-height:1.5;">{item['caption']}</p>
          </div>
        </div>"""

    empty_msg = ""
    if not digest["items"]:
        empty_msg = "<p style='color:#757575;'>No relevant articles found in the last 24 hours.</p>"

    return f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:680px;margin:24px auto;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.12);">

    <!-- Header -->
    <div style="background:#0d2e52;color:#fff;padding:28px 28px 20px;">
      <p style="margin:0 0 4px;font-size:12px;letter-spacing:1px;opacity:.7;text-transform:uppercase;">Daily Intelligence Digest</p>
      <h1 style="margin:0 0 6px;font-size:22px;font-weight:700;">Aerospace Manufacturing</h1>
      <p style="margin:0;font-size:13px;opacity:.8;">{digest['date']} &nbsp;·&nbsp; {len(digest['items'])} articles</p>
      <p style="margin:8px 0 0;font-size:12px;opacity:.65;font-style:italic;">Narrative: {digest['narrative']}</p>
    </div>

    <!-- Body -->
    <div style="padding:24px 28px;background:#fafafa;">
      {items_html or empty_msg}
    </div>

    <!-- Footer -->
    <div style="background:#eceff1;padding:14px 28px;font-size:11px;color:#90a4ae;text-align:center;">
      Auto-generated · Review all links before posting · You're receiving this because you set up the Aerospace Digest Agent
    </div>
  </div>
</body>
</html>"""
