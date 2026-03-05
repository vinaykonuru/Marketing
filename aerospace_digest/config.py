"""Central configuration — all tunable settings in one place."""

import os
from dotenv import load_dotenv

load_dotenv()

# ── Narrative & scoring ───────────────────────────────────────────────────────

NARRATIVE = (
    "We need to scale distributed manufacturing to support innovation and development "
    "in the US — ground systems infrastructure for aerospace, basic energy infrastructure, "
    "and cryogenic infrastructure for fusion and advanced energy."
)

TARGET_TOPICS = [
    # Distributed manufacturing & industrial scale
    "distributed manufacturing networks and decentralized production",
    "US domestic manufacturing capacity expansion and reshoring",
    "advanced manufacturing investment, factory expansions, production rate changes",
    "manufacturing technology, automation, robotics, and digitization",
    "workforce: hiring, labor shortages, apprenticeships, training programs",
    "supply chain constraints, supplier health, and industrial base resilience",
    # Aerospace ground systems infrastructure
    "aerospace ground systems: launch infrastructure, ground support equipment, test facilities",
    "missile and rocket production capacity, solid rocket motor supply chain",
    "satellite manufacturing and space vehicle production rates",
    "defense production bottlenecks, schedule slippage, order backlogs",
    # Energy infrastructure
    "electric grid expansion, transmission buildout, and energy infrastructure investment",
    "power generation capacity: nuclear, natural gas, renewables buildout",
    "energy supply chain and equipment manufacturing (transformers, turbines, reactors)",
    "data center power infrastructure and industrial energy demand",
    # Cryogenic & fusion infrastructure
    "fusion energy development, tokamak construction, ITER, commercial fusion programs",
    "cryogenic systems manufacturing, superconducting magnet production",
    "advanced nuclear: SMRs, fission manufacturing supply chain",
    # Industrial policy & capital
    "industrial policy: IRA, CHIPS Act, DoD manufacturing investment, DARPA programs",
    "venture and private equity investment in deep tech, hard tech, manufacturing startups",
    "facility investments, capital expenditure, greenfield manufacturing sites",
]

# Minimum relevance score (0–10) to include an item in the digest
RELEVANCE_THRESHOLD = 5

# Max items in the news digest (after relevance filtering)
MAX_ARTICLES_IN_DIGEST = 10

# Max tweets in the X digest (sorted by engagement, no filtering)
MAX_TWEETS_IN_DIGEST = 20

# Max tweets from any single account in the digest (prevents one account dominating)
MAX_TWEETS_PER_ACCOUNT = 3

# How far back to look (hours)
LOOKBACK_HOURS = 24

# ── X (Twitter) ───────────────────────────────────────────────────────────────

# Keyword queries — searched across all of X (last 24h, no retweets)
X_SEARCH_QUERIES = [
    "distributed manufacturing",
    "aerospace manufacturing capacity",
    "defense supply chain",
    "cryogenic infrastructure",
    "fusion manufacturing",
    "energy infrastructure buildout",
    "aerospace ground systems",
    "US manufacturing scale",
    "advanced manufacturing investment",
    "reshoring manufacturing",
]

# Monitored accounts — ALL tweets from these handles are fetched and scored
# Irrelevant tweets are filtered out by Claude's relevance scoring
X_MONITORED_ACCOUNTS = [
    # Aerospace & Defense
    # "elonmusk" removed — high volume, mostly off-topic; surfaces via keyword search when relevant
    "gwynne_shotwell",    # SpaceX President
    "KathyLueders",       # NASA
    "SenBillNelson",      # NASA Administrator
    "ToryBrunoULA",       # ULA CEO
    "Peter_J_Beck",       # Rocket Lab CEO
    "ChrisQuilty",        # Space Capital
    "MandyMayfield",      # Defense
    "MikeGriffinDC",      # former NASA/DoD
    "ChadAnderson",       # Space Capital
    "LoriGarver",         # former NASA Deputy Admin
    "SciGuySpace",        # Eric Berger, Ars Technica
    "thesheetztweetz",    # CNBC space reporter
    # Energy
    "DanielYergin",       # Energy historian/analyst
    "fbirol",             # IEA Executive Director
    "jigar_shah",         # DOE Loan Programs
    "VarunSivaram",       # Energy policy
    "KingsmillBond",      # Clean energy analyst
    "ramez",              # Energy futurist
    "JesseJenkins",       # Princeton energy researcher
    "drvolts",            # Energy/climate journalist
    "shaylekann",         # Energy Impact Partners
    "jjacobs22",          # My Climate Journey
    "NatBullard",         # BloombergNEF
    "mzjacobson",         # Stanford energy
    "MLiebreich",         # BloombergNEF founder
    "chrisnelder",        # Energy analyst
    # Data Centers & Cloud/AI Infrastructure
    "sama",               # OpenAI (Sam Altman)
    "ericschmidt",        # Former Google CEO
    "jenhsunhuang",       # NVIDIA CEO
    "satyanadella",       # Microsoft CEO
    "ajassy",             # Amazon/AWS CEO
    "ThomasKurian",       # Google Cloud CEO
    "PGelsinger",         # Former Intel CEO
    "ArvindKrishna_",     # IBM CEO
    "zhamakd",            # Data architecture
    "QuinnyPig",          # AWS/cloud analyst
    "benthompson",        # Stratechery
    "Werner",             # Amazon CTO
    "kelseyhightower",    # Google, cloud/infra
    # Venture & Cross-Sector
    "ttunguz",            # Theory Ventures
    "packyM",             # Not Boring
    "chamath",            # Social Capital
    "peterthiel",         # Founders Fund
    "pmarca",             # a16z
    "david_cahn_",        # Sequoia, AI/data centers
    "PalmerLuckey",       # Anduril founder
    "traestephens",       # Anduril / Founders Fund
    "JTLonsdale",         # 8VC, Palantir co-founder
    "alexkarp",           # Palantir CEO
]

