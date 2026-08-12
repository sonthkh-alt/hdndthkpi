// ============================================================================
//  KHUNG TIÊU CHÍ ĐÁNH GIÁ, XẾP LOẠI HĐND CẤP TỈNH / CẤP XÃ, PHƯỜNG
//  Số hóa từ: Dự thảo Quyết định của Thường trực HĐND tỉnh Thanh Hóa
//             "Ban hành Khung tiêu chí đánh giá, xếp loại HĐND cấp tỉnh, cấp xã
//              tỉnh Thanh Hóa, nhiệm kỳ 2026 - 2031" (docs/Khung_tieu_chi.docx)
//    • Phụ lục I  — HĐND cấp tỉnh (7 nhóm = 100đ + nhóm VIII thưởng + nhóm IX trừ)
//    • Phụ lục II — HĐND cấp xã, phường (7 nhóm = 100đ + VIII + IX)
//
//  FILE THUẦN LOGIC: không import React / Supabase → chạy & kiểm thử được bằng Node.
// ============================================================================

// ---- Kiểu điểm của từng "điểm thành phần" ---------------------------------
//  choice     : chọn 1 mức trong danh sách (options[{s: điểm, label}])
//               option.zeroItem = true  → mức này làm MẤT ĐIỂM TOÀN TIÊU CHÍ
//  minus      : đạt yêu cầu = max, mỗi lần vi phạm trừ `per` (nhập số lần)
//  minusPlus  : như minus nhưng cộng thêm "điểm chất lượng" = tỷ lệ % × `plus`
//               (tổng không vượt quá điểm thành phần tối đa)
//  ratio      : Điểm = tỷ lệ % × max (làm tròn theo `round`, mặc định 0,25)
//  count      : mỗi đơn vị đạt được `per` điểm, tối đa `max` (mô hình, sáng kiến…)
//  Nhóm IX (trừ điểm): { per, cap } → trừ = min(cap, per × số lần)
// ---------------------------------------------------------------------------

const ch = (id, max, guide, options, extra = {}) => ({ id, max, type: 'choice', guide, options, ...extra });
const o = (s, label, extra = {}) => ({ s, label, ...extra });

export const TC_KINDS = [
  {
    id: 'tinh', name: 'HĐND cấp tỉnh', short: 'Cấp tỉnh', phuluc: 'Phụ lục I',
    desc: 'HĐND tỉnh tự đánh giá kết quả hoạt động hằng năm; đồng thời là căn cứ để Thường trực HĐND tỉnh đánh giá các Ban, các Tổ đại biểu và Văn phòng theo phạm vi được giao.',
  },
  {
    id: 'xa', name: 'HĐND cấp xã, phường', short: 'Cấp xã, phường', phuluc: 'Phụ lục II',
    desc: 'HĐND các xã, phường đăng ký, tự đánh giá kết quả thực hiện các nội dung thi đua; Thường trực HĐND tỉnh thẩm định, bình xét trong phong trào thi đua theo chuyên đề.',
  },
];

// Gợi ý loại đơn vị ở cấp tỉnh (Điều 5 khoản 2) — dùng khi thêm đơn vị đánh giá.
export const TC_TINH_SUBJECTS = [
  'Thường trực HĐND tỉnh', 'Ban Kinh tế - Ngân sách', 'Ban Văn hóa - Xã hội', 'Ban Pháp chế',
  'Ban Dân tộc', 'Tổ đại biểu HĐND tỉnh', 'Văn phòng Đoàn ĐBQH và HĐND tỉnh',
];

