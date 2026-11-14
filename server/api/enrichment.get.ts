import { createError, defineEventHandler, setResponseHeader } from 'h3'
import { dbExecute } from '~~/server/utils/db'
import { cachedWithRefresh } from '~~/server/utils/staleCache'

// Same rows scripts/sync{HeroData,NoirEnrichmentData,CustomOverrides}.js write to
// public/data/*-enrichment.json, read live so hero/noir/title_overrides edits reach
// the detail pages without a redeploy. ~1.1k rows per refresh.
const ENRICHMENT_FRESH_MS = 2 * 60 * 1000

async function loadTable(table: string, forceUnlessZero: boolean) {
    const result = await dbExecute({
        sql: `SELECT tmdb_id, media_type, trailer_key, backdrop_path, poster_path, force_enrichment
              FROM ${table}
              WHERE tmdb_id IS NOT NULL`,
        args: [],
    })
    return (result.rows as any[]).map((row) => ({
        tmdb_id: Number(row.tmdb_id),
        media_type: row.media_type || 'movie',
        trailer_key: row.trailer_key || null,
        backdrop_path: row.backdrop_path || null,
        poster_path: row.poster_path || null,
        // title_overrides defaults to force for legacy rows (syncCustomOverrides.js); hero/noir need an explicit 1.
        force_enrichment: forceUnlessZero ? row.force_enrichment !== 0 : row.force_enrichment === 1,
    }))
}

async function loadEnrichment() {
    const [hero, noir, custom] = await Promise.all([
        loadTable('hero_selections', false),
        loadTable('noir_historical', false),
        loadTable('title_overrides', true),
    ])
    return { hero, noir, custom }
}

export default defineEventHandler(async (event) => {
    try {
        const data = await cachedWithRefresh('enrichment', ENRICHMENT_FRESH_MS, loadEnrichment)
        // Set here, not in nuxt.config routeRules: that file is part of the Docker deps layer.
        setResponseHeader(event, 'cache-control', 'public, max-age=60, s-maxage=60')
        return data
    } catch (error: any) {
        console.error('Enrichment fetch error:', error)
        throw createError({ statusCode: 500, statusMessage: `Failed to fetch enrichment: ${error.message || error}` })
    }
})
