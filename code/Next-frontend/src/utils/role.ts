export function isSuperAdmin(role?: string) {
    const normalizedRole = role?.toUpperCase().replace(/^ROLE_/, "");
    return normalizedRole === "ADMIN";
}

export function isStaffOrAdmin(role?: string) {
    const normalizedRole = role?.toUpperCase().replace(/^ROLE_/, "");
    return normalizedRole === "ADMIN" || normalizedRole === "LIBRARIAN";
}
