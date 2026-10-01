/**
 * Compresses text responses (SSR HTML, RSS, string JSON) before they leave the origin.
 *
 * Why: Cloud Run bills outbound data per GB and Nitro's node-server sends every
 * response uncompressed. Cloudflare compresses for visitors, but only after the
 * full-size transfer from Cloud Run has been billed: a /person page is ~338 KB raw
 * vs ~96 KB compressed. Outbound data was most of the September bill.
 *
 * Plain objects/arrays are serialized here the same way h3 would do it after this
 * hook (/api/news alone is ~650 KB of JSON). Streams, web Responses and other
 * bodies are left alone.
 */
import { promisify } from 'node:util'
import { brotliCompress, constants, gzip } from 'node:zlib'

const brotli = promisify(brotliCompress)
const gzipAsync = promisify(gzip)

const COMPRESSIBLE_TYPE = /^(text\/|application\/(json|xml|rss\+xml|atom\+xml|javascript))/i
const MIN_BYTES = 1024

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('beforeResponse', async (event, response) => {
    const req = event.node.req
    const res = event.node.res
    if (req.method === 'HEAD' || res.getHeader('Content-Encoding')) return

    let body = response.body
    if (Array.isArray(body) || body?.constructor === Object) {
      body = JSON.stringify(body)
      if (!res.getHeader('Content-Type')) res.setHeader('Content-Type', 'application/json')
    }
    if (typeof body !== 'string' && !Buffer.isBuffer(body)) return
    if (Buffer.byteLength(body) < MIN_BYTES) return

    // h3 defaults string bodies to HTML only after this hook; a compressed Buffer
    // would otherwise be served as application/octet-stream.
    if (!res.getHeader('Content-Type')) res.setHeader('Content-Type', 'text/html; charset=utf-8')
    if (!COMPRESSIBLE_TYPE.test(String(res.getHeader('Content-Type')))) return

    const accept = String(req.headers['accept-encoding'] || '')
    const encoding = /\bbr\b/.test(accept) ? 'br' : /\bgzip\b/.test(accept) ? 'gzip' : null
    if (!encoding) return

    response.body = encoding === 'br'
      ? await brotli(body, { params: { [constants.BROTLI_PARAM_QUALITY]: 4 } })
      : await gzipAsync(body)

    res.setHeader('Content-Encoding', encoding)
    res.removeHeader('Content-Length')
    const vary = res.getHeader('Vary')
    if (!vary) res.setHeader('Vary', 'Accept-Encoding')
    else if (!/accept-encoding/i.test(String(vary))) res.setHeader('Vary', `${vary}, Accept-Encoding`)
  })
})