// ===========================================================================
//  PHỤ LỤC I — HĐND CẤP TỈNH
// ===========================================================================
const G_TINH = [
  { code: 'I', max: 23, title: 'TỔ CHỨC KỲ HỌP, QUYẾT ĐỊNH CÁC VẤN ĐỀ QUAN TRỌNG VÀ PHỐI HỢP CÔNG TÁC', items: [
    { id: 'I.1', max: 4, title: 'Tổ chức các kỳ họp kịp thời, đúng luật định; chương trình khoa học, giảm thời gian trình bày báo cáo, tăng thời gian thảo luận, tranh luận, chất vấn', subs: [
      ch('I.1.a', 1, 'Tổ chức đủ số kỳ họp thường lệ theo luật định: 1,0đ; không tổ chức đủ: 0đ toàn tiêu chí.', [
        o(1, 'Tổ chức đủ số kỳ họp thường lệ theo luật định'),
        o(0, 'Không tổ chức đủ (mất điểm toàn tiêu chí I.1)', { zeroItem: true }),
      ]),
      ch('I.1.b', 1, 'Tổ chức kịp thời kỳ họp chuyên đề để quyết định vấn đề cấp bách phát sinh: 1,0đ; có nội dung cấp bách phải lùi sang kỳ họp sau do nguyên nhân chủ quan: 0đ.', [
        o(1, 'Tổ chức kịp thời kỳ họp chuyên đề khi phát sinh yêu cầu'),
        o(1, 'Trong năm không phát sinh yêu cầu kỳ họp chuyên đề'),
        o(0, 'Có nội dung cấp bách phải lùi kỳ họp do nguyên nhân chủ quan'),
      ]),
      ch('I.1.c', 2, 'Thời lượng thảo luận, tranh luận, chất vấn ≥ 40% tổng thời gian kỳ họp: 2,0đ; 30% đến dưới 40%: 1,0đ; dưới 30%: 0đ.', [
        o(2, 'Từ 40% tổng thời gian kỳ họp trở lên'),
        o(1, 'Từ 30% đến dưới 40%'),
        o(0, 'Dưới 30%'),
      ]),
    ] },
    { id: 'I.2', max: 3, title: 'Thực hiện "kỳ họp không giấy": 100% tài liệu điện tử, gửi đại biểu đúng thời hạn luật định', subs: [
      ch('I.2.a', 1.5, '100% tài liệu kỳ họp được số hóa, gửi qua hệ thống: 1,5đ; từ 90% đến dưới 100%: 0,5đ; dưới 90%: 0đ.', [
        o(1.5, '100% tài liệu kỳ họp được số hóa, gửi qua hệ thống'),
        o(0.5, 'Từ 90% đến dưới 100%'),
        o(0, 'Dưới 90%'),
      ]),
      { id: 'I.2.b', max: 1.5, type: 'minus', per: 0.5, unitLabel: 'kỳ họp gửi tài liệu chậm',
        guide: 'Gửi đủ tài liệu đúng thời hạn luật định ở 100% kỳ họp: 1,5đ; có kỳ họp chậm: trừ 0,5đ/kỳ họp.' },
    ] },
    { id: 'I.3', max: 5, title: 'Nghị quyết ban hành đúng thẩm quyền, trình tự, thủ tục; không có nghị quyết bị đình chỉ, bãi bỏ hoặc kiến nghị xử lý', subs: [
      ch('I.3.a', 5, 'Không có nghị quyết bị đình chỉ, bãi bỏ, kiến nghị xử lý: 5,0đ; có 01 nghị quyết: 2,0đ; từ 02 trở lên: 0đ (đồng thời bị trừ điểm tại nhóm IX).', [
        o(5, 'Không có nghị quyết bị đình chỉ, bãi bỏ, kiến nghị xử lý'),
        o(2, 'Có 01 nghị quyết'),
        o(0, 'Từ 02 nghị quyết trở lên (bị trừ điểm tại nhóm IX)'),
      ]),
    ] },
    { id: 'I.4', max: 3, title: 'Kịp thời thể chế hóa 100% chủ trương, chỉ đạo của Trung ương, của Tỉnh ủy thuộc thẩm quyền quyết định của HĐND tỉnh; nghị quyết tháo gỡ điểm nghẽn, khơi thông nguồn lực', subs: [
      ch('I.4.a', 2, '100% chủ trương, chỉ đạo phát sinh trong năm được thể chế hóa kịp thời: 2,0đ; còn nội dung chậm: 1,0đ; có nội dung không được thể chế hóa do chủ quan: 0đ; trong năm không phát sinh yêu cầu: tính đủ 2,0đ.', [
        o(2, '100% được thể chế hóa kịp thời, đúng thời hạn'),
        o(2, 'Trong năm không phát sinh yêu cầu thể chế hóa'),
        o(1, 'Còn nội dung chậm so với yêu cầu'),
        o(0, 'Có nội dung không được thể chế hóa do nguyên nhân chủ quan'),
      ]),
      ch('I.4.b', 1, 'Có ít nhất 01 nghị quyết được cơ quan trình hoặc đối tượng chịu tác động đánh giá bằng văn bản là đã tháo gỡ điểm nghẽn, khơi thông nguồn lực: 1,0đ.', [
        o(1, 'Có ít nhất 01 nghị quyết được đánh giá bằng văn bản'),
        o(0, 'Chưa có'),
      ]),
    ] },
    { id: 'I.5', max: 2, title: 'Biểu quyết điện tử, biểu quyết trực tuyến; công khai kịp thời nghị quyết, kết quả kỳ họp trên môi trường mạng', subs: [
      ch('I.5.a', 1, 'Áp dụng biểu quyết điện tử hoặc trực tuyến có xác thực đại biểu tại 100% kỳ họp: 1,0đ; áp dụng một phần: 0,5đ.', [
        o(1, 'Áp dụng tại 100% kỳ họp (có xác thực đại biểu)'),
        o(0.5, 'Áp dụng một phần'),
        o(0, 'Chưa áp dụng'),
      ]),
      ch('I.5.b', 1, 'Công khai nghị quyết, kết quả kỳ họp trong 05 ngày làm việc: 1,0đ; chậm: 0,5đ; không công khai: 0đ.', [
        o(1, 'Công khai trong 05 ngày làm việc'),
        o(0.5, 'Công khai chậm'),
        o(0, 'Không công khai'),
      ]),
    ] },
    { id: 'I.6', max: 3, title: 'Các báo cáo, đề án, dự thảo nghị quyết trình HĐND tỉnh đều được các Ban thẩm tra đúng thời hạn; báo cáo thẩm tra thể hiện rõ chính kiến, có tính phản biện', subs: [
      ch('I.6.a', 1.5, '100% nội dung trình kỳ họp được thẩm tra đúng thời hạn: 1,5đ; còn nội dung thẩm tra chậm: 0,5đ; có nội dung trình kỳ họp không được thẩm tra: 0đ toàn tiêu chí.', [
        o(1.5, '100% nội dung trình kỳ họp được thẩm tra đúng thời hạn'),
        o(0.5, 'Còn nội dung thẩm tra chậm'),
        o(0, 'Có nội dung trình kỳ họp không được thẩm tra (mất điểm toàn tiêu chí I.6)', { zeroItem: true }),
      ]),
      ch('I.6.b', 1.5, '100% báo cáo thẩm tra nêu rõ quan điểm tán thành, không tán thành hoặc đề nghị chỉnh sửa đối với từng vấn đề còn ý kiến khác nhau: 1,5đ; báo cáo còn chung chung, xuôi chiều: 0,5đ.', [
        o(1.5, '100% báo cáo thẩm tra nêu rõ quan điểm với từng vấn đề còn ý kiến khác nhau'),
        o(0.5, 'Báo cáo thẩm tra còn chung chung, xuôi chiều'),
        o(0, 'Không đạt'),
      ]),
    ] },
    { id: 'I.7', max: 3, title: 'Phối hợp chặt chẽ, hiệu quả với UBND tỉnh, Ủy ban MTTQ Việt Nam tỉnh, Đoàn ĐBQH tỉnh và các cơ quan liên quan', subs: [
      ch('I.7.a', 1.5, 'Có quy chế phối hợp còn hiệu lực và tổ chức đánh giá việc thực hiện trong năm: 1,5đ.', [
        o(1.5, 'Có quy chế phối hợp còn hiệu lực + có đánh giá việc thực hiện trong năm'),
        o(0, 'Chưa đạt'),
      ]),
      ch('I.7.b', 1.5, 'Không phát sinh vướng mắc phối hợp phải xử lý bằng văn bản: 1,5đ.', [
        o(1.5, 'Không phát sinh vướng mắc phối hợp phải xử lý bằng văn bản'),
        o(0, 'Có phát sinh vướng mắc phải xử lý bằng văn bản'),
      ]),
    ] },
  ] },

  { code: 'II', max: 20, title: 'HOẠT ĐỘNG GIÁM SÁT', items: [
    { id: 'II.1', max: 3, title: 'Chương trình giám sát đúng trọng tâm, trúng vấn đề cử tri và dư luận quan tâm', subs: [
      ch('II.1.a', 1, 'Ban hành chương trình giám sát năm đúng thời hạn luật định: 1,0đ.', [
        o(1, 'Ban hành đúng thời hạn luật định'), o(0, 'Chậm hoặc chưa ban hành'),
      ]),
      ch('II.1.b', 2, 'Có ít nhất 01 chuyên đề xuất phát từ kiến nghị cử tri, đơn thư hoặc vấn đề dư luận quan tâm: 2,0đ; không có: 0đ.', [
        o(2, 'Có ít nhất 01 chuyên đề xuất phát từ kiến nghị cử tri/đơn thư/dư luận'),
        o(0, 'Không có'),
      ]),
    ] },
    { id: 'II.2', max: 5, title: 'Hoàn thành 100% cuộc giám sát chuyên đề theo kế hoạch; kiến nghị cụ thể, rõ trách nhiệm, khả thi', subs: [
      ch('II.2.a', 4, 'Định mức tối thiểu: (1) HĐND tỉnh ≥ 02 cuộc/nhiệm kỳ; (2) Thường trực ≥ 02 cuộc/năm; (3) mỗi Ban ≥ 02 cuộc/năm; (4) mỗi Tổ đại biểu ≥ 01 cuộc/năm. Đạt cả 04 nhóm chủ thể: 4,0đ; thiếu 01 nhóm: 2,5đ; thiếu 02 nhóm: 1,0đ; thiếu từ 03 nhóm: 0đ.', [
        o(4, 'Đạt định mức của cả 04 nhóm chủ thể'),
        o(2.5, 'Thiếu định mức của 01 nhóm chủ thể'),
        o(1, 'Thiếu 02 nhóm chủ thể'),
        o(0, 'Thiếu từ 03 nhóm chủ thể trở lên'),
      ]),
      ch('II.2.b', 1, 'Kết luận, kiến nghị nêu rõ chủ thể, nội dung, thời hạn thực hiện: 1,0đ.', [
        o(1, 'Kết luận, kiến nghị nêu rõ chủ thể - nội dung - thời hạn'), o(0, 'Chưa đạt'),
      ]),
    ] },
    { id: 'II.3', max: 4, title: 'Tổ chức chất vấn, giải trình chất lượng; nghị quyết, kết luận rõ người, rõ việc, rõ tiến độ, rõ kết quả', subs: [
      ch('II.3.a', 2, 'Tổ chức chất vấn tại 100% kỳ họp thường lệ và ít nhất 01 phiên giải trình trong năm: 2,0đ; thiếu một trong hai: 1,0đ.', [
        o(2, 'Chất vấn tại 100% kỳ họp thường lệ + ≥ 01 phiên giải trình'),
        o(1, 'Thiếu một trong hai nội dung'),
        o(0, 'Thiếu cả hai'),
      ]),
      ch('II.3.b', 2, 'Ban hành nghị quyết, kết luận theo khung "rõ người, rõ việc, rõ tiến độ, rõ kết quả": 2,0đ.', [
        o(2, 'Có ban hành theo khung 4 rõ'), o(0, 'Chưa đạt'),
      ]),
    ] },
    { id: 'II.4', max: 5, title: 'Theo dõi "đến cùng": 100% kết luận, kiến nghị sau giám sát được theo dõi, đôn đốc; tỷ lệ kiến nghị đã đến hạn được thực hiện đạt từ 85% trở lên; giám sát lại khi cần thiết', subs: [
      ch('II.4.a', 2, '100% kết luận, kiến nghị sau giám sát được theo dõi, đôn đốc bằng văn bản ít nhất 01 lần trong năm và cập nhật trên phần mềm hoặc sổ theo dõi: 2,0đ.', [
        o(2, 'Đạt 100% (có văn bản đôn đốc + cập nhật phần mềm/sổ theo dõi)'),
        o(0, 'Chưa đạt'),
      ]),
      ch('II.4.b', 2, 'Tỷ lệ kết luận, kiến nghị ĐÃ ĐẾN HẠN được thực hiện xong: ≥85%: 2,0đ; 70% đến dưới 85%: 1,25đ; 50% đến dưới 70%: 0,5đ; dưới 50%: 0đ. (Mẫu số chỉ tính kiến nghị đã đến thời hạn; không tính kiến nghị chưa đến hạn, có lộ trình nhiều năm hoặc không thực hiện được vì lý do khách quan đã được chấp thuận bằng văn bản.)', [
        o(2, 'Từ 85% trở lên'), o(1.25, 'Từ 70% đến dưới 85%'), o(0.5, 'Từ 50% đến dưới 70%'), o(0, 'Dưới 50%'),
      ]),
      ch('II.4.c', 1, 'Có tổ chức tái giám sát, tái chất vấn hoặc kiến nghị xử lý trách nhiệm đối với nội dung chậm chuyển biến: 1,0đ.', [
        o(1, 'Có tái giám sát/tái chất vấn/kiến nghị xử lý trách nhiệm'), o(0, 'Chưa có'),
      ]),
    ] },
    { id: 'II.5', max: 3, title: 'Ứng dụng công nghệ, chuyển đổi số trong hoạt động giám sát (phần mềm theo dõi kiến nghị, dữ liệu số)', subs: [
      ch('II.5.a', 2, 'Có phần mềm hoặc cơ sở dữ liệu theo dõi kiến nghị sau giám sát đang vận hành thực tế: 2,0đ; mới thí điểm: 1,0đ.', [
        o(2, 'Đang vận hành thực tế'), o(1, 'Mới thí điểm'), o(0, 'Chưa có'),
      ]),
      ch('II.5.b', 1, 'Hồ sơ giám sát được số hóa, tra cứu được: 1,0đ.', [
        o(1, 'Hồ sơ giám sát đã số hóa, tra cứu được'), o(0, 'Chưa đạt'),
      ]),
    ] },
  ] },

  { code: 'III', max: 15, title: 'TIẾP XÚC CỬ TRI, TIẾP CÔNG DÂN, CÔNG TÁC DÂN NGUYỆN', items: [
    { id: 'III.1', max: 4, title: 'Tổ chức tiếp xúc cử tri theo kế hoạch; đổi mới hình thức tiếp xúc theo chuyên đề, theo nhóm đối tượng, trực tuyến…', subs: [
      ch('III.1.a', 2, 'Tổ chức tiếp xúc cử tri đúng Kế hoạch: 2,0đ; thiếu 01 đợt: 1,0đ.', [
        o(2, 'Tổ chức đúng Kế hoạch'), o(1, 'Thiếu 01 đợt'), o(0, 'Thiếu từ 02 đợt trở lên'),
      ]),
      ch('III.1.b', 2, 'Tổ chức ít nhất 02 cuộc tiếp xúc theo chuyên đề, nhóm đối tượng hoặc trực tuyến trong năm: 2,0đ; 01 cuộc: 1,0đ.', [
        o(2, 'Từ 02 cuộc trở lên'), o(1, '01 cuộc'), o(0, 'Không tổ chức'),
      ]),
    ] },
    { id: 'III.2', max: 4, title: 'Tổng hợp, phân loại, chuyển, đôn đốc và giám sát việc giải quyết kiến nghị của cử tri; tỷ lệ giải quyết, trả lời đúng thời hạn đạt từ 90% trở lên', subs: [
      ch('III.2.a', 2, '100% kiến nghị của cử tri được tổng hợp, phân loại, chuyển đúng thẩm quyền, đúng thời hạn: 2,0đ; còn kiến nghị chuyển chậm: 1,0đ.', [
        o(2, 'Đạt 100%'), o(1, 'Còn kiến nghị chuyển chậm'), o(0, 'Chưa đạt'),
      ]),
      ch('III.2.b', 1.5, 'Tỷ lệ kiến nghị được giải quyết, trả lời đúng thời hạn ≥90%: 1,5đ; 80% đến dưới 90%: 1,0đ; dưới 80%: 0,5đ; dưới 80% nhưng đã đôn đốc bằng văn bản, tổ chức giám sát, khảo sát hoặc chất vấn: 1,0đ.', [
        o(1.5, 'Từ 90% trở lên'), o(1, 'Từ 80% đến dưới 90%'),
        o(1, 'Dưới 80% nhưng đã đôn đốc bằng văn bản / giám sát / chất vấn'),
        o(0.5, 'Dưới 80%'),
      ]),
      ch('III.2.c', 0.5, 'Có báo cáo kết quả thẩm tra việc giải quyết kiến nghị cử tri trình kỳ họp thường lệ: 0,5đ.', [
        o(0.5, 'Có báo cáo thẩm tra trình kỳ họp thường lệ'), o(0, 'Chưa có'),
      ]),
    ] },
    { id: 'III.3', max: 4, title: 'Tiếp công dân định kỳ đúng quy định; đơn thư được xử lý, chuyển, đôn đốc và theo dõi kết quả giải quyết đầy đủ', subs: [
      { id: 'III.3.a', max: 2, type: 'minus', per: 0.5, unitLabel: 'kỳ tiếp công dân còn thiếu',
        guide: 'Tiếp công dân đủ số kỳ theo quy định: 2,0đ; thiếu mỗi kỳ trừ 0,5đ.' },
      ch('III.3.b', 2, '100% đơn thư được xử lý, chuyển đúng thẩm quyền, đúng hạn và theo dõi kết quả: 2,0đ; còn đơn thư quá hạn: 1,0đ.', [
        o(2, 'Đạt 100%'), o(1, 'Còn đơn thư quá hạn'), o(0, 'Chưa đạt'),
      ]),
    ] },
    { id: 'III.4', max: 3, title: 'Số hóa việc tiếp nhận, phân loại, theo dõi kiến nghị cử tri và đơn thư của công dân', subs: [
      ch('III.4.a', 2, 'Có phần mềm hoặc sổ điện tử quản lý kiến nghị cử tri và đơn thư: 2,0đ.', [
        o(2, 'Có phần mềm / sổ điện tử'), o(0, 'Chưa có'),
      ]),
      ch('III.4.b', 1, 'Dữ liệu cập nhật đầy đủ, tra cứu được theo tiến độ giải quyết: 1,0đ.', [
        o(1, 'Dữ liệu đầy đủ, tra cứu được theo tiến độ'), o(0, 'Chưa đạt'),
      ]),
    ] },
  ] },

  { code: 'IV', max: 15, title: 'CHUYỂN ĐỔI SỐ, ỨNG DỤNG KHOA HỌC CÔNG NGHỆ VÀ TRÍ TUỆ NHÂN TẠO', items: [
    { id: 'IV.1', max: 3, title: '100% văn bản (trừ văn bản mật) xử lý trên môi trường điện tử, ký số theo quy định', subs: [
      ch('IV.1.a', 3, 'Đạt 100%: 3,0đ; từ 90% đến dưới 100%: 1,5đ; dưới 90%: 0đ. Số liệu lấy từ hệ thống quản lý văn bản và điều hành của tỉnh (không bao gồm Nghị quyết của HĐND tỉnh).', [
        o(3, 'Đạt 100%'), o(1.5, 'Từ 90% đến dưới 100%'), o(0, 'Dưới 90%'),
      ]),
    ] },
    { id: 'IV.2', max: 4, title: 'Tích hợp, liên thông các hệ thống dữ liệu thành cơ sở dữ liệu dùng chung về nghị quyết, kết luận giám sát, kiến nghị cử tri', subs: [
      ch('IV.2.a', 2.5, 'Các hệ thống đã chấm tại tiêu chí II.5 và III.4 được tích hợp, liên thông, tra cứu tập trung trên một nền tảng: 2,5đ; mới kết nối một phần: 1,0đ.', [
        o(2.5, 'Đã tích hợp, liên thông, tra cứu tập trung'), o(1, 'Mới kết nối một phần'), o(0, 'Chưa kết nối'),
      ]),
      ch('IV.2.b', 1.5, 'Kết xuất được báo cáo tổng hợp phục vụ chỉ đạo, điều hành: 1,5đ (không chấm lại điểm của từng hệ thống thành phần).', [
        o(1.5, 'Kết xuất được báo cáo tổng hợp'), o(0, 'Chưa đạt'),
      ]),
    ] },
    { id: 'IV.3', max: 4, title: 'Ứng dụng trí tuệ nhân tạo hỗ trợ đại biểu (trợ lý ảo, tổng hợp - phân tích tài liệu kỳ họp, dữ liệu phục vụ thẩm tra)', subs: [
      ch('IV.3.a', 3, 'Có ứng dụng AI triển khai chính thức phục vụ đại biểu: 3,0đ; mới thí điểm: 1,5đ; chưa triển khai: 0đ.', [
        o(3, 'Triển khai chính thức'), o(1.5, 'Mới thí điểm'), o(0, 'Chưa triển khai'),
      ]),
      ch('IV.3.b', 1, 'Có báo cáo đánh giá hiệu quả bằng số liệu: 1,0đ.', [
        o(1, 'Có báo cáo đánh giá hiệu quả bằng số liệu'), o(0, 'Chưa có'),
      ]),
    ] },
    { id: 'IV.4', max: 4, title: 'Trang thông tin điện tử của HĐND tỉnh cập nhật đầy đủ; truyền hình trực tiếp, trực tuyến các kỳ họp thường lệ', subs: [
      ch('IV.4.a', 2, 'Trang thông tin điện tử cập nhật đầy đủ, kịp thời theo quy định: 2,0đ; cập nhật chưa thường xuyên: 1,0đ.', [
        o(2, 'Cập nhật đầy đủ, kịp thời'), o(1, 'Cập nhật chưa thường xuyên'), o(0, 'Chưa đạt'),
      ]),
      ch('IV.4.b', 2, 'Truyền hình trực tiếp hoặc trực tuyến 100% phiên khai mạc, bế mạc, chất vấn tại kỳ họp thường lệ: 2,0đ.', [
        o(2, 'Đạt 100% các phiên theo quy định'), o(0, 'Chưa đạt'),
      ]),
    ] },
  ] },

  { code: 'V', max: 15, title: 'ĐỔI MỚI SÁNG TẠO, MÔ HÌNH MỚI, CÁCH LÀM HAY', items: [
    { id: 'V.1', max: 5, title: 'Trong năm có ít nhất 02 mô hình mới, cách làm hay được triển khai, đánh giá hiệu quả rõ rệt', subs: [
      { id: 'V.1.a', max: 5, type: 'count', per: 2.5, unitLabel: 'mô hình đủ 05 điều kiện',
        guide: 'Mô hình mới, cách làm hay là giải pháp mới trong phương thức tổ chức, điều hành hoạt động của HĐND (không bao gồm mô hình tổ chức bộ máy chính quyền). Chỉ tính khi đủ 05 điều kiện: (1) chưa từng áp dụng trước năm đánh giá; (2) có văn bản triển khai của Thường trực HĐND tỉnh; (3) đã vận hành ít nhất 06 tháng hoặc qua ít nhất 01 kỳ họp; (4) có báo cáo đánh giá hiệu quả bằng số liệu; (5) được Thường trực HĐND tỉnh công nhận bằng văn bản. Mỗi mô hình: 2,5đ, tối đa 5,0đ. Mô hình dừng ở ý tưởng, đề án chưa triển khai: không tính điểm.' },
    ] },
    { id: 'V.2', max: 5, title: 'Có sáng kiến, giải pháp cải tiến quy trình, lề lối làm việc được Thường trực HĐND tỉnh công nhận và đưa vào áp dụng', subs: [
      { id: 'V.2.a', max: 5, type: 'count', per: 2.5, unitLabel: 'sáng kiến được công nhận và áp dụng',
        guide: 'Mỗi sáng kiến, giải pháp được Thường trực HĐND tỉnh công nhận và đưa vào áp dụng thực tế: 2,5đ, tối đa 5,0đ. Sáng kiến mới ở dạng đề xuất, chưa áp dụng: không tính điểm. Nội dung được Trung ương ghi nhận, nhân rộng chấm tại nhóm VIII, không tính lại.' },
    ] },
    { id: 'V.3', max: 5, title: 'Hoạt động của HĐND đóng góp thiết thực cải thiện các chỉ số cải cách hành chính, chuyển đổi số, năng lực cạnh tranh của tỉnh', subs: [
      { id: 'V.3.a', max: 3, type: 'count', per: 1.5, unitLabel: 'chỉ số (PAR INDEX / DTI / PCI) tăng hạng',
        guide: 'Mỗi chỉ số PAR INDEX, DTI, PCI của tỉnh tăng hạng so với năm trước: 1,5đ, tối đa 3,0đ.' },
      ch('V.3.b', 2, 'Có nghị quyết của HĐND tỉnh được cơ quan chủ trì xác định là giải pháp trực tiếp cải thiện chỉ số: 2,0đ. Chỉ số PII chấm tại nhóm VIII, không tính lại.', [
        o(2, 'Có nghị quyết được xác định là giải pháp trực tiếp'), o(0, 'Chưa có'),
      ]),
    ] },
  ] },

  { code: 'VI', max: 7, title: 'HƯỚNG DẪN, HỖ TRỢ HOẠT ĐỘNG CỦA HĐND CẤP XÃ', items: [
    { id: 'VI.1', max: 4, title: 'Tổ chức giao ban, tập huấn, hướng dẫn nghiệp vụ định kỳ cho Thường trực, đại biểu HĐND cấp xã', subs: [
      ch('VI.1.a', 2, 'Tổ chức giao ban với Thường trực HĐND cấp xã tối thiểu 01 lần/năm: 2,0đ.', [
        o(2, 'Có tổ chức giao ban ≥ 01 lần/năm'), o(0, 'Chưa tổ chức'),
      ]),
      ch('VI.1.b', 2, 'Tổ chức ít nhất 01 lớp tập huấn, bồi dưỡng cho đại biểu HĐND cấp xã/năm: 2,0đ.', [
        o(2, 'Có tổ chức ≥ 01 lớp tập huấn/năm'), o(0, 'Chưa tổ chức'),
      ]),
    ] },
    { id: 'VI.2', max: 3, title: 'Kết nối trực tuyến, chia sẻ dữ liệu, hỗ trợ kịp thời HĐND cấp xã trong hoạt động', subs: [
      ch('VI.2.a', 1.5, 'Duy trì kênh kết nối trực tuyến thường xuyên với HĐND cấp xã: 1,5đ.', [
        o(1.5, 'Có duy trì kênh kết nối trực tuyến thường xuyên'), o(0, 'Chưa có'),
      ]),
      ch('VI.2.b', 1.5, 'Chia sẻ dữ liệu, tài liệu và giải đáp vướng mắc trong 05 ngày làm việc: 1,5đ; chậm: 0,5đ.', [
        o(1.5, 'Trong 05 ngày làm việc'), o(0.5, 'Chậm hơn 05 ngày làm việc'), o(0, 'Không thực hiện'),
      ]),
    ] },
  ] },

  { code: 'VII', max: 5, title: 'CHẾ ĐỘ THÔNG TIN, BÁO CÁO VÀ TRUYỀN THÔNG', items: [
    { id: 'VII.1', max: 2, title: 'Thực hiện đầy đủ, đúng hạn chế độ thông tin, báo cáo với Trung ương, Tỉnh ủy và các cơ quan có thẩm quyền', subs: [
      { id: 'VII.1.a', max: 2, type: 'minus', per: 0.5, unitLabel: 'lần báo cáo chậm',
        guide: '100% báo cáo định kỳ, đột xuất đúng hạn, đúng biểu mẫu: 2,0đ; mỗi lần chậm trừ 0,5đ (đồng thời bị trừ điểm tại nhóm IX).' },
    ] },
    { id: 'VII.2', max: 3, title: 'Chủ động truyền thông về hoạt động của HĐND, lan tỏa mô hình, cách làm hay trên các phương tiện thông tin và nền tảng số', subs: [
      ch('VII.2.a', 1, 'Ban hành và thực hiện kế hoạch truyền thông năm: 1,0đ.', [
        o(1, 'Có ban hành và thực hiện kế hoạch truyền thông năm'), o(0, 'Chưa có'),
      ]),
      ch('VII.2.b', 1, 'Duy trì tin, bài thường xuyên trên báo chí và nền tảng số của tỉnh: 1,0đ.', [
        o(1, 'Duy trì tin, bài thường xuyên'), o(0, 'Chưa đạt'),
      ]),
      ch('VII.2.c', 1, 'Có ít nhất 01 mô hình, cách làm hay được báo chí Trung ương phản ánh: 1,0đ.', [
        o(1, 'Có ≥ 01 mô hình được báo chí Trung ương phản ánh'), o(0, 'Chưa có'),
      ]),
    ] },
  ] },
];

