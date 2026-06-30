export interface Permission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface PermissionModule {
  id: string;
  name: string;
  icon: string;
  permissions: Permission[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  modules: PermissionModule[];
}