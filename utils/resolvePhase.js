const JUST_OUT_WINDOW_DAYS = 14;
const LATEST_EPISODES_WINDOW_DAYS = 30;

function toDay(str) {
  if (!str) return null;
  const [y, m, d] = str.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function daysSince(date, today) {
  return Math.floor((today - date) / 86_400_000);
}

function normalizeToday(today = new Date()) {
  return new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
}

export function resolveMoviePhase(item, today = new Date()) {
  const _today = normalizeToday(today);

  const anchor = toDay(item.theatrical_anchor);
  const firstT = toDay(item.first_theatrical);
  const lastT = toDay(item.last_theatrical);

  if (!anchor && !firstT) return 'no_date';
  if ((anchor && anchor > _today) || (!anchor && firstT && firstT > _today)) return 'coming_soon';
  if (anchor && daysSince(anchor, _today) <= JUST_OUT_WINDOW_DAYS) return 'just_out';
  if (lastT && lastT >= _today) return 'now_playing';
  return 'after_run';
}

export function resolveTvPhase(item, today = new Date()) {
  const _today = normalizeToday(today);

  const firstAir = toDay(item.first_air_date);
  const nextAir = toDay(item.next_air_date);
  const lastAir = toDay(item.last_air_date);
  const status = item.status ?? '';

  if (!firstAir) return 'no_date';
  if (firstAir > _today) return 'premiering';
  if (nextAir && nextAir > _today) return 'airing';
  if (['Ended', 'Canceled'].includes(status)) return 'completed';
  if (lastAir && daysSince(lastAir, _today) <= LATEST_EPISODES_WINDOW_DAYS) return 'latest_episodes';
  return 'airing';
}
