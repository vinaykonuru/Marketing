"""Score articles for narrative relevance using a single batched Claude call."""

import json
import re

import anthropic

import config


def _extract_json(text: str) -> str:
    """Extract raw JSON from a response that may be wrapped in markdown fences."""
    text = text.strip()
    # Handle ```json ... ``` or ``` ... ```
    match = re.search(r"```(?:json)?\s*([\s\S]*?)```", text)
    if match:
        return match.group(1).strip()
    # Fallback: find the first [ to end of string
    idx = text.find("[")
    if idx != -1:
        return text[idx:]
    return text


def score_articles(articles: list[dict]) -> list[dict]:
    """
    Score all articles in a single Claude call for relevance to the narrative.
    Returns only articles that meet RELEVANCE_THRESHOLD, sorted by score desc,
    capped at MAX_ARTICLES_IN_DIGEST.
    """
    if not articles:
        return []

    # Score all articles — 200 items ≈ 12K input tokens, well within limits
    candidates = articles[:200]

    client = anthropic.Anthropic(api_key=config.ANTHROPIC_API_KEY)

    topic_lines = "\n".join(f"  - {t}" for t in config.TARGET_TOPICS)
    article_lines = []
    for i, a in enumerate(candidates, 1):
        article_lines.append(
            f"[{i}] Title: {a['title']}\n"
            f"    Source: {a['source']}\n"
            f"    Summary: {a['summary'][:250]}"
        )
    articles_block = "\n\n".join(article_lines)

    prompt = f"""You are a content curator for an executive whose narrative is about scaling US manufacturing and infrastructure.

The executive's narrative: "{config.NARRATIVE}"

They care about the INDUSTRIAL, MANUFACTURING, and INFRASTRUCTURE dimensions across four domains:
  1. Aerospace & Defense: ground systems, launch infrastructure, aircraft/missile production, supply chains
  2. Energy Infrastructure: grid expansion, power generation buildout, transmission, industrial energy demand
  3. Fusion & Advanced Nuclear: commercial fusion programs, tokamak construction, cryogenic systems, SMRs
  4. Distributed Manufacturing: US industrial base expansion, reshoring, advanced manufacturing investment, workforce

Score each item 0–10 using these guidelines:
  8–10 = Direct hit: manufacturing capacity/production rates/factory investment in any of the four domains; supply chain disruption; workforce scaleup; new infrastructure buildout; fusion/cryogenic program milestones
  5–7  = Relevant signal: company news tied to production volume or industrial investment; defense/energy budget affecting industrial base; facility announcements; industrial policy (IRA, CHIPS, DoD investment); venture investment in hard tech manufacturing
  2–4  = Weak signal: general company news with tangential manufacturing angle; policy debates without industrial specifics; geopolitical commentary
  0–1  = Unrelated: software products, consumer tech, pure finance/markets, sports, entertainment, unrelated industries

Items:

{articles_block}

Return ONLY a valid JSON array — no markdown, no preamble, no trailing text:
[{{"index": 1, "score": 7, "reason": "covers F-35 production rate increase"}}, ...]
"""

    try:
        response = client.messages.create(
            model=config.CLAUDE_MODEL,
            max_tokens=8192,
            messages=[{"role": "user", "content": prompt}],
        )
        raw = response.content[0].text
        scores: list[dict] = json.loads(_extract_json(raw))
    except Exception as e:
        print(f"  [warn] Scoring failed: {e}. Including all articles unscored.")
        return candidates[:config.MAX_ARTICLES_IN_DIGEST]

    score_map = {s["index"]: s for s in scores}

    # Show score distribution for tuning
    all_scores = sorted(
        [(i, score_map.get(i, {}).get("score", 0)) for i in range(1, len(candidates) + 1)],
        key=lambda x: x[1], reverse=True
    )
    top_preview = ", ".join(f"[{i}]={s}" for i, s in all_scores[:15])
    print(f"  Top scores: {top_preview}")

    scored = []
    for i, article in enumerate(candidates, 1):
        s = score_map.get(i, {})
        score_val = int(s.get("score", 0))
        if score_val >= config.RELEVANCE_THRESHOLD:
            scored.append({
                **article,
                "relevance_score": score_val,
                "relevance_reason": s.get("reason", ""),
            })

    scored.sort(key=lambda x: x["relevance_score"], reverse=True)
    result = scored[:config.MAX_ARTICLES_IN_DIGEST]

    # Slow-news-day fallback: if under 3 items passed, include score ≥ 4
    if len(result) < 3:
        extras = []
        for i, article in enumerate(candidates, 1):
            s = score_map.get(i, {})
            score_val = int(s.get("score", 0))
            if 4 <= score_val < config.RELEVANCE_THRESHOLD:
                extras.append({
                    **article,
                    "relevance_score": score_val,
                    "relevance_reason": s.get("reason", ""),
                })
        extras.sort(key=lambda x: x["relevance_score"], reverse=True)
        combined = result + extras
        seen = set()
        deduped = []
        for a in combined:
            if a["url"] not in seen:
                seen.add(a["url"])
                deduped.append(a)
        result = deduped[:config.MAX_ARTICLES_IN_DIGEST]
        if extras:
            print(f"  (slow news day — included {len(extras)} item(s) at score 4)")

    return result
