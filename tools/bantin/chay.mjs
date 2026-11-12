// ============================================================================
//  BẢN DỰ PHÒNG TIN TỨC THANH HÓA — chạy tại chỗ trên máy Văn phòng.
//
//      node tools/bantin/chay.mjs           lấy tin → ghi tệp → đẩy GitHub
//      node tools/bantin/chay.mjs --thu     làm mọi thứ nhưng KHÔNG đẩy
//
//  Trang chủ lấy tin TRỰC TIẾP qua /api/tintuc. Tệp public/bantin/tin.json do
//  bộ này ghi chỉ là BẢN DỰ PHÒNG, dùng khi máy chủ không gọi được nguồn (báo
//  chặn địa chỉ nước ngoài, nguồn tạm ngừng…). Bản dự phòng TÍCH LŨY: tin mới
//  được gộp với tin của các lượt trước, giữ tối đa 10 ngày.
//
//  Không khóa API, không token, không gọi AI. Đẩy bằng `git` đã đăng nhập sẵn.
//  Mã thoát: 0 = xong hoặc không có gì đổi; 1 = lỗi thật.
// ============================================================================
import { readFileSync, writeFileSync, appendFileSync, mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { layTin } from '../../api/_lib/tinTuc.js';
import { gopTin, docTinTuc, TEN_NGUON, TRANG_NGUON } from '../../src/lib/tinTuc.js';

const THU_MUC = dirname(fileURLToPath(import.meta.url));
const KHO = resolve(THU_MUC, '..', '..');
const DICH = join(KHO, 'public', 'bantin');
const TEP = join(DICH, 'tin.json');
const TEP_GIT = 'public/bantin/tin.json';
const NHAT_KY = join(THU_MUC, 'nhat-ky.log');
const chiThu = process.argv.includes('--thu');

/** In ra màn hình VÀ ghi nhật ký — chạy theo lịch thì không có cửa sổ để xem. */
function ghi(...phan) {
  const dong = phan.join(' ');
  console.log(dong);
  try {
    appendFileSync(NHAT_KY, `${new Date().toISOString().slice(0, 19).replace('T', ' ')}  ${dong}\n`, 'utf8');
  } catch { /* không ghi được nhật ký thì thôi */ }
}
const git = (...ds) => spawnSync('git', ['-C', KHO, ...ds], { encoding: 'utf8' });

const bayGio = new Date();
const nhanNgay = new Date(bayGio.getTime() + 7 * 3600000).toISOString().slice(0, 10).split('-').reverse().join('/');
ghi(`=== TIN TỨC THANH HÓA ${nhanNgay} ===`);

const kq = await layTin({ choMs: 20000, bayGio });
for (const l of kq.loi) ghi('⚠ Kênh lỗi:', l);
ghi(`• Đọc ${kq.kenhDoc} kênh, ${kq.tho} tin thô → ${kq.tin.length} tin trong tỉnh (${kq.tin.filter((t) => t.hdnd).length} tin về HĐND).`);
if (!kq.kenhDoc) {
  ghi('✗ Không đọc được kênh nào — dừng, KHÔNG ghi đè bản dự phòng cũ.');
  process.exit(1);
}

let cu = [];
try { cu = docTinTuc(JSON.parse(readFileSync(TEP, 'utf8'))).tin; } catch { /* chưa có tệp */ }
const tin = gopTin(kq.tin, cu, { bayGio });
ghi(`• Gộp với ${cu.length} tin của bản trước → giữ ${tin.length} tin.`);
if (!tin.length) {
  ghi('• Không có tin nào trong tỉnh — giữ nguyên bản cũ.');
  process.exit(0);
}

mkdirSync(DICH, { recursive: true });
writeFileSync(TEP, JSON.stringify({
  capNhat: bayGio.toISOString(), nguon: TEN_NGUON, trangNguon: TRANG_NGUON, tin,
}, null, 1), 'utf8');
ghi(`✓ Đã ghi ${TEP_GIT}`);
for (const t of tin.filter((x) => x.hdnd).slice(0, 5)) ghi('  ★', t.tieuDe.slice(0, 90));

if (chiThu) {
  ghi('• Chế độ chạy thử — KHÔNG đẩy lên GitHub.');
  process.exit(0);
}
git('add', '--', TEP_GIT);
if (git('diff', '--cached', '--quiet', '--', TEP_GIT).status === 0) {
  ghi('• Nội dung không đổi — bỏ qua bước đẩy.');
  process.exit(0);
}
// Chỉ commit ĐÚNG tệp này: người dùng có thể đang có thay đổi khác chưa xong.
let r = git('commit', '-m', `tintuc: cập nhật tin Thanh Hóa ngày ${nhanNgay}`, '--', TEP_GIT);
if (r.status !== 0) {
  ghi('✗ Không commit được:', (r.stderr || r.stdout).trim().slice(0, 300));
  process.exit(1);
}
r = git('push', 'origin', 'main');
if (r.status !== 0) {
  ghi('✗ Không đẩy được lên GitHub:', (r.stderr || r.stdout).trim().slice(0, 300));
  ghi('  (commit đã tạo tại chỗ; chạy `git push` khi có mạng)');
  process.exit(1);
}
ghi('✓ Đã đẩy lên GitHub.');
