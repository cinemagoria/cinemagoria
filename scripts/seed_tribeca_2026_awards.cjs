/*
 * One-shot seeder: inserts the 20 Tribeca 2026 feature-award winners into
 * `festival_awards` (festival_slug='tribeca-2026'). Short film winners are
 * intentionally excluded. Bilingual fields populated (EN + ES).
 *
 * Run from cinemagoria-main:
 *   node scripts/seed_tribeca_2026_awards.cjs
 */
require('dotenv').config({ quiet: true });
const { createClient } = require('@libsql/client');

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const FESTIVAL = {
  festival_name: 'Tribeca Festival',
  festival_year: 2026,
  festival_slug: 'tribeca-2026',
};

// film_id values were resolved by title match against festival_films (festival_name='Tribeca Festival').
const awards = [
  // ───── U.S. NARRATIVE COMPETITION ─────
  {
    award_name: 'Best U.S. Narrative Feature',
    award_name_es: 'Mejor Largometraje Narrativo Estadounidense',
    award_section: 'U.S. Narrative Competition',
    award_section_es: 'Competencia Narrativa Estadounidense',
    award_type: 'jury',
    award_subject: 'feature',
    is_grand_prize: 1,
    film_id: 2347, title: 'Cotton Fever', director: 'Daniel Blake Schwartz',
    display_order: 10,
  },
  {
    award_name: 'Special Jury Mention — Best U.S. Narrative Feature',
    award_name_es: 'Mención Especial del Jurado — Mejor Largometraje Narrativo Estadounidense',
    award_section: 'U.S. Narrative Competition',
    award_section_es: 'Competencia Narrativa Estadounidense',
    award_type: 'jury',
    award_subject: 'feature',
    is_honorable_mention: 1,
    film_id: 2349, title: "Here I'm Alive", director: 'Joshua Z Weinstein',
    display_order: 20,
  },
  {
    award_name: 'Best Performance in a U.S. Narrative Feature',
    award_name_es: 'Mejor Interpretación en un Largometraje Narrativo Estadounidense',
    award_section: 'U.S. Narrative Competition',
    award_section_es: 'Competencia Narrativa Estadounidense',
    award_type: 'acting',
    award_subject: 'performance',
    film_id: 2355, title: 'Summer of Three', director: 'Carlitos Ruiz-Ruiz',
    recipient_name: 'Marcel Ruiz, Paolo Schoene & Kiki Montilla',
    recipient_role: 'performers', recipient_role_es: 'intérpretes',
    display_order: 30,
  },
  {
    award_name: 'Best Screenplay in a U.S. Narrative Feature',
    award_name_es: 'Mejor Guion en un Largometraje Narrativo Estadounidense',
    award_section: 'U.S. Narrative Competition',
    award_section_es: 'Competencia Narrativa Estadounidense',
    award_type: 'screenplay',
    award_subject: 'screenplay',
    film_id: 2355, title: 'Summer of Three', director: 'Carlitos Ruiz-Ruiz',
    recipient_name: 'Carlitos Ruiz-Ruiz, Marcel Ruiz & Mariana S. Belaval',
    recipient_role: 'screenwriters', recipient_role_es: 'guionistas',
    display_order: 40,
  },
  {
    award_name: 'Best Cinematography in a U.S. Narrative Feature',
    award_name_es: 'Mejor Fotografía en un Largometraje Narrativo Estadounidense',
    award_section: 'U.S. Narrative Competition',
    award_section_es: 'Competencia Narrativa Estadounidense',
    award_type: 'cinematography',
    award_subject: 'cinematography',
    film_id: 2347, title: 'Cotton Fever', director: 'Daniel Blake Schwartz',
    recipient_name: 'Tom Acton Fitzgerald',
    recipient_role: 'cinematographer', recipient_role_es: 'director de fotografía',
    display_order: 50,
  },

  // ───── INTERNATIONAL NARRATIVE COMPETITION ─────
  {
    award_name: 'Best International Narrative Feature',
    award_name_es: 'Mejor Largometraje Narrativo Internacional',
    award_section: 'International Narrative Competition',
    award_section_es: 'Competencia Narrativa Internacional',
    award_type: 'jury',
    award_subject: 'feature',
    is_grand_prize: 1,
    film_id: 2360, title: 'Labrador — Autopsy of Silence', director: 'Rodrigue Jean',
    description: 'An intriguing film that unanimously rose to the top. It is confidently crafted, spiritually mindful, and touched us deeply while immersing us in its haunting story and unique world.',
    description_es: 'Una película fascinante que se elevó por unanimidad a la cima. Está construida con confianza, es espiritualmente consciente y nos conmovió profundamente al sumergirnos en su historia inquietante y su mundo único.',
    display_order: 60,
  },
  {
    award_name: 'Best Performance in an International Narrative Feature',
    award_name_es: 'Mejor Interpretación en un Largometraje Narrativo Internacional',
    award_section: 'International Narrative Competition',
    award_section_es: 'Competencia Narrativa Internacional',
    award_type: 'acting',
    award_subject: 'performance',
    film_id: 2360, title: 'Labrador — Autopsy of Silence', director: 'Rodrigue Jean',
    recipient_name: 'Christopher Angatookalook',
    recipient_role: 'actor', recipient_role_es: 'actor',
    description: 'His soulful portrayal of emotional solitude blew us away and we imagine this award is just one of many to come.',
    description_es: 'Su interpretación llena de alma sobre la soledad emocional nos dejó sin aliento; imaginamos que este premio será solo el primero de muchos.',
    display_order: 70,
  },
  {
    award_name: 'Special Jury Mention — Best Performance in an International Feature',
    award_name_es: 'Mención Especial del Jurado — Mejor Interpretación Internacional',
    award_section: 'International Narrative Competition',
    award_section_es: 'Competencia Narrativa Internacional',
    award_type: 'acting',
    award_subject: 'performance',
    is_honorable_mention: 1,
    film_id: 2358, title: 'Funk', director: 'Aly Muritiba',
    recipient_name: 'Duda Santos & Mc Nem',
    recipient_role: 'actresses', recipient_role_es: 'actrices',
    description: 'Two actresses who impressed us with their incredible energy and dynamism in a film that shows a fresh side of favelas on screen, by way of music and dance. And a special shout out to their costumes, too!',
    description_es: 'Dos actrices que nos impresionaron con su increíble energía y dinamismo en una película que muestra un lado fresco de las favelas en pantalla, a través de la música y la danza. ¡Y una mención especial también para su vestuario!',
    display_order: 80,
  },
  {
    award_name: 'Best Screenplay in an International Narrative Feature',
    award_name_es: 'Mejor Guion en un Largometraje Narrativo Internacional',
    award_section: 'International Narrative Competition',
    award_section_es: 'Competencia Narrativa Internacional',
    award_type: 'screenplay',
    award_subject: 'screenplay',
    film_id: 2366, title: 'Zejtune', director: 'Alex Camilleri',
    recipient_name: 'Alex Camilleri',
    recipient_role: 'screenwriter', recipient_role_es: 'guionista',
    display_order: 90,
  },
  {
    award_name: 'Best Cinematography in an International Narrative Feature',
    award_name_es: 'Mejor Fotografía en un Largometraje Narrativo Internacional',
    award_section: 'International Narrative Competition',
    award_section_es: 'Competencia Narrativa Internacional',
    award_type: 'cinematography',
    award_subject: 'cinematography',
    film_id: 2360, title: 'Labrador — Autopsy of Silence', director: 'Rodrigue Jean',
    recipient_name: 'Mathieu Laverdière',
    recipient_role: 'cinematographer', recipient_role_es: 'director de fotografía',
    display_order: 100,
  },

  // ───── DOCUMENTARY COMPETITION ─────
  {
    award_name: 'Best Documentary Feature',
    award_name_es: 'Mejor Largometraje Documental',
    award_section: 'Documentary Competition',
    award_section_es: 'Competencia Documental',
    award_type: 'jury',
    award_subject: 'feature',
    is_grand_prize: 1,
    film_id: 2611, title: 'Jail Time Records', director: 'Dione Roach & Steve Happi',
    display_order: 110,
  },
  {
    award_name: 'Special Jury Mention — Best Documentary Feature',
    award_name_es: 'Mención Especial del Jurado — Mejor Largometraje Documental',
    award_section: 'Documentary Competition',
    award_section_es: 'Competencia Documental',
    award_type: 'jury',
    award_subject: 'feature',
    is_honorable_mention: 1,
    film_id: 2371, title: 'Time Warp', director: 'Allison Berg',
    display_order: 120,
  },
  {
    award_name: 'Best Cinematography in a Documentary Feature',
    award_name_es: 'Mejor Fotografía en un Largometraje Documental',
    award_section: 'Documentary Competition',
    award_section_es: 'Competencia Documental',
    award_type: 'cinematography',
    award_subject: 'cinematography',
    film_id: 2611, title: 'Jail Time Records', director: 'Dione Roach & Steve Happi',
    recipient_name: 'Dione Roach, Urberto Rapisardi & Steve Happi',
    recipient_role: 'cinematographers', recipient_role_es: 'directores de fotografía',
    display_order: 130,
  },
  {
    award_name: 'Special Jury Mention — Best Cinematography in a Documentary Feature',
    award_name_es: 'Mención Especial del Jurado — Mejor Fotografía Documental',
    award_section: 'Documentary Competition',
    award_section_es: 'Competencia Documental',
    award_type: 'cinematography',
    award_subject: 'cinematography',
    is_honorable_mention: 1,
    film_id: 2575, title: 'The Siege of Paradise', director: "Gar O'Rourke",
    recipient_name: 'Lukas Gut',
    recipient_role: 'cinematographer', recipient_role_es: 'director de fotografía',
    display_order: 140,
  },
  {
    award_name: 'Best Editing in a Documentary Feature',
    award_name_es: 'Mejor Montaje en un Largometraje Documental',
    award_section: 'Documentary Competition',
    award_section_es: 'Competencia Documental',
    award_type: 'editing',
    award_subject: 'editing',
    film_id: 2369, title: 'Jean-Michel', director: 'Quinn Whitney Wilson, Viridiana Lieberman',
    recipient_name: 'Rebecca Adorno & Viridiana Lieberman',
    recipient_role: 'editors', recipient_role_es: 'montadoras',
    display_order: 150,
  },
  {
    award_name: 'Special Jury Mention — Best Editing in a Documentary Feature',
    award_name_es: 'Mención Especial del Jurado — Mejor Montaje Documental',
    award_section: 'Documentary Competition',
    award_section_es: 'Competencia Documental',
    award_type: 'editing',
    award_subject: 'editing',
    is_honorable_mention: 1,
    film_id: 2612, title: 'American Zoo', director: 'Tim Travers Hawkins',
    recipient_name: 'Christopher A. Peterson & Peter Norrey',
    recipient_role: 'editors', recipient_role_es: 'montadores',
    display_order: 160,
  },

  // ───── VIEWPOINTS AWARD ─────
  {
    award_name: 'Viewpoints Award',
    award_name_es: 'Premio Viewpoints',
    award_section: 'Viewpoints',
    award_section_es: 'Viewpoints',
    award_type: 'jury',
    award_subject: 'feature',
    is_grand_prize: 1,
    film_id: 2373, title: 'Crocodile', director: 'The Critics & Pietra Brettkelly',
    display_order: 170,
  },
  {
    award_name: 'Special Jury Mention — Viewpoints Award',
    award_name_es: 'Mención Especial del Jurado — Premio Viewpoints',
    award_section: 'Viewpoints',
    award_section_es: 'Viewpoints',
    award_type: 'jury',
    award_subject: 'feature',
    is_honorable_mention: 1,
    film_id: 2378, title: 'One Woman, One Bra', director: 'Sarah Karei',
    recipient_name: 'Sarah Karei',
    recipient_role: 'director', recipient_role_es: 'directora',
    display_order: 180,
  },

  // ───── BEST NEW NARRATIVE DIRECTOR AWARD ─────
  {
    award_name: 'Best New Narrative Director Award',
    award_name_es: 'Premio al Mejor Nuevo Director Narrativo',
    award_section: 'Best New Narrative Director',
    award_section_es: 'Mejor Nuevo Director Narrativo',
    award_type: 'directing',
    award_subject: 'directing',
    is_grand_prize: 1,
    film_id: 2361, title: 'Memorizu', director: 'Miiku Sakanishi',
    recipient_name: 'Miiku Sakanishi',
    recipient_role: 'director', recipient_role_es: 'director',
    display_order: 190,
  },
  {
    award_name: 'Special Jury Mention — Best New Narrative Director',
    award_name_es: 'Mención Especial del Jurado — Mejor Nuevo Director Narrativo',
    award_section: 'Best New Narrative Director',
    award_section_es: 'Mejor Nuevo Director Narrativo',
    award_type: 'directing',
    award_subject: 'directing',
    is_honorable_mention: 1,
    film_id: 2525, title: 'The Tropic Sun and His Eyes', director: 'Elisee Junior St Preux',
    recipient_name: 'Elisee Junior St. Preux',
    recipient_role: 'director', recipient_role_es: 'director',
    display_order: 200,
  },
];

