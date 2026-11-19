export type FieldType = "text" | "textarea" | "date" | "url"
export type ContentLayout = "list" | "grid" | "cards"
export interface CustomField { key: string; label: string; type: FieldType; visible: boolean; order: number }
export interface CustomType { id: string; name: string; layout: ContentLayout; fields: CustomField[] }
export interface CustomEntry { id: string; values: Record<string, string | number | boolean | null>; createdAt: string }
export const visibleFields = (fields: CustomField[]): CustomField[] =>
  fields.filter(field => field.visible).sort((a,b) => a.order - b.order)
