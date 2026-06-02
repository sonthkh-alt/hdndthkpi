import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

// EXCEL â Máº«u 1A tá»ng há»£p
export function exportExcel1A(rows, period, unit) {
  const aoa = [
    [unit],
    [`DANH SÃCH Tá»NG Há»¢P Káº¾T QUáº¢ ÄÃNH GIÃ, Xáº¾P LOáº I - ThÃ¡ng ${period.month}/${period.year}`],
    [],
    ['STT', 'Há» vÃ  tÃªn', 'Chá»©c vá»¥', 'Tá»± ÄÃ¡nh giÃ¡', 'Cáº¥p duyá»t', 'Xáº¿p loáº¡i'],
    ...rows.map((r, i) => [i + 1, r.name, r.position, r.self, r.mgr, r.cls]),
  ];
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws['!cols'] = [{ wch: 5 }, { wch: 26 }, { wch: 24 }, { wch: 12 }, { wch: 12 }, { wch: 10 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Mau 1A');
  XLSX.writeFile(wb, `Mau1A_${period.month}_${period.year}.xlsx`);
}

// WORD â Phiáº¿u ÄÃ¡nh giÃ¡ cÃ¡ nhÃ¢n
export async function exportWordPhieu(ev) {
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: ev.unit, bold: true, size: 24 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'PHIáº¾U ÄÃNH GIÃ, Xáº¾P LOáº I Háº°NG THÃNG', bold: true, size: 30 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `ThÃ¡ng ${ev.month}/${ev.year}`, italics: true, size: 22 })] }),
        new Paragraph(''),
        new Paragraph(`Há» vÃ  tÃªn: ${ev.name}`),
        new Paragraph(`Chá»©c vá»¥ / Vá» trÃ­ viá»c lÃ m: ${ev.position}`),
        new Paragraph(`NhÃ³m Äá»i tÆ°á»£ng: ${ev.typeLabel}`),
        new Paragraph(''),
        new Paragraph(`I. Äiá»m tiÃªu chÃ­ chung (tá»i Äa 30): ${ev.nhomI}`),
        new Paragraph(`II. Káº¿t quáº£ thá»±c hiá»n nhiá»m vá»¥ â KPI quy Äá»i ${ev.kpi}% Ã 70% (tá»i Äa 70): ${ev.nhomII}`),
        new Paragraph(`Äiá»m trá»«: ${ev.deduction}`),
        new Paragraph({ children: [new TextRun({ text: `Tá»NG ÄIá»M: ${ev.total} â Xáº¾P LOáº I: ${ev.cls} (${ev.clsName})`, bold: true })] }),
        new Paragraph(''),
        new Paragraph(`Tá»± nháº­n xÃ©t cá»§a cÃ¡ nhÃ¢n: ${ev.selfNote || '...'}`),
        new Paragraph(`Nháº­n xÃ©t, káº¿t luáº­n cá»§a cáº¥p cÃ³ tháº©m quyá»n: ${ev.mgrNote || '...'}`),
      ],
    }],
  });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Phieu_${(ev.name || 'canbo').replace(/\s+/g, '_')}_${ev.month}_${ev.year}.docx`);
}

// EXCEL â Báº£ng kiá»m Äáº¿m, theo dÃµi cÃ´ng viá»c
export function exportTrackingExcel(people, weekTitle, unit) {
  const aoa = [
    [`Báº¢NG KIá»M Äáº¾M, THEO DÃI CÃNG VIá»C Cá»¦A ${unit.toUpperCase()}`],
    [weekTitle],
    [],
    [
      'Há» tÃªn cÃ¡n bá», cÃ´ng chá»©c nháº­p dá»¯ liá»u', // 0
      'STT', // 1
      'Ná»i dung cÃ´ng viá»c', // 2
      'ÄÆ¡n vá», Äá»a phÆ°Æ¡ng chá»§ trÃ¬, phá»i há»£p', // 3
      'Ã kiáº¿n chá» Äáº¡o cá»¥ thá» cá»§a TT HÄND tá»nh', // 4
      'Sáº£n pháº©m cuá»i cÃ¹ng', // 5
      'Tiáº¿n Äá» thá»±c hiá»n', // 6
      null, null, null,
      'KhÃ³ khÄn, vÆ°á»ng máº¯c, ná»i dung lÃ m rÃµ (náº¿u cÃ³)', // 10
      'Äá» xuáº¥t, kiáº¿n nghá» vá»i TT HÄND tá»nh', // 11
      'Ghi chÃº' // 12
    ],
    [
      null, null, null, null, null, null,
      'Má»c thá»i gian', // 6
      null,
      'CÃ´ng viá»c ÄÃ£ thá»±c hiá»n', // 8
      'CÃ´ng viá»c Äang thá»±c hiá»n', // 9
      null, null, null
    ],
    [
      null, null, null, null, null, null,
      'Triá»n khai', // 6
      'HoÃ n thÃ nh', // 7
      null, null, null, null, null
    ]
  ];

  let stt = 1;
  people.forEach(p => {
    if (p.trackings && p.trackings.length > 0) {
      p.trackings.forEach((t, i) => {
        aoa.push([
          i === 0 ? p.name : '', // Gá»p cá»t tÃªn logic báº±ng cÃ¡ch Äá» trá»ng náº¿u lÃ  dÃ²ng T2
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
  
  // Ãp dá»¥ng Äá»nh dáº¡ng gá»p Ã´ (merged cells) theo ÄÃºng Form
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 12 } }, // TiÃªu Äá» báº£ng
    { s: { r: 1, c: 0 }, e: { r: 1, c: 12 } }, // TiÃªu Äá» tuáº§n
    { s: { r: 3, c: 0 }, e: { r: 5, c: 0 } }, // Há» tÃªn
    { s: { r: 3, c: 1 }, e: { r: 5, c: 1 } }, // STT
    { s: { r: 3, c: 2 }, e: { r: 5, c: 2 } }, // Ná»i dung
    { s: { r: 3, c: 3 }, e: { r: 5, c: 3 } }, // ÄÆ¡n vá» phá»i há»£p
    { s: { r: 3, c: 4 }, e: { r: 5, c: 4 } }, // Ã kiáº¿n chá» Äáº¡o
    { s: { r: 3, c: 5 }, e: { r: 5, c: 5 } }, // Sáº£n pháº©m cuá»i cÃ¹ng
    { s: { r: 3, c: 6 }, e: { r: 3, c: 9 } }, // [Group] Tiáº¿n Äá» thá»±c hiá»n
    { s: { r: 4, c: 6 }, e: { r: 4, c: 7 } }, // [Group] Má»c thá»i gian
    { s: { r: 4, c: 8 }, e: { r: 5, c: 8 } }, // CÃ´ng viá»c ÄÃ£ thá»±c hiá»n
    { s: { r: 4, c: 9 }, e: { r: 5, c: 9 } }, // CÃ´ng viá»c Äang thá»±c hiá»n
    { s: { r: 3, c: 10 }, e: { r: 5, c: 10 } }, // KhÃ³ khÄn
    { s: { r: 3, c: 11 }, e: { r: 5, c: 11 } }, // Äá» xuáº¥t
    { s: { r: 3, c: 12 }, e: { r: 5, c: 12 } }  // Ghi chÃº
  ];

  // Äáº·t Äá» rá»ng cá»t cho phÃ¹ há»£p
  ws['!cols'] = [
    { wch: 20 }, { wch: 5 }, { wch: 30 }, { wch: 25 }, { wch: 30 }, { wch: 20 },
    { wch: 12 }, { wch: 12 }, { wch: 30 }, { wch: 30 }, { wch: 25 }, { wch: 25 }, { wch: 15 }
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Theo_doi_CV');
  
  // RÃºt gá»n tÃªn file export
  const safeTitle = weekTitle.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
  XLSX.writeFile(wb, `KiemDem_${safeTitle}.xlsx`);
}

// WORD — Phiếu đánh giá cá nhân (NĐ 335)
export async function exportWordPhieu335(ev) {
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: ev.unit.toUpperCase(), bold: true, size: 24 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', bold: true, size: 24 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Độc lập - Tự do - Hạnh phúc', bold: true, size: 24 })] }),
        new Paragraph(''),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'PHIẾU THEO DÕI, ĐÁNH GIÁ CÔNG CHỨC', bold: true, size: 30 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `(Kỳ theo dõi, đánh giá: Tháng ${ev.month}/${ev.year})`, italics: true, size: 22 })] }),
        new Paragraph(''),
        new Paragraph(`Họ và tên: ${ev.name}`),
        new Paragraph(`Chức vụ, chức danh: ${ev.position}`),
        new Paragraph(`Đơn vị công tác: ${ev.unit}`),
        new Paragraph(''),
        new Paragraph({ children: [new TextRun({ text: 'I. KẾT QUẢ THEO DÕI, ĐÁNH GIÁ THEO TIÊU CHÍ CHUNG (Tối đa 30 điểm)', bold: true })] }),
        new Paragraph(`Điểm tự đánh giá: ${ev.n335Part1Self}`),
        new Paragraph(`Điểm cấp có thẩm quyền đánh giá: ${ev.n335Part1Mgr}`),
        new Paragraph(''),
        new Paragraph({ children: [new TextRun({ text: 'II. TỔNG HỢP KẾT QUẢ THEO DÕI, ĐÁNH GIÁ CÔNG CHỨC', bold: true })] }),
        new Paragraph(`1. Điểm tiêu chí chung: ${ev.n335Part1Mgr}`),
        new Paragraph(`2. Điểm tiêu chí kết quả thực hiện nhiệm vụ: ${ev.nhomII335.toFixed(2)}`),
        new Paragraph(`(Trong đó: Tỷ lệ Khối lượng a = ${ev.k335.a.toFixed(2)}%; Tỷ lệ Chất lượng b = ${ev.k335.b.toFixed(2)}%; Tỷ lệ Tiến độ c = ${ev.k335.c.toFixed(2)}%)`),
        new Paragraph({ children: [new TextRun({ text: `3. Tổng điểm theo dõi, đánh giá công chức: ${ev.total335Mgr.toFixed(2)}`, bold: true })] }),
        new Paragraph(''),
        new Paragraph(`4. Ưu điểm: ${ev.selfNote || '...'}`),
        new Paragraph(`5. Hạn chế, khuyết điểm: ${ev.mgrNote || '...'}`),
        new Paragraph(''),
        new Paragraph({ children: [new TextRun({ text: `III. KẾT QUẢ XẾP LOẠI CHẤT LƯỢNG CỦA CẤP CÓ THẨM QUYỀN: ${ev.clsName.toUpperCase()}`, bold: true })] }),
      ],
    }],
  });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Phieu_ND335_${(ev.name || 'canbo').replace(/\s+/g, '_')}_${ev.month}_${ev.year}.docx`);
}
