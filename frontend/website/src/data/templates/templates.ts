import { Template } from "@/interfaces/Template";

export const templates: Template[] = [
    {
      id: "template-3",
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
      id: "template-1",
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
      id: "template-2",
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
  ];