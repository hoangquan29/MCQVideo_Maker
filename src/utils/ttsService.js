// Dịch vụ phát âm qua Web Audio API TTS
import { audioSynth } from './audioSynth';

export class TTSService {
  static speak(text, options = {}) {
    const voiceOrLang = options.voice || options.lang || 'vi-VN-HoaiMyNeural';
    const rate = options.rate || options.speed || 1.25;
    return audioSynth.playSpeech(text, voiceOrLang, options.customDest || null, { rate });
  }

  static testVoice(voiceOrLang, customText, speed) {
    return audioSynth.testVoice(voiceOrLang, customText, speed);
  }
}
