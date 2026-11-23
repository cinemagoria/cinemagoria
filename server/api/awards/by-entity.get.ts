import { createError, defineEventHandler, getQuery } from 'h3'
import { dbExecute } from '~~/server/utils/db'
import { FESTIVAL_NAME_BY_SLUG } from '~~/server/utils/festivals'
import { translateAwardCategory } from '~~/server/utils/awardCategories'

/**
 * Awards for the awards modal, from festival_awards (covered editions) and
 * awards_archive (Oscars, Globes, Palme, Lion, Bear; wins and nominations).
 *
 *   ?entities=movie:1315657,tv:1399  → { results: { 'movie:1315657': groups, ... } }
 *   ?person=Meryl Streep             → { person: groups }
 *
 * Every lookup is indexed. Titles are batched for the whole homepage pool like
 * /api/articles/by-entity. Cached a day by the `/api/awards/**` route rule.
 */

const MAX_ENTITIES = 24
const ALLOWED_TYPES = new Set(['movie', 'tv'])

const ARCHIVE_BODIES: Record<string, { name: string, award: string, festival?: string }> = {
    oscars: { name: 'Premios Óscar', award: 'oscars' },
    'golden-globes': { name: 'Globos de Oro', award: 'goldenGlobes' },
    'palme-dor': { name: 'Cannes Film Festival', award: 'palme', festival: 'cannes' },
    'golden-lion': { name: 'Venice Film Festival', award: 'goldenLion', festival: 'venice' },
    'golden-bear': { name: 'Berlinale', award: 'goldenBear', festival: 'berlinale' },
}

const ARCHIVE_COLUMNS = `id, tmdb_id, media_type, body_slug, ceremony_year, year_label,
                         category, rank, title, recipient_name, won, is_tie`

// Diacritic-stripped lowercase, matching how awards_archive_recipients.recipient_norm was written.
const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

type Group = { id: string, name: string, year: string | number, order: number, rank: number, logo: string | null, link: string | null, awards: any[] }

function groupFor(list: Group[], id: string, base: Omit<Group, 'id' | 'awards'>) {
    let group = list.find((g) => g.id === id)
    if (!group) list.push(group = { id, ...base, awards: [] })
    return group
}

function addArchiveRow(list: Group[], row: any, asPerson: boolean) {
    const body = ARCHIVE_BODIES[row.body_slug]
    if (!body) return
    const year = row.ceremony_year
    // The covered edition already lists this win with its full detail.
    if (body.festival && list.some((g) => g.id === `${body.festival}-${year}`)) return
    const label = row.year_label ?? year
    const rank = Object.keys(ARCHIVE_BODIES).indexOf(row.body_slug)
    // A person's career reads best as one group per body, each row dated.
    const base = asPerson
        ? { name: body.name, year: '', order: 0, rank, logo: null, link: `/awards?award=${body.award}` }
        : {
            name: body.name,
            year: label,
            // Oscars are stored by film year; their ceremony is the next one.
            order: row.body_slug === 'oscars' ? year + 1 : year,
            rank,
            logo: null,
            link: `/awards?award=${body.award}&year=${encodeURIComponent(label)}`,
        }
    groupFor(list, asPerson ? row.body_slug : `${row.body_slug}-${year}`, base).awards.push({
        name: row.rank === 'silver' ? 'Gran Premio' : translateAwardCategory(row.category),
        section: null,
        recipient: !asPerson && row.recipient_name && row.recipient_name !== row.title ? row.recipient_name : null,
        role: null,
        year: asPerson ? label : null,
        film: asPerson ? row.title : null,
        filmLink: asPerson && row.tmdb_id ? `/${row.media_type === 'tv' ? 'tv' : 'movie'}/${row.tmdb_id}` : null,
        grand: !!body.festival,
        mention: false,
        tie: !!row.is_tie,
        won: !!row.won,
    })
}

