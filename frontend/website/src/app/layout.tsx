import { HeroUIProvider } from "@heroui/react";
import { SidebarProvider } from "@rboucheron/ui";
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          value={{
            light: "dayMode",
            dark: "nightMode"
          }}
        >
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
