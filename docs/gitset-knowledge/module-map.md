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

- `app.vue` — Defines the main Vue application layout and injects structured data (Schema.org JSON-LD) for the Cinemagoria organization and website into the document head.
- `cloudbuild.yaml` — Configures Google Cloud Build to automate the Docker image build, push to Artifact Registry, and deployment to Cloud Run for the Cinemagoria application.
  - Deploys to Cloud Run service 'cinemagoria-main' in 'us-east1'.
- `Dockerfile` — Defines the multi-stage Docker build process for the Cinemagoria Nuxt application, including dependency installation, build, and a lean production runtime.
  - Uses a pinned Node.js 22-slim image to avoid a specific `node-fetch` v2 gzip issue with `@libsql/client`.
- `nuxt.config.ts` — Configures the Nuxt.js application, including path aliases, devtools settings, debug mode, and route-specific caching headers for sitemaps and RSS feeds.
  - exports: `default`
  - Configures cache-control headers for '/sitemap.xml', '/sitemap-static.xml', '/sitemap-news.xml', and '/feed'.
- `package.json` — Manages project metadata, scripts for development and build, and defines all direct and transitive dependencies and their resolutions for the Cinemagoria application.
  - Includes scripts: `build`, `dev`, `generate`, `preview`, `postinstall`.
- `tsconfig.json` — Configures TypeScript for the Nuxt.js project by referencing auto-generated tsconfig files for app, server, shared, and node environments.

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

