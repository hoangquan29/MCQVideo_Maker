import React, { useState } from 'react';
import { 
  BookOpen, 
  Grid, 
  Edit3, 
  Flag, 
  History, 
  Lightbulb,
  Globe,
  Trophy,
  Heart,
  Sparkles,
  Utensils,
  MapPin,
  Search,
  ChevronLeft,
  ChevronRight,
  Film,
  Layers,
  CheckCircle2,
  X
} from 'lucide-react';

export const VIDEO_CATEGORIES = [
  {
    id: 'quiz',
    title: 'Trắc Nghiệm & Đố Vui',
    icon: HelpCircleIcon,
    items: [
      {
        id: 'dia-ly-van-hoa-viet-nam',
        mode: 'mcq',
        presetId: 'dia-ly-van-hoa-viet-nam',
        name: 'Địa Lý & Văn Hóa VN',
        badgeEmoji: '🇻🇳',
        icon: MapPin,
        desc: 'Trắc nghiệm địa lý, danh thắng 4 đáp án'
      },
      {
        id: 'landmark-guess',
        mode: 'mcq',
        presetId: 'landmark-guess',
        name: 'Đoán Địa Điểm',
        badgeEmoji: '🏰',
        icon: Globe,
        desc: 'Nhìn ảnh đoán kỳ quan & địa danh'
      },
      {
        id: 'food-guess',
        mode: 'mcq',
        presetId: 'food-guess',
        name: 'Đoán Món Ăn',
        badgeEmoji: '🍳',
        icon: Utensils,
        desc: 'Nhìn hình đoán món ăn đặc sản'
      },
      {
        id: 'player-guess',
        mode: 'mcq',
        presetId: 'player-guess',
        name: 'Đoán Cầu Thủ',
        badgeEmoji: '⚽',
        icon: Trophy,
        desc: 'Nhìn ảnh đoán tên siêu sao bóng đá'
      },
      {
        id: 'flags',
        mode: 'mcq',
        presetId: 'flags',
        name: 'Đố Cờ Các Nước',
        badgeEmoji: '🚩',
        icon: Flag,
        desc: 'Đoán quốc kỳ các quốc gia thế giới'
      },
      {
        id: 'history-geo',
        mode: 'mcq',
        presetId: 'history-geo',
        name: 'Đố Lịch Sử',
        badgeEmoji: '📜',
        icon: History,
        desc: 'Trắc nghiệm sự kiện & nhân vật lịch sử'
      },
      {
        id: 'trivia',
        mode: 'mcq',
        presetId: 'trivia',
        name: 'Đố Mẹo & Tri Thức',
        badgeEmoji: '💡',
        icon: Lightbulb,
        desc: 'Câu đố mẹo trí tuệ & kiến thức chung'
      }
    ]
  },
  {
    id: 'vocab',
    title: 'Học Từ Vựng & Tiếng Anh',
    icon: BookOpen,
    items: [
      {
        id: 'lingobibi-flashcard',
        mode: 'mcq',
        presetId: 'lingobibi-flashcard',
        name: 'Flashcard Lingo BiBi',
        badgeEmoji: '🎴',
        icon: Sparkles,
        desc: 'Thẻ từ vựng flashcard minh họa sinh động'
      },
      {
        id: 'vocab-b1-word-guess-lingobibi',
        mode: 'mcq',
        presetId: 'vocab-b1-word-guess-lingobibi',
        name: 'Từ Vựng Lingo BiBi (4 Đáp Án)',
        badgeEmoji: '🎀',
        icon: Heart,
        desc: 'Trắc nghiệm chọn nghĩa từ vựng Tiếng Anh'
      },
      {
        id: 'vocab',
        mode: 'vocab',
        name: 'Từ Vựng BIGO',
        badgeEmoji: '📖',
        icon: BookOpen,
        desc: 'Danh sách từ vựng kèm phát âm chuẩn'
      },
      {
        id: 'vocab-b1-word-guess',
        mode: 'mcq',
        presetId: 'vocab-b1-word-guess',
        name: 'Đoán Ô Chữ',
        badgeEmoji: '🔠',
        icon: Grid,
        desc: 'Mở ký tự đoán từ vựng Tiếng Anh'
      },
      {
        id: 'fill-in-blank-b1-tiktok',
        mode: 'mcq',
        presetId: 'fill-in-blank-b1-tiktok',
        name: 'Điền Từ',
        badgeEmoji: '✍️',
        icon: Edit3,
        desc: 'Điền từ còn thiếu vào câu Tiếng Anh'
      }
    ]
  },
  {
    id: 'top-culture',
    title: 'Top List & Văn Hóa',
    icon: Layers,
    items: [
      {
        id: 'top',
        mode: 'top',
        name: 'Top 10/5 Thú Vị',
        badgeEmoji: '🏆',
        icon: Trophy,
        desc: 'Video dạng bảng xếp hạng Top 10/5'
      },
      {
        id: 'ca-dao-tuc-ngu',
        mode: 'mcq',
        presetId: 'ca-dao-tuc-ngu',
        name: 'Ca Dao Tục Ngữ',
        badgeEmoji: '🌾',
        icon: BookOpen,
        desc: 'Điền và chọn câu ca dao tục ngữ Việt Nam'
      }
    ]
  }
];

