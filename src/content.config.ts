import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'
import { POSTS_CONFIG } from '~/config'
import { generateSlug } from '~/lib/utils'
import type { CoverLayout, PostType } from '~/types'

const posts = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/posts',
    generateId: ({ entry }) => {
      // 这里的 entry 是文件路径
      // 我们去除扩展名并去除末尾的 /index
      const baseId = entry.replace(/\.(md|mdx)$/, '').replace(/\/index$/, '')

      // 使用这个 baseId 作为原始字节流生成 8 位 slug
      return generateSlug(baseId)
    },
  }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        description: z.string(),
        pubDate: z.date(),
        tags: z.array(z.string()).optional(),
        updatedDate: z.date().optional(),
        author: z.string().default(POSTS_CONFIG.author),
        cover: image().optional(),
        ogImage: image().optional(),
        recommend: z.boolean().default(false),
        postType: z.custom<PostType>().optional(),
        coverLayout: z.custom<CoverLayout>().optional(),
        pinned: z.boolean().default(false),
        draft: z.boolean().default(false),
        license: z.string().optional(),
        lang: z.enum(['en', 'zh-cn']).default('en'),
      })
      .transform((data) => ({
        ...data,
        ogImage: POSTS_CONFIG.ogImageUseCover && data.cover ? data.cover : data.ogImage,
      })),
})

const projects = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/projects',
  }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      description: z.string(),
      githubUrl: z.string(),
      website: z.string(),
      type: z.string(),
      icon: image().optional(),
      imageClass: z.string().optional(),
      star: z.number(),
      fork: z.number(),
      updatedDate: z.coerce.date().optional(),
      draft: z.boolean().default(false),
      lang: z.enum(['en', 'zh-cn']).default('en'),
    }),
})

const steamProjects = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/steam-projects',
  }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      description: z.string(),
      steamUrl: z.string(),
      cover: z.union([image(), z.string().url()]),
      updatedDate: z.coerce.date().optional(),
      draft: z.boolean().default(false),
      lang: z.enum(['en', 'zh-cn']).default('en'),
    }),
})

export const collections = { posts, projects, steamProjects }