const B_TINH = { code: 'VIII', max: 10, kind: 'bonus', title: 'ĐIỂM THƯỞNG ĐỔI MỚI SÁNG TẠO (tối đa 10 điểm)', items: [
  { id: 'VIII.1', max: 5, title: 'Có mô hình, sáng kiến được Trung ương giới thiệu, nhân rộng toàn quốc', subs: [
    ch('VIII.1.a', 5, 'Có văn bản của Ủy ban Thường vụ Quốc hội, Ủy ban Công tác đại biểu hoặc cơ quan Trung ương giới thiệu, đề nghị nhân rộng: 5,0đ. Chỉ tính 01 lần trong năm đánh giá.', [
      o(5, 'Có văn bản của cơ quan Trung ương giới thiệu, nhân rộng'), o(0, 'Chưa có'),
    ]),
  ] },
  { id: 'VIII.2', max: 3, title: 'Được tặng giải thưởng, bằng khen cấp quốc gia về đổi mới sáng tạo, chuyển đổi số trong hoạt động dân cử', subs: [
    ch('VIII.2.a', 3, 'Giải thưởng, bằng khen cấp quốc gia: 3,0đ; cấp bộ, ngành Trung ương: 1,5đ. Chỉ tính mức cao nhất đạt được.', [
      o(3, 'Cấp quốc gia'), o(1.5, 'Cấp bộ, ngành Trung ương'), o(0, 'Không có'),
    ]),
  ] },
  { id: 'VIII.3', max: 2, title: 'Tỉnh tăng hạng hoặc thuộc nhóm dẫn đầu các chỉ số có liên quan trực tiếp đến hoạt động của HĐND', subs: [
    ch('VIII.3.a', 2, 'Tỉnh thuộc nhóm 10 địa phương dẫn đầu chỉ số PII: 2,0đ; tăng từ 03 bậc trở lên so với năm trước: 1,0đ. Chỉ tính mức cao nhất đạt được.', [
      o(2, 'Thuộc nhóm 10 địa phương dẫn đầu chỉ số PII'), o(1, 'Tăng từ 03 bậc trở lên'), o(0, 'Không đạt'),
    ]),
  ] },
] };

