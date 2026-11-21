# JAFF 2026 — Official Programme (Batch 2)

Audit trail for the import of 21 November 2026, from the festival's film index
at `https://jaff-filmfest.org/program/index/`. Tracked in #636 (parent #633).

## Why

The catalog held no rows for the 21st Jogja-NETPAC Asian Film Festival (28
November – 5 December, Yogyakarta). The festival published its whole programme
on 6 November: an A–Z index of 255 film pages, with screenings for every
film.

## Source

Every film page carries its section, the English title, the original title, a
"runtime | year | countries | genre | language" line, a credits table with the
director, the festival's still and its screenings (day, time, cinema and
studio). The 255 pages were downloaded and parsed offline.

* Every page has a Director credit, and every title matches the page's own
  metadata. The stored director is the page's credit.
* Two pages print the runtime in Indonesian ("102 menit") or not at all (a
  stand-up comedy show); both are read.
* One page, the MD NEXT WAVE presentation, carries no film data and is skipped.

## Editorial scope

* The opening film (*Silenced Nights*) and the closing film (*You Are The
  Film*) are out of coverage.
* Only titles with a confirmed TMDB entry are stored. Earlier festivals also
  stored unmatched rows without `tmdb_id`; here the 38 titles a manual review
  found without a TMDB entry are left out: community and kids shorts, series
  episodes, a stand-up comedy show and a talk-show screening.

That leaves 252 programme titles in 34 sections, of which 214 are imported.

## What was imported

`festival_name = 'Jogja-NETPAC Asian Film Festival'`, `festival_year = 2026`,
with `category` carrying the festival's own section names and `title` in the
English form the festival publishes. One title follows the review: *Casparina*,
which the page heads "A Special Presentation: CASPARINA".

| Section | In programme | Imported | Screenings |
| --- | ---: | ---: | ---: |
| Asian Perspectives Shorts | 28 | 27 | 54 |
| Asian Perspectives Features | 26 | 26 | 31 |
| Light of Asia | 21 | 21 | 42 |
| JAFF Kids | 17 | 7 | 7 |
| Nocturnal | 15 | 15 | 15 |
| Panorama | 12 | 12 | 14 |
| Emerging | 12 | 12 | 12 |
| Indonesian Film Showcase | 11 | 10 | 10 |
| Main Competition | 10 | 9 | 17 |
| Indonesian Screen Awards | 10 | 10 | 18 |
| Rewind | 10 | 10 | 10 |
| Layar Komunitas | 10 | 2 | 2 |
| Transcendence | 7 | 7 | 7 |
| Singapore Youth Film Festival | 6 | 6 | 6 |
| Special Screening: Premiere Film LAIndieMovie 2026 | 6 | 3 | 3 |
| Panorama Shorts | 5 | 5 | 5 |
| Hong Kong Film Gala Presentation | 5 | 5 | 5 |
| Cinematic Concert: Grrrl Gang | 5 | 5 | 5 |
| Jogja Showcase | 5 | 3 | 3 |
| Rewind: Romance as a Generational Memory | 5 | 5 | 5 |
| Layar Indonesiana | 4 | 4 | 4 |
| Vidio | 4 | 0 | 0 |
| Layar Anak Indonesiana.Tv Tahun 2026 | 4 | 0 | 0 |
| MAXStream TV Secinta itu Sama Sinema 2026 | 3 | 1 | 1 |
| Undercurrent: Special Screening Presented by Amar Bank | 2 | 2 | 2 |
| Nine single-title sections | 9 | 7 | 8 |
| **Total** | **252** | **214** | **286** |

The screenings column counts one screening per row, so a shorts programme is
counted once per short; the 286 rows hold **156 distinct screenings**.

| Venue | Screenings (per row) | Distinct screenings |
| --- | ---: | ---: |
| Empire XXI, Studio 5 | 70 | 26 |
| Empire XXI, Studio 2 | 64 | 26 |
| Empire XXI, Studio 4 | 48 | 25 |
| Empire XXI, Studio Premiere | 42 | 27 |
| Empire XXI, Studio 3 | 32 | 26 |
| Empire XXI, Studio 1 | 30 | 26 |

Screenings run from 29 November to 5 December in Yogyakarta time (`+07:00`,
`WIB`).

### Identifiers

* `source_id` is `jaff-2026-<slug of the official film page>`.
* `source_url` is the official film page.
* `image_url` is the TMDB poster (every row is matched).

## Matching rule

A match needs the same **director** (spelling variants, name order and
transliteration included; at least one director when there are several), the
same **title** (English, original, or a TMDB translation or alternative title)
and a release within two years of the festival's. When several films by a
director resemble the title, only the exact title counts.

207 titles matched automatically. 56 of the ids were already on other
festivals' rows in the catalog with the same title and director, which confirms
them. Compared with an independent listing of the lineup with TMDB ids, 203
agree, three are entries TMDB added since, and one listing id was wrong (*The
Chair*: a different five-minute short with no director).

Seven more were confirmed by hand from the review file; the ids are kept in the
build script.

Every stored director was checked against the directors of its TMDB entry:
none is a cast member, and five differ only in transliteration (Li Jingyu is
listed on TMDB as Johnnie Li, with the Chinese name as an alias).

## State after the import

* 214 titles in 30 sections and 286 screening rows (156 screenings), from 29
  November to 5 December.
* All 214 rows carry `tmdb_id`, `tmdb_data`, poster and runtime; 115 carry
  `imdb_id`.

A rollback snapshot was written before each of the two writes (the automatic
matches, then the ids confirmed by hand). The import is festival-scoped: the
table went from 4,764 to 4,978 rows, all 214 new rows under this festival, and
no other festival's rows changed. A second run changes nothing.

## Verification queries

```sql
SELECT category, COUNT(*) AS titles, SUM(tmdb_id IS NOT NULL) AS with_tmdb
FROM festival_films
WHERE festival_name = 'Jogja-NETPAC Asian Film Festival' AND festival_year = 2026
GROUP BY category ORDER BY titles DESC;

SELECT COUNT(*) AS screening_rows, COUNT(DISTINCT s.start_time || s.venue) AS screenings,
       MIN(s.start_time), MAX(s.start_time)
FROM festival_screenings s JOIN festival_films f ON f.id = s.film_id
WHERE f.festival_name = 'Jogja-NETPAC Asian Film Festival' AND f.festival_year = 2026;

-- duplicate screenings (expect none)
SELECT s.film_id, s.start_time, s.venue, COUNT(*) AS n
FROM festival_screenings s JOIN festival_films f ON f.id = s.film_id
WHERE f.festival_name = 'Jogja-NETPAC Asian Film Festival' AND f.festival_year = 2026
GROUP BY 1, 2, 3 HAVING n > 1;
```
