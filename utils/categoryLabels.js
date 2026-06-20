// Spanish display labels for the editorial taxonomy. The DB value (English,
// lowercase) is the canonical key — used by the news index chip filter, the
// article sidebar Categories block, and the badge on news cards
// (NewsCarousel, NewsResultCard). The RSS feed resolves the same map inside
// server/utils/rss-feed.ts when lang === 'es'.
//
// The DB value stays English so URLs (`?category=festival`), filter logic, and
// the EN feed continue to work unchanged. Only the visible string changes.
// Some buckets are compound (one token, several editorial angles).

export const CATEGORY_LABELS_ES = {
    festival:    'Festival',
    industry:    'Industria / Adquisiciones / Desempeño Comercial',
    trailer:     'Avance / Primer Vistazo',
    review:      'Crítica / Opinión',
    awards:      'Premios',
    streaming:   'Streaming',
    interview:   'Entrevista',
    documentary: 'Documentales',
};

export function categoryLabelES(cat) {
    if (!cat) return '';
    return CATEGORY_LABELS_ES[String(cat).toLowerCase()] || String(cat);
}
