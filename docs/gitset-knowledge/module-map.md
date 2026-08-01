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
- `components/global/UserNav.vue` — Displays user navigation, including notifications, avatar, and a dropdown menu with profile links, language options, and a logout button, fetching user data and notification counts.
- `components/BaficiCard.vue` — Displays a card component for BAFICI festival items, including an image, quick actions like external links, and a link to the item's detail page.
- `components/BerlinaleCard.vue` — Displays a card component for Berlinale festival items, including an image, quick actions like external links, and a link to the item's detail page.
- `components/BifffCard.vue` — Displays a card component for BIFFF festival items, including an image, quick actions like external links, and a link to the item's detail page.
- `components/CannesCard.vue` — Displays a card component for Cannes festival items, including an image, quick actions like external links, and a link to the item's detail page.
- `components/CannesLiveBanner.vue` — Displays a promotional banner for the Cannes 2026 festival, featuring a dynamic 'LIVE' indicator and a link to the festival's coverage page.
- `components/CannesWinnersBanner.vue` — Displays a promotional banner for the Cannes 2026 winners, featuring a marquee of award recipients and a link to the festival's palmarès page.
- `components/Card.vue` — A generic card component for displaying various media types (movies, TV, people, productions, streaming, festivals) with poster, title, rating, and quick actions.
- `components/common/AwardsTab.vue` — Displays a tabbed view of awards received by a movie, TV show, or person, categorizing them by major festivals like Oscars, Golden Globes, Palme d'Or, Golden Lion, and Golden Bear.
- `components/common/FullCreditsModal.vue` — Displays a modal with full crew credits for a given title, organized by department with collapsible sections for detailed viewing.
- `components/common/MediaProgressBar.vue` — Displays a circular progress bar and a slider to track and update a user's viewing progress for a media item, showing watched duration and total duration.
- `components/Credits.vue` — Displays a horizontal, scrollable carousel of cast members for a movie or TV show, including navigation buttons and integrating a `CreditsItem` for each person.
- `components/CreditsItem.vue` — Displays an individual cast member's image, name, and character, linking to their person detail page and showing a loading state for the image.
- `components/CuffCard.vue` — Displays a card for a movie or TV show, including an image, title, and actions, with specific styling for 'Cuff' festival items.
- `components/CustomListingCategoriesMovies.vue` — Renders a horizontal carousel of movie categories, allowing users to browse different genres or collections with navigation controls.
- `components/CustomListingCategoriesSeries.vue` — Renders a horizontal carousel of TV series categories, allowing users to browse different genres or collections with navigation controls.
- `components/Discover.vue` — Provides a comprehensive discovery interface for movies and TV shows, allowing users to filter by genre, sort order, country, network, language, streaming provider, vote count, format, year, and rating.
- `components/DynamicSearchCarousel.vue` — Displays a dynamic, horizontal carousel of search results for movies or TV shows, with navigation buttons and a customizable title.
- `components/ExternalLinks.vue` — Displays a grid of external links for a movie or TV show, including IMDb, Letterboxd, Rotten Tomatoes, Trakt, and TMDb, with associated icons.
- `components/FantasiaCard.vue` — Displays a card for a movie or TV show, including an image, title, and actions, with specific styling for 'Fantasia' festival items.
- `components/FantasiaLiveBanner.vue` — Displays a promotional banner for the Fantasia 2026 festival, linking to its dedicated coverage page.
- `components/FeatureDescription.vue` — Vue component displaying a feature description with cinematic light effects and metallic gradient text, designed to be responsive across different screen sizes.
- `components/festival/BaficiBadge.vue` — Vue component for displaying a BAFICI Film Festival 2026 badge with a hover effect and responsive styling.
- `components/festival/BerlinaleBadge.vue` — Vue component for displaying a Berlinale Film Festival 2026 badge with a hover effect and responsive styling.
- `components/festival/BifffBadge.vue` — Vue component for displaying a BIFFF Film Festival 2026 badge with a hover effect and responsive styling.
- `components/festival/CannesAcidBadge.vue` — Vue component for displaying a Cannes Film Festival 2026 – ACID badge with a hover effect and responsive styling.
- `components/festival/CannesBadge.vue` — Vue component for displaying a Cannes Film Festival 2026 badge with a hover effect and responsive styling.
- `components/festival/CannesCriticsChoiceBadge.vue` — Vue component for displaying a Cannes Film Festival 2026 – Critics' Choice badge with a hover effect and responsive styling.
- `components/festival/CannesQuinzaineBadge.vue` — Vue component for displaying a Cannes Film Festival 2026 – Quinzaine des Cinéastes badge with a hover effect and responsive styling.
- `components/festival/CuffBadge.vue` — Vue component for displaying a Calgary Underground Film Festival 2026 badge with a hover effect and responsive styling.
- `components/festival/FantasiaBadge.vue` — Vue component for displaying a Fantasia International Film Festival 2026 badge with a hover effect and responsive styling.
- `components/festival/FrightfestBadge.vue` — Vue component for displaying a FrightFest 2026 badge with a hover effect and responsive styling.
- `components/festival/KviffBadge.vue` — Vue component for displaying a Karlovy Vary International Film Festival 2026 badge with a hover effect and responsive styling.
- `components/festival/RomfordBadge.vue` — Vue component for displaying a Romford Horror Film Festival 2026 badge with a hover effect and responsive styling.
- `components/festival/RotterdamBadge.vue` — Vue component for displaying a Rotterdam Film Festival 2026 badge with a hover effect and responsive styling.
- `components/festival/SlamdanceBadge.vue` — Vue component for displaying a Slamdance Film Festival 2026 badge with a hover effect and responsive styling.
- `components/festival/SundanceBadge.vue` — Vue component for displaying a Sundance Film Festival 2026 badge with a hover effect and responsive styling.
- `components/festival/SxswBadge.vue` — Vue component for displaying an SXSW Film & TV Festival 2026 badge with a hover effect and responsive styling.
- `components/festival/SxswCard.vue` — Vue component for an SXSW festival card, displaying film information, quick actions, and a link to the official festival page.
- `components/festival/TiffBadge.vue` — Vue component for displaying a TIFF 2026 badge with a hover effect and responsive styling.
- `components/festival/TribecaBadge.vue` — Vue component for displaying a Tribeca Festival 2026 badge with a hover effect and responsive styling.
- `components/festival/VeniceBadge.vue` — Vue component for displaying a Venice Film Festival 2026 badge with a hover effect and responsive styling.
- `components/festival/WinnersCarousel.vue` — Displays a scrollable carousel of festival award winners, grouped by film, with navigation controls and a header showing the festival year and an optional statistic.
- `components/FestivalDataDisclaimer.vue` — Provides a disclaimer about missing festival data, including a trigger button teleported to a hero element and a modal for detailed information and reporting issues.
- `components/FestivalsCarousel.vue` — Renders a horizontal carousel for displaying a list of festivals, with navigation buttons and an optional title and 'Explore All' link.
- `components/FestivalsRotatingBanner.vue` — Displays a rotating banner featuring different festivals, with a background gradient, shimmer effect, and navigation to the active festival's page.
- `components/FollowedContent.vue` — Displays a list of movies or TV shows from followed production companies or streaming platforms, with filtering, sorting, and infinite scrolling capabilities.
- `components/FrightfestCard.vue` — Displays a card for a Frightfest film, including a poster, quick actions like external links and favoriting, and a link to the film's detail page.
- `components/global/ArticleAIDisclosure.vue` — Informs users that an article was AI-generated and provides a modal for reporting errors or inaccuracies found within the content.
- `components/global/ArticleShareModal.vue` — Provides a modal for sharing an article via a direct link, custom message, or various social media platforms, including native sharing options.
- `components/global/AuthModal.vue` — Provides a modal for user authentication, allowing users to sign in or register, with different content based on whether it's a community gate or general sign-in.
- `components/global/CardActions.vue` — Provides a dropdown menu of actions for a content card, including rating, adding to a watchlist, or adding to a custom list.
- `components/global/CookieConsent.vue` — Manages and displays a cookie consent banner and a preferences panel, allowing users to accept all, decline all, or customize their cookie settings.
- `components/global/CreateListModal.vue` — Provides a modal for users to create a new custom list, including fields for name, description, and privacy settings.
- `components/global/FollowingModal.vue` — Vue component for a modal that allows users to manage the people, TV shows, production companies, and streaming services they follow.
- `components/global/Footer.vue` — Vue component for the global footer, including navigation links, social media icons, and copyright information.
- `components/global/InstallPrompt.vue` — Vue component that displays a prompt to the user to install the Cinemagoria Progressive Web App (PWA) to their home screen.
- `components/global/MyListsModal.vue` — Vue component for a modal that allows users to manage items within their custom lists, including adding, removing, and moving items.
- `components/global/Nav.vue` — Vue component for the main navigation bar, providing links to different sections of the application and user-specific features like lists.
- `components/global/NewsCarousel.vue` — Vue component that displays a carousel of the latest news articles, with navigation controls and a link to explore all news.
- `components/global/ProgressTrackingModal.vue` — Vue component for a modal that enables users to track their watch progress for movies and TV series, including individual episodes.
- `components/global/QuickFav.vue` — Vue component providing a quick action button to add an item to a user's lists or manage its list membership.
- `components/global/QuickFavModal.vue` — Vue component for a confirmation modal that prompts the user before removing an item from their watchlist.
  - Registers 'open-quickfav-modal' and emits 'favorites-updated' events.
