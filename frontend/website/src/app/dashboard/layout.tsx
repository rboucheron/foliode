"use client";

import { FoliodeSidebar } from "@/shared/shell";
import { useSidebar } from "@rboucheron/ui"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isOpen } = useSidebar();

  return (
    <>
      <FoliodeSidebar />
      <div className={`p-2 duration-300 ${isOpen ? 'ml-[315px]' : 'ml-[90px]'}`}>
        {children}
      </div>
    </>
  )
}