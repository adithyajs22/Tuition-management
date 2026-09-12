import React, { useState } from 'react';
import { useTeacherPortal } from '../context/TeacherPortalContext';
import { GraduationCap, ArrowRight, ShieldCheck, KeyRound, Sparkles } from 'lucide-react';

export default function TeacherLogin() {
  const { loginTeacher } = useTeacherPortal();
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = loginTeacher(passcode);
    if (!success) {
      setErrorMsg('Invalid Passcode! Try default passcode: 1234');
    }
  };

  const handleDemoLogin = () => {
    loginTeacher('1234');
  };

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4 selection:bg-cyan-500 selection:text-black relative overflow-hidden">
      
      {/* Peacock Blue & Dark Orange Glow Orbs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-orange-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="bg-[#09090b] border border-[#1f1f23] rounded-3xl p-8 max-w-md w-full shadow-2xl relative z-10 text-slate-100 backdrop-blur-xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 via-teal-600 to-orange-600 mx-auto flex items-center justify-center shadow-lg shadow-cyan-500/20 mb-4">
            <GraduationCap className="w-9 h-9 text-slate-950 font-bold" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Teacher Portal Access</h1>
          <p className="text-xs text-orange-400 mt-1 font-semibold flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            Peacock Blue & Dark Orange Theme
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Teacher Passcode
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="Enter passcode (Default: 1234)"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full bg-[#000000] border border-[#27272a] rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors shadow-inner"
                autoFocus
              />
            </div>
            {errorMsg && (
              <p className="text-xs font-semibold text-rose-400 mt-1.5">{errorMsg}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-black text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-400 to-orange-500 hover:from-cyan-300 hover:to-orange-400 shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all"
          >
            Unlock Portal
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        {/* Quick Demo Login Option */}
        <div className="mt-8 pt-6 border-t border-[#1f1f23] text-center">
          <p className="text-xs text-zinc-400 mb-3">Testing out the teacher portal?</p>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 px-4 rounded-xl bg-[#000000] hover:bg-[#121215] text-orange-400 text-xs font-bold border border-orange-500/30 flex items-center justify-center gap-2 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            Quick Unlock (Passcode: 1234)
          </button>
        </div>

      </div>

    </div>
  );
}
