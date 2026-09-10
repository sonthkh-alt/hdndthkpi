# -*- coding: utf-8 -*-
"""
LẤY TIN CHO BẢN TIN PHÁP LUẬT HẰNG NGÀY — chạy tại chỗ trên máy, KHÔNG cần khóa API.

Nguồn đều là kênh RSS công khai của cơ quan chính thống (xem NGUON bên dưới), đọc bằng
thư viện chuẩn của Python. Không gọi AI, không cần token, không đăng nhập.

Phần trong tệp này là LOGIC THUẦN + đọc mạng tách bạch:
  - `doc_rss(url)` là chỗ DUY NHẤT chạm mạng;
  - mọi hàm còn lại nhận dữ liệu vào, trả dữ liệu ra, nên kiểm thử được bằng Python
    thường (xem kiem_thu.py).
"""
from __future__ import annotations

import html
import json
import re
import unicodedata
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone

MUI_GIO_VN = timezone(timedelta(hours=7))

# Kênh RSS chính thống. Thứ tự trong danh sách = thứ tự ưu tiên khi chọn tin.
NGUON_CA_NUOC = [
    ("Xây dựng chính sách", "https://xaydungchinhsach.chinhphu.vn/rss"),
    ("Báo Chính phủ", "https://baochinhphu.vn/rss"),
]
NGUON_THANH_HOA = [
    ("Báo Thanh Hóa", "https://baothanhhoa.vn/rss/thoi-su.xml"),
    ("Báo Thanh Hóa", "https://baothanhhoa.vn/rss/phap-luat.xml"),
    ("Báo Thanh Hóa", "https://baothanhhoa.vn/rss/kinh-te.xml"),
]

TRINH_DUYET = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) BanTinPhapLuat/1.0"

# ---------------------------------------------------------------------------
#  Đọc mạng
# ---------------------------------------------------------------------------


def doc_rss(url: str, cho_giay: int = 20) -> bytes:
    """Tải một kênh RSS. Đây là chỗ DUY NHẤT trong tệp này chạm tới mạng."""
    yeu_cau = urllib.request.Request(url, headers={"User-Agent": TRINH_DUYET})
    with urllib.request.urlopen(yeu_cau, timeout=cho_giay) as phan_hoi:
        return phan_hoi.read()


# ---------------------------------------------------------------------------
#  Làm sạch và phân tích
# ---------------------------------------------------------------------------

THE_HTML = re.compile(r"<[^>]+>")
KHOANG_TRANG = re.compile(r"\s+")


def lam_sach(chuoi: str | None) -> str:
    """Bỏ thẻ HTML, giải mã thực thể, gộp khoảng trắng."""
    if not chuoi:
        return ""
    ra = html.unescape(THE_HTML.sub(" ", chuoi))
    # Bỏ tiền tố "(Chinhphu.vn) - " mà nguồn hay chèn đầu phần mô tả.
    ra = re.sub(r"^\s*\([^)]{2,30}\)\s*[-–]\s*", "", ra)
    return KHOANG_TRANG.sub(" ", ra).strip()


def _doc_ngay(chuoi: str | None) -> datetime | None:
    """Nhận nhiều kiểu ngày mà các kênh RSS Việt Nam hay dùng."""
    if not chuoi:
        return None
    chuoi = chuoi.strip()
    cac_dang = (
        "%a, %d %b %Y %H:%M:%S %z",
        "%a, %d %b %Y %H:%M:%S",
        "%Y-%m-%d %H:%M:%S",
        "%m/%d/%Y %I:%M:%S %p",
        "%d/%m/%Y %H:%M:%S",
    )
    for dang in cac_dang:
        try:
            ngay = datetime.strptime(chuoi, dang)
            return ngay if ngay.tzinfo else ngay.replace(tzinfo=MUI_GIO_VN)
        except ValueError:
            continue
    return None


