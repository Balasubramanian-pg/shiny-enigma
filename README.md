# The Mentalist Explorer (Databricks App)

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![React 19](https://img.shields.io/badge/Components-React%2019%20%2B%20TypeScript-61DAFB.svg)](https://react.dev/)
[![Databricks Apps](https://img.shields.io/badge/Platform-Databricks%20Apps-FF3621.svg)](https://docs.databricks.com/en/dev-tools/databricks-apps/index.html)
[![Unity Catalog](https://img.shields.io/badge/Storage-Unity%20Catalog%20%26%20Delta-00A4EF.svg)](https://www.databricks.com/product/unity-catalog)

An editorial-grade, data-driven analytical web application recreating the **Databricks TV Show Explorer** architecture for CBS's iconic procedural drama **[The Mentalist](https://www.imdb.com/title/tt1196946/)** (7 Seasons, 151 Episodes).

Built natively for **Databricks Apps** on Delta Lake in **Unity Catalog**, with fallback local execution and automated testing via **GitHub Actions**.

---

## 🎨 Design System & Typography Upgrades

* **Headings:** **Afacad Semibold** (`font-family: 'Afacad', sans-serif; font-weight: 600;`)
* **Body Text:** **Afacad Normal Light** (`font-family: 'Afacad', sans-serif; font-weight: 400;`)
* **Signature Accent:** **Red John Blood Red** (`#C8102E`) & **Obsidian CBI Slate** (`#0E1013`)
* **No Emojis:** Strictly semantic inline SVG icons across all layers, sidebars, and stat banners.
* **Tactile Feedback & Motion Physics:** 
  * Spring bounce on button and tab clicks (`transform: scale(0.96)`).
  * Floating Action Feedback Toast delivering instant visual confirmation for user actions (switching themes, filtering seasons, comparing episodes, copying DBML).
  * Smooth SVG sparklines, glowing chart col highlights, and character image hover zooms.

---

## 📸 Key Features & Screens

1. **Screen 1: Home Dashboard (`/`)**
   * High-level series KPIs, hero banner, interactive CBI/Red John face hover tags.
   * Real actor portraits for Patrick Jane, Teresa Lisbon, Kimball Cho, Grace Van Pelt, and Red John.
   * Seasons 01–07 matrix with **embedded rating sparklines** and hover-flip storyline synopses.
   * Series milestone cards (Pilot, Episode 100, Red John Unmasked, Series Finale).
2. **Screen 2: Episodes Explorer (`/episodes`)**
   * Segmented season selector tabs (Season 1 to Season 7).
   * Tri-mode sorting: *Episode order*, *Highest rated*, *Most watched*.
   * Proportional **US viewership progress bars** embedded directly in the data table.
   * Right analytics rail with season viewership bar chart featuring **Lava Red** highlighting for the season's top-rated episode.
3. **Screen 3: Episode Detail (`/episodes/{episode_id}`)**
   * Hero `S{s} E{e}` badge with title and synopsis.
   * 4-metric scorecard (IMDb rating, votes, US viewership, season rank, air date).
   * Interactive season bar chart with tooltips and 1-click episode navigation.
   * Production credits panel (Directed by, Written by, Network) and Previous/Next episode split cards.
4. **Screen 4: Head-to-Head Episode Comparison (`/compare`)**
   * Dual searchable dropdown pickers covering all 151 episodes.
   * Side-by-side cards (Crimson Blood Red vs. Obsidian Night Slate).
   * Metric scorecard table with **automatic winner highlighting in crimson red**.
5. **Screen 5: Characters & Organization (`/characters`)**
   * Structural hierarchy mapping: *CBI Core Team*, *CBI Leadership*, *FBI Austin Field Office*, and *Antagonists & Nemeses*.
   * High-resolution actor portraits, character bios, and active season spans.
6. **Screen 6: Awards & Accolades (`/awards`)**
   * Emmy, Golden Globe, SAG, and People's Choice awards tracker.
   * Ceremony winner badges (Won in Red vs. Nominated in White).
   * Annual awards stacked bar chart (Major honors vs. Guild/Music awards) and acting honors list.
7. **Screen 7: System Architecture & Live Motion DBML (`/about`)**
   * Discloses the 5-tier Databricks Apps stack (Browser → App → Access → Storage → Sources) with clean SVGs.
   * **Live Motion Schema Graph:** Interactive canvas with animated dashed flow wires tracing 1-to-many relationships in real time.
   * **DBML Specification Inspector:** Full DBML code representation with 1-click copy-to-clipboard.

---

## 🧩 React 19 UI Components

Integrated in `src/components/ui/` with TypeScript and Tailwind CSS:

* **`src/components/ui/responsive-sidebar.tsx`**: Production-ready, fully accessible responsive navigation sidebar with smooth width transitions, brand section, backdrop overlay, and keyboard navigation.
* **`src/components/ui/expandable-gallery.tsx`**: Interactive photo gallery with smooth accordion item expansion, modal lightbox zoom, accessible ARIA attributes, and dark/light mode tokens.
* **`lib/utils.ts`**: Standard `cn()` utility powered by `clsx` and `tailwind-merge`.

---

## 🏛️ System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DATABRICKS APP ARCHITECTURE                     │
├────────────────────────────────────────────────────────────────────────┤
│  [ Tier 1: Client ]   Browser (Light/Dark Mode, Jinja2/HTML5/Vanilla/  │
│                       Tailwind/Canvas, Interactive SVG Tooltips)       │
│                                  ▲   │                                 │
│                         Data Out │   │ HTTP Requests                   │
│                                  │   ▼                                 │
│  [ Tier 2: Backend ]  FastAPI (Python 3.10+) in Databricks Apps        │
│                       In-memory caching on app startup                 │
│                                  ▲   │                                 │
│                                  │   │ Databricks SDK / SQL Connector  │
│                                  ▼   ▼                                 │
│  [ Tier 3: Access ]   Serverless SQL Warehouse / UC Files API          │
│                                  ▲                                     │
│                                  │ Reads                               │
│                                  ▼                                     │
│  [ Tier 4: Storage ]  Unity Catalog (`main.tvshows.*`)                 │
│                       ├── 6 Delta Tables (shows, seasons, episodes,    │
│                       │   characters, season_cast, awards)             │
│                       └── 1 UC Volume (`/Volumes/.../images/`)         │
│                                  ▲                                     │
│                                  │ One-time Batch Load / ETL           │
│  [ Tier 5: Sources ]  Wikipedia (CC BY-SA), IMDb Non-commercial,       │
│                       Nielsen Ratings, Image Assets                    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 React 19 / Next.js Full Architecture (Option B)

The application features a complete **React 19 / Next.js / Framer Motion / Tailwind CSS** architecture in `src/app/`, alongside the FastAPI server:

* **Framework:** React 19 + Next.js App Router (Turbopack) with static site pre-rendering (160 routes compiled).
* **Core Components:**
  * `src/components/ui/responsive-sidebar.tsx`: Accessible responsive navigation sidebar with backdrop overlay and Lucide icons.
  * `src/components/ui/expandable-gallery.tsx`: Accordion character dossier gallery with modal lightbox zoom.
  * `lib/sound.ts`: Sub-millisecond tactile Web Audio micro-haptics engine (crisp clicks, view transitions, confetti chimes).
* **Typography:** Afacad Semibold (headings) and Afacad Normal Light (body) loaded via Google Fonts.
* **Aesthetics:** CBI Casebook investigative materiality with Red John Blood-Red (`#C8102E`) accents, obsidian slate, zero emojis, and live motion DBML canvas.

### Running the App:

```bash
# 1. Run Next.js React 19 Development Server
npm run dev

# 2. Build the production React 19 application (generates 160 pre-rendered pages in out/)
npm run build

# 3. Type checking
npm run check-types

# 4. Run FastAPI Backend (Serves API routes + React 19 App at /react/ + fallback Jinja)
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload

# 5. Run Backend Pytest Suite
python -m pytest tests/
```

---

## 📄 License & Fair Use
Created for educational, analytical, and non-commercial exploration. Data sourced from Wikipedia (CC BY-SA) and IMDb non-commercial datasets.
