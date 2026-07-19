'use client';

import { Link, Button } from '@heroui/react';

import Image from 'next/image';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { ThemeSwitcher } from '@rboucheron/ui';
import { UserAvatar } from '@/components/UserAvatar';
import { useRouter } from 'next/navigation';
import { links } from '@/data/nav/links';
import { useUserStore } from "@/store/user.store";
import { IoMdMenu, IoMdClose } from "react-icons/io";


export default function Nav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();
    const { user, fetchFromJwt } = useUserStore();

    const handleSignOut = () => {
        document.cookie = "token_auth=; max-age=0; path=/;";
        router.push("/");
    };

    useEffect(() => {
        fetchFromJwt();
    }, []);

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
                    <Image src="/foliode-icon.svg" alt="logo foliode" width={25} height={25} />
                    <p className="text-26 font-normal">Foliode</p>
                </div>

                <div className="hidden sm:flex gap-9 items-center justify-center">
                    {links.map((link, index) => (
                        <Link key={index} className="text-20" aria-current="page" href={link.href}>
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center justify-end gap-3">
                    {user ? (
                        <>
                            <Button
                                onPress={handleSignOut}
                                className="hidden sm:flex gap-9 bg-transparent p-3 box-border border-2 border-white/[0.04] rounded-[32px] shadow-[inset_0px_2px_0px_0px_rgba(141,169,162,0.33),inset_0px_-2px_0px_0px_rgba(141,169,162,0.33)]"
                            >
                                Déconnexion
                            </Button>
                            <div className="hidden lg:flex">
                                <UserAvatar size={40} />
                            </div>
                        </>
                    ) : (
                        <>
                            <Button
                                as={Link}
                                href="/login"
                                className="hidden lg:flex bg-transparent p-3 box-border border-2 border-white/[0.04] rounded-[32px] shadow-[inset_0px_2px_0px_0px_rgba(141,169,162,0.33),inset_0px_-2px_0px_0px_rgba(141,169,162,0.33)]"
                            >
                                Connexion
                            </Button>
                            <Link className="hidden sm:flex text-20" color="foreground" href="/signup">
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
                            color="foreground"
                            href={link.href}
                            size="lg"
                            onPress={() => setIsMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    {user ? (
                        <Link
                            onPress={() => { setIsMenuOpen(false); handleSignOut(); }}
                            className="w-full"
                            color="danger"
                            size="lg"
                        >
                            Déconnexion
                        </Link>
                    ) : (
                        <>
                            <Link
                                className="w-full"
                                href="/login"
                                color="primary"
                                size="lg"
                                onPress={() => setIsMenuOpen(false)}
                            >
                                Connexion
                            </Link>
                            <Link
                                className="w-full"
                                href="/signup"
                                color="primary"
                                size="lg"
                                onPress={() => setIsMenuOpen(false)}
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