const D_TINH = { code: 'IX', max: 20, kind: 'deduct', title: 'ĐIỂM TRỪ VÀ CHẾ TÀI VI PHẠM (tối đa trừ 20 điểm)', items: [
  { id: 'IX.1', title: 'Nghị quyết bị cơ quan có thẩm quyền kết luận ban hành trái pháp luật, phải đình chỉ, bãi bỏ hoặc sửa đổi', per: 5, cap: 5, unitLabel: 'nghị quyết', sanction: 'noXS', sanctionText: 'Không xếp loại Xuất sắc trong năm đánh giá.' },
  { id: 'IX.2', title: 'Không hoàn thành cuộc giám sát chuyên đề đã ghi trong chương trình giám sát năm mà không có lý do chính đáng', per: 3, cap: 3, unitLabel: 'cuộc giám sát', note: 'Điều chỉnh chương trình giám sát theo nghị quyết của HĐND tỉnh thì không bị trừ điểm.' },
  { id: 'IX.3', title: 'Tổ đại biểu HĐND tỉnh không tổ chức giám sát, khảo sát trong năm', per: 0.5, cap: 2, unitLabel: 'Tổ đại biểu' },
  { id: 'IX.4', title: 'Chậm gửi báo cáo định kỳ, đột xuất theo yêu cầu của cơ quan có thẩm quyền', per: 1, cap: 5, unitLabel: 'lần' },
  { id: 'IX.5', title: 'Để đơn thư quá hạn xử lý hoặc kiến nghị của cử tri thuộc thẩm quyền không được trả lời trong năm', per: 1, cap: 5, unitLabel: 'trường hợp' },
  { id: 'IX.6', title: 'Tập thể Thường trực HĐND hoặc người đứng đầu bị kỷ luật từ khiển trách trở lên trong năm đánh giá', per: 10, cap: 10, unitLabel: 'trường hợp', sanction: 'noTot', sanctionText: 'Không xếp loại từ mức Tốt trở lên trong năm đánh giá.' },
  { id: 'IX.7', title: 'Cán bộ, công chức thuộc quyền quản lý bị kỷ luật từ cảnh cáo trở lên hoặc bị truy cứu trách nhiệm hình sự', per: 5, cap: 10, unitLabel: 'trường hợp', sanction: 'noXS', sanctionText: 'Không xếp loại Xuất sắc trong năm đánh giá.',
    fixNote: 'Đã chuẩn hóa: cột "Điểm tối đa" của dự thảo ghi −5 nhưng cách chấm ghi "trừ 5,0đ/trường hợp, tối đa trừ 10,0đ". Phần mềm áp mức trần 10,0đ theo cách chấm điểm (nếu để trần 5,0đ thì cụm "tối đa trừ 10,0đ" không có ý nghĩa).' },
  { id: 'IX.8', title: 'Kê khai, cung cấp hồ sơ minh chứng không trung thực nhằm nâng điểm đánh giá', per: 5, cap: 5, unitLabel: 'trường hợp', sanction: 'down1', repeatFlag: true, sanctionText: 'Trừ toàn bộ điểm của tiêu chí liên quan và hạ 01 mức xếp loại; tái phạm thì xếp loại Yếu.' },
] };

