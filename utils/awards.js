// Awards for the awards modal, from /api/awards/by-entity.
// Titles share one in-memory cache per visit, so the hero and the detail page
// never ask twice for the same title. Client only: on the server it returns nothing.

const titleCache = new Map();

export const awardsKey = (type, id) => (id ? `${type === 'tv' ? 'tv' : 'movie'}:${id}` : '');

// Resolves to { 'movie:123': groups, ... }; titles not yet cached go out in one request.
export function loadTitleAwards(keys) {
  const wanted = Array.from(new Set(keys.filter(Boolean)));
  if (import.meta.server || wanted.length === 0) return Promise.resolve({});

  const pending = wanted.filter(key => !titleCache.has(key));
  // The endpoint takes 24 titles per request.
  for (let i = 0; i < pending.length; i += 24) {
    const chunk = pending.slice(i, i + 24);
    const request = $fetch('/api/awards/by-entity', { params: { entities: chunk.join(',') } })
      .then(res => (res && res.results) || {})
      .catch(() => ({}));
    for (const key of chunk) titleCache.set(key, request.then(results => results[key] || []));
  }
  return Promise.all(wanted.map(key => titleCache.get(key)))
    .then(lists => Object.fromEntries(wanted.map((key, i) => [key, lists[i]])));
}

export function loadPersonAwards(name) {
  if (import.meta.server || !name) return Promise.resolve([]);
  return $fetch('/api/awards/by-entity', { params: { person: name } })
    .then(res => (res && res.person) || [])
    .catch(() => []);
}

export function awardsCounts(groups) {
  let wins = 0;
  let nominations = 0;
  for (const group of groups || []) for (const award of group.awards) award.won ? wins++ : nominations++;
  return { wins, nominations };
}

// "3 wins · 11 nominations"
export function awardsSummary(groups) {
  const { wins, nominations } = awardsCounts(groups);
  const parts = [];
  if (wins) parts.push(wins === 1 ? '1 win' : `${wins} wins`);
  if (nominations) parts.push(nominations === 1 ? '1 nomination' : `${nominations} nominations`);
  return parts.join(' · ');
}
