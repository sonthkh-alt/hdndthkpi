import { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import { ngachOf, catOf, fmtD, retireDate, nextRaise } from './hr';

// ============================================================================
// WORD — SƠ YẾU LÝ LỊCH CÁN BỘ, CÔNG CHỨC (Mẫu 2C/TCTW-98)
// Bố cục theo mẫu của Ban Tổ chức Trung ương: khối tiêu đề · 31 mục thông tin ·
// bảng đào tạo, bồi dưỡng · tóm tắt quá trình công tác · quan hệ gia đình · phần ký xác nhận.
// ============================================================================
const FONT = 'Times New Roman';
const SINGLE = { style: BorderStyle.SINGLE, size: 4, color: '888888' };
const NONE = { style: BorderStyle.NONE };
const CELL_BORDERS = { top: SINGLE, bottom: SINGLE, left: SINGLE, right: SINGLE };
const NO_BORDERS = { top: NONE, bottom: NONE, left: NONE, right: NONE };

function P(text, opts = {}) {
  const { bold = false, italics = false, align = AlignmentType.LEFT, size = 26, spacingAfter = 0, color } = opts;
  const runs = Array.isArray(text) ? text : [{ text, bold, italics, color }];
  return new Paragraph({
    alignment: align,
    spacing: { after: spacingAfter, line: 300 },
    children: runs.map((r) => new TextRun({ text: String(r.text ?? ''), bold: r.bold ?? bold, italics: r.italics ?? italics, color: r.color ?? color, size, font: FONT })),
  });
}
function TC(text, opts = {}) {
  const { bold = false, align = AlignmentType.LEFT, width, size = 20, shade, italics = false } = opts;
  return new TableCell({
    width: width ? { size: width, type: WidthType.PERCENTAGE } : undefined,
    shading: shade ? { fill: shade } : undefined,
    borders: CELL_BORDERS,
    margins: { top: 40, bottom: 40, left: 70, right: 70 },
    verticalAlign: 'center',
    children: [new Paragraph({ alignment: align, spacing: { line: 260 }, children: [new TextRun({ text: String(text ?? ''), bold, italics, size, font: FONT })] })],
  });
}
const DOTS = '...................................................................................................................';

export async function exportLyLich2C(s, unit) {
  const C = AlignmentType.CENTER, R = AlignmentType.RIGHT;
  const ng = ngachOf(s.ngach);
  const gender = s.gender === 'nu' ? 'Nữ' : 'Nam';
  const children = [];

  // ---------------- Đầu trang ----------------
  children.push(P('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', { bold: true, size: 24, align: C }));
  children.push(P('Độc lập - Tự do - Hạnh phúc', { bold: true, size: 24, align: C }));
  children.push(P('_______________________', { size: 20, align: C, spacingAfter: 160 }));
  children.push(P('SƠ YẾU LÝ LỊCH', { bold: true, size: 32, align: C }));
  children.push(P('CÁN BỘ, CÔNG CHỨC', { bold: true, size: 28, align: C }));
  children.push(P('(Mẫu 2C/TCTW-98)', { italics: true, size: 20, align: C, spacingAfter: 120 }));
  children.push(P(unit || '', { bold: true, size: 24, align: C, spacingAfter: 200 }));

  // ---------------- Mục 1–31 ----------------
  const line = (no, label, value, extra) => children.push(P([
    { text: `${no}. ${label}: `, bold: true },
    { text: String(value || '.....................................') },
    ...(extra ? [{ text: `    ${extra}` }] : []),
  ], { size: 24, spacingAfter: 40 }));

  line(1, 'Họ và tên khai sinh (viết chữ in hoa)', (s.name || '').toUpperCase());
  line(2, 'Các tên gọi khác', s.otherName);
  line(3, 'Sinh ngày', fmtD(s.birth), `Giới tính: ${gender}`);
  line(4, 'Nơi sinh', s.birthPlace);
  line(5, 'Quê quán', s.hometown);
  line(6, 'Dân tộc', s.ethnic, `Tôn giáo: ${s.religion || 'Không'}`);
  line(8, 'Nơi đăng ký hộ khẩu thường trú', s.residence);
  line(9, 'Nơi ở hiện nay', s.address);
  line(10, 'Nghề nghiệp khi được tuyển dụng', s.jobWhenHired);
  line(11, 'Ngày tuyển dụng', fmtD(s.hireDate), `Cơ quan tuyển dụng: ${s.hireAgency || '...'}`);
  line(12, 'Chức vụ (chức danh) hiện tại', s.position);
  children.push(P([
    { text: '     (Về chính quyền: ' }, { text: s.position || '...' },
    { text: '; về Đảng: ' }, { text: s.partyPosition || 'không' },
    { text: '; đoàn thể: ' }, { text: s.unionPosition || 'không' }, { text: ')' },
  ], { size: 22, italics: true, spacingAfter: 40 }));
  line(13, 'Công việc chính được giao', s.mainWork);
  children.push(P([
    { text: '14. Ngạch công chức: ', bold: true }, { text: `${ng.name} (${ng.code})` },
    { text: '    Bậc: ', bold: true }, { text: `${s.bac}/${ng.bacMax}` },
    { text: '    Hệ số: ', bold: true }, { text: String(s.heso ?? '') },
    { text: '    Ngày hưởng: ', bold: true }, { text: fmtD(s.salaryDate) || '...' },
    { text: '    Vượt khung: ', bold: true }, { text: `${s.vuotKhungPct || 0}%` },
  ], { size: 24, spacingAfter: 40 }));
  line(15, 'Trình độ giáo dục phổ thông', s.eduGeneral);
  line(16, 'Trình độ chuyên môn cao nhất', s.eduMajor, s.eduDegree ? `Học hàm, học vị: ${s.eduDegree}` : '');
  line(17, 'Lý luận chính trị', s.politics);
  line(18, 'Quản lý nhà nước', s.stateAdmin);
  line(19, 'Ngoại ngữ', s.foreignLang);
  line(20, 'Tin học', s.it);
  line(21, 'Ngày vào Đảng Cộng sản Việt Nam', fmtD(s.partyDate), `Ngày chính thức: ${fmtD(s.partyOfficialDate) || '...'}`);
  line(22, 'Ngày tham gia tổ chức chính trị - xã hội', fmtD(s.unionDate));
  line(23, 'Ngày nhập ngũ', fmtD(s.armyIn), `Ngày xuất ngũ: ${fmtD(s.armyOut) || '...'}   Quân hàm cao nhất: ${s.armyRank || '...'}`);
  line(24, 'Danh hiệu được phong tặng cao nhất', s.honour);
  line(25, 'Sở trường công tác', s.strength);
  line(26, 'Khen thưởng', s.reward);
  line(27, 'Kỷ luật', s.discipline);
  line(28, 'Tình trạng sức khỏe', s.health, `Chiều cao: ${s.height || '...'} cm   Cân nặng: ${s.weight || '...'} kg   Nhóm máu: ${s.bloodType || '...'}`);
  line(29, 'Thương binh hạng / con gia đình chính sách', s.policyFamily);
  line(30, 'Số căn cước công dân', s.idNumber, `Ngày cấp: ${fmtD(s.idDate) || '...'}   Nơi cấp: ${s.idPlace || '...'}`);
  line(31, 'Số sổ bảo hiểm xã hội', s.insuranceNo);

  // ---------------- 32. Đào tạo, bồi dưỡng ----------------
  children.push(P('', { spacingAfter: 100 }));
  children.push(P('32. ĐÀO TẠO, BỒI DƯỠNG VỀ CHUYÊN MÔN, NGHIỆP VỤ, LÝ LUẬN CHÍNH TRỊ, NGOẠI NGỮ, TIN HỌC', { bold: true, size: 24, spacingAfter: 80 }));
  const tRows = [new TableRow({ tableHeader: true, children: [
    TC('Tên trường, cơ sở đào tạo', { bold: true, align: C, shade: 'E8EEF7', width: 28 }),
    TC('Chuyên ngành đào tạo, bồi dưỡng', { bold: true, align: C, shade: 'E8EEF7', width: 26 }),
    TC('Từ tháng, năm', { bold: true, align: C, shade: 'E8EEF7', width: 12 }),
    TC('Đến tháng, năm', { bold: true, align: C, shade: 'E8EEF7', width: 12 }),
    TC('Hình thức đào tạo', { bold: true, align: C, shade: 'E8EEF7', width: 11 }),
    TC('Văn bằng, chứng chỉ', { bold: true, align: C, shade: 'E8EEF7', width: 11 }),
  ] })];
  const trainings = (s.training || []).length ? s.training : [{}, {}, {}];
  trainings.forEach((t) => tRows.push(new TableRow({ children: [
    TC(t.school || ''), TC(t.major || ''),
    TC(t.from || '', { align: C }), TC(t.to || '', { align: C }),
    TC(t.form || '', { align: C }), TC(t.degree || '', { align: C }),
  ] })));
  children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: tRows }));

  // ---------------- 33. Quá trình công tác ----------------
  children.push(P('', { spacingAfter: 140 }));
  children.push(P('33. TÓM TẮT QUÁ TRÌNH CÔNG TÁC', { bold: true, size: 24, spacingAfter: 80 }));
  const hRows = [new TableRow({ tableHeader: true, children: [
    TC('Từ tháng, năm đến tháng, năm', { bold: true, align: C, shade: 'E8EEF7', width: 26 }),
    TC('Chức danh, chức vụ, đơn vị công tác (đảng, chính quyền, đoàn thể, tổ chức xã hội), kể cả thời gian được đào tạo, bồi dưỡng về chuyên môn, nghiệp vụ...', { bold: true, align: C, shade: 'E8EEF7', width: 74 }),
  ] })];
  const hist = (s.history || []).length ? s.history : [{}, {}, {}, {}];
  hist.forEach((h) => hRows.push(new TableRow({ children: [
    TC([h.from, h.to].filter(Boolean).join(' - '), { align: C }),
    TC(h.content || ''),
  ] })));
  children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: hRows }));

  // ---------------- 34. Đặc điểm lịch sử bản thân ----------------
  children.push(P('', { spacingAfter: 140 }));
  children.push(P('34. ĐẶC ĐIỂM LỊCH SỬ BẢN THÂN', { bold: true, size: 24, spacingAfter: 40 }));
  children.push(P(s.selfHistory || DOTS, { size: 24, spacingAfter: 140 }));

  // ---------------- 35. Quan hệ gia đình ----------------
  children.push(P('35. QUAN HỆ GIA ĐÌNH', { bold: true, size: 24, spacingAfter: 80 }));
  const fRows = [new TableRow({ tableHeader: true, children: [
    TC('Mối quan hệ', { bold: true, align: C, shade: 'E8EEF7', width: 16 }),
    TC('Họ và tên', { bold: true, align: C, shade: 'E8EEF7', width: 26 }),
    TC('Năm sinh', { bold: true, align: C, shade: 'E8EEF7', width: 12 }),
    TC('Nghề nghiệp, chức danh, chức vụ, đơn vị công tác, nơi ở', { bold: true, align: C, shade: 'E8EEF7', width: 46 }),
  ] })];
  const fam = (s.family || []).length ? s.family : [{}, {}, {}, {}];
  fam.forEach((f) => fRows.push(new TableRow({ children: [
    TC(f.relation || ''), TC(f.name || ''), TC(f.birth || '', { align: C }), TC(f.info || ''),
  ] })));
  children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: fRows }));

  // ---------------- 36–37 ----------------
  children.push(P('', { spacingAfter: 140 }));
  children.push(P('36. HOÀN CẢNH KINH TẾ GIA ĐÌNH', { bold: true, size: 24, spacingAfter: 40 }));
  children.push(P(s.economy || DOTS, { size: 24, spacingAfter: 120 }));
  children.push(P('37. NHẬN XÉT, ĐÁNH GIÁ CỦA CƠ QUAN, ĐƠN VỊ QUẢN LÝ VÀ SỬ DỤNG CÁN BỘ, CÔNG CHỨC', { bold: true, size: 24, spacingAfter: 40 }));
  children.push(P(s.remark || DOTS, { size: 24, spacingAfter: 160 }));

  // ---------------- Mốc theo dõi của cơ quan (ngoài biểu mẫu gốc) ----------------
  const raise = nextRaise(s), retire = retireDate(s.birth, s.gender);
  children.push(P('Thông tin theo dõi của cơ quan quản lý (không thuộc biểu mẫu gốc):', { bold: true, italics: true, size: 21, spacingAfter: 40 }));
  children.push(P(`- Đối tượng quản lý: ${catOf(s.category).label}.`, { size: 21, spacingAfter: 20 }));
  if (raise) children.push(P(`- ${raise.label}: dự kiến ${fmtD(raise.date)} (chu kỳ ${raise.cycle} tháng theo Thông tư 08/2013/TT-BNV).`, { size: 21, spacingAfter: 20 }));
  if (retire) children.push(P(`- Thời điểm nghỉ hưu dự kiến: ${fmtD(retire)} (lộ trình Nghị định 135/2020/NĐ-CP).`, { size: 21, spacingAfter: 20 }));
  if (s.contractTo) children.push(P(`- Hợp đồng lao động đến ngày: ${fmtD(s.contractTo)}.`, { size: 21, spacingAfter: 20 }));
  if (s.sample) children.push(P('- Lưu ý: hồ sơ đang được đánh dấu "dữ liệu mô phỏng", cần đối chiếu, cập nhật theo hồ sơ gốc.', { size: 21, italics: true, color: 'B45309', spacingAfter: 20 }));

  // ---------------- Ký ----------------
  children.push(P('', { spacingAfter: 200 }));
  const now = new Date();
  children.push(P(`Thanh Hóa, ngày ${now.getDate()} tháng ${now.getMonth() + 1} năm ${now.getFullYear()}`, { italics: true, size: 24, align: R, spacingAfter: 60 }));
  const signCell = (title, sub) => new TableCell({
    width: { size: 50, type: WidthType.PERCENTAGE }, borders: NO_BORDERS,
    children: [P(title, { bold: true, size: 24, align: C }), P(sub, { italics: true, size: 20, align: C })],
  });
  children.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: { ...NO_BORDERS, insideHorizontal: NONE, insideVertical: NONE },
    rows: [new TableRow({ children: [signCell('NGƯỜI KHAI', '(Ký, ghi rõ họ tên)'), signCell('THỦ TRƯỞNG CƠ QUAN, ĐƠN VỊ', '(Ký tên, đóng dấu)')] })],
  }));

  const doc = new Document({ sections: [{ properties: { page: { margin: { top: 1000, bottom: 1000, left: 1200, right: 900 } } }, children }] });
  const blob = await Packer.toBlob(doc);
  const safe = (s.name || 'can-bo').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd').replace(/[^A-Za-z0-9]+/g, '-');
  saveAs(blob, `SYLL-2C_${safe}.docx`);
}
