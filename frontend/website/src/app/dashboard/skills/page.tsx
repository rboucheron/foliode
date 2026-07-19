"use client";

import { DashboardTitle, FileInput, FoliodeButton } from "@rboucheron/ui";
import { UserAvatar } from "@/components/UserAvatar";

import { useEffect, useState }                from "react";
import { Input }                              from "@heroui/react";
import Image                                  from "next/image";
import { formatImage }                        from "@/utils/formatImage";
import { Tools }                              from "@/interfaces/Tools";
import { RxCross2 }                           from "react-icons/rx";
import { Skill }                              from "@/interfaces/Skill";
import { createTool, deleteTool, getCurrentPortfolio } from "@rboucheron/api";

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [formData, setFormData] = useState<Tools>({ name: "", image: null });

  useEffect(() => {
    fetchSkills();
  }, []);
  
  const fetchSkills = async () => {
    try {
      const response = await getCurrentPortfolio();
      setSkills(response.tools);
    } catch (error) {
      console.error("Erreur lors du chargement des compétences :", error);
    }
  };

  const creatSkills = async () => {
    if (!formData.image || !formData.name) {
      alert("Tous les champs doivent être remplis");
      return;
    }
    await createTool({ name: formData.name, image: formData.image });
    await fetchSkills();
  };

  const handleDelete = async (id: string) => {
    await deleteTool(id);
    setSkills(skills.filter((skill) => skill.id !== id));
  };

  const styles = {
    inputWrapper: [
      "border-primary",
      "data-[hover=true]:border-primary-100",
      "group-data-[focus=true]:border-primary",
    ],
    clearButton: "text-primary",
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
                    onClick={() => handleDelete(skill.id)}
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
                  variant="bordered"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Exemple: Développement web"
                  classNames={styles}
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
                  onClick={creatSkills}
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
