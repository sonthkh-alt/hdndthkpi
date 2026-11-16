// ============================================================================
//  PHÂN HỆ "HỒ SƠ CÁN BỘ" — LÕI NGHIỆP VỤ (THUẦN, chạy được bằng Node để kiểm thử).
//
//  Dữ liệu lấy từ Hệ thống quản lý CBCCVC tỉnh Thanh Hóa (qlccvc.thanhhoa.gov.vn,
//  phần mềm VNPT CCVC 3.0, mô hình `hr.employee` + các bảng quá trình). Mỗi hồ sơ
//  GIỮ NGUYÊN TÊN TRƯỜNG của hệ thống nguồn để không mất trường nào khi nhập và
//  đối chiếu ngược được; file này chỉ mô tả CÁCH HIỂN THỊ các trường đó.
//
//  ⚠️ QUYỀN RIÊNG TƯ: kho mã và bản build là CÔNG KHAI nên file này KHÔNG được chứa
//  một dòng dữ liệu cá nhân nào. Dữ liệu thật nằm ở `hr_data.hoSo` trên Supabase
//  (RLS BƯỚC 4: chỉ email Quản trị đọc/ghi được) — xem src/lib/hoSoStore.js.
// ============================================================================

// ---------------------------------------------------------------------------
//  Nhãn các giá trị mã hóa (đọc từ fields_get của hệ thống nguồn ngày 16/11/2026)
// ---------------------------------------------------------------------------
export const CHON = {
  gioi_tinh: { nam: 'Nam', nu: 'Nữ' },
  gender: { male: 'Nam', female: 'Nữ', other: 'Khác' },
  marital: { 0: 'Chưa có thông tin', single: 'Độc thân', married: 'Đã kết hôn', divorced: 'Ly hôn / Góa', widower: 'Góa', cohabitant: 'Chung sống' },
  status: { draft: 'Soạn thảo', transfer: 'Chờ tiếp nhận', confirmed: 'Xác nhận', change: 'Gián đoạn', exit: 'Thôi việc' },
  hinhthuctd: { baucu: 'Bầu cử', daccach: 'Đặc cách', thituyen: 'Thi tuyển', tuyenthang: 'Tuyển thẳng', xettuyen: 'Xét tuyển' },
  db_hdnd: { hdnd_tinh: 'Cấp tỉnh', hdnd_huyen: 'Cấp huyện', hdnd_xa: 'Cấp xã' },
  certificate: { bachelor: 'Cử nhân', master: 'Thạc sĩ', other: 'Khác' },
  trang_thai_sinhhoatdang: { dangsinhhoat: 'Đang sinh hoạt', chuyensinhhoat: 'Không sinh hoạt Đảng tại đơn vị', dungsinhhoat: 'Dừng sinh hoạt' },
  coKhong: { yes: 'Có', no: 'Không' },
  loaiquanhe: { 1: 'Bố/mẹ', 2: 'Vợ/chồng', 3: 'Con cái', 4: 'Anh/chị em', 5: 'Quan hệ khác', 6: 'Ông/bà' },
  pay_forms: { 1: 'Lương theo vị trí việc làm', 2: 'Lương theo ngạch bậc' },
  loai_nangluong: {
    1: 'Điều chỉnh lương thường xuyên', 2: 'Điều chỉnh lương trước hạn', 3: 'Nâng phụ cấp vượt khung',
    4: 'Điều chỉnh lương đột xuất', 5: 'Chuyển xếp loại ngạch', 6: 'Điều chỉnh lương tuyển dụng',
    7: 'Điều chỉnh lương hết tập sự', 8: 'Xếp lương hợp đồng NĐ 68', 9: 'Chuyển xếp lương', 99: 'Khác',
  },
  loai_quyet_dinh: {
    tuyendung: 'Tuyển dụng', appoint: 'Bổ nhiệm', dismiss: 'Miễn nhiệm', concurrently: 'Kiêm nhiệm', dieudong: 'Điều động',
    luanchuyen: 'Luân chuyển', secondment: 'Biệt phái', tiepnhan: 'Tiếp nhận', other: 'Khác',
  },
  daotao: { trongnuoc: 'Trong nước', ngoainuoc: 'Ngoài nước' },
  loaiNha: { 1: 'Nhà được cấp, được thuê', 2: 'Nhà tự mua, tự xây', 3: 'Khác' },
  loaiDat: { 1: 'Đất được cấp', 2: 'Đất tự mua', 3: 'Khác' },
  nhom_daotao: { LLCT: 'Lý luận chính trị', QLNN: 'Quản lý nhà nước', NN: 'Ngoại ngữ', TH: 'Tin học', QPAN: 'Quốc phòng - An ninh', TDT: 'Tiếng dân tộc' },
};

// ---------------------------------------------------------------------------
//  LƯỢC ĐỒ HIỂN THỊ — 12 nhóm thông tin (bám bố cục hồ sơ của hệ thống nguồn + Mẫu 2C)
//  kieu: text · date · number · bool · area (văn bản dài) · list (nhiều giá trị) · chon (dùng CHON[chon])
// ---------------------------------------------------------------------------
const T = (k, nhan, kieu = 'text', them = {}) => ({ k, nhan, kieu, ...them });

