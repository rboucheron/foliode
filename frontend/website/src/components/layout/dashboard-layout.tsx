import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useTranslation } from "@/i18n";
import { AppSidebar } from "./app-sidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslation();
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center px-2">
          <SidebarTrigger aria-label={t("common.nav.toggleSidebar")} />
        </header>
        <div className="flex flex-1 flex-col p-2 pt-0 md:p-4 md:pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
