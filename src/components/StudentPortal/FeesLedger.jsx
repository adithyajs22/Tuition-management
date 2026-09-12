import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { CreditCard, CheckCircle, Clock, FileText, Send, AlertTriangle, Printer, Plus } from 'lucide-react';

export default function FeesLedger() {
  const { currentStudentFees, currentStudent, setActiveReceipt, isAdminMode, markFeeAsPaid, activeStudentId } = usePortal();
  const [selectedFeeToPay, setSelectedFeeToPay] = useState(null);
  const [payMode, setPayMode] = useState('UPI (GPay)');

  const handlePayConfirm = () => {
    if (!selectedFeeToPay) return;
    markFeeAsPaid(activeStudentId, selectedFeeToPay.id, {
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMode: payMode
    });
    setSelectedFeeToPay(null);
  };

  const generateWhatsAppReminder = (fee) => {
    const text = `Hi ${currentStudent.parentName}, gentle reminder regarding tuition fee for ${currentStudent.name} (${fee.month}) of ₹${fee.amountDue} due on ${fee.dueDate}. Payment can be made via UPI or Cash. Thank you - Apex Tuition Academy.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl mb-8">
      
      {/* Ledger Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <CreditCard className="w-4 h-4" />
            <span>Fees & Payment Ledger</span>
          </div>
          <h3 className="text-xl font-bold text-white">Transparent Monthly Fee Tracker</h3>
        </div>

        <div className="text-xs text-slate-400 font-semibold bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          Monthly Tuition Rate: <strong className="text-emerald-400">₹{currentStudent.monthlyFee}</strong> / month
        </div>
      </div>

      {/* Fees Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] font-bold tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4 rounded-l-xl">Billing Month</th>
              <th className="py-3 px-4">Amount Due</th>
              <th className="py-3 px-4">Due Date</th>
              <th className="py-3 px-4">Payment Status</th>
              <th className="py-3 px-4">Payment Date & Mode</th>
              <th className="py-3 px-4 rounded-r-xl text-right">Receipt / Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {currentStudentFees.map((fee) => (
              <tr key={fee.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-100">
                  {fee.month}
                </td>

                <td className="py-3.5 px-4 font-extrabold text-slate-200">
                  ₹{fee.amountDue}
                </td>

                <td className="py-3.5 px-4 text-xs font-medium text-slate-400">
                  {fee.dueDate}
                </td>

                <td className="py-3.5 px-4">
                  {fee.status === 'Paid' ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle className="w-3.5 h-3.5" /> Paid
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      <Clock className="w-3.5 h-3.5" /> Pending Payment
                    </span>
                  )}
                </td>

                <td className="py-3.5 px-4 text-xs text-slate-300">
                  {fee.status === 'Paid' ? (
                    <div>
                      <span className="font-semibold text-slate-200">{fee.paymentDate}</span>
                      <span className="text-[10px] text-slate-400 block">{fee.paymentMode}</span>
                    </div>
                  ) : (
                    <span className="text-slate-500">-</span>
                  )}
                </td>

                <td className="py-3.5 px-4 text-right">
                  {fee.status === 'Paid' ? (
                    <button
                      onClick={() => setActiveReceipt({ ...fee, student: currentStudent })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/40 border border-indigo-500/30 text-xs font-bold transition-all"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      View Receipt
                    </button>
                  ) : (
                    <div className="flex items-center justify-end gap-2">
                      {isAdminMode && (
                        <button
                          onClick={() => setSelectedFeeToPay(fee)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow transition-all"
                        >
                          Mark Paid
                        </button>
                      )}
                      <button
                        onClick={() => generateWhatsAppReminder(fee)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-bold transition-all"
                        title="Send WhatsApp Payment Reminder"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Admin Payment Recording Modal */}
      {selectedFeeToPay && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Record Fee Payment</h3>
            <p className="text-xs text-slate-400 mb-4">
              Marking tuition fee for <strong className="text-slate-200">{selectedFeeToPay.month}</strong> (₹{selectedFeeToPay.amountDue}) as paid for <strong className="text-indigo-400">{currentStudent.name}</strong>.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Payment Method</label>
                <select
                  value={payMode}
                  onChange={(e) => setPayMode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100"
                >
                  <option value="UPI (Google Pay)">UPI (Google Pay)</option>
                  <option value="UPI (PhonePe)">UPI (PhonePe)</option>
                  <option value="Cash Payment">Cash Payment</option>
                  <option value="Bank NEFT/IMPS">Bank NEFT/IMPS</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelectedFeeToPay(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayConfirm}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg"
                >
                  Confirm & Issue Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
