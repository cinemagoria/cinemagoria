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

- `app.vue` — Root Vue component for the Cinemagoria application, setting up global SEO metadata (Schema.org Organization and WebSite) and rendering the main Nuxt layout and page.
- `cloudbuild.yaml` — Google Cloud Build configuration for building a Docker image of the Cinemagoria application, pushing it to Artifact Registry, and deploying it to Cloud Run.
- `Dockerfile` — Defines the Docker image build process for the Cinemagoria Nuxt application, including dependencies, build arguments for Supabase, and a production-ready runtime environment.
- `nuxt.config.ts` — Nuxt.js configuration file, defining aliases, compatibility date, devtools settings, and route-specific headers for caching and sitemaps.
  - exports: `default`
- `package.json` — Defines project metadata, scripts for development and build, dependency resolutions, and lists all production and development dependencies for the Cinemagoria application.
  - Includes scripts: build, dev, generate, preview, postinstall.
- `tsconfig.json` — TypeScript configuration file for the Nuxt.js project, referencing generated TypeScript configurations for different parts of the application.

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
- `components/global/UserNav.vue` — Displays user navigation elements including notifications, avatar, and a dropdown menu with profile links and actions like logout, managing favorites, and language switching.
- `components/BaficiCard.vue` — A card component for displaying BAFICI festival film information, including a poster, quick actions like favoriting, and a link to the official festival page.
- `components/BerlinaleCard.vue` — A card component for displaying Berlinale festival film information, including a poster, quick actions like favoriting, and a link to the official festival page.
- `components/BifanCard.vue` — A card component for displaying Bifan festival film information, including a poster, quick actions like favoriting, and a link to the official festival page.
- `components/BifffCard.vue` — A card component for displaying BIFFF festival film information, including a poster, quick actions like favoriting, and a link to the official festival page.
- `components/CannesCard.vue` — A card component for displaying Cannes festival film information, including a poster, quick actions like favoriting, and a link to the official festival page.
- `components/CannesLiveBanner.vue` — A banner component promoting live coverage of the Cannes 2026 festival, featuring the festival logo and a call to explore content.
- `components/CannesWinnersBanner.vue` — A banner component promoting the Cannes 2026 festival winners, displaying the festival logo, a 'Winners' badge, and a marquee of award recipients.
- `components/Card.vue` — A generic card component for displaying media items (movies, TV shows, people, productions, streaming services, festivals) with a poster, title, year, rating, and quick favorite action.
- `components/common/AwardsTab.vue` — A tab component for displaying awards received by a movie, TV show, or person, categorizing them by major awards like Oscars, Golden Globes, Palme d'Or, Golden Lion, and Golden Bear.
- `components/common/FullCreditsModal.vue` — A modal component that displays the full crew credits for a given title, organized by department with collapsible sections.
- `components/common/MediaProgressBar.vue` — A component displaying a circular progress bar for media viewing progress, including elapsed time and total duration, with a slider to adjust progress.
- `components/Credits.vue` — Displays a horizontal carousel of cast members for a movie or TV show, allowing users to navigate through the list and view individual credit items.
- `components/CreditsItem.vue` — Renders an individual cast member's card within a credits list, displaying their image, name, and character, with a link to their person detail page.
- `components/CuffCard.vue` — Displays a card for a movie or TV show item, including an image, actions, and a link to its detail page, with special handling for external festival links.
- `components/CustomListingCategoriesMovies.vue` — Presents a horizontal carousel of movie categories, allowing users to browse and navigate through different genre listings.
- `components/CustomListingCategoriesSeries.vue` — Presents a horizontal carousel of TV series categories, allowing users to browse and navigate through different genre listings.
- `components/Discover.vue` — Provides a comprehensive discovery interface for movies and TV shows, allowing users to filter by genre, sort options, country, network, language, and more.
- `components/DynamicSearchCarousel.vue` — Displays a dynamic horizontal carousel of search results for movies or TV shows, allowing users to browse through items with navigation controls.
- `components/ExternalLinks.vue` — Displays a grid of external links related to a movie or TV show, including IMDb, Rotten Tomatoes, Letterboxd, Trakt, and TMDb.
- `components/FantasiaCard.vue` — Displays a card for a movie or TV show item, including an image, actions, and a link to its detail page, with special handling for external festival links.
- `components/FantasiaLiveBanner.vue` — Displays a promotional banner for the Fantasia 2026 festival, linking to its dedicated coverage page.
- `components/FeatureDescription.vue` — Vue component displaying a prominent feature description with cinematic light effects and gradient text, designed to be responsive across different screen sizes.
- `components/festival/BaficiBadge.vue` — Vue component rendering a clickable badge for the BAFICI 2026 film festival, displaying its logo with hover effects and responsive styling.
- `components/festival/BerlinaleBadge.vue` — Vue component rendering a clickable badge for the Berlinale Film Festival 2026, displaying its logo with hover effects and responsive styling.
- `components/festival/BifanBadge.vue` — Vue component rendering a clickable badge for the BIFAN 2026 film festival, displaying its logo with hover effects and responsive styling.
- `components/festival/BifffBadge.vue` — Vue component rendering a clickable badge for the BIFFF 2026 film festival, displaying its logo with hover effects and responsive styling.
- `components/festival/CannesAcidBadge.vue` — Vue component rendering a clickable badge for the ACID section of the Cannes Film Festival 2026, displaying its logo with hover effects and responsive styling.
- `components/festival/CannesBadge.vue` — Vue component rendering a clickable badge for the Cannes Film Festival 2026, displaying its logo with hover effects and responsive styling.
- `components/festival/CannesCriticsChoiceBadge.vue` — Vue component rendering a clickable badge for the Critics' Choice section of the Cannes Film Festival 2026, displaying its logo with hover effects and responsive styling.
- `components/festival/CannesQuinzaineBadge.vue` — Vue component rendering a clickable badge for the Quinzaine des Cinéastes section of the Cannes Film Festival 2026, displaying its logo with hover effects and responsive styling.
- `components/festival/CuffBadge.vue` — Vue component rendering a clickable badge for the Calgary Underground Film Festival 2026, displaying its logo with hover effects and responsive styling.
- `components/festival/FantasiaBadge.vue` — Vue component rendering a clickable badge for the Fantasia International Film Festival 2026, displaying its logo with hover effects and responsive styling.
- `components/festival/FrightfestBadge.vue` — Vue component rendering a clickable badge for the FrightFest 2026 film festival, displaying its logo with hover effects and responsive styling.
- `components/festival/KviffBadge.vue` — Vue component rendering a clickable badge for the Karlovy Vary International Film Festival 2026, displaying its logo with hover effects and responsive styling.
- `components/festival/LocarnoBadge.vue` — Vue component rendering a clickable badge for the Locarno Film Festival 2026, displaying its logo with hover effects and responsive styling.
- `components/festival/RomfordBadge.vue` — Vue component rendering a clickable badge for the Romford Horror Film Festival 2026, displaying its logo with hover effects and responsive styling.
- `components/festival/RotterdamBadge.vue` — Vue component rendering a clickable badge for the Rotterdam Film Festival 2026, displaying its logo with hover effects and responsive styling.
- `components/festival/SlamdanceBadge.vue` — Vue component rendering a clickable badge for the Slamdance Film Festival 2026, displaying its logo with hover effects and responsive styling.
- `components/festival/SundanceBadge.vue` — Vue component rendering a clickable badge for the Sundance Film Festival 2026, displaying its logo with hover effects and responsive styling.
- `components/festival/SxswBadge.vue` — Vue component rendering a clickable badge for the SXSW Film & TV Festival 2026, displaying its logo with hover effects and responsive styling.
- `components/festival/SxswCard.vue` — Vue component representing a card for an SXSW festival item, including a link, actions, loading state, external link button, and quick favorite functionality.
- `components/festival/TiffBadge.vue` — Vue component rendering a clickable badge for the TIFF 2026 film festival, displaying its logo with hover effects and responsive styling.
- `components/festival/TribecaBadge.vue` — Vue component rendering a clickable badge for the Tribeca Festival 2026, displaying its logo with hover effects and responsive styling.
- `components/festival/VeniceBadge.vue` — Vue component rendering a clickable badge for the Venice Film Festival 2026, displaying its logo with hover effects and responsive styling.
- `components/festival/WinnersCarousel.vue` — Displays a horizontal carousel of festival award winners, grouped by film, with navigation controls and a statistical overview.
- `components/FestivalDataDisclaimer.vue` — Provides a disclaimer about incomplete festival data and allows users to report missing films via a modal form.
- `components/FestivalsCarousel.vue` — Renders a horizontal carousel of festivals, optionally with a title and a 'View All' link, supporting navigation and autoplay.
- `components/FestivalsRotatingBanner.vue` — Displays a rotating banner showcasing different festivals, with a shimmer effect and navigation to the active festival's page.
- `components/FollowedContent.vue` — Displays a list of movies or TV shows from followed production companies or streaming platforms, with filtering and sorting options.
- `components/FrightfestCard.vue` — Displays a card for a Frightfest film, including poster, title, year, and actions like opening the official festival page or quick favoriting.
- `components/global/ArticleAIDisclosure.vue` — Informs users that an article was AI-generated and provides a modal form to report errors or inaccuracies.
- `components/global/ArticleShareModal.vue` — Provides a modal for sharing an article via link copy, email, or various social media platforms, including native sharing.
- `components/global/AuthModal.vue` — Presents a modal for user authentication, allowing sign-in or registration, with options for community gate context.
- `components/global/CardActions.vue` — Provides a dropdown menu of actions for a content card, including rating, adding to watchlist, or adding to custom lists.
- `components/global/CookieConsent.vue` — Manages and displays a cookie consent banner and a preferences panel, allowing users to customize their cookie settings.
- `components/global/CreateListModal.vue` — Provides a modal for users to create a new custom list, including name, description, and privacy settings.
- `components/global/FollowingModal.vue` — Vue component for a modal that allows users to manage the people, TV shows, production companies, and streaming services they follow.
- `components/global/Footer.vue` — Vue component for the global footer, displaying navigation links, social media icons, and copyright information.
- `components/global/InstallPrompt.vue` — Vue component that displays a prompt to the user to install the Cinemagoria Progressive Web App (PWA) to their home screen.
- `components/global/MyListsModal.vue` — Vue component for a modal that allows users to manage items within their custom lists, including adding, removing, and moving items.
- `components/global/Nav.vue` — Vue component for the main navigation bar, providing links to different sections of the application and user-specific features.
- `components/global/NewsCarousel.vue` — Vue component displaying a carousel of the latest news articles, with navigation controls and a link to explore all news.
- `components/global/ProgressTrackingModal.vue` — Vue component for a modal that enables users to track their watch progress for movies and TV series, including individual episodes.
- `components/global/QuickFav.vue` — Vue component for a quick favorite button that allows users to add or manage an item in their lists, displaying a plus or check icon.
- `components/global/QuickFavModal.vue` — Vue component for a confirmation modal that prompts the user before removing an item from their watchlist.
- `components/global/RatedModal.vue` — Provides a modal interface for users to view and manage their rated movies and TV shows, including options to edit reviews and remove ratings.
- `components/global/RelatedArticlesCarousel.vue` — Displays a horizontal carousel of related articles, fetching data asynchronously and providing navigation controls for scrolling.
- `components/global/SearchForm.vue` — Implements a search form with debounced input, displaying trending movies/TV shows as featured content, and handling user authentication for avatar/name display.
- `components/global/TopNav.vue` — Renders a fixed top navigation bar that displays a title, designed to be hidden on larger screens.
- `components/Hero.vue` — Displays a hero section with dynamic content, auto-advance functionality, and interactive elements for user ratings and tracking, supporting both movies and TV shows.
- `components/HowItWorksModal.vue` — Presents a modal explaining how release alerts work, featuring an interactive carousel to guide users through the process.
- `components/Images.vue` — Displays a collection of images (posters or backdrops) for a media item, allowing users to view them in a modal gallery.
- `components/ImagesItem.vue` — Renders an individual image item within a gallery, displaying a loader while the image loads and emitting an event to open a modal on click.
- `components/KviffCard.vue` — Displays a card for a KVIFF (Karlovy Vary International Film Festival) item, including an image, quick actions, and a link to its detail page or external source.
- `components/KviffLiveBanner.vue` — Displays a promotional banner for the KVIFF 2026 festival, providing a link to its dedicated coverage page.
- `components/Listing.vue` — Displays a list of items, typically movies or TV shows, with an optional title, a 'view all' link, and infinite scrolling for loading more items.
- `components/ListingCarousel.vue` — Renders a horizontal carousel for displaying a list of items, including navigation buttons and an optional 'explore all' card.
- `components/Loader.vue` — A reusable SVG spinner component to indicate loading states, with customizable size and color.
- `components/LocarnoCard.vue` — Displays a card for a Locarno film festival entry, including a poster, actions, and a link to its official page.
- `components/MediaNav.vue` — Provides a navigation component with a set of buttons to switch between different media categories, emitting an event on click.
- `components/Modal.vue` — A generic modal component that can display various content types like images or iframes, with navigation and close functionality.
- `components/movie/MovieInfo.vue` — Displays detailed information about a movie, including its poster, overview, cast, crew, and various awards.
- `components/movie/MovieReleases.vue` — Displays a list of movie release dates grouped by country, including country flags and release details.
- `components/music/SoundtrackGroup.vue` — Organizes and displays a group of soundtrack items, typically by year, within a larger list.
- `components/music/SoundtrackItem.vue` — Displays a single soundtrack item with its title, disambiguation, and artist, linking to its MusicBrainz page.
- `components/music/SoundtrackList.vue` — Displays a list of tracks for a selected movie soundtrack album, with play icons and track information.
- `components/NoirModal.vue` — Provides a modal component for the 'Nothing Out Is Ready' (N.O.I.R) section, displaying information about curated film selections and a manifesto.
- `components/OscarsCarousel.vue` — Displays a horizontal carousel of films related to the 98th Academy Awards, allowing users to scroll through nominations and explore full coverage.
- `components/OscarsLiveBanner.vue` — Renders a dynamic banner for the 98th Academy Awards, showing live status or results with a ticker for notable winners.
- `components/person/CreditsHistory.vue` — Manages and displays a person's filmography, allowing filtering by department and media type (combined, movie, TV).
- `components/person/CreditsHistoryGroup.vue` — Groups and displays a list of credits for a person, typically by year, using the CreditsHistoryItem component for individual entries.
- `components/person/CreditsHistoryItem.vue` — Displays a single credit item for a person, including the film/series title, episode count, and role, with a link to the media page.
- `components/person/PersonAwardsTab.vue` — Displays a person's awards history, specifically for Oscars, Golden Globes, Palme d'Or, Golden Lion, and Golden Bear, in a tabular format.
- `components/person/PersonInfo.vue` — Displays detailed information about a person, including their biography, birth/death dates, known for department, and awards summary.
- `components/ProductionCompanyCarousel.vue` — Displays a scrollable carousel of popular production companies, with autoplay functionality and links to individual company pages.
- `components/ProductionHero.vue` — Displays a hero section for a production company, featuring its logo, name, country, headquarters, description, and a follow button.
- `components/RomfordCard.vue` — Displays a card component for a film from the Romford Film Festival, including a poster, quick actions, and a link to its detail page.
- `components/RotterdamCard.vue` — Displays a card component for a film from the International Film Festival Rotterdam, including a poster, quick actions, and a link to its detail page.
- `components/search/CategoryCarousel.vue` — Displays a horizontal carousel of items within a collapsible category section, typically used for search results or categorized listings.
- `components/search/CategorySection.vue` — Renders a collapsible section for a category of items, displaying them as a grid of `Card` components.
- `components/search/DiscoverSearch.vue` — Provides a comprehensive search interface for discovering movies and TV shows based on type, genre, sort options, country, network, language, provider, votes, format, year, and rating.
- `components/search/NewsResultCard.vue` — Displays a single news article or aggregated item as a card, linking to its source and showing an image, date, title, and description.
- `components/search/SearchGuideModal.vue` — Presents a modal dialog explaining the various search functionalities and tips available on Cinemagoria.
- `components/search/SearchResults.vue` — Displays aggregated search results across various categories like movies, TV shows, people, news, and users, with filtering and pagination capabilities.
- `components/SlamdanceCard.vue` — Renders a card component specifically for Slamdance festival items, including actions like adding to a list and opening external links.
- `components/SpotlightCarousel.vue` — Displays a horizontal carousel of `Card` components for spotlighted items, with navigation controls and an optional 'Explore All' link.
- `components/StreamingPlatformCarousel.vue` — Displays a horizontal carousel of popular streaming platforms, with navigation controls and an optional 'Explore All' link.
- `components/StreamingPlatformHero.vue` — Displays a hero section for a streaming platform, showing its name, logo, and a follow/unfollow button with authentication and progress tracking.
- `components/SundanceCard.vue` — Displays a card component for Sundance Film Festival items, including an image, title, and actions like linking to the festival page or favoriting.
- `components/TiffCard.vue` — Displays a card component for TIFF (Toronto International Film Festival) items, including an image, title, and actions like linking to the festival page or favoriting.
- `components/TribecaCard.vue` — Displays a card component for Tribeca Film Festival items, including an image, title, and actions like linking to the festival page or favoriting.
- `components/TribecaLiveBanner.vue` — Provides a promotional banner for the Tribeca 2026 festival, linking to its coverage page with a distinct background and logo.
- `components/tv/Episodes.vue` — Manages and displays a list of episodes for a TV show, allowing users to select seasons and mark episodes or entire seasons as watched.
- `components/tv/EpisodesItem.vue` — Displays a single TV episode with its poster, name, overview, and a progress tracking button that opens a modal for detailed tracking.
- `components/tv/TvInfo.vue` — Displays detailed information about a TV show, including its poster, overview, external links, and various related content sections.
- `components/VeniceCard.vue` — Displays a card component for Venice Film Festival items, including an image, title, and actions like linking to the festival page or favoriting.
- `components/Videos.vue` — Vue component that displays a list of videos, allows filtering by type, and opens a modal to play them, fetching YouTube video details and thumbnails.
- `components/VideosItem.vue` — Vue component for displaying an individual video item, including its thumbnail, name, type, and formatted duration, emitting an event to open a modal on click.
- `components/WatchOn.vue` — Vue component that displays a grid of external streaming providers where a movie or TV show can be watched, including their logos and links.
- `components/YearPicker.vue` — Vue component providing a dropdown for selecting a release year, ranging from a minimum year up to the current year, and emitting the selected value.

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

