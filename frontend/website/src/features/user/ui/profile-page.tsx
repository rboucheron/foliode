import { useEffect } from "react"
import { CircleCheckIcon, CircleXIcon, ExternalLinkIcon } from "lucide-react"
import { FaDribbble, FaGithub } from "react-icons/fa"
import type { IconType } from "react-icons"
import { toast } from "sonner"
import { DashboardTitle } from "@/components/layout/dashboard-title"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { getApiErrorMessage } from "@/lib/http"
import { useTranslation } from "@/i18n"
import type { OAuthProvider } from "../domain/user"
import { startOAuthSignIn } from "../application/session"
import { useUserStore } from "../application/user.store"
import { AvatarInput } from "./avatar-input"
import { TextField } from "./text-field"

interface LinkedAccountProps {
  provider: OAuthProvider
  name: string
  icon: IconType
  login: string | null
  profileUrl: string
}

function LinkedAccount({ provider, name, icon: Icon, login, profileUrl }: LinkedAccountProps) {
  const t = useTranslation()
  return (
    <div className="flex w-full flex-col items-center justify-between gap-2 rounded-lg border border-primary bg-card p-3 xl:flex-row xl:gap-0">
      <div className="flex flex-col items-center gap-3 xl:flex-row">
        <Icon size={45} />
        <div className="flex flex-col items-center xl:items-start xl:justify-between">
          <span>{name}</span>
          {login ? (
            <a
              href={profileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              {t("auth.profile.yourProfile")}
              <ExternalLinkIcon className="size-4" />
            </a>
          ) : (
            <button
              type="button"
              onClick={() => startOAuthSignIn(provider)}
              className="inline-flex cursor-pointer items-center gap-1 transition-opacity hover:opacity-80"
            >
              {t("auth.profile.link")}
              <ExternalLinkIcon className="size-4" />
            </button>
          )}
        </div>
      </div>
      <div
        className={cn(
          "flex h-max w-max items-center gap-2 rounded-full border px-3 text-white",
          login ? "border-green-700 bg-green-500" : "border-red-700 bg-red-500"
        )}
      >
        {login ? <CircleCheckIcon className="size-4" /> : <CircleXIcon className="size-4" />}
        {login ? t("auth.profile.linked") : t("auth.profile.notLinked")}
      </div>
    </div>
  )
}

export function ProfilePage() {
  const t = useTranslation()
  const user = useUserStore((state) => state.user)
  const setUser = useUserStore((state) => state.setUser)
  const fetchFromJwt = useUserStore((state) => state.fetchFromJwt)
  const updateUser = useUserStore((state) => state.updateUser)

  useEffect(() => {
    fetchFromJwt()
  }, [fetchFromJwt])

  if (!user) return null

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      await updateUser()
      toast.success(t("auth.profile.updated"))
    } catch (error) {
      toast.error(getApiErrorMessage(error, t("auth.profile.updateFailed")))
    }
  }

  return (
    <>
      <DashboardTitle title={t("auth.profile.title")} />
      <div className="flex w-full flex-col gap-3 xl:flex-row">
        <section className="flex flex-col items-center rounded-xl border bg-card p-5 text-card-foreground xl:min-h-[calc(100vh-7rem)]">
          <div className="mb-3">
            <AvatarInput size={150} />
          </div>
          <div className="flex items-center gap-1 text-sm">
            <p>{user.lastname}</p>
            <p>{user.firstname}</p>
          </div>
        </section>

        <section className="flex flex-col items-center gap-3 rounded-xl border bg-card p-5 text-card-foreground xl:min-h-[calc(100vh-7rem)] xl:flex-1 xl:items-start xl:gap-5">
          <h3 className="text-lg font-bold xl:text-2xl">{t("auth.profile.account")}</h3>
          <div className="flex w-full flex-col gap-5 xl:w-9/12 xl:flex-row xl:gap-10">
            <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3 xl:w-9/12 xl:gap-8">
              <TextField
                id="profile-lastname"
                label={t("auth.profile.lastname")}
                placeholder={t("auth.profile.lastnamePlaceholder")}
                value={user.lastname}
                onChange={(event) => setUser({ lastname: event.target.value })}
              />
              <TextField
                id="profile-firstname"
                label={t("auth.profile.firstname")}
                placeholder={t("auth.profile.firstnamePlaceholder")}
                value={user.firstname}
                onChange={(event) => setUser({ firstname: event.target.value })}
              />
              <TextField
                id="profile-email"
                label={t("auth.profile.email")}
                placeholder={t("auth.profile.emailPlaceholder")}
                value={user.email}
                onChange={(event) => setUser({ email: event.target.value })}
              />
              <div className="w-full xl:w-3/12">
                <Button type="submit" className="w-full">
                  {t("auth.profile.submit")}
                </Button>
              </div>
            </form>

            <Separator orientation="vertical" className="hidden bg-primary xl:block" />

            <div className="my-2 flex w-full items-center gap-5 xl:hidden">
              <Separator className="flex-1 bg-primary" />
              <span className="text-center text-sm whitespace-nowrap">{t("auth.profile.linkAccounts")}</span>
              <Separator className="flex-1 bg-primary" />
            </div>

            <div className="flex flex-col items-center gap-2 xl:w-6/12 xl:gap-5">
              <LinkedAccount
                provider="github"
                name="Github"
                icon={FaGithub}
                login={user.github_login}
                profileUrl={`https://github.com/${user.github_login ?? ""}`}
              />
              <LinkedAccount
                provider="dribbble"
                name="Dribbble"
                icon={FaDribbble}
                login={user.dribbble_login}
                profileUrl={`https://dribbble.com/${user.dribbble_login ?? ""}`}
              />
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
