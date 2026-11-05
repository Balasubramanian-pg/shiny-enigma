# Business Analyst Specification Report: Databricks TV Show Explorer

---

## 1. Executive Summary & Application Overview

This document presents a comprehensive, screen-by-screen business analyst specification and technical architecture breakdown of the Databricks web application observed in the demonstration.

The original application, titled **"Modern Family Explorer"**, is an editorial-grade, data-driven analytical web application running natively on **Databricks Apps** (hosted on `*.azure.databricksapps.com`). It serves as an interactive catalog and analytics dashboard covering all 250 episodes across 11 seasons of the television show.

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
│  [ Tier 4: Storage ]  Unity Catalog (`catalog.tvshows.*`)              │
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

## 2. Global Shell & Persistent Layout Elements

### 2.1 Collapsible Left Navigation Sidebar
* **Width:** ~140px expanded; collapsible via `<` icon chevron in the top-right corner of the sidebar.
* **Background:** Ivory/bone (`#F2EFEB`) in Light Mode; Deep Charcoal (`#141414`) in Dark Mode.
* **Navigation Items:**
  1. **Home** (`/`) — Icon: Outline Home
  2. **Episodes** (`/episodes`) — Icon: Outline Video Camera
  3. **Characters** (`/characters`) — Icon: Outline People/Group
  4. **Awards** (`/awards`) — Icon: Outline Award Ribbon/Medal
  5. **About** (`/about`) — Icon: Outline Info Circle
  6. **Contact** (`/contact`) — Icon: Outline Mail Envelope
* **Active State:** Red text (`#E50914`), red icon, with an off-white/elevated pill background tab.
* **Sidebar Footer:** Legal attribution: *"Data from Wikipedia (CC BY-SA) and IMDb (personal, non-commercial use)."*

### 2.2 Global Top Header Bar
* **Search Input:** 
  * Placeholder: `Episode, character or writer`
  * Action Button: Solid Black rectangular button labeled `Search` (`#111111`, white bold text).
  * Functionality: Full-text search querying titles, synopses, characters, directors, and writers across seasons.
* **Theme Toggle:**
  * Square button with a crescent moon icon (or sun icon in dark mode).
  * Interaction: Seamless animated wipe transition toggling Light Mode (`#FBF9F5` warm canvas) and Dark Mode (`#0F0F0F` pitch obsidian canvas).
* **Show Logo:**
  * Top-right lockup: Two-font wordmark: `modern` (lowercase clean sans-serif in charcoal/white) + `family` (lowercase Didone serif in crimson red).

---

## 3. Screen-by-Screen Functional Specifications

---

### Screen 1: Home Screen (Executive Dashboard & Cast Showcase)

#### Functional Requirements
* Serve as the main landing page, presenting series-level KPIs, fast actions (`Start with the Pilot`, `Browse episodes`), season progression, and major milestones.
* Provide an interactive promotional photo where hovering over character faces displays identifying badges.

#### UI Layout & Aesthetics
1. **Hero Section (Split Grid):**
   * **Left Column:**
     * Eyebrow header: `11 SEASONS · 250 EPISODES` (Uppercase, crimson red, tracked wide).
     * Headline: `One very big, very loud family.` (H1, 38px, font-weight 700, line-height 1.15).
     * Subtitle: *"Every episode of the Pritchett, Dunphy and Tucker-Pritchett households, with ratings, viewers and the stories behind them."*
     * CTA Buttons:
       * Primary: Crimson Red button (`#E50914`, white text): `Start with the Pilot` (links to S1 E1).
       * Secondary: Solid Black button (`#111111`, white text): `Browse episodes` (links to `/episodes`).
   * **Right Column (Hero Image with Interactive Face Tags):**
     * High-resolution promotional cast photo framed in golden frames.
     * **Interactive Function:** Hovering over any character's face reveals floating black tooltips with character names (`Jay`, `Gloria`, `Joe`, `Manny`, `Stella`, `Phil`, `Haley`, `Luke`, `Alex`, `Claire`, `Cameron`, `Mitchell`, `Lily`).
