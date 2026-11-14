// ============================================================================
//  DANH MỤC NGUỒN ĐÃ TRA CỨU TRÊN INTERNET cho 06 sổ tay AI
//  + bộ HỢP NHẤT vào dữ liệu đang có trên máy chủ (THUẦN — Node chạy được).
//
//  Mỗi văn bản có số hiệu, cơ quan, ngày ban hành và ĐƯỜNG DẪN CÔNG KHAI tới
//  toàn văn — đủ để dán thẳng vào NotebookLM (Thêm nguồn → Trang web).
//
//  ⚠️ VẪN LÀ "VIỆC CẦN LÀM", KHÔNG PHẢI KHẲNG ĐỊNH PHÁP LÝ. Tra cứu tự động chỉ
//     giúp cán bộ khỏi mất công tìm; phần mềm KHÔNG tự đánh dấu "còn hiệu lực",
//     "đã kiểm tra" hay "đã xác nhận công khai". Kết quả tra cứu được ghi vào
//     ô Ghi chú để cán bộ đối chiếu rồi tự chuyển trạng thái — đúng trách nhiệm
//     đã đăng ký ("chủ trì chọn, KIỂM TRA nguồn chính thống, CÒN HIỆU LỰC").
//
//  ⚠️ HỢP NHẤT CHẠY MỘT LẦN cho mỗi phiên bản danh mục (`TRA_CUU_V`, lưu ở
//     `doc.traCuuV`): nhờ vậy văn bản cán bộ đã chủ động xóa không tự quay lại.
//     Muốn đẩy bản tra cứu mới lên dữ liệu đang chạy thì TĂNG `TRA_CUU_V`.
// ============================================================================
import { boDau, newId } from './soTayAI.js';

export const TRA_CUU_V = 1;
export const NGAY_TRA_CUU = '2026-11-14';

// Đường dẫn ưu tiên bản CÔNG BÁO có lớp chữ (congbaocdn.chinhphu.vn): nhiều bản ký số trên
// vanban.chinhphu.vn là PDF ẢNH QUÉT, NotebookLM có thể không đọc được chữ.
const CB = 'https://congbaocdn.chinhphu.vn/CongBaoCP/VanBan';
const CB26 = 'https://congbaocdn.chinhphu.vn/180507251028987904/2026';
const L72 = 'https://datafiles.chinhphu.vn/cpp/files/vbpq/2025/7/2025_807-808_72-2025-qh15..pdf'; // ".." đúng tên tệp gốc
const L103 = `${CB}/2025/9/46508/59571-1-20251555-1556103-2025-ubtvqh15.pdf`;
const L01TH = 'https://dbndthanhhoa.gov.vn/portal/VanBan/2026-05/01.2026.NQ_-dMUSIP1dUJfy2QW.pdf';
const L64 = `${CB}/2025/2/44584/55716-1-2025603-60464-2025-qh15.pdf`;
const L87 = `${CB}/2025/6/45526/57608-1-2025955-95687-2025-qh15.pdf`;
const L78 = `${CB}/2025/4/44704/56011-1-2025649-65078-2025-nd-cp.pdf`;
const L121 = `${CB26}/1/27/121signed-1769482654920799815098.pdf`;
const L114 = 'https://vanban.chinhphu.vn/?pageid=27160&docid=216743';
const L116 = 'https://vanban.chinhphu.vn/?pageid=27160&docid=216745';
const QUET = 'PDF ảnh quét (không có lớp chữ) — nạp xong phải kiểm tra NotebookLM có đọc được chữ không';
const TAI = 'trang chỉ có thông tin văn bản, toàn văn là tệp đính kèm — TẢI TỆP VỀ rồi tải lên NotebookLM';

