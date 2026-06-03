import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';
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

// WORD — Phiếu đánh giá, xếp loại cá nhân (gộp Tiêu chí chung + Kết quả thực hiện nhiệm vụ)
export async function exportWordPhieu(ev) {
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: ev.unit.toUpperCase(), bold: true, size: 24 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', bold: true, size: 24 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Độc lập - Tự do - Hạnh phúc', bold: true, size: 24 })] }),
        new Paragraph(''),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'PHIẾU ĐÁNH GIÁ, XẾP LOẠI HẰNG THÁNG', bold: true, size: 30 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `(Kỳ đánh giá: Tháng ${ev.month}/${ev.year})`, italics: true, size: 22 })] }),
        new Paragraph(''),
        new Paragraph(`Họ và tên: ${ev.name}`),
        new Paragraph(`Chức vụ / Vị trí việc làm: ${ev.position}`),
        new Paragraph(`Nhóm đối tượng: ${ev.typeLabel}`),
        new Paragraph(''),
        new Paragraph({ children: [new TextRun({ text: 'I. NHÓM TIÊU CHÍ CHUNG (Tối đa 30 điểm)', bold: true })] }),
        new Paragraph(`Điểm cấp có thẩm quyền đánh giá: ${ev.nhomI}`),
        new Paragraph(''),
        new Paragraph({ children: [new TextRun({ text: 'II. KẾT QUẢ THỰC HIỆN NHIỆM VỤ (Tối đa 70 điểm)', bold: true })] }),
        new Paragraph(`Điểm quy đổi: ${ev.kpi}% × 70% = ${ev.nhomII}`),
        new Paragraph(`(Trong đó: Tỷ lệ Khối lượng a = ${ev.a}%; Tỷ lệ Chất lượng b = ${ev.b}%; Tỷ lệ Tiến độ c = ${ev.c}%)`),
        new Paragraph(''),
        new Paragraph(`Điểm trừ: ${ev.deduction}`),
        new Paragraph({ children: [new TextRun({ text: `TỔNG ĐIỂM: ${ev.total} — XẾP LOẠI: ${ev.cls} (${ev.clsName})`, bold: true })] }),
        new Paragraph(''),
        new Paragraph(`Ý kiến tự nhận xét của cá nhân: ${ev.selfNote || '...'}`),
        new Paragraph(`Nhận xét, kết luận của cấp có thẩm quyền: ${ev.mgrNote || '...'}`),
      ],
    }],
  });
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

// PDF — Bảng kiểm đếm, theo dõi công việc (mở cửa sổ in; chọn "Lưu thành PDF" để xuất file).
// Trình bày như văn bản hành chính: tiêu đề đơn vị, tên bảng, tuần, bảng có khung, đầu bảng lặp lại mỗi trang.
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
        ${nameCell}
        <td class="ctr">${stt++}</td>
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

  const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8">
<title>Bảng kiểm đếm, theo dõi công việc</title>
<style>
  @page { size: A4 landscape; margin: 12mm 10mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Times New Roman', 'Be Vietnam Pro', Georgia, serif; color: #111; margin: 0; }
  .doc-head { text-align: center; margin-bottom: 10px; }
  .unit { font-weight: bold; text-transform: uppercase; font-size: 13px; letter-spacing: .3px; }
  .rule { width: 120px; height: 2px; background: #111; margin: 5px auto 12px; }
  .title { font-weight: bold; font-size: 19px; text-transform: uppercase; }
  .week { font-style: italic; font-size: 13px; margin-top: 3px; }
  table { width: 100%; border-collapse: collapse; font-size: 10px; table-layout: fixed; }
  thead { display: table-header-group; }
  th, td { border: 1px solid #555; padding: 4px 5px; vertical-align: top; text-align: left; word-wrap: break-word; }
  th { background: #e8eef7; font-weight: bold; text-align: center; }
  td.ctr { text-align: center; }
  td.nowrap { white-space: nowrap; }
  td.name { font-size: 11px; }
  td.name .pos { font-weight: normal; font-style: italic; color: #444; font-size: 9px; margin-top: 2px; }
  tbody tr { page-break-inside: avoid; }
  tbody tr:nth-child(even) td { background: #fafafa; }
  .empty { text-align: center; color: #888; font-style: italic; padding: 20px; }
  .sign { margin-top: 18px; display: flex; justify-content: flex-end; }
  .sign .box { text-align: center; min-width: 280px; }
  .sign .date { font-style: italic; font-size: 12px; }
  .sign .role { font-weight: bold; font-size: 12px; margin-top: 2px; }
  .sign .gap { height: 64px; }
  .sign .hint { font-style: italic; font-size: 10px; color: #555; }
  .col-stt { width: 30px; } .col-time { width: 64px; }
</style></head>
<body>
  <div class="doc-head">
    <div class="unit">${esc(unit)}</div>
    <div class="rule"></div>
    <div class="title">Bảng kiểm đếm, theo dõi công việc</div>
    <div class="week">${esc(weekTitle)}</div>
  </div>
  <table>
    <colgroup>
      <col style="width:120px"><col class="col-stt"><col style="width:18%"><col style="width:12%">
      <col style="width:14%"><col style="width:10%"><col class="col-time"><col class="col-time">
      <col style="width:12%"><col style="width:12%"><col style="width:11%"><col style="width:11%"><col style="width:8%">
    </colgroup>
    <thead>
      <tr>
        <th rowspan="2">Họ và tên<br>cán bộ</th>
        <th rowspan="2">STT</th>
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
  </div>
  <script>window.onload = function(){ setTimeout(function(){ window.focus(); window.print(); }, 350); };</script>
</body></html>`;

  const w = window.open('', '_blank');
  if (!w) { alert('Trình duyệt đã chặn cửa sổ in. Vui lòng cho phép pop-up cho trang này rồi thử lại.'); return; }
  w.document.open();
  w.document.write(html);
  w.document.close();
}
