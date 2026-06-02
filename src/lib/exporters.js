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

// WORD — Phiếu đánh giá cá nhân
export async function exportWordPhieu(ev) {
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: ev.unit, bold: true, size: 24 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'PHIẾU ĐÁNH GIÁ, XẾP LOẠI HẰNG THÁNG', bold: true, size: 30 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Tháng ${ev.month}/${ev.year}`, italics: true, size: 22 })] }),
        new Paragraph(''),
        new Paragraph(`Họ và tên: ${ev.name}`),
        new Paragraph(`Chức vụ / Vị trí việc làm: ${ev.position}`),
        new Paragraph(`Nhóm đối tượng: ${ev.typeLabel}`),
        new Paragraph(''),
        new Paragraph(`I. Điểm tiêu chí chung (tối đa 30): ${ev.nhomI}`),
        new Paragraph(`II. Kết quả thực hiện nhiệm vụ — KPI quy đổi ${ev.kpi}% × 70% (tối đa 70): ${ev.nhomII}`),
        new Paragraph(`Điểm trừ: ${ev.deduction}`),
        new Paragraph({ children: [new TextRun({ text: `TỔNG ĐIỂM: ${ev.total} — XẾP LOẠI: ${ev.cls} (${ev.clsName})`, bold: true })] }),
        new Paragraph(''),
        new Paragraph(`Tự nhận xét của cá nhân: ${ev.selfNote || '...'}`),
        new Paragraph(`Nhận xét, kết luận của cấp có thẩm quyền: ${ev.mgrNote || '...'}`),
      ],
    }],
  });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Phieu_${(ev.name || 'canbo').replace(/\s+/g, '_')}_${ev.month}_${ev.year}.docx`);
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
          i === 0 ? p.name : '', // Gộp cột tên logic bằng cách để trống nếu là dòng T2
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
