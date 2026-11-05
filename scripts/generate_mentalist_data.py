"""Generate seed data for The Mentalist (CBS, 2008-2015).
Produces 6 datasets matching the Unity Catalog Delta tables schema.
"""
import csv
import os

os.makedirs('data', exist_ok=True)

# 1. SHOWS
shows_data = [{
    'show_id': 'the_mentalist',
    'title': 'The Mentalist',
    'network': 'CBS',
    'first_aired': '2008-09-23',
    'last_aired': '2015-02-18',
    'episode_count': 151,
    'season_count': 7,
    'peak_viewers_season': 1,
    'peak_viewers_m': 17.52,
    'highest_rated_episode_id': 'tm_s03e24',
    'highest_imdb_rating': 9.3,
    'total_emmy_wins': 1,
    'total_comedy_series_wins': 0,
    'total_awards_won': 12,
    'total_nominations': 32,
    'creator': 'Bruno Heller',
    'genre': 'Crime, Drama, Mystery',
    'tagline': 'He sees what others miss. Catching Red John is his obsession.',
    'synopsis': 'Patrick Jane, an independent consultant with the California Bureau of Investigation (CBI), has a remarkable track record for solving serious crimes by using his razor-sharp skills of observation and psychological manipulation, all while pursuing his lifelong quest to hunt down the serial killer Red John who murdered his wife and daughter.',
    'banner_image_url': '/static/images/mentalist_banner.jpg',
    'logo_url': '/static/images/mentalist_logo.svg'
}]

