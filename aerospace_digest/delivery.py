"""Deliver the digest via email (SMTP), Slack webhook, or local file."""

import json
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime, timezone

import requests

import config


# ── Email ─────────────────────────────────────────────────────────────────────

def deliver_email(digest: dict, text_body: str, html_body: str) -> None:
    missing = [k for k in ("SMTP_USER", "SMTP_PASSWORD", "EMAIL_TO") if not getattr(config, k)]
    if missing:
        raise ValueError(f"Missing email config: {', '.join(missing)}. Check your .env file.")

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Aerospace Manufacturing Digest — {digest['date']}"
    msg["From"] = config.EMAIL_FROM
    msg["To"] = config.EMAIL_TO
    msg.attach(MIMEText(text_body, "plain"))
    msg.attach(MIMEText(html_body, "html"))

    with smtplib.SMTP(config.SMTP_HOST, config.SMTP_PORT) as server:
        server.ehlo()
        server.starttls()
        server.login(config.SMTP_USER, config.SMTP_PASSWORD)
        server.sendmail(config.EMAIL_FROM, config.EMAIL_TO, msg.as_string())

    print(f"  Email sent to {config.EMAIL_TO}")


# ── Slack ─────────────────────────────────────────────────────────────────────

def _slack_post(payload: dict) -> None:
    resp = requests.post(config.SLACK_WEBHOOK_URL, json=payload, timeout=10)
    resp.raise_for_status()


def deliver_slack(digest: dict) -> None:
    if not config.SLACK_WEBHOOK_URL:
        raise ValueError("SLACK_WEBHOOK_URL not set. Check your .env file.")

    # Header message
    _slack_post({
        "blocks": [
            {
                "type": "header",
                "text": {"type": "plain_text", "text": f"Aerospace Manufacturing Digest — {digest['date']}"},
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": (
                        f"*{len(digest['items'])} articles* scored ≥{config.RELEVANCE_THRESHOLD}/10\n"
                        f"_Narrative: {digest['narrative']}_"
                    ),
                },
            },
            {"type": "divider"},
        ]
    })

    # One Slack message per article
    for i, item in enumerate(digest["items"], 1):
        score = item["relevance_score"]
        _slack_post({
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": (
                            f"*{i}. <{item['url']}|{item['headline']}>*\n"
                            f"_{item['source']}_ · Relevance: {score}/10\n\n"
                            f"{item['one_liner']}"
                        ),
                    },
                },
                {
                    "type": "context",
                    "elements": [
                        {
                            "type": "mrkdwn",
                            "text": f"💬 *Suggested caption:* _{item['caption']}_",
                        }
                    ],
                },
                {"type": "divider"},
            ]
        })

    print(f"  Digest sent to Slack ({len(digest['items'])} articles)")


# ── File ──────────────────────────────────────────────────────────────────────

def deliver_file(digest: dict, text_body: str, label: str = "digest") -> None:
    date_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    txt_path = f"{label}_{date_str}.txt"
    json_path = f"{label}_{date_str}.json"

    with open(txt_path, "w", encoding="utf-8") as f:
        f.write(text_body)
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(digest, f, indent=2, ensure_ascii=False)

    print(f"  Saved: {txt_path}")
    print(f"  Saved: {json_path}")


# ── Router ────────────────────────────────────────────────────────────────────

def deliver(digest: dict, text_body: str, html_body: str, label: str = "digest") -> None:
    method = config.DELIVERY_METHOD.lower()
    if method == "email":
        deliver_email(digest, text_body, html_body)
    elif method == "slack":
        deliver_slack(digest)
    elif method == "file":
        deliver_file(digest, text_body, label=label)
    else:
        print(f"  Unknown DELIVERY_METHOD '{method}' — saving to file.")
        deliver_file(digest, text_body, label=label)
