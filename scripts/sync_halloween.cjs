require('dotenv').config({ quiet: true });
const { createClient } = require('@libsql/client');

const DRY_RUN = process.argv.includes('--dry-run');
const SOURCE_LIST_SLUG = 'watched-mjwwvffx';
const FEATURED_COUNT = 20;
const MIN_VISIBLE = { genre: 4, subgenre: 2, tag: 2 };
const NOW = "strftime('%Y-%m-%dT%H:%M:%SZ','now')";

const EVENT = {
  slug: 'halloween-2026',
  title: 'Halloween Marathon',
  title_es: 'Maratón de Halloween',
  description: 'Horror to binge this Halloween, sorted by the kind of fear you are after.',
  description_es: 'Terror para maratonear en Halloween, ordenado según el miedo que busques.',
  ends_at: '2026-11-02T00:00:00Z',
};

const CLASSICS_BEFORE = 2000;

const TAXONOMY = [
  { slug: 'classics', name: 'Horror Classics', name_es: 'Clásicos del terror',
    description: 'The films that defined the genre, grouped by decade.',
    description_es: 'Las películas que definieron el género, agrupadas por década.',
    subs: [['classics-1910s', '1910s', "Años '10"], ['classics-1920s', '1920s', "Años '20"], ['classics-1930s', '1930s', "Años '30"], ['classics-1940s', '1940s', "Años '40"], ['classics-1950s', '1950s', "Años '50"], ['classics-1960s', '1960s', "Años '60"], ['classics-1970s', '1970s', "Años '70"], ['classics-1980s', '1980s', "Años '80"], ['classics-1990s', '1990s', "Años '90"]] },
  { slug: 'j-horror', name: 'J-Horror', name_es: 'J-Horror',
    description: 'Japanese horror, from kaidan ghost stories to cursed media and modern nightmares.',
    description_es: 'Terror japonés, de los kaidan clásicos a las maldiciones modernas.',
    subs: [['j-kaidan', 'Kaidan & Classics', 'Kaidan y clásicos'], ['j-wave', 'The J-Horror Wave', 'La ola J-Horror'], ['j-modern', 'Modern J-Horror', 'J-Horror moderno']] },
  { slug: 'documentaries', name: 'Horror Documentaries', name_es: 'Documentales de terror',
    description: 'Films about horror: how the classics were made, the myths around them and the people behind them.',
    description_es: 'Películas sobre el terror: cómo se hicieron los clásicos, sus mitos y quiénes las crearon.',
    subs: [] },
  { slug: 'supernatural', name: 'Supernatural Horror', name_es: 'Terror sobrenatural',
    description: 'Ghosts, demons and forces no natural law can explain.',
    description_es: 'Fantasmas, demonios y fuerzas que ninguna ley natural explica.',
    subs: [['ghosts', 'Ghosts & Hauntings', 'Fantasmas y apariciones'], ['possession', 'Possession & Exorcism', 'Posesiones y exorcismos'], ['demonic', 'Demonic Horror', 'Terror demoníaco'], ['curses', 'Curses & Cursed Objects', 'Maldiciones y objetos malditos'], ['haunted-places', 'Haunted Houses & Locations', 'Casas y lugares embrujados'], ['paranormal-investigations', 'Paranormal Investigations', 'Investigaciones paranormales']] },
  { slug: 'slashers', name: 'Slashers & Killers', name_es: 'Slashers y asesinos',
    description: 'Murderers, stalkers and the people who have to outlast them.',
    description_es: 'Asesinos, acosadores y quienes intentan sobrevivirles.',
    subs: [['classic-slasher', 'Classic Slasher', 'Slasher clásico'], ['serial-killers', 'Serial Killers', 'Asesinos seriales'], ['home-invasion', 'Home Invasion', 'Invasión de hogar'], ['stalker', 'Stalker Horror', 'Acoso'], ['survival-killer', 'Survival Against a Killer', 'Sobrevivir al asesino']] },
  { slug: 'folk', name: 'Folk Horror & Witchcraft', name_es: 'Folk horror y brujería',
    description: 'Folklore, isolated communities, old rituals and the witches in the woods.',
    description_es: 'Folclore, comunidades aisladas, rituales antiguos y brujas en el bosque.',
    subs: [['folk-horror', 'Folk Horror', 'Folk horror'], ['witchcraft', 'Witchcraft', 'Brujería'], ['pagan-ritual', 'Pagan & Ritual Horror', 'Rituales paganos'], ['rural', 'Rural Horror', 'Terror rural'], ['mythological', 'Mythological Horror', 'Terror mitológico'], ['urban-legends', 'Urban Legends', 'Leyendas urbanas']] },
  { slug: 'psychological', name: 'Psychological Horror', name_es: 'Terror psicológico',
    description: 'Paranoia, obsession and minds that stop being reliable.',
    description_es: 'Paranoia, obsesión y mentes en las que ya no se puede confiar.',
    subs: [['paranoia', 'Paranoia', 'Paranoia'], ['unreliable-perception', 'Unreliable Perception', 'Percepción engañosa'], ['obsession', 'Obsession & Manipulation', 'Obsesión y manipulación'], ['doppelgangers', 'Identity & Doppelgängers', 'Identidad y dobles'], ['breakdown', 'Delusion & Breakdown', 'Delirio y quiebre mental'], ['psych-mystery', 'Psychological Mystery', 'Misterio psicológico']] },
  { slug: 'cosmic', name: 'Cosmic & Existential Horror', name_es: 'Terror cósmico y existencial',
    description: 'Realities beyond understanding and the fear of being insignificant.',
    description_es: 'Realidades que escapan a la comprensión y el miedo a la insignificancia.',
    subs: [['cosmic-horror', 'Cosmic Horror', 'Terror cósmico'], ['lovecraftian', 'Lovecraftian Horror', 'Terror lovecraftiano'], ['existential', 'Existential Horror', 'Terror existencial'], ['reality-bending', 'Reality-Bending Horror', 'Realidades alteradas'], ['unknown-entities', 'Unknown Entities', 'Entidades desconocidas'], ['philosophical', 'Philosophical Horror', 'Terror filosófico']] },
  { slug: 'found-footage', name: 'Found Footage & Documentary', name_es: 'Found footage y falso documental',
    description: 'Recovered tapes, mock documentaries and recordings that should not exist.',
    description_es: 'Cintas recuperadas, falsos documentales y grabaciones que no deberían existir.',
    subs: [['found-footage-sub', 'Found Footage', 'Found footage'], ['mockumentary', 'Mockumentary', 'Falso documental'], ['paranormal-recordings', 'Paranormal Recordings', 'Grabaciones paranormales'], ['analog-horror', 'Analog Horror', 'Terror analógico'], ['screenlife', 'Screenlife Horror', 'Screenlife']] },
  { slug: 'body', name: 'Body Horror & Transformation', name_es: 'Body horror y transformación',
    description: 'Bodies that mutate, rebel or stop belonging to their owners.',
    description_es: 'Cuerpos que mutan, se rebelan o dejan de pertenecer a sus dueños.',
    subs: [['mutation', 'Mutation & Transformation', 'Mutación y transformación'], ['infection', 'Infection & Parasites', 'Infecciones y parásitos'], ['medical', 'Medical Horror', 'Terror médico'], ['biological', 'Biological Horror', 'Terror biológico']] },
  { slug: 'creatures', name: 'Creatures & Monsters', name_es: 'Criaturas y monstruos',
    description: 'Vampires, aliens and things that live in the dark.',
    description_es: 'Vampiros, alienígenas y cosas que viven en la oscuridad.',
    subs: [['monster', 'Monster Horror', 'Monstruos'], ['alien', 'Alien Horror', 'Alienígenas'], ['animal-attack', 'Animal Attack', 'Ataques animales'], ['creature-feature', 'Creature Features', 'Criaturas'], ['vampire', 'Vampire Horror', 'Vampiros'], ['werewolf', 'Werewolf Horror', 'Hombres lobo'], ['zombie', 'Zombie Horror', 'Zombis']] },
  { slug: 'gothic', name: 'Gothic & Atmospheric', name_es: 'Gótico y atmosférico',
    description: 'Decaying houses, slow dread and places that close in on you.',
    description_es: 'Casas en ruinas, angustia lenta y lugares que te encierran.',
    subs: [['gothic-horror', 'Gothic Horror', 'Terror gótico'], ['haunted-mansions', 'Haunted Mansions', 'Mansiones embrujadas'], ['atmospheric', 'Atmospheric Horror', 'Terror atmosférico'], ['slow-burn', 'Slow-Burn Horror', 'Cocción lenta'], ['isolation', 'Isolation & Claustrophobia', 'Aislamiento y claustrofobia']] },
  { slug: 'occult', name: 'Occult & Religious Horror', name_es: 'Terror ocultista y religioso',
    description: 'Cults, forbidden rites and faith turned into a threat.',
    description_es: 'Sectas, ritos prohibidos y la fe convertida en amenaza.',
    subs: [['occult-horror', 'Occult Horror', 'Ocultismo'], ['satanic', 'Satanic Horror', 'Terror satánico'], ['religious', 'Religious Horror', 'Terror religioso'], ['cults', 'Cults & Secret Societies', 'Sectas y sociedades secretas'], ['ritual', 'Ritual Horror', 'Rituales']] },
  { slug: 'survival', name: 'Survival & Apocalypse', name_es: 'Supervivencia y apocalipsis',
    description: 'Sieges, outbreaks and staying alive when everything collapses.',
    description_es: 'Asedios, brotes y seguir con vida cuando todo colapsa.',
    subs: [['survival-horror', 'Survival Horror', 'Supervivencia'], ['siege', 'Siege Horror', 'Asedio'], ['outbreaks', 'Epidemics & Outbreaks', 'Epidemias y brotes'], ['underground', 'Underground & Cave Horror', 'Cuevas y subsuelo']] },
  { slug: 'extreme', name: 'Extreme & Transgressive', name_es: 'Extremo y transgresor',
    description: 'Graphic, punishing horror that pushes past the usual limits.',
    description_es: 'Terror gráfico y brutal que va más allá de los límites habituales.',
    subs: [['splatter', 'Splatter & Gore', 'Splatter y gore'], ['torture', 'Torture Horror', 'Tortura'], ['cannibal', 'Cannibal Horror', 'Caníbales'], ['transgressive', 'Transgressive Horror', 'Terror transgresor']] },
  { slug: 'mystery', name: 'Horror Mystery & Giallo', name_es: 'Misterio y giallo',
    description: 'Investigations, hidden identities and murders with a horror edge.',
    description_es: 'Investigaciones, identidades ocultas y crímenes con filo de terror.',
    subs: [['giallo', 'Giallo', 'Giallo'], ['murder-mystery', 'Murder Mystery', 'Misterio criminal'], ['detective', 'Detective Horror', 'Investigación policial'], ['occult-mystery', 'Occult Mystery', 'Misterio ocultista'], ['psych-thriller', 'Psychological Thriller-Horror', 'Thriller psicológico']] },
  { slug: 'comedy', name: 'Horror Comedy', name_es: 'Comedia de terror',
    description: 'Horror played for dark laughs.',
    description_es: 'Terror con humor negro.',
    subs: [['dark-comedy', 'Dark Comedy', 'Humor negro'], ['parody', 'Parody Horror', 'Parodia']] },
];

