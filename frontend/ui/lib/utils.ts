import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { createAvatar } from "@dicebear/core"
import { bigSmile } from "@dicebear/collection"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const formatImage = (link: string) => {
  return apiUrl + "/" + link;
};

export const generateAvatar = (size: number, seed: string) => {
  const avatar = createAvatar(bigSmile, {
    seed,
    size,
    backgroundColor: ["b6e3f4", "c0aede", "ffdfbf"],
    skinColor: ["8c5a2b", "643d19", "a47539", "c99c62", "e2ba87", "efcc9f", "f5d7b1", "ffe4c0"],
    hair: ["bangs", "braids", "halfShavedHead", "froBun", "wavyBob", "mohawk", "curlyShortHair", "bowlCutHair", "shortHair"],
  });
  return avatar.toDataUri();
};
