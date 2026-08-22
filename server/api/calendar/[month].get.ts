import { dbExecute } from '~/server/utils/db'

const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/
const SETTLED_MONTH_MAX_AGE = 604800
const LIVE_MONTH_MAX_AGE = 3600

function monthBounds(month: string) {
    const [year, index] = month.split('-').map(Number)
    return {
        from: `${month}-01`,
        to: new Date(Date.UTC(year, index, 0)).toISOString().slice(0, 10),
    }
}

export default defineEventHandler(async (event) => {
    const month = getRouterParam(event, 'month') || ''
    if (!MONTH_PATTERN.test(month)) {
        throw createError({ statusCode: 400, statusMessage: 'Expected a YYYY-MM month' })
    }

    const { from, to } = monthBounds(month)

    const result = await dbExecute({
        sql: `SELECT e.event_date, e.event_type, e.country, e.season_number, e.episode_number,
                     e.note, e.date_precision, e.confidence, e.is_rerelease,
                     e.media_type, e.tmdb_id,
                     t.title, t.year, t.poster_path, t.is_short
              FROM release_events e
              LEFT JOIN release_titles t
                ON t.media_type = e.media_type AND t.tmdb_id = e.tmdb_id
              WHERE e.event_date BETWEEN ? AND ?
              ORDER BY e.event_date`,
        args: [from, to],
    })

    const titles: Record<string, Record<string, unknown>> = {}
    const events: Record<string, unknown>[] = []

    const ordered = [...result.rows].sort((a, b) => String(a.event_date).localeCompare(String(b.event_date))
        || String(a.media_type).localeCompare(String(b.media_type))
        || Number(a.tmdb_id) - Number(b.tmdb_id)
        || Number(a.event_type) - Number(b.event_type))

    for (const row of ordered) {
        const id = `${String(row.media_type)[0]}${row.tmdb_id}`
        if (!titles[id]) {
            titles[id] = { t: row.title || null, y: row.year ?? null }
            if (row.poster_path) titles[id].p = row.poster_path
            if (Number(row.is_short) === 1) titles[id].h = 1
        }

        const entry: Record<string, unknown> = {
            i: id,
            d: String(row.event_date),
            k: Number(row.event_type),
        }
        if (row.country) entry.c = row.country
        if (Number(row.season_number) >= 0) {
            entry.s = Number(row.season_number)
            entry.e = Number(row.episode_number)
        }
        if (row.note) entry.n = row.note
        if (row.date_precision !== 'day') entry.q = row.date_precision
        if (row.confidence !== 'confirmed') entry.f = row.confidence
        if (Number(row.is_rerelease) === 1) entry.r = 1
        events.push(entry)
    }

    const today = new Date().toISOString().slice(0, 10)
    const maxAge = to < today ? SETTLED_MONTH_MAX_AGE : LIVE_MONTH_MAX_AGE
    setResponseHeader(event, 'cache-control', `public, max-age=${maxAge}, s-maxage=${maxAge}`)

    return { month, from, to, titles, events }
})