- `mixins/Carousel.js` — Provides a Vue mixin for managing a horizontal carousel, including calculating item positions, handling resize events, and enabling smooth scrolling for navigation.
- `mixins/Details.js` — Provides a Vue mixin with computed properties and helper functions to enrich item details (movies/TV shows) by fetching and prioritizing data from various API sources and custom overrides.
  - exports: `id`, `type`, `name`, `genres`, `stars`, `yearStart`, `yearEnd`, `poster`, `backdrop`, `cert`, `trailer`
- `mixins/Filters.js` — Provides a Vue mixin with common utility methods for formatting and filtering data, such as number formatting, runtime conversion, text truncation, and date formatting.
- `mixins/Functions.js` — Provides general utility functions, including a debounce function to limit the rate of function calls and a helper to check for localStorage support in the browser.
  - exports: `debounce`, `supportsLocalStorage`
- `mixins/InfiniteScroll.js` — Provides a Vue mixin for creating CSS-animated infinite horizontal carousels with features like hover/focus pause, manual drag/wheel control, and arrow-button seeking.

### `pages`

- `pages/auth-success.vue` — Handles the post-authentication success flow, displaying loading, success, or error states and redirecting the user after a countdown.
- `pages/awards/index.vue` — Displays a comprehensive list of major film awards, allowing users to browse winners and nominees by award type and year.
- `pages/changelog/index.vue` — Displays a changelog of releases, new features, and fixes for the Cinemagoria platform, fetched directly from the GitHub repository.
- `pages/contact/index.vue` — Provides a contact form for users to reach support regarding account issues, watchlists, missing titles, or other platform inquiries.
- `pages/faq/index.vue` — Presents a Frequently Asked Questions (FAQ) page, explaining the platform's editorial framework, discovery infrastructure, and other core aspects.
- `pages/festival/bafici-2026/index.vue` — Displays detailed information for the BAFICI 2026 film festival, including films, awards, and schedule, with interactive browsing and search features.
- `pages/festival/berlinale-2026/index.vue` — Displays detailed information for the Berlinale 2026 film festival, including films, awards, and schedule, with interactive browsing and search features.
- `pages/festival/bifan-2026/index.vue` — Displays detailed information for the BIFAN 2026 film festival, including films, awards, and schedule, with interactive browsing and search features.
- `pages/festival/bifff-2026/index.vue` — Displays detailed information for the BIFFF 2026 film festival, including films, awards, and schedule, with interactive browsing and search features.
- `pages/festival/cannes-2026/index.vue` — Vue page component for displaying information about the Cannes Film Festival 2026, including films, awards, and schedule, with interactive search and navigation features.
- `pages/festival/cuff-2026/index.vue` — Vue page component for displaying information about the Calgary Underground Film Festival (CUFF) 2026, including films, awards, and schedule.
- `pages/festival/fantasia-2026/index.vue` — Vue page component for displaying information about the Fantasia International Film Festival 2026, including films, awards, and schedule.
- `pages/festival/frightfest-2026/index.vue` — Vue page component for displaying information about the FrightFest 2026, including films, awards, and schedule.
- `pages/festival/kviff-2026/index.vue` — Vue page component for displaying information about the Karlovy Vary International Film Festival (KVIFF) 2026, including films, awards, and schedule.
- `pages/festival/locarno-2026/index.vue` — Vue page component for displaying information about the Locarno Film Festival 2026, including films, awards, and schedule.
- `pages/festival/romford-2026/index.vue` — Vue page component for displaying information about the Romford Horror Film Festival 2026, including films, awards, and schedule.
- `pages/festival/rotterdam-2026/index.vue` — Vue page component for displaying details, films, awards, and schedule for the Rotterdam Film Festival 2026, including search and navigation features.
- `pages/festival/slamdance-2026/index.vue` — Vue page component for displaying details, films, awards, and schedule for the Slamdance Film Festival 2026, including search and navigation features.
- `pages/festival/sundance-2026/index.vue` — Vue page component for displaying details, films, awards, and schedule for the Sundance Film Festival 2026, including search and navigation features.
- `pages/festival/sxsw-2026/index.vue` — Vue page component for displaying details, films, awards, and schedule for the SXSW Film Festival 2026, including search and navigation features.
- `pages/festival/tiff-2026/index.vue` — Vue page component for displaying details, films, awards, and schedule for the Toronto International Film Festival (TIFF) 2026, including search and navigation.
- `pages/festival/tribeca-2026/index.vue` — Vue page component for displaying details, films, awards, and schedule for the Tribeca Film Festival 2026, including search and navigation features.
- `pages/festival/venice-2026/index.vue` — Vue page component for displaying details, films, awards, and schedule for the Venice Film Festival 2026, including search and navigation features.
- `pages/genre/[id]/movie.vue` — Vue page component that displays a paginated list of movies filtered by a specific genre ID, fetching data from an API and handling 'load more' functionality.
- `pages/genre/[id]/tv.vue` — Displays a paginated list of TV shows belonging to a specific genre, fetching data from an external API and handling infinite scrolling.
- `pages/index.vue` — Serves as the homepage, displaying various carousels and banners for movies, TV shows, and film festivals, with dynamic content based on current dates.
- `pages/lists/[slug].vue` — Displays a specific user-created list of movies and TV shows, allowing the owner to rename and manage list items, and providing filtering and sorting options.
- `pages/lists/index.vue` — Displays a user's custom lists of movies and TV shows, allowing creation, editing, and deletion of lists, with filtering options for public/private lists.
- `pages/login/index.vue` — Serves as the login page, immediately opening an authentication modal for user login or registration upon being mounted.
- `pages/movie/[id].vue` — Displays detailed information for a specific movie, including an overview, credits, videos, images, soundtracks, and awards, with navigation between sections.
- `pages/movie/category/[name].vue` — Displays a paginated list of movies belonging to a specific category (e.g., trending, popular), fetching data from an external API and handling infinite scrolling.
- `pages/movie/followed.vue` — Displays movies from production companies or streaming platforms followed by the user.
- `pages/movie/index.vue` — Serves as the main movie discovery page, featuring various movie categories and allowing users to filter and browse content, with a toggle to switch to TV shows.
- `pages/news/[slug].vue` — Displays a detailed news article, including its content, related entities, and options for saving and sharing, with loading and error states.
- `pages/news/index.vue` — Displays the latest news, allowing users to filter by category, search for articles, and bookmark them. It integrates with a news API and user preferences.
- `pages/noir/index.vue` — Presents a curated archive of N.O.I.R. film and TV titles, allowing users to sort them and create a personal list from the archive.
- `pages/notifications/index.vue` — Displays user notifications about new content from followed entities (people, TV shows, companies, streaming services) and allows managing follow settings.
- `pages/person/[id].vue` — Displays detailed information about a person, including their biography, known-for credits, full filmography, and awards, with navigation for different sections.
- `pages/production-companies/index.vue` — Displays a grid of all supported production companies, sorted alphabetically, allowing users to browse and navigate to individual company pages.
- `pages/production/[slug].vue` — Displays details for a specific production company, including its movies and TV shows, with filtering and sorting options.
- `pages/recovery/index.vue` — Provides a password recovery interface where users can submit their email to receive a reset link, displaying a confirmation message upon submission.
- `pages/register/index.vue` — Serves as an entry point for user registration, immediately opening the authentication modal with the register tab active upon mounting.
- `pages/search/index.vue` — Displays search results for movies, TV shows, and people, including a loading state and a component to render the results.
- `pages/settings/index.vue` — Provides an interface for users to manage their account settings, including avatar, alias, email, password, and privacy preferences.
- `pages/streaming-services/index.vue` — Lists all available streaming services, allowing users to browse and navigate to individual service pages.
- `pages/streaming/[slug].vue` — Displays detailed information for a specific streaming platform, including movies and TV shows available, with filtering and sorting options.
- `pages/streaming/followed.vue` — Displays movies and TV shows from streaming platforms that the user follows.
- `pages/tv/[id].vue` — Displays detailed information for a specific TV show, including an overview, credits, episodes, videos, images, soundtracks, and awards.
- `pages/tv/category/[name].vue` — Displays a list of TV shows belonging to a specific category (e.g., trending, popular, top-rated), with infinite scrolling.
- `pages/tv/followed.vue` — Displays TV shows from followed companies, utilizing the FollowedContent component.
- `pages/tv/index.vue` — Serves as the main discovery page for TV shows, featuring popular, top-rated, on-air, and airing today categories, along with filtering options.
- `pages/u/[alias].vue` — Displays a public user profile page, including their avatar, reviews, and lists, with options to follow/unfollow the user.
- `pages/usage-policies/index.vue` — Displays the usage policies and privacy agreement for the Cinemagoria platform, including a table of contents for navigation.
- `pages/watchlist/index.vue` — Manages and displays a user's watchlist of movies and TV shows, allowing filtering, rating, and removal of items.
- `pages/wip/index.vue` — Displays a 'Work in Progress' page indicating that a section is under maintenance, with options to return home or view more information.

