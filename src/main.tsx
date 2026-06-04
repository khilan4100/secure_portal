import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Landing } from "./pages/Landing";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { Loans } from "./pages/Loans";
import { WesternUnion } from "./pages/WesternUnion";
import { About } from "./pages/About";
import { Security } from "./pages/Security";
import "./index.css";
import { Toaster } from "sonner";
import { useEffect } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center bg-[#0b1f3a] text-white text-xl animate-pulse italic">Connecting to secure vault...</div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

const NavigationGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // If logged in as admin and navigating away from dashboard/login, log out
    // We allow /login because that's where they come from, and /admin because that's the admin area
    if (user && location.pathname !== "/admin" && location.pathname !== "/login") {
      logout();
    }
  }, [location.pathname, user, logout]);

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NavigationGuard>
          <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased">
            <Navbar />
            <main className="flex-1 flex flex-col">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/loans" element={<Loans />} />
                <Route path="/western-union" element={<WesternUnion />} />
                <Route path="/about" element={<About />} />
                <Route path="/security" element={<Security />} />
                <Route path="/login" element={<Login />} />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
            <Footer />
            <Toaster position="top-center" richColors />
          </div>
        </NavigationGuard>
      </AuthProvider>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
