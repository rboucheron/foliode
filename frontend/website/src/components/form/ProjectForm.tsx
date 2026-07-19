'use client';

import FileInput from '@/components/UI/FileInput';
import Buttons from '@/components/UI/button';
import LinkAdder from '../UI/LinkAdder';

import {
  Input,
  Textarea,
  Card
} from '@heroui/react';

import { useState } from 'react';
import { Project } from '@/interfaces/Project';
import { useProjects } from '@/utils/store';
import { createProject as createProjectAPI } from "@rboucheron/api";

function ProjectForm() {
  const { projects, setProjects } = useProjects();
  const [project, setProject] = useState<Project>({
    title: "",
    description: "",
    projectsLinks: [],
    images: [],
    projectsImages: []
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
      })
    } catch (error) {
      console.log("Erreur lors de la création du projet :", error);
    }
  };

  const inputStyles = {
    inputWrapper: [
      "border-gray-500",
      "hover:border-gray-300",
      "focus:border-primary"
    ],
    input: ["dark:text-gray-400", "placeholder:text-gray-400", "focus:text-blue-500", "bg-[#f5f5f5]", "dark:bg-[#191919]"],
    label: "dark:text-gray-400",
    clearButton: "text-primary",
  };

  return (
    <Card className="py-4 relative w-full sm:w-[300px] h-max">
      <form onSubmit={handleCreateProject} method="POST" className="pb-0 pt-2 px-4 flex-col space-y-2">
        <Input
          label="Titre du projet"
          value={project.title}
          onChange={(e) =>
            setProject({ ...project, title: e.target.value })
          }
          isRequired
          classNames={inputStyles}
        />

        <LinkAdder
          onChange={(links) =>
            setProject({ ...project, projectsLinks: links })
          }
        />

        <Textarea
          label="Description"
          value={project.description}
          onChange={(e) =>
            setProject({ ...project, description: e.target.value })
          }
          isRequired
          classNames={inputStyles}
        />

        <FileInput
          files={images}
          onChange={(files) => setImages(files)}
          isRequired
        />

        <Buttons
          text="Créer un projet"
          className="bg-primary w-full text-sm"
          style="form"
          type="submit"
        />
      </form>
    </Card>
  );
}

export default ProjectForm;
