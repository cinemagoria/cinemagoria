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
- `components/global/UserNav.vue` — Displays user navigation elements including notifications, avatar, and a dropdown menu with profile links, language options, and logout functionality.
- `components/BaficiCard.vue` — A card component specifically for BAFICI festival entries, displaying an image, title, and quick actions like favoriting and opening an external source URL.
- `components/BerlinaleCard.vue` — A card component specifically for Berlinale festival entries, displaying an image, title, and quick actions like favoriting and opening an external source URL.
- `components/BifffCard.vue` — A card component specifically for BIFFF festival entries, displaying an image, title, and quick actions like favoriting and opening an external source URL.
- `components/CannesCard.vue` — A card component specifically for Cannes festival entries, displaying an image, title, and quick actions like favoriting and opening an external source URL.
- `components/CannesLiveBanner.vue` — A banner component promoting live coverage of the Cannes 2026 festival, featuring a dynamic background and festival branding.
- `components/CannesWinnersBanner.vue` — A banner component promoting the winners of the Cannes 2026 festival, featuring a dynamic background and festival branding with a marquee of awards.
- `components/Card.vue` — A generic card component for displaying various media types (movies, TV, people, streaming, festivals) with images, titles, ratings, and quick actions.
- `components/common/AwardsTab.vue` — Displays a tabbed view of awards for a given entity (movie, person, etc.), including Oscars, Golden Globes, Palme d'Or, Golden Lion, and Golden Bear.
- `components/common/FullCreditsModal.vue` — A modal component that displays the full crew credits for a given title, grouped by department with collapsible sections.
- `components/common/MediaProgressBar.vue` — A component displaying a circular progress bar and slider for media viewing progress, showing watched time and total duration.
- `components/Credits.vue` — Displays a horizontal, scrollable carousel of cast members, fetching data based on the provided 'people' prop and managing carousel navigation and state.
- `components/CreditsItem.vue` — Renders an individual cast member's card within a carousel, displaying their image, name, and character, with a loading state and a link to their person page.
- `components/CuffCard.vue` — Displays a card for a movie or TV show, including an image, title, and actions like adding to a list or opening an external link, with loading states and routing.
- `components/CustomListingCategoriesMovies.vue` — Presents a horizontal, scrollable carousel of movie categories, with navigation buttons and an optional 'Explore All' link.
- `components/CustomListingCategoriesSeries.vue` — Presents a horizontal, scrollable carousel of TV series categories, with navigation buttons and an optional 'Explore All' link.
- `components/Discover.vue` — Provides a comprehensive discovery interface for movies and TV shows, allowing users to filter by genre, sort order, country, network, language, streaming provider, vote count, format, year, and rating.
- `components/DynamicSearchCarousel.vue` — Displays a dynamic, scrollable carousel of search results (movies or TV shows), including navigation buttons and a title.
- `components/ExternalLinks.vue` — Displays a grid of external links related to a movie or TV show, including IMDb, Letterboxd, Rotten Tomatoes, Trakt, and TMDb, with dynamic rating fetching.
- `components/FantasiaCard.vue` — Displays a card for a movie or TV show, including an image, title, and actions like adding to a list or opening an external link, with loading states and routing.
- `components/FantasiaLiveBanner.vue` — Displays a promotional banner for the Fantasia 2026 festival, linking to its dedicated coverage page.
- `components/FeatureDescription.vue` — Displays a prominent feature description with a title, subtitle, and cinematic light effects, designed to attract user attention on a landing page.
- `components/festival/BaficiBadge.vue` — Displays an interactive badge for the BAFICI Film Festival 2026, featuring its logo with hover effects and responsive styling.
- `components/festival/BerlinaleBadge.vue` — Displays an interactive badge for the Berlinale Film Festival 2026, featuring its logo with hover effects and responsive styling.
- `components/festival/BifffBadge.vue` — Displays an interactive badge for the BIFFF Film Festival 2026, featuring its logo with hover effects and responsive styling.
- `components/festival/CannesAcidBadge.vue` — Displays an interactive badge for the ACID section of the Cannes Film Festival 2026, featuring its logo with hover effects and responsive styling.
- `components/festival/CannesBadge.vue` — Displays an interactive badge for the Cannes Film Festival 2026, featuring its logo with hover effects and responsive styling.
- `components/festival/CannesCriticsChoiceBadge.vue` — Displays an interactive badge for the Critics' Choice section of the Cannes Film Festival 2026, featuring its logo with hover effects and responsive styling.
- `components/festival/CannesQuinzaineBadge.vue` — Displays an interactive badge for the Quinzaine des Cinéastes section of the Cannes Film Festival 2026, featuring its logo with hover effects and responsive styling.
- `components/festival/CuffBadge.vue` — Displays an interactive badge for the Calgary Underground Film Festival 2026, featuring its logo with hover effects and responsive styling.
- `components/festival/FantasiaBadge.vue` — Displays an interactive badge for the Fantasia International Film Festival 2026, featuring its logo with hover effects and responsive styling.
- `components/festival/FrightfestBadge.vue` — Displays an interactive badge for the FrightFest 2026, featuring its logo with hover effects and responsive styling.
- `components/festival/KviffBadge.vue` — Displays an interactive badge for the Karlovy Vary International Film Festival 2026, featuring its logo with hover effects and responsive styling.
- `components/festival/RomfordBadge.vue` — Displays an interactive badge for the Romford Horror Film Festival 2026, featuring its logo with hover effects and responsive styling.
- `components/festival/RotterdamBadge.vue` — Displays an interactive badge for the Rotterdam Film Festival 2026, featuring its logo with hover effects and responsive styling.
- `components/festival/SlamdanceBadge.vue` — Displays an interactive badge for the Slamdance Film Festival 2026, featuring its logo with hover effects and responsive styling.
- `components/festival/SundanceBadge.vue` — Displays an interactive badge for the Sundance Film Festival 2026, featuring its logo with hover effects and responsive styling.
- `components/festival/SxswBadge.vue` — Displays an interactive badge for the SXSW Film & TV Festival 2026, featuring its logo with hover effects and responsive styling.
- `components/festival/SxswCard.vue` — Renders a card component for an SXSW festival entry, including a link, image, loading state, quick actions, and an external link button.
- `components/festival/TribecaBadge.vue` — Displays an interactive badge for the Tribeca Festival 2026, featuring its logo with hover effects and responsive styling.
- `components/festival/WinnersCarousel.vue` — Displays a horizontal carousel of film festival winners for a given year, grouped by title/director, with navigation controls and award details.
- `components/FestivalDataDisclaimer.vue` — Provides a disclaimer and reporting mechanism for missing festival film data, displayed as a button in the festival hero and a modal for detailed interaction.
- `components/FestivalsCarousel.vue` — Displays a horizontal carousel of festival cards, with navigation buttons and an optional 'Explore All' link.
- `components/FollowedContent.vue` — Displays content (movies/TV shows) from followed production companies or streaming platforms, including filtering and sorting options.
- `components/FrightfestCard.vue` — Renders a card for a Frightfest film, including a poster, quick actions like favoriting, and a link to the official festival page.
- `components/global/ArticleAIDisclosure.vue` — Displays a disclosure that an article was AI-generated and provides a modal form for users to report errors or inaccuracies.
- `components/global/ArticleShareModal.vue` — Provides a modal for sharing articles via link copy, native share, or various social media platforms (WhatsApp, Telegram, X, Facebook, Email).
- `components/global/AuthModal.vue` — A modal component for user authentication, supporting both sign-in and registration tabs, with options for native and social logins.
- `components/global/CardActions.vue` — Provides a dropdown menu of actions for a content card, including rating, adding to a watchlist, or adding to a custom list.
- `components/global/CookieConsent.vue` — Manages and displays a cookie consent banner and a preferences panel, allowing users to accept, decline, or customize cookie settings.
- `components/global/CreateListModal.vue` — Provides a modal interface for users to create new custom lists, including specifying a name, description, and privacy settings.
- `components/global/FollowingModal.vue` — Manages and displays content followed by the user, categorized into people, TV shows, and streaming platforms, with options to unfollow.
- `components/global/Footer.vue` — Provides a global footer with links to resources (changelog, FAQ, policies), social media, and a language switcher.
- `components/global/InstallPrompt.vue` — Displays a prompt to the user to install the web application to their home screen, leveraging the 'beforeinstallprompt' event.
- `components/global/MyListsModal.vue` — Provides a modal component for managing user lists, allowing items to be added, moved, or removed from various lists, and handles API interactions for list management.
- `components/global/Nav.vue` — Implements the main navigation bar for the application, including links to home, discover, and user-specific lists, with dynamic list fetching.
- `components/global/NewsCarousel.vue` — Displays a carousel of the latest news articles, with navigation controls and a link to explore all news.
- `components/global/ProgressTrackingModal.vue` — Manages and displays user watch progress for movies and TV shows within a modal, allowing users to track and update their viewing status.
- `components/global/QuickFav.vue` — A component for quickly adding an item to a user's lists or managing its presence in lists, displaying a 'plus' or 'check' icon accordingly.
- `components/global/QuickFavModal.vue` — A modal component that prompts the user to confirm removal of an item from their watchlist, handling the deletion via an API call.
  - exports: `default`
