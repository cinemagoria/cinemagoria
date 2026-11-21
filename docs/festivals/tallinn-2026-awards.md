# Tallinn Black Nights 2026 — Awards

Audit trail for the palmarès of the 30th edition (PÖFF 30), published by the
festival on 20 November 2026. Tracked in #629 (parent #546).

## What was seeded

30 rows in `festival_awards` for `festival_slug = 'tallinn-2026'`, across 28
films, the festival's seven competitions and its parallel and audience awards,
bilingual on every row. Source: the festival's
[winners post](https://poff.ee/en/news/p-oe-ff-30-announced-the-winners/),
cross-checked against
[escribiendocine.com's report](https://www.escribiendocine.com/noticias/2026/11/20/26928-todos-los-ganadores-de-los-premios-del-festival-de-tallin-2026).
The two agree on every winner. Person names were checked against the film's
TMDB credits where TMDB lists them; otherwise the festival's spelling is kept.

| Section | Award | Film | Director | Recipient |
| --- | --- | --- | --- | --- |
| Official Selection – Competition | Grand Prix for Best Film | On Top of the Cliff | Enrica Pérez | |
| Official Selection – Competition | Best Director | A Job Well Done | Fred Baillif | Fred Baillif |
| Official Selection – Competition | Best Actress | On Top of the Cliff | Enrica Pérez | Bianca Bucelli |
| Official Selection – Competition | Best Actor | The Assignment | Patrice Toye | Mathisse De Sutter |
| Official Selection – Competition | Best Screenplay | The Matriarch | Alison Kuhn | Alison Kuhn |
| Official Selection – Competition | Best Cinematography | One Sweet Hour | Declan Recks | Owen McPolin |
| Official Selection – Competition | Best Original Music | Caballé | Patricia Ortega | Beatriz López-Nogales |
| Official Selection – Competition | Best Production Design | Caballé | Patricia Ortega | Vanesa de la Haza |
| First Feature Competition | Best First Feature | When She Hears the Bells | Chabname Zariab | |
| First Feature Competition | Best Director: First Feature | Lionheart | Nagieb Khaja | Nagieb Khaja |
| First Feature Competition | Jury Special Award: First Feature (ex aequo) | Exotic | Sonja Orlewicz-Zakrzewska | |
| First Feature Competition | Jury Special Award: First Feature (ex aequo) | Oblivion | Danielius Minkevičius | |
| Critics' Picks Competition | Best Film: Critics' Picks | One Month | Maya Vitkova-Kosev | |
| Critics' Picks Competition | Best Director: Critics' Picks | The Great Family | Matías Meyer | Matías Meyer |
| Rebels with a Cause Competition | Best Film: Rebels with a Cause | Pop Pop | Dylan Stephen Levers | |
| Rebels with a Cause Competition | Best Director: Rebels with a Cause | Night Vision | Christopher Yates | Christopher Yates |
| Rebels with a Cause Competition | Best Rebel Short | If Only | Ada Güvenir | |
| Rebels with a Cause Competition | Special Mention: Rebels with a Cause | Arrow For a Stone Heart | Luiza Calagian | |
| Baltic Film Competition | Best Baltic Film | How to Divorce During the War | Andrius Blaževičius | |
| Baltic Film Competition | Best Director: Baltic Competition | The Child | Linda Olte | Linda Olte |
| Baltic Film Competition | Best Baltic Co-production | Vesna | Rostislav Kirpicenko | Stasys Baltakis, Helena Pokorny |
| Doc@PÖFF International Competition | Best Film: Doc@PÖFF International | The War We Carry | Kaspar Astrup Schröder | |
| Doc@PÖFF International Competition | Best Cinematography: Doc@PÖFF | Child of Sinaï | Loup Bureau | Loup Bureau |
| Doc@PÖFF International Competition | Special Award: Doc@PÖFF International | Father's House | Adam Nielsen, Andreas Koefoed, Eva Mulvad | |
| Doc@PÖFF Baltic Competition | Best Film: Doc@PÖFF Baltic | La Pietà | Pepe Andreu, Rafa Molés | |
| Doc@PÖFF Baltic Competition | Special Award: Doc@PÖFF Baltic | Riga my Love | Karolina Peterson | |
| Other Awards | FIPRESCI Prize | Princess | Christian Rojas | |
| Other Awards | NETPAC Award | White as Salt | Murat Eroğlu | |
| Other Awards | Audience Award | The Incomer | Louis Paxton | |
| Other Awards | Free World Award | No Paradise If You Are Killed By a Woman | Halkawt Mustafa | |

Every winner is in the catalog, so every row carries its catalog id and TMDB
identifier, and every card has a poster. The carousel groups prizes by film, so
the 30 rows render as 28 cards.

### Award names

The carousel shows the award name and never its section, and five competitions
hand out their own Best Film and Best Director. The Official Selection keeps the
plain names, as the festival's main competition; the others carry the
competition in the name (`Best Director: Critics' Picks`, `Mejor Dirección:
Ópera Prima`). Section names in Spanish follow the labels of the Spanish
festival page. The longest name is 39 characters, inside the carousel's
42-character budget. The one repeated name is the First Feature jury special
award, which went to two films: both rows are marked as a tie, so each card
carries the "ex aequo" badge.

### Names that differ between sources

- The festival lists the Best Director as Fred Baillif; the catalog credits the
  film to Frédéric Baillif. The award row uses the festival's spelling, which
  matches TMDB.
- The Best Baltic Co-production goes to the film's producers. TMDB lists
  Stasys Baltakis but not Helena Pokorny; the festival's spelling is kept.
- Bianca Bucelli and Vanesa de la Haza are not yet in their films' TMDB
  credits; the festival's spelling is kept.

## Out of scope

- The lifetime achievement awards and the Bruno O'Ya young actor scholarship,
  which attach to people rather than titles.
- The Alexela cash grant, which attaches money to an existing winner and would
  only repeat its card.
- The Just Film and PÖFF Shorts awards and the industry prizes, which the
  winners post does not list.

## Frontend

No page change. `WinnersCarousel` has been wired on the festival page since
Batch 3 and started rendering as soon as the rows existed.

## Verification

`/api/festival/tallinn/awards` returns the 30 rows on both locales, localized
on the Spanish one (`Gran Premio a la Mejor Película`, `Premio Especial del
Jurado: Ópera Prima`, …), each with a poster. Both festival pages render the
carousel with 28 cards.

```sql
-- Seeded rows (expected: 30 rows, 30 with film_id, 30 with tmdb_id, 8 sections)
SELECT COUNT(*), COUNT(film_id), COUNT(tmdb_id), COUNT(DISTINCT award_section) FROM festival_awards
WHERE festival_slug = 'tallinn-2026';
```