// ===========================================================================
//  PHỤ LỤC II — HĐND CẤP XÃ, PHƯỜNG
// ===========================================================================
const G_XA = [
  { code: 'I', max: 20, title: 'TỔ CHỨC KỲ HỌP, BAN HÀNH NGHỊ QUYẾT', items: [
    { id: 'I.1', max: 5, title: 'Tổ chức kỳ họp thường lệ, chuyên đề đúng Luật và Quy chế làm việc', subs: [
      ch('I.1.a', 1.5, 'Tổ chức đủ số kỳ họp thường lệ theo luật định (mức đạt yêu cầu): 1,5đ; thiếu 01 kỳ họp: 0đ và bị trừ điểm tại nhóm IX.', [
        o(1.5, 'Tổ chức đủ số kỳ họp thường lệ theo luật định'),
        o(0, 'Thiếu kỳ họp thường lệ (bị trừ điểm tại nhóm IX)'),
      ]),
      ch('I.1.b', 1.5, 'Điểm chất lượng (cộng thêm, tối đa 1,5đ): chương trình kỳ họp khoa học, điều hành đổi mới, tăng thời gian thảo luận, chất vấn; tài liệu gửi đúng hạn ở 100% kỳ họp.', [
        o(1.5, 'Đạt đầy đủ các yêu cầu về chất lượng kỳ họp'),
        o(0.75, 'Đạt một phần'),
        o(0, 'Chưa đạt'),
      ]),
      ch('I.1.c', 2, 'Tổ chức kịp thời kỳ họp chuyên đề khi phát sinh yêu cầu, đúng trình tự, Quy chế làm việc: 2,0đ; có nội dung cấp bách phải lùi kỳ họp do nguyên nhân chủ quan: 0đ.', [
        o(2, 'Tổ chức kịp thời, đúng trình tự, Quy chế làm việc'),
        o(2, 'Trong năm không phát sinh yêu cầu kỳ họp chuyên đề'),
        o(0, 'Có nội dung cấp bách phải lùi kỳ họp do nguyên nhân chủ quan'),
      ]),
    ] },
    { id: 'I.2', max: 4, title: 'Tài liệu kỳ họp chuẩn bị chu đáo, gửi đại biểu đúng hạn; từng bước thực hiện "kỳ họp không giấy"', subs: [
      ch('I.2.a', 2, 'Gửi đủ tài liệu đúng thời hạn ở 100% kỳ họp: 2,0đ; có kỳ họp chậm: 1,0đ.', [
        o(2, 'Đúng thời hạn ở 100% kỳ họp'), o(1, 'Có kỳ họp gửi chậm'), o(0, 'Chưa đạt'),
      ]),
      ch('I.2.b', 2, 'Tài liệu được số hóa, gửi qua phương thức điện tử từ 70% trở lên: 2,0đ; từ 40% đến dưới 70%: 1,0đ.', [
        o(2, 'Từ 70% trở lên'), o(1, 'Từ 40% đến dưới 70%'), o(0, 'Dưới 40%'),
      ]),
    ] },
    { id: 'I.3', max: 6, title: 'Nghị quyết ban hành đúng thẩm quyền, trình tự, thể thức; không có nghị quyết bị đình chỉ, bãi bỏ, kiến nghị xử lý', subs: [
      ch('I.3.a', 4, 'Không có nghị quyết bị đình chỉ, bãi bỏ, kiến nghị xử lý: 4,0đ; có 01 nghị quyết: 1,5đ; từ 02 trở lên: 0đ (đồng thời bị trừ điểm tại nhóm IX).', [
        o(4, 'Không có nghị quyết bị đình chỉ, bãi bỏ, kiến nghị xử lý'),
        o(1.5, 'Có 01 nghị quyết'),
        o(0, 'Từ 02 nghị quyết trở lên (bị trừ điểm tại nhóm IX)'),
      ]),
      ch('I.3.b', 2, 'Nghị quyết đúng thể thức theo Nghị định số 30/2020/NĐ-CP: 2,0đ.', [
        o(2, 'Đúng thể thức theo Nghị định 30/2020/NĐ-CP'), o(0, 'Còn nghị quyết sai thể thức'),
      ]),
    ] },
    { id: 'I.4', max: 5, title: 'Nghị quyết sát thực tiễn, khả thi; công khai đầy đủ đến Nhân dân (niêm yết, trang thông tin điện tử, nền tảng số)', subs: [
      ch('I.4.a', 3, '100% nghị quyết được công khai đúng hình thức, đúng thời hạn: 3,0đ; công khai chưa đầy đủ: 1,5đ.', [
        o(3, 'Đạt 100%, đúng hình thức và thời hạn'), o(1.5, 'Công khai chưa đầy đủ'), o(0, 'Không công khai'),
      ]),
      ch('I.4.b', 2, 'Nghị quyết được triển khai thực hiện, không phải sửa đổi do không khả thi: 2,0đ.', [
        o(2, 'Không phải sửa đổi do không khả thi'), o(0, 'Có nghị quyết phải sửa đổi do không khả thi'),
      ]),
    ] },
  ] },

  { code: 'II', max: 20, title: 'HOẠT ĐỘNG GIÁM SÁT', items: [
    { id: 'II.1', max: 6, title: 'Ban hành và thực hiện chương trình giám sát năm; hoàn thành ít nhất 02 cuộc giám sát chuyên đề của HĐND, Thường trực, các Ban', subs: [
      ch('II.1.a', 2, 'Ban hành chương trình giám sát năm đúng thời hạn: 2,0đ.', [
        o(2, 'Ban hành đúng thời hạn'), o(0, 'Chậm hoặc chưa ban hành'),
      ]),
      ch('II.1.b', 4, 'Hoàn thành từ 02 cuộc giám sát chuyên đề trở lên: 4,0đ; 01 cuộc: 2,0đ; không tổ chức: 0đ.', [
        o(4, 'Từ 02 cuộc trở lên'), o(2, '01 cuộc'), o(0, 'Không tổ chức'),
      ]),
    ] },
    { id: 'II.2', max: 5, title: 'Tổ chức chất vấn tại kỳ họp; phiên giải trình của Thường trực HĐND khi cần thiết; kết luận rõ trách nhiệm, thời hạn', subs: [
      ch('II.2.a', 3, 'Tổ chức chất vấn tại 100% kỳ họp thường lệ: 3,0đ; có kỳ họp không chất vấn: 1,5đ.', [
        o(3, 'Chất vấn tại 100% kỳ họp thường lệ'), o(1.5, 'Có kỳ họp không chất vấn'), o(0, 'Không tổ chức chất vấn'),
      ]),
      ch('II.2.b', 2, 'Ban hành kết luận chất vấn, giải trình nêu rõ trách nhiệm và thời hạn thực hiện: 2,0đ.', [
        o(2, 'Có kết luận nêu rõ trách nhiệm, thời hạn'), o(0, 'Chưa đạt'),
      ]),
    ] },
    { id: 'II.3', max: 6, title: 'Theo dõi, đôn đốc thực hiện kết luận, kiến nghị sau giám sát; tỷ lệ thực hiện đạt từ 80% trở lên', subs: [
      { id: 'II.3.a', max: 6, type: 'ratio', round: 0.25, unitLabel: 'tỷ lệ kết luận, kiến nghị ĐÃ ĐẾN HẠN được thực hiện',
        guide: 'Điểm = Tỷ lệ % kết luận, kiến nghị đã đến hạn được thực hiện × 6,0 (làm tròn đến 0,25đ). Mẫu số chỉ tính kiến nghị đã đến thời hạn thực hiện; không tính kiến nghị có lộ trình nhiều năm hoặc trường hợp khách quan được Thường trực HĐND tỉnh chấp thuận bằng văn bản. Việc sử dụng sổ, phần mềm theo dõi chấm tại tiêu chí IV.2. Kết quả tự chấm được hậu kiểm xác suất theo quy định.' },
    ] },
    { id: 'II.4', max: 3, title: 'Giám sát việc giải quyết kiến nghị của cử tri, việc thực hiện nghị quyết của HĐND xã, phường', subs: [
      ch('II.4.a', 1.5, 'Tổ chức giám sát việc giải quyết kiến nghị cử tri ít nhất 01 lần/năm: 1,5đ.', [
        o(1.5, 'Có giám sát ≥ 01 lần/năm'), o(0, 'Chưa tổ chức'),
      ]),
      ch('II.4.b', 1.5, 'Giám sát việc thực hiện nghị quyết của HĐND, có báo cáo kết quả: 1,5đ.', [
        o(1.5, 'Có giám sát và báo cáo kết quả'), o(0, 'Chưa thực hiện'),
      ]),
    ] },
  ] },

  { code: 'III', max: 20, title: 'TIẾP XÚC CỬ TRI, TIẾP CÔNG DÂN, XỬ LÝ ĐƠN THƯ', items: [
    { id: 'III.1', max: 5, title: '100% đại biểu tiếp xúc cử tri theo kế hoạch; hình thức linh hoạt, thực chất, gần dân', subs: [
      ch('III.1.a', 3, '100% đại biểu tham gia tiếp xúc cử tri theo kế hoạch: 3,0đ; từ 90% đến dưới 100%: 1,5đ; dưới 90%: 0đ.', [
        o(3, 'Đạt 100%'), o(1.5, 'Từ 90% đến dưới 100%'), o(0, 'Dưới 90%'),
      ]),
      ch('III.1.b', 2, 'Có tổ chức tiếp xúc theo chuyên đề, nhóm đối tượng hoặc tại thôn, tổ dân phố: 2,0đ.', [
        o(2, 'Có tổ chức tiếp xúc chuyên đề/nhóm đối tượng/tại thôn, tổ dân phố'), o(0, 'Chưa tổ chức'),
      ]),
    ] },
    { id: 'III.2', max: 6, title: 'Tổng hợp, phân loại, chuyển kiến nghị cử tri đúng địa chỉ; tỷ lệ kiến nghị được giải quyết, trả lời đúng thời hạn đạt từ 90% trở lên', subs: [
      ch('III.2.a', 2, 'Tổng hợp, phân loại, chuyển kiến nghị đúng thẩm quyền, đúng thời hạn: 2,0đ.', [
        o(2, 'Đúng thẩm quyền, đúng thời hạn'), o(0, 'Chưa đạt'),
      ]),
      ch('III.2.b', 3, 'Tỷ lệ kiến nghị được giải quyết, trả lời đúng thời hạn ≥90%: 3,0đ; 80% đến dưới 90%: 2,0đ; 70% đến dưới 80%: 1,0đ; dưới 70%: 0,5đ. Trường hợp dưới 80% nhưng đã có đôn đốc bằng văn bản, tổ chức giám sát, khảo sát hoặc chất vấn: 2,0đ.', [
        o(3, 'Từ 90% trở lên'), o(2, 'Từ 80% đến dưới 90%'),
        o(2, 'Dưới 80% nhưng đã đôn đốc bằng văn bản / giám sát / chất vấn'),
        o(1, 'Từ 70% đến dưới 80%'), o(0.5, 'Dưới 70%'),
      ]),
      ch('III.2.c', 1, 'Có báo cáo kết quả thẩm tra việc giải quyết kiến nghị cử tri trình kỳ họp: 1,0đ.', [
        o(1, 'Có báo cáo thẩm tra trình kỳ họp'), o(0, 'Chưa có'),
      ]),
    ] },
    { id: 'III.3', max: 6, title: 'Chủ tịch HĐND, đại biểu HĐND tiếp công dân đúng quy định; xử lý, theo dõi kết quả giải quyết đơn thư đúng hạn', subs: [
      { id: 'III.3.a', max: 1.5, type: 'minus', per: 0.5, unitLabel: 'kỳ tiếp công dân còn thiếu',
        guide: 'Tổ chức tiếp công dân đủ số kỳ theo quy định (mức đạt yêu cầu): 1,5đ; thiếu mỗi kỳ trừ 0,5đ.',
        fixNote: 'Đã chuẩn hóa: dự thảo ghi mức đạt yêu cầu 3,0đ và điểm chất lượng cộng thêm tối đa 3,0đ trong cùng một điểm thành phần tối đa 3,0đ. Phần mềm tách thành 1,5đ (đạt yêu cầu) + 1,5đ (chất lượng) — đúng cách viết của tiêu chí I.1 cùng Phụ lục và giữ nguyên tiêu chí III.3 tối đa 6,0đ.' },
      { id: 'III.3.b', max: 1.5, type: 'ratio', round: 0.25,
        unitLabel: 'vụ việc được chỉ đạo, theo dõi giải quyết dứt điểm sau tiếp công dân',
        guide: 'Điểm chất lượng: tỷ lệ vụ việc được chỉ đạo, theo dõi giải quyết dứt điểm sau tiếp công dân (không phát sinh đơn thư lại về cùng nội dung trong 12 tháng). Điểm = Tỷ lệ % × 1,5 (làm tròn 0,25đ). Trong năm không phát sinh vụ việc thì ghi 100% để tính đủ 1,5đ.' },
      ch('III.3.c', 3, '100% đơn thư được xử lý, chuyển đúng thẩm quyền, đúng hạn và theo dõi kết quả: 3,0đ; còn đơn thư quá hạn: 1,5đ.', [
        o(3, 'Đạt 100%'), o(1.5, 'Còn đơn thư quá hạn'), o(0, 'Chưa đạt'),
      ]),
    ] },
    { id: 'III.4', max: 3, title: 'Ứng dụng kênh số (trang thông tin, ứng dụng, mạng xã hội chính thức) tiếp nhận ý kiến, kiến nghị của Nhân dân', subs: [
      ch('III.4.a', 2, 'Có kênh số chính thức đang vận hành để tiếp nhận ý kiến: 2,0đ.', [
        o(2, 'Có kênh số chính thức đang vận hành'), o(0, 'Chưa có'),
      ]),
      ch('III.4.b', 1, 'Có phản hồi, xử lý ý kiến tiếp nhận qua kênh số, có hồ sơ theo dõi: 1,0đ.', [
        o(1, 'Có phản hồi, xử lý và hồ sơ theo dõi'), o(0, 'Chưa đạt'),
      ]),
    ] },
  ] },

  { code: 'IV', max: 15, title: 'CHUYỂN ĐỔI SỐ TRONG HOẠT ĐỘNG', items: [
    { id: 'IV.1', max: 5, title: 'Xử lý văn bản trên môi trường điện tử, ký số; lưu trữ điện tử hồ sơ kỳ họp, nghị quyết của HĐND', subs: [
      ch('IV.1.a', 3, '100% văn bản (trừ văn bản mật) xử lý điện tử, ký số: 3,0đ; từ 90% đến dưới 100%: 1,5đ; dưới 90%: 0đ (không bao gồm Nghị quyết của HĐND cấp xã).', [
        o(3, 'Đạt 100%'), o(1.5, 'Từ 90% đến dưới 100%'), o(0, 'Dưới 90%'),
      ]),
      ch('IV.1.b', 2, 'Hồ sơ kỳ họp, nghị quyết được lưu trữ điện tử, tra cứu được: 2,0đ (việc số hóa tài liệu kỳ họp đã chấm tại I.2, không tính lại).', [
        o(2, 'Lưu trữ điện tử, tra cứu được'), o(0, 'Chưa đạt'),
      ]),
    ] },
    { id: 'IV.2', max: 5, title: 'Sử dụng phần mềm, sổ theo dõi điện tử về kiến nghị cử tri, đơn thư, kết luận giám sát', subs: [
      ch('IV.2.a', 5, 'Sử dụng phần mềm hoặc sổ điện tử cho cả 03 nội dung: 5,0đ; cho 02 nội dung: 3,0đ; cho 01 nội dung: 1,5đ; không sử dụng: 0đ.', [
        o(5, 'Cả 03 nội dung'), o(3, '02 nội dung'), o(1.5, '01 nội dung'), o(0, 'Không sử dụng'),
      ]),
    ] },
    { id: 'IV.3', max: 5, title: 'Tham gia đầy đủ các hội nghị trực tuyến, hệ thống thông tin do tỉnh kết nối; cập nhật dữ liệu theo yêu cầu', subs: [
      { id: 'IV.3.a', max: 2.5, type: 'minus', per: 0.5, unitLabel: 'lần vắng không có lý do',
        guide: 'Tham dự đầy đủ hội nghị trực tuyến do tỉnh tổ chức: 2,5đ; vắng mỗi lần không có lý do trừ 0,5đ.' },
      ch('IV.3.b', 2.5, 'Cập nhật đầy đủ, đúng hạn dữ liệu lên hệ thống của tỉnh: 2,5đ.', [
        o(2.5, 'Đầy đủ, đúng hạn'), o(0, 'Chưa đạt'),
      ]),
    ] },
  ] },

  { code: 'V', max: 10, title: 'ĐỔI MỚI SÁNG TẠO, MÔ HÌNH MỚI, CÁCH LÀM HAY', items: [
    { id: 'V.1', max: 6, title: 'Trong năm có ít nhất 01 mô hình mới, cách làm hay phù hợp thực tiễn, mang lại hiệu quả cụ thể', subs: [
      { id: 'V.1.a', max: 6, type: 'count', per: 3, unitLabel: 'mô hình mới, cách làm hay đã triển khai',
        guide: 'Mỗi mô hình mới, cách làm hay được triển khai thực tế và có báo cáo đánh giá hiệu quả: 3,0đ; tối đa 6,0đ. Mô hình chỉ dừng ở ý tưởng, kế hoạch chưa triển khai: không tính điểm.' },
    ] },
    { id: 'V.2', max: 4, title: 'Mô hình, cách làm hay được duy trì, mở rộng phạm vi áp dụng và có đánh giá hiệu quả bằng số liệu cụ thể', subs: [
      ch('V.2.a', 2.5, 'Mô hình được duy trì từ năm thứ hai trở đi và mở rộng phạm vi áp dụng: 2,5đ.', [
        o(2.5, 'Được duy trì từ năm thứ hai và mở rộng phạm vi'), o(0, 'Chưa đạt'),
      ]),
      ch('V.2.b', 1.5, 'Có báo cáo đánh giá hiệu quả bằng số liệu cụ thể: 1,5đ (nội dung được Thường trực HĐND tỉnh ghi nhận, nhân rộng chấm tại nhóm VIII, không tính lại).', [
        o(1.5, 'Có báo cáo đánh giá hiệu quả bằng số liệu'), o(0, 'Chưa có'),
      ]),
    ] },
  ] },

  { code: 'VI', max: 10, title: 'TỔ CHỨC BỘ MÁY VÀ CHẾ ĐỘ HOẠT ĐỘNG', items: [
    { id: 'VI.1', max: 4, title: 'Thường trực HĐND họp định kỳ hằng tháng; các Ban, Tổ đại biểu hoạt động đúng Quy chế làm việc', subs: [
      { id: 'VI.1.a', max: 1, type: 'minus', per: 0.5, unitLabel: 'phiên họp còn thiếu',
        guide: 'Thường trực HĐND họp đủ 12 phiên/năm, có biên bản, thông báo kết luận (mức đạt yêu cầu): 1,0đ; thiếu mỗi phiên trừ 0,5đ và bị trừ điểm tại nhóm IX.' },
      ch('VI.1.b', 1, 'Điểm chất lượng (cộng thêm): các Ban, Tổ đại biểu hoạt động nền nếp, có sản phẩm cụ thể theo Quy chế: 1,0đ.', [
        o(1, 'Các Ban, Tổ đại biểu hoạt động nền nếp, có sản phẩm cụ thể'), o(0, 'Chưa đạt'),
      ]),
      ch('VI.1.c', 2, 'Các Ban hoàn thành chương trình công tác năm: 2,0đ.', [
        o(2, 'Hoàn thành chương trình công tác năm'), o(0, 'Chưa hoàn thành'),
      ]),
    ] },
    { id: 'VI.2', max: 3, title: 'Đại biểu tham dự đầy đủ kỳ họp, hoạt động của HĐND; hoàn thành chương trình hành động, nhiệm vụ đại biểu', subs: [
      ch('VI.2.a', 2, 'Tỷ lệ đại biểu tham dự bình quân các kỳ họp từ 95% trở lên: 2,0đ; từ 90% đến dưới 95%: 1,0đ; dưới 90%: 0đ.', [
        o(2, 'Từ 95% trở lên'), o(1, 'Từ 90% đến dưới 95%'), o(0, 'Dưới 90%'),
      ]),
      ch('VI.2.b', 1, '100% đại biểu có báo cáo hoạt động năm: 1,0đ.', [
        o(1, '100% đại biểu có báo cáo hoạt động năm'), o(0, 'Chưa đạt'),
      ]),
    ] },
    { id: 'VI.3', max: 3, title: 'Cử đại biểu tham gia đầy đủ các lớp tập huấn, bồi dưỡng do tỉnh tổ chức; chủ động bồi dưỡng kỹ năng tại chỗ', subs: [
      ch('VI.3.a', 2, 'Cử đủ thành phần tham gia 100% lớp tập huấn do tỉnh tổ chức: 2,0đ; từ 70% đến dưới 100%: 1,0đ.', [
        o(2, 'Đủ thành phần, 100% lớp tập huấn'), o(1, 'Từ 70% đến dưới 100%'), o(0, 'Dưới 70%'),
      ]),
      ch('VI.3.b', 1, 'Tổ chức ít nhất 01 hoạt động bồi dưỡng, trao đổi kỹ năng tại chỗ: 1,0đ.', [
        o(1, 'Có ≥ 01 hoạt động bồi dưỡng tại chỗ'), o(0, 'Chưa tổ chức'),
      ]),
    ] },
  ] },

  { code: 'VII', max: 5, title: 'CHẾ ĐỘ THÔNG TIN, BÁO CÁO, PHỐI HỢP VỚI TỈNH', items: [
    { id: 'VII.1', max: 3, title: 'Báo cáo định kỳ, đột xuất với Thường trực HĐND tỉnh đầy đủ, đúng hạn, đúng biểu mẫu (qua hệ thống điện tử)', subs: [
      { id: 'VII.1.a', max: 3, type: 'minus', per: 0.5, unitLabel: 'lần chậm hoặc sai biểu mẫu',
        guide: '100% báo cáo đúng hạn, đúng biểu mẫu: 3,0đ; mỗi lần chậm hoặc sai biểu mẫu trừ 0,5đ (đồng thời bị trừ điểm tại nhóm IX).' },
    ] },
    { id: 'VII.2', max: 2, title: 'Phối hợp, cung cấp thông tin phục vụ hoạt động hướng dẫn, giám sát, khảo sát của HĐND tỉnh trên địa bàn', subs: [
      ch('VII.2.a', 2, 'Phối hợp đầy đủ, cung cấp thông tin đúng yêu cầu và đúng hạn: 2,0đ; chậm hoặc thiếu nội dung: 1,0đ; không phối hợp: 0đ.', [
        o(2, 'Đầy đủ, đúng yêu cầu, đúng hạn'), o(1, 'Chậm hoặc thiếu nội dung'), o(0, 'Không phối hợp'),
      ]),
    ] },
  ] },
];

