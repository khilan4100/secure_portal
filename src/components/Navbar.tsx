import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut, LayoutDashboard, Home, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Home", icon: Home },
    ...(user ? [{ to: "/admin", label: "Admin Dashboard", icon: LayoutDashboard }] : []),
  ];

  return (
    <nav className="bg-navy text-white shadow-lg sticky top-0 z-50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 sm:gap-3 text-lg sm:text-2xl font-black tracking-tighter group"
          onClick={() => setMobileOpen(false)}
        >
          <div className="bg-white p-1.5 sm:p-2 rounded-xl shadow-[0_5px_15px_-3px_rgba(255,255,255,0.4)] group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
            <Wallet className="text-navy w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className="group-hover:text-amber-400 transition-colors">SECURE LEND</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`hover:text-blue-300 transition-colors flex items-center gap-1.5 text-sm font-semibold ${
                location.pathname === link.to ? "text-amber-400" : ""
              }`}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:block text-xs font-black uppercase tracking-widest text-slate-400 truncate max-w-[140px] lg:max-w-none">
                {user.email}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-slate-700 hover:text-white rounded-xl transition-transform active:scale-95 w-9 h-9"
                onClick={logout}
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          ) : (
            <Link to="/login" className="hidden md:block">
              <Button
                variant="threeD"
                className="bg-white text-navy hover:bg-slate-200 border-none font-black uppercase tracking-widest text-[10px] rounded-xl px-4 sm:px-6 h-9 sm:h-10 shadow-sm transition-all"
              >
                Admin Area
              </Button>
            </Link>
          )}

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-slate-900 border-t border-white/10"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                    location.pathname === link.to
                      ? "bg-white/10 text-amber-400"
                      : "hover:bg-white/5 text-slate-300"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
              {!user && (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold hover:bg-white/5 text-slate-300"
                >
                  Admin Area
                </Link>
              )}
              {user && (
                <div className="px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-500 truncate">
                  {user.email}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
