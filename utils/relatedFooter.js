// Markdown footer marker. Matches "\n***\n### Related Articles" and the
// Spanish variant "Artículos Relacionados" (accent tolerant).
const MARKDOWN_RELATED_FOOTER_RE =
  /\n\*\*\*\s*\n\s*###\s+(?:Related\s+Articles|Art[ií]culos\s+Relacionados)\b/i

// Legacy HTML form produced by the old engage helper:
// <hr><p><strong>Related Articles…</strong></p><ul>…</ul>
const RELATED_BLOCK_RE =
  /\n*<hr\s*\/?>\s*<p>\s*<strong>\s*(?:Related Articles|Art[ií]culos Relacionados)\s*:?\s*<\/strong>\s*<\/p>\s*<ul>([\s\S]*?)<\/ul>\s*$/i

function findMdFooterStartIdx(body) {
  if (!body) return -1
  const rx = new RegExp(MARKDOWN_RELATED_FOOTER_RE.source, 'gi')
  let lastIdx = -1
  let m
  while ((m = rx.exec(body)) !== null) lastIdx = m.index
  return lastIdx
}

export function stripRelatedFooter(body) {
  if (!body) return ''
  const mdIdx = findMdFooterStartIdx(body)
  if (mdIdx >= 0) return body.substring(0, mdIdx).trimEnd()
  const htmlM = body.match(RELATED_BLOCK_RE)
  if (htmlM && htmlM.index !== undefined) {
    return body.substring(0, htmlM.index).trimEnd()
  }
  return body
}

export function extractRelatedSlugs(body) {
  if (!body) return []
  let section = ''
  const mdIdx = findMdFooterStartIdx(body)
  if (mdIdx >= 0) {
    section = body.substring(mdIdx)
  } else {
    const htmlM = body.match(RELATED_BLOCK_RE)
    if (htmlM && htmlM.index !== undefined) section = body.substring(htmlM.index)
  }
  if (!section) return []
  const slugs = []
  const linkRx = /(?:href="|\]\()https?:\/\/(?:es\.)?cinemagoria\.com\/news\/([^")\s]+)/g
  let m
  while ((m = linkRx.exec(section)) !== null) slugs.push(m[1])
  return [...new Set(slugs)]
}
