import React from 'react';
import { 
  Video, 
  BookOpen, 
  HelpCircle, 
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
  MapPin
} from 'lucide-react';

export default function Header({ 
  activeMode, 
  selectedMCQPreset, 
  onSelectVideoType 
}) {
  const videoTypes = [
    {
      id: 'dia-ly-van-hoa-viet-nam',
      mode: 'mcq',
      presetId: 'dia-ly-van-hoa-viet-nam',
      name: '🇻🇳 Địa Lý & Văn Hóa VN',
      icon: MapPin
    },
    {
      id: 'landmark-guess',
      mode: 'mcq',
      presetId: 'landmark-guess',
      name: '🏰 Đoán Địa Điểm',
      icon: Globe
    },
    {
      id: 'food-guess',
      mode: 'mcq',
      presetId: 'food-guess',
      name: '🍳 Đoán Món Ăn',
      icon: Utensils
    },
    {
      id: 'player-guess',
      mode: 'mcq',
      presetId: 'player-guess',
      name: '⚽ Đoán Cầu Thủ',
      icon: Trophy
    },

    {
      id: 'top',
      mode: 'top',
      name: '🏆 Top 10/5 Thú Vị',
      icon: Trophy
    },
    {
      id: 'vocab',
      mode: 'vocab',
      name: 'Từ Vựng BIGO',
      icon: BookOpen
    },
    {
      id: 'ca-dao-tuc-ngu',
      mode: 'mcq',
      presetId: 'ca-dao-tuc-ngu',
      name: '🌾 Ca Dao Tục Ngữ',
      icon: BookOpen
    },
    {
      id: 'lingobibi-flashcard',
      mode: 'mcq',
      presetId: 'lingobibi-flashcard',
      name: '🎴 Flashcard Lingo BiBi',
      icon: Sparkles
    },
    {
      id: 'vocab-b1-word-guess-lingobibi',
      mode: 'mcq',
      presetId: 'vocab-b1-word-guess-lingobibi',
      name: '🎀 Từ Vựng Lingo BiBi (4 Đáp Án)',
      icon: Heart
    },
    {
      id: 'vocab-b1-word-guess',
      mode: 'mcq',
      presetId: 'vocab-b1-word-guess',
      name: 'Đoán Ô Chữ',
      icon: Grid
    },
    {
      id: 'fill-in-blank-b1-tiktok',
      mode: 'mcq',
      presetId: 'fill-in-blank-b1-tiktok',
      name: 'Điền Từ',
      icon: Edit3
    },
    {
      id: 'flags',
      mode: 'mcq',
      presetId: 'flags',
      name: 'Đố Cờ Các Nước',
      icon: Flag
    },
    {
      id: 'history-geo',
      mode: 'mcq',
      presetId: 'history-geo',
      name: 'Đố Lịch Sử',
      icon: History
    },
    {
      id: 'trivia',
      mode: 'mcq',
      presetId: 'trivia',
      name: 'Đố Mẹo & Tri Thức',
      icon: Lightbulb
    }
  ];

  const isTypeActive = (type) => {
    if (type.mode === 'top') {
      return activeMode === 'top';
    }
    if (type.mode === 'vocab') {
      return activeMode === 'vocab';
    }
    return activeMode === 'mcq' && selectedMCQPreset === type.presetId;
  };

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Brand / Logo */}
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

        {/* Small Video Types Menu on Navbar */}
        <nav className="navbar-menu" aria-label="Dạng Video">
          <span className="navbar-menu-label">DẠNG VIDEO:</span>
          <div className="navbar-menu-items">
            {videoTypes.map((type) => {
              const IconComponent = type.icon;
              const active = isTypeActive(type);
              return (
                <button
                  key={type.id}
                  type="button"
                  className={`nav-menu-item ${active ? 'active' : ''}`}
                  onClick={() => onSelectVideoType(type)}
                  title={`Chuyển sang dạng: ${type.name}`}
                >
                  <IconComponent size={15} className="nav-item-icon" />
                  <span className="nav-item-name">{type.name}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}