- `components/global/GoogleLogin.vue` — Provides a 'Sign in with Google' button component that handles the Google OAuth login flow, including UI states for loading and error handling.
- `components/global/UserNav.vue` — Displays user navigation elements, including a notifications button with an unread count, user avatar, and a dropdown menu with profile links and logout functionality.
- `components/BaficiCard.vue` — Displays a card component for BAFICI festival entries, including an image, title, and quick actions like opening the official festival page and favoriting.
- `components/BerlinaleCard.vue` — Displays a card component for Berlinale festival entries, including an image, title, and quick actions like opening the official festival page and favoriting.
- `components/BifanCard.vue` — Displays a card component for Bifan festival entries, including an image, title, and quick actions like opening the official festival page and favoriting.
- `components/BifffCard.vue` — Displays a card component for BIFFF festival entries, including an image, title, and quick actions like opening the official festival page and favoriting.
- `components/calendar/CalendarEntry.vue` — Renders a single entry in the calendar, displaying its poster, title, type, year, and any associated notes or country flags.
- `components/calendar/CalendarScopeModal.vue` — Provides a modal dialog explaining the scope and curated nature of the calendar feature, including an early access notice.
- `components/CannesCard.vue` — Displays a card component for Cannes festival entries, including an image, title, and quick actions like opening the official festival page and favoriting.
- `components/CannesLiveBanner.vue` — Displays a promotional banner for the Cannes 2026 festival, encouraging users to explore its coverage.
- `components/CannesWinnersBanner.vue` — Displays a promotional banner for the Cannes 2026 winners, encouraging users to explore the palmarès.
- `components/Card.vue` — A generic card component for displaying various media types (movies, TV, people, productions, festivals, streaming), including an image, title, and quick actions.
- `components/common/AwardsTab.vue` — Displays a tabbed view of awards for a given entity (movie, TV show, or person), including Oscars, Golden Globes, Palme d'Or, Golden Lion, and Golden Bear.
- `components/common/FullCreditsModal.vue` — Provides a modal dialog to display the full cast and crew credits for a movie or TV show, organized by department, with collapsible sections.
- `components/common/MediaProgressBar.vue` — Displays a circular progress bar and a slider to indicate viewing progress for media, showing elapsed time and total duration.
- `components/Credits.vue` — Renders a horizontal carousel of cast members, allowing users to scroll through and view individual credit items.
- `components/CreditsItem.vue` — Displays an individual cast or crew member's item within a carousel, including their image, name, and character/role, with a loading state.
- `components/CuffCard.vue` — Renders a card component for media items, displaying an image, title, and quick actions like adding to a list or opening an external link.
- `components/discover/DiscoverHub.vue` — Serves as the main hub for content discovery, allowing users to switch between movie and TV show catalogues and view curated content rows.
- `components/discover/DiscoverPanel.vue` — Provides a filtering and sorting panel for the discover catalogue, allowing users to refine search results by genre, sort order, and other criteria.
- `components/discover/DiscoverResults.vue` — Displays search results from the discover catalogue in a grid format, including loading skeletons, error states, and a 'load more' functionality.
- `components/discover/FilterSelect.vue` — A reusable select component for filtering options, supporting search, keyboard navigation, and dynamic positioning within the viewport.
- `components/discover/GenreGrid.vue` — Displays a grid of genre tiles, each linking to a specific genre's catalogue page for either movies or TV shows.
- `components/DynamicSearchCarousel.vue` — Vue component for a dynamic, scrollable carousel displaying search results or items, with navigation buttons and a customizable title.
- `components/ExternalLinks.vue` — Vue component that displays a grid of external links for a movie or TV show, including IMDb, Rotten Tomatoes, Letterboxd, Trakt, and TMDb.
- `components/FantasiaCard.vue` — Vue component representing a card for a Fantasia festival item, displaying an image, quick actions like favoriting, and a link to its details or external source.
- `components/FantasiaLiveBanner.vue` — Vue component for a promotional banner for the Fantasia 2026 festival, featuring a logo, background effects, and a link to the festival coverage page.
- `components/FeatureDescription.vue` — Vue component displaying a prominent, stylized feature description with a main title and a subtitle, using custom fonts and cinematic light effects.
- `components/festival/BaficiBadge.vue` — Vue component displaying the BAFICI 2026 film festival logo as a badge, with hover effects and responsive styling.
- `components/festival/BerlinaleBadge.vue` — Vue component displaying the Berlinale Film Festival 2026 logo as a badge, with hover effects and responsive styling.
- `components/festival/BifanBadge.vue` — Vue component displaying the BIFAN 2026 film festival logo as a badge, with hover effects and responsive styling.
- `components/festival/BifffBadge.vue` — Vue component displaying the BIFFF 2026 film festival logo as a badge, with hover effects and responsive styling.
- `components/festival/CannesAcidBadge.vue` — Vue component displaying the Cannes Film Festival 2026 – ACID section logo as a badge, with hover effects and responsive styling.
- `components/festival/CannesBadge.vue` — Vue component displaying the Cannes Film Festival 2026 logo as a badge, with hover effects and responsive styling.
- `components/festival/CannesCriticsChoiceBadge.vue` — Vue component displaying the Cannes Film Festival 2026 – Critics' Choice section logo as a badge, with hover effects and responsive styling.
- `components/festival/CannesQuinzaineBadge.vue` — Vue component displaying the Cannes Film Festival 2026 – Quinzaine des Cinéastes section logo as a badge, with hover effects and responsive styling.
- `components/festival/CuffBadge.vue` — Vue component displaying the Calgary Underground Film Festival 2026 logo as a badge, with hover effects and responsive styling.
- `components/festival/FantasiaBadge.vue` — Vue component displaying the Fantasia International Film Festival 2026 logo as a badge, with hover effects and responsive styling.
- `components/festival/FrightfestBadge.vue` — Vue component displaying the FrightFest 2026 film festival logo as a badge, with hover effects and responsive styling.
- `components/festival/KviffBadge.vue` — Vue component displaying the Karlovy Vary International Film Festival 2026 logo as a badge, with hover effects and responsive styling.
- `components/festival/LocarnoBadge.vue` — Vue component displaying the Locarno Film Festival 2026 logo as a badge, with hover effects and responsive styling.
- `components/festival/RomfordBadge.vue` — Vue component displaying the Romford Horror Film Festival 2026 logo as a badge, with hover effects and responsive styling.
- `components/festival/RotterdamBadge.vue` — Vue component displaying the Rotterdam Film Festival 2026 logo as a badge, with hover effects and responsive styling.
- `components/festival/SlamdanceBadge.vue` — Vue component displaying the Slamdance Film Festival 2026 logo as a badge, with hover effects and responsive styling.
- `components/festival/SundanceBadge.vue` — Displays a stylized Sundance Film Festival 2026 logo badge with hover effects, intended for use as a clickable link or informational graphic.
- `components/festival/SxswBadge.vue` — Displays a stylized SXSW Film & TV Festival 2026 logo badge with hover effects, intended for use as a clickable link or informational graphic.
- `components/festival/SxswCard.vue` — A Vue component representing a card for an SXSW festival item, including a link, actions, an image, and an external link button.
- `components/festival/TiffBadge.vue` — Displays a stylized TIFF 2026 logo badge with hover effects, intended for use as a clickable link or informational graphic.
- `components/festival/TribecaBadge.vue` — Displays a stylized Tribeca Festival 2026 logo badge with hover effects, intended for use as a clickable link or informational graphic.
- `components/festival/VeniceBadge.vue` — Displays a stylized Venice Film Festival 2026 logo badge with hover effects, intended for use as a clickable link or informational graphic.
- `components/festival/WinnersCarousel.vue` — A Vue component that displays a carousel of festival winners, grouped by category, with navigation controls and poster images.
- `components/FestivalDataDisclaimer.vue` — A Vue component that provides a disclaimer about festival data coverage and allows users to report missing films via a modal form.
- `components/FestivalsCarousel.vue` — A Vue component that displays a horizontal carousel of festival cards, with optional title, 'explore all' link, and navigation buttons.
- `components/FestivalsRotatingBanner.vue` — A Vue component that displays a rotating banner for active festivals, linking to their respective coverage pages.
- `components/FollowedContent.vue` — A Vue component that displays followed content (movies/TV shows) from streaming platforms or production companies, with filtering and sorting options.
- `components/FrightfestCard.vue` — A Vue component representing a card for a Frightfest festival item, including a link, actions, an image, and an external link button.
- `components/global/ArticleAIDisclosure.vue` — A Vue component that displays a disclosure indicating an article was AI-generated and provides a button to report errors via a modal form.
- `components/global/ArticleShareModal.vue` — A Vue component for sharing articles, providing options to copy the link, share via native OS share, or share to various social media platforms.
- `components/global/AuthModal.vue` — A Vue component for user authentication, providing tabs for signing in and registering, with options for email/password and social logins.
- `components/global/CardActions.vue` — A Vue component that provides a dropdown menu of actions for a content card, such as rating, adding to lists, or marking as watched.
- `components/global/CookieConsent.vue` — Provides a global cookie consent banner and preferences panel, allowing users to manage their cookie settings.
- `components/global/CreateListModal.vue` — Displays a modal for users to create new movie/TV show lists, handling form submission and API interaction with Supabase and a Turso backend.
- `components/global/FollowingModal.vue` — Manages and displays a modal for users to view and manage the people, TV shows, production companies, and streaming services they follow.
- `components/global/Footer.vue` — Renders the global footer component, including navigation links, social media icons, and a copyright notice.
- `components/global/InstallPrompt.vue` — Displays a prompt to the user to install the web application to their home screen, managing the installation event and user choice.
- `components/global/MyListsModal.vue` — Provides a modal for users to manage their custom lists, including adding or moving items between lists, and handling list creation/deletion.
- `components/global/Nav.vue` — Implements the main navigation bar for the application, providing links to different sections and displaying user-specific lists.
- `components/global/NewsCarousel.vue` — Displays a carousel of the latest news articles, fetching data from an API and providing navigation controls.
- `components/global/ProgressTrackingModal.vue` — Manages and displays a modal for users to track their watch progress for movies and TV shows, including episode-level tracking.
- `components/global/QuickFav.vue` — Provides a quick favorite button component that allows users to add or manage an item in their lists, opening a modal for list selection.
- `components/global/QuickFavModal.vue` — Provides a modal dialog for confirming the removal of an item from a user's watchlist, interacting with a Turso backend API.
- `components/global/RatedModal.vue` — Displays a modal for users to view and manage their rated movies and TV shows, including editing ratings and reviews.
- `components/global/RelatedArticlesCarousel.vue` — Renders a horizontal carousel of related articles, fetching data asynchronously and providing navigation controls.
- `components/global/SearchForm.vue` — Implements a search input form with debouncing, displaying search results and trending items, and handling user authentication.
- `components/global/TopNav.vue` — Renders a fixed top navigation bar component that displays a title, primarily for smaller screen sizes.
- `components/Hero.vue` — Displays a dynamic hero section with a carousel of items, including details, ratings, and related articles, with auto-advance functionality.
- `components/HowItWorksModal.vue` — Presents a modal explaining how release alerts work, featuring an introductory text and a carousel for visual explanation.
- `components/Images.vue` — Displays a gallery of images (posters or backdrops) with a title and count, allowing users to open a full-screen modal view.
- `components/ImagesItem.vue` — Renders an individual image item within a gallery, displaying a thumbnail and handling loading states and modal interactions.
- `components/KviffCard.vue` — Displays a card for a KVIFF festival item, including an image, quick actions like favoriting and external links, and a loader for image loading states.
- `components/KviffLiveBanner.vue` — Provides a promotional banner for the KVIFF 2026 festival, featuring a background gradient, a festival logo, and a call to action.
- `components/Listing.vue` — Renders a list of items, typically cards, with an optional title and a 'View All' link, supporting infinite scrolling to load more items.
- `components/ListingCarousel.vue` — Displays a horizontal carousel of items, typically cards, with navigation buttons, an optional title, and a 'View All' link, supporting compact mode.
- `components/Loader.vue` — A reusable SVG-based loading spinner component with customizable size and color.
- `components/LocarnoCard.vue` — Displays a card for a Locarno festival item, including an image, quick actions like favoriting and external links, and a loader for image loading states.
- `components/MediaNav.vue` — Provides a navigation component with a list of buttons, allowing users to switch between different media categories or tabs.
- `components/Modal.vue` — A generic modal component that can display images, iframes, or custom content, with navigation for multiple items and accessibility features.
- `components/movie/MovieInfo.vue` — Displays detailed information about a movie, including its poster, overview, cast, crew, awards, and external links.
- `components/movie/MovieReleases.vue` — Displays a list of movie release dates grouped by country, including country flags and release details.
- `components/music/SoundtrackGroup.vue` — Organizes and displays a group of soundtrack items, typically by year, within a larger list.
- `components/music/SoundtrackItem.vue` — Displays a single soundtrack item, including its title, disambiguation, and artist, with a link to its MusicBrainz page.
- `components/music/SoundtrackList.vue` — Displays a list of soundtrack tracks for a selected album, including album details and a play icon to open YouTube for each track.
- `components/NoirModal.vue` — Presents a modal dialog for the 'Nothing Out Is Ready' (N.O.I.R) initiative, featuring a logo, subtitle, descriptive text, and a button to show a manifesto.
- `components/OscarsCarousel.vue` — Displays a horizontal carousel for the 98th Academy Awards, featuring a section header, navigation buttons, and individual award nominee cards.
- `components/OscarsLiveBanner.vue` — Provides a banner for the 98th Academy Awards, indicating live coverage or results, with a statuette image, title, and a scrolling ticker for updates.
- `components/person/CreditsHistory.vue` — Displays a person's credit history, allowing filtering by department and media type (combined, movie, or TV) and grouping credits by year.
- `components/person/CreditsHistoryGroup.vue` — Renders a group of credits for a person, typically organized by year, displaying the year and a list of individual credit items.
- `components/person/CreditsHistoryItem.vue` — Displays a single credit item for a person, including the title of the work, episode count (if applicable), and the person's role, with a link to the media.
- `components/person/PersonAwardsTab.vue` — Displays a person's awards history, categorized by award type (Oscars, Golden Globes, Palme d'Or, Golden Lion, Golden Bear) in sortable tables.
- `components/person/PersonInfo.vue` — Displays detailed information about a person, including their avatar, name, biography, known for department, birthplace, and awards summary.
- `components/ProductionCompanyCarousel.vue` — Displays a horizontal carousel of popular production companies, allowing users to scroll through them and navigate to individual company pages.
- `components/ProductionHero.vue` — Displays a hero section for a production company, featuring its logo, name, country, headquarters, description, and a follow/unfollow button.
- `components/RomfordCard.vue` — Vue component displaying a film or festival item card with Romford Film Festival branding, including an image, quick actions like favoriting, and a link to its detail page or external source.
- `components/RotterdamCard.vue` — Vue component displaying a film or festival item card with Rotterdam Film Festival branding, including an image, quick actions like favoriting, and a link to its detail page or external source.
- `components/search/CategoryCarousel.vue` — Vue component for a horizontal carousel displaying items within a search category, with navigation buttons and a collapsible header.
- `components/search/CategorySection.vue` — Vue component that displays a collapsible section of search results for a specific category, rendering each item using a `Card` component.
- `components/search/DiscoverSearch.vue` — Vue component providing a comprehensive discovery interface for movies and TV shows, allowing users to filter by genre, sort options, country, network, language, streaming provider, and vote count.
- `components/search/NewsResultCard.vue` — Vue component displaying a single news article card with an image, title, description, publication date, and a badge indicating its source or editorial category, linking to the full article.
- `components/search/SearchGuideModal.vue` — Vue component for a modal dialog that provides a guide on how to use the search functionalities within Cinemagoria, detailing different search types and features.
- `components/search/SearchResults.vue` — Vue component that displays various types of search results, including movies, TV shows, people, festivals, productions, streaming services, and news articles, with loading indicators and typo checking.
- `components/SlamdanceCard.vue` — Vue component displaying a film or festival item card with Slamdance Film Festival branding, including an image, quick actions like favoriting, and a link to its detail page or external source.
- `components/SpotlightCarousel.vue` — Vue component for a horizontal carousel displaying spotlight items, typically used for featured content, with navigation buttons and an optional 'Explore All' link.
- `components/StreamingPlatformCarousel.vue` — Displays a carousel of popular streaming services, allowing users to navigate through them and explore all available platforms.
- `components/StreamingPlatformHero.vue` — Renders a hero section for a streaming platform, displaying its name, logo, and a follow/unfollow button with authentication handling.
- `components/SundanceCard.vue` — Displays a card for a Sundance Film Festival entry, including an image, actions, and a link to its official page.
- `components/TiffCard.vue` — Displays a card for a TIFF (Toronto International Film Festival) entry, including an image, actions, and a link to its official page.
- `components/TribecaCard.vue` — Displays a card for a Tribeca Film Festival entry, including an image, actions, and a link to its official page.
- `components/TribecaLiveBanner.vue` — Provides a banner component for the Tribeca 2026 festival, linking to its coverage page and featuring a distinct visual style.
- `components/tv/Episodes.vue` — Manages and displays a list of TV show episodes, allowing users to select seasons and mark episodes/seasons as watched.
- `components/tv/EpisodesItem.vue` — Renders an individual TV episode item, showing its poster, name, and providing a progress tracking feature with a modal.
- `components/tv/TvInfo.vue` — Displays detailed information about a TV show, including its poster, overview, cast, crew, and related content.
- `components/VeniceCard.vue` — Displays a card for a Venice Film Festival entry, including an image, actions, and a link to its official page.
- `components/Videos.vue` — Vue component that displays a list of videos, allows filtering by type, and opens a modal to play selected videos, fetching YouTube video details on creation.
- `components/VideosItem.vue` — Vue component for displaying a single video item with its thumbnail, name, type, and duration, emitting an event to open a modal when clicked.
- `components/WatchOn.vue` — Vue component that displays a list of streaming providers for a given media item, allowing users to click through to watch content.
- `components/YearPicker.vue` — Vue component providing a dropdown for selecting a release year, ranging from a minimum year up to the current year, and emits the selected value.

