# Tallinn Black Nights 2026 — Programme Correction (Batch 10)

Audit trail for the check of 10 November 2026, when every film page on the
festival's site was compared with the catalog and the schedule. Tracked in #620
(parent #546).

## Why

The festival numbers the films inside a programme block (a page that lists
several films and screens them together) in the same series as its own film
pages, so a short in a block and a film with its own page can share an id.
Earlier imports keyed each row by that id, so when two films shared one, the
second was folded into the first: its own row was never created and its
screenings were attached to the first row.

Thirteen ids were shared that way, twelve by a short of the #youngfilmmaker
blocks and one by the opening film inside the opening-ceremony block.

## What changed

| Change | Titles | Screenings |
| --- | ---: | ---: |
| Titles added: shared an id with a block short or the opening film | 13 | 35 |
| Titles added: series published since the last import | 2 | 2 |
| Screenings removed from block shorts and the opening film | 11 | 33 |
| `tmdb_id` set on rows stored without one | 6 | — |

The 33 removed screenings belong to the added titles, which now carry them.
Two of the shared ids had folded a title with a single screening into a short
that kept only its block's screening, so their screenings were missing rather
than misattributed.

The 15 added titles by section:

| Section | Titles | Screenings |
| --- | ---: | ---: |
| Best of Festivals | 7 | 21 |
| TV Beats Screenings | 4 | 4 |
| Midnight Shivers | 2 | 6 |
| Best of Docs | 1 | 3 |
| Standing with Ukraine | 1 | 3 |
| **Total** | **15** | **37** |

TV Beats Screenings is new in the catalog: series from the festival's industry
programme, screened once each. They are stored like the series of other
festivals, enriched from TMDB's TV endpoint, so their cards open the series
page.

### Identifiers

* A film page whose id is taken by a short inside a block is keyed by its page
  slug: `tallinn-2026-<slug>`. The short keeps the numeric id it already had, so
  no existing row was re-keyed.
* `source_url` is the film's own page on the festival's site.

### Matching

`tmdb_id` is set on 14 of the 15 added titles: the 11 films where director,
title and release year agree, and 3 series matched to their TMDB TV entries by
creator and title. The fourth series has no TMDB entry yet.

The rows already stored without `tmdb_id` were matched again under the same
rule: 6 now have one. Three more had a candidate that only shared the title,
or the director with a different title, and stay without one.

## State after the correction

* 513 titles in 40 sections and 1,055 screenings, from 6 to 22 November.
  Every screening on the festival's site is attached to the title it belongs
  to, and the catalog holds no screening the site does not list.
* 438 rows with `tmdb_id`, up from 418.

A rollback snapshot was written before each write. The correction is
festival-scoped: no other festival's rows changed, and a second run changes
nothing.

## Festival page

* TV Beats Screenings joins the catalog order and the Info tab's glossary, with
  a localized label on the Spanish frontend.
* The page requested 400 titles from the catalog, fewer than the 418 matched
  titles it already held, so the last ones in alphabetical order were not
  shown. It now requests 1,000.
* The programme status note carries the new totals.

## Verification queries

```sql
SELECT COUNT(*) AS titles, COUNT(DISTINCT category) AS sections, SUM(tmdb_id IS NOT NULL) AS with_tmdb
FROM festival_films
WHERE festival_name = 'Tallinn Black Nights Film Festival' AND festival_year = 2026;

SELECT COUNT(*) AS screenings
FROM festival_screenings s JOIN festival_films f ON f.id = s.film_id
WHERE f.festival_name = 'Tallinn Black Nights Film Festival' AND f.festival_year = 2026;

-- duplicate screenings (expect none)
SELECT s.film_id, s.start_time, s.venue, COUNT(*) AS n
FROM festival_screenings s JOIN festival_films f ON f.id = s.film_id
WHERE f.festival_name = 'Tallinn Black Nights Film Festival' AND f.festival_year = 2026
GROUP BY 1, 2, 3 HAVING n > 1;
```