export const NHOM = [
  {
    id: 'chung', ten: 'Thông tin chung', bieuTuong: 'User',
    truong: [
      T('name', 'Họ và tên'), T('vnpt_tengoikhac', 'Tên gọi khác'), T('vnpt_ma_nhan_vien', 'Mã cán bộ'),
      T('ma_hoso', 'Mã hồ sơ'), T('masohoso', 'Mã số hồ sơ'),
      T('gioi_tinh', 'Giới tính', 'chon', { chon: 'gioi_tinh' }), T('birthday', 'Ngày sinh', 'date'),
      T('marital', 'Tình trạng hôn nhân', 'chon', { chon: 'marital' }), T('children', 'Số con', 'number'),
      T('vnpt_dan_toc', 'Dân tộc'), T('vnpt_dan_toc_thieuso', 'Dân tộc thiểu số', 'bool'), T('vnpt_ton_giao', 'Tôn giáo'),
      T('country_id', 'Quốc tịch'), T('vnpt_thanh_phan_gia_dinh', 'Thành phần gia đình'),
      T('vnpt_thanh_phan_ban_than', 'Thành phần bản thân'), T('status', 'Trạng thái hồ sơ', 'chon', { chon: 'status' }),
    ],
  },
  {
    id: 'dinhdanh', ten: 'Định danh & liên hệ', bieuTuong: 'IdCard',
    truong: [
      T('socancuoc', 'Số CCCD / mã số định danh'), T('vnpt_ngay_cap_can_cuoc', 'Ngày cấp CCCD', 'date'), T('vnpt_noi_cap_can_cuoc', 'Nơi cấp CCCD'),
      T('identification_id', 'Số CMND (cũ)'), T('vnpt_ngay_cap_cmnd', 'Ngày cấp CMND', 'date'), T('vnpt_noicap_cmnd', 'Nơi cấp CMND'),
      T('passport_id', 'Số hộ chiếu phổ thông'), T('vnpt_ngay_cap_ho_chieu', 'Ngày cấp hộ chiếu', 'date'),
      T('vnpt_noicap_hochieu', 'Nơi cấp hộ chiếu'), T('vnpt_ngay_het_han_ho_chieu', 'Ngày hết hạn hộ chiếu', 'date'),
      T('so_hochieu_congvu', 'Số hộ chiếu công vụ'), T('ngaycap_hochieu_congvu', 'Ngày cấp hộ chiếu công vụ', 'date'),
      T('ngayhh_hochieu_congvu', 'Ngày hết hạn hộ chiếu công vụ', 'date'),
      T('vnpt_ma_so_thue_ca_nhan', 'Mã số thuế cá nhân'), T('so_so_bhxh', 'Số sổ BHXH'),
      T('ngay_bhxh', 'Ngày tham gia BHXH', 'date'), T('nam_bhxh', 'Số năm đóng BHXH', 'number'), T('so_the_bhyt', 'Số thẻ BHYT'),
      T('mobile_phone', 'Điện thoại di động'), T('work_phone', 'Điện thoại cơ quan'),
      T('work_email', 'Thư điện tử công vụ'), T('vnpt_email_khac', 'Thư điện tử khác'),
      T('vnpt_lien_he_khan_cap', 'Liên hệ khẩn cấp', 'area'), T('emergency_contact', 'Người liên hệ khẩn'), T('emergency_phone', 'Điện thoại khẩn'),
      T('bank_account_number', 'Số tài khoản ngân hàng'), T('vnpt_so_tk', 'Số tài khoản (khác)'),
      T('bank_id', 'Ngân hàng'), T('vnpt_bank_id', 'Ngân hàng (khác)'), T('bank_branch', 'Chi nhánh'),
      T('vnpt_chinhanh_nganhang', 'Chi nhánh (khác)'), T('from_date_tk', 'Ngày dùng tài khoản trả lương', 'date'),
    ],
  },
  {
    id: 'diachi', ten: 'Nơi sinh, quê quán, cư trú', bieuTuong: 'MapPin',
    truong: [
      T('place_of_birth', 'Nơi sinh (ghi gộp)'), T('noisinh_xa', 'Nơi sinh — xã/phường'), T('noisinh_huyen', 'Nơi sinh — huyện/quận'),
      T('noisinh_tinh', 'Nơi sinh — tỉnh/thành phố'), T('noi_sinh_khac', 'Nơi sinh khác'),
      T('vnpt_nguyen_quan', 'Quê quán theo hồ sơ gốc', 'area'),
      T('quequan_thon_xom', 'Quê quán — thôn, xóm, chi tiết'), T('quequan_xa_phuong_id', 'Quê quán — xã/phường'),
      T('quequan_quan_huyen_id', 'Quê quán — huyện/quận'), T('quequan_tinh_thanhpho_id', 'Quê quán — tỉnh/thành phố'),
      T('hokhauthuongtru_thon_xom', 'Thường trú — thôn, xóm, số nhà'), T('hokhauthuongtru_xa_phuong_id', 'Thường trú — xã/phường'),
      T('hokhauthuongtru_quan_huyen_id', 'Thường trú — huyện/quận'), T('hokhauthuongtru_tinh_thanhpho_id', 'Thường trú — tỉnh/thành phố'),
      T('noiohiennay_thon_xom', 'Nơi ở hiện nay — thôn, xóm, số nhà'), T('noiohiennay_xa_phuong_id', 'Nơi ở — xã/phường'),
      T('noiohiennay_quan_huyen_id', 'Nơi ở — huyện/quận'), T('noiohiennay_tinh_thanhpho_id', 'Nơi ở — tỉnh/thành phố'),
      T('address_home', 'Địa chỉ khác', 'area'),
    ],
  },
  {
    id: 'congtac', ten: 'Công tác & tuyển dụng', bieuTuong: 'Briefcase',
    truong: [
      T('department_id', 'Đơn vị / phòng ban'), T('loaicanbo_id', 'Loại cán bộ'), T('job_id', 'Ngạch / chức danh nghề nghiệp'),
      T('vitri_congviec', 'Chức vụ'), T('ngay_bo_nhiem', 'Ngày bổ nhiệm / phê chuẩn', 'date'),
      T('ngay_bo_nhiem_lai', 'Ngày bổ nhiệm lại / phê chuẩn nhiệm kỳ tiếp', 'date'),
      T('ngaybonhiemlandauchucvu', 'Ngày bổ nhiệm lần đầu chức vụ hiện tại', 'date'),
      T('chucvu_kiemnhiem_ids', 'Chức vụ kiêm nhiệm', 'list'), T('chucdanh_kiemnhiem_id', 'Chức danh kiêm nhiệm'),
      T('chucvu_quyhoach_ids', 'Chức vụ quy hoạch', 'list'), T('manager', 'Là cán bộ quản lý', 'bool'),
      T('parent_id', 'Người quản lý trực tiếp'), T('donviquanly', 'Đơn vị quản lý nhân sự'), T('cap_donvi_id', 'Phân cấp tổ chức'),
      T('capuy_hientai', 'Cấp ủy hiện tại'), T('capuy_kiem', 'Cấp ủy kiêm'),
      T('is_daibieu_hdnd', 'Đại biểu HĐND', 'bool'), T('db_hdnd', 'Đại biểu HĐND cấp', 'chon', { chon: 'db_hdnd' }),
      T('is_daibieu_quochoi', 'Đại biểu Quốc hội', 'bool'), T('ngoaibienche', 'Ngoài biên chế', 'bool'),
      T('main_job', 'Công việc chính được giao', 'area'), T('vieclam_launhat', 'Công việc làm lâu nhất', 'area'),
      T('sotruong_congtac', 'Sở trường công tác', 'area'),
      T('nghenghieptruoctuyendung', 'Nghề nghiệp trước khi tuyển dụng'), T('ngaytuyendung', 'Ngày tuyển dụng lần đầu', 'date'),
      T('coquantuyendung', 'Cơ quan, đơn vị tuyển dụng'), T('nghenghieptuyendung', 'Nghề nghiệp, vị trí tuyển dụng'),
      T('chucdanh_khituyendung', 'Chức danh khi tuyển dụng'), T('hinhthuctd', 'Hình thức tuyển dụng', 'chon', { chon: 'hinhthuctd' }),
      T('vnpt_ngay_vao_don_vi', 'Ngày vào cơ quan hiện nay', 'date'), T('vnpt_ngay_vao_don_vi_ct', 'Ngày chính thức vào cơ quan', 'date'),
      T('tuoi_huu', 'Tuổi nghỉ hưu', 'number'), T('ngay_du_kien_nghi_huu', 'Ngày dự kiến nghỉ hưu', 'date'),
      T('ngay_thongbao_nghihuu', 'Ngày thông báo nghỉ hưu', 'date'), T('ngay_quyetdinh_nghihuu', 'Ngày quyết định nghỉ hưu', 'date'),
    ],
    bang: ['vitri_vieclam_line_ids'],
  },
  {
    id: 'luong', ten: 'Lương, phụ cấp', bieuTuong: 'Wallet',
    truong: [
      T('bac_luong_2c', 'Bậc lương', 'number'), T('hsluong_2c', 'Hệ số lương', 'number'),
      T('ngay_huong_bac', 'Ngày hưởng bậc hiện tại', 'date'), T('heso_phucap_chucvu', 'Hệ số phụ cấp chức vụ', 'number'),
      T('phucapkhac', 'Phụ cấp khác', 'number'),
    ],
    bang: ['salary_fluctuations_history_ids', 'allowance_history_ids'],
  },
  {
    id: 'daotao', ten: 'Trình độ, đào tạo, bồi dưỡng', bieuTuong: 'GraduationCap',
    truong: [
      T('datotnghieplop_id', 'Trình độ giáo dục phổ thông'), T('hetotnghiep', 'Hệ phổ thông'),
      T('vnpt_trinhdodaotao_id', 'Trình độ chuyên môn cao nhất'), T('vnpt_nhomtrinhdochuyenmon_id', 'Nhóm trình độ chuyên môn'),
      T('chuyen_nganh_dao_tao', 'Chuyên ngành đào tạo'), T('vnpt_chuyen_nganh_dao_tao', 'Chuyên ngành (danh mục)'),
      T('noi_dao_tao_chuyenmon', 'Cơ sở đào tạo'), T('vnpt_noi_dao_tao', 'Cơ sở đào tạo (danh mục)'),
      T('noi_dao_tao_nuoc_ngoai', 'Cơ sở đào tạo nước ngoài'), T('hinhthuc_daotao', 'Hình thức đào tạo'),
      T('vnpt_ngay_tot_nghiep', 'Ngày tốt nghiệp', 'date'), T('vnpt_xep_loai_dao_tao', 'Xếp loại tốt nghiệp'),
      T('hoc_ham_id', 'Học hàm'), T('namphong_hocham', 'Năm phong học hàm', 'date'), T('namduocphong', 'Năm được phong'),
      T('chuyennganh_hocham_id', 'Chuyên ngành học hàm'), T('chucdanhkhoahoc_id', 'Chức danh khoa học'),
      T('namphong_chucdanh', 'Năm phong chức danh'), T('namphongtang_chucdanh', 'Năm phong chức danh (ngày)', 'date'),
      T('lyluanchinhtri', 'Lý luận chính trị'), T('quanlynhanuoc', 'Quản lý nhà nước'),
      T('ngoaingu_caonhat_id', 'Ngoại ngữ cao nhất'), T('tinhoc_caonhat_id', 'Tin học cao nhất'),
      T('trinhdo_nghiepvu_chuyennghanh', 'Nghiệp vụ chuyên ngành'), T('kynang_mem', 'Kỹ năng mềm'),
      T('certificate', 'Học vị (hệ thống cũ)', 'chon', { chon: 'certificate' }),
    ],
    bang: ['vnpt_daotao_chungchi_ids', 'lyluanchinhtri_ids', 'quanlynhanuoc_ids', 'trinhdongoaingu_ids', 'trinhdotinhoc_ids',
      'quocphong_anninh_ids', 'tieng_dantoc_ids', 'vnpt_daotaoboiduong_ids', 'vnpt_chung_chi_hanh_nghe_ids', 'vanbang_chungchi_ids'],
  },
  {
    id: 'dang', ten: 'Đảng, đoàn thể', bieuTuong: 'Flag',
    truong: [
      T('vnpt_la_dang_vien_ok', 'Là đảng viên', 'bool'), T('vnpt_ngay_vao_dang', 'Ngày vào Đảng', 'date'),
      T('noi_ket_nap_dang', 'Nơi kết nạp Đảng'), T('vnpt_noi_ket_nap_dang', 'Nơi kết nạp Đảng (khác)'),
      T('chibodang_dubi', 'Chi bộ kết nạp'), T('dangbo_dubi', 'Đảng bộ kết nạp'),
      T('nguoi_gioi_thieu_1', 'Người giới thiệu thứ nhất'), T('congviec_1', 'Công việc người giới thiệu thứ nhất'),
      T('nguoi_gioi_thieu_2', 'Người giới thiệu thứ hai'), T('congviec_2', 'Công việc người giới thiệu thứ hai'),
      T('ngaychinhthucvaodang', 'Ngày chính thức', 'date'), T('chibodang_ct', 'Chi bộ công nhận chính thức'), T('dangbo_ct', 'Đảng bộ công nhận chính thức'),
      T('so_the_dang', 'Số thẻ đảng viên'), T('ngay_cap_the', 'Ngày cấp thẻ', 'date'), T('dangbo_cap_the', 'Đảng bộ cấp thẻ'),
      T('chucvu_dang', 'Chức vụ Đảng'), T('chucvudang_kiemnhiem_ids', 'Chức vụ Đảng kiêm nhiệm', 'list'),
      T('trang_thai_sinhhoatdang', 'Trạng thái sinh hoạt Đảng', 'chon', { chon: 'trang_thai_sinhhoatdang' }),
      T('quanlydang_tochuccoso_id', 'Chi bộ sinh hoạt'), T('chibochinhthucvaodang', 'Chi bộ sinh hoạt (ghi chữ)'),
      T('dangboketnapdang', 'Đảng bộ sinh hoạt'), T('dangbo_ngaychuyenden', 'Ngày chuyển đến Đảng bộ hiện tại', 'date'),
      T('tuoi_dang', 'Tuổi Đảng (năm)', 'number'),
      T('ngay_ket_nap_dang_lan2', 'Ngày kết nạp lại', 'date'), T('chibodang_ketnap_lan2', 'Chi bộ kết nạp lại'),
      T('dangbo_ketnap_lan2', 'Đảng bộ kết nạp lại'), T('nguoi_gioi_thieu', 'Người giới thiệu (kết nạp lại)'),
      T('lydo_giandoan', 'Lý do gián đoạn', 'area'), T('ngay_ra_khoi_dang', 'Ngày ra khỏi Đảng', 'date'),
      T('vnpt_la_doan_vien_ok', 'Là đoàn viên', 'bool'), T('vnpt_ngay_vao_doan', 'Ngày vào Đoàn', 'date'),
      T('vnpt_noi_ket_nap_doan', 'Nơi kết nạp Đoàn'), T('chucvudoan', 'Chức vụ Đoàn'),
      T('vnpt_la_cong_doan_vien_ok', 'Là công đoàn viên', 'bool'), T('vnpt_ngay_vao_cong_doan', 'Ngày vào Công đoàn', 'date'),
      T('tcctxh', 'Tổ chức chính trị - xã hội'), T('ngaythamgiatcct', 'Ngày tham gia tổ chức CT-XH', 'date'),
      T('vaitrotcct', 'Vai trò trong tổ chức CT-XH', 'area'),
    ],
    bang: ['vnpt_quatrinhsinhhoatdang_ids', 'vnpt_quatrinhsinhhoatdoan_ids', 'vnpt_thamgia_tochuc_xahoi_ids'],
  },
  {
    id: 'giadinh', ten: 'Quan hệ gia đình', bieuTuong: 'Users',
    truong: [T('spouse_complete_name', 'Họ tên vợ/chồng'), T('spouse_birthdate', 'Ngày sinh vợ/chồng', 'date')],
    bang: ['vnpt_thongtingiadinh_ids'],
  },
  {
    id: 'quatrinh', ten: 'Quá trình công tác', bieuTuong: 'History',
    truong: [],
    bang: ['vnpt_quatrinhcongtac_ids', 'vnpt_congtacnuocngoai_ids', 'vnpt_nghiencuukhoahoc_ids', 'vnpt_thongtintrungcu_ids',
      'vnpt_daibieuquochoi_ids', 'lamviec_chedocu_ids', 'thamgia_tochuc_nuocngoai_ids', 'vnpt_hr_giandoan_ids'],
  },
  {
    id: 'thidua', ten: 'Khen thưởng, kỷ luật, đánh giá', bieuTuong: 'Award',
    truong: [T('danhhieuphongtang', 'Danh hiệu được phong tặng cao nhất'), T('namphongtang', 'Năm phong tặng'),
      T('namphongtang_danhhieu', 'Năm phong tặng (ngày)', 'date'), T('is_tainang', 'Nhân sự tài năng', 'bool')],
    bang: ['vnpt_khenthuong_ids', 'vnpt_kyluat_ids', 'vnpt_quatrinhdanhgia_ids'],
  },
  {
    id: 'suckhoe', ten: 'Sức khỏe, quân sự, chính sách', bieuTuong: 'HeartPulse',
    truong: [
      T('vnpt_trang_thai_suc_khoe', 'Tình trạng sức khỏe'), T('vnpt_nhommau', 'Nhóm máu'),
      T('vnpt_chieu_cao', 'Chiều cao (cm)', 'number'), T('vnpt_can_nang', 'Cân nặng (kg)', 'number'),
      T('vnpt_ghi_chu_suc_khoe', 'Ghi chú sức khỏe', 'area'), T('medic_exam', 'Ngày khám sức khỏe', 'date'),
      T('vnpt_la_quan_nhan_ok', 'Là quân nhân', 'bool'), T('ngay_tham_gia_cm', 'Ngày tham gia cách mạng', 'date'),
      T('ngaynhapngu', 'Ngày nhập ngũ', 'date'), T('ngayxuatngu', 'Ngày xuất ngũ', 'date'),
      T('quanhamcaonhat', 'Quân hàm cao nhất'), T('vnpt_lydonhapngu', 'Lý do nhập ngũ', 'area'),
      T('lathuongbinh', 'Là thương binh', 'bool'), T('hang_thuongbinh_id', 'Hạng thương binh'),
      T('hinhthuc_thuongtat_id', 'Hình thức thương tật'), T('hangthuongbinh', 'Hình thức thương tật (ghi chữ)'),
      T('namthuongbinh', 'Năm thương binh'), T('vnpt_ty_le_thuong_tat', 'Tỷ lệ thương tật (%)', 'number'),
      T('doituong_chinhsach_ids', 'Đối tượng chính sách', 'list'), T('giadinhchinhsach_ok', 'Gia đình liệt sĩ', 'bool'),
      T('ghichuchinhsach', 'Nội dung chính sách', 'area'), T('cocongcachmang_ok', 'Gia đình có công với cách mạng', 'bool'),
      T('noidungcongcachmang', 'Nội dung có công', 'area'),
      T('vnpt_tieng_dan_toc', 'Biết tiếng dân tộc', 'bool'), T('tiengdantoc_ids', 'Tiếng dân tộc', 'list'),
      T('chungchi_tiengdantoc', 'Có chứng chỉ tiếng dân tộc', 'bool'),
    ],
    bang: ['vnpt_hr_thongtin_suckhoe_ids', 'vaccine_record_ids', 'baohiem_ids'],
  },
  {
    id: 'kinhte', ten: 'Kinh tế, tài sản', bieuTuong: 'Home',
    truong: [
      T('nguonthunhapchinh_luong', 'Thu nhập chính — lương', 'area'), T('nguonthunhapchinh_khac', 'Các nguồn thu nhập khác', 'area'),
      T('kinhte_banthan', 'Kinh tế bản thân', 'area'),
      T('duoccap_duocthue_loainha', 'Nhà được cấp, được thuê — loại nhà'), T('duoccap_duocthue_loainha_dientich', 'Diện tích (m²)'),
      T('nhatumua_tuxay_loainha', 'Nhà tự mua, tự xây — loại nhà'), T('nhatumua_tuxay_loainha_dientich', 'Diện tích (m²) '),
      T('datduoccap', 'Đất được cấp (m²)'), T('dattumua', 'Đất tự mua (m²)', 'area'), T('dat_sanxuat_kinhdoanh', 'Đất sản xuất, kinh doanh', 'area'),
      T('tienngoaite', 'Tiền Việt Nam, ngoại tệ'), T('otoxemay', 'Ô tô, mô tô, động sản khác'),
      T('kimloaidaquy', 'Kim loại quý, đá quý, cổ phiếu'), T('taikhoankhac', 'Tài sản khác'),
      T('taisannuocngoai', 'Tài sản, tài khoản ở nước ngoài'), T('cackhoanno', 'Các khoản nợ'),
    ],
    bang: ['nha_o_ids', 'dat_o_ids'],
  },
  {
    id: 'khac', ten: 'Lịch sử bản thân, nhận xét', bieuTuong: 'FileText',
    truong: [
      T('bibattu', 'Đặc điểm lịch sử bản thân (bị bắt, bị tù…)', 'area'), T('dacdiemlichsubanthan', 'Đặc điểm lịch sử bản thân', 'area'),
      T('quanhenuocngoai', 'Quan hệ với tổ chức nước ngoài', 'area'), T('thannhannuocngoai', 'Thân nhân ở nước ngoài', 'area'),
      T('vandekhac', 'Vấn đề khác cần bổ sung', 'area'),
      T('vnpt_so_thich', 'Sở thích', 'area'), T('vnpt_muc_tieu_ca_nhan', 'Mục tiêu cá nhân', 'area'),
      T('vnpt_diem_manh', 'Điểm mạnh', 'area'), T('vnpt_diem_yeu', 'Điểm yếu', 'area'),
      T('canhannhanxet', 'Cá nhân tự nhận xét', 'area'), T('nhanxetdonviquanly', 'Nhận xét của đơn vị quản lý', 'area'),
      T('additional_note', 'Ghi chú bổ sung', 'area'), T('notes', 'Ghi chú', 'area'),
    ],
  },
];

