export function getRedirectPath(role: string) {
  switch (role) {
    case "superadmin":
    case "admin":
      return "/admin";

    default:
      return "/";
  }
}