- `components/global/RatedModal.vue` — Provides a modal interface for users to view and manage their rated movies and TV shows, including options to edit reviews and remove ratings.
- `components/global/RelatedArticlesCarousel.vue` — Displays a horizontal carousel of related articles, typically news items, with navigation controls and image loading/error handling.
- `components/global/SearchForm.vue` — Implements a search input form with debouncing, a back button for non-root pages, and functionality to fetch user avatars and names.
- `components/global/TopNav.vue` — A fixed top navigation bar component that displays a title and is conditionally hidden on larger screens.
- `components/Hero.vue` — Displays a hero section with a rotating carousel of items, auto-advance functionality, and options for user interaction like rating and tracking.
- `components/HowItWorksModal.vue` — Presents a modal explaining how release alerts work, featuring an introductory text and a carousel for visual guidance.
- `components/Images.vue` — Organizes and displays a collection of images (posters or backdrops) with a title and count, providing a modal for full-size viewing.
- `components/ImagesItem.vue` — Renders an individual image item within a gallery, displaying a thumbnail with a loading indicator and emitting an event to open a modal on click.
- `components/KviffCard.vue` — Displays a card for a KVIFF (Karlovy Vary International Film Festival) item, including an image, quick actions, and a link to its detail page or external source.
- `components/KviffLiveBanner.vue` — A promotional banner for the KVIFF 2026 festival, providing a link to its coverage page with a distinct visual style.
- `components/Listing.vue` — Displays a list of items, typically movie or TV show cards, with an optional title, 'Explore All' link, and infinite scrolling functionality to load more items.
- `components/ListingCarousel.vue` — Renders a horizontal carousel of items, such as movie or TV show cards, with navigation buttons and an optional 'Explore All' link.
- `components/Loader.vue` — Provides a reusable SVG-based loading spinner component with customizable size and color properties.
- `components/MediaNav.vue` — Implements a navigation component for media types, allowing users to switch between different categories with an active state indicator.
- `components/Modal.vue` — A generic modal component that can display various content types like images or iframes, with navigation arrows for galleries and keyboard accessibility.
- `components/movie/MovieInfo.vue` — Displays detailed information about a movie, including its poster, overview, cast, crew, external links, and awards, with various interactive tabs.
- `components/movie/MovieReleases.vue` — Displays detailed release information for a movie, grouped by country, including certification, release dates, and types.
- `components/music/SoundtrackGroup.vue` — Organizes and displays a group of soundtrack items, typically by year, within a larger soundtrack list.
- `components/music/SoundtrackItem.vue` — Displays a single soundtrack item, including its title, disambiguation, and artist, with a link to MusicBrainz.
- `components/music/SoundtrackList.vue` — Displays a list of soundtrack albums and their tracks, allowing users to select an album and play tracks via YouTube.
- `components/NoirModal.vue` — Displays a stylized modal window for the 'N.O.I.R' feature, providing information about curated content and an option to view a manifesto.
- `components/OscarsCarousel.vue` — Displays a horizontal, scrollable carousel of nominees for the 98th Academy Awards, allowing users to navigate through different award categories and view details.
- `components/OscarsLiveBanner.vue` — Renders a dynamic banner for the 98th Academy Awards, displaying either 'LIVE' status with a ticker of winners or 'RESULTS' with a countdown to the ceremony.
- `components/person/CreditsHistory.vue` — Manages and displays a person's filmography and crew credits, allowing filtering by department and media type (movies/TV).
- `components/person/CreditsHistoryGroup.vue` — Groups and displays a list of a person's credits for a specific year, rendering each credit using the CreditsHistoryItem component.
- `components/person/CreditsHistoryItem.vue` — Displays a single credit item for a person, including the title, number of episodes (if applicable), and their role/character, with a link to the media.
- `components/person/PersonAwardsTab.vue` — Displays a person's awards history, categorized by major awards like Oscars, Golden Globes, Palme d'Or, Golden Lion, and Golden Bear, with film search functionality.
- `components/person/PersonInfo.vue` — Displays detailed information about a person, including their biography, birth/death dates, known for department, and a summary of their major awards.
- `components/ProductionCompanyCarousel.vue` — Displays a horizontal, autoplaying carousel of popular production companies, allowing users to navigate and explore company details.
- `components/ProductionHero.vue` — Displays a hero section for a production company, featuring its logo, name, country, headquarters, description, and a follow/unfollow button.
- `components/RomfordCard.vue` — Displays a card for a Romford Film Festival entry, including its poster, title, year, and quick actions like favoriting and opening the official festival page.
- `components/RotterdamCard.vue` — Displays a card for a Rotterdam Film Festival entry, including its poster, title, year, and quick actions like favoriting and opening the official festival page.
- `components/search/CategoryCarousel.vue` — Displays a collapsible carousel of search results for a specific category, allowing horizontal scrolling and loading more items.
- `components/search/CategorySection.vue` — Displays a collapsible section of items under a given title, typically used for categorizing search results or similar listings.
- `components/search/DiscoverSearch.vue` — Provides an interface for discovering movies and TV shows based on various filters like genre, sort order, country, network, language, and release year.
- `components/search/NewsResultCard.vue` — Renders a single news article as a card, displaying its image, title, description, source, and publication date, with dynamic linking.
- `components/search/SearchGuideModal.vue` — Presents a modal dialog explaining the various search functionalities and options available within the Cinemagoria application.
- `components/search/SearchResults.vue` — Displays aggregated search results across different categories like movies, TV shows, people, news, and users, with pagination and typo checking.
- `components/SlamdanceCard.vue` — Renders a card specifically for Slamdance festival items, including actions like favoriting and linking to external sources.
- `components/SpotlightCarousel.vue` — Displays a horizontal carousel of spotlight items, typically used for featured content, with navigation controls and an optional 'Explore All' link.
- `components/StreamingPlatformCarousel.vue` — Displays a horizontal carousel of popular streaming platforms, with navigation controls and an optional 'Explore All' link.
- `components/StreamingPlatformHero.vue` — Displays a hero section for a streaming platform, allowing users to follow/unfollow it and showing its name, logo, and a customizable title.
- `components/SundanceCard.vue` — Displays a card component for Sundance Film Festival items, including a link to details, quick actions like opening an external link, and a loader.
- `components/TiffCard.vue` — Displays a card component for TIFF (Toronto International Film Festival) items, including a link to details, quick actions like opening an external link, and a loader.
- `components/TribecaCard.vue` — Displays a card component for Tribeca Film Festival items, including a link to details, quick actions like opening an external link, and a loader.
- `components/TribecaLiveBanner.vue` — Provides a banner component linking to the Tribeca 2026 festival coverage, featuring a background gradient and a placeholder pattern.
- `components/tv/Episodes.vue` — Manages and displays TV show episodes, allowing users to select seasons, view episode counts, and mark entire seasons as watched/unwatched.
- `components/tv/EpisodesItem.vue` — Displays an individual TV episode item, including its poster, name, and a progress tracking overlay for authenticated users.
- `components/tv/TvInfo.vue` — Displays detailed information for a TV show, including its poster, storyline, external links, and various awards.
- `components/VeniceCard.vue` — Displays a card component for Venice Film Festival items, including a link to details, quick actions like opening an external link, and a loader.
- `components/Videos.vue` — Vue component that displays a list of videos, allows filtering by type, and opens a modal to play selected videos.
- `components/VideosItem.vue` — Vue component for displaying a single video item with its thumbnail, duration, name, and type, emitting an event when clicked to open a modal.
- `components/WatchOn.vue` — Vue component that displays a grid of streaming providers where a movie or TV show can be watched, including their logos and names.
- `components/YearPicker.vue` — Vue component providing a dropdown for selecting a release year, ranging from a minimum year up to the current year.

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

