import React from 'react';
import { usePortal } from '../../context/PortalContext';
import { BookOpen, CheckCircle2, Clock, PlayCircle, Atom, FlaskConical, Calculator, Dna, BookOpenCheck, TrendingUp, Briefcase } from 'lucide-react';

const ICON_MAP = {
  Atom: Atom,
  FlaskConical: FlaskConical,
  Calculator: Calculator,
  Dna: Dna,
  BookOpenCheck: BookOpenCheck,
  TrendingUp: TrendingUp,
  Briefcase: Briefcase
};

export default function PublicSyllabus() {
  const { syllabusData, activeStream, setActiveStream } = usePortal();
  const currentStreamModules = syllabusData[activeStream] || [];

  // Calculate overall syllabus completion percentage
  const totalModules = currentStreamModules.reduce((acc, sub) => acc + sub.modules.length, 0);
  const completedModules = currentStreamModules.reduce((acc, sub) => {
    return acc + sub.modules.filter(m => m.status === 'Completed').length;
  }, 0);
  const overallPercentage = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  return (
    <section id="public-syllabus-section" className="py-16 bg-slate-950 text-slate-100 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <BookOpen className="w-4 h-4" />
              <span>Public Syllabus Explorer</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Kerala Higher Secondary Plus One Modules
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Transparent topic coverage tracker for student, parent, and tutor alignment.
            </p>
          </div>

          {/* Stream Switcher & Overall Progress */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            
            {/* Stream Toggle */}
            <div className="flex p-1 bg-slate-900 rounded-xl border border-slate-800 w-full sm:w-auto">
              <button
                onClick={() => setActiveStream('science')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeStream === 'science'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🔬 Science Stream
              </button>
              <button
                onClick={() => setActiveStream('commerce')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeStream === 'commerce'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                📊 Commerce Stream
              </button>
            </div>

            {/* Overall Syllabus Meter */}
            <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-3 w-full sm:w-auto">
              <div className="text-right">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Syllabus Covered</p>
                <p className="text-sm font-extrabold text-indigo-400">{overallPercentage}% Complete</p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-indigo-500/30 flex items-center justify-center font-bold text-xs text-indigo-300">
                {overallPercentage}%
              </div>
            </div>

          </div>
        </div>

        {/* Subjects Accordion / Cards */}
        <div className="space-y-8">
          {currentStreamModules.map((subject) => {
            const IconComp = ICON_MAP[subject.icon] || BookOpen;

            // Subject level stats
            const subTotal = subject.modules.length;
            const subDone = subject.modules.filter(m => m.status === 'Completed').length;
            const subInProgress = subject.modules.filter(m => m.status === 'In Progress').length;

            return (
              <div 
                key={subject.id} 
                className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl"
              >
                {/* Subject Header Banner */}
                <div className="p-6 bg-slate-900/50 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center shadow-lg text-white`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-white">{subject.subject}</h3>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${subject.badgeColor}`}>
                          {subject.code}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Total {subject.totalChapters} NCERT Chapters • {subTotal} Key Teaching Modules
                      </p>
                    </div>
                  </div>

                  {/* Status Badges Summary */}
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {subDone} Done
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                      <PlayCircle className="w-3.5 h-3.5" />
                      {subInProgress} In Progress
                    </span>
                  </div>
                </div>

                {/* Modules Grid */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subject.modules.map((module) => {
                    let statusBadge = (
                      <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        <Clock className="w-3 h-3" /> Not Started
                      </span>
                    );

                    if (module.status === 'Completed') {
                      statusBadge = (
                        <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" /> Completed
                        </span>
                      );
                    } else if (module.status === 'In Progress') {
                      statusBadge = (
                        <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          <PlayCircle className="w-3 h-3" /> In Progress
                        </span>
                      );
                    }

                    return (
                      <div 
                        key={module.id} 
                        className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 hover:border-slate-700 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="text-sm font-bold text-slate-100 leading-snug">{module.name}</h4>
                            {statusBadge}
                          </div>

                          <div className="space-y-1 my-3">
                            {module.chapters.map((chap, idx) => (
                              <p key={idx} className="text-xs text-slate-400 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0" />
                                <span className="truncate">{chap}</span>
                              </p>
                            ))}
                          </div>
                        </div>

                        {/* Module Progress Bar */}
                        <div className="mt-4 pt-3 border-t border-slate-800/60">
                          <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1 font-semibold">
                            <span>Module Completion</span>
                            <span className="text-indigo-400 font-bold">{module.progress}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-500 ${
                                module.status === 'Completed' ? 'bg-emerald-500' : module.status === 'In Progress' ? 'bg-amber-500' : 'bg-slate-700'
                              }`} 
                              style={{ width: `${module.progress}%` }}
                            />
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
