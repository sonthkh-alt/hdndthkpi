// ============================================================================
//  LẤY TIN THANH HÓA — phần CHẠM MẠNG, dùng chung cho api/tintuc.js (Vercel)
//  và tools/bantin/chay.mjs (máy Văn phòng). Mọi quy tắc chọn tin nằm ở
//  src/lib/tinTuc.js; ở đây chỉ tải các kênh RSS rồi giao cho lõi đó.
// ============================================================================
import { KENH, phanTichRss, chonTin } from '../../src/lib/tinTuc.js';

const TRINH_DUYET = 'Mozilla/5.0 (compatible; TinTucThanhHoa/2.0; +https://hdndthkpi.vercel.app)';

/** Tải một kênh, có trần chờ. Kênh hỏng → ném lỗi cho nơi gọi ghi nhận. */
async function taiKenh(kenh, choMs) {
  const r = await fetch(kenh.url, {
    headers: { 'User-Agent': TRINH_DUYET, Accept: 'application/rss+xml, text/xml, */*' },
    signal: AbortSignal.timeout(choMs),
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return phanTichRss(await r.text(), kenh);
}

/**
 * Tải SONG SONG mọi kênh. Một kênh hỏng không làm hỏng cả lượt.
 * @returns {Promise<{tin: object[], tho: number, loi: string[], kenhDoc: number}>}
 */
export async function layTin({ choMs = 8000, bayGio = new Date(), kenh = KENH } = {}) {
  const kq = await Promise.allSettled(kenh.map((k) => taiKenh(k, choMs)));
  const tho = []; const loi = [];
  kq.forEach((x, i) => {
    if (x.status === 'fulfilled') tho.push(...x.value);
    else loi.push(`${kenh[i].id}: ${x.reason?.message || 'lỗi'}`);
  });
  return { tin: chonTin(tho, { bayGio }), tho: tho.length, loi, kenhDoc: kenh.length - loi.length };
}