// Đã chuẩn hóa: 04 nội dung của dự thảo cộng lại 13,0đ trong khi nhóm VIII tối đa 10,0đ.
// Phân bổ lại 4 + 2 + 2 + 2 = 10,0đ, giữ nguyên thứ tự ưu tiên của dự thảo.
const B_XA = { code: 'VIII', max: 10, kind: 'bonus', title: 'ĐIỂM THƯỞNG ĐỔI MỚI SÁNG TẠO (tối đa 10 điểm)', items: [
  { id: 'VIII.1', max: 4, title: 'Mô hình, sáng kiến được nhân rộng toàn tỉnh hoặc được Trung ương, báo chí Trung ương giới thiệu', subs: [
    ch('VIII.1.a', 4, 'Có văn bản của Thường trực HĐND tỉnh chỉ đạo nhân rộng toàn tỉnh hoặc được cơ quan, báo chí Trung ương giới thiệu: 4,0đ. Chỉ tính 01 lần trong năm đánh giá.', [
      o(4, 'Có văn bản nhân rộng toàn tỉnh / được Trung ương, báo chí TW giới thiệu'), o(0, 'Chưa có'),
    ], { fixNote: 'Đã chuẩn hóa: 5,0đ → 4,0đ để tổng 04 nội dung của nhóm VIII đúng bằng 10,0đ.' }),
  ] },
  { id: 'VIII.2', max: 2, title: 'Được biểu dương, khen thưởng về đổi mới, nâng cao chất lượng hoạt động của HĐND', subs: [
    ch('VIII.2.a', 2, 'Được khen thưởng cấp tỉnh trở lên: 2,0đ; được biểu dương tại hội nghị giao ban của tỉnh: 1,0đ. Chỉ tính mức cao nhất đạt được.', [
      o(2, 'Khen thưởng cấp tỉnh trở lên'), o(1, 'Biểu dương tại hội nghị giao ban của tỉnh'), o(0, 'Không có'),
    ], { fixNote: 'Đã chuẩn hóa: 3,0đ → 2,0đ (mức biểu dương 1,5đ → 1,0đ) theo phân bổ lại của nhóm VIII.' }),
  ] },
  { id: 'VIII.3', max: 2, title: 'Có giải pháp số hóa, ứng dụng công nghệ do đơn vị chủ động xây dựng, vận hành hiệu quả', subs: [
    ch('VIII.3.a', 2, 'Giải pháp do đơn vị tự xây dựng, đang vận hành và có đánh giá hiệu quả: 2,0đ; đang thí điểm: 1,0đ. Không tính đối với hệ thống, phần mềm do tỉnh trang bị (đã chấm tại nhóm IV).', [
      o(2, 'Tự xây dựng, đang vận hành, có đánh giá hiệu quả'), o(1, 'Đang thí điểm'), o(0, 'Không có'),
    ]),
  ] },
  { id: 'VIII.4', max: 2, title: 'Ban hành nghị quyết chuyên đề tháo gỡ hiệu quả điểm nghẽn của địa phương, có kết quả chuyển biến cụ thể', subs: [
    { id: 'VIII.4.a', max: 2, type: 'count', per: 1, unitLabel: 'nghị quyết chuyên đề có kết quả đo đếm được',
      guide: 'Mỗi nghị quyết chuyên đề được ban hành đúng thẩm quyền và có sản phẩm, kết quả đo đếm được (giải phóng mặt bằng, sắp xếp đơn vị hành chính, xây dựng nông thôn mới…): 1,0đ; tối đa 2,0đ. Nghị quyết mang tính hình thức, không có kết quả cụ thể: không tính điểm.',
      fixNote: 'Đã chuẩn hóa: 1,5đ/nghị quyết (tối đa 3,0đ) → 1,0đ/nghị quyết (tối đa 2,0đ) theo phân bổ lại của nhóm VIII.' },
  ] },
] };

