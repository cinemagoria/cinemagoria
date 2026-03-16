import { readFileSync } from 'fs';
import { resolve } from 'path';

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
    won: boolean;
    tmdb_id?: number;
}

const getYearField = (award: string, item: AwardItem): string => {
    if (award === 'goldenGlobes') return String(item.year_award ?? '');
    return String(item.year ?? '');
};

function loadAwardsData() {
    const filePath = resolve(process.cwd(), 'server/data/awards.json');
    const raw = readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as Record<string, AwardItem[]>;
}

export default defineEventHandler((event) => {
    const query = getQuery(event);
    const award = (query.award as string) || 'oscars';
    const year = query.year as string | undefined;

    const awardsData = loadAwardsData();
    const data: AwardItem[] = awardsData[award] ?? awardsData['oscars'] ?? [];

    // Extract sorted unique years (desc)
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

    // Determine the year to use: query param, or most recent
    const selectedYear = year && yearsSet.has(year) ? year : years[0];

    // Filter items for the selected year
    const items = data.filter((item: any) => getYearField(award, item) === selectedYear);

    // Extract unique categories from the filtered items
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
