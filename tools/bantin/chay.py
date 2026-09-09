# -*- coding: utf-8 -*-
"""
BẢN TIN PHÁP LUẬT HẰNG NGÀY — chạy trọn gói TẠI CHỖ trên máy này.

    python tools/bantin/chay.py            # lấy tin -> vẽ ảnh -> ghi tệp -> đẩy GitHub
    python tools/bantin/chay.py --thu      # làm mọi thứ nhưng KHÔNG đẩy (xem trước)
    python tools/bantin/chay.py --ep       # đưa tin lại kể cả khi không có tin mới

KHÔNG cần khóa API, KHÔNG cần token: tin lấy từ kênh RSS công khai, ảnh vẽ bằng Pillow,
đẩy lên GitHub bằng chính `git` của máy (đã đăng nhập sẵn).

Mã thoát: 0 = xong hoặc không có tin mới (bình thường); 1 = lỗi thật.
"""
from __future__ import annotations

import argparse
import io
import json
import subprocess
import sys
from datetime import datetime
from pathlib import Path

THU_MUC = Path(__file__).resolve().parent
KHO = THU_MUC.parent.parent                    # gốc kho hdndthkpi
DICH = KHO / "public" / "bantin"
SO_DA_DUA = THU_MUC / "da-dua-tin.json"

sys.path.insert(0, str(THU_MUC))
import tin as mod_tin            # noqa: E402
from poster import ve_ban_tin    # noqa: E402

SO_TIN_CA_NUOC = 5
SO_TIN_THANH_HOA = 3
# Dưới ngưỡng này thì không đủ để lấp 5 thẻ tin -> không ra bản tin, không đẩy.
TOI_THIEU_CA_NUOC = 5


NHAT_KY = THU_MUC / "nhat-ky.log"


def ghi(*phan):
    """
    In ra màn hình VÀ ghi vào nhật ký. Khi chạy theo lịch bằng pythonw.exe thì không có
    cửa sổ dòng lệnh, mọi thứ in ra đều mất — không có nhật ký thì hôm nào hỏng cũng
    không biết vì sao.
    """
    dong = " ".join(str(x) for x in phan)
    try:
        print(dong, flush=True)
    except Exception:
        pass
    try:
        with io.open(NHAT_KY, "a", encoding="utf-8") as f:
            f.write(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}  {dong}\n")
    except OSError:
        pass


def gon_nhat_ky(so_dong_giu: int = 400) -> None:
    """Giữ nhật ký ở mức đọc được, không để phình mãi."""
    try:
        with io.open(NHAT_KY, encoding="utf-8") as f:
            dong = f.readlines()
        if len(dong) > so_dong_giu * 2:
            with io.open(NHAT_KY, "w", encoding="utf-8") as f:
                f.writelines(dong[-so_dong_giu:])
    except OSError:
        pass


def chay_git(*doi_so) -> subprocess.CompletedProcess:
    return subprocess.run(
        ["git", "-C", str(KHO), *doi_so],
        capture_output=True, text=True, encoding="utf-8", errors="replace",
    )


def day_len_github(nhan_ngay: str) -> bool:
    """Commit và đẩy 3 tệp bản tin. Trả True nếu đã đẩy."""
    duong_dan = ["public/bantin/moi-nhat.png", "public/bantin/moi-nhat.jpg",
                 "public/bantin/moi-nhat.json", "tools/bantin/da-dua-tin.json"]
    chay_git("add", *duong_dan)

    # Không có gì đổi thì thôi, không tạo commit rỗng.
    if chay_git("diff", "--cached", "--quiet", "--", *duong_dan).returncode == 0:
        ghi("• Nội dung không đổi so với lần trước — bỏ qua bước đẩy.")
        return False

    kq = chay_git("commit", "-m", f"bantin: bản tin pháp luật ngày {nhan_ngay}")
    if kq.returncode != 0:
        ghi("✗ Không commit được:", kq.stderr.strip()[:300])
        return False

    kq = chay_git("push", "origin", "main")
    if kq.returncode != 0:
        ghi("✗ Không đẩy được lên GitHub:", (kq.stderr or kq.stdout).strip()[:400])
        ghi("  (commit đã tạo tại chỗ; chạy lại lệnh `git push` khi có mạng)")
        return False
    ghi("✓ Đã đẩy lên GitHub. Vercel sẽ triển khai lại sau 1-2 phút.")
    return True