// ---------------------------------------------------------------------------
//  CÁC BẢNG QUÁ TRÌNH (bảng con). cot = cột hiển thị; sapXep = trường ngày để xếp mới → cũ.
// ---------------------------------------------------------------------------
const C = (k, nhan, kieu = 'text', them = {}) => ({ k, nhan, kieu, ...them });
const DAOTAO_BD = [
  C('nhom_daotao', 'Nhóm', 'chon', { chon: 'nhom_daotao' }), C('lyluanchinhtri_id', 'Trình độ LLCT'), C('quanlynhanuoc_id', 'Trình độ QLNN'),
  C('ngoaingu_id', 'Ngoại ngữ'), C('tieng_dantoc_id', 'Tiếng dân tộc'), C('trinhdodaotao_id', 'Trình độ'),
  C('cosodaotao', 'Cơ sở đào tạo'), C('cosodaotao_id', 'Cơ sở (danh mục)'), C('cosodaotao_ngoaidanhmuc', 'Cơ sở ngoài danh mục'),
  C('date_start', 'Từ', 'date'), C('date_end', 'Đến', 'date'), C('hedaotao_id', 'Hình thức'),
  C('vanbang_duoccap', 'Văn bằng / chứng chỉ'), C('diem', 'Điểm'), C('ngaycap_chungchi', 'Ngày cấp', 'date'),
  C('donvicap_chungchi', 'Đơn vị cấp'), C('country_id', 'Nước đào tạo'), C('notes', 'Ghi chú'),
];

