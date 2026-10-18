import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTeacherPortal } from '../context/TeacherPortalContext';
import { GraduationCap, Users, Calendar, CreditCard, BookOpen, Award, LogOut, UserCheck, Plus, ClipboardList } from 'lucide-react';

const PORTAL_NAV_ITEMS = [
  { path: '/syllabus', label: 'Syllabus', mobileLabel: 'Portions', Icon: BookOpen, color: '#CCFF00' },
  { path: '/students', label: 'Students', mobileLabel: 'Students', Icon: Users, color: '#00FFFF' },
  { path: '/attendance', label: 'Attendance', mobileLabel: 'Attend.', Icon: Calendar, color: '#FF00FF' },
  { path: '/fees', label: 'Fee Payments', mobileLabel: 'Fees', Icon: CreditCard, color: '#CCFF00' },
  { path: '/exams', label: 'Weekly Exams', mobileLabel: 'Exams', Icon: Award, color: '#00FFFF' },
  { path: '/notes', label: 'Homework & Notes', mobileLabel: 'Notes', Icon: ClipboardList, color: '#FF00FF' },
];

export default function MinimalNavbar() {
  const { 
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
        <div className="flex items-center justify-between min-h-20 py-3 gap-2">
          
          {/* Brand */}
          <Link to="/syllabus" className="flex items-center gap-3 cursor-pointer min-w-0 flex-1">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #FF00FF, #00FFFF)',
                boxShadow: '0 0 20px rgba(0,255,255,0.3)'
              }}
            >
              <GraduationCap className="w-6 h-6 font-black" style={{ color: '#191970' }} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight truncate"
                  style={{ color: '#00FFFF' }}>
                  AJS Teacher Portal
                </span>
                <span className="hidden sm:inline-flex text-[10px] font-mono uppercase px-2 py-0.5 rounded font-extrabold border"
                  style={{ 
                    background: 'rgba(204, 255, 0, 0.12)',
                    color: '#CCFF00',
                    borderColor: 'rgba(204, 255, 0, 0.3)'
                  }}>
                  Classes 5-12
                </span>
              </div>
              <p className="hidden sm:block text-xs font-medium truncate" style={{ color: 'rgba(0, 255, 255, 0.6)' }}>
                State & CBSE Management System
              </p>
            </div>
          </Link>

          {/* Core Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 p-1.5 rounded-xl border"
            style={{ background: 'rgba(13, 16, 69, 0.8)', borderColor: 'rgba(0, 255, 255, 0.15)' }}>
            {PORTAL_NAV_ITEMS.map(({ path, label, Icon, color }) => (
              <NavLink
                key={path}
                to={path}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all"
                style={({ isActive }) => isActive
                  ? {
                      background: 'rgba(0,0,0,0.4)',
                      color,
                      border: `1px solid ${color}40`,
                      boxShadow: `0 0 12px ${color}30`
                    }
                  : {
                      color: 'rgba(255,255,255,0.5)',
                      border: '1px solid transparent'
                    }}
              >
                <Icon className="w-3.5 h-3.5" />
                {path === '/students' ? `${label} (${students.length})` : label}
              </NavLink>
            ))}
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 max-w-[52%]">
            
            {students.length > 0 ? (
              <div className="flex items-center gap-2 px-2 sm:px-3.5 py-1.5 rounded-xl border shadow-sm min-w-0"
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
                    className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer pr-2 max-w-[30vw] truncate"
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
              <Link
                to="/students"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-extrabold text-xs border"
                style={{
                  background: 'rgba(255, 0, 255, 0.12)',
                  borderColor: 'rgba(255, 0, 255, 0.35)',
                  color: '#FF00FF'
                }}
              >
                <Plus className="w-4 h-4" />
                Add First Student
              </Link>
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
        <div className="flex lg:hidden items-center justify-start gap-5 overflow-x-auto py-2.5 border-t text-xs"
          style={{ borderColor: 'rgba(0, 255, 255, 0.1)' }}>
          {PORTAL_NAV_ITEMS.map(({ path, mobileLabel, Icon, color }) => (
            <NavLink
              key={path}
              to={path}
              className="flex flex-col items-center gap-1 font-semibold shrink-0 min-w-10"
              style={({ isActive }) => ({ color: isActive ? color : 'rgba(255,255,255,0.4)' })}
            >
              <Icon className="w-4 h-4" />
              {mobileLabel}
            </NavLink>
          ))}
        </div>

      </div>
    </header>
  );
}
