import { ReactNode } from "react";
import { Infinity } from "lucide-react";
import { motion } from "motion/react";

interface NavbarProps {
  activeTab: "username" | "email";
  onTabChange: (tab: "username" | "email") => void;
}

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-brand-purple flex items-center justify-center text-white shadow-lg shadow-brand-purple/20">
          <Infinity size={24} />
        </div>
        <span className="text-xl font-bold tracking-tight text-brand-dark">
          WhatsMyName<span className="text-brand-purple">.net</span>
        </span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <a href="#" className="text-sm font-medium text-brand-purple border-b-2 border-brand-purple pb-1">Home</a>
        <a href="#" className="text-sm font-medium text-gray-500 hover:text-brand-purple transition-colors">Email OSINT Search</a>
        <a href="#" className="text-sm font-medium text-gray-500 hover:text-brand-purple transition-colors">About</a>
      </div>

      <div className="flex items-center gap-4">
        <button className="px-5 py-2 text-sm font-semibold text-brand-purple hover:bg-brand-purple/5 rounded-full transition-all">
          Login
        </button>
        <button className="px-5 py-2 text-sm font-semibold bg-brand-purple text-white rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all">
          Get Started
        </button>
      </div>
    </nav>
  );
}
