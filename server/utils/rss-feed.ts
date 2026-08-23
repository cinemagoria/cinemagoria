import MarkdownIt from 'markdown-it'
import { useDb } from './db'
import { getVimeoOembed } from './vimeo-oembed'

// Shared, canonical news-feed builder used by /feed (and by the legacy
// /api/article/rss redirect target). Keep this file byte-identical across
// deployments so it can be synced with the rest of the repo-sync tooling —
// the ONLY per-repo difference is the `lang` passed in by
// server/routes/feed.get.ts.

type FeedLang = 'en' | 'es'

const EN_BASE = 'https://cinemagoria.com'
const ES_BASE = 'https://es.cinemagoria.com'

const md = new MarkdownIt({ breaks: true, html: true })

// Spanish display labels for the editorial taxonomy. The DB value (English,
// lowercase) is the canonical key and is what gets emitted in the EN feed;
// the ES feed resolves it through this map for the <category> tag. Kept in
// sync with the Spanish utils/categoryLabels.js — if the user-facing
// translation changes there, mirror it here.
const CATEGORY_LABELS_ES: Record<string, string> = {
    festival:    'Festival',
    industry:    'Industria / Adquisiciones / Taquilla',
    trailer:     'Tráiler / Teaser / Primeras Imágenes',
    review:      'Crítica / Opinión',
    awards:      'Premios',
    streaming:   'Streaming',
    interview:   'Entrevista',
    documentary: 'Documentales',
}

const labelForFeed = (cat: string, isEs: boolean): string => {
    if (!cat) return ''
    if (!isEs) return cat
    return CATEGORY_LABELS_ES[cat] || cat
}

