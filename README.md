## Entercinema - The moment you discover what to watch.

Entercinema is a high-performance **Progressive Web Application (PWA)** engineered for modern viewers. By aggregating intelligence from **TMDB, IMDb, MDBList, Trakt, and JustWatch**, it provides a centralized hub for intelligent search and cross-device synchronization.

![EnterCinema Cover](https://www.ivanluna.dev/images/assets/entercinema-asset1.webp)

### Project Overview

Entercinema streamlines the entertainment lifecycle—from initial discovery to release tracking. It bridges the gap between fragmented streaming data and personal curation, offering a seamless interface for managing watchlists and receiving real-time notifications.



### Core Features


#### Comprehensive Catalog Exploration

Explore dedicated universes for Movies and TV Shows with instant context switching. The platform features optimized carousels for 'Now Playing', 'Upcoming', 'Popular', and 'Top Rated', alongside genre-based navigation (Drama, Sci-Fi, Animation, etc.) and exclusive feeds from followed production companies.

<div align="center">
  <img src="https://www.ivanluna.dev/images/assets/entercinema-asset2.webp" alt="Catalog Discovery" width="70%">
</div>

#### Advanced Notification Center

A real-time tracking engine for the content and creators you care about.

* **Granular Following:** Follow actors, directors, writers, production companies, and specific TV series.
* **Multi-Channel Alerts:** Notifications for theatrical releases, digital drops, and weekly episode premieres.
* **Management Suite:** Features bulk actions, read/unread filtering, and a 60-second "undo" window for unfollowing.
* **Infrastructure:** Powered by a Rust/LibSQL backend with automated daily cron-job validation (GitHub Actions).

<div align="center">
  <img src="https://www.ivanluna.dev/images/assets/entercinema-asset3.webp" alt="Notification Center" width="70%">
</div>

#### Precision Watchlist & Rating System

A robust personal library designed for active viewers.

* **Segmented Tracking:** Distinct environments for Movies and TV Shows.
* **Deep Filtering:** Filter by genre, release year, production country, and community vs. personal ratings.
* **Global Rating Tool:** A universal modal allowing 1–10 scoring and text reviews from any page.
* **Real-time Sync:** Instant state synchronization across devices via Turso.

<div align="center">
  <img src="https://www.ivanluna.dev/images/assets/entercinema-asset4.webp" alt="Watchlist" width="70%">
</div>

#### Custom List Management

A powerful and flexible system for organizing and sharing your favorite content.

* **Comprehensive Curation:** Create and manage unlimited custom lists for any theme or purpose.
* **Dynamic Privacy Controls:** Set lists to public or private with inline editing capabilities.
* **Bulk Actions:** Add multiple items to lists simultaneously with enhanced data reconstruction.
* **Advanced Filtering:** Navigate large lists with sophisticated filtering options and modern pagination.
* **Seamless Integration:** Unified watchlist management within the list modal with undo functionality.
* **Intuitive Editing:** Rename lists, update privacy status, and manage items with dedicated modals.

#### Intelligent Search Engine

A custom search architecture optimized for speed and accuracy.

* **Typo-Tolerance:** Rust-based engine with "Did you mean?" suggestions.
* **Universal Autocomplete:** Real-time results across movies, shows, and people.
* **Curation:** Highlighting trending content specifically tailored for the 2024–2025 landscape.

<div align="center">
  <img src="https://www.ivanluna.dev/images/assets/entercinema-asset6.webp" alt="Advanced Search" width="70%">
</div>

#### Comprehensive Metadata Pages

* **Deep Data:** Access cast/crew details, runtimes, budgets, and original titles.
* **Streaming Logic:** Integrated JustWatch API for localized "Where to Watch" data.
* **External Links:** Direct access to IMDb, Rotten Tomatoes, Trakt, and ***.
* **Visual Media:** High-definition galleries and integrated trailer support.

<div align="center">
  <img src="https://www.ivanluna.dev/images/assets/entercinema-asset8.webp" alt="Deep Metadata" width="70%">
</div>

#### Industry News & Insights

Stay informed with a dedicated news section that aggregates the latest updates from the entertainment industry.

* **Responsive Carousels:** Visual news feed integrated directly into the interface.
* **RSS Integration:** Aggregated breaking news from top industry sources.
* **Automated Updates:** Refreshed every 12 hours via GitHub Actions.

<div align="center">
  <img src="https://www.ivanluna.dev/images/assets/entercinema-asset5.webp" alt="Industry News" width="70%">
</div>

### Technical Stack

| Layer | Technology |
| --- | --- |
| **Frontend** | Vue.js, Nuxt.js (PWA) |
| **Backend Services** | Django REST Framework (DRF) |
| **Performance Core** | Rust (Search, AI processing, Notifications) |
| **Primary Databases** | Turso (LibSQL) for relational data, Supabase for Real-time/Auth |
| **External APIs** | TMDB, IMDb, MDBList, Trakt, JustWatch |

### System Architecture & Integration

#### Authentication & Security

* **Unified Auth:** Modal-based system supporting Email/Password and Google OAuth 2.0.
* **Smart Routing:** Persistent return-to-origin behavior after login and pending action queuing.
* **Localization:** Native support for English (EN) and Spanish (ES).

<div align="center">
  <img src="https://www.ivanluna.dev/images/assets/entercinema-asset7.webp" alt="Authentication" width="70%">
</div>

#### Performance Optimization

* **Rust Integration:** Heavy computational tasks (search indexing and notification logic) are offloaded to Rust for sub-second execution.
* **Vercel Infrastructure:** Optimized for serverless environments with strict execution limits and efficient API middleware.
* **Asset Management:** Complete migration to WebP format and lazy-loading for enhanced mobile performance.

### Installation & Development

#### Prerequisites

* Node.js (LTS)
* Yarn or NPM

#### Setup

```bash
# Clone the repository
git clone https://github.com/entercinema/entercinema.git

# Install dependencies
yarn install

# Environment Configuration
cp .env.example .env

# Run development server
yarn dev

```

#### Production Build

```bash
yarn build
yarn start

```

---

### Version History

#### v4.3.1 — Enhanced User Experience & UI Refresh (2026-01-03)

* **Revamped User Ratings & Reviews:** Decoupled from watchlist, full review control without auto-population, and personal review display in media details.
* **Dynamic Advanced Search:** Content filtering by origin country with a comprehensive, dynamically rendered list of options.
* **Smarter Content Discovery:** Stricter hero item criteria (IMDb source, >7.0 score, >5000 votes) and dynamic year ranges for always-up-to-date listings.
* **Modern Dark UI Theme:** Sleeker interface with consistent semi-transparent dark backgrounds and subtle blur effects across grids and cards.
* **Enhanced List Management:** New 'remove' option in list item menus with improved mobile responsiveness.


#### v4.3.2 — AI System Refactor & Legacy Chatbot Deprecation (2026-01-04)

* **Legacy AI Deprecation:** The Ask-AI chatbot and `ChatbotModal` have been removed to streamline architecture and prepare for future privacy-centric AI features.
* **New Typo Detection Service:** Introduced `api/typo.rs`, a dedicated high-performance service for search typo tolerance.
* **Architectural Cleanup:** Significant reduction in technical debt by removing the legacy `api/gemini.rs` endpoint.
* **Foundation for Future AI:** Laid the groundwork for upcoming personalized weekly recommendations based on watchlist analysis.


#### v4.3.0 — Lists & News Evolution (2026-01-02)

* **Enhanced List Management:** Multi-selection support, "Create-Then-Add" flow, owner-specific actions, and dynamic list cover images.
* **Cinema News:** Dedicated news section with RSS aggregation and homepage carousel.
* **Production Company Discovery:** Integrated overview pages and discovery carousel for production companies.
* **User Ratings & Reviews:** New system for rating content and leaving reviews.
* **AI Chat Integration:** Relocated AI chat to `UserNav` for better accessibility.
* **UI/UX & Performance:** Robust HTML stripping for news, improved carousel stability, and standardized SCSS variables.

#### v4.2.0 — Custom Lists & Enhanced Curation (2025-12-28)

* **Custom List Management:** Comprehensive system for creating, managing, and sharing custom movie and TV show lists with dynamic privacy controls.
* **List Detail Pages:** Revamped with enhanced filtering, pagination, and undo functionality matching watchlist design.
* **Bulk Item Adding:** Add multiple items to lists at once with enhanced data reconstruction and genre parsing.
* **Inline Editing:** Rename lists and update privacy status directly within modals for streamlined management.
* **Dedicated Error Pages:** Introduced 'not found' pages for invalid movie and TV detail URLs.
* **UI Standardization:** Harmonized modal designs, button styles, and pagination across the platform for cross-project consistency.
* **Performance Optimizations:** Concurrent IMDb rating fetches and event bus handling for reactive favorites updates.
* **Code Quality:** Introduced `itemMapper` utility for standardized item payload creation across components.

#### v4.1.0 — Visual Refinements & OST (2025-12-24)

* **Original Soundtrack (OST):** Integrated MusicBrainz for comprehensive soundtrack details.
* **Advanced Search:** Complete overhaul with new filters and improved discovery logic.
* **Loading States:** Standardized loading indicators across the application.
* **UI/UX Polish:** Refined layouts, spacing, and visual consistency.
* **Performance:** Backend optimizations and Vue 3 migration refinements.

#### v4.0.0 — The Hybrid Migration (2025-12-21)

* **Architecture:** Migrated from Nuxt 2 (Vue 2) to Nuxt 4 (Vue 3, ^4.2.2) using a "Hybrid" compatibility strategy.
* **Axios Shim:** Implemented a custom bridge wrapping `$fetch` to preserve legacy `axios` logic without refactoring components.
* **State Management:** Replaced Vuex with Pinia (`stores/`) while retaining complex Options API mixins for stability.
* **Infrastructure:** Modernized config (`nuxt.config.ts`), replaced `static/` with `public/`, and updated file-based routing to Nuxt 4 syntax (`[id].vue`).
* **Events:** Replaced legacy `$root` event bus with `mitt` for global messaging.

#### v3.0.0 — Personalized Discovery (2025-12-19)

* **Infrastructure:** Migrated deployment to Vercel for superior stability.
* **Corporate Following:** Added ability to follow production companies.
* **QuickFav:** New component for rapid watchlist management.
* **Persistent State:** Filter and sort preferences now persist across user sessions.

#### v2.2.0 — UI Modernization (2025-12-08)

* **Dynamic Tabs:** Recommendations segmented by Director, Creator, and Producer.
* **Unified Streaming:** Added "Watch On" section with deep links (StreamingSourceA, ***, ***).
* **Review Integration:** Full Trakt.tv integration with graphical star ratings.

#### v2.1.0 — Backend Evolution

* **Database Migration:** Transitioned Favorites & Ratings from Supabase to Turso for improved relational performance.
* **Bayesian Sorting:** Implemented weighted IMDb rating sorts for more accurate discovery.

### Attributions & Inspiration

* Data and metadata provided by TMDB, IMDb, MDBList, Trakt, JustWatch, and ***.
* Inspired by the TasteJS Nuxt Movies project.