// [mã sổ tay, số hiệu, tên, cơ quan, ngày ban hành (YYYY-MM-DD), đường dẫn, phạm vi + kết quả tra cứu,
//  tên nguồn gợi ý cũ mà văn bản này thay vào (để điền chứ không thêm trùng), cách nạp: 'url' | 'tai']
//  `tai` = đường dẫn không dán thẳng vào NotebookLM được (trang thông tin, tệp .doc/.docx) — phải tải tệp về.
export const NGUON_TRA_CUU = [
  // ── ST-01 Tổ chức và hoạt động của HĐND ──
  ['ST-01', '72/2025/QH15', 'Luật Tổ chức chính quyền địa phương', 'Quốc hội', '2025-06-16', L72,
    'Điều 5, 15, 21, 29-33 (HĐND, Thường trực, các Ban, Tổ đại biểu). Hiệu lực từ 16/6/2025, thay Luật 65/2025/QH15 (theo vanban.chinhphu.vn); chưa thấy luật sửa đổi',
    ['Luật Tổ chức chính quyền địa phương']],
  ['ST-01', '103/2025/UBTVQH15', 'Nghị quyết ban hành Quy chế làm việc mẫu của Hội đồng nhân dân tỉnh, thành phố', 'Ủy ban Thường vụ Quốc hội', '2025-09-26', L103,
    'Toàn bộ Quy chế mẫu: nguyên tắc, chế độ làm việc, Thường trực HĐND (Điều 20-25), các Ban, Tổ đại biểu. Hiệu lực từ 26/9/2025 (Công báo số 1555+1556). Tệp ~72 MB, ' + QUET,
    ['Nghị quyết của UBTVQH hướng dẫn tổ chức, hoạt động của HĐND']],
  ['ST-01', '106/2025/UBTVQH15', 'Nghị quyết quy định số lượng Phó Chủ tịch HĐND, Phó Trưởng Ban của HĐND cấp tỉnh, cấp xã và việc bố trí đại biểu HĐND hoạt động chuyên trách', 'Ủy ban Thường vụ Quốc hội', '2025-10-16',
    'https://luatvietnam.vn/hanh-chinh/nghi-quyet-106-2025-ubtvqh15-quy-dinh-so-luong-pho-chu-tich-va-pho-truong-ban-hdnd-cap-tinh-xa-416679-d1.html',
    'Số Phó Chủ tịch, Phó Trưởng Ban, đại biểu chuyên trách. Hiệu lực từ 16/10/2025 (theo luatvietnam.vn — chưa thấy bản trên Công báo). Trang chặn truy cập tự động: NotebookLM không lấy được thì chép toàn văn dán vào nguồn dạng văn bản'],
  ['ST-01', '1206/2016/NQ-UBTVQH13', 'Nghị quyết quy định về chế độ, chính sách và các điều kiện bảo đảm hoạt động của đại biểu Hội đồng nhân dân', 'Ủy ban Thường vụ Quốc hội', '2016-05-13',
    'https://congbao.chinhphu.vn/van-ban/nghi-quyet-so-1206-2016-nq-ubtvqh13-19654.htm',
    'Hiệu lực từ 01/7/2016, vẫn còn áp dụng; ⚠️ UBTVQH đã đưa nghị quyết thay thế vào chương trình 2026 (NQ 18/2026/UBTVQH16) — kiểm tra lại trước khi nạp. ' + TAI + ' (PDF ảnh quét)', [], 'tai'],
  ['ST-01', '1004/2020/UBTVQH14', 'Nghị quyết về thành lập và quy định vị trí, chức năng, nhiệm vụ, quyền hạn, cơ cấu tổ chức của Văn phòng Đoàn ĐBQH và HĐND cấp tỉnh', 'Ủy ban Thường vụ Quốc hội', '2020-09-18',
    `${CB}/2020/9/32199/32827-1-2020957-9581004-2020-ubtvqh14.pdf`,
    'Toàn văn: chức năng, nhiệm vụ, cơ cấu tổ chức của Văn phòng. Hiệu lực từ 01/01/2021; Hướng dẫn 1309/HD-UBTVQH15 (6/2025) vẫn dẫn chiếu',
    ['Quyết định quy định chức năng, nhiệm vụ của Văn phòng Đoàn ĐBQH và HĐND tỉnh']],
  ['ST-01', '01/2026/NQ-HĐND', 'Nghị quyết ban hành Quy chế làm việc của Hội đồng nhân dân tỉnh Thanh Hóa khóa XIX, nhiệm kỳ 2026-2031', 'HĐND tỉnh Thanh Hóa', '2026-05-27', L01TH,
    'Quy chế làm việc của HĐND, Thường trực HĐND (không có quy chế riêng của Thường trực), các Ban, Tổ đại biểu tỉnh Thanh Hóa. Thông qua tại Kỳ họp thứ 2 khóa XIX, hiệu lực từ 06/6/2026 (đọc trên bản ký số tại dbndthanhhoa.gov.vn). ' + QUET,
    ['Quy chế làm việc của Thường trực HĐND tỉnh Thanh Hóa']],

  // ── ST-02 Kỳ họp và công tác thẩm tra ──
  ['ST-02', '72/2025/QH15', 'Luật Tổ chức chính quyền địa phương', 'Quốc hội', '2025-06-16', L72,
    'Điều 31, 32, 34-36: kỳ họp HĐND (thường lệ, chuyên đề, triệu tập), biểu quyết, bầu các chức danh. Hiệu lực từ 16/6/2025',
    ['Luật Tổ chức chính quyền địa phương - phần kỳ họp HĐND']],
  ['ST-02', '103/2025/UBTVQH15', 'Nghị quyết ban hành Quy chế làm việc mẫu của Hội đồng nhân dân tỉnh, thành phố', 'Ủy ban Thường vụ Quốc hội', '2025-09-26', L103,
    'Điều 4-19 (chuẩn bị, triệu tập, chương trình, trình tự kỳ họp, biên bản, tài liệu) và Điều 28-29 (thẩm tra của các Ban). Hiệu lực từ 26/9/2025. ' + QUET,
    ['Hướng dẫn của UBTVQH về hoạt động thẩm tra của các Ban HĐND']],
  ['ST-02', '01/2026/NQ-HĐND', 'Nghị quyết ban hành Quy chế làm việc của Hội đồng nhân dân tỉnh Thanh Hóa khóa XIX, nhiệm kỳ 2026-2031', 'HĐND tỉnh Thanh Hóa', '2026-05-27', L01TH,
    'Phần kỳ họp: chuẩn bị, triệu tập, thẩm tra của các Ban, chất vấn, biểu quyết, biên bản và nghị quyết kỳ họp. Hiệu lực từ 06/6/2026. ' + QUET,
    ['Nghị quyết ban hành Quy chế hoạt động của HĐND tỉnh']],
  ['ST-02', '64/2025/QH15', 'Luật Ban hành văn bản quy phạm pháp luật', 'Quốc hội', '2025-02-19', L64,
    'Điều 21, 22 (nghị quyết của HĐND tỉnh, xã) và trình tự xem xét, thông qua tại kỳ họp. Hiệu lực từ 01/4/2025, sửa đổi bởi Luật 87/2025/QH15. ⚠️ Quốc hội dự kiến biểu quyết luật thay thế ngày 20-21/11/2026'],
  ['ST-02', '78/2025/NĐ-CP', 'Nghị định quy định chi tiết một số điều và biện pháp thi hành Luật Ban hành văn bản quy phạm pháp luật', 'Chính phủ', '2025-04-01', L78,
    'Điều 43-48: đăng ký, soạn thảo, thẩm định, THẨM TRA (Điều 47), thông qua nghị quyết HĐND tỉnh. Hiệu lực từ 01/4/2025; đọc kèm NĐ 187/2025/NĐ-CP (sửa khoản 3 Điều 47)'],
  ['ST-02', '114/2025/UBTVQH15', 'Nghị quyết quy định chi tiết và hướng dẫn thi hành Luật Hoạt động giám sát về hoạt động giám sát của Hội đồng nhân dân', 'Ủy ban Thường vụ Quốc hội', '2025-12-24', L114,
    'Điều 15-26: xem xét báo cáo, thẩm tra báo cáo, chất vấn tại kỳ họp. Hiệu lực từ 01/3/2026, thay NQ 594/NQ-UBTVQH15. Toàn văn là tệp .doc — ' + TAI, [], 'tai'],

  // ── ST-03 Hoạt động giám sát ──
  ['ST-03', '121/2025/QH15', 'Luật Hoạt động giám sát của Quốc hội và Hội đồng nhân dân', 'Quốc hội', '2025-12-10', L121,
    'Toàn văn, trọng tâm Chương III (giám sát của HĐND: chương trình giám sát, chất vấn, giám sát chuyên đề, giải trình, giám sát VBQPPL). Hiệu lực từ 01/3/2026, thay Luật 87/2015/QH13',
    ['Luật Hoạt động giám sát của Quốc hội và Hội đồng nhân dân']],
  ['ST-03', '114/2025/UBTVQH15', 'Nghị quyết quy định chi tiết và hướng dẫn thi hành Luật Hoạt động giám sát về hoạt động giám sát của Hội đồng nhân dân', 'Ủy ban Thường vụ Quốc hội', '2025-12-24', L114,
    'Toàn văn 64 điều: chương trình giám sát hằng năm, chất vấn, giám sát chuyên đề, giải trình, theo dõi kiến nghị sau giám sát. Hiệu lực từ 01/3/2026, thay NQ 594/NQ-UBTVQH15. Toàn văn là tệp .doc — ' + TAI,
    ['Nghị quyết của UBTVQH hướng dẫn hoạt động giám sát của HĐND'], 'tai'],
  ['ST-03', '116/2025/UBTVQH15', 'Nghị quyết quy định về tiếp công dân, tiếp nhận, phân loại, xử lý đơn và giám sát của Quốc hội, HĐND đối với việc giải quyết khiếu nại, tố cáo, kiến nghị, phản ánh', 'Ủy ban Thường vụ Quốc hội', '2025-12-24', L116,
    'Dùng Chương IV (giám sát việc giải quyết khiếu nại, tố cáo, kiến nghị, phản ánh) — hiệu lực từ 01/3/2026. ' + TAI + ' (PDF ảnh quét 15 MB)', [], 'tai'],
  ['ST-03', '72/2025/QH15', 'Luật Tổ chức chính quyền địa phương', 'Quốc hội', '2025-06-16', L72,
    'Nhiệm vụ, quyền hạn giám sát của HĐND, Thường trực HĐND, các Ban, Tổ đại biểu và đại biểu. Hiệu lực từ 16/6/2025'],

  // ── ST-04 Dân nguyện, khiếu nại và tố cáo ──
  ['ST-04', '30/VBHN-VPQH', 'Văn bản hợp nhất Luật Tiếp công dân (Luật 42/2013/QH13, sửa đổi bởi Luật 136/2025/QH15)', 'Văn phòng Quốc hội', '2026-03-13',
    `${CB26}/3/30/469115-1774605500_v1_1774865110_signed.pdf`,
    'Toàn văn, gồm tiếp công dân trực tuyến và tiếp công dân của đại biểu, cơ quan dân cử. Hợp nhất ngày 13/3/2026 (Công báo số 169); phần sửa đổi có hiệu lực từ 01/7/2026',
    ['Luật Tiếp công dân']],
  ['ST-04', '28/VBHN-VPQH', 'Văn bản hợp nhất Luật Khiếu nại (Luật 02/2011/QH13 và các luật sửa đổi đến Luật 136/2025/QH15)', 'Văn phòng Quốc hội', '2026-03-13',
    `${CB26}/3/30/469113-1774603551_v1_1774864709_signed.pdf`,
    'Thụ lý, giải quyết khiếu nại lần đầu, lần hai, đối thoại, tạm đình chỉ. Hợp nhất ngày 13/3/2026 (Công báo số 167); sửa đổi gần nhất có hiệu lực từ 01/7/2026',
    ['Luật Khiếu nại']],
  ['ST-04', '29/VBHN-VPQH', 'Văn bản hợp nhất Luật Tố cáo (Luật 25/2018/QH14 và các luật sửa đổi đến Luật 136/2025/QH15)', 'Văn phòng Quốc hội', '2026-03-13',
    `${CB26}/3/30/469114-1774603562_v1_1774864727_signed.pdf`,
    'Tiếp nhận, xử lý ban đầu, thụ lý, giải quyết tố cáo, bảo vệ người tố cáo. Hợp nhất ngày 13/3/2026; sửa đổi gần nhất có hiệu lực từ 01/7/2026',
    ['Luật Tố cáo']],
  ['ST-04', '116/2025/UBTVQH15', 'Nghị quyết quy định về tiếp công dân, tiếp nhận, phân loại, xử lý đơn và giám sát của Quốc hội, HĐND đối với việc giải quyết khiếu nại, tố cáo, kiến nghị, phản ánh', 'Ủy ban Thường vụ Quốc hội', '2025-12-24', L116,
    'Văn bản trung tâm của sổ tay: tiếp công dân của cơ quan dân cử, phân loại (Điều 13), xử lý, lưu đơn. Hiệu lực từ 01/7/2026 (Chương IV từ 01/3/2026); thay NQ 228/1999, 694/2008, 759/2014. ' + TAI + ' (PDF ảnh quét 15 MB)',
    ['Nghị quyết của UBTVQH về tiếp công dân, xử lý đơn thư của cơ quan dân cử'], 'tai'],
  ['ST-04', '154/2026/NĐ-CP', 'Nghị định quy định chi tiết một số điều và biện pháp tổ chức thi hành Luật Tiếp công dân', 'Chính phủ', '2026-05-15',
    `${CB26}/6/4/469614-1780450409_v1_1780537862_signed.pdf`,
    'Tiếp người khiếu nại, tố cáo, kiến nghị, phản ánh; tiếp công dân trực tuyến. Hiệu lực từ 01/7/2026, thay NĐ 64/2014/NĐ-CP'],
  ['ST-04', '124/2020/NĐ-CP', 'Nghị định quy định chi tiết một số điều và biện pháp thi hành Luật Khiếu nại', 'Chính phủ', '2020-10-19',
    `${CB}/2020/10/32304/33027-1-20201015-1016124-2020-nd-cp.pdf`,
    'Bản gốc 2020, hiệu lực từ 10/12/2020; phải đọc kèm NĐ 155/2026/NĐ-CP sửa đổi (từ 01/7/2026) — chưa có văn bản hợp nhất'],
  ['ST-04', '155/2026/NĐ-CP', 'Nghị định sửa đổi, bổ sung một số điều của Nghị định 124/2020/NĐ-CP (Luật Khiếu nại)', 'Chính phủ', '2026-05-15',
    `${CB26}/5/29/469547-1779940840_v1_1780042045_signed.pdf`,
    'Vụ việc phức tạp, tạm đình chỉ, đình chỉ, ứng dụng công nghệ thông tin, thay biểu mẫu. Hiệu lực từ 01/7/2026'],
  ['ST-04', '31/2019/NĐ-CP', 'Nghị định quy định chi tiết một số điều và biện pháp tổ chức thi hành Luật Tố cáo', 'Chính phủ', '2019-04-10',
    `${CB}/2019/4/28838/26538-1-2019393-39431-2019-nd-cp.pdf`,
    'Bản gốc 2019, hiệu lực từ 28/5/2019; phải đọc kèm NĐ 156/2026/NĐ-CP sửa đổi (từ 01/7/2026)'],
  ['ST-04', '156/2026/NĐ-CP', 'Nghị định sửa đổi, bổ sung một số điều của Nghị định 31/2019/NĐ-CP (Luật Tố cáo)', 'Chính phủ', '2026-05-15',
    `${CB26}/5/29/469581-1780039440_v1_1780043565_signed.pdf`,
    'Rút tố cáo, ứng dụng công nghệ thông tin trong giải quyết tố cáo, thay biểu mẫu. Hiệu lực từ 01/7/2026'],
  ['ST-04', '72/2025/NQLT/UBTVQH15-CP-ĐCTUBTWMTTQVN', 'Nghị quyết liên tịch quy định chi tiết việc tổ chức tiếp xúc cử tri của đại biểu Quốc hội và đại biểu HĐND các cấp', 'UBTVQH – Chính phủ – Đoàn Chủ tịch UBTW MTTQ Việt Nam', '2025-02-20',
    `${CB}/2025/2/44329/55207-1-2025453-45472-2025-nqlt-ubtvqh15-cp-dctubtwmttqvn.pdf`,
    'Tiếp xúc cử tri; tập hợp, tổng hợp kiến nghị cử tri (Chương III-V). Hiệu lực từ 20/2/2025, thay NQLT 525/2012. Ban hành trước khi bỏ cấp huyện; UBTVQH đã cho ý kiến dự thảo sửa đổi (26/9/2025) — kiểm tra đã ban hành chưa'],

  // ── ST-05 Nghị quyết của HĐND tỉnh ──
  ['ST-05', '64/2025/QH15', 'Luật Ban hành văn bản quy phạm pháp luật', 'Quốc hội', '2025-02-19', L64,
    'Điều 21 (nghị quyết của HĐND tỉnh), Chương IV-V (xây dựng, ban hành). Hiệu lực từ 01/4/2025, sửa đổi bởi Luật 87/2025/QH15. ⚠️ Quốc hội dự kiến biểu quyết Luật Văn bản QPPL thay thế ngày 20-21/11/2026 — rà lại sổ tay sau kỳ họp',
    ['Luật Ban hành văn bản quy phạm pháp luật']],
  ['ST-05', '87/2025/QH15', 'Luật sửa đổi, bổ sung một số điều của Luật Ban hành văn bản quy phạm pháp luật', 'Quốc hội', '2025-06-25', L87,
    'Sửa Điều 21, 22, 50, 51, 54, 63, 64 (văn bản của chính quyền địa phương 2 cấp, trình tự rút gọn). Hiệu lực từ 01/7/2025'],
  ['ST-05', '78/2025/NĐ-CP', 'Nghị định quy định chi tiết một số điều và biện pháp thi hành Luật Ban hành văn bản quy phạm pháp luật', 'Chính phủ', '2025-04-01', L78,
    'Chương IV Mục 2 (Điều 44-48: xây dựng nghị quyết HĐND tỉnh), Chương V và Phụ lục I (thể thức, kỹ thuật trình bày). Hiệu lực từ 01/4/2025, sửa đổi bởi NĐ 187/2025/NĐ-CP. Công báo chia 3 tệp — đây là tệp đầu',
    ['Nghị định quy định chi tiết thi hành Luật Ban hành văn bản quy phạm pháp luật']],
  ['ST-05', '187/2025/NĐ-CP', 'Nghị định sửa đổi, bổ sung một số điều của Nghị định 78/2025/NĐ-CP và Nghị định 79/2025/NĐ-CP', 'Chính phủ', '2025-07-01',
    `${CB}/2025/7/45623/57829-1-2025993-994187-2025-nd-cp.pdf`,
    'Quy trình ở chính quyền địa phương 2 cấp sau sắp xếp. Hiệu lực từ 01/7/2025. Tệp phụ lục riêng: 57832-1-2025995-996187-2025-nd-cp.pdf cùng thư mục Công báo'],
  ['ST-05', '79/2025/NĐ-CP', 'Nghị định về kiểm tra, rà soát, hệ thống hóa và xử lý văn bản quy phạm pháp luật', 'Chính phủ', '2025-04-01',
    `${CB}/2025/4/44707/55993-1-2025653-65479-2025-nd-cp.pdf`,
    'Kiểm tra, xử lý văn bản trái pháp luật (Chương II); rà soát, hệ thống hóa (Chương III). Hiệu lực từ 01/4/2025, sửa đổi bởi NĐ 187/2025/NĐ-CP'],
  ['ST-05', '72/2025/QH15', 'Luật Tổ chức chính quyền địa phương', 'Quốc hội', '2025-06-16', L72,
    'Điều 15 (nhiệm vụ, quyền hạn của HĐND tỉnh) và Điều 29-35 (tổ chức, kỳ họp, biểu quyết). Hiệu lực từ 16/6/2025'],
  ['ST-05', '30/2020/NĐ-CP', 'Nghị định về công tác văn thư', 'Chính phủ', '2020-03-05',
    `${CB}/2020/3/30858/30246-1-2020283-28430-2020-nd-cp.pdf`,
    'Thể thức văn bản HÀNH CHÍNH (nghị quyết quy phạm pháp luật theo Chương V NĐ 78/2025). Còn hiệu lực theo nguồn thứ cấp (thuvienphapluat.vn 22/4/2026) — chưa thấy văn bản thay thế',
    ['Nghị định 30/2020/NĐ-CP về công tác văn thư']],

  // ── ST-06 Đánh giá, xếp loại cán bộ, công chức ──
  ['ST-06', '335/2025/NĐ-CP', 'Nghị định quy định về đánh giá, xếp loại chất lượng đối với cơ quan hành chính nhà nước và công chức', 'Chính phủ', '2025-12-21',
    `${CB26}/1/14/335signed-17683840469661035371673.pdf`,
    'Toàn văn 29 điều + phụ lục tiêu chí. Hiệu lực từ 01/01/2026; Điều 27 bãi bỏ phần đánh giá công chức của NĐ 90/2020. Lưu ý tên đúng: chỉ về cơ quan hành chính và CÔNG CHỨC',
    ['Nghị định 335/2025/NĐ-CP về đánh giá, xếp loại chất lượng cán bộ, công chức']],
  ['ST-06', '80/2025/QH15', 'Luật Cán bộ, công chức', 'Quốc hội', '2025-06-24',
    `${CB}/2025/6/45511/57580-1-2025951-95280-2025-qh15.pdf`,
    'Điều 17 (đánh giá cán bộ theo quy định của cấp có thẩm quyền), Điều 25-27 (đánh giá công chức, áp dụng từ 01/01/2026). Hiệu lực từ 01/7/2025, thay Luật 22/2008/QH12'],
  ['ST-06', '366-QĐ/TW', 'Quy định của Bộ Chính trị về kiểm điểm và đánh giá, xếp loại chất lượng đối với tập thể, cá nhân trong hệ thống chính trị', 'Bộ Chính trị', '2025-08-30',
    'https://luatvietnam.vn/hanh-chinh/quy-dinh-366-qd-tw-2025-kiem-diem-danh-gia-xep-loai-chat-luong-he-thong-chinh-tri-411793-d6.html',
    'Toàn văn 19 điều + khung tiêu chí; thang 100 điểm, 4 mức xếp loại. Là căn cứ đánh giá NĂM 2026; từ 01/01/2027 được thay bằng Quy định 227-QĐ/TW. Bản chính thức trên tulieuvankien là PDF ảnh quét nên dùng bản HTML toàn văn của luatvietnam.vn'],
  ['ST-06', '43-HD/BTCTW', 'Hướng dẫn của Ban Tổ chức Trung ương về kiểm điểm và đánh giá, xếp loại chất lượng đối với tập thể, cá nhân trong hệ thống chính trị', 'Ban Tổ chức Trung ương', '2025-10-31',
    'https://tulieuvankien.dangcongsan.vn/upload/2006988/20251125/HD_43__ph_88fec.docx',
    'Hướng dẫn thi hành Quy định 366: tiêu chí, quy trình, mẫu bản kiểm điểm. Đang áp dụng cho năm 2026. Tệp .docx — TẢI TỆP VỀ rồi tải lên NotebookLM', [], 'tai'],
  ['ST-06', '02-HD/BTCTW', 'Hướng dẫn của Ban Tổ chức Trung ương về đánh giá định kỳ hằng quý đối với cán bộ lãnh đạo, quản lý các cấp trong hệ thống chính trị', 'Ban Tổ chức Trung ương', '2026-05-22',
    'https://tulieuvankien.dangcongsan.vn/upload/2006988/20260525/HD_02_BTCTW_67b56.pdf',
    'Mục đích, đối tượng, tiêu chí, quy trình đánh giá HẰNG QUÝ cán bộ lãnh đạo, quản lý — căn cứ trực tiếp cho phân hệ Kiểm điểm. PDF có lớp chữ'],
];

