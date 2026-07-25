"use client";

import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaPencilAlt } from "react-icons/fa";
import { Card, CardContent, CardHeader, Separator } from "@heroui/react";
import { receivedProject } from "@rboucheron/types";

interface ProjectCardProps {
  project: receivedProject;
  onEdit: () => void;
  onDelete: () => void;
  Image: (src: string, alt: string, className: string, width: number, height: number) => React.ReactNode;
  Link: (href: string, className: string, children: React.ReactNode) => React.ReactNode;
}

export const ProjectCard = ({ project, onEdit, onDelete, Image, Link }: ProjectCardProps) => {
  return (
    <Card className="py-4 relative w-full sm:w-[300px] h-max">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <div className="flex w-full items-center justify-between mb-1">
          <h4 className="text-large uppercase font-bold">{project.title}</h4>
          <div className="flex items-center gap-2">
            <button onClick={onEdit}>
              <FaPencilAlt className="text-primary duration-200 hover:text-primary-200 hover:scale-110" />
            </button>
            <button onClick={onDelete}>
              <RiDeleteBin5Fill className="text-red-500 duration-200 hover:text-red-700 hover:scale-110" />
            </button>
          </div>
        </div>
        <Separator />
        <div className="my-1 w-full flex flex-col">
          {(project.projectsLinks ?? []).map((link) => (
            Link(
              link.url,
              "!text-primary !text-sm",
              link.name
            )
          ))}
        </div>
        <p className="text-tiny break-all">{project.description}</p>
      </CardHeader>
      {project.projectsImages && project.projectsImages.length > 0 && (
        <CardContent className="overflow-visible py-2">
          {Image(
            project.projectsImages[0].img_src,
            "project image",
            "object-cover rounded-xl w-full sm:w-[270px]",
            270,
            180
          )}
        </CardContent>
      )}
    </Card>
  );
};
