// ============================================================================
//  ĐỌC SỐ LIỆU PHÂN HỆ "GIÁM SÁT SỐ THANH HÓA" cho bot chat.
//
//  Phân hệ này là ứng dụng RIÊNG (repo sonthkh-alt/giamsat, chạy trên GitHub
//  Pages, không dùng Supabase của hệ thống đánh giá). Nhưng dữ liệu của nó là
//  các tệp JSON TĨNH phục vụ công khai, nên bot đọc thẳng bằng fetch — không
//  cần khóa, không cần tài khoản.
//
//  Cách tra tệp giống hệt ứng dụng đó: thử `data/<tên>` trước (dữ liệu thật),
//  404 thì lùi về `data/mau/<tên>` (dữ liệu giả lập).
//
//  ⚠️ RANH GIỚI RIÊNG TƯ: kho mã của phân hệ đó là kho CÔNG KHAI nên bản ghi
//  kiến nghị cử tri cố ý KHÔNG chứa danh tính người kiến nghị. Bot vì vậy cũng
//  không có gì để lộ; tuyệt đối không suy đoán thêm tên tuổi.
//
//  Đổi địa chỉ phân hệ thì sửa GIAMSAT_URL (hoặc khai biến môi trường cùng tên).
// ============================================================================
export const GOC = () => (process.env.GIAMSAT_URL || 'https://sonthkh-alt.github.io/giamsat').replace(/\/+$/, '');

const CHO = 8000; // phân hệ tĩnh nên phải nhanh; chờ lâu là hỏng, đừng kéo dài lượt chat

async function tepJson(duongDan) {
  const ac = new AbortController();
  const hen = setTimeout(() => ac.abort(), CHO);
  try {
    const r = await fetch(`${GOC()}/${duongDan}`, { signal: ac.signal });
    if (r.status === 404) return null;
    if (!r.ok) throw new Error(`Giám sát số ${r.status} khi đọc ${duongDan}`);
    return await r.json();
  } finally { clearTimeout(hen); }
}

/** Đọc một tệp dữ liệu: ưu tiên bản thật, không có thì lấy bản giả lập. */
export async function docTep(ten) {
  const that = await tepJson(`data/${ten}`);
  if (that !== null) return { duLieu: that, moPhong: false };
  const mau = await tepJson(`data/mau/${ten}`);
  if (mau !== null) return { duLieu: mau, moPhong: true };
  return { duLieu: null, moPhong: false };
}

const NHAN_XEP_LOAI = { tot: 'Tốt', kha: 'Khá', dat: 'Đạt', chua_dat: 'Chưa đạt' };
const NHAN_TRANG_THAI_NV = {
  hoan_thanh: 'Hoàn thành',
  hoan_thanh_mot_phan: 'Hoàn thành một phần',
  chua_hoan_thanh: 'Chưa hoàn thành',
  qua_han: 'Quá hạn',
  khong_thuc_hien: 'Không thực hiện',
  chua_dap_ung_yeu_cau: 'Chưa đáp ứng yêu cầu',
};
const NHAN_KIEN_NGHI = {
  tiep_nhan: 'Đã tiếp nhận',
  da_chuyen: 'Đã chuyển cơ quan có thẩm quyền',
  dang_giai_quyet: 'Cơ quan đang giải quyết',
  da_tra_loi: 'Đã có văn bản trả lời',
  da_giai_quyet_xong: 'Đã giải quyết xong',
  chua_dap_ung_yeu_cau: 'Trả lời chưa đáp ứng yêu cầu',
};

const dem = (ds, lay) => ds.reduce((a, x) => { const k = lay(x); a[k] = (a[k] || 0) + 1; return a; }, {});
const keBang = (o, nhan) => Object.entries(o).map(([k, v]) => `${nhan[k] || k}: ${v}`).join(' · ');

/**
 * Phần định dạng THUẦN (không đụng mạng) — tách ra để kiểm thử bằng Node.
 * @param {object} d { donVi, nghiQuyet, ketQua, nhiemVu, kienNghi, moPhong }
 */
