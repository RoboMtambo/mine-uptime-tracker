import React, { createContext, useContext, useState, useCallback } from "react";
import { UserRole } from "@/types";

interface User {
  name: string;
  role: UserRole;
  zpNumber: string;
}

interface AuthContextType {
  user: User | null;
  login: (name: string, role: UserRole, zpNumber: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("minetrack_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((name: string, role: UserRole, zpNumber: string) => {
    const u = { name, role, zpNumber };
    setUser(u);
    localStorage.setItem("minetrack_user", JSON.stringify(u));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("minetrack_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
