import React from 'react';
import { useTeacherPortal } from '../context/TeacherPortalContext';
import { GraduationCap, Users, Calendar, CreditCard, BookOpen, Award, LogOut, UserCheck, Plus, ClipboardList } from 'lucide-react';

export default function MinimalNavbar() {
  const { 
    activeTab, 
    setActiveTab, 
    logoutTeacher,
    students,
    activeStudentId,
    setActiveStudentId,
  } = useTeacherPortal();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-2xl border-b shadow-2xl"
      style={{
        background: 'rgba(13, 16, 69, 0.92)',
        borderColor: 'rgba(0, 255, 255, 0.2)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('portions')}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #FF00FF, #00FFFF)',
                boxShadow: '0 0 20px rgba(0,255,255,0.3)'
              }}
            >
              <GraduationCap className="w-6 h-6 font-black" style={{ color: '#191970' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight"
                  style={{ color: '#00FFFF' }}>
                  AJS Teacher Portal
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-extrabold border"
                  style={{ 
                    background: 'rgba(204, 255, 0, 0.12)',
                    color: '#CCFF00',
                    borderColor: 'rgba(204, 255, 0, 0.3)'
                  }}>
                  Classes 5-12
                </span>
              </div>
              <p className="text-xs font-medium" style={{ color: 'rgba(0, 255, 255, 0.6)' }}>
                State & CBSE Management System
              </p>
            </div>
          </div>

          {/* Core Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 p-1.5 rounded-xl border"
            style={{ background: 'rgba(13, 16, 69, 0.8)', borderColor: 'rgba(0, 255, 255, 0.15)' }}>
            {[
              { key: 'portions', label: 'Syllabus', Icon: BookOpen, color: '#CCFF00' },
              { key: 'students', label: `Students (${students.length})`, Icon: Users, color: '#00FFFF' },
              { key: 'attendance', label: 'Attendance', Icon: Calendar, color: '#FF00FF' },
              { key: 'fees', label: 'Fee Payments', Icon: CreditCard, color: '#CCFF00' },
              { key: 'exams', label: 'Weekly Exams', Icon: Award, color: '#00FFFF' },
              { key: 'notes', label: 'Homework & Notes', Icon: ClipboardList, color: '#FF00FF' },
            ].map(({ key, label, Icon, color }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all`}
                style={activeTab === key
                  ? {
                      background: 'rgba(0,0,0,0.4)',
                      color: color,
                      border: `1px solid ${color}40`,
                      boxShadow: `0 0 12px ${color}30`
                    }
                  : {
                      color: 'rgba(255,255,255,0.5)',
                      border: '1px solid transparent'
                    }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: activeTab === key ? color : 'rgba(255,255,255,0.4)' }} />
                {label}
              </button>
            ))}
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {students.length > 0 ? (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border shadow-sm"
                style={{
                  background: 'rgba(13, 16, 69, 0.8)',
                  borderColor: 'rgba(0, 255, 255, 0.25)',
                }}>
                <UserCheck className="w-4 h-4 shrink-0" style={{ color: '#00FFFF' }} />
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono uppercase leading-none font-bold" style={{ color: '#FF00FF' }}>
                    Active Student:
                  </span>
                  <select
                    value={activeStudentId}
                    onChange={(e) => setActiveStudentId(e.target.value)}
                    className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer pr-2"
                    style={{ color: 'white' }}
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id} style={{ background: '#13165a', color: 'white', fontWeight: 'bold' }}>
                        {s.name} ({s.studentClass})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('students')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-extrabold text-xs border"
                style={{
                  background: 'rgba(255, 0, 255, 0.12)',
                  borderColor: 'rgba(255, 0, 255, 0.35)',
                  color: '#FF00FF'
                }}
              >
                <Plus className="w-4 h-4" />
                Add First Student
              </button>
            )}

            {/* Logout */}
            <button
              onClick={logoutTeacher}
              className="p-2 rounded-xl transition-colors border"
              title="Lock Teacher Portal"
              style={{
                background: 'rgba(13, 16, 69, 0.8)',
                borderColor: 'rgba(255, 0, 255, 0.25)',
                color: '#FF00FF'
              }}
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>

        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex lg:hidden items-center justify-around py-2.5 border-t text-xs"
          style={{ borderColor: 'rgba(0, 255, 255, 0.1)' }}>
          {[
            { key: 'portions', label: 'Portions', Icon: BookOpen, color: '#CCFF00' },
            { key: 'students', label: 'Students', Icon: Users, color: '#00FFFF' },
            { key: 'attendance', label: 'Attend.', Icon: Calendar, color: '#FF00FF' },
            { key: 'fees', label: 'Fees', Icon: CreditCard, color: '#CCFF00' },
            { key: 'exams', label: 'Exams', Icon: Award, color: '#00FFFF' },
            { key: 'notes', label: 'Notes', Icon: ClipboardList, color: '#FF00FF' },
          ].map(({ key, label, Icon, color }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="flex flex-col items-center gap-1 font-semibold"
              style={{ color: activeTab === key ? color : 'rgba(255,255,255,0.4)' }}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

      </div>
    </header>
  );
}
