import React, { useState } from 'react';
import { useTeacherPortal } from '../context/TeacherPortalContext';
import { Calendar as CalendarIcon, CheckCircle2, XCircle, Sun, Plus, Trash2, BookOpen } from 'lucide-react';

export default function AttendanceTracker() {
  const { currentStudent, currentAttendance, addAttendanceRecord, deleteAttendanceRecord } = useTeacherPortal();

  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState('Present');
  const [topic, setTopic] = useState('');

  if (!currentStudent) {
    return (
      <div className="py-12 text-center" style={{ color: 'rgba(0,255,255,0.5)' }}>
        No active student selected. Please select a student from the navbar dropdown.
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[new Date(date).getDay()];

    addAttendanceRecord(currentStudent.id, {
      date,
      day: dayName,
      status,
      topicsCovered: topic || (status === 'Off Day' ? 'Holiday / Off Day' : 'Regular Tuition Session')
    });

    setTopic('');
    setShowModal(false);
  };

  return (
    <div className="py-8 min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border"
          style={{ background: 'rgba(13,16,69,0.85)', borderColor: 'rgba(0,255,255,0.2)' }}>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#00FFFF' }}>
              <CalendarIcon className="w-4 h-4" />
              <span>Day-by-Day Attendance</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">
              {currentStudent.name} <span className="text-sm font-medium" style={{ color: 'rgba(0,255,255,0.6)' }}>({currentStudent.studentClass})</span>
            </h2>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm shrink-0 transition-all"
            style={{ background: 'linear-gradient(135deg, #00FFFF, #CCFF00)', color: '#191970', boxShadow: '0 0 18px rgba(0,255,255,0.3)' }}
          >
            <Plus className="w-4 h-4" />
            Log Attendance
          </button>
        </div>

        {/* Table */}
        <div className="rounded-3xl p-6 shadow-xl overflow-x-auto border"
          style={{ background: 'rgba(13,16,69,0.85)', borderColor: 'rgba(0,255,255,0.15)' }}>
          <table className="w-full text-left text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
            <thead className="uppercase font-bold border-b" style={{ borderColor: 'rgba(0,255,255,0.1)', color: 'rgba(0,255,255,0.5)' }}>
              <tr>
                <th className="py-3 px-4">Date & Day</th>
                <th className="py-3 px-4">Attendance Status</th>
                <th className="py-3 px-4">Topics / Holiday Details</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentAttendance.length > 0 ? (
                currentAttendance.map((item) => (
                  <tr key={item.id} className="border-b transition-colors"
                    style={{ borderColor: 'rgba(0,255,255,0.06)' }}>
                    <td className="py-3.5 px-4 font-bold text-white">
                      {item.date} <span className="text-[11px] font-medium" style={{ color: 'rgba(0,255,255,0.5)' }}>({item.day})</span>
                    </td>

                    <td className="py-3.5 px-4">
                      {item.status === 'Present' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                          style={{ background: 'rgba(204,255,0,0.1)', color: '#CCFF00', borderColor: 'rgba(204,255,0,0.3)' }}>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Present
                        </span>
                      )}
                      {item.status === 'Absent' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                          style={{ background: 'rgba(255,0,255,0.1)', color: '#FF00FF', borderColor: 'rgba(255,0,255,0.3)' }}>
                          <XCircle className="w-3.5 h-3.5" /> Absent
                        </span>
                      )}
                      {item.status === 'Off Day' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                          style={{ background: 'rgba(0,255,255,0.1)', color: '#00FFFF', borderColor: 'rgba(0,255,255,0.25)' }}>
                          <Sun className="w-3.5 h-3.5" /> Off Day / Holiday
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4" style={{ color: 'rgba(255,255,255,0.75)' }}>
                      {item.topicsCovered}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => deleteAttendanceRecord(currentStudent.id, item.id)}
                        className="p-1.5 rounded-lg border transition-colors"
                        title="Delete entry"
                        style={{ background: 'rgba(255,0,255,0.1)', color: '#FF00FF', borderColor: 'rgba(255,0,255,0.25)' }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-10 text-center" style={{ color: 'rgba(0,255,255,0.3)' }}>
                    No attendance entries logged yet for this student.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* LOG MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)' }}>
          <div className="rounded-3xl p-6 max-w-md w-full shadow-2xl border"
            style={{ background: '#13165a', borderColor: 'rgba(0,255,255,0.25)', boxShadow: '0 0 50px rgba(0,255,255,0.1)' }}>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" style={{ color: '#00FFFF' }} />
              Log Attendance — {currentStudent.name}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'rgba(0,255,255,0.7)' }}>Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl px-3 py-2 text-xs text-white border focus:outline-none"
                  style={{ background: 'rgba(0,0,0,0.4)', borderColor: 'rgba(0,255,255,0.2)' }}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'rgba(0,255,255,0.7)' }}>Attendance Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-xl px-3 py-2 text-xs text-white font-bold border focus:outline-none"
                  style={{ background: 'rgba(0,0,0,0.4)', borderColor: 'rgba(0,255,255,0.2)' }}
                >
                  <option value="Present" style={{ background: '#13165a' }}>✅ Present</option>
                  <option value="Absent" style={{ background: '#13165a' }}>❌ Absent</option>
                  <option value="Off Day" style={{ background: '#13165a' }}>🏖️ Off Day / Holiday</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'rgba(0,255,255,0.7)' }}>Topics Covered / Off Day Reason</label>
                <textarea
                  rows="3"
                  placeholder="e.g. Physics Laws of Motion Problem Solving OR Festival Holiday"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full rounded-xl px-3 py-2 text-xs text-white border focus:outline-none resize-none"
                  style={{ background: 'rgba(0,0,0,0.4)', borderColor: 'rgba(0,255,255,0.2)' }}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border"
                  style={{ background: 'rgba(0,0,0,0.3)', color: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.1)' }}>
                  Cancel
                </button>
                <button type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-black"
                  style={{ background: 'linear-gradient(135deg, #00FFFF, #CCFF00)', color: '#191970', boxShadow: '0 0 16px rgba(0,255,255,0.35)' }}>
                  Save Attendance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
