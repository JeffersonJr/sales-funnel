import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppWrapper } from "@/components/layout/AppWrapper";
import { PermissionsProvider } from "@/hooks/usePermissions";
import { FunnelProvider } from "@/context/FunnelContext";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Leads.site | Sales Funnel Orchestrator",
  description: "Modern Sales Funnel & Automation Engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} h-full antialiased`} suppressHydrationWarning>
        <PermissionsProvider>
          <FunnelProvider>
            <AppWrapper>
              {children}
            </AppWrapper>
            <Toaster position="top-right" richColors />
          </FunnelProvider>
        </PermissionsProvider>
      </body>
    </html>
  );
}
