"use client";

import { FirstStepForm, SecondStepForm, ThirdStepForm, FourStepForm, Stepper } from "@rboucheron/ui";
import { templatesStyles } from '@/data/templates/styles';
import { templates } from '@/data/templates/templates';
import { useState } from "react";
import { useMultiStep } from "@/onboarding/store/useMultiStep";
import { useRouter } from "next/navigation";
import { createPortfolio, createProjects, createTools } from "@rboucheron/api";
import { ModelViewer } from "@/shared/media";
import Image from "next/image";

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const { portfolio, setPortfolio, tools, setTools, projects, setProject } = useMultiStep();
  const router = useRouter();


  const postData = async () => {
    try {
      await createPortfolio(portfolio);

      if (tools.length !== 0) {
        const normalizedTools = tools.filter(
          (tool): tool is { name: string; image: File } => Boolean(tool.image)
        );

        if (normalizedTools.length !== 0) {
          await createTools({ tools: normalizedTools });
        }
      }

      if (projects.length !== 0) {
        const normalizedProjects = projects.map((project) => ({
          title: project.title,
          description: project.description,
          projectsLinks: project.projectsLinks,
          images: project.images ?? [],
        }));

        await createProjects({ projects: normalizedProjects });
      }
    } catch (e) {
      console.log(e)
    }
    router.push("/dashboard");
  };

  return (
    <div className="max-w-2xl py-8 px-2 mx-auto">
      <Stepper
        steps={[
          {
            title: "Informations Personnelles", children: <FirstStepForm portfolio={portfolio} setPortfolio={setPortfolio} inputs={{
              title: {
                label: "Nom du portfolio",
                placeholder: "Entrez le nom de votre portfolio",
                testId: "portfolio-title-input",
              },
              subTitle: {
                label: "Sous-titre",
                placeholder: "Entrez un sous-titre",
                testId: "portfolio-subtitle-input",
              },
              textarea: {
                label: "Biographie / Description",
                placeholder: "Parlez un peu de vous...",
                testId: "portfolio-bio-textarea",
              },
            }} />
          },
          {
            title: "Compétences", children: <SecondStepForm tools={tools} setTools={(tools) => setTools(tools)} inputs={{
              tool: {
                label: 'compétence',
                placeholder: 'Entrez le nom de la compétence',
              },
              deleteButton: {
                label: 'Supprimer la compétence',
              },
              addButton: {
                label: 'Ajouter une compétence',
              },
            }} />
          },
          {
            title: "Projets", children: <ThirdStepForm projects={projects} setProjects={(projects) => setProject(projects)} inputs={{
              title: {
                label: "Titre du projet",
              },
              description: {
                label: "Description",
              },
              imagesLabel: "Images du projet",
              imagesHint: "Format recommandé : PNG ou JPG, max 2MB",
              deleteButton: {
                label: "Supprimer le projet",
              },
              addButton: {
                label: "Ajouter un projet",
              },
            }} />
          },
          {
            title: "Personnalisation", children: <FourStepForm
              portfolio={portfolio}
              setPortfolio={setPortfolio}
              templates={templates}
              styles={templatesStyles}
              labels={{
                templateSelect: "Choisissez votre template",
                colorsSelect: "Choisissez votre palette de couleurs",
                colorSelect: "Personnalisez vos couleurs",
                templatePreview: (preview: string, name: string, width: number, height: number) => (
                  < Image
                    src={preview}
                    alt={name}
                    width={width}
                    height={height}
                    className="h-[140px] w-full object-cover"
                  />
                ),
              }}
            />
          },
        ]}
        withFormProgress={true}
        buttons={{
          previous: {
            label: 'Précédent',
          },
          next: {
            label: 'Suivant',
          },
          end: {
            label: 'Publier',
          }
        }}
        onStepChange={(step) => setCurrentStep(step)}
        onStepperEnd={postData}
      />
      <div id="canvas-container">
        <ModelViewer step={currentStep} />
      </div>
    </div>
  );
}

