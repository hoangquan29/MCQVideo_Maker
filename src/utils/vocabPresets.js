// Presets cho Dạng Video Từ Vựng Theo Danh Sách (Vocab List Video - Phong cách BIGO)

export const DEFAULT_VOCAB_JSON = {
  "id": "vocab-cooking-10",
  "title": "10 TỪ VỰNG VỀ NẤU ĂN",
  "subtitle": "Học từ vựng mỗi ngày cùng BIGO!",
  "category": "Nấu ăn",
  "themeColor": "blue",
  "headerIcon": "👨‍🍳",
  "voice": "en-US-AnaNeural",
  "voiceSpeed": 1.25,
  "timePerWord": 4.0,
  "mascotName": "BIGO",
  "items": [
    { "id": 1, "vi": "Nấu", "en": "Cook", "ipa": "/kʊk/", "icon": "🍲" },
    { "id": 2, "vi": "Chiên", "en": "Fry", "ipa": "/fraɪ/", "icon": "🍳" },
    { "id": 3, "vi": "Luộc", "en": "Boil", "ipa": "/bɔɪl/", "icon": "🥦" },
    { "id": 4, "vi": "Nướng", "en": "Bake", "ipa": "/beɪk/", "icon": "🍗" },
    { "id": 5, "vi": "Hấp", "en": "Steam", "ipa": "/stiːm/", "icon": "🥟" },
    { "id": 6, "vi": "Thái", "en": "Chop", "ipa": "/tʃɒp/", "icon": "🥒" },
    { "id": 7, "vi": "Băm", "en": "Mince", "ipa": "/mɪns/", "icon": "🥩" },
    { "id": 8, "vi": "Gọt", "en": "Crack", "ipa": "/kræk/", "icon": "🥔" },
    { "id": 9, "vi": "Trộn", "en": "Mix", "ipa": "/mɪks/", "icon": "🥗" },
    { "id": 10, "vi": "Khuấy", "en": "Whisk", "ipa": "/wɪsk/", "icon": "🥣" }
  ]
};

