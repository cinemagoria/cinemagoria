# BFI London 2026 — Awards (Batch 6)

Audit trail for the palmarès of the 70th edition, announced on 18 October 2026.
Tracked in #502 (parent #257).

## What was seeded

Seven rows in `festival_awards` for `festival_slug = 'bfi-2026'`, bilingual on
every row, taken from the festival's
[competition winners announcement](https://www.bfi.org.uk/london-film-festival/news/competition-winners-announced-70th-bfi-london-film-festival).

| Section | Award | Film | Director |
| --- | --- | --- | --- |
| Official Competition | Best Film Award | Imperium | Sergei Loznitsa |
| First Feature Competition | Sutherland Award | 9 Temples to Heaven | Sompot Chidgasornpongse |
| First Feature Competition | Special Mention | Masc | Bertil Nilsson |
| Documentary Competition | Grierson Award | Concrete Land | Asmahan Bkerat |
| Documentary Competition | Special Mention | Queer Edward II | Theo Rollason |
| Short Film Competition | Short Film Award | Aman | Rahul Roye |
| Short Film Competition | Special Mention | Daughters of the Late Colonel | Elizabeth Hobbs |

Every winner and mention is in the catalog, so every row carries its catalog id
and TMDB identifier, and every card has a poster. Mentions are suffixed
(`Grierson Award – Special Mention`) so the chip never collapses to the winner's
name once the section is hidden. The longest name is 41 characters, inside the
carousel's 42-character budget.

## Out of scope

The two Audience Awards, Best Feature Film and Best British Discovery, close
their public vote on 21 October and are announced later. They are not part of
the four competitive strands this batch covers. Honorary and career prizes are
excluded.

## Frontend

No page change. `WinnersCarousel` was already wired on the festival page and
started rendering as soon as the rows existed. The festival left the homepage
rotating banner in `f5ce30c0` / `39076654`.

## Verification

`/api/festival/bfi/awards` returns the seven rows on both locales, localized on
the Spanish one (`Premio a la Mejor Película`, `Premio Grierson – Mención
Especial`, …), each with a poster.

```sql
-- Seeded rows (expected: 7 rows, 7 with film_id, 4 sections)
SELECT COUNT(*), COUNT(film_id), COUNT(DISTINCT award_section) FROM festival_awards
WHERE festival_slug = 'bfi-2026';
```
