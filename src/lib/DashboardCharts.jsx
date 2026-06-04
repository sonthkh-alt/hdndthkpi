import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList,
  ComposedChart, Line,
} from 'recharts';

// Bộ biểu đồ dùng chung cho tab Tổng quan của cả 3 phiên bản giao diện.
// Lazy-load (recharts thành chunk riêng). Prop `dark` để hợp tông nền tối (bản Mới).

const RC = { A: '#10b981', B: '#0ea5e9', C: '#f59e0b', D: '#f43f5e' };
const RN = { A: 'Xuất sắc', B: 'Tốt', C: 'Hoàn thành', D: 'Không HT' };
const ratingCode = (t) => (t >= 90 ? 'A' : t >= 70 ? 'B' : t >= 50 ? 'C' : 'D');

export default function DashboardCharts({ dist = {}, trends = [], computed = [], dark = false }) {
  const txt = dark ? '#cbd5e1' : '#475569';
  const grid = dark ? 'rgba(255,255,255,.08)' : '#e2e8f0';
  const tip = dark
    ? { background: '#1e1b4b', border: '1px solid rgba(255,255,255,.15)', borderRadius: 10, color: '#e2e8f0' }
    : { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, color: '#0f172a' };
  const cardCls = dark
    ? 'rounded-2xl border border-white/10 bg-white/5 p-5'
    : 'rounded-2xl border border-slate-200 bg-white shadow-sm p-5';
  const titleCls = `font-bold mb-3 ${dark ? 'text-white' : 'text-slate-800'}`;

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

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Donut cơ cấu xếp loại */}
        <section className={cardCls}>
          <h3 className={titleCls}>Cơ cấu xếp loại</h3>
          {totalPeople === 0 ? <Empty dark={dark} /> : (
            <div style={{ position: 'relative', width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={donut} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92} paddingAngle={2} stroke="none" isAnimationActive={false}>
                    {donut.map((d) => <Cell key={d.key} fill={RC[d.key]} />)}
                  </Pie>
                  <Tooltip contentStyle={tip} formatter={(v, n) => [`${v} người`, n]} />
                  <Legend wrapperStyle={{ fontSize: 12, color: txt }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: '42%', left: 0, right: 0, transform: 'translateY(-50%)', textAlign: 'center', pointerEvents: 'none' }}>
                <div style={{ fontSize: 30, fontWeight: 800, color: dark ? '#fff' : '#0f172a', lineHeight: 1 }}>{totalPeople}</div>
                <div style={{ fontSize: 12, color: txt }}>cán bộ</div>
              </div>
            </div>
          )}
        </section>

        {/* Xếp hạng điểm cán bộ */}
        <section className={cardCls}>
          <h3 className={titleCls}>Xếp hạng điểm (cấp duyệt)</h3>
          {ranking.length === 0 ? <Empty dark={dark} /> : (
            <div style={{ width: '100%', height: Math.max(160, ranking.length * 26 + 20) }}>
              <ResponsiveContainer>
                <BarChart data={ranking} layout="vertical" margin={{ left: 8, right: 28, top: 4, bottom: 4 }}>
                  <CartesianGrid horizontal={false} stroke={grid} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: txt, fontSize: 11 }} stroke={grid} />
                  <YAxis type="category" dataKey="name" width={110} tick={{ fill: txt, fontSize: 11 }} stroke={grid} />
                  <Tooltip contentStyle={tip} formatter={(v) => [`${v} điểm`, 'Tổng']} cursor={{ fill: dark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.03)' }} />
                  <Bar dataKey="value" radius={[0, 5, 5, 0]} isAnimationActive={false}>
                    {ranking.map((d, i) => <Cell key={i} fill={RC[d.code]} />)}
                    <LabelList dataKey="value" position="right" style={{ fill: txt, fontSize: 11, fontWeight: 700 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
      </div>

      {/* Xu hướng theo kỳ */}
      {trendData.length > 0 && (
        <section className={cardCls}>
          <h3 className={titleCls}>Xu hướng theo kỳ (số lượng xếp loại & điểm trung bình)</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <ComposedChart data={trendData} margin={{ left: 0, right: 8, top: 8, bottom: 4 }}>
                <CartesianGrid stroke={grid} vertical={false} />
                <XAxis dataKey="name" tick={{ fill: txt, fontSize: 12 }} stroke={grid} />
                <YAxis yAxisId="l" tick={{ fill: txt, fontSize: 11 }} stroke={grid} allowDecimals={false} />
                <YAxis yAxisId="r" orientation="right" domain={[0, 100]} tick={{ fill: txt, fontSize: 11 }} stroke={grid} />
                <Tooltip contentStyle={tip} />
                <Legend wrapperStyle={{ fontSize: 12, color: txt }} />
                <Bar yAxisId="l" dataKey="A" name="Xuất sắc" stackId="s" fill={RC.A} isAnimationActive={false} />
                <Bar yAxisId="l" dataKey="B" name="Tốt" stackId="s" fill={RC.B} isAnimationActive={false} />
                <Bar yAxisId="l" dataKey="C" name="Hoàn thành" stackId="s" fill={RC.C} isAnimationActive={false} />
                <Bar yAxisId="l" dataKey="D" name="Không HT" stackId="s" fill={RC.D} radius={[4, 4, 0, 0]} isAnimationActive={false} />
                <Line yAxisId="r" type="monotone" dataKey="avg" name="Điểm TB" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 3 }} isAnimationActive={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}
    </div>
  );
}

function Empty({ dark }) {
  return <div className={`text-sm text-center py-12 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Chưa có dữ liệu để vẽ biểu đồ.</div>;
}
