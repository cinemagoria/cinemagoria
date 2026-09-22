export const RELATED_TITLE_LABELS = {
    movie: 'Related film',
    tv:    'Related series',
};

export function relatedTitleLabel(type) {
    return RELATED_TITLE_LABELS[type] || '';
}

export function relatedTitleOf(item) {
    const related = item?.related_title;
    if (!related || !RELATED_TITLE_LABELS[related.type] || !related.id || !related.name) return null;
    return related;
}

export function relatedTitleHref(related) {
    return related ? `/${related.type}/${related.id}` : null;
}
