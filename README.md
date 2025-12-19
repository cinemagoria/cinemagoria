# EnterCinema — The moment you discover what to watch.

EnterCinema is a **Progressive Web Application (PWA)** for discovering, tracking, and managing movies and TV shows.
It aggregates data from **TMDB**, **IMDb**, **MDBList**, and **JustWatch** to deliver **intelligent search**, **personalized notifications**, **cross-device sync**, and an **AI-powered recommendation experience**.

---

## Overview

EnterCinema centralizes **discovery**, **notifications**, **watchlist management**, and **AI-driven recommendations** into a single platform.
It provides streaming availability, complete metadata, release tracking, cross-device synchronization, and a conversational AI assistant tailored for entertainment discovery.

![Preview](https://www.ivanluna.dev/images/assets/entercinema.png)

---

# Key Features

---

## Ask AI Modal (AI Assistant)

A conversational assistant designed for natural-language entertainment guidance.

**Highlights**:

* Context-aware recommendations
* Cross-device conversation synchronization
* Multiple conversations: create, switch, delete
* Automatic cleanup of empty threads
* IMDb-prioritized metadata references
* Spoiler detection
* Daily curated prompts (20-day cycle)
* Contextual result carousels with posters and metadata

---

## Notifications Center

A real-time system that tracks **new releases**, **episode premieres**, and **content involving followed people**.

**Core capabilities**:

* Follow actors, directors, writers, and TV series
* Notifications for new movies, episode drops, and cast/crew appearances
* Rich notification cards with metadata
* Read/unread filtering
* Single and bulk management actions
* Pagination for large histories
* 60-second undo when unfollowing
* Intelligent release detection windows
* Automated cron job for daily checks
* Rust/LibSQL backend with cross-device synchronization

---

## Watchlist & Rating System

A personal library with robust filtering and rating tools.

**Features**:

* Separate movie and TV watchlists
* Filtering by genre, year range, country, community rating, and personal rating
* “Not Rated” filter
* 1–10 rating selector with optional text review
* Global rating modal accessible anywhere
* Real-time sync via Supabase
* Quick add/remove actions
* Pagination for large collections

---

## Intelligent Search & Discovery

Powered by a Rust-based typo-tolerant engine.

**Includes**:

* Multi-category results (movies, TV shows, people)
* Autocomplete
* Advanced filters (type, genre, year, country, rating)
* Trending and recent content (2024–2025)
* Genre browsing

---

## Release Tracking

* Daily movie release calendar
* Episode tracking with air dates
* S01E05 formatting
* Country-specific release details (types, certifications)
* Automatic notifications if followed

---

## Detailed Information Pages

* Comprehensive metadata: cast, crew, runtime, budget
* IMDb ratings with clear attribution
* Original titles when applicable
* Streaming availability via JustWatch
* External links (IMDb, Rotten Tomatoes, Trakt, ***)
* Community reviews with spoiler warnings
* Related content recommendations
* Trailers and photo galleries
* Follow buttons for people and TV series

---

## User System

* Modal-based authentication (no dedicated pages)
* Email/password + Google OAuth
* Profile with avatar support
* Rating history viewer
* Cross-device sync for conversations and notifications
* EN/ES language switching

---

## Global Navigation Architecture

* Centralized UserNav with profile, language picker, ratings, AI access
* Notification bell with unread counter
* Responsive navigation for all devices

---

## Tech Stack

**Frontend**:

* Vue.js, Nuxt.js

**Backend**:

* Django REST Framework
* Rust services (search, AI, notifications)

**Databases**:

* Turso (LibSQL) for follows, notifications, conversations
* Supabase for auth and ratings

**APIs**:

* TMDB, IMDb, MDBList, JustWatch

---

## Authentication

* Central AuthModal
* Native authentication (DRF) + Google OAuth 2.0
* Modal-triggered routing for `/login` and `/register`
* Return-to-origin behavior
* Pending action queue
* EN/ES support

---

## Search Engine (Core Functionality)

* Rust-powered typo correction
* “Did you mean?” suggestions
* Multi-category results
* Real-time autocomplete
* Advanced filters
* Year-based curation

---

## Notification System (Core Functionality)

* Follow creators and shows
* Movie and episode release notifications
* Rich cards
* Read/unread filtering
* Pagination
* Cross-device sync
* Cron-driven checks

---

## Watchlist Management (Core Functionality)

* Separate movie/TV lists
* Filters: genre, year, IMDb rating, personal rating
* Global rating modal
* Quick actions
* Supabase real-time sync

---

## Advanced Search

* Multi-criteria filtering
* Sorting (popularity, rating, release date)
* Recent-year curation
* Full catalog accessible through search

---

## AI Recommendations (Deep Capabilities)

* Cross-device conversation sync
* Multiple conversations
* Context-aware suggestions
* IMDb-first rating enrichment
* Spoiler detection
* Auto-expanding textarea
* Consistent modal behavior

---

## Release Calendar

* Daily releases
* Country flags and certifications
* Episode air dates
* S01E05 formatting

---

## External Integrations

* Rotten Tomatoes Tomatometer
* *** for movies
* JustWatch for streaming platforms
* IMDb + Trakt links
* Prioritized ordering: ratings → streaming → community

---

## Cross-Device Features

* Conversation sync (AI)
* Notification sync
* Rating/watchlist sync
* Rust/LibSQL backend + Supabase

---

## Performance & Optimization

* Rust backend for heavy operations
* Caching and optimized queries
* Lazy loading and pagination
* Updated sitemap and manifest
* Efficient cron jobs

---

## Accessibility

* Keyboard navigation
* Screen reader support
* Semantic structure
* Clear focus states
* Accessible forms and dialogs

---

## Security & Privacy

* Google OAuth 2.0
* DRF authentication
* Protected endpoints
* User ownership validation
* Proper authorization across sync features

---

## Supported Platforms

Desktop, mobile, and tablet support across modern browsers.
Installable via PWA with offline capabilities (limited).

---

## Attributions

TMDB, IMDb, MDBList, JustWatch, ***
Inspired by the TasteJS Nuxt Movies project.

---

##  Development

```bash
git clone https://github.com/imprvhub/entercinema.git
yarn install
cp .env.example .env
yarn dev
```

Build:

```bash
yarn build
yarn start
```

---

## Roadmap

* Enhanced offline modes
* AI advanced filtering
* Exportable watchlist
* Additional languages
* More streaming integrations

---

##  Version History

### v3.0.0: Personalized Content Discovery & Enhanced Watchlist (2025-12-19)

**Status**: Production Ready

**Summary**
This release delivering a significantly more personalized content discovery experience and a powerful, refined Watchlist. With a total of **36 commits**, this update introduces the ability to follow production companies for tailored notifications and content feeds, provides advanced filtering and sorting for your Watchlist, and includes a critical infrastructure migration to Vercel for improved stability.

**Breaking Changes**
*   **Infrastructure Migration**: Deployment migrated from Netlify to Vercel. This enforces strict 5-second serverless execution limits and requires explicit CORS configuration for API middleware.

**Major Features**
*   **Production Company Following**: Follow companies to get new release notifications.
*   **Followed Content Feeds**: Dedicated sections on movie/TV pages for content from companies you follow.
*   **Watchlist QuickFav**: Efficiently add/remove items with the new `QuickFav` component.
*   **Persistent Watchlist Filters**: Filters and sort preferences now persist across sessions.
*   **Advanced Filtering**: Consolidated genre filters, IMDb vote count filtering, and runtime sorting.

**UI/UX Refinements**
*   **Visual Polish**: Enhanced spoiler banners, consistent margins, refined notification layouts, and updated asset styling.
*   **Loaders**: Improved image loading states with customizable loaders.

**Performance**
*   **Vercel Migration**: Adaptation of API middleware for Vercel's serverless environment.
*   **Config Cleanup**: Removal of Netlify-specific code.

---

### v2.2.0: Dynamic Content Discovery & UI Modernization (2025-12-08)

**Summary**
Introduces dynamic recommendation systems, a "Watch On" section with streaming links, and Trakt.tv review integration.

**Major Features**
*   **Dynamic Recommendations**: Tab-based recommendations by Director, Creator, and Producer on detail pages.
*   **"Watch On" Section**: Unified streaming links (TMDB, StreamingSourceA, ***, ***).
*   **Trakt.tv Reviews**: deeply integrated with graphical star ratings.
*   **Smarter AI**: Improved media reference sorting and conversation management (bulk archive/delete).

**UI/UX Refinements**
*   **Chatbot Redesign**: Modern, responsive UI with improved mobile sidebar.
*   **Watchlist Filtering**: Integrated sorting into the filter modal with IMDb rating range input.
*   **WebP Migration**: Significant performance boost by converting assets to WebP.

---

### v2.1.0: Enhanced Watchlist & Smarter AI

**Summary**
Delivers a robust suite of enhancements focusing on an unparalleled Watchlist experience and AI advancements.

**Breaking Changes**
*   **Backend Migration**: Favorites & Ratings moved from Supabase to Turso.
*   **Trailers**: In-app modal removed; trailers now redirect to YouTube.

**Major Features**
*   **Watchlist Evolution**: Weighted IMDb rating sort (Bayesian average), four-way sorting, and AI analysis integration.
*   **AI Analysis**: Analyze watchlist items directly with AI.
*   **Production Company Pages**: Dedicated pages for production companies.
*   **FollowingModal**: Globalized for universal access.

---

**v2.0.0 (2025-11-13)**
Architectural overhaul, IMDb integration, notifications, AI sync, modal auth.
