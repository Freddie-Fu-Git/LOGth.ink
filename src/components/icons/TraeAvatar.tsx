type Props = {
  size?: number
  className?: string
}

export default function TraeAvatar({ size = 20, className }: Props) {
  const iconSize = Math.round(size * 0.62)
  const classes = ['inline-flex items-center justify-center rounded-full', className].filter(Boolean).join(' ')

  return (
    <span className={classes} style={{ width: size, height: size }}>
      <img
        src="https://unpkg.com/@lobehub/icons-static-svg@latest/icons/trae-color.svg"
        alt=""
        width={iconSize}
        height={iconSize}
        loading="lazy"
        decoding="async"
      />
    </span>
  )
}