### `plugins`

- `plugins/bus.js` — Nuxt plugin that provides a global event bus using the mitt library for inter-component communication.
- `plugins/lazyload.js` — Nuxt plugin that registers a 'lazyload' Vue directive to dynamically set the 'src' attribute of an image element.

### `public`

- `public/manifest.json` — Defines the web application manifest for Cinemagoria, including its name, description, display properties, theme colors, and various icon sizes and purposes for PWA installation.
- `public/sw.js` — A self-destroying service worker script that unregisters itself upon activation and reloads all client pages, ensuring no caching or offline functionality is provided.
  - This file is explicitly marked as not to be version controlled.

### `scripts`

- `scripts/seed_tribeca_2026_awards.cjs` — One-shot script to seed the `festival_awards` table with 2026 Tribeca Festival feature film award winners, including bilingual fields (EN/ES).
  - Run with `node scripts/seed_tribeca_2026_awards.cjs`.
- `scripts/syncCustomOverrides.js` — Fetches custom title override data from the `title_overrides` Turso database table and writes it to a JSON file for public consumption.
- `scripts/syncHeroData.js` — Retrieves hero selection data from the `hero_selections` Turso database table and saves it as a JSON file for public use.
- `scripts/syncNoirEnrichmentData.js` — Fetches enrichment data for 'noir historical' titles from the `noir_historical` Turso database table and writes it to a JSON file.
- `scripts/syncNoirHistorical.js` — Synchronizes new hero selections into the `noir_historical` Turso database table, optionally fetching Spanish titles from TMDB.

