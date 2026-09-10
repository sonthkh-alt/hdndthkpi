import { useEffect, useState } from 'react';
import { Newspaper, Maximize2, Download, CalendarDays } from 'lucide-react';
import {
  TEN_ANH, TEN_ANH_NHE, TEN_CHU_THICH, TEN_MUC_LUC, TY_LE_ANH,
  docChuThich, docMucLuc, duongDan, duongDanLuuTru, hienNgay, laBanTinCu, mocNgay,
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

const GOC = () => String(import.meta.env.BASE_URL || '/').replace(/\/+$/, '');

/** Đọc một tệp JSON; hỏng hoặc thiếu thì trả null chứ không ném lỗi. */
async function docJson(url) {
  try {
    const r = await fetch(url, { cache: 'no-cache' });
    return r.ok ? await r.json() : null;
  } catch {
    return null;
  }
}

export default function BanTin() {
  const [tt, datTT] = useState(null);      // null = đang dò; false = không có ảnh
  const [mucLuc, datMucLuc] = useState([]); // các ngày có trong kho lưu trữ
  const [chonNgay, datChonNgay] = useState(''); // '' = bản tin mới nhất
  const [dangTai, datDangTai] = useState(false);

  // ---- Bản tin MỚI NHẤT + mục lục lưu trữ (chạy một lần khi mở trang) ----
  useEffect(() => {
    let con = true;
    const goc = GOC();
    const moc = mocNgay();

    (async () => {
      // Ảnh gốc là bắt buộc; không có nó thì coi như chưa có bản tin.
      const anhGoc = await coTep(duongDan(goc, TEN_ANH, moc));
      if (!con) return;
      if (!anhGoc) { datTT(false); return; }

      // Ảnh nhẹ, chú thích và mục lục đều TÙY CHỌN — thiếu vẫn chạy.
      const [anhNhe, chuThich, ml] = await Promise.all([
        coTep(duongDan(goc, TEN_ANH_NHE, moc)),
        docJson(duongDan(goc, TEN_CHU_THICH, moc)),
        docJson(duongDan(goc, TEN_MUC_LUC, moc)),
      ]);
      if (!con) return;
      datTT({ anhGoc, anhHien: anhNhe || anhGoc, ...docChuThich(chuThich) });
      datMucLuc(docMucLuc(ml));
    })();

    return () => { con = false; };
  }, []);

  // ---- Đổi sang một ngày trong kho lưu trữ ----
  useEffect(() => {
    if (!chonNgay) return undefined;
    let con = true;
    datDangTai(true);
    const goc = GOC();
    const anh = duongDanLuuTru(goc, chonNgay, 'jpg');

    (async () => {
      const [co, chuThich] = await Promise.all([
        coTep(anh),
        docJson(duongDanLuuTru(goc, chonNgay, 'json')),
      ]);
      if (!con) return;
      datDangTai(false);
      if (!co) {
        // Mục lục có ngày mà tệp lại thiếu -> nói thật, đừng để khung ảnh vỡ.
        datTT((cu) => (cu ? { ...cu, thieuTep: true, ngay: chonNgay } : cu));
        return;
      }
      // Bản lưu trữ chỉ có MỘT ảnh nhẹ (xem giải thích ở public/bantin/README.md),
      // nên ảnh hiển thị và ảnh "xem khổ lớn" là cùng một tệp.
      datTT({ anhGoc: anh, anhHien: anh, thieuTep: false, ...docChuThich(chuThich) });
    })();

    return () => { con = false; };
  }, [chonNgay]);

  if (!tt) return null;

  const ngay = hienNgay(tt.ngay);
  // Đang xem bản lưu trữ thì không gắn nhãn "chưa có bản mới hơn" — người xem tự chọn ngày cũ.
  const cu = !chonNgay && laBanTinCu(tt.ngay);
  const ngayMoiNhat = mucLuc[0] || '';

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
          {/*
            Có kho lưu trữ thì huy hiệu ngày thành HỘP CHỌN để xem lại bản tin cũ.
            Dùng thẻ <select> của trình duyệt chứ không tự dựng menu: bàn phím dùng được,
            điện thoại hiện bộ chọn quen thuộc, và không phải viết mã đóng/mở.
          */}
          {mucLuc.length > 1 ? (
            <label className="shrink-0 inline-flex items-center gap-1.5">
              <span className="sr-only">Chọn ngày bản tin</span>
              <CalendarDays className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              <select
                value={chonNgay || ngayMoiNhat}
                onChange={(e) => datChonNgay(e.target.value === ngayMoiNhat ? '' : e.target.value)}
                disabled={dangTai}
                title="Chọn ngày để xem lại bản tin đã đăng"
                className="text-[11px] font-bold px-2.5 py-1 rounded-full border bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 cursor-pointer disabled:opacity-60"
              >
                {mucLuc.map((d, i) => (
                  <option key={d} value={d}>
                    {i === 0 ? `Ngày ${hienNgay(d)} (mới nhất)` : `Ngày ${hienNgay(d)}`}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            ngay && (
              <span className={`inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${
                cu ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                {cu ? `Bản tin ngày ${ngay} (chưa có bản mới hơn)` : `Ngày ${ngay}`}
              </span>
            )
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
