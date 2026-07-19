"use client";

import { MdOutlineSpaceDashboard } from "react-icons/md";
import { FaRegUser, FaRegFolder, FaRegEdit } from "react-icons/fa";
import { LuBrain } from "react-icons/lu";
import { IoColorPaletteOutline } from "react-icons/io5";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sidebar, ThemeSwitcher, SignOutButton } from "@rboucheron/ui";

export default function FoliodeSidebar() {
  const pathname = usePathname();

  return (
    < Sidebar elements={[
      {
        name: "Tableau de bord",
        icon: MdOutlineSpaceDashboard,
        link: "dashboard",
      },
      {
        name: "Profile",
        icon: FaRegUser,
        link: "dashboard/profile"
      },
      {
        name: "Mes compétences",
        icon: LuBrain,
        link: "dashboard/skills"
      },
      {
        name: "Mes projets",
        icon: FaRegFolder,
        link: "dashboard/projects"
      },
      {
        name: "Commentaires",
        icon: HiOutlineChatBubbleLeftRight,
        link: "dashboard/comments",
      },
      {
        name: "Editer",
        icon: FaRegEdit,
        link: "dashboard/edit"
      },
      {
        name: "Thème",
        icon: IoColorPaletteOutline,
        link: "dashboard/theme",
      },
    ]} pathname={pathname} >
      <ThemeSwitcher useTheme={useTheme} />
      <SignOutButton />
    </Sidebar>
  );
}
