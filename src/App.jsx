import React from 'react';
import { TeacherPortalProvider, useTeacherPortal } from './context/TeacherPortalContext';
import TeacherLogin from './components/TeacherLogin';
import MinimalNavbar from './components/MinimalNavbar';
import StudentManager from './components/StudentManager';
import AttendanceTracker from './components/AttendanceTracker';
import FeePaymentsLog from './components/FeePaymentsLog';
import PortionProgress from './components/PortionProgress';
import WeeklyExams from './components/WeeklyExams';
import HomeworkNotes from './components/HomeworkNotes';

function TeacherPortalMain() {
  const { isAuthenticated, activeTab } = useTeacherPortal();

  if (!isAuthenticated) {
    return <TeacherLogin />;
  }

  return (
    <div className="min-h-screen text-slate-100 font-sans flex flex-col justify-between selection:text-white"
      style={{
        background: 'linear-gradient(160deg, #191970 0%, #0d1045 40%, #13165a 70%, #191970 100%)',
        backgroundAttachment: 'fixed',
        selectionBackground: '#FF00FF'
      }}
    >
      <div>
        <MinimalNavbar />

        <main className="animate-fadeIn">
          {activeTab === 'students' && <StudentManager />}
          {activeTab === 'attendance' && <AttendanceTracker />}
          {activeTab === 'fees' && <FeePaymentsLog />}
          {activeTab === 'portions' && <PortionProgress />}
          {activeTab === 'exams' && <WeeklyExams />}
          {activeTab === 'notes' && <HomeworkNotes />}
        </main>
      </div>

      <footer className="border-t py-5 text-center text-xs"
        style={{
          background: 'rgba(13,16,69,0.9)',
          borderColor: 'rgba(0,255,255,0.12)',
          color: 'rgba(0,255,255,0.4)'
        }}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span style={{ color: 'rgba(255,0,255,0.6)' }}>AJS Teacher Management Portal • Multi-Class Tuition System</span>
          <span>Passcode Protected • Auto Progress Calculation</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <TeacherPortalProvider>
      <TeacherPortalMain />
    </TeacherPortalProvider>
  );
}
