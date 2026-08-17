import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { UI_TEXT } from "@/constants/ui-text";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);
}

export function getErrorMessage(error: unknown, fallbackMessage = UI_TEXT.COMMON.ERROR_DEFAULT): string {
    if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
            return error.response.data.message;
        }
        if (error.code === "ECONNABORTED" || error.message === "Network Error") {
            return UI_TEXT.COMMON.ERROR_NETWORK;
        }
        return error.message || fallbackMessage;
    }
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === "string") {
        return error;
    }
    return fallbackMessage;
}
