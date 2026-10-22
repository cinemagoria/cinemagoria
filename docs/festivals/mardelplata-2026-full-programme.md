# Mar del Plata 2026 — Full Programme (Batch 7)

Audit trail for the import of the festival's full programme, published on
19 October 2026. It records what changed in `festival_films` and
`festival_screenings`, where each change came from, and how to verify it.
Tracked in #595 (parent #258).

## Source

The programme page on the festival's own site is rendered from a JSON endpoint:

```
GET https://mardelplatafilmfest.com/41/wp-json/mdqfp/v1/program?page=N&per_page=10
```

It returns 188 titles in 31 sections, each with its synopsis, poster and
screenings. Every title has its own page at
`https://mardelplatafilmfest.com/41/es/programas/?film_id=<id>`, which is now
the `source_url` of its row.

## What changed

| Change | Rows |
| --- | ---: |
| Titles added | 115 |
| Screenings added | 481 |
| `source_url` moved to the film's official page | 73 |
| `category` moved to the official section name | 51 |
| `runtime_minutes` set to the official runtime (11 were empty) | 39 |
| `description` set to the official synopsis | 73 |
| `image_url` filled with the official poster | 6 |
| `title` aligned with the official page | 7 |
| `director` completed with co-directors or corrected | 3 |

All 73 rows already in the catalog are in the official programme, and none was
removed.

**Titles.** A row keeps its title when it matches the official page in either
language. Five were stored under a press translation that appears on neither,
and two differed in punctuation. They now carry the title of the official page.

**Sections.** `category` holds the festival's Spanish section name as published.
The three Panorama strands lose the `Panorama – ` prefix, because the programme
lists them as sections of their own. The retrospective and the lifetime
achievement groups split into the sections the festival uses for each title.

**New rows.** Each one carries the official title, director, runtime, synopsis,
poster and film page. `source_id` follows `mardelplata-2026-<slug>`. The seven
*Proyecciones institucionales* are short-film programmes and are stored as one
row each, under their published title. The six works in progress of the
*En tránsito* competition have no runtime in the official programme.

**TMDB.** A `tmdb_id` was set only when the TMDB entry's title and every
director match the official page, and its runtime, year and production
countries, wherever TMDB lists them, agree with it. 60 of the 115 new titles
qualify. The other 55 are stored without one, together with the three older
rows that still have no TMDB entry. Most of them are this year's premieres in
competition, and they can be matched once TMDB lists them.

**Screenings.** 481 screenings from 6 to 15 November in 11 rooms.
`start_time` is the official date and time with a `-03:00` offset,
`time_zone` is `ART`, and `venue` is the room as published. Every title has at
least one screening except *Katyn*, which has none in the official programme.

No other festival's rows were touched. A rollback snapshot of every row and
screening of this festival was written before the import.

## State after the import

| Section | Titles | Screenings |
| --- | ---: | ---: |
| Perlas: obras destacadas de los Festivales Nacionales | 22 | 22 |
| Competencia latinoamericana de largometrajes | 14 | 42 |
| Competencia internacional de largometrajes | 14 | 42 |
| Competencia argentina de largometrajes | 12 | 36 |
| Proyecciones especiales | 10 | 18 |
| Luces Nórdicas | 10 | 30 |
| Ganadoras de grandes festivales | 9 | 27 |
| Competencia latinoamericana de cortometrajes | 8 | 24 |
| Competencia argentina de cortometrajes | 8 | 24 |
| Competencia Internacional de cortometrajes | 8 | 24 |
| Autores | 8 | 24 |
| Proyecciones institucionales | 7 | 7 |
| Nuevos autores | 6 | 18 |
| España en la pantalla | 6 | 18 |
| Competencia En tránsito (WIP) | 6 | 6 |
| Pequeños y jóvenes espectadores | 5 | 20 |
| Cine Contemporáneo israelí | 5 | 15 |
| Hora cero | 4 | 12 |
| Homenaje a Héctor Babenco | 4 | 12 |
| Homenaje a Andrzej Wajda | 4 | 6 |
| Actrices de la Época Dorada del Cine Japonés | 4 | 12 |
| Estados Alterados | 3 | 9 |
| 50 Años del estreno | 3 | 9 |
| Película de Apertura | 1 | 2 |
| Película de Clausura | 1 | 3 |
| Homenaje a Eduardo Mignogna | 1 | 3 |
| Clásicos nacionales | 1 | 3 |
| Banda Sonora Original (BSO) presenta | 1 | 3 |
| Astor a la trayectoria: Emilio Kauderer | 1 | 3 |
| Astor a la trayectoria: Alejandro Agresti | 1 | 3 |
| Astor a la trayectoria: Natalia Oreiro | 1 | 4 |
| **Total** | **188** | **481** |

130 rows have a `tmdb_id`. Screenings per day:

| Day | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Screenings | 45 | 47 | 50 | 59 | 52 | 57 | 51 | 64 | 45 | 11 |

## Page

`pages/festival/mardelplata-2026/index.vue`:

* `CATEGORY_ORDER` lists the 31 official sections: opening and closing, the
  seven competitions, the out-of-competition sections, and the tributes. The
  catalog shows the festival's own English section names.
* The Info tab's glossary describes every section, and the programme status
  note describes the final programme.
* The early-lineup notice is turned off.
* The Schedule tab fills from `/api/festival/mardelplata/schedule`.

## Verification queries

```sql
-- Titles, sections and rows without a section (expected: 188, 31, 0)
SELECT COUNT(*), COUNT(DISTINCT category), SUM(category IS NULL)
FROM festival_films
WHERE festival_name = 'Mar del Plata International Film Festival'
  AND festival_year = 2026;

-- Rows whose source_url is not their official page (expected: 0)
SELECT COUNT(*) FROM festival_films
WHERE festival_name = 'Mar del Plata International Film Festival'
  AND festival_year = 2026
  AND source_url NOT LIKE 'https://mardelplatafilmfest.com/41/es/programas/?film_id=%';

-- Screenings and screenings without the -03:00 offset (expected: 481, 0)
SELECT COUNT(*), SUM(s.start_time NOT LIKE '%-03:00')
FROM festival_screenings s
JOIN festival_films f ON f.id = s.film_id
WHERE f.festival_name = 'Mar del Plata International Film Festival'
  AND f.festival_year = 2026;
```

## Still to come

The awards, after the closing ceremony on 15 November.
