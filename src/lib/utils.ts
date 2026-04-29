import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function maskCurrency(value: string) {
  value = value.replace(/\D/g, "");
  value = (Number(value) / 100).toFixed(2) + "";
  value = value.replace(".", ",");
  value = value.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
  value = value.replace(/(\d)(\d{3}),/g, "$1.$2,");
  return "R$ " + value;
}

export function parseCurrency(value: string): number {
  return Number(value.replace(/\D/g, "")) / 100;
}

export function maskPhone(value: string) {
  value = value.replace(/\D/g, "");
  if (value.length <= 10) {
    return value.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  return value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
}

export function maskCEP(value: string) {
  value = value.replace(/\D/g, "");
  return value.replace(/(\d{5})(\d{3})/, "$1-$2").substring(0, 9);
}

export function maskDate(value: string) {
  value = value.replace(/\D/g, "");
  return value
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d)/, "$1")
    .substring(0, 10);
}
