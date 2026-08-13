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

- `app.vue` — Root Vue component for the Cinemagoria application, defining the main layout, Nuxt page rendering, and injecting structured data (Schema.org) for SEO.
- `cloudbuild.yaml` — Google Cloud Build configuration for building and deploying the Cinemagoria application's Docker image to Google Cloud Run, handling image creation, pushing, and service updates.
  - Registers the 'cinemagoria-main' service on Cloud Run.
- `Dockerfile` — Defines the Docker image build process for the Cinemagoria application, including dependencies, build arguments for Supabase, and the production runtime environment.
  - Uses a pinned Node.js version to avoid issues with `node-fetch` v2 and `@libsql/client`.
- `nuxt.config.ts` — Nuxt.js configuration file, setting up aliases, compatibility date, devtools, debug mode, and defining route-specific caching headers for sitemaps and RSS feeds.
  - exports: `default`
- `package.json` — Defines the Cinemagoria project's metadata, scripts for development and build, and manages its extensive list of dependencies and devDependencies, including resolutions and overrides.
  - Includes scripts for `build`, `dev`, `generate`, `preview`, and `postinstall`.
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
- `components/global/UserNav.vue` — Displays user navigation, including notifications, avatar, and a dropdown menu with profile links, language options, and logout functionality.
- `components/BaficiCard.vue` — Displays a card component for BAFICI festival items, including an image, quick actions like external links, and a link to the item's detail page.
- `components/BerlinaleCard.vue` — Displays a card component for Berlinale festival items, including an image, quick actions like external links, and a link to the item's detail page.
- `components/BifanCard.vue` — Displays a card component for BiFan festival items, including an image, quick actions like external links, and a link to the item's detail page.
- `components/BifffCard.vue` — Displays a card component for BIFFF festival items, including an image, quick actions like external links, and a link to the item's detail page.
- `components/CannesCard.vue` — Displays a card component for Cannes festival items, including an image, quick actions like external links, and a link to the item's detail page.
- `components/CannesLiveBanner.vue` — Provides a banner component for the Cannes 2026 festival, featuring a logo, live status, and a call to action to explore coverage.
- `components/CannesWinnersBanner.vue` — Provides a banner component for Cannes 2026 winners, featuring a logo, a 'Winners' badge, and a scrolling marquee of award recipients.
- `components/Card.vue` — A generic card component for displaying various media types (movies, TV, people, etc.) with an image, title, rating, and quick favorite action.
- `components/common/AwardsTab.vue` — Displays a tabbed view of awards for a given media item or person, categorizing them by major festivals like Oscars, Golden Globes, and Palme d'Or.
- `components/common/FullCreditsModal.vue` — Displays a modal with the full crew credits for a given title, organized by department with collapsible sections.
- `components/common/MediaProgressBar.vue` — Displays a circular progress bar and slider for tracking media viewing progress, showing watched time and total duration.
- `components/Credits.vue` — Displays a carousel of cast members for a movie or TV show, allowing users to navigate through the list and view individual credit items.
- `components/CreditsItem.vue` — Displays an individual cast or crew member's credit, including their image, name, and character, with a link to their dedicated person page.
- `components/CuffCard.vue` — Displays a card for a movie or TV show, typically used within a list context, featuring an image, title, and quick actions like favoriting or opening an external link.
- `components/CustomListingCategoriesMovies.vue` — Renders a horizontal carousel of movie categories, allowing users to browse different genres or curated lists with navigation controls.
- `components/CustomListingCategoriesSeries.vue` — Renders a horizontal carousel of TV series categories, allowing users to browse different genres or curated lists with navigation controls.
- `components/Discover.vue` — Provides a comprehensive discovery interface for movies and TV shows, allowing users to filter by genre, sort options, country, network, language, and other criteria.
- `components/DynamicSearchCarousel.vue` — Displays a dynamic carousel of search results for movies or TV shows, featuring navigation controls and individual search cards.
- `components/ExternalLinks.vue` — Displays a grid of external links related to a movie or TV show, including IMDb, Rotten Tomatoes, Letterboxd, Trakt, and TMDb.
- `components/FantasiaCard.vue` — Displays a card for a movie or TV show, specifically themed for the Fantasia festival, featuring an image, title, and quick actions.
- `components/FantasiaLiveBanner.vue` — Displays a promotional banner for the Fantasia 2026 festival, linking to its dedicated coverage page.
- `components/FeatureDescription.vue` — Vue component displaying a prominent feature description with cinematic light effects and gradient text, designed to be responsive across different screen sizes.
- `components/festival/BaficiBadge.vue` — Vue component displaying a clickable badge for the BAFICI 2026 film festival, featuring its logo with hover effects.
- `components/festival/BerlinaleBadge.vue` — Vue component displaying a clickable badge for the Berlinale Film Festival 2026, featuring its logo with hover effects.
- `components/festival/BifanBadge.vue` — Vue component displaying a clickable badge for the BIFAN 2026 film festival, featuring its logo with hover effects.
- `components/festival/BifffBadge.vue` — Vue component displaying a clickable badge for the BIFFF 2026 film festival, featuring its logo with hover effects.
- `components/festival/CannesAcidBadge.vue` — Vue component displaying a clickable badge for the ACID section of the Cannes Film Festival 2026, featuring its logo with hover effects.
- `components/festival/CannesBadge.vue` — Vue component displaying a clickable badge for the Cannes Film Festival 2026, featuring its logo with hover effects.
- `components/festival/CannesCriticsChoiceBadge.vue` — Vue component displaying a clickable badge for the Critics' Choice section of the Cannes Film Festival 2026, featuring its logo with hover effects.
- `components/festival/CannesQuinzaineBadge.vue` — Vue component displaying a clickable badge for the Quinzaine des Cinéastes section of the Cannes Film Festival 2026, featuring its logo with hover effects.
- `components/festival/CuffBadge.vue` — Vue component displaying a clickable badge for the Calgary Underground Film Festival 2026, featuring its logo with hover effects.
- `components/festival/FantasiaBadge.vue` — Vue component displaying a clickable badge for the Fantasia International Film Festival 2026, featuring its logo with hover effects.
- `components/festival/FrightfestBadge.vue` — Vue component displaying a clickable badge for the FrightFest 2026 film festival, featuring its logo with hover effects.
- `components/festival/KviffBadge.vue` — Vue component displaying a clickable badge for the Karlovy Vary International Film Festival 2026, featuring its logo with hover effects.
- `components/festival/LocarnoBadge.vue` — Vue component displaying a clickable badge for the Locarno Film Festival 2026, featuring its logo with hover effects.
- `components/festival/RomfordBadge.vue` — Vue component displaying a clickable badge for the Romford Horror Film Festival 2026, featuring its logo with hover effects.
- `components/festival/RotterdamBadge.vue` — Vue component displaying a clickable badge for the Rotterdam Film Festival 2026, featuring its logo with hover effects.
- `components/festival/SlamdanceBadge.vue` — Vue component displaying a clickable badge for the Slamdance Film Festival 2026, featuring its logo with hover effects.
- `components/festival/SundanceBadge.vue` — Vue component displaying a clickable badge for the Sundance Film Festival 2026, featuring its logo with hover effects.
- `components/festival/SxswBadge.vue` — Vue component displaying a clickable badge for the SXSW Film & TV Festival 2026, featuring its logo with hover effects.
- `components/festival/SxswCard.vue` — Vue component representing a card for an SXSW film festival item, including a link, quick actions, and a loading state.
- `components/festival/TiffBadge.vue` — Vue component displaying a clickable badge for the TIFF 2026 film festival, featuring its logo with hover effects.
- `components/festival/TribecaBadge.vue` — Vue component displaying a clickable badge for the Tribeca Festival 2026, featuring its logo with hover effects.
- `components/festival/VeniceBadge.vue` — Vue component displaying a clickable badge for the Venice Film Festival 2026, featuring its logo with hover effects.
- `components/festival/WinnersCarousel.vue` — Displays a carousel of festival winners, grouped by film, with navigation controls and a statistical overview.
- `components/FestivalDataDisclaimer.vue` — Provides a disclaimer about missing festival data and allows users to report issues via a modal form.
- `components/FestivalsCarousel.vue` — Renders a horizontal carousel for displaying a list of festivals, with navigation buttons and an optional 'Explore All' link.
- `components/FestivalsRotatingBanner.vue` — Displays a rotating banner featuring different festivals, with a shimmer effect and links to their respective pages.
- `components/FollowedContent.vue` — Displays content followed by the user, categorized by production company or streaming platform, with filtering and sorting options.
- `components/FrightfestCard.vue` — Displays a card for a Frightfest film, including a poster, quick actions like external links and favoriting, and a rating.
- `components/global/ArticleAIDisclosure.vue` — Displays a disclosure for AI-generated articles, including an icon and a button to report issues via a modal form.
- `components/global/ArticleShareModal.vue` — Provides a modal for sharing articles via link copy, native share, or various social media platforms.
- `components/global/AuthModal.vue` — Manages user authentication through a modal, offering sign-in and registration tabs with email/password fields.
- `components/global/CardActions.vue` — Provides a dropdown menu of actions for a content card, including rating, adding to watchlist, and managing lists.
- `components/global/CookieConsent.vue` — Manages user cookie consent with a banner and a preferences panel, allowing users to accept, decline, or customize settings.
- `components/global/CreateListModal.vue` — Provides a modal interface for users to create new content lists, specifying a name and description.
- `components/global/FollowingModal.vue` — Provides a modal interface for users to manage the people, TV shows, production companies, and streaming services they follow, with tabbed navigation for different categories.
- `components/global/Footer.vue` — Renders the global footer component, including navigation links to resources, social media links, and copyright information.
- `components/global/InstallPrompt.vue` — Displays a prompt to the user to add the Cinemagoria application to their home screen, handling the 'beforeinstallprompt' event and user choices.
- `components/global/MyListsModal.vue` — Manages a modal for users to add items to their custom lists, create new lists, and view/edit existing lists, including undo functionality for recent actions.
- `components/global/Nav.vue` — Implements the main navigation bar for the application, providing links to home, discover movies, TV shows, news, and user-specific content like lists and profile.
- `components/global/NewsCarousel.vue` — Displays a carousel of the latest news articles, allowing users to browse recent updates and navigate to a dedicated news page.
- `components/global/ProgressTrackingModal.vue` — Provides a modal for users to track their watch progress for movies and TV shows, allowing them to mark items as watched and manage episode progress.
- `components/global/QuickFav.vue` — Offers a quick favorite button component that allows authenticated users to add or manage an item in their lists, displaying a checkmark if already in a list.
- `components/global/QuickFavModal.vue` — Displays a confirmation modal for users to remove an item from their watchlist, interacting with a backend API to perform the deletion.
- `components/global/RatedModal.vue` — Provides a modal interface for users to view and manage their rated movies and TV shows, including options to edit reviews and remove ratings.
- `components/global/RelatedArticlesCarousel.vue` — Displays a horizontal carousel of related articles, allowing users to navigate through them with scroll controls.
- `components/global/SearchForm.vue` — Implements a search form component with a search input, back button, and displays trending movies/TV shows as featured content.
- `components/global/TopNav.vue` — Renders a fixed top navigation bar that displays a title, primarily for smaller screens, and hides on larger viewports.
- `components/Hero.vue` — Displays a hero section with a main item (movie/TV show) and related content, including an auto-advancing carousel, festival badges, and user rating features.
- `components/HowItWorksModal.vue` — Presents a modal explaining how release alerts work, featuring an introductory text and a carousel to illustrate the process.
- `components/Images.vue` — Displays a gallery of images (posters or backdrops) for a given item, with a title and count, and allows opening them in a modal viewer.
- `components/ImagesItem.vue` — Renders an individual image item within a gallery, displaying a thumbnail and a loading spinner, and emits an event when clicked to open a modal.
- `components/KviffCard.vue` — Displays a card for a KVIFF (Karlovy Vary International Film Festival) item, including an image, quick actions like favoriting, and a link to its official festival page.
- `components/KviffLiveBanner.vue` — Provides a promotional banner for the KVIFF 2026 festival, linking to its coverage page and featuring a distinct background and logo.
- `components/Listing.vue` — Displays a list of media items (movies, TV shows) with an optional title, 'Explore All' link, and infinite scrolling for loading more items.
- `components/ListingCarousel.vue` — Renders a horizontal carousel of media items, including navigation buttons and an optional 'Explore All' card, with responsive styling.
- `components/Loader.vue` — Provides a reusable SVG-based loading spinner component with customizable size and color properties.
- `components/LocarnoCard.vue` — Displays a card for a Locarno Film Festival item, including a poster, quick actions, and a link to its detail page or external source.
- `components/MediaNav.vue` — Provides a navigation component with a list of buttons, allowing users to select an active item and emitting an event on click.
- `components/Modal.vue` — Implements a generic modal component that can display images, iframes, or custom content, with navigation for multiple items and accessibility features.
- `components/movie/MovieInfo.vue` — Displays detailed information about a movie, including its poster, overview, cast, crew, awards, and various external links.
- `components/movie/MovieReleases.vue` — Displays a list of movie release dates grouped by country, including country flags and release details.
- `components/music/SoundtrackGroup.vue` — Organizes and displays a group of soundtrack items, typically by year, within a larger soundtrack list.
- `components/music/SoundtrackItem.vue` — Displays a single soundtrack item, including its title, disambiguation, artist, and a link to its MusicBrainz page.
- `components/music/SoundtrackList.vue` — Displays a list of soundtracks for a movie, allowing selection of an album and showing its tracklist with YouTube links.
- `components/NoirModal.vue` — Displays a modal window with information about the "Nothing Out Is Ready" (N.O.I.R) curated selection, including a logo, subtitle, descriptive text, and a close button.
- `components/OscarsCarousel.vue` — Renders a horizontal carousel displaying information about the 98th Academy Awards, including a section header with a link to full coverage and navigation buttons.
- `components/OscarsLiveBanner.vue` — Displays a banner for the 98th Academy Awards, showing live coverage status or results, a countdown/count-up timer, and a ticker for notable winners.
- `components/person/CreditsHistory.vue` — Displays a person's filmography and crew credits, allowing filtering by department and media type (combined, movie, or TV).
- `components/person/CreditsHistoryGroup.vue` — Renders a group of credits for a person, typically organized by year, displaying each credit using the CreditsHistoryItem component.
- `components/person/CreditsHistoryItem.vue` — Displays a single credit item for a person, showing the film/series title, number of episodes (if applicable), and their role/character, with a link to the media.
- `components/person/PersonAwardsTab.vue` — Displays a person's awards history, categorized by major awards like Oscars, Golden Globes, Palme d'Or, Golden Lion, and Golden Bear, in a tabular format.
- `components/person/PersonInfo.vue` — Displays detailed information about a person, including their avatar, name, biography, birth/death dates, age, birthplace, known for department, and awards won.
- `components/ProductionCompanyCarousel.vue` — Renders a horizontal carousel displaying popular production companies, with navigation buttons and autoplay functionality.
- `components/ProductionHero.vue` — Displays a hero section for a production company, featuring its logo, name, country, headquarters, description, and a follow/unfollow button.
- `components/RomfordCard.vue` — Displays a card for a Romford Film Festival entry, including a poster image, quick actions like favoriting and external links, and basic film details.
- `components/RotterdamCard.vue` — Displays a card for a Rotterdam Film Festival entry, including a poster image, quick actions like favoriting and external links, and basic film details.
- `components/search/CategoryCarousel.vue` — Displays a collapsible carousel of items within a category, allowing users to browse and load more items.
- `components/search/CategorySection.vue` — Renders a collapsible section for a category, displaying a list of items using `Card` components.
- `components/search/DiscoverSearch.vue` — Provides an interface for discovering movies and TV shows based on various filters like type, genre, sort options, country, network, language, and release year.
- `components/search/NewsResultCard.vue` — Displays a single news article or aggregated item with an image, title, description, date, and source badge, linking to the full content.
- `components/search/SearchGuideModal.vue` — Presents a modal dialog explaining the various search functionalities and options available within Cinemagoria.
- `components/search/SearchResults.vue` — Displays search results across different categories like movies, TV shows, people, news, and users, with filtering and pagination capabilities.
- `components/SlamdanceCard.vue` — Renders a card component specifically for Slamdance festival items, including actions like adding to lists and opening external source URLs.
- `components/SpotlightCarousel.vue` — Displays a horizontal carousel of spotlight items, typically used for featured content, with navigation controls and an optional 'Explore All' link.
- `components/StreamingPlatformCarousel.vue` — Presents a horizontal carousel of popular streaming platforms, with navigation controls and an optional 'Explore All' link.
- `components/StreamingPlatformHero.vue` — Vue component displaying a hero section for a streaming platform, allowing users to follow/unfollow it and showing its logo and name.
- `components/SundanceCard.vue` — Vue component for displaying a Sundance Film Festival item card, including a link to its detail page, quick actions, and an external link to its official festival page.
- `components/TiffCard.vue` — Vue component for displaying a TIFF (Toronto International Film Festival) item card, including a link to its detail page, quick actions, and an external link to its official festival page.
- `components/TribecaCard.vue` — Vue component for displaying a Tribeca Film Festival item card, including a link to its detail page, quick actions, and an external link to its official festival page.
- `components/TribecaLiveBanner.vue` — Vue component displaying a banner for the Tribeca 2026 festival, providing a link to its coverage page with a distinct background and logo.
- `components/tv/Episodes.vue` — Vue component for displaying and managing TV show episodes, allowing users to select seasons, view episode counts, and mark entire seasons as watched/unwatched.
- `components/tv/EpisodesItem.vue` — Vue component for displaying an individual TV show episode, including its poster, name, and a progress tracking feature for authenticated users.
- `components/tv/TvInfo.vue` — Vue component displaying detailed information about a TV show, including its poster, storyline, external links, and various awards.
- `components/VeniceCard.vue` — Vue component for displaying a Venice Film Festival item card, including a link to its detail page, quick actions, and an external link to its official festival page.
- `components/Videos.vue` — Displays a list of videos, allowing filtering by type and opening a modal to play them. It fetches YouTube video details and formats them for display.
- `components/VideosItem.vue` — Renders an individual video item with its thumbnail, name, type, and duration, emitting an event to open a modal when clicked.
- `components/WatchOn.vue` — Displays a list of streaming providers where a movie or TV show can be watched, including their logos and links.
- `components/YearPicker.vue` — Provides a dropdown for selecting a release year, ranging from a minimum year up to the current year, and emits the selected value.

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

