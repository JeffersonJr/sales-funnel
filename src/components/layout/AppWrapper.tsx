"use client";

import { useFunnel } from "@/context/FunnelContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader } from "@/components/layout/TopHeader";
import { MobileNav } from "./MobileNav";

import { useAuth } from "@/context/AuthContext";

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const publicPaths = ["/login", "/register", "/forgot-password"];
  const isPublicPath = publicPaths.includes(pathname);

  useEffect(() => {
    if (isLoading) return;

    if (!isPublicPath && !user) {
      router.push("/login");
    } else if (isPublicPath && user) {
      router.push("/");
    }
  }, [user, pathname, router, isLoading, isPublicPath]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-gray-100 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (isPublicPath) {
    return <>{children}</>;
  }

  if (!user) return null;

  return (
    <div className="flex h-full bg-[#fcfcfc] overflow-hidden">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        <div className="hidden md:block">
          <TopHeader />
        </div>
        <div className="flex-1 overflow-auto pb-24 md:pb-0 scrollbar-hide">
          {children}
        </div>
        <div className="md:hidden">
          <MobileNav />
        </div>
      </main>
    </div>
  );
}
