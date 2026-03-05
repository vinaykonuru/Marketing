"""Fetch tweets via the X API v2 — keyword search and monitored accounts."""

from datetime import datetime, timezone, timedelta

import requests

import config

_SEARCH_URL = "https://api.twitter.com/2/tweets/search/recent"
_TWEET_FIELDS = "created_at,author_id,public_metrics,text,entities"
_USER_FIELDS = "username,name"
_EXPANSIONS = "author_id"

# Max characters X allows in a single query string
_MAX_QUERY_LEN = 512


def _headers() -> dict:
    return {"Authorization": f"Bearer {config.X_BEARER_TOKEN}"}


def _start_time() -> str:
    dt = datetime.now(timezone.utc) - timedelta(hours=config.LOOKBACK_HOURS)
    return dt.strftime("%Y-%m-%dT%H:%M:%SZ")


def _chunk(lst: list, size: int):
    for i in range(0, len(lst), size):
        yield lst[i : i + size]


def _call_search(query: str, max_results: int = 100) -> tuple[list, dict]:
    """
    Call the recent search endpoint. Returns (tweets_list, users_map).
    Handles pagination up to ~500 results total.
    """
    params = {
        "query": query,
        "max_results": min(max_results, 100),
        "start_time": _start_time(),
        "tweet.fields": _TWEET_FIELDS,
        "expansions": _EXPANSIONS,
        "user.fields": _USER_FIELDS,
    }
    tweets, users_map = [], {}
    next_token = None

    while True:
        if next_token:
            params["next_token"] = next_token

        try:
            resp = requests.get(_SEARCH_URL, headers=_headers(), params=params, timeout=15)
            resp.raise_for_status()
        except requests.HTTPError as e:
            status = e.response.status_code if e.response else "?"
            print(f"    [warn] X API HTTP {status} for query '{query[:60]}': {e}")
            break
        except Exception as e:
            print(f"    [warn] X API error for query '{query[:60]}': {e}")
            break

        data = resp.json()

        # Accumulate users
        for u in data.get("includes", {}).get("users", []):
            users_map[u["id"]] = u

        # Accumulate tweets
        page_tweets = data.get("data", [])
        tweets.extend(page_tweets)

        # Stop if no more pages or we have enough
        meta = data.get("meta", {})
        next_token = meta.get("next_token")
        if not next_token or len(tweets) >= max_results:
            break

    return tweets, users_map


def _to_articles(tweets: list, users_map: dict) -> list[dict]:
    """Convert X tweet objects to the standard article dict."""
    articles = []
    for tweet in tweets:
        uid = tweet.get("author_id", "")
        user = users_map.get(uid, {})
        username = user.get("username", "unknown")
        display_name = user.get("name", username)

        text = tweet.get("text", "")
        tweet_id = tweet.get("id", "")
        url = f"https://x.com/{username}/status/{tweet_id}"

        created = tweet.get("created_at", "")
        try:
            dt = datetime.fromisoformat(created.replace("Z", "+00:00"))
            pub_str = dt.strftime("%Y-%m-%d %H:%M UTC")
        except Exception:
            pub_str = created

        metrics = tweet.get("public_metrics", {})
        likes = metrics.get("like_count", 0)
        retweets = metrics.get("retweet_count", 0)
        engagement = likes + retweets

        articles.append({
            "title": f"@{username}: {text[:120]}{'…' if len(text) > 120 else ''}",
            "url": url,
            "source": f"X · @{username} ({display_name})",
            "published": pub_str,
            "summary": text,
            "engagement": engagement,
        })
    return articles


# ── Public API ────────────────────────────────────────────────────────────────

def fetch_keyword_tweets() -> list[dict]:
    """
    Search X for the narrative keywords. Splits into batches if the
    combined query would exceed the 512-char limit.
    """
    queries = config.X_SEARCH_QUERIES
    suffix = " -is:retweet lang:en"

    # Try one combined query first
    combined = "(" + " OR ".join(f'"{q}"' for q in queries) + ")" + suffix
    batches = [combined] if len(combined) <= _MAX_QUERY_LEN else []

    if not batches:
        # Build sub-batches of 3 queries each
        for chunk in _chunk(queries, 3):
            q = "(" + " OR ".join(f'"{c}"' for c in chunk) + ")" + suffix
            batches.append(q)

    all_tweets, all_users = [], {}
    for q in batches:
        tweets, users = _call_search(q, max_results=50)
        all_tweets.extend(tweets)
        all_users.update(users)

    return _to_articles(all_tweets, all_users)


def fetch_account_tweets() -> list[dict]:
    """
    Fetch recent tweets from every account in X_MONITORED_ACCOUNTS.
    Batches accounts so each query stays under the 512-char limit.
    """
    accounts = [h.lstrip("@") for h in config.X_MONITORED_ACCOUNTS]
    if not accounts:
        return []

    # Each "from:handle" ≈ 7 + len(handle) chars; add " OR " (4 chars) between
    # Use batches of 15 accounts as a safe default
    all_tweets, all_users = [], {}
    for batch in _chunk(accounts, 15):
        from_parts = " OR ".join(f"from:{h}" for h in batch)
        query = f"({from_parts}) -is:retweet"

        # If still too long (very long handles), halve the batch
        if len(query) > _MAX_QUERY_LEN:
            for mini in _chunk(batch, 7):
                mini_q = "(" + " OR ".join(f"from:{h}" for h in mini) + ") -is:retweet"
                tweets, users = _call_search(mini_q, max_results=30)
                all_tweets.extend(tweets)
                all_users.update(users)
        else:
            tweets, users = _call_search(query, max_results=50)
            all_tweets.extend(tweets)
            all_users.update(users)

    return _to_articles(all_tweets, all_users)


def fetch_all_tweets() -> list[dict]:
    """
    Entry point: fetch keyword tweets + account tweets, deduplicated.
    Returns [] silently if X_BEARER_TOKEN is not set.
    """
    if not config.X_BEARER_TOKEN:
        print("    [skip] X_BEARER_TOKEN not set in .env — skipping X")
        return []

    seen: set[str] = set()
    results: list[dict] = []

    def add(articles):
        n = 0
        for a in articles:
            if a["url"] not in seen:
                seen.add(a["url"])
                results.append(a)
                n += 1
        return n

    kw = fetch_keyword_tweets()
    print(f"    Keyword search: {add(kw)} tweets")

    acct = fetch_account_tweets()
    print(f"    Account monitoring ({len(config.X_MONITORED_ACCOUNTS)} accounts): {add(acct)} tweets")

    return results
