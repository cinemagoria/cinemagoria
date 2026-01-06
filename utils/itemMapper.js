export function mapItemToDbPayload(item) {
    if (!item) return null;

    const idForDb = item.idForDb || item.id;
    let typeForDb = item.typeForDb || item.media_type || (item.title ? 'movie' : 'tv');
    if (typeForDb === 'movies') typeForDb = 'movie';

    const nameForDb = item.nameForDb || item.title || item.name;
    const posterForDb = item.posterForDb || item.poster_path || item.poster_url;

    let yearStartForDb = item.yearStartForDb;
    if (!yearStartForDb) {
        const dateStr = item.release_date || item.first_air_date;
        if (dateStr) yearStartForDb = dateStr.substr(0, 4);
    }

    let genresForDb = item.genresForDb;
    if (!genresForDb) {
        if (Array.isArray(item.genres) && item.genres.length > 0) {
            if (item.genres[0].name) {
                genresForDb = item.genres.map(g => g.name).join(', ');
            }
        }
    }

    const imdb_rating = item.imdb_rating;
    const imdb_votes = item.imdb_votes || item.vote_count;

    let starsForDb = item.starsForDb;
    if (starsForDb === undefined || starsForDb === null) {
        if (item.vote_average) {
            starsForDb = Math.round(item.vote_average * 10);
        }
    }

    return {
        idForDb,
        typeForDb,
        nameForDb,
        posterForDb,
        yearStartForDb,
        yearEndForDb: item.yearEndForDb || null,
        genresForDb: genresForDb || '',
        starsForDb,
        imdb_rating,
        imdb_votes,
        rating_source: item.rating_source || (imdb_rating ? 'imdb' : 'tmdb'),
        runtime: item.runtime || null,
        external_ids: item.external_ids || null,
        addedAt: new Date()
    };
}
