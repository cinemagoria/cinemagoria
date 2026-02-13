## Entercinema - The moment you discover what to watch.

Entercinema is a high-performance **Progressive Web Application (PWA)** engineered for modern viewers. By aggregating data from **TMDB, IMDb, MDBList, Trakt, and JustWatch**, it provides a centralized hub for intelligent search and cross-device synchronization.

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



#### Global Festivals & Awards Tracking

Stay connected with the pulse of the film industry through dedicated festival coverage and comprehensive awards data.

* **Festival Circuit:** Deep integration for major festivals including **Sundance, Berlinale, Rotterdam, and Slamdance**, with progressive expansion planned.
* **Awards Season:**
    * **Oscars:** Complete historical data including nominees and winners.
    * **Major Honors:** Tracking winners for **Golden Globes, Golden Lion (Venice), and Golden Bear (Berlinale)**.

<div align="center">
  <img src="https://www.ivanluna.dev/images/assets/entercinema-asset9.webp" alt="Festivals & Awards" width="70%">
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

### Changelog

Full version history and changelogs are available at [entercinema.com/changelog](https://entercinema.com/changelog).

### Attributions & Inspiration

* Data and metadata provided by TMDB, IMDb, MDBList, Trakt, JustWatch, and ***.
* Inspired by the TasteJS Nuxt Movies project.