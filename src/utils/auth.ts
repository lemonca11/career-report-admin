import type { AdminRoleCode } from '@/types/admin';

export interface AdminSessionUser {
  id?: string;
  username: string;
  name: string;
  roleCode: AdminRoleCode;
}

const normalizeRoleCode = (value?: string | null): AdminRoleCode => {
  if (value === 'SUPER_ADMIN' || value === 'super_admin') return 'SUPER_ADMIN';
  if (value === 'ADMIN' || value === 'admin') return 'ADMIN';
  return 'ADMIN';
};

export const getStoredAdminUser = (): AdminSessionUser | null => {
  const raw = localStorage.getItem('admin_user') || sessionStorage.getItem('admin_user');

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as {
      id?: string;
      username?: string;
      name?: string;
      roleCode?: string;
      role?: string;
    };

    if (!parsed.username || !parsed.name) {
      return null;
    }

    return {
      id: parsed.id,
      username: parsed.username,
      name: parsed.name,
      roleCode: normalizeRoleCode(parsed.roleCode || parsed.role),
    };
  } catch {
    return null;
  }
};

export const isSuperAdmin = (user: Pick<AdminSessionUser, 'roleCode'> | null | undefined) =>
  user?.roleCode === 'SUPER_ADMIN';

export const getAdminRoleLabel = (roleCode: AdminRoleCode) =>
  roleCode === 'SUPER_ADMIN' ? '超级管理员' : '非超级管理员';
