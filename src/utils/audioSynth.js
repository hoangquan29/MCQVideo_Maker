// Web Audio API Synthesizer & TTS Audio Pipeline
// Kết nối trực tiếp toàn bộ âm thanh (Đếm ngược, Chuông, Nhạc mừng, Giọng đọc) vào AudioContext Stream Destination

export const VIETNAMESE_VOICES = [
  { id: 'vi-VN-HoaiMyNeural', name: '👩 Hoài Mỹ (Nữ Edge AI - Truyền cảm, Tự nhiên)', accent: 'Nữ Miền Bắc/Nam', type: 'neural' },
  { id: 'vi-VN-NamMinhNeural', name: '👨 Nam Minh (Nam Edge AI - Ấm áp, Truyền cảm)', accent: 'Nam Chuẩn', type: 'neural' },
  { id: 'vi-VN-Standard', name: '🇻🇳 Google Tiếng Việt (Giọng Chuẩn Quốc Gia)', accent: 'Tiêu chuẩn', type: 'google' },
  { id: 'vi-VN-System', name: '🎙️ Giọng Trình Duyệt Máy (Web Speech API System)', accent: 'Tự động quét máy', type: 'system' }
];

export const ENGLISH_VOICES = [
  { id: 'en-US-AnaNeural', name: '🇺🇸 Ana (Nữ Anh - Mỹ / US Accent)', accent: 'US Female', type: 'neural' },
  { id: 'en-US-GuyNeural', name: '🇺🇸 Guy (Nam Anh - Mỹ / US Accent)', accent: 'US Male', type: 'neural' },
  { id: 'en-GB-SoniaNeural', name: '🇬🇧 Sonia (Nữ Anh - Anh / UK Accent)', accent: 'UK Female', type: 'neural' }
];

class AudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.audioCache = new Map(); // Cache TTS MP3 buffers
    this.systemVoices = [];

    // Tự động nạp danh sách giọng đọc từ trình duyệt khi sẵn sàng
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        this.systemVoices = window.speechSynthesis.getVoices();
      };
      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }

  // Quét và trả về danh sách giọng đọc Tiếng Việt có sẵn trên máy người dùng
  getSystemVietnameseVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const voices = window.speechSynthesis.getVoices();
      return voices.filter(v => v.lang && (v.lang.toLowerCase().includes('vi') || v.name.toLowerCase().includes('vietnam') || v.name.toLowerCase().includes('vietnamese')));
    }
    return [];
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  getAudioContext() {
    return this.init();
  }

  // 1. Tiếng tích tắc đếm ngược (âm sắc gọn, giòn hơn - phong cách hậu kỳ chuyên nghiệp)
  // urgent=true khi chỉ còn ít giây, tiếng tick cao và gấp hơn để tạo cảm giác hồi hộp
  playTickingSound(volume = 0.6, customDest = null, urgent = false) {
    try {
      this.init();
      const dest = customDest || this.ctx.destination;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const baseFreq = urgent ? 1150 : 850;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, now + 0.07);

      gain.gain.setValueAtTime(volume * (urgent ? 0.85 : 0.65), now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.07);

      // Lớp "click" siêu ngắn chồng lên để tiếng tick nghe sắc nét, chuyên nghiệp hơn
      const clickOsc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      clickOsc.type = 'square';
      clickOsc.frequency.setValueAtTime(baseFreq * 2.2, now);
      clickGain.gain.setValueAtTime(volume * 0.12, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
      clickOsc.connect(clickGain);
      clickGain.connect(dest);
      clickOsc.start(now);
      clickOsc.stop(now + 0.02);
    } catch (e) {
      console.warn('Audio tick error:', e);
    }
  }

  // 2. Tiếng chuông hết giờ (Alarm Bell) - hoà âm chuông nhiều lớp, đuôi âm ngân dài tự nhiên hơn
  playAlarmBell(volume = 0.8, customDest = null) {
    try {
      this.init();
      const dest = customDest || this.ctx.destination;
      const now = this.ctx.currentTime;

      [0, 0.15, 0.3].forEach((delay) => {
        // Tần số gốc
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now + delay);
        osc.frequency.exponentialRampToValueAtTime(600, now + delay + 0.5);
        gain.gain.setValueAtTime(volume, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.5);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(now + delay);
        osc.stop(now + delay + 0.5);

        // Bồi âm (harmonic) nhẹ để tiếng chuông có chiều sâu, giống chuông thật hơn
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1800, now + delay);
        osc2.frequency.exponentialRampToValueAtTime(900, now + delay + 0.35);
        gain2.gain.setValueAtTime(volume * 0.3, now + delay);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.35);
        osc2.connect(gain2);
        gain2.connect(dest);
        osc2.start(now + delay);
        osc2.stop(now + delay + 0.35);
      });
    } catch (e) {
      console.warn('Audio alarm bell error:', e);
    }
  }

  // 3. Tiếng nhạc chúc mừng đáp án (Victory Fanfare) - hợp âm dày hơn, có bồi âm ngân vang
  playSuccessFanfare(volume = 0.6, customDest = null) {
    try {
      this.init();
      const dest = customDest || this.ctx.destination;
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

      notes.forEach((freq, index) => {
        const t0 = now + index * 0.09;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t0);
        gain.gain.setValueAtTime(volume, t0);
        gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.45);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(t0);
        osc.stop(t0 + 0.45);

        // Bồi âm quãng 8 mỏng nhẹ tạo độ "sáng" và sang trọng hơn cho hợp âm
        const oscHi = this.ctx.createOscillator();
        const gainHi = this.ctx.createGain();
        oscHi.type = 'sine';
        oscHi.frequency.setValueAtTime(freq * 2, t0);
        gainHi.gain.setValueAtTime(volume * 0.18, t0);
        gainHi.gain.exponentialRampToValueAtTime(0.001, t0 + 0.35);
        oscHi.connect(gainHi);
        gainHi.connect(dest);
        oscHi.start(t0);
        oscHi.stop(t0 + 0.35);
      });

      // Hợp âm cuối cùng ngân dài (chord pad) để kết thúc mượt mà, cảm giác "điện ảnh"
      const chordT0 = now + notes.length * 0.09;
      [1046.50, 1318.51, 1567.98].forEach((freq) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, chordT0);
        gain.gain.setValueAtTime(volume * 0.32, chordT0);
        gain.gain.exponentialRampToValueAtTime(0.001, chordT0 + 0.9);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(chordT0);
        osc.stop(chordT0 + 0.9);
      });
    } catch (e) {
      console.warn('Audio fanfare error:', e);
    }
  }

  // 3b. Tiếng bíp bíp (Double Beep) khi công bố đáp án
  playDoubleBeep(volume = 0.7, customDest = null) {
    try {
      this.init();
      const dest = customDest || this.ctx.destination;
      const now = this.ctx.currentTime;

      [0, 0.12].forEach((delay) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1050, now + delay);
        gain.gain.setValueAtTime(volume, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.08);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(now + delay);
        osc.stop(now + delay + 0.08);
      });
    } catch (e) {
      console.warn('Audio double beep error:', e);
    }
  }

  // 3c. Tiếng hiệu ứng âm thanh bắn pháo hoa nổ & tí tách (Fireworks Burst & Crackles)
  playFireworksSound(volume = 0.85, customDest = null) {
    try {
      this.init();
      const dest = customDest || this.ctx.destination;
      const now = this.ctx.currentTime;

      // 1. Tiếng pháo hoa vút lên (Rocket Whistle)
      const whistleOsc = this.ctx.createOscillator();
      const whistleGain = this.ctx.createGain();
      whistleOsc.type = 'sine';
      whistleOsc.frequency.setValueAtTime(350, now);
      whistleOsc.frequency.exponentialRampToValueAtTime(1600, now + 0.16);
      whistleGain.gain.setValueAtTime(volume * 0.45, now);
      whistleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      whistleOsc.connect(whistleGain);
      whistleGain.connect(dest);
      whistleOsc.start(now);
      whistleOsc.stop(now + 0.16);

      // 2. Vụ nổ chính (Main Boom Explosion - Low Sub-Bass + Noise Burst)
      const explosionT = now + 0.16;

      // Sub-bass thump
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(140, explosionT);
      subOsc.frequency.exponentialRampToValueAtTime(35, explosionT + 0.38);
      subGain.gain.setValueAtTime(volume * 0.95, explosionT);
      subGain.gain.exponentialRampToValueAtTime(0.001, explosionT + 0.38);
      subOsc.connect(subGain);
      subGain.connect(dest);
      subOsc.start(explosionT);
      subOsc.stop(explosionT + 0.38);

      // Noise burst cho tiếng nổ vang
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.28);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        noiseData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(1400, explosionT);
      noiseFilter.frequency.exponentialRampToValueAtTime(200, explosionT + 0.28);
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(volume * 0.85, explosionT);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, explosionT + 0.28);
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(dest);
      noise.start(explosionT);
      noise.stop(explosionT + 0.28);

      // 3. Chuỗi tiếng tí tách / lốp bốp pháo hoa lung linh (Secondary Sparkling Crackles)
      const crackleDelays = [0.22, 0.28, 0.35, 0.42, 0.49, 0.56, 0.63, 0.70];
      crackleDelays.forEach((delay, idx) => {
        const crackleT = now + delay;
        const popOsc = this.ctx.createOscillator();
        const popGain = this.ctx.createGain();
        popOsc.type = idx % 2 === 0 ? 'triangle' : 'square';
        const popFreq = 1800 + Math.random() * 1500;
        popOsc.frequency.setValueAtTime(popFreq, crackleT);
        popOsc.frequency.exponentialRampToValueAtTime(popFreq * 0.2, crackleT + 0.045);

        popGain.gain.setValueAtTime(volume * Math.max(0.08, 0.38 - idx * 0.04), crackleT);
        popGain.gain.exponentialRampToValueAtTime(0.001, crackleT + 0.045);

        popOsc.connect(popGain);
        popGain.connect(dest);
        popOsc.start(crackleT);
        popOsc.stop(crackleT + 0.045);
      });
    } catch (e) {
      console.warn('Audio fireworks error:', e);
    }
  }

  // 4. Tiếng "whoosh" chuyển cảnh giữa các câu hỏi - tạo cảm giác dựng phim chuyên nghiệp
  playWhoosh(volume = 0.35, customDest = null) {
    try {
      this.init();
      const dest = customDest || this.ctx.destination;
      const now = this.ctx.currentTime;

      const bufferSize = this.ctx.sampleRate * 0.35;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(2400, now + 0.32);
      filter.Q.value = 0.9;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(volume, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.34);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(dest);
      noise.start(now);
      noise.stop(now + 0.35);
    } catch (e) {
      console.warn('Audio whoosh error:', e);
    }
  }

  // 5. Tiếng gõ bàn phím cơ (Mechanical Keyboard Click) - giả lập âm thanh switch giòn tan
  playKeyboardClickSound(volume = 0.25, customDest = null) {
    try {
      this.init();
      const dest = customDest || this.ctx.destination;
      const now = this.ctx.currentTime;

      // Noise burst cho độ "giòn" của switch
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.015);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1800 + Math.random() * 600, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(volume * (0.8 + Math.random() * 0.4), now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.014);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(dest);
      noise.start(now);
      noise.stop(now + 0.015);

      // Thêm một tone tần số gỗ (keycap thock)
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      const pitch = 700 + Math.random() * 400;
      osc.frequency.setValueAtTime(pitch, now);
      osc.frequency.exponentialRampToValueAtTime(pitch * 0.3, now + 0.012);
      oscGain.gain.setValueAtTime(volume * 0.35, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);

      osc.connect(oscGain);
      oscGain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.012);
    } catch (e) {
      console.warn('Audio keyboard click error:', e);
    }
  }

  // Decode Audio Data Safe Helper (chống treo/crash audio context)
  decodeAudioDataSafe(arrayBuffer) {
    return new Promise((resolve) => {
      try {
        if (!arrayBuffer || arrayBuffer.byteLength === 0) {
          return resolve(null);
        }
        const promise = this.ctx.decodeAudioData(
          arrayBuffer,
          (buf) => resolve(buf),
          () => resolve(null)
        );
        if (promise && typeof promise.then === 'function') {
          promise.then(resolve).catch(() => resolve(null));
        }
      } catch (e) {
        resolve(null);
      }
    });
  }

  // 4. Preload Speech Audio Buffer
  async preloadSpeech(text, voiceOrLang = 'vi-VN-HoaiMyNeural', rate = 1.25) {
    try {
      this.init();
      if (!text) return false;
      const lowerVoice = (voiceOrLang || '').toLowerCase();
      const isVi = lowerVoice.includes('vi') || lowerVoice.includes('vietnam');
      const cleanLang = isVi ? 'vi' : (voiceOrLang.includes('en-GB') ? 'en-GB' : 'en');
      const cacheKey = `${text}_${voiceOrLang}_${rate}`;
      if (this.audioCache.has(cacheKey)) return true;

      const ttsUrl = `/api/tts?q=${encodeURIComponent(text)}&tl=${cleanLang}&voice=${encodeURIComponent(voiceOrLang)}&rate=${rate}`;
      
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timeoutId = controller ? setTimeout(() => controller.abort(), 3500) : null;

      const response = await fetch(ttsUrl, controller ? { signal: controller.signal } : {});
      if (timeoutId) clearTimeout(timeoutId);
      
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.decodeAudioDataSafe(arrayBuffer);
        if (audioBuffer) {
          this.audioCache.set(cacheKey, audioBuffer);
          console.log(`✅ Đã tải trước audio phát âm cho: "${text}" (rate: ${rate}, voice: ${voiceOrLang})`);
          return true;
        }
      }
      return false;
    } catch (e) {
      console.warn(`Local TTS proxy failed or timed out for "${text}":`, e.message);
      return false;
    }
  }

  // Preload toàn bộ danh sách câu hỏi song song với timeout 2.5s
  async preloadWordList(words, voiceOrLang = 'vi-VN-HoaiMyNeural', rate = 1.25) {
    if (!words || !words.length) return;
    const tasks = words.map(w => {
      const textToPreload = w.question || w.en || w.text;
      if (!textToPreload) return Promise.resolve(false);
      return Promise.race([
        this.preloadSpeech(textToPreload, voiceOrLang, rate),
        new Promise(resolve => setTimeout(() => resolve(false), 2500))
      ]).catch(() => false);
    });
    await Promise.all(tasks);
  }

  // 5. Phát âm giọng đọc hòa trộn trực tiếp vào AudioContext Destination (Ghi được vào Video Export)
  async playSpeech(text, voiceOrLang = 'vi-VN-HoaiMyNeural', customDest = null, options = {}) {
    try {
      this.init();
      const dest = customDest || this.ctx.destination;
      const rate = options.rate || options.speed || 1.25;
      const cacheKey = `${text}_${voiceOrLang}_${rate}`;
      let audioBuffer = this.audioCache.get(cacheKey);

      if (!audioBuffer) {
        try {
          await this.preloadSpeech(text, voiceOrLang, rate);
          audioBuffer = this.audioCache.get(cacheKey);
        } catch (preloadErr) {
          console.warn('Preload failed in playSpeech:', preloadErr);
        }
      }

      if (audioBuffer) {
        const source = this.ctx.createBufferSource();
        source.buffer = audioBuffer;

        const gain = this.ctx.createGain();
        gain.gain.value = 1.2; // Giọng đọc rõ ràng, âm lượng 120%

        source.connect(gain);
        gain.connect(dest);
        source.start(this.ctx.currentTime);
      } else {
        if (!customDest) {
          console.warn(`AudioBuffer unavailable for "${text}", falling back to WebSpeech`);
          this.speakViaWebSpeech(text, voiceOrLang, options);
        } else {
          console.warn(`AudioBuffer unavailable for "${text}" during export; skipping WebSpeech fallback to prevent browser hang`);
        }
      }
    } catch (err) {
      console.warn('playSpeech error (handled gracefully):', err);
    }
  }

  // Phát âm qua Web Speech API (Dùng cho giọng hệ thống máy hoặc fallback)
  speakViaWebSpeech(text, voiceOrLang = 'vi-VN', options = {}) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        window.speechSynthesis.cancel();
      }
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      setTimeout(() => {
        try {
          const cleanText = String(text || '').replace(/\[\[BREAK_1S\]\]/g, '   ');
          const u = new SpeechSynthesisUtterance(cleanText);
          u.rate = options.rate || 1.25;
          u.pitch = options.pitch || 1.0;

          const voices = window.speechSynthesis.getVoices();
          let matchedVoice = null;

          if (voiceOrLang.startsWith('sys_')) {
            const sysName = voiceOrLang.replace('sys_', '');
            matchedVoice = voices.find(v => v.name === sysName);
          }

          if (!matchedVoice && options.systemVoiceName) {
            matchedVoice = voices.find(v => v.name === options.systemVoiceName);
          }

          if (!matchedVoice) {
            if (voiceOrLang.includes('NamMinh')) {
              matchedVoice = voices.find(v => v.name.includes('NamMinh') || (v.lang.toLowerCase().includes('vi') && v.name.toLowerCase().includes('male')));
            } else if (voiceOrLang.includes('HoaiMy')) {
              matchedVoice = voices.find(v => v.name.includes('HoaiMy') || (v.lang.toLowerCase().includes('vi') && v.name.toLowerCase().includes('female')));
            } else if (voiceOrLang.toLowerCase().includes('vi') || voiceOrLang.toLowerCase().includes('vietnam')) {
              matchedVoice = voices.find(v => v.lang && (v.lang.toLowerCase().includes('vi') || v.name.toLowerCase().includes('vietnam')));
            }
          }

          if (matchedVoice) {
            u.voice = matchedVoice;
          } else {
            u.lang = (voiceOrLang.toLowerCase().includes('vi') || voiceOrLang.toLowerCase().includes('vietnam')) ? 'vi-VN' : voiceOrLang;
          }

          window.speechSynthesis.speak(u);
        } catch (subErr) {
          console.warn('WebSpeech utterance error:', subErr);
        }
      }, 30);
    } catch (e) {
      console.warn('WebSpeech error:', e);
    }
  }

  // Nút Nghe Thử Giọng Đọc (Test Voice button)
  async testVoice(voiceOrLang = 'vi-VN-HoaiMyNeural', customText = null, speed = 1.25) {
    this.init();
    const defaultViText = 'Xin chào! Đây là thử nghiệm giọng đọc Tiếng Việt cho video trắc nghiệm của bạn.';
    const defaultEnText = 'Hello! This is a test of the English voice for your multiple choice video.';
    
    const lowerVoice = (voiceOrLang || '').toLowerCase();
    const isVi = lowerVoice.includes('vi') || lowerVoice.includes('vietnam');
    const text = customText || (isVi ? defaultViText : defaultEnText);

    if (voiceOrLang.startsWith('sys_')) {
      this.speakViaWebSpeech(text, voiceOrLang, { rate: speed });
    } else {
      await this.playSpeech(text, voiceOrLang, null, { rate: speed });
    }
  }
}

export const audioSynth = new AudioSynthesizer();
