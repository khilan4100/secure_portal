import { supabase } from "./supabase";
import { Loan, Payment, Notification } from "../types";

// ─── LOANS ────────────────────────────────────────────────────

export async function fetchLoans(isAdmin: boolean, userId: string): Promise<Loan[]> {
  let query = supabase
    .from("loans")
    .select("*")
    .order("application_date", { ascending: false });

  if (!isAdmin) {
    query = query.eq("borrower_id", userId);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[db] fetchLoans:", error.message);
    throw new Error(error.message);
  }
  return (data ?? []).map(mapLoanFromDB);
}

export async function insertLoan(loan: Omit<Loan, "id"> & { monthlyEMI?: number; details?: any; term?: number }): Promise<Loan> {
  const { data, error } = await supabase
    .from("loans")
    .insert([mapLoanToDB(loan)])
    .select()
    .single();

  if (error) {
    console.error("[db] insertLoan:", error.message);
    throw new Error(error.message);
  }
  return mapLoanFromDB(data);
}

export async function updateLoan(loanId: string, status: Loan["status"]): Promise<void> {
  const { error } = await supabase
    .from("loans")
    .update({ status })
    .eq("id", loanId);

  if (error) {
    console.error("[db] updateLoan:", error.message);
    throw new Error(error.message);
  }
}

// ─── PAYMENTS ─────────────────────────────────────────────────

export async function fetchPayments(isAdmin: boolean, userId: string): Promise<Payment[]> {
  let query = supabase
    .from("payments")
    .select("*")
    .order("due_date", { ascending: true });

  if (!isAdmin) {
    query = query.eq("borrower_id", userId);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[db] fetchPayments:", error.message);
    throw new Error(error.message);
  }
  return (data ?? []).map(mapPaymentFromDB);
}

export async function insertPayment(payment: Omit<Payment, "id">): Promise<Payment> {
  const { data, error } = await supabase
    .from("payments")
    .insert([mapPaymentToDB(payment)])
    .select()
    .single();

  if (error) {
    console.error("[db] insertPayment:", error.message);
    throw new Error(error.message);
  }
  return mapPaymentFromDB(data);
}

// ─── NOTIFICATIONS ─────────────────────────────────────────────

export async function fetchNotifications(isAdmin: boolean, userId: string): Promise<Notification[]> {
  let query = supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false });

  if (!isAdmin) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[db] fetchNotifications:", error.message);
    throw new Error(error.message);
  }
  return (data ?? []).map(mapNotificationFromDB);
}

export async function insertNotification(notif: Omit<Notification, "id">): Promise<Notification> {
  const { data, error } = await supabase
    .from("notifications")
    .insert([mapNotificationToDB(notif)])
    .select()
    .single();

  if (error) {
    console.error("[db] insertNotification:", error.message);
    throw new Error(error.message);
  }
  return mapNotificationFromDB(data);
}

export async function markNotificationRead(notifId: string): Promise<void> {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notifId);

  if (error) {
    console.error("[db] markNotificationRead:", error.message);
    throw new Error(error.message);
  }
}

// ─── REALTIME SUBSCRIPTIONS ────────────────────────────────────

export function subscribeToLoans(
  isAdmin: boolean,
  userId: string,
  onData: (loans: Loan[]) => void
) {
  const channel = supabase
    .channel("realtime-loans")
    .on("postgres_changes", { event: "*", schema: "public", table: "loans" }, async () => {
      const loans = await fetchLoans(isAdmin, userId);
      onData(loans);
    })
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}

export function subscribeToPayments(
  isAdmin: boolean,
  userId: string,
  onData: (payments: Payment[]) => void
) {
  const channel = supabase
    .channel("realtime-payments")
    .on("postgres_changes", { event: "*", schema: "public", table: "payments" }, async () => {
      const payments = await fetchPayments(isAdmin, userId);
      onData(payments);
    })
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}

export function subscribeToNotifications(
  isAdmin: boolean,
  userId: string,
  onData: (notifs: Notification[]) => void
) {
  const channel = supabase
    .channel("realtime-notifications")
    .on("postgres_changes", { event: "*", schema: "public", table: "notifications" }, async () => {
      const notifs = await fetchNotifications(isAdmin, userId);
      onData(notifs);
    })
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}

// ─── MAPPERS (snake_case DB ↔ camelCase app) ───────────────────

function mapLoanFromDB(row: any): Loan {
  return {
    id: row.id,
    borrowerId: row.borrower_id,
    borrowerName: row.borrower_name,
    amount: row.amount,
    interestRate: row.interest_rate,
    termMonths: row.term_months,
    status: row.status,
    totalPayable: row.total_payable,
    remainingBalance: row.remaining_balance,
    nextPaymentDate: row.next_payment_date,
    applicationDate: row.application_date,
    approvedAt: row.approved_at ?? undefined,
  };
}

function mapLoanToDB(loan: any): Record<string, unknown> {
  return {
    borrower_id:       loan.borrowerId,
    borrower_name:     loan.borrowerName,
    amount:            loan.amount,
    interest_rate:     loan.interestRate ?? 8.45,
    term_months:       loan.termMonths ?? loan.term,
    status:            loan.status ?? "pending",
    total_payable:     loan.totalPayable,
    remaining_balance: loan.remainingBalance,
    next_payment_date: loan.nextPaymentDate ?? null,
    application_date:  loan.applicationDate,
    approved_at:       loan.approvedAt ?? null,
    monthly_emi:       loan.monthlyEMI ?? null,
    details:           loan.details ?? null,
  };
}

function mapPaymentFromDB(row: any): Payment {
  return {
    id:          row.id,
    loanId:      row.loan_id,
    borrowerId:  row.borrower_id,
    amount:      row.amount,
    dueDate:     row.due_date,
    paidDate:    row.paid_date ?? undefined,
    status:      row.status,
    remarks:     row.remarks ?? undefined,
  };
}

function mapPaymentToDB(p: any): Record<string, unknown> {
  return {
    loan_id:     p.loanId,
    borrower_id: p.borrowerId,
    amount:      p.amount,
    due_date:    p.dueDate,
    paid_date:   p.paidDate ?? null,
    status:      p.status,
    remarks:     p.remarks ?? null,
  };
}

function mapNotificationFromDB(row: any): Notification {
  return {
    id:        row.id,
    userId:    row.user_id,
    title:     row.title,
    message:   row.message,
    type:      row.type,
    read:      row.read,
    createdAt: row.created_at,
  };
}

function mapNotificationToDB(n: any): Record<string, unknown> {
  return {
    user_id:    n.userId,
    title:      n.title,
    message:    n.message,
    type:       n.type,
    read:       n.read ?? false,
    created_at: n.createdAt,
  };
}
