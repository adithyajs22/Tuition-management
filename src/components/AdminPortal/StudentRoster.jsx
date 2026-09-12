import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { UserPlus, Search, Edit3, Trash2, Phone, CreditCard, ShieldAlert, CheckCircle2 } from 'lucide-react';
import AddStudentModal from './AddStudentModal';
import EditStudentModal from './EditStudentModal';

export default function StudentRoster() {
  const { students, activeStudentId, setActiveStudentId, deleteStudent } = usePortal();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deletingStudentId, setDeletingStudentId] = useState(null);

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.batch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteConfirm = () => {
    if (deletingStudentId) {
      deleteStudent(deletingStudentId);
      setDeletingStudentId(null);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl mb-8">
      
      {/* Roster Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            Tuition Student Roster ({students.length})
          </h3>
          <p className="text-xs text-slate-400">Manage enrolled students, edit profiles, or add new admissions</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 w-48 sm:w-64"
            />
          </div>

          {/* Add Student Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            Add New Student
          </button>
        </div>
      </div>

      {/* Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((s) => {
          const isSelected = s.id === activeStudentId;
          return (
            <div
              key={s.id}
              className={`p-5 rounded-2xl border transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-950 border-indigo-500 ring-2 ring-indigo-500/30 shadow-xl'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={s.avatar} 
                      alt={s.name} 
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/40"
                    />
                    <div>
                      <h4 className="font-bold text-white text-base leading-tight">{s.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{s.batch}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                    {s.id}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-400 my-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800/60">
                  <p className="flex justify-between">
                    <span>Parent Name:</span>
                    <strong className="text-slate-200">{s.parentName}</strong>
                  </p>
                  <p className="flex justify-between">
                    <span>Contact:</span>
                    <strong className="text-slate-200">{s.parentPhone}</strong>
                  </p>
                  <p className="flex justify-between">
                    <span>Monthly Fee:</span>
                    <strong className="text-emerald-400 font-bold">₹{s.monthlyFee}</strong>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <button
                  onClick={() => setActiveStudentId(s.id)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
                  }`}
                >
                  {isSelected ? '✓ Selected' : 'Inspect Records'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingStudent(s)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition-colors"
                    title="Edit Student Info"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setDeletingStudentId(s.id)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-rose-400 border border-slate-700 transition-colors"
                    title="Delete Student"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      {/* Edit Student Modal */}
      <EditStudentModal
        student={editingStudent}
        isOpen={!!editingStudent}
        onClose={() => setEditingStudent(null)}
      />

      {/* Delete Confirmation Modal */}
      {deletingStudentId && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4 border border-rose-500/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Delete Student Record?</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Are you sure you want to remove this student? All attendance entries, fee ledgers, and test scores associated with this student will be permanently deleted.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeletingStudentId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg"
              >
                Yes, Delete Student
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
