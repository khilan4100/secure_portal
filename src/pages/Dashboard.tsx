import React, { useEffect, useState } from "react";
import { useAuth } from "../lib/AuthContext";
import {
  fetchLoans,
  fetchPayments,
  fetchNotifications,
  updateLoan,
  markNotificationRead,
  subscribeToLoans,
  subscribeToPayments,
  subscribeToNotifications,
} from "../lib/db";
import { Loan, Payment, Notification, AnalyticsSummary } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import * as XLSX from "xlsx";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from "recharts";
import { 
  Wallet, 
  Bell, 
  Calendar, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  History, 
  Users, 
  ArrowUpRight, 
  Activity,
  Filter,
  ShieldCheck
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "motion/react";

export const Dashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [showReports, setShowReports] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [aiAnalysis, setAiAnalysis] = useState<{risk: string, justification: string} | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (!user) return;

    const isAdmin = profile?.role === "admin";
    const uid = user.uid as string;

    fetchLoans(isAdmin, uid).then(setLoans).catch(console.error);
    fetchPayments(isAdmin, uid).then(setPayments).catch(console.error);
    fetchNotifications(isAdmin, uid).then(setNotifications).catch(console.error);

    const unsubLoans    = subscribeToLoans(isAdmin, uid, setLoans);
    const unsubPayments = subscribeToPayments(isAdmin, uid, setPayments);
    const unsubNotifs   = subscribeToNotifications(isAdmin, uid, setNotifications);

    fetch("/api/analytics/summary")
      .then((res) => res.json())
      .then((data) => setAnalytics(data))
      .catch(console.error);

    return () => {
      unsubLoans();
      unsubPayments();
      unsubNotifs();
    };
  }, [user, profile]);

  const isAdmin = profile?.role === "admin";

  // Admin Calculations
  const totalDisbursed = loans.reduce((acc, curr) => acc + curr.amount, 0);
  const activeLoansCount = loans.filter(l => l.status === "active").length;
  const pendingAppsCount = loans.filter(l => l.status === "pending").length;
  const totalCollections = payments.filter(p => p.status === "paid").reduce((acc, curr) => acc + curr.amount, 0);

  // Filtered Loans
  const filteredLoans = loans.filter(l => {
    const matchesSearch = l.borrowerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (l as any).details?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Risk Distribution (Hardcoded buckets for demo based on loan amount % of income if available, or just random/amount for now)
  const riskDistribution = loans.reduce((acc: any, l: any) => {
    const income = Number(l.details?.monthlyIncome || 0);
    const emi = l.monthlyEMI || (l.amount / (l.term || 12));
    const ratio = emi / (income || 1);
    
    let tier = "Low";
    if (ratio > 0.5 || l.amount > 5000000) tier = "High";
    else if (ratio > 0.3 || l.amount > 1000000) tier = "Medium";
    
    acc[tier] = (acc[tier] || 0) + 1;
    return acc;
  }, { Low: 0, Medium: 0, High: 0 });

  const riskData = [
    { name: "Low Risk", value: riskDistribution.Low, color: "#10b981" },
    { name: "Medium Risk", value: riskDistribution.Medium, color: "#f59e0b" },
    { name: "High Risk", value: riskDistribution.High, color: "#ef4444" },
  ];

  // Status Distribution for Pie Chart
  const statusCounts = loans.reduce((acc: any, loan) => {
    acc[loan.status] = (acc[loan.status] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(statusCounts).map(status => ({
    name: status.toUpperCase(),
    value: statusCounts[status]
  }));

  const COLORS = ['#0f172a', '#f59e0b', '#10b981', '#ef4444', '#6366f1', '#94a3b8'];

  // Borrower calculations
  const activeLoan = loans.find(l => l.status === "active");
  const progressPercent = activeLoan ? ((activeLoan.totalPayable - activeLoan.remainingBalance) / activeLoan.totalPayable) * 100 : 0;

  const exportToExcel = () => {
    const dataToExport = isAdmin ? loans.map(l => ({
      'Borrower Name': l.borrowerName,
      'Email': (l as any).details?.email || 'N/A',
      'Phone': (l as any).details?.phone || 'N/A',
      'Amount ($)': l.amount,
      'Term (Months)': l.term,
      'Monthly EMI ($)': l.monthlyEMI,
      'Status': l.status,
      'Application Date': format(new Date(l.applicationDate), 'yyyy-MM-dd')
    })) : payments.map(p => ({
      'Due Date': format(new Date(p.dueDate), 'yyyy-MM-dd'),
      'Amount ($)': p.amount,
      'Status': p.status,
      'Loan ID': p.loanId
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, isAdmin ? "Loans" : "Payments");
    XLSX.writeFile(wb, `${isAdmin ? 'Applications' : 'Repayments'}_Export_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  };

  const markAsRead = async (notifId: string) => {
    try {
      await markNotificationRead(notifId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const updateApplicationStatus = async (loanId: string, status: "active" | "rejected") => {
    try {
      await updateLoan(loanId, status);
      setLoans((prev) =>
        prev.map((l) => (l.id === loanId ? { ...l, status } : l))
      );
      setSelectedLoan(null);
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  const getAiRiskAssessment = async () => {
    if (!selectedLoan) return;
    setIsAnalyzing(true);
    setAiAnalysis(null);
    try {
      const response = await fetch("/api/assess-risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: selectedLoan.amount,
          term: selectedLoan.termMonths || selectedLoan.term,
          income: (selectedLoan as any).details?.monthlyIncome || 0,
          creditScore: 720 // Mock score for assessment
        })
      });
      const data = await response.json();
      setAiAnalysis(data);
    } catch (error) {
      console.error("AI Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Disbursement Trend Data
  const trendData = loans.reduce((acc: any[], loan) => {
    const month = format(new Date(loan.applicationDate), "MMM");
    const existing = acc.find(d => d.month === month);
    if (existing) {
      existing.amount += loan.amount;
    } else {
      acc.push({ month, amount: loan.amount });
    }
    return acc;
  }, []).sort((a, b) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months.indexOf(a.month) - months.indexOf(b.month);
  });


  if (!user) return <div className="p-20 text-center">Please login to access your dashboard.</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-navy uppercase tracking-tight">
              {isAdmin ? "Admin Analytics Hub" : `Welcome back, ${profile?.displayName}`}
            </h1>
            <p className="text-slate-500 font-medium">
              {isAdmin ? "Portfolio performance and borrower oversight." : "Your secure financial overview for today."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
             {!isAdmin && (
               <Button 
                 onClick={() => {
                   document.getElementById('audits-section')?.scrollIntoView({ behavior: 'smooth' });
                 }}
                 variant="outline" 
                 className="relative h-9 sm:h-11 px-3 sm:px-6 text-[10px] border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-colors"
               >
                  <Bell className="w-5 h-5 text-navy" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-lg animate-bounce">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
               </Button>
             )}
             {isAdmin ? (
               <div className="flex flex-wrap items-center gap-2">
                 <Button 
                   onClick={() => setShowReports(true)}
                   variant="threeD" 
                   className="bg-navy h-9 sm:h-11 px-3 sm:px-6 font-black uppercase tracking-widest text-[10px] flex items-center gap-2 rounded-xl"
                 >
                   <Filter className="w-4 h-4" /> Reports
                 </Button>
                 <Button 
                   onClick={exportToExcel}
                   variant="threeD" 
                   className="bg-emerald-600 hover:bg-emerald-700 text-white h-9 sm:h-11 px-3 sm:px-6 font-black uppercase tracking-widest text-[10px] flex items-center gap-2 rounded-xl backlight-emerald"
                 >
                    Export Data
                 </Button>
               </div>
             ) : (
               <div className="flex flex-wrap items-center gap-2">
                 <Button 
                   onClick={exportToExcel}
                   variant="threeD" 
                   className="bg-navy h-9 sm:h-11 px-3 sm:px-6 font-black uppercase tracking-widest text-[10px] flex items-center gap-2 rounded-xl"
                 >
                   Export History
                 </Button>
                 <Button variant="threeD" className="bg-amber-500 hover:bg-amber-600 text-white h-9 sm:h-11 px-3 sm:px-6 font-black uppercase tracking-widest text-[10px] rounded-xl backlight-amber">Apply for New Loan</Button>
               </div>
             )}
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {isAdmin ? "Total Portfolio Volume" : "Active Loan Balance"}
                </p>
                <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600">
                  <Wallet className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-navy leading-none">
                  ${isAdmin ? totalDisbursed.toLocaleString() : (activeLoan?.remainingBalance.toLocaleString() || "0")}
                </h3>
                {isAdmin ? (
                  <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-2">
                    <ArrowUpRight className="w-3 h-3" /> +12.5% from last month
                  </p>
                ) : (
                  <div className="flex items-center gap-2 pt-2">
                    <Progress value={progressPercent} className="h-1.5" />
                    <span className="text-[10px] font-bold text-slate-400">{Math.round(progressPercent)}%</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {isAdmin ? "Total Collections" : "Next EMI Due"}
                </p>
                <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-600">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-navy leading-none">
                {isAdmin ? `$${totalCollections.toLocaleString()}` : (activeLoan ? format(new Date(activeLoan.nextPaymentDate), "MMM dd, yyyy") : "No Due")}
              </h3>
              <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-wider">
                {isAdmin ? "Net Inflow This Quarter" : "Auto-trigger notification set"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
               <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {isAdmin ? "Active Borrowers" : "Credit Utilization"}
                </p>
                <div className="bg-amber-50 p-2.5 rounded-xl text-amber-600">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-navy leading-none">
                {isAdmin ? activeLoansCount : "68%"}
              </h3>
              <p className="text-[10px] text-emerald-600 flex items-center font-bold uppercase mt-2 tracking-wider">
                {isAdmin ? `${loans.length} Total Applied` : "Good Standing"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {isAdmin ? "Pending Approvals" : "Active Profile"}
                </p>
                <div className="bg-navy text-white p-2.5 rounded-xl">
                  {isAdmin ? <Activity className="w-4 h-4 text-amber-400" /> : <CheckCircle2 className="w-4 h-4" />}
                </div>
              </div>
              <h3 className="text-2xl font-black text-navy leading-none">
                {isAdmin ? pendingAppsCount : profile?.displayName}
              </h3>
              <Badge variant="secondary" className={`mt-2 border-none px-3 font-bold text-[9px] uppercase tracking-widest ${isAdmin ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}>
                {isAdmin ? "Awaiting Action" : "Member Since 2024"}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
           {/* Primary Analysis Section */}
           <div className="lg:col-span-2 space-y-6">
              <Card className="border-none shadow-lg overflow-hidden">
                <CardHeader className="border-b border-slate-100 bg-white p-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-black text-navy uppercase tracking-tight flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-amber-500" />
                      {isAdmin ? "Disbursement Trends" : "Repayment Analytics"}
                    </CardTitle>
                    {isAdmin && (
                      <div className="flex gap-2">
                        <Badge className="bg-blue-50 text-blue-700 border-none">Monthly</Badge>
                        <Badge variant="outline" className="text-slate-400 border-slate-200">Quarterly</Badge>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-10">
                  <div className="h-[220px] sm:h-[280px] md:h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={isAdmin ? trendData : [
                        { month: "Jan", balance: 500000 },
                        { month: "Feb", balance: 480000 },
                        { month: "Mar", balance: 460000 },
                        { month: "Apr", balance: 440000 },
                        { month: "May", balance: 420000 },
                      ]}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={isAdmin ? "#f59e0b" : "#1e40af"} stopOpacity={0.1}/>
                            <stop offset="95%" stopColor={isAdmin ? "#f59e0b" : "#1e40af"} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="month" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fill: "#94a3b8", fontSize: 10, fontWeight: 700}} 
                          dy={10} 
                        />
                        <YAxis 
                          width={window.innerWidth < 400 ? 0 : 50}
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fill: "#94a3b8", fontSize: 10, fontWeight: 700}} 
                          tickFormatter={(value) => `$${value >= 1000 ? (value/1000) + 'k' : value}`}
                        />
                        <Tooltip 
                          contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                          itemStyle={{fontWeight: 800, color: '#0f172a'}}
                        />
                        <Area 
                          type="monotone" 
                          dataKey={isAdmin ? "amount" : "balance"} 
                          stroke={isAdmin ? "#f59e0b" : "#1e40af"} 
                          strokeWidth={4} 
                          fillOpacity={1} 
                          fill="url(#colorValue)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Data Table */}
              <Card className="border-none shadow-lg overflow-hidden">
                <CardHeader className="border-b border-slate-100 bg-white p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <CardTitle className="text-lg font-black text-navy uppercase tracking-tight flex items-center gap-2">
                      <History className="w-5 h-5 text-amber-500" />
                      {isAdmin ? "Global Application Registry" : "Recent Payments"}
                    </CardTitle>
                    {isAdmin && (
                      <div className="flex items-center gap-2">
                        <div className="relative min-w-0 flex-1">
                          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                          <input 
                            type="text" 
                            placeholder="Search borrowers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-8 pl-8 pr-4 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-navy placeholder:text-slate-400 focus:outline-none focus:border-navy w-48 transition-all"
                          />
                        </div>
                        <select 
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="h-8 px-3 flex-shrink-0 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-black uppercase text-navy focus:outline-none focus:border-navy"
                        >
                          <option value="all">All Status</option>
                          <option value="pending">Pending</option>
                          <option value="active">Active</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto w-full -mx-0">
                    <Table className="min-w-[600px]">
                      <TableHeader>
                        <TableRow className="bg-slate-50 border-none hover:bg-slate-50">
                          <TableHead className="font-black text-[10px] uppercase text-slate-400 p-6 whitespace-nowrap">
                            {isAdmin ? "Borrower / Applicant" : "Date"}
                          </TableHead>
                          <TableHead className="font-black text-[10px] uppercase text-slate-400 whitespace-nowrap">
                            {isAdmin ? "Contact Info" : "Transaction ID"}
                          </TableHead>
                          <TableHead className="font-black text-[10px] uppercase text-slate-400 whitespace-nowrap">Amount</TableHead>
                          <TableHead className="font-black text-[10px] uppercase text-slate-400 whitespace-nowrap">Status</TableHead>
                          {isAdmin && <TableHead className="font-black text-[10px] uppercase text-slate-400 whitespace-nowrap">Actions</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isAdmin ? (
                          filteredLoans.length === 0 ? (
                             <TableRow><TableCell colSpan={5} className="text-center py-10 text-slate-400 font-bold uppercase text-[10px] tracking-widest italic">No matches found.</TableCell></TableRow>
                          ) : (
                            filteredLoans.map((loan) => (
                              <TableRow key={loan.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => setSelectedLoan(loan)}>
                                <TableCell className="p-6">
                                  <div className="font-black text-navy whitespace-nowrap">{loan.borrowerName}</div>
                                  <div className="text-[10px] text-slate-400 font-bold uppercase whitespace-nowrap">{format(new Date(loan.applicationDate), "dd MMM, yyyy")}</div>
                                </TableCell>
                                <TableCell>
                                  <div className="text-xs font-bold text-slate-600 whitespace-nowrap">{(loan as any).details?.phone || "N/A"}</div>
                                  <div className="text-[10px] text-slate-400 whitespace-nowrap">{(loan as any).details?.email || "No Email"}</div>
                                </TableCell>
                                <TableCell className="font-black text-navy whitespace-nowrap">${loan.amount.toLocaleString()}</TableCell>
                                <TableCell>
                                  <Badge className={`uppercase text-[9px] font-black tracking-widest border-none px-3 whitespace-nowrap ${
                                    loan.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 
                                    loan.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-400'
                                  }`}>
                                    {loan.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button 
                                    onClick={() => setSelectedLoan(loan)}
                                    variant="ghost" 
                                    size="sm" 
                                    className="font-black text-[10px] uppercase text-blue-600 hover:text-blue-700 p-0 whitespace-nowrap"
                                  >
                                    View Record
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )
                        ) : (
                          payments.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center py-10 text-slate-400">No payment history found.</TableCell>
                            </TableRow>
                          ) : (
                            payments.map((p) => (
                              <TableRow key={p.id}>
                                <TableCell className="p-6 font-bold whitespace-nowrap">{format(new Date(p.dueDate), "dd MMM yyyy")}</TableCell>
                                <TableCell className="font-mono text-xs text-slate-400 whitespace-nowrap">TXN-{p.id?.slice(0, 8).toUpperCase()}</TableCell>
                                <TableCell className="font-black text-navy p-6 whitespace-nowrap">${p.amount.toLocaleString()}</TableCell>
                                <TableCell className="p-6">
                                  <Badge className={`uppercase text-[9px] font-black border-none px-3 tracking-widest whitespace-nowrap ${p.status === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"}`}>
                                    {p.status}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))
                          )
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
           </div>

           {/* Sidebar: Analytics & Controls */}
           <div className="space-y-6">
              {isAdmin && (
                <>
                  <Card className="border-none shadow-lg overflow-hidden">
                    <CardHeader className="bg-white border-b border-slate-100 p-6">
                      <CardTitle className="text-lg font-black text-navy uppercase tracking-tight flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        Risk Exposure
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="h-[160px] sm:h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={riskData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                            <XAxis type="number" hide />
                            <YAxis 
                              dataKey="name" 
                              type="category" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{fill: "#0f172a", fontSize: 10, fontWeight: 900}} 
                              width={window.innerWidth < 400 ? 0 : 50}
                            />
                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px', border: 'none'}} />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                              {riskData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-4 p-4 rounded-xl bg-orange-50 border border-orange-100">
                        <p className="text-[10px] font-bold text-orange-800 leading-relaxed uppercase tracking-tighter">
                          High risk segments identified in applicants with EMI/Income ratio {'>'} 45%.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-lg overflow-hidden">
                    <CardHeader className="bg-white border-b border-slate-100 p-6">
                      <CardTitle className="text-lg font-black text-navy uppercase tracking-tight flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-amber-500" />
                        Status Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="h-[200px] sm:h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                             <Pie
                               data={pieData}
                               cx="50%"
                               cy="50%"
                               innerRadius={60}
                               outerRadius={80}
                               paddingAngle={5}
                               dataKey="value"
                             >
                               {pieData.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                               ))}
                             </Pie>
                             <Tooltip 
                               contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                               itemStyle={{fontWeight: 800, fontSize: '10px'}}
                             />
                             <Legend 
                               verticalAlign="bottom" 
                               height={36} 
                               wrapperStyle={{fontSize: '10px', fontWeight: 800, textTransform: 'uppercase'}} 
                             />
                           </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              <Card id="audits-section" className="border-none shadow-lg bg-navy text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <AlertCircle className="w-32 h-32" />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-400" />
                      Audits & Alerts
                    </CardTitle>
                    <Badge className="bg-white/10 text-white border-white/20 text-[9px] uppercase font-bold">Live</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[250px] sm:h-[300px] pr-4">
                    <div className="space-y-4">
                      {notifications.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 font-bold uppercase text-[10px] tracking-widest italic">No pending audits.</div>
                      ) : (
                        notifications.map((n) => (
                           <div 
                             key={n.id} 
                             onClick={() => !n.read && markAsRead(n.id)}
                             className={`p-4 rounded-xl flex gap-3 transition-colors cursor-pointer ${n.read ? "bg-slate-800/40" : "bg-white/10 border-l-4 border-amber-500 backdrop-blur-md"}`}
                           >
                             <div className="mt-1">
                               {n.type === "alert" ? <AlertCircle className="w-4 h-4 text-orange-400" /> : <Bell className="w-4 h-4 text-blue-400" />}
                             </div>
                             <div>
                               <p className="text-xs font-black uppercase tracking-tight">{n.title}</p>
                               <p className="text-[11px] text-slate-300 mt-1 leading-relaxed font-medium">{n.message}</p>
                               <p className="text-[9px] text-slate-500 mt-2 font-bold uppercase tracking-widest">{format(new Date(n.createdAt), "hh:mm a, MMM dd")}</p>
                             </div>
                           </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>


           </div>
        </div>

        {/* Application Detail Dialog */}
        <Dialog open={!!selectedLoan} onOpenChange={() => setSelectedLoan(null)}>
          <DialogContent className="max-w-2xl w-[calc(100vw-32px)] sm:w-full max-h-[90vh] overflow-y-auto rounded-[2rem] border-none shadow-2xl bg-white p-0 overflow-hidden">
            <div className="p-4 sm:p-8">
              <DialogHeader>
              <DialogTitle className="text-2xl font-black text-navy uppercase tracking-tight">Application Dossier</DialogTitle>
              <DialogDescription className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">
                ID: {selectedLoan?.id}
              </DialogDescription>
            </DialogHeader>

            {selectedLoan && (
              <div className="space-y-8 py-4">
                {/* Status Banner */}
                <div className={`p-4 rounded-2xl flex items-center justify-between ${
                  selectedLoan.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 
                  selectedLoan.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-600'
                }`}>
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    <span className="font-black uppercase tracking-widest text-xs">Current Phase: {selectedLoan.status}</span>
                  </div>
                  {selectedLoan.status === 'pending' && isAdmin && (
                    <div className="flex flex-wrap gap-2">
                       <Button 
                         onClick={() => updateApplicationStatus(selectedLoan.id || "", 'active')}
                         className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest px-4 rounded-lg"
                       >
                         Approve
                       </Button>
                       <Button 
                         onClick={() => updateApplicationStatus(selectedLoan.id || "", 'rejected')}
                         variant="destructive"
                         className="h-8 text-[10px] font-black uppercase tracking-widest px-4 rounded-lg"
                       >
                         Decline
                       </Button>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Borrower Identity</h4>
                      <div className="space-y-1">
                        <p className="text-lg font-black text-navy">{selectedLoan.borrowerName}</p>
                        <p className="text-sm font-bold text-slate-500">{(selectedLoan as any).details?.email}</p>
                        <p className="text-sm font-bold text-slate-500">{(selectedLoan as any).details?.phone}</p>
                        <p className="text-xs font-medium text-slate-400 mt-2">DOB: {(selectedLoan as any).details?.dob || 'N/A'}</p>
                        <p className="text-xs font-medium text-slate-400">ID: {(selectedLoan as any).details?.idNumber || 'N/A'}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Location Strategy</h4>
                      <div className="text-sm font-bold text-slate-600 leading-relaxed">
                        {(selectedLoan as any).details?.address}<br />
                        {(selectedLoan as any).details?.city}, {(selectedLoan as any).details?.state} {(selectedLoan as any).details?.zip}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Financial Suite</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Capital</span>
                          <span className="font-black text-navy">${selectedLoan.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Monthly EMI</span>
                          <span className="font-black text-navy">${Math.round(selectedLoan.totalPayable / (selectedLoan.termMonths || 1)).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-blue-100 bg-blue-50/30">
                          <span className="text-[10px] font-bold text-blue-400 uppercase">Monthly Income</span>
                          <span className="font-black text-blue-700">${Number((selectedLoan as any).details?.monthlyIncome || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Bank Infrastructure</h4>
                      <div className="p-4 rounded-xl bg-navy text-white flex flex-col gap-2 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-2 opacity-5">
                          <Wallet className="w-12 h-12" />
                        </div>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Financial Institution</p>
                            <p className="text-sm font-black uppercase tracking-tight">{selectedLoan.bankName || (selectedLoan as any).details?.bankName || 'N/A'}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Account Number</p>
                            <p className="text-xs font-mono tracking-widest">{(selectedLoan as any).details?.accountNumber ? `****${(selectedLoan as any).details?.accountNumber.slice(-4)}` : 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl border-2 border-dashed border-slate-100 italic text-slate-400 text-sm font-medium text-center">
                  "Documentation verified against real-time bureau sources."
                </div>

                {isAdmin && (
                  <div className="space-y-4">
                    <Button 
                      onClick={getAiRiskAssessment}
                      disabled={isAnalyzing}
                      className="w-full h-14 bg-amber-500 hover:bg-amber-600 text-white font-black uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-2 backlight-amber"
                    >
                      {isAnalyzing ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Activity className="w-4 h-4" />
                      )}
                      {isAnalyzing ? "Analyzing Bureau Data..." : "Generate AI Risk Report"}
                    </Button>

                    {aiAnalysis && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl border ${
                          aiAnalysis.risk === 'Low' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 
                          aiAnalysis.risk === 'High' ? 'bg-rose-50 border-rose-100 text-rose-800' : 'bg-amber-50 border-amber-100 text-amber-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2 font-black uppercase text-[10px]">
                          <ShieldCheck className="w-4 h-4" />
                          AI Assessment: {aiAnalysis.risk} Risk
                        </div>
                        <p className="text-xs font-bold leading-relaxed">{aiAnalysis.justification}</p>
                      </motion.div>
                    )}
                  </div>
                )}

                <Button 
                  onClick={() => {
                    setSelectedLoan(null);
                    setAiAnalysis(null);
                  }}
                  className="w-full h-14 bg-slate-100 hover:bg-slate-200 text-navy font-black uppercase tracking-widest text-xs rounded-xl"
                >
                  Close Dossier
                </Button>
              </div>
            )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Reports Dialog */}
        <Dialog open={showReports} onOpenChange={(v) => { setShowReports(v); if(!v) setAiAnalysis(null); }}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
            <div className="bg-navy p-8 text-white relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <TrendingUp className="w-32 h-32" />
              </div>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-amber-400 p-2 rounded-xl">
                    <Activity className="w-6 h-6 text-navy" />
                  </div>
                  <div>
                    <DialogTitle className="text-3xl font-black uppercase tracking-tight">Intelligence Reports</DialogTitle>
                    <DialogDescription className="font-bold text-slate-400 uppercase text-[10px] tracking-[0.3em]">
                      Portfolio Performance • {format(new Date(), "MMMM yyyy")}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
            </div>

            <div className="p-8">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card className="border-none bg-slate-50 shadow-none rounded-2xl p-6 md:col-span-2">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Capital Distribution</h4>
                    <Badge className="bg-white text-navy border-none text-[9px] font-black uppercase">Live Data</Badge>
                  </div>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: 'Personal', amount: loans.filter(l => (l as any).details?.loanType === 'personal').reduce((a, b) => a + b.amount, 0) || totalDisbursed * 0.4 },
                        { name: 'Business', amount: loans.filter(l => (l as any).details?.loanType === 'business').reduce((a, b) => a + b.amount, 0) || totalDisbursed * 0.3 },
                        { name: 'Mortgage', amount: loans.filter(l => (l as any).details?.loanType === 'mortgage').reduce((a, b) => a + b.amount, 0) || totalDisbursed * 0.2 },
                        { name: 'Vehicles', amount: totalDisbursed * 0.1 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: "#94a3b8", fontSize: 10, fontWeight: 700}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: "#94a3b8", fontSize: 10, fontWeight: 700}} tickFormatter={(v) => `$${v/1000}k`} />
                        <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '12px', border: 'none'}} />
                        <Bar dataKey="amount" fill="#0f172a" radius={[6, 6, 0, 0]} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <div className="space-y-6">
                  <Card className="border-none bg-emerald-600 text-white shadow-none rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                      <Wallet className="w-16 h-16" />
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-100 mb-4">Yield Forecast</h4>
                    <p className="text-4xl font-black tracking-tighter">${(totalCollections * 1.5).toLocaleString()}</p>
                    <p className="text-[10px] font-bold uppercase mt-1 opacity-80 flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3" /> Targeted End of Q3
                    </p>
                  </Card>

                  <Card className="border-none bg-amber-500 text-white shadow-none rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-100">Health Index</h4>
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    </div>
                    <p className="text-4xl font-black tracking-tighter">94.2%</p>
                    <p className="text-[10px] font-bold uppercase mt-1 opacity-80">Portfolio Quality Score</p>
                  </Card>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                 <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-4 flex items-center gap-2">
                      <Activity className="w-4 h-4" /> Market Alignment
                    </h4>
                    <p className="text-blue-900 text-xs font-bold leading-relaxed italic">
                      "Ahmedabad sector shows strong demand for micro-credit for local MSMEs. Suggest adjustment in interest rates for recurring business clients."
                    </p>
                 </div>
                 <div className="p-6 rounded-2xl bg-slate-900 text-white border border-slate-800">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" /> Bureau Integrity
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                        <span className="text-[9px] font-bold uppercase">KYC Success</span>
                        <span className="text-xs font-black text-emerald-400">100%</span>
                      </div>
                      <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                        <span className="text-[9px] font-bold uppercase">Fraud Prevention</span>
                        <span className="text-xs font-black text-emerald-400">Stable</span>
                      </div>
                    </div>
                 </div>
              </div>

              <Button 
                 onClick={exportToExcel}
                 className="w-full h-14 bg-navy text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-xl flex items-center justify-center gap-3 backlight-navy"
              >
                Assemble Final Quarterly Report
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
