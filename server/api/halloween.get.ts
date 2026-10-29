import { createError, defineEventHandler, getQuery, setResponseHeader } from 'h3'
import { dbExecute } from '~~/server/utils/db'
import { cachedWithRefresh } from '~~/server/utils/staleCache'

const FRESH_MS = 60 * 1000
const MAX_EDGE_SECONDS = 600
const FEATURED_LIMIT = 20

async function loadEdit() {
    const event = (await dbExecute({
        sql: `SELECT id, slug, title, title_es, description, description_es, status, starts_at, ends_at
              FROM halloween_events
              WHERE status != 'draft'
              ORDER BY starts_at DESC
              LIMIT 1`,
        args: [],
    })).rows[0] as any
    if (!event) return null

    const [categories, movies] = await Promise.all([
        dbExecute({
            sql: `SELECT id, slug, kind, parent_id, name, name_es, description, description_es
                  FROM halloween_categories
                  WHERE event_id = ? AND is_visible = 1
                  ORDER BY display_order`,
            args: [event.id],
        }),
        dbExecute({
            sql: `SELECT m.movie_id, m.editorial_rank, m.featured, m.title, m.poster_path, m.release_date, m.release_year,
                         m.imdb_rating, m.tmdb_rating,
                         (SELECT group_concat(mc.category_id) FROM halloween_movie_categories mc
                          WHERE mc.halloween_movie_id = m.id) AS category_ids
                  FROM halloween_movies m
                  WHERE m.event_id = ? AND m.status = 'active'
                  ORDER BY m.editorial_rank`,
            args: [event.id],
        }),
    ])

    const visibleIds = new Set(categories.rows.map((c: any) => Number(c.id)))
    return {
        event: {
            slug: event.slug,
            title: event.title,
            title_es: event.title_es,
            description: event.description,
            description_es: event.description_es,
            status: event.status,
            starts_at: event.starts_at,
            ends_at: event.ends_at,
        },
        categories: categories.rows.map((c: any) => ({
            id: Number(c.id),
            slug: c.slug,
            kind: c.kind,
            parent_id: c.parent_id === null ? null : Number(c.parent_id),
            name: c.name,
            name_es: c.name_es,
            description: c.description,
            description_es: c.description_es,
        })),
        movies: movies.rows.map((m: any) => ({
            id: Number(m.movie_id),
            media_type: 'movie',
            title: m.title,
            poster_path: m.poster_path,
            release_date: m.release_date || (m.release_year ? `${m.release_year}-07-01` : null),
            year: m.release_year ? Number(m.release_year) : null,
            imdb_rating: m.imdb_rating ? Number(m.imdb_rating) : null,
            rating_source: m.imdb_rating ? 'imdb' : 'tmdb',
            vote_average: m.tmdb_rating ? Number(m.tmdb_rating) : null,
            rank: Number(m.editorial_rank),
            featured: Boolean(m.featured),
            category_ids: String(m.category_ids || '').split(',').map(Number).filter((id) => visibleIds.has(id)),
        })),
    }
}

function isActive(event: { status: string, starts_at: string, ends_at: string }, now: number) {
    return event.status === 'active' && now >= Date.parse(event.starts_at) && now < Date.parse(event.ends_at)
}

export default defineEventHandler(async (h3Event) => {
    const featuredOnly = getQuery(h3Event).featured === '1'
    let edit
    try {
        edit = await cachedWithRefresh('halloween', FRESH_MS, loadEdit)
    } catch (error: any) {
        console.error('Halloween edit fetch error:', error)
        throw createError({ statusCode: 500, statusMessage: 'Failed to load the Halloween edit' })
    }

    if (!edit) {
        setResponseHeader(h3Event, 'Cache-Control', 'public, max-age=0, s-maxage=60')
        return { active: false }
    }

    const now = Date.now()
    const active = isActive(edit.event, now)
    const secondsLeft = Math.floor((Date.parse(edit.event.ends_at) - now) / 1000)
    const edgeSeconds = active ? Math.max(0, Math.min(MAX_EDGE_SECONDS, secondsLeft)) : MAX_EDGE_SECONDS
    setResponseHeader(h3Event, 'Cache-Control', `public, max-age=0, s-maxage=${edgeSeconds}`)

    if (featuredOnly) {
        if (!active) return { active: false }
        return {
            active: true,
            event: edit.event,
            total: edit.movies.length,
            movies: edit.movies.filter((m) => m.featured).slice(0, FEATURED_LIMIT).map(({ category_ids, ...m }) => m),
        }
    }
    return { active, ...edit }
})
