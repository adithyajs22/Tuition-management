import React, { useState } from 'react';
import { useTeacherPortal } from '../context/TeacherPortalContext';
import {
  ClipboardList, Plus, Trash2, Edit3, X, CheckCircle2, Clock,
  BookOpen, AlertCircle, ChevronDown, ChevronUp
} from 'lucide-react';

const NOTE_TYPES = [
  { value: 'homework', label: '📝 Homework', color: '#00FFFF' },
  { value: 'next_topic', label: '📚 Next Topic / Section', color: '#CCFF00' },
  { value: 'revision', label: '🔄 Revision Task', color: '#FF00FF' },
  { value: 'test_prep', label: '🎯 Test Preparation', color: '#CCFF00' },
  { value: 'general', label: '💡 General Note', color: 'rgba(255,255,255,0.7)' },
  { value: 'urgent', label: '⚠️ Urgent / Important', color: '#FF00FF' },
];

const STATUS_OPTIONS = ['Pending', 'Completed', 'In Progress'];

// Local notes stored keyed by student ID
function useStudentNotes() {
  const [notesMap, setNotesMap] = useState(() => {
    const saved = localStorage.getItem('ajs_student_notes');
    if (saved) {
      try { return JSON.parse(saved); } catch { return {}; }
    }
    return {};
  });

  const saveNotes = (newMap) => {
    setNotesMap(newMap);
    localStorage.setItem('ajs_student_notes', JSON.stringify(newMap));
  };

  const addNote = (studentId, noteData) => {
    const newNote = {
      id: 'note-' + Date.now(),
      ...noteData,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    const existing = notesMap[studentId] || [];
    saveNotes({ ...notesMap, [studentId]: [newNote, ...existing] });
  };

  const updateNoteStatus = (studentId, noteId, status) => {
    const existing = notesMap[studentId] || [];
    const updated = existing.map(n => n.id === noteId ? { ...n, status } : n);
    saveNotes({ ...notesMap, [studentId]: updated });
  };

  const updateNote = (studentId, noteId, changes) => {
    const existing = notesMap[studentId] || [];
    const updated = existing.map(n => n.id === noteId ? { ...n, ...changes } : n);
    saveNotes({ ...notesMap, [studentId]: updated });
  };

  const deleteNote = (studentId, noteId) => {
    const existing = notesMap[studentId] || [];
    saveNotes({ ...notesMap, [studentId]: existing.filter(n => n.id !== noteId) });
  };

  return { notesMap, addNote, updateNoteStatus, updateNote, deleteNote };
}

export default function HomeworkNotes() {
  const { currentStudent, students, activeStudentId, setActiveStudentId } = useTeacherPortal();
  const { notesMap, addNote, updateNoteStatus, updateNote, deleteNote } = useStudentNotes();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Add form state
  const [type, setType] = useState('homework');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Normal');

  // Edit form state
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editPriority, setEditPriority] = useState('Normal');

  const studentNotes = currentStudent ? (notesMap[currentStudent.id] || []) : [];

  const filteredNotes = studentNotes.filter(n => {
    const matchType = filterType === 'All' || n.type === filterType;
    const matchStatus = filterStatus === 'All' || n.status === filterStatus;
    return matchType && matchStatus;
  });

  const pendingCount = studentNotes.filter(n => n.status === 'Pending').length;
  const completedCount = studentNotes.filter(n => n.status === 'Completed').length;
  const inProgressCount = studentNotes.filter(n => n.status === 'In Progress').length;

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !currentStudent) return;
    addNote(currentStudent.id, { type, title: title.trim(), description: description.trim(), dueDate, priority });
    setTitle(''); setDescription(''); setDueDate(''); setType('homework'); setPriority('Normal');
    setShowAddModal(false);
  };

  const openEdit = (note) => {
    setEditingNote(note);
    setEditTitle(note.title);
    setEditDescription(note.description || '');
    setEditDueDate(note.dueDate || '');
    setEditPriority(note.priority || 'Normal');
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingNote) return;
    updateNote(currentStudent.id, editingNote.id, {
      title: editTitle,
      description: editDescription,
      dueDate: editDueDate,
      priority: editPriority
    });
    setEditingNote(null);
  };

  const getNoteTypeConfig = (typeValue) => {
    return NOTE_TYPES.find(t => t.value === typeValue) || NOTE_TYPES[4];
  };

  const getStatusStyle = (status) => {
    if (status === 'Completed') return { color: '#CCFF00', bg: 'rgba(204,255,0,0.1)', border: 'rgba(204,255,0,0.3)' };
    if (status === 'In Progress') return { color: '#00FFFF', bg: 'rgba(0,255,255,0.08)', border: 'rgba(0,255,255,0.25)' };
    return { color: '#FF00FF', bg: 'rgba(255,0,255,0.08)', border: 'rgba(255,0,255,0.25)' };
  };

  const getPriorityBadge = (p) => {
    if (p === 'High') return { label: '🔴 High', color: '#FF00FF' };
    if (p === 'Low') return { label: '🟢 Low', color: '#CCFF00' };
    return { label: '🔵 Normal', color: '#00FFFF' };
  };

  if (!currentStudent) {
    return (
      <div className="py-20 text-center" style={{ color: 'rgba(0,255,255,0.5)' }}>
        <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-40" style={{ color: '#00FFFF' }} />
        <p className="font-semibold text-sm">No active student selected.</p>
        <p className="text-xs mt-1 opacity-60">Select a student from the navbar dropdown above.</p>
      </div>
    );
  }

  return (
    <div className="py-8 min-h-[85vh]" style={{ background: 'transparent' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Header */}
        <div className="rounded-3xl p-6 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 border"
          style={{
            background: 'rgba(13, 16, 69, 0.85)',
            borderColor: 'rgba(0, 255, 255, 0.2)',
            boxShadow: '0 0 30px rgba(0,255,255,0.06)'
          }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{
                background: 'linear-gradient(135deg, rgba(255,0,255,0.2), rgba(0,255,255,0.2))',
                border: '1px solid rgba(0,255,255,0.3)',
                boxShadow: '0 0 16px rgba(255,0,255,0.15)'
              }}>
              <ClipboardList className="w-6 h-6" style={{ color: '#FF00FF' }} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">
                Homework & Notes
              </h2>
              <p className="text-xs font-semibold mt-0.5" style={{ color: '#FF00FF' }}>
                {currentStudent.name} • {currentStudent.studentClass} • {currentStudent.board}
              </p>
            </div>
          </div>

          {/* Student Selector */}
          {students.length > 1 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs"
              style={{ background: 'rgba(0,0,0,0.3)', borderColor: 'rgba(0,255,255,0.2)' }}>
              <span className="font-bold" style={{ color: 'rgba(0,255,255,0.6)' }}>Student:</span>
              <select
                value={activeStudentId}
                onChange={(e) => setActiveStudentId(e.target.value)}
                className="bg-transparent font-bold focus:outline-none cursor-pointer"
                style={{ color: '#00FFFF' }}
              >
                {students.map(s => (
                  <option key={s.id} value={s.id} style={{ background: '#13165a', color: 'white' }}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm shrink-0 transition-all"
            style={{
              background: 'linear-gradient(135deg, #FF00FF, #00FFFF)',
              color: '#191970',
              boxShadow: '0 0 20px rgba(255,0,255,0.35)'
            }}
          >
            <Plus className="w-4 h-4" />
            Add Note / Task
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Pending', count: pendingCount, color: '#FF00FF', bg: 'rgba(255,0,255,0.08)', border: 'rgba(255,0,255,0.25)', Icon: AlertCircle },
            { label: 'In Progress', count: inProgressCount, color: '#00FFFF', bg: 'rgba(0,255,255,0.08)', border: 'rgba(0,255,255,0.25)', Icon: Clock },
            { label: 'Completed', count: completedCount, color: '#CCFF00', bg: 'rgba(204,255,0,0.08)', border: 'rgba(204,255,0,0.25)', Icon: CheckCircle2 },
          ].map(({ label, count, color, bg, border, Icon }) => (
            <div key={label}
              className="rounded-2xl p-4 flex items-center gap-3 border"
              style={{ background: bg, borderColor: border }}
            >
              <Icon className="w-7 h-7 shrink-0" style={{ color }} />
              <div>
                <p className="text-2xl font-black" style={{ color }}>{count}</p>
                <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs"
            style={{ background: 'rgba(13,16,69,0.8)', borderColor: 'rgba(0,255,255,0.15)' }}>
            <BookOpen className="w-3.5 h-3.5" style={{ color: '#00FFFF' }} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent font-bold focus:outline-none cursor-pointer"
              style={{ color: 'white' }}
            >
              <option value="All" style={{ background: '#13165a' }}>All Types</option>
              {NOTE_TYPES.map(t => (
                <option key={t.value} value={t.value} style={{ background: '#13165a' }}>{t.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs"
            style={{ background: 'rgba(13,16,69,0.8)', borderColor: 'rgba(0,255,255,0.15)' }}>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent font-bold focus:outline-none cursor-pointer"
              style={{ color: 'white' }}
            >
              <option value="All" style={{ background: '#13165a' }}>All Status</option>
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s} style={{ background: '#13165a' }}>{s}</option>
              ))}
            </select>
          </div>

          <span className="text-xs font-semibold" style={{ color: 'rgba(0,255,255,0.5)' }}>
            {filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Notes Grid */}
        {filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredNotes.map((note) => {
              const typeConf = getNoteTypeConfig(note.type);
              const statusStyle = getStatusStyle(note.status);
              const priorityBadge = getPriorityBadge(note.priority);
              const isOverdue = note.dueDate && new Date(note.dueDate) < new Date() && note.status !== 'Completed';

              return (
                <div
                  key={note.id}
                  className="rounded-2xl p-5 flex flex-col justify-between border transition-all"
                  style={{
                    background: 'rgba(13, 16, 69, 0.85)',
                    borderColor: isOverdue ? 'rgba(255,0,255,0.5)' : 'rgba(0,255,255,0.15)',
                    boxShadow: isOverdue ? '0 0 20px rgba(255,0,255,0.1)' : '0 0 12px rgba(0,0,0,0.3)'
                  }}
                >
                  {/* Card Header */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="text-xs font-bold px-2 py-1 rounded-lg border"
                        style={{ color: typeConf.color, background: `${typeConf.color}15`, borderColor: `${typeConf.color}30` }}>
                        {typeConf.label}
                      </span>
                      <span className="text-xs font-bold px-2 py-1 rounded-lg border"
                        style={{ color: statusStyle.color, background: statusStyle.bg, borderColor: statusStyle.border }}>
                        {note.status}
                      </span>
                    </div>

                    <h3 className="font-black text-white text-base leading-snug mb-1.5">
                      {note.title}
                    </h3>

                    {note.description && (
                      <p className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>
                        {note.description}
                      </p>
                    )}

                    <div className="space-y-1.5 text-xs border-t pt-3" style={{ borderColor: 'rgba(0,255,255,0.1)' }}>
                      <div className="flex justify-between">
                        <span style={{ color: 'rgba(255,255,255,0.4)' }}>Created:</span>
                        <span className="font-semibold text-white">{note.createdAt}</span>
                      </div>
                      {note.dueDate && (
                        <div className="flex justify-between">
                          <span style={{ color: 'rgba(255,255,255,0.4)' }}>Due:</span>
                          <span className="font-bold" style={{ color: isOverdue ? '#FF00FF' : '#CCFF00' }}>
                            {isOverdue ? '⚠️ ' : ''}{note.dueDate}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span style={{ color: 'rgba(255,255,255,0.4)' }}>Priority:</span>
                        <span className="font-bold text-[11px]" style={{ color: priorityBadge.color }}>
                          {priorityBadge.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t" style={{ borderColor: 'rgba(0,255,255,0.1)' }}>
                    {/* Status Cycle */}
                    <select
                      value={note.status}
                      onChange={(e) => updateNoteStatus(currentStudent.id, note.id, e.target.value)}
                      className="rounded-lg px-2 py-1 text-[11px] font-bold border focus:outline-none cursor-pointer"
                      style={{
                        background: statusStyle.bg,
                        color: statusStyle.color,
                        borderColor: statusStyle.border
                      }}
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s} style={{ background: '#13165a', color: 'white' }}>{s}</option>
                      ))}
                    </select>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEdit(note)}
                        className="p-1.5 rounded-lg border transition-colors"
                        title="Edit Note"
                        style={{ background: 'rgba(204,255,0,0.1)', borderColor: 'rgba(204,255,0,0.25)', color: '#CCFF00' }}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteNote(currentStudent.id, note.id)}
                        className="p-1.5 rounded-lg border transition-colors"
                        title="Delete Note"
                        style={{ background: 'rgba(255,0,255,0.1)', borderColor: 'rgba(255,0,255,0.25)', color: '#FF00FF' }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 rounded-3xl border"
            style={{ background: 'rgba(13,16,69,0.6)', borderColor: 'rgba(0,255,255,0.1)' }}>
            <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: '#00FFFF' }} />
            <h3 className="text-lg font-bold text-white mb-1">No Notes Yet</h3>
            <p className="text-xs mb-5" style={{ color: 'rgba(0,255,255,0.4)' }}>
              {studentNotes.length > 0 
                ? 'No notes match the current filters.'
                : `No homework or notes recorded for ${currentStudent.name} yet.`}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 rounded-xl font-black text-sm"
              style={{
                background: 'linear-gradient(135deg, #FF00FF, #00FFFF)',
                color: '#191970',
                boxShadow: '0 0 18px rgba(255,0,255,0.3)'
              }}
            >
              + Add First Note
            </button>
          </div>
        )}

      </div>

      {/* ADD NOTE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)' }}>
          <div className="rounded-3xl p-6 max-w-md w-full shadow-2xl border"
            style={{ background: '#13165a', borderColor: 'rgba(0,255,255,0.25)', boxShadow: '0 0 50px rgba(0,255,255,0.1)' }}>
            <div className="flex items-center justify-between pb-4 mb-4 border-b" style={{ borderColor: 'rgba(0,255,255,0.15)' }}>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <ClipboardList className="w-5 h-5" style={{ color: '#FF00FF' }} />
                Add Note / Task
              </h3>
              <button onClick={() => setShowAddModal(false)} style={{ color: 'rgba(255,255,255,0.5)' }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: 'rgba(0,255,255,0.7)' }}>Note Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded-xl px-3 py-2 text-xs font-bold border focus:outline-none"
                  style={{ background: 'rgba(0,0,0,0.4)', borderColor: 'rgba(0,255,255,0.2)', color: 'white' }}
                >
                  {NOTE_TYPES.map(t => (
                    <option key={t.value} value={t.value} style={{ background: '#13165a' }}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: 'rgba(0,255,255,0.7)' }}>Title / Task Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Chapter 3 exercises, Revise Newton's Laws..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl px-3 py-2 text-xs text-white border focus:outline-none"
                  style={{ background: 'rgba(0,0,0,0.4)', borderColor: 'rgba(0,255,255,0.2)' }}
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: 'rgba(0,255,255,0.7)' }}>Description / Details</label>
                <textarea
                  rows="3"
                  placeholder="Additional details, instructions, or remarks..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl px-3 py-2 text-xs text-white border focus:outline-none resize-none"
                  style={{ background: 'rgba(0,0,0,0.4)', borderColor: 'rgba(0,255,255,0.2)' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: 'rgba(0,255,255,0.7)' }}>Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-xl px-3 py-2 text-xs text-white border focus:outline-none"
                    style={{ background: 'rgba(0,0,0,0.4)', borderColor: 'rgba(0,255,255,0.2)' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: 'rgba(0,255,255,0.7)' }}>Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full rounded-xl px-3 py-2 text-xs font-bold border focus:outline-none"
                    style={{ background: 'rgba(0,0,0,0.4)', borderColor: 'rgba(0,255,255,0.2)', color: 'white' }}
                  >
                    <option value="Low" style={{ background: '#13165a' }}>🟢 Low</option>
                    <option value="Normal" style={{ background: '#13165a' }}>🔵 Normal</option>
                    <option value="High" style={{ background: '#13165a' }}>🔴 High</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border"
                  style={{ background: 'rgba(0,0,0,0.3)', color: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.1)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-black"
                  style={{
                    background: 'linear-gradient(135deg, #FF00FF, #00FFFF)',
                    color: '#191970',
                    boxShadow: '0 0 16px rgba(255,0,255,0.35)'
                  }}
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT NOTE MODAL */}
      {editingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)' }}>
          <div className="rounded-3xl p-6 max-w-md w-full shadow-2xl border"
            style={{ background: '#13165a', borderColor: 'rgba(204,255,0,0.25)', boxShadow: '0 0 50px rgba(204,255,0,0.1)' }}>
            <div className="flex items-center justify-between pb-4 mb-4 border-b" style={{ borderColor: 'rgba(204,255,0,0.15)' }}>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5" style={{ color: '#CCFF00' }} />
                Edit Note
              </h3>
              <button onClick={() => setEditingNote(null)} style={{ color: 'rgba(255,255,255,0.5)' }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: 'rgba(204,255,0,0.7)' }}>Title / Task Name *</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-xl px-3 py-2 text-xs text-white border focus:outline-none"
                  style={{ background: 'rgba(0,0,0,0.4)', borderColor: 'rgba(204,255,0,0.2)' }}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: 'rgba(204,255,0,0.7)' }}>Description</label>
                <textarea
                  rows="3"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full rounded-xl px-3 py-2 text-xs text-white border focus:outline-none resize-none"
                  style={{ background: 'rgba(0,0,0,0.4)', borderColor: 'rgba(204,255,0,0.2)' }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: 'rgba(204,255,0,0.7)' }}>Due Date</label>
                  <input
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    className="w-full rounded-xl px-3 py-2 text-xs text-white border focus:outline-none"
                    style={{ background: 'rgba(0,0,0,0.4)', borderColor: 'rgba(204,255,0,0.2)' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: 'rgba(204,255,0,0.7)' }}>Priority</label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value)}
                    className="w-full rounded-xl px-3 py-2 text-xs font-bold border focus:outline-none"
                    style={{ background: 'rgba(0,0,0,0.4)', borderColor: 'rgba(204,255,0,0.2)', color: 'white' }}
                  >
                    <option value="Low" style={{ background: '#13165a' }}>🟢 Low</option>
                    <option value="Normal" style={{ background: '#13165a' }}>🔵 Normal</option>
                    <option value="High" style={{ background: '#13165a' }}>🔴 High</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingNote(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border"
                  style={{ background: 'rgba(0,0,0,0.3)', color: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.1)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-black"
                  style={{
                    background: 'linear-gradient(135deg, #CCFF00, #00FFFF)',
                    color: '#191970',
                    boxShadow: '0 0 16px rgba(204,255,0,0.35)'
                  }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
