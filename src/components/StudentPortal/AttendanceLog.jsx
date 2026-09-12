import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { Calendar as CalendarIcon, CheckCircle2, XCircle, Clock, BookOpen, Plus, Search } from 'lucide-react';

export default function AttendanceLog() {
  const { currentStudentAttendance, isAdminMode, addAttendanceRecord, activeStudentId } = usePortal();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Record Form State for Admin Mode
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newStatus, setNewStatus] = useState('Present');
  const [newArrivalTime, setNewArrivalTime] = useState('05:00 PM');
  const [newTopic, setNewTopic] = useState('');

  const filteredLogs = currentStudentAttendance.filter(item => 
    item.date.includes(searchTerm) || 
    item.topicsCovered.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newTopic.trim()) return;

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[new Date(newDate).getDay()];

    addAttendanceRecord(activeStudentId, {
      date: newDate,
      day: dayName,
      status: newStatus,
      arrivalTime: newStatus === 'Present' ? newArrivalTime : '-',
      topicsCovered: newTopic
    });

    setNewTopic('');
    setShowAddModal(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl mb-8">
      
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <CalendarIcon className="w-4 h-4" />
            <span>Attendance Log</span>
          </div>
          <h3 className="text-xl font-bold text-white">Daily Attendance & Topic Summary</h3>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search topic or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 w-48 sm:w-64"
            />
          </div>

          {/* Tutor Mode Add Attendance Button */}
          {isAdminMode && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              Log Attendance
            </button>
          )}
        </div>
      </div>

      {/* Attendance Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] font-bold tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4 rounded-l-xl">Date & Day</th>
              <th className="py-3 px-4">Arrival Time</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 rounded-r-xl">Topics Covered Today</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-100">{item.date}</div>
                    <div className="text-[11px] text-slate-400">{item.day}</div>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-slate-300">
                    <span className="inline-flex items-center gap-1 text-xs bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                      <Clock className="w-3 h-3 text-indigo-400" />
                      {item.arrivalTime}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    {item.status === 'Present' && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Present
                      </span>
                    )}
                    {item.status === 'Absent' && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">
                        <XCircle className="w-3.5 h-3.5" /> Absent
                      </span>
                    )}
                    {item.status === 'Excused' && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        <Clock className="w-3.5 h-3.5" /> Excused Leave
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-200">
                      <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>{item.topicsCovered}</span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-8 text-center text-slate-500 text-xs">
                  No attendance records found matching search query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Attendance Modal (Admin Only) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Log Daily Student Attendance</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100"
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
                    value={newArrivalTime}
                    onChange={(e) => setNewArrivalTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100"
                    placeholder="05:00 PM"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Topics Covered Today</label>
                <textarea
                  rows="3"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="e.g. Physics: Laws of Motion Numerical Problems"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
