"use client";

import { useState } from "react";

import { FileInput, FoliodeButton, LinkAdder } from "@rboucheron/ui";
import type { Project } from "@rboucheron/types";
import { createProject as createProjectAPI } from "@rboucheron/api";

import { useProjects } from "@/project/store/useProjects";

function ProjectForm() {
  const { projects, setProjects } = useProjects();
  const [project, setProject] = useState<Project>({
    title: "",
    description: "",
    projectsLinks: [],
    images: [],
    projectsImages: [],
  });
  const [images, setImages] = useState<File[]>([]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title: project.title,
      description: project.description,
      links: project.projectsLinks,
      images,
    };

    try {
      const response = await createProjectAPI(payload);
      setProjects([...projects, response]);
      setProject({
        title: "",
        description: "",
        projectsLinks: [],
        images: [],
        projectsImages: [],
      });
    } catch (error) {
      console.log("Erreur lors de la création du projet :", error);
    }
  };

  return (
    <div className="py-4 relative w-full sm:w-[300px] h-max rounded-xl border border-[#2C2D33] bg-[#f5f5f5] dark:bg-[#191919]">
      <form
        onSubmit={handleCreateProject}
        method="POST"
        className="pb-0 pt-2 px-4 flex-col space-y-2"
      >
        <label className="flex flex-col gap-2 text-sm">
          <span>Titre du projet</span>
          <input
            value={project.title}
            onChange={(e) => setProject({ ...project, title: e.target.value })}
            required
            className="rounded-lg border border-gray-500 bg-transparent px-3 py-2 outline-none focus:border-primary"
          />
        </label>

        <LinkAdder onChange={(links) => setProject({ ...project, projectsLinks: links })} />

        <label className="flex flex-col gap-2 text-sm">
          <span>Description</span>
          <textarea
            value={project.description}
            onChange={(e) =>
              setProject({ ...project, description: e.target.value })
            }
            required
            className="min-h-32 rounded-lg border border-gray-500 bg-transparent px-3 py-2 outline-none focus:border-primary"
          />
        </label>

        <FileInput files={images} onChange={(files) => setImages(files)} isRequired />

        <FoliodeButton
          text="Créer un projet"
          className="bg-primary w-full text-sm"
          style="form"
          type="submit"
        />
      </form>
    </div>
  );
}

export default ProjectForm;