def phan_tich(xml_bytes: bytes, ten_nguon: str) -> list[dict]:
    """RSS -> danh sách tin. Kênh hỏng thì trả danh sách rỗng, KHÔNG làm gãy cả lượt chạy."""
    try:
        goc = ET.fromstring(xml_bytes)
    except ET.ParseError:
        return []
    ra = []
    for muc in goc.iter("item"):
        tieu_de = lam_sach(muc.findtext("title"))
        if not tieu_de:
            continue
        ra.append(
            {
                "tieuDe": tieu_de,
                "moTa": lam_sach(muc.findtext("description")),
                "lienKet": (muc.findtext("link") or "").strip(),
                "nguon": ten_nguon,
                "luc": _doc_ngay(muc.findtext("pubDate")),
            }
        )
    return ra


# ---------------------------------------------------------------------------
#  Chọn lọc
# ---------------------------------------------------------------------------

# Từ khóa nhận biết tin pháp luật, chính sách, chỉ đạo điều hành.
TU_KHOA_PHAP_LUAT = (
    "nghị định", "thông tư", "quyết định", "nghị quyết", "luật", "pháp lệnh",
    "chỉ thị", "công điện", "kết luận", "chính sách", "quy định", "quy chế",
    "hiệu lực", "sửa đổi", "bổ sung", "ban hành", "thủ tướng", "chính phủ",
    "bộ chính trị", "quốc hội", "hđnd", "ubnd", "phê duyệt", "đề án", "chỉ đạo",
)

# Chủ đề -> (bộ từ khóa, màu nhấn, kiểu hình vẽ).
CHU_DE = (
    ("Thiên tai, ứng phó", ("bão", "áp thấp", "mưa lũ", "lũ quét", "sạt lở", "thiên tai",
                            "ứng phó", "phòng thủ dân sự", "cứu nạn", "cứu hộ", "ngập lụt"), (0xB1, 0x3A, 0x1E), "canhbao"),
    ("Tổ chức bộ máy", ("bộ máy", "tinh gọn", "sắp xếp", "công chức", "cán bộ", "biên chế",
                        "nội vụ", "đơn vị sự nghiệp"), (0xC0, 0x39, 0x2B), "toanha"),
    ("An ninh, trật tự", ("an ninh", "trật tự", "công an", "quốc phòng", "tội phạm",
                          "phòng chống", "an toàn giao thông"), (0x1F, 0x4E, 0x79), "khien"),
    ("Tài chính, ngân sách", ("thuế", "ngân sách", "tài chính", "lệ phí", "học phí", "viện phí",
                              "đầu tư", "vốn", "tín dụng", "giá cả", "giá thuốc", "đấu thầu"), (0x1E, 0x7A, 0x53), "vi"),
    ("An sinh xã hội", ("bảo hiểm", "tiền lương", "trợ cấp", "người cao tuổi", "y tế",
                        "giáo dục", "học sinh", "lao động", "an sinh"), (0x8E, 0x44, 0xAD), "nguoi"),
    ("Hạ tầng, giao thông", ("giao thông", "cao tốc", "đường bộ", "xây dựng", "quy hoạch",
                             "đất đai", "hạ tầng", "dự án", "bất động sản"), (0xB9, 0x6A, 0x0B), "duong"),
)
CHU_DE_MAC_DINH = ("Chỉ đạo, điều hành", (0x0F, 0x4C, 0x81), "toanha")

# Từ khóa xuất hiện trong TIÊU ĐỀ nặng hơn hẳn trong phần mô tả.
DIEM_TIEU_DE, DIEM_MO_TA = 3, 1


def bo_dau(chuoi: str) -> str:
    """Bỏ dấu tiếng Việt để so khớp không phụ thuộc dấu."""
    tach = unicodedata.normalize("NFD", chuoi)
    khong_dau = "".join(c for c in tach if unicodedata.category(c) != "Mn")
    return khong_dau.replace("đ", "d").replace("Đ", "D").lower()


