# Module Map

## Modules

### `.github`

- `.github/FUNDING.yml` — Configures various platforms for project funding, specifying usernames for GitHub and Buy Me a Coffee, and placeholders for others.
- `.github/workflows/gitset-knowledge.yml` — Defines a GitHub Actions workflow to incrementally refresh the project's AI knowledge base using Gitset, creating a pull request for changes.
  - Registers 'workflow_dispatch' and 'push' on 'main' branch (excluding docs, markdown, gitignore, LICENSE) as triggers.
- `.github/workflows/sync-hero-data.yml` — Automates the synchronization of hero enrichment data from a Turso database into JSON files, committing and pushing updates.
  - Registers 'schedule' (cron: '0 6 * * *') and 'workflow_dispatch' as triggers.
- `.github/workflows/sync-noir-historical.yml` — Automates the synchronization of N.O.I.R historical data and regenerates noir enrichment data, committing the updated JSON file.
  - Registers 'workflow_dispatch' as a trigger.

### `(root)`

- `app.vue` — Root Vue component for the Cinemagoria application, defining the main layout and injecting structured data (Schema.org) for SEO.
- `cloudbuild.yaml` — Google Cloud Build configuration for building, pushing, and deploying the Cinemagoria Docker image to Google Cloud Run.
- `Dockerfile` — Defines the Docker image for the Cinemagoria application, including build arguments for Supabase and a multi-stage build process.
- `nuxt.config.ts` — Nuxt.js configuration file, setting up aliases, compatibility, devtools, and defining route rules with cache-control headers for various paths.
  - exports: `default`
- `package.json` — Defines the Cinemagoria project's metadata, scripts for development and build, dependency resolutions, and lists all required packages.
  - Contains scripts: build, dev, generate, preview, postinstall.
