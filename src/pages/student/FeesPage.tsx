import { useEffect, useState, useMemo } from "react";
import {
  CreditCard, Download, CheckCircle2, AlertTriangle, Clock3, X,
  Shield, Smartphone, ArrowRight, Wallet, History, Receipt, QrCode, Asterisk
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getFeeItems, getPaymentHistory, getFeeSummary, mockPayFee, mockPayMultipleFees, formatINR,
  type FeeItem, type PaymentRecord
} from "../../services/mock/fees";

export default function FeesPage() {
  const { selectedChild } = useAuth();
  const studentId = selectedChild?.id ?? "STU001";

  const [feeItems, setFeeItems] = useState(() => getFeeItems(studentId));
  const [payments, setPayments] = useState(() => getPaymentHistory(studentId));
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  
  // Payment Modal State
  const [payingFees, setPayingFees] = useState<FeeItem[]>([]);
  const [paymentStep, setPaymentStep] = useState<"select" | "processing" | "success">("select");
  const [selectedMethod, setSelectedMethod] = useState<PaymentRecord["method"]>("UPI");
  const [lastReceipt, setLastReceipt] = useState<PaymentRecord | null>(null);

  const summary = getFeeSummary(studentId);
  const pending = feeItems.filter((f) => f.status === "Pending" || f.status === "Overdue");
  const paid = feeItems.filter((f) => f.status === "Paid");

  useEffect(() => {
    setFeeItems(getFeeItems(studentId));
    setPayments(getPaymentHistory(studentId));
  }, [studentId]);

  const openPayModal = (fees: FeeItem[]) => {
    setPayingFees(fees);
    setPaymentStep("select");
    setSelectedMethod("UPI");
  };

  const handleConfirmPayment = async () => {
    if (payingFees.length === 0) return;
    setPaymentStep("processing");
    await new Promise((r) => setTimeout(r, 2000));
    
    const feeIds = payingFees.map(f => f.id);
    const { updatedFees, updatedPayments, receipt } = mockPayMultipleFees(studentId, feeIds, selectedMethod, feeItems, payments);
    
    setFeeItems(updatedFees);
    setPayments(updatedPayments);
    setLastReceipt(receipt);
    setPaymentStep("success");
  };

  const closeModal = () => {
    setPayingFees([]);
    setPaymentStep("select");
    setLastReceipt(null);
  };

  const totalDue = pending.reduce((s, f) => s + f.amount, 0);

  // Calculate Breakdown percentages
  const breakdown = useMemo(() => {
    if (totalDue === 0) return [];
    const categoryTotals: Record<string, number> = {};
    pending.forEach(f => {
      categoryTotals[f.category] = (categoryTotals[f.category] || 0) + f.amount;
    });
    return Object.entries(categoryTotals).map(([cat, amt]) => ({
      category: cat,
      amount: amt,
      percentage: (amt / totalDue) * 100,
      color: cat === "Tuition" ? "bg-blue-500" : cat === "Transport" ? "bg-amber-500" : cat === "Exam" ? "bg-violet-500" : cat === "Activities" ? "bg-emerald-500" : "bg-zinc-500"
    })).sort((a, b) => b.percentage - a.percentage);
  }, [pending, totalDue]);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 lg:space-y-8 relative">
      
      {/* Header */}
      <section>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Financial Center</h1>
        <p className="mt-1 text-sm text-zinc-500">Manage your school fees, view outstanding balances, and access payment history.</p>
      </section>

      {/* Hero Balance Card */}
      <section className="relative overflow-hidden rounded-xl bg-zinc-900 px-6 py-6 shadow-lg sm:px-8 sm:py-8">
        {/* Abstract Background Elements */}
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-blue-500/20 blur-3xl"></div>
        <div className="absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
           <div>
             <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2 mb-1">
                <Wallet size={14} /> Total Outstanding Balance
             </p>
             <p className="text-3xl sm:text-4xl font-black text-white">{formatINR(totalDue)}</p>
             
             {summary.nextDueDate && (
               <div className="mt-2 flex items-center gap-2">
                 <Clock3 size={12} className="text-amber-400" />
                 <span className="text-xs font-medium text-zinc-300">
                   Next payment of <strong className="text-white">{formatINR(summary.nextDueAmount)}</strong> is due by <strong className="text-white">{summary.nextDueDate}</strong>
                 </span>
               </div>
             )}
           </div>

           <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
             {summary.hasOverdue && (
               <div className="flex items-center gap-2 rounded-lg bg-rose-500/10 border border-rose-500/20 px-3 py-2 backdrop-blur-md">
                 <AlertTriangle size={18} className="text-rose-400 shrink-0" />
                 <div>
                   <p className="text-xs font-bold text-rose-200">Overdue Payment</p>
                   <p className="text-[10px] text-rose-300">Please pay immediately.</p>
                 </div>
               </div>
             )}
             
             {totalDue > 0 && (
               <button
                  onClick={() => openPayModal(pending)}
                  className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 shadow-lg shadow-blue-600/20 whitespace-nowrap"
               >
                  Pay Total Balance
                  <ArrowRight size={16} />
               </button>
             )}
           </div>
        </div>
      </section>

      {/* Breakdown Bar */}
      {totalDue > 0 && (
        <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
           <h2 className="text-sm font-bold text-zinc-900 mb-4">Fee Breakdown</h2>
           
           {/* Visual Bar */}
           <div className="h-4 w-full flex rounded-full overflow-hidden mb-4 bg-zinc-100">
             {breakdown.map(b => (
               <div key={b.category} style={{ width: `${b.percentage}%` }} className={`h-full ${b.color} transition-all duration-500`} title={`${b.category}: ${formatINR(b.amount)}`} />
             ))}
           </div>
           
           {/* Legends */}
           <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {breakdown.map(b => (
                 <div key={b.category} className="flex items-center gap-2">
                   <div className={`h-3 w-3 rounded-full ${b.color}`} />
                   <p className="text-xs font-semibold text-zinc-700">{b.category}</p>
                   <p className="text-xs font-bold text-zinc-900">{b.percentage.toFixed(0)}%</p>
                 </div>
              ))}
           </div>
        </section>
      )}

      {/* Tabs & Data Table */}
      <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex border-b border-zinc-200 bg-zinc-50/50">
          {(["pending", "history"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-sm font-bold transition-colors relative ${
                activeTab === tab ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-700"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {tab === "pending" ? <Wallet size={16} /> : <History size={16} />}
                {tab === "pending" ? `Pending Fees (${pending.length})` : `Payment History (${payments.length})`}
              </div>
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900" />}
            </button>
          ))}
        </div>

        <div className="p-0">
          {activeTab === "pending" ? (
            pending.length === 0 ? (
              <div className="py-16 text-center">
                <CheckCircle2 size={48} className="mx-auto text-emerald-400 mb-4" />
                <p className="text-base font-bold text-zinc-900">All caught up!</p>
                <p className="mt-1 text-sm text-zinc-500">You have no pending fees at this time.</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {pending.map((fee) => (
                  <div key={fee.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between hover:bg-zinc-50/50 transition-colors group">
                    <div className="flex items-start gap-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${
                        fee.status === "Overdue" ? "bg-rose-50 border-rose-100 text-rose-600" : "bg-blue-50 border-blue-100 text-blue-600"
                      }`}>
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <p className="text-base font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">{fee.name}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-3">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                            fee.status === "Overdue" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                          }`}>
                            {fee.status}
                          </span>
                          <span className="text-xs font-semibold text-zinc-500">{fee.category}</span>
                          <span className="text-xs font-semibold text-zinc-500 flex items-center gap-1">
                            <Clock3 size={12} /> Due {fee.dueDate}
                          </span>
                        </div>
                        {fee.concession && (
                          <p className="mt-2 text-xs font-semibold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 size={12} /> {fee.concession.label} Applied
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-5 pl-16 sm:pl-0">
                      <p className="text-xl font-black text-zinc-900">{formatINR(fee.amount)}</p>
                      <button
                        onClick={() => openPayModal([fee])}
                        className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-zinc-800 shadow-sm"
                      >
                        Pay
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            payments.length === 0 ? (
              <div className="py-16 text-center">
                <History size={48} className="mx-auto text-zinc-300 mb-4" />
                <p className="text-sm font-bold text-zinc-900">No payment history.</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {payments.map((p) => (
                  <div key={p.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between hover:bg-zinc-50/50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600">
                        <CheckCircle2 size={20} />
                      </div>
                      <div>
                        <p className="text-base font-bold text-zinc-900">{p.feeItemName}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-3">
                          <span className="text-xs font-semibold text-zinc-500">Paid on {p.paidDate}</span>
                          <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                            Via {p.method}
                          </span>
                          <span className="text-[10px] font-bold text-zinc-400">TXN: {p.transactionId}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-5 pl-16 sm:pl-0">
                      <p className="text-lg font-bold text-emerald-700">{formatINR(p.amount)}</p>
                      <button
                        onClick={() => {
                           setLastReceipt(p);
                           setPaymentStep("success"); // Reusing the success modal for receipt viewing
                           setPayingFees([]); 
                        }}
                        className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-bold text-zinc-700 transition hover:bg-zinc-100 shadow-sm"
                      >
                        <Receipt size={14} />
                        Receipt
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </section>

      {/* PAYMENT / RECEIPT MODAL */}
      {(payingFees.length > 0 || lastReceipt) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 ${
            paymentStep === "success" ? "bg-zinc-50" : "bg-white"
          }`}>
            
            {/* Modal Header */}
            {paymentStep !== "success" && (
              <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 bg-zinc-50/50">
                <p className="text-sm font-bold text-zinc-900 uppercase tracking-widest">
                  Secure Checkout
                </p>
                {paymentStep !== "processing" && (
                  <button onClick={closeModal} className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-900 transition-colors">
                    <X size={18} />
                  </button>
                )}
              </div>
            )}

            <div className="px-6 py-6">
              
              {/* STEP 1: SELECT METHOD */}
              {paymentStep === "select" && payingFees.length > 0 && (
                <div className="space-y-6">
                  {/* Fee Summary */}
                  <div className="rounded-xl bg-zinc-900 p-5 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Wallet size={64} />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Paying For</p>
                    <p className="mt-1 text-sm font-semibold text-zinc-200">
                      {payingFees.length > 1 ? `Total Balance (${payingFees.length} items)` : payingFees[0].name}
                    </p>
                    <p className="mt-3 text-3xl font-black">{formatINR(payingFees.reduce((sum, f) => sum + f.amount, 0))}</p>
                  </div>

                  {/* Payment Method Selection */}
                  <div>
                    <p className="mb-3 text-sm font-bold text-zinc-900">Select Payment Method</p>
                    <div className="grid grid-cols-2 gap-3">
                      {(["UPI", "Card", "Cash", "Cheque"] as const).map((method) => (
                        <button
                          key={method}
                          onClick={() => setSelectedMethod(method)}
                          className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all duration-200 ${
                            selectedMethod === method
                              ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                              : "border-zinc-100 bg-white text-zinc-500 hover:border-zinc-200 hover:bg-zinc-50"
                          }`}
                        >
                          {method === "UPI" ? <QrCode size={24} /> : method === "Card" ? <CreditCard size={24} /> : <Wallet size={24} />}
                          <span className="text-xs font-bold uppercase tracking-widest">{method}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Method Mock UI */}
                  {selectedMethod === "UPI" && (
                    <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 text-center animate-in fade-in slide-in-from-bottom-2">
                      <div className="mx-auto mb-3 h-32 w-32 rounded-xl bg-white p-2 shadow-sm border border-blue-100 flex items-center justify-center relative overflow-hidden group">
                        {/* Mock QR Code Pattern */}
                        <div className="grid grid-cols-6 grid-rows-6 gap-1 w-full h-full">
                           {Array.from({ length: 36 }).map((_, i) => (
                             <div key={i} className={`rounded-sm ${Math.random() > 0.4 ? "bg-zinc-900" : "bg-zinc-100"}`} />
                           ))}
                        </div>
                        {/* Glowing Scan Line Effect */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/50 shadow-[0_0_10px_2px_rgba(59,130,246,0.5)] opacity-0 group-hover:opacity-100 group-hover:animate-[scan_2s_ease-in-out_infinite]" />
                      </div>
                      <p className="text-sm font-bold text-blue-900">Scan with any UPI App</p>
                      <p className="text-xs text-blue-600 mt-1">ravion.school@sbi</p>
                    </div>
                  )}

                  {selectedMethod === "Card" && (
                    <div className="rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 p-5 text-white shadow-lg animate-in fade-in slide-in-from-bottom-2 relative overflow-hidden">
                       <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full border-[20px] border-white/5" />
                       <div className="flex justify-between items-center mb-6">
                          <Wallet size={24} className="text-zinc-400" />
                          <div className="flex gap-1">
                            <div className="w-6 h-6 rounded-full bg-rose-500/80 mix-blend-screen" />
                            <div className="w-6 h-6 rounded-full bg-amber-500/80 mix-blend-screen -ml-3" />
                          </div>
                       </div>
                       <div className="flex items-center gap-2 mb-2 text-zinc-400">
                         <Asterisk size={12} /><Asterisk size={12} /><Asterisk size={12} /><Asterisk size={12} />
                         <Asterisk size={12} /><Asterisk size={12} /><Asterisk size={12} /><Asterisk size={12} />
                         <span className="font-mono text-lg tracking-widest text-zinc-100 ml-2">4242</span>
                       </div>
                       <div className="flex justify-between items-end">
                          <div>
                            <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-500">Card Holder</p>
                            <p className="text-xs font-mono uppercase tracking-widest mt-0.5">Parent Name</p>
                          </div>
                          <div>
                            <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-500 text-right">Expires</p>
                            <p className="text-xs font-mono uppercase tracking-widest mt-0.5">12/28</p>
                          </div>
                       </div>
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    <Shield size={12} /> Encrypted & Secure
                  </div>

                  <button
                    onClick={handleConfirmPayment}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                  >
                    Pay {formatINR(payingFees.reduce((sum, f) => sum + f.amount, 0))}
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {/* STEP 2: PROCESSING */}
              {paymentStep === "processing" && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="relative h-16 w-16 mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-zinc-100" />
                    <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center text-blue-600">
                      <Shield size={20} className="animate-pulse" />
                    </div>
                  </div>
                  <p className="text-base font-bold text-zinc-900">Processing Payment...</p>
                  <p className="mt-2 text-xs font-medium text-zinc-500 text-center max-w-xs">
                    Please do not close this window or press the back button. We are securely connecting to the bank.
                  </p>
                </div>
              )}

              {/* STEP 3: SUCCESS / RECEIPT VIEW */}
              {paymentStep === "success" && lastReceipt && (
                <div className="space-y-6">
                  {payingFees.length > 0 && ( // Only show success checkmark if we just paid, not if we are just viewing past receipt
                    <div className="flex flex-col items-center pt-2 pb-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 mb-4 animate-in zoom-in">
                        <CheckCircle2 size={32} />
                      </div>
                      <p className="text-xl font-black text-zinc-900">Payment Successful</p>
                    </div>
                  )}
                  
                  {/* Digital Receipt Design */}
                  <div className="relative mx-auto w-full max-w-sm rounded-lg bg-white p-6 shadow-sm border border-zinc-200 font-mono text-sm">
                     {/* Jagged edge effect (CSS trick) */}
                     <div className="absolute -top-1.5 left-0 right-0 h-3 bg-[radial-gradient(circle,transparent_4px,#fff_5px)] bg-[length:12px_12px] bg-repeat-x -mt-1.5" style={{ filter: "drop-shadow(0 -1px 1px rgba(0,0,0,0.05))" }} />
                     
                     <div className="text-center mb-6">
                        <h3 className="font-bold text-base tracking-widest uppercase">Ravion School</h3>
                        <p className="text-[10px] text-zinc-500 mt-1">Official Fee Receipt</p>
                     </div>
                     
                     <div className="border-t-2 border-dashed border-zinc-200 my-4" />
                     
                     <div className="space-y-3 text-xs">
                        <div className="flex justify-between">
                           <span className="text-zinc-500">Receipt No:</span>
                           <span className="font-bold text-zinc-900">{lastReceipt.receiptNumber}</span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-zinc-500">Date:</span>
                           <span className="font-bold text-zinc-900">{lastReceipt.paidDate}</span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-zinc-500">Method:</span>
                           <span className="font-bold text-zinc-900">{lastReceipt.method}</span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-zinc-500">Txn ID:</span>
                           <span className="font-bold text-zinc-900">{lastReceipt.transactionId}</span>
                        </div>
                     </div>

                     <div className="border-t-2 border-dashed border-zinc-200 my-4" />
                     
                     <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-start">
                           <span className="text-zinc-900 pr-4">{lastReceipt.feeItemName}</span>
                           <span className="font-bold text-zinc-900 whitespace-nowrap">{formatINR(lastReceipt.amount)}</span>
                        </div>
                     </div>
                     
                     <div className="border-t-2 border-dashed border-zinc-200 my-4" />
                     
                     <div className="flex justify-between items-end">
                        <span className="font-bold uppercase tracking-widest text-zinc-500 text-[10px]">Total Paid</span>
                        <span className="text-lg font-black text-zinc-900">{formatINR(lastReceipt.amount)}</span>
                     </div>
                     
                     <div className="mt-8 text-center">
                        <div className="mx-auto h-8 w-3/4 bg-zinc-900 opacity-20 mask-barcode" style={{ backgroundImage: "repeating-linear-gradient(90deg, #000, #000 2px, transparent 2px, transparent 4px, #000 4px, #000 5px, transparent 5px, transparent 8px)" }} />
                        <p className="text-[8px] text-zinc-400 mt-2">Thank you for your payment.</p>
                     </div>
                  </div>

                  <div className="flex gap-3 px-2">
                    <button
                      onClick={() => window.print()}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white py-3.5 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50 shadow-sm"
                    >
                      <Download size={16} /> Print Receipt
                    </button>
                    <button
                      onClick={closeModal}
                      className="flex-1 rounded-xl bg-zinc-900 py-3.5 text-sm font-bold text-white transition hover:bg-zinc-800 shadow-sm"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Global CSS for QR Scan animation */}
      <style>{`
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