- `pages/auth-success.vue` — Handles post-authentication redirects and displays success or error states, cleaning up local storage and updating UI elements based on authentication outcome.
- `pages/awards/index.vue` — Displays a browsable list of major film awards, allowing users to select an award and year to view winners and nominees, with navigation to movie and media details.
- `pages/changelog/index.vue` — Displays a changelog of releases, new features, and fixes, fetching data directly from the GitHub repository's releases API.
- `pages/contact/index.vue` — Provides a contact form for users to submit inquiries, handling form submission, loading states, and displaying success or error messages.
- `pages/faq/index.vue` — Presents a Frequently Asked Questions page with a table of contents for navigation and collapsible sections for detailed explanations.
- `pages/festival/bafici-2026/index.vue` — Displays information for the BAFICI 2026 film festival, including films, awards, and a schedule, with search and navigation features.
- `pages/festival/berlinale-2026/index.vue` — Displays information for the Berlinale 2026 film festival, including films, awards, and a schedule, with search and navigation features.
- `pages/festival/bifan-2026/index.vue` — Displays information for the BIFAN 2026 film festival, including films, awards, and a schedule, with search and navigation features.
- `pages/festival/bifff-2026/index.vue` — Displays information for the BIFFF 2026 film festival, including films, awards, and a schedule, with search and navigation features.
- `pages/festival/cannes-2026/index.vue` — Vue page component for displaying details of the Cannes Film Festival 2026, including films, awards, and schedule, with search and navigation features.
- `pages/festival/cuff-2026/index.vue` — Vue page component for displaying details of the Calgary Underground Film Festival (CUFF) 2026, including films, awards, and schedule, with search and navigation features.
- `pages/festival/fantasia-2026/index.vue` — Vue page component for displaying details of the Fantasia International Film Festival 2026, including films, awards, and schedule, with search and navigation features.
- `pages/festival/frightfest-2026/index.vue` — Vue page component for displaying details of the FrightFest 2026, including films and schedule, with search and navigation features.
- `pages/festival/kviff-2026/index.vue` — Vue page component for displaying details of the Karlovy Vary International Film Festival (KVIFF) 2026, including films, awards, and schedule, with search and navigation features.
- `pages/festival/locarno-2026/index.vue` — Vue page component for displaying details of the Locarno Film Festival 2026, including films, awards, and schedule, with search and navigation features.
- `pages/festival/romford-2026/index.vue` — Vue page component for displaying details of the Romford Horror Film Festival 2026, including films, awards, and schedule, with search and navigation features.
- `pages/festival/rotterdam-2026/index.vue` — Vue page component displaying details for the Rotterdam Film Festival 2026, including films, awards, and schedule, with search and category filtering.
- `pages/festival/slamdance-2026/index.vue` — Vue page component displaying details for the Slamdance Film Festival 2026, including films, awards, and schedule, with search and category filtering.
- `pages/festival/sundance-2026/index.vue` — Vue page component displaying details for the Sundance Film Festival 2026, including films, awards, and schedule, with search and category filtering.
- `pages/festival/sxsw-2026/index.vue` — Vue page component displaying details for the SXSW Film Festival 2026, including films, awards, and schedule, with search and category filtering.
- `pages/festival/tiff-2026/index.vue` — Vue page component displaying details for the TIFF 2026 festival, including films, awards, and schedule, with search and category filtering.
- `pages/festival/tribeca-2026/index.vue` — Vue page component displaying details for the Tribeca Film Festival 2026, including films, awards, and schedule, with search and category filtering.
- `pages/festival/venice-2026/index.vue` — Vue page component displaying details for the Venice Film Festival 2026, including films, awards, and schedule, with search and category filtering.
- `pages/genre/[id]/movie.vue` — Vue page component that displays a list of movies filtered by a specific genre ID, with infinite scrolling and dynamic meta titles.
- `pages/genre/[id]/tv.vue` — Displays a listing of TV shows filtered by a specific genre, allowing users to load more results and providing SEO metadata.
- `pages/index.vue` — Homepage component displaying various carousels, banners for live events (Oscars, Cannes, Fantasia), and featured content.
- `pages/lists/[slug].vue` — Displays a specific user-created list of movies and TV shows, allowing the owner to rename it and users to filter and sort items.
- `pages/lists/index.vue` — Displays a user's custom lists of movies and TV shows, providing options to create, edit, delete, and filter lists.
- `pages/login/index.vue` — Serves as an entry point for user authentication, immediately opening the AuthModal component upon mounting.
- `pages/movie/[id].vue` — Displays detailed information for a specific movie, including an overview, credits, videos, images, soundtracks, and awards.
- `pages/movie/category/[name].vue` — Displays a listing of movies based on a specific category (e.g., trending, popular), with infinite scrolling functionality.
- `pages/movie/followed.vue` — Displays a list of movies from production companies followed by the user.
- `pages/movie/index.vue` — Provides a discovery page for movies, featuring popular, top-rated, upcoming, and now playing categories, along with filters.
- `pages/news/[slug].vue` — Displays a single news article, including its content, related entities, and options for saving and sharing.
- `pages/news/index.vue` — Displays the latest news, allowing users to filter by category, search for articles, and manage bookmarks. It integrates with a news API and user preferences.
- `pages/noir/index.vue` — Presents the N.O.I.R Archive, a collection of historical film titles, allowing users to browse, sort, and create a personal list from the archive.
- `pages/notifications/index.vue` — Manages and displays user notifications related to followed people, TV shows, streaming services, and production companies, with filtering and marking as read/unread functionality.
- `pages/person/[id].vue` — Displays detailed information about a specific person, including their known-for credits, full filmography, photos, and awards, with navigation between sections.
- `pages/production-companies/index.vue` — Lists all supported production companies, sorted alphabetically, allowing users to browse and navigate to individual company pages.
- `pages/production/[slug].vue` — Displays detailed information for a specific production company, including its movies and TV shows, with filtering and sorting options.
- `pages/recovery/index.vue` — Provides a password recovery interface where users can enter their email to receive a reset link, with confirmation messages and navigation options.
- `pages/register/index.vue` — Serves as an entry point for user registration, immediately opening the authentication modal with the register tab active upon mounting.
- `pages/search/index.vue` — Vue page component for displaying search results, handling loading states, and allowing users to load more results.
- `pages/settings/index.vue` — Vue page component for managing user account settings, including profile information, avatar, and account deletion.
- `pages/streaming-services/index.vue` — Vue page component that displays a list of all available streaming services, sorted alphabetically, with links to their individual pages.
- `pages/streaming/[slug].vue` — Vue page component that displays details for a specific streaming platform, including movies and TV shows, with filtering and sorting options.
- `pages/streaming/followed.vue` — Vue page component that displays followed streaming content (movies or TV shows) for the current user.
- `pages/tv/[id].vue` — Vue page component that displays detailed information for a specific TV show, including overview, cast, episodes, videos, images, and awards.
- `pages/tv/category/[name].vue` — Vue page component that displays a list of TV shows based on a specific category (e.g., trending, popular), with infinite scrolling.
- `pages/tv/followed.vue` — Vue page component that displays TV shows followed by the user.
- `pages/tv/index.vue` — Vue page component for discovering TV shows, featuring popular, top-rated, on-air, and airing today categories, with a filter toggle.
- `pages/u/[alias].vue` — Vue page component displaying a user's public profile, including their reviews and lists, with follow/unfollow functionality.
- `pages/usage-policies/index.vue` — Displays the usage policies and privacy agreement for the Cinemagoria platform, including an interactive table of contents for navigation.
- `pages/watchlist/index.vue` — Manages and displays a user's watchlist of movies and TV shows, allowing them to add, view, filter, and remove items, and rate watched content.
- `pages/wip/index.vue` — Displays a 'Work in Progress' page indicating that a section of the application is under maintenance, with options to return home or view more information.