- `tsconfig.json` — TypeScript configuration file for the Nuxt.js project, referencing generated tsconfig files from the .nuxt directory.

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
- `components/global/UserNav.vue` — Displays user navigation elements including notifications, avatar, and a dropdown menu with profile links and logout functionality.
- `components/BaficiCard.vue` — A card component specifically for displaying BAFICI festival film information, including a link to its official page and quick actions.
- `components/BerlinaleCard.vue` — A card component specifically for displaying Berlinale festival film information, including a link to its official page and quick actions.
- `components/BifffCard.vue` — A card component specifically for displaying BIFFF festival film information, including a link to its official page and quick actions.
- `components/CannesCard.vue` — A card component specifically for displaying Cannes festival film information, including a link to its official page and quick actions.
- `components/CannesLiveBanner.vue` — A banner component promoting live coverage of the Cannes 2026 festival, featuring a dynamic background and festival branding.
- `components/CannesWinnersBanner.vue` — A banner component promoting the winners of the Cannes 2026 festival, featuring a dynamic background and festival branding.
- `components/Card.vue` — A generic card component for displaying media items (movies, TV shows, etc.) with poster, title, release year, rating, and quick favorite actions.
- `components/common/AwardsTab.vue` — Displays a tabbed interface for various film awards (Oscars, Golden Globes, Palme d'Or, Golden Lion, Golden Bear) for a given movie, TV show, or person.
- `components/common/FullCreditsModal.vue` — A modal component that displays the full crew credits for a given title, organized by department with collapsible sections.
- `components/common/MediaProgressBar.vue` — A component displaying a circular progress bar and slider for media viewing progress, showing watched duration and total duration.
- `components/Credits.vue` — Displays a horizontal carousel of cast members (people) for a movie or TV show, allowing users to scroll through and view individual credit items.
- `components/CreditsItem.vue` — Renders an individual cast member's credit item, displaying their image, name, and character, with a link to their person detail page.
- `components/CuffCard.vue` — Displays a card for a movie or TV show item, including an image, title, and quick actions like adding to favorites or opening an external source URL.
- `components/CustomListingCategoriesMovies.vue` — Presents a horizontal carousel of movie categories, allowing users to browse and explore different genres or curated lists.
- `components/CustomListingCategoriesSeries.vue` — Presents a horizontal carousel of TV series categories, allowing users to browse and explore different genres or curated lists.
- `components/Discover.vue` — Provides a comprehensive discovery interface for movies and TV shows, allowing users to filter and sort content by genre, country, language, and more.
- `components/DynamicSearchCarousel.vue` — Displays a dynamic horizontal carousel of search results for movies or TV shows, featuring a title and navigation buttons.
- `components/ExternalLinks.vue` — Displays a grid of external links related to a movie or TV show, including IMDb, Letterboxd, Rotten Tomatoes, Trakt, and TMDb.
- `components/FantasiaCard.vue` — Displays a card for a movie or TV show item, including an image, title, and quick actions like adding to favorites or opening an external source URL.
- `components/FantasiaLiveBanner.vue` — Displays a promotional banner for the Fantasia 2026 festival, linking to its coverage page.
- `components/FeatureDescription.vue` — Displays a prominent marketing feature description with a title, subtitle, and cinematic light effects, designed to be responsive across different screen sizes.
  - exports: `default`
- `components/festival/BaficiBadge.vue` — Displays a clickable badge for the BAFICI Film Festival 2026, featuring its logo with hover effects and responsive sizing.
- `components/festival/BerlinaleBadge.vue` — Displays a clickable badge for the Berlinale Film Festival 2026, featuring its logo with hover effects and responsive sizing.
- `components/festival/BifffBadge.vue` — Displays a clickable badge for the BIFFF Film Festival 2026, featuring its logo with hover effects and responsive sizing.
- `components/festival/CannesAcidBadge.vue` — Displays a clickable badge for the Cannes Film Festival 2026 ACID section, featuring its logo with hover effects and responsive sizing.
- `components/festival/CannesBadge.vue` — Displays a clickable badge for the main Cannes Film Festival 2026, featuring its logo with hover effects and responsive sizing.
- `components/festival/CannesCriticsChoiceBadge.vue` — Displays a clickable badge for the Cannes Film Festival 2026 Critics' Choice section, featuring its logo with hover effects and responsive sizing.
- `components/festival/CannesQuinzaineBadge.vue` — Displays a clickable badge for the Cannes Film Festival 2026 Quinzaine des Cinéastes section, featuring its logo with hover effects and responsive sizing.
- `components/festival/CuffBadge.vue` — Displays a clickable badge for the Calgary Underground Film Festival (CUFF) 2026, featuring its logo with hover effects and responsive sizing.
- `components/festival/FantasiaBadge.vue` — Displays a clickable badge for the Fantasia International Film Festival 2026, featuring its logo with hover effects and responsive sizing.
- `components/festival/FrightfestBadge.vue` — Displays a clickable badge for the FrightFest 2026, featuring its logo with hover effects and responsive sizing.
- `components/festival/KviffBadge.vue` — Displays a clickable badge for the Karlovy Vary International Film Festival (KVIFF) 2026, featuring its logo with hover effects and responsive sizing.
- `components/festival/RomfordBadge.vue` — Displays a clickable badge for the Romford Horror Film Festival 2026, featuring its logo with hover effects and responsive sizing.
- `components/festival/RotterdamBadge.vue` — Displays a clickable badge for the Rotterdam Film Festival 2026, featuring its logo with hover effects and responsive sizing.
- `components/festival/SlamdanceBadge.vue` — Displays a clickable badge for the Slamdance Film Festival 2026, featuring its logo with hover effects and responsive sizing.
- `components/festival/SundanceBadge.vue` — Displays a clickable badge for the Sundance Film Festival 2026, featuring its logo with hover effects and responsive sizing.
- `components/festival/SxswBadge.vue` — Displays a clickable badge for the SXSW Film & TV Festival 2026, featuring its logo with hover effects and responsive sizing.
- `components/festival/SxswCard.vue` — A Vue component representing a card for an SXSW festival item, including a link, quick actions, and a loader for images.
  - exports: `default`
- `components/festival/TribecaBadge.vue` — Displays a clickable badge for the Tribeca Festival 2026, featuring its logo with hover effects and responsive sizing.
- `components/festival/VeniceBadge.vue` — Displays a clickable badge for the Venice Film Festival 2026, featuring its logo with hover effects and responsive sizing.
- `components/festival/WinnersCarousel.vue` — A Vue component displaying a horizontal carousel of film festival winners, grouped by award and sortable, with navigation controls and a stat display.
- `components/FestivalDataDisclaimer.vue` — Provides a button to open a modal explaining data coverage limitations for festivals and allows users to report missing films or data issues.
- `components/FestivalsCarousel.vue` — Displays a horizontal carousel of festival cards, with navigation buttons and an optional 'Explore All' link.
- `components/FollowedContent.vue` — Displays content (movies/TV shows) from followed production companies or streaming platforms, with filtering and sorting options.
- `components/FrightfestCard.vue` — Renders a card for a Frightfest film, including an image, title, year, and quick actions like favoriting or opening the source URL.
- `components/global/ArticleAIDisclosure.vue` — Displays a disclosure indicating an article was AI-generated and provides a button to report errors or inaccuracies.
- `components/global/ArticleShareModal.vue` — Provides a modal for sharing articles via link copy, native share, or various social media platforms.
- `components/global/AuthModal.vue` — Presents a modal for user authentication, allowing users to sign in or register with email and password.
- `components/global/CardActions.vue` — Provides a dropdown menu of actions for a content card, including rating, adding to a list, or marking as watched/unwatched.
- `components/global/CookieConsent.vue` — Manages and displays a cookie consent banner and a preferences panel, allowing users to accept all, decline all, or customize cookie settings.
- `components/global/CreateListModal.vue` — Provides a modal for users to create a new custom list, specifying its name, description, and privacy settings.
- `components/global/FollowingModal.vue` — Manages and displays a modal for users to view and manage the people, TV shows, production companies, and streaming services they follow.
- `components/global/Footer.vue` — Provides a global footer with links to resources, social media, and copyright information.
- `components/global/InstallPrompt.vue` — Displays a prompt at the bottom of the screen asking the user if they want to add 'Cinemagoria' to their home screen.
- `components/global/MyListsModal.vue` — Provides a modal component for managing user-defined lists, allowing items to be added, moved, or removed from various lists.
- `components/global/Nav.vue` — Implements the main navigation bar for the application, including links to home, discover, and user-specific lists.
- `components/global/NewsCarousel.vue` — Displays a carousel of the latest news articles, with navigation controls and a link to explore all news.
- `components/global/ProgressTrackingModal.vue` — Manages and displays a modal for users to track their watch progress for movies and TV shows, including episode-level tracking.
- `components/global/QuickFav.vue` — Provides a quick favorite button component that allows users to add or manage items in their lists, opening a modal for list selection.
- `components/global/QuickFavModal.vue` — Displays a confirmation modal for removing an item from the user's watchlist, interacting with a backend API.
- `components/global/RatedModal.vue` — Manages and displays a modal for users to view and manage their rated movies and TV shows, including editing ratings and reviews.
- `components/global/RelatedArticlesCarousel.vue` — Displays a carousel of related news articles, allowing users to scroll through suggestions based on current content.
- `components/global/SearchForm.vue` — Provides a search input form with autocomplete suggestions, trending media, and user avatar/name display.
- `components/global/TopNav.vue` — Provides a fixed top navigation bar component for mobile viewports, displaying a title and handling responsive styling.
- `components/Hero.vue` — Displays a hero section, potentially with auto-advancing items, and includes functionality for touch/wheel navigation, festival badge mapping, and user interaction.
- `components/HowItWorksModal.vue` — Presents a modal explaining how release alerts work, featuring an introductory section and a carousel for content.
- `components/Images.vue` — Displays a collection of images (posters or backdrops) with a title and count, allowing users to open a modal to view them in a gallery.
- `components/ImagesItem.vue` — Renders an individual image item within a gallery, displaying a thumbnail with a loader and emitting an event to open a modal on click.
- `components/KviffCard.vue` — Renders a card component for KVIFF festival items, including an image, quick actions like external links, and context-specific actions.
- `components/KviffLiveBanner.vue` — Provides a banner component for the KVIFF 2026 festival, linking to its coverage page and featuring a specific background and logo.
- `components/Listing.vue` — Displays a list of items, optionally with a title and a 'view all' link, and supports infinite scrolling to load more items.
- `components/ListingCarousel.vue` — Displays a carousel listing of items, with navigation buttons and optional 'view all' functionality, supporting compact mode for smaller cards.
- `components/Loader.vue` — Provides a reusable loading spinner component with customizable size and color.
- `components/MediaNav.vue` — A navigation component that displays a list of buttons, allowing users to select an active item and emitting an event when a button is clicked.
- `components/Modal.vue` — A reusable modal component that can display various content types (image, iframe, gallery) and includes navigation for galleries, with accessibility features for focus management.
- `components/movie/MovieInfo.vue` — Displays detailed information about a movie, including its poster, overview, external links, release status, awards, and recommendations.
- `components/movie/MovieReleases.vue` — Displays grouped release information for a movie, showing release dates by country and type, with a loading indicator and a message for no available data.
- `components/music/SoundtrackGroup.vue` — Groups and displays a list of soundtrack items, typically by year, within a larger soundtrack listing.
- `components/music/SoundtrackItem.vue` — Displays a single soundtrack item with its title, disambiguation, and artist, linking to its MusicBrainz page.
- `components/music/SoundtrackList.vue` — Displays a list of soundtrack albums and their tracks, allowing users to play tracks via YouTube, with loading and error states.
- `components/NoirModal.vue` — A modal component displaying information about 'N.O.I.R' (Nothing Out Is Ready), including a manifesto and a button to join a waiting list.
- `components/OscarsCarousel.vue` — A carousel component displaying information about the 98th Academy Awards, including nominees and winners, with navigation controls.
- `components/OscarsLiveBanner.vue` — A banner component for the 98th Academy Awards, indicating live coverage or results, and displaying a ticker of winners.
- `components/person/CreditsHistory.vue` — Displays a person's credit history, allowing filtering by department and media type (combined, movie, TV) and grouping credits by year.
- `components/person/CreditsHistoryGroup.vue` — Groups and displays a list of credit history items for a person, typically by year, within a larger credit history listing.
- `components/person/CreditsHistoryItem.vue` — Displays a single credit history item for a person, including the title, episode count (for TV), and role, linking to the respective media page.
- `components/person/PersonAwardsTab.vue` — Displays a person's awards, categorized by event (Oscars, Golden Globes, Palme, Golden Lion, Golden Bear), with sorting and navigation to associated films.
- `components/person/PersonInfo.vue` — Displays detailed information about a person, including biography, birth/death dates, known for department, and award counts, with follow functionality.
- `components/ProductionCompanyCarousel.vue` — A carousel component for displaying popular production companies, allowing users to navigate through them and view details.
- `components/ProductionHero.vue` — Displays a hero section for a production company, including its name, logo, country, headquarters, description, and a follow button.
- `components/RomfordCard.vue` — Displays a card for a Romford film festival entry, including an image, quick actions like external links, and a link to its detail page.
- `components/RotterdamCard.vue` — Displays a card for a Rotterdam film festival entry, including an image, quick actions like external links, and a link to its detail page.
- `components/search/CategoryCarousel.vue` — A carousel component for displaying items within a search category, with collapsible sections and navigation controls.
- `components/search/CategorySection.vue` — Displays a section of search results for a specific category, with a collapsible header and a grid of Card components.
- `components/search/DiscoverSearch.vue` — Provides a discovery interface for movies and TV shows, allowing users to filter by type, genre, sort options, country, network, language, provider, and vote count.
- `components/search/NewsResultCard.vue` — Displays a single news article as a card, including its image, source, date, title, and a sanitized description, with a link to the full article.
- `components/search/SearchGuideModal.vue` — Provides a modal dialog explaining the various search functionalities and tips available within Cinemagoria.
- `components/search/SearchResults.vue` — Displays search results for various content types (movies, series, people, news, users) with filtering, pagination, and a typo-checking feature.
- `components/SlamdanceCard.vue` — A specialized card component for displaying Slamdance Festival items, including an image, title, and actions like external links and quick favoriting.
- `components/SpotlightCarousel.vue` — A reusable carousel component for displaying a collection of items in a horizontal scrollable list, often used for featured content or 'spotlight' sections.
- `components/StreamingPlatformCarousel.vue` — Displays a carousel of popular streaming services, allowing users to browse and navigate to individual platform pages.
- `components/StreamingPlatformHero.vue` — Displays a hero section for a streaming platform, showing its name, logo, and a follow/unfollow button, with authentication integration.
- `components/SundanceCard.vue` — A specialized card component for displaying Sundance Festival items, including an image, title, and actions like external links and quick favoriting.
- `components/TribecaCard.vue` — A specialized card component for displaying Tribeca Festival items, including an image, title, and actions like external links and quick favoriting.
- `components/TribecaLiveBanner.vue` — A promotional banner linking to the Tribeca 2026 festival coverage, featuring a background gradient and the festival logo.
- `components/tv/Episodes.vue` — Vue component for displaying and managing TV show episodes, allowing users to select seasons and mark episodes/seasons as watched.
- `components/tv/EpisodesItem.vue` — Vue component for displaying a single TV show episode with progress tracking functionality and a modal for updating watch progress.
- `components/tv/TvInfo.vue` — Vue component that displays detailed information about a TV show, including storyline, cast, crew, recommendations, and external links.
- `components/VeniceCard.vue` — Vue component representing a card for an item, typically a movie, with an image, title, and quick actions like favoriting or opening an external link.
- `components/Videos.vue` — Vue component for displaying a collection of videos, allowing filtering by type and playing videos in a modal.
- `components/VideosItem.vue` — Vue component for displaying a single video item with a thumbnail, duration, and play button, emitting an event to open a modal on click.
- `components/WatchOn.vue` — Vue component to display a grid of streaming providers where a movie or TV show can be watched, with links to external services.
- `components/YearPicker.vue` — Vue component for selecting a release year, providing a dropdown with years ranging from a configurable minimum to the current year, and emitting the selected value.

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

- `pages/auth-success.vue` — Handles post-authentication success or failure, displaying loading, error, or success states and redirecting the user after a countdown.
- `pages/awards/index.vue` — Displays a comprehensive list of major film awards, allowing users to browse winners and nominees by award type and year, with navigation to related movies and media.
- `pages/changelog/index.vue` — Renders a changelog page by fetching and displaying release notes directly from the GitHub repository, including features, fixes, and improvements.
- `pages/contact/index.vue` — Provides a contact form for users to submit inquiries related to their account, watchlist, or other platform-related issues, with success/error states.
- `pages/faq/index.vue` — Presents a Frequently Asked Questions (FAQ) page with an interactive table of contents and expandable sections explaining the platform's framework and infrastructure.
- `pages/festival/bafici-2026/index.vue` — Displays detailed information for the BAFICI 2026 film festival, including films, awards, and schedule, with interactive navigation and search functionalities.
- `pages/festival/berlinale-2026/index.vue` — Displays detailed information for the Berlinale 2026 film festival, including films, awards, and schedule, with interactive navigation and search functionalities.
- `pages/festival/bifff-2026/index.vue` — Displays detailed information for the BIFFF 2026 film festival, including films, awards, and schedule, with interactive navigation and search functionalities.
- `pages/festival/cannes-2026/index.vue` — Displays detailed information for the Cannes Film Festival 2026, including films, awards, and schedule, with interactive navigation and search functionalities.
- `pages/festival/cuff-2026/index.vue` — Vue page component for displaying details of the Calgary Underground Film Festival (CUFF) 2026, including films, schedule, and awards, with interactive navigation and search.
- `pages/festival/fantasia-2026/index.vue` — Vue page component for displaying details of the Fantasia International Film Festival 2026, including films, schedule, and awards, with interactive navigation and search.
- `pages/festival/frightfest-2026/index.vue` — Vue page component for displaying details of the FrightFest 2026, including films, schedule, and awards, with interactive navigation and search.
- `pages/festival/kviff-2026/index.vue` — Vue page component for displaying details of the Karlovy Vary International Film Festival (KVIFF) 2026, including films, schedule, and awards, with interactive navigation and search.
- `pages/festival/romford-2026/index.vue` — Vue page component for displaying details of the Romford Horror Film Festival 2026, including films, schedule, and awards, with interactive navigation and search.
- `pages/festival/rotterdam-2026/index.vue` — Vue page component for displaying details of the International Film Festival Rotterdam (IFFR) 2026, including films, schedule, and awards, with interactive navigation and search.
- `pages/festival/slamdance-2026/index.vue` — Vue page component for displaying details of the Slamdance Film Festival 2026, including films, schedule, and awards, with interactive navigation and search.
- `pages/festival/sundance-2026/index.vue` — Vue page component for displaying details, films, and schedule for the Sundance Film Festival 2026, including dynamic content loading and interactive elements.
- `pages/festival/sxsw-2026/index.vue` — Vue page component for displaying details, films, and schedule for the SXSW Film Festival 2026, including dynamic content loading and interactive elements.
- `pages/festival/tribeca-2026/index.vue` — Vue page component for displaying details, films, and schedule for the Tribeca Film Festival 2026, including dynamic content loading and interactive elements.
- `pages/festival/venice-2026/index.vue` — Vue page component for displaying details, films, and schedule for the Venice Film Festival 2026, including dynamic content loading and interactive elements.
- `pages/genre/[id]/movie.vue` — Vue page component that displays a list of movies filtered by a specific genre ID, allowing users to browse and load more items.
- `pages/genre/[id]/tv.vue` — Vue page component that displays a list of TV shows filtered by a specific genre ID, allowing users to browse and load more items.
- `pages/index.vue` — Vue homepage component displaying various carousels for featured content, news, festivals, and trending media, along with conditional event banners for 2026 festivals.
- `pages/lists/[slug].vue` — Vue page component for displaying a user-curated list of movies and TV shows, with features for filtering, sorting, and managing list items.
- `pages/lists/index.vue` — Provides a user interface for managing custom movie and TV show lists, including creation, editing, filtering, and viewing.
- `pages/login/index.vue` — Serves as the login page, displaying an authentication modal for user login.
  - Automatically opens the AuthModal component upon mounting.
- `pages/movie/[id].vue` — Displays detailed information for a specific movie, including overview, credits, videos, images, soundtracks, and awards.
- `pages/movie/category/[name].vue` — Displays a listing of movies based on a specific category (e.g., trending, popular), with pagination for loading more items.
- `pages/movie/followed.vue` — Displays content related to followed movie companies and streaming services.
- `pages/movie/index.vue` — Provides a discovery page for movies, featuring various categories like popular, top-rated, upcoming, and now playing, along with filtering options.
- `pages/news/[slug].vue` — Displays a single news article based on its slug, including content, related entities, and user interaction features like saving and sharing.
- `pages/news/index.vue` — Displays a feed of the latest news articles, with filtering by source and category, and search functionality.
- `pages/noir/index.vue` — Presents the N.O.I.R Archive, a curated collection of historical titles, with sorting options and functionality to clone the archive to a user's list.
- `pages/notifications/index.vue` — Displays user notifications about new content from followed people, companies, streaming services, and shows, with filtering and management options.
- `pages/person/[id].vue` — Displays detailed information about a person (actor/director), including their filmography, awards, and known-for credits, with navigation for different content sections.
- `pages/production-companies/index.vue` — Displays a browsable list of all supported production companies, sorted alphabetically, with links to their individual production pages.
- `pages/production/[slug].vue` — Displays a detailed page for a specific production company, featuring its movies and TV shows, with filtering and sorting options.
- `pages/recovery/index.vue` — Provides a user interface for password recovery, allowing users to submit their email to receive a reset link.
- `pages/register/index.vue` — Serves as an entry point for user registration, immediately opening the authentication modal to the register tab upon mounting.
- `pages/search/index.vue` — Handles global search functionality, displaying a loading state and then search results for movies, TV shows, people, and news based on a query parameter.
- `pages/settings/index.vue` — Provides an interface for users to manage their account settings, including changing their avatar, updating profile information, and managing privacy settings.
- `pages/streaming-services/index.vue` — Displays a list of all available streaming services, sorted alphabetically, allowing users to navigate to individual service pages.
- `pages/streaming/[slug].vue` — Displays details for a specific streaming platform, including movies and TV shows, with filtering and sorting options.
- `pages/streaming/followed.vue` — Displays a user's followed streaming content, distinguishing between movies and TV shows based on the URL query parameter.
- `pages/tv/[id].vue` — Displays detailed information for a specific TV show, including an overview, credits, episodes, videos, images, soundtracks, and awards.
- `pages/tv/category/[name].vue` — Displays a list of TV shows based on a specific category (e.g., trending, popular), with pagination for loading more items.
- `pages/tv/followed.vue` — Displays TV shows that the user has followed.
- `pages/tv/index.vue` — Serves as the main discovery page for TV shows, featuring popular, top-rated, on-air, and airing today categories, along with filtering options.
- `pages/u/[alias].vue` — Displays a user's public profile, including their reviews and lists, with functionality to follow/unfollow the user.
- `pages/usage-policies/index.vue` — Displays the platform's usage policies and privacy agreement, organized into scrollable sections with a table of contents.
- `pages/watchlist/index.vue` — Manages and displays a user's watchlist of movies and TV shows, allowing for filtering, sorting, and rating items.
- `pages/wip/index.vue` — Vue page component displaying a 'Work in Progress' message with navigation options to the homepage and a GitHub README.

### `plugins`

- `plugins/bus.js` — Nuxt plugin that provides a global event bus using the mitt library for inter-component communication.
- `plugins/lazyload.js` — Nuxt plugin that registers a 'lazyload' Vue directive to dynamically set the 'src' attribute of an image element.

### `public`

- `public/manifest.json` — Defines the web application manifest for Cinemagoria, including app name, description, start URL, display properties, theme colors, and various icon configurations for different sizes and purposes.
- `public/sw.js` — A self-destroying service worker script that unregisters itself upon activation and reloads all active client pages, ensuring no service worker is active for the application.
  - This file is explicitly marked as not to be version controlled.

### `scripts`

- `scripts/seed_tribeca_2026_awards.cjs` — One-shot script to seed the `festival_awards` table with 2026 Tribeca Festival feature film award winners, including bilingual fields (EN/ES).
  - Run with `node scripts/seed_tribeca_2026_awards.cjs`.
- `scripts/syncCustomOverrides.js` — Fetches custom title override data from the `title_overrides` Turso database table and writes it to a JSON file for public consumption.
- `scripts/syncHeroData.js` — Retrieves hero selection data from the `hero_selections` Turso database table and saves it as a JSON file for public use.
- `scripts/syncNoirEnrichmentData.js` — Fetches enrichment data for 'noir historical' titles from the `noir_historical` Turso database table and writes it to a JSON file.
- `scripts/syncNoirHistorical.js` — Synchronizes new hero selections into the `noir_historical` Turso database table, optionally fetching Spanish titles from TMDB.

### `server/api`

- `server/api/article-report.post.ts` — Handles POST requests to report issues with articles, sanitizing input and storing the report in a database.
  - Registers a POST route for /api/article-report.
- `server/api/article/[slug].get.ts` — Handles GET requests for a specific article by slug, fetching its details from the database and returning structured data.
  - Registers a GET route for /api/article/[slug].
- `server/api/article/rss.get.ts` — Provides a permanent redirect for the legacy RSS feed endpoint to the canonical /feed URL.
  - Registers a GET route for /api/article/rss.
- `server/api/articles/by-slugs.get.ts` — Handles GET requests to retrieve a list of articles based on provided slugs, fetching and returning their details.
  - Registers a GET route for /api/articles/by-slugs.
- `server/api/awards/index-page.get.ts` — Handles GET requests to retrieve awards data for a specific award type and year, filtering and structuring the results for display.
  - Registers a GET route for /api/awards/index-page.
- `server/api/awards/index.get.ts` — Handles GET requests to retrieve award information (Oscars, Golden Globes, festival awards) based on TMDB ID, name, title, or type.
  - Registers a GET route for /api/awards.
- `server/api/contact.post.ts` — Handles POST requests for the contact form, sanitizing input and storing the message in a database.
  - Registers a POST route for /api/contact.
- `server/api/festival-report.post.ts` — Handles POST requests to report issues with festival data, sanitizing input and storing the report in a database.
  - Registers a POST route for /api/festival-report.
- `server/api/festival/bafici/awards.get.ts` — Handles GET requests to fetch awards data specifically for the 'bafici-2026' festival.
  - Registers a GET route for /api/festival/bafici/awards.
- `server/api/festival/bafici/films.get.ts` — API endpoint to fetch BAFICI 2026 film data, optionally filtered by TMDB or IMDb ID, with data normalization and TMDB integration for richer film details.
  - Registers a GET route for /api/festival/bafici/films.
- `server/api/festival/bafici/schedule.get.ts` — API endpoint to retrieve the BAFICI 2026 festival screening schedule, joining film and screening data from the database.
  - Registers a GET route for /api/festival/bafici/schedule.
- `server/api/festival/berlinale/awards.get.ts` — API endpoint to fetch the awards for the Berlinale 2026 film festival.
  - Registers a GET route for /api/festival/berlinale/awards.
- `server/api/festival/berlinale/films.get.ts` — API endpoint to fetch Berlinale 2026 film data, optionally filtered by TMDB or IMDb ID, with data normalization and TMDB integration for richer film details.
  - Registers a GET route for /api/festival/berlinale/films.
- `server/api/festival/berlinale/schedule.get.ts` — API endpoint to retrieve the Berlinale 2026 festival screening schedule, joining film and screening data from the database.
  - Registers a GET route for /api/festival/berlinale/schedule.
- `server/api/festival/bifff/awards.get.ts` — API endpoint to fetch the awards for the BIFFF 2026 film festival.
  - Registers a GET route for /api/festival/bifff/awards.
- `server/api/festival/bifff/films.get.ts` — API endpoint to fetch BIFFF 2026 film data, optionally filtered by TMDB or IMDb ID, integrating TMDB data for enhanced film details.
  - Registers a GET route for /api/festival/bifff/films.
- `server/api/festival/bifff/schedule.get.ts` — API endpoint to retrieve the BIFFF 2026 festival screening schedule, joining film and screening data from the database.
  - Registers a GET route for /api/festival/bifff/schedule.
- `server/api/festival/cannes/awards.get.ts` — API endpoint to fetch the awards for the Cannes 2026 film festival.
  - Registers a GET route for /api/festival/cannes/awards.
- `server/api/festival/cannes/films.get.ts` — API endpoint to fetch Cannes 2026 film data, optionally filtered by TMDB or IMDb ID, integrating TMDB data for enhanced film details.
  - Registers a GET route for /api/festival/cannes/films.
- `server/api/festival/cannes/schedule.get.ts` — API endpoint to retrieve the 2026 Cannes Film Festival screening schedule, including film details, from the database.
  - exports: `default`
  - Registers a GET route at /api/festival/cannes/schedule.
- `server/api/festival/cuff/awards.get.ts` — API endpoint to fetch the 2026 Calgary Underground Film Festival awards data.
  - exports: `default`
  - Registers a GET route at /api/festival/cuff/awards.
- `server/api/festival/cuff/films.get.ts` — API endpoint to retrieve films for the 2026 Calgary Underground Film Festival, supporting filtering by TMDB or IMDb ID.
  - exports: `default`
  - Registers a GET route at /api/festival/cuff/films. Supports 'tmdb_id', 'imdb_id', and 'limit' query parameters.
- `server/api/festival/cuff/schedule.get.ts` — API endpoint to retrieve the 2026 Calgary Underground Film Festival screening schedule, including film details, from the database.
  - exports: `default`
  - Registers a GET route at /api/festival/cuff/schedule.
- `server/api/festival/fantasia/awards.get.ts` — API endpoint to fetch the 2026 Fantasia International Film Festival awards data.
  - exports: `default`
  - Registers a GET route at /api/festival/fantasia/awards.
- `server/api/festival/fantasia/films.get.ts` — API endpoint to retrieve films for the 2026 Fantasia International Film Festival, supporting filtering by TMDB or IMDb ID.
  - exports: `default`
  - Registers a GET route at /api/festival/fantasia/films. Supports 'tmdb_id', 'imdb_id', and 'limit' query parameters.
- `server/api/festival/fantasia/schedule.get.ts` — API endpoint to retrieve the 2026 Fantasia International Film Festival screening schedule, including film details, from the database.
  - exports: `default`
  - Registers a GET route at /api/festival/fantasia/schedule.
- `server/api/festival/films-batch.get.ts` — API endpoint to fetch films for multiple festivals in a single request, supporting filtering, limiting, and field slimming.
  - exports: `default`
  - Registers a GET route at /api/festival/films-batch. Requires 'festivals' param (comma-separated slugs). Supports 'limit', 'year', 'fields=card'.
- `server/api/festival/frightfest/films.get.ts` — API endpoint to retrieve films for the 2026 FrightFest, supporting filtering by TMDB or IMDb ID.
  - exports: `default`
  - Registers a GET route at /api/festival/frightfest/films. Supports 'tmdb_id', 'imdb_id', and 'limit' query parameters.
- `server/api/festival/frightfest/schedule.get.ts` — API endpoint to retrieve the FrightFest 2026 film screening schedule, including film details and screening information, ordered by start time.
- `server/api/festival/kviff/awards.get.ts` — API endpoint to fetch awards data for the Karlovy Vary International Film Festival (KVIFF) 2026.
- `server/api/festival/kviff/films.get.ts` — API endpoint to retrieve films for the Karlovy Vary International Film Festival 2026, with optional filtering by TMDB or IMDb ID and limit.
- `server/api/festival/kviff/schedule.get.ts` — API endpoint to retrieve the Karlovy Vary International Film Festival 2026 film screening schedule, including film details and screening information, ordered by start time.
- `server/api/festival/romford/awards.get.ts` — API endpoint to fetch awards data for the Romford Horror Festival 2026.
- `server/api/festival/romford/films.get.ts` — API endpoint to retrieve films for the Romford Horror Festival 2026, with optional filtering by TMDB or IMDb ID and limit.
- `server/api/festival/romford/schedule.get.ts` — API endpoint to retrieve the Romford Horror Festival 2026 film screening schedule, including film details and screening information, ordered by start time.
- `server/api/festival/rotterdam/awards.get.ts` — API endpoint to fetch awards data for the Rotterdam Film Festival 2026.
- `server/api/festival/rotterdam/films.get.ts` — API endpoint to retrieve films for the Rotterdam Film Festival 2026, with optional filtering by TMDB/IMDb ID, sorting, and limiting results.
- `server/api/festival/rotterdam/schedule.get.ts` — API endpoint to retrieve the Rotterdam Film Festival 2026 film screening schedule, including film details and screening information, ordered by start time.
- `server/api/festival/slamdance/awards.get.ts` — API endpoint to fetch awards data for the Slamdance Film Festival 2026.
- `server/api/festival/slamdance/films.get.ts` — API endpoint to retrieve films for the Slamdance Film Festival 2026, with optional filtering by TMDB or IMDb ID and limit.
- `server/api/festival/slamdance/schedule.get.ts` — API endpoint to retrieve the schedule of film screenings for the Slamdance Film Festival 2026, including film details and screening information from the database.
- `server/api/festival/status.get.ts` — API endpoint to fetch the festival status for a given TMDb ID and year, providing festival badge information for a specific film.
- `server/api/festival/sundance/awards.get.ts` — API endpoint to fetch the awards for the Sundance Film Festival 2026.
- `server/api/festival/sundance/films.get.ts` — API endpoint to retrieve a list of films for the Sundance Film Festival 2026, with optional filtering by TMDb/IMDb ID and sorting.
- `server/api/festival/sundance/schedule.get.ts` — API endpoint to retrieve the schedule of film screenings for the Sundance Film Festival 2026, including film details and screening information from the database.
- `server/api/festival/sxsw/awards.get.ts` — API endpoint to fetch the awards for the SXSW Film & TV Festival 2026.
- `server/api/festival/sxsw/films.get.ts` — API endpoint to retrieve a list of films for the SXSW Film & TV Festival 2026, with optional filtering by TMDb/IMDb ID and sorting.
- `server/api/festival/sxsw/schedule.get.ts` — API endpoint to retrieve the schedule of film screenings for the SXSW Film & TV Festival 2026, including film details and screening information from the database.
- `server/api/festival/tribeca/awards.get.ts` — API endpoint to fetch the awards for the Tribeca Festival 2026.
- `server/api/festival/tribeca/films.get.ts` — API endpoint to retrieve a list of films for the Tribeca Festival 2026, with optional filtering by TMDb/IMDb ID and sorting.
- `server/api/festival/tribeca/schedule.get.ts` — API endpoint to retrieve the schedule of film screenings for the Tribeca Festival 2026, including film details and screening information from the database.
- `server/api/festival/venice/awards.get.ts` — API endpoint to fetch the awards for the Venice Film Festival 2026.
- `server/api/festival/venice/films.get.ts` — API endpoint to retrieve a list of films from the Venice Film Festival for the year 2026, with optional filtering by TMDB or IMDb ID.
- `server/api/festival/venice/schedule.get.ts` — API endpoint to retrieve the screening schedule for the Venice Film Festival 2026, joining film and screening data.
- `server/api/hero.get.ts` — API endpoint to fetch a randomized selection of hero items (movies/TV shows) for display, enriching them with festival status.
- `server/api/imdb-rating/[id].get.ts` — API endpoint to fetch IMDb ratings and vote counts for a given media ID from a Turso database.
- `server/api/news.get.ts` — API endpoint to retrieve curated news articles, supporting pagination, language filtering, source filtering, and search queries.
- `server/api/noir-archive.get.ts` — API endpoint to retrieve a list of historical noir films and TV shows from a Turso database, ordered by release date.
- `server/api/progress/[userId]/[mediaType]/[mediaId].delete.ts` — API endpoint to delete a user's progress tracking record for a specific media item (movie or episode).
- `server/api/progress/[userId]/[mediaType]/[mediaId].get.ts` — API endpoint to retrieve a user's progress tracking details for a specific media item (movie or episode).
- `server/api/progress/[userId]/[mediaType]/[mediaId].put.ts` — API endpoint to create or update a user's progress tracking record for a specific media item (movie or episode).
- `server/api/progress/[userId]/active/[mediaType]/[mediaId].put.ts` — API endpoint to update the 'manually_active' flag for a user's progress tracking record for a specific media item.
- `server/api/progress/[userId]/batch.put.ts` — API endpoint to batch update progress tracking for multiple episodes for a given user.
- `server/api/progress/[userId]/hydrated.get.ts` — Handles API requests to retrieve a user's progress on movies and TV shows, hydrating the data with details from TMDB and caching results.
- `server/api/progress/[userId]/index.get.ts` — Handles API requests to retrieve a user's raw progress tracking data from the database, ordered by update time.
- `server/api/search-log.post.ts` — Logs search queries to a database, optionally including analytics data like origin IP and user email.
- `server/api/search/person.get.ts` — Handles API requests to search for people using the TMDB API based on a provided query string.
- `server/api/spotlight/[type].get.ts` — Retrieves curated spotlight content for movies or TV shows from the database, formatting and returning the results.

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

- `server/utils/db.ts` — Provides utility functions for connecting to a Turso database and executing queries with a safety timeout, ensuring database operations are robust against transient network issues.
  - exports: `useDb`, `dbExecute`
- `server/utils/rss-feed.ts` — Constructs an RSS news feed, handling localization for English and Spanish content, and integrating Vimeo oEmbed data for trailers.
  - exports: `buildNewsFeed`
- `server/utils/vimeo-oembed.ts` — Fetches and caches oEmbed metadata for Vimeo videos, providing thumbnail URLs and other details, used by news articles and RSS feeds.
  - exports: `getVimeoOembed`, `getVimeoThumb`
- `server/utils/festivalAwards.ts` — Fetches festival award data for a given festival slug, supporting English and Spanish locales with fallback to English for missing translations.
  - exports: `fetchFestivalAwards`
  - Registers the /api/festival/<shortcode>/awards route.
- `server/utils/festivals.ts` — Manages canonical festival name-to-slug mappings and retrieves festival participation status for a batch of TMDB IDs.
  - exports: `FESTIVAL_NAME_BY_SLUG`, `NAME_TO_SLUG`, `getFestivalStatusByTmdbId`
- `server/utils/sitemap-helpers.ts` — Provides utilities for fetching TMDB IDs across multiple pages and generating sitemap XML content.
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

- `utils/api.js` — Provides an Axios-like API client for making HTTP requests, interacting with TMDb, Trakt, and internal APIs, and managing movie/TV show data enrichment.
  - exports: `apiImgUrl`, `EXCLUDED_MOVIE_IDS`, `EXCLUDED_TV_IDS`, `getHeroEnrichment`, `getNoirEnrichment`, `getCustomEnrichment`, `resolveItemPoster`, `languages`, `getListItem`, `getIMDbRatingFromDB`, `getMovies`
- `utils/categoryLabels.js` — Defines English display labels for editorial taxonomy categories and provides a utility function to retrieve a label based on a category token.
  - exports: `CATEGORY_LABELS`, `categoryLabel`
- `utils/countries.js` — Exports a comprehensive list of countries with their ISO 3166-1 alpha-2 codes and names.
  - exports: `countries`
- `utils/helpers.js` — Provides utility functions for formatting dates, handling image loading errors, and determining the release status context of a movie or TV show.
  - exports: `formatDate`, `handleImageError`, `getReleaseStatusContext`
- `utils/itemMapper.js` — Maps an item object (e.g., from an API response) to a standardized payload format suitable for database storage, inferring missing fields.
  - exports: `mapItemToDbPayload`
- `utils/membershipStore.js` — Manages a session-wide cache for user watchlist and custom list membership, coalescing multiple invalidations into a single bulk fetch.
  - exports: `invalidateMembershipCache`, `getMembership`
- `utils/musicbrainz.js` — Provides functions to search for soundtracks and retrieve album tracks using the MusicBrainz API, including filtering by year and handling user agents.
  - exports: `searchSoundtracks`, `getAlbumTracks`, `getMusicBrainzUrl`
- `utils/newsSources.js` — Defines lists of supported English news sources and their corresponding URLs.
  - exports: `SOURCES`, `SOURCE_URLS`
- `utils/relatedFooter.js` — Provides utilities to strip 'Related Articles' footers from article bodies and extract slugs of related articles from those footers, supporting Markdown and legacy HTML formats.
  - exports: `stripRelatedFooter`, `extractRelatedSlugs`
- `utils/resolvePhase.js` — An intentionally empty file marked as deprecated, previously used for phase resolution logic that was later moved to a server-side cron job.
  - This file is deprecated and should not be used; it will be removed in a future cleanup.

## Dependency Edges

| From | To | Imports |
| :--- | :--- | ---: |
| `server/api` | `server/data` | 2 |
| `server/routes` | `server/utils` | 1 |

## External Packages (imported in code)

- `~` (403 imports)
- `~~` (52 imports)
- `h3` (47 imports)
- `vue` (43 imports)
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
