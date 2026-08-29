"use client";

import { create } from "zustand";
import type { receivedProject } from "@rboucheron/types";

interface ProjectsState {
  projects: receivedProject[];
  setProjects: (projects: receivedProject[]) => void;
}

export const useProjectsStore = create<ProjectsState>((set) => ({
  projects: [],
  setProjects: (projects) => {
    set({ projects });
  },
}));