### `plugins`

- `plugins/bus.js` — Nuxt plugin that provides a global event bus using the mitt library for inter-component communication.
- `plugins/lazyload.js` — Nuxt plugin that registers a 'lazyload' Vue directive to dynamically set the 'src' attribute of an image element.

### `public`

- `public/manifest.json` — Defines the web application manifest for Cinemagoria, specifying its name, description, display properties, theme colors, and icons for progressive web app (PWA) functionality.
- `public/sw.js` — A self-destroying service worker script designed to unregister itself and reload all open client pages upon activation, ensuring no service worker remains active.
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
- `server/api/article/[slug].get.ts` — Handles GET requests for a single article by its slug, fetching its content from the database and returning it with parsed metadata.
- `server/api/article/rss.get.ts` — Provides a permanent redirect for the legacy RSS feed endpoint to the canonical /feed URL.
- `server/api/articles/by-entity.get.ts` — Handles GET requests to retrieve a limited number of articles related to specific TMDB entities (movies/TV shows).
- `server/api/articles/by-slugs.get.ts` — Handles GET requests to retrieve articles based on a list of provided slugs, returning their core details.
- `server/api/awards/index-page.get.ts` — Provides data for the awards archive page, fetching years and award items for a selected award body and year.
- `server/api/awards/index.get.ts` — Provides award lookup functionality by TMDB ID, person name, or title, returning results categorized by award body.
- `server/api/contact.post.ts` — Handles POST requests for the contact form, sanitizing input and storing the message in a database.
- `server/api/festival-report.post.ts` — Handles POST requests to submit festival reports, sanitizing input, validating data, and storing the report in the database.
  - exports: `default`
  - Registers a POST route at `/api/festival-report`.
