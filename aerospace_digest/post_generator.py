"""Generate original LinkedIn and X posts grounded in the day's digest content."""

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
    idx = text.find("{")
    if idx != -1:
        return text[idx:]
    return text


def generate_posts(tweet_digest: dict, news_digest: dict) -> dict:
    """
    Use Claude to write original LinkedIn and X posts grounded in the day's
    digest content. Returns a dict with 'linkedin' and 'twitter' post lists.
    """
    date_str = datetime.now(timezone.utc).strftime("%B %d, %Y")

    # Build a compact brief of today's signal — include URLs so Claude can cite them
    # Build URL lookup maps for later reference
    news_url_map = {}   # label → url
    tweet_url_map = {}  # label → url

    news_lines = []
    for i, item in enumerate(news_digest.get("items", [])[:8], 1):
        label = f"N{i}"
        news_url_map[label] = item.get("url", "")
        news_lines.append(
            f"  [{label}] {item['headline']} ({item['source']}, relevance {item['relevance_score']}/10)\n"
            f"       {item['one_liner']}\n"
            f"       URL: {item.get('url', '')}"
        )

    tweet_lines = []
    for i, item in enumerate(tweet_digest.get("items", [])[:10], 1):
        label = f"T{i}"
        tweet_url_map[label] = item.get("url", "")
        tweet_lines.append(
            f"  [{label}] @{item['handle']} — {item['engagement']:,} likes+RT\n"
            f"       {item['context']}\n"
            f"       URL: {item.get('url', '')}"
        )

    all_url_map = {**news_url_map, **tweet_url_map}

    news_block = "\n\n".join(news_lines) if news_lines else "  No news items today."
    tweet_block = "\n\n".join(tweet_lines) if tweet_lines else "  No tweets today."

    prompt = f"""You are a ghostwriter for an aerospace and defense manufacturing executive.

Their narrative: "{config.NARRATIVE}"

They want to be seen as an authoritative industry voice on the need to scale physical infrastructure and manufacturing in the US — covering aerospace ground systems, energy grid buildout, fusion/cryogenic systems, and distributed manufacturing. Their tone is:
- Insider, direct, data-grounded — not a press release
- Connects macro trends to specific industrial realities
- Challenges conventional wisdom without being polemical
- Uses concrete examples and numbers when available
- Does NOT sound like marketing copy or a think-piece

TODAY'S SIGNAL ({date_str})

Top news articles:
{news_block}

Top tweets from monitored accounts (by engagement):
{tweet_block}

YOUR TASK — generate posts that this executive could publish TODAY:

1. linkedin_posts: Write 3 original LinkedIn posts. Each post MUST combine at least one high-profile tweet AND at least one news article. This is non-negotiable — mixing both types gets more attention on LinkedIn because the tweet reference signals relevance to a live conversation while the news grounds it in industry substance. Structure each post like this:
   - Open by referencing the tweet signal (e.g. "Marc Andreessen called for a Space Age Renaissance this week..." or "When Palmer Luckey is pointing out government spending inefficiency...") — don't tag or quote verbatim, paraphrase the gist
   - Pivot to the news data point that gives it industrial substance (e.g. "...and this week's GAO report on Sentinel makes clear why: 600+ facilities need to be replaced...")
   - Land on the narrative insight connecting both
   - End with a concrete implication or call to action
   - Include 2–3 relevant hashtags at the end
   - Be 130–230 words
   - Flowing paragraphs only — no bullet points or listicles
   - In source_urls, include the tweet URL AND the news article URL(s) that inspired this post, using the labels above (e.g. ["T7", "N1"])

2. twitter_posts: Write 4 original X/Twitter posts. Each should:
   - Be under 280 characters (strict — count carefully)
   - Be punchy and standalone — no thread format needed
   - Use one specific fact or contrast from the digest
   - Include 1–2 hashtags that fit within the character limit
   - Feel like an insider observation, not a headline rewrite

Return ONLY valid JSON in this exact structure:
{{
  "date": "{date_str}",
  "linkedin_posts": [
    {{"post": "...", "source_signal": "brief note on which digest item inspired this", "source_urls": ["N1", "T2"]}},
    {{"post": "...", "source_signal": "...", "source_urls": ["N3"]}},
    {{"post": "...", "source_signal": "...", "source_urls": ["N2", "N5"]}}
  ],
  "twitter_posts": [
    {{"post": "...", "char_count": 0, "source_signal": "..."}},
    {{"post": "...", "char_count": 0, "source_signal": "..."}},
    {{"post": "...", "char_count": 0, "source_signal": "..."}},
    {{"post": "...", "char_count": 0, "source_signal": "..."}}
  ]
}}
"""

    client = anthropic.Anthropic(api_key=config.ANTHROPIC_API_KEY)

    try:
        response = client.messages.create(
            model=config.CLAUDE_MODEL,
            max_tokens=4096,
            messages=[{"role": "user", "content": prompt}],
        )
        raw = response.content[0].text
        result = json.loads(_extract_json(raw))
    except Exception as e:
        print(f"  [warn] Post generation failed: {e}")
        return {"date": date_str, "linkedin_posts": [], "twitter_posts": []}

    # Resolve label references (e.g. "N1", "T3") back to actual URLs
    for p in result.get("linkedin_posts", []):
        labels = p.pop("source_urls", [])
        p["source_urls"] = [all_url_map[lbl] for lbl in labels if lbl in all_url_map]

    # Verify and fix char counts
    for p in result.get("twitter_posts", []):
        p["char_count"] = len(p.get("post", ""))

    return result


