// ============================================================================
//  BOT ZALO OFFICIAL ACCOUNT — webhook chạy trên Vercel.
//
//  Dùng chung "bộ não" với bot Telegram (api/_lib/brain.js) và chung sổ đăng ký
//  người dùng (api/_lib/users.js). Người dùng Zalo cũng phải được Quản trị duyệt;
//  yêu cầu duyệt được gửi sang TELEGRAM cho Quản trị bấm nút.
//
//  BA ĐƯỜNG DẪN (thay <secret> bằng ZALO_WEBHOOK_SECRET):
//    GET  /api/zalo                          → xem tình trạng cấu hình
//    GET  /api/zalo?auth=<secret>            → lấy đường dẫn xin quyền OA (mở 1 lần)
//    GET  /api/zalo?setup=<secret>&code=...  → Zalo gọi lại, đổi mã lấy token
//    POST /api/zalo                          → ĐỊA CHỈ WEBHOOK khai ở developers.zalo.me
//
//  ⚠️ Zalo KHÔNG chấp nhận địa chỉ webhook có tham số truy vấn ("Đường dẫn webhook
//     không hợp lệ"), nên chuỗi bí mật KHÔNG bắt buộc ở webhook. Yêu cầu được chấp
//     nhận khi: chưa đặt ZALO_WEBHOOK_SECRET, HOẶC có ?secret= đúng, HOẶC gói tin
//     mang đúng app_id của ứng dụng mình (Zalo luôn gửi kèm app_id).
//     Chuỗi bí mật VẪN bắt buộc cho hai đường dẫn quản trị ?auth= và ?setup=.
// ============================================================================
// ⚠️ KHÔNG import gì ở đây: Zalo bấm "Kiểm tra" chỉ chờ vài giây, mà lần gọi đầu
//    Vercel phải khởi động nguội. Nạp toàn bộ bộ não + khung tiêu chí + dữ liệu nhân sự
//    lúc đó sẽ quá chậm và Zalo báo HTTP 408. Vì vậy mọi mô-đun đều nạp THEO NHU CẦU
//    (dynamic import) bên trong handler, sau khi đã biết chắc đây là tin nhắn thật.

const WELCOME = 'Xin chào! Đây là trợ lý của Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa.\n\n'
  + 'Để sử dụng, quý vị vui lòng đăng ký một lần bằng cách gửi:\n'
  + '/dangky Họ và tên - Đơn vị công tác\n\n'
  + 'Ví dụ: /dangky Nguyễn Văn A - Ban Kinh tế - Ngân sách\n\n'
  + 'Sau khi được duyệt, quý vị sẽ nhận được thông báo và có thể đặt câu hỏi.';

/** Tách "Họ và tên - Đơn vị" từ lệnh /dangky (giống bên Telegram). */
export function parseDangKy(text) {
  const body = String(text || '').replace(/^\/\S+\s*/, '').trim();
  if (!body) return null;
  const parts = body.split(/\s*[-–—|,]\s*/).filter(Boolean);
  const name = (parts.shift() || '').trim();
  return name ? { name, unit: parts.join(' - ').trim() } : null;
}

// Tiền tố dòng "giành chỗ" chống xử lý lặp + dòng nhật ký tin bị bỏ qua vì trùng.
// Tiền tố CHUNG `bot_seen_` cho cả Zalo lẫn Telegram để chỉ cần một lệnh dọn dẹp.
const CLAIM = 'bot_seen_zalo_';
const CLAIM_ALL = 'bot_seen_';
const DBG_TRUNG = 'zalo_debug_trung';

/** Có phải sự kiện "người dùng gửi tin nhắn văn bản" thật hay không. */
const isTextEvent = (ev) => !!(ev && ev.sender?.id && ev.message?.text
  && (!ev.event_name || ev.event_name === 'user_send_text'));

const selfUrl = (req) => {
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const proto = req.headers['x-forwarded-proto'] || 'https';
  return `${proto}://${host}/api/zalo`;
};

