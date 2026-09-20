// ============================================================
// Mock Fees & Payments Service
// Replace with real payment API later.
// ============================================================

import type { AttachmentItem } from "../../components/ui/AttachmentList";

export type Installment = {
  id: string;
  label: string;
  amount: number;
  dueDate: string;
  status: "Pending" | "Overdue" | "Paid";
};

export type FeeCircular = {
  title: string;
  publishedBy: string;
  publishedDate: string;
  file: AttachmentItem;
};

export type FeeItem = {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: "Tuition" | "Transport" | "Exam" | "Activities" | "Miscellaneous";
  status: "Pending" | "Overdue" | "Paid";
  concession?: { label: string; amount: number };
  installments?: Installment[];
  circular?: FeeCircular;
};

export type PaymentRecord = {
  id: string;
  feeItemName: string;
  amount: number;
  paidDate: string;
  method: "UPI" | "Card" | "Cash" | "Cheque";
  transactionId: string;
  receiptNumber: string;
};

export type FeeSummary = {
  totalDue: number;
  totalPaid: number;
  nextDueDate: string | null;
  nextDueAmount: number;
  hasOverdue: boolean;
};

const feeItemsSTU001: FeeItem[] = [
  {
    id: "F001", name: "Term 2 Tuition Fee", amount: 12000, dueDate: "30 Sep 2026", category: "Tuition", status: "Pending",
    circular: {
      title: "Term 2 Fee Structure Circular 2026-27",
      publishedBy: "Accounts Department",
      publishedDate: "1 Sep 2026",
      file: { name: "Term2_Fee_Structure_Circular.pdf", type: "PDF", size: "180 KB" },
    },
    installments: [
      { id: "F001-I1", label: "Installment 1", amount: 4000, dueDate: "15 Aug 2026", status: "Paid" },
      { id: "F001-I2", label: "Installment 2", amount: 4000, dueDate: "30 Sep 2026", status: "Pending" },
      { id: "F001-I3", label: "Installment 3", amount: 4000, dueDate: "31 Oct 2026", status: "Pending" },
    ],
  },
  { id: "F002", name: "Annual Exam Fee", amount: 1500, dueDate: "15 Oct 2026", category: "Exam", status: "Pending" },
  { id: "F003", name: "Term 1 Tuition Fee", amount: 12000, dueDate: "15 Jun 2026", category: "Tuition", status: "Paid" },
  { id: "F004", name: "Annual Sports Fee", amount: 800, dueDate: "30 Jun 2026", category: "Activities", status: "Paid" },
  { id: "F005", name: "Lab Fee", amount: 1200, dueDate: "30 Jun 2026", category: "Miscellaneous", status: "Paid" },
  { id: "F006", name: "Transport Fee — Term 1", amount: 4500, dueDate: "20 Jun 2026", category: "Transport", status: "Paid" },
  { id: "F007", name: "Transport Fee — Term 2", amount: 4500, dueDate: "20 Sep 2026", category: "Transport", status: "Overdue" },
];

const feeItemsSTU002: FeeItem[] = [
  { id: "F101", name: "Term 2 Tuition Fee", amount: 9000, dueDate: "30 Sep 2026", category: "Tuition", status: "Pending", concession: { label: "Sibling Concession (10%)", amount: 900 } },
  { id: "F102", name: "Term 1 Tuition Fee", amount: 9000, dueDate: "15 Jun 2026", category: "Tuition", status: "Paid" },
  { id: "F103", name: "Annual Sports Fee", amount: 600, dueDate: "30 Jun 2026", category: "Activities", status: "Paid" },
  { id: "F104", name: "Stationery Fee", amount: 400, dueDate: "30 Jun 2026", category: "Miscellaneous", status: "Paid" },
];

const feeItemsSTU003: FeeItem[] = [
  { id: "F201", name: "Term 2 Tuition Fee", amount: 12000, dueDate: "30 Sep 2026", category: "Tuition", status: "Pending" },
  { id: "F202", name: "Annual Exam Fee", amount: 1500, dueDate: "15 Oct 2026", category: "Exam", status: "Pending" },
  { id: "F203", name: "Term 1 Tuition Fee", amount: 12000, dueDate: "15 Jun 2026", category: "Tuition", status: "Paid" },
  { id: "F204", name: "Lab Fee", amount: 1200, dueDate: "30 Jun 2026", category: "Miscellaneous", status: "Paid" },
  { id: "F205", name: "Transport Fee — Term 2", amount: 4500, dueDate: "20 Sep 2026", category: "Transport", status: "Overdue" },
];