### `server/api`

- `server/api/article-report.post.ts` — Handles POST requests to report issues with articles, sanitizing input and storing the report in the database.
  - Registers a POST route at /api/article-report.
- `server/api/article/[slug].get.ts` — Fetches a single article by its slug from the database, returning its details including localized content and related metadata.
  - Registers a GET route at /api/article/:slug.
- `server/api/article/rss.get.ts` — Provides a permanent redirect for the legacy RSS feed endpoint to the new canonical /feed URL.
  - Registers a GET route at /api/article/rss. Redirects to https://cinemagoria.com/feed.
- `server/api/articles/by-slugs.get.ts` — Retrieves a list of articles based on provided slugs, filtering for visible and published entries.
  - Registers a GET route at /api/articles/by-slugs.
- `server/api/awards/index-page.get.ts` — Serves award data for a specific award type and year, providing a structured list of categories and items.
  - Registers a GET route at /api/awards/index-page.
- `server/api/awards/index.get.ts` — Retrieves award information (Oscars, Golden Globes, festival awards) filtered by TMDB ID, name, title, or type.
  - Registers a GET route at /api/awards/index.
- `server/api/contact.post.ts` — Handles POST requests for the contact form, sanitizing input and storing the message in the database.
  - Registers a POST route at /api/contact.
