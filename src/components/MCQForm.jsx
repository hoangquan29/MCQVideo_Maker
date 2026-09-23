import React, { useRef, useState } from 'react';
import { MCQ_PRESETS } from '../utils/mcqPresets';
import { parseMultiMCQFile, downloadFile } from '../utils/fileImporter';
import { HelpCircle, Plus, Trash2, CheckCircle2, Upload, Download, Sparkles, Layers } from 'lucide-react';

export default function MCQForm({
  questionSets,
  setQuestionSets,
  activeSetIndex,
  setActiveSetIndex,
  selectedPreset,
  setSelectedPreset,
  setSettings,
  onSelectPreset
}) {
  const fileInputRef = useRef(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  const currentQuestions = questionSets[activeSetIndex]?.questions || [];

  const handleSelectPreset = (presetId) => {
    if (onSelectPreset) {
      onSelectPreset(presetId);
      return;
    }
    const preset = MCQ_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setSelectedPreset(presetId);
      if (setSettings) {
        if (preset.id === 'dia-ly-van-hoa-viet-nam' || presetId === 'dia-ly-van-hoa-viet-nam') {
          setSettings(prev => ({ ...prev, readAnswer: false, theme: 'vocab-b1-tiktok', voiceLang: 'vi-VN-HoaiMyNeural', guessTime: 3 }));
        } else if (preset.mode === 'player-guess' || presetId === 'player-guess') {
          setSettings(prev => ({ ...prev, readAnswer: false, theme: 'player-guess', voiceLang: 'vi-VN-HoaiMyNeural', guessTime: 3 }));
        } else if (preset.mode === 'flags' || presetId === 'flags' || preset.mode === 'country-guess' || presetId === 'country-guess-5-clues') {
          setSettings(prev => ({ ...prev, readAnswer: false, theme: preset.mode || 'flags', voiceLang: 'vi-VN-HoaiMyNeural', guessTime: preset.guessTime || (preset.mode === 'country-guess' ? 15 : 3) }));
        } else if (preset.mode === 'vocab-lingobibi-mcq' || presetId === 'vocab-b1-word-guess-lingobibi' || preset.id === 'vocab-b1-word-guess-lingobibi') {
          setSettings(prev => ({ ...prev, readAnswer: true, theme: 'pink', voiceLang: 'vi-VN-HoaiMyNeural', guessTime: 3 }));
        } else if (preset.mode === 'vocab-b1-tiktok' || presetId === 'vocab-b1-tiktok' || presetId === 'quiz-mcq-b1-tiktok' || preset.id === 'vocab-b1-word-guess') {
          setSettings(prev => ({ ...prev, readAnswer: preset.readAnswer !== undefined ? preset.readAnswer : true, theme: 'vocab-b1-tiktok', voiceLang: 'vi-VN-HoaiMyNeural', guessTime: preset.guessTime || 3 }));
        } else if (preset.mode === 'word-guess') {
          setSettings(prev => ({ ...prev, voiceLang: 'en-US-AnaNeural', guessTime: preset.guessTime || 5 }));
        }
      }
      if (preset.sets && Array.isArray(preset.sets)) {
        setQuestionSets(JSON.parse(JSON.stringify(preset.sets)));
      } else {
        const updatedSets = [...questionSets];
        updatedSets[activeSetIndex] = {
          ...updatedSets[activeSetIndex],
          questions: JSON.parse(JSON.stringify(preset.questions))
        };
        setQuestionSets(updatedSets);
      }
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedSets = [...questionSets];
    const updatedQs = [...updatedSets[activeSetIndex].questions];
    updatedQs[index] = { ...updatedQs[index], [field]: value };
    updatedSets[activeSetIndex] = {
      ...updatedSets[activeSetIndex],
      questions: updatedQs
    };
    setQuestionSets(updatedSets);
    setSelectedPreset('custom');
  };

  const handleSetNameChange = (name) => {
    const updatedSets = [...questionSets];
    updatedSets[activeSetIndex] = {
      ...updatedSets[activeSetIndex],
      name: name
    };
    setQuestionSets(updatedSets);
  };

  const handleAddQuestion = () => {
    if (currentQuestions.length >= 10) return;
    const updatedSets = [...questionSets];
    const newQuestion = isPlayerGuessMode ? {
      question: 'Đây là cầu thủ nào?',
      word: 'Cristiano Ronaldo',
      player: 'Cristiano Ronaldo',
      optionA: 'Cristiano Ronaldo',
      image: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=1200&q=80',
      explanation: 'Cristiano Ronaldo 🇵🇹 (CR7 - Siêu sao sở hữu 5 Quả bóng vàng)',
      mode: 'player-guess'
    } : (isLandmarkGuessMode ? {
      question: 'Đây là địa điểm nào?',
      word: 'Tháp Eiffel',
      landmark: 'Tháp Eiffel',
      optionA: 'Tháp Eiffel',
      image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=1200&q=80',
      explanation: 'Tháp Eiffel 🇫🇷 - Biểu tượng nước Pháp cao 330m',
      mode: 'landmark-guess'
    } : (isFoodGuessMode ? {
      question: 'Đây là món gì?',
      word: 'Phở Bò',
      optionA: 'Phở Bò',
      image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800',
      explanation: 'Phở Bò - Món ăn ngon Việt Nam 🇻🇳',
      mode: 'food-guess'
    } : (isWordGuessMode ? {
      question: 'What is the name of this in English?',
      word: 'APPLE',
      optionA: 'APPLE',
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800',
      explanation: 'Quả táo đỏ giòn ngon',
      mode: 'word-guess'
    } : {
      question: 'Câu hỏi trắc nghiệm mới?',
      optionA: 'Đáp án A',
      optionB: 'Đáp án B',
      optionC: 'Đáp án C',
      optionD: 'Đáp án D',
      correctOption: 'A',
      explanation: 'Giải thích ngắn gọn cho đáp án đúng...'
    })));


    const updatedQs = [...currentQuestions, newQuestion];
    updatedSets[activeSetIndex] = {
      ...updatedSets[activeSetIndex],
      questions: updatedQs
    };
    setQuestionSets(updatedSets);
    setSelectedPreset('custom');
  };

  const handleRemoveQuestion = (index) => {
    if (currentQuestions.length <= 1) return;
    const updatedSets = [...questionSets];
    const updatedQs = currentQuestions.filter((_, i) => i !== index);
    updatedSets[activeSetIndex] = {
      ...updatedSets[activeSetIndex],
      questions: updatedQs
    };
    setQuestionSets(updatedSets);
    setSelectedPreset('custom');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoadingFile(true);
    setLoadingText(`Đang phân tích dữ liệu file "${file.name}"...`);

    const reader = new FileReader();
    reader.onload = (event) => {
      setTimeout(() => {
        try {
          const content = event.target.result;
          const parsedSets = parseMultiMCQFile(content, file.name.toLowerCase());
          setQuestionSets(parsedSets);
          setSelectedPreset('file');
          setActiveSetIndex(0);

          // Check if parsed sets is flags mode or country guess mode or player guess mode
          const firstSetMode = parsedSets[0]?.mode;
          const isPlayerUpload = firstSetMode === 'player-guess' ||
            file.name.toLowerCase().includes('cau_thu') ||
            file.name.toLowerCase().includes('player') ||
            parsedSets[0]?.questions?.some(q => q.mode === 'player-guess' || q.mode === 'player');
          const isFlagsUpload = firstSetMode === 'flags' ||
            file.name.toLowerCase().includes('co') ||
            file.name.toLowerCase().includes('flag') ||
            parsedSets[0]?.questions?.some(q => q.mode === 'flags' || String(q.image).includes('flagcdn'));

          if (isPlayerUpload) {
            if (setSettings) {
              setSettings(prev => ({ ...prev, readAnswer: false, theme: 'player-guess', voiceLang: 'vi-VN-HoaiMyNeural', guessTime: 3 }));
            }
          } else if (isFlagsUpload) {
            if (setSettings) {
              setSettings(prev => ({ ...prev, readAnswer: false, theme: 'flags', voiceLang: 'vi-VN-HoaiMyNeural', guessTime: 3 }));
            }
          } else if (firstSetMode === 'landmark-guess') {
            if (setSettings) {
              setSettings(prev => ({ ...prev, readAnswer: false, theme: 'landmark-guess', voiceLang: 'vi-VN-HoaiMyNeural', guessTime: 3 }));
            }
          } else if (firstSetMode === 'food-guess') {
            if (setSettings) {
              setSettings(prev => ({ ...prev, readAnswer: false, theme: 'food-guess', voiceLang: 'vi-VN-HoaiMyNeural', guessTime: 3 }));
            }
          } else if (firstSetMode === 'country-guess') {
            if (setSettings) {
              setSettings(prev => ({ ...prev, readAnswer: false, theme: 'country-guess', voiceLang: 'vi-VN-HoaiMyNeural', guessTime: 15 }));
            }
          }

          setIsLoadingFile(false);
          alert(`🎉 Đã nhập thành công 4 Bộ câu hỏi từ file "${file.name}"!`);
        } catch (err) {
          setIsLoadingFile(false);
          alert(`❌ Lỗi đọc file: ${err.message}`);
        }
      }, 600);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDownloadSampleFile = (fileName) => {
    if (!fileName) return;
    const isCsv = fileName.endsWith('.csv');
    const mimeType = isCsv ? 'text/csv' : 'application/json';
    const baseUrl = import.meta.env.BASE_URL || '/';
    const cleanFileName = fileName.startsWith('/') ? fileName.slice(1) : fileName;
    const fileUrl = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}${cleanFileName}`;

    fetch(fileUrl)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then(text => {
        if (text.trim().startsWith('<!DOCTYPE html>') || text.trim().startsWith('<html')) {
          throw new Error('File không tồn tại trên server (404)');
        }
        downloadFile(cleanFileName, text, mimeType);
      })
      .catch((err) => alert(`❌ Không thể tải file mẫu "${fileName}": ${err.message}`));
  };

  const handleDownloadJSONSample = () => handleDownloadSampleFile('mau_4_bo_cau_hoi_trac_nghiem.json');
  const handleDownloadCSVSample = () => handleDownloadSampleFile('mau_4_bo_cau_hoi_trac_nghiem.csv');

  const activePresetObj = MCQ_PRESETS.find(p => p.id === selectedPreset);

  const handleToggleSetMode = (mode) => {
    if (setSettings) {
      if (mode === 'flags') {
        setSettings(prev => ({ ...prev, readAnswer: false, theme: mode, voiceLang: 'vi-VN-HoaiMyNeural', guessTime: 3 }));
      } else if (mode === 'player-guess') {
        setSettings(prev => ({ ...prev, readAnswer: false, theme: mode, voiceLang: 'vi-VN-HoaiMyNeural', guessTime: 3 }));
      } else if (mode === 'landmark-guess') {
        setSettings(prev => ({ ...prev, readAnswer: false, theme: mode, voiceLang: 'vi-VN-HoaiMyNeural', guessTime: 3 }));
      } else if (mode === 'food-guess') {
        setSettings(prev => ({ ...prev, readAnswer: false, theme: mode, voiceLang: 'vi-VN-HoaiMyNeural', guessTime: 3 }));
      } else if (mode === 'vocab-b1-tiktok') {
        setSettings(prev => ({ ...prev, readAnswer: true, theme: mode, voiceLang: 'vi-VN-HoaiMyNeural', guessTime: 3 }));
      } else if (mode === 'word-guess') {
        setSettings(prev => ({ ...prev, voiceLang: 'en-US-AnaNeural', guessTime: 3 }));
      }
    }
    const updatedSets = [...questionSets];
    const activeSet = updatedSets[activeSetIndex];
    const updatedQs = activeSet.questions.map(q => ({
      ...q,
      mode: mode,
      word: q.word || q.player || (mode === 'word-guess' || mode === 'food-guess' || mode === 'landmark-guess' || mode === 'player-guess' ? (q.optionA || '') : '')
    }));

    updatedSets[activeSetIndex] = {
      ...activeSet,
      mode: mode,
      questions: updatedQs
    };
    setQuestionSets(updatedSets);
    setSelectedPreset('custom');
  };

  const currentSetMode = questionSets[activeSetIndex]?.mode || 'vocab-b1-tiktok';
  const isPlayerGuessMode = currentSetMode === 'player-guess' ||
    selectedPreset === 'player-guess' ||
    (currentQuestions.length > 0 && (currentQuestions[0]?.mode === 'player-guess' || currentQuestions[0]?.mode === 'player'));
  const isLandmarkGuessMode = currentSetMode === 'landmark-guess' ||
    selectedPreset === 'landmark-guess' ||
    (currentQuestions.length > 0 && currentQuestions[0]?.mode === 'landmark-guess');
  const isWordGuessMode = currentSetMode === 'word-guess' ||
    selectedPreset === 'vocab-image-word-guess' ||
    (currentQuestions.length > 0 && currentQuestions[0]?.mode === 'word-guess');
  const isFoodGuessMode = currentSetMode === 'food-guess' ||
    selectedPreset === 'food-guess' ||
    (currentQuestions.length > 0 && currentQuestions[0]?.mode === 'food-guess');
  const isFlagsMode = currentSetMode === 'flags' ||
    selectedPreset === 'flags' ||
    (currentQuestions.length > 0 && currentQuestions[0]?.mode === 'flags');

  return (
    <div className="card form-card">
      <div className="card-header">
        <h2>
          <HelpCircle className="icon-gold" size={20} />
          1. Nhập Dữ Liệu 4 Bộ Câu Hỏi Trắc Nghiệm / Từ Vựng / Đoán Cầu Thủ / Đố Cờ / Đoán Món / Đoán Địa Điểm
        </h2>
        <span className="count-badge">4 Bộ x {currentQuestions.length} Câu hỏi</span>
      </div>

      {isLoadingFile && (
        <div className="file-loading-banner">
          <Sparkles className="spin-icon" size={24} />
          <span>{loadingText}</span>
        </div>
      )}

      {/* 4 Question Sets Selector Bar */}
      <div className="set-selector-bar">
        <label className="section-label">
          <Layers size={16} /> Chọn Bộ Câu Hỏi Để Xem / Chỉnh Sửa:
        </label>
        <div className="set-pills-grid">
          {questionSets.map((setObj, sIdx) => {
            const themeNames = ['🟨 Comic Funky', '🔮 Cyberpunk Neon', '💖 Funky Pink', '🕶️ Dark Retro'];
            const setModeLabel = setObj.mode === 'vocab-lingobibi-mcq' ? '🎀 Từ Vựng Bibi' : (setObj.mode === 'player-guess' ? '⚽ Đoán Cầu Thủ' : (setObj.mode === 'landmark-guess' ? '🏰 Đoán Địa Điểm' : (setObj.mode === 'food-guess' ? '🍳 Đoán Món' : (setObj.mode === 'ca-dao-tuc-ngu' ? '🌾 Ca Dao' : (setObj.mode === 'lingobibi-flashcard' ? '🎴 Flashcard' : (setObj.mode === 'word-guess' ? '🔤 Đoán Từ' : (setObj.mode === 'flags' ? '🚩 Đố Cờ B1' : '🔘 Trắc nghiệm')))))));
            return (
              <button
                key={sIdx}
                type="button"
                className={`set-pill-btn ${activeSetIndex === sIdx ? 'active' : ''}`}
                onClick={() => setActiveSetIndex(sIdx)}
              >
                <span className="set-badge">BỘ #{sIdx + 1} ({setModeLabel})</span>
                <span className="set-title">{setObj.name || `Bộ câu hỏi #${sIdx + 1}`}</span>
                <span className="theme-tag">Theme: {themeNames[sIdx % 4]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* File Import & Sample File Toolbar (Dành riêng cho dạng Video đang chọn trên Navbar) */}
      <div className="preset-section">
        <div className="toolbar-header">
          <div className="toolbar-left-info">
            <Sparkles size={16} className="icon-gold" />
            <span className="section-label">
              File Mẫu JSON cho dạng <strong>{activePresetObj?.name || 'Trắc nghiệm'}</strong>:
            </span>
          </div>
          
          <div className="file-actions">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json, .csv, .txt"
              style={{ display: 'none' }}
            />
            <button
              type="button"
              className="btn-file-upload"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={15} /> Upload File Máy Tính (4 Bộ)
            </button>

            {activePresetObj?.sampleFiles && activePresetObj.sampleFiles.length > 0 ? (
              activePresetObj.sampleFiles.map((sFile, sIdx) => (
                <button
                  key={sIdx}
                  type="button"
                  className="btn-file-sample"
                  onClick={() => handleDownloadSampleFile(sFile.name)}
                  title={`Tải file mẫu ${sFile.label} (${sFile.name})`}
                >
                  <Download size={14} /> {sFile.label}
                </button>
              ))
            ) : (
              <button
                type="button"
                className="btn-file-sample"
                onClick={handleDownloadJSONSample}
                title="Tải file mẫu 4 bộ câu hỏi trắc nghiệm chuẩn (JSON)"
              >
                <Download size={14} /> Tải File JSON Mẫu
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Set Configuration Card: Name, Topic Badge, Flags & Mode Switcher */}
      <div className="set-config-card">
        <div className="config-row-primary">
          <div className="config-field">
            <label>Tên Bộ Câu Hỏi #{activeSetIndex + 1}:</label>
            <input
              type="text"
              value={questionSets[activeSetIndex]?.name || ''}
              onChange={(e) => handleSetNameChange(e.target.value)}
              placeholder={`Tên bộ câu hỏi #${activeSetIndex + 1}`}
              maxLength={60}
            />
          </div>

          <div className="config-field">
            <label className="badge-label-red">🔴 Topic Badge (Đầu video):</label>
            <input
              type="text"
              value={questionSets[activeSetIndex]?.topic || 'TỪ VỰNG B1'}
              onChange={(e) => {
                const updatedSets = [...questionSets];
                updatedSets[activeSetIndex] = { ...updatedSets[activeSetIndex], topic: e.target.value };
                setQuestionSets(updatedSets);
              }}
              placeholder="TỪ VỰNG B1"
            />
          </div>
        </div>

        <div className="config-row-secondary">
          <div className="config-field">
            <label>⚪ Tiêu Đề Phụ (Khung trắng):</label>
            <input
              type="text"
              value={questionSets[activeSetIndex]?.headerTitle || 'TỪ NÀO CÓ NGHĨA LÀ'}
              onChange={(e) => {
                const updatedSets = [...questionSets];
                updatedSets[activeSetIndex] = { ...updatedSets[activeSetIndex], headerTitle: e.target.value };
                setQuestionSets(updatedSets);
              }}
              placeholder="TỪ NÀO CÓ NGHĨA LÀ"
            />
          </div>

          <div className="flags-group">
            <div className="config-field">
              <label>Cờ Nguồn:</label>
              <input
                type="text"
                value={questionSets[activeSetIndex]?.fromFlag || '🇻🇳'}
                onChange={(e) => {
                  const updatedSets = [...questionSets];
                  updatedSets[activeSetIndex] = { ...updatedSets[activeSetIndex], fromFlag: e.target.value };
                  setQuestionSets(updatedSets);
                }}
              />
            </div>

            <div className="config-field">
              <label>Cờ Đích:</label>
              <input
                type="text"
                value={questionSets[activeSetIndex]?.toFlag || '🇺🇸'}
                onChange={(e) => {
                  const updatedSets = [...questionSets];
                  updatedSets[activeSetIndex] = { ...updatedSets[activeSetIndex], toFlag: e.target.value };
                  setQuestionSets(updatedSets);
                }}
              />
            </div>
          </div>
        </div>

        <div className="config-row-mode">
          <label className="mode-selection-label">
            ✨ Chế Độ Hiển Thị Video (Mode):
          </label>
          <div className="mode-toggle-group">
            <button
              type="button"
              className={`mode-toggle-btn btn-player-guess ${isPlayerGuessMode ? 'active' : ''}`}
              onClick={() => handleToggleSetMode('player-guess')}
              style={{ background: isPlayerGuessMode ? 'linear-gradient(135deg, #10B981, #065F46)' : '', color: isPlayerGuessMode ? '#FFF' : '' }}
            >
              ⚽ Nhìn Ảnh Đoán Cầu Thủ (3s Ô Chữ)
            </button>
            <button
              type="button"
              className={`mode-toggle-btn btn-landmark-guess ${isLandmarkGuessMode ? 'active' : ''}`}
              onClick={() => handleToggleSetMode('landmark-guess')}
              style={{ background: isLandmarkGuessMode ? 'linear-gradient(135deg, #0284C7, #1E1B4B)' : '', color: isLandmarkGuessMode ? '#FFF' : '' }}
            >
              🏰 Nhìn Ảnh Đoán Địa Điểm (3s Ô Chữ)
            </button>
            <button
              type="button"
              className={`mode-toggle-btn btn-food-guess ${isFoodGuessMode ? 'active' : ''}`}
              onClick={() => handleToggleSetMode('food-guess')}
              style={{ background: isFoodGuessMode ? 'linear-gradient(135deg, #FF7043, #E65100)' : '', color: isFoodGuessMode ? '#FFF' : '' }}
            >
              🍳 Nhìn Hình Đoán Món Ăn (3s Ô Chữ)
            </button>
            <button
              type="button"
              className={`mode-toggle-btn btn-mcq-b1 ${!isWordGuessMode && !isFoodGuessMode && !isLandmarkGuessMode && !isPlayerGuessMode ? 'active' : ''}`}
              onClick={() => handleToggleSetMode('vocab-b1-tiktok')}
            >
              🎯 Trắc Nghiệm TikTok B1 (4 Đáp Án)
            </button>
            <button
              type="button"
              className={`mode-toggle-btn btn-word-guess ${isWordGuessMode ? 'active' : ''}`}
              onClick={() => handleToggleSetMode('word-guess')}
            >
              🔤 Nhìn Ảnh Đoán Từ Vựng (Gạch _ _ _ _)
            </button>
          </div>
        </div>
      </div>

      {/* Questions List for Active Set */}
      <div className="vocab-list">
        {currentQuestions.map((item, idx) => (
          <div key={idx} className="vocab-item-card mcq-item-card">
            <div className="vocab-item-header">
              <span className="word-index">
                # Bộ {activeSetIndex + 1} - Câu hỏi {idx + 1} {isPlayerGuessMode ? '(Đoán Cầu Thủ ⚽)' : (isLandmarkGuessMode ? '(Đoán Địa Điểm 🏰)' : (isFoodGuessMode ? '(Đoán Món Ăn 🍳)' : (isWordGuessMode ? '(Đoán Từ Vựng 🔤)' : '')))}
              </span>
              {currentQuestions.length > 1 && (
                <button
                  type="button"
                  className="btn-delete"
                  onClick={() => handleRemoveQuestion(idx)}
                  title="Xóa câu hỏi này"
                >
                  <Trash2 size={14} /> Xóa
                </button>
              )}
            </div>

            <div className="input-grid">
              {/* Question Text */}
              <div className="input-group full-width">
                <label>Nội dung câu hỏi / Tiêu đề đố:</label>
                <input
                  type="text"
                  value={item.question}
                  onChange={(e) => handleQuestionChange(idx, 'question', e.target.value)}
                  placeholder={isPlayerGuessMode ? "Ví dụ: Đây là cầu thủ nào?" : (isFoodGuessMode ? "Ví dụ: Đây là món gì?" : (isWordGuessMode ? "Ví dụ: What is the name of this animal in English?" : "Ví dụ: Thành phố nào là thủ đô của Việt Nam?"))}
                  maxLength={120}
                />
              </div>

              {/* Image URL */}
              <div className="input-group full-width">
                <label>🖼️ URL Hình ảnh minh họa {isPlayerGuessMode || isLandmarkGuessMode || isFoodGuessMode || isWordGuessMode ? '(Bắt buộc)' : '(Tùy chọn)'}:</label>
                <input
                  type="text"
                  value={item.image || ''}
                  onChange={(e) => handleQuestionChange(idx, 'image', e.target.value)}
                  placeholder="Ví dụ: https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=500"
                />
              </div>

              {isPlayerGuessMode ? (
                <>
                  {/* Player Guess Name */}
                  <div className="input-group full-width">
                    <label className="option-label label-a" style={{ color: '#10B981', fontWeight: 'bold' }}>
                      ⚽ Tên Cầu Thủ (Đáp Án Ô Chữ):
                    </label>
                    <input
                      type="text"
                      value={item.word || item.player || item.optionA || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleQuestionChange(idx, 'word', val);
                        handleQuestionChange(idx, 'player', val);
                        handleQuestionChange(idx, 'optionA', val);
                      }}
                      placeholder="Ví dụ: Cristiano Ronaldo, Lionel Messi, Kylian Mbappe..."
                      maxLength={50}
                      style={{ fontWeight: 'bold', fontSize: '1.05rem' }}
                    />
                  </div>

                  {/* Explanation / Player Details */}
                  <div className="input-group full-width">
                    <label>💡 Thông Tin & Thành Tích Cầu Thủ (Hiện khi mở đáp án):</label>
                    <input
                      type="text"
                      value={item.explanation || ''}
                      onChange={(e) => handleQuestionChange(idx, 'explanation', e.target.value)}
                      placeholder="Ví dụ: Cristiano Ronaldo 🇵🇹 (CR7 - Siêu sao sở hữu 5 Quả bóng vàng)"
                      maxLength={120}
                    />
                  </div>
                </>
              ) : isLandmarkGuessMode ? (
                <>
                  {/* Landmark Guess Name */}
                  <div className="input-group full-width">
                    <label className="option-label label-a" style={{ color: '#0EA5E9', fontWeight: 'bold' }}>
                      🏰 Tên Địa Điểm / Kỳ Quan (Đáp Án Ô Chữ):
                    </label>
                    <input
                      type="text"
                      value={item.word || item.landmark || item.optionA || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleQuestionChange(idx, 'word', val);
                        handleQuestionChange(idx, 'landmark', val);
                        handleQuestionChange(idx, 'optionA', val);
                      }}
                      placeholder="Ví dụ: Tháp Eiffel, Vạn Lý Trường Thành, Kim Tự Tháp Giza..."
                      maxLength={50}
                      style={{ fontWeight: 'bold', fontSize: '1.05rem' }}
                    />
                  </div>

                  {/* Explanation / Landmark Description */}
                  <div className="input-group full-width">
                    <label>💡 Thông Tin & Sự Thật Thú Vị Về Địa Điểm (Hiện khi mở đáp án):</label>
                    <input
                      type="text"
                      value={item.explanation || ''}
                      onChange={(e) => handleQuestionChange(idx, 'explanation', e.target.value)}
                      placeholder="Ví dụ: Tháp Eiffel 🇫🇷 (Biểu tượng nước Pháp cao 330m)"
                      maxLength={120}
                    />
                  </div>
                </>
              ) : isFoodGuessMode ? (
                <>
                  {/* Food Guess Dish Name */}
                  <div className="input-group full-width">
                    <label className="option-label label-a" style={{ color: '#FF7043', fontWeight: 'bold' }}>
                      🍳 Tên Món Ăn (Đáp Án Ô Chữ):
                    </label>
                    <input
                      type="text"
                      value={item.word || item.optionA || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleQuestionChange(idx, 'word', val);
                        handleQuestionChange(idx, 'optionA', val);
                      }}
                      placeholder="Ví dụ: Phở Bò, Bánh Mì, Cơm Tấm, Sushi..."
                      maxLength={50}
                      style={{ fontWeight: 'bold', fontSize: '1.05rem' }}
                    />
                  </div>

                  {/* Explanation / Dish Description */}
                  <div className="input-group full-width">
                    <label>💡 Ghi Chú & Đặc Sản Món Ăn (Hiện khi mở đáp án):</label>
                    <input
                      type="text"
                      value={item.explanation || ''}
                      onChange={(e) => handleQuestionChange(idx, 'explanation', e.target.value)}
                      placeholder="Ví dụ: Phở Bò - Món quốc phục ẩm thực Việt Nam 🇻🇳"
                      maxLength={120}
                    />
                  </div>
                </>
              ) : isWordGuessMode ? (
                <>
                  {/* Word Guess Target Word */}
                  <div className="input-group">
                    <label className="option-label label-a" style={{ color: 'var(--accent-gold, #FFDE59)' }}>
                      🔤 Từ Vựng Tiếng Anh (Đáp Án):
                    </label>
                    <input
                      type="text"
                      value={item.word || item.optionA || ''}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase();
                        handleQuestionChange(idx, 'word', val);
                        handleQuestionChange(idx, 'optionA', val);
                      }}
                      placeholder="Ví dụ: ELEPHANT"
                      maxLength={40}
                      style={{ textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' }}
                    />
                  </div>

                  {/* IPA Pronunciation */}
                  <div className="input-group">
                    <label className="option-label label-b">🔊 Phiên Âm IPA (Tùy chọn):</label>
                    <input
                      type="text"
                      value={item.ipa || ''}
                      onChange={(e) => handleQuestionChange(idx, 'ipa', e.target.value)}
                      placeholder="Ví dụ: /ˈel.ɪ.fənt/"
                      maxLength={40}
                    />
                  </div>

                  {/* Explanation / Vietnamese Meaning */}
                  <div className="input-group full-width">
                    <label>💡 Nghĩa Tiếng Việt & Giải Thích Chi Tiết:</label>
                    <input
                      type="text"
                      value={item.explanation || ''}
                      onChange={(e) => handleQuestionChange(idx, 'explanation', e.target.value)}
                      placeholder="Ví dụ: (n) Con voi - Loài động vật trên cạn lớn nhất thế giới!"
                      maxLength={120}
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Option A */}
                  <div className="input-group">
                    <label className="option-label label-a">Đáp án A:</label>
                    <input
                      type="text"
                      value={item.optionA}
                      onChange={(e) => handleQuestionChange(idx, 'optionA', e.target.value)}
                      placeholder="Ví dụ: TP. Hồ Chí Minh"
                      maxLength={60}
                    />
                  </div>

                  {/* Option B */}
                  <div className="input-group">
                    <label className="option-label label-b">Đáp án B:</label>
                    <input
                      type="text"
                      value={item.optionB}
                      onChange={(e) => handleQuestionChange(idx, 'optionB', e.target.value)}
                      placeholder="Ví dụ: Hà Nội"
                      maxLength={60}
                    />
                  </div>

                  {/* Option C */}
                  <div className="input-group">
                    <label className="option-label label-c">Đáp án C:</label>
                    <input
                      type="text"
                      value={item.optionC}
                      onChange={(e) => handleQuestionChange(idx, 'optionC', e.target.value)}
                      placeholder="Ví dụ: Đà Nẵng"
                      maxLength={60}
                    />
                  </div>

                  {/* Option D */}
                  <div className="input-group">
                    <label className="option-label label-d">Đáp án D:</label>
                    <input
                      type="text"
                      value={item.optionD}
                      onChange={(e) => handleQuestionChange(idx, 'optionD', e.target.value)}
                      placeholder="Ví dụ: Cần Thơ"
                      maxLength={60}
                    />
                  </div>

                  {/* Correct Option Selector */}
                  <div className="input-group full-width correct-option-group">
                    <label className="correct-label">
                      <CheckCircle2 size={16} className="icon-green" /> Chọn đáp án CHÍNH XÁC:
                    </label>
                    <div className="option-selector-pills">
                      {['A', 'B', 'C', 'D'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          className={`pill-btn pill-${opt.toLowerCase()} ${item.correctOption === opt ? 'selected' : ''}`}
                          onClick={() => handleQuestionChange(idx, 'correctOption', opt)}
                        >
                          Đáp án {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Explanation / Hint */}
                  <div className="input-group full-width">
                    <label>Giải thích / Gợi ý khi mở đáp án:</label>
                    <input
                      type="text"
                      value={item.explanation || ''}
                      onChange={(e) => handleQuestionChange(idx, 'explanation', e.target.value)}
                      placeholder="Ví dụ: Hà Nội là thủ đô ngàn năm văn hiến của Việt Nam!"
                      maxLength={100}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {currentQuestions.length < 10 && (
        <button type="button" className="btn-secondary add-btn" onClick={handleAddQuestion}>
          <Plus size={16} /> Thêm câu hỏi cho Bộ #{activeSetIndex + 1}
        </button>
      )}
    </div>
  );
}
