import React from 'react';
import { usePortal } from '../../context/PortalContext';
import { FileText, Printer, CheckCircle, X, GraduationCap } from 'lucide-react';

export default function ReceiptModal() {
  const { activeReceipt, setActiveReceipt, tuitionInfo } = usePortal();

  if (!activeReceipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden relative text-slate-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-900 p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Official Tuition Receipt</h3>
              <p className="text-xs text-indigo-300">{activeReceipt.receiptNo}</p>
            </div>
          </div>

          <button
            onClick={() => setActiveReceipt(null)}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Receipt Body */}
        <div className="p-6 space-y-6" id="printable-receipt">
          
          <div className="text-center border-b border-slate-800 pb-4">
            <h4 className="font-extrabold text-xl text-white">{tuitionInfo.centerName}</h4>
            <p className="text-xs text-slate-400 mt-0.5">{tuitionInfo.location} • {tuitionInfo.contactNumber}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-slate-400 uppercase font-semibold text-[10px]">Student Name</p>
              <p className="font-bold text-white text-sm mt-0.5">{activeReceipt.student?.name}</p>
              <p className="text-slate-400 mt-0.5">ID: {activeReceipt.student?.id}</p>
            </div>

            <div className="text-right">
              <p className="text-slate-400 uppercase font-semibold text-[10px]">Parent / Guardian</p>
              <p className="font-bold text-white text-sm mt-0.5">{activeReceipt.student?.parentName}</p>
              <p className="text-slate-400 mt-0.5">{activeReceipt.student?.parentPhone}</p>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Billing Period:</span>
              <span className="font-bold text-white">{activeReceipt.month}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Payment Date:</span>
              <span className="font-semibold text-slate-200">{activeReceipt.paymentDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Payment Method:</span>
              <span className="font-semibold text-slate-200">{activeReceipt.paymentMode}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-800">
              <span className="font-bold text-slate-200 text-sm">Amount Paid:</span>
              <span className="font-black text-emerald-400 text-lg">₹{activeReceipt.amountDue}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>Payment received and verified. Thank you for staying updated!</span>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={() => setActiveReceipt(null)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print Receipt
          </button>
        </div>

      </div>
    </div>
  );
}
