import React from 'react';
import { 
  Video, 
  Menu,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MapPin,
  Globe,
  Utensils,
  Trophy,
  Flag,
  History,
  Lightbulb,
  BookOpen,
  Grid,
  Edit3,
  Heart
} from 'lucide-react';

export default function Header({ 
  activeMode, 
  selectedMCQPreset, 
  isSidebarCollapsed,
  onToggleSidebar,
  onToggleMobileSidebar 
}) {
  // Helper lấy tên & icon dạng video đang chọn
  const getActiveModeInfo = () => {
    if (activeMode === 'top') {
      return { name: 'Top 10/5 Thú Vị', badgeEmoji: '🏆', icon: Trophy, category: 'Top List' };
    }
    if (activeMode === 'vocab') {
      return { name: 'Từ Vựng BIGO', badgeEmoji: '📖', icon: BookOpen, category: 'Học Từ Vựng' };
    }

    switch (selectedMCQPreset) {
      case 'dia-ly-van-hoa-viet-nam':
        return { name: 'Địa Lý & Văn Hóa VN', badgeEmoji: '🇻🇳', icon: MapPin, category: 'Trắc Nghiệm' };
      case 'landmark-guess':
        return { name: 'Đoán Địa Điểm', badgeEmoji: '🏰', icon: Globe, category: 'Trắc Nghiệm' };
      case 'food-guess':
        return { name: 'Đoán Món Ăn', badgeEmoji: '🍳', icon: Utensils, category: 'Trắc Nghiệm' };
      case 'player-guess':
        return { name: 'Đoán Cầu Thủ', badgeEmoji: '⚽', icon: Trophy, category: 'Trắc Nghiệm' };
      case 'flags':
        return { name: 'Đố Cờ Các Nước', badgeEmoji: '🚩', icon: Flag, category: 'Trắc Nghiệm' };
      case 'history-geo':
        return { name: 'Đố Lịch Sử', badgeEmoji: '📜', icon: History, category: 'Trắc Nghiệm' };
      case 'trivia':
        return { name: 'Đố Mẹo & Tri Thức', badgeEmoji: '💡', icon: Lightbulb, category: 'Trắc Nghiệm' };
      case 'lingobibi-flashcard':
        return { name: 'Flashcard Lingo BiBi', badgeEmoji: '🎴', icon: Sparkles, category: 'Từ Vựng' };
      case 'vocab-b1-word-guess-lingobibi':
        return { name: 'Từ Vựng Lingo BiBi (4 Đáp Án)', badgeEmoji: '🎀', icon: Heart, category: 'Từ Vựng' };
      case 'vocab-b1-word-guess':
        return { name: 'Đoán Ô Chữ', badgeEmoji: '🔠', icon: Grid, category: 'Từ Vựng' };
      case 'fill-in-blank-b1-tiktok':
        return { name: 'Điền Từ', badgeEmoji: '✍️', icon: Edit3, category: 'Từ Vựng' };
      case 'ca-dao-tuc-ngu':
        return { name: 'Ca Dao Tục Ngữ', badgeEmoji: '🌾', icon: BookOpen, category: 'Văn Hóa' };
      default:
        return { name: 'Trắc Nghiệm Shorts', badgeEmoji: '🧠', icon: Video, category: 'Trắc Nghiệm' };
    }
  };

  const activeInfo = getActiveModeInfo();
  const ActiveIcon = activeInfo.icon;

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Trai: Side bar toggle button + Brand / Logo */}
        <div className="header-left-group">
          {/* Nút Toggle Sidebar Mobile & Desktop */}
          <button
            type="button"
            className="btn-sidebar-toggle desktop-toggle"
            onClick={onToggleSidebar}
            title={isSidebarCollapsed ? "Mở menu bên trái" : "Thu gọn menu"}
          >
            <Menu size={19} />
          </button>

          <button
            type="button"
            className="btn-sidebar-toggle mobile-toggle"
            onClick={onToggleMobileSidebar}
            title="Mở menu bên trái"
          >
            <Menu size={19} />
          </button>

          <div className="logo-group">
            <div className="logo-icon">
              <Video size={22} />
            </div>
            <div className="logo-text-wrapper">
              <h1 className="app-title">
                Video Maker <span className="title-highlight">PRO</span>
              </h1>
              <span className="app-version-tag">ERP SAAS</span>
            </div>
          </div>
        </div>

        {/* Giua/Phai: Hien thi Dang Video Hien Tai dang Duoc Chon */}
        <div className="header-active-mode-display">
          <span className="mode-display-label">DẠNG VIDEO ĐANG CHỌN:</span>
          <div className="mode-display-pill">
            <span className="mode-pill-emoji">{activeInfo.badgeEmoji}</span>
            <ActiveIcon size={16} className="mode-pill-icon" />
            <span className="mode-pill-name">{activeInfo.name}</span>
            <span className="mode-pill-category">{activeInfo.category}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
