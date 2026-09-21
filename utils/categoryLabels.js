// English display labels for the editorial taxonomy. The DB value (lowercase
// token) is the canonical key used by URLs (?category=), the chip filter, the
// article sidebar and card badges. Fifteen primaries answer what a piece is;
// six tags describe its context or the work, and are never a primary.
export const CATEGORY_LABELS = {
    review:      'Reviews',
    interview:   'Interviews',
    opinion:     'Analysis & Essays',
    production:  'Development & Production',
    cast:        'Cast & Crew',
    trailer:     'Trailers & First Looks',
    premiere:    'Premieres & Selections',
    release:     'Theatrical Releases',
    streaming:   'Streaming',
    awards:      'Awards',
    classic:     'Classics & Restorations',
    acquisition: 'Acquisitions & Distribution',
    boxoffice:   'Box Office',
    lineup:      'Programmes & Line-ups',
    industry:    'Industry',
    festival:    'Festival',
    market:      'Market',
    documentary: 'Documentary',
    series:      'Series',
    animation:   'Animation',
    short:       'Short',
};

export function categoryLabel(cat) {
    if (!cat) return '';
    return CATEGORY_LABELS[String(cat).toLowerCase()] || String(cat);
}
