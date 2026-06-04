import React from "react";
import { Users, MapPin, Building2, Calendar, ShieldCheck, Zap, Lock } from "lucide-react";

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-[#0b1f3a] text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-6">Serving Americans Since 1997</h1>
        <p className="text-slate-300 max-w-2xl mx-auto text-lg leading-relaxed">
          For over two decades, we've been helping hard-working people access the financial tools they need to succeed.
        </p>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Users, val: "1.5M+", label: "Customers Served" },
              { icon: MapPin, val: "2,000+", label: "US Locations" },
              { icon: Building2, val: "28", label: "States Licensed" },
              { icon: Calendar, val: "25+", label: "Years Trusted" }
            ].map((stat, i) => (
              <div key={i}>
                <stat.icon className="w-8 h-8 mx-auto text-amber-500 mb-4" />
                <div className="text-3xl font-black text-[#0b1f3a] mb-1">{stat.val}</div>
                <div className="text-slate-500 text-sm font-medium uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <span className="text-amber-500 font-bold uppercase tracking-widest text-xs">Our Mission</span>
          <h2 className="text-3xl font-black text-[#0b1f3a] mt-2 mb-6">Empowering Financial Freedom</h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            We believe that everyone deserves access to fair, transparent, and secure financial services. Our mission is to provide reliable credit options that help our customers navigate life's unexpected expenses and build a stronger financial future.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-[#0b1f3a] text-white px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black">Our Core Values</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: "Transparency", desc: "No hidden fees, ever. We clearly outline all terms and costs before you sign anything." },
              { icon: Zap, title: "Speed", desc: "We know that when you need money, you need it fast. Our streamlined process gets funds to you as quickly as the next business day." },
              { icon: Lock, title: "Security", desc: "Your data is protected by bank-level encryption. We take your privacy and security as seriously as you do." }
            ].map((value, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-2xl">
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mb-6">
                  <value.icon className="w-6 h-6 text-[#0b1f3a]" />
                </div>
                <h3 className="text-xl font-black mb-3">{value.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4 container mx-auto max-w-4xl">
        <h2 className="text-3xl font-black text-[#0b1f3a] text-center mb-16">Our History</h2>
        <div className="space-y-8">
          {[
            { year: "1997", event: "Advance America is founded to provide accessible financial solutions." },
            { year: "2001", event: "Expanded to 1,000 locations nationwide and received BBB Accreditation." },
            { year: "2010", event: "Launched our online lending platform, bringing our services to the digital age." },
            { year: "Present", event: "Trusted by over 1.5 million Americans for safe, reliable lending." }
          ].map((item, i) => (
            <div key={i} className="flex gap-6 items-start">
              <div className="w-24 shrink-0 text-right">
                <span className="text-amber-500 font-black text-xl">{item.year}</span>
              </div>
              <div className="w-4 h-4 rounded-full bg-[#0b1f3a] mt-1.5 shrink-0 relative z-10">
                {i !== 3 && <div className="absolute top-4 left-1.5 w-1 h-20 bg-slate-200 -z-10"></div>}
              </div>
              <div className="pb-8">
                <p className="text-slate-700 font-medium">{item.event}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