export const BANG = {
  vnpt_thongtingiadinh_ids: {
    ten: 'Quan hệ nhân thân', sapXep: null,
    cot: [
      C('vnpt_moi_quan_he_id', 'Quan hệ'), C('loaiquanhe', 'Nhóm', 'chon', { chon: 'loaiquanhe' }), C('name', 'Họ và tên'),
      C('vnpt_nam_sinh', 'Năm sinh'), C('giadinh_birthday', 'Ngày sinh', 'date'), C('vebenvo', 'Bên vợ/chồng', 'bool'),
      C('quequan_nghenghiep_chucvu', 'Quê quán, nghề nghiệp, chức vụ, đơn vị, nơi ở', 'area'), C('nghenghiep', 'Nghề nghiệp'),
      C('donvicongtac', 'Đơn vị công tác'), C('diachinoio', 'Nơi ở'), C('sodienthoai', 'Điện thoại'),
      C('nguoiphuthuoc', 'Người phụ thuộc', 'bool'), C('damat', 'Đã mất', 'bool'), C('is_luutru_nuocngoai', 'Ở nước ngoài', 'bool'),
      C('notes', 'Ghi chú'),
    ],
  },
  vnpt_quatrinhcongtac_ids: {
    ten: 'Quá trình công tác', sapXep: 'vnpt_ngay_bat_dau',
    cot: [
      C('vnpt_ngay_bat_dau', 'Từ ngày', 'date'), C('vnpt_ngay_ket_thuc', 'Đến ngày', 'date'),
      C('loai_quyet_dinh', 'Loại quyết định', 'chon', { chon: 'loai_quyet_dinh' }),
      C('name_id', 'Đơn vị công tác'), C('donvi_id', 'Đơn vị (danh mục)'), C('donvi_ngoaidanhmuc', 'Đơn vị ngoài danh mục'),
      C('vitricongviec', 'Chức vụ'), C('chucvu_id', 'Chức vụ (danh mục)'), C('chucvu_ngoaidanhmuc', 'Chức vụ ngoài danh mục'),
      C('job_id', 'Chức danh'), C('chucdanh_id', 'Ngạch / chức danh'), C('chucdanh_ngoaidanhmuc', 'Chức danh ngoài danh mục'),
      C('trongnganh_ok', 'Trong ngành', 'bool'), C('mucthunhap', 'Mức thu nhập'), C('lydonghiviec', 'Lý do nghỉ việc'), C('notes', 'Ghi chú'),
    ],
  },
  salary_fluctuations_history_ids: {
    ten: 'Diễn biến lương', sapXep: 'ngay_hieuluc',
    cot: [
      C('ngay_hieuluc', 'Ngày hiệu lực', 'date'), C('ngay_ket_thuc', 'Ngày kết thúc', 'date'),
      C('loai_nangluong', 'Loại điều chỉnh', 'chon', { chon: 'loai_nangluong' }), C('pay_forms', 'Loại lương', 'chon', { chon: 'pay_forms' }),
      C('loaicanbo_id', 'Loại cán bộ'), C('job_id', 'Ngạch / chức danh'), C('vitricongviec_id', 'Chức vụ'),
      C('bacluong_id', 'Bậc'), C('he_so', 'Hệ số', 'number'), C('he_so_theo_bac', 'Hệ số theo bậc', 'number'),
      C('phucap_vuotkhung', 'PC vượt khung (%)', 'number'), C('tham_nien_nghe', 'PC thâm niên nghề (%)', 'number'),
      C('phucap_chenhlech_baoluu', 'PC chênh lệch bảo lưu', 'number'), C('muc_tyle', 'Phần trăm hưởng', 'number'),
      C('mucluong_thoathuan', 'Lương thỏa thuận', 'number'), C('heso_chenhlech', 'Hệ số chênh lệch', 'number'),
      C('ngay_dukien_nangluong', 'Dự kiến nâng lương lần sau', 'date'), C('ngay_tinh_nangluong', 'Mốc tính nâng lương', 'date'),
      C('so_quyetdinh', 'Số quyết định'), C('ngay_quyetdinh', 'Ngày quyết định', 'date'), C('noi_quyetdinh', 'Nơi quyết định'),
      C('nguoi_quyetdinh', 'Người quyết định'), C('so_totrinh', 'Số tờ trình'), C('ngayky_totrinh', 'Ngày ký tờ trình', 'date'), C('notes', 'Ghi chú'),
    ],
  },
  allowance_history_ids: {
    ten: 'Phụ cấp cá nhân', sapXep: 'date_start',
    cot: [
      C('allowance_config_id', 'Loại phụ cấp'), C('date_start', 'Từ ngày', 'date'), C('date_end', 'Đến ngày', 'date'),
      C('heso', 'Hệ số / tỷ lệ / giá trị', 'number'), C('calculation_heso', 'Hệ số sau tính', 'number'),
      C('allowance_bhxh', 'Tính BHXH', 'bool'), C('is_extension', 'Có gia hạn', 'bool'), C('notes', 'Ghi chú'),
    ],
  },
  vnpt_daotao_chungchi_ids: {
    ten: 'Trình độ chuyên môn (từ trung cấp trở lên)', sapXep: 'vnpt_ngay_bat_dau',
    cot: [
      C('trinhdodaotao', 'Trình độ'), C('vnpt_chuyen_nganh_dao_tao_id', 'Chuyên ngành'), C('cn_daotao_ngoainuoc', 'Chuyên ngành (ghi chữ)'),
      C('chuyennganh_ngoaidanhmuc', 'Chuyên ngành ngoài danh mục'), C('linhvucdaotao_id', 'Lĩnh vực'),
      C('vnpt_co_so_dao_tao', 'Cơ sở đào tạo'), C('coso_daotao_ngoainuoc', 'Cơ sở (ghi chữ)'), C('cosodaotao_ngoaidanhmuc', 'Cơ sở ngoài danh mục'),
      C('vnpt_ngay_bat_dau', 'Từ', 'date'), C('vnpt_ngay_ket_thuc', 'Đến', 'date'), C('vnpt_he_dao_tao', 'Hình thức'),
      C('daotao', 'Trong/ngoài nước', 'chon', { chon: 'daotao' }), C('country_id', 'Nước đào tạo'), C('nam_totnghiep', 'Năm tốt nghiệp'),
      C('xeploaitotnghiep', 'Xếp loại'), C('vanbang_chungchi', 'Văn bằng được cấp'), C('trinhdo_chinh', 'Trình độ chính', 'bool'),
      C('is_sent_to_study', 'Cử đi học', 'bool'), C('notes', 'Ghi chú'),
    ],
  },
  lyluanchinhtri_ids: { ten: 'Lý luận chính trị', sapXep: 'date_start', cot: DAOTAO_BD },
  quanlynhanuoc_ids: { ten: 'Quản lý nhà nước', sapXep: 'date_start', cot: DAOTAO_BD },
  trinhdongoaingu_ids: { ten: 'Ngoại ngữ', sapXep: 'date_start', cot: DAOTAO_BD },
  trinhdotinhoc_ids: { ten: 'Tin học', sapXep: 'date_start', cot: DAOTAO_BD },
  quocphong_anninh_ids: { ten: 'Bồi dưỡng quốc phòng - an ninh', sapXep: 'date_start', cot: DAOTAO_BD },
  tieng_dantoc_ids: { ten: 'Tiếng dân tộc', sapXep: 'date_start', cot: DAOTAO_BD },
  vnpt_daotaoboiduong_ids: {
    ten: 'Bồi dưỡng chức danh nghề nghiệp, nghiệp vụ chuyên ngành', sapXep: 'start_date',
    cot: [
      C('ten_khoadaotao', 'Khóa bồi dưỡng / chứng chỉ'), C('noidaotao', 'Cơ sở đào tạo'), C('start_date', 'Từ', 'date'), C('end_date', 'Đến', 'date'),
      C('thoigian_daotao', 'Thời lượng'), C('hedaotao_id', 'Hình thức'), C('field_training_id', 'Lĩnh vực'), C('result', 'Kết quả'),
      C('chungchi_id', 'Văn bằng / chứng chỉ'), C('certificate_name', 'Tên văn bằng'), C('certificate', 'Cấp chứng chỉ'),
      C('provided', 'Đơn vị cấp'), C('ngay_cap', 'Ngày cấp', 'date'), C('nuocdaotao_id', 'Nước đào tạo'), C('is_sent_to_study', 'Cử đi học', 'bool'), C('job_id', 'Ngạch / chức danh'), C('notes', 'Ghi chú'),
    ],
  },
  vnpt_chung_chi_hanh_nghe_ids: {
    ten: 'Chứng chỉ hành nghề', sapXep: 'ngay_cap',
    cot: [C('name', 'Chứng chỉ'), C('so_chung_chi_hanh_nghe', 'Số chứng chỉ'), C('ngay_cap', 'Ngày cấp', 'date'), C('noicap', 'Nơi cấp'),
      C('pham_vi_chuyen_mon', 'Phạm vi hoạt động'), C('vnpt_ngay_bat_dau', 'Từ', 'date'), C('vnpt_ngay_ket_thuc', 'Đến', 'date'), C('notes', 'Ghi chú')],
  },
  vanbang_chungchi_ids: {
    ten: 'Văn bằng, chứng chỉ khác', sapXep: 'ngaycap_chungchi',
    cot: [C('name', 'Văn bằng / chứng chỉ'), C('chungchi_id', 'Tên (danh mục)'), C('loai_chungchi_id', 'Loại'), C('coso_daotao', 'Cơ sở đào tạo'),
      C('ngaycap_chungchi', 'Ngày cấp', 'date'), C('provided', 'Đơn vị cấp'), C('diem', 'Điểm / kết quả'), C('notes', 'Ghi chú')],
  },
  vnpt_quatrinhsinhhoatdang_ids: {
    ten: 'Quá trình sinh hoạt Đảng', sapXep: 'vnpt_ngay_bat_dau',
    cot: [C('vnpt_ngay_bat_dau', 'Từ ngày', 'date'), C('vnpt_ngay_ket_thuc', 'Đến ngày', 'date'), C('donvi_sinhhoat', 'Chi bộ sinh hoạt'),
      C('chucvu', 'Chức vụ Đảng'), C('ti_le_dong_phi', 'Tỷ lệ đóng đảng phí (%)', 'number'), C('muc_dong_phi', 'Mức đóng', 'number'), C('notes', 'Ghi chú')],
  },
  vnpt_quatrinhsinhhoatdoan_ids: {
    ten: 'Quá trình sinh hoạt Đoàn', sapXep: 'vnpt_ngay_bat_dau',
    cot: [C('vnpt_ngay_bat_dau', 'Từ ngày', 'date'), C('vnpt_ngay_ket_thuc', 'Đến ngày', 'date'), C('donvi_sinhhoat', 'Chi đoàn sinh hoạt'),
      C('chucvu', 'Chức vụ Đoàn'), C('ti_le_dong_phi', 'Tỷ lệ đóng phí (%)', 'number'), C('notes', 'Ghi chú')],
  },
  vnpt_thamgia_tochuc_xahoi_ids: {
    ten: 'Tham gia tổ chức xã hội', sapXep: 'ngaythamgia',
    cot: [C('tochuc_xh', 'Tổ chức'), C('chucvu', 'Chức vụ'), C('ngaythamgia', 'Ngày tham gia', 'date'), C('ngay_ket_thuc', 'Ngày kết thúc', 'date'), C('mota', 'Mô tả')],
  },
  vnpt_khenthuong_ids: {
    ten: 'Khen thưởng', sapXep: 'ngayquyetdinh',
    cot: [C('nam_khenthuong', 'Năm'), C('hinhthuckhenthuong', 'Hình thức'), C('job_related', 'Chức vụ khi khen thưởng'), C('danhhieukhenthuong_id', 'Danh hiệu thi đua'),
      C('name', 'Nội dung'), C('loai_khenthuong_id', 'Loại'), C('cap_khenthuong_id', 'Cấp quyết định'),
      C('soquyetdinh', 'Số quyết định'), C('ngayquyetdinh', 'Ngày quyết định', 'date'), C('noiquyetdinh', 'Cơ quan ban hành'),
      C('nguoiquyetdinh', 'Người ký'), C('khenthuong_caonhat', 'Cao nhất', 'bool'), C('thoigian_nangluong', 'Nâng lương trước hạn (tháng)', 'number'),
      C('notes', 'Ghi chú')],
  },
  vnpt_kyluat_ids: {
    ten: 'Kỷ luật', sapXep: 'ngayquyetdinh',
    cot: [C('nam_kyluat', 'Năm'), C('hinhthuckyluat', 'Hình thức'), C('loai_kyluat_id', 'Loại'), C('name', 'Hành vi vi phạm'),
      C('cap_kyluat_id', 'Cấp quyết định'), C('soquyetdinh', 'Số quyết định'), C('ngayquyetdinh', 'Ngày quyết định', 'date'),
      C('noiquyetdinh', 'Cơ quan ban hành'), C('nguoiquyetdinh', 'Người ký'), C('den_ngay', 'Đến ngày', 'date'),
      C('thoigian_nangluong', 'Kéo dài nâng lương (tháng)', 'number'), C('notes', 'Ghi chú')],
  },
  vnpt_quatrinhdanhgia_ids: {
    ten: 'Kết quả đánh giá, xếp loại', sapXep: 'year',
    cot: [C('year', 'Năm'), C('result', 'Kết quả'), C('loaicanbo_id', 'Loại cán bộ'), C('nguoi_danh_gia', 'Cấp có thẩm quyền đánh giá'),
      C('thoigian_nangluong', 'Kéo dài nâng lương (tháng)', 'number'), C('notes', 'Ghi chú')],
  },
  vnpt_congtacnuocngoai_ids: {
    ten: 'Đi công tác, học tập nước ngoài', sapXep: 'date_start',
    cot: [C('date_start', 'Từ ngày', 'date'), C('date_end', 'Đến ngày', 'date'), C('country_id', 'Nước'), C('name', 'Mục đích'),
      C('type', 'Cử / tự đi'), C('department_options', 'Loại đơn vị'), C('donvicudi_text', 'Đơn vị cử'), C('notes', 'Ghi chú')],
  },
  vnpt_nghiencuukhoahoc_ids: {
    ten: 'Nghiên cứu khoa học', sapXep: 'ngaythamgia',
    cot: [C('detai', 'Đề tài'), C('capdetai', 'Cấp đề tài'), C('tucach', 'Tư cách tham gia'), C('ngaythamgia', 'Ngày tham gia', 'date'), C('ketqua', 'Kết quả')],
  },
  vnpt_thongtintrungcu_ids: {
    ten: 'Trúng cử', sapXep: 'ngay_trungcu',
    cot: [C('chuccu_trungcu', 'Chức vụ trúng cử'), C('chucvu', 'Chức vụ'), C('chucdanh', 'Chức danh'), C('ngay_trungcu', 'Ngày trúng cử', 'date')],
  },
  vnpt_daibieuquochoi_ids: {
    ten: 'Đại biểu dân cử', sapXep: 'vnpt_ngay_bat_dau',
    cot: [C('loaihinh_daibieu', 'Loại hình'), C('nhiemky', 'Nhiệm kỳ'), C('vnpt_ngay_bat_dau', 'Từ', 'date'), C('vnpt_ngay_ket_thuc', 'Đến', 'date'), C('thongtin_chitiet', 'Chi tiết')],
  },
  lamviec_chedocu_ids: {
    ten: 'Làm việc trong chế độ cũ', sapXep: 'date_start',
    cot: [C('date_start', 'Từ ngày', 'date'), C('date_end', 'Đến ngày', 'date'), C('notes', 'Chức danh, chức vụ, đơn vị, địa điểm')],
  },
  thamgia_tochuc_nuocngoai_ids: {
    ten: 'Tham gia, quan hệ tổ chức nước ngoài', sapXep: 'date_start',
    cot: [C('date_start', 'Từ ngày', 'date'), C('date_end', 'Đến ngày', 'date'), C('notes', 'Tên tổ chức, trụ sở, công việc')],
  },
  vnpt_hr_giandoan_ids: {
    ten: 'Gián đoạn công tác', sapXep: 'ngay_bat_dau',
    cot: [C('ngay_bat_dau', 'Từ ngày', 'date'), C('ngay_ket_thuc', 'Ngày quay lại', 'date'), C('loai_nghi_id', 'Loại nghỉ'), C('ly_do', 'Lý do'), C('so_quyet_dinh', 'Số quyết định')],
  },
  vitri_vieclam_line_ids: {
    ten: 'Vị trí việc làm', sapXep: 'date_ap_dung',
    cot: [C('date_ap_dung', 'Ngày áp dụng', 'date'), C('vitri_vieclam_id', 'Vị trí việc làm'), C('bac_nghenghiep_id', 'Cấp bậc nghề nghiệp'), C('loaicanbo_id', 'Loại cán bộ')],
  },
  vnpt_hr_thongtin_suckhoe_ids: {
    ten: 'Khám sức khỏe', sapXep: 'year',
    cot: [C('year', 'Năm'), C('nam', 'Năm (ghi chữ)'), C('tinh_trang_suc_khoe', 'Tình trạng'), C('phan_loai', 'Phân loại sức khỏe'), C('notes', 'Ghi chú')],
  },
  vaccine_record_ids: {
    ten: 'Tiêm chủng', sapXep: 'injection_date',
    cot: [C('vaccine_injection_type_id', 'Loại'), C('vaccine_injection_ordinal_id', 'Mũi'), C('injection_date', 'Ngày tiêm', 'date'), C('vaccine_name', 'Vắc-xin'), C('agency', 'Đơn vị tiêm')],
  },
  baohiem_ids: {
    ten: 'Bảo hiểm', sapXep: 'ngay_bat_dau_bhxh',
    cot: [C('insurance_type', 'Loại'), C('so_so_bhxh', 'Số sổ BHXH'), C('ngay_bat_dau_bhxh', 'Ngày tham gia', 'date'), C('so_the_bhyt', 'Số thẻ BHYT'),
      C('ngay_het_han_bhyt', 'Hết hạn BHYT', 'date'), C('noi_dang_ky', 'Nơi đăng ký KCB'), C('muc_dong_bhxh', 'Mức đóng', 'number')],
  },
  nha_o_ids: {
    ten: 'Nhà ở', sapXep: null,
    cot: [C('loai_dat', 'Loại', 'chon', { chon: 'loaiNha' }), C('loai_khac', 'Loại khác'), C('dien_tich', 'Diện tích (m²)', 'number'),
      C('giay_chung_nhan', 'Giấy chứng nhận'), C('mota', 'Mô tả')],
  },
  dat_o_ids: {
    ten: 'Đất ở', sapXep: null,
    cot: [C('loai_dat', 'Loại', 'chon', { chon: 'loaiDat' }), C('loai_khac', 'Loại khác'), C('dien_tich', 'Diện tích (m²)', 'number'),
      C('giay_chung_nhan', 'Giấy chứng nhận'), C('mota', 'Mô tả')],
  },
};

