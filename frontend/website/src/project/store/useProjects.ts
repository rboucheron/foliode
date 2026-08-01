"use client";

import { useProjectsStore } from "./project.store";

export const useProjects = () => {
  const projects = useProjectsStore((state) => state.projects);
  const setProjects = useProjectsStore((state) => state.setProjects);

  return {
    projects,
    setProjects,
  };
};