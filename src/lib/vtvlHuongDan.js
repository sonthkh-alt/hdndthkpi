// ============================================================================
//  HƯỚNG DẪN ĐIỀN TỪNG CỘT của bộ biểu Vị trí việc làm — TRÍCH TỰ ĐỘNG từ trang
//  HD_DIEN_BIEU của tệp docs/Bo_bieu_VTVL_30000_dong_ban_sua_de_nghi_UEB_v2_20261023.xlsx
//  (bản sửa đề nghị v2 của nhóm tư vấn UEB, 23/10/2026 — CHƯA phải bản Ban ban hành).
//
//  Đây là DỮ LIỆU, không phải mã: mỗi biểu có `moTa` (dòng tiêu đề hướng dẫn) và
//  `cot[<chữ cột>]` = { noiDung, nguon, cachGhi, loai, luuY } đúng 5 cột C-G của
//  trang hướng dẫn. Khi Ban phát hành bản mới thì trích lại, KHÔNG sửa tay từng câu.
// ============================================================================
export const HD = {
  "A1": {
    "moTa": "Biểu A1 – Danh mục nhiệm vụ. Ghi từng nhiệm vụ có mã, căn cứ, kỳ và nguồn để liên kết công việc. Trách nhiệm: Đơn vị rà soát/đầu mối nghiệp vụ.",
    "cot": {
      "A": {
        "noiDung": "Mã ổn định của nhiệm vụ. Ưu tiên giữ mã nguồn/mã đã xác nhận; nhiệm vụ mới dùng mã tạm theo hướng dẫn của cơ quan tổng hợp.",
        "nguon": "NGUON_NHIEM_VU; hồ sơ theo CV 1972, 2209, 2342.",
        "cachGhi": "Không đổi mã theo thứ tự dòng. Một loại nhiệm vụ giữ một mã; phân biệt đơn vị thực hiện bằng thông tin cơ quan/nguồn.",
        "loai": "Kế thừa/nhập",
        "luuY": "Không dùng số hồ sơ hoặc số lần thực hiện làm mã nhiệm vụ mới."
      },
      "B": {
        "noiDung": "Tên đầy đủ, đúng nội dung nhiệm vụ theo văn bản có hiệu lực.",
        "nguon": "Văn bản chức năng, nhiệm vụ; NGUON_NHIEM_VU.",
        "cachGhi": "Giữ nguyên tên đã xác nhận; chỉ chỉnh khi có căn cứ mới.",
        "loai": "Kế thừa/nhập",
        "luuY": "Không ghi chung “thực hiện nhiệm vụ khác” nếu chưa làm rõ công việc thực tế."
      },
      "C": {
        "noiDung": "Tên cơ quan/đơn vị trực tiếp thực hiện nhiệm vụ.",
        "nguon": "Văn bản tổ chức; dữ liệu nguồn.",
        "cachGhi": "Ghi thống nhất tên cơ quan; không dùng riêng mã đơn vị hành chính thay tên cơ quan.",
        "loai": "Kế thừa/nhập",
        "luuY": "Ngành dọc tổng hợp theo cơ quan quản lý biên chế; tránh cộng trùng với địa phương."
      },
      "D": {
        "noiDung": "Văn bản, điều/khoản hoặc quyết định làm căn cứ giao nhiệm vụ. Đồng thời gửi các văn bản này về Ban Tổ chức Trung ương",
        "nguon": "Văn bản có hiệu lực.",
        "cachGhi": "Ghi ngắn gọn số, ký hiệu và điều/khoản nếu cần; nếu chưa đủ căn cứ thì để trống và nêu tình trạng ở cột F/G.",
        "loai": "Nhập",
        "luuY": "Không tự suy diễn căn cứ."
      },
      "E": {
        "noiDung": "Kỳ số liệu hoặc thời điểm chốt áp dụng của bản ghi.",
        "nguon": "Thông báo kỳ chốt của cơ quan có thẩm quyền.",
        "cachGhi": "Ghi thống nhất theo kỳ chung; số thực tế, ước tính, dự báo phải tách theo kỳ.",
        "loai": "Nhập",
        "luuY": "Không dùng lẫn số 9 tháng với ước cả năm mà không ghi rõ."
      },
      "F": {
        "noiDung": "Tình trạng của nhiệm vụ sau rà soát: tiếp tục thực hiện, mới tiếp nhận, đã chuyển giao hoặc không còn thực hiện.",
        "nguon": "Đối chiếu văn bản hiện hành và văn bản phân cấp/chuyển giao.",
        "cachGhi": "Chọn/ghi đúng tình trạng thực tế; nhiệm vụ chuyển giao phải làm rõ nơi giao, nơi nhận và phần việc còn lại trong hồ sơ liên quan.",
        "loai": "Nhập",
        "luuY": "Không dùng “0” để thay cho “chưa xác định/chờ xác nhận”."
      },
      "G": {
        "noiDung": "Địa chỉ truy vết dữ liệu: công văn/tệp/trang tính/ô hoặc hồ sơ xác nhận.",
        "nguon": "Hồ sơ nguồn.",
        "cachGhi": "Ghi đủ để người kiểm tra tìm lại bản ghi; có thể dùng tên tệp + trang/ô.",
        "loai": "Nhập",
        "luuY": "Bắt buộc đối với dữ liệu dùng cho tổng hợp chính thức."
      }
    }
  },
  "A2": {
    "moTa": "Biểu A2 - Công việc và sản phẩm. Phân rã nhiệm vụ thành công việc, sản phẩm gắn với VTVL. Trách nhiệm: Đơn vị chuyên môn kê khai, quản lý xác nhận.",
    "cot": {
      "A": {
        "noiDung": "Mã ổn định của từng công việc thuộc một nhiệm vụ.",
        "nguon": "Do cơ quan/đơn vị lập theo quy tắc mã chung.",
        "cachGhi": "Mỗi công việc một mã; giữ liên kết với mã nhiệm vụ ở cột B.",
        "loai": "Nhập",
        "luuY": "Không tạo mã mới cho từng lượt hồ sơ hoặc từng công đoạn nhỏ nếu không phải công việc độc lập."
      },
      "B": {
        "noiDung": "Mã nhiệm vụ gốc mà công việc phục vụ.",
        "nguon": "A1_NhiemVu.",
        "cachGhi": "Chọn/ghi đúng mã đã có ở A1.",
        "loai": "Kế thừa/liên kết",
        "luuY": "Một công việc phải truy về được nhiệm vụ gốc."
      },
      "C": {
        "noiDung": "Mã VTVL chính thực hiện/phụ trách phần việc.",
        "nguon": "C1_VTVL hoặc danh mục VTVL đã phê duyệt.",
        "cachGhi": "Ghi mã VTVL phù hợp; nếu là vị trí đề xuất thì phải ghi trạng thái đề xuất ở C1.",
        "loai": "Nhập/liên kết",
        "luuY": "Không tạo VTVL chỉ vì có thêm một công đoạn."
      },
      "D": {
        "noiDung": "Hoạt động cụ thể cần làm để hoàn thành nhiệm vụ.",
        "nguon": "Phân tích nhiệm vụ, quy trình nghiệp vụ.",
        "cachGhi": "Viết bằng động từ + đối tượng/kết quả, đủ rõ để xác định sản phẩm.",
        "loai": "Nhập",
        "luuY": "Không ghi lại nguyên tên nhiệm vụ nếu chưa phân rã."
      },
      "E": {
        "noiDung": "Kết quả có thể nhận diện, kiểm tra của công việc.",
        "nguon": "Hồ sơ, quy trình, kế hoạch công tác.",
        "cachGhi": "Ghi sản phẩm chính hoặc phần sản phẩm thuộc trách nhiệm của cơ quan.",
        "loai": "Nhập",
        "luuY": "Khi nhiều cơ quan cùng tham gia, không đếm sản phẩm cuối cùng lặp lại ở phạm vi tổng hợp."
      },
      "F": {
        "noiDung": "Đơn vị dùng để thống kê sản lượng của sản phẩm.",
        "nguon": "Quy định/định mức chuyên ngành hoặc cách đo thống nhất.",
        "cachGhi": "Ví dụ: hồ sơ, báo cáo, đề án, cuộc kiểm tra, phiên họp, ca khám...",
        "loai": "Nhập",
        "luuY": "Dùng cùng đơn vị cho công việc tương đồng để so sánh."
      },
      "G": {
        "noiDung": "Yêu cầu chất lượng/điều kiện nghiệm thu, đúng hạn, đúng thẩm quyền.",
        "nguon": "Quy định chuyên ngành, quy trình nghiệp vụ.",
        "cachGhi": "Ghi tiêu chí ngắn gọn có thể kiểm tra.",
        "loai": "Nhập khi có",
        "luuY": "Không dùng điểm đánh giá cá nhân làm hệ số biên chế."
      },
      "H": {
        "noiDung": "Nguồn xác định công việc, sản phẩm và trách nhiệm.",
        "nguon": "Văn bản/quy trình/hồ sơ công tác.",
        "cachGhi": "Ghi tên nguồn hoặc địa chỉ tệp/trang/ô.",
        "loai": "Nhập",
        "luuY": "Ưu tiên nguồn đã xác nhận."
      }
    }
  },
  "B1": {
    "moTa": "Biểu B1 - Khối lượng và thời gian. Đo sản lượng, phút/sản phẩm, giờ định kỳ; cung cấp giờ B1 cho C3. Trách nhiệm: Chỉ điền đầu vào, không nhập đè các cột công thức.",
    "cot": {
      "A": {
        "noiDung": "Mã công việc cần đo khối lượng/thời gian; chọn từ danh sách mã công việc ở A2.",
        "nguon": "A2_CongViec.",
        "cachGhi": "Chọn trong danh sách (lấy từ A2 cột A). Một công việc do nhiều VTVL làm thì ghi nhiều dòng.",
        "loai": "Chọn",
        "luuY": "Không nhập công việc chưa có trong A2."
      },
      "B": {
        "noiDung": "Mã VTVL tự tra từ A2 theo mã công việc ở cột A.",
        "nguon": "A2/C1.",
        "cachGhi": "Không nhập; sửa ở A2 nếu sai.",
        "loai": "Tự động – KHÔNG NHẬP",
        "luuY": "Công việc nhiều VTVL tham gia phải tách phần giờ của từng VTVL."
      },
      "C": {
        "noiDung": "Số lượng sản phẩm thực tế trong kỳ/năm của phần việc.",
        "nguon": "Phần mềm nghiệp vụ, sổ/hồ sơ, báo cáo đã xác nhận.",
        "cachGhi": "Ghi số thực tế; nếu là ước tính/dự báo phải thể hiện đúng kỳ và nguồn.",
        "loai": "Nhập",
        "luuY": "Không nhân cơ học kỳ ngắn lên 12 tháng khi chưa có căn cứ."
      },
      "D": {
        "noiDung": "Thời gian trung bình (phút) cho 01 sản phẩm của nhóm công việc, đo/ước lượng thực tế hoặc theo định mức.",
        "nguon": "Phiếu đo thực tế, định mức, tài liệu chuyên ngành.",
        "cachGhi": "Ghi số phút trung bình; nếu có phút chuẩn đã xác nhận ở Danh mục sản phẩm thì hệ thống ưu tiên phút chuẩn.",
        "loai": "Nhập khi có",
        "luuY": "Không lấy thời hạn giải quyết hồ sơ; không thay thời gian chuẩn đã xác nhận bằng số tự ước."
      },
      "E": {
        "noiDung": "Giờ công việc bổ trợ cho sản phẩm chưa tính trong phút/SP (báo cáo, giải trình, in ấn, ban hành, hướng dẫn triển khai...).",
        "nguon": "Lịch công tác, kế hoạch, ghi nhận thực tế.",
        "cachGhi": "Ghi tổng giờ/năm; không cộng trùng phần đã tính trong phút/SP.",
        "loai": "Nhập khi có",
        "luuY": "Mỗi phần thời gian chỉ tính một lần."
      },
      "F": {
        "noiDung": "Giờ SP = Số SP (C) × Phút/SP dùng để tính (P) ÷ 60; chỉ tính khi cột R báo ĐẠT.",
        "nguon": "Cột C và P; cột P lấy thời gian chuẩn đã xác nhận hoặc thời gian thực đo đủ căn cứ.",
        "cachGhi": "Cột tính; không nhập đè. Nếu bản Excel phát hành chưa có công thức, báo cơ quan chủ trì.",
        "loai": "Tự động – KHÔNG NHẬP",
        "luuY": "Không tự sửa kết quả tính."
      },
      "G": {
        "noiDung": "Giờ tổng = Giờ SP (F) + Giờ bổ sung (E).",
        "nguon": "Cột E và F.",
        "cachGhi": "Cột tính; không nhập đè.",
        "loai": "Tự động – KHÔNG NHẬP",
        "luuY": "Chưa trừ tác động số hóa/thuê dịch vụ ở bước này nếu dùng cách “trước thay đổi, có điều chỉnh”."
      },
      "H": {
        "noiDung": "Nguồn xác nhận số lượng sản phẩm.",
        "nguon": "Phần mềm/hồ sơ/báo cáo.",
        "cachGhi": "Ghi đủ tên nguồn, kỳ, người/bộ phận xác nhận nếu cần.",
        "loai": "Nhập",
        "luuY": "Thiếu nguồn thì trạng thái phải là chưa kiểm chứng."
      },
      "I": {
        "noiDung": "Nguồn thời gian. Bắt buộc khi chọn “Có định mức”: ghi văn bản định mức (số, ngày, điều/khoản). Khi kiểm đếm, ước lượng thực tế: ghi cách đo (khuyến khích).",
        "nguon": "Định mức, phiếu khảo sát, hồ sơ đo thời gian.",
        "cachGhi": "Ghi văn bản/phiếu khảo sát và phạm vi áp dụng.",
        "loai": "Nhập",
        "luuY": "Không dùng số thời gian không có căn cứ."
      },
      "J": {
        "noiDung": "Căn cứ của thời gian: (1) Có định mức; (2) Kiểm đếm, ước lượng thực tế.",
        "nguon": "Kết quả kiểm tra chuyên môn.",
        "cachGhi": "Chọn 1 trong 2 giá trị của danh sách.",
        "loai": "Chọn",
        "luuY": "Chọn “Có định mức” mà không ghi nguồn ở cột I thì dòng chưa được tính."
      },
      "K": {
        "noiDung": "Kỳ số liệu của sản lượng và thời gian.",
        "nguon": "Thông báo kỳ chung.",
        "cachGhi": "Ghi thống nhất, cùng cơ sở với B2/C3.",
        "loai": "Nhập",
        "luuY": "Không trộn số liệu khác kỳ trong một phép tính."
      },
      "L": {
        "noiDung": "Mã sản phẩm tương ứng trong danh mục chuẩn để tra nhóm và phút chuẩn.",
        "nguon": "DM_SAN_PHAM cột A.",
        "cachGhi": "Nhập hoặc chọn đúng mã có trong danh mục; nếu chưa có mã thì để trống và nêu nguồn đo thực tế.",
        "loai": "Nhập khi có mã",
        "luuY": "Không tự đặt mã chuẩn hoặc dùng mã chưa được xác nhận như mã hợp lệ."
      },
      "M": {
        "noiDung": "Nhóm I–VI của sản phẩm nếu áp dụng, lấy từ danh mục.",
        "nguon": "DM_SAN_PHAM cột D.",
        "cachGhi": "Đọc kết quả công thức theo mã L; không gõ, không sửa.",
        "loai": "Tự động – KHÔNG NHẬP",
        "luuY": "Không tự phân nhóm theo ngạch, bậc, tiền lương."
      },
      "N": {
        "noiDung": "Thời gian tham chiếu chuẩn của sản phẩm.",
        "nguon": "DM_SAN_PHAM cột E.",
        "cachGhi": "Đọc kết quả tra cứu; nếu danh mục chưa có chuẩn hợp lệ thì không coi số trống/0 là định mức.",
        "loai": "Tự động – KHÔNG NHẬP",
        "luuY": "Chỉ sử dụng thời gian được cơ quan có thẩm quyền xác nhận."
      },
      "O": {
        "noiDung": "Trạng thái xác nhận của thời gian chuẩn.",
        "nguon": "DM_SAN_PHAM cột G.",
        "cachGhi": "Theo dõi tình trạng trả về từ danh mục theo mã sản phẩm.",
        "loai": "Tự động – KHÔNG NHẬP",
        "luuY": "Chưa xác nhận thì không dùng kết quả làm chuẩn chính thức."
      },
      "P": {
        "noiDung": "Phút/SP đưa vào tính: ưu tiên phút chuẩn đã xác nhận ở Danh mục sản phẩm (khi không có giải trình khác chuẩn ở S); nếu không thì lấy cột D.",
        "nguon": "Mã L, thời gian D, dữ liệu chuẩn N–O.",
        "cachGhi": "Đọc số công thức chọn nguồn giờ; kiểm tra điều kiện, không nhập đè.",
        "loai": "Tự động – KHÔNG NHẬP",
        "luuY": "Không tính khi thiếu căn cứ, không đồng thời cộng cả chuẩn và thực đo."
      },
      "Q": {
        "noiDung": "Cho biết thời gian lấy từ định mức trong danh mục, văn bản định mức (cột I) hay ước lượng thực tế.",
        "nguon": "D, I, N, O, P.",
        "cachGhi": "Đọc chỉ dẫn do công thức sinh; đối chiếu với nguồn tại I và danh mục.",
        "loai": "Tự động – KHÔNG NHẬP",
        "luuY": "Không sửa kết quả để che giấu nguồn không được xác nhận."
      },
      "R": {
        "noiDung": "THIẾU MÃ VTVL / THIẾU SẢN LƯỢNG / CHƯA CHỌN TRẠNG THÁI / THIẾU NGUỒN ĐỊNH MỨC / THIẾU THỜI GIAN / ĐẠT. Chỉ dòng ĐẠT được chuyển sang C3.",
        "nguon": "Kiểm tra các trường B1 và danh mục sản phẩm.",
        "cachGhi": "Đọc, xử lý tại cột dữ liệu nguồn, không sửa nội dung cảnh báo.",
        "loai": "Tự động – KHÔNG NHẬP",
        "luuY": "Không coi ô trống hoặc chưa báo lỗi là dữ liệu đã kiểm chứng."
      },
      "S": {
        "noiDung": "Lý do sử dụng thời gian thực tế khác mức chuẩn, điều kiện áp dụng và xác nhận.",
        "nguon": "Phiếu khảo sát, khác biệt quy trình, tài liệu chuyên môn.",
        "cachGhi": "Nhập diễn giải ngắn gọn khi khác chuẩn; nêu số liệu, phạm vi, văn bản/đơn vị xác nhận.",
        "loai": "Nhập khi phát sinh",
        "luuY": "Không tự thay chuẩn hoặc đặt hệ số riêng."
      }
    }
  },
  "B2CT": {
    "moTa": "Biểu B2 chi tiết – Tác động thực tế. Phản ánh công đoạn đã thay đổi, giờ giảm và giờ việc mới có chứng cứ. Trách nhiệm: Chỉ kê khai khi thực tế đã phát sinh tác động.",
    "cot": {
      "A": {
        "noiDung": "Mã công việc chịu tác động; chọn từ A2.",
        "nguon": "A2/B1.",
        "cachGhi": "Ghi đúng mã công việc.",
        "loai": "Chọn",
        "luuY": "Tác động phải gắn với công việc đã xác định."
      },
      "B": {
        "noiDung": "VTVL chịu tác động.",
        "nguon": "A2/C1.",
        "cachGhi": "Ghi đúng mã VTVL.",
        "loai": "Liên kết",
        "luuY": "Tránh ghi tác động của vị trí khác."
      },
      "C": {
        "noiDung": "Loại thay đổi: số hóa/cải tiến quy trình; thuê dịch vụ/đặt hàng; tự chủ/xã hội hóa; hoặc công việc mới phát sinh.",
        "nguon": "Thực tế triển khai và văn bản/hợp đồng liên quan.",
        "cachGhi": "Chọn: Số hóa; Cải tiến quy trình; Thuê dịch vụ/đặt hàng; Tự chủ; Xã hội hóa; Công việc mới phát sinh.",
        "loai": "Chọn",
        "luuY": "“Có thể” số hóa/thuê dịch vụ không đồng nghĩa “đã thực hiện”."
      },
      "D": {
        "noiDung": "Phần cụ thể của công việc bị thay đổi.",
        "nguon": "Quy trình trước/sau.",
        "cachGhi": "Mô tả ngắn gọn công đoạn.",
        "loai": "Nhập",
        "luuY": "Chỉ tính phần thực tế thay đổi."
      },
      "E": {
        "noiDung": "Số sản phẩm thực tế áp dụng thay đổi trong kỳ.",
        "nguon": "Hệ thống/hợp đồng/hồ sơ xác nhận.",
        "cachGhi": "Ghi số thực tế được áp dụng.",
        "loai": "Nhập",
        "luuY": "Không dùng tổng sản phẩm nếu chỉ một phần áp dụng."
      },
      "F": {
        "noiDung": "Phút lao động trực tiếp cho 01 SP trước thay đổi.",
        "nguon": "Số đo/định mức trước thay đổi.",
        "cachGhi": "Ghi cùng phạm vi với cột G.",
        "loai": "Nhập khi dùng cách trước/sau",
        "luuY": "Không dùng thời hạn giải quyết."
      },
      "G": {
        "noiDung": "Phút lao động trực tiếp cho 01 SP sau thay đổi.",
        "nguon": "Số đo thực tế sau thay đổi.",
        "cachGhi": "Ghi cùng đơn vị/phạm vi với cột F.",
        "loai": "Nhập khi dùng cách trước/sau",
        "luuY": "Nếu B1 đã dùng phút sau thay đổi thì không trừ lại phần tiết kiệm."
      },
      "H": {
        "noiDung": "Số giờ lao động giảm của công đoạn theo khối lượng thực tế áp dụng.",
        "nguon": "Cột E, F, G.",
        "cachGhi": "Theo logic: SP áp dụng × (Phút trước − Phút sau) ÷ 60; chỉ dùng khi dữ liệu đủ căn cứ.",
        "loai": "Tự động dự kiến/kiểm tra",
        "luuY": "Không cho kết quả âm; không giảm hai lần."
      },
      "I": {
        "noiDung": "Giờ công việc mới phát sinh do thay đổi: quản trị dữ liệu, vận hành, bảo mật, giám sát/nghiệm thu dịch vụ...",
        "nguon": "Hồ sơ thực tế, đo thời gian.",
        "cachGhi": "Ghi tổng giờ mới chưa nằm trong B1.",
        "loai": "Nhập khi có",
        "luuY": "Không cộng trùng giờ định kỳ B1."
      },
      "J": {
        "noiDung": "Nguồn chứng minh tác động đã xảy ra.",
        "nguon": "Quyết định, hợp đồng, nghiệm thu, log hệ thống, khảo sát thời gian.",
        "cachGhi": "Ghi đủ để truy vết.",
        "loai": "Nhập",
        "luuY": "Thiếu nguồn thì không đưa vào tác động đã kiểm chứng."
      },
      "K": {
        "noiDung": "Kỳ phát sinh/đo tác động.",
        "nguon": "Thông báo kỳ chung.",
        "cachGhi": "Ghi thống nhất với B1.",
        "loai": "Nhập",
        "luuY": "Không trộn khác kỳ."
      },
      "L": {
        "noiDung": "Cho biết B1 đang dùng số trước thay đổi có điều chỉnh hay số đã đo sau thay đổi.",
        "nguon": "Cách lập B1.",
        "cachGhi": "Chọn: “Trước thay đổi, có điều chỉnh” (giờ giảm sẽ được trừ) hoặc “Đã đo sau thay đổi (không trừ)”.",
        "loai": "Chọn",
        "luuY": "Đây là trường bắt buộc khi có tác động."
      },
      "M": {
        "noiDung": "Tình trạng của dòng tác động: Đã kiểm chứng / Chưa kiểm chứng / Ước lượng tham khảo.",
        "nguon": "Kết quả xác nhận chuyên môn.",
        "cachGhi": "Số ước lượng chưa có cơ sở chọn “Ước lượng tham khảo”: chỉ dùng tham khảo xu hướng, không vào phép tính.",
        "loai": "Chọn",
        "luuY": "Chỉ dòng đủ nguồn, kỳ, phạm vi mới được tính hợp lệ."
      },
      "N": {
        "noiDung": "Phần giờ giảm được chấp nhận sau kiểm tra nguồn/trạng thái và loại trùng.",
        "nguon": "Cột H, L, M và kiểm tra.",
        "cachGhi": "Cột tính/tổng hợp; không nhập đè.",
        "loai": "Tự động dự kiến",
        "luuY": "Có thể thấp hơn giờ giảm trực tiếp nếu chưa đủ điều kiện."
      },
      "O": {
        "noiDung": "Phần giờ việc mới được chấp nhận sau kiểm tra.",
        "nguon": "Cột I, M và nguồn.",
        "cachGhi": "Cột tính/tổng hợp; không nhập đè.",
        "loai": "Tự động dự kiến",
        "luuY": "Chỉ tính giờ mới chưa nằm trong B1."
      },
      "P": {
        "noiDung": "Thông báo lỗi/cảnh báo về dòng tác động.",
        "nguon": "Logic kiểm tra của bộ biểu Excel.",
        "cachGhi": "Không nhập tay; xử lý lỗi tại các cột nguồn.",
        "loai": "Tự động dự kiến",
        "luuY": "Hiện cần cơ quan chủ trì kiểm thử đầy đủ trước phát hành."
      },
      "Q": {
        "noiDung": "Nguồn/kinh phí trước thay đổi nếu cần theo dõi tự chủ, xã hội hóa.",
        "nguon": "Tài chính/kế toán, quyết định giao dự toán.",
        "cachGhi": "Ghi giá trị/nguồn theo quy định của cơ quan chủ trì.",
        "loai": "Nhập khi có",
        "luuY": "Không quy đổi trực tiếp tiền thành giờ lao động."
      },
      "R": {
        "noiDung": "Nguồn/kinh phí sau thay đổi.",
        "nguon": "Tài chính/kế toán, hợp đồng/quyết định.",
        "cachGhi": "Ghi cùng đơn vị với cột Q.",
        "loai": "Nhập khi có",
        "luuY": "Đổi nguồn chi không mặc nhiên làm giảm nhu cầu nhân lực."
      },
      "S": {
        "noiDung": "Xác nhận đã kiểm tra để loại trừ tác động trùng theo mã công việc, loại tác động, công đoạn và kỳ.",
        "nguon": "Công đoạn, hồ sơ, kết quả kiểm tra.",
        "cachGhi": "Chọn “Đã đối chiếu” chỉ sau khi đã kiểm tra; nếu chưa xong ghi “Chờ đối chiếu”.",
        "loai": "Nhập/xác nhận",
        "luuY": "Chỉ dòng đủ căn cứ, đã đối chiếu và cột P báo “ĐẠT” mới được cộng vào B2."
      }
    }
  },
  "B2": {
    "moTa": "Biểu B2 tổng hợp – Thay đổi công việc. Tổng hợp giờ giảm/tăng từ B2 chi tiết theo mã, kỳ; chuyển tác động ròng sang C3. Trách nhiệm: Chỉ đọc kết quả tính; không nhập trực tiếp.",
    "cot": {
      "A": {
        "noiDung": "Mã công việc được tổng hợp.",
        "nguon": "B2_CT_TacDong.",
        "cachGhi": "Không nhập tay; lấy theo các dòng chi tiết hợp lệ.",
        "loai": "Tự động dự kiến",
        "luuY": "Nếu phát sinh mã không có A2/B1 phải báo lỗi."
      },
      "B": {
        "noiDung": "VTVL tương ứng.",
        "nguon": "B2_CT_TacDong/C1.",
        "cachGhi": "Không nhập tay.",
        "loai": "Tự động dự kiến",
        "luuY": "Phải khớp với công việc."
      },
      "C": {
        "noiDung": "Tổng giờ giảm hợp lệ do số hóa/cải tiến quy trình.",
        "nguon": "B2_CT_TacDong.",
        "cachGhi": "Tổng hợp các dòng đã kiểm chứng và đã đối chiếu trùng (B2_CT cột P = ĐẠT).",
        "loai": "Tự động dự kiến",
        "luuY": "Không bao gồm phần đã phản ánh trong số đo sau thay đổi."
      },
      "D": {
        "noiDung": "Tổng giờ giảm hợp lệ do thuê dịch vụ, tự chủ, xã hội hóa.",
        "nguon": "B2_CT_TacDong.",
        "cachGhi": "Tổng hợp theo loại tác động hợp lệ.",
        "loai": "Tự động dự kiến",
        "luuY": "Chỉ tính phần đã chuyển giao thực tế, hợp pháp."
      },
      "E": {
        "noiDung": "Tổng giờ công việc mới hợp lệ.",
        "nguon": "B2_CT_TacDong.",
        "cachGhi": "Tổng hợp cột giờ tăng hợp lệ.",
        "loai": "Tự động dự kiến",
        "luuY": "Không trùng B1."
      },
      "F": {
        "noiDung": "Tác động ròng để điều chỉnh giờ B1.",
        "nguon": "E − C − D (giờ mới phát sinh trừ giờ giảm số hóa và giờ giảm khác).",
        "cachGhi": "Giờ tác động ròng F = E − C − D; số âm là giảm giờ; C3 tính Giờ B1 cộng Giờ tác động B2.",
        "loai": "Tự động dự kiến",
        "luuY": "Dấu đã thống nhất: giảm giờ là âm, tăng giờ là dương; không trừ hai lần."
      },
      "G": {
        "noiDung": "Tự xác định từ B2_CT: Đã kiểm chứng (mọi dòng ĐẠT) / Kiểm chứng một phần / Chưa có dòng đạt.",
        "nguon": "Trạng thái các dòng chi tiết.",
        "cachGhi": "Không nhập.",
        "loai": "Tự động – KHÔNG NHẬP",
        "luuY": "Nếu còn dòng chưa kiểm chứng thì không coi toàn bộ là đã kiểm chứng."
      },
      "H": {
        "noiDung": "Số dòng B2_CT_TacDong được tổng hợp.",
        "nguon": "B2_CT_TacDong.",
        "cachGhi": "Không nhập tay.",
        "loai": "Tự động dự kiến",
        "luuY": "Dùng để đối chiếu phạm vi."
      },
      "I": {
        "noiDung": "Cảnh báo trùng, thiếu nguồn, sai phạm vi hoặc kỳ.",
        "nguon": "Logic kiểm tra.",
        "cachGhi": "Không nhập tay.",
        "loai": "Tự động dự kiến",
        "luuY": "Xử lý tại dòng chi tiết, không sửa số tổng bằng tay."
      }
    }
  },
  "C1": {
    "moTa": "Biểu C1 - Danh mục vị trí việc làm. Rà soát VTVL và xác định quỹ giờ quy đổi PP2; chế độ đặc thù có căn cứ riêng. Trách nhiệm: Đơn vị quản lý VTVL và tổ chức cán bộ xác nhận.",
    "cot": {
      "A": {
        "noiDung": "Mã VTVL theo danh mục/quyết định có thẩm quyền; mã đề xuất phải ghi riêng.",
        "nguon": "NGUON_VTVL; quyết định phê duyệt.",
        "cachGhi": "Giữ mã đã có; không tạo vị trí mới do đổi người hoặc chia nhỏ công đoạn.",
        "loai": "Kế thừa/nhập",
        "luuY": "VTVL đề xuất chưa được coi là VTVL đã phê duyệt."
      },
      "B": {
        "noiDung": "Tên VTVL theo quyết định/danh mục.",
        "nguon": "Quyết định phê duyệt.",
        "cachGhi": "Ghi nguyên tên chính thức.",
        "loai": "Kế thừa/nhập",
        "luuY": "Không lấy tên người đang giữ vị trí làm tên VTVL."
      },
      "C": {
        "noiDung": "Phân loại cán bộ/công chức/viên chức hoặc chế độ nhân sự khác theo quy định.",
        "nguon": "Quy định pháp lý và loại hình đơn vị.",
        "cachGhi": "Ghi đúng chế độ nhân sự.",
        "loai": "Nhập",
        "luuY": "Không phân loại chỉ theo nguồn trả lương."
      },
      "D": {
        "noiDung": "Số, ký hiệu quyết định/danh mục phê duyệt VTVL.",
        "nguon": "Hồ sơ VTVL có thẩm quyền.",
        "cachGhi": "Ghi số, ký hiệu, ngày ban hành hoặc địa chỉ hồ sơ.",
        "loai": "Kế thừa/nhập",
        "luuY": "Danh mục nghiên cứu không thay quyết định chính thức."
      },
      "E": {
        "noiDung": "Quỹ giờ dùng trong PP2: mức chung lấy từ DM_THAM_SO (1.904 giờ) hoặc giờ riêng đã kiểm chứng ở H.",
        "nguon": "Hướng dẫn ngày 14/10; cột H–J nếu chế độ đặc thù.",
        "cachGhi": "Cột có công thức; tự sử dụng mức chung hoặc mức giờ riêng hợp lệ. Không điền tay.",
        "loai": "Tự động – KHÔNG NHẬP",
        "luuY": "Mức 1.904 là tham chiếu nghiệp vụ, không phải định mức biên chế."
      },
      "F": {
        "noiDung": "Căn cứ xác định quỹ giờ. Chế độ phổ biến ghi: “Mức chung 1.904 giờ – Bộ luật Lao động và quy định về thời giờ làm việc”. Chế độ đặc thù ghi văn bản quy định giờ riêng.",
        "nguon": "Quy định về thời giờ làm việc, hướng dẫn chuyên ngành.",
        "cachGhi": "Bắt buộc khi có giờ riêng ở H; nếu thiếu thì E để trống.",
        "loai": "Nhập khi có giờ quy đổi",
        "luuY": "Không trừ hai lần thời gian đã loại ở tử số."
      },
      "G": {
        "noiDung": "Kết quả rà soát VTVL: tiếp tục sử dụng; cần cập nhật; đề nghị bổ sung/sửa đổi/bãi bỏ; hoặc trạng thái xác nhận theo file phát hành.",
        "nguon": "Đối chiếu nhiệm vụ, công việc và quyết định hiện hành.",
        "cachGhi": "Ghi theo danh mục trạng thái được cơ quan chủ trì chốt.",
        "loai": "Nhập",
        "luuY": "Không tự sửa danh mục thuộc thẩm quyền cấp trên."
      },
      "H": {
        "noiDung": "Quỹ giờ/năm riêng cho vị trí có chế độ làm việc khác chế độ phổ biến.",
        "nguon": "Văn bản có hiệu lực, định mức ngành và quyết định xác nhận.",
        "cachGhi": "Chỉ nhập số giờ riêng khi có căn cứ; không nhập 1.904 lặp lại.",
        "loai": "Nhập khi đặc thù",
        "luuY": "Không tự chọn mẫu số hoặc lấy 1.600 làm mức mặc định."
      },
      "I": {
        "noiDung": "Thông tin trạng thái, căn cứ và thẩm quyền xác nhận mức riêng tại H.",
        "nguon": "Hồ sơ phê duyệt/xác nhận của đầu mối quản lý ngành, khối.",
        "cachGhi": "Chọn: Đã kiểm chứng / Chưa kiểm chứng.",
        "loai": "Chọn khi đặc thù",
        "luuY": "Chưa xác nhận thì chỉ tính sơ bộ, không khẳng định nhu cầu chính thức."
      },
      "J": {
        "noiDung": "Chế độ 40 giờ/tuần, ca kíp hoặc chế độ ngành/nghề đặc thù.",
        "nguon": "Quy định thời giờ làm việc, hồ sơ vị trí và đơn vị.",
        "cachGhi": "Ghi chế độ thực áp dụng; làm căn cứ xét 1.904 hay mức riêng.",
        "loai": "Nhập",
        "luuY": "Không phân biệt chế độ theo mức lương, ngạch, bậc."
      },
      "K": {
        "noiDung": "Kết quả kiểm soát tính hợp lệ của mức quỹ giờ PP2.",
        "nguon": "E, H, I, J và logic kiểm tra workbook.",
        "cachGhi": "Chỉ đọc và xử lý tại các trường nguồn.",
        "loai": "Tự động – KHÔNG NHẬP",
        "luuY": "Không ghi đè thông báo lỗi."
      }
    }
  },
  "C2": {
    "moTa": "Biểu C2 – Mô tả trách nhiệm và năng lực. Tóm tắt trách nhiệm, năng lực theo hồ sơ đã phê duyệt. Trách nhiệm: Kế thừa khung năng lực và hồ sơ mô tả.",
    "cot": {
      "A": {
        "noiDung": "Mã VTVL cần mô tả yêu cầu.",
        "nguon": "C1_VTVL.",
        "cachGhi": "Ghi đúng mã C1.",
        "loai": "Liên kết",
        "luuY": "Không lập bản năng lực cho mã chưa xác định."
      },
      "B": {
        "noiDung": "Trách nhiệm chính, phạm vi quyền hạn/kết quả phải chịu trách nhiệm của VTVL.",
        "nguon": "Bản mô tả VTVL, phân tích công việc.",
        "cachGhi": "Tóm tắt 1-3 ý chính.",
        "loai": "Nhập/kế thừa",
        "luuY": "Gắn với sản phẩm, không chỉ liệt kê nhiệm vụ."
      },
      "C": {
        "noiDung": "Các năng lực chung cần có và mức yêu cầu.",
        "nguon": "Khung năng lực có thẩm quyền.",
        "cachGhi": "Ghi theo khung được ban hành; có thể nêu mức yêu cầu.",
        "loai": "Nhập/kế thừa",
        "luuY": "Không biến thành danh sách bằng cấp/chứng chỉ."
      },
      "D": {
        "noiDung": "Năng lực chuyên môn, nghiệp vụ cần thiết.",
        "nguon": "Khung năng lực/chuyên ngành.",
        "cachGhi": "Ghi lĩnh vực và mức yêu cầu phù hợp công việc.",
        "loai": "Nhập/kế thừa",
        "luuY": "Có thể gắn bằng chứng/sản phẩm để kiểm tra."
      },
      "E": {
        "noiDung": "Năng lực lãnh đạo, quản lý nếu VTVL có chức năng quản lý.",
        "nguon": "Khung năng lực có thẩm quyền.",
        "cachGhi": "Ghi nếu áp dụng; không áp dụng thì để trống/ghi không áp dụng theo quy tắc file.",
        "loai": "Nhập khi áp dụng",
        "luuY": "Không áp cho vị trí không có yêu cầu lãnh đạo."
      },
      "F": {
        "noiDung": "Văn bản/khung tiêu chuẩn làm căn cứ xác định năng lực.",
        "nguon": "Quy định, quyết định, tiêu chuẩn chức danh.",
        "cachGhi": "Ghi số, ký hiệu hoặc tài liệu.",
        "loai": "Nhập",
        "luuY": "Ưu tiên văn bản còn hiệu lực."
      },
      "G": {
        "noiDung": "Địa chỉ lưu bản mô tả công việc/khung năng lực được phép truy cập.",
        "nguon": "Hồ sơ VTVL.",
        "cachGhi": "Ghi mã hồ sơ, tên tệp hoặc đường dẫn nội bộ.",
        "loai": "Nhập",
        "luuY": "Không yêu cầu chép lại toàn văn bản mô tả vào Excel."
      }
    }
  },
  "C3": {
    "moTa": "Biểu C3 – Nhu cầu nhân lực. Đối chiếu PP1/PP2/PP3, giờ ròng, lao động quy đổi và số người cần bố trí. Cột C–G, M, N tự động (đã khóa).",
    "cot": {
      "A": {
        "noiDung": "VTVL cần xác định nhu cầu; chọn từ C1.",
        "nguon": "C1.",
        "cachGhi": "Ghi đúng mã VTVL.",
        "loai": "Chọn",
        "luuY": "Một VTVL có thể cần một hoặc nhiều người; không đồng nhất VTVL với 01 biên chế."
      },
      "B": {
        "noiDung": "PP1, PP2, PP3 hoặc kết hợp theo tính chất VTVL.",
        "nguon": "Phụ lục III; căn cứ chuyên ngành.",
        "cachGhi": "Chọn PP1, PP2, PP3 hoặc PP1+PP2, PP1+PP3, PP2+PP3, PP1+PP2+PP3; giải trình phần việc của từng phương pháp, không cộng trùng.",
        "loai": "Nhập",
        "luuY": "Không cộng cơ học toàn bộ kết quả các phương pháp."
      },
      "C": {
        "noiDung": "Tổng giờ công việc ban đầu của VTVL từ B1.",
        "nguon": "B1_KhoiLuong.",
        "cachGhi": "Cột tổng hợp theo mã VTVL/kỳ.",
        "loai": "Tự động dự kiến",
        "luuY": "Chỉ dùng dòng B1 đủ căn cứ."
      },
      "D": {
        "noiDung": "Tổng giờ tác động ròng từ B2_ThayDoi (chỉ gồm các dòng B2_CT đã ĐẠT).",
        "nguon": "B2_ThayDoi.",
        "cachGhi": "Tổng hợp theo cùng mã VTVL/kỳ và quy ước dấu.",
        "loai": "Tự động dự kiến",
        "luuY": "Không điều chỉnh hai lần."
      },
      "E": {
        "noiDung": "Tổng giờ cần thiết sau tác động.",
        "nguon": "Cột C và D của C3 (giờ B1 cộng tác động ròng B2).",
        "cachGhi": "Cột tính; không nhập đè.",
        "loai": "Tự động dự kiến",
        "luuY": "Cần thống nhất công thức theo dấu của B2."
      },
      "F": {
        "noiDung": "Quỹ giờ PP2 tự lấy từ C1 cột E của cùng mã VTVL.",
        "nguon": "C1_VTVL cột E; quỹ giờ đặc thù nếu đã xác nhận.",
        "cachGhi": "Không nhập; nếu trống thì kiểm tra C1.",
        "loai": "Tự động – KHÔNG NHẬP",
        "luuY": "Không tự đặt mẫu số; 1.904 là mức chung, giờ riêng phải được xác nhận ở C1."
      },
      "G": {
        "noiDung": "Người quy đổi PP2 = Giờ ròng (E) ÷ Quỹ giờ (F); chỉ tính khi phương pháp có PP2.",
        "nguon": "E/F.",
        "cachGhi": "Cột tính, giữ số thập phân; không tự làm tròn thành người/biên chế.",
        "loai": "Tự động – KHÔNG NHẬP",
        "luuY": "NGƯỜI LAO ĐỘNG QUY ĐỔI khác số người cần bố trí và biên chế."
      },
      "H": {
        "noiDung": "Số người cần theo cơ cấu/chức danh/yêu cầu thường trực hoặc định mức có thẩm quyền.",
        "nguon": "Quy định tổ chức/chuyên ngành.",
        "cachGhi": "Ghi số người thực sự cần theo căn cứ; giới hạn tối đa không mặc nhiên là số phải bố trí đủ.",
        "loai": "Nhập khi PP1",
        "luuY": "Phải dẫn nguồn ở cột K."
      },
      "I": {
        "noiDung": "Số người theo PP3 căn cứ vào sản phẩm, chất lượng, tiến độ, phương án phân công; phải giải trình và xác nhận theo thẩm quyền; không bắt buộc quy thành giờ.",
        "nguon": "Sản phẩm, trách nhiệm, chất lượng, tiến độ, quy định chuyên ngành.",
        "cachGhi": "Ghi số người được xác nhận/giải trình theo PP3.",
        "loai": "Nhập khi PP3",
        "luuY": "PP3 phải có hồ sơ giải trình và xác nhận; không tự coi tính thử là kết quả đã kiểm chứng."
      },
      "J": {
        "noiDung": "Kết luận về số người thực tế cần bố trí cho VTVL sau khi xem xét PP1/PP2/PP3, hiện diện đồng thời và khả năng dùng chung.",
        "nguon": "Kết quả thẩm định C3.",
        "cachGhi": "Ghi số người cần bố trí; phải loại trùng phần việc giữa các phương pháp.",
        "loai": "Nhập sau thẩm định",
        "luuY": "Không đồng nghĩa với số biên chế được giao."
      },
      "K": {
        "noiDung": "Căn cứ của phương pháp và kết quả.",
        "nguon": "Văn bản, B1/B2, hồ sơ PP3, lịch ca...",
        "cachGhi": "Ghi đủ nguồn và giải trình đặc thù.",
        "loai": "Nhập",
        "luuY": "Thiếu nguồn thì kết quả chưa được coi là đã kiểm chứng."
      },
      "L": {
        "noiDung": "Trạng thái kết quả nhu cầu: tính thử/chưa đủ dữ liệu/đã kiểm chứng/không áp dụng...",
        "nguon": "Kết quả kiểm tra, thẩm định.",
        "cachGhi": "Chọn: Tính thử / Chưa đủ dữ liệu / Đã kiểm chứng / Không áp dụng.",
        "loai": "Chọn",
        "luuY": "Chỉ kết quả “đã kiểm chứng” được chuyển sang phương án chính thức."
      },
      "M": {
        "noiDung": "Cảnh báo tự động: mã chưa có ở C1, chưa chọn phương pháp, PP2 thiếu giờ/quỹ giờ hoặc còn dòng B1 chưa đạt, thiếu số người PP1/PP3, thiếu giải trình, chưa kết luận.",
        "nguon": "Logic kiểm tra bộ biểu excel.",
        "cachGhi": "Không nhập tay; xử lý ở dữ liệu nguồn.",
        "loai": "Tự động – KHÔNG NHẬP",
        "luuY": "Kết quả số học đúng chưa đồng nghĩa dữ liệu đủ điều kiện."
      },
      "N": {
        "noiDung": "Số dòng khối lượng thuộc vị trí chưa đủ nguồn, thời gian hoặc xác nhận.",
        "nguon": "B1_KhoiLuong và điều kiện hợp lệ.",
        "cachGhi": "Đọc kết quả đếm; đối chiếu mã VTVL và kỳ trước khi kết luận C3.",
        "loai": "Tự động – KHÔNG NHẬP",
        "luuY": "Có dòng chưa đạt thì không coi tổng PP2 là nhu cầu đầy đủ đã kiểm chứng."
      }
    }
  },
  "D1": {
    "moTa": "Biểu D1 – Nguồn lực hiện có. Phân bổ quỹ giờ của nguồn lực theo VTVL, kiểm soát người kiêm nhiệm. Trách nhiệm: Bộ phận tổ chức cán bộ kê khai, xác nhận nguồn.",
    "cot": {
      "A": {
        "noiDung": "Mã tham chiếu ổn định của người/nguồn lực phục vụ đối chiếu, bảo đảm quản lý dữ liệu phù hợp.",
        "nguon": "NGUON_NHAN_LUC hoặc hệ thống nhân sự.",
        "cachGhi": "Dùng mã thống nhất; hạn chế ghi thông tin cá nhân không cần thiết trong tệp tổng hợp.",
        "loai": "Kế thừa/nhập",
        "luuY": "Một người chỉ có một mã tham chiếu khi đối chiếu nhiều nhiệm vụ."
      },
      "B": {
        "noiDung": "VTVL đang/có thể bố trí nguồn lực; chọn từ C1.",
        "nguon": "C1; hồ sơ phân công.",
        "cachGhi": "Ghi đúng mã VTVL.",
        "loai": "Chọn",
        "luuY": "Người kiêm nhiệm có thể có nhiều dòng phần việc nhưng số người/biên chế chỉ tính một lần."
      },
      "C": {
        "noiDung": "Cán bộ/công chức/viên chức/chế độ khác.",
        "nguon": "Hồ sơ nhân sự.",
        "cachGhi": "Ghi đúng chế độ pháp lý.",
        "loai": "Kế thừa/nhập",
        "luuY": "Không gộp công chức với viên chức."
      },
      "D": {
        "noiDung": "Quỹ giờ của nhân lực: lấy giờ riêng ở K nếu có, nếu không lấy quỹ giờ PP2 của VTVL ở C1.",
        "nguon": "C1; văn bản chế độ làm việc và mức riêng nếu có.",
        "cachGhi": "Không nhập; muốn dùng mức riêng thì ghi ở K.",
        "loai": "Tự động – KHÔNG NHẬP",
        "luuY": "Không dùng quỹ giờ khác mẫu số C3 mà trừ trực tiếp."
      },
      "E": {
        "noiDung": "Phần giờ thực tế/có thể bố trí cho VTVL ở cột B.",
        "nguon": "Phân công, lịch công tác, thực tế.",
        "cachGhi": "Ghi số giờ; tổng các phần của một người không vượt quỹ giờ quy đổi.",
        "loai": "Nhập",
        "luuY": "Hai người mỗi người 50% quỹ giờ tạo 1,0 người quy đổi, nhưng vẫn là 2 người thực tế."
      },
      "F": {
        "noiDung": "Phần giờ dùng cho công việc/VTVL khác.",
        "nguon": "Phân công thực tế.",
        "cachGhi": "Ghi để kiểm soát phân bổ quỹ thời gian.",
        "loai": "Nhập khi có",
        "luuY": "Không cộng vượt quỹ giờ quy đổi."
      },
      "G": {
        "noiDung": "Cơ quan/đơn vị nơi người và chỉ tiêu biên chế được tính chính thức.",
        "nguon": "Quyết định giao biên chế, hồ sơ quản lý.",
        "cachGhi": "Ghi một nơi chính thức.",
        "loai": "Nhập",
        "luuY": "Đặc biệt quan trọng với công tác đảng kiêm nhiệm/ ngành dọc."
      },
      "H": {
        "noiDung": "Nguồn xác nhận nhân lực và phân bổ thời gian.",
        "nguon": "Hệ thống nhân sự, quyết định/phân công.",
        "cachGhi": "Ghi tên nguồn/kỳ.",
        "loai": "Nhập",
        "luuY": "Không dùng số tự kê khai chưa kiểm chứng cho phương án."
      },
      "I": {
        "noiDung": "Mức độ xác nhận của bản ghi nhân lực.",
        "nguon": "Tổ chức cán bộ xác nhận.",
        "cachGhi": "Chọn: Đã kiểm chứng / Chưa kiểm chứng.",
        "loai": "Chọn",
        "luuY": "Bản ghi chưa xác nhận không dùng làm nguồn lực chính thức."
      },
      "J": {
        "noiDung": "Cảnh báo trùng mã, vượt quỹ giờ, thiếu nơi tính BC...",
        "nguon": "Logic kiểm tra.",
        "cachGhi": "Không nhập tay.",
        "loai": "Tự động dự kiến",
        "luuY": "Xử lý ở dữ liệu nguồn/phân bổ."
      },
      "K": {
        "noiDung": "Quỹ giờ đặc thù áp dụng riêng cho nguồn lực được quản lý tại D1 khi có căn cứ.",
        "nguon": "Quy định giờ làm việc đặc thù, nguồn nhân lực.",
        "cachGhi": "Ghi số giờ đã xác nhận của chế độ riêng; không nhập nếu làm việc theo chế độ phổ biến.",
        "loai": "Nhập khi đặc thù",
        "luuY": "Không tự giảm giờ theo đánh giá cá nhân hoặc tiền lương."
      }
    }
  },
  "D2": {
    "moTa": "Biểu D2 – Phương án bố trí và biên chế. Lập phương án từng năm 2027–2031, phân biệt người quy đổi/số người/biên chế. Trách nhiệm: Chỉ tiêu giao căn cứ quyết định đúng cấp.",
    "cot": {
      "A": {
        "noiDung": "VTVL lập phương án; chọn từ C1.",
        "nguon": "C1/C3.",
        "cachGhi": "Ghi đúng mã.",
        "loai": "Chọn",
        "luuY": "Chỉ lập phương án cho VTVL thuộc phạm vi quản lý."
      },
      "B": {
        "noiDung": "Năm của phương án.",
        "nguon": "Lộ trình 2027-2031.",
        "cachGhi": "Chọn năm 2027–2031.",
        "loai": "Chọn",
        "luuY": "Không dùng một số cố định cho cả giai đoạn khi nhiệm vụ thay đổi."
      },
      "C": {
        "noiDung": "Số người cần bố trí theo năm 2027–2031, tự lấy từ bản dự báo đã kiểm chứng theo mã VTVL và năm; nếu chưa có thì để trống.",
        "nguon": "DU_BAO_5_NAM, đối chiếu với C3 năm cơ sở.",
        "cachGhi": "Không nhập đè công thức; đầu mối tổng hợp cập nhật dự báo từng năm có nguồn, lý do và xác nhận.",
        "loai": "Tự động – KHÔNG NHẬP",
        "luuY": "Không mặc nhiên dùng một số từ C3 cho cả 05 năm. Số C3 chỉ giữ tại cột L để đối chiếu."
      },
      "D": {
        "noiDung": "Nguồn lực hiện có có thể bố trí cho VTVL sau đối chiếu phân công/giờ.",
        "nguon": "D1_NhanLuc.",
        "cachGhi": "Ghi theo cùng đơn vị với cột C sau khi đã loại trùng.",
        "loai": "Nhập/tổng hợp",
        "luuY": "Không trừ trực tiếp người lao động quy đổi với nguyên số người nếu khác cơ sở."
      },
      "E": {
        "noiDung": "Chỉ tiêu biên chế/số lượng người làm việc được cấp có thẩm quyền giao ở đúng phạm vi.",
        "nguon": "NGUON_NHAN_LUC; quyết định giao biên chế.",
        "cachGhi": "Chỉ ghi theo VTVL nếu quyết định phân bổ đến VTVL; nếu chỉ giao tổng, không lặp tổng ở từng dòng.",
        "loai": "Kế thừa/nhập",
        "luuY": "Tránh nhân nhiều lần cùng một tổng biên chế."
      },
      "F": {
        "noiDung": "Phương án tự sắp xếp: điều chuyển, bố trí lại, kiêm nhiệm, đào tạo, dùng chung nhân lực.",
        "nguon": "Kết quả đối chiếu C3-D1.",
        "cachGhi": "Ghi số/người hoặc mô tả ngắn phương án theo hướng dẫn cơ quan chủ trì.",
        "loai": "Nhập",
        "luuY": "Phải xem xét trước khi đề nghị tăng biên chế."
      },
      "G": {
        "noiDung": "Chỉ tiêu đề nghị điều chỉnh sau khi đã tính các giải pháp tự sắp xếp.",
        "nguon": "Phương án thẩm định.",
        "cachGhi": "Ghi số đề nghị theo thẩm quyền; có thể bằng 0 nếu đã xác nhận không cần điều chỉnh.",
        "loai": "Nhập sau thẩm định",
        "luuY": "Nhu cầu nhân lực không tự động làm tăng tổng biên chế."
      },
      "H": {
        "noiDung": "Căn cứ và giải trình cho phương án.",
        "nguon": "C3, D1, quyết định giao, tài liệu tổ chức.",
        "cachGhi": "Nêu phần đã tự sắp xếp, lý do còn thiếu/thừa, căn cứ đề nghị.",
        "loai": "Nhập",
        "luuY": "Bắt buộc với đề nghị điều chỉnh."
      },
      "I": {
        "noiDung": "Trạng thái phương án: đang xây dựng/đã hoàn thành ở đơn vị/đã thẩm định/đã được quyết định.",
        "nguon": "Quy trình xử lý hồ sơ.",
        "cachGhi": "Chọn: Đang xây dựng / Đã hoàn thành ở đơn vị / Đã thẩm định / Đã được quyết định.",
        "loai": "Chọn",
        "luuY": "Không đồng nhất “đã gửi biểu” với “đã hoàn thành phương án”."
      },
      "J": {
        "noiDung": "Cảnh báo kiểm tra mã–năm, dự báo năm, trạng thái và văn bản thẩm định/quyết định; chỉ xác nhận đúng điều kiện.",
        "nguon": "Các cột A–I, M, N; dữ liệu C3 và DU_BAO_5_NAM.",
        "cachGhi": "Không nhập tay; đọc và xử lý ở cột đầu vào.",
        "loai": "Tự động – KHÔNG NHẬP",
        "luuY": "Không được coi là 'ĐÃ QUYẾT ĐỊNH' nếu chọn sai trạng thái hoặc thiếu căn cứ văn bản."
      },
      "K": {
        "noiDung": "Người quy đổi PP2 của VTVL, tự lấy từ C3 cột G (tham khảo, không đồng nhất biên chế).",
        "nguon": "C3_NhuCau, cột G.",
        "cachGhi": "Không nhập.",
        "loai": "Tự động – KHÔNG NHẬP",
        "luuY": "Không tự làm tròn thành số người hoặc số biên chế."
      },
      "L": {
        "noiDung": "Người cần bố trí của VTVL, tự lấy từ C3 cột J.",
        "nguon": "C3_NhuCau cột J.",
        "cachGhi": "Không nhập.",
        "loai": "Tự động – KHÔNG NHẬP",
        "luuY": "Không đồng nhất NGƯỜI LAO ĐỘNG QUY ĐỔI với số người."
      },
      "M": {
        "noiDung": "Đối chiếu số người C với D theo cùng đơn vị và so sánh dự báo năm với C3 năm cơ sở.",
        "nguon": "C, D, H, L và bản dự báo năm đã kiểm chứng.",
        "cachGhi": "Chỉ đọc, không sửa công thức.",
        "loai": "Tự động – KHÔNG NHẬP",
        "luuY": "Khác năm cơ sở không phải lỗi nếu có dự báo được kiểm chứng."
      },
      "N": {
        "noiDung": "Số, ngày, cơ quan ban hành văn bản xác nhận mức độ xử lý của phương án.",
        "nguon": "Văn bản thẩm định hoặc quyết định của cấp có thẩm quyền.",
        "cachGhi": "Nhập số hiệu, ngày và cơ quan. Không chỉ ghi lời giải trình chung.",
        "loai": "Nhập ở đầu mối xử lý",
        "luuY": "Bắt buộc khi trạng thái I là 'Đã thẩm định' hoặc 'Đã được quyết định'."
      }
    }
  },
  "DM": {
    "moTa": "Danh mục sản phẩm dùng chung. Tra cứu mã, nhóm, thời gian chuẩn và trạng thái hiệu lực. Trách nhiệm: Cơ quan chuyên ngành/đầu mối quản lý; cơ sở chỉ đọc.",
    "cot": {
      "A": {
        "noiDung": "Mã định danh dùng tra cứu sản phẩm tại B1 cột L.",
        "nguon": "Danh mục do đầu mối công bố.",
        "cachGhi": "Giữ mã chuẩn; chọn đúng mã khi kê khai B1.",
        "loai": "Đầu mối nhập; cơ sở CHỈ ĐỌC",
        "luuY": "Không tự tạo mã chính thức."
      },
      "B": {
        "noiDung": "Tên sản phẩm và loại công việc đại diện.",
        "nguon": "Quy trình chuyên ngành.",
        "cachGhi": "Đặt tên thống nhất, không đồng nhất một hồ sơ với nhiệm vụ.",
        "loai": "Đầu mối nhập; cơ sở CHỈ ĐỌC",
        "luuY": "Không tạo sản phẩm trùng."
      },
      "C": {
        "noiDung": "Phạm vi chuyên ngành của sản phẩm.",
        "nguon": "Cơ quan quản lý ngành, khối.",
        "cachGhi": "Ghi tên khối/ngành làm căn cứ áp dụng.",
        "loai": "Đầu mối nhập; cơ sở CHỈ ĐỌC",
        "luuY": "Không áp chuẩn ngành khác cơ học."
      },
      "D": {
        "noiDung": "Nhóm độ phức tạp sản phẩm nếu có phân nhóm.",
        "nguon": "DM_06_NHOM và danh mục được xác nhận.",
        "cachGhi": "Ghi đúng mã nhóm; trường hợp không áp dụng không tự chấm.",
        "loai": "Đầu mối nhập; cơ sở CHỈ ĐỌC",
        "luuY": "Không dùng ngạch/bậc làm tiêu chí."
      },
      "E": {
        "noiDung": "Thời gian lao động chuẩn của một đơn vị sản phẩm.",
        "nguon": "Định mức hoặc khảo sát có xác nhận.",
        "cachGhi": "Ghi số phút có đủ căn cứ và phạm vi.",
        "loai": "Đầu mối nhập; cơ sở CHỈ ĐỌC",
        "luuY": "Không ghi thời gian tự giả định như chuẩn."
      },
      "F": {
        "noiDung": "Địa chỉ nguồn, quyết định, phiếu đo được công nhận.",
        "nguon": "Hồ sơ xác nhận.",
        "cachGhi": "Ghi số văn bản, nguồn và cách truy vết.",
        "loai": "Đầu mối nhập; cơ sở CHỈ ĐỌC",
        "luuY": "Thiếu nguồn thì không dùng chính thức."
      },
      "G": {
        "noiDung": "Tình trạng kiểm chứng, công bố của mức chuẩn.",
        "nguon": "Đầu mối xác nhận.",
        "cachGhi": "Ghi đúng trạng thái đã có/đang thử/chờ xác nhận.",
        "loai": "Đầu mối nhập; cơ sở CHỈ ĐỌC",
        "luuY": "Không tự đổi sang “đã kiểm chứng”."
      },
      "H": {
        "noiDung": "Chủ thể có thẩm quyền xác nhận.",
        "nguon": "Quyết định/thẩm quyền chuyên ngành.",
        "cachGhi": "Ghi đúng tên cơ quan.",
        "loai": "Đầu mối nhập; cơ sở CHỈ ĐỌC",
        "luuY": "Không lấy người nhập thay cơ quan xác nhận."
      },
      "I": {
        "noiDung": "Ngày chuẩn được phép áp dụng.",
        "nguon": "Hồ sơ công bố.",
        "cachGhi": "Ghi ngày theo văn bản.",
        "loai": "Đầu mối nhập; cơ sở CHỈ ĐỌC",
        "luuY": "Không dùng chuẩn trước ngày hiệu lực."
      },
      "J": {
        "noiDung": "Địa bàn, khối, điều kiện, phiên bản áp dụng.",
        "nguon": "Quyết định chuyên ngành.",
        "cachGhi": "Ghi ngắn gọn giới hạn phạm vi.",
        "loai": "Đầu mối nhập; cơ sở CHỈ ĐỌC",
        "luuY": "Không áp ngoài phạm vi được xác nhận."
      }
    }
  },
  "VUNG": {
    "moTa": "Phân vùng cấp xã. Phân loại xã, phường, đặc khu theo 04 nhóm vùng để phục vụ phân tích, không tự tăng biên chế. Trách nhiệm: Cơ quan phụ trách địa phương nhập A–C.",
    "cot": {
      "A": {
        "noiDung": "Số thứ tự của xã, phường, đặc khu trong phạm vi kê khai.",
        "nguon": "Danh sách đơn vị hành chính cấp xã hiện hành thuộc phạm vi báo cáo.",
        "cachGhi": "Đánh số liên tục 1, 2, 3… cho từng dòng có đơn vị cấp xã.",
        "loai": "Nhập",
        "luuY": "Không đánh số trùng; không tính dòng tiêu đề, dòng trống."
      },
      "B": {
        "noiDung": "Tên đầy đủ, chính thức của từng đơn vị hành chính cấp xã sau sắp xếp.",
        "nguon": "Danh mục đơn vị hành chính cấp xã hiện hành được cơ quan có thẩm quyền xác nhận.",
        "cachGhi": "Ghi đúng tên xã, phường hoặc đặc khu; mỗi đơn vị một dòng.",
        "loai": "Nhập",
        "luuY": "Không dùng tên trước sắp xếp hoặc viết tắt; đối chiếu để không trùng, không thiếu đơn vị."
      },
      "C": {
        "noiDung": "Nhóm vùng của từng xã, phường, đặc khu được nhận diện theo 04 nhóm tại Phụ lục IV.",
        "nguon": "Đặc điểm địa bàn thực tế: đô thị hóa, mật độ và phân bố dân cư, diện tích, hoạt động kinh tế, giao thông, yêu cầu phục vụ; đối chiếu Phụ lục IV.",
        "cachGhi": "Ghi đúng một tên trong 04 nhóm ở cột F: Vùng Đô thị đặc biệt; Vùng Đô thị; Vùng Đồng bằng; Vùng Miền núi.",
        "loai": "Nhập",
        "luuY": "Không chọn theo tên tỉnh một cách cơ học. Trường hợp có nhiều đặc điểm đan xen phải giải trình, xác nhận; không tự đặt nhóm thứ năm."
      },
      "D": {
        "noiDung": "Không có nội dung nghiệp vụ phải khai trong hai cột này.",
        "nguon": "Cấu trúc bộ biểu Excel hiện hành.",
        "cachGhi": "Để nguyên ô trống.",
        "loai": "KHÔNG NHẬP",
        "luuY": "Không tự bổ sung chỉ tiêu vào hai cột trống."
      },
      "E": {
        "noiDung": "Không có nội dung nghiệp vụ phải khai trong hai cột này.",
        "nguon": "Cấu trúc bộ biểu Excel hiện hành.",
        "cachGhi": "Để nguyên ô trống.",
        "loai": "KHÔNG NHẬP",
        "luuY": "Không tự bổ sung chỉ tiêu vào hai cột trống."
      },
      "F": {
        "noiDung": "Các ô F4-F7 liệt kê sẵn 04 tên vùng; F3 là tiêu đề chú dẫn.",
        "nguon": "Phụ lục IV và nội dung thiết kế sẵn của file Excel.",
        "cachGhi": "Đọc để lựa chọn/ghi đúng tên vùng vào cột C.",
        "loai": "CHỈ ĐỌC - KHÔNG NHẬP",
        "luuY": "Không sửa, xóa hoặc nhập thêm dòng vùng tại cột F; không phải cột tổng hợp số xã."
      }
    }
  },
  "S": {
    "moTa": "Biểu S – Nhật ký thay đổi. Lưu vết trường dữ liệu đã sửa, căn cứ, người xác nhận và phiên bản. Trách nhiệm: Chỉ ghi khi sửa dữ liệu đã xác nhận.",
    "cot": {
      "A": {
        "noiDung": "Kỳ dữ liệu bị sửa.",
        "nguon": "Biểu gốc.",
        "cachGhi": "Ghi đúng kỳ.",
        "loai": "Nhập",
        "luuY": "Không gộp sửa của nhiều kỳ vào một dòng."
      },
      "B": {
        "noiDung": "Tên biểu/trang tính có dữ liệu sửa.",
        "nguon": "Workbook.",
        "cachGhi": "Ghi đúng tên trang.",
        "loai": "Nhập",
        "luuY": "Ví dụ A1_NhiemVu, B1_KhoiLuong."
      },
      "C": {
        "noiDung": "Mã bản ghi bị sửa.",
        "nguon": "Biểu gốc.",
        "cachGhi": "Ghi mã nhiệm vụ/công việc/VTVL/nguồn lực tương ứng.",
        "loai": "Nhập",
        "luuY": "Phải truy vết được đúng dòng."
      },
      "D": {
        "noiDung": "Tên cột/trường bị thay đổi.",
        "nguon": "Biểu gốc.",
        "cachGhi": "Ghi đúng tên cột.",
        "loai": "Nhập",
        "luuY": "Mỗi trường thay đổi nên có dòng riêng khi cần truy vết."
      },
      "E": {
        "noiDung": "Giá trị đã xác nhận trước khi sửa.",
        "nguon": "Phiên bản trước.",
        "cachGhi": "Giữ nguyên nội dung cũ.",
        "loai": "Nhập",
        "luuY": "Không xóa lịch sử."
      },
      "F": {
        "noiDung": "Giá trị sau cập nhật.",
        "nguon": "Phiên bản mới.",
        "cachGhi": "Ghi đúng giá trị thay thế.",
        "loai": "Nhập",
        "luuY": "Phải có căn cứ ở cột G."
      },
      "G": {
        "noiDung": "Căn cứ cho việc sửa.",
        "nguon": "Văn bản/hồ sơ/xác nhận mới.",
        "cachGhi": "Ghi đủ để kiểm tra.",
        "loai": "Nhập",
        "luuY": "Không sửa dữ liệu đã xác nhận nếu không có căn cứ."
      },
      "H": {
        "noiDung": "Người/bộ phận xác nhận thay đổi.",
        "nguon": "Phân công trách nhiệm.",
        "cachGhi": "Ghi họ tên/chức danh hoặc đầu mối theo quy định nội bộ.",
        "loai": "Nhập",
        "luuY": "Bảo đảm đúng thẩm quyền."
      },
      "I": {
        "noiDung": "Ngày xác nhận/cập nhật.",
        "nguon": "Thực tế cập nhật.",
        "cachGhi": "Ghi ngày/tháng/năm.",
        "loai": "Nhập",
        "luuY": "Dùng định dạng ngày thống nhất."
      },
      "J": {
        "noiDung": "Số/tên phiên bản dữ liệu sau thay đổi.",
        "nguon": "Quy tắc quản lý phiên bản.",
        "cachGhi": "Ghi phiên bản dùng để tổng hợp.",
        "loai": "Nhập",
        "luuY": "Cùng kỳ chỉ tổng hợp phiên bản được xác nhận mới nhất."
      }
    }
  },
  "Y": {
    "moTa": "Ý kiến của cơ quan, đơn vị. Tập hợp ý kiến góp ý nghiệp vụ/biểu mẫu; không tổng hợp vào biên chế. Trách nhiệm: Chỉ dùng khi được yêu cầu góp ý.",
    "cot": {
      "A": {
        "noiDung": "Số thứ tự ý kiến.",
        "nguon": "Đơn vị góp ý.",
        "cachGhi": "Đánh số liên tục.",
        "loai": "Nhập",
        "luuY": ""
      },
      "B": {
        "noiDung": "Tên đơn vị gửi ý kiến.",
        "nguon": "Đơn vị.",
        "cachGhi": "Ghi đầy đủ.",
        "loai": "Nhập",
        "luuY": ""
      },
      "C": {
        "noiDung": "Nhóm vấn đề góp ý: nghiệp vụ, dữ liệu, công thức, biểu mẫu...",
        "nguon": "Nội dung góp ý.",
        "cachGhi": "Ghi ngắn gọn.",
        "loai": "Nhập",
        "luuY": ""
      },
      "D": {
        "noiDung": "Tên trang/biểu liên quan.",
        "nguon": "Workbook.",
        "cachGhi": "Ghi đúng tên.",
        "loai": "Nhập",
        "luuY": ""
      },
      "E": {
        "noiDung": "Vị trí cần sửa.",
        "nguon": "Workbook/Hướng dẫn.",
        "cachGhi": "Ghi chính xác cột/ô/điều khoản.",
        "loai": "Nhập",
        "luuY": ""
      },
      "F": {
        "noiDung": "Nội dung hiện hành cần góp ý.",
        "nguon": "Dự thảo.",
        "cachGhi": "Trích ngắn đủ nhận diện.",
        "loai": "Nhập",
        "luuY": ""
      },
      "G": {
        "noiDung": "Đề xuất cụ thể.",
        "nguon": "Ý kiến đơn vị.",
        "cachGhi": "Viết thành phương án thay thế nếu có.",
        "loai": "Nhập",
        "luuY": ""
      },
      "H": {
        "noiDung": "Căn cứ pháp lý/nghiệp vụ hoặc lỗi thực tế.",
        "nguon": "Đơn vị góp ý.",
        "cachGhi": "Nêu ngắn gọn, có tài liệu nếu cần.",
        "loai": "Nhập",
        "luuY": ""
      },
      "I": {
        "noiDung": "Mức ảnh hưởng/cần xử lý trước phát hành.",
        "nguon": "Đơn vị góp ý.",
        "cachGhi": "Ghi theo lựa chọn của file nếu có.",
        "loai": "Nhập",
        "luuY": ""
      },
      "J": {
        "noiDung": "Người/bộ phận để làm rõ ý kiến.",
        "nguon": "Đơn vị góp ý.",
        "cachGhi": "Ghi thông tin liên hệ nội bộ phù hợp.",
        "loai": "Nhập",
        "luuY": ""
      },
      "K": {
        "noiDung": "Kết quả xử lý ý kiến.",
        "nguon": "Cơ quan chủ trì.",
        "cachGhi": "Đơn vị góp ý không tự sửa cột này trừ khi được phân công.",
        "loai": "Cơ quan chủ trì nhập",
        "luuY": ""
      }
    }
  }
};
