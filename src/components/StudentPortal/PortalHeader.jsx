import React from 'react';
import { usePortal } from '../../context/PortalContext';
import { UserCheck, Calendar, CreditCard, Award, Phone, ShieldCheck, User } from 'lucide-react';

export default function PortalHeader() {
  const { currentStudent, currentStudentAttendance, currentStudentFees, currentStudentScores, students, activeStudentId, setActiveStudentId } = usePortal();

  // Attendance stats
  const totalClasses = currentStudentAttendance.length;
  const presentClasses = currentStudentAttendance.filter(a => a.status === 'Present').length;
  const attendanceRate = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 100;

  // Fee stats
  const pendingFees = currentStudentFees.filter(f => f.status === 'Unpaid');
  const feeStatusSummary = pendingFees.length > 0 ? `${pendingFees.length} Month Pending` : 'All Fees Paid';

  // Exam stats
  const totalTests = currentStudentScores.length;
  const avgScore = totalTests > 0 
    ? Math.round(currentStudentScores.reduce((sum, s) => sum + (s.marksObtained / s.maxMarks) * 100, 0) / totalTests)
    : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden mb-8">
      
      {/* Glow background accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        
        {/* Student Profile Info */}
        <div className="flex items-center gap-5">
          <img 
            src={currentStudent.avatar} 
            alt={currentStudent.name} 
            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-indigo-500/30 shadow-xl"
          />
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{currentStudent.name}</h2>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 uppercase tracking-wider">
                ID: {currentStudent.id}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                {currentStudent.stream} Stream
              </span>
            </div>

            <p className="text-slate-400 text-xs mt-1.5 flex items-center gap-4 flex-wrap">
              <span>Batch: <strong className="text-slate-200">{currentStudent.batch}</strong></span>
              <span>Parent: <strong className="text-slate-200">{currentStudent.parentName} ({currentStudent.parentPhone})</strong></span>
              <span>Monthly Fee: <strong className="text-emerald-400">₹{currentStudent.monthlyFee}</strong></span>
            </p>
          </div>
        </div>

        {/* Profile Switcher & Fast Stats */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
              {attendanceRate}%
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Attendance Rate</p>
              <p className="text-xs font-bold text-slate-200">{presentClasses} / {totalClasses} Sessions</p>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex items-center gap-3 shrink-0">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
              pendingFees.length > 0 ? 'bg-amber-500/10 text-amber-400' : 'bg-indigo-500/10 text-indigo-400'
            }`}>
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Fee Status</p>
              <p className={`text-xs font-bold ${pendingFees.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {feeStatusSummary}
              </p>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-sm">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Avg Test Score</p>
              <p className="text-xs font-bold text-slate-200">{avgScore}% Accuracy</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