export default async function handler(req, res) {
  const secret = process.env.ZALO_WEBHOOK_SECRET || '';

  // ---- GET: cấu hình & chẩn đoán ------------------------------------------
  if (req.method === 'GET') {
    const { hasZalo, appId, buildAuthUrl, exchangeCode, accessToken } = await import('./_lib/zaloApi.js');
    if (!hasZalo()) return res.status(500).json({ ok: false, error: 'Chưa khai ZALO_APP_ID / ZALO_APP_SECRET trên Vercel.' });
    const { isOpen } = await import('./_lib/users.js');
    const { tgAdmins } = await import('./_lib/notify.js');
    const q = req.query || {};

    // Bước 1: lấy đường dẫn xin quyền (mở bằng tài khoản quản trị OA).
    // redirect_uri để TRẦN (không kèm ?setup=) vì Zalo đối chiếu với domain đã xác thực;
    // chuỗi bí mật đi kèm qua tham số `state`.
    if (q.auth) {
      if (!secret || q.auth !== secret) return res.status(403).json({ ok: false, error: 'Sai ZALO_WEBHOOK_SECRET.' });
      const redirect = selfUrl(req);
      const url = await buildAuthUrl(redirect, secret);
      return res.status(200).json({
        ok: true, moLienKetNay: url, redirectUri: redirect,
        ghiChu: 'Mở liên kết này bằng tài khoản quản trị OA, chọn OA rồi bấm Cho phép.',
        neuLoi14003: `Vào developers.zalo.me -> Xác thực domain, xác thực "${new URL(redirect).host}" và điền ô "Miền ứng dụng".`,
      });
    }

    // Bước 2: Zalo gọi lại kèm code -> đổi lấy token (chuỗi bí mật nằm ở `setup` hoặc `state`).
    if (q.setup || q.state || q.code) {
      const given = String(q.setup || q.state || '');
      if (!secret || given !== secret) return res.status(403).json({ ok: false, error: 'Sai ZALO_WEBHOOK_SECRET.' });
      if (!q.code) return res.status(400).json({ ok: false, error: 'Thiếu tham số code. Hãy mở /api/zalo?auth=<secret> trước.' });
      try {
        await exchangeCode(String(q.code));
        return res.status(200).json({ ok: true, message: 'Đã lấy và lưu token của Zalo OA. Giờ khai địa chỉ webhook ở developers.zalo.me.' });
      } catch (e) { return res.status(500).json({ ok: false, error: String(e.message || e) }); }
    }

    let token = null; let tokenError = null;
    try { token = !!(await accessToken()); } catch (e) { tokenError = String(e.message || e); }
    let tinNhanGanNhat = null; let tinTrungGanNhat = null;
    try {
      const { getRow } = await import('./_lib/store.js');
      tinNhanGanNhat = (await getRow('zalo_debug'))?.data || null;
      // Có giá trị = Zalo đã GỬI LẠI một tin và bot đã bỏ qua (đúng như mong muốn).
      tinTrungGanNhat = (await getRow(DBG_TRUNG))?.data || null;
    } catch { /* bỏ qua */ }
    return res.status(200).json({
      ok: true, appId: appId(), token, tokenError,
      tinNhanGanNhat,   // null = Zalo CHƯA gửi tin nhắn nào tới webhook này
      tinTrungGanNhat,  // khác null = đã có tin bị Zalo gửi lại và bot đã chặn trả lời lặp
      webhookUrl: selfUrl(req),   // khai NGUYÊN chuỗi này, không kèm tham số
      quanTriDuyetTren: `Telegram (${tgAdmins().length} tài khoản)`,
      moCuaDangKy: isOpen(),
      huongDan: 'Chưa có token thì mở /api/zalo?auth=<ZALO_WEBHOOK_SECRET> để xin quyền OA một lần.',
    });
  }

  if (req.method !== 'POST') return res.status(405).json({ ok: false });

  const ev = req.body || {};
  // Nút "Kiểm tra" của Zalo và các sự kiện khác (follow, gửi ảnh...) -> TRẢ 200 NGAY,
  // không nạp thêm mô-đun nào. Đây là chỗ trước đây gây HTTP 408.
  if (!isTextEvent(ev)) return res.status(200).json({ ok: true });

  // Luôn trả 200 để Zalo không gửi lại liên tục.
  try {
    const { appId, sendText } = await import('./_lib/zaloApi.js');

    // Zalo không gửi tiêu đề bí mật như Telegram và cũng không cho gắn tham số vào
    // địa chỉ webhook -> chấp nhận khi có ?secret= đúng HOẶC gói tin mang đúng app_id.
    const bySecret = secret && String(req.query?.secret || '') === secret;
    const byAppId = ev.app_id && String(ev.app_id) === appId();
    if (secret && !bySecret && !byAppId) return res.status(401).json({ ok: false });

    const from = String(ev.sender.id);
    const text = ev.message.text;

    // ---- CHỐNG TRẢ LỜI LẶP -------------------------------------------------
    // Một lượt hỏi AI mất nhiều giây, trong khi Zalo chỉ chờ 200 trong ít giây rồi GỬI LẠI
    // đúng tin đó -> nếu không chặn, bot trả lời hai lần. Chốt bằng `claimOnce` (khóa chính
    // của bảng app_state, thao tác nguyên tử) NGAY TRƯỚC khi nạp bộ não — mọi lần gửi lại
    // sau đó đều rơi vào nhánh bỏ qua. Cũng chặn luôn trường hợp OA khai trùng webhook.
    const { claimOnce, putRow, purgeClaims } = await import('./_lib/store.js');
    // Chỉ chốt khi nhận dạng được ĐÚNG sự kiện. CỐ Ý không lấy nội dung tin làm mã:
    // người dùng có quyền hỏi lại y hệt câu vừa hỏi, chặn theo nội dung là chặn nhầm.
    const maTin = String(ev.message.msg_id || (ev.timestamp ? `${from}-${ev.timestamp}` : '')).slice(0, 120);
    let lanDau = true;
    if (maTin) {
      try { lanDau = await claimOnce(`${CLAIM}${maTin}`, { at: new Date().toISOString(), from }); }
      catch { lanDau = true; }   // kho dữ liệu trục trặc thì thà trả lời hơn là im lặng
    }
    if (!lanDau) {
      try { await putRow(DBG_TRUNG, { at: new Date().toISOString(), from, maTin, text: String(text).slice(0, 120) }); } catch { /* bỏ qua */ }
      return res.status(200).json({ ok: true, boQua: 'tin trùng' });
    }

    const { userKey, getUser, register, spendQuota, describe, isOpen } = await import('./_lib/users.js');
    const { notifyNewUser } = await import('./_lib/notify.js');

    // Nhật ký chẩn đoán (xem ở GET /api/zalo, trường `tinNhanGanNhat`): ghi lại tin nhận
    // được VÀ kết quả gửi trả lời — để phân biệt "Zalo không gọi webhook" với
    // "webhook chạy nhưng Zalo từ chối cho gửi tin". Lỗi ghi không chặn luồng trả lời.
    const dbg = { at: new Date().toISOString(), from, text: String(text).slice(0, 120), event: ev.event_name || '', maTin };
    const ghi = async (patch) => { try { await putRow('zalo_debug', { ...dbg, ...patch }); } catch { /* bỏ qua */ } };
    await ghi({ ketQua: 'đang xử lý' });

    // Gửi tin và GHI LẠI kết quả (Zalo có thể từ chối vì hết cửa sổ trả lời, thiếu quyền...).
    const send = async (to, msg) => {
      let ketQua = 'đã gửi';
      try { const ten = await sendText(to, msg); ketQua = `đã gửi${ten ? ` (${ten})` : ''}`; }
      catch (e) { ketQua = `LỖI GỬI: ${String(e?.message || e).slice(0, 250)}`; }
      await ghi({ traLoi: String(msg).slice(0, 120), ketQua });
    };

    const key = userKey('zalo', from);
    const cmd = text.toLowerCase().split(/\s+/)[0];
    const u = await getUser(key);

    if (cmd === '/dangky') {
      if (u?.status === 'blocked') { await send(from, 'Yêu cầu của quý vị trước đây chưa được chấp thuận. Vui lòng liên hệ Văn phòng (0904818886).'); return res.status(200).json({ ok: true }); }
      if (!isOpen()) { await send(from, 'Trợ lý đang tạm đóng đăng ký. Vui lòng liên hệ Văn phòng (0904818886).'); return res.status(200).json({ ok: true }); }
      const info = parseDangKy(text);
      if (!info) { await send(from, 'Cú pháp: /dangky Họ và tên - Đơn vị công tác\nVí dụ: /dangky Nguyễn Văn A - Ban Kinh tế - Ngân sách'); return res.status(200).json({ ok: true }); }
      const rec = await register(key, { id: from, platform: 'zalo', name: info.name, unit: info.unit });
      if (rec.status === 'approved') await send(from, 'Quý vị đã được duyệt từ trước. Mời đặt câu hỏi.');
      else { await notifyNewUser(rec); await send(from, `Đã gửi yêu cầu tới Quản trị:\n${describe(rec)}\n\nQuý vị vui lòng chờ được duyệt, trợ lý sẽ nhắn lại ngay khi có kết quả.`); }
      return res.status(200).json({ ok: true });
    }

    if (!u) { await send(from, isOpen() ? WELCOME : 'Xin lỗi, trợ lý này hiện chỉ phục vụ một số tài khoản được chỉ định. Vui lòng liên hệ Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa (0904818886).'); return res.status(200).json({ ok: true }); }
    if (u.status === 'blocked') { await send(from, 'Xin lỗi, tài khoản của quý vị chưa được chấp thuận sử dụng trợ lý này. Vui lòng liên hệ Văn phòng Đoàn ĐBQH và HĐND tỉnh Thanh Hóa (0904818886).'); return res.status(200).json({ ok: true }); }
    if (u.status !== 'approved') { await send(from, `⏳ Yêu cầu của quý vị đang chờ Quản trị duyệt.\n${describe(u)}`); return res.status(200).json({ ok: true }); }

    // Lệnh nhanh không gọi AI nên không tính vào hạn mức ngày.
    const q = cmd.startsWith('/') ? { ok: true } : await spendQuota(key);
    if (!q.ok) { await send(from, `Quý vị đã dùng hết ${q.limit} lượt hỏi của hôm nay. Mời quay lại vào ngày mai, hoặc xem trực tiếp trên web: https://hdndthkpi.vercel.app`); return res.status(200).json({ ok: true }); }

    let answer;
    // `moc` hứng số đo thời gian của bộ não (đọc số liệu / gọi AI) để ghi vào nhật ký —
    // Zalo gửi lại khi ta trả lời chậm, nên phải BIẾT thời gian đi đâu chứ không đoán.
    const moc = {};
    const tBatDau = Date.now();
    // Người dùng Zalo KHÔNG được coi là Quản trị -> không đọc được hồ sơ nhân sự.
    try {
      const { reply } = await import('./_lib/brain.js');
      answer = await reply({ text, chatKey: `zalo:${from}`, isAdmin: false, moc });
    }
    catch (e) { answer = `Xin lỗi, tôi gặp trục trặc khi xử lý: ${String(e?.message || e).slice(0, 300)}`; }
    const giay = (ms) => Math.round((ms || 0) / 100) / 10;
    dbg.giay = { soLieu: giay(moc.msSoLieu), ai: giay(moc.msAI), tong: giay(Date.now() - tBatDau), coChuLoiDan: moc.coChu || 0 };
    await send(from, answer);
    // Dọn các dòng "giành chỗ" quá 1 ngày — làm SAU khi đã trả lời nên không kéo dài chờ đợi.
    try { await purgeClaims(CLAIM_ALL); } catch { /* bỏ qua */ }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('zalo handler:', e);
    return res.status(200).json({ ok: true });
  }
}