// Wins first inside each group (stable, so the year order holds), newest group first.
const sortGroups = (list: Group[]) => {
    for (const g of list) g.awards.sort((a, b) => b.won - a.won)
    return list.sort((a, b) => (b.order - a.order) || (a.rank - b.rank))
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const lang = String(config.public.apiLang || 'en').substring(0, 2).toLowerCase()
    const pick = (es: any, en: any) => (lang === 'es' && es) ? es : en
    const query = getQuery(event)

    try {
        const person = String(query.person || '').trim()
        if (person) {
            const rows = await dbExecute({
                sql: `SELECT ${ARCHIVE_COLUMNS} FROM awards_archive
                      WHERE id IN (SELECT award_id FROM awards_archive_recipients WHERE recipient_norm = ?)
                      ORDER BY ceremony_year DESC, won DESC, id ASC`,
                args: [norm(person)],
            })
            const list: Group[] = []
            for (const row of rows.rows as any[]) addArchiveRow(list, row, true)
            return { person: sortGroups(list) }
        }

        const keys = Array.from(new Set(
            String(query.entities || '').split(',').map((pair) => {
                const [type, id] = pair.trim().split(':')
                const n = Number(id)
                return ALLOWED_TYPES.has(type) && Number.isInteger(n) && n > 0 ? `${type}:${n}` : ''
            }).filter(Boolean),
        )).slice(0, MAX_ENTITIES)

        if (keys.length === 0) return { results: {} }

        const ids = Array.from(new Set(keys.map((k) => Number(k.split(':')[1]))))
        // festival_awards has no media type: its tmdb_ids are films.
        const movieIds = keys.filter((k) => k.startsWith('movie:')).map((k) => Number(k.split(':')[1]))
        const marks = (list: number[]) => list.map(() => '?').join(',')

        const [festivalRows, archiveRows] = await Promise.all([
            movieIds.length
                ? dbExecute({
                    // Some imports (Tribeca) left festival_awards.tmdb_id empty; the linked film has it.
                    sql: `SELECT COALESCE(a.tmdb_id, f.tmdb_id) AS tmdb_id, a.festival_slug, a.festival_name, a.festival_year,
                                 a.award_name, a.award_name_es, a.award_section, a.award_section_es,
                                 a.recipient_name, a.recipient_role, a.recipient_role_es,
                                 a.is_grand_prize, a.is_honorable_mention, a.is_tie
                          FROM festival_awards a
                          LEFT JOIN festival_films f ON f.id = a.film_id
                          WHERE a.tmdb_id IN (${marks(movieIds)})
                             OR a.film_id IN (SELECT id FROM festival_films WHERE tmdb_id IN (${marks(movieIds)}))
                          ORDER BY a.festival_year DESC, a.display_order ASC, a.id ASC`,
                    args: [...movieIds, ...movieIds],
                })
                : Promise.resolve({ rows: [] as any[] }),
            dbExecute({
                sql: `SELECT ${ARCHIVE_COLUMNS} FROM awards_archive
                      WHERE tmdb_id IN (${marks(ids)})
                      ORDER BY ceremony_year DESC, won DESC, id ASC`,
                args: ids,
            }),
        ])

        const results: Record<string, Group[]> = Object.fromEntries(keys.map((k) => [k, []]))

        for (const row of festivalRows.rows as any[]) {
            const list = results[`movie:${row.tmdb_id}`]
            if (!list) continue
            const festival = String(row.festival_slug || '').replace(/-\d{4}$/, '')
            groupFor(list, `${festival}-${row.festival_year}`, {
                name: row.festival_name,
                year: row.festival_year,
                order: row.festival_year,
                rank: -1,
                logo: festival ? `/festivals/${festival}/${festival}_film_festival_${row.festival_year}_logo.png` : null,
                // Only festivals with a page on the site get "View" (DOC NYC has a logo but no page).
                link: row.festival_slug && FESTIVAL_NAME_BY_SLUG[festival] ? `/festival/${row.festival_slug}` : null,
            }).awards.push({
                name: pick(row.award_name_es, row.award_name),
                section: pick(row.award_section_es, row.award_section),
                recipient: row.recipient_name || null,
                role: pick(row.recipient_role_es, row.recipient_role) || null,
                year: null,
                film: null,
                filmLink: null,
                grand: !!row.is_grand_prize,
                mention: !!row.is_honorable_mention,
                tie: !!row.is_tie,
                won: true,
            })
        }

        for (const row of archiveRows.rows as any[]) {
            const list = results[`${row.media_type === 'tv' ? 'tv' : 'movie'}:${row.tmdb_id}`]
            if (list) addArchiveRow(list, row, false)
        }

        for (const key of keys) sortGroups(results[key])
        return { results }
    } catch (error: any) {
        console.error('Awards by entity failed:', error)
        throw createError({ statusCode: 500, statusMessage: 'Failed to fetch awards' })
    }
})