### `composables`

- `composables/useConsentGuard.js` — Provides a Vue composable to conditionally execute a callback based on user consent for a specific category, re-evaluating on consent changes.
  - exports: `useConsentGuard`
- `composables/useCuratedRows.js` — A Vue composable that fetches and organizes curated movie or TV show rows based on predefined queries, handling potential API errors.
  - exports: `useCuratedRows`
- `composables/useDiscoverQuery.js` — A Vue composable for managing and executing discovery queries for movies or TV shows, including filtering, sorting, and pagination logic.
  - exports: `useDiscoverQuery`

### `docs`

### `layouts`

- `layouts/default.vue` — Defines the default layout for the application, including global navigation, search, footer, and various lazy-loaded modals, structuring the main content area.

### `middleware`

- `middleware/auth.global.ts` — Implements a global Nuxt route middleware for client-side authentication, blocking navigation to protected paths if no access token is found and prompting the user to log in via a modal.
  - Registers a global Nuxt route middleware that checks for an 'access_token' in localStorage and dispatches an 'open-auth-modal' event if authentication is required.

### `mixins`

- `mixins/Carousel.js` — Provides a Vue mixin for managing a horizontal carousel, including calculating item positions, handling resize events, and enabling smooth scrolling for navigation.
- `mixins/Details.js` — Provides a Vue mixin with computed properties and helper functions to enrich item details (movies/TV shows) by fetching and prioritizing data from various API sources and custom overrides.
  - exports: `id`, `type`, `name`, `genres`, `stars`, `yearStart`, `yearEnd`, `poster`, `backdrop`, `cert`, `trailer`
