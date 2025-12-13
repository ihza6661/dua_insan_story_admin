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

export const formatRupiah = (amount: number): string => {
  // Divide by 1000 to remove last 3 digits
  const amountInThousands = Math.floor(amount / 1000);
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amountInThousands);
};
