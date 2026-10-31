import { Link, useLocation, useNavigate } from "@tanstack/react-router"
import {
  BrainIcon,
  FolderIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MessagesSquareIcon,
  MoonIcon,
  PaletteIcon,
  Settings2Icon,
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
import { useTranslation } from "@/i18n"
import type { TranslationKey } from "@/i18n"

type DashboardPath =
  | "/dashboard"
  | "/dashboard/profile"
  | "/dashboard/skills"
  | "/dashboard/projects"
  | "/dashboard/comments"
  | "/dashboard/edit"
  | "/dashboard/theme"
  | "/dashboard/settings"

const NAV_ITEMS: ReadonlyArray<{ labelKey: TranslationKey; icon: LucideIcon; to: DashboardPath }> = [
  { labelKey: "common.nav.overview", icon: LayoutDashboardIcon, to: "/dashboard" },
  { labelKey: "common.nav.profile", icon: UserIcon, to: "/dashboard/profile" },
  { labelKey: "common.nav.skills", icon: BrainIcon, to: "/dashboard/skills" },
  { labelKey: "common.nav.projects", icon: FolderIcon, to: "/dashboard/projects" },
  { labelKey: "common.nav.comments", icon: MessagesSquareIcon, to: "/dashboard/comments" },
  { labelKey: "common.nav.edit", icon: SquarePenIcon, to: "/dashboard/edit" },
  { labelKey: "common.nav.theme", icon: PaletteIcon, to: "/dashboard/theme" },
  { labelKey: "common.nav.settings", icon: Settings2Icon, to: "/dashboard/settings" },
]

const normalizePath = (path: string): string => (path.length > 1 ? path.replace(/\/+$/, "") : path)

function ThemeMenuItem() {
  const { resolvedTheme, setTheme } = useTheme()
  const t = useTranslation()
  const isDark = resolvedTheme === "dark"
  const label = isDark ? t("common.theme.dark") : t("common.theme.light")

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={label}
        aria-label={isDark ? t("common.theme.switchToLight") : t("common.theme.switchToDark")}
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
  const t = useTranslation()

  const handleSignOut = () => {
    clearAuthToken()
    void navigate({ to: "/login" })
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton tooltip={t("common.auth.signOut")} onClick={handleSignOut}>
        <LogOutIcon />
        <span>{t("common.auth.signOut")}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function AppSidebar() {
  const pathname = useLocation({ select: (location) => normalizePath(location.pathname) })
  const t = useTranslation()

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip="Foliode">
              <Link to="/dashboard">
                <img src="/foliode-icon.svg" alt={t("common.brand.logoAlt")} width={32} height={32} className="size-8 shrink-0" />
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
              {NAV_ITEMS.map(({ labelKey, icon: Icon, to }) => {
                const isActive = pathname === to
                const name = t(labelKey)
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
