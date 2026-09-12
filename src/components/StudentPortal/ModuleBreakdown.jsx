import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { BookOpen, Award, CheckCircle2, TrendingUp, Plus, Star } from 'lucide-react';

export default function ModuleBreakdown() {
  const { currentStudentScores, syllabusData, currentStudent, isAdminMode, addExamScore, activeStudentId } = usePortal();
  const [showScoreModal, setShowScoreModal] = useState(false);

  // Score form state
  const [subName, setSubName] = useState('Physics');
  const [topicName, setTopicName] = useState('');
  const [maxMarks, setMaxMarks] = useState(30);
  const [obtainedMarks, setObtainedMarks] = useState(25);

  const handleScoreSubmit = (e) => {
    e.preventDefault();
    if (!topicName.trim()) return;

    const percentage = (obtainedMarks / maxMarks) * 100;
    let grade = 'A+';
    if (percentage < 90 && percentage >= 80) grade = 'A';
    if (percentage < 80 && percentage >= 70) grade = 'B+';
    if (percentage < 70 && percentage >= 60) grade = 'B';
    if (percentage < 60) grade = 'C';

    addExamScore(activeStudentId, {
      subject: subName,
      topic: topicName,
      testDate: new Date().toISOString().split('T')[0],
      maxMarks: Number(maxMarks),
      marksObtained: Number(obtainedMarks),
      grade: grade
    });

    setTopicName('');
    setShowScoreModal(false);
  };

  const studentStreamModules = syllabusData[currentStudent.stream] || [];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl mb-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" />
            <span>Granular Module & Exam Scores</span>
          </div>
          <h3 className="text-xl font-bold text-white">Chapter-by-Chapter Performance</h3>
        </div>

        {isAdminMode && (
          <button
            onClick={() => setShowScoreModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Test Score
          </button>
        )}
      </div>

      {/* Grid: Left - Test Score History | Right - Subject Syllabus Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Test Score Cards (4 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between">
            <span>Recent Unit Test Results</span>
            <span className="text-xs text-indigo-400">{currentStudentScores.length} Tests</span>
          </h4>

          {currentStudentScores.map((score) => {
            const perc = Math.round((score.marksObtained / score.maxMarks) * 100);
            return (
              <div 
                key={score.id}
                className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">{score.subject}</span>
                    <span className="text-[10px] text-slate-500">{score.testDate}</span>
                  </div>
                  <h5 className="text-sm font-bold text-slate-100 mt-0.5">{score.topic}</h5>
                  <p className="text-xs text-slate-400 mt-1">
                    Score: <strong className="text-white">{score.marksObtained}</strong> / {score.maxMarks} ({perc}%)
                  </p>
                </div>

                <div className="text-center bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl shrink-0">
                  <span className="text-lg font-black text-emerald-400 block leading-tight">{score.grade}</span>
                  <span className="text-[9px] text-slate-400 uppercase font-semibold">Grade</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Granular Chapter Completion View (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            {currentStudent.stream.toUpperCase()} Subject Chapter Completion
          </h4>

          <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
            {studentStreamModules.map((sub) => (
              <div key={sub.id} className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-bold text-white text-sm">{sub.subject} ({sub.code})</h5>
                  <span className="text-xs font-extrabold text-indigo-400">
                    {sub.modules.filter(m => m.status === 'Completed').length} / {sub.modules.length} Modules Done
                  </span>
                </div>

                <div className="space-y-2">
                  {sub.modules.map((m) => (
                    <div key={m.id} className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-200">{m.name}</p>
                        <p className="text-[11px] text-slate-400">{m.chapters.join(' • ')}</p>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        m.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                        m.status === 'In Progress' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {m.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Add Exam Score Modal (Admin Only) */}
      {showScoreModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Record Unit Test Score</h3>
            <form onSubmit={handleScoreSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Subject</label>
                <select
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100"
                >
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Biology">Biology</option>
                  <option value="Accountancy">Accountancy</option>
                  <option value="Economics">Economics</option>
                  <option value="Business Studies">Business Studies</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Test Topic / Chapter</label>
                <input
                  type="text"
                  value={topicName}
                  onChange={(e) => setTopicName(e.target.value)}
                  placeholder="e.g. Laws of Motion & Friction"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Max Marks</label>
                  <input
                    type="number"
                    value={maxMarks}
                    onChange={(e) => setMaxMarks(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Marks Obtained</label>
                  <input
                    type="number"
                    value={obtainedMarks}
                    onChange={(e) => setObtainedMarks(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowScoreModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg"
                >
                  Save Test Score
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
