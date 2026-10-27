import { PUBLIC_API_URL } from "@/lib/http";

export const formatImage = (link: string): string =>
  `${PUBLIC_API_URL}/${link}`;