- `mixins/Filters.js` — Provides a Vue mixin with common utility methods for formatting and filtering data, such as number formatting, runtime conversion, text truncation, and date formatting.
- `mixins/Functions.js` — Provides general utility functions, including a debounce function to limit the rate of function calls and a helper to check for localStorage support in the browser.
  - exports: `debounce`, `supportsLocalStorage`
- `mixins/InfiniteScroll.js` — Provides a Vue mixin for creating CSS-animated infinite horizontal carousels with features like hover/focus pause, manual drag/wheel control, and arrow-button seeking.

### `pages`

- `pages/auth-success.vue` — Handles post-authentication redirects and displays success or error messages, managing UI state and local storage for return URLs.
- `pages/awards/index.vue` — Displays a browsable list of major film awards, allowing users to select an award and year to view winners and nominees, with search functionality for people.
- `pages/calendar/index.vue` — Provides a release calendar for films, showing theatrical, streaming, and festival dates, with options to filter by view (month/week), lens, media type, and territory.
- `pages/changelog/index.vue` — Displays a changelog of releases, new features, and platform improvements by fetching and rendering data from the GitHub API.
- `pages/contact/index.vue` — Provides a contact form for users to submit inquiries, handling form state, validation, and submission to an API endpoint.
- `pages/faq/index.vue` — Presents a frequently asked questions page with an interactive table of contents and collapsible sections for detailed explanations.
- `pages/festival/bafici-2026/index.vue` — Displays information for the BAFICI 2026 film festival, including films, awards, and schedule, with navigation, search, and responsive layout features.
- `pages/festival/berlinale-2026/index.vue` — Displays information for the Berlinale 2026 film festival, including films, awards, and schedule, with navigation, search, and responsive layout features.
- `pages/festival/bifan-2026/index.vue` — Displays information for the BIFAN 2026 film festival, including films, awards, and schedule, with navigation, search, and responsive layout features.
- `pages/festival/bifff-2026/index.vue` — Vue page component for displaying details of the BIFFF 2026 film festival, including films, schedule, and awards, with interactive navigation and search features.
- `pages/festival/cannes-2026/index.vue` — Vue page component for displaying details of the Cannes Film Festival 2026, including films, schedule, and awards, with interactive navigation and search features.
- `pages/festival/cuff-2026/index.vue` — Vue page component for displaying details of the CUFF 2026 film festival, including films, schedule, and awards, with interactive navigation and search features.
- `pages/festival/fantasia-2026/index.vue` — Vue page component for displaying details of the Fantasia International Film Festival 2026, including films, schedule, and awards, with interactive navigation and search features.
- `pages/festival/frightfest-2026/index.vue` — Vue page component for displaying details of the FrightFest 2026 film festival, including films, schedule, and awards, with interactive navigation and search features.
- `pages/festival/kviff-2026/index.vue` — Vue page component for displaying details of the Karlovy Vary International Film Festival 2026, including films, schedule, and awards, with interactive navigation and search features.
- `pages/festival/locarno-2026/index.vue` — Vue page component for displaying details of the Locarno Film Festival 2026, including films, schedule, and awards, with interactive navigation and search features.
- `pages/festival/romford-2026/index.vue` — Vue component for displaying the Romford Horror Film Festival 2026 details, including films, awards, and schedule, with interactive search and navigation.
- `pages/festival/rotterdam-2026/index.vue` — Vue component for displaying the International Film Festival Rotterdam (IFFR) 2026 details, including films, awards, and schedule, with interactive search and navigation.
- `pages/festival/slamdance-2026/index.vue` — Vue component for displaying the Slamdance Film Festival 2026 details, including films, awards, and schedule, with interactive search and navigation.
- `pages/festival/sundance-2026/index.vue` — Vue component for displaying the Sundance Film Festival 2026 details, including films, awards, and schedule, with interactive search and navigation.
- `pages/festival/sxsw-2026/index.vue` — Vue component for displaying the SXSW Film Festival 2026 details, including films, awards, and schedule, with interactive search and navigation.
- `pages/festival/tiff-2026/index.vue` — Vue component for displaying the Toronto International Film Festival (TIFF) 2026 details, including films, awards, and schedule, with interactive search and navigation.
- `pages/festival/tribeca-2026/index.vue` — Vue component for displaying the Tribeca Film Festival 2026 details, including films, awards, and schedule, with interactive search and navigation.
- `pages/festival/venice-2026/index.vue` — Vue page component for displaying details of the Venice Film Festival 2026, including films, schedule, awards, and general information.
- `pages/genre/[id]/movie.vue` — Vue page component that displays a list of movies belonging to a specific genre, allowing users to load more items.
- `pages/genre/[id]/tv.vue` — Vue page component that displays a list of TV shows belonging to a specific genre, allowing users to load more items.
- `pages/index.vue` — Vue page component for the homepage, featuring various carousels, banners for ongoing festivals (Oscars, Cannes, Fantasia), and trending content.
- `pages/lists/[slug].vue` — Vue page component for displaying a specific user-created list of movies and TV shows, with filtering, sorting, and editing capabilities for the owner.
- `pages/lists/index.vue` — Vue page component for displaying a user's custom lists of movies and TV shows, with options to create, edit, and manage them.
- `pages/login/index.vue` — Vue page component that serves as an entry point for user authentication, immediately opening the AuthModal to either log in or register.
- `pages/movie/[id].vue` — Vue page component for displaying detailed information about a specific movie, including overview, cast, crew, videos, images, soundtracks, and awards.
- `pages/movie/category/[name].vue` — Vue page component that displays a list of movies based on a specific category (e.g., trending, now playing), with pagination.
- `pages/movie/followed.vue` — Vue page component that displays movies from followed companies or entities, leveraging a generic FollowedContent component.
- `pages/movie/index.vue` — Vue page component for the main movie discovery hub, showcasing curated rows of movies based on various criteria.
- `pages/news/[slug].vue` — Displays a single news article, handling loading states, errors, user authentication for saving/sharing, and fetching related entities.
- `pages/news/index.vue` — Displays a list of news articles with filtering by category and source, search functionality, and a 'back to article' option.
- `pages/noir/index.vue` — Presents the N.O.I.R Archive of historical titles, allowing users to sort items and create a personal list from the archive.
- `pages/notifications/index.vue` — Manages and displays user notifications, allowing filtering by read/unread status, marking notifications, and managing follows.
- `pages/person/[id].vue` — Displays detailed information about a person, including their known-for credits, filmography, photos, and awards.
- `pages/production-companies/index.vue` — Lists production companies, allowing users to search by name or filter by initial letter, and highlights popular companies.
- `pages/production/[slug].vue` — Displays movies and TV shows associated with a specific production company, offering filtering and sorting options.
- `pages/recovery/index.vue` — Provides a password recovery interface where users can request a password reset link via email.
- `pages/register/index.vue` — Provides a registration page that automatically opens an authentication modal for user registration upon being mounted.
- `pages/search/index.vue` — Displays search results for movies, TV shows, and people, handling loading states, no results, and pagination for search queries.
- `pages/settings/index.vue` — Manages user account settings, including profile information, avatar changes, alias updates, privacy settings, and account deletion.
- `pages/streaming-services/index.vue` — Displays a list of all available streaming services, sorted alphabetically, allowing users to browse and navigate to individual service pages.
- `pages/streaming/[slug].vue` — Displays detailed information for a specific streaming platform, including movies and TV shows available, with filtering and sorting options.
- `pages/streaming/followed.vue` — Displays followed movies or TV shows from streaming platforms, based on the 'type' query parameter in the route.
- `pages/tv/[id].vue` — Displays detailed information for a specific TV show, including an overview, credits, episodes, videos, images, soundtracks, and awards.
- `pages/tv/category/[name].vue` — Displays a paginated list of TV shows based on a specified category (e.g., trending, popular), fetching data from the API.
- `pages/tv/followed.vue` — Displays a list of TV shows that the user has followed.
- `pages/tv/index.vue` — Serves as the main discovery page for TV shows, displaying curated rows of content like airing today, on the air, and top-rated series.
- `pages/u/[alias].vue` — Displays a public user profile page, including their avatar, reviews, and public lists, with functionality to follow/unfollow the user.
- `pages/usage-policies/index.vue` — Displays the Cinemagoria platform's usage policies and privacy agreement, with a table of contents for navigation.
- `pages/watchlist/index.vue` — Vue page displaying a user's watchlist of movies and TV shows, with loading, empty, and rated items states, and filtering options.
- `pages/wip/index.vue` — Vue page indicating that a section of the application is under maintenance, providing options to return home or view more information.

