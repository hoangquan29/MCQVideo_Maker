import React, { useEffect, useState } from 'react';
import { Settings, Clock, Palette, Volume2, Mic, Play, FastForward, Image as ImageIcon } from 'lucide-react';
import { VIETNAMESE_VOICES, ENGLISH_VOICES, audioSynth } from '../utils/audioSynth';

export const THEMES = [
  {
    id: 'vocab-b1-tiktok', name: '🎯 TikTok Vocab B1 (Ảnh Mẫu)',
    bg: '#121212', bgTo: '#1E241E', cardBg: '#FFFFFF',
    accent: '#FF1E56', accent2: '#00E676', textColor: '#111111'
  },
  {
    id: 'comic', name: '🟨 Comic Funky',
    bg: '#FFDE59', bgTo: '#FF7A3D', cardBg: '#1E1E24',
    accent: '#FF3366', accent2: '#FFB800', textColor: '#FFFFFF'
  },
  {
    id: 'neon', name: '🔮 Cyberpunk Neon',
    bg: '#0A0818', bgTo: '#2A0A4A', cardBg: '#171330',
    accent: '#00F0FF', accent2: '#B537F2', textColor: '#FFFFFF'
  },
  {
    id: 'pink', name: '💖 Funky Pink',
    bg: '#FF6B9B', bgTo: '#8A3FFC', cardBg: '#2B0E24',
    accent: '#FFD166', accent2: '#FF4FA3', textColor: '#FFFFFF'
  },
  {
    id: 'dark', name: '🕶️ Dark Retro',
    bg: '#0E0E10', bgTo: '#242424', cardBg: '#1A1A1C',
    accent: '#00E676', accent2: '#FFC300', textColor: '#FFFFFF'
  }
];

