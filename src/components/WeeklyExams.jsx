import React, { useState } from 'react';
import writeExcelFile from 'write-excel-file/browser';
import { useTeacherPortal } from '../context/TeacherPortalContext';
import { Award, Plus, Trash2, Pencil, Download } from 'lucide-react';

export default function WeeklyExams() {
  const { currentStudent, currentExams, addWeeklyExam, updateWeeklyExam, deleteWeeklyExam } = useTeacherPortal();

  const [showModal, setShowModal] = useState(false);
  const [editingExamId, setEditingExamId] = useState(null);
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [subject, setSubject] = useState('Physics');
  const [topic, setTopic] = useState('');
  const [maxMarks, setMaxMarks] = useState(30);
  const [obtainedMarks, setObtainedMarks] = useState(25);

  const openAddModal = () => {
    setEditingExamId(null);
    setTestDate(new Date().toISOString().split('T')[0]);
    setSubject('Physics');
    setTopic('');
    setMaxMarks(30);
    setObtainedMarks(25);
    setShowModal(true);
  };

  const openEditModal = (exam) => {
    setEditingExamId(exam.id);
    setTestDate(exam.testDate);
    setSubject(exam.subject);
    setTopic(exam.topic);
    setMaxMarks(exam.maxMarks);
    setObtainedMarks(exam.marksObtained);
    setShowModal(true);
  };

  if (!currentStudent) {
    return (
      <div className="py-12 text-center text-slate-400">
        No active student selected. Please select a student from the navbar or roster.
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    const examData = {
      testDate,
      subject,
      topic,
      maxMarks: Number(maxMarks),
      marksObtained: Number(obtainedMarks)
    };

    if (editingExamId) {
      updateWeeklyExam(currentStudent.id, editingExamId, examData);
    } else {
      addWeeklyExam(currentStudent.id, examData);
    }

    setTopic('');
    setEditingExamId(null);
    setShowModal(false);
  };

  const exportWeeklyMarks = async () => {
    const records = [...currentExams]
      .sort((a, b) => a.testDate.localeCompare(b.testDate))
      .map(exam => ({
        date: exam.testDate,
        subject: exam.subject,
        topic: exam.topic,
        marksObtained: exam.marksObtained,
        maxMarks: exam.maxMarks,
        percentage: exam.maxMarks ? Math.round((exam.marksObtained / exam.maxMarks) * 100) : 0
      }));
    const safeStudentName = currentStudent.name.trim().replace(/[<>:"/\\|?*]+/g, '-');
    const sheetData = [
      ['Date', 'Subject', 'Topic', 'Marks Obtained', 'Maximum Marks', 'Percentage'],
      ...records.map(exam => [
        exam.date,
        exam.subject,
        exam.topic,
        exam.marksObtained,
        exam.maxMarks,
        exam.percentage
      ])
    ];
    try {
      await writeExcelFile(sheetData).toFile(`${safeStudentName}-weekly-test-marks.xlsx`);
    } catch (error) {
      console.error('Failed to export weekly test marks workbook', error);
      window.alert('Could not create the weekly test marks Excel file. Please try again.');
    }
  };

  const subjectColors = {
    physics: { color: '#67E8F9', background: 'rgba(6,182,212,0.12)', border: 'rgba(6,182,212,0.4)' },
    chemistry: { color: '#F9A8D4', background: 'rgba(236,72,153,0.12)', border: 'rgba(236,72,153,0.4)' },
    mathematics: { color: '#FDE047', background: 'rgba(234,179,8,0.12)', border: 'rgba(234,179,8,0.4)' },
    biology: { color: '#86EFAC', background: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.4)' }
  };

  return (
    <div className="py-8 bg-slate-950 text-slate-100 min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Award className="w-4 h-4" />
              <span>Weekly Exam Marks</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">
              Weekly Test Results for {currentStudent.name} ({currentStudent.studentClass})
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={exportWeeklyMarks}
              disabled={currentExams.length === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs border border-slate-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Download Marks
            </button>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              Record Weekly Test Marks
            </button>
          </div>
        </div>

        {/* Exams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentExams.length > 0 ? (
            currentExams.map((exam) => {
              const percentage = Math.round((exam.marksObtained / exam.maxMarks) * 100);
              return (
                <div
                  key={exam.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className="text-sm font-black uppercase px-3 py-1 rounded-lg border"
                        style={subjectColors[(exam.subject || '').toLowerCase()] || {
                          color: '#C4B5FD',
                          background: 'rgba(139,92,246,0.12)',
                          border: '1px solid rgba(139,92,246,0.4)'
                        }}
                      >
                        {exam.subject}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">{exam.testDate}</span>
                    </div>

                    <h3 className="font-bold text-white text-base leading-snug">{exam.topic}</h3>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 mt-3 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Marks Scored</p>
                        <p className="text-lg font-extrabold text-white">
                          {exam.marksObtained} <span className="text-xs font-normal text-slate-400">/ {exam.maxMarks}</span>
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Progress Accuracy</p>
                        <p className="text-lg font-black text-emerald-400">{percentage}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">Status: Conducted</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(exam)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-purple-900/60 text-purple-300 border border-slate-700 transition-colors"
                        title="Edit test record"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteWeeklyExam(currentStudent.id, exam.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-rose-400 border border-slate-700 transition-colors"
                        title="Delete test record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-12 text-center text-slate-500 bg-slate-900 rounded-3xl border border-slate-800">
              No weekly test marks logged yet for {currentStudent.name}. Click "Record Weekly Test Marks" above!
            </div>
          )}
        </div>

      </div>

      {/* RECORD EXAM MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingExamId ? 'Edit Weekly Test Marks' : 'Record Weekly Test Marks'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Exam Conducted Date</label>
                <input
                  type="date"
                  value={testDate}
                  onChange={(e) => setTestDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Exam Topic</label>
                  <input
                    type="text"
                    placeholder="e.g. Motion Unit Test"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Total Max Marks</label>
                  <input
                    type="number"
                    value={maxMarks}
                    onChange={(e) => setMaxMarks(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Marks Scored</label>
                  <input
                    type="number"
                    value={obtainedMarks}
                    onChange={(e) => setObtainedMarks(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold">
                  {editingExamId ? 'Save Changes' : 'Save Exam Score'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
