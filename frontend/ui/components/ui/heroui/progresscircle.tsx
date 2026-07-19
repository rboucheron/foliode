"use client"

import { ProgressCircle } from "@heroui/react"
import type { ComponentProps, ReactNode } from "react"

type HeroColor = "accent" | "default" | "success" | "warning" | "danger"
type HeroSize = "sm" | "md" | "lg"

export interface HerouiProgressCircleProps
  extends Omit<ComponentProps<typeof ProgressCircle>, "children" | "color"> {
  value?: number
  color?: HeroColor
  size?: HeroSize
  showValueLabel?: boolean
  children?: ReactNode
  label?: string
}

export function HerouiProgressCircle({
  value,
  color = "accent",
  size = "md",
  showValueLabel = false,
  children,
  label = "Progression",
  ...props
}: HerouiProgressCircleProps) {
  const isIndeterminate = value === undefined
  const centerContent =
    children ?? (showValueLabel && !isIndeterminate ? `${Math.round(value)}%` : null)

  return (
    <div className="relative inline-flex items-center justify-center">
      <ProgressCircle aria-label={label} value={value} color={color} size={size} {...props}>
        <ProgressCircle.Track>
          <ProgressCircle.TrackCircle />
          <ProgressCircle.FillCircle />
        </ProgressCircle.Track>
      </ProgressCircle>

      {centerContent !== null && (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs font-medium tabular-nums text-foreground">
          {centerContent}
        </span>
      )}
    </div>
  )
}
