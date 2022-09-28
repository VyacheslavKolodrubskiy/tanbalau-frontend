import { isString } from '@/utils/type-checks';
import { ROLES } from '@/config/types';
import type { PermissionRole } from '@/types';
import { useUserStore } from '@/stores/user.store';

export const checkPermission = (
  roles?: PermissionRole | PermissionRole[],
  roleId = useUserStore().currentRole?.id,
): boolean => {
  if (!roles)
    return true;

  const rolesArray = isString(roles) ? [roles] : roles;
  const currentRoleId = roleId;
  const data = Object.keys(ROLES).filter(key => (ROLES as any)[key].id === currentRoleId);
  return (rolesArray as string[]).includes(data[0]);
};

export const canUse = checkPermission;
