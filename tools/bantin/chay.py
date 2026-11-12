# -*- coding: utf-8 -*-
"""
Tác vụ Windows `BanTinPhapLuat` (07:30 hằng ngày) vẫn gọi tệp này bằng pythonw.exe.

Từ 12/11/2026 trang tin KHÔNG còn là ảnh "bản tin pháp luật" vẽ bằng Pillow nữa mà là
TIN TỨC THANH HÓA dạng chữ, và toàn bộ việc lấy, chọn tin viết bằng JavaScript để dùng
chung MỘT bộ quy tắc với máy chủ (src/lib/tinTuc.js). Tệp này chỉ còn là CẦU NỐI: gọi
`node tools/bantin/chay.mjs`, để không phải sửa lại tác vụ theo lịch trên máy.
"""
import subprocess
import sys
from pathlib import Path

THU_MUC = Path(__file__).resolve().parent
# CREATE_NO_WINDOW: chạy theo lịch thì không chớp cửa sổ đen
CO_AN = 0x08000000 if sys.platform == "win32" else 0

if __name__ == "__main__":
    try:
        kq = subprocess.run(["node", str(THU_MUC / "chay.mjs"), *sys.argv[1:]],
                            cwd=str(THU_MUC.parent.parent), creationflags=CO_AN)
        sys.exit(kq.returncode)
    except FileNotFoundError:
        with open(THU_MUC / "nhat-ky.log", "a", encoding="utf-8") as f:
            f.write("LOI: khong tim thay lenh node - can cai Node.js de lay tin.\n")
        sys.exit(1)
