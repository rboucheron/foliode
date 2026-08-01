"use client";

import { create } from "zustand";
import type { MsPortfolio, Project, Tools } from "@rboucheron/types";

interface MultiStepState {
  portfolio: MsPortfolio;
  projects: Project[];
  tools: Tools[];
  setProject: (project: Project[]) => void;
  setTools: (tools: Tools[]) => void;
  setPortfolio: (portfolio: MsPortfolio) => void;
}

export const useMultiStepStore = create<MultiStepState>((set) => ({
  portfolio: {
    title: "",
    url: "",
    subtitle: "",
    bio: "",
    config: { colors: null },
    template: "",
  },
  tools: [],
  projects: [],
  setPortfolio: (portfolio) => {
    set({ portfolio });
  },
  setProject: (project) => {
    set({ projects: project });
  },
  setTools: (tools) => {
    set({ tools });
  },
}));