import { useEffect, useMemo, useState } from "react"
import { Link } from "@tanstack/react-router"
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react"
import { HiHome } from "react-icons/hi2"
import type { ProjectImage } from "@/features/project"
import { formatImage } from "@/lib/format-image"
import { useSunsetI18n } from "./sunset/sunset-i18n"
import { SunsetLayout } from "./sunset/sunset-layout"
import type { ProjectPageProps } from "./types"

export function SunsetProjectPage({ portfolio, project }: ProjectPageProps) {
  return (
    <SunsetLayout portfolio={portfolio}>
      <SunsetProjectContent portfolio={portfolio} project={project} />
    </SunsetLayout>
  )
}

interface TocItem {
  id: string
  text: string
  level: number
}

const toParagraphs = (text: string): string[] =>
  text
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

const H1_CLASS =
  "text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-orange-50 border-b-2 border-gray-200 pb-2 scroll-mt-24"
const H2_CLASS = "text-2xl font-semibold mt-6 mb-3 text-gray-800 dark:text-gray-50 scroll-mt-24"
const P_CLASS = "mb-4 text-gray-700 dark:text-gray-50 leading-relaxed"
const A_CLASS = "text-blue-600 hover:text-blue-800 underline transition-colors"

function SunsetProjectContent({ portfolio, project }: ProjectPageProps) {
  const { t } = useSunsetI18n()
  const images = project.projectsImages ?? []
  const links = project.projectsLinks ?? []

  const headings = useMemo<TocItem[]>(
    () => [
      { id: "project-title", text: project.title, level: 1 },
      { id: "description", text: t.project.description, level: 2 },
      ...(images.length > 0 ? [{ id: "images", text: t.project.images, level: 2 }] : []),
      ...(links.length > 0 ? [{ id: "links", text: t.project.links, level: 2 }] : []),
    ],
    [project.title, t, images.length, links.length],
  )

  return (
    <div className="mx-auto mt-9 w-full max-w-7xl px-4">
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="lg:w-64 lg:shrink-0">
          <div className="lg:sticky lg:top-32">
            <nav aria-label="breadcrumb" className="mb-2">
              <ol className="flex flex-wrap items-center gap-1.5 text-sm break-words text-gray-500 sm:gap-2.5 dark:text-gray-400">
                <li className="inline-flex items-center gap-1.5">
                  <Link
                    to="/$username"
                    params={{ username: portfolio.url }}
                    aria-label={t.project.back}
                    className="transition-colors hover:text-gray-900 dark:hover:text-gray-50"
                  >
                    <HiHome className="h-4 w-4" />
                  </Link>
                </li>
                <li role="presentation" aria-hidden="true" className="[&>svg]:size-3.5">
                  <ChevronRight />
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <span aria-current="page" className="font-normal text-gray-900 dark:text-gray-50">
                    {project.title}
                  </span>
                </li>
              </ol>
            </nav>
            <TableOfContents headings={headings} />
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <article className="max-w-none text-lg">
            <h1 id="project-title" className={H1_CLASS}>
              {project.title}
            </h1>

            <h2 id="description" className={H2_CLASS}>
              {t.project.description}
            </h2>
            {toParagraphs(project.description).map((paragraph, index) => (
              <p key={index} className={P_CLASS}>
                {paragraph}
              </p>
            ))}

            {images.length > 0 && (
              <>
                <h2 id="images" className={H2_CLASS}>
                  {t.project.images}
                </h2>
                <ProjectImages images={images} title={project.title} />
              </>
            )}

            {links.length > 0 && (
              <>
                <h2 id="links" className={H2_CLASS}>
                  {t.project.links}
                </h2>
                <ul className="mb-4 list-inside list-disc space-y-1">
                  {links.map((link, index) => (
                    <li key={`${link.url}-${index}`} className="text-gray-700 dark:text-gray-50">
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className={A_CLASS}>
                        {link.name || link.url}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </article>
        </main>
      </div>
    </div>
  )
}

function TableOfContents({ headings }: { headings: TocItem[] }) {
  const [activeId, setActiveId] = useState("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: "-120px 0% -35% 0%", threshold: 0 },
    )
    headings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })
    return () => observer.disconnect()
  }, [headings])

  const handleClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  if (headings.length === 0) return null

  const indent: Record<number, string> = { 2: "ml-2", 3: "ml-4", 4: "ml-6", 5: "ml-8", 6: "ml-10" }

  return (
    <nav className="rounded-lg p-4">
      <ul className="space-y-1">
        {headings.map(({ id, text, level }) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => handleClick(id)}
              className={`block w-full rounded-sm px-2 py-1 text-left text-sm transition-colors hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-700 dark:hover:text-orange-50 ${
                activeId === id
                  ? "border-l-2 border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                  : "text-gray-600 dark:text-gray-300"
              } ${level === 1 ? "font-semibold" : ""} ${indent[level] ?? ""}`}
            >
              {text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function ProjectImages({ images, title }: { images: ProjectImage[]; title: string }) {
  const { t } = useSunsetI18n()
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const preview = images.slice(0, 2)

  useEffect(() => {
    if (openIndex === null) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenIndex(null)
      if (event.key === "ArrowRight") setOpenIndex((index) => (index === null ? index : (index + 1) % images.length))
      if (event.key === "ArrowLeft")
        setOpenIndex((index) => (index === null ? index : (index - 1 + images.length) % images.length))
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [openIndex, images.length])

  const altOf = (image: ProjectImage, index: number) => image.img_alt || `${title} ${index + 1}`
  const current = openIndex === null ? null : images[openIndex]

  return (
    <>
      <div className={`mt-5 grid w-full grid-cols-1 gap-4 ${preview.length > 1 ? "lg:grid-cols-2" : ""}`}>
        {preview.map((image, index) => (
          <button key={image.id ?? index} type="button" onClick={() => setOpenIndex(index)}>
            <img
              src={formatImage(image.img_src)}
              alt={altOf(image, index)}
              loading="lazy"
              className="h-full w-full cursor-pointer rounded-xs object-cover"
            />
          </button>
        ))}
      </div>

      {current && openIndex !== null && (
        <div
          className="fixed top-0 left-0 z-50 h-screen w-full bg-black/60 dark:bg-white/25"
          onClick={() => setOpenIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <div onClick={(event) => event.stopPropagation()} className="relative m-auto my-36 w-3/4 lg:w-1/2">
            <img src={formatImage(current.img_src)} alt={altOf(current, openIndex)} className="w-full" />
            {images.length > 1 && (
              <>
                <CarouselButton
                  label={t.project.previous}
                  className="top-1/2 -left-12 -translate-y-1/2"
                  onClick={() => setOpenIndex((openIndex - 1 + images.length) % images.length)}
                >
                  <ArrowLeft className="h-4 w-4" />
                </CarouselButton>
                <CarouselButton
                  label={t.project.next}
                  className="top-1/2 -right-12 -translate-y-1/2"
                  onClick={() => setOpenIndex((openIndex + 1) % images.length)}
                >
                  <ArrowRight className="h-4 w-4" />
                </CarouselButton>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

function CarouselButton({
  label,
  className,
  onClick,
  children,
}: {
  label: string
  className: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`absolute inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-900 shadow-xs transition-colors hover:bg-gray-100 ${className}`}
    >
      {children}
    </button>
  )
}
