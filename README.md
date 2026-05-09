# Cinemagoria

> A community-oriented film & TV discovery platform.
> Lead developer: [@imprvhub](https://github.com/imprvhub) · In active development since March 27, 2024.

![Cinemagoria Cover](https://ivanluna.dev/images/assets/cinemagoria-asset1.webp)

Cinemagoria aggregates metadata, ratings, reviews, festival coverage, awards history, streaming availability and original soundtracks from **IMDb, TMDB, MusicBrainz, Trakt.tv, Rotten Tomatoes, JustWatch and MDBList** into a single deeply integrated experience — with full user accounts, public profiles, watchlists, custom lists and a follow-based notification system.

The platform is built around four principles:

- **Aggregation over exclusivity** — no in-house catalog; trusted third-party sources only.
- **Festival-first discovery** — dedicated coverage of major international film festivals.
- **Personalization without lock-in** — public/private profiles, custom lists, transparent controls with granular cookie consent management.
- **Performance as a feature** — pre-computed data, server-side selection, concurrent fetching.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Nuxt 4 · Vue 3 (Composition + Options API) |
| State / Bus | Pinia · `mitt` |
| Styling | SCSS (`@use`) |
| Primary database | Turso (LibSQL) — favorites, ratings, follows, notifications, profiles, news |
| Auth | Google OAuth + Django REST Framework (DRF) |
| Hosting | Railway (frontend) · Vercel (backend serverless functions) |
| Background jobs | TypeScript + Rust workers (news curation, release detection, typo detection) |

---

## N.O.I.R. — The Cinemagoria Selection

<div align="center">
  <img src="https://ivanluna.dev/images/assets/cinemagoria-asset11.webp" alt="N.O.I.R. — Nothing Out Is Ready" width="70%">
</div>

**N.O.I.R. (Nothing Out Is Ready)** is Cinemagoria's in-house editorial selection — a parallel content layer to the algorithmic feeds, covering titles released or scheduled from 2024 onwards. Curation is forward-looking: upcoming premieres are added well in advance, with the current selection reaching as far as March 2027.

**Two states, one badge.** A title in N.O.I.R. lives in one of two states:

- **`hero_selections`** — actively rotating in the homepage marquee rendered by `Hero.vue` (`pages/index.vue`). These are the titles Cinemagoria is currently promoting for cultural value and editorial alignment.
- **`/noir` archive** — where titles move once they exit the active rotation. Nothing is ever removed; rotating out is a state transition into the historical record. The page also exposes a `?` trigger that opens the N.O.I.R. manifesto.

The N.O.I.R. badge — rendered in the top-right corner of each backdrop in `Hero.vue` — applies in both states, so any title Cinemagoria has ever editorially promoted stays identifiable wherever it appears across the platform.

**Data pipeline.** A scheduled GitHub Actions workflow keeps the N.O.I.R. dataset (titles, enrichment data, rotation state) in sync with the curatorial source so additions and state transitions propagate without manual deploys.

---

## Features

### Film Festivals
<div align="center">
  <img src="https://ivanluna.dev/images/assets/cinemagoria-asset9.webp" alt="Festivals" width="70%">
</div>

Dedicated coverage for major international festivals — Sundance, Berlinale, Rotterdam, Slamdance, SXSW, Romford, BIFFF, BAFICI, Tribeca (now fully supported), Cannes (completed with official screenings and parallel sections: Critics' Choice, Quinzaine des Cinéastes, ACID), CUFF (Calgary Underground Film Festival) and more — each with its own page, API endpoints, card and badge components, and homepage carousel. The hero section supports multiple simultaneous festival premiere badges with display precedence, and Berlinale ships with an interactive timezone-aware schedule.

### Search & Discovery
<div align="center">
  <img src="https://ivanluna.dev/images/assets/cinemagoria-asset10.webp" alt="Search" width="70%">
</div>

Categorized multi-search across movies, TV shows, people, news, festivals and production companies — visually separated by category through horizontal carousels. Contextual query parsing extracts year and person signals to score results by relevance, with a built-in search guide modal for best practices. Supports direct IMDb / TMDb ID lookup, embedded Discover filters and Rust-backed typo detection.

### Catalog Discovery
<div align="center">
  <img src="https://ivanluna.dev/images/assets/cinemagoria-asset2.webp" alt="Discover" width="70%">
</div>

A unified Discover component embedded directly in Movie and TV pages: granular content filters, IMDb and user rating ranges, item enrichment with chunking, and chip-based active filter display.

### Awards
<div align="center">
  <img src="https://ivanluna.dev/images/assets/cinemagoria-asset6.webp" alt="Awards" width="70%">
</div>

Full historical coverage of the Academy Awards, Golden Globes, Palme d'Or, Golden Lion and Golden Bear, fetched concurrently. Includes a dedicated Awards Index page, per-title and per-person awards tabs, and intelligent link resolution that routes to the correct movie or TV page even when TMDb IDs collide.

### Movie & TV Detail
<div align="center">
  <img src="https://ivanluna.dev/images/assets/cinemagoria-asset8.webp" alt="Detail Pages" width="70%">
</div>

IMDb-first ratings with TMDB fallback (always labeled), Rotten Tomatoes Tomatometer, MusicBrainz original soundtracks, Trakt.tv reviews, release status context, country-flagged release dates, and tab-based recommendation carousels (Similar / By the Director / By the Producer / By the Creator). External links render conditionally — never broken.

### Watchlist & Custom Lists
<div align="center">
  <img src="https://ivanluna.dev/images/assets/cinemagoria-asset4.webp" alt="Watchlist" width="70%">
</div>

A 50-movie + 50-TV watchlist with persistent filters (genre, year, IMDb rating range, votes, personal rating) and Bayesian-weighted sorting. Unlimited custom themed lists with descriptions, public/private toggles, cloning of public lists, dynamic SEO, and bulk multi-select actions with undo. The global QuickFav dropdown manages list membership from any content card.

### Follows & Notifications
<div align="center">
  <img src="https://ivanluna.dev/images/assets/cinemagoria-asset3.webp" alt="Notifications" width="70%">
</div>

Follow people (actors, directors, writers), TV shows, production companies and streaming platforms. A `/cron/check-releases` job detects new films (±30 days for people) and new episodes (±7 days for TV), pushing rich notifications synced across devices via Turso. The notification center supports filtering, bulk mark-all-read, paginated browsing and per-item deletion with ownership validation.

### Cinema News
<div align="center">
  <img src="https://ivanluna.dev/images/assets/cinemagoria-asset5.webp" alt="News" width="70%">
</div>

Cinemagoria now runs its own AI-assisted editorial engine for cinema news — articles are curated, ranked and surfaced through an in-house pipeline rather than served raw from third-party feeds. Article pages feature YouTube trailer embeds, multi-asset image carousels, and related TMDB movies, TV shows and people for discoverability. The frontend reads pre-computed results from Turso (sub-50ms load times), with article search, saved articles, an RSS feed for Cinemagoria-sourced content and a homepage news carousel.

### Authentication
<div align="center">
  <img src="https://ivanluna.dev/images/assets/cinemagoria-asset7.webp" alt="Authentication" width="70%">
</div>

Modal-based auth (no `/login` or `/register` pages) with Google OAuth backed by Django REST Framework, queued pending actions that resume after sign-in, event-driven session updates, and DOMPurify-protected user content. Account deletion is fully self-service.

---

## Additional Capabilities

- **Public user profiles** with activity feeds, follower/following management and configurable privacy.
- **Granular media progress tracking** down to individual TV episodes, surfaced via circular progress indicators in the global ProgressTrackingModal.
- **Production company & streaming platform pages** with dedicated content listings, sorting, follow buttons and "Explore All" entry points.
- **Server-side hero selection** with quality gating (IMDb origin, score > 7.0, > 5,000 votes, animation/fantasy excluded) and a promise-based Map cache for enrichment.
- **Internationalization** in English and Español via subdomain switching, with AI-delegated translation for hero overviews.

---

## Architecture Highlights

- **Concurrent fetching everywhere** — `Promise.all` for homepage data, awards and hero APIs; `Promise.allSettled` for provider and review fetching.
- **ISR + route caching** on Movie, TV and root routes; CSR preserved for interactive routes like `/search`.
- **News and awards decoupled from request time** — pre-curated by background workers, read instantly at request time.
- **Dynamic, split sitemap generation** via server routes for SEO.
- **`fetchWithRefill` carousel batching** with seen-ID deduplication and diversity capping.
- **Hero enrichment override system** (`force_enrichment`, `_forcePoster`, `_forceBackdrop`, `_forceTrailer` mixins) for precise control over featured assets.
- **Standardized utilities** — `mapItemToDbPayload`, `itemMapper`, `getPosterUrl`, `formatDate`, `handleImageError` — to keep payloads and rendering consistent across components.

---

## Setup

```bash
git clone https://github.com/cinemagoria/cinemagoria.git
cd cinemagoria
yarn install
cp .env.example .env   # configure required keys
yarn dev
```

Environment variables are accessed exclusively through `useRuntimeConfig()` — there are no hardcoded service endpoints.

---

## Project Layout

```
/pages          Routes (movie, tv, festival, watchlist, lists, news, notifications, ...)
/components     Hero, Discover, QuickFav, AwardsTab, CategorySection, ExternalLinks, ...
/components/global   UserNav, RatedModal, FollowingModal, AuthModal
/server/api     hero, awards, news, festival/[slug], imdb-rating
/mixins         Filters.js, _forcePoster, _forceBackdrop, _forceTrailer
/utils          helpers.js, countries.js, constants.js
/scripts        curator.js (background news curation)
```

---

**Repository:** [github.com/cinemagoria/cinemagoria](https://github.com/cinemagoria/cinemagoria) · **Issues:** [open one](https://github.com/cinemagoria/cinemagoria/issues/new)

*Built for film enthusiasts, by film enthusiasts.*