const paymentHistorySTU001: PaymentRecord[] = [
  { id: "PAY001", feeItemName: "Transport Fee — Term 1", amount: 4500, paidDate: "20 Jun 2026", method: "UPI", transactionId: "TXN2026062001", receiptNumber: "REC-2026-001" },
  { id: "PAY002", feeItemName: "Lab Fee", amount: 1200, paidDate: "28 Jun 2026", method: "UPI", transactionId: "TXN2026062802", receiptNumber: "REC-2026-002" },
  { id: "PAY003", feeItemName: "Annual Sports Fee", amount: 800, paidDate: "28 Jun 2026", method: "Card", transactionId: "TXN2026062803", receiptNumber: "REC-2026-003" },
  { id: "PAY004", feeItemName: "Term 1 Tuition Fee", amount: 12000, paidDate: "14 Jun 2026", method: "Cheque", transactionId: "CHQ-00456", receiptNumber: "REC-2026-004" },
];

const paymentHistorySTU002: PaymentRecord[] = [
  { id: "PAY101", feeItemName: "Term 1 Tuition Fee", amount: 9000, paidDate: "14 Jun 2026", method: "UPI", transactionId: "TXN2026061401", receiptNumber: "REC-2026-101" },
  { id: "PAY102", feeItemName: "Annual Sports Fee", amount: 600, paidDate: "28 Jun 2026", method: "UPI", transactionId: "TXN2026062802", receiptNumber: "REC-2026-102" },
  { id: "PAY103", feeItemName: "Stationery Fee", amount: 400, paidDate: "28 Jun 2026", method: "UPI", transactionId: "TXN2026062803", receiptNumber: "REC-2026-103" },
];

const paymentHistorySTU003: PaymentRecord[] = [
  { id: "PAY201", feeItemName: "Term 1 Tuition Fee", amount: 12000, paidDate: "14 Jun 2026", method: "Card", transactionId: "TXN2026061401", receiptNumber: "REC-2026-201" },
  { id: "PAY202", feeItemName: "Lab Fee", amount: 1200, paidDate: "28 Jun 2026", method: "UPI", transactionId: "TXN2026062802", receiptNumber: "REC-2026-202" },
];

const allFees: Record<string, FeeItem[]> = { STU001: feeItemsSTU001, STU002: feeItemsSTU002, STU003: feeItemsSTU003 };
const allPayments: Record<string, PaymentRecord[]> = { STU001: paymentHistorySTU001, STU002: paymentHistorySTU002, STU003: paymentHistorySTU003 };

/** Recompute a fee item's aggregate status/amount from its installments (if any),
 * so the top-level status/amount never drifts out of sync as installments are paid. */
function withComputedStatus(item: FeeItem): FeeItem {
  if (!item.installments || item.installments.length === 0) return item;
  const allPaid = item.installments.every((i) => i.status === "Paid");
  const hasOverdue = item.installments.some((i) => i.status === "Overdue");
  return {
    ...item,
    status: allPaid ? "Paid" : hasOverdue ? "Overdue" : "Pending",
  };
}

/** The amount still owed on a fee item — the full amount if unpaid and no
 * installments, or the sum of unpaid installments when it has a payment plan. */
export function getRemainingAmount(item: FeeItem): number {
  if (item.installments && item.installments.length > 0) {
    return item.installments.filter((i) => i.status !== "Paid").reduce((sum, i) => sum + i.amount, 0);
  }
  return item.status === "Paid" ? 0 : item.amount;
}

export function getFeeItems(studentId: string): FeeItem[] {
  return (allFees[studentId] ?? []).map(withComputedStatus);
}

export function getPendingFees(studentId: string): FeeItem[] {
  return getFeeItems(studentId).filter((f) => f.status === "Pending" || f.status === "Overdue");
}

