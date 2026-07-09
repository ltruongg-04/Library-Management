import { UI_TEXT } from "@/constants/ui-text";
import type { Permission, PermissionModule, Role } from "@/types/role";

type TextPair = {
    name: string;
    description: string;
};

const ROLE_TEXT_BY_ID: Record<string, TextPair> = {
    admin: {
        name: UI_TEXT.ROLES.ROLE.ADMINISTRATOR.NAME,
        description: UI_TEXT.ROLES.ROLE.ADMINISTRATOR.DESCRIPTION,
    },
    librarian: {
        name: UI_TEXT.ROLES.ROLE.LIBRARIAN.NAME,
        description: UI_TEXT.ROLES.ROLE.LIBRARIAN.DESCRIPTION,
    },
    customer: {
        name: UI_TEXT.ROLES.ROLE.CUSTOMER.NAME,
        description: UI_TEXT.ROLES.ROLE.CUSTOMER.DESCRIPTION,
    },
    user: {
        name: UI_TEXT.ROLES.ROLE.CUSTOMER.NAME,
        description: UI_TEXT.ROLES.ROLE.CUSTOMER.DESCRIPTION,
    },
    guest: {
        name: UI_TEXT.ROLES.ROLE.GUEST.NAME,
        description: UI_TEXT.ROLES.ROLE.GUEST.DESCRIPTION,
    },
};

const MODULE_NAME_BY_ID: Record<string, string> = {
    books: UI_TEXT.ROLES.MODULE.BOOKS,
    borrow: UI_TEXT.ROLES.MODULE.BORROWING,
    reviews: UI_TEXT.ROLES.MODULE.REVIEWS,
    settings: UI_TEXT.ROLES.MODULE.SETTINGS,
    roles: UI_TEXT.ROLES.MODULE.ROLES,
};

const PERMISSION_TEXT_BY_ID: Record<string, TextPair> = {
    "books.add-book": {
        name: UI_TEXT.ROLES.PERMISSION.ADD_BOOK.TITLE,
        description: UI_TEXT.ROLES.PERMISSION.ADD_BOOK.DESCRIPTION,
    },
    "books.edit-book": {
        name: UI_TEXT.ROLES.PERMISSION.EDIT_BOOK.TITLE,
        description: UI_TEXT.ROLES.PERMISSION.EDIT_BOOK.DESCRIPTION,
    },
    "books.delete-book": {
        name: UI_TEXT.ROLES.PERMISSION.DELETE_BOOK.TITLE,
        description: UI_TEXT.ROLES.PERMISSION.DELETE_BOOK.DESCRIPTION,
    },
    "borrow.approve": {
        name: UI_TEXT.ROLES.PERMISSION.APPROVE_BORROWS.TITLE,
        description: UI_TEXT.ROLES.PERMISSION.APPROVE_BORROWS.DESCRIPTION,
    },
    "borrow.fine": {
        name: UI_TEXT.ROLES.PERMISSION.WAIVE_FINES.TITLE,
        description: UI_TEXT.ROLES.PERMISSION.WAIVE_FINES.DESCRIPTION,
    },
    "reviews.moderate": {
        name: UI_TEXT.ROLES.PERMISSION.MODERATE_REVIEWS.TITLE,
        description: UI_TEXT.ROLES.PERMISSION.MODERATE_REVIEWS.DESCRIPTION,
    },
    "settings.manage": {
        name: UI_TEXT.ROLES.PERMISSION.MANAGE_SETTINGS.TITLE,
        description: UI_TEXT.ROLES.PERMISSION.MANAGE_SETTINGS.DESCRIPTION,
    },
    "roles.manage": {
        name: UI_TEXT.ROLES.PERMISSION.MANAGE_ROLES.TITLE,
        description: UI_TEXT.ROLES.PERMISSION.MANAGE_ROLES.DESCRIPTION,
    },
};

function localizePermission(moduleId: string, permission: Permission): Permission {
    const text = PERMISSION_TEXT_BY_ID[`${moduleId}.${permission.id}`];

    if (!text) {
        return permission;
    }

    return {
        ...permission,
        name: text.name,
        description: text.description,
    };
}

function localizeModule(module: PermissionModule): PermissionModule {
    return {
        ...module,
        name: MODULE_NAME_BY_ID[module.id] ?? module.name,
        permissions: module.permissions.map((permission) => localizePermission(module.id, permission)),
    };
}

export function localizeRole(role: Role): Role {
    const text = ROLE_TEXT_BY_ID[role.id];

    return {
        ...role,
        name: text?.name ?? role.name,
        description: text?.description ?? role.description,
        modules: role.modules.map(localizeModule),
    };
}

export function localizeRoles(roles: Role[]): Role[] {
    return roles.map(localizeRole);
}
