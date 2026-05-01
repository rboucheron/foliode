import { HeroUIProvider } from "@heroui/react";
import { SidebarProvider } from "@/contexts/SidebarContext"
import { ThemeProvider } from "next-themes";


import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
       <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <HeroUIProvider>
            <SidebarProvider>
              {children}
            </SidebarProvider>
          </HeroUIProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