2. **Key Metric KPI Cards (4-Column Bento Bar):**
   * Background: Neutral bone (`#F2EFEB`) in Light Mode; `#1E1E1E` in Dark Mode.
   * **Card 1:** `22` — *Primetime Emmy wins*
   * **Card 2:** `5` — *Outstanding Comedy Series wins*
   * **Card 3:** `12.93M` — *Peak season average, Season 3*
   * **Card 4:** `9.5` — *Highest IMDb episode rating*
3. **Seasons Matrix (Interactive Flip/Sparkline Cards):**
   * Grid of 12 cards (11 numbered season cards + 1 red summary card):
     * **Numbered Cards (`01` to `11`):**
       * Black solid card surface (`#111111`).
       * Top number: Season number in bold white (`01`, `02`, etc.).
       * Center: **Red Bar Sparkline** visualizing IMDb rating per episode across that entire season.
       * Bottom metrics: Year span (`2009 to 2010`) and summary stats (`8.0 IMDb · 9.5M`).
       * **Hover Interaction:** Card flips or transitions to display the season synopsis (e.g. Card 03 reveals: *"Lily is now a toddler, Claire runs for city council, and Mitchell and Cam begin trying to adopt a second child..."*).
     * **Red Summary Card (12th Card):**
       * Vivid Red (`#E50914`).
       * Number: `250`.
       * Text: `episodes` / `View all →`.
4. **Milestones Strip:**
   * 4-column horizontal card strip:
     * `FIRST EPISODE`: **Pilot**
     * `EPISODE 100`: **Farm Strong**
     * `EPISODE 200`: **Dear Beloved Family**
     * `FINAL EPISODE`: **Finale (Part 2)**
5. **The Family Grid (Bottom of Home):**
   * Section header: `The family` with right-aligned red link `All characters →`.
   * 14 character cards across 2 rows showing square portraits, character name in bold, and household surname (`Pritchett`, `Dunphy`, `Tucker-Pritchett`).

---

### Screen 2: Episodes Explorer (Season Matrix & Episode Performance Table)

#### Functional Requirements
* Enable rapid filtering by season via top horizontal tabs.
* Provide sorting toggle between **Episode order**, **Highest rated**, and **Most watched**.
* Display episode-level viewership and IMDb scores with inline visual bars.
* Provide an interactive season viewership bar chart with visual flagging for the top-rated episode.

#### UI Layout & Aesthetics
1. **Season Selector Navigation Bar:**
   * Horizontal segmented button strip from `Season 1 (2009)` to `Season 11 (2019)`.
   * Selected state: Solid red background with white text; unselected: off-white/charcoal tabs.
2. **Season Summary Header:**
   * Left: Season title (e.g., `Season 1` or `Season 5`).
   * Right: Date range and count (e.g., `23 Sep 2009 to 19 May 2010 · 24 episodes`).
   * Paragraph: Narrative summary of key storylines and character arcs for that season.
3. **Episode Sorting Tabs:**
   * Segmented text tabs: `Episode order` (default), `Highest rated`, `Most watched`.
   * Active tab indicated by red text and a red bottom border underline.
4. **Episodes Data List / Table:**
   * Left number badge: Episode number (`01`, `02`, `03`...). If sorted by highest rated, the badge shows rank and a red indicator on the top episode.
   * Episode Title & Air Date: Bold episode title (clickable link to Episode Detail) and air date below.
   * **Inline US Viewers Progress Bar:** Proportional horizontal progress bar representing relative viewership.
   * Exact Numbers: Numeric viewership (e.g. `12.61M`) and IMDb rating (e.g. `8.2`).
5. **Right Analytics Rail:**
   * **Widget 1: "US viewers by episode" Bar Chart:**
     * Bar chart showing viewership for all episodes in the season.
     * The highest-rated episode in that season is highlighted in **Lava Red** (`#E50914`), with caption: *"Lava marks the top rated episode"*.
   * **Widget 2: Season Performance Cards:**
     * Solid Red Stat Card: `Season 1 average: 9.48M viewers · #36 among US shows that season`.
     * Highlight cards for `Top rated this season: The Alliance (8.4 on IMDb)` and `Most watched this season: A Tale of Three Cities (8.24M viewers)`.

