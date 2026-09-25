import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const TeacherPortalContext = createContext();

const PLUS_ONE_CLASS_NAME = 'Plus One (Class 11)';

const isPlusOneClass = (className = '') => {
  const normalized = String(className || '').trim().toLowerCase();
  return normalized === 'plus one (class 11)' || normalized === 'plus one' || normalized === 'class 11';
};

const getMasterPortionsForClass = (className = PLUS_ONE_CLASS_NAME) =>
  isPlusOneClass(className) ? INITIAL_MASTER_PORTIONS : [];

export const CLASSES_LIST = [
  'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Plus One (Class 11)', 'Plus Two (Class 12)'
];

export const BOARDS_LIST = [
  'State Syllabus (Kerala)'
];

export const SUBJECTS_LIST = [
  'Physics', 'Chemistry', 'Mathematics', 'Biology'
];
const isSyllabusLockedClass = (className = '') => {
  const normalized = String(className || '').trim().toLowerCase();
  return normalized === 'plus one (class 11)' || normalized === 'plus one' || normalized === 'class 11'
    || normalized === 'plus two (class 12)' || normalized === 'plus two' || normalized === 'class 12';
};

const getDefaultSubjectsForClass = (className = '') => {
  return isSyllabusLockedClass(className) ? SUBJECTS_LIST : [];
};
// Completely Empty Datasets by Default
const INITIAL_TEACHER_STUDENTS = [];
const INITIAL_ATTENDANCE = {};
const INITIAL_FEES = {};
const INITIAL_WEEKLY_EXAMS = {};

// Master Syllabus Portions Database for Plus One students only.
// Additional class chapters can be added manually from the UI when needed.
const INITIAL_MASTER_PORTIONS = [
  { id: 'p11-st-p1', targetClass: 'Plus One (Class 11)', board: 'State Syllabus (Kerala)', subject: 'Physics', portionName: 'Units and Measurements', status: 'Completed' },
  { id: 'p11-st-p2', targetClass: 'Plus One (Class 11)', board: 'State Syllabus (Kerala)', subject: 'Physics', portionName: 'Motion in a Straight Line', status: 'Completed' },
  { id: 'p11-st-p3', targetClass: 'Plus One (Class 11)', board: 'State Syllabus (Kerala)', subject: 'Physics', portionName: 'Motion in a Plane', status: 'Completed' },
  { id: 'p11-st-p4', targetClass: 'Plus One (Class 11)', board: 'State Syllabus (Kerala)', subject: 'Physics', portionName: 'Laws of Motion & Friction', status: 'In Progress' },
  { id: 'p11-st-p5', targetClass: 'Plus One (Class 11)', board: 'State Syllabus (Kerala)', subject: 'Physics', portionName: 'Work, Energy and Power', status: 'In Progress' },
  { id: 'p11-st-p6', targetClass: 'Plus One (Class 11)', board: 'State Syllabus (Kerala)', subject: 'Physics', portionName: 'System of Particles & Rotational Motion', status: 'Not Started' },
  { id: 'p11-st-p7', targetClass: 'Plus One (Class 11)', board: 'State Syllabus (Kerala)', subject: 'Physics', portionName: 'Gravitation', status: 'Not Started' },

  { id: 'p11-st-c1', targetClass: 'Plus One (Class 11)', board: 'State Syllabus (Kerala)', subject: 'Chemistry', portionName: 'Some Basic Concepts of Chemistry', status: 'Completed' },
  { id: 'p11-st-c2', targetClass: 'Plus One (Class 11)', board: 'State Syllabus (Kerala)', subject: 'Chemistry', portionName: 'Structure of Atom', status: 'Completed' },
  { id: 'p11-st-c3', targetClass: 'Plus One (Class 11)', board: 'State Syllabus (Kerala)', subject: 'Chemistry', portionName: 'Classification of Elements & Periodic Properties', status: 'Completed' },

  { id: 'p11-st-m1', targetClass: 'Plus One (Class 11)', board: 'State Syllabus (Kerala)', subject: 'Mathematics', portionName: 'Sets, Relations and Functions', status: 'Completed' },
  { id: 'p11-st-m2', targetClass: 'Plus One (Class 11)', board: 'State Syllabus (Kerala)', subject: 'Mathematics', portionName: 'Trigonometric Functions', status: 'In Progress' },

  { id: 'p11-st-b1', targetClass: 'Plus One (Class 11)', board: 'State Syllabus (Kerala)', subject: 'Biology', portionName: 'The Living World & Biological Classification', status: 'Completed' }
];

