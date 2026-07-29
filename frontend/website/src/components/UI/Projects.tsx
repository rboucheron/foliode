"use client";
import { useProjects }               from "@/utils/store";
import { useState }                  from "react";

import { ProjectCard } from "@rboucheron/ui";

import React, { useEffect} from "react";
import ProjectUpdate       from "../form/ProjectUpdate";
import { deleteProject, getPortfolioProjects } from "@rboucheron/api";

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
      [projectId]: !prev[projectId]
    }));
  };
  return (
    <>

      {projects.length !== 0 &&
        projects.map((project, key) => (
          <div key={key}>
            {editionMode[project.id] ? (
              <ProjectUpdate project={project} onFinish={() => {toggleEdition(project.id); fetchProjects();}} />
            ) : (
              <ProjectCard
                project={project}
                onEdit={() => toggleEdition(project.id)}
                onDelete={() => handleDeleteProject(project.id)}
              />
            )}
          </div>
        ))}
    </>
  );
}

export default Projects;
