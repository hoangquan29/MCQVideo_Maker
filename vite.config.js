import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import WebSocket from 'ws'

// Hàm escape các ký tự đặc biệt cho SSML XML
function escapeSSML(str) {
  if (!str) return '';
  const escaped = String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
  return escaped.replace(/\[\[BREAK_1S\]\]/g, '<break time="1000ms"/>');
}

// Hàm tạo âm thanh TTS chất lượng cao bằng Microsoft Edge Neural Voices
async function getEdgeTTSAudio(text, voice = 'vi-VN-HoaiMyNeural', rate = 1.0) {
  return new Promise((resolve, reject) => {
    try {
      const WebSocketClass = globalThis.WebSocket || WebSocket;
      if (!WebSocketClass) return reject(new Error('WebSocket not available in Node environment'));

      const requestId = Math.random().toString(36).substring(2, 10);
      const url = `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=6A5AA1D4E5C54E24988075F72823F013`;
      const wsOptions = {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0',
          'Origin': 'chrome-extension://jdiccldimpdaibmpobdefobmjpjjphkg'
        }
      };

      const ws = new WebSocketClass(url, wsOptions);

      const audioChunks = [];
      const ratePercent = Math.round((rate - 1.0) * 100);
      const rateStr = ratePercent >= 0 ? `+${ratePercent}%` : `${ratePercent}%`;

      const safeText = escapeSSML(text);
      const xmlLang = voice.startsWith('en-GB') ? 'en-GB' : (voice.startsWith('en-') ? 'en-US' : 'vi-VN');
      const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='${xmlLang}'><voice name='${voice}'><prosody pitch='+0Hz' rate='${rateStr}' volume='+0%'>${safeText}</prosody></voice></speak>`;

      const timer = setTimeout(() => {
        try { ws.close(); } catch(e) {}
        reject(new Error('Edge TTS WebSocket request timeout'));
      }, 7000);

      const handleOpen = () => {
        const configMsg = `Path: speech.config\r\nContent-Type: application/json; charset=utf-8\r\n\r\n{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"false"},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}`;
        ws.send(configMsg);

        const ssmlMsg = `Path: ssml\r\nX-RequestId: ${requestId}\r\nContent-Type: application/ssml+xml\r\n\r\n${ssml}`;
        ws.send(ssmlMsg);
      };

      const handleMessage = async (eventOrData) => {
        try {
          let data = eventOrData && eventOrData.data !== undefined ? eventOrData.data : eventOrData;
          if (typeof Blob !== 'undefined' && data instanceof Blob) {
            data = await data.arrayBuffer();
          }

          if (data instanceof ArrayBuffer || ArrayBuffer.isView(data) || Buffer.isBuffer(data)) {
            const buf = Buffer.from(data);
            const headerStr = buf.toString('utf8', 0, Math.min(buf.length, 200));
            if (headerStr.includes('Path:audio')) {
              const headerEndIndex = buf.indexOf('\r\n\r\n');
              if (headerEndIndex !== -1) {
                const audioData = buf.subarray(headerEndIndex + 4);
                if (audioData.length > 0) {
                  audioChunks.push(audioData);
                }
              }
            } else if (headerStr.includes('Path:turn.end')) {
              clearTimeout(timer);
              try { ws.close(); } catch(e) {}
              if (audioChunks.length > 0) {
                resolve(Buffer.concat(audioChunks));
              } else {
                reject(new Error('Empty Edge TTS audio output'));
              }
            }
          } else if (typeof data === 'string') {
            if (data.includes('Path:turn.end')) {
              clearTimeout(timer);
              try { ws.close(); } catch(e) {}
              if (audioChunks.length > 0) {
                resolve(Buffer.concat(audioChunks));
              } else {
                reject(new Error('Empty Edge TTS audio output'));
              }
            }
          }
        } catch (err) {
          console.warn('Edge TTS message parsing error:', err.message);
        }
      };

      const handleError = (err) => {
        clearTimeout(timer);
        reject(err);
      };

      if (typeof ws.on === 'function') {
        ws.on('open', handleOpen);
        ws.on('message', handleMessage);
        ws.on('error', handleError);
      } else {
        ws.onopen = handleOpen;
        ws.onmessage = handleMessage;
        ws.onerror = handleError;
      }

    } catch (e) {
      reject(e);
    }
  });
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'tts-proxy-middleware',
      configureServer(server) {
        server.middlewares.use('/api/tts', async (req, res) => {
          try {
            const url = new URL(req.url, 'http://localhost');
            const q = url.searchParams.get('q') || 'hello';
            const tl = url.searchParams.get('tl') || 'vi';
            const voice = url.searchParams.get('voice') || 'vi-VN-HoaiMyNeural';
            const rate = parseFloat(url.searchParams.get('rate') || '1.0');

            // 1. Giọng AI Neural (Hoài Mỹ Nữ, Nam Minh Nam, Ana, Guy...), tạo bằng Edge TTS
            if (voice.includes('Neural') || voice.includes('vi-VN-')) {
              try {
                const mp3Buf = await getEdgeTTSAudio(q, voice, rate);
                res.setHeader('Content-Type', 'audio/mpeg');
                res.setHeader('Access-Control-Allow-Origin', '*');
                return res.end(mp3Buf);
              } catch (edgeErr) {
                console.warn('Edge TTS failed, falling back to Google TTS:', edgeErr.message);
              }
            }

            // 2. Google TTS Fallback
            let langCode = tl;
            if (voice.includes('vi') || tl.includes('vi')) {
              langCode = 'vi';
            } else if (voice.includes('en-GB') || tl.includes('en-GB')) {
              langCode = 'en-GB';
            } else if (voice.includes('en') || tl.includes('en')) {
              langCode = 'en';
            }

            const cleanQForGoogle = q.replace(/\[\[BREAK_1S\]\]/g, '   ');
            const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanQForGoogle)}&tl=${langCode}&client=tw-ob`;
            const response = await fetch(ttsUrl, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
              }
            });

            if (!response.ok) {
              throw new Error(`TTS server responded with status ${response.status}`);
            }

            const arrayBuffer = await response.arrayBuffer();
            res.setHeader('Content-Type', 'audio/mpeg');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(Buffer.from(arrayBuffer));
          } catch (e) {
            console.error('TTS Proxy Error:', e.message);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e.message }));
          }
        });
      }
    }
  ]
})