### `plugins`

- `plugins/bus.js` — Nuxt plugin that provides a global event bus using the mitt library for inter-component communication.
- `plugins/lazyload.js` — Nuxt plugin that registers a 'lazyload' Vue directive to dynamically set the 'src' attribute of an image element.

### `public`

- `public/manifest.json` — Defines the web application manifest for Cinemagoria, including its name, description, start URL, display properties, theme colors, and various icon configurations for different purposes and sizes.
- `public/sw.js` — A self-destroying service worker script that unregisters itself upon activation and reloads all open client pages, ensuring no caching or offline functionality is provided.
  - This file is explicitly marked as not to be version controlled.

### `scripts`

- `scripts/seed_tribeca_2026_awards.cjs` — One-shot script to seed the `festival_awards` table with 2026 Tribeca Festival feature film award winners, including bilingual fields (EN/ES).
  - Run with `node scripts/seed_tribeca_2026_awards.cjs`.
- `scripts/syncCustomOverrides.js` — Fetches custom title override data from the `title_overrides` Turso database table and writes it to a JSON file for public consumption.
- `scripts/syncHeroData.js` — Retrieves hero selection data from the `hero_selections` Turso database table and saves it as a JSON file for public use.
- `scripts/syncNoirEnrichmentData.js` — Fetches enrichment data for 'noir historical' titles from the `noir_historical` Turso database table and writes it to a JSON file.
- `scripts/syncNoirHistorical.js` — Synchronizes new hero selections into the `noir_historical` Turso database table, optionally fetching Spanish titles from TMDB.

### `server/api`

- `server/api/article-report.post.ts` — Handles POST requests to report issues with articles, sanitizing input and storing reports in a Turso database.
  - Registers a POST route for /api/article-report.
- `server/api/article/[slug].get.ts` — Handles GET requests for a specific article by slug, fetching its details from the database and returning structured data.
  - Registers a GET route for /api/article/:slug.
- `server/api/article/rss.get.ts` — Provides a permanent redirect for the legacy RSS feed endpoint to the canonical /feed URL.
  - Registers a GET route for /api/article/rss.
- `server/api/articles/by-entity.get.ts` — Fetches a limited number of articles related to specific TMDB entities (movies or TV shows) from the database.
  - Registers a GET route for /api/articles/by-entity.
- `server/api/articles/by-slugs.get.ts` — Retrieves a list of articles based on provided slugs, returning their details from the database.
  - Registers a GET route for /api/articles/by-slugs.
- `server/api/awards/index-page.get.ts` — Fetches award data for the main awards page, including a list of years for a selected award body and the awards for a specific year.
  - Registers a GET route for /api/awards/index-page.
- `server/api/awards/index.get.ts` — Provides an API for looking up awards by TMDB ID, person name, or title, returning results categorized by award body.
  - Registers a GET route for /api/awards/index.
- `server/api/calendar/[month].get.ts` — API endpoint to retrieve a calendar of release events for a specific month, fetching data from the database and applying caching headers based on the month's recency.
  - Registers a GET route for /api/calendar/[month].
- `server/api/contact.post.ts` — API endpoint to handle contact form submissions, sanitizing input, validating email, and storing the message in a database.
  - Registers a POST route for /api/contact.
- `server/api/festival-report.post.ts` — API endpoint to receive and store festival-related reports, including input sanitization and validation, into a database.
  - Registers a POST route for /api/festival-report.
- `server/api/festival/bafici/awards.get.ts` — API endpoint to fetch the awards for the BAFICI 2026 festival.
  - Registers a GET route for /api/festival/bafici/awards.