with open('data/shows.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=shows_data[0].keys())
    writer.writeheader()
    writer.writerows(shows_data)

# 2. SEASONS
seasons_data = [
    {
        'season_no': 1,
        'show_id': 'the_mentalist',
        'year_start': 2008,
        'year_end': 2009,
        'premiere_date': '2008-09-23',
        'finale_date': '2009-05-19',
        'episode_count': 23,
        'avg_viewers_m': 17.52,
        'avg_imdb_rating': 8.1,
        'rank_us_shows': 6,
        'top_rated_episode_id': 'tm_s01e23',
        'most_watched_episode_id': 'tm_s01e01',
        'synopsis': "Patrick Jane joins Teresa Lisbon's CBI unit as a consultant, demonstrating his uncanny abilities to read human behavior while hunting for clues about the serial killer Red John."
    },
    {
        'season_no': 2,
        'show_id': 'the_mentalist',
        'year_start': 2009,
        'year_end': 2010,
        'premiere_date': '2009-09-24',
        'finale_date': '2010-05-20',
        'episode_count': 23,
        'avg_viewers_m': 15.37,
        'avg_imdb_rating': 8.2,
        'rank_us_shows': 10,
        'top_rated_episode_id': 'tm_s02e23',
        'most_watched_episode_id': 'tm_s02e01',
        'synopsis': "Jane faces scrutiny from internal affairs and a new boss, Madeleine Hightower, while Red John strikes closer than ever, culminating in a chilling face-to-face encounter."
    },
    {
        'season_no': 3,
        'show_id': 'the_mentalist',
        'year_start': 2010,
        'year_end': 2011,
        'premiere_date': '2010-09-23',
        'finale_date': '2011-05-19',
        'episode_count': 24,
        'avg_viewers_m': 15.24,
        'avg_imdb_rating': 8.3,
        'rank_us_shows': 9,
        'top_rated_episode_id': 'tm_s03e24',
        'most_watched_episode_id': 'tm_s03e24',
        'synopsis': "Hightower is framed for murder by a Red John mole within CBI. Jane orchestrates an elaborate sting operation in a shopping mall food court to trap and confront his nemesis."
    },
    {
        'season_no': 4,
        'show_id': 'the_mentalist',
        'year_start': 2011,
        'year_end': 2012,
        'premiere_date': '2011-09-22',
        'finale_date': '2012-05-17',
        'episode_count': 24,
        'avg_viewers_m': 14.57,
        'avg_imdb_rating': 8.2,
        'rank_us_shows': 12,
        'top_rated_episode_id': 'tm_s04e24',
        'most_watched_episode_id': 'tm_s04e01',
        'synopsis': "Jane is tried for murder after shooting the decoy Red John and acquitted. He stages a complete psychological breakdown in Las Vegas to lure the real killer into the open."
    },
    {
        'season_no': 5,
        'show_id': 'the_mentalist',
        'year_start': 2012,
        'year_end': 2013,
        'premiere_date': '2012-09-30',
        'finale_date': '2013-05-05',
        'episode_count': 22,
        'avg_viewers_m': 11.82,
        'avg_imdb_rating': 8.1,
        'rank_us_shows': 19,
        'top_rated_episode_id': 'tm_s05e22',
        'most_watched_episode_id': 'tm_s05e01',
        'synopsis': "Jane narrows the suspect list of Red John down to seven high-ranking officials and suspects, only to discover Red John has anticipated his exact list."
    },
    {
        'season_no': 6,
        'show_id': 'the_mentalist',
        'year_start': 2013,
        'year_end': 2014,
        'premiere_date': '2013-09-29',
        'finale_date': '2014-05-18',
        'episode_count': 22,
        'avg_viewers_m': 11.27,
        'avg_imdb_rating': 8.4,
        'rank_us_shows': 26,
        'top_rated_episode_id': 'tm_s06e08',
        'most_watched_episode_id': 'tm_s06e08',
        'synopsis': "The definitive showdown: Jane unmasks Red John as Sheriff Thomas McAllister and exacts his revenge. Two years later, Jane is recruited by the FBI in Austin, Texas."
    },
    {
        'season_no': 7,
        'show_id': 'the_mentalist',
        'year_start': 2014,
        'year_end': 2015,
        'premiere_date': '2014-11-30',
        'finale_date': '2015-02-18',
        'episode_count': 13,
        'avg_viewers_m': 11.53,
        'avg_imdb_rating': 8.3,
        'rank_us_shows': 21,
        'top_rated_episode_id': 'tm_s07e13',
        'most_watched_episode_id': 'tm_s07e13',
        'synopsis': "Working cases with the FBI in Austin, Patrick Jane and Teresa Lisbon navigate their blossoming romantic relationship, culminating in a beautiful wedding and a peaceful new chapter."
    }
]

with open('data/seasons.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=seasons_data[0].keys())
    writer.writeheader()
    writer.writerows(seasons_data)

# 3. EPISODES
episodes_raw = [
    (1, 1, 1, "Pilot", "2008-09-23", 15.68, 8.2, 5400, "David Nutter", "Bruno Heller", "CBS", "Former fraudulent psychic Patrick Jane helps the CBI solve the murder of a golfer's wife while wrestling with the demon of Red John."),
    (1, 2, 2, "Red Hair and Silver Tape", "2008-09-30", 15.48, 7.8, 3200, "David Nutter", "Bruno Heller", "CBS", "Jane and Lisbon investigate the murder of a waitress found tied up in Napa Valley vineyards."),
    (1, 3, 3, "Red Tide", "2008-10-14", 14.94, 7.9, 2900, "David M. Barrett", "Ashley Gable", "CBS", "When a teenage girl drowns off Santa Marta, Jane uses keen observations of surfers to uncover the truth."),
    (1, 4, 4, "Ladies in Red", "2008-10-21", 15.28, 7.9, 2800, "Chris Long", "Gary Glasberg", "CBS", "A wealthy investment banker is tortured and killed in his home's hidden vault."),
    (1, 5, 5, "Seeing Red", "2008-10-28", 15.95, 7.8, 2700, "Martha Mitchell", "Ken Woodruff", "CBS", "Jane challenges a so-called psychic when a rich dowager is murdered in a hit-and-run."),
    (1, 11, 11, "Red John's Friends", "2009-01-06", 19.62, 8.6, 4100, "John Polson", "Bruno Heller", "CBS", "A convicted murderer claims he was framed by Red John and offers Jane inside info in exchange for proving his innocence."),
    (1, 23, 23, "Red John's Footsteps", "2009-05-19", 16.82, 8.9, 5100, "Chris Long", "Bruno Heller", "CBS", "When a young girl is abducted and her twin murdered, Red John's iconic bloody smiley face appears, pulling Jane into a perilous trap."),
    (2, 1, 24, "Redemption", "2009-09-24", 15.07, 8.0, 2600, "Chris Long", "Bruno Heller", "CBS", "The Red John case is reassigned away from Lisbon's team to Special Agent Sam Bosco, provoking Jane's fury."),
    (2, 8, 31, "His Red Right Hand", "2009-11-19", 15.85, 8.7, 4300, "Chris Long", "Ashley Gable", "CBS", "Bosco's entire unit is gunned down inside the CBI headquarters by an assassin working directly for Red John."),
    (2, 23, 46, "Red Sky in the Morning", "2010-05-20", 15.22, 9.1, 5800, "Chris Long", "Bruno Heller", "CBS", "Jane encounters Red John in the flesh for the first time in a dark movie theater, where Red John quotes William Blake's 'Tyger, Tyger'."),
    (3, 1, 47, "Red Sky at Night", "2010-09-23", 14.24, 8.1, 2500, "Chris Long", "Bruno Heller", "CBS", "Jane returns to the CBI after his traumatizing face-to-face encounter with Red John."),
    (3, 9, 55, "Red Moon", "2010-11-18", 14.74, 8.6, 3800, "Simon Baker", "Bruno Heller", "CBS", "Jane suspects an astrologer and cop-killer Todd Johnson, who ends up burned alive inside a CBI holding cell."),
    (3, 23, 69, "Strawberries and Cream: Part 1", "2011-05-19", 14.11, 8.8, 4700, "Chris Long", "Ashley Gable", "CBS", "Jane discovers the CBI mole who killed Todd Johnson and prepares an elaborate trap for Red John."),
    (3, 24, 70, "Strawberries and Cream: Part 2", "2011-05-19", 14.11, 9.3, 7900, "Chris Long", "Bruno Heller", "CBS", "In a bustling suburban food court, Patrick Jane sits down across from the man claiming to be Red John and shoots him point-blank."),
    (4, 1, 71, "Scarlet Ribbons", "2011-09-22", 13.56, 8.4, 3200, "Charles Beeson", "Bruno Heller", "CBS", "In prison for murder, Jane defends himself in court while Lisbon learns the man Jane shot was a decoy named Timothy Carter."),
    (4, 10, 80, "Fugue in Red", "2011-12-15", 13.16, 8.3, 3100, "Randy Zisk", "Daniel Cerone", "CBS", "Jane almost drowns and awakens with amnesia, reverting to his selfish former con-man persona."),
    (4, 24, 94, "The Crimson Hat", "2012-05-17", 13.09, 9.1, 6200, "Chris Long", "Bruno Heller", "CBS", "Having hit rock bottom in Las Vegas, Jane agrees to deliver Lisbon to Red John in exchange for his blessing."),
    (5, 1, 95, "The Crimson Ticket", "2012-09-30", 11.06, 8.0, 2400, "Randy Zisk", "Bruno Heller", "CBS", "The FBI and CBI clash over custody of Lorelei Martins, Red John's mistress."),
    (5, 2, 96, "Devil's Cherry", "2012-10-07", 10.10, 8.9, 4900, "Randy Zisk", "Daniel Cerone", "CBS", "Jane is accidentally drugged with belladonna tea and hallucinates his deceased teenage daughter, Charlotte."),
    (5, 22, 116, "Red John's Rules", "2013-05-05", 9.17, 9.0, 5600, "Chris Long", "Bruno Heller", "CBS", "Jane narrows down the list of Red John suspects to seven prominent men, and Red John leaves a video predicting every single name."),
    (6, 1, 117, "The Desert Rose", "2013-09-29", 9.70, 8.3, 3100, "Chris Long", "Bruno Heller", "CBS", "Jane and Lisbon begin investigating the final seven suspects on the Red John list."),
    (6, 6, 122, "Fire and Brimstone", "2013-11-10", 10.38, 8.8, 4200, "John F. Showalter", "Ken Woodruff", "CBS", "Jane gathers the five remaining suspects at his former Malibu home to discover the Red John tattoo."),
    (6, 8, 124, "Red John", "2013-11-24", 10.90, 9.2, 9100, "Chris Long", "Bruno Heller", "CBS", "Patrick Jane finally confronts and strangles the real Red John—Sheriff Thomas McAllister—ending his decade-long revenge mission."),
    (6, 9, 125, "My Blue Heaven", "2013-12-01", 9.58, 8.4, 3300, "Simon Baker", "Tom Szentgyorgyi", "CBS", "Two years after killing Red John, Jane lives peacefully in Spanish exile before FBI Agent Abbott recruits him to Austin, Texas."),
    (6, 22, 138, "Blue Bird", "2014-05-18", 9.69, 9.3, 8500, "Chris Long", "Bruno Heller", "CBS", "Jane races onto a departing commercial airliner in Austin to confess his true love for Teresa Lisbon before she leaves for D.C."),
    (7, 1, 139, "Nothing But Blue Skies", "2014-11-30", 10.89, 8.2, 2800, "Chris Long", "Tom Szentgyorgyi", "CBS", "Jane and Lisbon secretly navigate the beginnings of their relationship while working cases with the FBI."),
    (7, 10, 148, "Nothing Gold Can Stay", "2015-02-04", 8.97, 8.5, 3100, "Paul Holahan", "Alex Berger", "CBS", "Tragedy strikes the team when rookie FBI agent Michelle Vega is killed in the line of duty."),
    (7, 13, 151, "White Orchids", "2015-02-18", 10.10, 9.3, 9400, "Chris Long", "Bruno Heller", "CBS", "Patrick Jane and Teresa Lisbon marry in front of their closest friends and family, and Lisbon reveals she is pregnant.")
]

episodes_data = []
overall_counter = 1
season_counts = {1: 23, 2: 23, 3: 24, 4: 24, 5: 22, 6: 22, 7: 13}
named_map = {(item[0], item[1]): item for item in episodes_raw}

for s in range(1, 8):
    count = season_counts[s]
    base_viewers = [17.5, 15.4, 15.2, 14.6, 11.8, 11.3, 11.5][s-1]
    for e in range(1, count + 1):
        if (s, e) in named_map:
            raw = named_map[(s, e)]
            episodes_data.append({
                'episode_id': f'tm_s{s:02d}e{e:02d}',
                'show_id': 'the_mentalist',
                'season_no': s,
                'episode_no': e,
                'overall_no': overall_counter,
                'title': raw[3],
                'air_date': raw[4],
                'us_viewers_m': raw[5],
                'imdb_rating': raw[6],
                'imdb_votes': raw[7],
                'season_viewer_rank': 1 if (e == 1 or 'Red John' in raw[3]) else 3,
                'directed_by': raw[8],
                'written_by': raw[9],
                'network': raw[10],
                'synopsis': raw[11],
                'thumbnail_url': f'/static/images/episodes/s{s:02d}e{e:02d}.jpg'
            })
        else:
            if s <= 5:
                color_words = ["Red", "Scarlet", "Crimson", "Blood", "Ruby", "Rose", "Cherry", "Russet"]
                title = f"{color_words[(e * 3 + s) % len(color_words)]} Case {e}"
            elif s == 6 and e <= 8:
                title = f"Red Enigma {e}"
            else:
                other_colors = ["Blue", "Silver", "Gold", "Violet", "Grey", "Orange", "Black", "White"]
                title = f"{other_colors[(e * 2 + s) % len(other_colors)]} Case {e}"
            
            v = round(base_viewers + ((e % 5) - 2) * 0.35, 2)
            rating = round(7.9 + ((e % 4) * 0.15), 1)
            votes = 2000 + (e * 70)
            
            episodes_data.append({
                'episode_id': f'tm_s{s:02d}e{e:02d}',
                'show_id': 'the_mentalist',
                'season_no': s,
                'episode_no': e,
                'overall_no': overall_counter,
                'title': title,
                'air_date': f'{2007 + s}-10-{10 + (e % 18):02d}',
                'us_viewers_m': v,
                'imdb_rating': rating,
                'imdb_votes': votes,
                'season_viewer_rank': (e % count) + 1,
                'directed_by': 'Chris Long' if e % 2 == 0 else 'Charles Beeson',
                'written_by': 'Bruno Heller' if e % 3 == 0 else 'Ashley Gable',
                'network': 'CBS',
                'synopsis': f"Patrick Jane, Teresa Lisbon and the team investigate a perplexing murder case involving high-stakes psychology and misdirection in episode {e} of season {s}.",
                'thumbnail_url': f'/static/images/episodes/s{s:02d}e{e:02d}.jpg'
            })
        overall_counter += 1

with open('data/episodes.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=episodes_data[0].keys())
    writer.writeheader()
    writer.writerows(episodes_data)

# 4. CHARACTERS
characters_data = [
    {
        'character_id': 'patrick_jane',
        'show_id': 'the_mentalist',
        'name': 'Patrick Jane',
        'actor': 'Simon Baker',
        'household': 'CBI Core Team',
        'generation': 'LEAD CONSULTANT',
        'bio': "Former celebrity fraudulent psychic turned independent consultant for the California Bureau of Investigation (CBI) and FBI. Possesses superhuman observation skills and is fueled by vengeance against Red John.",
        'seasons_active': 'Seasons 1 to 7',
        'image_url': '/static/images/characters/patrick_jane.jpg',
        'tree_order': 1
    },
    {
        'character_id': 'teresa_lisbon',
        'show_id': 'the_mentalist',
        'name': 'Teresa Lisbon',
        'actor': 'Robin Tunney',
        'household': 'CBI Core Team',
        'generation': 'SENIOR SPECIAL AGENT',
        'bio': "No-nonsense, highly principled senior agent leading the CBI serious crimes unit. Serves as Jane's moral compass, fiercest protector, and ultimate romantic partner.",
        'seasons_active': 'Seasons 1 to 7',
        'image_url': '/static/images/characters/teresa_lisbon.jpg',
        'tree_order': 2
    },
    {
        'character_id': 'kimball_cho',
        'show_id': 'the_mentalist',
        'name': 'Kimball Cho',
        'actor': 'Tim Kang',
        'household': 'CBI Core Team',
        'generation': 'SPECIAL AGENT',
        'bio': "The unflappable 'Iceman' of the unit. Deadpan, razor-sharp interrogator with deep military background and former Playboys gang membership.",
        'seasons_active': 'Seasons 1 to 7',
        'image_url': '/static/images/characters/kimball_cho.jpg',
        'tree_order': 3
    },
    {
        'character_id': 'wayne_rigsby',
        'show_id': 'the_mentalist',
        'name': 'Wayne Rigsby',
        'actor': 'Owain Yeoman',
        'household': 'CBI Core Team',
        'generation': 'SPECIAL AGENT',
        'bio': "Arson specialist with a heart of gold and insatiable appetite. Deeply loyal to Lisbon and Jane; fell in love with and married Grace Van Pelt.",
        'seasons_active': 'Seasons 1 to 6',
        'image_url': '/static/images/characters/wayne_rigsby.jpg',
        'tree_order': 4
    },
    {
        'character_id': 'grace_van_pelt',
        'show_id': 'the_mentalist',
        'name': 'Grace Van Pelt',
        'actor': 'Amanda Righetti',
        'household': 'CBI Core Team',
        'generation': 'SPECIAL AGENT',
        'bio': "Tech genius and database researcher who held spiritual beliefs that often clashed with Jane's cynical rationalism.",
        'seasons_active': 'Seasons 1 to 6',
        'image_url': '/static/images/characters/grace_van_pelt.jpg',
        'tree_order': 5
    },
    {
        'character_id': 'red_john',
        'show_id': 'the_mentalist',
        'name': 'Red John (Thomas McAllister)',
        'actor': 'Xander Berkeley',
        'household': 'Antagonists & Nemeses',
        'generation': 'SERIAL KILLER / CABAL LEADER',
        'bio': "The elusive, sadistic serial killer who murdered Patrick Jane's family and founded the secretive law enforcement cabal known as the Blake Association ('Tyger, Tyger').",
        'seasons_active': 'Seasons 1 to 6',
        'image_url': '/static/images/characters/red_john.jpg',
        'tree_order': 6
    },
    {
        'character_id': 'dennis_abbott',
        'show_id': 'the_mentalist',
        'name': 'Dennis Abbott',
        'actor': 'Rockmond Dunbar',
        'household': 'FBI Austin Field Office',
        'generation': 'SUPERVISORY SPECIAL AGENT',
        'bio': "Pragmatic FBI Special Agent in Charge who disbanded the compromised CBI and subsequently gave Patrick Jane full clemency and autonomy in Texas.",
        'seasons_active': 'Seasons 6 to 7',
        'image_url': '/static/images/characters/dennis_abbott.jpg',
        'tree_order': 7
    },
    {
        'character_id': 'madeleine_hightower',
        'show_id': 'the_mentalist',
        'name': 'Madeleine Hightower',
        'actor': 'Aunjanue Ellis',
        'household': 'CBI Leadership',
        'generation': 'CBI SUPERVISOR',
        'bio': "Strict but fair Director of the CBI who recognized Jane's genius. Later framed by Red John and forced into hiding with Jane's secret assistance.",
        'seasons_active': 'Seasons 2 to 3',
        'image_url': '/static/images/characters/madeleine_hightower.jpg',
        'tree_order': 8
    },
    {
        'character_id': 'bret_stiles',
        'show_id': 'the_mentalist',
        'name': 'Bret Stiles',
        'actor': 'Malcolm McDowell',
        'household': 'Antagonists & Nemeses',
        'generation': 'CULT LEADER (VISUALIZE)',
        'bio': "Charismatic, Machiavellian founder of the secretive religious movement 'Visualize'. Kept an eerie, playful intellectual duel with Patrick Jane.",
        'seasons_active': 'Seasons 2 to 6',
        'image_url': '/static/images/characters/bret_stiles.jpg',
        'tree_order': 9
    },
    {
        'character_id': 'virgil_minelli',
        'show_id': 'the_mentalist',
        'name': 'Virgil Minelli',
        'actor': 'Gregory Itzin',
        'household': 'CBI Leadership',
        'generation': 'CBI DIRECTOR',
        'bio': "Former CBI Director who often grumbled about Jane's unorthodox stunts but consistently backed Lisbon's team until retiring after Bosco's murder.",
        'seasons_active': 'Seasons 1 to 3',
        'image_url': '/static/images/characters/virgil_minelli.jpg',
        'tree_order': 10
    },
    {
        'character_id': 'kim_fischer',
        'show_id': 'the_mentalist',
        'name': 'Kim Fischer',
        'actor': 'Emily Swallow',
        'household': 'FBI Austin Field Office',
        'generation': 'SPECIAL AGENT',
        'bio': "Undercover FBI agent who met Jane on a Mexican beach to evaluate whether he could be trusted to return to active US federal law enforcement.",
        'seasons_active': 'Season 6',
        'image_url': '/static/images/characters/kim_fischer.jpg',
        'tree_order': 11
    },
    {
        'character_id': 'jason_wylie',
        'show_id': 'the_mentalist',
        'name': 'Jason Wylie',
        'actor': 'Joe Adler',
        'household': 'FBI Austin Field Office',
        'generation': 'TECH SPECIALIST',
        'bio': "Enthusiastic cyber analyst and computer forensics expert whose geeky charm and rapid intelligence won Jane's respect.",
        'seasons_active': 'Seasons 6 to 7',
        'image_url': '/static/images/characters/jason_wylie.jpg',
        'tree_order': 12
    },
    {
        'character_id': 'michelle_vega',
        'show_id': 'the_mentalist',
        'name': 'Michelle Vega',
        'actor': 'Josie Loren',
        'household': 'FBI Austin Field Office',
        'generation': 'PROBATIONARY AGENT',
        'bio': "Eager, disciplined West Point graduate and rookie FBI agent who tragically gave her life during a bank robber shootout in Season 7.",
        'seasons_active': 'Season 7',
        'image_url': '/static/images/characters/michelle_vega.jpg',
        'tree_order': 13
    },
    {
        'character_id': 'jj_laroche',
        'show_id': 'the_mentalist',
        'name': 'J.J. LaRoche',
        'actor': 'Pruitt Taylor Vince',
        'household': 'CBI Leadership',
        'generation': 'INTERNAL AFFAIRS',
        'bio': "Eccentric, meticulous Internal Affairs investigator tasked with rooting out Todd Johnson's killer. Guarded a bizarre secret inside a Tupperware box.",
        'seasons_active': 'Seasons 3 to 6',
        'image_url': '/static/images/characters/jj_laroche.jpg',
        'tree_order': 14
    }
]

with open('data/characters.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=characters_data[0].keys())
    writer.writeheader()
    writer.writerows(characters_data)

# 5. SEASON_CAST
season_cast_data = []
cast_id = 1
for char in characters_data:
    cid = char['character_id']
    act = char['actor']
    if 'Seasons 1 to 7' in char['seasons_active']:
        seasons = range(1, 8)
    elif 'Seasons 1 to 6' in char['seasons_active']:
        seasons = range(1, 7)
    elif 'Seasons 6 to 7' in char['seasons_active']:
        seasons = [6, 7]
    elif 'Season 7' in char['seasons_active']:
        seasons = [7]
    elif 'Season 6' in char['seasons_active']:
        seasons = [6]
    elif 'Seasons 2 to 3' in char['seasons_active']:
        seasons = [2, 3]
    elif 'Seasons 2 to 6' in char['seasons_active']:
        seasons = [2, 3, 4, 5, 6]
    else:
        seasons = [1, 2, 3]
        
    for s in seasons:
        season_cast_data.append({
            'season_cast_id': f'sc_{cast_id:04d}',
            'character_id': cid,
            'season_no': s,
            'actor': act,
            'role_type': 'Main' if cid in ['patrick_jane', 'teresa_lisbon', 'kimball_cho', 'wayne_rigsby', 'grace_van_pelt', 'dennis_abbott'] else 'Recurring',
            'billing_order': char['tree_order']
        })
        cast_id += 1

with open('data/season_cast.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=season_cast_data[0].keys())
    writer.writeheader()
    writer.writerows(season_cast_data)

# 6. AWARDS
awards_data = [
    {'award_id': 'aw_01', 'show_id': 'the_mentalist', 'season_no': 1, 'episode_id': 'tm_s01e01', 'year': 2009, 'award_body': 'People\'s Choice Awards', 'category': 'Favorite New TV Drama', 'nominee': 'The Mentalist', 'character_id': '', 'result': 'Won'},
    {'award_id': 'aw_02', 'show_id': 'the_mentalist', 'season_no': 1, 'episode_id': 'tm_s01e23', 'year': 2009, 'award_body': 'Primetime Emmy Awards', 'category': 'Outstanding Lead Actor in a Drama Series', 'nominee': 'Simon Baker', 'character_id': 'patrick_jane', 'result': 'Nominated'},
    {'award_id': 'aw_03', 'show_id': 'the_mentalist', 'season_no': 2, 'episode_id': 'tm_s02e08', 'year': 2010, 'award_body': 'Golden Globe Awards', 'category': 'Best Performance by an Actor in a Television Series - Drama', 'nominee': 'Simon Baker', 'character_id': 'patrick_jane', 'result': 'Nominated'},
    {'award_id': 'aw_04', 'show_id': 'the_mentalist', 'season_no': 2, 'episode_id': 'tm_s02e23', 'year': 2010, 'award_body': 'Screen Actors Guild Awards', 'category': 'Outstanding Performance by a Male Actor in a Drama Series', 'nominee': 'Simon Baker', 'character_id': 'patrick_jane', 'result': 'Nominated'},
    {'award_id': 'aw_05', 'show_id': 'the_mentalist', 'season_no': 2, 'episode_id': 'tm_s02e01', 'year': 2010, 'award_body': 'Television Critics Association Awards', 'category': 'Outstanding New Program', 'nominee': 'The Mentalist', 'character_id': '', 'result': 'Nominated'},
    {'award_id': 'aw_06', 'show_id': 'the_mentalist', 'season_no': 3, 'episode_id': 'tm_s03e24', 'year': 2011, 'award_body': 'People\'s Choice Awards', 'category': 'Favorite TV Crime Drama', 'nominee': 'The Mentalist', 'character_id': '', 'result': 'Nominated'},
    {'award_id': 'aw_07', 'show_id': 'the_mentalist', 'season_no': 4, 'episode_id': 'tm_s04e24', 'year': 2012, 'award_body': 'ASCAP Film and Television Music Awards', 'category': 'Top Television Series', 'nominee': 'Blake Neely', 'character_id': '', 'result': 'Won'},
    {'award_id': 'aw_08', 'show_id': 'the_mentalist', 'season_no': 5, 'episode_id': 'tm_s05e22', 'year': 2013, 'award_body': 'People\'s Choice Awards', 'category': 'Favorite TV Crime Drama', 'nominee': 'The Mentalist', 'character_id': '', 'result': 'Nominated'},
    {'award_id': 'aw_09', 'show_id': 'the_mentalist', 'season_no': 6, 'episode_id': 'tm_s06e08', 'year': 2014, 'award_body': 'ASCAP Film and Television Music Awards', 'category': 'Top Television Series', 'nominee': 'Blake Neely', 'character_id': '', 'result': 'Won'},
    {'award_id': 'aw_10', 'show_id': 'the_mentalist', 'season_no': 6, 'episode_id': 'tm_s06e08', 'year': 2014, 'award_body': 'Prism Awards', 'category': 'Drama Series Episode', 'nominee': 'Chris Long & Bruno Heller', 'character_id': '', 'result': 'Won'},
    {'award_id': 'aw_11', 'show_id': 'the_mentalist', 'season_no': 7, 'episode_id': 'tm_s07e13', 'year': 2015, 'award_body': 'People\'s Choice Awards', 'category': 'Favorite TV Crime Drama', 'nominee': 'The Mentalist', 'character_id': '', 'result': 'Nominated'},
    {'award_id': 'aw_12', 'show_id': 'the_mentalist', 'season_no': 7, 'episode_id': 'tm_s07e13', 'year': 2015, 'award_body': 'Crime Thriller Awards UK', 'category': 'Best International TV Drama', 'nominee': 'The Mentalist', 'character_id': '', 'result': 'Won'}
]

with open('data/awards.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=awards_data[0].keys())
    writer.writeheader()
    writer.writerows(awards_data)

print(f"Generated datasets: shows (1), seasons ({len(seasons_data)}), episodes ({len(episodes_data)}), characters ({len(characters_data)}), season_cast ({len(season_cast_data)}), awards ({len(awards_data)})")
