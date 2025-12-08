import React from 'react'

interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  title: string
}

export default function Tooltip({ children, title, ...rest }: TooltipProps) {
  return (
    <div className="tooltip" {...rest}>
      {children}
      <span className="tooltiptext">{title}</span>
    </div>
  )
}