- `server/api/festival-report.post.ts` — Handles POST requests to report issues with festival data, sanitizing input and storing the report in the database.
  - Registers a POST route at /api/festival-report.
- `server/api/festival/bafici/awards.get.ts` — Fetches and returns the awards data specifically for the BAFICI 2026 festival.
  - Registers a GET route at /api/festival/bafici/awards.
- `server/api/festival/bafici/films.get.ts` — API endpoint to fetch BAFICI 2026 film data from the database, optionally filtered by TMDB or IMDb ID, and enhance it with TMDB details.
  - exports: `default`
- `server/api/festival/bafici/schedule.get.ts` — API endpoint to retrieve the BAFICI 2026 festival screening schedule, joining film and screening data from the database.
  - exports: `default`
- `server/api/festival/berlinale/awards.get.ts` — API endpoint to fetch awards data for the Berlinale 2026 festival.
  - exports: `default`
- `server/api/festival/berlinale/films.get.ts` — API endpoint to fetch Berlinale 2026 film data from the database, optionally filtered by TMDB or IMDb ID, and enhance it with TMDB details.
  - exports: `default`
- `server/api/festival/berlinale/schedule.get.ts` — API endpoint to retrieve the Berlinale 2026 festival screening schedule, joining film and screening data from the database.
  - exports: `default`