// Danh sách mọi trường đã khai — dùng để gom "trường khác" chưa có trong lược đồ.
const DA_KHAI = new Set([...NHOM.flatMap((n) => [...n.truong.map((t) => t.k), ...(n.bang || [])]), 'id', '_ma', '_capNhat']);
// Trường tính sẵn của hệ thống nguồn (cờ "có/không có thông tin…", tuổi tính sẵn) — không hiện,
// vì phần mềm tự tính lại từ dữ liệu gốc cho khỏi lệch.
const AN = /^(is_(kyluat|trinhdochuyenmon|lyluanchinhtri|quanlynhanuoc|tinhoc|ngoaingu|quocphonganninh|tiengdantoc|nghiepvuchuyennganh|chungchihanhnghe|giuchucvu|hocham|chucdanhkhoahoc|doituongchinhsach|phucap)|tuoi|tuoi_nhanvien|job_code|department_code|madonvi|machucvu|gender|state_nghihuu|is_giahan|ngay_gia_han_nghi_huu|vnpt_ko_la_dang_vien|is_dt_nuocngoai|ngoai_donvi_quanly|is_tinhphidang_taidvtinhluong)$/;

// ---------------------------------------------------------------------------
//  Tiện ích chuỗi, ngày
// ---------------------------------------------------------------------------
export const boDau = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd').toLowerCase();

