import { ReactNode } from "react";
import { ProjectPageProps } from "@rboucheron/types";

type ProjectPageInjectedProps = ProjectPageProps & {
  Image: (src: string, alt: string, className: string, width: number, height: number) => ReactNode;
  Link: (href: string, className: string, children: ReactNode) => ReactNode;
  formatImage: (src: string) => string;
};

export default function ProjectPage({ portfolio, project, Image, Link, formatImage }: ProjectPageInjectedProps) {
  const { primary, secondary, warning, success, info, light } =
    portfolio.config.colors;

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <main
      className="min-h-screen w-full"
      style={{
        background: `linear-gradient(to bottom right, ${light}, ${primary})`,
      }}
    >
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <h1
              className="text-5xl md:text-7xl font-bold mb-8 transform hover:scale-105 transition-transform duration-300"
              style={{ color: secondary || "#000000" }}
            >
              {project.title}
            </h1>
            <div
              className="w-32 h-1 mx-auto rounded-full mb-8"
              style={{ backgroundColor: warning }}
            />
          </div>

          <div
            className="p-8 rounded-2xl shadow-xl mb-12"
            style={{ backgroundColor: secondary, backdropFilter: "blur(10px)" }}
          >
            <p className="text-xl leading-relaxed" style={{ color: light }}>
              {project.description}
            </p>
            <div className="mt-8">
              {project.projectsImages && project.projectsImages.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {project.projectsImages.map((image, index) => (
                    <div key={index}>
                      {Image(
                        formatImage(image.img_src),
                        `Project image ${index + 1}`,
                        "rounded-lg object-cover w-full h-64",
                        500,
                        300
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {project.projectsLinks && project.projectsLinks.length > 0 && (
            <div className="mb-12">
              <h2
                className="text-2xl font-bold mb-6 text-center"
                style={{ color: secondary }}
              >
                Liens du projet
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                {project.projectsLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    className="px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-2"
                    style={{ backgroundColor: info, color: secondary }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>{link.name}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 text-center">
            <span
              className="inline-block"
              style={{
                backgroundColor: success,
                color: light,
              }}
            >
              {Link(
                `/${portfolio.url}`,
                "inline-block px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg font-semibold",
                "Retour au portfolio"
              )}
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
