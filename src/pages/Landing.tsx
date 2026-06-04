import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoanApplicationDialog } from "../components/LoanApplicationDialog";
import { Link } from "react-router-dom";
import { ShieldCheck, Clock, TrendingUp, CheckCircle2, Lock, Shield, ArrowRight } from "lucide-react";

export const Landing: React.FC = () => {
  const [amount, setAmount] = useState(15000);
  const [months, setMonths] = useState(36);

  const handleNumericInput = (value: string, setter: (val: number) => void, max?: number) => {
    const numericValue = value.replace(/\D/g, "");
    if (max && Number(numericValue) > max) return;
    setter(numericValue === "" ? 0 : Number(numericValue));
  };

  const monthlyRate = 0.06 / 12; // 6.00% annual for new design
  const monthlyPayment = (amount && months) ? (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1) : 0;
  
  const totalCost = monthlyPayment * months;
  const totalInterest = totalCost - amount;
  
  const principalPercent = totalCost > 0 ? (amount / totalCost) * 100 : 100;
  const interestPercent = totalCost > 0 ? (totalInterest / totalCost) * 100 : 0;

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* 3. HERO SECTION */}
      <section className="bg-gradient-to-b from-[#0b1f3a] to-[#0d2347] pt-20 pb-24 px-4 text-center">
        <div className="container mx-auto max-w-5xl">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-8 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-500 text-xs font-semibold uppercase tracking-widest">
            <span className="mr-2">⊙</span> Trusted by 1.5 Million+ Americans Since 1997
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
            Access Your <span className="text-amber-500">Advance America</span><br />
            Secure Customer Portal
          </h1>
          
          <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Manage your personal loans, check funding status, and access your financial
            account — all in one encrypted, safe portal. Fast approvals. No hidden fees.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <LoanApplicationDialog 
              trigger={
                <Button className="bg-amber-500 hover:bg-amber-400 text-[#0b1f3a] font-bold rounded-full px-8 py-6 h-auto text-base shadow-lg shadow-amber-500/20 transition-all hover:scale-105 w-full sm:w-auto">
                  🔒 Secure Login Portal
                </Button>
              }
            />
            <Link to="/loans" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white/10 hover:text-white font-bold rounded-full px-8 py-6 h-auto text-base transition-all">
                View Loans ›
              </Button>
            </Link>
          </div>
          
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { icon: "⏱", val: "24hr", label: "Same-Day Funding" },
              { icon: "$", val: "Up to $50,000", label: "Loan Amounts" },
              { icon: "🔒", val: "256-bit", label: "SSL Encrypted" }
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-white font-bold text-lg">{stat.val}</div>
                <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TRUST BADGES STRIP */}
      <section className="bg-slate-50 border-y border-slate-200 py-8 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-6">Trusted, Verified & Secure</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-2 mb-2 font-bold text-slate-800">
                <CheckCircle2 className="w-5 h-5 text-green-500" /> FDIC Compliant
              </div>
              <span className="text-xs text-slate-500">Banking-grade standards</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-2 mb-2 font-bold text-slate-800">
                <Lock className="w-5 h-5 text-blue-500" /> 256-bit SSL
              </div>
              <span className="text-xs text-slate-500">Military-grade encryption</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-2 mb-2 font-bold text-slate-800">
                <span className="text-amber-500 text-xl leading-none">⭐</span> BBB Accredited
              </div>
              <span className="text-xs text-slate-500">A+ Rating since 2001</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-2 mb-2 font-bold text-slate-800">
                <span className="text-red-500 text-xl leading-none">🚫</span> No Spam, Ever
              </div>
              <span className="text-xs text-slate-500">Your data stays private</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LOAN PAYMENT CALCULATOR */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500 block mb-3">Instant Estimate</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">Loan Payment Calculator</h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">
              Drag the sliders to see your estimated monthly payment instantly.
              No impact to your credit score.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
            <div className="grid md:grid-cols-2">
              {/* LEFT PANEL */}
              <div className="p-8 md:p-12">
                <div className="space-y-10">
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loan Amount</span>
                      <span className="text-3xl font-black text-[#0b1f3a]">${amount.toLocaleString()}</span>
                    </div>
                    <input 
                      type="range" 
                      min="2500" 
                      max="50000" 
                      step="500"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex justify-between text-xs font-bold text-slate-400">
                      <span>$2,500</span>
                      <span>$50,000</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loan Term</span>
                      <span className="text-3xl font-black text-[#0b1f3a]">{months} months</span>
                    </div>
                    <input 
                      type="range" 
                      min="12" 
                      max="168" 
                      step="12"
                      value={months}
                      onChange={(e) => setMonths(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex justify-between text-xs font-bold text-slate-400">
                      <span>12 mo</span>
                      <span>168 mo (14 yr)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-12 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                  <CheckCircle2 className="text-green-600 w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-green-900">
                    <strong>Fixed APR: 6.00%</strong> — No prepayment penalties. No hidden fees.
                  </p>
                </div>
              </div>

              {/* RIGHT PANEL */}
              <div className="bg-[#0b1f3a] p-8 md:p-12 text-white flex flex-col justify-center">
                <div className="mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Your Estimated Payment</span>
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Monthly Payment</span>
                </div>
                
                <div className="mb-2 text-5xl font-black text-amber-400 tracking-tight">
                  ${monthlyPayment.toFixed(2)}
                </div>
                <div className="text-sm text-slate-300 font-medium mb-10">
                  per month for {months} months
                </div>

                <div className="space-y-4 mb-10">
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-slate-300 text-sm font-medium">Loan Principal</span>
                    <span className="font-bold">${amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-slate-300 text-sm font-medium">Total Interest</span>
                    <span className="font-bold">${Math.round(totalInterest).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 bg-white/5 px-3 -mx-3 rounded-lg">
                    <span className="text-white text-sm font-bold">Total Cost</span>
                    <span className="font-black text-amber-400 text-lg">${Math.round(totalCost).toLocaleString()}</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="pt-2">
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden flex">
                      <div className="h-full bg-blue-400" style={{ width: `${principalPercent}%` }}></div>
                      <div className="h-full bg-amber-400" style={{ width: `${interestPercent}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400 mt-2">
                      <span className="text-blue-400">Principal {Math.round(principalPercent)}%</span>
                      <span className="text-amber-400">Interest {Math.round(interestPercent)}%</span>
                    </div>
                  </div>
                </div>

                <LoanApplicationDialog 
                  defaultAmount={amount}
                  trigger={
                    <Button className="w-full bg-amber-500 hover:bg-amber-400 text-[#0b1f3a] font-black uppercase tracking-wider py-6 h-auto text-sm rounded-full shadow-lg">
                      🔒 Apply for ${amount.toLocaleString()} Now
                    </Button>
                  }
                />
                
                <p className="text-[10px] text-slate-400 mt-6 text-center leading-relaxed">
                  *Estimated figure only. Actual rate based on creditworthiness and state. Subject to approval.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. STATS / SOCIAL PROOF BAR */}
      <section className="bg-[#0b1f3a] py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { val: "1,500,000+", label: "Customers Served" },
              { val: "2,000+", label: "US Locations" },
              { val: "28", label: "States Licensed" },
              { val: "25+", label: "Years Trusted" }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl md:text-4xl font-black text-amber-400 mb-2">{stat.val}</div>
                <div className="text-sm text-slate-300 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500 block mb-3">Verified Customer Reviews</span>
            <h2 className="text-3xl font-black text-slate-800 mb-4">What Our Customers Say</h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">
              Real experiences from verified borrowers across the United States. All
              reviews independently collected.
            </p>
          </div>
          
          <div className="flex justify-center mb-12">
            <div className="bg-white px-8 py-4 rounded-full border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="text-3xl font-black text-[#0b1f3a]">4.9</div>
              <div>
                <div className="text-amber-500 text-xl tracking-widest mb-1">★★★★★</div>
                <div className="text-xs font-bold text-slate-500 uppercase">Based on 1,312 verified reviews</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                text: "The application process was incredibly simple. Got approved within hours and the funds were in my account the next morning. Advance America saved the day during a tough time.",
                author: "Maria T., Texas",
                time: "2 days ago"
              },
              { 
                text: "Very transparent about fees and repayment terms. No surprises. Customer service was responsive and helped me choose the right loan amount for my situation.",
                author: "James K., Florida",
                time: "5 days ago"
              },
              { 
                text: "I've used Advance America twice now. Both times the experience was smooth, professional, and fair. Highly recommend to anyone who needs quick financial assistance.",
                author: "Sandra R., Ohio",
                time: "1 week ago"
              }
            ].map((review, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                <div>
                  <div className="text-amber-500 text-lg mb-4">★★★★★</div>
                  <p className="text-slate-700 italic leading-relaxed mb-6">"{review.text}"</p>
                </div>
                <div>
                  <div className="font-bold text-[#0b1f3a] mb-1">— {review.author} • {review.time}</div>
                  <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-bold">
                    <CheckCircle2 className="w-3 h-3" /> Verified Borrower
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. WHY CHOOSE ADVANCE AMERICA */}
      <section className="py-20 px-4 bg-white border-t border-slate-100">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-[#0b1f3a]">Why Choose Advance America?</h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, title: "AES-256 Shield", desc: "Your data is encrypted using military-grade standards before it ever reaches our servers." },
              { icon: Clock, title: "Bolt Checkout", desc: "Automated underwriting engine processes applications in under 30 minutes, 24/7." },
              { icon: TrendingUp, title: "Dynamic Rates", desc: "Fair market pricing derived from real-time global financial indices for the best possible offers." },
              { icon: Shield, title: "No Credit Impact", desc: "Checking your rate won't affect your credit score. Soft inquiry only." }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-[#0b1f3a]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#0b1f3a]">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