- `components/global/RatedModal.vue` — Provides a modal for users to view and manage their rated movies and TV shows, allowing them to edit or remove ratings and reviews.
- `components/global/RelatedArticlesCarousel.vue` — Displays a carousel of related news articles based on provided slugs, with navigation and image error handling.
- `components/global/SearchForm.vue` — Provides a global search input form with autocomplete functionality, trending media suggestions, and user avatar/name display.
- `components/global/TopNav.vue` — Provides a fixed top navigation bar component for mobile viewports, displaying a title and adapting its layout based on screen size.
- `components/Hero.vue` — Manages and displays a hero section, potentially with an auto-advancing carousel of items, touch/wheel navigation, and various media details.
- `components/HowItWorksModal.vue` — Displays a modal explaining how release alerts work, featuring an introductory text and a carousel for visual guidance.
- `components/Images.vue` — Displays a panel of images (posters or backdrops) with a title and count, allowing users to open a modal to view them in a gallery.
- `components/ImagesItem.vue` — Renders an individual image item within a gallery, displaying a thumbnail with a loading indicator and emitting an event to open a modal on click.
- `components/KviffCard.vue` — Displays a card component for KVIFF festival items, including a link, optional actions, an image with a loader, and a quick favorite button.
- `components/KviffLiveBanner.vue` — Provides a banner component for the KVIFF 2026 festival, linking to its coverage page and featuring a specific background and logo.
- `components/Listing.vue` — Displays a list of items with an optional title and 'Explore All' link, supporting infinite scrolling to load more items.
- `components/ListingCarousel.vue` — Displays a horizontal carousel listing of items with navigation buttons, an optional title, and an 'Explore All' link.
- `components/Loader.vue` — Provides a reusable SVG-based loading spinner component with customizable size and color properties.
- `components/MediaNav.vue` — Provides a navigation component with a customizable menu, allowing users to select items and emitting an event with the normalized label of the clicked item.
- `components/Modal.vue` — Implements a reusable modal component that can display various content types like images or iframes, with navigation controls for galleries and keyboard accessibility.
- `components/movie/MovieInfo.vue` — Displays detailed information about a movie, including its poster, overview, release status, awards, and related content like recommendations and director's filmography.
- `components/movie/MovieReleases.vue` — Displays grouped release information for a movie, showing release dates and types per country with flag icons, and handles loading and no-data states.
- `components/music/SoundtrackGroup.vue` — Organizes and displays a group of soundtrack items, typically by year, using the SoundtrackItem component for individual entries.
- `components/music/SoundtrackItem.vue` — Displays a single soundtrack item, including its title, disambiguation, and artist, with a link to its MusicBrainz page.
- `components/music/SoundtrackList.vue` — Displays a list of soundtrack albums and their tracks, allowing users to play tracks on YouTube and showing album metadata.
- `components/NoirModal.vue` — Presents a stylized modal dialog with 'N.O.I.R' branding, a manifesto, and options to view a selection of films or close the modal.
- `components/OscarsCarousel.vue` — Displays a horizontal carousel of nominees for the 98th Academy Awards, allowing users to scroll through entries and navigate to full awards coverage.
- `components/OscarsLiveBanner.vue` — Displays a banner for the 98th Academy Awards, indicating live coverage or results, with a countdown to the ceremony.
- `components/person/CreditsHistory.vue` — Displays a person's filmography and TV credits, allowing filtering by department and media type, and grouping credits by year.
- `components/person/CreditsHistoryGroup.vue` — Organizes and displays a group of a person's credits, typically by year, using the CreditsHistoryItem component for individual entries.
- `components/person/CreditsHistoryItem.vue` — Displays a single credit item for a person, including the title, media type, number of episodes (if applicable), and their role, with a link to the media page.
- `components/person/PersonAwardsTab.vue` — Displays a person's awards, including Oscars, Golden Globes, Palme d'Or, Golden Lion, and Golden Bear, with sorting and navigation to associated films.
- `components/person/PersonInfo.vue` — Displays detailed information about a person, including their biography, known for department, birth/death dates, age, and award counts.
- `components/ProductionCompanyCarousel.vue` — A carousel component for displaying a list of production companies, allowing users to navigate through them and view details.
- `components/ProductionHero.vue` — Displays a hero section for a production company, including its name, logo, country, headquarters, description, and a follow button.
- `components/RomfordCard.vue` — A card component specifically for displaying Romford Film Festival entries, including quick actions like external links and favoriting.
- `components/RotterdamCard.vue` — A card component specifically for displaying International Film Festival Rotterdam entries, including quick actions like external links and favoriting.
- `components/search/CategoryCarousel.vue` — A collapsible carousel component for displaying items within a specific category, with navigation and a 'load more' button.
- `components/search/CategorySection.vue` — A collapsible section component for displaying a list of items within a specific category, using Card components.
- `components/search/DiscoverSearch.vue` — Provides a comprehensive search interface for discovering movies and TV shows based on type, genre, sort order, country, network, language, provider, votes, format, year, and rating.
- `components/search/NewsResultCard.vue` — Displays a single news article as a card, including its image, title, description, publication date, and source, with a link to the full article.
- `components/search/SearchGuideModal.vue` — Provides a modal dialog explaining the various search functionalities available within Cinemagoria.
- `components/search/SearchResults.vue` — Displays search results for various content types (movies, series, people, news, users) with filtering, pagination, and a typo-checking mechanism.
- `components/SlamdanceCard.vue` — Displays a card for a Slamdance festival item, including an image, title, and quick actions like favoriting and opening an external source URL.
- `components/SpotlightCarousel.vue` — Renders a horizontal carousel for spotlighted items, featuring navigation buttons and a customizable title and 'Explore All' link.
- `components/StreamingPlatformCarousel.vue` — Displays a horizontal carousel of popular streaming services, allowing users to browse and potentially navigate to a full list.
- `components/StreamingPlatformHero.vue` — Displays a hero section for a streaming platform, showing its logo and name, and allowing users to follow/unfollow the platform.
- `components/SundanceCard.vue` — Displays a card for a Sundance festival item, including an image, title, and quick actions like favoriting and opening an external source URL.
- `components/TribecaCard.vue` — Displays a card for a Tribeca festival item, including an image, title, and quick actions like favoriting and opening an external source URL.
- `components/TribecaLiveBanner.vue` — Displays a promotional banner for the Tribeca 2026 festival, linking to its dedicated coverage page.
- `components/tv/Episodes.vue` — Vue component for displaying and managing TV show episodes, allowing users to select seasons, view episode counts, and mark seasons as watched/unwatched.
- `components/tv/EpisodesItem.vue` — Vue component for displaying a single TV show episode, including its poster, name, and a progress tracking overlay for users.
- `components/tv/TvInfo.vue` — Vue component displaying detailed information about a TV show, including its storyline, poster, and various external links and awards.
- `components/Videos.vue` — Vue component for displaying a collection of videos, allowing users to filter by type and open videos in a modal viewer.
- `components/VideosItem.vue` — Vue component for displaying a single video item with its thumbnail, duration, name, and type, and emitting an event to open a modal.
- `components/WatchOn.vue` — Vue component that displays a grid of streaming providers where a movie or TV show can be watched, with links to each service.
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

