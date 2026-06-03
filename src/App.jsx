import { useState, useEffect, useMemo, useRef } from 'react';
import { Award, BarChart3, BookOpen, Plus, Trash2, Printer, RotateCcw, ShieldCheck, Cpu, ChevronDown, CheckCircle2, AlertTriangle, User, Target, ClipboardList, LayoutDashboard, UserPlus, Link2, Activity, TrendingUp, CalendarDays, Users, FileSpreadsheet, FileText, Cloud, CloudOff, Save, LogOut, KeyRound, Phone, Mail, Send, MessageSquare } from 'lucide-react';
import { supabase, loadState, saveState, listPeriods, loadAllPeriods } from './lib/supabase';
import { onAuthChange, getSession, signOut } from './lib/auth';
import Login from './Login.jsx';
import SetPassword from './SetPassword.jsx';
import { ND335_CATALOG } from './lib/nd335';

const ROLE_LABEL = { canbo: 'Cán bộ', truongphong: 'Trưởng phòng', quantri: 'Quản trị', khach: 'Dùng thử' };
// Cơ cấu tổ chức: Phòng/Bộ phận và các chức vụ tương ứng (dùng chung cho cả 3 phiên bản)
const ORG_UNITS = [
  { dept: 'HĐND tỉnh', positions: ['Chủ tịch', 'Phó Chủ tịch'] },
  { dept: 'Đoàn ĐBQH tỉnh', positions: ['Phó Trưởng Đoàn', 'Ủy viên chuyên trách'] },
  { dept: 'Ban Kinh tế - Ngân sách', positions: ['Trưởng Ban', 'Phó Trưởng Ban', 'Ủy viên chuyên trách'] },
  { dept: 'Ban Văn hóa - Xã hội', positions: ['Trưởng Ban', 'Phó Trưởng Ban', 'Ủy viên chuyên trách'] },
  { dept: 'Ban Pháp chế', positions: ['Trưởng Ban', 'Phó Trưởng Ban', 'Ủy viên chuyên trách'] },
  { dept: 'Ban Dân tộc', positions: ['Trưởng Ban', 'Phó Trưởng Ban', 'Ủy viên chuyên trách'] },
  { dept: 'Văn phòng', positions: ['Chánh Văn phòng', 'Phó Chánh Văn phòng'] },
  { dept: 'Phòng Công tác Hội đồng', positions: ['Trưởng phòng', 'Phó Trưởng phòng', 'Chuyên viên'] },
  { dept: 'Phòng Công tác Quốc hội', positions: ['Trưởng phòng', 'Phó Trưởng phòng', 'Chuyên viên'] },
  { dept: 'Phòng Tổng hợp - Thông tin - Dân nguyện', positions: ['Trưởng phòng', 'Phó Trưởng phòng', 'Chuyên viên'] },
  { dept: 'Phòng Hành chính - Tổ chức - Quản trị', positions: ['Trưởng phòng', 'Phó Trưởng phòng', 'Chuyên viên'] },
];
const posOptions = (dept) => (ORG_UNITS.find((u) => u.dept === dept)?.positions) || [];
// Email được cấp quyền Quản trị ngay khi chưa dựng bảng phân quyền (bootstrap).
// Có thể thêm email, hoặc chuyển hẳn sang bảng "profiles" để phân quyền chi tiết.
const BOOTSTRAP_ADMIN_EMAILS = ['sonthkh@gmail.com'];

const CRITERIA = {
  leader: { label: 'Cán bộ lãnh đạo, quản lý', mau: 'Mẫu số 02', formula: '(a+b+c+d+đ+e)/6', groups: [
    { id: 'L1', title: '1. Về chính trị, tư tưởng', max: 5, items: [
      { id: '1.1', max: 1, text: 'Tuyệt đối trung thành với Đảng, Tổ quốc và Nhân dân; kiên định lý tưởng cách mạng, chủ nghĩa Mác - Lênin, tư tưởng Hồ Chí Minh.' },
      { id: '1.2', max: 1, text: 'Có lập trường, bản lĩnh chính trị vững vàng; kiên quyết bảo vệ nền tảng tư tưởng, đường lối của Đảng; giữ nghiêm kỷ luật phát ngôn.' },
      { id: '1.3', max: 1, text: 'Có tinh thần yêu nước, tận tụy phục vụ Nhân dân; đặt lợi ích của Đảng, quốc gia, tập thể lên trên lợi ích cá nhân.' },
      { id: '1.4', max: 1, text: 'Tuyệt đối chấp hành sự phân công của tổ chức, yên tâm công tác và hoàn thành tốt mọi nhiệm vụ được giao.' },
      { id: '1.5', max: 0.5, text: 'Tích cực nghiên cứu, học tập chủ trương, nghị quyết của Đảng, chính sách, pháp luật của Nhà nước; cập nhật kiến thức mới.' },
      { id: '1.6', max: 0.5, text: 'Có năng lực tư duy và tầm nhìn đáp ứng yêu cầu thay đổi; phát huy tinh thần chủ động, đổi mới, sáng tạo.' } ] },
    { id: 'L2', title: '2. Về phẩm chất đạo đức và ý thức tổ chức kỷ luật', max: 5, items: [
      { id: '2.1', max: 1, text: 'Có phẩm chất đạo đức, lối sống trong sáng, trung thực; cần, kiệm, liêm, chính, chí công vô tư; nêu gương.' },
      { id: '2.2', max: 1, text: 'Không tham ô, tham nhũng, tiêu cực, quan liêu; đấu tranh chống lợi ích nhóm; không tự diễn biến, tự chuyển hóa.' },
      { id: '2.3', max: 1, text: 'Có ý thức tự giác học tập, tu dưỡng, rèn luyện; dám nghĩ, dám làm, dám chịu trách nhiệm.' },
      { id: '2.4', max: 1, text: 'Thực hiện nghiêm các nguyên tắc tổ chức của Đảng, nhất là tập trung dân chủ, tự phê bình và phê bình.' },
      { id: '2.5', max: 0.5, text: 'Thực hiện việc kê khai và công khai tài sản, thu nhập theo quy định.' },
      { id: '2.6', max: 0.5, text: 'Báo cáo đầy đủ, trung thực, cung cấp thông tin chính xác về thực hiện chức trách, nhiệm vụ với cấp trên.' } ] },
    { id: 'L3', title: '3. Năng lực lãnh đạo, quản lý, chuyên môn; thái độ; đổi mới sáng tạo', max: 16, items: [
      { id: '3.1', max: 4, text: 'Năng lực lãnh đạo, quản lý: tư duy hoạch định, tầm nhìn; tổng hợp, phân tích, dự báo; chỉ đạo, điều hành, giữ kỷ cương.' },
      { id: '3.2', max: 3, text: 'Năng lực chuyên môn, nghiệp vụ theo vị trí việc làm: kiến thức chuyên sâu, phát hiện vấn đề mới, xử lý độc lập.' },
      { id: '3.3', max: 2, text: 'Khả năng đáp ứng yêu cầu thực thi nhiệm vụ được giao (thường xuyên và đột xuất).' },
      { id: '3.4', max: 3, text: 'Thái độ công tác: trách nhiệm cao, đúng mực, lề lối hành chính chuyên nghiệp, phối hợp hiệu quả.' },
      { id: '3.5', max: 4, text: 'Đổi mới sáng tạo, dám nghĩ, dám làm, dám chịu trách nhiệm; có sáng kiến, giải pháp đột phá, quyết đoán.' } ] },
    { id: 'L4', title: '4. Về mức độ tín nhiệm, uy tín và khả năng quy tụ đoàn kết', max: 2, items: [
      { id: '4.1', max: 1, text: 'Có uy tín trong nội bộ, gương mẫu, gắn bó mật thiết với Nhân dân; được tín nhiệm cao.' },
      { id: '4.2', max: 1, text: 'Có khả năng quy tụ, đoàn kết nội bộ; xây dựng tập thể vững mạnh.' } ] },
    { id: 'L5', title: '5. Về tự phê bình và phê bình, tự soi, tự sửa', max: 2, items: [
      { id: '5.1', max: 1, text: 'Tinh thần tự phê bình, tự soi, tự sửa; chủ động nhận diện thiếu sót trong lãnh đạo, chỉ đạo.' },
      { id: '5.2', max: 1, text: 'Kết quả khắc phục hạn chế, khuyết điểm đã được chỉ ra của bản thân và trong phạm vi lãnh đạo.' } ] },
  ] },
  staff: { label: 'Công chức không giữ chức vụ lãnh đạo, quản lý', mau: 'Mẫu số 03', formula: '(a+b+c)/3', groups: [
    { id: 'S1', title: '1. Về chính trị, phẩm chất đạo đức và ý thức tổ chức kỷ luật', max: 15, items: [
      { id: '1.1', max: 2, text: 'Có quan điểm, bản lĩnh chính trị vững vàng; kiên định lập trường; nghiên cứu, vận dụng chủ nghĩa Mác - Lênin, tư tưởng Hồ Chí Minh.' },
      { id: '1.2', max: 2, text: 'Thực hiện nghiêm nguyên tắc tổ chức của Đảng; chấp hành pháp luật; nghiêm kỷ luật phát ngôn, bảo vệ bí mật nhà nước.' },
      { id: '1.3', max: 2, text: 'Giữ gìn phẩm chất đạo đức, lối sống trong sáng; phòng, chống tham nhũng, tiêu cực; không suy thoái.' },
      { id: '1.4', max: 2, text: 'Có ý thức tổ chức kỷ luật, tinh thần trách nhiệm; chấp hành phân công; thực hiện quy chế, nội quy.' },
      { id: '1.5', max: 2, text: 'Thực hiện việc kê khai và công khai tài sản, thu nhập theo quy định.' },
      { id: '1.6', max: 2, text: 'Báo cáo đầy đủ, trung thực, cung cấp thông tin chính xác về thực hiện nhiệm vụ với cấp trên.' },
      { id: '1.7', max: 2, text: 'Giữ gìn đoàn kết nội bộ; quan hệ tốt với đồng nghiệp; tham gia xây dựng tổ chức đảng, đoàn thể.' },
      { id: '1.8', max: 1, text: 'Gần gũi, sâu sát với cơ sở; giữ mối liên hệ với cấp ủy và Nhân dân nơi cư trú.' } ] },
    { id: 'S2', title: '2. Năng lực chuyên môn; khả năng thực thi; thái độ; đổi mới sáng tạo', max: 10, items: [
      { id: '2.1', max: 3, text: 'Năng lực chuyên môn theo vị trí việc làm: cập nhật kiến thức, xử lý độc lập, ứng dụng CNTT - chuyển đổi số.' },
      { id: '2.2', max: 2, text: 'Khả năng đáp ứng yêu cầu thực thi nhiệm vụ được giao (thường xuyên và đột xuất).' },
      { id: '2.3', max: 2, text: 'Thái độ công tác: trách nhiệm, tích cực; đúng mực, lề lối hành chính chuyên nghiệp.' },
      { id: '2.4', max: 3, text: 'Đổi mới sáng tạo, dám nghĩ, dám làm, dám chịu trách nhiệm; có sản phẩm, giải pháp đột phá.' } ] },
    { id: 'S3', title: '3. Về tự phê bình và phê bình, khắc phục hạn chế', max: 5, items: [
      { id: '3.1', max: 5, text: 'Tinh thần tự phê bình, tự soi, tự sửa; tự giác nhận diện hạn chế và kết quả khắc phục hạn chế đã được chỉ ra.' } ] },
  ] },
  contract: { label: 'Lao động hợp đồng hỗ trợ, phục vụ', mau: 'Mẫu số 04', formula: '(a+b+c)/3', groups: [
    { id: 'C1', title: '1. Về chính trị, phẩm chất đạo đức và ý thức tổ chức kỷ luật', max: 15, items: [
      { id: '1.1', max: 3, text: 'Chấp hành chủ trương, đường lối của Đảng, chính sách, pháp luật và nguyên tắc tổ chức kỷ luật.' },
      { id: '1.2', max: 3, text: 'Gương mẫu về đạo đức, lối sống; không tham ô, lãng phí; không suy thoái về đạo đức, lối sống.' },
      { id: '1.3', max: 3, text: 'Tác phong, lề lối làm việc chuẩn mực, tận tụy, trung thực, năng động; phương pháp khoa học, dân chủ.' },
      { id: '1.4', max: 3, text: 'Chấp hành phân công, chỉ đạo; sẵn sàng nhận nhiệm vụ; thực hiện tốt quy chế, nội quy cơ quan.' },
      { id: '1.5', max: 3, text: 'Thực hiện quy tắc ứng xử của cán bộ, công chức, viên chức, lao động hợp đồng trong cơ quan.' } ] },
    { id: 'C2', title: '2. Năng lực chuyên môn; khả năng thực thi; thái độ; đổi mới sáng tạo', max: 10, items: [
      { id: '2.1', max: 3, text: 'Chủ động nghiên cứu, cập nhật kịp thời kiến thức pháp luật và chuyên môn để tham mưu có chất lượng.' },
      { id: '2.2', max: 3, text: 'Xây dựng kế hoạch công tác cá nhân theo quy định.' },
      { id: '2.3', max: 2, text: 'Nắm vững quy chế, quy trình tác nghiệp theo yêu cầu nhiệm vụ được giao.' },
      { id: '2.4', max: 2, text: 'Sử dụng thành thạo phương tiện, thiết bị kỹ thuật phục vụ nhiệm vụ, bảo đảm an toàn, hiệu quả.' } ] },
    { id: 'C3', title: '3. Về tự phê bình và phê bình, khắc phục hạn chế', max: 5, items: [
      { id: '3.1', max: 5, text: 'Tinh thần tự phê bình, tự soi, tự sửa; tự giác nhận diện hạn chế và kết quả khắc phục hạn chế đã được chỉ ra.' } ] },
  ] },
};

// Nhóm đối tượng MỚI: Đại biểu HĐND hoạt động chuyên trách — GIỮ NGUYÊN Tiêu chí chung (dùng bộ của nhóm lãnh đạo).
CRITERIA.hdnd = {
  label: 'Đại biểu HĐND tỉnh hoạt động chuyên trách (Thường trực HĐND tỉnh, lãnh đạo các Ban của HĐND tỉnh, ủy viên chuyên trách các Ban của HĐND tỉnh)',
  mau: 'Mẫu số 05',
  formula: '(a+b+c)/3',
  groups: CRITERIA.leader.groups,
};

