import React from 'react';
import { usePortal } from '../../context/PortalContext';
import { BookOpen, Sparkles, MapPin, Clock, PhoneCall, ShieldCheck, ArrowRight } from 'lucide-react';

export default function HeroSection() {
  const { tuitionInfo, setActiveTab, activeStream, setActiveStream } = usePortal();

  return (
    <div className="relative overflow-hidden pt-12 pb-16 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
      
      {/* Background Glow Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-pink-500/10 blur-3xl rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Banner Header */}
        <div className="text-center max-w-3xl mx-auto">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Kerala Plus One HSE Syllabus Portal</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Comprehensive <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Tuition Management</span> & Syllabus Tracker
          </h1>

          <p className="mt-5 text-lg text-slate-300 leading-relaxed font-medium">
            Keep your Kerala Plus One studies aligned with real-time module status, daily attendance logging, fee ledgers, and exam performance analysis.
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setActiveTab('student')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 hover:scale-[1.02] transition-all"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Open Student Portal
            </button>
            <button
              onClick={() => {
                const element = document.getElementById('public-syllabus-section');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:scale-[1.02] transition-all"
            >
              <BookOpen className="w-5 h-5 text-indigo-400" />
              Explore Syllabus Modules
            </button>
          </div>

        </div>

        {/* Quick Info Bar */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-md">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Batch Timings</p>
              <p className="text-sm font-bold text-slate-200">{tuitionInfo.timing}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-md">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Locations</p>
              <p className="text-sm font-bold text-slate-200">{tuitionInfo.location}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-md">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Contact & Support</p>
              <p className="text-sm font-bold text-slate-200">{tuitionInfo.contactNumber}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
