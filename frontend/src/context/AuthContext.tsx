"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api/apiClient";
import { User } from "@/types/auth/auth";
import { getRedirectPath } from "@/utils/auth";

interface AuthContextType {
  user: User | null;

  setUser: React.Dispatch<React.SetStateAction<User | null>>;

  isAuthenticated: boolean;

  checkingForAuth: boolean;

  isLoggingOut: boolean;

  login: () => Promise<void>;

  logout: () => Promise<void>;

  refreshUser: () => Promise<void>;

  updateAvatar: (avatar: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  const [checkingForAuth, setCheckingForAuth] = useState(true);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isAuthenticated = Boolean(user);

  const getUserProfile = useCallback(async (): Promise<User | null> => {
    try {
      return await apiClient<User>("/api/auth/me/");
    } catch {
      return null;
    }
  }, []);

  const verifyToken = useCallback(async () => {
    try {
      setCheckingForAuth(true);

      const profile = await getUserProfile();

      setUser(profile);
    } finally {
      setCheckingForAuth(false);
    }
  }, [getUserProfile]);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  // login
  const login = useCallback(async () => {
    const profile = await getUserProfile();

    if (!profile) {
      throw new Error("Unable to load profile");
    }

    setUser(profile);

    router.push(getRedirectPath(profile.role));
  }, [getUserProfile, router]);

  const logout = useCallback(async () => {
    try {
      setIsLoggingOut(true);

      await apiClient("/api/auth/logout/", {
        method: "POST",
      });

      setUser(null);

      router.replace("/");
    } finally {
      setIsLoggingOut(false);
    }
  }, [router]);

  const updateAvatar = useCallback((avatar: string) => {
    setUser((prev) =>
      prev
        ? {
            ...prev,
            avatar,
          }
        : null,
    );
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      setUser,
      isAuthenticated,
      checkingForAuth,
      isLoggingOut,
      login,
      logout,
      refreshUser: verifyToken,
      updateAvatar,
    }),
    [
      user,
      isAuthenticated,
      checkingForAuth,
      isLoggingOut,
      login,
      logout,
      verifyToken,
      updateAvatar,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