const escapeXml = (s: string) => (s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

// Wrap HTML in CDATA without letting an accidental `]]>` close the section.
const cdata = (html: string) => `<![CDATA[${(html || '').replace(/]]>/g, ']]]]><![CDATA[>')}]]>`

const firstCarousel = (raw: unknown): string => {
    if (!raw || typeof raw !== 'string') return ''
    const first = raw.split(',').map(u => u.trim()).filter(Boolean)[0]
    return first || ''
}

// Mirror the website body split (pages/news/[slug].vue → bodyParts): when both
// a trailer and a carousel exist, the body is cut at its middle <h2> so the
// carousel lands mid-article. Otherwise it stays in one piece.
const splitAtMiddleH2 = (html: string): { before: string; after: string } => {
    if (!html) return { before: '', after: '' }
    const indices: number[] = []
    const re = /<h2[\s>]/gi
    let m: RegExpExecArray | null
    while ((m = re.exec(html)) !== null) indices.push(m.index)
    if (indices.length === 0) return { before: html, after: '' }
    const mid = indices[Math.floor(indices.length / 2)]
    return { before: html.slice(0, mid), after: html.slice(mid) }
}

// Editorial taxonomy facet URI prefixes used in <category domain="…"> tags.
// Distinguishes the primary editorial label and any secondaries from the
// free-form topic tags, without leaking the brand into either side. Feed
// consumers that ignore the domain attribute still see all three layers as
// plain categories — backward-compatible.
const CATEGORY_PRIMARY_DOMAIN = 'https://cinemagoria.com/news/category/primary'
const CATEGORY_SECONDARY_DOMAIN = 'https://cinemagoria.com/news/category/secondary'

export async function buildNewsFeed(lang: FeedLang): Promise<string> {
    const db = useDb()

    const result = await db.execute({
        sql: `SELECT slug, title_en, title_es, description_en, description_es,
                     body_en, body_es, image_url, published_at,
                     trailer_youtube_id, trailer_provider, carousel_assets, topics_json,
                     requires_auth, editorial_category, secondary_categories_json
              FROM cinemagoria_articles
              WHERE is_visible = 1 AND is_cinemagoria = 1
                AND (datetime(published_at) IS NULL OR datetime(published_at) <= datetime('now'))
              ORDER BY published_at DESC
              LIMIT 50`,
        args: []
    })

    const rows = result.rows as any[]

    const isEs = lang === 'es'
    const selfBase = isEs ? ES_BASE : EN_BASE
    const altBase = isEs ? EN_BASE : ES_BASE
    const altLang = isEs ? 'en' : 'es'

    // Pre-fetch Vimeo oEmbeds in parallel — needed for thumbnails (Vimeo, unlike
    // YouTube, doesn't expose a deterministic thumb URL). Failures resolve to
    // null and downgrade to a text-only trailer block; the feed never breaks.
    // Dedupe by ID so duplicates (rare but possible) don't trigger duplicate
    // requests; the helper also caches in-process for 24h.
    const vimeoIds: string[] = []
    for (const row of rows) {
        const id = row.trailer_youtube_id ? String(row.trailer_youtube_id).trim() : ''
        const provider = (row.trailer_provider as string) || 'youtube'
        if (id && provider === 'vimeo') vimeoIds.push(id)
    }
    const uniqueVimeoIds = Array.from(new Set(vimeoIds))
    const vimeoEntries = await Promise.all(
        uniqueVimeoIds.map(async id => [id, await getVimeoOembed(id)] as const)
    )
    const vimeoMap = new Map(vimeoEntries)

    const items = rows.map(row => {
        const title = (isEs ? row.title_es : row.title_en) || row.title_en || row.title_es || ''
        const altTitle = (isEs ? row.title_en : row.title_es) || ''
        const description = (isEs ? row.description_es : row.description_en) || row.description_en || row.description_es || ''
        const altDescription = (isEs ? row.description_en : row.description_es) || ''
        const bodyMd = (isEs ? row.body_es : row.body_en) || row.body_en || row.body_es || ''

        const link = `${selfBase}/news/${row.slug}`
        const altLink = `${altBase}/news/${row.slug}`

        let pubDate = ''
        try { pubDate = new Date(row.published_at).toUTCString() } catch { pubDate = new Date().toUTCString() }

        const cover = row.image_url ? String(row.image_url) : ''
        const ytId = row.trailer_youtube_id ? String(row.trailer_youtube_id).trim() : ''
        // `ytId` is a historical name — with Vimeo support it now holds the
        // video ID for either provider. `provider` selects the URL/thumb path.
        // Legacy rows have NULL provider → treated as 'youtube'.
        const provider = ((row.trailer_provider as string) || 'youtube') as 'youtube' | 'vimeo'
        const carousel = firstCarousel(row.carousel_assets)

        // Community gate: when requires_auth = 1, the CDATA collapses to
        // description + a sign-in legend. The body, trailer block, carousel
        // figure, and inline cover are dropped from the CDATA. Top-level
        // <title>, <description>, <media:*>, and <category> tags stay so the
        // feed reader still has a recognizable card layout.
        const isGated = Number(row.requires_auth ?? 0) === 1
        const loginUrl = `${selfBase}/login`

        let bodyHtml = ''
        try { bodyHtml = md.render(bodyMd) } catch { bodyHtml = `<p>${escapeXml(bodyMd)}</p>` }

        // Self-contained article that mirrors the on-site layout
        // (pages/news/[slug].vue): cover first (so readers render OUR image
        // instead of scraping the page og:image), then description, then the
        // trailer right after it, then the body with the first carousel image
        // kept in its original in-article position.
        const showCarousel = !!carousel && carousel !== cover
        const carouselFigure = showCarousel
            ? `<figure><img src="${escapeXml(carousel)}" alt="${escapeXml(title)}" /></figure>`
            : ''

        const parts: string[] = []
        if (isGated) {
            // Gated CDATA: just the sign-in legend. The <description> tag
            // above already carries the description — repeating it inside
            // <content:encoded> as <em> would be redundant. Body, trailer,
            // carousel and inline cover are all dropped.
            const legend = isEs
                ? `<p>Para leer el artículo completo, iniciá sesión o creá una cuenta gratuita en <a href="${loginUrl}">${loginUrl}</a>.</p>`
                : `<p>To read the full article, sign in or create a free account at <a href="${loginUrl}">${loginUrl}</a>.</p>`
            parts.push(legend)
        } else {
            if (cover) {
                parts.push(`<figure><img src="${escapeXml(cover)}" alt="${escapeXml(title)}" /></figure>`)
            }
            if (description) {
                parts.push(`<p><em>${escapeXml(description)}</em></p>`)
            }
            if (ytId) {
                if (provider === 'vimeo') {
                    // Vimeo path — thumb URL is per-video (hash-based), so we look
                    // it up via oEmbed (pre-fetched above into vimeoMap). If the
                    // lookup failed, fall back to a text-only link so the feed
                    // never breaks because of a single bad video.
                    const watch = `https://vimeo.com/${escapeXml(ytId)}`
                    const thumb = vimeoMap.get(ytId)?.thumbnail_url || ''
                    const label = isEs ? 'Ver el tráiler en Vimeo' : 'Watch the trailer on Vimeo'
                    if (thumb) {
                        parts.push(
                            `<p><a href="${watch}"><img src="${escapeXml(thumb)}" alt="${escapeXml(title)} — trailer" /></a><br/><a href="${watch}">▶ ${label}</a></p>`
                        )
                    } else {
                        parts.push(`<p><a href="${watch}">▶ ${label}</a></p>`)
                    }
                } else {
                    // YouTube path — unchanged from pre-Vimeo behavior.
                    const watch = `https://www.youtube.com/watch?v=${escapeXml(ytId)}`
                    const thumb = `https://img.youtube.com/vi/${escapeXml(ytId)}/hqdefault.jpg`
                    parts.push(
                        `<p><a href="${watch}"><img src="${thumb}" alt="${escapeXml(title)} — trailer" /></a><br/><a href="${watch}">▶ ${isEs ? 'Ver el tráiler en YouTube' : 'Watch the trailer on YouTube'}</a></p>`
                    )
                }
            }
            if (ytId && showCarousel) {
                // Trailer + carousel: carousel goes mid-body, like the site.
                const { before, after } = splitAtMiddleH2(bodyHtml)
                parts.push(before)
                parts.push(carouselFigure)
                if (after) parts.push(after)
            } else if (showCarousel) {
                // Carousel, no trailer: image sits before the body, like the site.
                parts.push(carouselFigure)
                parts.push(bodyHtml)
            } else {
                parts.push(bodyHtml)
            }
        }
        const contentHtml = parts.filter(Boolean).join('\n')

        let topics: string[] = []
        try {
            const parsed = row.topics_json ? JSON.parse(row.topics_json as string) : []
            if (Array.isArray(parsed)) topics = parsed.map((t: any) => String(t)).filter(Boolean)
        } catch { /* ignore malformed topics */ }

        // Editorial taxonomy: emit primary first with its domain attribute,
        // then any secondaries with the secondary domain, then the free-form
        // topics as plain <category>. Taxonomy stays exposed even on gated
        // items — it's metadata, not body, and helps Feedly filtering. Feed
        // consumers that ignore the domain attribute treat all three layers
        // as plain categories (backward-compatible).
        const primaryCategory = row.editorial_category
            ? String(row.editorial_category).trim().toLowerCase()
            : ''
        let secondaryCategories: string[] = []
        try {
            const parsedSecs = row.secondary_categories_json
                ? JSON.parse(row.secondary_categories_json as string)
                : []
            if (Array.isArray(parsedSecs)) {
                secondaryCategories = parsedSecs
                    .map((s: any) => String(s).trim().toLowerCase())
                    .filter(Boolean)
                    .slice(0, 2)
            }
        } catch { /* ignore malformed secondaries */ }

        const taxonomyLines: string[] = []
        if (primaryCategory) {
            taxonomyLines.push(
                `      <category domain="${CATEGORY_PRIMARY_DOMAIN}">${escapeXml(labelForFeed(primaryCategory, isEs))}</category>`
            )
        }
        for (const sec of secondaryCategories) {
            taxonomyLines.push(
                `      <category domain="${CATEGORY_SECONDARY_DOMAIN}">${escapeXml(labelForFeed(sec, isEs))}</category>`
            )
        }
        for (const t of topics.slice(0, 6)) {
            taxonomyLines.push(`      <category>${escapeXml(t)}</category>`)
        }
        const categories = taxonomyLines.join('\n')

        const media: string[] = []
        if (cover) {
            media.push(`      <enclosure url="${escapeXml(cover)}" type="image/jpeg" length="0"/>`)
            media.push(`      <media:content url="${escapeXml(cover)}" medium="image"/>`)
            media.push(`      <media:thumbnail url="${escapeXml(cover)}"/>`)
        }
        if (!isGated) {
            if (carousel && carousel !== cover) {
                media.push(`      <media:content url="${escapeXml(carousel)}" medium="image"/>`)
            }
            if (ytId) {
                const videoWatchUrl = provider === 'vimeo'
                    ? `https://vimeo.com/${escapeXml(ytId)}`
                    : `https://www.youtube.com/watch?v=${escapeXml(ytId)}`
                media.push(`      <media:content url="${videoWatchUrl}" type="text/html" medium="video"/>`)
            }
        }

        return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${pubDate}</pubDate>
      <dc:creator>Cinemagoria</dc:creator>
${categories ? categories + '\n' : ''}      <description>${escapeXml(description)}</description>
      <content:encoded>${cdata(contentHtml)}</content:encoded>
      <dc:title xml:lang="${altLang}">${escapeXml(altTitle)}</dc:title>
      <dc:description xml:lang="${altLang}">${escapeXml(altDescription)}</dc:description>
${media.length ? media.join('\n') + '\n' : ''}      <atom:link rel="alternate" hreflang="${altLang}" href="${escapeXml(altLink)}"/>
    </item>`
    }).join('\n')

    const channelTitle = isEs ? 'Cinemagoria — Noticias' : 'Cinemagoria News'
    const channelDesc = isEs
        ? 'Noticias editoriales de cine y TV por Cinemagoria.'
        : 'Editorial Film &amp; TV news by Cinemagoria.'
    const channelLang = isEs ? 'es-es' : 'en-us'
    const selfUrl = `${selfBase}/feed`
    const now = new Date().toUTCString()
    const year = new Date().getUTCFullYear()

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:media="http://search.yahoo.com/mrss/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${channelTitle}</title>
    <link>${selfBase}</link>
    <description>${channelDesc}</description>
    <language>${channelLang}</language>
    <copyright>© ${year} Cinemagoria</copyright>
    <generator>Cinemagoria Feed</generator>
    <ttl>60</ttl>
    <lastBuildDate>${now}</lastBuildDate>
    <image>
      <url>${selfBase}/og-image.jpg</url>
      <title>${channelTitle}</title>
      <link>${selfBase}</link>
    </image>
    <atom:link href="${selfUrl}" rel="self" type="application/rss+xml"/>
    <atom:link href="${altBase}/feed" rel="alternate" hreflang="${altLang}" type="application/rss+xml"/>
${items}
  </channel>
</rss>`
}
