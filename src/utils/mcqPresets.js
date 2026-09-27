// Presets câu hỏi trắc nghiệm 4 đáp án (A, B, C, D) dành cho Shorts/TikTok

export const MCQ_PRESETS = [
  {
    "id": "player-guess",
    "name": "⚽ Video Nhìn Ảnh Đoán Tên Cầu Thủ (Ô Chữ Hiển Thị Kèm Giọng Đọc)",
    "description": "Giao diện Video Shorts 9:16 Đoán Tên Cầu Thủ Bóng Đá: Hiện hình ảnh đố kèm giọng đọc 'Đây là cầu thủ nào?', ô chữ ban đầu hiện ký tự đầu tiên của từng từ (ví dụ C________ R______) trong 3s đếm ngược, sau 3s mở toàn bộ ô chữ kèm thông tin huyền thoại bóng đá!",
    "badge": "ĐOÁN CẦU THỦ",
    "mode": "player-guess",
    "guessTime": 3,
    "readAnswer": false,
    "sampleFiles": [
      { "name": "mau_nhin_anh_doan_cau_thu.json", "label": "⚽ Mẫu JSON Nhìn Ảnh Đoán Cầu Thủ", "type": "json" },
      { "name": "mau_nhin_anh_doan_cau_thu.csv", "label": "⚽ Mẫu CSV Nhìn Ảnh Đoán Cầu Thủ", "type": "csv" }
    ],
    "sets": [
      {
        "name": "⚽ Bộ 1: Huyền Thoại Bóng Đá Thế Giới",
        "topic": "⚽ ĐOÁN CẦU THỦ",
        "fromFlag": "⚽",
        "toFlag": "🏆",
        "headerTitle": "ĐÂY LÀ CẦU THỦ NÀO?",
        "mode": "player-guess",
        "guessTime": 3,
        "questions": [
          {
            "id": "player-cr7",
            "question": "Đây là cầu thủ nào?",
            "word": "Cristiano Ronaldo",
            "player": "Cristiano Ronaldo",
            "optionA": "Cristiano Ronaldo",
            "image": "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=1200&q=80",
            "explanation": "Cristiano Ronaldo 🇵🇹 (CR7 - Siêu sao sở hữu 5 Quả bóng vàng & hơn 800 bàn thắng)",
            "mode": "player-guess"
          },
          {
            "id": "player-messi",
            "question": "Đây là cầu thủ nào?",
            "word": "Lionel Messi",
            "player": "Lionel Messi",
            "optionA": "Lionel Messi",
            "image": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&q=80",
            "explanation": "Lionel Messi 🇦🇷 (El Pulga - Huyền thoại Argentina vô địch World Cup 2022 & 8 Quả bóng vàng)",
            "mode": "player-guess"
          },
          {
            "id": "player-mbappe",
            "question": "Đây là cầu thủ nào?",
            "word": "Kylian Mbappe",
            "player": "Kylian Mbappe",
            "optionA": "Kylian Mbappe",
            "image": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80",
            "explanation": "Kylian Mbappé 🇫🇷 (Ninja Rùa - Vua phá lưới World Cup 2022 & siêu sao nước Pháp)",
            "mode": "player-guess"
          },
          {
            "id": "player-haaland",
            "question": "Đây là cầu thủ nào?",
            "word": "Erling Haaland",
            "player": "Erling Haaland",
            "optionA": "Erling Haaland",
            "image": "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=1200&q=80",
            "explanation": "Erling Haaland 🇳🇴 (Cỗ máy ghi bàn Na Uy phá vô số kỷ lục Premier League)",
            "mode": "player-guess"
          },
          {
            "id": "player-neymar",
            "question": "Đây là cầu thủ nào?",
            "word": "Neymar Jr",
            "player": "Neymar Jr",
            "optionA": "Neymar Jr",
            "image": "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=1200&q=80",
            "explanation": "Neymar Jr 🇧🇷 (Vũ công Samba - Chân sút vĩ đại bậc nhất lịch sử ĐT Brazil)",
            "mode": "player-guess"
          }
        ]
      },
      {
        "name": "🏆 Bộ 2: Quả Bóng Vàng & Ngôi Sao Đương Đại",
        "topic": "⚽ ĐOÁN CẦU THỦ",
        "fromFlag": "⚽",
        "toFlag": "🏆",
        "headerTitle": "ĐÂY LÀ CẦU THỦ NÀO?",
        "mode": "player-guess",
        "guessTime": 3,
        "questions": [
          {
            "id": "player-benzema",
            "question": "Đây là cầu thủ nào?",
            "word": "Karim Benzema",
            "player": "Karim Benzema",
            "optionA": "Karim Benzema",
            "image": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&q=80",
            "explanation": "Karim Benzema 🇫🇷 (Chủ nhân Quả bóng vàng 2022 & cựu thủ lĩnh Real Madrid)",
            "mode": "player-guess"
          },
          {
            "id": "player-modric",
            "question": "Đây là cầu thủ nào?",
            "word": "Luka Modric",
            "player": "Luka Modric",
            "optionA": "Luka Modric",
            "image": "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=1200&q=80",
            "explanation": "Luka Modrić 🇭🇷 (Nhạc trưởng Croatia giành Quả bóng vàng 2018 & 6 cúp C1)",
            "mode": "player-guess"
          },
          {
            "id": "player-kdb",
            "question": "Đây là cầu thủ nào?",
            "word": "Kevin De Bruyne",
            "player": "Kevin De Bruyne",
            "optionA": "Kevin De Bruyne",
            "image": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200&q=80",
            "explanation": "Kevin De Bruyne 🇧🇪 (Vua kiến tạo Bỉ - Tiền vệ hàng đầu thế giới của Manchester City)",
            "mode": "player-guess"
          },
          {
            "id": "player-bellingham",
            "question": "Đây là cầu thủ nào?",
            "word": "Jude Bellingham",
            "player": "Jude Bellingham",
            "optionA": "Jude Bellingham",
            "image": "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=1200&q=80",
            "explanation": "Jude Bellingham 🏴󠁧󠁢󠁥󠁮󠁧󠁿 (Thần đồng nước Anh khoác áo số 5 tại Real Madrid)",
            "mode": "player-guess"
          },
          {
            "id": "player-kane",
            "question": "Đây là cầu thủ nào?",
            "word": "Harry Kane",
            "player": "Harry Kane",
            "optionA": "Harry Kane",
            "image": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&q=80",
            "explanation": "Harry Kane 🏴󠁧󠁢󠁥󠁮󠁧󠁿 (Đội trưởng tuyển Anh & chân sút vĩ đại của Bayern Munich)",
            "mode": "player-guess"
          }
        ]
      }
    ]
  },
  {
    "id": "dia-ly-van-hoa-viet-nam",
    "name": "🇻🇳 Video Trắc Nghiệm Địa Lý & Văn Hóa Việt Nam (Ảnh Nền Unsplash HD)",
    "description": "Dạng Video Trắc Nghiệm 4 đáp án (A, B, C, D) chủ đề Địa Lý & Văn Hóa Việt Nam: Giọng đọc Tiếng Việt đọc câu hỏi, thanh tiến trình 3 giây chạy đếm ngược mượt mà trên nền ảnh đẹp Unsplash, sau 3s tự động công bố đáp án đúng (không cần đọc lại đáp án).",
    "badge": "ĐỊA LÝ & VĂN HÓA VIỆT NAM",
    "mode": "vocab-b1-tiktok",
    "guessTime": 3,
    "readAnswer": false,
    "sampleFiles": [
      { "name": "mau_trac_nghiem_dia_ly_van_hoa_viet_nam.json", "label": "🇻🇳 Mẫu JSON Địa Lý & Văn Hóa Việt Nam", "type": "json" },
      { "name": "mau_trac_nghiem_dia_ly_van_hoa_viet_nam.csv", "label": "🇻🇳 Mẫu CSV Địa Lý & Văn Hóa Việt Nam", "type": "csv" }
    ],
    "sets": [
      {
        "name": "🇻🇳 Bộ 1: Danh Lam Thắng Cảnh & Kỳ Quan Thiên Nhiên",
        "topic": "ĐỊA LÝ & VĂN HÓA VN",
        "fromFlag": "🇻🇳",
        "toFlag": "🇻🇳",
        "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
        "mode": "vocab-b1-tiktok",
        "questions": [
          {
            "question": "Vịnh Hạ Long - Di sản Thiên nhiên Thế giới thuộc tỉnh nào của Việt Nam?",
            "topic": "ĐỊA LÝ & VĂN HÓA VN",
            "fromFlag": "🇻🇳",
            "toFlag": "🇻🇳",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "optionA": "Hải Phòng",
            "optionB": "Quảng Ninh",
            "optionC": "Ninh Bình",
            "optionD": "Quảng Bình",
            "correctOption": "B",
            "explanation": "Đáp án B: Vịnh Hạ Long thuộc tỉnh Quảng Ninh, nổi tiếng với hàng nghìn đảo đá vôi kỳ vĩ!",
            "image": "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Hang động tự nhiên lớn nhất thế giới Sơn Đoòng nằm ở tỉnh nào?",
            "topic": "ĐỊA LÝ & VĂN HÓA VN",
            "fromFlag": "🇻🇳",
            "toFlag": "🇻🇳",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "optionA": "Quảng Bình",
            "optionB": "Hà Giang",
            "optionC": "Lào Cai",
            "optionD": "Cao Bằng",
            "correctOption": "A",
            "explanation": "Đáp án A: Hang Sơn Đoòng thuộc Vườn quốc gia Phong Nha - Kẻ Bàng, tỉnh Quảng Bình!",
            "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Ngọn núi Fansipan - Nóc nhà Đông Dương có độ cao bao nhiêu mét?",
            "topic": "ĐỊA LÝ & VĂN HÓA VN",
            "fromFlag": "🇻🇳",
            "toFlag": "🇻🇳",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "optionA": "2.980m",
            "optionB": "3.143m",
            "optionC": "3.250m",
            "optionD": "3.049m",
            "correctOption": "B",
            "explanation": "Đáp án B: Đỉnh Fansipan thuộc dãy Hoàng Liên Sơn, cao 3.143m so với mực nước biển!",
            "image": "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&q=80",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Thác nước tự nhiên lớn nhất Việt Nam nằm ở biên giới Việt - Trung tên là gì?",
            "topic": "ĐỊA LÝ & VĂN HÓA VN",
            "fromFlag": "🇻🇳",
            "toFlag": "🇻🇳",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "optionA": "Thác Cam Ly",
            "optionB": "Thác Bản Giốc",
            "optionC": "Thác Dambri",
            "optionD": "Thác Dray Nur",
            "correctOption": "B",
            "explanation": "Đáp án B: Thác Bản Giốc thuộc tỉnh Cao Bằng, một trong những thác nước biên giới đẹp nhất thế giới!",
            "image": "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=1200&q=80",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Đảo nào có diện tích lớn nhất Việt Nam, được mệnh danh là Đảo Ngọc?",
            "topic": "ĐỊA LÝ & VĂN HÓA VN",
            "fromFlag": "🇻🇳",
            "toFlag": "🇻🇳",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "optionA": "Côn Đảo",
            "optionB": "Đảo Lý Sơn",
            "optionC": "Đảo Phú Quốc",
            "optionD": "Đảo Cát Bà",
            "correctOption": "C",
            "explanation": "Đáp án C: Đảo Phú Quốc thuộc tỉnh Kiên Giang là hòn đảo lớn nhất Việt Nam với bờ biển tuyệt đẹp!",
            "image": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=80",
            "mode": "vocab-b1-tiktok"
          }
        ]
      },
      {
        "name": "🏛️ Bộ 2: Di Sản Văn Hóa & Di Tích Lịch Sử",
        "topic": "ĐỊA LÝ & VĂN HÓA VN",
        "fromFlag": "🇻🇳",
        "toFlag": "🇻🇳",
        "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
        "mode": "vocab-b1-tiktok",
        "questions": [
          {
            "question": "Phố cổ Hội An - Di sản Văn hóa Thế giới nổi tiếng nằm ở tỉnh/thành nào?",
            "topic": "ĐỊA LÝ & VĂN HÓA VN",
            "fromFlag": "🇻🇳",
            "toFlag": "🇻🇳",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "optionA": "Đà Nẵng",
            "optionB": "Quảng Nam",
            "optionC": "Thừa Thiên Huế",
            "optionD": "Bình Định",
            "correctOption": "B",
            "explanation": "Đáp án B: Phố cổ Hội An thuộc tỉnh Quảng Nam, nổi tiếng với những ngôi nhà cổ vàng óng & hoa đăng đêm hội!",
            "image": "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1200&q=80",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Cố đô Huế - Kinh đô của triều đại phong kiến nào ở Việt Nam?",
            "topic": "ĐỊA LÝ & VĂN HÓA VN",
            "fromFlag": "🇻🇳",
            "toFlag": "🇻🇳",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "optionA": "Triều Lý",
            "optionB": "Triều Trần",
            "optionC": "Triều Nguyễn",
            "optionD": "Triều Lê",
            "correctOption": "C",
            "explanation": "Đáp án C: Cố đô Huế là thủ đô của Việt Nam dưới triều đại nhà Nguyễn (1802 - 1945)!",
            "image": "https://images.unsplash.com/photo-1570366583818-f77cb3662ce4?w=1200&q=80",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Trường đại học đầu tiên của Việt Nam là công trình văn hóa nào?",
            "topic": "ĐỊA LÝ & VĂN HÓA VN",
            "fromFlag": "🇻🇳",
            "toFlag": "🇻🇳",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "optionA": "Văn Miếu Quốc Tử Giám",
            "optionB": "Chùa Một Cột",
            "optionC": "Hoàng Thành Thăng Long",
            "optionD": "Tháp Rùa Hồ Gươm",
            "correctOption": "A",
            "explanation": "Đáp án A: Quốc Tử Giám thành lập năm 1076 dưới thời vua Lý Nhân Tông, là trường đại học đầu tiên!",
            "image": "https://images.unsplash.com/photo-1509030450996-939a26569106?w=1200&q=80",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Quần thể danh thắng Tràng An kết hợp Di sản Thiên nhiên & Văn hóa nằm ở đâu?",
            "topic": "ĐỊA LÝ & VĂN HÓA VN",
            "fromFlag": "🇻🇳",
            "toFlag": "🇻🇳",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "optionA": "Thanh Hóa",
            "optionB": "Ninh Bình",
            "optionC": "Hà Nam",
            "optionD": "Hòa Bình",
            "correctOption": "B",
            "explanation": "Đáp án B: Tràng An (Ninh Bình) là Di sản thế giới kép đầu tiên tại Đông Nam Á!",
            "image": "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Cây cầu biểu tượng được nâng đỡ bởi hai bàn tay đá khổng lồ ở Đà Nẵng tên là gì?",
            "topic": "ĐỊA LÝ & VĂN HÓA VN",
            "fromFlag": "🇻🇳",
            "toFlag": "🇻🇳",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "optionA": "Cầu Rồng",
            "optionB": "Cầu Vàng",
            "optionC": "Cầu Sông Hàn",
            "optionD": "Cầu Trần Thị Lý",
            "correctOption": "B",
            "explanation": "Đáp án B: Cầu Vàng Bà Nà Hills (Đà Nẵng) là kiệt tác kiến trúc thu hút du khách khắp thế giới!",
            "image": "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=1200&q=80",
            "mode": "vocab-b1-tiktok"
          }
        ]
      },
      {
        "name": "🌾 Bộ 3: Văn Hóa Dân Gian, Áo Dài & Lễ Hội Truyền Thống",
        "topic": "ĐỊA LÝ & VĂN HÓA VN",
        "fromFlag": "🇻🇳",
        "toFlag": "🇻🇳",
        "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
        "mode": "vocab-b1-tiktok",
        "questions": [
          {
            "question": "Trang phục truyền thống mang biểu tượng vẻ đẹp dịu dàng của người phụ nữ Việt Nam là gì?",
            "topic": "ĐỊA LÝ & VĂN HÓA VN",
            "fromFlag": "🇻🇳",
            "toFlag": "🇻🇳",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "optionA": "Áo Bà Ba",
            "optionB": "Áo Dài",
            "optionC": "Áo Tứ Thân",
            "optionD": "Áo Yếm",
            "correctOption": "B",
            "explanation": "Đáp án B: Áo Dài là quốc phục truyền thống tôn vinh nét đẹp thanh lịch của phụ nữ Việt Nam!",
            "image": "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Lễ hội lớn nhất trong năm của người Việt Nam đánh dấu sự bắt đầu của năm mới âm lịch là gì?",
            "topic": "ĐỊA LÝ & VĂN HÓA VN",
            "fromFlag": "🇻🇳",
            "toFlag": "🇻🇳",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "optionA": "Tết Trung Thu",
            "optionB": "Tết Đoan Ngọ",
            "optionC": "Tết Nguyên Đán",
            "optionD": "Tết Hàn Thực",
            "correctOption": "C",
            "explanation": "Đáp án C: Tết Nguyên Đán là dịp đoàn viên quan trọng nhất trong đời sống văn hóa tinh thần Việt Nam!",
            "image": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&q=80",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Loại hình nghệ thuật diễn xướng dân gian sông nước đặc sắc chỉ có ở Việt Nam là gì?",
            "topic": "ĐỊA LÝ & VĂN HÓA VN",
            "fromFlag": "🇻🇳",
            "toFlag": "🇻🇳",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "optionA": "Múa Rối Nước",
            "optionB": "Hát Quan Họ",
            "optionC": "Nhã Nhạc Cung Đình",
            "optionD": "Đờn Ca Tài Tử",
            "correctOption": "A",
            "explanation": "Đáp án A: Múa Rối Nước là di sản văn hóa phi vật thể độc đáo phát triển từ nền văn minh lúa nước!",
            "image": "https://images.unsplash.com/photo-1509030450996-939a26569106?w=1200&q=80",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Nhà sàn gỗ & hoa văn Trống Đồng Đông Sơn là di sản nghệ thuật của thời kỳ lịch sử nào?",
            "topic": "ĐỊA LÝ & VĂN HÓA VN",
            "fromFlag": "🇻🇳",
            "toFlag": "🇻🇳",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "optionA": "Thời Đinh - Lê",
            "optionB": "Thời Hùng Vương - Văn Lang",
            "optionC": "Thời Lý - Trần",
            "optionD": "Thời Nhà Nguyễn",
            "correctOption": "B",
            "explanation": "Đáp án B: Trống đồng Đông Sơn là biểu tượng rực rỡ của văn minh lúa nước thời đại Hùng Vương!",
            "image": "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1200&q=80",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Chợ nổi đặc sản giao thương hàng hóa trên sông là nét văn hóa nổi tiếng của vùng nào?",
            "topic": "ĐỊA LÝ & VĂN HÓA VN",
            "fromFlag": "🇻🇳",
            "toFlag": "🇻🇳",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "optionA": "Miền Tây Nam Bộ",
            "optionB": "Đồng Bằng Sông Hồng",
            "optionC": "Tây Nguyên",
            "optionD": "Duyên Hải Miền Trung",
            "correctOption": "A",
            "explanation": "Đáp án A: Chợ nổi Miền Tây (như Cái Răng, Phong Điền) phản ánh nhịp sống sông nước đầy sống động!",
            "image": "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200&q=80",
            "mode": "vocab-b1-tiktok"
          }
        ]
      },
      {
        "name": "🗺️ Bộ 4: Địa Lý Chi Tiết & Các Kỷ Lục Việt Nam",
        "topic": "ĐỊA LÝ & VĂN HÓA VN",
        "fromFlag": "🇻🇳",
        "toFlag": "🇻🇳",
        "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
        "mode": "vocab-b1-tiktok",
        "questions": [
          {
            "question": "Con sông nào dài nhất chảy qua lãnh thổ Việt Nam?",
            "topic": "ĐỊA LÝ & VĂN HÓA VN",
            "fromFlag": "🇻🇳",
            "toFlag": "🇻🇳",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "optionA": "Sông Hồng",
            "optionB": "Sông Mê Kông (Sông Cửu Long)",
            "optionC": "Sông Đồng Nai",
            "optionD": "Sông Hương",
            "correctOption": "B",
            "explanation": "Đáp án B: Sông Mê Kông đổ ra biển qua 9 cửa sông tạo nên Đồng bằng sông Cửu Long trù phú!",
            "image": "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&q=80",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Thành phố nào là trung tâm kinh tế lớn nhất Việt Nam?",
            "topic": "ĐỊA LÝ & VĂN HÓA VN",
            "fromFlag": "🇻🇳",
            "toFlag": "🇻🇳",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "optionA": "Hà Nội",
            "optionB": "Đà Nẵng",
            "optionC": "TP. Hồ Chí Minh",
            "optionD": "Hải Phòng",
            "correctOption": "C",
            "explanation": "Đáp án C: TP. Hồ Chí Minh (Sài Gòn) là đô thị phát triển năng động & trung tâm kinh tế hàng đầu!",
            "image": "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200&q=80",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Vùng Tây Nguyên nổi tiếng nhất Việt Nam với cây công nghiệp dài ngày nào?",
            "topic": "ĐỊA LÝ & VĂN HÓA VN",
            "fromFlag": "🇻🇳",
            "toFlag": "🇻🇳",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "optionA": "Cây Cà Phê",
            "optionB": "Cây Chè (Trà)",
            "optionC": "Cây Dừa",
            "optionD": "Cây Mía",
            "correctOption": "A",
            "explanation": "Đáp án A: Tây Nguyên (đặc biệt Buôn Ma Thuột) là thủ phủ Cà Phê đưa Việt Nam xuất khẩu top 2 thế giới!",
            "image": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&q=80",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Tỉnh nào có đường bờ biển dài nhất Việt Nam (385 km)?",
            "topic": "ĐỊA LÝ & VĂN HÓA VN",
            "fromFlag": "🇻🇳",
            "toFlag": "🇻🇳",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "optionA": "Quảng Ninh",
            "optionB": "Khánh Hòa",
            "optionC": "Bình Thuận",
            "optionD": "Cà Mau",
            "correctOption": "B",
            "explanation": "Đáp án B: Khánh Hòa có bờ biển dài nhất với vịnh Nha Trang & Vân Phong tuyệt đẹp!",
            "image": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=80",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Mũi Cà Mau - Điểm cực Nam trên đất liền của Việt Nam thuộc xã nào?",
            "topic": "ĐỊA LÝ & VĂN HÓA VN",
            "fromFlag": "🇻🇳",
            "toFlag": "🇻🇳",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "optionA": "Xã Đất Mũi",
            "optionB": "Xã Tân An",
            "optionC": "Xã Viên An",
            "optionD": "Xã Phan Ngọc Hiển",
            "correctOption": "A",
            "explanation": "Đáp án A: Mũi Cà Mau thuộc Xã Đất Mũi, huyện Ngọc Hiển, tỉnh Cà Mau!",
            "image": "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80",
            "mode": "vocab-b1-tiktok"
          }
        ]
      }
    ]
  },
  {
    "id": "country-guess-5-clues",
    "name": "🌎 Video Đoán Quốc Gia Qua 5 Gợi Ý (Kèm Quốc Kỳ & Giọng Đọc)",
    "description": "Giao diện Video Shorts 9:16 Đoán Quốc Gia Qua 5 Gợi Ý: Tự động hiển thị 5 gợi ý hình ảnh + văn bản dừng 3s mỗi gợi ý, giọng đọc Tiếng Việt truyền cảm, màn hình đáp án hiển thị tên nước kèm Quốc Kỳ nổi bật!",
    "badge": "ĐOÁN QUỐC GIA",
    "mode": "country-guess",
    "guessTime": 3,
    "sampleFiles": [
      { "name": "mau_doan_quoc_gia_5_goi_y.json", "label": "🌎 Mẫu JSON Đoán Quốc Gia 5 Gợi Ý", "type": "json" },
      { "name": "mau_nhin_co_doan_quoc_gia.json", "label": "🚩 Mẫu JSON Nhìn Cờ Đoán Quốc Gia", "type": "json" }
    ],
    "sets": [
      {
        "name": "🌎 Bộ 1: Đoán Các Quốc Gia Nổi Tiếng Thế Giới",
        "topic": "🌎 ĐOÁN QUỐC GIA",
        "fromFlag": "🌎",
        "toFlag": "🚩",
        "headerTitle": "ĐOÁN QUỐC GIA QUA 5 GỢI Ý",
        "mode": "country-guess",
        "questions": [
          {
            "id": "country-japan",
            "topic": "🌎 ĐOÁN QUỐC GIA",
            "country": "Nhật Bản",
            "flag": "🇯🇵",
            "headerTitle": "ĐOÁN QUỐC GIA QUA 5 GỢI Ý",
            "mode": "country-guess",
            "clues": [
              { "step": 1, "icon": "🌏", "text": "Quốc gia này nằm ở khu vực Đông Á.", "image": "https://images.unsplash.com/photo-1540573133985-7789883c8255?w=800" },
              { "step": 2, "icon": "🍣", "text": "Món ăn Sushi & Ramen cực kỳ nổi tiếng.", "image": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800" },
              { "step": 3, "icon": "🗻", "text": "Có ngọn núi Phú Sĩ phủ tuyết trắng.", "image": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800" },
              { "step": 4, "icon": "🌸", "text": "Được mệnh danh là Xứ sở Hoa Anh Đào.", "image": "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800" },
              { "step": 5, "icon": "🗼", "text": "Thủ đô là Tokyo sầm uất & hiện đại.", "image": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800" }
            ],
            "explanation": "Nhật Bản 🇯🇵 (Thủ đô Tokyo, Núi Phú Sĩ & Văn hóa Kimono)"
          },
          {
            "id": "country-france",
            "topic": "🌎 ĐOÁN QUỐC GIA",
            "country": "Nước Pháp",
            "flag": "🇫🇷",
            "headerTitle": "ĐOÁN QUỐC GIA QUA 5 GỢI Ý",
            "mode": "country-guess",
            "clues": [
              { "step": 1, "icon": "🇪🇺", "text": "Quốc gia này nằm ở khu vực Tây Âu.", "image": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800" },
              { "step": 2, "icon": "🥖", "text": "Nổi tiếng với bánh mì Bánh Mì Bánh Sừng Bò & Rượu Vang.", "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800" },
              { "step": 3, "icon": "🗼", "text": "Có Tháp Eiffel biểu tượng kỳ vĩ.", "image": "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800" },
              { "step": 4, "icon": "⚽", "text": "Từng 2 lần vô địch World Cup bóng đá.", "image": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800" },
              { "step": 5, "icon": "🎨", "text": "Thủ đô Paris - Kinh đô Ánh Sáng & Thời Trang.", "image": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800" }
            ],
            "explanation": "Nước Pháp 🇫🇷 (Thủ đô Paris, Tháp Eiffel & Kinh đô thời trang)"
          },
          {
            "id": "country-egypt",
            "topic": "🌎 ĐOÁN QUỐC GIA",
            "country": "Ai Cập",
            "flag": "🇪🇬",
            "headerTitle": "ĐOÁN QUỐC GIA QUA 5 GỢI Ý",
            "mode": "country-guess",
            "clues": [
              { "step": 1, "icon": "🌍", "text": "Nằm ở giao điểm Bắc Phi & Tây Á.", "image": "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800" },
              { "step": 2, "icon": "🏜️", "text": "Bao phủ bởi sa mạc Sahara rộng lớn.", "image": "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800" },
              { "step": 3, "icon": "🌊", "text": "Có dòng sông Nile dài nhất thế giới chảy qua.", "image": "https://images.unsplash.com/photo-1572252821143-035a0247c4e2?w=800" },
              { "step": 4, "icon": "👑", "text": "Nơi sinh sống của các Pharaoh & Nữ hoàng Cleopatra.", "image": "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800" },
              { "step": 5, "icon": "🔺", "text": "Nổi tiếng với Kim Tự Tháp Giza & Tượng Nhân Sư.", "image": "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800" }
            ],
            "explanation": "Ai Cập 🇪🇬 (Thủ đô Cairo, Kim Tự Tháp Giza & Sông Nile)"
          },
          {
            "id": "country-italy",
            "topic": "🌎 ĐOÁN QUỐC GIA",
            "country": "Nước Ý (Italy)",
            "flag": "🇮🇹",
            "headerTitle": "ĐOÁN QUỐC GIA QUA 5 GỢI Ý",
            "mode": "country-guess",
            "clues": [
              { "step": 1, "icon": "🍕", "text": "Quê hương của món Pizza & Mỳ Spaghetti.", "image": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800" },
              { "step": 2, "icon": "🏛️", "text": "Có Đấu trường La Mã Colosseum cổ kính.", "image": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800" },
              { "step": 3, "icon": "🗼", "text": "Nổi tiếng với Tháp nghiêng Pisa kỳ lạ.", "image": "https://images.unsplash.com/photo-1543429776-2782fc8e1acd?w=800" },
              { "step": 4, "icon": "🚣", "text": "Thành phố trên sông Venice lãng mạn.", "image": "https://images.unsplash.com/photo-1514896856000-91cb6de818e0?w=800" },
              { "step": 5, "icon": "🇻🇦", "text": "Quốc gia hình chiếc ủng bao quanh Tòa thánh Vatican.", "image": "https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800" }
            ],
            "explanation": "Nước Ý 🇮🇹 (Thủ đô Rome, Pizza, Tháp Pisa & Đấu trường Colosseum)"
          }
        ]
      }
    ]
  },
  {
    "id": "food-guess",
    "name": "🍳 Video Nhìn Hình Đoán Món Ăn (4 Đáp Án ABCD)",
    "description": "Giao diện Video Shorts 9:16 Đoán Món Ăn: Hiển thị hình ảnh món ăn kèm giọng đọc 'Đây là món gì?', 4 đáp án A-B-C-D, sau 3s đếm ngược hiện đáp án đúng kèm âm thanh chúc mừng!",
    "badge": "ĐOÁN MÓN ĂN",
    "mode": "food-guess",
    "guessTime": 3,
    "sampleFiles": [
      { "name": "mau_nhin_anh_doan_mon_an.json", "label": "🍳 Mẫu JSON Nhìn Hình Đoán Món Ăn", "type": "json" }
    ],
    "sets": [
      {
        "name": "🍳 Bộ 1: Món Ăn Truyền Thống Việt Nam",
        "topic": "🍳 ĐOÁN MÓN ĂN",
        "fromFlag": "🍳",
        "toFlag": "🍲",
        "headerTitle": "ĐÂY LÀ MÓN GÌ?",
        "mode": "food-guess",
        "guessTime": 3,
        "questions": [
          {
            "id": "food-1",
            "question": "Đây là món gì?",
            "dish": "PHỞ BÒ",
            "optionA": "Phở Bò",
            "optionB": "Bún Chả",
            "optionC": "Bánh Mì",
            "optionD": "Cơm Tấm",
            "correctOption": "A",
            "image": "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800",
            "explanation": "Phở Bò 🍜 (Món quốc phục ẩm thực Việt Nam nổi tiếng toàn cầu)",
            "mode": "food-guess"
          },
          {
            "id": "food-2",
            "question": "Đây là món gì?",
            "dish": "BÁNH MÌ",
            "optionA": "Gỏi Cuốn",
            "optionB": "Bánh Mì",
            "optionC": "Bánh Xèo",
            "optionD": "Bún Bò Huế",
            "correctOption": "B",
            "image": "https://images.unsplash.com/photo-1626804475297-41607a074eb1?w=800",
            "explanation": "Bánh Mì 🥖 (Món ăn đường phố ngon hàng đầu thế giới)",
            "mode": "food-guess"
          },
          {
            "id": "food-3",
            "question": "Đây là món gì?",
            "dish": "BÚN CHẢ",
            "optionA": "Bún Rêu",
            "optionB": "Bánh Cuốn",
            "optionC": "Bún Chả",
            "optionD": "Cơm Tấm",
            "correctOption": "C",
            "image": "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800",
            "explanation": "Bún Chả Hà Nội 🥗 (Thịt nướng thơm lừng ăn kèm nước mắm chua ngọt)",
            "mode": "food-guess"
          },
          {
            "id": "food-4",
            "question": "Đây là món gì?",
            "dish": "CƠM TẤM",
            "optionA": "Bò Né",
            "optionB": "Hủ Tiếu",
            "optionC": "Bánh Bột Lọc",
            "optionD": "Cơm Tấm",
            "correctOption": "D",
            "image": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
            "explanation": "Cơm Tấm Sài Gòn 🍛 (Ăn kèm sườn nướng, chả trứng & bì heo)",
            "mode": "food-guess"
          },
          {
            "id": "food-5",
            "question": "Đây là món gì?",
            "dish": "GỎI CUỐN",
            "optionA": "Gỏi Cuốn",
            "optionB": "Bánh Xèo",
            "optionC": "Nem Rán",
            "optionD": "Chả Cá",
            "correctOption": "A",
            "image": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800",
            "explanation": "Gỏi Cuốn Tôm Thịt 🥢 (Món thanh mát chấm mắm nêm hoặc tương đậu)",
            "mode": "food-guess"
          }
        ]
      }
    ]
  },
  {
    "id": "landmark-guess",
    "name": "🏰 Video Nhìn Ảnh Đoán Địa Điểm Nổi Tiếng (Ô Chữ Hiển Thị Kèm Giọng Đọc)",
    "description": "Giao diện Video Shorts 9:16 Đoán Địa Điểm Nổi Tiếng: Hiện hình ảnh cảnh đẹp/kỳ quan đố kèm giọng đọc 'Đây là địa điểm nào?', ô chữ ban đầu hiện ký tự đầu tiên của từng từ trong 3s đếm ngược, sau 3s mở toàn bộ ô chữ kèm thông tin khám phá du lịch!",
    "badge": "ĐOÁN ĐỊA ĐIỂM",
    "mode": "landmark-guess",
    "guessTime": 3,
    "sampleFiles": [
      { "name": "mau_nhin_anh_doan_dia_diem.json", "label": "🏰 Mẫu JSON Nhìn Ảnh Đoán Địa Điểm", "type": "json" }
    ],
    "sets": [
      {
        "name": "🏰 Bộ 1: Kỳ Quan Thế Giới Nổi Tiếng",
        "topic": "🏰 ĐOÁN ĐỊA ĐIỂM",
        "fromFlag": "🌍",
        "toFlag": "🏛️",
        "headerTitle": "ĐÂY LÀ ĐÂY?",
        "mode": "landmark-guess",
        "guessTime": 3,
        "questions": [
          {
            "id": "landmark-1",
            "question": "Đây là địa điểm nào?",
            "word": "Tháp Eiffel",
            "landmark": "Tháp Eiffel",
            "dish": "Tháp Eiffel",
            "optionA": "Tháp Eiffel",
            "image": "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=1200&q=80",
            "explanation": "Tháp Eiffel 🇫🇷 - Biểu tượng nước Pháp cao 330m",
            "mode": "landmark-guess"
          },
          {
            "id": "landmark-2",
            "question": "Đây là địa điểm nào?",
            "word": "Vạn Lý Trường Thành",
            "landmark": "Vạn Lý Trường Thành",
            "dish": "Vạn Lý Trường Thành",
            "optionA": "Vạn Lý Trường Thành",
            "image": "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800",
            "explanation": "Vạn Lý Trường Thành 🇨🇳 - Kỳ quan kỳ vĩ dài 21.000km",
            "mode": "landmark-guess"
          },
          {
            "id": "landmark-3",
            "question": "Đây là địa điểm nào?",
            "word": "Kim Tự Tháp Giza",
            "landmark": "Kim Tự Tháp Giza",
            "dish": "Kim Tự Tháp Giza",
            "optionA": "Kim Tự Tháp Giza",
            "image": "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800",
            "explanation": "Kim Tự Tháp Giza 🇪🇬 - Kỳ quan Ai Cập cổ đại lâu đời nhất",
            "mode": "landmark-guess"
          },
          {
            "id": "landmark-4",
            "question": "Đây là địa điểm nào?",
            "word": "Tượng Nữ Thần Tự Do",
            "landmark": "Tượng Nữ Thần Tự Do",
            "dish": "Tượng Nữ Thần Tự Do",
            "optionA": "Tượng Nữ Thần Tự Do",
            "image": "https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?w=800",
            "explanation": "Tượng Nữ Thần Tự Do 🇺🇸 - Biểu tượng tự do tại New York",
            "mode": "landmark-guess"
          },
          {
            "id": "landmark-5",
            "question": "Đây là địa điểm nào?",
            "word": "Đền Taj Mahal",
            "landmark": "Đền Taj Mahal",
            "dish": "Đền Taj Mahal",
            "optionA": "Đền Taj Mahal",
            "image": "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800",
            "explanation": "Đền Taj Mahal 🇮🇳 - Kiệt tác kiến trúc đá trắng lăng mộ Ấn Độ",
            "mode": "landmark-guess"
          }
        ]
      }
    ]
  },

  {
    "id": "quiz-mcq-b1-tiktok",
    "name": "🧠 Video Đố Vui Trắc Nghiệm B1 Shorts (Giọng Đọc Tiếng Việt)",
    "description": "Giao diện B1 TikTok Shorts dành cho video Đố Vui Trắc Nghiệm 4 đáp án (A, B, C, D): Tự động phát giọng đọc câu hỏi đố vui bằng Tiếng Việt truyền cảm, thời gian đếm ngược xanh lá mượt mà, công bố đáp án đúng + phát âm Tiếng Việt chuẩn!",
    "badge": "ĐỐ VUI B1",
    "mode": "vocab-b1-tiktok",
    "guessTime": 3,
    "sampleFiles": [
      { "name": "mau_do_vui_trac_nghiem_b1.json", "label": "🧠 Mẫu JSON Đố Vui B1", "type": "json" }
    ],
    "sets": [
      {
        "name": "🧠 Bộ 1: Đố Vui Trí Tuệ & Đố Mẹo Dân Gian",
        "topic": "ĐỐ VUI B1",
        "fromFlag": "🇻🇳",
        "toFlag": "🇻🇳",
        "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
        "mode": "vocab-b1-tiktok",
        "questions": [
          {
            "question": "Con gì sinh ra đã mang tính lười?",
            "topic": "ĐỐ VUI B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇻🇳",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "optionA": "Con lợn",
            "optionB": "Con lười",
            "optionC": "Con mèo",
            "optionD": "Con rùa",
            "correctOption": "B",
            "explanation": "Đáp án B: Con lười (Loài vật nổi tiếng di chuyển chậm chạp nhất thế giới!)",
            "image": "https://images.unsplash.com/photo-1540573133985-7789883c8255?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Cái gì bằng cái đĩa, bác Bác Cụ Cụ nằm ngửa ra phơi?",
            "topic": "ĐỐ VUI B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇻🇳",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "optionA": "Lá sen",
            "optionB": "Cái gương",
            "optionC": "Mặt trăng",
            "optionD": "Bánh tráng",
            "correctOption": "A",
            "explanation": "Đáp án A: Lá sen (Câu đố dân gian Việt Nam quen thuộc)",
            "image": "https://images.unsplash.com/photo-1509070016581-915335454d19?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Lịch nào dài nhất thế giới?",
            "topic": "ĐỐ VUI B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇻🇳",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "optionA": "Lịch âm",
            "optionB": "Lịch dương",
            "optionC": "Lịch sử",
            "optionD": "Lịch Vạn Niên",
            "correctOption": "C",
            "explanation": "Đáp án C: Lịch sử (Lịch sử trải dài qua hàng ngàn năm phát triển của nhân loại!)",
            "image": "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Nắng lửa mưa dầu tôi vẫn đứng, ai đi qua cũng gật đầu chào?",
            "topic": "ĐỐ VUI B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇻🇳",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "optionA": "Cột đèn giao thông",
            "optionB": "Cái nón lá",
            "optionC": "Cây cầu",
            "optionD": "Cổng làng",
            "correctOption": "B",
            "explanation": "Đáp án B: Cái nón lá (Nón lá che nắng mưa, mỗi khi bỏ nón ra nghiêng đầu như chào)",
            "image": "https://images.unsplash.com/photo-1528127269322-539801943592?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Con gì đầu dê mình ốc?",
            "topic": "ĐỐ VUI B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇻🇳",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "optionA": "Con dốc",
            "optionB": "Con ốc sên",
            "optionC": "Con dê núi",
            "optionD": "Con rắn",
            "correctOption": "A",
            "explanation": "Đáp án A: Con dốc (Chơi chữ: Dê + Ốc = Dốc!)",
            "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
            "mode": "vocab-b1-tiktok"
          }
        ]
      },
      {
        "name": "🦁 Bộ 2: Đố Vui Động Vật & Tự Nhiên",
        "topic": "ĐỐ VUI B1",
        "fromFlag": "🇻🇳",
        "toFlag": "🇻🇳",
        "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
        "mode": "vocab-b1-tiktok",
        "questions": [
          {
            "question": "Loài động vật nào di chuyển nhanh nhất trên cạn?",
            "topic": "ĐỐ VUI B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇻🇳",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "optionA": "Sư tử",
            "optionB": "Báo gấm (Cheetah)",
            "optionC": "Linh dương",
            "optionD": "Ngựa vằn",
            "correctOption": "B",
            "explanation": "Đáp án B: Báo gấm Cheetah (Tốc độ tối đa lên tới 120 km/h!)",
            "image": "https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Loài thú nào lớn nhất thế giới hiện nay?",
            "topic": "ĐỐ VUI B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇻🇳",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "optionA": "Voi châu Phi",
            "optionB": "Cá voi xanh",
            "optionC": "Hà mã",
            "optionD": "Cá mập trắng",
            "correctOption": "B",
            "explanation": "Đáp án B: Cá voi xanh (Nặng đến 180 tấn và dài tới 30 mét!)",
            "image": "https://images.unsplash.com/photo-1568430460464-02e0b59b3628?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Chim ruồi (Hummingbird) có khả năng đặc biệt gì?",
            "topic": "ĐỐ VUI B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇻🇳",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "optionA": "Bay lùi về sau",
            "optionB": "Lặn dưới nước",
            "optionC": "Phát sáng ban đêm",
            "optionD": "Không biết hót",
            "correctOption": "A",
            "explanation": "Đáp án A: Chim ruồi là loài chim duy nhất có thể bay lùi!",
            "image": "https://images.unsplash.com/photo-1551085254-e96b210df58a?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Trái tim của con tôm nằm ở vị trí nào?",
            "topic": "ĐỐ VUI B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇻🇳",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "optionA": "Ở ngực",
            "optionB": "Ở bụng",
            "optionC": "Ở đầu",
            "optionD": "Ở đuôi",
            "correctOption": "C",
            "explanation": "Đáp án C: Trái tim con tôm nằm ở phần đầu của nó!",
            "image": "https://images.unsplash.com/photo-1559742811-822863cc4b7e?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Loài chim nào không thể bay?",
            "topic": "ĐỐ VUI B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇻🇳",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "optionA": "Chim cánh cụt",
            "optionB": "Đại bàng",
            "optionC": "Chim én",
            "optionD": "Chim hỉ thước",
            "correctOption": "A",
            "explanation": "Đáp án A: Chim cánh cụt không thể bay trên không nhưng bơi siêu giỏi!",
            "image": "https://images.unsplash.com/photo-1598439210625-5067c578f3f6?w=800",
            "mode": "vocab-b1-tiktok"
          }
        ]
      },
      {
        "name": "🗺️ Bộ 3: Đố Vui Địa Lý & Lịch Sử Việt Nam",
        "topic": "ĐỐ VUI B1",
        "fromFlag": "🇻🇳",
        "toFlag": "🇻🇳",
        "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
        "mode": "vocab-b1-tiktok",
        "questions": [
          {
            "question": "Thành phố nào là thủ đô của Việt Nam?",
            "topic": "ĐỐ VUI B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇻🇳",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "optionA": "TP. Hồ Chí Minh",
            "optionB": "Đà Nẵng",
            "optionC": "Hà Nội",
            "optionD": "Hải Phòng",
            "correctOption": "C",
            "explanation": "Đáp án C: Hà Nội - Thủ đô ngàn năm văn hiến của Việt Nam!",
            "image": "https://images.unsplash.com/photo-1509030450996-939a26569106?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Đảo nào lớn nhất Việt Nam?",
            "topic": "ĐỐ VUI B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇻🇳",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "optionA": "Đảo Lý Sơn",
            "optionB": "Đảo Phú Quốc",
            "optionC": "Đảo Côn Đảo",
            "optionD": "Đảo Cát Bà",
            "correctOption": "B",
            "explanation": "Đáp án B: Phú Quốc (Đảo Ngọc) là hòn đảo lớn nhất Việt Nam!",
            "image": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Ngọn núi nào cao nhất Việt Nam và Đông Dương?",
            "topic": "ĐỐ VUI B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇻🇳",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "optionA": "Núi Bạch Mã",
            "optionB": "Núi Fansipan",
            "optionC": "Núi Bà Đen",
            "optionD": "Núi Yên Tử",
            "correctOption": "B",
            "explanation": "Đáp án B: Đỉnh Fansipan cao 3.143m (Nóc nhà Đông Dương)",
            "image": "https://images.unsplash.com/photo-1528127269322-539801943592?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Vịnh Hạ Long thuộc tỉnh nào của nước ta?",
            "topic": "ĐỐ VUI B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇻🇳",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "optionA": "Quảng Ninh",
            "optionB": "Hải Phòng",
            "optionC": "Ninh Bình",
            "optionD": "Quảng Bình",
            "correctOption": "A",
            "explanation": "Đáp án A: Vịnh Hạ Long thuộc tỉnh Quảng Ninh (Di sản thiên nhiên thế giới UNESCO)",
            "image": "https://images.unsplash.com/photo-1528127269322-539801943592?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Con sông nào dài nhất chảy qua lãnh thổ Việt Nam?",
            "topic": "ĐỐ VUI B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇻🇳",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "optionA": "Sông Hồng",
            "optionB": "Sông Mê Kông (Sông Cửu Long)",
            "optionC": "Sông Đồng Nai",
            "optionD": "Sông Hương",
            "correctOption": "B",
            "explanation": "Đáp án B: Sông Mê Kông chảy qua miền Tây tạo nên đồng bằng sông Cửu Long trù phú!",
            "image": "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800",
            "mode": "vocab-b1-tiktok"
          }
        ]
      }
    ]
  },
  {
    "id": "vocab-b1-word-guess-lingobibi",
    "name": "🎀 Video Học Từ Vựng Lingo BiBi (4 Đáp Án + Nền Ảnh)",
    "description": "Giao diện Video Lingo BiBi: Nền ảnh từ vựng rực rỡ, hiện từ Tiếng Việt, 4 đáp án Tiếng Anh (A, B, C, D), thanh tiến trình 3 giây đếm ngược, sau đó công bố đáp án đúng + phát âm Tiếng Anh chuẩn & phiên âm IPA!",
    "badge": "LINGO BIBI",
    "mode": "vocab-lingobibi-mcq",
    "channel": "Lingo BiBi",
    "themeColor": "pink",
    "logo": "/logo_lingo_bibi.png",
    "guessTime": 3,
    "sampleFiles": [
      { "name": "mau_doan_tu_vung_lingo_bibi.json", "label": "🎀 Mẫu JSON Lingo BiBi (4 Đáp Án)", "type": "json" }
    ],
    "sets": [
      {
        "name": "🎀 Bộ 1: Lingo BiBi - Từ Vựng Tiếng Anh Dễ Thương (4 Đáp Án)",
        "topic": "LINGO BIBI",
        "channel": "Lingo BiBi",
        "themeColor": "pink",
        "logo": "/logo_lingo_bibi.png",
        "fromFlag": "🇻🇳",
        "toFlag": "🇺🇸",
        "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
        "mode": "vocab-lingobibi-mcq",
        "guessTime": 3,
        "questions": [
          {
            "question": "Con mèo con",
            "word": "Kitten",
            "optionA": "Kitten",
            "optionB": "Puppy",
            "optionC": "Bunny",
            "optionD": "Hamster",
            "correctOption": "A",
            "topic": "LINGO BIBI",
            "channel": "Lingo BiBi",
            "themeColor": "pink",
            "logo": "/logo_lingo_bibi.png",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "ipa": "/ˈkɪt.ən/",
            "explanation": "Kitten (n): Mèo con xinh xắn",
            "image": "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1000",
            "mode": "vocab-lingobibi-mcq"
          },
          {
            "question": "Nàng công chúa",
            "word": "Princess",
            "optionA": "Queen",
            "optionB": "Princess",
            "optionC": "Fairy",
            "optionD": "Angel",
            "correctOption": "B",
            "topic": "LINGO BIBI",
            "channel": "Lingo BiBi",
            "themeColor": "pink",
            "logo": "/logo_lingo_bibi.png",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "ipa": "/prɪnˈses/",
            "explanation": "Princess (n): Nàng công chúa kiều diễm",
            "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000",
            "mode": "vocab-lingobibi-mcq"
          },
          {
            "question": "Kẹo ngọt",
            "word": "Candy",
            "optionA": "Cookie",
            "optionB": "Cake",
            "optionC": "Candy",
            "optionD": "Donut",
            "correctOption": "C",
            "topic": "LINGO BIBI",
            "channel": "Lingo BiBi",
            "themeColor": "pink",
            "logo": "/logo_lingo_bibi.png",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "ipa": "/ˈkæn.di/",
            "explanation": "Candy (n): Kẹo ngọt ngào",
            "image": "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=1000",
            "mode": "vocab-lingobibi-mcq"
          },
          {
            "question": "Cầu vồng",
            "word": "Rainbow",
            "optionA": "Rainbow",
            "optionB": "Sunlight",
            "optionC": "Cloud",
            "optionD": "Starlight",
            "correctOption": "A",
            "topic": "LINGO BIBI",
            "channel": "Lingo BiBi",
            "themeColor": "pink",
            "logo": "/logo_lingo_bibi.png",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "ipa": "/ˈreɪn.bəʊ/",
            "explanation": "Rainbow (n): Cầu vồng rực rỡ",
            "image": "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1000",
            "mode": "vocab-lingobibi-mcq"
          },
          {
            "question": "Thiên thần",
            "word": "Angel",
            "optionA": "Star",
            "optionB": "Angel",
            "optionC": "Moon",
            "optionD": "Flower",
            "correctOption": "B",
            "topic": "LINGO BIBI",
            "channel": "Lingo BiBi",
            "themeColor": "pink",
            "logo": "/logo_lingo_bibi.png",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "ipa": "/ˈeɪn.dʒəl/",
            "explanation": "Angel (n): Thiên thần nhỏ đáng yêu",
            "image": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000",
            "mode": "vocab-lingobibi-mcq"
          }
        ]
      },
      {
        "name": "🌸 Bộ 2: Lingo BiBi - Chọn Động Vật Tiếng Anh (4 Đáp Án)",
        "topic": "LINGO BIBI",
        "channel": "Lingo BiBi",
        "themeColor": "pink",
        "logo": "/logo_lingo_bibi.png",
        "fromFlag": "🇻🇳",
        "toFlag": "🇺🇸",
        "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
        "mode": "vocab-lingobibi-mcq",
        "guessTime": 3,
        "questions": [
          {
            "question": "Con thỏ",
            "word": "Rabbit",
            "optionA": "Hamster",
            "optionB": "Squirrel",
            "optionC": "Rabbit",
            "optionD": "Puppy",
            "correctOption": "C",
            "topic": "LINGO BIBI",
            "channel": "Lingo BiBi",
            "themeColor": "pink",
            "logo": "/logo_lingo_bibi.png",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "ipa": "/ˈræb.ɪt/",
            "explanation": "Rabbit (n): Con thỏ trắng dễ thương",
            "image": "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=1000",
            "mode": "vocab-lingobibi-mcq"
          },
          {
            "question": "Gấu trúc",
            "word": "Panda",
            "optionA": "Panda",
            "optionB": "Koala",
            "optionC": "Bear",
            "optionD": "Fox",
            "correctOption": "A",
            "topic": "LINGO BIBI",
            "channel": "Lingo BiBi",
            "themeColor": "pink",
            "logo": "/logo_lingo_bibi.png",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "ipa": "/ˈpæn.də/",
            "explanation": "Panda (n): Gấu trúc mập mạp",
            "image": "https://images.unsplash.com/photo-1564349683136-77e08dba1ef9?w=1000",
            "mode": "vocab-lingobibi-mcq"
          },
          {
            "question": "Chim hồng hạc",
            "word": "Flamingo",
            "optionA": "Swan",
            "optionB": "Flamingo",
            "optionC": "Peacock",
            "optionD": "Parrot",
            "correctOption": "B",
            "topic": "LINGO BIBI",
            "channel": "Lingo BiBi",
            "themeColor": "pink",
            "logo": "/logo_lingo_bibi.png",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "ipa": "/fləˈmɪŋ.ɡəʊ/",
            "explanation": "Flamingo (n): Chim hồng hạc màu hồng",
            "image": "https://images.unsplash.com/photo-1520699049698-acd2fccb8cc8?w=1000",
            "mode": "vocab-lingobibi-mcq"
          },
          {
            "question": "Con bướm",
            "word": "Butterfly",
            "optionA": "Bee",
            "optionB": "Dragonfly",
            "optionC": "Butterfly",
            "optionD": "Ladybug",
            "correctOption": "C",
            "topic": "LINGO BIBI",
            "channel": "Lingo BiBi",
            "themeColor": "pink",
            "logo": "/logo_lingo_bibi.png",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "ipa": "/ˈbʌt.ə.flaɪ/",
            "explanation": "Butterfly (n): Chú bướm xinh xắn",
            "image": "https://images.unsplash.com/photo-1557008075-7f2c5efa4cfd?w=1000",
            "mode": "vocab-lingobibi-mcq"
          },
          {
            "question": "Con sóc",
            "word": "Squirrel",
            "optionA": "Squirrel",
            "optionB": "Fox",
            "optionC": "Beaver",
            "optionD": "Mouse",
            "correctOption": "A",
            "topic": "LINGO BIBI",
            "channel": "Lingo BiBi",
            "themeColor": "pink",
            "logo": "/logo_lingo_bibi.png",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "CHỌN ĐÁP ÁN ĐÚNG",
            "ipa": "/ˈskwɪr.əl/",
            "explanation": "Squirrel (n): Con sóc nhanh nhẹn",
            "image": "https://images.unsplash.com/photo-1504006833117-8886a355efbf?w=1000",
            "mode": "vocab-lingobibi-mcq"
          }
        ]
      }
    ]
  },
  {
    "id": "lingobibi-flashcard",
    "name": "🎴 Video Flashcard Lingo BiBi - Song Ngữ (Việt - Anh)",
    "description": "Dạng Video Flashcard Lingo BiBi 2 Mặt: Thẻ 1 hiện từ Tiếng Việt + Hình ảnh + Giọng đọc Tiếng Việt -> Lật sang Thẻ 2 hiện từ Tiếng Anh + Phiên âm IPA + Giữ nguyên hình ảnh + Giọng đọc Tiếng Anh chuẩn!",
    "badge": "FLASHCARD BIBI",
    "mode": "lingobibi-flashcard",
    "channel": "Lingo BiBi",
    "themeColor": "pink",
    "logo": "/logo_lingo_bibi.png",
    "guessTime": 3,
    "sampleFiles": [
      { "name": "mau_flashcard_lingo_bibi.json", "label": "🎴 Mẫu JSON Flashcard Lingo BiBi", "type": "json" }
    ],
    "sets": [
      {
        "name": "🎀 Bộ 1: Flashcard Lingo BiBi - Từ Vựng Dễ Thương (Việt - Anh)",
        "topic": "LINGO BIBI",
        "channel": "Lingo BiBi",
        "themeColor": "pink",
        "logo": "/logo_lingo_bibi.png",
        "fromFlag": "🇻🇳",
        "toFlag": "🇺🇸",
        "headerTitle": "FLASHCARD SONG NGỮ",
        "mode": "lingobibi-flashcard",
        "guessTime": 5,
        "questions": [
          {
            "question": "Con mèo con",
            "word": "Kitten",
            "ipa": "/ˈkɪt.ən/",
            "topic": "LINGO BIBI",
            "channel": "Lingo BiBi",
            "themeColor": "pink",
            "logo": "/logo_lingo_bibi.png",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "FLASHCARD SONG NGỮ",
            "explanation": "Kitten (n): Mèo con xinh xắn dễ thương",
            "image": "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800",
            "mode": "lingobibi-flashcard"
          },
          {
            "question": "Nàng công chúa",
            "word": "Princess",
            "ipa": "/prɪnˈses/",
            "topic": "LINGO BIBI",
            "channel": "Lingo BiBi",
            "themeColor": "pink",
            "logo": "/logo_lingo_bibi.png",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "FLASHCARD SONG NGỮ",
            "explanation": "Princess (n): Nàng công chúa kiều diễm",
            "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800",
            "mode": "lingobibi-flashcard"
          },
          {
            "question": "Kẹo ngọt",
            "word": "Candy",
            "ipa": "/ˈkæn.di/",
            "topic": "LINGO BIBI",
            "channel": "Lingo BiBi",
            "themeColor": "pink",
            "logo": "/logo_lingo_bibi.png",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "FLASHCARD SONG NGỮ",
            "explanation": "Candy (n): Kẹo ngọt ngào sắc màu",
            "image": "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=800",
            "mode": "lingobibi-flashcard"
          },
          {
            "question": "Cầu vồng",
            "word": "Rainbow",
            "ipa": "/ˈreɪn.bəʊ/",
            "topic": "LINGO BIBI",
            "channel": "Lingo BiBi",
            "themeColor": "pink",
            "logo": "/logo_lingo_bibi.png",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "FLASHCARD SONG NGỮ",
            "explanation": "Rainbow (n): Cầu vồng 7 màu rực rỡ",
            "image": "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800",
            "mode": "lingobibi-flashcard"
          },
          {
            "question": "Con bươm bướm",
            "word": "Butterfly",
            "ipa": "/ˈbʌt.ə.flaɪ/",
            "topic": "LINGO BIBI",
            "channel": "Lingo BiBi",
            "themeColor": "pink",
            "logo": "/logo_lingo_bibi.png",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "FLASHCARD SONG NGỮ",
            "explanation": "Butterfly (n): Con bươm bướm xinh đẹp",
            "image": "https://images.unsplash.com/photo-1557008075-7f2c5efa4cfd?w=800",
            "mode": "lingobibi-flashcard"
          }
        ]
      },
      {
        "name": "🎀 Bộ 2: Flashcard Lingo BiBi - Trái Cây & Đồ Ăn (Việt - Anh)",
        "topic": "LINGO BIBI",
        "channel": "Lingo BiBi",
        "themeColor": "pink",
        "logo": "/logo_lingo_bibi.png",
        "fromFlag": "🇻🇳",
        "toFlag": "🇺🇸",
        "headerTitle": "FLASHCARD SONG NGỮ",
        "mode": "lingobibi-flashcard",
        "guessTime": 3.5,
        "questions": [
          {
            "question": "Quả dâu tây",
            "word": "Strawberry",
            "ipa": "/ˈstrɔː.bər.i/",
            "topic": "LINGO BIBI",
            "channel": "Lingo BiBi",
            "themeColor": "pink",
            "logo": "/logo_lingo_bibi.png",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "FLASHCARD SONG NGỮ",
            "explanation": "Strawberry (n): Quả dâu tây đỏ mọng",
            "image": "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800",
            "mode": "lingobibi-flashcard"
          },
          {
            "question": "Kem ốc quế",
            "word": "Ice Cream",
            "ipa": "/ˈaɪs ˌkriːm/",
            "topic": "LINGO BIBI",
            "channel": "Lingo BiBi",
            "themeColor": "pink",
            "logo": "/logo_lingo_bibi.png",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "FLASHCARD SONG NGỮ",
            "explanation": "Ice cream (n): Kem mát lạnh ngọt ngào",
            "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
            "mode": "lingobibi-flashcard"
          },
          {
            "question": "Quả táo đỏ",
            "word": "Apple",
            "ipa": "/ˈæp.əl/",
            "topic": "LINGO BIBI",
            "channel": "Lingo BiBi",
            "themeColor": "pink",
            "logo": "/logo_lingo_bibi.png",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "FLASHCARD SONG NGỮ",
            "explanation": "Apple (n): Quả táo đỏ tươi giòn ngon",
            "image": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800",
            "mode": "lingobibi-flashcard"
          },
          {
            "question": "Bánh sinh nhật",
            "word": "Cake",
            "ipa": "/keɪk/",
            "topic": "LINGO BIBI",
            "channel": "Lingo BiBi",
            "themeColor": "pink",
            "logo": "/logo_lingo_bibi.png",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "FLASHCARD SONG NGỮ",
            "explanation": "Cake (n): Bánh kem sinh nhật thơm ngon",
            "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800",
            "mode": "lingobibi-flashcard"
          },
          {
            "question": "Trái bơ",
            "word": "Avocado",
            "ipa": "/ˌæv.əˈkɑː.dəʊ/",
            "topic": "LINGO BIBI",
            "channel": "Lingo BiBi",
            "themeColor": "pink",
            "logo": "/logo_lingo_bibi.png",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "FLASHCARD SONG NGỮ",
            "explanation": "Avocado (n): Trái bơ dẻo béo bổ dưỡng",
            "image": "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800",
            "mode": "lingobibi-flashcard"
          }
        ]
      }
    ]
  },
  {
    "id": "ca-dao-tuc-ngu",
    "name": "🌾 Video Đố Ca Dao Tục Ngữ Việt Nam (Điền Từ Còn Thiếu)",
    "description": "Dạng Video Đố Ca Dao Tục Ngữ Việt Nam: Giọng đọc Tiếng Việt đọc câu hỏi (đọc 'ba chấm' ở từ còn thiếu), đếm ngược 3s rồi công bố TRỰC TIẾP đáp án đúng kèm âm thanh chúc mừng (không hiện 4 ô A, B, C, D & không đọc lại đáp án).",
    "badge": "CA DAO VIỆT NAM",
    "mode": "ca-dao-tuc-ngu",
    "channel": "Ca Dao Việt Nam",
    "themeColor": "emerald",
    "logo": "/logo2.png",
    "guessTime": 3,
    "sampleFiles": [
      { "name": "mau_ca_dao_tuc_ngu.json", "label": "🌾 Mẫu JSON Ca Dao Tục Ngữ", "type": "json" }
    ],
    "sets": [
      {
        "name": "🌾 Bộ 1: Ca Dao Tục Ngữ Việt Nam - Điền Từ Mẫu 1",
        "topic": "CA DAO TỤC NGỮ",
        "channel": "Ca Dao Việt Nam",
        "themeColor": "emerald",
        "logo": "/logo2.png",
        "fromFlag": "🇻🇳",
        "toFlag": "🇻🇳",
        "headerTitle": "ĐIỀN TỪ CÒN THIẾU",
        "mode": "ca-dao-tuc-ngu",
        "guessTime": 3,
        "questions": [
          {
            "question": "Nước đổ đầu ___",
            "word": "Vịt",
            "topic": "CA DAO TỤC NGỮ",
            "channel": "Ca Dao Việt Nam",
            "headerTitle": "ĐIỀN TỪ CÒN THIẾU",
            "explanation": "Nước đổ đầu vịt (Tục ngữ): Khuyên bảo hay dạy dỗ ai đó mà họ không tiếp thu, coi như không có chuyện gì.",
            "image": "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800",
            "mode": "ca-dao-tuc-ngu"
          },
          {
            "question": "Gần mực thì đen, gần đèn thì ___",
            "word": "Sáng",
            "topic": "CA DAO TỤC NGỮ",
            "channel": "Ca Dao Việt Nam",
            "headerTitle": "ĐIỀN TỪ CÒN THIẾU",
            "explanation": "Gần mực thì đen, gần đèn thì sáng (Tục ngữ): Môi trường xung quanh ảnh hưởng lớn đến tính cách và đạo đức con người.",
            "image": "https://images.unsplash.com/photo-1509021436468-d51009049965?w=800",
            "mode": "ca-dao-tuc-ngu"
          },
          {
            "question": "Ăn quả nhớ kẻ ___",
            "word": "Trồng cây",
            "topic": "CA DAO TỤC NGỮ",
            "channel": "Ca Dao Việt Nam",
            "headerTitle": "ĐIỀN TỪ CÒN THIẾU",
            "explanation": "Ăn quả nhớ kẻ trồng cây (Tục ngữ): Thể hiện tinh thần uống nước nhớ nguồn, biết ơn người đi trước.",
            "image": "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800",
            "mode": "ca-dao-tuc-ngu"
          },
          {
            "question": "Có công mài sắt, có ngày ___",
            "word": "Nên kim",
            "topic": "CA DAO TỤC NGỮ",
            "channel": "Ca Dao Việt Nam",
            "headerTitle": "ĐIỀN TỪ CÒN THIẾU",
            "explanation": "Có công mài sắt, có ngày nên kim (Tục ngữ): Khuyên con người cần có lòng kiên trì, nhẫn nại sẽ thành công.",
            "image": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
            "mode": "ca-dao-tuc-ngu"
          },
          {
            "question": "Một cây làm chẳng nên non, ba cây chụm lại nên ___",
            "word": "Hòn núi cao",
            "topic": "CA DAO TỤC NGỮ",
            "channel": "Ca Dao Việt Nam",
            "headerTitle": "ĐIỀN TỪ CÒN THIẾU",
            "explanation": "Một cây làm chẳng nên non, ba cây chụm lại nên hòn núi cao (Ca dao): Sức mạnh của tinh thần đoàn kết tập thể.",
            "image": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
            "mode": "ca-dao-tuc-ngu"
          }
        ]
      },
      {
        "name": "🌾 Bộ 2: Ca Dao Tục Ngữ Việt Nam - Điền Từ Mẫu 2",
        "topic": "CA DAO TỤC NGỮ",
        "channel": "Ca Dao Việt Nam",
        "themeColor": "emerald",
        "logo": "/logo2.png",
        "fromFlag": "🇻🇳",
        "toFlag": "🇻🇳",
        "headerTitle": "ĐIỀN TỪ CÒN THIẾU",
        "mode": "ca-dao-tuc-ngu",
        "guessTime": 3,
        "questions": [
          {
            "question": "Đi một ngày đàng, học một ___",
            "word": "Sàng khôn",
            "topic": "CA DAO TỤC NGỮ",
            "channel": "Ca Dao Việt Nam",
            "headerTitle": "ĐIỀN TỪ CÒN THIẾU",
            "explanation": "Đi một ngày đàng, học một sàng khôn (Tục ngữ): Đi nhiều mở rộng tầm mắt, tích lũy thêm tri thức cuộc sống.",
            "image": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800",
            "mode": "ca-dao-tuc-ngu"
          },
          {
            "question": "Tốt gỗ hơn tốt ___",
            "word": "Nước sơn",
            "topic": "CA DAO TỤC NGỮ",
            "channel": "Ca Dao Việt Nam",
            "headerTitle": "ĐIỀN TỪ CÒN THIẾU",
            "explanation": "Tốt gỗ hơn tốt nước sơn (Tục ngữ): Phẩm chất bên trong quan trọng hơn vẻ bề ngoài.",
            "image": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800",
            "mode": "ca-dao-tuc-ngu"
          },
          {
            "question": "Thương người như thể thương ___",
            "word": "Thân",
            "topic": "CA DAO TỤC NGỮ",
            "channel": "Ca Dao Việt Nam",
            "headerTitle": "ĐIỀN TỪ CÒN THIẾU",
            "explanation": "Thương người như thể thương thân (Tục ngữ): Khuyên con người phải biết yêu thương, giúp đỡ lẫn nhau.",
            "image": "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800",
            "mode": "ca-dao-tuc-ngu"
          },
          {
            "question": "Lá lành đùm lá ___",
            "word": "Rách",
            "topic": "CA DAO TỤC NGỮ",
            "channel": "Ca Dao Việt Nam",
            "headerTitle": "ĐIỀN TỪ CÒN THIẾU",
            "explanation": "Lá lành đùm lá rách (Tục ngữ): Tinh thần đùm bọc, giúp đỡ người gặp khó khăn hoạn nạn.",
            "image": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800",
            "mode": "ca-dao-tuc-ngu"
          },
          {
            "question": "Chị ngã em ___",
            "word": "Nâng",
            "topic": "CA DAO TỤC NGỮ",
            "channel": "Ca Dao Việt Nam",
            "headerTitle": "ĐIỀN TỪ CÒN THIẾU",
            "explanation": "Chị ngã em nâng (Tục ngữ): Tình cảm anh chị em trong gia đình luôn hỗ trợ, đùm bọc nhau.",
            "image": "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=800",
            "mode": "ca-dao-tuc-ngu"
          }
        ]
      }
    ]
  },

  {
    "id": "vocab-b1-word-guess",
    "name": "🔤 Video Đoán Ô Chữ B1 Shorts (Điền Chữ Cái Vào Ô như Ảnh Mẫu)",
    "description": "Giao diện B1 TikTok Shorts dành cho bài tập Điền chữ cái vào ô (Đoán từ vựng ẩn chữ cái): Giọng đọc Tiếng Việt trong thời gian đếm ngược 5s, ô chữ hiện chữ cái đầu [ E ], sau đó hiện đầy đủ chữ cái còn thiếu + phát âm Tiếng Anh chuẩn!",
    "badge": "Ô CHỮ B1",
    "mode": "vocab-b1-tiktok",
    "guessTime": 3,
    "sampleFiles": [
      { "name": "mau_doan_tu_vung_word_guess.json", "label": "🔤 Mẫu JSON Đoán Ô Chữ B1", "type": "json" }
    ],
    "sets": [
      {
        "name": "🌱 Bộ 1: Đoán Ô Chữ B1 - Từ Vựng B1 Thông Dụng",
        "topic": "ĐOÁN Ô CHỮ B1",
        "fromFlag": "🇻🇳",
        "toFlag": "🇺🇸",
        "headerTitle": "ĐIỀN CHỮ CÁI CÒN THIẾU",
        "mode": "vocab-b1-tiktok",
        "questions": [
          {
            "question": "Cân bằng",
            "word": "BALANCE",
            "topic": "ĐOÁN Ô CHỮ B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "ĐIỀN CHỮ CÁI CÒN THIẾU",
            "ipa": "/ˈbæl.əns/",
            "explanation": "Balance (n/v): Cân bằng, sự thăng bằng",
            "image": "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Sức khỏe",
            "word": "HEALTH",
            "topic": "ĐOÁN Ô CHỮ B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "ĐIỀN CHỮ CÁI CÒN THIẾU",
            "ipa": "/helθ/",
            "explanation": "Health (n): Sức khỏe",
            "image": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Phát triển",
            "word": "DEVELOP",
            "topic": "ĐOÁN Ô CHỮ B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "ĐIỀN CHỮ CÁI CÒN THIẾU",
            "ipa": "/dɪˈvel.əp/",
            "explanation": "Develop (v): Phát triển",
            "image": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Cơ hội",
            "word": "OPPORTUNITY",
            "topic": "ĐOÁN Ô CHỮ B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "ĐIỀN CHỮ CÁI CÒN THIẾU",
            "ipa": "/ˌɒp.əˈtʃuː.nə.ti/",
            "explanation": "Opportunity (n): Cơ hội",
            "image": "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Môi trường",
            "word": "ENVIRONMENT",
            "topic": "ĐOÁN Ô CHỮ B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "ĐIỀN CHỮ CÁI CÒN THIẾU",
            "ipa": "/ɪnˈvaɪ.rən.mənt/",
            "explanation": "Environment (n): Môi trường",
            "image": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
            "mode": "vocab-b1-tiktok"
          }
        ]
      },
      {
        "name": "🦁 Bộ 2: Đoán Ô Chữ B1 - Động Vật (Animals)",
        "topic": "ĐOÁN Ô CHỮ B1",
        "fromFlag": "🇻🇳",
        "toFlag": "🇺🇸",
        "headerTitle": "ĐIỀN CHỮ CÁI CÒN THIẾU",
        "mode": "vocab-b1-tiktok",
        "questions": [
          {
            "question": "Con voi",
            "word": "ELEPHANT",
            "topic": "ĐOÁN Ô CHỮ B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "ĐIỀN CHỮ CÁI CÒN THIẾU",
            "ipa": "/ˈel.ɪ.fənt/",
            "explanation": "(n) Con voi - Loài động vật trên cạn lớn nhất thế giới!",
            "image": "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Sư tử",
            "word": "LION",
            "topic": "ĐOÁN Ô CHỮ B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "ĐIỀN CHỮ CÁI CÒN THIẾU",
            "ipa": "/ˈlaɪ.ən/",
            "explanation": "(n) Sư tử - Chúa tể rừng xanh!",
            "image": "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Cá heo",
            "word": "DOLPHIN",
            "topic": "ĐOÁN Ô CHỮ B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "ĐIỀN CHỮ CÁI CÒN THIẾU",
            "ipa": "/ˈdɒl.fɪn/",
            "explanation": "(n) Cá heo - Loài động vật biển rất thông minh!",
            "image": "https://images.unsplash.com/photo-1570481662006-a3a1374699e8?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Chim đại bàng",
            "word": "EAGLE",
            "topic": "ĐOÁN Ô CHỮ B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "ĐIỀN CHỮ CÁI CÒN THIẾU",
            "ipa": "/ˈiː.ɡəl/",
            "explanation": "(n) Chim đại bàng - Biểu tượng của sức mạnh!",
            "image": "https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Chim cánh cụt",
            "word": "PENGUIN",
            "topic": "ĐOÁN Ô CHỮ B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "ĐIỀN CHỮ CÁI CÒN THIẾU",
            "ipa": "/ˈpeŋ.ɡwɪn/",
            "explanation": "(n) Chim cánh cụt - Sống ở Nam Cực!",
            "image": "https://images.unsplash.com/photo-1598439210625-5067c578f3f6?w=800",
            "mode": "vocab-b1-tiktok"
          }
        ]
      },
      {
        "name": "💼 Bộ 3: Đoán Ô Chữ B1 - Công Việc & Sự Nghiệp",
        "topic": "ĐOÁN Ô CHỮ B1",
        "fromFlag": "🇻🇳",
        "toFlag": "🇺🇸",
        "headerTitle": "ĐIỀN CHỮ CÁI CÒN THIẾU",
        "mode": "vocab-b1-tiktok",
        "questions": [
          {
            "question": "Thành công",
            "word": "SUCCESS",
            "topic": "ĐOÁN Ô CHỮ B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "ĐIỀN CHỮ CÁI CÒN THIẾU",
            "ipa": "/səkˈses/",
            "explanation": "Success (n): Sự thành công",
            "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Kinh nghiệm",
            "word": "EXPERIENCE",
            "topic": "ĐOÁN Ô CHỮ B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "ĐIỀN CHỮ CÁI CÒN THIẾU",
            "ipa": "/ɪkˈspɪə.ri.əns/",
            "explanation": "Experience (n): Kinh nghiệm",
            "image": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Mục tiêu",
            "word": "GOAL",
            "topic": "ĐOÁN Ô CHỮ B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "ĐIỀN CHỮ CÁI CÒN THIẾU",
            "ipa": "/ɡəʊl/",
            "explanation": "Goal (n): Mục tiêu",
            "image": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Kỹ năng",
            "word": "SKILL",
            "topic": "ĐOÁN Ô CHỮ B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "ĐIỀN CHỮ CÁI CÒN THIẾU",
            "ipa": "/skɪl/",
            "explanation": "Skill (n): Kỹ năng",
            "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Thách thức",
            "word": "CHALLENGE",
            "topic": "ĐOÁN Ô CHỮ B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "ĐIỀN CHỮ CÁI CÒN THIẾU",
            "ipa": "/ˈtʃæl.ɪndʒ/",
            "explanation": "Challenge (n): Thử thách",
            "image": "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=800",
            "mode": "vocab-b1-tiktok"
          }
        ]
      },
      {
        "name": "🎓 Bộ 4: Đoán Ô Chữ B1 - Giáo Dục & Trí Tuệ",
        "topic": "ĐOÁN Ô CHỮ B1",
        "fromFlag": "🇻🇳",
        "toFlag": "🇺🇸",
        "headerTitle": "ĐIỀN CHỮ CÁI CÒN THIẾU",
        "mode": "vocab-b1-tiktok",
        "questions": [
          {
            "question": "Kiến thức",
            "word": "KNOWLEDGE",
            "topic": "ĐOÁN Ô CHỮ B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "ĐIỀN CHỮ CÁI CÒN THIẾU",
            "ipa": "/ˈnɒl.ɪdʒ/",
            "explanation": "Knowledge (n): Tri thức, kiến thức",
            "image": "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Sáng tạo",
            "word": "CREATIVE",
            "topic": "ĐOÁN Ô CHỮ B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "ĐIỀN CHỮ CÁI CÒN THIẾU",
            "ipa": "/kriˈeɪ.tɪv/",
            "explanation": "Creative (adj): Sáng tạo",
            "image": "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Nghiên cứu",
            "word": "RESEARCH",
            "topic": "ĐOÁN Ô CHỮ B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "ĐIỀN CHỮ CÁI CÒN THIẾU",
            "ipa": "/rɪˈsɜːtʃ/",
            "explanation": "Research (n/v): Nghiên cứu",
            "image": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Cơ hội",
            "word": "CHANCE",
            "topic": "ĐOÁN Ô CHỮ B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "ĐIỀN CHỮ CÁI CÒN THIẾU",
            "ipa": "/tʃɑːns/",
            "explanation": "Chance (n): Cơ hội",
            "image": "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Môi trường",
            "word": "NATURE",
            "topic": "ĐOÁN Ô CHỮ B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "ĐIỀN CHỮ CÁI CÒN THIẾU",
            "ipa": "/ˈneɪ.tʃər/",
            "explanation": "Nature (n): Tự nhiên, thiên nhiên",
            "image": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
            "mode": "vocab-b1-tiktok"
          }
        ]
      }
    ]
  },
  {
    "id": "fill-in-blank-b1-tiktok",
    "name": "✏️ Video Điền Từ Vào Chỗ Trống B1 Shorts (Chuẩn TikTok - Như Ảnh Mẫu)",
    "description": "Giao diện B1 TikTok Shorts dành cho bài tập Điền từ vào chỗ trống (Fill in the blank): Badge ĐIỀN TỪ B1, khung trắng ĐIỀN TỪ CÒN THIẾU ➔, câu văn chứa chỗ trống _______, thanh thời gian xanh lá, 4 thẻ đáp án trắng bo tròn!",
    "badge": "ĐIỀN TỪ B1",
    "mode": "vocab-b1-tiktok",
    "guessTime": 3,
    "sampleFiles": [
      { "name": "mau_tu_vung_b1_tiktok.json", "label": "✏️ Mẫu JSON Điền Từ B1", "type": "json" }
    ],
    "sets": [
      {
        "name": "📝 Bộ 1: Điền Từ B1 - Ngữ Pháp & Giới Từ",
        "topic": "ĐIỀN TỪ B1",
        "fromFlag": "🇻🇳",
        "toFlag": "🇺🇸",
        "headerTitle": "ĐIỀN TỪ CÒN THIẾU",
        "mode": "vocab-b1-tiktok",
        "questions": [
          {
            "question": "She is looking forward to _______ her best friend.",
            "topic": "ĐIỀN TỪ B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "ĐIỀN TỪ CÒN THIẾU",
            "optionA": "see",
            "optionB": "seeing",
            "optionC": "seen",
            "optionD": "saw",
            "correctOption": "B",
            "explanation": "Cấu trúc: look forward to + V-ing (mong chờ làm gì)",
            "ipa": "/ˈlʊk ˈfɔː.wəd tuː ˈsiː.ɪŋ/",
            "image": "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "He was very interested _______ learning Spanish.",
            "topic": "ĐIỀN TỪ B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "ĐIỀN TỪ CÒN THIẾU",
            "optionA": "in",
            "optionB": "on",
            "optionC": "at",
            "optionD": "for",
            "correctOption": "A",
            "explanation": "Cấu trúc: be interested in + N/V-ing (hứng thú với cái gì)",
            "ipa": "/biː ˈɪn.trəs.tɪd ɪn/",
            "image": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "If it rains tomorrow, we _______ at home.",
            "topic": "ĐIỀN TỪ B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "ĐIỀN TỪ CÒN THIẾU",
            "optionA": "stay",
            "optionB": "would stay",
            "optionC": "will stay",
            "optionD": "stayed",
            "correctOption": "C",
            "explanation": "Câu điều kiện loại 1: If + HTĐ, S + will + V_inf",
            "ipa": "/wɪl steɪ/",
            "image": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "They have lived in London _______ 2018.",
            "topic": "ĐIỀN TỪ B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "ĐIỀN TỪ CÒN THIẾU",
            "optionA": "for",
            "optionB": "since",
            "optionC": "from",
            "optionD": "in",
            "correctOption": "B",
            "explanation": "Dùng 'since' + mốc thời gian (2018) ở thì Hiện tại hoàn thành",
            "ipa": "/sɪns ˈtwen.ti ˈeɪ.tiːn/",
            "image": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "You _______ turn off the lights when leaving.",
            "topic": "ĐIỀN TỪ B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "ĐIỀN TỪ CÒN THIẾU",
            "optionA": "should",
            "optionB": "might",
            "optionC": "would",
            "optionD": "could",
            "correctOption": "A",
            "explanation": "Động từ khuyết thiếu: should + V (nên làm gì)",
            "ipa": "/ʃʊd tɜːn ɒf/",
            "image": "https://images.unsplash.com/photo-1507499739999-097706ad8914?w=800",
            "mode": "vocab-b1-tiktok"
          }
        ]
      },
      {
        "name": "🗣️ Bộ 2: Điền Từ B1 - Cụm Động Từ (Phrasal Verbs)",
        "topic": "ĐIỀN TỪ B1",
        "fromFlag": "🇻🇳",
        "toFlag": "🇺🇸",
        "headerTitle": "ĐIỀN TỪ CÒN THIẾU",
        "mode": "vocab-b1-tiktok",
        "questions": [
          {
            "question": "Never _______ up on your dreams!",
            "topic": "ĐIỀN TỪ B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "ĐIỀN TỪ CÒN THIẾU",
            "optionA": "take",
            "optionB": "give",
            "optionC": "make",
            "optionD": "turn",
            "correctOption": "B",
            "explanation": "Give up (phr v): Từ bỏ, bỏ cuộc",
            "ipa": "/ɡɪv ʌp/",
            "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Please _______ on the lights, it's very dark.",
            "topic": "ĐIỀN TỪ B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "ĐIỀN TỪ CÒN THIẾU",
            "optionA": "turn",
            "optionB": "put",
            "optionC": "get",
            "optionD": "take",
            "correctOption": "A",
            "explanation": "Turn on (phr v): Bật (thiết bị điện)",
            "ipa": "/tɜːn ɒn/",
            "image": "https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "She was raised by her aunt after her parents _______.",
            "topic": "ĐIỀN TỪ B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "ĐIỀN TỪ CÒN THIẾU",
            "optionA": "passed away",
            "optionB": "passed by",
            "optionC": "passed out",
            "optionD": "passed off",
            "correctOption": "A",
            "explanation": "Pass away (phr v): Qua đời, qua thế",
            "ipa": "/pɑːst əˈweɪ/",
            "image": "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "I need to _______ up this new word in the dictionary.",
            "topic": "ĐIỀN TỪ B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "ĐIỀN TỪ CÒN THIẾU",
            "optionA": "look",
            "optionB": "see",
            "optionC": "watch",
            "optionD": "find",
            "correctOption": "A",
            "explanation": "Look up (phr v): Tra cứu (từ điển)",
            "ipa": "/lʊk ʌp/",
            "image": "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Don't _______ off your homework until tomorrow.",
            "topic": "ĐIỀN TỪ B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "ĐIỀN TỪ CÒN THIẾU",
            "optionA": "put",
            "optionB": "take",
            "optionC": "set",
            "optionD": "keep",
            "correctOption": "A",
            "explanation": "Put off (phr v): Trì hoãn",
            "ipa": "/pʊt ɒf/",
            "image": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800",
            "mode": "vocab-b1-tiktok"
          }
        ]
      },
      {
        "name": "🎯 Bộ 3: Điền Từ B1 - Thì & Dạng Động Từ",
        "topic": "ĐIỀN TỪ B1",
        "fromFlag": "🇻🇳",
        "toFlag": "🇺🇸",
        "headerTitle": "ĐIỀN TỪ CÒN THIẾU",
        "mode": "vocab-b1-tiktok",
        "questions": [
          {
            "question": "While I was studying, my mother _______ dinner.",
            "topic": "ĐIỀN TỪ B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "ĐIỀN TỪ CÒN THIẾU",
            "optionA": "cooked",
            "optionB": "was cooking",
            "optionC": "is cooking",
            "optionD": "has cooked",
            "correctOption": "B",
            "explanation": "Thì Quá khứ tiếp diễn: Hai hành động xảy ra song song",
            "ipa": "/wəz ˈkʊk.ɪŋ/",
            "image": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "He decided _______ a new car next week.",
            "topic": "ĐIỀN TỪ B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "ĐIỀN TỪ CÒN THIẾU",
            "optionA": "buy",
            "optionB": "buying",
            "optionC": "to buy",
            "optionD": "bought",
            "correctOption": "C",
            "explanation": "Cấu trúc: decide + to V_inf (quyết định làm gì)",
            "ipa": "/dɪˈsaɪd tuː baɪ/",
            "image": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "By the time we arrived, the train _______.",
            "topic": "ĐIỀN TỪ B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "ĐIỀN TỪ CÒN THIẾU",
            "optionA": "left",
            "optionB": "has left",
            "optionC": "had left",
            "optionD": "was leaving",
            "correctOption": "C",
            "explanation": "Thì Quá khứ hoàn thành: Hành động xảy ra trước thời điểm trong quá khứ",
            "ipa": "/hæd left/",
            "image": "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "She enjoys _______ to classical music in the evening.",
            "topic": "ĐIỀN TỪ B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "ĐIỀN TỪ CÒN THIẾU",
            "optionA": "listen",
            "optionB": "listening",
            "optionC": "to listen",
            "optionD": "listened",
            "correctOption": "B",
            "explanation": "Cấu trúc: enjoy + V-ing (thích làm gì)",
            "ipa": "/ɪnˈdʒɔɪ ˈlɪs.ən.ɪŋ/",
            "image": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "This bridge _______ built in 1995.",
            "topic": "ĐIỀN TỪ B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "ĐIỀN TỪ CÒN THIẾU",
            "optionA": "is",
            "optionB": "was",
            "optionC": "were",
            "optionD": "has been",
            "correctOption": "B",
            "explanation": "Câu bị động Quá khứ đơn: S (số ít) + was + V3/ed",
            "ipa": "/wəz bɪlt/",
            "image": "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800",
            "mode": "vocab-b1-tiktok"
          }
        ]
      },
      {
        "name": "🌟 Bộ 4: Điền Từ B1 - Từ Vựng Theo Ngữ Cảnh",
        "topic": "ĐIỀN TỪ B1",
        "fromFlag": "🇻🇳",
        "toFlag": "🇺🇸",
        "headerTitle": "ĐIỀN TỪ CÒN THIẾU",
        "mode": "vocab-b1-tiktok",
        "questions": [
          {
            "question": "Fast food can have a negative _______ on health.",
            "topic": "ĐIỀN TỪ B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "ĐIỀN TỪ CÒN THIẾU",
            "optionA": "affect",
            "optionB": "effect",
            "optionC": "effective",
            "optionD": "effectively",
            "correctOption": "B",
            "explanation": "Have an effect on (phr): Có ảnh hưởng/tác động đến",
            "ipa": "/hæv ən ɪˈfekt ɒn/",
            "image": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Regular exercise helps improve your physical _______.",
            "topic": "ĐIỀN TỪ B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "ĐIỀN TỪ CÒN THIẾU",
            "optionA": "health",
            "optionB": "healthy",
            "optionC": "healthily",
            "optionD": "healthiness",
            "correctOption": "A",
            "explanation": "Physical health (n phr): Sức khỏe thể chất",
            "ipa": "/ˈfɪz.ɪ.kəl helθ/",
            "image": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "The company offers great opportunities for career _______.",
            "topic": "ĐIỀN TỪ B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "ĐIỀN TỪ CÒN THIẾU",
            "optionA": "growth",
            "optionB": "grow",
            "optionC": "growing",
            "optionD": "grew",
            "correctOption": "A",
            "explanation": "Career growth (n phr): Sự phát triển sự nghiệp",
            "ipa": "/kəˈrɪər ɡrəʊθ/",
            "image": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "We should reduce plastic waste to protect the _______.",
            "topic": "ĐIỀN TỪ B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "ĐIỀN TỪ CÒN THIẾU",
            "optionA": "nature",
            "optionB": "environment",
            "optionC": "climate",
            "optionD": "atmosphere",
            "correctOption": "B",
            "explanation": "Protect the environment (phr): Bảo vệ môi trường",
            "ipa": "/prəˈtekt ðə ɪnˈvaɪ.rən.mənt/",
            "image": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Hard work is the key to achieving your _______.",
            "topic": "ĐIỀN TỪ B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "ĐIỀN TỪ CÒN THIẾU",
            "optionA": "goals",
            "optionB": "wishes",
            "optionC": "hopes",
            "optionD": "thoughts",
            "correctOption": "A",
            "explanation": "Achieve goals (phr): Đạt được các mục tiêu",
            "ipa": "/əˈtʃiːv ɡəʊlz/",
            "image": "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=800",
            "mode": "vocab-b1-tiktok"
          }
        ]
      }
    ]
  },
  {
    "id": "vocab-b1-tiktok",
    "name": "🔥 Video Đố Từ Vựng B1 Shorts (Chuẩn TikTok - Như Ảnh Mẫu)",
    "description": "Giao diện chuẩn TikTok/Shorts đố từ vựng B1: Badge đỏ TỪ VỰNG B1, Cờ Việt - Mỹ, Khung trắng TỪ NÀO CÓ NGHĨA LÀ, Từ hỏi đặt trong ngoặc kép \"Cân bằng\"?, Thanh thời gian đếm ngược màu xanh lá rực rỡ, 4 thẻ đáp án trắng chữ đỏ!",
    "badge": "TIKTOK B1",
    "mode": "vocab-b1-tiktok",
    "guessTime": 3,
    "sampleFiles": [
      { "name": "mau_tu_vung_b1_tiktok.json", "label": "🎯 Mẫu JSON Từ Vựng B1", "type": "json" }
    ],
    "sets": [
      {
        "name": "🌱 Bộ 1: Từ Vựng B1 - Sức Khỏe & Cuộc Sống",
        "topic": "TỪ VỰNG B1",
        "fromFlag": "🇻🇳",
        "toFlag": "🇺🇸",
        "headerTitle": "TỪ NÀO CÓ NGHĨA LÀ",
        "mode": "vocab-b1-tiktok",
        "questions": [
          {
            "question": "Cân bằng",
            "topic": "TỪ VỰNG B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "TỪ NÀO CÓ NGHĨA LÀ",
            "optionA": "Stable",
            "optionB": "Level",
            "optionC": "Balance",
            "optionD": "Equal",
            "correctOption": "C",
            "explanation": "Balance (n/v): Cân bằng, sự thăng bằng",
            "ipa": "/ˈbæl.əns/",
            "image": "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Sức khỏe",
            "topic": "TỪ VỰNG B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "TỪ NÀO CÓ NGHĨA LÀ",
            "optionA": "Health",
            "optionB": "Wealth",
            "optionC": "Heart",
            "optionD": "Heal",
            "correctOption": "A",
            "explanation": "Health (n): Sức khỏe",
            "ipa": "/helθ/",
            "image": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Phát triển",
            "topic": "TỪ VỰNG B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "TỪ NÀO CÓ NGHĨA LÀ",
            "optionA": "Improve",
            "optionB": "Develop",
            "optionC": "Increase",
            "optionD": "Expand",
            "correctOption": "B",
            "explanation": "Develop (v): Phát triển",
            "ipa": "/dɪˈvel.əp/",
            "image": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Cơ hội",
            "topic": "TỪ VỰNG B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "TỪ NÀO CÓ NGHĨA LÀ",
            "optionA": "Chance",
            "optionB": "Choice",
            "optionC": "Opportunity",
            "optionD": "Challenge",
            "correctOption": "C",
            "explanation": "Opportunity (n): Cơ hội",
            "ipa": "/ˌɒp.əˈtʃuː.nə.ti/",
            "image": "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Môi trường",
            "topic": "TỪ VỰNG B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "TỪ NÀO CÓ NGHĨA LÀ",
            "optionA": "Nature",
            "optionB": "Environment",
            "optionC": "Atmosphere",
            "optionD": "Climate",
            "correctOption": "B",
            "explanation": "Environment (n): Môi trường",
            "ipa": "/ɪnˈvaɪ.rən.mənt/",
            "image": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
            "mode": "vocab-b1-tiktok"
          }
        ]
      },
      {
        "name": "💼 Bộ 2: Từ Vựng B1 - Công Việc & Sự Nghiệp",
        "topic": "TỪ VỰNG B1",
        "fromFlag": "🇻🇳",
        "toFlag": "🇺🇸",
        "headerTitle": "TỪ NÀO CÓ NGHĨA LÀ",
        "mode": "vocab-b1-tiktok",
        "questions": [
          {
            "question": "Thành công",
            "topic": "TỪ VỰNG B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "TỪ NÀO CÓ NGHĨA LÀ",
            "optionA": "Success",
            "optionB": "Succeed",
            "optionC": "Successful",
            "optionD": "Victory",
            "correctOption": "A",
            "explanation": "Success (n): Sự thành công",
            "ipa": "/səkˈses/",
            "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Kinh nghiệm",
            "topic": "TỪ VỰNG B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "TỪ NÀO CÓ NGHĨA LÀ",
            "optionA": "Knowledge",
            "optionB": "Skill",
            "optionC": "Experience",
            "optionD": "Practice",
            "correctOption": "C",
            "explanation": "Experience (n): Kinh nghiệm",
            "ipa": "/ɪkˈspɪə.ri.əns/",
            "image": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Mục tiêu",
            "topic": "TỪ VỰNG B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "TỪ NÀO CÓ NGHĨA LÀ",
            "optionA": "Target",
            "optionB": "Goal",
            "optionC": "Aim",
            "optionD": "Purpose",
            "correctOption": "B",
            "explanation": "Goal (n): Mục tiêu",
            "ipa": "/ɡəʊl/",
            "image": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Kỹ năng",
            "topic": "TỪ VỰNG B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "TỪ NÀO CÓ NGHĨA LÀ",
            "optionA": "Talent",
            "optionB": "Ability",
            "optionC": "Skill",
            "optionD": "Capacity",
            "correctOption": "C",
            "explanation": "Skill (n): Kỹ năng",
            "ipa": "/skɪl/",
            "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Thách thức",
            "topic": "TỪ VỰNG B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "TỪ NÀO CÓ NGHĨA LÀ",
            "optionA": "Difficulty",
            "optionB": "Problem",
            "optionC": "Challenge",
            "optionD": "Obstacle",
            "correctOption": "C",
            "explanation": "Challenge (n): Thử thách",
            "ipa": "/ˈtʃæl.ɪndʒ/",
            "image": "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=800",
            "mode": "vocab-b1-tiktok"
          }
        ]
      },
      {
        "name": "🎓 Bộ 3: Từ Vựng B1 - Giáo Dục & Trí Tuệ",
        "topic": "TỪ VỰNG B1",
        "fromFlag": "🇻🇳",
        "toFlag": "🇺🇸",
        "headerTitle": "TỪ NÀO CÓ NGHĨA LÀ",
        "mode": "vocab-b1-tiktok",
        "questions": [
          {
            "question": "Kiến thức",
            "topic": "TỪ VỰNG B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "TỪ NÀO CÓ NGHĨA LÀ",
            "optionA": "Information",
            "optionB": "Knowledge",
            "optionC": "Wisdom",
            "optionD": "Education",
            "correctOption": "B",
            "explanation": "Knowledge (n): Tri thức, kiến thức",
            "ipa": "/ˈnɒl.ɪdʒ/",
            "image": "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Sáng tạo",
            "topic": "TỪ VỰNG B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "TỪ NÀO CÓ NGHĨA LÀ",
            "optionA": "Create",
            "optionB": "Creation",
            "optionC": "Creative",
            "optionD": "Creativity",
            "correctOption": "C",
            "explanation": "Creative (adj): Sáng tạo",
            "ipa": "/kriˈeɪ.tɪv/",
            "image": "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Nghiên cứu",
            "topic": "TỪ VỰNG B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "TỪ NÀO CÓ NGHĨA LÀ",
            "optionA": "Study",
            "optionB": "Research",
            "optionC": "Explore",
            "optionD": "Discover",
            "correctOption": "B",
            "explanation": "Research (n/v): Nghiên cứu",
            "ipa": "/rɪˈsɜːtʃ/",
            "image": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Tập trung",
            "topic": "TỪ VỰNG B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "TỪ NÀO CÓ NGHĨA LÀ",
            "optionA": "Focus",
            "optionB": "Attention",
            "optionC": "Center",
            "optionD": "Collect",
            "correctOption": "A",
            "explanation": "Focus (v): Tập trung",
            "ipa": "/ˈfəʊ.kəs/",
            "image": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Giải pháp",
            "topic": "TỪ VỰNG B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "TỪ NÀO CÓ NGHĨA LÀ",
            "optionA": "Answer",
            "optionB": "Result",
            "optionC": "Solution",
            "optionD": "Method",
            "correctOption": "C",
            "explanation": "Solution (n): Giải pháp",
            "ipa": "/səˈluː.ʃən/",
            "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
            "mode": "vocab-b1-tiktok"
          }
        ]
      },
      {
        "name": "🚀 Bộ 4: Từ Vựng B1 - Công Nghệ & Tương Lai",
        "topic": "TỪ VỰNG B1",
        "fromFlag": "🇻🇳",
        "toFlag": "🇺🇸",
        "headerTitle": "TỪ NÀO CÓ NGHĨA LÀ",
        "mode": "vocab-b1-tiktok",
        "questions": [
          {
            "question": "Kết nối",
            "topic": "TỪ VỰNG B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "TỪ NÀO CÓ NGHĨA LÀ",
            "optionA": "Connect",
            "optionB": "Link",
            "optionC": "Join",
            "optionD": "Attach",
            "correctOption": "A",
            "explanation": "Connect (v): Kết nối",
            "ipa": "/kəˈnekt/",
            "image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Tự động",
            "topic": "TỪ VỰNG B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "TỪ NÀO CÓ NGHĨA LÀ",
            "optionA": "Automatic",
            "optionB": "Autonomy",
            "optionC": "Automate",
            "optionD": "Auto",
            "correctOption": "A",
            "explanation": "Automatic (adj): Tự động",
            "ipa": "/ˌɔː.təˈmæt.ɪk/",
            "image": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Hiệu quả",
            "topic": "TỪ VỰNG B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "TỪ NÀO CÓ NGHĨA LÀ",
            "optionA": "Effective",
            "optionB": "Efficient",
            "optionC": "Effect",
            "optionD": "Efficacy",
            "correctOption": "A",
            "explanation": "Effective (adj): Hiệu quả",
            "ipa": "/ɪˈfek.tɪv/",
            "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Bảo vệ",
            "topic": "TỪ VỰNG B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "TỪ NÀO CÓ NGHĨA LÀ",
            "optionA": "Defend",
            "optionB": "Protect",
            "optionC": "Guard",
            "optionD": "Save",
            "correctOption": "B",
            "explanation": "Protect (v): Bảo vệ",
            "ipa": "/prəˈtekt/",
            "image": "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800",
            "mode": "vocab-b1-tiktok"
          },
          {
            "question": "Tương lai",
            "topic": "TỪ VỰNG B1",
            "fromFlag": "🇻🇳",
            "toFlag": "🇺🇸",
            "headerTitle": "TỪ NÀO CÓ NGHĨA LÀ",
            "optionA": "Future",
            "optionB": "Forward",
            "optionC": "Next",
            "optionD": "Ahead",
            "correctOption": "A",
            "explanation": "Future (n): Tương lai",
            "ipa": "/ˈfjuː.tʃər/",
            "image": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800",
            "mode": "vocab-b1-tiktok"
          }
        ]
      }
    ]
  },
  {
    id: 'vocab-image-word-guess',
    name: '🖼️ Video Nhìn Ảnh Đoán Từ Vựng Tiếng Anh (Word Guess Shorts)',
    description: 'Dạng video đếm ngược 7s: Nhìn ảnh đoán từ vựng Tiếng Anh, hiện dạng (Chữ cái đầu _ _ _ _), không có A-B-C-D, đọc phát âm Tiếng Anh!',
    badge: 'WORD GUESS',
    mode: 'word-guess',
    sampleFiles: [
      { name: 'mau_doan_tu_vung_word_guess.json', label: '🔤 Mẫu JSON Đoán Từ Vựng', type: 'json' },
      { name: 'mau_4_bo_doan_tu_vung_tieng_anh_hinh_anh.csv', label: '🖼️ Mẫu 4 Bộ CSV', type: 'csv' },
      { name: 'mau_4_bo_doan_tu_vung_tieng_anh_hinh_anh.json', label: '🖼️ Mẫu 4 Bộ JSON', type: 'json' }
    ],
    sets: [
      {
        name: '🦁 Bộ 1: Đoán Từ Vựng Tiếng Anh - Động Vật (Animals)',
        mode: 'word-guess',
        questions: [
          {
            question: 'What is the name of this animal in English?',
            word: 'ELEPHANT',
            ipa: '/ˈel.ɪ.fənt/',
            explanation: '(n) Con voi - Loài động vật trên cạn lớn nhất thế giới!',
            image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=500',
            mode: 'word-guess'
          },
          {
            question: 'What animal is shown in the picture below?',
            word: 'LION',
            ipa: '/ˈlaɪ.ən/',
            explanation: '(n) Sư tử - Chúa tể rừng xanh!',
            image: 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=500',
            mode: 'word-guess'
          },
          {
            question: 'Identify this intelligent sea creature:',
            word: 'DOLPHIN',
            ipa: '/ˈdɒl.fɪn/',
            explanation: '(n) Cá heo - Loài động vật biển rất thông minh!',
            image: 'https://images.unsplash.com/photo-1570481662006-a3a1374699e8?w=500',
            mode: 'word-guess'
          },
          {
            question: 'What is the English name for this majestic bird?',
            word: 'EAGLE',
            ipa: '/ˈiː.ɡəl/',
            explanation: '(n) Chim đại bàng - Biểu tượng của sức mạnh!',
            image: 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=500',
            mode: 'word-guess'
          },
          {
            question: 'What is this flightless Antarctic bird called?',
            word: 'PENGUIN',
            ipa: '/ˈpeŋ.ɡwɪn/',
            explanation: '(n) Chim cánh cụt - Sống ở Nam Cực!',
            image: 'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?w=500',
            mode: 'word-guess'
          }
        ]
      },
      {
        name: '🍎 Bộ 2: Đoán Từ Vựng Tiếng Anh - Hoa Quả & Món Ăn (Fruits & Food)',
        mode: 'word-guess',
        questions: [
          {
            question: 'What fruit is displayed in the picture?',
            word: 'APPLE',
            ipa: '/ˈæp.əl/',
            explanation: '(n) Quả táo - An apple a day keeps the doctor away!',
            image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500',
            mode: 'word-guess'
          },
          {
            question: 'Which tropical fruit is shown below?',
            word: 'BANANA',
            ipa: '/bəˈnɑː.nə/',
            explanation: '(n) Quả chuối - Giàu kali và năng lượng tốt!',
            image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500',
            mode: 'word-guess'
          },
          {
            question: 'What sweet berry is shown in the image?',
            word: 'STRAWBERRY',
            ipa: '/ˈstrɔː.bər.i/',
            explanation: '(n) Quả dâu tây - Ngọt ngào và giàu vitamin C!',
            image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500',
            mode: 'word-guess'
          },
          {
            question: 'Name this famous Italian food in English:',
            word: 'PIZZA',
            ipa: '/ˈpiːts.ə/',
            explanation: '(n) Bánh Pizza - Món ăn ưa thích trên toàn thế giới!',
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500',
            mode: 'word-guess'
          },
          {
            question: 'What fast food item is in the picture?',
            word: 'HAMBURGER',
            ipa: '/ˈhæmˌbɜː.ɡər/',
            explanation: '(n) Bánh kẹp Hamburger - Món ăn nhanh nổi tiếng!',
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500',
            mode: 'word-guess'
          }
        ]
      },
      {
        name: '✈️ Bộ 3: Đoán Từ Vựng Tiếng Anh - Phương Tiện (Vehicles)',
        mode: 'word-guess',
        questions: [
          {
            question: 'What fast aircraft is shown in the image?',
            word: 'AIRPLANE',
            ipa: '/ˈeə.pleɪn/',
            explanation: '(n) Máy bay - Phương tiện di chuyển trên không!',
            image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500',
            mode: 'word-guess'
          },
          {
            question: 'Identify this vehicle with rotating blades:',
            word: 'HELICOPTER',
            ipa: '/ˈhel.ɪˌkɒp.tər/',
            explanation: '(n) Máy bay trực thuôc - Có cánh quạt cất cánh thẳng đứng!',
            image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500',
            mode: 'word-guess'
          },
          {
            question: 'What 2-wheeled eco-friendly vehicle is this?',
            word: 'BICYCLE',
            ipa: '/ˈbaɪ.sɪ.kəl/',
            explanation: '(n) Xe đạp - Phương tiện rèn luyện sức khỏe!',
            image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500',
            mode: 'word-guess'
          },
          {
            question: 'What deep-sea underwater vessel is shown?',
            word: 'SUBMARINE',
            ipa: '/ˌsʌb.məˈriːn/',
            explanation: '(n) Tàu ngầm - Hoạt động sâu dưới đáy đại dương!',
            image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500',
            mode: 'word-guess'
          },
          {
            question: 'What 2-wheeled motor vehicle is this?',
            word: 'MOTORCYCLE',
            ipa: '/ˈməʊ.təˌsaɪ.kəl/',
            explanation: '(n) Xe máy / Mô tô - Phương tiện cá nhân phổ biến!',
            image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500',
            mode: 'word-guess'
          }
        ]
      },
      {
        name: '🏠 Bộ 4: Đoán Từ Vựng Tiếng Anh - Đồ Vật Thường Ngày (Objects)',
        mode: 'word-guess',
        questions: [
          {
            question: 'What modern mobile gadget is shown here?',
            word: 'TELEPHONE',
            ipa: '/ˈtel.ɪ.fəʊn/',
            explanation: '(n) Điện thoại - Thiết bị liên lạc cá nhân!',
            image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
            mode: 'word-guess'
          },
          {
            question: 'What device is used to take photographs?',
            word: 'CAMERA',
            ipa: '/ˈkæm.rə/',
            explanation: '(n) Máy ảnh - Lưu giữ những khoảnh khắc đẹp!',
            image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500',
            mode: 'word-guess'
          },
          {
            question: 'What electronic device is in the picture?',
            word: 'COMPUTER',
            ipa: '/kəmˈpjuː.tər/',
            explanation: '(n) Máy tính - Công cụ làm việc và học tập!',
            image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
            mode: 'word-guess'
          },
          {
            question: 'What musical instrument is shown below?',
            word: 'GUITAR',
            ipa: '/ɡɪˈtɑːr/',
            explanation: '(n) Đàn ghita - Nhạc cụ dây tạo âm thanh tuyệt vời!',
            image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500',
            mode: 'word-guess'
          },
          {
            question: 'What item protects you from the rain?',
            word: 'UMBRELLA',
            ipa: '/ʌmˈbrel.ə/',
            explanation: '(n) Cái ô / Cái dù - Che mưa và che nắng hiệu quả!',
            image: 'https://images.unsplash.com/photo-1517479149777-5f3b77a11b9f?w=500',
            mode: 'word-guess'
          }
        ]
      }
    ]
  },
  {
    id: 'did-you-know-facts',
    name: '💡 Did You Know? - 1001 Sự Thật Thú Vị (Fact Shorts)',
    description: 'Video Shorts chia sẻ kiến thức, sự thật thú vị độc lạ kết hợp hiệu ứng hình ảnh Ken Burns & Kinetic Typography',
    badge: 'DID YOU KNOW',
    sampleFiles: [
      { name: 'sample_did_you_know_facts.json', label: '💡 Mẫu JSON Fact Shorts', type: 'json' }
    ],
    sets: [
      {
        name: 'Bộ 1: Sự Thật Thú Vị Về Vũ Trụ & Trái Đất 🌌',
        questions: [
          {
            question: '💡 DID YOU KNOW? Bạn có biết một ngày trên Kim Tinh (Venus) dài hơn bao lâu?',
            optionA: 'Dài hơn 1 năm trên Kim Tinh',
            optionB: 'Bằng 24 giờ trên Trái Đất',
            optionC: 'Dài hơn 100 năm Trái Đất',
            optionD: 'Bằng 12 giờ Trái Đất',
            correctOption: 'A',
            explanation: 'Kim Tinh tự quay quanh trục mất 243 ngày Trái Đất, nhưng quay quanh Mặt Trời chỉ mất 225 ngày. Do đó 1 ngày dài hơn 1 năm!',
            image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800'
          },
          {
            question: '💡 SỰ THẬT THÚ VỊ: Âm thanh trong không gian vũ trụ truyền đi như thế nào?',
            optionA: 'Truyền đi rất nhanh',
            optionB: 'Hoàn toàn không thể truyền đi',
            optionC: 'Chỉ truyền được sóng cực ngắn',
            optionD: 'Vang vọng như trong hang động',
            correctOption: 'B',
            explanation: 'Vũ trụ là môi trường chân không, không có phân tử không khí để sóng âm lan truyền, nên vũ trụ hoàn toàn yên lặng!',
            image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800'
          },
          {
            question: '💡 BẠN CÓ BIẾT: Bao nhiêu phần trăm nước trên Trái Đất là nước ngọt?',
            optionA: 'Chỉ khoảng 3%',
            optionB: 'Khoảng 25%',
            optionC: 'Khoảng 50%',
            optionD: 'Khoảng 70%',
            correctOption: 'A',
            explanation: '97% nước trên Trái Đất là nước mặn ở đại dương. Trong 3% nước ngọt còn lại, hơn 2/3 bị đóng băng ở 2 cực!',
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'
          },
          {
            question: '💡 DID YOU KNOW? Viên kim cương lớn nhất vũ trụ được phát hiện ở đâu?',
            optionA: 'Trong lõi Trái Đất',
            optionB: 'Trái tim của một ngôi sao lùn trắng',
            optionC: 'Trên bề mặt Sao Hỏa',
            optionD: 'Trong vành đai Sao Thổ',
            correctOption: 'B',
            explanation: 'Ngôi sao BPM 37093 (đặt tên là Lucy) là một khối cacbon tinh khiết khổng lồ đã kết tinh thành viên kim cương 10 tỷ tỷ tỷ carat!',
            image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800'
          },
          {
            question: '💡 SỰ THẬT THÚ VỊ: Mặt Trăng đang di chuyển ra xa Trái Đất với tốc độ bao nhiêu?',
            optionA: 'Khoảng 3.8 cm mỗi năm',
            optionB: 'Khoảng 1 mét mỗi năm',
            optionC: 'Khoảng 10 km mỗi năm',
            optionD: 'Mặt Trăng đang tiến lại gần',
            correctOption: 'A',
            explanation: 'Do lực thủy triều, Mặt Trăng đang dần rời xa Trái Đất khoảng 3.8cm mỗi năm, tương đương tốc độ phát triển của móng tay người!',
            image: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=800'
          }
        ]
      },
      {
        name: 'Bộ 2: Kỳ Ẩn Thế Giới Động Vật 🦁',
        questions: [
          {
            question: '💡 DID YOU KNOW? Trái tim của cá voi xanh to bằng kích thước của thứ gì?',
            optionA: 'Một chiếc ô tô nhỏ (Small Car)',
            optionB: 'Một quả bóng đá',
            optionC: 'Một chiếc xe máy',
            optionD: 'Một ngôi nhà 2 tầng',
            correctOption: 'A',
            explanation: 'Trái tim cá voi xanh nặng tới 180kg và to tương đương một chiếc xe hơi Volkswagen Beetle, mạch máu rộng tới mức con người có thể chui qua!',
            image: 'https://images.unsplash.com/photo-1568430462629-a8741d39642d?w=800'
          },
          {
            question: '💡 SỰ THẬT THÚ VỊ: Loài động vật nào sở hữu 9 bộ não và 3 trái tim?',
            optionA: 'Bạch tuộc (Octopus)',
            optionB: 'Cá vàng (Goldfish)',
            optionC: 'Mèo nhà',
            optionD: 'Rùa biển',
            correctOption: 'A',
            explanation: 'Bạch tuộc có 9 bộ não (1 não chính và 8 não phụ ở 8 tua) cùng 3 trái tim, trí thông minh vượt trội có thể mở nắp chai lọ!',
            image: 'https://images.unsplash.com/photo-1545671913-b89ac1b4ac10?w=800'
          },
          {
            question: '💡 BẠN CÓ BIẾT: Dấu vân tay của loài vật nào giống hệt con người?',
            optionA: 'Gấu Koala',
            optionB: 'Tinh tinh',
            optionC: 'Chó Poodle',
            optionD: 'Hổ bengal',
            correctOption: 'A',
            explanation: 'Dấu vân tay của Gấu Koala chi tiết đến mức cảnh sát từng nhầm lẫn với vân tay người tại các hiện trường vụ án!',
            image: 'https://images.unsplash.com/photo-1540573133985-778788177671?w=800'
          },
          {
            question: '💡 DID YOU KNOW? Chim hồng hạc (Flamingo) sinh ra có màu lông gì?',
            optionA: 'Màu xám/trắng',
            optionB: 'Màu hồng tươi',
            optionC: 'Màu đỏ cam',
            optionD: 'Màu vàng chanh',
            correctOption: 'A',
            explanation: 'Hồng hạc sinh ra có màu xám trắng. Màu hồng đặc trưng có được là do chế độ ăn nhiều tôm và tảo chứa sắc tố carotenoid!',
            image: 'https://images.unsplash.com/photo-1516788863098-963d3a042978?w=800'
          },
          {
            question: '💡 SỰ THẬT THÚ VỊ: Loài động vật có vú duy nhất không thể nhảy là loài nào?',
            optionA: 'Con voi (Elephant)',
            optionB: 'Hà mã',
            optionC: 'Tê giác',
            optionD: 'Lạc đà',
            correctOption: 'A',
            explanation: 'Voi là loài động vật có vú duy nhất trên cạn không thể nhảy do khối lượng cơ thể quá nặng và cấu tạo xương bàn chân đặc thù!',
            image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=800'
          }
        ]
      },
      {
        name: 'Bộ 3: Bí Ẩn Cơ Thể Con Người 🧠',
        questions: [
          {
            question: '💡 DID YOU KNOW? Chiều dài tổng cộng của các mạch máu trong cơ thể người là bao nhiêu?',
            optionA: 'Khoảng 100,000 km (Đi 2.5 vòng Trái Đất)',
            optionB: 'Khoảng 1,000 km',
            optionC: 'Khoảng 500 km',
            optionD: 'Khoảng 10,000 km',
            correctOption: 'A',
            explanation: 'Nếu nối tất cả mạch máu của một người trưởng thành lại với nhau, chiều dài lên tới 100,000 km, đủ quấn quanh Trái Đất 2.5 vòng!',
            image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800'
          },
          {
            question: '💡 SỰ THẬT THÚ VỊ: Bộ phận nào trên cơ thể người không có mạch máu nuôi dưỡng?',
            optionA: 'Giác mạc mắt (Cornea)',
            optionB: 'Cuống lưỡi',
            optionC: 'Màng nhĩ',
            optionD: 'Móng tay',
            correctOption: 'A',
            explanation: 'Giác mạc lấy oxy trực tiếp từ không khí xung quanh thay vì qua máu. Đó là bộ phận duy nhất không chứa mạch máu!',
            image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800'
          },
          {
            question: '💡 BẠN CÓ BIẾT: Cơ bắp nào mạnh nhất tính theo tỉ lệ lực năng lượng?',
            optionA: 'Cơ nhai (Masseter muscle)',
            optionB: 'Cơ đùi',
            optionC: 'Cơ tay',
            optionD: 'Cơ tim',
            correctOption: 'A',
            explanation: 'Cơ nhai ở hàm là cơ bắp mạnh nhất cơ thể tính theo trọng lượng, có thể tạo ra lực cắn lên tới hơn 90kg trên răng hàm!',
            image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800'
          },
          {
            question: '💡 DID YOU KNOW? Tốc độ của một cú hắt hơi (Sneeze) có thể đạt tới bao nhiêu?',
            optionA: '160 km/h',
            optionB: '50 km/h',
            optionC: '300 km/h',
            optionD: '20 km/h',
            correctOption: 'A',
            explanation: 'Cú hắt hơi phóng ra hàng ngàn vi giọt bắn với tốc độ lên tới 160 km/h và di chuyển xa hơn 5 mét trong không khí!',
            image: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800'
          },
          {
            question: '💡 SỰ THẬT THÚ VỊ: Não bộ người tạo ra đủ điện năng để thắp sáng cái gì?',
            optionA: 'Một bóng đèn LED nhỏ 10-23W',
            optionB: 'Chỉ đủ chạy đồng hồ đeo tay',
            optionC: 'Một chiếc TV 55 inch',
            optionD: 'Không tạo ra điện',
            correctOption: 'A',
            explanation: 'Khi thức, não bộ người tạo ra khoảng 10-23 Watt công suất điện năng, đủ để thắp sáng một bóng đèn LED nhỏ năng lượng!',
            image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800'
          }
        ]
      },
      {
        name: 'Bộ 4: Độc Lạ Kỳ Quan & Lịch Sử 🏛️',
        questions: [
          {
            question: '💡 DID YOU KNOW? Tháp Eiffel có thể cao thêm bao nhiêu vào mùa hè?',
            optionA: 'Cao thêm 15 cm',
            optionB: 'Không thay đổi',
            optionC: 'Cao thêm 2 mét',
            optionD: 'Thấp đi 10 cm',
            correctOption: 'A',
            explanation: 'Do hiện tượng giãn nở vì nhiệt của kim loại sắt dưới ánh nắng mùa hè, tháp Eiffel cao thêm khoảng 15cm so với mùa đông!',
            image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800'
          },
          {
            question: '💡 SỰ THẬT THÚ VỊ: Đại Kim Tự Tháp Giza từng được bao phủ bởi lớp vỏ gì?',
            optionA: 'Đá vôi trắng bóng nhẵn',
            optionB: 'Vàng nguyên khối',
            optionC: 'Đất nung đỏ',
            optionD: 'Gỗ tuyết tùng',
            correctOption: 'A',
            explanation: 'Ban đầu kim tự tháp được bao phủ bởi lớp đá vôi trắng được mài nhẵn phản chiếu ánh nắng chói lóa như một viên ngọc khổng lồ!',
            image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800'
          },
          {
            question: '💡 BẠN CÓ BIẾT: Cuộc chiến ngắn nhất trong lịch sử thế giới kéo dài bao lâu?',
            optionA: '38 đến 45 phút',
            optionB: '2 ngày',
            optionC: '5 giờ',
            optionD: '1 tuần',
            correctOption: 'A',
            explanation: 'Cuộc chiến Anglo-Zanzibar năm 1896 chỉ kéo dài vỏn vẹn từ 38 đến 45 phút trước khi Vương quốc Zanzibar đầu hàng nước Anh!',
            image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800'
          },
          {
            question: '💡 DID YOU KNOW? Mật ong thiên nhiên (Honey) có bị hỏng theo thời gian không?',
            optionA: 'Không bao giờ bị hỏng',
            optionB: 'Hỏng sau 1 năm',
            optionC: 'Hỏng sau 10 năm',
            optionD: 'Hỏng khi gặp ánh sáng',
            correctOption: 'A',
            explanation: 'Mật ong nguyên chất có độ ẩm cực thấp và độ pH axit giúp ngăn vi khuẩn phát triển. Các nhà khảo cổ từng nếm thử mật ong 3,000 năm tuổi trong lăng mộ Ai Cập vẫn ngon lành!',
            image: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=800'
          },
          {
            question: '💡 SỰ THẬT THÚ VỊ: Đất nước nào có nhiều kim tự tháp nhất thế giới?',
            optionA: 'Sudan (Hơn 220 kim tự tháp)',
            optionB: 'Ai Cập',
            optionC: 'Mexico',
            optionD: 'Trung Quốc',
            correctOption: 'A',
            explanation: 'Mặc dù Ai Cập nổi tiếng nhất, nhưng Sudan mới là quốc gia có nhiều kim tự tháp nhất thế giới với hơn 220 kim tự tháp của đế chế Nubia cổ đại!',
            image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800'
          }
        ]
      }
    ]
  },
  {
    id: 'english-vocab-image',
    name: '🖼️ Đoán Từ Vựng Tiếng Anh Qua Hình Ảnh',
    description: 'Thử thách đoán từ vựng Tiếng Anh qua hình ảnh sinh động với phát âm Tiếng Anh chuẩn (US/UK)',
    badge: 'VOCAB IMAGE',
    sampleFiles: [
      { name: 'mau_4_bo_doan_tu_vung_tieng_anh_hinh_anh.json', label: '🖼️ Mẫu 4 Bộ JSON', type: 'json' },
      { name: 'mau_4_bo_doan_tu_vung_tieng_anh_hinh_anh.csv', label: '🖼️ Mẫu 4 Bộ CSV', type: 'csv' }
    ],
    sets: [
      {
        name: 'Bộ 1: Đoán Từ Vựng Tiếng Anh - Động Vật (Animals)',
        questions: [
          {
            question: 'What is the name of this animal in English?',
            optionA: 'Elephant',
            optionB: 'Rhinoceros',
            optionC: 'Hippopotamus',
            optionD: 'Giraffe',
            correctOption: 'A',
            explanation: 'Elephant /ˈel.ɪ.fənt/ (n): Con voi - Loài động vật trên cạn lớn nhất thế giới!',
            image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=400'
          },
          {
            question: 'Which word matches the image below?',
            optionA: 'Tiger',
            optionB: 'Lion',
            optionC: 'Leopard',
            optionD: 'Cheetah',
            correctOption: 'B',
            explanation: 'Lion /ˈlaɪ.ən/ (n): Sư tử - Chúa tể rừng xanh!',
            image: 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=400'
          },
          {
            question: 'What animal is shown in the picture?',
            optionA: 'Shark',
            optionB: 'Whale',
            optionC: 'Dolphin',
            optionD: 'Seal',
            correctOption: 'C',
            explanation: 'Dolphin /ˈdɒl.fɪn/ (n): Cá heo - Loài động vật biển rất thông minh!',
            image: 'https://images.unsplash.com/photo-1570481662006-a3a1374699e8?w=400'
          },
          {
            question: 'Identify this bird in English:',
            optionA: 'Hawk',
            optionB: 'Falcon',
            optionC: 'Eagle',
            optionD: 'Owl',
            correctOption: 'C',
            explanation: 'Eagle /ˈiː.ɡəl/ (n): Chim đại bàng - Biểu tượng của sức mạnh!',
            image: 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=400'
          },
          {
            question: 'What is this flightless bird called?',
            optionA: 'Penguin',
            optionB: 'Puffin',
            optionC: 'Seagull',
            optionD: 'Duck',
            correctOption: 'A',
            explanation: 'Penguin /ˈpeŋ.ɡwɪn/ (n): Chim cánh cụt - Sống ở vùng Nam Cực lạnh giá!',
            image: 'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?w=400'
          }
        ]
      },
      {
        name: 'Bộ 2: Đoán Từ Vựng Tiếng Anh - Hoa Quả & Thực Phẩm (Fruits & Food)',
        questions: [
          {
            question: 'What fruit is displayed in the picture?',
            optionA: 'Peach',
            optionB: 'Apple',
            optionC: 'Pear',
            optionD: 'Plum',
            correctOption: 'B',
            explanation: 'Apple /ˈæp.əl/ (n): Quả táo - An apple a day keeps the doctor away!',
            image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400'
          },
          {
            question: 'Which tropical fruit is shown below?',
            optionA: 'Banana',
            optionB: 'Mango',
            optionC: 'Papaya',
            optionD: 'Pineapple',
            correctOption: 'A',
            explanation: 'Banana /bəˈnɑː.nə/ (n): Quả chuối - Giàu kali và năng lượng tốt!',
            image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400'
          },
          {
            question: 'What berry is shown in the image?',
            optionA: 'Cherry',
            optionB: 'Blueberry',
            optionC: 'Strawberry',
            optionD: 'Raspberry',
            correctOption: 'C',
            explanation: 'Strawberry /ˈstrɔː.bər.i/ (n): Quả dâu tây - Ngọt ngào và giàu vitamin C!',
            image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400'
          },
          {
            question: 'Name this popular Italian dish in English:',
            optionA: 'Pasta',
            optionB: 'Pizza',
            optionC: 'Lasagna',
            optionD: 'Sandwich',
            correctOption: 'B',
            explanation: 'Pizza /ˈpiːts.ə/ (n): Bánh Pizza - Món ăn ưa thích trên toàn thế giới!',
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400'
          },
          {
            question: 'What fast food item is this?',
            optionA: 'Hotdog',
            optionB: 'Taco',
            optionC: 'Burger',
            optionD: 'Burrito',
            correctOption: 'C',
            explanation: 'Burger /ˈbɜː.ɡər/ (n): Bánh kẹp Hamburger!',
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'
          }
        ]
      },
      {
        name: 'Bộ 3: Đoán Từ Vựng Tiếng Anh - Đồ Vật Hàng Ngày (Everyday Objects)',
        questions: [
          {
            question: 'What device is shown in the picture?',
            optionA: 'Watch',
            optionB: 'Clock',
            optionC: 'Compass',
            optionD: 'Timer',
            correctOption: 'B',
            explanation: 'Clock /klɒk/ (n): Đồng hồ treo tường / Đồng hồ để bàn!',
            image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400'
          },
          {
            question: 'Which object is used for taking photos?',
            optionA: 'Telescope',
            optionB: 'Microscope',
            optionC: 'Camera',
            optionD: 'Projector',
            correctOption: 'C',
            explanation: 'Camera /ˈkæm.rə/ (n): Máy ảnh / Máy chụp hình!',
            image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400'
          },
          {
            question: 'What electronic device is this?',
            optionA: 'Tablet',
            optionB: 'Monitor',
            optionC: 'Laptop',
            optionD: 'Keyboard',
            correctOption: 'C',
            explanation: 'Laptop /ˈlæp.tɒp/ (n): Máy tính xách tay!',
            image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'
          },
          {
            question: 'What accessory is used for listening to music?',
            optionA: 'Speaker',
            optionB: 'Microphone',
            optionC: 'Headphones',
            optionD: 'Earbuds',
            correctOption: 'C',
            explanation: 'Headphones /ˈhed.fəʊnz/ (n): Tai nghe trùm đầu!',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'
          },
          {
            question: 'What object is used for reading?',
            optionA: 'Notebook',
            optionB: 'Magazine',
            optionC: 'Book',
            optionD: 'Newspaper',
            correctOption: 'C',
            explanation: 'Book /bʊk/ (n): Sách - Kho tàng tri thức!',
            image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'
          }
        ]
      },
      {
        name: 'Bộ 4: Đoán Từ Vựng Tiếng Anh - Phương Tiện Giao Thông (Vehicles)',
        questions: [
          {
            question: 'What two-wheeled vehicle is this?',
            optionA: 'Scooter',
            optionB: 'Bicycle',
            optionC: 'Motorcycle',
            optionD: 'Skateboard',
            correctOption: 'B',
            explanation: 'Bicycle /ˈbaɪ.sɪ.kəl/ (n): Xe đạp!',
            image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400'
          },
          {
            question: 'What mode of air transport is shown?',
            optionA: 'Rocket',
            optionB: 'Helicopter',
            optionC: 'Airplane',
            optionD: 'Jet',
            correctOption: 'C',
            explanation: 'Airplane /ˈeə.pleɪn/ (n): Máy bay!',
            image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400'
          },
          {
            question: 'What aircraft with rotating blades is this?',
            optionA: 'Glider',
            optionB: 'Drone',
            optionC: 'Helicopter',
            optionD: 'Blimp',
            correctOption: 'C',
            explanation: 'Helicopter /ˈhel.ɪˌkɒp.tər/ (n): Máy bay trực thăng!',
            image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400'
          },
          {
            question: 'What motorized two-wheeler is shown below?',
            optionA: 'Bicycle',
            optionB: 'Motorcycle',
            optionC: 'Moped',
            optionD: 'ATV',
            correctOption: 'B',
            explanation: 'Motorcycle /ˈməʊ.təˌsaɪ.kəl/ (n): Xe máy / Mô tô!',
            image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400'
          },
          {
            question: 'What rail vehicle is depicted in the photo?',
            optionA: 'Tram',
            optionB: 'Subway',
            optionC: 'Train',
            optionD: 'Monorail',
            correctOption: 'C',
            explanation: 'Train /treɪn/ (n): Tàu hỏa / Xe lửa!',
            image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400'
          }
        ]
      }
    ]
  },
  {
    id: 'trivia',
    name: '🧠 Đố Vui Trí Tuệ & Kiến Thức',
    description: 'Những câu hỏi đố vui kiến thức tổng hợp thú vị',
    badge: 'TRÍ TUỆ',
    sampleFiles: [
      { name: 'mau_4_bo_cau_hoi_trac_nghiem.json', label: 'Mẫu 4 Bộ JSON', type: 'json' },
      { name: 'mau_4_bo_cau_hoi_trac_nghiem.csv', label: 'Mẫu 4 Bộ CSV', type: 'csv' }
    ],
    questions: [
      {
        question: 'Thành phố nào là thủ đô của Việt Nam?',
        optionA: 'TP. Hồ Chí Minh',
        optionB: 'Hà Nội',
        optionC: 'Đà Nẵng',
        optionD: 'Cần Thơ',
        correctOption: 'B',
        explanation: 'Hà Nội là thủ đô ngàn năm văn hiến của Việt Nam!'
      },
      {
        question: 'Hành tinh nào nằm gần Mặt Trời nhất trong Hệ Mặt Trời?',
        optionA: 'Trái Đất',
        optionB: 'Sao Hỏa',
        optionC: 'Sao Thủy (Mercury)',
        optionD: 'Sao Kim (Venus)',
        correctOption: 'C',
        explanation: 'Sao Thủy là hành tinh nhỏ nhất và nằm gần Mặt Trời nhất!'
      },
      {
        question: 'Quốc gia nào có diện tích lãnh thổ lớn nhất thế giới?',
        optionA: 'Nước Nga',
        optionB: 'Nước Mỹ',
        optionC: 'Trung Quốc',
        optionD: 'Canada',
        correctOption: 'A',
        explanation: 'Nước Nga có diện tích hơn 17 triệu km² trải dài từ Á sang Âu!'
      },
      {
        question: 'Động vật nào là loài có kích thước lớn nhất hành tinh hiện nay?',
        optionA: 'Voi Châu Phi',
        optionB: 'Cá voi xanh',
        optionC: 'Hươu cao cổ',
        optionD: 'Cá mập trắng',
        correctOption: 'B',
        explanation: 'Cá voi xanh có thể dài 30m và nặng tới 180 tấn!'
      },
      {
        question: 'Một năm nhuận theo Dương lịch có bao nhiêu ngày?',
        optionA: '365 ngày',
        optionB: '366 ngày',
        optionC: '364 ngày',
        optionD: '367 ngày',
        correctOption: 'B',
        explanation: 'Năm nhuận tháng 2 có 29 ngày, tổng cộng 366 ngày!'
      }
    ]
  },
  {
    id: 'english-speed',
    name: '🇬🇧 Trắc Nghiệm Tiếng Anh Siêu Tốc',
    description: 'Thử thách ngữ pháp và từ vựng Tiếng Anh cơ bản',
    badge: 'ENGLISH',
    questions: [
      {
        question: 'Which planet is known as the "Red Planet"?',
        optionA: 'Earth',
        optionB: 'Mars',
        optionC: 'Jupiter',
        optionD: 'Venus',
        correctOption: 'B',
        explanation: 'Mars is called the Red Planet because of iron oxide on its surface!'
      },
      {
        question: 'What is the opposite of the word "BUY"?',
        optionA: 'Pay',
        optionB: 'Cost',
        optionC: 'Sell',
        optionD: 'Borrow',
        correctOption: 'C',
        explanation: 'The opposite of buy (mua) is sell (bán).'
      },
      {
        question: 'How many letters are there in the English alphabet?',
        optionA: '24 letters',
        optionB: '25 letters',
        optionC: '26 letters',
        optionD: '28 letters',
        correctOption: 'C',
        explanation: 'The modern English alphabet consists of 26 letters.'
      },
      {
        question: 'She _____ to school by bus every morning.',
        optionA: 'go',
        optionB: 'goes',
        optionC: 'going',
        optionD: 'went',
        correctOption: 'B',
        explanation: 'Chủ ngữ ngôi thứ 3 số ít "She" đi với động từ chia "goes".'
      },
      {
        question: 'Which ocean is the largest on Earth?',
        optionA: 'Atlantic Ocean',
        optionB: 'Pacific Ocean',
        optionC: 'Indian Ocean',
        optionD: 'Arctic Ocean',
        correctOption: 'B',
        explanation: 'The Pacific Ocean (Thái Bình Dương) covers 30% of Earth surface!'
      }
    ]
  },
  {
    id: 'history-geo',
    name: '🇻🇳 Địa Lý & Văn Hoá Việt Nam',
    description: 'Khám phá danh lam thắng cảnh và văn hoá Việt Nam',
    badge: 'VIỆT NAM',
    questions: [
      {
        question: 'Ngọn núi nào được mệnh danh là "Nóc nhà Đông Dương"?',
        optionA: 'Núi Fansipan',
        optionB: 'Núi Ba Vì',
        optionC: 'Núi Yên Tử',
        optionD: 'Núi Langbiang',
        correctOption: 'A',
        explanation: 'Fansipan cao 3.143m tại Lào Cai, là đỉnh núi cao nhất Đông Dương!'
      },
      {
        question: 'Tác phẩm kiệt tác "Truyện Kiều" là của danh nhân văn hoá nào?',
        optionA: 'Nguyễn Trãi',
        optionB: 'Nguyễn Du',
        optionC: 'Hồ Xuân Hương',
        optionD: 'Đoàn Thị Điểm',
        correctOption: 'B',
        explanation: 'Đại thi hào Nguyễn Du sáng tác Truyện Kiều bất hủ!'
      },
      {
        question: 'Con sông nào dài nhất chảy hoàn toàn trên lãnh thổ Việt Nam?',
        optionA: 'Sông Hồng',
        optionB: 'Sông Đồng Nai',
        optionC: 'Sông Mê Kông',
        optionD: 'Sông Mã',
        correctOption: 'B',
        explanation: 'Sông Đồng Nai có chiều dài 586 km nội địa Việt Nam!'
      },
      {
        question: 'Vịnh Hạ Long vinh dự thuộc tỉnh nào của Việt Nam?',
        optionA: 'Hải Phòng',
        optionB: 'Quảng Ninh',
        optionC: 'Thừa Thiên Huế',
        optionD: 'Ninh Bình',
        correctOption: 'B',
        explanation: 'Vịnh Hạ Long là di sản thiên nhiên thế giới thuộc tỉnh Quảng Ninh!'
      },
      {
        question: 'Món ăn nào của Việt Nam được Oxford đưa vào từ điển toàn cầu?',
        optionA: 'Bún chả',
        optionB: 'Bánh xèo',
        optionC: 'Phở & Bánh mì',
        optionD: 'Gỏi cuốn',
        correctOption: 'C',
        explanation: '"Pho" và "Banh mi" được giữ nguyên danh xưng trong từ điển quốc tế!'
      }
    ]
  },
  {
    id: 'flags',
    name: '🚩 Nhìn Cờ Đoán Quốc Gia',
    description: 'Thử thách đoán quốc kỳ các nước Châu Á, Châu Âu, Châu Mỹ, Châu Phi theo phong cách Đoán Ô Chữ B1',
    badge: 'QUỐC KỲ',
    mode: 'flags',
    guessTime: 3,
    sampleFiles: [
      { name: 'mau_nhin_co_doan_quoc_gia.json', label: '🚩 Mẫu JSON Nhìn Cờ Đoán Quốc Gia', type: 'json' },
      { name: 'mau_doan_quoc_gia_5_goi_y.json', label: '🌎 Mẫu JSON Đoán Quốc Gia 5 Gợi Ý', type: 'json' }
    ],
    sets: [
      {
        name: 'Bộ 1: Nhìn Cờ Đoán Quốc Gia - Châu Á',
        topic: 'NHÌN CỜ ĐOÁN NƯỚC',
        headerTitle: 'ĐÂY LÀ QUỐC GIA NÀO?',
        mode: 'flags',
        questions: [
          {
            question: 'Đây là nước nào?',
            optionA: 'Hàn Quốc',
            optionB: 'Trung Quốc',
            optionC: 'Nhật Bản',
            optionD: 'Việt Nam',
            correctOption: 'C',
            explanation: 'Cờ Nhật Bản có nền trắng với hình tròn đỏ ở giữa, tượng trưng cho Mặt Trời!',
            image: 'https://flagcdn.com/w320/jp.png'
          },
          {
            question: 'Đây là nước nào?',
            optionA: 'Hàn Quốc',
            optionB: 'Thái Lan',
            optionC: 'Triều Tiên',
            optionD: 'Mông Cổ',
            correctOption: 'A',
            explanation: 'Cờ Hàn Quốc (Taegukgi) có biểu tượng âm dương ở giữa và 4 quẻ bát quái ở góc!',
            image: 'https://flagcdn.com/w320/kr.png'
          },
          {
            question: 'Đây là nước nào?',
            optionA: 'Lào',
            optionB: 'Campuchia',
            optionC: 'Thái Lan',
            optionD: 'Myanmar',
            correctOption: 'C',
            explanation: 'Cờ Thái Lan gồm 5 sọc ngang đỏ - trắng - lam - trắng - đỏ!',
            image: 'https://flagcdn.com/w320/th.png'
          },
          {
            question: 'Đây là nước nào?',
            optionA: 'Ấn Độ',
            optionB: 'Bangladesh',
            optionC: 'Sri Lanka',
            optionD: 'Pakistan',
            correctOption: 'A',
            explanation: 'Cờ Ấn Độ có 3 sọc ngang cam - trắng - xanh lá với bánh xe Ashoka Chakra màu xanh dương ở giữa!',
            image: 'https://flagcdn.com/w320/in.png'
          },
          {
            question: 'Đây là nước nào?',
            optionA: 'Malaysia',
            optionB: 'Singapore',
            optionC: 'Indonesia',
            optionD: 'Brunei',
            correctOption: 'B',
            explanation: 'Cờ Singapore có 2 phần đỏ - trắng, với hình trăng lưỡi liềm và 5 ngôi sao trắng!',
            image: 'https://flagcdn.com/w320/sg.png'
          }
        ]
      },
      {
        name: 'Bộ 2: Nhìn Cờ Đoán Quốc Gia - Châu Âu',
        topic: 'NHÌN CỜ ĐOÁN NƯỚC',
        headerTitle: 'ĐÂY LÀ QUỐC GIA NÀO?',
        mode: 'flags',
        questions: [
          {
            question: 'Đây là nước nào?',
            optionA: 'Hà Lan',
            optionB: 'Ý',
            optionC: 'Pháp',
            optionD: 'Luxembourg',
            correctOption: 'C',
            explanation: 'Cờ Pháp gồm 3 sọc dọc xanh dương - trắng - đỏ, biểu tượng của cuộc Cách mạng Pháp!',
            image: 'https://flagcdn.com/w320/fr.png'
          },
          {
            question: 'Đây là nước nào?',
            optionA: 'Bỉ',
            optionB: 'Đức',
            optionC: 'Áo',
            optionD: 'Hà Lan',
            correctOption: 'B',
            explanation: 'Cờ Đức gồm 3 sọc ngang đen - đỏ - vàng!',
            image: 'https://flagcdn.com/w320/de.png'
          },
          {
            question: 'Đây là nước nào?',
            optionA: 'Anh (Vương quốc Anh)',
            optionB: 'Úc',
            optionC: 'New Zealand',
            optionD: 'Ireland',
            correctOption: 'A',
            explanation: 'Cờ Union Jack của Vương quốc Anh kết hợp 3 chữ thập của Anh, Scotland và Ireland!',
            image: 'https://flagcdn.com/w320/gb.png'
          },
          {
            question: 'Đây là nước nào?',
            optionA: 'Mexico',
            optionB: 'Ireland',
            optionC: 'Hungary',
            optionD: 'Ý',
            correctOption: 'D',
            explanation: 'Cờ Ý gồm 3 sọc dọc xanh lá - trắng - đỏ, rất giống cờ Mexico nhưng khác quốc huy!',
            image: 'https://flagcdn.com/w320/it.png'
          },
          {
            question: 'Đây là nước nào?',
            optionA: 'Bồ Đào Nha',
            optionB: 'Tây Ban Nha',
            optionC: 'Andorra',
            optionD: 'Colombia',
            correctOption: 'B',
            explanation: 'Cờ Tây Ban Nha có sọc đỏ - vàng đậm - đỏ với quốc huy in trên nền vàng!',
            image: 'https://flagcdn.com/w320/es.png'
          }
        ]
      },
      {
        name: 'Bộ 3: Nhìn Cờ Đoán Quốc Gia - Châu Mỹ',
        topic: 'NHÌN CỜ ĐOÁN NƯỚC',
        headerTitle: 'ĐÂY LÀ QUỐC GIA NÀO?',
        mode: 'flags',
        questions: [
          {
            question: 'Đây là nước nào?',
            optionA: 'Canada',
            optionB: 'Mỹ',
            optionC: 'Liberia',
            optionD: 'Puerto Rico',
            correctOption: 'B',
            explanation: 'Cờ Mỹ có 50 ngôi sao đại diện 50 bang và 13 sọc đại diện 13 thuộc địa đầu tiên!',
            image: 'https://flagcdn.com/w320/us.png'
          },
          {
            question: 'Đây là nước nào?',
            optionA: 'Canada',
            optionB: 'Peru',
            optionC: 'Áo',
            optionD: 'Thụy Sĩ',
            correctOption: 'A',
            explanation: 'Cờ Canada nổi bật với chiếc lá phong đỏ ở giữa nền trắng!',
            image: 'https://flagcdn.com/w320/ca.png'
          },
          {
            question: 'Đây là nước nào?',
            optionA: 'Brazil',
            optionB: 'Argentina',
            optionC: 'Bolivia',
            optionD: 'Paraguay',
            correctOption: 'A',
            explanation: 'Cờ Brazil có hình thoi vàng trên nền xanh lá, với quả cầu xanh dương và dòng chữ "Ordem e Progresso"!',
            image: 'https://flagcdn.com/w320/br.png'
          },
          {
            question: 'Đây là nước nào?',
            optionA: 'Uruguay',
            optionB: 'Argentina',
            optionC: 'Chile',
            optionD: 'Guatemala',
            correctOption: 'B',
            explanation: 'Cờ Argentina có 3 sọc ngang xanh dương nhạt - trắng - xanh dương nhạt với mặt trời vàng ở giữa!',
            image: 'https://flagcdn.com/w320/ar.png'
          },
          {
            question: 'Đây là nước nào?',
            optionA: 'Ý',
            optionB: 'Mexico',
            optionC: 'Hungary',
            optionD: 'Bulgaria',
            correctOption: 'B',
            explanation: 'Cờ Mexico có 3 sọc dọc xanh lá - trắng - đỏ, với quốc huy hình đại bàng bắt rắn ở giữa!',
            image: 'https://flagcdn.com/w320/mx.png'
          }
        ]
      },
      {
        name: 'Bộ 4: Nhìn Cờ Đoán Quốc Gia - Châu Phi & Châu Đại Dương',
        topic: 'NHÌN CỜ ĐOÁN NƯỚC',
        headerTitle: 'ĐÂY LÀ QUỐC GIA NÀO?',
        mode: 'flags',
        questions: [
          {
            question: 'Đây là nước nào?',
            optionA: 'Kenya',
            optionB: 'Nam Phi',
            optionC: 'Nigeria',
            optionD: 'Ai Cập',
            correctOption: 'B',
            explanation: 'Cờ Nam Phi nổi bật với 6 màu sắc và hình chữ Y đặc trưng, tượng trưng cho sự hội tụ và thống nhất!',
            image: 'https://flagcdn.com/w320/za.png'
          },
          {
            question: 'Đây là nước nào?',
            optionA: 'Ai Cập',
            optionB: 'Iraq',
            optionC: 'Syria',
            optionD: 'Yemen',
            correctOption: 'A',
            explanation: 'Cờ Ai Cập có 3 sọc ngang đỏ - trắng - đen, với biểu tượng đại bàng vàng ở giữa!',
            image: 'https://flagcdn.com/w320/eg.png'
          },
          {
            question: 'Đây là nước nào?',
            optionA: 'Ethiopia',
            optionB: 'Kenya',
            optionC: 'Tanzania',
            optionD: 'Uganda',
            correctOption: 'B',
            explanation: 'Cờ Kenya có sọc đen - đỏ - xanh lá với khiên và giáo truyền thống Maasai ở giữa!',
            image: 'https://flagcdn.com/w320/ke.png'
          },
          {
            question: 'Đây là nước nào?',
            optionA: 'New Zealand',
            optionB: 'Úc',
            optionC: 'Fiji',
            optionD: 'Papua New Guinea',
            correctOption: 'B',
            explanation: 'Cờ Úc có Union Jack ở góc trên trái cùng ngôi sao Liên bang và chòm sao Nam Thập Tự!',
            image: 'https://flagcdn.com/w320/au.png'
          },
          {
            question: 'Đây là nước nào?',
            optionA: 'Úc',
            optionB: 'New Zealand',
            optionC: 'Samoa',
            optionD: 'Fiji',
            correctOption: 'B',
            explanation: 'Cờ New Zealand cũng có Union Jack và chòm sao Nam Thập Tự nhưng chỉ với 4 ngôi sao đỏ viền trắng!',
            image: 'https://flagcdn.com/w320/nz.png'
          }
        ]
      }
    ]
  }
];