- `server/api/festival/bafici/awards.get.ts` — Handles GET requests to retrieve awards data for the BAFICI 2026 festival by calling a utility function.
  - exports: `default`
  - Registers a GET route at `/api/festival/bafici/awards`.
- `server/api/festival/bafici/films.get.ts` — Handles GET requests to retrieve a list of films for the BAFICI 2026 festival, supporting filtering by TMDB/IMDB ID and merging with TMDB data.
  - exports: `default`
  - Registers a GET route at `/api/festival/bafici/films`.
- `server/api/festival/bafici/schedule.get.ts` — Handles GET requests to retrieve the screening schedule for the BAFICI 2026 festival, joining film and screening data.
  - exports: `default`
  - Registers a GET route at `/api/festival/bafici/schedule`.
- `server/api/festival/berlinale/awards.get.ts` — Handles GET requests to retrieve awards data for the Berlinale 2026 festival by calling a utility function.
  - exports: `default`
  - Registers a GET route at `/api/festival/berlinale/awards`.
- `server/api/festival/berlinale/films.get.ts` — Handles GET requests to retrieve a list of films for the Berlinale 2026 festival, supporting filtering by TMDB/IMDB ID and merging with TMDB data.
  - exports: `default`
  - Registers a GET route at `/api/festival/berlinale/films`.
