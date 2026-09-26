export const buildPortalStatePayload = (state = {}) => ({
  id: 'main',
  students: state.students || [],
  attendance: state.attendance || {},
  fees: state.fees || {},
  weekly_exams: state.weekly_exams || {},
  student_syllabus: state.student_syllabus || {},
  student_weekly_exams: state.student_weekly_exams || {},
  portions: state.portions || [],
  homework_notes: state.homework_notes || {},
  updated_at: new Date().toISOString()
});

export const hasMeaningfulSharedData = (data = {}) => {
  const collections = ['students', 'attendance', 'fees', 'weekly_exams', 'student_syllabus', 'student_weekly_exams', 'portions', 'homework_notes'];

  return collections.some((key) => {
    const value = data[key];

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    if (value && typeof value === 'object') {
      return Object.keys(value).length > 0 && Object.values(value).some((entry) => {
        if (Array.isArray(entry)) return entry.length > 0;
        if (entry && typeof entry === 'object') return Object.keys(entry).length > 0;
        return Boolean(entry);
      });
    }

    return Boolean(value);
  });
};
