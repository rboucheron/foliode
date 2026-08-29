"use client";

import { DashboardTitle } from "@rboucheron/ui";
import { UserAvatar } from "@/user/ui/UserAvatar";
import { useUser } from "@/user/store/useUser";
import { useEffect } from "react";

import { signInGitHub, signInDribbble } from "@/auth/application/social-auth.actions";
import { Colors as ColorsInterface, Promotion } from "@rboucheron/types";

import { usePortfolio } from "@/portfolio/store/usePortfolio";
import Link from "next/link";

import {
  FaGithub,
  FaDribbble,
  FaGraduationCap,
  FaPencilAlt,
} from "react-icons/fa";
import { CiDatabase } from "react-icons/ci";
import PortfolioCharts from "@/portfolio/ui/components/PortfolioCharts";

export default function Dashboard() {
  const { user, fetchFromJwt } = useUser();
  const { fetchPortfolio, portfolio } = usePortfolio();
  const projects = (portfolio?.projects || []) as Array<{ title: string; description: string }>;
  const portfolioColors = portfolio?.config.colors;
  const portfolioPromotion = portfolio?.users.promotion as Promotion;
  const portfolioTools = (portfolio?.tools || []) as Array<{ name: string; picto: string }>;

  useEffect(() => {
    fetchFromJwt();
    fetchPortfolio();
  }, [fetchFromJwt, fetchPortfolio]);

  return (
    <>
      <DashboardTitle
        title="Tableau de bord"
        avatar={<UserAvatar size={40} />}
      />

      <div className="h-screen w-full p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <div className="sm:col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1 flex flex-col gap-4">
            <section className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-gray-200 dark:border-[#2C2D33] rounded-xl">
              <div className="flex flex-row items-center gap-5 p-4">
                <FaGithub className="text-2xl" />
                {user?.github_login ? (
                  <span className="dayMode">
                    Connecté en tant que{" "}
                    <a
                      href={`https://github.com/${user.github_login}`}
                      target="_blank"
                      rel="noreferrer"
                      className="cursor-pointer underline"
                    >
                      {user?.github_login}
                    </a>
                  </span>
                ) : (
                  <>
                    <button
                      onClick={() => signInGitHub()}
                      className="text-foreground cursor-pointer underline"
                    >
                      Connectez-vous avec GitHub
                    </button>
                  </>
                )}
              </div>
            </section>

            <section className="w-full overflow-hidden shadow-lg hover:shadow-xl duration-300 border-2 border-gray-200 dark:border-[#2C2D33] rounded-xl">
              <div className="flex flex-row items-center gap-5 p-4">
                <FaDribbble className="text-2xl" />
                {user?.dribbble_login ? (
                  <span className="dayMode">
                    Connecté en tant que{" "}
                    <a
                      href={`https://dribbble.com/${user.dribbble_login}`}
                      target="_blank"
                      rel="noreferrer"
                      className="cursor-pointer underline"
                    >
                      {user?.dribbble_login}
                    </a>
                  </span>
                ) : (
                  <>
                    <button
                      onClick={() => signInDribbble()}
                      className="text-foreground cursor-pointer underline"
                    >
                      Connectez-vous avec Dribbble
                    </button>
                  </>
                )}
              </div>
            </section>
          </div>

          <section className="sm:col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2 shadow-lg hover:shadow-xl duration-300 border-2 border-gray-200 dark:border-[#2C2D33] rounded-xl">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  {portfolio?.title || "Votre portfolio"}
                </h2>
                <Link href="/dashboard/edit" className="">
                  <FaPencilAlt className="dayMode text-primary duration-200 hover:text-primary-200 hover:scale-110" />
                </Link>
              </div>
              <div className="flex flex-col gap-2">
                <p className="">Nombre de projets: {projects.length}</p>
                <p className="">
                  Template: {portfolio?.template || "Non défini"}
                </p>
                <p className="">
                  URL: {portfolio?.url ? `/${portfolio.url}` : "Non définie"}
                </p>
              </div>
            </div>
          </section>

          <section className="sm:col-span-2 md:col-span-3 lg:col-span-1 xl:col-span-2 shadow-lg hover:shadow-xl duration-300 border-2 border-gray-200 dark:border-[#2C2D33] rounded-xl">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <FaGraduationCap className="text-2xl" />
                <h2 className="text-xl font-bold">Formation</h2>
              </div>
              {portfolioPromotion ? (
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold">Type:</span>{" "}
                    {portfolioPromotion.formation.type}
                  </p>
                  <p>
                    <span className="font-semibold">Formation:</span>{" "}
                    {portfolioPromotion.formation.name}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  Aucune formation associée
                </p>
              )}
            </div>
          </section>

          <section className="sm:col-span-2 md:col-span-3 lg:col-span-2 xl:col-span-2 shadow-lg hover:shadow-xl duration-300 border-2 border-gray-200 dark:border-[#2C2D33] rounded-xl">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Compétences</h2>
                <Link
                  href="/dashboard/skills"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FaPencilAlt className="dayMode text-primary duration-200 hover:text-primary-200 hover:scale-110" />
                </Link>
              </div>
              {portfolioTools.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {portfolioTools.map((tool, index) => (
                    <div
                      key={index}
                      className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm"
                    >
                      {tool.name}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  Aucune compétence définie
                </p>
              )}
            </div>
          </section>

          <section className="sm:col-span-2 md:col-span-3 lg:col-span-2 xl:col-span-3 shadow-lg hover:shadow-xl duration-300 border-2 border-gray-200 dark:border-[#2C2D33] rounded-xl">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Projets récents</h2>
                <Link
                  href="/dashboard/projects"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FaPencilAlt className="dayMode text-primary duration-200 hover:text-primary-200 hover:scale-110" />
                </Link>
              </div>
              {projects.length > 0 ? (
                <div className="space-y-3">
                  {projects.slice(0, 3).map((project, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
                    >
                      <h3 className="font-semibold">{project.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                  ))}
                  {projects.length > 3 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      + {projects.length - 3} autres projets
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">Aucun projet</p>
              )}
            </div>
          </section>

          <section className="sm:col-span-2 md:col-span-3 lg:col-span-2 xl:col-span-2 shadow-lg hover:shadow-xl duration-300 border-2 border-gray-200 dark:border-[#2C2D33] rounded-xl">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Couleurs du portfolio</h2>
                <Link
                  href="/dashboard/edit"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FaPencilAlt className="dayMode text-primary duration-200 hover:text-primary-200 hover:scale-110" />
                </Link>
              </div>
              {portfolioColors ? (
                <div className="grid grid-cols-2 gap-3">
                  {Object.keys(portfolioColors).map((colorKey) => (
                    <div key={colorKey} className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full border border-gray-300"
                        style={{
                          backgroundColor:
                            portfolioColors[colorKey as keyof ColorsInterface],
                        }}
                      ></div>
                      <span className="capitalize">{colorKey}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  Aucune couleur définie
                </p>
              )}
            </div>
          </section>

          <section className="sm:col-span-2 md:col-span-3 lg:col-span-2 xl:col-span-3 shadow-lg hover:shadow-xl duration-300 border-2 border-gray-200 dark:border-[#2C2D33] rounded-xl">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Typographie</h2>
                <Link
                  href="/dashboard/edit"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FaPencilAlt className="dayMode text-primary duration-200 hover:text-primary-200 hover:scale-110" />
                </Link>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">
                    Titre (H1)
                  </h3>
                  <p className="text-2xl font-bold">Exemple de titre</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">
                    Sous-titre (H2)
                  </h3>
                  <p className="text-xl font-semibold">Exemple de sous-titre</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">
                    Texte
                  </h3>
                  <p>Exemple de texte standard.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="sm:col-span-2 md:col-span-3 lg:col-span-2 xl:col-span-2 shadow-lg hover:shadow-xl duration-300 border-2 border-gray-200 dark:border-[#2C2D33] rounded-xl">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Commentaires</h2>
                <Link
                  href="/dashboard/comments"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FaPencilAlt className="dayMode text-primary duration-200 hover:text-primary-200 hover:scale-110" />
                </Link>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Consultez les commentaires reçus, masquez ceux qui ne respectent
                pas les règles et gardez l'historique.
              </p>
            </div>
          </section>

          <section className="col-span-full shadow-lg hover:shadow-xl duration-300 border-2 border-gray-200 dark:border-[#2C2D33] rounded-xl">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CiDatabase className="text-2xl" />
                <h2 className="text-xl font-bold">Analytiques du Portfolio</h2>
              </div>
              <div className=" flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                <PortfolioCharts />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">--</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Vues Totales
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">--</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Cette Semaine
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">--</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Temps Moyen
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