---

### Screen 3: Episode Detail (Deep-Dive Analytics & Bar Chart Hub)

#### Functional Requirements
* Display complete metadata for a single episode: season/episode numbers, overall show number, synopsis, air date, network, director, writer.
* Show performance relative to the entire season via an interactive bar chart.
* Support sequential navigation (`Previous Episode` / `Next Episode`) and link to the side-by-side comparison tool.

#### UI Layout & Aesthetics
1. **Breadcrumbs:** `Episodes / Season 9 / Episode 1`.
2. **Hero Episode Banner:**
   * Two-column split card:
     * Left Red Block: Crimson background with white text: `Season 9 · Episode 1 · No. 189 overall`, giant headline `S9 E1`, with a subtle transparent character portrait watermark on the right edge.
     * Right Section: Big title `Lake Life` (H1, 32px), followed by the complete episode synopsis.
3. **4-Metric Performance Bar:**
   * `8.0` — *IMDb rating · 2,741 votes*
   * `7.01M` — *US viewers*
   * `1 of 22` — *Season 9 by viewers (relative ranking)*
   * `27 Sep 2017` — *First aired on ABC*
4. **Interactive Season Viewership Chart:**
   * Title: `Season 9 viewers`
   * Subtitle: `US viewers per episode (millions). Select a bar to open it.`
   * Visual: Bar chart of all 22 episodes. The currently viewed episode bar is colored **Crimson Red**, while other episodes are neutral grey (`#D1CDC7` or `#333333`).
   * **Interaction:** Hovering any bar displays an instant tooltip: `Episode 6: Grab It · 7.23M viewers · 7.2 IMDb`. Clicking any bar immediately navigates to that episode's detail page.
5. **Credits Panel (Right of Chart):**
   * `Directed by`: e.g., `James Bagdonas`
   * `Written by`: e.g., `Elaine Ko`
   * `Network`: `ABC`
6. **Comparison CTA:**
   * Prominent text link: `Compare this episode with another →` (navigates to Screen 4 with this episode pre-selected).
7. **Previous / Next Episode Navigation Footers:**
   * Left (Grey/Off-white): `Previous · S8 E22 | The Graduates | 6.20M viewers`
   * Right (Solid Black): `Next · S9 E2 | The Long Goodbye | 6.36M viewers`

---

### Screen 4: Compare Episodes (Head-to-Head Analysis)

#### Functional Requirements
* Allow the user to select any two episodes from the entire 250-episode catalog using two searchable dropdown menus.
* Render a side-by-side comparative scorecard highlighting the superior metric in red.

#### UI Layout & Aesthetics
1. **Header & Selectors:**
   * Title: `Compare episodes`
   * Subtitle: `Pick any two of the 250 episodes`
   * Selectors: Two full-width select dropdowns: `[ S9 E1 · Lake Life ▼ ]` vs `[ S3 E14 · Me? Jealous? ▼ ]`.
2. **Side-by-Side Hero Cards:**
   * Left Card (Red `#E50914`): `S9 E1 · 27 SEP 2017`, `Lake Life`, full synopsis.
   * Right Card (Black `#111111`): `S3 E14 · 8 FEB 2012`, `Me? Jealous?`, full synopsis.
3. **Comparative Metric Scorecard Table:**
   * Center column: Metric Label.
   * Left / Right columns: Corresponding values.
   * **Winner Highlighting:** The higher/better value is rendered in **bold crimson red**, while the lower value is rendered in standard text color.

---

### Screen 5: Characters & Family Tree (Genealogy & Household Profiles)

#### Functional Requirements
* Present the complex family relationship dynamics visually by Generation and by Household.
* Display character profiles, including the actor who played them, their active seasons, and their character biography.

