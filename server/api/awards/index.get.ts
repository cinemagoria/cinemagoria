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
        return { oscars: [], goldenGlobes: [] };
    }

    let oscars: any[] = [];
    let goldenGlobes: any[] = [];

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
            }
        } else if (type === 'movie') {
            if (tmdbId) {
                const oscarResult = await db.execute({
                    sql: "SELECT * FROM awards_oscars WHERE tmdb_id = ?",
                    args: [tmdbId]
                });
                oscars = [...oscars, ...oscarResult.rows];
            }
            if (title) {
                const ggResult = await db.execute({
                    sql: "SELECT * FROM awards_golden_globes WHERE film LIKE ? COLLATE NOCASE",
                    args: [`${title}`]
                });
                goldenGlobes = [...goldenGlobes, ...ggResult.rows];
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
            // Fallback for no type specified
            if (tmdbId) {
                const res = await db.execute({ sql: "SELECT * FROM awards_oscars WHERE tmdb_id = ?", args: [tmdbId] });
                oscars.push(...res.rows);
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
        goldenGlobes
    };
});
