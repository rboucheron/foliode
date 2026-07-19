"use client";

import FoliodeSidebar from "@/components/Sidebar";
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