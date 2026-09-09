# -*- coding: utf-8 -*-
"""
VẼ ẢNH INFOGRAPHIC BẢN TIN PHÁP LUẬT — Pillow, phông chữ có sẵn của Windows.

Khổ ngang 3508x2480 (tỉ lệ A4 ngang), nền vàng, lưới 3x2 = 6 thẻ:
5 thẻ tin cả nước (nền trắng) + 1 thẻ Thanh Hóa (nền xanh navy).

Vẽ ở hệ tọa độ 1x rồi nhân lên SS lần khi đặt bút (lớp bọc `But`), xong thu nhỏ bằng
LANCZOS — cách này cho nét mượt mà không phải tính lại toàn bộ tọa độ.
"""
from __future__ import annotations

import os

from PIL import Image, ImageDraw, ImageFilter, ImageFont

RONG, CAO = 3508, 2480
SS = 2  # bội số vẽ nét mượt

NAVY = (0x14, 0x2A, 0x4F)
TRANG = (0xFF, 0xFF, 0xFF)
XAM = (0x55, 0x5F, 0x73)
XAM_NHAT = (0xE3, 0xE7, 0xEE)
DO_CO_QUAN = (0xC0, 0x1B, 0x2A)

# Phông Windows có đủ dấu tiếng Việt. Segoe UI trước, Arial dự phòng.
PHONG_THUONG = ("C:/Windows/Fonts/segoeui.ttf", "C:/Windows/Fonts/arial.ttf")
PHONG_DAM = ("C:/Windows/Fonts/segoeuib.ttf", "C:/Windows/Fonts/arialbd.ttf")


def _phong(dam: bool, co: int) -> ImageFont.FreeTypeFont:
    for duong_dan in (PHONG_DAM if dam else PHONG_THUONG):
        if os.path.exists(duong_dan):
            return ImageFont.truetype(duong_dan, co * SS)
    raise FileNotFoundError(
        "Không tìm thấy phông Segoe UI hoặc Arial trong C:/Windows/Fonts. "
        "Máy này thiếu phông hệ thống — không vẽ được chữ tiếng Việt có dấu."
    )


class But:
    """Lớp bọc ImageDraw: nhận tọa độ hệ 1x, tự nhân SS khi vẽ."""

    def __init__(self, draw: ImageDraw.ImageDraw):
        self.d = draw

    def hop(self, x, y, r, c, mau, bo=0):
        toa_do = [x * SS, y * SS, (x + r) * SS, (y + c) * SS]
        if bo:
            self.d.rounded_rectangle(toa_do, radius=bo * SS, fill=mau)
        else:
            self.d.rectangle(toa_do, fill=mau)

    def duong(self, x1, y1, x2, y2, mau, day=1):
        self.d.line([x1 * SS, y1 * SS, x2 * SS, y2 * SS], fill=mau, width=max(1, day * SS))

    def tron(self, x, y, bk, mau=None, vien=None, day=1):
        toa_do = [(x - bk) * SS, (y - bk) * SS, (x + bk) * SS, (y + bk) * SS]
        self.d.ellipse(toa_do, fill=mau, outline=vien, width=max(1, day * SS))

    def chu(self, x, y, van_ban, phong, mau):
        self.d.text((x * SS, y * SS), van_ban, font=phong, fill=mau)

    def rong_chu(self, van_ban, phong) -> float:
        return self.d.textlength(van_ban, font=phong) / SS


def xuong_dong(but: But, van_ban: str, phong, rong: float, so_dong: int) -> list[str]:
    """Ngắt dòng theo bề rộng; quá số dòng cho phép thì thêm dấu ba chấm."""
    tu = van_ban.split()
    dong, hien = [], ""
    for t in tu:
        thu = f"{hien} {t}".strip()
        if but.rong_chu(thu, phong) <= rong or not hien:
            hien = thu
        else:
            dong.append(hien)
            hien = t
            if len(dong) == so_dong:
                break
    if hien and len(dong) < so_dong:
        dong.append(hien)
    if len(dong) == so_dong and len(" ".join(dong)) < len(van_ban):
        cuoi = dong[-1]
        while cuoi and but.rong_chu(cuoi + "…", phong) > rong:
            cuoi = cuoi[:-1].rstrip()
        dong[-1] = cuoi + "…"
    return dong


