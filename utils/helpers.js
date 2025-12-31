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
            event.target.src = '/placeholder_news.webp';
            event.target.onerror = null;
        }
    }
}