# Chữ cái tiếng Việt thường + chữ số, dùng làm ranh giới từ.
KY_TU_TU = r"[0-9a-zà-ỹ]"


def co_tu(van_ban_thuong: str, tu: str) -> bool:
    """
    Khớp một từ khóa trong văn bản đã viết thường, GIỮ NGUYÊN DẤU.

    Hai bài học phải giữ lại:
    1. Khớp chuỗi con là sai: "quốc gia" chứa "gia" nên tin về phòng thủ dân sự từng bị
       gán chủ đề Tài chính. Vì vậy phải chặn hai đầu bằng ranh giới từ.
    2. Bỏ dấu để khớp cũng sai: tiếng Việt bỏ dấu thì "báo" và "bão" thành một, nên
       "họp báo thường kỳ" từng bị nhận là tin bão. Nguồn chính thống luôn viết đủ dấu,
       nên khớp CÓ DẤU vừa đúng hơn vừa không mất gì.
    """
    return re.search(rf"(?<!{KY_TU_TU})" + re.escape(tu.lower()) + rf"(?!{KY_TU_TU})",
                     van_ban_thuong) is not None


def nhan_chu_de(tieu_de: str, mo_ta: str = "") -> tuple[str, tuple[int, int, int], str]:
    """
    Đoán chủ đề để chọn màu nhấn và hình vẽ minh họa cho thẻ tin.

    CHẤM ĐIỂM chứ không lấy chủ đề khớp đầu tiên: tiếng Việt viết rời từng âm tiết nên
    một từ khóa lẻ rất dễ khớp nhầm (tin "Phòng thủ dân sự QUỐC GIA" từng bị gán chủ đề
    Tài chính vì âm tiết "gia" trùng từ khóa "giá"). Cho tiêu đề nặng hơn mô tả, chủ đề
    nào gom được nhiều điểm nhất thì thắng.
    """
    td, mt = tieu_de.lower(), (mo_ta or "").lower()
    tot, diem_tot = CHU_DE_MAC_DINH, 0
    for ten, tu_khoa, mau, hinh in CHU_DE:
        diem = sum(DIEM_TIEU_DE for tu in tu_khoa if co_tu(td, tu))
        diem += sum(DIEM_MO_TA for tu in tu_khoa if co_tu(mt, tu))
        if diem > diem_tot:
            tot, diem_tot = (ten, mau, hinh), diem
    return tot


def la_tin_phap_luat(tin: dict) -> bool:
    van_ban = f"{tin.get('tieuDe', '')} {tin.get('moTa', '')}".lower()
    return any(co_tu(van_ban, tu) for tu in TU_KHOA_PHAP_LUAT)


def khoa_tin(tin: dict) -> str:
    """
    Khóa chống trùng. Dùng TIÊU ĐỀ đã bỏ dấu, bỏ ký tự lạ — cùng một tin đăng lại ở
    kênh khác thường giữ nguyên tiêu đề nhưng đổi đường dẫn, nên khóa theo đường dẫn
    sẽ để lọt tin trùng.
    """
    return re.sub(r"[^a-z0-9 ]", "", bo_dau(tin.get("tieuDe", ""))).strip()[:120]


def loc_trung(ds: list[dict], da_dua: set[str]) -> list[dict]:
    """Bỏ tin đã đưa hôm trước và tin trùng nhau trong chính lượt này."""
    ra, thay = [], set()
    for tin in ds:
        k = khoa_tin(tin)
        if not k or k in da_dua or k in thay:
            continue
        thay.add(k)
        ra.append(tin)
    return ra


def sap_moi_truoc(ds: list[dict]) -> list[dict]:
    cu = datetime(1970, 1, 1, tzinfo=MUI_GIO_VN)
    return sorted(ds, key=lambda t: t.get("luc") or cu, reverse=True)