/** Chuỗi ngày của hệ thống nguồn ('YYYY-MM-DD' hoặc 'YYYY-MM-DD HH:MM:SS') → Date (giờ địa phương). */
export function ngay(v) {
  if (!v || typeof v !== 'string') return null;
  const m = v.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  const d = new Date(+m[1], +m[2] - 1, +m[3]);
  return Number.isNaN(d.getTime()) ? null : d;
}
export const dmy = (v) => {
  const d = ngay(v);
  return d ? `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}` : (v ? String(v) : '');
};
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const soNgay = (tu, den) => Math.round((den - tu) / 86400000);
/** Tuổi tròn năm tại ngày `homNay`. */
export function tuoi(birthday, homNay = new Date()) {
  const b = ngay(birthday);
  if (!b) return null;
  let t = homNay.getFullYear() - b.getFullYear();
  if (homNay.getMonth() < b.getMonth() || (homNay.getMonth() === b.getMonth() && homNay.getDate() < b.getDate())) t--;
  return t;
}

/** Hiển thị một giá trị theo định nghĩa trường. */
export function hienThi(def, v) {
  if (v === undefined || v === null || v === '' || v === false && def.kieu !== 'bool') return '';
  switch (def.kieu) {
    case 'date': return dmy(v);
    case 'bool': return v ? 'Có' : '';
    case 'number': return typeof v === 'number' ? v.toLocaleString('vi-VN', { maximumFractionDigits: 3 }) : String(v);
    case 'list': return Array.isArray(v) ? v.filter(Boolean).join('; ') : String(v);
    case 'chon': return (CHON[def.chon] || {})[v] ?? String(v);
    default: return Array.isArray(v) ? v.join('; ') : String(v);
  }
}

/** Ngạch hiển thị: '01.002 - Chuyên viên chính' → { ma: '01.002', ten: 'Chuyên viên chính' }. */
export function tachNgach(s) {
  const m = String(s || '').match(/^\s*([A-Za-z0-9.]+)\s*-\s*(.+)$/);
  return m ? { ma: m[1], ten: m[2].trim() } : { ma: '', ten: String(s || '').trim() };
}
/** Phòng/ban cuối cùng của chuỗi 'Văn phòng … / Phòng …'. */
export const phongCua = (h) => {
  const p = String(h?.department_id || '').split('/').map((x) => x.trim()).filter(Boolean);
  return p.length ? p[p.length - 1] : '';
};
const viet = (s) => String(s || '').toLocaleLowerCase('vi').replace(/(^|\s)(\p{L})/gu, (m, a, b) => a + b.toLocaleUpperCase('vi'));
/** Họ tên viết hoa chữ cái đầu (hệ thống nguồn có hồ sơ ghi IN HOA, có hồ sơ ghi thường). */
export const hoTen = (h) => viet(h?.name || '');

// ---------------------------------------------------------------------------
//  Tóm tắt một hồ sơ (dùng cho danh sách, thẻ, xuất Excel)
// ---------------------------------------------------------------------------
const trongNhom = (h, k) => (Array.isArray(h?.[k]) ? h[k] : []);
export function bangSapXep(h, k) {
  const def = BANG[k];
  const rows = trongNhom(h, k);
  if (!def?.sapXep) return rows;
  return [...rows].sort((a, b) => String(b[def.sapXep] || '').localeCompare(String(a[def.sapXep] || '')));
}

/** Diễn biến lương MỚI NHẤT (ngày hiệu lực lớn nhất). */
export const luongHienTai = (h) => bangSapXep(h, 'salary_fluctuations_history_ids')[0] || null;

export function tomTat(h, homNay = new Date()) {
  const ngach = tachNgach(h.job_id);
  const lg = luongHienTai(h);
  return {
    ma: h.vnpt_ma_nhan_vien || h._ma || '',
    ten: hoTen(h),
    phong: phongCua(h),
    chucVu: h.vitri_congviec || '',
    ngach: ngach.ten, maNgach: ngach.ma,
    loai: h.loaicanbo_id || '',
    gioiTinh: CHON.gioi_tinh[h.gioi_tinh] || '',
    ngaySinh: h.birthday || '',
    tuoi: tuoi(h.birthday, homNay),
    dangVien: !!(h.vnpt_la_dang_vien_ok || h.vnpt_ngay_vao_dang),
    trinhDo: h.vnpt_trinhdodaotao_id || '',
    llct: h.lyluanchinhtri || '',
    qlnn: h.quanlynhanuoc || '',
    heSo: h.hsluong_2c ?? lg?.he_so ?? null,
    bac: h.bac_luong_2c ?? null,
    dienThoai: h.mobile_phone || '',
    email: h.work_email || '',
    trangThai: CHON.status[h.status] || '',
    hoanThien: doHoanThien(h).tyLe,
  };
}

// ---------------------------------------------------------------------------
//  Mức hoàn thiện hồ sơ — các trường mà hệ thống nguồn đánh dấu BẮT BUỘC (*)
//  trong tài liệu "Hướng dẫn nhập liệu hồ sơ CCVC 3.0" + các bảng cốt lõi Mẫu 2C.
// ---------------------------------------------------------------------------
export const BAT_BUOC = [
  ['name', 'Họ và tên'], ['vnpt_ma_nhan_vien', 'Mã cán bộ'], ['loaicanbo_id', 'Loại cán bộ'], ['gioi_tinh', 'Giới tính'],
  ['birthday', 'Ngày sinh'], ['department_id', 'Đơn vị'], ['work_email', 'Thư điện tử'], ['socancuoc', 'Số CCCD'],
  ['vnpt_ngay_cap_can_cuoc', 'Ngày cấp CCCD'], ['noisinh_tinh', 'Nơi sinh'], ['quequan_tinh_thanhpho_id', 'Quê quán'],
  ['country_id', 'Quốc tịch'], ['vnpt_dan_toc', 'Dân tộc'], ['vnpt_ton_giao', 'Tôn giáo'],
  ['hokhauthuongtru_tinh_thanhpho_id', 'Nơi thường trú'], ['noiohiennay_tinh_thanhpho_id', 'Nơi ở hiện nay'],
  ['marital', 'Tình trạng hôn nhân'], ['vnpt_ngay_vao_don_vi', 'Ngày vào cơ quan'], ['job_id', 'Ngạch / chức danh'],
  ['datotnghieplop_id', 'Giáo dục phổ thông'], ['vnpt_trinhdodaotao_id', 'Trình độ chuyên môn'],
  ['so_so_bhxh', 'Số sổ BHXH'], ['vnpt_thongtingiadinh_ids', 'Quan hệ gia đình'],
  ['vnpt_quatrinhcongtac_ids', 'Quá trình công tác'], ['salary_fluctuations_history_ids', 'Diễn biến lương'],
];
export function doHoanThien(h) {
  const thieu = BAT_BUOC.filter(([k]) => {
    const v = h?.[k];
    return v === undefined || v === null || v === '' || v === false || (Array.isArray(v) && !v.length);
  }).map(([, n]) => n);
  return { tyLe: Math.round(((BAT_BUOC.length - thieu.length) / BAT_BUOC.length) * 100), thieu };
}

/** Các trường có dữ liệu nhưng chưa có trong lược đồ hiển thị (để không "mất" trường nào). */
export function truongKhac(h, nhan = {}) {
  return Object.keys(h || {})
    .filter((k) => !DA_KHAI.has(k) && !AN.test(k) && !k.startsWith('_'))
    .map((k) => ({ k, nhan: nhan[k] || k, v: h[k] }))
    .filter((x) => x.v !== undefined && x.v !== null && x.v !== '' && x.v !== false);
}

// ---------------------------------------------------------------------------
//  Tìm kiếm, lọc, sắp xếp
// ---------------------------------------------------------------------------
export function loc(ds, { q = '', phong = '', loai = '', gioi = '', dang = '' } = {}) {
  const t = boDau(q).trim();
  return ds.filter((h) => {
    if (phong && phongCua(h) !== phong) return false;
    if (loai && (h.loaicanbo_id || '') !== loai) return false;
    if (gioi && h.gioi_tinh !== gioi) return false;
    if (dang === 'co' && !(h.vnpt_la_dang_vien_ok || h.vnpt_ngay_vao_dang)) return false;
    if (dang === 'khong' && (h.vnpt_la_dang_vien_ok || h.vnpt_ngay_vao_dang)) return false;
    if (!t) return true;
    const kho = boDau([h.name, h.vnpt_tengoikhac, h.vnpt_ma_nhan_vien, h.department_id, h.vitri_congviec, h.job_id,
      h.mobile_phone, h.work_email, h.vnpt_trinhdodaotao_id, h.chuyen_nganh_dao_tao].filter(Boolean).join(' '));
    return t.split(/\s+/).every((w) => kho.includes(w));
  });
}

// Thứ tự hiển thị: lãnh đạo trước theo thứ bậc phòng ban của hệ thống nguồn, rồi theo tên.
const THU_TU_PHONG = ['Lãnh đạo HĐND tỉnh', 'Lãnh đạo Đoàn ĐBQH', 'Lãnh đạo các ban HĐND tỉnh', 'Lãnh đạo Văn phòng', 'Đại biểu dân cử',
  'Phòng Công tác Quốc hội', 'Phòng Công tác Hội đồng nhân dân', 'Phòng Tổng hợp, Thông tin, Dân nguyện', 'Phòng Hành chính, Tổ chức, Quản trị'];
const hangPhong = (p) => { const i = THU_TU_PHONG.indexOf(p); return i < 0 ? 99 : i; };
const tenRieng = (h) => boDau(String(h.name || '').trim().split(/\s+/).pop());
export function sapXep(ds) {
  return [...ds].sort((a, b) => hangPhong(phongCua(a)) - hangPhong(phongCua(b))
    || (b.vitri_congviec ? 1 : 0) - (a.vitri_congviec ? 1 : 0)
    || tenRieng(a).localeCompare(tenRieng(b)) || boDau(a.name).localeCompare(boDau(b.name)));
}