- `server/api/festival/berlinale/schedule.get.ts` — Handles GET requests to retrieve the screening schedule for the Berlinale 2026 festival, joining film and screening data.
  - exports: `default`
  - Registers a GET route at `/api/festival/berlinale/schedule`.
- `server/api/festival/bifan/awards.get.ts` — Handles GET requests to retrieve awards data for the BIFAN 2026 festival by calling a utility function.
  - exports: `default`
  - Registers a GET route at `/api/festival/bifan/awards`.
- `server/api/festival/bifan/films.get.ts` — Handles GET requests to retrieve a list of films for the BIFAN 2026 festival, supporting filtering by TMDB/IMDB ID and merging with TMDB data.
  - exports: `default`
  - Registers a GET route at `/api/festival/bifan/films`.
- `server/api/festival/bifan/schedule.get.ts` — API endpoint to retrieve the 2026 BIFAN festival screening schedule, including film details, from the database.
  - Registers a GET route for /api/festival/bifan/schedule.
- `server/api/festival/bifff/awards.get.ts` — API endpoint to fetch the 2026 BIFFF festival awards by delegating to a utility function.
  - Registers a GET route for /api/festival/bifff/awards.
- `server/api/festival/bifff/films.get.ts` — API endpoint to retrieve 2026 BIFFF festival films, supporting filtering by TMDB or IMDb ID and limiting results.
  - Registers a GET route for /api/festival/bifff/films.
