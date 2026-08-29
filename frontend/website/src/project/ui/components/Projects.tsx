"use client";

import { useEffect, useState } from "react";

import { ProjectCard } from "@rboucheron/ui";
import { deleteProject, getPortfolioProjects } from "@rboucheron/api";

import { useProjects } from "@/project/store/useProjects";
import ProjectUpdate from "@/project/ui/forms/ProjectUpdate";
import Image from "next/image";
import { formatImage } from "@/utils/formatImage";
import Link from "next/dist/client/link";

function Projects() {
  const { projects, setProjects } = useProjects();
  const [editionMode, setEditionMode] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDeleteProject = async (id: string) => {
    const isConfirmed = window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?");
    if (isConfirmed) {
      await deleteProject(id);
      setProjects(projects.filter((project) => project.id !== id));
    }
  };

  const fetchProjects = async () => {
    const response = await getPortfolioProjects();
    setProjects(response);
  };

  const toggleEdition = (projectId: string) => {
    setEditionMode((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  return (
    <>
      {projects.length !== 0 &&
        projects.map((project, key) => (
          <div key={key}>
            {editionMode[project.id] ? (
              <ProjectUpdate
                project={project}
                onFinish={() => {
                  toggleEdition(project.id);
                  fetchProjects();
                }}
              />
            ) : (
              <ProjectCard
                project={project}
                onEdit={() => toggleEdition(project.id)}
                onDelete={() => handleDeleteProject(project.id)}
                Image={(src: string, alt: string, className: string, width: number, height: number) => {<Image src={formatImage(src)} alt={alt} className={className} width={width} height={height} />}}
                Link={(href: string, className: string, children: React.ReactNode) => {<Link href={href} className={className}>{children}</Link>}}
              />
            )}
          </div>
        ))}
    </>
  );
}

export default Projects;