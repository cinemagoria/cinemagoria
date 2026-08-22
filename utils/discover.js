export const MOVIE_GENRES = [
    { id: 28, name: 'Acción' },
    { id: 12, name: 'Aventura' },
    { id: 16, name: 'Animación' },
    { id: 35, name: 'Comedia' },
    { id: 80, name: 'Crimen' },
    { id: 99, name: 'Documental' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Familia' },
    { id: 14, name: 'Fantasía' },
    { id: 36, name: 'Historia' },
    { id: 27, name: 'Terror' },
    { id: 10402, name: 'Música' },
    { id: 9648, name: 'Misterio' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Ciencia ficción' },
    { id: 10770, name: 'Película de TV' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'Bélica' },
    { id: 37, name: 'Western' },
];

export const TV_GENRES = [
    { id: 10759, name: 'Acción y aventura' },
    { id: 16, name: 'Animación' },
    { id: 35, name: 'Comedia' },
    { id: 80, name: 'Crimen' },
    { id: 99, name: 'Documental' },
    { id: 18, name: 'Drama' },
    { id: 36, name: 'Historia' },
    { id: 10402, name: 'Música' },
    { id: 10749, name: 'Romance' },
    { id: 10765, name: 'Ciencia ficción y fantasía' },
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
    { value: 'imdb_rating.desc', label: 'Mejor valoradas (IMDb)' },
    { value: 'imdb_rating.asc', label: 'Peor valoradas (IMDb)' },
    { value: 'imdb_votes.desc', label: 'Más votadas (IMDb)' },
    { value: 'imdb_votes.asc', label: 'Menos votadas (IMDb)' },
    { value: 'popularity.desc', label: 'Más populares' },
    { value: 'primary_release_date.desc', label: 'Últimos estrenos' },
    { value: 'revenue.desc', label: 'Mayor recaudación' },
];

export const DEFAULT_SORT = 'imdb_rating.desc';
export const DEFAULT_MIN_VOTES = 10;

export const DISCOVER_LANGUAGES = [
    { code: 'en', name: 'Inglés' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Francés' },
    { code: 'ja', name: 'Japonés' },
    { code: 'ko', name: 'Coreano' },
    { code: 'hi', name: 'Hindi' },
    { code: 'it', name: 'Italiano' },
    { code: 'de', name: 'Alemán' },
    { code: 'zh', name: 'Chino' },
    { code: 'pt', name: 'Portugués' },
];

export const MIN_VOTE_OPTIONS = [
    { value: 0, label: 'Cualquiera (0+)' },
    { value: 10, label: '10+ votos' },
    { value: 100, label: '100+ votos' },
    { value: 500, label: '500+ votos' },
    { value: 1000, label: '1K+ votos' },
    { value: 5000, label: '5K+ votos' },
    { value: 10000, label: '10K+ votos' },
];

export const FORMAT_OPTIONS = [
    { value: 'feature', label: 'Largometrajes' },
    { value: 'short', label: 'Cortometrajes' },
];

const MOVIE_GENRE_TILES = [
    { image: '/thumbnails/drama-tv-eng.webp', genreId: 18, label: 'Drama' },
    { image: '/thumbnails/comedy-movie-eng.webp', genreId: 35, label: 'Comedia' },
    { image: '/thumbnails/action-movie-eng.webp', genreId: 28, label: 'Acción' },
    { image: '/thumbnails/horror-movie-eng.webp', genreId: 27, label: 'Terror' },
    { image: '/thumbnails/suspense-movie-eng.webp', genreId: 53, label: 'Suspenso' },
    { image: '/thumbnails/sciencefiction-movie-eng.webp', genreId: 878, label: 'Ciencia Ficción' },
    { image: '/thumbnails/adventure-tv-eng.webp', genreId: 12, label: 'Aventura' },
    { image: '/thumbnails/crime-movie-eng.webp', genreId: 80, label: 'Crimen' },
    { image: '/thumbnails/history-movie-eng.webp', genreId: 36, label: 'Historia' },
    { image: '/thumbnails/documentary-movie-eng.webp', genreId: 99, label: 'Documentales' },
    { image: '/thumbnails/animation-movie-eng.webp', genreId: 16, label: 'Animación' },
    { image: '/thumbnails/mistery-movie-eng.webp', genreId: 9648, label: 'Misterio' },
];

const TV_GENRE_TILES = [
    { image: '/thumbnails/talkshow-tv-eng.webp', genreId: 10767, label: 'Programas de TV' },
    { image: '/thumbnails/comedy-tv-eng.webp', genreId: 35, label: 'Comedia' },
    { image: '/thumbnails/mistery-tv-eng.webp', genreId: 9648, label: 'Misterio' },
    { image: '/thumbnails/sciencefiction-movie-eng.webp', genreId: 10765, label: 'Ciencia Ficción y Fantasía' },
    { image: '/thumbnails/crime-tv-eng.webp', genreId: 80, label: 'Crimen' },
    { image: '/thumbnails/documentary-tv-eng.webp', genreId: 99, label: 'Documentales' },
    { image: '/thumbnails/action-movie-eng.webp', genreId: 10759, label: 'Acción y Aventuras' },
    { image: '/thumbnails/drama-tv-eng.webp', genreId: 18, label: 'Drama' },
    { image: '/thumbnails/animation-movie-eng.webp', genreId: 16, label: 'Animación' },
];

export const GENRE_TILES = {
    movie: MOVIE_GENRE_TILES,
    tv: TV_GENRE_TILES,
};

export const CURATED_ROWS = {
    movie: [
        { query: 'now_playing', title: 'En Cartelera' },
        { query: 'upcoming', title: 'Próximos Estrenos' },
        { query: 'popular', title: 'Películas Populares' },
        { query: 'top_rated', title: 'Películas Mejor Valoradas' },
    ],
    tv: [
        { query: 'on_the_air', title: 'En Emisión' },
        { query: 'airing_today', title: 'Se Emiten Hoy' },
        { query: 'popular', title: 'Series Populares' },
        { query: 'top_rated', title: 'Series Mejor Valoradas' },
    ],
};

export const DISCOVER_TYPES = {
    movie: {
        key: 'movie',
        label: 'Películas',
        categoryRouteName: 'movie-category-name',
        followedRouteName: 'movie-followed',
        genres: MOVIE_GENRES,
        catalogueLabel: 'de películas',
        followedCompaniesTitle: 'De las productoras que sigues',
        followedServicesTitle: 'De los servicios de streaming que sigues',
        zoneLabel: 'En cines y próximos estrenos',
        subtitle: 'Busca en el catálogo de películas, sigue lo que estrenan productoras y plataformas, y explora todos los géneros.',
    },
    tv: {
        key: 'tv',
        label: 'Series',
        categoryRouteName: 'tv-category-name',
        followedRouteName: 'tv-followed',
        genres: TV_GENRES,
        catalogueLabel: 'de series',
        followedCompaniesTitle: 'De las productoras que sigues',
        followedServicesTitle: 'De las plataformas de streaming que sigues',
        zoneLabel: 'En emisión ahora mismo',
        subtitle: 'Busca en el catálogo de series, sigue lo que emiten cadenas y plataformas, y explora todos los géneros.',
    },
};