- `server/api/festival/bafici/films.get.ts` — API endpoint to retrieve a list of films for the BAFICI 2026 festival, with optional filtering by TMDB or IMDb ID, and data normalization/enrichment.
  - Registers a GET route for /api/festival/bafici/films.
- `server/api/festival/bafici/schedule.get.ts` — API endpoint to fetch the screening schedule for the BAFICI 2026 festival, including film details and screening information.
  - Registers a GET route for /api/festival/bafici/schedule.
- `server/api/festival/berlinale/awards.get.ts` — API endpoint to fetch the awards for the Berlinale 2026 festival.
  - Registers a GET route for /api/festival/berlinale/awards.
- `server/api/festival/berlinale/films.get.ts` — API endpoint to retrieve a list of films for the Berlinale Film Festival 2026, with optional filtering by TMDB or IMDb ID, and data normalization/enrichment.
  - Registers a GET route for /api/festival/berlinale/films.
- `server/api/festival/berlinale/schedule.get.ts` — API endpoint to retrieve the 2026 Berlinale Film Festival screening schedule, including film details and screening information, from the database.
- `server/api/festival/bifan/awards.get.ts` — API endpoint to fetch the 2026 BIFAN festival awards by delegating to a utility function.
- `server/api/festival/bifan/films.get.ts` — API endpoint to retrieve a list of 2026 BIFAN festival films, with optional filtering by TMDB or IMDb ID, from the database.
- `server/api/festival/bifan/schedule.get.ts` — API endpoint to retrieve the 2026 BIFAN festival screening schedule, including film details and screening information, from the database.
- `server/api/festival/bifff/awards.get.ts` — API endpoint to fetch the 2026 BIFFF festival awards by delegating to a utility function.
- `server/api/festival/bifff/films.get.ts` — API endpoint to retrieve a list of 2026 BIFFF festival films, with optional filtering by TMDB or IMDb ID, from the database.
- `server/api/festival/bifff/schedule.get.ts` — API endpoint to retrieve the 2026 BIFFF festival screening schedule, including film details and screening information, from the database.
- `server/api/festival/cannes/awards.get.ts` — API endpoint to fetch the 2026 Cannes Film Festival awards by delegating to a utility function.
- `server/api/festival/cannes/films.get.ts` — API endpoint to retrieve a list of 2026 Cannes Film Festival films, with optional filtering by TMDB or IMDb ID, from the database.
- `server/api/festival/cannes/schedule.get.ts` — API endpoint to retrieve the 2026 Cannes Film Festival screening schedule, including film details and screening information, from the database.
- `server/api/festival/cuff/awards.get.ts` — API endpoint to fetch the 2026 CUFF festival awards by delegating to a utility function.
- `server/api/festival/cuff/films.get.ts` — API endpoint to retrieve a list of 2026 CUFF festival films, with optional filtering by TMDB or IMDb ID, from the database.
- `server/api/festival/cuff/schedule.get.ts` — API endpoint to retrieve the 2026 CUFF festival screening schedule, including film details and screening information, from the database.
- `server/api/festival/fantasia/awards.get.ts` — API endpoint to fetch awards for the Fantasia International Film Festival 2026.
  - Registers a GET route for /api/festival/fantasia/awards.
- `server/api/festival/fantasia/films.get.ts` — API endpoint to retrieve films for the Fantasia International Film Festival 2026, with optional filtering by TMDB or IMDb ID and result limiting.
  - Registers a GET route for /api/festival/fantasia/films. Supports `tmdb_id`, `imdb_id`, and `limit` query parameters.
- `server/api/festival/fantasia/schedule.get.ts` — API endpoint to fetch the screening schedule for the Fantasia International Film Festival 2026, including film details.
  - Registers a GET route for /api/festival/fantasia/schedule.
- `server/api/festival/films-batch.get.ts` — API endpoint to fetch films for multiple festivals in a single batch, with options for limiting results per festival and slimming fields for carousel/card consumers.
  - Registers a GET route for /api/festival/films-batch. Requires `festivals` query param (comma-separated slugs). Supports `limit`, `year`, and `fields=card`.
- `server/api/festival/frightfest/films.get.ts` — API endpoint to retrieve films for the FrightFest 2026, with optional filtering by TMDB or IMDb ID and result limiting.
  - Registers a GET route for /api/festival/frightfest/films. Supports `tmdb_id`, `imdb_id`, and `limit` query parameters.
- `server/api/festival/frightfest/schedule.get.ts` — API endpoint to fetch the screening schedule for FrightFest 2026, including film details.
  - Registers a GET route for /api/festival/frightfest/schedule.
- `server/api/festival/kviff/awards.get.ts` — API endpoint to fetch awards for the Karlovy Vary International Film Festival 2026.
  - Registers a GET route for /api/festival/kviff/awards.
- `server/api/festival/kviff/films.get.ts` — API endpoint to retrieve films for the Karlovy Vary International Film Festival 2026, with optional filtering by TMDB or IMDb ID and result limiting.
  - Registers a GET route for /api/festival/kviff/films. Supports `tmdb_id`, `imdb_id`, and `limit` query parameters.
- `server/api/festival/kviff/schedule.get.ts` — API endpoint to fetch the screening schedule for the Karlovy Vary International Film Festival 2026, including film details.
  - Registers a GET route for /api/festival/kviff/schedule.
- `server/api/festival/locarno/awards.get.ts` — API endpoint to fetch awards for the Locarno Film Festival 2026.
  - Registers a GET route for /api/festival/locarno/awards.
- `server/api/festival/locarno/films.get.ts` — API endpoint to retrieve a list of films for the Locarno Film Festival 2026, with optional filtering by TMDB or IMDb ID and limit.
- `server/api/festival/locarno/schedule.get.ts` — API endpoint to fetch the screening schedule for the Locarno Film Festival 2026, including film details.
- `server/api/festival/romford/awards.get.ts` — API endpoint to retrieve the awards for the Romford Horror Festival 2026.
- `server/api/festival/romford/films.get.ts` — API endpoint to retrieve a list of films for the Romford Horror Festival 2026, with optional filtering by TMDB or IMDb ID and limit.
- `server/api/festival/romford/schedule.get.ts` — API endpoint to fetch the screening schedule for the Romford Horror Festival 2026, including film details.
- `server/api/festival/rotterdam/awards.get.ts` — API endpoint to retrieve the awards for the Rotterdam Film Festival 2026.
- `server/api/festival/rotterdam/films.get.ts` — API endpoint to retrieve a list of films for the Rotterdam Film Festival 2026, with optional filtering by TMDB/IMDb ID, sorting, and limiting.
- `server/api/festival/rotterdam/schedule.get.ts` — API endpoint to fetch the screening schedule for the Rotterdam Film Festival 2026, including film details.
- `server/api/festival/slamdance/awards.get.ts` — API endpoint to retrieve the awards for the Slamdance Film Festival 2026.
- `server/api/festival/slamdance/films.get.ts` — API endpoint to retrieve a list of films for the Slamdance Film Festival 2026, with optional filtering by TMDB or IMDb ID and limit.
- `server/api/festival/slamdance/schedule.get.ts` — API endpoint to fetch the screening schedule for the Slamdance Film Festival 2026, including film details.
- `server/api/festival/status.get.ts` — API endpoint to resolve festival badges for a given film by its TMDB ID and year, serving as a client-side fallback.
- `server/api/festival/sundance/awards.get.ts` — API endpoint to retrieve the awards for the Sundance Film Festival 2026.
- `server/api/festival/sundance/films.get.ts` — API endpoint to fetch a list of films for the 2026 Sundance Film Festival, supporting filtering by TMDB/IMDB ID, sorting by rating or title, and limiting results.
  - Registers a GET route for /api/festival/sundance/films.
