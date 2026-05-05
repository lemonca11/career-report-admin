export type AdminRoleCode = 'SUPER_ADMIN' | 'ADMIN';

export type AdminAccountStatus = 'active' | 'disabled';

export interface AdminUser {
  id: string;
  username: string;
  passwordHash: string;
  name: string;
  mobile?: string;
  roleCode: AdminRoleCode;
  status: AdminAccountStatus;
  lastLoginAt?: string;
  createdAt: string;
  createdBy: string;
}

export interface CreateAdminUserPayload {
  username: string;
  password: string;
  name: string;
  mobile?: string;
}

export interface UpdateAdminUserPayload {
  name: string;
  mobile?: string;
  status: AdminAccountStatus;
}