const D_XA = { code: 'IX', max: 20, kind: 'deduct', title: 'ĐIỂM TRỪ VÀ CHẾ TÀI VI PHẠM (tối đa trừ 20 điểm)', items: [
  { id: 'IX.1', title: 'Nghị quyết bị cơ quan có thẩm quyền kết luận ban hành trái pháp luật, phải đình chỉ, bãi bỏ hoặc sửa đổi', per: 5, cap: 5, unitLabel: 'nghị quyết', sanction: 'noXS', sanctionText: 'Không xếp loại Xuất sắc trong năm đánh giá.' },
  { id: 'IX.2', title: 'Không hoàn thành cuộc giám sát chuyên đề đã ghi trong chương trình giám sát năm mà không có lý do chính đáng', per: 3, cap: 3, unitLabel: 'cuộc giám sát', note: 'Điều chỉnh chương trình giám sát theo nghị quyết của HĐND thì không bị trừ điểm.' },
  { id: 'IX.3', title: 'Chậm gửi báo cáo định kỳ, đột xuất theo yêu cầu của Thường trực HĐND tỉnh', per: 1, cap: 5, unitLabel: 'lần' },
  { id: 'IX.4', title: 'Để phát sinh khiếu kiện đông người, vượt cấp, điểm nóng về an ninh, trật tự mà có trách nhiệm theo dõi, đôn đốc, giám sát của HĐND cấp xã', per: 5, cap: 5, unitLabel: 'vụ việc', note: 'Chỉ trừ điểm khi xác định được yếu tố trách nhiệm của HĐND.' },
  { id: 'IX.5', title: 'Để đơn thư quá hạn xử lý hoặc kiến nghị của cử tri thuộc thẩm quyền không được trả lời trong năm', per: 1, cap: 5, unitLabel: 'trường hợp' },
  { id: 'IX.6', title: 'Không thực hiện hoặc thực hiện không nghiêm chỉ đạo, kết luận, kiến nghị của Thường trực HĐND tỉnh', per: 3, cap: 6, unitLabel: 'lần',
    fixNote: 'Đã chuẩn hóa: cột "Điểm tối đa" của dự thảo ghi −3 nhưng cách chấm ghi "trừ 3,0đ/lần, tối đa trừ 6,0đ". Phần mềm áp mức trần 6,0đ theo cách chấm điểm.' },
  { id: 'IX.7', title: 'Tập thể Thường trực HĐND hoặc Chủ tịch HĐND cấp xã bị kỷ luật từ khiển trách trở lên trong năm đánh giá', per: 10, cap: 10, unitLabel: 'trường hợp', sanction: 'noTot', sanctionText: 'Không xếp loại từ mức Tốt trở lên trong năm đánh giá.' },
  { id: 'IX.8', title: 'Đại biểu HĐND hoặc công chức tham mưu, phục vụ bị kỷ luật từ cảnh cáo trở lên hoặc bị truy cứu trách nhiệm hình sự', per: 5, cap: 10, unitLabel: 'trường hợp', sanction: 'noXS', sanctionText: 'Không xếp loại Xuất sắc trong năm đánh giá.' },
  { id: 'IX.9', title: 'Kê khai, cung cấp hồ sơ minh chứng không trung thực nhằm nâng điểm đánh giá', per: 5, cap: 5, unitLabel: 'trường hợp', sanction: 'down1', repeatFlag: true, sanctionText: 'Trừ toàn bộ điểm của tiêu chí liên quan và hạ 01 mức xếp loại; tái phạm thì xếp loại Yếu.' },
] };

export const KHUNG = {
  tinh: { id: 'tinh', groups: G_TINH, bonus: B_TINH, deduct: D_TINH },
  xa: { id: 'xa', groups: G_XA, bonus: B_XA, deduct: D_XA },
};

// Toàn bộ nhóm (7 nhóm + VIII + IX) của một khung.
export const allGroups = (kindId) => {
  const K = KHUNG[kindId] || KHUNG.xa;
  return [...K.groups, K.bonus, K.deduct];
};
export const kindInfo = (kindId) => TC_KINDS.find((k) => k.id === kindId) || TC_KINDS[1];

// ===========================================================================
//  ĐIỀU KIỆN XẾP LOẠI (Điều 6 của Quyết định)
// ===========================================================================
export const TC_GRADES = [
  { code: 'xuatsac', name: 'Xuất sắc', min: 90, cls: 'emerald' },
  { code: 'tot', name: 'Tốt', min: 80, cls: 'sky' },
  { code: 'kha', name: 'Khá', min: 65, cls: 'amber' },
  { code: 'tb', name: 'Trung bình', min: 50, cls: 'orange' },
  { code: 'yeu', name: 'Yếu', min: -Infinity, cls: 'rose' },
];
export const gradeName = (code) => (TC_GRADES.find((g) => g.code === code) || TC_GRADES[4]).name;
const GRADE_ORDER = ['yeu', 'tb', 'kha', 'tot', 'xuatsac'];

// Tỷ lệ tối đa đơn vị cấp xã được xếp loại Xuất sắc (Điều 6 khoản 2).
export const QUOTA_XUATSAC = 0.25;

// "Điều kiện về đổi mới sáng tạo" (Điều 6) — dự thảo dẫn chiếu Phụ lục nhưng chưa nêu ngưỡng.
// ĐÃ CHUẨN HÓA theo chính câu chữ của nhóm V trong từng Phụ lục:
//   • Cấp tỉnh: "Trong năm có ít nhất 02 mô hình mới, cách làm hay…" → Xuất sắc cần ≥ 02 mô hình;
//   • Cấp xã:  "Trong năm có ít nhất 01 mô hình mới, cách làm hay…"  → Xuất sắc cần ≥ 01 mô hình;
//   • Kèm ngưỡng điểm nhóm V: Xuất sắc ≥ 60%, Tốt ≥ 40% điểm tối đa của nhóm V và có ≥ 01 mô hình.
export const DK_DMST = {
  tinh: { xuatsac: 0.6, tot: 0.4, minModels: 2, modelSub: 'V.1.a' },
  xa: { xuatsac: 0.6, tot: 0.4, minModels: 1, modelSub: 'V.1.a' },
};
export const dkDmstOf = (kindId) => DK_DMST[kindId] || DK_DMST.xa;

// Điều 6 — ĐÃ ĐÁNH SỐ LẠI các khoản (dự thảo có khoản 1, 2 rồi nhảy sang 5, 6).
export const DIEU6 = [
  { k: 1, text: 'Xếp loại theo tổng điểm và điều kiện đổi mới sáng tạo: Xuất sắc ≥ 90 điểm; Tốt từ 80 đến dưới 90; Khá từ 65 đến dưới 80; Trung bình từ 50 đến dưới 65; Yếu dưới 50.' },
  { k: 2, text: 'Cấp xã: số đơn vị xếp loại Xuất sắc không vượt quá 25% tổng số đơn vị được đánh giá của từng nhóm đối tượng; vượt tỷ lệ thì lấy từ tổng điểm cao xuống thấp, bằng điểm thì ưu tiên điểm thưởng nhóm VIII, tiếp đến điểm nhóm V; đơn vị đủ điều kiện nhưng không được chọn thì xem xét xếp loại Tốt.' },
  { k: 3, text: 'Không xếp loại Xuất sắc đối với đơn vị: có nghị quyết bị kết luận ban hành trái pháp luật; có vi phạm bị xử lý trong năm; có cán bộ, công chức, đại biểu thuộc phạm vi quản lý bị kỷ luật từ cảnh cáo trở lên hoặc bị truy cứu trách nhiệm hình sự; địa phương không hoàn thành từ 30% chỉ tiêu kinh tế - xã hội chủ yếu trở lên do nguyên nhân chủ quan mà HĐND không có hoạt động giám sát, chất vấn, giải trình hoặc nghị quyết nhằm tháo gỡ.' },
  { k: 4, text: 'Đơn vị có tập thể Thường trực HĐND hoặc người đứng đầu bị kỷ luật từ khiển trách trở lên trong năm đánh giá thì không được xếp loại từ mức Tốt trở lên.' },
  { k: 5, text: 'Kê khai, cung cấp hồ sơ minh chứng không trung thực nhằm nâng điểm: trừ toàn bộ điểm của tiêu chí liên quan, trừ thêm điểm theo nhóm IX và hạ 01 mức xếp loại; tái phạm thì xếp loại Yếu và đề nghị cấp có thẩm quyền xem xét trách nhiệm người đứng đầu.' },
];

const r2 = (n) => Math.round((Number(n) || 0) * 100) / 100;
const roundTo = (n, step) => Math.round(n / step) * step;
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

// Điểm của một "điểm thành phần" + đã trả lời hay chưa.
export function subScore(sub, a = {}) {
  const t = sub.type || 'choice';
  if (t === 'choice') {
    const i = a.sel;
    if (i == null || !sub.options?.[i]) return { score: 0, answered: false, zeroItem: false };
    const op = sub.options[i];
    return { score: clamp(op.s, 0, sub.max), answered: true, zeroItem: !!op.zeroItem };
  }
  if (t === 'minus') {
    if (a.count == null || a.count === '') return { score: 0, answered: false, zeroItem: false };
    return { score: clamp(sub.max - sub.per * Number(a.count || 0), 0, sub.max), answered: true, zeroItem: false };
  }
  if (t === 'minusPlus') {
    if (a.count == null || a.count === '') return { score: 0, answered: false, zeroItem: false };
    const bonus = ((Number(a.pct) || 0) / 100) * (sub.plus || 0);
    return { score: clamp(roundTo(sub.max - sub.per * Number(a.count || 0) + bonus, 0.25), 0, sub.max), answered: true, zeroItem: false };
  }
  if (t === 'ratio') {
    if (a.pct == null || a.pct === '') return { score: 0, answered: false, zeroItem: false };
    const p = clamp(Number(a.pct) || 0, 0, 100) / 100;
    return { score: clamp(roundTo(p * sub.max, sub.round || 0.25), 0, sub.max), answered: true, zeroItem: false };
  }
  if (t === 'count') {
    if (a.count == null || a.count === '') return { score: 0, answered: false, zeroItem: false };
    return { score: clamp(sub.per * Number(a.count || 0), 0, sub.max), answered: true, zeroItem: false };
  }
  return { score: 0, answered: false, zeroItem: false };
}

