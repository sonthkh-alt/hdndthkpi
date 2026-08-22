// ============================================================================
//  ĐỌC SỐ LIỆU PHÂN HỆ "MỘT DỮ LIỆU – KHÔNG BÁO CÁO LẠI" cho bot chat.
//
//  Phân hệ này là ứng dụng RIÊNG (FastAPI + SQLite, repo sonthkh-alt/onedata-thanhhoa).
//  Nó có sẵn điểm nối DỮ LIỆU MỞ công khai trả JSON: GET /cong-khai/tai-xuong
//  — không cần khóa, không cần tài khoản.
//
//  ⚠️ MÁY CHỦ NGỦ: chạy trên Render gói Free nên sau ~15 phút không ai dùng thì
//  ngủ, lần gọi kế tiếp mất 30-60 giây để dậy. Một lượt chat KHÔNG chờ nổi lâu
//  như vậy (Zalo gửi lại tin khi ta trả lời chậm). Vì thế ở đây đặt trần chờ
//  ngắn: hết giờ thì trả về LỜI GIẢI THÍCH cho AI nói lại với người hỏi, chứ
//  không kéo dài lượt chat và cũng không im lặng bịa số.
//
//  Số liệu bên đó là DỮ LIỆU MÔ PHỎNG phục vụ trình diễn — luôn nói rõ điều này.
// ============================================================================
export const GOC = () => (process.env.ONEDATA_URL || 'https://onedata-thanhhoa.onrender.com').replace(/\/+$/, '');

/** Trần chờ. Ngắn có chủ đích — xem ghi chú "MÁY CHỦ NGỦ" ở đầu tệp. */
export const CHO_MS = () => Number(process.env.ONEDATA_TIMEOUT_MS || 7000);

const NGU = 'đang ngủ';

/** Phần định dạng THUẦN (không đụng mạng) — kiểm thử được bằng Node. */
export function fmtOneData(doc) {
  const tap = Array.isArray(doc?.tap_du_lieu) ? doc.tap_du_lieu : [];
  const dau = `## Một dữ liệu – Không báo cáo lại (phân hệ riêng: ${GOC()})\n`
    + `Kho dữ liệu dùng chung của tỉnh theo QĐ 2053 và 2176/QĐ-UBND.`;
  if (!tap.length) {
    return { meta: null, text: `${dau}\nChưa đọc được chỉ tiêu nào từ điểm nối dữ liệu mở của phân hệ này.` };
  }

  const khoi = tap.map((ct) => {
    const so = Array.isArray(ct.so_lieu) ? ct.so_lieu : [];
    const giaTri = so.map((x) => Number(x.gia_tri)).filter((x) => Number.isFinite(x));
    const tb = giaTri.length ? Math.round((giaTri.reduce((a, b) => a + b, 0) / giaTri.length) * 10) / 10 : null;
    const sapXep = [...so]
      .filter((x) => Number.isFinite(Number(x.gia_tri)))
      .sort((a, b) => Number(b.gia_tri) - Number(a.gia_tri));
    const cao = sapXep[0];
    const thap = sapXep[sapXep.length - 1];
    const dong = so.map((x) => `${x.ten_don_vi}: ${x.gia_tri}`).join(' · ');
    return `- [${ct.ma_chi_tieu}] ${ct.ten_chi_tieu} (${ct.don_vi_tinh || 'chưa rõ đơn vị tính'})`
      + ` | cơ quan chủ trì: ${ct.co_quan_chu_tri || 'chưa rõ'} | kỳ nhập liệu: ${ct.ky_nhap_lieu || 'chưa rõ'}`
      + ` | cập nhật ${ct.cap_nhat || 'chưa rõ'}`
      + (tb === null ? '' : ` | trung bình ${tb}`)
      + (cao ? ` | cao nhất ${cao.ten_don_vi} ${cao.gia_tri}` : '')
      + (thap && thap !== cao ? ` | thấp nhất ${thap.ten_don_vi} ${thap.gia_tri}` : '')
      + (dong ? `\n  Theo đơn vị — ${dong}` : '');
  });

  return {
    meta: { chiTieu: tap.length, ky: doc?.ky || '' },
    text: `${dau}\n⚠️ ${doc?.luu_y || 'Dữ liệu mô phỏng phục vụ trình diễn.'}`
      + ` Kỳ số liệu: ${doc?.ky || 'chưa rõ'}. Nguồn: ${doc?.nguon || 'chưa rõ'}.\n`
      + `${tap.length} chỉ tiêu:\n${khoi.join('\n')}`,
  };
}

/** Lời nhắn khi máy chủ của phân hệ chưa kịp dậy — để AI nói lại cho người hỏi. */
export function fmtDangNgu() {
  return {
    meta: null,
    text: `## Một dữ liệu – Không báo cáo lại (phân hệ riêng: ${GOC()})\n`
      + `Máy chủ của phân hệ này ${NGU} (chạy trên gói miễn phí, tự ngủ khi không có ai dùng) nên lượt hỏi này `
      + `CHƯA lấy được số liệu. Hãy nói thật với người hỏi là chưa lấy được, mời họ mở ${GOC()} `
      + `(lần mở đầu chậm 30-60 giây để máy chủ khởi động) hoặc hỏi lại sau ít phút. TUYỆT ĐỐI không đoán số.`,
  };
}

/** Nạp dữ liệu mở của phân hệ. Không bao giờ ném lỗi ra ngoài — chat vẫn phải chạy. */
export async function oneDataFacts() {
  const ac = new AbortController();
  const hen = setTimeout(() => ac.abort(), CHO_MS());
  try {
    const r = await fetch(`${GOC()}/cong-khai/tai-xuong`, { signal: ac.signal });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return fmtOneData(await r.json());
  } catch {
    return fmtDangNgu();
  } finally {
    clearTimeout(hen);
  }
}
