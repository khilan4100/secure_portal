import React from "react";
import { ShieldCheck, Lock, FileText, CheckCircle2 } from "lucide-react";

export const Security: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-[#0b1f3a] text-white py-20 px-4 text-center">
        <div className="w-20 h-20 mx-auto bg-amber-500 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-amber-500/20">
          <ShieldCheck className="w-10 h-10 text-[#0b1f3a]" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-6">Your Security Is Our Top Priority</h1>
        <p className="text-slate-300 max-w-2xl mx-auto text-lg leading-relaxed">
          We use bank-level encryption and strict privacy protocols to ensure your personal and financial information is always protected.
        </p>
      </section>

      {/* Security Features */}
      <section className="py-20 px-4 container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { icon: Lock, title: "256-bit SSL Encryption", desc: "All data transmitted to and from our servers is secured with industry-standard 256-bit encryption, the same level used by major banks." },
            { icon: CheckCircle2, title: "FDIC Compliant Standards", desc: "Our data handling and storage protocols adhere to strict federal banking standards, ensuring your information is stored securely." },
            { icon: ShieldCheck, title: "BBB Accredited", desc: "We maintain an A+ rating with the Better Business Bureau, reflecting our commitment to honest, transparent, and secure business practices." },
            { icon: FileText, title: "Strict No-Spam Policy", desc: "We never sell your personal information to third parties for marketing purposes. Your data stays with us." }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl border border-slate-200 flex gap-6 items-start shadow-sm">
              <div className="p-4 bg-[#0b1f3a] text-white rounded-xl shrink-0">
                <feature.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#0b1f3a] mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy Policy Summary */}
      <section className="py-20 bg-white border-y border-slate-200 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-black text-[#0b1f3a] mb-8 text-center">Privacy Commitment</h2>
          <div className="prose prose-slate max-w-none text-slate-600">
            <p className="mb-4">
              At Advance America, we collect only the information necessary to process your application and service your account. This includes personal identification, employment details, and banking information.
            </p>
            <p className="mb-4">
              We employ physical, electronic, and procedural safeguards that comply with federal standards to guard your non-public personal information.
            </p>
            <p>
              For complete details on how we collect, use, and protect your data, please review our full <a href="#" className="text-amber-600 font-bold hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-[#0b1f3a] mb-4">Security Concerns?</h2>
          <p className="text-slate-600 mb-8">
            If you suspect any fraudulent activity or have questions about our security practices, our dedicated security team is here to help.
          </p>
          <div className="inline-flex items-center gap-2 text-[#0b1f3a] font-black text-xl bg-slate-100 px-6 py-3 rounded-xl">
            <span>📞</span> 1-800-ADVANCE
          </div>
        </div>
      </section>
    </div>
  );
};
