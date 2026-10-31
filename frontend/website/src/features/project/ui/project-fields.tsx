import { LinkAdder } from "@/components/shared/link-adder";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ProjectDraft } from "../domain/project";
import { useTranslation } from "@/i18n";

interface ProjectFieldsProps {
  idPrefix: string;
  project: ProjectDraft;
  onChange: (project: Partial<ProjectDraft>) => void;
}

export function ProjectFields({
  idPrefix,
  project,
  onChange,
}: ProjectFieldsProps) {
  const t = useTranslation();
  return (
    <>
      <Field>
        <FieldLabel htmlFor={`${idPrefix}-title`}>
          {t("projects.fields.title")} <span className="text-destructive">*</span>
        </FieldLabel>
        <Input
          id={`${idPrefix}-title`}
          value={project.title}
          onChange={(event) => onChange({ title: event.target.value })}
          required
        />
      </Field>

      <LinkAdder
        value={project.projectsLinks}
        onChange={(projectsLinks) => onChange({ projectsLinks })}
      />

      <Field>
        <FieldLabel htmlFor={`${idPrefix}-description`}>
          {t("projects.fields.description")} <span className="text-destructive">*</span>
        </FieldLabel>
        <Textarea
          id={`${idPrefix}-description`}
          value={project.description}
          onChange={(event) => onChange({ description: event.target.value })}
          required
        />
      </Field>
    </>
  );
}
