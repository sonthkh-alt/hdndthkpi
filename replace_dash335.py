import re

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacement = """        {tab === 'dash335' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-800 to-indigo-700 text-white rounded-2xl shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2"><Activity className="w-6 h-6 text-indigo-300" /> Bảng Tổng hợp Điểm Đánh giá (NĐ 335)</h2>
                <p className="text-indigo-200 mt-1 text-sm">Thống kê điểm số và xếp loại theo Nghị định 335/2025/NĐ-CP.</p>
              </div>
              <div className="flex gap-4">
                <div className="bg-white/10 rounded-xl px-6 py-3 text-center border border-white/20">
                  <p className="text-[10px] text-indigo-200 uppercase font-bold tracking-wider">Xuất sắc</p>
                  <p className="text-2xl font-extrabold text-white mt-1">{computed.filter(x => classify(x.c.total335Mgr).code === 'A').length}</p>
                </div>
                <div className="bg-white/10 rounded-xl px-6 py-3 text-center border border-white/20">
                  <p className="text-[10px] text-indigo-200 uppercase font-bold tracking-wider">Hoàn thành Tốt</p>
                  <p className="text-2xl font-extrabold text-white mt-1">{computed.filter(x => classify(x.c.total335Mgr).code === 'B').length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <tr>
                      <th className="px-5 py-4">STT</th>
                      <th className="px-5 py-4">Họ và tên cán bộ</th>
                      <th className="px-5 py-4">Chức vụ / Vị trí</th>
                      <th className="px-5 py-4 text-center">Tiêu chí chung (30đ)</th>
                      <th className="px-5 py-4 text-center">Thực hiện NV (70đ)</th>
                      <th className="px-5 py-4 text-center">Tổng điểm (100đ)</th>
                      <th className="px-5 py-4 text-center">Xếp loại</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {computed.map((x, idx) => {
                      const r = classify(x.c.total335Mgr);
                      return (
                        <tr key={x.p.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => { setCurId(x.p.id); setTab('eval335'); }}>
                          <td className="px-5 py-4 text-slate-400">{idx + 1}</td>
                          <td className="px-5 py-4 font-bold text-slate-700">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs"><User className="w-3.5 h-3.5" /></div>
                              {x.p.name || '(Chưa tên)'}
                            </div>
                          </td>
                          <td className="px-5 py-4 text-slate-600">{x.p.position || CRITERIA[x.p.type].label}</td>
                          <td className="px-5 py-4 text-center font-medium text-slate-600">{x.c.n335Part1Mgr.toFixed(1)}</td>
                          <td className="px-5 py-4 text-center font-medium text-slate-600">{x.c.nhomII335.toFixed(1)}</td>
                          <td className="px-5 py-4 text-center font-extrabold text-indigo-600 text-base">{x.c.total335Mgr.toFixed(1)}</td>
                          <td className="px-5 py-4 text-center">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-bold ${r.soft}`}>
                              <span className={`w-5 h-5 rounded-full ${r.cls} text-white flex items-center justify-center text-[10px] mr-1`}>{r.code}</span>
                              {r.name}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {computed.length === 0 && <tr><td colSpan="7" className="px-5 py-8 text-center text-slate-400">Chưa có dữ liệu.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}"""

start_marker = "{tab === 'dash335' && ("
end_marker = "{tab === 'digital' && ("

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + replacement + "\n\n        " + content[end_idx:]
    with open('src/App.jsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully replaced dash335 section!")
else:
    print("Could not find markers.")