- `server/api/festival/bifan/awards.get.ts` — API endpoint to fetch awards data for the BIFAN 2026 festival.
  - exports: `default`
- `server/api/festival/bifan/films.get.ts` — API endpoint to fetch BIFAN 2026 film data from the database, optionally filtered by TMDB or IMDb ID, and enhance it with TMDB details.
  - exports: `default`
- `server/api/festival/bifan/schedule.get.ts` — API endpoint to retrieve the BIFAN 2026 festival screening schedule, joining film and screening data from the database.
  - exports: `default`
- `server/api/festival/bifff/awards.get.ts` — API endpoint to fetch awards data for the BIFFF 2026 festival.
  - exports: `default`
- `server/api/festival/bifff/films.get.ts` — API endpoint to fetch BIFFF 2026 film data from the database, optionally filtered by TMDB or IMDb ID, and enhance it with TMDB details.
  - exports: `default`
- `server/api/festival/bifff/schedule.get.ts` — API endpoint to retrieve the schedule of film screenings for the BIFFF 2026 festival, including film details and screening information from the database.
  - Registers a GET route for /api/festival/bifff/schedule.
- `server/api/festival/cannes/awards.get.ts` — API endpoint to fetch the awards for the Cannes Film Festival 2026 by delegating to a utility function.
  - Registers a GET route for /api/festival/cannes/awards.
- `server/api/festival/cannes/films.get.ts` — API endpoint to retrieve a list of films for the Cannes Film Festival 2026, with optional filtering by TMDB or IMDb ID.
  - Registers a GET route for /api/festival/cannes/films.
- `server/api/festival/cannes/schedule.get.ts` — API endpoint to retrieve the schedule of film screenings for the Cannes Film Festival 2026, including film details and screening information.
  - Registers a GET route for /api/festival/cannes/schedule.
- `server/api/festival/cuff/awards.get.ts` — API endpoint to fetch the awards for the Calgary Underground Film Festival (CUFF) 2026 by delegating to a utility function.
  - Registers a GET route for /api/festival/cuff/awards.
- `server/api/festival/cuff/films.get.ts` — API endpoint to retrieve a list of films for the Calgary Underground Film Festival (CUFF) 2026, with optional filtering by TMDB or IMDb ID.
  - Registers a GET route for /api/festival/cuff/films.
- `server/api/festival/cuff/schedule.get.ts` — API endpoint to retrieve the schedule of film screenings for the Calgary Underground Film Festival (CUFF) 2026, including film details and screening information.
  - Registers a GET route for /api/festival/cuff/schedule.
- `server/api/festival/fantasia/awards.get.ts` — API endpoint to fetch the awards for the Fantasia International Film Festival 2026 by delegating to a utility function.
  - Registers a GET route for /api/festival/fantasia/awards.
- `server/api/festival/fantasia/films.get.ts` — API endpoint to retrieve a list of films for the Fantasia International Film Festival 2026, with optional filtering by TMDB or IMDb ID.
  - Registers a GET route for /api/festival/fantasia/films.
- `server/api/festival/fantasia/schedule.get.ts` — API endpoint to retrieve the schedule of film screenings for the Fantasia International Film Festival 2026, including film details and screening information.
  - Registers a GET route for /api/festival/fantasia/schedule.
- `server/api/festival/films-batch.get.ts` — API endpoint to fetch a batch of festival films for multiple festivals, supporting filtering by year and limiting results per festival, with an option for a slimmed-down film data projection.
  - Registers a GET route for /api/festival/films-batch.
- `server/api/festival/frightfest/films.get.ts` — API endpoint to fetch films for the FrightFest 2026 festival, supporting filtering by TMDB or IMDb ID and limiting the number of results.
  - Registers a GET route for /api/festival/frightfest/films.
- `server/api/festival/frightfest/schedule.get.ts` — API endpoint to retrieve the schedule of screenings for FrightFest 2026, including film details and screening information.
  - Registers a GET route for /api/festival/frightfest/schedule.
- `server/api/festival/kviff/awards.get.ts` — API endpoint to fetch awards data specifically for the Karlovy Vary International Film Festival (KVIFF) 2026.
  - Registers a GET route for /api/festival/kviff/awards.
- `server/api/festival/kviff/films.get.ts` — API endpoint to fetch films for the Karlovy Vary International Film Festival (KVIFF) 2026, supporting filtering by TMDB or IMDb ID and limiting results.
  - Registers a GET route for /api/festival/kviff/films.
- `server/api/festival/kviff/schedule.get.ts` — API endpoint to retrieve the schedule of screenings for the Karlovy Vary International Film Festival (KVIFF) 2026, including film details and screening information.
  - Registers a GET route for /api/festival/kviff/schedule.
- `server/api/festival/locarno/awards.get.ts` — API endpoint to fetch awards data specifically for the Locarno Film Festival 2026.
  - Registers a GET route for /api/festival/locarno/awards.
