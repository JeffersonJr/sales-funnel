import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppWrapper } from "@/components/layout/AppWrapper";
import { PermissionsProvider } from "@/hooks/usePermissions";
import { FunnelProvider } from "@/context/FunnelContext";
import { Toaster } from "sonner";

import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Leads.site | Sales Funnel Orchestrator",
  description: "Modern Sales Funnel & Automation Engine",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('app-theme') || 'light';
                  const fontSize = localStorage.getItem('app-font-size') || '16';
                  if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                  document.documentElement.style.setProperty('--base-font-size', fontSize + 'px');
                } catch (e) {}
              })()
            `,
          }}
        />
      </head>
      <body className={`${inter.className} h-full antialiased`} suppressHydrationWarning>
        <AuthProvider>
          <PermissionsProvider>
            <FunnelProvider>
              <AppWrapper>
                {children}
              </AppWrapper>
              <Toaster position="top-right" richColors />
            </FunnelProvider>
          </PermissionsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