def chon_tin(ca_nuoc: list[dict], thanh_hoa: list[dict], da_dua: set[str],
             so_ca_nuoc: int = 5, so_thanh_hoa: int = 3) -> tuple[list[dict], list[dict]]:
    """Lọc trùng -> ưu tiên tin có dáng dấp pháp luật -> lấy tin mới nhất."""
    cn = loc_trung(sap_moi_truoc(ca_nuoc), da_dua)
    th = loc_trung(sap_moi_truoc(thanh_hoa), da_dua | {khoa_tin(t) for t in cn})

    uu_tien = [t for t in cn if la_tin_phap_luat(t)]
    con_lai = [t for t in cn if not la_tin_phap_luat(t)]
    chon_cn = (uu_tien + con_lai)[:so_ca_nuoc]

    th_uu_tien = [t for t in th if la_tin_phap_luat(t)]
    th_con_lai = [t for t in th if not la_tin_phap_luat(t)]
    return chon_cn, (th_uu_tien + th_con_lai)[:so_thanh_hoa]


# ---------------------------------------------------------------------------
#  Sổ "đã đưa tin"
# ---------------------------------------------------------------------------

GIU_TOI_DA = 200


def doc_so(duong_dan) -> set[str]:
    try:
        with open(duong_dan, encoding="utf-8") as f:
            d = json.load(f)
        return {str(x) for x in d.get("daDua", [])}
    except (OSError, ValueError):
        return set()


def ghi_so(duong_dan, da_dua: set[str], moi: list[dict]) -> None:
    """Ghi khóa các tin vừa đưa; giữ tối đa GIU_TOI_DA khóa gần nhất."""
    day = [k for k in (khoa_tin(t) for t in moi) if k]
    con = [k for k in da_dua if k not in set(day)]
    gop = (day + con)[:GIU_TOI_DA]
    with open(duong_dan, "w", encoding="utf-8") as f:
        json.dump({"capNhat": datetime.now(MUI_GIO_VN).isoformat(timespec="seconds"),
                   "daDua": gop}, f, ensure_ascii=False, indent=1)


# ---------------------------------------------------------------------------
#  Kho lưu trữ bản tin cũ
# ---------------------------------------------------------------------------

# Số ngày giữ lại trong kho. Mỗi ngày tốn ~230 KB (một ảnh nhẹ + chú thích), nên
# 90 ngày ≈ 21 MB — vừa đủ để tra lại một quý, vừa không làm phình kho mã.
SO_NGAY_LUU = 90


def loc_ngay_giu(ngay: list[str], hom_nay: str, so_ngay: int = SO_NGAY_LUU) -> tuple[list[str], list[str]]:
    """
    Chia danh sách ngày thành (GIỮ, BỎ). Giữ `so_ngay` ngày gần nhất tính theo LỊCH
    chứ không theo số tệp: máy tắt vài hôm thì kho vẫn phải phủ đủ khoảng thời gian đó.
    """
    moc = (datetime.strptime(hom_nay, "%Y-%m-%d") - timedelta(days=so_ngay - 1)).strftime("%Y-%m-%d")
    hop_le = sorted({d for d in ngay if re.fullmatch(r"\d{4}-\d{2}-\d{2}", str(d))}, reverse=True)
    return [d for d in hop_le if d >= moc], [d for d in hop_le if d < moc]


def lay_tat_ca() -> tuple[list[dict], list[dict], list[str]]:
    """Đọc mọi kênh. Kênh nào hỏng thì ghi vào danh sách lỗi và đi tiếp."""
    ca_nuoc, thanh_hoa, loi = [], [], []
    for danh_sach, dich in ((NGUON_CA_NUOC, ca_nuoc), (NGUON_THANH_HOA, thanh_hoa)):
        for ten, url in danh_sach:
            try:
                dich.extend(phan_tich(doc_rss(url), ten))
            except Exception as e:  # mạng hỏng, tên miền đổi, kênh ngừng...
                loi.append(f"{url}: {type(e).__name__}")
    return ca_nuoc, thanh_hoa, loi