/** Khóa so trùng: số hiệu (bỏ khoảng trắng, không dấu, chữ thường) hoặc tên. */
const khoaSoHieu = (s) => boDau(s).replace(/\s+/g, '').toLowerCase();
const khoaTen = (s) => boDau(s).replace(/\s+/g, ' ').trim().toLowerCase();

/** Đổi một dòng của NGUON_TRA_CUU thành đối tượng dễ đọc. */
export const docDong = ([soTay, soHieu, ten, coQuan, ngayBanHanh, lienKet, ghiChu, thay = [], cachNap = 'url']) =>
  ({ soTay, soHieu, ten, coQuan, ngayBanHanh, lienKet, ghiChu, thay, cachNap });

const ghiChuTraCuu = (g) => `Tra cứu tự động ngày ${NGAY_TRA_CUU.split('-').reverse().join('/')}: ${g} — cán bộ đối chiếu Công báo / CSDL quốc gia về VBQPPL rồi mới đánh dấu hiệu lực và "Đã kiểm tra".`;

/**
 * Hợp nhất danh mục tra cứu vào dữ liệu sổ tay.
 *  · Văn bản đã có (trùng số hiệu, hoặc là nguồn gợi ý cũ được khai ở cột `thay`)
 *    → chỉ ĐIỀN Ô CÒN TRỐNG (số hiệu, ngày, đường dẫn, cơ quan); ô cán bộ đã điền giữ nguyên.
 *  · Văn bản chưa có → thêm mới ở trạng thái "chưa kiểm tra".
 *  · Không bao giờ đổi `hieuLuc`, `kiemTra`, `congKhai`, `napNLM`.
 * Trả { doc, them, dien } — `doc` mang `traCuuV` mới; đã hợp nhất rồi thì trả nguyên.
 */
