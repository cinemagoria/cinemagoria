# Thessaloniki 2026 — Awards

Audit trail for the palmarès of the 67th edition, announced at the closing
ceremony on 15 November 2026. Tracked in #623 (parent #545).

## What was seeded

15 rows in `festival_awards` for `festival_slug = 'thessaloniki-2026'`, across
12 films and the festival's three competitions, bilingual on every row. Source:
[Variety's report of the ceremony](https://variety.com/2026/film/global/thessaloniki-awards-a-day-in-the-life-of-jo-wins-1236948029/),
published the same afternoon, before the festival posted its own list. Every
person name was checked against the film's TMDB credits.

| Section | Award | Film | Director | Recipient |
| --- | --- | --- | --- | --- |
| International Competition | Golden Alexander | A Day in the Life of Jo: Chapter Phaedra | Jacqueline Lentzou | |
| International Competition | Silver Alexander | Les Indes | Pauline Julier, Nicolas Chapoulier | Pauline Julier, Nicolas Chapoulier |
| International Competition | Best Actor | The Riverbank | Matheus Farias, Enock Carvalho | Caique Copque, Ítalo Martins |
| International Competition | Best Actress | Titanic Ocean | Konstantina Kotzamani | Arisa Sasaki |
| International Competition | Special Mention: Actress | A Day in the Life of Jo: Chapter Phaedra | Jacqueline Lentzou | Evita Andriopoulou |
| Meet the Neighbors+ | Golden Alexander: Meet the Neighbors+ | Dua | Blerta Basholli | |
| Meet the Neighbors+ | Silver Alexander: Meet the Neighbors+ | Chronicles from the Siege | Abdallah Al-Khatib | Abdallah Al-Khatib |
| Meet the Neighbors+ | Best Actor: Meet the Neighbors+ | Flesh and Fuel | Pierre Le Gall | Alexis Manenti, Julian Świeżewski |
| Meet the Neighbors+ | Best Actress: Meet the Neighbors+ | Hold Onto Me | Myrsini Aristidou | Maria Petrova |
| Meet the Neighbors+ | Best Screenplay: Meet the Neighbors+ | Flesh and Fuel | Pierre Le Gall | Pierre Le Gall |
| Film Forward | Golden Alexander: Film Forward | I Plant My Hand in the Garden | Hoda Taheri, Boris Hadžija | |
| Film Forward | Silver Alexander: Film Forward | Ponderosa | Rob Rice | Rob Rice |
| Film Forward | Best Artistic Achievement: Film Forward | Particles of Dust | Argyris Germanidis | |
| Film Forward | Best Actress: Film Forward | Ponderosa | Rob Rice | Alexis Bledel |
| Film Forward | Best Actor: Film Forward | Under the Judas Tree | Christos Houliaras | Alexis Kalofolias |

Every winner is in the catalog, so every row carries its catalog id and TMDB
identifier, and every card has a poster. The carousel groups prizes by film, so
the 15 rows render as 12 cards.

### Award names

The carousel shows the award name and never its section, and each competition
hands out its own Golden and Silver Alexander. The International Competition
keeps the plain names, as the festival's main competition; Meet the Neighbors+
and Film Forward carry the competition in the name (`Golden Alexander: Film
Forward`). In Spanish the prize is the Alejandro de Oro and de Plata
(`Alejandro de Oro: Meet the Neighbors+`). The Silver Alexander is the best
director prize in all three competitions, so its rows name the directors as
recipients. The longest name is 39 characters, inside the carousel's
42-character budget, and no two names repeat.

## Out of scope

- The honorary Golden Alexanders of this edition, which attach to people rather
  than titles.
- The Agora awards of 11 November, which go to projects in development.
- The festival's other prizes (the Greek Film Festival's awards, the parallel
  juries and the audience awards). The parent integration scoped this batch to
  the three competitions, and the source lists only those.

## Frontend

No page change. `WinnersCarousel` was already wired on the festival page and
started rendering as soon as the rows existed. The homepage rotating banner
expires on its own at the end of the closing day.

## Verification

`/api/festival/thessaloniki/awards` returns the 15 rows on both locales,
localized on the Spanish one (`Alejandro de Oro`, `Mejor Actriz: Film
Forward`, …), each with a poster.

```sql
-- Seeded rows (expected: 15 rows, 15 with film_id, 3 sections)
SELECT COUNT(*), COUNT(film_id), COUNT(DISTINCT award_section) FROM festival_awards
WHERE festival_slug = 'thessaloniki-2026';
```
