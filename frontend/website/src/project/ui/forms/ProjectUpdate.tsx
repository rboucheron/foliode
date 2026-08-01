"use client";

import { useState } from "react";
import { RiDeleteBin5Fill } from "react-icons/ri";

import { FileInput, FoliodeButton, LinkAdder } from "@rboucheron/ui";
import type { Project, ProjectUpdateProps } from "@rboucheron/types";
import { updateProject as updateProjectAPI } from "@rboucheron/api";

export default function ProjectUpdate({ project: initialProject, onFinish }: ProjectUpdateProps) {
  const [project, setProject] = useState<Project>(initialProject);
  const [images, setImages] = useState<File[]>([]);

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title: project.title,
      description: project.description,
      links: project.projectsLinks,
      images,
    };

    try {
      await updateProjectAPI(project.id!, payload);
      if (onFinish) onFinish();
    } catch (error) {
      console.log("Erreur lors de la modification du projet :", error);
    }
  };

  const deleteFile = (index: number) => {
    setProject({
      ...project,
      projectsImages: project.projectsImages?.filter((_, currentIndex) => currentIndex !== index),
    });
  };

  return (
    <div className="py-4 relative w-full sm:w-[300px] h-max rounded-xl border border-[#2C2D33] bg-[#f5f5f5] dark:bg-[#191919]">
      <form
        onSubmit={handleUpdateProject}
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

        <LinkAdder
          onChange={(links) => setProject({ ...project, projectsLinks: links })}
          value={project.projectsLinks}
        />

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

        {project.projectsImages &&
          project.projectsImages.map((image, index) => (
            <div className="w-full relative" key={index}>
              {/* eslint-disable @next/next/no-img-element */}
              <img
                src={`/${image.img_src}`}
                alt={image.img_alt}
                className="w-full rounded-xl"
              />

              <div
                onClick={() => deleteFile(index)}
                className="absolute top-2 right-2 text-red-500 cursor-pointer duration-200 hover:text-red-700 hover:scale-110"
              >
                <RiDeleteBin5Fill />
              </div>
            </div>
          ))}

        <FileInput
          files={images}
          onChange={(files) => setImages(files)}
          id={`file-${project.id}`}
          isRequired={false}
        />

        <FoliodeButton
          text="Modifier le projet"
          className="bg-primary w-full text-sm"
          style="form"
          type="submit"
        />
        <FoliodeButton
          text="Annuler la modification"
          className="bg-red-600 border-red-800 w-full text-sm"
          style="form"
          onClick={() => onFinish && onFinish()}
        />
      </form>
    </div>
  );
}