const TMDB_BASE = 'https://api.themoviedb.org/3'

export async function fetchTmdbPages(
  endpoint: string,
  apiKey: string,
  startPage: number,
  endPage: number,
  lang: string = 'en-US'
): Promise<number[]> {
  const ids: number[] = []

  const fetches = []
  for (let page = startPage; page <= endPage; page++) {
    fetches.push(
      $fetch<any>(`${TMDB_BASE}${endpoint}`, {
        params: { api_key: apiKey, language: lang, page },
        timeout: 10000,
      }).catch(() => null)
    )
  }

  const results = await Promise.all(fetches)
  for (const data of results) {
    if (data?.results) {
      for (const item of data.results) {
        if (item.id) ids.push(item.id)
      }
    }
  }

  return [...new Set(ids)]
}

export function buildSitemapXml(baseUrl: string, prefix: string, ids: number[], priority: string, changefreq: string): string {
  const today = new Date().toISOString().split('T')[0]
  const urls = ids.map(id => `  <url>
    <loc>${baseUrl}/${prefix}/${id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
}
