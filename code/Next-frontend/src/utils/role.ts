export function isAdminRole(role?: string) {
    return role?.toUpperCase().replace(/^ROLE_/, "") === "ADMIN";
}
