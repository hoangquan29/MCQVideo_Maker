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
  Trophy,
  Volume2,
  CheckCircle,
  ChevronRight
} from 'lucide-react';

const FONT_FAMILY = '"Be Vietnam Pro", "Segoe UI", Tahoma, sans-serif';

// Helper: Tách mã ISO quốc gia (2 ký tự) từ Emoji cờ (Ví dụ: 🇨🇳 -> 'cn', 🇧🇷 -> 'br', 🇺🇸 -> 'us')
const getCountryFlagCode = (text) => {
  if (!text) return null;
  const regex = /[\uD83C][\uDDE6-\uDDFF][\uD83C][\uDDE6-\uDDFF]/g;
  const match = text.match(regex);
  if (match && match.length > 0) {
    const flagEmoji = match[0];
    const codePoints = Array.from(flagEmoji).map(c => c.codePointAt(0));
    if (codePoints.length >= 2) {
      const char1 = String.fromCharCode(codePoints[0] - 0x1F1E6 + 65);
      const char2 = String.fromCharCode(codePoints[1] - 0x1F1E6 + 65);
      return (char1 + char2).toLowerCase();
    }
  }
  return null;
};

// Helper: Loại bỏ Emoji cờ khỏi văn bản để tránh HTML5 Canvas render thành chữ mã "CN", "US"
const cleanNameWithoutEmoji = (text) => {
  if (!text) return '';
  return text.replace(/[\uD83C][\uDDE6-\uDDFF][\uD83C][\uDDE6-\uDDFF]/g, '').trim();
};

const getFlagImageUrl = (flagCode) => {
  if (!flagCode) return null;
  return `https://flagcdn.com/w160/${flagCode}.png`;
};

