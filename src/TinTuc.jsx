// ============================================================================
//  TIN TỨC THANH HÓA — khối tin ở đầu Trang chủ + trang tin đầy đủ (#/tintuc)
//
//  Chỉ đưa tin TRONG TỈNH, ưu tiên tin về hoạt động của HĐND tỉnh và Đoàn ĐBQH
//  tỉnh. Mọi quy tắc chọn tin nằm ở src/lib/tinTuc.js.
//
//  NGUỒN DỮ LIỆU, theo thứ tự:
//    1. /api/tintuc              — máy chủ đọc RSS trực tiếp (mới tới từng 10 phút)
//    2. public/bantin/tin.json   — bản dự phòng do máy Văn phòng ghi mỗi sáng
//  Cả hai đều hỏng thì khối ở Trang chủ TỰ ẨN (Trang chủ là bộ mặt cơ quan,
//  thà không có mục nào còn hơn hiện một khung báo lỗi).
//
//  ⚠️ Trang chỉ hiển thị tiêu đề + đoạn tóm tắt tòa soạn phát qua RSS và dẫn về
//  bài gốc; không chép toàn văn, không dùng ảnh của báo (máy chủ ảnh của báo
//  chặn nhúng từ trang khác) — nên bố cục dựng bằng CHỮ là chính.
// ============================================================================
import { useEffect, useMemo, useState } from 'react';
import {
  Newspaper, ArrowUpRight, ArrowRight, Landmark, Clock, Search, Home, RefreshCw, Rss, Info,
} from 'lucide-react';
import {
  docTinTuc, tinTieuDiem, chuyenMucCo, hienLuc, timTin, TEP_DU_PHONG, TEN_NGUON, TRANG_NGUON,
} from './lib/tinTuc';

const RONG = [];
const GOC = () => String(import.meta.env.BASE_URL || '/').replace(/\/+$/, '');

/** Đọc JSON; máy chủ tĩnh trả index.html 200 cho đường dẫn thiếu → phải kiểm kiểu nội dung. */
async function docJson(url) {
  try {
    const r = await fetch(url, { cache: 'no-cache' });
    if (!r.ok || !(r.headers.get('content-type') || '').includes('json')) return null;
    return await r.json();
  } catch {
    return null;
  }
}

/** Nạp tin: máy chủ trước, bản dự phòng sau. `tt` = null (đang nạp) | {tin, capNhat, nguonDL}. */
export function useTinTuc() {
  const [tt, datTT] = useState(null);
  const [lan, datLan] = useState(0);
  useEffect(() => {
    let con = true;
    (async () => {
      const truc = docTinTuc(await docJson('/api/tintuc'));
      if (!con) return;
      if (truc.tin.length) { datTT({ ...truc, nguonDL: 'truc-tiep' }); return; }
      const duPhong = docTinTuc(await docJson(`${GOC()}/${TEP_DU_PHONG}`));
      if (con) datTT({ ...duPhong, nguonDL: duPhong.tin.length ? 'du-phong' : 'khong' });
    })();
    return () => { con = false; };
  }, [lan]);
  return [tt, () => { datTT(null); datLan((n) => n + 1); }];
}

// Màu nhấn theo chuyên mục — viết đủ tên lớp để Tailwind không loại khi build.
const MAU = {
  'Thời sự': 'bg-red-700', 'Xây dựng Đảng': 'bg-rose-700', 'Kinh tế': 'bg-emerald-700',
  'Đời sống - Xã hội': 'bg-sky-700', 'Pháp luật': 'bg-indigo-700', 'Quốc phòng - An ninh': 'bg-slate-700',
  'Giáo dục': 'bg-violet-700', 'Y tế - Sức khỏe': 'bg-teal-700', 'Về với xứ Thanh': 'bg-amber-700',
};
const CHU = {
  'Thời sự': 'text-red-700', 'Xây dựng Đảng': 'text-rose-700', 'Kinh tế': 'text-emerald-700',
  'Đời sống - Xã hội': 'text-sky-700', 'Pháp luật': 'text-indigo-700', 'Quốc phòng - An ninh': 'text-slate-700',
  'Giáo dục': 'text-violet-700', 'Y tế - Sức khỏe': 'text-teal-700', 'Về với xứ Thanh': 'text-amber-700',
};

