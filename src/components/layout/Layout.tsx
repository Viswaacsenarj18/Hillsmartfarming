import { ReactNode } from "react";
import Navbar from "./Navbar";
import FloatingChat from "@/components/FloatingChat";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="animate-fade-in">
        {children}
      </main>

      {/* 🔥 Floating AI Chat (Visible in ALL pages) */}
      <FloatingChat />
    </div>
  );
};

export default Layout;
