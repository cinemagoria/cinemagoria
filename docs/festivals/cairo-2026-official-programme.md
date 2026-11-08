# Cairo 2026 — Official Programme (Batch 2)

Audit trail for the import of 7 November 2026, from the festival's official
programme at `https://www.ciff.org.eg/en/program`. Tracked in #610 (parent #432).

## Why

The catalog held no rows for the 47th Cairo International Film Festival
(11 – 20 November). The festival has published its programme on its website:
15 sections, each with its films, and a page per film with its credits and
screenings. There is no separate online timetable; the film pages are the only
source of screening times.

## Source

Every section page and every film page was downloaded once, in English and in
Arabic, and parsed offline. Each English film page gives the title, the original
title when it differs, director, country, runtime and a "Screenings" block with
the day, start and end time and venue of each screening. The Arabic page gives
the Arabic title and the director's name in Arabic. The pages carry no
production year.

## What was imported

**158 titles** and **223 screenings**, `festival_name = 'Cairo International Film Festival'`,
`festival_year = 2026`, with `category` carrying the festival's own section name.
`source_id` is `cairo-2026-<slug of the official film page>`, and `source_url`
is that page.

| Section | Titles | With `tmdb_id` | Screenings |
| --- | ---: | ---: | ---: |
| Opening Film | 1 | 1 | 1 |
| International Competition | 12 | 12 | 25 |
| Horizons of Arab Cinema | 7 | 7 | 16 |
| Short Film Competition | 24 | 22 | 0 |
| Critics Week | 7 | 7 | 14 |
| International Panorama | 12 | 12 | 25 |
| Special Screenings | 13 | 12 | 27 |
| Cairo Classics | 17 | 16 | 20 |
| Midnight Screenings | 4 | 4 | 8 |
| Restored Egyptian Classics | 29 | 29 | 47 |
| Egyptian Panorama | 5 | 5 | 0 |
| Official Selection – Out of Competition | 16 | 16 | 32 |
| Cairo Kids | 11 | 11 | 8 |
| **Total** | **158** | **154** | **223** |

Ten documentaries compete for the Feature Documentary Award, which the festival
lists as a section of its own. All ten also belong to another section, and
`source_id` is unique, so each keeps its programme section. The page's glossary
says so.

Screenings run from 12 to 20 November, in Egypt's local time (`+02:00`, `EET`;
Egypt left daylight saving time on the last Thursday of October). 117 titles
have screening times. The Short Film Competition and 17 other titles have
none yet: their pages list no screenings so far.

| Venue | Screenings |
| --- | ---: |
| Opera House - Hanager Cinema | 30 |
| Opera House - Hanager Theatre | 27 |
| Opera House - Small Theatre | 27 |
| Zamalek Cinema 1 | 25 |
| Opera House - Grand Hall | 24 |
| Zawya Cinema 1 | 20 |
| Zawya Cinema 2 | 15 |
| Zamalek Cinema 2 | 15 |
| Tahrir Cinema | 13 |
| Vox – Mall Masr (4) | 8 |
| Vox - Almaza Mall (5) | 7 |
| Vox – Mall Masr (12) | 6 |
| Vox - Almaza Mall (7) | 6 |
| **Total** | **223** |

Not imported: Cairo's XR, the immersive programme (7 works), which is not
film.

Coverage: `tmdb_id` 157/158, `director` 158/158, `imdb_id` 125/158,
`runtime_minutes` 121/158. One collective film lists a production credit
before its six directors; only the directors are stored.

## Matching rule

A match needs the same **director** (spelling variants, name order and
transliteration included), the same **title** (English, original or Arabic) and
a release within two years of the festival's. The pages carry no year, so the
two classics sections accept any year, and a classic matches only when a single
film by that director has that title; a remake by the same director falls to
manual review.

153 titles matched automatically. 57 of the ids were already on other
festivals' rows in the catalog with the same title and director, which
confirms them.

Four more matched by hand under the same rule, each with its evidence kept in
the build script:

* a classic whose director's name is transliterated differently: TMDB lists
  the festival's spelling, and the Arabic name from the festival's Arabic page,
  among the person's names;
* a classic whose director also made a remake with the same title: the
  festival's country and language identify the original;
* two shorts that TMDB lists twice: the entry with the festival's original
  title, poster and synopsis was chosen.

One short matched on director and title, but its TMDB entry is undated and its
runtime and synopsis differ from the festival's. It is stored without
`tmdb_id`, so it stays off the catalog until confirmed.

Every match was then re-checked independently against TMDB (directors,
titles, alternative titles and years) before the write.

## State after the import

* 158 titles in 13 sections and 223 screenings, from 12 to 20 November.
* 157 rows with `tmdb_id`, all enriched (`tmdb_data` and poster). The catalog
  lists those; the schedule lists every screening.

A rollback snapshot was written before the write. The import is
festival-scoped: the table went from 4,380 to 4,538 rows, all 158 new rows
under this festival, and no other festival's rows changed. A second run
changes nothing.

## Verification queries

```sql
SELECT category, COUNT(*) AS titles, SUM(tmdb_id IS NOT NULL) AS with_tmdb
FROM festival_films
WHERE festival_name = 'Cairo International Film Festival' AND festival_year = 2026
GROUP BY category ORDER BY titles DESC;

SELECT COUNT(*) AS screenings, MIN(s.start_time), MAX(s.start_time)
FROM festival_screenings s JOIN festival_films f ON f.id = s.film_id
WHERE f.festival_name = 'Cairo International Film Festival' AND f.festival_year = 2026;

-- duplicate screenings (expect none)
SELECT s.film_id, s.start_time, s.venue, COUNT(*) AS n
FROM festival_screenings s JOIN festival_films f ON f.id = s.film_id
WHERE f.festival_name = 'Cairo International Film Festival' AND f.festival_year = 2026
GROUP BY 1, 2, 3 HAVING n > 1;
```
