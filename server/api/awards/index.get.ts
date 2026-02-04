import { createClient } from "@libsql/client";

const config = useRuntimeConfig();

const dbUrl = process.env.IMDB_DB_URL || config.tursoDbUrl || process.env.DB_URL;
const dbToken = process.env.IMDB_DB_TOKEN || config.tursoDbToken || process.env.DB_TOKEN;

const db = createClient({
    url: dbUrl!,
    authToken: dbToken!,
});

interface Oscar {
    id: number;
    year: number;
    ceremony: number;
    category: string;
    winner: number;
    film: string;
    name: string;
    tmdb_id: number;
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

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const { tmdbId, name, title, type } = query as { tmdbId?: string, name?: string, title?: string, type?: string };

    if (!tmdbId && !name && !title) {
        return { oscars: [], goldenGlobes: [], palme: [], goldenLion: [], goldenBear: [] };
    }

    let oscars: any[] = [];
    let goldenGlobes: any[] = [];
    let palme: any[] = [];
    let goldenLion: any[] = [];
    let goldenBear: any[] = [];

    try {
        if (type === 'person') {
            if (name) {
                const oscarResult = await db.execute({
                    sql: "SELECT * FROM awards_oscars WHERE nominee_name LIKE ? COLLATE NOCASE",
                    args: [`%${name}%`]
                });
                oscars = [...oscars, ...oscarResult.rows];

                const ggResult = await db.execute({
                    sql: "SELECT * FROM awards_golden_globes WHERE nominee LIKE ? COLLATE NOCASE",
                    args: [`%${name}%`]
                });
                goldenGlobes = [...goldenGlobes, ...ggResult.rows];

                const palmeRes = await db.execute({ sql: "SELECT * FROM awards_palm_d_or WHERE director LIKE ? COLLATE NOCASE", args: [`%${name}%`] });
                palme = [...palme, ...palmeRes.rows];

                const lionRes = await db.execute({ sql: "SELECT * FROM awards_golden_lion WHERE director LIKE ? COLLATE NOCASE", args: [`%${name}%`] });
                goldenLion = [...goldenLion, ...lionRes.rows];

                const bearRes = await db.execute({ sql: "SELECT * FROM awards_golden_bear WHERE director LIKE ? COLLATE NOCASE", args: [`%${name}%`] });
                goldenBear = [...goldenBear, ...bearRes.rows];
            }
        } else if (type === 'movie') {
            if (tmdbId) {
                const oscarResult = await db.execute({
                    sql: "SELECT * FROM awards_oscars WHERE tmdb_id = ?",
                    args: [tmdbId]
                });
                oscars = [...oscars, ...oscarResult.rows];

                const palmeRes = await db.execute({ sql: "SELECT * FROM awards_palm_d_or WHERE tmdb_id = ?", args: [tmdbId] });
                palme = [...palme, ...palmeRes.rows];

                const lionRes = await db.execute({ sql: "SELECT * FROM awards_golden_lion WHERE tmdb_id = ?", args: [tmdbId] });
                goldenLion = [...goldenLion, ...lionRes.rows];

                const bearRes = await db.execute({ sql: "SELECT * FROM awards_golden_bear WHERE tmdb_id = ?", args: [tmdbId] });
                goldenBear = [...goldenBear, ...bearRes.rows];
            }
            if (title) {
                const ggResult = await db.execute({
                    sql: "SELECT * FROM awards_golden_globes WHERE film LIKE ? COLLATE NOCASE",
                    args: [`${title}`]
                });
                goldenGlobes = [...goldenGlobes, ...ggResult.rows];

                if (goldenGlobes.length === 0 && tmdbId) {
                    try {
                        const apiKey = config.public.apiKey;
                        const tmdbRes: any = await $fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${apiKey}&language=en-US`);
                        if (tmdbRes && tmdbRes.title && tmdbRes.title !== title) {
                            const ggResultEn = await db.execute({
                                sql: "SELECT * FROM awards_golden_globes WHERE film LIKE ? COLLATE NOCASE",
                                args: [`${tmdbRes.title}`]
                            });
                            goldenGlobes = [...goldenGlobes, ...ggResultEn.rows];
                        }
                    } catch (e) {
                        // ignore
                    }
                }

                if (palme.length === 0) {
                    const r = await db.execute({ sql: "SELECT * FROM awards_palm_d_or WHERE film_title LIKE ? COLLATE NOCASE", args: [title] });
                    palme.push(...r.rows);
                }
                if (goldenLion.length === 0) {
                    const r = await db.execute({ sql: "SELECT * FROM awards_golden_lion WHERE film_title LIKE ? COLLATE NOCASE", args: [title] });
                    goldenLion.push(...r.rows);
                }
                if (goldenBear.length === 0) {
                    const r = await db.execute({ sql: "SELECT * FROM awards_golden_bear WHERE film_title LIKE ? COLLATE NOCASE", args: [title] });
                    goldenBear.push(...r.rows);
                }
            }
        } else if (type === 'tv') {
            if (title) {
                const ggResult = await db.execute({
                    sql: "SELECT * FROM awards_golden_globes WHERE film LIKE ? COLLATE NOCASE",
                    args: [`${title}`]
                });
                goldenGlobes = [...goldenGlobes, ...ggResult.rows];
            }
        } else {
            if (tmdbId) {
                const res = await db.execute({ sql: "SELECT * FROM awards_oscars WHERE tmdb_id = ?", args: [tmdbId] });
                oscars.push(...res.rows);

                const [p, l, b] = await Promise.all([
                    db.execute({ sql: "SELECT * FROM awards_palm_d_or WHERE tmdb_id = ?", args: [tmdbId] }),
                    db.execute({ sql: "SELECT * FROM awards_golden_lion WHERE tmdb_id = ?", args: [tmdbId] }),
                    db.execute({ sql: "SELECT * FROM awards_golden_bear WHERE tmdb_id = ?", args: [tmdbId] })
                ]);
                palme.push(...p.rows);
                goldenLion.push(...l.rows);
                goldenBear.push(...b.rows);
            }
            if (name) {
                const resO = await db.execute({ sql: "SELECT * FROM awards_oscars WHERE nominee_name LIKE ? COLLATE NOCASE", args: [`%${name}%`] });
                oscars.push(...resO.rows);
                const resG = await db.execute({ sql: "SELECT * FROM awards_golden_globes WHERE nominee LIKE ? COLLATE NOCASE", args: [`%${name}%`] });
                goldenGlobes.push(...resG.rows);
            }
            if (title) {
                const res = await db.execute({ sql: "SELECT * FROM awards_golden_globes WHERE film LIKE ? COLLATE NOCASE", args: [`${title}`] });
                goldenGlobes.push(...res.rows);
            }
        }

    } catch (e) {
        console.error("Database error in awards API:", e);
    }

    return {
        oscars,
        goldenGlobes,
        palme,
        goldenLion,
        goldenBear
    };
});
