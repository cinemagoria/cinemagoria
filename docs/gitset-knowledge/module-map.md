# Module Map

## Modules

### `.github`

- `.github/FUNDING.yml` — Configures various platforms for project funding, specifying usernames or project names for GitHub, Buy Me a Coffee, and placeholders for others.
- `.github/workflows/gitset-knowledge.yml` — Defines a GitHub Actions workflow to incrementally refresh the project's AI knowledge base using Gitset, creating a pull request for changes.
  - Registers 'workflow_dispatch' and 'push' on 'main' branch (excluding docs, markdown, gitignore, LICENSE) as triggers.
- `.github/workflows/sync-hero-data.yml` — Automates the synchronization of hero and noir enrichment data, committing and pushing updated JSON files to the repository.
  - Registers 'cron: 0 6 * * *' and 'workflow_dispatch' as triggers.
- `.github/workflows/sync-noir-historical.yml` — Automates the synchronization of N.O.I.R historical data and regenerates noir enrichment data, committing the updated JSON file.
  - Registers 'workflow_dispatch' as a trigger.

### `(root)`

- `app.vue` — Defines the root Vue application component, including Nuxt layout and page rendering, and injects structured data (Schema.org Organization and WebSite) into the document head for SEO.
- `cloudbuild.yaml` — Configures Google Cloud Build to automate the Docker image build, push to Artifact Registry, and deployment to Google Cloud Run for the Cinemagoria application.
  - Deploys to Cloud Run service 'cinemagoria-main' in 'us-east1'.
- `Dockerfile` — Defines a multi-stage Docker build process for the Cinemagoria Nuxt application, including dependency installation, build, and a production-ready runtime environment.
  - Uses a pinned Node.js 22-slim image to avoid a specific `node-fetch` gzip issue.
- `nuxt.config.ts` — Configures the Nuxt.js framework for the Cinemagoria application, including path aliases, devtools settings, and route-specific caching headers for sitemaps and RSS feeds.
  - exports: `default`
- `package.json` — Manages project metadata, scripts for development and build, and defines all production and development dependencies and dependency resolutions for the Cinemagoria application.
  - Defines `build`, `dev`, `generate`, `preview`, and `postinstall` scripts.
- `tsconfig.json` — Configures TypeScript for the Nuxt.js project by referencing generated TypeScript configuration files for different environments (app, server, shared, node).

### `assets`

- `assets/css/base/_base.scss` (other)
- `assets/css/base/_forms.scss` (other)
- `assets/css/base/_layout.scss` (other)
- `assets/css/base/_lazyload.scss` (other)
- `assets/css/base/_normalize.scss` (other)
- `assets/css/base/_transitions.scss` (other)
- `assets/css/base/_typography.scss` (other)
- `assets/css/components/_alert.scss` (other)
- `assets/css/components/_card.scss` (other)
- `assets/css/components/_carousel.scss` (other)
- `assets/css/components/_datepicker.scss` (other)
- `assets/css/components/_listing.scss` (other)
- `assets/css/global.scss` (other)
- `assets/css/utilities/_helpers.scss` (other)
- `assets/css/utilities/_variables.scss` (other)

### `components`