export function getPaidFees(studentId: string): FeeItem[] {
  return getFeeItems(studentId).filter((f) => f.status === "Paid");
}

export function getPaymentHistory(studentId: string): PaymentRecord[] {
  return allPayments[studentId] ?? [];
}

export function getFeeSummary(studentId: string): FeeSummary {
  const pending = getPendingFees(studentId);
  const paid = getPaidFees(studentId);
  const totalDue = pending.reduce((sum, f) => sum + getRemainingAmount(f), 0);
  const totalPaid = paid.reduce((sum, f) => sum + f.amount, 0);
  const overdueFee = pending.find((f) => f.status === "Overdue");
  const nextDue = pending.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];
  return {
    totalDue,
    totalPaid,
    nextDueDate: nextDue?.dueDate ?? null,
    nextDueAmount: nextDue ? getRemainingAmount(nextDue) : 0,
    hasOverdue: !!overdueFee,
  };
}

// Mock pay — marks fee as paid and adds to payment history
export function mockPayFee(
  _studentId: string,
  feeId: string,
  method: PaymentRecord["method"],
  feeItems: FeeItem[],
  payments: PaymentRecord[]
): { updatedFees: FeeItem[]; updatedPayments: PaymentRecord[]; receipt: PaymentRecord } {
  return mockPayMultipleFees(_studentId, [feeId], method, feeItems, payments);
}

export function mockPayMultipleFees(
  _studentId: string,
  feeIds: string[],
  method: PaymentRecord["method"],
  feeItems: FeeItem[],
  payments: PaymentRecord[]
): { updatedFees: FeeItem[]; updatedPayments: PaymentRecord[]; receipt: PaymentRecord } {
  const feesToPay = feeItems.filter((f) => feeIds.includes(f.id));
  if (feesToPay.length === 0) throw new Error("Fees not found");

  const totalAmount = feesToPay.reduce((sum, f) => sum + getRemainingAmount(f), 0);

  const updatedFees = feeItems.map((f) => {
    if (!feeIds.includes(f.id)) return f;
    if (f.installments) {
      return { ...f, status: "Paid" as const, installments: f.installments.map((i) => ({ ...i, status: "Paid" as const })) };
    }
    return { ...f, status: "Paid" as const };
  });

  const name = feesToPay.length > 1 ? `Multiple Fees (${feesToPay.length} items)` : feesToPay[0].name;

  const newPayment: PaymentRecord = {
    id: `PAY${Date.now()}`,
    feeItemName: name,
    amount: totalAmount,
    paidDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    method,
    transactionId: `TXN${Date.now()}`,
    receiptNumber: `REC-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
  };
  const updatedPayments = [newPayment, ...payments];
  return { updatedFees, updatedPayments, receipt: newPayment };
}

/** Pay a single installment of a fee item's payment plan, recomputing the
 * parent fee item's aggregate status from its remaining installments. */
export function mockPayInstallment(
  feeId: string,
  installmentId: string,
  method: PaymentRecord["method"],
  feeItems: FeeItem[],
  payments: PaymentRecord[]
): { updatedFees: FeeItem[]; updatedPayments: PaymentRecord[]; receipt: PaymentRecord } {
  const feeItem = feeItems.find((f) => f.id === feeId);
  const installment = feeItem?.installments?.find((i) => i.id === installmentId);
  if (!feeItem || !installment) throw new Error("Installment not found");

  const updatedFees = feeItems.map((f) => {
    if (f.id !== feeId || !f.installments) return f;
    const updatedInstallments = f.installments.map((i) => (i.id === installmentId ? { ...i, status: "Paid" as const } : i));
    const allPaid = updatedInstallments.every((i) => i.status === "Paid");
    return { ...f, installments: updatedInstallments, status: allPaid ? ("Paid" as const) : f.status };
  });

  const newPayment: PaymentRecord = {
    id: `PAY${Date.now()}`,
    feeItemName: `${feeItem.name} — ${installment.label}`,
    amount: installment.amount,
    paidDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    method,
    transactionId: `TXN${Date.now()}`,
    receiptNumber: `REC-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
  };
  const updatedPayments = [newPayment, ...payments];
  return { updatedFees, updatedPayments, receipt: newPayment };
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}