const COLS = [
  'festival_name', 'festival_year', 'festival_slug',
  'award_name', 'award_section', 'award_type', 'award_subject',
  'is_grand_prize', 'is_honorable_mention', 'is_tie',
  'film_id', 'title', 'director',
  'recipient_name', 'recipient_role', 'description', 'display_order',
  'award_name_es', 'award_section_es', 'description_es', 'recipient_role_es',
];

(async () => {
  // Idempotency: clear any prior tribeca-2026 rows first.
  const existing = await db.execute("SELECT COUNT(*) AS c FROM festival_awards WHERE festival_slug = 'tribeca-2026'");
  console.log('existing tribeca-2026 rows:', existing.rows[0].c);
  if (Number(existing.rows[0].c) > 0) {
    await db.execute("DELETE FROM festival_awards WHERE festival_slug = 'tribeca-2026'");
    console.log('  → deleted for clean re-seed');
  }

  const placeholders = COLS.map(() => '?').join(', ');
  const sql = `INSERT INTO festival_awards (${COLS.join(', ')}) VALUES (${placeholders})`;

  let inserted = 0;
  for (const a of awards) {
    const args = COLS.map((c) => {
      const v = a[c];
      if (v === undefined) {
        if (c === 'is_grand_prize' || c === 'is_honorable_mention' || c === 'is_tie') return 0;
        if (c === 'festival_name') return FESTIVAL.festival_name;
        if (c === 'festival_year') return FESTIVAL.festival_year;
        if (c === 'festival_slug') return FESTIVAL.festival_slug;
        return null;
      }
      return v;
    });
    await db.execute({ sql, args });
    inserted++;
  }
  console.log('inserted:', inserted);

  const verify = await db.execute("SELECT COUNT(*) AS c, SUM(is_grand_prize) AS gp, SUM(is_honorable_mention) AS hm FROM festival_awards WHERE festival_slug = 'tribeca-2026'");
  console.log('verify:', verify.rows[0]);
})();
