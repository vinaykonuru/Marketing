# Aerospace Manufacturing Digest Agent

A daily content digest agent that produces **three outputs**:

1. **Tweet digest** — Recent tweets from monitored X accounts + keyword searches, sorted by engagement, with Claude-generated captions
2. **News digest** — Articles from Google News RSS and aerospace publication feeds, filtered by relevance to the manufacturing narrative
3. **Original posts** — LinkedIn and X posts generated from the day's digest content

All outputs include AI-generated captions and summaries ready to post.

---

## Quick Start

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Configure environment
cp .env.example .env
# Edit .env — add ANTHROPIC_API_KEY and X_BEARER_TOKEN (see below)

# 3. Run
python main.py
```

---

## Requirements

| Service | Purpose | Required |
|---------|---------|----------|
| **Anthropic API** | Claude for scoring, summaries, captions, post generation | Yes |
| **X (Twitter) API** | Fetch tweets (keyword search + monitored accounts) | Yes — Basic tier ($100/mo) or higher for search |
| **Serper API** | Optional Google search enrichment | No — leave blank to skip |

---

## Configuration

### Environment variables (`.env`)

Copy `.env.example` to `.env` and fill in:

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key |
| `X_BEARER_TOKEN` | X API v2 Bearer Token (developer.x.com) |
| `DELIVERY_METHOD` | `file` (default), `email`, or `slack` |
| `SERPER_API_KEY` | Optional — enhances news coverage (~$50/mo) |

### Delivery options

- **`file`** — Saves `.txt` and `.json` files locally (e.g. `digest_tweets_2026-03-05.txt`)
- **`email`** — Sends via SMTP (Gmail: use App Password with 2FA)
- **`slack`** — Posts to a Slack channel via incoming webhook

See `.env.example` for SMTP and Slack configuration.

---

## Output Files

Each run produces dated files:

| File | Contents |
|------|----------|
| `digest_tweets_YYYY-MM-DD.txt` / `.json` | X tweet digest with captions |
| `digest_news_YYYY-MM-DD.txt` / `.json` | News digest (relevance ≥5/10) |
| `posts_YYYY-MM-DD.txt` / `.json` | Original LinkedIn + X posts |

---

## Pipeline Overview

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. TWEET DIGEST                                                  │
│    Fetch tweets (X API) → Generate captions (Claude) → Deliver   │
├─────────────────────────────────────────────────────────────────┤
│ 2. NEWS DIGEST                                                   │
│    Fetch news (RSS + Google News) → Score relevance (Claude)     │
│    → Summarize & caption (Claude) → Deliver                       │
├─────────────────────────────────────────────────────────────────┤
│ 3. ORIGINAL POSTS                                                │
│    Combine digests → Generate LinkedIn + X posts (Claude)        │
│    → Deliver                                                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Narrative & Scoring

The agent is tuned for this narrative (editable in `config.py`):

> *We need to scale distributed manufacturing to support innovation and development in the US — ground systems infrastructure for aerospace, basic energy infrastructure, and cryogenic infrastructure for fusion and advanced energy.*

**News scoring** (0–10):

- **8–10** — Direct hit: manufacturing capacity, production rates, supply chain, workforce, infrastructure
- **5–7** — Relevant: company news tied to production, industrial policy, facility announcements
- **2–4** — Weak signal: tangential manufacturing angle
- **0–1** — Unrelated: software, consumer tech, pure finance, etc.

Articles with score ≥5 are included. On slow news days, items ≥4 may be added.

---

## Customization

Edit `config.py` to adjust:

- `NARRATIVE` — Executive narrative for scoring
- `TARGET_TOPICS` — Topics used in relevance scoring
- `RELEVANCE_THRESHOLD` — Minimum score (default: 5)
- `MAX_TWEETS_IN_DIGEST` / `MAX_ARTICLES_IN_DIGEST` — Output limits
- `X_SEARCH_QUERIES` — Keyword searches on X
- `X_MONITORED_ACCOUNTS` — Handles to fetch all tweets from
- `SEARCH_QUERIES` — Google News RSS queries
- `RSS_FEEDS` — Publication feeds (Aviation Week, Defense News, etc.)

---

## Scheduling (Cron)

Run daily at 7 AM:

```cron
0 7 * * * cd /path/to/aerospace_digest && python main.py >> digest.log 2>&1
```

---

## Project Structure

```
aerospace_digest/
├── main.py           # Entry point — runs all three digests
├── config.py         # Narrative, feeds, API keys, thresholds
├── fetcher.py        # News: Google News RSS, Serper, publication feeds
├── x_fetcher.py      # Tweets: X API (search + monitored accounts)
├── scorer.py         # Relevance scoring via Claude
├── formatter.py      # Digest formatting (text, HTML)
├── post_generator.py # Original LinkedIn/X posts via Claude
├── delivery.py       # Email, Slack, or file delivery
├── requirements.txt
├── .env.example
└── README.md
```

---

## License

Private use. All rights reserved.
