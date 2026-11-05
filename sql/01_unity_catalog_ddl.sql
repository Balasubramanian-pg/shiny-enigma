-- ============================================================================
-- UNITY CATALOG DELTA TABLES DEFINITION
-- Catalog: main (or projectportfolio)
-- Schema: tvshows
-- Application: The Mentalist Explorer (Databricks Apps)
-- ============================================================================

CREATE CATALOG IF NOT EXISTS main;
CREATE SCHEMA IF NOT EXISTS main.tvshows;
CREATE VOLUME IF NOT EXISTS main.tvshows.images;

-- 1. SHOWS TABLE
CREATE TABLE IF NOT EXISTS main.tvshows.shows (
    show_id STRING NOT NULL,
    title STRING NOT NULL,
    network STRING,
    first_aired DATE,
    last_aired DATE,
    episode_count INT,
    season_count INT,
    peak_viewers_season INT,
    peak_viewers_m DOUBLE,
    highest_rated_episode_id STRING,
    highest_imdb_rating DOUBLE,
    total_emmy_wins INT,
    total_comedy_series_wins INT,
    total_awards_won INT,
    total_nominations INT,
    creator STRING,
    genre STRING,
    tagline STRING,
    synopsis STRING,
    banner_image_url STRING,
    logo_url STRING,
    CONSTRAINT pk_shows PRIMARY KEY (show_id)
);

-- 2. SEASONS TABLE
CREATE TABLE IF NOT EXISTS main.tvshows.seasons (
    season_no INT NOT NULL,
    show_id STRING NOT NULL,
    year_start INT,
    year_end INT,
    premiere_date DATE,
    finale_date DATE,
    episode_count INT,
    avg_viewers_m DOUBLE,
    avg_imdb_rating DOUBLE,
    rank_us_shows INT,
    top_rated_episode_id STRING,
    most_watched_episode_id STRING,
    synopsis STRING,
    CONSTRAINT pk_seasons PRIMARY KEY (season_no)
);

-- 3. EPISODES TABLE
CREATE TABLE IF NOT EXISTS main.tvshows.episodes (
    episode_id STRING NOT NULL,
    show_id STRING NOT NULL,
    season_no INT NOT NULL,
    episode_no INT NOT NULL,
    overall_no INT NOT NULL,
    title STRING NOT NULL,
    air_date DATE,
    us_viewers_m DOUBLE,
    imdb_rating DOUBLE,
    imdb_votes INT,
    season_viewer_rank INT,
    directed_by STRING,
    written_by STRING,
    network STRING,
    synopsis STRING,
    thumbnail_url STRING,
    CONSTRAINT pk_episodes PRIMARY KEY (episode_id)
);

-- 4. CHARACTERS TABLE
CREATE TABLE IF NOT EXISTS main.tvshows.characters (
    character_id STRING NOT NULL,
    show_id STRING NOT NULL,
    name STRING NOT NULL,
    actor STRING NOT NULL,
    household STRING NOT NULL,
    generation STRING,
    bio STRING,
    seasons_active STRING,
    image_url STRING,
    tree_order INT,
    CONSTRAINT pk_characters PRIMARY KEY (character_id)
);

-- 5. SEASON_CAST (Junction Table)
CREATE TABLE IF NOT EXISTS main.tvshows.season_cast (
    season_cast_id STRING NOT NULL,
    character_id STRING NOT NULL,
    season_no INT NOT NULL,
    actor STRING NOT NULL,
    role_type STRING,
    billing_order INT,
    CONSTRAINT pk_season_cast PRIMARY KEY (season_cast_id)
);

-- 6. AWARDS TABLE
CREATE TABLE IF NOT EXISTS main.tvshows.awards (
    award_id STRING NOT NULL,
    show_id STRING NOT NULL,
    season_no INT,
    episode_id STRING,
    year INT NOT NULL,
    award_body STRING NOT NULL,
    category STRING NOT NULL,
    nominee STRING,
    character_id STRING,
    result STRING NOT NULL,
    CONSTRAINT pk_awards PRIMARY KEY (award_id)
);