- `pages/auth-success.vue` — Handles post-authentication redirects and displays success or error states, managing local storage for return URLs and cleaning up navigation elements.
- `pages/awards/index.vue` — Displays a browsable list of major film awards, allowing users to select an award and year to view winners and nominees, with navigation to related movies or media.
- `pages/changelog/index.vue` — Displays a changelog of releases for the Cinemagoria platform, fetching data directly from the GitHub repository's releases API.
- `pages/contact/index.vue` — Provides a contact form for users to submit inquiries, handling form submission, loading states, and displaying success or error messages.
- `pages/faq/index.vue` — Presents a Frequently Asked Questions page with a table of contents for navigation and expandable sections for detailed answers.
- `pages/festival/bafici-2026/index.vue` — Displays detailed information for the BAFICI 2026 film festival, including films, awards, and schedule, with search and navigation features.
- `pages/festival/berlinale-2026/index.vue` — Displays detailed information for the Berlinale 2026 film festival, including films, awards, and schedule, with search and navigation features.
- `pages/festival/bifff-2026/index.vue` — Displays detailed information for the BIFFF 2026 film festival, including films, awards, and schedule, with search and navigation features.
- `pages/festival/cannes-2026/index.vue` — Displays detailed information for the Cannes Film Festival 2026, including films, awards, and schedule, with search and navigation features.
- `pages/festival/cuff-2026/index.vue` — Vue page component for displaying details of the Calgary Underground Film Festival (CUFF) 2026, including films, schedule, and awards, with interactive search and navigation.
- `pages/festival/fantasia-2026/index.vue` — Vue page component for displaying details of the Fantasia International Film Festival 2026, including films, schedule, and awards, with interactive search and navigation.
- `pages/festival/frightfest-2026/index.vue` — Vue page component for displaying details of the FrightFest 2026, including films and schedule, with interactive search and navigation.
- `pages/festival/kviff-2026/index.vue` — Vue page component for displaying details of the Karlovy Vary International Film Festival (KVIFF) 2026, including films, schedule, and awards, with interactive search and navigation.
- `pages/festival/romford-2026/index.vue` — Vue page component for displaying details of the Romford Horror Film Festival 2026, including films, schedule, and awards, with interactive search and navigation.
- `pages/festival/rotterdam-2026/index.vue` — Vue page component for displaying details of the International Film Festival Rotterdam (IFFR) 2026, including films, schedule, and awards, with interactive search and navigation.
- `pages/festival/slamdance-2026/index.vue` — Vue page component for displaying details of the Slamdance Film Festival 2026, including films, schedule, and awards, with interactive search and navigation.
- `pages/festival/sundance-2026/index.vue` — Displays the Sundance 2026 film festival page, including film listings, schedule, awards, and a hero section with a backdrop image and navigation.
- `pages/festival/sxsw-2026/index.vue` — Displays the SXSW 2026 film festival page, including film listings, schedule, awards, and a hero section with a backdrop image and navigation.
- `pages/festival/tribeca-2026/index.vue` — Displays the Tribeca 2026 film festival page, including film listings, schedule, awards, and a hero section with a backdrop image and navigation.
- `pages/genre/[id]/movie.vue` — Displays a paginated list of movies belonging to a specific genre, fetching data from an API and providing a 'load more' functionality.
- `pages/genre/[id]/tv.vue` — Displays a paginated list of TV shows belonging to a specific genre, fetching data from an API and providing a 'load more' functionality.
- `pages/index.vue` — Serves as the homepage, displaying various carousels for featured content, news, and festivals, along with conditional banners for live events like Oscars, Cannes, and Fantasia.
- `pages/lists/[slug].vue` — Displays a specific user-created list of movies and TV shows, allowing the owner to edit list details and items, and providing filtering and sorting options.
- `pages/lists/index.vue` — Displays a user's custom lists of movies and TV shows, providing functionality to create, edit, and delete lists, and filter between public and private lists.
- `pages/login/index.vue` — Serves as the login page, displaying an authentication modal for users to log in or register.
- `pages/movie/[id].vue` — Displays detailed information for a specific movie, including an overview, media, credits, reviews, and awards, handling data fetching and UI state.
- `pages/movie/category/[name].vue` — Displays a paginated list of movies belonging to a specific category (e.g., trending, popular), with dynamic title and meta information.
- `pages/movie/followed.vue` — Renders a page displaying content from followed movie-related entities, leveraging a shared component for display logic.
- `pages/movie/index.vue` — Serves as the main discovery page for movies, featuring popular, top-rated, upcoming, and now playing lists, along with filters and followed content.
- `pages/news/[slug].vue` — Displays a single news article based on its slug, including content, related entities, and user interaction features like saving and sharing.
- `pages/news/index.vue` — Displays a feed of the latest news articles, with filtering by source and category, search functionality, and user-specific saved article indicators.
- `pages/noir/index.vue` — Displays the N.O.I.R Archive, a curated list of historical titles, with sorting options and functionality to clone the archive to a user's personal list.
- `pages/notifications/index.vue` — Displays user notifications about new content from followed people, companies, streaming services, and shows, with filtering and marking as read/unread.
- `pages/person/[id].vue` — Displays detailed information for a specific person, including their biography, known for credits, filmography, images, and awards.
- `pages/production-companies/index.vue` — Displays a grid of production companies, allowing users to browse and navigate to individual company pages, with sorting by name and dynamic image loading.
- `pages/production/[slug].vue` — Displays a detailed page for a specific production company, including a hero section, and allows users to filter and sort associated movies and TV shows.
- `pages/recovery/index.vue` — Provides a user interface for password recovery, allowing users to submit their email to receive a reset link and displaying a confirmation message.
  - Handles password recovery requests and redirects to the home page or login page.
