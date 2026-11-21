# Cairo 2026 — Awards

Audit trail for the palmarès of the 47th Cairo International Film Festival,
announced at the closing ceremony at the Cairo Opera House on 20 November 2026.
Tracked in #631 (parent #432).

## What was seeded

22 rows in `festival_awards` for `festival_slug = 'cairo-2026'`, across 16
films, the festival's four competitions and its festival-wide, audience and
critics' awards, bilingual on every row. The festival has not posted the list on
its own site yet. Source:
[Variety's report of the ceremony](https://variety.com/2026/film/global/cairo-film-festival-2026-winners-four-minus-three-1236954657/),
cross-checked against
[Fasllah's full list in Arabic](https://www.fasllah.com/%D8%A3%D8%B1%D8%A8%D8%B9%D8%A9-%D9%86%D8%A7%D9%82%D8%B5-%D8%AB%D9%84%D8%A7%D8%AB%D8%A9-%D9%81%D9%8A-%D8%A7%D9%84%D8%B5%D8%AF%D8%A7%D8%B1%D8%A9-%D9%82%D8%A7%D8%A6%D9%85%D8%A9-%D8%AC/).
The two agree on every winner they both list. Fasllah leaves out the Horizons
of Arab Cinema special award, acting and creative prizes and the Critics' Week
special award and mention; those six rows rest on Variety alone. Award names follow the festival's
[regulations](https://www.ciff.org.eg/en/profile/regulations). Person names were
checked against the film's TMDB credits where TMDB lists them; otherwise the
festival's spelling is kept.

| Section | Award | Film | Director | Recipient |
| --- | --- | --- | --- | --- |
| International Competition | Golden Pyramid for Best Film | Four Minus Three | Adrian Goiginger | |
| International Competition | Silver Pyramid for Best Director | Words of Love | Rudi Rosenberg | Rudi Rosenberg |
| International Competition | Bronze Pyramid: Special Jury Award | Al Baraneya | Ashgan El-Hamus | |
| International Competition | Naguib Mahfouz Award for Best Screenplay | Strawberries | Laïla Marrakchi | Laïla Marrakchi, Delphine Agut |
| International Competition | Best Actress | Four Minus Three | Adrian Goiginger | Valerie Pachner |
| International Competition | Best Supporting Actor | Four Minus Three | Adrian Goiginger | Robert Stadlober |
| International Competition | Henry Barakat Award: Artistic Contribution | Heysel 85 | Teodora Ana Mihai | Marius Panduru, Hendrik Van Kets |
| Horizons of Arab Cinema | Best Film: Horizons of Arab Cinema | The Day of Wrath: Tales from Tripoli | Rania Rafei | |
| Horizons of Arab Cinema | Special Award: Horizons of Arab Cinema | Your Daughter | Sara Shazli | |
| Horizons of Arab Cinema | Best Performance: Horizons of Arab Cinema | Summer Meadow | Naël Khleifi, Lisa Debauche | Manal Issa |
| Horizons of Arab Cinema | Creative Prize: Horizons of Arab Cinema (ex aequo) | Summer Meadow | Naël Khleifi, Lisa Debauche | |
| Horizons of Arab Cinema | Creative Prize: Horizons of Arab Cinema (ex aequo) | Until Dawn | Mohamed Zineddaine | |
| Critics Week | Best Film: Critics' Week | The River Train | Lorenzo Ferro, Lucas A. Vignale | |
| Critics Week | Special Award: Critics' Week | Before the Sun Rises in the West | Azamat Shargyn | |
| Critics Week | Special Mention: Critics' Week | The Blind Girl and an Elephant | Ishtiyak Ahmad Zihad | |
| Short Film Competition | Youssef Chahine Award for Best Short Film | Our Secrets | Lenti Liang | |
| Short Film Competition | Special Award: Short Films | We Were Here | Pranav Bhasin | |
| Short Film Competition | Special Mention: Short Films | A Tenderness | Sabrine Khoury | |
| Other Awards | Best Arab Feature Film | Summer Meadow | Naël Khleifi, Lisa Debauche | |
| Other Awards | Feature Documentary Award | The Day of Wrath: Tales from Tripoli | Rania Rafei | |
| Other Awards | Audience Award | BerleeN_ | Ahmad Abdalla | |
| Other Awards | FIPRESCI Prize | Heysel 85 | Teodora Ana Mihai | |

Every winner is in the catalog, so every row carries its catalog id and TMDB
identifier, and every card has a poster. The carousel groups prizes by film, so
the 22 rows render as 16 cards. Four Minus Three carries three prizes; Summer
Meadow carries three, Heysel 85 and The Day of Wrath two each.

### Award names

The carousel shows the award name and never its section. Cairo names most of
its prizes after Egyptian film figures, and the rule is to keep the festival's
name wherever it fits the carousel's 42-character budget in both languages:
the three Pyramids, the Naguib Mahfouz and Henry Barakat awards in the
International Competition, and the Youssef Chahine award for shorts. The others
are described by prize and competition: the Saad Eldin Wahba and Salah Abu Seif
awards become `Best Film` and `Special Award: Horizons of Arab Cinema`, the
Shadi Abdel Salam and Fathy Farag awards `Best Film` and `Special Award:
Critics' Week`. The Youssef Cherif Rizkallah award is shown as `Audience Award`,
since the full name does not fit in Spanish. The festival-wide non-fiction prize
takes the name the festival page already uses for it, `Feature Documentary
Award`. Section names in Spanish follow the labels of the Spanish festival page.

The longest names are 42 characters (`Henry Barakat Award: Artistic
Contribution`, `Mejor Actuación: Horizontes del cine árabe`), at the budget.
The one repeated name is the Horizons creative achievement prize, which the
jury split between two films: both rows are marked as a tie, so each card
carries the "ex aequo" badge.

### Names that differ between sources

- The catalog lists the Horizons winner as `The Day of Wrath: Tales from
  Tripolis`, as the festival's programme spells it. The award rows use
  `Tripoli`, the spelling of TMDB and of both reports.
- Robert Stadlober's prize is reported as best supporting actor by both
  sources, although the regulations list only a best actor award. The award
  row follows the reports.
- The Henry Barakat award is a single prize shared by the film's
  cinematographer and production designer, so it is one row with both
  recipients. TMDB lists Marius Panduru but not Hendrik Van Kets; the
  festival's spelling is kept.
- The Horizons creative achievement prize is not in the regulations, which
  list a best script award instead. Its name follows Variety's description.

## Out of scope

- The Golden Pyramid lifetime achievement awards (Said Shimi at the closing
  ceremony; Nabil Ayouch and Matteo Garrone at the opening) and the Faten
  Hamama Excellence Award, which attach to people rather than titles.
- The 53 Cairo Film Connection awards, which go to projects in development.
- The NETPAC award, which neither source reports for this edition.

## Frontend

No festival page change. `WinnersCarousel` has been wired on the festival page
since Batch 3 and started rendering as soon as the rows existed.

The Cairo entry leaves the homepage rotating banner. It had stopped showing on
its own at the end of the closing day (`2026-11-20T22:00Z`); the entry is
removed from `components/FestivalsRotatingBanner.vue` as was done for
Thessaloniki and Tallinn. The logo and pattern under `public/festivals/cairo/`
stay. The Spanish frontend gets the same change by direct commit.

## Verification

`/api/festival/cairo/awards` returns the 22 rows on both locales, localized on
the Spanish one (`Pirámide de Oro a la Mejor Película`, `Logro Creativo:
Horizontes del cine árabe`, …), each with a poster. The endpoint is cached at
the edge for an hour, so a request made before the seed can keep answering
empty until it expires.

```sql
-- Seeded rows (expected: 22 rows, 22 with film_id, 22 with tmdb_id, 5 sections)
SELECT COUNT(*), COUNT(film_id), COUNT(tmdb_id), COUNT(DISTINCT award_section) FROM festival_awards
WHERE festival_slug = 'cairo-2026';
```
