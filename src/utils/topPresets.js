// Top 10 / Top 5 Video Presets Data

export const DEFAULT_TOP_JSON = {
  id: 'top-10-companies',
  title: 'TOP 10 CÔNG TY LỚN NHẤT THẾ GIỚI',
  subtitle: 'Bảng xếp hạng dựa trên Vốn hóa thị trường (USD)',
  coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1080&q=80',
  theme: 'gold-luxury', // 'gold-luxury' | 'neon-cyber' | 'blue-ocean' | 'red-fire'
  voice: 'vi-VN-HoaiMyNeural',
  voiceSpeed: 1.5,
  timePerItem: 5.5,
  headerIcon: '🏆',
  items: [
    {
      id: 10,
      rank: 10,
      name: 'TSMC (Đài Loan)',
      badge: 'TOP 10',
      metric: 'Vốn hóa: ~$900 Tỷ USD',
      description: 'Nhà sản xuất vi mạch bán dẫn hợp đồng lớn nhất thế giới, cung cấp chip cho Apple và Nvidia.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 9,
      rank: 9,
      name: 'Eli Lilly (Mỹ)',
      badge: 'TOP 9',
      metric: 'Vốn hóa: ~$920 Tỷ USD',
      description: 'Tập đoàn dược phẩm toàn cầu đột phá với các dòng thuốc giảm cân và điều trị tiểu đường thế hệ mới.',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 8,
      rank: 8,
      name: 'Broadcom (Mỹ)',
      badge: 'TOP 8',
      metric: 'Vốn hóa: ~$960 Tỷ USD',
      description: 'Gã khổng lồ thiết kế vi chip hạ tầng mạng và công nghệ trí tuệ nhân tạo (AI).',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 7,
      rank: 7,
      name: 'Tesla (Mỹ)',
      badge: 'TOP 7',
      metric: 'Vốn hóa: ~$1.000 Tỷ USD',
      description: 'Hãng xe điện tiên phong toàn cầu do tỷ phú Elon Musk dẫn dắt, dẫn đầu về công nghệ tự lái.',
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 6,
      rank: 6,
      name: 'Meta (Facebook)',
      badge: 'TOP 6',
      metric: 'Vốn hóa: ~$1.400 Tỷ USD',
      description: 'Tập đoàn truyền thông sở hữu Facebook, Instagram, WhatsApp và công nghệ thực tế ảo Metaverse.',
      image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 5,
      rank: 5,
      name: 'Saudi Aramco',
      badge: 'TOP 5',
      metric: 'Vốn hóa: ~$1.800 Tỷ USD',
      description: 'Công ty năng lượng & dầu khí quốc gia của Saudi Arabia với sản lượng dầu thô khổng lồ.',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 4,
      rank: 4,
      name: 'Amazon (Mỹ)',
      badge: 'TOP 4',
      metric: 'Vốn hóa: ~$2.100 Tỷ USD',
      description: 'Đế chế thương mại điện tử lớn nhất hành tinh cùng dịch vụ điện toán đám mây AWS.',
      image: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      rank: 3,
      name: 'Alphabet (Google)',
      badge: 'TOP 3',
      metric: 'Vốn hóa: ~$2.300 Tỷ USD',
      description: 'Công ty mẹ của công cụ tìm kiếm Google, YouTube, hệ điều hành Android và trí tuệ nhân tạo Gemini.',
      image: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      rank: 2,
      name: 'Microsoft (Mỹ)',
      badge: 'TOP 2',
      metric: 'Vốn hóa: ~$3.100 Tỷ USD',
      description: 'Gã khổng lồ phần mềm máy tính Windows, Azure Cloud và là nhà đầu tư chiến lược cho OpenAI.',
      image: 'https://images.unsplash.com/photo-1642132652859-3ef5a1048fd1?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 1,
      rank: 1,
      name: 'Apple (Mỹ)',
      badge: '👑 TOP 1',
      metric: 'Vốn hóa: ~$3.400 Tỷ USD',
      description: 'Thương hiệu công nghệ giá trị nhất thế giới với iPhone, iPad, Mac và hệ sinh thái iOS đỉnh cao.',
      image: 'https://images.unsplash.com/photo-1616469829941-c7200edec809?auto=format&fit=crop&w=800&q=80'
    }
  ]
};