- `pages/register/index.vue` — Serves as the registration page, displaying an authentication modal pre-configured for user registration upon mounting.
- `pages/search/index.vue` — Implements a dynamic search results page that displays movies, TV shows, and news based on a user's query, with loading states and infinite scrolling.
  - Registers a route for search queries and manages search state via a Pinia store.
- `pages/settings/index.vue` — Provides a user interface for managing account settings, including avatar, email, alias, and privacy preferences, with options to delete the account.
- `pages/streaming-services/index.vue` — Displays a grid of streaming services, allowing users to browse and navigate to individual service pages, with sorting by name and dynamic image loading.
- `pages/streaming/[slug].vue` — Displays details for a specific streaming platform, including its movies and TV shows, with filtering and sorting options.
- `pages/streaming/followed.vue` — Displays a user's followed streaming content, distinguishing between movies and TV shows based on the URL query parameter.
- `pages/tv/[id].vue` — Displays detailed information for a specific TV show, including an overview, credits, episodes, videos, images, soundtracks, and awards.
- `pages/tv/category/[name].vue` — Displays a list of TV shows belonging to a specific category (e.g., trending, popular), with pagination for loading more items.
- `pages/tv/followed.vue` — Displays TV shows that a user has followed, leveraging the `FollowedContent` component.
- `pages/tv/index.vue` — Serves as the main discovery page for TV shows, featuring popular, top-rated, on-air, and airing today categories, along with filters.
- `pages/u/[alias].vue` — Displays a user's public profile, including their reviews and lists, with functionality to follow/unfollow the user.
- `pages/usage-policies/index.vue` — Presents the platform's usage policies and privacy agreement, organized into scrollable sections with a table of contents.
- `pages/watchlist/index.vue` — Displays a user's watchlist of movies and TV shows, allowing filtering, sorting, and management of watched items.
- `pages/wip/index.vue` — Displays a 'Work in Progress' or 'Under Maintenance' page, providing options to return home or view more information.

