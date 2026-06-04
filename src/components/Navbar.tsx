import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Shield, LogOut, LayoutDashboard, Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const publicLinks = [
    { to: "/loans", label: "Loans", hasDropdown: true },
    { to: "/western-union", label: "Western Union" },
    { to: "/about", label: "About Us" },
    { to: "/security", label: "Security" },
  ];

  return (
    <div className="w-full flex flex-col sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-[#0a1628] w-full py-1.5 px-4 sm:px-6 flex justify-between items-center text-[10px] sm:text-xs font-semibold tracking-wide text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="text-amber-500">⊙</span>
          <span>Mon–Fri 8am–8pm ET</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>🔒</span>
          <span>256-bit SSL Encrypted</span>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-[#0b1f3a] text-white shadow-lg border-b border-white/5">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl font-black tracking-tighter group"
            onClick={() => setMobileOpen(false)}
          >
            <div className="bg-amber-500 p-1.5 sm:p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Shield className="text-[#0b1f3a] w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="group-hover:text-amber-400 transition-colors">AdvanceAmerica</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {publicLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`hover:text-amber-400 hover:underline transition-colors flex items-center gap-1 text-sm font-medium ${
                  location.pathname === link.to ? "text-amber-500" : "text-white"
                }`}
              >
                {link.label}
                {link.hasDropdown && <ChevronDown className="w-4 h-4 ml-0.5 opacity-70" />}
              </Link>
            ))}
            
            {user && (
              <Link
                to="/admin"
                className={`hover:text-amber-400 hover:underline transition-colors flex items-center gap-1.5 text-sm font-medium ${
                  location.pathname === "/admin" ? "text-amber-500" : "text-amber-500/80"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-xs font-bold text-slate-300 truncate max-w-[140px]">
                  {user.email}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white rounded-full transition-transform active:scale-95 w-10 h-10"
                  onClick={logout}
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Link to="/login" className="hidden md:block">
                <Button
                  variant="outline"
                  className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white font-bold text-xs rounded-full px-5 h-10 shadow-sm transition-all"
                >
                  Admin Area
                </Button>
              </Link>
            )}

            {/* Hamburger — mobile only */}
            <button
              className="md:hidden p-2 rounded-xl text-white hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
              className="md:hidden overflow-hidden bg-[#0a1628] border-t border-white/10"
            >
              <div className="px-4 py-4 space-y-1">
                {publicLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                      location.pathname === link.to
                        ? "bg-white/10 text-amber-500"
                        : "hover:bg-white/5 text-slate-300"
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.hasDropdown && <ChevronDown className="w-4 h-4 opacity-50" />}
                  </Link>
                ))}
                
                {user && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                      location.pathname === "/admin"
                        ? "bg-white/10 text-amber-500"
                        : "hover:bg-white/5 text-slate-300"
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Admin Dashboard
                  </Link>
                )}

                <div className="pt-4 mt-2 border-t border-white/10">
                  {!user ? (
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-center justify-center bg-white/5 hover:bg-white/10 text-white"
                    >
                      Admin Area
                    </Link>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <div className="px-4 text-xs font-bold text-slate-400 truncate text-center">
                        Signed in as {user.email}
                      </div>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          logout();
                          setMobileOpen(false);
                        }}
                        className="w-full justify-center text-red-400 hover:text-red-300 hover:bg-red-400/10"
                      >
                        <LogOut className="w-4 h-4 mr-2" /> Logout
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
};
