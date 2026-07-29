"use client";

import { Button, Input, TextArea } from "@heroui/react";
import { Project } from "@rboucheron/types";

import { FileInput } from "../../ui/foliode/fileinput";
import { LinkAdder } from "../../ui/foliode/linkadder";

type thirdStepInputs = {
  title: {
    label: string;
  };
  description: {
    label: string;
  };
  imagesLabel: string;
  imagesHint: string;
  deleteButton: {
    label: string;
  };
  addButton: {
    label: string;
  };
};

interface thirdStepFormProps {
  setProjects: (projects: Project[]) => void;
  projects: Project[];
  inputs: thirdStepInputs;
}

export const ThirdStepForm = ({ setProjects, projects, inputs }: thirdStepFormProps) => {
  const handleProjectChange = (index: number, field: string, value: string | object | File) => {
    const newProject = [...projects];
    newProject[index] = {
      ...newProject[index],
      [field]: value,
    };
    setProjects(newProject);
  };

  const addProject = () => {
    const newProject = {
      title: "",
      description: "",
      projectsLinks: [],
      images: [],
      projectsImages: [],
      links: [],
    };
    setProjects([...projects, newProject]);
  };

  const handleDeleteProject = (index: number) => {
    const newProject = projects.filter((_, i) => i !== index);
    setProjects(newProject);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Projets</h3>
      {projects.map((project, index) => (
        <div key={index} className="border p-3 rounded-md space-y-3">
          <Input
            label={inputs.title.label}
            value={project.title}
            onChange={(e) => handleProjectChange(index, "title", e.target.value)}
            isRequired
          />
          <TextArea
            label={inputs.description.label}
            value={project.description}
            onChange={(e) => handleProjectChange(index, "description", e.target.value)}
            isRequired
          />
          <LinkAdder onChange={(links) => handleProjectChange(index, "projectsLinks", links)} />

          <div>
            <label className="block text-sm font-medium mb-1">{inputs.imagesLabel}</label>
            <FileInput
              onChange={(files) => handleProjectChange(index, "images", files.map((file) => file))}
              files={project.images || []}
              id={`file-${index}`}
              isRequired
            />
            <span className="text-sm text-gray-500 mt-1">{inputs.imagesHint}</span>
          </div>

          <Button
            variant="flat"
            onPress={() => handleDeleteProject(index)}
            className="w-full bg-danger"
          >
            {inputs.deleteButton.label}
          </Button>
        </div>
      ))}
      <Button
        variant="flat"
        onPress={addProject}
        className="dayMode bg-primary text-white w-full"
      >
        {inputs.addButton.label}
      </Button>
    </div>
  );
};

export default ThirdStepForm;
