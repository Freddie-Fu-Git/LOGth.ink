import crypto from 'node:crypto'
import type { CollectionEntry } from 'astro:content'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(classes))
}

/**
 * 基于自定义 Base58 字母表和 MD5 生成文章 slug
 * 字母表移除了易混淆字符：0, O, o, I, l, 1
 * @param input 原始输入（字符串或 Buffer）
 * @returns 8位 slug
 */
export function generateSlug(input: string | Buffer): string {
  // 自定义字母表（移除了 0, O, o, I, l, 1）
  const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz'
  const BASE = BigInt(ALPHABET.length)

  // 1. 计算 MD5 哈希
  const hash = crypto.createHash('md5').update(input).digest()

  // 2. 将哈希转换为 BigInt 以进行 Base58 编码
  let num = BigInt('0x' + hash.toString('hex'))

  // 3. 执行 Base58 编码
  let encoded = ''
  while (num > 0n) {
    const remainder = Number(num % BASE)
    encoded = ALPHABET[remainder] + encoded
    num = num / BASE
  }

  // 4. 利用哈希值决定截取位置
  // 使用哈希的第一个字节来决定偏移量
  // 偏移量 = hash[0] % (encoded.length - 8)
  const startIndex = hash[0] % (encoded.length - 8)

  // 5. 截取 8 个字符
  return encoded.substring(startIndex, startIndex + 8)
}

// 文章按时间排序
export function postsSort(posts: CollectionEntry<'posts'>[]) {
  return posts.slice().sort((a, b) => {
    const dateA = a.data.updatedDate ?? a.data.pubDate
    const dateB = b.data.updatedDate ?? b.data.pubDate
    return new Date(dateB).getTime() - new Date(dateA).getTime()
  })
}

// 日期格式化类型
export type DateFormat = 'default' | 'dot' | 'short' | 'iso' | 'chinese'

// 日期格式化函数
export const formatDate = (date: Date, format: DateFormat = 'default'): string => {
  switch (format) {
    case 'dot':
      // 2020.03.03 格式
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}.${month}.${day}`

    case 'short':
      // Mar 3, 2020 格式
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })

    case 'iso':
      // 2020-03-03 格式
      return date.toISOString().split('T')[0]

    case 'chinese':
      // 2020年3月3日 格式
      const chineseYear = date.getFullYear()
      const chineseMonth = date.getMonth() + 1
      const chineseDay = date.getDate()
      return `${chineseYear}年${chineseMonth}月${chineseDay}日`

    case 'default':
    default:
      // March 3, 2020 格式（默认）
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
  }
}
