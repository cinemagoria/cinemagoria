// English display labels for the editorial taxonomy. The DB value (lowercase
// token) is the canonical key used by URLs (?category=), the chip filter, the
// article sidebar, and card badges. Some buckets are compound (one token,
// several editorial angles). The ES channel resolves its own map in
// server/utils/rss-feed.ts; the EN feed emits the raw token.
export const CATEGORY_LABELS = {
    festival:    'Festival',
    industry:    'Industry / Acquisition / Box Office',
    trailer:     'Trailer / Teaser / First Looks',
    review:      'Review / Opinion',
    awards:      'Awards',
    streaming:   'Streaming',
    interview:   'Interview',
    documentary: 'Documentaries',
};

export function categoryLabel(cat) {
    if (!cat) return '';
    return CATEGORY_LABELS[String(cat).toLowerCase()] || String(cat);
}
