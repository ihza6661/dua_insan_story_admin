import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getImageUrl = (path: string | null | undefined): string => {
  if (!path) {
    return "/placeholder.svg";
  }
  if (path.startsWith("http")) {
    return path;
  }
  const storageUrl = (process.env.NEXT_PUBLIC_STORAGE_URL || "").replace(/\/$/, ''); // Remove trailing slash
  const imagePath = path.replace(/^\//, ''); // Remove leading slash
  return `${storageUrl}/${imagePath}`;
};