### `plugins`

- `plugins/bus.js` — Nuxt plugin that provides a global event bus using the mitt library for inter-component communication.
- `plugins/lazyload.js` — Nuxt plugin that registers a 'lazyload' Vue directive to dynamically set the 'src' attribute of an image element.

### `public`

- `public/manifest.json` — Defines the web application manifest for Cinemagoria, providing metadata like name, description, start URL, display mode, theme colors, and various icon sizes for PWA installation.
- `public/sw.js` — A self-destroying service worker script designed to unregister itself and reload all client pages upon activation, ensuring no caching or offline functionality is provided.
  - This file is explicitly marked as not to be version controlled.

### `scripts`

- `scripts/seed_tribeca_2026_awards.cjs` — One-shot script to seed the `festival_awards` table with 2026 Tribeca Festival feature film award winners, including bilingual fields (EN/ES).
  - Run with `node scripts/seed_tribeca_2026_awards.cjs`.
- `scripts/syncCustomOverrides.js` — Fetches custom title override data from the `title_overrides` Turso database table and writes it to a JSON file for public consumption.
- `scripts/syncHeroData.js` — Retrieves hero selection data from the `hero_selections` Turso database table and saves it as a JSON file for public use.
- `scripts/syncNoirEnrichmentData.js` — Fetches enrichment data for 'noir historical' titles from the `noir_historical` Turso database table and writes it to a JSON file.
- `scripts/syncNoirHistorical.js` — Synchronizes new hero selections into the `noir_historical` Turso database table, optionally fetching Spanish titles from TMDB.

### `server/api`

- `server/api/article-report.post.ts` — Handles POST requests to report issues with articles, sanitizing input, validating data, and storing the report in the database.
  - exports: `default`
- `server/api/article/[slug].get.ts` — Handles GET requests for a specific article by slug, fetching its details from the database and returning structured data.
  - exports: `default`
- `server/api/article/rss.get.ts` — Provides a permanent redirect for the legacy RSS feed endpoint to the canonical /feed URL.
  - exports: `default`
  - Registers a permanent redirect from /api/article/rss to https://cinemagoria.com/feed.
- `server/api/articles/by-slugs.get.ts` — Handles GET requests to retrieve multiple articles based on a comma-separated list of slugs, returning a filtered and structured list.
  - exports: `default`
- `server/api/awards/index-page.get.ts` — Handles GET requests to retrieve awards data for a specific award type and year, providing a structured list of awards, years, and categories.
  - exports: `default`
- `server/api/awards/index.get.ts` — Handles GET requests to retrieve awards data (Oscars, Golden Globes, Festival Awards) filtered by TMDb ID, nominee name, film title, or type.
  - exports: `default`
- `server/api/contact.post.ts` — Handles POST requests for the contact form, sanitizing input, validating email, and storing the message in the database.
  - exports: `default`
