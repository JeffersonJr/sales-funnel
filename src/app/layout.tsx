import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { PermissionsProvider } from "@/hooks/usePermissions";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Funnel.io | Sales Funnel Orchestrator",
  description: "Modern Sales Funnel & Automation Engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <PermissionsProvider>
          <div className="flex h-full bg-[#f9fafb]">
            <Sidebar />
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
          <Toaster position="top-right" richColors />
        </PermissionsProvider>
      </body>
    </html>
  );
}
