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
 * included — through one shared tier function.
 *
 * Ranking has to be name-aware, not just date-aware, because studios publish
 * non-trailer content under `type: "Trailer"`:
 *   - Silo S4 only has "Season 4 Announcement"      -> must fall back to S3.
 *   - Widow's Bay S2 only has "Season 2 Renewal"    -> must keep the series trailer.
 *   - HBO ships a "Weeks Ahead Trailer" mid-run     -> must lose to the real season trailer.
 * Demotion is soft: a demoted video still wins when nothing better exists.
 *
 * This file is byte-identical across cinemagoria-main / -es / -stream / -estream
 * and mirrored by cinemagoria-candidates-selections/lib/tv-trailer.mjs. Keep
 * them in sync — drift here means the site and the DB disagree on what the
 * trailer is.
 */

// Published under `type: "Trailer"`/`"Teaser"` but not actually a trailer.
const DEMOTE_RE = /\b(announce|announcement|renewal|renewed|weeks ahead|next week|inside the episode|recap|sneak peek|first look|title tease|coming soon|now streaming|all episodes|behind the scenes|blooper)\b/i;

// A name that actually says "trailer" beats one that doesn't, within the same type.
const LOOKS_LIKE_TRAILER_RE = /tr[aá]iler/i;

// Tier <= this counts as "a real trailer for this season", which stops the
// season walk early instead of probing every season down to 1.
export const TV_TRAILER_GOOD_TIER = 3;

// Ceiling on season probes. The Simpsons has 38 seasons; without this we would
// fire 38 requests to discover that its newest trailer is from S35.
export const TV_TRAILER_MAX_SEASON_PROBES = 4;

/**
 * Lower is better. 99 means "not a trailer at all" and never gets picked.
 */
export function rankTvVideo(video) {
  if (!video || video.site !== 'YouTube') return 99;

  const type = video.type;
  const demoted = DEMOTE_RE.test(video.name || '');
  const named = LOOKS_LIKE_TRAILER_RE.test(video.name || '');

  if (type === 'Trailer' && !demoted && named && video.official) return 1;
  if (type === 'Trailer' && !demoted && named) return 2;
  if (type === 'Trailer' && !demoted) return 3;
  if (type === 'Teaser' && !demoted && named) return 4;
  if (type === 'Teaser' && !demoted) return 5;
  if (type === 'Trailer') return 6;
  if (type === 'Teaser') return 7;
  return 99;
}

const publishedAtMs = (video) => Date.parse(video?.published_at || 0) || 0;

/**
 * Best trailer out of a mixed pool. Candidates carry a `season` number, with 0
 * standing for the series-level list, so a genuine season trailer outranks an
 * equally-tiered series-level one.
 */
export function pickBestTvVideo(candidates) {
  const usable = (candidates || []).filter(v => rankTvVideo(v) < 99);
  if (!usable.length) return null;

  return usable.slice().sort((a, b) =>
    rankTvVideo(a) - rankTvVideo(b)
    || (b.season || 0) - (a.season || 0)
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
 * exactly today's behaviour, so a TMDB hiccup can never blank out a TV page.
 *
 * Returns { best, videos, seasonProbes }, where `videos` is the deduped merge of
 * everything fetched (for the Videos tab) and `best` is the trailer to play.
 */
export async function resolveTvTrailer({ seriesVideos, seasons, fetchSeasonVideos }) {
  const seen = new Set();
  const merged = [];
  const add = (videos) => {
    for (const video of videos) {
      const key = video.id || `${video.key}-${video.type}`;
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(video);
    }
  };

  add(tagSeason(seriesVideos, 0));

  const ordered = (seasons || [])
    .filter(s => Number(s.season_number) > 0)
    .sort((a, b) => Number(b.season_number) - Number(a.season_number));

  // Single-season show whose series-level list already has a real trailer: the
  // season endpoint has nothing better to offer (Spider-Noir's S1 holds only
  // casting teasers), so skip the request entirely.
  const seriesBest = pickBestTvVideo(merged);
  if (ordered.length <= 1 && seriesBest && rankTvVideo(seriesBest) <= TV_TRAILER_GOOD_TIER) {
    return { best: seriesBest, videos: merged, seasonProbes: 0 };
  }

  let seasonProbes = 0;
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

    const best = pickBestTvVideo(merged);
    if (best && best.season === seasonNumber && rankTvVideo(best) <= TV_TRAILER_GOOD_TIER) break;
  }

  return { best: pickBestTvVideo(merged), videos: merged, seasonProbes };
}
