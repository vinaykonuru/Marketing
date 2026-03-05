#!/usr/bin/env python3
"""
Aerospace Manufacturing Content Digest Agent
============================================
Produces TWO daily digests:

  digest_tweets_YYYY-MM-DD  — All recent tweets from monitored X accounts
                              + keyword searches, sorted by engagement.
                              No relevance filter — you trust these accounts.

  digest_news_YYYY-MM-DD    — Articles from Google News RSS and aerospace
                              publication feeds, filtered by relevance score
                              (≥5/10) against the manufacturing narrative.

Both include Claude-generated captions ready to post.

SETUP
-----
1. pip install -r requirements.txt
2. cp .env.example .env  →  fill in ANTHROPIC_API_KEY and X_BEARER_TOKEN
3. python main.py

SCHEDULE (cron — 7 AM daily)
------------------------------
0 7 * * * cd /path/to/aerospace_digest && python main.py >> digest.log 2>&1
"""

import sys
from datetime import datetime, timezone


def main() -> None:
    print(f"\n{'='*62}")
    print(f"  Aerospace Manufacturing Digest Agent")
    print(f"  {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}")
    print(f"{'='*62}")

    import config

    if not config.ANTHROPIC_API_KEY:
        print("\nERROR: ANTHROPIC_API_KEY not set. Add it to .env and re-run.")
        sys.exit(1)

    print(f"\n  Narrative : {config.NARRATIVE}")
    print(f"  Delivery  : {config.DELIVERY_METHOD}")

    from fetcher import fetch_tweets, fetch_news
    from formatter import (
        generate_tweet_digest, format_tweet_digest_text, format_tweet_digest_html,
        generate_digest, format_digest_text, format_digest_html,
    )
    from scorer import score_articles
    from delivery import deliver
    from post_generator import generate_posts, format_posts_text, format_posts_html

    # ── DIGEST 1: X Tweets ────────────────────────────────────────────────────
    print(f"\n{'─'*62}")
    print("  DIGEST 1 OF 2 — X Tweets")
    print(f"{'─'*62}")

    print("\n[1/3] Fetching tweets...")
    tweets = fetch_tweets()

    print(f"\n[2/3] Generating captions for top {config.MAX_TWEETS_IN_DIGEST} tweets (by engagement)...")
    tweet_digest = generate_tweet_digest(tweets)

    tweet_text = format_tweet_digest_text(tweet_digest)
    tweet_html = format_tweet_digest_html(tweet_digest)

    print("\n" + "·" * 62)
    print(tweet_text)
    print("·" * 62)

    print(f"\n[3/3] Delivering tweet digest via '{config.DELIVERY_METHOD}'...")
    try:
        deliver(tweet_digest, tweet_text, tweet_html, label="digest_tweets")
    except Exception as e:
        print(f"  Delivery error: {e} — falling back to file.")
        from delivery import deliver_file
        deliver_file(tweet_digest, tweet_text, label="digest_tweets")

    # ── DIGEST 2: News Articles ────────────────────────────────────────────────
    print(f"\n{'─'*62}")
    print("  DIGEST 2 OF 2 — News Articles")
    print(f"{'─'*62}")

    print("\n[1/3] Fetching news articles...")
    news = fetch_news()

    print(f"\n[2/3] Scoring {len(news)} articles for relevance (threshold {config.RELEVANCE_THRESHOLD}/10)...")
    relevant = score_articles(news)
    print(f"  → {len(relevant)} article(s) passed")

    print("\n[3/3] Generating summaries and captions...")
    news_digest = generate_digest(relevant)
    news_text = format_digest_text(news_digest)
    news_html = format_digest_html(news_digest)

    print("\n" + "·" * 62)
    print(news_text)
    print("·" * 62)

    print(f"\nDelivering news digest via '{config.DELIVERY_METHOD}'...")
    try:
        deliver(news_digest, news_text, news_html, label="digest_news")
    except Exception as e:
        print(f"  Delivery error: {e} — falling back to file.")
        from delivery import deliver_file
        deliver_file(news_digest, news_text, label="digest_news")

    # ── DIGEST 3: Original Posts ──────────────────────────────────────────────
    print(f"\n{'─'*62}")
    print("  DIGEST 3 OF 3 — Original Posts")
    print(f"{'─'*62}")

    print("\n[1/2] Generating LinkedIn + X posts from today's digest...")
    posts = generate_posts(tweet_digest, news_digest)
    posts_text = format_posts_text(posts)
    posts_html = format_posts_html(posts)

    print("\n" + "·" * 62)
    print(posts_text)
    print("·" * 62)

    print(f"\n[2/2] Saving posts via '{config.DELIVERY_METHOD}'...")
    try:
        deliver(posts, posts_text, posts_html, label="posts")
    except Exception as e:
        print(f"  Delivery error: {e} — falling back to file.")
        from delivery import deliver_file
        deliver_file(posts, posts_text, label="posts")

    # ── Summary ───────────────────────────────────────────────────────────────
    print(f"\n{'='*62}")
    n_li = len(posts.get("linkedin_posts", []))
    n_tw = len(posts.get("twitter_posts", []))
    print(f"  Done. {len(tweet_digest['items'])} tweets · {len(news_digest['items'])} news articles · {n_li} LinkedIn + {n_tw} X posts")
    print(f"{'='*62}\n")


if __name__ == "__main__":
    main()
