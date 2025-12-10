//src/utill/permission.js
export const hasPermission = (perm) => {
  if (!perm) return false;
  try {
    const permArr = JSON.parse(localStorage.getItem("permissions"));
    if (Array.isArray(permArr)) {
      return permArr.includes(perm);
    }
  } catch (e) {
    console.log(e)
  }
  try {
    const storedUser = JSON.parse(localStorage.getItem("app_auth_user"));
    if (!storedUser) return false;
    const rolePerms =
      storedUser.permissions || storedUser.role?.permissions || [];
    const permissionNames = rolePerms.map((p) => p?.name).filter(Boolean);
    return permissionNames.includes(perm);
  } catch (e) {
    console.error("hasPermission error parsing localStorage", e);
    return false;
  }
};