- `server/api/festival-report.post.ts` — Handles POST requests to report issues with festival data, sanitizing input, validating data, and storing the report in the database.
  - exports: `default`
- `server/api/festival/bafici/awards.get.ts` — Handles GET requests to retrieve awards data specifically for the BAFICI 2026 festival.
  - exports: `default`
- `server/api/festival/bafici/films.get.ts` — API endpoint to retrieve a list of films for the BAFICI 2026 festival, supporting filtering by TMDB or IMDb ID and integrating TMDB data for enriched film details.
  - exports: `default`
- `server/api/festival/bafici/schedule.get.ts` — API endpoint to retrieve the screening schedule for the BAFICI 2026 festival, joining screening and film data from the database.
  - exports: `default`
- `server/api/festival/berlinale/awards.get.ts` — API endpoint to fetch award information for the Berlinale 2026 festival using a utility function.
  - exports: `default`
- `server/api/festival/berlinale/films.get.ts` — API endpoint to retrieve a list of films for the Berlinale 2026 festival, supporting filtering by TMDB or IMDb ID and integrating TMDB data for enriched film details.
  - exports: `default`
- `server/api/festival/berlinale/schedule.get.ts` — API endpoint to retrieve the screening schedule for the Berlinale 2026 festival, joining screening and film data from the database.
  - exports: `default`
- `server/api/festival/bifff/awards.get.ts` — API endpoint to fetch award information for the BIFFF 2026 festival using a utility function.
  - exports: `default`
- `server/api/festival/bifff/films.get.ts` — API endpoint to retrieve a list of films for the BIFFF 2026 festival, supporting filtering by TMDB or IMDb ID and integrating TMDB data for enriched film details.
  - exports: `default`
- `server/api/festival/bifff/schedule.get.ts` — API endpoint to retrieve the screening schedule for the BIFFF 2026 festival, joining screening and film data from the database.
  - exports: `default`
- `server/api/festival/cannes/awards.get.ts` — API endpoint to fetch award information for the Cannes 2026 festival using a utility function.
  - exports: `default`
- `server/api/festival/cannes/films.get.ts` — API endpoint to retrieve a list of films for the Cannes 2026 festival, supporting filtering by TMDB or IMDb ID and integrating TMDB data for enriched film details.
  - exports: `default`
- `server/api/festival/cannes/schedule.get.ts` — API endpoint to retrieve the 2026 Cannes Film Festival screening schedule, including film details and screening times, formatted for client consumption.
  - Registers a GET route for /api/festival/cannes/schedule.
- `server/api/festival/cuff/awards.get.ts` — API endpoint to fetch the awards for the 2026 Calgary Underground Film Festival.
  - Registers a GET route for /api/festival/cuff/awards.
- `server/api/festival/cuff/films.get.ts` — API endpoint to retrieve films for the 2026 Calgary Underground Film Festival, with optional filtering by TMDB or IMDb ID and limiting results.
  - Registers a GET route for /api/festival/cuff/films.
- `server/api/festival/cuff/schedule.get.ts` — API endpoint to retrieve the 2026 Calgary Underground Film Festival screening schedule, including film details and screening times.
  - Registers a GET route for /api/festival/cuff/schedule.
- `server/api/festival/fantasia/awards.get.ts` — API endpoint to fetch the awards for the 2026 Fantasia International Film Festival.
  - Registers a GET route for /api/festival/fantasia/awards.
- `server/api/festival/fantasia/films.get.ts` — API endpoint to retrieve films for the 2026 Fantasia International Film Festival, with optional filtering by TMDB or IMDb ID and limiting results.
  - Registers a GET route for /api/festival/fantasia/films.
- `server/api/festival/fantasia/schedule.get.ts` — API endpoint to retrieve the 2026 Fantasia International Film Festival screening schedule, including film details and screening times.
  - Registers a GET route for /api/festival/fantasia/schedule.
- `server/api/festival/films-batch.get.ts` — API endpoint to fetch films for multiple festivals in a single request, supporting filtering by year, limiting results per festival, and a slim projection for carousel/card consumers.
  - Registers a GET route for /api/festival/films-batch. Requires 'festivals' query param (comma-separated slugs).
- `server/api/festival/frightfest/films.get.ts` — API endpoint to retrieve films for the 2026 FrightFest, with optional filtering by TMDB or IMDb ID and limiting results.
  - Registers a GET route for /api/festival/frightfest/films.
- `server/api/festival/frightfest/schedule.get.ts` — API endpoint to retrieve the FrightFest 2026 film screening schedule, including film details and screening information, from the database.
  - exports: `default`
  - Registers a GET route for /api/festival/frightfest/schedule.
- `server/api/festival/kviff/awards.get.ts` — API endpoint to fetch the awards for the Karlovy Vary International Film Festival (KVIFF) 2026 using a utility function.
  - exports: `default`
  - Registers a GET route for /api/festival/kviff/awards.
- `server/api/festival/kviff/films.get.ts` — API endpoint to retrieve a list of films for the Karlovy Vary International Film Festival (KVIFF) 2026, with optional filtering by TMDB or IMDb ID.
  - exports: `default`
  - Registers a GET route for /api/festival/kviff/films.
- `server/api/festival/kviff/schedule.get.ts` — API endpoint to retrieve the Karlovy Vary International Film Festival (KVIFF) 2026 film screening schedule, including film details and screening information.
  - exports: `default`
  - Registers a GET route for /api/festival/kviff/schedule.
