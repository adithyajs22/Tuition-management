import React from 'react';
import { usePortal } from '../../context/PortalContext';
import { Award, Users, CheckCircle, HelpCircle, FileText, Smartphone } from 'lucide-react';

export default function CourseHighlights() {
  const { tuitionInfo, setActiveTab } = usePortal();

  return (
    <section className="py-16 bg-slate-900 border-t border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Award className="w-4 h-4 text-purple-400" />
            <span>Why Choose Apex Tuition</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">Streamlined Methodology & Parent Transparency</h2>
          <p className="text-slate-400 text-sm mt-2">
            Designed specifically for Kerala State Higher Secondary Plus One Board & entrance preparedness.
          </p>
        </div>

        {/* Highlight Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tuitionInfo.highlights.map((item, idx) => (
            <div key={idx} className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all shadow-lg flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-100 mb-2">{item.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-900 flex items-center justify-between text-[11px] text-indigo-400 font-semibold">
                <span>Verified Standard</span>
                <span>0{idx + 1}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Portal Access Callout */}
        <div className="mt-16 bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Already enrolled? Check your daily attendance & fees ledger.
            </h3>
            <p className="text-slate-300 text-sm mt-2 leading-relaxed">
              Parents can log in with student credentials to view daily arrival times, chapter test scores, and download instant GST payment receipts.
            </p>
          </div>
          
          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setActiveTab('student')}
              className="px-6 py-3.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5" />
              Go to Student Portal
            </button>
            <button
              onClick={() => setActiveTab('nocode')}
              className="px-6 py-3.5 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <FileText className="w-5 h-5 text-cyan-400" />
              Notion Template Sync
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
