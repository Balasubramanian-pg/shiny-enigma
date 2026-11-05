"""The Mentalist Explorer - Databricks App
FastAPI Backend with Dual-Mode Data Layer (Databricks Unity Catalog + Local Fallback)
"""
import os
import csv
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, Request, Query, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI(title="The Mentalist Explorer", version="1.0.0")

# Setup directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")
STATIC_DIR = os.path.join(BASE_DIR, "static")
DATA_DIR = os.path.join(PROJECT_ROOT, "data")

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
templates = Jinja2Templates(directory=TEMPLATES_DIR)

# -----------------------------------------------------------------------------
# IN-MEMORY DATA CACHE (Startup Hydration)
# -----------------------------------------------------------------------------
DATA_CACHE: Dict[str, Any] = {
    "show": {},
    "shows": [],
    "seasons": [],
    "episodes": [],
    "characters": [],
    "season_cast": [],
    "awards": []
}

def load_data():
    """Hydrates cache from Unity Catalog SQL Warehouse if configured, else CSVs."""
    use_databricks = bool(os.getenv("DATABRICKS_HOST") and os.getenv("DATABRICKS_TOKEN"))
    
    if use_databricks:
        try:
            from databricks import sql
            print("Connecting to Databricks SQL Warehouse...")
            catalog = os.getenv("DATABRICKS_CATALOG", "main")
            schema = os.getenv("DATABRICKS_SCHEMA", "tvshows")
            conn = sql.connect(
                server_hostname=os.getenv("DATABRICKS_HOST"),
                http_path=os.getenv("DATABRICKS_HTTP_PATH"),
                access_token=os.getenv("DATABRICKS_TOKEN")
            )
            cursor = conn.cursor()
            
            for table in ["shows", "seasons", "episodes", "characters", "season_cast", "awards"]:
                cursor.execute(f"SELECT * FROM {catalog}.{schema}.{table}")
                cols = [desc[0] for desc in cursor.description]
                DATA_CACHE[table] = [dict(zip(cols, row)) for row in cursor.fetchall()]
            
            cursor.close()
            conn.close()
            DATA_CACHE["show"] = DATA_CACHE["shows"][0] if DATA_CACHE["shows"] else {}
            print("Successfully loaded datasets from Unity Catalog.")
            return
        except Exception as e:
            print(f"Databricks SQL connection failed, falling back to local files: {e}")

    # Local CSV Fallback
    print(f"Loading datasets from local CSV files in {DATA_DIR}...")
    for key, filename in [
        ("seasons", "seasons.csv"),
        ("episodes", "episodes.csv"),
        ("characters", "characters.csv"),
        ("season_cast", "season_cast.csv"),
        ("awards", "awards.csv")
    ]:
        p = os.path.join(DATA_DIR, filename)
        if os.path.exists(p):
            with open(p, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                DATA_CACHE[key] = list(reader)
        else:
            DATA_CACHE[key] = []

    show_p = os.path.join(DATA_DIR, "shows.csv")
    if os.path.exists(show_p):
        with open(show_p, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            rows = list(reader)
            DATA_CACHE["shows"] = rows
            DATA_CACHE["show"] = rows[0] if rows else {}

    # Cast numeric types for template formatting
    for s in DATA_CACHE["seasons"]:
        s["season_no"] = int(s["season_no"])
        s["episode_count"] = int(s["episode_count"])
        s["avg_viewers_m"] = float(s["avg_viewers_m"])
        s["avg_imdb_rating"] = float(s["avg_imdb_rating"])

    for ep in DATA_CACHE["episodes"]:
        ep["season_no"] = int(ep["season_no"])
        ep["episode_no"] = int(ep["episode_no"])
        ep["overall_no"] = int(ep["overall_no"])
        ep["us_viewers_m"] = float(ep["us_viewers_m"])
        ep["imdb_rating"] = float(ep["imdb_rating"])
        ep["imdb_votes"] = int(ep["imdb_votes"])

    print(f"Loaded {len(DATA_CACHE['episodes'])} episodes across {len(DATA_CACHE['seasons'])} seasons.")

@app.on_event("startup")
def startup_event():
    load_data()

# -----------------------------------------------------------------------------
# HELPERS
# -----------------------------------------------------------------------------
def get_global_context(current_page: str):
    return {
        "current_page": current_page,
        "show": DATA_CACHE["show"],
        "seasons_count": len(DATA_CACHE["seasons"]),
        "episodes_count": len(DATA_CACHE["episodes"]),
    }

# -----------------------------------------------------------------------------
# ROUTES
# -----------------------------------------------------------------------------
@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    """Screen 1: Home Screen with Hero, KPIs, Seasons Sparkline Grid, Milestones, Cast."""
    ctx = get_global_context("home")
    
    # Calculate sparklines (ratings per episode per season)
    seasons_with_sparklines = []
    for s in DATA_CACHE["seasons"]:
        s_no = s["season_no"]
        eps = [e for e in DATA_CACHE["episodes"] if e["season_no"] == s_no]
        ratings = [e["imdb_rating"] for e in eps]
        
        # Min/max normalization for 24px sparkline heights
        min_r, max_r = 7.0, 9.5
        spark_bars = []
        for r in ratings:
            pct = max(10, min(100, int(((r - min_r) / (max_r - min_r)) * 100)))
            spark_bars.append({"rating": r, "height_pct": pct})
            
        s_copy = dict(s)
        s_copy["spark_bars"] = spark_bars
        seasons_with_sparklines.append(s_copy)

    # Milestones
    first_ep = next((e for e in DATA_CACHE["episodes"] if e["overall_no"] == 1), None)
    ep_100 = next((e for e in DATA_CACHE["episodes"] if e["overall_no"] == 100), None)
    ep_124_red_john = next((e for e in DATA_CACHE["episodes"] if e["episode_id"] == "tm_s06e08"), None)
    final_ep = next((e for e in DATA_CACHE["episodes"] if e["overall_no"] == len(DATA_CACHE["episodes"])), None)

    milestones = [
        {"label": "FIRST EPISODE", "title": first_ep["title"] if first_ep else "Pilot", "sub": "Red John introduction"},
        {"label": "EPISODE 100", "title": ep_100["title"] if ep_100 else "The Crimson Ticket", "sub": "Centennial milestone"},
        {"label": "RED JOHN UNMASKED", "title": ep_124_red_john["title"] if ep_124_red_john else "Red John", "sub": "The 6-season climax"},
        {"label": "SERIES FINALE", "title": final_ep["title"] if final_ep else "White Orchids", "sub": "Jane & Lisbon's wedding"}
    ]

    ctx.update({
        "seasons": seasons_with_sparklines,
        "milestones": milestones,
        "characters": DATA_CACHE["characters"][:14]
    })
    return templates.TemplateResponse("home.html", {"request": request, **ctx})

@app.get("/episodes", response_class=HTMLResponse)
async def episodes_view(
    request: Request,
    season: int = Query(1, ge=1, le=7),
    sort: str = Query("order", pattern="^(order|highest|watched)$")
):
    """Screen 2: Episodes Explorer with Season tabs, sorting, and Viewers bar chart."""
    ctx = get_global_context("episodes")
    
    current_season = next((s for s in DATA_CACHE["seasons"] if s["season_no"] == season), DATA_CACHE["seasons"][0])
    season_episodes = [e for e in DATA_CACHE["episodes"] if e["season_no"] == season]

    # Max viewers in season for progress bar normalization
    max_viewers = max([e["us_viewers_m"] for e in season_episodes]) if season_episodes else 20.0
    top_rated_ep = max(season_episodes, key=lambda x: x["imdb_rating"]) if season_episodes else None
    most_watched_ep = max(season_episodes, key=lambda x: x["us_viewers_m"]) if season_episodes else None

    # Sorting
    if sort == "highest":
        season_episodes_sorted = sorted(season_episodes, key=lambda x: x["imdb_rating"], reverse=True)
    elif sort == "watched":
        season_episodes_sorted = sorted(season_episodes, key=lambda x: x["us_viewers_m"], reverse=True)
    else:
        season_episodes_sorted = sorted(season_episodes, key=lambda x: x["episode_no"])

    # Prepare chart bars
    chart_bars = []
    for e in sorted(season_episodes, key=lambda x: x["episode_no"]):
        h_pct = int((e["us_viewers_m"] / max_viewers) * 100)
        is_top = (top_rated_ep and e["episode_id"] == top_rated_ep["episode_id"])
        chart_bars.append({
            "episode_no": e["episode_no"],
            "episode_id": e["episode_id"],
            "title": e["title"],
            "viewers": e["us_viewers_m"],
            "rating": e["imdb_rating"],
            "height_pct": h_pct,
            "is_top_rated": is_top
        })

    ctx.update({
        "all_seasons": DATA_CACHE["seasons"],
        "selected_season": current_season,
        "selected_season_no": season,
        "sort": sort,
        "episodes": season_episodes_sorted,
        "chart_bars": chart_bars,
        "top_rated_ep": top_rated_ep,
        "most_watched_ep": most_watched_ep,
        "max_viewers": max_viewers
    })
    return templates.TemplateResponse("episodes.html", {"request": request, **ctx})

@app.get("/episodes/{episode_id}", response_class=HTMLResponse)
async def episode_detail(request: Request, episode_id: str):
    """Screen 3: Episode Detail with 4 KPI metrics, interactive season bar chart, credits."""
    ctx = get_global_context("episodes")
    
    ep = next((e for e in DATA_CACHE["episodes"] if e["episode_id"] == episode_id), None)
    if not ep:
        raise HTTPException(status_code=404, detail="Episode not found")

    s_no = ep["season_no"]
    season_episodes = sorted([e for e in DATA_CACHE["episodes"] if e["season_no"] == s_no], key=lambda x: x["episode_no"])
    max_viewers = max([e["us_viewers_m"] for e in season_episodes]) if season_episodes else 20.0

    # Build season bar chart
    chart_bars = []
    for item in season_episodes:
        h_pct = int((item["us_viewers_m"] / max_viewers) * 100)
        is_current = (item["episode_id"] == episode_id)
        chart_bars.append({
            "episode_no": item["episode_no"],
            "episode_id": item["episode_id"],
            "title": item["title"],
            "viewers": item["us_viewers_m"],
            "rating": item["imdb_rating"],
            "height_pct": h_pct,
            "is_current": is_current
        })

    # Previous and Next
    overall = ep["overall_no"]
    prev_ep = next((e for e in DATA_CACHE["episodes"] if e["overall_no"] == overall - 1), None)
    next_ep = next((e for e in DATA_CACHE["episodes"] if e["overall_no"] == overall + 1), None)

    ctx.update({
        "episode": ep,
        "season_episodes_count": len(season_episodes),
        "chart_bars": chart_bars,
        "prev_ep": prev_ep,
        "next_ep": next_ep
    })
    return templates.TemplateResponse("episode_detail.html", {"request": request, **ctx})

@app.get("/compare", response_class=HTMLResponse)
async def compare_episodes(
    request: Request,
    ep1: Optional[str] = Query("tm_s03e24"),
    ep2: Optional[str] = Query("tm_s06e08")
):
    """Screen 4: Head-to-Head Episode Comparison Scorecard."""
    ctx = get_global_context("episodes")
    
    episode_1 = next((e for e in DATA_CACHE["episodes"] if e["episode_id"] == ep1), DATA_CACHE["episodes"][0])
    episode_2 = next((e for e in DATA_CACHE["episodes"] if e["episode_id"] == ep2), DATA_CACHE["episodes"][-1])

    # Comparison metrics with automatic winner detection
    scorecard = [
        {
            "label": "IMDb rating",
            "val1": f"{episode_1['imdb_rating']:.1f}",
            "val2": f"{episode_2['imdb_rating']:.1f}",
            "winner": 1 if episode_1['imdb_rating'] > episode_2['imdb_rating'] else (2 if episode_2['imdb_rating'] > episode_1['imdb_rating'] else 0)
        },
        {
            "label": "IMDb votes",
            "val1": f"{episode_1['imdb_votes']:,}",
            "val2": f"{episode_2['imdb_votes']:,}",
            "winner": 1 if episode_1['imdb_votes'] > episode_2['imdb_votes'] else (2 if episode_2['imdb_votes'] > episode_1['imdb_votes'] else 0)
        },
        {
            "label": "US viewers",
            "val1": f"{episode_1['us_viewers_m']:.2f}M",
            "val2": f"{episode_2['us_viewers_m']:.2f}M",
            "winner": 1 if episode_1['us_viewers_m'] > episode_2['us_viewers_m'] else (2 if episode_2['us_viewers_m'] > episode_1['us_viewers_m'] else 0)
        },
        {
            "label": "Rank in season",
            "val1": f"{episode_1['season_viewer_rank']} of {len([e for e in DATA_CACHE['episodes'] if e['season_no'] == episode_1['season_no']])}",
            "val2": f"{episode_2['season_viewer_rank']} of {len([e for e in DATA_CACHE['episodes'] if e['season_no'] == episode_2['season_no']])}",
            "winner": 1 if episode_1['season_viewer_rank'] < episode_2['season_viewer_rank'] else (2 if episode_2['season_viewer_rank'] < episode_1['season_viewer_rank'] else 0)
        },
        {
            "label": "Directed by",
            "val1": episode_1["directed_by"],
            "val2": episode_2["directed_by"],
            "winner": 0
        },
        {
            "label": "Written by",
            "val1": episode_1["written_by"],
            "val2": episode_2["written_by"],
            "winner": 0
        }
    ]

    ctx.update({
        "all_episodes": DATA_CACHE["episodes"],
        "ep1": episode_1,
        "ep2": episode_2,
        "scorecard": scorecard
    })
    return templates.TemplateResponse("compare.html", {"request": request, **ctx})

@app.get("/characters", response_class=HTMLResponse)
async def characters_view(request: Request):
    """Screen 5: Characters, Factions, and Organizational Structure."""
    ctx = get_global_context("characters")
    
    # Group characters by household / faction
    households = {}
    for char in DATA_CACHE["characters"]:
        hh = char["household"]
        if hh not in households:
            households[hh] = []
        households[hh].append(char)

    ctx.update({
        "households": households,
        "all_characters": DATA_CACHE["characters"]
    })
    return templates.TemplateResponse("characters.html", {"request": request, **ctx})

@app.get("/awards", response_class=HTMLResponse)
async def awards_view(request: Request, tab: str = Query("all")):
    """Screen 6: Awards, Nominations Timeline & Acting Honors."""
    ctx = get_global_context("awards")
    
    # Wins by year (stacked: Major Awards vs Industry/Guilds)
    years = range(2008, 2016)
    wins_by_year = []
    for y in years:
        major = len([a for a in DATA_CACHE["awards"] if a["year"] == y and a["result"] == "Won" and a["award_body"] in ["People's Choice Awards", "Golden Globe Awards", "Primetime Emmy Awards"]])
        guild = len([a for a in DATA_CACHE["awards"] if a["year"] == y and a["result"] == "Won" and a["award_body"] not in ["People's Choice Awards", "Golden Globe Awards", "Primetime Emmy Awards"]])
        wins_by_year.append({"year": y, "major": major, "guild": guild, "total": major + guild})

    acting_honors = [
        {
            "actor": "Simon Baker",
            "role": "Lead Actor as Patrick Jane",
            "honors": "Emmy, Golden Globe & SAG Nominee",
            "years": "2009, 2010"
        },
        {
            "actor": "Robin Tunney",
            "role": "Senior Agent as Teresa Lisbon",
            "honors": "People's Choice Nominee",
            "years": "2011, 2014"
        },
        {
            "actor": "Pruitt Taylor Vince",
            "role": "Guest Actor as J.J. LaRoche",
            "honors": "Critics Pick Recognition",
            "years": "2011"
        }
    ]

    ctx.update({
        "awards": DATA_CACHE["awards"],
        "wins_by_year": wins_by_year,
        "acting_honors": acting_honors,
        "tab": tab
    })
    return templates.TemplateResponse("awards.html", {"request": request, **ctx})

@app.get("/about", response_class=HTMLResponse)
async def about_view(request: Request):
    """Screen 7: Architecture, 5-Tier Databricks Stack, Live DBML & Live Motion ER Diagram."""
    ctx = get_global_context("about")
    
    # Live row counts
    row_counts = {
        "shows": len(DATA_CACHE["shows"]) if DATA_CACHE.get("shows") else (1 if DATA_CACHE.get("show") else 0),
        "seasons": len(DATA_CACHE["seasons"]),
        "episodes": len(DATA_CACHE["episodes"]),
        "characters": len(DATA_CACHE["characters"]),
        "season_cast": len(DATA_CACHE["season_cast"]),
        "awards": len(DATA_CACHE["awards"])
    }

    # DBML Code Representation for interactive inspector
    dbml_code = """// Database Markup Language (DBML)
// The Mentalist Explorer - Unity Catalog Schema: main.tvshows

Table shows {
  show_id varchar [pk]
  title varchar [not null]
  network varchar
  first_aired date
  last_aired date
  episode_count int
  season_count int
  peak_viewers_season int
  peak_viewers_m double
  highest_rated_episode_id varchar
  highest_imdb_rating double
}

Table seasons {
  season_no int [pk]
  show_id varchar [ref: > shows.show_id]
  year_start int
  year_end int
  episode_count int
  avg_viewers_m double
  avg_imdb_rating double
  rank_us_shows int
  top_rated_episode_id varchar [ref: > episodes.episode_id]
}

Table episodes {
  episode_id varchar [pk]
  show_id varchar [ref: > shows.show_id]
  season_no int [ref: > seasons.season_no]
  episode_no int
  overall_no int
  title varchar [not null]
  air_date date
  us_viewers_m double
  imdb_rating double
  imdb_votes int
  directed_by varchar
  written_by varchar
}

Table characters {
  character_id varchar [pk]
  show_id varchar [ref: > shows.show_id]
  name varchar [not null]
  actor varchar
  household varchar
  generation varchar
  seasons_active varchar
}

Table season_cast {
  season_cast_id varchar [pk]
  character_id varchar [ref: > characters.character_id]
  season_no int [ref: > seasons.season_no]
  actor varchar
  role_type varchar
}

Table awards {
  award_id varchar [pk]
  show_id varchar [ref: > shows.show_id]
  episode_id varchar [ref: > episodes.episode_id]
  year int
  award_body varchar
  category varchar
  result varchar
}

// Relational Mappings
Ref: shows.show_id < seasons.show_id
Ref: shows.show_id < characters.show_id
Ref: seasons.season_no < episodes.season_no
Ref: characters.character_id < season_cast.character_id
Ref: seasons.season_no < season_cast.season_no
Ref: episodes.episode_id < awards.episode_id
"""

    ctx.update({
        "row_counts": row_counts,
        "dbml_code": dbml_code,
        "system_status": {
            "catalog": "main",
            "schema": "tvshows",
            "runtime": "Databricks Apps (Serverless Python 3.11)",
            "warehouse": "Databricks Serverless SQL Warehouse",
            "storage_layer": "Delta Lake 3.2.0 (Unity Catalog Managed)",
            "volume_path": "/Volumes/main/tvshows/images"
        }
    })
    return templates.TemplateResponse("about.html", {"request": request, **ctx})

@app.get("/contact", response_class=HTMLResponse)
async def contact_view(request: Request):
    """Contact & feedback view."""
    ctx = get_global_context("contact")
    return templates.TemplateResponse("contact.html", {"request": request, **ctx})

# -----------------------------------------------------------------------------
# API ENDPOINTS
# -----------------------------------------------------------------------------
@app.get("/api/search")
async def api_search(q: str = Query("", min_length=1)):
    """Full-text search across episodes, characters, and writers."""
    query = q.lower().strip()
    matched_episodes = [
        {"type": "Episode", "title": e["title"], "season": e["season_no"], "episode": e["episode_no"], "url": f"/episodes/{e['episode_id']}"}
        for e in DATA_CACHE["episodes"]
        if query in e["title"].lower() or query in e["synopsis"].lower() or query in e["written_by"].lower()
    ]
    matched_chars = [
        {"type": "Character", "title": c["name"], "season": c["household"], "url": "/characters"}
        for c in DATA_CACHE["characters"]
        if query in c["name"].lower() or query in c["actor"].lower() or query in c["bio"].lower()
    ]
    return JSONResponse(content={"results": matched_episodes[:10] + matched_chars[:5]})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
