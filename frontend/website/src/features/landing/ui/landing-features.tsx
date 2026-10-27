import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Orienté pour les formations BUT.",
    description:
      "Un outil pensé spécifiquement pour répondre aux besoins des étudiants et enseignants en BUT.",
  },
  {
    title: "Orienté pour les formations BUT.",
    description:
      "Un outil pensé spécifiquement pour répondre aux besoins des étudiants et enseignants en BUT.",
  },
  {
    title: "Orienté pour les formations BUT.",
    description:
      "Un outil pensé spécifiquement pour répondre aux besoins des étudiants et enseignants en BUT.",
  },
] as const;

export function LandingFeatures() {
  return (
    <div id="fonctionnalites">
      <h2 className="mt-36 mb-20 text-center text-4xl font-bold">
        Pourquoi choisir Foliode
      </h2>
      <div className="flex flex-col justify-center gap-6 px-8 md:flex-row">
        {features.map((feature, index) => (
          <Card key={index} className="mx-auto max-w-[400px]">
            <CardHeader className="px-8 pt-8 pb-5">
              <CardTitle className="font-semibold">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="px-8 pt-0 pb-7">
              <p>{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
