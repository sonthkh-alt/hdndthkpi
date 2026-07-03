import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

// EXCEL — Mẫu 1A tổng hợp
export function exportExcel1A(rows, period, unit) {
  const aoa = [
    [unit],
    [`DANH SÁCH TỔNG HỢP KẾT QUẢ ĐÁNH GIÁ, XẾP LOẠI - Tháng ${period.month}/${period.year}`],
    [],
    ['STT', 'Họ và tên', 'Chức vụ', 'Tự đánh giá', 'Cấp duyệt', 'Xếp loại'],
    ...rows.map((r, i) => [i + 1, r.name, r.position, r.self, r.mgr, r.cls]),
  ];
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws['!cols'] = [{ wch: 5 }, { wch: 26 }, { wch: 24 }, { wch: 12 }, { wch: 12 }, { wch: 10 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Mau 1A');
  XLSX.writeFile(wb, `Mau1A_${period.month}_${period.year}.xlsx`);
}

// WORD — Phiếu đánh giá, xếp loại cá nhân ĐẦY ĐỦ, CHI TIẾT.
// Liệt kê: thông tin cán bộ · bảng Nhóm I từng tiêu chí (Tự ĐG/Cấp duyệt) · bảng Nhóm II từng nhiệm vụ
// · thành phần lãnh đạo (d/đ/e) · tổng hợp điểm & xếp loại · điều kiện Điều 8 · nhận xét · phê duyệt + chữ ký.
const FONT = 'Times New Roman';
const SINGLE = { style: BorderStyle.SINGLE, size: 4, color: '888888' };
const CELL_BORDERS = { top: SINGLE, bottom: SINGLE, left: SINGLE, right: SINGLE };

// Đoạn văn thường (Times New Roman, cỡ ~13pt)
function P(text, opts = {}) {
  const { bold = false, italics = false, align = AlignmentType.LEFT, size = 26, spacingAfter = 0, color } = opts;
  const runs = Array.isArray(text) ? text : [{ text, bold, italics, color }];
  return new Paragraph({
    alignment: align,
    spacing: { after: spacingAfter },
    children: runs.map((r) => new TextRun({ text: String(r.text ?? ''), bold: r.bold ?? bold, italics: r.italics ?? italics, color: r.color ?? color, size, font: FONT })),
  });
}
// Ô bảng
function TC(text, opts = {}) {
  const { bold = false, align = AlignmentType.LEFT, span, width, size = 22, shade, italics = false, color } = opts;
  return new TableCell({
    columnSpan: span,
    width: width ? { size: width, type: WidthType.PERCENTAGE } : undefined,
    shading: shade ? { fill: shade } : undefined,
    borders: CELL_BORDERS,
    margins: { top: 30, bottom: 30, left: 70, right: 70 },
    verticalAlign: 'center',
    children: [new Paragraph({ alignment: align, children: [new TextRun({ text: String(text ?? ''), bold, italics, color, size, font: FONT })] })],
  });
}
const fmt = (v, d = 2) => (v == null || v === '' || isNaN(Number(v)) ? '' : Number(v).toFixed(d));

export async function exportWordPhieu(ev) {
  const C = AlignmentType.CENTER, R = AlignmentType.RIGHT;
  const children = [];

  // ===== Đầu phiếu =====
  children.push(P(ev.unit.toUpperCase(), { bold: true, size: 24, align: C }));
  children.push(P('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', { bold: true, size: 24, align: C }));
  children.push(P('Độc lập - Tự do - Hạnh phúc', { bold: true, size: 24, align: C, spacingAfter: 200 }));
  children.push(P('PHIẾU ĐÁNH GIÁ, XẾP LOẠI CÁN BỘ, CÔNG CHỨC HẰNG THÁNG', { bold: true, size: 30, align: C }));
  if (ev.mau) children.push(P(`(${ev.mau})`, { italics: true, size: 22, align: C }));
  children.push(P(`Kỳ đánh giá: Tháng ${ev.month}/${ev.year}`, { italics: true, size: 24, align: C, spacingAfter: 200 }));

  // ===== Thông tin cán bộ =====
  children.push(P([{ text: 'Họ và tên: ', bold: true }, { text: ev.name || '...' }]));
  children.push(P([{ text: 'Chức vụ / Vị trí việc làm: ', bold: true }, { text: ev.position || '...' }]));
  if (ev.department) children.push(P([{ text: 'Phòng / Bộ phận: ', bold: true }, { text: ev.department }]));
  children.push(P([{ text: 'Nhóm đối tượng đánh giá: ', bold: true }, { text: ev.typeLabel || '' }], { spacingAfter: 160 }));

  // ===== I. NHÓM TIÊU CHÍ CHUNG =====
  children.push(P('I. NHÓM TIÊU CHÍ CHUNG (tối đa 30 điểm)', { bold: true, size: 26, spacingAfter: 80 }));
  const nIrows = [new TableRow({ tableHeader: true, children: [
    TC('Tiêu chí đánh giá', { bold: true, align: C, shade: 'E8EEF7', width: 64 }),
    TC('Điểm tối đa', { bold: true, align: C, shade: 'E8EEF7', width: 12 }),
    TC('Tự ĐG', { bold: true, align: C, shade: 'E8EEF7', width: 12 }),
    TC('Cấp duyệt', { bold: true, align: C, shade: 'E8EEF7', width: 12 }),
  ] })];
  (ev.nhomICriteria || []).forEach((g) => {
    nIrows.push(new TableRow({ children: [
      TC(g.groupTitle, { bold: true, span: 3, shade: 'F3F4F6' }),
      TC(fmt(g.groupMax, 1), { bold: true, align: C, shade: 'F3F4F6' }),
    ] }));
    (g.items || []).forEach((it) => {
      nIrows.push(new TableRow({ children: [
        TC(`${it.id}. ${it.text}`, { size: 20 }),
        TC(fmt(it.max, 1), { align: C }),
        TC(fmt(it.self, 1), { align: C }),
        TC(fmt(it.mgr, 1), { align: C }),
      ] }));
    });
  });
  nIrows.push(new TableRow({ children: [
    TC('CỘNG NHÓM I (giới hạn ≤ 30)', { bold: true, span: 2, align: R, shade: 'FEF3C7' }),
    TC(fmt(ev.nhomISelf, 2), { bold: true, align: C, shade: 'FEF3C7' }),
    TC(fmt(ev.nhomI, 2), { bold: true, align: C, shade: 'FEF3C7' }),
  ] }));
  children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: nIrows }));
  children.push(P('', { spacingAfter: 80 }));

  // ===== II. KẾT QUẢ THỰC HIỆN NHIỆM VỤ =====
  children.push(P('II. KẾT QUẢ THỰC HIỆN NHIỆM VỤ (Nhóm II, tối đa 70 điểm)', { bold: true, size: 26, spacingAfter: 80 }));
  const tasks = ev.tasks || [];
  if (tasks.length) {
    const tRows = [new TableRow({ tableHeader: true, children: [
      TC('STT', { bold: true, align: C, shade: 'E8EEF7', width: 5 }),
      TC('Nội dung công việc (danh mục Nhóm II)', { bold: true, align: C, shade: 'E8EEF7', width: 43 }),
      TC('SL giao', { bold: true, align: C, shade: 'E8EEF7', width: 9 }),
      TC('Hoàn thành', { bold: true, align: C, shade: 'E8EEF7', width: 10 }),
      TC('Lỗi CL', { bold: true, align: C, shade: 'E8EEF7', width: 8 }),
      TC('Trễ hạn', { bold: true, align: C, shade: 'E8EEF7', width: 8 }),
      TC('Tỷ lệ %', { bold: true, align: C, shade: 'E8EEF7', width: 8 }),
      TC('Điểm %', { bold: true, align: C, shade: 'E8EEF7', width: 9 }),
    ] })];
    tasks.forEach((t, i) => {
      const noCat = !t.catalogName;
      tRows.push(new TableRow({ children: [
        TC(i + 1, { align: C, size: 20 }),
        TC(noCat ? '(Chưa chọn danh mục — không được tính điểm)' : [t.catalogName, t.kr ? `KR: ${t.kr}` : '', t.objTitle ? `Mục tiêu: ${t.objTitle}` : '', t.note || ''].filter(Boolean).join(' — '), { size: 20, italics: noCat, color: noCat ? '9A3412' : undefined }),
        TC(t.assigned, { align: C, size: 20 }),
        TC(t.completed, { align: C, size: 20 }),
        TC(t.qualityIssues, { align: C, size: 20 }),
        TC(t.delays, { align: C, size: 20 }),
        TC(noCat ? '—' : fmt(t.ratioPct, 0) + '%', { align: C, size: 20 }),
        TC(noCat ? '—' : fmt(t.scorePct, 1), { align: C, size: 20 }),
      ] }));
    });
    children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: tRows }));
  } else {
    children.push(P('(Chưa nhập nhiệm vụ Nhóm II — mặc định đạt tối đa.)', { italics: true, size: 22 }));
  }
  children.push(P('', { spacingAfter: 60 }));
  // Tỷ lệ a/b/c và (lãnh đạo) d/đ/e
  children.push(P([
    { text: 'Tỷ lệ Khối lượng (a) = ', bold: true }, { text: `${ev.a}%; ` },
    { text: 'Chất lượng (b) = ', bold: true }, { text: `${ev.b}%; ` },
    { text: 'Tiến độ (c) = ', bold: true }, { text: `${ev.c}%.` },
  ], { size: 22 }));
  if (ev.leader && ev.leadScores) {
    children.push(P([
      { text: 'Lãnh đạo, quản lý (Điều 7) — Lĩnh vực phụ trách (d) = ', bold: true }, { text: `${fmt(ev.leadScores.d, 0)}%; ` },
      { text: 'Tổ chức thực hiện (đ) = ', bold: true }, { text: `${fmt(ev.leadScores.dd, 0)}%; ` },
      { text: 'Đoàn kết, kỷ luật (e) = ', bold: true }, { text: `${fmt(ev.leadScores.e, 0)}%.` },
    ], { size: 22 }));
    children.push(P(`Điểm kết quả = (a+b+c+d+đ+e)/6 = ${ev.kpi}%.`, { italics: true, size: 22 }));
  } else {
    children.push(P(`Điểm kết quả = (a+b+c)/3 = ${ev.kpi}%.`, { italics: true, size: 22 }));
  }
  children.push(P(`Điểm Nhóm II quy đổi = ${ev.kpi}% × 70% = ${ev.nhomII} điểm.`, { italics: true, size: 22, spacingAfter: 160 }));

  // ===== III. TỔNG HỢP & XẾP LOẠI =====
  children.push(P('III. TỔNG HỢP ĐIỂM & XẾP LOẠI', { bold: true, size: 26, spacingAfter: 80 }));
  const sumRow = (label, self, mgr, shade) => new TableRow({ children: [
    TC(label, { width: 64, shade }),
    TC(self, { align: C, width: 18, shade }),
    TC(mgr, { align: C, width: 18, shade, bold: !!shade }),
  ] });
  children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [
    new TableRow({ tableHeader: true, children: [
      TC('Thành phần điểm', { bold: true, shade: 'E8EEF7' }),
      TC('Tự đánh giá', { bold: true, align: C, shade: 'E8EEF7' }),
      TC('Cấp có thẩm quyền', { bold: true, align: C, shade: 'E8EEF7' }),
    ] }),
    sumRow('Nhóm I — Tiêu chí chung (≤ 30)', fmt(ev.nhomISelf), fmt(ev.nhomI)),
    sumRow('Nhóm II — Kết quả nhiệm vụ (≤ 70)', fmt(ev.nhomII), fmt(ev.nhomII)),
    sumRow('Điểm trừ', `− ${fmt(ev.deduction)}`, `− ${fmt(ev.deduction)}`),
    sumRow('TỔNG ĐIỂM', fmt(ev.totalSelf), fmt(ev.total), 'FEF3C7'),
  ] }));
  children.push(P('', { spacingAfter: 40 }));
  children.push(P([
    { text: 'XẾP LOẠI (theo điểm Cấp có thẩm quyền): ', bold: true, size: 26 },
    { text: `${ev.cls} — ${ev.clsName}`, bold: true, size: 28, color: 'B91C1C' },
  ]));
  if (ev.disciplined) children.push(P('Ghi chú: Bị xử lý kỷ luật / kết luận vi phạm trong kỳ → xếp loại "Không hoàn thành nhiệm vụ" theo Điều 8 khoản 4 (không trừ vào tổng điểm).', { italics: true, size: 22, color: 'B91C1C' }));
  if (ev.gradeReasons && ev.gradeReasons.length) {
    children.push(P('Căn cứ điều kiện xếp loại (Điều 8 QĐ 1053-QĐ/TU):', { bold: true, size: 22, spacingAfter: 40 }));
    ev.gradeReasons.forEach((r) => children.push(new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: r, size: 20, font: FONT })] })));
  }
  children.push(P('', { spacingAfter: 120 }));

  // ===== IV. NHẬN XÉT =====
  children.push(P('IV. NHẬN XÉT, KẾT LUẬN', { bold: true, size: 26, spacingAfter: 60 }));
  children.push(P([{ text: 'Ý kiến tự nhận xét của cá nhân: ', bold: true }, { text: ev.selfNote || '...........................................................................' }], { size: 24 }));
  children.push(P([{ text: 'Nhận xét, kết luận của cấp có thẩm quyền: ', bold: true }, { text: ev.mgrNote || '...........................................................................' }], { size: 24, spacingAfter: 160 }));

  // ===== Trạng thái phê duyệt + chữ ký =====
  if (ev.approved) {
    children.push(P([
      { text: '✔ ĐÃ PHÊ DUYỆT', bold: true, color: '047857' },
      { text: ` bởi ${ev.approvedBy || ''}${ev.approvedRole ? ` (${ev.approvedRole})` : ''}${ev.approvedAt ? `, ngày ${ev.approvedAt}` : ''}.` },
    ], { size: 22, spacingAfter: 200 }));
  } else {
    children.push(P('(Phiếu chưa được cấp có thẩm quyền phê duyệt chính thức.)', { italics: true, size: 22, color: '92400E', spacingAfter: 200 }));
  }

  // Hai khối chữ ký
  const signCol = (role, hint, name) => [
    P(role, { bold: true, align: C, size: 24 }),
    P(hint, { italics: true, align: C, size: 20 }),
    P('', { spacingAfter: 600 }),
    P(name || '', { bold: true, align: C, size: 24 }),
  ];
  children.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
    rows: [new TableRow({ children: [
      new TableCell({ borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }, width: { size: 50, type: WidthType.PERCENTAGE }, children: signCol('NGƯỜI TỰ ĐÁNH GIÁ', '(Ký, ghi rõ họ tên)', ev.name) }),
      new TableCell({ borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }, width: { size: 50, type: WidthType.PERCENTAGE }, children: [
        P(`........., ngày ${ev.approvedAt ? ev.approvedAt.split('/')[0] : '......'} tháng ${ev.approvedAt ? ev.approvedAt.split('/')[1] : '......'} năm ${ev.year}`, { italics: true, align: C, size: 22 }),
        ...signCol('CẤP CÓ THẨM QUYỀN', '(Ký, ghi rõ họ tên)', ev.approved ? (ev.approvedBy || '') : ''),
      ] }),
    ] })],
  }));

  const doc = new Document({ sections: [{ properties: { page: { margin: { top: 1000, bottom: 1000, left: 1100, right: 1000 } } }, children }] });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Phieu_DanhGia_${(ev.name || 'canbo').replace(/\s+/g, '_')}_${ev.month}_${ev.year}.docx`);
}

// WORD — Phiếu đánh giá theo mô hình SINGAPORE (Performance Appraisal).
// Bố cục: thông tin · Work Review (mục tiêu+KR+mức đạt) · Competencies (AIM) · Values (ISE)
// · Overall Grade A–E · CEP (tiềm năng) · Development (CFR/IDP) + chữ ký.
const SG_RATING_LABEL = { 5: 'Xuất sắc', 4: 'Vượt mong đợi', 3: 'Đạt mong đợi', 2: 'Cần cải thiện', 1: 'Chưa đạt', 0: '—' };
const SG_COMP_LABEL = { analytical: 'Năng lực phân tích & trí tuệ (Analytical)', influence: 'Ảnh hưởng & hợp tác (Influence)', motivation: 'Động lực hướng tới xuất sắc (Motivation)' };
const SG_VAL_LABEL = { integrity: 'Liêm chính (Integrity)', service: 'Phục vụ (Service)', excellence: 'Xuất sắc (Excellence)' };
export async function exportSGAppraisal(ev) {
  const C = AlignmentType.CENTER, R = AlignmentType.RIGHT;
  const children = [];
  children.push(P((ev.unit || '').toUpperCase(), { bold: true, size: 24, align: C }));
  children.push(P('PHIẾU ĐÁNH GIÁ HIỆU SUẤT — MÔ HÌNH SINGAPORE (THAM KHẢO)', { bold: true, size: 30, align: C, spacingAfter: 60 }));
  children.push(P('Performance Appraisal — Singapore Public Service style', { italics: true, size: 22, align: C }));
  children.push(P(`Kỳ đánh giá: Tháng ${ev.month}/${ev.year}`, { italics: true, size: 24, align: C, spacingAfter: 200 }));

  children.push(P([{ text: 'Họ và tên: ', bold: true }, { text: ev.name || '...' }]));
  children.push(P([{ text: 'Chức vụ / Vị trí việc làm: ', bold: true }, { text: ev.position || '...' }]));
  if (ev.department) children.push(P([{ text: 'Phòng / Bộ phận: ', bold: true }, { text: ev.department }]));
  children.push(P([{ text: 'Nhóm đối tượng: ', bold: true }, { text: ev.typeLabel || '' }], { spacingAfter: 160 }));

  // 1. WORK REVIEW
  children.push(P('1. WORK REVIEW — KẾT QUẢ CÔNG VIỆC (What)', { bold: true, size: 26, spacingAfter: 80 }));
  const gRows = [new TableRow({ tableHeader: true, children: [
    TC('STT', { bold: true, align: C, shade: 'E8EEF7', width: 5 }),
    TC('Mục tiêu công việc · Key Result · Mục tiêu (OKR) gắn', { bold: true, align: C, shade: 'E8EEF7', width: 55 }),
    TC('Kết quả', { bold: true, align: C, shade: 'E8EEF7', width: 14 }),
    TC('Trọng số', { bold: true, align: C, shade: 'E8EEF7', width: 10 }),
    TC('Mức đạt', { bold: true, align: C, shade: 'E8EEF7', width: 16 }),
  ] })];
  (ev.goals || []).forEach((g, i) => {
    const lines = [g.title || '(chưa đặt)', g.kr ? `KR: ${g.kr}` : '', g.obj ? `OKR: ${g.obj}` : ''].filter(Boolean).join(' — ');
    gRows.push(new TableRow({ children: [
      TC(i + 1, { align: C, size: 20 }),
      TC(lines, { size: 20 }),
      TC(`${g.current ?? ''}/${g.target ?? ''} ${g.unit2 || ''}`.trim(), { align: C, size: 20 }),
      TC(g.weight ?? '', { align: C, size: 20 }),
      TC(`${g.rating || 0} · ${SG_RATING_LABEL[g.rating || 0]}`, { align: C, size: 20 }),
    ] }));
  });
  if ((ev.goals || []).length === 0) gRows.push(new TableRow({ children: [TC('Chưa có mục tiêu công việc.', { span: 5, italics: true, align: C, size: 20 })] }));
  children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: gRows }));
  children.push(P(`→ Điểm hiệu suất (Performance): ${fmt(ev.perfPct, 0)}%`, { italics: true, size: 22, spacingAfter: 120 }));

  // 2 + 3. COMPETENCIES + VALUES
  children.push(P('2. COMPETENCIES — NĂNG LỰC (How · AIM) & 3. CORE VALUES (ISE)', { bold: true, size: 26, spacingAfter: 80 }));
  const cRows = [new TableRow({ tableHeader: true, children: [
    TC('Tiêu chí', { bold: true, align: C, shade: 'E8EEF7', width: 70 }),
    TC('Mức (1–5)', { bold: true, align: C, shade: 'E8EEF7', width: 30 }),
  ] })];
  Object.keys(SG_COMP_LABEL).forEach((k) => { const v = (ev.comp || {})[k] || 0; cRows.push(new TableRow({ children: [TC(SG_COMP_LABEL[k], { size: 20 }), TC(`${v} · ${SG_RATING_LABEL[v]}`, { align: C, size: 20 })] })); });
  Object.keys(SG_VAL_LABEL).forEach((k) => { const v = (ev.values || {})[k] || 0; cRows.push(new TableRow({ children: [TC(SG_VAL_LABEL[k], { size: 20 }), TC(`${v} · ${SG_RATING_LABEL[v]}`, { align: C, size: 20 })] })); });
  children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: cRows }));
  children.push(P(`→ Năng lực AIM: ${fmt(ev.compPct, 0)}% · Giá trị ISE: ${fmt(ev.valPct, 0)}%`, { italics: true, size: 22, spacingAfter: 120 }));

  // 4. OVERALL GRADE
  children.push(P('4. OVERALL PERFORMANCE GRADE — XẾP LOẠI', { bold: true, size: 26, spacingAfter: 60 }));
  children.push(P([{ text: 'Điểm tổng hợp: ', bold: true }, { text: `${fmt(ev.overall, 1)}/100 (Hiệu suất 60% + Năng lực 25% + Giá trị 15%)` }]));
  children.push(P([{ text: 'Xếp loại chính thức: ', bold: true }, { text: `${ev.grade} — ${ev.gradeName}` }]));
  children.push(P([{ text: 'Đề xuất tự động: ', bold: true }, { text: ev.autoGrade || '' }], { spacingAfter: 60 }));
  children.push(P('Ghi chú: Singapore dùng xếp hạng tương đối có hiệu chỉnh giữa các đơn vị (không áp quota cứng).', { italics: true, size: 20, spacingAfter: 120 }));

  // 5. CEP
  children.push(P('5. CURRENTLY ESTIMATED POTENTIAL (CEP) — TIỀM NĂNG', { bold: true, size: 26, spacingAfter: 60 }));
  children.push(P([{ text: 'Mức trách nhiệm cao nhất ước lượng có thể đảm nhận (3–5 năm tới): ', bold: true }, { text: ev.cep || '—' }]));
  children.push(P('Tách riêng khỏi điểm hiệu suất; dùng cho quy hoạch, phát triển — không ảnh hưởng xếp loại.', { italics: true, size: 20, spacingAfter: 120 }));

  // 6. DEVELOPMENT
  children.push(P('6. DEVELOPMENT & CONVERSATION (CFR / IDP)', { bold: true, size: 26, spacingAfter: 60 }));
  const dl = (label, val) => children.push(P([{ text: `${label}: `, bold: true }, { text: val || '...' }], { spacingAfter: 40 }));
  dl('Điểm mạnh nổi bật', ev.strengths);
  dl('Lĩnh vực cần phát triển', ev.development);
  dl('Kế hoạch phát triển cá nhân (IDP)', ev.devActions);
  dl('Ý kiến của cán bộ', ev.selfComment);
  dl('Nhận xét của cấp trên', ev.supComment);
  children.push(P('', { spacingAfter: 200 }));

  const signCol = (role, hint) => [P(role, { bold: true, align: C, size: 24 }), P(hint, { italics: true, align: C, size: 20 }), P('', { spacingAfter: 600 })];
  children.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
    rows: [new TableRow({ children: [
      new TableCell({ borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }, width: { size: 50, type: WidthType.PERCENTAGE }, children: signCol('CÁN BỘ (Appraisee)', '(Ký, ghi rõ họ tên)') }),
      new TableCell({ borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }, width: { size: 50, type: WidthType.PERCENTAGE }, children: signCol('CẤP TRÊN TRỰC TIẾP (Appraiser)', '(Ký, ghi rõ họ tên)') }),
    ] })],
  }));

  const doc = new Document({ sections: [{ properties: { page: { margin: { top: 1000, bottom: 1000, left: 1100, right: 1000 } } }, children }] });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `SG_Appraisal_${(ev.name || 'officer').replace(/\s+/g, '_')}_${ev.month}_${ev.year}.docx`);
}

// ============================================================================
// PHIÊN BẢN KIỂM ĐIỂM (HD 03-HD/TU) — xuất Word
// ============================================================================
// Phụ lục 3A — Bản tự đánh giá, xếp loại của cá nhân (cán bộ diện BTV Tỉnh ủy quản lý).
// Khối tiêu đề 2 cột (không viền): trái = cơ quan Đảng; phải = Quốc hiệu Đảng + ngày tháng.
function kdHeaderTwoCol(unit) {
  const C = AlignmentType.CENTER;
  const NB = { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } };
  const left = [P('TỈNH ỦY THANH HÓA', { bold: true, align: C, size: 24 }), P((unit || 'ĐẢNG ỦY ……….').toUpperCase(), { bold: true, align: C, size: 22 }), P('*', { bold: true, align: C, size: 24 })];
  const right = [P('ĐẢNG CỘNG SẢN VIỆT NAM', { bold: true, align: C, size: 26 }), P('………, ngày …… tháng …… năm ……', { italics: true, align: C, size: 22 })];
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: { ...NB, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
    rows: [new TableRow({ children: [
      new TableCell({ borders: NB, width: { size: 46, type: WidthType.PERCENTAGE }, children: left }),
      new TableCell({ borders: NB, width: { size: 54, type: WidthType.PERCENTAGE }, children: right }),
    ] })],
  });
}

// PHỤ LỤC 3A — Bản tự đánh giá, xếp loại của cá nhân (theo đúng biểu mẫu docs/DU/5.Phlc3A.docx).
export async function exportKiemDiemCaNhan(ev) {
  const C = AlignmentType.CENTER, R = AlignmentType.RIGHT;
  const children = [];
  children.push(P('PHỤ LỤC 3A', { bold: true, align: R, size: 22 }));
  children.push(kdHeaderTwoCol(ev.unit));
  children.push(P('BẢN TỰ ĐÁNH GIÁ, XẾP LOẠI CỦA CÁ NHÂN', { bold: true, size: 28, align: C, spacingAfter: 20 }));
  children.push(P(`Quý ${ev.quarter}, năm ${ev.year}`, { bold: true, size: 26, align: C }));
  children.push(P('(Cán bộ thuộc diện Ban Thường vụ Tỉnh ủy quản lý)', { italics: true, size: 22, align: C }));
  children.push(P('(kèm theo Hướng dẫn số 03-HD/TU, ngày 02/7/2026 của Ban Thường vụ Tỉnh ủy)', { italics: true, size: 20, align: C, spacingAfter: 120 }));

  const dots = '…………………………………………………';
  children.push(P([{ text: 'Họ và tên: ', bold: true }, { text: (ev.name || '') + ' ' + dots }, { text: '  Ngày sinh: ', bold: true }, { text: '……………' }]));
  children.push(P([{ text: 'Chức vụ Đảng: ', bold: true }, { text: ev.chucVuDang || dots }]));
  children.push(P([{ text: 'Chức vụ chính quyền: ', bold: true }, { text: ev.position || dots }]));
  children.push(P([{ text: 'Chức vụ đoàn thể: ', bold: true }, { text: dots }]));
  children.push(P([{ text: 'Đơn vị công tác: ', bold: true }, { text: ev.department || ev.unit || dots }], { spacingAfter: 100 }));

  children.push(P('I. Tự đánh giá kết quả thực hiện nhiệm vụ', { bold: true, size: 26, spacingAfter: 20 }));
  children.push(P('Trên cơ sở nhiệm vụ được giao, cá nhân tự đánh giá về kết quả thực hiện nhiệm vụ theo quý như sau:', { italics: true, size: 22, spacingAfter: 60 }));

  // ---- Bảng A: Nhóm tiêu chí chung (30 điểm) ----
  const SH = 'F2DEDE';
  const aRows = [
    new TableRow({ tableHeader: true, children: [TC('A. NHÓM TIÊU CHÍ CHUNG (30 ĐIỂM)', { bold: true, align: C, shade: SH, span: 7 })] }),
    new TableRow({ tableHeader: true, children: [
      TC('TT', { bold: true, align: C, shade: SH, width: 6 }),
      TC('Tiêu chí / Nội dung', { bold: true, align: C, shade: SH, width: 52 }),
      TC('Đảm bảo (x)', { bold: true, align: C, shade: SH, width: 8 }),
      TC('Không đảm bảo (x)', { bold: true, align: C, shade: SH, width: 9 }),
      TC('Điểm tối đa', { bold: true, align: C, shade: SH, width: 9 }),
      TC('Điểm đạt', { bold: true, align: C, shade: SH, width: 8 }),
      TC('Ghi chú', { bold: true, align: C, shade: SH, width: 8 }),
    ] }),
  ];
  (ev.nhomA_groups || []).forEach((g) => {
    aRows.push(new TableRow({ children: [
      TC(g.id.replace('A', ''), { align: C, bold: true, size: 20 }),
      TC(g.title, { bold: true, size: 20 }),
      TC('', { shade: 'F7F7F7' }), TC('', { shade: 'F7F7F7' }),
      TC(fmt(g.max, 0), { align: C, bold: true, size: 20 }),
      TC(fmt(g.sub, 2), { align: C, bold: true, size: 20 }),
      TC('', {}),
    ] }));
    (g.items || []).forEach((it) => {
      const dam = it.diem >= it.max - 1e-9, khong = it.diem <= 1e-9;
      aRows.push(new TableRow({ children: [
        TC(it.id, { align: C, size: 18 }),
        TC(it.text, { size: 18 }),
        TC(dam ? 'x' : '', { align: C, size: 20 }),
        TC(khong ? 'x' : '', { align: C, size: 20 }),
        TC(String(it.max).replace('.', ','), { align: C, size: 18 }),
        TC(fmt(it.diem, 2), { align: C, size: 20 }),
        TC('', {}),
      ] }));
    });
  });
  aRows.push(new TableRow({ children: [
    TC('', {}), TC('Tổng (A) =', { bold: true, align: R, size: 20 }), TC('', {}), TC('', {}),
    TC('30', { align: C, bold: true, size: 20 }), TC(fmt(ev.nhomA, 2), { align: C, bold: true, size: 20 }), TC('', {}),
  ] }));
  children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: aRows }));
  children.push(P('Cách chấm: đảm bảo → tính điểm tối đa; không đảm bảo → 0 điểm.', { italics: true, size: 18, spacingAfter: 80 }));

  // ---- Bảng B: Kết quả thực hiện nhiệm vụ (70 điểm) ----
  const bRows = [
    new TableRow({ tableHeader: true, children: [TC('B. KẾT QUẢ THỰC HIỆN NHIỆM VỤ ĐƯỢC GIAO (70 ĐIỂM)', { bold: true, align: C, shade: SH, span: 8 })] }),
    new TableRow({ tableHeader: true, children: [
      TC('TT', { bold: true, align: C, shade: SH, width: 4 }),
      TC('Tiêu chí / Nội dung', { bold: true, align: C, shade: SH, width: 38 }),
      TC('Mục tiêu, nhiệm vụ đề ra', { bold: true, align: C, shade: SH, width: 16 }),
      TC('Kết quả sản phẩm thực tế', { bold: true, align: C, shade: SH, width: 16 }),
      TC('Điểm KPI (%)', { bold: true, align: C, shade: SH, width: 8 }),
      TC('Điểm tối đa', { bold: true, align: C, shade: SH, width: 6 }),
      TC('Điểm đạt', { bold: true, align: C, shade: SH, width: 8 }),
      TC('Ghi chú', { bold: true, align: C, shade: SH, width: 4 }),
    ] }),
  ];
  (ev.trucs || []).forEach((t) => {
    const noiDung = `Trục (${t.code}) - ${t.name}` + (t.indicators && t.indicators.length ? '. Chỉ tiêu: ' + t.indicators.join('; ') : '');
    bRows.push(new TableRow({ children: [
      TC(t.code, { align: C, bold: true, size: 20 }),
      TC(noiDung, { size: 18 }),
      TC(t.muctieu || '', { size: 18 }),
      TC(t.ketqua || '', { size: 18 }),
      TC(fmt(t.kpi, 0), { align: C, size: 20 }),
      TC(fmt(t.max, 0), { align: C, size: 20 }),
      TC(fmt(t.diem, 2), { align: C, bold: true, size: 20 }),
      TC('', {}),
    ] }));
  });
  bRows.push(new TableRow({ children: [
    TC('', {}), TC('TỔNG (B) =', { bold: true, align: R, size: 20 }), TC('', {}), TC('', {}), TC('', {}),
    TC('70', { align: C, bold: true, size: 20 }), TC(fmt(ev.nhomB, 2), { align: C, bold: true, size: 20 }), TC('', {}),
  ] }));
  bRows.push(new TableRow({ children: [
    TC('', {}), TC('TỔNG (A + B) =', { bold: true, align: R, size: 20 }), TC('', {}), TC('', {}), TC('', {}),
    TC('100', { align: C, bold: true, size: 20 }), TC(fmt(ev.total, 2), { align: C, bold: true, size: 20 }), TC('', {}),
  ] }));
  children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: bRows }));
  children.push(P('Mỗi trục: Điểm đạt = Điểm KPI (%) × Điểm tối đa; KPI = (A số lượng + B chất lượng + C tiến độ + D năng lực lãnh đạo, điều hành)/4.', { italics: true, size: 18, spacingAfter: 80 }));

  // ---- Tự kiểm điểm (tự luận) ----
  children.push(P('* Tự kiểm điểm, nhận xét của cá nhân:', { bold: true, size: 24, spacingAfter: 20 }));
  children.push(P([{ text: '- Ưu điểm, kết quả nổi bật: ', bold: true }, { text: ev.uudiem || '…' }]));
  children.push(P([{ text: '- Hạn chế, khuyết điểm và nguyên nhân: ', bold: true }, { text: ev.hanche || '…' }]));
  children.push(P([{ text: '- Phương hướng, biện pháp khắc phục kỳ tới: ', bold: true }, { text: ev.phuonghuong || '…' }], { spacingAfter: 100 }));

  // ---- II. Tự đề xuất xếp loại ----
  children.push(P([{ text: 'II. Tự đề xuất xếp loại mức chất lượng: ', bold: true }, { text: ev.selfGradeName || '……………………………………' }], { size: 26 }));
  children.push(P('(Theo 04 mức: 1- Hoàn thành xuất sắc nhiệm vụ; 2- Hoàn thành tốt nhiệm vụ; 3- Hoàn thành nhiệm vụ; 4- Không hoàn thành nhiệm vụ)', { italics: true, size: 20, spacingAfter: 40 }));
  children.push(P('CÁ NHÂN TỰ ĐÁNH GIÁ', { bold: true, align: R, size: 24 }));
  children.push(P('(Ký, ghi rõ họ tên)', { italics: true, align: R, size: 20, spacingAfter: 400 }));

  // ---- III. Nhận xét, đánh giá của cấp có thẩm quyền ----
  children.push(P('III. Nhận xét, đánh giá của cấp có thẩm quyền', { bold: true, size: 26, spacingAfter: 20 }));
  children.push(P([{ text: '- Chấm điểm: ', bold: true }, { text: `${fmt(ev.total, 1)}/100 điểm` + (ev.autoGradeName ? ` (đề xuất theo điều kiện Điều 13: ${ev.autoGradeName})` : '') }]));
  children.push(P([{ text: '- Đề xuất xếp loại: ', bold: true }, { text: ev.gradeName || '…………………………' }]));
  children.push(P([{ text: '- Mức độ đáp ứng đối với các mục tiêu, nhiệm vụ then chốt: ', bold: true }, { text: ev.mgrNote || '…' }]));
  if (ev.disciplined) children.push(P([{ text: '- Ghi chú: ', bold: true }, { text: 'Bị kỷ luật (khiển trách trở lên)/suy thoái trong kỳ.' }], { size: 22 }));
  (ev.gradeReasons || []).forEach((r) => children.push(P([{ text: '- ', bold: true }, { text: r }], { size: 22 })));
  if (ev.exemptNote) children.push(P([{ text: '- Lý do khách quan (nếu hoàn thành dưới 100%): ', bold: true }, { text: ev.exemptNote }], { size: 22 }));
  children.push(P('', { spacingAfter: 120 }));
  children.push(P('XÁC NHẬN CỦA BAN THƯỜNG VỤ ĐẢNG ỦY TRỰC THUỘC TỈNH ỦY', { bold: true, align: R, size: 22 }));
  children.push(P('HOẶC TẬP THỂ LÃNH ĐẠO CƠ QUAN, ĐƠN VỊ', { bold: true, align: R, size: 22 }));
  children.push(P('(Xác lập thời điểm, ký, ghi rõ họ tên và đóng dấu)', { italics: true, align: R, size: 20 }));

  const doc = new Document({ sections: [{ properties: { page: { margin: { top: 900, bottom: 900, left: 1000, right: 900 } } }, children }] });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `TuDanhGia_KiemDiem_${(ev.name || 'canbo').replace(/\s+/g, '_')}_Quy${ev.quarter}_${ev.year}.docx`);
}

// PHỤ LỤC 4 — Tổng hợp kết quả đánh giá và đề xuất xếp loại quý (tập thể),
// theo đúng biểu mẫu docs/DU/7.Phlc4.doc (7 cột, khổ ngang).
export async function exportKiemDiemTongHop(ev) {
  const C = AlignmentType.CENTER, R = AlignmentType.RIGHT;
  const children = [];
  children.push(P('PHỤ LỤC 4', { bold: true, align: R, size: 22 }));
  children.push(kdHeaderTwoCol(ev.unit));
  children.push(P(`TỔNG HỢP KẾT QUẢ ĐÁNH GIÁ VÀ ĐỀ XUẤT XẾP LOẠI QUÝ ${ev.quarter}, NĂM ${ev.year}`, { bold: true, size: 27, align: C }));
  children.push(P('ĐỐI VỚI CÁN BỘ THUỘC DIỆN BAN THƯỜNG VỤ TỈNH ỦY QUẢN LÝ', { bold: true, size: 25, align: C }));
  children.push(P('(kèm theo Hướng dẫn số 03-HD/TU, ngày 02/7/2026 của Ban Thường vụ Tỉnh ủy)', { italics: true, size: 20, align: C, spacingAfter: 160 }));

  const SH = 'F2DEDE';
  const rows = [new TableRow({ tableHeader: true, children: [
    TC('STT', { bold: true, align: C, shade: SH, width: 4 }),
    TC('Họ và tên', { bold: true, align: C, shade: SH, width: 15 }),
    TC('Chức vụ, đơn vị công tác', { bold: true, align: C, shade: SH, width: 20 }),
    TC('Cá nhân tự đề xuất mức xếp loại', { bold: true, align: C, shade: SH, width: 14 }),
    TC('Cấp có thẩm quyền đề xuất mức xếp loại', { bold: true, align: C, shade: SH, width: 14 }),
    TC('Tóm tắt căn cứ, cơ sở, lý do trong trường hợp đề xuất mức HTXS hoặc KHTNV hoặc các nội dung khác (nếu có)', { bold: true, align: C, shade: SH, width: 21 }),
    TC('Đề xuất nội dung liên quan về công tác cán bộ (nếu có)', { bold: true, align: C, shade: SH, width: 12 }),
  ] })];
  (ev.rows || []).forEach((r) => {
    rows.push(new TableRow({ children: [
      TC(r.stt, { align: C, size: 20 }),
      TC(r.name || '', { size: 20 }),
      TC(r.posUnit || '', { size: 20 }),
      TC(r.selfGradeName || '', { align: C, size: 20 }),
      TC(r.mgrGradeName || '', { align: C, size: 20 }),
      TC(r.reason || '', { size: 18 }),
      TC(r.canboNote || '', { size: 18 }),
    ] }));
  });
  children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows }));
  children.push(P('', { spacingAfter: 200 }));
  children.push(P('T/M BAN THƯỜNG VỤ ĐẢNG ỦY TRỰC THUỘC TỈNH ỦY', { bold: true, align: R, size: 22 }));
  children.push(P('HOẶC TẬP THỂ LÃNH ĐẠO', { bold: true, align: R, size: 22 }));
  children.push(P('(Xác lập thời điểm, ký, ghi rõ họ tên và đóng dấu)', { italics: true, align: R, size: 20 }));

  const doc = new Document({ sections: [{ properties: { page: { size: { orientation: 'landscape' }, margin: { top: 900, bottom: 900, left: 900, right: 900 } } }, children }] });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `TongHop_KiemDiem_Quy${ev.quarter}_${ev.year}.docx`);
}

// EXCEL — Bảng kiểm đếm, theo dõi công việc
export function exportTrackingExcel(people, weekTitle, unit) {
  const aoa = [
    [`BẢNG KIỂM ĐẾM, THEO DÕI CÔNG VIỆC CỦA ${unit.toUpperCase()}`],
    [weekTitle],
    [],
    [
      'Họ tên cán bộ, công chức nhập dữ liệu', // 0
      'STT', // 1
      'Nội dung công việc', // 2
      'Đơn vị, địa phương chủ trì, phối hợp', // 3
      'Ý kiến chỉ đạo cụ thể của TT HĐND tỉnh', // 4
      'Sản phẩm cuối cùng', // 5
      'Tiến độ thực hiện', // 6
      null, null, null,
      'Khó khăn, vướng mắc, nội dung làm rõ (nếu có)', // 10
      'Đề xuất, kiến nghị với TT HĐND tỉnh', // 11
      'Ghi chú' // 12
    ],
    [
      null, null, null, null, null, null,
      'Mốc thời gian', // 6
      null,
      'Công việc đã thực hiện', // 8
      'Công việc đang thực hiện', // 9
      null, null, null
    ],
    [
      null, null, null, null, null, null,
      'Triển khai', // 6
      'Hoàn thành', // 7
      null, null, null, null, null
    ]
  ];

  let stt = 1;
  people.forEach(p => {
    if (p.trackings && p.trackings.length > 0) {
      p.trackings.forEach((t, i) => {
        aoa.push([
          i === 0 ? p.name : '', // Gộp cột tên logic bằng cách để trống nếu là dòng thứ 2 trở đi
          stt++,
          t.content || '',
          t.coordination || '',
          t.directive || '',
          t.finalProduct || '',
          t.startDate || '',
          t.endDate || '',
          t.doneWork || '',
          t.doingWork || '',
          t.difficulties || '',
          t.proposals || '',
          t.note || ''
        ]);
      });
    }
  });

  const ws = XLSX.utils.aoa_to_sheet(aoa);

  // Áp dụng định dạng gộp ô (merged cells) theo đúng Form
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 12 } }, // Tiêu đề bảng
    { s: { r: 1, c: 0 }, e: { r: 1, c: 12 } }, // Tiêu đề tuần
    { s: { r: 3, c: 0 }, e: { r: 5, c: 0 } }, // Họ tên
    { s: { r: 3, c: 1 }, e: { r: 5, c: 1 } }, // STT
    { s: { r: 3, c: 2 }, e: { r: 5, c: 2 } }, // Nội dung
    { s: { r: 3, c: 3 }, e: { r: 5, c: 3 } }, // Đơn vị phối hợp
    { s: { r: 3, c: 4 }, e: { r: 5, c: 4 } }, // Ý kiến chỉ đạo
    { s: { r: 3, c: 5 }, e: { r: 5, c: 5 } }, // Sản phẩm cuối cùng
    { s: { r: 3, c: 6 }, e: { r: 3, c: 9 } }, // [Group] Tiến độ thực hiện
    { s: { r: 4, c: 6 }, e: { r: 4, c: 7 } }, // [Group] Mốc thời gian
    { s: { r: 4, c: 8 }, e: { r: 5, c: 8 } }, // Công việc đã thực hiện
    { s: { r: 4, c: 9 }, e: { r: 5, c: 9 } }, // Công việc đang thực hiện
    { s: { r: 3, c: 10 }, e: { r: 5, c: 10 } }, // Khó khăn
    { s: { r: 3, c: 11 }, e: { r: 5, c: 11 } }, // Đề xuất
    { s: { r: 3, c: 12 }, e: { r: 5, c: 12 } }  // Ghi chú
  ];

  // Đặt độ rộng cột cho phù hợp
  ws['!cols'] = [
    { wch: 20 }, { wch: 5 }, { wch: 30 }, { wch: 25 }, { wch: 30 }, { wch: 20 },
    { wch: 12 }, { wch: 12 }, { wch: 30 }, { wch: 30 }, { wch: 25 }, { wch: 25 }, { wch: 15 }
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Theo_doi_CV');

  // Rút gọn tên file export
  const safeTitle = weekTitle.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
  XLSX.writeFile(wb, `KiemDem_${safeTitle}.xlsx`);
}

// PDF — Bảng kiểm đếm, theo dõi công việc. Mở cửa sổ in để "Lưu thành PDF" (render bằng trình duyệt, tiếng Việt chuẩn).
// Trình bày như văn bản hành chính: tiêu đề đơn vị, tên bảng, tuần, bảng có khung viền, đầu bảng lặp mỗi trang.
export function exportTrackingPDF(people, weekTitle, unit, period) {
  const esc = (s) => String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\r?\n/g, '<br>');

  let stt = 1;
  const bodyRows = [];
  (people || []).forEach((p) => {
    const trks = (p.trackings || []);
    if (!trks.length) return;
    trks.forEach((t, i) => {
      const nameCell = i === 0
        ? `<td class="name" rowspan="${trks.length}"><b>${esc(p.name) || '(Chưa tên)'}</b>${p.position ? `<div class="pos">${esc(p.position)}</div>` : ''}</td>`
        : '';
      bodyRows.push(`<tr>
        <td class="ctr">${stt++}</td>
        ${nameCell}
        <td>${esc(t.content)}</td>
        <td>${esc(t.coordination)}</td>
        <td>${esc(t.directive)}</td>
        <td>${esc(t.finalProduct)}</td>
        <td class="ctr nowrap">${esc(t.startDate)}</td>
        <td class="ctr nowrap">${esc(t.endDate)}</td>
        <td>${esc(t.doneWork)}</td>
        <td>${esc(t.doingWork)}</td>
        <td>${esc(t.difficulties)}</td>
        <td>${esc(t.proposals)}</td>
        <td>${esc(t.note)}</td>
      </tr>`);
    });
  });
  if (!bodyRows.length) {
    bodyRows.push('<tr><td colspan="13" class="empty">Chưa có dữ liệu công việc trong kỳ này.</td></tr>');
  }

  const root = document.createElement('div');
  root.id = 'trk-pdf-root';
  root.style.cssText = 'position:fixed;left:0;top:0;width:1123px;background:#fff;padding:10px;z-index:1;';
  root.innerHTML = `
  <style>
    #trk-pdf-root, #trk-pdf-root * { box-sizing:border-box; }
    #trk-pdf-root { font-family:'Times New Roman','Be Vietnam Pro',Georgia,serif; color:#111; }
    #trk-pdf-root .doc-head { text-align:center; margin-bottom:10px; }
    #trk-pdf-root .unit { font-weight:bold; text-transform:uppercase; font-size:15px; letter-spacing:.3px; }
    #trk-pdf-root .rule { width:140px; height:2px; background:#111; margin:6px auto 12px; }
    #trk-pdf-root .title { font-weight:bold; font-size:22px; text-transform:uppercase; }
    #trk-pdf-root .week { font-style:italic; font-size:15px; margin-top:4px; }
    #trk-pdf-root table { width:100%; border-collapse:collapse; font-size:12px; table-layout:fixed; }
    #trk-pdf-root th, #trk-pdf-root td { border:1px solid #555; padding:5px 6px; vertical-align:top; text-align:left; word-wrap:break-word; }
    #trk-pdf-root th { background:#e8eef7; font-weight:bold; text-align:center; }
    #trk-pdf-root td.ctr { text-align:center; }
    #trk-pdf-root td.nowrap { white-space:nowrap; }
    #trk-pdf-root td.name { font-size:12px; }
    #trk-pdf-root td.name .pos { font-weight:normal; font-style:italic; color:#444; font-size:10px; margin-top:2px; }
    #trk-pdf-root tbody tr:nth-child(even) td { background:#fafafa; }
    #trk-pdf-root .empty { text-align:center; color:#888; font-style:italic; padding:20px; }
    #trk-pdf-root .sign { margin-top:18px; display:flex; justify-content:flex-end; }
    #trk-pdf-root .sign .box { text-align:center; min-width:300px; }
    #trk-pdf-root .sign .date { font-style:italic; font-size:13px; }
    #trk-pdf-root .sign .role { font-weight:bold; font-size:13px; margin-top:2px; }
    #trk-pdf-root .sign .hint { font-style:italic; font-size:11px; color:#555; }
    #trk-pdf-root .sign .gap { height:64px; }
  </style>
  <div class="doc-head">
    <div class="unit">${esc(unit)}</div>
    <div class="rule"></div>
    <div class="title">Bảng kiểm đếm, theo dõi công việc</div>
    <div class="week">${esc(weekTitle)}</div>
  </div>
  <table>
    <colgroup>
      <col style="width:34px"><col style="width:130px"><col style="width:16%"><col style="width:12%">
      <col style="width:13%"><col style="width:10%"><col style="width:60px"><col style="width:60px">
      <col style="width:12%"><col style="width:12%"><col style="width:11%"><col style="width:11%"><col style="width:8%">
    </colgroup>
    <thead>
      <tr>
        <th rowspan="2">STT</th>
        <th rowspan="2">Họ và tên<br>cán bộ</th>
        <th rowspan="2">Nội dung công việc</th>
        <th rowspan="2">Đơn vị, địa phương<br>chủ trì, phối hợp</th>
        <th rowspan="2">Ý kiến chỉ đạo cụ thể<br>của TT HĐND tỉnh</th>
        <th rowspan="2">Sản phẩm<br>cuối cùng</th>
        <th colspan="4">Tiến độ thực hiện</th>
        <th rowspan="2">Khó khăn, vướng mắc,<br>nội dung làm rõ</th>
        <th rowspan="2">Đề xuất, kiến nghị<br>với TT HĐND tỉnh</th>
        <th rowspan="2">Ghi chú</th>
      </tr>
      <tr>
        <th>Triển khai</th>
        <th>Hoàn thành</th>
        <th>Công việc<br>đã thực hiện</th>
        <th>Công việc<br>đang thực hiện</th>
      </tr>
    </thead>
    <tbody>
      ${bodyRows.join('\n')}
    </tbody>
  </table>
  <div class="sign">
    <div class="box">
      <div class="date">........., ngày ...... tháng ...... năm ${esc(period?.year || '')}</div>
      <div class="role">NGƯỜI LẬP BẢNG</div>
      <div class="hint">(Ký, ghi rõ họ tên)</div>
      <div class="gap"></div>
    </div>
  </div>`;

  // Mở cửa sổ in (trình duyệt tự render -> tiếng Việt chuẩn, không trắng trang). Chọn "Lưu thành PDF" để tải về.
  const win = window.open('', '_blank');
  if (!win) { alert('Trình duyệt đã chặn cửa sổ in/lưu PDF. Hãy cho phép pop-up cho trang này rồi thử lại.'); return; }
  win.document.open();
  win.document.write(`<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>Bảng kiểm đếm, theo dõi công việc</title>
