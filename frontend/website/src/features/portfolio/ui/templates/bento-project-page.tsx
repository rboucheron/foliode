import { formatImage } from "@/lib/format-image"
import type { ProjectPageProps } from "./types"

export function BentoProjectPage({ portfolio, project }: ProjectPageProps) {
  const { primary, secondary, light } = portfolio.config.colors

  return (
    <div
      className="min-h-screen p-8 font-sans"
      style={{ background: `linear-gradient(to bottom right, ${light}, ${primary})` }}
    >
      <div className="mx-auto max-w-6xl">
        <div
          className="mb-8 overflow-hidden rounded-xl shadow-xl"
          style={{ backgroundColor: secondary }}
        >
          <div className="p-6" style={{ backgroundColor: primary }}>
            <h1
              className="mb-2 text-4xl font-bold transition-colors duration-300"
              style={{ color: secondary }}
            >
              {project.title}
            </h1>
          </div>
          <div className="p-6">
            <p className="mb-6 text-lg leading-relaxed" style={{ color: light }}>
              {project.description}
            </p>
            {project.projectsImages && project.projectsImages.length > 0 && (
              <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                {project.projectsImages.map((image, index) => (
                  <img
                    key={image.id ?? index}
                    src={formatImage(image.img_src)}
                    alt={`Project image ${index + 1}`}
                    width={500}
                    height={300}
                    loading="lazy"
                    className="h-64 w-full rounded-lg object-cover"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