export default function SettingsPanel({ settings, setSettings }) {
  const [systemViVoices, setSystemViVoices] = useState([]);

  useEffect(() => {
    const checkSystemVoices = () => {
      const voices = audioSynth.getSystemVietnameseVoices();
      setSystemViVoices(voices);
    };

    checkSystemVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = checkSystemVoices;
    }
  }, []);

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleTestVoice = () => {
    audioSynth.testVoice(settings.voiceLang, null, settings.voiceSpeed || 1.25);
  };

  return (
    <div className="card settings-card">
      <div className="card-header">
        <h2>
          <Settings className="icon-cyan" size={20} />
          2. Cấu Hình Giọng Đọc & Hiệu Ứng Âm Thanh
        </h2>
      </div>

      <div className="settings-grid">
        {/* Voice Selection */}
        <div className="setting-item full-width-setting">
          <label>
            <Mic size={16} className="icon-cyan" /> Chọn Giọng Đọc Tiếng Việt & Tiếng Anh Cho Video:
          </label>

          <div className="voice-selection-container">
            <select
              value={settings.voiceLang}
              onChange={e => handleChange('voiceLang', e.target.value)}
              className="select-input voice-select"
            >
              <optgroup label="🇻🇳 Giọng Đọc Tiếng Việt AI Neural (Khuyên dùng cho Video Shorts)">
                {VIETNAMESE_VOICES.map(voice => (
                  <option key={voice.id} value={voice.id}>
                    {voice.name}
                  </option>
                ))}
              </optgroup>

              {systemViVoices.length > 0 && (
                <optgroup label="💻 Giọng Tiếng Việt Cài Sẵn Trên Thiết Bị / Trình Duyệt">
                  {systemViVoices.map(v => (
                    <option key={v.name} value={`sys_${v.name}`}>
                      🎙️ {v.name} ({v.lang})
                    </option>
                  ))}
                </optgroup>
              )}

              <optgroup label="🇺🇸🇬🇧 Giọng Đọc Tiếng Anh (Dùng cho Học Từ Vựng)">
                {ENGLISH_VOICES.map(voice => (
                  <option key={voice.id} value={voice.id}>
                    {voice.name}
                  </option>
                ))}
              </optgroup>
            </select>

            <button
              type="button"
              className="test-voice-btn"
              onClick={handleTestVoice}
              title="Nhấn để nghe thử giọng đọc"
            >
              <Play size={16} />
              <span>🔊 Nghe Thử Giọng</span>
            </button>
          </div>
        </div>

        {/* Voice Speed */}
        <div className="setting-item">
          <label>
            <FastForward size={16} /> Tốc Độ Đọc (Voice Speed):
          </label>
          <div className="btn-group">
            {[
              { speed: 0.85, label: '0.85x (Chậm)' },
              { speed: 1.0, label: '1.0x (Chuẩn)' },
              { speed: 1.15, label: '1.15x' },
              { speed: 1.25, label: '1.25x (Nhanh ⚡)' },
              { speed: 1.5, label: '1.5x (Rất nhanh)' }
            ].map(item => (
              <button
                key={item.speed}
                type="button"
                className={`toggle-btn ${(settings.voiceSpeed || 1.25) === item.speed ? 'active' : ''}`}
                onClick={() => handleChange('voiceSpeed', item.speed)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Guess Duration */}
        <div className="setting-item">
          <label>
            <Clock size={16} /> Thời gian đố đếm ngược (giây):
          </label>
          <div className="btn-group">
            {[3, 5, 7, 10].map(sec => (
              <button
                key={sec}
                type="button"
                className={`toggle-btn ${settings.guessTime === sec ? 'active' : ''}`}
                onClick={() => handleChange('guessTime', sec)}
              >
                {sec}s {sec === 3 ? '(Mặc định ⚡)' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Image Motion Setting */}
        <div className="setting-item">
          <label>
            <ImageIcon size={16} /> Hiệu ứng chuyển động Hình ảnh:
          </label>
          <div className="btn-group">
            <button
              type="button"
              className={`toggle-btn ${!settings.imageMotion ? 'active' : ''}`}
              onClick={() => handleChange('imageMotion', false)}
            >
              📌 Ảnh đứng yên (Mặc định)
            </button>
            <button
              type="button"
              className={`toggle-btn ${settings.imageMotion ? 'active' : ''}`}
              onClick={() => handleChange('imageMotion', true)}
            >
              🎬 Ken Burns (Zoom nhẹ)
            </button>
          </div>
        </div>

        {/* Visual Theme */}
        <div className="setting-item full-width-setting">
          <label>
            <Palette size={16} /> Phong cách Giao diện (Theme):
          </label>
          <div className="theme-grid">
            {THEMES.map(theme => (
              <button
                key={theme.id}
                type="button"
                className={`theme-btn ${settings.theme === theme.id ? 'active' : ''}`}
                onClick={() => handleChange('theme', theme.id)}
              >
                <span className="theme-preview" style={{ background: theme.bg }}></span>
                {theme.name}
              </button>
            ))}
          </div>
        </div>

        {/* Sound Toggles */}
        <div className="setting-item full-width-setting">
          <label>
            <Volume2 size={16} /> Tiếng động & Hiệu ứng âm thanh:
          </label>
          <div className="checkbox-list">
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={settings.readAnswer !== false}
                onChange={e => handleChange('readAnswer', e.target.checked)}
              />
              <span>Đọc giọng AI khi ra đáp án (Tắt = Chỉ phát tiếng bíp bíp 🔔)</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={settings.playTick}
                onChange={e => handleChange('playTick', e.target.checked)}
              />
              <span>Tiếng đếm ngược tích tắc (`Tick-tock`)</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={settings.playAlarm}
                onChange={e => handleChange('playAlarm', e.target.checked)}
              />
              <span>Tiếng chuông hết giờ (`Alarm Bell` ⏰)</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={settings.playFanfare}
                onChange={e => handleChange('playFanfare', e.target.checked)}
              />
              <span>Tiếng nhạc mừng đáp án (`Victory Fanfare` ✨)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