#### UI Layout & Aesthetics
1. **Interactive Genealogy Chart (Grouped by Generation):**
   * **`PARENTS` (Top Tier):** Jay, Gloria.
   * **`CHILDREN` (Middle Tier):**
     * Dunphy household: Claire, Phil
     * Tucker-Pritchett household: Mitchell, Cameron
     * Pritchett household: Manny, Joe, Stella (family dog)
   * **`GRANDCHILDREN` (Bottom Tier):**
     * Claire & Phil's: Haley, Dylan, Alex, Luke
     * Mitchell & Cameron's: Lily
   * Explanatory text banner: *"Claire and Mitchell are Jay's children from his first marriage. Manny is Gloria's son, Joe is Jay and Gloria's son, and Stella is the family dog. Haley's partner is Dylan."*
2. **Household Breakdown Sections:**
   * Grouped blocks: `The Pritchetts` (5 characters), `The Dunphys` (5 characters), `The Tucker-Pritchetts` (3 characters).
   * Each character card includes:
     * High-res portrait photo.
     * Character name (bold H3).
     * Actor attribution: `Played by [Actor Name]`.
     * Active seasons badge: `Seasons 1 to 11` (or `Seasons 5 to 11` in red text).
     * Character bio / narrative role.

---

### Screen 6: Awards & Accolades (Emmy Timeline & Acting Honours)

#### Functional Requirements
* Summarize the show's major industry awards across Emmys, SAG, and Golden Globes.
* Provide interactive tabs to filter by award body or category.
* Visualize annual award win trends with a stacked breakdown (Primetime vs. Creative Arts).
* Spotlight individual acting wins by cast member.

#### UI Layout & Aesthetics
1. **Top Category Filter Tabs:**
   * `Emmys, from 85 nominations` (Active red tab).
   * `Outstanding Comedy Series wins`.
   * `SAG ensemble awards`.
   * `Golden Globe wins`.
2. **Outstanding Comedy Series Flagship Tracker:**
   * Subtitle: `Primetime Emmy, by ceremony year`.
   * Consecutive nomination year cards:
     * **2010 to 2014:** Red cards with bold white text `Won` (celebrating 5 consecutive wins!).
     * **2015 to 2017:** White/charcoal cards with dark text `Nominated`.
3. **Emmy Wins by Year Stacked Bar Chart:**
   * Left widget: Bar chart tracking wins from 2010 to 2020.
   * Two stacked color segments:
     * **Crimson Red:** `Primetime` awards.
     * **Light Grey / Charcoal:** `Creative Arts` awards.
4. **Acting Emmys Honor Roll (Right Widget):**
   * List of cast members with photos, category, and winning ceremony years (Eric Stonestreet, Ty Burrell, Julie Bowen).

---

### Screen 7: About / Architecture & Data Model (Built on Databricks Showcase)

#### Functional Requirements
* Serve as the technical disclosure and system architecture page for the Databricks App.
* Render a live Entity-Relationship (ER) diagram reflecting the exact Delta tables in Unity Catalog with real-time row counts.
* Disclose data lineage, sources, and ingestion process.

#### UI Layout & Aesthetics
1. **Top Narrative Card:**
   * Header: `A personal project / About`.
   * Description: Explains the scope of the app and technology stack.
2. **"Built on Databricks" Architectural Tier Flow:**
   * Header banner: Red Databricks stacked cube icon with subtitle `Databricks Apps · Unity Catalog · Delta Lake · SQL warehouse`.
   * Ingestion note: *"Data was loaded once from CSV files into Unity Catalog. The app reads it when it starts."*
   * 5-Tier interactive stack cards:
     * **Browser (What you see):** `6 pages · Chart tooltips`
     * **App (Databricks Apps):** `FastAPI · Jinja templates`
     * **Access (How the app reads it):** `SQL warehouse · Files API`
     * **Storage (Unity Catalog):** `6 Delta tables · Images volume`
     * **Sources (Where the data came from):** `Wikipedia · IMDb datasets · Images`
   * Annotation: Left indicator `↓ Request`, right indicator `Data ↑`.
