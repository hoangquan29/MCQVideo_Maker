import React, { useRef, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { audioSynth } from '../utils/audioSynth';
import { TTSService } from '../utils/ttsService';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Sparkles, 
  Film, 
  Zap, 
  AlertOctagon,
  Volume2,
  CheckCircle
} from 'lucide-react';

const FONT_FAMILY = '"Be Vietnam Pro", "Segoe UI", Tahoma, sans-serif';

export default function VocabVideoPreviewCanvas({ vocabData }) {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportedBlobUrl, setExportedBlobUrl] = useState(null);

  // References for state management
  const animFrameIdRef = useRef(null);
  const startTimeRef = useRef(null);
  const isPlayingRef = useRef(false);
  const isExportCancelledRef = useRef(false);
  const activeRecorderRef = useRef(null);
  const lastSpokenIndexRef = useRef(-1);
  const logoImgRef = useRef(null);

  const items = vocabData.items || [];
  const totalItems = items.length || 1;
  const timePerWord = vocabData.timePerWord || 4.0;
  const introTime = 1.5; // Giây hiện header ban đầu
  const outroTime = 3.0; // Giây hiển thị màn hình hoàn thành cuối
  const totalDuration = introTime + totalItems * timePerWord + outroTime;

  // Preload logo2.png từ thư mục public
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      logoImgRef.current = img;
    };
    img.src = '/logo2.png';
  }, []);

  // Preload TTS Audio cho toàn bộ từ vựng trước khi chạy preview / export
  const preloadAllTTS = async () => {
    if (!items.length) return;
    const voice = vocabData.voice || 'en-US-AnaNeural';
    const rate = vocabData.voiceSpeed || 1.25;
    await audioSynth.preloadWordList(items.map(i => ({ text: i.en })), voice, rate);
  };

  useEffect(() => {
    preloadAllTTS();
  }, [vocabData]);

  // Canvas Drawing Core Function
  const renderCanvasFrame = (ctx, elapsedSec, customActiveIndex = null) => {
    const width = 1080;
    const height = 1920;

    // 1. BACKGROUND: Bầu trời xanh mây trắng tươi sáng (Theme Blue Cloud)
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, '#74d2ff');
    bgGradient.addColorStop(0.5, '#40baff');
    bgGradient.addColorStop(1, '#1b9eff');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Sunburst Light Rays
    ctx.save();
    ctx.translate(width / 2, 280);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, 1200, (i * Math.PI) / 6, ((i + 0.5) * Math.PI) / 6);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // Soft Floating Clouds in background
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    const cloudOffset = (elapsedSec * 15) % (width + 300);
    
    // Cloud 1 top
    ctx.beginPath();
    ctx.arc(cloudOffset - 100, 140, 70, 0, Math.PI * 2);
    ctx.arc(cloudOffset - 50, 110, 90, 0, Math.PI * 2);
    ctx.arc(cloudOffset + 20, 140, 70, 0, Math.PI * 2);
    ctx.fill();

    // Cloud 2 top right
    const cloudOffset2 = ((elapsedSec * 10) + 500) % (width + 300);
    ctx.beginPath();
    ctx.arc(cloudOffset2 - 100, 220, 60, 0, Math.PI * 2);
    ctx.arc(cloudOffset2 - 50, 190, 80, 0, Math.PI * 2);
    ctx.arc(cloudOffset2 + 10, 220, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. LOGO2.PNG Ở PHÍA TRÊN GÓC PHẢI VIDEO
    if (logoImgRef.current && logoImgRef.current.complete && logoImgRef.current.naturalWidth > 0) {
      ctx.save();
      const logoImg = logoImgRef.current;
      const maxW = 180;
      const maxH = 85;
      const aspect = logoImg.naturalWidth / logoImg.naturalHeight;
      let renderW = maxW;
      let renderH = maxW / aspect;
      if (renderH > maxH) {
        renderH = maxH;
        renderW = maxH * aspect;
      }
      const logoX = width - renderW - 45;
      const logoY = 40;

      ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 4;
      ctx.drawImage(logoImg, logoX, logoY, renderW, renderH);
      ctx.restore();
    }

    // 3. TÍNH TOÁN TIẾN TRÌNH TỪ VỰNG ĐANG HIỂN THỊ
    let currentStep = 0;
    if (customActiveIndex !== null) {
      currentStep = customActiveIndex;
    } else if (elapsedSec < introTime) {
      currentStep = 0;
    } else if (elapsedSec >= introTime + totalItems * timePerWord) {
      currentStep = totalItems;
    } else {
      currentStep = Math.min(
        totalItems,
        Math.floor((elapsedSec - introTime) / timePerWord) + 1
      );
    }

    // 4. BANNER TIÊU ĐỀ TRÊN CÙNG (HEADER BANNER 3D)
    ctx.save();
    const titleScale = elapsedSec < 0.4 ? Math.sin((elapsedSec / 0.4) * (Math.PI / 2)) : 1;
    ctx.translate(width / 2, 165);
    ctx.scale(titleScale, titleScale);

    // Decorative Sun Sparkles around Title
    ctx.fillStyle = '#ffeb3b';
    ctx.beginPath();
    ctx.arc(-420, -40, 14, 0, Math.PI * 2);
    ctx.arc(-450, 10, 8, 0, Math.PI * 2);
    ctx.arc(430, -30, 12, 0, Math.PI * 2);
    ctx.arc(460, 20, 9, 0, Math.PI * 2);
    ctx.fill();

    // Title Outer Cloud Badge 3D Background
    const titleBoxW = 880;
    const titleBoxH = 150;
    const titleBoxX = -titleBoxW / 2;
    const titleBoxY = -titleBoxH / 2;

    // 3D Shadow
    ctx.fillStyle = '#0062a8';
    ctx.beginPath();
    ctx.roundRect(titleBoxX + 6, titleBoxY + 12, titleBoxW, titleBoxH, 40);
    ctx.fill();

    // Title Yellow Box
    const titleGradient = ctx.createLinearGradient(0, titleBoxY, 0, titleBoxY + titleBoxH);
    titleGradient.addColorStop(0, '#fff455');
    titleGradient.addColorStop(1, '#ffc700');
    ctx.fillStyle = titleGradient;
    ctx.strokeStyle = '#005bb5';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.roundRect(titleBoxX, titleBoxY, titleBoxW, titleBoxH, 40);
    ctx.fill();
    ctx.stroke();

    // Chef Hat / Top Icon
    ctx.font = '54px ' + FONT_FAMILY;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(vocabData.headerIcon || '👨‍🍳', titleBoxX + 80, 0);

    // Title Text (High Contrast 3D Stroke Text)
    ctx.font = '900 58px ' + FONT_FAMILY;
    ctx.fillStyle = '#0a3270';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    ctx.lineJoin = 'round';
    const mainTitleText = vocabData.title || '10 TỪ VỰNG VỀ NẤU ĂN';
    ctx.strokeText(mainTitleText, 40, -4);
    ctx.fillText(mainTitleText, 40, -4);

    ctx.restore();

    // 5. KHUNG CONTAINER CHÍNH CHỨA DANH SÁCH TỪ VỰNG (MAIN CARD CONTAINER)
    const cardMarginX = 60;
    const cardTopY = 275;
    const cardW = width - cardMarginX * 2; // 960px
    const cardH = 1415;

    ctx.save();
    // 3D Shadow for main card
    ctx.fillStyle = 'rgba(0, 72, 140, 0.25)';
    ctx.beginPath();
    ctx.roundRect(cardMarginX + 8, cardTopY + 12, cardW, cardH, 36);
    ctx.fill();

    // Main Card Background
    const cardBgGrad = ctx.createLinearGradient(0, cardTopY, 0, cardTopY + cardH);
    cardBgGrad.addColorStop(0, '#f0f9ff');
    cardBgGrad.addColorStop(1, '#e1f3fe');
    ctx.fillStyle = cardBgGrad;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.roundRect(cardMarginX, cardTopY, cardW, cardH, 36);
    ctx.fill();
    ctx.stroke();

    // Inner White List Board
    const listMargin = 20;
    const listW = cardW - listMargin * 2; // 920px
    const listH = cardH - listMargin * 2;
    const listX = cardMarginX + listMargin;
    const listY = cardTopY + listMargin;

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(listX, listY, listW, listH, 28);
    ctx.fill();

    // 6. VẼ TOÀN BỘ CÁC DÒNG TỪ VỰNG (HIỂN THỊ TỪ TIẾNG VIỆT NGAY TỪ ĐẦU, LẦN LƯỢT HIỆN TỪ TIẾNG ANH)
    const rowCount = items.length || 10;
    const paddingY = 18;
    const availableH = listH - paddingY * 2;
    const rowH = Math.min(125, availableH / rowCount);

    items.forEach((item, idx) => {
      const itemNum = idx + 1;
      const isEnRevealed = itemNum <= currentStep;
      const isHighlight = isEnRevealed && itemNum === currentStep && elapsedSec < introTime + totalItems * timePerWord;

      const rowY = listY + paddingY + idx * rowH;
      const rowCenterY = rowY + rowH / 2;

      ctx.save();

      // Nền của dòng từ vựng
      ctx.fillStyle = isHighlight ? '#e0f2fe' : (idx % 2 === 0 ? '#f4f9fd' : '#ffffff');
      ctx.strokeStyle = isHighlight ? '#0284c7' : '#e2e8f0';
      ctx.lineWidth = isHighlight ? 4 : 2;

      ctx.beginPath();
      ctx.roundRect(listX + 15, rowY + 4, listW - 30, rowH - 8, 22);
      ctx.fill();
      ctx.stroke();

      // 6a. Number Badge (Circle Badge 1..10) - Hiển thị ngay từ đầu
      const badgeRadius = Math.min(32, (rowH - 18) / 2);
      const badgeX = listX + 55;

      ctx.fillStyle = isHighlight ? '#0284c7' : '#0ea5e9';
      ctx.beginPath();
      ctx.arc(badgeX, rowCenterY + 2, badgeRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = isHighlight ? '#38bdf8' : '#38bdf8';
      ctx.beginPath();
      ctx.arc(badgeX, rowCenterY, badgeRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '900 32px ' + FONT_FAMILY;
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(itemNum.toString(), badgeX, rowCenterY + 2);

      // 6b. Icon / Emoji - Hiển thị ngay từ đầu
      const iconX = listX + 140;
      ctx.font = '40px ' + FONT_FAMILY;
      ctx.fillText(item.icon || '🍲', iconX, rowCenterY);

      // 6c. Từ Tiếng Việt - HIỂN THỊ NGAY TỪ ĐẦU!
      const viX = listX + 220;
      ctx.font = '800 38px ' + FONT_FAMILY;
      ctx.fillStyle = '#0f172a';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.vi || '', viX, rowCenterY);

      // 6d. Mũi tên chỉ hướng (Blue Arrow ->) - Hiển thị ngay từ đầu
      const arrowX = listX + 530;
      ctx.font = '900 34px ' + FONT_FAMILY;
      ctx.fillStyle = '#0284c7';
      ctx.textAlign = 'center';
      ctx.fillText('➔', arrowX, rowCenterY);

      // 6e. Khung Từ Tiếng Anh (English Word Pill) - CHỈ LẦN LƯỢT HIỂN THỊ TỪ TIẾNG ANH!
      const enPillW = 270;
      const enPillH = Math.min(68, rowH - 20);
      const enPillX = listX + listW - 40 - enPillW;
      const enPillY = rowCenterY - enPillH / 2;

      if (isEnRevealed) {
        // Đã đến lượt xuất hiện của từ Tiếng Anh
        ctx.fillStyle = isHighlight ? '#0284c7' : '#e0f2fe';
        ctx.beginPath();
        ctx.roundRect(enPillX, enPillY, enPillW, enPillH, 34);
        ctx.fill();

        if (isHighlight) {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 4;
          ctx.stroke();
        }

        ctx.font = '900 38px ' + FONT_FAMILY;
        ctx.fillStyle = isHighlight ? '#ffffff' : '#0369a1';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.en || '', enPillX + enPillW / 2, rowCenterY + 2);
      } else {
        // Chưa đến lượt: Hiển thị khung chờ mềm mại với ký hiệu ? ? ?
        ctx.fillStyle = '#f8fafc';
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(enPillX, enPillY, enPillW, enPillH, 34);
        ctx.fill();
        ctx.stroke();

        ctx.font = '800 30px ' + FONT_FAMILY;
        ctx.fillStyle = '#94a3b8';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('? ? ?', enPillX + enPillW / 2, rowCenterY + 1);
      }

      ctx.restore();
    });

    ctx.restore();

    // 7. FOOTER BANNER (CĂN GIỮA NỘI DUNG, ĐÃ LOẠI BỎ LOGO/MASCOT 🦥 PHÍA DƯỚI GÓC PHẢI)
    const footerY = height - 190;
    ctx.save();

    // White Wave Background
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0, footerY);
    ctx.quadraticCurveTo(width / 2, footerY - 40, width, footerY);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();

    // Footer Subtitle Text Căn Giữa Hoàn Toàn (Chữa lỗi lệch và bỏ mascot góc phải)
    ctx.font = '800 36px ' + FONT_FAMILY;
    ctx.fillStyle = '#0284c7';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const mascotSubtitle = vocabData.subtitle || 'Học từ vựng mỗi ngày cùng BIGO!';
    ctx.fillText(`✨ ${mascotSubtitle} ✨`, width / 2, height - 70);

    ctx.restore();

    // 8. MÀN HÌNH HOÀN THÀNH (OUTRO CONGRATS)
    if (elapsedSec >= introTime + totalItems * timePerWord) {
      const outroElapsed = elapsedSec - (introTime + totalItems * timePerWord);
      const outroAlpha = Math.min(1, outroElapsed / 0.8);

      ctx.save();
      ctx.fillStyle = `rgba(10, 25, 47, ${outroAlpha * 0.4})`;
      ctx.fillRect(0, 0, width, height);

      // Banner hoàn thành pop-up
      ctx.translate(width / 2, height / 2);
      const popScale = Math.min(1, outroElapsed / 0.4);
      ctx.scale(popScale, popScale);

      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.roundRect(-400, -140, 800, 280, 36);
      ctx.fill();
      ctx.stroke();

      ctx.font = '900 52px ' + FONT_FAMILY;
      ctx.fillStyle = '#0284c7';
      ctx.textAlign = 'center';
      ctx.fillText('🎉 HOÀN THÀNH BÀI HỌC! 🎉', 0, -40);

      ctx.font = '600 34px ' + FONT_FAMILY;
      ctx.fillStyle = '#334155';
      ctx.fillText('Bạn đã thuộc 10 từ vựng hôm nay!', 0, 30);

      ctx.restore();
    }
  };

  // AUDIO & ANIMATION LOOP FOR LIVE PREVIEW
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const updateFrame = () => {
      if (!isPlayingRef.current || !startTimeRef.current) return;

      const now = performance.now();
      const elapsedSec = (now - startTimeRef.current) / 1000;
      const progress = Math.min(100, (elapsedSec / totalDuration) * 100);
      setProgressPercent(progress);

      // Kiểm tra xem có đến lượt phát âm từ mới không
      if (elapsedSec >= introTime && elapsedSec < introTime + totalItems * timePerWord) {
        const itemIdx = Math.floor((elapsedSec - introTime) / timePerWord);
        if (itemIdx !== lastSpokenIndexRef.current && itemIdx >= 0 && itemIdx < totalItems) {
          lastSpokenIndexRef.current = itemIdx;
          const wordToSpeak = items[itemIdx]?.en;
          if (wordToSpeak) {
            audioSynth.playSpeech(wordToSpeak, vocabData.voice || 'en-US-AnaNeural', null, {
              rate: vocabData.voiceSpeed || 1.25
            });
          }
        }
      }

      // Khi kết thúc bài học
      if (elapsedSec >= totalDuration) {
        setIsPlaying(false);
        isPlayingRef.current = false;
        renderCanvasFrame(ctx, totalDuration);
        audioSynth.playSuccessFanfare(0.6);
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
        return;
      }

      renderCanvasFrame(ctx, elapsedSec);
      animFrameIdRef.current = requestAnimationFrame(updateFrame);
    };

    if (isPlaying) {
      if (!startTimeRef.current) {
        startTimeRef.current = performance.now();
        lastSpokenIndexRef.current = -1;
      }
      isPlayingRef.current = true;
      animFrameIdRef.current = requestAnimationFrame(updateFrame);
    } else {
      isPlayingRef.current = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      renderCanvasFrame(ctx, 0);
    }

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isPlaying, vocabData]);

  // Initial draw when dataset changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      renderCanvasFrame(ctx, 0);
    }
  }, [vocabData]);

  // PLAY / PAUSE HANDLERS
  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      isPlayingRef.current = false;
    } else {
      startTimeRef.current = performance.now();
      lastSpokenIndexRef.current = -1;
      setIsPlaying(true);
      isPlayingRef.current = true;
    }
  };

  const handleReplay = () => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    setTimeout(() => {
      startTimeRef.current = performance.now();
      lastSpokenIndexRef.current = -1;
      setIsPlaying(true);
      isPlayingRef.current = true;
    }, 50);
  };

  // EXPORT HIGH-QUALITY MP4 / WEBM VIDEO WITH TTS AUDIO
  const handleExportVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsExporting(true);
    setExportProgress(0);
    setIsPlaying(false);
    isExportCancelledRef.current = false;

    try {
      // 1. Tải trước toàn bộ âm thanh TTS
      await preloadAllTTS();

      // 2. Tạo Web Audio Destination Stream & Canvas Capture Stream
      const audioCtx = audioSynth.getAudioContext();
      const dest = audioCtx.createMediaStreamDestination();

      const canvasStream = canvas.captureStream(60);
      const combinedTracks = [
        ...canvasStream.getVideoTracks(),
        ...dest.stream.getAudioTracks()
      ];
      const combinedStream = new MediaStream(combinedTracks);

      // Thử dùng mimeType MP4 trước, nếu không hỗ trợ dùng WebM
      let mimeType = 'video/mp4;codecs=avc1,aac';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm;codecs=vp9,opus';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'video/webm';
        }
      }

      const recorder = new MediaRecorder(combinedStream, {
        mimeType,
        videoBitsPerSecond: 12000000 // 12 Mbps HD quality
      });
      activeRecorderRef.current = recorder;

      const chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      const renderPromise = new Promise((resolve) => {
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: mimeType });
          const url = URL.createObjectURL(blob);
          setExportedBlobUrl(url);
          resolve(url);
        };
      });

      recorder.start(100);

      // 3. Render từng frame chính xác theo thời gian & phát TTS âm thanh vào dest
      const ctx = canvas.getContext('2d');
      const fps = 60;
      const totalFrames = Math.ceil(totalDuration * fps);
      let lastExportSpokenIdx = -1;

      const exportStartWallTime = performance.now();

      for (let frame = 0; frame <= totalFrames; frame++) {
        if (isExportCancelledRef.current) break;

        const targetSec = frame / fps;
        renderCanvasFrame(ctx, targetSec);

        // Phát âm thanh TTS đúng thời điểm vào Audio Destination Stream
        if (targetSec >= introTime && targetSec < introTime + totalItems * timePerWord) {
          const itemIdx = Math.floor((targetSec - introTime) / timePerWord);
          if (itemIdx !== lastExportSpokenIdx && itemIdx >= 0 && itemIdx < totalItems) {
            lastExportSpokenIdx = itemIdx;
            const wordToSpeak = items[itemIdx]?.en;
            if (wordToSpeak) {
              audioSynth.playSpeech(wordToSpeak, vocabData.voice || 'en-US-AnaNeural', dest, {
                rate: vocabData.voiceSpeed || 1.25
              });
            }
          }
        }

        const pct = Math.min(100, Math.round((frame / totalFrames) * 100));
        setExportProgress(pct);

        // Chờ đồng bộ thời gian thực 1:1 với MediaRecorder để giọng phát âm không bị đè hay gấp gáp
        const expectedWallMs = (frame / fps) * 1000;
        const actualWallMs = performance.now() - exportStartWallTime;
        const delayMs = Math.max(0, expectedWallMs - actualWallMs);
        await new Promise((r) => setTimeout(r, delayMs || 4));
      }

      if (!isExportCancelledRef.current) {
        recorder.stop();
        audioSynth.playSuccessFanfare(0.7);
        await renderPromise;
        alert('🎉 Xuất Video Từ Vựng thành công! Bạn có thể tải video xuống ngay.');
      }
    } catch (err) {
      console.error('Export video error:', err);
      alert('❌ Lỗi khi xuất video: ' + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="vocab-preview-container card">
      <div className="preview-header">
        <div className="preview-title-group">
          <Film className="text-secondary" size={22} />
          <div>
            <h2 className="preview-title">Xem Trước Video 9:16 (60FPS)</h2>
            <p className="preview-subtitle">Dạng Video Từ Vựng Kèm Giọng Đọc Tiếng Anh</p>
          </div>
        </div>

        <span className="badge badge-tiktok">
          <Zap size={14} /> TikTok / Shorts 9:16
        </span>
      </div>

      {/* CANVAS PREVIEW 9:16 CONTAINER */}
      <div className="canvas-wrapper-box">
        <canvas
          ref={canvasRef}
          width={1080}
          height={1920}
          className="vocab-preview-canvas"
        />

        {/* Progress overlay */}
        <div className="canvas-progress-bar">
          <div 
            className="canvas-progress-fill" 
            style={{ width: `${progressPercent}%` }} 
          />
        </div>
      </div>

      {/* CONTROLS TOOLBAR */}
      <div className="preview-controls">
        <button 
          className={`btn-primary btn-play ${isPlaying ? 'playing' : ''}`}
          onClick={handleTogglePlay}
          disabled={isExporting}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          {isPlaying ? 'Tạm Dừng' : 'Phát Preview'}
        </button>

        <button 
          className="btn-secondary"
          onClick={handleReplay}
          disabled={isExporting}
        >
          <RotateCcw size={18} /> Xem Từ Đầu
        </button>

        <button 
          className="btn-accent btn-export"
          onClick={handleExportVideo}
          disabled={isExporting}
        >
          {isExporting ? <Sparkles className="spin" size={18} /> : <Download size={18} />}
          {isExporting ? `Đang Xuất (${exportProgress}%)...` : 'Xuất Video MP4 / WebM'}
        </button>
      </div>

      {/* EXPORTED VIDEO DOWNLOAD CARD */}
      {exportedBlobUrl && (
        <div className="exported-download-card">
          <div className="exported-info">
            <CheckCircle className="text-success" size={24} />
            <div>
              <h4 className="exported-title">Video của bạn đã sẵn sàng!</h4>
              <p className="exported-desc">Định dạng MP4/WebM 9:16 với đầy đủ âm thanh giọng đọc Tiếng Anh.</p>
            </div>
          </div>

          <a 
            href={exportedBlobUrl}
            download={`${vocabData.id || 'vocab-video'}_9x16.mp4`}
            className="btn-primary btn-download-file"
          >
            <Download size={18} /> Tải Video Về Máy
          </a>
        </div>
      )}
    </div>
  );
}
