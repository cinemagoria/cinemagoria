# Mar del Plata 2026 — Awards (Batch 8)

Audit trail for the palmarès of the 41st edition, announced at the closing
ceremony on 14 November 2026. Tracked in #622 (parent #258).

## What was seeded

28 rows in `festival_awards` for `festival_slug = 'mardelplata-2026'`, across
22 films and 7 sections, bilingual on every row. Sources: the festival's
[Official Awards](https://mardelplatafilmfest.com/41/en/premios-independientes-todas-las-ganadoras-2-copy/)
and [Independent Awards](https://mardelplatafilmfest.com/41/en/premios-independientes-todas-las-ganadoras-copy/)
posts, read in English and Spanish.

| Section | Award | Film | Director | Recipient |
| --- | --- | --- | --- | --- |
| International Competition | Best Feature Film | The Night Arezou Disappeared | Arian Vazirdaftari | |
| International Competition | Special Jury Award | A professora de francês | Ricardo Alves Jr. | |
| International Competition | Best Director | The Night Arezou Disappeared | Arian Vazirdaftari | Arian Vazirdaftari |
| International Competition | Best Actor | Elsinore | Simon Stone | Andrew Scott |
| International Competition | Best Actress | A professora de francês | Ricardo Alves Jr. | Grace Passô |
| International Competition | Special Mention: Actress | 2 Valid IDs | Ma-an L. Asuncion-Dagñalan | Marietta Subong |
| International Competition | Best Screenplay | Truly Naked | Muriel d’Ansembourg | Muriel d’Ansembourg |
| International Competition | Audience Award | Elsinore | Simon Stone | |
| International Short Film Competition | Best International Short | Dernier Printemps | Mathilde Bédouet | |
| International Short Film Competition | Special Mention: International Short | Please | Anna Mantzaris | |
| Latin American Competition | Best Latin American Film | El pez que fuma | Luis Fernández | |
| Latin American Competition | Special Mention: Latin American Film | Narciso | Marcelo Martinessi | |
| Latin American Competition | Special Mention: Latin American Actress | Amor es el monstruo | Neto Villalobos Brenes | Paulina García |
| Latin American Short Film Competition | Best Latin American Short | Faces | Andrés Molano | |
| Latin American Short Film Competition | Special Mention: Latin American Short | Carrinho | Oriol Barberá | |
| Argentine Competition | Best Argentine Film | Cebar, frenar, llorar | Gerardo Tassan | |
| Argentine Competition | Best Argentine Director | Chejov en Rosario | Gustavo Postiglione | Gustavo Postiglione |
| Argentine Competition | Special Mention: Argentine Actress | Todavía no es mañana | Manu Vazquez Santana | Natalia Santiago |
| Argentine Short Film Competition | Best Argentine Short | Teatro in Inglish | Marina Ilari | |
| Argentine Short Film Competition | Special Mention: Argentine Short | El agua nunca es mala | Victoria Meza | |
| Independent Awards | FIPRESCI Prize | A professora de francês | Ricardo Alves Jr. | |
| Independent Awards | SIGNIS Award | Children Untold | Miwa Nishikawa | |
| Independent Awards | ACCA Award: Best Argentine Film | Cebar, frenar, llorar | Gerardo Tassan | |
| Independent Awards | ACCA Special Mention | Fuego amigo | Alejandro Magnone | |
| Independent Awards | La Mujer y el Cine Award | Perfume | Lucía S. Ruiz, Andrea Testa | |
| Independent Awards | FNA Award: Best Argentine Short | Surcromía | Luis Paris | |
| Independent Awards | FNA Award: Best Argentine Short | Las esclavas | Andrés H. Denegri | |
| Independent Awards | RECAM Award: Best MERCOSUR Short | Surcromía | Luis Paris | |

Every winner is in the catalog, so every row carries its catalog id and TMDB
identifier, and every card has a poster. The carousel groups prizes by film, so
the 28 rows render as 22 cards.

### Award names

The carousel shows the award name and never its section, and the three juried
competitions hand out the same prizes. The International Competition keeps the
plain names, as the festival's main competition; the other two carry their
competition in the name (`Best Latin American Film`, `Special Mention:
Argentine Short`). Performance mentions name the role (`Special Mention:
Actress`). The Spanish names follow the festival's own wording where it fits
the budget (`Mejor Interpretación Femenina`, `Mención Especial: Corto
Argentino`). The longest name is 42 characters, inside the carousel's budget.
The only repeated name is the FNA prize, given ex aequo to two different films:
each lands on its own card, and the tie is flagged on the row rather than in
the name, so the card's own tie badge shows it.

## Out of scope

- The work-in-progress prize of the En Tránsito competition and its mention:
  they go to projects, not finished films.
- Sponsor prizes: they attach cash to the same jury winners and would only
  repeat their cards.
- Lifetime achievement awards, which attach to a person rather than a title.

## Frontend

No page change. `WinnersCarousel` was already wired on the festival page and
started rendering as soon as the rows existed. The homepage rotating banner
expires on its own at the end of the closing day.

## Verification

`/api/festival/mardelplata/awards` returns the 28 rows on both locales,
localized on the Spanish one (`Mejor Película`, `Mención Especial: Corto
Argentino`, …), each with a poster.

```sql
-- Seeded rows (expected: 28 rows, 28 with film_id, 7 sections)
SELECT COUNT(*), COUNT(film_id), COUNT(DISTINCT award_section) FROM festival_awards
WHERE festival_slug = 'mardelplata-2026';
```
