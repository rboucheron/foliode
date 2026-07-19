"use client";

import { UseThemeProps } from "next-themes";
import { FiSun } from "react-icons/fi";
import { IoMdMoon } from "react-icons/io";

interface themeSwitcherProps {
  useTheme: () => UseThemeProps;
}

export const ThemeSwitcher = ({ useTheme }: themeSwitcherProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <div
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="dayMode flex items-center cursor-pointer group"
    >
      <span className="flex items-center px-3 cursor-pointer duration-300 group-hover:text-primary-200">
        {theme == "light" ? (
          <FiSun className="dayMode text-lg text-foreground duration-300 group-hover:text-primary-200" />
        ) : (
          <IoMdMoon className="dayMode text-lg text-background duration-300 group-hover:text-primary-200" />
        )}
      </span>
    </div>
  );
};
