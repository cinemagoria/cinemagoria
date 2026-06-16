// Spanish display labels for the editorial taxonomy. The DB value (English,
// lowercase) is the canonical key — used by the news index chip filter, the
// article sidebar Categories block, and the badge on news cards
// (NewsCarousel, NewsResultCard). The RSS feed resolves the same map inside
// server/utils/rss-feed.ts when lang === 'es'.
//
// The DB value stays English so URLs (`?category=feature`), filter logic, and
// the EN feed continue to work unchanged. Only the visible string changes.

export const CATEGORY_LABELS_ES = {
    feature:     'Editorial',
    industry:    'Industria',
    festival:    'Festival',
    awards:      'Premios',
    production:  'Producción',
    trailer:     'Tráiler',
    acquisition: 'Adquisición',
    boxoffice:   'Desempeño Comercial',
    streaming:   'Streaming',
    interview:   'Entrevista',
    review:      'Crítica',
    opinion:     'Opinión',
};

export function categoryLabelES(cat) {
    if (!cat) return '';
    return CATEGORY_LABELS_ES[String(cat).toLowerCase()] || String(cat);
}
