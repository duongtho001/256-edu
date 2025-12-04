
export interface SubjectCategory {
  id: string;
  name: string;
  topics: string[];
}

export interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
  description: string;
}

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: 'default',
    name: 'Mặc định (Hài hòa)',
    colors: ['#FCA5A5', '#FDBA74', '#FDE047', '#86EFAC', '#93C5FD', '#C4B5FD'],
    description: 'Màu pastel hài hòa, đa dạng, nhẹ nhàng, tạo cảm giác thân thiện'
  },
  {
    id: 'warm',
    name: 'Ấm áp (Warm)',
    colors: ['#FDBA74', '#FDA4AF', '#FDE047'],
    description: 'Tông màu pastel ấm áp chủ đạo (cam nhạt, hồng phấn, vàng kem), tạo cảm giác năng động, tích cực'
  },
  {
    id: 'cool',
    name: 'Mát mẻ (Cool)',
    colors: ['#93C5FD', '#86EFAC', '#C4B5FD'],
    description: 'Tông màu pastel mát mẻ chủ đạo (xanh dương nhạt, xanh bạc hà, tím lavender), tạo cảm giác thông minh, bình tĩnh'
  },
  {
    id: 'nature',
    name: 'Thiên nhiên (Nature)',
    colors: ['#A7F3D0', '#D1D5DB', '#E5E7EB', '#BEF264'],
    description: 'Tông màu pastel thiên nhiên, trung tính (xanh rêu nhạt, màu be, xám khói), tạo cảm giác bền vững, thực tế'
  },
  {
    id: 'modern',
    name: 'Hiện đại (Modern)',
    colors: ['#F9A8D4', '#DDD6FE', '#2DD4BF'],
    description: 'Tông màu pastel hiện đại, tương phản nhẹ (hồng, tím nhạt, xanh ngọc), tạo cảm giác sáng tạo, đổi mới'
  }
];

