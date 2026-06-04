import { Loan, Payment, Notification } from "../types";

// ─── Key constants ───────────────────────────────────────────────────────────
const LOANS_KEY = "slp_loans";
const PAYMENTS_KEY = "slp_payments";
const NOTIFS_KEY = "slp_notifications";

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// ─── Generic helpers ─────────────────────────────────────────────────────────
function getAll<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]") as T[];
  } catch {
    return [];
  }
}

function saveAll<T>(key: string, items: T[]): void {
  localStorage.setItem(key, JSON.stringify(items));
}

// ─── Loans ───────────────────────────────────────────────────────────────────
export function getLoans(): Loan[] {
  return getAll<Loan>(LOANS_KEY).sort(
    (a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime()
  );
}

export function addLoan(loan: Omit<Loan, "id">): Loan {
  const loans = getAll<Loan>(LOANS_KEY);
  const newLoan: Loan = { ...loan, id: generateId() };
  loans.push(newLoan);
  saveAll(LOANS_KEY, loans);
  return newLoan;
}

export function updateLoanStatus(loanId: string, status: Loan["status"]): void {
  const loans = getAll<Loan>(LOANS_KEY);
  const idx = loans.findIndex((l) => l.id === loanId);
  if (idx !== -1) {
    loans[idx] = { ...loans[idx], status };
    saveAll(LOANS_KEY, loans);
  }
}

// ─── Payments ────────────────────────────────────────────────────────────────
export function getPayments(): Payment[] {
  return getAll<Payment>(PAYMENTS_KEY).sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );
}

export function addPayment(payment: Omit<Payment, "id">): Payment {
  const payments = getAll<Payment>(PAYMENTS_KEY);
  const newPayment: Payment = { ...payment, id: generateId() };
  payments.push(newPayment);
  saveAll(PAYMENTS_KEY, payments);
  return newPayment;
}

// ─── Notifications ───────────────────────────────────────────────────────────
export function getNotifications(): Notification[] {
  return getAll<Notification>(NOTIFS_KEY).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function addNotification(notif: Omit<Notification, "id">): Notification {
  const notifs = getAll<Notification>(NOTIFS_KEY);
  const newNotif: Notification = { ...notif, id: generateId() };
  notifs.push(newNotif);
  saveAll(NOTIFS_KEY, notifs);
  return newNotif;
}

export function markNotificationRead(notifId: string): void {
  const notifs = getAll<Notification>(NOTIFS_KEY);
  const idx = notifs.findIndex((n) => n.id === notifId);
  if (idx !== -1) {
    notifs[idx] = { ...notifs[idx], read: true };
    saveAll(NOTIFS_KEY, notifs);
  }
}
