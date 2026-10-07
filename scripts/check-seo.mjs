import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  return (
    await Promise.all(entries.map((entry) => (entry.isDirectory() ? files(join(directory, entry.name)) : [join(directory, entry.name)])))
  ).flat()
}
const failures = []
let pages = 0,
  articles = 0
for (const file of (await files('dist')).filter((file) => file.endsWith('.html'))) {
  const html = await readFile(file, 'utf8')
  if (file.endsWith('404.html')) {
    if (!html.includes('noindex, follow')) failures.push(`${file}: 404 must be noindex`)
    continue
  }
  pages++
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1]
  if (!canonical?.startsWith('https://www.logth.ink/') || !canonical.endsWith('/')) failures.push(`${file}: canonical`)
  if (!html.match(/<meta name="description" content="[^"]+"/)) failures.push(`${file}: description`)
  for (const match of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)) {
    const data = JSON.parse(match[1])
    if (data['@type'] === 'BlogPosting') {
      articles++
      if (data.url !== canonical || !data.headline || !data.author?.name || !Number.isFinite(Date.parse(data.datePublished)))
        failures.push(`${file}: article schema`)
      if (data.image.some((url) => !url.startsWith('https://') || url.includes('//_astro'))) failures.push(`${file}: article image`)
    }
  }
}
const sitemap = await readFile('dist/sitemap-0.xml', 'utf8')
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])
if (urls.length !== pages || urls.some((url) => !url.endsWith('/')))
  failures.push('Sitemap must contain all indexable pages with canonical trailing slashes')
if (!articles) failures.push('Missing article structured data')
if (failures.length) throw new Error(failures.join('\n'))
console.log(`SEO checks passed: ${pages} pages, ${articles} articles, ${urls.length} sitemap URLs.`)