const ENV_PASSCODE = import.meta.env.VITE_PASSCODE || 'tuition1';

export function TeacherPortalProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('apex_teacher_auth') === 'true';
  });

  const [activeTab, setActiveTab] = useState('students');

  // Interactive Syllabus Dropdown Filters
  const [selectedClass, setSelectedClass] = useState(PLUS_ONE_CLASS_NAME);
  const [selectedBoard, setSelectedBoard] = useState('State Syllabus (Kerala)');
  const [selectedSubject, setSelectedSubject] = useState('Physics');
  const [customSubjects, setCustomSubjects] = useState(() => {
    const saved = localStorage.getItem('ajs_custom_subjects');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load custom subjects from localStorage', e);
      }
    }
    return {};
  });

  const [selectedClassFilter, setSelectedClassFilter] = useState('All');
  const [selectedBoardFilter, setSelectedBoardFilter] = useState('All');

  const [activeStudentId, setActiveStudentId] = useState('');

  // Load stored data or default to empty arrays
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('ajs_teacher_students');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load students from localStorage', e);
      }
    }
    return [];
  });

  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem('ajs_teacher_attendance');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load attendance from localStorage', e);
      }
    }
    return {};
  });

  const [fees, setFees] = useState(() => {
    const saved = localStorage.getItem('ajs_teacher_fees');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load fees from localStorage', e);
      }
    }
    return {};
  });

  const [weeklyExams, setWeeklyExams] = useState(() => {
    const saved = localStorage.getItem('ajs_teacher_exams');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load exams from localStorage', e);
      }
    }
    return {};
  });

  const [studentSyllabus, setStudentSyllabus] = useState(() => {
    const saved = localStorage.getItem('ajs_student_syllabus');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load student syllabus from localStorage', e);
      }
    }
    return {};
  });

  const [studentWeeklyExams, setStudentWeeklyExams] = useState(() => {
    const saved = localStorage.getItem('ajs_student_weekly_exams');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load student weekly exams from localStorage', e);
      }
    }
    return {};
  });

  const [studentPortions, setStudentPortions] = useState(() => {
    const saved = localStorage.getItem('ajs_student_portions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load student portions from localStorage', e);
      }
    }
    return {};
  });

  const [remoteReady, setRemoteReady] = useState(false);

  useEffect(() => {
    const loadSharedPortalState = async () => {
      const { data, error } = await supabase
        .from('portal_state')
        .select('students, attendance, fees, weekly_exams, student_syllabus, student_weekly_exams, portions')
        .eq('id', 'main')
        .single();

      if (error) {
        console.error('Failed to load shared portal data from Supabase', error);
        setRemoteReady(true);
        return;
      }

      const hasRemoteData = (data.students || []).length > 0 || Object.keys(data.attendance || {}).length > 0;
      const hasLocalData = students.length > 0 || Object.keys(attendance).length > 0;

      if (hasRemoteData || !hasLocalData) {
        setStudents(data.students || []);
        setAttendance(data.attendance || {});
        setFees(data.fees || {});
        setWeeklyExams(data.weekly_exams || {});
        setStudentSyllabus(data.student_syllabus || {});
        setStudentWeeklyExams(data.student_weekly_exams || {});
        setStudentPortions({});
      }

      setRemoteReady(true);
    };

    loadSharedPortalState();
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('ajs_teacher_auth', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  useEffect(() => {
    if (activeStudentId) {
      localStorage.setItem('ajs_active_student', activeStudentId);
    }
  }, [activeStudentId]);

  useEffect(() => {
    localStorage.setItem('ajs_teacher_students', JSON.stringify(students));
    // If activeStudentId is not set or invalid, sync it
    if (students.length > 0 && (!activeStudentId || !students.some(s => s.id === activeStudentId))) {
      setActiveStudentId(students[0].id);
    } else if (students.length === 0) {
      setActiveStudentId('');
    }
  }, [students]);

  useEffect(() => {
    localStorage.setItem('ajs_teacher_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('ajs_teacher_fees', JSON.stringify(fees));
  }, [fees]);

  useEffect(() => {
    localStorage.setItem('ajs_student_portions', JSON.stringify(studentPortions));
  }, [studentPortions]);

  useEffect(() => {
    localStorage.setItem('ajs_teacher_exams', JSON.stringify(weeklyExams));
  }, [weeklyExams]);

  useEffect(() => {
    localStorage.setItem('ajs_student_syllabus', JSON.stringify(studentSyllabus));
  }, [studentSyllabus]);

  useEffect(() => {
    localStorage.setItem('ajs_student_weekly_exams', JSON.stringify(studentWeeklyExams));
  }, [studentWeeklyExams]);

  useEffect(() => {
    if (!remoteReady) return;

    const saveSharedPortalState = async () => {
      const { error } = await supabase
        .from('portal_state')
        .update({
          students,
          attendance,
          fees,
          weekly_exams: weeklyExams,
          student_syllabus: studentSyllabus,
          student_weekly_exams: studentWeeklyExams,
          portions: Object.values(studentPortions).flat(),
          updated_at: new Date().toISOString()
        })
        .eq('id', 'main');

      if (error) {
        console.error('Failed to save shared portal data to Supabase', error);
      }
    };

    saveSharedPortalState();
  }, [remoteReady, students, attendance, fees, weeklyExams, studentSyllabus, studentWeeklyExams, studentPortions]);

  const currentStudent = students.find(s => s.id === activeStudentId) || (students.length > 0 ? students[0] : null);
  const currentAttendance = currentStudent
    ? [...(attendance[currentStudent.id] || [])].sort((a, b) => b.date.localeCompare(a.date))
    : [];
  const currentFees = currentStudent ? (fees[currentStudent.id] || []) : [];
  const currentExams = currentStudent ? (weeklyExams[currentStudent.id] || []) : [];
  const portions = currentStudent ? (studentPortions[currentStudent.id] || getMasterPortionsForClass(currentStudent.studentClass || PLUS_ONE_CLASS_NAME)) : [];

  const availableSubjects = React.useMemo(() => {
    const classSubjects = customSubjects[selectedClass] || [];
    const defaults = getDefaultSubjectsForClass(selectedClass);
    return defaults.length > 0 ? defaults : classSubjects.length > 0 ? classSubjects : ['General'];
  }, [selectedClass, customSubjects]);

  useEffect(() => {
    if (!currentStudent) return;
    const nextClass = currentStudent.studentClass || PLUS_ONE_CLASS_NAME;
    const nextBoard = currentStudent.board || 'State Syllabus (Kerala)';

    if (selectedClass !== nextClass) {
      setSelectedClass(nextClass);
    }

    if (selectedBoard !== nextBoard) {
      setSelectedBoard(nextBoard);
    }

    setStudentPortions(prev => {
      if (!prev[currentStudent.id]) {
        return {
          ...prev,
          [currentStudent.id]: getMasterPortionsForClass(nextClass)
        };
      }
      return prev;
    });
  }, [currentStudent, selectedClass, selectedBoard]);

  useEffect(() => {
    if (!availableSubjects.includes(selectedSubject)) {
      setSelectedSubject(availableSubjects[0] || '');
    }
  }, [availableSubjects, selectedSubject]);

  useEffect(() => {
    localStorage.setItem('ajs_custom_subjects', JSON.stringify(customSubjects));
  }, [customSubjects]);

  const loginTeacher = (passcode) => {
    if (passcode === ENV_PASSCODE) {
      setIsAuthenticated(true);
      localStorage.setItem('apex_teacher_auth', 'true');
      return true;
    }
    return false;
  };

  const logoutTeacher = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('apex_teacher_auth');
  };

  // Student CRUD
  const addStudent = (data) => {
    const newId = 'STD-' + Math.floor(100 + Math.random() * 900);
    const newStudent = {
      id: newId,
      name: data.name,
      studentClass: data.studentClass || 'Plus One (Class 11)',
      board: data.board || 'State Syllabus (Kerala)',
      batch: data.batch || `${data.studentClass} ${data.board}`,
      monthlyFee: Number(data.monthlyFee) || 2500,
      parentName: data.parentName || 'Parent',
      parentPhone: data.parentPhone || '+91 90000 00000',
      joiningDate: data.joiningDate || new Date().toISOString().split('T')[0],
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    };

    setStudents(prev => [newStudent, ...prev]);

    const monthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    setFees(prev => ({
      ...prev,
      [newId]: [
        { id: 'fee-' + Date.now(), month: monthName, amountDue: newStudent.monthlyFee, status: 'Unpaid', paymentDate: '-', paymentMode: '-' }
      ]
    }));

    setAttendance(prev => ({ ...prev, [newId]: [] }));
    setWeeklyExams(prev => ({ ...prev, [newId]: [] }));
    setActiveStudentId(newId);
  };

  const updateStudent = (id, updated) => {
    setStudents(prev => prev.map(s => (s.id === id ? { ...s, ...updated } : s)));
  };

  const deleteStudent = (id) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    const nextRemaining = students.filter(s => s.id !== id);
    if (nextRemaining.length > 0) {
      setActiveStudentId(nextRemaining[0].id);
    } else {
      setActiveStudentId('');
    }
  };

  // Attendance CRUD
  const addAttendanceRecord = (studentId, record) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: [{ id: 'att-' + Date.now(), ...record }, ...(prev[studentId] || [])]
    }));
  };

  const updateAttendanceRecord = (studentId, attId, record) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: (prev[studentId] || []).map(attendanceRecord => (
        attendanceRecord.id === attId
          ? { ...attendanceRecord, ...record }
          : attendanceRecord
      ))
    }));
  };

  const deleteAttendanceRecord = (studentId, attId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: (prev[studentId] || []).filter(a => a.id !== attId)
    }));
  };

  // Fee Payments Log
  const markFeePaid = (studentId, feeId, mode, paymentDate) => {
    setFees(prev => {
      const studentFees = prev[studentId] || [];
      const updated = studentFees.map(f => {
        if (f.id === feeId) {
          return {
            ...f,
            status: 'Paid',
            paymentDate: paymentDate || new Date().toISOString().split('T')[0],
            paymentMode: mode || 'UPI'
          };
        }
        return f;
      });
      return { ...prev, [studentId]: updated };
    });
  };

  const markFeeUnpaid = (studentId, feeId) => {
    setFees(prev => {
      const studentFees = prev[studentId] || [];
      const updated = studentFees.map(f => {
        if (f.id === feeId) {
          return {
            ...f,
            status: 'Unpaid',
            paymentDate: '-',
            paymentMode: '-'
          };
        }
        return f;
      });
      return { ...prev, [studentId]: updated };
    });
  };

  const addMonthFeeRecord = (studentId, monthName, amount) => {
    setFees(prev => ({
      ...prev,
      [studentId]: [
        { id: 'fee-' + Date.now(), month: monthName, amountDue: Number(amount), status: 'Unpaid', paymentDate: '-', paymentMode: '-' },
        ...(prev[studentId] || [])
      ]
    }));
  };

  const deleteFeeRecord = (studentId, feeId) => {
    setFees(prev => ({
      ...prev,
      [studentId]: (prev[studentId] || []).filter(f => f.id !== feeId)
    }));
  };

  // Custom Portion CRUD
  const addCustomSubject = (className, subjectName) => {
    const trimmed = (subjectName || '').trim();
    if (!trimmed) return false;

    setCustomSubjects(prev => ({
      ...prev,
      [className]: Array.from(new Set([...(prev[className] || []), trimmed]))
    }));

    setSelectedSubject(trimmed);
    return true;
  };

  const addPortion = (targetClass, board, subjectName, portionTitle) => {
    if (!currentStudent) return;

    const newPortion = {
      id: 'por-' + Date.now(),
      targetClass,
      board,
      subject: subjectName,
      portionName: portionTitle,
      status: 'Not Started'
    };

    setStudentPortions(prev => ({
      ...prev,
      [currentStudent.id]: [...(prev[currentStudent.id] || []), newPortion]
    }));
  };

  const updatePortionStatus = (portionId, newStatus) => {
    if (!currentStudent) return;

    setStudentPortions(prev => ({
      ...prev,
      [currentStudent.id]: (prev[currentStudent.id] || []).map(p => (p.id === portionId ? { ...p, status: newStatus } : p))
    }));
  };

  const deletePortion = (portionId) => {
    if (!currentStudent) return;

    setStudentPortions(prev => ({
      ...prev,
      [currentStudent.id]: (prev[currentStudent.id] || []).filter(p => p.id !== portionId)
    }));
  };

  // Weekly Exam CRUD
  const addWeeklyExam = (studentId, examData) => {
    setWeeklyExams(prev => ({
      ...prev,
      [studentId]: [{ id: 'ex-' + Date.now(), ...examData }, ...(prev[studentId] || [])]
    }));
  };

  const deleteWeeklyExam = (studentId, examId) => {
    setWeeklyExams(prev => ({
      ...prev,
      [studentId]: (prev[studentId] || []).filter(e => e.id !== examId)
    }));
  };

  const seedSampleStudents = () => {
    const sampleList = [
      {
        id: 'STD-101',
        name: 'Sreehari Nair',
        studentClass: 'Plus One (Class 11)',
        board: 'State Syllabus (Kerala)',
        batch: 'Science Stream (PCMB)',
        monthlyFee: 2500,
        parentName: 'Suresh Nair',
        parentPhone: '+91 98470 12345',
        joiningDate: '2026-06-01',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 'STD-102',
        name: 'Ananya Ramesh',
        studentClass: 'Class 10',
        board: 'CBSE',
        batch: 'Grade 10 Batch A',
        monthlyFee: 2200,
        parentName: 'Ramesh Kumar',
        parentPhone: '+91 94471 98765',
        joiningDate: '2026-06-05',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 'STD-103',
        name: 'Rahul Varma',
        studentClass: 'Plus Two (Class 12)',
        board: 'State Syllabus (Kerala)',
        batch: 'Bio Science Stream',
        monthlyFee: 2800,
        parentName: 'Varma G.',
        parentPhone: '+91 97452 44332',
        joiningDate: '2026-05-15',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 'STD-104',
        name: 'Devika Menon',
        studentClass: 'Class 8',
        board: 'CBSE',
        batch: 'Middle School Batch',
        monthlyFee: 1800,
        parentName: 'Rajesh Menon',
        parentPhone: '+91 98950 55667',
        joiningDate: '2026-06-10',
        avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80'
      }
    ];

    const sampleFees = {
      'STD-101': [{ id: 'fee-1', month: 'September 2026', amountDue: 2500, status: 'Paid', paymentDate: '2026-09-02', paymentMode: 'GPay UPI' }],
      'STD-102': [{ id: 'fee-2', month: 'September 2026', amountDue: 2200, status: 'Unpaid', paymentDate: '-', paymentMode: '-' }],
      'STD-103': [{ id: 'fee-3', month: 'September 2026', amountDue: 2800, status: 'Paid', paymentDate: '2026-09-05', paymentMode: 'Cash' }],
      'STD-104': [{ id: 'fee-4', month: 'September 2026', amountDue: 1800, status: 'Paid', paymentDate: '2026-09-01', paymentMode: 'Paytm UPI' }]
    };

    setStudents(sampleList);
    setFees(sampleFees);
    setActiveStudentId('STD-101');
  };

  const resetToMasterSyllabus = () => {
    if (!currentStudent) return;
    const nextPortions = getMasterPortionsForClass(selectedClass);
    setStudentPortions(prev => ({
      ...prev,
      [currentStudent.id]: nextPortions
    }));
  };

  const clearAllStudentData = () => {
    setStudents([]);
    setAttendance({});
    setFees({});
    setWeeklyExams({});
    setStudentSyllabus({});
    setStudentWeeklyExams({});
    setStudentPortions({});
    setActiveStudentId('');
    localStorage.removeItem('ajs_teacher_students');
    localStorage.removeItem('ajs_teacher_attendance');
    localStorage.removeItem('ajs_teacher_fees');
    localStorage.removeItem('ajs_teacher_exams');
    localStorage.removeItem('ajs_student_syllabus');
    localStorage.removeItem('ajs_student_weekly_exams');
    localStorage.removeItem('ajs_student_portions');
  };

  return (
    <TeacherPortalContext.Provider value={{
      isAuthenticated,
      loginTeacher,
      logoutTeacher,
      activeTab,
      setActiveTab,
      selectedClass,
      setSelectedClass,
      selectedBoard,
      setSelectedBoard,
      selectedSubject,
      setSelectedSubject,
      selectedClassFilter,
      setSelectedClassFilter,
      selectedBoardFilter,
      setSelectedBoardFilter,
      activeStudentId,
      setActiveStudentId,
      students,
      currentStudent,
      currentAttendance,
      currentFees,
      portions,
      currentExams,
      availableSubjects,
      addCustomSubject,
      addStudent,
      updateStudent,
      deleteStudent,
      addAttendanceRecord,
      updateAttendanceRecord,
      deleteAttendanceRecord,
      markFeePaid,
      markFeeUnpaid,
      addMonthFeeRecord,
      deleteFeeRecord,
      addPortion,
      updatePortionStatus,
      deletePortion,
      addWeeklyExam,
      deleteWeeklyExam,
      seedSampleStudents,
      resetToMasterSyllabus,
      clearAllStudentData
    }}>
      {children}
    </TeacherPortalContext.Provider>
  );
}

export function useTeacherPortal() {
  const context = useContext(TeacherPortalContext);
  if (!context) throw new Error('useTeacherPortal must be used within TeacherPortalProvider');
  return context;
}