function HelpCircleIcon(props) {
  return <Film {...props} />;
}

export default function Sidebar({
  activeMode,
  selectedMCQPreset,
  onSelectVideoType,
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const isTypeActive = (type) => {
    if (type.mode === 'top') {
      return activeMode === 'top';
    }
    if (type.mode === 'vocab') {
      return activeMode === 'vocab';
    }
    return activeMode === 'mcq' && selectedMCQPreset === type.presetId;
  };

  // Lọc items theo từ khóa tìm kiếm
  const filterItems = (items) => {
    if (!searchTerm.trim()) return items;
    const query = searchTerm.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        (item.desc && item.desc.toLowerCase().includes(query)) ||
        (item.badgeEmoji && item.badgeEmoji.includes(query))
    );
  };

  return (
    <>
      {/* Backdrop trên Mobile khi mở menu */}
      {mobileOpen && (
        <div 
          className="sidebar-mobile-backdrop" 
          onClick={() => setMobileOpen(false)}
          title="Đóng menu"
        />
      )}

      <aside className={`app-sidebar ${isCollapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Header của Sidebar */}
        <div className="sidebar-header">
          <div className="sidebar-title-box">
            <Film size={20} className="sidebar-header-icon" />
            {!isCollapsed && (
              <div className="sidebar-header-text">
                <span className="sidebar-header-title">DẠNG VIDEO</span>
                <span className="sidebar-header-count">14 MẪU HOT</span>
              </div>
            )}
          </div>

          {/* Nút Thu Gọn / Mở Rộng trên Desktop */}
          <button
            type="button"
            className="sidebar-collapse-toggle"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Mở rộng menu" : "Thu gọn menu"}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          {/* Nút Đóng trên Mobile */}
          <button
            type="button"
            className="sidebar-mobile-close"
            onClick={() => setMobileOpen(false)}
            title="Đóng menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Ô Tìm Kiếm (hiển thị khi không thu gọn) */}
        {!isCollapsed && (
          <div className="sidebar-search-wrapper">
            <div className="sidebar-search-box">
              <Search size={15} className="sidebar-search-icon" />
              <input
                type="text"
                placeholder="Tìm dạng video..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="sidebar-search-input"
              />
              {searchTerm && (
                <button
                  type="button"
                  className="sidebar-search-clear"
                  onClick={() => setSearchTerm('')}
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Danh Sách Các Nhóm Menu Item */}
        <div className="sidebar-nav-container">
          {VIDEO_CATEGORIES.map((category) => {
            const categoryItems = filterItems(category.items);
            if (categoryItems.length === 0) return null;

            const CategoryIcon = category.icon;

            return (
              <div key={category.id} className="sidebar-category">
                {!isCollapsed && (
                  <div className="sidebar-category-header">
                    <CategoryIcon size={14} className="category-header-icon" />
                    <span className="category-header-title">{category.title}</span>
                    <span className="category-item-count">{categoryItems.length}</span>
                  </div>
                )}

                <div className="sidebar-menu-list">
                  {categoryItems.map((item) => {
                    const IconComponent = item.icon;
                    const active = isTypeActive(item);

                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`sidebar-menu-item ${active ? 'active' : ''}`}
                        onClick={() => {
                          onSelectVideoType(item);
                          if (mobileOpen) setMobileOpen(false);
                        }}
                        title={isCollapsed ? `${item.badgeEmoji} ${item.name}` : item.desc}
                      >
                        <div className="menu-item-icon-wrapper">
                          <span className="menu-item-emoji">{item.badgeEmoji}</span>
                          <IconComponent size={16} className="menu-item-icon" />
                        </div>

                        {!isCollapsed && (
                          <div className="menu-item-content">
                            <span className="menu-item-name">{item.name}</span>
                            {item.desc && (
                              <span className="menu-item-desc">{item.desc}</span>
                            )}
                          </div>
                        )}

                        {active && (
                          <div className="menu-item-active-badge">
                            {isCollapsed ? (
                              <div className="active-dot" />
                            ) : (
                              <CheckCircle2 size={15} />
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer của Sidebar */}
        {!isCollapsed && (
          <div className="sidebar-footer">
            <div className="sidebar-footer-card">
              <Sparkles size={16} className="footer-card-icon" />
              <div className="footer-card-text">
                <strong>Tùy chỉnh 9:16 Shorts</strong>
                <span>Xuất video cực nhanh với giọng đọc AI</span>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
