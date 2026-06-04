import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut, LayoutDashboard, Home } from "lucide-react";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-navy text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 text-2xl font-black tracking-tighter group">
          <div className="bg-white p-2 rounded-xl shadow-[0_5px_15px_-3px_rgba(255,255,255,0.4)] group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
            <Wallet className="text-navy w-6 h-6" />
          </div>
          <span className="group-hover:text-amber-400 transition-colors">SECURE LEND</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="hover:text-blue-300 transition-colors flex items-center gap-1">
            <Home className="w-4 h-4" /> Home
          </Link>
          {user && (
            <Link to="/admin" className="hover:text-blue-300 transition-colors flex items-center gap-1">
              <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-xs font-black uppercase tracking-widest text-slate-400">
                {user.email}
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-slate-700 hover:text-white rounded-xl shadow-inner transition-transform active:scale-95"
                onClick={logout}
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="threeD" className="bg-white text-navy hover:bg-slate-200 border-none font-black uppercase tracking-widest text-[10px] rounded-xl px-6 h-10 shadow-sm transition-all">
                Admin Area
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
