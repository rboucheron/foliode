import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getApiErrorMessage } from "@/lib/http"
import { useTranslation } from "@/i18n"
import type { CustomEntry, CustomField } from "../domain/custom-type"
import { saveEntry } from "../application/dynamic-types.api"

export function DynamicEntryForm({ siteId, typeId, fields, initialEntry, onSaved }: {
  siteId: string
  typeId: string
  fields: CustomField[]
  initialEntry?: CustomEntry
  onSaved?: (entry: CustomEntry) => void
}) {
  const t = useTranslation()
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map(field => [field.key, String(initialEntry?.values[field.key] ?? "")]))
  )
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    try {
      const entry = await saveEntry(siteId, typeId, values, initialEntry?.id)
      toast.success(t(initialEntry ? "dashboard.dynamicTypes.entryModified" : "dashboard.dynamicTypes.entryAdded"))
      onSaved?.(entry)
    } catch (error) {
      toast.error(getApiErrorMessage(error, t("dashboard.dynamicTypes.entrySaveError")))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={event => {
        event.preventDefault()
        void save()
      }}
    >
      {fields.map(field => (
        <div key={field.key} className="space-y-2">
          <Label htmlFor={`entry-${initialEntry?.id ?? "new"}-${field.key}`}>{field.label}</Label>
          {field.type === "textarea" ? (
            <Textarea
              id={`entry-${initialEntry?.id ?? "new"}-${field.key}`}
              value={values[field.key] ?? ""}
              onChange={event => setValues(current => ({ ...current, [field.key]: event.target.value }))}
            />
          ) : (
            <Input
              id={`entry-${initialEntry?.id ?? "new"}-${field.key}`}
              type={field.type === "date" ? "date" : field.type === "url" ? "url" : "text"}
              value={values[field.key] ?? ""}
              onChange={event => setValues(current => ({ ...current, [field.key]: event.target.value }))}
            />
          )}
        </div>
      ))}
      <Button type="submit" disabled={saving}>
        {saving ? t("dashboard.dynamicTypes.saving") : t(initialEntry ? "dashboard.dynamicTypes.saveChanges" : "dashboard.dynamicTypes.addEntry")}
      </Button>
    </form>
  )
}
