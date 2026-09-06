const NOT_AVAILABLE = 'Not Available';

const NUMBER_LOCALE = 'en-US';

const LABELS = {
  imdbRating: 'IMDb Rating',
  tmdbRating: 'TMDB Rating',
  votes: 'votes',
  director: 'Director',
  creator: 'Creator',
  releaseDate: 'Release Date',
  firstAirDate: 'First Air Date',
  genre: 'Genre',
  status: 'Status',
  production: 'Production',
  plot: 'Plot',
  cast: 'Cast',
  crew: 'Crew',
};

const CREW_DEPARTMENTS = [
  { key: 'Writing', label: 'Writing' },
  { key: 'Production', label: 'Production' },
  { key: 'Sound', label: 'Sound' },
];

const CAST_LIMIT = 15;
const CREW_LIMIT = 8;

const HTML_ENTITIES = {
  '&nbsp;': ' ',
  '&lt;': '<',
  '&gt;': '>',
  '&#39;': "'",
  '&apos;': "'",
  '&quot;': '"',
  '&amp;': '&',
};

function plainText(value) {
  return String(value == null ? '' : value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;|&lt;|&gt;|&#39;|&apos;|&quot;|&amp;/g, entity => HTML_ENTITIES[entity])
    .replace(/\s+/g, ' ')
    .trim();
}

function orFallback(value) {
  return plainText(value) || NOT_AVAILABLE;
}

function formatRating(score, votes) {
  const value = Number(score);
  if (!value) return NOT_AVAILABLE;

  const rating = `${value.toFixed(1)}/10`;
  const count = Number(votes);
  return count ? `${rating} (${count.toLocaleString(NUMBER_LOCALE)} ${LABELS.votes})` : rating;
}

function namesFrom(list) {
  const names = (list || []).map(entry => plainText(entry && entry.name)).filter(Boolean);
  return names.length ? names.join(', ') : NOT_AVAILABLE;
}

function castLines(cast) {
  const people = (cast || []).filter(person => person && person.name).slice(0, CAST_LIMIT);
  if (!people.length) return [NOT_AVAILABLE];
  return people.map(person => {
    const character = plainText(person.character);
    return character ? `${plainText(person.name)} — ${character}` : plainText(person.name);
  });
}

function departmentLines(crew, department) {
  const people = new Map();

  for (const member of crew || []) {
    if (!member || !member.id || !member.name) continue;
    if ((member.department || '') !== department) continue;

    const existing = people.get(member.id);
    if (existing) {
      if (member.job && !existing.jobs.includes(member.job)) existing.jobs.push(member.job);
    } else {
      people.set(member.id, {
        name: plainText(member.name),
        popularity: member.popularity || 0,
        jobs: member.job ? [member.job] : [],
      });
    }
  }

  if (!people.size) return [NOT_AVAILABLE];

  return [...people.values()]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, CREW_LIMIT)
    .map(person => (person.jobs.length ? `${person.name} — ${person.jobs.join(', ')}` : person.name));
}

export function buildCopySummary({
  title,
  year,
  imdbRating,
  imdbVotes,
  tmdbRating,
  tmdbVotes,
  releaseDate,
  director,
  genres,
  status,
  productionCompanies,
  plot,
  credits,
  isSeries = false,
} = {}) {
  const heading = year ? `${orFallback(title)} (${year})` : orFallback(title);

  const lines = [
    heading,
    '',
    `${isSeries ? LABELS.creator : LABELS.director}: ${orFallback(director)}`,
    `${isSeries ? LABELS.firstAirDate : LABELS.releaseDate}: ${orFallback(releaseDate)}`,
    `${LABELS.genre}: ${namesFrom(genres)}`,
    `${LABELS.status}: ${orFallback(status)}`,
    `${LABELS.imdbRating}: ${formatRating(imdbRating, imdbVotes)}`,
    `${LABELS.tmdbRating}: ${formatRating(tmdbRating, tmdbVotes)}`,
    `${LABELS.production}: ${namesFrom(productionCompanies)}`,
    '',
    `${LABELS.plot}: ${orFallback(plot)}`,
    '',
    `${LABELS.cast}:`,
    ...castLines(credits && credits.cast).map(line => `- ${line}`),
    '',
    `${LABELS.crew}:`,
  ];

  for (const department of CREW_DEPARTMENTS) {
    lines.push(`${department.label}:`);
    lines.push(...departmentLines(credits && credits.crew, department.key).map(line => `- ${line}`));
  }

  return lines.join('\n');
}
