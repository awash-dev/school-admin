"use client"; // Ensure this component is treated as a client component

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import "./globals.css";
import { ClerkProvider, SignIn, SignedIn, SignedOut } from "@clerk/nextjs";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html>
        <body>
          <SignedOut>
            <div className="flex flex-col items-center justify-center h-screen">
              <div className="text-center">
                <SignIn routing="hash" afterSignInUrl="/page/" />
              </div>
            </div>
          </SignedOut>
          <SignedIn>
            <SidebarProvider>
              <AppSidebar />
              <main className="w-full h-full">
                <SidebarTrigger />
                {children}
              </main>
            </SidebarProvider>
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
}
