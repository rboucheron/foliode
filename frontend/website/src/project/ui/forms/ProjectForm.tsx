"use client";

import { FileInput, FoliodeButton as Button, LinkAdder } from "@rboucheron/ui";

import { useProjects } from "@/project/store/useProjects";

function ProjectForm() {
  const {
    currentProject,
    setCurrentProject,
    handleCreateProject,
  } = useProjects();

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
            value={currentProject.title}
            onChange={(e) =>
              setCurrentProject({
                ...currentProject,
                title: e.target.value,
              })
            }
            required
            className="rounded-lg border border-gray-500 bg-transparent px-3 py-2 outline-none focus:border-primary"
          />
        </label>

        <LinkAdder
          onChange={(projectsLinks) =>
            setCurrentProject({
              ...currentProject,
              projectsLinks,
            })
          }
        />

        <label className="flex flex-col gap-2 text-sm">
          <span>Description</span>
          <textarea
            value={currentProject.description}
            onChange={(e) =>
              setCurrentProject({
                ...currentProject,
                description: e.target.value,
              })
            }
            required
            className="min-h-32 rounded-lg border border-gray-500 bg-transparent px-3 py-2 outline-none focus:border-primary"
          />
        </label>

        <FileInput
          files={currentProject.images ?? []}
          onChange={(images) =>
            setCurrentProject({
              ...currentProject,
              images,
            })
          }
          isRequired
        />

        <Button
          text="Créer un projet"
          className="w-full bg-primary text-sm"
          style="form"
          type="submit"
        />
      </form>
    </div>
  );
}

export default ProjectForm;