import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { stripTypeScriptTypes } from 'node:module'
import { test } from 'node:test'
import { runInNewContext } from 'node:vm'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const compile = (source) => stripTypeScriptTypes(source).replace(/^export /gm, '')
const quietConsole = { warn() {} }

test('GitHub returns fetched data even when browser storage is unavailable', async () => {
  const context = {
    console: quietConsole,
    localStorage: { getItem() { return null }, setItem() { throw new Error('QuotaExceededError') } },
    fetch: async () => ({ ok: true, json: async () => ({ followers: 42 }) }),
  }
  runInNewContext(compile(read('src/lib/github.ts')), context)
  assert.equal(await context.getGithubFollowers('example'), 42)
})

test('pinned drafts stay hidden and published posts retain date order and language', async () => {
  const post = (id, lang, draft, pinned, date) => ({ id, data: { lang, draft, pinned, pubDate: new Date(date) } })
  const context = { getCollection: async () => [
    post('draft', 'zh-cn', true, true, '2026-10-05'),
    post('older', 'zh-cn', false, true, '2026-10-01'),
    post('english', 'en', false, true, '2026-10-04'),
    post('latest', 'zh-cn', false, true, '2026-10-03'),
    post('unpinned', 'zh-cn', false, false, '2026-10-04'),
  ] }
  runInNewContext(compile(read('src/lib/data.ts').replace(/^import .*\r?\n/, '')), context)
  assert.deepEqual(Array.from(await context.getPinnedPosts('zh-cn'), (post) => post.id), ['latest', 'older'])
})

class Element extends EventTarget {
  value = ''
  children = []
  style = {}
  classList = { add() {}, remove() {}, contains() { return false } }
  appendChild(child) { this.children.push(child) }
  replaceChildren(fragment) { this.children = [...fragment.children] }
  set innerHTML(value) { this.children = []; this.html = value }
  setAttribute() {}
  focus() {}
}

const flush = () => new Promise((resolve) => setImmediate(resolve))

test('search discards delayed results after a new query or closing the panel', async () => {
  const elements = Object.fromEntries(['search-input', 'search-mask', 'search-switch', 'search-results', 'search-exact'].map((id) => [id, new Element()]))
  const document = new EventTarget()
  document.getElementById = (id) => elements[id]
  document.createElement = document.createDocumentFragment = () => new Element()
  let resolveOld
  let resolveClosing
  const context = {
    document, HTMLInputElement: Element, AbortController, Event, setTimeout, clearTimeout,
    translations: { lang: 'zh-cn' }, localStorage: { getItem() { return null } },
    window: { pagefind: { debouncedSearch: async (query) => ({ results: [{ data: () => {
      if (query === 'old') return new Promise((resolve) => { resolveOld = resolve })
      if (query === 'closing') return new Promise((resolve) => { resolveClosing = resolve })
      return Promise.resolve({ url: '/new', meta: { title: 'new' }, excerpt: 'new' })
    } }] }) } },
  }
  const script = read('src/components/base/SearchSwitch.astro').match(/<script is:inline define:vars=\{\{ translations \}\}>([\s\S]*?)<\/script>/)[1]
  runInNewContext(script, context)
  const input = elements['search-input']
  input.value = 'old'; input.dispatchEvent(new Event('input')); await flush()
  input.value = 'new'; input.dispatchEvent(new Event('input')); await flush()
  resolveOld({ url: '/old', meta: { title: 'old' }, excerpt: 'old' }); await flush()
  assert.deepEqual(elements['search-results'].children.map((child) => child.href), ['/new'])
  input.value = 'closing'; input.dispatchEvent(new Event('input')); await flush()
  const escape = new Event('keydown'); escape.key = 'Escape'; document.dispatchEvent(escape)
  resolveClosing({ url: '/closing', meta: { title: 'closing' }, excerpt: 'closing' }); await flush()
  assert.equal(elements['search-results'].children.length, 0)
  document.dispatchEvent(new Event('astro:before-swap'))
  input.value = 'new'; input.dispatchEvent(new Event('input')); await flush()
  assert.equal(elements['search-results'].children.length, 0)
})

test('progress listeners and pending animation frames are released on navigation', () => {
  const listeners = new Map()
  const window = {
    scrollY: 0, innerHeight: 800,
    addEventListener(type, fn) { listeners.set(type, fn) },
    removeEventListener(type, fn) { if (listeners.get(type) === fn) listeners.delete(type) },
  }
  const ring = { getAttribute: () => '15', style: {} }
  const document = new EventTarget()
  document.querySelectorAll = () => [ring]
  document.documentElement = { scrollHeight: 800 }
  const cancelled = []
  const context = { window, document, requestAnimationFrame: () => 1, cancelAnimationFrame: (id) => cancelled.push(id) }
  const script = read('src/components/posts/toc/SimpleProgressRing.astro').match(/<script>([\s\S]*?)<\/script>/)[1]
  runInNewContext(compile(script), context)
  document.dispatchEvent(new Event('astro:page-load'))
  assert.ok(Number.isFinite(Number(ring.style.strokeDashoffset)))
  listeners.get('scroll')()
  document.dispatchEvent(new Event('astro:before-swap'))
  assert.equal(listeners.size, 0)
  assert.deepEqual(cancelled, [1])
  document.dispatchEvent(new Event('astro:page-load'))
  assert.equal(listeners.size, 2)
})