- `server/api/festival/bifff/schedule.get.ts` — API endpoint to retrieve the 2026 BIFFF festival screening schedule, including film details, from the database.
  - Registers a GET route for /api/festival/bifff/schedule.
- `server/api/festival/cannes/awards.get.ts` — API endpoint to fetch the 2026 Cannes Film Festival awards by delegating to a utility function.
  - Registers a GET route for /api/festival/cannes/awards.
- `server/api/festival/cannes/films.get.ts` — API endpoint to retrieve 2026 Cannes Film Festival films, supporting filtering by TMDB or IMDb ID and limiting results.
  - Registers a GET route for /api/festival/cannes/films.
- `server/api/festival/cannes/schedule.get.ts` — API endpoint to retrieve the 2026 Cannes Film Festival screening schedule, including film details, from the database.
  - Registers a GET route for /api/festival/cannes/schedule.
- `server/api/festival/cuff/awards.get.ts` — API endpoint to fetch the 2026 CUFF festival awards by delegating to a utility function.
  - Registers a GET route for /api/festival/cuff/awards.
- `server/api/festival/cuff/films.get.ts` — API endpoint to retrieve 2026 Calgary Underground Film Festival films, supporting filtering by TMDB or IMDb ID and limiting results.
  - Registers a GET route for /api/festival/cuff/films.
