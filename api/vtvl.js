// ============================================================================
//  /api/vtvl — ĐỌC và GHI bộ biểu Vị trí việc làm theo TỪNG ĐƠN VỊ.
//
//  GET  /api/vtvl            → bộ biểu MẶC ĐỊNH (Văn phòng Đoàn ĐBQH và HĐND tỉnh)
//  GET  /api/vtvl?ds=1       → danh sách đơn vị đã có bộ biểu (không trả nội dung)
//  GET  /api/vtvl?dv=<slug>  → bộ biểu của một HĐND xã, phường
//  POST /api/vtvl            → LƯU bộ biểu của một HĐND xã, phường
//
//  ⚠️ ĐÂY LÀ CHỖ DUY NHẤT TRONG HỆ THỐNG CHO NGƯỜI CHƯA ĐĂNG NHẬP GHI DỮ LIỆU.
//     Lý do: cán bộ HĐND xã, phường không có tài khoản trên hệ thống này, nhưng
//     vẫn phải kê khai được bộ biểu của xã mình. Hàm này ghi bằng khóa bí mật của
//     Vercel (bỏ qua RLS) nên MỌI chốt chặn phải nằm ngay tại đây:
//
//       1. KHÔNG BAO GIỜ ghi vào dòng 'vtvl_data' (bộ biểu của cơ quan tỉnh) —
//          dòng đó chỉ người ĐÃ ĐĂNG NHẬP ghi được, qua trình duyệt + RLS.
//       2. Chỉ ghi vào dòng có dạng 'vtvl_dv_<slug>' dựng TỪ TÊN đơn vị, tên phải
//          nêu rõ cấp xã (kiemTraTen) — không nhận id tùy ý từ bên ngoài.
//       3. Dữ liệu đi qua DANH SÁCH TRẮNG `chuanHoaVTVL` (chỉ các cột nhập của bộ
//          biểu) — không ai nhét được trường lạ vào bảng app_state.
//       4. MÃ SỬA: tạo mới thì máy chủ sinh mã, chỉ lưu CHUỖI BĂM SHA-256; lần sau
//          muốn ghi phải gửi đúng mã. Người ĐÃ ĐĂNG NHẬP được miễn (để Văn phòng
//          tỉnh sửa, gỡ rối cho xã khi xã mất mã).
//       5. Trần dung lượng mỗi lần ghi, trần SỐ ĐƠN VỊ, và trần SỐ LẦN GHI mỗi ngày
//          theo người gọi — chống một người tạo rác làm phình bảng dữ liệu.
//       6. Khóa lạc quan theo `updated_at` (casRow) — hai người nhập cùng lúc thì
//          người lưu sau nhận xung đột chứ không ghi đè mù.
//     KHÔNG có đường XÓA: khách không xóa được bộ biểu của bất kỳ ai.
//
//  Bộ biểu theo thiết kế KHÔNG chứa dữ liệu cá nhân (D1 dùng mã nguồn lực), nên
//  mã sửa chỉ để các đơn vị không ghi đè lên nhau, không phải cơ chế bảo mật.
// ============================================================================
import { createHash, randomInt } from 'node:crypto';
import { getRow, putRow, listRows, casRow, hasStore, isServiceKey } from './_lib/store.js';
import { verifyUser } from './_lib/xacThuc.js';
import { ngayVN, khoaDem, donNgayCu } from './_lib/hanMuc.js';
import { chuanHoaVTVL } from '../src/lib/vtvl.js';
import {
  ID_TINH, TEN_TINH, laIdDonVi, idTuSlug, slugDonVi, kiemTraTen, kiemTraMaSua,
  moBoc, dongBoc, mucDanhSach, gopTinh, MA_SUA_KY_TU, MA_SUA_DAI,
} from '../src/lib/vtvlDonVi.js';

const QUOTA_ID = 'vtvl_quota';
// Sổ băm mã sửa: { <slug>: <băm SHA-256> }.
// ⚠️ ĐẶT Ở DÒNG RIÊNG, KHÔNG nằm trong dòng dữ liệu của đơn vị — vì dòng dữ liệu
//    đơn vị được MỞ ĐỌC CÔNG KHAI (BƯỚC 11 schema.sql). Mã chỉ 8 ký tự nên băm
//    SHA-256 không muối mà phơi ra Internet thì dò ngược được bằng máy. Dòng này
//    chỉ khóa bí mật của máy chủ đọc được, nên không có gì để dò.
const MA_ID = 'vtvl_ma';
const maxDonVi = () => Number(process.env.VTVL_MAX_DONVI ?? 400);
const maxLuuNgay = () => Number(process.env.VTVL_QUOTA_LUU ?? 120);
const maxKB = () => Number(process.env.VTVL_MAX_KB ?? 4096);

const bam = (ma) => createHash('sha256').update(`vtvl|${String(ma).toUpperCase()}`).digest('hex');
const sinhMaSua = () => Array.from({ length: MA_SUA_DAI }, () => MA_SUA_KY_TU[randomInt(MA_SUA_KY_TU.length)]).join('');