def _nen() -> Image.Image:
    """Nền chuyển sắc vàng chéo + hai vệt sáng mờ, dựng ở 1x rồi phóng lên SS."""
    nho = Image.new("RGB", (RONG // 8, CAO // 8))
    px = nho.load()
    w, h = nho.size
    for y in range(h):
        for x in range(w):
            t = (x / w + y / h) / 2
            px[x, y] = (
                int(0xFF - 0x10 * t),
                int(0xE5 - 0x30 * t),
                int(0x66 - 0x28 * t),
            )
    nho = nho.filter(ImageFilter.GaussianBlur(2))
    return nho.resize((RONG * SS, CAO * SS), Image.LANCZOS)


def _hinh_ve(but: But, x0, y0, pw, ph, kieu: str, mau):
    """Hình vẽ nét đơn giản trong khung minh họa. Tỉ lệ đồng nhất theo cạnh nhỏ hơn."""
    s = min(pw / 380.0, ph / 100.0)
    cx, cy = x0 + pw / 2, y0 + ph / 2
    d = max(2, int(3 * s))

    def sc(v):
        return v * s

    if kieu == "toanha":  # trụ sở cơ quan
        but.hop(cx - sc(90), cy - sc(30), sc(180), sc(62), mau)
        for i in range(5):
            but.hop(cx - sc(72) + i * sc(32), cy - sc(18), sc(16), sc(50), TRANG)
        but.d.polygon(
            [((cx - sc(105)) * SS, (cy - sc(30)) * SS),
             ((cx + sc(105)) * SS, (cy - sc(30)) * SS),
             (cx * SS, (cy - sc(72)) * SS)],
            fill=mau,
        )
    elif kieu == "khien":  # an ninh, trật tự
        but.d.polygon(
            [(cx * SS, (cy - sc(70)) * SS),
             ((cx + sc(62)) * SS, (cy - sc(40)) * SS),
             ((cx + sc(50)) * SS, (cy + sc(48)) * SS),
             (cx * SS, (cy + sc(72)) * SS),
             ((cx - sc(50)) * SS, (cy + sc(48)) * SS),
             ((cx - sc(62)) * SS, (cy - sc(40)) * SS)],
            fill=mau,
        )
        but.duong(cx - sc(26), cy + sc(2), cx - sc(6), cy + sc(24), TRANG, d)
        but.duong(cx - sc(6), cy + sc(24), cx + sc(30), cy - sc(24), TRANG, d)
    elif kieu == "vi":  # tài chính, ngân sách
        but.hop(cx - sc(85), cy - sc(48), sc(170), sc(96), mau, bo=int(sc(14)))
        but.hop(cx + sc(20), cy - sc(14), sc(78), sc(30), TRANG, bo=int(sc(8)))
        but.tron(cx + sc(46), cy + sc(1), sc(9), mau)
    elif kieu == "nguoi":  # an sinh xã hội
        but.tron(cx, cy - sc(38), sc(24), mau)
        but.d.pieslice(
            [(cx - sc(56)) * SS, (cy - sc(16)) * SS, (cx + sc(56)) * SS, (cy + sc(96)) * SS],
            180, 360, fill=mau,
        )
    elif kieu == "duong":  # hạ tầng, giao thông
        but.d.polygon(
            [((cx - sc(96)) * SS, (cy + sc(64)) * SS),
             ((cx - sc(34)) * SS, (cy - sc(64)) * SS),
             ((cx + sc(34)) * SS, (cy - sc(64)) * SS),
             ((cx + sc(96)) * SS, (cy + sc(64)) * SS)],
            fill=mau,
        )
        for i in range(3):
            y = cy - sc(50) + i * sc(44)
            but.hop(cx - sc(5), y, sc(10), sc(22), TRANG)
    elif kieu == "canhbao":  # thiên tai, ứng phó
        but.d.polygon(
            [(cx * SS, (cy - sc(72)) * SS),
             ((cx + sc(84)) * SS, (cy + sc(60)) * SS),
             ((cx - sc(84)) * SS, (cy + sc(60)) * SS)],
            fill=mau,
        )
        but.hop(cx - sc(7), cy - sc(30), sc(14), sc(52), TRANG, bo=int(sc(6)))
        but.tron(cx, cy + sc(40), sc(9), TRANG)
    else:
        but.tron(cx, cy, sc(56), mau)


def _ghim(but: But, x, y, s, mau):
    """Ghim địa điểm cho thẻ Thanh Hóa."""
    but.tron(x, y - s * 0.35, s * 0.62, mau)
    but.d.polygon(
        [((x - s * 0.42) * SS, (y - s * 0.05) * SS),
         ((x + s * 0.42) * SS, (y - s * 0.05) * SS),
         (x * SS, (y + s * 0.72) * SS)],
        fill=mau,
    )
    but.tron(x, y - s * 0.35, s * 0.24, TRANG)


def _the_tin(but: But, x, y, w, h, so: int, tin: dict):
    from tin import nhan_chu_de  # nạp muộn để tệp này chạy độc lập được

    chu_de, mau, hinh = nhan_chu_de(tin["tieuDe"], tin.get("moTa", ""))
    but.hop(x + 4, y + 6, w, h, (0xE8, 0xC8, 0x3A), bo=26)   # bóng đổ
    but.hop(x, y, w, h, TRANG, bo=26)
    but.hop(x, y, w, 12, mau, bo=6)                          # viền nhấn trên đỉnh

    dem = 34
    # Chip số thứ tự + nhãn chủ đề
    f_chip = _phong(True, 26)
    nhan = f"TIN {so}/5"
    rc = but.rong_chu(nhan, f_chip) + 28
    but.hop(x + dem, y + 34, rc, 46, NAVY, bo=14)
    but.chu(x + dem + 14, y + 43, nhan, f_chip, TRANG)

    rcd = but.rong_chu(chu_de.upper(), f_chip) + 28
    but.hop(x + w - dem - rcd, y + 34, rcd, 46, mau, bo=14)
    but.chu(x + w - dem - rcd + 14, y + 43, chu_de.upper(), f_chip, TRANG)

    # Khung hình vẽ minh họa. Cao rộng rãi vì mô tả lấy từ RSS thường ngắn —
    # để khung nhỏ thì nửa dưới thẻ bỏ trống trông rất hụt.
    kh_y, kh_c = y + 98, 300
    nhat = tuple(int(c + (255 - c) * 0.86) for c in mau)
    but.hop(x + dem, kh_y, w - dem * 2, kh_c, nhat, bo=18)
    _hinh_ve(but, x + dem, kh_y, w - dem * 2, kh_c, hinh, mau)

    # Tiêu đề
    f_td = _phong(True, 44)
    dong = xuong_dong(but, tin["tieuDe"], f_td, w - dem * 2, 3)
    cy = kh_y + kh_c + 26
    for d in dong:
        but.chu(x + dem, cy, d, f_td, NAVY)
        cy += 56

    but.duong(x + dem, cy + 10, x + w - dem, cy + 10, XAM_NHAT, 2)

    # Mô tả
    f_mt = _phong(False, 33)
    con_lai = max(0, (y + h - 74) - (cy + 26))
    so_dong = max(1, min(9, int(con_lai // 45)))
    for d in xuong_dong(but, tin.get("moTa", ""), f_mt, w - dem * 2, so_dong):
        but.chu(x + dem, cy + 26, d, f_mt, XAM)
        cy += 45

    luc = tin.get("luc")
    chan = f"Nguồn: {tin.get('nguon', '')}"
    if luc:
        chan += f" · {luc.strftime('%d/%m')}"
    but.chu(x + dem, y + h - 52, chan, _phong(False, 26), (0x8A, 0x93, 0xA6))


def _the_thanh_hoa(but: But, x, y, w, h, ds: list[dict]):
    but.hop(x + 4, y + 6, w, h, (0xE8, 0xC8, 0x3A), bo=26)
    but.hop(x, y, w, h, NAVY, bo=26)
    but.d.rounded_rectangle(
        [x * SS, y * SS, (x + w) * SS, (y + h) * SS],
        radius=26 * SS, outline=DO_CO_QUAN, width=6 * SS,
    )
    dem = 34
    _ghim(but, x + dem + 26, y + 66, 46, (0xFF, 0xD2, 0x3F))
    but.chu(x + dem + 62, y + 40, "TỈNH THANH HÓA", _phong(True, 40), (0xFF, 0xD2, 0x3F))

    f_td = _phong(True, 33)
    f_mt = _phong(False, 27)
    cy = y + 118
    for tin in ds[:3]:
        but.tron(x + dem + 8, cy + 16, 7, (0xFF, 0xD2, 0x3F))
        for d in xuong_dong(but, tin["tieuDe"], f_td, w - dem * 2 - 30, 3):
            but.chu(x + dem + 28, cy, d, f_td, TRANG)
            cy += 42
        mo_ta = xuong_dong(but, tin.get("moTa", ""), f_mt, w - dem * 2 - 30, 2)
        for d in mo_ta:
            but.chu(x + dem + 28, cy + 4, d, f_mt, (0xC3, 0xCF, 0xE4))
            cy += 36
        cy += 26
        if cy > y + h - 120:
            break
    but.chu(x + dem, y + h - 52, "Nguồn: baothanhhoa.vn", _phong(False, 26), (0x9A, 0xAA, 0xC6))


def ve_ban_tin(ca_nuoc: list[dict], thanh_hoa: list[dict], nhan_ngay: str) -> Image.Image:
    """Dựng ảnh bản tin. Trả về ảnh khổ 3508x2480."""
    anh = _nen()
    but = But(ImageDraw.Draw(anh))

    # ---- Đầu trang ----
    but.chu(100, 78, "BẢN TIN PHÁP LUẬT", _phong(True, 128), NAVY)
    but.chu(106, 232, "Tin pháp luật, chính sách cả nước và tỉnh Thanh Hóa",
            _phong(False, 46), (0x3A, 0x46, 0x60))

    f_ngay = _phong(True, 46)
    r = but.rong_chu(nhan_ngay, f_ngay) + 72
    but.hop(RONG - 100 - r, 92, r, 92, NAVY, bo=46)
    but.chu(RONG - 100 - r + 36, 114, nhan_ngay, f_ngay, TRANG)

    # Thanh chuyển sắc dưới đầu trang
    for i in range(RONG - 200):
        t = i / (RONG - 200)
        if t < 0.5:
            k = t * 2
            mau = (int(0xE2 + (0x7B - 0xE2) * k), int(0x4B + (0x2F - 0x4B) * k), int(0x4B + (0xA8 - 0x4B) * k))
        else:
            k = (t - 0.5) * 2
            mau = (int(0x7B + (0x18 - 0x7B) * k), int(0x2F + (0x9E - 0x2F) * k), int(0xA8 + (0x8C - 0xA8) * k))
        but.d.line([(100 + i) * SS, 318 * SS, (100 + i) * SS, 330 * SS], fill=mau, width=SS)

    # ---- Lưới 3 cột x 2 hàng ----
    le, tren, duoi, khe = 100, 400, 90, 40
    cot_w = (RONG - le * 2 - khe * 2) / 3
    hang_h = (CAO - tren - duoi - khe) / 2

    for i in range(5):
        cx = le + (i % 3) * (cot_w + khe)
        cy = tren + (i // 3) * (hang_h + khe)
        _the_tin(but, cx, cy, cot_w, hang_h, i + 1, ca_nuoc[i])

    _the_thanh_hoa(but, le + 2 * (cot_w + khe), tren + hang_h + khe, cot_w, hang_h, thanh_hoa)

    return anh.resize((RONG, CAO), Image.LANCZOS)
