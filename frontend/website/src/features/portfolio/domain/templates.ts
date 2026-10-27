import type { Colors } from "./portfolio"

export interface Template {
  id: string
  name: string
  preview: string
  color: Colors
}

export const TEMPLATE_IDS = {
  bento: "template-1",
  emerald: "template-2",
  prestige: "template-3",
} as const

export const templates: Template[] = [
  {
    id: TEMPLATE_IDS.prestige,
    name: "Prestige",
    preview: "/templates/luxury.png",
    color: {
      primary: "#0E0E0E",
      secondary: "#DAC6A7",
      warning: "#0E0E0E",
      success: "#DAC6A7",
      info: "#343230",
      light: "#181716",
    },
  },
  {
    id: TEMPLATE_IDS.bento,
    name: "Bento",
    preview: "/templates/bento.png",
    color: {
      primary: "#669BBC",
      secondary: "#FDF0D5",
      warning: "#ffc107",
      success: "#28a745",
      info: "#17a2b8",
      light: "#003049",
    },
  },
  {
    id: TEMPLATE_IDS.emerald,
    name: "Emerald",
    preview: "/templates/emerald.png",
    color: {
      primary: "#334B35",
      secondary: "#FFFFFF",
      warning: "#F6EEE1",
      success: "#FAAF15",
      info: "#231C0A",
      light: "#334B35",
    },
  },
]

export interface TemplateStyle extends Colors {
  name: string
}

/** Palettes proposées, indépendamment du template choisi. */
export const templatesStyles: TemplateStyle[] = templates.map(({ name, color }) => ({ name, ...color }))
