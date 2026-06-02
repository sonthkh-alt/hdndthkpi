import re

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacement = """        {tab === 'eval335' && (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-4 space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-100"><h2 className="font-semibold text-slate-800 flex items-center gap-2"><Users className="w-4 h-4 text-slate-400" /> Danh sách cán bộ</h2></div>
                <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">{people.map((p) => (<button key={p.id} onClick={() => setCurId(p.id)} className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${curId === p.id ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}><div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${curId === p.id ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}><User className="w-4 h-4" /></div><div><p className={`text-sm font-medium ${curId === p.id ? 'text-indigo-700' : 'text-slate-700'}`}>{p.name || '(Chưa tên)'}</p><p className="text-[11px] text-slate-400 mt-0.5">{p.position || CRITERIA[p.type].label}</p></div></button>))}</div>
                <button onClick={() => { const np = newPerson('Cán bộ mới', 'staff'); setPeople(ps => [...ps, np]); setCurId(np.id); }} className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 text-slate-500 text-sm font-medium hover:bg-slate-100 hover:text-slate-700 transition-colors border-t border-slate-100"><UserPlus className="w-4 h-4" /> Thêm cán bộ</button>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 text-center">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">Tổng điểm NĐ 335</p>
                <div className="flex justify-center items-end gap-2 text-indigo-600"><span className="text-4xl font-extrabold leading-none">{curC.total335Mgr.toFixed(1)}</span><span className="text-sm font-bold pb-1">/ 100</span></div>
                <div className="mt-4"><span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${classify(curC.total335Mgr).soft}`}>{classify(curC.total335Mgr).name}</span></div>
              </div>
            </aside>

            <div className="flex-1 space-y-6">
              <div className="space-y-6">
                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 lg:p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="font-bold text-slate-800 flex items-center gap-2"><User className="w-5 h-5 text-indigo-600" /> Thông tin người được đánh giá</h2>
                    {people.length > 1 && <button onClick={() => setPeople(ps => ps.filter(p => p.id !== cur.id))} className="text-slate-400 hover:text-rose-500 flex items-center gap-1 text-sm font-medium"><Trash2 className="w-4 h-4" /> Xóa cán bộ</button>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Họ và tên"><input value={cur.name} onChange={(e) => upCur({ name: e.target.value })} className="inp" placeholder="Ví dụ: Nguyễn Văn A" /></Field>
                    <Field label="Chức vụ / Vị trí việc làm"><input value={cur.position} onChange={(e) => upCur({ position: e.target.value })} className="inp" placeholder="Ví dụ: Chuyên viên" /></Field>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 mb-2 block">Nhóm đối tượng đánh giá</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {Object.entries(CRITERIA).map(([k, v]) => (
                        <button key={k} onClick={() => upCur({ type: k, scores335Self: {}, scores335Mgr: {} })} className={`text-left p-3 border-2 rounded-xl transition-all ${cur.type === k ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                          <p className={`text-[11px] font-bold mb-1 ${cur.type === k ? 'text-indigo-700' : 'text-slate-400'}`}>{v.mau}</p>
                          <p className={`text-sm font-semibold leading-tight ${cur.type === k ? 'text-slate-800' : 'text-slate-600'}`}>{v.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-800 to-indigo-700 text-white px-5 py-3.5 flex items-center justify-between"><h2 className="flex items-center gap-2 font-bold"><ClipboardList className="w-5 h-5 text-indigo-300" /> Nhóm I — Tiêu chí chung (Mẫu 01)</h2><div className="flex items-center gap-3 text-sm"><span className="text-slate-300">Tự: <b className="text-white">{curC.n335Part1Self.toFixed(1)}</b></span><span className="text-indigo-300 font-bold">Duyệt: {curC.n335Part1Mgr.toFixed(1)}/30</span></div></div>
                  <div className="px-4 pt-3 flex justify-end gap-2 text-[11px] font-bold text-slate-400 pr-2"><span className="w-16 text-center">TỰ ĐG</span><span className="w-16 text-center text-indigo-600">CẤP DUYỆT</span></div>
                  <div className="p-4 pt-2 space-y-4">
                    <div className="divide-y divide-slate-100">
                      {CRITERIA_335.map((it) => { 
                        const sv = cur.scores335Self?.[it.id] ?? it.maxScore; 
                        const mv = cur.scores335Mgr?.[it.id] ?? sv;
                        return (
                          <div key={it.id} className="px-4 py-3 hover:bg-slate-50/50 transition-colors">
                            <div className="flex items-start gap-3">
                              <span className="shrink-0 text-xs font-bold text-slate-400 w-7 pt-1.5">{it.id}</span>
                              <div className="flex-1 text-left text-sm text-slate-600 pt-1">
                                {it.name}
                                <p className="text-[11px] text-indigo-500 font-medium mt-1">Điểm tối đa: {it.maxScore}</p>
                              </div>
                              <div className="shrink-0 flex gap-2">
                                <input type="number" min="0" max={it.maxScore} step="0.5" value={sv} onChange={(e) => upCur({ scores335Self: { ...cur.scores335Self, [it.id]: clamp(Number(e.target.value), 0, it.maxScore) } })} className="w-16 text-center text-slate-600 bg-slate-50 border border-slate-200 rounded-lg py-1 text-sm outline-none focus:border-slate-400" />
                                <input type="number" min="0" max={it.maxScore} step="0.5" value={mv} onChange={(e) => upCur({ scores335Mgr: { ...cur.scores335Mgr, [it.id]: clamp(Number(e.target.value), 0, it.maxScore) } })} className="w-16 text-center font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg py-1 text-sm outline-none focus:border-indigo-400" />
                              </div>
                            </div>
                          </div>
                        ); 
                      })}
                    </div>
                  </div>
                </section>

                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-800 to-indigo-700 text-white px-5 py-3.5 flex items-center justify-between"><h2 className="flex items-center gap-2 font-bold"><Target className="w-5 h-5 text-indigo-300" /> Nhóm II — Kết quả thực hiện nhiệm vụ</h2><span className="text-indigo-300 font-bold text-sm">{curC.nhomII335.toFixed(2)} / 70</span></div>
                  <div className="p-4">
                    <p className="text-xs text-slate-500 mb-3 bg-indigo-50 border border-indigo-100 rounded-lg p-2.5">Thêm nhiệm vụ từ danh mục. Nếu nhiệm vụ bị trả lại yêu cầu sửa, tăng "Lỗi chất lượng" (+1 = -25%). Nếu nộp chậm, tăng "Chậm tiến độ" (+1 = -25%).</p>
                    <div className="space-y-3">
                      {cur.tasks335.map((t, i) => { 
                        return (
                          <div key={t.id} className="border rounded-xl p-3 bg-white border-slate-200 hover:border-indigo-200 transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                              <select value={t.catalogId} onChange={(e) => upTask335(t.id, { catalogId: e.target.value })} className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 font-medium outline-none focus:border-indigo-400">
                                <option value="">— Chọn công việc từ danh mục —</option>
                                {getND335Groups(cur.type).map((c) => (
                                  <option key={c.id} value={c.id}>[{c.id}] {c.name} (Hệ số: {c.maxScore})</option>
                                ))}
                              </select>
                              {cur.tasks335.length > 1 && <button onClick={() => upCur({ tasks335: cur.tasks335.filter((x) => x.id !== t.id) })} className="shrink-0 text-rose-400 hover:bg-rose-100 p-1.5 rounded-lg"><Trash2 className="w-4 h-4" /></button>}
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 bg-slate-50 p-2 rounded-lg">
                              <MiniNum label="Số lượng giao" value={t.assigned} min={1} onChange={(v) => upTask335(t.id, { assigned: v })} />
                              <MiniNum label="Số lượng HT" value={t.completed} min={0} onChange={(v) => upTask335(t.id, { completed: v })} />
                              <MiniNum label="Lỗi chất lượng" value={t.qualityIssues} min={0} onChange={(v) => upTask335(t.id, { qualityIssues: v })} />
                              <MiniNum label="Chậm tiến độ" value={t.delays} min={0} onChange={(v) => upTask335(t.id, { delays: v })} />
                            </div>
                            <div className="mt-2"><input value={t.note || ''} onChange={(e) => upTask335(t.id, { note: e.target.value })} placeholder="Ghi chú thêm..." className="w-full bg-white/60 focus:bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-indigo-400 transition-colors" /></div>
                          </div>
                        ); 
                      })}
                    </div>
                    <button onClick={() => upCur({ tasks335: [...cur.tasks335, newTask335()] })} className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-slate-300 rounded-xl text-sm font-medium text-slate-500 hover:border-indigo-400 hover:text-indigo-600"><Plus className="w-4 h-4" /> Thêm nhiệm vụ</button>
                    
                    <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                      {[
                        ['Tỷ lệ Khối lượng (a)', curC.k335.a], 
                        ['Tỷ lệ Chất lượng (b)', curC.k335.b], 
                        ['Tỷ lệ Tiến độ (c)', curC.k335.c],
                        ['Tổng TB (a+b+c)/3', curC.k335.val]
                      ].map(([l, v], idx) => (
                        <div key={l} className={`${idx === 3 ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-100 text-slate-700'} rounded-lg py-2 border`}>
                          <p className={`text-[10px] ${idx === 3 ? 'text-indigo-500' : 'text-slate-500'}`}>{l}</p>
                          <p className="font-bold">{Number(v).toFixed(1)}%</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
                
                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
                  <Field label="Ý kiến tự nhận xét của cá nhân"><textarea value={cur.selfNote} onChange={(e) => upCur({ selfNote: e.target.value })} rows={2} className="inp" /></Field>
                  <Field label="Nhận xét, kết luận của cấp có thẩm quyền"><textarea value={cur.mgrNote} onChange={(e) => upCur({ mgrNote: e.target.value })} rows={2} className="inp" /></Field>
                </section>
              </div>
            </div>
          </div>
        )}"""

start_marker = "{tab === 'eval335' && ("
end_marker = "{tab === 'digital' && ("

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + replacement + "\n\n        " + content[end_idx:]
    with open('src/App.jsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully replaced eval335 section!")
else:
    print("Could not find markers.")
