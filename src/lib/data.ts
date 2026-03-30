import { getCollection, type CollectionEntry } from 'astro:content'

// 文章按时间排序
export function postsSort(posts: CollectionEntry<'posts'>[]) {
  return posts.slice().sort((a, b) => {
    const dateA = a.data.updatedDate ?? a.data.pubDate
    const dateB = b.data.updatedDate ?? b.data.pubDate
    return new Date(dateB).getTime() - new Date(dateA).getTime()
  })
}

// 获取所有非草稿文章，按时间排序
export async function getAllPosts(lang?: string): Promise<CollectionEntry<'posts'>[]> {
  const allPosts = await getCollection('posts')
  const filteredPosts = allPosts.filter((post) => {
    const isNotDraft = !post.data.draft
    const matchesLang = !lang || post.data.lang === lang
    return isNotDraft && matchesLang
  })
  return postsSort(filteredPosts)
}

// 获取所有置顶文章
export async function getPinnedPosts(lang?: string): Promise<CollectionEntry<'posts'>[]> {
  const allPosts = await getCollection('posts')
  const pinnedPosts = allPosts.filter((post) => {
    const isPinned = post.data.pinned
    const matchesLang = !lang || post.data.lang === lang
    return isPinned && matchesLang
  })
  return postsSort(pinnedPosts)
}

// 获取最新的固定数量的文章
export async function getNumPosts(size: number, lang?: string): Promise<CollectionEntry<'posts'>[]> {
  const allPosts = await getCollection('posts')
  const filteredPosts = allPosts.filter((post) => {
    const isNotDraft = !post.data.draft
    const matchesLang = !lang || post.data.lang === lang
    return isNotDraft && matchesLang
  })
  return postsSort(filteredPosts).slice(0, size)
}

// 获取标签
export async function getAllTags(lang?: string): Promise<Record<string, number>> {
  const allPosts = await getAllPosts(lang)
  const tags = allPosts.flatMap((post) => post.data.tags || [])
  return tags.reduce(
    (acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )
}

// 获取project
export async function getAllProjects(lang?: string): Promise<CollectionEntry<'projects'>[]> {
  const allProjects = await getCollection('projects')
  const filteredProjects = allProjects.filter((project) => {
    const isNotDraft = !project.data.draft
    const matchesLang = !lang || project.data.lang === lang
    return isNotDraft && matchesLang
  })
  return filteredProjects.slice().sort((a, b) => {
    const dateA = a.data.updatedDate?.getTime() ?? 0
    const dateB = b.data.updatedDate?.getTime() ?? 0
    if (dateA !== dateB) return dateB - dateA
    return a.data.name.localeCompare(b.data.name)
  })
}

export async function getAllSteamProjects(lang?: string): Promise<CollectionEntry<'steamProjects'>[]> {
  const allProjects = await getCollection('steamProjects')
  const filteredProjects = allProjects.filter((project) => {
    const isNotDraft = !project.data.draft
    const matchesLang = !lang || project.data.lang === lang
    return isNotDraft && matchesLang
  })
  return filteredProjects.slice().sort((a, b) => {
    const dateA = a.data.updatedDate?.getTime() ?? 0
    const dateB = b.data.updatedDate?.getTime() ?? 0
    if (dateA !== dateB) return dateB - dateA
    return a.data.name.localeCompare(b.data.name)
  })
}
