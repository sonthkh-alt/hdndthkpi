# -*- coding: utf-8 -*-
"""
Kiểm thử bộ lấy tin và vẽ ảnh — chạy: python tools/bantin/kiem_thu.py
Không chạm mạng: mọi phép kiểm dùng dữ liệu dựng sẵn.
"""
from __future__ import annotations

import sys
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import tin as T  # noqa: E402

dat = hong = 0


def ok(dieu_kien, ten, them=""):
    global dat, hong
    if dieu_kien:
        dat += 1
    else:
        hong += 1
        print(f"  x  {ten}" + (f" — {them}" if them else ""))


def m(tieu_de, mo_ta="", nguon="Nguồn", luc=None):
    return {"tieuDe": tieu_de, "moTa": mo_ta, "nguon": nguon, "lienKet": "", "luc": luc}


print("=== 1. Làm sạch nội dung RSS ===")
ok(T.lam_sach("<p>Xin  chào</p>") == "Xin chào", "bỏ thẻ HTML và gộp khoảng trắng")
ok(T.lam_sach("Ph&#237;a &amp; sau") == "Phía & sau", "giải mã thực thể HTML")
ok(T.lam_sach("(Chinhphu.vn) - Nội dung") == "Nội dung", "bỏ tiền tố '(Chinhphu.vn) -'")
ok(T.lam_sach(None) == "" and T.lam_sach("") == "", "đầu vào rỗng không gãy")

print("=== 2. Phân tích RSS ===")
XML = """<?xml version="1.0" encoding="UTF-8"?><rss><channel>
<item><title><![CDATA[Nghị định 123/2026/NĐ-CP]]></title>
<description><![CDATA[(Chinhphu.vn) - Quy định mới]]></description>
<link>https://vi.du/a</link><pubDate>9/9/2026 7:11:00 AM</pubDate></item>
<item><title></title></item></channel></rss>"""
ds = T.phan_tich(XML.encode(), "Thử")
ok(len(ds) == 1, "bỏ mục không có tiêu đề", str(len(ds)))
ok(ds[0]["tieuDe"] == "Nghị định 123/2026/NĐ-CP", "đọc đúng tiêu đề")
ok(ds[0]["moTa"] == "Quy định mới", "đọc và làm sạch mô tả")
ok(ds[0]["luc"] is not None and ds[0]["luc"].day == 9, "đọc được ngày kiểu m/d/Y h:M:S AM")
ok(T.phan_tich(b"khong phai xml", "X") == [], "XML hỏng thì trả rỗng, KHÔNG làm gãy cả lượt chạy")

print("=== 3. Nhận chủ đề — chấm điểm, không lấy khớp đầu tiên ===")
# Đây là lỗi thật đã gặp: 'quốc gia' bỏ dấu thành 'quoc gia', âm tiết 'gia' trùng từ khóa 'giá'.
ok(T.nhan_chu_de("Chủ động ứng phó áp thấp nhiệt đới, mưa lớn diện rộng",
                 "Ban Chỉ đạo Phòng thủ dân sự quốc gia chỉ đạo")[0] == "Thiên tai, ứng phó",
   "'quốc gia' KHÔNG kéo tin bão sang chủ đề Tài chính")
ok(T.nhan_chu_de("Thủ tướng: Kiểm soát chặt chẽ giá thuốc, thiết bị y tế")[0] == "Tài chính, ngân sách",
   "tin về giá thuốc vào đúng chủ đề tài chính")
ok(T.nhan_chu_de("Chính phủ chỉ đạo tinh gọn tổ chức bộ máy")[0] == "Tổ chức bộ máy", "nhận chủ đề bộ máy")
ok(T.nhan_chu_de("Số lượng thành viên Tổ bảo vệ an ninh, trật tự")[0] == "An ninh, trật tự", "nhận chủ đề an ninh")
ok(T.nhan_chu_de("Họp báo thường kỳ")[0] == "Chỉ đạo, điều hành", "không khớp gì thì về chủ đề mặc định")
ok(len(T.nhan_chu_de("x")) == 3 and len(T.nhan_chu_de("x")[1]) == 3, "trả về (tên, màu RGB, kiểu hình)")

print("=== 4. Khớp theo ranh giới từ ===")
ok(T.co_tu("quyết định mới", "quyết định"), "khớp cụm hai âm tiết")
ok(not T.co_tu("quốc gia hùng cường", "giá"), "'quốc gia' KHÔNG khớp từ khóa 'giá'")
ok(not T.co_tu("họp báo thường kỳ", "bão"), "'báo' KHÔNG khớp từ khóa 'bão' (khớp CÓ DẤU)")
ok(T.co_tu("cơn bão số 3 đổ bộ", "bão"), "vẫn khớp đúng chữ 'bão'")
ok(T.co_tu("QUỐC HỘI họp".lower(), "quốc hội"), "không phân biệt hoa thường")

print("=== 5. Chống trùng tin ===")
a = m("Nghị định 123/2026/NĐ-CP về đất đai")
b = m("Nghị định 123/2026/NĐ-CP về đất đai")   # cùng tiêu đề, khác đường dẫn
b["lienKet"] = "https://khac"
ok(T.khoa_tin(a) == T.khoa_tin(b), "cùng tiêu đề thì cùng khóa dù khác đường dẫn")
ok(len(T.loc_trung([a, b], set())) == 1, "bỏ tin trùng trong cùng một lượt")
ok(len(T.loc_trung([a], {T.khoa_tin(a)})) == 0, "bỏ tin đã đưa hôm trước")
ok(T.khoa_tin(m("")) == "", "tin không tiêu đề cho khóa rỗng")

