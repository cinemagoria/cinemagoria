# BARS 2026 — Official Programme (Batch 2)

Audit trail for the import of 10 November 2026, from the festival's official
programme at `https://www.festivalrojosangre.com.ar/programacion/`. Tracked in
#616 (parent #259).

## Why

The catalog held no rows for the 27th Buenos Aires Rojo Sangre (19 – 29
November, Atlas Caballito). The festival has published its full programme with
screenings: 16 sections, 94 programme entries and 146 screenings.

## Source

The programme page embeds the whole programme as data, and every film page
carries the same data, so the page was downloaded once and parsed offline. Each
entry gives the title as the festival publishes it (Spanish, sometimes with the
original title in brackets), year, countries, runtime, directors, section and
its screenings with day, time, cinema and screen.

Three kinds of entry group several films:

* **Competition short-film blocks** (4) list their shorts as data, each with
  its own credits.
* **Out-of-competition short-film blocks** (14) list their shorts only in the
  synopsis, one credit line per short (title, directors, country, year,
  runtime). Two lines with a credit wrapped onto the next line were joined, and
  two lines printed without a separator were split as their TMDB entries
  (title and directors) show.
* **Weekend micro-short contest blocks** (6) list around 17 shorts each,
  signed by production teams, with no director or year.

The first two kinds are split into **one row per short**, each carrying the
block's screenings and the block page as `source_url`. The shorts of every split
block add up to the block's running time (to the minute, one block within a
minute of rounding), which shows no short was missed. The contest blocks stay
one row each.

## What was imported

`festival_name = 'Buenos Aires Rojo Sangre'`, `festival_year = 2026`, with
`category` carrying the festival's own section names in Spanish and `title` in
the form the festival publishes. A print-format note after a title ("35 mm",
"16 mm") is not part of the title and was dropped.

| Section | Titles | With `tmdb_id` | Screenings |
| --- | ---: | ---: | ---: |
| Competencia Internacional | 13 | 13 | 26 |
| Competencia Iberoamericana | 8 | 7 | 16 |
| Competencia Argentina | 9 | 7 | 18 |
| Cortos en competencia | 23 | 14 | 23 |
| Funciones especiales | 3 | 3 | 4 |
| Novedades | 13 | 13 | 21 |
| Invasión Japón | 3 | 2 | 6 |
| Documental | 3 | 3 | 5 |
| Panorama Bizarro | 5 | 4 | 10 |
| Panorama latino | 2 | 1 | 4 |
| Sarli en fílmico | 3 | 3 | 3 |
| Monstruos del más acá | 2 | 2 | 3 |
| La Cripta | 5 | 5 | 5 |
| Clásicos del nuevo fantástico argentino | 1 | 1 | 1 |
| Cortos fuera de competencia | 112 | 46 | 112 |
| Fin de semana sangriento | 6 | 0 | 6 |
| **Total** | **211** | **124** | **263** |

The screenings column counts one screening per row, so a block screening is
counted once per short; the festival holds **146 screenings**, all of them
present (same day, time and screen).

| Venue | Screenings (per row) | Distinct screenings |
| --- | ---: | ---: |
| Atlas Caballito 6 | 149 | 43 |
| Atlas Caballito 8 | 54 | 43 |
| Atlas Caballito 9 | 41 | 41 |
| Atlas Caballito 7 | 18 | 18 |
| Atlas Caballito (screen not given) | 1 | 1 |

Screenings run from 19 to 29 November in Buenos Aires time (`-03:00`, `ART`).

### Identifiers

* `source_id` is `bars-2026-<slug of the official page>` for films and blocks,
  and `bars-2026-<slug of the title>` for split shorts.
* `source_url` is the official page of the film or of the short's block.
* `image_url` is the TMDB poster when matched, otherwise the festival's still.

## Matching rule

A match needs the same **director** (spelling variants and name order
included; at least one director when there are several), the same **title**
and a release within two years of the festival's. Because the festival lists
films under their Spanish release titles, a title also matches TMDB's Spanish
translations and its Latin American, Spanish and English-language alternative
titles. When several films by a director resemble the title (a numbered
sequel), only the exact title counts.

119 titles matched automatically. 27 of the ids were already on other
festivals' rows in the catalog with the same title and director, which
confirms them.

Five more matched by hand under the same rule, each with its evidence kept in
the build script: four whose festival title is a literal Spanish (or
romanised) form of the TMDB title, with the same director, year and countries,
and one whose TMDB title only adds a leading article.

**87 rows are stored without `tmdb_id`**: 81 films and shorts with no TMDB entry
meeting the rule (most are recent Argentine shorts, and two candidates are
undated with a different country or no credits), plus the six contest blocks.
They stay off the catalog and remain in the schedule. Identifiers confirmed by
hand later are applied with the shared `tmdb_id` script.

## State after the import

* 211 titles in 16 sections and 263 screening rows (146 screenings), from 19 to
  29 November.
* 124 rows with `tmdb_id`, all enriched (`tmdb_data` and poster).

A rollback snapshot was written before the write. The import is
festival-scoped: the table went from 4,538 to 4,749 rows, all 211 new rows
under this festival, and no other festival's rows changed. A second run
changes nothing.

## Verification queries

```sql
SELECT category, COUNT(*) AS titles, SUM(tmdb_id IS NOT NULL) AS with_tmdb
FROM festival_films
WHERE festival_name = 'Buenos Aires Rojo Sangre' AND festival_year = 2026
GROUP BY category ORDER BY titles DESC;

SELECT COUNT(*) AS screening_rows, COUNT(DISTINCT s.start_time || s.venue) AS screenings,
       MIN(s.start_time), MAX(s.start_time)
FROM festival_screenings s JOIN festival_films f ON f.id = s.film_id
WHERE f.festival_name = 'Buenos Aires Rojo Sangre' AND f.festival_year = 2026;

-- duplicate screenings (expect none)
SELECT s.film_id, s.start_time, s.venue, COUNT(*) AS n
FROM festival_screenings s JOIN festival_films f ON f.id = s.film_id
WHERE f.festival_name = 'Buenos Aires Rojo Sangre' AND f.festival_year = 2026
GROUP BY 1, 2, 3 HAVING n > 1;
```
