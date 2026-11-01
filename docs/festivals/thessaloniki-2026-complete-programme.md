# Thessaloniki 2026 — Complete Programme (Batch 8)

Audit trail for the import of 1 November 2026, from the festival's official
A–Z guide (`TIFF67_AZ.pdf`). Tracked in #605 (parent #545).

## Why

The catalog held 102 titles in 12 sections and no screenings: the tributes, the
Greek selection and the children's section announced in October. The festival
then published its complete programme as a printed A–Z guide, with every title,
its section and its screenings. The online A–Z page is still empty.

## Source

The guide is a 244-page bilingual PDF. Its official selection is grouped by
section, and each entry gives the English and Greek titles, director,
production countries, year, runtime, synopsis and an `ON-SITE` line with the
dates, venues and times of its screenings. The text was extracted with its page
positions, read column by column, and every screening was checked against the
day-by-day timetable printed in the same guide; the few not named there belong
to short film programmes, which the timetable lists by programme.

## What was imported

**137 titles** that were not in the catalog yet. The source URL is the guide.

| Section | Titles |
| --- | ---: |
| Open Horizons | 57 |
| Special Screenings | 20 |
| >>Film Forward | 8 |
| Round Midnight | 8 |
| International Competition | 7 |
| Meet the Neighbors+ | 7 |
| Smart7 | 7 |
| Taming Time | 6 |
| Tribute to Emin Alper | 5 |
| Welcome to the Desert | 4 |
| Spotlight on Laura Mulvey | 4 |
| Bauhaus Cinema | 3 |
| Greek Special Screenings | 1 |
| **Total** | **137** |

A title listed in two sections keeps the first one, and the earlier rows keep
the section they entered with, as in other festivals. The three earlier rows
that came in as Greek special screenings move to a section of their own, so
that "Special Screenings" holds the festival's main out-of-competition
programme.

**312 screenings** for 229 titles, from 5 to 15 November, with the venue, in
Greek local time (`+02:00`, `EET`).

| Venue | Screenings |
| --- | ---: |
| John Cassavetes | 59 |
| Tonia Marketaki | 45 |
| Frida Liappa | 45 |
| Pavlos Zannas | 42 |
| Makedonikon | 39 |
| Olympion | 38 |
| Stavros Tornes | 38 |
| Kanellopoulos | 6 |
| **Total** | **312** |

Not imported: the series programme and the immersive works, which are not
films; the online-only availability windows; and the NextGen school screenings,
which are not open to the public.

## Matching rule

A match needs the same **director** (spelling variants, name order and
transliteration included), the same **title** and a release within two years of
the festival's. 136 of the 137 new titles matched. 94 of those ids were already
on other festivals' rows in the catalog, which confirms them. One earlier short
gained its `tmdb_id` under the same rule.

## State after the import

* 239 titles in 20 sections and 312 screenings.
* 232 rows with `tmdb_id`. The 7 without one have no TMDB entry yet.

A rollback snapshot was written before the write. The import is
festival-scoped: earlier rows changed only in the section rename and the one
`tmdb_id`, and no other festival's rows were touched. A second run changes
nothing.

## Verification queries

```sql
-- Whole festival (expected: 239 / 312)
SELECT COUNT(DISTINCT f.id), COUNT(s.id) FROM festival_films f
LEFT JOIN festival_screenings s ON s.film_id = f.id
WHERE f.festival_name = 'Thessaloniki International Film Festival' AND f.festival_year = 2026;

-- Titles per section
SELECT category, COUNT(*) FROM festival_films
WHERE festival_name = 'Thessaloniki International Film Festival' AND festival_year = 2026
GROUP BY category ORDER BY 2 DESC;
```
