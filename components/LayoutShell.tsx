"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { AccessibilityProvider } from "@/app/context/AccessibilityContext";
import { DataProvider } from "@/app/context/DataContext";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname ? pathname.startsWith("/dashboard") : false;
  const isLogin = pathname === "/login" || pathname === "/reset-password";
  const hideNavFooter = isDashboard || isLogin;

  return (
    <AccessibilityProvider>
      <DataProvider>
        <div className="min-h-screen flex flex-col bg-white">
          {!hideNavFooter && <Navbar />}
          <main className="flex-1 flex flex-col">{children}</main>
          {!hideNavFooter && <Footer />}
        </div>
      </DataProvider>
    </AccessibilityProvider>
  );
}
