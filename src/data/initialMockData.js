export const TUITION_INFO = {
  centerName: 'Apex Kerala Plus One Academy',
  tagline: 'Streamlined Excellence for HSE Kerala State Board',
  tutorName: 'Prof. K. R. Suresh & Team',
  contactNumber: '+91 98470 12345',
  email: 'support@apextuition.kl',
  location: 'Kochi & Thiruvananthapuram, Kerala',
  timing: 'Evening Batches: 5:00 PM - 7:30 PM | Weekend Batches: 8:00 AM - 1:00 PM',
  highlights: [
    { title: 'Kerala Board Focused', desc: '100% aligned with SCERT & NCERT Kerala HSE syllabus.' },
    { title: 'Daily Attendance Alerts', desc: 'Parent notifications and real-time portal logging.' },
    { title: 'Weekly Unit Tests', desc: 'Granular topic tests with instant mark evaluation.' },
    { title: 'Transparent Fee Ledger', desc: 'Instant digital receipts & transparent monthly records.' }
  ]
};

export const INITIAL_STUDENTS = [
  {
    id: 'STD-101',
    name: 'Rahul Varma',
    stream: 'science',
    batch: 'Plus One Science A1',
    passcode: '101',
    parentName: 'Vinod Varma',
    parentPhone: '+91 94471 88290',
    joiningDate: '2026-06-01',
    monthlyFee: 2500,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'STD-102',
    name: 'Ananya Nair',
    stream: 'science',
    batch: 'Plus One Science A1',
    passcode: '102',
    parentName: 'Sujatha Nair',
    parentPhone: '+91 98460 33112',
    joiningDate: '2026-06-01',
    monthlyFee: 2500,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'STD-103',
    name: 'Mohammed Rizwan',
    stream: 'commerce',
    batch: 'Plus One Commerce C1',
    passcode: '103',
    parentName: 'Abdul Khader',
    parentPhone: '+91 97452 99881',
    joiningDate: '2026-06-05',
    monthlyFee: 2200,
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_ATTENDANCE = {
  'STD-101': [
    { id: 'att-1', date: '2026-09-12', day: 'Saturday', status: 'Present', arrivalTime: '05:02 PM', topicsCovered: 'Physics: Laws of Motion - Friction & Circular Motion' },
    { id: 'att-2', date: '2026-09-11', day: 'Friday', status: 'Present', arrivalTime: '04:58 PM', topicsCovered: 'Chemistry: Chemical Thermodynamics - First Law' },
    { id: 'att-3', date: '2026-09-10', day: 'Thursday', status: 'Present', arrivalTime: '05:05 PM', topicsCovered: 'Maths: Linear Inequalities Numerical Practice' },
    { id: 'att-4', date: '2026-09-09', day: 'Wednesday', status: 'Present', arrivalTime: '05:00 PM', topicsCovered: 'Biology: Cell Division - Mitosis & Meiosis' },
    { id: 'att-5', date: '2026-09-08', day: 'Tuesday', status: 'Absent', arrivalTime: '-', topicsCovered: 'Physics: Work, Energy and Power Problem Solving' },
    { id: 'att-6', date: '2026-09-07', day: 'Monday', status: 'Present', arrivalTime: '04:55 PM', topicsCovered: 'Chemistry: States of Matter - Gas Laws' },
    { id: 'att-7', date: '2026-09-05', day: 'Saturday', status: 'Present', arrivalTime: '05:01 PM', topicsCovered: 'Maths: Permutations & Combinations Basics' }
  ],
  'STD-102': [
    { id: 'att-101', date: '2026-09-12', day: 'Saturday', status: 'Present', arrivalTime: '04:55 PM', topicsCovered: 'Physics: Laws of Motion - Friction & Circular Motion' },
    { id: 'att-102', date: '2026-09-11', day: 'Friday', status: 'Present', arrivalTime: '05:00 PM', topicsCovered: 'Chemistry: Chemical Thermodynamics - First Law' },
    { id: 'att-103', date: '2026-09-10', day: 'Thursday', status: 'Present', arrivalTime: '04:50 PM', topicsCovered: 'Maths: Linear Inequalities Numerical Practice' },
    { id: 'att-104', date: '2026-09-09', day: 'Wednesday', status: 'Present', arrivalTime: '04:58 PM', topicsCovered: 'Biology: Cell Division - Mitosis & Meiosis' },
    { id: 'att-105', date: '2026-09-08', day: 'Tuesday', status: 'Present', arrivalTime: '05:02 PM', topicsCovered: 'Physics: Work, Energy and Power Problem Solving' }
  ],
  'STD-103': [
    { id: 'att-201', date: '2026-09-12', day: 'Saturday', status: 'Present', arrivalTime: '05:00 PM', topicsCovered: 'Accountancy: Special Journals & Cash Book' },
    { id: 'att-202', date: '2026-09-11', day: 'Friday', status: 'Present', arrivalTime: '05:05 PM', topicsCovered: 'Economics: Central Tendency - Median & Mode' },
    { id: 'att-203', date: '2026-09-10', day: 'Thursday', status: 'Excused', arrivalTime: '-', topicsCovered: 'Business Studies: Emerging Modes of Business' }
  ]
};

export const INITIAL_FEES = {
  'STD-101': [
    { id: 'fee-sep', month: 'September 2026', amountDue: 2500, dueDate: '2026-09-10', status: 'Paid', paymentDate: '2026-09-05', receiptNo: 'REC-2026-0901', paymentMode: 'UPI (GPay)' },
    { id: 'fee-aug', month: 'August 2026', amountDue: 2500, dueDate: '2026-08-10', status: 'Paid', paymentDate: '2026-08-04', receiptNo: 'REC-2026-0814', paymentMode: 'Cash' },
    { id: 'fee-jul', month: 'July 2026', amountDue: 2500, dueDate: '2026-07-10', status: 'Paid', paymentDate: '2026-07-06', receiptNo: 'REC-2026-0722', paymentMode: 'UPI (PhonePe)' },
    { id: 'fee-oct', month: 'October 2026', amountDue: 2500, dueDate: '2026-10-10', status: 'Unpaid', paymentDate: '-', receiptNo: '-', paymentMode: '-' }
  ],
  'STD-102': [
    { id: 'fee-sep-2', month: 'September 2026', amountDue: 2500, dueDate: '2026-09-10', status: 'Paid', paymentDate: '2026-09-02', receiptNo: 'REC-2026-0902', paymentMode: 'Bank Transfer' },
    { id: 'fee-aug-2', month: 'August 2026', amountDue: 2500, dueDate: '2026-08-10', status: 'Paid', paymentDate: '2026-08-03', receiptNo: 'REC-2026-0815', paymentMode: 'UPI' }
  ],
  'STD-103': [
    { id: 'fee-sep-3', month: 'September 2026', amountDue: 2200, dueDate: '2026-09-10', status: 'Unpaid', paymentDate: '-', receiptNo: '-', paymentMode: '-' },
    { id: 'fee-aug-3', month: 'August 2026', amountDue: 2200, dueDate: '2026-08-10', status: 'Paid', paymentDate: '2026-08-08', receiptNo: 'REC-2026-0833', paymentMode: 'Cash' }
  ]
};

export const INITIAL_EXAM_SCORES = {
  'STD-101': [
    { id: 'ex-1', subject: 'Physics', topic: 'Kinematics & Motion', testDate: '2026-09-01', maxMarks: 30, marksObtained: 27, grade: 'A+' },
    { id: 'ex-2', subject: 'Chemistry', topic: 'Structure of Atom', testDate: '2026-08-25', maxMarks: 25, marksObtained: 23, grade: 'A+' },
    { id: 'ex-3', subject: 'Mathematics', topic: 'Sets & Relations', testDate: '2026-08-18', maxMarks: 40, marksObtained: 34, grade: 'A' },
    { id: 'ex-4', subject: 'Biology', topic: 'Biological Classification', testDate: '2026-08-10', maxMarks: 30, marksObtained: 28, grade: 'A+' }
  ],
  'STD-102': [
    { id: 'ex-101', subject: 'Physics', topic: 'Kinematics & Motion', testDate: '2026-09-01', maxMarks: 30, marksObtained: 29, grade: 'A+' },
    { id: 'ex-102', subject: 'Chemistry', topic: 'Structure of Atom', testDate: '2026-08-25', maxMarks: 25, marksObtained: 24, grade: 'A+' }
  ],
  'STD-103': [
    { id: 'ex-201', subject: 'Accountancy', topic: 'Journal & Ledger', testDate: '2026-09-02', maxMarks: 30, marksObtained: 26, grade: 'A' },
    { id: 'ex-202', subject: 'Economics', topic: 'Collection & Presentation of Data', testDate: '2026-08-26', maxMarks: 25, marksObtained: 21, grade: 'B+' }
  ]
};
