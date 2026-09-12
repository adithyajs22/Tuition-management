import React, { useState } from 'react';
import { useTeacherPortal, CLASSES_LIST, BOARDS_LIST, SUBJECTS_LIST } from '../context/TeacherPortalContext';
import { BookOpen, Plus, Trash2, RefreshCw, Filter } from 'lucide-react';

export default function PortionProgress() {
  const { 
    portions, 
    addPortion, 
    updatePortionStatus, 
    deletePortion, 
    selectedClass,
    setSelectedClass,
    selectedBoard,
    setSelectedBoard,
    selectedSubject, 
    setSelectedSubject, 
    resetToMasterSyllabus 
  } = useTeacherPortal();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newPortionTitle, setNewPortionTitle] = useState('');

  // Portions filtered strictly by selected Class, Board, AND Subject
  const currentFilteredPortions = portions.filter(p => 
    p.targetClass === selectedClass && 
    p.board === selectedBoard && 
    p.subject === selectedSubject
  );

  // AUTOMATIC PROGRESS CALCULATION
  const totalPortions = currentFilteredPortions.length;
  const completedCount = currentFilteredPortions.filter(p => p.status === 'Completed').length;
  const inProgressCount = currentFilteredPortions.filter(p => p.status === 'In Progress').length;

  const calculatedProgress = totalPortions > 0
    ? Math.round(((completedCount * 1.0 + inProgressCount * 0.5) / totalPortions) * 100)
    : 0;

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newPortionTitle.trim()) return;

    addPortion(selectedClass, selectedBoard, selectedSubject, newPortionTitle);
    setNewPortionTitle('');
    setShowAddModal(false);
  };

  return (
    <div className="py-8 bg-[#000000] text-slate-100 min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Banner */}
        <div className="bg-[#09090b] border border-[#1f1f23] rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 backdrop-blur-md">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-extrabold uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4 text-orange-400" />
              <span>Syllabus Portion Tracker</span>
            </div>

            <h2 className="text-2xl font-black text-white tracking-tight">
              Classes 5 to 12 • Syllabus & Auto Progress
            </h2>
            <p className="text-xs text-orange-400/90 mt-1 font-medium">
              Peacock Blue & Dark Orange Theme • Auto-calculates portion completion!
            </p>
          </div>

          {/* Auto Progress Counter */}
          <div className="flex items-center gap-4 bg-[#000000] p-4 rounded-2xl border border-cyan-500/30 shrink-0 shadow-lg">
            <div className="text-right">
              <p className="text-[10px] text-orange-400 font-extrabold uppercase tracking-wider">Auto Progress</p>
              <p className="text-2xl font-black text-cyan-400">{calculatedProgress}% Done</p>
              <p className="text-[11px] text-zinc-400">{completedCount} of {totalPortions} Portions Completed</p>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 via-teal-600 to-orange-600 text-slate-950 flex items-center justify-center font-black text-lg shadow-md">
              {calculatedProgress}%
            </div>
          </div>
        </div>

        {/* 3 DROPDOWN SELECTORS BAR */}
        <div className="bg-[#09090b] border border-[#1f1f23] rounded-2xl p-5 shadow-xl grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Dropdown 1: Select Class */}
          <div>
            <label className="block text-[10px] font-bold text-orange-400 uppercase mb-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-cyan-400" />
              1. Select Class (5 to 12)
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-[#000000] border border-[#27272a] rounded-xl px-3.5 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-cyan-400 cursor-pointer shadow-inner"
            >
              {CLASSES_LIST.map(c => (
                <option key={c} value={c} className="bg-[#09090b] text-white font-bold">{c}</option>
              ))}
            </select>
          </div>

          {/* Dropdown 2: Select Board */}
          <div>
            <label className="block text-[10px] font-bold text-orange-400 uppercase mb-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-orange-400" />
              2. Select Syllabus Board
            </label>
            <select
              value={selectedBoard}
              onChange={(e) => setSelectedBoard(e.target.value)}
              className="w-full bg-[#000000] border border-[#27272a] rounded-xl px-3.5 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-orange-400 cursor-pointer shadow-inner"
            >
              {BOARDS_LIST.map(b => (
                <option key={b} value={b} className="bg-[#09090b] text-white font-bold">{b}</option>
              ))}
            </select>
          </div>

          {/* Dropdown 3: Select Subject */}
          <div>
            <label className="block text-[10px] font-bold text-orange-400 uppercase mb-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-cyan-400" />
              3. Select Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-[#000000] border border-[#27272a] rounded-xl px-3.5 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-cyan-400 cursor-pointer shadow-inner"
            >
              {SUBJECTS_LIST.map(s => (
                <option key={s} value={s} className="bg-[#09090b] text-white font-bold">{s}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Action Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold">
              Showing: {selectedClass} • {selectedBoard} • {selectedSubject}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetToMasterSyllabus}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#09090b] hover:bg-[#121215] text-zinc-300 text-xs font-bold border border-[#27272a]"
              title="Reset syllabus database"
            >
              <RefreshCw className="w-3.5 h-3.5 text-orange-400" />
              Reset Database
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-orange-500 hover:from-cyan-300 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 transition-all shrink-0"
            >
              <Plus className="w-4 h-4 text-slate-950 font-bold" />
              Add Extra Portion
            </button>
          </div>
        </div>

        {/* Portions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentFilteredPortions.length > 0 ? (
            currentFilteredPortions.map((portion) => (
              <div
                key={portion.id}
                className="bg-[#09090b] border border-[#1f1f23] rounded-2xl p-5 hover:border-cyan-500/40 transition-all flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                        {portion.targetClass}
                      </span>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-orange-500/15 text-orange-400 border border-orange-500/30">
                        {portion.board}
                      </span>
                    </div>

                    <button
                      onClick={() => deletePortion(portion.id)}
                      className="p-1 rounded bg-[#000000] hover:bg-rose-900/60 text-rose-400 transition-colors border border-[#27272a]"
                      title="Delete Portion"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="font-bold text-white text-base leading-snug">{portion.portionName}</h3>
                </div>

                {/* Status Toggle Dropdown */}
                <div className="mt-4 pt-3 border-t border-[#1f1f23] flex items-center justify-between">
                  <label className="text-[10px] font-bold text-orange-400 uppercase">Status:</label>

                  <select
                    value={portion.status}
                    onChange={(e) => updatePortionStatus(portion.id, e.target.value)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold focus:outline-none transition-colors cursor-pointer border ${
                      portion.status === 'Completed' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/40' :
                      portion.status === 'In Progress' ? 'bg-orange-500/15 text-orange-400 border-orange-500/40' :
                      'bg-[#000000] text-zinc-400 border-[#27272a]'
                    }`}
                  >
                    <option value="Completed" className="bg-[#09090b] text-cyan-400 font-bold">Completed</option>
                    <option value="In Progress" className="bg-[#09090b] text-orange-400 font-bold">In Progress</option>
                    <option value="Not Started" className="bg-[#09090b] text-zinc-400 font-bold">Not Started</option>
                  </select>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-zinc-400 bg-[#09090b] rounded-3xl border border-[#1f1f23]">
              No pre-loaded portions found for {selectedClass} • {selectedBoard} • {selectedSubject}. Click "Add Extra Portion" above!
            </div>
          )}
        </div>

      </div>

      {/* ADD PORTION MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#000000]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#09090b] border border-[#1f1f23] rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Add Custom Portion</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="bg-[#000000] p-3 rounded-xl border border-[#27272a] text-xs space-y-1">
                <p className="text-zinc-400">Class: <strong className="text-white">{selectedClass}</strong></p>
                <p className="text-zinc-400">Board: <strong className="text-orange-400">{selectedBoard}</strong></p>
                <p className="text-zinc-400">Subject: <strong className="text-cyan-400">{selectedSubject}</strong></p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Portion / Chapter Name</label>
                <input
                  type="text"
                  placeholder="e.g. Chemical Bonding & Molecular Structure"
                  value={newPortionTitle}
                  onChange={(e) => setNewPortionTitle(e.target.value)}
                  className="w-full bg-[#000000] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-white"
                  required
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-xl bg-[#18181b] text-xs font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-orange-500 text-slate-950 text-xs font-black">
                  Save Portion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