- `server/api/festival/locarno/films.get.ts` — API endpoint to fetch films for the Locarno Film Festival 2026, supporting filtering by TMDB or IMDb ID and limiting the number of results.
  - Registers a GET route for /api/festival/locarno/films.
- `server/api/festival/locarno/schedule.get.ts` — API endpoint to retrieve the schedule of screenings for the Locarno Film Festival 2026, including film details and screening information.
  - Registers a GET route for /api/festival/locarno/schedule.
- `server/api/festival/romford/awards.get.ts` — API endpoint to fetch awards data specifically for the Romford Film Festival 2026.
  - Registers a GET route for /api/festival/romford/awards.
- `server/api/festival/romford/films.get.ts` — API endpoint to retrieve a list of films for the Romford Horror Festival 2026, with optional filtering by TMDB or IMDb ID and result limiting.
- `server/api/festival/romford/schedule.get.ts` — API endpoint to fetch the screening schedule for the Romford Horror Festival 2026, including film details and screening information.
- `server/api/festival/rotterdam/awards.get.ts` — API endpoint to fetch the awards for the Rotterdam Film Festival 2026.
- `server/api/festival/rotterdam/films.get.ts` — API endpoint to retrieve a list of films for the Rotterdam Film Festival 2026, with optional filtering by TMDB or IMDb ID, sorting, and limiting.
- `server/api/festival/rotterdam/schedule.get.ts` — API endpoint to fetch the screening schedule for the Rotterdam Film Festival 2026, including film details and screening information.
- `server/api/festival/slamdance/awards.get.ts` — API endpoint to fetch the awards for the Slamdance Film Festival 2026.
- `server/api/festival/slamdance/films.get.ts` — API endpoint to retrieve a list of films for the Slamdance Film Festival 2026, with optional filtering by TMDB or IMDb ID and result limiting.
- `server/api/festival/slamdance/schedule.get.ts` — API endpoint to fetch the screening schedule for the Slamdance Film Festival 2026, including film details and screening information.
- `server/api/festival/status.get.ts` — API endpoint to fetch the festival status for a given TMDB ID and year, indicating which festivals a film is part of.
  - Requires 'tmdb_id' query parameter. Defaults to year 2026 if not specified.
- `server/api/festival/sundance/awards.get.ts` — API endpoint to fetch the awards for the Sundance Film Festival 2026.
- `server/api/festival/sundance/films.get.ts` — API endpoint to retrieve a list of films for the Sundance Film Festival 2026, with optional filtering by TMDB/IMDb ID, sorting, and limiting.
  - Filters films by release year >= 2025. Includes special sorting logic for 'rating' query parameter based on a predefined list of featured titles.
- `server/api/festival/sundance/schedule.get.ts` — API endpoint to retrieve the schedule of film screenings for the 2026 Sundance Film Festival from the database, including film details and screening information.
- `server/api/festival/sxsw/awards.get.ts` — API endpoint to fetch the awards for the 2026 SXSW Film & TV Festival by delegating to a utility function.
- `server/api/festival/sxsw/films.get.ts` — API endpoint to retrieve a list of films for the 2026 SXSW Film & TV Festival, supporting filtering by TMDB/IMDB ID, sorting, and limiting results.
- `server/api/festival/sxsw/schedule.get.ts` — API endpoint to retrieve the schedule of film screenings for the 2026 SXSW Film & TV Festival from the database, including film details and screening information.
- `server/api/festival/tiff/awards.get.ts` — API endpoint to fetch the awards for the 2026 Toronto International Film Festival by delegating to a utility function.
- `server/api/festival/tiff/films.get.ts` — API endpoint to retrieve a list of films for the 2026 Toronto International Film Festival, supporting filtering by TMDB/IMDB ID and limiting results.
- `server/api/festival/tiff/schedule.get.ts` — API endpoint to retrieve the schedule of film screenings for the 2026 Toronto International Film Festival from the database, including film details and screening information.
- `server/api/festival/tribeca/awards.get.ts` — API endpoint to fetch the awards for the 2026 Tribeca Festival by delegating to a utility function.
- `server/api/festival/tribeca/films.get.ts` — API endpoint to retrieve a list of films for the 2026 Tribeca Festival, supporting filtering by TMDB/IMDB ID and limiting results.
- `server/api/festival/tribeca/schedule.get.ts` — API endpoint to retrieve the schedule of film screenings for the 2026 Tribeca Festival from the database, including film details and screening information.
- `server/api/festival/venice/awards.get.ts` — API endpoint to fetch the awards for the 2026 Venice Film Festival by delegating to a utility function.
- `server/api/festival/venice/films.get.ts` — API endpoint to retrieve a list of films for the 2026 Venice Film Festival, supporting filtering by TMDB/IMDB ID and limiting results.
- `server/api/festival/venice/schedule.get.ts` — Fetches the schedule of films and their screening details for the Venice Film Festival 2026 from the database.
  - Registers a GET route for /api/festival/venice/schedule.
- `server/api/hero.get.ts` — Retrieves a selection of hero items (films/TV shows) from the database, enriches them with festival status, and formats them for display.
  - Registers a GET route for /api/hero.
- `server/api/imdb-rating/[id].get.ts` — Fetches the IMDb rating and vote count for a given media ID from a separate LibSQL database.
  - Registers a GET route for /api/imdb-rating/[id].
- `server/api/news.get.ts` — Fetches news articles, supporting pagination, language filtering, source filtering, and search queries from the database.
  - Registers a GET route for /api/news.
- `server/api/noir-archive.get.ts` — Retrieves a list of films and TV shows from the 'noir_historical' table, ordered by release date, from a LibSQL database.
  - Registers a GET route for /api/noir-archive.
- `server/api/progress/[userId]/[mediaType]/[mediaId].delete.ts` — Deletes a user's progress tracking entry for a specific media item (movie or episode).
  - Registers a DELETE route for /api/progress/[userId]/[mediaType]/[mediaId].
- `server/api/progress/[userId]/[mediaType]/[mediaId].get.ts` — Retrieves a user's progress tracking details for a specific media item (movie or episode).
  - Registers a GET route for /api/progress/[userId]/[mediaType]/[mediaId].
