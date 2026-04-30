"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  plan?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  updatePlan: (newPlan: string) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const savedUser = localStorage.getItem("auth_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (email && pass) {
      const mockUser = {
        id: "u1",
        name: "Jefferson Jr.",
        email,
        role: "Administrador",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jefferson"
      };
      localStorage.setItem("auth_user", JSON.stringify(mockUser));
      setUser(mockUser);
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, pass: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockUser = {
      id: `u${Date.now()}`,
      name,
      email,
      role: "Administrador",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
    };
    localStorage.setItem("auth_user", JSON.stringify(mockUser));
    setUser(mockUser);
    return true;
  };

  const logout = () => {
    localStorage.removeItem("auth_user");
    setUser(null);
    router.push("/login");
  };

  const updatePlan = (newPlan: string) => {
    if (user) {
      const updatedUser = { ...user, plan: newPlan };
      localStorage.setItem("auth_user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updatePlan, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
