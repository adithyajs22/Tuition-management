import { KERALA_PLUS_ONE_SYLLABUS } from '../data/keralaSyllabusData.js';

export function clonePlusOneSyllabus() {
  return JSON.parse(JSON.stringify(KERALA_PLUS_ONE_SYLLABUS));
}

export function createStudentSyllabusMap(studentIds = []) {
  return studentIds.reduce((acc, studentId) => {
    acc[studentId] = clonePlusOneSyllabus();
    return acc;
  }, {});
}

export function createStudentExamMap(studentIds = []) {
  return studentIds.reduce((acc, studentId) => {
    acc[studentId] = [];
    return acc;
  }, {});
}

export function ensureStudentSyllabus(studentId, studentSyllabusMap = {}) {
  if (!studentId) return clonePlusOneSyllabus();

  if (!studentSyllabusMap[studentId]) {
    studentSyllabusMap[studentId] = clonePlusOneSyllabus();
  }

  return studentSyllabusMap[studentId];
}
