"use client";

import { useMultiStepStore } from "../store/multiStep.store";
import { useState } from "react";
import { createPortfolio, createProjects, createTools } from "@rboucheron/api";

export const useMultiStep = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const portfolio = useMultiStepStore((state) => state.portfolio);
  const projects = useMultiStepStore((state) => state.projects);
  const tools = useMultiStepStore((state) => state.tools);
  const setProject = useMultiStepStore((state) => state.setProject);
  const setTools = useMultiStepStore((state) => state.setTools);
  const setPortfolio = useMultiStepStore((state) => state.setPortfolio);

  const completeOnboarding = async () => {
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
  }

  return {
    portfolio,
    projects,
    tools,
    setProject,
    setTools,
    setPortfolio,
    completeOnboarding,
    currentStep,
    setCurrentStep,
  };
};
