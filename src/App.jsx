import { useState, useEffect, useMemo, useRef, lazy, Suspense, Fragment } from 'react';
import { Award, BarChart3, BookOpen, Plus, Trash2, Printer, RotateCcw, ShieldCheck, Cpu, ChevronDown, CheckCircle2, AlertTriangle, User, Target, ClipboardList, LayoutDashboard, UserPlus, Link2, Activity, TrendingUp, CalendarDays, Users, FileSpreadsheet, FileText, Cloud, CloudOff, Save, LogOut, LogIn, KeyRound, Phone, Mail, Send, MessageSquare, ListChecks, Eye, EyeOff, Compass, Settings, Home } from 'lucide-react';
import { supabase, loadState, saveState, listPeriods, loadAllPeriods } from './lib/supabase';
import { readVersionCfg, fetchVersionCfg, saveVersionCfg } from './lib/versionCfg';
import { countVisit } from './lib/visits';
import { onAuthChange, getSession, signOut, ADMIN } from './lib/auth';
import Login from './Login.jsx';
import SetPassword from './SetPassword.jsx';
import { deptSummary } from './lib/dash';
const DashboardCharts = lazy(() => import('./lib/DashboardCharts.jsx'));
import { ND335_CATALOG } from './lib/nd335';
import { computeSG, sgGradeInfo, defaultSG, SingaporeAppraisal, SingaporeDashboard, SingaporeInstitution, SG_INST_KPI_DEFAULT } from './SingaporeAppraisal.jsx';
import { computeKD, kdGradeInfo, defaultKD, KiemDiemAppraisal, KiemDiemDashboard, KD_TRUC, trucTasks, mucOf, kdNhomABreakdown, KD_TAM, tamOf } from './KiemDiemAppraisal.jsx';
const CanBoManager = lazy(() => import('./CanBoManager.jsx'));
import { fetchHR, saveHR, readHR, EMPTY_HR } from './lib/hrStore';
import { syncStaffFromPeople } from './lib/hr';

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
  { dept: 'Phòng Hành chính - Tổ chức - Quản trị', positions: ['Trưởng phòng', 'Phó Trưởng phòng', 'Chuyên viên', 'Lái xe', 'Bảo vệ', 'Nhân viên phục vụ'] },
];
const posOptions = (dept) => (ORG_UNITS.find((u) => u.dept === dept)?.positions) || [];
// Bản Sơn Hà chỉ đánh giá CBCCVC Văn phòng → bỏ HĐND tỉnh, Đoàn ĐBQH tỉnh và các Ban.
const SONHA_ORG_UNITS = ORG_UNITS.filter((u) => /^(Văn phòng|Phòng )/.test(u.dept));
// Email được cấp quyền Quản trị ngay khi chưa dựng bảng phân quyền (bootstrap).
// Có thể thêm email, hoặc chuyển hẳn sang bảng "profiles" để phân quyền chi tiết.
const BOOTSTRAP_ADMIN_EMAILS = ['sonthkh@gmail.com', ADMIN.email];
// Hai phiên làm việc KHÔNG có tài khoản Supabase: 'guest' (khách, chỉ xem) và
// 'localadmin' (quản trị cục bộ qua admin/Admin123). Cả hai đều dùng dữ liệu mẫu
// và KHÔNG ghi lên máy chủ (RLS chỉ chấp nhận phiên đăng nhập thật).
const isLocalSession = (s) => s === 'guest' || s === 'localadmin';

