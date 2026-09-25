import { KERALA_PLUS_ONE_SYLLABUS } from '../data/keralaSyllabusData.js';

export function isPlusOneStudentClass(studentClass = '') {
  if (!studentClass || typeof studentClass !== 'string') return false;
  const normalized = studentClass.trim().toLowerCase();
  return normalized === 'plus one (class 11)' || normalized === 'plus one' || normalized === 'class 11';
}

export function clonePlusOneSyllabus() {
  return JSON.parse(JSON.stringify(KERALA_PLUS_ONE_SYLLABUS));
}

export function cloneEmptySyllabus() {
  return {
    science: [],
    commerce: [],
    humanities: []
  };
}

export function createStudentSyllabusMap(studentIds = [], studentClasses = []) {
  return studentIds.reduce((acc, studentId, index) => {
    const studentClass = studentClasses[index];
    const shouldUsePlusOneDefaults = studentClass === undefined || studentClass === null || studentClass === '' || isPlusOneStudentClass(studentClass);
    acc[studentId] = shouldUsePlusOneDefaults ? clonePlusOneSyllabus() : cloneEmptySyllabus();
    return acc;
  }, {});
}

export function createStudentExamMap(studentIds = []) {
  return studentIds.reduce((acc, studentId) => {
    acc[studentId] = [];
    return acc;
  }, {});
}

export function ensureStudentSyllabus(studentId, studentSyllabusMap = {}, studentClass = '') {
  const shouldUsePlusOneDefaults = !studentClass || studentClass === '' || isPlusOneStudentClass(studentClass);
  if (!studentId) return shouldUsePlusOneDefaults ? clonePlusOneSyllabus() : cloneEmptySyllabus();

  if (!studentSyllabusMap[studentId]) {
    studentSyllabusMap[studentId] = shouldUsePlusOneDefaults ? clonePlusOneSyllabus() : cloneEmptySyllabus();
  }

  return studentSyllabusMap[studentId];
}
