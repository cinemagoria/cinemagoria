# Article Trailer Audit

Audit trail for issue #539. Editorial articles embed one trailer, stored in
`cinemagoria_articles.trailer_youtube_id` with `trailer_provider` set to
`youtube` or `vimeo`, and rendered by
[`pages/news/[slug].vue`](../../pages/news/%5Bslug%5D.vue) whenever the ID is not
empty. The trailer is an external resource: when the uploader removes it, the
channel closes, or the owner disables playback on other sites, the article
keeps rendering a dead player on both language sites.

## Tool

The check lives in the editorial tooling, next to the article CMS:

| Command | Effect |
|---|---|
| `npm run trailers` | Read-only. Checks every editorial trailer and prints the plan. |
| `npm run trailers:apply` | Writes the plan and keeps a git-ignored backup of every changed row with its previous and new values and the source of the replacement. |

Only editorial articles (`is_cinemagoria = 1`) are checked. Article bodies were
audited as well; they mention YouTube in the text but embed no video, so the
trailer column is the only surface.

## How a trailer is judged

A trailer is broken when YouTube or Vimeo oEmbed answers with a 4xx status.
That covers removed and private videos and videos whose owner disabled
embedding, which still play on YouTube but not inside the article. Timeouts and
rate limits are reported as unverified and never treated as broken.

## How a replacement is chosen

The replacement belongs to the article's lead title, the first `movie` or `tv`
entry of `related_tmdb_ids`. Sources are tried in this order, and every
candidate must pass oEmbed before it is used:

1. **TMDB videos.** Trailers before teasers, official before unofficial, newest
   first. Series walk their seasons from the latest one down, then the
   series-level list.
2. **The title's official site.** YouTube and Vimeo videos linked from the TMDB
   homepage, accepted when their title names the film and reads as a trailer.
3. **YouTube search.** A result is accepted only when it comes from a festival,
   distributor or studio channel, names the title, reads as a trailer or teaser
   or names the director, runs between 15 seconds and 7 minutes, and mentions
   the title's year or director. Re-uploads by fake-trailer channels are
   rejected by the channel rule.

When no source yields a verified trailer, `--apply` clears the trailer and the
article falls back to its carousel.

## Result — 2026-09-26

* Editorial trailers checked: **505**
* No longer playing: **15**
* Replaced with a verified trailer of the same title: **14** (5 from TMDB,
  9 from festival or distributor uploads)
* Cleared because no trailer exists: **1**
* Second pass: every remaining trailer plays

The replacements were reviewed by hand before this document was written. The
review caught one fake-trailer upload, which led to the channel rule above; the
article now carries the festival's official upload.

## Re-running

Run `npm run trailers` periodically and review the plan before
`npm run trailers:apply`. `/api/article` responses are cached for an hour, so
new trailers show on the live pages once that cache expires.
