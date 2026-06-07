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
