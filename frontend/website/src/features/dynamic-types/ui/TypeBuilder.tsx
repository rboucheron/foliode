import { useState } from "react"
import { ArrowDownIcon, ArrowUpIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getApiErrorMessage } from "@/lib/http"
import { useTranslation } from "@/i18n"
import type { ContentLayout, CustomField, CustomType, FieldType } from "../domain/custom-type"
import { saveCustomType } from "../application/dynamic-types.api"

export function TypeBuilder({ siteId, initialType, onSaved }: {
  siteId: string
  initialType?: CustomType
  onSaved?: (type: CustomType) => void
}) {
  const t = useTranslation()
  const [name, setName] = useState(initialType?.name ?? "")
  const [layout, setLayout] = useState<ContentLayout>(initialType?.layout ?? "list")
  const [fields, setFields] = useState<CustomField[]>(initialType?.fields ?? [])
  const [label, setLabel] = useState("")
  const [fieldType, setFieldType] = useState<FieldType>("text")
  const [saving, setSaving] = useState(false)

  const addField = () => {
    if (!label.trim()) return
    const baseKey = label.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") || "champ"
    const key = fields.some(field => field.key === baseKey)
      ? `${baseKey}_${fields.length + 1}`
      : baseKey
    setFields(current => [
      ...current,
      { key, label: label.trim(), type: fieldType, visible: true, order: current.length },
    ])
    setLabel("")
  }

  const save = async () => {
    if (!name.trim()) return
    setSaving(true)
    try {
      const type = await saveCustomType(siteId, { name: name.trim(), layout, fields }, initialType?.id)
      onSaved?.(type)
      toast.success(t(initialType ? "dashboard.dynamicTypes.modified" : "dashboard.dynamicTypes.created"))
    } catch (error) {
      toast.error(getApiErrorMessage(error, t("dashboard.dynamicTypes.saveError")))
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="flex flex-col gap-4 rounded-xl border p-4">
      <h2 className="text-lg font-semibold">{t(initialType ? "dashboard.dynamicTypes.modifyTitle" : "dashboard.dynamicTypes.createTitle")}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="type-name">{t("dashboard.dynamicTypes.nameLabel")}</Label>
          <Input id="type-name" value={name} onChange={event => setName(event.target.value)} placeholder={t("dashboard.dynamicTypes.namePlaceholder")} />
        </div>
        <div className="space-y-2">
          <Label>{t("dashboard.dynamicTypes.layoutLabel")}</Label>
          <Select value={layout} onValueChange={value => setLayout(value as ContentLayout)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="list">{t("dashboard.dynamicTypes.layoutList")}</SelectItem>
              <SelectItem value="grid">{t("dashboard.dynamicTypes.layoutGrid")}</SelectItem>
              <SelectItem value="cards">{t("dashboard.dynamicTypes.layoutCards")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex-1">
          <Label htmlFor="field-label">{t("dashboard.dynamicTypes.newProperty")}</Label>
          <Input id="field-label" className="mt-2" value={label} onChange={event => setLabel(event.target.value)} placeholder={t("dashboard.dynamicTypes.propertyPlaceholder")} />
        </div>
        <div className="sm:w-44">
          <Label>{t("dashboard.dynamicTypes.fieldTypeLabel")}</Label>
          <Select value={fieldType} onValueChange={value => setFieldType(value as FieldType)}>
            <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="text">{t("dashboard.dynamicTypes.fieldText")}</SelectItem>
              <SelectItem value="textarea">{t("dashboard.dynamicTypes.fieldTextarea")}</SelectItem>
              <SelectItem value="date">{t("dashboard.dynamicTypes.fieldDate")}</SelectItem>
              <SelectItem value="url">{t("dashboard.dynamicTypes.fieldUrl")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="button" variant="outline" className="sm:mt-7" onClick={addField}>
          <PlusIcon />{t("dashboard.dynamicTypes.addProperty")}
        </Button>
      </div>
      <ul className="flex flex-col gap-2">
        {fields.map((field, index) => (
          <li key={field.key} className="flex flex-wrap items-center gap-2 rounded-lg border p-2">
            <span className="min-w-32 flex-1">{field.label} <span className="text-muted-foreground">({field.type})</span></span>
            <Label className="cursor-pointer">
              <input
                type="checkbox"
                checked={field.visible}
                onChange={event => setFields(current => current.map((item, itemIndex) =>
                  itemIndex === index ? { ...item, visible: event.target.checked } : item))}
              />
              {t("dashboard.dynamicTypes.visible")}
            </Label>
            <Button size="icon-sm" variant="ghost" disabled={index === 0} onClick={() => setFields(current => {
              const next = [...current]
              ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
              return next.map((item, itemIndex) => ({ ...item, order: itemIndex }))
            })} aria-label={t("dashboard.dynamicTypes.moveUp")}><ArrowUpIcon /></Button>
            <Button size="icon-sm" variant="ghost" disabled={index === fields.length - 1} onClick={() => setFields(current => {
              const next = [...current]
              ;[next[index + 1], next[index]] = [next[index], next[index + 1]]
              return next.map((item, itemIndex) => ({ ...item, order: itemIndex }))
            })} aria-label={t("dashboard.dynamicTypes.moveDown")}><ArrowDownIcon /></Button>
            <Button size="icon-sm" variant="ghost" onClick={() => setFields(current =>
              current.filter((_, itemIndex) => itemIndex !== index).map((item, itemIndex) => ({ ...item, order: itemIndex }))
            )} aria-label={t("dashboard.dynamicTypes.removeProperty")}><Trash2Icon /></Button>
          </li>
        ))}
      </ul>
      <Button onClick={() => void save()} disabled={!name.trim() || saving}>
        {saving ? t("dashboard.dynamicTypes.saving") : t(initialType ? "dashboard.dynamicTypes.saveChanges" : "dashboard.dynamicTypes.saveType")}
      </Button>
    </section>
  )
}
