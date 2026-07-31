/**
 * TV trailer resolution — always the LATEST season, never season 1.
 *
 * TMDB's series-level video list (`/tv/{id}?append_to_response=videos`) is
 * effectively frozen at the show's launch. Stranger Things still tops out at
 * "Season 1 Trailer 1" (2018), The Boys at S1's "Final Trailer" (2019), The
 * Last of Us at S1's "Official Trailer" (2022). Season trailers live on a
 * separate endpoint — `/tv/{id}/season/{n}/videos` — that nothing used to call,
 * which is why every TV page has been playing a season-1 trailer for years.
 *
 * Sorting the series-level list by `published_at` does NOT fix it: the newest
 * entry there is usually a blooper reel, an opening-credits clip or a
 * featurette. The only reliable source is the season endpoint, so we probe
 * seasons from the highest number down and rank every candidate — series-level
 * included — through one shared function.
 *
 * Ranking happens in two steps, and the order matters:
 *
 *   1. CLASS — what kind of video is this? A real trailer beats a promotional
 *      teaser, which beats a character spot, which beats things that are not
 *      trailers at all despite TMDB's `type`. Class is compared first because
 *      Spider-Noir's S1 holds only cast teasers ("Karen Rodriguez Is Janet
 *      Ruiz") while the series-level list has the actual Final Trailer.
 *
 *   2. SEASON — newest first, but only among videos of the same class. This is
 *      what pushes Stranger Things to S5 and The Boys to S5. It sits above the
 *      name heuristic on purpose: when Euphoria's polished "Season 3 Trailer 2"
 *      turned out to be a dead YouTube embed, the fallback had to be S3's
 *      "Weeks Ahead Trailer", not the season-1 trailer from 2019.
 *
 * Videos that are not trailers at all get demoted hard, which is what keeps
 * Silo off "Season 4 Announcement" (falling back to S3's real trailer) and
 * Widow's Bay off "Season 2 Renewal".
 *
 * This file is byte-identical across cinemagoria-main / -es / -stream / -estream
 * and mirrored by cinemagoria-candidates-selections/lib/tv-trailer.mjs. Keep
 * them in sync — drift here means the site and the DB disagree on what the
 * trailer is.
 */

// Filed under `type: "Trailer"`/`"Teaser"` but not a trailer in any sense.
// These lose to everything, including an older season's real trailer.
const HARD_DEMOTE_RE = /\b(announce|announcement|renewal|renewed|recap|sneak peek|first look|title tease|behind the scenes|blooper|opening credits|coming soon|now streaming|all episodes)\b/i;

// Real promotional cuts that are still worse than the season's main trailer —
// HBO's mid-run "Weeks Ahead" montages and the like. Demoted within their
// season, never below a different season.
const SOFT_DEMOTE_RE = /\b(weeks ahead|next week|inside the episode)\b/i;

// A teaser that names itself is a marketing beat; one that doesn't is usually a
// character spot or a stunt clip.
const PROMO_NAME_RE = /tr[aá]iler|teaser|official/i;
const TRAILER_NAME_RE = /tr[aá]iler/i;

// Ceiling on season probes. The Simpsons has 38 seasons; without this we would
// fire 38 requests to discover that its newest trailer is from S35.
export const TV_TRAILER_MAX_SEASON_PROBES = 4;

// How many dead YouTube keys we're willing to skip past before giving up and
// playing whatever ranks best. TMDB keeps rows for videos YouTube has since
// pulled — every Euphoria S3 trailer but one is a dead embed — so the
// highest-ranked candidate is not always the one that actually plays.
export const TV_TRAILER_MAX_PLAYABILITY_CHECKS = 3;

/**
 * Coarse bucket, compared before season. Lower is better; 9 means "never pick".
 */
export function tvVideoClass(video) {
  if (!video || video.site !== 'YouTube') return 9;
  const name = video.name || '';
  const hardDemoted = HARD_DEMOTE_RE.test(name);

  if (video.type === 'Trailer') return hardDemoted ? 4 : 1;
  if (video.type === 'Teaser') {
    if (hardDemoted) return 4;
    return PROMO_NAME_RE.test(name) ? 2 : 3;
  }
  return 9;
}

/**
 * Fine-grained quality inside a class. Lower is better; 99 means "never pick".
 */