- `pages/auth-success.vue` — Provides a user-facing page to display the status of an authentication attempt, showing loading, success, or error states and handling redirection.
- `pages/awards/index.vue` — Displays a comprehensive list of major film awards, allowing users to browse winners and nominees by award type and year.
- `pages/changelog/index.vue` — Presents a changelog of the platform's releases, features, and fixes, fetching data directly from the GitHub repository's releases API.
- `pages/contact/index.vue` — Provides a contact form for users to reach support regarding account issues, watchlists, missing titles, or other platform-related inquiries.
- `pages/faq/index.vue` — Offers a Frequently Asked Questions page explaining the platform's editorial framework, discovery infrastructure, and other operational details.
- `pages/festival/bafici-2026/index.vue` — Displays information for the BAFICI 2026 film festival, including films, awards, and schedule, with search and navigation features.
- `pages/festival/berlinale-2026/index.vue` — Displays information for the Berlinale 2026 film festival, including films, awards, and schedule, with search and navigation features.
- `pages/festival/bifff-2026/index.vue` — Displays information for the BIFFF 2026 film festival, including films, awards, and schedule, with search and navigation features.
- `pages/festival/cannes-2026/index.vue` — Displays information for the Cannes Film Festival 2026, including films, awards, and schedule, with search and navigation features.
- `pages/festival/cuff-2026/index.vue` — Vue page component for displaying details of the Calgary Underground Film Festival (CUFF) 2026, including films, schedule, and awards, with interactive navigation and search.
- `pages/festival/fantasia-2026/index.vue` — Vue page component for displaying details of the Fantasia International Film Festival 2026, including films, schedule, and awards, with interactive navigation and search.
- `pages/festival/frightfest-2026/index.vue` — Vue page component for displaying details of the FrightFest 2026, including films and schedule, with interactive navigation and search.
- `pages/festival/kviff-2026/index.vue` — Vue page component for displaying details of the Karlovy Vary International Film Festival (KVIFF) 2026, including films, schedule, and awards, with interactive navigation and search.
- `pages/festival/romford-2026/index.vue` — Vue page component for displaying details of the Romford Horror Film Festival 2026, including films, schedule, and awards, with interactive navigation and search.
- `pages/festival/rotterdam-2026/index.vue` — Vue page component for displaying details of the International Film Festival Rotterdam (IFFR) 2026, including films, schedule, and awards, with interactive navigation and search.
- `pages/festival/slamdance-2026/index.vue` — Vue page component for displaying details of the Slamdance Film Festival 2026, including films, schedule, and awards, with interactive navigation and search.
- `pages/festival/sundance-2026/index.vue` — Vue page component displaying details for the Sundance Film Festival 2026, including films, awards, and schedule, with dynamic content loading and search functionality.
- `pages/festival/sxsw-2026/index.vue` — Vue page component displaying details for the SXSW Film Festival 2026, including films, awards, and schedule, with dynamic content loading and search functionality.
- `pages/festival/tiff-2026/index.vue` — Vue page component displaying details for the TIFF Film Festival 2026, including films, awards, and schedule, with dynamic content loading and search functionality.
- `pages/festival/tribeca-2026/index.vue` — Vue page component displaying details for the Tribeca Film Festival 2026, including films, awards, and schedule, with dynamic content loading and search functionality.
- `pages/festival/venice-2026/index.vue` — Vue page component displaying details for the Venice Film Festival 2026, including films, awards, and schedule, with dynamic content loading and search functionality.
- `pages/genre/[id]/movie.vue` — Vue page component that displays a paginated list of movies belonging to a specific genre, fetching data from an API and handling 'load more' functionality.
- `pages/genre/[id]/tv.vue` — Vue page component that displays a paginated list of TV shows belonging to a specific genre, fetching data from an API and handling 'load more' functionality.
- `pages/index.vue` — Vue page component for the homepage, featuring various carousels, banners for ongoing festivals (Oscars, Cannes, Fantasia), and trending media content.
- `pages/lists/[slug].vue` — Displays a single user-created list of movies and TV shows, allowing the owner to rename, edit, filter, sort, and manage its items.
- `pages/lists/index.vue` — Displays a user's custom lists, providing functionality to create new lists, edit existing ones, and filter between public and private lists.
- `pages/login/index.vue` — Serves as the entry point for user authentication, immediately opening the AuthModal component upon being mounted.
- `pages/movie/[id].vue` — Displays detailed information for a specific movie, including an overview, credits, videos, images, soundtracks, and awards.
- `pages/movie/category/[name].vue` — Displays a categorized list of movies (e.g., trending, popular, top-rated), with infinite scrolling to load more items.
- `pages/movie/followed.vue` — Displays movies from followed production companies and streaming platforms by rendering the `FollowedContent` component.
- `pages/movie/index.vue` — Serves as the main discovery page for movies, featuring various categories like popular, top-rated, upcoming, and now playing, along with filters.
- `pages/news/[slug].vue` — Displays a single news article, including its content, related entities, and options to save or share the article.
- `pages/news/index.vue` — Displays a feed of the latest news articles, allowing users to filter by source, category, and search for specific topics.
- `pages/noir/index.vue` — Displays the N.O.I.R Archive, a curated list of historical titles, with options to sort and clone the archive into a user's personal list.
- `pages/notifications/index.vue` — Displays a user's notifications, allowing them to filter by unread status, mark notifications as read/unread, and manage follows for people, TV shows, streaming services, and production companies.
- `pages/person/[id].vue` — Displays detailed information about a person, including their known-for credits, full filmography, photos, and awards, with navigation for different content sections.
- `pages/production-companies/index.vue` — Lists all supported production companies, allowing users to browse and navigate to individual company detail pages.
- `pages/production/[slug].vue` — Displays details for a specific production company, including its movies and TV shows, with filtering and sorting options.
- `pages/recovery/index.vue` — Provides a password recovery interface where users can submit their email to receive a password reset link.
- `pages/register/index.vue` — Serves as an entry point for user registration by displaying the authentication modal with the register tab active upon mounting.
- `pages/search/index.vue` — Displays search results for movies, TV shows, people, and news based on a user's query, with a loading state and pagination.
- `pages/settings/index.vue` — Manages user account settings, including avatar, email, alias, privacy preferences, and account deletion.
- `pages/streaming-services/index.vue` — Lists all supported streaming services, allowing users to browse and navigate to individual service detail pages.
- `pages/streaming/[slug].vue` — Displays a dynamic streaming platform page, allowing users to browse movies and TV shows available on a specific service with filtering and sorting options.
- `pages/streaming/followed.vue` — Renders a page displaying followed streaming content, distinguishing between movies and TV shows based on the URL query parameter.
- `pages/tv/[id].vue` — Displays a dynamic TV show details page, including an overview, credits, episodes, videos, images, soundtracks, and awards, with navigation between sections.
- `pages/tv/category/[name].vue` — Displays a list of TV shows belonging to a specific category (e.g., trending, popular), with pagination to load more items.
- `pages/tv/followed.vue` — Displays a page dedicated to TV shows followed by the user, utilizing the FollowedContent component.
- `pages/tv/index.vue` — Serves as the main discovery page for TV shows, featuring popular, top-rated, on-air, and airing today series, with a toggle to navigate to movies.
- `pages/u/[alias].vue` — Displays a public user profile page, showing their reviews and lists, with functionality to follow/unfollow the user.
- `pages/usage-policies/index.vue` — Presents the platform's usage policies and privacy agreement, organized into scrollable sections with a table of contents.
- `pages/watchlist/index.vue` — Displays a user's watchlist of movies and TV shows, allowing filtering, sorting, and management of watched items and ratings.
- `pages/wip/index.vue` — Displays a 'Work in Progress' or 'Under Maintenance' page, informing users that the section is temporarily unavailable and providing options to return home or get more information.

