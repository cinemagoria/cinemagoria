import rawAwardsData from '../../data/awards.json';

interface AwardItem {
    id: number;
    year?: string;
    year_award?: number;
    category?: string;
    film_title?: string;
    original_title?: string;
    director?: string;
    country?: string;
    nominee_name?: string;
    film?: string;
    nominee?: string;
    won: number | boolean;
    tmdb_id?: number;
}

const awardsData = rawAwardsData as unknown as Record<string, AwardItem[]>;

const getYearField = (award: string, item: AwardItem): string => {
    if (award === 'goldenGlobes') return String((item as any).year_award ?? '');
    return String(item.year ?? '');
};

export default defineEventHandler((event) => {
    const query = getQuery(event);
    const award = (query.award as string) || 'oscars';
    const year = query.year as string | undefined;

    const data: AwardItem[] = awardsData[award] ?? awardsData['oscars'] ?? [];

    const yearsSet = new Set<string>();
    for (const item of data) {
        const y = getYearField(award, item);
        if (y) yearsSet.add(y);
    }
    const years = Array.from(yearsSet).sort((a, b) => {
        const numA = parseInt(a);
        const numB = parseInt(b);
        return numB - numA;
    });

    const selectedYear = year && yearsSet.has(year) ? year : years[0];

    const items = data
        .filter((item: any) => getYearField(award, item) === selectedYear)
        .map((item: any) => ({ ...item, won: Boolean(item.won) }));

    const categoriesSet = new Set<string>();
    for (const item of items) {
        if (item.category) categoriesSet.add(item.category);
    }
    const categories = Array.from(categoriesSet);

    return {
        award,
        selectedYear,
        years,
        categories,
        items,
    };
});
