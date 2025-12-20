## Entercinema - The moment you discover what to watch.

Entercinema is a high-performance **Progressive Web Application (PWA)** engineered for modern viewers. By aggregating intelligence from **TMDB, IMDb, MDBList, Trakt, and JustWatch**, it provides a centralized hub for intelligent search, cross-device synchronization, and a conversational AI discovery experience.

### Project Overview

Entercinema streamlines the entertainment lifecycle—from initial discovery to release tracking. It bridges the gap between fragmented streaming data and personal curation, offering a seamless interface for managing watchlists, receiving real-time notifications, and interacting with a context-aware AI assistant.

### Core Features

#### AI Discovery Assistant (Ask AI)

A sophisticated conversational interface built for natural-language entertainment guidance.

* **Contextual Intelligence:** Provides recommendations based on current trends and user history.
* **Thread Management:** Supports multiple concurrent conversations with cross-device sync and automatic cleanup of empty threads.
* **Rich Metadata:** Integrates IMDb-prioritized references and interactive result carousels with posters.
* **Smart Safety:** Built-in spoiler detection and curated daily discovery prompts (20-day cycle).

#### Advanced Notification Center

A real-time tracking engine for the content and creators you care about.

* **Granular Following:** Follow actors, directors, writers, production companies, and specific TV series.
* **Multi-Channel Alerts:** Notifications for theatrical releases, digital drops, and weekly episode premieres.
* **Management Suite:** Features bulk actions, read/unread filtering, and a 60-second "undo" window for unfollowing.
* **Infrastructure:** Powered by a Rust/LibSQL backend with automated daily cron-job validation.

#### Precision Watchlist & Rating System

A robust personal library designed for active viewers.

* **Segmented Tracking:** Distinct environments for Movies and TV Shows.
* **Deep Filtering:** Filter by genre, release year, production country, and community vs. personal ratings.
* **Global Rating Tool:** A universal modal allowing 1–10 scoring and text reviews from any page.
* **Real-time Sync:** Instant state synchronization across devices via Supabase.

#### Intelligent Search Engine

A custom search architecture optimized for speed and accuracy.

* **Typo-Tolerance:** Rust-based engine with "Did you mean?" suggestions.
* **Universal Autocomplete:** Real-time results across movies, shows, and people.
* **Curation:** Highlighting trending content specifically tailored for the 2024–2025 landscape.

#### Comprehensive Metadata Pages

* **Deep Data:** Access cast/crew details, runtimes, budgets, and original titles.
* **Streaming Logic:** Integrated JustWatch API for localized "Where to Watch" data.
* **External Links:** Direct access to IMDb, Rotten Tomatoes, Trakt, and ***.
* **Visual Media:** High-definition galleries and integrated trailer support.

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
git clone https://github.com/imprvhub/entercinema.git

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

#### v3.0.0 — Personalized Discovery (2025-12-19)

* **Infrastructure:** Migrated deployment to Vercel for superior stability.
* **Corporate Following:** Added ability to follow production companies.
* **QuickFav:** New component for rapid watchlist management.
* **Persistent State:** Filter and sort preferences now persist across user sessions.

#### v2.2.0 — UI Modernization (2025-12-08)

* **Dynamic Tabs:** Recommendations segmented by Director, Creator, and Producer.
* **Unified Streaming:** Added "Watch On" section with deep links (VidSRC, ***, ***).
* **Review Integration:** Full Trakt.tv integration with graphical star ratings.

#### v2.1.0 — Backend Evolution

* **Database Migration:** Transitioned Favorites & Ratings from Supabase to Turso for improved relational performance.
* **Bayesian Sorting:** Implemented weighted IMDb rating sorts for more accurate discovery.

### Attributions & Inspiration

* Data and metadata provided by TMDB, IMDb, MDBList, Trakt, JustWatch, and ***.
* Inspired by the TasteJS Nuxt Movies project.