const TAGS = [
  ['sci-fi', 'Sci-Fi Horror', 'Ciencia ficción'], ['social', 'Social Horror', 'Terror social'],
  ['political', 'Political Horror', 'Terror político'], ['war', 'War Horror', 'Guerra'],
  ['experimental', 'Experimental Horror', 'Experimental'], ['surreal', 'Surreal Horror', 'Surrealista'],
  ['dream', 'Dream Horror', 'Onírico'], ['liminal', 'Liminal Horror', 'Liminal'],
  ['historical', 'Historical Horror', 'De época'],
  ['k-horror', 'K-Horror', 'K-Horror'], ['asian', 'Asian Horror', 'Terror asiático'],
  ['international', 'International Horror', 'Terror internacional'],
];

const EXCLUDED = new Set([86825, 696605, 771536, 1233413, 8329, 201085, 594718]);

const CLASSIFICATION = {
  1083381: 'cosmic-horror reality-bending unknown-entities #liminal',
  515454: 'unknown-entities #dream #sci-fi',
  516632: 'cosmic-horror urban-legends',
  2654: 'lovecraftian reality-bending',
  1189735: 'folk-horror mythological #international',
  1290418: 'murder-mystery detective',
  293670: 'possession demonic #k-horror #asian #international',
  334536: 'possession isolation',
  294963: 'survival-horror cannibal #historical',
  508642: 'found-footage-sub haunted-places #k-horror #asian #international',
  680593: 'demonic',
  1130276: 'demonic',
  1229915: 'serial-killers psych-thriller',
  1226578: 'serial-killers satanic',
  1288072: 'isolation slow-burn',
  1339713: 'curses obsession',
  1430077: 'witchcraft gothic-horror',
  2291: 'unreliable-perception breakdown #war #surreal',
  181886: 'doppelgangers',
  1949: 'obsession detective',
  1091: 'supernatural alien mutation #sci-fi',
  694: 'haunted-places ghosts breakdown',
  17609: 'breakdown transgressive #experimental',
  49018: 'ghosts demonic paranormal-investigations',
  310131: 'witchcraft folk-horror #historical',
  297608: 'found-footage-sub possession',
  433808: 'folk-horror pagan-ritual',
  632885: 'possession demonic #asian #international',
  780609: 'folk-horror mutation #surreal',
  807356: 'paranoia stalker',
  997660: 'witchcraft folk-horror #international',
  1008042: 'possession ghosts',
  933260: 'mutation splatter #social',
  1111867: 'paranoia ghosts #social #international',
  1140535: 'ghosts haunted-places',
  1100782: 'curses',
  1422558: 'giallo murder-mystery #international',
  11075: 'j-horror obsession torture #asian #international',
  9392: 'creature-feature underground',
  16313: 'ghosts curses #asian #international',
  27374: 'mockumentary ghosts',
  21484: 'breakdown doppelgangers mutation #surreal',
  49797: 'serial-killers splatter #k-horror #asian #international',
  184346: 'possession demonic',
  91586: 'ghosts possession',
  50698: 'found-footage-sub paranormal-investigations haunted-places',
  381283: 'breakdown #surreal',
  361292: 'witchcraft occult-horror #historical',
  381288: 'doppelgangers',
  254194: 'occult-horror mutation',
  507076: 'breakdown #experimental #international',
  435615: 'doppelgangers splatter #sci-fi',
  426063: 'vampire gothic-horror #historical',
  419430: 'cults medical #social',
  395992: 'alien #sci-fi',
  467012: 'ghosts satanic #asian #international',
  493922: 'occult-horror demonic',
  572468: 'folk-horror curses #asian #international',
  524738: 'demonic curses #asian #international',
  855435: 'serial-killers #social',
  744857: 'possession demonic #international',
  850439: 'ghosts isolation #historical',
  882598: 'curses',
  931944: 'breakdown religious #historical #international',
  913290: 'monster underground',
  949423: 'breakdown classic-slasher #historical',
  945961: 'alien survival-horror #sci-fi',
  925786: 'ghosts satanic #asian #international',
  1214509: 'classic-slasher splatter',
  1138194: 'religious psych-thriller',
  1084199: 'psych-thriller #sci-fi',
  1219739: 'folk-horror religious #historical #international',
  1216191: 'curses occult-mystery',
  1364953: 'gothic-horror #historical',
  1480387: 'paranormal-investigations demonic',
  1730: 'unreliable-perception doppelgangers #surreal #experimental',
  313922: 'survival-killer siege',
  556509: 'cults religious #k-horror #asian #international',
  1107166: 'serial-killers satanic',
  1240889: 'classic-slasher',
  1314122: 'obsession',
  1368314: 'demonic curses',
  1339173: 'unreliable-perception medical',
  1339206: 'ritual occult-horror',
  1481608: 'witchcraft folk-horror',
  964849: 'folk-horror mutation #international',
  1212763: 'possession demonic splatter',
  1280300: 'haunted-places #international',
  1610703: 'found-footage-sub haunted-places',
  740049: 'folk-horror isolation',
  1166133: 'mythological gothic-horror #historical #international',
  36095: 'j-horror serial-killers psych-mystery #asian #international',
  667216: 'transgressive doppelgangers #sci-fi',
  630392: 'werewolf curses #historical',
  570670: 'stalker psych-thriller #sci-fi',
  883083: 'witchcraft folk-horror #historical #international',
  1291595: 'demonic ghosts paranormal-investigations',
  1395839: 'j-horror curses possession #asian #international',
  1461254: 'ghosts paranormal-investigations #k-horror #asian #international',
  760104: 'classic-slasher #historical',
  1023922: 'classic-slasher serial-killers #historical',
  1629051: 'j-horror ghosts haunted-places #asian #international',
  1219556: 'j-horror paranoia breakdown #asian #international',
  895178: 'folk-horror mythological #international',
  1432706: 'possession demonic',
  1265800: 'j-horror ghosts haunted-places #asian #international',
  718833: 'witchcraft folk-horror #asian #international',
  1363387: 'ghosts mutation',
  1629355: 'documentaries #social',
  242582: 'obsession psych-thriller',
  1536720: 'j-horror ghosts obsession #asian #international',
  1368172: 'demonic ghosts #international',
  1229906: 'paranoia ghosts',
  1516534: 'possession demonic #international',
  1274134: 'breakdown unreliable-perception #surreal',
  1058424: 'alien #k-horror #asian #international #sci-fi',
  1398: 'existential philosophical #sci-fi #international',
  1474628: 'splatter dark-comedy',
  1506835: 'religious cults',
  1567203: 'j-horror curses unknown-entities #asian #international',
  1596260: 'obsession psych-thriller',
  1399525: 'cosmic-horror reality-bending',
  1495638: 'cults',
  1564614: 'unknown-entities religious',
  1439881: 'doppelgangers',
  912511: 'paranoia breakdown #international',
  1339210: 'unreliable-perception #sci-fi',
  539: 'serial-killers psych-thriller',
  31417: 'medical gothic-horror #international',
  11772: 'haunted-places ghosts haunted-mansions',
  30959: 'j-horror ghosts mythological #asian #international',
  3763: 'j-horror folk-horror mythological #asian #international',
  10331: 'zombie siege',
  9552: 'possession demonic',
  931: 'ghosts psych-mystery',
  30497: 'classic-slasher cannibal',
  578: 'animal-attack creature-feature',
  7340: 'supernatural religious',
  11906: 'witchcraft occult-horror #international',
  923: 'zombie siege',
  348: 'alien survival-horror #sci-fi',
  9638: 'unknown-entities #surreal',
  790: 'ghosts curses',
  814: 'werewolf dark-comedy',
  19204: 'haunted-places splatter',
  609: 'ghosts haunted-places',
  9426: 'mutation #sci-fi',
  8852: 'cosmic-horror religious',
  765: 'possession splatter dark-comedy',
  2667: 'found-footage-sub witchcraft',
  27324: 'j-horror ghosts existential #asian #international',
  11366: 'j-horror curses mutation #surreal #asian #international',
  72490: 'j-horror existential #asian #international',
  46164: 'j-horror ghosts detective #asian #international',
  32234: 'j-horror doppelgangers #asian #international',
  40592: 'j-horror ghosts #asian #international',
  32171: 'j-horror infection medical #asian #international',
  87339: 'j-horror classic-slasher #asian #international',
  73043: 'j-horror ghosts curses #historical #asian #international',
  16231: 'j-horror zombie dark-comedy #asian #international',
  5842: 'j-horror zombie #asian #international',
  283127: 'j-horror vampire dark-comedy #asian #international',
  513434: 'j-horror zombie dark-comedy #asian #international',
  276624: 'j-horror zombie outbreaks #asian #international',
  282069: 'j-horror infection alien #sci-fi #asian #international',
  282070: 'j-horror infection alien #sci-fi #asian #international',
  959439: 'j-horror urban-legends reality-bending #liminal #asian #international',
  1408208: 'j-horror reality-bending #liminal #asian #international',
  52302: 'j-horror mutation isolation #asian #international',
  42628: 'j-horror alien #sci-fi #asian #international',
  43113: 'j-horror creature-feature #sci-fi #asian #international',
  57875: 'j-horror ghosts mythological #historical #asian #international',
  108648: 'j-horror ghosts #historical #asian #international',
  108737: 'j-horror vampire #asian #international',
  68477: 'j-horror paranoia psych-mystery #asian #international',
  72834: 'j-horror haunted-mansions ghosts #asian #international',
  505916: 'j-horror demonic #asian #international',
  118315: 'j-horror mockumentary occult-horror #asian #international',
  27843: 'j-horror zombie dark-comedy #asian #international',
  15999: 'j-horror vampire gothic-horror #asian #international',
  919: 'j-horror vampire #historical #asian #international',
  433945: 'j-horror monster #asian #international',
  371241: 'j-horror curses ghosts #asian #international',
  9674: 'j-horror ghosts curses #asian #international',
  85393: 'j-horror ghosts paranoia #asian #international',
  50173: 'j-horror religious #surreal #asian #international',
  43713: 'j-horror serial-killers #dream #asian #international',
  26040: 'j-horror isolation #experimental #asian #international',
  94684: 'j-horror monster mutation #asian #international',
  157709: 'j-horror ghosts #historical #asian #international',
  28041: 'giallo murder-mystery #international',
  28055: 'giallo serial-killers #international',
  20345: 'giallo murder-mystery #international',
  27431: 'giallo murder-mystery #international',
  22307: 'giallo doppelgangers',
  27703: 'giallo occult-mystery #international',
  57447: 'giallo murder-mystery #international',
  29143: 'giallo serial-killers',
  20465: 'giallo classic-slasher #international',
  619778: 'giallo doppelgangers serial-killers',
  630720: 'giallo serial-killers #international',
  440021: 'classic-slasher murder-mystery',
  10665: 'home-invasion',
  83899: 'home-invasion survival-killer',
  376570: 'home-invasion survival-killer',
  567609: 'survival-killer dark-comedy',
  22970: 'classic-slasher parody',
  9542: 'stalker survival-killer',
  39874: 'classic-slasher',
  458723: 'doppelgangers home-invasion #social',
  517116: 'classic-slasher',
  234: 'unreliable-perception serial-killers #international',
  653: 'vampire gothic-horror #international',
  2929: 'monster medical',
  10695: 'monster mythological #international',
  11838: 'j-horror ghosts curses haunted-places #asian #international',
  2671: 'j-horror curses ghosts #asian #international',
  12205: 'j-horror ghosts haunted-places #asian #international',
  21506: 'j-horror mockumentary curses #asian #international',
  1517111: 'documentaries',
  618375: 'documentaries',
  565591: 'documentaries',
  359749: 'documentaries',
  84330: 'documentaries',
  614637: 'documentaries',
  574109: 'documentaries #social',
  279992: 'documentaries',
  312827: 'documentaries',
  171795: 'documentaries',
  106262: 'documentaries',
  250577: 'documentaries',
  948: 'classic-slasher stalker',
  31428: 'stalker paranoia',
  8769: 'curses obsession',
  8337: 'alien paranoia #sci-fi #social',
  9945: 'vampire',
  10016: 'possession survival-horror #sci-fi',
  30689: 'giallo murder-mystery #international',
  16395: 'witchcraft occult-horror #international',
  39436: 'giallo serial-killers #international',
  15483: 'giallo serial-killers #international',
  29159: 'giallo serial-killers',
  135812: 'vampire gothic-horror #international',
  33016: 'cults religious',
  17918: 'monster mutation',
  11503: 'occult-horror zombie',
  12158: 'vampire dark-comedy',
  10012: 'werewolf',
  43931: 'serial-killers',
  9538: 'mutation paranoia #sci-fi',
  9540: 'medical doppelgangers',
  1946: 'reality-bending mutation #sci-fi',
  16281: 'monster dark-comedy',
  8408: 'zombie siege',
  29787: 'animal-attack',
  10349: 'doppelgangers',
  11683: 'zombie siege',
  13025: 'zombie found-footage-sub',
  29426: 'zombie',
  13555: 'classic-slasher monster',
  31909: 'alien #sci-fi',
  40466: 'animal-attack creature-feature',
  16764: 'classic-slasher',
  14228: 'zombie haunted-places',
  229138: 'demonic haunted-places #international',
  27632: 'witchcraft gothic-horror #international',
  28043: 'ghosts vampire #international',
  17921: 'alien possession #sci-fi #international',
  28049: 'ghosts curses gothic-horror #international',
  28050: 'giallo serial-killers #international',
  28051: 'giallo murder-mystery #international',
  5486: 'classic-slasher giallo #international',
  5485: 'gothic-horror haunted-mansions #international',
  10728: 'demonic religious #international',
  12526: 'paranoia breakdown',
  3035: 'monster medical',
  31592: 'haunted-mansions gothic-horror',
  10787: 'breakdown #sci-fi',
  229: 'monster medical',
  374466: 'ghosts gothic-horror #international',
  7219: 'zombie #international',
  28794: 'haunted-mansions monster #international',
  766: 'possession dark-comedy',
  2046: 'occult-mystery murder-mystery',
  16871: 'curses demonic',
  571: 'animal-attack siege',
  223: 'gothic-horror psych-thriller',
  21734: 'serial-killers psych-thriller',
  426: 'obsession psych-thriller',
  985: 'unreliable-perception mutation #surreal #experimental',
  1018: 'unreliable-perception doppelgangers #surreal',
  44351: 'reality-bending #surreal #experimental',
  44239: 'unreliable-perception #dream #experimental',
  104391: 'paranoia #surreal #experimental',
  744746: 'haunted-places isolation slow-burn',
  1136558: 'j-horror ritual rural #asian #international',
};

