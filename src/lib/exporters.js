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

// WORD — Phiếu đánh giá cá nhân (file .docx sửa được)
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
