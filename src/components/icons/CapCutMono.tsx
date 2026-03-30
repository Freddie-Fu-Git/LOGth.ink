type Props = {
  size?: number
  className?: string
}

export default function CapCutMono({ size = 20, className }: Props) {
  const iconSize = Math.round(size * 0.62)
  const classes = ['inline-flex items-center justify-center', className].filter(Boolean).join(' ')

  return (
    <span className={classes} style={{ width: size, height: size }}>
      <img
        src="https://unpkg.com/@lobehub/icons-static-png@latest/light/capcut.png"
        alt=""
        className="dark:hidden"
        width={iconSize}
        height={iconSize}
        loading="lazy"
        decoding="async"
      />
      <img
        src="https://unpkg.com/@lobehub/icons-static-png@latest/dark/capcut.png"
        alt=""
        className="hidden dark:block"
        width={iconSize}
        height={iconSize}
        loading="lazy"
        decoding="async"
      />
    </span>
  )
}
