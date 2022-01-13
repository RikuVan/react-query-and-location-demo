import './loading.css'

export type Props = {
  /** hex color */
  color?: string
  /** size in pixel */
  size?: number
} & React.HTMLAttributes<HTMLDivElement>

export function Loading({ color = 'var(--links)', size = 80, className, style, ...rest }: Props) {
  const circles = [...Array(4)].map((_, index) => (
    <div key={index} style={{ background: `${color}` }} />
  ))

  return (
    <div className="lds-ellipsis" style={{ ...style, width: size, height: size }} {...rest}>
      {circles}
    </div>
  )
}
