import { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import { Maximize2 } from "lucide-react"
import type { Skill } from "@/features/skill/domain/skill"
import { formatImage } from "@/lib/format-image"
import { cn } from "@/lib/utils"

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="mb-4 w-full text-center text-3xl text-[#ff6d0a]">{children}</h2>
}

/** Photo de profil avec ses pastilles décoratives orange. */
export function DecoratedAvatar({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative shrink-0">
      <img
        src={src}
        alt={alt}
        width={200}
        height={200}
        className="z-10 mx-auto h-48 w-48 rounded-full border-4 border-orange-200 object-cover shadow-2xl"
      />
      <div className="absolute -bottom-10 left-0 z-0 h-10 w-10 animate-pulse rounded-full bg-orange-400 opacity-20" />
      <div className="absolute -right-2 -bottom-2 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-orange-400">
        <div className="h-3 w-3 rounded-full bg-white" />
      </div>
      <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-4 border-orange-400 bg-white" />
      <div className="absolute -top-3 left-1/4 h-2 w-2 animate-ping rounded-full bg-orange-500" />
    </div>
  )
}

export function Card({ children }: { children: ReactNode }) {
  const [isHover, setIsHover] = useState(false)

  return (
    <div
      className="relative m-4 flex w-80 cursor-pointer flex-col rounded-[1rem] bg-[#fffbf9] p-4 shadow-2xl shadow-gray-300 dark:bg-[#1b1b1b] dark:shadow-transparent"
      onMouseOver={() => setIsHover(true)}
      onMouseOut={() => setIsHover(false)}
    >
      {children}
      <div
        className={`absolute right-2 bottom-2 flex items-center justify-center rounded-[0.75rem] p-2 text-sm ${
          isHover
            ? "top-0 right-0 bottom-0 left-0 h-full w-full bg-[#F54703]/40 text-[#fffbf9] dark:text-[#1b1b1b]"
            : "text-[#1b1b1b] dark:text-[#fffbf9]"
        }`}
      >
        <Maximize2 size={isHover ? 60 : 24} className="transition-all duration-500 ease-in-out" />
      </div>
    </div>
  )
}

export function CardH1({ children }: { children: ReactNode }) {
  return <h3 className="mt-2 text-2xl font-normal text-[#101827] dark:text-[#fffbf9]">{children}</h3>
}

export function CardP({ children }: { children: ReactNode }) {
  return <p className="mt-6 mb-6 line-clamp-2 text-base text-[#b1b1b1]">{children}</p>
}

export function CardBadges({ children }: { children: ReactNode }) {
  return <div className="mb-4 flex flex-wrap">{children}</div>
}

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="mr-2 mb-2 rounded-full bg-[#F54703] px-4 py-1 text-sm text-[#fffbf9] dark:text-[#2f2f2f]">
      {children}
    </span>
  )
}

/** Délai d'apparition de chaque compétence : ~3 s au total, comme sur le portfolio d'origine. */
const getRevealDelay = (index: number, total: number): number => {
  const step = total > 1 ? Math.min(0.5, 2.5 / (total - 1)) : 0
  return (0.5 + index * step) * 1000
}

export function Skills({ tools }: { tools: Skill[] }) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = sectionRef.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: "-100px" },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isInView) return
    const timers = tools.map((_, index) =>
      setTimeout(() => setVisibleCount((count) => Math.max(count, index + 1)), getRevealDelay(index, tools.length)),
    )
    return () => timers.forEach(clearTimeout)
  }, [isInView, tools])

  return (
    <div className="relative" ref={sectionRef}>
      <div className="sticky top-8">
        <div className="grid grid-cols-3 gap-4">
          {tools.map((tool, index) => {
            const isVisible = index < visibleCount
            return (
              <div
                key={tool.id}
                className={cn(
                  "group transition-[opacity,transform] duration-600 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                  isVisible ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-180 opacity-0",
                )}
              >
                <div className="rounded-[0.75rem] bg-white p-4 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-[#1b1b1b]">
                  <div className="text-center">
                    <div className="relative mx-auto mb-2 h-12 w-12 transition-transform duration-300 group-hover:scale-110">
                      <img
                        src={formatImage(tool.picto)}
                        alt={`Logo ${tool.name}`}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-contain filter transition-all duration-300 group-hover:brightness-110"
                      />
                    </div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{tool.name}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
