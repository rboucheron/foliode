import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/i18n";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: AuthLayoutProps) {
  const t = useTranslation();
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-linear-to-tr from-muted via-background to-muted/50 p-4 transition-colors duration-300 sm:p-6">
      <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border bg-card/80 p-6 shadow-xl backdrop-blur-md sm:p-8">
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <div className="rounded-full border border-primary/20 bg-primary/10 p-3 transition-transform duration-300 hover:scale-105">
            <img
              src="/foliode-icon.svg"
              alt={t("auth.layout.logoAlt")}
              width={48}
              height={48}
            />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>

        {children}

        <div className="my-1 flex w-full items-center gap-4">
          <Separator className="flex-1" />
          <span className="text-xs font-semibold tracking-wider whitespace-nowrap text-muted-foreground uppercase">
            {t("auth.layout.or")}
          </span>
          <Separator className="flex-1" />
        </div>

        {footer}
      </div>
    </div>
  );
}

export function AuthError({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <p
      role="alert"
      id={id}
      data-testid={id}
      className="rounded-lg border border-destructive/30 bg-destructive/10 p-2.5 text-sm font-medium text-destructive"
    >
      {children}
    </p>
  );
}
