"use client";

import { useState } from "react";
import { createProject as createProjectAPI } from "@rboucheron/api";
import { ProjectCreateRequestDTO } from "@rboucheron/api";
import { Project } from "@rboucheron/types";

import { useProjectsStore } from "./project.store";

const createEmptyProject = (): Project => ({
    title: "",
    description: "",
    projectsLinks: [],
    images: [],
    projectsImages: [],
});

export const useProjects = () => {
    const projects = useProjectsStore((state) => state.projects);
    const setProjects = useProjectsStore((state) => state.setProjects);

    const [currentProject, setCurrentProject] =
        useState<Project>(createEmptyProject());

    const handleCreateProject = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        const payload: ProjectCreateRequestDTO = {
            title: currentProject.title,
            description: currentProject.description,
            projectsLinks: currentProject.projectsLinks,
            images: currentProject.images ?? [],
        };

        try {
            const project = await createProjectAPI(payload);

            setProjects([...projects, project]);
            setCurrentProject(createEmptyProject());
        } catch (error) {
            console.error("Erreur lors de la création du projet :", error);
        }
    };

    return {
        projects,
        currentProject,
        setCurrentProject,
        setProjects,
        handleCreateProject,
    };
};