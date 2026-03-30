type Props = {
  size?: number
  className?: string
}

export default function CapCutAvatar({ size = 20, className }: Props) {
  const iconSize = Math.round(size * 0.62)
  const classes = ['inline-flex items-center justify-center rounded-full bg-black dark:bg-white', className]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classes} style={{ width: size, height: size }}>
      <picture>
        <source media="(prefers-color-scheme: dark)" srcSet="https://unpkg.com/@lobehub/icons-static-png@latest/dark/capcut.png" />
        <img
          src="https://unpkg.com/@lobehub/icons-static-png@latest/light/capcut.png"
          alt=""
          width={iconSize}
          height={iconSize}
          loading="lazy"
          decoding="async"
        />
      </picture>
    </span>
  )
}