/** So chuỗi băm theo ĐỘ DÀI CỐ ĐỊNH, không thoát sớm ở ký tự đầu khác nhau. */
function bangNhau(a, b) {
  const x = String(a || ''); const y = String(b || '');
  if (x.length !== y.length || !x) return false;
  let hieu = 0;
  for (let i = 0; i < x.length; i += 1) hieu |= x.charCodeAt(i) ^ y.charCodeAt(i);
  return hieu === 0;
}

/** Trừ một lần ghi trong ngày. Không đếm được thì VẪN cho ghi (đếm là chống rác, không phải chặn chi phí). */
async function truLuotLuu(req, user) {
  const tran = maxLuuNgay();
  if (tran <= 0) return { ok: true };
  try {
    const row = await getRow(QUOTA_ID);
    const d = donNgayCu(row?.data, ngayVN());
    const khoa = khoaDem(req, user);
    const daDung = d.dem[khoa] || 0;
    if (daDung >= tran) return { ok: false, tran };
    d.dem[khoa] = daDung + 1;
    await putRow(QUOTA_ID, d);
    return { ok: true };
  } catch (e) {
    console.warn('api/vtvl truLuotLuu:', e.message);
    return { ok: true, khongDem: true };
  }
}

async function docSoMa() {
  const r = await getRow(MA_ID);
  return r?.data && typeof r.data === 'object' ? { ...r.data } : {};
}

/** Đọc một dòng bộ biểu → { doc, ts, ten } hoặc null khi chưa có dòng. */
async function docDonVi(id) {
  const row = await getRow(id);
  if (!row) return null;
  const b = moBoc(row.data);
  return {
    doc: b.doc ? chuanHoaVTVL(b.doc) : null,
    ts: row.updated_at || null,
    ten: b.ten || (id === ID_TINH ? TEN_TINH : ''),
  };
}

/**
 * Danh sách đơn vị cho hộp chọn.
 * ⚠️ CỐ Ý chỉ lấy `ten` và khối `tomTat` của từng dòng, KHÔNG lấy cột `data` đầy đủ:
 *    mỗi bộ biểu có thể vài MB nên kéo cả nội dung về chỉ để dựng một hộp chọn là
 *    hàng trăm MB. Dòng của tỉnh (dạng phẳng, đời đầu) không có hai trường này nên
 *    chỉ hiện tên mặc định cùng mốc `updated_at`.
 */
async function danhSach() {
  const rows = await listRows('vtvl_', 'id,updated_at,ten:data->>ten,tomTat:data->tomTat');
  const ds = [];
  for (const r of rows) {
    const laTinhRow = r.id === ID_TINH;
    // LIKE của SQL coi '_' là ký tự bất kỳ nên tiền tố khớp rộng hơn (vd 'vtvl_quota') — lọc lại.
    if (!laTinhRow && !laIdDonVi(r.id)) continue;
    const tt = r.tomTat && typeof r.tomTat === 'object' ? r.tomTat : {};
    ds.push(mucDanhSach({
      id: r.id,
      ten: laTinhRow ? TEN_TINH : r.ten,
      nguoi: tt.nguoi,
      capNhat: tt.capNhat || r.updated_at,
      soDong: tt.soDong,
      soVT: tt.soVT,
    }));
  }
  return gopTinh(ds);
}

