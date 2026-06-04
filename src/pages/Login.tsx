import React, { useState } from "react";
import { useAuth } from "../lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Wallet, ShieldCheck, Lock, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="border-none shadow-2xl overflow-hidden">
          <div className="bg-navy p-8 sm:p-12 text-center text-white relative">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Lock className="w-20 h-20" />
             </div>
             <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/30">
                <Wallet className="w-8 h-8 text-white" />
             </div>
             <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Portal</CardTitle>
             <CardDescription className="text-slate-300 mt-2 font-medium">
               Exclusive access for authorised administrators
             </CardDescription>
          </div>
          <CardContent className="p-6 sm:p-8 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <p>Restricted area. Please enter your administrator password to proceed.</p>
                </div>
                
                <div className="space-y-2">
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input 
                      type="password"
                      placeholder="Admin Password"
                      className="pl-12 h-14 text-lg border-slate-200 focus:ring-navy focus:border-navy"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit"
                  variant="threeD"
                  className="w-full h-12 sm:h-16 bg-navy hover:bg-slate-800 text-white shadow-xl transition-all flex items-center justify-center gap-3 text-sm sm:text-lg font-black uppercase tracking-widest rounded-2xl"
                >
                  <Lock className="w-5 h-5" />
                  Login to Dashboard
                </Button>
              </div>
            </form>
            
            <div className="text-center pt-4 border-t border-slate-100">
               <p className="text-xs text-slate-400">Security notice: Unauthorised access attempts are logged and monitored.</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
