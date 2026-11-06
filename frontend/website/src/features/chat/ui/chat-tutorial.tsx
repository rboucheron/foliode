import { useTranslation } from "@/i18n"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CircleHelpIcon, SparklesIcon } from "lucide-react"

export function ChatTutorial() {
    const t = useTranslation()

    return (
        <aside className="hidden min-h-0 flex-col gap-4 overflow-y-auto lg:flex">
            <Card className="border-0 bg-gradient-to-br from-violet-500/10 to-indigo-500/5 shadow-none ring-0">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base"><SparklesIcon className="size-4 text-violet-500" />{t("chat.page.aboutTitle")}</CardTitle>
                    <CardDescription>{t("chat.page.aboutDescription")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <p>{t("chat.page.aboutDetails")}</p>
                    <div className="flex items-start gap-2 rounded-lg bg-muted p-3"><CircleHelpIcon className="mt-0.5 size-4 shrink-0 text-primary" /><span>{t("chat.page.aboutTip")}</span></div>
                </CardContent>
            </Card>
            <Card className="border-0 bg-gradient-to-br from-violet-500/10 to-indigo-500/5 shadow-none ring-0">
                <CardHeader>
                    <CardTitle className="text-base">{t("chat.page.examplesTitle")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>{t("chat.page.exampleProjects")}</p>
                    <p>{t("chat.page.exampleDescription")}</p>
                    <p>{t("chat.page.exampleGreeting")}</p>
                </CardContent>
            </Card>
        </aside>
    )
}