# ── Google News RSS search queries ───────────────────────────────────────────

SEARCH_QUERIES = [
    # Aerospace manufacturing
    "aerospace manufacturing capacity",
    "defense production bottleneck",
    "aircraft manufacturing supply chain",
    "missile production capacity",
    "aerospace ground systems infrastructure",
    "satellite manufacturing demand",
    # Energy infrastructure
    "energy infrastructure buildout",
    "electric grid expansion manufacturing",
    "power generation capacity investment",
    "data center energy infrastructure",
    # Fusion & cryogenic
    "fusion energy manufacturing",
    "cryogenic infrastructure fusion",
    "commercial fusion reactor construction",
    "superconducting magnet manufacturing",
    # Distributed manufacturing & policy
    "distributed manufacturing US",
    "advanced manufacturing investment reshoring",
    "US industrial base expansion",
    "manufacturing workforce training",
]

# ── Aerospace publication RSS feeds ──────────────────────────────────────────

RSS_FEEDS = [
    # Aerospace & Defense
    {
        "name": "Aviation Week",
        "url": "https://aviationweek.com/rss.xml",
    },
    {
        "name": "Defense News",
        "url": "https://www.defensenews.com/arc/outboundfeeds/rss/?outputType=xml",
    },
    {
        "name": "Space News",
        "url": "https://spacenews.com/feed/",
    },
    {
        "name": "Breaking Defense",
        "url": "https://breakingdefense.com/feed/",
    },
    {
        "name": "The War Zone",
        "url": "https://www.thedrive.com/the-war-zone/rss",
    },
    {
        "name": "Aerospace Manufacturing",
        "url": "https://www.aero-mag.com/feed/",
    },
    {
        "name": "Reuters Industrials",
        "url": "https://feeds.reuters.com/reuters/industrialsNews",
    },
    # Energy & Grid Infrastructure
    {
        "name": "Canary Media",
        "url": "https://www.canarymedia.com/rss",
    },
    {
        "name": "Utility Dive",
        "url": "https://www.utilitydive.com/feeds/news/",
    },
    {
        "name": "Energy Monitor",
        "url": "https://www.energymonitor.ai/feed/",
    },
    # Fusion & Advanced Nuclear
    {
        "name": "Fusion Industry Association",
        "url": "https://www.fusionindustryassociation.org/feed/",
    },
    {
        "name": "Nuclear Engineering International",
        "url": "https://www.neimagazine.com/rss",
    },
    # Advanced Manufacturing & Industrial Policy
    {
        "name": "IndustryWeek",
        "url": "https://www.industryweek.com/rss/all",
    },
    {
        "name": "Manufacturing Dive",
        "url": "https://www.manufacturingdive.com/feeds/news/",
    },
]

# ── Claude model ─────────────────────────────────────────────────────────────

CLAUDE_MODEL = "claude-opus-4-6"

# ── API keys ─────────────────────────────────────────────────────────────────

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
X_BEARER_TOKEN = os.getenv("X_BEARER_TOKEN")          # X API v2 Bearer Token
SERPER_API_KEY = os.getenv("SERPER_API_KEY")           # optional

# ── Delivery ─────────────────────────────────────────────────────────────────

DELIVERY_METHOD = os.getenv("DELIVERY_METHOD", "file")  # email | slack | file

# Email (SMTP)
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
EMAIL_FROM = os.getenv("EMAIL_FROM") or os.getenv("SMTP_USER")
EMAIL_TO = os.getenv("EMAIL_TO")

# Slack
SLACK_WEBHOOK_URL = os.getenv("SLACK_WEBHOOK_URL")