const NhanHDND = () => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-700 text-white text-[10px] font-bold uppercase tracking-wider">
    <Landmark className="w-3 h-3" /> Hoạt động HĐND
  </span>
);
const NhanMuc = ({ t }) => (
  <span className={`text-[10.5px] font-bold uppercase tracking-wider ${CHU[t.chuyenMuc] || 'text-slate-600'}`}>{t.chuyenMuc}</span>
);
const Luc = ({ iso }) => (
  <span className="inline-flex items-center gap-1 text-[11.5px] text-slate-400"><Clock className="w-3 h-3" />{hienLuc(iso)}</span>
);
const mo = { target: '_blank', rel: 'noopener noreferrer' };

// ============================================================================
//  KHỐI TIN Ở ĐẦU TRANG CHỦ
// ============================================================================
export function KhoiTinTuc() {
  const [tt] = useTinTuc();
  const tin = tt?.tin || RONG;
  const tieuDiem = useMemo(() => tinTieuDiem(tin), [tin]);
  if (!tt || !tin.length || !tieuDiem) return null;

  const conLai = tin.filter((t) => t.id !== tieuDiem.id);
  const hdnd = conLai.filter((t) => t.hdnd).slice(0, 6);
  const daDung = new Set(hdnd.map((t) => t.id));
  const phu = conLai.filter((t) => !daDung.has(t.id)).slice(0, 4);
  // Không có tin HĐND nào khác thì cột phải thành "Mới nhất" — không để cột trống.
  const cotPhai = hdnd.length ? hdnd : conLai.filter((t) => !phu.includes(t)).slice(0, 6);

  return (
    <section className="mb-10 sm:mb-12" aria-labelledby="tin-tuc-thanh-hoa">
      <div className="flex items-end justify-between gap-3 flex-wrap mb-4 pb-3 border-b-2 border-slate-800">
        <div className="flex items-center gap-3 min-w-0">
          <span className="grid place-items-center w-10 h-10 rounded-lg bg-red-700 text-white shrink-0"><Newspaper className="w-5 h-5" /></span>
          <div className="min-w-0">
            <h2 id="tin-tuc-thanh-hoa" className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">Tin tức Thanh Hóa</h2>
            <p className="text-[12px] text-slate-500 truncate">
              Tin trong tỉnh, ưu tiên hoạt động của HĐND tỉnh và Đoàn ĐBQH tỉnh · cập nhật {hienLuc(tt.capNhat).toLowerCase()}
            </p>
          </div>
        </div>
        <a href="#/tintuc" className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-red-700 hover:text-red-900">
          Xem tất cả {tin.length} tin <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      <div className="grid lg:grid-cols-12 gap-x-8 gap-y-6">
        {/* ── Tin tiêu điểm + 4 tin kế ── */}
        <div className="lg:col-span-8 min-w-0">
          <article className="relative bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className={`h-1.5 ${tieuDiem.hdnd ? 'bg-red-700' : (MAU[tieuDiem.chuyenMuc] || 'bg-slate-700')}`} />
            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-2.5 flex-wrap mb-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Tiêu điểm</span>
                {tieuDiem.hdnd && <NhanHDND />}
                <NhanMuc t={tieuDiem} />
              </div>
              <a href={tieuDiem.lienKet} {...mo} className="group block">
                <h3 className="text-[22px] sm:text-[27px] font-extrabold text-slate-900 leading-[1.22] group-hover:text-red-800 transition-colors">
                  {tieuDiem.tieuDe}
                </h3>
              </a>
              {tieuDiem.moTa && <p className="text-[14.5px] text-slate-600 leading-relaxed mt-3">{tieuDiem.moTa}</p>}
              <div className="flex items-center justify-between gap-3 flex-wrap mt-4">
                <Luc iso={tieuDiem.luc} />
                <a href={tieuDiem.lienKet} {...mo} className="inline-flex items-center gap-1 text-[12.5px] font-bold text-red-700 hover:text-red-900">
                  Đọc bài trên Báo Thanh Hóa <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </article>

          <div className="grid sm:grid-cols-2 gap-x-6 mt-1">
            {phu.map((t) => (
              <article key={t.id} className="py-4 border-b border-slate-200">
                <div className="flex items-center gap-2 mb-1"><NhanMuc t={t} /><span className="text-slate-300">·</span><Luc iso={t.luc} /></div>
                <a href={t.lienKet} {...mo} className="block text-[15px] font-bold text-slate-800 leading-snug hover:text-red-800">{t.tieuDe}</a>
                {t.moTa && <p className="text-[12.5px] text-slate-500 leading-relaxed mt-1.5 line-clamp-3">{t.moTa}</p>}
              </article>
            ))}
          </div>
        </div>

        {/* ── Cột hoạt động HĐND ── */}
        <aside className="lg:col-span-4 min-w-0">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden h-full">
            <div className="px-4 py-3 bg-slate-900 text-white flex items-center gap-2">
              <Landmark className="w-4 h-4 text-amber-300" />
              <h3 className="text-[12.5px] font-extrabold uppercase tracking-wider">
                {hdnd.length ? 'Hoạt động HĐND · Đoàn ĐBQH tỉnh' : 'Mới nhất'}
              </h3>
            </div>
            <ol className="divide-y divide-slate-100">
              {cotPhai.map((t, i) => (
                <li key={t.id}>
                  <a href={t.lienKet} {...mo} className="flex gap-3 px-4 py-3 hover:bg-slate-50 group">
                    <span className="text-[20px] font-extrabold text-slate-200 leading-none w-6 shrink-0 tabular-nums group-hover:text-red-300">{i + 1}</span>
                    <span className="min-w-0">
                      <span className="block text-[13.5px] font-semibold text-slate-800 leading-snug group-hover:text-red-800">{t.tieuDe}</span>
                      <span className="block mt-1"><Luc iso={t.luc} /></span>
                    </span>
                  </a>
                </li>
              ))}
            </ol>
            <a href="#/tintuc" className="flex items-center justify-center gap-1.5 px-4 py-3 border-t border-slate-100 text-[12.5px] font-bold text-slate-700 hover:bg-slate-50">
              Vào trang tin <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </aside>
      </div>

      <p className="text-[11px] text-slate-400 mt-3">
        Nguồn: <a href={TRANG_NGUON} {...mo} className="underline hover:text-slate-600">{TEN_NGUON}</a> (kênh RSS công khai).
        Trang chỉ dẫn tiêu đề và đoạn tóm tắt; nội dung đầy đủ thuộc về tòa soạn, bấm vào tin để đọc bài gốc.
      </p>
    </section>
  );
}

