import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList,
  ComposedChart, Line, Area,
} from 'recharts';
import { deptSummary } from './dash';

// Bộ biểu đồ Tổng quan dùng chung cho cả 3 phiên bản — màu & style đổi theo prop `theme`.
// theme: 'classic' (đỏ–vàng) | 'modern' (tím–xanh nebula, nền tối) | 'pro' (xanh Matrix, nền đen).

const RC = { A: '#10b981', B: '#0ea5e9', C: '#f59e0b', D: '#f43f5e' };   // màu xếp loại (ngữ nghĩa, giữ chung)
const RN = { A: 'Xuất sắc', B: 'Tốt', C: 'Hoàn thành', D: 'Không HT' };
const ratingCode = (t) => (t >= 90 ? 'A' : t >= 70 ? 'B' : t >= 50 ? 'C' : 'D');

const THEMES = {
  classic: { dark: false, accent: '#b91c1c', accent2: '#f59e0b', line: '#b91c1c', mono: false },
  modern: { dark: true, accent: '#8b5cf6', accent2: '#22d3ee', line: '#a78bfa', mono: false },
  pro: { dark: true, accent: '#10b981', accent2: '#5eead4', line: '#34d399', mono: true },
};

export default function DashboardCharts({ dist = {}, trends = [], computed = [], theme = 'classic', dark }) {
  const T = THEMES[theme] || THEMES.classic;
  const isDark = dark != null ? dark : T.dark;
  const txt = isDark ? '#cbd5e1' : '#475569';
  const grid = theme === 'pro' ? 'rgba(16,185,129,.16)' : isDark ? 'rgba(255,255,255,.08)' : '#e2e8f0';
  const tip = isDark
    ? { background: theme === 'pro' ? '#0a0a0a' : '#1e1b4b', border: `1px solid ${theme === 'pro' ? 'rgba(16,185,129,.4)' : 'rgba(255,255,255,.15)'}`, borderRadius: 10, color: '#e2e8f0' }
    : { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, color: '#0f172a' };
  const cardCls = theme === 'pro'
    ? 'rounded-2xl border border-emerald-700/40 bg-neutral-900 p-5'
    : isDark ? 'rounded-2xl border border-white/10 bg-white/5 p-5' : 'rounded-2xl border border-slate-200 bg-white shadow-sm p-5';
  const titleColor = theme === 'pro' ? 'text-emerald-300' : isDark ? 'text-white' : 'text-slate-800';
  const titleSty = T.mono ? { fontFamily: "'Consolas','Courier New',monospace" } : undefined;
  const Title = ({ children }) => <h3 className={`font-bold mb-3 ${titleColor}`} style={titleSty}>{children}</h3>;
  const note = isDark ? 'text-slate-500' : 'text-slate-400';

  const donut = ['A', 'B', 'C', 'D'].map((k) => ({ key: k, name: `${k} · ${RN[k]}`, value: dist[k] || 0 }));
  const totalPeople = donut.reduce((s, d) => s + d.value, 0);

  const ranking = (computed || [])
    .map(({ p, c }) => ({ name: p.name || '(Chưa tên)', value: Number(c.totalMgr.toFixed(1)), code: ratingCode(c.totalMgr) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 12);

  const trendData = (trends || []).map((t) => ({
    name: `T${t.month}/${String(t.year).slice(2)}`,
    A: t.dist.A, B: t.dist.B, C: t.dist.C, D: t.dist.D,
    avg: Number((t.avg || 0).toFixed(1)),
  }));

  const depts = deptSummary(computed).map((g) => ({
    name: g.dept.replace(/^(Văn phòng|Phòng|Ban)\s+/i, '').slice(0, 22),
    'Chất lượng': Number(g.qualityPct.toFixed(1)),
    'KPI': Number(g.kpiPct.toFixed(1)),
  }));

  // defs gradient dùng lại — id duy nhất theo theme để không đụng nhau giữa các bản
  const gid = (s) => `g-${theme}-${s}`;
  const Defs = () => (
    <defs>
      {['A', 'B', 'C', 'D'].map((k) => (
        <linearGradient key={k} id={gid(k)} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={RC[k]} stopOpacity={0.95} />
          <stop offset="100%" stopColor={RC[k]} stopOpacity={0.65} />
        </linearGradient>
      ))}
      <linearGradient id={gid('acc')} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={T.accent} stopOpacity={0.95} />
        <stop offset="100%" stopColor={T.accent} stopOpacity={0.6} />
      </linearGradient>
      <linearGradient id={gid('acc2')} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={T.accent2} stopOpacity={0.95} />
        <stop offset="100%" stopColor={T.accent2} stopOpacity={0.6} />
      </linearGradient>
      <linearGradient id={gid('avg')} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={T.line} stopOpacity={0.45} />
        <stop offset="100%" stopColor={T.line} stopOpacity={0.02} />
      </linearGradient>
    </defs>
  );

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Donut cơ cấu xếp loại */}
        <section className={cardCls}>
          <Title>Cơ cấu xếp loại</Title>
          {totalPeople === 0 ? <Empty c={note} /> : (
            <div style={{ position: 'relative', width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Defs />
                  <Pie data={donut} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92} paddingAngle={3} cornerRadius={6} stroke="none" isAnimationActive={false}>
                    {donut.map((d) => <Cell key={d.key} fill={`url(#${gid(d.key)})`} />)}
                  </Pie>
                  <Tooltip contentStyle={tip} formatter={(v, n) => [`${v} người`, n]} />
                  <Legend wrapperStyle={{ fontSize: 12, color: txt }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: '42%', left: 0, right: 0, transform: 'translateY(-50%)', textAlign: 'center', pointerEvents: 'none' }}>
                <div style={{ fontSize: 30, fontWeight: 800, color: isDark ? '#fff' : '#0f172a', lineHeight: 1, fontFamily: titleSty?.fontFamily }}>{totalPeople}</div>
                <div style={{ fontSize: 12, color: txt }}>cán bộ</div>
              </div>
            </div>
          )}
        </section>

        {/* Xếp hạng điểm cán bộ */}
        <section className={cardCls}>
          <Title>Xếp hạng điểm (cấp duyệt)</Title>
          {ranking.length === 0 ? <Empty c={note} /> : (
            <div style={{ width: '100%', height: Math.max(160, ranking.length * 26 + 20) }}>
              <ResponsiveContainer>
                <BarChart data={ranking} layout="vertical" margin={{ left: 8, right: 30, top: 4, bottom: 4 }}>
                  <Defs />
                  <CartesianGrid horizontal={false} stroke={grid} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: txt, fontSize: 11 }} stroke={grid} />
                  <YAxis type="category" dataKey="name" width={110} tick={{ fill: txt, fontSize: 11 }} stroke={grid} />
                  <Tooltip contentStyle={tip} formatter={(v) => [`${v} điểm`, 'Tổng']} cursor={{ fill: isDark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.03)' }} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} isAnimationActive={false}>
                    {ranking.map((d, i) => <Cell key={i} fill={`url(#${gid(d.code)})`} />)}
                    <LabelList dataKey="value" position="right" style={{ fill: txt, fontSize: 11, fontWeight: 700 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
      </div>

      {/* So sánh Chất lượng & KPI theo Phòng/Ban — tông màu theo phiên bản */}
      {depts.length > 0 && (
        <section className={cardCls}>
          <Title>So sánh Chất lượng & KPI giữa các Phòng/Ban (% đạt)</Title>
          <div style={{ width: '100%', height: Math.max(240, depts.length * 46 + 40) }}>
            <ResponsiveContainer>
              <BarChart data={depts} layout="vertical" margin={{ left: 8, right: 38, top: 4, bottom: 4 }} barGap={3}>
                <Defs />
                <CartesianGrid horizontal={false} stroke={grid} />
                <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fill: txt, fontSize: 11 }} stroke={grid} />
                <YAxis type="category" dataKey="name" width={140} tick={{ fill: txt, fontSize: 11 }} stroke={grid} />
                <Tooltip contentStyle={tip} formatter={(v, n) => [`${v}%`, n]} cursor={{ fill: isDark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.03)' }} />
                <Legend wrapperStyle={{ fontSize: 12, color: txt }} />
                <Bar dataKey="Chất lượng" name="Chất lượng (Nhóm I)" fill={`url(#${gid('acc')})`} radius={[0, 5, 5, 0]} isAnimationActive={false}>
                  <LabelList dataKey="Chất lượng" position="right" formatter={(v) => `${v}%`} style={{ fill: txt, fontSize: 10 }} />
                </Bar>
                <Bar dataKey="KPI" name="KPI (Nhóm II)" fill={`url(#${gid('acc2')})`} radius={[0, 5, 5, 0]} isAnimationActive={false}>
                  <LabelList dataKey="KPI" position="right" formatter={(v) => `${v}%`} style={{ fill: txt, fontSize: 10 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className={`text-[11px] mt-2 ${note}`}>Chất lượng = điểm Nhóm I quy về % (/30); KPI = điểm Nhóm II quy về % (/70). Cùng thang 100% để so sánh công bằng.</p>
        </section>
      )}

      {/* Xu hướng theo kỳ — vùng (area) gradient cho điểm TB + cột chồng xếp loại */}
      {trendData.length > 0 && (
        <section className={cardCls}>
          <Title>Xu hướng theo kỳ (số lượng xếp loại & điểm trung bình)</Title>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <ComposedChart data={trendData} margin={{ left: 0, right: 8, top: 8, bottom: 4 }}>
                <Defs />
                <CartesianGrid stroke={grid} vertical={false} />
                <XAxis dataKey="name" tick={{ fill: txt, fontSize: 12 }} stroke={grid} />
                <YAxis yAxisId="l" tick={{ fill: txt, fontSize: 11 }} stroke={grid} allowDecimals={false} />
                <YAxis yAxisId="r" orientation="right" domain={[0, 100]} tick={{ fill: txt, fontSize: 11 }} stroke={grid} />
                <Tooltip contentStyle={tip} />
                <Legend wrapperStyle={{ fontSize: 12, color: txt }} />
                <Bar yAxisId="l" dataKey="A" name="Xuất sắc" stackId="s" fill={`url(#${gid('A')})`} isAnimationActive={false} />
                <Bar yAxisId="l" dataKey="B" name="Tốt" stackId="s" fill={`url(#${gid('B')})`} isAnimationActive={false} />
                <Bar yAxisId="l" dataKey="C" name="Hoàn thành" stackId="s" fill={`url(#${gid('C')})`} isAnimationActive={false} />
                <Bar yAxisId="l" dataKey="D" name="Không HT" stackId="s" fill={`url(#${gid('D')})`} radius={[4, 4, 0, 0]} isAnimationActive={false} />
                <Area yAxisId="r" type="monotone" dataKey="avg" name="Điểm TB" stroke={T.line} strokeWidth={2.5} fill={`url(#${gid('avg')})`} dot={{ r: 3, fill: T.line }} isAnimationActive={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}
    </div>
  );
}

function Empty({ c }) {
  return <div className={`text-sm text-center py-12 ${c}`}>Chưa có dữ liệu để vẽ biểu đồ.</div>;
}
