import test from 'node:test';
import assert from 'node:assert/strict';
import { buildPortalStatePayload, hasMeaningfulSharedData } from './portalSync.js';
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

test('shared portal payload is created with the shared row id and all shared collections', () => {
  const payload = buildPortalStatePayload({
    students: [{ id: 'STD-101', name: 'Amina' }],
    attendance: { 'STD-101': [{ id: 'a-1', status: 'Present' }] },
    fees: { 'STD-101': [{ id: 'f-1', amountDue: 2500 }] },
    weekly_exams: { 'STD-101': [{ id: 'e-1', subject: 'Physics' }] },
    student_syllabus: { 'STD-101': { physics: [] } },
    student_weekly_exams: { 'STD-101': [{ id: 'sw-1' }] },
    portions: [{ id: 'p-1', portionName: 'Motion' }],
    homework_notes: { 'STD-101': [{ id: 'n-1', title: 'Read chapter' }] }
  });

  assert.equal(payload.id, 'main');
  assert.deepEqual(payload.students, [{ id: 'STD-101', name: 'Amina' }]);
  assert.deepEqual(payload.portions, [{ id: 'p-1', portionName: 'Motion' }]);
  assert.deepEqual(payload.homework_notes, { 'STD-101': [{ id: 'n-1', title: 'Read chapter' }] });
});

test('meaningful shared data is detected only when collections actually contain records', () => {
  assert.equal(hasMeaningfulSharedData({ students: [] }), false);
  assert.equal(hasMeaningfulSharedData({ students: [{ id: 'STD-101' }] }), true);
  assert.equal(hasMeaningfulSharedData({ attendance: { 'STD-101': [] } }), false);
  assert.equal(hasMeaningfulSharedData({ attendance: { 'STD-101': [{ id: 'a-1' }] } }), true);
});
