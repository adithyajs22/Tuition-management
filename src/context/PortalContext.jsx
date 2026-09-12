import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_STUDENTS, INITIAL_ATTENDANCE, INITIAL_FEES, INITIAL_EXAM_SCORES, TUITION_INFO } from '../data/initialMockData';
import { KERALA_PLUS_ONE_SYLLABUS } from '../data/keralaSyllabusData';

const PortalContext = createContext();

export function PortalProvider({ children }) {
  // Active Navigation Tab: 'dashboard' | 'syllabus' | 'nocode'
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Active Stream for Syllabus view: 'science' | 'commerce'
  const [activeStream, setActiveStream] = useState('science');

  // Active Student ID selected for detailed management
  const [activeStudentId, setActiveStudentId] = useState(() => {
    return localStorage.getItem('apex_active_student') || 'STD-101';
  });

  // Core Local Storage Databases
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('apex_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem('apex_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [fees, setFees] = useState(() => {
    const saved = localStorage.getItem('apex_fees');
    return saved ? JSON.parse(saved) : INITIAL_FEES;
  });

  const [examScores, setExamScores] = useState(() => {
    const saved = localStorage.getItem('apex_exam_scores');
    return saved ? JSON.parse(saved) : INITIAL_EXAM_SCORES;
  });

  const [syllabusData, setSyllabusData] = useState(() => {
    const saved = localStorage.getItem('apex_syllabus');
    return saved ? JSON.parse(saved) : KERALA_PLUS_ONE_SYLLABUS;
  });

  // Active printable receipt state
  const [activeReceipt, setActiveReceipt] = useState(null);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('apex_active_student', activeStudentId);
  }, [activeStudentId]);

  useEffect(() => {
    localStorage.setItem('apex_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('apex_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('apex_fees', JSON.stringify(fees));
  }, [fees]);

  useEffect(() => {
    localStorage.setItem('apex_exam_scores', JSON.stringify(examScores));
  }, [examScores]);

  useEffect(() => {
    localStorage.setItem('apex_syllabus', JSON.stringify(syllabusData));
  }, [syllabusData]);

  // Derived current active student
  const currentStudent = students.find(s => s.id === activeStudentId) || students[0] || null;
  const currentStudentAttendance = currentStudent ? (attendance[currentStudent.id] || []) : [];
  const currentStudentFees = currentStudent ? (fees[currentStudent.id] || []) : [];
  const currentStudentScores = currentStudent ? (examScores[currentStudent.id] || []) : [];

  // ==================== FULL STUDENT CRUD ====================

  // 1. ADD NEW STUDENT
  const addStudent = (studentData) => {
    const newId = 'STD-' + Math.floor(100 + Math.random() * 900);
    const newStudent = {
      id: newId,
      name: studentData.name,
      stream: studentData.stream || 'science',
      batch: studentData.batch || 'Plus One Science A1',
      parentName: studentData.parentName || 'Parent Name',
      parentPhone: studentData.parentPhone || '+91 90000 00000',
      joiningDate: studentData.joiningDate || new Date().toISOString().split('T')[0],
      monthlyFee: Number(studentData.monthlyFee) || 2500,
      avatar: studentData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    };

    setStudents(prev => [newStudent, ...prev]);

    // Initialize initial fee record for current month
    const currentMonthStr = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    setFees(prev => ({
      ...prev,
      [newId]: [
        {
          id: 'fee-' + Date.now(),
          month: currentMonthStr,
          amountDue: newStudent.monthlyFee,
          dueDate: new Date().toISOString().split('T')[0],
          status: 'Unpaid',
          paymentDate: '-',
          receiptNo: '-',
          paymentMode: '-'
        }
      ]
    }));

    setAttendance(prev => ({ ...prev, [newId]: [] }));
    setExamScores(prev => ({ ...prev, [newId]: [] }));

    setActiveStudentId(newId);
    return newStudent;
  };

  // 2. EDIT / UPDATE STUDENT
  const updateStudent = (studentId, updatedData) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return { ...s, ...updatedData };
      }
      return s;
    }));
  };

  // 3. DELETE STUDENT
  const deleteStudent = (studentId) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
    setAttendance(prev => {
      const copy = { ...prev };
      delete copy[studentId];
      return copy;
    });
    setFees(prev => {
      const copy = { ...prev };
      delete copy[studentId];
      return copy;
    });
    setExamScores(prev => {
      const copy = { ...prev };
      delete copy[studentId];
      return copy;
    });

    const remaining = students.filter(s => s.id !== studentId);
    if (remaining.length > 0) {
      setActiveStudentId(remaining[0].id);
    }
  };

  // ==================== ATTENDANCE CRUD ====================

  const addAttendanceRecord = (studentId, record) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: [
        { id: 'att-' + Date.now(), ...record },
        ...(prev[studentId] || [])
      ]
    }));
  };

  const deleteAttendanceRecord = (studentId, attId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: (prev[studentId] || []).filter(a => a.id !== attId)
    }));
  };

  // ==================== FEES CRUD ====================

  const markFeeAsPaid = (studentId, feeId, paymentDetails) => {
    const receiptNo = 'REC-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    setFees(prev => {
      const studentFees = prev[studentId] || [];
      const updated = studentFees.map(f => {
        if (f.id === feeId) {
          return {
            ...f,
            status: 'Paid',
            paymentDate: paymentDetails.paymentDate || new Date().toISOString().split('T')[0],
            paymentMode: paymentDetails.paymentMode || 'UPI',
            receiptNo: receiptNo
          };
        }
        return f;
      });
      return { ...prev, [studentId]: updated };
    });
  };

  const deleteFeeRecord = (studentId, feeId) => {
    setFees(prev => ({
      ...prev,
      [studentId]: (prev[studentId] || []).filter(f => f.id !== feeId)
    }));
  };

  // ==================== EXAM SCORES CRUD ====================

  const addExamScore = (studentId, scoreData) => {
    setExamScores(prev => ({
      ...prev,
      [studentId]: [
        { id: 'ex-' + Date.now(), ...scoreData },
        ...(prev[studentId] || [])
      ]
    }));
  };

  const deleteExamScore = (studentId, scoreId) => {
    setExamScores(prev => ({
      ...prev,
      [studentId]: (prev[studentId] || []).filter(s => s.id !== scoreId)
    }));
  };

  // ==================== SYLLABUS UPDATER ====================

  const updateModuleStatus = (stream, subjectId, moduleId, newStatus, newProgress) => {
    setSyllabusData(prev => {
      const streamModules = [...prev[stream]];
      const subIndex = streamModules.findIndex(s => s.id === subjectId);
      if (subIndex === -1) return prev;

      const updatedModules = streamModules[subIndex].modules.map(m => {
        if (m.id === moduleId) {
          return { ...m, status: newStatus, progress: newProgress };
        }
        return m;
      });

      streamModules[subIndex] = {
        ...streamModules[subIndex],
        modules: updatedModules
      };

      return { ...prev, [stream]: streamModules };
    });
  };

  const resetToDefaultData = () => {
    setStudents(INITIAL_STUDENTS);
    setAttendance(INITIAL_ATTENDANCE);
    setFees(INITIAL_FEES);
    setExamScores(INITIAL_EXAM_SCORES);
    setSyllabusData(KERALA_PLUS_ONE_SYLLABUS);
    localStorage.clear();
  };

  return (
    <PortalContext.Provider value={{
      tuitionInfo: TUITION_INFO,
      activeTab,
      setActiveTab,
      activeStream,
      setActiveStream,
      activeStudentId,
      setActiveStudentId,
      students,
      currentStudent,
      currentStudentAttendance,
      currentStudentFees,
      currentStudentScores,
      syllabusData,
      activeReceipt,
      setActiveReceipt,
      addStudent,
      updateStudent,
      deleteStudent,
      addAttendanceRecord,
      deleteAttendanceRecord,
      markFeeAsPaid,
      deleteFeeRecord,
      addExamScore,
      deleteExamScore,
      updateModuleStatus,
      resetToDefaultData
    }}>
      {children}
    </PortalContext.Provider>
  );
}

export function usePortal() {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
}