const db = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });
const imdbDb = createClient({ url: process.env.IMDB_DB_URL, authToken: process.env.IMDB_DB_TOKEN });
const eventId = '(SELECT id FROM halloween_events WHERE slug = ?)';

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS halloween_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    title_es TEXT NOT NULL,
    description TEXT,
    description_es TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
    starts_at TEXT NOT NULL,
    ends_at TEXT NOT NULL,
    source_list_id INTEGER,
    created_at TEXT NOT NULL DEFAULT (${NOW}),
    updated_at TEXT NOT NULL DEFAULT (${NOW}),
    CHECK (ends_at > starts_at)
  )`,
  `CREATE TABLE IF NOT EXISTS halloween_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL REFERENCES halloween_events(id) ON DELETE CASCADE,
    slug TEXT NOT NULL,
    kind TEXT NOT NULL CHECK (kind IN ('genre', 'subgenre', 'tag')),
    parent_id INTEGER REFERENCES halloween_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    name_es TEXT NOT NULL,
    description TEXT,
    description_es TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_visible INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (${NOW}),
    updated_at TEXT NOT NULL DEFAULT (${NOW}),
    UNIQUE (event_id, slug),
    CHECK ((kind = 'subgenre') = (parent_id IS NOT NULL))
  )`,
  'CREATE INDEX IF NOT EXISTS idx_halloween_categories_parent ON halloween_categories(parent_id)',
  `CREATE TABLE IF NOT EXISTS halloween_movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL REFERENCES halloween_events(id) ON DELETE CASCADE,
    movie_id INTEGER NOT NULL,
    source_list_id INTEGER,
    title TEXT NOT NULL,
    poster_path TEXT,
    release_date TEXT,
    release_year INTEGER,
    imdb_id TEXT,
    imdb_rating REAL,
    tmdb_rating REAL,
    editorial_rank INTEGER NOT NULL,
    featured INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('active', 'removed')),
    synced_at TEXT,
    created_at TEXT NOT NULL DEFAULT (${NOW}),
    updated_at TEXT NOT NULL DEFAULT (${NOW}),
    UNIQUE (event_id, movie_id)
  )`,
  'CREATE INDEX IF NOT EXISTS idx_halloween_movies_listing ON halloween_movies(event_id, status, editorial_rank)',
  `CREATE TABLE IF NOT EXISTS halloween_movie_categories (
    halloween_movie_id INTEGER NOT NULL REFERENCES halloween_movies(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES halloween_categories(id) ON DELETE CASCADE,
    classification_source TEXT NOT NULL DEFAULT 'editorial',
    created_at TEXT NOT NULL DEFAULT (${NOW}),
    PRIMARY KEY (halloween_movie_id, category_id)
  )`,
  'CREATE INDEX IF NOT EXISTS idx_halloween_movie_categories_category ON halloween_movie_categories(category_id)',
];

const subToGenre = new Map(TAXONOMY.flatMap((g) => g.subs.map(([slug]) => [slug, g.slug])));
const genreSlugs = new Set(TAXONOMY.map((g) => g.slug));
const tagSlugs = new Set(TAGS.map(([slug]) => slug));

function categorySlugsFor(movieId, year) {
  const tokens = (CLASSIFICATION[movieId] || '').split(/\s+/).filter(Boolean);
  const slugs = new Set();
  for (const token of tokens) {
    if (token.startsWith('#')) {
      if (!tagSlugs.has(token.slice(1))) throw new Error(`Unknown tag ${token} on ${movieId}`);
      slugs.add(token.slice(1));
    } else if (genreSlugs.has(token)) {
      slugs.add(token);
    } else {
      if (!subToGenre.has(token)) throw new Error(`Unknown subgenre ${token} on ${movieId}`);
      slugs.add(token);
      slugs.add(subToGenre.get(token));
    }
  }
  if (slugs.has('j-horror') && year) {
    slugs.add(year < 1990 ? 'j-kaidan' : year < 2010 ? 'j-wave' : 'j-modern');
  }
  if (year && year < CLASSICS_BEFORE) {
    slugs.add('classics');
    const decade = `classics-${Math.floor(year / 10) * 10}s`;
    if (subToGenre.has(decade)) slugs.add(decade);
  }
  return [...slugs];
}

async function addMissingColumns() {
  const columns = new Set((await db.execute('PRAGMA table_info(halloween_movies)')).rows.map((r) => r.name));
  if (!columns.has('release_date')) await db.execute('ALTER TABLE halloween_movies ADD COLUMN release_date TEXT');
}

async function tmdbMovie(movieId) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.API_KEY}&append_to_response=external_ids`);
      if (!res.ok) throw new Error(`TMDB ${res.status} for ${movieId}`);
      return await res.json();
    } catch (error) {
      if (attempt === 3) throw error;
      await new Promise((r) => setTimeout(r, 500 * attempt));
    }
  }
}

