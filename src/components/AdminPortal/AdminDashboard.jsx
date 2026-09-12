import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import StudentRoster from './StudentRoster';
import StudentDetailEditor from './StudentDetailEditor';
import { LayoutDashboard, Users, CreditCard, Award, Edit3, RefreshCw, BookOpen } from 'lucide-react';

export default function AdminDashboard() {
  const { 
    students, 
    syllabusData, 
    updateModuleStatus, 
    resetToDefaultData,
    activeStream,
    setActiveStream
  } = usePortal();

  const [selectedSubjectId, setSelectedSubjectId] = useState('phy');
  const streamSubjects = syllabusData[activeStream] || [];
  const currentSubject = streamSubjects.find(s => s.id === selectedSubjectId) || streamSubjects[0] || {};

  // Stats Calculations
  const totalStudents = students.length;
  const totalMonthlyEst = students.reduce((sum, s) => sum + Number(s.monthlyFee || 0), 0);

  return (
    <div className="py-10 bg-slate-950 text-slate-100 min-h-[90vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Teacher Header & Stats Overview */}
        <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                <LayoutDashboard className="w-4 h-4" />
                <span>Teacher Admin Dashboard</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white">Student Management Portal</h2>
              <p className="text-slate-400 text-xs mt-1">
                Add, edit, or delete students, log daily attendance, record fee payments, and update Kerala Plus One syllabus.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={resetToDefaultData}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-all shadow"
                title="Reset sample data back to seed state"
              >
                <RefreshCw className="w-4 h-4 text-cyan-400" />
                Reset Seed Data
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-800">
            
            <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Total Active Students</p>
                <p className="text-xl font-extrabold text-white">{totalStudents} Enrolled</p>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Monthly Tuition Revenue</p>
                <p className="text-xl font-extrabold text-emerald-400">₹{totalMonthlyEst.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Kerala Plus One Streams</p>
                <p className="text-xl font-extrabold text-white">Science & Commerce</p>
              </div>
            </div>

          </div>

        </div>

        {/* 1. Student Roster (Add, Edit, Delete Controls) */}
        <StudentRoster />

        {/* 2. Deep Inspector & Record Editor for Selected Student */}
        <StudentDetailEditor />

        {/* 3. Live Kerala Plus One Syllabus Progress Editor */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                Live Syllabus Status Manager
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Update module status (Completed, In Progress, Not Started) and progress percentage sliders.
              </p>
            </div>

            {/* Stream Selector */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setActiveStream('science'); setSelectedSubjectId('phy'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeStream === 'science' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                🔬 Science Stream
              </button>
              <button
                onClick={() => { setActiveStream('commerce'); setSelectedSubjectId('acc'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeStream === 'commerce' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                📊 Commerce Stream
              </button>
            </div>
          </div>

          {/* Subject Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-slate-800">
            {streamSubjects.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubjectId(sub.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  (currentSubject.id === sub.id)
                    ? 'bg-slate-800 text-white border border-indigo-500/50 shadow'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                {sub.subject} ({sub.code})
              </button>
            ))}
          </div>

          {/* Modules Table */}
          {currentSubject.modules && (
            <div className="space-y-4">
              {currentSubject.modules.map((mod) => (
                <div 
                  key={mod.id}
                  className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="text-sm font-bold text-white">{mod.name}</h4>
                    <p className="text-xs text-slate-400">{mod.chapters.join(', ')}</p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    
                    <div>
                      <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Status</label>
                      <select
                        value={mod.status}
                        onChange={(e) => {
                          const newStat = e.target.value;
                          const newProg = newStat === 'Completed' ? 100 : newStat === 'Not Started' ? 0 : 50;
                          updateModuleStatus(activeStream, currentSubject.id, mod.id, newStat, newProg);
                        }}
                        className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-semibold focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Completed">Completed</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Not Started">Not Started</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">
                        Progress: {mod.progress}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={mod.progress}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          let stat = 'In Progress';
                          if (val === 100) stat = 'Completed';
                          if (val === 0) stat = 'Not Started';
                          updateModuleStatus(activeStream, currentSubject.id, mod.id, stat, val);
                        }}
                        className="w-28 accent-indigo-500 cursor-pointer"
                      />
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