def format_posts_text(posts: dict) -> str:
    date = posts.get("date", "")
    lines = [
        f"ORIGINAL POSTS — {date}",
        f"Narrative: {config.NARRATIVE}",
        "=" * 62,
        "",
    ]

    linkedin = posts.get("linkedin_posts", [])
    if linkedin:
        lines.append("── LINKEDIN POSTS ──────────────────────────────────────")
        lines.append("")
        for i, p in enumerate(linkedin, 1):
            lines.append(f"Post {i}  [inspired by: {p.get('source_signal', '')}]")
            lines.append("-" * 54)
            lines.append(p.get("post", ""))
            urls = p.get("source_urls", [])
            if urls:
                lines.append("")
                lines.append("  SOURCE LINKS:")
                for url in urls:
                    lines.append(f"  → {url}")
            lines.append("")
    else:
        lines.append("No LinkedIn posts generated.")
        lines.append("")

    twitter = posts.get("twitter_posts", [])
    if twitter:
        lines.append("── X / TWITTER POSTS ────────────────────────────────────")
        lines.append("")
        for i, p in enumerate(twitter, 1):
            chars = p.get("char_count", len(p.get("post", "")))
            over = " ⚠ OVER 280" if chars > 280 else ""
            lines.append(f"Post {i}  [{chars} chars{over}]  [inspired by: {p.get('source_signal', '')}]")
            lines.append("-" * 54)
            lines.append(p.get("post", ""))
            lines.append("")
    else:
        lines.append("No X posts generated.")
        lines.append("")

    lines += [
        "=" * 62,
        "Review and edit before posting. These are AI-generated drafts.",
    ]
    return "\n".join(lines)


