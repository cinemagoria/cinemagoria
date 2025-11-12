## EnterCinema

A **comprehensive entertainment platform** for discovering, tracking, and managing movies and TV shows. **EnterCinema** aggregates data from multiple sources to provide **intelligent search**, **personalized watchlists**, and **AI-driven recommendations**.

### Overview

**EnterCinema** is a **Progressive Web Application (PWA)** that streamlines entertainment discovery and management.  
The platform integrates data from **TMDB**, **MDBList**, and **JustWatch** to deliver up-to-date information on thousands of movies and TV shows — including **streaming availability**, **release schedules**, and **detailed metadata**.

![Guide GIF](./static/previews/entercinema.png)

---

### Key Features

#### Intelligent Search & Discovery

* **Advanced search** with typo correction and autocomplete  
* **Multi-category results** (movies, TV shows, actors)  
* **Genre-based browsing** with visual category cards  
* **Trending and popular content** sections  
* **Advanced filtering** by type, genre, year, country, and rating  

#### Content Management

* **Personal watchlist** with unlimited capacity  
* **Star rating system** with written reviews  
* **Filter by genre, release year, user ratings, and community ratings**  
* **Pagination** for large collections  
* **Quick add/remove** functionality  

#### Personalized Notifications

* **Real-time updates** about new releases from followed actors, directors, writers, and creators  
* **Smart filtering** between unread and all notifications  
* **Rich notifications** with poster images, character information, and release dates  
* **Following management** with unified view of all followed people and TV shows  
* **Mark as read/unread** functionality for organizing notifications  
* **Bulk actions** to mark all notifications as read  
* **Paginated history** to browse past notifications  

#### Release Tracking

* **Daily movie release calendar** with navigation  
* **TV show episode tracking** with air dates  
* **Next episode notifications** for followed series  
* **Season and episode information**

#### AI Assistant

* **Conversational entertainment recommendations**  
* **Context-aware suggestions** based on query  
* **Daily curated prompts** for discovery  
* **Spoiler detection system**  

#### Detailed Information Pages

* **Comprehensive metadata** (cast, crew, budget, runtime)  
* **Streaming platform availability** via JustWatch  
* **External platform links** (IMDb, Rotten Tomatoes, Trakt)  
* **Community reviews** with spoiler warnings  
* **Related content recommendations**  
* **Trailers and photo galleries**

#### User System

* **Dual authentication** (native registration and Google OAuth)  
* **Profile customization**  
* **Rating history tracking**  
* **Account activity monitoring**

---

### Tech Stack

**Frontend**

* **Vue.js**  
* **Nuxt.js**

**Backend**

* **Django REST Framework**

**Database**

* **Turso**  
* **Supabase**

**APIs**

* **TMDB API**  
* **MDBList API**  
* **JustWatch API**

---

### Authentication

EnterCinema supports two authentication methods:

* **Native registration** via Django REST Framework  
* **Google OAuth 2.0** for single sign-on

---

### Core Functionality

#### Search System

The search engine processes queries with **intelligent typo correction**.  
When users enter misspelled terms, the system displays a **"Did you mean?" suggestion** with the corrected query — ensuring seamless discovery.

#### Watchlist Management

Users can organize content into **separate movie and TV show collections** with filters by **genre**, **release year range**, **community ratings**, and **personal ratings**.  
A **pagination system** ensures smooth handling of large libraries.

#### Advanced Search

**Multi-criteria filtering** allows users to narrow results by **type**, **genre**, **release year**, **origin country**, **minimum rating**, and **sorting algorithms**.

#### AI Recommendations

The **AI assistant** operates in two modes:  
* **Free-form chat** for natural language recommendations  
* **Daily prompts** for curated discovery  

Results include **contextual carousels** of related content.

#### Notifications System

A **personalized notification feed** keeps users informed about new content from followed actors, directors, writers, and TV show creators.  
Users can **follow/unfollow** entertainment industry professionals and receive **real-time updates** when they have new movie releases, TV show episodes, or other projects.  
The system includes **filtering options** to view only unread notifications and **bulk management tools** for efficient organization.

#### Release Calendar

An interactive **timeline interface** displays **upcoming movie releases** and **TV episode air dates**.  
Users can browse **day-by-day** to plan their viewing schedule.

---

### User Interface

The platform features a **responsive design** optimized for **desktop and mobile**.  
Navigation is handled through a **persistent bottom bar** with sections for **Home**, **Movies**, **Advanced Search**, **Notifications**, **AI Assistant**, and **Watchlist**.  
A **global search bar** and **user menu** are accessible from the header.

---

### Attributions

EnterCinema integrates and displays data from several third-party sources:

* [**TMDB**](https://www.themoviedb.org/) — Core entertainment metadata, cast, and assets  
* [**MDBList**](https://mdblist.com/) — Enhanced metadata and curated lists  
* [**JustWatch**](https://www.justwatch.com/) — Real-time streaming platform availability  

The foundational inspiration for this project comes from the [**TasteJS**](https://github.com/tastejs/nuxt-movies) repository — special thanks for their pioneering work.

For more information, see the [**Terms and Conditions**](https://entercinema.com/usage-policies/).

---

### Feedback

Your feedback is valuable!  
If you encounter any issues or have suggestions for improvements, please create a new issue in this [**GitHub repository**](https://github.com/imprvhub/entercinema/issues/new).

---