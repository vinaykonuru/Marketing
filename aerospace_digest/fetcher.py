"""Fetch articles from X (Twitter), Google News RSS, and aerospace publication feeds."""

import html
import re
import time
from datetime import datetime, timezone, timedelta
from urllib.parse import quote_plus

import feedparser
import requests

import config


# ── Helpers ───────────────────────────────────────────────────────────────────

def _clean_html(text: str) -> str:
    """Strip HTML tags, decode entities, and collapse whitespace."""
    text = re.sub(r"<[^>]+>", " ", text or "")
    text = html.unescape(text)
    return re.sub(r"\s+", " ", text).strip()


def _entry_published_dt(entry) -> datetime | None:
    """Return a UTC datetime for a feedparser entry, or None if unparseable."""
    raw = entry.get("published_parsed") or entry.get("updated_parsed")
    if raw:
        try:
            return datetime.fromtimestamp(time.mktime(raw), tz=timezone.utc)
        except (OSError, OverflowError):
            pass
    return None


def _is_recent(entry, hours: int) -> bool:
    dt = _entry_published_dt(entry)
    if dt is None:
        return True  # include if date unknown
    cutoff = datetime.now(timezone.utc) - timedelta(hours=hours)
    return dt >= cutoff


def _entry_to_article(entry, source_name: str) -> dict:
    dt = _entry_published_dt(entry)
    pub_str = dt.strftime("%Y-%m-%d %H:%M UTC") if dt else "Unknown"
    summary = _clean_html(entry.get("summary") or entry.get("description") or "")
    return {
        "title": _clean_html(entry.get("title", "Untitled")),
        "url": entry.get("link", ""),
        "source": source_name,
        "published": pub_str,
        "summary": summary[:600],
    }


# ── Google News RSS ───────────────────────────────────────────────────────────

def fetch_google_news_rss(query: str) -> list[dict]:
    """Fetch recent articles from Google News RSS for a search query."""
    encoded = quote_plus(query)
    url = f"https://news.google.com/rss/search?q={encoded}&hl=en-US&gl=US&ceid=US:en"
    try:
        feed = feedparser.parse(url, request_headers={"User-Agent": "Mozilla/5.0"})
        articles = []
        for entry in feed.entries:
            if _is_recent(entry, config.LOOKBACK_HOURS):
                source = entry.get("source", {}).get("title", "Google News")
                articles.append(_entry_to_article(entry, source))
        return articles
    except Exception as e:
        print(f"    [warn] Google News RSS '{query}': {e}")
        return []


# ── Serper (optional enrichment) ──────────────────────────────────────────────

def fetch_serper_news(query: str) -> list[dict]:
    """Fetch recent news via Serper API (requires SERPER_API_KEY)."""
    if not config.SERPER_API_KEY:
        return []
    try:
        resp = requests.post(
            "https://google.serper.dev/news",
            json={"q": query, "num": 10, "tbs": "qdr:d"},
            headers={"X-API-KEY": config.SERPER_API_KEY, "Content-Type": "application/json"},
            timeout=10,
        )
        resp.raise_for_status()
        articles = []
        for item in resp.json().get("news", []):
            articles.append({
                "title": item.get("title", ""),
                "url": item.get("link", ""),
                "source": item.get("source", "Serper"),
                "published": item.get("date", "Unknown"),
                "summary": item.get("snippet", "")[:600],
            })
        return articles
    except Exception as e:
        print(f"    [warn] Serper query '{query}': {e}")
        return []


# ── Publication RSS feeds ─────────────────────────────────────────────────────

def fetch_rss_feed(feed_config: dict) -> list[dict]:
    """Fetch recent articles from a named RSS feed."""
    try:
        feed = feedparser.parse(
            feed_config["url"],
            request_headers={"User-Agent": "Mozilla/5.0"},
        )
        articles = []
        for entry in feed.entries:
            if _is_recent(entry, config.LOOKBACK_HOURS):
                articles.append(_entry_to_article(entry, feed_config["name"]))
        return articles
    except Exception as e:
        print(f"    [warn] {feed_config['name']}: {e}")
        return []


# ── Main entry point ──────────────────────────────────────────────────────────

def fetch_tweets() -> list[dict]:
    """Fetch all recent tweets from X (keyword search + monitored accounts)."""
    from x_fetcher import fetch_all_tweets
    print("  Fetching from X (Twitter)...")
    tweets = fetch_all_tweets()
    print(f"    → {len(tweets)} unique tweets")
    return tweets


def fetch_news() -> list[dict]:
    """Fetch recent articles from Google News RSS and publication feeds."""
    articles: list[dict] = []
    seen_urls: set[str] = set()

    def add_unique(new_articles: list[dict]) -> int:
        added = 0
        for a in new_articles:
            url = a.get("url", "")
            if url and url not in seen_urls:
                seen_urls.add(url)
                articles.append(a)
                added += 1
        return added

    print("  Searching Google News RSS...")
    gn_total = 0
    for query in config.SEARCH_QUERIES:
        gn_total += add_unique(fetch_google_news_rss(query))
    print(f"    → {gn_total} unique articles from Google News")

    if config.SERPER_API_KEY:
        print("  Searching via Serper API...")
        serper_total = 0
        for query in config.SEARCH_QUERIES[:5]:
            serper_total += add_unique(fetch_serper_news(query))
        print(f"    → {serper_total} unique articles from Serper")

    print("  Fetching aerospace publication RSS feeds...")
    for feed_config in config.RSS_FEEDS:
        n = add_unique(fetch_rss_feed(feed_config))
        print(f"    {feed_config['name']}: {n} recent article(s)")

    print(f"    → {len(articles)} unique news articles total")
    return articles


def fetch_all_articles() -> list[dict]:
    """Legacy combined fetch (tweets + news). Kept for backward compatibility."""
    tweets = fetch_tweets()
    news = fetch_news()
    seen: set[str] = set()
    combined = []
    for a in tweets + news:
        url = a.get("url", "")
        if url and url not in seen:
            seen.add(url)
            combined.append(a)
    return combined
