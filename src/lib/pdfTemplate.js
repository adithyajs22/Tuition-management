export const PDF_THEME = {
  indigo: [48, 63, 143],
  deepIndigo: [30, 42, 105],
  teal: [0, 143, 143],
  ink: [25, 35, 75],
  muted: [95, 105, 125],
  line: [222, 226, 235],
  pale: [244, 246, 250],
  white: [255, 255, 255]
};

export function drawPdfHeader(doc, title, subtitle = '', studentName = '') {
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 18;

  doc.setFillColor(...PDF_THEME.indigo);
  doc.triangle(pageWidth * 0.41, 0, pageWidth, 0, pageWidth, 43, 'F');
  doc.setFillColor(...PDF_THEME.deepIndigo);
  doc.triangle(pageWidth * 0.73, 0, pageWidth, 43, pageWidth, 0, 'F');

  doc.setFillColor(...PDF_THEME.indigo);
  doc.circle(margin + 4, 17, 7, 'F');
  doc.setTextColor(...PDF_THEME.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('CUR', margin + 4, 18.5, { align: 'center' });

  doc.setTextColor(...PDF_THEME.indigo);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(studentName || 'Student', margin + 14, 15, {
    maxWidth: pageWidth * 0.34
  });
  doc.setTextColor(...PDF_THEME.teal);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Student Learning Record', margin + 14, 21);

  doc.setTextColor(...PDF_THEME.white);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Downloaded ${new Date().toLocaleDateString('en-GB')}`, pageWidth - margin, 20, { align: 'right' });

  doc.setTextColor(...PDF_THEME.ink);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(title, margin, 57, { maxWidth: pageWidth - margin * 2 });
  if (subtitle) {
    doc.setTextColor(...PDF_THEME.muted);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(subtitle, margin, 64, { maxWidth: pageWidth - margin * 2 });
  }
  doc.setDrawColor(...PDF_THEME.line);
  doc.setLineDashPattern([1, 1], 0);
  doc.line(margin, 69, pageWidth - margin, 69);
  doc.setLineDashPattern([], 0);

  return 77;
}

export function drawPdfSectionTitle(doc, title, y, x = 18, width) {
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setTextColor(...PDF_THEME.ink);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(title.toUpperCase(), x, y);
  doc.setDrawColor(...PDF_THEME.line);
  doc.line(x, y + 3, width ? x + width : pageWidth - x, y + 3);
  return y + 10;
}

export function drawPdfFooter(doc) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const totalPages = doc.getNumberOfPages();

  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page);
    doc.setFillColor(...PDF_THEME.indigo);
    doc.triangle(0, pageHeight - 15, 0, pageHeight, 47, pageHeight, 'F');
    doc.setTextColor(...PDF_THEME.white);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('STUDENT RECORD', 6, pageHeight - 7);
    doc.setTextColor(...PDF_THEME.muted);
    doc.text('Computer-generated document', 54, pageHeight - 7);
    doc.text(`Page ${page} of ${totalPages}`, pageWidth - 18, pageHeight - 7, { align: 'right' });
  }
  doc.setPage(totalPages);
}