- `server/api/festival/sundance/schedule.get.ts` — API endpoint to retrieve the screening schedule for the 2026 Sundance Film Festival, including film details and screening information.
  - Registers a GET route for /api/festival/sundance/schedule.
- `server/api/festival/sxsw/awards.get.ts` — API endpoint to fetch awards data for the 2026 SXSW Film & TV Festival.
  - Registers a GET route for /api/festival/sxsw/awards.
- `server/api/festival/sxsw/films.get.ts` — API endpoint to fetch a list of films for the 2026 SXSW Film & TV Festival, supporting filtering by TMDB/IMDB ID, sorting by rating or title, and limiting results.
  - Registers a GET route for /api/festival/sxsw/films.
- `server/api/festival/sxsw/schedule.get.ts` — API endpoint to retrieve the screening schedule for the 2026 SXSW Film & TV Festival, including film details and screening information.
  - Registers a GET route for /api/festival/sxsw/schedule.
- `server/api/festival/tiff/awards.get.ts` — API endpoint to fetch awards data for the 2026 Toronto International Film Festival (TIFF).
  - Registers a GET route for /api/festival/tiff/awards.
- `server/api/festival/tiff/films.get.ts` — API endpoint to fetch a list of films for the 2026 Toronto International Film Festival (TIFF), supporting filtering by TMDB/IMDB ID and limiting results.
  - Registers a GET route for /api/festival/tiff/films.
- `server/api/festival/tiff/schedule.get.ts` — API endpoint to retrieve the screening schedule for the 2026 Toronto International Film Festival (TIFF), including film details and screening information.
  - Registers a GET route for /api/festival/tiff/schedule.
- `server/api/festival/tribeca/awards.get.ts` — API endpoint to fetch awards data for the 2026 Tribeca Festival.
  - Registers a GET route for /api/festival/tribeca/awards.
- `server/api/festival/tribeca/films.get.ts` — API endpoint to fetch a list of films for the 2026 Tribeca Festival, supporting filtering by TMDB/IMDB ID and limiting results.
  - Registers a GET route for /api/festival/tribeca/films.
- `server/api/festival/tribeca/schedule.get.ts` — API endpoint to retrieve the screening schedule for the 2026 Tribeca Festival, including film details and screening information.
  - Registers a GET route for /api/festival/tribeca/schedule.
- `server/api/festival/venice/awards.get.ts` — API endpoint to fetch awards data for the 2026 Venice Film Festival.
  - Registers a GET route for /api/festival/venice/awards.
- `server/api/festival/venice/films.get.ts` — API endpoint to retrieve a list of films from the Venice Film Festival 2026, with optional filtering by TMDB or IMDb ID and limiting the number of results.
- `server/api/festival/venice/schedule.get.ts` — API endpoint to retrieve the screening schedule for the Venice Film Festival 2026, joining film details with screening information.
- `server/api/hero.get.ts` — API endpoint to fetch a randomized selection of hero items, enriching them with festival membership status and TV series details for display.
- `server/api/imdb-rating/[id].get.ts` — API endpoint to fetch IMDb ratings and vote counts for a given media ID from a Turso database, with caching headers.
- `server/api/news.get.ts` — API endpoint to retrieve curated news articles, supporting pagination, language filtering, source filtering, and search queries.
- `server/api/noir-archive.get.ts` — API endpoint to fetch a list of noir archive items from a Turso database, ordered by release date.
- `server/api/progress/[userId]/[mediaType]/[mediaId].delete.ts` — API endpoint to delete a user's progress tracking entry for a specific media item (movie or episode).
- `server/api/progress/[userId]/[mediaType]/[mediaId].get.ts` — API endpoint to retrieve a user's progress tracking details for a specific media item (movie or episode).
- `server/api/progress/[userId]/[mediaType]/[mediaId].put.ts` — API endpoint to create or update a user's progress tracking for a specific media item (movie or episode), including TV series details.
- `server/api/progress/[userId]/active/[mediaType]/[mediaId].put.ts` — API endpoint to update the `manually_active` flag for a user's progress tracking entry for a specific media item.
- `server/api/progress/[userId]/batch.put.ts` — Handles batch updates for user progress tracking, inserting or updating episode progress for a given user.
  - Registers a PUT route at /api/progress/[userId]/batch
- `server/api/progress/[userId]/hydrated.get.ts` — Fetches and hydrates user progress data with detailed movie and TV show information from TMDB, including caching mechanisms.
  - Registers a GET route at /api/progress/[userId]/hydrated
- `server/api/progress/[userId]/index.get.ts` — Retrieves a user's progress tracking data, either a count of tracked titles or a detailed list of progress entries, optionally filtered by TV show ID.
  - Registers a GET route at /api/progress/[userId]
- `server/api/search-log.post.ts` — Logs user search queries to a Turso database, optionally including analytics data like origin IP and user email.
  - Registers a POST route at /api/search-log
- `server/api/search/person.get.ts` — Searches for people on TMDB based on a provided query string.
  - Registers a GET route at /api/search/person
- `server/api/spotlight/[type].get.ts` — Retrieves curated spotlight content (movies or TV shows) from the database, transforming raw data into a structured format.
  - Registers a GET route at /api/spotlight/[type]

### `server/middleware`

- `server/middleware/logger.ts` — Defines a Nuxt event handler for logging, currently disabled but safely implemented as a no-op.
- `server/middleware/redirect-at.ts` — Nuxt event handler that redirects URLs starting with '/@username' to '/u/username' using a 301 permanent redirect.

### `server/plugins`

- `server/plugins/strip-cookies-cacheable.ts` — Nitro plugin to strip Set-Cookie headers and clean the Vary header from responses on public cacheable routes, enabling Cloudflare caching for SSR HTML.