### `plugins`

- `plugins/bus.js` — Nuxt plugin that provides a global event bus using the mitt library for inter-component communication.
- `plugins/lazyload.js` — Nuxt plugin that registers a 'lazyload' Vue directive to dynamically set the 'src' attribute of an image element.

### `public`

- `public/manifest.json` — Defines the web application manifest for Cinemagoria, including its name, description, display properties, theme colors, and various icon configurations for different sizes and purposes.
- `public/sw.js` — A self-destroying service worker script that unregisters itself upon activation and reloads all clients, ensuring no caching or offline functionality is provided.
  - This service worker is designed to immediately unregister itself and should not be version controlled.

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

- `utils/api.js` — Provides utility functions for interacting with external APIs like TMDB and Trakt, handling API requests, environment variables, and data enrichment for movie and TV show information.
  - exports: `apiImgUrl`, `EXCLUDED_MOVIE_IDS`, `EXCLUDED_TV_IDS`, `getHeroEnrichment`, `getNoirEnrichment`, `getCustomEnrichment`, `resolveItemPoster`, `languages`, `getListItem`, `getIMDbRatingFromDB`, `getMovies`
- `utils/categoryLabels.js` — Defines English display labels for editorial taxonomy categories and provides a function to retrieve the appropriate label for a given category token.
  - exports: `CATEGORY_LABELS`, `categoryLabel`
