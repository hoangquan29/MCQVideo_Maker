import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MCQForm from './components/MCQForm';
import SettingsPanel from './components/SettingsPanel';
import MCQVideoPreviewCanvas from './components/MCQVideoPreviewCanvas';
import VocabForm from './components/VocabForm';
import VocabVideoPreviewCanvas from './components/VocabVideoPreviewCanvas';
import TopListForm from './components/TopListForm';
import TopListVideoPreviewCanvas from './components/TopListVideoPreviewCanvas';
import { MCQ_PRESETS } from './utils/mcqPresets';
import { DEFAULT_VOCAB_JSON } from './utils/vocabPresets';
import { DEFAULT_TOP_JSON } from './utils/topPresets';

export default function App() {
  // Chế độ tạo video: 'top' (Video Top 10/5 Thú Vị), 'vocab' (Video Từ Vựng BIGO), hoặc 'mcq' (Video Trắc Nghiệm)
  const [activeMode, setActiveMode] = useState('top');

  // State Dạng Video 1: 4 Bộ Câu Hỏi Trắc Nghiệm (Mặc Định: Đố Vui Trắc Nghiệm B1 Shorts Tiếng Việt)
  const [selectedMCQPreset, setSelectedMCQPreset] = useState('quiz-mcq-b1-tiktok');
  const [activeSetIndex, setActiveSetIndex] = useState(0);

  // State Quản Lý Sidebar Bên Trái
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const defaultPreset = MCQ_PRESETS.find(p => p.id === 'quiz-mcq-b1-tiktok') || MCQ_PRESETS[0];
  const initialSets = defaultPreset.sets
    ? JSON.parse(JSON.stringify(defaultPreset.sets))
    : [
        {
          name: defaultPreset.name || 'Bộ câu hỏi #1',
          questions: defaultPreset.questions ? JSON.parse(JSON.stringify(defaultPreset.questions)) : []
        }
      ];

  const [questionSets, setQuestionSets] = useState(initialSets);

  // State cấu hình hiệu ứng & âm thanh MCQ
  const [settings, setSettings] = useState({
    guessTime: 3,
    theme: 'vocab-b1-tiktok',
    playTick: false,
    playAlarm: false,
    playFanfare: false,
    readAnswer: true,
    voiceLang: 'vi-VN-HoaiMyNeural',
    voiceSpeed: 1.25,
    imageMotion: false
  });

  // State Dạng Video 2: Cấu hình Từ Vựng Danh Sách (BIGO Style JSON)
  const [vocabData, setVocabData] = useState(DEFAULT_VOCAB_JSON);

  // State Dạng Video 3: Cấu hình Top 10 / Top 5 Thú Vị
  const [topData, setTopData] = useState(DEFAULT_TOP_JSON);

  // Helper chọn Preset MCQ và cập nhật đầy đủ câu hỏi + cấu hình giọng đọc
  const selectMCQPreset = (presetId) => {
    const preset = MCQ_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setSelectedMCQPreset(presetId);
      if (preset.id === 'dia-ly-van-hoa-viet-nam' || presetId === 'dia-ly-van-hoa-viet-nam') {
        setSettings(prev => ({ ...prev, readAnswer: false, theme: 'vocab-b1-tiktok', voiceLang: 'vi-VN-HoaiMyNeural', guessTime: 3 }));
      } else if (preset.mode === 'ca-dao-tuc-ngu' || presetId === 'ca-dao-tuc-ngu') {
        setSettings(prev => ({ ...prev, readAnswer: false, theme: 'emerald', voiceLang: 'vi-VN-HoaiMyNeural', guessTime: 3 }));
      } else if (preset.mode === 'landmark-guess' || presetId === 'landmark-guess') {
        setSettings(prev => ({ ...prev, readAnswer: false, theme: 'landmark-guess', voiceLang: 'vi-VN-HoaiMyNeural', guessTime: 3 }));
      } else if (preset.mode === 'food-guess' || presetId === 'food-guess') {
        setSettings(prev => ({ ...prev, readAnswer: false, theme: 'food-guess', voiceLang: 'vi-VN-HoaiMyNeural', guessTime: 3 }));
      } else if (preset.mode === 'player-guess' || presetId === 'player-guess') {
        setSettings(prev => ({ ...prev, readAnswer: false, theme: 'player-guess', voiceLang: 'vi-VN-HoaiMyNeural', guessTime: 3 }));
      } else if (preset.mode === 'flags' || presetId === 'flags' || preset.mode === 'country-guess' || presetId === 'country-guess-5-clues') {
        setSettings(prev => ({ ...prev, readAnswer: false, theme: preset.mode || 'flags', voiceLang: 'vi-VN-HoaiMyNeural', guessTime: 3 }));
      } else if (preset.mode === 'lingobibi-flashcard' || presetId === 'lingobibi-flashcard') {
        setSettings(prev => ({ ...prev, readAnswer: true, theme: 'pink', voiceLang: 'en-US-AnaNeural', guessTime: 3 }));
      } else if (preset.mode === 'vocab-lingobibi-mcq' || presetId === 'vocab-b1-word-guess-lingobibi' || preset.id === 'vocab-b1-word-guess-lingobibi') {
        setSettings(prev => ({ ...prev, readAnswer: true, theme: 'pink', voiceLang: 'en-US-AnaNeural', guessTime: 3 }));
      } else if (preset.mode === 'vocab-b1-tiktok' || presetId === 'vocab-b1-tiktok' || presetId === 'quiz-mcq-b1-tiktok' || preset.id === 'vocab-b1-word-guess') {
        setSettings(prev => ({ ...prev, readAnswer: true, theme: preset.mode || 'vocab-b1-tiktok', voiceLang: 'vi-VN-HoaiMyNeural', guessTime: 3 }));
      } else if (preset.mode === 'word-guess') {
        setSettings(prev => ({ ...prev, voiceLang: 'en-US-AnaNeural', guessTime: 3 }));
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
      setActiveSetIndex(0);
    }
  };

  // Xử lý chọn dạng video từ Sidebar Menu bên trái
  const handleSelectVideoType = (type) => {
    if (type.mode === 'top') {
      setActiveMode('top');
    } else if (type.mode === 'vocab') {
      setActiveMode('vocab');
    } else if (type.mode === 'mcq') {
      setActiveMode('mcq');
      selectMCQPreset(type.presetId);
    }
  };

  return (
    <div className="app-root">
      <Header 
        activeMode={activeMode} 
        selectedMCQPreset={selectedMCQPreset}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      />

      <div className="app-body">
        {/* Left Sidebar Menu */}
        <Sidebar
          activeMode={activeMode}
          selectedMCQPreset={selectedMCQPreset}
          onSelectVideoType={handleSelectVideoType}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          mobileOpen={mobileSidebarOpen}
          setMobileOpen={setMobileSidebarOpen}
        />

        {/* Main Content Layout (Left Column Form & Right Column Preview) */}
        <main className={`main-layout ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          {activeMode === 'top' ? (
            <>
              {/* Left Column: Top 10/5 Form & JSON Editor */}
              <div className="left-column">
                <TopListForm
                  topData={topData}
                  setTopData={setTopData}
                />
              </div>

              {/* Right Column: 9:16 Top 10/5 Live Canvas Preview & Video Generator */}
              <div className="right-column">
                <TopListVideoPreviewCanvas
                  topData={topData}
                />
              </div>
            </>
          ) : activeMode === 'mcq' ? (
            <>
              {/* Left Column: MCQ Form & Settings */}
              <div className="left-column">
                <MCQForm
                  questionSets={questionSets}
                  setQuestionSets={setQuestionSets}
                  activeSetIndex={activeSetIndex}
                  setActiveSetIndex={setActiveSetIndex}
                  selectedPreset={selectedMCQPreset}
                  setSelectedPreset={setSelectedMCQPreset}
                  setSettings={setSettings}
                  onSelectPreset={selectMCQPreset}
                />

                <SettingsPanel
                  settings={settings}
                  setSettings={setSettings}
                />
              </div>

              {/* Right Column: 9:16 Live Canvas Preview & Video Generator */}
              <div className="right-column">
                <MCQVideoPreviewCanvas
                  questionSets={questionSets}
                  activeSetIndex={activeSetIndex}
                  setActiveSetIndex={setActiveSetIndex}
                  settings={settings}
                />
              </div>
            </>
          ) : (
            <>
              {/* Left Column: Vocab Form & JSON Editor */}
              <div className="left-column">
                <VocabForm
                  vocabData={vocabData}
                  setVocabData={setVocabData}
                />
              </div>

              {/* Right Column: 9:16 Vocab Live Canvas Preview & Video Generator */}
              <div className="right-column">
                <VocabVideoPreviewCanvas
                  vocabData={vocabData}
                />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
