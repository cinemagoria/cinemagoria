export const SPOILER_MARKER = '<!-- spoilers -->';

const HALLOWEEN_TOPIC = 'halloween special';

export function isInHouseReview(item) {
    return item?.is_internal !== false && String(item?.editorial_category || '').toLowerCase() === 'review';
}

export function isHalloweenSpecial(item) {
    const topics = Array.isArray(item?.topics) ? item.topics : [];
    return isInHouseReview(item) && topics.some((topic) => String(topic).trim().toLowerCase() === HALLOWEEN_TOPIC);
}
