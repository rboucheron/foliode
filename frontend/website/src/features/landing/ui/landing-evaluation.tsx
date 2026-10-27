import { cn } from "@/lib/utils"

const evaluationItems = [
  {
    title: "Création de classes simplifiée",
    description: "Organisez facilement vos étudiants en classes et accédez à leurs portfolios en un seul clic.",
    className: "md:border-r-0",
  },
  {
    title: "Évaluation centralisée des portfolios",
    description:
      "Attribuez des notes, laissez des commentaires, et suivez les progrès de chaque étudiant sur une interface intuitive.",
    className: "",
  },
  {
    title: "Aligné avec vos objectifs pédagogiques",
    description: "Adaptez vos critères d’évaluation aux apprentissages critiques des formations BUT.",
    className: "md:border-l-0",
  },
] as const

export function LandingEvaluation() {
  return (
    <div>
      <div className="mt-36 px-8">
        <img
          className="relative z-40 mx-auto rounded-3xl border-[26px] border-[#2B4557]"
          alt="Tableau de bord enseignant"
          src="/Prof Dashboard.png"
          width={1200}
          height={794}
          loading="lazy"
        />
      </div>

      <div className="flex flex-col justify-center px-8 md:flex-row">
        {evaluationItems.map((item) => (
          <div key={item.title} className={cn("max-w-[400px] border border-[#393939]", item.className)}>
            <p className="px-8 pt-9 pb-11 font-semibold">{item.title}</p>
            <p className="px-8 pt-0 pb-7">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