print("=== 6. Chọn tin ===")
cu = datetime(2026, 9, 1, tzinfo=T.MUI_GIO_VN)
moi = datetime(2026, 9, 9, tzinfo=T.MUI_GIO_VN)
cn = [m("Tin thường ngày hội thao", luc=moi),
      m("Nghị định 200/2026/NĐ-CP ban hành quy định mới", luc=cu),
      m("Thông tư 15 hướng dẫn thi hành", luc=cu),
      m("Quyết định 99 phê duyệt đề án", luc=cu),
      m("Chỉ thị 07 của Thủ tướng Chính phủ", luc=cu),
      m("Công điện khẩn về phòng chống bão", luc=cu)]
chon, _ = T.chon_tin(cn, [], set(), so_ca_nuoc=5)
ok(len(chon) == 5, "lấy đúng 5 tin cả nước", str(len(chon)))
ok(chon[0]["tieuDe"].startswith("Nghị định"), "tin pháp luật được ưu tiên trước tin thường")
ok(all("hội thao" not in t["tieuDe"] for t in chon),
   "đủ 5 tin pháp luật thì tin thường bị loại hẳn khỏi bản tin")
chon_it, _ = T.chon_tin(cn[:2], [], set(), so_ca_nuoc=5)
ok(chon_it[0]["tieuDe"].startswith("Nghị định") and "hội thao" in chon_it[-1]["tieuDe"],
   "thiếu tin pháp luật thì tin thường được lấy bù, xếp sau")

# Tin Thanh Hóa trùng tin cả nước thì không lặp lại ở thẻ địa phương.
tin_chung = m("Nghị định 200/2026/NĐ-CP ban hành quy định mới", luc=cu, nguon="Báo Thanh Hóa")
_, th = T.chon_tin(cn, [tin_chung, m("Thanh Hóa thu ngân sách tăng", luc=moi)], set())
ok(all("Nghị định 200" not in t["tieuDe"] for t in th), "tin đã lên thẻ cả nước không lặp ở thẻ Thanh Hóa")

print("=== 7. Sổ đã đưa tin ===")
import tempfile  # noqa: E402

with tempfile.TemporaryDirectory() as thu_muc:
    so = Path(thu_muc) / "so.json"
    ok(T.doc_so(so) == set(), "sổ chưa có thì trả tập rỗng, không gãy")
    T.ghi_so(so, set(), [a])
    ok(T.khoa_tin(a) in T.doc_so(so), "ghi rồi đọc lại được")
    T.ghi_so(so, T.doc_so(so), [m(f"Tin số {i}") for i in range(300)])
    ok(len(T.doc_so(so)) <= T.GIU_TOI_DA, "sổ không phình quá giới hạn", str(len(T.doc_so(so))))

print("=== 7b. Kho lưu trữ bản tin cũ ===")
giu, bo = T.loc_ngay_giu(["2026-09-10", "2026-09-09", "2026-06-01"], "2026-09-10", so_ngay=3)
ok(giu == ["2026-09-10", "2026-09-09"], "giữ đúng các ngày trong khoảng", str(giu))
ok(bo == ["2026-06-01"], "bỏ ngày quá cũ", str(bo))
ok(T.loc_ngay_giu(["2026-09-09", "2026-09-09"], "2026-09-10")[0] == ["2026-09-09"], "bỏ ngày trùng")
ok(T.loc_ngay_giu(["bay", ""], "2026-09-10") == ([], []), "ngày sai định dạng bị loại, không gãy")
# Giữ theo LỊCH chứ không theo số tệp: máy tắt vài hôm thì kho vẫn phủ đủ khoảng đó.
giu2, bo2 = T.loc_ngay_giu(["2026-09-10", "2026-09-05"], "2026-09-10", so_ngay=3)
ok(giu2 == ["2026-09-10"] and bo2 == ["2026-09-05"], "cách 5 ngày thì ngoài khoảng 3 ngày", str(giu2))
ok(T.loc_ngay_giu([], "2026-09-10") == ([], []), "kho rỗng không gãy")

print("=== 8. Vẽ ảnh ===")
from poster import CAO, RONG, ve_ban_tin  # noqa: E402

anh = ve_ban_tin(
    [m(f"Tin thử số {i} về nghị định và quy định mới của Chính phủ",
       "Mô tả thử nghiệm cho thẻ tin, đủ dài để phải xuống dòng nhiều lần trong khung thẻ.",
       "Nguồn thử", moi) for i in range(1, 6)],
    [m("Thanh Hóa: tin địa phương thử nghiệm", "Mô tả ngắn.", "Báo Thanh Hóa", moi)],
    "09/09/2026",
)
ok(anh.size == (RONG, CAO), "ảnh đúng khổ 3508x2480", str(anh.size))
mau_goc = anh.getpixel((20, 20))
ok(mau_goc[0] > 200 and mau_goc[1] > 150 and mau_goc[2] < 150, "nền vàng", str(mau_goc))
# Thẻ tin nền trắng nằm ở giữa cột đầu.
ok(anh.getpixel((600, 900))[0] > 240, "thẻ tin có nền sáng")
ok(ve_ban_tin([m(f"T{i}", "", "N", moi) for i in range(5)], [], "01/01/2026").size == (RONG, CAO),
   "thiếu tin Thanh Hóa vẫn vẽ được, không gãy")

print(f"\n{'HỎNG' if hong else 'ĐẠT'}: {dat} đạt, {hong} hỏng")
sys.exit(1 if hong else 0)
