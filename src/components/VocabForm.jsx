import React, { useState, useRef } from 'react';
import { VOCAB_PRESETS } from '../utils/vocabPresets';
import { TTSService } from '../utils/ttsService';
import { ENGLISH_VOICES } from '../utils/audioSynth';
import { downloadFile } from '../utils/fileImporter';
import { 
  Sparkles, 
  FileText, 
  Download, 
  Upload, 
  Copy, 
  Plus, 
  Trash2, 
  Volume2, 
  Settings, 
  Layers, 
  Check, 
  RefreshCw,
  Code,
  Edit3,
  BookOpen
} from 'lucide-react';

export default function VocabForm({ vocabData, setVocabData }) {
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'json'
  const [jsonText, setJsonText] = useState(JSON.stringify(vocabData, null, 2));
  const [jsonError, setJsonError] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);

  // Cập nhật jsonText mỗi khi vocabData thay đổi ở Tab Form
  const syncJsonFromData = (newData) => {
    setVocabData(newData);
    setJsonText(JSON.stringify(newData, null, 2));
    setJsonError('');
  };

  // Chọn bộ Preset
  const handleSelectPreset = (presetId) => {
    const found = VOCAB_PRESETS.find(p => p.id === presetId);
    if (found) {
      syncJsonFromData(JSON.parse(JSON.stringify(found.data)));
    }
  };

  // Thay đổi thuộc tính chung
  const handleMetaChange = (field, value) => {
    const updated = { ...vocabData, [field]: value };
    syncJsonFromData(updated);
  };

  // Thay đổi 1 từ trong danh sách items
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...(vocabData.items || [])];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    syncJsonFromData({ ...vocabData, items: updatedItems });
  };

  // Thêm từ mới
  const handleAddItem = () => {
    const currentItems = vocabData.items || [];
    const newId = currentItems.length + 1;
    const newItem = {
      id: newId,
      vi: "Từ mới",
      en: "NewWord",
      ipa: "/.../",
      icon: "✨"
    };
    syncJsonFromData({ ...vocabData, items: [...currentItems, newItem] });
  };

  // Xóa từ
  const handleDeleteItem = (index) => {
    const currentItems = [...(vocabData.items || [])];
    currentItems.splice(index, 1);
    // Đánh lại số thứ tự id từ 1 -> N
    const reindexed = currentItems.map((item, idx) => ({ ...item, id: idx + 1 }));
    syncJsonFromData({ ...vocabData, items: reindexed });
  };

  // Thử phát âm 1 từ
  const handleTestWordAudio = (wordEn) => {
    if (!wordEn) return;
    TTSService.speak(wordEn, {
      voice: vocabData.voice || 'en-US-AnaNeural',
      speed: vocabData.voiceSpeed || 1.25
    });
  };

  // Áp dụng JSON từ Textarea
  const handleApplyJsonText = (textValue) => {
    setJsonText(textValue);
    try {
      const parsed = JSON.parse(textValue);
      if (!parsed.items || !Array.isArray(parsed.items)) {
        setJsonError('File JSON hợp lệ nhưng thiếu mảng "items"!');
        return;
      }
      setVocabData(parsed);
      setJsonError('');
    } catch (err) {
      setJsonError('Lỗi cú pháp JSON: ' + err.message);
    }
  };

  // Tải file JSON từ máy người dùng
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
          alert('✅ Đã tải cấu hình từ file JSON thành công!');
        } else {
          alert('❌ File JSON không chứa mảng từ vựng "items" hợp lệ!');
        }
      } catch (err) {
        alert('❌ Lỗi khi đọc file JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Export JSON file về máy
  const handleDownloadJsonFile = () => {
    const jsonStr = JSON.stringify(vocabData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${vocabData.id || 'vocab-video'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Sao chép JSON vào Clipboard
  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(vocabData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="vocab-form-container card">
      {/* Header Form Selector */}
      <div className="form-header">
        <div className="form-title-group">
          <BookOpen className="text-primary" size={24} />
          <div>
            <h2 className="form-title">Tùy Chỉnh Video Từ Vựng</h2>
            <p className="form-subtitle">Dạng danh sách từ vựng chuẩn TikTok / Shorts (BIGO Style)</p>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="preset-picker-box">
          <label className="input-label">
            <Sparkles size={14} /> Mẫu có sẵn (Presets):
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <select 
              className="select-input"
              value={vocabData.id || ''}
              onChange={(e) => handleSelectPreset(e.target.value)}
            >
              {VOCAB_PRESETS.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <button 
              type="button"
              className="btn-secondary btn-sm"
              style={{ borderColor: 'var(--accent-gold, #FFDE59)', color: 'var(--accent-gold, #FFDE59)', whiteSpace: 'nowrap' }}
              onClick={() => {
                const jsonStr = JSON.stringify(vocabData, null, 2);
                downloadFile(`${vocabData.id || 'mau_tu_vung_bigo'}.json`, jsonStr, 'application/json');
              }}
              title="Tải file JSON mẫu của bộ từ vựng đang chọn"
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
          <Edit3 size={16} /> Chỉnh Sửa Trực Quan
        </button>
        <button 
          className={`tab-btn ${activeTab === 'json' ? 'active' : ''}`}
          onClick={() => setActiveTab('json')}
        >
          <Code size={16} /> File JSON & Mã Nguồn
        </button>
      </div>

      {/* TAB 1: FORM EDITOR */}
      {activeTab === 'editor' && (
        <div className="tab-content">
          {/* Cấu hình Tiêu Đề & Mascot */}
          <div className="config-section">
            <h3 className="section-title"><Settings size={18} /> Cấu Hình Banner & Giọng Đọc</h3>
            
            <div className="form-grid-2">
              <div className="form-group">
                <label className="input-label">Tiêu đề Banner chính:</label>
                <input 
                  type="text" 
                  className="text-input" 
                  value={vocabData.title || ''}
                  onChange={(e) => handleMetaChange('title', e.target.value)}
                  placeholder="Ví dụ: 10 TỪ VỰNG VỀ NẤU ĂN"
                />
              </div>

              <div className="form-group">
                <label className="input-label">Icon Banner / Emoji:</label>
                <input 
                  type="text" 
                  className="text-input" 
                  value={vocabData.headerIcon || '👨‍🍳'}
                  onChange={(e) => handleMetaChange('headerIcon', e.target.value)}
                  placeholder="👨‍🍳, 🍎, 🦁..."
                />
              </div>
            </div>

            <div className="form-grid-2" style={{ marginTop: '0.75rem' }}>
              <div className="form-group">
                <label className="input-label">Nội dung Footer Mascot:</label>
                <input 
                  type="text" 
                  className="text-input" 
                  value={vocabData.subtitle || ''}
                  onChange={(e) => handleMetaChange('subtitle', e.target.value)}
                  placeholder="Học từ vựng mỗi ngày cùng BIGO!"
                />
              </div>

              <div className="form-group">
                <label className="input-label">Giọng phát âm Tiếng Anh (TTS):</label>
                <select 
                  className="select-input"
                  value={vocabData.voice || 'en-US-AnaNeural'}
                  onChange={(e) => handleMetaChange('voice', e.target.value)}
                >
                  {ENGLISH_VOICES.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-grid-2" style={{ marginTop: '0.75rem' }}>
              <div className="form-group">
                <label className="input-label">Tốc độ phát âm (Speed): {vocabData.voiceSpeed || 1.25}x {(vocabData.voiceSpeed || 1.25) >= 1.2 ? '⚡' : ''}</label>
                <input 
                  type="range" 
                  min="0.5" 
                  max="1.5" 
                  step="0.05"
                  className="range-input"
                  value={vocabData.voiceSpeed || 1.25}
                  onChange={(e) => handleMetaChange('voiceSpeed', parseFloat(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label className="input-label">Thời gian giữa 2 từ (giây): {vocabData.timePerWord || 4.0}s (Khoảng nghỉ ~2-3s ⏱️)</label>
                <input 
                  type="range" 
                  min="2.0" 
                  max="8.0" 
                  step="0.2"
                  className="range-input"
                  value={vocabData.timePerWord || 4.0}
                  onChange={(e) => handleMetaChange('timePerWord', parseFloat(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Danh Sách Các Từ Vựng (Items Editor) */}
          <div className="items-section" style={{ marginTop: '1.5rem' }}>
            <div className="section-header-row">
              <h3 className="section-title">
                <Layers size={18} /> Danh Sách Từ Vựng ({vocabData.items?.length || 0} từ)
              </h3>
              <button className="btn-secondary btn-sm" onClick={handleAddItem}>
                <Plus size={16} /> Thêm từ mới
              </button>
            </div>

            <div className="vocab-items-table">
              {(vocabData.items || []).map((item, idx) => (
                <div key={idx} className="vocab-item-card">
                  <div className="item-number-badge">#{item.id}</div>
                  
                  <div className="item-inputs-grid">
                    <div className="input-subgroup">
                      <label className="sub-label">Icon / Ảnh:</label>
                      <input 
                        type="text" 
                        className="text-input text-center"
                        value={item.icon || ''} 
                        onChange={(e) => handleItemChange(idx, 'icon', e.target.value)}
                        placeholder="🍲"
                      />
                    </div>

                    <div className="input-subgroup">
                      <label className="sub-label">Từ Tiếng Việt:</label>
                      <input 
                        type="text" 
                        className="text-input"
                        value={item.vi || ''} 
                        onChange={(e) => handleItemChange(idx, 'vi', e.target.value)}
                        placeholder="Nấu"
                      />
                    </div>

                    <div className="input-subgroup">
                      <label className="sub-label">Từ Tiếng Anh:</label>
                      <input 
                        type="text" 
                        className="text-input text-bold text-primary-color"
                        value={item.en || ''} 
                        onChange={(e) => handleItemChange(idx, 'en', e.target.value)}
                        placeholder="Cook"
                      />
                    </div>

                    <div className="input-subgroup">
                      <label className="sub-label">Phiên âm IPA:</label>
                      <input 
                        type="text" 
                        className="text-input"
                        value={item.ipa || ''} 
                        onChange={(e) => handleItemChange(idx, 'ipa', e.target.value)}
                        placeholder="/kʊk/"
                      />
                    </div>
                  </div>

                  <div className="item-actions">
                    <button 
                      className="btn-audio-test"
                      title="Nghe phát âm từ này"
                      onClick={() => handleTestWordAudio(item.en)}
                    >
                      <Volume2 size={16} /> Nghe
                    </button>
                    <button 
                      className="btn-delete-item"
                      title="Xóa từ này"
                      onClick={() => handleDeleteItem(idx)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: JSON CODE EDITOR */}
      {activeTab === 'json' && (
        <div className="tab-content">
          <div className="json-toolbar">
            <div className="json-toolbar-title">
              <Code size={18} /> File JSON Cấu Hình Danh Sách Từ Vựng
            </div>
            <div className="json-toolbar-actions">
              <input 
                type="file" 
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".json"
                onChange={handleFileUpload}
              />
              <button 
                className="btn-secondary btn-sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={14} /> Nạp file .json từ máy
              </button>
              <button 
                className="btn-secondary btn-sm"
                style={{ borderColor: 'var(--accent-cyan, #00F0FF)', color: 'var(--accent-cyan, #00F0FF)' }}
                onClick={() => {
                  fetch('/mau_tu_vung.json')
                    .then(res => res.text())
                    .then(text => downloadFile('mau_tu_vung.json', text, 'application/json'))
                    .catch(() => alert('Không thể tải file mẫu.'));
                }}
                title="Tải file mẫu JSON danh sách từ vựng TikTok/BIGO chuẩn (mau_tu_vung.json)"
              >
                <Download size={14} /> Mẫu Vocab JSON
              </button>
              <button 
                className="btn-secondary btn-sm"
                onClick={handleCopyJson}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />} 
                {copied ? 'Đã chép!' : 'Sao chép JSON'}
              </button>
              <button 
                className="btn-primary btn-sm"
                onClick={handleDownloadJsonFile}
              >
                <Download size={14} /> Tải file .json về máy
              </button>
            </div>
          </div>

          <p className="json-help-text">
            Bạn có thể chỉnh sửa mã JSON trực tiếp dưới đây hoặc tải lên file <code>.json</code> để tự động cập nhật video preview!
          </p>

          {jsonError && (
            <div className="json-error-banner">
              ⚠️ {jsonError}
            </div>
          )}

          <textarea
            className="json-code-textarea"
            rows={18}
            value={jsonText}
            onChange={(e) => handleApplyJsonText(e.target.value)}
            spellCheck={false}
          />
        </div>
      )}
    </div>
  );
}