- `server/api/festival/romford/awards.get.ts` — API endpoint to fetch the awards for the Romford Horror Festival 2026 using a utility function.
  - exports: `default`
  - Registers a GET route for /api/festival/romford/awards.
- `server/api/festival/romford/films.get.ts` — API endpoint to retrieve a list of films for the Romford Horror Festival 2026, with optional filtering by TMDB or IMDb ID.
  - exports: `default`
  - Registers a GET route for /api/festival/romford/films.
- `server/api/festival/romford/schedule.get.ts` — API endpoint to retrieve the Romford Horror Festival 2026 film screening schedule, including film details and screening information, from the database.
  - exports: `default`
  - Registers a GET route for /api/festival/romford/schedule.
- `server/api/festival/rotterdam/awards.get.ts` — API endpoint to fetch the awards for the Rotterdam Film Festival 2026 using a utility function.
  - exports: `default`
  - Registers a GET route for /api/festival/rotterdam/awards.
- `server/api/festival/rotterdam/films.get.ts` — API endpoint to retrieve a list of films for the Rotterdam Film Festival 2026, with optional filtering by TMDB/IMDb ID and sorting by rating.
  - exports: `default`
  - Registers a GET route for /api/festival/rotterdam/films.
- `server/api/festival/rotterdam/schedule.get.ts` — API endpoint to retrieve the Rotterdam Film Festival 2026 film screening schedule, including film details and screening information, from the database.
  - exports: `default`
  - Registers a GET route for /api/festival/rotterdam/schedule.
- `server/api/festival/slamdance/awards.get.ts` — API endpoint to fetch the awards for the Slamdance Film Festival 2026 using a utility function.
  - exports: `default`
  - Registers a GET route for /api/festival/slamdance/awards.
- `server/api/festival/slamdance/films.get.ts` — API endpoint to retrieve a list of films for the Slamdance Film Festival 2026, with optional filtering by TMDB or IMDb ID.
  - exports: `default`
  - Registers a GET route for /api/festival/slamdance/films.
- `server/api/festival/slamdance/schedule.get.ts` — API endpoint to retrieve the screening schedule for the 2026 Slamdance Film Festival, including film details and screening information from the database.
- `server/api/festival/status.get.ts` — API endpoint to fetch festival status badges for a given TMDb ID and year, used as a client-side fallback when festival membership data is not already present.
- `server/api/festival/sundance/awards.get.ts` — API endpoint to fetch award information for the 2026 Sundance Film Festival.
- `server/api/festival/sundance/films.get.ts` — API endpoint to retrieve a list of films for the 2026 Sundance Film Festival, supporting filtering by TMDb/IMDb ID and sorting by rating or title.
- `server/api/festival/sundance/schedule.get.ts` — API endpoint to retrieve the screening schedule for the 2026 Sundance Film Festival, including film details and screening information from the database.
- `server/api/festival/sxsw/awards.get.ts` — API endpoint to fetch award information for the 2026 SXSW Film & TV Festival.
- `server/api/festival/sxsw/films.get.ts` — API endpoint to retrieve a list of films for the 2026 SXSW Film & TV Festival, supporting filtering by TMDb/IMDb ID and sorting by rating or title.
- `server/api/festival/sxsw/schedule.get.ts` — API endpoint to retrieve the screening schedule for the 2026 SXSW Film & TV Festival, including film details and screening information from the database.
- `server/api/festival/tribeca/awards.get.ts` — API endpoint to fetch award information for the 2026 Tribeca Festival.
- `server/api/festival/tribeca/films.get.ts` — API endpoint to retrieve a list of films for the 2026 Tribeca Festival, supporting filtering by TMDb/IMDb ID and sorting by title.
- `server/api/festival/tribeca/schedule.get.ts` — API endpoint to retrieve the screening schedule for the 2026 Tribeca Festival, including film details and screening information from the database.
- `server/api/hero.get.ts` — API endpoint to fetch a randomized selection of hero items (movies/TV shows) with embedded festival status and trailer information from the database.
  - Registers a GET route for /api/hero.
- `server/api/imdb-rating/[id].get.ts` — API endpoint to retrieve IMDb rating and vote count for a given media ID from a Turso database, handling CORS and caching.
  - Registers a GET route for /api/imdb-rating/:id. Also handles OPTIONS requests.
- `server/api/news.get.ts` — API endpoint to fetch curated news articles, supporting pagination, language filtering, source filtering, and search queries.
  - Registers a GET route for /api/news.
- `server/api/noir-archive.get.ts` — API endpoint to retrieve a list of historical noir films and TV shows from a Turso database, ordered by release date.
  - Registers a GET route for /api/noir-archive.
- `server/api/progress/[userId]/[mediaType]/[mediaId].delete.ts` — API endpoint to delete a user's progress tracking entry for a specific media item (movie or episode).
  - Registers a DELETE route for /api/progress/:userId/:mediaType/:mediaId.
- `server/api/progress/[userId]/[mediaType]/[mediaId].get.ts` — API endpoint to retrieve a user's progress tracking details for a specific media item (movie or episode).
  - Registers a GET route for /api/progress/:userId/:mediaType/:mediaId.
- `server/api/progress/[userId]/[mediaType]/[mediaId].put.ts` — API endpoint to create or update a user's progress tracking for a specific media item (movie or episode).
  - Registers a PUT route for /api/progress/:userId/:mediaType/:mediaId.
