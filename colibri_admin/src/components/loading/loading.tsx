import './loading.css'
type LoadingProps = {
  color?: string
  width?: string
  height?: string
}
export default function Loading({ color = '#fff', width = '15px', height = '15px' }: LoadingProps) {
  return (
    <div
      style={{
        border: `3px solid ${color}`,
        height: `${height}`,
        width: `${width}`,
      }}
      className="loader dark:border-gray-600"
    ></div>
  )
}