export function rankTvVideo(video) {
  if (tvVideoClass(video) === 9) return 99;
  const name = video.name || '';
  const softDemoted = SOFT_DEMOTE_RE.test(name);
  const named = TRAILER_NAME_RE.test(name);

  if (!softDemoted && named && video.official) return 1;
  if (!softDemoted && named) return 2;
  if (!softDemoted) return 3;
  return 4;
}

/** A trailer good enough to stop the season walk on. */
export const isUsableSeasonTrailer = (video) => tvVideoClass(video) <= 2;

const publishedAtMs = (video) => Date.parse(video?.published_at || 0) || 0;

/**
 * Best trailer out of a mixed pool. Candidates carry a `season` number, with 0
 * standing for the series-level list, so a genuine season trailer outranks an
 * equally-classed series-level one.
 */
export function pickBestTvVideo(candidates) {
  const usable = (candidates || []).filter(v => tvVideoClass(v) < 9);
  if (!usable.length) return null;

  return usable.slice().sort((a, b) =>
    tvVideoClass(a) - tvVideoClass(b)
    || (b.season || 0) - (a.season || 0)
    || rankTvVideo(a) - rankTvVideo(b)
    || publishedAtMs(b) - publishedAtMs(a)
  )[0];
}

const tagSeason = (videos, season) =>
  (videos || []).map(v => ({ ...v, season }));

/**
 * Walk seasons newest-first until a real trailer for one of them shows up.
 *
 * `fetchSeasonVideos(seasonNumber)` must resolve to a TMDB videos array. It is
 * called at most TV_TRAILER_MAX_SEASON_PROBES times and every failure is
 * swallowed — a dead season request degrades to the series-level list, which is
 * exactly the old behaviour, so a TMDB hiccup can never blank out a TV page.
 *
 * `isPlayable(key)` is optional. When supplied it should resolve to false for
 * YouTube keys that will not embed, and the walk skips past them. It is
 * fail-open: anything that throws counts as playable, so a rate-limited or
 * unreachable checker degrades to ranking alone rather than dropping trailers.
 *
 * Returns { best, videos, seasonProbes }, where `videos` is the deduped merge of
 * everything fetched (for the Videos tab) and `best` is the trailer to play.
 */
export async function resolveTvTrailer({ seriesVideos, seasons, fetchSeasonVideos, isPlayable }) {
  const seen = new Set();
  const merged = [];
  const add = (videos) => {
    for (const video of videos) {
      const dedupeKey = video.id || `${video.key}-${video.type}`;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);
      merged.push(video);
    }
  };

  add(tagSeason(seriesVideos, 0));

  // Keys already found unplayable, so the season walk never re-checks one.
  const unplayable = new Set();

  const bestPlayable = async () => {
    for (let attempt = 0; attempt <= TV_TRAILER_MAX_PLAYABILITY_CHECKS; attempt++) {
      const candidate = pickBestTvVideo(merged.filter(v => !unplayable.has(v.key)));
      if (!candidate || !isPlayable) return candidate;
      if (attempt === TV_TRAILER_MAX_PLAYABILITY_CHECKS) return candidate;

      let playable = true;
      try {
        playable = await isPlayable(candidate.key);
      } catch (error) {
        playable = true;
      }
      if (playable) return candidate;
      unplayable.add(candidate.key);
    }
    return null;
  };

  const ordered = (seasons || [])
    .filter(s => Number(s.season_number) > 0)
    .sort((a, b) => Number(b.season_number) - Number(a.season_number));

  // Single-season show whose series-level list already has a real trailer: the
  // season endpoint has nothing better to offer (Spider-Noir's S1 holds only
  // casting teasers), so skip the request entirely.
  if (ordered.length <= 1) {
    const seriesBest = await bestPlayable();
    if (isUsableSeasonTrailer(seriesBest)) {
      return { best: seriesBest, videos: merged, seasonProbes: 0 };
    }
  }

  let seasonProbes = 0;
  let best = null;
  for (const season of ordered) {
    if (seasonProbes >= TV_TRAILER_MAX_SEASON_PROBES) break;
    seasonProbes++;

    const seasonNumber = Number(season.season_number);
    let seasonVideos = [];
    try {
      seasonVideos = await fetchSeasonVideos(seasonNumber) || [];
    } catch (error) {
      seasonVideos = [];
    }
    add(tagSeason(seasonVideos, seasonNumber));

    best = await bestPlayable();
    if (best && best.season === seasonNumber && isUsableSeasonTrailer(best)) break;
  }

  return { best: best || await bestPlayable(), videos: merged, seasonProbes };
}