<style>@page{size:A4 landscape;margin:12mm 10mm;} body{margin:0;background:#fff;} #trk-pdf-root{position:static!important;width:auto!important;padding:0!important;}
.toolbar{position:fixed;top:10px;right:12px;display:flex;gap:8px;font-family:system-ui,sans-serif;z-index:9}
.toolbar button{font-size:13px;padding:8px 16px;border:0;border-radius:8px;cursor:pointer}
.toolbar .p{background:#b91c1c;color:#fff}.toolbar .c{background:#e5e7eb;color:#111}
@media print{.toolbar{display:none}}</style></head>
<body><div class="toolbar"><button class="p" onclick="window.print()">⬇ In / Lưu thành PDF</button><button class="c" onclick="window.close()">Đóng</button></div>
<div id="trk-pdf-root">${root.innerHTML}</div>
</body></html>`);
  win.document.close();
}

// PDF — SỔ TAY HƯỚNG DẪN SỬ DỤNG & CÁCH TÍNH ĐIỂM (tài liệu đầy đủ, chi tiết).
// Mở cửa sổ in để người dùng "Lưu thành PDF" (trình duyệt render -> tiếng Việt chuẩn). Trình bày như văn bản hành chính A4 dọc.
export function exportGuidePDF(unit, catalogGroups = []) {
  const e = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const now = new Date();
  const dateStr = `ngày ${String(now.getDate()).padStart(2, '0')} tháng ${String(now.getMonth() + 1).padStart(2, '0')} năm ${now.getFullYear()}`;
  // Bảng liệt kê đầy đủ danh mục công việc (theo nhóm) — dữ liệu truyền từ App (catalogForGuide()).
  const catalogRows = (catalogGroups || []).map((g) => `
    <tr><td colspan="6" class="cat-group">${e(g.group)}</td></tr>
    ${(g.items || []).map((it) => `<tr>
      <td class="mono nowrap">${e(it.id)}</td>
      <td>${e(it.name)}</td>
      <td class="muted">${e(it.output)}</td>
      <td class="ctr nowrap">${e(it.level)}</td>
      <td class="ctr">${e(it.maxScore)}</td>
      <td class="ctr nowrap">${e(it.mau) || '—'}</td>
    </tr>`).join('')}
  `).join('');
  const catalogCount = (catalogGroups || []).reduce((s, g) => s + (g.items || []).length, 0);

  const html = `
  <div class="doc">
    <!-- TRANG BÌA -->
    <section class="cover">
      <div class="unit">${e(unit)}</div>
      <div class="rule"></div>
      <div class="cover-spacer"></div>
      <div class="cover-kicker">TÀI LIỆU HƯỚNG DẪN SỬ DỤNG</div>
      <h1 class="cover-title">SỔ TAY HƯỚNG DẪN<br>ĐÁNH GIÁ, XẾP LOẠI CÁN BỘ, CÔNG CHỨC<br>HẰNG THÁNG THEO OKR/KPI</h1>
      <div class="cover-sub">Hệ thống đánh giá trực tuyến — áp dụng Quyết định số 1053-QĐ/TU<br>ngày 05/6/2026 của Ban Thường vụ Tỉnh ủy Thanh Hóa</div>
      <div class="cover-spacer"></div>
      <div class="cover-meta">Tài liệu lập ${dateStr}</div>
      <div class="cover-note">⚠ BẢN DEMO THỬ NGHIỆM — sử dụng nội bộ, không chịu trách nhiệm về tính pháp lý và dữ liệu.</div>
    </section>

    <!-- MỤC LỤC -->
    <section class="page">
      <h2>MỤC LỤC</h2>
      <ol class="toc">
        <li>Giới thiệu chung & phạm vi áp dụng</li>
        <li>Năm khu vực (tab) của hệ thống</li>
        <li>Thang điểm tổng — 100 điểm</li>
        <li>Nhóm I — Tiêu chí chung (tối đa 30 điểm)</li>
        <li>Nhóm II — Kết quả thực hiện nhiệm vụ (tối đa 70 điểm)</li>
        <li>Hệ số công việc (cấp độ N1–N5)</li>
        <li>Bốn mức xếp loại & điều kiện định lượng (Điều 8)</li>
        <li>Phân biệt "bị kỷ luật" và "điểm trừ"</li>
        <li>Quy trình hai cấp & mốc thời gian</li>
        <li>Phê duyệt & xuất phiếu đánh giá (Word)</li>
        <li>Tab Theo dõi công việc: đồng bộ, thu thập KPI, xuất bảng</li>
        <li>Đăng nhập & phân quyền</li>
        <li>Lưu dữ liệu theo kỳ</li>
        <li>Câu hỏi thường gặp (FAQ)</li>
      </ol>
      <p style="margin-top:8px;font-size:13.5px;"><b>Phụ lục A.</b> Danh mục công việc Nhóm II (đầy đủ) &nbsp;·&nbsp; <b>Phụ lục B.</b> Ví dụ tính điểm xuyên suốt &nbsp;<span class="muted">(đặt giữa mục 6 và mục 7)</span></p>
    </section>

    <!-- NỘI DUNG -->
    <section class="page">
      <h2>1. Giới thiệu chung & phạm vi áp dụng</h2>
      <p>Hệ thống hỗ trợ <b>đánh giá, xếp loại mức độ hoàn thành nhiệm vụ hằng tháng</b> của cán bộ, công chức, viên chức và người lao động theo phương pháp <b>OKR/KPI</b>, bảo đảm khách quan, định lượng và minh bạch. Toàn bộ bộ tiêu chí, công thức và điều kiện xếp loại được xây dựng theo <b>Quyết định số 1053-QĐ/TU ngày 05/6/2026</b> của Ban Thường vụ Tỉnh ủy Thanh Hóa.</p>
      <p>Tài liệu này hướng dẫn người dùng ở mọi vai trò (cán bộ tự đánh giá, trưởng phòng/cấp duyệt, quản trị) cách nhập liệu, hiểu cách hệ thống tính điểm và xuất báo cáo.</p>
      <div class="box gray"><b>Đối tượng đánh giá</b> chia thành 5 nhóm, đánh số theo Mẫu 01–05 (xem mục 4).</div>

      <h2>2. Năm khu vực (tab) của hệ thống</h2>
      <table class="tbl">
        <tr><th style="width:24%">Khu vực</th><th>Chức năng chính</th></tr>
        <tr><td><b>Tổng quan</b></td><td>Mục tiêu OKR cấp đơn vị, phân bố xếp loại, bảng tổng hợp kết quả (Mẫu 1A), so sánh theo phòng/ban và xu hướng theo kỳ.</td></tr>
        <tr><td><b>Đánh giá</b></td><td>Chấm điểm từng cán bộ: Nhóm I (tiêu chí chung) và Nhóm II (kết quả nhiệm vụ); phê duyệt và xuất phiếu.</td></tr>
        <tr><td><b>Năng lực số</b></td><td>Tự đánh giá khung năng lực số (chỉ số phụ trợ, không cộng vào điểm tháng).</td></tr>
        <tr><td><b>Theo dõi CV</b></td><td>Bảng kiểm đếm công việc theo tuần; đồng bộ từ Google Sheet; thu thập thành nhiệm vụ KPI; xuất bảng PDF.</td></tr>
        <tr><td><b>Hỗ trợ</b></td><td>Thông tin liên hệ, gửi ý kiến và tài liệu hướng dẫn này.</td></tr>
      </table>

      <h2>3. Thang điểm tổng — 100 điểm</h2>
      <div class="formula">TỔNG ĐIỂM = Nhóm I (tối đa 30) + Nhóm II (tối đa 70) − Điểm trừ</div>
      <p>Mỗi cán bộ được chấm ở <b>hai cấp</b>: <b>Tự đánh giá</b> (cá nhân tự chấm) và <b>Cấp có thẩm quyền</b> (cấp duyệt quyết định). <b>Điểm xếp loại chính thức lấy theo cột Cấp duyệt.</b> Cán bộ mới khởi tạo mặc định 100/100, việc đánh giá là trừ dần theo thực tế.</p>
    </section>

    <section class="page">
      <h2>4. Nhóm I — Tiêu chí chung (tối đa 30 điểm)</h2>
      <p>Đánh giá phẩm chất chính trị, tư tưởng, đạo đức, ý thức kỷ luật, năng lực, tác phong... theo bộ tiêu chí của từng nhóm đối tượng. Mỗi tiêu chí có điểm tối đa riêng; cộng tất cả tiêu chí và <b>giới hạn không quá 30 điểm</b>.</p>
      <table class="tbl">
        <tr><th style="width:14%">Mẫu</th><th style="width:40%">Nhóm đối tượng</th><th>Cấu trúc điểm Nhóm I</th></tr>
        <tr><td><b>Mẫu 01</b></td><td>Đại biểu HĐND tỉnh hoạt động chuyên trách</td><td>Dùng chung bộ tiêu chí nhóm lãnh đạo; Nhóm II tính theo chức vụ.</td></tr>
        <tr><td><b>Mẫu 02</b></td><td>Đại biểu Quốc hội hoạt động chuyên trách</td><td>Tương tự Mẫu 01.</td></tr>
        <tr><td><b>Mẫu 03</b></td><td>Cán bộ giữ chức vụ lãnh đạo, quản lý (Phụ lục 03)</td><td>Chính trị, tư tưởng (5) + đạo đức, kỷ luật (5) + năng lực lãnh đạo–chuyên môn–thực thi–tác phong–đổi mới–chuyển đổi số (16) + tín nhiệm, đoàn kết (2) + tự phê bình (2).</td></tr>
        <tr><td><b>Mẫu 04</b></td><td>Công chức, viên chức không giữ chức vụ lãnh đạo (Phụ lục 01)</td><td>Chính trị, tư tưởng (5) + đạo đức, kỷ luật (5) + năng lực chuyên môn–thực thi–tác phong–đổi mới–chuyển đổi số (16) + tự phê bình và phê bình (4).</td></tr>
        <tr><td><b>Mẫu 05</b></td><td>Lao động hợp đồng hỗ trợ, phục vụ (Phụ lục 02)</td><td>Chính trị, đạo đức, kỷ luật (15) + năng lực chuyên môn, thực thi (10) + tự phê bình (5).</td></tr>
      </table>
      <div class="box gray">Nhập điểm ở hai cột <b>Tự ĐG</b> và <b>Cấp duyệt</b>; mỗi ô không vượt quá điểm tối đa của tiêu chí. Hệ thống lấy cột <b>Cấp duyệt</b> để xếp loại chính thức.</div>

      <h2>5. Nhóm II — Kết quả thực hiện nhiệm vụ (tối đa 70 điểm)</h2>
      <p>Chấm bằng <b>đếm khách quan</b>, không cảm tính. Mỗi nhiệm vụ được chọn từ <b>danh mục công việc</b> (đã gán sẵn <b>hệ số</b> theo cấp độ), rồi nhập 4 con số: <b>Số lượng giao</b>, <b>Số lượng hoàn thành</b>, <b>Lỗi chất lượng</b>, <b>Số lần chậm tiến độ</b>.</p>
      <p>Hệ thống tự tính 3 tỷ lệ (bình quân theo hệ số của tất cả nhiệm vụ):</p>
      <table class="tbl">
        <tr><th style="width:18%">Tỷ lệ</th><th>Công thức</th></tr>
        <tr><td><b>a — Khối lượng</b></td><td>Σ(Hoàn thành × hệ số) ÷ Σ(Giao × hệ số) × 100%</td></tr>
        <tr><td><b>b — Chất lượng</b></td><td>Bình quân [1 − 0,25 × số Lỗi chất lượng] theo hệ số × 100% &nbsp;<i>(mỗi lỗi −25%)</i></td></tr>
        <tr><td><b>c — Tiến độ</b></td><td>Bình quân [1 − 0,25 × số lần Chậm] theo hệ số × 100% &nbsp;<i>(mỗi lần chậm −25%)</i></td></tr>
      </table>
      <div class="formula">Điểm Nhóm II = (a + b + c) ÷ 3 × 70% &nbsp;<span class="muted">(công chức, viên chức, lao động hợp đồng)</span></div>

      <div class="box red">
        <p class="bt">Với cán bộ giữ chức vụ lãnh đạo, quản lý (Điều 7)</p>
        <p>Điểm kết quả = <b>(a + b + c + d + đ + e) ÷ 6</b>, bổ sung 3 thành phần (mỗi mục 100% hoặc 50%):</p>
        <ul>
          <li><b>d — Kết quả lĩnh vực/đơn vị phụ trách:</b> 100% nếu 100% cán bộ dưới quyền đạt "Hoàn thành nhiệm vụ" trở lên; 50% nếu có người không hoàn thành.</li>
          <li><b>đ — Khả năng tổ chức triển khai nhiệm vụ:</b> 100% nếu hoàn thành đúng hạn, có sáng kiến; 50% nếu chậm trễ kéo dài.</li>
          <li><b>e — Năng lực tập hợp, đoàn kết:</b> 100% nếu đoàn kết; 50% nếu có mâu thuẫn, mất đoàn kết nội bộ kéo dài.</li>
        </ul>
        <p class="muted">Hệ thống tự nhận biết lãnh đạo theo <b>chức vụ</b> và hiển thị ô nhập d/đ/e ngay trong tab Đánh giá.</p>
      </div>

      <div class="box amber">
        <p class="bt">Ví dụ tính cụ thể</p>
        <p>• Nhiệm vụ 1 (hệ số 300): Giao 4, Hoàn thành 4, Lỗi 0, Chậm 1.<br>• Nhiệm vụ 2 (hệ số 100): Giao 10, Hoàn thành 8, Lỗi 1, Chậm 0.</p>
        <p class="mono">
          a = (4×300 + 8×100) ÷ (4×300 + 10×100) × 100 = 2000 ÷ 2200 = <b>90,9%</b><br>
          b = (1200×1 + 800×0,75) ÷ 2000 × 100 = 1800 ÷ 2000 = <b>90,0%</b><br>
          c = (1200×0,75 + 800×1) ÷ 2000 × 100 = 1700 ÷ 2000 = <b>85,0%</b><br>
          Trung bình = (90,9 + 90,0 + 85,0) ÷ 3 = <b>88,6%</b><br>
          Nhóm II = 88,6% × 70% ≈ <b>62,0 / 70 điểm</b>
        </p>
      </div>

      <div class="box gray">
        <p class="bt">Ba điểm cần hiểu đúng về công thức</p>
        <p>① <b>Hệ số được nhân với SỐ LƯỢNG.</b> Trọng số mỗi nhiệm vụ = hệ số × số lượng giao; do đó 10 đầu việc N1 (10×100=1000) có thể "nặng" hơn 1 việc N4 (1×400=400). Hãy nhập số lượng đúng thực tế.</p>
        <p>② <b>Chất lượng (b) và Tiến độ (c) chỉ tính trên phần ĐÃ hoàn thành.</b> Một nhiệm vụ hoàn thành 0 sẽ không tham gia vào b, c (chưa có sản phẩm để soi); phần chưa làm đã bị phạt ở tỷ lệ Khối lượng (a). Đặc biệt, nếu TẤT CẢ nhiệm vụ đều hoàn thành 0 thì b, c mặc định 100%, nên điểm vẫn ra (0+100+100)/3 = 66,7% → ~46,7/70 — đây là lý do điểm số đôi khi cao nhưng vẫn bị xếp loại thấp theo Điều 8 (mục 7).</p>
        <p>③ <b>"Vượt mức" = hoàn thành nhiều hơn số giao</b> (giao 4 làm 6). Tỷ lệ a bị chặn tối đa 100% nên vượt mức không cộng thêm điểm, nhưng là điều kiện bắt buộc để đạt loại A.</p>
      </div>

      <h2>6. Hệ số công việc (cấp độ N1–N5)</h2>
      <p>Hệ số phản ánh độ phức tạp/cấp độ của công việc; việc khó hơn có hệ số cao hơn nên đóng góp nhiều hơn vào điểm — bảo đảm công bằng giữa việc khó và việc đơn giản.</p>
      <table class="tbl">
        <tr><th>Cấp độ</th><th>N1</th><th>N2</th><th>N3</th><th>N4</th><th>N5</th><th>Hỗ trợ</th></tr>
        <tr><td><b>Hệ số</b></td><td>100</td><td>200</td><td>300</td><td>400</td><td>500</td><td>0 (đếm ngang nhau)</td></tr>
      </table>
      <p class="muted">Quản trị có thể thêm/bớt/sửa danh mục công việc và gán theo Nhóm đối tượng tại tab <b>Danh mục</b>.</p>
    </section>

    <section class="page">
      <h2>Phụ lục A. Danh mục công việc Nhóm II (đầy đủ — ${catalogCount} mục)</h2>
      <p>Mỗi nhiệm vụ Nhóm II được chọn từ danh mục dưới đây (đã gán sẵn cấp độ → hệ số và nhóm đối tượng áp dụng theo Mẫu 01–05). Cột <b>Mẫu</b>: 01 = ĐB HĐND · 02 = ĐB Quốc hội · 03 = lãnh đạo · 04 = công chức · 05 = lao động hợp đồng.</p>
      <table class="tbl cat">
        <thead><tr><th style="width:10%">Mã</th><th style="width:30%">Tên công việc</th><th>Sản phẩm đầu ra (minh chứng)</th><th style="width:8%">Cấp độ</th><th style="width:7%">Hệ số</th><th style="width:9%">Mẫu</th></tr></thead>
        <tbody>${catalogRows}</tbody>
      </table>
    </section>

    <section class="page">
      <h2>Phụ lục B. Ví dụ tính điểm xuyên suốt (từ nhiệm vụ đến xếp loại)</h2>
      <p>Áp dụng đúng công thức tổng quát ở mục 5. Theo dõi từng bước để hiểu một con số cuối cùng được hình thành như thế nào.</p>

      <div class="box" style="background:#eef6fb;border:1px solid #b9d9ee;">
        <p class="bt">VÍ DỤ 1 — Công chức (Mẫu 04), công thức (a+b+c)/3</p>
        <p>Ông A có 3 nhiệm vụ trong tháng:</p>
        <table class="tbl">
          <tr><th>Nhiệm vụ</th><th>Hệ số</th><th>Giao</th><th>Hoàn thành</th><th>Lỗi CL</th><th>Chậm</th></tr>
          <tr><td>NV1 — Tham mưu xây dựng kỳ họp (II.B.11)</td><td class="ctr">400</td><td class="ctr">2</td><td class="ctr">2</td><td class="ctr">0</td><td class="ctr">1</td></tr>
          <tr><td>NV2 — Soạn thảo văn bản (II.A.1)</td><td class="ctr">100</td><td class="ctr">10</td><td class="ctr">9</td><td class="ctr">1</td><td class="ctr">0</td></tr>
          <tr><td>NV3 — Báo cáo dân nguyện (II.B.23)</td><td class="ctr">300</td><td class="ctr">1</td><td class="ctr">1</td><td class="ctr">0</td><td class="ctr">0</td></tr>
        </table>
        <p class="mono">
          Trọng số giao = 2×400 + 10×100 + 1×300 = 800 + 1000 + 300 = <b>2.100</b><br>
          Trọng số hoàn thành = 2×400 + 9×100 + 1×300 = 800 + 900 + 300 = <b>2.000</b><br>
          a (Khối lượng) = 2.000 ÷ 2.100 × 100 = <b>95,2%</b><br>
          b (Chất lượng) = [800×1 + 900×0,75 + 300×1] ÷ 2.000 = (800 + 675 + 300) ÷ 2.000 = 1.775 ÷ 2.000 = <b>88,8%</b><br>
          c (Tiến độ) = [800×0,75 + 900×1 + 300×1] ÷ 2.000 = (600 + 900 + 300) ÷ 2.000 = 1.800 ÷ 2.000 = <b>90,0%</b><br>
          Điểm KQ = (95,2 + 88,8 + 90,0) ÷ 3 = <b>91,3%</b><br>
          Nhóm II = 91,3% × 70% = <b>63,9 / 70</b>
        </p>
        <p>Giả sử <b>Nhóm I = 27,5/30</b>, không có điểm trừ → <b>TỔNG = 27,5 + 63,9 = 91,4 điểm</b> (ngưỡng ≥90 = mức A).</p>
        <p style="background:#fff;border:1px solid #f3d588;border-radius:6px;padding:8px 10px;"><b>Kiểm điều kiện Điều 8:</b> đạt ≥90 điểm, nhưng để xếp <b>A</b> cần 100% nhiệm vụ đạt đủ số lượng và ≥30% nhiệm vụ vượt mức. Ở đây NV2 mới đạt 9/10 (90%) và không nhiệm vụ nào vượt mức → hệ thống <b>hạ xuống loại B — Hoàn thành tốt</b>. (Điển hình "điểm cao nhưng chưa đủ điều kiện mức A".)</p>
      </div>

      <div class="box red">
        <p class="bt">VÍ DỤ 2 — Lãnh đạo, quản lý (Mẫu 03), công thức (a+b+c+d+đ+e)/6</p>
        <p>Giả sử phần nhiệm vụ cho ra <b>a = 96%, b = 95%, c = 94%</b>. Ba thành phần lãnh đạo: <b>d = 100%</b> (mọi cán bộ dưới quyền đều hoàn thành), <b>đ = 50%</b> (một số việc triển khai còn chậm), <b>e = 100%</b> (đoàn kết tốt).</p>
        <p class="mono">
          Điểm KQ = (96 + 95 + 94 + 100 + 50 + 100) ÷ 6 = 535 ÷ 6 = <b>89,2%</b><br>
          Nhóm II = 89,2% × 70% = <b>62,4 / 70</b>. Nếu Nhóm I = 28/30 → TỔNG = <b>90,4 điểm</b>.
        </p>
        <p class="muted">Chỉ cần một thành phần lãnh đạo bị 50% cũng kéo điểm KQ xuống đáng kể (mỗi thành phần chiếm 1/6).</p>
      </div>

      <div class="box gray">
        <p class="bt">Vài tình huống ngắn (cùng công thức)</p>
        <ul>
          <li><b>Vượt mức:</b> giao 4, hoàn thành 6 → a = 150% nhưng bị chặn còn 100%; đổi lại nhiệm vụ này được tính "vượt mức" phục vụ điều kiện loại A.</li>
          <li><b>Một nhiệm vụ hoàn thành 0:</b> giao 5, hoàn thành 0 → a = 0%; nhiệm vụ này không tham gia b, c. Bị tính "không hoàn thành" (đạt &lt; 50%) trong điều kiện Điều 8.</li>
          <li><b>Hoàn thành 50–99%:</b> giao 10, hoàn thành 7 (70%) → vẫn tính là đã hoàn thành; chỉ giảm điểm a và làm mất điều kiện mức A.</li>
          <li><b>Chậm tiến độ 2 lần:</b> c của nhiệm vụ = 1 − 0,25×2 = 50% trên phần hoàn thành.</li>
          <li><b>Bị kỷ luật:</b> tích ô "bị xử lý kỷ luật" → xếp thẳng loại D bất kể điểm, nhưng KHÔNG trừ điểm (tổng điểm giữ nguyên) → xuất hiện cảnh báo "chênh lệch điểm số và xếp loại".</li>
        </ul>
      </div>
    </section>

    <section class="page">
      <h2>7. Bốn mức xếp loại & điều kiện định lượng (Điều 8)</h2>
      <table class="tbl">
        <tr><th style="width:10%">Mức</th><th style="width:30%">Xếp loại</th><th>Ngưỡng điểm (cột Cấp duyệt)</th></tr>
        <tr><td><b>A</b></td><td>Hoàn thành xuất sắc nhiệm vụ</td><td>≥ 90 điểm</td></tr>
        <tr><td><b>B</b></td><td>Hoàn thành tốt nhiệm vụ</td><td>70 → dưới 90 điểm</td></tr>
        <tr><td><b>C</b></td><td>Hoàn thành nhiệm vụ</td><td>50 → dưới 70 điểm</td></tr>
        <tr><td><b>D</b></td><td>Không hoàn thành nhiệm vụ</td><td>dưới 50 điểm</td></tr>
      </table>
      <div class="box gray">
        <p class="bt">Cách tính "hoàn thành" — xét theo TỪNG nhiệm vụ</p>
        <p>Mỗi nhiệm vụ có tỷ lệ = Số lượng hoàn thành ÷ Số lượng giao. Một nhiệm vụ chỉ bị coi là <b>"không hoàn thành" khi đạt dưới 50%</b> số lượng giao; đạt từ 50% đến dưới 100% vẫn tính là <b>đã hoàn thành</b> (chỉ phần thiếu làm giảm điểm và ảnh hưởng tới mức Xuất sắc).</p>
      </div>
      <p>Ngoài ngưỡng điểm, hệ thống tự áp dụng các điều kiện định lượng của Điều 8:</p>
      <ul>
        <li><b>Hoàn thành xuất sắc (A):</b> ngoài ≥ 90 điểm, mọi nhiệm vụ phải <b>đạt đủ 100% số lượng</b> và có <b>≥ 30% số nhiệm vụ vượt mức</b> (hoàn thành &gt; giao). Chưa đủ thì hạ xuống Hoàn thành tốt.</li>
        <li><b>Hoàn thành tốt (B):</b> 70–89 điểm và <b>không có nhiệm vụ nào không hoàn thành</b> (mọi nhiệm vụ đạt ≥ 50% số lượng); nếu có nhiệm vụ đạt dưới 50% thì hạ xuống Hoàn thành nhiệm vụ.</li>
        <li><b>Hoàn thành nhiệm vụ (C):</b> 50–69 điểm; số nhiệm vụ chậm tiến độ không quá 20% (hệ thống nhắc khi vượt).</li>
        <li><b>Không hoàn thành (D):</b> dưới 50 điểm; hoặc bị <b>kỷ luật/kết luận suy thoái</b>; hoặc <b>trên 50% số nhiệm vụ không hoàn thành</b> (mỗi nhiệm vụ đạt dưới 50% số lượng) — riêng <b>lãnh đạo</b> là trên 30% (đơn vị phụ trách hoàn thành dưới 70% nhiệm vụ).</li>
      </ul>
      <div class="box gray"><b>Trần xuất sắc:</b> số người loại A không vượt quá <b>20%</b> số người loại B. Hệ thống cảnh báo ở tab Tổng quan khi vượt trần — tránh cào bằng, giữ tính phân loại thực chất.</div>
      <p class="muted">Khi mức xếp loại bị điều chỉnh, hệ thống hiển thị <b>lý do</b> và bảng <b>"Điều kiện xếp loại (Điều 8)"</b> ngay trong tab Đánh giá để cán bộ tự đối chiếu.</p>
      <div class="box" style="background:#fdecec;border:1px solid #f3b5b5;"><b>Cảnh báo chênh lệch điểm số và xếp loại:</b> nếu tổng điểm tương ứng một mức cao hơn nhưng điều kiện Điều 8 bắt hạ mức (ví dụ điểm ~70 nhưng bị xếp D do trên 50% nhiệm vụ không hoàn thành, hoặc bị kỷ luật), hệ thống hiện ô cảnh báo màu đỏ ngay dưới mức xếp loại để giải thích — tránh hiểu nhầm "điểm cao sao lại loại thấp". Điểm số phản ánh khối lượng/chất lượng; xếp loại phản ánh mức độ hoàn thành theo quy định.</div>

      <h2>8. Phân biệt "bị kỷ luật" và "điểm trừ"</h2>
      <table class="tbl">
        <tr><th style="width:26%">Cơ chế</th><th>Tác động</th></tr>
        <tr><td><b>Tích "bị xử lý kỷ luật"</b></td><td><b>Chỉ chốt mức xếp loại = Không hoàn thành nhiệm vụ</b> (điều kiện loại trừ theo Điều 8.4). <b>KHÔNG trừ vào tổng điểm</b> — tổng điểm vẫn phản ánh khối lượng, chất lượng công việc đã làm.</td></tr>
        <tr><td><b>Ô "Điểm trừ"</b></td><td>Trừ <b>trực tiếp vào tổng điểm</b> theo mức độ vi phạm (do cấp duyệt nhập).</td></tr>
      </table>

      <h2>9. Quy trình hai cấp & mốc thời gian</h2>
      <ol>
        <li>Đầu tháng: cơ quan xây dựng <b>kế hoạch công tác tháng</b>; cán bộ lập <b>lịch công tác tuần</b> làm cơ sở kiểm đếm.</li>
        <li>Trước ngày <b>25</b>: cán bộ tự đánh giá, nhận mức xếp loại (cột Tự ĐG).</li>
        <li>Trước ngày <b>26</b>: cấp trên trực tiếp cho ý kiến nhận xét.</li>
        <li>Trước ngày <b>28</b>: cấp có thẩm quyền quyết định xếp loại (cột Cấp duyệt) và <b>phê duyệt</b>.</li>
        <li>Trước ngày <b>05 tháng sau</b>: công khai kết quả, biểu dương, khen thưởng.</li>
      </ol>
      <p>Đánh giá thực hiện <b>theo tháng</b>; riêng <b>tháng 12</b> hoàn thành trước <b>ngày 15/12</b> (trước khi xếp loại đảng viên và bình xét thi đua năm). Kết quả hằng tháng là căn cứ xếp loại quý/năm và đảng viên (Điều 10, 11 QĐ 1053).</p>
    </section>

    <section class="page">
      <h2>10. Phê duyệt & xuất phiếu đánh giá (Word)</h2>
      <p>Sau khi hoàn tất chấm điểm, <b>cấp có thẩm quyền</b> (trưởng phòng/quản trị) bấm <b>"Phê duyệt & xuất phiếu"</b> trong tab Đánh giá. Hệ thống ghi nhận người phê duyệt và ngày phê duyệt, đồng thời tải về <b>phiếu Word đầy đủ</b> gồm:</p>
      <ul>
        <li>Thông tin cán bộ và nhóm đối tượng (Mẫu 01–05).</li>
        <li><b>Bảng Nhóm I</b>: liệt kê từng tiêu chí kèm điểm tối đa, Tự ĐG và Cấp duyệt.</li>
        <li><b>Bảng Nhóm II</b>: từng nhiệm vụ với số lượng giao/hoàn thành, lỗi chất lượng, trễ hạn, tỷ lệ và điểm %.</li>
        <li>Thành phần lãnh đạo d/đ/e (nếu có), bảng tổng hợp điểm và xếp loại A–D, căn cứ Điều 8.</li>
        <li>Nhận xét cá nhân/cấp duyệt, trạng thái phê duyệt và hai khối chữ ký.</li>
      </ul>
      <div class="box gray">Nếu sửa lại bất kỳ điểm nào sau khi phê duyệt, hệ thống <b>tự gỡ trạng thái phê duyệt</b> để tránh dấu "đã duyệt" trên dữ liệu đã thay đổi — cần phê duyệt lại.</div>

      <h2>11. Tab Theo dõi công việc: đồng bộ, thu thập KPI, xuất bảng</h2>
      <ul>
        <li><b>Đồng bộ từ Google Sheet</b> (quản trị): nạp dữ liệu kiểm đếm mới nhất thành các dòng theo dõi có thể sửa; khớp cán bộ theo tên; bấm lại sẽ cập nhật, không nhân đôi.</li>
        <li><b>Thu thập vào đánh giá KPI</b>: ở mỗi công việc chọn Danh mục + OKR + "Đã hoàn thành?", Lỗi chất lượng, Chậm tiến độ; bấm nút để tạo/cập nhật nhiệm vụ Nhóm II tương ứng.</li>
        <li><b>Xuất bảng (PDF)</b>: mở bảng theo mẫu hành chính (A4 ngang); bấm "In / Lưu thành PDF" để lưu hoặc in giấy.</li>
      </ul>

      <h2>12. Đăng nhập & phân quyền</h2>
      <p>Đăng nhập bằng <b>email + mật khẩu</b>. Lần đầu: nhận liên kết kích hoạt qua email, nhập Họ tên, Chức vụ và tạo mật khẩu.</p>
      <table class="tbl">
        <tr><th style="width:24%">Vai trò</th><th>Quyền</th></tr>
        <tr><td><b>Cán bộ</b></td><td>Xem và tự đánh giá (cột Tự ĐG) phần của chính mình.</td></tr>
        <tr><td><b>Trưởng phòng</b></td><td>Thêm quyền duyệt (cột Cấp duyệt) và phê duyệt cho cán bộ cùng phòng.</td></tr>
        <tr><td><b>Quản trị</b></td><td>Toàn quyền: thêm/xóa cán bộ, đặt vai trò, sửa mục tiêu, quản lý danh mục, đồng bộ Google Sheet, mọi kỳ.</td></tr>
        <tr><td><b>Khách (Dùng thử)</b></td><td>Nhập thử điểm để xem cách tính, nhưng <b>không lưu</b> (mất khi tải lại trang).</td></tr>
      </table>

      <h2>13. Lưu dữ liệu theo kỳ</h2>
      <p>Dữ liệu được lưu <b>riêng theo từng tháng/năm</b>. Đổi tháng ở góc trên để xem lại kỳ trước hoặc nhập kỳ mới (có thể sao chép danh sách cán bộ từ kỳ gần nhất). Hệ thống lưu ngầm lên máy chủ và cảnh báo nếu phát hiện người khác vừa sửa cùng kỳ (tránh ghi đè mất dữ liệu).</p>

      <h2>14. Câu hỏi thường gặp (FAQ)</h2>
      <p class="q">Hỏi: Tôi hoàn thành 9/10 số lượng một nhiệm vụ, có bị xếp "không hoàn thành" không?</p>
      <p class="a">Đáp: Không. Đạt 90% (≥ 50%) vẫn tính là đã hoàn thành; chỉ phần thiếu làm giảm điểm và ảnh hưởng điều kiện đạt mức Xuất sắc.</p>
      <p class="q">Hỏi: Vì sao điểm một tiêu chí Nhóm I hiển thị thấp hơn số tôi từng nhập?</p>
      <p class="a">Đáp: Mỗi ô điểm bị giới hạn theo điểm tối đa của tiêu chí. Nếu bộ tiêu chí được cập nhật và điểm tối đa giảm, hệ thống tự kẹp giá trị cũ về đúng trần mới.</p>
      <p class="q">Hỏi: Tích "bị kỷ luật" có làm mất điểm đã chấm không?</p>
      <p class="a">Đáp: Không. Nó chỉ chốt mức xếp loại Không hoàn thành nhiệm vụ; muốn trừ điểm cụ thể hãy dùng ô "Điểm trừ".</p>
      <p class="q">Hỏi: Tôi là khách dùng thử, dữ liệu có được lưu không?</p>
      <p class="a">Đáp: Không. Tài khoản khách chỉ để trải nghiệm cách tính; dữ liệu mất khi tải lại trang.</p>

      <div class="signoff">
        <p>Tài liệu hỗ trợ quản trị nội bộ • OKR/KPI & Khung năng lực số.</p>
        <p>Mọi góp ý xin gửi về bộ phận quản trị hệ thống của đơn vị.</p>
      </div>
    </section>
  </div>`;

  const win = window.open('', '_blank');
  if (!win) { alert('Trình duyệt đã chặn cửa sổ in/lưu PDF. Hãy cho phép pop-up cho trang này rồi thử lại.'); return; }
  win.document.open();
  win.document.write(`<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>Sổ tay hướng dẫn sử dụng</title>
<style>
  @page{ size:A4 portrait; margin:18mm 16mm; }
  *{ box-sizing:border-box; }
  body{ margin:0; background:#fff; color:#1a1a1a; font-family:'Times New Roman','Be Vietnam Pro',Georgia,serif; font-size:13.5px; line-height:1.55; }
  .doc{ max-width:780px; margin:0 auto; padding:16px; }
  .toolbar{ position:fixed; top:10px; right:12px; display:flex; gap:8px; font-family:system-ui,sans-serif; z-index:9; }
  .toolbar button{ font-size:13px; padding:8px 16px; border:0; border-radius:8px; cursor:pointer; }
  .toolbar .p{ background:#b91c1c; color:#fff; } .toolbar .c{ background:#e5e7eb; color:#111; }
  h2{ font-size:16px; color:#b91c1c; border-bottom:2px solid #f1d4d4; padding-bottom:4px; margin:20px 0 8px; }
  p{ margin:6px 0; text-align:justify; }
  ul,ol{ margin:6px 0; padding-left:22px; } li{ margin:3px 0; text-align:justify; }
  .muted{ color:#555; font-size:12.5px; } .bt{ font-weight:bold; margin-bottom:4px; }
  .mono{ font-family:'Consolas','Courier New',monospace; font-size:12.5px; line-height:1.7; }
  .formula{ background:#fef3c7; border:1px solid #f6c945; border-radius:8px; padding:10px 12px; font-weight:bold; text-align:center; margin:10px 0; }
  .box{ border-radius:8px; padding:10px 12px; margin:10px 0; }
  .box.gray{ background:#f5f6f8; border:1px solid #d9dde3; }
  .box.red{ background:#fdecec; border:1px solid #f3b5b5; }
  .box.amber{ background:#fff7e6; border:1px solid #f3d588; }
  .box ul{ margin:4px 0; }
  table.tbl{ width:100%; border-collapse:collapse; margin:10px 0; font-size:12.8px; }
  table.tbl th, table.tbl td{ border:1px solid #999; padding:6px 8px; vertical-align:top; text-align:left; }
  table.tbl th{ background:#e8eef7; font-weight:bold; }
  table.tbl td.ctr, table.tbl th.ctr{ text-align:center; }
  .mono.nowrap, .nowrap{ white-space:nowrap; }
  /* Bảng danh mục (Phụ lục A) */
  table.cat{ font-size:11px; } table.cat td, table.cat th{ padding:4px 6px; }
  table.cat .mono{ font-family:'Consolas','Courier New',monospace; color:#555; }
  table.cat td.muted{ color:#666; }
  td.cat-group{ background:#f3f4f6; font-weight:bold; color:#b91c1c; }
  .q{ font-weight:bold; color:#1f2937; margin-top:10px; } .a{ margin-top:2px; }
  .toc{ font-size:14px; line-height:2; }
  /* Trang bìa */
  .cover{ text-align:center; min-height:240mm; display:flex; flex-direction:column; align-items:center; }
  .cover .unit{ font-weight:bold; text-transform:uppercase; font-size:15px; letter-spacing:.3px; margin-top:8mm; }
  .cover .rule{ width:150px; height:2px; background:#111; margin:8px auto 0; }
  .cover-spacer{ flex:1; } .cover-kicker{ letter-spacing:2px; color:#b91c1c; font-weight:bold; font-size:14px; }
  .cover-title{ font-size:26px; line-height:1.4; margin:14px 0; }
  .cover-sub{ font-style:italic; font-size:14px; color:#333; }
  .cover-meta{ font-style:italic; font-size:13px; margin-bottom:10px; }
  .cover-note{ color:#b45309; font-weight:bold; font-size:12.5px; border:1px dashed #d9a441; border-radius:8px; padding:8px 12px; background:#fffbeb; }
  .signoff{ margin-top:22px; padding-top:10px; border-top:1px solid #ddd; text-align:center; font-style:italic; color:#444; font-size:12.5px; }
  section.page{ page-break-before:always; }
  @media print{ .toolbar{ display:none; } .doc{ padding:0; } }
</style></head>
<body>
  <div class="toolbar"><button class="p" onclick="window.print()">⬇ In / Lưu thành PDF</button><button class="c" onclick="window.close()">Đóng</button></div>
  ${html}
</body></html>`);
  win.document.close();
}

// =============================================================================
// MODULE QUẢN TRỊ — Xuất PDF tài liệu hệ thống
// Dùng cửa sổ in của trình duyệt: render bằng engine của trình duyệt nên TIẾNG VIỆT
// CHUẨN (không lỗi font, không cần nhúng font nặng), người dùng bấm "Lưu thành PDF".
// Bố cục chuyên nghiệp: header/footer cố định + ĐÁNH SỐ TRANG (CSS Paged Media),
// bảng kẻ vằn (zebra striping), trang bìa, đánh số mục rõ ràng.
// =============================================================================

// Escape an toàn cho HTML (dùng riêng cho phần quản trị).
const escDoc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * CSS dùng chung cho các tài liệu quản trị (A4 dọc).
 * - @page margin-box: header (giữa trên) + footer (trái/giữa-số trang/phải) cố định, lặp mọi trang.
 * - Bảng .tbl: viền + đầu bảng nền xanh nhạt + ZEBRA STRIPING (dòng chẵn nền nhạt) để dễ đọc.
 * @param {string} headerText  Chữ chạy ở mép trên mỗi trang.
 * @param {string} footerLeft  Chữ ở mép dưới-trái mỗi trang.
 */
function adminDocCss(headerText, footerLeft) {
  return `
  @page{
    size:A4 portrait; margin:22mm 16mm 20mm;
    @top-center{ content:"${headerText}"; font:italic 9px 'Times New Roman',serif; color:#9aa0a6; }
    @bottom-left{ content:"${footerLeft}"; font:9px 'Times New Roman',serif; color:#9aa0a6; }
    @bottom-right{ content:"Trang " counter(page) " / " counter(pages); font:9px 'Times New Roman',serif; color:#9aa0a6; }
  }
  *{ box-sizing:border-box; }
  body{ margin:0; background:#fff; color:#1a1a1a; font-family:'Times New Roman','Be Vietnam Pro',Georgia,serif; font-size:13.5px; line-height:1.55; }
  .doc{ max-width:800px; margin:0 auto; padding:16px; }
  .toolbar{ position:fixed; top:10px; right:12px; display:flex; gap:8px; font-family:system-ui,sans-serif; z-index:9; }
  .toolbar button{ font-size:13px; padding:8px 16px; border:0; border-radius:8px; cursor:pointer; }
  .toolbar .p{ background:#1d4ed8; color:#fff; } .toolbar .c{ background:#e5e7eb; color:#111; }
  h1.h{ font-size:22px; text-align:center; margin:4px 0; }
  h2{ font-size:16px; color:#1d4ed8; border-bottom:2px solid #d6e0fb; padding-bottom:4px; margin:20px 0 8px; }
  h3{ font-size:14px; color:#1f2937; margin:14px 0 6px; }
  p{ margin:6px 0; text-align:justify; } ul,ol{ margin:6px 0; padding-left:22px; } li{ margin:3px 0; text-align:justify; }
  .muted{ color:#555; font-size:12.5px; } .bt{ font-weight:bold; margin-bottom:4px; }
  .mono{ font-family:'Consolas','Courier New',monospace; font-size:12.3px; } .nowrap{ white-space:nowrap; }
  .formula{ background:#eef4ff; border:1px solid #b9cdf6; border-radius:8px; padding:10px 12px; font-weight:bold; text-align:center; margin:10px 0; }
  .box{ border-radius:8px; padding:10px 12px; margin:10px 0; }
  .box.gray{ background:#f5f6f8; border:1px solid #d9dde3; } .box.blue{ background:#eef4ff; border:1px solid #b9cdf6; }
  .box.amber{ background:#fff7e6; border:1px solid #f3d588; } .box.red{ background:#fdecec; border:1px solid #f3b5b5; }
  table.tbl{ width:100%; border-collapse:collapse; margin:10px 0; font-size:12.6px; }
  table.tbl th, table.tbl td{ border:1px solid #b9c0cc; padding:6px 8px; vertical-align:top; text-align:left; }
  table.tbl th{ background:#dde7fb; font-weight:bold; color:#16407a; }
  table.tbl tr:nth-child(even) td{ background:#f3f7fd; }              /* ZEBRA STRIPING */
  table.tbl td.ctr, table.tbl th.ctr{ text-align:center; }
  table.tbl td.tag{ font-weight:bold; color:#1d4ed8; white-space:nowrap; }
  .cover{ text-align:center; min-height:236mm; display:flex; flex-direction:column; align-items:center; }
  .cover .unit{ font-weight:bold; text-transform:uppercase; font-size:15px; margin-top:8mm; }
  .cover .rule{ width:150px; height:2px; background:#1d4ed8; margin:8px auto 0; }
  .cover-spacer{ flex:1; } .cover-kicker{ letter-spacing:2px; color:#1d4ed8; font-weight:bold; font-size:14px; }
  .cover-title{ font-size:25px; line-height:1.4; margin:14px 0; } .cover-sub{ font-style:italic; font-size:14px; color:#333; }
  .cover-meta{ font-style:italic; font-size:13px; margin-bottom:10px; }
  .cover-note{ color:#b45309; font-weight:bold; font-size:12.5px; border:1px dashed #d9a441; border-radius:8px; padding:8px 12px; background:#fffbeb; }
  .meta-tbl td{ border:0; padding:2px 6px; } .meta-tbl td:first-child{ font-weight:bold; width:34%; }
  section.page{ page-break-before:always; }
  .signoff{ margin-top:22px; padding-top:10px; border-top:1px solid #ddd; text-align:center; font-style:italic; color:#444; font-size:12.5px; }
  @media print{ .toolbar{ display:none; } .doc{ padding:0; } }`;
}

// Mở cửa sổ in với toolbar "Lưu thành PDF" (dùng chung cho 2 tài liệu quản trị).
function openAdminPrint(title, css, bodyHtml) {
  const win = window.open('', '_blank');
  if (!win) { alert('Trình duyệt đã chặn cửa sổ in/lưu PDF. Hãy cho phép pop-up cho trang này rồi thử lại.'); return; }
  win.document.open();
  win.document.write(`<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>${escDoc(title)}</title><style>${css}</style></head>
<body>
  <div class="toolbar"><button class="p" onclick="window.print()">⬇ In / Lưu thành PDF</button><button class="c" onclick="window.close()">Đóng</button></div>
  ${bodyHtml}
</body></html>`);
  win.document.close();
}

// -----------------------------------------------------------------------------
// MOCK DATA — DỮ LIỆU ĐẦU VÀO (đổ dữ liệu thật từ DB vào đây sau này)
// Toàn bộ nội dung kỹ thuật của tài liệu (1) lấy từ object này. Quản trị chỉ cần
// thay/đổ dữ liệu thật (truy vấn từ Supabase, package.json, biến môi trường...)
// vào các trường tương ứng là tài liệu tự cập nhật, KHÔNG phải sửa phần dựng HTML.
// -----------------------------------------------------------------------------
export const SYSTEM_DOC_DATA = {
  system: {
    name: 'Hệ thống Đánh giá, xếp loại cán bộ, công chức theo OKR/KPI',
    org: 'Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa',
    url: 'https://hdndthkpi.vercel.app',
    repo: 'https://github.com/sonthkh-alt/hdndthkpi',
    admin: 'Quản trị viên hệ thống',
    purpose: 'Hỗ trợ đánh giá, xếp loại mức độ hoàn thành nhiệm vụ hằng tháng của cán bộ, công chức theo phương pháp OKR/KPI — khách quan, định lượng, minh bạch; áp dụng Quyết định số 1053-QĐ/TU ngày 05/6/2026 của Ban Thường vụ Tỉnh ủy Thanh Hóa.',
    features: [
      'Chấm điểm hai cấp (tự đánh giá / cấp có thẩm quyền) theo Nhóm I (30đ) và Nhóm II (70đ).',
      'Quản lý mục tiêu OKR cấp đơn vị, liên kết từng nhiệm vụ với mục tiêu.',
      'Bảng kiểm đếm, theo dõi công việc theo tuần; đồng bộ từ Google Sheet; thu thập thành nhiệm vụ KPI.',
      'Tổng quan trực quan (biểu đồ phân bố xếp loại, xếp hạng, xu hướng, so sánh theo phòng/ban).',
      'Phê duyệt và xuất phiếu đánh giá (Word), sổ tay hướng dẫn và tài liệu hệ thống (PDF).',
      'Lưu dữ liệu theo từng kỳ (tháng/năm) với khóa lạc quan chống ghi đè.',
    ],
  },
  // Phần 2 — Tech stack (kèm phiên bản). Đổ phiên bản thật từ package.json nếu cần.
  techStack: [
    { layer: 'Frontend', tech: 'React (SPA)', version: '18.3', role: 'Thư viện giao diện, render phía trình duyệt' },
    { layer: 'Frontend', tech: 'Vite', version: '5.4', role: 'Công cụ build & dev server, tách chunk lazy-load' },
    { layer: 'Frontend', tech: 'TailwindCSS', version: '3.4', role: 'Hệ thống style tiện ích (utility-first)' },
    { layer: 'Frontend', tech: 'Recharts', version: '3.8', role: 'Biểu đồ tương tác ở tab Tổng quan (lazy-load)' },
    { layer: 'Frontend', tech: 'lucide-react / docx / xlsx / html2pdf.js / file-saver', version: 'mới nhất', role: 'Icon & xuất Word/Excel/PDF phía client (lazy-load)' },
    { layer: 'Backend (BaaS)', tech: 'Supabase — PostgreSQL', version: 'PostgreSQL 15', role: 'Cơ sở dữ liệu chính (lưu theo kỳ, jsonb)' },
    { layer: 'Backend (BaaS)', tech: 'Supabase — GoTrue Auth', version: '—', role: 'Xác thực email/mật khẩu, phát hành JWT' },
    { layer: 'Backend (BaaS)', tech: 'Supabase — PostgREST', version: '—', role: 'API REST tự sinh trên bảng dữ liệu (RLS)' },
    { layer: 'Serverless', tech: 'Vercel Functions (Node.js)', version: 'Node 18', role: 'Proxy đọc Google Sheet (api/kiemdem) tránh CORS' },
    { layer: 'Hosting / Web Server', tech: 'Vercel (CDN + CI/CD)', version: '—', role: 'Phục vụ tĩnh qua CDN toàn cầu, tự build khi push main' },
  ],
  dataFlow: [
    'Trình duyệt tải ứng dụng React (tệp tĩnh) từ CDN của Vercel.',
    'Ứng dụng dùng Supabase JS client (anon key) gọi Auth để đăng nhập → nhận JWT.',
    'Mọi thao tác đọc/ghi dữ liệu kỳ đi qua PostgREST của Supabase tới PostgreSQL, ràng buộc bởi RLS theo JWT.',
    'Lưu trạng thái kỳ là một bản ghi jsonb trong bảng app_state, kèm khóa lạc quan updated_at.',
    'Riêng dữ liệu kiểm đếm: trình duyệt gọi hàm serverless /api/kiemdem; hàm này đọc Google Sheet công khai (CSV) phía máy chủ rồi trả JSON (cache CDN ~60s).',
  ],
  tables: [
    { name: 'app_state', desc: 'Lưu toàn bộ trạng thái đánh giá của một kỳ (người, mục tiêu, danh mục) dưới dạng jsonb.', fields: [
      { f: 'id', t: 'int8 (PK)', n: 'Khóa chính tự tăng' },
      { f: 'period_year', t: 'int', n: 'Năm của kỳ' },
      { f: 'period_month', t: 'int', n: 'Tháng của kỳ (1–12)' },
      { f: 'data', t: 'jsonb', n: 'Dữ liệu kỳ: people[], objectives[], catalog{}' },
      { f: 'updated_at', t: 'timestamptz', n: 'Thời điểm cập nhật — dùng làm khóa lạc quan' },
    ] },
    { name: 'auth.users (Supabase quản lý)', desc: 'Tài khoản người dùng do GoTrue quản lý.', fields: [
      { f: 'id', t: 'uuid (PK)', n: 'Định danh người dùng' },
      { f: 'email', t: 'text (unique)', n: 'Email đăng nhập' },
      { f: 'encrypted_password', t: 'text', n: 'Mật khẩu đã băm (bcrypt) — không lưu plaintext' },
      { f: 'raw_user_meta_data', t: 'jsonb', n: 'Hồ sơ: full_name, position, cờ pw_set' },
    ] },
  ],
  apis: [
    { group: 'Auth', ep: 'POST /auth/v1/token?grant_type=password', desc: 'Đăng nhập email + mật khẩu (signInWithPassword) → trả access token (JWT) + refresh token.' },
    { group: 'Auth', ep: 'POST /auth/v1/otp', desc: 'Gửi liên kết kích hoạt lần đầu / quên mật khẩu (signInWithOtp).' },
    { group: 'Auth', ep: 'PUT /auth/v1/user', desc: 'Đặt/đổi mật khẩu và cập nhật hồ sơ (updateUser: password, full_name, position, pw_set).' },
    { group: 'Auth', ep: 'GET /auth/v1/user (getSession)', desc: 'Lấy phiên hiện tại; onAuthChange lắng nghe thay đổi đăng nhập/đăng xuất.' },
    { group: 'CRUD dữ liệu', ep: 'GET app_state?period_year=..&period_month=..', desc: 'Đọc trạng thái kỳ (loadState). Trả bản ghi + updated_at.' },
    { group: 'CRUD dữ liệu', ep: 'UPSERT app_state', desc: 'Ghi trạng thái kỳ (saveState) kèm kiểm tra updated_at — phát hiện xung đột ghi đồng thời.' },
    { group: 'CRUD dữ liệu', ep: 'GET listPeriods / loadAllPeriods', desc: 'Liệt kê các kỳ đã có & nạp toàn bộ kỳ để vẽ biểu đồ xu hướng.' },
    { group: 'Tích hợp', ep: 'GET /api/kiemdem', desc: 'Hàm serverless: proxy đọc Google Sheet công khai (gviz CSV) → JSON { weekTitle, persons[] }, cache 60s.' },
    { group: 'Sao lưu', ep: 'Supabase Backup (PITR/daily)', desc: 'Sao lưu cơ sở dữ liệu do nền tảng Supabase thực hiện (xem Phần 4).' },
  ],
  security: [
    'SSL/TLS: toàn bộ truy cập qua HTTPS (chứng chỉ do Vercel cấp & gia hạn tự động).',
    'Mã hóa mật khẩu: GoTrue băm mật khẩu bằng bcrypt; hệ thống KHÔNG lưu mật khẩu dạng rõ.',
    'Phân quyền JWT: đăng nhập trả JWT; mọi truy vấn dữ liệu kèm token, kiểm soát bởi Row-Level Security (RLS) ở PostgreSQL.',
    'Phân vai trò ứng dụng: cán bộ / trưởng phòng / quản trị / khách (chỉ xem) — quyết định theo email khớp hồ sơ.',
    'Khóa lạc quan (updated_at) chống ghi đè khi nhiều người sửa cùng kỳ.',
    'Tài khoản khách (demo) chạy in-memory, KHÔNG ghi cơ sở dữ liệu.',
    'Bí mật cấu hình (Supabase URL/anon key) đặt ở biến môi trường, không commit vào mã nguồn; .env bị loại khỏi Git.',
  ],
  backup: [
    'Cơ sở dữ liệu Supabase được nền tảng sao lưu định kỳ; gói trả phí hỗ trợ Point-in-time Recovery (PITR) khôi phục về thời điểm.',
    'Mã nguồn lưu trên GitHub (nguồn duy nhất) — mỗi commit là một mốc khôi phục; Vercel giữ lịch sử các bản deploy để rollback nhanh.',
    'Dữ liệu kỳ ở dạng jsonb có thể kết xuất ra Excel/Word/PDF phục vụ lưu trữ ngoài.',
    'Khôi phục sự cố: chọn bản deploy trước trên Vercel (rollback tức thời) và/hoặc phục hồi DB từ bản sao lưu Supabase.',
  ],
  logging: [
    'Vercel Logs: nhật ký build & runtime của hàm serverless (gồm lỗi của /api/kiemdem).',
    'Supabase Logs: nhật ký Auth, API (PostgREST) và truy vấn cơ sở dữ liệu.',
    'Trình duyệt: ErrorBoundary của ứng dụng bắt lỗi React, tránh sập toàn trang; cảnh báo xung đột ghi hiển thị trực tiếp cho người dùng.',
    'Hiệu năng: tách chunk + lazy-load thư viện nặng (biểu đồ, xuất tệp) để giảm dung lượng tải lần đầu.',
  ],
};

/**
 * (1) Xuất PDF — TÀI LIỆU MÔ TẢ KỸ THUẬT & VẬN HÀNH HỆ THỐNG.
 * Bố cục: Bìa → Mục lục → Phần 1 Tổng quan → Phần 2 Kiến trúc → Phần 3 CSDL & API → Phần 4 Vận hành & Bảo mật.
 * @param {object} data  Dữ liệu hệ thống (mặc định SYSTEM_DOC_DATA — thay bằng dữ liệu thật khi cần).
 */
export function exportSystemTechPDF(version = 'classic') {
  const e = escDoc;
  const data = SYSTEM_DOC_DATA;
  const s = data.system || {};
  const vName = { classic: 'Cổ điển (QĐ 1053)', improved: 'Cải tiến (AIM/ISE + OKR)', sg: 'Singapore (cơ quan dân cử)' }[version] || 'Cổ điển';
  const now = new Date();
  const dateStr = `ngày ${String(now.getDate()).padStart(2, '0')} tháng ${String(now.getMonth() + 1).padStart(2, '0')} năm ${now.getFullYear()}`;

  const techRows = (data.techStack || []).map((t) => `<tr>
    <td class="tag">${e(t.layer)}</td><td><b>${e(t.tech)}</b></td><td class="ctr nowrap">${e(t.version)}</td><td>${e(t.role)}</td></tr>`).join('');
  const tableBlocks = (data.tables || []).map((tb) => `
    <h3>Bảng <span class="mono">${e(tb.name)}</span></h3>
    <p class="muted">${e(tb.desc)}</p>
    <table class="tbl"><tr><th style="width:26%">Trường</th><th style="width:24%">Kiểu dữ liệu</th><th>Ý nghĩa</th></tr>
      ${(tb.fields || []).map((f) => `<tr><td class="mono">${e(f.f)}</td><td class="mono">${e(f.t)}</td><td>${e(f.n)}</td></tr>`).join('')}
    </table>`).join('');
  const apiRows = (data.apis || []).map((a) => `<tr><td class="tag">${e(a.group)}</td><td class="mono">${e(a.ep)}</td><td>${e(a.desc)}</td></tr>`).join('');
  const li = (arr) => (arr || []).map((x) => `<li>${e(x)}</li>`).join('');

  const html = `
  <div class="doc">
    <section class="cover">
      <div class="unit">${e(s.org)}</div>
      <div class="rule"></div>
      <div class="cover-spacer"></div>
      <div class="cover-kicker">TÀI LIỆU KỸ THUẬT & VẬN HÀNH</div>
      <h1 class="cover-title">MÔ TẢ KIẾN TRÚC, CƠ SỞ DỮ LIỆU<br>VÀ QUY TRÌNH VẬN HÀNH HỆ THỐNG</h1>
      <div class="cover-sub">${e(s.name)}</div>
      <div class="cover-spacer"></div>
      <table class="meta-tbl" style="margin:0 auto 14px;">
        <tr><td>Địa chỉ hệ thống</td><td>${e(s.url)}</td></tr>
        <tr><td>Phiên bản đang dùng</td><td>${e(vName)}</td></tr>
        <tr><td>Ngày xuất báo cáo</td><td>${dateStr}</td></tr>
        <tr><td>Người thực hiện</td><td>${e(s.admin)} (Admin)</td></tr>
      </table>
      <div class="cover-note">⚠ BẢN DEMO THỬ NGHIỆM — sử dụng nội bộ, không chịu trách nhiệm về tính pháp lý và dữ liệu.</div>
    </section>

    <section class="page">
      <h2>MỤC LỤC</h2>
      <ol>
        <li>Phần 1 — Tổng quan hệ thống (System Overview)</li>
        <li>Phần 2 — Kiến trúc kỹ thuật chi tiết (Technical Architecture)</li>
        <li>Phần 3 — Cấu trúc cơ sở dữ liệu & API (Database &amp; API Specs)</li>
        <li>Phần 4 — Quy trình vận hành & bảo mật (Operations &amp; Security)</li>
      </ol>

      <h2>Phần 1 — Tổng quan hệ thống</h2>
      <table class="tbl">
        <tr><th style="width:26%">Hạng mục</th><th>Nội dung</th></tr>
        <tr><td><b>Tên hệ thống</b></td><td>${e(s.name)}</td></tr>
        <tr><td><b>Đơn vị chủ quản</b></td><td>${e(s.org)}</td></tr>
        <tr><td><b>Địa chỉ</b></td><td>${e(s.url)}</td></tr>
        <tr><td><b>Mã nguồn</b></td><td>${e(s.repo)}</td></tr>
        <tr><td><b>Ngày xuất báo cáo</b></td><td>${dateStr}</td></tr>
        <tr><td><b>Người thực hiện</b></td><td>${e(s.admin)} (Admin)</td></tr>
      </table>
      <h3>Mục tiêu</h3>
      <p>${e(s.purpose)}</p>
      <h3>Chức năng chính</h3>
      <ul>${li(s.features)}</ul>
    </section>

    <section class="page">
      <h2>Phần 2 — Kiến trúc kỹ thuật chi tiết</h2>
      <h3>Mô hình & luồng dữ liệu (Data Flow)</h3>
      <div class="formula">Trình duyệt (React SPA) ⇄ Supabase (Auth · PostgREST · PostgreSQL) &nbsp;|&nbsp; Vercel Serverless (/api/kiemdem) ⇄ Google Sheet</div>
      <ol>${li(data.dataFlow)}</ol>
      <div class="box blue"><b>Kiến trúc tổng thể:</b> ứng dụng một trang (SPA) tải tĩnh qua CDN; tầng "backend" là dịch vụ nền (BaaS) Supabase (không phải máy chủ tự dựng); hàm serverless chỉ dùng cho tác vụ cần chạy phía máy chủ (proxy Google Sheet, tránh CORS).</div>
      <h3>Danh sách công nghệ (Tech Stack)</h3>
      <table class="tbl">
        <tr><th style="width:20%">Tầng</th><th style="width:26%">Công nghệ</th><th class="ctr" style="width:14%">Phiên bản</th><th>Vai trò</th></tr>
        ${techRows}
      </table>
    </section>

    <section class="page">
      <h2>Phần 3 — Cấu trúc cơ sở dữ liệu & API</h2>
      <h3>Các bảng dữ liệu chính</h3>
      ${tableBlocks}
      <div class="box gray"><b>Ghi chú mô hình lưu trữ:</b> toàn bộ trạng thái một kỳ (danh sách cán bộ, điểm, nhiệm vụ, mục tiêu OKR, danh mục) được đóng gói trong trường <span class="mono">data</span> kiểu <b>jsonb</b> của một bản ghi <span class="mono">app_state</span> — tối ưu cho việc nạp/lưu nguyên kỳ và phiên bản hóa theo thời gian.</div>
      <h3>Các Endpoint API cốt lõi</h3>
      <table class="tbl">
        <tr><th style="width:16%">Nhóm</th><th style="width:40%">Endpoint</th><th>Mô tả</th></tr>
        ${apiRows}
      </table>
    </section>

    <section class="page">
      <h2>Phần 4 — Quy trình vận hành & bảo mật</h2>
      <h3>Sao lưu (Backup) & khôi phục sự cố</h3>
      <ul>${li(data.backup)}</ul>
      <h3>Biện pháp bảo mật</h3>
      <ul>${li(data.security)}</ul>
      <h3>Nhật ký giám sát lỗi & hiệu năng</h3>
      <ul>${li(data.logging)}</ul>
      <div class="signoff">
        <p>Tài liệu kỹ thuật & vận hành — phục vụ công tác quản trị nội bộ.</p>
        <p>${e(s.org)} • Xuất ${dateStr}.</p>
      </div>
    </section>
  </div>`;

  openAdminPrint('Tài liệu kỹ thuật & vận hành hệ thống', adminDocCss(e(s.name), 'Bản demo nội bộ — không chịu trách nhiệm pháp lý'), html);
}

/**
 * (2) Xuất PDF — PHƯƠNG PHÁP TÍNH, ĐÁNH GIÁ OKR/KPI (trình bày như văn bản hành chính).
 * @param {string} unit  Tên đơn vị (hiển thị ở bìa/header).
 */
export function exportOKRMethodPDF(unit = 'Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa', version = 'classic') {
  const e = escDoc;
  const now = new Date();
  const dateStr = `ngày ${String(now.getDate()).padStart(2, '0')} tháng ${String(now.getMonth() + 1).padStart(2, '0')} năm ${now.getFullYear()}`;

  // Phiên bản Singapore dùng phương pháp riêng (không 30/70 + Điều 8) → tài liệu nghiệp vụ riêng.
  if (version === 'sg') {
    const htmlSG = `
    <div class="doc">
      <section class="cover">
        <div class="unit">${e(unit)}</div>
        <div class="rule"></div>
        <div class="cover-spacer"></div>
        <div class="cover-kicker">TÀI LIỆU NGHIỆP VỤ (THAM KHẢO)</div>
        <h1 class="cover-title">PHƯƠNG PHÁP ĐÁNH GIÁ HIỆU SUẤT<br>THEO MÔ HÌNH KHU VỰC CÔNG<br>SINGAPORE</h1>
        <div class="cover-sub">Tham khảo: PSD (CEP), CSC (Liêm chính–Phục vụ–Xuất sắc),<br>MND (Town Council Management Report), MOF (SPOR), GovTech (OKR)</div>
        <div class="cover-spacer"></div>
        <div class="cover-meta">Tài liệu lập ${dateStr}</div>
        <div class="cover-note">⚠ BẢN DEMO THỬ NGHIỆM — phương pháp tham khảo, các trọng số/ngưỡng là cách vận dụng hợp lý.</div>
      </section>
      <section class="page">
        <h2>I. NGUYÊN TẮC CHUNG</h2>
        <p>Phiên bản Singapore mô phỏng cách quản lý hiệu suất khu vực công Singapore, <b>không dùng thang 30/70 và Điều 8</b>. Đánh giá tách thành HAI tầng độc lập: (A) đánh giá <b>thiết chế/cơ quan</b> theo bộ chỉ số dải màu; (B) đánh giá <b>cá nhân</b> công chức theo kết quả + năng lực + giá trị.</p>
        <div class="box red"><b>Nguyên tắc cốt lõi:</b> đại biểu dân cử (HĐND/Quốc hội) KHÔNG bị chấm điểm cá nhân — chịu trách nhiệm trước cử tri qua bầu cử và minh bạch. Chỉ chấm điểm thiết chế phục vụ và công chức.</div>

        <h2>II. TẦNG A — BẢNG ĐIỂM THIẾT CHẾ (dải màu Xanh/Vàng/Đỏ)</h2>
        <p>Mô phỏng Town Council Management Report (MND Singapore): chấm KPI của cơ quan, mỗi chỉ số xếp <b>một dải màu riêng</b> (không gộp thành một điểm), công bố theo kỳ.</p>
        <table class="tbl">
          <tr><th style="width:32%">Chỉ số</th><th style="width:20%">Đo lường</th><th>Ngưỡng dải màu (mặc định)</th></tr>
          <tr><td>Phục vụ kỳ họp</td><td>% tài liệu kỳ họp đúng hạn</td><td>Xanh ≥ 95% · Vàng ≥ 80% · Đỏ &lt; 80%</td></tr>
          <tr><td>Văn bản đúng hạn</td><td>% văn bản tham mưu đúng hạn</td><td>Xanh ≥ 95% · Vàng ≥ 85% · Đỏ &lt; 85%</td></tr>
          <tr><td>Xử lý kiến nghị cử tri</td><td>% xử lý đúng hạn, có phản hồi</td><td>Xanh ≥ 90% · Vàng ≥ 70% · Đỏ &lt; 70%</td></tr>
          <tr><td>Hài lòng về phục vụ</td><td>% hài lòng (khảo sát)</td><td>Xanh ≥ 80% · Vàng ≥ 60% · Đỏ &lt; 60%</td></tr>
          <tr><td>Minh bạch & quản trị</td><td>điểm vi phạm (thấp hơn = tốt)</td><td>Xanh ≤ 0 · Vàng ≤ 1 · Đỏ &gt; 1</td></tr>
        </table>

        <h2>III. TẦNG B — PHIẾU CÁ NHÂN</h2>
        <p>Mỗi công chức được đánh giá trên ba cấu phần:</p>
        <ul>
          <li><b>Work Review (Kết quả công việc):</b> các mục tiêu công việc gắn OKR, mỗi mục tiêu có "Kết quả then chốt"; cấp trên chấm mức đạt 1–5 (có trọng số).</li>
          <li><b>Competencies — Năng lực (AIM):</b> Phân tích & trí tuệ · Ảnh hưởng & hợp tác · Động lực hướng tới xuất sắc (1–5).</li>
          <li><b>Core Values — Giá trị (ISE):</b> Liêm chính · Phục vụ · Xuất sắc (1–5).</li>
        </ul>
        <div class="formula">Điểm tổng hợp = Hiệu suất × 60% + Năng lực × 25% + Giá trị × 15%</div>

        <h2>IV. XẾP LOẠI A–E</h2>
        <table class="tbl">
          <tr><th style="width:12%">Mức</th><th style="width:48%">Xếp loại</th><th>Ngưỡng điểm tổng hợp</th></tr>
          <tr><td class="ctr"><b>A</b></td><td>Outstanding — Xuất sắc nổi bật</td><td>≥ 90</td></tr>
          <tr><td class="ctr"><b>B</b></td><td>Exceeds — Vượt mong đợi</td><td>75 → dưới 90</td></tr>
          <tr><td class="ctr"><b>C</b></td><td>Meets — Đạt mong đợi</td><td>55 → dưới 75</td></tr>
          <tr><td class="ctr"><b>D</b></td><td>Below — Dưới mong đợi</td><td>40 → dưới 55</td></tr>
          <tr><td class="ctr"><b>E</b></td><td>Unsatisfactory — Không đạt</td><td>dưới 40</td></tr>
        </table>
        <p>Hệ thống đề xuất mức tự động; cấp trên có thể hiệu chỉnh theo xếp hạng tương đối giữa các cán bộ (không áp quota cứng).</p>

        <h2>V. TIỀM NĂNG (CEP)</h2>
        <p><b>Currently Estimated Potential</b> — mức trách nhiệm cao nhất ước lượng cán bộ có thể đảm nhận trong 3–5 năm tới. <b>Tách riêng</b> khỏi điểm hiệu suất, dùng cho quy hoạch và phát triển; KHÔNG ảnh hưởng xếp loại của kỳ.</p>

        <h2>VI. ĐỐI THOẠI PHÁT TRIỂN (CFR/IDP)</h2>
        <p>Ghi điểm mạnh, lĩnh vực cần phát triển, kế hoạch phát triển cá nhân và nhận xét đối thoại giữa cán bộ với cấp trên — đề cao phát triển, không chỉ chấm điểm.</p>
        <div class="signoff">
          <p>Tài liệu nghiệp vụ — phương pháp đánh giá theo mô hình Singapore (tham khảo).</p>
          <p>${e(unit)} • Xuất ${dateStr}.</p>
        </div>
      </section>
    </div>`;
    openAdminPrint('Phương pháp tính, đánh giá (Singapore)', adminDocCss('Phương pháp tính, đánh giá (mô hình Singapore)', 'Bản demo nội bộ — không chịu trách nhiệm pháp lý'), htmlSG);
    return;
  }

  // Bản Cải tiến: cùng phương pháp QĐ 1053 nhưng ghi chú điểm khác biệt.
  const verNote = version === 'improved'
    ? `<div class="box gray"><b>Bản Cải tiến:</b> giữ nguyên thang điểm và công thức của bản Cổ điển (theo QĐ 1053 và Nghị định 335/2025/NĐ-CP); chỉ viết lại câu hỏi Nhóm I theo hướng dễ hiểu (năng lực AIM: Phân tích – Ảnh hưởng – Động lực; giá trị Liêm chính – Phục vụ – Xuất sắc) và <b>gom nhiệm vụ Nhóm II theo Mục tiêu (OKR)</b>, bổ sung ô "Kết quả cần đạt". Mục tiêu (OKR) chỉ để định hướng, KHÔNG dùng để tính điểm.</div>`
    : '';

  const html = `
  <div class="doc">
    <section class="cover">
      <div class="unit">${e(unit)}</div>
      <div class="rule"></div>
      <div class="cover-spacer"></div>
      <div class="cover-kicker">TÀI LIỆU NGHIỆP VỤ</div>
      <h1 class="cover-title">PHƯƠNG PHÁP TÍNH VÀ ĐÁNH GIÁ<br>KẾT QUẢ THỰC HIỆN NHIỆM VỤ<br>THEO OKR/KPI</h1>
      <div class="cover-sub">Áp dụng Quyết định số 1053-QĐ/TU ngày 05/6/2026<br>của Ban Thường vụ Tỉnh ủy Thanh Hóa</div>
      <div class="cover-spacer"></div>
      <div class="cover-meta">Tài liệu lập ${dateStr}</div>
      <div class="cover-note">⚠ BẢN DEMO THỬ NGHIỆM — sử dụng nội bộ, không chịu trách nhiệm về tính pháp lý và dữ liệu.</div>
    </section>

    <section class="page">
      ${verNote}
      <h2>I. CĂN CỨ & NGUYÊN TẮC</h2>
      <p><b>1. Căn cứ.</b> Phương pháp tính, đánh giá được xây dựng theo Quyết định số 1053-QĐ/TU ngày 05/6/2026 của Ban Thường vụ Tỉnh ủy Thanh Hóa về đánh giá, xếp loại mức độ hoàn thành nhiệm vụ hằng tháng của cán bộ, công chức, viên chức và người lao động.</p>
      <p><b>2. Nguyên tắc.</b> Đánh giá theo phương pháp OKR/KPI, bảo đảm: (i) <b>định lượng</b> bằng đếm khách quan; (ii) <b>liên thông mục tiêu</b> — mỗi nhiệm vụ gắn với một mục tiêu (OKR) của đơn vị; (iii) <b>hai cấp</b> — cá nhân tự đánh giá và cấp có thẩm quyền quyết định; (iv) <b>minh bạch</b> — công khai công thức, hệ số và điều kiện xếp loại.</p>
      <div class="box gray"><b>Đối tượng áp dụng:</b> 5 nhóm theo Mẫu 01–05 (Đại biểu HĐND tỉnh chuyên trách; Đại biểu Quốc hội chuyên trách; cán bộ lãnh đạo, quản lý; công chức không giữ chức vụ; lao động hợp đồng hỗ trợ, phục vụ).</p></div>

      <h2>II. THANG ĐIỂM TỔNG QUÁT</h2>
      <div class="formula">TỔNG ĐIỂM = Nhóm I (tối đa 30) + Nhóm II (tối đa 70) − Điểm trừ</div>
      <p>Mỗi cán bộ được chấm ở hai cột: <b>Tự đánh giá</b> và <b>Cấp có thẩm quyền</b>; điểm xếp loại chính thức lấy theo cột Cấp có thẩm quyền. Cán bộ khởi tạo mặc định mức tối đa, việc đánh giá là trừ dần theo thực tế.</p>

      <h2>III. NHÓM I — TIÊU CHÍ CHUNG (tối đa 30 điểm)</h2>
      <p>Đánh giá phẩm chất chính trị, tư tưởng, đạo đức, ý thức tổ chức kỷ luật, năng lực, tác phong... theo bộ tiêu chí của từng nhóm đối tượng. Cộng điểm tất cả tiêu chí và giới hạn không quá 30 điểm.</p>
      <table class="tbl">
        <tr><th style="width:14%">Mẫu</th><th style="width:42%">Nhóm đối tượng</th><th>Cấu trúc điểm Nhóm I</th></tr>
        <tr><td class="ctr"><b>01</b></td><td>ĐB HĐND tỉnh chuyên trách</td><td>Dùng chung tiêu chí nhóm lãnh đạo.</td></tr>
        <tr><td class="ctr"><b>02</b></td><td>ĐB Quốc hội chuyên trách</td><td>Tương tự Mẫu 01.</td></tr>
        <tr><td class="ctr"><b>03</b></td><td>Lãnh đạo, quản lý (Phụ lục 03)</td><td>Chính trị tư tưởng (5) + đạo đức, kỷ luật (5) + năng lực lãnh đạo–chuyên môn–thực thi–tác phong–đổi mới–CĐS (16) + tín nhiệm, đoàn kết (2) + tự phê bình (2).</td></tr>
        <tr><td class="ctr"><b>04</b></td><td>Công chức không giữ chức vụ (Phụ lục 01)</td><td>Chính trị tư tưởng (5) + đạo đức, kỷ luật (5) + năng lực chuyên môn–thực thi–tác phong–đổi mới–CĐS (16) + tự phê bình (4).</td></tr>
        <tr><td class="ctr"><b>05</b></td><td>Lao động hợp đồng (Phụ lục 02)</td><td>Chính trị, đạo đức, kỷ luật (15) + năng lực chuyên môn, thực thi (10) + tự phê bình (5).</td></tr>
      </table>

      <h2>IV. NHÓM II — KẾT QUẢ THỰC HIỆN NHIỆM VỤ (tối đa 70 điểm)</h2>
      <p>Chấm bằng đếm khách quan. Mỗi nhiệm vụ chọn từ danh mục công việc (đã gán <b>hệ số</b> theo cấp độ) và nhập 4 con số: Số lượng <b>giao</b>, Số lượng <b>hoàn thành</b>, số <b>lỗi chất lượng</b>, số lần <b>chậm tiến độ</b>. Hệ thống tính 3 tỷ lệ bình quân theo hệ số:</p>
      <table class="tbl">
        <tr><th style="width:20%">Tỷ lệ</th><th>Công thức</th></tr>
        <tr><td><b>a — Khối lượng</b></td><td>Σ(Hoàn thành × hệ số) ÷ Σ(Giao × hệ số) × 100% &nbsp;<i>(chặn tối đa 100%)</i></td></tr>
        <tr><td><b>b — Chất lượng</b></td><td>Bình quân [1 − 0,25 × số lỗi chất lượng] theo hệ số × 100% &nbsp;<i>(mỗi lỗi −25%)</i></td></tr>
        <tr><td><b>c — Tiến độ</b></td><td>Bình quân [1 − 0,25 × số lần chậm] theo hệ số × 100% &nbsp;<i>(mỗi lần chậm −25%)</i></td></tr>
      </table>
      <div class="formula">Điểm Nhóm II = (a + b + c) ÷ 3 × 70% &nbsp;<span class="muted">(công chức, viên chức, lao động hợp đồng)</span></div>
      <div class="box red">
        <p class="bt">Đối với cán bộ giữ chức vụ lãnh đạo, quản lý (Điều 7)</p>
        <p>Điểm kết quả = <b>(a + b + c + d + đ + e) ÷ 6</b>, bổ sung 3 thành phần (mỗi mục 100% hoặc 50%):</p>
        <ul>
          <li><b>d</b> — Kết quả lĩnh vực/đơn vị phụ trách.</li>
          <li><b>đ</b> — Khả năng tổ chức triển khai nhiệm vụ.</li>
          <li><b>e</b> — Năng lực tập hợp, đoàn kết nội bộ.</li>
        </ul>
        <p class="muted">b và c chỉ tính trên phần đã hoàn thành; "vượt mức" (hoàn thành &gt; giao) không cộng thêm điểm (a chặn 100%) nhưng là điều kiện bắt buộc của loại A.</p>
      </div>
      <div class="box amber">
        <p class="bt">Ví dụ</p>
        <p class="mono">NV1 (hệ số 300): giao 4, HT 4, lỗi 0, chậm 1 — NV2 (hệ số 100): giao 10, HT 8, lỗi 1, chậm 0.<br>
        a = (4×300 + 8×100) ÷ (4×300 + 10×100) = 2000 ÷ 2200 = <b>90,9%</b><br>
        b = (1200 + 800×0,75) ÷ 2000 = <b>90,0%</b> &nbsp; c = (1200×0,75 + 800) ÷ 2000 = <b>85,0%</b><br>
        TB = (90,9 + 90,0 + 85,0) ÷ 3 = <b>88,6%</b> → Nhóm II = 88,6% × 70% ≈ <b>62,0/70</b></p>
      </div>

      <h2>V. HỆ SỐ CÔNG VIỆC (cấp độ N1–N5)</h2>
      <p>Hệ số phản ánh độ phức tạp/cấp độ; việc khó có hệ số cao, đóng góp nhiều hơn vào điểm — bảo đảm công bằng giữa việc khó và việc đơn giản. Trọng số mỗi nhiệm vụ = hệ số × số lượng.</p>
      <table class="tbl">
        <tr><th>Cấp độ</th><th class="ctr">N1</th><th class="ctr">N2</th><th class="ctr">N3</th><th class="ctr">N4</th><th class="ctr">N5</th><th class="ctr">Hỗ trợ</th></tr>
        <tr><td><b>Hệ số</b></td><td class="ctr">100</td><td class="ctr">200</td><td class="ctr">300</td><td class="ctr">400</td><td class="ctr">500</td><td class="ctr">0 (đếm ngang nhau)</td></tr>
      </table>

      <h2>VI. XẾP LOẠI & ĐIỀU KIỆN ĐỊNH LƯỢNG (Điều 8)</h2>
      <table class="tbl">
        <tr><th style="width:10%">Mức</th><th style="width:40%">Xếp loại</th><th>Ngưỡng điểm (cột Cấp duyệt)</th></tr>
        <tr><td class="ctr"><b>A</b></td><td>Hoàn thành xuất sắc nhiệm vụ</td><td>≥ 90 điểm</td></tr>
        <tr><td class="ctr"><b>B</b></td><td>Hoàn thành tốt nhiệm vụ</td><td>70 → dưới 90 điểm</td></tr>
        <tr><td class="ctr"><b>C</b></td><td>Hoàn thành nhiệm vụ</td><td>50 → dưới 70 điểm</td></tr>
        <tr><td class="ctr"><b>D</b></td><td>Không hoàn thành nhiệm vụ</td><td>dưới 50 điểm</td></tr>
      </table>
      <p>Ngoài ngưỡng điểm, hệ thống áp dụng điều kiện định lượng xét theo TỪNG nhiệm vụ (tỷ lệ = hoàn thành ÷ giao; "không hoàn thành" khi đạt dưới 50%):</p>
      <ul>
        <li><b>Loại A:</b> ngoài ≥ 90 điểm, mọi nhiệm vụ đạt đủ 100% số lượng và có ≥ 30% nhiệm vụ vượt mức.</li>
        <li><b>Loại B:</b> 70–89 điểm và không có nhiệm vụ nào đạt dưới 50%.</li>
        <li><b>Loại C:</b> 50–69 điểm; số nhiệm vụ chậm tiến độ không quá 20%.</li>
        <li><b>Loại D:</b> dưới 50 điểm; hoặc bị kỷ luật/kết luận suy thoái; hoặc trên 50% nhiệm vụ không hoàn thành (lãnh đạo: trên 30%).</li>
      </ul>
      <div class="box gray"><b>Trần xuất sắc:</b> số người loại A không vượt quá 20% số người loại B.</div>
      <div class="box red"><b>Phân biệt hai cơ chế:</b> "bị kỷ luật" chỉ chốt mức xếp loại = Không hoàn thành nhiệm vụ (KHÔNG trừ điểm); "Điểm trừ" mới trừ trực tiếp vào tổng điểm. Khi điểm số và xếp loại lệch nhau (điểm cao nhưng bị hạ mức theo Điều 8), hệ thống hiển thị cảnh báo giải thích.</div>

      <h2>VII. QUY TRÌNH & MỐC THỜI GIAN</h2>
      <ol>
        <li>Trước ngày 25: cán bộ tự đánh giá.</li>
        <li>Trước ngày 26: cấp trên trực tiếp cho ý kiến.</li>
        <li>Trước ngày 28: cấp có thẩm quyền quyết định xếp loại và phê duyệt.</li>
        <li>Trước ngày 05 tháng sau: công khai kết quả, biểu dương, khen thưởng.</li>
      </ol>
      <p>Đánh giá theo tháng; riêng tháng 12 hoàn thành trước ngày 15/12. Kết quả hằng tháng là căn cứ xếp loại quý/năm và đảng viên.</p>
      <div class="signoff">
        <p>Tài liệu nghiệp vụ về phương pháp tính, đánh giá OKR/KPI.</p>
        <p>${e(unit)} • Xuất ${dateStr}.</p>
      </div>
    </section>
  </div>`;

  openAdminPrint('Phương pháp tính, đánh giá OKR/KPI', adminDocCss('Phương pháp tính, đánh giá OKR/KPI', 'Bản demo nội bộ — không chịu trách nhiệm pháp lý'), html);
}
