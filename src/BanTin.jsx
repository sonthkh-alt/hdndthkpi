import { useEffect, useState } from 'react';
import { Newspaper, Maximize2, Download } from 'lucide-react';
import {
  TEN_ANH, TEN_ANH_NHE, TEN_CHU_THICH, TY_LE_ANH,
  docChuThich, duongDan, hienNgay, laBanTinCu, mocNgay,
} from './lib/banTin';

// ============================================================================
//  KHỐI "BẢN TIN PHÁP LUẬT HẰNG NGÀY" ở đầu Trang chủ.
//
//  Ảnh do tác vụ định kỳ của Claude đẩy vào `public/bantin/` (xem lib/banTin.js).
//  CHƯA CÓ ẢNH THÌ KHỐI NÀY BIẾN MẤT HẲN — cố ý: Trang chủ là bộ mặt cơ quan,
//  thà không có mục nào còn hơn hiện một khung ảnh vỡ.
// ============================================================================

/** Thử tải một tệp; trả về đường dẫn nếu có thật, null nếu 404. */
async function coTep(url) {
  try {
    const r = await fetch(url, { method: 'HEAD', cache: 'no-cache' });
    // Máy chủ tĩnh trả 404 kèm trang HTML khi thiếu tệp -> kiểm cả kiểu nội dung.
    if (!r.ok) return null;
    const kieu = r.headers.get('content-type') || '';
    if (kieu.includes('text/html')) return null;
    return url;
  } catch {
    return null;
  }
}

export default function BanTin() {
  const [tt, datTT] = useState(null); // null = đang dò; false = không có ảnh

  useEffect(() => {
    let con = true;
    const goc = String(import.meta.env.BASE_URL || '/').replace(/\/+$/, '');
    const moc = mocNgay();

    (async () => {
      // Ảnh gốc là bắt buộc; không có nó thì coi như chưa có bản tin.
      const anhGoc = await coTep(duongDan(goc, TEN_ANH, moc));
      if (!con) return;
      if (!anhGoc) { datTT(false); return; }

      // Ảnh nhẹ và chú thích đều TÙY CHỌN — thiếu vẫn chạy.
      const [anhNhe, chuThich] = await Promise.all([
        coTep(duongDan(goc, TEN_ANH_NHE, moc)),
        fetch(duongDan(goc, TEN_CHU_THICH, moc), { cache: 'no-cache' })
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null),
      ]);
      if (!con) return;
      datTT({ anhGoc, anhHien: anhNhe || anhGoc, ...docChuThich(chuThich) });
    })();

    return () => { con = false; };
  }, []);

  if (!tt) return null;

  const ngay = hienNgay(tt.ngay);
  const cu = laBanTinCu(tt.ngay);

  return (
    <section aria-labelledby="tieu-de-ban-tin" className="mb-8 sm:mb-10">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 sm:px-5 py-3 border-b border-slate-100">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-red-50 text-red-700 border border-red-100 shrink-0">
            <Newspaper className="w-5 h-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="tieu-de-ban-tin" className="text-[15px] sm:text-base font-extrabold text-slate-800 leading-tight">
              {tt.tieuDe || 'Bản tin pháp luật hằng ngày'}
            </h2>
            <p className="text-[11.5px] text-slate-500 mt-0.5">
              Tin pháp luật cả nước và tỉnh Thanh Hóa{tt.nguon ? ` · Nguồn: ${tt.nguon}` : ''}
            </p>
          </div>
          {ngay && (
            <span className={`inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${
              cu ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}>
              {cu ? `Bản tin ngày ${ngay} (chưa có bản mới hơn)` : `Ngày ${ngay}`}
            </span>
          )}
        </div>

        {/*
          Bố cục HAI CỘT trên màn rộng: ảnh bên trái, danh sách tin bên phải.
          Để ảnh tràn hết bề ngang thì khổ 3508x2480 chiếm trọn màn hình đầu, đẩy lưới
          phân hệ ra khỏi tầm nhìn — mà Trang chủ trước hết là chỗ vào việc. Chia cột
          vừa hạ chiều cao, vừa không để thừa khoảng trống hai bên ảnh.
        */}
        <div className="grid lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <a
            href={tt.anhGoc}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block bg-slate-100"
            title="Mở ảnh khổ lớn để đọc rõ"
          >
            <img
              src={tt.anhHien}
              alt={`Ảnh bản tin pháp luật${ngay ? ` ngày ${ngay}` : ''} — tin pháp luật cả nước và tỉnh Thanh Hóa`}
              width={3508}
              height={2480}
              style={{ aspectRatio: TY_LE_ANH }}
              className="w-full h-auto max-h-[min(60vh,560px)] object-contain"
            />
            <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-slate-900/75 text-white opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity">
              <Maximize2 className="w-3.5 h-3.5" /> Xem khổ lớn
            </span>
          </a>

          <div className="flex flex-col border-t lg:border-t-0 lg:border-l border-slate-100">
            {/* Bản CHỮ của bản tin: nội dung nằm hết trong ảnh nên người dùng trình đọc
                màn hình, người tắt ảnh và máy tìm kiếm đều cần danh sách này. */}
            {tt.tin.length > 0 ? (
              <ul className="flex-1 px-4 sm:px-5 py-3.5 space-y-2.5">
                {tt.tin.map((t) => (
                  <li key={t.tieuDe} className="text-[12.5px] text-slate-700 leading-relaxed flex gap-2">
                    <span aria-hidden="true" className="text-red-600 font-bold shrink-0">•</span>
                    <span>
                      {t.tieuDe}
                      {t.nguon && <span className="text-slate-400"> — {t.nguon}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="flex-1 px-4 sm:px-5 py-3.5 text-[12.5px] text-slate-500">
                Bấm vào ảnh để mở khổ lớn và đọc toàn văn bản tin.
              </p>
            )}

            <div className="px-4 sm:px-5 py-3 border-t border-slate-100 space-y-2">
              <div className="flex flex-wrap gap-2">
                <a
                  href={tt.anhGoc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11.5px] font-bold px-3 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800"
                >
                  <Maximize2 className="w-3.5 h-3.5" /> Xem khổ lớn
                </a>
                <a
                  href={tt.anhGoc}
                  download
                  className="inline-flex items-center gap-1.5 text-[11.5px] font-bold px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  <Download className="w-3.5 h-3.5" /> Tải ảnh
                </a>
              </div>
              <p className="text-[10.5px] text-slate-400 leading-relaxed">
                Bản tin do trợ lý AI tổng hợp tự động từ nguồn chính thống — tham khảo, cần đối chiếu văn bản gốc trước khi trích dẫn.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
