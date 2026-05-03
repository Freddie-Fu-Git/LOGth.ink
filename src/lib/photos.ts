import type { ImageMetadata } from 'astro'
import type { PhotoData, Photo, PolaroidVariant } from '~/types'

// Auto-import all images under the photos directory.
const photoModules = import.meta.glob<{ default: ImageMetadata }>('../assets/photos/**/*.{webp,jpg,jpeg,png}', { eager: true })

/**
 * Get a sorted list of photos by directory name.
 * @param dir - Directory name, for example '2025-06-21-cat'
 * @param alt - Image alt text
 * @param variants - Variant for each image, mapped by index
 */
function getPhotos(dir: string, alt: string, variants: PolaroidVariant[]): Photo[] {
  return Object.entries(photoModules)
    .filter(([path]) => path.includes(`/${dir}/`))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, mod], index) => {
      const img = mod.default
      return {
        src: img,
        alt,
        width: img.width,
        height: img.height,
        variant: variants[index] || '4x3',
      }
    })
}

/**
 * Create a remote photo object from a URL (支持图床链接).
 * @param url - Remote image URL (图床链接)
 * @param alt - Image alt text
 * @param variant - Photo aspect ratio variant
 * @param width - Image width (optional, for better layout)
 * @param height - Image height (optional, for better layout)
 * @param location - Shooting location (optional)
 * @param date - Shooting date (optional)
 * @param camera - Camera used (optional)
 * @param description - Photo description (optional)
 */
export function createRemotePhoto(
  url: string,
  alt: string,
  variant: PolaroidVariant = '4x3',
  width?: number,
  height?: number,
  location?: string,
  date?: string,
  camera?: string,
  description?: string
): Photo {
  return {
    src: url,
    alt,
    width: width || 1200,
    height: height || 800,
    variant,
    location,
    date,
    camera,
    description,
  }
}

/**
 * Create multiple remote photos from an array of URLs.
 * @param photos - Array of remote photo configurations
 */
export function createRemotePhotos(
  photos: {
    url: string
    alt: string
    variant?: PolaroidVariant
    width?: number
    height?: number
    location?: string
    date?: string
    camera?: string
    description?: string
  }[]
): Photo[] {
  return photos.map((photo) =>
    createRemotePhoto(
      photo.url,
      photo.alt,
      photo.variant,
      photo.width,
      photo.height,
      photo.location,
      photo.date,
      photo.camera,
      photo.description
    )
  )
}

export const PhotosList: PhotoData[] = [
  {
    title: '威海 · 西霞口神雕山野生动物园',
    icon: { type: 'emoji', value: '🐯' },
    date: '2026-04-29',
    photos: createRemotePhotos([
      { url: 'https://img-1300288738.cos.ap-beijing.myqcloud.com/PicGo_Home/20260503141542725.webp', alt: '老虎01', variant: '4x5' },
      { url: 'https://img-1300288738.cos.ap-beijing.myqcloud.com/PicGo_Home/20260503141542726.webp', alt: '老虎02', variant: '4x5' },
      { url: 'https://img-1300288738.cos.ap-beijing.myqcloud.com/PicGo_Home/20260503141542727.webp', alt: '老虎03', variant: '4x5' },
    ]),
    travel: '威海 · 荣成',
  },
  {
    title: '威海 · 葡萄滩',
    icon: { type: 'emoji', value: '🌇' },
    date: '2026-04-29',
    photos: createRemotePhotos([
      { url: 'https://img-1300288738.cos.ap-beijing.myqcloud.com/PicGo_Home/20260503141542724.webp', alt: '葡萄滩日落', variant: '4x5' },
    ]),
    travel: '威海 · 荣成',
  },
  {
    title: '威海 · 布鲁维斯号',
    icon: { type: 'emoji', value: '🚢' },
    date: '2026-04-29',
    photos: createRemotePhotos([
      { url: 'https://img-1300288738.cos.ap-beijing.myqcloud.com/PicGo_Home/20260503141542723.webp', alt: '布鲁维斯号', variant: '4x5' },
    ]),
    travel: '威海 · 荣成',
  },
  {
    title: '威海 · 海驴岛',
    icon: { type: 'emoji', value: '🐦' },
    date: '2026-04-29',
    photos: createRemotePhotos([
      { url: 'https://img-1300288738.cos.ap-beijing.myqcloud.com/PicGo_Home/20260503141542717.webp', alt: '海鸥01', variant: '4x5' },
      { url: 'https://img-1300288738.cos.ap-beijing.myqcloud.com/PicGo_Home/20260503141542718.webp', alt: '海鸥02', variant: '4x5' },
      { url: 'https://img-1300288738.cos.ap-beijing.myqcloud.com/PicGo_Home/20260503141542719.webp', alt: '海鸥03', variant: '4x5' },
      { url: 'https://img-1300288738.cos.ap-beijing.myqcloud.com/PicGo_Home/20260503141542720.webp', alt: '海鸥04', variant: '4x5' },
      { url: 'https://img-1300288738.cos.ap-beijing.myqcloud.com/PicGo_Home/20260503141542721.webp', alt: '海鸥05', variant: '4x5' },
    ]),
    travel: '威海 · 荣成',
  },
  {
    title: '威海 · 刘公岛',
    icon: { type: 'emoji', value: '🌊' },
    date: '2026-04-28',
    photos: createRemotePhotos([
      { url: 'https://img-1300288738.cos.ap-beijing.myqcloud.com/PicGo_Home/20260503141542716.webp', alt: '刘公岛海景01', variant: '4x5' },
      { url: 'https://img-1300288738.cos.ap-beijing.myqcloud.com/PicGo_Home/20260503141542715.webp', alt: '刘公岛海景02', variant: '4x5' },
    ]),
    travel: '山东 · 威海',
  },
  {
    title: '青岛 · 崂山',
    icon: { type: 'emoji', value: '🌄' },
    date: '2026-04-26',
    photos: createRemotePhotos([
      { url: 'https://img-1300288738.cos.ap-beijing.myqcloud.com/PicGo_Home/20260503141542713.webp', alt: '青山渔村', variant: '4x5' },
    ]),
    travel: '山东 · 青岛',
  },
]
