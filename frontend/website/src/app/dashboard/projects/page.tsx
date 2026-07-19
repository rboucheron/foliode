import ProjectForm    from "@/components/form/ProjectForm";
import { DashboardTitle } from "@rboucheron/ui";
import { UserAvatar } from "@/components/UserAvatar";
import Projects       from "@/components/UI/Projects";

export default function ProjectsPage() {
  return (
    <>
      <DashboardTitle title="Vos projets " avatar={<UserAvatar size={40} />} />
      <div className="flex gap-4 flex-wrap">
        <ProjectForm />
        <Projects />
      </div>
    </>
  );
}