// Tính toàn bộ phiếu: điểm từng nhóm, tổng, xếp loại, lý do & chế tài.
export function computeTC(kindId, ans = {}, opts = {}) {
  const K = KHUNG[kindId] || KHUNG.xa;
  const groups = [];
  let base = 0, answered = 0, totalSubs = 0, mainAnswered = 0, mainTotal = 0;

  K.groups.forEach((g) => {
    let gs = 0;
    const items = g.items.map((it) => {
      let s = 0, zero = false;
      const subs = it.subs.map((sb) => {
        totalSubs++; mainTotal++;
        const r = subScore(sb, ans[sb.id] || {});
        if (r.answered) { answered++; mainAnswered++; }
        if (r.zeroItem) zero = true;
        s += r.score;
        return { id: sb.id, score: r.score, answered: r.answered };
      });
      const score = zero ? 0 : clamp(r2(s), 0, it.max);
      gs += score;
      return { id: it.id, score, max: it.max, zero, subs };
    });
    const score = clamp(r2(gs), 0, g.max);
    base += score;
    groups.push({ code: g.code, title: g.title, max: g.max, score, items, kind: 'main' });
  });
  base = r2(base);

  // Nhóm VIII — điểm thưởng
  let bs = 0;
  const bItems = K.bonus.items.map((it) => {
    let s = 0;
    const subs = it.subs.map((sb) => {
      totalSubs++;
      const r = subScore(sb, ans[sb.id] || {});
      if (r.answered) answered++;
      s += r.score;
      return { id: sb.id, score: r.score, answered: r.answered };
    });
    const score = clamp(r2(s), 0, it.max);
    bs += score;
    return { id: it.id, score, max: it.max, subs };
  });
  const bonus = clamp(r2(bs), 0, K.bonus.max);
  groups.push({ code: K.bonus.code, title: K.bonus.title, max: K.bonus.max, score: bonus, items: bItems, kind: 'bonus' });

  // Nhóm IX — điểm trừ & chế tài
  let ds = 0;
  const caps = { noXS: false, noTot: false, down1: false, forceYeu: false };
  const sanctions = [];
  const dItems = K.deduct.items.map((it) => {
    const a = ans[it.id] || {};
    const n = Number(a.count || 0);
    const minus = n > 0 ? Math.min(it.cap, it.per * n) : 0;
    ds += minus;
    if (n > 0 && it.sanction) {
      caps[it.sanction] = true;
      sanctions.push(`${it.id}: ${it.sanctionText || ''}`);
      if (it.repeatFlag && a.repeat) { caps.forceYeu = true; sanctions.push(`${it.id}: Tái phạm → xếp loại Yếu.`); }
    }
    return { id: it.id, count: n, minus: r2(minus), max: it.cap };
  });
  const deduct = clamp(r2(ds), 0, K.deduct.max);
  groups.push({ code: K.deduct.code, title: K.deduct.title, max: K.deduct.max, score: -deduct, items: dItems, kind: 'deduct' });

  // Điều 6 khoản 1 điểm d) — địa phương không hoàn thành ≥30% chỉ tiêu KT-XH chủ yếu do
  // nguyên nhân chủ quan mà HĐND không có giám sát, chất vấn, giải trình, nghị quyết tháo gỡ.
  if (ans.__flags?.ktxh) { caps.noXS = true; sanctions.push('Điều 6.1.d: Địa phương không hoàn thành từ 30% chỉ tiêu KT-XH chủ yếu do nguyên nhân chủ quan mà HĐND không có hoạt động tháo gỡ → không xếp loại Xuất sắc.'); }

  const total = clamp(r2(base + bonus - deduct), 0, 110);

  // Xếp loại theo tổng điểm
  let idx = GRADE_ORDER.indexOf((TC_GRADES.find((g) => total >= g.min) || TC_GRADES[4]).code);
  const reasons = [];
  const gV = groups.find((g) => g.code === 'V');
  const dmstRate = gV && gV.max ? gV.score / gV.max : 0;
  const dk = { ...dkDmstOf(kindId), ...(opts.dkDmst || {}) };
  const models = Number((ans[dk.modelSub] || {}).count || 0); // số mô hình mới, cách làm hay (V.1)
  if (idx === 4 && (dmstRate < dk.xuatsac || models < dk.minModels)) {
    idx = 3;
    reasons.push(`Chưa đáp ứng điều kiện đổi mới sáng tạo để xếp loại Xuất sắc: cần điểm nhóm V ≥ ${Math.round(dk.xuatsac * 100)}% (hiện ${Math.round(dmstRate * 100)}% = ${r2(gV.score)}/${gV.max}) và có ít nhất ${dk.minModels} mô hình mới, cách làm hay (hiện ${models}).`);
  }
  if (idx === 3 && (dmstRate < dk.tot || models < 1)) {
    idx = 2;
    reasons.push(`Chưa đáp ứng điều kiện đổi mới sáng tạo để xếp loại Tốt: cần điểm nhóm V ≥ ${Math.round(dk.tot * 100)}% (hiện ${Math.round(dmstRate * 100)}%) và có ít nhất 01 mô hình mới, cách làm hay (hiện ${models}).`);
  }
  if (caps.noXS && idx === 4) { idx = 3; reasons.push('Có vi phạm thuộc trường hợp KHÔNG xếp loại Xuất sắc (Điều 6).'); }
  if (caps.noTot && idx > 2) { idx = 2; reasons.push('Tập thể Thường trực/người đứng đầu bị kỷ luật từ khiển trách trở lên → không xếp loại từ mức Tốt trở lên.'); }
  if (caps.down1 && idx > 0) { idx -= 1; reasons.push('Kê khai, cung cấp hồ sơ minh chứng không trung thực → hạ 01 mức xếp loại.'); }
  if (caps.forceYeu) { idx = 0; reasons.push('Tái phạm kê khai không trung thực → xếp loại Yếu.'); }

  const grade = GRADE_ORDER[idx];
  return {
    kind: kindId, groups, base, bonus, deduct, total,
    grade, gradeName: gradeName(grade), reasons, sanctions, caps,
    dmstRate: r2(dmstRate * 100), models, dk,
    // Tiến độ khai báo tính trên 07 nhóm tiêu chí bắt buộc; nhóm VIII (thưởng) và
    // nhóm IX (trừ) chỉ khai khi có phát sinh nên không đưa vào mẫu số.
    answered, totalSubs, progress: mainTotal ? Math.round((mainAnswered / mainTotal) * 100) : 0,
  };
}

// Áp trần 25% Xuất sắc cho cấp xã (Điều 6 khoản 2): chọn theo tổng điểm từ cao xuống thấp,
// bằng điểm thì ưu tiên điểm thưởng nhóm VIII cao hơn, tiếp đến điểm nhóm V.
// rows: [{ id, total, bonus, groupV, grade }] → trả về { picked: Set(id), limit, over: [] }
export function applyQuotaXuatSac(rows, ratio = QUOTA_XUATSAC) {
  const limit = Math.floor(rows.length * ratio);
  const cand = rows.filter((r) => r.grade === 'xuatsac').sort((a, b) =>
    (b.total - a.total) || (b.bonus - a.bonus) || (b.groupV - a.groupV) || String(a.id).localeCompare(String(b.id)));
  const picked = new Set(cand.slice(0, limit).map((r) => r.id));
  const over = cand.slice(limit).map((r) => r.id); // đủ điều kiện nhưng vượt tỷ lệ → xếp loại Tốt
  return { picked, over, limit, candidates: cand.length };
}

// Những chỗ CHƯA NHẤT QUÁN trong dự thảo đã được CHUẨN HÓA trong phần mềm.
// Hiển thị công khai trong module để cơ quan soạn thảo đưa vào bản trình ký chính thức.
export const FIX_NOTES = [
  { kind: 'xa', where: 'Phụ lục II — III.3 (tiếp công dân)',
    was: 'Điểm thành phần thứ nhất vừa ghi "mức đạt yêu cầu 3,0đ" vừa ghi "điểm chất lượng cộng thêm tối đa 3,0đ", trong khi cột Điểm thành phần tối đa chỉ 3,0đ và tiêu chí tối đa 6,0đ (cộng đủ sẽ thành 9,0đ).',
    now: 'Tách thành 02 điểm thành phần: III.3.a tiếp công dân đủ số kỳ 1,5đ (thiếu mỗi kỳ trừ 0,5đ) + III.3.b điểm chất lượng = tỷ lệ % × 1,5đ; giữ III.3.c đơn thư 3,0đ. Tiêu chí III.3 vẫn đúng 6,0đ và theo đúng cách viết của tiêu chí I.1 cùng Phụ lục.' },
  { kind: 'xa', where: 'Phụ lục II — nhóm VIII (điểm thưởng)',
    was: '04 nội dung cộng lại 13,0đ (5 + 3 + 2 + 3) trong khi nhóm VIII tối đa 10,0đ.',
    now: 'Phân bổ lại đúng 10,0đ: VIII.1 = 4,0đ · VIII.2 = 2,0đ (biểu dương 1,0đ) · VIII.3 = 2,0đ · VIII.4 = 2,0đ (1,0đ/nghị quyết chuyên đề). Giữ nguyên thứ tự ưu tiên của dự thảo.' },
  { kind: 'tinh', where: 'Phụ lục I — IX.7 (cán bộ bị kỷ luật)',
    was: 'Cột "Điểm tối đa" ghi −5 nhưng cách chấm ghi "trừ 5,0đ/trường hợp, tối đa trừ 10,0đ".',
    now: 'Thống nhất theo cách chấm điểm: trừ 5,0đ/trường hợp, tối đa trừ 10,0đ (nếu để trần 5,0đ thì cụm "tối đa trừ 10,0đ" không có ý nghĩa). Đề nghị sửa cột Điểm tối đa thành −10.' },
  { kind: 'xa', where: 'Phụ lục II — IX.6 (không thực hiện chỉ đạo)',
    was: 'Cột "Điểm tối đa" ghi −3 nhưng cách chấm ghi "trừ 3,0đ/lần, tối đa trừ 6,0đ".',
    now: 'Thống nhất theo cách chấm điểm: trừ 3,0đ/lần, tối đa trừ 6,0đ. Đề nghị sửa cột Điểm tối đa thành −6.' },
  { kind: 'both', where: 'Điều 6 — điều kiện đổi mới sáng tạo',
    was: 'Xếp loại Xuất sắc, Tốt yêu cầu "đáp ứng điều kiện về đổi mới sáng tạo theo quy định" nhưng Phụ lục không nêu ngưỡng cụ thể nào.',
    now: 'Lượng hóa theo chính câu chữ của nhóm V: Xuất sắc cần điểm nhóm V ≥ 60% điểm tối đa VÀ có ít nhất 02 mô hình mới, cách làm hay (cấp tỉnh) / 01 mô hình (cấp xã); Tốt cần điểm nhóm V ≥ 40% VÀ có ít nhất 01 mô hình. Phần mềm hiển thị rõ chỉ số này trên phiếu.' },
  { kind: 'both', where: 'Điều 6 — số thứ tự khoản',
    was: 'Sau khoản 1, 2 thì dự thảo nhảy sang khoản 5, 6 (thiếu khoản 3, 4).',
    now: 'Đánh số lại liền mạch 5 khoản: (1) mức xếp loại theo điểm; (2) trần 25% Xuất sắc của cấp xã; (3) các trường hợp không xếp loại Xuất sắc; (4) kỷ luật người đứng đầu → không từ Tốt trở lên; (5) kê khai không trung thực → hạ mức, tái phạm xếp loại Yếu.' },
];
