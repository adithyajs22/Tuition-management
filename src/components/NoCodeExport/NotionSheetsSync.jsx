import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { Database, Download, Copy, Check, ExternalLink, Table, Layers, FileSpreadsheet, Globe } from 'lucide-react';

export default function NotionSheetsSync() {
  const { students, currentStudentAttendance, currentStudentFees, syllabusData, activeStream } = usePortal();
  const [copiedSection, setCopiedSection] = useState(null);

  // Helper to export CSV
  const exportToCSV = (filename, rows) => {
    if (!rows || !rows.length) return;
    const separator = ',';
    const keys = Object.keys(rows[0]);
    const csvContent =
      keys.join(separator) +
      '\n' +
      rows
        .map(row => {
          return keys
            .map(k => {
              let cell = row[k] === null || row[k] === undefined ? '' : row[k];
              cell = cell instanceof Date ? cell.toLocaleString() : cell.toString();
              cell = cell.replace(/"/g, '""');
              if (cell.search(/("|,|\n)/g) >= 0) {
                cell = `"${cell}"`;
              }
              return cell;
            })
            .join(separator);
        })
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const copyToClipboard = (text, sectionId) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // Flattened Syllabus Data for Export
  const getFlatSyllabus = () => {
    const flat = [];
    Object.keys(syllabusData).forEach(stream => {
      syllabusData[stream].forEach(sub => {
        sub.modules.forEach(mod => {
          flat.push({
            Stream: stream.toUpperCase(),
            Subject: sub.subject,
            SubjectCode: sub.code,
            ModuleName: mod.name,
            Chapters: mod.chapters.join(' | '),
            Status: mod.status,
            ProgressPct: mod.progress
          });
        });
      });
    });
    return flat;
  };

  // Flattened Attendance Logs
  const getFlatAttendance = () => {
    const flat = [];
    Object.keys(currentStudentAttendance).forEach(key => {
      const record = currentStudentAttendance[key];
      flat.push({
        Date: record.date,
        Day: record.day,
        Status: record.status,
        ArrivalTime: record.arrivalTime,
        TopicsCovered: record.topicsCovered
      });
    });
    return flat;
  };

  // Flattened Fees Ledger
  const getFlatFees = () => {
    return currentStudentFees.map(f => ({
      Month: f.month,
      AmountDue: f.amountDue,
      DueDate: f.dueDate,
      PaymentStatus: f.status,
      PaymentDate: f.paymentDate,
      PaymentMode: f.paymentMode,
      ReceiptNumber: f.receiptNo
    }));
  };

  const notionSchemaText = `
=== NOTION DATABASE SCHEMA BLUEPRINT ===

1. SYLLABUS TRACKER TABLE
   Properties:
   - Module Name (Title)
   - Subject (Select: Physics, Chemistry, Math, Biology, Accountancy, Economics)
   - Status (Select: Not Started, Ongoing, Completed)
   - Exam Score (Number / Formula)
   - Stream (Select: Science, Commerce)

2. ATTENDANCE LOG TABLE
   Properties:
   - Date (Date)
   - Day (Select: Monday, Tuesday...)
   - Attendance Status (Select: Present, Absent, Excused)
   - Arrival Time (Text)
   - Topics Covered Today (Rich Text)

3. FEES LEDGER TABLE
   Properties:
   - Month (Title / Select)
   - Amount Due (Number - Currency INR)
   - Due Date (Date)
   - Payment Status (Select: Paid, Unpaid)
   - Payment Date (Date)
   - Receipt ID (Text)
`.trim();

  return (
    <div className="py-12 bg-slate-950 text-slate-100 min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>No-Code Platform Integration</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">Notion, Google Sites & Glide Apps Exporter</h2>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            Download your live portal databases to CSV format or copy pre-configured database blueprints to sync instantly with Notion, Google Sheets, or Glide.
          </p>
        </div>

        {/* Action Cards: CSV Export */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-indigo-500/50 transition-all shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-4">
                <Table className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Export Syllabus Data</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Download all Kerala Plus One modules, NCERT chapters, and completion statuses as CSV.
              </p>
            </div>
            <button
              onClick={() => exportToCSV('kerala_plus_one_syllabus.csv', getFlatSyllabus())}
              className="mt-6 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-all"
            >
              <Download className="w-4 h-4" />
              Download Syllabus CSV
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-emerald-500/50 transition-all shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Export Attendance Log</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Download student arrival timestamps, present/absent statuses, and daily topics.
              </p>
            </div>
            <button
              onClick={() => exportToCSV('student_attendance_log.csv', getFlatAttendance())}
              className="mt-6 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all"
            >
              <Download className="w-4 h-4" />
              Download Attendance CSV
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-amber-500/50 transition-all shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Export Fees Ledger</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Export transparent payment statuses, monthly dues, payment dates, and receipt codes.
              </p>
            </div>
            <button
              onClick={() => exportToCSV('student_fees_ledger.csv', getFlatFees())}
              className="mt-6 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
            >
              <Download className="w-4 h-4" />
              Download Fees Ledger CSV
            </button>
          </div>

        </div>

        {/* Notion & Google Sheets Blueprint Viewer */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-white">Database Setup Blueprint Specification</h3>
              <p className="text-xs text-slate-400 mt-1">
                Copy this exact property layout into Notion databases or Google Sheets columns.
              </p>
            </div>

            <button
              onClick={() => copyToClipboard(notionSchemaText, 'notion')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 text-xs font-bold transition-all"
            >
              {copiedSection === 'notion' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  Copied Blueprint!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Notion Schema Text
                </>
              )}
            </button>
          </div>

          <pre className="bg-slate-950 p-6 rounded-2xl border border-slate-800 font-mono text-xs text-cyan-300/90 overflow-x-auto leading-relaxed">
            {notionSchemaText}
          </pre>
        </div>

        {/* 3 Step No-Code Deployment Guides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Method 1</span>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Notion (Recommended)</h4>
            <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
              <li>Create a new Notion Page named <strong className="text-white">Apex Tuition Portal</strong>.</li>
              <li>Add 3 Inline Databases: <em className="text-indigo-400">Syllabus Tracker</em>, <em className="text-indigo-400">Attendance Log</em>, and <em className="text-indigo-400">Fees Ledger</em>.</li>
              <li>Import the CSV files downloaded above directly into each database.</li>
              <li>Share the private page link with parents for view access.</li>
            </ol>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Method 2</span>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Google Sites + Sheets</h4>
            <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
              <li>Open Google Sheets and import the 3 exported CSV files into tabs.</li>
              <li>Create a free website on <strong className="text-white">sites.google.com</strong>.</li>
              <li>Click <strong className="text-emerald-400">Insert → Google Sheet</strong> and select your tracker.</li>
              <li>Publish site with password protection or restricted viewer access.</li>
            </ol>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Method 3</span>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Glide Apps Mobile Web</h4>
            <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
              <li>Sign up at <strong className="text-white">glideapps.com</strong> (Free tier).</li>
              <li>Connect your Google Sheet containing Attendance & Fees tabs.</li>
              <li>Glide automatically generates a sleek iOS/Android web app interface.</li>
              <li>Distribute the mobile link to students and parents.</li>
            </ol>
          </div>

        </div>

      </div>
    </div>
  );
}
