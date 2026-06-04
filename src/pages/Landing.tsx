import React, { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Calculator, ArrowRight, ShieldCheck, Clock, TrendingUp, Percent, Wallet, Building2, Home } from "lucide-react";
import { LoanApplicationDialog } from "../components/LoanApplicationDialog";

export const Landing: React.FC = () => {
  const [amount, setAmount] = useState(0);
  const [months, setMonths] = useState(0);

  const handleNumericInput = (value: string, setter: (val: number) => void, max?: number) => {
    const numericValue = value.replace(/\D/g, "");
    if (max && Number(numericValue) > max) return;
    setter(numericValue === "" ? 0 : Number(numericValue));
  };

  const monthlyRate = 0.0845 / 12; // 8.45% annual
  const monthlyPayment = (amount && months) ? (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1) : 0;

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Hero Section */}
      <header className="bg-navy py-16 sm:py-24 md:py-32 px-4 text-center relative overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500 rounded-full blur-[120px]"
        />

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="container mx-auto max-w-4xl relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-[0.2em]"
          >
            Digital Finance ✨ Redefined
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
            FAST LOANS <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-amber-200">
              SECURE FUTURE.
            </span>
          </h1>
          
          <p className="text-base sm:text-xl text-slate-300 mb-8 sm:mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Experience the next generation of lending. Zero friction, military-grade security, and transparent rates that work for you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 w-full sm:w-auto justify-center items-center">
            <LoanApplicationDialog 
              trigger={
                <Button variant="threeD" size="lg" className="bg-blue-600 hover:bg-blue-500 text-white w-full sm:w-auto px-6 sm:px-10 py-5 sm:py-8 text-base sm:text-xl font-black h-auto rounded-2xl backlight-blue">
                  APPLY NOW <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
              }
            />
            
            <Dialog>
              <DialogTrigger 
                render={
                  <Button size="lg" variant="ghost" className="text-white border-2 border-white/20 hover:bg-white/10 hover:border-white/40 w-full sm:w-auto px-6 sm:px-10 py-5 sm:py-8 text-base sm:text-xl font-bold h-auto rounded-2xl transition-all backdrop-blur-sm">
                    VIEW RATES
                  </Button>
                }
              />
              <DialogContent className="max-w-2xl rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
                <div className="bg-navy p-8 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
                      <Percent className="text-amber-400 w-8 h-8" />
                      Lending Index
                    </DialogTitle>
                    <DialogDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">
                      Live Market Rates • Updated {new Date().toLocaleDateString()}
                    </DialogDescription>
                  </DialogHeader>
                </div>
                
                <div className="p-8 space-y-6 max-h-[85vh] overflow-y-auto">
                    {[
                      { icon: ShieldCheck, type: "Personal Loans", rate: "8.45% - 12.9%", color: "blue", desc: "Unsecured credit for verified professionals" },
                      { icon: Building2, type: "Business Capital", rate: "9.0% - 13.5%", color: "amber", desc: "Scale your operations with flexible tenure" },
                      { icon: Home, type: "Mortgage Solutions", rate: "5.5% - 7.9%", color: "emerald", desc: "Competitive rates for property acquisition" },
                      { icon: Wallet, type: "Micro-Credit", rate: "10.0% - 15.5%", color: "indigo", desc: "Instant approval for small-ticket requirements" }
                    ].map((rate, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between p-6 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-navy transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-white shadow-sm text-navy`}>
                          <rate.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-black text-navy uppercase text-sm tracking-tight">{rate.type}</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{rate.desc}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-black text-navy">{rate.rate}</span>
                        <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1">Fixed APR</p>
                      </div>
                    </motion.div>
                  ))}
                  
                  <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100 flex items-center gap-4">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <p className="text-[11px] font-bold text-blue-800 leading-relaxed">
                      Rates are subject to credit score verification and historical repayment behavior. Terms and conditions apply.
                    </p>
                  </div>
                  
                  <Button className="w-full h-14 bg-navy text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-lg">
                    Check Personal Qualification
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>
      </header>

      {/* Loan Calculator */}
      <section className="py-12 sm:py-20 px-3 sm:px-4 -mt-10 sm:-mt-20 relative z-20">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card className="shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border-none overflow-hidden glass-card rounded-[2.5rem]">
              <div className="grid md:grid-cols-2">
                <div className="p-6 sm:p-10 md:p-16">
                  <div className="flex items-center gap-3 text-navy mb-8">
                    <div className="p-3 bg-navy text-white rounded-2xl shadow-lg">
                      <Calculator className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-0.5">Instant Estimation</span>
                      <h3 className="text-2xl font-black uppercase tracking-tight">EMI Tool</h3>
                    </div>
                  </div>
                  
                  <div className="space-y-10">
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <Label className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Loan Amount (Min $500)</Label>
                        <div className="relative flex items-center gap-1">
                          <span className="text-navy font-black text-xl">$</span>
                          <input 
                            type="text"
                            className="w-32 bg-transparent text-navy font-black text-xl focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            value={amount === 0 ? "" : amount}
                            onChange={(e) => handleNumericInput(e.target.value, setAmount, 10000000)}
                            onFocus={(e) => (e.target as HTMLInputElement).select()}
                            placeholder="500"
                            autoComplete="off"
                          />
                        </div>
                      </div>
                      <input 
                        type="range" 
                        min="500" 
                        max="2000000" 
                        step="100"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-navy"
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <Label className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Tenure</Label>
                        <div className="relative flex items-center gap-1">
                          <input 
                            type="text"
                            className="w-16 bg-transparent text-navy font-black text-xl text-right focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            value={months === 0 ? "" : months}
                            onChange={(e) => handleNumericInput(e.target.value, setMonths, 360)}
                            onFocus={(e) => (e.target as HTMLInputElement).select()}
                            placeholder="0"
                            autoComplete="off"
                          />
                          <span className="text-navy font-black text-xl">Months</span>
                        </div>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="60" 
                        step="6"
                        value={months}
                        onChange={(e) => setMonths(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-navy"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-navy p-6 sm:p-10 md:p-16 text-white flex flex-col justify-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                  
                  <div className="text-center space-y-10 relative z-10">
                    <div>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Estimated EMI</p>
                      <p className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter text-amber-400 drop-shadow-2xl">
                        ${Math.round(monthlyPayment).toLocaleString()}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-8">
                      <div className="p-4 rounded-3xl bg-white/5 border border-white/10 text-left">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Interest</p>
                        <p className="font-black text-sm">${Math.round(monthlyPayment * months - amount).toLocaleString()}</p>
                      </div>
                      <div className="p-4 rounded-3xl bg-white/5 border border-white/10 text-left">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Payable</p>
                        <p className="font-black text-sm">${Math.round(monthlyPayment * months).toLocaleString()}</p>
                      </div>
                    </div>

                    <LoanApplicationDialog 
                      defaultAmount={amount < 500 ? 500 : amount}
                      trigger={
                        <Button 
                          variant="threeD" 
                          onClick={() => {
                            if (amount < 500) {
                              setAmount(500);
                            }
                          }}
                          className="w-full h-12 sm:h-16 bg-white text-navy hover:bg-slate-100 font-black uppercase tracking-widest text-xs rounded-2xl shadow-[0_10px_30px_-5px_rgba(255,255,255,0.3)]"
                        >
                          Check Eligibility
                        </Button>
                      }
                    />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Modern Features Grid */}
      <section className="py-16 sm:py-32 container mx-auto px-4">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl sm:text-4xl md:text-6xl font-black text-navy mb-6 tracking-tighter uppercase"
          >
            Institutional <br /> 
            <span className="text-blue-600">Grade Security.</span>
          </motion.h2>
          <div className="w-24 h-2 bg-amber-500 mx-auto rounded-full" />
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-12">
          {[
            { icon: ShieldCheck, title: "AES-256 Shield", desc: "Your data is encrypted using military-grade standards before it ever reaches our servers." },
            { icon: Clock, title: "Bolt Checkout", desc: "Automated underwriting engine processes applications in under 30 minutes, 24/7." },
            { icon: TrendingUp, title: "Dynamic Rates", desc: "Fair market pricing derived from real-time global financial indices for the best possible offers." }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className="group p-6 sm:p-10 rounded-2xl sm:rounded-[2.5rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all"
            >
              <div className="w-16 h-16 bg-navy text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform">
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4 text-navy">{feature.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* WhatsApp Button as per instructions */}
      <motion.a 
        href="https://wa.me/91XXXXXXXXXX" 
        target="_blank" 
        rel="noopener noreferrer"
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-green-500 text-white p-4 rounded-full shadow-[0_10px_40px_-5px_rgba(34,197,94,0.5)] hover:shadow-[0_15px_50px_-5px_rgba(34,197,94,0.7)] z-50 flex items-center gap-2 font-black uppercase tracking-widest text-[10px] border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all"
      >
        <span className="text-lg">💬</span>
        <span className="hidden md:inline">Contact Support</span>
      </motion.a>
      
      {/* Footer */}
      <footer className="bg-navy text-white py-10 sm:py-12 mt-10 sm:mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-xl font-bold mb-4">Secure Lend</h4>
              <p className="text-slate-400">Leading the future of digital financing with security at our core. Registered NBFC in Ahmedabad, Gujarat.</p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Business Hours</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li className="flex justify-between"><span>Mon - Fri:</span> <span>09:00 AM - 07:00 PM</span></li>
                <li className="flex justify-between"><span>Saturday:</span> <span>10:00 AM - 04:00 PM</span></li>
                <li className="flex justify-between text-amber-400 font-bold"><span>Sunday:</span> <span>Closed</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white">Loans</a></li>
                <li><a href="#" className="hover:text-white">Repayment</a></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Our Location</h4>
              <div className="h-32 bg-slate-800 rounded-md overflow-hidden relative grayscale">
                 <div className="absolute inset-0 flex items-center justify-center text-slate-500 p-2 text-center text-xs">
                   [Google Maps Embed - Ahmedabad HQ]
                 </div>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
            © {new Date().getFullYear()} Secure Lending Portal. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