// ===== BỘ TIÊU CHÍ "CỔ ĐIỂN" (theo QĐ 1053-QĐ/TU) — giữ nguyên câu chữ pháp lý =====
const CRITERIA_CLASSIC = {
  leader: { label: 'Cán bộ lãnh đạo, quản lý', mau: 'Mẫu số 03', formula: '(a+b+c+d+đ+e)/6', groups: [
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
    { id: 'L3', title: '3. Năng lực lãnh đạo, quản lý và chuyên môn, nghiệp vụ; khả năng thực thi; tác phong; đổi mới sáng tạo; cải cách hành chính, chuyển đổi số', max: 16, items: [
      { id: '3.1', max: 3, text: 'Năng lực lãnh đạo, quản lý: tư duy, khả năng hoạch định đường lối, chính sách; tầm nhìn, phương pháp làm việc khoa học; tổng hợp, phân tích, dự báo; chỉ đạo, điều hành, phân công khoa học, giám sát chặt chẽ, giữ kỷ cương, kỷ luật.' },
      { id: '3.2', max: 3, text: 'Năng lực chuyên môn, nghiệp vụ theo vị trí việc làm: kiến thức chuyên sâu, am hiểu pháp luật, quy trình; phát hiện vấn đề mới, khó, đề xuất giải pháp khả thi; xử lý công việc độc lập, làm việc nhóm hiệu quả.' },
      { id: '3.3', max: 2, text: 'Khả năng đáp ứng yêu cầu thực thi nhiệm vụ được giao (thường xuyên và đột xuất).' },
      { id: '3.4', max: 2, text: 'Tác phong, lề lối làm việc: trách nhiệm cao, cần cù; đúng mực, chuẩn mực; phối hợp hiệu quả; phương pháp làm việc khoa học, dân chủ, đúng nguyên tắc.' },
      { id: '3.5', max: 3, text: 'Tinh thần đổi mới sáng tạo, dám nghĩ, dám làm, dám chịu trách nhiệm vì lợi ích chung; có sáng kiến, giải pháp đột phá; quyết đoán, tiên phong trong nhiệm vụ mới.' },
      { id: '3.6', max: 3, text: 'Cải cách hành chính, chuyển đổi số và ứng dụng công nghệ thông tin của cơ quan, đơn vị; lập và giao nộp hồ sơ điện tử, hoàn thành đúng quy định.' } ] },
    { id: 'L4', title: '4. Về mức độ tín nhiệm, uy tín và khả năng quy tụ đoàn kết', max: 2, items: [
      { id: '4.1', max: 1, text: 'Có uy tín trong nội bộ, gương mẫu, gắn bó mật thiết với Nhân dân; được tín nhiệm cao.' },
      { id: '4.2', max: 1, text: 'Có khả năng quy tụ, đoàn kết nội bộ; xây dựng tập thể vững mạnh.' } ] },
    { id: 'L5', title: '5. Về tự phê bình và phê bình, tự soi, tự sửa', max: 2, items: [
      { id: '5.1', max: 1, text: 'Tinh thần tự phê bình, tự soi, tự sửa; chủ động nhận diện thiếu sót trong lãnh đạo, chỉ đạo.' },
      { id: '5.2', max: 1, text: 'Kết quả khắc phục hạn chế, khuyết điểm đã được chỉ ra của bản thân và trong phạm vi lãnh đạo.' } ] },
  ] },
  staff: { label: 'Công chức, viên chức không giữ chức vụ lãnh đạo, quản lý', mau: 'Mẫu số 04', formula: '(a+b+c)/3', groups: [
    { id: 'S1', title: '1. Về chính trị, tư tưởng', max: 5, items: [
      { id: '1.1', max: 2.5, text: 'Có quan điểm, bản lĩnh chính trị vững vàng; kiên định lập trường; không dao động trước mọi khó khăn, thách thức; có ý thức nghiên cứu, học tập, vận dụng chủ nghĩa Mác - Lênin, tư tưởng Hồ Chí Minh, nghị quyết, chỉ thị, quyết định và các văn bản của Đảng, Nhà nước.' },
      { id: '1.2', max: 2.5, text: 'Thực hiện nghiêm các nguyên tắc tổ chức và hoạt động của Đảng, nhất là nguyên tắc tập trung dân chủ, tự phê bình và phê bình; chấp hành đường lối, chủ trương của Đảng, chính sách, pháp luật của Nhà nước; thực hiện nghiêm về kỷ luật phát ngôn, bảo vệ bí mật nhà nước.' } ] },
    { id: 'S2', title: '2. Về phẩm chất đạo đức và ý thức tổ chức kỷ luật', max: 5, items: [
      { id: '2.1', max: 1, text: 'Giữ gìn phẩm chất đạo đức, lối sống trong sáng, trung thực, khiêm tốn, chân thành, giản dị; tham gia phòng, chống tham nhũng, lãng phí, tiêu cực; không suy thoái về tư tưởng chính trị, đạo đức, lối sống, "tự diễn biến", "tự chuyển hoá"; không tham ô, vụ lợi.' },
      { id: '2.2', max: 1, text: 'Có ý thức tổ chức kỷ luật, tinh thần trách nhiệm trong công tác; chấp hành sự phân công của tổ chức; thực hiện các quy định, quy chế, nội quy của tổ chức, cơ quan, đơn vị nơi công tác.' },
      { id: '2.3', max: 0.5, text: 'Thực hiện việc kê khai và công khai tài sản, thu nhập theo quy định (đối với trường hợp thuộc diện phải kê khai).' },
      { id: '2.4', max: 0.5, text: 'Báo cáo đầy đủ, trung thực, cung cấp thông tin chính xác, khách quan về việc thực hiện chức trách, nhiệm vụ được giao với cấp trên khi được yêu cầu.' },
      { id: '2.5', max: 1, text: 'Giữ gìn đoàn kết nội bộ; có quan hệ tốt với đồng chí, đồng nghiệp; tích cực tham gia xây dựng tổ chức đảng, đoàn thể và các phong trào tập thể.' },
      { id: '2.6', max: 1, text: 'Gần gũi, sâu sát với cơ sở; thực hiện tốt việc giữ mối liên hệ với cấp ủy và Nhân dân nơi cư trú.' } ] },
    { id: 'S3', title: '3. Năng lực chuyên môn, nghiệp vụ; khả năng thực thi; tác phong; đổi mới sáng tạo; cải cách hành chính, chuyển đổi số', max: 16, items: [
      { id: '3.1', max: 3, text: 'Năng lực chuyên môn, nghiệp vụ theo yêu cầu của vị trí việc làm: hiểu biết đầy đủ lĩnh vực công tác, nắm vững pháp luật, quy trình nghiệp vụ; thường xuyên cập nhật kiến thức mới, nghiên cứu, phân tích, tổng hợp; xử lý công việc độc lập, làm việc nhóm hiệu quả.' },
      { id: '3.2', max: 3, text: 'Khả năng đáp ứng yêu cầu thực thi nhiệm vụ được giao (nhiệm vụ thường xuyên và nhiệm vụ đột xuất).' },
      { id: '3.3', max: 3, text: 'Tác phong, lề lối làm việc: tinh thần trách nhiệm cao, tích cực; thái độ đúng mực, chuẩn mực; phối hợp hiệu quả; phương pháp làm việc khoa học, dân chủ, đúng nguyên tắc.' },
      { id: '3.4', max: 3, text: 'Tinh thần đổi mới sáng tạo, dám nghĩ, dám làm, dám chịu trách nhiệm vì lợi ích chung; có sản phẩm, giải pháp đột phá, tác động tích cực đến kết quả thực hiện nhiệm vụ của cơ quan, đơn vị.' },
      { id: '3.5', max: 4, text: 'Cải cách hành chính, chuyển đổi số và ứng dụng công nghệ thông tin: sử dụng thành thạo công nghệ thông tin vào công việc chuyên môn; lập và giao nộp hồ sơ điện tử, hoàn thành đúng quy định.' } ] },
    { id: 'S4', title: '4. Về tự phê bình và phê bình, khắc phục hạn chế, khuyết điểm', max: 4, items: [
      { id: '4.1', max: 2, text: 'Tinh thần tự phê bình, tự soi, tự sửa của cá nhân; mức độ tự giác nhận diện hạn chế, khuyết điểm của bản thân.' },
      { id: '4.2', max: 2, text: 'Kết quả khắc phục những hạn chế, khuyết điểm đã được chỉ ra.' } ] },
  ] },
  contract: { label: 'Lao động hợp đồng hỗ trợ, phục vụ', mau: 'Mẫu số 05', formula: '(a+b+c)/3', groups: [
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

// Nhóm Đại biểu HĐND chuyên trách (Mẫu 01) và Đại biểu Quốc hội chuyên trách (Mẫu 02)
// — dùng chung bộ Tiêu chí chung của nhóm lãnh đạo. Công thức Nhóm II tính theo CHỨC VỤ.
CRITERIA_CLASSIC.hdnd = {
  label: 'Đại biểu HĐND tỉnh hoạt động chuyên trách',
  mau: 'Mẫu số 01',
  formula: '(a+b+c)/3',
  groups: CRITERIA_CLASSIC.leader.groups,
};
CRITERIA_CLASSIC.dbqh = {
  label: 'Đại biểu Quốc hội hoạt động chuyên trách',
  mau: 'Mẫu số 02',
  formula: '(a+b+c)/3',
  groups: CRITERIA_CLASSIC.leader.groups,
};

// ===== BỘ TIÊU CHÍ "CẢI TIẾN" (giữ Nhóm I kiểu AIM/ISE cho dễ hiểu) =====
// Lai ghép: GIỮ NGUYÊN id, điểm tối đa (max), thang 30đ và công thức của bản Cổ điển
// (nên mọi tính toán/clamp/xuất phiếu/Điều 8 dùng chung, đổi phiên bản không mất điểm),
// chỉ VIẾT LẠI câu hỏi theo phong cách dễ hiểu của khu vực công Singapore:
//  • AIM  = Analytical (Phân tích) · Influence/Collaboration (Ảnh hưởng, hợp tác) · Motivation for Excellence (Động lực hướng tới xuất sắc)
//  • ISE  = Integrity (Liêm chính) · Service (Phục vụ) · Excellence (Xuất sắc)
//  • WoG  = Whole-of-Government (tư duy "một cơ quan thống nhất", lấy người dân/đại biểu làm trung tâm)
// Mỗi câu hỏi nêu rõ "Anh/chị có…?" kèm ví dụ, bám đúng nội hàm của tiêu chí gốc.
const CRITERIA_IMPROVED = {
  leader: { label: 'Cán bộ lãnh đạo, quản lý', mau: 'Mẫu số 03', formula: '(a+b+c+d+đ+e)/6', groups: [
    { id: 'L1', title: '1. Chính trị, tư tưởng & Liêm chính (Integrity)', max: 5, items: [
      { id: '1.1', max: 1, text: 'Trung thành & nêu gương: Anh/chị có tuyệt đối trung thành với Đảng, Tổ quốc, Nhân dân và là tấm gương cho cấp dưới noi theo? (VD: gương mẫu chấp hành, không phát ngôn trái chủ trương).' },
      { id: '1.2', max: 1, text: 'Bản lĩnh chính trị: Anh/chị có giữ vững lập trường, bảo vệ đường lối của Đảng và giữ kỷ luật phát ngôn ngay cả khi gặp việc khó, nhạy cảm?' },
      { id: '1.3', max: 1, text: 'Đặt lợi ích chung lên trên (tinh thần phục vụ): Anh/chị có ưu tiên lợi ích của tập thể, quốc gia và Nhân dân trước lợi ích cá nhân?' },
      { id: '1.4', max: 1, text: 'Sẵn sàng nhận việc: Anh/chị có chấp hành phân công và hoàn thành tốt mọi nhiệm vụ được giao, kể cả việc khó, việc mới?' },
      { id: '1.5', max: 0.5, text: 'Chủ động học tập: Anh/chị có thường xuyên cập nhật nghị quyết của Đảng, chính sách pháp luật và kiến thức mới của lĩnh vực mình phụ trách?' },
      { id: '1.6', max: 0.5, text: 'Tư duy đổi mới & tầm nhìn: Anh/chị có tầm nhìn xa và sẵn sàng thay đổi cách làm để thích ứng với yêu cầu mới?' } ] },
    { id: 'L2', title: '2. Đạo đức, kỷ luật & nêu gương (Integrity)', max: 5, items: [
      { id: '2.1', max: 1, text: 'Lối sống trong sạch: Anh/chị có sống trung thực, cần – kiệm – liêm – chính, chí công vô tư và nêu gương?' },
      { id: '2.2', max: 1, text: 'Phòng chống tiêu cực: Anh/chị có kiên quyết tránh và đấu tranh với tham ô, tham nhũng, lợi ích nhóm, "tự diễn biến", "tự chuyển hóa"?' },
      { id: '2.3', max: 1, text: 'Dám làm, dám chịu trách nhiệm: Anh/chị có tự giác tu dưỡng, dám nghĩ – dám làm – dám chịu trách nhiệm vì việc chung?' },
      { id: '2.4', max: 1, text: 'Tôn trọng nguyên tắc: Anh/chị có thực hiện nghiêm tập trung dân chủ, tự phê bình và phê bình?' },
      { id: '2.5', max: 0.5, text: 'Minh bạch: Anh/chị có kê khai và công khai tài sản, thu nhập đúng quy định?' },
      { id: '2.6', max: 0.5, text: 'Trung thực báo cáo: Anh/chị có cung cấp thông tin chính xác, kịp thời cho cấp trên?' } ] },
    { id: 'L3', title: '3. Năng lực lãnh đạo & chuyên môn · Thực thi · Tác phong · Đổi mới · Chuyển đổi số (AIM)', max: 16, items: [
      { id: '3.1', max: 3, text: 'Năng lực lãnh đạo & tư duy phân tích (Analytical): Anh/chị có nhìn được tổng thể, biết phân tích – dự báo, hoạch định và điều hành khoa học, phân công – giám sát rõ ràng? (VD: lập kế hoạch, giao việc đúng người, theo dõi tiến độ chặt chẽ).' },
      { id: '3.2', max: 3, text: 'Chuyên môn sâu: Anh/chị có am hiểu pháp luật, quy trình; phát hiện được vấn đề mới, khó và đề xuất giải pháp khả thi?' },
      { id: '3.3', max: 2, text: 'Khả năng thực thi (Delivery): Anh/chị có hoàn thành tốt cả nhiệm vụ thường xuyên lẫn đột xuất, bảo đảm tiến độ và chất lượng?' },
      { id: '3.4', max: 2, text: 'Tác phong & hợp tác (Influence/Collaboration): Anh/chị có trách nhiệm cao, phối hợp hiệu quả với phòng/đơn vị khác theo tinh thần "một cơ quan thống nhất" (Whole-of-Government)?' },
      { id: '3.5', max: 3, text: 'Đổi mới, sáng tạo (Motivation for Excellence): Anh/chị có dám nghĩ – dám làm, có sáng kiến/giải pháp đột phá và tiên phong trong nhiệm vụ mới?' },
      { id: '3.6', max: 3, text: 'Cải cách hành chính & chuyển đổi số: Anh/chị có thúc đẩy ứng dụng CNTT, lập – nộp hồ sơ điện tử đúng quy định và lấy sự hài lòng của người dân/đại biểu làm thước đo?' } ] },
    { id: 'L4', title: '4. Uy tín & quy tụ đoàn kết (Service)', max: 2, items: [
      { id: '4.1', max: 1, text: 'Uy tín: Anh/chị có được tín nhiệm trong nội bộ và gắn bó mật thiết với Nhân dân?' },
      { id: '4.2', max: 1, text: 'Quy tụ, đoàn kết: Anh/chị có xây dựng được tập thể đoàn kết, vững mạnh?' } ] },
    { id: 'L5', title: '5. Tự soi, tự sửa (Excellence – cầu thị)', max: 2, items: [
      { id: '5.1', max: 1, text: 'Cầu thị: Anh/chị có chủ động tự phê bình, tự nhận diện thiếu sót trong lãnh đạo, chỉ đạo?' },
      { id: '5.2', max: 1, text: 'Khắc phục: Kết quả sửa chữa hạn chế, khuyết điểm đã được chỉ ra (của bản thân và trong phạm vi phụ trách) ra sao?' } ] },
  ] },
  staff: { label: 'Công chức, viên chức không giữ chức vụ lãnh đạo, quản lý', mau: 'Mẫu số 04', formula: '(a+b+c)/3', groups: [
    { id: 'S1', title: '1. Chính trị, tư tưởng & Liêm chính (Integrity)', max: 5, items: [
      { id: '1.1', max: 2.5, text: 'Bản lĩnh & học tập: Anh/chị có lập trường chính trị vững vàng, chủ động học tập nghị quyết của Đảng, chính sách pháp luật và vận dụng vào công việc?' },
      { id: '1.2', max: 2.5, text: 'Kỷ luật & chấp hành: Anh/chị có thực hiện nghiêm nguyên tắc tổ chức (tập trung dân chủ, tự phê bình và phê bình), kỷ luật phát ngôn và bảo vệ bí mật nhà nước?' } ] },
    { id: 'S2', title: '2. Đạo đức & ý thức tổ chức kỷ luật (Integrity)', max: 5, items: [
      { id: '2.1', max: 1, text: 'Lối sống trong sạch: Anh/chị có trung thực, khiêm tốn, giản dị; tham gia phòng chống tham nhũng, tiêu cực và không vụ lợi?' },
      { id: '2.2', max: 1, text: 'Trách nhiệm & kỷ luật: Anh/chị có tinh thần trách nhiệm cao, chấp hành phân công và thực hiện đúng quy chế, nội quy cơ quan?' },
      { id: '2.3', max: 0.5, text: 'Minh bạch: Anh/chị có kê khai, công khai tài sản, thu nhập đúng quy định (nếu thuộc diện phải kê khai)?' },
      { id: '2.4', max: 0.5, text: 'Trung thực báo cáo: Anh/chị có cung cấp thông tin chính xác, khách quan khi được yêu cầu?' },
      { id: '2.5', max: 1, text: 'Đoàn kết & hợp tác (Collaboration): Anh/chị có quan hệ tốt với đồng nghiệp và tích cực tham gia xây dựng tổ chức, phong trào tập thể?' },
      { id: '2.6', max: 1, text: 'Gắn bó cơ sở: Anh/chị có giữ mối liên hệ tốt với cấp ủy và Nhân dân nơi cư trú?' } ] },
    { id: 'S3', title: '3. Chuyên môn · Thực thi · Tác phong · Đổi mới · Chuyển đổi số (AIM)', max: 16, items: [
      { id: '3.1', max: 3, text: 'Chuyên môn & tư duy phân tích (Analytical): Anh/chị có nắm vững lĩnh vực, pháp luật, quy trình; biết nghiên cứu – phân tích – tổng hợp; xử lý việc độc lập và làm việc nhóm hiệu quả?' },
      { id: '3.2', max: 3, text: 'Khả năng thực thi (Delivery): Anh/chị có hoàn thành tốt cả nhiệm vụ thường xuyên lẫn đột xuất, đúng tiến độ?' },
      { id: '3.3', max: 3, text: 'Tác phong & hợp tác (Influence): Anh/chị có trách nhiệm cao, thái độ chuẩn mực, phối hợp hiệu quả và làm việc khoa học?' },
      { id: '3.4', max: 3, text: 'Đổi mới, sáng tạo (Motivation for Excellence): Anh/chị có dám nghĩ – dám làm, có sáng kiến/giải pháp tạo tác động tích cực đến kết quả của cơ quan?' },
      { id: '3.5', max: 4, text: 'Chuyển đổi số: Anh/chị có sử dụng thành thạo CNTT trong công việc; lập và nộp hồ sơ điện tử đúng quy định?' } ] },
    { id: 'S4', title: '4. Tự soi, tự sửa (Excellence – cầu thị)', max: 4, items: [
      { id: '4.1', max: 2, text: 'Cầu thị: Anh/chị có tinh thần tự phê bình, tự nhận diện hạn chế, khuyết điểm của bản thân?' },
      { id: '4.2', max: 2, text: 'Khắc phục: Kết quả sửa chữa hạn chế, khuyết điểm đã được chỉ ra ra sao?' } ] },
  ] },
  contract: { label: 'Lao động hợp đồng hỗ trợ, phục vụ', mau: 'Mẫu số 05', formula: '(a+b+c)/3', groups: [
    { id: 'C1', title: '1. Chính trị, đạo đức & ý thức kỷ luật (Integrity – Phục vụ)', max: 15, items: [
      { id: '1.1', max: 3, text: 'Chấp hành: Anh/chị có thực hiện đúng chủ trương của Đảng, chính sách pháp luật và kỷ luật của cơ quan?' },
      { id: '1.2', max: 3, text: 'Đạo đức: Anh/chị có gương mẫu về lối sống, không tham ô, lãng phí?' },
      { id: '1.3', max: 3, text: 'Tác phong phục vụ (Service): Anh/chị có tận tụy, trung thực, năng động, thái độ đúng mực với mọi người?' },
      { id: '1.4', max: 3, text: 'Sẵn sàng nhận việc: Anh/chị có chấp hành phân công và thực hiện tốt quy chế, nội quy cơ quan?' },
      { id: '1.5', max: 3, text: 'Ứng xử: Anh/chị có thực hiện đúng quy tắc ứng xử trong cơ quan?' } ] },
    { id: 'C2', title: '2. Năng lực & khả năng thực thi (Delivery)', max: 10, items: [
      { id: '2.1', max: 3, text: 'Cập nhật kiến thức: Anh/chị có chủ động cập nhật kiến thức để phục vụ tốt nhiệm vụ được giao?' },
      { id: '2.2', max: 3, text: 'Lập kế hoạch: Anh/chị có xây dựng kế hoạch công tác cá nhân theo quy định?' },
      { id: '2.3', max: 2, text: 'Thành thạo quy trình: Anh/chị có nắm vững quy chế, quy trình tác nghiệp theo yêu cầu?' },
      { id: '2.4', max: 2, text: 'An toàn, hiệu quả: Anh/chị có sử dụng thành thạo phương tiện, thiết bị, bảo đảm an toàn và hiệu quả?' } ] },
    { id: 'C3', title: '3. Tự soi, tự sửa (Excellence – cầu thị)', max: 5, items: [
      { id: '3.1', max: 5, text: 'Cầu thị: Anh/chị có tự nhận diện hạn chế và chủ động khắc phục những điều đã được chỉ ra?' } ] },
  ] },
};
CRITERIA_IMPROVED.hdnd = { label: CRITERIA_CLASSIC.hdnd.label, mau: 'Mẫu số 01', formula: '(a+b+c)/3', groups: CRITERIA_IMPROVED.leader.groups };
CRITERIA_IMPROVED.dbqh = { label: CRITERIA_CLASSIC.dbqh.label, mau: 'Mẫu số 02', formula: '(a+b+c)/3', groups: CRITERIA_IMPROVED.leader.groups };

// ===== BỘ TIÊU CHÍ "SINGAPORE (CƠ QUAN DÂN CỬ)" =====
// Cùng id/max/thang điểm/công thức như bản Cổ điển (đổi phiên bản KHÔNG mất điểm), nhưng câu hỏi
// được thiết kế RIÊNG cho cơ quan dân cử (HĐND/Đoàn ĐBQH): nhấn chức năng ĐẠI DIỆN cử tri, GIÁM SÁT,
// quyết định/nghị quyết các vấn đề quan trọng, TIẾP XÚC CỬ TRI — theo phong cách AIM/ISE/WoG.
// Đại biểu (Mẫu 01/02) dùng bộ "dancuGroups" riêng; lãnh đạo/công chức/HĐ phục vụ cơ quan dân cử.
const dancuGroups = [
  { id: 'L1', title: '1. Bản lĩnh chính trị & Liêm chính của người đại biểu (Integrity)', max: 5, items: [
    { id: '1.1', max: 1, text: 'Trung thành & gương mẫu: Đại biểu có tuyệt đối trung thành với Tổ quốc, Nhân dân và gương mẫu chấp hành Hiến pháp, pháp luật?' },
    { id: '1.2', max: 1, text: 'Bản lĩnh đại diện: Đại biểu có dám nói lên ý chí, nguyện vọng chính đáng của cử tri, kể cả vấn đề khó, nhạy cảm?' },
    { id: '1.3', max: 1, text: 'Đặt lợi ích Nhân dân lên trên (tinh thần phục vụ): Đại biểu có hành động vì lợi ích chung của cử tri và địa phương trước lợi ích cá nhân?' },
    { id: '1.4', max: 1, text: 'Trách nhiệm với nhiệm vụ dân cử: Đại biểu có thực hiện đầy đủ nhiệm vụ, quyền hạn theo luật và chương trình hoạt động?' },
    { id: '1.5', max: 0.5, text: 'Cập nhật chính sách: Đại biểu có nghiên cứu chủ trương của Đảng, pháp luật và tình hình kinh tế - xã hội để quyết định đúng?' },
    { id: '1.6', max: 0.5, text: 'Tầm nhìn & đổi mới: Đại biểu có tư duy đổi mới, đề xuất cách làm mới nâng cao hiệu quả hoạt động dân cử?' } ] },
  { id: 'L2', title: '2. Đạo đức, gắn bó với cử tri & kỷ luật (Integrity – Service)', max: 5, items: [
    { id: '2.1', max: 1, text: 'Lối sống trong sạch: Đại biểu có cần – kiệm – liêm – chính, gương mẫu trước cử tri?' },
    { id: '2.2', max: 1, text: 'Liêm chính, không vụ lợi: Đại biểu có tránh xung đột lợi ích, không lợi dụng vị trí đại biểu để trục lợi?' },
    { id: '2.3', max: 1, text: 'Gắn bó cử tri: Đại biểu có giữ liên hệ chặt chẽ, lắng nghe và phản ánh trung thực ý kiến, kiến nghị của cử tri?' },
    { id: '2.4', max: 1, text: 'Kỷ luật & nguyên tắc: Đại biểu có tuân thủ nội quy kỳ họp, phát ngôn có trách nhiệm, theo nguyên tắc tập trung dân chủ?' },
    { id: '2.5', max: 0.5, text: 'Minh bạch: Đại biểu có kê khai, công khai tài sản, thu nhập đúng quy định?' },
    { id: '2.6', max: 0.5, text: 'Trung thực thông tin: Đại biểu có báo cáo, cung cấp thông tin chính xác về hoạt động của mình?' } ] },
  { id: 'L3', title: '3. Năng lực hoạt động dân cử · Lập pháp/Nghị quyết · Giám sát · Tiếp xúc cử tri · Đổi mới · Chuyển đổi số (AIM)', max: 16, items: [
    { id: '3.1', max: 3, text: 'Phân tích chính sách (Analytical): Đại biểu có nghiên cứu sâu tài liệu, phân tích – phản biện chính sách và dự báo tác động để quyết định đúng các vấn đề quan trọng của địa phương?' },
    { id: '3.2', max: 3, text: 'Chất lượng góp ý lập pháp/nghị quyết: Đại biểu có đóng góp ý kiến chất lượng vào dự thảo nghị quyết, văn bản; am hiểu pháp luật và thực tiễn?' },
    { id: '3.3', max: 2, text: 'Hiệu quả giám sát (Delivery): Đại biểu có thực hiện tốt hoạt động giám sát, chất vấn và theo đến cùng kết quả giải quyết kiến nghị của cử tri?' },
    { id: '3.4', max: 2, text: 'Ảnh hưởng & phối hợp (Influence/Collaboration): Đại biểu có phối hợp hiệu quả với các cơ quan và đại biểu khác theo tinh thần "một cơ quan thống nhất" (Whole-of-Government) vì kết quả chung?' },
    { id: '3.5', max: 3, text: 'Đổi mới vì cử tri (Motivation for Excellence): Đại biểu có sáng kiến nâng cao chất lượng đại diện, giải quyết hiệu quả vấn đề bức xúc của cử tri?' },
    { id: '3.6', max: 3, text: 'Chuyển đổi số & lấy người dân làm trung tâm: Đại biểu có ứng dụng CNTT trong hoạt động và lấy sự hài lòng của cử tri làm thước đo?' } ] },
  { id: 'L4', title: '4. Uy tín với cử tri & quy tụ đoàn kết (Service)', max: 2, items: [
    { id: '4.1', max: 1, text: 'Uy tín: Đại biểu có được cử tri và đồng nghiệp tín nhiệm, gắn bó mật thiết với Nhân dân?' },
    { id: '4.2', max: 1, text: 'Quy tụ, đoàn kết: Đại biểu có góp phần xây dựng tập thể đoàn kết, đồng thuận?' } ] },
  { id: 'L5', title: '5. Tự soi, tự sửa & trách nhiệm giải trình (Excellence)', max: 2, items: [
    { id: '5.1', max: 1, text: 'Cầu thị: Đại biểu có chủ động tự đánh giá, tiếp thu góp ý của cử tri và đồng nghiệp?' },
    { id: '5.2', max: 1, text: 'Giải trình & khắc phục: Đại biểu có giải trình rõ ràng và khắc phục hạn chế đã được chỉ ra?' } ] },
];
const CRITERIA_SG = {
  leader: { label: 'Cán bộ lãnh đạo, quản lý', mau: 'Mẫu số 03', formula: '(a+b+c+d+đ+e)/6', groups: [
    { id: 'L1', title: '1. Chính trị, tư tưởng & Liêm chính (Integrity)', max: 5, items: [
      { id: '1.1', max: 1, text: 'Trung thành & nêu gương: Anh/chị có trung thành với Đảng, Tổ quốc, Nhân dân và nêu gương trong phục vụ cơ quan dân cử?' },
      { id: '1.2', max: 1, text: 'Bản lĩnh chính trị: Anh/chị có giữ vững lập trường, bảo vệ đường lối của Đảng và giữ kỷ luật phát ngôn?' },
      { id: '1.3', max: 1, text: 'Tinh thần phục vụ: Anh/chị có đặt lợi ích chung và yêu cầu phục vụ đại biểu, cử tri lên trên lợi ích cá nhân?' },
      { id: '1.4', max: 1, text: 'Trách nhiệm: Anh/chị có hoàn thành tốt mọi nhiệm vụ phục vụ hoạt động của HĐND/Đoàn ĐBQH?' },
      { id: '1.5', max: 0.5, text: 'Học tập: Anh/chị có cập nhật nghị quyết, pháp luật và kiến thức phục vụ công tác dân cử?' },
      { id: '1.6', max: 0.5, text: 'Tầm nhìn & đổi mới: Anh/chị có tư duy đổi mới nâng cao chất lượng tham mưu, phục vụ?' } ] },
    { id: 'L2', title: '2. Đạo đức, kỷ luật & nêu gương (Integrity)', max: 5, items: [
      { id: '2.1', max: 1, text: 'Lối sống trong sạch: Anh/chị có sống cần – kiệm – liêm – chính và nêu gương?' },
      { id: '2.2', max: 1, text: 'Phòng chống tiêu cực: Anh/chị có kiên quyết tránh tham ô, tham nhũng, lợi ích nhóm?' },
      { id: '2.3', max: 1, text: 'Dám chịu trách nhiệm: Anh/chị có dám nghĩ – dám làm – dám chịu trách nhiệm vì việc chung?' },
      { id: '2.4', max: 1, text: 'Tôn trọng nguyên tắc: Anh/chị có thực hiện nghiêm tập trung dân chủ, tự phê bình và phê bình?' },
      { id: '2.5', max: 0.5, text: 'Minh bạch: Anh/chị có kê khai, công khai tài sản, thu nhập đúng quy định?' },
      { id: '2.6', max: 0.5, text: 'Trung thực báo cáo: Anh/chị có cung cấp thông tin chính xác, kịp thời cho cấp trên?' } ] },
    { id: 'L3', title: '3. Năng lực lãnh đạo & tham mưu phục vụ dân cử · Thực thi · Tác phong · Đổi mới · Chuyển đổi số (AIM)', max: 16, items: [
      { id: '3.1', max: 3, text: 'Lãnh đạo & phân tích (Analytical): Anh/chị có hoạch định, điều hành khoa học và phân tích – tham mưu đúng để phục vụ kỳ họp, hoạt động giám sát của cơ quan dân cử?' },
      { id: '3.2', max: 3, text: 'Chuyên môn sâu: Anh/chị có am hiểu pháp luật, quy trình hoạt động của HĐND/Quốc hội và đề xuất giải pháp khả thi?' },
      { id: '3.3', max: 2, text: 'Thực thi (Delivery): Anh/chị có bảo đảm tiến độ – chất lượng các nhiệm vụ phục vụ kỳ họp, giám sát, tiếp xúc cử tri?' },
      { id: '3.4', max: 2, text: 'Tác phong & phối hợp (Influence): Anh/chị có phối hợp hiệu quả giữa các phòng/cơ quan theo tinh thần "một cơ quan thống nhất" (WoG)?' },
      { id: '3.5', max: 3, text: 'Đổi mới (Motivation for Excellence): Anh/chị có sáng kiến nâng cao chất lượng tham mưu, phục vụ đại biểu và cử tri?' },
      { id: '3.6', max: 3, text: 'Cải cách hành chính & chuyển đổi số: Anh/chị có thúc đẩy CNTT, hồ sơ điện tử và lấy sự hài lòng của đại biểu, cử tri làm thước đo?' } ] },
    { id: 'L4', title: '4. Uy tín & quy tụ đoàn kết (Service)', max: 2, items: [
      { id: '4.1', max: 1, text: 'Uy tín: Anh/chị có uy tín trong nội bộ và với đại biểu, cử tri?' },
      { id: '4.2', max: 1, text: 'Quy tụ, đoàn kết: Anh/chị có xây dựng được tập thể đoàn kết, vững mạnh?' } ] },
    { id: 'L5', title: '5. Tự soi, tự sửa (Excellence – cầu thị)', max: 2, items: [
      { id: '5.1', max: 1, text: 'Cầu thị: Anh/chị có chủ động tự soi, tự sửa trong lãnh đạo, chỉ đạo?' },
      { id: '5.2', max: 1, text: 'Khắc phục: Kết quả khắc phục hạn chế, khuyết điểm đã được chỉ ra ra sao?' } ] },
  ] },
  staff: { label: 'Công chức, viên chức không giữ chức vụ lãnh đạo, quản lý', mau: 'Mẫu số 04', formula: '(a+b+c)/3', groups: [
    { id: 'S1', title: '1. Chính trị, tư tưởng & Liêm chính (Integrity)', max: 5, items: [
      { id: '1.1', max: 2.5, text: 'Bản lĩnh & học tập: Anh/chị có lập trường vững vàng, chủ động học nghị quyết, pháp luật và vận dụng vào công tác phục vụ cơ quan dân cử?' },
      { id: '1.2', max: 2.5, text: 'Kỷ luật & chấp hành: Anh/chị có thực hiện nghiêm nguyên tắc tổ chức, kỷ luật phát ngôn và bảo vệ bí mật nhà nước?' } ] },
    { id: 'S2', title: '2. Đạo đức & ý thức tổ chức kỷ luật (Integrity)', max: 5, items: [
      { id: '2.1', max: 1, text: 'Lối sống trong sạch: Anh/chị có trung thực, giản dị, không vụ lợi và tham gia phòng chống tiêu cực?' },
      { id: '2.2', max: 1, text: 'Trách nhiệm & kỷ luật: Anh/chị có chấp hành phân công và thực hiện đúng quy chế, nội quy cơ quan?' },
      { id: '2.3', max: 0.5, text: 'Minh bạch: Anh/chị có kê khai, công khai tài sản, thu nhập đúng quy định (nếu thuộc diện)?' },
      { id: '2.4', max: 0.5, text: 'Trung thực báo cáo: Anh/chị có cung cấp thông tin chính xác, khách quan khi được yêu cầu?' },
      { id: '2.5', max: 1, text: 'Đoàn kết & hợp tác (Collaboration): Anh/chị có quan hệ tốt với đồng nghiệp và tích cực tham gia phong trào tập thể?' },
      { id: '2.6', max: 1, text: 'Gắn bó cơ sở: Anh/chị có giữ mối liên hệ tốt với cấp ủy và Nhân dân nơi cư trú?' } ] },
    { id: 'S3', title: '3. Chuyên môn tham mưu phục vụ dân cử · Thực thi · Tác phong · Đổi mới · Chuyển đổi số (AIM)', max: 16, items: [
      { id: '3.1', max: 3, text: 'Chuyên môn & phân tích (Analytical): Anh/chị có nắm vững lĩnh vực, pháp luật, quy trình hoạt động dân cử; biết nghiên cứu – phân tích – tổng hợp phục vụ kỳ họp, giám sát?' },
      { id: '3.2', max: 3, text: 'Khả năng thực thi (Delivery): Anh/chị có hoàn thành tốt cả nhiệm vụ thường xuyên lẫn đột xuất, đúng tiến độ?' },
      { id: '3.3', max: 3, text: 'Tác phong & hợp tác (Influence): Anh/chị có trách nhiệm cao, phối hợp hiệu quả và làm việc khoa học?' },
      { id: '3.4', max: 3, text: 'Đổi mới (Motivation for Excellence): Anh/chị có sáng kiến/giải pháp nâng cao chất lượng phục vụ cơ quan dân cử?' },
      { id: '3.5', max: 4, text: 'Chuyển đổi số: Anh/chị có sử dụng thành thạo CNTT; lập và nộp hồ sơ điện tử đúng quy định?' } ] },
    { id: 'S4', title: '4. Tự soi, tự sửa (Excellence – cầu thị)', max: 4, items: [
      { id: '4.1', max: 2, text: 'Cầu thị: Anh/chị có tự nhận diện hạn chế, khuyết điểm của bản thân?' },
      { id: '4.2', max: 2, text: 'Khắc phục: Kết quả sửa chữa hạn chế, khuyết điểm đã được chỉ ra ra sao?' } ] },
  ] },
  contract: { label: 'Lao động hợp đồng hỗ trợ, phục vụ', mau: 'Mẫu số 05', formula: '(a+b+c)/3', groups: [
    { id: 'C1', title: '1. Chính trị, đạo đức & ý thức kỷ luật (Integrity – Phục vụ)', max: 15, items: [
      { id: '1.1', max: 3, text: 'Chấp hành: Anh/chị có thực hiện đúng chủ trương của Đảng, pháp luật và kỷ luật của cơ quan?' },
      { id: '1.2', max: 3, text: 'Đạo đức: Anh/chị có gương mẫu về lối sống, không tham ô, lãng phí?' },
      { id: '1.3', max: 3, text: 'Tác phong phục vụ (Service): Anh/chị có tận tụy, trung thực, năng động, đúng mực khi phục vụ hoạt động của cơ quan dân cử?' },
      { id: '1.4', max: 3, text: 'Sẵn sàng nhận việc: Anh/chị có chấp hành phân công và thực hiện tốt quy chế, nội quy cơ quan?' },
      { id: '1.5', max: 3, text: 'Ứng xử: Anh/chị có thực hiện đúng quy tắc ứng xử trong cơ quan?' } ] },
    { id: 'C2', title: '2. Năng lực & khả năng thực thi (Delivery)', max: 10, items: [
      { id: '2.1', max: 3, text: 'Cập nhật kiến thức: Anh/chị có chủ động cập nhật kiến thức để phục vụ tốt nhiệm vụ được giao?' },
      { id: '2.2', max: 3, text: 'Lập kế hoạch: Anh/chị có xây dựng kế hoạch công tác cá nhân theo quy định?' },
      { id: '2.3', max: 2, text: 'Thành thạo quy trình: Anh/chị có nắm vững quy chế, quy trình tác nghiệp theo yêu cầu?' },
      { id: '2.4', max: 2, text: 'An toàn, hiệu quả: Anh/chị có sử dụng thành thạo phương tiện, thiết bị, bảo đảm an toàn và hiệu quả?' } ] },
    { id: 'C3', title: '3. Tự soi, tự sửa (Excellence – cầu thị)', max: 5, items: [
      { id: '3.1', max: 5, text: 'Cầu thị: Anh/chị có tự nhận diện hạn chế và chủ động khắc phục những điều đã được chỉ ra?' } ] },
  ] },
};
CRITERIA_SG.hdnd = { label: CRITERIA_CLASSIC.hdnd.label, mau: 'Mẫu số 01', formula: '(a+b+c)/3', groups: dancuGroups };
CRITERIA_SG.dbqh = { label: CRITERIA_CLASSIC.dbqh.label, mau: 'Mẫu số 02', formula: '(a+b+c)/3', groups: dancuGroups };

// Bộ tiêu chí "đang hoạt động" — đổi theo phiên bản giao diện (giống mẫu setCatalogRegistry).
// computePerson/UI/exporters đều đọc CRITERIA này; App gọi setCriteriaVersion(version) khi render.
let CRITERIA = CRITERIA_CLASSIC;
function setCriteriaVersion(v) { CRITERIA = (v === 'improved') ? CRITERIA_IMPROVED : (v === 'sg') ? CRITERIA_SG : CRITERIA_CLASSIC; }
// Bản 'sonha' dùng Nhóm I theo câu chữ pháp lý (CRITERIA_CLASSIC) + danh mục Nhóm II riêng (SONHA_CATALOG).

// Thứ tự hiển thị nhóm đối tượng (Mẫu 01 → 05)
const CRITERIA_ORDER = ['hdnd', 'dbqh', 'leader', 'staff', 'contract'];

// ===== 3 PHIÊN BẢN BỘ TIÊU CHÍ — nhãn + theme màu (Root/Login/header dùng chung) =====
const VERSIONS = [
  { id: 'classic', name: 'Cổ điển', desc: 'Theo QĐ 1053-QĐ/TU (câu chữ pháp lý)' },
  { id: 'improved', name: 'Cải tiến', desc: 'Cùng khung điểm, câu hỏi dễ hiểu (AIM/ISE)' },
  { id: 'sg', name: 'Singapore', desc: 'Thiết kế riêng cho cơ quan dân cử (HĐND/ĐBQH)' },
  { id: 'sonha', name: 'SonHa', desc: 'Gọn 3 module + danh mục VP theo NĐ 335/2025; liên kết Quản lý văn bản & Import file' },
  { id: 'kiemdiem', name: 'Kiểm điểm', desc: 'Đánh giá hằng QUÝ cán bộ diện BTV Tỉnh ủy quản lý — theo HD 03-HD/TU (02/7/2026)' },
];
const VERSION_THEME = {
  classic: { grad: 'from-[#6b1212] via-[#a51c1c] to-[#7f1d1d]', blob1: 'bg-amber-400/20', blob2: 'bg-rose-500/20', eyebrow: 'text-amber-300', badge: 'bg-amber-400 text-red-900', tabOn: 'bg-white text-red-800 ring-1 ring-amber-300/50', tabOff: 'text-red-100/80 hover:text-white hover:bg-white/10' },
  improved: { grad: 'from-[#0b3b5e] via-[#0e7490] to-[#155e75]', blob1: 'bg-cyan-300/20', blob2: 'bg-teal-400/20', eyebrow: 'text-cyan-200', badge: 'bg-cyan-300 text-cyan-950', tabOn: 'bg-white text-cyan-800 ring-1 ring-cyan-300/50', tabOff: 'text-cyan-100/80 hover:text-white hover:bg-white/10' },
  sg: { grad: 'from-[#3b0764] via-[#6d28d9] to-[#4338ca]', blob1: 'bg-violet-300/20', blob2: 'bg-indigo-400/20', eyebrow: 'text-violet-200', badge: 'bg-violet-300 text-violet-950', tabOn: 'bg-white text-indigo-800 ring-1 ring-violet-300/50', tabOff: 'text-violet-100/80 hover:text-white hover:bg-white/10' },
  sonha: { grad: 'from-[#064e3b] via-[#047857] to-[#065f46]', blob1: 'bg-emerald-300/20', blob2: 'bg-teal-400/20', eyebrow: 'text-emerald-200', badge: 'bg-emerald-300 text-emerald-950', tabOn: 'bg-white text-emerald-800 ring-1 ring-emerald-300/50', tabOff: 'text-emerald-100/80 hover:text-white hover:bg-white/10' },
  kiemdiem: { grad: 'from-[#7f1d1d] via-[#9f1239] to-[#881337]', blob1: 'bg-amber-400/20', blob2: 'bg-rose-500/20', eyebrow: 'text-amber-200', badge: 'bg-amber-300 text-rose-950', tabOn: 'bg-white text-rose-800 ring-1 ring-amber-300/50', tabOff: 'text-rose-100/80 hover:text-white hover:bg-white/10' },
};
const VERSION_NAME = (v) => (VERSIONS.find((x) => x.id === v) || VERSIONS[0]).name;
// Màu cho tiến độ Key Result (literal để Tailwind không bị purge).
const KR_TONE = {
  emerald: { bar: 'bg-emerald-500', text: 'text-emerald-600', chip: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  amber: { bar: 'bg-amber-500', text: 'text-amber-600', chip: 'bg-amber-50 text-amber-700 border-amber-100' },
  rose: { bar: 'bg-rose-500', text: 'text-rose-600', chip: 'bg-rose-50 text-rose-700 border-rose-100' },
};

// Chức danh được coi là "giữ chức vụ lãnh đạo, quản lý" → áp công thức 6 thành phần (Điều 7 QĐ 1053).
// Dùng chung cho cả 3 phiên bản (bản PRO import lại từ đây).
const LEADER_TITLES = ['Chủ tịch', 'Phó Chủ tịch', 'Trưởng Đoàn', 'Phó Trưởng Đoàn', 'Trưởng Ban', 'Phó Trưởng Ban', 'Chánh Văn phòng', 'Phó Chánh Văn phòng', 'Trưởng phòng', 'Phó Trưởng phòng'];
function isLeaderPerson(p) {
  if (!p) return false;
  if (p.type === 'leader') return true;            // Mẫu 03: luôn là lãnh đạo, quản lý
  if (p.type === 'staff' || p.type === 'contract') return false; // Mẫu 04/05: không giữ chức vụ
  const pos = p.position || '';                    // Đại biểu HĐND/QH (Mẫu 01/02): theo CHỨC VỤ
  return LEADER_TITLES.some((t) => pos.includes(t));
}

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

// ===== PHIÊN BẢN "SonHa" — Danh mục sản phẩm/công việc theo QĐ Danh mục của VP Đoàn ĐBQH & HĐND tỉnh Thanh Hóa =====
// (docs/QD_Danh_muc_san_pham_cong_viec_VP_DDBQH_HDND_Thanh_Hoa.docx — Phụ lục I/II).
// Đơn vị chuẩn = 100 điểm (hệ số 1,0); maxScore = "Điểm" quy đổi (= hệ số × 100) → dùng làm TRỌNG SỐ trong agg335.
// Ba phần theo NĐ 335/2025: I - Chuyên môn, nghiệp vụ (CMNV) · II - Lãnh đạo, quản lý (LĐQL) · III - Hỗ trợ, phục vụ (HTPV).
const SH_TYPES_CM = ['staff', 'leader', 'hdnd', 'dbqh']; // CMNV: công chức chuyên môn + lãnh đạo khi trực tiếp làm + đại biểu chuyên trách
const SH_TYPES_LD = ['leader', 'hdnd', 'dbqh'];          // LĐQL: cán bộ giữ chức vụ lãnh đạo, quản lý
const SH_TYPES_HT = ['contract'];                        // HTPV: lao động hợp đồng hỗ trợ, phục vụ
const shLv = (n) => 'N' + Math.min(5, Math.max(1, n));   // nhóm độ phức tạp 1–5 → nhãn N1–N5 (chỉ để hiển thị)
// Rút gọn: [id, tên, sản phẩm đầu ra, nhóm phức tạp, điểm]
const _shCM = [
  // A. Công tác tham mưu, tổng hợp phục vụ hoạt động chung
  ['SH.CM.A1', 'Xây dựng chương trình, kế hoạch công tác năm của Thường trực HĐND tỉnh, Đoàn ĐBQH tỉnh', '01 chương trình/kế hoạch', 5, 200],
  ['SH.CM.A2', 'Xây dựng kế hoạch công tác tháng, quý của Văn phòng', '01 kế hoạch', 2, 110],
  ['SH.CM.A3', 'Báo cáo tuần phục vụ giao ban Thường trực HĐND tỉnh, lãnh đạo Văn phòng', '01 báo cáo', 1, 100],
  ['SH.CM.A4', 'Báo cáo công tác tháng, quý, 6 tháng, năm của Thường trực HĐND tỉnh, Đoàn ĐBQH tỉnh', '01 báo cáo', 4, 160],
  ['SH.CM.A5', 'Soạn thảo văn bản hành chính thông thường (đơn vị sản phẩm/công việc chuẩn)', '01 văn bản', 1, 100],
  ['SH.CM.A6', 'Tham mưu chương trình, nội dung, tài liệu phiên họp thường kỳ của Thường trực HĐND tỉnh', '01 phiên họp', 4, 160],
  ['SH.CM.A7', 'Ghi biên bản phiên họp, cuộc họp', '01 biên bản', 2, 110],
  ['SH.CM.A8', 'Dự thảo thông báo kết luận phiên họp', '01 thông báo', 3, 130],
  // B. Tham mưu, phục vụ kỳ họp HĐND tỉnh
  ['SH.CM.B1', 'Tham mưu kế hoạch tổ chức kỳ họp; dự kiến chương trình kỳ họp', '01 kỳ họp', 5, 190],
  ['SH.CM.B2', 'Rà soát, biên tập, tổng hợp hồ sơ, tài liệu trình kỳ họp', '01 nội dung/bộ hồ sơ', 3, 140],
  ['SH.CM.B3', 'Dự thảo nghị quyết trình kỳ họp', '01 dự thảo nghị quyết', 5, 200],
  ['SH.CM.B4', 'Tổng hợp ý kiến thảo luận tại tổ, tại hội trường', '01 báo cáo tổng hợp', 4, 170],
  ['SH.CM.B5', 'Hoàn thiện nghị quyết sau kỳ họp, trình ký chứng thực, phát hành', '01 nghị quyết', 3, 140],
  ['SH.CM.B6', 'Ghi biên bản kỳ họp', '01 biên bản', 3, 130],
  // C. Tham mưu, phục vụ giám sát, khảo sát
  ['SH.CM.C1', 'Tham mưu kế hoạch, đề cương, quyết định thành lập đoàn giám sát chuyên đề', '01 cuộc giám sát', 5, 190],
  ['SH.CM.C2', 'Tổng hợp báo cáo của cơ quan, đơn vị chịu sự giám sát', '01 báo cáo tổng hợp', 3, 130],
  ['SH.CM.C3', 'Dự thảo báo cáo kết quả giám sát chuyên đề', '01 báo cáo', 5, 200],
  ['SH.CM.C4', 'Dự thảo thông báo kết luận, kiến nghị sau giám sát', '01 văn bản', 3, 140],
  ['SH.CM.C5', 'Theo dõi, đôn đốc, tổng hợp kết quả thực hiện kiến nghị sau giám sát', '01 báo cáo', 3, 140],
  // D. Tham mưu, phục vụ tiếp xúc cử tri
  ['SH.CM.D1', 'Xây dựng kế hoạch tiếp xúc cử tri của đại biểu Quốc hội, đại biểu HĐND tỉnh', '01 kế hoạch', 3, 130],
  ['SH.CM.D2', 'Phục vụ hội nghị tiếp xúc cử tri', '01 hội nghị', 2, 110],
  ['SH.CM.D3', 'Báo cáo tổng hợp ý kiến, kiến nghị của cử tri trước, sau kỳ họp', '01 báo cáo', 5, 190],
  ['SH.CM.D4', 'Theo dõi, đôn đốc, tổng hợp kết quả giải quyết kiến nghị của cử tri', '01 báo cáo', 4, 160],
  // Đ. Công tác tiếp công dân, xử lý đơn thư
  ['SH.CM.E1', 'Phục vụ tiếp công dân định kỳ của Thường trực HĐND tỉnh, đại biểu QH, đại biểu HĐND tỉnh', '01 buổi tiếp', 2, 110],
  ['SH.CM.E2', 'Tiếp nhận, phân loại, đề xuất hướng xử lý đơn khiếu nại, tố cáo, kiến nghị, phản ánh', '01 đơn', 1, 90],
  ['SH.CM.E3', 'Dự thảo văn bản chuyển đơn, hướng dẫn công dân', '01 văn bản', 1, 100],
  ['SH.CM.E4', 'Theo dõi, đôn đốc việc giải quyết đơn; báo cáo định kỳ công tác tiếp công dân, xử lý đơn thư', '01 báo cáo', 3, 140],
  // E. Tham mưu, phục vụ hoạt động của Đoàn ĐBQH tỉnh
  ['SH.CM.F1', 'Kế hoạch tổ chức lấy ý kiến góp ý dự án luật, dự thảo nghị quyết của Quốc hội', '01 kế hoạch', 3, 130],
  ['SH.CM.F2', 'Báo cáo tổng hợp ý kiến góp ý dự án luật, dự thảo nghị quyết', '01 báo cáo/dự án', 5, 190],
  ['SH.CM.F3', 'Tham mưu văn bản kiến nghị của Đoàn ĐBQH tỉnh gửi cơ quan có thẩm quyền ở trung ương', '01 văn bản', 4, 160],
  // G. Nghiệp vụ văn thư, lưu trữ, tài chính, công nghệ thông tin
  ['SH.CM.G1', 'Tiếp nhận, đăng ký, trình chuyển văn bản đến; phát hành văn bản đi', '10 văn bản', 1, 80],
  ['SH.CM.G2', 'Lập hồ sơ công việc, nộp lưu hồ sơ điện tử đúng quy định', '01 hồ sơ', 1, 90],
  ['SH.CM.G3', 'Lập dự toán, thanh quyết toán kinh phí; báo cáo tài chính định kỳ', '01 bộ chứng từ/báo cáo', 3, 130],
  ['SH.CM.G4', 'Quản trị hạ tầng CNTT, hệ thống họp không giấy; cập nhật dữ liệu điều hành', '01 tháng vận hành', 2, 110],
];
const _shCMGroup = (id) => {
  const s = id.slice('SH.CM.'.length, 'SH.CM.'.length + 1);
  return ({ A: 'I.A. Tham mưu, tổng hợp phục vụ hoạt động chung', B: 'I.B. Tham mưu, phục vụ kỳ họp HĐND tỉnh', C: 'I.C. Tham mưu, phục vụ giám sát, khảo sát', D: 'I.D. Tham mưu, phục vụ tiếp xúc cử tri', E: 'I.Đ. Tiếp công dân, xử lý đơn thư', F: 'I.E. Phục vụ hoạt động Đoàn ĐBQH tỉnh', G: 'I.G. Văn thư, lưu trữ, tài chính, CNTT' }[s]);
};
const _shLD = [
  ['SH.LD.1', 'Chỉ đạo xây dựng, phê duyệt kế hoạch công tác tháng, quý của cơ quan/đơn vị phụ trách', '01 kế hoạch được phê duyệt', 3, 130],
  ['SH.LD.2', 'Chủ trì họp giao ban, phân công, giao nhiệm vụ gắn với sản phẩm đầu ra cho tập thể, cá nhân', '01 cuộc họp', 2, 110],
  ['SH.LD.3', 'Kiểm tra, cho ý kiến, duyệt/ký văn bản, đề án do cấp dưới trình', '01 văn bản/đề án được duyệt', 2, 110],
  ['SH.LD.4', 'Chỉ đạo giải quyết vướng mắc, vấn đề phát sinh trong phạm vi lĩnh vực phụ trách', '01 vụ việc được giải quyết', 3, 140],
  ['SH.LD.5', 'Theo dõi, giám sát tiến độ, chất lượng nhiệm vụ của các phòng; đôn đốc, cảnh báo nhiệm vụ chậm', '01 lượt rà soát/báo cáo', 2, 120],
  ['SH.LD.6', 'Nhận xét, đánh giá, quyết định xếp loại KPI hằng tháng đối với cán bộ, công chức thuộc thẩm quyền', '01 kỳ đánh giá đúng hạn', 3, 130],
  ['SH.LD.7', 'Đại diện cơ quan làm việc, phối hợp với cơ quan, tổ chức khác theo phân công', '01 cuộc làm việc', 3, 130],
  ['SH.LD.8', 'Chủ trì sơ kết, tổng kết, rút kinh nghiệm chuyên đề thuộc lĩnh vực phụ trách', '01 hội nghị/báo cáo', 4, 160],
];
const _shHT = [
  ['SH.HT.1', 'Phục vụ hậu cần hội nghị, cuộc họp (phòng họp, tài liệu, nước uống, âm thanh)', '01 cuộc', 1, 80],
  ['SH.HT.2', 'Lái xe phục vụ lãnh đạo, đoàn công tác bảo đảm an toàn, đúng giờ', '01 chuyến công tác', 1, 90],
  ['SH.HT.3', 'Trực bảo vệ cơ quan theo ca, bảo đảm an ninh trật tự, phòng cháy chữa cháy', '01 ca trực', 1, 80],
  ['SH.HT.4', 'Vệ sinh trụ sở, chăm sóc khuôn viên bảo đảm sạch đẹp', '01 ngày công theo định mức', 1, 80],
  ['SH.HT.5', 'Sửa chữa nhỏ, bảo trì điện, nước, thiết bị văn phòng', '01 vụ việc hoàn thành', 1, 90],
  ['SH.HT.6', 'Phục vụ lễ tân, khánh tiết, đón tiếp khách', '01 lượt/sự kiện', 1, 90],
];
const _shRow = (types, groupFn) => ([id, name, output, cx, pt]) => ({ id, group: typeof groupFn === 'function' ? groupFn(id) : groupFn, name, output, level: shLv(cx), maxScore: pt, hasFactor: true, types });
const SONHA_CATALOG = [
  ..._shCM.map(_shRow(SH_TYPES_CM, _shCMGroup)),
  ..._shLD.map(_shRow(SH_TYPES_LD, 'II. Nhiệm vụ lãnh đạo, quản lý (chỉ đạo, điều hành)')),
  ..._shHT.map(_shRow(SH_TYPES_HT, 'III. Công việc hỗ trợ, phục vụ')),
];

// ===== SonHa: Nhóm đối tượng (Mẫu) SUY RA TỪ CHỨC VỤ — không cần chọn nhóm thủ công =====
// Bản SonHa BỎ Mẫu 01/02 kiểu đại biểu (HĐND/QH). Đánh số lại theo chức vụ tại Văn phòng:
//  • Mẫu 01 — Cán bộ lãnh đạo, quản lý 01: Chánh/Phó Chánh Văn phòng → Nhóm II chỉ SH.LD (chỉ đạo, điều hành).
//  • Mẫu 02 — Cán bộ lãnh đạo, quản lý 02: Trưởng/Phó Trưởng phòng → Nhóm II như "lãnh đạo, quản lý" hiện tại (SH.CM + SH.LD).
//  • Mẫu 03 — Công chức chuyên môn, nghiệp vụ: chuyên viên → SH.CM.
//  • Mẫu 04 — Lao động hợp đồng hỗ trợ, phục vụ → SH.HT.
const SONHA_MAU = {
  ld1: { code: '01', name: 'Cán bộ lãnh đạo, quản lý 01', short: 'Lãnh đạo, quản lý 01', role: 'Chánh, Phó Chánh Văn phòng', type: 'leader' },
  ld2: { code: '02', name: 'Cán bộ lãnh đạo, quản lý 02', short: 'Lãnh đạo, quản lý 02', role: 'Trưởng, Phó Trưởng phòng', type: 'leader' },
  staff: { code: '03', name: 'Công chức chuyên môn, nghiệp vụ', short: 'Công chức', role: 'Chuyên viên các phòng', type: 'staff' },
  contract: { code: '04', name: 'Lao động hợp đồng hỗ trợ, phục vụ', short: 'Hỗ trợ, phục vụ', role: 'Lái xe, bảo vệ, phục vụ, tạp vụ…', type: 'contract' },
};
const SONHA_MAU_ORDER = ['ld1', 'ld2', 'staff', 'contract'];
// Suy Mẫu SonHa từ chức vụ (ưu tiên), sau đó tới nhóm đối tượng gốc.
function sonhaMauKey(p) {
  if (!p) return 'staff';
  const pos = p.position || '';
  if (/Lái xe|Bảo vệ|phục vụ|tạp vụ|bảo trì|lễ tân|hậu cần/i.test(pos)) return 'contract';
  if (/Chánh Văn phòng/.test(pos)) return 'ld1';   // khớp cả "Phó Chánh Văn phòng"
  if (/Trưởng phòng/.test(pos)) return 'ld2';       // khớp cả "Phó Trưởng phòng"
  if (/Chuyên viên/.test(pos)) return 'staff';
  if (p.type === 'contract') return 'contract';     // dữ liệu đã gán nhóm hợp đồng nhưng chưa có chức vụ khớp
  if (p.type === 'leader') return 'ld2';            // lãnh đạo khác (mặc định) → LĐQL 02
  return 'staff';
}
// Nhóm đối tượng GỐC (type) tương ứng — để CRITERIA/công thức (isLeaderPerson) hoạt động nhất quán với chức vụ.
const sonhaTypeOf = (p) => SONHA_MAU[sonhaMauKey(p)].type;
// Danh mục Nhóm II của SonHa theo Mẫu (lọc theo tiền tố id).
function sonhaCatalogFor(mauKey) {
  if (mauKey === 'ld1') return SONHA_CATALOG.filter((c) => c.id.startsWith('SH.LD.'));
  if (mauKey === 'ld2') return SONHA_CATALOG.filter((c) => c.id.startsWith('SH.CM.') || c.id.startsWith('SH.LD.'));
  if (mauKey === 'contract') return SONHA_CATALOG.filter((c) => c.id.startsWith('SH.HT.'));
  return SONHA_CATALOG.filter((c) => c.id.startsWith('SH.CM.')); // staff (Mẫu 03)
}
const sonhaGroupsOf = (p) => sonhaCatalogFor(sonhaMauKey(p));

// ===== SonHa: chế độ THƯỞNG ĐIỂM khi vượt định mức =====
// Nghiên cứu: NĐ 335/2025 & đặc tả kẹp a,b,c ≤ 100 (không thưởng vượt mức trong thang chính), nhưng coi "≥30% vượt mức"
// là ĐIỀU KIỆN loại A và cho phép "điểm cộng theo quy chế cơ quan" cho nhiệm vụ vượt định mức/đột xuất (Chương VI.2).
// Rủi ro Goodhart (khai khống, chọn việc dễ) → thưởng phải NHỎ, có TRẦN, chỉ tính phần vượt ĐÃ được Cấp duyệt nghiệm thu.
// Đề xuất: +0,1 điểm cho mỗi 1% vượt định mức bình quân (trọng số theo hệ số), TRẦN +5 điểm; tổng vẫn kẹp ≤ 100.
const SH_BONUS_PER_PCT = 0.1;  // điểm thưởng cho mỗi 1% vượt định mức (bình quân theo trọng số)
const SH_BONUS_MAX = 5;        // trần điểm thưởng
const sonhaBonus = (exceedPct) => Math.min(SH_BONUS_MAX, Math.max(0, Number(exceedPct) || 0) * SH_BONUS_PER_PCT);

// Hai mục "để chờ cấu hình" của bản SonHa (hiển thị đầu tab Đánh giá):
//  (1) Liên kết hệ thống Quản lý văn bản — tự động lấy số liệu nhiệm vụ giao/văn bản phát hành làm minh chứng.
//      Endpoint/xác thực sẽ được cấu hình sau (theo Chương III.9 đặc tả yêu cầu phần mềm).
//  (2) Import file đánh giá — dùng khi không muốn chấm trực tiếp trên web; nhận file theo mẫu ban hành kèm Quyết định.
function SonHaConnectors({ canEdit = false }) {
  const [file, setFile] = useState(null);
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-emerald-200 overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white px-5 py-3.5 flex items-center gap-2">
        <Link2 className="w-5 h-5 text-emerald-200" />
        <h2 className="font-bold">Nguồn dữ liệu đánh giá</h2>
        <span className="ml-auto text-[11px] text-emerald-100/90">Bản SonHa</span>
      </div>
      <div className="p-4 grid gap-3 sm:grid-cols-2">
        {/* (1) Liên kết Quản lý văn bản — để chờ cấu hình */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-1"><Cloud className="w-4 h-4 text-emerald-600" /><p className="font-semibold text-slate-800 text-sm">Liên kết hệ thống Quản lý văn bản</p><span className="ml-auto shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">Chờ cấu hình</span></div>
          <p className="text-xs text-slate-500 leading-relaxed flex-1">Tự động lấy số liệu <b>nhiệm vụ được giao qua văn bản</b> và <b>văn bản phát hành</b> (làm minh chứng) để đếm khách quan Nhóm II. Địa chỉ kết nối và xác thực sẽ được cấu hình sau.</p>
          <button type="button" disabled title="Sẽ cấu hình liên kết sau" className="mt-3 w-full py-2 rounded-lg bg-slate-200 text-slate-500 text-xs font-semibold cursor-not-allowed">Kết nối (sẽ cấu hình sau)</button>
        </div>
        {/* (2) Import file đánh giá — nhận file, chờ ban hành mẫu để ánh xạ */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-1"><FileSpreadsheet className="w-4 h-4 text-emerald-600" /><p className="font-semibold text-slate-800 text-sm">Import file đánh giá</p><span className="ml-auto shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">Đang hoàn thiện</span></div>
          <p className="text-xs text-slate-500 leading-relaxed flex-1">Dùng khi <b>không muốn chấm trực tiếp trên web</b>: tải lên file kết quả đánh giá (Excel/CSV/JSON) theo mẫu ban hành kèm Quyết định để nạp vào phiếu.</p>
          <label className={`mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg border text-xs font-semibold transition-colors ${canEdit ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 cursor-pointer' : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'}`}>
            <FileText className="w-3.5 h-3.5" /><span className="truncate max-w-[180px]">{file ? file.name : 'Chọn file để nhập...'}</span>
            <input type="file" accept=".xlsx,.xls,.csv,.json" className="hidden" disabled={!canEdit} onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>
          {file && <p className="mt-2 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-lg p-2 leading-relaxed">Đã nhận <b>“{file.name}”</b>. Chức năng ánh xạ dữ liệu vào phiếu đánh giá sẽ khả dụng khi mẫu file import được ban hành.</p>}
        </div>
      </div>
    </section>
  );
}

// ===== Danh mục công việc do QUẢN TRỊ tùy chỉnh (lưu theo kỳ trong state.catalog) =====
// Đăng ký ở phạm vi module để getND335Groups/agg335 (hàm thuần) tra cứu được mà không phải
// truyền tham số qua mọi nơi gọi. Mỗi phiên bản gọi setCatalogRegistry(catalog) khi render.
// catalog = { custom: [{ id, name, group, output, level, maxScore, hasFactor, types[] }], hidden: [id,...] }
const LEVEL_SCORE = { N1: 100, N2: 200, N3: 300, N4: 400, N5: 500, 'Hỗ trợ': 0 };
let CUSTOM_CATALOG = [];   // công việc tùy chỉnh (gán theo Nhóm đối tượng qua trường types[])
let HIDDEN_CATALOG = [];   // id công việc mặc định bị ẩn ("bớt" khỏi danh mục)
let OVERRIDES = {};        // { [id]: { name?, group?, output?, level?, maxScore?, types? } } ghi đè thông số (cả mặc định lẫn tùy chỉnh)
// Danh mục NỀN "đang hoạt động" — đổi theo phiên bản: bản 'sonha' dùng SONHA_CATALOG (QĐ Danh mục VP),
// các bản còn lại dùng CATALOG (ND335 + HĐND). findCatalogItem/getND335Groups/catalogForGuide đọc biến này.
let ACTIVE_BASE = CATALOG;
let ACTIVE_VERSION = 'classic'; // phiên bản đang render (để computePerson biết có áp chế độ thưởng SonHa hay không)
function setBaseCatalog(v) { ACTIVE_VERSION = v || 'classic'; ACTIVE_BASE = (v === 'sonha') ? SONHA_CATALOG : CATALOG; }
function setCatalogRegistry(catalog) {
  CUSTOM_CATALOG = (catalog && Array.isArray(catalog.custom)) ? catalog.custom : [];
  HIDDEN_CATALOG = (catalog && Array.isArray(catalog.hidden)) ? catalog.hidden : [];
  OVERRIDES = (catalog && catalog.overrides && typeof catalog.overrides === 'object') ? catalog.overrides : {};
}
// Nhóm đối tượng MẶC ĐỊNH của 1 công việc theo tiền tố id (khi chưa ghi đè types).
function defaultTypesOfId(id) {
  const ts = [];
  if (id.startsWith('HD.')) ts.push('hdnd', 'dbqh');
  if (id.startsWith('III')) ts.push('contract');
  if (id.startsWith('II.A')) ts.push('staff');
  if (id.startsWith('II.B')) ts.push('staff', 'leader');
  if (id.startsWith('I.A') || id.startsWith('I.B')) ts.push('leader');
  return ts;
}
// Áp ghi đè (nếu có) lên 1 mục danh mục gốc.
function applyOverride(c) { const ov = OVERRIDES[c.id]; return ov ? { ...c, ...ov } : c; }
// Nhãn Mẫu (01–05) theo nhóm đối tượng — phục vụ liệt kê danh mục trong Hướng dẫn.
const MAU_OF_TYPE = { hdnd: '01', dbqh: '02', leader: '03', staff: '04', contract: '05' };
// Gộp danh mục MẶC ĐỊNH theo nhóm (giữ thứ tự), kèm nhãn "áp dụng cho Mẫu nào" — dùng chung cho tab Hướng dẫn & sổ tay PDF.
function catalogForGuide() {
  const groups = []; const idx = {};
  ACTIVE_BASE.forEach((c) => {
    const mau = [...new Set(effectiveTypes(c).map((t) => MAU_OF_TYPE[t]).filter(Boolean))].sort().join(', ');
    if (!(c.group in idx)) { idx[c.group] = groups.length; groups.push({ group: c.group, items: [] }); }
    groups[idx[c.group]].items.push({ id: c.id, name: c.name, output: c.output, level: c.level, maxScore: c.maxScore, mau });
  });
  return groups;
}
// Nhóm đối tượng HIỆU LỰC của 1 mục (ưu tiên ghi đè → trường types của mục → mặc định theo id).
function effectiveTypes(c) {
  const ov = OVERRIDES[c.id];
  if (ov && Array.isArray(ov.types)) return ov.types;
  if (Array.isArray(c.types)) return c.types;
  return defaultTypesOfId(c.id);
}
// Tra 1 mục danh mục theo id (gồm cả mặc định lẫn tùy chỉnh, đã áp ghi đè) — dùng cho tên/hệ số.
function findCatalogItem(id) {
  const base = ACTIVE_BASE.find((c) => c.id === id) || CUSTOM_CATALOG.find((c) => c.id === id);
  return base ? applyOverride(base) : null;
}

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
const MIN_DIGITAL = { leader: 3, staff: 2, contract: 1, hdnd: 3, dbqh: 3 };

const GRADES = {
  A: { code: 'A', name: 'Hoàn thành xuất sắc nhiệm vụ', cls: 'bg-emerald-500', ring: 'text-emerald-600', soft: 'bg-emerald-50 text-emerald-700 border-emerald-200', bar: 'bg-emerald-500' },
  B: { code: 'B', name: 'Hoàn thành tốt nhiệm vụ', cls: 'bg-sky-500', ring: 'text-sky-600', soft: 'bg-sky-50 text-sky-700 border-sky-200', bar: 'bg-sky-500' },
  C: { code: 'C', name: 'Hoàn thành nhiệm vụ', cls: 'bg-amber-500', ring: 'text-amber-600', soft: 'bg-amber-50 text-amber-700 border-amber-200', bar: 'bg-amber-500' },
  D: { code: 'D', name: 'Không hoàn thành nhiệm vụ', cls: 'bg-rose-500', ring: 'text-rose-600', soft: 'bg-rose-50 text-rose-700 border-rose-200', bar: 'bg-rose-500' },
};
const gradeFromScore = (t) => (t >= 90 ? 'A' : t >= 70 ? 'B' : t >= 50 ? 'C' : 'D');
// Xếp loại theo NGƯỠNG ĐIỂM (dùng cho hiển thị màu/biểu đồ tổng hợp; KHÔNG áp điều kiện Điều 8).
function classify(t) { return GRADES[gradeFromScore(t)]; }
// Lấy bộ màu/nhãn theo mã xếp loại đã tính (A/B/C/D).
const gradeClass = (code) => GRADES[code] || GRADES.D;

// Thống kê khách quan các nhiệm vụ Nhóm II — XÉT THEO TỪNG NHIỆM VỤ (mỗi nhiệm vụ tỷ lệ r = HT/Giao).
//  - đạt đủ số lượng: r ≥ 100%  · vượt mức: r > 100%
//  - KHÔNG hoàn thành: r < 50% (đạt dưới một nửa số lượng giao) — chỉ khi đó nhiệm vụ mới bị coi là không hoàn thành.
//  - chậm tiến độ: có ≥ 1 lần chậm.
const FAIL_RATIO = 0.5; // ngưỡng "không hoàn thành" của MỖI nhiệm vụ
function taskStats(tasks, which = 'mgr') {
  const valid = (tasks || []).filter((t) => t.catalogId);
  const n = valid.length;
  if (!n) return { n: 0, doneRate: 100, exceedRate: 0, delayRate: 0, failRate: 0 };
  let done = 0, exceed = 0, delay = 0, fail = 0;
  if (ACTIVE_VERSION === 'sonha') {
    // Bản SonHa: suy từ 3 tiêu chí (số lượng/chất lượng/tiến độ) → mức độ hoàn thành + tiến độ thực.
    valid.forEach((t) => {
      const r = shTaskResult(t, which); const m = mucOf(r.level);
      if (m.rank >= 3) done++;                     // Hoàn thành tốt trở lên
      if (r.exceed) exceed++;                      // vượt định mức
      if (m.fail) fail++;                          // Không hoàn thành (<50%)
      if (tTdKey(t, which) !== 'dung') delay++;    // chậm/trễ tiến độ
    });
    return { n, doneRate: (done / n) * 100, exceedRate: (exceed / n) * 100, delayRate: (delay / n) * 100, failRate: (fail / n) * 100 };
  }
  valid.forEach((t) => {
    const as = Number(t.assigned) || 0, cp = tCompleted(t, which);
    const r = as > 0 ? cp / as : 0;
    if (r >= 1) done++;
    if (r > 1) exceed++;
    if (r < FAIL_RATIO) fail++;
    if (tDelays(t, which) > 0) delay++;
  });
  return { n, doneRate: (done / n) * 100, exceedRate: (exceed / n) * 100, delayRate: (delay / n) * 100, failRate: (fail / n) * 100 };
}

// Phân loại nhiệm vụ để liệt kê đích danh (dùng chung cho GradeExplain bản Cổ điển & hộp điều kiện bản Mới).
//  failed: đạt <50% số lượng (không hoàn thành) · partial: 50–99% (chưa đủ) · delayed: có lần chậm · uncounted: chưa chọn danh mục
function taskBreakdown(tasks, which = 'mgr') {
  const list = (tasks || []).filter((t) => t.catalogId);
  if (ACTIVE_VERSION === 'sonha') {
    // Bản SonHa: phân loại theo mức độ hoàn thành (suy ra) + tiến độ thực.
    return {
      failed: list.filter((t) => mucOf(tMuc(t, which)).fail),
      partial: list.filter((t) => { const m = mucOf(tMuc(t, which)); return m.rank > 0 && m.rank < 3; }),
      delayed: list.filter((t) => tTdKey(t, which) !== 'dung'),
      uncounted: (tasks || []).filter((t) => !t.catalogId).length,
    };
  }
  const ratio = (t) => { const as = Number(t.assigned) || 0, cp = tCompleted(t, which); return as > 0 ? cp / as : 0; };
  return {
    failed: list.filter((t) => ratio(t) < 0.5),
    partial: list.filter((t) => { const r = ratio(t); return r >= 0.5 && r < 1; }),
    delayed: list.filter((t) => tDelays(t, which) > 0),
    uncounted: (tasks || []).filter((t) => !t.catalogId).length,
  };
}

// Xác định mức xếp loại theo Điều 8 QĐ 1053: ngưỡng điểm + điều kiện định lượng (xét theo từng nhiệm vụ).
// Trả { code, reasons[] } — reasons giải thích vì sao hạ/chốt mức (minh bạch khi chấm).
function evalGradeCode(score, st, { disciplined = false, leader = false } = {}) {
  const reasons = [];
  // Khoản 4 — Không hoàn thành nhiệm vụ (chốt mức D). "Không hoàn thành" 1 nhiệm vụ = đạt dưới 50% số lượng giao.
  if (disciplined) return { code: 'D', reasons: ['Bị xử lý kỷ luật đảng/hành chính hoặc bị kết luận suy thoái, vi phạm công vụ trong kỳ → Không hoàn thành nhiệm vụ (Điều 8 khoản 4).'] };
  // Lãnh đạo: đơn vị phụ trách hoàn thành dưới 70% số nhiệm vụ (tức trên 30% nhiệm vụ không hoàn thành). CBCC: trên 50%.
  const failCap = leader ? 30 : 50;
  if (st.n > 0 && st.failRate > failCap) return { code: 'D', reasons: [leader
    ? `Lĩnh vực phụ trách chỉ hoàn thành ${(100 - st.failRate).toFixed(0)}% số nhiệm vụ (dưới 70%) — có ${st.failRate.toFixed(0)}% nhiệm vụ đạt dưới 50% số lượng → Không hoàn thành nhiệm vụ (Điều 8.4.1).`
    : `Trên 50% số nhiệm vụ không hoàn thành (hiện ${st.failRate.toFixed(0)}% nhiệm vụ đạt dưới 50% số lượng giao) → Không hoàn thành nhiệm vụ (Điều 8.4.2).`] };

  let code = gradeFromScore(score);
  // HTXS (A): ngoài ≥90 điểm, phải hoàn thành ĐỦ 100% số lượng ở MỌI nhiệm vụ và có ≥30% nhiệm vụ vượt mức.
  if (code === 'A') {
    if (st.n === 0) { code = 'B'; reasons.push('Đạt ≥90 điểm nhưng chưa nhập nhiệm vụ để xác nhận hoàn thành đủ số lượng và ≥30% vượt mức → tạm xếp Hoàn thành tốt (Điều 8.1).'); }
    else if (st.doneRate < 100 || st.exceedRate < 30) {
      code = 'B';
      reasons.push(`Đạt ≥90 điểm nhưng chưa đủ điều kiện Hoàn thành xuất sắc — cần đạt đủ 100% số lượng ở mọi nhiệm vụ${st.doneRate < 100 ? ` (mới ${st.doneRate.toFixed(0)}% số nhiệm vụ đạt đủ)` : ''} và có ≥30% nhiệm vụ vượt mức${st.exceedRate < 30 ? ` (hiện ${st.exceedRate.toFixed(0)}%)` : ''} → Hoàn thành tốt (Điều 8.1).`);
    }
  }
  // HTT (B): không được có nhiệm vụ không hoàn thành (đạt dưới 50%). Có thì hạ xuống Hoàn thành nhiệm vụ.
  if (code === 'B' && st.n > 0 && st.failRate > 0) {
    code = 'C';
    reasons.push(`Có nhiệm vụ đạt dưới 50% số lượng giao (${st.failRate.toFixed(0)}% số nhiệm vụ) → Hoàn thành nhiệm vụ (Điều 8.2/8.3).`);
  }
  // HTNV (C): số nhiệm vụ chậm tiến độ không quá 20% (chỉ cảnh báo, không tự hạ mức).
  if (code === 'C' && st.n > 0 && st.delayRate > 20) {
    reasons.push(`Lưu ý: tỷ lệ nhiệm vụ chậm tiến độ ${st.delayRate.toFixed(0)}% vượt mức 20% (Điều 8.3).`);
  }
  return { code, reasons };
}
function statusOf(p) {
  if (p >= 90) return { label: 'Đúng tiến độ', dot: 'bg-emerald-500', txt: 'text-emerald-600', soft: 'bg-emerald-50' };
  if (p >= 70) return { label: 'Cần chú ý', dot: 'bg-amber-500', txt: 'text-amber-600', soft: 'bg-amber-50' };
  return { label: 'Chậm / rủi ro', dot: 'bg-rose-500', txt: 'text-rose-600', soft: 'bg-rose-50' };
}
const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
// Đọc số liệu Nhóm II theo "Tự ĐG" (self) hoặc "Cấp duyệt" (mgr). Cấp duyệt MẶC ĐỊNH kế thừa Tự ĐG
// khi cấp trên chưa sửa (giống Nhóm I: mgrScores[id] ?? selfScores[id]).
const tCompleted = (t, which) => Number(which === 'self' ? t.completed : (t.mgrCompleted ?? t.completed)) || 0;
const tQuality = (t, which) => Number(which === 'self' ? t.qualityIssues : (t.mgrQualityIssues ?? t.qualityIssues)) || 0;
const tDelays = (t, which) => Number(which === 'self' ? t.delays : (t.mgrDelays ?? t.delays)) || 0;
// ===== Bản SonHa (OKR/KPI): Nhóm II chấm theo 3 TIÊU CHÍ KHÁCH QUAN → SUY RA MỨC ĐỘ HOÀN THÀNH =====
// Mỗi nhiệm vụ được đánh giá theo bộ ba của NĐ 335/2025 (đã kiểm nghiệm trong nước và quốc tế —
// output/quantity · quality · timeliness):
//   a — SỐ LƯỢNG (khối lượng): SL hoàn thành / SL giao (định mức).
//   b — CHẤT LƯỢNG: mức đạt chuẩn nghiệm thu (chọn 3 mức).
//   c — TIẾN ĐỘ: mức đúng hạn (chọn 3 mức).
// Kết quả nhiệm vụ % = (a + b + c) / 3; từ % + việc có vượt định mức → SUY RA Mức độ hoàn thành
// (Xuất sắc/Tốt/Cơ bản/Chưa/Không) để hiển thị & áp điều kiện xếp loại (Điều 8).
// Trọng số khi tổng hợp = hệ số danh mục (độ phức tạp) × hệ số tầm quan trọng.
const SH_CL = [
  { k: 'tot', pct: 100, label: 'Đạt chuẩn / tốt', short: 'Đạt chuẩn' },
  { k: 'kha', pct: 75, label: 'Có sai sót nhỏ, phải chỉnh sửa', short: 'Có sai sót' },
  { k: 'kem', pct: 50, label: 'Chưa đạt / phải làm lại', short: 'Chưa đạt' },
];
const SH_TD = [
  { k: 'dung', pct: 100, label: 'Đúng hạn', short: 'Đúng hạn' },
  { k: 'treit', pct: 80, label: 'Chậm ít (trong phạm vi cho phép)', short: 'Chậm ít' },
  { k: 'tre', pct: 50, label: 'Trễ hạn / quá hạn', short: 'Trễ hạn' },
];
const clOf = (k) => SH_CL.find((x) => x.k === k) || SH_CL[0];
const tdOf = (k) => SH_TD.find((x) => x.k === k) || SH_TD[0];
// Đọc mức Chất lượng/Tiến độ (Cấp duyệt kế thừa Tự ĐG). Dữ liệu cũ nhập "số lần sai sót/trễ hạn"
// được TỰ QUY ĐỔI sang mức tương đương (tương thích ngược).
const tClKey = (t, which) => {
  const raw = which === 'self' ? t.cl : (t.mgrCl ?? t.cl);
  if (raw) return raw;
  const q = tQuality(t, which); return q <= 0 ? 'tot' : q === 1 ? 'kha' : 'kem';
};
const tTdKey = (t, which) => {
  const raw = which === 'self' ? t.td : (t.mgrTd ?? t.td);
  if (raw) return raw;
  const d = tDelays(t, which); return d <= 0 ? 'dung' : d === 1 ? 'treit' : 'tre';
};
const shCompleted = (t, which) => {
  const raw = which === 'self' ? t.completed : (t.mgrCompleted ?? t.completed);
  const as = Math.max(1, Number(t.assigned) || 1);
  return (raw == null || raw === '') ? as : Math.max(0, Number(raw) || 0);
};
// Suy Mức độ hoàn thành từ % kết quả + cờ vượt định mức.
function shLevelFrom(pct, exceed) {
  if (exceed && pct >= 90) return 'xuatsac';
  if (pct >= 90) return 'tot';
  if (pct >= 75) return 'dat';
  if (pct >= 50) return 'chua';
  return 'khong';
}
// Kết quả 1 nhiệm vụ SonHa: { pct, a, b, c, exceed, level }.
function shTaskResult(t, which = 'mgr') {
  const as = Math.max(1, Number(t.assigned) || 1);
  const cp = shCompleted(t, which);
  const a = Math.min(100, (cp / as) * 100);       // số lượng (khối lượng)
  const b = clOf(tClKey(t, which)).pct;           // chất lượng
  const c = tdOf(tTdKey(t, which)).pct;           // tiến độ
  const pct = clamp((a + b + c) / 3);
  const exceed = cp > as && b >= 100 && c >= 100; // vượt mức: vượt số lượng + đạt chuẩn + đúng hạn
  return { pct, a, b, c, exceed, level: shLevelFrom(pct, exceed) };
}
// Mức độ hoàn thành (đã suy ra) của 1 nhiệm vụ — giữ tên tMuc để nơi khác (Word, GradeExplain) dùng chung.
const tMuc = (t, which) => shTaskResult(t, which).level;
// Điểm % của 1 nhiệm vụ Nhóm II — dùng cho màu trạng thái & tiến độ OKR. which = 'mgr'(mặc định) | 'self'.
// Bản SonHa: điểm = % của mức độ hoàn thành; các bản khác: đếm khách quan (a+b+c)/3.
function task335Score(t, which = 'mgr') {
  if (ACTIVE_VERSION === 'sonha') return shTaskResult(t, which).pct;
  const as = Number(t.assigned) || 0;
  if (as === 0) return 0;
  const a = Math.min(100, tCompleted(t, which) / as * 100);
  const b = Math.max(0, 1 - 0.25 * tQuality(t, which)) * 100;
  const c = Math.max(0, 1 - 0.25 * tDelays(t, which)) * 100;
  return (a + b + c) / 3;
}
function agg335(tasks335, which = 'mgr') {
  const valid = (tasks335 || []).filter(t => t.catalogId);
  // Chưa nhập nhiệm vụ nào -> mặc định đạt tối đa 100 (cán bộ mới khởi tạo 100/100, đánh giá trừ dần)
  if (valid.length === 0) return { a: 100, b: 100, c: 100, val: 100 };
  // Bản SonHa: điểm = trung bình có trọng số của MỨC ĐỘ HOÀN THÀNH từng nhiệm vụ.
  // Trọng số = hệ số danh mục (độ phức tạp) × hệ số tầm quan trọng (Thường ×1 · Quan trọng ×1,5 · Trọng tâm ×2).
  // exceedPct = tỷ trọng nhiệm vụ đạt mức Xuất sắc (vượt yêu cầu) — dùng cho chế độ thưởng.
  if (ACTIVE_VERSION === 'sonha') {
    let W = 0, WP = 0, WX = 0;
    valid.forEach((t) => {
      const cat = findCatalogItem(t.catalogId); if (!cat) return;
      const w = ((Number(cat.maxScore) || 100) / 100) * tamOf(t.tam).heso;
      const r = shTaskResult(t, which);
      W += w; WP += r.pct * w; if (r.exceed) WX += w;
    });
    if (!W) return { a: 100, b: 100, c: 100, val: 100, exceedPct: 0 };
    const val = WP / W;
    return { a: val, b: val, c: val, val, exceedPct: (WX / W) * 100 };
  }
  let totalAssignedScore = 0, totalCompletedScore = 0, totalQualityScore = 0, totalDelayScore = 0, totalExceedScore = 0;
  valid.forEach(t => {
    const cat = findCatalogItem(t.catalogId);
    if (!cat) return;
    // Hệ số làm trọng số; nhóm hỗ trợ (III.*) có hệ số 0 -> coi trọng số = 1 (đếm ngang nhau)
    const w = Number(cat.maxScore) || 1;
    const as = Number(t.assigned) || 0;
    const cp = tCompleted(t, which);
    const qI = tQuality(t, which);
    const dl = tDelays(t, which);

    totalAssignedScore += as * w;
    totalCompletedScore += cp * w;
    totalQualityScore += cp * w * Math.max(0, 1 - 0.25 * qI);
    totalDelayScore += cp * w * Math.max(0, 1 - 0.25 * dl);
    totalExceedScore += Math.max(0, cp - as) * w; // phần VƯỢT định mức (trọng số) — dùng cho chế độ thưởng
  });
  if (totalAssignedScore === 0) return { a: 100, b: 100, c: 100, val: 100, exceedPct: 0 };
  const a = Math.min(100, (totalCompletedScore / totalAssignedScore) * 100);
  const b = totalCompletedScore > 0 ? (totalQualityScore / totalCompletedScore) * 100 : 100;
  const c = totalCompletedScore > 0 ? (totalDelayScore / totalCompletedScore) * 100 : 100;
  const exceedPct = (totalExceedScore / totalAssignedScore) * 100; // % vượt định mức bình quân theo trọng số
  return { a, b, c, val: (a + b + c) / 3, exceedPct };
}

function getND335Groups(type) {
  // Gộp mặc định + tùy chỉnh, bỏ mục bị ẩn, lọc theo nhóm đối tượng HIỆU LỰC, áp ghi đè thông số.
  return [...ACTIVE_BASE, ...CUSTOM_CATALOG]
    .filter((c) => !HIDDEN_CATALOG.includes(c.id))
    .filter((c) => effectiveTypes(c).includes(type))
    .map((c) => applyOverride(c));
}

function computePerson(p) {
  // Phòng vệ: bản ghi hỏng/thiếu Nhóm đối tượng không làm crash cả app (ErrorBoundary).
  if (!p || !CRITERIA[p.type]) {
    return { nself: 0, nmgr: 0, k: { a: 0, b: 0, c: 0, val: 0 }, leader: false, st: { n: 0, doneRate: 0, exceedRate: 0, delayRate: 0, failRate: 0 }, nhomII: 0, totalSelf: 0, totalMgr: 0, grade: 'D', gradeReasons: ['Thiếu hoặc sai "Nhóm đối tượng đánh giá" — vui lòng chọn lại nhóm cho cán bộ này.'] };
  }
  const selfScores = p.selfScores || {}, mgrScores = p.mgrScores || {};
  let nself = 0, nmgr = 0;
  CRITERIA[p.type].groups.forEach((g) => g.items.forEach((it) => {
    // Kẹp theo điểm tối đa của tiêu chí khi ĐỌC: dữ liệu cũ (lưu trước khi đổi bộ tiêu chí) có thể vượt trần mới.
    const sv = clamp(selfScores[it.id] ?? it.max, 0, it.max);
    nself += sv; nmgr += clamp(mgrScores[it.id] ?? sv, 0, it.max);
  }));
  nself = Math.min(nself, 30); nmgr = Math.min(nmgr, 30);
  // Nhóm II: tính RIÊNG theo Tự ĐG (self) và Cấp duyệt (mgr). Cấp duyệt mặc định kế thừa Tự ĐG.
  const k = agg335(p.tasks335, 'mgr');
  const kSelf = agg335(p.tasks335, 'self');
  const leader = isLeaderPerson(p);
  // Lãnh đạo, quản lý (Điều 7): Điểm KQ = (a+b+c+d+đ+e)/6. d/đ/e mỗi mục 100% hoặc 50%.
  // Bản SonHa chấm Nhóm II theo MỨC ĐỘ HOÀN THÀNH (a=b=c=val) — KHÔNG áp công thức d/đ/e
  // (chất lượng lãnh đạo đã đánh giá ở Nhóm I); giữ Điểm KQ = val cho nhất quán, gọn như bản Kiểm điểm.
  const leaderFormula = leader && ACTIVE_VERSION !== 'sonha';
  if (leaderFormula) {
    const ls = p.leadScores || {};
    const d = Number(ls.d ?? 100), dd = Number(ls.dd ?? 100), e = Number(ls.e ?? 100);
    k.d = d; k.dd = dd; k.e = e;
    k.val = (k.a + k.b + k.c + d + dd + e) / 6;
    kSelf.d = d; kSelf.dd = dd; kSelf.e = e;
    kSelf.val = (kSelf.a + kSelf.b + kSelf.c + d + dd + e) / 6;
  }
  const nhomII = (k.val / 100) * 70;            // theo Cấp duyệt (dùng xếp loại chính thức)
  const nhomIISelf = (kSelf.val / 100) * 70;    // theo Tự đánh giá
  const ded = Number(p.deduction || 0);
  // Chế độ THƯỞNG vượt định mức — CHỈ áp cho bản SonHa (các bản khác giữ nguyên công thức cũ).
  const bonusOn = ACTIVE_VERSION === 'sonha';
  const bonus = bonusOn ? sonhaBonus(k.exceedPct) : 0;
  const bonusSelf = bonusOn ? sonhaBonus(kSelf.exceedPct) : 0;
  const totalSelf = clamp(nself + nhomIISelf - ded + bonusSelf);
  const totalMgr = clamp(nmgr + nhomII - ded + bonus);
  const st = taskStats(p.tasks335, 'mgr');
  const g = evalGradeCode(totalMgr, st, { disciplined: !!p.disciplined, leader });

  return {
    nself, nmgr, k, kSelf, leader, leaderFormula, st, nhomII, nhomIISelf,
    totalSelf, totalMgr, bonus, bonusSelf, exceedPct: k.exceedPct || 0,
    grade: g.code, gradeReasons: g.reasons,
  };
}
let pid = 3, trkId = 1, t335Id = 100, krSeq = 1;
const newTask335 = (objId = '') => ({ id: t335Id++, catalogId: '', objId, kr: '', assigned: 1, completed: 1, qualityIssues: 0, delays: 0, note: '', exemptNote: '' });
const newTracking = () => ({ id: trkId++, content: '', coordination: '', directive: '', finalProduct: '', startDate: '', endDate: '', doneWork: '', doingWork: '', difficulties: '', proposals: '', note: '', catalogId: '', objId: '', completed: 0, qualityIssues: 0, delays: 0 });
const newPerson = (name, type) => ({ id: pid++, name, position: '', department: '', email: '', role: 'canbo', type, selfScores: {}, mgrScores: {}, deduction: 0, disciplined: false, tasks335: [newTask335()], leadScores: { d: 100, dd: 100, e: 100 }, digital: {}, selfNote: '', mgrNote: '', trackings: [], approved: false, approvedBy: '', approvedRole: '', approvedAt: '', sg: { goals: [], comp: {}, values: {}, cep: '', strengths: '', development: '', devActions: '', selfComment: '', supComment: '', grade: '' } });

// Dữ liệu MẪU: 5 cán bộ tượng trưng cho 5 nhóm đối tượng (Mẫu 01–05) — đủ điểm số, xếp loại (A→D) và liên kết OKR.
// Sinh nhiệm vụ Nhóm II PHỦ TOÀN BỘ danh mục áp dụng cho nhóm đối tượng, theo "hồ sơ" giữ đúng xếp loại:
//  A = đạt đủ 100% + ≥30% vượt mức · B = đa số đạt, vài việc 70%, không việc nào <50%
//  C = ~1/3 việc <50% (Điều 8 hạ xuống HTNV) · D = >50% việc <50% (Không hoàn thành nhiệm vụ)
function genTasksFull(type, profile, OKR) {
  return genTasksFromCat(getND335Groups(type), profile, OKR);
}
// Sinh nhiệm vụ Nhóm II từ MỘT danh sách danh mục cho trước (dùng cho SonHa: danh mục theo Mẫu/chức vụ).
function genTasksFromCat(cat, profile, OKR) {
  if (!cat.length) return [newTask335()];
  return cat.map((c, i) => {
    let a = 3, comp = 3, q = 0, d = 0;
    if (profile === 'A') {
      a = 3 + (i % 4);                                  // 3..6
      comp = (i % 5 < 2) ? a + 1 + (i % 2) : a;         // ~40% vượt mức, còn lại đạt đủ
    } else if (profile === 'B') {
      a = 4 + (i % 4);                                  // 4..7
      if (i % 4 === 0) comp = Math.max(Math.ceil(a * 0.7), 1); // ~25% đạt ~70% (chưa đủ -> không lên A, không <50%)
      else if (i % 5 === 0) comp = a + 1;               // lác đác vượt mức (<30%)
      else comp = a;
      q = (i % 6 === 0) ? 1 : 0;
      d = (i % 4 === 1) ? 1 : 0;
    } else if (profile === 'C') {
      a = 5 + (i % 4);                                  // 5..8
      const m = i % 3;
      comp = m === 0 ? Math.floor(a * 0.4)              // ~1/3 việc <50% (không hoàn thành)
        : m === 1 ? a                                   // đạt đủ
          : Math.ceil(a * 0.7);                         // 70% (chưa đủ)
      q = (i % 3 === 0) ? 1 : 0;
      d = (i % 2 === 0) ? 1 : 0;
    } else { // D
      a = 6 + (i % 4);                                  // 6..9
      comp = (i % 4 === 0) ? Math.ceil(a * 0.6) : Math.floor(a * 0.3); // ~75% việc <50%
      q = (i % 2 === 0) ? 1 : 0;
      d = 1 + (i % 2);
    }
    // Bản SonHa chấm theo 3 tiêu chí: số lượng (assigned/completed) + Chất lượng (cl) + Tiến độ (td),
    // suy từ hồ sơ số lần sai sót/trễ hạn cho khớp. Việc hỏng (đạt <50% số lượng) thường kém & trễ toàn diện.
    // Các bản khác bỏ qua cl/td/tam.
    const r = comp / a;
    let cl = q <= 0 ? 'tot' : q === 1 ? 'kha' : 'kem';
    let td = d <= 0 ? 'dung' : d === 1 ? 'treit' : 'tre';
    if (r < 0.5) { cl = 'kem'; td = 'tre'; }
    else if (r < 0.75 && cl === 'tot') cl = 'kha';
    const ms = Number(c.maxScore) || 100;
    const tam = ms >= 200 ? 'trongtam' : ms >= 150 ? 'quantrong' : 'thuong';
    return { ...newTask335(), catalogId: c.id, objId: OKR[i % OKR.length], assigned: a, completed: comp, qualityIssues: q, delays: d, cl, td, note: '', tam };
  });
}

// Chọn bộ dữ liệu mẫu theo phiên bản: bản SonHa có bộ 20 cán bộ theo cơ cấu Văn phòng thực tế.
function seedDemoPeople(version) {
  if (version === 'sonha') return seedSonHaPeople();
  if (version === 'kiemdiem') return seedKiemDiemPeople();
  const OKR = ['o1', 'o2', 'o3'];
  const mk = (type, name, department, position, email, profile, cfg = {}) => ({
    ...newPerson(name, type), position, department, email, role: 'canbo',
    deduction: cfg.deduction || 0,
    leadScores: cfg.leadScores || { d: 100, dd: 100, e: 100 },
    digital: cfg.digital || { 1: 3, 2: 3, 3: 2, 4: 2, 5: 3, 6: 2, 7: 2, 8: 2 },
    selfNote: cfg.selfNote || '', mgrNote: cfg.mgrNote || '',
    tasks335: genTasksFull(type, profile, OKR),
    sg: defaultSG(profile, type, OKR),
  });
  return [
    mk('hdnd', 'Nguyễn Văn An', 'Thường trực HĐND tỉnh', 'Phó Chủ tịch HĐND tỉnh', 'an.demo@thanhhoa.gov.vn', 'A', {
      digital: { 1: 4, 2: 4, 3: 4, 4: 3, 5: 4, 6: 3, 7: 3, 8: 4 },
      selfNote: 'Chủ động, hoàn thành vượt mức các nhiệm vụ trọng tâm.', mgrNote: 'Hoàn thành xuất sắc; gương mẫu, nhiều sáng kiến.',
    }),
    mk('dbqh', 'Trần Thị Bình', 'Đoàn ĐBQH tỉnh', 'Đại biểu Quốc hội hoạt động chuyên trách', 'binh.demo@thanhhoa.gov.vn', 'B', {
      deduction: 2, digital: { 1: 3, 2: 3, 3: 3, 4: 2, 5: 3, 6: 2, 7: 2, 8: 3 },
      selfNote: 'Tham gia đầy đủ kỳ họp, tích cực thảo luận, chất vấn.', mgrNote: 'Hoàn thành tốt; cần cải thiện tiến độ một số việc.',
    }),
    mk('leader', 'Lê Văn Cường', 'Ban Pháp chế HĐND tỉnh', 'Trưởng ban Pháp chế', 'cuong.demo@thanhhoa.gov.vn', 'A', {
      deduction: 5, leadScores: { d: 100, dd: 100, e: 100 }, digital: { 1: 4, 2: 3, 3: 4, 4: 3, 5: 4, 6: 3, 7: 3, 8: 4 },
      selfNote: 'Chỉ đạo, điều hành tốt công tác thẩm tra, giám sát của Ban; nghiêm túc nhận khuyết điểm về vi phạm giao thông cá nhân.',
      mgrNote: 'Hoàn thành xuất sắc nhiệm vụ lãnh đạo. Tuy nhiên trong kỳ vi phạm nồng độ cồn khi lái xe, bị Công an xử phạt (giấy phạt gửi về cơ quan) → trừ 5 điểm theo mức độ vi phạm.',
    }),
    mk('staff', 'Phạm Thị Dung', 'Văn phòng Đoàn ĐBQH và HĐND tỉnh', 'Chuyên viên Phòng Tổng hợp', 'dung.demo@thanhhoa.gov.vn', 'C', {
      digital: { 1: 2, 2: 2, 3: 2, 4: 1, 5: 2, 6: 1, 7: 2, 8: 1 },
      selfNote: 'Đã cố gắng nhưng còn một số việc chậm tiến độ.', mgrNote: 'Hoàn thành nhiệm vụ mức trung bình; cần nâng chất lượng.',
    }),
    mk('contract', 'Đỗ Văn Em', 'Văn phòng Đoàn ĐBQH và HĐND tỉnh', 'Lái xe', 'em.demo@thanhhoa.gov.vn', 'D', {
      deduction: 10, digital: { 1: 1, 2: 1, 3: 1, 4: 0, 5: 1, 6: 0, 7: 1, 8: 0 },
      selfNote: 'Phục vụ hậu cần; còn hạn chế về tiến độ.', mgrNote: 'Chưa hoàn thành; cần chấn chỉnh kỷ luật, tiến độ.',
    }),
  ];
}
// Bộ dữ liệu bản SonHa (OKR/KPI): 3 lãnh đạo Văn phòng (Chánh + 2 Phó Chánh VP) + 25 CBCCVC-LĐ
// theo docs/KPI.docx (4 phòng) = 28 người. Nhóm đối tượng (Mẫu) tự suy theo chức vụ; mỗi người
// có sẵn ~10 nhiệm vụ đã chấm theo hồ sơ (số lượng + chất lượng + tiến độ + tầm quan trọng).
function seedSonHaPeople() {
  const OKR = ['o1', 'o2', 'o3'];
  const NOTES = {
    A: { self: 'Chủ động, hoàn thành vượt mức nhiều nhiệm vụ trọng tâm được giao.', mgr: 'Hoàn thành xuất sắc nhiệm vụ; gương mẫu, có sản phẩm nổi trội.' },
    B: { self: 'Hoàn thành đầy đủ nhiệm vụ được giao, bảo đảm chất lượng, tiến độ.', mgr: 'Hoàn thành tốt nhiệm vụ.' },
    C: { self: 'Đã cố gắng hoàn thành nhiệm vụ; còn một số việc chậm tiến độ.', mgr: 'Hoàn thành nhiệm vụ; cần nâng chất lượng, tiến độ một số việc.' },
  };
  const mk = (name, department, position, profile, cfg = {}) => {
    const n = NOTES[profile] || NOTES.B;
    const p = { ...newPerson(name, sonhaTypeOf({ position })), position, department, role: 'canbo',
      email: cfg.email || '', deduction: cfg.deduction || 0,
      leadScores: cfg.leadScores || { d: 100, dd: 100, e: 100 },
      digital: cfg.digital || { 1: 3, 2: 3, 3: 2, 4: 2, 5: 3, 6: 2, 7: 2, 8: 2 },
      selfNote: cfg.selfNote || n.self, mgrNote: cfg.mgrNote || n.mgr };
    p.type = sonhaTypeOf(p);
    // Mỗi cán bộ được giao ~10 nhiệm vụ tiêu biểu trong kỳ (thực tế, không phải toàn bộ danh mục).
    p.tasks335 = genTasksFromCat(sonhaGroupsOf(p).slice(0, 10), profile, OKR);
    p.sg = defaultSG(profile, p.type, OKR);
    return p;
  };
  const VP = 'Văn phòng', CTHD = 'Phòng Công tác Hội đồng', CTQH = 'Phòng Công tác Quốc hội',
    THTT = 'Phòng Tổng hợp - Thông tin - Dân nguyện', HCTC = 'Phòng Hành chính - Tổ chức - Quản trị';
  // [Họ tên, Phòng, Chức vụ, Hồ sơ đánh giá, email?] — lãnh đạo Văn phòng + danh sách docs/KPI.docx.
  return [
    ['Trần Mạnh Long', VP, 'Chánh Văn phòng', 'A'],
    ['Hà Ngọc Sơn', VP, 'Phó Chánh Văn phòng', 'B', 'sonthkh@gmail.com'],
    ['Lê Văn Mạnh', VP, 'Phó Chánh Văn phòng', 'B'],
    ['Ngô Ngọc Quyến', HCTC, 'Phó Trưởng phòng', 'B'],
    ['Trần Thị Hiền', CTHD, 'Chuyên viên', 'B'],
    ['Lê Thị Thu Hà', THTT, 'Chuyên viên', 'A'],
    ['Đào Thùy Linh', CTHD, 'Chuyên viên', 'B'],
    ['Đinh Lê Trà My', CTHD, 'Chuyên viên', 'C'],
    ['Đỗ Tuấn Vũ', THTT, 'Phó Trưởng phòng', 'A'],
    ['Nguyễn Thị Hương Thảo', THTT, 'Chuyên viên', 'B'],
    ['Nguyễn Lương Chiến', HCTC, 'Chuyên viên', 'B'],
    ['Lê Thị Hương', HCTC, 'Chuyên viên', 'C'],
    ['Nguyễn Thị Tâm Phương', THTT, 'Chuyên viên', 'B'],
    ['Doãn Ngọc Hài', CTHD, 'Chuyên viên', 'B'],
    ['Nguyễn Tiến Khương', CTHD, 'Trưởng phòng', 'A'],
    ['Lê Thị Thu Hòa', CTQH, 'Chuyên viên', 'B'],
    ['Dương Anh Quân', CTQH, 'Phó Trưởng phòng', 'B'],
    ['Đỗ Thị Quỳnh Trang', HCTC, 'Chuyên viên', 'B'],
    ['Nguyễn Hữu Chân', HCTC, 'Lái xe', 'B'],
    ['Nguyễn Văn Từ', HCTC, 'Lái xe', 'B'],
    ['Vũ Hoàng Quang', HCTC, 'Lái xe', 'B'],
    ['Nguyễn Thái Dũng', HCTC, 'Lái xe', 'B'],
    ['Dương Bảo Châu', HCTC, 'Lái xe', 'C'],
    ['Ngô Văn Tiến', HCTC, 'Lái xe', 'B'],
    ['Nguyễn Hữu Quyết', HCTC, 'Lái xe', 'B'],
    ['Nguyễn Thị Thúy Vân', HCTC, 'Nhân viên phục vụ', 'B'],
    ['Lê Thị Thủy', HCTC, 'Nhân viên phục vụ', 'B'],
    ['Nguyễn Văn Huy', HCTC, 'Bảo vệ', 'B'],
  ].map(([name, dept, pos, profile, email]) => mk(name, dept, pos, profile, email ? { email } : {}));
}

// Bộ dữ liệu bản KIỂM ĐIỂM: 15 đồng chí diện Ban Thường vụ Tỉnh ủy quản lý tại cơ quan,
// theo danh sách docs/DU/DU.docx (2 Phó Chủ tịch HĐND tỉnh; 4 Trưởng Ban + 4 Phó Trưởng Ban;
// Phó Trưởng đoàn ĐBQH + ĐBQH chuyên trách; Chánh Văn phòng + 2 Phó Chánh Văn phòng).
// Mỗi người có sẵn person.kd (defaultKD) theo hồ sơ — đã chấm điểm Nhóm A/B + tự kiểm điểm.
function seedKiemDiemPeople() {
  const mk = (name, department, position, profile, email = '') =>
    ({ ...newPerson(name, 'leader'), position, department, role: 'canbo', email, kd: defaultKD(profile) });
  const KTNS = 'Ban Kinh tế - Ngân sách', VHXH = 'Ban Văn hóa - Xã hội', PC = 'Ban Pháp chế', DT = 'Ban Dân tộc';
  return [
    mk('Lê Tiến Lam', 'HĐND tỉnh', 'Ủy viên Ban Thường vụ Tỉnh ủy, Phó Chủ tịch Thường trực HĐND tỉnh', 'A'),
    mk('Nguyễn Quang Hải', 'HĐND tỉnh', 'Tỉnh ủy viên, Phó Chủ tịch HĐND tỉnh', 'B'),
    mk('Hoàng Anh Tuấn', KTNS, 'Tỉnh ủy viên, Trưởng Ban Kinh tế - Ngân sách HĐND tỉnh', 'B'),
    mk('Ngô Thị Hồng Hảo', VHXH, 'Tỉnh ủy viên, Trưởng Ban Văn hóa - Xã hội HĐND tỉnh', 'B'),
    mk('Nguyễn Quốc Hải', PC, 'Trưởng Ban Pháp chế HĐND tỉnh', 'B'),
    mk('Lương Tiến Thành', DT, 'Trưởng Ban Dân tộc HĐND tỉnh', 'B'),
    mk('Đỗ Ngọc Duy', KTNS, 'Phó Trưởng Ban Kinh tế - Ngân sách HĐND tỉnh', 'B'),
    mk('Lê Thị Hương', PC, 'Phó Trưởng Ban Pháp chế HĐND tỉnh', 'B'),
    mk('Nguyễn Tuấn Tưởng', VHXH, 'Phó Trưởng Ban Văn hóa - Xã hội HĐND tỉnh', 'B'),
    mk('Cầm Bá Chái', DT, 'Phó Trưởng Ban Dân tộc HĐND tỉnh', 'C'),
    mk('Lương Thị Hoa', 'Đoàn ĐBQH tỉnh', 'Tỉnh ủy viên, Phó Trưởng đoàn ĐBQH tỉnh', 'B'),
    mk('Bùi Văn Dũng', 'Đoàn ĐBQH tỉnh', 'Đại biểu Quốc hội chuyên trách tỉnh', 'B'),
    mk('Trần Mạnh Long', 'Văn phòng', 'Tỉnh ủy viên, Chánh Văn phòng Đoàn ĐBQH và HĐND tỉnh', 'A'),
    mk('Hà Ngọc Sơn', 'Văn phòng', 'Phó Chánh Văn phòng Đoàn ĐBQH và HĐND tỉnh', 'B', 'sonthkh@gmail.com'),
    mk('Lê Văn Mạnh', 'Văn phòng', 'Phó Chánh Văn phòng Đoàn ĐBQH và HĐND tỉnh', 'B'),
  ];
}

// Đẩy bộ đếm id vượt qua dữ liệu đã nạp (dùng chung cho cả phiên bản mới)
function bumpIds(people) {
  const ppl = people || [];
  pid = Math.max(pid, 0, ...ppl.map((p) => p.id || 0)) + 1;
  t335Id = Math.max(t335Id, 0, ...ppl.flatMap((p) => (p.tasks335 || []).map((t) => t.id || 0))) + 1;
  trkId = Math.max(trkId, 0, ...ppl.flatMap((p) => (p.trackings || []).map((t) => t.id || 0))) + 1;
}

// Chuẩn hóa kỳ: tháng 1–12, năm 2020–2100 (tránh nạp kỳ rác khi gõ nhầm).
function clampPeriod(p) {
  const m = Math.max(1, Math.min(12, Math.round(Number(p?.month) || 1)));
  const y = Math.max(2020, Math.min(2100, Math.round(Number(p?.year) || new Date().getFullYear())));
  return { month: String(m), year: String(y) };
}

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

export default function App({ version = 'classic', onPickVersion, onHome, initialTab, initialLogin, moduleTitle } = {}) {
  setCriteriaVersion(version); // chọn bộ tiêu chí (Cổ điển / Cải tiến / Singapore / SonHa) trước mọi tính toán & render
  setBaseCatalog(version);     // chọn danh mục Nhóm II nền (SonHa dùng SONHA_CATALOG)
  const isImproved = version === 'improved';
  const isSG = version === 'sg';
  const isSonHa = version === 'sonha';
  const isKD = version === 'kiemdiem'; // bản Kiểm điểm — mô hình riêng (computeKD), tách như Singapore
  const isClassic = !isImproved && !isSG && !isKD; // SonHa hưởng cách render Nhóm II kiểu Cổ điển (renderTask335Row)
  const QUARTER_OF = (m) => Math.min(4, Math.max(1, Math.ceil((Number(m) || 1) / 3)));
  const ROMAN = ['I', 'II', 'III', 'IV'];
  const th = VERSION_THEME[version] || VERSION_THEME.classic; // theme màu theo phiên bản
  const [tab, setTab] = useState(initialTab || 'dash'); // tab mở sẵn khi vào từ Trang chủ (vd: 'hr', 'guide')
  const [period, setPeriod] = useState({ month: String(new Date().getMonth() + 1), year: String(new Date().getFullYear()) });
  const quarterLabel = `Quý ${ROMAN[QUARTER_OF(period.month) - 1]}/${period.year}`; // nhãn quý (bản Kiểm điểm)
  const [trackingDate, setTrackingDate] = useState(new Date().toISOString().split('T')[0]);
  const [unit] = useState('Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa');
  const [objectives, setObjectives] = useState([
    { id: 'o1', title: 'Nâng cao chất lượng tham mưu xây dựng, ban hành nghị quyết HĐND tỉnh', source: 'NQ 66-NQ/TW', krs: [
      { id: 'kr1a', text: 'Tỷ lệ báo cáo thẩm tra nộp đúng hạn (chậm nhất 15 ngày trước khai mạc)', target: 100, current: 90, unit: '%' },
      { id: 'kr1b', text: 'Số nghị quyết được thông qua không phải chỉnh sửa lớn về thể thức/nội dung', target: 12, current: 9, unit: 'NQ' },
    ] },
    { id: 'o2', title: 'Đẩy mạnh chuyển đổi số, ứng dụng AI trong công tác Văn phòng', source: 'NQ 57-NQ/TW', krs: [
      { id: 'kr2a', text: 'Tỷ lệ hồ sơ, văn bản xử lý trên môi trường điện tử', target: 100, current: 75, unit: '%' },
      { id: 'kr2b', text: 'Số cán bộ thành thạo công cụ AI hỗ trợ soạn thảo, tổng hợp', target: 30, current: 18, unit: 'người' },
    ] },
    { id: 'o3', title: 'Phục vụ hiệu quả kỳ họp và hoạt động giám sát của HĐND tỉnh', source: 'Chương trình công tác', krs: [
      { id: 'kr3a', text: 'Tỷ lệ kiến nghị cử tri được theo dõi, đôn đốc giải quyết đúng hạn', target: 100, current: 82, unit: '%' },
      { id: 'kr3b', text: 'Số cuộc giám sát chuyên đề hoàn thành theo kế hoạch năm', target: 8, current: 5, unit: 'cuộc' },
    ] },
  ]);
  const [people, setPeople] = useState(() => seedDemoPeople(version));
  const [curId, setCurId] = useState(people[0].id);
  const [open, setOpen] = useState(null);
  const [cloud, setCloud] = useState({ ready: false, saving: false });
  const [session, setSession] = useState(undefined); // undefined = đang kiểm tra; 'guest' = khách mặc định
  const sessionRef = useRef(undefined);               // bản ref của session để dùng trong hàm async
  const guestSeededRef = useRef(false);               // đã nạp dữ liệu mẫu cho khách chưa
  const [wantLogin, setWantLogin] = useState(!!initialLogin);  // true khi người dùng chủ động bấm Đăng nhập (kể cả từ Trang chủ) (quản trị)
  // Cấu hình hiển thị/đổi tên phiên bản (quản trị điều khiển): cache local + nạp bản mới từ Supabase.
  const [versionCfg, setVersionCfg] = useState(readVersionCfg);
  const [verCfgOpen, setVerCfgOpen] = useState(false); // mở bảng quản lý phiên bản (quản trị)
  useEffect(() => { let alive = true; fetchVersionCfg().then((c) => { if (alive) setVersionCfg(c); }); return () => { alive = false; }; }, []);
  // Lượt truy cập trang web (đếm toàn cục qua Supabase; null = chưa cấu hình -> ẩn)
  const [visits, setVisits] = useState(null);
  useEffect(() => { let alive = true; countVisit().then((n) => { if (alive && n != null) setVisits(n); }); return () => { alive = false; }; }, []);
  // Quản lý cán bộ (hồ sơ 2C + nhắc việc) — dữ liệu TOÀN CỤC, không theo kỳ đánh giá.
  const [hrData, setHrData] = useState(EMPTY_HR);
  const [hrSaving, setHrSaving] = useState(false);
  const hrLoaded = useRef(false);
  const peopleRef = useRef([]);   // danh sách cán bộ hiện hành (nguồn đồng bộ cho hồ sơ)
  const loaded = useRef(false);
  const loadingRef = useRef(false);     // đang nạp kỳ -> tạm khóa autosave
  const serverTsRef = useRef(null);     // updated_at đã nạp về (khóa lạc quan)
  const [conflict, setConflict] = useState(false);
  const [seedFrom, setSeedFrom] = useState(null); // kỳ gần nhất có dữ liệu để sao chép
  const [trends, setTrends] = useState([]);
  const [catalog, setCatalog] = useState({ custom: [], hidden: [] }); // danh mục công việc do quản trị tùy chỉnh (theo kỳ)
  const [instKpi, setInstKpi] = useState(SG_INST_KPI_DEFAULT); // KPI thiết chế (Tầng A, bản Singapore) — lưu theo kỳ
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
      ppl.forEach((p) => { const c = computePerson(p); d[c.grade]++; sum += c.totalMgr; });
      return { year, month, dist: d, avg: ppl.length ? sum / ppl.length : 0, count: ppl.length };
    }).sort((a, b) => (Number(a.year) - Number(b.year)) || (Number(a.month) - Number(b.month))));
  };

  const loadPeriod = async (rawP) => {
    const p = clampPeriod(rawP);
    if (p.month !== rawP?.month || p.year !== rawP?.year) setPeriod(p); // sửa lại ô nhập nếu gõ sai
    loadingRef.current = true;
    setConflict(false); setSeedFrom(null);
    // Khách & quản trị cục bộ: luôn hiển thị sẵn danh sách mẫu, không nạp dữ liệu máy chủ.
    if (isLocalSession(sessionRef.current)) {
      loadDemoPeople(); guestSeededRef.current = true;
      setCloud({ ready: !!supabase, saving: false }); loaded.current = true; loadingRef.current = false; return;
    }
    const res = await loadState(p);
    // Trong lúc await, phiên có thể vừa được xác định là cục bộ -> ưu tiên dữ liệu mẫu, bỏ qua dữ liệu máy chủ.
    if (isLocalSession(sessionRef.current)) {
      loadDemoPeople(); guestSeededRef.current = true;
      setCloud({ ready: !!supabase, saving: false }); loaded.current = true; loadingRef.current = false; return;
    }
    serverTsRef.current = res.serverTs;
    if (res.state) {
      const ppl = res.state.people || [];
      setPeople(ppl); setCurId(ppl[0]?.id ?? null); setObjectives(res.state.objectives || []);
      setCatalog(res.state.catalog || { custom: [], hidden: [] });
      setInstKpi(Array.isArray(res.state.instKpi) && res.state.instKpi.length ? res.state.instKpi : SG_INST_KPI_DEFAULT);
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

  // Nạp cán bộ mẫu (demo) theo ĐÚNG phiên bản đang chọn: bản SonHa = 20 người, các bản khác = 5 người.
  const loadDemoPeople = () => {
    const demo = seedDemoPeople(version);
    setSeedFrom(null);
    setPeople(demo); setCurId(demo[0]?.id ?? null);
    bumpCounters(demo);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadPeriod(period); refreshTrends(); }, []);

  // Khách (demo) đổi phiên bản giữa phiên -> nạp lại bộ dữ liệu mẫu tương ứng (bản SonHa: 20 người).
  const versionRef = useRef(version);
  useEffect(() => {
    if (versionRef.current === version) return; // bỏ qua lần mount đầu
    versionRef.current = version;
    if (isLocalSession(sessionRef.current)) loadDemoPeople();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version]);

  // Xác thực: nếu chưa cấu hình máy chủ -> chạy cục bộ (coi như quản trị)
  useEffect(() => {
    if (!supabase) { setSession('local'); return; }
    let unsub = () => {};
    (async () => {
      // Mặc định vào thẳng bằng tài khoản KHÁCH (xem/demo) nếu chưa đăng nhập thật
      setSession((await getSession()) || 'guest');
      // Đăng xuất/hết phiên: giữ nguyên chế độ quản trị cục bộ nếu đang dùng, ngược lại về khách.
      unsub = onAuthChange((ns) => setSession(ns || (sessionRef.current === 'localadmin' ? 'localadmin' : 'guest')));
    })();
    return () => unsub();
  }, []);

  // Đồng bộ sessionRef + tự nạp 5 cán bộ mẫu khi vào bằng tài khoản khách (chỉ một lần/phiên khách).
  useEffect(() => {
    sessionRef.current = session;
    if (isLocalSession(session) && !guestSeededRef.current) { guestSeededRef.current = true; loadDemoPeople(); }
    if (session && !isLocalSession(session)) guestSeededRef.current = false; // đăng nhập thật -> cho phép nạp lại nếu sau này quay về khách
  }, [session]);

  useEffect(() => {
    if (!loaded.current || loadingRef.current) return;
    if (isLocalSession(session)) return; // khách / quản trị cục bộ -> không ghi lên máy chủ
    setCloud((c) => ({ ...c, saving: true }));
    const t = setTimeout(async () => {
      const res = await saveState(period, { people, objectives, catalog, instKpi, period, _summary: summaryRef.current }, serverTsRef.current);
      if (res.ok) { serverTsRef.current = res.serverTs; setConflict(false); }
      else if (res.conflict) setConflict(true);
      setCloud((c) => ({ ...c, saving: false }));
    }, 900);
    return () => clearTimeout(t);
  }, [people, objectives, catalog, instKpi, period, session]);

  const changePeriod = (np) => { setPeriod(np); loadPeriod(np); };

  const copyFromPeriod = async (src) => {
    const res = await loadState({ year: src.year, month: src.month });
    if (!res.state) return;
    const ppl = (res.state.people || []).map((p) => ({ ...p, id: pid++, selfScores: {}, mgrScores: {}, deduction: 0, disciplined: false, tasks335: [newTask335()], leadScores: { d: 100, dd: 100, e: 100 }, selfNote: '', mgrNote: '', trackings: [], approved: false, approvedBy: '', approvedRole: '', approvedAt: '' }));
    setObjectives(res.state.objectives || []);
    setCatalog(res.state.catalog || { custom: [], hidden: [] }); // mang theo danh mục tùy chỉnh sang kỳ mới
    setInstKpi(Array.isArray(res.state.instKpi) && res.state.instKpi.length ? res.state.instKpi : SG_INST_KPI_DEFAULT);
    setPeople(ppl); setCurId(ppl[0]?.id ?? null); setSeedFrom(null);
  };

  const handleManualSave = async () => {
    if (isLocalSession(session)) return; // khách / quản trị cục bộ -> không ghi lên máy chủ
    setCloud((c) => ({ ...c, saving: true }));
    const res = await saveState(period, { people, objectives, catalog, instKpi, period, _summary: summaryRef.current }, serverTsRef.current);
    if (res.ok) { serverTsRef.current = res.serverTs; setConflict(false); }
    else if (res.conflict) setConflict(true);
    setCloud((c) => ({ ...c, saving: false }));
    // Không tự nạp lại toàn bộ kỳ (loadAllPeriods rất nặng) sau mỗi lần lưu;
    // người dùng bấm "Làm mới" ở tab Tổng quan khi cần cập nhật biểu đồ xu hướng.
  };

  const cur = people.find((p) => p.id === curId) || people[0] || null;
  const upPerson = (id, patch) => setPeople((ps) => ps.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  // Các trường ảnh hưởng kết quả chấm điểm — khi đổi thì tự GỠ phê duyệt cũ (tránh "đã duyệt" trên dữ liệu đã sửa).
  const SCORING_KEYS = ['selfScores', 'mgrScores', 'tasks335', 'leadScores', 'deduction', 'disciplined', 'kd', 'sg'];
  const upCur = (patch) => {
    const touchesScore = Object.keys(patch).some((k) => SCORING_KEYS.includes(k));
    const p2 = (touchesScore && cur?.approved && !('approved' in patch)) ? { ...patch, approved: false, approvedBy: '', approvedRole: '', approvedAt: '' } : patch;
    upPerson(curId, p2);
  };
  const upTask335 = (taskId, patch) => upCur({ tasks335: (cur.tasks335 || []).map((t) => (t.id === taskId ? { ...t, ...patch } : t)) });
  const upTracking = (trkId, patch) => upCur({ trackings: (cur.trackings || []).map((t) => (t.id === trkId ? { ...t, ...patch } : t)) });
  const upLead = (key, v) => upCur({ leadScores: { ...(cur.leadScores || {}), [key]: v } }); // d/đ/e cho lãnh đạo

  setCatalogRegistry(catalog); // đồng bộ registry danh mục trước khi tính điểm/đổ dropdown
  // Bản Singapore dùng mô hình riêng (computeSG); 2 bản còn lại dùng khung 30/70 (computePerson).
  const scoreOf = isSG ? computeSG : isKD ? computeKD : computePerson;
  const computed = useMemo(() => people.map((p) => ({ p, c: scoreOf(p) })), [people, catalog, version]);
  const curC = cur ? (computed.find((x) => x.p.id === curId)?.c || scoreOf(cur)) : null;
  const dist = useMemo(() => { const d = { A: 0, B: 0, C: 0, D: 0, E: 0 }; computed.forEach(({ c }) => { d[c.grade] = (d[c.grade] || 0) + 1; }); return d; }, [computed]);
  // Bảng điểm ĐÃ TÍNH — ghi kèm mỗi lần lưu (khóa `_summary`) để các dịch vụ phía máy chủ
  // (bot chat Telegram/Zalo trong thư mục api/) đọc được kết quả mà không phải dựng lại
  // toàn bộ công thức chấm điểm của giao diện. Không ảnh hưởng việc hiển thị.
  const summaryRef = useRef(null);
  summaryRef.current = {
    ts: Date.now(), version, unit,
    people: computed.map(({ p, c }) => ({
      name: p.name || '', position: p.position || '', department: p.department || '', type: p.type,
      self: Math.round((c.totalSelf || 0) * 10) / 10,
      mgr: Math.round((c.totalMgr || 0) * 10) / 10,
      grade: c.grade,
      gradeLabel: (isSG ? sgGradeInfo(c.grade) : isKD ? kdGradeInfo(c.grade) : gradeClass(c.grade))?.name || c.grade,
      approved: !!p.approved,
    })),
  };
  const upCurSG = (patch) => upCur({ sg: { ...(cur?.sg || {}), ...patch } });
  const upCurKD = (patch) => upCur({ kd: { ...(cur?.kd || {}), ...patch } }); // qua upCur để tự gỡ phê duyệt khi sửa điểm
  // Tab "Danh mục" không áp dụng cho bản Singapore (không dùng Nhóm II) -> tự chuyển về Tổng quan.
  useEffect(() => { if (isSG && tab === 'catalog') setTab('dash'); }, [isSG, tab]);
  // SonHa chỉ có 3 module — nếu đang ở tab khác (Năng lực số/Theo dõi CV/Danh mục/Quản trị) thì đưa về Tổng quan.
  useEffect(() => { if ((isSonHa || isKD) && !['dash', 'eval', 'guide', 'hr'].includes(tab)) setTab('dash'); }, [isSonHa, isKD, tab]);
  // Tab "Quản trị" đã ẩn ở mọi phiên bản — nếu đang ở đó thì đưa về Tổng quan.
  useEffect(() => { if (tab === 'admin') setTab('dash'); }, [tab]);
  const avg = computed.length ? computed.reduce((s, x) => s + x.c.totalMgr, 0) / computed.length : 0;
  const overCap = dist.A > Math.floor(dist.B * 0.2);
  const objProgress = (oid) => {
    const ts = people.flatMap((p) => p.tasks335 || []).filter((t) => t.objId === oid && t.catalogId);
    if (!ts.length) return null;
    return ts.reduce((s, t) => s + task335Score(t), 0) / ts.length;
  };
  // ===== OKR: Key Results cấp Mục tiêu (độc lập với điểm cá nhân — chỉ theo dõi tiến độ cơ quan) =====
  const krPct = (kr) => { const tg = Number(kr.target) || 0, cu = Number(kr.current) || 0; if (tg <= 0) return 0; return Math.max(0, Math.min(100, (cu / tg) * 100)); };
  const objKrGrade = (o) => { const ks = (o.krs || []).filter((k) => (k.text || '').trim() || Number(k.target) > 0); if (!ks.length) return null; return ks.reduce((s, k) => s + krPct(k), 0) / ks.length; };
  const upObjective = (id, patch) => setObjectives((os) => os.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  const addKr = (oid) => setObjectives((os) => os.map((o) => (o.id === oid ? { ...o, krs: [...(o.krs || []), { id: 'kr' + (krSeq++), text: '', target: 100, current: 0, unit: '%' }] } : o)));
  const upKr = (oid, kid, patch) => setObjectives((os) => os.map((o) => (o.id === oid ? { ...o, krs: (o.krs || []).map((k) => (k.id === kid ? { ...k, ...patch } : k)) } : o)));
  const delKr = (oid, kid) => setObjectives((os) => os.map((o) => (o.id === oid ? { ...o, krs: (o.krs || []).filter((k) => k.id !== kid) } : o)));
  // Vùng tốt của OKR khát vọng là 60–70% (Google) — màu theo mức đạt.
  const krTone = (p) => (p >= 70 ? 'emerald' : p >= 40 ? 'amber' : 'rose');

  const tabs = [
    { id: 'dash', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'eval', label: 'Đánh giá', icon: BarChart3 },
    { id: 'digital', label: 'Năng lực số', icon: Cpu },
    { id: 'tracking', label: 'Theo dõi CV', icon: ClipboardList },
    { id: 'guide', label: 'Hỗ trợ', icon: BookOpen },
  ].filter((t) => (!isSonHa && !isKD) || ['dash', 'eval', 'guide'].includes(t.id)); // SonHa & Kiểm điểm chỉ gồm 3 module
  const cfg = cur ? CRITERIA[cur.type] : null;
  const result = isSG ? sgGradeInfo(curC?.grade) : isKD ? kdGradeInfo(curC?.grade) : (curC ? gradeClass(curC.grade) : classify(0));
  const minLv = cur ? MIN_DIGITAL[cur.type] : 0;
  const digPassed = cur ? DIGITAL.filter((d) => (cur.digital[d.id] || 0) >= minLv).length : 0;

  // Lazy-load: chỉ tải xlsx/docx khi người dùng bấm xuất (giảm dung lượng tải lần đầu)
  const doExcel = async () => {
    const { exportExcel1A } = await import('./lib/exporters');
    exportExcel1A(
      computed.map(({ p, c }) => ({ name: p.name || '(Chưa tên)', position: p.position || CRITERIA[p.type].label, self: c.totalSelf.toFixed(1), mgr: c.totalMgr.toFixed(1), cls: c.grade })),
      period, unit
    );
  };
  const doWord = async () => {
    const { exportWordPhieu } = await import('./lib/exporters');
    const cfgW = CRITERIA[cur.type];
    const sS = cur.selfScores || {}, mS = cur.mgrScores || {};
    // Chi tiết Nhóm I: từng nhóm tiêu chí + từng mục (điểm Tự ĐG / Cấp duyệt). Mặc định chưa nhập = điểm tối đa.
    const nhomICriteria = (cfgW?.groups || []).map((g) => ({
      groupTitle: g.title,
      groupMax: g.max,
      items: g.items.map((it) => { const self = clamp(sS[it.id] ?? it.max, 0, it.max); return { id: it.id, text: it.text, max: it.max, self, mgr: clamp(mS[it.id] ?? self, 0, it.max) }; }),
    }));
    // Chi tiết Nhóm II: từng nhiệm vụ kèm tên danh mục, tỷ lệ hoàn thành, điểm %.
    // Bản SonHa (simpleMode): in Số lượng + Chất lượng + Tiến độ + Tầm quan trọng + Mức độ hoàn thành (suy ra).
    const tasks = (cur.tasks335 || []).map((t) => {
      const cat = t.catalogId ? findCatalogItem(t.catalogId) : null;
      // Phiếu chính thức dùng số liệu CẤP DUYỆT (mgr, mặc định kế thừa Tự ĐG khi chưa sửa).
      const as = Number(t.assigned) || 0, cp = (t.mgrCompleted ?? t.completed) || 0;
      const obj = t.objId ? objectives.find((o) => o.id === t.objId) : null;
      const base = { catalogName: cat ? cat.name : '', note: t.note || '', kr: t.kr || '', objTitle: obj ? obj.title : '', assigned: t.assigned, completed: cp, qualityIssues: (t.mgrQualityIssues ?? t.qualityIssues) || 0, delays: (t.mgrDelays ?? t.delays) || 0, ratioPct: as > 0 ? (cp / as) * 100 : 0, scorePct: t.catalogId ? task335Score(t) : 0 };
      if (isSonHa) return { ...base, clLabel: clOf(tClKey(t, 'mgr')).short, tdLabel: tdOf(tTdKey(t, 'mgr')).short, tamLabel: tamOf(t.tam).short, mucMgr: mucOf(tMuc(t, 'mgr')).short };
      return base;
    });
    exportWordPhieu({
      simpleMode: isSonHa,
      unit, mau: cfgW?.mau, name: cur.name, position: cur.position, department: cur.department,
      typeLabel: cfgW?.label, month: period.month, year: period.year,
      nhomICriteria, nhomI: curC.nmgr, nhomISelf: curC.nself,
      tasks, leader: curC.leaderFormula, leadScores: curC.leaderFormula ? { d: curC.k.d ?? 100, dd: curC.k.dd ?? 100, e: curC.k.e ?? 100 } : null,
      kpi: curC.k.val.toFixed(1), a: curC.k.a.toFixed(1), b: curC.k.b.toFixed(1), c: curC.k.c.toFixed(1),
      nhomII: curC.nhomII.toFixed(2), deduction: Number(cur.deduction || 0), disciplined: !!cur.disciplined,
      total: curC.totalMgr, totalSelf: curC.totalSelf, cls: result.code, clsName: result.name, gradeReasons: curC.gradeReasons || [],
      selfNote: cur.selfNote, mgrNote: cur.mgrNote,
      approved: !!cur.approved, approvedBy: cur.approvedBy, approvedRole: cur.approvedRole, approvedAt: cur.approvedAt,
    });
  };
  // Xuất phiếu Word theo bố cục Singapore (Work Review · AIM · ISE · Grade · CEP · Development).
  const doSGWord = async () => {
    const { exportSGAppraisal } = await import('./lib/exporters');
    const sg = cur.sg || {};
    const objTitle = (oid) => (objectives.find((o) => o.id === oid) || {}).title || '';
    exportSGAppraisal({
      unit, name: cur.name, position: cur.position, department: cur.department,
      typeLabel: CRITERIA[cur.type]?.label, month: period.month, year: period.year,
      goals: (sg.goals || []).map((g) => ({ title: g.title, obj: objTitle(g.objId), kr: g.kr, current: g.current, target: g.target, unit2: g.unit, weight: g.weight, rating: g.rating })),
      comp: sg.comp || {}, values: sg.values || {},
      perfPct: curC.perfPct, compPct: curC.compPct, valPct: curC.valPct, overall: curC.overall,
      grade: result.code, gradeName: result.name, autoGrade: curC.autoGrade,
      cep: sg.cep || '', strengths: sg.strengths || '', development: sg.development || '', devActions: sg.devActions || '',
      selfComment: sg.selfComment || '', supComment: sg.supComment || '',
    });
  };
  // Xuất Bản tự đánh giá xếp loại quý của cá nhân (Phụ lục 3A) — bản Kiểm điểm.
  const doKDWord = async () => {
    const { exportKiemDiemCaNhan } = await import('./lib/exporters');
    const kd = cur.kd || {};
    exportKiemDiemCaNhan({
      unit, name: cur.name, position: cur.position, department: cur.department,
      quarter: ROMAN[QUARTER_OF(period.month) - 1], year: period.year,
      nhomA: curC.nhomA, nhomB: curC.nhomB, total: curC.total,
      nhomA_groups: kdNhomABreakdown(kd),
      trucs: KD_TRUC.map((t) => { const d = (kd.truc || {})[t.id] || {}; const kpi = curC.kpiByTruc[t.id] || 0; const done = trucTasks(d).filter((x) => x && x.muc); const ketqua = done.map((x) => `${x.name || '(chưa đặt tên)'} — ${mucOf(x.muc).short}`).join('; '); return { code: t.code, name: t.name, max: t.max, indicators: t.indicators || [], kpi, diem: kpi / 100 * t.max, muctieu: d.note || '', ketqua }; }),
      selfGradeName: kd.selfGrade ? kdGradeInfo(kd.selfGrade).name : '', gradeName: result.name, autoGradeName: kdGradeInfo(curC.autoGrade).name,
      exemptNote: kd.exemptNote || '', selfNote: kd.selfNote || '', mgrNote: kd.mgrNote || '',
      uudiem: kd.uudiem || '', hanche: kd.hanche || '', phuonghuong: kd.phuonghuong || '',
      disciplined: !!kd.disciplined, gradeReasons: curC.gradeReasons || [],
    });
  };
  // Xuất Bảng tổng hợp kết quả & đề xuất xếp loại quý của tập thể (Phụ lục 4) — bản Kiểm điểm.
  const doKDAgg = async () => {
    const { exportKiemDiemTongHop } = await import('./lib/exporters');
    exportKiemDiemTongHop({
      unit, quarter: ROMAN[QUARTER_OF(period.month) - 1], year: period.year,
      rows: [...computed].sort((a, b) => b.c.total - a.c.total).map(({ p, c }, i) => {
        const isTop = c.grade === 'HTXS' || c.grade === 'KHT';
        const reason = isTop ? [`Tổng điểm ${c.total.toFixed(1)}/100`, ...(c.gradeReasons || [])].join('. ') : '';
        return {
          stt: i + 1, name: p.name,
          posUnit: [p.position, p.department].filter(Boolean).join(' — '),
          selfGradeName: c.selfGrade ? kdGradeInfo(c.selfGrade).name : kdGradeInfo(c.autoGrade).name,
          mgrGradeName: kdGradeInfo(c.grade).name, reason, canboNote: '',
        };
      }),
    });
  };
  const doExportTracking = async () => {
    const { exportTrackingPDF } = await import('./lib/exporters');
    exportTrackingPDF(people, getWeekTitle(new Date(trackingDate)), unit, period);
  };
  const doExportGuide = async () => {
    const { exportGuidePDF } = await import('./lib/exporters');
    exportGuidePDF(unit, catalogForGuide());
  };
  // Module Quản trị: xuất PDF tài liệu kỹ thuật/vận hành + phương pháp tính OKR/KPI.
  const doExportSystemDoc = async () => {
    const { exportSystemTechPDF } = await import('./lib/exporters');
    exportSystemTechPDF(version);
  };
  const doExportOKRMethod = async () => {
    const { exportOKRMethodPDF } = await import('./lib/exporters');
    exportOKRMethodPDF(unit, version);
  };

  // Phê duyệt / bỏ phê duyệt kết quả đánh giá của cán bộ đang chọn (chỉ cấp có thẩm quyền).
  const toggleApprove = () => {
    if (!cur) return;
    if (cur.approved) { upCur({ approved: false, approvedBy: '', approvedRole: '', approvedAt: '' }); return; }
    const d = new Date();
    const at = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    const by = (myPerson?.name) || (session?.user?.user_metadata?.full_name) || myEmail || 'Cấp có thẩm quyền';
    upCur({ approved: true, approvedBy: by, approvedRole: ROLE_LABEL[role] || '', approvedAt: at });
  };
  // Phê duyệt (nếu chưa) rồi xuất phiếu Word đầy đủ trong một thao tác.
  const doApproveAndWord = async () => {
    if (cur && !cur.approved) toggleApprove();
    await doWord();
  };

  // Đồng bộ "Bảng kiểm đếm" từ Google Sheet (qua proxy /api/kiemdem) -> nạp thành dòng theo dõi có thể sửa.
  // Khớp cán bộ theo tên; idempotent: chỉ thay nhóm dòng có cờ fromSheet, giữ nguyên dòng nhập tay.
  // Link nguồn (sheetUrl) do máy chủ trả về -> Sheet ID không nằm trong mã/bundle công khai.
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
      setSheetSync({ at: data.fetchedAt || new Date().toISOString(), url: data.sheetUrl || '', busy: false });
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
  // Quản trị CỤC BỘ: đăng nhập bằng admin/Admin123 khi tài khoản chưa được tạo trên Supabase.
  // Toàn quyền thao tác nhưng KHÔNG có phiên Supabase → RLS chặn ghi, dữ liệu chỉ nằm trên máy này.
  const isLocalAdmin = session === 'localadmin';
  const readOnly = isGuest;                       // khóa quản trị, lưu trữ, Năng lực số & Theo dõi CV cho khách
  const role = isGuest ? 'khach' : (isLocalAdmin || !supabase ? 'quantri' : (isBootstrapAdmin ? 'quantri' : (myPerson?.role || 'canbo')));
  const isAdmin = role === 'quantri';
  const canManage = isAdmin && !readOnly; // thêm/xóa cán bộ, sửa mục tiêu OKR, đặt vai trò (khách KHÔNG có)
  // Khách (dùng thử) ĐƯỢC chấm điểm Nhóm I/II để xem kết quả tính toán — chỉ lưu tạm trên trình duyệt, không lưu DB.
  const canEditMgrOf = (p) => isGuest || isAdmin || (role === 'truongphong' && !!myDept && p?.department === myDept);
  const canEditSelfOf = (p) => isGuest || isAdmin || (!!myEmail && !!p?.email && p.email.toLowerCase() === myEmail.toLowerCase());
  const selfEditable = cur ? canEditSelfOf(cur) : false;
  const mgrEditable = cur ? canEditMgrOf(cur) : false;
  const taskEditable = selfEditable || mgrEditable;

  // ---- Quản lý cán bộ: nạp hồ sơ khi Quản trị mở module (dữ liệu toàn cục, không theo kỳ) ----
  // Danh sách người KHÔNG nhập rời và KHÔNG nạp mẫu: luôn ĐỒNG BỘ từ danh sách cán bộ
  // đang quản lý ở các module khác (tab Đánh giá). Hồ sơ 2C đã khai được giữ nguyên.
  useEffect(() => {
    if (tab !== 'hr' || !isAdmin || hrLoaded.current) return;
    hrLoaded.current = true;
    const apply = (d) => setHrData({ ...d, staff: syncStaffFromPeople(d.staff, peopleRef.current).staff });
    apply(readHR());
    if (!isLocalSession(session)) fetchHR().then(apply).catch(() => { /* giữ bản cache */ });
  }, [tab, isAdmin, session]);
  // Danh sách cán bộ đổi (thêm/xóa/đổi chức vụ ở tab Đánh giá) -> cập nhật ngay vào hồ sơ.
  useEffect(() => {
    peopleRef.current = people;
    if (tab !== 'hr' || !isAdmin || !hrLoaded.current) return;
    setHrData((d) => {
      const r = syncStaffFromPeople(d.staff, people);
      return (r.added || r.updated || r.detached) ? { ...d, staff: r.staff } : d;
    });
  }, [tab, isAdmin, people]);
  const patchHR = (patch) => setHrData((d) => ({ ...d, ...patch }));
  const doSaveHR = async () => {
    if (!canManage) return;
    setHrSaving(true);
    const r = await saveHR(hrData);
    setHrSaving(false);
    alert(r.ok ? 'Đã lưu hồ sơ cán bộ lên máy chủ.'
      : isLocalAdmin ? 'Đang ở chế độ QUẢN TRỊ CỤC BỘ (tài khoản admin chưa được tạo trên máy chủ) — hồ sơ đã lưu trên trình duyệt này, chưa đồng bộ lên máy chủ.'
        : 'Chưa lưu được lên máy chủ (kiểm tra kết nối Supabase hoặc quyền truy cập). Dữ liệu vẫn được giữ trên trình duyệt này.');
  };
  const doExport2C = async (s) => {
    const { exportLyLich2C } = await import('./lib/export2C');
    await exportLyLich2C(s, unit);
  };

  // ---- Hiển thị phiên bản theo cấu hình quản trị (ẩn/hiện + đổi tên) ----
  const vName = (id) => (versionCfg.names || {})[id] || VERSION_NAME(id);
  const shownVersions = VERSIONS.filter((v) => isAdmin || !versionCfg.hidden.includes(v.id));
  // Người dùng thường/khách đang đứng ở phiên bản bị ẩn -> tự chuyển về phiên bản hiển thị đầu tiên.
  useEffect(() => {
    if (!isAdmin && versionCfg.hidden.includes(version) && onPickVersion) {
      const first = VERSIONS.find((v) => !versionCfg.hidden.includes(v.id));
      onPickVersion(first ? first.id : 'sonha');
    }
  }, [isAdmin, version, versionCfg, onPickVersion]);
  const updateVersionCfg = (next) => { setVersionCfg(next); saveVersionCfg(next); };
  const toggleVersionHidden = (id) => {
    const hid = versionCfg.hidden.includes(id);
    const hidden = hid ? versionCfg.hidden.filter((x) => x !== id) : [...versionCfg.hidden, id];
    if (hidden.length >= VERSIONS.length) return; // không cho ẩn TẤT CẢ phiên bản
    updateVersionCfg({ ...versionCfg, hidden });
  };
  // Đổi tên hiển thị: gõ chỉ cập nhật state; commit=true (khi rời ô) mới lưu Supabase.
  const renameVersion = (id, name, commit) => {
    setVersionCfg((c) => {
      const names = { ...(c.names || {}) };
      if (name && name.trim()) names[id] = name; else delete names[id];
      const next = { ...c, names };
      if (commit) saveVersionCfg(next);
      return next;
    });
  };

  // Render 1 dòng nhiệm vụ Nhóm II (dùng cho cả danh sách phẳng — Cổ điển, và gom theo Mục tiêu — Cải tiến/Singapore).
  // Bản SonHa: chấm theo 3 tiêu chí khách quan (Số lượng + Chất lượng + Tiến độ, cột Tự ĐG/Cấp duyệt) + Tầm quan trọng → suy ra Mức độ hoàn thành.
  const renderTask335Row = (t, i) => {
    if (isSonHa) {
      const rSelf = shTaskResult(t, 'self'), rMgr = shTaskResult(t, 'mgr');
      const mSelf = mucOf(rSelf.level), mMgr = mucOf(rMgr.level);
      const sc = rMgr.pct, scSelf = rSelf.pct; const st = statusOf(sc);
      const as = Math.max(1, Number(t.assigned) || 1);
      const clSelf = tClKey(t, 'self'), clMgr = tClKey(t, 'mgr');
      const tdSelf = tTdKey(t, 'self'), tdMgr = tTdKey(t, 'mgr');
      const selSelf = 'w-full bg-slate-50 border border-slate-200 rounded px-0.5 py-1 text-[11px] text-slate-600 outline-none focus:border-slate-400 disabled:opacity-50';
      const selMgr = 'w-full bg-emerald-50 border border-emerald-200 rounded px-0.5 py-1 text-[11px] font-bold text-emerald-700 outline-none focus:border-emerald-400 disabled:opacity-50';
      return (<div key={t.id} className={`border rounded-xl p-3 ${st.soft} border-slate-200`}>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className={`shrink-0 w-2.5 h-2.5 rounded-full ${st.dot}`} title={st.label} />
          <span className="shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">{i + 1}</span>
          <select value={t.catalogId} disabled={!taskEditable} onChange={(e) => upTask335(t.id, { catalogId: e.target.value })} className={`flex-1 min-w-0 bg-white border rounded-lg px-2 py-1.5 text-xs text-slate-700 font-medium outline-none focus:border-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed ${t.catalogId ? 'border-slate-200' : 'border-amber-300 bg-amber-50'}`}>
            <option value="">— Chọn công việc từ danh mục —</option>
            {sonhaGroupsOf(cur).map((c) => (<option key={c.id} value={c.id}>[{c.id}] {c.name}</option>))}
          </select>
          {t.catalogId && rMgr.exceed && <span className="shrink-0 text-[10px] font-extrabold text-emerald-700 bg-emerald-100 border border-emerald-300 rounded px-1.5 py-0.5" title="Hoàn thành vượt định mức được giao + đạt chuẩn + đúng hạn — được tính vào điểm thưởng vượt mức">▲ vượt mức</span>}
          {t.catalogId ? <span className={`shrink-0 text-[11px] font-bold ${st.txt}`}>{sc.toFixed(0)}%</span> : <span className="shrink-0 text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-200 rounded px-1.5 py-0.5" title="Chưa chọn danh mục công việc nên nhiệm vụ này KHÔNG được tính vào điểm KPI">chưa tính điểm</span>}
          {taskEditable && (cur.tasks335 || []).length > 1 && <button onClick={() => upCur({ tasks335: (cur.tasks335 || []).filter((x) => x.id !== t.id) })} className="shrink-0 text-rose-400 hover:bg-rose-100 p-1.5 rounded-lg"><Trash2 className="w-4 h-4" /></button>}
        </div>
        <div className="flex items-center gap-2 mb-2"><Link2 className="w-3.5 h-3.5 text-slate-400 shrink-0" /><select value={t.objId || ''} disabled={!taskEditable} onChange={(e) => upTask335(t.id, { objId: e.target.value })} className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-600 outline-none focus:border-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed"><option value="">— Liên kết mục tiêu (OKR), không bắt buộc —</option>{objectives.map((o) => <option key={o.id} value={o.id}>{o.title}</option>)}</select></div>
        <div className="bg-white/60 p-2 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-semibold text-slate-500 flex-1" title="Tổng số sản phẩm/đầu việc được giao trong kỳ (định mức). Việc trọn gói → nhập 1.">Số lượng được giao (định mức)</span>
            <input type="number" min="1" value={t.assigned ?? 1} disabled={!taskEditable} onChange={(e) => upTask335(t.id, { assigned: Math.max(1, Number(e.target.value) || 1) })} className="w-16 bg-white border border-slate-200 rounded px-1.5 py-1 text-xs text-center font-semibold text-slate-700 outline-none focus:border-emerald-500 disabled:opacity-50 disabled:bg-slate-50" />
          </div>
          <div className="grid grid-cols-[1fr_5rem_5rem] gap-x-2 gap-y-1.5 items-center">
            <span />
            <span className="text-[10px] font-bold text-slate-400 text-center" title="Cán bộ tự đánh giá">Tự ĐG</span>
            <span className="text-[10px] font-bold text-emerald-600 text-center" title="Cấp có thẩm quyền rà soát, xác nhận (dùng để xếp loại). Mặc định kế thừa Tự ĐG khi chưa sửa.">Cấp duyệt</span>
            <span className="text-[11px] text-slate-600" title="Số sản phẩm/đầu việc đã hoàn thành, được nghiệm thu. VD: giao 10, xong 8 → Số lượng a = 80%. Làm vượt định mức được xét thưởng.">Số lượng hoàn thành <span className="text-slate-300">ⓘ</span></span>
            <input type="number" min="0" value={t.completed ?? as} disabled={!selfEditable} onChange={(e) => upTask335(t.id, { completed: Math.max(0, Number(e.target.value) || 0) })} className="w-full bg-slate-50 border border-slate-200 rounded px-1 py-1 text-xs text-center text-slate-600 outline-none focus:border-slate-400 disabled:opacity-50" />
            <input type="number" min="0" value={t.mgrCompleted ?? t.completed ?? as} disabled={!mgrEditable} onChange={(e) => upTask335(t.id, { mgrCompleted: Math.max(0, Number(e.target.value) || 0) })} className="w-full bg-emerald-50 border border-emerald-200 rounded px-1 py-1 text-xs text-center font-bold text-emerald-700 outline-none focus:border-emerald-400 disabled:opacity-50" />
            <span className="text-[11px] text-slate-600" title="Mức đạt chuẩn nghiệm thu về nội dung, thể thức (không xét lỗi nhỏ tự sửa). Đạt chuẩn 100% · Có sai sót 75% · Chưa đạt 50%.">Chất lượng <span className="text-slate-300">ⓘ</span></span>
            <select value={clSelf} disabled={!selfEditable} onChange={(e) => upTask335(t.id, { cl: e.target.value })} className={selSelf}>{SH_CL.map((x) => <option key={x.k} value={x.k}>{x.short}</option>)}</select>
            <select value={clMgr} disabled={!mgrEditable} onChange={(e) => upTask335(t.id, { mgrCl: e.target.value })} className={selMgr}>{SH_CL.map((x) => <option key={x.k} value={x.k}>{x.short}</option>)}</select>
            <span className="text-[11px] text-slate-600" title="Mức đúng thời hạn được giao. Đúng hạn 100% · Chậm ít 80% · Trễ hạn 50%.">Tiến độ <span className="text-slate-300">ⓘ</span></span>
            <select value={tdSelf} disabled={!selfEditable} onChange={(e) => upTask335(t.id, { td: e.target.value })} className={selSelf}>{SH_TD.map((x) => <option key={x.k} value={x.k}>{x.short}</option>)}</select>
            <select value={tdMgr} disabled={!mgrEditable} onChange={(e) => upTask335(t.id, { mgrTd: e.target.value })} className={selMgr}>{SH_TD.map((x) => <option key={x.k} value={x.k}>{x.short}</option>)}</select>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[11px] font-semibold text-slate-500 flex-1" title="Tầm quan trọng → trọng số khi tính điểm (Thường ×1 · Quan trọng ×1,5 · Trọng tâm ×2)">Tầm quan trọng của nhiệm vụ</span>
            <select value={t.tam || 'thuong'} disabled={!taskEditable} onChange={(e) => upTask335(t.id, { tam: e.target.value })} className="w-40 text-xs p-1.5 rounded border border-slate-200 bg-white text-slate-600 outline-none focus:border-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed">{KD_TAM.map((x) => <option key={x.k} value={x.k}>{x.label}</option>)}</select>
          </div>
          {t.catalogId && (
            <div className="mt-2 pt-2 border-t border-slate-200/70 text-[11px] space-y-0.5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                <span className="text-slate-400">Kết quả nhiệm vụ:</span>
                <span className="text-slate-500">Tự ĐG <b className="text-slate-700">{scSelf.toFixed(0)}%</b> <span className={`px-1 rounded border ${mSelf.tone}`}>{mSelf.short}</span></span>
                <span className={st.txt}>Cấp duyệt <b>{sc.toFixed(0)}%</b> <span className={`px-1 rounded border ${mMgr.tone}`}>{mMgr.short}</span></span>
              </div>
              <p className="text-slate-400">Cấp duyệt = (Số lượng {rMgr.a.toFixed(0)}% + Chất lượng {rMgr.b}% + Tiến độ {rMgr.c}%) ÷ 3 → suy ra mức <b className="text-slate-500">{mMgr.short}</b>. Cột Cấp duyệt mặc định kế thừa Tự đánh giá khi cấp trên chưa sửa.</p>
            </div>
          )}
        </div>
        <div className="mt-2"><input value={t.note || ''} disabled={!taskEditable} onChange={(e) => upTask335(t.id, { note: e.target.value })} placeholder="Nhận xét, khó khăn, kiến nghị..." className="w-full bg-white/60 focus:bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-emerald-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed" /></div>
      </div>);
    }
    const sc = task335Score(t); const st = statusOf(sc);
    return (<div key={t.id} className={`border rounded-xl p-3 ${st.soft} border-slate-200`}>
      <div className="flex items-center gap-2 mb-2"><span className={`shrink-0 w-2.5 h-2.5 rounded-full ${st.dot}`} title={st.label} /><span className="shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xs font-bold">{i + 1}</span>{t.srcTrkId != null && <span className="shrink-0 text-[10px] font-bold text-indigo-700 bg-indigo-100 border border-indigo-200 rounded px-1.5 py-0.5" title="Nhiệm vụ được thu thập từ Bảng theo dõi CV">từ Theo dõi CV</span>}<select value={t.catalogId} disabled={!taskEditable} onChange={(e) => upTask335(t.id, { catalogId: e.target.value })} className={`flex-1 bg-white border rounded-lg px-2 py-1.5 text-xs text-slate-700 font-medium outline-none focus:border-red-400 disabled:opacity-60 disabled:cursor-not-allowed ${t.catalogId ? 'border-slate-200' : 'border-amber-300 bg-amber-50'}`}><option value="">— Chọn công việc từ danh mục —</option>{(isSonHa ? sonhaGroupsOf(cur) : getND335Groups(cur.type)).map((c) => (<option key={c.id} value={c.id}>[{c.id}] {c.name}</option>))}</select>{(() => { const over = tCompleted(t, 'mgr') - (Number(t.assigned) || 0); return t.catalogId && over > 0 ? <span className="shrink-0 text-[10px] font-extrabold text-emerald-700 bg-emerald-100 border border-emerald-300 rounded px-1.5 py-0.5" title={`Hoàn thành vượt định mức được giao ${over} sản phẩm — được xét điểm thưởng`}>▲ vượt +{over}</span> : null; })()}{t.catalogId ? <span className={`shrink-0 text-[11px] font-bold ${st.txt}`}>{sc.toFixed(0)}%</span> : <span className="shrink-0 text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-200 rounded px-1.5 py-0.5" title="Chưa chọn danh mục công việc nên nhiệm vụ này KHÔNG được tính vào điểm KPI">chưa tính điểm</span>}{taskEditable && (cur.tasks335 || []).length > 1 && <button onClick={() => upCur({ tasks335: (cur.tasks335 || []).filter((x) => x.id !== t.id) })} className="shrink-0 text-rose-400 hover:bg-rose-100 p-1.5 rounded-lg"><Trash2 className="w-4 h-4" /></button>}</div>
      <div className="flex items-center gap-2 mb-2"><Link2 className="w-3.5 h-3.5 text-slate-400 shrink-0" /><select value={t.objId || ''} disabled={!taskEditable} onChange={(e) => upTask335(t.id, { objId: e.target.value })} className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-600 outline-none focus:border-red-400 disabled:opacity-60 disabled:cursor-not-allowed"><option value="">{isClassic ? '— Liên kết mục tiêu (OKR) —' : '— Việc thường xuyên / chưa gắn mục tiêu —'}</option>{objectives.map((o) => <option key={o.id} value={o.id}>{o.title}</option>)}</select></div>
      {!isClassic && <div className="mb-2"><div className="flex items-center gap-2"><Target className="w-3.5 h-3.5 text-indigo-400 shrink-0" /><input value={t.kr || ''} disabled={!taskEditable} onChange={(e) => upTask335(t.id, { kr: e.target.value })} placeholder='Kết quả/sản phẩm cần đạt (tiêu chuẩn nghiệm thu) — VD: "10 báo cáo thẩm tra, đúng thể thức, trước ngày 25"' title="Mô tả ngắn 'thế nào là đạt' để người làm và người chấm hiểu giống nhau (SMART: sản phẩm + tiêu chuẩn đo được + hạn). Đây là căn cứ chấm 3 mục Khối lượng/Chất lượng/Tiến độ." className="flex-1 bg-white border border-indigo-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-indigo-400 disabled:opacity-60 disabled:cursor-not-allowed" /></div></div>}
      <div className="bg-white/60 p-2 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-semibold text-slate-500 flex-1" title="Tổng số sản phẩm/đầu việc được giao trong kỳ (định mức). Việc trọn gói → nhập 1.">Số lượng được giao (định mức)</span>
          <input type="number" min="1" value={t.assigned} disabled={!taskEditable} onChange={(e) => upTask335(t.id, { assigned: Math.max(1, Number(e.target.value) || 1) })} className="w-16 bg-white border border-slate-200 rounded px-1.5 py-1 text-xs text-center font-semibold text-slate-700 outline-none focus:border-slate-400 disabled:opacity-50 disabled:bg-slate-50" />
        </div>
        <div className="grid grid-cols-[1fr_3.5rem_3.5rem] gap-x-2 gap-y-1.5 items-center">
          <span />
          <span className="text-[10px] font-bold text-slate-400 text-center" title="Cán bộ tự đánh giá">Tự ĐG</span>
          <span className="text-[10px] font-bold text-red-500 text-center" title="Cấp có thẩm quyền rà soát, xác nhận (dùng để xếp loại). Mặc định kế thừa số Tự ĐG khi chưa sửa.">Cấp duyệt</span>
          {[
            { lb: 'SL hoàn thành', s: 'completed', m: 'mgrCompleted', h: 'Số sản phẩm đã làm xong, được nghiệm thu/chấp nhận (chưa xét lỗi & độ trễ). VD: giao 10, xong 8 → Khối lượng a = 80%.' },
            { lb: 'Số lần sai sót lớn', s: 'qualityIssues', m: 'mgrQualityIssues', h: 'Số lần sản phẩm bị TRẢ LẠI / làm lại / yêu cầu sửa do sai sót lớn về nội dung, chất lượng (không tính lỗi nhỏ tự sửa). Mỗi lần −25% điểm chất lượng.' },
            { lb: 'Số lần trễ hạn', s: 'delays', m: 'mgrDelays', h: 'Số lần hoàn thành SAU thời hạn được giao. Mỗi lần −25% điểm tiến độ. Không tính nếu chậm do nguyên nhân khách quan được xác nhận (ô dưới).' },
          ].map((r) => (<Fragment key={r.s}>
            <span className="text-[11px] text-slate-600" title={r.h}>{r.lb} <span className="text-slate-300">ⓘ</span></span>
            <input type="number" min="0" value={t[r.s] ?? 0} disabled={!selfEditable} onChange={(e) => upTask335(t.id, { [r.s]: Math.max(0, Number(e.target.value) || 0) })} className="w-full bg-slate-50 border border-slate-200 rounded px-1 py-1 text-xs text-center text-slate-600 outline-none focus:border-slate-400 disabled:opacity-50" />
            <input type="number" min="0" value={t[r.m] ?? t[r.s] ?? 0} disabled={!mgrEditable} onChange={(e) => upTask335(t.id, { [r.m]: Math.max(0, Number(e.target.value) || 0) })} className="w-full bg-red-50 border border-red-200 rounded px-1 py-1 text-xs text-center font-bold text-red-700 outline-none focus:border-red-400 disabled:opacity-50" />
          </Fragment>))}
        </div>
        {t.catalogId && (() => { const ss = task335Score(t, 'self'), ms = task335Score(t, 'mgr'); const m2 = statusOf(ms); return (
          <div className="mt-2 pt-2 border-t border-slate-200/70 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px]">
            <span className="text-slate-400">Điểm nhiệm vụ:</span>
            <span className="text-slate-500">Tự ĐG <b className="text-slate-700">{ss.toFixed(0)}%</b></span>
            <span className={m2.txt}>Cấp duyệt <b>{ms.toFixed(0)}%</b> · {m2.label}</span>
          </div>
        ); })()}
      </div>
      {!isClassic && <div className="mt-2"><input value={t.exemptNote || ''} disabled={!taskEditable} onChange={(e) => upTask335(t.id, { exemptNote: e.target.value })} placeholder="Miễn trừ do nguyên nhân khách quan (nếu có) — VD: chờ ý kiến cơ quan khác, nhiệm vụ đột xuất chen ngang…" title="Theo NĐ 335/2025: không trừ điểm nếu chậm/sai sót do nguyên nhân khách quan được cấp có thẩm quyền xác nhận. Lần đã miễn trừ thì KHÔNG tính vào số lần ở trên." className="w-full bg-amber-50/60 focus:bg-white border border-amber-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-amber-400 disabled:opacity-60 disabled:cursor-not-allowed" /></div>}
      <div className="mt-2"><input value={t.note || ''} disabled={!taskEditable} onChange={(e) => upTask335(t.id, { note: e.target.value })} placeholder="Nhận xét, khó khăn, kiến nghị..." className="w-full bg-white/60 focus:bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-red-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed" /></div>
    </div>); };

  // Gom nhiệm vụ theo Mục tiêu (Cải tiến/Singapore) — mỗi mục tiêu một khối, cuối cùng là "việc thường xuyên".
  const renderGroupedTasks = () => {
    const tasks = cur.tasks335 || [];
    const idxOf = (t) => tasks.indexOf(t);
    const groups = [];
    objectives.forEach((o) => { const ts = tasks.filter((t) => t.objId === o.id); if (ts.length) groups.push({ key: o.id, title: o.title, ts }); });
    const unl = tasks.filter((t) => !t.objId || !objectives.some((o) => o.id === t.objId));
    if (unl.length || !groups.length) groups.push({ key: '__none__', title: 'Việc thường xuyên / chưa gắn mục tiêu', ts: unl, none: true });
    return groups.map((g) => (
      <div key={g.key} className="rounded-xl border border-slate-200 overflow-hidden">
        <div className={`px-3 py-2 flex items-center gap-2 ${g.none ? 'bg-slate-100' : 'bg-indigo-50 border-b border-indigo-100'}`}>
          <Target className={`w-4 h-4 shrink-0 ${g.none ? 'text-slate-400' : 'text-indigo-600'}`} />
          <span className={`text-xs font-bold ${g.none ? 'text-slate-600' : 'text-indigo-800'}`}>{g.none ? g.title : `Mục tiêu: ${g.title}`}</span>
          <span className="ml-auto text-[10px] font-semibold text-slate-500">{g.ts.length} nhiệm vụ</span>
        </div>
        <div className="p-2 space-y-3">{g.ts.map((t) => renderTask335Row(t, idxOf(t)))}</div>
        {taskEditable && !g.none && <button onClick={() => upCur({ tasks335: [...tasks, newTask335(g.key)] })} className="w-full flex items-center justify-center gap-1.5 py-2 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-50 border-t border-slate-100"><Plus className="w-3.5 h-3.5" /> Thêm nhiệm vụ vào mục tiêu này</button>}
      </div>
    ));
  };

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
  // Chỉ hiện màn đăng nhập khi người dùng CHỦ ĐỘNG chọn (mặc định vào thẳng bằng khách)
  if (supabase && wantLogin && (!session || isLocalSession(session))) {
    return <Login unit={unit} version={version} onPickVersion={onPickVersion} versionCfg={versionCfg} onHome={onHome} onGuest={() => setWantLogin(false)} onLocalAdmin={() => { setSession('localadmin'); setWantLogin(false); }} onClose={() => setWantLogin(false)} />;
  }
  // Lần đầu đăng nhập (vào bằng liên kết email) mà chưa có mật khẩu -> bắt buộc tạo mật khẩu
  if (supabase && session && session !== 'local' && !isLocalSession(session) && !session.user?.user_metadata?.pw_set) {
    return <SetPassword unit={unit} email={myEmail} mode="create" onComplete={applyFirstLoginProfile} />;
  }

  return (
    <div className="min-h-screen text-slate-800" style={{ fontFamily: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif" }}>
      <header className={`relative text-white bg-gradient-to-br ${th.grad}`}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 tech-grid" />
          <div className={`absolute -top-24 -right-10 w-80 h-80 rounded-full blur-3xl ${th.blob1}`} />
          <div className={`absolute -bottom-24 -left-10 w-72 h-72 rounded-full blur-3xl ${th.blob2}`} />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            {onHome && (
              <button onClick={onHome} title="Về Trang chủ (chọn phân hệ khác)" className="shrink-0 w-10 h-10 rounded-xl bg-white/10 border border-white/25 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Home className="w-5 h-5" />
              </button>
            )}
            <div className="shrink-0 w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-xl ring-2 ring-amber-300/60 emblem-glow animate-floatY p-1.5">
              <img src="/quoc-huy.svg" alt="Quốc huy Việt Nam" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className={`text-[11px] font-semibold tracking-[0.22em] uppercase ${th.eyebrow}`}>Hệ thống đánh giá, xếp loại</p>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${th.badge}`}>Bản demo thử nghiệm</span>
                {onPickVersion && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/15 border border-white/30 text-white/90">Bộ tiêu chí {vName(version)}</span>}
              </div>
              <h1 className="text-lg sm:text-2xl font-extrabold leading-tight aurora-text">{moduleTitle || 'Đánh giá, xếp loại cán bộ, công chức'}</h1>
              <p className="text-white/85 text-xs sm:text-sm mt-0.5">{unit}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap max-w-full">
            {onPickVersion && (
              <div className="flex items-center rounded-lg overflow-hidden border border-white/25 bg-white/10 max-w-full overflow-x-auto" title="Chọn phiên bản bộ tiêu chí đánh giá">
                {shownVersions.map((v) => { const on = version === v.id; const hid = versionCfg.hidden.includes(v.id); return (
                  <button key={v.id} onClick={() => onPickVersion(v.id)} title={v.desc + (hid ? ' — ĐANG ẨN với người dùng thường (chỉ Quản trị thấy)' : '')} className={`shrink-0 text-[11px] font-semibold px-2.5 py-1.5 transition-colors ${on ? 'bg-white text-slate-800' : 'text-white/80 hover:bg-white/10'} ${hid ? 'opacity-50 line-through decoration-white/60' : ''}`}>{vName(v.id)}</button>
                ); })}
              </div>
            )}
            {isAdmin && (
              <div className="relative">
                <button onClick={() => setVerCfgOpen((o) => !o)} title="Quản lý bộ tiêu chí: ẩn/hiện phân hệ trên Trang chủ, đổi tên (chỉ Quản trị)" className={`flex items-center justify-center p-2 rounded-lg border transition-colors ${verCfgOpen ? 'bg-white text-slate-800 border-white' : 'bg-white/10 text-white/80 border-white/25 hover:bg-white/20'}`}>
                  <Settings className="w-4 h-4" />
                </button>
                {verCfgOpen && (
                  <div className="fixed inset-x-3 top-20 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96 sm:max-w-[92vw] max-h-[70vh] overflow-y-auto bg-white rounded-xl shadow-2xl border border-slate-200 p-3 z-50 text-slate-800">
                    <p className="text-xs font-bold text-slate-700 mb-0.5 flex items-center gap-1.5"><Settings className="w-3.5 h-3.5 text-slate-400" /> Quản lý bộ tiêu chí / phân hệ</p>
                    <p className="text-[10px] text-slate-400 mb-2">Bật/tắt hiển thị thẻ phân hệ trên <b>Trang chủ</b> với người dùng thường & khách; đổi tên hiển thị. Áp dụng cho mọi người truy cập.</p>
                    {VERSIONS.map((v) => { const hid = versionCfg.hidden.includes(v.id); const custom = (versionCfg.names || {})[v.id] || ''; return (
                      <div key={v.id} className="flex items-center gap-2 py-1.5 border-b border-slate-100 last:border-0">
                        <button onClick={() => toggleVersionHidden(v.id)} title={hid ? 'Đang ẨN — bấm để hiển thị lại' : 'Đang HIỆN — bấm để ẩn với người dùng thường'} className={`shrink-0 flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md border transition-colors ${hid ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                          {hid ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}{hid ? 'Ẩn' : 'Hiện'}
                        </button>
                        <span className="shrink-0 w-16 text-[10px] text-slate-400 truncate" title={`Tên gốc: ${v.name}`}>{v.name}</span>
                        <input value={custom} placeholder={v.name} disabled={readOnly} onChange={(e) => renameVersion(v.id, e.target.value, false)} onBlur={(e) => renameVersion(v.id, e.target.value, true)} className="flex-1 min-w-0 text-xs p-1.5 border border-slate-200 rounded-lg outline-none focus:border-slate-400 disabled:bg-slate-50" title="Tên hiển thị mới (bỏ trống = dùng tên gốc)" />
                        {custom && <button onClick={() => renameVersion(v.id, '', true)} title="Khôi phục tên gốc" className="shrink-0 text-slate-400 hover:text-slate-600 p-1 rounded"><RotateCcw className="w-3.5 h-3.5" /></button>}
                      </div>
                    ); })}
                    <p className="text-[10px] text-slate-400 mt-2">Phiên bản ẩn chỉ Quản trị nhìn thấy (gạch mờ trên thanh chọn). Không thể ẩn tất cả.</p>
                  </div>
                )}
              </div>
            )}
            {!isGuest && (
              <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg ${cloud.ready ? 'bg-emerald-500/20 text-emerald-100' : 'bg-amber-500/20 text-amber-100'}`}>
                {cloud.ready ? <Cloud className="w-3.5 h-3.5" /> : <CloudOff className="w-3.5 h-3.5" />}
                {cloud.ready ? (cloud.saving ? 'Đang lưu...' : 'Đã kết nối cloud') : 'Chạy cục bộ'}
              </span>
            )}
            {!readOnly && (
              <button onClick={handleManualSave} disabled={cloud.saving} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-colors disabled:opacity-50 border border-blue-500/50">
                <Save className="w-3.5 h-3.5" /> Lưu ngay
              </button>
            )}
            {/* Khối tài khoản — dùng chung kiểu hiển thị với các phân hệ khác */}
            {supabase && session && session !== 'local' && (
              <>
                <span className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-lg border max-w-[220px] truncate ${isGuest ? 'bg-amber-400/20 border-amber-300/40 text-amber-50' : 'bg-white/10 border-white/20 text-white/90'}`}
                  title={isGuest ? 'Tài khoản khách — thử chấm điểm được nhưng KHÔNG lưu' : isLocalAdmin ? 'Quản trị cục bộ — dữ liệu chỉ lưu trên máy này' : myEmail}>
                  <User className="w-3.5 h-3.5 shrink-0" />
                  {isGuest ? 'Khách · dùng thử' : isLocalAdmin ? 'Quản trị (cục bộ)' : (
                    <>{myPerson?.name || session.user?.user_metadata?.full_name || myEmail}<span className="opacity-70"> · {ROLE_LABEL[role]}</span></>
                  )}
                </span>
                {!isGuest && !isLocalAdmin && <button onClick={() => setShowChangePw(true)} title="Đổi mật khẩu" className="p-1.5 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20"><KeyRound className="w-4 h-4" /></button>}
                {isGuest
                  ? <button onClick={() => setWantLogin(true)} title="Đăng nhập để chỉnh sửa và lưu dữ liệu" className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg bg-white text-slate-800 hover:bg-slate-100"><LogIn className="w-4 h-4" /> Đăng nhập</button>
                  : isLocalAdmin
                    ? <button onClick={() => { setWantLogin(false); setSession('guest'); }} title="Thoát chế độ quản trị cục bộ" className="p-1.5 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20"><LogOut className="w-4 h-4" /></button>
                    : <button onClick={() => { setWantLogin(false); signOut(); }} title="Đăng xuất" className="p-1.5 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20"><LogOut className="w-4 h-4" /></button>}
              </>
            )}
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5 border border-white/20" title={isKD ? 'Chọn quý/năm' : 'Chọn tháng/năm để xem hoặc nhập kỳ khác'}>
              <CalendarDays className="w-4 h-4" />
              {isKD ? (
                <select value={QUARTER_OF(period.month)} onChange={(e) => { loadingRef.current = true; const np = { ...period, month: String(Number(e.target.value) * 3) }; setPeriod(np); loadPeriod(np); }} className="bg-white/10 rounded px-1 py-0.5 text-sm text-white outline-none [&>option]:text-slate-800">
                  {[1, 2, 3, 4].map((q) => <option key={q} value={q}>Quý {ROMAN[q - 1]}</option>)}
                </select>
              ) : (
                <input type="number" min="1" max="12" value={period.month} onChange={(e) => { loadingRef.current = true; setPeriod({ ...period, month: e.target.value }); }} onBlur={() => loadPeriod(period)} onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }} className="w-11 bg-white/10 rounded px-1 py-0.5 text-sm text-center text-white outline-none" />
              )}
              <span className="text-white/60">/</span>
              <input type="number" value={period.year} onChange={(e) => { loadingRef.current = true; setPeriod({ ...period, year: e.target.value }); }} onBlur={() => loadPeriod(period)} onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }} className="w-16 bg-white/10 rounded px-1 py-0.5 text-sm text-center text-white outline-none" />
            </div>
          </div>
        </div>
        <div className="relative glass-dark border-t border-white/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-1.5 overflow-x-auto py-2">
            {[...tabs,
              ...(canManage && !isSonHa && !isSG && !isKD ? [{ id: 'catalog', label: 'Danh mục', icon: ListChecks }] : []),
              ...(canManage ? [{ id: 'hr', label: 'Quản lý cán bộ', icon: Users }] : []),
            ].map((t) => { const Ic = t.icon; const on = tab === t.id;
              return (<button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-3.5 sm:px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${on ? `${th.tabOn} shadow-lg shadow-black/20` : th.tabOff}`}><Ic className="w-4 h-4" />{t.label}</button>); })}
          </div>
        </div>
      </header>

      {showChangePw && (
        <SetPassword mode="change" unit={unit} email={myEmail} onClose={() => setShowChangePw(false)} onDone={() => setTimeout(() => setShowChangePw(false), 1200)} />
      )}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
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

        {people.length === 0 && tab !== 'catalog' && (
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
            {isKD && <KiemDiemDashboard computed={computed} onPick={(id) => { setCurId(id); setTab('eval'); }} onExportAgg={doKDAgg} quarterLabel={quarterLabel} />}
            {!isKD && (<>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Stat icon={Users} label="Tổng số cán bộ" value={people.length} color="slate" />
              <Stat icon={TrendingUp} label="Điểm TB cơ quan" value={avg.toFixed(1)} color="red" />
              <Stat icon={Award} label={isSG ? 'Grade A (Outstanding)' : 'Hoàn thành xuất sắc'} value={dist.A} color="emerald" />
              <Stat icon={Target} label="Mục tiêu (OKR)" value={objectives.length} color="amber" />
            </div>
            {!isSG && overCap && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <p className="text-sm text-rose-700">Cảnh báo trần tỷ lệ: đang có <b>{dist.A}</b> "Hoàn thành xuất sắc" trong khi tối đa cho phép là <b>{Math.floor(dist.B * 0.2)}</b> (không vượt quá 20% của {dist.B} người "Hoàn thành tốt").</p>
              </div>
            )}
            {!isSG && (
              <Suspense fallback={<div className="text-sm text-slate-400 text-center py-8">Đang tải biểu đồ…</div>}>
                <DashboardCharts dist={dist} trends={trends} computed={computed} digital={DIGITAL} theme="classic" />
              </Suspense>
            )}
            <div className="grid lg:grid-cols-3 gap-6">
              <section className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-5 py-3.5"><h2 className="flex items-center gap-2 font-bold"><Target className="w-5 h-5 text-amber-300" /> Mục tiêu cấp Văn phòng (OKR)</h2></div>
                <div className="p-4 space-y-3">
                  <p className="text-[11px] text-slate-500 bg-indigo-50/70 border border-indigo-100 rounded-lg p-2">Mỗi <b>Mục tiêu (Objective)</b> có các <b>Kết quả then chốt (Key Result)</b> đo được — tiến độ chấm 0–100% (OKR khát vọng đạt <b>60–70%</b> đã là tốt). <b>OKR chỉ theo dõi tiến độ cơ quan, KHÔNG cộng vào điểm cá nhân.</b></p>
                  {objectives.map((o) => { const pr = objProgress(o.id); const linked = people.flatMap((p) => p.tasks335 || []).filter((t) => t.objId === o.id && t.catalogId).length; const krg = objKrGrade(o); const krs = o.krs || []; const og = krg === null ? null : KR_TONE[krTone(krg)];
                    return (
                      <div key={o.id} className="border border-slate-200 rounded-xl p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <input value={o.title} disabled={!canManage} onChange={(e) => upObjective(o.id, { title: e.target.value })} className="w-full font-semibold text-sm text-slate-800 bg-transparent outline-none focus:bg-slate-50 rounded px-1 -ml-1 disabled:text-slate-600" />
                            <div className="flex items-center gap-2 mt-1 flex-wrap"><span className="text-[11px] font-bold bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-100">{o.source}</span><span className="text-[11px] text-slate-400 flex items-center gap-1"><Link2 className="w-3 h-3" /> {linked} nhiệm vụ</span>{og && <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${og.chip}`}>OKR {krg.toFixed(0)}%</span>}</div>
                          </div>
                          {canManage && <button onClick={() => { if (!window.confirm('Xóa mục tiêu này (kèm các Key Result)?')) return; setObjectives((os) => os.filter((x) => x.id !== o.id)); }} className="text-slate-300 hover:text-rose-500 p-1"><Trash2 className="w-4 h-4" /></button>}
                        </div>
                        <div className="mt-2.5 space-y-2">
                          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1"><Target className="w-3 h-3" /> Kết quả then chốt (Key Results)</p>
                          {krs.length === 0 && <p className="text-[11px] text-slate-400 italic">Chưa có KR.{canManage ? ' Thêm KR đo được — VD: "Tỷ lệ văn bản tham mưu đúng hạn", chỉ tiêu 100%.' : ''}</p>}
                          {krs.map((k) => { const p = krPct(k); const kt = KR_TONE[krTone(p)]; return (
                            <div key={k.id} className="rounded-lg border border-slate-100 bg-slate-50/60 p-2">
                              <div className="flex items-center gap-2">
                                <input value={k.text} disabled={!canManage} onChange={(e) => upKr(o.id, k.id, { text: e.target.value })} placeholder="Kết quả then chốt đo được (outcome)..." className="flex-1 bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-700 outline-none focus:border-indigo-400 disabled:bg-transparent disabled:border-transparent" />
                                {canManage && <button onClick={() => delKr(o.id, k.id)} className="shrink-0 text-slate-300 hover:text-rose-500 p-0.5"><Trash2 className="w-3.5 h-3.5" /></button>}
                              </div>
                              <div className="flex items-center gap-2 mt-1.5">
                                <input type="number" value={k.current} disabled={!canManage} onChange={(e) => upKr(o.id, k.id, { current: e.target.value })} title="Hiện tại" className="w-14 bg-white border border-slate-200 rounded px-1.5 py-1 text-xs text-center outline-none focus:border-indigo-400 disabled:bg-slate-50" />
                                <span className="text-slate-400 text-xs">/</span>
                                <input type="number" value={k.target} disabled={!canManage} onChange={(e) => upKr(o.id, k.id, { target: e.target.value })} title="Chỉ tiêu" className="w-14 bg-white border border-slate-200 rounded px-1.5 py-1 text-xs text-center outline-none focus:border-indigo-400 disabled:bg-slate-50" />
                                <input value={k.unit || ''} disabled={!canManage} onChange={(e) => upKr(o.id, k.id, { unit: e.target.value })} title="Đơn vị" placeholder="đv" className="w-12 bg-white border border-slate-200 rounded px-1.5 py-1 text-xs text-center outline-none focus:border-indigo-400 disabled:bg-slate-50" />
                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${kt.bar} transition-all`} style={{ width: `${p}%` }} /></div>
                                <span className={`text-[11px] font-bold w-9 text-right ${kt.text}`}>{p.toFixed(0)}%</span>
                              </div>
                            </div>
                          ); })}
                          {canManage && <button onClick={() => addKr(o.id)} className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700"><Plus className="w-3.5 h-3.5" /> Thêm Key Result</button>}
                        </div>
                        <div className="mt-2 flex items-center gap-2"><span className="text-[10px] text-slate-400 w-24 shrink-0" title="Trung bình điểm % các nhiệm vụ cá nhân liên kết với mục tiêu này">Thực thi nhiệm vụ</span><div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${pr === null ? 'bg-slate-200' : statusOf(pr).dot} transition-all`} style={{ width: `${pr || 0}%` }} /></div><span className="text-[11px] font-bold text-slate-500 w-12 text-right">{pr === null ? '—' : `${pr.toFixed(0)}%`}</span></div>
                      </div>
                    ); })}
                  {canManage && <button onClick={() => setObjectives((os) => [...os, { id: 'o' + Date.now(), title: 'Mục tiêu mới...', source: 'Chương trình công tác', krs: [] }])} className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-slate-300 rounded-xl text-sm font-medium text-slate-500 hover:border-red-400 hover:text-red-600"><Plus className="w-4 h-4" /> Thêm mục tiêu</button>}
                </div>
              </section>
              {!isSG && (
              <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                <h2 className="flex items-center gap-2 font-bold text-slate-800 mb-4"><BarChart3 className="w-5 h-5 text-red-700" /> Phân bố xếp loại</h2>
                <div className="space-y-3">
                  {['A', 'B', 'C', 'D'].map((code) => { const cl = classify(code === 'A' ? 95 : code === 'B' ? 80 : code === 'C' ? 60 : 40); const n = dist[code]; const pct = people.length ? (n / people.length) * 100 : 0;
                    return (<div key={code}><div className="flex justify-between text-xs mb-1"><span className="font-semibold text-slate-600">Loại {code} — {cl.name}</span><span className="font-bold text-slate-700">{n}</span></div><div className="h-3 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${cl.bar} transition-all`} style={{ width: `${pct}%` }} /></div></div>); })}
                </div>
              </section>
              )}
            </div>
            {isSG && <SingaporeInstitution kpis={instKpi} canManage={canManage} onChange={setInstKpi} />}
            {isSG && <SingaporeDashboard computed={computed} onPick={(id) => { setCurId(id); setTab('eval'); }} />}
            {!isSG && (<>
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
                    {computed.map(({ p, c }) => { const r = gradeClass(c.grade);
                      return (<tr key={p.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => { setCurId(p.id); setTab('eval'); }}><td className="px-4 py-3 font-semibold text-slate-700">{p.name || '(Chưa đặt tên)'}</td><td className="px-3 py-3 text-slate-500 text-xs">{p.position || CRITERIA[p.type].label}</td><td className="px-3 py-3 text-center text-slate-500">{c.totalSelf.toFixed(1)}</td><td className="px-3 py-3 text-center font-bold text-slate-800">{c.totalMgr.toFixed(1)}</td><td className="px-3 py-3 text-center"><span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-bold ${r.soft}`}><span className={`w-5 h-5 rounded-full ${r.cls} text-white flex items-center justify-center text-[10px]`}>{r.code}</span></span></td></tr>); })}
                  </tbody>
                </table>
              </div>
              {canManage && <div className="p-3 border-t border-slate-100"><AddPerson onAdd={(name, type) => setPeople((ps) => [...ps, newPerson(name, type)])} /></div>}
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-5 py-3.5"><h2 className="flex items-center gap-2 font-bold"><Users className="w-5 h-5 text-amber-300" /> Tổng hợp theo Phòng/Bộ phận</h2></div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase"><tr><th className="text-left px-4 py-2.5 font-semibold">Phòng / Bộ phận</th><th className="text-center px-3 py-2.5 font-semibold">Số CB</th><th className="text-center px-3 py-2.5 font-semibold text-indigo-600">Chất lượng<br/>(Nhóm I /30)</th><th className="text-center px-3 py-2.5 font-semibold text-amber-600">KPI<br/>(Nhóm II /70)</th><th className="text-center px-3 py-2.5 font-semibold">Tổng TB</th><th className="text-center px-3 py-2.5 font-semibold text-emerald-600">A</th><th className="text-center px-3 py-2.5 font-semibold text-sky-600">B</th><th className="text-center px-3 py-2.5 font-semibold text-amber-600">C</th><th className="text-center px-3 py-2.5 font-semibold text-rose-600">D</th></tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {deptSummary(computed).map((g) => (
                      <tr key={g.dept} className="hover:bg-slate-50"><td className="px-4 py-3 font-semibold text-slate-700">{g.dept}</td><td className="px-3 py-3 text-center text-slate-500">{g.count}</td><td className="px-3 py-3 text-center text-indigo-700 font-semibold">{g.quality.toFixed(1)}</td><td className="px-3 py-3 text-center text-amber-700 font-semibold">{g.kpi.toFixed(1)}</td><td className="px-3 py-3 text-center font-bold text-slate-800">{g.avg.toFixed(1)}</td><td className="px-3 py-3 text-center text-emerald-600 font-semibold">{g.A}</td><td className="px-3 py-3 text-center text-sky-600 font-semibold">{g.B}</td><td className="px-3 py-3 text-center text-amber-600 font-semibold">{g.C}</td><td className="px-3 py-3 text-center text-rose-600 font-semibold">{g.D}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
            </>)}
            </>)}
          </div>
        )}

        {people.length > 0 && tab === 'eval' && (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-4 space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-100"><h2 className="font-semibold text-slate-800 flex items-center gap-2"><Users className="w-4 h-4 text-slate-400" /> Danh sách cán bộ</h2></div>
                <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">{people.map((p) => (<button key={p.id} onClick={() => setCurId(p.id)} className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${curId === p.id ? 'bg-red-50' : 'hover:bg-slate-50'}`}><div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${curId === p.id ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'}`}><User className="w-4 h-4" /></div><div><p className={`text-sm font-medium ${curId === p.id ? 'text-red-700' : 'text-slate-700'}`}>{p.name || '(Chưa tên)'}</p><p className="text-[11px] text-slate-400 mt-0.5">{p.position || CRITERIA[p.type].label}</p></div></button>))}</div>
                {canManage && <button onClick={() => { const np = newPerson('Cán bộ mới', 'staff'); setPeople(ps => [...ps, np]); setCurId(np.id); }} className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 text-slate-500 text-sm font-medium hover:bg-slate-100 hover:text-slate-700 transition-colors border-t border-slate-100"><UserPlus className="w-4 h-4" /> Thêm cán bộ</button>}
                {canManage && <button onClick={() => { if (window.confirm(`Thay TOÀN BỘ danh sách cán bộ của kỳ này bằng danh sách theo phiên bản ${vName(version)} (kèm đánh giá sẵn)? Dữ liệu cán bộ hiện tại của kỳ sẽ bị thay thế sau khi bấm Lưu ngay.`)) loadDemoPeople(); }} title="Thay toàn bộ danh sách cán bộ của kỳ bằng danh sách chuẩn theo phiên bản đang chọn (đã chấm điểm sẵn). Nhớ bấm Lưu ngay để ghi lại." className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-50 text-slate-400 text-xs font-medium hover:bg-amber-50 hover:text-amber-700 transition-colors border-t border-slate-100"><RotateCcw className="w-3.5 h-3.5" /> Nạp lại danh sách cán bộ chuẩn</button>}
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 text-center">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">{isSG ? 'Điểm tổng hợp (Singapore)' : isKD ? `Tổng điểm ${quarterLabel}` : 'Tổng điểm KPI'}</p>
                <div className={`flex justify-center items-end gap-2 ${isSG ? 'text-indigo-600' : 'text-red-600'}`}><span className="text-4xl font-extrabold leading-none">{curC.totalMgr.toFixed(1)}</span><span className="text-sm font-bold pb-1">/ 100</span></div>
                <div className="mt-4"><span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${result.soft}`}>{isSG ? `${result.code} · ` : ''}{result.name}</span></div>
              </div>
            </aside>

            <div className="flex-1 space-y-6">
              <div className="space-y-6">
                {isImproved && (
                  <section className="bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-200 rounded-2xl p-5">
                    <h2 className="flex items-center gap-2 font-bold text-cyan-900"><Award className="w-5 h-5 text-cyan-700" /> Phiên bản Cải tiến — cách hiểu bộ tiêu chí</h2>
                    <p className="text-sm text-cyan-900/80 mt-1.5 leading-relaxed">Vẫn dùng <b>khung điểm 30/70</b> và <b>điều kiện xếp loại Điều 8</b> như bản Cổ điển (theo QĐ 1053), nhưng câu hỏi được viết lại theo phong cách khu vực công Singapore để <b>dễ tự đánh giá hơn</b>: mỗi câu là một câu hỏi "Anh/chị có…?" kèm ví dụ.</p>
                    <div className="grid sm:grid-cols-3 gap-2.5 mt-3 text-[12px]">
                      <div className="bg-white/70 rounded-xl border border-cyan-100 p-2.5"><p className="font-bold text-cyan-800">AIM — Năng lực</p><p className="text-cyan-900/75 mt-0.5 leading-snug">Phân tích (Analytical) · Ảnh hưởng & hợp tác (Influence) · Động lực hướng tới xuất sắc (Motivation).</p></div>
                      <div className="bg-white/70 rounded-xl border border-cyan-100 p-2.5"><p className="font-bold text-cyan-800">ISE — Giá trị cốt lõi</p><p className="text-cyan-900/75 mt-0.5 leading-snug">Liêm chính (Integrity) · Phục vụ (Service) · Xuất sắc (Excellence).</p></div>
                      <div className="bg-white/70 rounded-xl border border-cyan-100 p-2.5"><p className="font-bold text-cyan-800">WoG — Hợp tác</p><p className="text-cyan-900/75 mt-0.5 leading-snug">"Một cơ quan thống nhất", lấy người dân/đại biểu làm trung tâm; KPI hướng kết quả.</p></div>
                    </div>
                  </section>
                )}
                {isSG && (
                  <section className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 rounded-2xl p-5">
                    <h2 className="flex items-center gap-2 font-bold text-indigo-900"><Award className="w-5 h-5 text-indigo-700" /> Phiên bản Singapore (cơ quan dân cử)</h2>
                    <p className="text-sm text-indigo-900/80 mt-1.5 leading-relaxed">Bộ tiêu chí thiết kế riêng cho hoạt động của <b>HĐND / Đoàn ĐBQH</b>: nhấn chức năng <b>đại diện cử tri · giám sát · quyết định/nghị quyết · tiếp xúc, giải quyết kiến nghị cử tri</b> — theo phong cách AIM/ISE và tinh thần "lấy người dân làm trung tâm". Vẫn giữ <b>khung điểm 30/70 + Điều 8</b> nên đổi phiên bản không mất điểm.</p>
                    <div className="grid sm:grid-cols-2 gap-2.5 mt-3 text-[12px]">
                      <div className="bg-white/70 rounded-xl border border-violet-100 p-2.5"><p className="font-bold text-indigo-800">Đại biểu dân cử (Mẫu 01/02)</p><p className="text-indigo-900/75 mt-0.5 leading-snug">Câu hỏi xoay quanh: bản lĩnh đại diện, gắn bó cử tri, phân tích chính sách, chất lượng góp ý lập pháp/nghị quyết, hiệu quả giám sát.</p></div>
                      <div className="bg-white/70 rounded-xl border border-violet-100 p-2.5"><p className="font-bold text-indigo-800">Cán bộ phục vụ (Mẫu 03/04/05)</p><p className="text-indigo-900/75 mt-0.5 leading-snug">Câu hỏi xoay quanh tham mưu, phục vụ kỳ họp – giám sát – tiếp xúc cử tri; lấy sự hài lòng của đại biểu, cử tri làm thước đo.</p></div>
                    </div>
                  </section>
                )}
                {isKD && (
                  <section className="bg-gradient-to-br from-rose-50 to-amber-50 border border-rose-200 rounded-2xl p-5">
                    <h2 className="flex items-center gap-2 font-bold text-rose-900"><Award className="w-5 h-5 text-rose-700" /> Phiên bản Kiểm điểm — đánh giá hằng QUÝ ({quarterLabel})</h2>
                    <p className="text-sm text-rose-900/80 mt-1.5 leading-relaxed">Theo <b>Hướng dẫn 03-HD/TU ngày 02/7/2026</b> của Ban Thường vụ Tỉnh ủy, áp dụng cho <b>cán bộ diện Ban Thường vụ Tỉnh ủy quản lý</b> tại cơ quan. Thang 100 = <b>Nhóm A (30đ)</b> tiêu chí chung (chấm điểm theo thang từng mục) + <b>Nhóm B (70đ)</b> kết quả nhiệm vụ theo <b>6 trục trọng tâm</b>, mỗi trục <b>Điểm = KPI% × điểm tối đa</b>, KPI = (A+B+C+D)/4. Xếp loại 4 mức: HTXS / HTT / HT / Không HT.</p>
                  </section>
                )}
                {!selfEditable && !mgrEditable && (
                  <div className="bg-slate-100 border border-slate-200 rounded-xl p-3 text-sm text-slate-600 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-slate-400" /> Bạn đang ở chế độ <b>chỉ xem</b> với cán bộ này (không đủ quyền chỉnh sửa).</div>
                )}
                {canManage && <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 lg:p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="flex items-center gap-2 font-bold text-slate-800"><User className="w-5 h-5 text-red-700" /> Thông tin người được đánh giá</h2>
                    {canManage && people.length > 1 && <button onClick={() => { if (!window.confirm(`Xóa cán bộ "${cur.name || '(Chưa tên)'}"? Toàn bộ điểm và nhiệm vụ của kỳ này sẽ mất và không thể hoàn tác.`)) return; setPeople((ps) => ps.filter((p) => p.id !== cur.id)); setCurId(people.find(p => p.id !== cur.id).id); }} className="text-slate-400 hover:text-rose-500 flex items-center gap-1 text-sm font-medium"><Trash2 className="w-4 h-4" /> Xóa cán bộ</button>}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Field label="Họ và tên"><input value={cur.name} disabled={!(canManage || mgrEditable)} onChange={(e) => upCur({ name: e.target.value })} className="inp disabled:bg-slate-50 disabled:text-slate-500" /></Field>
                    <Field label="Phòng / Bộ phận"><select value={cur.department || ''} disabled={!(canManage || mgrEditable)} onChange={(e) => upCur({ department: e.target.value, position: '' })} className="inp disabled:bg-slate-50 disabled:text-slate-500"><option value="">— Chọn phòng / bộ phận —</option>{(isSonHa ? SONHA_ORG_UNITS : ORG_UNITS).map((u) => <option key={u.dept} value={u.dept}>{u.dept}</option>)}</select></Field>
                    <Field label="Chức vụ / Vị trí việc làm"><select value={cur.position || ''} disabled={!(canManage || mgrEditable)} onChange={(e) => upCur(isSonHa ? { position: e.target.value, type: sonhaTypeOf({ position: e.target.value }) } : { position: e.target.value })} className="inp disabled:bg-slate-50 disabled:text-slate-500"><option value="">— Chọn chức vụ —</option>{posOptions(cur.department).map((p) => <option key={p} value={p}>{p}</option>)}{cur.position && !posOptions(cur.department).includes(cur.position) && <option value={cur.position}>{cur.position}</option>}</select></Field>
                    <Field label="Email đăng nhập (để cán bộ tự đánh giá)"><input value={cur.email || ''} disabled={!canManage} onChange={(e) => upCur({ email: e.target.value })} placeholder="ten@coquan.gov.vn" className="inp disabled:bg-slate-50 disabled:text-slate-500" /></Field>
                    {canManage && <Field label="Vai trò (quyền truy cập)"><select value={cur.role || 'canbo'} onChange={(e) => upCur({ role: e.target.value })} className="inp"><option value="canbo">Cán bộ — tự đánh giá phần mình</option><option value="truongphong">Trưởng phòng — duyệt trong phòng</option><option value="quantri">Quản trị — toàn quyền</option></select></Field>}
                  </div>
                  {isSonHa ? (() => { const mk = sonhaMauKey(cur); const m = SONHA_MAU[mk]; return (
                    <Field label="Nhóm đối tượng đánh giá (Mẫu) — tự xác định theo chức vụ" className="mt-3">
                      <div className="rounded-xl border-2 border-emerald-500 bg-emerald-50 p-3 flex items-start gap-3">
                        <span className="shrink-0 w-11 h-11 rounded-lg bg-emerald-600 text-white flex flex-col items-center justify-center leading-none"><span className="text-[9px] font-semibold">Mẫu</span><span className="text-base font-extrabold">{m.code}</span></span>
                        <div className="min-w-0"><p className="text-sm font-bold text-emerald-800">{m.name}</p><p className="text-xs text-slate-600 mt-0.5">Chức vụ áp dụng: {m.role}. Kết quả thực hiện nhiệm vụ (Nhóm II) hiển thị đúng danh mục của Mẫu này.</p></div>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1.5">Bản SonHa gán nhóm đối tượng theo chức vụ đã chọn — không cần chọn nhóm thủ công. Đổi chức vụ ở trên sẽ tự đổi Mẫu.</p>
                    </Field>
                  ); })() : isKD ? null : (
                    <Field label="Nhóm đối tượng đánh giá" className="mt-3">
                      <div className="grid sm:grid-cols-3 gap-2">
                        {CRITERIA_ORDER.map((k) => [k, CRITERIA[k]]).map(([k, v]) => (<button key={k} disabled={!(canManage || mgrEditable || selfEditable)} onClick={() => upCur({ type: k, selfScores: {}, mgrScores: {} })} className={`text-left p-3 rounded-xl border-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed ${cur.type === k ? 'border-red-600 bg-red-50' : 'border-slate-200 hover:border-slate-300'}`}><span className={`text-[11px] font-bold ${cur.type === k ? 'text-red-700' : 'text-slate-400'}`}>{v.mau}</span><p className="text-xs font-medium text-slate-700 leading-snug mt-0.5">{v.label}</p></button>))}
                      </div>
                    </Field>
                  )}
                </section>}
                {isSG && <SingaporeAppraisal person={cur} c={curC} objectives={objectives} selfEditable={selfEditable} mgrEditable={mgrEditable} onPatch={upCurSG} onWord={doSGWord} />}
                {isKD && <KiemDiemAppraisal person={cur} c={curC} selfEditable={selfEditable} mgrEditable={mgrEditable} onPatch={upCurKD} onWord={doKDWord}
                  approval={{ approved: !!cur.approved, by: cur.approvedBy, role: cur.approvedRole, at: cur.approvedAt, canApprove: mgrEditable && !isGuest, onToggle: toggleApprove }} />}
                {!isSG && !isKD && (<>
                {isSonHa && <SonHaConnectors canEdit={taskEditable} />}
                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-5 py-3.5 flex items-center justify-between"><h2 className="flex items-center gap-2 font-bold"><ClipboardList className="w-5 h-5 text-amber-300" /> Nhóm I — Tiêu chí chung</h2><div className="flex items-center gap-3 text-sm"><span className="text-slate-300">Tự: <b className="text-white">{curC.nself.toFixed(1)}</b></span><span className="text-amber-300 font-bold">Duyệt: {curC.nmgr.toFixed(1)}/30</span></div></div>
                  <div className="px-4 pt-3 flex justify-end gap-2 text-[11px] font-bold text-slate-400 pr-2"><span className="w-16 text-center">TỰ ĐG</span><span className="w-16 text-center text-red-600">CẤP DUYỆT</span></div>
                  <div className="p-4 pt-2 space-y-4">
                    {cfg.groups.map((g) => { const sub = g.items.reduce((s, it) => s + clamp(cur.mgrScores[it.id] ?? cur.selfScores[it.id] ?? it.max, 0, it.max), 0);
                      return (<div key={g.id} className="border border-slate-200 rounded-xl overflow-hidden"><div className="bg-slate-50 px-4 py-2.5 flex items-center justify-between gap-2"><p className="text-sm font-semibold text-slate-700">{g.title}</p><span className="shrink-0 text-xs font-bold text-red-700 bg-red-50 px-2 py-1 rounded-md border border-red-100">{sub.toFixed(1)}/{g.max}</span></div>
                        <div className="divide-y divide-slate-100">{g.items.map((it) => { const sv = clamp(cur.selfScores[it.id] ?? it.max, 0, it.max); const mv = clamp(cur.mgrScores[it.id] ?? sv, 0, it.max);
                          return (<div key={it.id} className="px-4 py-3"><div className="flex items-start gap-3"><span className="shrink-0 text-xs font-bold text-slate-400 w-7 pt-1.5">{it.id}</span><button onClick={() => setOpen(open === it.id ? null : it.id)} className="flex-1 text-left text-sm text-slate-600 hover:text-slate-900 flex items-start gap-1 pt-1"><span className={open === it.id ? '' : 'line-clamp-1'}>{it.text}</span><ChevronDown className={`w-4 h-4 shrink-0 text-slate-300 mt-0.5 transition-transform ${open === it.id ? 'rotate-180' : ''}`} /></button><div className="shrink-0 flex gap-2"><input type="number" min="0" max={it.max} step="0.25" value={sv} disabled={!selfEditable} onChange={(e) => upCur({ selfScores: { ...cur.selfScores, [it.id]: clamp(Number(e.target.value), 0, it.max) } })} className="w-16 text-center text-slate-600 bg-slate-50 border border-slate-200 rounded-lg py-1 text-sm outline-none focus:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed" /><input type="number" min="0" max={it.max} step="0.25" value={mv} disabled={!mgrEditable} onChange={(e) => upCur({ mgrScores: { ...cur.mgrScores, [it.id]: clamp(Number(e.target.value), 0, it.max) } })} className="w-16 text-center font-bold text-red-700 bg-red-50 border border-red-200 rounded-lg py-1 text-sm outline-none focus:border-red-400 disabled:opacity-50 disabled:cursor-not-allowed" /></div></div>{open === it.id && <p className="mt-2 ml-10 text-xs text-slate-500 bg-slate-50 rounded-lg p-2.5 leading-relaxed">Điểm tối đa: {it.max}. {it.text}</p>}</div>); })}</div>
                      </div>); })}
                  </div>
                </section>
                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-red-800 to-red-700 text-white px-5 py-3.5 flex items-center justify-between"><h2 className="flex items-center gap-2 font-bold"><Target className="w-5 h-5 text-amber-300" /> Nhóm II — Kết quả thực hiện nhiệm vụ</h2><span className="text-amber-300 font-bold text-sm">{curC.nhomII.toFixed(2)} / 70</span></div>
                  <div className="p-4">
                    {taskEditable && !isSonHa && <button onClick={doCollectTracking} className="mb-3 w-full flex items-center justify-center gap-2 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-lg text-xs font-semibold transition-colors"><RotateCcw className="w-3.5 h-3.5" /> Thu thập nhiệm vụ từ Bảng theo dõi CV</button>}
                    {isSonHa && <div className="mb-3 bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-xs text-emerald-900/90 leading-relaxed space-y-1"><p><b>Cách chấm theo kết quả:</b> mỗi nhiệm vụ chọn từ <b>danh mục theo Mẫu (chức vụ)</b>, rồi đánh giá theo <b>3 tiêu chí khách quan</b> (bộ ba KPI của NĐ 335/2025): <b>① Số lượng</b> = SL hoàn thành / SL giao · <b>② Chất lượng</b> (Đạt chuẩn 100% · Có sai sót 75% · Chưa đạt 50%) · <b>③ Tiến độ</b> (Đúng hạn 100% · Chậm ít 80% · Trễ hạn 50%). Hệ thống tự <b>tính Kết quả nhiệm vụ = (① + ② + ③) ÷ 3</b> và <b>suy ra Mức độ hoàn thành</b> (Xuất sắc/Tốt/Cơ bản/Chưa/Không). Cán bộ tự đánh giá, <b>cấp duyệt</b> rà soát chốt lại (mặc định kế thừa). Kèm <b>Tầm quan trọng</b> (Thường ×1 · Quan trọng ×1,5 · Trọng tâm ×2). Điểm Nhóm II = <b>trung bình có trọng số</b> kết quả các nhiệm vụ (trọng số = hệ số danh mục × tầm quan trọng).</p><p><b>▲ Thưởng vượt mức:</b> nhiệm vụ <b>làm vượt định mức + đạt chuẩn + đúng hạn</b> được cộng <b>điểm thưởng</b> — <b>+0,1 điểm cho mỗi 1% tỷ trọng</b> nhiệm vụ vượt mức, <b>tối đa +5 điểm</b> (tổng vẫn ≤ 100). Cơ chế nhỏ, có trần để khuyến khích làm vượt yêu cầu mà không khuyến khích khai khống.</p></div>}
                    {isClassic && !isSonHa
                      ? <p className="text-xs text-slate-500 mb-3 bg-amber-50 border border-amber-100 rounded-lg p-2.5">Chọn công việc từ danh mục và liên kết mục tiêu (OKR). Đánh giá theo đếm khách quan: Lỗi chất lượng (+1 = −25%), Chậm tiến độ (+1 = −25%). Cách quy đổi theo trọng số xem ở tab Hướng dẫn.</p>
                      : isClassic ? null
                      : <div className="mb-3 bg-indigo-50 border border-indigo-100 rounded-lg p-2.5 text-xs text-indigo-900/90 leading-relaxed space-y-1.5">
                          <p>Nhiệm vụ được <b>gom theo Mục tiêu</b> của cơ quan; mỗi nhiệm vụ ghi rõ <b>Kết quả/sản phẩm cần đạt</b> (tiêu chuẩn nghiệm thu) để hai bên chấm giống nhau.</p>
                          <p><b>Điểm mỗi nhiệm vụ = (Khối lượng + Chất lượng + Tiến độ) ÷ 3</b> — ba mặt bình đẳng: <b>a</b> = SL hoàn thành ÷ SL giao; <b>b</b> = 100% trừ 25% mỗi lần sai sót lớn; <b>c</b> = 100% trừ 25% mỗi lần trễ hạn. Làm nhiều nhưng sai/chậm cũng không đạt cao; đúng – đủ – đúng hạn mới đạt 100%. <span className="text-indigo-700">(Cách tính theo Nghị định 335/2025/NĐ-CP, áp dụng từ 01/01/2026.)</span></p>
                          <p><b>Mục tiêu (OKR) chỉ để định hướng — KHÔNG dùng tính điểm</b>; gắn mục tiêu là khuyến khích (có thể để "việc thường xuyên"). Di chuột vào nhãn <span className="text-slate-500">ⓘ</span> ở mỗi ô để xem định nghĩa và ví dụ.</p>
                        </div>}
                    {isClassic
                      ? (<><div className="space-y-3">{(cur.tasks335 || []).map((t, i) => renderTask335Row(t, i))}</div>
                          {taskEditable && <button onClick={() => upCur({ tasks335: [...(cur.tasks335 || []), newTask335()] })} className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-slate-300 rounded-xl text-sm font-medium text-slate-500 hover:border-red-400 hover:text-red-600"><Plus className="w-4 h-4" /> Thêm nhiệm vụ</button>}</>)
                      : (<><div className="space-y-3">{renderGroupedTasks()}</div>
                          {taskEditable && <button onClick={() => upCur({ tasks335: [...(cur.tasks335 || []), newTask335()] })} className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-slate-300 rounded-xl text-sm font-medium text-slate-500 hover:border-indigo-400 hover:text-indigo-600"><Plus className="w-4 h-4" /> Thêm nhiệm vụ (chưa gắn mục tiêu)</button>}</>)}
                    {curC.leaderFormula && (
                      <div className="mt-4 rounded-xl border border-red-200 bg-red-50/60 p-3">
                        <p className="text-[11px] font-bold text-red-700 flex items-center gap-1.5 mb-2"><ShieldCheck className="w-3.5 h-3.5" /> Tiêu chí lãnh đạo, quản lý (Điều 7) — Điểm KQ = (a + b + c + d + đ + e) ÷ 6</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {[['d', 'd — Kết quả lĩnh vực/đơn vị phụ trách'], ['dd', 'đ — Khả năng tổ chức triển khai nhiệm vụ'], ['e', 'e — Năng lực tập hợp, đoàn kết nội bộ']].map(([key, lb]) => (
                            <label key={key} className="block"><span className="text-[11px] font-medium text-slate-600">{lb}</span>
                              <select value={(cur.leadScores || {})[key] ?? 100} disabled={!taskEditable} onChange={(e) => upLead(key, Number(e.target.value))} className="mt-1 w-full text-xs p-1.5 border border-slate-200 rounded-lg bg-white outline-none focus:border-red-400 disabled:opacity-60 disabled:cursor-not-allowed">
                                <option value={100}>Đạt (100%)</option>
                                <option value={50}>Hạn chế (50%)</option>
                              </select>
                            </label>
                          ))}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1.5">d: 100% nếu 100% cán bộ thuộc quyền đạt "Hoàn thành nhiệm vụ" trở lên, 50% nếu có người không hoàn thành. đ/e: 100% nếu triển khai tốt/đoàn kết, 50% nếu chậm trễ kéo dài hoặc mất đoàn kết nội bộ (Điều 7 khoản 2).</p>
                      </div>
                    )}
                    {isSonHa
                      ? <div className="mt-4 rounded-lg py-3 border bg-emerald-50 border-emerald-200 text-center"><p className="text-[11px] text-emerald-600">Điểm kết quả nhiệm vụ (Nhóm II) — trung bình có trọng số kết quả các nhiệm vụ (Số lượng + Chất lượng + Tiến độ)/3</p><p className="font-extrabold text-emerald-700 text-lg">{Number(curC.k.val).toFixed(1)}%</p></div>
                      : <div className={`mt-4 grid ${curC.leaderFormula ? 'grid-cols-3 sm:grid-cols-7' : 'grid-cols-2 sm:grid-cols-4'} gap-2 text-center`}>{[['Khối lượng (a)', curC.k.a], ['Chất lượng (b)', curC.k.b], ['Tiến độ (c)', curC.k.c], ...(curC.leaderFormula ? [['Lĩnh vực (d)', curC.k.d ?? 100], ['Tổ chức (đ)', curC.k.dd ?? 100], ['Đoàn kết (e)', curC.k.e ?? 100]] : []), ['Điểm KQ', curC.k.val]].map(([l, v], idx, arr) => { const last = idx === arr.length - 1; return (<div key={l} className={`${last ? 'bg-red-50 border-red-200 text-red-700' : 'bg-slate-50 border-slate-100 text-slate-700'} rounded-lg py-2 border`}><p className={`text-[11px] ${last ? 'text-red-500' : 'text-slate-500'}`}>{l}</p><p className="font-bold">{Number(v).toFixed(1)}%</p></div>); })}</div>}
                  </div>
                </section>

                <GradeExplain c={curC} disciplined={cur.disciplined} tasks={cur.tasks335} />

                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
                  <div><h2 className="flex items-center gap-2 font-bold text-slate-800 mb-2"><AlertTriangle className="w-5 h-5 text-amber-600" /> Điểm trừ</h2><div className="flex items-center gap-3"><input type="number" min="0" value={cur.deduction} disabled={!mgrEditable} onChange={(e) => upCur({ deduction: e.target.value })} className="inp w-32 disabled:bg-slate-50 disabled:text-slate-500" /><span className="text-sm text-slate-500">điểm — trừ trực tiếp vào tổng điểm theo mức độ vi phạm (cấp duyệt nhập).</span></div></div>
                  <label className={`flex items-start gap-2.5 rounded-xl border p-3 ${cur.disciplined ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-slate-50'}`}>
                    <input type="checkbox" checked={!!cur.disciplined} disabled={!mgrEditable} onChange={(e) => upCur({ disciplined: e.target.checked })} className="mt-0.5 w-4 h-4 accent-rose-600 disabled:opacity-50" />
                    <span className="text-sm text-slate-600">Bị <b>xử lý kỷ luật đảng/hành chính</b> hoặc bị kết luận <b>suy thoái, vi phạm liên quan công vụ</b> trong kỳ. <span className="text-rose-600 font-semibold">Khi tích, hệ thống xếp loại thẳng "Không hoàn thành nhiệm vụ"</span> theo Điều 8 khoản 4 — đây là <b>điều kiện chốt mức loại, KHÔNG trừ vào tổng điểm</b> (tổng điểm vẫn phản ánh khối lượng, chất lượng công việc đã làm). Muốn trừ điểm cụ thể, dùng ô <b>Điểm trừ</b> ở trên.</span>
                  </label>
                  <Field label="Ý kiến tự nhận xét của cá nhân"><textarea value={cur.selfNote} disabled={!selfEditable} onChange={(e) => upCur({ selfNote: e.target.value })} rows={2} className="inp disabled:bg-slate-50 disabled:text-slate-500" /></Field>
                  <Field label="Nhận xét, kết luận của cấp có thẩm quyền"><textarea value={cur.mgrNote} disabled={!mgrEditable} onChange={(e) => upCur({ mgrNote: e.target.value })} rows={2} className="inp disabled:bg-slate-50 disabled:text-slate-500" /></Field>
                </section>
                </>)}
              </div>
              {!isSG && !isKD && (<aside className="lg:col-span-1"><div className="lg:sticky lg:top-4 space-y-4">
                <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
                  <div className={`${result.cls} text-white text-center py-5`}><p className="text-xs opacity-90 uppercase tracking-wider">Tổng điểm (cấp duyệt)</p><p className="text-5xl font-extrabold mt-1">{curC.totalMgr.toFixed(2)}</p><p className="text-sm opacity-90">Tự đánh giá: {curC.totalSelf.toFixed(2)} / 100</p></div>
                  <div className="p-4 text-center border-b border-slate-100"><span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-bold text-sm ${result.soft}`}><span className="w-7 h-7 rounded-full bg-white/60 flex items-center justify-center font-extrabold">{result.code}</span>{result.name}</span></div>
                  {(() => { const sc = gradeFromScore(curC.totalMgr); const rank = { A: 4, B: 3, C: 2, D: 1 }; if (rank[sc] <= rank[curC.grade]) return null; return (
                    <div className="px-4 pt-3"><div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-[11px] text-rose-800 leading-relaxed"><p className="font-bold flex items-center gap-1.5 mb-1"><AlertTriangle className="w-3.5 h-3.5" /> Chênh lệch điểm số và xếp loại</p>Tổng điểm <b>{curC.totalMgr.toFixed(2)}</b> tương ứng mức <b>{GRADES[sc].code} — {GRADES[sc].name}</b> theo ngưỡng điểm, nhưng theo <b>điều kiện định lượng Điều 8</b> chỉ được xếp <b>{result.code} — {result.name}</b>. Điểm số phản ánh khối lượng/chất lượng công việc; xếp loại phản ánh mức độ hoàn thành theo quy định — xem lý do bên dưới.</div></div>
                  ); })()}
                  <div className="p-4 space-y-2.5 text-sm"><SumRow label="Nhóm I — Tiêu chí chung" value={`${curC.nmgr.toFixed(2)} / 30`} /><SumRow label="Điểm KPI quy đổi" value={`${curC.k.val.toFixed(1)}%`} /><SumRow label="Nhóm II — Kết quả (× 70%)" value={`${curC.nhomII.toFixed(2)} / 70`} /><SumRow label="Điểm trừ" value={`− ${Number(cur.deduction || 0).toFixed(2)}`} danger />{isSonHa && (curC.bonus > 0 || curC.exceedPct > 0) && (<div className="flex justify-between items-center"><span className="text-emerald-700 flex items-center gap-1">▲ Điểm thưởng vượt mức <span className="text-[10px] text-emerald-500" title="Tỷ trọng nhiệm vụ đạt mức Xuất sắc (vượt yêu cầu) theo trọng số">({curC.exceedPct.toFixed(0)}%)</span></span><span className="font-bold text-emerald-700">+ {curC.bonus.toFixed(2)}</span></div>)}<div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-slate-800"><span>Tổng cộng</span><span className={result.ring}>{curC.totalMgr.toFixed(2)}</span></div></div>
                  {curC.gradeReasons && curC.gradeReasons.length > 0 && (
                    <div className="px-4 pb-4">
                      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                        <p className="text-[11px] font-bold text-amber-800 flex items-center gap-1.5 mb-1.5"><AlertTriangle className="w-3.5 h-3.5" /> Điều kiện xếp loại (Điều 8)</p>
                        <ul className="list-disc pl-4 space-y-1 text-[11px] text-amber-800 leading-relaxed">{curC.gradeReasons.map((r, i) => <li key={i}>{r}</li>)}</ul>
                      </div>
                    </div>
                  )}
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3 space-y-2">
                  {/* Trạng thái phê duyệt của cấp có thẩm quyền */}
                  {cur.approved ? (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-[12px] text-emerald-800">
                      <p className="flex items-center gap-1.5 font-semibold"><CheckCircle2 className="w-4 h-4" /> Đã phê duyệt</p>
                      <p className="mt-0.5 leading-snug">Bởi <b>{cur.approvedBy || '—'}</b>{cur.approvedRole ? ` (${cur.approvedRole})` : ''}{cur.approvedAt ? `, ngày ${cur.approvedAt}` : ''}.</p>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-[12px] text-amber-800">
                      <p className="flex items-center gap-1.5 font-semibold"><AlertTriangle className="w-4 h-4" /> Chưa phê duyệt</p>
                      <p className="mt-0.5 leading-snug">Phiếu chính thức cần cấp có thẩm quyền phê duyệt.</p>
                    </div>
                  )}
                  {mgrEditable && !isGuest && (
                    cur.approved
                      ? <button onClick={toggleApprove} className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl"><RotateCcw className="w-4 h-4" /> Bỏ phê duyệt</button>
                      : <button onClick={doApproveAndWord} className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl"><CheckCircle2 className="w-4 h-4" /> Phê duyệt & xuất phiếu</button>
                  )}
                  <button onClick={doWord} className="w-full flex items-center justify-center gap-2 bg-sky-700 hover:bg-sky-800 text-white font-semibold py-2.5 rounded-xl"><FileText className="w-4 h-4" /> Xuất phiếu Word (đầy đủ)</button>
                  <button onClick={() => window.print()} className="w-full flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white font-semibold py-2.5 rounded-xl"><Printer className="w-4 h-4" /> In phiếu (PDF)</button>
                  {(canManage || mgrEditable) && <button onClick={() => { if (!window.confirm('Đặt lại toàn bộ điểm và nhiệm vụ của cán bộ này về mặc định?')) return; upCur({ selfScores: {}, mgrScores: {}, deduction: 0, disciplined: false, tasks335: [newTask335()], leadScores: { d: 100, dd: 100, e: 100 }, selfNote: '', mgrNote: '', approved: false, approvedBy: '', approvedRole: '', approvedAt: '' }); }} className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl"><RotateCcw className="w-4 h-4" /> Đặt lại cán bộ này</button>}
                </div>
              </div></aside>)}
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
                {(!readOnly || isGuest) && <button onClick={() => { const np = newPerson('Cán bộ mới', 'staff'); setPeople(ps => [...ps, np]); setCurId(np.id); }} className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 text-slate-500 text-sm font-medium hover:bg-slate-100 hover:text-slate-700 transition-colors border-t border-slate-100"><UserPlus className="w-4 h-4" /> Thêm cán bộ</button>}
              </div>
            </aside>
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><ClipboardList className="w-5 h-5 text-amber-500" /> Bảng kiểm đếm, theo dõi công việc</h2>
                  <p className="text-sm text-slate-500 mt-1">{getWeekTitle(new Date(trackingDate))}</p>
                  {canManage && <p className="text-[11px] text-slate-400 mt-0.5">Nguồn đồng bộ: {sheetSync.url ? <a href={sheetSync.url} target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline">Google Sheet</a> : <span>Google Sheet</span>}{sheetSync.at ? ` · Đã đồng bộ lúc ${new Date(sheetSync.at).toLocaleString('vi-VN')}` : ' · Bấm "Đồng bộ từ Google Sheet" để nạp dữ liệu mới nhất'}</p>}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <input type="date" value={trackingDate} onChange={(e) => setTrackingDate(e.target.value)} className="text-xs px-2 py-1.5 border border-slate-200 rounded outline-none focus:border-amber-400" />
                  {canManage && <button onClick={syncFromSheet} disabled={sheetSync.busy} title="Nạp dữ liệu kiểm đếm mới nhất từ Google Sheet" className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 rounded-lg text-xs font-semibold transition-colors"><Cloud className="w-3.5 h-3.5" /> {sheetSync.busy ? 'Đang đồng bộ...' : 'Đồng bộ từ Google Sheet'}</button>}
                  {taskEditable && <button onClick={doCollectTracking} title="Tạo nhiệm vụ Nhóm II từ các công việc đã gắn Danh mục" className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg text-xs font-semibold transition-colors"><RotateCcw className="w-3.5 h-3.5" /> Thu thập vào đánh giá KPI</button>}
                  <button onClick={doExportTracking} className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-semibold transition-colors border border-red-200"><FileText className="w-3.5 h-3.5" /> Xuất bảng (PDF)</button>
                </div>
              </div>
              {/* Khách ĐƯỢC thao tác bảng kiểm đếm để demo (không lưu DB); chỉ khóa khi read-only thực sự */}
              <fieldset disabled={readOnly && !isGuest} className="contents">
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
                            {(isSonHa ? sonhaGroupsOf(cur) : getND335Groups(cur.type)).map((c) => (<option key={c.id} value={c.id}>[{c.id}] {c.name}</option>))}
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

        {tab === 'admin' && canManage && (
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><ShieldCheck className="w-6 h-6 text-blue-700" /> Quản trị hệ thống</h2>
              <p className="text-sm text-slate-500 mt-1">Khu vực dành riêng cho Quản trị viên. Xuất các tài liệu mô tả hệ thống dưới dạng PDF (mở cửa sổ in → chọn “Lưu thành PDF”). Tài liệu hỗ trợ đầy đủ tiếng Việt, có đánh số trang, header/footer và bảng kẻ vằn.</p>
              <p className="text-sm mt-2 inline-flex items-center gap-2"><span className="font-semibold text-slate-600">Tài liệu xuất tương ứng phiên bản đang dùng:</span> <span className={`text-xs font-bold px-2 py-0.5 rounded border ${isSG ? 'bg-violet-50 text-indigo-700 border-violet-200' : isImproved ? 'bg-cyan-50 text-cyan-700 border-cyan-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{vName(version)}</span></p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-[240px]">
                <h3 className="font-bold text-slate-800 flex items-center gap-2"><FileText className="w-5 h-5 text-blue-700" /> Tài liệu kỹ thuật & vận hành hệ thống</h3>
                <p className="text-sm text-slate-500 mt-1">Mô tả chi tiết: Tổng quan hệ thống · Kiến trúc kỹ thuật & luồng dữ liệu (Tech Stack, React/Vite/Supabase/Vercel) · Cấu trúc CSDL & API · Quy trình sao lưu, bảo mật (SSL/TLS, JWT, RLS) và giám sát lỗi.</p>
              </div>
              <button onClick={doExportSystemDoc} className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl text-sm transition-colors"><FileText className="w-4 h-4" /> Xuất PDF</button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-[240px]">
                <h3 className="font-bold text-slate-800 flex items-center gap-2"><BookOpen className="w-5 h-5 text-blue-700" /> Phương pháp tính, đánh giá {isSG ? '(mô hình Singapore)' : 'OKR/KPI'}</h3>
                <p className="text-sm text-slate-500 mt-1">{isSG
                  ? 'Tài liệu nghiệp vụ cho phiên bản Singapore: hai tầng đánh giá · Bảng điểm thiết chế (dải màu) · Phiếu cá nhân Work Review + Năng lực (AIM) + Giá trị (ISE) · công thức tổng hợp 60/25/15 & xếp loại A–E · Tiềm năng CEP · nguyên tắc không chấm điểm đại biểu dân cử.'
                  : isImproved
                  ? 'Tài liệu nghiệp vụ (bản Cải tiến): căn cứ & nguyên tắc · thang điểm · Nhóm I (AIM/ISE) · Nhóm II công thức a/b/c (lãnh đạo d/đ/e) gom theo Mục tiêu (OKR) · điều kiện xếp loại Điều 8 · ghi chú theo Nghị định 335/2025.'
                  : 'Tài liệu nghiệp vụ trình bày như văn bản hành chính: căn cứ & nguyên tắc · thang điểm · Nhóm I/Nhóm II và công thức a/b/c (lãnh đạo d/đ/e) · hệ số N1–N5 · điều kiện xếp loại Điều 8 · quy trình & mốc thời gian.'}</p>
              </div>
              <button onClick={doExportOKRMethod} className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl text-sm transition-colors"><FileText className="w-4 h-4" /> Xuất PDF</button>
            </div>

            <p className="text-xs text-slate-400 text-center">Mẹo: trong hộp thoại in, chọn “Lưu dưới dạng PDF” (Save as PDF) và bật “Đồ họa nền” (Background graphics) để giữ màu nền bảng.</p>
          </div>
        )}

        {tab === 'guide' && (
          <div className="space-y-6 max-w-3xl mx-auto">
          {/* Trang này đi sâu công thức của phân hệ đang dùng; hướng dẫn chung toàn hệ thống ở #/hotro */}
          <div className="bg-slate-800 text-white rounded-2xl p-4 flex items-center justify-between gap-3 flex-wrap">
            <p className="text-[13px] leading-snug">Đây là hướng dẫn <b>chi tiết công thức</b> của phân hệ đang dùng. Cần hướng dẫn chung toàn hệ thống (các phân hệ, tài khoản, quy trình, cơ sở pháp lý, hỏi đáp)?</p>
            <a href="#/hotro" className="shrink-0 flex items-center gap-1.5 text-[12px] font-bold px-3 py-2 rounded-lg bg-white text-slate-800 hover:bg-slate-100"><BookOpen className="w-4 h-4" /> Hướng dẫn toàn hệ thống</a>
          </div>
          <ContactCard />
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><BookOpen className="w-6 h-6 text-red-700" /> Hướng dẫn sử dụng & cách tính điểm</h2>
                <p className="text-sm text-slate-500 mt-1">Tài liệu minh bạch toàn bộ công thức và quy trình. Nội dung hiển thị <b>theo đúng phiên bản đang dùng</b>.</p>
              </div>
              {!isSG && !isKD && !isSonHa && <button onClick={doExportGuide} title="Mở sổ tay hướng dẫn đầy đủ để in hoặc lưu thành PDF" className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-xl text-sm transition-colors"><FileText className="w-4 h-4" /> Tải sổ tay hướng dẫn (PDF)</button>}
            </div>

            <div className={`rounded-xl border p-4 ${isKD ? 'bg-rose-50 border-rose-200' : isSG ? 'bg-violet-50 border-violet-200' : isImproved ? 'bg-cyan-50 border-cyan-200' : 'bg-red-50 border-red-200'}`}>
              <p className={`font-bold mb-1 ${isKD ? 'text-rose-800' : isSG ? 'text-indigo-800' : isImproved ? 'text-cyan-800' : 'text-red-800'}`}>Đang xem hướng dẫn cho: Phiên bản {vName(version)}</p>
              <p className="text-sm text-slate-700 leading-relaxed">{isKD
                ? 'Đánh giá định kỳ HẰNG QUÝ đối với cán bộ lãnh đạo, quản lý diện Ban Thường vụ Tỉnh ủy quản lý — theo Hướng dẫn 03-HD/TU ngày 02/7/2026. Thang 100 = Nhóm A (30đ, tiêu chí chung, chấm điểm theo thang từng mục) + Nhóm B (70đ, kết quả nhiệm vụ theo 6 trục trọng tâm, mỗi trục Điểm = KPI% × điểm tối đa với KPI = (A+B+C+D)/4). Xếp loại 4 mức HTXS/HTT/HT/Không HT. Sản phẩm: bản tự đánh giá cá nhân (Phụ lục 3A) và bảng tổng hợp tập thể (Phụ lục 4).'
                : isSG
                ? 'Mô hình quản lý hiệu suất khu vực công Singapore (THAM KHẢO) — KHÔNG dùng thang 30/70 và Điều 8. Đánh giá theo HAI tầng: (A) Bảng điểm THIẾT CHẾ của cơ quan chấm theo dải màu Xanh/Vàng/Đỏ; (B) Phiếu CÁ NHÂN gồm Kết quả công việc (Work Review) + Năng lực (AIM) + Giá trị (ISE) → Xếp loại A–E, kèm Tiềm năng (CEP). Đại biểu dân cử không chấm điểm cá nhân.'
                : isImproved
                ? 'Cùng khung điểm 100 và điều kiện xếp loại Điều 8 như bản Cổ điển, nhưng câu hỏi Nhóm I viết lại theo hướng dễ hiểu (năng lực AIM, giá trị Liêm chính–Phục vụ–Xuất sắc); Nhóm II gom theo Mục tiêu (OKR) và bổ sung ô "Kết quả cần đạt". Số liệu Nhóm II khớp Nghị định 335/2025/NĐ-CP.'
                : 'Bộ tiêu chí theo Quyết định số 1053-QĐ/TU (giữ nguyên câu chữ pháp lý). Thang 100 điểm: Nhóm I (tối đa 30) + Nhóm II (tối đa 70) − Điểm trừ; xếp loại 4 mức theo điều kiện Điều 8. Hướng dẫn chi tiết bên dưới.'}</p>
            </div>

            {isSG && (<>
            <GB icon={Award} title="1. Tổng quan: mô hình đánh giá Singapore (tham khảo)">
              <p>Phiên bản Singapore mô phỏng cách khu vực công Singapore quản lý hiệu suất, để <b>tham khảo, học hỏi</b>. Khác với bản Cổ điển/Cải tiến, phiên bản này <b>không dùng thang 30/70 hay Điều 8</b>. Việc đánh giá tách thành hai tầng độc lập:</p>
              <ul className="list-disc pl-5 space-y-1 mt-1">
                <li><b>Tầng A — Thiết chế:</b> chấm KPI của cả cơ quan (xem tab Tổng quan), mỗi chỉ số xếp dải màu riêng.</li>
                <li><b>Tầng B — Cá nhân:</b> phiếu đánh giá từng công chức (tab Đánh giá).</li>
              </ul>
              <p className="mt-2 bg-violet-50 border border-violet-100 rounded-lg p-2.5 text-[13px]"><b>Nguyên tắc cốt lõi:</b> đại biểu dân cử (HĐND/Quốc hội) <b>không bị chấm điểm cá nhân</b> — họ chịu trách nhiệm trước cử tri qua bầu cử và sự minh bạch. Chỉ đánh giá thiết chế phục vụ và công chức.</p>
            </GB>
            <GB icon={Compass} title="2. Tầng A — Bảng điểm THIẾT CHẾ (dải màu Xanh/Vàng/Đỏ)">
              <p>Mô phỏng <b>Town Council Management Report</b> của Singapore: chấm các chỉ số của cơ quan, mỗi chỉ số xếp <b>một dải màu riêng</b> (không gộp thành một điểm tổng), công bố theo kỳ để minh bạch. Năm chỉ số mặc định:</p>
              <ul className="list-disc pl-5 space-y-1 mt-1">
                <li>Phục vụ kỳ họp (tỷ lệ tài liệu đúng hạn);</li>
                <li>Văn bản tham mưu đúng hạn;</li>
                <li>Xử lý kiến nghị cử tri đúng hạn;</li>
                <li>Mức hài lòng về phục vụ (khảo sát);</li>
                <li>Minh bạch & quản trị (điểm vi phạm, càng thấp càng tốt).</li>
              </ul>
              <p className="mt-2"><b>Xanh</b> = tốt · <b>Vàng</b> = cần cải thiện · <b>Đỏ</b> = yếu. Quản trị nhập số liệu từng kỳ; ngưỡng dải màu có thể điều chỉnh.</p>
            </GB>
            <GB icon={BarChart3} title="3. Tầng B — Phiếu cá nhân: Kết quả + Năng lực + Giá trị">
              <p>Mỗi công chức được đánh giá trên phiếu gồm:</p>
              <ul className="list-disc pl-5 space-y-1 mt-1">
                <li><b>Work Review (Kết quả công việc):</b> các mục tiêu công việc gắn OKR, mỗi mục tiêu có "Kết quả then chốt" và được cấp trên chấm <b>mức đạt 1–5</b> (có trọng số).</li>
                <li><b>Competencies — Năng lực (AIM):</b> Phân tích & trí tuệ · Ảnh hưởng & hợp tác · Động lực hướng tới xuất sắc (thang 1–5).</li>
                <li><b>Core Values — Giá trị (ISE):</b> Liêm chính · Phục vụ · Xuất sắc (thang 1–5).</li>
              </ul>
            </GB>
            <GB icon={TrendingUp} title="4. Cách tính điểm tổng hợp & Xếp loại A–E">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <p className="font-semibold text-slate-700">Điểm tổng hợp = Hiệu suất × 60% + Năng lực (AIM) × 25% + Giá trị (ISE) × 15%</p>
              </div>
              <p className="mt-2">Hệ thống đề xuất <b>Xếp loại A–E</b> (A: Outstanding ≥90 · B: Exceeds 75–89 · C: Meets 55–74 · D: Below 40–54 · E: Unsatisfactory &lt;40). Cấp trên có thể <b>hiệu chỉnh</b> theo xếp hạng tương đối giữa các cán bộ (không áp quota cứng).</p>
            </GB>
            <GB icon={Compass} title="5. Tiềm năng (CEP) — tách riêng khỏi điểm">
              <p><b>Currently Estimated Potential (CEP)</b> là mức trách nhiệm cao nhất ước lượng cán bộ có thể đảm nhận trong 3–5 năm tới. CEP <b>tách riêng</b>, dùng cho quy hoạch, phát triển nhân sự — <b>không cộng vào</b> và không ảnh hưởng điểm/xếp loại của kỳ.</p>
            </GB>
            <GB icon={MessageSquare} title="6. Phát triển, đăng nhập, lưu trữ & nguồn tham khảo">
              <ul className="list-disc pl-5 space-y-1">
                <li><b>Development (CFR/IDP):</b> ghi điểm mạnh, lĩnh vực phát triển, kế hoạch và đối thoại cán bộ ↔ cấp trên.</li>
                <li><b>Đăng nhập & phân quyền, lưu theo kỳ, đa máy:</b> dùng chung cơ chế với các phiên bản khác (email + mật khẩu; vai trò Cán bộ/Trưởng phòng/Quản trị; lưu riêng theo tháng/năm).</li>
                <li><b>Xuất phiếu Word</b> theo bố cục Singapore ở cuối phiếu cá nhân.</li>
                <li><b>Nguồn tham khảo:</b> PSD Singapore (CEP), CSC (giá trị Liêm chính–Phục vụ–Xuất sắc), MND (Town Council Management Report), MOF (SPOR), GovTech (OKR & KPI dịch vụ).</li>
              </ul>
              <p className="mt-2 text-slate-500 text-[13px]">Lưu ý: các trọng số (60/25/15) và ngưỡng dải màu là cách vận dụng hợp lý để tham khảo; Singapore không công bố biểu mẫu chi tiết.</p>
            </GB>
            </>)}

            {isKD && (<>
            <GB icon={Award} title="1. Tổng quan phiên bản Kiểm điểm (HD 03-HD/TU)">
              <p>Phiên bản dùng để <b>đánh giá định kỳ hằng quý</b> đối với cán bộ lãnh đạo, quản lý <b>diện Ban Thường vụ Tỉnh ủy quản lý</b> tại cơ quan Văn phòng Đoàn ĐBQH và HĐND tỉnh (2 Phó Chủ tịch HĐND tỉnh; 4 Trưởng Ban và 4 Phó Trưởng Ban KTNS/VHXH/Pháp chế/Dân tộc; Chánh Văn phòng và 2 Phó Chánh Văn phòng), theo <b>Hướng dẫn 03-HD/TU ngày 02/7/2026</b>.</p>
              <p className="mt-1.5">Chỉ gồm 3 khu vực: <b>Tổng quan</b> (phân bố xếp loại + bảng tổng hợp tập thể — Phụ lục 4), <b>Đánh giá</b> (phiếu cá nhân), <b>Hỗ trợ</b>.</p>
            </GB>
            <GB icon={ShieldCheck} title="2. Nhóm A — Tiêu chí chung (30 điểm)">
              <p>Gồm 3 nhóm, <b>chấm điểm theo thang điểm từng mục</b> (2 cột Tự ĐG · Cấp duyệt), trừ dần khi chưa đạt; cán bộ mới mặc định đạt tối đa (đủ 30đ).</p>
              <ul className="list-disc pl-5 space-y-1 mt-1">
                <li><b>Nhóm 1 (10đ):</b> Phẩm chất chính trị, đạo đức, lối sống, thực hiện trách nhiệm nêu gương (9 mục).</li>
                <li><b>Nhóm 2 (10đ):</b> Tư duy đổi mới, chiến lược, khát vọng cống hiến, dám nghĩ, dám làm (4 mục).</li>
                <li><b>Nhóm 3 (10đ):</b> Tự phê bình và phê bình, tự soi, tự sửa, khắc phục hạn chế, khuyết điểm (4 mục).</li>
              </ul>
              <p className="mt-1.5 text-slate-500 text-[13px]">Cột <b>Cấp duyệt</b> mặc định kế thừa cột <b>Tự ĐG</b>; cán bộ mới mặc định đảm bảo tất cả (đủ 30đ).</p>
            </GB>
            <GB icon={Target} title="3. Nhóm B — Kết quả thực hiện nhiệm vụ (70 điểm), theo 6 trục">
              <p>Điểm mỗi trục = <b>KPI% × điểm tối đa</b>. Điểm tối đa 6 trục: <b>15 · 10 · 10 · 15 · 10 · 10 = 70</b>.</p>
              <p className="mt-1.5 bg-emerald-50 border border-emerald-100 rounded-lg p-2.5 text-[13px]"><b>Cách ghi đơn giản:</b> với mỗi trục, chỉ cần <b>liệt kê các nhiệm vụ trọng tâm đã làm trong quý</b> và chọn <b>Mức độ hoàn thành</b> cho từng việc (Xuất sắc/vượt mức · Hoàn thành tốt · Cơ bản hoàn thành · Chưa hoàn thành · Không hoàn thành), kèm <b>Tầm quan trọng</b> (Thường ×1 · Quan trọng ×1,5 · Trọng tâm ×2). Phần mềm <b>tự tính KPI</b> của trục = trung bình có trọng số các mức độ. Không phải nhập hệ số hay tỷ lệ %. Trục chưa liệt kê nhiệm vụ thì mặc định đạt tối đa.</p>
              <ul className="list-disc pl-5 space-y-1 mt-1">
                {KD_TRUC.map((t) => <li key={t.id}><b>Trục {t.code} ({t.max}đ):</b> {t.name}.</li>)}
              </ul>
              <p className="mt-1.5">Cá nhân xác định trục giữ vai trò <b>chính</b> (đặt nhiệm vụ ở mức Trọng tâm) và trục <b>phối hợp, hỗ trợ</b>. Mức <b>Xuất sắc</b> được tính là nhiệm vụ vượt mức, mức <b>Không hoàn thành</b> là nhiệm vụ không hoàn thành — dùng để xét điều kiện xếp loại (Điều 13).</p>
            </GB>
            <GB icon={ClipboardList} title="4. Xếp loại & quy trình">
              <p>Tổng điểm = Nhóm A + Nhóm B (thang 100). Xếp loại 4 mức: <b>Hoàn thành xuất sắc</b> (≥90 và nổi trội, không thiếu nhiệm vụ) · <b>Hoàn thành tốt</b> (≥70) · <b>Hoàn thành</b> (≥50) · <b>Không hoàn thành</b> (&lt;50).</p>
              <p className="mt-1.5 bg-rose-50 border border-rose-100 rounded-lg p-2.5 text-[13px]">Theo HD 03 (Điểm 6.2): hoàn thành <b>dưới 100%</b> nhiệm vụ được giao trong quý thì xếp loại <b>Không hoàn thành nhiệm vụ</b>, trừ trường hợp khách quan, bất khả kháng được cấp có thẩm quyền xác nhận. Tập thể hoàn thành dưới 70% nhiệm vụ → người đứng đầu Không hoàn thành nhiệm vụ.</p>
              <p className="mt-1.5">Quy trình: cá nhân tự chấm & đề xuất → cấp có thẩm quyền thẩm định, đề xuất → cấp quản lý cán bộ quyết định, phê duyệt. Kết quả hằng quý tích lũy làm căn cứ xếp loại cuối năm.</p>
            </GB>
            <GB icon={FileText} title="5. Sản phẩm xuất ra">
              <ul className="list-disc pl-5 space-y-1">
                <li><b>Bản tự đánh giá, xếp loại của cá nhân (Phụ lục 3A)</b> — nút "Xuất bản tự đánh giá (Word)" ở cuối phiếu Đánh giá.</li>
                <li><b>Bảng tổng hợp kết quả & đề xuất xếp loại quý của tập thể (Phụ lục 4)</b> — nút "Xuất Bảng tổng hợp" ở tab Tổng quan.</li>
              </ul>
            </GB>
            </>)}

            {!isSG && !isKD && (<>
            <GB icon={LayoutDashboard} title={isSonHa ? '1. Ba khu vực (tab) của hệ thống' : '1. Năm khu vực (tab) của hệ thống'}>
              <ul className="list-disc pl-5 space-y-1">
                <li><b>Tổng quan:</b> Mục tiêu OKR cấp Văn phòng, phân bố xếp loại, bảng tổng hợp kết quả (Mẫu 1A) và xu hướng theo kỳ.</li>
                <li><b>Đánh giá:</b> Nơi chấm điểm từng cán bộ — Nhóm I (tiêu chí chung) và Nhóm II (kết quả nhiệm vụ).</li>
                {!isSonHa && <li><b>Năng lực số:</b> Tự đánh giá khung năng lực số (chỉ số phụ trợ, không cộng vào điểm tháng).</li>}
                {!isSonHa && <li><b>Theo dõi CV:</b> Bảng kiểm đếm công việc theo tuần; <b>đồng bộ từ Google Sheet</b>, <b>thu thập</b> thành nhiệm vụ KPI và <b>xuất bảng PDF</b>.</li>}
                <li><b>Hỗ trợ:</b> Thông tin liên hệ, ô gửi ý kiến và trang hướng dẫn này.</li>
              </ul>
              {isSonHa && <p className="mt-1.5 text-slate-500 text-[13px]">Bản OKR/KPI gọn 3 khu vực; danh mục công việc và nhóm đối tượng (Mẫu) <b>tự xác định theo chức vụ</b> của cán bộ.</p>}
            </GB>

            <GB icon={TrendingUp} title="2. Thang điểm tổng — 100 điểm">
              <p className="bg-slate-50 border border-slate-200 rounded-lg p-3 font-semibold text-slate-700">TỔNG = Nhóm I (tối đa 30) + Nhóm II (tối đa 70) − Điểm trừ</p>
              <p className="mt-2">Mỗi cán bộ được chấm 2 cấp: <b>Tự đánh giá</b> (cá nhân tự chấm) và <b>Cấp duyệt</b> (cấp có thẩm quyền quyết định). Điểm xếp loại chính thức lấy theo cột <b>Cấp duyệt</b>.</p>
            </GB>

            <GB icon={ClipboardList} title="3. Nhóm I — Tiêu chí chung (tối đa 30 điểm)">
              <p>Đánh giá phẩm chất chính trị, tư tưởng, đạo đức, ý thức kỷ luật, năng lực, tác phong... theo bộ tiêu chí của từng nhóm đối tượng (theo QĐ số 1053-QĐ/TU ngày 05/6/2026 của Ban Thường vụ Tỉnh ủy Thanh Hóa):</p>
              <ul className="list-disc pl-5 space-y-1 mt-1">
                <li><b>Mẫu 01</b> — Đại biểu HĐND tỉnh hoạt động chuyên trách. <span className="text-slate-500">Dùng chung tiêu chí với nhóm lãnh đạo; Nhóm II tính theo chức vụ.</span></li>
                <li><b>Mẫu 02</b> — Đại biểu Quốc hội hoạt động chuyên trách. <span className="text-slate-500">Tương tự Mẫu 01.</span></li>
                <li><b>Mẫu 03</b> — Cán bộ, công chức, viên chức <b>giữ chức vụ lãnh đạo, quản lý</b> (Phụ lục 03): chính trị tư tưởng (5) + phẩm chất đạo đức, kỷ luật (5) + năng lực lãnh đạo–chuyên môn–tác phong–đổi mới–chuyển đổi số (16) + tín nhiệm, đoàn kết (2) + tự phê bình (2).</li>
                <li><b>Mẫu 04</b> — Công chức, viên chức <b>không giữ chức vụ lãnh đạo</b> (Phụ lục 01): chính trị tư tưởng (5) + phẩm chất đạo đức, kỷ luật (5) + năng lực chuyên môn–thực thi–tác phong–đổi mới–chuyển đổi số (16) + tự phê bình và phê bình (4).</li>
                <li><b>Mẫu 05</b> — Lao động hợp đồng hỗ trợ, phục vụ (Phụ lục 02): chính trị, đạo đức, kỷ luật (15) + năng lực chuyên môn, thực thi (10) + tự phê bình (5).</li>
              </ul>
              <p className="mt-2">Mỗi tiêu chí có điểm tối đa riêng; cộng tất cả tiêu chí, <b>giới hạn không quá 30</b>. Nhập điểm ở 2 cột Tự ĐG và Cấp duyệt; hệ thống lấy cột <b>Cấp duyệt</b> để xếp loại chính thức.</p>
            </GB>

            {isSonHa ? (
            <GB icon={Target} title="4. Nhóm II — Kết quả thực hiện nhiệm vụ (tối đa 70 điểm)">
              <p>Bản OKR/KPI chấm Nhóm II theo <b>kết quả đạt được</b> — dùng đúng <b>bộ ba KPI của NĐ 335/2025</b> (cũng là chuẩn quốc tế: <i>số lượng · chất lượng · thời hạn</i>). Mỗi nhiệm vụ chọn <b>danh mục công việc</b> rồi đánh giá theo <b>3 tiêu chí khách quan</b>; hệ thống <b>tự tính điểm và suy ra Mức độ hoàn thành</b>.</p>
              <div className="mt-2 space-y-1 bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-[13px]">
                <p className="font-bold text-emerald-800">3 tiêu chí đánh giá kết quả mỗi nhiệm vụ:</p>
                <p>• <b>① Số lượng (khối lượng)</b> = SL hoàn thành ÷ SL giao × 100% (làm vượt định mức được xét thưởng).</p>
                <p>• <b>② Chất lượng</b> = mức đạt chuẩn nghiệm thu: Đạt chuẩn/tốt <b>100%</b> · Có sai sót nhỏ <b>75%</b> · Chưa đạt/phải làm lại <b>50%</b>.</p>
                <p>• <b>③ Tiến độ</b> = mức đúng hạn: Đúng hạn <b>100%</b> · Chậm ít <b>80%</b> · Trễ hạn/quá hạn <b>50%</b>.</p>
                <p className="pt-1 border-t border-emerald-200 font-bold text-emerald-700">Kết quả nhiệm vụ = (① + ② + ③) ÷ 3.</p>
              </div>
              <div className="mt-2 space-y-1 bg-slate-50 border border-slate-200 rounded-lg p-3 text-[13px]">
                <p className="font-bold text-slate-700">Từ kết quả % → suy ra Mức độ hoàn thành:</p>
                <p>• ≥ 90% + có vượt định mức → <b>Xuất sắc (vượt mức)</b> · ≥ 90% → <b>Hoàn thành tốt</b> · ≥ 75% → <b>Cơ bản hoàn thành</b> · ≥ 50% → <b>Chưa hoàn thành</b> · &lt; 50% → <b className="text-rose-600">Không hoàn thành</b>.</p>
                <p className="pt-1 border-t border-slate-200"><b>Tầm quan trọng</b> → trọng số: Thường xuyên <b>×1</b> · Quan trọng <b>×1,5</b> · Trọng tâm, khó, phạm vi rộng <b>×2</b>. <b>Trọng số mỗi nhiệm vụ</b> = hệ số danh mục (cấp độ N1–N5) × hệ số tầm quan trọng.</p>
                <p className="font-bold text-emerald-700">Điểm KPI = trung bình có trọng số (%) kết quả các nhiệm vụ · Điểm Nhóm II = KPI × 70%.</p>
              </div>
              <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-3 text-[13px]">
                <p className="font-bold text-amber-800 mb-1">Ví dụ tính một nhiệm vụ</p>
                <p>"Thẩm tra nghị quyết" — giao 10, hoàn thành 10 → Số lượng <b>100%</b>; chất lượng <b>Đạt chuẩn (100%)</b>; tiến độ <b>Chậm ít (80%)</b>. Kết quả = (100 + 100 + 80) ÷ 3 = <b>93,3%</b> → suy ra mức <b>Hoàn thành tốt</b>.</p>
                <p className="mt-2">Ghép nhiều nhiệm vụ có trọng số khác nhau: KPI = trung bình có trọng số các kết quả %. VD 3 nhiệm vụ 93%/90%/75% với trọng số 4,0/1,0/1,5 → KPI = (93×4 + 90×1 + 75×1,5) ÷ 6,5 ≈ <b>89,7%</b> → Nhóm II ≈ <b>62,8 / 70</b>.</p>
              </div>
              <p className="mt-2"><b>▲ Thưởng vượt mức:</b> nhiệm vụ <b>làm vượt định mức + đạt chuẩn + đúng hạn</b> được cộng điểm thưởng <b>+0,1 điểm cho mỗi 1% tỷ trọng</b> nhiệm vụ vượt mức (theo trọng số), <b>tối đa +5 điểm</b> (tổng vẫn ≤ 100).</p>
              <p className="mt-1.5 text-slate-500 text-[13px]">Cột <b>Cấp duyệt</b> mặc định kế thừa cột <b>Tự đánh giá</b>; cấp có thẩm quyền sửa lại để chốt xếp loại chính thức. Nhiệm vụ <b>chưa chọn danh mục</b> không được tính điểm.</p>
            </GB>
            ) : (<>
            <GB icon={Target} title="4. Nhóm II — Kết quả thực hiện nhiệm vụ (tối đa 70 điểm)">
              <p>Chấm bằng <b>đếm khách quan</b>, không cảm tính. Mỗi nhiệm vụ chọn từ <b>danh mục công việc</b> (đã gán sẵn <b>hệ số</b> theo cấp độ), rồi nhập 4 con số: <b>Số lượng giao</b>, <b>Số lượng hoàn thành</b>, <b>Lỗi chất lượng</b>, <b>Chậm tiến độ</b>.</p>
              <p className="mt-2 font-semibold text-slate-700">Hệ thống tự tính 3 tỷ lệ (bình quân theo hệ số của tất cả nhiệm vụ):</p>
              <div className="mt-1 space-y-1 bg-slate-50 border border-slate-200 rounded-lg p-3 text-[13px]">
                <p><b>a — Khối lượng</b> = Σ(Hoàn thành × hệ số) ÷ Σ(Giao × hệ số) × 100%</p>
                <p><b>b — Chất lượng</b> = bình quân [1 − 0,25 × số Lỗi] theo hệ số × 100% <span className="text-slate-500">(mỗi lỗi −25%)</span></p>
                <p><b>c — Tiến độ</b> = bình quân [1 − 0,25 × số lần Chậm] theo hệ số × 100% <span className="text-slate-500">(mỗi lần chậm −25%)</span></p>
                <p className="pt-1 border-t border-slate-200 font-bold text-red-700">Điểm Nhóm II = (a + b + c) ÷ 3 × 70% <span className="text-slate-500 font-normal">(công chức, viên chức, lao động hợp đồng)</span></p>
              </div>
              <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-3 text-[13px]">
                <p className="font-bold text-red-800 mb-1">Với cán bộ giữ chức vụ lãnh đạo, quản lý (Điều 7)</p>
                <p>Điểm KQ = <b>(a + b + c + d + đ + e) ÷ 6</b>, bổ sung 3 thành phần (mỗi mục 100% hoặc 50%):</p>
                <ul className="list-disc pl-5 mt-1 space-y-0.5">
                  <li><b>d</b> — Kết quả lĩnh vực/đơn vị phụ trách: 100% nếu 100% cán bộ dưới quyền đạt "Hoàn thành nhiệm vụ" trở lên; 50% nếu có người không hoàn thành.</li>
                  <li><b>đ</b> — Khả năng tổ chức triển khai nhiệm vụ: 100% nếu hoàn thành đúng hạn, có sáng kiến; 50% nếu chậm trễ kéo dài.</li>
                  <li><b>e</b> — Năng lực tập hợp, đoàn kết: 100% nếu đoàn kết; 50% nếu có mâu thuẫn, mất đoàn kết nội bộ kéo dài.</li>
                </ul>
                <p className="mt-1 text-slate-600">Hệ thống tự nhận biết lãnh đạo theo <b>chức vụ</b> và hiện ô nhập d/đ/e ngay trong tab Đánh giá.</p>
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
              <p className="mt-3"><b>Hệ số (N1–N5)</b> phản ánh độ phức tạp/cấp độ của công việc (N1 = 100 đến N5 = 500; nhóm hỗ trợ III.* hệ số 0 → coi như 1, đếm ngang nhau). Việc khó hơn có hệ số cao hơn nên đóng góp nhiều hơn vào điểm.</p>
              <div className="mt-3 bg-slate-50 border border-slate-200 rounded-lg p-3 text-[13px] space-y-1.5">
                <p className="font-bold text-slate-700">Ba điểm cần hiểu đúng về công thức (để không hiểu nhầm kết quả):</p>
                <p>① <b>Hệ số được nhân với SỐ LƯỢNG.</b> Trọng số mỗi nhiệm vụ = hệ số × số lượng giao. Vì vậy <b>10 đầu việc N1 (10×100=1000)</b> có thể "nặng" hơn <b>1 việc N4 (1×400=400)</b>. Hãy nhập số lượng đúng thực tế để phản ánh khối lượng.</p>
                <p>② <b>Chất lượng (b) và Tiến độ (c) chỉ tính trên phần ĐÃ hoàn thành.</b> Một nhiệm vụ <b>hoàn thành 0</b> sẽ <b>không tham gia</b> vào b, c (chưa có sản phẩm để soi lỗi/tiến độ); phần chưa làm đã bị phạt ở tỷ lệ Khối lượng (a). Đặc biệt, nếu <b>TẤT CẢ nhiệm vụ đều hoàn thành 0</b> thì b, c <b>mặc định 100%</b>, nên điểm vẫn ra (0+100+100)/3 = <b>66,7% → ~46,7/70</b>: đây là lý do điểm số đôi khi <b>cao nhưng vẫn bị xếp loại thấp</b> do điều kiện Điều 8 (xem mục 7).</p>
                <p>③ <b>"Vượt mức" nghĩa là hoàn thành NHIỀU HƠN số lượng giao</b> (ví dụ giao 4, làm 6). Tỷ lệ Khối lượng a bị chặn tối đa 100% nên vượt mức <b>không cộng thêm điểm</b>, nhưng <b>là điều kiện bắt buộc để đạt loại A</b> (xem mục 7).</p>
              </div>
            </GB>
            </>)}

            <GB icon={ListChecks} title={isSonHa ? '4.1 Danh mục công việc Nhóm II (theo Mẫu/chức vụ)' : '4.1 Danh mục công việc Nhóm II (đầy đủ — 52 mục)'}>
              <p>Mỗi nhiệm vụ Nhóm II được chọn từ danh mục dưới đây (đã gán sẵn <b>cấp độ → hệ số</b> và <b>nhóm đối tượng áp dụng</b> theo Mẫu 01–05). Quản trị có thể thêm/bớt/sửa và gán lại ở tab <b>Danh mục</b>.</p>
              <div className="mt-2 overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-[11.5px] border-collapse">
                  <thead><tr className="bg-slate-100 text-slate-600">
                    <th className="border border-slate-200 px-2 py-1.5 text-left whitespace-nowrap">Mã</th>
                    <th className="border border-slate-200 px-2 py-1.5 text-left">Tên công việc</th>
                    <th className="border border-slate-200 px-2 py-1.5 text-left">Sản phẩm đầu ra (minh chứng)</th>
                    <th className="border border-slate-200 px-2 py-1.5 text-center">Cấp độ</th>
                    <th className="border border-slate-200 px-2 py-1.5 text-center">Hệ số</th>
                    <th className="border border-slate-200 px-2 py-1.5 text-center whitespace-nowrap">Mẫu</th>
                  </tr></thead>
                  <tbody>
                    {catalogForGuide().flatMap((g) => [
                      <tr key={g.group}><td colSpan={6} className="border border-slate-200 bg-slate-50 px-2 py-1.5 font-bold text-red-700">{g.group}</td></tr>,
                      ...g.items.map((it) => (
                        <tr key={it.id} className="align-top">
                          <td className="border border-slate-200 px-2 py-1 font-mono text-slate-500 whitespace-nowrap">{it.id}</td>
                          <td className="border border-slate-200 px-2 py-1 text-slate-700">{it.name}</td>
                          <td className="border border-slate-200 px-2 py-1 text-slate-500">{it.output}</td>
                          <td className="border border-slate-200 px-2 py-1 text-center font-semibold text-slate-600 whitespace-nowrap">{it.level}</td>
                          <td className="border border-slate-200 px-2 py-1 text-center font-semibold text-slate-700">{it.maxScore}</td>
                          <td className="border border-slate-200 px-2 py-1 text-center text-slate-600 whitespace-nowrap">{it.mau || '—'}</td>
                        </tr>
                      )),
                    ])}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-[12px] text-slate-500">Cột <b>Mẫu</b>: 01 = ĐB HĐND chuyên trách · 02 = ĐB Quốc hội chuyên trách · 03 = lãnh đạo, quản lý · 04 = công chức · 05 = lao động hợp đồng.</p>
            </GB>

            {!isSonHa && (
            <GB icon={BarChart3} title="4.2 Ví dụ tính điểm XUYÊN SUỐT (từ nhiệm vụ đến xếp loại)">
              <p className="text-slate-600">Áp dụng đúng công thức tổng quát ở mục 4. Theo dõi từng bước để hiểu cách một con số cuối cùng được hình thành.</p>

              <div className="mt-3 rounded-lg border border-sky-200 bg-sky-50 p-3">
                <p className="font-bold text-sky-800 mb-1">VÍ DỤ 1 — Công chức (Mẫu 04), công thức (a+b+c)/3</p>
                <p className="text-[13px] text-slate-700">Ông A có 3 nhiệm vụ trong tháng:</p>
                <div className="overflow-x-auto mt-1.5">
                  <table className="w-full text-[12px] border-collapse">
                    <thead><tr className="bg-white text-slate-500"><th className="border border-sky-200 px-2 py-1 text-left">Nhiệm vụ</th><th className="border border-sky-200 px-2 py-1">Hệ số</th><th className="border border-sky-200 px-2 py-1">Giao</th><th className="border border-sky-200 px-2 py-1">Hoàn thành</th><th className="border border-sky-200 px-2 py-1">Lỗi CL</th><th className="border border-sky-200 px-2 py-1">Chậm</th></tr></thead>
                    <tbody className="text-center text-slate-700">
                      <tr><td className="border border-sky-200 px-2 py-1 text-left">NV1 — Tham mưu xây dựng kỳ họp (II.B.11)</td><td className="border border-sky-200">400</td><td className="border border-sky-200">2</td><td className="border border-sky-200">2</td><td className="border border-sky-200">0</td><td className="border border-sky-200">1</td></tr>
                      <tr><td className="border border-sky-200 px-2 py-1 text-left">NV2 — Soạn thảo văn bản (II.A.1)</td><td className="border border-sky-200">100</td><td className="border border-sky-200">10</td><td className="border border-sky-200">9</td><td className="border border-sky-200">1</td><td className="border border-sky-200">0</td></tr>
                      <tr><td className="border border-sky-200 px-2 py-1 text-left">NV3 — Báo cáo dân nguyện (II.B.23)</td><td className="border border-sky-200">300</td><td className="border border-sky-200">1</td><td className="border border-sky-200">1</td><td className="border border-sky-200">0</td><td className="border border-sky-200">0</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-[12.5px] mt-2 text-slate-700 leading-relaxed">
                  <b>Trọng số giao</b> = 2×400 + 10×100 + 1×300 = 800 + 1000 + 300 = <b>2.100</b><br/>
                  <b>Trọng số hoàn thành</b> = 2×400 + 9×100 + 1×300 = 800 + 900 + 300 = <b>2.000</b><br/>
                  <b>a (Khối lượng)</b> = 2.000 ÷ 2.100 × 100 = <b>95,2%</b><br/>
                  <b>b (Chất lượng)</b> = [800×1 + 900×(1−0,25) + 300×1] ÷ 2.000 = (800 + 675 + 300) ÷ 2.000 = 1.775 ÷ 2.000 = <b>88,8%</b> <span className="text-slate-500">(chỉ NV2 có 1 lỗi → −25% trên phần hoàn thành của NV2)</span><br/>
                  <b>c (Tiến độ)</b> = [800×(1−0,25) + 900×1 + 300×1] ÷ 2.000 = (600 + 900 + 300) ÷ 2.000 = 1.800 ÷ 2.000 = <b>90,0%</b> <span className="text-slate-500">(chỉ NV1 chậm 1 lần)</span><br/>
                  <b>Điểm KQ</b> = (95,2 + 88,8 + 90,0) ÷ 3 = <b>91,3%</b><br/>
                  <b>Nhóm II</b> = 91,3% × 70% = <b>63,9 / 70</b>
                </p>
                <p className="text-[12.5px] mt-2 text-slate-700">Giả sử <b>Nhóm I = 27,5/30</b>, không có điểm trừ → <b>TỔNG = 27,5 + 63,9 = 91,4 điểm</b> (ngưỡng ≥90 = mức A).</p>
                <div className="mt-2 rounded-md bg-white border border-amber-200 p-2.5 text-[12.5px] text-amber-800">
                  <b>Kiểm điều kiện Điều 8:</b> đạt ≥90 điểm, nhưng để xếp <b>A</b> cần <b>100% nhiệm vụ đạt đủ số lượng</b> và <b>≥30% nhiệm vụ vượt mức</b>. Ở đây NV2 mới đạt 9/10 (90% &lt; 100%) và <b>không nhiệm vụ nào vượt mức</b> → hệ thống <b>hạ xuống loại B — Hoàn thành tốt</b>. (Đây là ví dụ điển hình "điểm cao nhưng chưa đủ điều kiện mức A".)
                </div>
              </div>

              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="font-bold text-red-800 mb-1">VÍ DỤ 2 — Lãnh đạo, quản lý (Mẫu 03), công thức (a+b+c+d+đ+e)/6</p>
                <p className="text-[12.5px] text-slate-700 leading-relaxed">
                  Giả sử phần nhiệm vụ cho ra <b>a = 96%, b = 95%, c = 94%</b>. Ba thành phần lãnh đạo: <b>d = 100%</b> (mọi cán bộ dưới quyền đều hoàn thành), <b>đ = 50%</b> (một số việc triển khai còn chậm), <b>e = 100%</b> (đoàn kết tốt).<br/>
                  <b>Điểm KQ</b> = (96 + 95 + 94 + 100 + 50 + 100) ÷ 6 = 535 ÷ 6 = <b>89,2%</b><br/>
                  <b>Nhóm II</b> = 89,2% × 70% = <b>62,4 / 70</b>. Nếu <b>Nhóm I = 28/30</b> → <b>TỔNG = 90,4 điểm</b>.
                </p>
                <p className="text-[12.5px] mt-1 text-slate-600">Lưu ý: chỉ cần một thành phần lãnh đạo bị 50% cũng kéo điểm KQ xuống đáng kể (mỗi thành phần chiếm 1/6).</p>
              </div>

              <div className="mt-3 bg-slate-50 border border-slate-200 rounded-lg p-3 text-[12.5px] space-y-1.5">
                <p className="font-bold text-slate-700">Vài tình huống ngắn (cùng công thức):</p>
                <p>• <b>Vượt mức:</b> NV giao 4, hoàn thành 6 → a của NV = 6/4 = 150% nhưng <b>bị chặn còn 100%</b> (không cộng thêm); đổi lại NV này được tính là "vượt mức" phục vụ điều kiện loại A.</p>
                <p>• <b>Một nhiệm vụ hoàn thành 0:</b> NV giao 5, hoàn thành 0 → a của NV = 0%; NV này <b>không tham gia</b> b, c. Nhiệm vụ này bị tính là <b>"không hoàn thành" (đạt &lt; 50%)</b> trong điều kiện Điều 8.</p>
                <p>• <b>Hoàn thành 50–99%:</b> NV giao 10, hoàn thành 7 (70%) → <b>vẫn tính là đã hoàn thành</b>; chỉ giảm điểm a và làm mất điều kiện đạt mức A.</p>
                <p>• <b>Chậm tiến độ 2 lần:</b> c của NV = 1 − 0,25×2 = 50% trên phần hoàn thành của NV đó.</p>
                <p>• <b>Bị kỷ luật:</b> tích ô "bị xử lý kỷ luật" → <b>xếp thẳng loại D</b> bất kể điểm, <b>nhưng KHÔNG trừ điểm</b> (tổng điểm giữ nguyên). Đây là lúc xuất hiện cảnh báo "chênh lệch điểm số và xếp loại".</p>
              </div>
            </GB>
            )}

            <GB icon={Link2} title="5. Liên kết mục tiêu (OKR) & Key Results">
              <p><b>OKR = Objective (Mục tiêu định hướng) + Key Results (Kết quả then chốt đo được).</b> Ở tab <b>Tổng quan</b>, mỗi Mục tiêu cấp Văn phòng (gắn với Nghị quyết, chương trình công tác) có <b>2–3 Key Result</b> dạng "hiện tại / chỉ tiêu + đơn vị" — phần mềm tự tính tiến độ %. OKR khát vọng đạt <b>60–70%</b> đã là tốt.</p>
              <ul className="list-disc pl-5 space-y-1 mt-1.5">
                <li><b>OKR chỉ để ĐỊNH HƯỚNG & theo dõi tiến độ cơ quan</b> — theo thông lệ Google/John Doerr và quy luật Goodhart, <b>KHÔNG dùng % đạt OKR để tính điểm hay xếp loại cá nhân</b> (tránh đặt mục tiêu thấp cho dễ đạt). Điểm Nhóm II vẫn dựa trên số lượng/chất lượng/tiến độ thực hiện nhiệm vụ.</li>
                <li>Mỗi nhiệm vụ cá nhân (Nhóm II) nên <b>liên kết lên một mục tiêu</b> để dồn sức vào việc chiến lược — <b>khuyến khích, không bắt buộc</b> (việc không gắn xếp vào "việc thường xuyên").</li>
                <li>Tab Tổng quan hiển thị 2 chỉ số cho mỗi mục tiêu: <b>OKR</b> (trung bình % các Key Result) và <b>Thực thi nhiệm vụ</b> (trung bình điểm các nhiệm vụ liên kết).</li>
              </ul>
            </GB>

            <GB icon={Activity} title="6. Trạng thái nhiệm vụ (màu)">
              <p><b className="text-emerald-600">Xanh ≥ 90%</b> đúng tiến độ · <b className="text-amber-600">Vàng 70–90%</b> cần chú ý · <b className="text-rose-600">Đỏ &lt; 70%</b> chậm/rủi ro. Màu tự cập nhật theo số liệu nhập.</p>
            </GB>

            <GB icon={Award} title="7. Bốn mức xếp loại & trần tỷ lệ">
              <div className="grid sm:grid-cols-2 gap-2">{[['A', '≥ 90', 'Hoàn thành xuất sắc', 'emerald'], ['B', '70 → <90', 'Hoàn thành tốt', 'sky'], ['C', '50 → <70', 'Hoàn thành nhiệm vụ', 'amber'], ['D', '< 50', 'Không hoàn thành', 'rose']].map(([c, r, n, col]) => (<div key={c} className={`flex items-center gap-3 p-3 rounded-xl border bg-${col}-50 border-${col}-200`}><span className={`w-9 h-9 rounded-full bg-${col}-500 text-white font-extrabold flex items-center justify-center`}>{c}</span><div><p className={`font-bold text-${col}-700 text-sm`}>{n}</p><p className="text-xs text-slate-500">{r} điểm</p></div></div>))}</div>
              <p className="mt-2"><b>Trần xuất sắc:</b> số "Hoàn thành xuất sắc" (A) không vượt quá <b>20%</b> số "Hoàn thành tốt" (B). Hệ thống cảnh báo ở tab Tổng quan khi vượt trần — tránh cào bằng, giữ tính phân loại thực chất.</p>
              <div className="mt-2 bg-slate-50 border border-slate-200 rounded-lg p-3">
                <p className="font-semibold text-slate-700 mb-1">Điều kiện định lượng (Điều 8) — hệ thống tự áp dụng ngoài ngưỡng điểm:</p>
                {isSonHa && <p className="text-[13px] text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-lg p-2.5 mb-2">Ở bản OKR/KPI: mỗi nhiệm vụ được chấm theo <b>3 tiêu chí</b> (Số lượng + Chất lượng + Tiến độ) → tự <b>suy ra Mức độ hoàn thành</b>. Nhiệm vụ <b>làm vượt định mức + đạt chuẩn + đúng hạn</b> được coi là <b>"vượt mức"</b>; nhiệm vụ có kết quả dưới 50% được coi là <b>"không hoàn thành"</b>. Các điều kiện dưới đây áp dụng theo cách quy đổi đó.</p>}
                <p className="text-[13px] text-slate-600 mb-1">Cách tính <b>theo từng nhiệm vụ</b>: mỗi nhiệm vụ có tỷ lệ = Số lượng HT ÷ Số lượng giao. Một nhiệm vụ chỉ bị coi là <b>"không hoàn thành" khi đạt dưới 50%</b> số lượng giao; đạt từ 50% đến dưới 100% vẫn là <b>đã hoàn thành</b> (chỉ phần thiếu làm giảm điểm và ảnh hưởng mức Xuất sắc).</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><b>Hoàn thành xuất sắc (A):</b> ngoài ≥90 điểm, mọi nhiệm vụ phải <b>đạt đủ 100% số lượng</b> và có <b>≥30% nhiệm vụ vượt mức</b> (HT &gt; giao). Chưa đủ thì hạ xuống Hoàn thành tốt.</li>
                  <li><b>Hoàn thành tốt (B):</b> 70–89 điểm và <b>không có nhiệm vụ nào không hoàn thành</b> (mọi nhiệm vụ đạt ≥ 50% số lượng); nếu có nhiệm vụ đạt dưới 50% thì xuống Hoàn thành nhiệm vụ.</li>
                  <li><b>Hoàn thành nhiệm vụ (C):</b> 50–69 điểm; số nhiệm vụ chậm tiến độ không quá 20% (hệ thống nhắc khi vượt).</li>
                  <li><b>Không hoàn thành (D):</b> dưới 50 điểm; hoặc bị <b>kỷ luật/kết luận suy thoái</b> (tích ở mục Điểm trừ); hoặc <b>trên 50% số nhiệm vụ không hoàn thành</b> (mỗi nhiệm vụ đạt dưới 50% số lượng mới tính) — riêng <b>lãnh đạo</b> là trên 30% (đơn vị phụ trách hoàn thành dưới 70% nhiệm vụ).</li>
                </ul>
                <p className="mt-1 text-slate-500">Khi mức xếp loại bị điều chỉnh, hệ thống hiển thị <b>lý do</b> + bảng <b>"Điều kiện xếp loại (Điều 8)"</b> ngay trong tab Đánh giá (có các chỉ số % hoàn thành, % vượt mức, % chậm tiến độ để cán bộ tự đối chiếu).</p>
                <p className="mt-1 text-rose-600"><b>Cảnh báo chênh lệch:</b> nếu <b>tổng điểm</b> tương ứng một mức cao hơn nhưng điều kiện Điều 8 bắt hạ mức (ví dụ điểm ~70 nhưng bị xếp D do trên 50% nhiệm vụ không hoàn thành, hoặc bị kỷ luật), hệ thống hiện <b>ô cảnh báo màu đỏ</b> ngay dưới mức xếp loại để giải thích sự chênh lệch — tránh hiểu nhầm "điểm cao sao lại loại thấp".</p>
                <p className="mt-1 text-slate-500"><b>Lưu ý về "bị kỷ luật":</b> việc tích ô này <b>chỉ chốt mức xếp loại = Không hoàn thành nhiệm vụ</b> (điều kiện loại trừ theo Điều 8.4), <b>KHÔNG trừ vào tổng điểm</b> — tổng điểm vẫn phản ánh khối lượng, chất lượng công việc. Muốn trừ điểm theo mức độ vi phạm thì nhập ở ô <b>Điểm trừ</b> (trừ trực tiếp vào tổng).</p>
              </div>
            </GB>

            <GB icon={CalendarDays} title="8. Quy trình 2 cấp & mốc thời gian">
              <ol className="list-decimal pl-5 space-y-1">
                <li>Đầu tháng: cơ quan xây dựng <b>kế hoạch công tác tháng</b>; cán bộ lập <b>lịch công tác tuần</b> làm cơ sở kiểm đếm.</li>
                <li>Trước ngày <b>25</b>: cán bộ tự đánh giá, nhận mức xếp loại (cột Tự ĐG).</li>
                <li>Trước ngày <b>26</b>: cấp trên trực tiếp cho ý kiến nhận xét.</li>
                <li>Trước ngày <b>28</b>: cấp có thẩm quyền quyết định xếp loại (cột Cấp duyệt).</li>
                <li>Trước ngày <b>05 tháng sau</b>: công khai kết quả, biểu dương, khen thưởng.</li>
              </ol>
              <p className="mt-2">Đánh giá thực hiện <b>theo tháng</b>; riêng <b>tháng 12</b> hoàn thành trước <b>ngày 15/12</b> (trước khi xếp loại đảng viên và bình xét thi đua năm). Kết quả hằng tháng là căn cứ xếp loại quý/năm và đảng viên (Điều 10, 11 QĐ 1053).</p>
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
              <div className="mt-2 rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-[13px] text-indigo-900/90 leading-relaxed">
                <p className="font-bold text-indigo-800 mb-1">Liên kết nhiệm vụ với Mục tiêu (OKR) — chỉ để ĐỊNH HƯỚNG, không để tính điểm</p>
                <p>Theo thông lệ OKR (Google/John Doerr) và <i>quy luật Goodhart</i> ("khi một thước đo trở thành mục tiêu, nó hết là thước đo tốt"): <b>không nên dùng % đạt OKR để tự sinh ra điểm hay xếp loại cá nhân</b> — làm vậy khiến người ta đặt mục tiêu thấp cho dễ đạt. Vì thế trong các phiên bản Cải tiến/Singapore, nhiệm vụ Nhóm II được <b>gom theo Mục tiêu để nhìn rõ "việc nào phục vụ mục tiêu nào"</b>, nhưng điểm vẫn tính theo <b>số lượng giao/hoàn thành · lỗi chất lượng · chậm tiến độ</b> như cũ. Việc gắn mục tiêu là <b>khuyến khích, không bắt buộc</b> (nhiệm vụ chưa gắn xếp vào "việc thường xuyên"). Ô <b>"Kết quả cần đạt"</b> giúp mô tả rõ sản phẩm/chỉ tiêu của nhiệm vụ, không phải chỉ số để chấm điểm.</p>
              </div>
            </GB>

            <GB icon={Cpu} title="12. Kiến trúc & triển khai (cho Quản trị viên)">
              <p>SPA (React + Vite + Tailwind) chạy trên trình duyệt; dữ liệu lưu tại <b>Supabase (PostgreSQL)</b>; hosting <b>Vercel</b> tự build từ GitHub. Báo cáo Excel/Word kết xuất ngay trên máy người dùng.</p>
              <ol className="list-decimal pl-5 space-y-1 mt-2">
                <li>Tạo project Supabase, chạy <code className="text-[11px] font-mono bg-slate-100 px-1 py-0.5 rounded border border-slate-200">supabase/schema.sql</code>; bật đăng nhập <b>Email + mật khẩu</b>.</li>
                <li>Khai báo biến môi trường <code className="text-[11px] font-mono bg-slate-100 px-1 py-0.5 rounded border border-slate-200">VITE_SUPABASE_URL</code>, <code className="text-[11px] font-mono bg-slate-100 px-1 py-0.5 rounded border border-slate-200">VITE_SUPABASE_ANON_KEY</code> trên Vercel.</li>
                <li>Phân quyền ngay trong app (tab Đánh giá). Đồng bộ kiểm đếm từ Google Sheet qua hàm máy chủ <code className="text-[11px] font-mono bg-slate-100 px-1 py-0.5 rounded border border-slate-200">/api/kiemdem</code> (Google Sheet để chế độ "ai có link đều xem được").</li>
              </ol>
            </GB>

            {!isSonHa && (
            <GB icon={Cloud} title="13. Tab Theo dõi CV: đồng bộ Google Sheet, thu thập KPI, xuất PDF">
              <ul className="list-disc pl-5 space-y-1">
                <li><b>Đồng bộ từ Google Sheet</b> (Quản trị): nạp dữ liệu kiểm đếm mới nhất từ bảng tính Google thành các dòng theo dõi <b>có thể sửa</b>; khớp cán bộ theo tên, bấm lại sẽ cập nhật (không nhân đôi). Dòng nạp có nhãn "từ Google Sheet".</li>
                <li><b>Thu thập vào đánh giá KPI</b>: ở mỗi công việc, chọn <b>Danh mục</b> + <b>OKR</b> + "Đã hoàn thành?", Lỗi chất lượng, Chậm tiến độ; bấm nút để tạo/cập nhật nhiệm vụ Nhóm II tương ứng (nhãn "từ Theo dõi CV").</li>
                <li><b>Xuất bảng (PDF)</b>: mở cửa sổ bảng theo mẫu hành chính (A4 ngang); bấm "In / Lưu thành PDF" để lưu file hoặc in giấy.</li>
              </ul>
            </GB>
            )}
            </>)}
          </div>
          </div>
        )}

        {tab === 'catalog' && canManage && !isSG && (
          <CatalogManager catalog={catalog} onChange={setCatalog} />
        )}
        {tab === 'hr' && canManage && (
          <Suspense fallback={<div className="text-center text-sm text-slate-400 py-10">Đang tải module Quản lý cán bộ…</div>}>
            <CanBoManager data={hrData} people={people} onChange={patchHR} onSave={doSaveHR} saving={hrSaving} canEdit={canManage} onExportProfile={doExport2C} />
          </Suspense>
        )}
        {/* Vào thẳng #/canbo bằng tài khoản không phải Quản trị -> báo rõ thay vì để trang trắng. */}
        {tab === 'hr' && !canManage && (
          <div className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 text-center">
            <ShieldCheck className="w-10 h-10 text-amber-500 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-slate-800">Module Quản lý cán bộ dành riêng cho Quản trị</h2>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">Hồ sơ cán bộ theo Mẫu 2C/TCTW-98 chứa thông tin cá nhân nhạy cảm (ngày sinh, số CCCD, sổ BHXH, quan hệ gia đình) nên chỉ tài khoản <b>Quản trị</b> mới xem được. Vui lòng đăng nhập bằng tài khoản do Văn phòng cấp.</p>
            <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
              <button onClick={() => setWantLogin(true)} className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white"><LogIn className="w-4 h-4" /> Đăng nhập</button>
              <button onClick={() => setTab('dash')} className="text-sm font-semibold px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50">Về Tổng quan</button>
            </div>
          </div>
        )}
      </main>
      <footer className="max-w-6xl mx-auto px-6 py-6 text-center text-xs text-slate-400 space-y-1">
        <p>Công cụ hỗ trợ quản trị nội bộ • OKR/KPI & Khung năng lực số • <span className="font-semibold text-slate-500">Phiên bản 2.0</span></p>
        <p className="text-amber-600 font-semibold">⚠ BẢN DEMO THỬ NGHIỆM — không chịu trách nhiệm về tính pháp lý và dữ liệu.</p>
        <p className="text-amber-600 font-semibold">Phiên bản demo sử dụng nội bộ.</p>
        {visits != null && (
          <p className="inline-flex items-center gap-1.5 justify-center"><Eye className="w-3.5 h-3.5" /> Lượt truy cập: <span className="font-semibold text-slate-500">{visits.toLocaleString('vi-VN')}</span></p>
        )}
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
function MiniNum({ label, value, onChange, max, min = 0, step = 1, disabled = false, hint, note }) {
  return (<label className="block" title={hint || undefined}><span className="text-[10px] font-semibold text-slate-400 block mb-0.5">{label}{hint && <span className="text-slate-300 ml-0.5" title={hint}>ⓘ</span>}</span><input type="number" min={min} max={max} step={step} value={value} disabled={disabled} onChange={(e) => { let v = Number(e.target.value); if (max !== undefined) v = Math.min(max, v); onChange(Math.max(min, v)); }} className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-sm text-center font-semibold text-slate-700 outline-none focus:border-red-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50" />{note && <span className="block text-[10px] text-slate-400 mt-0.5 leading-tight">{note}</span>}</label>);
}
// Nhãn mức theo số lần trừ 25% (NĐ 335/2025): 0→100% … ≥4→0%. Dùng cho gợi ý chấm nhất quán.
const DEDUCT_LABEL = (count) => { const pct = Math.max(0, 100 - 25 * (Number(count) || 0)); const lb = pct >= 100 ? 'Đạt hoàn toàn' : pct >= 75 ? 'Cơ bản đạt' : pct >= 50 ? 'Đạt một phần' : pct >= 25 ? 'Yếu' : 'Không đạt'; return `→ ${pct}%: ${lb}`; };
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
// ===== Giải thích điều kiện xếp loại (Điều 8) ngay trong tab Đánh giá — để CBCC nắm rõ =====
function GradeExplain({ c, disciplined, tasks }) {
  if (!c) return null;
  const sonha = ACTIVE_VERSION === 'sonha'; // bản SonHa: Số lượng + Chất lượng + Tiến độ → suy ra Mức độ hoàn thành
  const st = c.st || { n: 0, doneRate: 100, exceedRate: 0, delayRate: 0, failRate: 0 };
  const g = gradeClass(c.grade);
  const pct = (v) => `${Number(v).toFixed(0)}%`;
  // Liệt kê đích danh nhiệm vụ để cán bộ biết RÕ chậm/chưa hoàn thành công việc nào.
  const { failed, partial, delayed, uncounted } = taskBreakdown(tasks);
  const nameOf = (t) => { const it = findCatalogItem(t.catalogId); return (it && it.name) || t.note || `[${t.catalogId}]`; };
  const mucLabel = (t) => mucOf(tMuc(t, 'mgr')).short; // nhãn mức độ (bản SonHa)
  const metrics = sonha ? [
    { label: 'Số nhiệm vụ', val: String(st.n), ok: null, hint: 'Nhóm II' },
    { label: 'Hoàn thành tốt trở lên', val: pct(st.doneRate), ok: st.n === 0 ? null : st.doneRate >= 100, hint: 'HTXS cần 100%' },
    { label: 'Xuất sắc (vượt mức)', val: pct(st.exceedRate), ok: st.n === 0 ? null : st.exceedRate >= 30, hint: 'HTXS ≥ 30%' },
    { label: 'Không hoàn thành', val: pct(st.failRate), ok: st.n === 0 ? null : st.failRate <= (c.leader ? 30 : 50), hint: c.leader ? 'lãnh đạo ≤ 30%' : '≤ 50%' },
  ] : [
    { label: 'Số nhiệm vụ', val: String(st.n), ok: null, hint: 'Nhóm II' },
    { label: 'Đạt đủ số lượng', val: pct(st.doneRate), ok: st.n === 0 ? null : st.doneRate >= 100, hint: 'HTXS cần 100%' },
    { label: 'Vượt mức', val: pct(st.exceedRate), ok: st.n === 0 ? null : st.exceedRate >= 30, hint: 'HTXS ≥ 30%' },
    { label: 'Không hoàn thành', val: pct(st.failRate), ok: st.n === 0 ? null : st.failRate <= (c.leader ? 30 : 50), hint: c.leader ? 'lãnh đạo ≤ 30%' : '≤ 50%' },
  ];
  const levels = sonha ? [
    ['A', '≥ 90 điểm + mọi nhiệm vụ đạt mức "Hoàn thành tốt" trở lên + ≥ 30% nhiệm vụ đạt mức "Xuất sắc (vượt mức)".'],
    ['B', '70–89 điểm + không có nhiệm vụ nào ở mức "Không hoàn thành".'],
    ['C', '50–69 điểm; hoặc có nhiệm vụ chưa đạt mức Hoàn thành tốt.'],
    ['D', 'Dưới 50 điểm; hoặc bị kỷ luật/kết luận suy thoái; hoặc trên 50% nhiệm vụ ở mức "Không hoàn thành" (lãnh đạo: trên 30%).'],
  ] : [
    ['A', '≥ 90 điểm + đạt đủ 100% số lượng ở mọi nhiệm vụ + ≥ 30% nhiệm vụ vượt mức + đã khắc phục xong hạn chế đã chỉ ra (nếu có).'],
    ['B', '70–89 điểm + không có nhiệm vụ nào không hoàn thành (mọi nhiệm vụ đạt từ 50% số lượng trở lên), đúng hạn, bảo đảm chất lượng.'],
    ['C', '50–69 điểm + không quá ngưỡng nhiệm vụ không hoàn thành; số nhiệm vụ chậm tiến độ không quá 20%.'],
    ['D', 'Dưới 50 điểm; hoặc bị kỷ luật/kết luận suy thoái; hoặc trên 50% nhiệm vụ không hoàn thành — mỗi nhiệm vụ đạt dưới 50% số lượng giao mới tính là không hoàn thành (lãnh đạo: trên 30%).'],
  ];
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-5 py-3.5"><h2 className="flex items-center gap-2 font-bold"><Award className="w-5 h-5 text-amber-300" /> Điều kiện xếp loại chất lượng (Điều 8)</h2></div>
      <div className="p-4 space-y-3">
        <p className="text-sm text-slate-600">Mức xếp loại được tính <b>tự động</b> theo <b>tổng điểm</b> và <b>điều kiện định lượng</b> dưới đây. Mức hiện tại: <span className={`inline-flex items-center gap-1 font-bold align-middle ${g.ring}`}><span className={`w-5 h-5 rounded-full ${g.cls} text-white text-[10px] flex items-center justify-center`}>{g.code}</span>{g.name}</span> — {c.totalMgr.toFixed(1)} điểm.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {metrics.map((m) => (
            <div key={m.label} className={`rounded-lg border p-2 text-center ${m.ok == null ? 'bg-slate-50 border-slate-100' : m.ok ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
              <p className="text-[10px] text-slate-500">{m.label}</p>
              <p className={`font-bold text-base ${m.ok == null ? 'text-slate-700' : m.ok ? 'text-emerald-700' : 'text-rose-600'}`}>{m.val}</p>
              <p className="text-[10px] text-slate-400">{m.hint}</p>
            </div>
          ))}
        </div>
        {st.n === 0 && <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg p-2.5">Chưa nhập nhiệm vụ Nhóm II nào nên chưa đủ căn cứ xác nhận điều kiện Hoàn thành xuất sắc — vì vậy tạm thời chưa thể đạt mức Hoàn thành xuất sắc. Hãy thêm nhiệm vụ ở mục <b>Nhóm II</b> phía trên.</p>}
        {uncounted > 0 && <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-2.5"><b>{uncounted}</b> nhiệm vụ <b>chưa chọn danh mục công việc</b> nên KHÔNG được tính vào điểm KPI. Hãy chọn danh mục cho các dòng đang đánh dấu "chưa tính điểm" ở mục Nhóm II.</p>}
        {failed.length > 0 && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-2.5">
            <p className="text-[11px] font-bold text-rose-700 mb-1">Nhiệm vụ KHÔNG hoàn thành ({failed.length}/{st.n}):</p>
            <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-rose-700/90 leading-relaxed">{failed.map((t, i) => <li key={i}><b>{nameOf(t)}</b> — {sonha ? mucLabel(t) : `mới làm ${Number(t.completed) || 0}/${Number(t.assigned) || 0}`}{t.note ? ` · ${t.note}` : ''}</li>)}</ul>
          </div>
        )}
        {partial.length > 0 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-2.5">
            <p className="text-[11px] font-bold text-amber-800 mb-1">{sonha ? `Nhiệm vụ chưa đạt mức Hoàn thành tốt — ảnh hưởng mức Hoàn thành xuất sắc (${partial.length}/${st.n}):` : `Nhiệm vụ chưa đạt đủ số lượng — vẫn tính là hoàn thành, chỉ ảnh hưởng mức Hoàn thành xuất sắc (${partial.length}/${st.n}):`}</p>
            <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-amber-800/90 leading-relaxed">{partial.map((t, i) => <li key={i}><b>{nameOf(t)}</b> — {sonha ? mucLabel(t) : `đã làm ${Number(t.completed) || 0}/${Number(t.assigned) || 0}`}{t.note ? ` · ${t.note}` : ''}</li>)}</ul>
          </div>
        )}
        {delayed.length > 0 && (
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-2.5">
            <p className="text-[11px] font-bold text-orange-700 mb-1">Nhiệm vụ CHẬM tiến độ ({delayed.length}/{st.n}):</p>
            <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-orange-700/90 leading-relaxed">{delayed.map((t, i) => <li key={i}><b>{nameOf(t)}</b> — {sonha ? tdOf(tTdKey(t, 'mgr')).label.toLowerCase() : `chậm ${Number(t.delays) || 0} lần`}{t.note ? ` · ${t.note}` : ''}</li>)}</ul>
          </div>
        )}
        <div className="space-y-1.5">
          {levels.map(([code, desc]) => { const active = c.grade === code; const gc = gradeClass(code);
            return (<div key={code} className={`flex items-start gap-2 rounded-lg p-2 border ${active ? gc.soft : 'border-slate-100 bg-slate-50/40'}`}>
              <span className={`shrink-0 w-6 h-6 rounded-full ${gc.cls} text-white text-[11px] font-bold flex items-center justify-center`}>{code}</span>
              <div className="flex-1"><p className={`text-xs font-bold ${active ? gc.ring : 'text-slate-600'}`}>{gc.name}{active && <span className="ml-1 font-extrabold">← mức hiện tại</span>}</p><p className="text-[11px] text-slate-500 leading-relaxed">{desc}</p></div>
            </div>); })}
        </div>
        {disciplined && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 leading-relaxed"><b>Đang đánh dấu bị kỷ luật:</b> xếp loại bị chốt ở mức <b>Không hoàn thành nhiệm vụ</b> theo Điều 8.4 — đây là điều kiện loại trừ, <b>không phụ thuộc và không trừ vào</b> tổng điểm ({c.totalMgr.toFixed(1)}đ). Bỏ tích nếu nhập nhầm.</div>
        )}
        {c.gradeReasons && c.gradeReasons.length > 0 ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3"><p className="text-[11px] font-bold text-amber-800 mb-1 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> Vì sao ở mức này</p><ul className="list-disc pl-4 space-y-1 text-[11px] text-amber-800 leading-relaxed">{c.gradeReasons.map((r, i) => <li key={i}>{r}</li>)}</ul></div>
        ) : (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-2.5 text-[11px] text-emerald-700 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 shrink-0" /> Đã đáp ứng đủ điều kiện của mức xếp loại theo tổng điểm.</div>
        )}
      </div>
    </section>
  );
}

// ===== Quản trị: quản lý Danh mục công việc (Nhóm II) + gán Nhóm đối tượng đánh giá =====
const LEVEL_OPTS = ['N1', 'N2', 'N3', 'N4', 'N5', 'Hỗ trợ'];
function CatTypePills({ value, onToggle }) {
  return (<div className="flex flex-wrap gap-1.5">{CRITERIA_ORDER.map((k) => { const on = value.includes(k);
    return (<button key={k} type="button" onClick={() => onToggle(k)} title={CRITERIA[k].label} className={`px-2 py-1 rounded-lg text-[11px] font-semibold border transition-colors ${on ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-500 border-slate-200 hover:border-red-300'}`}>{CRITERIA[k].mau.replace('Mẫu số ', 'Mẫu ')}</button>); })}</div>);
}
// Một dòng công việc có thể sửa ĐẦY ĐỦ thông số (tên, nhóm, sản phẩm, cấp độ/hệ số, nhóm đối tượng).
function CatalogRow({ item, types, isCustom, isHidden, isOverridden, onPatch, onDelete, onReset, onHide }) {
  const setLevel = (level) => onPatch({ level, maxScore: LEVEL_SCORE[level] ?? 0, hasFactor: (LEVEL_SCORE[level] || 0) > 0 });
  const toggleType = (t) => onPatch({ types: types.includes(t) ? types.filter((x) => x !== t) : [...types, t] });
  return (
    <div className={`border rounded-xl p-3 ${isHidden ? 'opacity-60 border-slate-200 bg-slate-50/60' : isOverridden ? 'border-amber-300 bg-amber-50/40' : 'border-slate-200'}`}>
      <div className="flex items-start gap-2">
        <span className="text-[10px] font-mono text-slate-400 shrink-0 pt-2 w-14 truncate" title={item.id}>[{item.id}]</span>
        <input value={item.name} onChange={(e) => onPatch({ name: e.target.value })} className="flex-1 font-semibold text-sm text-slate-800 bg-white border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-red-400" />
        <select value={item.level} onChange={(e) => setLevel(e.target.value)} title="Cấp độ → hệ số KPI" className="shrink-0 text-xs bg-white border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-red-400">{LEVEL_OPTS.map((l) => <option key={l} value={l}>{l} · {LEVEL_SCORE[l]}</option>)}</select>
        {isCustom
          ? <button onClick={onDelete} title="Xóa công việc" className="shrink-0 text-rose-400 hover:bg-rose-50 p-1.5 rounded-lg"><Trash2 className="w-4 h-4" /></button>
          : <button onClick={onHide} title={isHidden ? 'Hiện lại' : 'Ẩn khỏi danh mục'} className={`shrink-0 flex items-center gap-1 text-[11px] font-semibold px-2 py-1.5 rounded-lg border ${isHidden ? 'text-emerald-700 border-emerald-200 bg-emerald-50' : 'text-slate-500 border-slate-200 hover:bg-slate-50'}`}>{isHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}</button>}
      </div>
      <div className="grid sm:grid-cols-2 gap-2 mt-2">
        <input value={item.group || ''} onChange={(e) => onPatch({ group: e.target.value })} placeholder="Nhóm / Phân loại" className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-red-400" />
        <input value={item.output || ''} onChange={(e) => onPatch({ output: e.target.value })} placeholder="Sản phẩm đầu ra" className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-red-400" />
      </div>
      <div className="mt-2 flex items-end justify-between gap-2 flex-wrap">
        <div><span className="text-[11px] font-semibold text-slate-400 block mb-1">Gán cho Nhóm đối tượng:</span><CatTypePills value={types} onToggle={toggleType} /></div>
        {!isCustom && isOverridden && <button onClick={onReset} className="shrink-0 text-[11px] font-semibold text-amber-700 hover:underline">↺ Khôi phục mặc định</button>}
      </div>
    </div>
  );
}
function CatalogManager({ catalog, onChange }) {
  const custom = catalog.custom || [];
  const hidden = catalog.hidden || [];
  const overrides = catalog.overrides || {};
  const [form, setForm] = useState({ name: '', group: '', output: '', level: 'N2', types: [] });
  const [showBuiltin, setShowBuiltin] = useState(false);
  const toggle = (arr, t) => (arr.includes(t) ? arr.filter((x) => x !== t) : [...arr, t]);

  const addItem = () => {
    if (!form.name.trim()) { alert('Vui lòng nhập tên công việc.'); return; }
    if (!form.types.length) { alert('Vui lòng chọn ít nhất một Nhóm đối tượng để gán công việc.'); return; }
    const id = 'CUS.' + Date.now().toString(36).toUpperCase();
    const score = LEVEL_SCORE[form.level] ?? 200;
    onChange({ ...catalog, custom: [...custom, { id, name: form.name.trim(), group: form.group.trim() || 'TÙY CHỈNH', output: form.output.trim(), level: form.level, maxScore: score, hasFactor: score > 0, types: [...form.types] }] });
    setForm({ name: '', group: '', output: '', level: 'N2', types: [] });
  };
  const upItem = (id, patch) => onChange({ ...catalog, custom: custom.map((c) => (c.id === id ? { ...c, ...patch } : c)) });
  const delItem = (id) => { if (window.confirm('Xóa công việc tùy chỉnh này khỏi danh mục?')) onChange({ ...catalog, custom: custom.filter((c) => c.id !== id) }); };
  const toggleHidden = (id) => onChange({ ...catalog, hidden: hidden.includes(id) ? hidden.filter((x) => x !== id) : [...hidden, id] });
  const setOverride = (id, patch) => onChange({ ...catalog, overrides: { ...overrides, [id]: { ...(overrides[id] || {}), ...patch } } });
  const resetOverride = (id) => { const o = { ...overrides }; delete o[id]; onChange({ ...catalog, overrides: o }); };

  // Thông số HIỆU LỰC của 1 mục mặc định (gốc + ghi đè) và nhóm đối tượng hiệu lực.
  const effOf = (c) => (overrides[c.id] ? { ...c, ...overrides[c.id] } : c);
  const effTypesOf = (c) => (overrides[c.id]?.types ? overrides[c.id].types : defaultTypesOfId(c.id));

  const builtinGroups = useMemo(() => {
    const m = new Map();
    CATALOG.forEach((c) => { if (!m.has(c.group)) m.set(c.group, []); m.get(c.group).push(c); });
    return [...m.entries()];
  }, []);
  const editedCount = Object.keys(overrides).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><ListChecks className="w-6 h-6 text-red-700" /> Quản lý Danh mục công việc (Nhóm II)</h2>
        <p className="text-sm text-slate-500 mt-1">Chỉ <b>Quản trị</b> được sửa. Có thể <b>thêm/sửa/xóa</b> công việc tùy chỉnh và <b>sửa đầy đủ thông số</b> (tên, nhóm, sản phẩm đầu ra, cấp độ/hệ số, Nhóm đối tượng) của <b>cả công việc mặc định</b>; <b>ẩn</b> công việc không dùng. Danh mục lưu theo từng kỳ.</p>
        <p className="text-xs text-slate-400 mt-2">Cấp độ → hệ số KPI: N1=100 · N2=200 · N3=300 · N4=400 · N5=500 · Hỗ trợ=0. Áp dụng cho bản Cổ điển và bản Mới (bản PRO dùng danh mục theo Phòng riêng).</p>
      </div>

      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-red-800 to-red-700 text-white px-5 py-3.5"><h3 className="flex items-center gap-2 font-bold"><Plus className="w-5 h-5 text-amber-300" /> Thêm công việc mới</h3></div>
        <div className="p-4 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Tên công việc *"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="VD: Tham mưu xây dựng đề án..." className="inp" /></Field>
            <Field label="Nhóm/Phân loại (tùy chọn)"><input value={form.group} onChange={(e) => setForm({ ...form, group: e.target.value })} placeholder="VD: TÙY CHỈNH" className="inp" /></Field>
            <Field label="Sản phẩm đầu ra (tùy chọn)"><input value={form.output} onChange={(e) => setForm({ ...form, output: e.target.value })} placeholder="VD: Đề án; Báo cáo..." className="inp" /></Field>
            <Field label="Cấp độ phức tạp (hệ số)"><select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="inp">{LEVEL_OPTS.map((l) => <option key={l} value={l}>{l} (hệ số {LEVEL_SCORE[l]})</option>)}</select></Field>
          </div>
          <Field label="Gán cho Nhóm đối tượng đánh giá * (chọn 1 hoặc nhiều)"><CatTypePills value={form.types} onToggle={(t) => setForm({ ...form, types: toggle(form.types, t) })} /></Field>
          <button onClick={addItem} className="flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white font-semibold px-4 py-2.5 rounded-xl text-sm"><Plus className="w-4 h-4" /> Thêm vào danh mục</button>
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-5 py-3.5 flex items-center justify-between"><h3 className="flex items-center gap-2 font-bold"><ListChecks className="w-5 h-5 text-amber-300" /> Công việc tùy chỉnh</h3><span className="text-xs text-slate-300">{custom.length} mục</span></div>
        <div className="p-4 space-y-3">
          {custom.length === 0 && <p className="text-sm text-slate-400 text-center py-4">Chưa có công việc tùy chỉnh nào. Thêm ở phần trên.</p>}
          {custom.map((c) => (
            <CatalogRow key={c.id} item={c} types={c.types || []} isCustom onPatch={(patch) => upItem(c.id, patch)} onDelete={() => delItem(c.id)} />
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <button onClick={() => setShowBuiltin((s) => !s)} className="w-full bg-gradient-to-r from-slate-800 to-slate-700 text-white px-5 py-3.5 flex items-center justify-between"><span className="flex items-center gap-2 font-bold"><ClipboardList className="w-5 h-5 text-amber-300" /> Công việc mặc định (sửa / ẩn)</span><span className="flex items-center gap-2 text-xs text-slate-300">{editedCount > 0 && `${editedCount} đã sửa · `}{hidden.length > 0 && `${hidden.length} đang ẩn · `}{showBuiltin ? 'Thu gọn' : 'Mở rộng'}<ChevronDown className={`w-4 h-4 transition-transform ${showBuiltin ? 'rotate-180' : ''}`} /></span></button>
        {showBuiltin && (
          <div className="p-4 space-y-4">
            <p className="text-xs text-slate-500 bg-amber-50 border border-amber-100 rounded-lg p-2.5">Sửa trực tiếp thông số (tên, nhóm, sản phẩm, cấp độ/hệ số, Nhóm đối tượng) — mục đã sửa có viền vàng, bấm <b>↺ Khôi phục mặc định</b> để hoàn tác. <b>Ẩn</b> để loại khỏi danh sách chấm KPI (không xóa dữ liệu đã nhập).</p>
            {builtinGroups.map(([grp, items]) => (
              <div key={grp} className="space-y-2">
                <div className="text-xs font-bold text-slate-600 px-1">{grp}</div>
                {items.map((c) => (
                  <CatalogRow key={c.id} item={effOf(c)} types={effTypesOf(c)} isHidden={hidden.includes(c.id)} isOverridden={!!overrides[c.id]} onPatch={(patch) => setOverride(c.id, patch)} onReset={() => resetOverride(c.id)} onHide={() => toggleHidden(c.id)} />
                ))}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
function AddPerson({ onAdd }) {
  const [name, setName] = useState(''); const [type, setType] = useState('staff');
  return (<div className="flex flex-col sm:flex-row gap-2"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Họ tên cán bộ mới..." className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-400" /><select value={type} onChange={(e) => setType(e.target.value)} className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none focus:border-red-400">{CRITERIA_ORDER.map((k) => [k, CRITERIA[k]]).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select><button onClick={() => { onAdd(name.trim() || 'Cán bộ mới', type); setName(''); }} className="flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white font-semibold px-4 py-2 rounded-lg text-sm"><UserPlus className="w-4 h-4" /> Thêm cán bộ</button></div>);
}

