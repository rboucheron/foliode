"use client";

import { useMultiStepStore } from "./multiStep.store";

export const useMultiStep = () => {
  const portfolio = useMultiStepStore((state) => state.portfolio);
  const projects = useMultiStepStore((state) => state.projects);
  const tools = useMultiStepStore((state) => state.tools);
  const setProject = useMultiStepStore((state) => state.setProject);
  const setTools = useMultiStepStore((state) => state.setTools);
  const setPortfolio = useMultiStepStore((state) => state.setPortfolio);

  return {
    portfolio,
    projects,
    tools,
    setProject,
    setTools,
    setPortfolio,
  };
};