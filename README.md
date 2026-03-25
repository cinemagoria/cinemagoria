# Cinemagoria

> **Current Version:** v4.8.0 — Production Ready
> **Release Date:** March 25, 2026
> **Status:** A New Era of Social Features, Awards, and Performance
> **Repository:** [github.com/cinemagoria/cinemagoria](https://github.com/cinemagoria/cinemagoria)
> **Lead Developer:** [@imprvhub](https://github.com/imprvhub) (Iván Luna)
> **In development since:** March 27, 2024

---

![Cinemagoria Cover](https://ivanluna.dev/images/assets/cinemagoria-asset1.webp)

---

## Table of Contents

1. [What is Cinemagoria?](#1-what-is-cinemagoria)
2. [Core Technical Architecture](#2-core-technical-architecture)
3. [Data Sources & External Integrations](#3-data-sources--external-integrations)
4. [Search & Content Discovery](#4-search--content-discovery)
5. [Film Festival Coverage](#5-film-festival-coverage)
6. [Awards System](#6-awards-system)
7. [Hero Section, Homepage & N.O.I.R. Archive](#7-hero-section-homepage--noir-archive)
8. [Movie & TV Show Detail Pages](#8-movie--tv-show-detail-pages)
9. [Person Profiles](#9-person-profiles)
10. [Original Soundtrack (OST) Integration](#10-original-soundtrack-ost-integration)
11. [Watchlist & List Management](#11-watchlist--list-management)
12. [User Profiles, Ratings & Reviews](#12-user-profiles-ratings--reviews)
13. [Production Company Pages](#13-production-company-pages)
14. [Streaming Platform Support](#14-streaming-platform-support)
15. [Follow & Notification System](#15-follow--notification-system)
16. [Cinema News Section](#16-cinema-news-section)
17. [Authentication System](#17-authentication-system)
18. [UI/UX Design System](#18-uiux-design-system)
19. [Performance & Infrastructure](#19-performance--infrastructure)
20. [API Reference](#20-api-reference)
21. [Security](#21-security)
22. [Internationalization](#22-internationalization)
23. [Developer Reference](#23-developer-reference)

---

## 1. What is Cinemagoria?

Cinemagoria is a comprehensive, community-oriented film and TV discovery platform that aggregates metadata, ratings, reviews, festival data, award histories, streaming availability, soundtrack information, and curated content from multiple authoritative third-party sources into a single, deeply integrated user experience.

The platform is designed for film enthusiasts who want more than basic search: real-time festival circuit coverage, historical award recognition, production company tracking, personalized watchlists and custom lists, content-specific streaming provider discovery, and follow-based notification workflows for new releases from favorite talent and TV shows.

Cinemagoria operates as a public-facing web application with full user account support, public user profiles, cross-device data synchronization, and a rich personalization layer. It has been under continuous active development since its initial commit on **March 27, 2024**, and has undergone two major architectural overhauls.

### Platform Philosophy

- **Aggregation over exclusivity:** Cinemagoria pulls from IMDb, TMDB, MusicBrainz, Trakt.tv, Rotten Tomatoes, JustWatch, and MDBList rather than maintaining its own content catalog.
- **Festival-first discovery:** The platform maintains dedicated pages, APIs, and components for international film festivals — Sundance, Berlinale, Rotterdam, Slamdance, SXSW, and Romford as of v4.7.0. (Future Expansion)
- **Personalization without lock-in:** Users manage public or private profiles, watchlists, custom lists with full privacy controls, and follow-based notification feeds — all transparent and user-controlled.
- **Performance as a feature:** News load times dropped from ~10 seconds to under 50ms in v4.3.4. Hero data is server-side selected. Awards are served from local JSON. `Promise.all` / `Promise.allSettled` concurrent patterns are used throughout.

---

## 2. Core Technical Architecture

### 2.1 Frontend Framework

| Layer | Technology |
|---|---|
| Framework | Nuxt 4 (Vue 3) |
| Component model | Vue 3 Composition API + Options API (Hybrid Compatibility) |
| State management | Pinia (migrated from Vuex in v4.0.0) |
| Global event bus | `mitt` (replaced `$root` event bus in v4.0.0) |
| Routing | Vue Router via `$router.push` (migrated from `window.location.href`) |
| Styling | SCSS with `@use` syntax (modernized from deprecated `@import` in v1.9.0) |
| Build config | `nuxt.config.ts` (migrated from `.js` in v4.0.0) |
| HTTP client | Nuxt 3 `$fetch` utility with custom axios shim |
| Image lazy loading | Native `loading="lazy"` (replaced `v-lazyload` in v4.0.0) |
| Asset path | `public/` directory (migrated from `static/` in v4.0.0) |
| Asset aliases | `@/assets/` and `~/assets/` (standardized in v4.0.0) |
| Vue 2 filters | Refactored to callable methods in `mixins/Filters.js` (v4.0.0) |
| Carousel component | Swiper (v12.1.2 as of v4.7.0) |

### 2.2 Backend & Databases

| Layer | Technology |
|---|---|
| Deployment | Vercel (serverless) |
| Primary database | Turso (LibSQL) — favorites, ratings, news curation, notifications, follows, user profiles, activity feeds |
| Secondary database | Supabase — auth only (user data fetching removed in v4.8.0) |
| Performance Edge | Extensive route caching (`maxAge`) & ISR configurations (v4.8.0) |
| Serverless constraint | 5-second execution timeout on all Vercel API routes |
| CORS | Explicit headers configured per Vercel environment |
| Typo detection service | `api/typo.rs` — dedicated Rust-based endpoint |
| Background jobs | GitHub Actions — scheduled news curation pipeline (`scripts/curator.js`) |

### 2.3 API Layer

All API calls use Nuxt 3's `$fetch` with a custom axios shim for backward compatibility. Legacy `api/*.js` Netlify functions have been fully removed. Environment variables are accessed via `this.$config.public` or `useRuntimeConfig()`. Hardcoded service endpoints have been replaced by centralized configuration values.

**Key server-side API endpoints (current as of v4.7.0):**

```
GET  /api/hero                          → Server-side random hero item selection (Cached: 30m)
GET  /api/awards                        → Awards data including historical overview (Cached: 1h)
GET  /api/festival/berlinale/schedule   → Daily grouped Berlinale schedule with venues
GET  /api/festival/rotterdam-2026
GET  /api/festival/slamdance-2026
GET  /api/festival/sundance-2026
GET  /api/festival/sxsw-2026
GET  /api/festival/romford-2026
GET  /api/imdb-rating                   → Fetches live IMDb scores
GET  /api/news                          → Serves pre-curated news from Turso DB
GET  /follows                           → Person following (add, remove, list)
GET  /tv-follows                        → TV show following (add, remove, list)
GET  /notifications                     → Fetch, mark-read, mark-unread, delete, paginate
POST /notifications/delete              → Individual deletion with user ownership validation
GET  /cron/check-releases               → Automated release detection job
```

### 2.4 Key Architectural Decisions

**API Caching and SSR Optimization (v4.8.0):** Significant reduction in infrastructure usage via intelligent caching rules for API endpoints. ISR configurations for major routes (movie, TV, root), with client-side rendering specifically enabled for interactive routes like `/search`.

**Event-Driven Authentication (v4.8.0):** Replaced polling mechanisms with event-driven authentication status updates, streamlining middleware logic for a more responsive global state.

**Dynamic SEO and Sitemaps (v4.8.0):** Implementation of dynamic and split sitemap generation using server routes, improving discoverability over legacy static sitemaps.

**News curation decoupling (v4.3.4):** RSS fetching and AI analysis moved to a GitHub Actions scheduled background process. The frontend reads pre-computed results from Turso, reducing load times from ~10s to <50ms.

**Awards data as local JSON (v4.5.1):** Awards data fetching migrated from Turso to a local JSON file to address performance challenges with large datasets. The public `/api/awards` endpoint is unaffected.

**Hero server-side selection (v4.5.0):** The `/api/hero` endpoint selects random hero items server-side, offloading complex selection logic from the client.

**Concurrent data fetching:** `Promise.all` and `Promise.allSettled` used throughout — homepage data loading, awards fetching, provider/review fetching, and IMDb rating enrichment.

**Promise-based Map cache for hero enrichment (v4.7.0):** Hero enrichment data fetching uses a promise-based Map cache to deduplicate concurrent requests.

---

## 3. Data Sources & External Integrations

Cinemagoria does not host its own content catalog. All media metadata, ratings, reviews, soundtracks, and streaming availability are sourced from third-party APIs.

| Source | Data Provided | Notes |
|---|---|---|
| **TMDB** | Primary metadata: titles, posters, backdrops, cast, crew, overviews, genres, episodes | Core provider |
| **IMDb** | Ratings, vote counts | Prioritized over TMDB since v2.0.0; Bayesian-weighted sort available |
| **MDBList** | Enhanced metadata, curated lists | Used in awards and enhanced detail pages |
| **JustWatch** | Real-time streaming availability, "Watch On" providers | Conditional rendering — only shown when providers are available |
| **Rotten Tomatoes** | Tomatometer score | Via MDBList `getMDBListRatings()` function; displayed only when available |
| **MusicBrainz** | Original Soundtrack (OST) data, album listings | Integrated in v4.1.0; User-Agent header only sent server-side |
| **Trakt.tv** | User reviews with graphical star ratings | Integrated in v2.2.0 |
| **RSS feeds** | Cinema news articles | Aggregated, curated via background process, stored in Turso |

### Rating Priority Logic

1. IMDb score (primary, from `/api/imdb-rating` endpoint via TMDB `external_ids` lookup)
2. TMDB score (fallback when IMDb data unavailable)
3. Rating source is always labeled — "IMDb" or "TMDB" — in all UI contexts for transparency

**Bayesian average formula** applied for IMDb-weighted watchlist sorting to prioritize content with higher vote counts over content with few votes.

---

## 4. Search & Content Discovery
### 4.1 Global Search (v4.7.0 — Comprehensive Overhaul)

<div align="center">
  <img src="https://ivanluna.dev/images/assets/cinemagoria-asset10.webp" alt="Powerful Search" width="70%">
</div>

The search system was completely reimagined in v4.7.0:

**Categorized search results (v4.8.0):** Queries intelligently categorize results across multiple content types. Results are visually separated by category (movies, TV shows, people, news, festivals, production companies) using the powerful new `CategoryCarousel` component, utilizing horizontal carousels for seamless exploration.

**Integrated news & festival search:** News articles and festival-related content are included in multi-search results. Festival content is displayed prominently on content cards when relevant.

**Direct IMDb / TMDb ID search:** Users can search directly by entering an IMDb or TMDb ID. When an ID match is found, a clear banner is displayed in the UI indicating the match type.

**Advanced search filters embedded in search results (DiscoverSearch component):** Advanced discovery filters are integrated directly into the search results page, accessible via a toggle button. This is non-destructive — it does not replace or reload the current results view.

**Async/await conversion (v4.7.0):** Both `searchNews` and the general search function were refactored to use async/await syntax for cleaner asynchronous handling.

**Typo detection:** Powered by a dedicated Rust-based service at `api/typo.rs`. Migrated from a Python backend in v2.0.0. Response handling is backward-compatible.

**Production company search:** Production companies appear in multi-search results and on content cards (introduced v2.1.0).

### 4.2 Discover Component (v4.7.0)

<div align="center">
  <img src="https://ivanluna.dev/images/assets/cinemagoria-asset2.webp" alt="Catalog Discovery" width="70%">
</div>

The previous standalone `/advanced-search` page has been **deprecated and removed** as of v4.7.0. It is fully replaced by the unified **Discover component**, integrated directly into Movie and TV show pages.

The Discover component provides:
- Advanced content filtering with granular control
- IMDb and user rating filters
- Item enrichment with chunking optimization
- Chip-based active filter display with improved chip keying
- Consistent UI/UX with the rest of the platform

### 4.3 Trending Content Discovery

**`fetchWithRefill` mechanism (v4.3.6):** Trending content is collected in quality batches to guarantee a minimum number of high-quality items, replacing single-pass fetching.

**`filterCarouselItems`:** Applied to trending content for rating and IMDb score filtering to surface the most relevant items.

**Duplicate prevention:** A seen-item-ID tracking mechanism prevents identical content from appearing multiple times in carousel results.

**Asian TV show diversity cap:** Asian TV shows are limited to one entry per carousel display to enhance content diversity.

**`filterRecentYears` function:** A reusable utility that filters content to the current and previous year. Year ranges are dynamic — `'2020-${currentYear}'` — so they never go stale.

**Hero item quality criteria (enforced since v4.3.1):**
- Must originate from IMDb
- IMDb score > 7.0
- More than 5,000 votes
- Animation and Fantasy genres excluded

---

## 5. Film Festival Coverage

<div align="center">
  <img src="https://ivanluna.dev/images/assets/cinemagoria-asset9.webp" alt="Festivals & Awards" width="70%">
</div>

Cinemagoria provides dedicated, deep integration for major international film festivals. Each festival has its own page, API endpoints, card components, badge components, and carousel integration.

### 5.1 Supported Festivals (as of v4.7.0)

| Festival | URL | Since |
|---|---|---|
| Sundance Film Festival 2026 | `/festival/sundance-2026` | v4.5.0 |
| Berlinale 2026 | `/festival/berlinale-2026` | v4.5.0 |
| Rotterdam Film Festival 2026 | `/festival/rotterdam-2026` | v4.5.1 |
| Slamdance Film Festival 2026 | `/festival/slamdance-2026` | v4.5.1 |
| SXSW Film & TV Festival 2026 | `/festival/sxsw-2026` | v4.7.0 |
| Romford Film Festival 2026 | `/festival/romford-2026` | v4.7.0 |

### 5.2 Per-Festival Components

Each supported festival has its own dedicated Vue components:
- `SundanceCard`, `SundanceBadge`, `SundanceCarousel`
- `BerlinaleCard`, `BerlinaleCarousel` (simplified with `isSimple: true` in v4.7.0)
- `RotterdamCard`, `RotterdamBadge`
- `SlamdanceCard`, `SlamdanceBadge`
- SXSW and Romford components added in v4.7.0

### 5.3 Festival Features

**Homepage carousels:** All active festivals are represented in the homepage FestivalsCarousel. Duplicated titles that already appear in TMDB popular movies are filtered out to avoid redundancy.

**Hero section multi-badge system (v4.7.0):** The Hero component supports **multiple festival premiere badges simultaneously**. Badge display is consolidated into a single block using the `activeFestivals` computed property with `flex-wrap`, dynamically rendered via `v-for`. Manual festival badge assignments and 2026 festival logos are managed through constants. Titles added to manual festival badges.

**Festival film listings with categorized sections (v4.7.0):** All festival film listing pages feature categorized sections for improved navigation.

**Berlinale interactive schedule (v4.5.0):**
- Daily grouped schedule with expand/collapse functionality
- Displays film title, director, runtime, venue, attendance tags, and poster thumbnail per screening
- Timezone-aware: date/time utilities include Berlin timezone
- Data sourced from `/api/festival/berlinale/schedule` including venue details

**Hero content enrichment for festival films:** Festival films are enriched with proper posters, backdrops, and trailers. `force_enrichment` available for manual overrides (see Section 7.3).

**Slamdance-specific behavior (v4.7.0):** Film links redirect to the digital program. Client-side fallbacks implemented for hero backdrops, posters, and trailers.

**Accent color assignments:** Each festival page has distinct primary accent colors. Berlinale and Slamdance colors were swapped in v4.7.0 for visual differentiation.

**Generalized `fetchFestivalMovies` utility:** Consolidated from individual per-festival fetching functions, reducing duplication.

---

## 6. Awards System (v4.8.0 Overhaul)

<div align="center">
  <img src="https://ivanluna.dev/images/assets/cinemagoria-asset6.webp" alt="Awards & Accolades" width="70%">
</div>

Explore the world of film accolades with our comprehensive awards section, featuring a dedicated Awards Index page and person search integration.

### 6.1 Supported Awards (as of v4.7.0)

| Award | Coverage |
|---|---|
| Academy Awards (Oscars) | Full historical coverage: inaugural ceremony (1929) → 98th Academy Awards (2026) |
| Golden Globe Awards | Full historical coverage: first ceremony (1944) → 2026 |
| Cannes Film Festival — Palme d'Or | Full historical coverage (added in v4.5.1) |
| Venice Film Festival — Golden Lion | Full historical coverage (added in v4.5.1) |
| Berlin Film Festival — Golden Bear | Full historical coverage (added in v4.5.1) |

### 6.2 Awards Architecture

**Awards Index Page (v4.8.0):** A dedicated index page providing a historical overview of film awards, powered by expanded API endpoints and a person search integration for enhanced data lookup.

**Data source:** Local JSON file (migrated from Turso in v4.5.1) — addresses performance issues with large datasets while keeping the public `/api/awards` endpoint unchanged.

**Concurrent fetching:** Palme d'Or, Golden Lion, and Golden Bear data fetched concurrently using `Promise.all`.

**Awards API type system:** Built with TypeScript type safety. Dedicated `Oscar` and `GoldenGlobe` interfaces. Handles multiple content types: `movie`, `tv`, `person`.

### 6.3 UI Components

- `AwardsTab` — dedicated awards tab on movie/TV detail pages
- `PersonAwardsTab` — dedicated awards tab on person profile pages
- Awards summaries visible on `MovieInfo`, `TvInfo`, and `PersonInfo`
- Awards tabs conditionally included in navigation menus
- Table header reads "Film/Series" (v4.5.1)
- Internal variables clarified: `internalGoldenLion`, `internalGoldenBear`

### 6.4 Intelligent Award Link Navigation

Award links dynamically route to the correct `/movie/:id` or `/tv/:id`. The system uses:
1. TMDB `/multi` search for comprehensive matching including TV shows
2. Type preference logic based on award category
3. Exact title match priority before falling back to most relevant result
4. `tmdb_id` prioritized over title for Golden Globe matching

**Golden Globes TMDb ID collision fix (v4.7.0):** Refined award filtering correctly distinguishes between movie and TV categories to prevent incorrect awards appearing for TV series when TMDb IDs collide across media types.

---

## 7. Hero Section, Homepage & N.O.I.R. Archive

### 7.1 Server-Side Hero Selection

The `/api/hero` endpoint (v4.5.0) selects random hero items server-side. Homepage uses `Promise.all` for concurrent data fetching integrating the hero API.

**Hero item quality criteria:**
- Originates from IMDb
- Score > 7.0
- More than 5,000 votes
- Excludes Animation and Fantasy genres
- Features only content from the last two years (dynamic, no manual updates required)

### 7.2 Hero Visual Features

- **Clickable backdrop:** Links directly to the ticket page. Explicit "Buy Tickets" button removed (v4.5.0).
- **"UPCOMING" badge:** Dynamic badge with text and transition animations
- **Multiple festival premiere badges:** `flex-wrap` + `v-for` rendering via `activeFestivals` computed property
- **Overview translation:** Built-in translation with loading indicator and blur effect during translation
- **Responsive heights:** `min-height` + `height: auto` (replaced fixed heights)
- **Gradient borders and rounded corners** on the Hero container
- **Mobile-specific loader:** Dedicated mobile loading state with its own styling
- **Granular content readiness tracking:** `Promise.all`-based loading with conditional image opacity during transitions
- **Loader overlay:** Displayed when backdrop image is loading

### 7.3 Hero Content Enrichment & Override System (v4.7.0)

A production-grade enrichment system for precise control over Hero media assets:

- **`force_enrichment`:** Workflow flag to manually override existing posters, backdrops, and trailers
- **`_forcePoster` mixin:** Explicitly prioritize an enriched poster asset
- **`_forceBackdrop` mixin:** Explicitly prioritize an enriched backdrop asset
- **`_forceTrailer` mixin:** Explicitly prioritize an enriched trailer asset
- **Promise-based Map cache:** Deduplicates concurrent enrichment data requests
- **Environment variable robustness:** Improved access patterns for env vars in enrichment workflows

### 7.4 Hero Carousel Navigation

- **Wheel navigation (desktop):** Horizontal scroll wheel navigates between hero items (`@wheel.prevent` + `handleWheel`)
- **Touch/swipe navigation (mobile):** `handleTouchStart`, `handleTouchEnd`, `handleSwipe` methods
- **Full navigation controls:** With reactive state management
- **Festival badge state reset:** Properly reset during item transitions

### 7.5 Trailer Selection Logic

Priority order:
1. TMDB trailers and teasers
2. Database fallbacks (secondary source)
3. Featurettes are always **excluded**

### 7.6 Homepage Carousels

The homepage features carousels for:
- Hero section (server-selected, quality-filtered)
- Trending movies and TV (with `fetchWithRefill`, `filterCarouselItems`, duplicate prevention)
- Film festivals (all active festivals with categorized sections)
- Production companies (with 'Explore All' card)
- Streaming platforms (with 'Explore All' card)
- Cinema news articles
- Featured content with titled order lists (titles added in v4.7.0)

### 7.7 N.O.I.R. Archive (v4.8.0)

Dive into a curated collection of historical titles with our N.O.I.R. (Nothing Out Is Ready) feature.
- **Archive Page**: Dedicated space for historical titles preserved in the N.O.I.R. collection.
- **Homepage Integration**: Badges and a modal trigger integrated directly into the homepage hero section.
- **Automated Sync**: A GitHub Actions workflow ensures N.O.I.R. historical and enrichment data is automatically synced.

---

## 8. Movie & TV Show Detail Pages

<div align="center">
  <img src="https://ivanluna.dev/images/assets/cinemagoria-asset8.webp" alt="Deep Metadata" width="70%">
</div>

### 8.1 Metadata & Information Display

- **Primary ratings:** IMDb score with vote count; TMDB as fallback; always labeled
- **Rotten Tomatoes Tomatometer:** Displayed with direct RT link when available (v1.9.2)
- **Original title:** Shown when different from localized title
- **Release status context (v4.3.4):** Clickable labels ("In Theaters", "Streaming", "Digital", "Physical") link to release details. Implemented via `releaseStatusSuffix` computed property and `getReleaseStatusContext` helper.
- **`MovieReleases.vue`:** Release dates with country flags, release types, certifications
- **Country flags:** Dedicated image assets
- **IMDb vote count:** Displayed on cards and detail views

### 8.2 Recommendations System (v2.2.0)

Tab-based intelligent recommendation carousels:

**For Movies:**
- "Similar" carousel
- "By the Director" (filtered to Director job role)
- "By the Producer" (filtered to Producer / Executive Producer job role)

**For TV Shows:**
- "Similar" carousel
- "By the Creator" (filtered to Creator job role)

All recommendations are IMDb-enriched. Smart tab visibility — tabs only appear when recommendation data exists. Automatic carousel reset on tab switch. Responsive for desktop and mobile. Loading indicators during fetch.

### 8.3 "Watch On" Section

**Conditional rendering (v4.6.0):** The "Watch On" section and its title only render when streaming providers are actually available. Provider data sourced via `Promise.allSettled` for parallel fetching.

### 8.4 Reviews

- **Trakt.tv reviews (v2.2.0):** Integrated with graphical star ratings and source logos
- **User's own reviews:** Displayed in media detail pages (v4.3.1)
- **Spoiler modal:** Does not open when all pending items are already rated

### 8.5 External Links

All rendered conditionally — no broken links for unavailable content:
- IMDb page
- Rotten Tomatoes (Tomatometer)
- JustWatch streaming links

### 8.6 Follow Integration

- Follow/unfollow on TV show pages for episode notifications
- Follow/unfollow on person pages for new release notifications

### 8.7 Error Pages

Dedicated "not found" pages for invalid movie or TV show URLs (v4.2.0).

---

## 9. Person Profiles

### 9.1 Credits & Filmography

- **Known department sorting (v4.4.2):** Credits sorted by "known department" by default. Actors see acting credits first; directors see directing credits first.
- **Collapsible department sections:** Per-department expand/collapse
- **Div-based credits layout:** Flexible layout for improved responsiveness
- **IMDb ratings on credits:** "Known For" section and all person credits show IMDb scores

### 9.2 Photos

- Image language parameter supports `null` for improved coverage of non-language-specific images (v4.4.2)
- Multiple profile photo retrieval via `fetch_person_images()` for notification fallback hierarchy

### 9.3 Awards Tab

- `PersonAwardsTab` component with all supported awards
- Dynamic navigation links to related film/TV pages

### 9.4 Follow Button

Integrated on actor, director, and writer pages to subscribe to new release notifications.

---

## 10. Original Soundtrack (OST) Integration

Introduced in v4.1.0. Cinemagoria integrates with **MusicBrainz** for comprehensive OST data on movie and TV show detail pages.

### 10.1 Features

- **Soundtrack listings:** Extensive album and track listings from MusicBrainz database
- **Album selection UI:** Interface for navigating between multiple soundtrack albums
- **Server-side User-Agent:** The `User-Agent` header is only sent when `typeof window === 'undefined'` to prevent browser environment issues

### 10.2 Component Architecture

Soundtrack components are streamlined for maintainability. Album selection logic is centralized. Multiple albums per title supported with easy switching UI.

---

## 11. Watchlist & List Management

<div align="center">
  <img src="https://ivanluna.dev/images/assets/cinemagoria-asset4.webp" alt="Watchlist" width="70%">
</div>

### 11.1 Watchlist

**Capacity:** 50 movies + 50 TV shows (increased from 10 in v4.3.3)

**Filtering options:**
- Genre (separate movie and TV genre filters, consolidated into a single unified list)
- Year range
- IMDb rating (range input — more flexible than the previous dropdown)
- IMDb votes range
- User personal rating
- "Not rated" filter (show only unrated items)

**Sorting options:**
- Latest added / Earliest added
- Newer releases / Older releases
- Highest rated (IMDb) / Lowest rated (IMDb) — Bayesian weighted average
- IMDb vote count
- Runtime (duration)

**Persistent state:** Filters and sort order persist across sessions.

**Active filter display:** Removable chips below action controls. "Clear All" button available.

**Bulk actions (v4.3.4):**
- Multi-select items with checkboxes
- Bulk add, move, and delete operations
- Undo capability for bulk operations
- Undo banner with slide-up animation and timer line (max-width: 350px)

**Item dropdown menu:** Consolidates rating and removal per item.

**Card details:** IMDb/TMDB logos and vote counts shown on watchlist cards.

**Pagination:** SVG icon controls with manual page input validation. `currentPage` resets on filter changes. Correct page count recalculation when filters reduce total items.

**Empty states:** Tab-specific messages with cinema popcorn icon. Loading indicators prevent false empty state flashes.

**Conditional selection/navigation:** Based on `aiSelectionMode` context.

### 11.2 Custom Lists

**Creation:**
- Unlimited custom themed lists
- Character limits for titles and descriptions
- Improved creation prompts and feedback
- Updated list creation button icon

**Descriptions (v4.4.2):** Each list can have an add/edit/displayable description for organization, sharing, and cloning.

**Privacy controls:** Public or private, with inline editing of privacy status from the list detail page.

**Renaming:** Dedicated button and modal.

**Cover images:** Dynamically populated by fetching item details when initial covers are insufficient. Placeholder image for empty list covers.

**Cloning (v4.4.0):** Any public list can be duplicated with a dedicated clone modal. Error handling provides clear feedback.

**Dynamic SEO (v4.4.0):** List pages have dynamic SEO for improved search engine visibility.

**Owner-specific actions:** List management actions and card menu visibility restricted to the list owner.

**Undo functionality:** Undo capability for list actions.

**Multi-selection add flow (v4.3.0):** `MyListsModal` supports adding an item to multiple lists simultaneously. "Create-Then-Add" flow allows creating a new list from within the add-to-list modal.

**Remove option:** List item action menu includes a remove option with mobile responsiveness.

### 11.3 "My Lists" Navigation (v4.4.1)

A **"My Lists" menu in the main navigation bar**:
- Dynamic cover images per list
- Placeholder for empty list covers
- Fully responsive (desktop and mobile)
- Pagination for extensive collections
- All list navigation centralized here

### 11.4 QuickFav Component

Quick-access list management from any content card:
- Comprehensive dropdown for managing items across multiple lists
- Add/remove from Watchlist and custom lists in one action
- Event-triggered via bus event
- Vue 3 lifecycle: `beforeUnmount`, `await` for `checkMembership`

### 11.5 Utilities

- **`mapItemToDbPayload`:** Standardized DB payload construction for all list operations
- **`itemMapper`:** Standardizes item payload creation across components
- **`getPosterUrl` helper:** Handles all poster path formats — prepends TMDB base URL for relative paths, passes full URLs directly, provides placeholder for empty paths

---

## 12. User Profiles, Ratings & Reviews (v4.8.0 Overhaul)

### 12.1 Public User Profiles & Activity

Introduced in v4.8.0, users can now engage with the cinemagoria community through personalized profiles.
- **Public Profiles:** Showcase user activity, favorite movies, and reviews.
- **Follower/Following Management:** Users can follow others, manage their lists directly in the following modal, and set privacy controls for follower/following counts.
- **Activity Feed:** See interactions within the community via a dedicated user activity feed.

### 12.2 Rating System

**Scale:** 1–10 circular selector.

**Independence from watchlist (v4.3.1):** Ratings and reviews are fully decoupled from the watchlist. Rating an item does not automatically add it to the watchlist. Ratings accessible from any list context.

**Rating modal:** Pre-loads existing rating and review. Globally accessible via UserNav, watchlist badges, or any page. Real-time sync across all pages.

**Remove rating:** Delete button without confirmation.

**Global access:** `RatedModal` is a global component in `default.vue`. Uses `$root.$emit` for cross-page events. `z-index: 1001`.

**`loadRatingFromRatingsEndpoint`:** Loads user ratings independently from watchlist logic.

### 12.3 Reviews (Enhanced in v4.8.0)

**Integrated display:** Cinemagoria reviews are integrated directly into movie and TV show detail pages with enhanced display for authors and sources.
**User control:** Authenticated users have 'Edit' and 'Remove' actions for their contributions.
**Extended Limits:** Increased character limits allow for more detailed feedback. DOMPurify implemented for robust XSS protection on review content.

**User reviews:** Written from a blank slate (automatic population removed in v4.3.1). Users have full control over review content.

**Review display:** User's own reviews shown in media detail pages.

**`favorites_json` API response:** User ratings and reviews parsed from this response structure.

### 12.4 RatedModal

- Displayed globally via UserNav or watchlist badges
- Grid of rated items with refined columns, gaps, border-radius, padding, font sizes
- Rating badge and review text layout optimized for readability
- Max-height with custom scrollbar for review text

---

## 13. Production Company Pages

### 13.1 Features

- **Dedicated pages:** Each company shows all associated movies and TV shows
- **Content filtering and sorting:** Dynamic sort options for movies and TV shows
- **Follow/unfollow:** Users follow companies to receive new release notifications
- **Homepage carousel:** With "Explore All" card
- **Auth modal:** Triggers for non-authenticated follow actions
- **Multi-search inclusion:** Production companies in multi-search results and on cards
- **Badge indicators (v4.4.0):** 'Production Company' indicators inside image container with badge styling
- **Localized country names** in production hero section

### 13.2 Following Modal — Production Companies Tab

- Dedicated "production companies" tab (v4.4.2 label clarification)
- View all followed companies
- Unfollow with undo
- Direct navigation to company pages via slug

---

## 14. Streaming Platform Support

### 14.1 Dedicated Streaming Service Pages

Each platform has its own page with:
- Full content listings (movies and TV shows)
- Filtering options
- Dynamic sort options for movies and TV shows separately

### 14.2 Following Streaming Services

- 'Streaming Services' tab in the Following modal
- View, unfollow, and navigate directly to platform pages
- Undo functionality for unfollowing
- Navigation via slug from the following modal

### 14.3 Homepage Carousel

Wide selection of streaming providers. 'Explore All' card encouraging broader discovery.

### 14.4 Provider Data

- `POPULAR_STREAMING_IDS` constant for homepage provider management
- `STREAMING_PROVIDERS` list maintained in constants
- New streaming platform logos added
- Followed content type determined from `route.query.type` URL parameter

### 14.5 "Watch On" Section (Conditional)

Only renders when providers are genuinely available for the content item. Title does not appear when there are no providers.

---

## 15. Follow & Notification System

<div align="center">
  <img src="https://ivanluna.dev/images/assets/cinemagoria-asset3.webp" alt="Notification Center" width="70%">
</div>

### 15.1 What Can Be Followed

| Follow Type | Detection Window | Triggers |
|---|---|---|
| Person (actor, director, writer) | ±30 days | New film/TV releases |
| TV Show | ±7 days | New episode releases |
| Production Company | On release | New content from that company |
| Streaming Platform | Ongoing | Personalized content feeds |

### 15.2 Database Schema

Three core tables in Turso:
- `user_follows` — actors, directors, writers with profile images
- `user_tv_follows` — TV shows with poster, overview, rating, status; `secondary_profile_path` for fallback images
- `notifications` — rich notification cards with full media metadata

### 15.3 Notification Features

**Notifications page (`/notifications`):**
- Unread counter with circular badge (`#FF5252`)
- Filter: read/unread toggle
- Bulk mark-all-read
- Pagination: 50 items/page default, up to 100 configurable
- Previous/Next navigation. Reset to page 1 on filter toggle. Smooth scroll to top. Inline loading spinner during transitions.
- Delete individual notifications with confirmation modal (user ownership validated)
- Two-column grid (desktop > 768px), single column (mobile/tablet)
- SVG icons for all action buttons

**Notification content:**
- Person profile images in circular styling
- Complete plot overviews (no truncation)
- Character attribution for actor notifications
- Episode tracking with `S01E05` formatting
- Release dates
- Poster fallback priority: official poster → secondary profile → primary profile → series poster

**FollowingModal:**
- Tabs: People, TV Series, Production Companies, Streaming Services
- Department categorization for people: Actors, Directors, Writers (collapsible sections)
- Undo functionality with 60-second timeout
- Direct navigation to content
- Globally accessible — registered in `default.vue`
- Visibility managed via URL query parameter + router navigation
- Z-index properly layered above other elements

**"How It Works" modal:**
- GIF demonstrations for following people and TV shows
- Explains detection timelines and update frequency
- Keyboard navigation support
- Consistent styling with FollowingModal

### 15.4 Cron Job

`/cron/check-releases` checks:
- Person new releases: ±30 days window
- TV show new episodes: ±7 days window
- Writers/creators via TV credits endpoint

### 15.5 Cross-Device Synchronization

Notifications sync in real-time across devices via Turso/LibSQL with proper user authorization.

---

## 16. Cinema News Section

<div align="center">
  <img src="https://ivanluna.dev/images/assets/cinemagoria-asset5.webp" alt="Industry News" width="70%">
</div>

### 16.1 Architecture

**Decoupled async curation (v4.3.4):** Full background architecture:
- GitHub Actions scheduled job runs `scripts/curator.js`
- Pre-computed results stored in Turso
- Frontend reads pre-curated data — load time: **<50ms** (was ~10 seconds)
- API rate limits respected since ingestion is separated from consumption

**Backend URL:** Configurable via `tursoBackendUrl` — no hardcoded endpoints.

### 16.2 News Page Features

**Article search (v4.6.0):**
- Search input, toggle button, and clear button in the news sidebar
- Client-side logic with `refDebounced` for smooth debounced input handling
- API endpoint filters by title and description based on search query
- Sidebar layout responsive to accommodate new search UI elements

**Article display:**
- Grouped by source
- Sorted by `published_at` (when source specified) or `created_at` (default, no source)
- Default fetch limit: 200 articles when no specific source is chosen
- `line-clamp` for text truncation in news card components
- HTML stripped from descriptions using `striptags` library
- `/placeholder_news.webp` as image placeholder and error fallback
- Conditional rendering of images via `v-if/v-else` for reliability

**News Carousel (homepage):**
- Sorts by `published_at` for consistent display order
- Observer cleanup for autoplay interval to prevent memory leaks
- Improved duplicate article checking (v4.7.0)

### 16.3 Saved Articles (v4.3.4)

- View: `/news?view=saved`
- Bookmark articles for later reading
- Articles displayed grouped by source with remove options
- Dedicated "Saved Articles" link in news sidebar with styled component (v4.6.0)
- `toggleSave` error revert logic for robust save/unsave operations

---

## 17. Authentication System

<div align="center">
  <img src="https://ivanluna.dev/images/assets/cinemagoria-asset7.webp" alt="Authentication" width="70%">
</div>

### 17.1 Auth Flow

**Modal-based authentication:** No dedicated `/login` or `/register` pages. `AuthModal.vue` is the centralized auth entry point. Routes `/login` and `/register` trigger the modal. Modal prevents dismissal on outside clicks. Intelligent redirect after successful auth based on origin page context.

**Google OAuth integration** since v1.9.0.

**Pending actions:** Non-authenticated user actions (e.g., attempting to rate content) are queued and executed post-login without losing context.

**`AuthModal` placement:** Available in `ChatbotModal`, `Nav`, `SearchResults`, and production company pages.

### 17.2 Authentication Success Page (v4.7.0)

Completely redesigned:
- New UI with engaging animations for a seamless post-auth transition
- Responsive `auth-success-card` with optimized dimensions and padding for smaller screens

### 17.3 UserNav Component

Global reusable component eliminating ~700+ lines of duplicated CSS across 7+ pages.

Manages:
- Authentication state (`isLoggedIn`, `userEmail`, `userAvatar`)
- **Stats Row (v4.8.0):** Displays rated and following counts directly in the user menu
- Language switching (EN/ES subdomain)
- Profile menu and dropdown behavior
- Sticky positioning: `z-index: 1000`
- Auto-close on outside click
- `notifications-updated` event listener for real-time notification count updates

### 17.4 Security

- XSS content protection utilizing DOMPurify for user reviews (v4.8.0)
- Input sanitization on all user-facing forms
- Stricter access controls for list management (owner validation)
- Protected API endpoints with auth requirement
- Cross-device sync with proper authorization
- Console and debugger statements auto-dropped in production builds

### 17.5 Account Management

- **Account Deletion (v4.8.0):** Users can now permanently delete their accounts with full API integration, complete with loading states and error handling for safety.

---

## 18. UI/UX Design System

### 18.1 Color Scheme

- **Primary accent:** Cyan (`#8BE9FD`) — visually refreshed in v4.8.0 for festival and awards pages, interactive elements, hover states, star ratings, active selections, and IMDb rating stars
- **Backgrounds:** Semi-transparent dark (`rgba`-based) with blur effects on movie grids, headers, footers, card backgrounds
- **Borders:** `rgba`-based with gradient borders on Hero and search form fields
- **Notification unread badge:** `#FF5252`

### 18.2 Typography

- Consistent heading styles across all pages
- Text gradients and shadows in feature descriptions
- Leading spaces added to character/job and episode count strings for legibility
- `line-clamp` for text truncation in news and list contexts
- Font sizes standardized across QuickFav, RatedModal, FollowingModal components

### 18.3 Component Design Patterns

**Border radius:** 15px standardized across components. Applied to image containers for responsiveness.

**Gradient borders and rounded corners:** Hero section, SearchForm fields, and key UI elements.

**Cards:**
- `overflow: hidden` on `media-wrapper` components
- IMDb/TMDB source logos on watchlist cards
- Streaming service and production company indicators as inline badges within image containers
- Dark transparent backgrounds on multiple card types
- Lazy loading with individual loading indicators and fade-in transitions

**Loading states (standardized `Loader` component):**
- Used in: FollowingModal, RatedModal, Hero, person pages (Known For, Credits, Photos), content cards, movie/TV info sections, credit listings, rated items, watchlist, and category pages
- Category images use native lazy loading with loading indicators

**Scrollable user lists:** `list-scroll-area` with custom scrollbar styling in dropdowns.

**Modals:**
- Consistent header, tab, and action styles (FollowingModal, RatedModal)
- Responsive adjustments in MyListsModal for smaller screens
- Undo banners: slide-up animation with timer line

**Buttons:**
- Standardized gradient backgrounds, cyan hover states, scale transforms, subtle shadows
- SVG stroke/fill colors corrected on hover
- "Unfollow" uses same centered capsule style as "Remove Rating"

**Language switcher:** Animated dual-label toggle with `#8BE9FD` for active state.

**Country flags:** Dedicated image assets.

**SVG icons:** `currentColor` fills and strokes for consistent theming throughout.

**Footer:** Grid layout, updated usage policy content and social links.

### 18.4 Responsive Design

All components are fully mobile-responsive. Key implementations:
- Watchlist: persistent filter state, enhanced mobile UI
- MyListsModal: responsive adjustments for smaller screens
- FollowingModal: responsive padding and font sizes for tabs
- Hero section: `min-height` + `height: auto`, mobile loader
- Notifications: two-column (desktop) → single-column (mobile/tablet)
- Person credits: div-based layout
- Dynamic movie grid: items-per-row and items-per-page calculated from container width
- Pagination: SVG icon controls with input validation

---

## 19. Performance & Infrastructure

### 19.1 Deployment

- **Platform:** Vercel
- **Serverless constraints:** 5-second execution timeout on all API routes
- **CORS:** Explicit headers for cross-origin compatibility
- **Cron jobs:** GitHub Actions for news curation

### 19.2 Optimization Techniques

| Technique | Where Applied |
|---|---|
| `Promise.all` concurrent fetching | Homepage data, awards (Palme d'Or/Lion/Bear), hero API |
| `Promise.allSettled` | Provider and review fetching in `getMovie()` |
| Promise-based Map cache | Hero enrichment data fetching (v4.7.0) |
| Async/await | `searchNews`, general search function, QuickFav lifecycle |
| Pre-curated news from Turso | Eliminates real-time RSS fetching on every request |
| Server-side hero selection | `/api/hero` endpoint removes client-side selection complexity |
| Awards from local JSON | Avoids Turso query overhead for large datasets |
| Conditional data fetching | Avoids redundant API calls when data already in props |
| Console/debugger removal | Auto-dropped in production builds |
| WebP image migration | Thumbnails, icons, fallback assets — all WebP |
| Poster/backdrop URL shortcut | Full URLs returned directly without TMDB base prepending |
| Carousel deduplication | Seen-ID tracking across all carousels |
| `fetchWithRefill` batching | Trending content in quality batches |
| News duplicate checking improvement | v4.7.0 |
| External link availability optimization | Optimized checks for the homepage (v4.5.1) |

### 19.3 SSR Considerations

- `isAuthenticated` in `ProductionHero.vue` set in `mounted` hook (not computed) to avoid SSR `localStorage` errors
- MusicBrainz `User-Agent` header only sent server-side (`typeof window === 'undefined'`)
- `devtools` and `debug` mode disabled in production Nuxt config
- Request logging disabled in logger middleware

### 19.4 Code Quality & Architecture

- ~700+ lines of duplicate CSS eliminated via `UserNav` global component extraction
- `itemMapper` utility for standardized item payload creation
- `mapItemToDbPayload` utility for consistent DB payload construction
- `CategorySection` component extracted from search results for modularity
- `fetchFestivalMovies` unified utility replacing per-festival functions
- `filterRecentYears` reusable function for year-based content filtering
- `formatDate` and `handleImageError` helpers centralized in `helpers.js`
- News sources extracted to utility file
- Countries data extracted to a utility file for advanced search
- `POPULAR_STREAMING_IDS` constant for homepage streaming providers

---

## 20. API Reference

### 20.1 Public Endpoints

```
GET /api/hero
  Returns: random hero item selected server-side
  Auth: none

GET /api/awards?type={movie|tv|person}&id={tmdbId}
  Returns: awards data (Oscar, GoldenGlobe, PalmedOr, GoldenLion, GoldenBear)
  Auth: none
  Source: local JSON file

GET /api/imdb-rating?imdbId={id}
  Returns: IMDb rating and vote count
  Auth: none

GET /api/news
  Returns: pre-curated news articles from Turso
  Supports: filtering by title/description via query param
  Sorting: published_at (with source) | created_at (no source)

GET /api/festival/berlinale/schedule
  Returns: daily grouped schedule with venues

GET /api/festival/{festival-slug}
  Available: rotterdam-2026, slamdance-2026, sundance-2026, sxsw-2026, romford-2026

GET /follows
  Auth: required
  Methods: add, remove, list

GET /tv-follows
  Auth: required
  Methods: add, remove, list

GET /notifications
  Auth: required
  Methods: fetch, mark-read, mark-unread, delete
  Pagination: 50/page default, up to 100 configurable

POST /notifications/delete
  Auth: required
  Body: { notificationId }
  Validation: user ownership enforced

GET /cron/check-releases
  Trigger: GitHub Actions scheduler
```

### 20.2 API Design Principles

- Strong TypeScript typing (Oscar, GoldenGlobe, festival data interfaces)
- Standardized response handling via Nuxt 3 `$fetch`
- Environment variables via `useRuntimeConfig()` — no hardcoded endpoints
- Graceful degradation — empty arrays resolved instead of rejected promises for missing TMDB data
- Safe URL validation for festival film links
- Null checks for all retrieved database rows (v4.7.0)
- Type safety for festival API data enhanced (v4.5.1)

---

## 21. Security

### 21.1 Security History

| Version | Action |
|---|---|
| v1.9.0 | Eliminated 14 critical CVEs. Updated `pbkdf2` (3.1.2→3.1.3), `form-data` (4.0.0→4.0.4). SCSS `@import` → `@use`. |
| v1.9.1 | Resolved CVE-2025-9288 (`sha.js`). Patched `devalue`, `axios`, `postcss`, `micromatch`, `brace-expansion`, `cookie`, `tmp`, `on-headers`. 69% reduction: 54 → 17 vulnerabilities. Nuxt telemetry disabled. |
| v4.1.0 | Code scanning alert for incomplete string escaping resolved. |
| v4.2.1 | Critical custom list security hardening: input sanitization, access controls, user context integration. |

### 21.2 Current Security Posture

- Input sanitized on all forms (list creation, descriptions, reviews)
- Owner-specific enforcement on list actions and card menus
- User ownership validation on notification deletion
- Google OAuth for secure authentication
- Protected API endpoints requiring auth
- `api/typo.rs` — isolated Rust-based service
- Nuxt telemetry disabled
- Console/debugger stripped in production

---

## 22. Internationalization

Cinemagoria supports **English (EN)** and **Español (ES)** via subdomain-based language switching.

- **Language switcher:** Animated dual-label toggle in `UserNav` with `#8BE9FD` active state
- **Subdomain routing:** EN/ES handled in `UserNav` centralized logic
- **Hero overview translation:** Built-in translation with loading indicator and blur effect
- **AI language handling:** Delegated to AI model (v2.1.0). Language dynamically detected and sent with each API request.
- **i18n fixes:** Typos and mistranslations corrected (v3.0.0)

---

## 23. Developer Reference

### 23.1 Setup

```bash
git clone https://github.com/cinemagoria/cinemagoria.git
cd cinemagoria
yarn install
```

Copy `.env.example` to `.env` and configure all required environment variables.

### 23.2 Environment Variables

All accessed via Nuxt 3's `useRuntimeConfig()` or `this.$config.public`. No hardcoded service endpoints. See `.env.example` for required keys.

### 23.3 Key Files & Directories

```
/pages
  /festival/[slug].vue          — Festival pages
  /notifications/index.vue      — Notifications hub
  /watchlist/index.vue           — Watchlist with full filtering/sorting/bulk actions
  /movie/[id].vue                — Movie detail with Discover component
  /tv/[id].vue                   — TV detail with Discover component
  /lists/[slug].vue              — Custom list detail
  /news/index.vue                — News with article search + saved articles
  /contact/index.vue             — Contact form
  /changelog/index.vue           — GitHub releases changelog page (dynamic)

/components
  /global/
    UserNav.vue                  — Global user navigation (auth, language, profile)
    RatedModal.vue               — Global ratings modal
    FollowingModal.vue           — Global follow management modal
    AuthModal.vue                — Global auth modal
  /Hero.vue                      — Homepage hero with enrichment system
  /Discover.vue                  — Advanced content filtering component
  /QuickFav.vue                  — Quick list management from any card
  /AwardsTab.vue                 — Awards display tab (movies/TV)
  /PersonAwardsTab.vue           — Awards display tab (people)
  /CategorySection.vue           — Search result category display
  /ExternalLinks.vue             — Rotten Tomatoes, IMDb, JustWatch links

/server/api
  hero.get.ts
  awards.get.ts
  news.get.ts
  festival/[slug].get.ts

/mixins
  Filters.js                     — Centralized Vue 2→3 filter replacements
  _forcePoster.js                — Hero enrichment override mixin
  _forceBackdrop.js              — Hero enrichment override mixin
  _forceTrailer.js               — Hero enrichment override mixin

/utils
  helpers.js                     — formatDate, handleImageError, getPosterUrl
  countries.js                   — Countries data for advanced search filters
  constants.js                   — STREAMING_PROVIDERS, POPULAR_STREAMING_IDS, festival badges, production companies

/scripts
  curator.js                     — Background news curation (GitHub Actions)
```

### 23.4 State Management (Pinia)

Pinia replaced Vuex in v4.0.0. Define stores with `defineStore`. No `$set` required (Vue 3 native reactivity). Use `$bus` (mitt) for global event communication.

### 23.5 Global Event Bus

```javascript
// Emit
import { useNuxtApp } from '#app'
const { $bus } = useNuxtApp()
$bus.emit('event-name', payload)

// Listen — always clean up in onUnmounted
$bus.on('event-name', handler)
$bus.off('event-name', handler)
```

### 23.6 Hero Enrichment Override

```javascript
// In hero data workflow configuration
force_enrichment: true  // Override existing poster/backdrop/trailer

// Available mixins for explicit asset prioritization:
// _forcePoster    → override poster asset
// _forceBackdrop  → override backdrop asset
// _forceTrailer   → override trailer asset
```

### 23.7 Standardized Item Payloads

```javascript
// Always use these utilities for item payload construction:
import { mapItemToDbPayload } from '@/utils/helpers'
const dbPayload = mapItemToDbPayload(item)

import { itemMapper } from '@/utils/itemMapper'
const mappedItem = itemMapper(rawItem)
```

### 23.8 News Architecture

```
GitHub Actions (scheduled)
  → scripts/curator.js
    → Fetches RSS feeds
    → Performs curation/analysis
    → Stores results in Turso DB

Frontend request
  → server/api/news.get.ts
    → Reads from Turso DB (pre-curated)
    → Returns to client (<50ms)
```

### 23.9 Awards Data

Served from local JSON file. To add new award entries, update the JSON directly. For Golden Globe entries, always include `tmdb_id` to enable accurate filtering over title-based matching (resolves duplicate title collisions).

### 23.10 Adding a New Festival

1. Create festival page: `/pages/festival/[festival-slug].vue`
2. Create `[FestivalName]Card.vue` component
3. Create `[FestivalName]Badge.vue` component
4. Create carousel component (or use blended component with `isSimple: true`)
5. Add API endpoint: `/server/api/festival/[slug].get.ts`
6. Add festival logo to `public/` assets
7. Register in `constants.js` (festival badge assignments, 2026 logos, titles)
8. Integrate into `FestivalsCarousel` on homepage
9. Configure hero enrichment for festival films if needed
10. Add accent color theming for the festival page

### 23.11 Key Dependencies (v4.7.0)

```json
{
  "nuxt": "4.x",
  "vue": "3.x",
  "pinia": "latest",
  "mitt": "latest",
  "swiper": "12.1.2",
  "@vueuse/core": "latest",
  "@libsql/client": "latest",
  "@supabase/supabase-js": "latest",
  "sass": "latest",
  "devalue": "5.6.3",
  "striptags": "latest"
}
```

```bash
yarn install   # Install/update all dependencies
```

---

## Known Limitations

- Some older festival film listings may still be undergoing content enrichment for the latest media assets
- The Discover component's filtering capabilities are being continuously refined based on user feedback
- API rate limits may affect external link availability during high-traffic periods

---

## Support & Feedback

For issues or suggestions: [Create a new issue on GitHub](https://github.com/cinemagoria/cinemagoria/issues/new)

---

## Release Authorization (v4.8.0)

- **Approved by:** @imprvhub
- **Architecture Review:** Complete
- **Security Audit:** Passed
- **Performance Testing:** Validated

---

*Cinemagoria — Built for film enthusiasts, by film enthusiasts.*  
*In continuous development since March 27, 2024.*

---

**Full Changelog**: https://github.com/cinemagoria/cinemagoria/compare/v4.7.0...v4.8.0