### `server/routes`

- `server/routes/feed.get.ts` — Generates the canonical public RSS news feed for Cinemagoria in English, serving it at `/feed` with appropriate XML content type and caching headers.
  - exports: `default`
  - Registers a GET route for `/feed`.
- `server/routes/sitemap-news.xml.ts` — Generates an XML sitemap for news articles by querying a database, including alternate language links for English and Spanish versions.
  - exports: `default`
  - Registers a GET route for `/sitemap-news.xml`.
- `server/routes/sitemap-static.xml.ts` — Generates an XML sitemap for static pages, genre pages, streaming provider pages, production company pages, and festival pages.
  - exports: `default`
  - Registers a GET route for `/sitemap-static.xml`.
- `server/routes/sitemap.xml.ts` — Generates the main sitemap index XML file, referencing the static and news sitemaps, while explicitly excluding dynamic TMDB-derived content.
  - exports: `default`
  - Registers a GET route for `/sitemap.xml`.

### `server/types`

- `server/types/markdown-it.d.ts` — Provides minimal ambient type declarations for the 'markdown-it' library, specifically for the MarkdownIt class and its options, to support server-side feed building.
  - exports: `MarkdownIt`

### `server/utils`

- `server/utils/db.ts` — Provides utility functions for connecting to a Turso database and executing queries with built-in timeout handling.
  - exports: `useDb`, `dbExecute`
- `server/utils/rss-feed.ts` — Constructs an RSS news feed from database content, handling localization, Markdown rendering, and embedding Vimeo trailers.
  - exports: `buildNewsFeed`
  - This file is designed to be byte-identical between cinemagoria-main and cinemagoria-es for repo-sync tooling.
- `server/utils/vimeo-oembed.ts` — Provides functions to fetch and cache oEmbed metadata for Vimeo videos, including thumbnail URLs, used by RSS feeds and news pages.
  - exports: `getVimeoOembed`, `getVimeoThumb`
  - This file is designed to be byte-identical between cinemagoria-main and cinemagoria-es for repo-sync tooling.
- `server/utils/festivalAwards.ts` — Fetches festival award data from the database for a given festival slug, supporting English and Spanish locales with fallback logic.
  - exports: `fetchFestivalAwards`
- `server/utils/festivals.ts` — Manages canonical festival name-to-slug mappings and retrieves festival participation status for a batch of TMDb IDs from the database.
  - exports: `FESTIVAL_NAME_BY_SLUG`, `NAME_TO_SLUG`, `getFestivalStatusByTmdbId`
- `server/utils/sitemap-helpers.ts` — Provides utilities for fetching TMDb item IDs across multiple pages and generating an XML sitemap string.
  - exports: `fetchTmdbPages`, `buildSitemapXml`
- `server/utils/tvDetails.ts` — Fetches and caches TV show details from TMDb, providing a minimal, structured representation of TV series data including seasons and episodes.
  - exports: `pickTvDetails`, `hasTvSeasonBreakdown`, `loadTvDetailsCached`

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

- `utils/api.js` — Provides utility functions for interacting with external APIs like TMDb and Trakt, handling API requests, image URLs, and data enrichment.
  - exports: `apiImgUrl`, `EXCLUDED_MOVIE_IDS`, `EXCLUDED_TV_IDS`, `getHeroEnrichment`, `getNoirEnrichment`, `getCustomEnrichment`, `resolveItemPoster`, `languages`, `getListItem`, `getIMDbRatingFromDB`, `getMovies`
- `utils/categoryLabels.js` — Defines English display labels for editorial taxonomy categories and provides a function to retrieve a label given a category token.
  - exports: `CATEGORY_LABELS`, `categoryLabel`
- `utils/countries.js` — Provides a list of countries with their ISO 3166-1 alpha-2 codes and names.
  - exports: `countries`
- `utils/discover.js` — Defines various constants and lists used for content discovery, including movie and TV genres, networks, sorting options, and curated rows.
  - exports: `MOVIE_GENRES`, `TV_GENRES`, `DISCOVER_NETWORKS`, `DISCOVER_SORTS`, `DEFAULT_SORT`, `DEFAULT_MIN_VOTES`, `DISCOVER_LANGUAGES`, `MIN_VOTE_OPTIONS`, `FORMAT_OPTIONS`, `GENRE_TILES`, `CURATED_ROWS`, `DISCOVER_TYPES`
- `utils/helpers.js` — Provides general utility functions for formatting dates, handling image loading errors, and determining movie release status context.
  - exports: `formatDate`, `handleImageError`, `getReleaseStatusContext`
- `utils/itemMapper.js` — Maps an item object to a database-friendly payload, extracting and transforming relevant properties like ID, type, name, poster, and genre.
  - exports: `mapItemToDbPayload`
- `utils/membershipStore.js` — Manages a session-wide cache for user membership data (watchlist and custom lists) to reduce API requests and improve performance.
  - exports: `invalidateMembershipCache`, `getMembership`
  - Coalesces multiple invalidation requests into a single cache clear and refetch.
- `utils/musicbrainz.js` — Provides functions to search for soundtracks and retrieve album tracks using the MusicBrainz API.
  - exports: `searchSoundtracks`, `getAlbumTracks`, `getMusicBrainzUrl`
- `utils/newsSources.js` — Defines lists of English news sources and their corresponding URLs.
  - exports: `SOURCES`, `SOURCE_URLS`
- `utils/relatedFooter.js` — Provides utilities to strip 'Related Articles' footers from article bodies and extract slugs from related article links.
  - exports: `stripRelatedFooter`, `extractRelatedSlugs`
  - Handles both Markdown and legacy HTML formats for related article footers.
- `utils/resolvePhase.js` — An intentionally empty file, marked as deprecated, that was previously used for phase resolution logic.
  - This file is deprecated and will be removed; it should not be used.
- `utils/tvTrailer.js` — Provides functions to resolve the best and most recent playable trailer for a TV series, prioritizing season-specific trailers.
  - exports: `TV_TRAILER_MAX_SEASON_PROBES`, `TV_TRAILER_MAX_PLAYABILITY_CHECKS`, `tvVideoClass`, `rankTvVideo`, `tvVideoGroup`, `isUsableSeasonTrailer`, `pickBestTvVideo`, `resolveTvTrailer`
  - Prioritizes trailers from the latest seasons over series-level videos, which are often outdated.

## Dependency Edges

| From | To | Imports |
| :--- | :--- | ---: |
| `server/routes` | `server/utils` | 1 |

## External Packages (imported in code)

- `~` (449 imports)
- `~~` (65 imports)
- `h3` (58 imports)
- `vue` (51 imports)
- `@/components` (27 imports)
- `@libsql/client` (17 imports)
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
