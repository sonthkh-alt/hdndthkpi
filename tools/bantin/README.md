# Bản tin pháp luật hằng ngày — chạy tự động trên máy này

Mỗi sáng **07:30**, máy này tự lấy tin pháp luật từ các kênh RSS chính thống, vẽ ảnh
infographic rồi đẩy lên GitHub. Vercel triển khai lại và Trang chủ
`https://hdndthkpi.vercel.app/` hiện bản tin mới.

**Không cần khóa API, không cần token, không gọi AI.** Tin lấy từ RSS công khai, ảnh vẽ
bằng Pillow, đẩy bằng chính `git` của máy (đã đăng nhập sẵn).

## Chạy tay

```bash
python tools/bantin/chay.py          # chạy đầy đủ rồi đẩy lên GitHub
python tools/bantin/chay.py --thu    # làm mọi thứ nhưng KHÔNG đẩy (xem trước ảnh)
python tools/bantin/chay.py --ep     # ra bản tin kể cả khi tin đã đưa hôm trước
python tools/bantin/kiem_thu.py      # kiểm thử, không chạm mạng
```

## Bốn tệp

| Tệp | Việc |
|---|---|
| `tin.py` | Lấy và lọc tin. `doc_rss()` là chỗ **duy nhất** chạm mạng, phần còn lại là logic thuần nên kiểm thử được |
| `poster.py` | Vẽ ảnh 3508×2480 bằng Pillow, phông Segoe UI/Arial của Windows |
| `chay.py` | Nối cả dây: lấy tin → vẽ → ghi `public/bantin/` → commit → push |
| `kiem_thu.py` | 36 phép kiểm, không cần mạng |

Sổ chống trùng tin nằm ở `da-dua-tin.json` (giữ 200 tin gần nhất, có commit lên GitHub để
máy khác biết đã đưa tin gì). Nhật ký chạy ở `nhat-ky.log` (không commit).

## Nguồn tin

| Phạm vi | Kênh |
|---|---|
| Cả nước | `xaydungchinhsach.chinhphu.vn/rss` · `baochinhphu.vn/rss` |
| Thanh Hóa | `baothanhhoa.vn/rss/thoi-su.xml` · `phap-luat.xml` · `kinh-te.xml` |

Đổi nguồn thì sửa `NGUON_CA_NUOC` / `NGUON_THANH_HOA` trong `tin.py`.

## Hai cái bẫy của tiếng Việt đã vấp và đã chặn

Cả hai đều nằm ở khâu đoán chủ đề để chọn màu và hình minh họa:

1. **Khớp chuỗi con là sai.** "quốc **gia**" chứa "gia" nên tin *Phòng thủ dân sự quốc gia*
   từng bị gán chủ đề *Tài chính*. Nay khớp theo ranh giới từ.
2. **Bỏ dấu để khớp cũng sai.** Tiếng Việt bỏ dấu thì "báo" và "bão" thành một, nên
   *họp báo thường kỳ* từng bị nhận là tin bão. Nay khớp **có dấu** — nguồn chính thống
   luôn viết đủ dấu nên không mất gì.

Ngoài ra chủ đề được **chấm điểm** (từ khóa trong tiêu đề nặng gấp 3 lần trong mô tả) chứ
không lấy chủ đề khớp đầu tiên. `kiem_thu.py` giữ cả hai ca lỗi này làm phép kiểm hồi quy.

## Quản lý tác vụ theo lịch

```powershell
Get-ScheduledTaskInfo -TaskName "BanTinPhapLuat"        # xem lần chạy tới, kết quả lần trước
Start-ScheduledTask   -TaskName "BanTinPhapLuat"        # chạy ngay
Disable-ScheduledTask -TaskName "BanTinPhapLuat"        # tạm dừng
Enable-ScheduledTask  -TaskName "BanTinPhapLuat"        # bật lại
```

Tác vụ chạy bằng `pythonw.exe` nên **không hiện cửa sổ**; muốn biết chuyện gì đã xảy ra
thì xem `nhat-ky.log`. `LastTaskResult = 0` là chạy xong bình thường.

Đăng ký lại tác vụ (khi chuyển máy):

```powershell
$repo = "C:\Users\Admin\OneDrive\App\GoogleAnti\HDNDKPI"
$py   = "C:\Users\Admin\AppData\Local\Programs\Python\Python314\pythonw.exe"
$act = New-ScheduledTaskAction -Execute $py -Argument "`"$repo\tools\bantin\chay.py`"" -WorkingDirectory $repo
$trg = New-ScheduledTaskTrigger -Daily -At 7:30am
$set = New-ScheduledTaskSettingsSet -StartWhenAvailable -RunOnlyIfNetworkAvailable `
       -ExecutionTimeLimit (New-TimeSpan -Minutes 20) -MultipleInstances IgnoreNew `
       -DontStopIfGoingOnBatteries -AllowStartIfOnBatteries
Register-ScheduledTask -TaskName "BanTinPhapLuat" -Action $act -Trigger $trg -Settings $set -Force
```

`-StartWhenAvailable` để máy tắt lúc 07:30 thì bật lên vẫn chạy bù.

## Khi nào KHÔNG ra bản tin

- Không đọc được kênh nào (mất mạng) → dừng, **không ghi đè bản tin cũ**, thoát mã 1.
- Chưa đủ 5 tin mới so với hôm trước → không tạo bản tin, thoát mã 0 (bình thường).
- Nội dung không đổi → không tạo commit rỗng.

## Yêu cầu của máy

Python 3 + Pillow (`pip install pillow`), phông Segoe UI hoặc Arial trong
`C:\Windows\Fonts`, và `git` đã đăng nhập sẵn vào kho `sonthkh-alt/hdndthkpi`.