// Danh mục công việc (Nhóm II) cho nhóm Đại biểu HĐND chuyên trách — theo 3 vai trò trong tài liệu.
const HDND_CATALOG = [
  // A. Thường trực HĐND tỉnh (Lãnh đạo chủ chốt)
  { id: 'HD.A.1', group: 'HĐND.A. THƯỜNG TRỰC HĐND TỈNH', name: 'Chỉ đạo, điều hành kỳ họp', output: 'Kết quả tổ chức kỳ họp thường lệ/chuyên đề; chất lượng nghị quyết ban hành', level: 'N4', maxScore: 400, hasFactor: true },
  { id: 'HD.A.2', group: 'HĐND.A. THƯỜNG TRỰC HĐND TỈNH', name: 'Thực hiện nhiệm vụ theo luật định', output: 'Xử lý vấn đề phát sinh giữa hai kỳ họp; chỉ đạo thực hiện quy chế làm việc', level: 'N3', maxScore: 300, hasFactor: true },
  { id: 'HD.A.3', group: 'HĐND.A. THƯỜNG TRỰC HĐND TỈNH', name: 'Công tác tiếp dân, khiếu nại, tố cáo', output: 'Kết quả tiếp công dân; đôn đốc, giám sát giải quyết đơn thư KNTC', level: 'N3', maxScore: 300, hasFactor: true },
  { id: 'HD.A.4', group: 'HĐND.A. THƯỜNG TRỰC HĐND TỈNH', name: 'Công tác đối ngoại và phối hợp', output: 'Hiệu quả phối hợp với UBND tỉnh, MTTQ tỉnh và Đoàn ĐBQH', level: 'N2', maxScore: 200, hasFactor: true },
  // B. Lãnh đạo các Ban của HĐND tỉnh
  { id: 'HD.B.1', group: 'HĐND.B. LÃNH ĐẠO CÁC BAN HĐND TỈNH', name: 'Tham mưu và thực hiện nhiệm vụ được phân công', output: 'Tiến độ, chất lượng công việc do Chủ tịch/Thường trực HĐND phân công', level: 'N3', maxScore: 300, hasFactor: true },
  { id: 'HD.B.2', group: 'HĐND.B. LÃNH ĐẠO CÁC BAN HĐND TỈNH', name: 'Tham gia các hoạt động chung', output: 'Tỷ lệ dự phiên họp Thường trực; góp ý chuẩn bị nội dung, chương trình kỳ họp', level: 'N2', maxScore: 200, hasFactor: true },
  { id: 'HD.B.3', group: 'HĐND.B. LÃNH ĐẠO CÁC BAN HĐND TỈNH', name: 'Công tác thẩm tra (trọng tâm)', output: 'Số lượng, chất lượng, tiến độ báo cáo thẩm tra (nộp chậm nhất 15 ngày trước khai mạc)', level: 'N4', maxScore: 400, hasFactor: true },
  { id: 'HD.B.4', group: 'HĐND.B. LÃNH ĐẠO CÁC BAN HĐND TỈNH', name: 'Công tác giám sát chuyên đề', output: 'Kế hoạch và kết quả giám sát chuyên đề thuộc lĩnh vực Ban phụ trách', level: 'N3', maxScore: 300, hasFactor: true },
  { id: 'HD.B.5', group: 'HĐND.B. LÃNH ĐẠO CÁC BAN HĐND TỈNH', name: 'Điều hành nội bộ Ban', output: 'Phân công nhiệm vụ thành viên; tỷ lệ hoàn thành kế hoạch công tác năm của Ban', level: 'N2', maxScore: 200, hasFactor: true },
  // C. Ủy viên chuyên trách các Ban HĐND
  { id: 'HD.C.1', group: 'HĐND.C. ỦY VIÊN CHUYÊN TRÁCH CÁC BAN', name: 'Tham gia kỳ họp HĐND', output: 'Tỷ lệ tham dự kỳ họp, phiên họp toàn thể (không vắng mặt không lý do)', level: 'N2', maxScore: 200, hasFactor: true },
  { id: 'HD.C.2', group: 'HĐND.C. ỦY VIÊN CHUYÊN TRÁCH CÁC BAN', name: 'Chất lượng tham gia ý kiến', output: 'Mức độ nghiên cứu tài liệu; chất lượng thảo luận, chất vấn tại kỳ họp', level: 'N3', maxScore: 300, hasFactor: true },
  { id: 'HD.C.3', group: 'HĐND.C. ỦY VIÊN CHUYÊN TRÁCH CÁC BAN', name: 'Gắn bó với cử tri', output: 'Số lần TXCT trước/sau kỳ họp; tiếp nhận, phân loại, chuyển đơn thư KNTC', level: 'N3', maxScore: 300, hasFactor: true },
  { id: 'HD.C.4', group: 'HĐND.C. ỦY VIÊN CHUYÊN TRÁCH CÁC BAN', name: 'Thực hiện nhiệm vụ tại Ban', output: 'Chủ trì/tham gia khảo sát, giám sát; xây dựng báo cáo chuyên đề, báo cáo thẩm tra', level: 'N3', maxScore: 300, hasFactor: true },
];

// Danh mục gộp: dùng để tra hệ số (agg335) và lọc theo nhóm đối tượng (getND335Groups)
const CATALOG = [...ND335_CATALOG, ...HDND_CATALOG];

const DIGITAL = [
  { id: 1, name: 'Nhận thức số và tư duy chuyển đổi số' },
  { id: 2, name: 'Khai thác dữ liệu và thông tin' },
  { id: 3, name: 'Giao tiếp, hợp tác, thực thi công vụ trên môi trường số' },
  { id: 4, name: 'Sáng tạo nội dung số và tự động hóa công việc' },
  { id: 5, name: 'An toàn thông tin, bảo mật dữ liệu và AI có trách nhiệm', mandatory: true },
  { id: 6, name: 'Giải quyết vấn đề và cải tiến quy trình bằng công nghệ số' },
  { id: 7, name: 'Khai thác hệ thống thông tin, nền tảng số dùng chung' },
  { id: 8, name: 'Lãnh đạo số và quản trị thay đổi' },
];
const LEVELS = [{ v: 0, s: 'Chưa' }, { v: 1, s: 'Mức 1' }, { v: 2, s: 'Mức 2' }, { v: 3, s: 'Mức 3' }, { v: 4, s: 'Mức 4' }];
const MIN_DIGITAL = { leader: 3, staff: 2, contract: 1, hdnd: 3 };

function classify(t) {
  if (t >= 90) return { code: 'A', name: 'Hoàn thành xuất sắc nhiệm vụ', cls: 'bg-emerald-500', ring: 'text-emerald-600', soft: 'bg-emerald-50 text-emerald-700 border-emerald-200', bar: 'bg-emerald-500' };
  if (t >= 70) return { code: 'B', name: 'Hoàn thành tốt nhiệm vụ', cls: 'bg-sky-500', ring: 'text-sky-600', soft: 'bg-sky-50 text-sky-700 border-sky-200', bar: 'bg-sky-500' };
  if (t >= 50) return { code: 'C', name: 'Hoàn thành nhiệm vụ', cls: 'bg-amber-500', ring: 'text-amber-600', soft: 'bg-amber-50 text-amber-700 border-amber-200', bar: 'bg-amber-500' };
  return { code: 'D', name: 'Không hoàn thành nhiệm vụ', cls: 'bg-rose-500', ring: 'text-rose-600', soft: 'bg-rose-50 text-rose-700 border-rose-200', bar: 'bg-rose-500' };
}
function statusOf(p) {
  if (p >= 90) return { label: 'Đúng tiến độ', dot: 'bg-emerald-500', txt: 'text-emerald-600', soft: 'bg-emerald-50' };
  if (p >= 70) return { label: 'Cần chú ý', dot: 'bg-amber-500', txt: 'text-amber-600', soft: 'bg-amber-50' };
  return { label: 'Chậm / rủi ro', dot: 'bg-rose-500', txt: 'text-rose-600', soft: 'bg-rose-50' };
}
const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
// Điểm % của 1 nhiệm vụ Nhóm II (đếm khách quan) — dùng cho màu trạng thái & tiến độ OKR
function task335Score(t) {
  const as = Number(t.assigned) || 0;
  if (as === 0) return 0;
  const a = Math.min(100, (Number(t.completed) || 0) / as * 100);
  const b = Math.max(0, 1 - 0.25 * (Number(t.qualityIssues) || 0)) * 100;
  const c = Math.max(0, 1 - 0.25 * (Number(t.delays) || 0)) * 100;
  return (a + b + c) / 3;
}
function agg335(tasks335) {
  const valid = (tasks335 || []).filter(t => t.catalogId);
  // Chưa nhập nhiệm vụ nào -> mặc định đạt tối đa 100 (cán bộ mới khởi tạo 100/100, đánh giá trừ dần)
  if (valid.length === 0) return { a: 100, b: 100, c: 100, val: 100 };
  let totalAssignedScore = 0, totalCompletedScore = 0, totalQualityScore = 0, totalDelayScore = 0;
  valid.forEach(t => {
    const cat = CATALOG.find(c => c.id === t.catalogId);
    if (!cat) return;
    // Hệ số làm trọng số; nhóm hỗ trợ (III.*) có hệ số 0 -> coi trọng số = 1 (đếm ngang nhau)
    const w = Number(cat.maxScore) || 1;
    const as = Number(t.assigned) || 0;
    const cp = Number(t.completed) || 0;
    const qI = Number(t.qualityIssues) || 0;
    const dl = Number(t.delays) || 0;
    
    totalAssignedScore += as * w;
    totalCompletedScore += cp * w;
    totalQualityScore += cp * w * Math.max(0, 1 - 0.25 * qI);
    totalDelayScore += cp * w * Math.max(0, 1 - 0.25 * dl);
  });
  if (totalAssignedScore === 0) return { a: 100, b: 100, c: 100, val: 100 };
  const a = Math.min(100, (totalCompletedScore / totalAssignedScore) * 100);
  const b = totalCompletedScore > 0 ? (totalQualityScore / totalCompletedScore) * 100 : 100;
  const c = totalCompletedScore > 0 ? (totalDelayScore / totalCompletedScore) * 100 : 100;
  return { a, b, c, val: (a + b + c) / 3 };
}

function getND335Groups(type) {
  if (type === 'hdnd') return HDND_CATALOG;
  if (type === 'contract') return ND335_CATALOG.filter(c => c.id.startsWith('III'));
  if (type === 'staff') return ND335_CATALOG.filter(c => c.id.startsWith('II.A') || c.id.startsWith('II.B'));
  return ND335_CATALOG.filter(c => c.id.startsWith('I.A') || c.id.startsWith('I.B') || c.id.startsWith('II.B'));
}

function computePerson(p) {
  let nself = 0, nmgr = 0;
  CRITERIA[p.type].groups.forEach((g) => g.items.forEach((it) => {
    const sv = p.selfScores[it.id] ?? it.max;
    nself += sv; nmgr += p.mgrScores[it.id] ?? sv;
  }));
  nself = Math.min(nself, 30); nmgr = Math.min(nmgr, 30);
  const k = agg335(p.tasks335);
  const nhomII = (k.val / 100) * 70;
  const ded = Number(p.deduction || 0);

  return {
    nself, nmgr, k, nhomII,
    totalSelf: clamp(nself + nhomII - ded), totalMgr: clamp(nmgr + nhomII - ded),
  };
}
let pid = 3, trkId = 1, t335Id = 100;
const newTask335 = () => ({ id: t335Id++, catalogId: '', objId: '', assigned: 1, completed: 1, qualityIssues: 0, delays: 0, note: '' });
const newTracking = () => ({ id: trkId++, content: '', coordination: '', directive: '', finalProduct: '', startDate: '', endDate: '', doneWork: '', doingWork: '', difficulties: '', proposals: '', note: '', catalogId: '', objId: '', completed: 0, qualityIssues: 0, delays: 0 });
const newPerson = (name, type) => ({ id: pid++, name, position: '', department: '', email: '', role: 'canbo', type, selfScores: {}, mgrScores: {}, deduction: 0, tasks335: [newTask335()], digital: {}, selfNote: '', mgrNote: '', trackings: [] });
// Đẩy bộ đếm id vượt qua dữ liệu đã nạp (dùng chung cho cả phiên bản mới)
function bumpIds(people) {
  const ppl = people || [];
  pid = Math.max(pid, 0, ...ppl.map((p) => p.id || 0)) + 1;
  t335Id = Math.max(t335Id, 0, ...ppl.flatMap((p) => (p.tasks335 || []).map((t) => t.id || 0))) + 1;
  trkId = Math.max(trkId, 0, ...ppl.flatMap((p) => (p.trackings || []).map((t) => t.id || 0))) + 1;
}

// ===== Chia sẻ model cho phiên bản giao diện khác (AppModern) — KHÔNG đổi logic =====
export {
  CRITERIA, CATALOG, DIGITAL, LEVELS, MIN_DIGITAL, ROLE_LABEL, BOOTSTRAP_ADMIN_EMAILS, ORG_UNITS, posOptions,
  classify, statusOf, clamp, task335Score, agg335, getND335Groups, computePerson,
  newPerson, newTask335, newTracking, bumpIds, getWeekTitle,
};

