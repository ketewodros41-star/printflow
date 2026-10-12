import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatETB(amount: number): string {
  return new Intl.NumberFormat('am-ET', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `PF-${ts}-${rand}`
}

export function calcProfit(retail: number, production: number, shipping: number): number {
  return Math.max(0, retail - production - shipping)
}

export function calcProfitMargin(retail: number, profit: number): number {
  if (retail === 0) return 0
  return Math.round((profit / retail) * 100)
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n - 1) + '…' : str
}

// Exchange rate helper (ETB ↔ USD, refresh from env or API in production)
export const ETB_RATE = parseFloat(process.env.NEXT_PUBLIC_ETB_RATE ?? '56.5')

export function etbToUsd(etb: number): number {
  return etb / ETB_RATE
}

export function usdToEtb(usd: number): number {
  return usd * ETB_RATE
}
