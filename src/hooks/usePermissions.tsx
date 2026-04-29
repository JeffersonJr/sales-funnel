"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import mockDb from "@/data/mock-db.json";

type Role = "Admin" | "Manager" | "Sales Rep";

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface PermissionsContextType {
  user: User | null;
  canViewAllDeals: boolean;
  canManageUsers: boolean;
  canDeleteDeals: boolean;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export function PermissionsProvider({ children }: { children: React.ReactNode }) {
  // Defaulting to Jefferson (Admin) for demo
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const jefferson = mockDb.users.find(u => u.name === "Jefferson Jr") as User;
    setUser(jefferson);
  }, []);

  const canViewAllDeals = user?.role === "Admin" || user?.role === "Manager";
  const canManageUsers = user?.role === "Admin";
  const canDeleteDeals = user?.role === "Admin" || user?.role === "Manager";

  return (
    <PermissionsContext.Provider value={{ user, canViewAllDeals, canManageUsers, canDeleteDeals }}>
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }
  return context;
}
