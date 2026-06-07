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
        TC(noCat ? '(Chưa chọn danh mục — không được tính điểm)' : (t.note ? `${t.catalogName} — ${t.note}` : t.catalogName), { size: 20, italics: noCat, color: noCat ? '9A3412' : undefined }),
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
        <tr><td><b>Liên hệ & hướng dẫn</b></td><td>Thông tin liên hệ, gửi ý kiến và tài liệu hướng dẫn này.</td></tr>
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
