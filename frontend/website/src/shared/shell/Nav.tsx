"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoMdClose, IoMdMenu } from "react-icons/io";

import { HerouiButton as Button, ThemeSwitcher } from "@rboucheron/ui";

import { links } from "@/data/nav/links";
import { clearClientSessionCookie } from "@/auth/application/session.client";
import { UserAvatar } from "@/user/ui/UserAvatar";
import { useUser } from "@/user/store/useUser";
import { useTheme } from "next-themes";

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { user, fetchFromJwt } = useUser();

  const handleSignOut = () => {
    clearClientSessionCookie();
    router.push("/");
  };

  useEffect(() => {
    fetchFromJwt();
  }, [fetchFromJwt]);

  return (
    <nav className="relative z-50 backdrop-blur-none bg-background/100 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <IoMdClose size={24} /> : <IoMdMenu size={24} />}
          </button>
          <Image
            src="/foliode-icon.svg"
            alt="logo foliode"
            width={25}
            height={25}
          />
          <p className="text-26 font-normal">Foliode</p>
        </div>

        <div className="hidden sm:flex gap-9 items-center justify-center">
          {links.map((link, index) => (
            <Link key={index} className="text-20" href={link.href}>
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3">
          {user ? (
            <>
              <Button
                text="Déconnexion"
                onPress={handleSignOut}
                className="hidden sm:flex gap-9 bg-transparent p-3 box-border border-2 border-white/[0.04] rounded-[32px] shadow-[inset_0px_2px_0px_0px_rgba(141,169,162,0.33),inset_0px_-2px_0px_0px_rgba(141,169,162,0.33)]"
              />
              <div className="hidden lg:flex">
                <UserAvatar size={40} />
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden lg:flex bg-transparent p-3 box-border border-2 border-white/[0.04] rounded-[32px] shadow-[inset_0px_2px_0px_0px_rgba(141,169,162,0.33),inset_0px_-2px_0px_0px_rgba(141,169,162,0.33)]"
              >
                Connexion
              </Link>
              <Link className="hidden sm:flex text-20" href="/signup">
                Inscription
              </Link>
            </>
          )}

          <div className="ml-2">
            <ThemeSwitcher useTheme={useTheme} />
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden flex flex-col gap-4 p-4">
          {links.map((link, index) => (
            <Link
              key={index}
              className="w-full"
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          {user ? (
            <button
              onClick={() => {
                setIsMenuOpen(false);
                handleSignOut();
              }}
              className="w-full text-left"
            >
              Déconnexion
            </button>
          ) : (
            <>
              <Link
                className="w-full"
                href="/login"
                onClick={() => setIsMenuOpen(false)}
              >
                Connexion
              </Link>
              <Link
                className="w-full"
                href="/signup"
                onClick={() => setIsMenuOpen(false)}
              >
                Inscription
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}