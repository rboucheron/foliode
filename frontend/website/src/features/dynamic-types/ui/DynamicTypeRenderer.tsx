import type { CustomEntry, CustomType } from "../domain/custom-type"
import { visibleFields } from "../domain/custom-type"
import { useTranslation } from "@/i18n"

export function DynamicTypeRenderer({ type, entries }: { type: CustomType; entries: CustomEntry[] }) {
  const t = useTranslation()
  const fields = visibleFields(type.fields)
  const layout = type.layout === "grid" ? "grid grid-cols-1 gap-4 sm:grid-cols-2" : type.layout === "cards" ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col gap-3"
  return (
    <section className="flex flex-col gap-3">
      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("dashboard.dynamicTypes.noEntries")}</p>
      ) : (
        <div className={layout}>
          {entries.map(entry => (
            <article key={entry.id} className={type.layout === "cards" ? "rounded-xl border p-4 shadow-sm" : type.layout === "grid" ? "rounded-lg border p-3" : "border-b py-3"}>
              {fields.length === 0 ? (
                <p className="text-muted-foreground">{t("dashboard.dynamicTypes.noVisibleFields")}</p>
              ) : fields.map(field => {
                const value = entry.values[field.key]
                return value == null || value === "" ? null : (
                  <p key={field.key} className="mb-1">
                    <span className="font-medium">{field.label} : </span>
                    {field.type === "url" && typeof value === "string" ? (
                      <a className="text-primary underline" href={value} target="_blank" rel="noreferrer">{value}</a>
                    ) : String(value)}
                  </p>
                )
              })}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
