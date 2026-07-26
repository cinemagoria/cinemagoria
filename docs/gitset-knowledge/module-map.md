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

- `app.vue` — Main application entry point for the Cinemagoria Nuxt.js application, setting up global SEO metadata (Schema.org Organization and WebSite) and rendering the primary layout and pages.
- `cloudbuild.yaml` — Google Cloud Build configuration for building and deploying the Cinemagoria application. It builds a Docker image, pushes it to Google Artifact Registry, and updates a Cloud Run service.
- `Dockerfile` — Defines the Docker image build process for the Cinemagoria application, including dependencies installation, build arguments for Supabase, and setting up the production environment for execution.
- `nuxt.config.ts` — Nuxt.js configuration file for the Cinemagoria project, defining aliases, compatibility date, devtools settings, and route-specific headers for caching sitemaps and RSS feeds.
  - exports: `default`
- `package.json` — Defines project metadata, scripts for development and build processes, and manages all production and development dependencies and their resolutions for the Cinemagoria application.
  - Includes scripts: build, dev, generate, preview, postinstall.
- `tsconfig.json` — TypeScript configuration file for the Nuxt.js project, referencing generated TypeScript configurations for application, server, shared, and node environments.

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

- `components/global/GoogleLogin.vue` — Provides a Google login button component that handles user authentication flow, displaying loading states and emitting events for start and error conditions.
- `components/global/UserNav.vue` — Displays user navigation, including notifications, avatar, and a dropdown menu with profile links, settings, and logout functionality, fetching user data and notification counts.
- `components/BaficiCard.vue` — Displays a card for a BAFICI festival item, including an image, quick actions like external links and favorites, and a link to its detail page.
- `components/BerlinaleCard.vue` — Displays a card for a Berlinale festival item, including an image, quick actions like external links and favorites, and a link to its detail page.
- `components/BifffCard.vue` — Displays a card for a BIFFF festival item, including an image, quick actions like external links and favorites, and a link to its detail page.
- `components/CannesCard.vue` — Displays a card for a Cannes festival item, including an image, quick actions like external links and favorites, and a link to its detail page.
- `components/CannesLiveBanner.vue` — Provides a banner component for the Cannes 2026 festival, featuring a dynamic background, logo, and a call to action to explore live coverage.
- `components/CannesWinnersBanner.vue` — Displays a banner for the Cannes 2026 winners, featuring a dynamic background, logo, and a marquee of award winners, linking to the festival's palmarès.
- `components/Card.vue` — Renders a generic media card component, displaying a poster, title, release year, and user rating, with optional quick favorite actions and loading states.
- `components/common/AwardsTab.vue` — Displays a tabbed view of awards (Oscars, Golden Globes, Palme d'Or, Golden Lion, Golden Bear) for a given media type, with loading and empty states.
- `components/common/FullCreditsModal.vue` — Displays a modal with full crew credits for a given title, grouped by department, allowing users to expand/collapse sections.
- `components/common/MediaProgressBar.vue` — Displays a circular progress bar and slider for media viewing progress, showing total runtime and current progress.
- `components/Credits.vue` — Displays a horizontal carousel of cast members for a movie or TV show, allowing users to navigate through the list and view individual credit items.
- `components/CreditsItem.vue` — Renders an individual credit item for a person, displaying their image, name, and character, with a link to their dedicated person page.
- `components/CuffCard.vue` — Displays a card for a movie or TV show, including an image, title, and quick actions like favoriting or opening an external source URL.
- `components/CustomListingCategoriesMovies.vue` — Provides a customizable carousel for movie categories, allowing users to browse and explore different genres or curated lists.
- `components/CustomListingCategoriesSeries.vue` — Provides a customizable carousel for TV series categories, allowing users to browse and explore different genres or curated lists.
- `components/Discover.vue` — Enables users to discover movies or TV shows based on various filters such as genre, sort order, country, network, language, provider, and vote count.
- `components/DynamicSearchCarousel.vue` — Displays a dynamic carousel of search results for movies or TV shows, allowing users to browse through items with navigation controls.
- `components/ExternalLinks.vue` — Displays a grid of external links related to a movie or TV show, including IMDb, Letterboxd, Rotten Tomatoes, Trakt, and TMDb.
- `components/FantasiaCard.vue` — Displays a card for a movie or TV show, including an image, title, and quick actions like favoriting or opening an external source URL, specifically themed for Fantasia.
- `components/FantasiaLiveBanner.vue` — Displays a promotional banner for the Fantasia 2026 festival, linking to its dedicated coverage page.
- `components/FeatureDescription.vue` — Vue component displaying a prominent feature description with cinematic visual effects and responsive styling for the Cinemagoria platform.
- `components/festival/BaficiBadge.vue` — Vue component for displaying a clickable badge representing the BAFICI Film Festival 2026, with a logo and hover effects.
- `components/festival/BerlinaleBadge.vue` — Vue component for displaying a clickable badge representing the Berlinale Film Festival 2026, with a logo and hover effects.
- `components/festival/BifffBadge.vue` — Vue component for displaying a clickable badge representing the BIFFF Film Festival 2026, with a logo and hover effects.
- `components/festival/CannesAcidBadge.vue` — Vue component for displaying a clickable badge representing the Cannes Film Festival 2026 (ACID section), with a logo and hover effects.
- `components/festival/CannesBadge.vue` — Vue component for displaying a clickable badge representing the main Cannes Film Festival 2026, with a logo and hover effects.
- `components/festival/CannesCriticsChoiceBadge.vue` — Vue component for displaying a clickable badge representing the Cannes Film Festival 2026 (Critics' Choice section), with a logo and hover effects.
- `components/festival/CannesQuinzaineBadge.vue` — Vue component for displaying a clickable badge representing the Cannes Film Festival 2026 (Quinzaine des Cinéastes section), with a logo and hover effects.
- `components/festival/CuffBadge.vue` — Vue component for displaying a clickable badge representing the Calgary Underground Film Festival 2026, with a logo and hover effects.
- `components/festival/FantasiaBadge.vue` — Vue component for displaying a clickable badge representing the Fantasia International Film Festival 2026, with a logo and hover effects.
- `components/festival/FrightfestBadge.vue` — Vue component for displaying a clickable badge representing the FrightFest 2026, with a logo and hover effects.
- `components/festival/KviffBadge.vue` — Vue component for displaying a clickable badge representing the Karlovy Vary International Film Festival 2026, with a logo and hover effects.
- `components/festival/RomfordBadge.vue` — Vue component for displaying a clickable badge representing the Romford Horror Film Festival 2026, with a logo and hover effects.
- `components/festival/RotterdamBadge.vue` — Vue component for displaying a clickable badge representing the Rotterdam Film Festival 2026, with a logo and hover effects.
- `components/festival/SlamdanceBadge.vue` — Vue component for displaying a clickable badge representing the Slamdance Film Festival 2026, with a logo and hover effects.
- `components/festival/SundanceBadge.vue` — Vue component for displaying a clickable badge representing the Sundance Film Festival 2026, with a logo and hover effects.
- `components/festival/SxswBadge.vue` — Vue component for displaying a clickable badge representing the SXSW Film & TV Festival 2026, with a logo and hover effects.
- `components/festival/SxswCard.vue` — Vue component for displaying a film festival card, specifically for SXSW, including a link, image, loader, and quick actions like an external link and favorite button.
- `components/festival/TiffBadge.vue` — Vue component for displaying a clickable badge representing the TIFF 2026 film festival, with a logo and hover effects.
- `components/festival/TribecaBadge.vue` — Vue component for displaying a clickable badge representing the Tribeca Festival 2026, with a logo and hover effects.
- `components/festival/VeniceBadge.vue` — Vue component for displaying a clickable badge representing the Venice Film Festival 2026, with a logo and hover effects.
- `components/festival/WinnersCarousel.vue` — Displays a carousel of festival winners, grouped by film and sorted by award priority, with navigation controls and a dynamic year display.
- `components/FestivalDataDisclaimer.vue` — Provides a minimalist trigger for a modal explaining potential data coverage gaps for a festival, allowing users to report missing films.
- `components/FestivalsCarousel.vue` — Renders a horizontal carousel for displaying a list of festivals, including navigation buttons and an optional 'Explore All' link.
- `components/FollowedContent.vue` — Displays a paginated list of movies or TV shows from followed production companies or streaming platforms, with filtering and sorting options.
- `components/FrightfestCard.vue` — Displays a card for a Frightfest film, including a poster, quick actions like favoriting and external links, and a link to its detail page.
- `components/global/ArticleAIDisclosure.vue` — Informs users that an article was AI-generated and provides a mechanism to report errors or inaccuracies through a modal form.
- `components/global/ArticleShareModal.vue` — Provides a modal for sharing an article via various social media platforms, email, or by copying the link, with customizable title and message.
- `components/global/AuthModal.vue` — Manages user authentication, presenting a modal with tabs for signing in or registering, and handling form submissions.
- `components/global/CardActions.vue` — Provides a dropdown menu of actions for a content card, including rating, adding to a watchlist, or adding to a custom list.
- `components/global/CookieConsent.vue` — Manages user cookie consent, displaying a banner for initial consent and a preferences panel for custom cookie settings.
- `components/global/CreateListModal.vue` — Enables users to create a new custom list through a modal form, including name and privacy settings, and optionally adding an item.
- `components/global/FollowingModal.vue` — Provides a modal interface for users to manage their followed people, TV shows, production companies, and streaming services.
- `components/global/Footer.vue` — Provides a global footer component for the Cinemagoria application, displaying resource links, cookie preferences, and social media icons.
- `components/global/InstallPrompt.vue` — Displays a prompt to the user to add the Cinemagoria application to their home screen, handling the 'beforeinstallprompt' event and managing user preferences.
- `components/global/MyListsModal.vue` — Manages a modal for users to add items to their custom lists, move items between lists, or create new lists within the Cinemagoria application.
- `components/global/Nav.vue` — Implements the main navigation bar for the Cinemagoria application, including links to home, discover, and user-specific sections like favorites and lists.
- `components/global/NewsCarousel.vue` — Displays a carousel of the latest news articles for Cinemagoria, with navigation controls and a link to explore all news.
- `components/global/ProgressTrackingModal.vue` — Provides a modal for users to track and manage their watch progress for movies and TV shows, including marking episodes as watched and updating percentages.
- `components/global/QuickFav.vue` — A quick favorite button component that allows users to add or manage an item in their lists, displaying a plus or check icon based on its status.
- `components/global/QuickFavModal.vue` — A modal component that prompts the user to confirm removal of an item from their watchlist, handling the deletion request to the backend.
- `components/global/RatedModal.vue` — Displays a modal for users to view and manage their rated movies and TV shows, allowing them to edit ratings and reviews.
- `components/global/RelatedArticlesCarousel.vue` — Displays a carousel of related articles with navigation controls, fetching data asynchronously and handling image loading states.
- `components/global/SearchForm.vue` — Provides a search input form with a back button, debouncing search queries, and fetching user avatar/name from Supabase.
- `components/global/TopNav.vue` — Implements a fixed top navigation bar that displays a title, responsive to different screen sizes.
- `components/Hero.vue` — Displays a hero section with an auto-advancing carousel for movies/TV shows, including festival badges, user tracking, and review functionality.
- `components/HowItWorksModal.vue` — Presents a modal explaining how release alerts work, featuring an interactive carousel to guide users through the process.
- `components/Images.vue` — Displays a gallery of images (posters or backdrops) with a title and count, allowing users to open a modal for full-size viewing.
- `components/ImagesItem.vue` — Renders an individual image item within a gallery, displaying a loader while the image loads and emitting an event to open a modal.
- `components/KviffCard.vue` — Displays a card for a KVIFF item, including an image, quick actions like favoriting, and a link to its official festival page.
- `components/KviffLiveBanner.vue` — Displays a promotional banner for KVIFF 2026, linking to the festival's coverage page with a distinct visual style.
- `components/Listing.vue` — Renders a list of items with an optional title and 'Explore All' link, supporting infinite scrolling to load more items.
- `components/ListingCarousel.vue` — Displays a horizontal carousel of movie/TV show cards with navigation buttons and an optional 'Explore All' link, supporting a compact mode for smaller cards.
- `components/Loader.vue` — Provides a simple, animated SVG loader component with customizable size and color for indicating loading states.
- `components/MediaNav.vue` — Renders a navigation bar with clickable buttons, typically used for switching between different media categories or tabs, and emits an event on click.
- `components/Modal.vue` — Implements a generic modal component that can display various content types (image, iframe, gallery) and handles focus trapping and keyboard navigation.
- `components/movie/MovieInfo.vue` — Displays detailed information about a movie, including its poster, overview, cast, crew, awards, and external links, with dynamic content loading.
- `components/movie/MovieReleases.vue` — Displays a list of movie release dates grouped by country, showing release types and dates, with loading and no-data states.
- `components/music/SoundtrackGroup.vue` — Organizes and displays a group of soundtrack items, typically by year, within a movie or TV show's music section.
- `components/music/SoundtrackItem.vue` — Displays a single soundtrack item with its title, disambiguation, and artist, linking to its MusicBrainz page.
- `components/music/SoundtrackList.vue` — Displays a list of tracks for a selected soundtrack album, allowing users to play tracks on YouTube and showing album metadata.
- `components/NoirModal.vue` — Presents a stylized modal window for the 'N.O.I.R' (Nothing Out Is Ready) feature, including a manifesto and an option to join a waitlist.
- `components/OscarsCarousel.vue` — Displays a horizontal carousel of Oscar nominees and winners for the 98th Academy Awards, with navigation and a link to full awards coverage.
- `components/OscarsLiveBanner.vue` — Displays a banner for the 98th Academy Awards, indicating live coverage or results, with a dynamic ticker for key updates.
- `components/person/CreditsHistory.vue` — Vue component to display a person's credit history, allowing filtering by department and media type, and grouping credits by year.
- `components/person/CreditsHistoryGroup.vue` — Vue component that displays a group of credits for a person, typically organized by year, and renders individual credit items.
- `components/person/CreditsHistoryItem.vue` — Vue component that displays a single credit item for a person, including the title, media type, and role/character, with a link to the media page.
- `components/person/PersonAwardsTab.vue` — Vue component to display a person's awards history, including Oscars, Golden Globes, Palme d'Or, Golden Lion, and Golden Bear, with links to associated films.
- `components/person/PersonInfo.vue` — Vue component to display a person's biographical information, including their avatar, name, biography, and key statistics like birth/death dates and award counts.
- `components/ProductionCompanyCarousel.vue` — Vue component displaying a horizontal carousel of popular production companies, with navigation buttons and autoplay functionality.
- `components/ProductionHero.vue` — Vue component for a production company hero section, displaying its logo, name, country, headquarters, description, and a follow button.
- `components/RomfordCard.vue` — Vue component representing a card for a Romford film festival entry, displaying an image, quick actions, and linking to its detail page.
- `components/RotterdamCard.vue` — Vue component representing a card for a Rotterdam film festival entry, displaying an image, quick actions, and linking to its detail page.
- `components/search/CategoryCarousel.vue` — Vue component displaying a collapsible carousel of items within a search category, with navigation and a 'Load More' button.
- `components/search/CategorySection.vue` — Vue component displaying a collapsible section of search results for a specific category, rendering each item as a Card component.
- `components/search/DiscoverSearch.vue` — Vue component for discovering movies and TV shows with extensive filtering options by genre, sort, country, network, language, provider, vote count, format, year, and rating.
- `components/search/NewsResultCard.vue` — Vue component displaying a single news article result with an image, source badge, date, title, and sanitized description, linking to the full article.
- `components/search/SearchGuideModal.vue` — Vue component for a modal that provides a guide on how to use the search functionality within Cinemagoria, detailing different search types and tips.
- `components/search/SearchResults.vue` — Vue component that displays various search results including movies, TV shows, people, festivals, productions, streaming services, and news articles, with loading and no-results states.
- `components/SlamdanceCard.vue` — Vue component for displaying a Slamdance film festival entry card, including an image, quick actions like favoriting, and a link to the official festival page.
- `components/SpotlightCarousel.vue` — Vue component for a horizontal carousel displaying a collection of items, typically used for featured content, with navigation buttons and an optional 'Explore All' link.
- `components/StreamingPlatformCarousel.vue` — Vue component for a horizontal carousel displaying popular streaming services, with navigation buttons, autoplay functionality, and an optional 'Explore All' link.
- `components/StreamingPlatformHero.vue` — Vue component displaying a hero section for a streaming platform, featuring its name, logo, and a follow/unfollow button with authentication handling.
- `components/SundanceCard.vue` — Vue component for displaying a Sundance film festival entry card, including an image, quick actions like favoriting, and a link to the official festival page.
- `components/TiffCard.vue` — Displays a card for a TIFF festival item, including an image, title, and quick actions like favoriting and opening the official festival page.
- `components/TribecaCard.vue` — Displays a card for a Tribeca festival item, including an image, title, and quick actions like favoriting and opening the official festival page.
- `components/TribecaLiveBanner.vue` — Provides a prominent banner component for the Tribeca 2026 festival, linking to its coverage page and featuring a custom background and logo.
- `components/tv/Episodes.vue` — Manages and displays a list of episodes for a TV show, allowing users to select seasons, view episode counts, and mark seasons as watched/unwatched.
- `components/tv/EpisodesItem.vue` — Displays an individual TV episode with its poster, name, and a progress tracking overlay for users to mark watch status.
- `components/tv/TvInfo.vue` — Displays detailed information for a TV show, including its poster, overview, external links, and related content like recommendations and creator shows.
- `components/VeniceCard.vue` — Displays a card for a Venice festival item, including an image, title, and quick actions like favoriting and opening the official festival page.
- `components/Videos.vue` — Displays a list of videos, allowing users to filter by type and open videos in a modal player.
- `components/VideosItem.vue` — Displays an individual video item with its thumbnail, duration, title, and type, and handles opening the video in a modal.
- `components/WatchOn.vue` — Vue component that displays a list of streaming providers for a given movie or TV show, allowing users to click through to watch content.
- `components/YearPicker.vue` — Vue component providing a dropdown for selecting a release year, with options ranging from a minimum year to the current year.

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

- `pages/auth-success.vue` — Handles post-authentication redirects and displays success or error states, cleaning up local storage and updating navigation links.
- `pages/awards/index.vue` — Displays a page for browsing major film awards, allowing users to select an award and year to view winners and nominees.
- `pages/changelog/index.vue` — Renders a changelog page by fetching and displaying release notes directly from the cinemagoria GitHub repository.
- `pages/contact/index.vue` — Provides a contact form for users to submit inquiries, handling form submission, loading states, and displaying success or error messages.
- `pages/faq/index.vue` — Displays a Frequently Asked Questions page with a table of contents for navigation and expandable sections for each question.
- `pages/festival/bafici-2026/index.vue` — Displays detailed information for the BAFICI 2026 film festival, including films, awards, and a schedule, with navigation and search features.
- `pages/festival/berlinale-2026/index.vue` — Displays detailed information for the Berlinale 2026 film festival, including films, awards, and a schedule, with navigation and search features.
- `pages/festival/bifff-2026/index.vue` — Displays detailed information for the BIFFF 2026 film festival, including films, awards, and a schedule, with navigation and search features.
- `pages/festival/cannes-2026/index.vue` — Displays detailed information for the Cannes Film Festival 2026, including films, awards, and a schedule, with navigation and search features.
- `pages/festival/cuff-2026/index.vue` — Vue page component for displaying details, films, schedule, and awards for the Calgary Underground Film Festival (CUFF) 2026, including search and navigation features.
- `pages/festival/fantasia-2026/index.vue` — Vue page component for displaying details, films, schedule, and awards for the Fantasia International Film Festival 2026, including search and navigation features.
- `pages/festival/frightfest-2026/index.vue` — Vue page component for displaying details, films, and schedule for the FrightFest 2026 festival, including search and navigation features.
- `pages/festival/kviff-2026/index.vue` — Vue page component for displaying details, films, schedule, and awards for the Karlovy Vary International Film Festival (KVIFF) 2026, including search and navigation features.
- `pages/festival/romford-2026/index.vue` — Vue page component for displaying details, films, schedule, and awards for the Romford Horror Film Festival 2026, including search and navigation features.
- `pages/festival/rotterdam-2026/index.vue` — Vue page component for displaying details, films, schedule, and awards for the International Film Festival Rotterdam (IFFR) 2026, including search and navigation features.
- `pages/festival/slamdance-2026/index.vue` — Vue page component for displaying details, films, schedule, and awards for the Slamdance Film Festival 2026, including search and navigation features.
- `pages/festival/sundance-2026/index.vue` — Vue page component for displaying information about the Sundance Film Festival 2026, including films, awards, and schedule, with dynamic content loading and search functionality.
- `pages/festival/sxsw-2026/index.vue` — Vue page component for displaying information about the SXSW Film Festival 2026, including films, awards, and schedule, with dynamic content loading and search functionality.
- `pages/festival/tiff-2026/index.vue` — Vue page component for displaying information about the TIFF 2026 festival, including films, awards, and schedule, with dynamic content loading and search functionality.
- `pages/festival/tribeca-2026/index.vue` — Vue page component for displaying information about the Tribeca Film Festival 2026, including films, awards, and schedule, with dynamic content loading and search functionality.
- `pages/festival/venice-2026/index.vue` — Vue page component for displaying information about the Venice Film Festival 2026, including films, awards, and schedule, with dynamic content loading and search functionality.
- `pages/genre/[id]/movie.vue` — Vue page component that displays a paginated list of movies belonging to a specific genre, fetching data from an API and handling 'load more' functionality.
- `pages/genre/[id]/tv.vue` — Vue page component that displays a paginated list of TV shows belonging to a specific genre, fetching data from an API and handling 'load more' functionality.
- `pages/index.vue` — Vue page component for the homepage, displaying various carousels for featured content, news, and festivals, along with conditional banners for ongoing events like Oscars, Cannes, and Fantasia.
- `pages/lists/[slug].vue` — Displays a single user-created list of movies and TV shows, allowing the owner to edit its details and manage items.
- `pages/lists/index.vue` — Displays a user's custom lists of movies and TV shows, providing functionality to create, edit, and delete lists.
- `pages/login/index.vue` — Serves as the login page, displaying an authentication modal for user login and registration.
- `pages/movie/[id].vue` — Displays detailed information for a specific movie, including overview, credits, videos, images, soundtracks, and awards.
- `pages/movie/category/[name].vue` — Displays a list of movies belonging to a specific category (e.g., trending, popular), with infinite scrolling.
- `pages/movie/followed.vue` — Displays movies from followed production companies and streaming platforms.
- `pages/movie/index.vue` — Serves as the main movie discovery page, featuring popular, top-rated, upcoming, and now playing movie categories, along with filters.
- `pages/news/[slug].vue` — Displays a single news article with its content, related entities, and options to save or share.
- `pages/news/index.vue` — Displays a feed of the latest news articles, with filtering options by source and category, and search functionality.
- `pages/noir/index.vue` — Displays the N.O.I.R Archive, a curated collection of historical film noir titles, with sorting and list creation features.
- `pages/notifications/index.vue` — Vue page component for displaying user notifications, allowing filtering by unread status, marking notifications as read/unread, and managing follows.
- `pages/person/[id].vue` — Vue page component for displaying detailed information about a person, including their known for credits, filmography, photos, and awards.
- `pages/production-companies/index.vue` — Vue page component that displays a grid of all supported production companies, allowing users to browse and navigate to individual company pages.
- `pages/production/[slug].vue` — Vue page component for displaying details of a specific production company, including its movies and TV shows, with filtering and sorting options.
- `pages/recovery/index.vue` — Vue page component for the password recovery process, allowing users to request a password reset link via email.
- `pages/register/index.vue` — Vue page component that serves as an entry point for user registration by displaying an authentication modal pre-set to the register tab.
- `pages/search/index.vue` — Vue page component for displaying search results across movies, TV shows, people, and news, with loading indicators and pagination.
- `pages/settings/index.vue` — Vue page component for managing user account settings, including profile information, avatar, email, alias, and privacy preferences.
- `pages/streaming-services/index.vue` — Vue page component that displays a grid of all supported streaming services, allowing users to browse and navigate to individual service pages.
- `pages/streaming/[slug].vue` — Displays details for a specific streaming platform, including its movies and TV shows, with filtering and sorting options.
- `pages/streaming/followed.vue` — Displays a user's followed streaming content, distinguishing between movies and TV shows based on the URL query parameter.
- `pages/tv/[id].vue` — Displays detailed information for a specific TV show, including an overview, cast, crew, episodes, videos, images, soundtracks, and awards.
- `pages/tv/category/[name].vue` — Displays a paginated list of TV shows belonging to a specific category (e.g., trending, popular), with options to load more items.
- `pages/tv/followed.vue` — Displays a user's followed TV show content.
- `pages/tv/index.vue` — Serves as the main discovery page for TV shows, featuring popular, top-rated, on-air, and airing today series, along with filters.
- `pages/u/[alias].vue` — Displays a user's public profile, including their reviews and lists, with functionality to follow/unfollow the user.
- `pages/usage-policies/index.vue` — Displays the platform's usage policies and privacy agreement, organized into scrollable sections with a table of contents.
- `pages/watchlist/index.vue` — Manages and displays a user's watchlist of movies and TV shows, including filtering, sorting, and rating functionalities.
- `pages/wip/index.vue` — Informs users that a section of the website is currently under maintenance and provides options to return home or get more information.

### `plugins`

- `plugins/bus.js` — Nuxt plugin that provides a global event bus using the mitt library for inter-component communication.
- `plugins/lazyload.js` — Nuxt plugin that registers a 'lazyload' Vue directive to dynamically set the 'src' attribute of an image element.

### `public`

- `public/manifest.json` — Defines the web application manifest for Cinemagoria, including its name, description, display properties, theme colors, and a list of icons for various purposes and sizes.
- `public/sw.js` — A self-destroying service worker script that unregisters itself immediately upon activation and reloads all active client pages, ensuring no caching or offline functionality.
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

- `~` (414 imports)
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
