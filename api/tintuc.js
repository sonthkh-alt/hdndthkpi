// ============================================================================
//  GET /api/tintuc — TIN TỨC THANH HÓA lấy TRỰC TIẾP từ RSS của Báo Thanh Hóa.
//
//  Không cần khóa, không gọi AI, không đọc/ghi cơ sở dữ liệu. Kết quả được
//  CDN của Vercel giữ 10 phút (s-maxage) và được phép dùng bản cũ tới 6 giờ
//  trong lúc lấy bản mới (stale-while-revalidate) — nhờ vậy dù nhiều người mở
//  Trang chủ cùng lúc, tòa soạn cũng chỉ nhận vài lượt đọc RSS mỗi giờ.
//
//  Không đọc được kênh nào → 502, KHÔNG trả danh sách rỗng với mã 200:
//  trình duyệt cần phân biệt "hôm nay không có tin" với "máy chủ không lấy
//  được tin" để lùi về bản dự phòng public/bantin/tin.json.
// ============================================================================
import { layTin } from './_lib/tinTuc.js';
import { TEN_NGUON, TRANG_NGUON } from '../src/lib/tinTuc.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Chỉ nhận GET.' });
  }
  try {
    const kq = await layTin({ choMs: 8000 });
    if (!kq.kenhDoc) {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(502).json({ error: 'Không đọc được kênh tin nào của nguồn.', loi: kq.loi });
    }
    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=21600');
    return res.status(200).json({
      capNhat: new Date().toISOString(), nguon: TEN_NGUON, trangNguon: TRANG_NGUON,
      kenhDoc: kq.kenhDoc, kenhLoi: kq.loi.length, tin: kq.tin,
    });
  } catch (e) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(502).json({ error: `Lỗi lấy tin: ${e.message}` });
  }
}
