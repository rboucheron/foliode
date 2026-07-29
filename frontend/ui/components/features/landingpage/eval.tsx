import { Card, CardHeader, CardContent } from "@heroui/react";
import React from "react";

interface EvalProps {
  Image: (src: string, alt: string, className: string, width: number, height: number) => React.ReactNode;
}

export function Eval({ Image }: EvalProps) {
  return (
    <div>
      <div className="px-8 mt-36">
        {Image(
          "/Prof Dashboard.png",
          "NextUI hero Image",
          "dayMode z-40 text-center mx-auto rounded-3xl border-[26px] border-[#2B4557]",
          1200,
          794
        )}
      </div>

      <div className="flex flex-col md:flex-row justify-center px-8  ">
        <Card className="max-w-[400px] bg-transparent rounded-none shadow-none border border-[#393939] md:border-r-0">
          <CardHeader className="flex gap-3 pb-11 pt-9 px-8">
            <p className="text-md font-semibold">
              Création de classes simplifiée
            </p>
          </CardHeader>
          <CardContent className="pt-0 pb-7 px-8 font-normal">
            <p>
              Organisez facilement vos étudiants en classes et accédez à leurs
              portfolios en un seul clic.
            </p>
          </CardContent>
        </Card>
        <Card className="max-w-[400px] bg-transparent rounded-none shadow-none border border-[#393939]">
          <CardHeader className="flex gap-3 pb-11 pt-9 px-8">
            <p className="text-md font-semibold">
              Évaluation centralisée des portfolios
            </p>
          </CardHeader>
          <CardContent className="pt-0 pb-7 px-8 font-normal">
            <p>
              Attribuez des notes, laissez des commentaires, et suivez les
              progrès de chaque étudiant sur une interface intuitive.
            </p>
          </CardContent>
        </Card>
        <Card className="max-w-[400px] bg-transparent rounded-none shadow-none border border-[#393939] md:border-l-0">
          <CardHeader className="flex gap-3 pb-11 pt-9 px-8">
            <p className="text-md font-semibold">
              Aligné avec vos objectifs pédagogiques
            </p>
          </CardHeader>
          <CardContent className="pt-0 pb-7 px-8 font-normal">
            <p>
              Adaptez vos critères d’évaluation aux apprentissages critiques des
              formations BUT.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Eval;
