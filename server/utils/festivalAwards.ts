import { createError } from 'h3'
import { createClient } from '@libsql/client'

/**
 * Shared handler for /api/festival/<shortcode>/awards endpoints.
 *
 * Locale-aware: pass 'es' to get Spanish text; defaults to 'en'.
 * The DB has bilingual columns (award_name + award_name_es, etc.) — when 'es'
 * is requested we serve the *_es value with EN as fallback so the UI never
 * blanks out if a translation is missing.
 *
 * The English deployment calls this with no locale → English.
 * The Spanish deployment calls this with 'es' → Spanish.
 */
export type Locale = 'en' | 'es'

export async function fetchFestivalAwards(festivalSlug: string, locale: Locale = 'en') {
    const config = useRuntimeConfig()
    const dbUrl = config.rssDbUrl || config.imdbDbUrl
    const dbToken = config.rssDbToken || config.imdbDbToken

    if (!dbUrl || !dbToken) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Database configuration missing',
        })
    }

    const db = createClient({ url: dbUrl, authToken: dbToken })

    try {
        const result = await db.execute({
            sql: `SELECT
                    a.id, a.festival_name, a.festival_year, a.festival_slug,
                    a.award_name, a.award_name_es,
                    a.award_section, a.award_section_es,
                    a.award_type, a.award_subject,
                    a.is_grand_prize, a.is_honorable_mention, a.is_tie, a.rank_position,
                    a.title, a.director, a.description, a.description_es,
                    a.notes, a.display_order,
                    a.tmdb_id, a.imdb_id, a.cinemagoria_url,
                    a.recipient_name, a.recipient_role, a.recipient_role_es,
                    a.tmdb_data AS award_tmdb_data,
                    f.tmdb_data AS film_tmdb_data,
                    f.image_url AS film_image_url
                  FROM festival_awards a
                  LEFT JOIN festival_films f ON f.id = a.film_id
                  WHERE a.festival_slug = ?
                  ORDER BY a.display_order ASC, a.id ASC`,
            args: [festivalSlug],
        })

        // Pick localized text with EN fallback
        const pick = (es: any, en: any) => (locale === 'es' && es) ? es : en

        const results = result.rows.map((row: any) => {
            const raw = row.award_tmdb_data || row.film_tmdb_data
            let tmdb: any = {}
            try {
                tmdb = typeof raw === 'string' ? JSON.parse(raw) : (raw || {})
            } catch {
                tmdb = {}
            }

            return {
                id: row.id,

                // Localized fields
                award_name:     pick(row.award_name_es, row.award_name),
                award_section:  pick(row.award_section_es, row.award_section),
                description:    pick(row.description_es, row.description),
                recipient_role: pick(row.recipient_role_es, row.recipient_role),

                // Non-localized fields
                award_type: row.award_type,
                award_subject: row.award_subject,
                is_grand_prize: !!row.is_grand_prize,
                is_honorable_mention: !!row.is_honorable_mention,
                is_tie: !!row.is_tie,
                rank_position: row.rank_position,
                display_order: row.display_order,

                title: row.title,
                director: row.director,
                notes: row.notes,

                tmdb_id: row.tmdb_id,
                imdb_id: row.imdb_id,
                cinemagoria_url: row.cinemagoria_url,

                poster: tmdb.tmdb_poster
                    || (tmdb.poster_path ? `https://image.tmdb.org/t/p/w500${tmdb.poster_path}` : null)
                    || row.film_image_url
                    || null,
                backdrop: tmdb.tmdb_backdrop
                    || (tmdb.backdrop_path ? `https://image.tmdb.org/t/p/w1280${tmdb.backdrop_path}` : null),
                overview: tmdb.tmdb_overview || tmdb.overview || null,

                recipient_name: row.recipient_name,
            }
        })

        return {
            slug: festivalSlug,
            festival_name: (result.rows[0] as any)?.festival_name || null,
            festival_year: 2026,
            locale,
            results,
        }
    } catch (error: any) {
        console.error(`Awards fetch error (${festivalSlug}, ${locale}):`, error)
        throw createError({
            statusCode: 500,
            statusMessage: `Failed to fetch awards for '${festivalSlug}': ${error.message || error}`,
        })
    }
}
