"use client";

import React, { useState } from "react";
import { Link } from "@heroui/react";
import { IoMdMenu, IoMdClose } from "react-icons/io";

interface NavPortfolioProps {
  className?: string;
  style?: React.CSSProperties;
  justify?: "start" | "center" | "end";
}

const PORTFOLIO_NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#qui-je-suis", label: "Qui je suis" },
  { href: "#mes-projets", label: "Mes projets" },
  { href: "#mes-competences", label: "Mes competences" },
];

export const NavPortfolio: React.FC<NavPortfolioProps> = ({ className, style, justify = "end" }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const justifyClass = justify === "start" ? "justify-start" : justify === "center" ? "justify-center" : "justify-end";

  return (
    <nav
      className={`sm:bg-transparent sm:backdrop-blur-none sm:backdrop-saturate-100 relative ${className ?? ""}`}
      style={style}
    >
      <div className="flex items-center justify-between">
        <div className="sm:hidden flex items-center">
          <button
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <IoMdClose size={24} /> : <IoMdMenu size={24} />}
          </button>
        </div>

        <div className={`hidden sm:flex gap-4 grow ${justifyClass}`}>
          {PORTFOLIO_NAV_LINKS.map((link) => (
            <Link key={link.href} color="foreground" href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden flex flex-col gap-4 p-4">
          {PORTFOLIO_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              className="w-full"
              color="foreground"
              href={link.href}
              size="lg"
              onPress={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default NavPortfolio;
