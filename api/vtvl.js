// ============================================================================
//  GET /api/vtvl — ĐỌC CÔNG KHAI (CHỈ ĐỌC) dữ liệu phân hệ "Bộ biểu Vị trí việc làm".
//
//  Vì sao có điểm đọc này: người dùng muốn KHÁCH xem được dữ liệu cán bộ đã nhập.
//  Cách chuẩn là policy `vtvl_data_public_read` (BƯỚC 11, supabase/schema.sql),
//  nhưng khi bước SQL đó chưa chạy thì trình duyệt của khách đọc ra rỗng. Hàm
//  này đọc bằng khóa bí mật sẵn có trên Vercel (cùng khóa bot chat đang dùng) để
//  khách xem được NGAY, không phụ thuộc việc chạy SQL.
//
//  Ranh giới: CHỈ phương thức GET, CHỈ đúng một dòng `vtvl_data` (id cố định,
//  không nhận tham số), dữ liệu đi qua danh sách trắng `chuanHoaVTVL` (chỉ các
//  cột nhập của bộ biểu + đơn vị, kỳ, người cập nhật). Không ghi gì.
// ============================================================================
import { getRow, hasStore, isServiceKey } from './_lib/store.js';
import { chuanHoaVTVL } from '../src/lib/vtvl.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ loi: 'Điểm này chỉ cho phép đọc (GET).' });
  }
  if (!hasStore() || !isServiceKey()) return res.status(503).json({ loi: 'Máy chủ chưa cấu hình khóa đọc dữ liệu.' });
  try {
    const row = await getRow('vtvl_data');
    // Bộ đệm ngắn ở biên Vercel: nhiều khách mở cùng lúc không dồn về Supabase.
    res.setHeader('Cache-Control', 'public, s-maxage=20, stale-while-revalidate=60');
    if (!row) return res.status(200).json({ doc: null, ts: null });
    return res.status(200).json({ doc: chuanHoaVTVL(row.data), ts: row.updated_at });
  } catch (e) {
    console.warn('api/vtvl:', e.message);
    return res.status(502).json({ loi: 'Không đọc được dữ liệu bộ biểu.' });
  }
}
