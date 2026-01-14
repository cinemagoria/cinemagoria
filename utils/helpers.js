export function formatDate(dateString, locale = 'en-US') {
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
            event.target.src = '/placeholder_news.webp';
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

    const hasTheatrical = types.has(2) || types.has(3);
    const hasPremiere = types.has(1);

    if (hasTheatrical) {
        if (hasPremiere) return 'FESTIVALS_AND_THEATRICAL_ONLY';
        return 'THEATRICAL_ONLY';
    }

    if (hasPremiere) return 'FESTIVALS_ONLY';

    return null;
}
