// Utility để parse file JSON & CSV nhập câu hỏi trắc nghiệm

// Parse CSV text into array of objects
export function parseCSV(csvText) {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length < 2) return [];

  const parseLine = (line) => {
    const result = [];
    let start = 0;
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') {
        inQuotes = !inQuotes;
      } else if (line[i] === ',' && !inQuotes) {
        let field = line.substring(start, i).trim();
        if (field.startsWith('"') && field.endsWith('"')) {
          field = field.substring(1, field.length - 1).replace(/""/g, '"');
        }
        result.push(field);
        start = i + 1;
      }
    }
    let lastField = line.substring(start).trim();
    if (lastField.startsWith('"') && lastField.endsWith('"')) {
      lastField = lastField.substring(1, lastField.length - 1).replace(/""/g, '"');
    }
    result.push(lastField);
    return result;
  };

  const headers = parseLine(lines[0]).map(h => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    if (values.length === 0 || (values.length === 1 && !values[0])) continue;
    const rowObj = {};
    headers.forEach((header, index) => {
      rowObj[header] = values[index] !== undefined ? values[index] : '';
    });
    rows.push(rowObj);
  }

  return rows;
}

// Parse file content (JSON or CSV) for MCQ Questions
export function parseMCQFile(fileContent, fileName) {
  let rawList = [];

  if (fileName.endsWith('.json')) {
    const parsed = JSON.parse(fileContent);
    if (Array.isArray(parsed)) {
      rawList = parsed;
    } else if (parsed.questions && Array.isArray(parsed.questions)) {
      rawList = parsed.questions;
    } else if (parsed.items && Array.isArray(parsed.items)) {
      rawList = parsed.items;
    }
  } else if (fileName.endsWith('.csv') || fileName.endsWith('.txt')) {
    rawList = parseCSV(fileContent);
  } else {
    throw new Error('Định dạng file không hỗ trợ. Vui lòng tải file .json hoặc .csv');
  }

  if (!rawList || rawList.length === 0) {
    throw new Error('File không chứa dữ liệu câu hỏi hợp lệ.');
  }

  const formatted = rawList.map((item, idx) => ({
    question: item.question || item.cau_hoi || item.q || `Câu hỏi ${idx + 1}?`,
    optionA: item.optionA || item.option_a || item.dap_an_a || item.a || 'Đáp án A',
    optionB: item.optionB || item.option_b || item.dap_an_b || item.b || 'Đáp án B',
    optionC: item.optionC || item.option_c || item.dap_an_c || item.c || 'Đáp án C',
    optionD: item.optionD || item.option_d || item.dap_an_d || item.d || 'Đáp án D',
    correctOption: (item.correctOption || item.correct_option || item.dap_an_dung || item.correct || 'A').toString().toUpperCase().trim().charAt(0),
    explanation: item.explanation || item.giai_thich || item.hint || '',
    image: item.image || item.img || item.hinh_anh || item.flag || ''
  }));

  return formatted;
}

