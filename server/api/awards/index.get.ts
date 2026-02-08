
import awardsData from '../../data/awards.json';

// Type definitions based on the JSON structure
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
}

interface FestivalAward { // Palme / Lion / Bear share similar structure
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
    // Cast query params to strings to be safe
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

    // Helper for case-insensitive partial match
    const includesIgnoreCase = (source: string | undefined | null, target: string) =>
        source && source.toLowerCase().includes(target.toLowerCase());

    const equalsIgnoreCase = (source: string | undefined | null, target: string) =>
        source && source.toLowerCase() === target.toLowerCase();

    try {
        if (type === 'person' && name) {
            // Person Search
            oscars = oscarsData.filter(a => includesIgnoreCase(a.nominee_name, name));
            goldenGlobes = goldenGlobesData.filter(a => includesIgnoreCase(a.nominee, name));
            palme = palmeData.filter(a => includesIgnoreCase(a.director, name));
            goldenLion = goldenLionData.filter(a => includesIgnoreCase(a.director, name));
            goldenBear = goldenBearData.filter(a => includesIgnoreCase(a.director, name));

        } else if (type === 'movie') {
            // Movie Search
            if (tmdbId) {
                oscars = oscarsData.filter(a => a.tmdb_id === tmdbId);
                palme = palmeData.filter(a => a.tmdb_id === tmdbId);
                goldenLion = goldenLionData.filter(a => a.tmdb_id === tmdbId);
                goldenBear = goldenBearData.filter(a => a.tmdb_id === tmdbId);
            }

            if (title) {
                // Golden Globes typically don't have TMDB ID in the dataset, rely on Title
                goldenGlobes = goldenGlobesData.filter(a => equalsIgnoreCase(a.film, title));

                // Fallback for festivals if no results by ID (or if TMDB ID is 0/missing in dataset)
                if (palme.length === 0) {
                    palme = palmeData.filter(a => equalsIgnoreCase(a.film_title, title));
                }
                if (goldenLion.length === 0) {
                    goldenLion = goldenLionData.filter(a => equalsIgnoreCase(a.film_title, title));
                }
                if (goldenBear.length === 0) {
                    goldenBear = goldenBearData.filter(a => equalsIgnoreCase(a.film_title, title));
                }

                // If no Golden Globes found by title, try fetching English title from TMDB (as per original logic)
                if (goldenGlobes.length === 0 && tmdbId) {
                    // We keep this logic to match original behavior, but strictly speaking this triggers an external API call.
                    // It is NOT a DB call, so it is safe for the goal of reducing DB reads.
                    try {
                        const config = useRuntimeConfig();
                        const apiKey = config.public.apiKey;
                        if (apiKey) {
                            const tmdbRes: any = await $fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${apiKey}&language=en-US`);
                            if (tmdbRes && tmdbRes.title && tmdbRes.title !== title) {
                                const extraGG = goldenGlobesData.filter(a => equalsIgnoreCase(a.film, tmdbRes.title));
                                goldenGlobes = [...goldenGlobes, ...extraGG];
                            }
                        }
                    } catch (e) {
                        // ignore TMDB fetch error
                    }
                }
            }

        } else if (type === 'tv' && title) {
            // TV Search
            goldenGlobes = goldenGlobesData.filter(a => equalsIgnoreCase(a.film, title));

        } else {
            // Generic Fallback (matches original 'else' block logic)
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
