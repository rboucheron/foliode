"use client";

import { useEffect, useState } from "react";
import type { Skill, Tools } from "@rboucheron/types";
import { createTool, deleteTool, getCurrentPortfolio } from "@rboucheron/api";

export const useSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);

  const fetchSkills = async () => {
    try {
      const response = await getCurrentPortfolio();
      setSkills(response.tools);
    } catch (error) {
      console.error("Erreur lors du chargement des compétences :", error);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const addSkill = async (skill: Tools) => {
    if (!skill.image || !skill.name) {
      return false;
    }

    await createTool({ name: skill.name, image: skill.image });
    await fetchSkills();
    return true;
  };

  const removeSkill = async (id: string) => {
    await deleteTool(id);
    setSkills((current) => current.filter((skill) => skill.id !== id));
  };

  return { skills, addSkill, removeSkill };
};