export function hopNhatTraCuu(doc, ds = NGUON_TRA_CUU) {
  if (!doc || (Number(doc.traCuuV) || 0) >= TRA_CUU_V) return { doc, them: 0, dien: 0 };
  const soTay = Array.isArray(doc.soTay) ? doc.soTay : [];
  const idCua = (ma) => soTay.find((s) => s.ma === ma)?.id || '';
  const nguon = (Array.isArray(doc.nguon) ? doc.nguon : []).map((n) => ({ ...n }));
  let them = 0; let dien = 0;
  for (const dong of ds) {
    const v = docDong(dong);
    const soTayId = idCua(v.soTay);
    if (!soTayId) continue;
    const ks = khoaSoHieu(v.soHieu);
    const kThay = v.thay.map(khoaTen);
    // Khớp SỐ HIỆU trước: cán bộ đã tự nhập văn bản này thì điền vào đó, KHÔNG điền vào nguồn
    // gợi ý cũ (nếu điền vào nguồn gợi ý thì thành hai bản trùng số hiệu).
    const cu = nguon.find((n) => n.soTayId === soTayId && ks && khoaSoHieu(n.soHieu) === ks)
      || nguon.find((n) => n.soTayId === soTayId && !n.soHieu && kThay.includes(khoaTen(n.ten)));
    if (cu) {
      const truoc = JSON.stringify(cu);
      if (!cu.soHieu) { cu.soHieu = v.soHieu; cu.ten = v.ten; }
      if (!cu.coQuan) cu.coQuan = v.coQuan;
      if (!cu.ngayBanHanh) cu.ngayBanHanh = v.ngayBanHanh;
      if (!cu.lienKet) { cu.lienKet = v.lienKet; cu.cachNap = v.cachNap === 'tai' ? 'tai' : ''; }
      if (!String(cu.ghiChu || '').includes('Tra cứu tự động')) cu.ghiChu = ghiChuTraCuu(v.ghiChu);
      if (JSON.stringify(cu) !== truoc) dien++;
      continue;
    }
    nguon.push({
      id: newId('ng'), soTayId, soHieu: v.soHieu, ten: v.ten, coQuan: v.coQuan, ngayBanHanh: v.ngayBanHanh,
      hieuLuc: 'chua-ro', lienKet: v.lienKet, congKhai: false, kiemTra: 'chua', nguoiKiemTra: '', ngayKiemTra: '',
      ghiChu: ghiChuTraCuu(v.ghiChu), napNLM: false, ngayNapNLM: '', cachNap: v.cachNap === 'tai' ? 'tai' : '', text: '', soKyTu: 0, demo: true,
    });
    them++;
  }
  // `updatedAt` để trống → người đăng nhập đầu tiên mở phân hệ ghi bản hợp nhất lên máy chủ.
  return { doc: { ...doc, nguon, traCuuV: TRA_CUU_V, updatedAt: '' }, them, dien };
}

