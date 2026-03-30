'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Tooltip, { TooltipProvider } from './Tooltip.tsx'
import { cn } from '~/lib/utils'

export type WordHeatmapDay = {
  date: string
  words: number
  level: 0 | 1 | 2 | 3 | 4
}

const LIGHT_CELL_COLORS = {
  0: '#e5e5e7',
  1: '#B7B7BD',
  2: '#9696A0',
  3: '#636370',
  4: '#18181B',
} as const

const DARK_CELL_COLORS = {
  0: '#18181b',
  1: '#353539',
  2: '#515158',
  3: '#6d6d77',
  4: '#f7f7f7',
} as const

type Props = {
  wordByDate: Record<string, number>
  lang: 'en' | 'zh-cn'
  tooltipEnabled: boolean
}

const toISODateInTimeZone = (d: Date, timeZone: string) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(d)

  const y = parts.find((p) => p.type === 'year')?.value
  const m = parts.find((p) => p.type === 'month')?.value
  const day = parts.find((p) => p.type === 'day')?.value
  return `${y}-${m}-${day}`
}

const addDaysUTC = (d: Date, days: number) => {
  const nd = new Date(d)
  nd.setUTCDate(nd.getUTCDate() + days)
  return nd
}

const isoDaysRangeUTCNoon = (endISO: string, count: number) => {
  const end = new Date(`${endISO}T12:00:00Z`)
  const start = addDaysUTC(end, -(count - 1))
  const days: string[] = []
  for (let d = start; d <= end; d = addDaysUTC(d, 1)) {
    days.push(d.toISOString().slice(0, 10))
  }
  return days
}

export default function WordHeatmap({ wordByDate, lang, tooltipEnabled }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDark, setIsDark] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [todayISO, setTodayISO] = useState<string>('')

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth
    }
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const timeZone = 'Asia/Shanghai'
    const update = () => setTodayISO(toISODateInTimeZone(new Date(), timeZone))
    update()
    const id = window.setInterval(update, 60_000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    const el = document.documentElement
    const update = () => setIsDark(el.classList.contains('dark'))
    update()
    const mo = new MutationObserver(update)
    mo.observe(el, { attributes: true, attributeFilter: ['class'] })
    return () => mo.disconnect()
  }, [])

  const visibleDays = useMemo(() => {
    if (!todayISO) return []
    const visibleCount = isMobile ? 90 : 365
    const dates = isoDaysRangeUTCNoon(todayISO, visibleCount)

    const raw = dates.map((date) => ({ date, words: wordByDate[date] || 0 }))
    const maxWords = raw.reduce((m, x) => Math.max(m, x.words), 0)
    const levelFor = (words: number): 0 | 1 | 2 | 3 | 4 => {
      if (words <= 0 || maxWords <= 0) return 0
      const p = words / maxWords
      if (p <= 0.25) return 1
      if (p <= 0.5) return 2
      if (p <= 0.75) return 3
      return 4
    }

    const sliced: WordHeatmapDay[] = raw.map((d) => ({ ...d, level: levelFor(d.words) }))

    const first = new Date(`${sliced[0].date}T00:00:00`)
    const last = new Date(`${sliced[sliced.length - 1].date}T00:00:00`)
    const startPad = first.getDay()
    const endPad = 6 - last.getDay()

    const padded: WordHeatmapDay[] = []
    for (let i = startPad; i > 0; i--) padded.push({ date: '', words: 0, level: 0 })
    padded.push(...sliced)
    for (let i = 1; i <= endPad; i++) padded.push({ date: '', words: 0, level: 0 })

    return padded
  }, [isMobile, todayISO, wordByDate])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth
    }
  }, [isMobile, todayISO])

  const weeks = useMemo(() => {
    const acc: WordHeatmapDay[][] = []
    for (let i = 0; i < visibleDays.length; i++) {
      const weekIndex = Math.floor(i / 7)
      if (!acc[weekIndex]) acc[weekIndex] = []
      acc[weekIndex].push(visibleDays[i])
    }
    return acc
  }, [visibleDays])

  return (
    <TooltipProvider>
      <div ref={containerRef} className="grid grid-flow-col gap-1 overflow-x-auto py-2 px-2 max-md:px-0 scroll-smooth">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-rows-7 gap-1">
            {week.map((d, dayIndex) => {
              if (!d.date) {
                return <div key={dayIndex} className="size-2 rounded-[1px] bg-transparent" />
              }

              const dateObj = new Date(`${d.date}T00:00:00`)
              const formattedDate =
                lang === 'zh-cn'
                  ? `${d.date.replaceAll('-', '.')}，${dateObj.toLocaleDateString('zh-CN', { weekday: 'long' })}`
                  : dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })

              const tooltipContent =
                lang === 'zh-cn'
                  ? `${formattedDate} - ${d.words}字`
                  : `${formattedDate} — ${d.words} words`

              const fill = (isDark ? DARK_CELL_COLORS : LIGHT_CELL_COLORS)[d.level]

              return (
                <Tooltip key={dayIndex} content={tooltipContent} disabled={!tooltipEnabled}>
                  <div
                    className={cn('size-2 relative transition-colors duration-300 rounded-[1px]')}
                    style={{ backgroundColor: fill }}
                  />
                </Tooltip>
              )
            })}
          </div>
        ))}
      </div>
    </TooltipProvider>
  )
}
