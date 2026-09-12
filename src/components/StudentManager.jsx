import React, { useState } from 'react';
import { useTeacherPortal } from '../context/TeacherPortalContext';
import { UserPlus, Edit3, Trash2, Search, Users, X, Calendar, Filter, RefreshCw } from 'lucide-react';

const CLASSES_LIST = [
  'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 
  'Plus One (Class 11)', 'Plus Two (Class 12)'
];

const BOARDS_LIST = [
  'State Syllabus (Kerala)', 'CBSE'
];

export default function StudentManager() {
  const { 
    students, 
    activeStudentId, 
    setActiveStudentId, 
    addStudent, 
    updateStudent, 
    deleteStudent, 
    selectedClassFilter, 
    setSelectedClassFilter,
    selectedBoardFilter,
    setSelectedBoardFilter,
    seedSampleStudents
  } = useTeacherPortal();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deletingStudentId, setDeletingStudentId] = useState(null);

  // Add Form state
  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState('Plus One (Class 11)');
  const [board, setBoard] = useState('State Syllabus (Kerala)');
  const [batch, setBatch] = useState('Science Batch');
  const [monthlyFee, setMonthlyFee] = useState('2500');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().split('T')[0]); // Date of Admission

  // Edit Form state
  const [editName, setEditName] = useState('');
  const [editClass, setEditClass] = useState('Plus One (Class 11)');
  const [editBoard, setEditBoard] = useState('State Syllabus (Kerala)');
  const [editBatch, setEditBatch] = useState('');
  const [editFee, setEditFee] = useState('');
  const [editParentName, setEditParentName] = useState('');
  const [editParentPhone, setEditParentPhone] = useState('');
  const [editJoiningDate, setEditJoiningDate] = useState('');

  // Robust Case-Insensitive Filter & Search Logic
  const filteredStudents = students.filter(s => {
    const query = searchTerm.trim().toLowerCase();

    const matchesClass = selectedClassFilter === 'All' || s.studentClass === selectedClassFilter;
    const matchesBoard = selectedBoardFilter === 'All' || s.board === selectedBoardFilter;

    if (!query) {
      return matchesClass && matchesBoard;
    }

    const sName = (s.name || '').toLowerCase();
    const sId = (s.id || '').toLowerCase();
    const sBatch = (s.batch || '').toLowerCase();
    const sClass = (s.studentClass || '').toLowerCase();
    const sBoard = (s.board || '').toLowerCase();
    const sParent = (s.parentName || '').toLowerCase();
    const sPhone = (s.parentPhone || '').toLowerCase();
    const sDate = (s.joiningDate || '').toLowerCase();

    const matchesQuery = sName.includes(query) || 
                         sId.includes(query) || 
                         sBatch.includes(query) || 
                         sClass.includes(query) || 
                         sBoard.includes(query) || 
                         sParent.includes(query) ||
                         sPhone.includes(query) ||
                         sDate.includes(query);

    return matchesQuery && matchesClass && matchesBoard;
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Add new student with Date of Admission
    addStudent({
      name,
      studentClass,
      board,
      batch,
      monthlyFee,
      parentName,
      parentPhone,
      joiningDate
    });

    // Reset filters and search term so the newly added student is 100% GUARANTEED to be visible!
    setSelectedClassFilter('All');
    setSelectedBoardFilter('All');
    setSearchTerm('');

    setName('');
    setShowAddModal(false);
  };

  const openEditModal = (s) => {
    setEditingStudent(s);
    setEditName(s.name || '');
    setEditClass(s.studentClass || 'Plus One (Class 11)');
    setEditBoard(s.board || 'State Syllabus (Kerala)');
    setEditBatch(s.batch || '');
    setEditFee(s.monthlyFee || 2500);
    setEditParentName(s.parentName || '');
    setEditParentPhone(s.parentPhone || '');
    setEditJoiningDate(s.joiningDate || new Date().toISOString().split('T')[0]);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingStudent) return;

    updateStudent(editingStudent.id, {
      name: editName,
      studentClass: editClass,
      board: editBoard,
      batch: editBatch,
      monthlyFee: Number(editFee),
      parentName: editParentName,
      parentPhone: editParentPhone,
      joiningDate: editJoiningDate
    });

    setEditingStudent(null);
  };

  const handleDeleteConfirm = () => {
    if (deletingStudentId) {
      deleteStudent(deletingStudentId);
      setDeletingStudentId(null);
    }
  };

  const resetAllFilters = () => {
    setSelectedClassFilter('All');
    setSelectedBoardFilter('All');
    setSearchTerm('');
  };

  return (
    <div className="py-8 min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Roster Header Toolbar */}
        <div className="rounded-3xl p-5 shadow-xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border"
          style={{ background: 'rgba(13,16,69,0.85)', borderColor: 'rgba(0,255,255,0.2)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold shrink-0"
              style={{ background: 'rgba(0,255,255,0.1)', border: '1px solid rgba(0,255,255,0.25)', color: '#00FFFF' }}>
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                Student Roster ({students.length} Enrolled)
              </h2>
              <p className="text-xs font-semibold mt-0.5" style={{ color: '#FF00FF' }}>
                Classes 5 to 12 • State Syllabus & CBSE
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative min-w-[200px] flex-1 sm:flex-none sm:w-60">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#00FFFF' }} />
              <input
                type="text"
                placeholder="Search name, ID, class, mobile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl pl-9 pr-8 py-2 text-xs text-white focus:outline-none border"
                style={{ background: 'rgba(0,0,0,0.4)', borderColor: 'rgba(0,255,255,0.2)' }}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Class Filter Dropdown */}
            <div className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs border"
              style={{ background: 'rgba(0,0,0,0.35)', borderColor: 'rgba(0,255,255,0.18)' }}>
              <Filter className="w-3.5 h-3.5" style={{ color: '#00FFFF' }} />
              <select
                value={selectedClassFilter}
                onChange={(e) => setSelectedClassFilter(e.target.value)}
                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
              >
                <option value="All" style={{ background: '#13165a' }}>All Classes</option>
                {CLASSES_LIST.map(c => (
                  <option key={c} value={c} style={{ background: '#13165a' }}>{c}</option>
                ))}
              </select>
            </div>

            {/* Board Filter Dropdown */}
            <div className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs border"
              style={{ background: 'rgba(0,0,0,0.35)', borderColor: 'rgba(0,255,255,0.18)' }}>
              <select
                value={selectedBoardFilter}
                onChange={(e) => setSelectedBoardFilter(e.target.value)}
                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
              >
                <option value="All" style={{ background: '#13165a' }}>All Boards</option>
                {BOARDS_LIST.map(b => (
                  <option key={b} value={b} style={{ background: '#13165a' }}>{b}</option>
                ))}
              </select>
            </div>

            {/* Add Student Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs transition-all shrink-0"
              style={{ background: 'linear-gradient(135deg, #FF00FF, #00FFFF)', color: '#191970', boxShadow: '0 0 18px rgba(255,0,255,0.3)' }}
            >
              <UserPlus className="w-4 h-4 text-slate-950 font-bold" />
              Add Student
            </button>
          </div>
        </div>

        {/* Active Filter Indicator Banner */}
        {(selectedClassFilter !== 'All' || selectedBoardFilter !== 'All' || searchTerm.trim() !== '') && (
          <div className="rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs border"
            style={{ background: 'rgba(255,0,255,0.06)', borderColor: 'rgba(255,0,255,0.25)', color: 'rgba(255,0,255,0.8)' }}>
            <span className="flex items-center gap-2 font-semibold">
              <Filter className="w-3.5 h-3.5" style={{ color: '#00FFFF' }} />
              Showing {filteredStudents.length} of {students.length} students (Class: {selectedClassFilter} | Board: {selectedBoardFilter} {searchTerm ? `| Search: "${searchTerm}"` : ''})
            </span>
            <button
              onClick={resetAllFilters}
              className="px-3 py-1 rounded-lg font-bold flex items-center gap-1 transition-colors ml-auto border"
              style={{ background: 'rgba(0,255,255,0.1)', borderColor: 'rgba(0,255,255,0.25)', color: '#00FFFF' }}
            >
              <RefreshCw className="w-3 h-3" />
              Reset Search & Filters
            </button>
          </div>
        )}

        {/* Student Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((s) => {
              const isSelected = s.id === activeStudentId;
              return (
                <div
                  key={s.id}
                  className="p-5 rounded-2xl transition-all relative flex flex-col justify-between"
                  style={{
                    background: 'rgba(13,16,69,0.85)',
                    border: isSelected ? '1px solid #00FFFF' : '1px solid rgba(0,255,255,0.12)',
                    boxShadow: isSelected ? '0 0 22px rgba(0,255,255,0.15)' : '0 4px 20px rgba(0,0,0,0.3)'
                  }}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <img src={s.avatar} alt={s.name} className="w-12 h-12 rounded-xl object-cover" style={{ border: '2px solid rgba(255,0,255,0.4)' }} />
                        <div>
                          <h3 className="font-bold text-white text-base leading-snug">{s.name}</h3>
                          <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded border"
                              style={{ background: 'rgba(0,255,255,0.1)', color: '#00FFFF', borderColor: 'rgba(0,255,255,0.25)' }}>
                              {s.studentClass}
                            </span>
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded border"
                              style={{ background: 'rgba(204,255,0,0.1)', color: '#CCFF00', borderColor: 'rgba(204,255,0,0.25)' }}>
                              {s.board}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded border"
                        style={{ background: 'rgba(255,0,255,0.08)', color: 'rgba(255,0,255,0.6)', borderColor: 'rgba(255,0,255,0.2)' }}>
                        {s.id}
                      </span>
                    </div>

                    <div className="bg-[#000000] p-3 rounded-xl border border-[#27272a] space-y-1.5 text-xs text-zinc-300 my-3">
                      <div className="flex justify-between items-center text-orange-400 font-semibold">
                        <span className="text-zinc-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-orange-400" />
                          Date of Admission:
                        </span>
                        <strong className="text-orange-400 font-bold">{s.joiningDate || 'N/A'}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Batch:</span>
                        <strong className="text-white">{s.batch}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Parent:</span>
                        <strong className="text-white">{s.parentName} ({s.parentPhone})</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Monthly Fee:</span>
                        <strong className="text-emerald-400 font-bold">₹{s.monthlyFee}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'rgba(0,255,255,0.1)' }}>
                    <button
                      onClick={() => setActiveStudentId(s.id)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all"
                      style={isSelected
                        ? { background: 'linear-gradient(135deg, #FF00FF, #00FFFF)', color: '#191970', boxShadow: '0 0 12px rgba(255,0,255,0.3)' }
                        : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.08)' }
                      }
                    >
                      {isSelected ? '✓ Active Student' : 'Select Student'}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(s)}
                        className="p-2 rounded-lg border transition-colors"
                        title="Edit Student Info"
                        style={{ background: 'rgba(204,255,0,0.08)', color: '#CCFF00', borderColor: 'rgba(204,255,0,0.2)' }}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingStudentId(s.id)}
                        className="p-2 rounded-lg border transition-colors"
                        title="Delete Student"
                        style={{ background: 'rgba(255,0,255,0.08)', color: '#FF00FF', borderColor: 'rgba(255,0,255,0.2)' }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })
          ) : (
            <div className="col-span-full py-16 text-center bg-[#09090b] border border-[#1f1f23] rounded-3xl p-8 space-y-4 shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/10">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">No Students Listed</h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
                  {students.length > 0
                    ? `No students match active search or filters (Class: ${selectedClassFilter} • Board: ${selectedBoardFilter}).`
                    : "No students enrolled yet. Click '+ Add New Student' to enroll your first student or load demo students to test!"}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {students.length > 0 && (
                  <button
                    onClick={resetAllFilters}
                    className="px-4 py-2 rounded-xl bg-[#18181b] hover:bg-[#27272a] text-white text-xs font-bold flex items-center gap-1.5 border border-[#27272a]"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-orange-400" />
                    Reset Search & Filters
                  </button>
                )}
                {students.length === 0 && seedSampleStudents && (
                  <button
                    onClick={seedSampleStudents}
                    className="px-4 py-2 rounded-xl bg-[#18181b] hover:bg-[#27272a] text-cyan-400 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5"
                  >
                    ⚡ Load Demo Students
                  </button>
                )}
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-orange-500 text-slate-950 text-xs font-black shadow-lg shadow-cyan-500/20 flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  Add New Student
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ADD STUDENT MODAL WITH DATE OF ADMISSION */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)' }}>
          <div className="rounded-3xl p-6 max-w-md w-full shadow-2xl border"
            style={{ background: '#13165a', borderColor: 'rgba(0,255,255,0.25)', boxShadow: '0 0 50px rgba(0,255,255,0.1)' }}>
            <div className="flex items-center justify-between pb-4 mb-4 border-b" style={{ borderColor: 'rgba(0,255,255,0.15)' }}>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5" style={{ color: '#00FFFF' }} />
                Enroll New Student
              </h3>
              <button onClick={() => setShowAddModal(false)} style={{ color: 'rgba(255,255,255,0.5)' }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Student Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sreehari Nair"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#000000] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-white"
                  required
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Class (5 to 12)</label>
                  <select
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="w-full bg-[#000000] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-white font-bold"
                  >
                    {CLASSES_LIST.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Syllabus Board</label>
                  <select
                    value={board}
                    onChange={(e) => setBoard(e.target.value)}
                    className="w-full bg-[#000000] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-white font-bold"
                  >
                    {BOARDS_LIST.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* DATE OF ADMISSION FIELD */}
              <div>
                <label className="block text-xs font-semibold text-orange-400 mb-1 flex items-center gap-1 font-bold">
                  <Calendar className="w-3.5 h-3.5 text-orange-400" />
                  Date of Admission
                </label>
                <input
                  type="date"
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  className="w-full bg-[#000000] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-white font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Batch / Stream</label>
                  <input
                    type="text"
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    className="w-full bg-[#000000] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Monthly Fee (₹)</label>
                  <input
                    type="number"
                    value={monthlyFee}
                    onChange={(e) => setMonthlyFee(e.target.value)}
                    className="w-full bg-[#000000] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Parent Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Suresh Kumar"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="w-full bg-[#000000] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Parent Mobile</label>
                  <input
                    type="text"
                    placeholder="+91 90000 00000"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    className="w-full bg-[#000000] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-xl bg-[#18181b] text-xs font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-orange-500 text-slate-950 font-black text-xs shadow-lg">
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STUDENT MODAL */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-[#000000]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#09090b] border border-[#1f1f23] rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#1f1f23] mb-4">
              <h3 className="text-lg font-bold text-white">Edit Student Profile</h3>
              <button onClick={() => setEditingStudent(null)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Student Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#000000] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Class (5 to 12)</label>
                  <select
                    value={editClass}
                    onChange={(e) => setEditClass(e.target.value)}
                    className="w-full bg-[#000000] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-white font-bold"
                  >
                    {CLASSES_LIST.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Syllabus Board</label>
                  <select
                    value={editBoard}
                    onChange={(e) => setEditBoard(e.target.value)}
                    className="w-full bg-[#000000] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-white font-bold"
                  >
                    {BOARDS_LIST.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* DATE OF ADMISSION FIELD IN EDIT MODAL */}
              <div>
                <label className="block text-xs font-semibold text-orange-400 mb-1 flex items-center gap-1 font-bold">
                  <Calendar className="w-3.5 h-3.5 text-orange-400" />
                  Date of Admission
                </label>
                <input
                  type="date"
                  value={editJoiningDate}
                  onChange={(e) => setEditJoiningDate(e.target.value)}
                  className="w-full bg-[#000000] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-white font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Batch / Stream</label>
                  <input
                    type="text"
                    value={editBatch}
                    onChange={(e) => setEditBatch(e.target.value)}
                    className="w-full bg-[#000000] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Monthly Fee (₹)</label>
                  <input
                    type="number"
                    value={editFee}
                    onChange={(e) => setEditFee(e.target.value)}
                    className="w-full bg-[#000000] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Parent Name</label>
                  <input
                    type="text"
                    value={editParentName}
                    onChange={(e) => setEditParentName(e.target.value)}
                    className="w-full bg-[#000000] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Parent Mobile</label>
                  <input
                    type="text"
                    value={editParentPhone}
                    onChange={(e) => setEditParentPhone(e.target.value)}
                    className="w-full bg-[#000000] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setEditingStudent(null)} className="px-4 py-2 rounded-xl bg-[#18181b] text-xs font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-orange-500 text-slate-950 text-xs font-bold">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deletingStudentId && (
        <div className="fixed inset-0 z-50 bg-[#000000]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#09090b] border border-[#1f1f23] rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Delete Student?</h3>
            <p className="text-xs text-zinc-400 mb-6">
              Are you sure you want to remove this student? All attendance, fees, and exam records will be deleted.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeletingStudentId(null)} className="px-4 py-2 rounded-xl bg-[#18181b] text-xs font-bold">
                Cancel
              </button>
              <button onClick={handleDeleteConfirm} className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
