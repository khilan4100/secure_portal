import React from "react";
import { Button } from "@/components/ui/button";
import { LoanApplicationDialog } from "../components/LoanApplicationDialog";
import { CheckCircle2, ChevronDown } from "lucide-react";

export const Loans: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-[#0b1f3a] text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-6">Personal Loans Made Simple</h1>
        <p className="text-slate-300 max-w-2xl mx-auto mb-10 text-lg">
          Fast access to cash when you need it most. Transparent rates, simple applications, and money directly in your account.
        </p>
        <LoanApplicationDialog 
          trigger={
            <Button size="lg" className="bg-amber-500 hover:bg-amber-400 text-navy font-black uppercase tracking-widest px-10 py-6 rounded-full text-sm">
              Apply Now
            </Button>
          }
        />
      </section>

      {/* Loan Types */}
      <section className="py-20 px-4 container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <span className="text-amber-500 font-bold uppercase tracking-widest text-xs">Our Options</span>
          <h2 className="text-3xl font-black text-slate-800 mt-2">Find the Right Loan for You</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Personal Loans", desc: "$2,500–$50,000, 6–60 months", features: ["Fixed monthly payments", "No collateral required", "Use for any personal need"] },
            { title: "Installment Loans", desc: "Flexible repayment, fixed rates", features: ["Borrow more, pay over time", "Predictable schedule", "Build credit history"] },
            { title: "Line of Credit", desc: "Revolving credit, use as needed", features: ["Draw funds anytime", "Pay interest only on what you use", "Reusable credit line"] }
          ].map((type, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
              <h3 className="text-2xl font-black text-[#0b1f3a] mb-2">{type.title}</h3>
              <p className="text-amber-500 font-bold text-sm mb-6">{type.desc}</p>
              <ul className="space-y-3 mb-8 flex-1">
                {type.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2 text-slate-600 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <LoanApplicationDialog 
                trigger={
                  <Button variant="outline" className="w-full rounded-xl border-[#0b1f3a] text-[#0b1f3a] hover:bg-[#0b1f3a] hover:text-white font-bold uppercase text-xs tracking-widest">
                    Select Option
                  </Button>
                }
              />
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-white py-20 px-4 border-y border-slate-200">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-800">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-0.5 bg-slate-100 z-0"></div>
            
            {[
              { step: "1", title: "Apply Online", desc: "Fill out our secure, encrypted application form in under 5 minutes." },
              { step: "2", title: "Get Approved", desc: "Receive an instant decision with transparent terms and rates." },
              { step: "3", title: "Receive Funds", desc: "Money is deposited directly into your bank account as soon as the next business day." }
            ].map((step, i) => (
              <div key={i} className="relative z-10 text-center">
                <div className="w-20 h-20 mx-auto bg-amber-500 rounded-full flex items-center justify-center text-2xl font-black text-white shadow-lg mb-6 ring-8 ring-white">
                  {step.step}
                </div>
                <h3 className="text-xl font-black text-[#0b1f3a] mb-3">{step.title}</h3>
                <p className="text-slate-500 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-800">Frequently Asked Questions</h2>
        </div>
        
        <div className="space-y-4">
          {[
            { q: "What is the minimum credit score required?", a: "We look at more than just your credit score. We consider your employment history, income, and other factors to make a decision." },
            { q: "Are there any hidden fees?", a: "No. Advance America prides itself on transparency. All fees and rates are clearly stated before you sign." },
            { q: "How fast can I get my money?", a: "If approved, funds are typically deposited into your bank account by the next business day." },
            { q: "Is my personal information secure?", a: "Yes, we use 256-bit SSL military-grade encryption to protect your data." },
            { q: "Can I pay off my loan early?", a: "Yes, there are no prepayment penalties. You can pay off your loan at any time." }
          ].map((faq, i) => (
            <details key={i} className="bg-white border border-slate-200 rounded-xl group overflow-hidden">
              <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-5 text-[#0b1f3a]">
                <span>{faq.q}</span>
                <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-5 pt-0 text-slate-600 text-sm border-t border-slate-100 mt-2">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
};