- `server/api/festival/cuff/schedule.get.ts` — API endpoint to retrieve the 2026 Calgary Underground Film Festival screening schedule, including film details, from the database.
  - Registers a GET route for /api/festival/cuff/schedule.
- `server/api/festival/fantasia/awards.get.ts` — API endpoint to fetch the 2026 Fantasia International Film Festival awards by delegating to a utility function.
  - Registers a GET route for /api/festival/fantasia/awards.
- `server/api/festival/fantasia/films.get.ts` — API endpoint to retrieve 2026 Fantasia International Film Festival films, supporting filtering by TMDB or IMDb ID and limiting results.
  - Registers a GET route for /api/festival/fantasia/films.
- `server/api/festival/fantasia/schedule.get.ts` — API endpoint to retrieve the 2026 Fantasia International Film Festival screening schedule, including film details, from the database.
  - Registers a GET route for /api/festival/fantasia/schedule.
- `server/api/festival/films-batch.get.ts` — API endpoint to fetch a batch of films for multiple festivals, supporting filtering by year and returning slimmed-down data for carousel/card display.
- `server/api/festival/frightfest/films.get.ts` — API endpoint to fetch films specifically for the FrightFest 2026 festival, with optional filtering by TMDB or IMDb ID and result limiting.
- `server/api/festival/frightfest/schedule.get.ts` — API endpoint to retrieve the screening schedule for FrightFest 2026, including film details and screening information.
- `server/api/festival/kviff/awards.get.ts` — API endpoint to fetch awards data for the Karlovy Vary International Film Festival (KVIFF) 2026.
- `server/api/festival/kviff/films.get.ts` — API endpoint to fetch films specifically for the Karlovy Vary International Film Festival (KVIFF) 2026, with optional filtering by TMDB or IMDb ID and result limiting.
- `server/api/festival/kviff/schedule.get.ts` — API endpoint to retrieve the screening schedule for the Karlovy Vary International Film Festival (KVIFF) 2026, including film details and screening information.
- `server/api/festival/locarno/awards.get.ts` — API endpoint to fetch awards data for the Locarno Film Festival 2026.
- `server/api/festival/locarno/films.get.ts` — API endpoint to fetch films specifically for the Locarno Film Festival 2026, with optional filtering by TMDB or IMDb ID and result limiting.
- `server/api/festival/locarno/schedule.get.ts` — API endpoint to retrieve the screening schedule for the Locarno Film Festival 2026, including film details and screening information.
- `server/api/festival/romford/awards.get.ts` — API endpoint to fetch awards data for the Romford Film Festival 2026.
- `server/api/festival/romford/films.get.ts` — API endpoint to fetch a list of films for the Romford Horror Festival 2026, with optional filtering by TMDB or IMDb ID and limiting the number of results.
  - exports: `default`
- `server/api/festival/romford/schedule.get.ts` — API endpoint to retrieve the screening schedule for the Romford Horror Festival 2026, including film details and screening information.
  - exports: `default`
- `server/api/festival/rotterdam/awards.get.ts` — API endpoint to fetch the awards for the Rotterdam Film Festival 2026.
  - exports: `default`
- `server/api/festival/rotterdam/films.get.ts` — API endpoint to fetch a list of films for the Rotterdam Film Festival 2026, with optional filtering by TMDB or IMDb ID, sorting, and limiting results.
  - exports: `default`
- `server/api/festival/rotterdam/schedule.get.ts` — API endpoint to retrieve the screening schedule for the Rotterdam Film Festival 2026, including film details and screening information.
  - exports: `default`
- `server/api/festival/slamdance/awards.get.ts` — API endpoint to fetch the awards for the Slamdance Film Festival 2026.
  - exports: `default`
- `server/api/festival/slamdance/films.get.ts` — API endpoint to fetch a list of films for the Slamdance Film Festival 2026, with optional filtering by TMDB or IMDb ID and limiting the number of results.
  - exports: `default`
- `server/api/festival/slamdance/schedule.get.ts` — API endpoint to retrieve the screening schedule for the Slamdance Film Festival 2026, including film details and screening information.
  - exports: `default`
- `server/api/festival/status.get.ts` — API endpoint to resolve festival badges for a given TMDB ID and year, used as a client-side fallback.
  - exports: `default`
  - Registers a GET route that requires a `tmdb_id` query parameter and optionally accepts a `year`.
- `server/api/festival/sundance/awards.get.ts` — API endpoint to fetch the awards for the Sundance Film Festival 2026.
  - exports: `default`
- `server/api/festival/sundance/films.get.ts` — API endpoint to fetch a list of films for the Sundance Film Festival 2026, with optional filtering by TMDB or IMDb ID, sorting, and limiting results.
  - exports: `default`
- `server/api/festival/sundance/schedule.get.ts` — API endpoint to retrieve the 2026 Sundance Film Festival screening schedule, including film details, screening times, and availability.
  - Registers a GET route for /api/festival/sundance/schedule.
- `server/api/festival/sxsw/awards.get.ts` — API endpoint to fetch award information for the 2026 SXSW Film & TV Festival.
  - Registers a GET route for /api/festival/sxsw/awards.
- `server/api/festival/sxsw/films.get.ts` — API endpoint to retrieve a list of films for the 2026 SXSW Film & TV Festival, with optional filtering by TMDB/IMDB ID and sorting.
  - Registers a GET route for /api/festival/sxsw/films.
