"use client";

import { DashboardTitle, FileInput, FoliodeButton } from "@rboucheron/ui";
import { UserAvatar } from "@/user/ui/UserAvatar";

import { useState } from "react";
import { HerouiInput as Input } from "@rboucheron/ui";
import Image from "next/image";
import { formatImage } from "@/utils/formatImage";
import type { Tools } from "@rboucheron/types";
import { RxCross2 } from "react-icons/rx";
import { useSkills } from "../application/use-skills";

export default function SkillsScreen() {
  const { skills, addSkill, removeSkill } = useSkills();
  const [formData, setFormData] = useState<Tools>({ name: "", image: null });

  const handleAddSkill = async () => {
    if (!formData.image || !formData.name) {
      alert("Tous les champs doivent être remplis");
      return;
    }

    await addSkill(formData);
    setFormData({ name: "", image: null });
  };
     
  return (
    <>
      <DashboardTitle title="Mes compétences" avatar={<UserAvatar size={40} />} />
      <div className="flex-1 p-6">
        <div className="mt-1 w-full">
          <div className="grid grid-cols-3 mt-10 gap-5">
            {skills &&
              skills.length !== 0 &&
              skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-xl p-5 border-2 border-[#2C2D33] bg-[#f5f5f5] dark:bg-[#191919] w-full h-[fit-content]"
                >
                  <div className="flex-shrink-0">
                    <Image
                      width={40}
                      height={40}
                      src={formatImage(skill.picto)}
                      className="rounded-sm"
                      alt="skill"
                    />
                  </div>
                  <div className="flex-grow ml-4">
                    <h3 className="text-xl ">{skill.name}</h3>
                  </div>
                  <div
                    className="cursor-pointer"
                    onClick={() => removeSkill(skill.id)}
                  >
                    <RxCross2 size={40} />
                  </div>
                </div>
              ))}
            <div className="flex flex-col justify-between rounded-xl p-5 border-2 border-[#2C2D33] bg-[#f5f5f5] dark:bg-[#191919] w-full h-[fit-content]">
              <div
                className={`bg-[#f5f5f5] dark:bg-[#191919] rounded-md p-5 space-y-2 flex flex-col transition-all duration-300 ease-in-out relative w-full `}
              >
                <Input
                  type="text"
                  name="competence"
                  value={formData.name}
                  label="Compétence"
                  variant="primary"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Exemple: Développement web"
                />
                <FileInput
                  onChange={(files) =>
                    setFormData({ ...formData, image: files[0] })
                  }
                  files={formData.image ? [formData.image] : []}
                  isRequired
                />
                <FoliodeButton
                  text="Ajouter un Skills"
                  style="form"
                  className="bg-primary w-auto"
                  onClick={handleAddSkill}
                />
              </div>

              <div className="flex justify-center w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
