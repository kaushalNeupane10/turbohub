export function getRedirectPath(role: string) {
  switch (role) {
    case "admin":
      return "/admin";

    case "owner":
      return "/dashboard";

    case "customer":
      return "/";

    default:
      return "/";
  }
}
