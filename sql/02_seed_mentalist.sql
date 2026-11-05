-- ============================================================================
-- SEED SCRIPT: The Mentalist (CBS)
-- Inserts metadata directly into Unity Catalog Delta Tables
-- ============================================================================

INSERT OVERWRITE main.tvshows.shows VALUES (
    'the_mentalist',
    'The Mentalist',
    'CBS',
    DATE '2008-09-23',
    DATE '2015-02-18',
    151,
    7,
    1,
    17.52,
    'tm_s03e24',
    9.3,
    1,
    0,
    12,
    32,
    'Bruno Heller',
    'Crime, Drama, Mystery',
    'He sees what others miss. Catching Red John is his obsession.',
    'Patrick Jane, an independent consultant with the California Bureau of Investigation (CBI), has a remarkable track record for solving serious crimes by using his razor-sharp skills of observation and psychological manipulation, all while pursuing his lifelong quest to hunt down the serial killer Red John who murdered his wife and daughter.',
    '/static/images/mentalist_banner.jpg',
    '/static/images/mentalist_logo.svg'
);

-- Copy from staged CSV files in Unity Catalog Volume:
-- COPY INTO main.tvshows.seasons FROM '/Volumes/main/tvshows/images/data/seasons.csv' FILEFORMAT = CSV FORMAT_OPTIONS ('header' = 'true', 'inferSchema' = 'true');
-- COPY INTO main.tvshows.episodes FROM '/Volumes/main/tvshows/images/data/episodes.csv' FILEFORMAT = CSV FORMAT_OPTIONS ('header' = 'true', 'inferSchema' = 'true');
-- COPY INTO main.tvshows.characters FROM '/Volumes/main/tvshows/images/data/characters.csv' FILEFORMAT = CSV FORMAT_OPTIONS ('header' = 'true', 'inferSchema' = 'true');
-- COPY INTO main.tvshows.season_cast FROM '/Volumes/main/tvshows/images/data/season_cast.csv' FILEFORMAT = CSV FORMAT_OPTIONS ('header' = 'true', 'inferSchema' = 'true');
-- COPY INTO main.tvshows.awards FROM '/Volumes/main/tvshows/images/data/awards.csv' FILEFORMAT = CSV FORMAT_OPTIONS ('header' = 'true', 'inferSchema' = 'true');
