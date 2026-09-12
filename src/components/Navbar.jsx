import React from 'react';
import { usePortal } from '../context/PortalContext';
import { GraduationCap, LayoutDashboard, BookOpen, Database, Users, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const { 
    tuitionInfo, 
    activeTab, 
    setActiveTab, 
    students, 
    activeStudentId, 
    setActiveStudentId, 
    currentStudent 
  } = usePortal();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/80 border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('dashboard')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight text-white group-hover:text-indigo-400 transition-colors">
                  {tuitionInfo.centerName}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Teacher Portal
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Teacher & Student Management System</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-amber-400" />
              Teacher Dashboard
            </button>

            <button
              onClick={() => setActiveTab('syllabus')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'syllabus'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-indigo-400" />
              Plus One Syllabus
            </button>

            <button
              onClick={() => setActiveTab('nocode')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'nocode'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Database className="w-4 h-4 text-cyan-400" />
              Notion / Sheets Export
            </button>
          </nav>

          {/* Quick Active Student Selector */}
          {currentStudent && (
            <div className="relative group">
              <div className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700/80 cursor-pointer">
                <img 
                  src={currentStudent.avatar} 
                  alt={currentStudent.name} 
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-500/50" 
                />
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-slate-200 leading-tight">{currentStudent.name}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">{currentStudent.id}</p>
                </div>
                <select
                  value={activeStudentId}
                  onChange={(e) => setActiveStudentId(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  title="Switch Active Student Inspector"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id} className="bg-slate-900 text-slate-100">
                      {s.name} ({s.stream.toUpperCase()} - {s.id})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center justify-around py-2.5 border-t border-slate-800/80 gap-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium ${
              activeTab === 'dashboard' ? 'text-amber-400 font-bold' : 'text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('syllabus')}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium ${
              activeTab === 'syllabus' ? 'text-indigo-400 font-bold' : 'text-slate-400'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Syllabus
          </button>
          <button
            onClick={() => setActiveTab('nocode')}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium ${
              activeTab === 'nocode' ? 'text-cyan-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Database className="w-4 h-4" />
            Export
          </button>
        </div>

      </div>
    </header>
  );
}
