import { ReactNode } from "react";
import { Portfolio } from "@rboucheron/types";

interface EmeraldFlowProps {
  portfolio: Portfolio;
  commentsSection?: ReactNode;
  Image: (src: string, alt: string, className: string, width: number, height: number) => ReactNode;
  Link: (href: string, className: string, children: ReactNode) => ReactNode;
  formatImage: (src: string) => string;
  generateAvatar: (size: number, seed: string) => string;
}

const EmeraldFlow = ({ portfolio, commentsSection, Image, Link, formatImage, generateAvatar }: EmeraldFlowProps) => {
  const { primary, secondary, warning, success, info, light } = portfolio.config.colors;
  const avatar = portfolio.users.avatar_url;

  return (
    <main
      className="min-h-screen y"
      style={{
        background: `linear-gradient(to bottom right, ${light}, ${primary})`,
      }}
    >
      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0  opacity-10 z-0"></div>
        <h1
          className="font-bold text-7xl md:text-9xl text-center z-10 tracking-tight"
          style={{ color: secondary }}
        >
          {portfolio.title}
        </h1>
        <p
          className="mt-6 text-xl md:text-2xl text-portfolio-green-text-secondary z-10"
          style={{ color: secondary }}
        >
          {portfolio.subtitle}
        </p>
      </section>

      {/* About Section */}
      <section
        id="quiJeSuis"
        className="py-20 px-4 "
        style={{ backgroundColor: warning }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <h2
              className="text-5xl md:text-6xl font-bold leading-tight"
              style={{ color: info }}
            >
              Bonjour, je suis{" "}
              <span className="uppercase">{portfolio.users.firstname}</span>
            </h2>
            <p
              className="text-xl text-portfolio-green-text-secondary leading-relaxed"
              style={{ color: info }}
            >
              {portfolio.bio}
            </p>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-64 h-64 rounded-full overflow-hidden ">
              {Image(
                avatar ? formatImage(avatar) : generateAvatar(256, portfolio.users.email),
                `avatar of ${portfolio.users.firstname}`,
                "object-cover",
                256,
                256
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-4xl md:text-5xl font-bold mb-12 text-portfolio-green-text-primary text-center"
            style={{ color: secondary }}
          >
            Mes Projets
          </h2>
          <div className="space-y-16">
            {portfolio.projects.map((project, key) => (
              <div
                key={key}
                className="flex relative flex-col md:flex-row gap-8 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                style={{ backgroundColor: success }}
              >
                <div className="flex-1 space-y-4">
                  <h3
                    className="text-3xl font-semibold text-portfolio-green-text-secondary"
                    style={{ color: info }}
                  >
                    {project.title}
                  </h3>
                  <p
                    className="text-lg text-portfolio-green-text-secondary line-clamp-3 leading-relaxed"
                    style={{ color: info }}
                  >
                    {project.description}
                  </p>
                  <span
                    className="inline-block absolute bottom-3 left-3"
                    style={{ backgroundColor: info, color: secondary }}
                  >
                    {Link(
                      `/${portfolio.url}/project/${project.title}`,
                      "inline-block bg-portfolio-green-accent text-portfolio-green-text-primary py-3 px-8 rounded-xl font-semibold text-lg transition-colors duration-300 hover:bg-portfolio-green-text-secondary hover:text-portfolio-green-accent",
                      "Voir le projet"
                    )}
                  </span>
                </div>
                {project.projectsImages &&
                  <div className="w-full md:w-1/2">
                    <div className="aspect-video rounded-xl overflow-hidden shadow-md">
                      {Image(
                        formatImage(project.projectsImages[0].img_src),
                        project.title,
                        "object-cover w-full h-full transform hover:scale-105 transition-transform duration-300",
                        1000,
                        500
                      )}
                    </div>
                  </div>
                }
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section
        className="py-20 px-4 bg-portfolio-green-secondary"
        style={{ backgroundColor: warning }}
      >
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-4xl md:text-5xl font-bold mb-12 text-portfolio-green-text-secondary text-center"
            style={{ color: info }}
          >
            Compétences
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolio.tools.map((tool, index) => (
              <div
                key={index}
                className="p-6 bg-portfolio-green-primary bg-opacity-50 shadow-lg rounded-xl flex items-center gap-6 transition-transform duration-300 hover:transform hover:scale-105"
                style={{ backgroundColor: light, opacity: 0.75 }}
              >
                <div
                  className="p-3 rounded-lg bg-white shadow-inner"
                  style={{ backgroundColor: secondary }}
                >
                  {Image(formatImage(tool.picto), "Figma logo", "", 40, 40)}
                </div>
                <div>
                  <h3
                    className="font-semibold text-xl text-portfolio-green-text-primary"
                    style={{ color: secondary }}
                  >
                    {tool.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {commentsSection}
    </main>
  );
};

export default EmeraldFlow;