def main() -> int:
    bp = argparse.ArgumentParser(description="Bản tin pháp luật hằng ngày")
    bp.add_argument("--thu", action="store_true", help="chạy thử, không đẩy GitHub")
    bp.add_argument("--ep", action="store_true", help="ra bản tin kể cả khi tin đã đưa rồi")
    tham_so = bp.parse_args()

    gon_nhat_ky()
    bay_gio = datetime.now(mod_tin.MUI_GIO_VN)
    nhan_ngay = bay_gio.strftime("%d/%m/%Y")
    ghi(f"=== BẢN TIN PHÁP LUẬT {nhan_ngay} ===")

    # 1. Lấy tin
    ca_nuoc, thanh_hoa, loi = mod_tin.lay_tat_ca()
    for l in loi:
        ghi("⚠ Kênh lỗi:", l)
    ghi(f"• Đọc được {len(ca_nuoc)} tin cả nước, {len(thanh_hoa)} tin Thanh Hóa.")
    if not ca_nuoc:
        ghi("✗ Không đọc được kênh tin nào — dừng, KHÔNG ghi đè bản tin cũ.")
        return 1

    # 2. Lọc trùng và chọn
    da_dua = set() if tham_so.ep else mod_tin.doc_so(SO_DA_DUA)
    chon_cn, chon_th = mod_tin.chon_tin(ca_nuoc, thanh_hoa, da_dua,
                                        SO_TIN_CA_NUOC, SO_TIN_THANH_HOA)
    ghi(f"• Sau khi lọc trùng: {len(chon_cn)} tin cả nước, {len(chon_th)} tin Thanh Hóa.")
    if len(chon_cn) < TOI_THIEU_CA_NUOC:
        # Đúng nguyên tắc của tác vụ gốc: không có tin mới thì KHÔNG ra bản tin.
        ghi("• Chưa đủ tin mới so với lần trước — không tạo bản tin hôm nay.")
        ghi("  (muốn ra bản tin bằng mọi giá thì chạy lại với --ep)")
        return 0
    if not chon_th:
        ghi("⚠ Không có tin Thanh Hóa mới; thẻ Thanh Hóa sẽ lấy tin gần nhất.")
        chon_th = mod_tin.sap_moi_truoc(thanh_hoa)[:SO_TIN_THANH_HOA]

    for i, t in enumerate(chon_cn, 1):
        ghi(f"  {i}. {t['tieuDe'][:88]}")
    for t in chon_th:
        ghi(f"  TH. {t['tieuDe'][:88]}")

    # 3. Vẽ ảnh
    ghi("• Đang vẽ ảnh…")
    anh = ve_ban_tin(chon_cn, chon_th, nhan_ngay)
    DICH.mkdir(parents=True, exist_ok=True)
    anh.save(DICH / "moi-nhat.png", "PNG", optimize=True)
    # Ảnh nhẹ cho Trang chủ — ảnh gốc vài MB, mở bằng điện thoại rất tốn.
    anh.resize((1404, 992), 1).save(DICH / "moi-nhat.jpg", "JPEG", quality=82, optimize=True)

    # 4. Chú thích dạng chữ (cho trình đọc màn hình và máy tìm kiếm)
    chu_thich = {
        "ngay": bay_gio.strftime("%Y-%m-%d"),
        "tieuDe": f"Bản tin pháp luật ngày {nhan_ngay}",
        "nguon": "xaydungchinhsach.chinhphu.vn · baochinhphu.vn · baothanhhoa.vn",
        "tin": [{"tieuDe": t["tieuDe"], "nguon": t.get("nguon", "")}
                for t in (chon_cn + chon_th)][:8],
    }
    with io.open(DICH / "moi-nhat.json", "w", encoding="utf-8") as f:
        json.dump(chu_thich, f, ensure_ascii=False, indent=1)

    png_mb = (DICH / "moi-nhat.png").stat().st_size / 1e6
    jpg_kb = (DICH / "moi-nhat.jpg").stat().st_size / 1e3
    ghi(f"✓ Đã ghi ảnh: PNG {png_mb:.1f} MB · JPG {jpg_kb:.0f} KB")

    # 5. Ghi sổ đã đưa tin rồi đẩy
    mod_tin.ghi_so(SO_DA_DUA, da_dua, chon_cn + chon_th)
    if tham_so.thu:
        ghi("• Chế độ chạy thử — KHÔNG đẩy lên GitHub.")
        return 0
    day_len_github(nhan_ngay)
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as e:  # noqa: BLE001 — tác vụ nền, phải ghi rõ lỗi rồi thoát sạch
        ghi(f"✗ Lỗi: {type(e).__name__}: {e}")
        sys.exit(1)
