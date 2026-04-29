"use client";

import { useFunnel } from "@/context/FunnelContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader } from "@/components/layout/TopHeader";

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useFunnel();
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Only redirect if not on login page and not logged in
    if (pathname !== "/login" && !user) {
      router.push("/login");
    } else if (pathname === "/login" && user) {
      router.push("/");
    }
    setIsReady(true);
  }, [user, pathname, router]);

  if (!isReady) return null;

  if (pathname === "/login") {
    return <>{children}</>;
  }

  if (!user) return null;

  return (
    <div className="flex h-full bg-[#f9fafb]">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
