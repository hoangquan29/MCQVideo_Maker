import React, { useState, useRef } from 'react';
import { TOP_PRESETS } from '../utils/topPresets';
import { TTSService } from '../utils/ttsService';
import { VIETNAMESE_VOICES } from '../utils/audioSynth';
import { downloadFile } from '../utils/fileImporter';
import { 
  Trophy, 
  Sparkles, 
  Download, 
  Upload, 
  Copy, 
  Plus, 
  Trash2, 
  Volume2, 
  Settings, 
  Check, 
  Code, 
  Edit3,
  Image as ImageIcon,
  Palette,
  Clock,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

export default function TopListForm({ topData, setTopData }) {
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'json'
  const [jsonText, setJsonText] = useState(JSON.stringify(topData, null, 2));
  const [jsonError, setJsonError] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);

  // Synchronize JSON string whenever topData is updated via Form Editor
  const syncJsonFromData = (newData) => {
    setTopData(newData);
    setJsonText(JSON.stringify(newData, null, 2));
    setJsonError('');
  };

  // Select Preset
  const handleSelectPreset = (presetId) => {
    const found = TOP_PRESETS.find(p => p.id === presetId);
    if (found) {
      syncJsonFromData(JSON.parse(JSON.stringify(found.data)));
    }
  };

  // Update meta properties
  const handleMetaChange = (field, value) => {
    const updated = { ...topData, [field]: value };
    syncJsonFromData(updated);
  };

  // Update an item's property
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...(topData.items || [])];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    syncJsonFromData({ ...topData, items: updatedItems });
  };

  // Upload image file for an item
  const handleItemImageUpload = (index, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      handleItemChange(index, 'image', event.target.result);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Upload cover image
  const handleCoverImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      handleMetaChange('coverImage', event.target.result);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Add new item
  const handleAddItem = () => {
    const currentItems = topData.items || [];
    const newRank = currentItems.length + 1;
    const newItem = {
      id: Date.now(),
      rank: newRank,
      name: `Mục xếp hạng #${newRank}`,
      badge: `TOP ${newRank}`,
      metric: 'Thông số / Chỉ số nổi bật',
      description: 'Mô tả chi tiết hoặc điểm thú vị về mục này.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
    };

    // Prepend or Append and sort by rank descending (10 -> 1)
    const newItems = [...currentItems, newItem];
    syncJsonFromData({ ...topData, items: newItems });
  };

  // Delete item
  const handleDeleteItem = (index) => {
    const currentItems = [...(topData.items || [])];
    currentItems.splice(index, 1);
    
    // Auto re-index ranks descending from count down to 1
    const totalCount = currentItems.length;
    const reindexed = currentItems.map((item, idx) => {
      const rank = totalCount - idx;
      return {
        ...item,
        rank: rank,
        badge: rank === 1 ? '👑 TOP 1' : `TOP ${rank}`
      };
    });

    syncJsonFromData({ ...topData, items: reindexed });
  };

  // Move item up/down
  const handleMoveItem = (index, direction) => {
    const items = [...(topData.items || [])];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= items.length) return;

    const temp = items[index];
    items[index] = items[targetIdx];
    items[targetIdx] = temp;

    syncJsonFromData({ ...topData, items });
  };

  // Auto Sort items by rank descending (e.g., 10, 9, 8 ... 1)
  const handleSortDescending = () => {
    const items = [...(topData.items || [])];
    items.sort((a, b) => b.rank - a.rank);
    syncJsonFromData({ ...topData, items });
  };

  // Test Voice Audio
  const handleTestAudio = (text) => {
    if (!text) return;
    TTSService.speak(text, {
      voice: topData.voice || 'vi-VN-HoaiMyNeural',
      speed: topData.voiceSpeed || 1.5
    });
  };

  // Apply JSON Text from Textarea
  const handleApplyJsonText = (textValue) => {
    setJsonText(textValue);
    try {
      const parsed = JSON.parse(textValue);
      if (!parsed.items || !Array.isArray(parsed.items)) {
        setJsonError('File JSON hợp lệ nhưng thiếu mảng "items"!');
        return;
      }
      setTopData(parsed);
      setJsonError('');
    } catch (err) {
      setJsonError('Lỗi cú pháp JSON: ' + err.message);
    }
  };

  // Upload JSON file from computer
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target.result;
        const parsed = JSON.parse(content);
        if (parsed && Array.isArray(parsed.items)) {
          syncJsonFromData(parsed);
          alert('✅ Đã tải cấu hình Top List từ file JSON thành công!');
        } else {
          alert('❌ File JSON không chứa mảng "items" hợp lệ!');
        }
      } catch (err) {
        alert('❌ Lỗi khi đọc file JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Download JSON file
  const handleDownloadJsonFile = () => {
    const jsonStr = JSON.stringify(topData, null, 2);
    downloadFile(`${topData.id || 'top-list-video'}.json`, jsonStr, 'application/json');
  };

  // Copy JSON to Clipboard
  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(topData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const items = topData.items || [];

  return (
    <div className="vocab-form-container card">
      {/* Header Form Selector */}
      <div className="form-header">
        <div className="form-title-group">
          <Trophy className="text-primary" size={26} style={{ color: '#FFD700' }} />
          <div>
            <h2 className="form-title">Tùy Chỉnh Video Top 10 / Top 5</h2>
            <p className="form-subtitle">Dạng video xếp hạng cuốn hút chuẩn Shorts / TikTok / Reels</p>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="preset-picker-box">
          <label className="input-label">
            <Sparkles size={14} /> Chọn Mẫu Có Sẵn:
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <select 
              className="select-input"
              value={topData.id || ''}
              onChange={(e) => handleSelectPreset(e.target.value)}
            >
              {TOP_PRESETS.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <button 
              type="button"
              className="btn-secondary btn-sm"
              style={{ borderColor: 'var(--accent-gold, #FFDE59)', color: 'var(--accent-gold, #FFDE59)', whiteSpace: 'nowrap' }}
              onClick={handleDownloadJsonFile}
              title="Tải file JSON mẫu của bộ đang chọn"
            >
              <Download size={13} /> Tải Mẫu JSON
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="form-tabs">
        <button 
          className={`tab-btn ${activeTab === 'editor' ? 'active' : ''}`}
          onClick={() => setActiveTab('editor')}
        >
          <Edit3 size={15} /> Form Chỉnh Sửa Visual
        </button>
        <button 
          className={`tab-btn ${activeTab === 'json' ? 'active' : ''}`}
          onClick={() => setActiveTab('json')}
        >
          <Code size={15} /> Cấu Hình JSON Trực Tiếp
        </button>
      </div>

      {activeTab === 'editor' ? (
        <div className="form-body">
          {/* Section 1: Cấu Hình Chung */}
          <div className="form-section">
            <h3 className="section-title">
              <Settings size={18} /> 1. Cấu Hình Tiêu Đề & Phong Cách
            </h3>
            
            <div className="form-grid-2">
              <div className="form-group">
                <label className="input-label">Tiêu Đề Video (Cover Scene):</label>
                <input 
                  type="text"
                  className="text-input"
                  value={topData.title || ''}
                  onChange={(e) => handleMetaChange('title', e.target.value)}
                  placeholder="VD: TOP 10 CÔNG TY LỚN NHẤT THẾ GIỚI"
                />
              </div>

              <div className="form-group">
                <label className="input-label">Phụ Đề / Mô Tả Ngắn:</label>
                <input 
                  type="text"
                  className="text-input"
                  value={topData.subtitle || ''}
                  onChange={(e) => handleMetaChange('subtitle', e.target.value)}
                  placeholder="VD: Bảng xếp hạng Vốn hóa thị trường"
                />
              </div>
            </div>

            <div className="form-grid-3" style={{ marginTop: '1rem' }}>
              <div className="form-group">
                <label className="input-label">
                  <Palette size={14} /> Style / Theme Video:
                </label>
                <select 
                  className="select-input"
                  value={topData.theme || 'gold-luxury'}
                  onChange={(e) => handleMetaChange('theme', e.target.value)}
                >
                  <option value="gold-luxury">✨ Gold Luxury (Vàng Đen Sang Trọng)</option>
                  <option value="neon-cyber">⚡ Cyber Neon (Công Nghệ Tương Lai)</option>
                  <option value="blue-ocean">🌊 Blue Ocean (Xanh Dương Hiện Đại)</option>
                  <option value="red-fire">🔥 Red Fire (Đỏ Rực Rỡ & Nổi Bật)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="input-label">
                  <Volume2 size={14} /> Giọng Đọc TTS:
                </label>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <select 
                    className="select-input"
                    value={topData.voice || 'vi-VN-HoaiMyNeural'}
                    onChange={(e) => handleMetaChange('voice', e.target.value)}
                    style={{ flex: 1 }}
                  >
                    {VIETNAMESE_VOICES.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                  <button 
                    type="button"
                    className="btn-secondary btn-icon-only"
                    onClick={() => handleTestAudio(topData.title)}
                    title="Nghe thử giọng đọc tiêu đề"
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="input-label">
                  <Clock size={14} /> Thời Gian MỗI Cảnh (Giây):
                </label>
                <input 
                  type="number"
                  step="0.5"
                  min="3"
                  max="12"
                  className="text-input"
                  value={topData.timePerItem || 5.5}
                  onChange={(e) => handleMetaChange('timePerItem', parseFloat(e.target.value) || 5.5)}
                />
              </div>
            </div>

            {/* Cover Image Upload / Input */}
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="input-label">
                <ImageIcon size={14} /> Ảnh Bìa Trang Đầu (Cover Image URL):
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text"
                  className="text-input"
                  value={topData.coverImage || ''}
                  onChange={(e) => handleMetaChange('coverImage', e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  style={{ flex: 1 }}
                />
                <label className="btn-secondary" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  <Upload size={14} /> Tải Ảnh Lên
                  <input 
                    type="file" 
                    accept="image/*" 
                    style={{ display: 'none' }}
                    onChange={handleCoverImageUpload}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Section 2: Danh Sách Vị Trí Xếp Hạng */}
          <div className="form-section">
            <div className="section-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 className="section-title" style={{ margin: 0 }}>
                <Trophy size={18} /> 2. Danh Sách Vị Trí Xếp Hạng ({items.length} mục)
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  type="button" 
                  className="btn-secondary btn-sm"
                  onClick={handleSortDescending}
                  title="Sắp xếp tự động thứ tự đếm ngược từ 10 (hoặc 5) xuống 1"
                >
                  <ArrowDown size={14} /> Xếp Thứ Tự (N ➔ 1)
                </button>
                <button 
                  type="button" 
                  className="btn-primary btn-sm"
                  onClick={handleAddItem}
                >
                  <Plus size={14} /> Thêm Vị Trí Mới
                </button>
              </div>
            </div>

            <div className="vocab-items-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {items.map((item, index) => (
                <div key={item.id || index} className="vocab-item-card" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '1rem' }}>
                  <div className="item-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span className="item-number-badge" style={{ background: item.rank === 1 ? '#FFD700' : '#3B82F6', color: '#000', fontWeight: 'bold', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.85rem' }}>
                        RANK #{item.rank}
                      </span>
                      <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{item.name || `Mục #${item.rank}`}</strong>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <button 
                        type="button" 
                        className="btn-icon"
                        onClick={() => handleMoveItem(index, -1)}
                        disabled={index === 0}
                        title="Di chuyển lên"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button 
                        type="button" 
                        className="btn-icon"
                        onClick={() => handleMoveItem(index, 1)}
                        disabled={index === items.length - 1}
                        title="Di chuyển xuống"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button 
                        type="button" 
                        className="btn-secondary btn-icon-only"
                        onClick={() => handleTestAudio(`${item.name}. ${item.description || ''}`)}
                        title="Nghe giọng đọc của mục này"
                      >
                        <Volume2 size={14} />
                      </button>
                      <button 
                        type="button" 
                        className="btn-danger btn-icon-only"
                        onClick={() => handleDeleteItem(index)}
                        title="Xóa vị trí này"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="form-grid-3">
                    <div className="form-group">
                      <label className="input-label">Thứ Hạng (Rank Number):</label>
                      <input 
                        type="number"
                        className="text-input"
                        value={item.rank ?? (items.length - index)}
                        onChange={(e) => handleItemChange(index, 'rank', parseInt(e.target.value) || 1)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="input-label">Huy Hiệu (Badge Text):</label>
                      <input 
                        type="text"
                        className="text-input"
                        value={item.badge || `TOP ${item.rank}`}
                        onChange={(e) => handleItemChange(index, 'badge', e.target.value)}
                        placeholder="VD: TOP 10 hoặc 👑 TOP 1"
                      />
                    </div>

                    <div className="form-group">
                      <label className="input-label">Tên Mục / Thương Hiệu / Quốc Gia:</label>
                      <input 
                        type="text"
                        className="text-input"
                        value={item.name || ''}
                        onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                        placeholder="VD: Apple (Mỹ) hoặc Russia 🇷🇺"
                      />
                    </div>
                  </div>

                  <div className="form-grid-2" style={{ marginTop: '0.8rem' }}>
                    <div className="form-group">
                      <label className="input-label">Chỉ Số Nổi Bật (Metric / Subtitle):</label>
                      <input 
                        type="text"
                        className="text-input"
                        value={item.metric || ''}
                        onChange={(e) => handleItemChange(index, 'metric', e.target.value)}
                        placeholder="VD: Vốn hóa: ~$3.400 Tỷ USD"
                      />
                    </div>

                    <div className="form-group">
                      <label className="input-label">Hình Ảnh (URL hoặc Tải Lên):</label>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <input 
                          type="text"
                          className="text-input"
                          value={item.image || ''}
                          onChange={(e) => handleItemChange(index, 'image', e.target.value)}
                          placeholder="https://..."
                          style={{ flex: 1 }}
                        />
                        <label className="btn-secondary btn-sm" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          <Upload size={13} />
                          <input 
                            type="file" 
                            accept="image/*" 
                            style={{ display: 'none' }}
                            onChange={(e) => handleItemImageUpload(index, e)}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: '0.8rem' }}>
                    <label className="input-label">Mô Tả Giới Thiệu (Được đọc bởi giọng TTS AI):</label>
                    <textarea 
                      className="textarea-input"
                      rows="2"
                      value={item.description || ''}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      placeholder="Nhập 1-2 câu giới thiệu ngắn cuốn hút về vị trí này..."
                    />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <button 
                type="button" 
                className="btn-primary"
                onClick={handleAddItem}
                style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
              >
                <Plus size={16} /> Thêm Vị Trí Xếp Hạng Mới
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Tab 2: Direct JSON Code Editor */
        <div className="form-body">
          <div className="json-editor-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Chỉnh sửa trực tiếp file cấu hình JSON cho Video Top 10 / Top 5:
            </span>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                type="button" 
                className="btn-secondary btn-sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={14} /> Tải File JSON Lên
              </button>
              <input 
                type="file"
                ref={fileInputRef}
                accept=".json"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />

              <button 
                type="button" 
                className="btn-secondary btn-sm"
                onClick={handleCopyJson}
              >
                {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                {copied ? 'Đã Copy!' : 'Copy JSON'}
              </button>

              <button 
                type="button" 
                className="btn-primary btn-sm"
                onClick={handleDownloadJsonFile}
              >
                <Download size={14} /> Tải JSON Về Máy
              </button>
            </div>
          </div>

          {jsonError && (
            <div className="alert-box alert-error" style={{ marginBottom: '1rem' }}>
              ❌ {jsonError}
            </div>
          )}

          <textarea 
            className="json-textarea"
            rows="22"
            value={jsonText}
            onChange={(e) => handleApplyJsonText(e.target.value)}
            spellCheck={false}
            style={{ 
              width: '100%', 
              fontFamily: 'monospace', 
              fontSize: '0.88rem', 
              background: '#0f172a', 
              color: '#38bdf8', 
              border: '1px solid #334155', 
              borderRadius: '8px', 
              padding: '1rem' 
            }}
          />
        </div>
      )}
    </div>
  );
}
