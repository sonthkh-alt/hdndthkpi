import re

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update imports
content = content.replace("import { exportExcel1A, exportWordPhieu, exportTrackingExcel } from './lib/exporters';", "import { exportExcel1A, exportWordPhieu, exportWordPhieu335, exportTrackingExcel } from './lib/exporters';")

# 2. Add doWord335 function
# Find where doWord is defined
do_word_def = """  const doWord = () => {
    const r = classify(curC.totalMgr);
    exportWordPhieu({
      name: cur.name, position: cur.position, unit, month: period.month, year: period.year, typeLabel: CRITERIA[cur.type].label,
      nhomI: curC.nmgr.toFixed(2), nhomII: curC.nhomII.toFixed(2), deduction: Number(cur.deduction || 0).toFixed(2),
      kpi: curC.k.val.toFixed(1), total: curC.totalMgr.toFixed(2), cls: r.code, clsName: r.name, selfNote: cur.selfNote, mgrNote: cur.mgrNote,
    });
  };"""

new_do_word_def = do_word_def + """

  const doWord335 = () => {
    const r = classify(curC.total335Mgr);
    exportWordPhieu335({
      name: cur.name, position: cur.position, unit, month: period.month, year: period.year, typeLabel: CRITERIA[cur.type].label,
      n335Part1Self: curC.n335Part1Self.toFixed(1), n335Part1Mgr: curC.n335Part1Mgr.toFixed(1),
      nhomII335: curC.nhomII335, total335Self: curC.total335Self, total335Mgr: curC.total335Mgr,
      k335: curC.k335, cls: r.code, clsName: r.name, selfNote: cur.selfNote, mgrNote: cur.mgrNote,
    });
  };"""

content = content.replace(do_word_def, new_do_word_def)

# 3. Add Export button in eval335 sidebar
eval335_sidebar_end = """              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 text-center">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">Tổng điểm NĐ 335</p>
                <div className="flex justify-center items-end gap-2 text-indigo-600"><span className="text-4xl font-extrabold leading-none">{curC.total335Mgr.toFixed(1)}</span><span className="text-sm font-bold pb-1">/ 100</span></div>
                <div className="mt-4"><span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${classify(curC.total335Mgr).soft}`}>{classify(curC.total335Mgr).name}</span></div>
              </div>
            </aside>"""

new_eval335_sidebar_end = """              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 text-center">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">Tổng điểm NĐ 335</p>
                <div className="flex justify-center items-end gap-2 text-indigo-600"><span className="text-4xl font-extrabold leading-none">{curC.total335Mgr.toFixed(1)}</span><span className="text-sm font-bold pb-1">/ 100</span></div>
                <div className="mt-4"><span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${classify(curC.total335Mgr).soft}`}>{classify(curC.total335Mgr).name}</span></div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3 space-y-2">
                <button onClick={doWord335} className="w-full flex items-center justify-center gap-2 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold py-2.5 rounded-xl"><FileText className="w-4 h-4" /> Xuất phiếu NĐ335</button>
              </div>
            </aside>"""

content = content.replace(eval335_sidebar_end, new_eval335_sidebar_end)

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