// ---------------------------------------------------------------------------
//  Thống kê tổng hợp (Tổng quan)
// ---------------------------------------------------------------------------
const dem = (arr) => {
  const m = new Map();
  arr.forEach((x) => { const k = x || 'Chưa có thông tin'; m.set(k, (m.get(k) || 0) + 1); });
  return [...m.entries()].map(([nhan, so]) => ({ nhan, so })).sort((a, b) => b.so - a.so);
};
export const NHOM_TUOI = [['Đến 30', 0, 30], ['31 - 40', 31, 40], ['41 - 50', 41, 50], ['51 - 60', 51, 60], ['Trên 60', 61, 200]];

export function thongKe(ds, homNay = new Date()) {
  const tt = ds.map((h) => tomTat(h, homNay));
  const tuoiCo = tt.map((x) => x.tuoi).filter((x) => x != null);
  return {
    tong: ds.length,
    nu: tt.filter((x) => x.gioiTinh === 'Nữ').length,
    dangVien: tt.filter((x) => x.dangVien).length,
    tuoiTB: tuoiCo.length ? Math.round((tuoiCo.reduce((a, b) => a + b, 0) / tuoiCo.length) * 10) / 10 : null,
    theoLoai: dem(tt.map((x) => x.loai)),
    theoPhong: dem(tt.map((x) => x.phong)).sort((a, b) => hangPhong(a.nhan) - hangPhong(b.nhan)),
    theoTuoi: NHOM_TUOI.map(([nhan, a, b]) => ({ nhan, so: tt.filter((x) => x.tuoi != null && x.tuoi >= a && x.tuoi <= b).length })),
    theoTrinhDo: dem(tt.map((x) => x.trinhDo)),
    theoLLCT: dem(tt.map((x) => x.llct)),
    theoNgach: dem(tt.map((x) => x.ngach)),
    hoanThienTB: tt.length ? Math.round(tt.reduce((a, x) => a + x.hoanThien, 0) / tt.length) : 0,
  };
}

// ---------------------------------------------------------------------------
//  Nhắc việc nhân sự rút từ chính hồ sơ (không cần nhập thêm)
//    - nâng lương: "Thời gian dự kiến điều chỉnh lương lần sau" ở diễn biến lương mới nhất
//    - nghỉ hưu: "Ngày dự kiến nghỉ hưu" của hệ thống nguồn
//    - hết thời hạn giữ chức vụ: 05 năm kể từ ngày bổ nhiệm (lại) gần nhất
//    - phụ cấp có thời hạn sắp hết
//    - sinh nhật trong 30 ngày tới · hồ sơ thiếu trường bắt buộc
// ---------------------------------------------------------------------------
export const NGUONG = { nangLuong: 120, nghiHuu: 365, boNhiem: 180, phuCap: 60, sinhNhat: 30 };
const muc = (con) => (con < 0 ? 'quaHan' : con <= 30 ? 'khan' : 'sapToi');

export function nhacViec(ds, homNay = new Date(), nguong = NGUONG) {
  const out = [];
  const nay = new Date(homNay.getFullYear(), homNay.getMonth(), homNay.getDate());
  const them = (h, loai, tieuDe, ngayMoc, chiTiet = '') => {
    const d = ngay(ngayMoc);
    if (!d) return;
    const con = soNgay(nay, d);
    out.push({ ma: h.vnpt_ma_nhan_vien, ten: hoTen(h), phong: phongCua(h), loai, tieuDe, ngay: iso(d), con, muc: muc(con), chiTiet });
  };
  for (const h of ds) {
    const lg = luongHienTai(h);
    const nl = lg?.ngay_dukien_nangluong;
    if (nl) { const c = soNgay(nay, ngay(nl)); if (c <= nguong.nangLuong && c >= -365) them(h, 'nangLuong', 'Đến kỳ nâng lương', nl, lg.bacluong_id ? `đang ở ${lg.bacluong_id}, hệ số ${lg.he_so ?? ''}` : ''); }

    const nh = h.ngay_du_kien_nghi_huu;
    if (nh) { const c = soNgay(nay, ngay(nh)); if (c <= nguong.nghiHuu && c >= -30) them(h, 'nghiHuu', 'Nghỉ hưu', nh, 'chuẩn bị thông báo nghỉ hưu trước 06 tháng'); }

    const bn = ngay(h.ngay_bo_nhiem_lai) || ngay(h.ngay_bo_nhiem);
    if (bn && h.vitri_congviec) {
      const het = new Date(bn.getFullYear() + 5, bn.getMonth(), bn.getDate());
      const c = soNgay(nay, het);
      if (c <= nguong.boNhiem && c >= -365) them(h, 'boNhiem', 'Hết thời hạn giữ chức vụ (05 năm)', iso(het), h.vitri_congviec);
    }

    for (const pc of trongNhom(h, 'allowance_history_ids')) {
      if (!pc.date_end) continue;
      const c = soNgay(nay, ngay(pc.date_end));
      if (c >= -30 && c <= nguong.phuCap) them(h, 'phuCap', `Hết hạn ${pc.allowance_config_id || 'phụ cấp'}`, pc.date_end, pc.is_extension ? 'có gia hạn' : '');
    }

    const b = ngay(h.birthday);
    if (b) {
      let sn = new Date(nay.getFullYear(), b.getMonth(), b.getDate());
      if (sn < nay) sn = new Date(nay.getFullYear() + 1, b.getMonth(), b.getDate());
      const c = soNgay(nay, sn);
      if (c <= nguong.sinhNhat) out.push({ ma: h.vnpt_ma_nhan_vien, ten: hoTen(h), phong: phongCua(h), loai: 'sinhNhat', tieuDe: `Sinh nhật (tròn ${sn.getFullYear() - b.getFullYear()} tuổi)`, ngay: iso(sn), con: c, muc: 'thongTin', chiTiet: '' });
    }
  }
  const thu = { quaHan: 0, khan: 1, sapToi: 2, thongTin: 3 };
  return out.sort((a, b) => thu[a.muc] - thu[b.muc] || a.con - b.con);
}

// ---------------------------------------------------------------------------
//  NHẬP DỮ LIỆU — tệp JSON xuất từ qlccvc.thanhhoa.gov.vn
//    { nguon, ngayLay, donVi, nhan:{khóa:nhãn}, nhanBang:{bảng:{khóa:nhãn}}, hoSo:[{...}] }
//  Trả { ok, goi } với goi = gói lưu ở hr_data.hoSo, hoặc { ok:false, loi }.
// ---------------------------------------------------------------------------
export function docTepNhap(raw) {
  let d = raw;
  if (typeof raw === 'string') {
    try { d = JSON.parse(raw.charCodeAt(0) === 0xFEFF ? raw.slice(1) : raw); } catch { return { ok: false, loi: 'Tệp không phải JSON hợp lệ.' }; }
  }
  const ds = Array.isArray(d?.hoSo) ? d.hoSo : Array.isArray(d?.ds) ? d.ds : Array.isArray(d) ? d : null;
  if (!ds) return { ok: false, loi: 'Không tìm thấy danh sách hồ sơ (khóa "hoSo") trong tệp.' };
  const hop = ds.filter((h) => h && typeof h === 'object' && (h.vnpt_ma_nhan_vien || h._ma) && h.name);
  if (!hop.length) return { ok: false, loi: 'Tệp không có hồ sơ nào đủ "Mã cán bộ" và "Họ và tên".' };
  const ma = new Set();
  const trung = [];
  const sach = hop.map((h) => {
    const { id: _bo, ...r } = h;   // id nội bộ của hệ thống nguồn: không cần giữ
    const m = String(r.vnpt_ma_nhan_vien || r._ma).trim();
    if (ma.has(m)) trung.push(m);
    ma.add(m);
    return { ...r, vnpt_ma_nhan_vien: m };
  });
  if (trung.length) return { ok: false, loi: `Tệp có mã cán bộ bị trùng: ${[...new Set(trung)].join(', ')}.` };
  return {
    ok: true,
    boQua: ds.length - hop.length,
    goi: {
      nguon: d.nguon || 'qlccvc.thanhhoa.gov.vn',
      ngayLay: d.ngayLay || '',
      donVi: d.donVi || '',
      nhan: (d.nhan && typeof d.nhan === 'object') ? d.nhan : {},
      nhanBang: (d.nhanBang && typeof d.nhanBang === 'object') ? d.nhanBang : {},
      ds: sach,
    },
  };
}

/** Ghép gói mới vào gói đang có theo MÃ CÁN BỘ. Hồ sơ đã sửa tay trên phần mềm sau lần nhập trước
 *  vẫn bị THAY bằng bản mới của hệ thống nguồn (hệ thống nguồn là bản chính thống) — giao diện
 *  hỏi lại trước khi ghép. Hồ sơ không có trong tệp mới thì GIỮ NGUYÊN (không tự xóa). */
export function ghepGoi(cu, moi) {
  const dsCu = Array.isArray(cu?.ds) ? cu.ds : [];
  const theoMa = new Map(dsCu.map((h) => [h.vnpt_ma_nhan_vien, h]));
  let them = 0, capNhat = 0;
  const suaTay = [];
  for (const h of moi.ds) {
    const c = theoMa.get(h.vnpt_ma_nhan_vien);
    if (c) { capNhat++; if (c._capNhat) suaTay.push(h.vnpt_ma_nhan_vien); } else them++;
    theoMa.set(h.vnpt_ma_nhan_vien, h);
  }
  const giuLai = dsCu.filter((h) => !moi.ds.some((x) => x.vnpt_ma_nhan_vien === h.vnpt_ma_nhan_vien)).length;
  return {
    goi: { ...moi, nhan: { ...(cu?.nhan || {}), ...moi.nhan }, nhanBang: { ...(cu?.nhanBang || {}), ...moi.nhanBang }, ds: [...theoMa.values()] },
    them, capNhat, giuLai, suaTay,
  };
}