function getWeekTitle(dateObj) {
  const d = new Date(Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  const start = new Date(d); start.setUTCDate(d.getUTCDate() - 3);
  const end = new Date(d); end.setUTCDate(d.getUTCDate() + 3);
  const fmt = (dt) => `${dt.getDate().toString().padStart(2, '0')}/${(dt.getMonth() + 1).toString().padStart(2, '0')}/${dt.getFullYear()}`;
  return `Tuần thứ ${weekNo} (từ ngày ${fmt(start)} đến ngày ${fmt(end)})`;
}

export default function App({ version = 'classic', onPickVersion } = {}) {
  const [tab, setTab] = useState('dash');
  const [period, setPeriod] = useState({ month: String(new Date().getMonth() + 1), year: String(new Date().getFullYear()) });
  const [trackingDate, setTrackingDate] = useState(new Date().toISOString().split('T')[0]);
  const [unit] = useState('Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa');
  const [objectives, setObjectives] = useState([
    { id: 'o1', title: 'Nâng cao chất lượng tham mưu xây dựng, ban hành nghị quyết HĐND tỉnh', source: 'NQ 66-NQ/TW' },
    { id: 'o2', title: 'Đẩy mạnh chuyển đổi số, ứng dụng AI trong công tác Văn phòng', source: 'NQ 57-NQ/TW' },
    { id: 'o3', title: 'Phục vụ hiệu quả kỳ họp và hoạt động giám sát của HĐND tỉnh', source: 'Chương trình công tác' },
  ]);
  const [people, setPeople] = useState([
    { ...newPerson('Nguyễn Văn A', 'leader'), position: 'Phó Chánh Văn phòng' },
    { ...newPerson('Trần Thị B', 'staff'), position: 'Chuyên viên' },
  ]);
  const [curId, setCurId] = useState(people[0].id);
  const [open, setOpen] = useState(null);
  const [cloud, setCloud] = useState({ ready: false, saving: false });
  const [session, setSession] = useState(undefined); // undefined = đang kiểm tra; null = chưa đăng nhập
  const loaded = useRef(false);
  const loadingRef = useRef(false);     // đang nạp kỳ -> tạm khóa autosave
  const serverTsRef = useRef(null);     // updated_at đã nạp về (khóa lạc quan)
  const [conflict, setConflict] = useState(false);
  const [seedFrom, setSeedFrom] = useState(null); // kỳ gần nhất có dữ liệu để sao chép
  const [trends, setTrends] = useState([]);
  const [showChangePw, setShowChangePw] = useState(false);
  const [sheetSync, setSheetSync] = useState({ at: null, busy: false }); // đồng bộ Google Sheet

  const bumpCounters = (ppl) => {
    pid = Math.max(pid, 0, ...ppl.map((p) => p.id || 0)) + 1;
    t335Id = Math.max(t335Id, 0, ...ppl.flatMap((p) => (p.tasks335 || []).map((t) => t.id || 0))) + 1;
    trkId = Math.max(trkId, 0, ...ppl.flatMap((p) => (p.trackings || []).map((t) => t.id || 0))) + 1;
  };

  const refreshTrends = async () => {
    const all = await loadAllPeriods();
    setTrends(all.map(({ year, month, state }) => {
      const ppl = state?.people || [];
      const d = { A: 0, B: 0, C: 0, D: 0 }; let sum = 0;
      ppl.forEach((p) => { const t = computePerson(p).totalMgr; d[classify(t).code]++; sum += t; });
      return { year, month, dist: d, avg: ppl.length ? sum / ppl.length : 0, count: ppl.length };
    }).sort((a, b) => (Number(a.year) - Number(b.year)) || (Number(a.month) - Number(b.month))));
  };

  const loadPeriod = async (p) => {
    loadingRef.current = true;
    setConflict(false); setSeedFrom(null);
    const res = await loadState(p);
    serverTsRef.current = res.serverTs;
    if (res.state) {
      const ppl = res.state.people || [];
      setPeople(ppl); setCurId(ppl[0]?.id ?? null); setObjectives(res.state.objectives || []);
      bumpCounters(ppl);
    } else {
      const others = (await listPeriods()).filter((o) => !(o.year === p.year && o.month === p.month));
      if (others.length) { setPeople([]); setCurId(null); setSeedFrom(others[0]); }
      // chưa có kỳ nào khác -> giữ nguyên dữ liệu mẫu khởi tạo (lần chạy đầu)
    }
    setCloud({ ready: !!supabase, saving: false });
    loaded.current = true;
    loadingRef.current = false;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadPeriod(period); refreshTrends(); }, []);

  // Xác thực: nếu chưa cấu hình máy chủ -> chạy cục bộ (coi như quản trị)
  useEffect(() => {
    if (!supabase) { setSession('local'); return; }
    let unsub = () => {};
    (async () => {
      setSession(await getSession());
      unsub = onAuthChange((ns) => setSession(ns));
    })();
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!loaded.current || loadingRef.current) return;
    if (session === 'guest') return; // khách chỉ xem -> không tự lưu
    setCloud((c) => ({ ...c, saving: true }));
    const t = setTimeout(async () => {
      const res = await saveState(period, { people, objectives, period }, serverTsRef.current);
      if (res.ok) { serverTsRef.current = res.serverTs; setConflict(false); }
      else if (res.conflict) setConflict(true);
      setCloud((c) => ({ ...c, saving: false }));
    }, 900);
    return () => clearTimeout(t);
  }, [people, objectives, period, session]);

  const changePeriod = (np) => { setPeriod(np); loadPeriod(np); };

  const copyFromPeriod = async (src) => {
    const res = await loadState({ year: src.year, month: src.month });
    if (!res.state) return;
    const ppl = (res.state.people || []).map((p) => ({ ...p, id: pid++, selfScores: {}, mgrScores: {}, deduction: 0, tasks335: [newTask335()], selfNote: '', mgrNote: '', trackings: [] }));
    setObjectives(res.state.objectives || []);
    setPeople(ppl); setCurId(ppl[0]?.id ?? null); setSeedFrom(null);
  };

  const handleManualSave = async () => {
    if (session === 'guest') return; // khách chỉ xem
    setCloud((c) => ({ ...c, saving: true }));
    const res = await saveState(period, { people, objectives, period }, serverTsRef.current);
    if (res.ok) { serverTsRef.current = res.serverTs; setConflict(false); }
    else if (res.conflict) setConflict(true);
    setCloud((c) => ({ ...c, saving: false }));
    refreshTrends();
  };

  const cur = people.find((p) => p.id === curId) || people[0] || null;
  const upPerson = (id, patch) => setPeople((ps) => ps.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const upCur = (patch) => upPerson(curId, patch);
  const upTask335 = (taskId, patch) => upCur({ tasks335: (cur.tasks335 || []).map((t) => (t.id === taskId ? { ...t, ...patch } : t)) });
  const upTracking = (trkId, patch) => upCur({ trackings: (cur.trackings || []).map((t) => (t.id === trkId ? { ...t, ...patch } : t)) });

  const computed = useMemo(() => people.map((p) => ({ p, c: computePerson(p) })), [people]);
  const curC = cur ? (computed.find((x) => x.p.id === curId)?.c || computePerson(cur)) : null;
  const dist = useMemo(() => { const d = { A: 0, B: 0, C: 0, D: 0 }; computed.forEach(({ c }) => d[classify(c.totalMgr).code]++); return d; }, [computed]);
  const avg = computed.length ? computed.reduce((s, x) => s + x.c.totalMgr, 0) / computed.length : 0;
  const overCap = dist.A > Math.floor(dist.B * 0.2);
  const objProgress = (oid) => {
    const ts = people.flatMap((p) => p.tasks335 || []).filter((t) => t.objId === oid && t.catalogId);
    if (!ts.length) return null;
    return ts.reduce((s, t) => s + task335Score(t), 0) / ts.length;
  };

  const tabs = [
    { id: 'dash', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'eval', label: 'Đánh giá', icon: BarChart3 },
    { id: 'digital', label: 'Năng lực số', icon: Cpu },
    { id: 'tracking', label: 'Theo dõi CV', icon: ClipboardList },
    { id: 'guide', label: 'Liên hệ & hướng dẫn', icon: BookOpen },
  ];
  const cfg = cur ? CRITERIA[cur.type] : null;
  const result = curC ? classify(curC.totalMgr) : classify(0);
  const minLv = cur ? MIN_DIGITAL[cur.type] : 0;
  const digPassed = cur ? DIGITAL.filter((d) => (cur.digital[d.id] || 0) >= minLv).length : 0;

  // Lazy-load: chỉ tải xlsx/docx khi người dùng bấm xuất (giảm dung lượng tải lần đầu)
  const doExcel = async () => {
    const { exportExcel1A } = await import('./lib/exporters');
    exportExcel1A(
      computed.map(({ p, c }) => ({ name: p.name || '(Chưa tên)', position: p.position || CRITERIA[p.type].label, self: c.totalSelf.toFixed(1), mgr: c.totalMgr.toFixed(1), cls: classify(c.totalMgr).code })),
      period, unit
    );
  };
  const doWord = async () => {
    const { exportWordPhieu } = await import('./lib/exporters');
    exportWordPhieu({ unit, name: cur.name, position: cur.position, typeLabel: CRITERIA[cur.type].label, month: period.month, year: period.year, nhomI: curC.nmgr.toFixed(2), nhomII: curC.nhomII.toFixed(2), kpi: curC.k.val.toFixed(1), a: curC.k.a.toFixed(1), b: curC.k.b.toFixed(1), c: curC.k.c.toFixed(1), deduction: Number(cur.deduction || 0).toFixed(2), total: curC.totalMgr.toFixed(2), cls: result.code, clsName: result.name, selfNote: cur.selfNote, mgrNote: cur.mgrNote });
  };
  const doExportTracking = async () => {
    const { exportTrackingPDF } = await import('./lib/exporters');
    exportTrackingPDF(people, getWeekTitle(new Date(trackingDate)), unit, period);
  };

  // Đồng bộ "Bảng kiểm đếm" từ Google Sheet (qua proxy /api/kiemdem) -> nạp thành dòng theo dõi có thể sửa.
  // Khớp cán bộ theo tên; idempotent: chỉ thay nhóm dòng có cờ fromSheet, giữ nguyên dòng nhập tay.
  const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1ML2nsQb4Vh7iB_mbBkQhngW9ftjwIvo0-ysXe2UQ6pQ/edit?usp=sharing';
  const syncFromSheet = async () => {
    setSheetSync((s) => ({ ...s, busy: true }));
    try {
      const r = await fetch('/api/kiemdem', { cache: 'no-store' });
      const data = await r.json();
      if (!r.ok || data.error) { alert('Không đồng bộ được Google Sheet: ' + (data.error || `HTTP ${r.status}`)); return; }
      const sps = data.persons || [];
      if (!sps.length) { alert('Google Sheet chưa có dòng công việc nào để đồng bộ.'); return; }
      const mkTrk = (t) => ({ ...newTracking(), fromSheet: true,
        content: t.content || '', coordination: t.coordination || '', directive: t.directive || '',
        finalProduct: t.finalProduct || '', startDate: t.startDate || '', endDate: t.endDate || '',
        doneWork: t.doneWork || '', doingWork: t.doingWork || '', difficulties: t.difficulties || '',
        proposals: t.proposals || '', note: t.note || '' });
      let added = 0;
      setPeople((ps) => {
        const next = ps.map((p) => ({ ...p }));
        sps.forEach((sp) => {
          const nm = (sp.name || '').trim(); if (!nm) return;
          const trks = (sp.trackings || []).map(mkTrk); added += trks.length;
          const i = next.findIndex((p) => (p.name || '').trim().toLowerCase() === nm.toLowerCase());
          if (i >= 0) {
            const keep = (next[i].trackings || []).filter((t) => !t.fromSheet);
            next[i] = { ...next[i], trackings: [...keep, ...trks] };
          } else {
            next.push({ ...newPerson(nm, 'staff'), trackings: trks });
          }
        });
        return next;
      });
      setSheetSync({ at: data.fetchedAt || new Date().toISOString(), busy: false });
      alert(`Đã đồng bộ ${added} công việc từ Google Sheet cho ${sps.length} cán bộ vào tab Theo dõi CV.`);
    } catch (e) {
      alert('Lỗi đồng bộ Google Sheet: ' + (e && e.message ? e.message : e));
    } finally {
      setSheetSync((s) => ({ ...s, busy: false }));
    }
  };

  // Thu thập các dòng "Bảng theo dõi CV" (đã gắn Danh mục) thành nhiệm vụ Nhóm II của cán bộ hiện tại.
  // Idempotent theo srcTrkId: bấm lại sẽ CẬP NHẬT, không nhân đôi; giữ nguyên nhiệm vụ nhập tay.
  const doCollectTracking = () => {
    if (!cur) return;
    const trks = (cur.trackings || []).filter((t) => t.catalogId);
    if (!trks.length) { alert('Chưa có dòng theo dõi nào gắn "Danh mục công việc" để thu thập. Hãy mở tab Theo dõi CV, chọn Danh mục cho từng công việc rồi thử lại.'); return; }
    const prevGen = new Map((cur.tasks335 || []).filter((x) => x.srcTrkId != null).map((x) => [x.srcTrkId, x]));
    const manual = (cur.tasks335 || []).filter((x) => x.srcTrkId == null);
    const generated = trks.map((t) => ({
      id: prevGen.get(t.id)?.id ?? t335Id++,
      srcTrkId: t.id,
      catalogId: t.catalogId,
      objId: t.objId || '',
      assigned: 1,
      completed: Number(t.completed) ? 1 : 0,
      qualityIssues: Number(t.qualityIssues) || 0,
      delays: Number(t.delays) || 0,
      note: t.content || '',
    }));
    upCur({ tasks335: [...manual, ...generated] });
    alert(`Đã thu thập ${generated.length} công việc từ Bảng theo dõi vào Nhóm II. Đang mở tab Đánh giá để xem kết quả.`);
    setTab('eval');
  };

  // ===== Phân quyền (thực thi ở tầng ứng dụng) =====
  const myEmail = (session && session.user && session.user.email) || '';
  const isBootstrapAdmin = !!myEmail && BOOTSTRAP_ADMIN_EMAILS.includes(myEmail.toLowerCase());
  // Hồ sơ của chính người đăng nhập = cán bộ có email khớp; vai trò lấy từ ô "Vai trò" do quản trị đặt.
  const myPerson = supabase ? people.find((p) => p.email && myEmail && p.email.toLowerCase() === myEmail.toLowerCase()) : null;
  const myDept = myPerson?.department || '';
  const isGuest = session === 'guest';            // tài khoản khách (dùng thử)
  const readOnly = isGuest;                       // khóa quản trị, lưu trữ, Năng lực số & Theo dõi CV cho khách
  const role = isGuest ? 'khach' : (!supabase ? 'quantri' : (isBootstrapAdmin ? 'quantri' : (myPerson?.role || 'canbo')));
  const isAdmin = role === 'quantri';
  const canManage = isAdmin && !readOnly; // thêm/xóa cán bộ, sửa mục tiêu OKR, đặt vai trò (khách KHÔNG có)
  // Khách (dùng thử) ĐƯỢC chấm điểm Nhóm I/II để xem kết quả tính toán — chỉ lưu tạm trên trình duyệt, không lưu DB.
  const canEditMgrOf = (p) => isGuest || isAdmin || (role === 'truongphong' && !!myDept && p?.department === myDept);
  const canEditSelfOf = (p) => isGuest || isAdmin || (!!myEmail && !!p?.email && p.email.toLowerCase() === myEmail.toLowerCase());
  const selfEditable = cur ? canEditSelfOf(cur) : false;
  const mgrEditable = cur ? canEditMgrOf(cur) : false;
  const taskEditable = selfEditable || mgrEditable;

  // Lần đầu đăng nhập: gán Họ tên + Chức vụ vào danh sách cán bộ theo email (cập nhật nếu đã có, thêm mới nếu chưa).
  const applyFirstLoginProfile = ({ name, position }) => {
    if (!myEmail) return;
    setPeople((ps) => {
      const i = ps.findIndex((p) => p.email && p.email.toLowerCase() === myEmail.toLowerCase());
      if (i >= 0) {
        const next = [...ps];
        next[i] = { ...next[i], name: name || next[i].name, position: position || next[i].position };
        return next;
      }
      return [...ps, { ...newPerson(name || myEmail, 'staff'), email: myEmail, position: position || '' }];
    });
  };

  // ===== Cổng đăng nhập =====
  if (supabase && session === undefined) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-100 text-slate-500 text-sm">Đang kiểm tra đăng nhập...</div>;
  }
  if (supabase && !session) {
    return <Login unit={unit} version={version} onPickVersion={onPickVersion} onGuest={() => setSession('guest')} />;
  }
  // Lần đầu đăng nhập (vào bằng liên kết email) mà chưa có mật khẩu -> bắt buộc tạo mật khẩu
  if (supabase && session && session !== 'local' && session !== 'guest' && !session.user?.user_metadata?.pw_set) {
    return <SetPassword unit={unit} email={myEmail} mode="create" onComplete={applyFirstLoginProfile} />;
  }

  return (
    <div className="min-h-screen text-slate-800" style={{ fontFamily: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif" }}>
      <header className="relative overflow-hidden text-white bg-gradient-to-br from-[#6b1212] via-[#a51c1c] to-[#7f1d1d]">
        <div className="absolute inset-0 tech-grid pointer-events-none" />
        <div className="absolute -top-24 -right-10 w-80 h-80 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-10 w-72 h-72 rounded-full bg-rose-500/20 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="shrink-0 w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-xl ring-2 ring-amber-300/60 emblem-glow animate-floatY p-1.5">
              <img src="/quoc-huy.svg" alt="Quốc huy Việt Nam" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-amber-300 text-[11px] font-semibold tracking-[0.22em] uppercase">Hệ thống quản trị OKR / KPI</p>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-red-900 px-2 py-0.5 rounded">Bản demo thử nghiệm</span>
              </div>
              <h1 className="text-lg sm:text-2xl font-extrabold leading-tight aurora-text">Đánh giá, xếp loại cán bộ, công chức</h1>
              <p className="text-red-100/90 text-xs sm:text-sm mt-0.5">{unit}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg ${isGuest ? 'bg-amber-500/20 text-amber-100' : (cloud.ready ? 'bg-emerald-500/20 text-emerald-100' : 'bg-amber-500/20 text-amber-100')}`}>
              {isGuest || !cloud.ready ? <CloudOff className="w-3.5 h-3.5" /> : <Cloud className="w-3.5 h-3.5" />}
              {isGuest ? 'Dùng thử · không lưu' : (cloud.ready ? (cloud.saving ? 'Đang lưu...' : 'Đã kết nối cloud') : 'Chạy cục bộ')}
            </span>
            {!readOnly && (
              <button onClick={handleManualSave} disabled={cloud.saving} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-colors disabled:opacity-50 border border-blue-500/50">
                <Save className="w-3.5 h-3.5" /> Lưu ngay
              </button>
            )}
            {supabase && session && session !== 'local' && (
              <div className="flex items-center gap-2 bg-red-950/40 rounded-lg px-2.5 py-1.5 border border-red-600/30">
                <User className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-xs text-red-100 max-w-[180px] truncate" title={isGuest ? 'Tài khoản khách — chỉ xem' : myEmail}>{isGuest ? 'Khách' : (myPerson?.name || session.user?.user_metadata?.full_name || myEmail)}<span className="text-amber-300"> · {ROLE_LABEL[role]}</span></span>
                {!isGuest && <button onClick={() => setShowChangePw(true)} title="Đổi mật khẩu" className="text-red-200 hover:text-white"><KeyRound className="w-3.5 h-3.5" /></button>}
                <button onClick={isGuest ? () => setSession(null) : signOut} title="Đăng xuất" className="text-red-200 hover:text-white"><LogOut className="w-3.5 h-3.5" /></button>
              </div>
            )}
            <div className="flex items-center gap-2 bg-red-950/40 rounded-xl px-3 py-2 border border-red-600/30" title="Chọn tháng/năm để xem hoặc nhập kỳ khác">
              <CalendarDays className="w-4 h-4 text-amber-300" />
              <input type="number" min="1" max="12" value={period.month} onChange={(e) => { loadingRef.current = true; setPeriod({ ...period, month: e.target.value }); }} onBlur={() => loadPeriod(period)} onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }} className="w-11 bg-white/10 rounded px-1 py-0.5 text-sm text-center text-white outline-none" />
              <span className="text-red-200">/</span>
              <input type="number" value={period.year} onChange={(e) => { loadingRef.current = true; setPeriod({ ...period, year: e.target.value }); }} onBlur={() => loadPeriod(period)} onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }} className="w-16 bg-white/10 rounded px-1 py-0.5 text-sm text-center text-white outline-none" />
            </div>
          </div>
        </div>
        <div className="relative glass-dark border-t border-white/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-1.5 overflow-x-auto py-2">
            {tabs.map((t) => { const Ic = t.icon; const on = tab === t.id;
              return (<button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-3.5 sm:px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${on ? 'bg-white text-red-800 shadow-lg shadow-black/20 ring-1 ring-amber-300/50' : 'text-red-100/80 hover:text-white hover:bg-white/10'}`}><Ic className="w-4 h-4" />{t.label}</button>); })}
          </div>
        </div>
      </header>

      {showChangePw && (
        <SetPassword mode="change" unit={unit} email={myEmail} onClose={() => setShowChangePw(false)} onDone={() => setTimeout(() => setShowChangePw(false), 1200)} />
      )}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {isGuest && (
          <div className="mb-5 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">Bạn đang dùng <b>tài khoản khách (dùng thử)</b>. Bạn có thể nhập điểm <b>Nhóm I, Nhóm II</b> và xem kết quả hệ thống tự tính, in/xuất báo cáo. Tuy nhiên dữ liệu <b>chỉ lưu tạm trên trình duyệt</b>, <b>KHÔNG lưu vào hệ thống</b> và sẽ mất khi tải lại trang hoặc đóng trình duyệt. Để lưu chính thức, hãy đăng nhập bằng tài khoản được cấp.</p>
          </div>
        )}
        {supabase && session && session !== 'local' && isBootstrapAdmin && (
          <div className="mb-5 bg-sky-50 border border-sky-200 rounded-xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <p className="text-sm text-sky-800">Bạn là <b>Quản trị</b>. Để phân quyền: vào tab <b>Đánh giá</b>, chọn từng cán bộ rồi điền <b>Email đăng nhập</b>, <b>Phòng</b> và chọn <b>Vai trò</b> (Cán bộ / Trưởng phòng / Quản trị). Cán bộ đăng nhập sẽ tự nhận đúng quyền theo email.</p>
          </div>
        )}
        {conflict && (
          <div className="mb-5 bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-rose-700 font-semibold">Dữ liệu kỳ này vừa được cập nhật từ nơi khác.</p>
              <p className="text-xs text-rose-600 mt-0.5">Để tránh ghi đè lên thay đổi của người khác, hãy tải lại dữ liệu mới nhất rồi chỉnh sửa tiếp.</p>
            </div>
            <button onClick={() => loadPeriod(period)} className="shrink-0 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold"><RotateCcw className="w-3.5 h-3.5" /> Tải lại</button>
          </div>
        )}

        {people.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center max-w-xl mx-auto">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h2 className="font-bold text-slate-800 text-lg">Kỳ tháng {period.month}/{period.year} chưa có dữ liệu</h2>
            <p className="text-sm text-slate-500 mt-1 mb-5">Bắt đầu bằng cách sao chép danh sách cán bộ từ kỳ gần nhất (giữ người, đặt lại điểm) hoặc thêm cán bộ mới.</p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              {!readOnly && seedFrom && <button onClick={() => copyFromPeriod(seedFrom)} className="flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white font-semibold px-4 py-2.5 rounded-xl text-sm"><Users className="w-4 h-4" /> Sao chép cán bộ từ kỳ {seedFrom.month}/{seedFrom.year}</button>}
              {!readOnly && <button onClick={() => { const np = newPerson('Cán bộ mới', 'staff'); setPeople([np]); setCurId(np.id); }} className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2.5 rounded-xl text-sm"><UserPlus className="w-4 h-4" /> Thêm cán bộ mới</button>}
            </div>
          </div>
        )}

        {people.length > 0 && tab === 'dash' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Stat icon={Users} label="Tổng số cán bộ" value={people.length} color="slate" />
              <Stat icon={TrendingUp} label="Điểm TB cơ quan" value={avg.toFixed(1)} color="red" />
              <Stat icon={Award} label="Hoàn thành xuất sắc" value={dist.A} color="emerald" />
              <Stat icon={Target} label="Mục tiêu (OKR)" value={objectives.length} color="amber" />
            </div>
            {overCap && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <p className="text-sm text-rose-700">Cảnh báo trần tỷ lệ: đang có <b>{dist.A}</b> "Hoàn thành xuất sắc" trong khi tối đa cho phép là <b>{Math.floor(dist.B * 0.2)}</b> (không vượt quá 20% của {dist.B} người "Hoàn thành tốt").</p>
              </div>
            )}
            <div className="grid lg:grid-cols-3 gap-6">
              <section className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-5 py-3.5"><h2 className="flex items-center gap-2 font-bold"><Target className="w-5 h-5 text-amber-300" /> Mục tiêu cấp Văn phòng (OKR)</h2></div>
                <div className="p-4 space-y-3">
                  {objectives.map((o) => { const pr = objProgress(o.id); const linked = people.flatMap((p) => p.tasks335 || []).filter((t) => t.objId === o.id && t.catalogId).length;
                    return (
                      <div key={o.id} className="border border-slate-200 rounded-xl p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <input value={o.title} disabled={!canManage} onChange={(e) => setObjectives((os) => os.map((x) => (x.id === o.id ? { ...x, title: e.target.value } : x)))} className="w-full font-semibold text-sm text-slate-800 bg-transparent outline-none focus:bg-slate-50 rounded px-1 -ml-1 disabled:text-slate-600" />
                            <div className="flex items-center gap-2 mt-1"><span className="text-[11px] font-bold bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-100">{o.source}</span><span className="text-[11px] text-slate-400 flex items-center gap-1"><Link2 className="w-3 h-3" /> {linked} nhiệm vụ</span></div>
                          </div>
                          {canManage && <button onClick={() => setObjectives((os) => os.filter((x) => x.id !== o.id))} className="text-slate-300 hover:text-rose-500 p-1"><Trash2 className="w-4 h-4" /></button>}
                        </div>
                        <div className="mt-2 flex items-center gap-3"><div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${pr === null ? 'bg-slate-200' : statusOf(pr).dot} transition-all`} style={{ width: `${pr || 0}%` }} /></div><span className="text-xs font-bold text-slate-600 w-20 text-right">{pr === null ? 'Chưa có' : `${pr.toFixed(0)}%`}</span></div>
                      </div>
                    ); })}
                  {canManage && <button onClick={() => setObjectives((os) => [...os, { id: 'o' + Date.now(), title: 'Mục tiêu mới...', source: 'Chương trình công tác' }])} className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-slate-300 rounded-xl text-sm font-medium text-slate-500 hover:border-red-400 hover:text-red-600"><Plus className="w-4 h-4" /> Thêm mục tiêu</button>}
                </div>
              </section>
              <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                <h2 className="flex items-center gap-2 font-bold text-slate-800 mb-4"><BarChart3 className="w-5 h-5 text-red-700" /> Phân bố xếp loại</h2>
                <div className="space-y-3">
                  {['A', 'B', 'C', 'D'].map((code) => { const cl = classify(code === 'A' ? 95 : code === 'B' ? 80 : code === 'C' ? 60 : 40); const n = dist[code]; const pct = people.length ? (n / people.length) * 100 : 0;
                    return (<div key={code}><div className="flex justify-between text-xs mb-1"><span className="font-semibold text-slate-600">Loại {code} — {cl.name}</span><span className="font-bold text-slate-700">{n}</span></div><div className="h-3 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${cl.bar} transition-all`} style={{ width: `${pct}%` }} /></div></div>); })}
                </div>
              </section>
            </div>
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-red-800 to-red-700 text-white px-5 py-3.5 flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-bold"><ClipboardList className="w-5 h-5 text-amber-300" /> Tổng hợp kết quả (Mẫu 1A)</h2>
                <div className="flex gap-2">
                  <button onClick={doExcel} className="flex items-center gap-1.5 text-xs bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-lg"><FileSpreadsheet className="w-3.5 h-3.5" /> Excel</button>
                  <button onClick={() => window.print()} className="flex items-center gap-1.5 text-xs bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-lg"><Printer className="w-3.5 h-3.5" /> In</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase"><tr><th className="text-left px-4 py-2.5 font-semibold">Họ và tên</th><th className="text-left px-3 py-2.5 font-semibold">Chức vụ</th><th className="text-center px-3 py-2.5 font-semibold">Tự ĐG</th><th className="text-center px-3 py-2.5 font-semibold">Cấp thẩm quyền</th><th className="text-center px-3 py-2.5 font-semibold">Xếp loại</th></tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {computed.map(({ p, c }) => { const r = classify(c.totalMgr);
                      return (<tr key={p.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => { setCurId(p.id); setTab('eval'); }}><td className="px-4 py-3 font-semibold text-slate-700">{p.name || '(Chưa đặt tên)'}</td><td className="px-3 py-3 text-slate-500 text-xs">{p.position || CRITERIA[p.type].label}</td><td className="px-3 py-3 text-center text-slate-500">{c.totalSelf.toFixed(1)}</td><td className="px-3 py-3 text-center font-bold text-slate-800">{c.totalMgr.toFixed(1)}</td><td className="px-3 py-3 text-center"><span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-bold ${r.soft}`}><span className={`w-5 h-5 rounded-full ${r.cls} text-white flex items-center justify-center text-[10px]`}>{r.code}</span></span></td></tr>); })}
                  </tbody>
                </table>
              </div>
              {canManage && <div className="p-3 border-t border-slate-100"><AddPerson onAdd={(name, type) => setPeople((ps) => [...ps, newPerson(name, type)])} /></div>}
            </section>

            {trends.length > 0 && (
              <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-5 py-3.5 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 font-bold"><TrendingUp className="w-5 h-5 text-amber-300" /> Xu hướng theo kỳ</h2>
                  <button onClick={refreshTrends} className="flex items-center gap-1.5 text-xs bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-lg"><RotateCcw className="w-3.5 h-3.5" /> Làm mới</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase"><tr><th className="text-left px-4 py-2.5 font-semibold">Kỳ</th><th className="text-center px-3 py-2.5 font-semibold">Số CB</th><th className="text-center px-3 py-2.5 font-semibold">Điểm TB</th><th className="text-center px-3 py-2.5 font-semibold text-emerald-600">A</th><th className="text-center px-3 py-2.5 font-semibold text-sky-600">B</th><th className="text-center px-3 py-2.5 font-semibold text-amber-600">C</th><th className="text-center px-3 py-2.5 font-semibold text-rose-600">D</th></tr></thead>
                    <tbody className="divide-y divide-slate-100">
                      {trends.map((t) => (
                        <tr key={`${t.year}-${t.month}`} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-semibold text-slate-700">Tháng {t.month}/{t.year}</td>
                          <td className="px-3 py-3 text-center text-slate-500">{t.count}</td>
                          <td className="px-3 py-3 text-center font-bold text-slate-800">{t.avg.toFixed(1)}</td>
                          <td className="px-3 py-3 text-center text-emerald-600 font-semibold">{t.dist.A}</td>
                          <td className="px-3 py-3 text-center text-sky-600 font-semibold">{t.dist.B}</td>
                          <td className="px-3 py-3 text-center text-amber-600 font-semibold">{t.dist.C}</td>
                          <td className="px-3 py-3 text-center text-rose-600 font-semibold">{t.dist.D}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-[11px] text-slate-400 px-4 py-2.5 border-t border-slate-100">Tổng hợp từ dữ liệu đã lưu của các kỳ. Bấm "Làm mới" sau khi cập nhật điểm để đồng bộ.</p>
              </section>
            )}
          </div>
        )}

        {people.length > 0 && tab === 'eval' && (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-4 space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-100"><h2 className="font-semibold text-slate-800 flex items-center gap-2"><Users className="w-4 h-4 text-slate-400" /> Danh sách cán bộ</h2></div>
                <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">{people.map((p) => (<button key={p.id} onClick={() => setCurId(p.id)} className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${curId === p.id ? 'bg-red-50' : 'hover:bg-slate-50'}`}><div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${curId === p.id ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'}`}><User className="w-4 h-4" /></div><div><p className={`text-sm font-medium ${curId === p.id ? 'text-red-700' : 'text-slate-700'}`}>{p.name || '(Chưa tên)'}</p><p className="text-[11px] text-slate-400 mt-0.5">{p.position || CRITERIA[p.type].label}</p></div></button>))}</div>
                {canManage && <button onClick={() => { const np = newPerson('Cán bộ mới', 'staff'); setPeople(ps => [...ps, np]); setCurId(np.id); }} className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 text-slate-500 text-sm font-medium hover:bg-slate-100 hover:text-slate-700 transition-colors border-t border-slate-100"><UserPlus className="w-4 h-4" /> Thêm cán bộ</button>}
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 text-center">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">Tổng điểm KPI</p>
                <div className="flex justify-center items-end gap-2 text-red-600"><span className="text-4xl font-extrabold leading-none">{curC.totalMgr.toFixed(1)}</span><span className="text-sm font-bold pb-1">/ 100</span></div>
                <div className="mt-4"><span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${result.soft}`}>{result.name}</span></div>
              </div>
            </aside>

            <div className="flex-1 space-y-6">
              <div className="space-y-6">
                {!selfEditable && !mgrEditable && (
                  <div className="bg-slate-100 border border-slate-200 rounded-xl p-3 text-sm text-slate-600 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-slate-400" /> Bạn đang ở chế độ <b>chỉ xem</b> với cán bộ này (không đủ quyền chỉnh sửa).</div>
                )}
                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 lg:p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="flex items-center gap-2 font-bold text-slate-800"><User className="w-5 h-5 text-red-700" /> Thông tin người được đánh giá</h2>
                    {canManage && people.length > 1 && <button onClick={() => { if (!window.confirm(`Xóa cán bộ "${cur.name || '(Chưa tên)'}"? Toàn bộ điểm và nhiệm vụ của kỳ này sẽ mất và không thể hoàn tác.`)) return; setPeople((ps) => ps.filter((p) => p.id !== cur.id)); setCurId(people.find(p => p.id !== cur.id).id); }} className="text-slate-400 hover:text-rose-500 flex items-center gap-1 text-sm font-medium"><Trash2 className="w-4 h-4" /> Xóa cán bộ</button>}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Field label="Họ và tên"><input value={cur.name} disabled={!(canManage || mgrEditable)} onChange={(e) => upCur({ name: e.target.value })} className="inp disabled:bg-slate-50 disabled:text-slate-500" /></Field>
                    <Field label="Phòng / Bộ phận"><select value={cur.department || ''} disabled={!(canManage || mgrEditable)} onChange={(e) => upCur({ department: e.target.value, position: '' })} className="inp disabled:bg-slate-50 disabled:text-slate-500"><option value="">— Chọn phòng / bộ phận —</option>{ORG_UNITS.map((u) => <option key={u.dept} value={u.dept}>{u.dept}</option>)}</select></Field>
                    <Field label="Chức vụ / Vị trí việc làm"><select value={cur.position || ''} disabled={!(canManage || mgrEditable)} onChange={(e) => upCur({ position: e.target.value })} className="inp disabled:bg-slate-50 disabled:text-slate-500"><option value="">— Chọn chức vụ —</option>{posOptions(cur.department).map((p) => <option key={p} value={p}>{p}</option>)}{cur.position && !posOptions(cur.department).includes(cur.position) && <option value={cur.position}>{cur.position}</option>}</select></Field>
                    <Field label="Email đăng nhập (để cán bộ tự đánh giá)"><input value={cur.email || ''} disabled={!canManage} onChange={(e) => upCur({ email: e.target.value })} placeholder="ten@coquan.gov.vn" className="inp disabled:bg-slate-50 disabled:text-slate-500" /></Field>
                    {canManage && <Field label="Vai trò (quyền truy cập)"><select value={cur.role || 'canbo'} onChange={(e) => upCur({ role: e.target.value })} className="inp"><option value="canbo">Cán bộ — tự đánh giá phần mình</option><option value="truongphong">Trưởng phòng — duyệt trong phòng</option><option value="quantri">Quản trị — toàn quyền</option></select></Field>}
                  </div>
                  <Field label="Nhóm đối tượng đánh giá" className="mt-3">
                    <div className="grid sm:grid-cols-3 gap-2">
                      {Object.entries(CRITERIA).map(([k, v]) => (<button key={k} disabled={!(canManage || mgrEditable || selfEditable)} onClick={() => upCur({ type: k, selfScores: {}, mgrScores: {} })} className={`text-left p-3 rounded-xl border-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed ${cur.type === k ? 'border-red-600 bg-red-50' : 'border-slate-200 hover:border-slate-300'}`}><span className={`text-[11px] font-bold ${cur.type === k ? 'text-red-700' : 'text-slate-400'}`}>{v.mau}</span><p className="text-xs font-medium text-slate-700 leading-snug mt-0.5">{v.label}</p></button>))}
                    </div>
                  </Field>
                </section>
                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-5 py-3.5 flex items-center justify-between"><h2 className="flex items-center gap-2 font-bold"><ClipboardList className="w-5 h-5 text-amber-300" /> Nhóm I — Tiêu chí chung</h2><div className="flex items-center gap-3 text-sm"><span className="text-slate-300">Tự: <b className="text-white">{curC.nself.toFixed(1)}</b></span><span className="text-amber-300 font-bold">Duyệt: {curC.nmgr.toFixed(1)}/30</span></div></div>
                  <div className="px-4 pt-3 flex justify-end gap-2 text-[11px] font-bold text-slate-400 pr-2"><span className="w-16 text-center">TỰ ĐG</span><span className="w-16 text-center text-red-600">CẤP DUYỆT</span></div>
                  <div className="p-4 pt-2 space-y-4">
                    {cfg.groups.map((g) => { const sub = g.items.reduce((s, it) => s + (cur.mgrScores[it.id] ?? cur.selfScores[it.id] ?? it.max), 0);
                      return (<div key={g.id} className="border border-slate-200 rounded-xl overflow-hidden"><div className="bg-slate-50 px-4 py-2.5 flex items-center justify-between gap-2"><p className="text-sm font-semibold text-slate-700">{g.title}</p><span className="shrink-0 text-xs font-bold text-red-700 bg-red-50 px-2 py-1 rounded-md border border-red-100">{sub.toFixed(1)}/{g.max}</span></div>
                        <div className="divide-y divide-slate-100">{g.items.map((it) => { const sv = cur.selfScores[it.id] ?? it.max; const mv = cur.mgrScores[it.id] ?? sv;
                          return (<div key={it.id} className="px-4 py-3"><div className="flex items-start gap-3"><span className="shrink-0 text-xs font-bold text-slate-400 w-7 pt-1.5">{it.id}</span><button onClick={() => setOpen(open === it.id ? null : it.id)} className="flex-1 text-left text-sm text-slate-600 hover:text-slate-900 flex items-start gap-1 pt-1"><span className={open === it.id ? '' : 'line-clamp-1'}>{it.text}</span><ChevronDown className={`w-4 h-4 shrink-0 text-slate-300 mt-0.5 transition-transform ${open === it.id ? 'rotate-180' : ''}`} /></button><div className="shrink-0 flex gap-2"><input type="number" min="0" max={it.max} step="0.25" value={sv} disabled={!selfEditable} onChange={(e) => upCur({ selfScores: { ...cur.selfScores, [it.id]: clamp(Number(e.target.value), 0, it.max) } })} className="w-16 text-center text-slate-600 bg-slate-50 border border-slate-200 rounded-lg py-1 text-sm outline-none focus:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed" /><input type="number" min="0" max={it.max} step="0.25" value={mv} disabled={!mgrEditable} onChange={(e) => upCur({ mgrScores: { ...cur.mgrScores, [it.id]: clamp(Number(e.target.value), 0, it.max) } })} className="w-16 text-center font-bold text-red-700 bg-red-50 border border-red-200 rounded-lg py-1 text-sm outline-none focus:border-red-400 disabled:opacity-50 disabled:cursor-not-allowed" /></div></div>{open === it.id && <p className="mt-2 ml-10 text-xs text-slate-500 bg-slate-50 rounded-lg p-2.5 leading-relaxed">Điểm tối đa: {it.max}. {it.text}</p>}</div>); })}</div>
                      </div>); })}
                  </div>
                </section>
                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-red-800 to-red-700 text-white px-5 py-3.5 flex items-center justify-between"><h2 className="flex items-center gap-2 font-bold"><Target className="w-5 h-5 text-amber-300" /> Nhóm II — Kết quả thực hiện nhiệm vụ</h2><span className="text-amber-300 font-bold text-sm">{curC.nhomII.toFixed(2)} / 70</span></div>
                  <div className="p-4">
                    {taskEditable && <button onClick={doCollectTracking} className="mb-3 w-full flex items-center justify-center gap-2 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-lg text-xs font-semibold transition-colors"><RotateCcw className="w-3.5 h-3.5" /> Thu thập nhiệm vụ từ Bảng theo dõi CV</button>}
                    <p className="text-xs text-slate-500 mb-3 bg-amber-50 border border-amber-100 rounded-lg p-2.5">Chọn công việc từ danh mục và liên kết mục tiêu (OKR). Đánh giá theo đếm khách quan: Lỗi chất lượng (+1 = −25%), Chậm tiến độ (+1 = −25%). Cách quy đổi theo trọng số xem ở tab Hướng dẫn.</p>
                    <div className="space-y-3">{(cur.tasks335 || []).map((t, i) => { const sc = task335Score(t); const st = statusOf(sc);
                      return (<div key={t.id} className={`border rounded-xl p-3 ${st.soft} border-slate-200`}>
                        <div className="flex items-center gap-2 mb-2"><span className={`shrink-0 w-2.5 h-2.5 rounded-full ${st.dot}`} title={st.label} /><span className="shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xs font-bold">{i + 1}</span>{t.srcTrkId != null && <span className="shrink-0 text-[10px] font-bold text-indigo-700 bg-indigo-100 border border-indigo-200 rounded px-1.5 py-0.5" title="Nhiệm vụ được thu thập từ Bảng theo dõi CV">từ Theo dõi CV</span>}<select value={t.catalogId} disabled={!taskEditable} onChange={(e) => upTask335(t.id, { catalogId: e.target.value })} className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 font-medium outline-none focus:border-red-400 disabled:opacity-60 disabled:cursor-not-allowed"><option value="">— Chọn công việc từ danh mục —</option>{getND335Groups(cur.type).map((c) => (<option key={c.id} value={c.id}>[{c.id}] {c.name}</option>))}</select><span className={`shrink-0 text-[11px] font-bold ${st.txt}`}>{sc.toFixed(0)}%</span>{taskEditable && (cur.tasks335 || []).length > 1 && <button onClick={() => upCur({ tasks335: (cur.tasks335 || []).filter((x) => x.id !== t.id) })} className="shrink-0 text-rose-400 hover:bg-rose-100 p-1.5 rounded-lg"><Trash2 className="w-4 h-4" /></button>}</div>
                        <div className="flex items-center gap-2 mb-2"><Link2 className="w-3.5 h-3.5 text-slate-400 shrink-0" /><select value={t.objId || ''} disabled={!taskEditable} onChange={(e) => upTask335(t.id, { objId: e.target.value })} className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-600 outline-none focus:border-red-400 disabled:opacity-60 disabled:cursor-not-allowed"><option value="">— Liên kết mục tiêu (OKR) —</option>{objectives.map((o) => <option key={o.id} value={o.id}>{o.title}</option>)}</select></div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white/60 p-2 rounded-lg"><MiniNum label="Số lượng giao" value={t.assigned} min={1} disabled={!taskEditable} onChange={(v) => upTask335(t.id, { assigned: v })} /><MiniNum label="Số lượng HT" value={t.completed} min={0} disabled={!taskEditable} onChange={(v) => upTask335(t.id, { completed: v })} /><MiniNum label="Lỗi chất lượng" value={t.qualityIssues} min={0} disabled={!taskEditable} onChange={(v) => upTask335(t.id, { qualityIssues: v })} /><MiniNum label="Chậm tiến độ" value={t.delays} min={0} disabled={!taskEditable} onChange={(v) => upTask335(t.id, { delays: v })} /></div>
                        <div className="mt-2"><input value={t.note || ''} disabled={!taskEditable} onChange={(e) => upTask335(t.id, { note: e.target.value })} placeholder="Nhận xét, khó khăn, kiến nghị..." className="w-full bg-white/60 focus:bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-red-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed" /></div>
                      </div>); })}</div>
                    {taskEditable && <button onClick={() => upCur({ tasks335: [...(cur.tasks335 || []), newTask335()] })} className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-slate-300 rounded-xl text-sm font-medium text-slate-500 hover:border-red-400 hover:text-red-600"><Plus className="w-4 h-4" /> Thêm nhiệm vụ</button>}
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">{[['Khối lượng (a)', curC.k.a], ['Chất lượng (b)', curC.k.b], ['Tiến độ (c)', curC.k.c], ['Trung bình', curC.k.val]].map(([l, v], idx) => (<div key={l} className={`${idx === 3 ? 'bg-red-50 border-red-200 text-red-700' : 'bg-slate-50 border-slate-100 text-slate-700'} rounded-lg py-2 border`}><p className={`text-[11px] ${idx === 3 ? 'text-red-500' : 'text-slate-500'}`}>{l}</p><p className="font-bold">{Number(v).toFixed(1)}%</p></div>))}</div>
                  </div>
                </section>
                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
                  <div><h2 className="flex items-center gap-2 font-bold text-slate-800 mb-2"><AlertTriangle className="w-5 h-5 text-amber-600" /> Điểm trừ</h2><div className="flex items-center gap-3"><input type="number" min="0" value={cur.deduction} disabled={!mgrEditable} onChange={(e) => upCur({ deduction: e.target.value })} className="inp w-32 disabled:bg-slate-50 disabled:text-slate-500" /><span className="text-sm text-slate-500">điểm — theo mức độ vi phạm (cấp duyệt nhập).</span></div></div>
                  <Field label="Ý kiến tự nhận xét của cá nhân"><textarea value={cur.selfNote} disabled={!selfEditable} onChange={(e) => upCur({ selfNote: e.target.value })} rows={2} className="inp disabled:bg-slate-50 disabled:text-slate-500" /></Field>
                  <Field label="Nhận xét, kết luận của cấp có thẩm quyền"><textarea value={cur.mgrNote} disabled={!mgrEditable} onChange={(e) => upCur({ mgrNote: e.target.value })} rows={2} className="inp disabled:bg-slate-50 disabled:text-slate-500" /></Field>
                </section>
              </div>
              <aside className="lg:col-span-1"><div className="lg:sticky lg:top-4 space-y-4">
                <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
                  <div className={`${result.cls} text-white text-center py-5`}><p className="text-xs opacity-90 uppercase tracking-wider">Tổng điểm (cấp duyệt)</p><p className="text-5xl font-extrabold mt-1">{curC.totalMgr.toFixed(2)}</p><p className="text-sm opacity-90">Tự đánh giá: {curC.totalSelf.toFixed(2)} / 100</p></div>
                  <div className="p-4 text-center border-b border-slate-100"><span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-bold text-sm ${result.soft}`}><span className="w-7 h-7 rounded-full bg-white/60 flex items-center justify-center font-extrabold">{result.code}</span>{result.name}</span></div>
                  <div className="p-4 space-y-2.5 text-sm"><SumRow label="Nhóm I — Tiêu chí chung" value={`${curC.nmgr.toFixed(2)} / 30`} /><SumRow label="Điểm KPI quy đổi" value={`${curC.k.val.toFixed(1)}%`} /><SumRow label="Nhóm II — Kết quả (× 70%)" value={`${curC.nhomII.toFixed(2)} / 70`} /><SumRow label="Điểm trừ" value={`− ${Number(cur.deduction || 0).toFixed(2)}`} danger /><div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-slate-800"><span>Tổng cộng</span><span className={result.ring}>{curC.totalMgr.toFixed(2)}</span></div></div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3 space-y-2">
                  <button onClick={doWord} className="w-full flex items-center justify-center gap-2 bg-sky-700 hover:bg-sky-800 text-white font-semibold py-2.5 rounded-xl"><FileText className="w-4 h-4" /> Xuất phiếu Word</button>
                  <button onClick={() => window.print()} className="w-full flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white font-semibold py-2.5 rounded-xl"><Printer className="w-4 h-4" /> In phiếu (PDF)</button>
                  {(canManage || mgrEditable) && <button onClick={() => { if (!window.confirm('Đặt lại toàn bộ điểm và nhiệm vụ của cán bộ này về mặc định?')) return; upCur({ selfScores: {}, mgrScores: {}, deduction: 0, tasks335: [newTask335()], selfNote: '', mgrNote: '' }); }} className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl"><RotateCcw className="w-4 h-4" /> Đặt lại cán bộ này</button>}
                </div>
              </div></aside>
            </div>
          </div>
        )}

        {people.length > 0 && tab === 'digital' && (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-4 space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-100"><h2 className="font-semibold text-slate-800 flex items-center gap-2"><Users className="w-4 h-4 text-slate-400" /> Danh sách cán bộ</h2></div>
                <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">{people.map((p) => (<button key={p.id} onClick={() => setCurId(p.id)} className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${curId === p.id ? 'bg-emerald-50' : 'hover:bg-slate-50'}`}><div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${curId === p.id ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}><User className="w-4 h-4" /></div><div><p className={`text-sm font-medium ${curId === p.id ? 'text-emerald-700' : 'text-slate-700'}`}>{p.name || '(Chưa tên)'}</p><p className="text-[11px] text-slate-400 mt-0.5">{p.position || CRITERIA[p.type].label}</p></div></button>))}</div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 text-center">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">Chỉ tiêu tối thiểu</p>
                <p className="text-3xl font-extrabold text-emerald-600 leading-none">Mức {minLv}</p>
                <div className="mt-4"><span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${digPassed === DIGITAL.length ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{digPassed} / {DIGITAL.length} kỹ năng đạt</span></div>
              </div>
            </aside>
            <div className="flex-1 space-y-6">
              <div className="space-y-4">
                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5"><h2 className="flex items-center gap-2 font-bold text-slate-800"><Cpu className="w-5 h-5 text-emerald-700" /> Tự đánh giá Khung năng lực số</h2><p className="text-sm text-slate-500 mt-1">Mức chuẩn tối thiểu cho <b>{CRITERIA[cur.type].label}</b>: <b className="text-emerald-700">Mức {minLv}</b>. Kết quả là chỉ số phụ trợ, không cộng vào điểm tháng.</p></section>
                {DIGITAL.map((d) => { const lv = cur.digital[d.id] || 0; const ok = lv >= minLv;
                  return (<div key={d.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4"><div className="flex items-start gap-3"><span className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${ok ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>{d.id}</span><div className="flex-1"><div className="flex items-center gap-2 flex-wrap"><p className="font-semibold text-slate-800 text-sm">{d.name}</p>{d.mandatory && <span className="text-[10px] font-bold bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded">BẮT BUỘC</span>}{lv > 0 && (ok ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />)}</div><div className="flex flex-wrap gap-1.5 mt-2.5">{LEVELS.map((L) => (<button key={L.v} disabled={readOnly} onClick={() => upCur({ digital: { ...cur.digital, [d.id]: L.v } })} className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all disabled:opacity-60 disabled:cursor-not-allowed ${lv === L.v ? (L.v >= minLv ? 'bg-emerald-600 text-white border-emerald-600' : L.v === 0 ? 'bg-slate-500 text-white border-slate-500' : 'bg-amber-500 text-white border-amber-500') : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>{L.s}</button>))}</div></div></div></div>); })}
              </div>
            </div>
          </div>
        )}

        {people.length > 0 && tab === 'tracking' && (
          <div className="flex flex-col md:flex-row gap-6">
            <aside className="w-full md:w-64 shrink-0 print:hidden space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-100"><h2 className="font-semibold text-slate-800 flex items-center gap-2"><Users className="w-4 h-4 text-slate-400" /> Danh sách cán bộ</h2></div>
                <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">{people.map((p) => (<button key={p.id} onClick={() => setCurId(p.id)} className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${curId === p.id ? 'bg-amber-50/50' : 'hover:bg-slate-50'}`}><div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${curId === p.id ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}><User className="w-4 h-4" /></div><div><p className={`text-sm font-medium ${curId === p.id ? 'text-amber-700' : 'text-slate-700'}`}>{p.name || '(Chưa tên)'}</p><p className="text-[11px] text-slate-400 mt-0.5">{p.position || CRITERIA[p.type].label}</p></div></button>))}</div>
                {!readOnly && <button onClick={() => { const np = newPerson('Cán bộ mới', 'staff'); setPeople(ps => [...ps, np]); setCurId(np.id); }} className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 text-slate-500 text-sm font-medium hover:bg-slate-100 hover:text-slate-700 transition-colors border-t border-slate-100"><UserPlus className="w-4 h-4" /> Thêm cán bộ</button>}
              </div>
            </aside>
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><ClipboardList className="w-5 h-5 text-amber-500" /> Bảng kiểm đếm, theo dõi công việc</h2>
                  <p className="text-sm text-slate-500 mt-1">{getWeekTitle(new Date(trackingDate))}</p>
                  {canManage && <p className="text-[11px] text-slate-400 mt-0.5">Nguồn đồng bộ: <a href={SHEET_URL} target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline">Google Sheet</a>{sheetSync.at ? ` · Đã đồng bộ lúc ${new Date(sheetSync.at).toLocaleString('vi-VN')}` : ' · Bấm "Đồng bộ từ Google Sheet" để nạp dữ liệu mới nhất'}</p>}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <input type="date" value={trackingDate} onChange={(e) => setTrackingDate(e.target.value)} className="text-xs px-2 py-1.5 border border-slate-200 rounded outline-none focus:border-amber-400" />
                  {canManage && <button onClick={syncFromSheet} disabled={sheetSync.busy} title="Nạp dữ liệu kiểm đếm mới nhất từ Google Sheet" className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 rounded-lg text-xs font-semibold transition-colors"><Cloud className="w-3.5 h-3.5" /> {sheetSync.busy ? 'Đang đồng bộ...' : 'Đồng bộ từ Google Sheet'}</button>}
                  {taskEditable && <button onClick={doCollectTracking} title="Tạo nhiệm vụ Nhóm II từ các công việc đã gắn Danh mục" className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg text-xs font-semibold transition-colors"><RotateCcw className="w-3.5 h-3.5" /> Thu thập vào đánh giá KPI</button>}
                  <button onClick={doExportTracking} className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-semibold transition-colors border border-red-200"><FileText className="w-3.5 h-3.5" /> Xuất bảng (PDF)</button>
                </div>
              </div>
              <fieldset disabled={readOnly} className="contents">
              <div className="px-5 py-4 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1 w-full">
                  <label className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Họ và tên cán bộ</label>
                  <input type="text" value={cur.name} onChange={(e) => upCur({ name: e.target.value })} placeholder="Nhập tên cán bộ..." className="mt-1.5 w-full text-sm p-2 border border-slate-200 rounded-lg outline-none focus:border-amber-400 font-semibold text-slate-800 bg-white" />
                </div>
                <div className="flex-1 w-full">
                  <label className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Chức vụ / Vị trí</label>
                  <input type="text" value={cur.position} onChange={(e) => upCur({ position: e.target.value })} placeholder="Nhập chức vụ..." className="mt-1.5 w-full text-sm p-2 border border-slate-200 rounded-lg outline-none focus:border-amber-400 text-slate-700 bg-white" />
                </div>
              </div>
              <div className="p-5 space-y-4">
                <datalist id="coordination-list">
                  <option value="Văn phòng Đoàn ĐBQH và HĐND tỉnh" />
                  <option value="Ban Pháp chế HĐND tỉnh" />
                  <option value="Ban Kinh tế - Ngân sách HĐND tỉnh" />
                  <option value="Ban Văn hóa - Xã hội HĐND tỉnh" />
                  <option value="Ban Dân tộc HĐND tỉnh" />
                </datalist>
                {(cur.trackings || []).map((t, idx) => (
                  <div key={t.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 relative group">
                    <button onClick={() => upCur({ trackings: (cur.trackings || []).filter((x) => x.id !== t.id) })} className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>
                    <div className="mb-3 font-semibold text-slate-700 text-sm flex items-center gap-2">Công việc #{idx + 1}{t.fromSheet && <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 rounded px-1.5 py-0.5">từ Google Sheet</span>}</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div><label className="text-[11px] font-medium text-slate-500">Nội dung công việc</label><textarea value={t.content} onChange={(e) => upTracking(t.id, { content: e.target.value })} className="mt-1 w-full text-xs p-2 border border-slate-200 rounded outline-none focus:border-amber-400 min-h-[60px]" /></div>
                      <div><label className="text-[11px] font-medium text-slate-500">Đơn vị chủ trì, phối hợp</label><input type="text" list="coordination-list" value={t.coordination} onChange={(e) => upTracking(t.id, { coordination: e.target.value })} className="mt-1 w-full text-xs p-2 border border-slate-200 rounded outline-none focus:border-amber-400" /></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div><label className="text-[11px] font-medium text-slate-500">Ý kiến chỉ đạo của TT HĐND</label><textarea value={t.directive} onChange={(e) => upTracking(t.id, { directive: e.target.value })} className="mt-1 w-full text-xs p-2 border border-slate-200 rounded outline-none focus:border-amber-400 min-h-[60px]" /></div>
                      <div><label className="text-[11px] font-medium text-slate-500">Sản phẩm cuối cùng</label><textarea value={t.finalProduct} onChange={(e) => upTracking(t.id, { finalProduct: e.target.value })} className="mt-1 w-full text-xs p-2 border border-slate-200 rounded outline-none focus:border-amber-400 min-h-[60px]" /></div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                      <div><label className="text-[11px] font-medium text-slate-500">Triển khai (dd/mm/yyyy)</label><input type="text" placeholder="Ví dụ: 01/06/2026" value={t.startDate} onChange={(e) => upTracking(t.id, { startDate: e.target.value })} className="mt-1 w-full text-xs p-1.5 border border-slate-200 rounded outline-none focus:border-amber-400" /></div>
                      <div><label className="text-[11px] font-medium text-slate-500">Hoàn thành (dd/mm/yyyy)</label><input type="text" placeholder="Ví dụ: 07/06/2026" value={t.endDate} onChange={(e) => upTracking(t.id, { endDate: e.target.value })} className="mt-1 w-full text-xs p-1.5 border border-slate-200 rounded outline-none focus:border-amber-400" /></div>
                      <div><label className="text-[11px] font-medium text-slate-500">Đã thực hiện</label><textarea value={t.doneWork} onChange={(e) => upTracking(t.id, { doneWork: e.target.value })} className="mt-1 w-full text-xs p-1.5 border border-slate-200 rounded outline-none focus:border-amber-400 min-h-[40px]" /></div>
                      <div><label className="text-[11px] font-medium text-slate-500">Đang thực hiện</label><textarea value={t.doingWork} onChange={(e) => upTracking(t.id, { doingWork: e.target.value })} className="mt-1 w-full text-xs p-1.5 border border-slate-200 rounded outline-none focus:border-amber-400 min-h-[40px]" /></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div><label className="text-[11px] font-medium text-slate-500">Khó khăn, vướng mắc</label><textarea value={t.difficulties} onChange={(e) => upTracking(t.id, { difficulties: e.target.value })} className="mt-1 w-full text-xs p-1.5 border border-slate-200 rounded outline-none focus:border-amber-400 min-h-[40px]" /></div>
                      <div><label className="text-[11px] font-medium text-slate-500">Đề xuất, kiến nghị</label><textarea value={t.proposals} onChange={(e) => upTracking(t.id, { proposals: e.target.value })} className="mt-1 w-full text-xs p-1.5 border border-slate-200 rounded outline-none focus:border-amber-400 min-h-[40px]" /></div>
                      <div><label className="text-[11px] font-medium text-slate-500">Ghi chú</label><textarea value={t.note} onChange={(e) => upTracking(t.id, { note: e.target.value })} className="mt-1 w-full text-xs p-1.5 border border-slate-200 rounded outline-none focus:border-amber-400 min-h-[40px]" /></div>
                    </div>
                    <div className="mt-3 rounded-lg border border-indigo-200 bg-indigo-50/60 p-3">
                      <p className="text-[11px] font-bold text-indigo-700 flex items-center gap-1.5 mb-2"><Target className="w-3.5 h-3.5" /> Phục vụ chấm điểm KPI (Nhóm II) — chọn Danh mục để có thể "Thu thập vào đánh giá"</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                        <div>
                          <label className="text-[11px] font-medium text-slate-500">Danh mục công việc (KPI)</label>
                          <select value={t.catalogId || ''} onChange={(e) => upTracking(t.id, { catalogId: e.target.value })} className="mt-1 w-full text-xs p-1.5 border border-slate-200 rounded outline-none focus:border-indigo-400 bg-white">
                            <option value="">— Chọn danh mục —</option>
                            {getND335Groups(cur.type).map((c) => (<option key={c.id} value={c.id}>[{c.id}] {c.name}</option>))}
                          </select>
                        </div>
                        <div>
                          <label className="text-[11px] font-medium text-slate-500">Liên kết mục tiêu (OKR)</label>
                          <select value={t.objId || ''} onChange={(e) => upTracking(t.id, { objId: e.target.value })} className="mt-1 w-full text-xs p-1.5 border border-slate-200 rounded outline-none focus:border-indigo-400 bg-white">
                            <option value="">— Liên kết OKR —</option>
                            {objectives.map((o) => <option key={o.id} value={o.id}>{o.title}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[11px] font-medium text-slate-500">Đã hoàn thành?</label>
                          <select value={Number(t.completed) ? 1 : 0} onChange={(e) => upTracking(t.id, { completed: Number(e.target.value) })} className="mt-1 w-full text-xs p-1.5 border border-slate-200 rounded outline-none focus:border-indigo-400 bg-white">
                            <option value={0}>Chưa</option>
                            <option value={1}>Hoàn thành</option>
                          </select>
                        </div>
                        <MiniNum label="Lỗi chất lượng" value={t.qualityIssues || 0} min={0} onChange={(v) => upTracking(t.id, { qualityIssues: v })} />
                        <MiniNum label="Chậm tiến độ" value={t.delays || 0} min={0} onChange={(v) => upTracking(t.id, { delays: v })} />
                      </div>
                    </div>
                  </div>
                ))}
                {!(cur.trackings?.length) && <div className="text-center py-10 text-slate-400 text-sm">Chưa có công việc nào. Hãy thêm mới!</div>}
                <button onClick={() => upCur({ trackings: [...(cur.trackings || []), newTracking()] })} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-300 rounded-xl text-sm font-medium text-slate-500 hover:border-amber-400 hover:text-amber-600 transition-colors"><Plus className="w-4 h-4" /> Thêm công việc</button>
              </div>
              </fieldset>
            </div>
          </div>
        )}

        {tab === 'guide' && (
          <div className="space-y-6 max-w-3xl mx-auto">
          <ContactCard />
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><BookOpen className="w-6 h-6 text-red-700" /> Hướng dẫn sử dụng & cách tính điểm</h2>
              <p className="text-sm text-slate-500 mt-1">Tài liệu minh bạch toàn bộ công thức và quy trình. Người mới đọc cũng hiểu cách hệ thống chấm điểm và sử dụng.</p>
            </div>

            <GB icon={LayoutDashboard} title="1. Năm khu vực (tab) của hệ thống">
              <ul className="list-disc pl-5 space-y-1">
                <li><b>Tổng quan:</b> Mục tiêu OKR cấp Văn phòng, phân bố xếp loại, bảng tổng hợp kết quả (Mẫu 1A) và xu hướng theo kỳ.</li>
                <li><b>Đánh giá:</b> Nơi chấm điểm từng cán bộ — Nhóm I (tiêu chí chung) và Nhóm II (kết quả nhiệm vụ).</li>
                <li><b>Năng lực số:</b> Tự đánh giá khung năng lực số (chỉ số phụ trợ, không cộng vào điểm tháng).</li>
                <li><b>Theo dõi CV:</b> Bảng kiểm đếm công việc theo tuần; <b>đồng bộ từ Google Sheet</b>, <b>thu thập</b> thành nhiệm vụ KPI và <b>xuất bảng PDF</b>.</li>
                <li><b>Liên hệ & hướng dẫn:</b> Thông tin liên hệ, ô gửi ý kiến và trang hướng dẫn này.</li>
              </ul>
            </GB>

            <GB icon={TrendingUp} title="2. Thang điểm tổng — 100 điểm">
              <p className="bg-slate-50 border border-slate-200 rounded-lg p-3 font-semibold text-slate-700">TỔNG = Nhóm I (tối đa 30) + Nhóm II (tối đa 70) − Điểm trừ</p>
              <p className="mt-2">Mỗi cán bộ được chấm 2 cấp: <b>Tự đánh giá</b> (cá nhân tự chấm) và <b>Cấp duyệt</b> (cấp có thẩm quyền quyết định). Điểm xếp loại chính thức lấy theo cột <b>Cấp duyệt</b>.</p>
            </GB>

            <GB icon={ClipboardList} title="3. Nhóm I — Tiêu chí chung (tối đa 30 điểm)">
              <p>Đánh giá phẩm chất chính trị, đạo đức, ý thức kỷ luật, năng lực, thái độ... theo bộ tiêu chí tương ứng nhóm đối tượng:</p>
              <ul className="list-disc pl-5 space-y-1 mt-1">
                <li><b>Mẫu 02</b> — Cán bộ lãnh đạo, quản lý.</li>
                <li><b>Mẫu 03</b> — Công chức, viên chức không lãnh đạo.</li>
                <li><b>Mẫu 04</b> — Lao động hợp đồng hỗ trợ, phục vụ.</li>
                <li><b>Mẫu 05</b> — Đại biểu HĐND tỉnh hoạt động chuyên trách (Thường trực HĐND, lãnh đạo các Ban, ủy viên chuyên trách) — dùng chung Tiêu chí chung như nhóm lãnh đạo.</li>
              </ul>
              <p className="mt-2">Mỗi tiêu chí có điểm tối đa riêng; cộng tất cả tiêu chí, <b>giới hạn không quá 30</b>. Nhập điểm ở 2 cột Tự ĐG và Cấp duyệt.</p>
            </GB>

            <GB icon={Target} title="4. Nhóm II — Kết quả thực hiện nhiệm vụ (tối đa 70 điểm)">
              <p>Chấm bằng <b>đếm khách quan</b>, không cảm tính. Mỗi nhiệm vụ chọn từ <b>danh mục công việc</b> (đã gán sẵn <b>hệ số</b> theo cấp độ), rồi nhập 4 con số: <b>Số lượng giao</b>, <b>Số lượng hoàn thành</b>, <b>Lỗi chất lượng</b>, <b>Chậm tiến độ</b>.</p>
              <p className="mt-2 font-semibold text-slate-700">Hệ thống tự tính 3 tỷ lệ (bình quân theo hệ số của tất cả nhiệm vụ):</p>
              <div className="mt-1 space-y-1 bg-slate-50 border border-slate-200 rounded-lg p-3 text-[13px]">
                <p><b>a — Khối lượng</b> = Σ(Hoàn thành × hệ số) ÷ Σ(Giao × hệ số) × 100%</p>
                <p><b>b — Chất lượng</b> = bình quân [1 − 0,25 × số Lỗi] theo hệ số × 100% <span className="text-slate-500">(mỗi lỗi −25%)</span></p>
                <p><b>c — Tiến độ</b> = bình quân [1 − 0,25 × số lần Chậm] theo hệ số × 100% <span className="text-slate-500">(mỗi lần chậm −25%)</span></p>
                <p className="pt-1 border-t border-slate-200 font-bold text-red-700">Điểm Nhóm II = (a + b + c) ÷ 3 × 70%</p>
              </div>
              <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="font-bold text-amber-800 mb-1">Ví dụ tính cụ thể</p>
                <p className="text-[13px]">• NV1 (hệ số 300): Giao 4, Hoàn thành 4, Lỗi 0, Chậm 1.<br/>• NV2 (hệ số 100): Giao 10, Hoàn thành 8, Lỗi 1, Chậm 0.</p>
                <p className="text-[13px] mt-2">
                  a = (4×300 + 8×100) ÷ (4×300 + 10×100) × 100 = 2000 ÷ 2200 = <b>90,9%</b><br/>
                  b = (1200×1 + 800×0,75) ÷ 2000 × 100 = 1800 ÷ 2000 = <b>90,0%</b><br/>
                  c = (1200×0,75 + 800×1) ÷ 2000 × 100 = 1700 ÷ 2000 = <b>85,0%</b><br/>
                  Trung bình = (90,9 + 90,0 + 85,0) ÷ 3 = <b>88,6%</b> → Nhóm II = 88,6% × 70% ≈ <b>62,0 / 70</b>
                </p>
              </div>
              <p className="mt-3"><b>Hệ số (N1–N4)</b> phản ánh độ phức tạp/cấp độ của công việc (N1 = 100 đến N4 = 400). Việc khó hơn có hệ số cao hơn nên đóng góp nhiều hơn vào điểm — đảm bảo công bằng giữa việc khó và việc đơn giản.</p>
            </GB>

            <GB icon={Link2} title="5. Liên kết mục tiêu (OKR)">
              <p>Mục tiêu (OKR) cấp Văn phòng gắn với Nghị quyết, chương trình công tác. Mỗi nhiệm vụ cá nhân nên <b>liên kết lên một mục tiêu</b> để dồn sức vào việc chiến lược, tránh phân mảnh. Tiến độ một mục tiêu = trung bình điểm các nhiệm vụ liên kết với nó (hiển thị ở tab Tổng quan).</p>
            </GB>

            <GB icon={Activity} title="6. Trạng thái nhiệm vụ (màu)">
              <p><b className="text-emerald-600">Xanh ≥ 90%</b> đúng tiến độ · <b className="text-amber-600">Vàng 70–90%</b> cần chú ý · <b className="text-rose-600">Đỏ &lt; 70%</b> chậm/rủi ro. Màu tự cập nhật theo số liệu nhập.</p>
            </GB>

            <GB icon={Award} title="7. Bốn mức xếp loại & trần tỷ lệ">
              <div className="grid sm:grid-cols-2 gap-2">{[['A', '≥ 90', 'Hoàn thành xuất sắc', 'emerald'], ['B', '70 → <90', 'Hoàn thành tốt', 'sky'], ['C', '50 → <70', 'Hoàn thành nhiệm vụ', 'amber'], ['D', '< 50', 'Không hoàn thành', 'rose']].map(([c, r, n, col]) => (<div key={c} className={`flex items-center gap-3 p-3 rounded-xl border bg-${col}-50 border-${col}-200`}><span className={`w-9 h-9 rounded-full bg-${col}-500 text-white font-extrabold flex items-center justify-center`}>{c}</span><div><p className={`font-bold text-${col}-700 text-sm`}>{n}</p><p className="text-xs text-slate-500">{r} điểm</p></div></div>))}</div>
              <p className="mt-2"><b>Trần xuất sắc:</b> số "Hoàn thành xuất sắc" (A) không vượt quá <b>20%</b> số "Hoàn thành tốt" (B). Hệ thống cảnh báo ở tab Tổng quan khi vượt trần — tránh cào bằng, giữ tính phân loại thực chất.</p>
            </GB>

            <GB icon={CalendarDays} title="8. Quy trình 2 cấp & mốc thời gian">
              <ol className="list-decimal pl-5 space-y-1">
                <li>Trước ngày <b>25</b>: cán bộ tự đánh giá (cột Tự ĐG).</li>
                <li>Trước ngày <b>26</b>: cấp có thẩm quyền cho ý kiến.</li>
                <li>Trước ngày <b>28</b>: cấp có thẩm quyền quyết định xếp loại (cột Cấp duyệt).</li>
                <li>Trước ngày <b>05 tháng sau</b>: công khai, biểu dương.</li>
              </ol>
            </GB>

            <GB icon={Cloud} title="9. Lưu dữ liệu theo kỳ & lịch sử">
              <p>Dữ liệu được lưu <b>riêng theo từng tháng/năm</b>: đổi tháng ở góc trên để xem lại kỳ trước hoặc nhập kỳ mới (có thể sao chép danh sách cán bộ từ kỳ gần nhất). Hệ thống lưu ngầm lên máy chủ và cảnh báo nếu phát hiện người khác vừa sửa cùng kỳ (tránh ghi đè mất dữ liệu).</p>
            </GB>

            <GB icon={ShieldCheck} title="10. Đăng nhập & phân quyền">
              <p>Đăng nhập bằng <b>email + mật khẩu</b>. <b>Lần đầu</b>: bấm "Lần đầu đăng nhập / Quên mật khẩu" để nhận <b>liên kết kích hoạt</b> qua email, sau đó nhập <b>Họ tên, Chức vụ và tạo mật khẩu</b> (thông tin tự cập nhật vào danh sách cán bộ). Các lần sau đăng nhập trực tiếp bằng email + mật khẩu; có thể <b>đổi mật khẩu</b> bằng biểu tượng chìa khóa trên thanh tiêu đề.</p>
              <p className="mt-2"><b>Quản trị phân quyền ngay trong trang</b>: tab <b>Đánh giá</b> → chọn cán bộ → điền <b>Email đăng nhập</b>, <b>Phòng</b> và chọn <b>Vai trò</b>. Cán bộ tự sửa được <b>Phòng/Bộ phận</b> và <b>Nhóm đối tượng</b> của chính mình.</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><b>Cán bộ:</b> xem và tự đánh giá (cột Tự ĐG) phần của chính mình.</li>
                <li><b>Trưởng phòng:</b> thêm quyền duyệt (cột Cấp duyệt) cho cán bộ cùng phòng.</li>
                <li><b>Quản trị:</b> toàn quyền — thêm/xóa cán bộ, đặt vai trò, sửa mục tiêu, đồng bộ Google Sheet, mọi kỳ.</li>
                <li><b>Khách (Dùng thử):</b> tài khoản <code className="text-[11px] font-mono bg-slate-100 px-1 py-0.5 rounded border border-slate-200">user@thanhhoa.gov.vn</code> — được nhập thử điểm để xem cách tính, nhưng <b>không lưu</b> (dữ liệu mất khi tải lại trang).</li>
              </ul>
            </GB>

            <GB icon={BarChart3} title="11. Triết lý OKR vs KPI (khuyến nghị áp dụng)">
              <ul className="list-disc pl-5 space-y-1">
                <li><b>OKR là định hướng, khát vọng</b> — nên tham vọng, không cào bằng; dùng để dẫn dắt, không phải để "đặt thấp cho dễ đạt".</li>
                <li><b>KPI là đo lường khách quan</b> — gắn minh chứng (sản phẩm) cho nhiệm vụ trọng số cao; tránh "đếm cho có" bằng việc chia nhỏ nhiệm vụ vụn vặt.</li>
                <li>Nên có <b>họp hiệu chỉnh</b> giữa các phòng trước khi chốt, tránh nơi chấm chặt nơi chấm lỏng.</li>
              </ul>
            </GB>

            <GB icon={Cpu} title="12. Kiến trúc & triển khai (cho Quản trị viên)">
              <p>SPA (React + Vite + Tailwind) chạy trên trình duyệt; dữ liệu lưu tại <b>Supabase (PostgreSQL)</b>; hosting <b>Vercel</b> tự build từ GitHub. Báo cáo Excel/Word kết xuất ngay trên máy người dùng.</p>
              <ol className="list-decimal pl-5 space-y-1 mt-2">
                <li>Tạo project Supabase, chạy <code className="text-[11px] font-mono bg-slate-100 px-1 py-0.5 rounded border border-slate-200">supabase/schema.sql</code>; bật đăng nhập <b>Email + mật khẩu</b>.</li>
                <li>Khai báo biến môi trường <code className="text-[11px] font-mono bg-slate-100 px-1 py-0.5 rounded border border-slate-200">VITE_SUPABASE_URL</code>, <code className="text-[11px] font-mono bg-slate-100 px-1 py-0.5 rounded border border-slate-200">VITE_SUPABASE_ANON_KEY</code> trên Vercel.</li>
                <li>Phân quyền ngay trong app (tab Đánh giá). Đồng bộ kiểm đếm từ Google Sheet qua hàm máy chủ <code className="text-[11px] font-mono bg-slate-100 px-1 py-0.5 rounded border border-slate-200">/api/kiemdem</code> (Google Sheet để chế độ "ai có link đều xem được").</li>
              </ol>
            </GB>

            <GB icon={Cloud} title="13. Tab Theo dõi CV: đồng bộ Google Sheet, thu thập KPI, xuất PDF">
              <ul className="list-disc pl-5 space-y-1">
                <li><b>Đồng bộ từ Google Sheet</b> (Quản trị): nạp dữ liệu kiểm đếm mới nhất từ bảng tính Google thành các dòng theo dõi <b>có thể sửa</b>; khớp cán bộ theo tên, bấm lại sẽ cập nhật (không nhân đôi). Dòng nạp có nhãn "từ Google Sheet".</li>
                <li><b>Thu thập vào đánh giá KPI</b>: ở mỗi công việc, chọn <b>Danh mục</b> + <b>OKR</b> + "Đã hoàn thành?", Lỗi chất lượng, Chậm tiến độ; bấm nút để tạo/cập nhật nhiệm vụ Nhóm II tương ứng (nhãn "từ Theo dõi CV").</li>
                <li><b>Xuất bảng (PDF)</b>: mở cửa sổ bảng theo mẫu hành chính (A4 ngang); bấm "In / Lưu thành PDF" để lưu file hoặc in giấy.</li>
              </ul>
            </GB>
          </div>
          </div>
        )}
      </main>
      <footer className="max-w-6xl mx-auto px-6 py-6 text-center text-xs text-slate-400 space-y-1">
        <p>Công cụ hỗ trợ quản trị nội bộ • OKR/KPI & Khung năng lực số</p>
        <p className="text-amber-600 font-semibold">⚠ BẢN DEMO THỬ NGHIỆM — không chịu trách nhiệm về tính pháp lý và dữ liệu.</p>
        <p className="text-amber-600 font-semibold">Phiên bản demo sử dụng nội bộ.</p>
      </footer>
      <style>{`.inp{width:100%;background:#fff;border:1px solid #e2e8f0;border-radius:.6rem;padding:.5rem .75rem;font-size:.875rem;outline:none}.inp:focus{border-color:#f87171;box-shadow:0 0 0 3px rgba(254,202,202,.5)}textarea.inp{resize:vertical}@media print{aside,header>div:last-child,button{display:none!important}}`}</style>
    </div>
  );
}

function Stat({ icon: Icon, label, value, color }) {
  const map = { slate: 'bg-slate-100 text-slate-600', red: 'bg-red-100 text-red-700', emerald: 'bg-emerald-100 text-emerald-700', amber: 'bg-amber-100 text-amber-700' };
  return (<div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex items-center gap-3"><div className={`w-11 h-11 rounded-xl flex items-center justify-center ${map[color]}`}><Icon className="w-5 h-5" /></div><div><p className="text-2xl font-extrabold text-slate-800 leading-none">{value}</p><p className="text-xs text-slate-500 mt-1">{label}</p></div></div>);
}
function Field({ label, children, className = '' }) { return (<label className={`block ${className}`}><span className="text-xs font-semibold text-slate-500 mb-1 block">{label}</span>{children}</label>); }
function SumRow({ label, value, danger }) { return (<div className="flex justify-between items-center"><span className="text-slate-500 text-xs">{label}</span><span className={`font-semibold ${danger ? 'text-rose-600' : 'text-slate-700'}`}>{value}</span></div>); }
function MiniNum({ label, value, onChange, max, min = 0, step = 1, disabled = false }) {
  return (<label className="block"><span className="text-[10px] font-semibold text-slate-400 block mb-0.5">{label}</span><input type="number" min={min} max={max} step={step} value={value} disabled={disabled} onChange={(e) => { let v = Number(e.target.value); if (max !== undefined) v = Math.min(max, v); onChange(Math.max(min, v)); }} className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-sm text-center font-semibold text-slate-700 outline-none focus:border-red-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50" /></label>);
}
function GB({ icon: Icon, title, children }) { return (<div><h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2"><Icon className="w-5 h-5 text-red-700" /> {title}</h3><div className="text-sm text-slate-600 space-y-2 leading-relaxed">{children}</div></div>); }

const CONTACT_EMAIL = 'sonthkh@gmail.com';
function ContactCard() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [msg, setMsg] = useState('');
  const send = () => {
    if (!msg.trim()) { alert('Vui lòng nhập nội dung góp ý/liên hệ.'); return; }
    const subject = 'Gop y / Lien he - He thong OKR/KPI';
    const body = `Người gửi: ${name || '(không ghi tên)'}\nĐiện thoại: ${phone || '(không ghi)'}\n\nNội dung:\n${msg}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-red-800 to-red-700 text-white px-6 py-4">
        <h2 className="text-lg font-bold flex items-center gap-2"><Phone className="w-5 h-5 text-amber-300" /> Liên hệ</h2>
        <p className="text-red-100/90 text-sm mt-0.5">Mọi góp ý, vướng mắc về hệ thống xin gửi tới đầu mối dưới đây.</p>
      </div>
      <div className="p-6 grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Đầu mối liên hệ</p>
            <p className="font-bold text-slate-800">Đồng chí Hà Ngọc Sơn</p>
            <p className="text-sm text-slate-600">Phó Chánh Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa</p>
            <div className="mt-3 space-y-1.5 text-sm">
              <a href="tel:0904818886" className="flex items-center gap-2 text-slate-700 hover:text-red-700"><Phone className="w-4 h-4 text-red-600" /> 0904 818 886</a>
              <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-2 text-slate-700 hover:text-red-700"><Mail className="w-4 h-4 text-red-600" /> {CONTACT_EMAIL}</a>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-700 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-red-700" /> Gửi ý kiến cho chúng tôi</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Họ và tên (không bắt buộc)" className="inp" />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Điện thoại (không bắt buộc)" className="inp" />
          </div>
          <textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={4} placeholder="Nhập nội dung góp ý, đề xuất, lỗi gặp phải..." className="inp" />
          <button onClick={send} className="w-full flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white font-semibold py-2.5 rounded-xl"><Send className="w-4 h-4" /> Gửi ý kiến</button>
          <p className="text-[11px] text-slate-400 leading-relaxed">Khi bấm "Gửi ý kiến", hệ thống mở ứng dụng email của bạn với nội dung đã điền sẵn, gửi tới <b>{CONTACT_EMAIL}</b>. Vui lòng bấm Gửi trong ứng dụng email để hoàn tất.</p>
        </div>
      </div>
    </div>
  );
}
function AddPerson({ onAdd }) {
  const [name, setName] = useState(''); const [type, setType] = useState('staff');
  return (<div className="flex flex-col sm:flex-row gap-2"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Họ tên cán bộ mới..." className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-400" /><select value={type} onChange={(e) => setType(e.target.value)} className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none focus:border-red-400">{Object.entries(CRITERIA).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select><button onClick={() => { onAdd(name.trim() || 'Cán bộ mới', type); setName(''); }} className="flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white font-semibold px-4 py-2 rounded-lg text-sm"><UserPlus className="w-4 h-4" /> Thêm cán bộ</button></div>);
}
function PersonChips({ people, curId, setCurId, onDelete, onAdd, hideDelete }) {
  const [adding, setAdding] = useState(false);
  return (<div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3"><div className="flex items-center gap-2 overflow-x-auto pb-1">{people.map((p) => { const on = p.id === curId; const r = classify(computePerson(p).totalMgr);
    return (<div key={p.id} className={`shrink-0 flex items-center gap-2 pl-3 pr-2 py-2 rounded-xl border-2 cursor-pointer transition-all ${on ? 'border-red-600 bg-red-50' : 'border-slate-200 hover:border-slate-300'}`} onClick={() => setCurId(p.id)}><span className={`w-6 h-6 rounded-full ${r.cls} text-white text-[10px] font-bold flex items-center justify-center`}>{r.code}</span><div className="text-left"><p className="text-sm font-semibold text-slate-700 leading-none whitespace-nowrap">{p.name || '(Chưa tên)'}</p><p className="text-[10px] text-slate-400 mt-0.5 whitespace-nowrap">{CRITERIA[p.type].mau}</p></div>{!hideDelete && people.length > 1 && <button onClick={(e) => { e.stopPropagation(); onDelete(p.id); }} className="text-slate-300 hover:text-rose-500 p-0.5"><Trash2 className="w-3.5 h-3.5" /></button>}</div>); })}
    <button onClick={() => setAdding(!adding)} className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-red-400 hover:text-red-600 text-sm font-medium"><UserPlus className="w-4 h-4" /> Thêm</button>
  </div>{adding && <div className="mt-3 pt-3 border-t border-slate-100"><AddPerson onAdd={(n, t) => { onAdd(n, t); setAdding(false); }} /></div>}</div>);
}

