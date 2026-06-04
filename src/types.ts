export type UserRole = "borrower" | "admin";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
}

export type LoanStatus = "pending" | "approved" | "rejected" | "active" | "completed" | "defaulted";

export interface Loan {
  id?: string;
  borrowerId: string;
  borrowerName: string;
  amount: number;
  interestRate: number;
  termMonths: number;
  status: LoanStatus;
  totalPayable: number;
  remainingBalance: number;
  nextPaymentDate: string;
  applicationDate: string;
  approvedAt?: string;
}

export type PaymentStatus = "scheduled" | "paid" | "late" | "missed";

export interface Payment {
  id?: string;
  loanId: string;
  borrowerId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: PaymentStatus;
  remarks?: string;
}

export interface Notification {
  id?: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "alert";
  read: boolean;
  createdAt: string;
}

export interface AnalyticsSummary {
  totalLent: number;
  activeLoans: number;
  pendingApplications: number;
  averageInterest: number;
  repaymentRate: number;
}
