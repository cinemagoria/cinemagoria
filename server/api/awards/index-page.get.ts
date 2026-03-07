import awardsData from '../../data/awards.json';

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

const oscarsData: AwardItem[] = (awardsData as any).oscars || [];
const goldenGlobesData: AwardItem[] = (awardsData as any).goldenGlobes || [];
const palmeData: AwardItem[] = (awardsData as any).palme || [];
const goldenLionData: AwardItem[] = (awardsData as any).goldenLion || [];
const goldenBearData: AwardItem[] = (awardsData as any).goldenBear || [];

const AWARD_MAP: Record<string, AwardItem[]> = {
    oscars: oscarsData,
    goldenGlobes: goldenGlobesData,
    palme: palmeData,
    goldenLion: goldenLionData,
    goldenBear: goldenBearData,
};

const getYearField = (award: string, item: AwardItem): string => {
    if (award === 'goldenGlobes') return String(item.year_award ?? '');
    return String(item.year ?? '');
};


export default defineEventHandler((event) => {
    const query = getQuery(event);
    const award = (query.award as string) || 'oscars';
    const year = query.year as string | undefined;

    const data = AWARD_MAP[award] ?? oscarsData;

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

    const items = data.filter((item: any) => getYearField(award, item) === selectedYear);

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
