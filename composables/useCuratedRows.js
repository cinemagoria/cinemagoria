import { getMovies, getTvShows } from '~/utils/api';
import { CURATED_ROWS } from '~/utils/discover';

export function useCuratedRows(type) {
  const rows = CURATED_ROWS[type];
  const fetchList = type === 'movie' ? getMovies : getTvShows;
  const key = type === 'movie' ? 'movies-home' : 'tv-home';

  return useAsyncData(key, async () => {
    const settled = await Promise.all(
      rows.map(row => fetchList(row.query).catch((error) => {
        console.error(`Discover row fetch error (${type}/${row.query}):`, error);
        return null;
      }))
    );
    return Object.fromEntries(rows.map((row, index) => [row.query, settled[index]]));
  }, {
    default: () => ({}),
  });
}