// Parse file content (JSON or CSV) containing MULTIPLE MCQ Question Sets (4 sets)
export function parseMultiMCQFile(fileContent, fileName) {
  let sets = [];

  const formatItem = (item, idx, setMode = '', setObj = {}) => {
    const rawWord = item.word || item.target_word || item.targetWord || item.tu_vung || item.answer || item.ans || item.dish || item.mon_an || item.food || '';
    const rawCountry = item.country || item.quoc_gia || item.ten_nuoc || '';
    const rawFlag = item.flag || item.quoc_ky || item.co || '';
    const rawClues = Array.isArray(item.clues) ? item.clues : (Array.isArray(item.goi_y) ? item.goi_y : []);
    const isFlagsItem = item.mode === 'flags' ||
      (item.image && String(item.image).includes('flagcdn')) ||
      (item.flagUrl && String(item.flagUrl).includes('flagcdn')) ||
      (item.question && (String(item.question).toLowerCase().includes('cờ') || String(item.question).toLowerCase().includes('quốc kỳ')));
    const isFoodItem = item.mode === 'food-guess' || item.mode === 'dish-guess' || item.mode === 'food' ||
      (item.question && (String(item.question).toLowerCase().includes('món') || String(item.question).toLowerCase().includes('đoán món'))) ||
      (item.topic && String(item.topic).toLowerCase().includes('món')) ||
      !!(item.dish || item.mon_an);
    const isLandmarkItem = item.mode === 'landmark-guess' || item.mode === 'place-guess' || item.mode === 'landmark' || item.mode === 'place' ||
      (item.question && (String(item.question).toLowerCase().includes('địa điểm') || String(item.question).toLowerCase().includes('danh thắng') || String(item.question).toLowerCase().includes('kỳ quan'))) ||
      (item.topic && (String(item.topic).toLowerCase().includes('địa điểm') || String(item.topic).toLowerCase().includes('kỳ quan'))) ||
      !!(item.landmark || item.place || item.dia_diem);
    const isPlayerItem = item.mode === 'player-guess' || item.mode === 'player' ||
      (item.question && (String(item.question).toLowerCase().includes('cầu thủ') || String(item.question).toLowerCase().includes('bóng đá'))) ||
      (item.topic && (String(item.topic).toLowerCase().includes('cầu thủ') || String(item.topic).toLowerCase().includes('bóng đá'))) ||
      !!(item.player || item.cau_thu);
    const rawMode = item.mode || item.type || setMode || setObj.mode || (isPlayerItem ? 'player-guess' : (isLandmarkItem ? 'landmark-guess' : (isFoodItem ? 'food-guess' : (rawClues.length > 0 || rawCountry ? 'country-guess' : (isFlagsItem ? 'flags' : (rawWord ? 'word-guess' : 'mcq'))))));

    const optA = item.optionA || item.option_a || item.dap_an_a || item.a || rawWord || (rawCountry || 'Đáp án A');
    const optB = item.optionB || item.option_b || item.dap_an_b || item.b || 'Đáp án B';
    const optC = item.optionC || item.option_c || item.dap_an_c || item.c || 'Đáp án C';
    const optD = item.optionD || item.option_d || item.dap_an_d || item.d || 'Đáp án D';
    const rawLandmarkWord = item.landmark || item.place || item.word || item.dish || optA;

    return {
      id: item.id || `q-${idx + 1}`,
      question: item.question || item.cau_hoi || item.q || (rawMode === 'landmark-guess' ? 'Đây là địa điểm nào?' : (rawMode === 'food-guess' ? 'Đây là món gì?' : (rawCountry ? `Đoán Quốc Gia: ${rawCountry}` : item.word || `Câu hỏi ${idx + 1}?`))),
      topic: item.topic || item.category || item.level || setObj.topic || (rawMode === 'landmark-guess' ? '🏰 ĐOÁN ĐỊA ĐIỂM' : (rawMode === 'food-guess' ? '🍳 ĐOÁN MÓN ĂN' : (rawMode === 'country-guess' ? '🌎 ĐOÁN QUỐC GIA' : (rawMode === 'flags' ? 'NHÌN CỜ ĐOÁN NƯỚC' : 'TỪ VỰNG B1')))),
      fromFlag: item.fromFlag || item.from_flag || item.source_flag || setObj.fromFlag || (rawMode === 'landmark-guess' ? '🌍' : (rawMode === 'food-guess' ? '🍳' : (rawMode === 'country-guess' ? '🌎' : (rawMode === 'flags' ? '🚩' : '🇻🇳')))),
      toFlag: item.toFlag || item.to_flag || item.target_flag || setObj.toFlag || (rawMode === 'landmark-guess' ? '🏛️' : (rawMode === 'food-guess' ? '🍲' : (rawMode === 'country-guess' ? '🚩' : (rawMode === 'flags' ? '🏁' : '🇺🇸')))),
      headerTitle: item.headerTitle || item.header_title || item.subHeader || setObj.headerTitle || (rawMode === 'landmark-guess' ? 'ĐÂY LÀ ĐÂY?' : (rawMode === 'food-guess' ? 'ĐÂY LÀ MÓN GÌ?' : (rawMode === 'country-guess' ? 'ĐOÁN QUỐC GIA QUA 5 GỢI Ý' : (rawMode === 'flags' ? 'ĐÂY LÀ QUỐC GIA NÀO?' : 'TỪ NÀO CÓ NGHĨA LÀ')))),
      optionA: optA,
      optionB: optB,
      optionC: optC,
      optionD: optD,
      correctOption: (item.correctOption || item.correct_option || item.dap_an_dung || item.correct || 'A').toString().toUpperCase().trim().charAt(0),
      explanation: item.explanation || item.giai_thich || item.hint || item.meaning || item.nghia || '',
      image: item.image || item.img || item.hinh_anh || item.bg || item.background || '',
      word: rawWord || (rawMode === 'word-guess' || rawMode === 'food-guess' || rawMode === 'landmark-guess' ? rawLandmarkWord : ''),
      ipa: item.ipa || item.phien_am || '',
      mode: rawMode,
      country: rawCountry,
      flag: rawFlag,
      clues: rawClues
    };
  };

  if (fileName.endsWith('.json')) {
    let parsed = JSON.parse(fileContent);

    // If parsed object is not an array, unpack its sets/questions/items property
    if (!Array.isArray(parsed) && typeof parsed === 'object' && parsed !== null) {
      if (Array.isArray(parsed.sets)) {
        parsed = parsed.sets;
      } else if (Array.isArray(parsed.questions)) {
        parsed = parsed.questions;
      } else if (Array.isArray(parsed.items)) {
        parsed = parsed.items;
      } else {
        parsed = [parsed];
      }
    }

    if (Array.isArray(parsed)) {
      if (parsed.length > 0 && (parsed[0].questions || parsed[0].items)) {
        const rawSets = [];
        parsed.forEach((s, sIdx) => {
          const firstQ = (s.questions || s.items || [])[0];
          const isFlagsSet = s.mode === 'flags' || firstQ?.mode === 'flags' || firstQ?.image?.includes('flagcdn') || s.name?.toLowerCase().includes('cờ') || s.topic?.toLowerCase().includes('cờ');
          const isFoodSet = s.mode === 'food-guess' || firstQ?.mode === 'food-guess' || s.topic?.toLowerCase().includes('món') || s.name?.toLowerCase().includes('món');
          const isLandmarkSet = s.mode === 'landmark-guess' || s.mode === 'place-guess' || firstQ?.mode === 'landmark-guess' || s.topic?.toLowerCase().includes('địa điểm') || s.name?.toLowerCase().includes('địa điểm');
          const setMode = s.mode || s.type || (isLandmarkSet ? 'landmark-guess' : (isFoodSet ? 'food-guess' : (firstQ?.clues?.length > 0 || firstQ?.country || firstQ?.mode === 'country-guess' ? 'country-guess' : (isFlagsSet ? 'flags' : (s.questions && s.questions.some(q => q.word || q.target_word || q.mode === 'word-guess') ? 'word-guess' : '')))));
          const chunkSize = setMode === 'country-guess' ? 4 : 5;
          const formattedQuestions = (s.questions || s.items || []).map((q, idx) => formatItem(q, idx, setMode, s));

          // If set has more questions than chunkSize (e.g. > 5 questions), split into sub-sets
          if (formattedQuestions.length > chunkSize) {
            for (let i = 0; i < formattedQuestions.length; i += chunkSize) {
              const subQuestions = formattedQuestions.slice(i, i + chunkSize);
              const partIndex = Math.floor(i / chunkSize) + 1;
              const setName = s.name || s.title || `Bộ câu hỏi #${sIdx + 1}`;
              rawSets.push({
                name: formattedQuestions.length > chunkSize ? `${setName} (Phần ${partIndex})` : setName,
                topic: s.topic || s.category || (setMode === 'landmark-guess' ? '🏰 ĐOÁN ĐỊA ĐIỂM' : (setMode === 'food-guess' ? '🍳 ĐOÁN MÓN ĂN' : (setMode === 'country-guess' ? '🌎 ĐOÁN QUỐC GIA' : (setMode === 'flags' ? 'NHÌN CỜ ĐOÁN NƯỚC' : 'TỪ VỰNG B1')))),
                fromFlag: s.fromFlag || s.from_flag || (setMode === 'landmark-guess' ? '🌍' : (setMode === 'food-guess' ? '🍳' : (setMode === 'country-guess' ? '🌎' : (setMode === 'flags' ? '🚩' : '🇻🇳')))),
                toFlag: s.toFlag || s.to_flag || (setMode === 'landmark-guess' ? '🏛️' : (setMode === 'food-guess' ? '🍲' : (setMode === 'country-guess' ? '🚩' : (setMode === 'flags' ? '🏁' : '🇺🇸')))),
                headerTitle: s.headerTitle || s.header_title || (setMode === 'landmark-guess' ? 'ĐÂY LÀ ĐÂY?' : (setMode === 'food-guess' ? 'ĐÂY LÀ MÓN GÌ?' : (setMode === 'country-guess' ? 'ĐOÁN QUỐC GIA QUA 5 GỢI Ý' : (setMode === 'flags' ? 'ĐÂY LÀ QUỐC GIA NÀO?' : 'TỪ NÀO CÓ NGHĨA LÀ')))),
                mode: setMode,
                questions: subQuestions
              });
            }
          } else {
            rawSets.push({
              name: s.name || s.title || `Bộ câu hỏi #${sIdx + 1}`,
              topic: s.topic || s.category || (setMode === 'landmark-guess' ? '🏰 ĐOÁN ĐỊA ĐIỂM' : (setMode === 'food-guess' ? '🍳 ĐOÁN MÓN ĂN' : (setMode === 'country-guess' ? '🌎 ĐOÁN QUỐC GIA' : (setMode === 'flags' ? 'NHÌN CỜ ĐOÁN NƯỚC' : 'TỪ VỰNG B1')))),
              fromFlag: s.fromFlag || s.from_flag || (setMode === 'landmark-guess' ? '🌍' : (setMode === 'food-guess' ? '🍳' : (setMode === 'country-guess' ? '🌎' : (setMode === 'flags' ? '🚩' : '🇻🇳')))),
              toFlag: s.toFlag || s.to_flag || (setMode === 'landmark-guess' ? '🏛️' : (setMode === 'food-guess' ? '🍲' : (setMode === 'country-guess' ? '🚩' : (setMode === 'flags' ? '🏁' : '🇺🇸')))),
              headerTitle: s.headerTitle || s.header_title || (setMode === 'landmark-guess' ? 'ĐÂY LÀ ĐÂY?' : (setMode === 'food-guess' ? 'ĐÂY LÀ MÓN GÌ?' : (setMode === 'country-guess' ? 'ĐOÁN QUỐC GIA QUA 5 GỢI Ý' : (setMode === 'flags' ? 'ĐÂY LÀ QUỐC GIA NÀO?' : 'TỪ NÀO CÓ NGHĨA LÀ')))),
              mode: setMode,
              questions: formattedQuestions
            });
          }
        });
        sets = rawSets;
      } else {
        const allQuestions = parsed.map((q, idx) => formatItem(q, idx));
        const firstMode = allQuestions[0]?.mode || '';
        const firstTopic = allQuestions[0]?.topic || (firstMode === 'landmark-guess' ? '🏰 ĐOÁN ĐỊA ĐIỂM' : (firstMode === 'food-guess' ? '🍳 ĐOÁN MÓN ĂN' : (firstMode === 'country-guess' ? '🌎 ĐOÁN QUỐC GIA' : (firstMode === 'flags' ? 'NHÌN CỜ ĐOÁN NƯỚC' : 'TỪ VỰNG B1'))));
        const firstHeader = allQuestions[0]?.headerTitle || (firstMode === 'landmark-guess' ? 'ĐÂY LÀ ĐÂY?' : (firstMode === 'food-guess' ? 'ĐÂY LÀ MÓN GÌ?' : (firstMode === 'country-guess' ? 'ĐOÁN QUỐC GIA QUA 5 GỢI Ý' : (firstMode === 'flags' ? 'ĐÂY LÀ QUỐC GIA NÀO?' : 'TỪ NÀO CÓ NGHĨA LÀ'))));
        const chunkSize = firstMode === 'country-guess' ? 4 : 5;

        for (let i = 0; i < allQuestions.length; i += chunkSize) {
          const chunk = allQuestions.slice(i, i + chunkSize);
          const hasClues = chunk.some(q => q.clues?.length > 0 || q.country || q.mode === 'country-guess');
          const isLandmark = chunk.some(q => q.mode === 'landmark-guess' || q.mode === 'place-guess' || q.mode === 'landmark' || (q.topic && String(q.topic).toLowerCase().includes('địa điểm')));
          const isFood = chunk.some(q => q.mode === 'food-guess' || q.mode === 'dish-guess' || q.mode === 'food' || (q.topic && String(q.topic).toLowerCase().includes('món')));
          const hasWord = chunk.some(q => q.word || q.mode === 'word-guess');
          const isFlags = chunk.some(q => q.mode === 'flags');
          const chunkMode = isLandmark ? 'landmark-guess' : (isFood ? 'food-guess' : (hasClues ? 'country-guess' : (isFlags ? 'flags' : (hasWord ? 'word-guess' : firstMode))));

          sets.push({
            name: `Bộ câu hỏi #${sets.length + 1}`,
            topic: firstTopic,
            fromFlag: chunkMode === 'landmark-guess' ? '🌍' : (chunkMode === 'food-guess' ? '🍳' : (chunkMode === 'country-guess' ? '🌎' : (chunkMode === 'flags' ? '🚩' : '🇻🇳'))),
            toFlag: chunkMode === 'landmark-guess' ? '🏛️' : (chunkMode === 'food-guess' ? '🍲' : (chunkMode === 'country-guess' ? '🚩' : (chunkMode === 'flags' ? '🏁' : '🇺🇸'))),
            headerTitle: firstHeader,
            mode: chunkMode,
            questions: chunk
          });
        }
      }
    }
  } else if (fileName.endsWith('.csv') || fileName.endsWith('.txt')) {
    const rawRows = parseCSV(fileContent);
    if (rawRows.length > 0) {
      const hasSetCol = rawRows[0].set_name || rawRows[0].set_id || rawRows[0].bo_cau_hoi;
      if (hasSetCol) {
        const grouped = {};
        rawRows.forEach((r, idx) => {
          const setName = r.set_name || r.set_id || r.bo_cau_hoi || 'Bộ câu hỏi #1';
          if (!grouped[setName]) grouped[setName] = [];
          grouped[setName].push(formatItem(r, idx));
        });
        sets = Object.keys(grouped).map(setName => ({
          name: setName,
          questions: grouped[setName]
        }));
      } else {
        const allQuestions = rawRows.map((r, idx) => formatItem(r, idx));
        for (let i = 0; i < allQuestions.length; i += 5) {
          const chunk = allQuestions.slice(i, i + 5);
          sets.push({
            name: `Bộ câu hỏi #${sets.length + 1}`,
            questions: chunk
          });
        }
      }
    }
  } else {
    throw new Error('Định dạng file không hỗ trợ. Vui lòng tải file .json hoặc .csv');
  }

  if (!sets || sets.length === 0) {
    throw new Error('File không chứa dữ liệu bộ câu hỏi hợp lệ.');
  }

  // Ensure we always have 4 sets
  while (sets.length < 4) {
    const nextIdx = sets.length + 1;
    const templateSet = sets[0] || {
      name: `Bộ câu hỏi #${nextIdx}`,
      topic: 'TỪ VỰNG B1',
      fromFlag: '🇻🇳',
      toFlag: '🇺🇸',
      headerTitle: 'TỪ NÀO CÓ NGHĨA LÀ',
      mode: '',
      questions: [
        { question: `Câu hỏi bộ ${nextIdx}?`, optionA: 'Đáp án A', optionB: 'Đáp án B', optionC: 'Đáp án C', optionD: 'Đáp án D', correctOption: 'A', explanation: '' }
      ]
    };
    sets.push({
      ...JSON.parse(JSON.stringify(templateSet)),
      name: `Bộ câu hỏi #${nextIdx}`
    });
  }

  return sets.slice(0, 4);
}

// Helper trigger browser download of a sample string file
export function downloadFile(filename, textContent, mimeType = 'application/json') {
  const blob = new Blob([textContent], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