- `server/api/festival/sxsw/schedule.get.ts` — API endpoint to retrieve the 2026 SXSW Film & TV Festival screening schedule, including film details, screening times, and venue information.
  - Registers a GET route for /api/festival/sxsw/schedule.
- `server/api/festival/tiff/awards.get.ts` — API endpoint to fetch award information for the 2026 Toronto International Film Festival (TIFF).
  - Registers a GET route for /api/festival/tiff/awards.
- `server/api/festival/tiff/films.get.ts` — API endpoint to retrieve a list of films for the 2026 Toronto International Film Festival (TIFF), with optional filtering by TMDB/IMDB ID.
  - Registers a GET route for /api/festival/tiff/films.
- `server/api/festival/tiff/schedule.get.ts` — API endpoint to retrieve the 2026 Toronto International Film Festival (TIFF) screening schedule, including film details, screening times, and venue information.
  - Registers a GET route for /api/festival/tiff/schedule.
- `server/api/festival/tribeca/awards.get.ts` — API endpoint to fetch award information for the 2026 Tribeca Festival.
  - Registers a GET route for /api/festival/tribeca/awards.
- `server/api/festival/tribeca/films.get.ts` — API endpoint to retrieve a list of films for the 2026 Tribeca Festival, with optional filtering by TMDB/IMDB ID.
  - Registers a GET route for /api/festival/tribeca/films.
- `server/api/festival/tribeca/schedule.get.ts` — API endpoint to retrieve the 2026 Tribeca Festival screening schedule, including film details, screening times, and venue information.
  - Registers a GET route for /api/festival/tribeca/schedule.
- `server/api/festival/venice/awards.get.ts` — API endpoint to fetch award information for the 2026 Venice Film Festival.
  - Registers a GET route for /api/festival/venice/awards.
- `server/api/festival/venice/films.get.ts` — API endpoint to retrieve a list of films for the 2026 Venice Film Festival, with optional filtering by TMDB/IMDB ID.
  - Registers a GET route for /api/festival/venice/films.
- `server/api/festival/venice/schedule.get.ts` — Fetches the Venice Film Festival schedule for the current year (2026), including screening details and associated film information from the database.
  - Registers GET /api/festival/venice/schedule
- `server/api/hero.get.ts` — Retrieves a randomized selection of hero items (movies/TV shows) with rich metadata and festival status for display on the homepage carousel.
  - Registers GET /api/hero
- `server/api/imdb-rating/[id].get.ts` — Fetches the IMDb rating and vote count for a given media ID from a Turso database, returning 'found: false' if not present.
  - Registers GET /api/imdb-rating/:id
- `server/api/news.get.ts` — Retrieves a paginated list of news articles, supporting filtering by language, source, and a minimum 2-character search query.
  - Registers GET /api/news
- `server/api/noir-archive.get.ts` — Fetches a list of historical noir films and TV shows from a Turso database, ordered by release date.
  - Registers GET /api/noir-archive
- `server/api/progress/[userId]/[mediaType]/[mediaId].delete.ts` — Deletes a user's progress tracking entry for a specific media item (movie or episode).
  - Registers DELETE /api/progress/:userId/:mediaType/:mediaId
- `server/api/progress/[userId]/[mediaType]/[mediaId].get.ts` — Retrieves a user's progress tracking details (percentage, elapsed, total duration) for a specific media item (movie or episode).
  - Registers GET /api/progress/:userId/:mediaType/:mediaId
- `server/api/progress/[userId]/[mediaType]/[mediaId].put.ts` — Updates or inserts a user's progress tracking for a specific media item (movie or episode), including TV series specific fields.
  - Registers PUT /api/progress/:userId/:mediaType/:mediaId
- `server/api/progress/[userId]/active/[mediaType]/[mediaId].put.ts` — Updates the 'manually_active' flag for a user's progress tracking entry for a specific media item.
  - Registers PUT /api/progress/:userId/active/:mediaType/:mediaId
- `server/api/progress/[userId]/batch.put.ts` — Performs a batch update of progress tracking for multiple episodes for a given user, setting a specified percentage.
  - Registers PUT /api/progress/:userId/batch
- `server/api/progress/[userId]/hydrated.get.ts` — Fetches a user's progress on movies and TV shows, hydrating the data with details from TMDB, and caches TMDB details to reduce API calls.
- `server/api/progress/[userId]/index.get.ts` — Retrieves a user's progress tracking data, including media ID, type, percentages, and timestamps, ordered by the last update.
  - Registers a GET route for '/api/progress/[userId]'.
- `server/api/search-log.post.ts` — Logs user search queries to a database, optionally including origin IP and email for analytics, after sanitizing the query.
  - Registers a POST route for '/api/search-log'.
- `server/api/search/person.get.ts` — Searches for people on TMDB based on a provided query string and returns the results.
  - Registers a GET route for '/api/search/person'.
- `server/api/spotlight/[type].get.ts` — Retrieves curated spotlight content (movies or TV shows) from the database, enriching the data with parsed JSON fields.
  - Registers a GET route for '/api/spotlight/[type]' where type is 'movies' or 'tv'.

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
| `server/routes` | `server/utils` | 1 |

## External Packages (imported in code)

- `~` (438 imports)
- `~~` (64 imports)
- `h3` (58 imports)
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
