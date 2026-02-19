
import awardsData from '../../data/awards.json';

interface Oscar {
    id: number;
    category: string;
    year: string;
    won: number;
    film_title: string;
    tmdb_id: number;
    imdb_id: string;
    nominee_name: string;
}

interface GoldenGlobe {
    id: number;
    year_film: number;
    year_award: number;
    ceremony: number;
    category: string;
    nominee: string;
    film: string;
    won: number;
    tmdb_id?: number;
}

interface FestivalAward {
    id: number;
    year: string;
    film_title: string;
    original_title: string;
    director: string;
    country: string;
    tmdb_id: number;
    imdb_id: string;
    won: number;
}

const oscarsData = ((awardsData as any).oscars || []) as Oscar[];
const goldenGlobesData = ((awardsData as any).goldenGlobes || []) as GoldenGlobe[];
const palmeData = ((awardsData as any).palme || []) as FestivalAward[];
const goldenLionData = ((awardsData as any).goldenLion || []) as FestivalAward[];
const goldenBearData = ((awardsData as any).goldenBear || []) as FestivalAward[];

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const tmdbIdStr = query.tmdbId as string | undefined;
    const name = query.name as string | undefined;
    const title = query.title as string | undefined;
    const type = query.type as string | undefined;

    if (!tmdbIdStr && !name && !title) {
        return { oscars: [], goldenGlobes: [], palme: [], goldenLion: [], goldenBear: [] };
    }

    const tmdbId = tmdbIdStr ? parseInt(tmdbIdStr) : undefined;

    let oscars: any[] = [];
    let goldenGlobes: any[] = [];
    let palme: any[] = [];
    let goldenLion: any[] = [];
    let goldenBear: any[] = [];

    const includesIgnoreCase = (source: string | undefined | null, target: string) =>
        source && source.toLowerCase().includes(target.toLowerCase());

    const equalsIgnoreCase = (source: string | undefined | null, target: string) =>
        source && source.toLowerCase() === target.toLowerCase();


    const isTvCategory = (category: string) => {
        if (!category) return false;
        const lowerCategory = category.toLowerCase();
        const keywords = ['television', 'series', 'tv', 'miniseries'];
        return keywords.some(keyword => lowerCategory.includes(keyword));
    };

    try {
        if (type === 'person' && name) {
            oscars = oscarsData.filter(a => includesIgnoreCase(a.nominee_name, name));
            goldenGlobes = goldenGlobesData.filter(a => includesIgnoreCase(a.nominee, name));
            palme = palmeData.filter(a => includesIgnoreCase(a.director, name));
            goldenLion = goldenLionData.filter(a => includesIgnoreCase(a.director, name));
            goldenBear = goldenBearData.filter(a => includesIgnoreCase(a.director, name));

        } else if (type === 'movie') {
            if (tmdbId) {
                oscars = oscarsData.filter(a => a.tmdb_id === tmdbId);
                palme = palmeData.filter(a => a.tmdb_id === tmdbId);
                goldenLion = goldenLionData.filter(a => a.tmdb_id === tmdbId);
                goldenBear = goldenBearData.filter(a => a.tmdb_id === tmdbId);
            }

            if (tmdbId) {
                goldenGlobes = goldenGlobesData.filter(a => a.tmdb_id === tmdbId && !isTvCategory(a.category));
            }
            else if (goldenGlobes.length === 0 && title) {
                goldenGlobes = goldenGlobesData.filter(a => equalsIgnoreCase(a.film, title) && !isTvCategory(a.category));

                if (goldenGlobes.length === 0 && tmdbId && Number.isInteger(tmdbId) && tmdbId > 0) {
                    try {
                        const config = useRuntimeConfig();
                        const apiKey = config.public.apiKey;
                        if (apiKey) {
                            const tmdbRes: any = await $fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${apiKey}&language=en-US`);
                            if (tmdbRes && tmdbRes.title && tmdbRes.title !== title) {
                                goldenGlobes = goldenGlobesData.filter(a => equalsIgnoreCase(a.film, tmdbRes.title) && !isTvCategory(a.category));
                            }
                        }
                    } catch (e) {
                        // ignore TMDB fetch error
                    }
                }
            }

            if (title) {
                if (palme.length === 0) {
                    palme = palmeData.filter(a => equalsIgnoreCase(a.film_title, title));
                }
                if (goldenLion.length === 0) {
                    goldenLion = goldenLionData.filter(a => equalsIgnoreCase(a.film_title, title));
                }
                if (goldenBear.length === 0) {
                    goldenBear = goldenBearData.filter(a => equalsIgnoreCase(a.film_title, title));
                }
            }

        } else if (type === 'tv') {
            if (tmdbId) {
                goldenGlobes = goldenGlobesData.filter(a => a.tmdb_id === tmdbId && isTvCategory(a.category));
            }
            else if (title) {
                goldenGlobes = goldenGlobesData.filter(a => equalsIgnoreCase(a.film, title) && isTvCategory(a.category));
            }

        } else {
            // Mixed type or unknown - keep original behavior but maybe we should filter if we knew better?
            // For now keeping it as is for "search" mode where type might not be specific
            if (tmdbId) {
                oscars.push(...oscarsData.filter(a => a.tmdb_id === tmdbId));
                palme.push(...palmeData.filter(a => a.tmdb_id === tmdbId));
                goldenLion.push(...goldenLionData.filter(a => a.tmdb_id === tmdbId));
                goldenBear.push(...goldenBearData.filter(a => a.tmdb_id === tmdbId));
            }
            if (name) {
                oscars.push(...oscarsData.filter(a => includesIgnoreCase(a.nominee_name, name)));
                goldenGlobes.push(...goldenGlobesData.filter(a => includesIgnoreCase(a.nominee, name)));
            }
            if (title) {
                goldenGlobes.push(...goldenGlobesData.filter(a => equalsIgnoreCase(a.film, title)));
            }
        }

    } catch (e) {
        console.error("Error in in-memory awards API:", e);
    }

    return {
        oscars,
        goldenGlobes,
        palme,
        goldenLion,
        goldenBear
    };
});