- `components/global/GoogleLogin.vue` — Provides a reusable Google login button component that handles authentication flow, displays loading states, and emits events for login start and error.
- `components/global/UserNav.vue` — Displays user navigation elements including notifications, avatar, and a dropdown menu with profile links, settings, and logout functionality.
- `components/BaficiCard.vue` — A card component specifically for BAFICI festival items, displaying an image, quick actions, and a link to the item's detail page.
- `components/BerlinaleCard.vue` — A card component specifically for Berlinale festival items, displaying an image, quick actions, and a link to the item's detail page.
- `components/BifffCard.vue` — A card component specifically for BIFFF festival items, displaying an image, quick actions, and a link to the item's detail page.
- `components/CannesCard.vue` — A card component specifically for Cannes festival items, displaying an image, quick actions, and a link to the item's detail page.
- `components/CannesLiveBanner.vue` — A banner component for the Cannes 2026 festival, featuring the festival logo, a 'LIVE' badge, and a call to action to explore coverage.
- `components/CannesWinnersBanner.vue` — A banner component for the Cannes 2026 festival winners, featuring the festival logo, a 'WINNERS' badge, and a call to action to explore the palmarès.
- `components/Card.vue` — A generic card component for displaying various media types (movies, TV shows, people, productions, streaming, festivals) with an image, title, and optional rating/year.
- `components/common/AwardsTab.vue` — Displays a tabbed interface for various film awards (Oscars, Golden Globes, Palme d'Or, Golden Lion, Golden Bear) for a given media item or person.
- `components/common/FullCreditsModal.vue` — A modal component that displays the full crew credits for a given title, grouped by department with collapsible sections.
- `components/common/MediaProgressBar.vue` — A component displaying a circular progress bar for media viewing progress, allowing users to adjust their progress via a slider.
- `components/Credits.vue` — Displays a horizontal, scrollable carousel of cast members for a movie or TV show, including navigation buttons and dynamically calculated state for button disabling.
- `components/CreditsItem.vue` — Renders an individual cast member's card within a credits list, displaying their image, name, and character, with a loading state and a link to their person page.
- `components/CuffCard.vue` — Displays a card for a movie or TV show item, including an image, title, and quick actions like favoriting and opening external links, with conditional rendering based on context.
- `components/CustomListingCategoriesMovies.vue` — Provides a customizable carousel for movie categories, featuring navigation buttons, a title, and an optional 'Explore All' link.
- `components/CustomListingCategoriesSeries.vue` — Provides a customizable carousel for TV series categories, featuring navigation buttons, a title, and an optional 'Explore All' link.
- `components/Discover.vue` — Implements a discovery page with filters for genres, sort options, countries, networks, languages, providers, minimum votes, format type, and release year/rating ranges.
- `components/DynamicSearchCarousel.vue` — Displays a dynamic, scrollable carousel of search results for movies or TV shows, including navigation buttons and a title.
- `components/ExternalLinks.vue` — Displays a grid of external links for a movie or TV show, including IMDb, Letterboxd, Rotten Tomatoes, Trakt, and TMDb, with associated icons.
- `components/FantasiaCard.vue` — Displays a card for a movie or TV show item, including an image, title, and quick actions like favoriting and opening external links, with conditional rendering based on context.
- `components/FantasiaLiveBanner.vue` — Displays a promotional banner for the Fantasia 2026 festival, featuring a background, shimmer effect, logo, and text, linking to the festival's coverage page.
- `components/FeatureDescription.vue` — Vue component displaying a prominent feature description with cinematic light effects and gradient text, designed to be responsive across different screen sizes.
- `components/festival/BaficiBadge.vue` — Vue component displaying the BAFICI 2026 film festival logo badge, with hover effects and responsive styling.
- `components/festival/BerlinaleBadge.vue` — Vue component displaying the Berlinale Film Festival 2026 logo badge, with hover effects and responsive styling.
- `components/festival/BifffBadge.vue` — Vue component displaying the BIFFF 2026 film festival logo badge, with hover effects and responsive styling.
- `components/festival/CannesAcidBadge.vue` — Vue component displaying the Cannes Film Festival 2026 – ACID logo badge, with hover effects and responsive styling.
- `components/festival/CannesBadge.vue` — Vue component displaying the main Cannes Film Festival 2026 logo badge, with hover effects and responsive styling.
- `components/festival/CannesCriticsChoiceBadge.vue` — Vue component displaying the Cannes Film Festival 2026 – Critics' Choice logo badge, with hover effects and responsive styling.
- `components/festival/CannesQuinzaineBadge.vue` — Vue component displaying the Cannes Film Festival 2026 – Quinzaine des Cinéastes logo badge, with hover effects and responsive styling.
- `components/festival/CuffBadge.vue` — Vue component displaying the Calgary Underground Film Festival 2026 logo badge, with hover effects and responsive styling.
- `components/festival/FantasiaBadge.vue` — Vue component displaying the Fantasia International Film Festival 2026 logo badge, with hover effects and responsive styling.
- `components/festival/FrightfestBadge.vue` — Vue component displaying the FrightFest 2026 logo badge, with hover effects and responsive styling.
- `components/festival/KviffBadge.vue` — Vue component displaying the Karlovy Vary International Film Festival 2026 logo badge, with hover effects and responsive styling.
- `components/festival/RomfordBadge.vue` — Vue component displaying the Romford Horror Film Festival 2026 logo badge, with hover effects and responsive styling.
- `components/festival/RotterdamBadge.vue` — Vue component displaying the Rotterdam Film Festival 2026 logo badge, with hover effects and responsive styling.
- `components/festival/SlamdanceBadge.vue` — Vue component displaying the Slamdance Film Festival 2026 logo badge, with hover effects and responsive styling.
- `components/festival/SundanceBadge.vue` — Vue component displaying the Sundance Film Festival 2026 logo badge, with hover effects and responsive styling.
- `components/festival/SxswBadge.vue` — Vue component displaying the SXSW Film & TV Festival 2026 logo badge, with hover effects and responsive styling.
- `components/festival/SxswCard.vue` — Vue component for displaying a festival item card, including an image, quick actions like favoriting and opening external links, and a loader.
- `components/festival/TiffBadge.vue` — Vue component displaying the TIFF 2026 film festival logo badge, with hover effects and responsive styling.
- `components/festival/TribecaBadge.vue` — Vue component displaying the Tribeca Festival 2026 logo badge, with hover effects and responsive styling.
- `components/festival/VeniceBadge.vue` — Vue component displaying the Venice Film Festival 2026 logo badge, with hover effects and responsive styling.
- `components/festival/WinnersCarousel.vue` — Displays a horizontal carousel of festival winners, grouped by title/director, with navigation controls and a stat display.
- `components/FestivalDataDisclaimer.vue` — Provides a disclaimer about missing festival data and allows users to report issues via a modal form, teleported to the festival hero section.
- `components/FestivalsCarousel.vue` — Renders a carousel of festivals with navigation, an optional title, and a 'View All' link.
- `components/FestivalsRotatingBanner.vue` — Displays a rotating banner of active festivals, linking to their respective pages, with a subtle background animation.
- `components/FollowedContent.vue` — Displays a paginated list of movies or TV shows from followed production companies or streaming platforms, with filtering and sorting options.
- `components/FrightfestCard.vue` — Renders a card for a Frightfest item, including an image, quick actions like external links and favoriting, and a route link.
- `components/global/ArticleAIDisclosure.vue` — Displays a disclosure that an article was AI-generated and provides a button to report errors via a modal form.
- `components/global/ArticleShareModal.vue` — Provides a modal for sharing an article via a direct link, copying the link, or sharing to various social media platforms.
- `components/global/AuthModal.vue` — Presents a modal for user authentication, allowing users to sign in or register, with tabs for each action.
- `components/global/CardActions.vue` — Provides a dropdown menu of actions for a content card, such as rating, adding to a watchlist, or adding to a custom list.
- `components/global/CookieConsent.vue` — Manages and displays a cookie consent banner and a preferences panel, allowing users to accept, decline, or customize cookie settings.
- `components/global/CreateListModal.vue` — Provides a modal interface for users to create a new custom list, including name, description, and privacy settings.
- `components/global/FollowingModal.vue` — Vue component for a modal that allows users to manage the people, TV shows, production companies, and streaming services they follow.
- `components/global/Footer.vue` — Vue component for the global footer, displaying navigation links to resources, social media, and copyright information.
- `components/global/InstallPrompt.vue` — Vue component that displays a prompt to the user to install the Cinemagoria web application to their home screen.
- `components/global/MyListsModal.vue` — Vue component for a modal that allows users to manage their custom lists, including adding or removing items and creating new lists.
- `components/global/Nav.vue` — Vue component for the main navigation bar, providing links to home, discover, news, and user-specific sections like lists and profile.
- `components/global/NewsCarousel.vue` — Vue component displaying a carousel of the latest news articles, with navigation controls and a link to explore all news.
- `components/global/ProgressTrackingModal.vue` — Vue component for a modal that enables users to track their watch progress for movies and TV shows, including individual episodes.
- `components/global/QuickFav.vue` — Vue component for a quick favorite button that allows users to add or manage an item in their lists, displaying a plus or check icon.
- `components/global/QuickFavModal.vue` — Vue component for a confirmation modal that prompts the user to confirm removal of an item from their watchlist.
- `components/global/RatedModal.vue` — Provides a modal interface for users to view and manage their rated movies and TV shows, including options to edit reviews and remove ratings.
- `components/global/RelatedArticlesCarousel.vue` — Displays a horizontal carousel of related articles, fetching data asynchronously and providing navigation controls for scrolling.
- `components/global/SearchForm.vue` — Implements a global search form with debouncing, dynamic placeholder text, and navigation logic based on search queries or specific routes.
- `components/global/TopNav.vue` — Renders a fixed top navigation bar that displays a title, primarily for smaller screens, and hides on larger viewports.
- `components/Hero.vue` — Displays a hero section with a main item (movie/TV show), auto-advancing carousel functionality, and interactive elements for user engagement like rating and tracking.
- `components/HowItWorksModal.vue` — Presents a modal explaining how release alerts work, featuring an introductory text and a carousel to illustrate the process.
- `components/Images.vue` — Displays a panel of images (posters or backdrops) for a given media type, with a count and a modal for full-screen viewing.
- `components/ImagesItem.vue` — Renders an individual image item within a gallery, displaying a loading spinner and handling image loading states and modal interactions.
- `components/KviffCard.vue` — Displays a card for a KVIFF (Karlovy Vary International Film Festival) item, including an image, quick actions, and a link to its details page.
- `components/KviffLiveBanner.vue` — Displays a promotional banner for the KVIFF 2026 festival, providing a link to its coverage page with a distinct visual style.
- `components/Listing.vue` — Displays a list of items, typically movies or TV shows, with an optional title, a link to view all items, and a loading indicator for infinite scrolling.
- `components/ListingCarousel.vue` — Renders a horizontal carousel of items, such as movie or TV show cards, with navigation buttons and an optional 'Explore All' link.
- `components/Loader.vue` — Provides a reusable SVG-based loading spinner component with customizable size and color.
- `components/MediaNav.vue` — Presents a navigation bar with clickable buttons, typically used for filtering media content, and emits an event when a button is clicked.
- `components/Modal.vue` — Implements a generic modal component that can display various content types like iframes or images, with navigation and accessibility features.
- `components/movie/MovieInfo.vue` — Displays detailed information about a movie, including its poster, overview, cast, crew, awards, and external links, with dynamic tab navigation.
- `components/movie/MovieReleases.vue` — Displays a list of movie release dates grouped by country, showing release details and country flags.
- `components/music/SoundtrackGroup.vue` — Organizes and displays a group of soundtrack items, typically by year, within a list.
- `components/music/SoundtrackItem.vue` — Displays a single soundtrack item, including its title, disambiguation, and artist, with a link to MusicBrainz.
- `components/music/SoundtrackList.vue` — Displays a list of soundtrack albums and their tracks, allowing users to play tracks via YouTube.
- `components/NoirModal.vue` — Presents a stylized modal dialog featuring the 'N.O.I.R' brand, a manifesto, and options to show or hide the manifesto content.
- `components/OscarsCarousel.vue` — Displays a scrollable carousel of nominees for the 98th Academy Awards, allowing users to navigate through different award categories and view associated films/people.
- `components/OscarsLiveBanner.vue` — Displays a banner for the 98th Academy Awards, showing live status or results with a ticker of winning categories and films.
- `components/person/CreditsHistory.vue` — Displays a person's filmography, allowing filtering by department and media type (movies/TV) and grouping credits by year.
- `components/person/CreditsHistoryGroup.vue` — Renders a group of credits for a person, typically organized by year, displaying each credit using the CreditsHistoryItem component.
- `components/person/CreditsHistoryItem.vue` — Displays a single credit item for a person, linking to the associated movie or TV series and showing their role and episode count if applicable.
- `components/person/PersonAwardsTab.vue` — Displays a person's awards history, including Oscars, Golden Globes, Palme d'Or, Golden Lion, and Golden Bear, with links to associated films.
- `components/person/PersonInfo.vue` — Displays detailed information about a person, including their biography, birth/death dates, known for department, and awards won.
- `components/ProductionCompanyCarousel.vue` — Displays a scrollable carousel of popular production companies, with autoplay functionality and links to individual company pages.
- `components/ProductionHero.vue` — Displays a hero section for a production company, showing its name, logo, country, headquarters, description, and a follow button.
- `components/RomfordCard.vue` — Displays a card for a film from the Romford Film Festival, including its poster, title, and quick actions like favoriting or opening the official festival page.
- `components/RotterdamCard.vue` — Displays a card for a film from the Rotterdam Film Festival, including its poster, title, and quick actions like favoriting or opening the official festival page.
- `components/search/CategoryCarousel.vue` — Displays a collapsible carousel of search results within a specific category, allowing users to scroll through items and load more.
- `components/search/CategorySection.vue` — Displays a collapsible section of items under a given title, typically used for organizing search results by category, with each item rendered using a Card component.
- `components/search/DiscoverSearch.vue` — Provides a comprehensive search interface for discovering movies and TV shows, allowing users to filter by type, genre, sort options, country, network, language, streaming provider, and other criteria.
- `components/search/NewsResultCard.vue` — Renders a single news article as a card, displaying its image, source, publication date, title, and a sanitized description, with dynamic linking to internal or external sources.
- `components/search/SearchGuideModal.vue` — Presents a modal dialog that serves as a guide for using the search functionality, explaining different search methods and features available within Cinemagoria.
- `components/search/SearchResults.vue` — Displays a dynamic list of search results, including movies, TV shows, people, news articles, and users, with support for pagination, loading states, and typo checking.
- `components/SlamdanceCard.vue` — Renders a card for a Slamdance item, displaying its image, title, and providing actions like adding to a list or opening an external source URL.
- `components/SpotlightCarousel.vue` — Displays a horizontal carousel of `Card` components, typically used for spotlighted content, with navigation buttons and an optional 'Explore All' link.
- `components/StreamingPlatformCarousel.vue` — Displays a horizontal carousel of streaming platform cards, featuring popular services with navigation controls and an optional 'Explore All' link.
- `components/StreamingPlatformHero.vue` — Displays a hero section for a streaming platform, allowing users to follow/unfollow it and showing its name and logo.
- `components/SundanceCard.vue` — Displays a card component for Sundance Film Festival items, including an image, title, and quick actions like opening an external link.
- `components/TiffCard.vue` — Displays a card component for TIFF (Toronto International Film Festival) items, including an image, title, and quick actions like opening an external link.
- `components/TribecaCard.vue` — Displays a card component for Tribeca Film Festival items, including an image, title, and quick actions like opening an external link.
- `components/TribecaLiveBanner.vue` — Provides a banner component for the Tribeca 2026 festival, linking to its coverage page with a distinct background and logo.
- `components/tv/Episodes.vue` — Manages and displays a list of TV show episodes, allowing users to select seasons and mark episodes/seasons as watched.
- `components/tv/EpisodesItem.vue` — Displays an individual TV episode item, including its poster, name, and a progress tracking overlay for users.
- `components/tv/TvInfo.vue` — Displays detailed information about a TV show, including its poster, overview, external links, and related content.
- `components/VeniceCard.vue` — Displays a card component for Venice Film Festival items, including an image, title, and quick actions like opening an external link.
- `components/Videos.vue` — Vue component that displays a list of videos, allows filtering by type, and opens a modal to play selected videos, fetching YouTube video details.
- `components/VideosItem.vue` — Vue component for displaying an individual video item with its thumbnail, name, type, and duration, emitting an event when clicked to open a modal.
- `components/WatchOn.vue` — Vue component to display a list of streaming providers where a movie or TV show can be watched, including their logos and links.
- `components/YearPicker.vue` — Vue component providing a dropdown for selecting a release year, ranging from a minimum year to the current year, and emitting the selected value.

### `composables`

- `composables/useConsentGuard.js` — Provides a Vue composable to execute a callback function only when a specific consent category is granted, re-evaluating on consent preference changes.
  - exports: `useConsentGuard`

### `docs`

### `layouts`

- `layouts/default.vue` — Defines the default layout for the application, including navigation, search, footer, and various lazy-loaded modals for authentication, ratings, tracking, and list management.

### `middleware`

- `middleware/auth.global.ts` — Implements a global Nuxt route middleware for client-side authentication, synchronously checking for an access token in localStorage to protect specific routes and redirecting to the homepage with an auth modal if unauthenticated.
  - This middleware is a UX guard only; actual data protection is handled by the backend. It dispatches a 'open-auth-modal' event and sets 'open_auth_modal' in sessionStorage.

### `mixins`

- `mixins/Carousel.js` — Provides a Vue mixin for managing a horizontal carousel, including calculating item positions, handling scroll events, and enabling navigation with buttons.
  - exports: `default`
- `mixins/Details.js` — Provides a Vue mixin with computed properties for displaying detailed information about a media item, including ID, type, name, genres, cast, release years, and media assets.
  - exports: `id`, `type`, `name`, `genres`, `stars`, `yearStart`, `yearEnd`, `poster`, `backdrop`, `cert`, `trailer`
- `mixins/Filters.js` — Provides a Vue mixin with common utility methods for formatting data such as ratings, numbers with commas, runtimes, truncated text, array to list conversions, and full dates.
  - exports: `default`
- `mixins/Functions.js` — Provides utility functions for common tasks like debouncing and checking for local storage support.
  - exports: `debounce`, `supportsLocalStorage`
- `mixins/InfiniteScroll.js` — Provides a Vue mixin for creating CSS-animated infinite horizontal carousels with features like hover/focus pause, manual drag/wheel interaction, and arrow-button seeking.
  - exports: `default`
  - Requires consumer components to define `infiniteDuration` and render specific refs (`viewport`, `track`) with corresponding CSS.

### `pages`

- `pages/auth-success.vue` — Handles post-authentication redirects, displaying loading, success, or error states, and managing the return URL and UI updates.
- `pages/awards/index.vue` — Displays a page for browsing major film awards, allowing users to select an award and year to view winners and nominees.
- `pages/changelog/index.vue` — Displays a changelog page, fetching and rendering release notes directly from the GitHub repository's releases.
- `pages/contact/index.vue` — Provides a contact support form for users to submit inquiries, handling form submission, loading states, and success/error messages.
- `pages/faq/index.vue` — Presents a Frequently Asked Questions page with a table of contents, allowing users to navigate and expand sections for detailed information.
- `pages/festival/bafici-2026/index.vue` — Displays detailed information for the BAFICI 2026 film festival, including films, awards, and schedule, with search and navigation features.
- `pages/festival/berlinale-2026/index.vue` — Displays detailed information for the Berlinale 2026 film festival, including films, awards, and schedule, with search and navigation features.
- `pages/festival/bifff-2026/index.vue` — Displays detailed information for the BIFFF 2026 film festival, including films, awards, and schedule, with search and navigation features.
- `pages/festival/cannes-2026/index.vue` — Displays detailed information for the Cannes Film Festival 2026, including films, awards, and schedule, with search and navigation features.
- `pages/festival/cuff-2026/index.vue` — Vue page component for displaying details of the CUFF 2026 film festival, including films, schedule, and awards, with interactive search and navigation.
- `pages/festival/fantasia-2026/index.vue` — Vue page component for displaying details of the Fantasia International Film Festival 2026, including films, schedule, and awards, with interactive search and navigation.
- `pages/festival/frightfest-2026/index.vue` — Vue page component for displaying details of the FrightFest 2026 film festival, including films and schedule, with interactive search and navigation.
- `pages/festival/kviff-2026/index.vue` — Vue page component for displaying details of the Karlovy Vary International Film Festival 2026, including films, schedule, and awards, with interactive search and navigation.
- `pages/festival/romford-2026/index.vue` — Vue page component for displaying details of the Romford Horror Film Festival 2026, including films, schedule, and awards, with interactive search and navigation.
- `pages/festival/rotterdam-2026/index.vue` — Vue page component for displaying details of the International Film Festival Rotterdam 2026, including films, schedule, and awards, with interactive search and navigation.
- `pages/festival/slamdance-2026/index.vue` — Vue page component for displaying details of the Slamdance Film Festival 2026, including films, schedule, and awards, with interactive search and navigation.
- `pages/festival/sundance-2026/index.vue` — Vue component for displaying details of the Sundance Film Festival 2026, including films, awards, and schedule, with dynamic content loading and mobile responsiveness.
- `pages/festival/sxsw-2026/index.vue` — Vue component for displaying details of the SXSW Film Festival 2026, including films, awards, and schedule, with dynamic content loading and mobile responsiveness.
- `pages/festival/tiff-2026/index.vue` — Vue component for displaying details of the TIFF 2026 festival, including films, awards, and schedule, with dynamic content loading and mobile responsiveness.
- `pages/festival/tribeca-2026/index.vue` — Vue component for displaying details of the Tribeca Film Festival 2026, including films, awards, and schedule, with dynamic content loading and mobile responsiveness.
- `pages/festival/venice-2026/index.vue` — Vue component for displaying details of the Venice Film Festival 2026, including films, awards, and schedule, with dynamic content loading and mobile responsiveness.
- `pages/genre/[id]/movie.vue` — Vue page component that displays a list of movies filtered by a specific genre ID, providing infinite scrolling and dynamic meta-information.
- `pages/genre/[id]/tv.vue` — Vue page component that displays a list of TV shows filtered by a specific genre ID, providing infinite scrolling and dynamic meta-information.
- `pages/index.vue` — Homepage Vue component displaying various carousels for featured content, news, and festival films, along with conditional banners for ongoing events like Oscars and Cannes.
- `pages/lists/[slug].vue` — Displays a single user-created list of movies and TV shows, allowing the owner to manage its details and items, including filtering, sorting, and rating.
- `pages/lists/index.vue` — Displays a user's collection of custom lists, allowing them to create new lists, view existing ones, and manage their privacy settings.
- `pages/login/index.vue` — Serves as the entry point for user authentication, displaying an authentication modal with login and registration options upon mounting.
- `pages/movie/[id].vue` — Displays detailed information for a specific movie, including an overview, credits, videos, images, soundtracks, and awards, with navigation between sections.
- `pages/movie/category/[name].vue` — Displays a paginated list of movies belonging to a specific category (e.g., trending, popular), allowing users to load more items.
- `pages/movie/followed.vue` — Displays movies from production companies and streaming platforms that the user has chosen to follow.
- `pages/movie/index.vue` — Serves as the main discovery page for movies, featuring various categories like popular, top-rated, upcoming, and now playing, along with filters and followed content.
- `pages/news/[slug].vue` — Displays a single news article, including its content, related entities, and options for saving and sharing, with loading and error states.
- `pages/news/index.vue` — Displays a feed of the latest news articles, allowing users to filter by source and category, search, and manage saved articles.
- `pages/noir/index.vue` — Displays the N.O.I.R Archive, a curated collection of historical titles, allowing users to sort them and clone the entire archive into a personal list.
- `pages/notifications/index.vue` — Vue page component for displaying user notifications, allowing filtering by unread status, marking notifications as read/unread, and managing follows for various content types.
- `pages/person/[id].vue` — Vue page component for displaying detailed information about a person, including their known for credits, full filmography, photos, and awards.
- `pages/production-companies/index.vue` — Vue page component that displays a grid of all supported production companies, allowing users to browse and navigate to individual company pages.
- `pages/production/[slug].vue` — Vue page component for displaying details of a specific production company, including its movies and TV shows, with filtering and sorting options.
- `pages/recovery/index.vue` — Vue page component for password recovery, allowing users to enter their email to receive a reset link and providing navigation back to the login page.
- `pages/register/index.vue` — Vue page component that displays an authentication modal pre-set to the registration tab upon being mounted.
- `pages/search/index.vue` — Vue page component for displaying search results based on a query, showing movies, TV shows, people, and news, with loading indicators and pagination.
- `pages/settings/index.vue` — Vue page component for managing user account settings, including avatar, profile information, privacy settings, and account deletion.
- `pages/streaming-services/index.vue` — Vue page component that displays a grid of all supported streaming providers, allowing users to browse and navigate to individual service pages.
- `pages/streaming/[slug].vue` — Displays a streaming platform's details, including its movies and TV shows, with filtering and sorting options.
- `pages/streaming/followed.vue` — Displays a user's followed streaming content, distinguishing between movies and TV shows based on the URL query parameter.
- `pages/tv/[id].vue` — Displays detailed information for a specific TV show, including an overview, cast/crew, episodes, videos, images, soundtracks, and awards.
- `pages/tv/category/[name].vue` — Displays a list of TV shows belonging to a specific category (e.g., trending, popular), with pagination to load more items.
- `pages/tv/followed.vue` — Displays a user's followed TV show content.
- `pages/tv/index.vue` — Serves as the main discovery page for TV shows, featuring popular, top-rated, on-air, and airing today series, along with followed content.
- `pages/u/[alias].vue` — Displays a user's public profile, including their reviews and lists, with options to follow/unfollow the user.
- `pages/usage-policies/index.vue` — Displays the platform's usage policies and privacy agreement, organized into scrollable sections with a table of contents.
- `pages/watchlist/index.vue` — Manages and displays a user's watchlist of movies and TV shows, allowing filtering, sorting, and interaction with saved items.
- `pages/wip/index.vue` — Displays a 'Work in Progress' page, informing users that a section is under maintenance and providing options to return home or get more information.

### `plugins`

- `plugins/bus.js` — Nuxt plugin that provides a global event bus using the mitt library for inter-component communication.
- `plugins/lazyload.js` — Nuxt plugin that registers a 'lazyload' Vue directive to dynamically set the 'src' attribute of an image element.

### `public`

- `public/manifest.json` — Defines the web application manifest for Cinemagoria, providing metadata like name, description, start URL, display mode, theme colors, and icons for PWA installation.
- `public/sw.js` — A self-destroying service worker script designed to unregister itself and refresh all client pages upon activation, ensuring no service worker remains active.
  - This file is explicitly marked as not to be version controlled.

### `scripts`

- `scripts/seed_tribeca_2026_awards.cjs` — One-shot script to seed the `festival_awards` table with 2026 Tribeca Festival feature film award winners, including bilingual fields (EN/ES).
  - Run with `node scripts/seed_tribeca_2026_awards.cjs`.
- `scripts/syncCustomOverrides.js` — Fetches custom title override data from the `title_overrides` Turso database table and writes it to a JSON file for public consumption.
- `scripts/syncHeroData.js` — Retrieves hero selection data from the `hero_selections` Turso database table and saves it as a JSON file for public use.
- `scripts/syncNoirEnrichmentData.js` — Fetches enrichment data for 'noir historical' titles from the `noir_historical` Turso database table and writes it to a JSON file.
- `scripts/syncNoirHistorical.js` — Synchronizes new hero selections into the `noir_historical` Turso database table, optionally fetching Spanish titles from TMDB.

### `server/api`

- `server/api/article-report.post.ts` — Handles POST requests to submit article reports, sanitizing input, validating issue types and locales, and storing the report in the database.
  - Registers a POST route for /api/article-report.
- `server/api/article/[slug].get.ts` — Handles GET requests for a specific article by slug, fetching its details from the database and returning structured data.
  - Registers a GET route for /api/article/[slug].
- `server/api/article/rss.get.ts` — Provides a permanent redirect for the legacy RSS feed endpoint to the canonical /feed URL.
  - Registers a GET route for /api/article/rss, redirecting to /feed.
- `server/api/articles/by-slugs.get.ts` — Handles GET requests to retrieve multiple articles based on a comma-separated list of slugs, returning a filtered and structured list.
  - Registers a GET route for /api/articles/by-slugs.
- `server/api/awards/index-page.get.ts` — Handles GET requests for awards data, filtering by award type and year, and providing lists of available years and categories.
  - Registers a GET route for /api/awards/index-page.
- `server/api/awards/index.get.ts` — Handles GET requests to retrieve award information (Oscars, Golden Globes, festival awards) related to a specific film or person, optionally filtered by type.
  - Registers a GET route for /api/awards/index.
- `server/api/contact.post.ts` — Handles POST requests for the contact form, sanitizing input, validating email, and storing the message in the database.
  - Registers a POST route for /api/contact.
- `server/api/festival-report.post.ts` — Handles POST requests to submit festival reports, sanitizing input, validating issue types and locales, and storing the report in the database.
  - Registers a POST route for /api/festival-report.
- `server/api/festival/bafici/awards.get.ts` — Handles GET requests to fetch awards data specifically for the BAFICI 2026 festival.
  - Registers a GET route for /api/festival/bafici/awards.
- `server/api/festival/bafici/films.get.ts` — API endpoint to fetch BAFICI 2026 film data from the database, optionally filtered by TMDB or IMDb ID, and enhance it with TMDB details.
  - Registers a GET route for /api/festival/bafici/films.
- `server/api/festival/bafici/schedule.get.ts` — API endpoint to retrieve the BAFICI 2026 festival screening schedule, joining film and screening data from the database.
  - Registers a GET route for /api/festival/bafici/schedule.
- `server/api/festival/berlinale/awards.get.ts` — API endpoint to fetch awards data for the Berlinale 2026 film festival.
  - Registers a GET route for /api/festival/berlinale/awards.
- `server/api/festival/berlinale/films.get.ts` — API endpoint to fetch Berlinale 2026 film data from the database, optionally filtered by TMDB or IMDb ID, and enhance it with TMDB details.
  - Registers a GET route for /api/festival/berlinale/films.
- `server/api/festival/berlinale/schedule.get.ts` — API endpoint to retrieve the Berlinale 2026 festival screening schedule, joining film and screening data from the database.
  - Registers a GET route for /api/festival/berlinale/schedule.
- `server/api/festival/bifff/awards.get.ts` — API endpoint to fetch awards data for the BIFFF 2026 film festival.
  - Registers a GET route for /api/festival/bifff/awards.
- `server/api/festival/bifff/films.get.ts` — API endpoint to fetch BIFFF 2026 film data from the database, optionally filtered by TMDB or IMDb ID, and enhance it with TMDB details.
  - Registers a GET route for /api/festival/bifff/films.
- `server/api/festival/bifff/schedule.get.ts` — API endpoint to retrieve the BIFFF 2026 festival screening schedule, joining film and screening data from the database.
  - Registers a GET route for /api/festival/bifff/schedule.
- `server/api/festival/cannes/awards.get.ts` — API endpoint to fetch awards data for the Cannes 2026 film festival.
  - Registers a GET route for /api/festival/cannes/awards.
- `server/api/festival/cannes/films.get.ts` — API endpoint to fetch Cannes 2026 film data from the database, optionally filtered by TMDB or IMDb ID, and enhance it with TMDB details.
  - Registers a GET route for /api/festival/cannes/films.
- `server/api/festival/cannes/schedule.get.ts` — API endpoint to retrieve the 2026 Cannes Film Festival screening schedule, including film details and screening information from the database.
  - Registers a GET route for /api/festival/cannes/schedule.
- `server/api/festival/cuff/awards.get.ts` — API endpoint to fetch the awards for the 2026 Calgary Underground Film Festival (CUFF) using a shared utility function.
  - Registers a GET route for /api/festival/cuff/awards.
- `server/api/festival/cuff/films.get.ts` — API endpoint to retrieve films for the 2026 Calgary Underground Film Festival (CUFF), supporting filtering by TMDB or IMDb ID.
  - Registers a GET route for /api/festival/cuff/films.
- `server/api/festival/cuff/schedule.get.ts` — API endpoint to retrieve the 2026 Calgary Underground Film Festival (CUFF) screening schedule, including film details and screening information.
  - Registers a GET route for /api/festival/cuff/schedule.
- `server/api/festival/fantasia/awards.get.ts` — API endpoint to fetch the awards for the 2026 Fantasia International Film Festival using a shared utility function.
  - Registers a GET route for /api/festival/fantasia/awards.
- `server/api/festival/fantasia/films.get.ts` — API endpoint to retrieve films for the 2026 Fantasia International Film Festival, supporting filtering by TMDB or IMDb ID.
  - Registers a GET route for /api/festival/fantasia/films.
- `server/api/festival/fantasia/schedule.get.ts` — API endpoint to retrieve the 2026 Fantasia International Film Festival screening schedule, including film details and screening information.
  - Registers a GET route for /api/festival/fantasia/schedule.
- `server/api/festival/films-batch.get.ts` — API endpoint to fetch films for multiple festivals in a single request, supporting filtering, limiting, and a slimmed-down field projection for cards.
  - Registers a GET route for /api/festival/films-batch.
- `server/api/festival/frightfest/films.get.ts` — API endpoint to retrieve films for the 2026 FrightFest, supporting filtering by TMDB or IMDb ID.
  - Registers a GET route for /api/festival/frightfest/films.
- `server/api/festival/frightfest/schedule.get.ts` — API endpoint to retrieve the schedule of film screenings for the FrightFest festival in 2026, including film details and screening information.
- `server/api/festival/kviff/awards.get.ts` — API endpoint to fetch the awards for the Karlovy Vary International Film Festival (KVIFF) for the year 2026.
- `server/api/festival/kviff/films.get.ts` — API endpoint to retrieve a list of films for the Karlovy Vary International Film Festival (KVIFF) 2026, with optional filtering by TMDB or IMDb ID.
- `server/api/festival/kviff/schedule.get.ts` — API endpoint to retrieve the schedule of film screenings for the Karlovy Vary International Film Festival (KVIFF) in 2026, including film details and screening information.
- `server/api/festival/romford/awards.get.ts` — API endpoint to fetch the awards for the Romford Horror Festival for the year 2026.
- `server/api/festival/romford/films.get.ts` — API endpoint to retrieve a list of films for the Romford Horror Festival 2026, with optional filtering by TMDB or IMDb ID.
- `server/api/festival/romford/schedule.get.ts` — API endpoint to retrieve the schedule of film screenings for the Romford Horror Festival in 2026, including film details and screening information.
- `server/api/festival/rotterdam/awards.get.ts` — API endpoint to fetch the awards for the Rotterdam Film Festival for the year 2026.
- `server/api/festival/rotterdam/films.get.ts` — API endpoint to retrieve a list of films for the Rotterdam Film Festival 2026, with optional filtering by TMDB or IMDb ID and sorting.
- `server/api/festival/rotterdam/schedule.get.ts` — API endpoint to retrieve the schedule of film screenings for the Rotterdam Film Festival in 2026, including film details and screening information.
- `server/api/festival/slamdance/awards.get.ts` — API endpoint to fetch the awards for the Slamdance Film Festival for the year 2026.
- `server/api/festival/slamdance/films.get.ts` — API endpoint to retrieve a list of films for the Slamdance Film Festival 2026, with optional filtering by TMDB or IMDb ID.
- `server/api/festival/slamdance/schedule.get.ts` — API endpoint to retrieve the 2026 Slamdance Film Festival screening schedule, including film details and screening information from the database.
  - exports: `default`
- `server/api/festival/status.get.ts` — API endpoint to fetch festival status badges for a given TMDb ID and year, providing a client-side fallback for festival membership information.
  - exports: `default`
- `server/api/festival/sundance/awards.get.ts` — API endpoint to fetch the awards for the 2026 Sundance Film Festival.
  - exports: `default`
- `server/api/festival/sundance/films.get.ts` — API endpoint to retrieve films for the 2026 Sundance Film Festival, supporting filtering by TMDb/IMDb ID and sorting by rating or title.
  - exports: `default`
- `server/api/festival/sundance/schedule.get.ts` — API endpoint to retrieve the 2026 Sundance Film Festival screening schedule, including film details and screening information from the database.
  - exports: `default`
- `server/api/festival/sxsw/awards.get.ts` — API endpoint to fetch the awards for the 2026 SXSW Film & TV Festival.
  - exports: `default`
- `server/api/festival/sxsw/films.get.ts` — API endpoint to retrieve films for the 2026 SXSW Film & TV Festival, supporting filtering by TMDb/IMDb ID and sorting by rating or title.
  - exports: `default`
- `server/api/festival/sxsw/schedule.get.ts` — API endpoint to retrieve the 2026 SXSW Film & TV Festival screening schedule, including film details and screening information from the database.
  - exports: `default`
- `server/api/festival/tiff/awards.get.ts` — API endpoint to fetch the awards for the 2026 Toronto International Film Festival (TIFF).
  - exports: `default`
- `server/api/festival/tiff/films.get.ts` — API endpoint to retrieve films for the 2026 Toronto International Film Festival (TIFF), supporting filtering by TMDb/IMDb ID.
  - exports: `default`
- `server/api/festival/tiff/schedule.get.ts` — API endpoint to retrieve the 2026 Toronto International Film Festival (TIFF) screening schedule, including film details and screening information from the database.
  - exports: `default`
- `server/api/festival/tribeca/awards.get.ts` — API endpoint to fetch the awards for the 2026 Tribeca Film Festival.
  - exports: `default`
- `server/api/festival/tribeca/films.get.ts` — Handles GET requests to retrieve a list of films from the Tribeca Festival for the year 2026, with optional filtering by TMDB or IMDb ID and result limiting.
- `server/api/festival/tribeca/schedule.get.ts` — Handles GET requests to retrieve the screening schedule for the Tribeca Festival 2026, joining film and screening data.
- `server/api/festival/venice/awards.get.ts` — Handles GET requests to fetch awards data for the Venice Film Festival 2026.
- `server/api/festival/venice/films.get.ts` — Handles GET requests to retrieve a list of films from the Venice Film Festival for the year 2026, with optional filtering by TMDB or IMDb ID and result limiting.
- `server/api/festival/venice/schedule.get.ts` — Handles GET requests to retrieve the screening schedule for the Venice Film Festival 2026, joining film and screening data.
- `server/api/hero.get.ts` — Handles GET requests to retrieve a randomized selection of hero items (movies/TV shows) from the database, enriching them with festival membership status.
- `server/api/imdb-rating/[id].get.ts` — Handles GET requests to retrieve IMDb ratings and vote counts for a given IMDb ID from a Turso database, with CORS and caching headers.
  - Registers route /imdb-rating/:id
- `server/api/news.get.ts` — Handles GET requests to retrieve news articles, supporting pagination, language filtering, source filtering, and search queries.
- `server/api/noir-archive.get.ts` — Handles GET requests to retrieve a list of historical noir films and TV shows from a Turso database, ordered by release date.
- `server/api/progress/[userId]/[mediaType]/[mediaId].delete.ts` — Handles DELETE requests to remove a user's progress tracking entry for a specific media item (movie or episode).
  - Registers route /progress/:userId/:mediaType/:mediaId
- `server/api/progress/[userId]/[mediaType]/[mediaId].get.ts` — Handles GET requests to retrieve a user's progress tracking data for a specific media item (movie or episode).
  - Registers route /progress/:userId/:mediaType/:mediaId
- `server/api/progress/[userId]/[mediaType]/[mediaId].put.ts` — Handles PUT requests to update a user's progress for a specific movie or episode, including percentage, elapsed time, and TV series specific details.
- `server/api/progress/[userId]/active/[mediaType]/[mediaId].put.ts` — Handles PUT requests to update the 'manually_active' flag for a user's progress entry for a specific movie or episode.
- `server/api/progress/[userId]/batch.put.ts` — Handles PUT requests to batch update progress for multiple episodes for a given user, setting a specified percentage.
- `server/api/progress/[userId]/hydrated.get.ts` — Fetches a user's progress tracking data and enriches it with details from TMDB, caching results to optimize performance.
- `server/api/progress/[userId]/index.get.ts` — Handles GET requests to retrieve a list of all progress tracking entries for a specific user, ordered by the last update.
- `server/api/search-log.post.ts` — Handles POST requests to log user search queries, optionally including origin IP and email for analytics, to a separate database.
- `server/api/search/person.get.ts` — Handles GET requests to search for people using the TMDB API based on a provided query parameter.
- `server/api/spotlight/[type].get.ts` — Handles GET requests to retrieve curated spotlight content (movies or TV shows) from the database, formatting the results.

### `server/data`

- `server/data/awards.json` (config)

### `server/middleware`

- `server/middleware/logger.ts` — Defines a Nuxt event handler for logging, currently disabled but safely implemented as a no-op.
- `server/middleware/redirect-at.ts` — Nuxt event handler that redirects URLs starting with '/@username' to '/u/username' using a 301 permanent redirect.

### `server/plugins`

- `server/plugins/strip-cookies-cacheable.ts` — Nitro plugin to strip Set-Cookie headers and clean the Vary header from responses on public cacheable routes, enabling Cloudflare caching for SSR HTML.

### `server/routes`

- `server/routes/feed.get.ts` — Handles the GET request for the public RSS news feed, generating XML content using the buildNewsFeed utility and setting appropriate headers for caching and content type.
  - exports: `default`
  - Registers the route /feed for the English news feed.
- `server/routes/sitemap-news.xml.ts` — Generates an XML sitemap for news articles by querying a Turso database for visible articles and formatting their slugs and publication dates into sitemap entries.
  - exports: `default`
  - Registers the route /sitemap-news.xml. Sets content-type to application/xml and cache-control headers.
- `server/routes/sitemap-static.xml.ts` — Generates an XML sitemap containing static pages, genre pages, streaming provider pages, production company pages, and festival pages for the Cinemagoria website.
  - exports: `default`
  - Registers the route /sitemap-static.xml. Sets content-type to application/xml and cache-control headers.
- `server/routes/sitemap.xml.ts` — Generates the main sitemap index XML file, referencing the static and news sitemaps, while explicitly excluding dynamic sitemaps for movies, TV, and persons.
  - exports: `default`
  - Registers the route /sitemap.xml. Excludes dynamic sitemaps to optimize Google's crawl budget for unique content.

### `server/types`

- `server/types/markdown-it.d.ts` — Provides minimal ambient type declarations for the 'markdown-it' library, specifically for the MarkdownIt class and its options, to support server-side feed building.
  - exports: `MarkdownIt`

### `server/utils`

- `server/utils/db.ts` — Provides a singleton database client for Turso/libSQL and a utility function for executing queries with a timeout, handling database configuration and errors.
  - exports: `useDb`, `dbExecute`
- `server/utils/rss-feed.ts` — Constructs an RSS news feed, fetching article data from the database, processing Markdown, and embedding Vimeo oEmbed data, with support for English and Spanish languages.
  - exports: `buildNewsFeed`
  - This file is designed to be byte-identical between cinemagoria-main and cinemagoria-es, with language passed as a parameter.
- `server/utils/vimeo-oembed.ts` — Fetches and caches Vimeo oEmbed metadata (like thumbnail URLs) for video IDs, providing a server-side cache to reduce external API calls.
  - exports: `getVimeoOembed`, `getVimeoThumb`
  - This file is designed to be byte-identical between cinemagoria-main and cinemagoria-es.
- `server/utils/festivalAwards.ts` — Fetches festival award data from the database for a given festival slug, supporting English and Spanish locales with fallback to English for missing translations.
  - exports: `fetchFestivalAwards`
- `server/utils/festivals.ts` — Manages canonical festival name-to-slug mappings and provides a function to retrieve festival participation status for a batch of TMDb IDs.
  - exports: `FESTIVAL_NAME_BY_SLUG`, `NAME_TO_SLUG`, `getFestivalStatusByTmdbId`
- `server/utils/sitemap-helpers.ts` — Provides utilities for fetching movie/TV show IDs from TMDb API across multiple pages and generating an XML sitemap string from a list of IDs.
  - exports: `fetchTmdbPages`, `buildSitemapXml`

### `services`

- `services/turso.js` — Initializes and exports a Turso database client using environment variables, logging an error if required variables are missing.
  - exports: `default`
  - Exports null if IMDB_DB_URL or IMDB_DB_TOKEN environment variables are not set.
- `services/userSync.js` — Provides a function to synchronize user data to a Turso backend API endpoint, handling network requests and error logging.
  - exports: `syncUserToTurso`

### `stores`

- `stores/consent.js` — Manages user cookie consent preferences, including loading from/saving to local storage, handling legacy consent, and providing methods to accept/decline all or customize preferences.
  - exports: `useConsentStore`
- `stores/search.js` — Manages the state of the search overlay, including its visibility and the page from which it was opened, providing actions to control these states.
  - exports: `useSearchStore`

### `types`

- `types/database.types.ts` — Defines core database types, including a recursive `Json` type for flexible data structures and an empty `Database` interface for public schema tables, views, functions, and enums.
  - exports: `Json`, `Database`

### `utils`

- `utils/api.js` — Provides an Axios-like API client for making HTTP requests to TMDB and internal APIs, including methods for fetching movie/TV data, enrichment, and IMDb ratings.
  - exports: `apiImgUrl`, `EXCLUDED_MOVIE_IDS`, `EXCLUDED_TV_IDS`, `getHeroEnrichment`, `getNoirEnrichment`, `getCustomEnrichment`, `resolveItemPoster`, `languages`, `getListItem`, `getIMDbRatingFromDB`, `getMovies`
- `utils/categoryLabels.js` — Defines English display labels for editorial taxonomy categories and provides a utility function to retrieve a label based on a category token.
  - exports: `CATEGORY_LABELS`, `categoryLabel`
- `utils/countries.js` — Exports a list of countries with their ISO 3166-1 alpha-2 codes and names.
  - exports: `countries`
- `utils/helpers.js` — Provides utility functions for formatting dates, handling image loading errors, and determining the release status context of a media item.
  - exports: `formatDate`, `handleImageError`, `getReleaseStatusContext`
- `utils/itemMapper.js` — Maps an item object (e.g., from an API response) to a standardized payload format suitable for database storage, inferring missing fields.
  - exports: `mapItemToDbPayload`
- `utils/membershipStore.js` — Manages a session-wide cache for user membership data (watchlist and custom lists) to reduce API requests and optimize performance.
  - exports: `invalidateMembershipCache`, `getMembership`
- `utils/musicbrainz.js` — Provides functions to search for soundtracks and retrieve album tracks using the MusicBrainz API.
  - exports: `searchSoundtracks`, `getAlbumTracks`, `getMusicBrainzUrl`
- `utils/newsSources.js` — Defines lists of English news sources and their corresponding URLs.
  - exports: `SOURCES`, `SOURCE_URLS`
- `utils/relatedFooter.js` — Provides utilities to strip 'Related Articles' footers from article bodies and extract slugs from related article links within those footers.
  - exports: `stripRelatedFooter`, `extractRelatedSlugs`
- `utils/resolvePhase.js` — An intentionally empty file marked as deprecated, previously used for phase resolution logic that has since been moved to a backend cron job.
  - DEPRECATED: This file is no longer used and will be removed. Do not use its contents.

## Dependency Edges

| From | To | Imports |
| :--- | :--- | ---: |
| `server/api` | `server/data` | 2 |
| `server/routes` | `server/utils` | 1 |

## External Packages (imported in code)

- `~` (415 imports)
- `~~` (55 imports)
- `h3` (50 imports)
- `vue` (44 imports)
- `@/components` (27 imports)
- `@libsql/client` (16 imports)
- `vue-router` (9 imports)
- `@/utils` (4 imports)
- `fs` (4 imports)
- `path` (4 imports)
- `pinia` (4 imports)
- `striptags` (4 imports)
- `url` (4 imports)
- `#imports` (3 imports)
- `dotenv` (3 imports)
- `markdown-it` (3 imports)
- `axios` (2 imports)
- `dompurify` (2 imports)
- `#app` (1 import)
- `mitt` (1 import)
- `My Cannes` (1 import)
- `smoothscroll-polyfill` (1 import)
- `tiny-cookie` (1 import)
