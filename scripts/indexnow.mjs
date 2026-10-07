import { readFile } from 'node:fs/promises'

// Run after production deployment, never as part of a preview build.
const site = 'https://www.logth.ink'
const key = (await readFile('public/indexnow-key.txt', 'utf8')).trim()
const sitemap = await readFile('dist/sitemap-0.xml', 'utf8')
const urlList = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])
if (!urlList.length || urlList.some((url) => new URL(url).origin !== site)) {
  throw new Error('Build a valid production sitemap before submitting.')
}
const payload = { host: new URL(site).host, key, keyLocation: `${site}/indexnow-key.txt`, urlList }
if (process.argv.includes('--dry-run')) {
  console.log(`IndexNow: ${urlList.length} canonical URLs ready; no request sent.`)
} else {
  const proof = await fetch(payload.keyLocation)
  if (!proof.ok || (await proof.text()).trim() !== key) throw new Error('Production key file is not deployed.')
  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (![200, 202].includes(response.status)) throw new Error(`IndexNow returned ${response.status}: ${await response.text()}`)
  console.log(`IndexNow received ${urlList.length} URLs (HTTP ${response.status}); indexing is not guaranteed.`)
}
