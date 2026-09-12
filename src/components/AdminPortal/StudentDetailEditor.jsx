import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { Calendar, CreditCard, Award, Plus, Trash2, CheckCircle2, XCircle, Clock, BookOpen, FileText, Send } from 'lucide-react';

export default function StudentDetailEditor() {
  const { 
    currentStudent, 
    currentStudentAttendance, 
    currentStudentFees, 
    currentStudentScores,
    addAttendanceRecord,
    deleteAttendanceRecord,
    markFeeAsPaid,
    deleteFeeRecord,
    addExamScore,
    deleteExamScore,
    setActiveReceipt
  } = usePortal();

  const [activeSubTab, setActiveSubTab] = useState('attendance'); // 'attendance' | 'fees' | 'scores'

  // Modals state
  const [showAttModal, setShowAttModal] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [showFeePayModal, setShowFeePayModal] = useState(null);

  // Forms state
  const [attDate, setAttDate] = useState(new Date().toISOString().split('T')[0]);
  const [attStatus, setAttStatus] = useState('Present');
  const [attTime, setAttTime] = useState('05:00 PM');
  const [attTopic, setAttTopic] = useState('');

  const [scoreSubject, setScoreSubject] = useState('Physics');
  const [scoreTopic, setScoreTopic] = useState('');
  const [maxMarks, setMaxMarks] = useState(30);
  const [obtainedMarks, setObtainedMarks] = useState(25);

  const [payMode, setPayMode] = useState('UPI (Google Pay)');

  if (!currentStudent) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-slate-400">
        No student selected. Please add or select a student from the roster.
      </div>
    );
  }

  // Submit Attendance
  const handleAttSubmit = (e) => {
    e.preventDefault();
    if (!attTopic.trim()) return;
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[new Date(attDate).getDay()];

    addAttendanceRecord(currentStudent.id, {
      date: attDate,
      day: dayName,
      status: attStatus,
      arrivalTime: attStatus === 'Present' ? attTime : '-',
      topicsCovered: attTopic
    });

    setAttTopic('');
    setShowAttModal(false);
  };

  // Submit Exam Score
  const handleScoreSubmit = (e) => {
    e.preventDefault();
    if (!scoreTopic.trim()) return;
    const perc = (obtainedMarks / maxMarks) * 100;
    let grade = 'A+';
    if (perc < 90 && perc >= 80) grade = 'A';
    if (perc < 80 && perc >= 70) grade = 'B+';
    if (perc < 70 && perc >= 60) grade = 'B';
    if (perc < 60) grade = 'C';

    addExamScore(currentStudent.id, {
      subject: scoreSubject,
      topic: scoreTopic,
      testDate: new Date().toISOString().split('T')[0],
      maxMarks: Number(maxMarks),
      marksObtained: Number(obtainedMarks),
      grade: grade
    });

    setScoreTopic('');
    setShowScoreModal(false);
  };

  // Submit Fee Payment
  const handleFeePayConfirm = () => {
    if (!showFeePayModal) return;
    markFeeAsPaid(currentStudent.id, showFeePayModal.id, {
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMode: payMode
    });
    setShowFeePayModal(null);
  };

  const generateWhatsAppReminder = (fee) => {
    const text = `Hi ${currentStudent.parentName}, gentle reminder regarding tuition fee for ${currentStudent.name} (${fee.month}) of ₹${fee.amountDue} due on ${fee.dueDate}. Payment can be made via UPI or Cash. Thank you - Apex Tuition Academy.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl mb-8">
      
      {/* Student Inspector Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-6">
        <div className="flex items-center gap-4">
          <img 
            src={currentStudent.avatar} 
            alt={currentStudent.name} 
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/40"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white">{currentStudent.name}</h3>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                {currentStudent.id}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Batch: <strong className="text-slate-200">{currentStudent.batch}</strong> • Parent: <strong className="text-slate-200">{currentStudent.parentName} ({currentStudent.parentPhone})</strong>
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveSubTab('attendance')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'attendance' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Attendance ({currentStudentAttendance.length})
          </button>

          <button
            onClick={() => setActiveSubTab('fees')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'fees' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Fees Ledger ({currentStudentFees.length})
          </button>

          <button
            onClick={() => setActiveSubTab('scores')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'scores' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Test Scores ({currentStudentScores.length})
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: ATTENDANCE MANAGEMENT */}
      {activeSubTab === 'attendance' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-slate-200">Daily Attendance Log</h4>
            <button
              onClick={() => setShowAttModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Log Attendance
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Arrival</th>
                  <th className="py-2.5 px-3">Topics Covered</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {currentStudentAttendance.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-bold text-white">{item.date} ({item.day})</td>
                    <td className="py-3 px-3">
                      {item.status === 'Present' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          Present
                        </span>
                      )}
                      {item.status === 'Absent' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                          Absent
                        </span>
                      )}
                      {item.status === 'Excused' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          Excused
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-400">{item.arrivalTime}</td>
                    <td className="py-3 px-3 text-slate-200">{item.topicsCovered}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => deleteAttendanceRecord(currentStudent.id, item.id)}
                        className="p-1.5 rounded-md bg-slate-800 hover:bg-rose-900/60 text-rose-400 transition-colors"
                        title="Delete Attendance Entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: FEES LEDGER MANAGEMENT */}
      {activeSubTab === 'fees' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-slate-200">Monthly Tuition Fee Records</h4>
            <span className="text-xs text-emerald-400 font-bold bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
              Monthly Rate: ₹{currentStudent.monthlyFee}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Month</th>
                  <th className="py-2.5 px-3">Amount Due</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Paid Date</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {currentStudentFees.map((fee) => (
                  <tr key={fee.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-bold text-white">{fee.month}</td>
                    <td className="py-3 px-3 font-extrabold text-slate-200">₹{fee.amountDue}</td>
                    <td className="py-3 px-3">
                      {fee.status === 'Paid' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          Paid
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          Unpaid
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-400">{fee.paymentDate}</td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {fee.status === 'Paid' ? (
                          <button
                            onClick={() => setActiveReceipt({ ...fee, student: currentStudent })}
                            className="px-2.5 py-1 rounded bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-bold hover:bg-indigo-600/40"
                          >
                            Receipt
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => setShowFeePayModal(fee)}
                              className="px-2 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                            >
                              Mark Paid
                            </button>
                            <button
                              onClick={() => generateWhatsAppReminder(fee)}
                              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700"
                              title="WhatsApp Reminder"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => deleteFeeRecord(currentStudent.id, fee.id)}
                          className="p-1 rounded bg-slate-800 hover:bg-rose-900/60 text-rose-400"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: TEST SCORES */}
      {activeSubTab === 'scores' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-slate-200">Chapter Unit Test Marks</h4>
            <button
              onClick={() => setShowScoreModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Test Marks
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentStudentScores.map((score) => {
              const perc = Math.round((score.marksObtained / score.maxMarks) * 100);
              return (
                <div key={score.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-purple-400">{score.subject}</span>
                    <h5 className="font-bold text-white text-sm mt-0.5">{score.topic}</h5>
                    <p className="text-xs text-slate-400 mt-1">
                      Score: <strong className="text-white">{score.marksObtained}</strong> / {score.maxMarks} ({perc}%)
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black text-emerald-400 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
                      {score.grade}
                    </span>
                    <button
                      onClick={() => deleteExamScore(currentStudent.id, score.id)}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-900/60 text-rose-400 border border-slate-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Log Attendance Modal */}
      {showAttModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Log Attendance for {currentStudent.name}</h3>
            <form onSubmit={handleAttSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Date</label>
                <input
                  type="date"
                  value={attDate}
                  onChange={(e) => setAttDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Status</label>
                  <select
                    value={attStatus}
                    onChange={(e) => setAttStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Excused">Excused</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Arrival Time</label>
                  <input
                    type="text"
                    value={attTime}
                    onChange={(e) => setAttTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Topics Covered</label>
                <textarea
                  rows="3"
                  value={attTopic}
                  onChange={(e) => setAttTopic(e.target.value)}
                  placeholder="e.g. Physics Laws of Motion Problem Solving"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAttModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Test Marks Modal */}
      {showScoreModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Record Test Marks</h3>
            <form onSubmit={handleScoreSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Subject</label>
                <select
                  value={scoreSubject}
                  onChange={(e) => setScoreSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Biology">Biology</option>
                  <option value="Accountancy">Accountancy</option>
                  <option value="Economics">Economics</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Topic Name</label>
                <input
                  type="text"
                  value={scoreTopic}
                  onChange={(e) => setScoreTopic(e.target.value)}
                  placeholder="e.g. Motion in a Straight Line"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Max Marks</label>
                  <input
                    type="number"
                    value={maxMarks}
                    onChange={(e) => setMaxMarks(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Marks Obtained</label>
                  <input
                    type="number"
                    value={obtainedMarks}
                    onChange={(e) => setObtainedMarks(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowScoreModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold"
                >
                  Save Marks
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Fee Payment Modal */}
      {showFeePayModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Record Fee Payment</h3>
            <p className="text-xs text-slate-400 mb-4">
              Marking <strong className="text-white">{showFeePayModal.month}</strong> fee (₹{showFeePayModal.amountDue}) as paid for <strong className="text-indigo-400">{currentStudent.name}</strong>.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Payment Method</label>
                <select
                  value={payMode}
                  onChange={(e) => setPayMode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="UPI (Google Pay)">UPI (Google Pay)</option>
                  <option value="UPI (PhonePe)">UPI (PhonePe)</option>
                  <option value="Cash Payment">Cash Payment</option>
                  <option value="Bank NEFT/IMPS">Bank NEFT/IMPS</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowFeePayModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFeePayConfirm}
                  className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold"
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
