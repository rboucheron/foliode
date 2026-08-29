import ProjectForm from "@/project/ui/forms/ProjectForm";
import { DashboardTitle } from "@rboucheron/ui";
import { UserAvatar } from "@/user/ui/UserAvatar";
import Projects from "@/project/ui/components/Projects";

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