def format_posts_html(posts: dict) -> str:
    date = posts.get("date", "")

    linkedin_html = ""
    for i, p in enumerate(posts.get("linkedin_posts", []), 1):
        text = p.get("post", "").replace("\n", "<br>")
        signal = p.get("source_signal", "")
        urls = p.get("source_urls", [])
        urls_html = ""
        if urls:
            link_items = "".join(
                f'<li style="margin-bottom:4px;"><a href="{u}" style="color:#0077b5;font-size:12px;word-break:break-all;">{u}</a></li>'
                for u in urls
            )
            urls_html = f"""
          <div style="margin-top:14px;padding:10px 14px;background:#f0f7ff;border-left:3px solid #0077b5;border-radius:0 4px 4px 0;">
            <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#0077b5;letter-spacing:.4px;text-transform:uppercase;">Source Links</p>
            <ul style="margin:0;padding-left:16px;list-style:disc;">{link_items}</ul>
          </div>"""
        linkedin_html += f"""
        <div style="margin-bottom:28px;padding:20px;border:1px solid #e0e0e0;border-radius:8px;background:#fff;">
          <div style="display:flex;align-items:center;margin-bottom:12px;">
            <span style="background:#0077b5;color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:12px;letter-spacing:.5px;">LINKEDIN · POST {i}</span>
          </div>
          <p style="margin:0 0 14px 0;font-size:14px;color:#212121;line-height:1.7;">{text}</p>
          <p style="margin:0 0 0 0;font-size:11px;color:#9e9e9e;font-style:italic;">Inspired by: {signal}</p>
          {urls_html}
        </div>"""

    twitter_html = ""
    for i, p in enumerate(posts.get("twitter_posts", []), 1):
        text = p.get("post", "")
        chars = p.get("char_count", len(text))
        over = chars > 280
        badge_color = "#c62828" if over else "#2e7d32"
        badge_text = f"{chars}/280 ⚠" if over else f"{chars}/280"
        signal = p.get("source_signal", "")
        twitter_html += f"""
        <div style="margin-bottom:20px;padding:18px;border:1px solid #e0e0e0;border-radius:8px;background:#fff;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
            <span style="background:#1da1f2;color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:12px;letter-spacing:.5px;">X · POST {i}</span>
            <span style="font-size:11px;color:{badge_color};font-weight:600;">{badge_text}</span>
          </div>
          <p style="margin:0 0 10px 0;font-size:14px;color:#212121;line-height:1.6;">{text}</p>
          <p style="margin:0;font-size:11px;color:#9e9e9e;font-style:italic;">Inspired by: {signal}</p>
        </div>"""

    if not linkedin_html:
        linkedin_html = "<p style='color:#757575;'>No LinkedIn posts generated.</p>"
    if not twitter_html:
        twitter_html = "<p style='color:#757575;'>No X posts generated.</p>"

    return f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:680px;margin:24px auto;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.12);">

    <!-- Header -->
    <div style="background:#212121;color:#fff;padding:28px 28px 20px;">
      <p style="margin:0 0 4px;font-size:12px;letter-spacing:1px;opacity:.6;text-transform:uppercase;">Original Posts · Draft</p>
      <h1 style="margin:0 0 6px;font-size:22px;font-weight:700;">Ready-to-Post Content</h1>
      <p style="margin:0;font-size:13px;opacity:.75;">{date}</p>
      <p style="margin:8px 0 0;font-size:12px;opacity:.55;font-style:italic;">{config.NARRATIVE}</p>
    </div>

    <!-- LinkedIn -->
    <div style="padding:24px 28px 8px;background:#fafafa;">
      <h2 style="margin:0 0 16px;font-size:14px;font-weight:700;color:#0077b5;letter-spacing:.5px;text-transform:uppercase;">LinkedIn Posts</h2>
      {linkedin_html}
    </div>

    <!-- Twitter -->
    <div style="padding:8px 28px 24px;background:#fafafa;">
      <h2 style="margin:16px 0 16px;font-size:14px;font-weight:700;color:#1da1f2;letter-spacing:.5px;text-transform:uppercase;">X / Twitter Posts</h2>
      {twitter_html}
    </div>

    <!-- Footer -->
    <div style="background:#eceff1;padding:14px 28px;font-size:11px;color:#90a4ae;text-align:center;">
      AI-generated drafts · Review and edit before posting
    </div>
  </div>
</body>
</html>"""