3. **Interactive Data Model ER Diagram:**
   * Displaying the 6 Delta tables in `projectportfolio.tvshows` with live row counts, primary keys (`PK` in red), foreign keys (`FK`), and connector lines:
     * `shows` (1 row)
     * `seasons` (11 rows)
     * `episodes` (250 rows)
     * `characters` (14 rows)
     * `season_cast` (435 rows)
     * `awards` (122 rows)
4. **Data Sources Attribution Table:**
   * Episodes, seasons, awards, ratings, viewers, and last updated date.

---

## 4. Aesthetics, Typography & Visual Design System

### 4.1 Color System

| Token Name | Light Mode Value | Dark Mode Value | Usage |
| :--- | :--- | :--- | :--- |
| `--bg-canvas` | `#FAF8F5` (Warm Alabaster/Ivory) | `#0E1013` (Obsidian Pitch) | Main page background |
| `--bg-surface` | `#FFFFFF` (Pure White) | `#16181D` (Charcoal Surface)| Cards, modals, containers |
| `--bg-subtle` | `#F0EDE8` (Muted Sand) | `#1F2229` (Elevated Grey) | KPI cards, sidebar background |
| `--text-primary` | `#121316` (Deep Black) | `#F4F5F7` (Pure White) | Headings, titles, numbers |
| `--text-secondary` | `#5A5D64` (Mid Grey) | `#9DA3AE` (Silver Grey) | Subtitles, descriptions, dates |
| `--text-muted` | `#8E9199` (Light Grey) | `#666C77` (Dim Grey) | Legal text, disabled states |
| `--accent-primary` | `#E50914` (Crimson / Lava Red) | `#E50914` (Lava Red) | Active tabs, winners, highlight bars |
| `--border-subtle` | `#E5E1D8` (Warm Border) | `#242832` (Dark Border) | Dividers, table row borders |
| `--interactive-dark`| `#111111` (Black) | `#2A2E38` (Elevated) | Primary search & browse buttons |

### 4.2 Typography System

1. **Logo & Wordmark:**
   * First Word: `Helvetica Neue`, `Inter` (Weight: 400 Regular, lowercase, tracking: `-0.02em`).
   * Second Word: `Didot`, `Bodoni MT`, or `Playfair Display` (Serif, lowercase, high contrast vertical stress, color: `--accent-primary`).
2. **Headings & Quantitative Metric Display:**
   * Font: `Inter`, `SF Pro Display`, or system sans-serif.
   * Large Numbers (KPIs, Season Badges): `32px` to `48px`, Weight: `700 Bold` or `800 Heavy`, tight letter-spacing (`-0.03em`).
   * Section Titles (H2): `24px`, Weight: `600 Semi-Bold`.
3. **Eyebrows & Micro-Labels:**
   * Text: `11px` to `12px`, Weight: `600 Semi-Bold`, `text-transform: uppercase`, tracking: `0.08em` (`letter-spacing: 1px`).
4. **Data Tables & Technical Details:**
   * Monospace: `ui-monospace`, `JetBrains Mono`, `SFMono-Regular`, `Consolas` (used for catalog/schema names and PK/FK indicators).

---

## 5. Data-to-Insights Translation Matrix

| Visual UI Element | Raw Data Points (Delta Lake) | Cognitive Insight Delivered |
| :--- | :--- | :--- |
| **Inline Viewership Bars** | `episodes.us_viewers_m` / max season viewership | Instantly identifies mid-season viewer decay or finale surges without scanning numbers. |
| **Lava Red Accent Bar** | `episodes.imdb_rating == season.max_rating` | Highlights the artistic and critical peak of each season at a glance. |
| **Season Card Sparklines** | Array of `episodes.imdb_rating` per season | Shows season consistency versus volatility before opening the season. |
| **Compare Winner Color** | `Math.max(ep1.metric, ep2.metric)` | Automatically highlights the superior episode across ratings, votes, and viewership. |
| **Generational Character Tree** | `characters.generation` & `characters.household` | Organizes complex multi-generational ensembles into an intuitive genealogical graph. |
| **Stacked Awards Chart** | `awards.year`, `awards.result`, `awards.award_body` | Shows the show's dominance over time and the split between major primetime and guild honors. |