- `utils/countries.js` — Exports a list of countries with their ISO 3166-1 alpha-2 codes and names.
  - exports: `countries`
- `utils/helpers.js` — Provides utility functions for formatting dates, handling image loading errors, and determining the release status context of a movie or TV show.
  - exports: `formatDate`, `handleImageError`, `getReleaseStatusContext`
- `utils/itemMapper.js` — Maps an item object (e.g., from an API response) to a standardized payload format suitable for database storage, inferring missing fields.
  - exports: `mapItemToDbPayload`
- `utils/membershipStore.js` — Manages a session-wide cache for user membership data (watchlist and custom lists) to reduce API calls, with invalidation and coalescing logic.
  - exports: `invalidateMembershipCache`, `getMembership`
- `utils/musicbrainz.js` — Provides functions to search for soundtracks and retrieve album tracks using the MusicBrainz API, including a utility for generating MusicBrainz URLs.
  - exports: `searchSoundtracks`, `getAlbumTracks`, `getMusicBrainzUrl`
- `utils/newsSources.js` — Defines lists of supported news sources for different locales and their corresponding URLs.
  - exports: `SOURCES`, `SOURCE_URLS`
- `utils/relatedFooter.js` — Provides utilities to strip related articles footers from content bodies and extract slugs from those footers, supporting both Markdown and legacy HTML formats.
  - exports: `stripRelatedFooter`, `extractRelatedSlugs`
- `utils/resolvePhase.js` — An intentionally empty file marked as deprecated, indicating that its original functionality for resolving phases has been removed and replaced by a database-driven approach.
  - DEPRECATED: This file is intentionally left empty and will be removed. Do not use.
- `utils/tvTrailer.js` — Provides functions for resolving the best trailer for a TV series, prioritizing the latest season's trailers over series-level videos and ranking candidates by type and name.
  - exports: `TV_TRAILER_MAX_SEASON_PROBES`, `TV_TRAILER_MAX_PLAYABILITY_CHECKS`, `tvVideoClass`, `rankTvVideo`, `tvVideoGroup`, `isUsableSeasonTrailer`, `pickBestTvVideo`, `resolveTvTrailer`

## Dependency Edges

| From | To | Imports |
| :--- | :--- | ---: |
| `server/api` | `server/data` | 2 |
| `server/routes` | `server/utils` | 1 |

## External Packages (imported in code)

- `~` (416 imports)
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
