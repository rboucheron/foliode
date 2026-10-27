import { Link, useLocation, useNavigate } from "@tanstack/react-router"
import {
  BrainIcon,
  FolderIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MessagesSquareIcon,
  MoonIcon,
  PaletteIcon,
  SquarePenIcon,
  SunIcon,
  UserIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useTheme } from "@/components/theme/theme-provider"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { clearAuthToken } from "@/features/user"

type DashboardPath =
  | "/dashboard"
  | "/dashboard/profile"
  | "/dashboard/skills"
  | "/dashboard/projects"
  | "/dashboard/comments"
  | "/dashboard/edit"
  | "/dashboard/theme"

const NAV_ITEMS: ReadonlyArray<{ name: string; icon: LucideIcon; to: DashboardPath }> = [
  { name: "Tableau de bord", icon: LayoutDashboardIcon, to: "/dashboard" },
  { name: "Profile", icon: UserIcon, to: "/dashboard/profile" },
  { name: "Mes compétences", icon: BrainIcon, to: "/dashboard/skills" },
  { name: "Mes projets", icon: FolderIcon, to: "/dashboard/projects" },
  { name: "Commentaires", icon: MessagesSquareIcon, to: "/dashboard/comments" },
  { name: "Editer", icon: SquarePenIcon, to: "/dashboard/edit" },
  { name: "Thème", icon: PaletteIcon, to: "/dashboard/theme" },
]

const normalizePath = (path: string): string => (path.length > 1 ? path.replace(/\/+$/, "") : path)

function ThemeMenuItem() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const label = isDark ? "Mode nuit" : "Mode jour"

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={label}
        aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
        onClick={() => setTheme(isDark ? "light" : "dark")}
      >
        {isDark ? <MoonIcon /> : <SunIcon />}
        <span>{label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function SignOutMenuItem() {
  const navigate = useNavigate()

  const handleSignOut = () => {
    clearAuthToken()
    void navigate({ to: "/login" })
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton tooltip="Se déconnecter" onClick={handleSignOut}>
        <LogOutIcon />
        <span>Se déconnecter</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function AppSidebar() {
  const pathname = useLocation({ select: (location) => normalizePath(location.pathname) })

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip="Foliode">
              <Link to="/dashboard">
                <img src="/foliode-icon.svg" alt="logo foliode" width={32} height={32} className="size-8 shrink-0" />
                <span className="text-xl font-normal">Foliode</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {NAV_ITEMS.map(({ name, icon: Icon, to }) => {
                const isActive = pathname === to
                return (
                  <SidebarMenuItem key={to}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={name}
                      className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                    >
                      <Link to={to} aria-current={isActive ? "page" : undefined}>
                        <Icon />
                        <span>{name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <ThemeMenuItem />
          <SignOutMenuItem />
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
