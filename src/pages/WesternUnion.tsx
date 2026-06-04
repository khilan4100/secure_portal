import React from "react";
import { Button } from "@/components/ui/button";
import { Globe2, MapPin, ShieldCheck, Clock } from "lucide-react";

export const WesternUnion: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-yellow-400 text-black py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Send Money Worldwide with Western Union</h1>
          <p className="text-slate-900 max-w-2xl mx-auto mb-10 text-lg font-medium">
            Fast, reliable, and convenient money transfers available at all Advance America locations.
          </p>
          <Button size="lg" className="bg-black hover:bg-slate-800 text-white font-black uppercase tracking-widest px-10 py-6 rounded-full text-sm">
            Find a Location
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Globe2, title: "Global Reach", desc: "Send money to over 200 countries and territories worldwide." },
            { icon: Clock, title: "Fast Transfers", desc: "Money can be picked up in minutes at any Western Union location." },
            { icon: ShieldCheck, title: "Secure & Reliable", desc: "Trusted by millions for safe and trackable international transfers." }
          ].map((feature, i) => (
            <div key={i} className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-100">
              <div className="w-16 h-16 bg-yellow-400 text-black rounded-full flex items-center justify-center mx-auto mb-6">
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black mb-3">{feature.title}</h3>
              <p className="text-slate-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Info Card */}
      <section className="py-12 px-4 pb-24">
        <div className="max-w-4xl mx-auto bg-[#0b1f3a] text-white rounded-[2rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-black mb-4">Visit Us Today</h2>
            <p className="text-slate-300 mb-8">
              Visit your nearest Advance America location to send or receive money via Western Union. Our staff is ready to assist you with quick, hassle-free transfers.
            </p>
            <Button className="bg-amber-500 hover:bg-amber-400 text-navy font-black uppercase tracking-widest px-8 rounded-full">
              <MapPin className="w-4 h-4 mr-2" /> Locate Store
            </Button>
          </div>
          <div className="w-full md:w-1/3">
            <div className="aspect-square bg-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center border-4 border-slate-700 text-center">
              <MapPin className="w-16 h-16 text-amber-500 mb-4" />
              <span className="font-bold">Over 2,000+ Locations Nationwide</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
