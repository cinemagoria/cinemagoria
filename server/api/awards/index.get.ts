import { createClient } from "@libsql/client";

const config = useRuntimeConfig();

const dbUrl = process.env.IMDB_DB_URL || config.tursoDbUrl || process.env.DB_URL;
const dbToken = process.env.IMDB_DB_TOKEN || config.tursoDbToken || process.env.DB_TOKEN;

const db = createClient({
    url: dbUrl!,
    authToken: dbToken!,
});

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const { tmdbId, name, title, type } = query;

    if (!tmdbId && !name && !title) {
        return { oscars: [], goldenGlobes: [] };
    }

    let oscars: any[] = [];
    let goldenGlobes: any[] = [];

    try {
        if (tmdbId && (type === 'movie' || !type)) {
            const result = await db.execute({
                sql: "SELECT * FROM awards_oscars WHERE tmdb_id = ?",
                args: [tmdbId] as any
            });
            oscars = [...oscars, ...result.rows];
        }

        if (name && (type === 'person' || !type)) {
            const result = await db.execute({
                sql: "SELECT * FROM awards_oscars WHERE nominee_name LIKE ? COLLATE NOCASE",
                args: [`%${name}%`] as any
            });
            oscars = [...oscars, ...result.rows];
        }

        if (title && (type === 'movie' || type === 'tv' || !type)) {
            const result = await db.execute({
                sql: "SELECT * FROM awards_golden_globes WHERE film LIKE ? COLLATE NOCASE",
                args: [`${title}`] as any
            });
            goldenGlobes = [...goldenGlobes, ...result.rows];
        }

        if (name && (type === 'person' || !type)) {
            const result = await db.execute({
                sql: "SELECT * FROM awards_golden_globes WHERE nominee LIKE ? COLLATE NOCASE",
                args: [`%${name}%`] as any
            });
            goldenGlobes = [...goldenGlobes, ...result.rows];
        }

    } catch (e) {
        console.error("Database error in awards API:", e);
    }

    return {
        oscars,
        goldenGlobes
    };
});
