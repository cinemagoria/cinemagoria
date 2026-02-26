import awardsData from '../../data/awards.json';

const oscarsData = (awardsData as any).oscars || [];
const goldenGlobesData = (awardsData as any).goldenGlobes || [];
const palmeData = (awardsData as any).palme || [];
const goldenLionData = (awardsData as any).goldenLion || [];
const goldenBearData = (awardsData as any).goldenBear || [];

const AWARD_MAP: Record<string, any[]> = {
    oscars: oscarsData,
    goldenGlobes: goldenGlobesData,
    palme: palmeData,
    goldenLion: goldenLionData,
    goldenBear: goldenBearData,
};

const getYearField = (award: string, item: any): string => {
    if (award === 'goldenGlobes') return String(item.year_award ?? '');
    return String(item.year ?? '');
};

export default defineEventHandler((event) => {
    const query = getQuery(event);
    const award = (query.award as string) || 'oscars';
    const year = query.year as string | undefined;

    const data = AWARD_MAP[award] ?? oscarsData;

    // Extract sorted unique years (desc)
    const yearsSet = new Set<string>();
    for (const item of data) {
        const y = getYearField(award, item);
        if (y) yearsSet.add(y);
    }
    const years = Array.from(yearsSet).sort((a, b) => {
        // Handle formats like "1927/28" by extracting leading number
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
