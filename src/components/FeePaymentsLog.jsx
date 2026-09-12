import React, { useState } from 'react';
import { useTeacherPortal } from '../context/TeacherPortalContext';
import {
  CreditCard, CheckCircle, Clock, Plus, Trash2, Send,
  AlertCircle, IndianRupee, Calendar, Undo2, X
} from 'lucide-react';

export default function FeePaymentsLog() {
  const {
    currentStudent, currentFees,
    markFeePaid, markFeeUnpaid,
    addMonthFeeRecord, deleteFeeRecord
  } = useTeacherPortal();

  const [showAddMonthModal, setShowAddMonthModal] = useState(false);
  const [newMonth, setNewMonth] = useState('October 2026');
  const [newAmount, setNewAmount] = useState(currentStudent?.monthlyFee || 2500);

  // Mark Paid Modal state
  const [markPaidModalFee, setMarkPaidModalFee] = useState(null);
  const [payMode, setPayMode] = useState('UPI');
  const [payDate, setPayDate] = useState(new Date().toISOString().split('T')[0]);

  // Mark Unpaid confirm
  const [unpaidConfirmFeeId, setUnpaidConfirmFeeId] = useState(null);

  if (!currentStudent) {
    return (
      <div className="py-12 text-center" style={{ color: 'rgba(0,255,255,0.5)' }}>
        No active student selected. Please select a student from the navbar dropdown.
      </div>
    );
  }

  const totalMonthsCount = currentFees.length;
  const paidMonthsCount = currentFees.filter(f => f.status === 'Paid').length;
  const unpaidMonthsCount = totalMonthsCount - paidMonthsCount;
  const totalAmountCollected = currentFees
    .filter(f => f.status === 'Paid')
    .reduce((sum, f) => sum + f.amountDue, 0);
  const totalAmountPending = currentFees
    .filter(f => f.status === 'Unpaid')
    .reduce((sum, f) => sum + f.amountDue, 0);

  const handleAddMonthSubmit = (e) => {
    e.preventDefault();
    addMonthFeeRecord(currentStudent.id, newMonth, newAmount);
    setShowAddMonthModal(false);
  };

  const handleConfirmPay = () => {
    if (!markPaidModalFee) return;
    markFeePaid(currentStudent.id, markPaidModalFee.id, payMode, payDate);
    setMarkPaidModalFee(null);
    setPayDate(new Date().toISOString().split('T')[0]);
    setPayMode('UPI');
  };

  const handleConfirmUnpaid = () => {
    if (!unpaidConfirmFeeId) return;
    markFeeUnpaid(currentStudent.id, unpaidConfirmFeeId);
    setUnpaidConfirmFeeId(null);
  };

  const generateWhatsAppReminder = (fee) => {
    const text = `Hi ${currentStudent.parentName}, gentle reminder regarding tuition fee for ${currentStudent.name} (${fee.month}) of ₹${fee.amountDue}. Thank you - AJS Tuition.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="py-8 min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Header Banner */}
        <div className="rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border"
          style={{ background: 'rgba(13,16,69,0.85)', borderColor: 'rgba(0,255,255,0.2)' }}>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#00FFFF' }}>
              <CreditCard className="w-4 h-4" />
              <span>Fee Payments Tracker</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">
              {currentStudent.name}
              <span className="text-sm font-medium ml-2" style={{ color: 'rgba(0,255,255,0.6)' }}>
                ({currentStudent.studentClass})
              </span>
            </h2>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Monthly Rate: <strong style={{ color: '#CCFF00' }}>₹{currentStudent.monthlyFee}</strong>
            </p>
          </div>

          {/* Stats Grid */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Paid Counter */}
            <div className="text-center px-5 py-3 rounded-2xl border"
              style={{ background: 'rgba(204,255,0,0.07)', borderColor: 'rgba(204,255,0,0.25)' }}>
              <p className="text-[10px] uppercase font-bold mb-0.5" style={{ color: 'rgba(204,255,0,0.6)' }}>Paid</p>
              <p className="text-2xl font-black" style={{ color: '#CCFF00' }}>{paidMonthsCount}</p>
              <p className="text-[10px]" style={{ color: 'rgba(204,255,0,0.5)' }}>of {totalMonthsCount}</p>
            </div>

            {/* Unpaid Counter */}
            <div className="text-center px-5 py-3 rounded-2xl border"
              style={{ background: 'rgba(255,0,255,0.07)', borderColor: 'rgba(255,0,255,0.25)' }}>
              <p className="text-[10px] uppercase font-bold mb-0.5" style={{ color: 'rgba(255,0,255,0.6)' }}>Unpaid</p>
              <p className="text-2xl font-black" style={{ color: '#FF00FF' }}>{unpaidMonthsCount}</p>
              <p className="text-[10px]" style={{ color: 'rgba(255,0,255,0.5)' }}>months</p>
            </div>

            {/* Collected */}
            <div className="text-center px-5 py-3 rounded-2xl border"
              style={{ background: 'rgba(0,255,255,0.07)', borderColor: 'rgba(0,255,255,0.2)' }}>
              <p className="text-[10px] uppercase font-bold mb-0.5" style={{ color: 'rgba(0,255,255,0.6)' }}>Collected</p>
              <p className="text-xl font-black text-white">₹{totalAmountCollected.toLocaleString('en-IN')}</p>
              {totalAmountPending > 0 && (
                <p className="text-[10px] font-semibold" style={{ color: '#FF00FF' }}>
                  ₹{totalAmountPending.toLocaleString('en-IN')} pending
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Billing Month Bar */}
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Monthly Ledger History
            <span className="ml-2 text-xs font-normal" style={{ color: 'rgba(0,255,255,0.4)' }}>
              ({totalMonthsCount} entries)
            </span>
          </h3>
          <button
            onClick={() => setShowAddMonthModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all"
            style={{ background: 'linear-gradient(135deg, #CCFF00, #00FFFF)', color: '#191970', boxShadow: '0 0 14px rgba(204,255,0,0.3)' }}
          >
            <Plus className="w-4 h-4" />
            Add Billing Month
          </button>
        </div>

        {/* Payments Table */}
        <div className="rounded-3xl shadow-xl overflow-x-auto border"
          style={{ background: 'rgba(13,16,69,0.85)', borderColor: 'rgba(0,255,255,0.15)' }}>
          <table className="w-full text-left text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
            <thead className="uppercase font-bold border-b" style={{ borderColor: 'rgba(0,255,255,0.1)', color: 'rgba(0,255,255,0.5)' }}>
              <tr>
                <th className="py-3.5 px-5">Billing Month</th>
                <th className="py-3.5 px-5">Amount Due</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5">Payment Date</th>
                <th className="py-3.5 px-5">Mode</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentFees.length > 0 ? currentFees.map((fee) => (
                <tr key={fee.id} className="border-b transition-colors"
                  style={{ borderColor: 'rgba(0,255,255,0.06)' }}>

                  {/* Month */}
                  <td className="py-4 px-5 font-bold text-white">{fee.month}</td>

                  {/* Amount */}
                  <td className="py-4 px-5 font-extrabold" style={{ color: '#CCFF00' }}>
                    ₹{fee.amountDue.toLocaleString('en-IN')}
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-5">
                    {fee.status === 'Paid' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                        style={{ background: 'rgba(204,255,0,0.1)', color: '#CCFF00', borderColor: 'rgba(204,255,0,0.3)' }}>
                        <CheckCircle className="w-3.5 h-3.5" /> Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                        style={{ background: 'rgba(255,0,255,0.1)', color: '#FF00FF', borderColor: 'rgba(255,0,255,0.3)' }}>
                        <Clock className="w-3.5 h-3.5" /> Unpaid
                      </span>
                    )}
                  </td>

                  {/* Payment Date */}
                  <td className="py-4 px-5">
                    {fee.status === 'Paid' ? (
                      <span className="flex items-center gap-1.5" style={{ color: '#CCFF00' }}>
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        {fee.paymentDate}
                      </span>
                    ) : (
                      <span style={{ color: 'rgba(255,255,255,0.25)' }}>—</span>
                    )}
                  </td>

                  {/* Payment Mode */}
                  <td className="py-4 px-5">
                    {fee.status === 'Paid' ? (
                      <span className="px-2 py-0.5 rounded-lg text-[11px] font-bold border"
                        style={{ background: 'rgba(0,255,255,0.08)', color: '#00FFFF', borderColor: 'rgba(0,255,255,0.2)' }}>
                        {fee.paymentMode}
                      </span>
                    ) : (
                      <span style={{ color: 'rgba(255,255,255,0.25)' }}>—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-5">
                    <div className="flex items-center justify-end gap-2">
                      {fee.status === 'Unpaid' ? (
                        <>
                          {/* Mark Paid */}
                          <button
                            onClick={() => { setMarkPaidModalFee(fee); setPayDate(new Date().toISOString().split('T')[0]); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                            style={{ background: 'linear-gradient(135deg, #CCFF00, #00FFFF)', color: '#191970', boxShadow: '0 0 10px rgba(204,255,0,0.25)' }}
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Mark Paid
                          </button>
                          {/* WhatsApp Reminder */}
                          <button
                            onClick={() => generateWhatsAppReminder(fee)}
                            className="p-1.5 rounded-lg border transition-colors"
                            title="Send WhatsApp Reminder"
                            style={{ background: 'rgba(204,255,0,0.08)', color: '#CCFF00', borderColor: 'rgba(204,255,0,0.2)' }}
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        /* Mark Unpaid (revert) */
                        <button
                          onClick={() => setUnpaidConfirmFeeId(fee.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all"
                          title="Mark as Unpaid"
                          style={{ background: 'rgba(255,0,255,0.08)', color: '#FF00FF', borderColor: 'rgba(255,0,255,0.25)' }}
                        >
                          <Undo2 className="w-3.5 h-3.5" />
                          Mark Unpaid
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => deleteFeeRecord(currentStudent.id, fee.id)}
                        className="p-1.5 rounded-lg border transition-colors"
                        title="Delete record"
                        style={{ background: 'rgba(255,0,255,0.06)', color: 'rgba(255,0,255,0.7)', borderColor: 'rgba(255,0,255,0.15)' }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="py-16 text-center">
                    <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-20" style={{ color: '#00FFFF' }} />
                    <p className="font-semibold text-sm text-white mb-1">No billing records yet</p>
                    <p className="text-xs" style={{ color: 'rgba(0,255,255,0.35)' }}>
                      Click "Add Billing Month" to log the first payment entry.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* ── ADD BILLING MONTH MODAL ── */}
      {showAddMonthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)' }}>
          <div className="rounded-3xl p-6 max-w-md w-full shadow-2xl border"
            style={{ background: '#13165a', borderColor: 'rgba(204,255,0,0.25)', boxShadow: '0 0 50px rgba(204,255,0,0.08)' }}>
            <div className="flex items-center justify-between pb-4 mb-4 border-b" style={{ borderColor: 'rgba(204,255,0,0.15)' }}>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Plus className="w-5 h-5" style={{ color: '#CCFF00' }} />
                Add Billing Month
              </h3>
              <button onClick={() => setShowAddMonthModal(false)} style={{ color: 'rgba(255,255,255,0.4)' }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddMonthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: 'rgba(204,255,0,0.7)' }}>Month Name</label>
                <input
                  type="text"
                  placeholder="e.g. October 2026"
                  value={newMonth}
                  onChange={(e) => setNewMonth(e.target.value)}
                  className="w-full rounded-xl px-3 py-2 text-xs text-white border focus:outline-none"
                  style={{ background: 'rgba(0,0,0,0.4)', borderColor: 'rgba(204,255,0,0.2)' }}
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: 'rgba(204,255,0,0.7)' }}>Amount Due (₹)</label>
                <input
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full rounded-xl px-3 py-2 text-xs text-white border focus:outline-none"
                  style={{ background: 'rgba(0,0,0,0.4)', borderColor: 'rgba(204,255,0,0.2)' }}
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAddMonthModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border"
                  style={{ background: 'rgba(0,0,0,0.3)', color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.1)' }}>
                  Cancel
                </button>
                <button type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-black"
                  style={{ background: 'linear-gradient(135deg, #CCFF00, #00FFFF)', color: '#191970', boxShadow: '0 0 14px rgba(204,255,0,0.3)' }}>
                  Add Month Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MARK PAID MODAL with Date of Payment ── */}
      {markPaidModalFee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)' }}>
          <div className="rounded-3xl p-6 max-w-md w-full shadow-2xl border"
            style={{ background: '#13165a', borderColor: 'rgba(204,255,0,0.3)', boxShadow: '0 0 50px rgba(204,255,0,0.12)' }}>
            <div className="flex items-center justify-between pb-4 mb-4 border-b" style={{ borderColor: 'rgba(204,255,0,0.15)' }}>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5" style={{ color: '#CCFF00' }} />
                Record Fee Payment
              </h3>
              <button onClick={() => setMarkPaidModalFee(null)} style={{ color: 'rgba(255,255,255,0.4)' }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Fee Info Summary */}
            <div className="rounded-xl p-3 mb-5 border"
              style={{ background: 'rgba(204,255,0,0.06)', borderColor: 'rgba(204,255,0,0.2)' }}>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Recording payment for <strong className="text-white">{markPaidModalFee.month}</strong>
                {' '}•{' '}
                <strong style={{ color: '#CCFF00' }}>₹{markPaidModalFee.amountDue.toLocaleString('en-IN')}</strong>
                {' '}•{' '}
                <strong style={{ color: '#00FFFF' }}>{currentStudent.name}</strong>
              </p>
            </div>

            <div className="space-y-4">
              {/* Date of Payment */}
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: 'rgba(204,255,0,0.7)' }}>
                  📅 Date of Payment
                </label>
                <input
                  type="date"
                  value={payDate}
                  onChange={(e) => setPayDate(e.target.value)}
                  className="w-full rounded-xl px-3 py-2 text-xs text-white border focus:outline-none font-bold"
                  style={{ background: 'rgba(0,0,0,0.4)', borderColor: 'rgba(204,255,0,0.25)' }}
                  required
                />
              </div>

              {/* Payment Mode */}
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: 'rgba(204,255,0,0.7)' }}>
                  💳 Payment Method
                </label>
                <select
                  value={payMode}
                  onChange={(e) => setPayMode(e.target.value)}
                  className="w-full rounded-xl px-3 py-2 text-xs text-white font-bold border focus:outline-none"
                  style={{ background: 'rgba(0,0,0,0.4)', borderColor: 'rgba(204,255,0,0.25)' }}
                >
                  <option value="UPI" style={{ background: '#13165a' }}>📱 UPI (Google Pay / PhonePe)</option>
                  <option value="GPay UPI" style={{ background: '#13165a' }}>📱 GPay UPI</option>
                  <option value="PhonePe UPI" style={{ background: '#13165a' }}>📱 PhonePe UPI</option>
                  <option value="Paytm UPI" style={{ background: '#13165a' }}>📱 Paytm UPI</option>
                  <option value="Cash" style={{ background: '#13165a' }}>💵 Cash Payment</option>
                  <option value="Bank Transfer" style={{ background: '#13165a' }}>🏦 Bank Transfer / NEFT</option>
                  <option value="Cheque" style={{ background: '#13165a' }}>📝 Cheque</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setMarkPaidModalFee(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border"
                  style={{ background: 'rgba(0,0,0,0.3)', color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.1)' }}>
                  Cancel
                </button>
                <button onClick={handleConfirmPay}
                  className="px-5 py-2 rounded-xl text-xs font-black flex items-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #CCFF00, #00FFFF)', color: '#191970', boxShadow: '0 0 16px rgba(204,255,0,0.35)' }}>
                  <CheckCircle className="w-4 h-4" />
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MARK UNPAID CONFIRM MODAL ── */}
      {unpaidConfirmFeeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)' }}>
          <div className="rounded-3xl p-6 max-w-sm w-full shadow-2xl border"
            style={{ background: '#13165a', borderColor: 'rgba(255,0,255,0.3)', boxShadow: '0 0 50px rgba(255,0,255,0.1)' }}>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(255,0,255,0.12)', border: '1px solid rgba(255,0,255,0.3)' }}>
                <AlertCircle className="w-5 h-5" style={{ color: '#FF00FF' }} />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Revert to Unpaid?</h3>
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  This will mark the payment as <strong style={{ color: '#FF00FF' }}>Unpaid</strong> and remove the recorded payment date and mode. This action can be undone by marking it paid again.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setUnpaidConfirmFeeId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold border"
                style={{ background: 'rgba(0,0,0,0.3)', color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.1)' }}>
                Cancel
              </button>
              <button onClick={handleConfirmUnpaid}
                className="px-5 py-2 rounded-xl text-xs font-black flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #FF00FF, rgba(255,0,255,0.6))', color: '#191970', boxShadow: '0 0 14px rgba(255,0,255,0.3)' }}>
                <Undo2 className="w-4 h-4" />
                Yes, Mark Unpaid
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
