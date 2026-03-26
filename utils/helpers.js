export function formatDate(dateString, locale = 'es-ES') {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

export function handleImageError(item, event = null) {
    if (item.image && item.image.includes('maxresdefault.jpg')) {
        item.image = item.image.replace('maxresdefault.jpg', 'hqdefault.jpg');
        if (event && event.target) {
            event.target.src = item.image;
        }
    } else {
        item.image = null;
        if (event && event.target) {
            event.target.src = '/placeholders/placeholder_news.webp';
            event.target.onerror = null;
        }
    }
}

export function getReleaseStatusContext(item, targetCountry = 'US') {
    if (item.status !== 'Released') return null;
    if (!item.release_dates || !item.release_dates.results) return null;

    const releases = item.release_dates.results;

    let relevantReleases = releases.find(r => r.iso_3166_1 === targetCountry);
    let allDates = [];

    if (relevantReleases) {
        allDates = relevantReleases.release_dates;
    } else {
        allDates = releases.flatMap(r => r.release_dates);
    }

    if (!allDates || allDates.length === 0) return null;

    const types = new Set(allDates.map(d => d.type));

    if (types.has(4) || types.has(5) || types.has(6)) return null;

    const today = new Date(); today.setHours(0,0,0,0);

    const hasTheatrical = types.has(2) || types.has(3);
    const hasPremiere = types.has(1);

    const theatricalDates = allDates.filter(d => d.type === 2 || d.type === 3).map(d => new Date(d.release_date));
    const premiereDates = allDates.filter(d => d.type === 1).map(d => new Date(d.release_date));

    const earliestTheatrical = theatricalDates.length ? new Date(Math.min(...theatricalDates)) : null;
    const earliestPremiere = premiereDates.length ? new Date(Math.min(...premiereDates)) : null;

    if (earliestTheatrical) earliestTheatrical.setHours(0,0,0,0);
    if (earliestPremiere) earliestPremiere.setHours(0,0,0,0);

    const theatricalIsToday = earliestTheatrical && earliestTheatrical.getTime() === today.getTime();
    const theatricalIsPast = earliestTheatrical && earliestTheatrical < today;
    const theatricalIsFuture = earliestTheatrical && earliestTheatrical > today;
    const premiereIsPast = earliestPremiere && earliestPremiere <= today;

    if (hasTheatrical) {
        if (theatricalIsToday) {
            return hasPremiere ? 'THEATRICAL_TODAY_WITH_FESTIVALS' : 'THEATRICAL_TODAY';
        }
        if (theatricalIsPast) {
            return hasPremiere ? 'IN_THEATERS_WITH_FESTIVALS' : 'IN_THEATERS';
        }
        if (theatricalIsFuture) {
            return premiereIsPast ? 'PRE_RELEASE_FESTIVALS_THEATRICAL_SOON' : 'THEATRICAL_UPCOMING';
        }
    }

    if (hasPremiere) {
        return premiereIsPast ? 'FESTIVALS_ONLY_PAST' : 'FESTIVALS_ONLY_FUTURE';
    }

    return null;
}