export const TOP_PRESETS = [
  {
    id: 'top-10-companies',
    name: '🏢 Top 10 Công Ty Lớn Nhất Thế Giới',
    data: DEFAULT_TOP_JSON
  },
  {
    id: 'top-5-countries',
    name: '🌎 Top 5 Quốc Gia Có Diện Tích Lớn Nhất',
    data: {
      id: 'top-5-countries',
      title: 'TOP 5 QUỐC GIA LỚN NHẤT THẾ GIỚI',
      subtitle: 'Bảng xếp hạng dựa theo Tổng Diện Tích Lãnh Thổ (km²)',
      coverImage: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1080&q=80',
      theme: 'blue-ocean',
      voice: 'vi-VN-HoaiMyNeural',
      voiceSpeed: 1.5,
      timePerItem: 5.5,
      headerIcon: '🌍',
      items: [
        {
          id: 5,
          rank: 5,
          name: 'Brazil 🇧🇷',
          badge: 'TOP 5',
          metric: 'Diện tích: ~8,5 Triệu km²',
          description: 'Quốc gia lớn nhất Nam Mỹ, sở hữu cánh rừng rậm Amazon - "lá phổi xanh" của Trái Đất.',
          image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 4,
          rank: 4,
          name: 'Trung Quốc 🇨🇳',
          badge: 'TOP 4',
          metric: 'Diện tích: ~9,6 Triệu km²',
          description: 'Quốc gia lớn nhất châu Á với bề dày lịch sử hàng ngàn năm cùng kỳ quan Vạn Lý Trường Thành.',
          image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 3,
          rank: 3,
          name: 'Hoa Kỳ (Mỹ) 🇺🇸',
          badge: 'TOP 3',
          metric: 'Diện tích: ~9,8 Triệu km²',
          description: 'Siêu cường kinh tế & quân số thế giới với địa hình đa dạng từ bờ Đông sang bờ Tây.',
          image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 2,
          rank: 2,
          name: 'Canada 🇨🇦',
          badge: 'TOP 2',
          metric: 'Diện tích: ~9,98 Triệu km²',
          description: 'Quốc gia Bắc Mỹ nổi tiếng với cảnh quan thiên nhiên hùng vĩ, hồ nước trong xanh và tuyết trắng.',
          image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 1,
          rank: 1,
          name: 'Liên Bang Nga 🇷🇺',
          badge: '👑 TOP 1',
          metric: 'Diện tích: ~17,1 Triệu km²',
          description: 'Quốc gia có diện tích lớn nhất hành tinh, trải dài qua 11 múi giờ trên cả 2 châu lục Á - Âu.',
          image: 'https://images.unsplash.com/photo-1513326718677-b964603b136d?auto=format&fit=crop&w=800&q=80'
        }
      ]
    }
  },
  {
    id: 'top-5-cities',
    name: '🏙️ Top 5 Thành Phố Đông Dân Nhất Thế Giới',
    data: {
      id: 'top-5-cities',
      title: 'TOP 5 THÀNH PHỐ ĐÔNG DÂN NHẤT THẾ GIỚI',
      subtitle: 'Thống kê Dân số Vùng Đô thị (Triệu người)',
      coverImage: 'https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?auto=format&fit=crop&w=1080&q=80',
      theme: 'neon-cyber',
      voice: 'vi-VN-HoaiMyNeural',
      voiceSpeed: 1.5,
      timePerItem: 5.5,
      headerIcon: '🏙️',
      items: [
        {
          id: 5,
          rank: 5,
          name: 'Mumbai (Ấn Độ) 🇮🇳',
          badge: 'TOP 5',
          metric: 'Dân số: ~21 Triệu người',
          description: 'Trung tâm tài chính kinh tế sầm uất nhất Ấn Độ và là thủ phủ điện ảnh Bollywood.',
          image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 4,
          rank: 4,
          name: 'Dhaka (Bangladesh) 🇧🇩',
          badge: 'TOP 4',
          metric: 'Dân số: ~23 Triệu người',
          description: 'Thành phố có mật độ dân số cao bậc nhất hành tinh với nhịp sống nhộn nhịp năng động.',
          image: 'https://images.unsplash.com/photo-1608987483669-79a6136d1b2a?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 3,
          rank: 3,
          name: 'Thượng Hải (Trung Quốc) 🇨🇳',
          badge: 'TOP 3',
          metric: 'Dân số: ~29 Triệu người',
          description: 'Siêu đô thị hiện đại với tháp Truyền hình Bến Thượng Hải và trung tâm tài chính Châu Á.',
          image: 'https://images.unsplash.com/photo-1538428494232-9c0d8a3ab390?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 2,
          rank: 2,
          name: 'Delhi (Ấn Độ) 🇮🇳',
          badge: 'TOP 2',
          metric: 'Dân số: ~33 Triệu người',
          description: 'Vùng thủ đô rộng lớn quy tụ văn hóa lịch sử lâu đời cùng tốc độ đô thị hóa nhanh chóng.',
          image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 1,
          rank: 1,
          name: 'Tokyo (Nhật Bản) 🇯🇵',
          badge: '👑 TOP 1',
          metric: 'Dân số: ~37 Triệu người',
          description: 'Vùng đô thị lớn và đông dân nhất thế giới, giao thoa giữa hiện đại bậc nhất và truyền thống.',
          image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80'
        }
      ]
    }
  }
];