export default function TopListVideoPreviewCanvas({ topData }) {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0); // 0 = Intro, 1..N = Items, N+1 = Outro
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportedBlobUrl, setExportedBlobUrl] = useState(null);

  // References for timing & rendering
  const animFrameIdRef = useRef(null);
  const startTimeRef = useRef(null);
  const isPlayingRef = useRef(false);
  const isExportCancelledRef = useRef(false);
  const activeRecorderRef = useRef(null);
  const lastSpokenSceneRef = useRef(-1);
  const logoImgRef = useRef(null);
  const imageCacheRef = useRef(new Map());

  const items = topData.items || [];
  const totalItems = items.length || 1;
  const timePerItem = topData.timePerItem || 5.5;
  const introTime = 3.0; // Giây hiển thị màn hình mở đầu (Cover Scene)
  const outroTime = 3.5; // Giây hiển thị màn hình kết thúc (Outro Scene)
  const totalDuration = introTime + totalItems * timePerItem + outroTime;

  // Preload logo2.png
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      logoImgRef.current = img;
    };
    img.src = '/logo2.png';
  }, []);

  // Image preloader helper
  const getImageFromCache = (url) => {
    if (!url) return null;
    if (imageCacheRef.current.has(url)) {
      return imageCacheRef.current.get(url);
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    imageCacheRef.current.set(url, img);
    return img;
  };

  // Preload all item images, cover image & country flags
  useEffect(() => {
    if (topData.coverImage) getImageFromCache(topData.coverImage);
    items.forEach(item => {
      if (item.image) getImageFromCache(item.image);
      const flagCode = getCountryFlagCode(item.name);
      if (flagCode) {
        getImageFromCache(getFlagImageUrl(flagCode));
      }
    });
  }, [topData, items]);

  // Preload TTS Audio for items & title (Chỉ đọc tên item, không đọc chú thích & mô tả)
  const preloadAllTTS = async () => {
    if (!items.length) return;
    const voice = topData.voice || 'vi-VN-HoaiMyNeural';
    const rate = topData.voiceSpeed || 1.5; // Tốc độ đọc 1.5

    const speechList = [
      { text: `${topData.title}. ${topData.subtitle || ''}` },
      ...items.map(item => ({
        text: `Vị trí thứ ${item.rank}: ${cleanNameWithoutEmoji(item.name)}`
      })),
      { text: 'Bạn thích vị trí nào nhất? Hãy để lại bình luận và đăng ký kênh nhé!' }
    ];

    await audioSynth.preloadWordList(speechList, voice, rate);
  };

  useEffect(() => {
    preloadAllTTS();
  }, [topData]);

  // Theme Palette Resolver
  const getThemePalette = (themeName) => {
    switch (themeName) {
      case 'neon-cyber':
        return {
          bgGradStart: '#0d0221',
          bgGradMid: '#0f0c31',
          bgGradEnd: '#150050',
          accentColor: '#00f6ff',
          accentGlow: 'rgba(0, 246, 255, 0.5)',
          badgeBg: 'linear-gradient(135deg, #7928ca, #ff0080)',
          badgeText: '#ffffff',
          cardBg: 'rgba(15, 12, 49, 0.88)',
          cardBorder: '#00f6ff',
          textColor: '#ffffff',
          subtextColor: '#00f6ff'
        };
      case 'blue-ocean':
        return {
          bgGradStart: '#0f172a',
          bgGradMid: '#1e3a8a',
          bgGradEnd: '#0369a1',
          accentColor: '#38bdf8',
          accentGlow: 'rgba(56, 189, 248, 0.5)',
          badgeBg: 'linear-gradient(135deg, #0284c7, #2563eb)',
          badgeText: '#ffffff',
          cardBg: 'rgba(15, 23, 42, 0.88)',
          cardBorder: '#38bdf8',
          textColor: '#ffffff',
          subtextColor: '#7dd3fc'
        };
      case 'red-fire':
        return {
          bgGradStart: '#1a0505',
          bgGradMid: '#450a0a',
          bgGradEnd: '#7f1d1d',
          accentColor: '#fca5a5',
          accentGlow: 'rgba(239, 68, 68, 0.5)',
          badgeBg: 'linear-gradient(135deg, #dc2626, #b91c1c)',
          badgeText: '#ffffff',
          cardBg: 'rgba(26, 5, 5, 0.88)',
          cardBorder: '#ef4444',
          textColor: '#ffffff',
          subtextColor: '#fca5a5'
        };
      case 'gold-luxury':
      default:
        return {
          bgGradStart: '#0a0a0a',
          bgGradMid: '#1a1600',
          bgGradEnd: '#2a2200',
          accentColor: '#ffd700',
          accentGlow: 'rgba(255, 215, 0, 0.5)',
          badgeBg: 'linear-gradient(135deg, #bf953f, #fcf6ba, #b38728, #fbf5b7)',
          badgeText: '#000000',
          cardBg: 'rgba(18, 16, 10, 0.90)',
          cardBorder: '#ffd700',
          textColor: '#ffffff',
          subtextColor: '#ffe875'
        };
    }
  };

  // Canvas Core Renderer Function
  const renderCanvasFrame = (ctx, elapsedSec, customSceneIndex = null) => {
    const width = 1080;
    const height = 1920;
    const theme = getThemePalette(topData.theme || 'gold-luxury');

    // DETERMINE CURRENT SCENE FIRST
    let sceneType = 'intro'; // 'intro' | 'item' | 'outro'
    let currentItemIdx = -1;
    let itemElapsed = 0;

    if (customSceneIndex !== null) {
      if (customSceneIndex === 0) {
        sceneType = 'intro';
      } else if (customSceneIndex > totalItems) {
        sceneType = 'outro';
      } else {
        sceneType = 'item';
        currentItemIdx = customSceneIndex - 1;
        itemElapsed = 1.0;
      }
    } else if (elapsedSec < introTime) {
      sceneType = 'intro';
    } else if (elapsedSec >= introTime + totalItems * timePerItem) {
      sceneType = 'outro';
    } else {
      sceneType = 'item';
      const itemTime = elapsedSec - introTime;
      currentItemIdx = Math.min(totalItems - 1, Math.floor(itemTime / timePerItem));
      itemElapsed = itemTime % timePerItem;
    }

    const currentItem = sceneType === 'item' ? items[currentItemIdx] : null;

    // 1. FULL CANVAS BACKGROUND WITH IMAGE (Sử dụng hình ảnh làm nền video)
    const activeBgImg = sceneType === 'intro' 
      ? getImageFromCache(topData.coverImage) 
      : (sceneType === 'item' ? getImageFromCache(currentItem?.image) : null);

    if (activeBgImg && activeBgImg.complete && activeBgImg.naturalWidth > 0) {
      ctx.save();
      // Scale cover background image to fill 1080x1920
      const imgAspect = activeBgImg.naturalWidth / activeBgImg.naturalHeight;
      const canvasAspect = width / height;
      let drawW, drawH, drawX, drawY;

      if (imgAspect > canvasAspect) {
        drawH = height;
        drawW = height * imgAspect;
        drawX = (width - drawW) / 2;
        drawY = 0;
      } else {
        drawW = width;
        drawH = width / imgAspect;
        drawX = 0;
        drawY = (height - drawH) / 2;
      }

      ctx.drawImage(activeBgImg, drawX, drawY, drawW, drawH);

      // Dark translucent overlay for superior text contrast
      ctx.fillStyle = 'rgba(0, 0, 0, 0.68)';
      ctx.fillRect(0, 0, width, height);

      // Radial Vignette
      const vignette = ctx.createRadialGradient(width / 2, height / 2, 400, width / 2, height / 2, 1200);
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, 'rgba(0,0,0,0.7)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    } else {
      // Fallback Gradient Background
      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      bgGradient.addColorStop(0, theme.bgGradStart);
      bgGradient.addColorStop(0.5, theme.bgGradMid);
      bgGradient.addColorStop(1, theme.bgGradEnd);
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);
    }

    // Decorative Sunburst Light Rays
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.fillStyle = theme.accentGlow;
    for (let i = 0; i < 16; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, 1500, (i * Math.PI) / 8, ((i + 0.3) * Math.PI) / 8);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // 2. BRANDING LOGO WATERMARK
    if (logoImgRef.current && logoImgRef.current.complete && logoImgRef.current.naturalWidth > 0) {
      ctx.save();
      const logoImg = logoImgRef.current;
      const maxW = 180;
      const maxH = 80;
      const aspect = logoImg.naturalWidth / logoImg.naturalHeight;
      let renderW = maxW;
      let renderH = maxW / aspect;
      if (renderH > maxH) {
        renderH = maxH;
        renderW = maxH * aspect;
      }
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 12;
      ctx.drawImage(logoImg, width - renderW - 40, 40, renderW, renderH);
      ctx.restore();
    }

    // Update activeSceneIndex state for UI indicator
    if (customSceneIndex === null) {
      const computedSceneIndex = sceneType === 'intro' ? 0 : (sceneType === 'outro' ? totalItems + 1 : currentItemIdx + 1);
      if (computedSceneIndex !== activeSceneIndex) {
        setActiveSceneIndex(computedSceneIndex);
      }
    }

    // 3. SCENE 0: COVER / INTRO SCENE
    if (sceneType === 'intro') {
      const progress = Math.min(1, elapsedSec / introTime);

      // Top Icon Header
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '80px ' + FONT_FAMILY;
      ctx.fillText(topData.headerIcon || '🏆', width / 2, 220);

      // Main Title Box (Tăng khoảng cách dòng chữ)
      ctx.font = '900 62px ' + FONT_FAMILY;
      const titleLines = wrapText(ctx, topData.title || 'TOP 10 CÔNG TY LỚN NHẤT THẾ GIỚI', 900);

      const titleBoxW = 980;
      const titleBoxH = Math.max(240, titleLines.length * 95 + (topData.subtitle ? 90 : 60));
      const titleBoxX = (width - titleBoxW) / 2;
      const titleBoxY = 310;

      // Card Backdrop Glassmorphism
      ctx.fillStyle = theme.cardBg;
      ctx.strokeStyle = theme.cardBorder;
      ctx.lineWidth = 6;
      ctx.shadowColor = theme.accentGlow;
      ctx.shadowBlur = 25;
      ctx.beginPath();
      ctx.roundRect(titleBoxX, titleBoxY, titleBoxW, titleBoxH, 32);
      ctx.fill();
      ctx.stroke();

      // Title Text Lines với khoảng cách dòng thoáng (95px)
      ctx.fillStyle = theme.accentColor;
      ctx.textAlign = 'center';
      titleLines.forEach((line, i) => {
        ctx.fillText(line, width / 2, titleBoxY + 80 + i * 95);
      });

      // Subtitle Badge
      if (topData.subtitle) {
        ctx.font = '600 36px ' + FONT_FAMILY;
        ctx.fillStyle = '#ffffff';
        ctx.fillText(topData.subtitle, width / 2, titleBoxY + titleBoxH - 45);
      }
      ctx.restore();

      // Cover Image Display with Ken Burns Effect
      const coverImg = getImageFromCache(topData.coverImage);
      if (coverImg && coverImg.complete && coverImg.naturalWidth > 0) {
        ctx.save();
        const imgW = 960;
        const imgH = 960;
        const imgX = (width - imgW) / 2;
        const imgY = titleBoxY + titleBoxH + 50;

        ctx.beginPath();
        ctx.roundRect(imgX, imgY, imgW, imgH, 28);
        ctx.clip();

        // Ken Burns zoom scale
        const zoom = 1.0 + 0.08 * progress;
        const wScaled = imgW * zoom;
        const hScaled = imgH * zoom;
        const dx = imgX - (wScaled - imgW) / 2;
        const dy = imgY - (hScaled - imgH) / 2;

        ctx.drawImage(coverImg, dx, dy, wScaled, hScaled);

        // Frame border
        ctx.restore();
        ctx.save();
        ctx.strokeStyle = theme.accentColor;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.roundRect(imgX, imgY, imgW, imgH, 28);
        ctx.stroke();
        ctx.restore();
      }

      // Bottom Swipe Hint Banner
      ctx.save();
      ctx.font = '700 38px ' + FONT_FAMILY;
      ctx.fillStyle = theme.accentColor;
      ctx.textAlign = 'center';
      ctx.fillText('⚡ BẮT ĐẦU XẾP HẠNG ĐẾM NGƯỢC ⚡', width / 2, 1780);
      ctx.restore();

      return;
    }

    // 4. SCENE OUTRO: ENDING RECAP & CONFETTI
    if (sceneType === 'outro') {
      ctx.save();
      ctx.textAlign = 'center';

      // Trophy Icon
      ctx.font = '120px ' + FONT_FAMILY;
      ctx.fillText('👑🏆✨', width / 2, 350);

      // Outro Title Card
      const outroBoxW = 960;
      const outroBoxH = 520;
      const outroBoxX = (width - outroBoxW) / 2;
      const outroBoxY = 550;

      ctx.fillStyle = theme.cardBg;
      ctx.strokeStyle = theme.accentColor;
      ctx.lineWidth = 8;
      ctx.shadowColor = theme.accentGlow;
      ctx.shadowBlur = 30;
      ctx.beginPath();
      ctx.roundRect(outroBoxX, outroBoxY, outroBoxW, outroBoxH, 36);
      ctx.fill();
      ctx.stroke();

      ctx.font = '900 58px ' + FONT_FAMILY;
      ctx.fillStyle = theme.accentColor;
      ctx.fillText('BẠN THÍCH MỤC NÀO NHẤT?', width / 2, outroBoxY + 130);

      ctx.font = '600 42px ' + FONT_FAMILY;
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Hãy để lại Bình Luận phía dưới nhé!', width / 2, outroBoxY + 240);

      ctx.font = '800 48px ' + FONT_FAMILY;
      ctx.fillStyle = '#ff4757';
      ctx.fillText('❤️ LIKE & ĐĂNG KÝ KÊNH ❤️', width / 2, outroBoxY + 380);

      ctx.restore();
      return;
    }

    // 5. SCENE ITEMS: COUNTDOWN SCENES (ITEM 10 DOWN TO ITEM 1)
    if (!currentItem) return;

    const rank = currentItem.rank;
    const isTop1 = rank === 1;

    // A. RANK BADGE (HUY HIỆU THỨ HẠNG KHỔNG LỒ NỔI BẬT)
    ctx.save();
    const badgeW = isTop1 ? 460 : 400;
    const badgeH = 130;
    const badgeX = (width - badgeW) / 2;
    const badgeY = 120;

    ctx.shadowColor = isTop1 ? 'rgba(255, 215, 0, 0.9)' : theme.accentGlow;
    ctx.shadowBlur = isTop1 ? 40 : 20;

    const bGrad = ctx.createLinearGradient(badgeX, badgeY, badgeX + badgeW, badgeY + badgeH);
    if (isTop1) {
      bGrad.addColorStop(0, '#ffd700');
      bGrad.addColorStop(0.5, '#fff5a5');
      bGrad.addColorStop(1, '#ffaa00');
    } else {
      bGrad.addColorStop(0, '#2563eb');
      bGrad.addColorStop(1, '#1d4ed8');
    }

    ctx.fillStyle = bGrad;
    ctx.strokeStyle = isTop1 ? '#ffffff' : theme.accentColor;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 30);
    ctx.fill();
    ctx.stroke();

    ctx.font = '900 60px ' + FONT_FAMILY;
    ctx.fillStyle = isTop1 ? '#000000' : '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(currentItem.badge || `TOP ${rank}`, width / 2, badgeY + badgeH / 2);
    ctx.restore();

    // B. ITEM NAME BANNER (TÊN VỊ TRÍ + HIỂN THỊ QUỐC KỲ SẮC NÉT + KHOẢNG CÁCH DÒNG THOÁNG)
    ctx.save();

    // Lấy thông tin cờ quốc gia từ emoji hoặc tên
    const flagCode = getCountryFlagCode(currentItem.name);
    const cleanName = cleanNameWithoutEmoji(currentItem.name);

    ctx.font = '900 62px ' + FONT_FAMILY;
    const nameLines = wrapText(ctx, cleanName, 880);
    
    // Tăng khoảng cách dòng chữ (90px) & chiều cao hộp
    const nameBoxW = 980;
    const nameBoxH = Math.max(160, nameLines.length * 90 + (currentItem.metric ? 80 : 50));
    const nameBoxX = (width - nameBoxW) / 2;
    const nameBoxY = 280;

    ctx.fillStyle = theme.cardBg;
    ctx.strokeStyle = theme.cardBorder;
    ctx.lineWidth = 5;
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.roundRect(nameBoxX, nameBoxY, nameBoxW, nameBoxH, 28);
    ctx.fill();
    ctx.stroke();

    // Render Tên mục với khoảng cách dòng lớn
    ctx.fillStyle = theme.accentColor;
    ctx.textAlign = 'center';
    nameLines.forEach((line, i) => {
      const lineY = nameBoxY + 75 + i * 90;
      
      // Nếu có lá cờ quốc gia (FlagCDN), vẽ cờ sắc nét ngay bên cạnh chữ tên!
      const flagImg = flagCode ? getImageFromCache(getFlagImageUrl(flagCode)) : null;
      if (flagImg && flagImg.complete && flagImg.naturalWidth > 0) {
        const textWidth = ctx.measureText(line).width;
        const flagW = 72;
        const flagH = 48;
        const totalW = textWidth + flagW + 20;
        const startX = (width - totalW) / 2;

        // Draw Text
        ctx.textAlign = 'left';
        ctx.fillText(line, startX, lineY);

        // Draw Flag Image with rounded shadow badge
        const flagX = startX + textWidth + 18;
        const flagY = lineY - flagH + 8;

        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.roundRect(flagX, flagY, flagW, flagH, 8);
        ctx.clip();
        ctx.drawImage(flagImg, flagX, flagY, flagW, flagH);
        ctx.restore();

        // Flag Border
        ctx.save();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(flagX, flagY, flagW, flagH, 8);
        ctx.stroke();
        ctx.restore();
      } else {
        ctx.textAlign = 'center';
        ctx.fillText(line, width / 2, lineY);
      }
    });

    // Metric Badge (Chỉ số Vốn hóa / Diện tích với khoảng cách dòng rõ ràng)
    if (currentItem.metric) {
      ctx.font = '700 40px ' + FONT_FAMILY;
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(currentItem.metric, width / 2, nameBoxY + nameBoxH - 35);
    }
    ctx.restore();

    // C. ITEM IMAGE (HÌNH ẢNH MỤC VỚI HIỆU ỨNG KEN BURNS)
    const itemImg = getImageFromCache(currentItem.image);
    const imgW = 960;
    const imgH = 780;
    const imgX = (width - imgW) / 2;
    const imgY = nameBoxY + nameBoxH + 35;

    if (itemImg && itemImg.complete && itemImg.naturalWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(imgX, imgY, imgW, imgH, 28);
      ctx.clip();

      const zoom = 1.0 + 0.07 * (itemElapsed / timePerItem);
      const wScaled = imgW * zoom;
      const hScaled = imgH * zoom;
      const dx = imgX - (wScaled - imgW) / 2;
      const dy = imgY - (hScaled - imgH) / 2;

      ctx.drawImage(itemImg, dx, dy, wScaled, hScaled);
      ctx.restore();

      // Frame Border
      ctx.save();
      ctx.strokeStyle = isTop1 ? '#ffd700' : theme.accentColor;
      ctx.lineWidth = isTop1 ? 8 : 5;
      ctx.shadowColor = isTop1 ? 'rgba(255, 215, 0, 0.6)' : 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.roundRect(imgX, imgY, imgW, imgH, 28);
      ctx.stroke();
      ctx.restore();
    }

    // D. DESCRIPTION CARD (KHUNG MÔ TẢ CHI TIẾT PHÍA DƯỚI - TĂNG KHOẢNG CÁCH DÒNG THOÁNG)
    if (currentItem.description) {
      ctx.save();
      const descBoxW = 960;
      const descBoxH = 340;
      const descBoxX = (width - descBoxW) / 2;
      const descBoxY = imgY + imgH + 35;

      ctx.fillStyle = theme.cardBg;
      ctx.strokeStyle = theme.cardBorder;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(descBoxX, descBoxY, descBoxW, descBoxH, 24);
      ctx.fill();
      ctx.stroke();

      ctx.font = '500 38px ' + FONT_FAMILY;
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';

      // Khoảng cách dòng trong khung mô tả tăng từ 55px lên 68px
      const descLines = wrapText(ctx, currentItem.description, descBoxW - 80);
      descLines.forEach((line, i) => {
        if (i < 4) { // Tối đa 4 dòng
          ctx.fillText(line, descBoxX + 40, descBoxY + 75 + i * 68);
        }
      });

      ctx.restore();
    }
  };

  // Canvas Text Wrapper Utility
  const wrapText = (ctx, text, maxWidth) => {
    if (!text) return [];
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0] || '';

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  };

  // Sound & Speech Synchronizer (CHỈ ĐỌC TÊN MỤC, KHÔNG ĐỌC CHÚ THÍCH VÀ MÔ TẢ, TỐC ĐỘ 1.5)
  const handleAudioForTime = (elapsedSec) => {
    if (!isPlayingRef.current) return;

    let sceneIndex = 0;
    if (elapsedSec < introTime) {
      sceneIndex = 0;
    } else if (elapsedSec >= introTime + totalItems * timePerItem) {
      sceneIndex = totalItems + 1;
    } else {
      sceneIndex = Math.floor((elapsedSec - introTime) / timePerItem) + 1;
    }

    if (sceneIndex !== lastSpokenSceneRef.current) {
      lastSpokenSceneRef.current = sceneIndex;

      // Play rank pop sound effect for items
      if (sceneIndex >= 1 && sceneIndex <= totalItems) {
        const item = items[sceneIndex - 1];
        const isTop1 = item && item.rank === 1;
        if (isTop1) {
          audioSynth.playFanfareSound(0.8);
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        } else {
          audioSynth.playTickingSound(0.7, null, true);
        }
      } else if (sceneIndex === totalItems + 1) {
        audioSynth.playFanfareSound(0.9);
        confetti({ particleCount: 160, spread: 100, origin: { y: 0.5 } });
      }

      // Speak TTS text (Chỉ đọc tiêu đề / tên mục, tốc độ 1.5)
      const voice = topData.voice || 'vi-VN-HoaiMyNeural';
      const rate = topData.voiceSpeed || 1.5;

      let textToSpeak = '';
      if (sceneIndex === 0) {
        textToSpeak = `${topData.title}. ${topData.subtitle || ''}`;
      } else if (sceneIndex >= 1 && sceneIndex <= totalItems) {
        const item = items[sceneIndex - 1];
        // CHỈ ĐỌC TÊN MỤC!
        textToSpeak = `Vị trí thứ ${item.rank}: ${cleanNameWithoutEmoji(item.name)}`;
      } else if (sceneIndex === totalItems + 1) {
        textToSpeak = 'Bạn thích vị trí nào nhất? Hãy để lại bình luận và đăng ký kênh nhé!';
      }

      if (textToSpeak) {
        TTSService.speak(textToSpeak, { voice, speed: rate });
      }
    }
  };

  // Main Animation Loop for Live Preview
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsedSec = (timestamp - startTimeRef.current) / 1000;

      if (elapsedSec >= totalDuration) {
        setIsPlaying(false);
        isPlayingRef.current = false;
        setProgressPercent(100);
        renderCanvasFrame(ctx, totalDuration);
        return;
      }

      renderCanvasFrame(ctx, elapsedSec);
      setProgressPercent((elapsedSec / totalDuration) * 100);
      handleAudioForTime(elapsedSec);

      if (isPlayingRef.current) {
        animFrameIdRef.current = requestAnimationFrame(animate);
      }
    };

    if (isPlaying) {
      isPlayingRef.current = true;
      audioSynth.init();
      animFrameIdRef.current = requestAnimationFrame(animate);
    } else {
      isPlayingRef.current = false;
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      renderCanvasFrame(ctx, 0, activeSceneIndex);
    }

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isPlaying, topData, activeSceneIndex]);

  // Jump to specific scene
  const handleJumpToScene = (sceneIndex) => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    setActiveSceneIndex(sceneIndex);
    lastSpokenSceneRef.current = sceneIndex;

    let targetTime = 0;
    if (sceneIndex === 0) {
      targetTime = 0;
    } else if (sceneIndex > totalItems) {
      targetTime = introTime + totalItems * timePerItem + 0.5;
    } else {
      targetTime = introTime + (sceneIndex - 1) * timePerItem + 0.5;
    }

    setProgressPercent((targetTime / totalDuration) * 100);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      renderCanvasFrame(ctx, targetTime, sceneIndex);
    }
  };

  // Export Video Handler (MediaRecorder Offscreen Video Generation - CHỈ ĐỌC TÊN, TỐC ĐỘ 1.5)
  const handleExportVideo = async () => {
    if (isExporting) return;
    setIsExporting(true);
    setExportProgress(0);
    setExportedBlobUrl(null);
    isExportCancelledRef.current = false;

    try {
      const canvas = canvasRef.current;
      if (!canvas) throw new Error('Không tìm thấy Canvas element!');

      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = 1080;
      exportCanvas.height = 1920;
      const eCtx = exportCanvas.getContext('2d');

      const audioCtx = audioSynth.getAudioContext();
      const mediaDest = audioCtx.createMediaStreamDestination();

      const canvasStream = exportCanvas.captureStream(30);
      const combinedStream = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...mediaDest.stream.getAudioTracks()
      ]);

      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
        ? 'video/webm;codecs=vp9,opus'
        : 'video/webm';

      const recorder = new MediaRecorder(combinedStream, { mimeType, videoBitsPerSecond: 8000000 });
      activeRecorderRef.current = recorder;

      const chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      const recordPromise = new Promise((resolve) => {
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          resolve(blob);
        };
      });

      recorder.start();

      const voice = topData.voice || 'vi-VN-HoaiMyNeural';
      const rate = topData.voiceSpeed || 1.5; // Tốc độ đọc 1.5

      const fps = 30;
      const totalFrames = Math.floor(totalDuration * fps);
      let lastSpokenExportScene = -1;

      for (let frame = 0; frame <= totalFrames; frame++) {
        if (isExportCancelledRef.current) break;

        const timeSec = frame / fps;
        renderCanvasFrame(eCtx, timeSec);

        let sceneIndex = 0;
        if (timeSec < introTime) {
          sceneIndex = 0;
        } else if (timeSec >= introTime + totalItems * timePerItem) {
          sceneIndex = totalItems + 1;
        } else {
          sceneIndex = Math.floor((timeSec - introTime) / timePerItem) + 1;
        }

        if (sceneIndex !== lastSpokenExportScene) {
          lastSpokenExportScene = sceneIndex;
          if (sceneIndex >= 1 && sceneIndex <= totalItems) {
            const item = items[sceneIndex - 1];
            if (item && item.rank === 1) {
              audioSynth.playFanfareSound(0.8, mediaDest);
            } else {
              audioSynth.playTickingSound(0.7, mediaDest, true);
            }
          }

          let textToSpeak = '';
          if (sceneIndex === 0) {
            textToSpeak = `${topData.title}. ${topData.subtitle || ''}`;
          } else if (sceneIndex >= 1 && sceneIndex <= totalItems) {
            const item = items[sceneIndex - 1];
            // CHỈ ĐỌC TÊN MỤC!
            textToSpeak = `Vị trí thứ ${item.rank}: ${cleanNameWithoutEmoji(item.name)}`;
          } else if (sceneIndex === totalItems + 1) {
            textToSpeak = 'Bạn thích vị trí nào nhất? Hãy để lại bình luận và đăng ký kênh nhé!';
          }

          if (textToSpeak) {
            TTSService.speak(textToSpeak, { voice, speed: rate }, mediaDest);
          }
        }

        setExportProgress(Math.floor((frame / totalFrames) * 100));
        await new Promise(r => setTimeout(r, 1000 / fps));
      }

      recorder.stop();
      const videoBlob = await recordPromise;

      if (!isExportCancelledRef.current) {
        const blobUrl = URL.createObjectURL(videoBlob);
        setExportedBlobUrl(blobUrl);
      }
    } catch (err) {
      console.error('Lỗi khi render video:', err);
      alert('Lỗi xuất video: ' + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="vocab-preview-container card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Header Bar */}
      <div className="preview-header" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Film className="text-primary" size={22} />
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#fff' }}>Xem Trước Canvas Video 9:16</h3>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Định dạng Shorts / TikTok / Reels (1080x1920)</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.82rem', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
            Theme: {topData.theme || 'gold-luxury'}
          </span>
        </div>
      </div>

      {/* 9:16 Aspect Ratio Canvas Container */}
      <div 
        className="canvas-wrapper"
        style={{ 
          position: 'relative', 
          width: '100%', 
          maxWidth: '380px', 
          aspectRatio: '9 / 16', 
          background: '#000', 
          borderRadius: '16px', 
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
          border: '2px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <canvas 
          ref={canvasRef}
          width={1080}
          height={1920}
          style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }}
        />

        {/* Floating Scene Badge Overlay */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', color: '#ffd700', padding: '0.3rem 0.7rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 'bold' }}>
          {activeSceneIndex === 0 ? '🎬 Cover Intro Scene' : (activeSceneIndex > totalItems ? '🎉 Outro Scene' : `🏆 Rank #${items[activeSceneIndex - 1]?.rank || activeSceneIndex}`)}
        </div>
      </div>

      {/* Timeline Controls */}
      <div className="preview-controls-box" style={{ width: '100%', marginTop: '1rem' }}>
        {/* Progress Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
          <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
            <div 
              style={{ 
                height: '100%', 
                width: `${progressPercent}%`, 
                background: 'linear-gradient(90deg, #3b82f6, #ffd700)', 
                transition: 'width 0.1s linear' 
              }} 
            />
          </div>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', minWidth: '45px', textAlign: 'right' }}>
            {Math.round(progressPercent)}%
          </span>
        </div>

        {/* Buttons Row */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button 
            type="button" 
            className={`btn-${isPlaying ? 'secondary' : 'primary'}`}
            onClick={() => {
              if (isPlaying) {
                setIsPlaying(false);
              } else {
                startTimeRef.current = null;
                lastSpokenSceneRef.current = -1;
                setIsPlaying(true);
              }
            }}
            style={{ padding: '0.6rem 1.4rem' }}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            {isPlaying ? 'Tạm Dừng' : 'Phát Video'}
          </button>

          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => handleJumpToScene(0)}
            title="Phát lại từ đầu"
          >
            <RotateCcw size={16} /> Đầu
          </button>

          <button 
            type="button" 
            className="btn-secondary btn-sm"
            onClick={() => handleJumpToScene(activeSceneIndex + 1 > totalItems + 1 ? 0 : activeSceneIndex + 1)}
            title="Chuyển sang cảnh tiếp theo"
          >
            Tiếp <ChevronRight size={14} />
          </button>
        </div>

        {/* Jump to Specific Item Scene Pills */}
        <div className="scene-pills-row" style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', padding: '0.6rem 0', marginTop: '0.5rem', justifyContent: 'center' }}>
          <button 
            type="button"
            className={`pill-btn ${activeSceneIndex === 0 ? 'active' : ''}`}
            onClick={() => handleJumpToScene(0)}
            style={{ padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', background: activeSceneIndex === 0 ? '#3b82f6' : 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', cursor: 'pointer' }}
          >
            Bìa
          </button>

          {items.map((item, idx) => (
            <button 
              key={item.id || idx}
              type="button"
              className={`pill-btn ${activeSceneIndex === idx + 1 ? 'active' : ''}`}
              onClick={() => handleJumpToScene(idx + 1)}
              style={{ padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', background: activeSceneIndex === idx + 1 ? '#ffd700' : 'rgba(255,255,255,0.08)', color: activeSceneIndex === idx + 1 ? '#000' : '#fff', fontWeight: activeSceneIndex === idx + 1 ? 'bold' : 'normal', border: 'none', cursor: 'pointer' }}
            >
              #{item.rank}
            </button>
          ))}

          <button 
            type="button"
            className={`pill-btn ${activeSceneIndex === totalItems + 1 ? 'active' : ''}`}
            onClick={() => handleJumpToScene(totalItems + 1)}
            style={{ padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', background: activeSceneIndex === totalItems + 1 ? '#ef4444' : 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', cursor: 'pointer' }}
          >
            Kết
          </button>
        </div>

        {/* Video Render & Download Section */}
        <div style={{ marginTop: '1.2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
          {isExporting ? (
            <div style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid #3b82f6', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginBottom: '0.5rem', color: '#60a5fa', fontWeight: 'bold' }}>
                <Sparkles className="animate-spin" size={18} /> Đang Render & Tổng Hợp Video Top List ({exportProgress}%)...
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${exportProgress}%`, background: '#3b82f6', transition: 'width 0.2s' }} />
              </div>
            </div>
          ) : exportedBlobUrl ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ color: '#4ade80', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle size={18} /> Render Video Hoàn Tất!
              </div>
              <a 
                href={exportedBlobUrl}
                download={`${topData.id || 'top-list-video'}.webm`}
                className="btn-primary"
                style={{ padding: '0.75rem 1.8rem', background: 'linear-gradient(135deg, #22c55e, #16a34a)', textDecoration: 'none' }}
              >
                <Download size={18} /> Tải Video Về Máy (.WebM / MP4)
              </a>
            </div>
          ) : (
            <button 
              type="button"
              className="btn-primary"
              onClick={handleExportVideo}
              style={{ width: '100%', justifyContent: 'center', padding: '0.8rem', background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
            >
              <Zap size={18} /> Xuất & Tải File Video Top List (.WebM / MP4)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