export default async function handler(req, res) {
  const method = String(req.method || 'GET').toUpperCase();
  if (method !== 'GET' && method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ loi: 'Điểm này chỉ nhận GET (đọc) và POST (lưu bộ biểu của HĐND xã, phường).' });
  }
  if (!hasStore() || !isServiceKey()) return res.status(503).json({ loi: 'Máy chủ chưa cấu hình khóa dữ liệu.' });

  if (method === 'GET') {
    const q = req.query || {};
    try {
      if (q.ds) {
        res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=60');
        return res.status(200).json({ ds: await danhSach() });
      }
      const slug = slugDonVi(q.dv || '');
      const id = idTuSlug(slug);
      const r = await docDonVi(id);
      // Bộ đệm ngắn ở biên Vercel: nhiều khách mở cùng lúc không dồn về Supabase.
      res.setHeader('Cache-Control', 'public, s-maxage=20, stale-while-revalidate=60');
      if (!r) return res.status(200).json({ doc: null, ts: null, slug, ten: slug ? '' : TEN_TINH });
      return res.status(200).json({ ...r, slug });
    } catch (e) {
      console.warn('api/vtvl GET:', e.message);
      return res.status(502).json({ loi: 'Không đọc được dữ liệu bộ biểu.' });
    }
  }

  // ----------------------------------------------------------------- GHI (POST)
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = null; } }
  if (!body || typeof body !== 'object') return res.status(400).json({ loi: 'Thiếu dữ liệu gửi lên.' });

  const kt = kiemTraTen(body.ten);
  if (!kt.ok) return res.status(400).json({ loi: kt.loi });
  // CHỐT 1: id luôn dựng TỪ TÊN đã kiểm, không nhận id/slug tùy ý từ bên ngoài.
  const id = kt.id;
  if (id === ID_TINH || !laIdDonVi(id)) {
    return res.status(400).json({ loi: 'Điểm này chỉ lưu bộ biểu của HĐND xã, phường. Bộ biểu của cơ quan tỉnh phải đăng nhập mới sửa được.' });
  }
  if (!body.doc || typeof body.doc !== 'object') return res.status(400).json({ loi: 'Thiếu nội dung bộ biểu.' });

  const doc = chuanHoaVTVL({ ...body.doc, donVi: body.doc.donVi || kt.ten });
  const kb = Math.round(JSON.stringify(doc).length / 1024);
  if (kb > maxKB()) {
    return res.status(413).json({ loi: `Dữ liệu ${kb} KB, vượt trần ${maxKB()} KB mỗi lần lưu. Hãy tách bớt dòng hoặc nhờ Văn phòng tỉnh hỗ trợ.` });
  }

  const user = await verifyUser(req);
  try {
    const cu = await getRow(id);
    const boc = moBoc(cu?.data);
    const soMa = await docSoMa();
    // `boc.maSuaBam` là đường lùi cho dòng tạo trước khi tách sổ băm ra riêng.
    const bamCu = soMa[kt.slug] || boc.maSuaBam || '';

    if (!cu) {
      // CHỐT: trần số đơn vị — chống tạo rác làm phình bảng dữ liệu.
      const dsCo = (await danhSach()).filter((x) => !x.tinh);
      if (dsCo.length >= maxDonVi()) {
        return res.status(429).json({ loi: `Hệ thống đã có ${dsCo.length} bộ biểu đơn vị (trần ${maxDonVi()}). Liên hệ Văn phòng tỉnh để được mở thêm.` });
      }
    } else if (bamCu && !user) {
      // CHỐT: đã có mã sửa thì khách phải gửi đúng mã mới được ghi.
      const km = kiemTraMaSua(body.maSua);
      if (!km.ok) return res.status(403).json({ loi: km.loi, canMaSua: true });
      if (!bangNhau(bam(km.ma), bamCu)) {
        return res.status(403).json({ loi: 'Mã sửa không đúng. Bộ biểu này do đơn vị khác tạo — bạn vẫn xem được nhưng không sửa được. Nếu đây là đơn vị của bạn và đã mất mã, hãy liên hệ Văn phòng tỉnh.', canMaSua: true });
      }
    }

    const luot = await truLuotLuu(req, user);
    if (!luot.ok) {
      return res.status(429).json({ loi: `Bạn đã lưu ${luot.tran} lần trong hôm nay — đã đạt trần của một ngày. Dữ liệu vẫn còn trên máy này, mai lưu tiếp được.` });
    }

    // Mã sửa chỉ sinh MỘT LẦN lúc tạo.
    const maMoi = cu ? '' : sinhMaSua();
    const data = dongBoc({
      doc, ten: kt.ten, slug: kt.slug,
      nguoiTao: cu ? boc.nguoiTao : (user?.email || 'khách'),
      taoLuc: cu ? boc.taoLuc : '',
    });

    // ⚠️ Khóa lạc quan phải so với mốc NGƯỜI GỬI ĐÃ TẢI VỀ (body.tsCu), KHÔNG phải
    //    mốc hiện tại trên máy chủ — lấy mốc hiện tại thì phép so luôn đúng và việc
    //    chống ghi đè thành vô nghĩa. Dòng đã có mà người gửi không có mốc nào (tưởng
    //    là tạo mới) cũng là xung đột: casRow sẽ đi nhánh chèn và Postgres trả 409.
    const tsGui = typeof body.tsCu === 'string' && body.tsCu ? body.tsCu : null;
    // Ghi sổ băm TRƯỚC khi ghi dữ liệu: nếu làm ngược lại mà bước ghi sổ hỏng thì
    // đơn vị đã tồn tại nhưng KHÔNG có mã sửa — ai cũng ghi được vào, đúng cái lỗ
    // hổng mà mã sửa sinh ra để bịt.
    if (maMoi) await putRow(MA_ID, { ...soMa, [kt.slug]: bam(maMoi) });
    const w = await casRow(id, data, cu ? tsGui : null);
    if (!w.ok) {
      // Tạo không thành vì người khác vừa tạo xong trước → TRẢ sổ băm về như cũ,
      // nếu không ta vừa chiếm mất quyền sửa của chính người đã tạo trước đó.
      if (maMoi) { try { await putRow(MA_ID, soMa); } catch { /* đã trả 409, không chặn thêm */ } }
      return res.status(409).json({
        xungDot: true,
        loi: 'Người khác vừa lưu bộ biểu của đơn vị này nên thay đổi của bạn chưa được ghi (tránh ghi đè mất dữ liệu của nhau). Hãy tải bản mới rồi nhập lại phần của mình.',
      });
    }
    return res.status(200).json({
      ok: true, ts: w.ts, slug: kt.slug, ten: kt.ten, doc,
      ...(maMoi ? { maSua: maMoi, moi: true } : {}),
    });
  } catch (e) {
    console.warn('api/vtvl POST:', e.message);
    return res.status(502).json({ loi: 'Không lưu được lên máy chủ. Dữ liệu vẫn còn trên máy này, hãy thử lại.' });
  }
}