export function fmtGiamSat(d) {
  const {
    donVi = [], nghiQuyet = [], ketQua = [], nhiemVu = [], kienNghi = [], moPhong = false,
  } = d || {};
  const tenDonVi = new Map(donVi.map((x) => [x.ma, x.ten]));
  const khoi = [];

  khoi.push(`## Giám sát số Thanh Hóa (phân hệ riêng: sonthkh-alt.github.io/giamsat)\n`
    + `Quản lý hoạt động giám sát theo 12 nhóm nghiệp vụ GS-01…GS-12 (Luật 121/2025/QH15).`
    + (moPhong ? '\n⚠️ Số liệu dưới đây là DỮ LIỆU GIẢ LẬP phục vụ chạy thử, không phải số liệu chính thức.' : ''));

  if (donVi.length) khoi.push(`Đơn vị theo dõi: ${donVi.length} xã, phường.`);

  if (nghiQuyet.length) {
    const theoHieuLuc = dem(nghiQuyet, (n) => n.hieuLuc || 'khong_ro');
    khoi.push(`### Kho nghị quyết cấp xã (GS-02)\n`
      + `Tổng ${nghiQuyet.length} nghị quyết. Hiệu lực — ${keBang(theoHieuLuc, {
        con_hieu_luc: 'còn hiệu lực', het_hieu_luc: 'hết hiệu lực', da_thay_the: 'đã được thay thế',
      })}.`);
  }

  if (ketQua.length) {
    const theoXepLoai = dem(ketQua, (k) => k.xepLoai || 'khong_ro');
    const trai = ketQua.filter((k) => k.coNoiDungTraiPhapLuat).length;
    khoi.push(`### Kết quả thẩm định\n`
      + `Đã thẩm định ${ketQua.length} văn bản. Xếp loại — ${keBang(theoXepLoai, NHAN_XEP_LOAI)}.`
      + (trai ? ` Có ${trai} văn bản bị kết luận có nội dung trái pháp luật.` : ''));
  }

  if (nhiemVu.length) {
    const theoTrangThai = dem(nhiemVu, (n) => n.trangThai || 'khong_ro');
    khoi.push(`### Nhiệm vụ sau giám sát (GS-11, GS-12)\n`
      + `Tổng ${nhiemVu.length} nhiệm vụ. ${keBang(theoTrangThai, NHAN_TRANG_THAI_NV)}.`);
  }

  if (kienNghi.length) {
    const theoTrangThai = dem(kienNghi, (k) => k.trangThai || 'khong_ro');
    const xong = kienNghi.filter((k) => k.trangThai === 'da_giai_quyet_xong').length;
    const dong = kienNghi.slice(0, 20).map((k) => {
      const noi = tenDonVi.get(k.maDonVi) || k.maDonVi || 'chưa rõ đơn vị';
      return `- ${k.id} | ${noi} | ${NHAN_KIEN_NGHI[k.trangThai] || k.trangThai}`
        + ` | hạn trả lời ${k.hanTraLoi || 'chưa ấn định'} | cơ quan giải quyết: ${k.coQuanGiaiQuyet || 'chưa xác định'}`
        + ` | ${String(k.noiDung || '').slice(0, 160)}`;
    });
    khoi.push(`### Kiến nghị, phản ánh của cử tri (GS-07)\n`
      + `Tổng ${kienNghi.length} kiến nghị, đã giải quyết xong ${xong}. ${keBang(theoTrangThai, NHAN_KIEN_NGHI)}.\n`
      + `Bản ghi CỐ Ý không chứa họ tên, số điện thoại hay địa chỉ của cử tri — đừng suy đoán thêm.\n`
      + `Cử tri theo dõi tiến trình bằng mã tra cứu in kèm mã QR: ${GOC()}/#/tra-cuu\n`
      + `${dong.join('\n')}${kienNghi.length > 20 ? `\n(Chỉ liệt kê 20/${kienNghi.length} kiến nghị gần nhất.)` : ''}`);
  }

  if (khoi.length === 1) {
    return { meta: null, text: `${khoi[0]}\nChưa đọc được bản ghi nào của phân hệ này.` };
  }
  return {
    meta: { nghiQuyet: nghiQuyet.length, ketQua: ketQua.length, nhiemVu: nhiemVu.length, kienNghi: kienNghi.length },
    text: khoi.join('\n\n'),
  };
}

/** Nạp số liệu phân hệ Giám sát số. Hỏng một tệp thì bỏ tệp đó, không làm hỏng cả lượt chat. */
export async function giamSatFacts(nam = new Date().getFullYear()) {
  const bo = async (ten) => docTep(ten).catch(() => ({ duLieu: null, moPhong: false }));
  const [donVi, nghiQuyet, ketQua, nhiemVu, kienNghi] = await Promise.all([
    bo('donvi.json'),
    bo(`nghiquyet/${nam}.json`),
    bo(`ketqua/${nam}.json`),
    bo(`nhiemvu/${nam}.json`),
    bo(`kiennghi/${nam}.json`),
  ]);
  const mang = (x) => (Array.isArray(x.duLieu) ? x.duLieu : []);
  return fmtGiamSat({
    donVi: mang(donVi),
    nghiQuyet: mang(nghiQuyet),
    ketQua: mang(ketQua),
    nhiemVu: mang(nhiemVu),
    kienNghi: mang(kienNghi),
    moPhong: [nghiQuyet, ketQua, nhiemVu, kienNghi].some((x) => x.moPhong),
  });
}