- `server/api/progress/[userId]/active/[mediaType]/[mediaId].put.ts` — API endpoint to update the 'manually_active' flag for a user's progress tracking entry for a specific media item.
  - Registers a PUT route for /api/progress/:userId/active/:mediaType/:mediaId.
- `server/api/progress/[userId]/batch.put.ts` — API endpoint to batch update a user's progress for multiple episodes, setting a specified completion percentage.
  - Registers a PUT route for /api/progress/:userId/batch.
- `server/api/progress/[userId]/hydrated.get.ts` — API endpoint to fetch a user's progress tracking list, enriched with hydrated media details from TMDB, utilizing caching.
  - Registers a GET route for /api/progress/:userId/hydrated.
- `server/api/progress/[userId]/index.get.ts` — API endpoint to retrieve a list of all progress tracking entries for a given user, ordered by last update.
  - Registers a GET route for /api/progress/:userId.
- `server/api/search-log.post.ts` — Handles POST requests to log search queries, storing the query, origin IP, and optionally user email in a Turso database for analytics.
  - Registers a POST route at `/api/search-log`.
- `server/api/search/person.get.ts` — Handles GET requests to search for people using the TMDB API, returning a list of matching person IDs.
  - Registers a GET route at `/api/search/person`.
- `server/api/spotlight/[type].get.ts` — Handles GET requests to retrieve curated spotlight movies or TV shows from a database, formatting the results for display.
  - Registers a GET route at `/api/spotlight/[type]` where `[type]` can be 'movies' or 'tv'.

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

- `server/utils/db.ts` — Provides utility functions for connecting to and executing queries against a Turso/libSQL database, including connection management and query timeout handling.
  - exports: `useDb`, `dbExecute`
- `server/utils/rss-feed.ts` — Constructs an RSS feed for news articles, supporting both English and Spanish languages and integrating database queries for article content and Vimeo oEmbed data.
  - exports: `buildNewsFeed`
- `server/utils/vimeo-oembed.ts` — Fetches and caches oEmbed metadata for Vimeo videos, providing thumbnail URLs and other details, used by news articles and RSS feeds.
  - exports: `getVimeoOembed`, `getVimeoThumb`
- `server/utils/festivalAwards.ts` — Fetches and processes festival award data from the database for a given festival slug, supporting English and Spanish locales with fallback logic.
  - exports: `fetchFestivalAwards`
- `server/utils/festivals.ts` — Manages canonical festival name-to-slug mappings and retrieves festival participation status for a batch of TMDB IDs from the database.
  - exports: `FESTIVAL_NAME_BY_SLUG`, `NAME_TO_SLUG`, `getFestivalStatusByTmdbId`
- `server/utils/sitemap-helpers.ts` — Provides utilities for fetching movie/TV show IDs from TMDB across multiple pages and generating an XML sitemap from these IDs.
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

- `utils/api.js` — Provides utility functions for interacting with various APIs (TMDB, Trakt, IMDb) and managing movie/TV show data, including enrichment and filtering.
  - exports: `apiImgUrl`, `EXCLUDED_MOVIE_IDS`, `EXCLUDED_TV_IDS`, `getHeroEnrichment`, `getNoirEnrichment`, `getCustomEnrichment`, `resolveItemPoster`, `languages`, `getListItem`, `getIMDbRatingFromDB`, `getMovies`
- `utils/categoryLabels.js` — Defines English display labels for editorial taxonomy categories and provides a function to retrieve the label for a given category token.
  - exports: `CATEGORY_LABELS`, `categoryLabel`
- `utils/countries.js` — Exports a comprehensive list of countries with their respective ISO 3166-1 alpha-2 codes and names.
  - exports: `countries`
- `utils/helpers.js` — Provides utility functions for formatting dates, handling image loading errors, and determining the release status context of a media item.
  - exports: `formatDate`, `handleImageError`, `getReleaseStatusContext`
- `utils/itemMapper.js` — Maps a raw item object to a standardized payload format suitable for database storage, inferring missing fields where possible.
  - exports: `mapItemToDbPayload`
- `utils/membershipStore.js` — Manages a session-wide cache for user membership data (watchlist and custom lists) to reduce API requests and improve performance.
  - exports: `invalidateMembershipCache`, `getMembership`
- `utils/musicbrainz.js` — Provides functions to search for soundtracks and retrieve album tracks using the MusicBrainz API.
  - exports: `searchSoundtracks`, `getAlbumTracks`, `getMusicBrainzUrl`
- `utils/newsSources.js` — Defines lists of supported news sources for different languages and their corresponding URLs.
  - exports: `SOURCES`, `SOURCE_URLS`
- `utils/relatedFooter.js` — Provides utilities to strip 'Related Articles' footers from article bodies and extract related article slugs from those sections.
  - exports: `stripRelatedFooter`, `extractRelatedSlugs`
- `utils/resolvePhase.js` — An intentionally empty file marked as deprecated, previously used for calculating content phases.
  - This file is deprecated and should not be used; it will be removed in a future cleanup.

## Dependency Edges

| From | To | Imports |
| :--- | :--- | ---: |
| `server/api` | `server/data` | 2 |
| `server/routes` | `server/utils` | 1 |

## External Packages (imported in code)

- `~` (392 imports)
- `~~` (49 imports)
- `h3` (44 imports)
- `vue` (42 imports)
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
