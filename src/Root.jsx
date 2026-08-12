import { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import Portal from './Portal.jsx';
import { moduleByRoute, moduleByVersion } from './lib/modules';

// ============================================================================
//  BỘ ĐIỀU HƯỚNG (ROUTER) — trang chủ dạng cổng phân hệ.
//    #/            → Trang chủ (Portal): các phân hệ hiển thị dạng thẻ/biểu tượng
//    #/okr         → Đánh giá OKR/KPI cán bộ, công chức        (App, bộ tiêu chí 'sonha')
//    #/kiemdiem    → Kiểm điểm, xếp loại đảng viên             (App, bộ tiêu chí 'kiemdiem')
//    #/tieuchi     → Đánh giá tiêu chí HĐND tỉnh, xã, phường   (module riêng)
//    #/canbo       → Quản lý cán bộ (hồ sơ 2C)                 (App, tab 'hr')
//    #/hotro       → Hướng dẫn & hỗ trợ                        (App, tab 'guide')
//    #/thunghiem   → Phòng thử nghiệm bộ tiêu chí              (App, các bản classic/improved/sg)
//  Ứng dụng đánh giá (App.jsx) và module Tiêu chí HĐND đều được tải theo nhu cầu (lazy).
// ============================================================================
const App = lazy(() => import('./App.jsx'));
const TieuChiHDND = lazy(() => import('./TieuChiHDND.jsx'));
const HuongDan = lazy(() => import('./HuongDan.jsx'));

const HOME = { view: 'home' };

function parseHash() {
  const full = (window.location.hash || '').replace(/^#\/?/, '').trim();
  const [raw, qs] = full.split('?');
  if (!raw) return HOME;
  const m = moduleByRoute(raw);
  if (!m) return HOME;
  if (m.target.kind === 'tieuchi') return { view: 'tieuchi', moduleId: m.id };
  if (m.target.kind === 'huongdan') return { view: 'huongdan', moduleId: m.id };
  // ?v=<bộ tiêu chí> dùng cho phân hệ "Phòng thử nghiệm" (đổi bộ tiêu chí ngay trong ứng dụng).
  // ?login=1 mở thẳng màn Đăng nhập (bấm "Đăng nhập" ở Trang chủ).
  const params = new URLSearchParams(qs || '');
  const v = params.get('v');
  const version = (m.labVersions || []).includes(v) ? v : m.target.version;
  return {
    view: 'app', moduleId: m.id, version, tab: m.target.tab || 'dash',
    login: params.get('login') === '1',
    title: m.title, isLab: m.id === 'lab',
  };
}

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400 text-sm">Đang tải phân hệ…</div>
);

export default function Root() {
  const [state, setState] = useState(parseHash);

  useEffect(() => {
    const onHash = () => setState(parseHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Điều hướng bằng hash để người dùng lưu/chia sẻ được đường dẫn từng phân hệ.
  const goRoute = useCallback((route) => {
    window.location.hash = route ? `#/${route}` : '#/';
    setState(parseHash());
    window.scrollTo({ top: 0 });
  }, []);
  const openModule = useCallback((m, opts = {}) => {
    if (!m) return;
    const p = [];
    // Phòng thử nghiệm: mang theo bộ tiêu chí đang hiển thị (?v=...)
    if (m.labVersions && m.target?.version) p.push(`v=${m.target.version}`);
    if (opts.login) p.push('login=1');   // mở thẳng màn Đăng nhập
    goRoute(`${m.route}${p.length ? `?${p.join('&')}` : ''}`);
  }, [goRoute]);
  const goHome = useCallback(() => goRoute(''), [goRoute]);

  // Đổi bộ tiêu chí ngay trong ứng dụng đánh giá: bộ tiêu chí có phân hệ riêng
  // (OKR/KPI, Kiểm điểm) thì chuyển hẳn sang phân hệ đó; các bản đang thử nghiệm
  // (Cổ điển, Cải tiến, Singapore) mở trong phân hệ "Phòng thử nghiệm".
  const pickVersion = useCallback((v) => {
    const m = moduleByVersion(v);
    if (m && m.id !== 'lab') { goRoute(m.route); return; }
    window.location.hash = `#/thunghiem?v=${v}`;
    setState(parseHash());
  }, [goRoute]);

  if (state.view === 'home') return <Portal onOpen={openModule} />;

  return (
    <Suspense fallback={<Loading />}>
      {state.view === 'tieuchi'
        ? <TieuChiHDND onHome={goHome} />
        : state.view === 'huongdan'
          ? <HuongDan onHome={goHome} onOpenModule={goRoute} />
          : (
            // Thanh chọn bộ tiêu chí CHỈ hiện ở phân hệ "Phòng thử nghiệm" — các phân hệ
            // nghiệp vụ đã được chọn từ Trang chủ nên không cần chọn lại trong ứng dụng.
            <App key={state.moduleId} version={state.version} onHome={goHome}
              onPickVersion={state.isLab ? pickVersion : undefined}
              moduleTitle={state.title} initialTab={state.tab} initialLogin={state.login} />
          )}
    </Suspense>
  );
}