export const SUBJECT_DATA: SubjectCategory[] = [
  {
    id: "math",
    name: "Toán",
    topics: [
      "Hàm số bậc nhất", "Hàm số bậc hai", "Hệ phương trình", "Bất phương trình", "Phân số",
      "Thống kê", "Xác suất cơ bản", "Định lý Pythagoras", "Góc và đường tròn", "Chu vi – diện tích",
      "Đồ thị hàm số", "Biến đổi biểu thức", "Căn bậc hai", "Số thực", "Trục số", "Dãy số",
      "Tỉ lệ thức", "Tam giác đồng dạng", "Định lý Talet", "Hình hộp chữ nhật", "Hình chóp",
      "Tọa độ Oxy", "Vector", "Phép tịnh tiến", "Phép quay", "Phép vị tự", "Hình nón – hình trụ",
      "Phép đối xứng", "Giải tam giác", "Tỉ số lượng giác", "Hình bình hành", "BCNN – ƯCLN",
      "Hình thang", "Phân tích đa thức", "Phép chia có dư", "Hàm đặc trưng", "Số nguyên tố",
      "Phép nhân – chia số lớn", "Bảng giá trị hàm số"
    ]
  },
  {
    id: "physics",
    name: "Vật lý",
    topics: [
      "Chuyển động thẳng", "Vận tốc", "Lực ma sát", "Lực đàn hồi", "Định luật Hooke",
      "Áp suất chất lỏng", "Máy cơ đơn giản", "Nhiệt lượng", "Định luật bảo toàn cơ năng",
      "Dòng điện không đổi", "Điện trở", "Định luật Ôm", "Công suất điện", "Tác dụng nhiệt của dòng điện",
      "Nam châm – từ trường", "Cảm ứng điện từ", "Sóng âm", "Độ to của âm", "Phản xạ ánh sáng",
      "Khúc xạ ánh sáng", "Thấu kính hội tụ", "Thấu kính phân kỳ", "Ảnh của vật qua thấu kính",
      "Giao thoa ánh sáng", "Sóng cơ", "Cộng hưởng", "Ánh sáng trắng – lăng kính", "Tĩnh điện",
      "Nhiễm điện", "Điện trường", "Áp suất khí quyển", "Sự nở vì nhiệt", "Định luật bảo toàn động lượng",
      "Cơ năng", "Động năng", "Thế năng", "Pin và acquy", "Điện xoay chiều cơ bản"
    ]
  },
  {
    id: "chemistry",
    name: "Hóa học",
    topics: [
      "Nguyên tử và phân tử", "Liên kết ion", "Liên kết cộng hóa trị", "Phản ứng oxi hoá – khử",
      "Dung dịch – nồng độ", "Axit – bazơ – muối", "pH – thang pH", "Phản ứng trao đổi",
      "Phản ứng phân hủy", "Phản ứng thế", "Hiđrocacbon", "Ankan", "Anken", "Ankin", "Ancol",
      "Axit cacboxylic", "Este", "Amin", "Protein", "Tinh bột – đường", "Tốc độ phản ứng",
      "Cân bằng hóa học", "Điện phân", "Ăn mòn kim loại", "Hợp kim", "Dung môi hữu cơ", "Polime",
      "Nitơ – amoniac", "Photpho", "Lưu huỳnh", "Clo", "Kim loại kiềm", "Kim loại kiềm thổ",
      "Kim loại chuyển tiếp", "Hóa học xanh", "Ứng dụng hóa học trong đời sống"
    ]
  },
  {
    id: "biology",
    name: "Sinh học",
    topics: [
      "Tế bào", "Màng sinh chất", "Nhân tế bào", "Hô hấp tế bào", "Quang hợp", "Tiêu hóa",
      "Tuần hoàn", "Hô hấp", "Bài tiết", "Thần kinh", "Sinh trưởng – phát triển",
      "Sinh sản hữu tính", "Sinh sản vô tính", "Di truyền Menđen", "ADN và gen", "Đột biến gen",
      "Đột biến NST", "Quần thể sinh vật", "Quần xã sinh vật", "Hệ sinh thái", "Chuỗi thức ăn",
      "Lưới thức ăn", "Nấm", "Vi khuẩn", "Virus", "Miễn dịch", "Tiến hóa", "Chọn lọc tự nhiên",
      "Đa dạng sinh học", "Bảo vệ môi trường", "Nội tiết tố", "Cảm ứng ở thực vật", "Hành vi động vật"
    ]
  },
  {
    id: "literature",
    name: "Ngữ văn",
    topics: [
      "Biện pháp tu từ", "Thơ trữ tình", "Tự sự", "Nghị luận xã hội", "Nghị luận văn học",
      "Nhân vật trong truyện", "Ngôi kể", "Cốt truyện", "Chi tiết nghệ thuật", "Phong cách ngôn ngữ",
      "Thao tác lập luận", "Viết đoạn văn", "Phân tích tác phẩm", "Thông điệp nghệ thuật",
      "Hình ảnh thơ", "Nhịp điệu thơ", "Từ tượng hình – tượng thanh", "Giọng điệu văn bản"
    ]
  },
  {
    id: "history",
    name: "Lịch sử",
    topics: [
      "Cách mạng tháng Tám", "Điện Biên Phủ", "Khởi nghĩa Hai Bà Trưng", "Nhà Trần – kháng chiến Mông Nguyên",
      "Thời Lý – phát triển văn hóa", "Thời Lê sơ", "Phong trào Tây Sơn", "1945–1954",
      "1954–1975", "Các cuộc kháng chiến chống Pháp", "Phong trào Duy Tân", "Đảng Cộng sản Việt Nam ra đời",
      "Cuộc khai thác thuộc địa", "Cải cách ruộng đất", "Hội nghị Genève"
    ]
  },
  {
    id: "geography",
    name: "Địa lý",
    topics: [
      "Chu trình nước", "Cấu tạo Trái Đất", "Các đới khí hậu", "Mưa đối lưu – mưa orographic",
      "Biển và đại dương", "Địa hình Việt Nam", "Khí hậu Việt Nam", "Dân số – phân bố dân cư",
      "Tài nguyên thiên nhiên", "Đô thị hóa", "Sông – hồ", "Thảm thực vật", "Biến đổi khí hậu",
      "Bản đồ – ký hiệu bản đồ"
    ]
  },
  {
    id: "english",
    name: "Tiếng Anh",
    topics: [
      "Hiện tại đơn", "Hiện tại tiếp diễn", "Hiện tại hoàn thành", "Quá khứ đơn",
      "Quá khứ tiếp diễn", "Tương lai đơn", "Câu điều kiện loại 1", "Câu điều kiện loại 2",
      "Phrasal verbs", "Tính từ – trạng từ", "So sánh hơn – nhất", "Câu bị động", "Câu gián tiếp",
      "Mệnh đề quan hệ"
    ]
  },
  {
    id: "it",
    name: "Tin học",
    topics: [
      "An toàn Internet", "Cấu trúc thư mục", "Soạn thảo văn bản", "Trình chiếu", "Bảo mật mật khẩu",
      "Gõ 10 ngón", "Kiến thức phần cứng", "Lưu trữ dữ liệu", "Tìm kiếm thông tin", "AI cơ bản"
    ]
  },
  {
    id: "tech",
    name: "Công nghệ",
    topics: [
      "Quy trình thiết kế kỹ thuật", "An toàn điện", "Chăm sóc cây trồng", "Kĩ thuật nấu ăn",
      "Kĩ thuật cắt gọt", "Công cụ gia đình", "Bảo trì nhà cửa", "Kĩ thuật trồng rau"
    ]
  },
  {
    id: "gdcd",
    name: "GDCD",
    topics: [
      "Quyền trẻ em", "Bình đẳng giới", "Ứng xử văn minh", "An toàn giao thông",
      "Trách nhiệm công dân", "Tôn trọng sự khác biệt", "Tinh thần đoàn kết", "Tự giác – kỷ luật"
    ]
  },
  {
    id: "lifeskills",
    name: "Kỹ năng sống",
    topics: [
      "Quản lý cảm xúc", "Làm việc nhóm", "Giao tiếp hiệu quả", "Giải quyết vấn đề",
      "Tư duy phản biện", "Ra quyết định", "Thuyết trình", "Quản lý thời gian", "Tự học",
      "Đặt mục tiêu", "Kiểm soát căng thẳng", "Xây dựng thói quen tốt", "Kỹ năng lắng nghe",
      "Kỹ năng đặt câu hỏi", "Động lực học tập"
    ]
  },
  {
    id: "survival",
    name: "Kỹ năng sinh tồn",
    topics: [
      "Thoát hiểm khi cháy", "Ở nhà một mình an toàn", "Sơ cứu vết thương nhẹ", "Sinh tồn trong rừng",
      "Tạo tín hiệu cứu hộ", "An toàn khi gặp nước sâu", "Ứng phó thiên tai", "An toàn ngoài đường"
    ]
  }
];

export const TEMPLATE_INTRO = "Tạo một infographic giáo dục chi tiết, phong cách pastel nhẹ nhàng, trình bày rõ ràng dành cho học sinh THCS/THPT về chủ đề";
export const TEMPLATE_OUTRO = "Kèm icon minh họa dễ hiểu, màu pastel hài hòa, bố cục 4–6 khung nội dung giúp ghi nhớ lâu.";

export const TEMPLATE_STEPS = [
  "Khái niệm quan trọng của '{topic}'",
  "Giải thích chi tiết bản chất, quy luật hoặc nội dung trọng tâm",
  "Các bước thực hiện / quy trình / sơ đồ (nếu có)",
  "Ví dụ minh họa thực tế, gắn với đời sống học sinh",
  "Ứng dụng – ý nghĩa trong học tập hoặc cuộc sống"
];