/**
 * Đường dẫn nguồn của một sổ tay để DÁN MỘT LƯỢT vào NotebookLM (Thêm nguồn → Trang web;
 * trang trợ giúp của Google: nhiều đường dẫn phân cách bằng dấu cách hoặc xuống dòng).
 * Bỏ văn bản đã "Loại" và văn bản đã nạp lên notebook (trừ khi `caDaNap`).
 * Văn bản `cachNap === 'tai'` KHÔNG vào danh sách dán (NotebookLM chỉ lấy được trang thông tin
 * hoặc không đọc tệp .doc) mà trả riêng ở `phaiTai` để cán bộ tải tệp về rồi tải lên.
 */
export function lienKetDeNap(doc, soTayId, { caDaNap = false } = {}) {
  const ds = (Array.isArray(doc?.nguon) ? doc.nguon : []).filter((n) => n.soTayId === soTayId
    && n.kiemTra !== 'loai' && /^https?:\/\//i.test(String(n.lienKet || '').trim()) && (caDaNap || !n.napNLM));
  const dan = ds.filter((n) => n.cachNap !== 'tai');
  const urls = [...new Set(dan.map((n) => n.lienKet.trim()))];
  const phaiTai = ds.filter((n) => n.cachNap === 'tai').map((n) => ({ id: n.id, soHieu: n.soHieu, ten: n.ten, lienKet: n.lienKet.trim() }));
  return { urls, phaiTai, chuaKiemTra: ds.filter((n) => n.kiemTra !== 'dat').length };
}
