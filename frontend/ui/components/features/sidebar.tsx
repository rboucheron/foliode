"use client";

import { ComponentType, ReactNode } from "react";
import { LuArrowLeftFromLine } from "react-icons/lu";
import { IoMdMenu } from "react-icons/io";
import { useSidebar } from "./hooks/useSidebar";

type SidebarElement = {
  name: string;
  icon: ComponentType<{ className?: string }>;
  link: string;
};

interface SidebarProps {
  elements: SidebarElement[];
  children?: ReactNode;
  pathname: string;
  logo: ReactNode;
  link: (
    href: string,
    key: number,
    className: string,
    content: ReactNode
  ) => ReactNode;
}

export const Sidebar = ({
  elements,
  children,
  pathname,
  logo,
  link,
}: SidebarProps) => {
  const { isOpen, toggle } = useSidebar();

  return (
    <div className="h-screen p-2 fixed duration-300">
      <div
        className={`flex flex-col justify-between h-full rounded-xl p-5 border-2 border-gray-200 dark:border-[#2C2D33] bg-[#f5f5f5] dark:bg-[#191919] w-[80px] duration-300 ${isOpen ? "lg:w-[300px]" : ""
          }`}
      >
        <div>
          <div
            className={`flex items-center justify-between mb-10 ${isOpen ? "" : "flex-col gap-5"
              }`}
          >
            <div className="flex items-center gap-2">
              {logo}
              <p
                className={`text-26 font-normal ${isOpen ? "block" : "hidden"
                  }`}
              >
                Foliode
              </p>
            </div>

            <button
              onClick={toggle}
              className="dayMode transition-colors hidden text-xl lg:block"
              aria-label={isOpen ? "Réduire le menu" : "Ouvrir le menu"}
            >
              {isOpen ? <LuArrowLeftFromLine /> : <IoMdMenu />}
            </button>
          </div>
          <div>
            {elements.map((element, index) => {
              const isActive = pathname === `/${element.link}`;
              const Icon = element.icon;

              return link(
                `/${element.link}`,
                index,
                `dayMode flex items-center gap-3 py-2 px-3 my-3 rounded-lg cursor-pointer duration-200 hover:text-white hover:bg-primary justify-center ${isActive ? "bg-primary !text-white" : ""
                } ${isOpen ? "lg:justify-start" : ""}`,
                <>
                  <span className="text-xl">
                    <Icon />
                  </span>
                  <span className={`hidden ${isOpen ? "lg:block" : ""}`}>
                    {element.name}
                  </span>
                </>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3 items-center">{children}</div>
      </div>
    </div>
  );
};