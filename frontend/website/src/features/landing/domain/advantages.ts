export interface Advantage {
  key: string
  title: string
  subtitle: string
  content: string
}

export const advantages: readonly Advantage[] = [
  {
    key: "1",
    title: "Créer facilement un portfolio personnalisé",
    subtitle: "Des options flexibles pour votre création",
    content:
      "Notre plateforme vous permet de créer un portfolio unique qui reflète votre personnalité et vos compétences. Personnalisez les couleurs, les mises en page et organisez vos projets comme vous le souhaitez.",
  },
  {
    key: "2",
    title: "Choisir parmi des templates modernes",
    subtitle: "Un design adapté à vos besoins",
    content:
      "Accédez à une collection variée de templates professionnels et attrayants. Trouvez le style parfait pour mettre en valeur vos projets et compétences.",
  },
  {
    key: "3",
    title: "Hébergement gratuit et sécurisé",
    subtitle: "Une solution fiable et pratique",
    content:
      "Chaque portfolio est hébergé sur un sous-domaine unique (prenom.nom.foliode.com) avec une sécurité avancée pour protéger vos données.",
  },
  {
    key: "4",
    title: "Suivi pédagogique pour enseignants",
    subtitle: "Des outils pensés pour les professeurs",
    content:
      "Créez des classes, suivez les progrès de vos étudiants, et attribuez des évaluations facilement grâce à une interface intuitive.",
  },
]
