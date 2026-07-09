export const DEFAULT_BACKEND_URL = "https://lms-backend-345298684510.europe-west1.run.app";
export const DEFAULT_FRONTEND_URL = "https://library-management-lovat-theta.vercel.app";

const LOCAL_HOSTS = ["localhost", "127.0.0.1"];

export function getServerBackendUrl() {
    return process.env.BACKEND_INTERNAL_URL || process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || DEFAULT_BACKEND_URL;
}

export function getClientApiBaseUrl() {
    const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL || "";

    if (typeof window === "undefined") {
        return getServerBackendUrl();
    }

    if (!configuredApiUrl) {
        return "";
    }

    try {
        const apiUrl = new URL(configuredApiUrl);
        const isLocalBackend = LOCAL_HOSTS.includes(apiUrl.hostname);
        const isLocalFrontend = LOCAL_HOSTS.includes(window.location.hostname);

        return isLocalBackend && !isLocalFrontend ? "" : configuredApiUrl;
    } catch {
        return configuredApiUrl;
    }
}
