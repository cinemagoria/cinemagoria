export const MOVIE_GENRES = [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 14, name: 'Fantasy' },
    { id: 36, name: 'History' },
    { id: 27, name: 'Horror' },
    { id: 10402, name: 'Music' },
    { id: 9648, name: 'Mystery' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Science Fiction' },
    { id: 10770, name: 'TV Movie' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'War' },
    { id: 37, name: 'Western' },
];

export const TV_GENRES = [
    { id: 10759, name: 'Action & Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 36, name: 'History' },
    { id: 10402, name: 'Music' },
    { id: 10749, name: 'Romance' },
    { id: 10765, name: 'Sci-Fi & Fantasy' },
    { id: 10767, name: 'Talk Show' },
    { id: 37, name: 'Western' },
];

export const DISCOVER_NETWORKS = [
    { id: '2552', name: 'Apple TV+' },
    { id: '2739', name: 'Disney+' },
    { id: '453', name: 'Hulu' },
    { id: '6783', name: 'Max' },
    { id: '213', name: 'Netflix' },
    { id: '1024', name: 'Prime Video' },
];

export const DISCOVER_SORTS = [
    { value: 'imdb_rating.desc', label: 'Highly Rated (IMDb)' },
    { value: 'imdb_rating.asc', label: 'Lowest Rated (IMDb)' },
    { value: 'imdb_votes.desc', label: 'Most Voted (IMDb)' },
    { value: 'imdb_votes.asc', label: 'Least Voted (IMDb)' },
    { value: 'popularity.desc', label: 'Most Popular' },
    { value: 'primary_release_date.desc', label: 'Latest Releases' },
    { value: 'revenue.desc', label: 'Highest Revenue' },
];

export const DEFAULT_SORT = 'imdb_rating.desc';
export const DEFAULT_MIN_VOTES = 10;

export const DISCOVER_LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'hi', name: 'Hindi' },
    { code: 'it', name: 'Italian' },
    { code: 'de', name: 'German' },
    { code: 'zh', name: 'Chinese' },
    { code: 'pt', name: 'Portuguese' },
];

export const MIN_VOTE_OPTIONS = [
    { value: 0, label: 'Any (0+)' },
    { value: 10, label: '10+ Votes' },
    { value: 100, label: '100+ Votes' },
    { value: 500, label: '500+ Votes' },
    { value: 1000, label: '1K+ Votes' },
    { value: 5000, label: '5K+ Votes' },
    { value: 10000, label: '10K+ Votes' },
];

export const FORMAT_OPTIONS = [
    { value: 'feature', label: 'Feature Films' },
    { value: 'short', label: 'Short Films' },
];

const MOVIE_GENRE_TILES = [
    { image: '/thumbnails/drama-tv-eng.webp', genreId: 18, label: 'Drama' },
    { image: '/thumbnails/comedy-movie-eng.webp', genreId: 35, label: 'Comedy' },
    { image: '/thumbnails/action-movie-eng.webp', genreId: 28, label: 'Action' },
    { image: '/thumbnails/horror-movie-eng.webp', genreId: 27, label: 'Horror' },
    { image: '/thumbnails/suspense-movie-eng.webp', genreId: 53, label: 'Thriller' },
    { image: '/thumbnails/sciencefiction-movie-eng.webp', genreId: 878, label: 'Science-Fiction' },
    { image: '/thumbnails/adventure-tv-eng.webp', genreId: 12, label: 'Adventure' },
    { image: '/thumbnails/crime-movie-eng.webp', genreId: 80, label: 'Crime' },
    { image: '/thumbnails/history-movie-eng.webp', genreId: 36, label: 'History' },
    { image: '/thumbnails/documentary-movie-eng.webp', genreId: 99, label: 'Documentary' },
    { image: '/thumbnails/animation-movie-eng.webp', genreId: 16, label: 'Animation' },
    { image: '/thumbnails/mistery-movie-eng.webp', genreId: 9648, label: 'Mistery' },
];

const TV_GENRE_TILES = [
    { image: '/thumbnails/talkshow-tv-eng.webp', genreId: 10767, label: 'TalkShow' },
    { image: '/thumbnails/comedy-tv-eng.webp', genreId: 35, label: 'Comedy' },
    { image: '/thumbnails/mistery-tv-eng.webp', genreId: 9648, label: 'Mistery' },
    { image: '/thumbnails/sciencefiction-movie-eng.webp', genreId: 10765, label: 'Sci-Fi & Fantasy' },
    { image: '/thumbnails/crime-tv-eng.webp', genreId: 80, label: 'Crime' },
    { image: '/thumbnails/documentary-tv-eng.webp', genreId: 99, label: 'Documentaries' },
    { image: '/thumbnails/action-movie-eng.webp', genreId: 10759, label: 'Action & Adventures' },
    { image: '/thumbnails/drama-tv-eng.webp', genreId: 18, label: 'Drama' },
    { image: '/thumbnails/animation-movie-eng.webp', genreId: 16, label: 'Animation' },
];

export const GENRE_TILES = {
    movie: MOVIE_GENRE_TILES,
    tv: TV_GENRE_TILES,
};

export const CURATED_ROWS = {
    movie: [
        { query: 'now_playing', title: 'In Theatres Now' },
        { query: 'upcoming', title: 'Coming Soon' },
        { query: 'popular', title: 'Popular Movies' },
        { query: 'top_rated', title: 'Top Rated Movies' },
    ],
    tv: [
        { query: 'on_the_air', title: 'On the Air' },
        { query: 'airing_today', title: 'Airing Today' },
        { query: 'popular', title: 'Popular TV Shows' },
        { query: 'top_rated', title: 'Top Rated TV Shows' },
    ],
};

export const DISCOVER_TYPES = {
    movie: {
        key: 'movie',
        label: 'Movies',
        categoryRouteName: 'movie-category-name',
        followedRouteName: 'movie-followed',
        genres: MOVIE_GENRES,
        catalogueLabel: 'film',
        followedCompaniesTitle: 'From the production companies you follow',
        followedServicesTitle: 'From the streaming services you follow',
        zoneLabel: 'In cinemas and beyond',
        subtitle: 'Search the film catalogue, follow what studios and services are releasing, and dig into every genre.',
    },
    tv: {
        key: 'tv',
        label: 'TV Shows',
        categoryRouteName: 'tv-category-name',
        followedRouteName: 'tv-followed',
        genres: TV_GENRES,
        catalogueLabel: 'series',
        followedCompaniesTitle: 'From the production companies you follow',
        followedServicesTitle: 'From the streaming services you follow',
        zoneLabel: 'On air right now',
        subtitle: 'Search the series catalogue, follow what networks and services are airing, and dig into every genre.',
    },
};
