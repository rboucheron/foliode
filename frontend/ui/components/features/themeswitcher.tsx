"use client";

import { useEffect, useState } from "react";
import { UseThemeProps } from "next-themes";
import { FiSun } from "react-icons/fi";
import { IoMdMoon } from "react-icons/io";

interface themeSwitcherProps {
  useTheme: () => UseThemeProps;
}

export const ThemeSwitcher = ({ useTheme }: themeSwitcherProps) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

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
