import test from 'node:test';
import assert from 'node:assert/strict';
import { createStudentSyllabusMap, createStudentExamMap, isPlusOneStudentClass } from './syllabusStorage.js';

test('non-Plus-One students do not use the Plus One master syllabus', () => {
  assert.equal(isPlusOneStudentClass('Plus One (Class 11)'), true);
  assert.equal(isPlusOneStudentClass('Class 9'), false);
  assert.equal(isPlusOneStudentClass(''), false);
});

test('each student gets an independent syllabus copy', () => {
  const map = createStudentSyllabusMap(['STD-101', 'STD-102']);

  assert.deepEqual(Object.keys(map), ['STD-101', 'STD-102']);

  map['STD-101'].science[0].modules[0].status = 'Changed';

  assert.notEqual(map['STD-102'].science[0].modules[0].status, 'Changed');
  assert.equal(map['STD-102'].science[0].modules[0].status, 'Completed');
});

test('each student keeps separate weekly exam records', () => {
  const exams = createStudentExamMap(['STD-101', 'STD-102']);

  exams['STD-101'].push({ id: 'e-1', subject: 'Physics', marksObtained: 28, maxMarks: 30 });

  assert.equal(exams['STD-102'].length, 0);
  assert.equal(exams['STD-101'][0].subject, 'Physics');
});