// ============================================================================
//  TRANG TIN ĐẦY ĐỦ — #/tintuc
// ============================================================================
const MOI_TRANG = 15;

/** "Hôm nay", "Hôm qua", "Thứ Ba, 10/11/2026" theo giờ Việt Nam. */
function nhanNgay(iso, bayGio = new Date()) {
  const vn = (x) => new Date(new Date(x).getTime() + 7 * 3600000);
  const a = vn(iso); const b = vn(bayGio);
  const ngay = (x) => Date.UTC(x.getUTCFullYear(), x.getUTCMonth(), x.getUTCDate());
  const lech = (ngay(b) - ngay(a)) / 86400000;
  const hai = (n) => String(n).padStart(2, '0');
  const chu = `${hai(a.getUTCDate())}/${hai(a.getUTCMonth() + 1)}/${a.getUTCFullYear()}`;
  if (lech === 0) return `Hôm nay, ${chu}`;
  if (lech === 1) return `Hôm qua, ${chu}`;
  return `${['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'][a.getUTCDay()]}, ${chu}`;
}

export default function TinTuc({ onHome }) {
  const [tt, napLai] = useTinTuc();
  const [loc, datLoc] = useState('tat-ca');     // 'tat-ca' | 'hdnd' | <tên chuyên mục>
  const [tim, datTim] = useState('');
  const [soHien, datSoHien] = useState(MOI_TRANG);
  const tin = tt?.tin || RONG;
  const mucCo = useMemo(() => chuyenMucCo(tin), [tin]);
  const soHDND = tin.filter((t) => t.hdnd).length;

  const ds = useMemo(() => {
    let x = tin;
    if (loc === 'hdnd') x = x.filter((t) => t.hdnd);
    else if (loc !== 'tat-ca') x = x.filter((t) => t.chuyenMuc === loc);
    return timTin(x, tim);
  }, [tin, loc, tim]);
  useEffect(() => { datSoHien(MOI_TRANG); }, [loc, tim]);

  const hien = ds.slice(0, soHien);
  const theoNgay = [];
  for (const t of hien) {
    const n = nhanNgay(t.luc);
    if (!theoNgay.length || theoNgay[theoNgay.length - 1].ngay !== n) theoNgay.push({ ngay: n, tin: [] });
    theoNgay[theoNgay.length - 1].tin.push(t);
  }
  const nut = (id, ten, so) => (
    <button key={id} onClick={() => datLoc(id)}
      className={`shrink-0 px-3 py-1.5 rounded-full text-[12.5px] font-semibold border transition-colors
        ${loc === id ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'}`}>
      {ten}<span className={`ml-1.5 ${loc === id ? 'text-slate-300' : 'text-slate-400'}`}>{so}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif" }}>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          {onHome && (
            <button onClick={onHome} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[12.5px] font-semibold text-slate-700 shrink-0">
              <Home className="w-4 h-4" /> Trang chủ
            </button>
          )}
          <img src="/quoc-huy.svg" alt="" className="w-9 h-9 shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-700 truncate">Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa</p>
            <h1 className="text-[16px] sm:text-[18px] font-extrabold text-slate-900 leading-tight truncate">Tin tức Thanh Hóa</h1>
          </div>
          <button onClick={napLai} title="Lấy tin mới" className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-[12px] font-semibold text-slate-600">
            <RefreshCw className={`w-4 h-4 ${tt ? '' : 'animate-spin'}`} /> <span className="hidden sm:inline">Làm mới</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {!tt && <p className="text-[13px] text-slate-500 py-16 text-center">Đang lấy tin…</p>}

        {tt && !tin.length && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <p className="text-[15px] font-bold text-slate-800">Chưa lấy được tin</p>
            <p className="text-[13px] text-slate-500 mt-1">Máy chủ chưa đọc được kênh tin của nguồn và cũng chưa có bản dự phòng. Thử làm mới sau ít phút, hoặc đọc trực tiếp tại nguồn.</p>
            <a href={TRANG_NGUON} {...mo} className="inline-flex items-center gap-1 mt-3 text-[13px] font-bold text-red-700">Mở Báo Thanh Hóa <ArrowUpRight className="w-4 h-4" /></a>
          </div>
        )}

        {tt && tin.length > 0 && (
          <>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-1 px-1">
              {nut('tat-ca', 'Tất cả', tin.length)}
              {soHDND > 0 && nut('hdnd', 'Hoạt động HĐND · ĐBQH', soHDND)}
              {mucCo.map((m) => nut(m.ten, m.ten, m.so))}
            </div>
            <div className="flex items-center justify-between gap-3 flex-wrap mt-2 mb-5">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input value={tim} onChange={(e) => datTim(e.target.value)} placeholder="Tìm trong tiêu đề, tóm tắt…"
                  className="w-full pl-9 pr-3 py-2 text-[13px] rounded-lg border border-slate-200 bg-white focus:border-slate-500 outline-none" />
              </div>
              <p className="text-[12px] text-slate-500">
                {ds.length} tin · cập nhật {hienLuc(tt.capNhat).toLowerCase()}
                {tt.nguonDL === 'du-phong' && <span className="ml-1.5 px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">bản dự phòng</span>}
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 min-w-0">
                {!ds.length && <p className="text-[13px] text-slate-500 py-10 text-center bg-white rounded-2xl border border-slate-200">Không có tin nào khớp.</p>}
                {theoNgay.map((nhom) => (
                  <section key={nhom.ngay} className="mb-7">
                    <h2 className="text-[11.5px] font-bold uppercase tracking-[0.16em] text-slate-500 pb-2 border-b-2 border-slate-800">{nhom.ngay}</h2>
                    {nhom.tin.map((t) => (
                      <article key={t.id} className="flex gap-4 py-5 border-b border-slate-200">
                        <div className={`w-1 rounded-full shrink-0 ${t.hdnd ? 'bg-red-700' : (MAU[t.chuyenMuc] || 'bg-slate-400')}`} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1.5">
                            {t.hdnd && <NhanHDND />}<NhanMuc t={t} /><span className="text-slate-300">·</span><Luc iso={t.luc} />
                          </div>
                          <a href={t.lienKet} {...mo} className="block text-[18px] sm:text-[19px] font-extrabold text-slate-900 leading-snug hover:text-red-800">{t.tieuDe}</a>
                          {t.moTa && <p className="text-[14px] text-slate-600 leading-relaxed mt-2">{t.moTa}</p>}
                          <a href={t.lienKet} {...mo} className="inline-flex items-center gap-1 mt-2.5 text-[12.5px] font-bold text-red-700 hover:text-red-900">
                            Đọc bài gốc <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </article>
                    ))}
                  </section>
                ))}
                {ds.length > soHien && (
                  <button onClick={() => datSoHien((n) => n + MOI_TRANG)} className="w-full py-3 rounded-xl bg-white border border-slate-200 text-[13px] font-bold text-slate-700 hover:border-slate-400">
                    Xem thêm {Math.min(MOI_TRANG, ds.length - soHien)} tin
                  </button>
                )}
              </div>

              <aside className="lg:col-span-4 min-w-0 space-y-5">
                {soHDND > 0 && loc !== 'hdnd' && (
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="px-4 py-3 bg-slate-900 text-white flex items-center gap-2">
                      <Landmark className="w-4 h-4 text-amber-300" />
                      <h3 className="text-[12.5px] font-extrabold uppercase tracking-wider">Hoạt động HĐND · Đoàn ĐBQH</h3>
                    </div>
                    <ul className="divide-y divide-slate-100">
                      {tin.filter((t) => t.hdnd).slice(0, 6).map((t) => (
                        <li key={t.id}>
                          <a href={t.lienKet} {...mo} className="block px-4 py-3 hover:bg-slate-50">
                            <span className="block text-[13px] font-semibold text-slate-800 leading-snug">{t.tieuDe}</span>
                            <span className="block mt-1"><Luc iso={t.luc} /></span>
                          </a>
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => { datLoc('hdnd'); window.scrollTo({ top: 0 }); }} className="w-full px-4 py-2.5 border-t border-slate-100 text-[12.5px] font-bold text-red-700 hover:bg-slate-50">
                      Xem cả {soHDND} tin
                    </button>
                  </div>
                )}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 text-[12.5px] text-slate-600 leading-relaxed space-y-2">
                  <p className="font-bold text-slate-800 flex items-center gap-1.5"><Rss className="w-4 h-4 text-red-700" /> Về trang tin này</p>
                  <p>Tin lấy tự động từ kênh RSS công khai của <a href={TRANG_NGUON} {...mo} className="font-semibold underline">{TEN_NGUON}</a>, khoảng 10 phút một lần.</p>
                  <p>Trang <b>chỉ giữ tin trong tỉnh Thanh Hóa</b>; tin trung ương, tin thế giới của báo không đưa vào. Tin có nhãn <b>Hoạt động HĐND</b> do máy nhận theo từ khóa (HĐND, kỳ họp, cử tri, Đoàn ĐBQH…), có thể sót hoặc thừa.</p>
                  <p className="flex gap-1.5"><Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" /><span>Ở đây chỉ có tiêu đề và đoạn tóm tắt. Nội dung đầy đủ, hình ảnh thuộc về tòa soạn — bấm vào tin để đọc bài gốc.</span></p>
                </div>
              </aside>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
