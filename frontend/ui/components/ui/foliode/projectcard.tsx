"use client";

import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaPencilAlt } from "react-icons/fa";
import { Card, CardContent, CardHeader, Link, Separator } from "@heroui/react";
import Image from "next/image";
import { receivedProject } from "@rboucheron/types";
import { formatImage } from "../../../lib/utils";

interface ProjectCardProps {
  project: receivedProject;
  onEdit: () => void;
  onDelete: () => void;
}

export const ProjectCard = ({ project, onEdit, onDelete }: ProjectCardProps) => {
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
          {(project.projectsLinks ?? []).map((link, index) => (
            <Link key={index} showAnchorIcon href={`${link.url}`} className="!text-primary !text-sm">
              {link.name}
            </Link>
          ))}
        </div>
        <p className="text-tiny break-all">{project.description}</p>
      </CardHeader>
      {project.projectsImages && project.projectsImages.length > 0 && (
        <CardContent className="overflow-visible py-2">
          <Image
            src={formatImage(project.projectsImages[0].img_src)}
            className="object-cover rounded-xl w-full sm:w-[270px]"
            alt="project image"
            width={270}
            height={180}
          />
        </CardContent>
      )}
    </Card>
  );
};