/** Hồ sơ trống để thêm tay. */
export const hoSoMoi = (ma, ten) => ({ vnpt_ma_nhan_vien: String(ma || '').trim(), name: String(ten || '').trim(), status: 'confirmed' });

// ---------------------------------------------------------------------------
//  CHUYỂN SANG MẪU 2C/TCTW-98 — tạo đối tượng đúng khuôn mà src/lib/export2C.js đọc.
// ---------------------------------------------------------------------------
const noi = (...a) => a.filter((x) => x && String(x).trim()).join(', ');
const thangNam = (v) => { const d = ngay(v); return d ? `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}` : ''; };

export function sang2C(h) {
  const ngach = tachNgach(h.job_id);
  const kt = bangSapXep(h, 'vnpt_khenthuong_ids');
  const kl = bangSapXep(h, 'vnpt_kyluat_ids');
  const dg = trongNhom(h, 'vnpt_quatrinhdanhgia_ids');
  const ngoaiNgu = trongNhom(h, 'trinhdongoaingu_ids').map((r) => noi(r.ngoaingu_id, r.vanbang_duoccap)).filter(Boolean);
  const tinHoc = trongNhom(h, 'trinhdotinhoc_ids').map((r) => r.vanbang_duoccap || r.trinhdodaotao_id).filter(Boolean);
  const daoTao = [
    ...bangSapXep(h, 'vnpt_daotao_chungchi_ids').map((r) => ({
      school: r.vnpt_co_so_dao_tao || r.coso_daotao_ngoainuoc || r.cosodaotao_ngoaidanhmuc || '',
      major: r.vnpt_chuyen_nganh_dao_tao_id || r.cn_daotao_ngoainuoc || r.chuyennganh_ngoaidanhmuc || '',
      from: thangNam(r.vnpt_ngay_bat_dau), to: thangNam(r.vnpt_ngay_ket_thuc), form: r.vnpt_he_dao_tao || '',
      degree: r.vanbang_chungchi || r.trinhdodaotao || '',
    })),
    ...['lyluanchinhtri_ids', 'quanlynhanuoc_ids', 'trinhdongoaingu_ids', 'trinhdotinhoc_ids', 'quocphong_anninh_ids', 'tieng_dantoc_ids']
      .flatMap((k) => bangSapXep(h, k).map((r) => ({
        school: r.cosodaotao || r.cosodaotao_id || r.cosodaotao_ngoaidanhmuc || '',
        major: r.lyluanchinhtri_id || r.quanlynhanuoc_id || r.ngoaingu_id || r.tieng_dantoc_id || BANG[k].ten,
        from: thangNam(r.date_start), to: thangNam(r.date_end), form: r.hedaotao_id || '', degree: r.vanbang_duoccap || '',
      }))),
    ...bangSapXep(h, 'vnpt_daotaoboiduong_ids').map((r) => ({
      school: r.noidaotao || '', major: r.ten_khoadaotao || '', from: thangNam(r.start_date), to: thangNam(r.end_date),
      form: r.hedaotao_id || '', degree: r.certificate_name || r.chungchi_id || '',
    })),
  ];
  const congTac = [...trongNhom(h, 'vnpt_quatrinhcongtac_ids')]
    .sort((a, b) => String(a.vnpt_ngay_bat_dau || '').localeCompare(String(b.vnpt_ngay_bat_dau || '')))
    .map((r) => ({
      from: thangNam(r.vnpt_ngay_bat_dau), to: r.vnpt_ngay_ket_thuc ? thangNam(r.vnpt_ngay_ket_thuc) : 'nay',
      content: noi(r.vitricongviec || r.chucvu_id || r.chucvu_ngoaidanhmuc, r.chucdanh_id || r.chucdanh_ngoaidanhmuc || r.job_id,
        r.name_id || r.donvi_id || r.donvi_ngoaidanhmuc),
    }));
  const giaDinh = trongNhom(h, 'vnpt_thongtingiadinh_ids').map((r) => ({
    relation: r.vnpt_moi_quan_he_id || CHON.loaiquanhe[r.loaiquanhe] || '',
    name: r.name || '', birth: r.vnpt_nam_sinh || (r.giadinh_birthday ? String(ngay(r.giadinh_birthday)?.getFullYear() || '') : ''),
    info: noi(r.quequan_nghenghiep_chucvu || noi(r.nghenghiep, r.donvicongtac, r.diachinoio), r.damat ? 'đã mất' : ''),
  }));
  const kinhTe = [
    h.nguonthunhapchinh_luong && `Lương: ${h.nguonthunhapchinh_luong}`,
    h.nguonthunhapchinh_khac && `Thu nhập khác: ${h.nguonthunhapchinh_khac}`,
    ...trongNhom(h, 'nha_o_ids').map((r) => `Nhà ở: ${noi(CHON.loaiNha[r.loai_dat], r.loai_khac, r.dien_tich ? `${r.dien_tich} m²` : '', r.mota)}`),
    ...trongNhom(h, 'dat_o_ids').map((r) => `Đất ở: ${noi(CHON.loaiDat[r.loai_dat], r.loai_khac, r.dien_tich ? `${r.dien_tich} m²` : '', r.mota)}`),
  ].filter(Boolean).join('; ');
  const lg = luongHienTai(h);
  return {
    name: h.name || '', otherName: h.vnpt_tengoikhac || '', birth: h.birthday || '',
    gender: h.gioi_tinh === 'nu' ? 'nu' : 'nam',
    birthPlace: h.place_of_birth || noi(h.noisinh_xa, h.noisinh_huyen, h.noisinh_tinh),
    hometown: noi(h.quequan_thon_xom, h.quequan_xa_phuong_id, h.quequan_quan_huyen_id, h.quequan_tinh_thanhpho_id) || h.vnpt_nguyen_quan || '',
    ethnic: h.vnpt_dan_toc || '', religion: h.vnpt_ton_giao || '',
    residence: noi(h.hokhauthuongtru_thon_xom, h.hokhauthuongtru_xa_phuong_id, h.hokhauthuongtru_quan_huyen_id, h.hokhauthuongtru_tinh_thanhpho_id),
    address: noi(h.noiohiennay_thon_xom, h.noiohiennay_xa_phuong_id, h.noiohiennay_quan_huyen_id, h.noiohiennay_tinh_thanhpho_id),
    jobWhenHired: h.nghenghieptruoctuyendung || h.nghenghieptuyendung || '',
    hireDate: h.ngaytuyendung || '', hireAgency: h.coquantuyendung || '',
    position: h.vitri_congviec || ngach.ten, partyPosition: h.chucvu_dang || '', unionPosition: h.chucvudoan || '',
    mainWork: h.main_job || '',
    // Ngạch ghi theo hệ thống nguồn (có cả chức danh viên chức, lái xe…) — export2C in nguyên văn khi có ngachText.
    ngachText: ngach.ma ? `${ngach.ten} (mã ${ngach.ma})` : ngach.ten,
    loaiText: h.loaicanbo_id || '',
    nguon: 'Hệ thống quản lý CBCCVC tỉnh Thanh Hóa (qlccvc.thanhhoa.gov.vn), nhập vào phân hệ Hồ sơ cán bộ',
    bac: h.bac_luong_2c ?? lg?.bacluong_id ?? '', heso: h.hsluong_2c ?? lg?.he_so ?? '',
    salaryDate: h.ngay_huong_bac || lg?.ngay_hieuluc || '', vuotKhungPct: lg?.phucap_vuotkhung || 0,
    eduGeneral: h.datotnghieplop_id || '',
    eduMajor: noi(h.vnpt_trinhdodaotao_id, h.chuyen_nganh_dao_tao || h.vnpt_chuyen_nganh_dao_tao),
    eduDegree: noi(h.hoc_ham_id, h.chucdanhkhoahoc_id),
    politics: h.lyluanchinhtri || '', stateAdmin: h.quanlynhanuoc || '',
    foreignLang: h.ngoaingu_caonhat_id || ngoaiNgu.join('; '), it: h.tinhoc_caonhat_id || tinHoc.join('; '),
    partyDate: h.vnpt_ngay_vao_dang || '', partyOfficialDate: h.ngaychinhthucvaodang || '',
    unionDate: h.vnpt_ngay_vao_doan || h.ngaythamgiatcct || h.vnpt_ngay_vao_cong_doan || '',
    armyIn: h.ngaynhapngu || '', armyOut: h.ngayxuatngu || '', armyRank: h.quanhamcaonhat || '',
    honour: h.danhhieuphongtang || '', strength: h.sotruong_congtac || '',
    reward: kt.slice(0, 6).map((r) => noi(r.nam_khenthuong, r.hinhthuckhenthuong, r.danhhieukhenthuong_id || r.name)).join('; '),
    discipline: kl.map((r) => noi(r.nam_kyluat, r.hinhthuckyluat, r.name)).join('; ') || 'Không',
    health: h.vnpt_trang_thai_suc_khoe || '', height: h.vnpt_chieu_cao || '', weight: h.vnpt_can_nang || '', bloodType: h.vnpt_nhommau || '',
    policyFamily: noi(h.hang_thuongbinh_id || h.hangthuongbinh, (h.doituong_chinhsach_ids || []).join('; '), h.ghichuchinhsach),
    idNumber: h.socancuoc || '', idDate: h.vnpt_ngay_cap_can_cuoc || '', idPlace: h.vnpt_noi_cap_can_cuoc || '',
    insuranceNo: h.so_so_bhxh || '',
    training: daoTao, history: congTac, family: giaDinh,
    selfHistory: noi(h.dacdiemlichsubanthan, h.bibattu, h.quanhenuocngoai, h.thannhannuocngoai) || '',
    economy: kinhTe,
    remark: h.nhanxetdonviquanly || (dg.length ? `Kết quả đánh giá, xếp loại: ${[...dg].sort((a, b) => String(b.year).localeCompare(String(a.year))).slice(0, 5).map((r) => `${r.year}: ${r.result}`).join('; ')}.` : ''),
  };
}
