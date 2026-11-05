"""IMDb and Wikipedia scraper for The Mentalist (tt1196946).
Designed for non-commercial educational and analytical purposes.
Fetches episode ratings, vote counts, cast credits, and storyline summaries.
"""
import requests
from bs4 import BeautifulSoup
import json
import time
import os

IMDB_ID = "tt1196946"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9"
}

def fetch_season_episodes(season_num: int):
    """Fetch episode listing for a specific season from IMDb."""
    url = f"https://www.imdb.com/title/{IMDB_ID}/episodes?season={season_num}"
    print(f"Fetching Season {season_num} from {url}...")
    try:
        resp = requests.get(url, headers=HEADERS, timeout=10)
        if resp.status_code != 200:
            print(f"Failed to fetch season {season_num}: status {resp.status_code}")
            return []
        
        soup = BeautifulSoup(resp.text, "html.parser")
        episodes = []
        
        # Parse episode cards
        cards = soup.find_all("article", class_=lambda x: x and "episode-item-wrapper" in x) or soup.find_all("div", class_="list_item")
        for card in cards:
            title_elem = card.find("h4") or card.find("a", itemprop="name")
            rating_elem = card.find("span", class_="ipl-rating-star__rating") or card.find("span", class_="ipc-rating-star--rating")
            desc_elem = card.find("div", class_="item_description") or card.find("div", class_="ipc-html-content-inner-div")
            
            title = title_elem.text.strip() if title_elem else "Unknown"
            rating = float(rating_elem.text.strip()) if rating_elem and rating_elem.text.strip() else None
            desc = desc_elem.text.strip() if desc_elem else ""
            
            episodes.append({
                "season": season_num,
                "title": title,
                "rating": rating,
                "description": desc
            })
        return episodes
    except Exception as e:
        print(f"Error fetching season {season_num}: {e}")
        return []

def main():
    print(f"Starting IMDb Enrichment Scraper for The Mentalist ({IMDB_ID})...")
    all_episodes = []
    for s in range(1, 8):
        eps = fetch_season_episodes(s)
        all_episodes.extend(eps)
        time.sleep(1) # respectful polite rate limit
    
    out_file = "data/scraped_episodes.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(all_episodes, f, indent=2)
    print(f"Scraped {len(all_episodes)} episodes and cached to {out_file}")

if __name__ == "__main__":
    main()
