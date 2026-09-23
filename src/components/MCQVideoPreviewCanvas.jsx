import React, { useRef, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { audioSynth } from '../utils/audioSynth';
import { TTSService } from '../utils/ttsService';
import { THEMES } from './SettingsPanel';
import { Play, Pause, RotateCcw, Download, Sparkles, Film, Zap, AlertOctagon } from 'lucide-react';

const FONT_FAMILY = '"Be Vietnam Pro", "Segoe UI", Tahoma, sans-serif';

const getEffectiveVoice = (voiceSetting, setObj = {}, qObj = {}) => {
  // Đọc câu hỏi/từ gợi ý Tiếng Việt luôn dùng giọng Tiếng Việt Hoài Mỹ Neural
  if (voiceSetting && voiceSetting.startsWith('en-')) {
    return 'vi-VN-HoaiMyNeural';
  }
  return voiceSetting || 'vi-VN-HoaiMyNeural';
};

const getTTSQuestionText = (text, mode = '') => {
  if (!text) return '';
  // Tự động thay thế từ còn thiếu ___, __, [...], ... thành khoảng dừng 1s (SSML break 1000ms) cho giọng đọc Tiếng Việt
  return text.replace(/_{2,}|\[\.\.\.\]|\.{3,}/g, ' [[BREAK_1S]] ');
};

const getQuestionReadTime = (qObj, setObj = {}, voiceSetting = '', speedSetting = 1.25) => {
  if (!qObj) return 1.0;
  const rawText = qObj.question || qObj.word || '';
  const mode = qObj.mode || setObj?.mode || '';
  const isShortGuessMode = mode === 'landmark-guess' || mode === 'food-guess' || mode === 'place-guess';
  const text = getTTSQuestionText(rawText, mode);
  if (!text) return isShortGuessMode ? 0.9 : 1.5;

  const effectiveVoice = getEffectiveVoice(voiceSetting, setObj, qObj);
  const rate = speedSetting || 1.25;
  const cacheKey = `${text}_${effectiveVoice}_${rate}`;
  const buffer = audioSynth.audioCache.get(cacheKey);

  if (buffer && buffer.duration > 0) {
    const trailingSilence = isShortGuessMode ? 0.05 : 0.25;
    return Math.min(4.5, buffer.duration + trailingSilence);
  }

  const cleanText = text.replace(/\[\[BREAK_1S\]\]/g, ' ');
  const words = cleanText.trim().split(/\s+/).filter(Boolean).length;
  const hasBreak = text.includes('[[BREAK_1S]]');
  const minSec = isShortGuessMode ? 0.9 : 1.5;
  const trailingPad = isShortGuessMode ? 0.1 : 0.4;
  const estimatedSec = Math.max(minSec, (words * 0.3) / (rate / 1.25) + (hasBreak ? 1.4 : trailingPad));
  return Math.min(4.5, estimatedSec);
};

const getAnswerReadTime = (qObj, setObj = {}, voiceSetting = '', speedSetting = 1.25) => {
  if (!qObj) return 1.2;
  const correctKey = (qObj.correctOption || 'A').toUpperCase();
  let targetWord = qObj.landmark || qObj.dish || qObj.word || '';
  if (!targetWord) {
    if (correctKey === 'A') targetWord = qObj.optionA;
    else if (correctKey === 'B') targetWord = qObj.optionB;
    else if (correctKey === 'C') targetWord = qObj.optionC;
    else if (correctKey === 'D') targetWord = qObj.optionD;
  }
  if (!targetWord) targetWord = qObj.optionA || '';
  targetWord = String(targetWord || '').trim();
  if (!targetWord) return 1.2;

  const effectiveVoice = getEffectiveVoice(voiceSetting, setObj, qObj);
  const rate = speedSetting || 1.25;
  const cacheKey = `word_${targetWord}_${effectiveVoice}_${rate}`;
  const buffer = audioSynth.audioCache.get(cacheKey);

  if (buffer && buffer.duration > 0) {
    return Math.min(3.0, buffer.duration + 0.1);
  }

  const words = targetWord.split(/\s+/).filter(Boolean).length;
  const estimatedSec = Math.max(1.0, (words * 0.35) / (rate / 1.25) + 0.2);
  return Math.min(3.0, estimatedSec);
};

const getQuestionTimings = (qList, setObj, settingsObj) => {
  const isCountryGuess = setObj?.mode === 'country-guess' || (qList && qList.length > 0 && (qList[0]?.mode === 'country-guess' || qList[0]?.clues));
  const isFlashcard = setObj?.mode === 'lingobibi-flashcard' || (qList && qList.length > 0 && qList[0]?.mode === 'lingobibi-flashcard');
  const isCaDao = setObj?.mode === 'ca-dao-tuc-ngu' || (qList && qList.length > 0 && qList[0]?.mode === 'ca-dao-tuc-ngu');
  const isFlags = setObj?.mode === 'flags' ||
    setObj?.id === 'flags' ||
    (qList && qList.length > 0 && (
      qList[0]?.mode === 'flags' ||
      (qList[0]?.image && String(qList[0]?.image).includes('flagcdn')) ||
      (qList[0]?.question && (String(qList[0]?.question).toLowerCase().includes('cờ') || String(qList[0]?.question).toLowerCase().includes('quốc kỳ'))) ||
      (setObj?.topic && (String(setObj.topic).toLowerCase().includes('cờ') || String(setObj.topic).toLowerCase().includes('quốc kỳ')))
    ));
  const isLandmark = setObj?.mode === 'landmark-guess' || setObj?.mode === 'place-guess' || setObj?.mode === 'landmark' || setObj?.mode === 'place' || (qList && qList.length > 0 && (qList[0]?.mode === 'landmark-guess' || qList[0]?.mode === 'place-guess' || qList[0]?.mode === 'landmark' || qList[0]?.mode === 'place' || (qList[0]?.topic && String(qList[0]?.topic).toLowerCase().includes('địa điểm'))));
  const isLandmarkOrFood = isLandmark || setObj?.mode === 'food-guess' || (qList && qList.length > 0 && (qList[0]?.mode === 'food-guess'));
  const GUESS_TIME = settingsObj?.guessTime || 3.0;
  const REVEAL_TIME = isCountryGuess ? 6.0 : 2.0;

  const timings = [];
  let cumulativeTime = 0;

  (qList || []).forEach((q) => {
    const readTime = getQuestionReadTime(q, setObj, settingsObj?.voiceLang, settingsObj?.voiceSpeed);
    let questionRevealTime = isCountryGuess ? 6.0 : 2.0;
    const qTotalTime = readTime + GUESS_TIME + questionRevealTime;
    timings.push({
      readTime,
      guessTime: GUESS_TIME,
      revealTime: questionRevealTime,
      qTotalTime,
      startTime: cumulativeTime,
      endTime: cumulativeTime + qTotalTime
    });
    cumulativeTime += qTotalTime;
  });

  return {
    timings,
    totalQuestionsTime: cumulativeTime || (GUESS_TIME + REVEAL_TIME),
    GUESS_TIME,
    REVEAL_TIME
  };
};

export default function MCQVideoPreviewCanvas({ questionSets, activeSetIndex, setActiveSetIndex, settings }) {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  // References for animation state & export cancellation
  const animFrameIdRef = useRef(null);
  const startTimeRef = useRef(null);
  const lastSecondRef = useRef(-1);
  const lastQIdxRef = useRef(-1);
  const lastStateRef = useRef(''); // 'guess', 'reveal'
  const particlesRef = useRef([]);
  const logoImgRef = useRef(null);
  const isPlayingRef = useRef(false);
  const isExportCancelledRef = useRef(false);
  const activeRecorderRef = useRef(null);
  const lastProgressRef = useRef(-1);
  const previewProgressRef = useRef(-1);
  const lastQIdxStateRef = useRef(-1);
  const lastTypedCharRef = useRef(-1);
  const imageCacheRef = useRef(new Map());
  const [logoReady, setLogoReady] = useState(false);

  // Helper tải ảnh an toàn CORS 100% để Canvas không bao giờ bị SecurityError / Tainted
  const loadCorsCleanImage = (url) => {
    if (!url || imageCacheRef.current.has(url)) return;

    const imgObj = new Image();
    imageCacheRef.current.set(url, imgObj);

    // Bổ sung tham số &cors=1 cho URL HTTP/HTTPS để bỏ qua lỗi cache CORS của trình duyệt (Chrome Disk Cache)
    let corsUrl = url;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      corsUrl = url + (url.includes('?') ? '&cors=1' : '?cors=1');
    }

    const tryFetchBlob = async (targetUrl) => {
      try {
        const res = await fetch(targetUrl, { mode: 'cors' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        imgObj.onload = () => { triggerReRender(); };
        imgObj.onerror = () => { imgObj.isError = true; triggerReRender(); };
        imgObj.src = objectUrl;
        return true;
      } catch (err) {
        return false;
      }
    };

    imgObj.crossOrigin = 'anonymous';
    imgObj.onload = () => {
      triggerReRender();
    };
    imgObj.onerror = async () => {
      // Thử phương án 2: fetch mode cors -> Blob -> ObjectURL
      let success = await tryFetchBlob(url);
      if (success) return;

      // Thử phương án 3: CORS Proxy -> Blob -> ObjectURL
      const proxyUrl1 = `https://corsproxy.io/?${encodeURIComponent(url)}`;
      success = await tryFetchBlob(proxyUrl1);
      if (success) return;

      const proxyUrl2 = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      success = await tryFetchBlob(proxyUrl2);
      if (success) return;

      // Nếu tất cả phương án CORS đều thất bại, đánh dấu isError (TUYỆT ĐỐI không load ảnh non-CORS gây hỏng Canvas)
      imgObj.isError = true;
      triggerReRender();
    };
    imgObj.src = corsUrl;
  };

  const getLoadedImage = (url) => {
    if (!url) return null;
    let cached = imageCacheRef.current.get(url);
    if (!cached) {
      loadCorsCleanImage(url);
      return null;
    }
    return (cached.complete && cached.naturalWidth > 0 && !cached.isError) ? cached : null;
  };

  // Preload toàn bộ hình ảnh trong danh sách câu hỏi trước khi xuất video
  const preloadQuestionImages = async (qs) => {
    if (!qs || !qs.length) return;
    const promises = qs.map(q => {
      if (!q.image) return Promise.resolve(null);
      return new Promise(resolve => {
        loadCorsCleanImage(q.image);
        const checkLoaded = () => {
          const cached = imageCacheRef.current.get(q.image);
          if (cached && (cached.complete || cached.isError)) {
            resolve(cached);
          } else {
            setTimeout(checkLoaded, 40);
          }
        };
        checkLoaded();
      });
    });
    await Promise.all(promises);
  };

  const activeSet = questionSets[activeSetIndex] || questionSets[0] || { questions: [] };
  const questions = activeSet.questions || [];

  // State tiến trình xuất video của bộ đang chọn
  const [exportProgress, setExportProgress] = useState(0);

  // CANCEL EXPORT HANDLER
  const handleCancelExport = () => {
    isExportCancelledRef.current = true;
    if (activeRecorderRef.current && activeRecorderRef.current.state === 'recording') {
      try {
        activeRecorderRef.current.stop();
      } catch (e) { }
    }
    setIsExporting(false);
    setIsPlaying(true);
    setExportProgress(0);
  };

  // Load logo from public folder (ưu tiên logo2.png)
  useEffect(() => {
    const candidateUrls = ['/logo2.png', 'logo2.png', '/logo.png', '/bigo.png'];
    let loaded = false;

    const tryLoad = (idx) => {
      if (idx >= candidateUrls.length || loaded) return;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        if (!loaded) {
          loaded = true;
          logoImgRef.current = img;
          setLogoReady(true);
        }
      };
      img.onerror = () => tryLoad(idx + 1);
      img.src = candidateUrls[idx];
    };

    tryLoad(0);
  }, []);

  // Redraw when fonts ready
  useEffect(() => {
    if (document.fonts) {
      document.fonts.ready.then(() => {
        setLogoReady(prev => !prev);
      });
    }
  }, []);

  // Preload speech audio buffers for current set questions in background
  useEffect(() => {
    if (questions && questions.length) {
      const qSpeechItems = questions.map(q => ({ question: q.question })).filter(i => !!i.question);
      const effectiveVoice = getEffectiveVoice(settings.voiceLang, activeSet);
      audioSynth.preloadWordList(qSpeechItems, effectiveVoice, settings.voiceSpeed || 1.25);

      if (settings.readAnswer !== false && activeSet?.mode !== 'player-guess' && activeSet?.mode !== 'landmark-guess' && activeSet?.mode !== 'food-guess' && activeSet?.mode !== 'flags') {
        const ansSpeechItems = questions.map(q => {
          const correctKey = (q.correctOption || 'A').toUpperCase();
          let ansText = q['option' + correctKey] || q.word || q.optionA || '';
          return { question: ansText };
        }).filter(i => !!i.question);
        const enVoice = settings.voiceLang && settings.voiceLang.startsWith('en-') ? settings.voiceLang : 'en-US-AnaNeural';
        audioSynth.preloadWordList(ansSpeechItems, enVoice, settings.voiceSpeed || 1.25);
      }
    }
  }, [activeSetIndex, questions, settings]);

  // Timing params per question (Chế độ Đoán Quốc Gia 5 gợi ý: 15s gợi ý + 6s công bố = 21s/câu)
  const isCountryGuess = activeSet?.mode === 'country-guess' || (questions.length > 0 && (questions[0]?.mode === 'country-guess' || questions[0]?.clues));
  const isLandmark = activeSet?.mode === 'landmark-guess' || activeSet?.mode === 'place-guess' || (questions.length > 0 && (questions[0]?.mode === 'landmark-guess' || questions[0]?.mode === 'place-guess'));
  const GUESS_TIME = settings.guessTime || 3.0;
  const REVEAL_TIME = isCountryGuess ? 6.0 : (isLandmark ? 3.5 : 2.0);
  const TOTAL_Q_TIME = GUESS_TIME + REVEAL_TIME;
  const TOTAL_VIDEO_TIME = (questions.length || 1) * TOTAL_Q_TIME + 2.0;
  const THEME_LIST = [
    THEMES.find(t => t.id === 'comic') || THEMES[0],
    THEMES.find(t => t.id === 'neon') || THEMES[1],
    THEMES.find(t => t.id === 'pink') || THEMES[2],
    THEMES.find(t => t.id === 'dark') || THEMES[3]
  ];

  // Mỗi bộ câu hỏi tự động áp dụng 1 phong cách giao diện khác nhau
  const currentTheme = THEME_LIST[activeSetIndex % THEME_LIST.length];

  // Initialize background floating particles
  useEffect(() => {
    const pts = [];
    for (let i = 0; i < 25; i++) {
      pts.push({
        x: Math.random() * 1080,
        y: Math.random() * 1920,
        radius: Math.random() * 12 + 6,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        color: ['#FFDE59', '#FF3366', '#00F0FF', '#00E676', '#FFD166'][Math.floor(Math.random() * 5)]
      });
    }
    particlesRef.current = pts;
  }, []);

  // Helper auto-fit font size
  const getFitFont = (ctx, text, weight, family, maxW, startSize, minSize = 20) => {
    let size = startSize;
    ctx.font = `${weight} ${size}px ${family}`;
    while (size > minSize && ctx.measureText(text).width > maxW) {
      size -= 2;
      ctx.font = `${weight} ${size}px ${family}`;
    }
    return `${weight} ${size}px ${family}`;
  };

  // HELPER MULTI-LINE TEXT WRAPPER
  const drawWrappedText = (ctx, text, x, startY, maxW, startFontSize = 44, weight = '900', family = '"Be Vietnam Pro", sans-serif', maxLines = 4, options = {}) => {
    ctx.save();
    let fontSize = options.startFontSize || startFontSize;

    const getLinesForFont = (size) => {
      ctx.font = `${weight} ${size}px ${family}`;
      const words = (text || '').trim().split(/\s+/).filter(Boolean);
      if (words.length === 0) return [''];
      const lines = [];
      let currentLine = '';

      for (let i = 0; i < words.length; i++) {
        const testLine = currentLine ? `${currentLine} ${words[i]}` : words[i];
        if (ctx.measureText(testLine).width > maxW && currentLine) {
          lines.push(currentLine);
          currentLine = words[i];
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);
      return lines;
    };

    const minAllowedY = options.minY !== undefined ? options.minY : -Infinity;
    const maxHeightAllowed = options.maxHeight !== undefined ? options.maxHeight : Infinity;
    const minFontSize = options.minFontSize || 24;

    let lines = getLinesForFont(fontSize);
    let iterations = 0;

    while (iterations < 30 && fontSize > minFontSize) {
      const lineHeight = fontSize * 1.35;
      const totalH = lines.length * lineHeight;

      const fitsLines = lines.length <= (options.maxLines || maxLines);
      const fitsHeight = totalH <= maxHeightAllowed;

      if (fitsLines && fitsHeight) {
        break;
      }
      fontSize -= 1.0;
      lines = getLinesForFont(fontSize);
      iterations++;
    }

    ctx.font = `${weight} ${fontSize}px ${family}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const lineHeight = fontSize * 1.35;
    const totalH = lines.length * lineHeight;
    let topY = startY - totalH / 2 + lineHeight / 2;

    // Safety check: Ensure line 1 top doesn't cross minAllowedY
    const firstLineTop = topY - fontSize * 0.6;
    if (firstLineTop < minAllowedY) {
      topY += (minAllowedY - firstLineTop + 4);
    }

    lines.forEach((line, idx) => {
      ctx.fillText(line, x, topY + idx * lineHeight);
    });

    ctx.restore();
    return lines.length;
  };

  // HELPER MULTI-LINE TEXT WRAPPER WITH 3D STROKE (FOR B1 QUESTION TEXT)
  const drawWrappedQuestion3D = (ctx, text, x, startY, maxW, startFontSize = 48, options = {}) => {
    ctx.save();
    let fontSize = options.startFontSize || startFontSize;
    const weight = options.weight || '900';
    const family = options.family || FONT_FAMILY;
    const maxLines = options.maxLines || 4;
    const minAllowedY = options.minY !== undefined ? options.minY : 290;
    const maxHeightAllowed = options.maxHeight !== undefined ? options.maxHeight : 230;
    const minFontSize = options.minFontSize || 32;

    const getLinesForFont = (size) => {
      ctx.font = `${weight} ${size}px ${family}`;
      const words = (text || '').trim().split(/\s+/).filter(Boolean);
      if (words.length === 0) return [''];
      const lines = [];
      let currentLine = '';

      for (let i = 0; i < words.length; i++) {
        const testLine = currentLine ? `${currentLine} ${words[i]}` : words[i];
        if (ctx.measureText(testLine).width > maxW && currentLine) {
          lines.push(currentLine);
          currentLine = words[i];
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);
      return lines;
    };

    let lines = getLinesForFont(fontSize);
    let iterations = 0;

    while (iterations < 30 && fontSize > minFontSize) {
      const lineHeight = fontSize * 1.32;
      const totalH = lines.length * lineHeight;

      const fitsLines = lines.length <= maxLines;
      const fitsHeight = totalH <= maxHeightAllowed;

      if (fitsLines && fitsHeight) {
        break;
      }
      fontSize -= 1.0;
      lines = getLinesForFont(fontSize);
      iterations++;
    }

    ctx.font = `${weight} ${fontSize}px ${family}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const lineHeight = fontSize * 1.32;
    const totalH = lines.length * lineHeight;
    let topY = startY - totalH / 2 + lineHeight / 2;

    const firstLineTop = topY - fontSize * 0.6;
    if (firstLineTop < minAllowedY) {
      topY += (minAllowedY - firstLineTop + 6);
    }

    lines.forEach((lineStr, idx) => {
      const lineY = topY + idx * lineHeight;
      const strokeW = Math.max(4, Math.min(10, fontSize * 0.18));

      // 3D Stroke
      ctx.lineWidth = strokeW;
      ctx.strokeStyle = options.strokeColor || '#003E99';
      ctx.strokeText(lineStr, x, lineY + Math.max(2, strokeW * 0.25));

      // Shadow & Fill Text
      ctx.shadowColor = 'rgba(0, 30, 90, 0.6)';
      ctx.shadowBlur = 16;
      ctx.shadowOffsetY = 6;
      ctx.fillStyle = options.textColor || '#FFFFFF';
      ctx.fillText(lineStr, x, lineY);
    });

    ctx.restore();
    return { linesCount: lines.length, bottomY: topY + (lines.length - 1) * lineHeight + fontSize * 0.5 };
  };

  // Helper draw rounded rectangle
  const drawRoundRect = (ctx, x, y, width, height, radius) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  // Helper draw image with object-fit: cover logic + Ken Burns Zoom & Panning Effect
  const drawFitImage = (ctx, img, x, y, w, h, options = {}) => {
    if (!img || !img.naturalWidth || !img.naturalHeight) return;

    const progress = options.progress !== undefined ? options.progress : 0;
    const kenBurns = options.kenBurns === true;
    const containFit = options.containFit === true || options.fitMode === 'contain' || options.smartLandmarkFit === true;
    const zoomIn = options.zoomDirection === 'out' ? false : ((options.qIdx || 0) % 2 === 0);

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const targetRatio = w / h;

    // Contain Fit: Hiển thị TRỌN VẸN 100% hình ảnh không bao giờ bị cắt xén (kèm phông nền mờ mọng từ chính bức ảnh)
    if (containFit && Math.abs(imgRatio - targetRatio) > 0.04) {
      ctx.save();
      // 1. Phông nền mờ phủ mỏng từ chính bức ảnh
      const bgW = img.naturalWidth;
      const bgH = img.naturalWidth / targetRatio;
      const bgY = Math.max(0, (img.naturalHeight - bgH) / 2);
      ctx.drawImage(img, 0, bgY, bgW, Math.min(img.naturalHeight, bgH), x, y, w, h);
      ctx.fillStyle = 'rgba(10, 18, 38, 0.55)';
      ctx.fillRect(x, y, w, h);

      // 2. Hình ảnh gốc hiển thị TRỌN VẸN 100% nổi bật chính giữa
      let dw, dh, dx, dy;
      if (imgRatio > targetRatio) {
        dw = w;
        dh = w / imgRatio;
        dx = x;
        dy = y + (h - dh) / 2;
      } else {
        dh = h;
        dw = h * imgRatio;
        dx = x + (w - dw) / 2;
        dy = y;
      }

      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 20;
      ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, dx, dy, dw, dh);
      ctx.restore();
      return;
    }

    let zoom = 1.0;
    if (kenBurns) {
      // Smooth Ken Burns zoom (1.0 -> 1.16x hoặc 1.16x -> 1.0)
      zoom = zoomIn ? (1.0 + progress * 0.16) : (1.16 - progress * 0.16);
    }

    const panX = kenBurns ? (progress - 0.5) * (img.naturalWidth * 0.04) : 0;
    const panY = kenBurns ? (progress - 0.5) * (img.naturalHeight * 0.04) : 0;

    let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;

    if (imgRatio > targetRatio) {
      sw = (img.naturalHeight * targetRatio) / zoom;
      sh = img.naturalHeight / zoom;
      sx = (img.naturalWidth - sw) / 2 + panX;
      sy = (img.naturalHeight - sh) / 2 + panY;
    } else {
      sw = img.naturalWidth / zoom;
      sh = (img.naturalWidth / targetRatio) / zoom;
      sx = (img.naturalWidth - sw) / 2 + panX;
      sy = (img.naturalHeight - sh) / 2 + panY;
    }

    sx = Math.max(0, Math.min(img.naturalWidth - sw, sx));
    sy = Math.max(0, Math.min(img.naturalHeight - sh, sy));

    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  };

  // ============ EASING HELPERS ============
  const easeOutCubic = (t) => 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);
  const easeOutBack = (t) => {
    const c = Math.max(0, Math.min(1, t));
    const s = 1.70158;
    return 1 + (s + 1) * Math.pow(c - 1, 3) + s * Math.pow(c - 1, 2);
  };
  const easeInOutSine = (t) => -(Math.cos(Math.PI * Math.max(0, Math.min(1, t))) - 1) / 2;

  // Seeded pseudo-random generator (deterministic per câu hỏi, đảm bảo hiệu ứng giống nhau
  // dù render trực tiếp hay xuất video từng khung hình)
  const seededRandom = (seed) => {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  };

  // ============ ICON VECTOR DRAWING (thay thế icon emoji) ============
  // Vẽ icon dấu tích (check) trong hình tròn
  const drawIconCheck = (ctx, cx, cy, size, color) => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = size * 0.16;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - size * 0.5, cy + size * 0.02);
    ctx.lineTo(cx - size * 0.14, cy + size * 0.38);
    ctx.lineTo(cx + size * 0.52, cy - size * 0.35);
    ctx.stroke();
    ctx.restore();
  };

  // Vẽ icon đồng hồ (clock)
  const drawIconClock = (ctx, cx, cy, r, color) => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = r * 0.14;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx, cy - r * 0.55);
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + r * 0.4, cy + r * 0.12);
    ctx.stroke();
    ctx.restore();
  };

  // Vẽ icon dấu hỏi kiểu bong bóng chat (chat-bubble question)
  const drawIconQuestionBubble = (ctx, cx, cy, r, color) => {
    ctx.save();
    ctx.fillStyle = color;
    drawRoundRect(ctx, cx - r, cy - r * 0.82, r * 2, r * 1.5, r * 0.5);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.35, cy + r * 0.62);
    ctx.lineTo(cx - r * 0.05, cy + r * 1.15);
    ctx.lineTo(cx + r * 0.15, cy + r * 0.55);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#1A1635';
    ctx.font = `900 ${Math.round(r * 1.15)}px "Be Vietnam Pro", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', cx, cy - r * 0.05);
    ctx.textBaseline = 'alphabetic';
    ctx.restore();
  };

  // Vẽ icon bóng đèn (ý tưởng / giải thích)
  const drawIconBulb = (ctx, cx, cy, r, color) => {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy - r * 0.15, r * 0.62, 0, Math.PI * 2);
    ctx.fill();
    drawRoundRect(ctx, cx - r * 0.28, cy + r * 0.32, r * 0.56, r * 0.32, r * 0.12);
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = r * 0.1;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.2, cy + r * 0.78);
    ctx.lineTo(cx + r * 0.2, cy + r * 0.78);
    ctx.stroke();
    // Tia sáng
    ctx.strokeStyle = color;
    ctx.lineWidth = r * 0.09;
    [[-1, -1], [1, -1], [0, -1.3]].forEach(([dx, dy], i) => {
      ctx.beginPath();
      ctx.moveTo(cx + dx * r * 0.75, cy - r * 0.15 + dy * r * 0.15);
      ctx.lineTo(cx + dx * r * 1.05, cy - r * 0.15 + dy * r * 0.4);
      ctx.stroke();
    });
    ctx.restore();
  };

  // Vẽ icon trái tim
  const drawIconHeart = (ctx, cx, cy, r, color) => {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(cx, cy + r * 0.75);
    ctx.bezierCurveTo(cx - r * 1.3, cy - r * 0.35, cx - r * 0.55, cy - r * 1.25, cx, cy - r * 0.42);
    ctx.bezierCurveTo(cx + r * 0.55, cy - r * 1.25, cx + r * 1.3, cy - r * 0.35, cx, cy + r * 0.75);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  // Vẽ icon thích (thumbs up) đơn giản, tối giản
  const drawIconThumbsUp = (ctx, cx, cy, r, color) => {
    ctx.save();
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    drawRoundRect(ctx, cx - r * 0.85, cy - r * 0.1, r * 0.5, r * 1.0, r * 0.15);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.35, cy - r * 0.1);
    ctx.lineTo(cx - r * 0.35, cy - r * 0.55);
    ctx.quadraticCurveTo(cx - r * 0.1, cy - r * 1.25, cx + r * 0.28, cy - r * 1.15);
    ctx.quadraticCurveTo(cx + r * 0.5, cy - r * 1.05, cx + r * 0.32, cy - r * 0.55);
    ctx.lineTo(cx + r * 0.2, cy - r * 0.1);
    drawRoundRect(ctx, cx - r * 0.35, cy - r * 0.1, r * 1.2, r * 0.2, r * 0.1);
    ctx.fill();
    drawRoundRect(ctx, cx - r * 0.35, cy + r * 0.15, r * 1.15, r * 0.85, r * 0.28);
    ctx.fill();
    ctx.restore();
  };

  // Vẽ icon tia sáng lấp lánh (sparkle) trang trí góc
  const drawIconSparkle = (ctx, cx, cy, r, color, rotation = 0) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.quadraticCurveTo(r * 0.18, -r * 0.18, r, 0);
    ctx.quadraticCurveTo(r * 0.18, r * 0.18, 0, r);
    ctx.quadraticCurveTo(-r * 0.18, r * 0.18, -r, 0);
    ctx.quadraticCurveTo(-r * 0.18, -r * 0.18, 0, -r);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  // ============ HẠT CONFETTI VẼ TRỰC TIẾP TRÊN CANVAS ============
  // Đã được loại bỏ để tránh giật lag khi xuất (render) video.
  const drawCanvasConfettiBurst = (ctx, qIdx, revealElapsed, theme) => {
    return;
  };

  // Syntax Highlighting Tokenizer cho Code Typing Shorts
  const renderSyntaxHighlightedLine = (ctx, lineStr, startX, lineY) => {
    if (!lineStr) return;

    if (lineStr.trim().startsWith('//') || lineStr.trim().startsWith('#') || lineStr.trim().startsWith('/*')) {
      ctx.fillStyle = '#6C7086'; // Comment Gray
      ctx.fillText(lineStr, startX, lineY);
      return;
    }

    const tokenRegex = /(\/\/.*|#.*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:const|let|var|function|return|import|export|from|def|if|else|for|while|class|new|try|catch|async|await)\b|\b\d+\b|[a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*\()|[{}()[\];,]|[^A-Za-z0-9_\s{}()[\];,]+|\s+)/g;

    let match;
    let currentX = startX;
    const keywords = new Set(['const', 'let', 'var', 'function', 'return', 'import', 'export', 'from', 'def', 'if', 'else', 'for', 'while', 'class', 'new', 'try', 'catch', 'async', 'await']);

    while ((match = tokenRegex.exec(lineStr)) !== null) {
      const token = match[0];

      if (token.startsWith('//') || token.startsWith('#')) {
        ctx.fillStyle = '#6C7086';
      } else if (keywords.has(token)) {
        ctx.fillStyle = '#C678DD'; // Keyword Purple
      } else if (token.startsWith('"') || token.startsWith("'") || token.startsWith('`')) {
        ctx.fillStyle = '#98C379'; // String Green
      } else if (/^\d+$/.test(token) || token === 'true' || token === 'false') {
        ctx.fillStyle = '#D19A66'; // Number Orange
      } else if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(token) && lineStr.slice(tokenRegex.lastIndex).trim().startsWith('(')) {
        ctx.fillStyle = '#61AFEF'; // Function Call Blue
      } else {
        ctx.fillStyle = '#CDD6F4'; // Plain Text White
      }

      ctx.fillText(token, currentX, lineY);
      currentX += ctx.measureText(token).width;
    }
  };

  // Helper render macOS Code IDE Window với Typewriter Animation & Audio Click Sync
  const drawCodeWindow = (ctx, codeText, x, y, w, h, timeInQ, isPlaying) => {
    ctx.save();

    // 1. Container Shadow & Outer Card
    ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 10;
    ctx.fillStyle = '#181825'; // Deep Dark IDE
    drawRoundRect(ctx, x, y, w, h, 20);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
    ctx.stroke();

    // 2. Top macOS Window Control Bar
    const barH = 38;
    ctx.fillStyle = '#11111B';
    ctx.beginPath();
    ctx.moveTo(x + 20, y);
    ctx.lineTo(x + w - 20, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + 20);
    ctx.lineTo(x + w, y + barH);
    ctx.lineTo(x, y + barH);
    ctx.lineTo(x, y + 20);
    ctx.quadraticCurveTo(x, y, x + 20, y);
    ctx.closePath();
    ctx.fill();

    // 3. macOS Window Buttons (Red, Yellow, Green)
    const dotY = y + barH / 2;
    const dots = [
      { cx: x + 22, color: '#FF5F56' },
      { cx: x + 40, color: '#FFBD2E' },
      { cx: x + 58, color: '#27C93F' }
    ];
    dots.forEach(d => {
      ctx.fillStyle = d.color;
      ctx.beginPath();
      ctx.arc(d.cx, dotY, 5.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // 4. File Tab Badge
    const rawCode = (codeText || '').trim();
    let ext = 'script.js';
    if (rawCode.includes('#')) ext = 'main.py';
    else if (rawCode.includes('/*') || rawCode.includes('css')) ext = 'styles.css';

    ctx.fillStyle = '#1E1E2E';
    drawRoundRect(ctx, x + 80, y + 5, 140, 28, 8);
    ctx.fill();

    ctx.fillStyle = '#00F0FF';
    ctx.font = 'bold 14px "Consolas", "Monaco", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`⚡ ${ext}`, x + 150, y + 19);

    // 5. Typewriter Logic & Mechanical Keyboard Click Audio
    const typedCharCount = Math.min(rawCode.length, Math.floor(timeInQ * 28));
    const currentTypedText = rawCode.slice(0, typedCharCount);

    if (isPlaying && typedCharCount > 0 && typedCharCount <= rawCode.length) {
      if (lastTypedCharRef.current !== typedCharCount) {
        lastTypedCharRef.current = typedCharCount;
        audioSynth.playKeyboardClickSound(0.2);
      }
    }

    // 6. Render Lines of Code with Syntax Highlighting
    const lines = currentTypedText.split('\n');
    const startTextY = y + barH + 26;
    const lineHeight = 26;
    const startTextX = x + 55;

    ctx.font = '600 18px "Consolas", "Fira Code", "Monaco", monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    lines.forEach((lineStr, lineIdx) => {
      const lineY = startTextY + lineIdx * lineHeight;
      if (lineY > y + h - 10) return;

      // Line Numbers (Soft Gray)
      ctx.fillStyle = '#585B70';
      ctx.font = '500 16px "Consolas", "Monaco", monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`${lineIdx + 1}`, x + 40, lineY);

      // Code Tokens
      ctx.textAlign = 'left';
      ctx.font = '600 18px "Consolas", "Fira Code", "Monaco", monospace';
      renderSyntaxHighlightedLine(ctx, lineStr, startTextX, lineY);
    });

    // 7. Blinking Cursor |
    const isCursorVisible = Math.floor(timeInQ * 4) % 2 === 0;
    if (isCursorVisible && typedCharCount <= rawCode.length) {
      const lastLineIndex = Math.max(0, lines.length - 1);
      const lastLineStr = lines[lastLineIndex] || '';
      const cursorY = startTextY + lastLineIndex * lineHeight;

      ctx.font = '600 18px "Consolas", "Fira Code", "Monaco", monospace';
      const lastLineWidth = ctx.measureText(lastLineStr).width;
      const cursorX = startTextX + lastLineWidth + 2;

      if (cursorY <= y + h - 10) {
        ctx.fillStyle = '#00F0FF';
        ctx.fillRect(cursorX, cursorY - 16, 9, 20);
      }
    }

    ctx.restore();
  };

  // Vẽ các quầng sáng nền chuyển động mềm mại (thay cho hiệu ứng blur thực)
  const drawAmbientGlowOrbs = (ctx, t, theme = {}) => {
    const safeTheme = theme || {};
    const defaultColor = safeTheme.accent || safeTheme.bg || '#2563EB';
    const defaultColor2 = safeTheme.accent2 || safeTheme.accent || safeTheme.bg || '#3B82F6';
    const orbs = safeTheme.glowOrbs || [
      { cx: 0.2, cy: 0.15, r: 520, color: defaultColor, speed: 0.05 },
      { cx: 0.85, cy: 0.35, r: 460, color: defaultColor2, speed: 0.07 },
      { cx: 0.3, cy: 0.85, r: 560, color: defaultColor2, speed: 0.04 }
    ];
    ctx.save();
    orbs.forEach((o, i) => {
      let colorHex = o.color || defaultColor;
      if (!colorHex || typeof colorHex !== 'string' || !colorHex.startsWith('#')) {
        colorHex = '#2563EB';
      }
      const ox = o.cx * 1080 + Math.sin(t * o.speed + i * 2) * 60;
      const oy = o.cy * 1920 + Math.cos(t * o.speed * 0.8 + i * 2) * 60;
      const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, o.r);
      grad.addColorStop(0, colorHex + '55');
      grad.addColorStop(1, colorHex + '00');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 1920);
    });
    ctx.restore();
  };

  // Vignette điện ảnh - làm tối nhẹ 4 góc để tăng chiều sâu, không ảnh hưởng nội dung giữa khung
  const drawVignette = (ctx) => {
    ctx.save();
    const grad = ctx.createRadialGradient(540, 960, 700, 540, 960, 1300);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.38)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1920);
    ctx.restore();
  };

  // Trigger Confetti (đã loại bỏ để tránh giật lag khi xuất video)
  const triggerConfetti = () => {
    return;
  };

  // Main Canvas Render Loop
  const renderFrame = (timestamp) => {
    if (!isPlayingRef.current) return;
    try {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsedSec = Math.max(0, (timestamp - startTimeRef.current) / 1000);

      const timingsInfo = getQuestionTimings(questions, activeSet, settings);
      const totalVideoTime = timingsInfo.totalQuestionsTime;
      let overallProgress = (elapsedSec % totalVideoTime) / totalVideoTime;
      const newProgress = Math.min(100, Math.floor((overallProgress || 0) * 100));

      if (newProgress !== previewProgressRef.current) {
        previewProgressRef.current = newProgress;
        setProgressPercent(newProgress);
      }

      const timeInLoop = elapsedSec % totalVideoTime;
      let validQIdx = 0;
      for (let i = 0; i < timingsInfo.timings.length; i++) {
        const t = timingsInfo.timings[i];
        if (timeInLoop >= t.startTime && timeInLoop < t.endTime) {
          validQIdx = i;
          break;
        }
      }

      const qTiming = timingsInfo.timings[validQIdx] || {
        readTime: 2.0,
        guessTime: 3.0,
        revealTime: 2.0,
        startTime: 0
      };

      if (validQIdx !== lastQIdxStateRef.current) {
        lastQIdxStateRef.current = validQIdx;
        setCurrentQIndex(validQIdx);
      }

      const timeInQ = timeInLoop - qTiming.startTime;
      const activeQ = questions[validQIdx] || questions[0] || {};

      let stage = 'read';
      let stageProgress = 0;

      if (timeInQ < qTiming.readTime) {
        stage = 'read';
        stageProgress = timeInQ / qTiming.readTime;
      } else if (timeInQ < qTiming.readTime + qTiming.guessTime) {
        stage = 'guess';
        stageProgress = (timeInQ - qTiming.readTime) / qTiming.guessTime;
      } else {
        stage = 'reveal';
        stageProgress = (timeInQ - qTiming.readTime - qTiming.guessTime) / qTiming.revealTime;
      }

      // Audio & Effect Triggers
      if (lastQIdxRef.current !== validQIdx) {
        lastQIdxRef.current = validQIdx;
        lastSecondRef.current = -1;
        if (isPlayingRef.current) {
          audioSynth.playWhoosh(0.35);
        }
        if (isPlayingRef.current && activeQ && activeQ.question) {
          const effectiveVoice = getEffectiveVoice(settings.voiceLang, activeSet, activeQ);
          const ttsQuestionText = getTTSQuestionText(activeQ.question, activeSet?.mode || activeQ.mode);
          TTSService.speak(ttsQuestionText, {
            voice: effectiveVoice,
            rate: settings.voiceSpeed || 1.25
          });
        }
      }

      if (stage === 'guess') {
        const timeInGuessStage = timeInQ - qTiming.readTime;
        const currentSecond = Math.floor(timeInGuessStage);
        if (currentSecond !== lastSecondRef.current) {
          lastSecondRef.current = currentSecond;
          if (settings.playTick && isPlayingRef.current) {
            const remainingSec = Math.max(0, Math.ceil(qTiming.guessTime - timeInGuessStage));
            audioSynth.playTickingSound(0.6, null, remainingSec <= 3);
          }
        }
      }

      if (stage === 'reveal' && lastStateRef.current !== 'reveal') {
        const isFlashcardMode = (activeSet?.mode === 'lingobibi-flashcard' || activeQ?.mode === 'lingobibi-flashcard' || activeSet?.id === 'lingobibi-flashcard');
        const isCaDaoMode = (activeSet?.mode === 'ca-dao-tuc-ngu' || activeQ?.mode === 'ca-dao-tuc-ngu' || activeSet?.id === 'ca-dao-tuc-ngu');
        const isFlagsOrCountryMode = (activeSet?.mode === 'flags' || activeQ?.mode === 'flags' || activeSet?.id === 'flags' || activeSet?.mode === 'country-guess' || activeQ?.mode === 'country-guess' || activeSet?.id === 'country-guess-5-clues');
        if (isPlayingRef.current && !isFlashcardMode) {
          triggerConfetti();
          audioSynth.playSuccessFanfare(0.65);
        }
        const isLandmarkOrFoodMode = (activeSet?.mode === 'landmark-guess' || activeQ?.mode === 'landmark-guess' || activeSet?.mode === 'food-guess' || activeQ?.mode === 'food-guess');
        if ((settings.readAnswer || isLandmarkOrFoodMode) && isPlayingRef.current && activeQ && !isCaDaoMode && !isFlagsOrCountryMode) {
          // Lấy đáp án đúng (Option A, B, C, D hoặc landmark / dish / word)
          const correctKey = (activeQ.correctOption || 'A').toUpperCase();
          let targetWord = activeQ.landmark || activeQ.dish || activeQ.word || '';
          if (!targetWord) {
            if (correctKey === 'A') targetWord = activeQ.optionA;
            else if (correctKey === 'B') targetWord = activeQ.optionB;
            else if (correctKey === 'C') targetWord = activeQ.optionC;
            else if (correctKey === 'D') targetWord = activeQ.optionD;
          }
          if (!targetWord) {
            targetWord = activeQ.optionA || '';
          }

          targetWord = (targetWord || '').trim();
          if (targetWord) {
            const isLingoBiBi = !!(
              (activeSet && (activeSet.channel === 'Lingo BiBi' || activeSet.themeColor === 'pink' || activeSet.id === 'vocab-b1-word-guess-lingobibi')) ||
              (activeQ && (activeQ.channel === 'Lingo BiBi' || activeQ.themeColor === 'pink'))
            );

            const isViText = isLandmarkOrFoodMode || (!isLingoBiBi && (
              /[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/i.test(targetWord) ||
              (activeSet && (activeSet.topic === 'ĐỐ VUI B1' || activeSet.topic === 'TRẮC NGHIỆM B1')) ||
              (activeQ && (activeQ.topic === 'ĐỐ VUI B1' || activeQ.topic === 'TRẮC NGHIỆM B1'))
            ));

            const answerVoice = (isLingoBiBi || !isViText)
              ? (settings.voiceLang && settings.voiceLang.startsWith('en-') ? settings.voiceLang : 'en-US-AnaNeural')
              : (settings.voiceLang && settings.voiceLang.startsWith('vi-') ? settings.voiceLang : 'vi-VN-HoaiMyNeural');

            TTSService.speak(targetWord, {
              voice: answerVoice,
              rate: settings.voiceSpeed || 1.25
            });
          }
        }
      }
      lastStateRef.current = stage;

      // CANVAS DRAWING (Resolution: 1080 x 1920)
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        drawCanvasFrame(ctx, activeQ, validQIdx, Math.max(1, questions.length), stage, timeInQ, stageProgress, currentTheme);
      }
    } catch (renderErr) {
      console.warn('renderFrame error (auto-recovering):', renderErr);
    }

    if (isPlayingRef.current) {
      animFrameIdRef.current = requestAnimationFrame(renderFrame);
    }
  };

  // Dedicated Canvas Renderer for "Nhìn Ảnh Đoán Từ Vựng Tiếng Anh" (Word Guess Mode)
  const drawWordGuessCanvasFrame = (ctx, qObj, qIdx, totalQ, stage, timeInQ, stageProgress, theme) => {
    const safeQObj = qObj || {};
    const globalT = performance.now() / 1000;
    const targetWord = String(safeQObj.word || safeQObj.optionA || 'APPLE').toUpperCase().trim();

    // 1. Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1920);
    bgGrad.addColorStop(0, theme.bg);
    bgGrad.addColorStop(1, theme.bgTo || theme.bg);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1920);
    drawAmbientGlowOrbs(ctx, globalT, theme);

    // 2. Floating Background Particles
    particlesRef.current.forEach((p, pi) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > 1080) p.vx *= -1;
      if (p.y < 0 || p.y > 1920) p.vy *= -1;

      const twinkle = 0.18 + (Math.sin(globalT * 1.4 + pi) * 0.5 + 0.5) * 0.22;
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2.2);
      glow.addColorStop(0, p.color);
      glow.addColorStop(1, p.color + '00');
      ctx.save();
      ctx.globalAlpha = twinkle;
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // 3. Top Logo Badge
    const logoW = 160, logoH = 160, logoX = 70, logoY = 70;
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 25;
    ctx.shadowOffsetY = 10;
    ctx.fillStyle = '#FFFFFF';
    drawRoundRect(ctx, logoX - 10, logoY - 10, logoW + 20, logoH + 20, 36);
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = theme.accent;
    ctx.stroke();
    ctx.restore();

    if (logoImgRef.current && logoImgRef.current.complete && logoImgRef.current.naturalWidth > 0) {
      ctx.save();
      drawRoundRect(ctx, logoX, logoY, logoW, logoH, 28);
      ctx.clip();
      ctx.drawImage(logoImgRef.current, logoX, logoY, logoW, logoH);
      ctx.restore();
    } else {
      ctx.fillStyle = '#1A1635';
      ctx.font = '900 44px "Be Vietnam Pro", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('VOCAB', logoX + logoW / 2, logoY + logoH / 2);
      ctx.textBaseline = 'alphabetic';
    }
    drawIconSparkle(ctx, logoX + logoW + 6, logoY - 4, 16, theme.accent2 || theme.accent, globalT * 1.2);

    // 4. Header Badge: "ĐỐ TỪ VỰNG #1 / 5 🔤"
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 8;
    const headerGrad = ctx.createLinearGradient(260, 95, 1010, 205);
    headerGrad.addColorStop(0, 'rgba(15, 12, 30, 0.62)');
    headerGrad.addColorStop(1, 'rgba(15, 12, 30, 0.42)');
    ctx.fillStyle = headerGrad;
    drawRoundRect(ctx, 260, 95, 750, 110, 40);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.stroke();
    ctx.restore();

    drawIconQuestionBubble(ctx, 320, 150, 26, theme.accent2 || theme.accent);

    ctx.fillStyle = '#FFFFFF';
    const headerTitle = `ĐỐ TỪ VỰNG #${qIdx + 1} / ${totalQ} 🔤`;
    ctx.font = getFitFont(ctx, headerTitle, '900', '"Be Vietnam Pro", sans-serif', 600, 44, 26);
    ctx.textAlign = 'center';
    ctx.fillText(headerTitle, 660, 168);

    // Progress Bar Top
    ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
    drawRoundRect(ctx, 260, 215, 750, 18, 9);
    ctx.fill();

    let currentQProgress = 0;
    if (stage === 'read') {
      currentQProgress = stageProgress * 0.35;
    } else if (stage === 'guess') {
      currentQProgress = 0.35 + stageProgress * 0.45;
    } else {
      currentQProgress = 0.80 + stageProgress * 0.20;
    }

    const progressW = 750 * Math.min(1.0, Math.max(0, (qIdx + currentQProgress) / totalQ));
    ctx.save();
    const pGrad = ctx.createLinearGradient(260, 0, 260 + progressW, 0);
    pGrad.addColorStop(0, theme.accent2 || theme.accent);
    pGrad.addColorStop(1, theme.accent);
    ctx.fillStyle = pGrad;
    drawRoundRect(ctx, 260, 215, Math.max(18, progressW), 18, 9);
    ctx.fill();
    ctx.restore();

    // 5. HERO QUESTION & IMAGE CARD (Y: 255 -> 790)
    const qCardY = 255;
    const qCardH = 535;
    const tagY = qCardY - 24;

    const qEntranceT = easeOutBack(Math.min(1, timeInQ / 0.42));
    const qScale = stage === 'guess' ? (0.92 + qEntranceT * 0.08) : 1;
    const qAlpha = stage === 'guess' ? Math.min(1, timeInQ / 0.28) : 1;

    ctx.save();
    ctx.globalAlpha = qAlpha;
    ctx.translate(540, qCardY + qCardH / 2);
    ctx.scale(qScale, qScale);
    ctx.translate(-540, -(qCardY + qCardH / 2));

    ctx.fillStyle = theme.cardBg;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 15;
    drawRoundRect(ctx, 70, qCardY, 940, qCardH, 36);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    const qBorderGrad = ctx.createLinearGradient(70, qCardY, 1010, qCardY + qCardH);
    qBorderGrad.addColorStop(0, theme.accent);
    qBorderGrad.addColorStop(1, theme.accent2 || theme.accent);
    ctx.lineWidth = 5;
    ctx.strokeStyle = qBorderGrad;
    ctx.stroke();

    // Tag: NHÌN ẢNH ĐOÁN TỪ VỰNG TIẾNG ANH 🖼️
    ctx.fillStyle = theme.accent;
    drawRoundRect(ctx, 240, tagY, 600, 46, 23);
    ctx.fill();
    drawIconQuestionBubble(ctx, 275, tagY + 23, 13, '#FFFFFF');
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold 22px ${FONT_FAMILY}`;
    ctx.textAlign = 'center';
    ctx.fillText('NHÌN ẢNH ĐOÁN TỪ VỰNG TIẾNG ANH 🖼️', 555, tagY + 31);

    // Question Prompt
    const questionText = safeQObj.question || 'What is the name of this in English?';
    ctx.fillStyle = '#FFDE59';
    drawWrappedText(ctx, questionText, 540, 320, 860, 32, '900', FONT_FAMILY, 2, {
      minY: tagY + 46,
      maxHeight: 70,
      minFontSize: 20
    });

    // Hero Image Container (760px x 380px SUPER SIZED HD SHOWCASE)
    const imgW = 760;
    const imgH = 380;
    const imgX = 540 - imgW / 2;
    const imgY = 400;
    const imgObj = safeQObj.image ? getLoadedImage(safeQObj.image) : null;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 8;
    ctx.fillStyle = '#FFFFFF';
    drawRoundRect(ctx, imgX - 6, imgY - 6, imgW + 12, imgH + 12, 24);
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = theme.accent2 || theme.accent;
    ctx.stroke();
    ctx.restore();

    if (imgObj) {
      ctx.save();
      drawRoundRect(ctx, imgX, imgY, imgW, imgH, 20);
      ctx.clip();
      drawFitImage(ctx, imgObj, imgX, imgY, imgW, imgH, { progress: stageProgress, qIdx: qIdx, kenBurns: settings?.imageMotion === true, containFit: true });
      ctx.restore();
    } else {
      ctx.save();
      drawRoundRect(ctx, imgX, imgY, imgW, imgH, 20);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold 28px ${FONT_FAMILY}`;
      ctx.textAlign = 'center';
      ctx.fillText('🖼️ Đang tải hình ảnh từ vựng...', 540, imgY + imgH / 2 + 8);
      ctx.restore();
    }
    ctx.restore();

    // 6. ANSWER SECTION - MASKED LETTER SLOTS (Y: 820 -> 1260)
    const ansCardY = 820;
    const ansCardH = stage === 'guess' ? 360 : 440;
    const ansTagY = ansCardY - 22;

    ctx.save();
    ctx.fillStyle = 'rgba(20, 18, 42, 0.95)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 25;
    ctx.shadowOffsetY = 12;
    drawRoundRect(ctx, 70, ansCardY, 940, ansCardH, 36);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    const ansBorderGrad = ctx.createLinearGradient(70, ansCardY, 1010, ansCardY + ansCardH);
    if (stage === 'reveal') {
      ansBorderGrad.addColorStop(0, '#00E676');
      ansBorderGrad.addColorStop(1, '#00C2FF');
    } else {
      ansBorderGrad.addColorStop(0, theme.accent2 || '#00F0FF');
      ansBorderGrad.addColorStop(1, theme.accent);
    }
    ctx.lineWidth = 4;
    ctx.strokeStyle = ansBorderGrad;
    ctx.stroke();

    // Answer Tag Badge
    const tagText = stage === 'guess'
      ? 'ĐÁP ÁN: (Chữ cái đầu & các ô ẩn _ _ _ _)'
      : '✨ ĐÁP ÁN CHÍNH XÁC!';
    const tagBg = stage === 'guess' ? (theme.accent2 || '#00F0FF') : '#00E676';

    ctx.fillStyle = tagBg;
    drawRoundRect(ctx, 220, ansTagY, 640, 44, 22);
    ctx.fill();
    ctx.fillStyle = '#1A1635';
    ctx.font = `bold 21px ${FONT_FAMILY}`;
    ctx.textAlign = 'center';
    ctx.fillText(tagText, 540, ansTagY + 29);

    // RENDER LETTER SLOT BOXES (DYNAMIC FIT FOR ANY WORD LENGTH)
    const letters = targetWord.split('');
    const totalChars = letters.length;
    const maxContainerW = 840;

    let slotW = Math.min(78, Math.max(30, Math.floor(maxContainerW / Math.max(1, totalChars))));
    let slotH = Math.round(slotW * 1.22);
    let slotGap = Math.min(14, Math.max(4, Math.floor((maxContainerW - totalChars * slotW) / Math.max(1, totalChars - 1))));
    if (slotGap < 4) slotGap = 4;

    const totalSlotsW = totalChars * slotW + (totalChars - 1) * slotGap;
    const startSlotX = 540 - totalSlotsW / 2;
    const slotY = ansCardY + 65;

    const revealElapsed = stage === 'reveal' ? (timeInQ - GUESS_TIME) : 0;

    letters.forEach((char, i) => {
      const sx = startSlotX + i * (slotW + slotGap);
      const isSpace = char === ' ' || char === '-';
      const isFirstLetter = i === 0 || (i > 0 && (letters[i - 1] === ' ' || letters[i - 1] === '-'));

      if (isSpace) {
        ctx.fillStyle = '#FFDE59';
        ctx.font = `bold ${Math.round(slotW * 0.6)}px ${FONT_FAMILY}`;
        ctx.textAlign = 'center';
        ctx.fillText('-', sx + slotW / 2, slotY + slotH / 2 + 6);
        return;
      }

      ctx.save();

      let boxBg = 'rgba(255, 255, 255, 0.08)';
      let boxBorder = 'rgba(255, 255, 255, 0.25)';
      let charText = '_';
      let charColor = '#FFDE59';

      if (stage === 'guess') {
        if (isFirstLetter) {
          boxBg = theme.accent;
          boxBorder = '#FFFFFF';
          charText = char;
          charColor = '#FFFFFF';
        } else {
          charText = '_';
          charColor = 'rgba(255, 255, 255, 0.7)';
        }
      } else {
        const letterDelay = i * 0.05;
        const letterPopRaw = Math.max(0, Math.min(1, (revealElapsed - letterDelay) / 0.3));
        const letterPop = easeOutBack(letterPopRaw);

        ctx.translate(sx + slotW / 2, slotY + slotH / 2);
        ctx.scale(0.85 + letterPop * 0.15, 0.85 + letterPop * 0.15);
        ctx.translate(-(sx + slotW / 2), -(slotY + slotH / 2));

        const gGrad = ctx.createLinearGradient(sx, slotY, sx + slotW, slotY + slotH);
        gGrad.addColorStop(0, '#00E676');
        gGrad.addColorStop(1, '#00C2FF');
        boxBg = gGrad;

        boxBorder = '#FFFFFF';
        charText = char;
        charColor = '#FFFFFF';
      }

      ctx.fillStyle = boxBg;
      ctx.shadowColor = (stage === 'reveal' || isFirstLetter) ? 'rgba(0, 230, 118, 0.5)' : 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 12;
      drawRoundRect(ctx, sx, slotY, slotW, slotH, 16);
      ctx.fill();

      ctx.lineWidth = (stage === 'reveal' || isFirstLetter) ? 3 : 2;
      ctx.strokeStyle = boxBorder;
      ctx.stroke();

      ctx.fillStyle = charColor;
      ctx.font = `900 ${Math.round(slotW * 0.65)}px "Be Vietnam Pro", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(charText, sx + slotW / 2, slotY + slotH / 2 + (charText === '_' ? -4 : 2));
      ctx.restore();
    });

    // IPA PRONUNCIATION & VIETNAMESE MEANING IN REVEAL STAGE
    if (stage === 'reveal') {
      const panelEntrance = easeOutCubic(Math.min(1, revealElapsed / 0.35));
      ctx.save();
      ctx.globalAlpha = panelEntrance;

      const infoY = slotY + slotH + 20;

      if (safeQObj.ipa) {
        ctx.fillStyle = 'rgba(0, 240, 255, 0.18)';
        drawRoundRect(ctx, 360, infoY, 360, 42, 21);
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#00F0FF';
        ctx.stroke();

        ctx.fillStyle = '#00F0FF';
        ctx.font = `bold 24px "Be Vietnam Pro", sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(`🔊 ${safeQObj.ipa}`, 540, infoY + 28);
      }

      const explY = safeQObj.ipa ? infoY + 56 : infoY + 12;
      const explanationText = safeQObj.explanation || `Từ vựng tiếng Anh: ${targetWord}`;
      ctx.fillStyle = '#FFDE59';
      drawWrappedText(ctx, explanationText, 540, explY + 25, 860, 32, 'bold', '"Be Vietnam Pro", sans-serif', 2);
      ctx.restore();

      drawCanvasConfettiBurst(ctx, qIdx, revealElapsed, theme);
    }

    ctx.restore();

    // 7. FOOTER COUNTDOWN TIMER & CALL TO ACTION (Y: 1320 -> 1840)
    if (stage === 'guess' || stage === 'read') {
      const timerCenterX = 540;
      const timerCenterY = 1420;
      const timerRadius = 110;
      const remainingSec = stage === 'read' ? Math.ceil(GUESS_TIME) : Math.max(0, Math.ceil(GUESS_TIME * (1 - stageProgress)));
      const urgent = stage === 'guess' && remainingSec <= 3;
      const countdownPercent = stage === 'read' ? 0 : stageProgress;

      const ringColorFrom = countdownPercent < 0.6 ? theme.accent2 || '#00F0FF' : (urgent ? '#FF3366' : '#FFC300');
      const ringColorTo = urgent ? '#FF3366' : (theme.accent || '#00F0FF');
      const pulseSpeed = urgent ? 6 : 2.5;
      const glowPulse = Math.sin(timeInQ * pulseSpeed) * 0.5 + 0.5;

      ctx.save();
      ctx.shadowColor = urgent ? 'rgba(255, 51, 102, 0.55)' : 'rgba(0, 240, 255, 0.35)';
      ctx.shadowBlur = 20 + glowPulse * 20;

      ctx.beginPath();
      ctx.arc(timerCenterX, timerCenterY, timerRadius, 0, Math.PI * 2);
      ctx.lineWidth = 20;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.stroke();

      const startAngle = -Math.PI / 2;
      const endAngle = startAngle + (Math.PI * 2 * (1 - countdownPercent));
      const ringGrad = ctx.createLinearGradient(
        timerCenterX - timerRadius, timerCenterY - timerRadius,
        timerCenterX + timerRadius, timerCenterY + timerRadius
      );
      ringGrad.addColorStop(0, ringColorFrom);
      ringGrad.addColorStop(1, ringColorTo);
      ctx.beginPath();
      ctx.arc(timerCenterX, timerCenterY, timerRadius, startAngle, endAngle);
      ctx.lineWidth = 20;
      ctx.strokeStyle = ringGrad;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.restore();

      const secFraction = stage === 'read' ? 0 : (timeInQ - Math.floor(timeInQ));
      const numberScale = 1 + (1 - easeOutCubic(secFraction)) * 0.16;
      ctx.save();
      ctx.translate(timerCenterX, timerCenterY);
      ctx.scale(numberScale, numberScale);
      ctx.fillStyle = urgent ? '#FF3366' : '#FFFFFF';
      ctx.font = '900 92px "Be Vietnam Pro", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${remainingSec}`, 0, 4);
      ctx.textBaseline = 'alphabetic';
      ctx.restore();

    } else if (stage === 'reveal') {
      const revealElapsed = stageProgress * REVEAL_TIME;
      const ctaAlpha = Math.min(1, Math.max(0, (revealElapsed - 0.3) / 0.4));
      ctx.save();
      ctx.globalAlpha = ctaAlpha;
      drawIconThumbsUp(ctx, 400, 1615, 18, '#FFFFFF');
      drawIconHeart(ctx, 680, 1615, 16, '#FF3366');
      ctx.fillStyle = '#FFFFFF';
      const ctaText = 'NHỚ LIKE & THEO DÕI ĐỂ HỌC NHIỀU TỪ MỚI!';
      ctx.font = getFitFont(ctx, ctaText, 'bold', '"Be Vietnam Pro", sans-serif', 800, 34, 20);
      ctx.textAlign = 'center';
      ctx.fillText(ctaText, 540, 1615);
      ctx.restore();
    }

    // 8. DYNAMIC FOOTER BADGE
    const pulseFactor = Math.sin(timeInQ * 4) * 0.5 + 0.5;
    ctx.save();
    ctx.shadowColor = 'rgba(0, 240, 255, ' + (0.4 + pulseFactor * 0.4) + ')';
    ctx.shadowBlur = 15 + pulseFactor * 15;
    ctx.shadowOffsetY = 6;

    const footerGrad = ctx.createLinearGradient(60, 1720, 1020, 1840);
    footerGrad.addColorStop(0, 'rgba(24, 20, 44, 0.95)');
    footerGrad.addColorStop(1, 'rgba(16, 14, 30, 0.95)');
    ctx.fillStyle = footerGrad;
    drawRoundRect(ctx, 60, 1720, 960, 120, 60);
    ctx.fill();

    ctx.lineWidth = 4 + pulseFactor * 2;
    const ringGrad = ctx.createLinearGradient(60, 1720, 1020, 1840);
    ringGrad.addColorStop(0, theme.accent2 || '#FFDE59');
    ringGrad.addColorStop(0.5, '#00F0FF');
    ringGrad.addColorStop(1, theme.accent || '#FF3366');
    ctx.strokeStyle = ringGrad;
    ctx.stroke();
    ctx.restore();

    drawIconThumbsUp(ctx, 175, 1780, 20, '#FFFFFF');
    drawIconHeart(ctx, 920, 1780, 18, '#FF3366');

    const footerText = 'Nhớ LIKE & THEO DÕI để học thêm nhiều từ vựng mới!';
    ctx.save();
    ctx.font = getFitFont(ctx, footerText, 'bold', '"Be Vietnam Pro", sans-serif', 700, 36, 22);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(footerText, 540, 1780);
    ctx.restore();

    drawVignette(ctx);
  };

  // Helper vẽ các đường gạch trang trí màu vàng / trắng (\ | /) theo phong cách TikTok/Shorts
  const drawDecorationTicks = (ctx, x, y, color = '#FFDE59', scale = 1, rotation = 0) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(scale, scale);
    ctx.strokeStyle = color;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';

    const ticks = [
      { x1: -18, y1: 8, x2: -32, y2: -14 },
      { x1: 0,   y1: 10, x2: 0,   y2: -18 },
      { x1: 18,  y1: 8, x2: 32,  y2: -14 }
    ];

    ticks.forEach(t => {
      ctx.beginPath();
      ctx.moveTo(t.x1, t.y1);
      ctx.lineTo(t.x2, t.y2);
      ctx.stroke();
    });
    ctx.restore();
  };

  // Helper vẽ Logo Mascot Sloth "BIGO TỪ VỰNG" hoặc Logo "LINGO BIBI" (sử dụng /logo_lingo_bibi.png hoặc /logo2.png)
  const drawMascotLogo = (ctx, centerX, centerY, radius, customLogo = null) => {
    const defaultLogo = getLoadedImage('/logo_lingo_bibi.png') || getLoadedImage('/logo2.png') || (logoImgRef ? logoImgRef.current : null);
    const logoImg = customLogo || defaultLogo;
    const isPinkLogo = !!(logoImg && logoImg.src && (logoImg.src.includes('logo_lingo_bibi') || logoImg.src.includes('bibi')));

    ctx.save();

    // Vòng tròn nền ngoài + Border (Hồng rực rỡ cho Lingo BiBi, Xanh dương cho BIGO)
    ctx.shadowColor = isPinkLogo ? 'rgba(255, 20, 147, 0.45)' : 'rgba(0, 50, 150, 0.35)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 6;

    const bgGrad = ctx.createLinearGradient(centerX - radius, centerY - radius, centerX + radius, centerY + radius);
    if (isPinkLogo) {
      bgGrad.addColorStop(0, '#FF3399');
      bgGrad.addColorStop(1, '#C71585');
    } else {
      bgGrad.addColorStop(0, '#00A2FF');
      bgGrad.addColorStop(1, '#005BEA');
    }
    ctx.fillStyle = bgGrad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.lineWidth = 5;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();
    ctx.shadowColor = 'transparent';

    if (logoImg && logoImg.complete && logoImg.naturalWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 3, 0, Math.PI * 2);
      ctx.clip();

      const maxW = (radius - 3) * 2;
      const maxH = (radius - 3) * 2;
      const imgAspect = logoImg.naturalWidth / logoImg.naturalHeight;
      let drawW = maxW;
      let drawH = maxH;
      let drawX = centerX - radius + 3;
      let drawY = centerY - radius + 3;

      if (imgAspect > 1) {
        drawH = maxW / imgAspect;
        drawY = centerY - drawH / 2;
      } else if (imgAspect < 1) {
        drawW = maxH * imgAspect;
        drawX = centerX - drawW / 2;
      }

      ctx.drawImage(logoImg, drawX, drawY, drawW, drawH);
      ctx.restore();
    } else {
      // Vẽ mascot học từ vựng chuẩn mẫu
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 3, 0, Math.PI * 2);
      ctx.clip();

      const innerGrad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, radius);
      if (isPinkLogo) {
        innerGrad.addColorStop(0, '#FF66B2');
        innerGrad.addColorStop(1, '#CC0066');
      } else {
        innerGrad.addColorStop(0, '#0099FF');
        innerGrad.addColorStop(1, '#0044BB');
      }
      ctx.fillStyle = innerGrad;
      ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);

      // Đầu chú lười
      ctx.fillStyle = '#C69C6D';
      ctx.beginPath();
      ctx.arc(centerX, centerY + 2, radius * 0.52, 0, Math.PI * 2);
      ctx.fill();

      // Vùng mặt sáng
      ctx.fillStyle = '#F5E6D3';
      ctx.beginPath();
      ctx.ellipse(centerX, centerY + 6, radius * 0.4, radius * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Mắt vệt nâu đậm
      ctx.fillStyle = '#7A5230';
      ctx.beginPath();
      ctx.ellipse(centerX - radius * 0.18, centerY + 2, radius * 0.12, radius * 0.08, -0.2, 0, Math.PI * 2);
      ctx.ellipse(centerX + radius * 0.18, centerY + 2, radius * 0.12, radius * 0.08, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Đốm mắt đen + mũi
      ctx.fillStyle = '#1A1A1A';
      ctx.beginPath();
      ctx.arc(centerX - radius * 0.16, centerY + 2, radius * 0.05, 0, Math.PI * 2);
      ctx.arc(centerX + radius * 0.16, centerY + 2, radius * 0.05, 0, Math.PI * 2);
      ctx.arc(centerX, centerY + 10, radius * 0.06, 0, Math.PI * 2);
      ctx.fill();

      // Má hồng
      ctx.fillStyle = 'rgba(255, 100, 130, 0.5)';
      ctx.beginPath();
      ctx.arc(centerX - radius * 0.28, centerY + 10, radius * 0.08, 0, Math.PI * 2);
      ctx.arc(centerX + radius * 0.28, centerY + 10, radius * 0.08, 0, Math.PI * 2);
      ctx.fill();

      // Bong bóng "HELLO!"
      ctx.fillStyle = '#FFFFFF';
      drawRoundRect(ctx, centerX - radius * 0.45, centerY - radius * 0.65, radius * 0.6, radius * 0.26, 8);
      ctx.fill();
      ctx.fillStyle = isPinkLogo ? '#D81B60' : '#005BEA';
      ctx.font = `bold ${Math.round(radius * 0.15)}px "Be Vietnam Pro", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('HELLO!', centerX - radius * 0.15, centerY - radius * 0.52);

      // Cuốn sách / Biển tên
      ctx.fillStyle = isPinkLogo ? '#99004C' : '#003B99';
      drawRoundRect(ctx, centerX - radius * 0.72, centerY + radius * 0.25, radius * 1.44, radius * 0.52, 10);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = isPinkLogo ? '#FF80BF' : '#00D2FF';
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = `900 ${Math.round(radius * 0.19)}px "Be Vietnam Pro", sans-serif`;
      ctx.fillText(isPinkLogo ? 'LINGO' : 'BIGO', centerX, centerY + radius * 0.40);
      ctx.font = `700 ${Math.round(radius * 0.13)}px "Be Vietnam Pro", sans-serif`;
      ctx.fillStyle = '#FFDE59';
      ctx.fillText(isPinkLogo ? 'BIBI' : 'TỪ VỰNG', centerX, centerY + radius * 0.60);

      ctx.restore();
    }

    ctx.restore();
  };

  // Dedicated Canvas Renderer for "Nhìn Cờ Đoán Quốc Gia" (Flags B1 Style)
  const drawFlagsB1CanvasFrame = (ctx, qObj, qIdx, totalQ, stage, timeInQ, stageProgress, theme, currentSet = null) => {
    const safeQObj = qObj || {};
    const targetSet = currentSet || activeSet || {};
    const globalT = performance.now() / 1000;

    // 1. BACKGROUND: Landmarks / City Skyline or Sky background
    const defaultBg = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1080';
    const bgUrl = safeQObj.bg || safeQObj.background || targetSet.bg || defaultBg;
    const bgImg = getLoadedImage(bgUrl) || getLoadedImage(defaultBg);

    if (bgImg) {
      drawFitImage(ctx, bgImg, 0, 0, 1080, 1920, { progress: stageProgress, qIdx: qIdx, kenBurns: settings?.imageMotion === true });
    } else {
      const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1920);
      bgGrad.addColorStop(0, '#1E3A8A');
      bgGrad.addColorStop(0.5, '#3B82F6');
      bgGrad.addColorStop(1, '#0F172A');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1080, 1920);
    }

    // Outer screen rounded border frame overlay (B1 TikTok style)
    ctx.save();
    ctx.lineWidth = 14;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    drawRoundRect(ctx, 10, 10, 1060, 1900, 44);
    ctx.stroke();
    ctx.restore();

    // 2. TOP LEFT BADGE: "NHÌN CỜ ĐOÁN NƯỚC" (Badge đỏ / xanh rực rỡ + vạch vàng 2 bên)
    const topicText = (safeQObj.topic || targetSet.topic || 'NHÌN CỜ ĐOÁN NƯỚC').toUpperCase();
    
    // Tự động điều chỉnh font chữ & kích thước badge để không bao giờ bị tràn chữ hoặc tràn viền canvas
    let fontPx = 40;
    ctx.font = `900 ${fontPx}px "Be Vietnam Pro", sans-serif`;
    let measuredW = ctx.measureText(topicText).width;
    while (fontPx > 20 && measuredW > 460) {
      fontPx -= 2;
      ctx.font = `900 ${fontPx}px "Be Vietnam Pro", sans-serif`;
      measuredW = ctx.measureText(topicText).width;
    }

    const badgeH = 88;
    const badgePaddingX = 36;
    const badgeW = Math.max(280, Math.min(540, measuredW + badgePaddingX * 2));
    const leftMargin = 45; // Lề trái an toàn bên trong viền canvas
    const badgeX = leftMargin + badgeW / 2;
    const badgeY = 110;

    // Vạch trang trí vàng 2 bên đặt động theo độ rộng của badge
    drawDecorationTicks(ctx, badgeX - badgeW / 2 + 30, badgeY - 5, '#FFDE59', 1.2, -0.4);
    drawDecorationTicks(ctx, badgeX + badgeW / 2 - 30, badgeY - 5, '#FFDE59', 1.2, 0.4);

    ctx.save();
    ctx.translate(badgeX, badgeY);
    ctx.rotate(-0.03); // Nghiêng nhẹ phong cách B1

    ctx.shadowColor = 'rgba(220, 38, 38, 0.45)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 8;

    const badgeGrad = ctx.createLinearGradient(-badgeW / 2, 0, badgeW / 2, 0);
    badgeGrad.addColorStop(0, '#E11D48');
    badgeGrad.addColorStop(1, '#BE123C');
    ctx.fillStyle = badgeGrad;
    drawRoundRect(ctx, -badgeW / 2, -badgeH / 2, badgeW, badgeH, 44);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.fillStyle = '#FFFFFF';
    ctx.font = `900 ${fontPx}px "Be Vietnam Pro", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(topicText, 0, 2);
    ctx.restore();

    // 3. TOP RIGHT MASCOT LOGO
    drawMascotLogo(ctx, 970, 95, 65, (logoImgRef && logoImgRef.current) || getLoadedImage('/logo2.png'));

    // 4. SUB-HEADER PILL: "ĐÂY LÀ QUỐC GIA NÀO? ➔"
    const headerTitleText = (safeQObj.headerTitle || targetSet.headerTitle || 'ĐÂY LÀ QUỐC GIA NÀO?').toUpperCase();
    let subFontPx = 26;
    ctx.font = `900 ${subFontPx}px "Be Vietnam Pro", sans-serif`;
    let subMeasuredW = ctx.measureText(headerTitleText).width;
    const maxSubTextW = 460;

    while (subFontPx > 16 && subMeasuredW > maxSubTextW) {
      subFontPx -= 1;
      ctx.font = `900 ${subFontPx}px "Be Vietnam Pro", sans-serif`;
      subMeasuredW = ctx.measureText(headerTitleText).width;
    }

    const headerW = Math.max(380, Math.min(700, subMeasuredW + 110));
    const headerH = 68;
    const headerX = 540 - headerW / 2;
    const headerY = 225;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 40, 120, 0.2)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 6;
    ctx.fillStyle = '#FFFFFF';
    drawRoundRect(ctx, headerX, headerY, headerW, headerH, 34);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.fillStyle = '#0F387A';
    ctx.font = `900 ${subFontPx}px "Be Vietnam Pro", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const textCenterX = headerX + (headerW - 60) / 2;
    ctx.fillText(headerTitleText, textCenterX, headerY + headerH / 2 + 1);

    // Circle arrow button ➔ on right side of pill
    const arrowCircleX = headerX + headerW - 38;
    const arrowCircleY = headerY + headerH / 2;
    ctx.fillStyle = '#0F387A';
    ctx.beginPath();
    ctx.arc(arrowCircleX, arrowCircleY, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px "Be Vietnam Pro", sans-serif';
    ctx.fillText('➔', arrowCircleX, arrowCircleY + 1);
    ctx.restore();

    // 5. MAIN FLAG DISPLAY CARD (Lá Cờ Quốc Gia SUPER SIZED 860x480)
    const flagW = 860;
    const flagH = 480;
    const flagX = 540 - flagW / 2;
    const flagY = 305;

    // Vạch vàng nghệ thuật 2 bên lá cờ
    drawDecorationTicks(ctx, 45, flagY + flagH / 2, '#FFDE59', 1.2, -0.6);
    drawDecorationTicks(ctx, 1035, flagY + flagH / 2, '#FFDE59', 1.2, 0.6);

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 10;
    ctx.fillStyle = '#FFFFFF';
    drawRoundRect(ctx, flagX - 8, flagY - 8, flagW + 16, flagH + 16, 28);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.lineWidth = 4;
    ctx.strokeStyle = '#3B82F6';
    ctx.stroke();
    ctx.restore();

    // Render Flag Image inside container
    const flagUrl = safeQObj.image || safeQObj.flagUrl || safeQObj.flag;
    const flagImgObj = getLoadedImage(flagUrl);
    if (flagImgObj) {
      ctx.save();
      drawRoundRect(ctx, flagX, flagY, flagW, flagH, 22);
      ctx.clip();
      drawFitImage(ctx, flagImgObj, flagX, flagY, flagW, flagH, { progress: stageProgress, qIdx: qIdx, kenBurns: settings?.imageMotion === true, containFit: true });
      ctx.restore();
    } else {
      ctx.save();
      drawRoundRect(ctx, flagX, flagY, flagW, flagH, 22);
      ctx.fillStyle = '#F8FAFC';
      ctx.fill();
      ctx.fillStyle = '#334155';
      ctx.font = 'bold 36px "Be Vietnam Pro", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🚩 ' + (safeQObj.fromFlag || 'QUỐC KỲ'), 540, flagY + flagH / 2);
      ctx.restore();
    }

    // Nét quệt nghệ thuật màu vàng dưới khung lá cờ (Yellow Swoosh Underline)
    const swooshY = flagY + flagH + 20;
    ctx.save();
    ctx.fillStyle = '#FFDE59';
    ctx.shadowColor = 'rgba(255, 222, 89, 0.6)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.ellipse(540, swooshY, 260, 9, -0.02, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 6. GREEN COUNTDOWN TIMER BAR & BADGE
    const barW = 540;
    const barH = 16;
    const barX = 540 - barW / 2;
    const barY = swooshY + 22; // 662

    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    drawRoundRect(ctx, barX, barY, barW, barH, 8);
    ctx.fill();

    const fillPercent = stage === 'read' ? 1.0 : (stage === 'guess' ? Math.max(0, 1 - stageProgress) : 0);
    const currentBarW = Math.max(0, barW * fillPercent);
    if (currentBarW > 0) {
      const greenGrad = ctx.createLinearGradient(barX, 0, barX + currentBarW, 0);
      greenGrad.addColorStop(0, '#00E676');
      greenGrad.addColorStop(1, '#00C853');
      ctx.fillStyle = greenGrad;
      ctx.shadowColor = 'rgba(0, 230, 118, 0.7)';
      ctx.shadowBlur = 10;
      drawRoundRect(ctx, barX, barY, currentBarW, barH, 8);
      ctx.fill();
    }
    ctx.restore();

    // 6b. TIMER SECONDS BADGE (⏱️ 3s)
    const currentGuessDuration = settings?.guessTime || 3.0;
    const remainingSec = stage === 'read' ? Math.ceil(currentGuessDuration) : (stage === 'guess' ? Math.max(0, Math.ceil(currentGuessDuration * (1 - stageProgress))) : 0);
    if (stage === 'guess' || stage === 'read') {
      ctx.save();
      const tBadgeW = 95;
      const tBadgeH = 32;
      const tBadgeX = barX + barW - tBadgeW;
      const tBadgeY = barY - 38;
      ctx.fillStyle = '#00C853';
      ctx.shadowColor = 'rgba(0, 200, 83, 0.5)';
      ctx.shadowBlur = 8;
      drawRoundRect(ctx, tBadgeX, tBadgeY, tBadgeW, tBadgeH, 16);
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 18px "Be Vietnam Pro", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`⏱️ ${remainingSec}s`, tBadgeX + tBadgeW / 2, tBadgeY + tBadgeH / 2 + 1);
      ctx.restore();
    }

    // 7. ANSWER CARDS (4 OPTIONS OR LETTER SLOTS)
    const hasWordGuess = !!(safeQObj.word);

    if (hasWordGuess) {
      // Dạng Điền Ô Chữ Quốc Gia
      const targetWord = String(safeQObj.word || safeQObj.optionA || 'JAPAN').toUpperCase().trim();
      const ansCardY = barY + 40;
      const ansCardH = (stage === 'guess' || stage === 'read') ? 300 : 410;
      const ansCardW = 900;
      const ansCardX = 540 - ansCardW / 2;
      const ansTagY = ansCardY - 22;

      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 50, 0.95)';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 15;
      drawRoundRect(ctx, ansCardX, ansCardY, ansCardW, ansCardH, 40);
      ctx.fill();
      ctx.shadowColor = 'transparent';

      const ansBorderGrad = ctx.createLinearGradient(ansCardX, ansCardY, ansCardX + ansCardW, ansCardY + ansCardH);
      if (stage === 'reveal') {
        ansBorderGrad.addColorStop(0, '#00E676');
        ansBorderGrad.addColorStop(1, '#00C2FF');
      } else {
        ansBorderGrad.addColorStop(0, '#1D61F2');
        ansBorderGrad.addColorStop(1, '#0052E0');
      }
      ctx.lineWidth = 5;
      ctx.strokeStyle = ansBorderGrad;
      ctx.stroke();

      const tagText = (stage === 'guess' || stage === 'read') ? 'ĐÁP ÁN: (Chữ cái đầu & ô chữ ẩn _ _ _)' : '✨ ĐÁP ÁN CHÍNH XÁC!';
      const tagBg = (stage === 'guess' || stage === 'read') ? '#FFAB00' : '#00E676';
      const tagW = 680;
      ctx.fillStyle = tagBg;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 4;
      drawRoundRect(ctx, 540 - tagW / 2, ansTagY, tagW, 48, 24);
      ctx.fill();
      ctx.shadowColor = 'transparent';

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 23px "Be Vietnam Pro", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(tagText, 540, ansTagY + 25);

      // Letter Slot Boxes
      const letters = targetWord.split('');
      const totalChars = letters.length;
      const maxContainerW = 820;

      let slotW = Math.min(84, Math.max(34, Math.floor(maxContainerW / Math.max(1, totalChars))));
      let slotH = Math.round(slotW * 1.25);
      let slotGap = Math.min(16, Math.max(4, Math.floor((maxContainerW - totalChars * slotW) / Math.max(1, totalChars - 1))));
      if (slotGap < 4) slotGap = 4;

      const totalSlotsW = totalChars * slotW + (totalChars - 1) * slotGap;
      const startSlotX = 540 - totalSlotsW / 2;
      const slotY = ansCardY + 75;

      const revealElapsed = stage === 'reveal' ? stageProgress * 6.0 : 0;

      letters.forEach((char, i) => {
        const sx = startSlotX + i * (slotW + slotGap);
        const isSpace = char === ' ' || char === '-';
        const isFirstLetter = i === 0 || (i > 0 && (letters[i - 1] === ' ' || letters[i - 1] === '-'));

        if (isSpace) {
          ctx.fillStyle = '#FFDE59';
          ctx.font = `900 ${Math.round(slotW * 0.6)}px "Be Vietnam Pro", sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText('-', sx + slotW / 2, slotY + slotH / 2);
          return;
        }

        ctx.save();
        let boxBg = 'rgba(255, 255, 255, 0.08)';
        let boxBorder = 'rgba(255, 255, 255, 0.25)';
        let charText = '_';
        let charColor = '#FFDE59';

        if (stage === 'guess' || stage === 'read') {
          if (isFirstLetter) {
            boxBg = '#FF3366';
            boxBorder = '#FFFFFF';
            charText = char;
            charColor = '#FFFFFF';
          } else {
            charText = '_';
            charColor = 'rgba(255, 255, 255, 0.7)';
          }
        } else {
          const letterDelay = i * 0.05;
          const letterPopRaw = Math.max(0, Math.min(1, (revealElapsed - letterDelay) / 0.3));
          const letterPop = easeOutBack(letterPopRaw);

          ctx.translate(sx + slotW / 2, slotY + slotH / 2);
          ctx.scale(0.85 + letterPop * 0.15, 0.85 + letterPop * 0.15);
          ctx.translate(-(sx + slotW / 2), -(slotY + slotH / 2));

          const gGrad = ctx.createLinearGradient(sx, slotY, sx + slotW, slotY + slotH);
          gGrad.addColorStop(0, '#00E676');
          gGrad.addColorStop(1, '#00C2FF');
          boxBg = gGrad;
          boxBorder = '#FFFFFF';
          charText = char;
          charColor = '#FFFFFF';
        }

        ctx.fillStyle = boxBg;
        ctx.shadowColor = (stage === 'reveal' || isFirstLetter) ? 'rgba(0, 230, 118, 0.6)' : 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = (stage === 'reveal' || isFirstLetter) ? 16 : 8;
        drawRoundRect(ctx, sx, slotY, slotW, slotH, 18);
        ctx.fill();

        ctx.lineWidth = (stage === 'reveal' || isFirstLetter) ? 3.5 : 2;
        ctx.strokeStyle = boxBorder;
        ctx.stroke();

        ctx.fillStyle = charColor;
        ctx.font = `900 ${Math.round(slotW * 0.62)}px "Be Vietnam Pro", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(charText, sx + slotW / 2, slotY + slotH / 2 + (charText === '_' ? -4 : 2));
        ctx.restore();
      });

      if (stage === 'reveal') {
        const panelEntrance = easeOutCubic(Math.min(1, revealElapsed / 0.35));
        ctx.save();
        ctx.globalAlpha = panelEntrance;
        const explY = slotY + slotH + 25;
        const explanationText = safeQObj.explanation || `Quốc gia: ${targetWord}`;
        ctx.fillStyle = '#FFDE59';
        drawWrappedText(ctx, explanationText, 540, explY, 820, 26, '700', FONT_FAMILY, 3, {
          minY: explY - 10,
          maxHeight: 100,
          minFontSize: 18
        });
        ctx.restore();
      }
      ctx.restore();
    } else {
      // DẠNG TRẮC NGHIỆM 4 ĐÁP ÁN (A, B, C, D) - STYLE B1 TIKTOK
      const options = [
        { key: 'A', text: safeQObj.optionA || 'Nhật Bản' },
        { key: 'B', text: safeQObj.optionB || 'Hàn Quốc' },
        { key: 'C', text: safeQObj.optionC || 'Thái Lan' },
        { key: 'D', text: safeQObj.optionD || 'Việt Nam' }
      ];

      const cardW = 880;
      const cardH = 120;
      const cardGap = 24;
      const startY = barY + 35; // 697
      const correctKey = (safeQObj.correctOption || 'A').toUpperCase();

      const revealElapsedForCards = stage === 'reveal' ? stageProgress * 6.0 : 0;
      const correctBounce = easeOutBack(Math.min(1, revealElapsedForCards / 0.35));

      // Vạch trang trí trắng 2 bên danh sách đáp án
      drawDecorationTicks(ctx, 120, startY + cardH + 10, '#FFFFFF', 1.0, -0.4);
      drawDecorationTicks(ctx, 960, startY + cardH * 2 + 30, '#FFFFFF', 1.0, 0.4);

      options.forEach((opt, i) => {
        const posY = startY + i * (cardH + cardGap);
        const isCorrect = opt.key === correctKey;

        const cardDelay = i * 0.05;
        const cardEntranceRaw = Math.max(0, Math.min(1, (timeInQ - cardDelay) / 0.35));
        const cardEntrance = easeOutCubic(cardEntranceRaw);
        const slideOffsetY = (stage === 'guess' || stage === 'read') ? (1 - cardEntrance) * 35 : 0;

        ctx.save();
        ctx.translate(0, slideOffsetY);

        let cardBg = '#FFFFFF';
        let strokeColor = 'rgba(0, 0, 0, 0.08)';
        let keyBadgeBg = '#E2E8F0';
        let keyTextColor = '#1E293B';
        let textColor = '#0F172A';
        let scale = 1.0;
        let shadowColor = 'rgba(0, 0, 0, 0.2)';
        let shadowBlur = 12;

        if (stage === 'reveal') {
          if (isCorrect) {
            scale = 0.98 + correctBounce * 0.04;
            const greenGrad = ctx.createLinearGradient(540 - cardW / 2, posY, 540 + cardW / 2, posY + cardH);
            greenGrad.addColorStop(0, '#00E676');
            greenGrad.addColorStop(1, '#00C2FF');
            cardBg = greenGrad;
            strokeColor = '#FFFFFF';
            keyBadgeBg = '#FFFFFF';
            keyTextColor = '#00C853';
            textColor = '#FFFFFF';
            shadowColor = 'rgba(0, 230, 118, 0.6)';
            shadowBlur = 24;
          } else {
            ctx.globalAlpha = 0.45;
            cardBg = 'rgba(255, 255, 255, 0.85)';
            textColor = '#64748B';
          }
        }

        ctx.translate(540, posY + cardH / 2);
        ctx.scale(scale, scale);
        ctx.translate(-540, -(posY + cardH / 2));

        ctx.shadowColor = shadowColor;
        ctx.shadowBlur = shadowBlur;
        ctx.shadowOffsetY = 6;
        ctx.fillStyle = cardBg;
        drawRoundRect(ctx, 540 - cardW / 2, posY, cardW, cardH, 32);
        ctx.fill();
        ctx.shadowColor = 'transparent';

        ctx.lineWidth = isCorrect && stage === 'reveal' ? 4 : 2;
        ctx.strokeStyle = strokeColor;
        ctx.stroke();

        // Key Badge Pill (A, B, C, D)
        const keyW = 68;
        const keyH = 68;
        const keyX = 540 - cardW / 2 + 30;
        const keyY = posY + (cardH - keyH) / 2;

        ctx.fillStyle = keyBadgeBg;
        drawRoundRect(ctx, keyX, keyY, keyW, keyH, 22);
        ctx.fill();

        ctx.fillStyle = keyTextColor;
        ctx.font = '900 32px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(opt.key, keyX + keyW / 2, keyY + keyH / 2 + 1);

        // Option text
        const textX = keyX + keyW + 28;
        const maxTextW = cardW - (keyW + 120);
        ctx.fillStyle = textColor;
        ctx.font = getFitFont(ctx, opt.text, '900', '"Be Vietnam Pro", sans-serif', maxTextW, 36, 22);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(opt.text, textX, posY + cardH / 2);

        // Green checkmark icon for correct option on reveal
        if (stage === 'reveal' && isCorrect) {
          const checkX = 540 + cardW / 2 - 50;
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 36px "Be Vietnam Pro", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('✓', checkX, posY + cardH / 2);
        }

        ctx.restore();
      });

      // Banner giải thích chi tiết khi công bố kết quả
      if (stage === 'reveal') {
        const revealElapsed = timeInQ - GUESS_TIME;
        const panelEntrance = easeOutCubic(Math.min(1, revealElapsed / 0.35));
        const explY = startY + 4 * (cardH + cardGap) + 15; // ~1285
        const correctText = safeQObj['option' + correctKey] || 'đúng';
        const explanationText = safeQObj.explanation || `Đó chính là ${correctText}!`;

        ctx.save();
        ctx.globalAlpha = panelEntrance;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 8;
        drawRoundRect(ctx, 540 - cardW / 2, explY, cardW, 140, 28);
        ctx.fill();
        ctx.shadowColor = 'transparent';
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#00E676';
        ctx.stroke();

        ctx.fillStyle = '#FFDE59';
        drawWrappedText(ctx, `💡 GHI CHÚ: ${explanationText}`, 540, explY + 70, cardW - 40, 26, '700', FONT_FAMILY, 3, {
          minY: explY + 10,
          maxHeight: 120,
          minFontSize: 18
        });
        ctx.restore();
      }
    }
  };

  // Dedicated Canvas Renderer for TikTok Vocabulary B1 Short Format (Matching Screenshot & Lingo BiBi Pink Theme)
  const drawVocabTikTokCanvasFrame = (ctx, qObj, qIdx, totalQ, stage, timeInQ, stageProgress, theme, currentSet = null) => {
    const safeQObj = qObj || {};
    const targetSet = currentSet || activeSet || {};
    const globalT = performance.now() / 1000;

    // Kiểm tra xem có phải kênh Lingo BiBi (Gam màu hồng rực rỡ) hay không
    const isLingoBiBi = !!(
      safeQObj.channel === 'Lingo BiBi' ||
      targetSet.channel === 'Lingo BiBi' ||
      safeQObj.themeColor === 'pink' ||
      targetSet.themeColor === 'pink' ||
      safeQObj.logo === '/logo_lingo_bibi.png' ||
      targetSet.logo === '/logo_lingo_bibi.png' ||
      targetSet.id === 'vocab-b1-word-guess-lingobibi' ||
      (safeQObj.topic && safeQObj.topic.toUpperCase().includes('LINGO'))
    );

    // 1. BACKGROUND: Skyscrapers / Pink Gradient
    const defaultBg = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1080';
    const bgUrl = safeQObj.image || safeQObj.bg || safeQObj.background || defaultBg;
    const bgImg = getLoadedImage(bgUrl) || getLoadedImage(defaultBg);

    if (bgImg) {
      drawFitImage(ctx, bgImg, 0, 0, 1080, 1920, { progress: stageProgress, qIdx: qIdx, kenBurns: settings?.imageMotion === true });
    } else {
      const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1920);
      if (isLingoBiBi) {
        bgGrad.addColorStop(0, '#FF60A8');
        bgGrad.addColorStop(0.5, '#FF1493');
        bgGrad.addColorStop(1, '#800040');
      } else {
        bgGrad.addColorStop(0, '#5DA5FF');
        bgGrad.addColorStop(0.5, '#A8D4FF');
        bgGrad.addColorStop(1, '#1E50A2');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1080, 1920);
    }

    // Bo tròn khung viền toàn màn hình (hồng nhạt cho Lingo BiBi / trắng xanh cho BIGO)
    ctx.save();
    ctx.lineWidth = 14;
    ctx.strokeStyle = isLingoBiBi ? 'rgba(255, 192, 203, 0.75)' : 'rgba(255, 255, 255, 0.6)';
    drawRoundRect(ctx, 10, 10, 1060, 1900, 44);
    ctx.stroke();
    ctx.restore();

    // 2. TOP LEFT BADGE: "LINGO BIBI" / "TỪ VỰNG B1"
    const topicText = (safeQObj.topic || targetSet.topic || (isLingoBiBi ? 'LINGO BIBI' : 'TỪ VỰNG B1')).toUpperCase();
    
    // Tự động điều chỉnh font chữ & kích thước badge để không bao giờ bị tràn chữ hoặc tràn viền canvas
    let fontPx = 40;
    ctx.font = `900 ${fontPx}px "Be Vietnam Pro", sans-serif`;
    let measuredW = ctx.measureText(topicText).width;
    while (fontPx > 20 && measuredW > 460) {
      fontPx -= 2;
      ctx.font = `900 ${fontPx}px "Be Vietnam Pro", sans-serif`;
      measuredW = ctx.measureText(topicText).width;
    }

    const badgeH = 88;
    const badgePaddingX = 36;
    const badgeW = Math.max(280, Math.min(540, measuredW + badgePaddingX * 2));
    const leftMargin = 45; // Lề trái an toàn bên trong viền canvas
    const badgeX = leftMargin + badgeW / 2;
    const badgeY = 110;

    // Vạch trang trí màu vàng góc trái & phải của badge đặt động
    drawDecorationTicks(ctx, badgeX - badgeW / 2 + 30, badgeY - 5, '#FFDE59', 1.2, -0.4);
    drawDecorationTicks(ctx, badgeX + badgeW / 2 - 30, badgeY - 5, '#FFDE59', 1.2, 0.4);

    ctx.save();
    ctx.translate(badgeX, badgeY);
    ctx.rotate(-0.03); // Nghiêng nhẹ tạo điểm nhấn năng động

    ctx.shadowColor = isLingoBiBi ? 'rgba(255, 42, 133, 0.55)' : 'rgba(0, 70, 200, 0.45)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 8;

    const badgeGrad = ctx.createLinearGradient(-badgeW / 2, 0, badgeW / 2, 0);
    if (isLingoBiBi) {
      badgeGrad.addColorStop(0, '#FF2A85');
      badgeGrad.addColorStop(1, '#C71585');
    } else {
      badgeGrad.addColorStop(0, '#1D61F2');
      badgeGrad.addColorStop(1, '#0052E0');
    }
    ctx.fillStyle = badgeGrad;
    drawRoundRect(ctx, -badgeW / 2, -badgeH / 2, badgeW, badgeH, 44);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.fillStyle = '#FFFFFF';
    ctx.font = `900 ${fontPx}px "Be Vietnam Pro", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(topicText, 0, 2);
    ctx.restore();

    // 3. TOP RIGHT MASCOT LOGO: Logo Lingo BiBi (/logo_lingo_bibi.png) hoặc BIGO (/logo2.png)
    const logoImgToDraw = isLingoBiBi 
      ? (getLoadedImage('/logo_lingo_bibi.png') || (logoImgRef && logoImgRef.current) || getLoadedImage('/logo2.png'))
      : ((logoImgRef && logoImgRef.current) || getLoadedImage('/logo2.png'));
    drawMascotLogo(ctx, 970, 95, 65, logoImgToDraw);

    // 4. SUB-HEADER PILL: "ĐIỀN CHỮ CÁI CÒN THIẾU ➔"
    const headerTitleText = (safeQObj.headerTitle || targetSet.headerTitle || 'TỪ NÀO CÓ NGHĨA LÀ').toUpperCase();
    let subFontPx = 26;
    ctx.font = `900 ${subFontPx}px "Be Vietnam Pro", sans-serif`;
    let subMeasuredW = ctx.measureText(headerTitleText).width;
    const maxSubTextW = 420;

    while (subFontPx > 16 && subMeasuredW > maxSubTextW) {
      subFontPx -= 1;
      ctx.font = `900 ${subFontPx}px "Be Vietnam Pro", sans-serif`;
      subMeasuredW = ctx.measureText(headerTitleText).width;
    }

    const headerW = Math.max(380, Math.min(680, subMeasuredW + 110));
    const headerH = 68;
    const headerX = 540 - headerW / 2;
    const headerY = 225;

    ctx.save();
    ctx.shadowColor = isLingoBiBi ? 'rgba(255, 20, 147, 0.25)' : 'rgba(0, 40, 120, 0.2)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 6;
    ctx.fillStyle = '#FFFFFF'; // White Pill Card
    drawRoundRect(ctx, headerX, headerY, headerW, headerH, 34);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.fillStyle = isLingoBiBi ? '#800040' : '#0F387A';
    ctx.font = `900 ${subFontPx}px "Be Vietnam Pro", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const textCenterX = headerX + (headerW - 60) / 2;
    ctx.fillText(headerTitleText, textCenterX, headerY + headerH / 2 + 1);

    // Circle với mũi tên trắng -> bên phải pill
    const arrowCircleX = headerX + headerW - 38;
    const arrowCircleY = headerY + headerH / 2;
    ctx.fillStyle = isLingoBiBi ? '#C71585' : '#0F387A';
    ctx.beginPath();
    ctx.arc(arrowCircleX, arrowCircleY, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px "Be Vietnam Pro", sans-serif';
    ctx.fillText('➔', arrowCircleX, arrowCircleY + 1);
    ctx.restore();

    // 5. MAIN QUESTION WORD / SENTENCE IN QUOTES OR BLANK
    let rawQuestion = safeQObj.question || 'Thành công';
    let displayQuestion = rawQuestion.trim().replace(/\?+\s*$/g, '');
    const isFillInBlank = /_{2,}|\[\.\.\.\]/.test(displayQuestion);
    const isShortTerm = !isFillInBlank && !displayQuestion.includes(' ') && displayQuestion.length <= 15;

    if (isShortTerm) {
      if (!displayQuestion.startsWith('"') && !displayQuestion.startsWith('“')) {
        displayQuestion = `“${displayQuestion}”?`;
      } else {
        displayQuestion = `${displayQuestion}?`;
      }
    } else if (!isFillInBlank) {
      displayQuestion = `${displayQuestion}?`;
    }

    const qY = 325;
    const tagBottomY = headerY + headerH; // 225 + 68 = 293

    // Vạch vàng trang trí 2 bên từ/câu hỏi
    drawDecorationTicks(ctx, 140, qY, '#FFDE59', 1.1, -0.6);
    drawDecorationTicks(ctx, 940, qY, '#FFDE59', 1.1, 0.6);

    const qMetrics = drawWrappedQuestion3D(ctx, displayQuestion, 540, qY, 880, 48, {
      minY: tagBottomY + 6,
      maxHeight: 230,
      maxLines: 4,
      minFontSize: 32,
      strokeColor: isLingoBiBi ? '#800040' : '#003E99',
      textColor: '#FFFFFF'
    });

    // Nét cọ quệt màu vàng nghệ nghệ thuật dưới từ câu hỏi (Yellow Swoosh Underline)
    const swooshY = Math.max(400, qMetrics.bottomY + 14);
    ctx.save();
    ctx.fillStyle = '#FFDE59';
    ctx.shadowColor = 'rgba(255, 222, 89, 0.6)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.ellipse(540, swooshY, 260, 9, -0.02, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 6. COUNTDOWN TIMER BAR (Thanh thời gian đếm ngược màu hồng/xanh)
    const barW = 540;
    const barH = 14;
    const barX = 540 - barW / 2;
    const barY = Math.max(430, swooshY + 22);

    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    drawRoundRect(ctx, barX, barY, barW, barH, 7);
    ctx.fill();

    const fillPercent = stage === 'read' ? 1.0 : (stage === 'guess' ? Math.max(0, 1 - stageProgress) : 0);
    const currentBarW = Math.max(0, barW * fillPercent);
    if (currentBarW > 0) {
      const greenGrad = ctx.createLinearGradient(barX, 0, barX + currentBarW, 0);
      if (isLingoBiBi) {
        greenGrad.addColorStop(0, '#FF1493');
        greenGrad.addColorStop(1, '#FF69B4');
      } else {
        greenGrad.addColorStop(0, '#00E676');
        greenGrad.addColorStop(1, '#00C853');
      }
      ctx.fillStyle = greenGrad;
      ctx.shadowColor = isLingoBiBi ? 'rgba(255, 20, 147, 0.7)' : 'rgba(0, 230, 118, 0.7)';
      ctx.shadowBlur = 10;
      drawRoundRect(ctx, barX, barY, currentBarW, barH, 7);
      ctx.fill();
    }
    ctx.restore();

    // 7. ANSWER CARDS (3 HOẶC 4 THẺ ĐÁP ÁN A, B, C HOẶC Ô CHỮ)
    const hasWordGuess = !!(safeQObj.word && !safeQObj.optionA);

    if (hasWordGuess) {
      // DẠNG ĐIỀN CHỮ CÁI VÀO Ô
      const targetWord = String(safeQObj.word || safeQObj.optionA || 'BALANCE').toUpperCase().trim();
      const ansCardY = 580;
      const ansCardH = (stage === 'guess' || stage === 'read') ? 300 : 410;
      const ansCardW = 900;
      const ansCardX = 540 - ansCardW / 2;
      const ansTagY = ansCardY - 22;

      ctx.save();
      ctx.fillStyle = isLingoBiBi ? 'rgba(40, 10, 30, 0.95)' : 'rgba(15, 23, 50, 0.95)';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 15;
      drawRoundRect(ctx, ansCardX, ansCardY, ansCardW, ansCardH, 40);
      ctx.fill();
      ctx.shadowColor = 'transparent';

      const ansBorderGrad = ctx.createLinearGradient(ansCardX, ansCardY, ansCardX + ansCardW, ansCardY + ansCardH);
      if (stage === 'reveal') {
        ansBorderGrad.addColorStop(0, '#00E676');
        ansBorderGrad.addColorStop(1, isLingoBiBi ? '#FF65A3' : '#00C2FF');
      } else {
        ansBorderGrad.addColorStop(0, isLingoBiBi ? '#FF2A85' : '#1D61F2');
        ansBorderGrad.addColorStop(1, isLingoBiBi ? '#D81B60' : '#0052E0');
      }
      ctx.lineWidth = 5;
      ctx.strokeStyle = ansBorderGrad;
      ctx.stroke();

      // Tag Badge trên đỉnh Card
      const tagText = (stage === 'guess' || stage === 'read')
        ? (isLingoBiBi ? '🎀 LINGO BIBI: (Điền các chữ cái còn thiếu)' : 'ĐÁP ÁN: (Chữ cái đầu & các ô ẩn _ _ _ _)')
        : '✨ ĐÁP ÁN CHÍNH XÁC!';
      const tagBg = (stage === 'guess' || stage === 'read')
        ? (isLingoBiBi ? '#FF1493' : '#FFAB00')
        : '#00E676';

      const tagW = 680;
      ctx.fillStyle = tagBg;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 4;
      drawRoundRect(ctx, 540 - tagW / 2, ansTagY, tagW, 48, 24);
      ctx.fill();
      ctx.shadowColor = 'transparent';

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 23px "Be Vietnam Pro", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(tagText, 540, ansTagY + 25);

      // Letter Slot Boxes
      const letters = targetWord.split('');
      const totalChars = letters.length;
      const maxContainerW = 820;

      let slotW = Math.min(84, Math.max(34, Math.floor(maxContainerW / Math.max(1, totalChars))));
      let slotH = Math.round(slotW * 1.25);
      let slotGap = Math.min(16, Math.max(4, Math.floor((maxContainerW - totalChars * slotW) / Math.max(1, totalChars - 1))));
      if (slotGap < 4) slotGap = 4;

      const totalSlotsW = totalChars * slotW + (totalChars - 1) * slotGap;
      const startSlotX = 540 - totalSlotsW / 2;
      const slotY = ansCardY + 75;

      const revealElapsed = stage === 'reveal' ? stageProgress * 2.0 : 0;

      letters.forEach((char, i) => {
        const sx = startSlotX + i * (slotW + slotGap);
        const isSpace = char === ' ' || char === '-';
        const isFirstLetter = i === 0 || (i > 0 && (letters[i - 1] === ' ' || letters[i - 1] === '-'));

        if (isSpace) {
          ctx.fillStyle = '#FFDE59';
          ctx.font = `900 ${Math.round(slotW * 0.6)}px "Be Vietnam Pro", sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText('-', sx + slotW / 2, slotY + slotH / 2);
          return;
        }

        ctx.save();
        let boxBg = 'rgba(255, 255, 255, 0.08)';
        let boxBorder = 'rgba(255, 255, 255, 0.25)';
        let charText = '_';
        let charColor = '#FFDE59';

        if (stage === 'guess' || stage === 'read') {
          if (isFirstLetter) {
            boxBg = isLingoBiBi ? '#FF1493' : '#FF3366'; // Ô chữ đầu màu hồng rực rỡ
            boxBorder = '#FFFFFF';
            charText = char;
            charColor = '#FFFFFF';
          } else {
            charText = '_';
            charColor = 'rgba(255, 255, 255, 0.7)';
          }
        } else {
          const letterDelay = i * 0.05;
          const letterPopRaw = Math.max(0, Math.min(1, (revealElapsed - letterDelay) / 0.3));
          const letterPop = easeOutBack(letterPopRaw);

          ctx.translate(sx + slotW / 2, slotY + slotH / 2);
          ctx.scale(0.85 + letterPop * 0.15, 0.85 + letterPop * 0.15);
          ctx.translate(-(sx + slotW / 2), -(slotY + slotH / 2));

          const gGrad = ctx.createLinearGradient(sx, slotY, sx + slotW, slotY + slotH);
          if (isLingoBiBi) {
            gGrad.addColorStop(0, '#FF2A85');
            gGrad.addColorStop(1, '#FF75A0');
          } else {
            gGrad.addColorStop(0, '#00E676');
            gGrad.addColorStop(1, '#00C2FF');
          }
          boxBg = gGrad;
          boxBorder = '#FFFFFF';
          charText = char;
          charColor = '#FFFFFF';
        }

        ctx.fillStyle = boxBg;
        ctx.shadowColor = (stage === 'reveal' || isFirstLetter) 
          ? (isLingoBiBi ? 'rgba(255, 42, 133, 0.7)' : 'rgba(0, 230, 118, 0.6)') 
          : 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = (stage === 'reveal' || isFirstLetter) ? 16 : 8;
        drawRoundRect(ctx, sx, slotY, slotW, slotH, 18);
        ctx.fill();

        ctx.lineWidth = (stage === 'reveal' || isFirstLetter) ? 3.5 : 2;
        ctx.strokeStyle = boxBorder;
        ctx.stroke();

        ctx.fillStyle = charColor;
        ctx.font = `900 ${Math.round(slotW * 0.62)}px "Be Vietnam Pro", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(charText, sx + slotW / 2, slotY + slotH / 2 + (charText === '_' ? -4 : 2));
        ctx.restore();
      });

      // Hiện IPA & Giải thích bên trong Card khi hiện kết quả
      if (stage === 'reveal') {
        const panelEntrance = easeOutCubic(Math.min(1, revealElapsed / 0.35));
        ctx.save();
        ctx.globalAlpha = panelEntrance;

        const infoY = slotY + slotH + 30;

        if (safeQObj.ipa) {
          ctx.fillStyle = isLingoBiBi ? 'rgba(255, 42, 133, 0.22)' : 'rgba(0, 230, 118, 0.18)';
          drawRoundRect(ctx, 540 - 200, infoY, 400, 48, 24);
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = isLingoBiBi ? '#FF69B4' : '#00E676';
          ctx.stroke();

          ctx.fillStyle = isLingoBiBi ? '#FFB6C1' : '#00E676';
          ctx.font = `bold 26px "Be Vietnam Pro", sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`🔊 ${safeQObj.ipa}`, 540, infoY + 25);
        }

        const explY = safeQObj.ipa ? infoY + 65 : infoY + 15;
        const explanationText = safeQObj.explanation || `Từ vựng tiếng Anh: ${targetWord}`;
        ctx.fillStyle = '#FFDE59';
        drawWrappedText(ctx, explanationText, 540, explY, 820, 26, '700', FONT_FAMILY, 2, {
          minY: explY - 10,
          maxHeight: 70,
          minFontSize: 18
        });
        ctx.restore();
      }

      ctx.restore();
    } else {
      // DẠNG CHỌN 3 HOẶC 4 ĐÁP ÁN (A, B, C, D)
      const rawOptions = [];
      if (safeQObj.optionA) rawOptions.push({ key: 'A', text: safeQObj.optionA });
      if (safeQObj.optionB) rawOptions.push({ key: 'B', text: safeQObj.optionB });
      if (safeQObj.optionC) rawOptions.push({ key: 'C', text: safeQObj.optionC });
      if (safeQObj.optionD) rawOptions.push({ key: 'D', text: safeQObj.optionD });

      const options = rawOptions.length > 0 ? rawOptions : [
        { key: 'A', text: safeQObj.optionA || 'Kitten' },
        { key: 'B', text: safeQObj.optionB || 'Puppy' },
        { key: 'C', text: safeQObj.optionC || 'Bunny' }
      ];

      const optionCount = options.length;
      const cardW = 880;
      const cardH = optionCount <= 3 ? 134 : 122;
      const cardGap = optionCount <= 3 ? 28 : 24;
      const startY = Math.max(510, barY + 32);
      const correctKey = (safeQObj.correctOption || 'A').toUpperCase();

      const revealElapsedForCards = stage === 'reveal' ? stageProgress * 2.0 : 0;
      const correctBounce = easeOutBack(Math.min(1, revealElapsedForCards / 0.35));

      // Vạch trang trí trắng 2 bên danh sách đáp án
      drawDecorationTicks(ctx, 120, startY + cardH + 10, '#FFFFFF', 1.0, -0.4);
      drawDecorationTicks(ctx, 960, startY + cardH * 2 + 30, '#FFFFFF', 1.0, 0.4);

      options.forEach((opt, i) => {
        const posY = startY + i * (cardH + cardGap);
        const isCorrect = opt.key === correctKey;

        const cardDelay = i * 0.05;
        const cardEntranceRaw = Math.max(0, Math.min(1, (timeInQ - cardDelay) / 0.35));
        const cardEntrance = easeOutCubic(cardEntranceRaw);
        const slideOffsetY = (stage === 'guess' || stage === 'read') ? (1 - cardEntrance) * 35 : 0;

        ctx.save();
        ctx.translate(0, slideOffsetY);

        let isHighlighted = false;
        let isDimmed = false;

        if (stage === 'reveal') {
          if (isCorrect) {
            isHighlighted = true;
          } else {
            isDimmed = true;
          }
        }

        const cardX = 540 - cardW / 2;

        // Nổi bật đáp án đúng khi hiện kết quả
        if (isHighlighted) {
          const bounceScale = 0.96 + correctBounce * 0.04;
          ctx.translate(540, posY + cardH / 2);
          ctx.scale(bounceScale, bounceScale);
          ctx.translate(-540, -(posY + cardH / 2));

          // Vòng phát sáng
          const pulseT = (revealElapsedForCards * 1.2) % 1;
          ctx.save();
          ctx.globalAlpha = (1 - pulseT) * 0.5;
          ctx.strokeStyle = isLingoBiBi ? '#FF1493' : '#00E676';
          ctx.lineWidth = 8;
          drawRoundRect(ctx, cardX - pulseT * 14, posY - pulseT * 10, cardW + pulseT * 28, cardH + pulseT * 20, 50);
          ctx.stroke();
          ctx.restore();
        }

        if (isHighlighted) {
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = isLingoBiBi ? 'rgba(255, 20, 147, 0.8)' : 'rgba(0, 230, 118, 0.8)';
          ctx.shadowBlur = 30;
          ctx.shadowOffsetY = 8;
        } else if (isDimmed) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
          ctx.globalAlpha = 0.55;
        } else {
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = isLingoBiBi ? 'rgba(180, 0, 90, 0.16)' : 'rgba(0, 50, 140, 0.16)';
          ctx.shadowBlur = 18;
          ctx.shadowOffsetY = 6;
        }

        // Thẻ trắng bo cong hạt đậu (Pill card)
        drawRoundRect(ctx, cardX, posY, cardW, cardH, 56);
        ctx.fill();

        if (isHighlighted) {
          ctx.lineWidth = 6;
          ctx.strokeStyle = isLingoBiBi ? '#FF1493' : '#00E676';
          ctx.stroke();
        } else {
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = isLingoBiBi ? 'rgba(200, 0, 100, 0.12)' : 'rgba(0, 50, 150, 0.08)';
          ctx.stroke();
        }
        ctx.shadowColor = 'transparent';

        // Hình tròn chứa chữ cái (A., B., C.) bên trái
        const circleRadius = optionCount <= 3 ? 44 : 40;
        const circleX = cardX + 68;
        const circleY = posY + cardH / 2;

        ctx.save();
        const circleGrad = ctx.createLinearGradient(circleX - circleRadius, circleY - circleRadius, circleX + circleRadius, circleY + circleRadius);
        if (isHighlighted) {
          circleGrad.addColorStop(0, isLingoBiBi ? '#FF2A85' : '#00E676');
          circleGrad.addColorStop(1, isLingoBiBi ? '#D81B60' : '#00C853');
        } else {
          circleGrad.addColorStop(0, isLingoBiBi ? '#FF1493' : '#1D61F2');
          circleGrad.addColorStop(1, isLingoBiBi ? '#C71585' : '#0052E0');
        }
        ctx.fillStyle = circleGrad;
        ctx.beginPath();
        ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
        ctx.fill();

        // Text chữ cái A. B. C.
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `900 ${optionCount <= 3 ? '38px' : '36px'} "Be Vietnam Pro", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${opt.key}.`, circleX, circleY + 2);
        ctx.restore();

        // Text từ vựng tiếng Anh bên phải
        const textStartX = circleX + circleRadius + 35;
        const textY = posY + cardH / 2 + 2;

        ctx.save();
        ctx.font = getFitFont(ctx, opt.text, '900', '"Be Vietnam Pro", sans-serif', cardW - 200, optionCount <= 3 ? 46 : 42, 24);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';

        ctx.fillStyle = isHighlighted ? (isLingoBiBi ? '#C71585' : '#00A843') : (isLingoBiBi ? '#800040' : '#0E2C6C');
        ctx.fillText(opt.text, textStartX, textY);

        // Icon Dấu tích khi hiện kết quả đúng
        if (stage === 'reveal' && isCorrect) {
          ctx.save();
          ctx.translate(cardX + cardW - 65, textY);
          ctx.scale(0.85 + correctBounce * 0.15, 0.85 + correctBounce * 0.15);
          ctx.fillStyle = isLingoBiBi ? '#FF1493' : '#00E676';
          ctx.beginPath();
          ctx.arc(0, 0, 30, 0, Math.PI * 2);
          ctx.fill();
          drawIconCheck(ctx, 0, 0, 32, '#FFFFFF');
          ctx.restore();
        }

        ctx.restore();
        ctx.restore();
      });

      // 8. EXPLANATION CARD & IPA PRONUNCIATION (Giải thích khi hiện kết quả cho 3/4 đáp án)
      if (stage === 'reveal' && (safeQObj.explanation || safeQObj.ipa)) {
        const revealElapsed = timeInQ - (settings?.guessTime || 5);
        const panelAlpha = Math.min(1, Math.max(0, revealElapsed / 0.35));
        const explY = Math.min(1530, startY + optionCount * (cardH + cardGap) + 15);

        ctx.save();
        ctx.globalAlpha = panelAlpha;
        ctx.fillStyle = isLingoBiBi ? 'rgba(50, 10, 35, 0.95)' : 'rgba(10, 30, 70, 0.92)';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 24;
        drawRoundRect(ctx, 90, explY, 900, 150, 30);
        ctx.fill();

        ctx.lineWidth = 3;
        ctx.strokeStyle = isLingoBiBi ? '#FF65A3' : '#00E676';
        ctx.stroke();

        const correctWord = safeQObj['option' + correctKey] || safeQObj.word || safeQObj.optionA || '';
        const ipaStr = safeQObj.ipa ? `🔊 IPA: ${safeQObj.ipa}` : '';
        const explStr = safeQObj.explanation || `Từ vựng: ${correctWord}`;
        const fullExpl = ipaStr ? `${ipaStr} • ${explStr}` : explStr;

        drawIconBulb(ctx, 140, explY + 75, 24, isLingoBiBi ? '#FF65A3' : '#00E676');

        ctx.fillStyle = '#FFFFFF';
        drawWrappedText(ctx, fullExpl, 550, explY + 75, 730, 28, '700', FONT_FAMILY, 3, {
          minY: explY + 18,
          maxHeight: 114,
          minFontSize: 18
        });
        ctx.restore();
      }
    }

    // 9. BOTTOM CTA FOOTER BANNER: "NHỚ LIKE & SUBSCRIBE kênh Lingo BiBi để học bài mới!"
    const footerW = 920;
    const footerH = 110;
    const footerX = 540 - footerW / 2;
    const footerY = 1720;

    // Vạch vàng trang trí 2 bên footer
    drawDecorationTicks(ctx, footerX - 25, footerY + footerH / 2, '#FFDE59', 1.2, -0.3);
    drawDecorationTicks(ctx, footerX + footerW + 25, footerY + footerH / 2, '#FFDE59', 1.2, 0.3);

    const pulseFactor = Math.sin(globalT * 3.5) * 0.5 + 0.5;

    ctx.save();
    ctx.shadowColor = isLingoBiBi 
      ? 'rgba(255, 42, 133, ' + (0.35 + pulseFactor * 0.35) + ')'
      : 'rgba(0, 80, 220, ' + (0.35 + pulseFactor * 0.35) + ')';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 6;

    // Nền pill hồng / xanh rực rỡ
    const footerGrad = ctx.createLinearGradient(footerX, footerY, footerX + footerW, footerY + footerH);
    if (isLingoBiBi) {
      footerGrad.addColorStop(0, '#FF2A85');
      footerGrad.addColorStop(1, '#D81B60');
    } else {
      footerGrad.addColorStop(0, '#005BEA');
      footerGrad.addColorStop(1, '#0043C6');
    }
    ctx.fillStyle = footerGrad;
    drawRoundRect(ctx, footerX, footerY, footerW, footerH, 55);
    ctx.fill();

    // Viền ngọc / hồng sáng
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = isLingoBiBi ? '#FF80BF' : '#00C0FF';
    ctx.stroke();
    ctx.restore();

    // Icon Like bên trái trong nút tròn trắng
    ctx.save();
    const iconCircleX = footerX + 65;
    const iconCircleY = footerY + footerH / 2;

    drawIconThumbsUp(ctx, iconCircleX, iconCircleY, 24, '#FFFFFF');

    // Dấu gạch đứng phân cách |
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fillRect(footerX + 130, footerY + 25, 3, footerH - 50);

    // Text thông điệp: Line 1: NHỚ LIKE & SUBSCRIBE | Line 2: kênh để học bài mới!
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    ctx.font = '900 28px "Be Vietnam Pro", sans-serif';
    ctx.fillText('NHỚ LIKE & SUBSCRIBE', footerX + 160, footerY + footerH / 2 - 14);

    ctx.font = '700 23px "Be Vietnam Pro", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText(isLingoBiBi ? 'kênh Lingo BiBi để học bài mới!' : 'kênh để học bài mới!', footerX + 160, footerY + footerH / 2 + 18);

    // Icon Heart trái tim màu trắng bên phía phải
    drawIconHeart(ctx, footerX + footerW - 65, footerY + footerH / 2, 22, '#FFFFFF');
    ctx.restore();
  };

  // Dedicated Canvas Renderer for Lingo BiBi 2-Sided Image Flashcard Format (Việt -> Anh)
  const drawLingoBiBiFlashcardCanvasFrame = (ctx, qObj, qIdx, totalQ, stage, timeInQ, stageProgress, theme, currentSet = null) => {
    const safeQObj = qObj || {};
    const targetSet = currentSet || activeSet || {};
    const globalT = performance.now() / 1000;

    const viText = String(safeQObj.question || safeQObj.vi || 'Con mèo con').trim();
    const enText = String(safeQObj.word || safeQObj.en || safeQObj.optionA || 'Kitten').toUpperCase().trim();
    const ipaText = String(safeQObj.ipa || '').trim();
    const explanationText = String(safeQObj.explanation || `${enText}: ${viText}`).trim();

    // Determine Stage: Stage 'reveal' = Card 2 (English). Stage 'read' / 'guess' = Card 1 (Vietnamese)
    const isRevealStage = stage === 'reveal';
    const GUESS_TIME = settings?.guessTime || 5.0;
    const revealElapsed = isRevealStage ? (timeInQ - GUESS_TIME) : 0;

    // 3D Flip Card Transition Angle (0 -> 180 degrees)
    const FLIP_DURATION = 0.50;
    let flipProgress = 0;
    if (isRevealStage) {
      flipProgress = Math.min(1, Math.max(0, revealElapsed / FLIP_DURATION));
    }

    const isCard2 = isRevealStage && flipProgress >= 0.5;
    const flipScaleX = isRevealStage 
      ? Math.abs(Math.cos(flipProgress * Math.PI))
      : 1;
    const flipScaleY = isRevealStage
      ? 1 + Math.sin(flipProgress * Math.PI) * 0.08
      : 1;
    const flipRotationTilt = isRevealStage
      ? Math.sin(flipProgress * Math.PI) * -0.04
      : 0;

    // 1. BACKGROUND: Dreamy Lingo BiBi Pink & Rose Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1920);
    bgGrad.addColorStop(0, '#FF75B5');
    bgGrad.addColorStop(0.45, '#FF1493');
    bgGrad.addColorStop(1, '#660033');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1920);

    // Light Sunburst Rays
    ctx.save();
    ctx.translate(540, 300);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, 1400, (i * Math.PI) / 6, ((i + 0.5) * Math.PI) / 6);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // Soft Ambient Glow Orbs
    drawAmbientGlowOrbs(ctx, globalT, { accent: '#FF69B4', accent2: '#FF1493' });

    // Floating Background Particles (Hearts & Sparkles)
    particlesRef.current.forEach((p, pi) => {
      p.x += p.vx * 0.8;
      p.y += p.vy * 0.8;
      if (p.x < 0 || p.x > 1080) p.vx *= -1;
      if (p.y < 0 || p.y > 1920) p.vy *= -1;

      const twinkle = 0.25 + (Math.sin(globalT * 2.0 + pi) * 0.5 + 0.5) * 0.35;
      ctx.save();
      ctx.globalAlpha = twinkle;
      if (pi % 2 === 0) {
        drawIconHeart(ctx, p.x, p.y, p.radius * 1.5, '#FFFFFF');
      } else {
        drawIconSparkle(ctx, p.x, p.y, p.radius * 1.4, '#FFD166', globalT * 1.5 + pi);
      }
      ctx.restore();
    });

    // Rounded Screen Border
    ctx.save();
    ctx.lineWidth = 14;
    ctx.strokeStyle = 'rgba(255, 192, 203, 0.8)';
    drawRoundRect(ctx, 10, 10, 1060, 1900, 44);
    ctx.stroke();
    ctx.restore();

    // 2. TOP LEFT BADGE: "🎀 LINGO BIBI"
    const topicText = (safeQObj.topic || targetSet.topic || 'LINGO BIBI').toUpperCase();
    let fontPx = 38;
    ctx.font = `900 ${fontPx}px "Be Vietnam Pro", sans-serif`;
    let measuredW = ctx.measureText(topicText).width;
    while (fontPx > 20 && measuredW > 420) {
      fontPx -= 2;
      ctx.font = `900 ${fontPx}px "Be Vietnam Pro", sans-serif`;
      measuredW = ctx.measureText(topicText).width;
    }

    const badgeH = 80;
    const badgePaddingX = 32;
    const badgeW = Math.max(260, Math.min(500, measuredW + badgePaddingX * 2));
    const badgeX = 45 + badgeW / 2;
    const badgeY = 100;

    drawDecorationTicks(ctx, badgeX - badgeW / 2 + 25, badgeY - 5, '#FFDE59', 1.2, -0.4);
    drawDecorationTicks(ctx, badgeX + badgeW / 2 - 25, badgeY - 5, '#FFDE59', 1.2, 0.4);

    ctx.save();
    ctx.translate(badgeX, badgeY);
    ctx.rotate(-0.03);
    ctx.shadowColor = 'rgba(255, 20, 147, 0.6)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 8;

    const badgeGrad = ctx.createLinearGradient(-badgeW / 2, 0, badgeW / 2, 0);
    badgeGrad.addColorStop(0, '#FF2A85');
    badgeGrad.addColorStop(1, '#C71585');
    ctx.fillStyle = badgeGrad;
    drawRoundRect(ctx, -badgeW / 2, -badgeH / 2, badgeW, badgeH, 40);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.fillStyle = '#FFFFFF';
    ctx.font = `900 ${fontPx}px "Be Vietnam Pro", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(topicText, 0, 2);
    ctx.restore();

    // 3. TOP RIGHT MASCOT LOGO
    const logoImgToDraw = (getLoadedImage('/logo_lingo_bibi.png') || (logoImgRef && logoImgRef.current) || getLoadedImage('/logo2.png'));
    drawMascotLogo(ctx, 970, 100, 68, logoImgToDraw);

    // 4. HEADER PILL: "🎴 FLASHCARD SONG NGỮ • TỪ VỰNG #1 / 5"
    const headerPillW = 820;
    const headerPillH = 68;
    const headerPillX = 540 - headerPillW / 2;
    const headerPillY = 175;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 6;
    ctx.fillStyle = 'rgba(50, 10, 30, 0.75)';
    drawRoundRect(ctx, headerPillX, headerPillY, headerPillW, headerPillH, 34);
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#FF69B4';
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 32px "Be Vietnam Pro", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const cardProgressText = `🎴 FLASHCARD SONG NGỮ  •  TỪ VỰNG #${qIdx + 1} / ${totalQ}`;
    ctx.fillText(cardProgressText, 540, headerPillY + headerPillH / 2 + 1);
    ctx.restore();

    // 4b. THANH PROCESS ĐẾM NGƯỢC 5 GIÂY (5-SECOND COUNTDOWN PROGRESS BAR)
    const timerBarW = 760;
    const timerBarH = 26;
    const timerBarX = 540 - timerBarW / 2;
    const timerBarY = 258;

    const timeRemaining = Math.max(0, GUESS_TIME - (isRevealStage ? GUESS_TIME : timeInQ));
    const timerRatio = Math.max(0, Math.min(1, timeRemaining / GUESS_TIME));
    const remainingSecDisplay = Math.max(0, Math.ceil(timeRemaining));

    ctx.save();
    // Glassmorphic Progress Track
    ctx.fillStyle = 'rgba(25, 5, 20, 0.75)';
    drawRoundRect(ctx, timerBarX, timerBarY, timerBarW, timerBarH, 13);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255, 105, 180, 0.5)';
    ctx.stroke();

    // Fill Bar
    const currentFillW = Math.max(0, timerBarW * timerRatio);
    if (currentFillW > 0) {
      const isUrgent = remainingSecDisplay <= 2 && !isRevealStage;
      const fillGrad = ctx.createLinearGradient(timerBarX, 0, timerBarX + currentFillW, 0);
      if (isUrgent) {
        fillGrad.addColorStop(0, '#FF3366');
        fillGrad.addColorStop(1, '#FFDE59');
      } else {
        fillGrad.addColorStop(0, '#FF2A85');
        fillGrad.addColorStop(0.5, '#FF65A3');
        fillGrad.addColorStop(1, '#FFDE59');
      }

      ctx.save();
      ctx.shadowColor = isUrgent ? 'rgba(255, 51, 102, 0.85)' : 'rgba(255, 222, 89, 0.7)';
      ctx.shadowBlur = 14;
      ctx.fillStyle = fillGrad;
      drawRoundRect(ctx, timerBarX, timerBarY, currentFillW, timerBarH, 13);
      ctx.fill();
      ctx.restore();
    }

    // Timer Badge Pill ⏱️ 5s
    const timerBadgeW = 95;
    const timerBadgeH = 34;
    const timerBadgeX = timerBarX + timerBarW - timerBadgeW + 8;
    const timerBadgeY = timerBarY - 4;

    ctx.fillStyle = remainingSecDisplay <= 2 && !isRevealStage ? '#FF2A85' : '#C71585';
    drawRoundRect(ctx, timerBadgeX, timerBadgeY, timerBadgeW, timerBadgeH, 17);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 20px "Be Vietnam Pro", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`⏱️ ${remainingSecDisplay}s`, timerBadgeX + timerBadgeW / 2, timerBadgeY + timerBadgeH / 2 + 1);
    ctx.restore();

    // 5. MAIN HERO 3D FLASHCARD CONTAINER (Y: 300 -> 1670)
    const cardBoxX = 75;
    const cardBoxY = 300;
    const cardBoxW = 930;
    const cardBoxH = 1380;

    // Save context for 3D Horizontal Flip animation
    ctx.save();
    ctx.translate(540, cardBoxY + cardBoxH / 2);
    ctx.rotate(flipRotationTilt);
    ctx.scale(flipScaleX, flipScaleY);
    ctx.translate(-540, -(cardBoxY + cardBoxH / 2));

    // Card Outer Shadow & Background
    ctx.shadowColor = isCard2 ? 'rgba(255, 20, 147, 0.65)' : 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 32;
    ctx.shadowOffsetY = 14;

    const cardBgGrad = ctx.createLinearGradient(cardBoxX, cardBoxY, cardBoxX + cardBoxW, cardBoxY + cardBoxH);
    if (!isCard2) {
      // Card 1: Warm Pastel Pink & Cream
      cardBgGrad.addColorStop(0, '#FFFFFF');
      cardBgGrad.addColorStop(0.5, '#FFF0F5');
      cardBgGrad.addColorStop(1, '#FFE4E1');
    } else {
      // Card 2: Radiant Rose & Magenta Gold Glow
      cardBgGrad.addColorStop(0, '#FFFFFF');
      cardBgGrad.addColorStop(0.4, '#FFF5F8');
      cardBgGrad.addColorStop(1, '#FFEBF2');
    }
    ctx.fillStyle = cardBgGrad;
    drawRoundRect(ctx, cardBoxX, cardBoxY, cardBoxW, cardBoxH, 44);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    // Outer Stroke for Card
    ctx.lineWidth = isCard2 ? 8 : 6;
    ctx.strokeStyle = isCard2 ? '#FF1493' : '#FF69B4';
    ctx.stroke();

    // Top Card Flag & Language Tag Badge inside Card
    const flagTagW = 320;
    const flagTagH = 64;
    const flagTagX = cardBoxX + 40;
    const flagTagY = cardBoxY + 36;

    ctx.save();
    const flagTagGrad = ctx.createLinearGradient(flagTagX, flagTagY, flagTagX + flagTagW, flagTagY + flagTagH);
    if (!isCard2) {
      flagTagGrad.addColorStop(0, '#DA251D'); // Vietnam Red Accent
      flagTagGrad.addColorStop(1, '#FF4D4D');
    } else {
      flagTagGrad.addColorStop(0, '#FF1493'); // English Rose Accent
      flagTagGrad.addColorStop(1, '#C71585');
    }
    ctx.fillStyle = flagTagGrad;
    drawRoundRect(ctx, flagTagX, flagTagY, flagTagW, flagTagH, 32);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 28px "Be Vietnam Pro", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const tagText = !isCard2 ? '🇻🇳 TIẾNG VIỆT' : '🇺🇸 TIẾNG ANH';
    ctx.fillText(tagText, flagTagX + flagTagW / 2, flagTagY + flagTagH / 2 + 1);
    ctx.restore();

    // 6. HERO IMAGE SHOWCASE BOX (GIỮ HÌNH ẢNH Ở CẢ 2 THẺ - Y: 430 -> 1060)
    const imgW = 850;
    const imgH = 630;
    const imgX = 540 - imgW / 2;
    const imgY = cardBoxY + 125;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 8;
    ctx.fillStyle = '#FFFFFF';
    drawRoundRect(ctx, imgX - 6, imgY - 6, imgW + 12, imgH + 12, 32);
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = isCard2 ? '#FF1493' : '#FF69B4';
    ctx.stroke();
    ctx.shadowColor = 'transparent';

    const mainImgObj = safeQObj.image ? getLoadedImage(safeQObj.image) : null;
    if (mainImgObj && mainImgObj.complete && mainImgObj.naturalWidth > 0) {
      ctx.save();
      drawRoundRect(ctx, imgX, imgY, imgW, imgH, 26);
      ctx.clip();
      drawFitImage(ctx, mainImgObj, imgX, imgY, imgW, imgH, { progress: stageProgress, qIdx: qIdx, kenBurns: settings?.imageMotion === true });
      ctx.restore();
    } else {
      ctx.save();
      drawRoundRect(ctx, imgX, imgY, imgW, imgH, 26);
      ctx.fillStyle = 'rgba(255, 105, 180, 0.12)';
      ctx.fill();
      ctx.fillStyle = '#C71585';
      ctx.font = '900 48px "Be Vietnam Pro", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🖼️ ' + (viText || 'Hình ảnh từ vựng'), 540, imgY + imgH / 2);
      ctx.restore();
    }

    // Sparkle decoration on Image Top Right corner
    drawIconSparkle(ctx, imgX + imgW - 20, imgY + 20, 22, '#FFDE59', globalT * 2);
    ctx.restore();

    // 7. CONTENT AREA BELOW IMAGE (Y: 1090 -> 1640)
    if (!isCard2) {
      // === CARD 1 (MẶT TIẾNG VIỆT) ===
      const viBoxY = imgY + imgH + 35;

      ctx.save();
      ctx.fillStyle = '#800040';
      ctx.font = getFitFont(ctx, viText, '900', '"Be Vietnam Pro", sans-serif', 820, 72, 36);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Text 3D Stroke
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#FFFFFF';
      ctx.strokeText(viText, 540, viBoxY + 60);
      ctx.fillText(viText, 540, viBoxY + 60);

      // Icon Loa Phát Âm Tiếng Việt
      ctx.fillStyle = '#FF1493';
      ctx.font = 'bold 32px "Be Vietnam Pro", sans-serif';
      ctx.fillText('🔊 Giọng đọc Tiếng Việt chuẩn', 540, viBoxY + 130);
      ctx.restore();

      // Card 1 Footer Callout: "👉 Chuẩn bị lật sang Tiếng Anh..."
      const hintY = cardBoxY + cardBoxH - 110;
      ctx.save();
      const pulseT = Math.sin(globalT * 4) * 0.5 + 0.5;
      ctx.fillStyle = 'rgba(255, 20, 147, ' + (0.12 + pulseT * 0.1) + ')';
      drawRoundRect(ctx, 540 - 360, hintY, 720, 70, 35);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#FF69B4';
      ctx.stroke();

      ctx.fillStyle = '#C71585';
      ctx.font = '900 28px "Be Vietnam Pro", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('👉 Đang phát âm... Chuẩn bị lật sang Tiếng Anh!', 540, hintY + 36);
      ctx.restore();

    } else {
      // === CARD 2 (MẶT TIẾNG ANH - GIỮ HÌNH ẢNH) ===
      const enBoxY = imgY + imgH + 30;

      // 1. English Word Cỡ Siêu Nổi Bật với Stroke 3D Vàng & Hồng
      ctx.save();
      ctx.font = getFitFont(ctx, enText, '900', '"Be Vietnam Pro", sans-serif', 840, 84, 44);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.lineWidth = 10;
      ctx.strokeStyle = '#FFDE59';
      ctx.strokeText(enText, 540, enBoxY + 55);

      ctx.shadowColor = 'rgba(255, 20, 147, 0.7)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 6;
      ctx.fillStyle = '#C71585';
      ctx.fillText(enText, 540, enBoxY + 55);
      ctx.shadowColor = 'transparent';
      ctx.restore();

      // 2. Phiên Âm IPA Pill Container
      if (ipaText) {
        const ipaY = enBoxY + 120;
        ctx.save();
        ctx.fillStyle = '#FFE4E1';
        drawRoundRect(ctx, 540 - 240, ipaY, 480, 56, 28);
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#FF1493';
        ctx.stroke();

        ctx.fillStyle = '#C71585';
        ctx.font = '900 32px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`🔊 ${ipaText}`, 540, ipaY + 28);
        ctx.restore();
      }

      // 3. Explanation / Meaning Box
      const explY = ipaText ? enBoxY + 200 : enBoxY + 135;
      ctx.save();
      ctx.fillStyle = 'rgba(128, 0, 64, 0.92)';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 16;
      ctx.shadowOffsetY = 6;
      drawRoundRect(ctx, 540 - 390, explY, 780, 100, 30);
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#FF69B4';
      ctx.stroke();

      ctx.fillStyle = '#FFDE59';
      drawWrappedText(ctx, `💡 NGHĨA: ${explanationText}`, 540, explY + 50, 740, 28, '700', FONT_FAMILY, 2, {
        minY: explY + 10,
        maxHeight: 80,
        minFontSize: 18
      });
      ctx.restore();
    }

    ctx.restore(); // Restore 3D Flip Matrix Transformation

    // 8. BOTTOM FOOTER CTA BANNER: "🎀 BẤM THEO DÕI LINGO BIBI ĐỂ HỌC TỪ VỰNG MỖI NGÀY 💖"
    const footerW = 920;
    const footerH = 110;
    const footerX = 540 - footerW / 2;
    const footerY = 1720;

    const pulseFactor = Math.sin(globalT * 3.5) * 0.5 + 0.5;

    ctx.save();
    ctx.shadowColor = 'rgba(255, 42, 133, ' + (0.4 + pulseFactor * 0.4) + ')';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 6;

    const footerGrad = ctx.createLinearGradient(footerX, footerY, footerX + footerW, footerY + footerH);
    footerGrad.addColorStop(0, '#FF2A85');
    footerGrad.addColorStop(1, '#D81B60');
    ctx.fillStyle = footerGrad;
    drawRoundRect(ctx, footerX, footerY, footerW, footerH, 55);
    ctx.fill();

    ctx.lineWidth = 4;
    ctx.strokeStyle = '#FF80BF';
    ctx.stroke();
    ctx.restore();

    drawIconThumbsUp(ctx, footerX + 65, footerY + footerH / 2, 24, '#FFFFFF');

    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fillRect(footerX + 130, footerY + 25, 3, footerH - 50);

    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = '900 28px "Be Vietnam Pro", sans-serif';
    ctx.fillText('NHỚ LIKE & THEO DÕI', footerX + 160, footerY + footerH / 2 - 14);

    ctx.font = '700 23px "Be Vietnam Pro", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillText('kênh Lingo BiBi để học nhiều từ vựng mới! 💖', footerX + 160, footerY + footerH / 2 + 18);

    drawIconHeart(ctx, footerX + footerW - 65, footerY + footerH / 2, 22, '#FFFFFF');
    ctx.restore();

    // Vignette Finish
    drawVignette(ctx);
  };

  // Helper lấy mã quốc gia ISO 2 chữ cái từ Emoji hoặc Tên Nước (cho FlagCDN)
  const getCountryFlagCode = (flagEmoji, countryName = '') => {
    if (flagEmoji) {
      const codePoints = Array.from(flagEmoji).map(c => c.codePointAt(0));
      if (codePoints.length >= 2 && codePoints[0] >= 127462 && codePoints[0] <= 127487) {
        const char1 = String.fromCharCode(codePoints[0] - 127462 + 97);
        const char2 = String.fromCharCode(codePoints[1] - 127462 + 97);
        return (char1 + char2).toLowerCase();
      }
    }
    const nameLower = (countryName || '').toLowerCase();
    if (nameLower.includes('nhật')) return 'jp';
    if (nameLower.includes('pháp')) return 'fr';
    if (nameLower.includes('ai cập')) return 'eg';
    if (nameLower.includes('ý') || nameLower.includes('italy')) return 'it';
    if (nameLower.includes('việt')) return 'vn';
    if (nameLower.includes('mỹ') || nameLower.includes('hoa kỳ')) return 'us';
    if (nameLower.includes('anh')) return 'gb';
    if (nameLower.includes('đức')) return 'de';
    if (nameLower.includes('hàn')) return 'kr';
    if (nameLower.includes('trung')) return 'cn';
    if (nameLower.includes('tây ban nha')) return 'es';
    if (nameLower.includes('bồ đà')) return 'pt';
    if (nameLower.includes('thái')) return 'th';
    if (nameLower.includes('úc') || nameLower.includes('australia')) return 'au';
    if (nameLower.includes('brazil')) return 'br';
    if (nameLower.includes('nga')) return 'ru';
    if (nameLower.includes('ấn độ')) return 'in';
    return 'vn';
  };

  // Dedicated Canvas Renderer for "🌎 ĐOÁN QUỐC GIA QUA 5 GỢI Ý"
  const drawCountryGuessCanvasFrame = (ctx, qObj, qIdx, totalQ, stage, timeInQ, stageProgress, theme, currentSet = null) => {
    const targetSet = currentSet || activeSet;
    const safeQ = qObj || {};

    let cluesList = [];
    if (safeQ.clues && Array.isArray(safeQ.clues) && safeQ.clues.length > 0) {
      cluesList = safeQ.clues;
    } else {
      const c1 = safeQ.clue1 || safeQ.optionA || 'Quốc gia nằm ở khu vực đặc biệt';
      const c2 = safeQ.clue2 || safeQ.optionB || 'Văn hóa và ẩm thực độc đáo';
      const c3 = safeQ.clue3 || safeQ.optionC || 'Địa danh nổi tiếng thế giới';
      const c4 = safeQ.clue4 || safeQ.optionD || 'Nhiều biểu tượng văn hóa đặc trưng';
      const c5 = safeQ.clue5 || safeQ.explanation || 'Thủ đô sầm uất & hiện đại';
      cluesList = [
        { step: 1, icon: '🌏', text: c1, image: safeQ.image || '' },
        { step: 2, icon: '📍', text: c2, image: '' },
        { step: 3, icon: '🏛️', text: c3, image: '' },
        { step: 4, icon: '✨', text: c4, image: '' },
        { step: 5, icon: '🚩', text: c5, image: '' }
      ];
    }

    const countryName = safeQ.country || safeQ.word || safeQ.optionA || 'Nhật Bản';
    const countryFlag = safeQ.flag || safeQ.fromFlag || '🇯🇵';
    const topicText = (safeQ.topic || targetSet.topic || '🌎 ĐOÁN QUỐC GIA').toUpperCase();
    const headerTitleText = (safeQ.headerTitle || targetSet.headerTitle || 'ĐOÁN QUỐC GIA QUA 5 GỢI Ý').toUpperCase();

    const TIME_PER_CLUE = 3.0;
    const TOTAL_CLUE_TIME = 15.0;
    const REVEAL_START_TIME = 17.0;

    let activeClueStep = 1;
    let timeInClue = 0;
    let isRevealStage = false;
    let isIntermission = false;

    if (timeInQ < TOTAL_CLUE_TIME) {
      activeClueStep = Math.min(5, Math.floor(timeInQ / TIME_PER_CLUE) + 1);
      timeInClue = timeInQ % TIME_PER_CLUE;
    } else if (timeInQ >= TOTAL_CLUE_TIME && timeInQ < REVEAL_START_TIME) {
      activeClueStep = 5;
      isIntermission = true;
    } else {
      activeClueStep = 5;
      isRevealStage = true;
    }

    const activeClueObj = cluesList[activeClueStep - 1] || cluesList[0] || {};

    const globalT = performance.now() / 1000;
    const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1920);
    bgGrad.addColorStop(0, '#0F172A');
    bgGrad.addColorStop(0.5, '#1E293B');
    bgGrad.addColorStop(1, '#090D16');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1920);

    drawAmbientGlowOrbs(ctx, globalT, { bg: '#1D61F2', accent: '#2563EB', accent2: '#60A5FA' });

    particlesRef.current.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > 1080) p.vx *= -1;
      if (p.y < 0 || p.y > 1920) p.vy *= -1;
      ctx.save();
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = '#60A5FA';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // 2. TOP BADGE
    let fontPx = 38;
    ctx.font = `900 ${fontPx}px "Be Vietnam Pro", sans-serif`;
    let measuredW = ctx.measureText(topicText).width;
    while (fontPx > 20 && measuredW > 480) {
      fontPx -= 2;
      ctx.font = `900 ${fontPx}px "Be Vietnam Pro", sans-serif`;
      measuredW = ctx.measureText(topicText).width;
    }

    const badgeH = 74;
    const badgeX = 540;
    const badgeY = 110;

    ctx.save();
    ctx.translate(badgeX, badgeY);
    ctx.shadowColor = 'rgba(37, 99, 235, 0.45)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 6;

    const badgeGrad = ctx.createLinearGradient(-badgeW / 2, 0, badgeW / 2, 0);
    badgeGrad.addColorStop(0, '#2563EB');
    badgeGrad.addColorStop(1, '#1D4ED8');
    ctx.fillStyle = badgeGrad;
    drawRoundRect(ctx, -badgeW / 2, -badgeH / 2, badgeW, badgeH, 37);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 38px "Be Vietnam Pro", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(topicText, 0, 2);
    ctx.restore();

    drawMascotLogo(ctx, 970, 105, 65, (logoImgRef && logoImgRef.current) || getLoadedImage('/logo2.png'));

    // 3. SUB-HEADER CARD
    const subHeaderW = 640;
    const subHeaderH = 64;
    const subHeaderX = 540 - subHeaderW / 2;
    const subHeaderY = 210;

    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    drawRoundRect(ctx, subHeaderX, subHeaderY, subHeaderW, subHeaderH, 32);
    ctx.fill();

    ctx.fillStyle = '#0F172A';
    ctx.font = '900 24px "Be Vietnam Pro", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(headerTitleText, 540, subHeaderY + subHeaderH / 2 + 1);
    ctx.restore();

    // 4. MAIN IMAGE SHOWCASE BOX (Active Clue Image)
    const imgBoxX = 90;
    const imgBoxY = 300;
    const imgBoxW = 900;
    const imgBoxH = 460;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 8;
    ctx.fillStyle = '#1E293B';
    drawRoundRect(ctx, imgBoxX, imgBoxY, imgBoxW, imgBoxH, 28);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    const activeImgUrl = activeClueObj.image || safeQ.image;
    const clueImageObj = activeImgUrl ? getLoadedImage(activeImgUrl) : null;

    if (clueImageObj && clueImageObj.complete && clueImageObj.naturalWidth > 0) {
      ctx.save();
      drawRoundRect(ctx, imgBoxX, imgBoxY, imgBoxW, imgBoxH, 28);
      ctx.clip();

      const scale = 1.0 + (timeInClue / TIME_PER_CLUE) * 0.04;
      const zoomedW = imgBoxW * scale;
      const zoomedH = imgBoxH * scale;
      const offsetX = imgBoxX - (zoomedW - imgBoxW) / 2;
      const offsetY = imgBoxY - (zoomedH - imgBoxH) / 2;

      ctx.drawImage(clueImageObj, offsetX, offsetY, zoomedW, zoomedH);

      const imgGrad = ctx.createLinearGradient(0, imgBoxY + imgBoxH - 120, 0, imgBoxY + imgBoxH);
      imgGrad.addColorStop(0, 'rgba(15, 23, 42, 0)');
      imgGrad.addColorStop(1, 'rgba(15, 23, 42, 0.85)');
      ctx.fillStyle = imgGrad;
      ctx.fillRect(imgBoxX, imgBoxY + imgBoxH - 120, imgBoxW, 120);
      ctx.restore();
    } else {
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      drawRoundRect(ctx, imgBoxX, imgBoxY, imgBoxW, imgBoxH, 28);
      ctx.fill();

      ctx.font = '120px "Segoe UI Emoji", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(activeClueObj.icon || '🗺️', imgBoxX + imgBoxW / 2, imgBoxY + imgBoxH / 2);
      ctx.restore();
    }

    ctx.save();
    ctx.fillStyle = '#2563EB';
    drawRoundRect(ctx, imgBoxX + 24, imgBoxY + 24, 160, 48, 24);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 20px "Be Vietnam Pro", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`GỢI Ý #${activeClueStep}`, imgBoxX + 24 + 80, imgBoxY + 24 + 24);
    ctx.restore();

    // 5. PROGRESSIVE MYSTERY 5 CLUES CARDS (Vertical Stack: Y = 790 to 1550)
    const listStartY = 790;
    const cardW = 900;
    const cardH = 120;
    const cardGap = 16;
    const availableTextW = 550; // Guaranteed safe width before right badge!

    for (let i = 1; i <= 5; i++) {
      const clueItem = cluesList[i - 1] || { step: i, text: `Gợi ý #${i}`, icon: '💡' };
      const currentCardY = listStartY + (i - 1) * (cardH + cardGap);
      const isPast = i < activeClueStep;
      const isActive = i === activeClueStep && !isRevealStage && !isIntermission;

      ctx.save();

      if (isPast) {
        // === DA MO (Revealed Mystery Card) ===
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        drawRoundRect(ctx, 90, currentCardY, cardW, cardH, 20);
        ctx.fill();

        ctx.font = '32px "Segoe UI Emoji", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(clueItem.icon || '🔓', 135, currentCardY + cardH / 2);

        const clueFullText = `Gợi ý ${i}: ${clueItem.text}`;
        ctx.fillStyle = '#0F172A';
        ctx.font = getFitFont(ctx, clueFullText, '700', '"Be Vietnam Pro", sans-serif', availableTextW, 23, 16);
        ctx.textAlign = 'left';
        ctx.fillText(clueFullText, 180, currentCardY + cardH / 2, availableTextW);

        // Right Badge: Pill Container "✓ DA MO"
        const badgeBoxW = 125;
        const badgeBoxH = 40;
        const badgeBoxX = 90 + cardW - badgeBoxW - 20;
        const badgeBoxY = currentCardY + (cardH - badgeBoxH) / 2;

        ctx.fillStyle = '#DCFCE7';
        drawRoundRect(ctx, badgeBoxX, badgeBoxY, badgeBoxW, badgeBoxH, 20);
        ctx.fill();

        ctx.fillStyle = '#15803D';
        ctx.font = '800 16px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('✓ ĐÃ MỞ', badgeBoxX + badgeBoxW / 2, badgeBoxY + badgeBoxH / 2 + 1);

      } else if (isActive) {
        // === DANG MO (Unlocking Mystery Phase with Typewriter Reveal) ===
        ctx.shadowColor = 'rgba(37, 99, 235, 0.45)';
        ctx.shadowBlur = 24;
        ctx.shadowOffsetY = 4;

        const activeGrad = ctx.createLinearGradient(90, currentCardY, 90 + cardW, currentCardY);
        activeGrad.addColorStop(0, '#FFFFFF');
        activeGrad.addColorStop(1, '#F0F9FF');
        ctx.fillStyle = activeGrad;
        drawRoundRect(ctx, 90, currentCardY, cardW, cardH, 20);
        ctx.fill();

        ctx.lineWidth = 4;
        ctx.strokeStyle = '#2563EB';
        drawRoundRect(ctx, 90, currentCardY, cardW, cardH, 20);
        ctx.stroke();

        ctx.shadowColor = 'transparent';

        const unlockRatio = Math.min(1.0, timeInClue / 0.8);
        const iconSymbol = unlockRatio > 0.5 ? (clueItem.icon || '🔓') : '🔒';

        ctx.font = '36px "Segoe UI Emoji", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(iconSymbol, 135, currentCardY + cardH / 2);

        const fullClueText = `Gợi ý ${i}: ${clueItem.text}`;
        const charsToShow = Math.max(8, Math.floor(fullClueText.length * unlockRatio));
        const revealedClueText = fullClueText.slice(0, charsToShow);

        ctx.fillStyle = '#1E3A8A';
        ctx.font = getFitFont(ctx, fullClueText, '800', '"Be Vietnam Pro", sans-serif', availableTextW, 24, 16);
        ctx.textAlign = 'left';
        ctx.fillText(revealedClueText, 180, currentCardY + cardH / 2, availableTextW);

        const linePct = Math.min(1.0, timeInClue / TIME_PER_CLUE);
        ctx.fillStyle = '#2563EB';
        drawRoundRect(ctx, 90 + 4, currentCardY + cardH - 8, (cardW - 8) * linePct, 5, 3);
        ctx.fill();

        // Right Badge: "DANG MO..."
        const badgeBoxW = 125;
        const badgeBoxH = 40;
        const badgeBoxX = 90 + cardW - badgeBoxW - 20;
        const badgeBoxY = currentCardY + (cardH - badgeBoxH) / 2;

        ctx.fillStyle = '#DBEAFE';
        drawRoundRect(ctx, badgeBoxX, badgeBoxY, badgeBoxW, badgeBoxH, 20);
        ctx.fill();

        ctx.fillStyle = '#1D4ED8';
        ctx.font = '800 16px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⚡ ĐANG MỞ', badgeBoxX + badgeBoxW / 2, badgeBoxY + badgeBoxH / 2 + 1);

      } else {
        // === CHUA MO (Locked Mystery Card) ===
        ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
        drawRoundRect(ctx, 90, currentCardY, cardW, cardH, 20);
        ctx.fill();

        ctx.strokeStyle = 'rgba(234, 179, 8, 0.35)';
        ctx.lineWidth = 2;
        drawRoundRect(ctx, 90, currentCardY, cardW, cardH, 20);
        ctx.stroke();

        ctx.fillStyle = '#F59E0B';
        ctx.font = '28px "Segoe UI Emoji", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🔒', 135, currentCardY + cardH / 2);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '700 22px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`Gợi ý ${i}: ❓ [ BÍ ẨN CHƯA MỞ ]`, 180, currentCardY + cardH / 2, availableTextW);

        // Right Badge: "KHOA"
        const badgeBoxW = 110;
        const badgeBoxH = 38;
        const badgeBoxX = 90 + cardW - badgeBoxW - 20;
        const badgeBoxY = currentCardY + (cardH - badgeBoxH) / 2;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        drawRoundRect(ctx, badgeBoxX, badgeBoxY, badgeBoxW, badgeBoxH, 19);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '700 15px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🔒 KHÓA', badgeBoxX + badgeBoxW / 2, badgeBoxY + badgeBoxH / 2 + 1);
      }

      ctx.restore();
    }

    // 6. INTERMISSION OVERLAY BANNER (15s - 17s)
    if (isIntermission) {
      const bannerW = 920;
      const bannerH = 140;
      const bannerY = 1530;

      const pulseScale = 1.0 + Math.sin(globalT * 8) * 0.03;

      ctx.save();
      ctx.translate(540, bannerY + bannerH / 2);
      ctx.scale(pulseScale, pulseScale);

      ctx.shadowColor = 'rgba(245, 158, 11, 0.5)';
      ctx.shadowBlur = 30;

      const bannerGrad = ctx.createLinearGradient(-bannerW / 2, 0, bannerW / 2, 0);
      bannerGrad.addColorStop(0, '#F59E0B');
      bannerGrad.addColorStop(1, '#D97706');
      ctx.fillStyle = bannerGrad;
      drawRoundRect(ctx, -bannerW / 2, -bannerH / 2, bannerW, bannerH, 28);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 32px "Be Vietnam Pro", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('❓ BẠN ĐÃ ĐOÁN RA QUỐC GIA NÀO CHƯA?', 0, 0);
      ctx.restore();
    }

    // 7. FINAL REVEAL FRAME (17s - 21s) WITH CRISP COUNTRY FLAG IMAGE
    if (isRevealStage) {
      const revealW = 940;
      const revealH = 420;
      const revealY = 1480;

      const revealProgress = Math.min(1.0, (timeInQ - REVEAL_START_TIME) / 0.5);
      const popScale = 0.7 + 0.3 * Math.sin(revealProgress * Math.PI / 2);

      ctx.save();
      ctx.translate(540, revealY + revealH / 2);
      ctx.scale(popScale, popScale);

      ctx.shadowColor = 'rgba(255, 215, 0, 0.65)';
      ctx.shadowBlur = 40;

      const cardGrad = ctx.createLinearGradient(-revealW / 2, -revealH / 2, revealW / 2, revealH / 2);
      cardGrad.addColorStop(0, '#FFFBEB');
      cardGrad.addColorStop(0.5, '#FEF3C7');
      cardGrad.addColorStop(1, '#FDE68A');
      ctx.fillStyle = cardGrad;
      drawRoundRect(ctx, -revealW / 2, -revealH / 2, revealW, revealH, 32);
      ctx.fill();

      ctx.lineWidth = 6;
      ctx.strokeStyle = '#F59E0B';
      drawRoundRect(ctx, -revealW / 2, -revealH / 2, revealW, revealH, 32);
      ctx.stroke();

      ctx.shadowColor = 'transparent';

      ctx.fillStyle = '#D97706';
      drawRoundRect(ctx, -180, -revealH / 2 - 24, 360, 48, 24);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 22px "Be Vietnam Pro", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🎉 ĐÁP ÁN CHÍNH XÁC', 0, -revealH / 2);

      // Flag Icon / Vector Flag Image Display (FlagCDN)
      const flagCode = getCountryFlagCode(countryFlag, countryName);
      const flagUrl = `https://flagcdn.com/w160/${flagCode}.png`;
      const flagImgObj = getLoadedImage(flagUrl);

      if (flagImgObj && flagImgObj.complete && flagImgObj.naturalWidth > 0) {
        const fW = 150;
        const fH = 100;
        const fX = -fW / 2;
        const fY = -105;

        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 18;
        ctx.shadowOffsetY = 6;

        drawRoundRect(ctx, fX, fY, fW, fH, 16);
        ctx.clip();
        ctx.drawImage(flagImgObj, fX, fY, fW, fH);

        ctx.lineWidth = 4;
        ctx.strokeStyle = '#FFFFFF';
        drawRoundRect(ctx, fX, fY, fW, fH, 16);
        ctx.stroke();
        ctx.restore();
      } else {
        ctx.font = '90px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(countryFlag, 0, -45);
      }

      ctx.fillStyle = '#0F172A';
      ctx.font = '900 56px "Be Vietnam Pro", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(countryName.toUpperCase(), 0, 55);

      if (safeQ.explanation) {
        ctx.fillStyle = '#475569';
        ctx.font = '700 22px "Be Vietnam Pro", sans-serif';
        ctx.fillText(safeQ.explanation, 0, 125);
      }

      ctx.restore();
    }
  };

  // Dedicated Canvas Renderer for "🌾 Ca Dao Tục Ngữ Việt Nam" Fill in the Blank
  const drawCaDaoTucNguCanvasFrame = (ctx, qObj, qIdx, totalQ, stage, timeInQ, stageProgress, theme, currentSet = null) => {
    const safeQObj = qObj || {};
    const targetSet = currentSet || activeSet || {};
    const globalT = performance.now() / 1000;

    const questionText = safeQObj.question || 'Nước đổ đầu ___';
    const answerText = safeQObj.correctOptionText || safeQObj.optionA || safeQObj.word || 'Vịt';
    const explanationText = safeQObj.explanation || '';
    const topicText = (safeQObj.topic || targetSet.topic || 'CA DAO TỤC NGỮ').toUpperCase();

    const GUESS_TIME = settings?.guessTime || 3.0;
    const REVEAL_TIME = 2.0;

    // 1. BACKGROUND: Rich Vietnamese Emerald & Amber Gold Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1920);
    bgGrad.addColorStop(0, '#064E3B'); // Deep Emerald Green
    bgGrad.addColorStop(0.5, '#047857'); // Vibrant Emerald
    bgGrad.addColorStop(1, '#022C22'); // Dark Vietnamese Forest
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1920);

    // Warm Ambient Gold Glow Orbs
    drawAmbientGlowOrbs(ctx, globalT, { accent: '#F59E0B', accent2: '#10B981' });

    // Floating Background Golden Sparkles
    particlesRef.current.forEach((p, pi) => {
      p.x += p.vx * 0.8;
      p.y += p.vy * 0.8;
      if (p.x < 0 || p.x > 1080) p.vx *= -1;
      if (p.y < 0 || p.y > 1920) p.vy *= -1;

      const twinkle = 0.2 + (Math.sin(globalT * 1.8 + pi) * 0.5 + 0.5) * 0.3;
      ctx.save();
      ctx.globalAlpha = twinkle;
      drawIconSparkle(ctx, p.x, p.y, p.radius * 1.3, '#FBBF24', globalT * 1.2 + pi);
      ctx.restore();
    });

    // Screen Border Frame Overlay
    ctx.save();
    ctx.lineWidth = 14;
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.7)'; // Amber Gold
    drawRoundRect(ctx, 10, 10, 1060, 1900, 44);
    ctx.stroke();
    ctx.restore();

    // 2. TOP LEFT BADGE: "🌾 CA DAO TỤC NGỮ"
    let fontPx = 36;
    ctx.font = `900 ${fontPx}px "Be Vietnam Pro", sans-serif`;
    let measuredW = ctx.measureText(topicText).width;
    while (fontPx > 20 && measuredW > 440) {
      fontPx -= 2;
      ctx.font = `900 ${fontPx}px "Be Vietnam Pro", sans-serif`;
      measuredW = ctx.measureText(topicText).width;
    }

    const badgeH = 84;
    const badgePaddingX = 36;
    const badgeW = Math.max(280, Math.min(520, measuredW + badgePaddingX * 2));
    const badgeX = 45 + badgeW / 2;
    const badgeY = 105;

    drawDecorationTicks(ctx, badgeX - badgeW / 2 + 25, badgeY - 5, '#FBBF24', 1.2, -0.4);
    drawDecorationTicks(ctx, badgeX + badgeW / 2 - 25, badgeY - 5, '#FBBF24', 1.2, 0.4);

    ctx.save();
    ctx.translate(badgeX, badgeY);
    ctx.rotate(-0.02);

    ctx.shadowColor = 'rgba(245, 158, 11, 0.55)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 8;

    const badgeGrad = ctx.createLinearGradient(-badgeW / 2, 0, badgeW / 2, 0);
    badgeGrad.addColorStop(0, '#D97706'); // Amber
    badgeGrad.addColorStop(1, '#B45309');
    ctx.fillStyle = badgeGrad;
    drawRoundRect(ctx, -badgeW / 2, -badgeH / 2, badgeW, badgeH, 42);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.fillStyle = '#FFFFFF';
    ctx.font = `900 ${fontPx}px "Be Vietnam Pro", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`🌾 ${topicText}`, 0, 2);
    ctx.restore();

    // 3. TOP RIGHT MASCOT LOGO
    drawMascotLogo(ctx, 970, 100, 65, (logoImgRef && logoImgRef.current) || getLoadedImage('/logo2.png'));

    // 4. SUB-HEADER PILL: "ĐIỀN TỪ CÒN THIẾU VÀO CÂU CA DAO ➔"
    const headerTitleText = 'ĐIỀN TỪ CÒN THIẾU VÀO CÂU CA DAO ➔';
    let subFontPx = 24;
    ctx.font = `900 ${subFontPx}px "Be Vietnam Pro", sans-serif`;
    let subMeasuredW = ctx.measureText(headerTitleText).width;

    const headerW = Math.max(380, Math.min(760, subMeasuredW + 80));
    const headerH = 68;
    const headerX = 540 - headerW / 2;
    const headerY = 220;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 6;
    ctx.fillStyle = '#FFFFFF';
    drawRoundRect(ctx, headerX, headerY, headerW, headerH, 34);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.fillStyle = '#065F46';
    ctx.font = `900 ${subFontPx}px "Be Vietnam Pro", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(headerTitleText, 540, headerY + headerH / 2 + 1);
    ctx.restore();

    // 5. HERO QUESTION CARD (Y: 320 -> 760)
    const qCardY = 320;
    const qCardH = 440;
    const qCardW = 920;
    const qCardX = 540 - qCardW / 2;
    const tagY = qCardY - 24;

    ctx.save();
    ctx.fillStyle = 'rgba(6, 44, 34, 0.92)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 14;
    drawRoundRect(ctx, qCardX, qCardY, qCardW, qCardH, 40);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    const qBorderGrad = ctx.createLinearGradient(qCardX, qCardY, qCardX + qCardW, qCardY + qCardH);
    qBorderGrad.addColorStop(0, '#F59E0B');
    qBorderGrad.addColorStop(1, '#10B981');
    ctx.lineWidth = 5;
    ctx.strokeStyle = qBorderGrad;
    ctx.stroke();

    // Question Tag Badge
    ctx.fillStyle = '#D97706';
    drawRoundRect(ctx, 300, tagY, 480, 46, 23);
    ctx.fill();
    drawIconQuestionBubble(ctx, 335, tagY + 23, 13, '#FFFFFF');
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold 24px ${FONT_FAMILY}`;
    ctx.textAlign = 'center';
    ctx.fillText('CÂU CA DAO TỤC NGỮ', 555, tagY + 32);

    // Render Question Text (Large Proverb Text)
    const qMetrics = drawWrappedQuestion3D(ctx, questionText, 540, qCardY + 210, 840, 52, {
      minY: tagY + 56,
      maxHeight: 280,
      maxLines: 4,
      minFontSize: 32,
      strokeColor: '#022C22',
      textColor: '#FFFFFF'
    });

    // Yellow Swoosh Underline
    const swooshY = Math.max(qCardY + qCardH - 40, qMetrics.bottomY + 16);
    ctx.save();
    ctx.fillStyle = '#FBBF24';
    ctx.shadowColor = 'rgba(251, 191, 36, 0.6)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.ellipse(540, swooshY, 260, 9, -0.02, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore(); // End Hero Question Card

    // 6. COUNTDOWN TIMER BAR (3s)
    const barW = 540;
    const barH = 16;
    const barX = 540 - barW / 2;
    const barY = qCardY + qCardH + 35;

    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    drawRoundRect(ctx, barX, barY, barW, barH, 8);
    ctx.fill();

    const fillPercent = stage === 'read' ? 1.0 : (stage === 'guess' ? Math.max(0, 1 - stageProgress) : 0);
    const currentBarW = Math.max(0, barW * fillPercent);
    if (currentBarW > 0) {
      const amberGrad = ctx.createLinearGradient(barX, 0, barX + currentBarW, 0);
      amberGrad.addColorStop(0, '#F59E0B');
      amberGrad.addColorStop(1, '#FBBF24');
      ctx.fillStyle = amberGrad;
      ctx.shadowColor = 'rgba(245, 158, 11, 0.8)';
      ctx.shadowBlur = 12;
      drawRoundRect(ctx, barX, barY, currentBarW, barH, 8);
      ctx.fill();
    }
    ctx.restore();

    // 7. ANSWER CARD SECTION (Y: 870 -> 1600)
    const ansCardY = barY + 45;
    const ansCardW = 920;
    const ansCardX = 540 - ansCardW / 2;

    if (stage === 'guess' || stage === 'read') {
      // GIAI ĐOẠN ĐANG ĐOÁN (3s đếm ngược)
      const remainingSec = stage === 'read' ? Math.ceil(GUESS_TIME) : Math.max(0, Math.ceil(GUESS_TIME * (1 - stageProgress)));
      const urgent = remainingSec <= 1;

      // Card thông báo đếm ngược
      ctx.save();
      ctx.fillStyle = 'rgba(4, 40, 30, 0.90)';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 24;
      drawRoundRect(ctx, ansCardX, ansCardY, ansCardW, 260, 40);
      ctx.fill();

      ctx.lineWidth = 3;
      ctx.strokeStyle = urgent ? '#EF4444' : '#F59E0B';
      ctx.stroke();

      // Clock Icon & Text
      ctx.fillStyle = urgent ? '#EF4444' : '#FBBF24';
      ctx.font = '900 40px "Be Vietnam Pro", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`⏳ SUY NGHĨ TRONG ${remainingSec} GIÂY...`, 540, ansCardY + 130);
      ctx.restore();

    } else if (stage === 'reveal') {
      // GIAI ĐOẠN CÔNG BỐ ĐÁP ÁN TRỰC TIẾP (TRỰC TIẾP HIỆN ĐÁP ÁN - KHÔNG CÓ A, B, C, D)
      const revealElapsed = stageProgress * REVEAL_TIME;
      const revealBounce = easeOutBack(Math.min(1, revealElapsed / 0.4));
      const ansCardH = explanationText ? 520 : 420;

      ctx.save();
      ctx.translate(540, ansCardY + ansCardH / 2);
      ctx.scale(0.88 + revealBounce * 0.12, 0.88 + revealBounce * 0.12);
      ctx.translate(-540, -(ansCardY + ansCardH / 2));

      ctx.shadowColor = 'rgba(245, 158, 11, 0.6)';
      ctx.shadowBlur = 35;
      ctx.shadowOffsetY = 12;

      const goldGrad = ctx.createLinearGradient(ansCardX, ansCardY, ansCardX + ansCardW, ansCardY + ansCardH);
      goldGrad.addColorStop(0, '#FEF3C7');
      goldGrad.addColorStop(0.5, '#FDE68A');
      goldGrad.addColorStop(1, '#F59E0B');
      ctx.fillStyle = goldGrad;
      drawRoundRect(ctx, ansCardX, ansCardY, ansCardW, ansCardH, 40);
      ctx.fill();
      ctx.shadowColor = 'transparent';

      ctx.lineWidth = 6;
      ctx.strokeStyle = '#D97706';
      ctx.stroke();

      // Tag Badge: 🎉 ĐÁP ÁN CHÍNH XÁC!
      ctx.fillStyle = '#D97706';
      drawRoundRect(ctx, 300, ansCardY - 24, 480, 48, 24);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 24px "Be Vietnam Pro", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🎉 ĐÁP ÁN CHÍNH XÁC!', 540, ansCardY + 8);

      // Display Answer Text in Super Large Bold Typography
      const displayAns = answerText.toUpperCase();
      ctx.save();
      ctx.font = getFitFont(ctx, displayAns, '900', '"Be Vietnam Pro", sans-serif', 820, 80, 44);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // 3D Text Stroke & Fill
      ctx.lineWidth = 10;
      ctx.strokeStyle = '#78350F';
      ctx.strokeText(displayAns, 540, ansCardY + 145);

      ctx.fillStyle = '#B45309';
      ctx.fillText(displayAns, 540, ansCardY + 145);
      ctx.restore();

      // Explanation / Meaning of Proverb
      if (explanationText) {
        const explY = ansCardY + 240;
        ctx.save();
        ctx.fillStyle = 'rgba(120, 53, 15, 0.92)';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 14;
        drawRoundRect(ctx, ansCardX + 40, explY, ansCardW - 80, 220, 28);
        ctx.fill();
        ctx.shadowColor = 'transparent';

        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#FBBF24';
        ctx.stroke();

        ctx.fillStyle = '#FDE68A';
        ctx.font = '900 24px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('💡 Ý NGHĨA CÂU CA DAO TỤC NGỮ', 540, explY + 45);

        ctx.fillStyle = '#FFFFFF';
        drawWrappedText(ctx, explanationText, 540, explY + 125, ansCardW - 120, 28, '700', FONT_FAMILY, 3, {
          minY: explY + 65,
          maxHeight: 140,
          minFontSize: 18
        });
        ctx.restore();
      }

      ctx.restore();
    }

    // 8. FOOTER BANNER: "🌾 NHỚ LIKE & THEO DÕI ĐỂ HỌC THÊM NHIỀU CA DAO TỤC NGỮ!"
    const footerW = 920;
    const footerH = 110;
    const footerX = 540 - footerW / 2;
    const footerY = 1720;

    const pulseFactor = Math.sin(globalT * 3.5) * 0.5 + 0.5;

    ctx.save();
    ctx.shadowColor = 'rgba(245, 158, 11, ' + (0.4 + pulseFactor * 0.4) + ')';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 6;

    const footerGrad = ctx.createLinearGradient(footerX, footerY, footerX + footerW, footerY + footerH);
    footerGrad.addColorStop(0, '#D97706');
    footerGrad.addColorStop(1, '#B45309');
    ctx.fillStyle = footerGrad;
    drawRoundRect(ctx, footerX, footerY, footerW, footerH, 55);
    ctx.fill();

    ctx.lineWidth = 4;
    ctx.strokeStyle = '#FBBF24';
    ctx.stroke();
    ctx.restore();

    drawIconHeart(ctx, footerX + footerW - 65, footerY + footerH / 2, 22, '#FFFFFF');
    ctx.restore();

    drawVignette(ctx);
  };

  // Dedicated Canvas Renderer for "🍳 Nhìn Hình Đoán Món Ăn" (Food Guess Crossword Style)
  const drawFoodGuessCanvasFrame = (ctx, qObj, qIdx, totalQ, stage, timeInQ, stageProgress, theme, currentSet = null) => {
    const safeQObj = qObj || {};
    const targetSet = currentSet || activeSet || {};
    const globalT = performance.now() / 1000;

    const dishName = String(safeQObj.word || safeQObj.optionA || safeQObj.question || 'PHỞ BÒ').toUpperCase().trim();
    const explanationText = safeQObj.explanation || `${dishName} - Món ăn ngon đặc sắc!`;
    const topicText = (safeQObj.topic || targetSet.topic || '🍳 ĐOÁN MÓN ĂN').toUpperCase();
    const headerTitleText = (safeQObj.headerTitle || targetSet.headerTitle || 'ĐÂY LÀ MÓN GÌ?').toUpperCase();

    const GUESS_TIME = settings?.guessTime || 3.0;
    const REVEAL_TIME = 2.0;

    // 1. BACKGROUND: Deep Amber / Warm Coral Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1920);
    bgGrad.addColorStop(0, '#781D10'); // Deep Warm Burgundy / Crimson
    bgGrad.addColorStop(0.5, '#C0392B'); // Warm Crimson Red
    bgGrad.addColorStop(1, '#3E0A05'); // Dark Mahogany
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1920);

    // Warm Ambient Gold Glow Orbs
    drawAmbientGlowOrbs(ctx, globalT, { accent: '#FF7043', accent2: '#FFD54F' });

    // Floating Background Food Sparkles
    particlesRef.current.forEach((p, pi) => {
      p.x += p.vx * 0.8;
      p.y += p.vy * 0.8;
      if (p.x < 0 || p.x > 1080) p.vx *= -1;
      if (p.y < 0 || p.y > 1920) p.vy *= -1;

      const twinkle = 0.2 + (Math.sin(globalT * 1.8 + pi) * 0.5 + 0.5) * 0.3;
      ctx.save();
      ctx.globalAlpha = twinkle;
      drawIconSparkle(ctx, p.x, p.y, p.radius * 1.3, '#FFE082', globalT * 1.2 + pi);
      ctx.restore();
    });

    // Screen Border Frame Overlay
    ctx.save();
    ctx.lineWidth = 14;
    ctx.strokeStyle = 'rgba(255, 213, 79, 0.75)'; // Warm Amber Gold
    drawRoundRect(ctx, 10, 10, 1060, 1900, 44);
    ctx.stroke();
    ctx.restore();

    // 2. TOP LEFT BADGE: "🍳 ĐOÁN MÓN ĂN"
    let fontPx = 36;
    ctx.font = `900 ${fontPx}px "Be Vietnam Pro", sans-serif`;
    let measuredW = ctx.measureText(topicText).width;
    while (fontPx > 20 && measuredW > 440) {
      fontPx -= 2;
      ctx.font = `900 ${fontPx}px "Be Vietnam Pro", sans-serif`;
      measuredW = ctx.measureText(topicText).width;
    }

    const badgeH = 84;
    const badgePaddingX = 36;
    const badgeW = Math.max(280, Math.min(520, measuredW + badgePaddingX * 2));
    const badgeX = 45 + badgeW / 2;
    const badgeY = 105;

    drawDecorationTicks(ctx, badgeX - badgeW / 2 + 25, badgeY - 5, '#FFE082', 1.2, -0.4);
    drawDecorationTicks(ctx, badgeX + badgeW / 2 - 25, badgeY - 5, '#FFE082', 1.2, 0.4);

    ctx.save();
    ctx.translate(badgeX, badgeY);
    ctx.rotate(-0.02);

    ctx.shadowColor = 'rgba(255, 112, 67, 0.55)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 8;

    const badgeGrad = ctx.createLinearGradient(-badgeW / 2, 0, badgeW / 2, 0);
    badgeGrad.addColorStop(0, '#E65100'); // Deep Flame Orange
    badgeGrad.addColorStop(1, '#F57C00');
    ctx.fillStyle = badgeGrad;
    drawRoundRect(ctx, -badgeW / 2, -badgeH / 2, badgeW, badgeH, 42);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.fillStyle = '#FFFFFF';
    ctx.font = `900 ${fontPx}px "Be Vietnam Pro", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`🍳 ${topicText}`, 0, 2);
    ctx.restore();

    // 3. TOP RIGHT MASCOT LOGO
    drawMascotLogo(ctx, 970, 100, 65, (logoImgRef && logoImgRef.current) || getLoadedImage('/logo2.png'));

    // 4. SUB-HEADER PILL: "ĐÂY LÀ MÓN GÌ? ➔"
    let subFontPx = 26;
    ctx.font = `900 ${subFontPx}px "Be Vietnam Pro", sans-serif`;
    let subMeasuredW = ctx.measureText(headerTitleText).width;

    const headerW = Math.max(380, Math.min(700, subMeasuredW + 110));
    const headerH = 68;
    const headerX = 540 - headerW / 2;
    const headerY = 220;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 6;
    ctx.fillStyle = '#FFFFFF';
    drawRoundRect(ctx, headerX, headerY, headerW, headerH, 34);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.fillStyle = '#BF360C';
    ctx.font = `900 ${subFontPx}px "Be Vietnam Pro", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const textCenterX = headerX + (headerW - 60) / 2;
    ctx.fillText(headerTitleText, textCenterX, headerY + headerH / 2 + 1);

    // Circle với mũi tên trắng -> bên phải pill
    const arrowCircleX = headerX + headerW - 38;
    const arrowCircleY = headerY + headerH / 2;
    ctx.fillStyle = '#D84315';
    ctx.beginPath();
    ctx.arc(arrowCircleX, arrowCircleY, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px "Be Vietnam Pro", sans-serif';
    ctx.fillText('➔', arrowCircleX, arrowCircleY + 1);
    ctx.restore();

    // 5. MAIN HERO DISH IMAGE SHOWCASE CARD (SUPER SIZED HD SHOWCASE 860x480)
    const imgW = 860;
    const imgH = 480;
    const imgX = 540 - imgW / 2;
    const imgY = 305;

    drawDecorationTicks(ctx, 45, imgY + imgH / 2, '#FFE082', 1.2, -0.6);
    drawDecorationTicks(ctx, 1035, imgY + imgH / 2, '#FFE082', 1.2, 0.6);

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 10;
    ctx.fillStyle = '#FFFFFF';
    drawRoundRect(ctx, imgX - 8, imgY - 8, imgW + 16, imgH + 16, 30);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.lineWidth = 4;
    ctx.strokeStyle = '#FF7043';
    ctx.stroke();
    ctx.restore();

    // Render Dish Image
    const dishImgObj = safeQObj.image ? getLoadedImage(safeQObj.image) : null;
    if (dishImgObj) {
      ctx.save();
      drawRoundRect(ctx, imgX, imgY, imgW, imgH, 24);
      ctx.clip();
      drawFitImage(ctx, dishImgObj, imgX, imgY, imgW, imgH, { progress: stageProgress, qIdx: qIdx, kenBurns: settings?.imageMotion === true, containFit: true });
      ctx.restore();
    } else {
      ctx.save();
      drawRoundRect(ctx, imgX, imgY, imgW, imgH, 24);
      ctx.fillStyle = '#FBE9E7';
      ctx.fill();
      ctx.fillStyle = '#D84315';
      ctx.font = 'bold 36px "Be Vietnam Pro", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🍜 HÌNH ẢNH MÓN ĂN', 540, imgY + imgH / 2);
      ctx.restore();
    }

    // Yellow Swoosh Underline below image
    const swooshY = imgY + imgH + 20;
    ctx.save();
    ctx.fillStyle = '#FFE082';
    ctx.shadowColor = 'rgba(255, 224, 130, 0.6)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.ellipse(540, swooshY, 260, 9, -0.02, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 6. GREEN COUNTDOWN TIMER BAR & BADGE (3s)
    const barW = 540;
    const barH = 16;
    const barX = 540 - barW / 2;
    const barY = swooshY + 22; // ~694

    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    drawRoundRect(ctx, barX, barY, barW, barH, 8);
    ctx.fill();

    const fillPercent = stage === 'read' ? 1.0 : (stage === 'guess' ? Math.max(0, 1 - stageProgress) : 0);
    const currentBarW = Math.max(0, barW * fillPercent);
    if (currentBarW > 0) {
      const greenGrad = ctx.createLinearGradient(barX, 0, barX + currentBarW, 0);
      greenGrad.addColorStop(0, '#00E676');
      greenGrad.addColorStop(1, '#00C853');
      ctx.fillStyle = greenGrad;
      ctx.shadowColor = 'rgba(0, 230, 118, 0.7)';
      ctx.shadowBlur = 10;
      drawRoundRect(ctx, barX, barY, currentBarW, barH, 8);
      ctx.fill();
    }
    ctx.restore();

    // 6b. TIMER SECONDS BADGE (⏱️ 3s)
    const currentGuessDuration = GUESS_TIME;
    const remainingSec = stage === 'read' ? Math.ceil(currentGuessDuration) : (stage === 'guess' ? Math.max(0, Math.ceil(currentGuessDuration * (1 - stageProgress))) : 0);
    if (stage === 'guess' || stage === 'read') {
      ctx.save();
      const tBadgeW = 95;
      const tBadgeH = 32;
      const tBadgeX = barX + barW - tBadgeW;
      const tBadgeY = barY - 38;
      ctx.fillStyle = '#00C853';
      ctx.shadowColor = 'rgba(0, 200, 83, 0.5)';
      ctx.shadowBlur = 8;
      drawRoundRect(ctx, tBadgeX, tBadgeY, tBadgeW, tBadgeH, 16);
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 18px "Be Vietnam Pro", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`⏱️ ${remainingSec}s`, tBadgeX + tBadgeW / 2, tBadgeY + tBadgeH / 2 + 1);
      ctx.restore();
    }

    // 7. ANSWER CARD SECTION - WORD SLOT BOXES (O CHU)
    const ansCardY = barY + 40;
    const ansCardH = (stage === 'guess' || stage === 'read') ? 310 : 420;
    const ansCardW = 900;
    const ansCardX = 540 - ansCardW / 2;
    const ansTagY = ansCardY - 22;

    ctx.save();
    ctx.fillStyle = 'rgba(38, 10, 5, 0.95)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 15;
    drawRoundRect(ctx, ansCardX, ansCardY, ansCardW, ansCardH, 40);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    const ansBorderGrad = ctx.createLinearGradient(ansCardX, ansCardY, ansCardX + ansCardW, ansCardY + ansCardH);
    if (stage === 'reveal') {
      ansBorderGrad.addColorStop(0, '#00E676');
      ansBorderGrad.addColorStop(1, '#00C2FF');
    } else {
      ansBorderGrad.addColorStop(0, '#FF7043');
      ansBorderGrad.addColorStop(1, '#E65100');
    }
    ctx.lineWidth = 5;
    ctx.strokeStyle = ansBorderGrad;
    ctx.stroke();

    // Tag Badge top of Answer Card
    const tagText = (stage === 'guess' || stage === 'read') ? 'ĐÁP ÁN: (Chữ cái đầu & ô chữ ẩn _ _ _)' : '✨ ĐÁP ÁN CHÍNH XÁC!';
    const tagBg = (stage === 'guess' || stage === 'read') ? '#FF9800' : '#00E676';
    const tagW = 680;
    ctx.fillStyle = tagBg;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;
    drawRoundRect(ctx, 540 - tagW / 2, ansTagY, tagW, 48, 24);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 23px "Be Vietnam Pro", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tagText, 540, ansTagY + 25);

    // Letter Slot Boxes (DYNAMIC MULTI-WORD FIT)
    const letters = dishName.split('');
    const totalChars = letters.length;
    const maxContainerW = 820;

    let slotW = Math.min(84, Math.max(34, Math.floor(maxContainerW / Math.max(1, totalChars))));
    let slotH = Math.round(slotW * 1.25);
    let slotGap = Math.min(16, Math.max(4, Math.floor((maxContainerW - totalChars * slotW) / Math.max(1, totalChars - 1))));
    if (slotGap < 4) slotGap = 4;

    const totalSlotsW = totalChars * slotW + (totalChars - 1) * slotGap;
    const startSlotX = 540 - totalSlotsW / 2;
    const slotY = ansCardY + 75;

    const revealElapsed = stage === 'reveal' ? stageProgress * REVEAL_TIME : 0;

    letters.forEach((char, i) => {
      const sx = startSlotX + i * (slotW + slotGap);
      const isSpace = char === ' ' || char === '-';
      const isFirstLetterOfWord = i === 0 || (i > 0 && (letters[i - 1] === ' ' || letters[i - 1] === '-'));

      if (isSpace) {
        ctx.fillStyle = '#FFE082';
        ctx.font = `900 ${Math.round(slotW * 0.6)}px "Be Vietnam Pro", sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('-', sx + slotW / 2, slotY + slotH / 2);
        return;
      }

      ctx.save();
      let boxBg = 'rgba(255, 255, 255, 0.08)';
      let boxBorder = 'rgba(255, 255, 255, 0.25)';
      let charText = '_';
      let charColor = '#FFE082';

      if (stage === 'guess' || stage === 'read') {
        if (isFirstLetterOfWord) {
          boxBg = '#FF5722';
          boxBorder = '#FFFFFF';
          charText = char;
          charColor = '#FFFFFF';
        } else {
          charText = '_';
          charColor = 'rgba(255, 255, 255, 0.7)';
        }
      } else {
        const letterDelay = i * 0.05;
        const letterPopRaw = Math.max(0, Math.min(1, (revealElapsed - letterDelay) / 0.3));
        const letterPop = easeOutBack(letterPopRaw);

        ctx.translate(sx + slotW / 2, slotY + slotH / 2);
        ctx.scale(0.85 + letterPop * 0.15, 0.85 + letterPop * 0.15);
        ctx.translate(-(sx + slotW / 2), -(slotY + slotH / 2));

        const gGrad = ctx.createLinearGradient(sx, slotY, sx + slotW, slotY + slotH);
        gGrad.addColorStop(0, '#00E676');
        gGrad.addColorStop(1, '#00C2FF');
        boxBg = gGrad;
        boxBorder = '#FFFFFF';
        charText = char;
        charColor = '#FFFFFF';
      }

      ctx.fillStyle = boxBg;
      ctx.shadowColor = (stage === 'reveal' || isFirstLetterOfWord) ? 'rgba(0, 230, 118, 0.6)' : 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = (stage === 'reveal' || isFirstLetterOfWord) ? 16 : 8;
      drawRoundRect(ctx, sx, slotY, slotW, slotH, 18);
      ctx.fill();

      ctx.lineWidth = (stage === 'reveal' || isFirstLetterOfWord) ? 3.5 : 2;
      ctx.strokeStyle = boxBorder;
      ctx.stroke();

      ctx.fillStyle = charColor;
      ctx.font = `900 ${Math.round(slotW * 0.62)}px "Be Vietnam Pro", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(charText, sx + slotW / 2, slotY + slotH / 2 + (charText === '_' ? -4 : 2));
      ctx.restore();
    });

    if (stage === 'reveal') {
      const panelEntrance = easeOutCubic(Math.min(1, revealElapsed / 0.35));
      ctx.save();
      ctx.globalAlpha = panelEntrance;
      const explY = slotY + slotH + 25;
      ctx.fillStyle = '#FFE082';
      drawWrappedText(ctx, explanationText, 540, explY, 820, 26, '700', FONT_FAMILY, 3, {
        minY: explY - 10,
        maxHeight: 100,
        minFontSize: 18
      });
      ctx.restore();
    }
    ctx.restore();

    // 8. BOTTOM FOOTER CTA BANNER
    const footerW = 920;
    const footerH = 110;
    const footerX = 540 - footerW / 2;
    const footerY = 1720;

    drawDecorationTicks(ctx, footerX - 25, footerY + footerH / 2, '#FFE082', 1.2, -0.3);
    drawDecorationTicks(ctx, footerX + footerW + 25, footerY + footerH / 2, '#FFE082', 1.2, 0.3);

    const pulseFactor = Math.sin(globalT * 3.5) * 0.5 + 0.5;

    ctx.save();
    ctx.shadowColor = 'rgba(230, 81, 0, ' + (0.35 + pulseFactor * 0.35) + ')';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 6;

    const footerGrad = ctx.createLinearGradient(footerX, footerY, footerX + footerW, footerY + footerH);
    footerGrad.addColorStop(0, '#E65100');
    footerGrad.addColorStop(1, '#BF360C');
    ctx.fillStyle = footerGrad;
    drawRoundRect(ctx, footerX, footerY, footerW, footerH, 55);
    ctx.fill();

    ctx.lineWidth = 3.5;
    ctx.strokeStyle = '#FFE082';
    ctx.stroke();
    ctx.restore();

    drawIconThumbsUp(ctx, footerX + 65, footerY + footerH / 2, 24, '#FFFFFF');

    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fillRect(footerX + 130, footerY + 25, 3, footerH - 50);

    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = '900 26px "Be Vietnam Pro", sans-serif';
    ctx.fillText('NHỚ LIKE & THEO DÕI', footerX + 160, footerY + footerH / 2 - 14);

    ctx.font = '700 22px "Be Vietnam Pro", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillText('để khám phá thêm nhiều món ăn ngon! 🍳', footerX + 160, footerY + footerH / 2 + 18);

    drawIconHeart(ctx, footerX + footerW - 65, footerY + footerH / 2, 22, '#FFFFFF');
    ctx.restore();

    drawVignette(ctx);
  };

  // Dedicated Canvas Renderer for "🏰 Nhìn Ảnh Đoán Địa Điểm Nổi Tiếng" (Landmark Guess Crossword Style)
  const drawLandmarkGuessCanvasFrame = (ctx, qObj, qIdx, totalQ, stage, timeInQ, stageProgress, theme, currentSet = null) => {
    const safeQObj = qObj || {};
    const targetSet = currentSet || activeSet || {};
    const globalT = performance.now() / 1000;

    const landmarkName = String(safeQObj.landmark || safeQObj.word || safeQObj.optionA || safeQObj.question || 'THÁP EIFFEL').toUpperCase().trim();
    const explanationText = safeQObj.explanation || `${landmarkName} - Địa điểm du lịch kỳ vĩ nổi tiếng thế giới!`;
    const topicText = (safeQObj.topic || targetSet.topic || '🏰 ĐOÁN ĐỊA ĐIỂM').toUpperCase();
    const headerTitleText = (safeQObj.headerTitle || targetSet.headerTitle || 'ĐÂY LÀ ĐÂY?').toUpperCase();

    const GUESS_TIME = settings?.guessTime || 3.0;
    const REVEAL_TIME = 2.0;

    // 1. BACKGROUND: Deep Royal Indigo & Midnight Sapphire Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1920);
    bgGrad.addColorStop(0, '#0B132B'); // Deep Midnight Navy
    bgGrad.addColorStop(0.4, '#1C2541'); // Deep Sapphire Blue
    bgGrad.addColorStop(0.8, '#0D1B2A'); // Rich Dark Indigo
    bgGrad.addColorStop(1, '#06101E'); // Near Black Slate
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1920);

    // Cyan & Gold Ambient Glow Orbs
    drawAmbientGlowOrbs(ctx, globalT, { accent: '#0EA5E9', accent2: '#F59E0B' });

    // Floating Travel Sparkles & Stars
    particlesRef.current.forEach((p, pi) => {
      p.x += p.vx * 0.8;
      p.y += p.vy * 0.8;
      if (p.x < 0 || p.x > 1080) p.vx *= -1;
      if (p.y < 0 || p.y > 1920) p.vy *= -1;

      const twinkle = 0.2 + (Math.sin(globalT * 1.8 + pi) * 0.5 + 0.5) * 0.35;
      ctx.save();
      ctx.globalAlpha = twinkle;
      drawIconSparkle(ctx, p.x, p.y, p.radius * 1.35, '#38BDF8', globalT * 1.2 + pi);
      ctx.restore();
    });

    // Outer Screen Border Frame Overlay
    ctx.save();
    ctx.lineWidth = 14;
    ctx.strokeStyle = 'rgba(14, 165, 233, 0.75)'; // Electric Cyan Gold
    drawRoundRect(ctx, 10, 10, 1060, 1900, 44);
    ctx.stroke();
    ctx.restore();

    // 2. TOP LEFT BADGE: "🏰 ĐOÁN ĐỊA ĐIỂM"
    let fontPx = 36;
    ctx.font = `900 ${fontPx}px "Be Vietnam Pro", sans-serif`;
    let measuredW = ctx.measureText(topicText).width;
    while (fontPx > 20 && measuredW > 440) {
      fontPx -= 2;
      ctx.font = `900 ${fontPx}px "Be Vietnam Pro", sans-serif`;
      measuredW = ctx.measureText(topicText).width;
    }

    const badgeH = 84;
    const badgePaddingX = 36;
    const badgeW = Math.max(280, Math.min(520, measuredW + badgePaddingX * 2));
    const badgeX = 45 + badgeW / 2;
    const badgeY = 105;

    drawDecorationTicks(ctx, badgeX - badgeW / 2 + 25, badgeY - 5, '#38BDF8', 1.2, -0.4);
    drawDecorationTicks(ctx, badgeX + badgeW / 2 - 25, badgeY - 5, '#38BDF8', 1.2, 0.4);

    ctx.save();
    ctx.translate(badgeX, badgeY);
    ctx.rotate(-0.02);

    ctx.shadowColor = 'rgba(14, 165, 233, 0.55)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 8;

    const badgeGrad = ctx.createLinearGradient(-badgeW / 2, 0, badgeW / 2, 0);
    badgeGrad.addColorStop(0, '#0284C7'); // Royal Sky Blue
    badgeGrad.addColorStop(1, '#0369A1');
    ctx.fillStyle = badgeGrad;
    drawRoundRect(ctx, -badgeW / 2, -badgeH / 2, badgeW, badgeH, 42);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.fillStyle = '#FFFFFF';
    ctx.font = `900 ${fontPx}px "Be Vietnam Pro", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`🏰 ${topicText}`, 0, 2);
    ctx.restore();

    // 3. TOP RIGHT MASCOT LOGO
    drawMascotLogo(ctx, 970, 100, 65, (logoImgRef && logoImgRef.current) || getLoadedImage('/logo2.png'));

    // 4. SUB-HEADER PILL: "ĐÂY LÀ ĐÂY? ➔"
    let subFontPx = 26;
    ctx.font = `900 ${subFontPx}px "Be Vietnam Pro", sans-serif`;
    let subMeasuredW = ctx.measureText(headerTitleText).width;

    const headerW = Math.max(380, Math.min(700, subMeasuredW + 110));
    const headerH = 68;
    const headerX = 540 - headerW / 2;
    const headerY = 220;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 6;
    ctx.fillStyle = '#FFFFFF';
    drawRoundRect(ctx, headerX, headerY, headerW, headerH, 34);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.fillStyle = '#0F172A';
    ctx.font = `900 ${subFontPx}px "Be Vietnam Pro", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const textCenterX = headerX + (headerW - 60) / 2;
    ctx.fillText(headerTitleText, textCenterX, headerY + headerH / 2 + 1);

    // Arrow Badge Circle
    const arrowCircleX = headerX + headerW - 38;
    const arrowCircleY = headerY + headerH / 2;
    ctx.fillStyle = '#0284C7';
    ctx.beginPath();
    ctx.arc(arrowCircleX, arrowCircleY, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px "Be Vietnam Pro", sans-serif';
    ctx.fillText('➔', arrowCircleX, arrowCircleY + 1);
    ctx.restore();

    // 5. MAIN HERO LANDMARK IMAGE SHOWCASE CARD (SUPER SIZED HD SHOWCASE 920x540)
    const imgW = 920;
    const imgH = 540;
    const imgX = 540 - imgW / 2;
    const imgY = 305;

    drawDecorationTicks(ctx, 45, imgY + imgH / 2, '#38BDF8', 1.2, -0.6);
    drawDecorationTicks(ctx, 1035, imgY + imgH / 2, '#38BDF8', 1.2, 0.6);

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 28;
    ctx.shadowOffsetY = 12;
    ctx.fillStyle = '#FFFFFF';
    drawRoundRect(ctx, imgX - 8, imgY - 8, imgW + 16, imgH + 16, 32);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.lineWidth = 4.5;
    ctx.strokeStyle = '#38BDF8';
    ctx.stroke();
    ctx.restore();

    // Render Landmark Image
    const landmarkImgObj = safeQObj.image ? getLoadedImage(safeQObj.image) : null;
    if (landmarkImgObj) {
      ctx.save();
      drawRoundRect(ctx, imgX, imgY, imgW, imgH, 26);
      ctx.clip();
      drawFitImage(ctx, landmarkImgObj, imgX, imgY, imgW, imgH, { progress: stageProgress, qIdx: qIdx, kenBurns: settings?.imageMotion === true, smartLandmarkFit: true });
      ctx.restore();
    } else {
      ctx.save();
      drawRoundRect(ctx, imgX, imgY, imgW, imgH, 26);
      ctx.fillStyle = '#E0F2FE';
      ctx.fill();
      ctx.fillStyle = '#0369A1';
      ctx.font = 'bold 44px "Be Vietnam Pro", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🏛️ HÌNH ẢNH ĐỊA ĐIỂM', 540, imgY + imgH / 2);
      ctx.restore();
    }

    // Light Cyan Swoosh Underline below image
    const swooshY = imgY + imgH + 18;
    ctx.save();
    ctx.fillStyle = '#38BDF8';
    ctx.shadowColor = 'rgba(56, 189, 248, 0.6)';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.ellipse(540, swooshY, 410, 10, -0.02, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 6. CYAN COUNTDOWN TIMER BAR & BADGE (3s)
    const barW = 720;
    const barH = 16;
    const barX = 540 - barW / 2;
    const barY = swooshY + 24;

    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    drawRoundRect(ctx, barX, barY, barW, barH, 8);
    ctx.fill();

    const fillPercent = stage === 'read' ? 1.0 : (stage === 'guess' ? Math.max(0, 1 - stageProgress) : 0);
    const currentBarW = Math.max(0, barW * fillPercent);
    if (currentBarW > 0) {
      const cyanGrad = ctx.createLinearGradient(barX, 0, barX + currentBarW, 0);
      cyanGrad.addColorStop(0, '#38BDF8');
      cyanGrad.addColorStop(1, '#0284C7');
      ctx.fillStyle = cyanGrad;
      ctx.shadowColor = 'rgba(56, 189, 248, 0.7)';
      ctx.shadowBlur = 10;
      drawRoundRect(ctx, barX, barY, currentBarW, barH, 8);
      ctx.fill();
    }
    ctx.restore();

    // 6b. TIMER SECONDS BADGE (⏱️ 3s)
    const currentGuessDuration = GUESS_TIME;
    const remainingSec = stage === 'read' ? Math.ceil(currentGuessDuration) : (stage === 'guess' ? Math.max(0, Math.ceil(currentGuessDuration * (1 - stageProgress))) : 0);
    if (stage === 'guess' || stage === 'read') {
      ctx.save();
      const tBadgeW = 95;
      const tBadgeH = 32;
      const tBadgeX = barX + barW - tBadgeW;
      const tBadgeY = barY - 38;
      ctx.fillStyle = '#0284C7';
      ctx.shadowColor = 'rgba(2, 132, 199, 0.5)';
      ctx.shadowBlur = 8;
      drawRoundRect(ctx, tBadgeX, tBadgeY, tBadgeW, tBadgeH, 16);
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 18px "Be Vietnam Pro", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`⏱️ ${remainingSec}s`, tBadgeX + tBadgeW / 2, tBadgeY + tBadgeH / 2 + 1);
      ctx.restore();
    }

    // 7. ANSWER CARD SECTION - WORD SLOT BOXES (O CHU LANDMARK)
    const ansCardY = barY + 42;
    const ansCardH = (stage === 'guess' || stage === 'read') ? 310 : 420;
    const ansCardW = 900;
    const ansCardX = 540 - ansCardW / 2;
    const ansTagY = ansCardY - 22;

    ctx.save();
    ctx.fillStyle = 'rgba(11, 19, 43, 0.95)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 15;
    drawRoundRect(ctx, ansCardX, ansCardY, ansCardW, ansCardH, 40);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    const ansBorderGrad = ctx.createLinearGradient(ansCardX, ansCardY, ansCardX + ansCardW, ansCardY + ansCardH);
    if (stage === 'reveal') {
      ansBorderGrad.addColorStop(0, '#38BDF8');
      ansBorderGrad.addColorStop(1, '#10B981');
    } else {
      ansBorderGrad.addColorStop(0, '#0284C7');
      ansBorderGrad.addColorStop(1, '#0369A1');
    }
    ctx.lineWidth = 5;
    ctx.strokeStyle = ansBorderGrad;
    ctx.stroke();

    // Tag Badge top of Answer Card
    const tagText = (stage === 'guess' || stage === 'read') ? 'ĐÁP ÁN: (Chữ cái đầu & ô chữ ẩn _ _ _)' : '✨ ĐÁP ÁN CHÍNH XÁC!';
    const tagBg = (stage === 'guess' || stage === 'read') ? '#0284C7' : '#10B981';
    const tagW = 680;
    ctx.fillStyle = tagBg;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;
    drawRoundRect(ctx, 540 - tagW / 2, ansTagY, tagW, 48, 24);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 23px "Be Vietnam Pro", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tagText, 540, ansTagY + 25);

    // Letter Slot Boxes (DYNAMIC MULTI-WORD FIT)
    const letters = landmarkName.split('');
    const totalChars = letters.length;
    const maxContainerW = 820;

    let slotW = Math.min(84, Math.max(34, Math.floor(maxContainerW / Math.max(1, totalChars))));
    let slotH = Math.round(slotW * 1.25);
    let slotGap = Math.min(16, Math.max(4, Math.floor((maxContainerW - totalChars * slotW) / Math.max(1, totalChars - 1))));
    if (slotGap < 4) slotGap = 4;

    const totalSlotsW = totalChars * slotW + (totalChars - 1) * slotGap;
    const startSlotX = 540 - totalSlotsW / 2;
    const slotY = ansCardY + 75;

    const revealElapsed = stage === 'reveal' ? stageProgress * REVEAL_TIME : 0;

    letters.forEach((char, i) => {
      const sx = startSlotX + i * (slotW + slotGap);
      const isSpace = char === ' ' || char === '-';
      const isFirstLetterOfWord = i === 0 || (i > 0 && (letters[i - 1] === ' ' || letters[i - 1] === '-'));

      if (isSpace) {
        ctx.fillStyle = '#38BDF8';
        ctx.font = `900 ${Math.round(slotW * 0.6)}px "Be Vietnam Pro", sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('-', sx + slotW / 2, slotY + slotH / 2);
        return;
      }

      ctx.save();
      let boxBg = 'rgba(255, 255, 255, 0.08)';
      let boxBorder = 'rgba(255, 255, 255, 0.25)';
      let charText = '_';
      let charColor = '#38BDF8';

      if (stage === 'guess' || stage === 'read') {
        if (isFirstLetterOfWord) {
          boxBg = '#0284C7';
          boxBorder = '#FFFFFF';
          charText = char;
          charColor = '#FFFFFF';
        } else {
          charText = '_';
          charColor = 'rgba(255, 255, 255, 0.7)';
        }
      } else {
        const letterDelay = i * 0.05;
        const letterPopRaw = Math.max(0, Math.min(1, (revealElapsed - letterDelay) / 0.3));
        const letterPop = easeOutBack(letterPopRaw);

        ctx.translate(sx + slotW / 2, slotY + slotH / 2);
        ctx.scale(0.85 + letterPop * 0.15, 0.85 + letterPop * 0.15);
        ctx.translate(-(sx + slotW / 2), -(slotY + slotH / 2));

        const gGrad = ctx.createLinearGradient(sx, slotY, sx + slotW, slotY + slotH);
        gGrad.addColorStop(0, '#38BDF8');
        gGrad.addColorStop(1, '#10B981');
        boxBg = gGrad;
        boxBorder = '#FFFFFF';
        charText = char;
        charColor = '#FFFFFF';
      }

      ctx.fillStyle = boxBg;
      ctx.shadowColor = (stage === 'reveal' || isFirstLetterOfWord) ? 'rgba(56, 189, 248, 0.6)' : 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = (stage === 'reveal' || isFirstLetterOfWord) ? 16 : 8;
      drawRoundRect(ctx, sx, slotY, slotW, slotH, 18);
      ctx.fill();

      ctx.lineWidth = (stage === 'reveal' || isFirstLetterOfWord) ? 3.5 : 2;
      ctx.strokeStyle = boxBorder;
      ctx.stroke();

      ctx.fillStyle = charColor;
      ctx.font = `900 ${Math.round(slotW * 0.62)}px "Be Vietnam Pro", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(charText, sx + slotW / 2, slotY + slotH / 2 + (charText === '_' ? -4 : 2));
      ctx.restore();
    });

    if (stage === 'reveal') {
      const panelEntrance = easeOutCubic(Math.min(1, revealElapsed / 0.35));
      ctx.save();
      ctx.globalAlpha = panelEntrance;
      const explY = slotY + slotH + 25;
      ctx.fillStyle = '#38BDF8';
      drawWrappedText(ctx, explanationText, 540, explY, 820, 26, '700', FONT_FAMILY, 3, {
        minY: explY - 10,
        maxHeight: 100,
        minFontSize: 18
      });
      ctx.restore();
    }
    ctx.restore();

    // 8. BOTTOM FOOTER CTA BANNER
    const footerW = 920;
    const footerH = 110;
    const footerX = 540 - footerW / 2;
    const footerY = 1720;

    drawDecorationTicks(ctx, footerX - 25, footerY + footerH / 2, '#38BDF8', 1.2, -0.3);
    drawDecorationTicks(ctx, footerX + footerW + 25, footerY + footerH / 2, '#38BDF8', 1.2, 0.3);

    const pulseFactor = Math.sin(globalT * 3.5) * 0.5 + 0.5;

    ctx.save();
    ctx.shadowColor = 'rgba(2, 132, 199, ' + (0.35 + pulseFactor * 0.35) + ')';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 6;

    const footerGrad = ctx.createLinearGradient(footerX, footerY, footerX + footerW, footerY + footerH);
    footerGrad.addColorStop(0, '#0284C7');
    footerGrad.addColorStop(1, '#1E3A8A');
    ctx.fillStyle = footerGrad;
    drawRoundRect(ctx, footerX, footerY, footerW, footerH, 55);
    ctx.fill();

    ctx.lineWidth = 3.5;
    ctx.strokeStyle = '#38BDF8';
    ctx.stroke();
    ctx.restore();

    drawIconThumbsUp(ctx, footerX + 65, footerY + footerH / 2, 24, '#FFFFFF');

    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fillRect(footerX + 130, footerY + 25, 3, footerH - 50);

    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = '900 26px "Be Vietnam Pro", sans-serif';
    ctx.fillText('NHỚ LIKE & THEO DÕI', footerX + 160, footerY + footerH / 2 - 14);

    ctx.font = '700 22px "Be Vietnam Pro", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillText('để khám phá thêm nhiều địa điểm đẹp! ✈️', footerX + 160, footerY + footerH / 2 + 18);

    drawIconHeart(ctx, footerX + footerW - 65, footerY + footerH / 2, 22, '#FFFFFF');
    ctx.restore();

    drawVignette(ctx);
  };

  // Dedicated Canvas Renderer for "⚽ Nhìn Ảnh Đoán Tên Cầu Thủ"
  const drawPlayerGuessCanvasFrame = (ctx, qObj, qIdx, totalQ, stage, timeInQ, stageProgress, theme, currentSet = null) => {
    const safeQObj = qObj || {};
    const targetSet = currentSet || activeSet || {};
    const globalT = performance.now() / 1000;

    const playerName = String(safeQObj.player || safeQObj.word || safeQObj.optionA || safeQObj.question || 'CRISTIANO RONALDO').trim();
    const explanationText = safeQObj.explanation || `${playerName} - Cầu thủ bóng đá vĩ đại!`;
    const topicText = (safeQObj.topic || targetSet.topic || '⚽ ĐOÁN CẦU THỦ').toUpperCase();
    const headerTitleText = (safeQObj.headerTitle || targetSet.headerTitle || 'ĐÂY LÀ CẦU THỦ NÀO?').toUpperCase();

    const GUESS_TIME = settings?.guessTime || 3.0;
    const REVEAL_TIME = 2.0;

    // 1. BACKGROUND: Stadium / Pitch Dark Emerald & Champions League Indigo Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1920);
    bgGrad.addColorStop(0, '#06281E'); // Dark Stadium Pitch Green
    bgGrad.addColorStop(0.5, '#0B3C2D'); // Rich Grass Emerald
    bgGrad.addColorStop(1, '#021A12'); // Deep Night Stadium
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1920);

    // Warm Stadium Glow Orbs
    drawAmbientGlowOrbs(ctx, globalT, { accent: '#00E676', accent2: '#FFD700' });

    // Floating Background Golden & Green Sparkles
    particlesRef.current.forEach((p, pi) => {
      p.x += p.vx * 0.8;
      p.y += p.vy * 0.8;
      if (p.x < 0 || p.x > 1080) p.vx *= -1;
      if (p.y < 0 || p.y > 1920) p.vy *= -1;

      const twinkle = 0.2 + (Math.sin(globalT * 1.8 + pi) * 0.5 + 0.5) * 0.3;
      ctx.save();
      ctx.globalAlpha = twinkle;
      drawIconSparkle(ctx, p.x, p.y, p.radius * 1.3, '#FFD700', globalT * 1.2 + pi);
      ctx.restore();
    });

    // Screen Border Frame Overlay
    ctx.save();
    ctx.lineWidth = 14;
    ctx.strokeStyle = 'rgba(0, 230, 118, 0.75)'; // Neon Pitch Green
    drawRoundRect(ctx, 10, 10, 1060, 1900, 44);
    ctx.stroke();
    ctx.restore();

    // 2. TOP LEFT BADGE: "⚽ ĐOÁN CẦU THỦ"
    let fontPx = 36;
    ctx.font = `900 ${fontPx}px "Be Vietnam Pro", sans-serif`;
    let measuredW = ctx.measureText(topicText).width;
    while (fontPx > 20 && measuredW > 440) {
      fontPx -= 2;
      ctx.font = `900 ${fontPx}px "Be Vietnam Pro", sans-serif`;
      measuredW = ctx.measureText(topicText).width;
    }

    const badgeH = 84;
    const badgePaddingX = 36;
    const badgeW = Math.max(280, Math.min(520, measuredW + badgePaddingX * 2));
    const badgeX = 45 + badgeW / 2;
    const badgeY = 105;

    drawDecorationTicks(ctx, badgeX - badgeW / 2 + 25, badgeY - 5, '#FFD700', 1.2, -0.4);
    drawDecorationTicks(ctx, badgeX + badgeW / 2 - 25, badgeY - 5, '#FFD700', 1.2, 0.4);

    ctx.save();
    ctx.translate(badgeX, badgeY);
    ctx.rotate(-0.02);

    ctx.shadowColor = 'rgba(0, 230, 118, 0.55)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 8;

    const badgeGrad = ctx.createLinearGradient(-badgeW / 2, 0, badgeW / 2, 0);
    badgeGrad.addColorStop(0, '#00C853'); // Vibrant Stadium Green
    badgeGrad.addColorStop(1, '#00E676');
    ctx.fillStyle = badgeGrad;
    drawRoundRect(ctx, -badgeW / 2, -badgeH / 2, badgeW, badgeH, 42);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.fillStyle = '#FFFFFF';
    ctx.font = `900 ${fontPx}px "Be Vietnam Pro", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(topicText, 0, 2);
    ctx.restore();

    // 3. TOP RIGHT MASCOT LOGO
    drawMascotLogo(ctx, 970, 100, 65, (logoImgRef && logoImgRef.current) || getLoadedImage('/logo2.png'));

    // 4. SUB-HEADER PILL: "ĐÂY LÀ CẦU THỦ NÀO? ➔"
    let subFontPx = 26;
    ctx.font = `900 ${subFontPx}px "Be Vietnam Pro", sans-serif`;
    let subMeasuredW = ctx.measureText(headerTitleText).width;

    const headerW = Math.max(380, Math.min(700, subMeasuredW + 110));
    const headerH = 68;
    const headerX = 540 - headerW / 2;
    const headerY = 220;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 6;
    ctx.fillStyle = '#FFFFFF';
    drawRoundRect(ctx, headerX, headerY, headerW, headerH, 34);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.fillStyle = '#064E3B';
    ctx.font = `900 ${subFontPx}px "Be Vietnam Pro", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const textCenterX = headerX + (headerW - 60) / 2;
    ctx.fillText(headerTitleText, textCenterX, headerY + headerH / 2 + 1);

    const arrowCircleX = headerX + headerW - 38;
    const arrowCircleY = headerY + headerH / 2;
    ctx.fillStyle = '#047857';
    ctx.beginPath();
    ctx.arc(arrowCircleX, arrowCircleY, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px "Be Vietnam Pro", sans-serif';
    ctx.fillText('➔', arrowCircleX, arrowCircleY + 1);
    ctx.restore();

    // 5. MAIN HERO PLAYER IMAGE SHOWCASE CARD (SUPER SIZED HD SHOWCASE 860x480)
    const imgW = 860;
    const imgH = 480;
    const imgX = 540 - imgW / 2;
    const imgY = 305;

    drawDecorationTicks(ctx, 45, imgY + imgH / 2, '#FFD700', 1.2, -0.6);
    drawDecorationTicks(ctx, 1035, imgY + imgH / 2, '#FFD700', 1.2, 0.6);

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 10;
    ctx.fillStyle = '#FFFFFF';
    drawRoundRect(ctx, imgX - 8, imgY - 8, imgW + 16, imgH + 16, 30);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.lineWidth = 4;
    ctx.strokeStyle = '#00E676';
    ctx.stroke();
    ctx.restore();

    // Render Player Image
    const playerImgObj = safeQObj.image ? getLoadedImage(safeQObj.image) : null;
    if (playerImgObj) {
      ctx.save();
      drawRoundRect(ctx, imgX, imgY, imgW, imgH, 24);
      ctx.clip();
      drawFitImage(ctx, playerImgObj, imgX, imgY, imgW, imgH, { progress: stageProgress, qIdx: qIdx, kenBurns: settings?.imageMotion === true, containFit: true });
      ctx.restore();
    } else {
      ctx.save();
      drawRoundRect(ctx, imgX, imgY, imgW, imgH, 24);
      ctx.fillStyle = '#ECFDF5';
      ctx.fill();
      ctx.fillStyle = '#047857';
      ctx.font = 'bold 36px "Be Vietnam Pro", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('⚽ HÌNH ẢNH CẦU THỦ', 540, imgY + imgH / 2);
      ctx.restore();
    }

    // Yellow Swoosh Underline below image
    const swooshY = imgY + imgH + 20;
    ctx.save();
    ctx.fillStyle = '#FFD700';
    ctx.shadowColor = 'rgba(255, 215, 0, 0.6)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.ellipse(540, swooshY, 260, 9, -0.02, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 6. GREEN COUNTDOWN TIMER BAR & BADGE (3s)
    const barW = 540;
    const barH = 16;
    const barX = 540 - barW / 2;
    const barY = swooshY + 22; // ~694

    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    drawRoundRect(ctx, barX, barY, barW, barH, 8);
    ctx.fill();

    const fillPercent = stage === 'read' ? 1.0 : (stage === 'guess' ? Math.max(0, 1 - stageProgress) : 0);
    const currentBarW = Math.max(0, barW * fillPercent);
    if (currentBarW > 0) {
      const greenGrad = ctx.createLinearGradient(barX, 0, barX + currentBarW, 0);
      greenGrad.addColorStop(0, '#00E676');
      greenGrad.addColorStop(1, '#00C853');
      ctx.fillStyle = greenGrad;
      ctx.shadowColor = 'rgba(0, 230, 118, 0.7)';
      ctx.shadowBlur = 10;
      drawRoundRect(ctx, barX, barY, currentBarW, barH, 8);
      ctx.fill();
    }
    ctx.restore();

    // 6b. TIMER SECONDS BADGE (⏱️ 3s)
    const currentGuessDuration = GUESS_TIME;
    const remainingSec = stage === 'read' ? Math.ceil(currentGuessDuration) : (stage === 'guess' ? Math.max(0, Math.ceil(currentGuessDuration * (1 - stageProgress))) : 0);
    if (stage === 'guess' || stage === 'read') {
      ctx.save();
      const tBadgeW = 95;
      const tBadgeH = 32;
      const tBadgeX = barX + barW - tBadgeW;
      const tBadgeY = barY - 38;
      ctx.fillStyle = '#00C853';
      ctx.shadowColor = 'rgba(0, 200, 83, 0.5)';
      ctx.shadowBlur = 8;
      drawRoundRect(ctx, tBadgeX, tBadgeY, tBadgeW, tBadgeH, 16);
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 18px "Be Vietnam Pro", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`⏱️ ${remainingSec}s`, tBadgeX + tBadgeW / 2, tBadgeY + tBadgeH / 2 + 1);
      ctx.restore();
    }

    // 7. ANSWER CARD SECTION - WORD SLOT BOXES (O CHU C________ R______)
    const ansCardY = barY + 40;
    const ansCardH = (stage === 'guess' || stage === 'read') ? 310 : 420;
    const ansCardW = 900;
    const ansCardX = 540 - ansCardW / 2;
    const ansTagY = ansCardY - 22;

    ctx.save();
    ctx.fillStyle = 'rgba(4, 30, 22, 0.95)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 15;
    drawRoundRect(ctx, ansCardX, ansCardY, ansCardW, ansCardH, 40);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    const ansBorderGrad = ctx.createLinearGradient(ansCardX, ansCardY, ansCardX + ansCardW, ansCardY + ansCardH);
    if (stage === 'reveal') {
      ansBorderGrad.addColorStop(0, '#00E676');
      ansBorderGrad.addColorStop(1, '#00C2FF');
    } else {
      ansBorderGrad.addColorStop(0, '#00E676');
      ansBorderGrad.addColorStop(1, '#FFD700');
    }
    ctx.lineWidth = 5;
    ctx.strokeStyle = ansBorderGrad;
    ctx.stroke();

    // Tag Badge top of Answer Card
    const tagText = (stage === 'guess' || stage === 'read') ? 'ĐÁP ÁN: (Ký tự đầu & ô chữ ẩn _ _ _)' : '✨ ĐÁP ÁN CHÍNH XÁC!';
    const tagBg = (stage === 'guess' || stage === 'read') ? '#FF9800' : '#00E676';
    const tagW = 680;
    ctx.fillStyle = tagBg;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;
    drawRoundRect(ctx, 540 - tagW / 2, ansTagY, tagW, 48, 24);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 23px "Be Vietnam Pro", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tagText, 540, ansTagY + 25);

    // Letter Slot Boxes (DYNAMIC MULTI-WORD FIT)
    const upperPlayerName = playerName.toUpperCase();
    const letters = upperPlayerName.split('');
    const totalChars = letters.length;
    const maxContainerW = 820;

    let slotW = Math.min(84, Math.max(34, Math.floor(maxContainerW / Math.max(1, totalChars))));
    let slotH = Math.round(slotW * 1.25);
    let slotGap = Math.min(16, Math.max(4, Math.floor((maxContainerW - totalChars * slotW) / Math.max(1, totalChars - 1))));
    if (slotGap < 4) slotGap = 4;

    const totalSlotsW = totalChars * slotW + (totalChars - 1) * slotGap;
    const startSlotX = 540 - totalSlotsW / 2;
    const slotY = ansCardY + 75;

    const revealElapsed = stage === 'reveal' ? stageProgress * REVEAL_TIME : 0;

    letters.forEach((char, i) => {
      const sx = startSlotX + i * (slotW + slotGap);
      const isSpace = char === ' ' || char === '-';
      const isFirstLetterOfWord = i === 0 || (i > 0 && (letters[i - 1] === ' ' || letters[i - 1] === '-'));

      if (isSpace) {
        ctx.fillStyle = '#FFD700';
        ctx.font = `900 ${Math.round(slotW * 0.6)}px "Be Vietnam Pro", sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('-', sx + slotW / 2, slotY + slotH / 2);
        return;
      }

      ctx.save();
      let boxBg = 'rgba(255, 255, 255, 0.08)';
      let boxBorder = 'rgba(255, 255, 255, 0.25)';
      let charText = '_';
      let charColor = '#FFD700';

      if (stage === 'guess' || stage === 'read') {
        if (isFirstLetterOfWord) {
          boxBg = '#00C853';
          boxBorder = '#FFFFFF';
          charText = char;
          charColor = '#FFFFFF';
        } else {
          charText = '_';
          charColor = 'rgba(255, 255, 255, 0.7)';
        }
      } else {
        const letterDelay = i * 0.05;
        const letterPopRaw = Math.max(0, Math.min(1, (revealElapsed - letterDelay) / 0.3));
        const letterPop = easeOutBack(letterPopRaw);

        ctx.translate(sx + slotW / 2, slotY + slotH / 2);
        ctx.scale(0.85 + letterPop * 0.15, 0.85 + letterPop * 0.15);
        ctx.translate(-(sx + slotW / 2), -(slotY + slotH / 2));

        const gGrad = ctx.createLinearGradient(sx, slotY, sx + slotW, slotY + slotH);
        gGrad.addColorStop(0, '#00E676');
        gGrad.addColorStop(1, '#00C2FF');
        boxBg = gGrad;
        boxBorder = '#FFFFFF';
        charText = char;
        charColor = '#FFFFFF';
      }

      ctx.fillStyle = boxBg;
      ctx.shadowColor = (stage === 'reveal' || isFirstLetterOfWord) ? 'rgba(0, 230, 118, 0.6)' : 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = (stage === 'reveal' || isFirstLetterOfWord) ? 16 : 8;
      drawRoundRect(ctx, sx, slotY, slotW, slotH, 18);
      ctx.fill();

      ctx.lineWidth = (stage === 'reveal' || isFirstLetterOfWord) ? 3.5 : 2;
      ctx.strokeStyle = boxBorder;
      ctx.stroke();

      ctx.fillStyle = charColor;
      ctx.font = `900 ${Math.round(slotW * 0.62)}px "Be Vietnam Pro", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(charText, sx + slotW / 2, slotY + slotH / 2 + (charText === '_' ? -4 : 2));
      ctx.restore();
    });

    if (stage === 'reveal') {
      const panelEntrance = easeOutCubic(Math.min(1, revealElapsed / 0.35));
      ctx.save();
      ctx.globalAlpha = panelEntrance;
      const explY = slotY + slotH + 25;
      ctx.fillStyle = '#FFD700';
      drawWrappedText(ctx, explanationText, 540, explY, 820, 26, '700', FONT_FAMILY, 3, {
        minY: explY - 10,
        maxHeight: 100,
        minFontSize: 18
      });
      ctx.restore();
    }
    ctx.restore();

    // 8. BOTTOM FOOTER CTA BANNER
    const footerW = 920;
    const footerH = 110;
    const footerX = 540 - footerW / 2;
    const footerY = 1720;

    drawDecorationTicks(ctx, footerX - 25, footerY + footerH / 2, '#FFD700', 1.2, -0.3);
    drawDecorationTicks(ctx, footerX + footerW + 25, footerY + footerH / 2, '#FFD700', 1.2, 0.3);

    const pulseFactor = Math.sin(globalT * 4) * 0.5 + 0.5;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 230, 118, ' + (0.35 + pulseFactor * 0.35) + ')';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 6;

    const footerGrad = ctx.createLinearGradient(footerX, footerY, footerX + footerW, footerY + footerH);
    footerGrad.addColorStop(0, '#00C853');
    footerGrad.addColorStop(1, '#047857');
    ctx.fillStyle = footerGrad;
    drawRoundRect(ctx, footerX, footerY, footerW, footerH, 55);
    ctx.fill();

    ctx.lineWidth = 3.5;
    ctx.strokeStyle = '#69F0AE';
    ctx.stroke();
    ctx.restore();

    drawIconThumbsUp(ctx, footerX + 65, footerY + footerH / 2, 24, '#FFFFFF');

    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fillRect(footerX + 130, footerY + 25, 3, footerH - 50);

    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = '900 26px "Be Vietnam Pro", sans-serif';
    ctx.fillText('NHỚ LIKE & THEO DÕI', footerX + 160, footerY + footerH / 2 - 14);

    ctx.font = '700 22px "Be Vietnam Pro", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillText('để khám phá thêm nhiều siêu sao bóng đá! ⚽', footerX + 160, footerY + footerH / 2 + 18);

    drawIconHeart(ctx, footerX + footerW - 65, footerY + footerH / 2, 22, '#FFFFFF');
    ctx.restore();

    drawVignette(ctx);
  };

  // Dedicated Canvas Renderer for "🎀 Video Từ Vựng Lingo BiBi (4 Đáp Án + Nền Ảnh)"
  const drawLingoBiBiVocab4OptionsCanvasFrame = (ctx, qObj, qIdx, totalQ, stage, timeInQ, stageProgress, theme, currentSet = null) => {
    const safeQObj = qObj || {};
    const targetSet = currentSet || activeSet || {};
    const globalT = performance.now() / 1000;

    const vietnameseWord = String(safeQObj.question || safeQObj.wordVi || safeQObj.word || 'Con mèo con').trim();
    const englishWord = String(safeQObj.word || safeQObj.optionA || 'Kitten').trim();
    const ipaText = String(safeQObj.ipa || '/ˈkɪt.ən/').trim();
    const explanationText = safeQObj.explanation || `${englishWord}: ${vietnameseWord}`;
    const topicText = (safeQObj.topic || targetSet.topic || 'LINGO BIBI').toUpperCase();
    const headerTitleText = (safeQObj.headerTitle || targetSet.headerTitle || 'CHỌN ĐÁP ÁN ĐÚNG').toUpperCase();
    const correctOptionKey = (safeQObj.correctOption || 'A').toUpperCase();

    // 4 Options A, B, C, D
    const optionA = String(safeQObj.optionA || 'Kitten').trim();
    const optionB = String(safeQObj.optionB || 'Puppy').trim();
    const optionC = String(safeQObj.optionC || 'Bunny').trim();
    const optionD = String(safeQObj.optionD || 'Hamster').trim();
    const options = [
      { key: 'A', text: optionA },
      { key: 'B', text: optionB },
      { key: 'C', text: optionC },
      { key: 'D', text: optionD }
    ];

    const GUESS_TIME = settings?.guessTime || 3.0;

    // 1. BACKGROUND: Vocabulary Image + Soft Pink / Purple Dark Gradient Overlay
    const imageUrl = safeQObj.image || '';
    if (imageUrl) {
      loadCorsCleanImage(imageUrl);
      const loadedImg = getLoadedImage(imageUrl);
      if (loadedImg && !loadedImg.isError) {
        ctx.save();
        // Gentle zoom motion (Ken Burns effect)
        const scale = 1.05 + Math.sin(globalT * 0.5) * 0.03;
        const imgW = 1080 * scale;
        const imgH = 1920 * scale;
        const imgX = (1080 - imgW) / 2;
        const imgY = (1920 - imgH) / 2;
        ctx.drawImage(loadedImg, imgX, imgY, imgW, imgH);
        ctx.restore();
      }
    }

    // Translucent Tint & Vignette Gradient Overlay for maximum text contrast & readability
    const bgOverlay = ctx.createLinearGradient(0, 0, 0, 1920);
    bgOverlay.addColorStop(0, 'rgba(45, 10, 30, 0.88)'); // Dark Plum / Pink Top
    bgOverlay.addColorStop(0.35, 'rgba(25, 8, 25, 0.82)');
    bgOverlay.addColorStop(0.75, 'rgba(18, 5, 22, 0.90)');
    bgOverlay.addColorStop(1, 'rgba(12, 3, 16, 0.96)'); // Near Black Bottom
    ctx.fillStyle = bgOverlay;
    ctx.fillRect(0, 0, 1080, 1920);

    // Soft Cute Pink Ambient Glow Orbs
    drawAmbientGlowOrbs(ctx, globalT, { accent: '#FF4081', accent2: '#F48FB1' });

    // Floating Sparkles & Heart Stars
    particlesRef.current.forEach((p, pi) => {
      p.x += p.vx * 0.7;
      p.y += p.vy * 0.7;
      if (p.x < 0 || p.x > 1080) p.vx *= -1;
      if (p.y < 0 || p.y > 1920) p.vy *= -1;

      const twinkle = 0.2 + (Math.sin(globalT * 2.0 + pi) * 0.5 + 0.5) * 0.35;
      ctx.save();
      ctx.globalAlpha = twinkle;
      drawIconSparkle(ctx, p.x, p.y, p.radius * 1.3, '#FF80AB', globalT * 1.2 + pi);
      ctx.restore();
    });

    // Screen Border Frame Overlay (Cute Pink Neon)
    ctx.save();
    ctx.lineWidth = 12;
    ctx.strokeStyle = 'rgba(255, 64, 129, 0.70)';
    drawRoundRect(ctx, 12, 12, 1056, 1896, 44);
    ctx.stroke();
    ctx.restore();

    // 2. TOP HEADER BADGE: "🎀 LINGO BIBI - TỪ VỰNG TIẾNG ANH"
    let fontPx = 32;
    ctx.font = `900 ${fontPx}px "Be Vietnam Pro", sans-serif`;
    let measuredW = ctx.measureText(topicText).width;
    while (fontPx > 20 && measuredW > 440) {
      fontPx -= 2;
      ctx.font = `900 ${fontPx}px "Be Vietnam Pro", sans-serif`;
      measuredW = ctx.measureText(topicText).width;
    }

    const badgeH = 80;
    const badgePaddingX = 36;
    const badgeW = Math.max(300, Math.min(540, measuredW + badgePaddingX * 2));
    const badgeX = 45 + badgeW / 2;
    const badgeY = 100;

    drawDecorationTicks(ctx, badgeX - badgeW / 2 + 25, badgeY - 5, '#FF80AB', 1.2, -0.4);
    drawDecorationTicks(ctx, badgeX + badgeW / 2 - 25, badgeY - 5, '#FF80AB', 1.2, 0.4);

    ctx.save();
    ctx.translate(badgeX, badgeY);
    ctx.rotate(-0.015);

    ctx.shadowColor = 'rgba(255, 64, 129, 0.6)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 8;

    const badgeGrad = ctx.createLinearGradient(-badgeW / 2, 0, badgeW / 2, 0);
    badgeGrad.addColorStop(0, '#FF4081'); // Vibrant Lingo Pink
    badgeGrad.addColorStop(1, '#EC407A');
    ctx.fillStyle = badgeGrad;
    drawRoundRect(ctx, -badgeW / 2, -badgeH / 2, badgeW, badgeH, 40);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.fillStyle = '#FFFFFF';
    ctx.font = `900 ${fontPx}px "Be Vietnam Pro", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`🎀 ${topicText}`, 0, 2);
    ctx.restore();

    // 3. TOP RIGHT MASCOT LOGO (Lingo BiBi)
    const logoImg = (logoImgRef && logoImgRef.current) || getLoadedImage('/logo_lingo_bibi.png') || getLoadedImage('/logo2.png');
    drawMascotLogo(ctx, 970, 95, 65, logoImg);

    // 4. SUB-HEADER PILL: "CHỌN ĐÁP ÁN ĐÚNG ➔"
    let subFontPx = 25;
    ctx.font = `900 ${subFontPx}px "Be Vietnam Pro", sans-serif`;
    let subMeasuredW = ctx.measureText(headerTitleText).width;

    const headerW = Math.max(380, Math.min(680, subMeasuredW + 110));
    const headerH = 64;
    const headerX = 540 - headerW / 2;
    const headerY = 210;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 5;
    ctx.fillStyle = '#FFFFFF';
    drawRoundRect(ctx, headerX, headerY, headerW, headerH, 32);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.fillStyle = '#880E4F';
    ctx.font = `900 ${subFontPx}px "Be Vietnam Pro", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const textCenterX = headerX + (headerW - 50) / 2;
    ctx.fillText(headerTitleText, textCenterX, headerY + headerH / 2 + 1);

    const arrowCircleX = headerX + headerW - 36;
    const arrowCircleY = headerY + headerH / 2;
    ctx.fillStyle = '#C2185B';
    ctx.beginPath();
    ctx.arc(arrowCircleX, arrowCircleY, 17, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px "Be Vietnam Pro", sans-serif';
    ctx.fillText('➔', arrowCircleX, arrowCircleY + 1);
    ctx.restore();

    // 5. MAIN VOCABULARY IMAGE FRAME (Y: 295 - 835)
    const imgFrameW = 860;
    const imgFrameH = 540;
    const imgFrameX = 540 - imgFrameW / 2;
    const imgFrameY = 295;

    ctx.save();
    ctx.shadowColor = 'rgba(255, 64, 129, 0.45)';
    ctx.shadowBlur = 26;
    ctx.shadowOffsetY = 10;
    ctx.fillStyle = '#1A0826';
    drawRoundRect(ctx, imgFrameX, imgFrameY, imgFrameW, imgFrameH, 36);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    // Draw central vocabulary picture cleanly inside rounded frame
    if (imageUrl) {
      const loadedImg = getLoadedImage(imageUrl);
      if (loadedImg && !loadedImg.isError) {
        ctx.save();
        ctx.beginPath();
        drawRoundRect(ctx, imgFrameX, imgFrameY, imgFrameW, imgFrameH, 36);
        ctx.clip();

        // Calculate aspect cover ratio
        const iw = loadedImg.naturalWidth || loadedImg.width || 800;
        const ih = loadedImg.naturalHeight || loadedImg.height || 600;
        const scale = Math.max(imgFrameW / iw, imgFrameH / ih);
        const nw = iw * scale;
        const nh = ih * scale;
        const nx = imgFrameX + (imgFrameW - nw) / 2;
        const ny = imgFrameY + (imgFrameH - nh) / 2;
        ctx.drawImage(loadedImg, nx, ny, nw, nh);
        ctx.restore();
      }
    }

    // Outer Neon Border
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#FF80AB';
    drawRoundRect(ctx, imgFrameX, imgFrameY, imgFrameW, imgFrameH, 36);
    ctx.stroke();
    ctx.restore();

    // 6. VIETNAMESE WORD CARD (Y: 855 - 975)
    const viCardW = 880;
    const viCardH = 115;
    const viCardX = 540 - viCardW / 2;
    const viCardY = 855;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 6;

    const viGrad = ctx.createLinearGradient(viCardX, viCardY, viCardX + viCardW, viCardY + viCardH);
    viGrad.addColorStop(0, '#FFFFFF');
    viGrad.addColorStop(1, '#FFF5F8');
    ctx.fillStyle = viGrad;
    drawRoundRect(ctx, viCardX, viCardY, viCardW, viCardH, 32);
    ctx.fill();

    ctx.lineWidth = 3.5;
    ctx.strokeStyle = '#FF80AB';
    ctx.stroke();
    ctx.restore();

    // Flag badge 🇻🇳
    ctx.save();
    ctx.font = '36px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🇻🇳', viCardX + 60, viCardY + viCardH / 2);

    // Vietnamese Word Text
    ctx.font = '900 44px "Be Vietnam Pro", sans-serif';
    ctx.fillStyle = '#880E4F';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(vietnameseWord, viCardX + viCardW / 2, viCardY + viCardH / 2);

    // Speaker Sound Icon for Vietnamese TTS
    const isQuestionSpeaking = stage === 'read';
    const waveAlpha = isQuestionSpeaking ? (0.5 + Math.sin(globalT * 10) * 0.5) : 0.8;
    ctx.save();
    ctx.globalAlpha = waveAlpha;
    ctx.font = '30px "Segoe UI Emoji", sans-serif';
    ctx.fillText('🔊', viCardX + viCardW - 60, viCardY + viCardH / 2);
    ctx.restore();
    ctx.restore();

    // 7. 3-SECOND PROGRESS BAR (Y: 985 - 1020)
    const barW = 880;
    const barH = 24;
    const barX = 540 - barW / 2;
    const barY = 988;

    ctx.save();
    // Bar Track Background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    drawRoundRect(ctx, barX, barY, barW, barH, 12);
    ctx.fill();

    let fillRatio = 1.0;
    if (stage === 'read') {
      fillRatio = 1.0;
    } else if (stage === 'guess') {
      const guessTimeRemaining = Math.max(0, GUESS_TIME * (1 - stageProgress));
      fillRatio = guessTimeRemaining / GUESS_TIME;
    } else {
      fillRatio = 0.0;
    }

    const filledW = Math.max(0, barW * fillRatio);
    if (filledW > 0) {
      const fillGrad = ctx.createLinearGradient(barX, barY, barX + filledW, barY);
      fillGrad.addColorStop(0, '#FF4081');
      fillGrad.addColorStop(1, '#FFD54F');
      ctx.fillStyle = fillGrad;
      drawRoundRect(ctx, barX, barY, filledW, barH, 12);
      ctx.fill();
    }

    // Countdown Badge Text next to progress bar
    let timerText = '⏱️ 3s';
    if (stage === 'guess') {
      const remainingSec = Math.max(1, Math.ceil(GUESS_TIME * (1 - stageProgress)));
      timerText = `⏳ ${remainingSec}s`;
    } else if (stage === 'reveal') {
      timerText = '✅ ĐÁP ÁN!';
    }
    ctx.font = '800 22px "Be Vietnam Pro", sans-serif';
    ctx.fillStyle = '#FF80AB';
    ctx.textAlign = 'right';
    ctx.fillText(timerText, barX + barW, barY - 10);
    ctx.restore();

    // 8. 4 ENGLISH OPTIONS GRID (A, B, C, D) (Y: 1040 - 1580)
    const optionW = 880;
    const optionH = 115;
    const optionGap = 20;
    const startOptY = 1045;

    options.forEach((opt, idx) => {
      const optY = startOptY + idx * (optionH + optionGap);
      const optX = 540 - optionW / 2;
      const isCorrect = opt.key === correctOptionKey;

      let cardBgGrad;
      let strokeColor = 'rgba(255, 255, 255, 0.4)';
      let textColor = '#FFFFFF';
      let badgeBg = '#FF4081';
      let badgeTextColor = '#FFFFFF';
      let cardAlpha = 1.0;
      let scaleFactor = 1.0;

      if (stage === 'reveal') {
        if (isCorrect) {
          // Glowing Emerald Green for Correct Answer
          scaleFactor = 1.03 + Math.sin(globalT * 6) * 0.015;
          strokeColor = '#00E676';
          badgeBg = '#00E676';
          badgeTextColor = '#003311';
          textColor = '#FFFFFF';
        } else {
          // Dimmed for incorrect choices
          cardAlpha = 0.50;
          strokeColor = 'rgba(255, 255, 255, 0.15)';
        }
      }

      ctx.save();
      ctx.globalAlpha = cardAlpha;

      if (stage === 'reveal' && isCorrect) {
        ctx.translate(540, optY + optionH / 2);
        ctx.scale(scaleFactor, scaleFactor);
        ctx.translate(-540, -(optY + optionH / 2));

        ctx.shadowColor = 'rgba(0, 230, 118, 0.75)';
        ctx.shadowBlur = 28;

        const greenGrad = ctx.createLinearGradient(optX, optY, optX + optionW, optY + optionH);
        greenGrad.addColorStop(0, '#00C853');
        greenGrad.addColorStop(1, '#00E676');
        cardBgGrad = greenGrad;
      } else {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 14;
        ctx.shadowOffsetY = 4;

        const normalGrad = ctx.createLinearGradient(optX, optY, optX + optionW, optY + optionH);
        normalGrad.addColorStop(0, 'rgba(255, 255, 255, 0.18)');
        normalGrad.addColorStop(1, 'rgba(255, 255, 255, 0.08)');
        cardBgGrad = normalGrad;
      }

      ctx.fillStyle = cardBgGrad;
      drawRoundRect(ctx, optX, optY, optionW, optionH, 28);
      ctx.fill();

      ctx.lineWidth = stage === 'reveal' && isCorrect ? 4.5 : 2.5;
      ctx.strokeStyle = strokeColor;
      ctx.stroke();

      // Left Option Circle Badge (A, B, C, D)
      const badgeCircleX = optX + 60;
      const badgeCircleY = optY + optionH / 2;
      ctx.fillStyle = badgeBg;
      ctx.beginPath();
      ctx.arc(badgeCircleX, badgeCircleY, 26, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = badgeTextColor;
      ctx.font = '900 28px "Be Vietnam Pro", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(opt.key, badgeCircleX, badgeCircleY + 1);

      // Option Text (English Word)
      ctx.fillStyle = textColor;
      ctx.font = '800 34px "Be Vietnam Pro", sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(opt.text, optX + 115, optY + optionH / 2 + 1);

      // Right Checkmark Icon ✅ if correct answer revealed
      if (stage === 'reveal' && isCorrect) {
        ctx.font = '36px "Segoe UI Emoji", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('✅', optX + optionW - 60, optY + optionH / 2);
      }

      ctx.restore();
    });

    // 9. REVEAL CALLOUT & ENGLISH PRONUNCIATION (Y: 1595 - 1730)
    if (stage === 'reveal') {
      const revealEntrance = Math.min(1, stageProgress / 0.3);
      ctx.save();
      ctx.globalAlpha = revealEntrance;

      const calloutW = 880;
      const calloutH = 110;
      const calloutX = 540 - calloutW / 2;
      const calloutY = 1595;

      const calloutGrad = ctx.createLinearGradient(calloutX, calloutY, calloutX + calloutW, calloutY + calloutH);
      calloutGrad.addColorStop(0, '#880E4F');
      calloutGrad.addColorStop(1, '#AD1457');
      ctx.fillStyle = calloutGrad;
      drawRoundRect(ctx, calloutX, calloutY, calloutW, calloutH, 30);
      ctx.fill();

      ctx.lineWidth = 3;
      ctx.strokeStyle = '#FF80AB';
      ctx.stroke();

      // Speaker icon & English word + IPA
      ctx.font = '32px "Segoe UI Emoji", sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('🔊', calloutX + 35, calloutY + calloutH / 2);

      ctx.font = '900 36px "Be Vietnam Pro", sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(englishWord, calloutX + 90, calloutY + calloutH / 2 - 12);

      ctx.font = '600 24px "Be Vietnam Pro", sans-serif';
      ctx.fillStyle = '#FF80AB';
      ctx.fillText(`${ipaText} • ${explanationText}`, calloutX + 90, calloutY + calloutH / 2 + 20);

      ctx.restore();
    }

    // 10. BOTTOM FOOTER CTA BANNER (Y: 1755 - 1865)
    const footerW = 900;
    const footerH = 100;
    const footerX = 540 - footerW / 2;
    const footerY = 1755;

    ctx.save();
    ctx.shadowColor = 'rgba(255, 64, 129, 0.4)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 6;

    const footerGrad = ctx.createLinearGradient(footerX, footerY, footerX + footerW, footerY + footerH);
    footerGrad.addColorStop(0, '#C2185B');
    footerGrad.addColorStop(1, '#880E4F');
    ctx.fillStyle = footerGrad;
    drawRoundRect(ctx, footerX, footerY, footerW, footerH, 50);
    ctx.fill();

    ctx.lineWidth = 3;
    ctx.strokeStyle = '#FF80AB';
    ctx.stroke();
    ctx.restore();

    drawIconThumbsUp(ctx, footerX + 55, footerY + footerH / 2, 22, '#FFFFFF');

    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(footerX + 115, footerY + 22, 3, footerH - 44);

    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = '900 24px "Be Vietnam Pro", sans-serif';
    ctx.fillText('ĐĂNG KÝ KÊNH LINGO BIBI 💖', footerX + 140, footerY + footerH / 2 - 12);

    ctx.font = '700 20px "Be Vietnam Pro", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText('để học thêm hàng nghìn từ vựng hay! 🔔', footerX + 140, footerY + footerH / 2 + 16);

    drawIconHeart(ctx, footerX + footerW - 55, footerY + footerH / 2, 20, '#FF80AB');
    ctx.restore();

    drawVignette(ctx);
  };

  // Draw Frame Logic for 1080x1920 Canvas
  const drawCanvasFrame = (ctx, qObj, qIdx, totalQ, stage, timeInQ, stageProgress, theme, currentSet = null) => {
    ctx.save();
    ctx.clearRect(0, 0, 1080, 1920);

    const targetSet = currentSet || activeSet;

    const isLingoBiBiVocab4OptionsMode = (qObj && (qObj.mode === 'vocab-lingobibi-mcq' || qObj.mode === 'lingobibi-mcq')) ||
      (targetSet && (targetSet.mode === 'vocab-lingobibi-mcq' || targetSet.id === 'vocab-b1-word-guess-lingobibi' || targetSet.mode === 'lingobibi-mcq')) ||
      (theme && (theme.id === 'vocab-lingobibi-mcq' || theme.id === 'vocab-b1-word-guess-lingobibi'));

    if (isLingoBiBiVocab4OptionsMode) {
      drawLingoBiBiVocab4OptionsCanvasFrame(ctx, qObj, qIdx, totalQ, stage, timeInQ, stageProgress, theme, currentSet);
      ctx.restore();
      return;
    }

    const isPlayerGuessMode = (qObj && (qObj.mode === 'player-guess' || qObj.mode === 'player')) ||
      (targetSet && (targetSet.mode === 'player-guess' || targetSet.id === 'player-guess')) ||
      (theme && (theme.id === 'player-guess' || theme.id === 'player'));

    if (isPlayerGuessMode) {
      drawPlayerGuessCanvasFrame(ctx, qObj, qIdx, totalQ, stage, timeInQ, stageProgress, theme, currentSet);
      ctx.restore();
      return;
    }

    const isLandmarkGuessMode = (qObj && (qObj.mode === 'landmark-guess' || qObj.mode === 'place-guess')) ||
      (targetSet && (targetSet.mode === 'landmark-guess' || targetSet.id === 'landmark-guess')) ||
      (theme && theme.id === 'landmark-guess');

    if (isLandmarkGuessMode) {
      drawLandmarkGuessCanvasFrame(ctx, qObj, qIdx, totalQ, stage, timeInQ, stageProgress, theme, currentSet);
      ctx.restore();
      return;
    }

    const isFoodGuessMode = (qObj && (qObj.mode === 'food-guess' || qObj.mode === 'dish-guess')) ||
      (targetSet && (targetSet.mode === 'food-guess' || targetSet.id === 'food-guess')) ||
      (theme && theme.id === 'food-guess');

    if (isFoodGuessMode) {
      drawFoodGuessCanvasFrame(ctx, qObj, qIdx, totalQ, stage, timeInQ, stageProgress, theme, currentSet);
      ctx.restore();
      return;
    }

    const isCaDaoTucNguMode = (qObj && (qObj.mode === 'ca-dao-tuc-ngu' || qObj.mode === 'ca-dao')) ||
      (targetSet && (targetSet.mode === 'ca-dao-tuc-ngu' || targetSet.mode === 'ca-dao' || targetSet.id === 'ca-dao-tuc-ngu')) ||
      (theme && theme.id === 'ca-dao-tuc-ngu');

    if (isCaDaoTucNguMode) {
      drawCaDaoTucNguCanvasFrame(ctx, qObj, qIdx, totalQ, stage, timeInQ, stageProgress, theme, currentSet);
      ctx.restore();
      return;
    }

    const isLingoBiBiFlashcardMode = (qObj && qObj.mode === 'lingobibi-flashcard') ||
      (targetSet && (targetSet.mode === 'lingobibi-flashcard' || targetSet.id === 'lingobibi-flashcard')) ||
      (theme && theme.id === 'lingobibi-flashcard');

    if (isLingoBiBiFlashcardMode) {
      drawLingoBiBiFlashcardCanvasFrame(ctx, qObj, qIdx, totalQ, stage, timeInQ, stageProgress, theme, currentSet);
      ctx.restore();
      return;
    }

    const isCountryGuessMode = (qObj && (qObj.mode === 'country-guess' || qObj.mode === 'country')) ||
      (targetSet && (targetSet.mode === 'country-guess' || targetSet.mode === 'country')) ||
      (theme && (theme.id === 'country-guess' || theme.id === 'country-guess-5-clues'));

    if (isCountryGuessMode) {
      drawCountryGuessCanvasFrame(ctx, qObj, qIdx, totalQ, stage, timeInQ, stageProgress, theme, currentSet);
      ctx.restore();
      return;
    }

    const isFlagsB1Mode = (qObj && (qObj.mode === 'flags' || qObj.mode === 'flags-b1')) ||
      (targetSet && (targetSet.mode === 'flags' || targetSet.mode === 'flags-b1' || targetSet.id === 'flags')) ||
      (theme && (theme.id === 'flags' || theme.id === 'flags-b1'));

    if (isFlagsB1Mode) {
      drawFlagsB1CanvasFrame(ctx, qObj, qIdx, totalQ, stage, timeInQ, stageProgress, theme, currentSet);
      ctx.restore();
      return;
    }

    const isVocabTikTokMode = (qObj && qObj.mode === 'vocab-b1-tiktok') ||
      (targetSet && targetSet.mode === 'vocab-b1-tiktok') ||
      (theme && theme.id === 'vocab-b1-tiktok') ||
      !!(qObj && qObj.topic && qObj.headerTitle);

    if (isVocabTikTokMode) {
      drawVocabTikTokCanvasFrame(ctx, qObj, qIdx, totalQ, stage, timeInQ, stageProgress, theme, currentSet);
      ctx.restore();
      return;
    }

    const isWordGuessMode = (qObj && qObj.mode === 'word-guess') ||
      (targetSet && targetSet.mode === 'word-guess') ||
      !!(qObj && qObj.word);

    if (isWordGuessMode) {
      drawWordGuessCanvasFrame(ctx, qObj, qIdx, totalQ, stage, timeInQ, stageProgress, theme);
      ctx.restore();
      return;
    }

    // 1. Background Gradient (đa lớp, chuyển sắc mượt theo từng theme)
    const globalT = performance.now() / 1000;
    const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1920);
    bgGrad.addColorStop(0, theme.bg);
    bgGrad.addColorStop(1, theme.bgTo || theme.bg);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1920);

    // 1b. Quầng sáng mềm chuyển động nhẹ - tạo chiều sâu như hậu kỳ chuyên nghiệp
    drawAmbientGlowOrbs(ctx, globalT, theme);

    // 2. Floating Background Particles (dạng hạt sáng lấp lánh, có nhấp nháy)
    particlesRef.current.forEach((p, pi) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > 1080) p.vx *= -1;
      if (p.y < 0 || p.y > 1920) p.vy *= -1;

      const twinkle = 0.18 + (Math.sin(globalT * 1.4 + pi) * 0.5 + 0.5) * 0.22;
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2.2);
      glow.addColorStop(0, p.color);
      glow.addColorStop(1, p.color + '00');
      ctx.save();
      ctx.globalAlpha = twinkle;
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // 3. Top Left Logo Badge
    const logoW = 160;
    const logoH = 160;
    const logoX = 70;
    const logoY = 70;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 25;
    ctx.shadowOffsetY = 10;
    ctx.fillStyle = '#FFFFFF';
    drawRoundRect(ctx, logoX - 10, logoY - 10, logoW + 20, logoH + 20, 36);
    ctx.fill();

    ctx.lineWidth = 6;
    ctx.strokeStyle = theme.accent;
    ctx.stroke();
    ctx.restore();

    if (logoImgRef.current && logoImgRef.current.complete && logoImgRef.current.naturalWidth > 0) {
      ctx.save();
      drawRoundRect(ctx, logoX, logoY, logoW, logoH, 28);
      ctx.clip();
      ctx.drawImage(logoImgRef.current, logoX, logoY, logoW, logoH);
      ctx.restore();
    } else {
      ctx.fillStyle = '#1A1635';
      ctx.font = '900 44px "Be Vietnam Pro", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('QUIZ', logoX + logoW / 2, logoY + logoH / 2);
      ctx.textBaseline = 'alphabetic';
    }

    // Sparkle trang trí góc logo
    drawIconSparkle(ctx, logoX + logoW + 6, logoY - 4, 16, theme.accent2 || theme.accent, globalT * 1.2);

    // 4. Header Badge kiểu kính mờ (glassmorphism): "TRẮC NGHIỆM #1 / 5"
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 8;
    const headerGrad = ctx.createLinearGradient(260, 95, 1010, 205);
    headerGrad.addColorStop(0, 'rgba(15, 12, 30, 0.62)');
    headerGrad.addColorStop(1, 'rgba(15, 12, 30, 0.42)');
    ctx.fillStyle = headerGrad;
    drawRoundRect(ctx, 260, 95, 750, 110, 40);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.stroke();
    ctx.restore();

    drawIconQuestionBubble(ctx, 320, 150, 26, theme.accent2 || theme.accent);

    ctx.fillStyle = '#FFFFFF';
    const headerTitle = `TRẮC NGHIỆM #${qIdx + 1} / ${totalQ}`;
    ctx.font = getFitFont(ctx, headerTitle, '900', '"Be Vietnam Pro", sans-serif', 600, 44, 26);
    ctx.textAlign = 'center';
    ctx.fillText(headerTitle, 660, 168);

    // Progress Bar Top (có hiệu ứng ánh sáng lướt qua)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
    drawRoundRect(ctx, 260, 215, 750, 18, 9);
    ctx.fill();

    let currentQProgress = 0;
    if (stage === 'read') {
      currentQProgress = stageProgress * 0.35;
    } else if (stage === 'guess') {
      currentQProgress = 0.35 + stageProgress * 0.45;
    } else {
      currentQProgress = 0.80 + stageProgress * 0.20;
    }

    const progressW = 750 * Math.min(1.0, Math.max(0, (qIdx + currentQProgress) / totalQ));
    ctx.save();
    const pGrad = ctx.createLinearGradient(260, 0, 260 + progressW, 0);
    pGrad.addColorStop(0, theme.accent2 || theme.accent);
    pGrad.addColorStop(1, theme.accent);
    ctx.fillStyle = pGrad;
    drawRoundRect(ctx, 260, 215, Math.max(18, progressW), 18, 9);
    ctx.fill();
    // Ánh sáng lướt (shimmer)
    ctx.save();
    drawRoundRect(ctx, 260, 215, Math.max(18, progressW), 18, 9);
    ctx.clip();
    const shimmerX = 260 + ((globalT * 260) % (progressW + 200)) - 100;
    const shimGrad = ctx.createLinearGradient(shimmerX, 0, shimmerX + 70, 0);
    shimGrad.addColorStop(0, 'rgba(255,255,255,0)');
    shimGrad.addColorStop(0.5, 'rgba(255,255,255,0.55)');
    shimGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = shimGrad;
    ctx.fillRect(260, 215, 750, 18);
    ctx.restore();
    ctx.restore();

    // 5. QUESTION CARD — hiệu ứng xuất hiện đầu mỗi câu
    const hasCodeSnippet = !!qObj.codeSnippet;
    const hasImage = !!qObj.image && !hasCodeSnippet;
    const hasMedia = hasImage || hasCodeSnippet;
    const qCardY = hasMedia ? 255 : 280;
    const qCardH = hasMedia ? 340 : 265;
    const tagY = qCardY - 24;

    const qEntranceT = easeOutBack(Math.min(1, timeInQ / 0.42));
    const qScale = stage === 'guess' ? (0.92 + qEntranceT * 0.08) : 1;
    const qAlpha = stage === 'guess' ? Math.min(1, timeInQ / 0.28) : 1;

    ctx.save();
    ctx.globalAlpha = qAlpha;
    ctx.translate(540, qCardY + qCardH / 2);
    ctx.scale(qScale, qScale);
    ctx.translate(-540, -(qCardY + qCardH / 2));

    ctx.fillStyle = theme.cardBg;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 15;
    drawRoundRect(ctx, 70, qCardY, 940, qCardH, 36);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    const qBorderGrad = ctx.createLinearGradient(70, qCardY, 1010, qCardY + qCardH);
    qBorderGrad.addColorStop(0, theme.accent);
    qBorderGrad.addColorStop(1, theme.accent2 || theme.accent);
    ctx.lineWidth = 5;
    ctx.strokeStyle = qBorderGrad;
    ctx.stroke();

    // Viền sáng mỏng phía trong (glass highlight)
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    drawRoundRect(ctx, 76, qCardY + 6, 928, qCardH - 12, 32);
    ctx.stroke();

    // Question Label Tag
    ctx.fillStyle = theme.accent;
    drawRoundRect(ctx, 300, tagY, 480, 46, 23);
    ctx.fill();
    drawIconQuestionBubble(ctx, 335, tagY + 23, 13, '#FFFFFF');
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold 24px ${FONT_FAMILY}`;
    ctx.textAlign = 'center';
    ctx.fillText('CÂU HỎI TRẮC NGHIỆM', 555, tagY + 32);

    // Question Text & Optional Image / Code Window
    const questionText = qObj.question || 'Câu hỏi trắc nghiệm?';
    const imgObj = qObj.image ? getLoadedImage(qObj.image) : null;
    const tagBottomY = tagY + 46;

    if (hasCodeSnippet) {
      // Khi câu hỏi chứa Code Snippet (Code Typing Shorts / Tip Công Nghệ)
      const textCenterY = 306;
      const safeMinY = tagBottomY + 10;
      ctx.fillStyle = '#00F0FF';
      drawWrappedText(ctx, questionText, 540, textCenterY, 860, 28, '900', FONT_FAMILY, 2, {
        minY: safeMinY,
        maxHeight: 65,
        minFontSize: 16
      });

      // Màn hình Cửa sổ Code IDE macOS
      const codeW = 860;
      const codeH = 205;
      const codeX = 540 - codeW / 2;
      const codeY = qCardY + 118;

      drawCodeWindow(ctx, qObj.codeSnippet, codeX, codeY, codeW, codeH, timeInQ, isPlayingRef.current);
    } else if (hasImage) {
      // Khi câu hỏi có hình ảnh (Lá cờ quốc gia / Từ vựng / Hình minh họa):
      // Đặt câu hỏi trong vùng an toàn giữa Badge CÂU HỎI TRẮC NGHIỆM và Khung hình ảnh
      const textCenterY = 328;
      const safeMinY = tagBottomY + 12; // 277 + 12 = 289
      ctx.fillStyle = '#FFDE59';
      drawWrappedText(ctx, questionText, 540, textCenterY, 860, 30, '900', FONT_FAMILY, 2, {
        minY: safeMinY,
        maxHeight: 76,
        minFontSize: 18
      });

      // Khung chứa hình ảnh KÍCH THƯỚC NỔI BẬT (430px x 205px)
      const imgW = 430;
      const imgH = 205;
      const imgX = 540 - imgW / 2;
      const imgY = qCardY + 122;

      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 6;
      ctx.fillStyle = '#FFFFFF';
      drawRoundRect(ctx, imgX - 6, imgY - 6, imgW + 12, imgH + 12, 20);
      ctx.fill();
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = theme.accent2 || theme.accent;
      ctx.stroke();
      ctx.restore();

      if (imgObj) {
        ctx.save();
        drawRoundRect(ctx, imgX, imgY, imgW, imgH, 16);
        ctx.clip();
        drawFitImage(ctx, imgObj, imgX, imgY, imgW, imgH, { progress: stageProgress, qIdx: qIdx, kenBurns: settings?.imageMotion === true });
        ctx.restore();
      } else {
        ctx.save();
        drawRoundRect(ctx, imgX, imgY, imgW, imgH, 16);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `bold 24px ${FONT_FAMILY}`;
        ctx.textAlign = 'center';
        ctx.fillText('🖼️ Đang tải hình ảnh...', 540, imgY + imgH / 2 + 8);
        ctx.restore();
      }
    } else {
      // Khi không có hình ảnh: vẽ câu hỏi dạng chữ lớn tiêu chuẩn với ranh giới an toàn bên dưới badge
      const textCenterY = 422;
      const safeMinY = tagBottomY + 14; // 302 + 14 = 316
      ctx.fillStyle = '#FFDE59';
      drawWrappedText(ctx, questionText, 540, textCenterY, 860, 42, '900', FONT_FAMILY, 3, {
        minY: safeMinY,
        maxHeight: 180,
        minFontSize: 20
      });
    }
    ctx.restore();

    // 6. 4 OPTION CARDS (A, B, C, D)
    const options = [
      { key: 'A', text: qObj.optionA || 'Đáp án A', color: '#FF3366' },
      { key: 'B', text: qObj.optionB || 'Đáp án B', color: '#00F0FF' },
      { key: 'C', text: qObj.optionC || 'Đáp án C', color: '#FFDE59' },
      { key: 'D', text: qObj.optionD || 'Đáp án D', color: '#9D4EDD' }
    ];

    const startY = hasMedia ? 605 : 570;
    const cardH = hasMedia ? 122 : 135;
    const cardGap = hasMedia ? 18 : 25;
    const correctKey = (qObj.correctOption || 'A').toUpperCase();

    // Thời điểm đáp án đúng bắt đầu hiện (đầu giai đoạn reveal)
    const revealElapsedForCards = stage === 'reveal' ? (timeInQ - GUESS_TIME) : 0;
    const correctBounce = easeOutBack(Math.min(1, revealElapsedForCards / 0.35));

    options.forEach((opt, i) => {
      const posY = startY + i * (cardH + cardGap);
      const isCorrect = opt.key === correctKey;

      // Hiệu ứng trượt vào lần lượt từng thẻ khi bắt đầu câu hỏi
      const cardDelay = i * 0.07;
      const cardEntranceRaw = Math.max(0, Math.min(1, (timeInQ - cardDelay) / 0.35));
      const cardEntrance = easeOutCubic(cardEntranceRaw);
      const slideOffsetX = stage === 'guess' ? (1 - cardEntrance) * 90 : 0;
      const cardAlphaEntrance = stage === 'guess' ? cardEntrance : 1;

      ctx.save();
      ctx.globalAlpha = cardAlphaEntrance;
      ctx.translate(slideOffsetX, 0);

      let isHighlighted = false;
      let isDimmed = false;

      if (stage === 'reveal') {
        if (isCorrect) {
          isHighlighted = true;
        } else {
          isDimmed = true;
        }
      }

      // Bounce nhẹ khi thẻ đáp án đúng xuất hiện
      if (isHighlighted) {
        const bounceScale = 0.9 + correctBounce * 0.1;
        ctx.translate(540, posY + cardH / 2);
        ctx.scale(bounceScale, bounceScale);
        ctx.translate(-540, -(posY + cardH / 2));

        // Vòng hào quang lan toả (pulse ring) quanh đáp án đúng
        const pulseT = (revealElapsedForCards * 0.9) % 1;
        ctx.save();
        ctx.globalAlpha = (1 - pulseT) * 0.35;
        ctx.strokeStyle = '#00E676';
        ctx.lineWidth = 6;
        drawRoundRect(ctx, 70 - pulseT * 20, posY - pulseT * 14, 940 + pulseT * 40, cardH + pulseT * 28, 28 + pulseT * 10);
        ctx.stroke();
        ctx.restore();
      }

      if (isHighlighted) {
        const greenGrad = ctx.createLinearGradient(70, posY, 1010, posY + cardH);
        greenGrad.addColorStop(0, '#00E676');
        greenGrad.addColorStop(1, '#00C2FF');
        ctx.fillStyle = greenGrad;
        ctx.shadowColor = 'rgba(0, 230, 118, 0.65)';
        ctx.shadowBlur = 40;
        ctx.shadowOffsetY = 12;
      } else if (isDimmed) {
        ctx.fillStyle = 'rgba(20, 18, 38, 0.5)';
        ctx.globalAlpha = cardAlphaEntrance * 0.4;
      } else {
        const idleGrad = ctx.createLinearGradient(70, posY, 1010, posY + cardH);
        idleGrad.addColorStop(0, 'rgba(38, 35, 62, 0.92)');
        idleGrad.addColorStop(1, 'rgba(26, 24, 46, 0.92)');
        ctx.fillStyle = idleGrad;
      }

      drawRoundRect(ctx, 70, posY, 940, cardH, 28);
      ctx.fill();

      if (isHighlighted) {
        ctx.lineWidth = 8;
        ctx.strokeStyle = '#FFFFFF';
        ctx.stroke();
      } else if (!isDimmed) {
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
        ctx.stroke();
        // Viền màu nhận diện đáp án (dải màu mỏng bên trái)
        ctx.save();
        drawRoundRect(ctx, 70, posY, 940, cardH, 28);
        ctx.clip();
        ctx.fillStyle = opt.color;
        ctx.fillRect(70, posY, 8, cardH);
        ctx.restore();
      }
      ctx.shadowColor = 'transparent';

      const badgeW = 90;
      const badgeH = 90;
      const badgeX = 95;
      const badgeY = posY + (cardH - badgeH) / 2;

      const badgeGrad = ctx.createLinearGradient(badgeX, badgeY, badgeX + badgeW, badgeY + badgeH);
      if (isHighlighted) {
        badgeGrad.addColorStop(0, '#FFFFFF');
        badgeGrad.addColorStop(1, '#EAFBEF');
      } else {
        badgeGrad.addColorStop(0, opt.color);
        badgeGrad.addColorStop(1, opt.color + 'CC');
      }
      ctx.fillStyle = badgeGrad;
      drawRoundRect(ctx, badgeX, badgeY, badgeW, badgeH, 22);
      ctx.fill();

      ctx.fillStyle = isHighlighted ? '#00A855' : '#1A1635';
      ctx.font = '900 48px "Be Vietnam Pro", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(opt.key, badgeX + badgeW / 2, badgeY + badgeH / 2);
      ctx.textBaseline = 'alphabetic';

      const textX = 210;
      const textMaxW = isHighlighted ? 620 : 740;
      ctx.fillStyle = isHighlighted ? '#FFFFFF' : (isDimmed ? '#AAAAAA' : '#F3F4F6');
      ctx.font = getFitFont(ctx, opt.text, isHighlighted ? '900' : 'bold', '"Be Vietnam Pro", sans-serif', textMaxW, 36, 18);
      ctx.textAlign = 'left';
      ctx.fillText(opt.text, textX, posY + cardH / 2 + 12);

      if (stage === 'reveal' && isCorrect) {
        ctx.save();
        ctx.translate(935, posY + cardH / 2);
        ctx.scale(0.75 + correctBounce * 0.25, 0.75 + correctBounce * 0.25);
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(0, 0, 40, 0, Math.PI * 2);
        ctx.fill();
        drawIconCheck(ctx, 0, 0, 46, '#00C853');
        ctx.restore();
      }

      ctx.restore();
    });

    // 7. FOOTER CONTENT
    if (stage === 'guess' || stage === 'read') {
      const timerCenterX = 540;
      const timerCenterY = 1380;
      const timerRadius = 110;
      const GUESS_TIME = settings?.guessTime || 3;
      const remainingSec = stage === 'read' ? Math.ceil(GUESS_TIME) : Math.max(0, Math.ceil(GUESS_TIME * (1 - stageProgress)));
      const urgent = stage === 'guess' && remainingSec <= 3;
      const countdownPercent = stage === 'read' ? 0 : stageProgress;

      // Màu chuyển dần xanh -> vàng -> đỏ theo tiến trình còn lại
      const ringColorFrom = countdownPercent < 0.6 ? theme.accent2 || '#00F0FF' : (urgent ? '#FF3366' : '#FFC300');
      const ringColorTo = urgent ? '#FF3366' : (theme.accent || '#00F0FF');

      // Quầng glow nhịp đập, nhanh hơn khi gấp gáp
      const pulseSpeed = urgent ? 6 : 2.5;
      const glowPulse = Math.sin(timeInQ * pulseSpeed) * 0.5 + 0.5;

      ctx.save();
      ctx.shadowColor = urgent ? 'rgba(255, 51, 102, 0.55)' : 'rgba(0, 240, 255, 0.35)';
      ctx.shadowBlur = 20 + glowPulse * 20;

      ctx.beginPath();
      ctx.arc(timerCenterX, timerCenterY, timerRadius, 0, Math.PI * 2);
      ctx.lineWidth = 20;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.stroke();

      const startAngle = -Math.PI / 2;
      const endAngle = startAngle + (Math.PI * 2 * (1 - countdownPercent));
      const ringGrad = ctx.createLinearGradient(
        timerCenterX - timerRadius, timerCenterY - timerRadius,
        timerCenterX + timerRadius, timerCenterY + timerRadius
      );
      ringGrad.addColorStop(0, ringColorFrom);
      ringGrad.addColorStop(1, ringColorTo);
      ctx.beginPath();
      ctx.arc(timerCenterX, timerCenterY, timerRadius, startAngle, endAngle);
      ctx.lineWidth = 20;
      ctx.strokeStyle = ringGrad;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.restore();

      // Hiệu ứng "pop" số đếm ngược mỗi giây
      const secFraction = stage === 'read' ? 0 : (timeInQ - Math.floor(timeInQ));
      const numberScale = 1 + (1 - easeOutCubic(secFraction)) * 0.16;
      ctx.save();
      ctx.translate(timerCenterX, timerCenterY);
      ctx.scale(numberScale, numberScale);
      ctx.fillStyle = urgent ? '#FF3366' : '#FFFFFF';
      ctx.font = '900 92px "Be Vietnam Pro", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${remainingSec}`, 0, 4);
      ctx.textBaseline = 'alphabetic';
      ctx.restore();


    } else if (stage === 'reveal') {
      const revealElapsed = stageProgress * 2.0;
      const panelEntrance = easeOutCubic(Math.min(1, revealElapsed / 0.4));
      const panelY = 1220 + (1 - panelEntrance) * 40;

      ctx.save();
      ctx.globalAlpha = panelEntrance;

      ctx.fillStyle = 'rgba(18, 16, 34, 0.92)';
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 10;
      drawRoundRect(ctx, 70, panelY, 940, 310, 32);
      ctx.fill();
      ctx.shadowColor = 'transparent';

      const explGrad = ctx.createLinearGradient(70, panelY, 1010, panelY + 310);
      explGrad.addColorStop(0, '#00E676');
      explGrad.addColorStop(1, '#00C2FF');
      ctx.lineWidth = 4;
      ctx.strokeStyle = explGrad;
      ctx.stroke();

      ctx.fillStyle = '#00E676';
      drawRoundRect(ctx, 300, panelY + 25, 480, 56, 28);
      ctx.fill();
      drawIconBulb(ctx, 335, panelY + 53, 17, '#1A1635');
      ctx.fillStyle = '#1A1635';
      ctx.font = 'bold 27px "Be Vietnam Pro", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('GIẢI THÍCH CHI TIẾT', 555, panelY + 63);

      const explanationText = qObj.explanation || `Đáp án đúng là ${qObj.correctOption}!`;
      ctx.fillStyle = '#FFDE59';
      drawWrappedText(ctx, explanationText, 540, panelY + 155, 860, 34, 'bold', '"Be Vietnam Pro", sans-serif', 3);
      ctx.restore();

      // Chùm confetti bay lên khi hiện đáp án - vẽ trực tiếp lên canvas
      drawCanvasConfettiBurst(ctx, qIdx, revealElapsed, theme);

      const ctaAlpha = Math.min(1, Math.max(0, (revealElapsed - 0.5) / 0.4));
      ctx.save();
      ctx.globalAlpha = ctaAlpha;
      drawIconThumbsUp(ctx, 400, 1615, 18, '#FFFFFF');
      drawIconHeart(ctx, 680, 1615, 16, '#FF3366');
      ctx.fillStyle = '#FFFFFF';
      const ctaText = 'NHỚ LIKE & THEO DÕI ĐỂ HỌC NHIỀU BÀI MỚI!';
      ctx.font = getFitFont(ctx, ctaText, 'bold', '"Be Vietnam Pro", sans-serif', 800, 34, 20);
      ctx.textAlign = 'center';
      ctx.fillText(ctaText, 540, 1615);
      ctx.restore();
    }

    // 8. DYNAMIC FOOTER BADGE
    const pulseFactor = Math.sin(timeInQ * 4) * 0.5 + 0.5;
    const glowBlur = 15 + pulseFactor * 15;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 240, 255, ' + (0.4 + pulseFactor * 0.4) + ')';
    ctx.shadowBlur = glowBlur;
    ctx.shadowOffsetY = 6;

    const footerGrad = ctx.createLinearGradient(60, 1720, 1020, 1840);
    footerGrad.addColorStop(0, 'rgba(24, 20, 44, 0.95)');
    footerGrad.addColorStop(1, 'rgba(16, 14, 30, 0.95)');
    ctx.fillStyle = footerGrad;
    drawRoundRect(ctx, 60, 1720, 960, 120, 60);
    ctx.fill();

    ctx.lineWidth = 4 + pulseFactor * 2;
    const ringGrad = ctx.createLinearGradient(60, 1720, 1020, 1840);
    ringGrad.addColorStop(0, theme.accent2 || '#FFDE59');
    ringGrad.addColorStop(0.5, '#00F0FF');
    ringGrad.addColorStop(1, theme.accent || '#FF3366');
    ctx.strokeStyle = ringGrad;
    ctx.stroke();
    ctx.restore();

    drawIconThumbsUp(ctx, 175, 1780, 20, '#FFFFFF');
    drawIconHeart(ctx, 920, 1780, 18, '#FF3366');

    const footerText = 'Nhớ LIKE & THEO DÕI để học thêm nhiều kiến thức mới!';
    ctx.save();
    ctx.font = getFitFont(ctx, footerText, 'bold', '"Be Vietnam Pro", sans-serif', 700, 36, 22);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(footerText, 540, 1780);
    ctx.restore();

    // Vignette điện ảnh cuối cùng để tăng chiều sâu tổng thể khung hình
    drawVignette(ctx);
  };

  // Sync isPlayingRef with isPlaying state
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Play / Pause loop
  useEffect(() => {
    isPlayingRef.current = isPlaying;
    if (isPlaying) {
      audioSynth.init();
      startTimeRef.current = null;
      lastSecondRef.current = -1;
      lastQIdxRef.current = -1;
      lastStateRef.current = '';
      animFrameIdRef.current = requestAnimationFrame(renderFrame);
    } else {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    }
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isPlaying, questionSets, activeSetIndex, settings]);

  // Initial draw when paused and not exporting
  useEffect(() => {
    if (!isPlaying && !isExporting && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      drawCanvasFrame(ctx, questions[0] || {}, 0, questions.length, 'guess', 0, 0, currentTheme);
    }
  }, [isPlaying, isExporting, questions, settings, currentTheme]);

  // Mime type helper
  const getSupportedMimeTypeAndExt = () => {
    const candidateTypes = [
      { mime: 'video/mp4;codecs=avc1.42E01E,mp4a.40.2', ext: 'mp4' },
      { mime: 'video/mp4;codecs=avc1', ext: 'mp4' },
      { mime: 'video/mp4;codecs=h264', ext: 'mp4' },
      { mime: 'video/mp4', ext: 'mp4' },
      { mime: 'video/webm;codecs=vp9,opus', ext: 'webm' },
      { mime: 'video/webm;codecs=vp8,opus', ext: 'webm' },
      { mime: 'video/webm', ext: 'webm' }
    ];

    for (const item of candidateTypes) {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(item.mime)) {
        return item;
      }
    }
    return { mime: 'video/mp4', ext: 'mp4' };
  };

  // Helper render a SINGLE VIDEO and return Promise
  const renderSingleVideo = (setObj, themeObj, setIndex) => {
    return new Promise(async (resolve, reject) => {
      const canvas = canvasRef.current;
      if (!canvas) return reject(new Error('Canvas reference unavailable'));

      let canvasStream = null;
      let dest = null;
      let silentOsc = null;
      let silentGain = null;
      let combinedStream = null;
      let recorder = null;

      const stopAllTracks = () => {
        try {
          if (canvasStream) {
            canvasStream.getTracks().forEach(t => t.stop());
          }
        } catch (e) {}
        try {
          if (dest && dest.stream) {
            dest.stream.getTracks().forEach(t => t.stop());
          }
        } catch (e) {}
        try {
          if (combinedStream) {
            combinedStream.getTracks().forEach(t => t.stop());
          }
        } catch (e) {}
        try {
          if (silentOsc) {
            silentOsc.stop();
            silentOsc.disconnect();
          }
        } catch (e) {}
        try {
          if (silentGain) {
            silentGain.disconnect();
          }
        } catch (e) {}
      };

      try {
        const qList = setObj.questions || [];

        try {
          const qSpeechItems = qList.map(q => ({ question: q.question })).filter(item => !!item.question);
          const effectiveVoice = getEffectiveVoice(settings.voiceLang, setObj) || (setObj.mode === 'word-guess' ? 'en-US-AnaNeural' : 'vi-VN-HoaiMyNeural');
          await audioSynth.preloadWordList(qSpeechItems, effectiveVoice, settings.voiceSpeed || 1.25);

          if (settings.readAnswer !== false && setObj.mode !== 'player-guess' && setObj.mode !== 'landmark-guess' && setObj.mode !== 'food-guess' && setObj.mode !== 'flags') {
            const ansSpeechItems = qList.map(q => {
              const correctKey = (q.correctOption || 'A').toUpperCase();
              let ansText = q.optionA;
              if (correctKey === 'B') ansText = q.optionB;
              else if (correctKey === 'C') ansText = q.optionC;
              else if (correctKey === 'D') ansText = q.optionD;
              if (!ansText) ansText = q.word || q.optionA;
              return { question: ansText };
            }).filter(item => !!item.question);
            const enVoice = settings.voiceLang && settings.voiceLang.startsWith('en-') ? settings.voiceLang : 'en-US-AnaNeural';
            await audioSynth.preloadWordList(ansSpeechItems, enVoice, settings.voiceSpeed || 1.25);
          }
          await preloadQuestionImages(qList);
        } catch (preloadErr) {
          console.warn('Preload speech/image warning (rendering will proceed):', preloadErr);
        }

        const timingsInfo = getQuestionTimings(qList, setObj, settings);
        const setTotalTime = timingsInfo.totalQuestionsTime + 0.5;

        if (isExportCancelledRef.current) {
          stopAllTracks();
          return resolve({ cancelled: true });
        }

        canvasStream = canvas.captureStream(60);
        const audioCtx = audioSynth.getAudioContext();
        if (audioCtx.state === 'suspended') {
          await audioCtx.resume();
        }

        dest = audioCtx.createMediaStreamDestination();

        silentOsc = audioCtx.createOscillator();
        silentGain = audioCtx.createGain();
        silentGain.gain.value = 0.00001;
        silentOsc.connect(silentGain);
        silentGain.connect(dest);
        silentOsc.start();

        const selectedFormat = getSupportedMimeTypeAndExt();
        const combinedTracks = [
          ...canvasStream.getVideoTracks(),
          ...dest.stream.getAudioTracks()
        ];
        combinedStream = new MediaStream(combinedTracks);

        recorder = new MediaRecorder(combinedStream, {
          mimeType: selectedFormat.mime,
          videoBitsPerSecond: 8000000
        });

        activeRecorderRef.current = recorder;

        const chunks = [];
        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) chunks.push(e.data);
        };

        const cleanName = (setObj.name || `Bo_${setIndex + 1}`).replace(/[^a-zA-Z0-9_]/g, '_');
        const fileName = `QuizMCQ_${cleanName}_Theme${themeObj.id.toUpperCase()}.${selectedFormat.ext}`;

        recorder.onstop = () => {
          stopAllTracks();
          if (isExportCancelledRef.current) {
            setExportProgress(0);
            return resolve({ cancelled: true });
          }

          const blob = new Blob(chunks, { type: selectedFormat.mime });
          const blobUrl = URL.createObjectURL(blob);
          setExportProgress(100);

          // Auto-trigger download
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);

          resolve({ cancelled: false, blobUrl, fileName });
        };

        recorder.start();

        let currentExportFrame = 0;
        const EXPORT_FPS = 60;
        const STEP_SEC = 1 / EXPORT_FPS;
        let lastExportSec = -1;
        let lastExportQIdx = -1;
        let lastExportState = '';

        const renderExportStep = () => {
          if (isExportCancelledRef.current) {
            stopAllTracks();
            try { if (recorder.state !== 'inactive') recorder.stop(); } catch (e) { }
            return;
          }

          try {
            const elapsedSec = currentExportFrame * STEP_SEC;
            currentExportFrame++;

            if (elapsedSec >= setTotalTime) {
              setExportProgress(100);
              setTimeout(() => {
                try { if (recorder.state !== 'inactive') recorder.stop(); } catch (e) { }
              }, 300);
              return;
            }

            const currentSetProgress = Math.min(100, Math.floor((elapsedSec / setTotalTime) * 100));

            if (currentSetProgress !== lastProgressRef.current) {
              lastProgressRef.current = currentSetProgress;
              setExportProgress(currentSetProgress);
            }

            let validQIdx = 0;
            for (let i = 0; i < timingsInfo.timings.length; i++) {
              const t = timingsInfo.timings[i];
              if (elapsedSec >= t.startTime && elapsedSec < t.endTime) {
                validQIdx = i;
                break;
              }
            }

            const qTiming = timingsInfo.timings[validQIdx] || {
              readTime: 2.0,
              guessTime: 3.0,
              revealTime: 2.0,
              startTime: 0
            };

            const qIdx = validQIdx;
            const timeInQ = elapsedSec - qTiming.startTime;
            const activeQ = qList[validQIdx] || qList[0] || {};

            let stage = 'read';
            let stageProgress = 0;

            if (timeInQ < qTiming.readTime) {
              stage = 'read';
              stageProgress = timeInQ / qTiming.readTime;
            } else if (timeInQ < qTiming.readTime + qTiming.guessTime) {
              stage = 'guess';
              stageProgress = (timeInQ - qTiming.readTime) / qTiming.guessTime;
            } else {
              stage = 'reveal';
              stageProgress = (timeInQ - qTiming.readTime - qTiming.guessTime) / qTiming.revealTime;
            }

            if (lastExportQIdx !== qIdx) {
              lastExportQIdx = qIdx;
              lastExportSec = -1;
              audioSynth.playWhoosh(0.35, dest);
              if (activeQ && activeQ.question) {
                const effectiveVoice = getEffectiveVoice(settings.voiceLang, setObj, activeQ);
                const ttsQuestionText = getTTSQuestionText(activeQ.question, setObj?.mode || activeQ.mode);
                audioSynth.playSpeech(
                  ttsQuestionText,
                  effectiveVoice,
                  dest,
                  { rate: settings.voiceSpeed || 1.25 }
                );
              }
            }

            if (stage === 'guess') {
              const timeInGuessStage = timeInQ - qTiming.readTime;
              const currentSecond = Math.floor(timeInGuessStage);
              if (currentSecond !== lastExportSec) {
                lastExportSec = currentSecond;
                if (settings.playTick) {
                  const remainingSec = Math.max(0, Math.ceil(qTiming.guessTime - timeInGuessStage));
                  audioSynth.playTickingSound(0.6, dest, remainingSec <= 3);
                }
              }
            }

            if (stage === 'reveal' && lastExportState !== 'reveal') {
              const isFlashcardMode = (setObj?.mode === 'lingobibi-flashcard' || activeQ?.mode === 'lingobibi-flashcard' || setObj?.id === 'lingobibi-flashcard');
              const isCaDaoMode = (setObj?.mode === 'ca-dao-tuc-ngu' || activeQ?.mode === 'ca-dao-tuc-ngu' || setObj?.id === 'ca-dao-tuc-ngu');
              const isFlagsOrCountryMode = (setObj?.mode === 'flags' || activeQ?.mode === 'flags' || setObj?.id === 'flags' || setObj?.mode === 'country-guess' || activeQ?.mode === 'country-guess' || setObj?.id === 'country-guess-5-clues');
              if (!isFlashcardMode) {
                audioSynth.playSuccessFanfare(0.65, dest);
              }
              const isLandmarkOrFoodExport = (setObj?.mode === 'landmark-guess' || activeQ?.mode === 'landmark-guess' || setObj?.mode === 'food-guess' || activeQ?.mode === 'food-guess');
              if ((settings.readAnswer || isLandmarkOrFoodExport) && activeQ && !isCaDaoMode && !isFlagsOrCountryMode) {
                const correctKey = (activeQ.correctOption || 'A').toUpperCase();
                let targetWord = activeQ.landmark || activeQ.dish || activeQ.word || '';
                if (!targetWord) {
                  if (correctKey === 'A') targetWord = activeQ.optionA;
                  else if (correctKey === 'B') targetWord = activeQ.optionB;
                  else if (correctKey === 'C') targetWord = activeQ.optionC;
                  else if (correctKey === 'D') targetWord = activeQ.optionD;
                }
                if (!targetWord) {
                  targetWord = activeQ.optionA || '';
                }

                targetWord = String(targetWord || '').trim();
                if (targetWord) {
                  const isLingoBiBi = !!(
                    (setObj && (setObj.channel === 'Lingo BiBi' || setObj.themeColor === 'pink' || setObj.id === 'vocab-b1-word-guess-lingobibi')) ||
                    (activeQ && (activeQ.channel === 'Lingo BiBi' || activeQ.themeColor === 'pink'))
                  );

                  const isViText = isLandmarkOrFoodExport || (!isLingoBiBi && (
                    /[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/i.test(targetWord) ||
                    (setObj && (setObj.topic === 'ĐỐ VUI B1' || setObj.topic === 'TRẮC NGHIỆM B1')) ||
                    (activeQ && (activeQ.topic === 'ĐỐ VUI B1' || activeQ.topic === 'TRẮC NGHIỆM B1'))
                  ));

                  const answerVoice = (isLingoBiBi || !isViText)
                    ? (settings.voiceLang && settings.voiceLang.startsWith('en-') ? settings.voiceLang : 'en-US-AnaNeural')
                    : (settings.voiceLang && settings.voiceLang.startsWith('vi-') ? settings.voiceLang : 'vi-VN-HoaiMyNeural');

                  audioSynth.playSpeech(
                    targetWord,
                    answerVoice,
                    dest,
                    { rate: settings.voiceSpeed || 1.25 }
                  );
                }
              }
            }
            lastExportState = stage;

            const ctx = canvas.getContext('2d');
            drawCanvasFrame(ctx, activeQ, validQIdx, qList.length, stage, timeInQ, stageProgress, themeObj, setObj);

            requestAnimationFrame(renderExportStep);
          } catch (renderErr) {
            console.error('Error during video render export frame:', renderErr);
            stopAllTracks();
            try { if (recorder.state !== 'inactive') recorder.stop(); } catch (e) {}
            reject(renderErr);
          }
        };

        requestAnimationFrame(renderExportStep);

      } catch (err) {
        stopAllTracks();
        reject(err);
      }
    });
  };

  // Export Video của Bộ đang chọn
  const handleExportSingleVideo = async () => {
    if (isExporting) return;
    isExportCancelledRef.current = false;
    setIsExporting(true);
    setIsPlaying(false);
    setExportProgress(0);
    lastProgressRef.current = -1;

    try {
      await renderSingleVideo(activeSet, currentTheme, activeSetIndex);
      setIsExporting(false);
      setIsPlaying(true);
    } catch (e) {
      console.error('Video Export Error:', e);
      alert('Không thể xuất video.');
      setIsExporting(false);
    }
  };

  return (
    <div className="preview-container card">
      <div className="card-header">
        <h2>
          <Film className="icon-pink" size={20} />
          3. Xem Trước Video (Bộ #{activeSetIndex + 1})
        </h2>
        <span className="live-pill">🔴 LIVE MCQ PREVIEW</span>
      </div>

      {/* Set Selector Tabs in Canvas Viewport Header */}
      <div className="canvas-set-tabs">
        {questionSets.map((s, idx) => (
          <button
            key={idx}
            type="button"
            className={`set-tab-btn ${activeSetIndex === idx ? 'active' : ''}`}
            onClick={() => setActiveSetIndex(idx)}
            disabled={isExporting}
          >
            Bộ #{idx + 1}
          </button>
        ))}
      </div>

      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={1080}
          height={1920}
          className="preview-canvas"
        />
      </div>

      {/* Control Buttons */}
      <div className="preview-controls">
        <button
          type="button"
          className="control-btn btn-play"
          onClick={() => {
            audioSynth.init();
            setIsPlaying(!isPlaying);
          }}
          disabled={isExporting}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          {isPlaying ? 'Tạm Dừng' : 'Xem Trực Tiếp'}
        </button>

        <button
          type="button"
          className="control-btn btn-reset"
          onClick={() => {
            startTimeRef.current = performance.now();
            lastQIdxRef.current = -1;
            setIsPlaying(true);
          }}
          disabled={isExporting}
        >
          <RotateCcw size={18} /> Phổ Lại Từ Đầu
        </button>

        {/* Export Selected Set Video */}
        <button
          type="button"
          className="control-btn btn-export-single"
          onClick={handleExportSingleVideo}
          disabled={isExporting}
          style={{ flex: 1.5, background: 'var(--primary-blue, #2563EB)', color: '#FFFFFF' }}
        >
          <Download size={18} />
          {isExporting ? `Đang Render (${exportProgress}%)...` : `🎬 RENDER & XUẤT VIDEO (Bộ #${activeSetIndex + 1})`}
        </button>
      </div>

      {/* Single Video Render Inline Dashboard */}
      {isExporting && (
        <div className="inline-render-card">
          <div className="inline-card-header">
            <div className="modal-title-group">
              <Sparkles className="spin-icon icon-cyan" size={20} />
              <h3>Đang Ghi Hình & Render Video Bộ #{activeSetIndex + 1} ({exportProgress}%)</h3>
            </div>
            <button
              type="button"
              className="btn-cancel-export"
              onClick={handleCancelExport}
            >
              <AlertOctagon size={16} /> Dừng / Hủy Render
            </button>
          </div>

          <div className="v-progress-row" style={{ marginTop: '0.6rem' }}>
            <div className="v-progress-bar-bg">
              <div
                className="v-progress-bar-fill"
                style={{ width: `${exportProgress}%` }}
              ></div>
            </div>
            <span className="v-progress-percent">{exportProgress}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
