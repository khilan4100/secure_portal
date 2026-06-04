import React, { createContext, useContext, useEffect, useState } from "react";
import { UserProfile } from "../types";
import { toast } from "sonner";

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  login: () => false,
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const ADMIN_PASSWORD = "Apk@1908";

  useEffect(() => {
    const savedSession = localStorage.getItem("admin_session");
    if (savedSession === "active") {
      const adminUser = { uid: "admin", email: "admin@securelend.com", displayName: "Administrator" };
      const adminProfile: UserProfile = {
        uid: "admin",
        email: "admin@securelend.com",
        displayName: "Administrator",
        role: "admin",
        createdAt: new Date().toISOString()
      };
      setUser(adminUser);
      setProfile(adminProfile);
    }
    setLoading(false);
  }, []);

  const login = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      const adminUser = { uid: "admin", email: "admin@securelend.com", displayName: "Administrator" };
      const adminProfile: UserProfile = {
        uid: "admin",
        email: "admin@securelend.com",
        displayName: "Administrator",
        role: "admin",
        createdAt: new Date().toISOString()
      };
      setUser(adminUser);
      setProfile(adminProfile);
      localStorage.setItem("admin_session", "active");
      toast.success("Admin access granted");
      return true;
    } else {
      toast.error("Invalid admin password");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem("admin_session");
    toast.info("Admin session closed");
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