async function imdbRatings(imdbIds) {
  if (!imdbIds.length) return new Map();
  const rows = (await imdbDb.execute({
    sql: `SELECT tconst, average_rating FROM imdb_ratings WHERE tconst IN (${imdbIds.map(() => '?').join(', ')})`,
    args: imdbIds,
  })).rows;
  return new Map(rows.map((r) => [r.tconst, Number(r.average_rating)]));
}

async function loadSourceList() {
  const list = (await db.execute({ sql: 'SELECT id FROM user_custom_lists WHERE slug = ?', args: [SOURCE_LIST_SLUG] })).rows[0];
  if (!list) throw new Error(`List ${SOURCE_LIST_SLUG} not found`);
  const items = (await db.execute({
    sql: "SELECT item_id, name, genres, imdb_rating FROM user_custom_list_items WHERE list_id = ? AND item_type = 'movie'",
    args: [list.id],
  })).rows;
  return { listId: Number(list.id), items };
}

async function main() {
  const { listId, items } = await loadSourceList();
  const listById = new Map(items.map((i) => [Number(i.item_id), i]));
  const curatedIds = Object.keys(CLASSIFICATION).map(Number).filter((id) => !EXCLUDED.has(id));
  const unclassified = items.filter((i) => /horror|terror/i.test(i.genres || '') && !CLASSIFICATION[i.item_id] && !EXCLUDED.has(Number(i.item_id)));

  const details = [];
  for (let i = 0; i < curatedIds.length; i += 8) {
    details.push(...await Promise.all(curatedIds.slice(i, i + 8).map(tmdbMovie)));
  }
  const ratings = await imdbRatings(details.map((d) => d.external_ids?.imdb_id).filter((id) => /^tt\d+$/.test(id || '')));

  const movies = details.map((d) => {
    const imdbId = d.external_ids?.imdb_id || null;
    const listItem = listById.get(Number(d.id));
    const year = d.release_date ? Number(d.release_date.slice(0, 4)) : null;
    return {
      movieId: Number(d.id),
      sourceListId: listItem ? listId : null,
      title: d.title,
      posterPath: d.poster_path || null,
      year,
      releaseDate: d.release_date || null,
      imdbId,
      imdbRating: ratings.get(imdbId) ?? (listItem?.imdb_rating ? Number(listItem.imdb_rating) : null),
      tmdbRating: d.vote_average ? Number(d.vote_average) : null,
      slugs: categorySlugsFor(d.id, year),
    };
  });

  movies.sort((a, b) => (b.imdbRating || 0) - (a.imdbRating || 0)
    || (b.tmdbRating || 0) - (a.tmdbRating || 0)
    || a.title.localeCompare(b.title));
  const featuredIds = new Set(movies.slice(0, FEATURED_COUNT).map((m) => m.movieId));

  console.log(`List movies: ${items.length} | curated: ${movies.length} (${movies.filter((m) => m.sourceListId).length} from the list, ${movies.filter((m) => !m.sourceListId).length} added)`);
  console.log(`No IMDb rating: ${movies.filter((m) => !m.imdbRating).map((m) => m.title).join(', ') || 'none'}`);
  if (unclassified.length) console.log(`Horror in the list left out (${unclassified.length}): ${unclassified.map((i) => i.name).join(', ')}`);

  const counts = {};
  for (const m of movies) for (const slug of m.slugs) counts[slug] = (counts[slug] || 0) + 1;
  console.log(`Genres: ${TAXONOMY.map((g) => `${g.name} ${counts[g.slug] || 0}`).join(' · ')}`);
  console.log(`Classics: ${TAXONOMY[0].subs.map(([slug, name]) => `${name} ${counts[slug] || 0}`).join(' · ')}`);
  console.log(`Featured: ${movies.slice(0, FEATURED_COUNT).map((m) => m.title).join(', ')}`);

  if (DRY_RUN) {
    console.log('Dry run: nothing written.');
    return;
  }

  await db.batch(SCHEMA, 'write');
  await addMissingColumns();

  const stmts = [];
  stmts.push({
    sql: `INSERT INTO halloween_events (slug, title, title_es, description, description_es, status, starts_at, ends_at, source_list_id)
          VALUES (?, ?, ?, ?, ?, 'active', ${NOW}, ?, ?)
          ON CONFLICT(slug) DO UPDATE SET title = excluded.title, title_es = excluded.title_es,
            description = excluded.description, description_es = excluded.description_es,
            ends_at = excluded.ends_at, source_list_id = excluded.source_list_id, updated_at = ${NOW}`,
    args: [EVENT.slug, EVENT.title, EVENT.title_es, EVENT.description, EVENT.description_es, EVENT.ends_at, listId],
  });

  const upsertCategory = (slug, kind, parentSlug, name, nameEs, description, descriptionEs, order) => ({
    sql: `INSERT INTO halloween_categories (event_id, slug, kind, parent_id, name, name_es, description, description_es, display_order)
          VALUES (${eventId}, ?, ?, ${parentSlug ? `(SELECT id FROM halloween_categories WHERE event_id = ${eventId} AND slug = ?)` : 'NULL'}, ?, ?, ?, ?, ?)
          ON CONFLICT(event_id, slug) DO UPDATE SET kind = excluded.kind, parent_id = excluded.parent_id, name = excluded.name,
            name_es = excluded.name_es, description = excluded.description, description_es = excluded.description_es,
            display_order = excluded.display_order, updated_at = ${NOW}`,
    args: [EVENT.slug, slug, kind, ...(parentSlug ? [EVENT.slug, parentSlug] : []), name, nameEs, description, descriptionEs, order],
  });

  TAXONOMY.forEach((g, gi) => {
    stmts.push(upsertCategory(g.slug, 'genre', null, g.name, g.name_es, g.description, g.description_es, (gi + 1) * 100));
    g.subs.forEach(([slug, name, nameEs], si) => stmts.push(upsertCategory(slug, 'subgenre', g.slug, name, nameEs, null, null, (gi + 1) * 100 + si + 1)));
  });
  TAGS.forEach(([slug, name, nameEs], ti) => stmts.push(upsertCategory(slug, 'tag', null, name, nameEs, null, null, 10000 + ti)));

  movies.forEach((m, index) => {
    stmts.push({
      sql: `INSERT INTO halloween_movies (event_id, movie_id, source_list_id, title, poster_path, release_date, release_year, imdb_id, imdb_rating, tmdb_rating,
              editorial_rank, featured, status, synced_at)
            VALUES (${eventId}, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ${NOW})
            ON CONFLICT(event_id, movie_id) DO UPDATE SET source_list_id = excluded.source_list_id, title = excluded.title,
              poster_path = excluded.poster_path, release_date = excluded.release_date, release_year = excluded.release_year, imdb_id = excluded.imdb_id,
              imdb_rating = excluded.imdb_rating, tmdb_rating = excluded.tmdb_rating, editorial_rank = excluded.editorial_rank,
              featured = excluded.featured, status = 'active', synced_at = excluded.synced_at, updated_at = ${NOW}`,
      args: [EVENT.slug, m.movieId, m.sourceListId, m.title, m.posterPath, m.releaseDate, m.year, m.imdbId, m.imdbRating, m.tmdbRating, index + 1, featuredIds.has(m.movieId) ? 1 : 0],
    });
    stmts.push({
      sql: `DELETE FROM halloween_movie_categories WHERE halloween_movie_id = (SELECT id FROM halloween_movies WHERE event_id = ${eventId} AND movie_id = ?)`,
      args: [EVENT.slug, m.movieId],
    });
    stmts.push({
      sql: `INSERT INTO halloween_movie_categories (halloween_movie_id, category_id, classification_source)
            SELECT m.id, c.id, 'editorial' FROM halloween_movies m
            JOIN halloween_categories c ON c.event_id = m.event_id
            WHERE m.event_id = ${eventId} AND m.movie_id = ? AND c.slug IN (${m.slugs.map(() => '?').join(', ')})`,
      args: [EVENT.slug, m.movieId, ...m.slugs],
    });
  });

  const keepIds = movies.map((m) => m.movieId);
  stmts.push({
    sql: `UPDATE halloween_movies SET status = 'removed', featured = 0, updated_at = ${NOW}
          WHERE event_id = ${eventId} AND movie_id NOT IN (${keepIds.map(() => '?').join(', ')})`,
    args: [EVENT.slug, ...keepIds],
  });
  stmts.push({
    sql: `UPDATE halloween_categories SET is_visible = (
            (SELECT count(*) FROM halloween_movie_categories mc JOIN halloween_movies m ON m.id = mc.halloween_movie_id
             WHERE mc.category_id = halloween_categories.id AND m.status = 'active')
            >= CASE kind WHEN 'genre' THEN ? WHEN 'subgenre' THEN ? ELSE ? END), updated_at = ${NOW}
          WHERE event_id = ${eventId}`,
    args: [MIN_VISIBLE.genre, MIN_VISIBLE.subgenre, MIN_VISIBLE.tag, EVENT.slug],
  });

  await db.batch(stmts, 'write');

  const summary = (await db.execute({
    sql: `SELECT status, count(*) AS n FROM halloween_movies WHERE event_id = ${eventId} GROUP BY status`,
    args: [EVENT.slug],
  })).rows.map((r) => `${r.status} ${r.n}`).join(' · ');
  console.log(`Written: ${summary}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