export const VOCAB_PRESETS = [
  {
    id: "vocab-cooking-10",
    name: "🍳 10 Từ Vựng Về Nấu Ăn (BIGO Style - Chuẩn Nguồn Mẫu)",
    description: "Bộ từ vựng hành động nấu ăn: Cook, Fry, Boil, Bake, Steam, Chop, Mince, Crack, Mix, Whisk...",
    data: DEFAULT_VOCAB_JSON
  },
  {
    id: "vocab-animals-10",
    name: "🦁 10 Từ Vựng Về Động Vật Dễ Thương",
    description: "Bộ từ vựng các loài động vật quen thuộc: Dog, Cat, Lion, Elephant, Tiger, Monkey, Bear, Rabbit, Dolphin, Eagle...",
    data: {
      "id": "vocab-animals-10",
      "title": "10 TỪ VỰNG VỀ ĐỘNG VẬT",
      "subtitle": "Học từ vựng mỗi ngày cùng BIGO!",
      "category": "Động vật",
      "themeColor": "green",
      "headerIcon": "🦁",
      "voice": "en-US-AnaNeural",
      "voiceSpeed": 1.25,
      "timePerWord": 4.0,
      "mascotName": "BIGO",
      "items": [
        { "id": 1, "vi": "Con chó", "en": "Dog", "ipa": "/dɒɡ/", "icon": "🐶" },
        { "id": 2, "vi": "Con mèo", "en": "Cat", "ipa": "/kæt/", "icon": "🐱" },
        { "id": 3, "vi": "Sư tử", "en": "Lion", "ipa": "/ˈlaɪ.ən/", "icon": "🦁" },
        { "id": 4, "vi": "Con voi", "en": "Elephant", "ipa": "/ˈel.ɪ.fənt/", "icon": "🐘" },
        { "id": 5, "vi": "Con hổ", "en": "Tiger", "ipa": "/ˈtaɪ.ɡər/", "icon": "🐯" },
        { "id": 6, "vi": "Con khỉ", "en": "Monkey", "ipa": "/ˈmʌŋ.ki/", "icon": "🐒" },
        { "id": 7, "vi": "Con gấu", "en": "Bear", "ipa": "/beər/", "icon": "🐻" },
        { "id": 8, "vi": "Con thỏ", "en": "Rabbit", "ipa": "/ˈræb.ɪt/", "icon": "🐰" },
        { "id": 9, "vi": "Cá heo", "en": "Dolphin", "ipa": "/ˈdɒl.fɪn/", "icon": "🐬" },
        { "id": 10, "vi": "Chim đại bàng", "en": "Eagle", "ipa": "/ˈiː.ɡəl/", "icon": "🦅" }
      ]
    }
  },
  {
    id: "vocab-fruits-10",
    name: "🍎 10 Từ Vựng Về Các Loại Trái Cây",
    description: "Bộ từ vựng hoa quả: Apple, Banana, Orange, Mango, Grape, Watermelon, Strawberry, Pineapple, Peach, Cherry...",
    data: {
      "id": "vocab-fruits-10",
      "title": "10 TỪ VỰNG VỀ TRÁI CÂY",
      "subtitle": "Học từ vựng mỗi ngày cùng BIGO!",
      "category": "Hoa quả",
      "themeColor": "orange",
      "headerIcon": "🍎",
      "voice": "en-US-AnaNeural",
      "voiceSpeed": 1.25,
      "timePerWord": 4.0,
      "mascotName": "BIGO",
      "items": [
        { "id": 1, "vi": "Quả táo", "en": "Apple", "ipa": "/ˈæp.əl/", "icon": "🍎" },
        { "id": 2, "vi": "Quả chuối", "en": "Banana", "ipa": "/bəˈnɑː.nə/", "icon": "🍌" },
        { "id": 3, "vi": "Quả cam", "en": "Orange", "ipa": "/ˈɒr.ɪndʒ/", "icon": "🍊" },
        { "id": 4, "vi": "Quả xoài", "en": "Mango", "ipa": "/ˈmæŋ.ɡəʊ/", "icon": "🥭" },
        { "id": 5, "vi": "Quả nho", "en": "Grape", "ipa": "/ɡreɪp/", "icon": "🍇" },
        { "id": 6, "vi": "Dưa hấu", "en": "Watermelon", "ipa": "/ˈwɔː.təˌmel.ən/", "icon": "🍉" },
        { "id": 7, "vi": "Dâu tây", "en": "Strawberry", "ipa": "/ˈstrɔː.bər.i/", "icon": "🍓" },
        { "id": 8, "vi": "Quả dứa", "en": "Pineapple", "ipa": "/ˈpaɪnˌæp.əl/", "icon": "🍍" },
        { "id": 9, "vi": "Quả đào", "en": "Peach", "ipa": "/piːtʃ/", "icon": "🍑" },
        { "id": 10, "vi": "Quả anh đào", "en": "Cherry", "ipa": "/ˈtʃer.i/", "icon": "🍒" }
      ]
    }
  },
  {
    id: "vocab-feelings-10",
    name: "😊 10 Từ Vựng Về Cảm Xúc Hàng Ngày",
    description: "Bộ từ vựng trạng thái cảm xúc: Happy, Sad, Angry, Excited, Tired, Nervous, Proud, Surprised, Calm, Bored...",
    data: {
      "id": "vocab-feelings-10",
      "title": "10 TỪ VỰNG VỀ CẢM XÚC",
      "subtitle": "Học từ vựng mỗi ngày cùng BIGO!",
      "category": "Cảm xúc",
      "themeColor": "pink",
      "headerIcon": "😊",
      "voice": "en-US-GuyNeural",
      "voiceSpeed": 1.25,
      "timePerWord": 4.0,
      "mascotName": "BIGO",
      "items": [
        { "id": 1, "vi": "Vui vẻ", "en": "Happy", "ipa": "/ˈhæp.i/", "icon": "😄" },
        { "id": 2, "vi": "Buồn bã", "en": "Sad", "ipa": "/sæd/", "icon": "😢" },
        { "id": 3, "vi": "Tức giận", "en": "Angry", "ipa": "/ˈæŋ.ɡri/", "icon": "😡" },
        { "id": 4, "vi": "Hào hứng", "en": "Excited", "ipa": "/ɪkˈsaɪ.tɪd/", "icon": "🤩" },
        { "id": 5, "vi": "Mệt mỏi", "en": "Tired", "ipa": "/taɪəd/", "icon": "😴" },
        { "id": 6, "vi": "Hồi hộp", "en": "Nervous", "ipa": "/ˈnɜː.vəs/", "icon": "😰" },
        { "id": 7, "vi": "Tự hào", "en": "Proud", "ipa": "/praʊd/", "icon": "😎" },
        { "id": 8, "vi": "Bất ngờ", "en": "Surprised", "ipa": "/səˈpraɪzd/", "icon": "😲" },
        { "id": 9, "vi": "Bình tĩnh", "en": "Calm", "ipa": "/kɑːm/", "icon": "😌" },
        { "id": 10, "vi": "Chán nản", "en": "Bored", "ipa": "/bɔːd/", "icon": "😒" }
      ]
    }
  }
];
