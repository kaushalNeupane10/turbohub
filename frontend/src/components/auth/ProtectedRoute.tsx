"use client";

import { ReactNode, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import Loading from "@/components/common/Loading";
import { useAuth } from "@/context/AuthContext";
import { getRedirectPath } from "@/utils/authRedirect";
import { UserRole } from "@/types/NavConfig/navConfig.types";

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: readonly UserRole[];
}

export default function ProtectedRoute({
  children,
  roles,
}: ProtectedRouteProps) {
  const router = useRouter();

  const { user, checkingForAuth } = useAuth();

  const canAccess = useMemo(() => {
    if (!user) return false;

    if (!roles) return true;

    return roles.includes(user.role);
  }, [user, roles]);

  useEffect(() => {
    if (checkingForAuth) return;

    if (!user) {
      router.replace("/auth/login");
      return;
    }

    if (!canAccess) {
      router.replace(getRedirectPath(user.role));
    }
  }, [checkingForAuth, user, canAccess, router]);

  if (checkingForAuth) {
    return <Loading />;
  }

  if (!canAccess) {
    return null;
  }

  return <>{children}</>;
}