- `server/api/progress/[userId]/[mediaType]/[mediaId].put.ts` — Updates or inserts a user's progress tracking for a specific media item (movie or episode), including TV series details.
  - Registers a PUT route for /api/progress/[userId]/[mediaType]/[mediaId].
- `server/api/progress/[userId]/active/[mediaType]/[mediaId].put.ts` — Updates the 'manually_active' flag for a user's progress tracking entry for a specific media item.
  - Registers a PUT route for /api/progress/[userId]/active/[mediaType]/[mediaId].
- `server/api/progress/[userId]/batch.put.ts` — Performs a batch update of a user's progress tracking for multiple episodes, setting a common completion percentage.
  - Registers a PUT route for /api/progress/[userId]/batch.
- `server/api/progress/[userId]/hydrated.get.ts` — Fetches a user's progress data, enriching it with hydrated movie and TV show details from TMDB, utilizing caching for performance.
- `server/api/progress/[userId]/index.get.ts` — Retrieves a user's raw progress tracking data from the database, ordered by the most recent updates.
  - Registers GET /api/progress/:userId
- `server/api/search-log.post.ts` — Logs user search queries to a separate database, optionally including analytics data like origin IP and email.
  - Registers POST /api/search-log
- `server/api/search/person.get.ts` — Searches for people (actors, directors, etc.) using the TMDB API based on a provided query string.
  - Registers GET /api/search/person
- `server/api/spotlight/[type].get.ts` — Fetches curated spotlight media (movies or TV shows) from the database, formatting the results with additional metadata.
  - Registers GET /api/spotlight/:type (where type is 'movies' or 'tv')

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

- `server/utils/db.ts` — Provides utility functions for connecting to a Turso database and executing queries with a timeout, ensuring database configuration is present.
  - exports: `useDb`, `dbExecute`
- `server/utils/rss-feed.ts` — Constructs an RSS news feed, supporting both English and Spanish languages, by querying a database and formatting the results with Markdown and oEmbed data.
  - exports: `buildNewsFeed`
- `server/utils/vimeo-oembed.ts` — Fetches and caches oEmbed metadata for Vimeo videos, including thumbnail URLs, to avoid repeated API requests and provide a deterministic thumbnail path.
  - exports: `getVimeoOembed`, `getVimeoThumb`
- `server/utils/festivalAwards.ts` — Fetches festival award data from the database for a given festival slug, supporting English and Spanish locales with fallback text.
  - exports: `fetchFestivalAwards`
- `server/utils/festivals.ts` — Provides mappings between festival slugs and names, and a function to retrieve festival participation status for a batch of TMDb IDs.
  - exports: `FESTIVAL_NAME_BY_SLUG`, `NAME_TO_SLUG`, `getFestivalStatusByTmdbId`
- `server/utils/sitemap-helpers.ts` — Provides utilities for fetching movie/TV show IDs from TMDb across multiple pages and generating an XML sitemap from a list of IDs.
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

- `utils/api.js` — Provides an Axios-like API client for interacting with TMDB and internal APIs, including methods for data fetching, enrichment, and managing excluded movie/TV IDs.
  - exports: `apiImgUrl`, `EXCLUDED_MOVIE_IDS`, `EXCLUDED_TV_IDS`, `getHeroEnrichment`, `getNoirEnrichment`, `getCustomEnrichment`, `resolveItemPoster`, `languages`, `getListItem`, `getIMDbRatingFromDB`, `getMovies`
- `utils/categoryLabels.js` — Defines and provides utility functions for retrieving human-readable display labels for editorial content categories based on their canonical database tokens.
  - exports: `CATEGORY_LABELS`, `categoryLabel`
- `utils/countries.js` — Exports a comprehensive list of countries, each with a two-letter ISO 3166-1 alpha-2 code and its full name.
  - exports: `countries`
- `utils/helpers.js` — Provides utility functions for formatting dates, handling image loading errors by falling back to alternative sources or placeholders, and determining a movie's release status context.
  - exports: `formatDate`, `handleImageError`, `getReleaseStatusContext`
- `utils/itemMapper.js` — Maps a raw item object (e.g., from an external API) to a standardized payload format suitable for database storage, inferring missing fields where possible.
  - exports: `mapItemToDbPayload`
- `utils/membershipStore.js` — Manages a session-wide cache for user membership data (watchlist and custom lists) to reduce API requests, with mechanisms for invalidation and coalescing.
  - exports: `invalidateMembershipCache`, `getMembership`
- `utils/musicbrainz.js` — Provides functions to interact with the MusicBrainz API for searching soundtracks by query and year, retrieving album tracks for a given release group, and generating MusicBrainz URLs.
  - exports: `searchSoundtracks`, `getAlbumTracks`, `getMusicBrainzUrl`
- `utils/newsSources.js` — Defines lists of supported English news sources and their corresponding URLs for articles.
  - exports: `SOURCES`, `SOURCE_URLS`
- `utils/relatedFooter.js` — Provides utilities to strip 'Related Articles' footers from article body content, supporting both Markdown and legacy HTML formats, and to extract related article slugs.
  - exports: `stripRelatedFooter`, `extractRelatedSlugs`
- `utils/resolvePhase.js` — A deprecated, intentionally empty file that previously contained logic for resolving content phases, now handled by a backend cron job.
  - DEPRECATED: Do not use. This file is intentionally left empty and will be removed.
- `utils/tvTrailer.js` — Provides functions for resolving the best and most relevant trailer for a TV series, prioritizing the latest season's trailers over series-level videos.
  - exports: `TV_TRAILER_MAX_SEASON_PROBES`, `TV_TRAILER_MAX_PLAYABILITY_CHECKS`, `tvVideoClass`, `rankTvVideo`, `tvVideoGroup`, `isUsableSeasonTrailer`, `pickBestTvVideo`, `resolveTvTrailer`

## Dependency Edges

| From | To | Imports |
| :--- | :--- | ---: |
| `server/api` | `server/data` | 2 |
| `server/routes` | `server/utils` | 1 |

## External Packages (imported in code)

- `~` (438 imports)
- `~~` (61 imports)
- `h3` (56 imports)
- `vue` (46 imports)
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
