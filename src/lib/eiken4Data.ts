import { SentenceItem, WordItem } from "./types";

export interface Eiken4RawEntry {
  num: string; // "0001" to "0700"
  level: number; // 1 to 12
  stageSlug: string;
  english: string;
  phonetic: string;
  partOfSpeech: string;
  japanese: string;
  tip: string;
  distractorsJa: string[];
  distractorsEn: string[];
  sentenceEn: string[];
  sentenceJa: string;
  sentenceDistractors: string[];
}

export interface Eiken4StageDef {
  id: string;
  slug: string;
  group: "stage12" | "summary" | "final";
  unitNumber: number; // 1..16
  levels: number[]; // which of 1..12 are included
  label: string;
  rangeLabel: string;
  subLabel: string;
  title: string;
  subtitle: string;
  sortOrder: number;
}

export const EIKEN4_STAGES: Eiken4StageDef[] = [
  {
    "id": "eiken4_st01",
    "slug": "eiken4_stage01",
    "group": "stage12",
    "unitNumber": 1,
    "levels": [
      1
    ],
    "label": "Stage 01",
    "rangeLabel": "0001〜0058",
    "subLabel": "学校で習う単語 Part 1 (58語)",
    "title": "📗 英検4級【Stage 01】",
    "subtitle": "学校で習う単語 Part 1 (001〜058 / 58語)",
    "sortOrder": 401
  },
  {
    "id": "eiken4_st02",
    "slug": "eiken4_stage02",
    "group": "stage12",
    "unitNumber": 2,
    "levels": [
      2
    ],
    "label": "Stage 02",
    "rangeLabel": "0059〜0116",
    "subLabel": "学校で習う単語 Part 2 (58語)",
    "title": "📗 英検4級【Stage 02】",
    "subtitle": "学校で習う単語 Part 2 (059〜116 / 58語)",
    "sortOrder": 402
  },
  {
    "id": "eiken4_st03",
    "slug": "eiken4_stage03",
    "group": "stage12",
    "unitNumber": 3,
    "levels": [
      3
    ],
    "label": "Stage 03",
    "rangeLabel": "0117〜0174",
    "subLabel": "学校で習う単語 Part 3 (58語)",
    "title": "📗 英検4級【Stage 03】",
    "subtitle": "学校で習う単語 Part 3 (117〜174 / 58語)",
    "sortOrder": 403
  },
  {
    "id": "eiken4_st04",
    "slug": "eiken4_stage04",
    "group": "stage12",
    "unitNumber": 4,
    "levels": [
      4
    ],
    "label": "Stage 04",
    "rangeLabel": "0175〜0232",
    "subLabel": "学校で習う単語 Part 4 (58語)",
    "title": "📗 英検4級【Stage 04】",
    "subtitle": "学校で習う単語 Part 4 (175〜232 / 58語)",
    "sortOrder": 404
  },
  {
    "id": "eiken4_st05",
    "slug": "eiken4_stage05",
    "group": "stage12",
    "unitNumber": 5,
    "levels": [
      5
    ],
    "label": "Stage 05",
    "rangeLabel": "0233〜0290",
    "subLabel": "学校で習う単語 Part 5 (58語)",
    "title": "📗 英検4級【Stage 05】",
    "subtitle": "学校で習う単語 Part 5 (233〜290 / 58語)",
    "sortOrder": 405
  },
  {
    "id": "eiken4_st06",
    "slug": "eiken4_stage06",
    "group": "stage12",
    "unitNumber": 6,
    "levels": [
      6
    ],
    "label": "Stage 06",
    "rangeLabel": "0291〜0349",
    "subLabel": "学校で習う単語 Part 6 (59語)",
    "title": "📗 英検4級【Stage 06】",
    "subtitle": "学校で習う単語 Part 6 (291〜349 / 59語)",
    "sortOrder": 406
  },
  {
    "id": "eiken4_st07",
    "slug": "eiken4_stage07",
    "group": "stage12",
    "unitNumber": 7,
    "levels": [
      7
    ],
    "label": "Stage 07",
    "rangeLabel": "0350〜0412",
    "subLabel": "でる単語 Part 1 (63語)",
    "title": "📘 英検4級【Stage 07】",
    "subtitle": "でる単語 Part 1 (350〜412 / 63語)",
    "sortOrder": 407
  },
  {
    "id": "eiken4_st08",
    "slug": "eiken4_stage08",
    "group": "stage12",
    "unitNumber": 8,
    "levels": [
      8
    ],
    "label": "Stage 08",
    "rangeLabel": "0413〜0475",
    "subLabel": "でる単語 Part 2 (63語)",
    "title": "📘 英検4級【Stage 08】",
    "subtitle": "でる単語 Part 2 (413〜475 / 63語)",
    "sortOrder": 408
  },
  {
    "id": "eiken4_st09",
    "slug": "eiken4_stage09",
    "group": "stage12",
    "unitNumber": 9,
    "levels": [
      9
    ],
    "label": "Stage 09",
    "rangeLabel": "0476〜0538",
    "subLabel": "でる単語 Part 3 (63語)",
    "title": "📘 英検4級【Stage 09】",
    "subtitle": "でる単語 Part 3 (476〜538 / 63語)",
    "sortOrder": 409
  },
  {
    "id": "eiken4_st10",
    "slug": "eiken4_stage10",
    "group": "stage12",
    "unitNumber": 10,
    "levels": [
      10
    ],
    "label": "Stage 10",
    "rangeLabel": "0539〜0600",
    "subLabel": "でる単語 Part 4 (62語)",
    "title": "📘 英検4級【Stage 10】",
    "subtitle": "でる単語 Part 4 (539〜600 / 62語)",
    "sortOrder": 410
  },
  {
    "id": "eiken4_st11",
    "slug": "eiken4_stage11",
    "group": "stage12",
    "unitNumber": 11,
    "levels": [
      11
    ],
    "label": "Stage 11",
    "rangeLabel": "0601〜0650",
    "subLabel": "重要熟語 Part 1 (50語)",
    "title": "📙 英検4級【Stage 11】",
    "subtitle": "重要熟語 Part 1 (601〜650 / 50語)",
    "sortOrder": 411
  },
  {
    "id": "eiken4_st12",
    "slug": "eiken4_stage12",
    "group": "stage12",
    "unitNumber": 12,
    "levels": [
      12
    ],
    "label": "Stage 12",
    "rangeLabel": "0651〜0700",
    "subLabel": "重要熟語 Part 2 (50語)",
    "title": "📙 英検4級【Stage 12】",
    "subtitle": "重要熟語 Part 2 (651〜700 / 50語)",
    "sortOrder": 412
  },
  {
    "id": "eiken4_sum_school",
    "slug": "eiken4_sum_school",
    "group": "summary",
    "unitNumber": 13,
    "levels": [
      1,
      2,
      3,
      4,
      5,
      6
    ],
    "label": "学校単語まとめ",
    "rangeLabel": "0001〜0349",
    "subLabel": "学校で習う単語 総復習 (全349語)",
    "title": "🔥 学校単語まとめ【Stage 01〜06】",
    "subtitle": "学校で習う単語 総復習 (001〜349 / 全349語)",
    "sortOrder": 413
  },
  {
    "id": "eiken4_sum_eiken",
    "slug": "eiken4_sum_eiken",
    "group": "summary",
    "unitNumber": 14,
    "levels": [
      7,
      8,
      9,
      10
    ],
    "label": "でる単語まとめ",
    "rangeLabel": "0350〜0600",
    "subLabel": "英検にでる単語 総復習 (全251語)",
    "title": "🔥 でる単語まとめ【Stage 07〜10】",
    "subtitle": "英検にでる単語 総復習 (350〜600 / 全251語)",
    "sortOrder": 414
  },
  {
    "id": "eiken4_sum_idiom",
    "slug": "eiken4_sum_idiom",
    "group": "summary",
    "unitNumber": 15,
    "levels": [
      11,
      12
    ],
    "label": "熟語まとめ",
    "rangeLabel": "0601〜0700",
    "subLabel": "重要熟語 総復習 (全100語)",
    "title": "🔥 熟語まとめ【Stage 11〜12】",
    "subtitle": "重要熟語 総復習 (601〜700 / 全100語)",
    "sortOrder": 415
  },
  {
    "id": "eiken4_final_all",
    "slug": "eiken4_final_all",
    "group": "final",
    "unitNumber": 16,
    "levels": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12
    ],
    "label": "👑 総合FINAL (全700語)",
    "rangeLabel": "0001〜0700",
    "subLabel": "でる順パス単英検4級 完全制覇 (全700語)",
    "title": "👑 英検4級 総合FINAL【全12ステージ】",
    "subtitle": "でる順パス単英検4級 完全制覇 (全700語)",
    "sortOrder": 416
  }
];

export const EIKEN4_ENTRIES: Eiken4RawEntry[] = [
  {
    "num": "0001",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "picture",
    "phonetic": "[píktʃər]",
    "partOfSpeech": "名詞",
    "japanese": "絵、写真",
    "tip": "[読み: ピクチャ] / カテゴリ: 家の中 / 類義/関連: 類義語:painting(絵), 類義語:photo(写真)",
    "distractorsJa": [
      "駅",
      "体育館",
      "進路、科目"
    ],
    "distractorsEn": [
      "station",
      "gym",
      "course"
    ],
    "sentenceEn": [
      "May",
      "I",
      "take",
      "a",
      "picture",
      "of",
      "you?"
    ],
    "sentenceJa": "あなたの写真を撮ってもいいですか",
    "sentenceDistractors": [
      "would",
      "house"
    ]
  },
  {
    "num": "0002",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "computer",
    "phonetic": "[kəmpjúːtər]",
    "partOfSpeech": "名詞",
    "japanese": "コンピューター",
    "tip": "[読み: コンピュータリ] / カテゴリ: 家の中 / フレーズ例: a computer game (コンピューターゲーム)",
    "distractorsJa": [
      "テーブル、食卓",
      "数学",
      "通り"
    ],
    "distractorsEn": [
      "table",
      "math",
      "street"
    ],
    "sentenceEn": [
      "My",
      "father",
      "gave",
      "me",
      "a",
      "computer",
      "for",
      "my",
      "birthday."
    ],
    "sentenceJa": "私の誕生日に父がコンピュータをくれた",
    "sentenceDistractors": [
      "ten",
      "wear"
    ]
  },
  {
    "num": "0003",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "magazine",
    "phonetic": "[mæ̀ɡəzíːn]",
    "partOfSpeech": "名詞",
    "japanese": "雑誌",
    "tip": "[読み: マガズィーン] / カテゴリ: 家の中 / フレーズ例: a weekly magazine (週刊誌)",
    "distractorsJa": [
      "ノート",
      "明日、明日は",
      "1カ月、月"
    ],
    "distractorsEn": [
      "notebook",
      "tomorrow",
      "month"
    ],
    "sentenceEn": [
      "I",
      "like",
      "to",
      "read",
      "fashion",
      "magazines."
    ],
    "sentenceJa": "私はファッション雑誌を読むのが好きです。",
    "sentenceDistractors": [
      "earn",
      "convenience store"
    ]
  },
  {
    "num": "0004",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "letter",
    "phonetic": "[létər]",
    "partOfSpeech": "名詞",
    "japanese": "手紙、文字",
    "tip": "[読み: レタァ] / カテゴリ: 家の中",
    "distractorsJa": [
      "昨日、昨日は",
      "絵、写真",
      "通り"
    ],
    "distractorsEn": [
      "yesterday",
      "picture",
      "street"
    ],
    "sentenceEn": [
      "When",
      "I",
      "get",
      "to",
      "Hawaii,",
      "I'll",
      "write",
      "you",
      "a",
      "letter."
    ],
    "sentenceJa": "ハワイに着いたら，あなたに手紙を書きます",
    "sentenceDistractors": [
      "wait",
      "its"
    ]
  },
  {
    "num": "0005",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "table",
    "phonetic": "[téibl]",
    "partOfSpeech": "名詞",
    "japanese": "テーブル、食卓",
    "tip": "[読み: テイブル] / カテゴリ: 家の中",
    "distractorsJa": [
      "クラスメート、同級生",
      "書店",
      "明日、明日は"
    ],
    "distractorsEn": [
      "classmate",
      "bookstore",
      "tomorrow"
    ],
    "sentenceEn": [
      "Put",
      "the",
      "plates",
      "on",
      "the",
      "table,",
      "Eri."
    ],
    "sentenceJa": "お皿をテーブルに置いて, エリ",
    "sentenceDistractors": [
      "TV",
      "sell"
    ]
  },
  {
    "num": "0006",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "kitchen",
    "phonetic": "[kítʃ(ə)n]",
    "partOfSpeech": "名詞",
    "japanese": "台所",
    "tip": "[読み: キチン] / カテゴリ: 家の中",
    "distractorsJa": [
      "話すこと、演説、スピーチ",
      "クラス、学級、授業",
      "場所"
    ],
    "distractorsEn": [
      "speech",
      "class",
      "place"
    ],
    "sentenceEn": [
      "My",
      "mother",
      "is",
      "cooking",
      "in",
      "the",
      "kitchen."
    ],
    "sentenceJa": "母は台所で料理をしています。",
    "sentenceDistractors": [
      "modern",
      "certain"
    ]
  },
  {
    "num": "0007",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "chopstick",
    "phonetic": "[tʃɑ́(ː)pstìk]",
    "partOfSpeech": "名詞",
    "japanese": "（食事用の）はし",
    "tip": "[読み: チャ（ー）ップスティック] / カテゴリ: 家の中 / フレーズ例: a pair of chopsticks (はし1膳)",
    "distractorsJa": [
      "クラブ、部",
      "ペット",
      "レストラン"
    ],
    "distractorsEn": [
      "club",
      "pet",
      "restaurant"
    ],
    "sentenceEn": [
      "Can",
      "you",
      "use",
      "chopsticks",
      "well?"
    ],
    "sentenceJa": "あなたは上手にはしを使えますか。",
    "sentenceDistractors": [
      "club",
      "pet"
    ]
  },
  {
    "num": "0008",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "bedroom",
    "phonetic": "[bédruːm]",
    "partOfSpeech": "名詞",
    "japanese": "寝室",
    "tip": "[読み: ベッドルーム] / カテゴリ: 家の中",
    "distractorsJa": [
      "道，道路",
      "教科、科目、話題",
      "体育館"
    ],
    "distractorsEn": [
      "road",
      "subject",
      "gym"
    ],
    "sentenceEn": [
      "My",
      "brother",
      "is",
      "cleaning",
      "his",
      "bedroom",
      "now."
    ],
    "sentenceJa": "私の兄は今、自分の寝室を掃除しています。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0009",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "brush",
    "phonetic": "[brʌʃ]",
    "partOfSpeech": "名詞",
    "japanese": "ブラシ、をみがく",
    "tip": "[読み: ブラッシ] / カテゴリ: 家の中 / 類義/関連: 参考:toothbrush(歯ブラシ), 参考:hairbrush(ヘアブラシ)",
    "distractorsJa": [
      "図書館",
      "歴史",
      "報告（書）、レポート"
    ],
    "distractorsEn": [
      "library",
      "history",
      "report"
    ],
    "sentenceEn": [
      "Don't",
      "forget",
      "to",
      "brush",
      "your",
      "teeth."
    ],
    "sentenceJa": "歯を磨くのを忘れないでください。",
    "sentenceDistractors": [
      "mystery",
      "menu"
    ]
  },
  {
    "num": "0010",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "video",
    "phonetic": "[vídiou]",
    "partOfSpeech": "名詞",
    "japanese": "ビデオ",
    "tip": "[読み: ヴィディオウ] / カテゴリ: 家の中",
    "distractorsJa": [
      "1時間、時刻",
      "体育館",
      "スーツケース"
    ],
    "distractorsEn": [
      "hour",
      "gym",
      "suitcase"
    ],
    "sentenceEn": [
      "I",
      "watched",
      "the",
      "music",
      "video",
      "on",
      "the",
      "Internet."
    ],
    "sentenceJa": "(私はそのミュージックビデオをインターネットで見た)",
    "sentenceDistractors": [
      "salt",
      "cell"
    ]
  },
  {
    "num": "0011",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "suitcase",
    "phonetic": "[súːtkeis]",
    "partOfSpeech": "名詞",
    "japanese": "スーツケース",
    "tip": "[読み: スートケイス] / カテゴリ: 家の中",
    "distractorsJa": [
      "明日、明日は",
      "授業、（教科書などの）課",
      "ビデオ"
    ],
    "distractorsEn": [
      "tomorrow",
      "lesson",
      "video"
    ],
    "sentenceEn": [
      "She",
      "put",
      "her",
      "clothes",
      "in",
      "the",
      "suitcase."
    ],
    "sentenceJa": "彼女はスーツケースに服を入れました。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0012",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "key",
    "phonetic": "[kíː]",
    "partOfSpeech": "名詞",
    "japanese": "かぎ",
    "tip": "[読み: キー] / カテゴリ: 家の中",
    "distractorsJa": [
      "授業、（教科書などの）課",
      "クラス、学級、授業",
      "歴史"
    ],
    "distractorsEn": [
      "lesson",
      "class",
      "history"
    ],
    "sentenceEn": [
      "I",
      "lost",
      "my",
      "key."
    ],
    "sentenceJa": "鍵をなくしました。",
    "sentenceDistractors": [
      "ink",
      "rainy"
    ]
  },
  {
    "num": "0013",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "window",
    "phonetic": "[wíndou]",
    "partOfSpeech": "名詞",
    "japanese": "窓",
    "tip": "[読み: ウィンドウ] / カテゴリ: 家の中",
    "distractorsJa": [
      "道，道路",
      "進路、科目",
      "書店"
    ],
    "distractorsEn": [
      "road",
      "course",
      "bookstore"
    ],
    "sentenceEn": [
      "I",
      "looked",
      "at",
      "the",
      "ocean",
      "from",
      "the",
      "window."
    ],
    "sentenceJa": "私は窓から海を眺めた",
    "sentenceDistractors": [
      "health",
      "technology"
    ]
  },
  {
    "num": "0014",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "pet",
    "phonetic": "[pét]",
    "partOfSpeech": "名詞",
    "japanese": "ペット",
    "tip": "[読み: ペット] / カテゴリ: 家の中",
    "distractorsJa": [
      "窓",
      "クラス、学級、授業",
      "歴史"
    ],
    "distractorsEn": [
      "window",
      "class",
      "history"
    ],
    "sentenceEn": [
      "Some",
      "people",
      "keep",
      "snakes",
      "as",
      "pets."
    ],
    "sentenceJa": "ペットにヘビを飼う人もいる",
    "sentenceDistractors": [
      "meeting",
      "son"
    ]
  },
  {
    "num": "0015",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "yesterday",
    "phonetic": "[jéstərdi]",
    "partOfSpeech": "名詞",
    "japanese": "昨日、昨日は",
    "tip": "[読み: イェスタディ] / カテゴリ: 時間 / フレーズ例: the day before yesterday (おととい)",
    "distractorsJa": [
      "列車，電車",
      "一員、会員、部員",
      "教科書"
    ],
    "distractorsEn": [
      "train",
      "member",
      "textbook"
    ],
    "sentenceEn": [
      "I",
      "went",
      "to",
      "school",
      "by",
      "bicycle",
      "yesterday."
    ],
    "sentenceJa": "私は昨日，自転車で学校に行きました",
    "sentenceDistractors": [
      "volunteer",
      "worry"
    ]
  },
  {
    "num": "0016",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "tomorrow",
    "phonetic": "[təmɑ́(ː)rou]",
    "partOfSpeech": "名詞",
    "japanese": "明日、明日は",
    "tip": "[読み: トゥマ（ー）ロウ] / カテゴリ: 時間",
    "distractorsJa": [
      "授業、（教科書などの）課",
      "分",
      "（食事用の）はし"
    ],
    "distractorsEn": [
      "lesson",
      "minute",
      "chopstick"
    ],
    "sentenceEn": [
      "We",
      "have",
      "an",
      "English",
      "test",
      "tomorrow."
    ],
    "sentenceJa": "私たちは明日、英語の試験がある",
    "sentenceDistractors": [
      "birthday",
      "yesterday"
    ]
  },
  {
    "num": "0017",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "now",
    "phonetic": "[náu]",
    "partOfSpeech": "名詞",
    "japanese": "今、今、現在は",
    "tip": "[読み: ナウ] / カテゴリ: 時間 / フレーズ例: from now (今から)",
    "distractorsJa": [
      "進路、科目",
      "宿題",
      "明日、明日は"
    ],
    "distractorsEn": [
      "course",
      "homework",
      "tomorrow"
    ],
    "sentenceEn": [
      "My",
      "parents",
      "live",
      "in",
      "New",
      "York",
      "now."
    ],
    "sentenceJa": "両親は今ニューヨークに住んでいる",
    "sentenceDistractors": [
      "him",
      "Japan"
    ]
  },
  {
    "num": "0018",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "hour",
    "phonetic": "[áuər]",
    "partOfSpeech": "名詞",
    "japanese": "1時間、時刻",
    "tip": "[読み: アウア] / カテゴリ: 時間 / メモ: 発音注意",
    "distractorsJa": [
      "絵、写真",
      "店",
      "博物館，美術館"
    ],
    "distractorsEn": [
      "picture",
      "store",
      "museum"
    ],
    "sentenceEn": [
      "It",
      "takes",
      "my",
      "sister",
      "an",
      "hour",
      "to",
      "get",
      "to",
      "her",
      "office."
    ],
    "sentenceJa": "姉が会社へ行くのに 1 時間かかる",
    "sentenceDistractors": [
      "sleep",
      "lunch"
    ]
  },
  {
    "num": "0019",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "minute",
    "phonetic": "[mínit]",
    "partOfSpeech": "名詞",
    "japanese": "分",
    "tip": "[読み: ミニット] / カテゴリ: 時間",
    "distractorsJa": [
      "宿題",
      "通り",
      "クラブ、部"
    ],
    "distractorsEn": [
      "homework",
      "street",
      "club"
    ],
    "sentenceEn": [
      "It's",
      "only",
      "three",
      "minutes'",
      "walk",
      "from",
      "the",
      "station."
    ],
    "sentenceJa": "駅からは歩いてほんの3分だ",
    "sentenceDistractors": [
      "hour",
      "girl"
    ]
  },
  {
    "num": "0020",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "month",
    "phonetic": "[mʌ́nθ]",
    "partOfSpeech": "名詞",
    "japanese": "1カ月、月",
    "tip": "[読み: マンス] / カテゴリ: 時間 / フレーズ例: last month (先月)",
    "distractorsJa": [
      "通り",
      "テスト、試験",
      "場所"
    ],
    "distractorsEn": [
      "street",
      "test",
      "place"
    ],
    "sentenceEn": [
      "We",
      "have",
      "a",
      "school",
      "festival",
      "next",
      "month."
    ],
    "sentenceJa": "来月学園祭がある",
    "sentenceDistractors": [
      "team",
      "hope"
    ]
  },
  {
    "num": "0021",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "year",
    "phonetic": "[jíər]",
    "partOfSpeech": "名詞",
    "japanese": "年、〜歳",
    "tip": "[読み: イア] / カテゴリ: 時間 / フレーズ例: next year (来年)",
    "distractorsJa": [
      "一員、会員、部員",
      "店",
      "レストラン"
    ],
    "distractorsEn": [
      "member",
      "store",
      "restaurant"
    ],
    "sentenceEn": [
      "My",
      "brother",
      "has",
      "lived",
      "in",
      "London",
      "for",
      "a",
      "year."
    ],
    "sentenceJa": "私の兄は１年間ロンドンに住んでいる",
    "sentenceDistractors": [
      "Mr.",
      "if"
    ]
  },
  {
    "num": "0022",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "lunchtime",
    "phonetic": "[lʌ́ntʃtàim]",
    "partOfSpeech": "名詞",
    "japanese": "昼食時間、ランチタイム",
    "tip": "[読み: ランチタイム] / カテゴリ: 時間",
    "distractorsJa": [
      "教科、科目、話題",
      "ノート",
      "競技会、コンテスト"
    ],
    "distractorsEn": [
      "subject",
      "notebook",
      "contest"
    ],
    "sentenceEn": [
      "We",
      "always",
      "play",
      "soccer",
      "at",
      "lunchtime."
    ],
    "sentenceJa": "私たちは昼食時間にいつもサッカーをします。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0023",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "homework",
    "phonetic": "[hóumwə̀ːrk]",
    "partOfSpeech": "名詞",
    "japanese": "宿題",
    "tip": "[読み: ホウムワーク] / カテゴリ: 学校 / フレーズ例: do one's homework (宿題をする)",
    "distractorsJa": [
      "集団、グループ",
      "数学",
      "1カ月、月"
    ],
    "distractorsEn": [
      "group",
      "math",
      "month"
    ],
    "sentenceEn": [
      "I",
      "did",
      "my",
      "homework",
      "right",
      "after",
      "I",
      "came",
      "home."
    ],
    "sentenceJa": "私は家に帰ってすぐに宿題をした",
    "sentenceDistractors": [
      "glad",
      "Internet"
    ]
  },
  {
    "num": "0024",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "test",
    "phonetic": "[tést]",
    "partOfSpeech": "名詞",
    "japanese": "テスト、試験",
    "tip": "[読み: テスト] / カテゴリ: 学校 / 類義/関連: 類義語:quiz(小テスト)",
    "distractorsJa": [
      "博物館，美術館",
      "カフェテリア、（学校などの）食堂",
      "授業、（教科書などの）課"
    ],
    "distractorsEn": [
      "museum",
      "cafeteria",
      "lesson"
    ],
    "sentenceEn": [
      "We",
      "had",
      "a",
      "science",
      "test",
      "today."
    ],
    "sentenceJa": "私たちは今日、理科のテストがあった",
    "sentenceDistractors": [
      "necessary",
      "point"
    ]
  },
  {
    "num": "0025",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "class",
    "phonetic": "[klǽs]",
    "partOfSpeech": "名詞",
    "japanese": "クラス、学級、授業",
    "tip": "[読み: クラス] / カテゴリ: 学校",
    "distractorsJa": [
      "書店",
      "通り",
      "明日、明日は"
    ],
    "distractorsEn": [
      "bookstore",
      "street",
      "tomorrow"
    ],
    "sentenceEn": [
      "There",
      "are",
      "thirty-two",
      "students",
      "in",
      "our",
      "class."
    ],
    "sentenceJa": "私たちのクラスには32人の生徒がいる",
    "sentenceDistractors": [
      "hard",
      "word"
    ]
  },
  {
    "num": "0026",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "classmate",
    "phonetic": "[klǽsmeit]",
    "partOfSpeech": "名詞",
    "japanese": "クラスメート、同級生",
    "tip": "[読み: クラスメイト] / カテゴリ: 学校",
    "distractorsJa": [
      "（本の）ページ",
      "駅",
      "競技会、コンテスト"
    ],
    "distractorsEn": [
      "page",
      "station",
      "contest"
    ],
    "sentenceEn": [
      "Eri",
      "and",
      "Rie",
      "were",
      "classmates",
      "last",
      "year."
    ],
    "sentenceJa": "エリとリエは去年クラスメイトだった",
    "sentenceDistractors": [
      "break",
      "fun"
    ]
  },
  {
    "num": "0027",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "lesson",
    "phonetic": "[lés(ə)n]",
    "partOfSpeech": "名詞",
    "japanese": "授業、（教科書などの）課",
    "tip": "[読み: レスン] / カテゴリ: 学校 / フレーズ例: Lesson 4 (第4課)",
    "distractorsJa": [
      "寝室",
      "年、〜歳",
      "手紙、文字"
    ],
    "distractorsEn": [
      "bedroom",
      "year",
      "letter"
    ],
    "sentenceEn": [
      "What",
      "time",
      "will",
      "this",
      "lesson",
      "end?"
    ],
    "sentenceJa": "この授業は何時に終わりますか",
    "sentenceDistractors": [
      "difference",
      "yet"
    ]
  },
  {
    "num": "0028",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "subject",
    "phonetic": "[sʌ́bdʒekt]",
    "partOfSpeech": "名詞",
    "japanese": "教科、科目、話題",
    "tip": "[読み: サブヂェクト] / カテゴリ: 学校",
    "distractorsJa": [
      "コンピューター",
      "駅",
      "ブラシ、をみがく"
    ],
    "distractorsEn": [
      "computer",
      "station",
      "brush"
    ],
    "sentenceEn": [
      "What",
      "subject",
      "do",
      "you",
      "like",
      "the",
      "best?"
    ],
    "sentenceJa": "あなたはどの科目がいちばん好きですか",
    "sentenceDistractors": [
      "lead",
      "war"
    ]
  },
  {
    "num": "0029",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "math",
    "phonetic": "[mǽθ]",
    "partOfSpeech": "名詞",
    "japanese": "数学",
    "tip": "[読み: マス] / カテゴリ: 学校 / 類義/関連: 同意語:mathematics()",
    "distractorsJa": [
      "テスト、試験",
      "明日、明日は",
      "ビデオ"
    ],
    "distractorsEn": [
      "test",
      "tomorrow",
      "video"
    ],
    "sentenceEn": [
      "My",
      "brother",
      "is",
      "good",
      "at",
      "math."
    ],
    "sentenceJa": "兄は数学が得意だ",
    "sentenceDistractors": [
      "busy",
      "environment"
    ]
  },
  {
    "num": "0030",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "science",
    "phonetic": "[sáiəns]",
    "partOfSpeech": "名詞",
    "japanese": "科学、理科",
    "tip": "[読み: サイエンス] / カテゴリ: 学校",
    "distractorsJa": [
      "寝室",
      "進路、科目",
      "クラスメート、同級生"
    ],
    "distractorsEn": [
      "bedroom",
      "course",
      "classmate"
    ],
    "sentenceEn": [
      "Are",
      "you",
      "ready",
      "for",
      "the",
      "science",
      "test?"
    ],
    "sentenceJa": "あなたは理科のテストの準備ができていますか",
    "sentenceDistractors": [
      "since",
      "into"
    ]
  },
  {
    "num": "0031",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "history",
    "phonetic": "[híst(ə)ri]",
    "partOfSpeech": "名詞",
    "japanese": "歴史",
    "tip": "[読み: ヒストリィ] / カテゴリ: 学校",
    "distractorsJa": [
      "クラブ、部",
      "宿題",
      "報告（書）、レポート"
    ],
    "distractorsEn": [
      "club",
      "homework",
      "report"
    ],
    "sentenceEn": [
      "She",
      "studied",
      "Japanese",
      "history",
      "at",
      "college."
    ],
    "sentenceJa": "彼女は大学で日本史を研究した",
    "sentenceDistractors": [
      "favorite",
      "sit"
    ]
  },
  {
    "num": "0032",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "speech",
    "phonetic": "[spíːtʃ]",
    "partOfSpeech": "名詞",
    "japanese": "話すこと、演説、スピーチ",
    "tip": "[読み: スピーチ] / カテゴリ: 学校 / 類義/関連: 関連語:speak(（を）話す、演説する)",
    "distractorsJa": [
      "進路、科目",
      "通り",
      "ノート"
    ],
    "distractorsEn": [
      "course",
      "street",
      "notebook"
    ],
    "sentenceEn": [
      "Lisa",
      "made",
      "a",
      "speech",
      "in",
      "English."
    ],
    "sentenceJa": "リサは英語でスピーチをした",
    "sentenceDistractors": [
      "sea",
      "speak"
    ]
  },
  {
    "num": "0033",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "report",
    "phonetic": "[ripɔ́ːrt]",
    "partOfSpeech": "名詞",
    "japanese": "報告（書）、レポート",
    "tip": "[読み: リポート] / カテゴリ: 学校",
    "distractorsJa": [
      "数学",
      "進路、科目",
      "寝室"
    ],
    "distractorsEn": [
      "math",
      "course",
      "bedroom"
    ],
    "sentenceEn": [
      "I",
      "wrote",
      "a",
      "report",
      "on",
      "the",
      "meeting."
    ],
    "sentenceJa": "私は会議の報告書を書いた",
    "sentenceDistractors": [
      "business",
      "cut"
    ]
  },
  {
    "num": "0034",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "textbook",
    "phonetic": "[tékstbùk]",
    "partOfSpeech": "名詞",
    "japanese": "教科書",
    "tip": "[読み: テクストブック] / カテゴリ: 学校 / フレーズ例: an English textbook (英語の教科書)",
    "distractorsJa": [
      "科学、理科",
      "クラブ、部",
      "進路、科目"
    ],
    "distractorsEn": [
      "science",
      "club",
      "course"
    ],
    "sentenceEn": [
      "I",
      "have",
      "to",
      "read",
      "the",
      "textbook",
      "twice."
    ],
    "sentenceJa": "(私は教科書を2度読まなければならない)",
    "sentenceDistractors": [
      "recycle",
      "soldier"
    ]
  },
  {
    "num": "0035",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "notebook",
    "phonetic": "[nóutbùk]",
    "partOfSpeech": "名詞",
    "japanese": "ノート",
    "tip": "[読み: ノウトブック] / カテゴリ: 学校 / 類義/関連: 参考:note(メモ)",
    "distractorsJa": [
      "一員、会員、部員",
      "空港，飛行場",
      "図書館"
    ],
    "distractorsEn": [
      "member",
      "airport",
      "library"
    ],
    "sentenceEn": [
      "Can",
      "you",
      "show",
      "me",
      "your",
      "notebook?"
    ],
    "sentenceJa": "あなたのノートを見せてもらえますか",
    "sentenceDistractors": [
      "king",
      "solar"
    ]
  },
  {
    "num": "0036",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "page",
    "phonetic": "[péidʒ]",
    "partOfSpeech": "名詞",
    "japanese": "（本の）ページ",
    "tip": "[読み: ペイヂ] / カテゴリ: 学校",
    "distractorsJa": [
      "歴史",
      "昨日、昨日は",
      "科学、理科"
    ],
    "distractorsEn": [
      "history",
      "yesterday",
      "science"
    ],
    "sentenceEn": [
      "Please",
      "open",
      "your",
      "textbooks",
      "to",
      "page",
      "50."
    ],
    "sentenceJa": "(教科書の50ページを開いてください)",
    "sentenceDistractors": [
      "bath",
      "serve"
    ]
  },
  {
    "num": "0037",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "cafeteria",
    "phonetic": "[kæ̀fətí(ə)riə]",
    "partOfSpeech": "名詞",
    "japanese": "カフェテリア、（学校などの）食堂",
    "tip": "[読み: キャふエティ（ア）リア] / カテゴリ: 学校",
    "distractorsJa": [
      "今、今、現在は",
      "店",
      "博物館，美術館"
    ],
    "distractorsEn": [
      "now",
      "store",
      "museum"
    ],
    "sentenceEn": [
      "Let's",
      "have",
      "lunch",
      "together",
      "in",
      "the",
      "cafeteria."
    ],
    "sentenceJa": "カフェテリア（食堂）で一緒に昼食を食べましょう。",
    "sentenceDistractors": [
      "towel",
      "European"
    ]
  },
  {
    "num": "0038",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "library",
    "phonetic": "[láibreri]",
    "partOfSpeech": "名詞",
    "japanese": "図書館",
    "tip": "[読み: ライブレリィ] / カテゴリ: 学校",
    "distractorsJa": [
      "場所",
      "1時間、時刻",
      "進路、科目"
    ],
    "distractorsEn": [
      "place",
      "hour",
      "course"
    ],
    "sentenceEn": [
      "I",
      "went",
      "to",
      "the",
      "library",
      "to",
      "read",
      "some",
      "books."
    ],
    "sentenceJa": "私は本を読むために図書館へ行った",
    "sentenceDistractors": [
      "shop",
      "member"
    ]
  },
  {
    "num": "0039",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "gym",
    "phonetic": "[dʒím]",
    "partOfSpeech": "名詞",
    "japanese": "体育館",
    "tip": "[読み: ヂム] / カテゴリ: 学校",
    "distractorsJa": [
      "明日、明日は",
      "一員、会員、部員",
      "手紙、文字"
    ],
    "distractorsEn": [
      "tomorrow",
      "member",
      "letter"
    ],
    "sentenceEn": [
      "We",
      "played",
      "volleyball",
      "in",
      "the",
      "gym",
      "this",
      "afternoon."
    ],
    "sentenceJa": "(私たちは今日の午後, 体育館でバレーボールをした)",
    "sentenceDistractors": [
      "castle",
      "drop"
    ]
  },
  {
    "num": "0040",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "club",
    "phonetic": "[klʌ́b]",
    "partOfSpeech": "名詞",
    "japanese": "クラブ、部",
    "tip": "[読み: クラブ] / カテゴリ: 学校",
    "distractorsJa": [
      "報告（書）、レポート",
      "（総合）大学",
      "年、〜歳"
    ],
    "distractorsEn": [
      "report",
      "university",
      "year"
    ],
    "sentenceEn": [
      "Does",
      "your",
      "school",
      "have",
      "an",
      "art",
      "club?"
    ],
    "sentenceJa": "（あなたの学校に美術部ありますか）",
    "sentenceDistractors": [
      "sometimes",
      "number"
    ]
  },
  {
    "num": "0041",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "college",
    "phonetic": "[kɑ́(ː)lidʒ]",
    "partOfSpeech": "名詞",
    "japanese": "大学、単科大学",
    "tip": "[読み: カ（ー）リッヂ] / カテゴリ: 学校",
    "distractorsJa": [
      "歴史",
      "駅",
      "ペット"
    ],
    "distractorsEn": [
      "history",
      "station",
      "pet"
    ],
    "sentenceEn": [
      "I",
      "want",
      "to",
      "study",
      "at",
      "a",
      "college",
      "in",
      "a",
      "foreign",
      "country."
    ],
    "sentenceJa": "私は外国の大学で勉強したい",
    "sentenceDistractors": [
      "nine",
      "electricity"
    ]
  },
  {
    "num": "0042",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "university",
    "phonetic": "[jùːnivə́ːrsəti]",
    "partOfSpeech": "名詞",
    "japanese": "（総合）大学",
    "tip": "[読み: ユーニヴァ〜スィティ] / カテゴリ: 学校",
    "distractorsJa": [
      "1時間、時刻",
      "図書館",
      "カフェテリア、（学校などの）食堂"
    ],
    "distractorsEn": [
      "hour",
      "library",
      "cafeteria"
    ],
    "sentenceEn": [
      "My",
      "parents",
      "went",
      "to",
      "the",
      "same",
      "university."
    ],
    "sentenceJa": "私の両親は同じ大学に通った",
    "sentenceDistractors": [
      "black",
      "contest"
    ]
  },
  {
    "num": "0043",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "course",
    "phonetic": "[kɔ́ːrs]",
    "partOfSpeech": "名詞",
    "japanese": "進路、科目",
    "tip": "[読み: コース] / カテゴリ: 学校",
    "distractorsJa": [
      "雑誌",
      "集団、グループ",
      "年、〜歳"
    ],
    "distractorsEn": [
      "magazine",
      "group",
      "year"
    ],
    "sentenceEn": [
      "The",
      "ship",
      "changed",
      "its",
      "course",
      "to",
      "the",
      "south."
    ],
    "sentenceJa": "その船は南にコースを変えた",
    "sentenceDistractors": [
      "send",
      "person"
    ]
  },
  {
    "num": "0044",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "contest",
    "phonetic": "[kɑ́(ː)ntest]",
    "partOfSpeech": "名詞",
    "japanese": "競技会、コンテスト",
    "tip": "[読み: カ（ー）ンテスト] / カテゴリ: 学校",
    "distractorsJa": [
      "空港，飛行場",
      "（総合）大学",
      "公園、運動場"
    ],
    "distractorsEn": [
      "airport",
      "university",
      "park"
    ],
    "sentenceEn": [
      "Nao",
      "won",
      "first",
      "prize",
      "in",
      "the",
      "speech",
      "contest."
    ],
    "sentenceJa": "ナオはスピーチコンテストで優勝した",
    "sentenceDistractors": [
      "far",
      "alone"
    ]
  },
  {
    "num": "0045",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "group",
    "phonetic": "[ɡrúːp]",
    "partOfSpeech": "名詞",
    "japanese": "集団、グループ",
    "tip": "[読み: グループ] / カテゴリ: 学校",
    "distractorsJa": [
      "クラス、学級、授業",
      "教科書",
      "道，道路"
    ],
    "distractorsEn": [
      "class",
      "textbook",
      "road"
    ],
    "sentenceEn": [
      "A",
      "group",
      "of",
      "children",
      "was",
      "dancing",
      "in",
      "the",
      "park."
    ],
    "sentenceJa": "子どもたちの集団が公園でダンスをしていた",
    "sentenceDistractors": [
      "large",
      "restaurant"
    ]
  },
  {
    "num": "0046",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "member",
    "phonetic": "[mémbər]",
    "partOfSpeech": "名詞",
    "japanese": "一員、会員、部員",
    "tip": "[読み: メンバァ] / カテゴリ: 学校",
    "distractorsJa": [
      "クラスメート、同級生",
      "話すこと、演説、スピーチ",
      "昨日、昨日は"
    ],
    "distractorsEn": [
      "classmate",
      "speech",
      "yesterday"
    ],
    "sentenceEn": [
      "Our",
      "soccer",
      "team",
      "has",
      "30",
      "members."
    ],
    "sentenceJa": "（私たちのサッカーチームには 30 人のメンバーがいる）",
    "sentenceDistractors": [
      "story",
      "minute"
    ]
  },
  {
    "num": "0047",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "park",
    "phonetic": "[pɑ́ːrk]",
    "partOfSpeech": "名詞",
    "japanese": "公園、運動場",
    "tip": "[読み: パーク] / カテゴリ: 町の中",
    "distractorsJa": [
      "（総合）大学",
      "今、今、現在は",
      "列車，電車"
    ],
    "distractorsEn": [
      "university",
      "now",
      "train"
    ],
    "sentenceEn": [
      "There",
      "were",
      "many",
      "people",
      "in",
      "the",
      "park",
      "today."
    ],
    "sentenceJa": "今日，その公園にはたくさんの人がいた",
    "sentenceDistractors": [
      "club",
      "during"
    ]
  },
  {
    "num": "0048",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "restaurant",
    "phonetic": "[réstərənt]",
    "partOfSpeech": "名詞",
    "japanese": "レストラン",
    "tip": "[読み: レストラン ト] / カテゴリ: 町の中",
    "distractorsJa": [
      "列車，電車",
      "駅",
      "通り"
    ],
    "distractorsEn": [
      "train",
      "station",
      "street"
    ],
    "sentenceEn": [
      "Let's",
      "have",
      "dinner",
      "at",
      "that",
      "famous",
      "restaurant."
    ],
    "sentenceJa": "あの有名なレストランで夕食を食べよう",
    "sentenceDistractors": [
      "bag",
      "trip"
    ]
  },
  {
    "num": "0049",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "store",
    "phonetic": "[stɔ́ːr]",
    "partOfSpeech": "名詞",
    "japanese": "店",
    "tip": "[読み: ストー] / カテゴリ: 町の中 / 類義/関連: 同意語:shop()",
    "distractorsJa": [
      "教科書",
      "カフェテリア、（学校などの）食堂",
      "台所"
    ],
    "distractorsEn": [
      "textbook",
      "cafeteria",
      "kitchen"
    ],
    "sentenceEn": [
      "There",
      "is",
      "only",
      "one",
      "store",
      "in",
      "the",
      "village."
    ],
    "sentenceJa": "その村には店が1軒しかない",
    "sentenceDistractors": [
      "close",
      "end"
    ]
  },
  {
    "num": "0050",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "bookstore",
    "phonetic": "[búkstɔ̀ːr]",
    "partOfSpeech": "名詞",
    "japanese": "書店",
    "tip": "[読み: ブックストー] / カテゴリ: 町の中",
    "distractorsJa": [
      "歴史",
      "一員、会員、部員",
      "自転車"
    ],
    "distractorsEn": [
      "history",
      "member",
      "bike"
    ],
    "sentenceEn": [
      "I",
      "bought",
      "some",
      "comic",
      "books",
      "at",
      "the",
      "bookstore."
    ],
    "sentenceJa": "(私はその書店でマンガ本を何冊か買った)",
    "sentenceDistractors": [
      "similar",
      "umbrella"
    ]
  },
  {
    "num": "0051",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "museum",
    "phonetic": "[mju(:)zí(:)əm]",
    "partOfSpeech": "名詞",
    "japanese": "博物館，美術館",
    "tip": "[読み: ミュー(ー)ズィ(ー)アム] / カテゴリ: 町の中 / メモ: アクセント注意",
    "distractorsJa": [
      "年、〜歳",
      "昨日、昨日は",
      "ブラシ、をみがく"
    ],
    "distractorsEn": [
      "year",
      "yesterday",
      "brush"
    ],
    "sentenceEn": [
      "I",
      "saw",
      "many",
      "old",
      "pictures",
      "at",
      "the",
      "art",
      "museum."
    ],
    "sentenceJa": "私は美術館で古い絵をたくさん見た",
    "sentenceDistractors": [
      "information",
      "large"
    ]
  },
  {
    "num": "0052",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "station",
    "phonetic": "[stéiʃ(ə)n]",
    "partOfSpeech": "名詞",
    "japanese": "駅",
    "tip": "[読み: ステイション] / カテゴリ: 町の中 / フレーズ例: a police station (警察署)",
    "distractorsJa": [
      "ペット",
      "手紙、文字",
      "年、〜歳"
    ],
    "distractorsEn": [
      "pet",
      "letter",
      "year"
    ],
    "sentenceEn": [
      "She",
      "bought",
      "a",
      "newspaper",
      "at",
      "the",
      "station."
    ],
    "sentenceJa": "彼女は駅で新聞を買った",
    "sentenceDistractors": [
      "hope",
      "remember"
    ]
  },
  {
    "num": "0053",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "train",
    "phonetic": "[trein]",
    "partOfSpeech": "名詞",
    "japanese": "列車，電車",
    "tip": "[読み: トゥレイン] / カテゴリ: 町の中",
    "distractorsJa": [
      "明日、明日は",
      "スーツケース",
      "通り"
    ],
    "distractorsEn": [
      "tomorrow",
      "suitcase",
      "street"
    ],
    "sentenceEn": [
      "I",
      "was",
      "able",
      "to",
      "catch",
      "the",
      "first",
      "train",
      "this",
      "morning."
    ],
    "sentenceJa": "（私は今朝，始発電車に乗ることができた）",
    "sentenceDistractors": [
      "grow",
      "summer"
    ]
  },
  {
    "num": "0054",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "airport",
    "phonetic": "[éərpɔ:rt]",
    "partOfSpeech": "名詞",
    "japanese": "空港，飛行場",
    "tip": "[読み: エアポート] / カテゴリ: 町の中",
    "distractorsJa": [
      "昨日、昨日は",
      "数学",
      "（食事用の）はし"
    ],
    "distractorsEn": [
      "yesterday",
      "math",
      "chopstick"
    ],
    "sentenceEn": [
      "It",
      "takes",
      "an",
      "hour",
      "to",
      "get",
      "to",
      "the",
      "airport."
    ],
    "sentenceJa": "(空港に到着するのに１時間かかる)",
    "sentenceDistractors": [
      "middle",
      "above"
    ]
  },
  {
    "num": "0055",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "bike",
    "phonetic": "[baik]",
    "partOfSpeech": "名詞",
    "japanese": "自転車",
    "tip": "[読み: バイク] / カテゴリ: 町の中 / 類義/関連: 同意語:bicycle(自転車)",
    "distractorsJa": [
      "公園、運動場",
      "手紙、文字",
      "書店"
    ],
    "distractorsEn": [
      "park",
      "letter",
      "bookstore"
    ],
    "sentenceEn": [
      "Let's",
      "ride",
      "our",
      "bikes",
      "around",
      "the",
      "lake."
    ],
    "sentenceJa": "湖のまわりを自転車に乗って回ろう",
    "sentenceDistractors": [
      "drink",
      "sing"
    ]
  },
  {
    "num": "0056",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "street",
    "phonetic": "[stri:t]",
    "partOfSpeech": "名詞",
    "japanese": "通り",
    "tip": "[読み: ストゥリート] / カテゴリ: 町の中 / 類義/関連: 参考表現:road(道路)",
    "distractorsJa": [
      "ノート",
      "ビデオ",
      "授業、（教科書などの）課"
    ],
    "distractorsEn": [
      "notebook",
      "video",
      "lesson"
    ],
    "sentenceEn": [
      "This",
      "street",
      "is",
      "always",
      "busy",
      "with",
      "cars",
      "and",
      "trucks."
    ],
    "sentenceJa": "この通りは車やトラックでいつも混んでいる",
    "sentenceDistractors": [
      "free",
      "present"
    ]
  },
  {
    "num": "0057",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "road",
    "phonetic": "[roud]",
    "partOfSpeech": "名詞",
    "japanese": "道，道路",
    "tip": "[読み: ロウド] / カテゴリ: 町の中 / 類義/関連: 参考表現:street(通り)",
    "distractorsJa": [
      "歴史",
      "絵、写真",
      "今、今、現在は"
    ],
    "distractorsEn": [
      "history",
      "picture",
      "now"
    ],
    "sentenceEn": [
      "A",
      "big",
      "dog",
      "ran",
      "across",
      "the",
      "road."
    ],
    "sentenceJa": "大きなイヌがその道路を走って横切った",
    "sentenceDistractors": [
      "exciting",
      "host"
    ]
  },
  {
    "num": "0058",
    "level": 1,
    "stageSlug": "eiken4_stage01",
    "english": "place",
    "phonetic": "[pleis]",
    "partOfSpeech": "名詞",
    "japanese": "場所",
    "tip": "[読み: プレイス] / カテゴリ: 町の中",
    "distractorsJa": [
      "テスト、試験",
      "クラスメート、同級生",
      "体育館"
    ],
    "distractorsEn": [
      "test",
      "classmate",
      "gym"
    ],
    "sentenceEn": [
      "Kyoto",
      "is",
      "a",
      "nice",
      "place",
      "to",
      "visit."
    ],
    "sentenceJa": "京都は訪れるのによい場所だ",
    "sentenceDistractors": [
      "does",
      "write"
    ]
  },
  {
    "num": "0059",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "hospital",
    "phonetic": "[hɑ́(:)spitl]",
    "partOfSpeech": "名詞",
    "japanese": "病院",
    "tip": "[読み: ハ(ー)スピトゥる] / カテゴリ: 町の中",
    "distractorsJa": [
      "ジュース",
      "医者",
      "息子"
    ],
    "distractorsEn": [
      "juice",
      "doctor",
      "son"
    ],
    "sentenceEn": [
      "My",
      "grandmother",
      "is",
      "in",
      "the",
      "hospital",
      "now."
    ],
    "sentenceJa": "私の祖母は今入院しています。",
    "sentenceDistractors": [
      "skirt",
      "dinner"
    ]
  },
  {
    "num": "0060",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "hotel",
    "phonetic": "[hòutél]",
    "partOfSpeech": "名詞",
    "japanese": "ホテル",
    "tip": "[読み: ホウテル] / カテゴリ: 町の中 / メモ: アクセント注意",
    "distractorsJa": [
      "ピクニック，遠足",
      "サラダ",
      "番組，計画"
    ],
    "distractorsEn": [
      "picnic",
      "salad",
      "program"
    ],
    "sentenceEn": [
      "We",
      "stayed",
      "at",
      "the",
      "hotel",
      "for",
      "three",
      "nights."
    ],
    "sentenceJa": "私たちはそのホテルに3泊した",
    "sentenceDistractors": [
      "real",
      "low"
    ]
  },
  {
    "num": "0061",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "pool",
    "phonetic": "[pu:l]",
    "partOfSpeech": "名詞",
    "japanese": "プール",
    "tip": "[読み: プール] / カテゴリ: 町の中 / フレーズ例: a swimming pool ((水泳用)プール)",
    "distractorsJa": [
      "医者",
      "ジュース",
      "アパート"
    ],
    "distractorsEn": [
      "doctor",
      "juice",
      "apartment"
    ],
    "sentenceEn": [
      "Let's",
      "go",
      "for",
      "a",
      "swim",
      "in",
      "the",
      "pool."
    ],
    "sentenceJa": "プールに泳ぎに行きましょう。",
    "sentenceDistractors": [
      "surprise",
      "competition"
    ]
  },
  {
    "num": "0062",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "apartment",
    "phonetic": "[əpɑ́:rtmənt]",
    "partOfSpeech": "名詞",
    "japanese": "アパート",
    "tip": "[読み: アパートメント] / カテゴリ: 町の中",
    "distractorsJa": [
      "食べ物",
      "熱",
      "パーティー"
    ],
    "distractorsEn": [
      "food",
      "fever",
      "party"
    ],
    "sentenceEn": [
      "They",
      "live",
      "in",
      "a",
      "small",
      "apartment."
    ],
    "sentenceJa": "彼らは小さなアパートに住んでいます。",
    "sentenceDistractors": [
      "worst",
      "café"
    ]
  },
  {
    "num": "0063",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "garden",
    "phonetic": "[gɑ́:rd(ə)n]",
    "partOfSpeech": "名詞",
    "japanese": "庭，庭園",
    "tip": "[読み: ガードゥン] / カテゴリ: 町の中 / 類義/関連: 同意語:yard(庭) / フレーズ例: a flower garden (花園)",
    "distractorsJa": [
      "スープ",
      "ホテル",
      "仕事，職"
    ],
    "distractorsEn": [
      "soup",
      "hotel",
      "job"
    ],
    "sentenceEn": [
      "Do",
      "you",
      "have",
      "flowers",
      "in",
      "your",
      "garden?"
    ],
    "sentenceJa": "（あなたの庭に花はありますか）",
    "sentenceDistractors": [
      "gold",
      "done"
    ]
  },
  {
    "num": "0064",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "zoo",
    "phonetic": "[zu:]",
    "partOfSpeech": "名詞",
    "japanese": "動物園",
    "tip": "[読み: ズー] / カテゴリ: 町の中",
    "distractorsJa": [
      "祖母，おばあさん",
      "目",
      "映画"
    ],
    "distractorsEn": [
      "grandmother",
      "eye",
      "movie"
    ],
    "sentenceEn": [
      "Let's",
      "go",
      "to",
      "see",
      "the",
      "monkeys",
      "at",
      "the",
      "zoo."
    ],
    "sentenceJa": "動物園のサルを見に行こう",
    "sentenceDistractors": [
      "check",
      "excuse"
    ]
  },
  {
    "num": "0065",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "town",
    "phonetic": "[taun]",
    "partOfSpeech": "名詞",
    "japanese": "町",
    "tip": "[読み: タウン] / カテゴリ: 町の中 / 類義/関連: 参考表現:village(村), 参考表現:city(市，都市)",
    "distractorsJa": [
      "週末",
      "病院",
      "ピクニック，遠足"
    ],
    "distractorsEn": [
      "weekend",
      "hospital",
      "picnic"
    ],
    "sentenceEn": [
      "Their",
      "house",
      "is",
      "in",
      "the",
      "middle",
      "of",
      "the",
      "town."
    ],
    "sentenceJa": "彼らの家は町のまん中にある",
    "sentenceDistractors": [
      "run",
      "move"
    ]
  },
  {
    "num": "0066",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "building",
    "phonetic": "[bíldiŋ]",
    "partOfSpeech": "名詞",
    "japanese": "建物，ビル",
    "tip": "[読み: ビルディング] / カテゴリ: 町の中",
    "distractorsJa": [
      "事務所，会社，役所",
      "パンケーキ",
      "チョコレート"
    ],
    "distractorsEn": [
      "office",
      "pancake",
      "chocolate"
    ],
    "sentenceEn": [
      "That",
      "building",
      "is",
      "over",
      "80",
      "years",
      "old."
    ],
    "sentenceJa": "その建物は築80年を超えている",
    "sentenceDistractors": [
      "homework",
      "plan"
    ]
  },
  {
    "num": "0067",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "company",
    "phonetic": "[kʌ́mp(ə)ni]",
    "partOfSpeech": "名詞",
    "japanese": "会社",
    "tip": "[読み: カンパニィ] / カテゴリ: 町の中",
    "distractorsJa": [
      "腕",
      "(短期間の)旅行",
      "メニュー"
    ],
    "distractorsEn": [
      "arm",
      "trip",
      "menu"
    ],
    "sentenceEn": [
      "My",
      "father",
      "works",
      "for",
      "a",
      "big",
      "company."
    ],
    "sentenceJa": "私の父は大きな会社で働いています。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0068",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "office",
    "phonetic": "[ɔ́(:)fəs]",
    "partOfSpeech": "名詞",
    "japanese": "事務所，会社，役所",
    "tip": "[読み: ア(ー)フィス] / カテゴリ: 町の中 / フレーズ例: a post office (郵便局)",
    "distractorsJa": [
      "おば",
      "歯科医",
      "コーヒー"
    ],
    "distractorsEn": [
      "aunt",
      "dentist",
      "coffee"
    ],
    "sentenceEn": [
      "My",
      "mother",
      "goes",
      "to",
      "her",
      "office",
      "by",
      "train."
    ],
    "sentenceJa": "母は電車で会社に行く",
    "sentenceDistractors": [
      "p.m. / P.M.",
      "share"
    ]
  },
  {
    "num": "0069",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "bank",
    "phonetic": "[bæŋk]",
    "partOfSpeech": "名詞",
    "japanese": "銀行",
    "tip": "[読み: バンク] / カテゴリ: 町の中",
    "distractorsJa": [
      "医者",
      "歯科医",
      "親，(parentsで)両親"
    ],
    "distractorsEn": [
      "doctor",
      "dentist",
      "parent"
    ],
    "sentenceEn": [
      "The",
      "bank",
      "closes",
      "at",
      "three",
      "o'clock."
    ],
    "sentenceJa": "(その銀行は3時に閉まる)",
    "sentenceDistractors": [
      "site",
      "bath"
    ]
  },
  {
    "num": "0070",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "ship",
    "phonetic": "[ʃip]",
    "partOfSpeech": "名詞",
    "japanese": "(大型の)船",
    "tip": "[読み: シップ] / カテゴリ: 町の中 / 類義/関連: 同意語:boat((小型の)船) / フレーズ例: by ship (船で)",
    "distractorsJa": [
      "祝日，休暇",
      "祖母，おばあさん",
      "病院"
    ],
    "distractorsEn": [
      "holiday",
      "grandmother",
      "hospital"
    ],
    "sentenceEn": [
      "Those",
      "bananas",
      "came",
      "to",
      "Japan",
      "by",
      "ship."
    ],
    "sentenceJa": "(それらのバナナは船で日本に来た)",
    "sentenceDistractors": [
      "communicate",
      "against"
    ]
  },
  {
    "num": "0071",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "party",
    "phonetic": "[pɑ́:rti]",
    "partOfSpeech": "名詞",
    "japanese": "パーティー",
    "tip": "[読み: パーティ] / カテゴリ: 趣味・休日 / フレーズ例: a birthday party (誕生日パーティー)",
    "distractorsJa": [
      "息子",
      "目",
      "パイロット"
    ],
    "distractorsEn": [
      "son",
      "eye",
      "pilot"
    ],
    "sentenceEn": [
      "We",
      "had",
      "a",
      "birthday",
      "party",
      "for",
      "Ken",
      "yesterday."
    ],
    "sentenceJa": "私たちは昨日ケンの誕生日パーティーを開いた。",
    "sentenceDistractors": [
      "spell",
      "cold"
    ]
  },
  {
    "num": "0072",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "game",
    "phonetic": "[geim]",
    "partOfSpeech": "名詞",
    "japanese": "遊び，ゲーム，試合",
    "tip": "[読み: ゲイム] / カテゴリ: 趣味・休日",
    "distractorsJa": [
      "スープ",
      "パーティー",
      "目"
    ],
    "distractorsEn": [
      "soup",
      "party",
      "eye"
    ],
    "sentenceEn": [
      "I",
      "saw",
      "an",
      "exciting",
      "baseball",
      "game",
      "on",
      "TV."
    ],
    "sentenceJa": "テレビでわくわくするような野球の試合を見た",
    "sentenceDistractors": [
      "I",
      "of"
    ]
  },
  {
    "num": "0073",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "shopping",
    "phonetic": "[ʃɑ́(:)piŋ]",
    "partOfSpeech": "名詞",
    "japanese": "買い物",
    "tip": "[読み: シャ(ー)ピング] / カテゴリ: 趣味・休日 / フレーズ例: online shopping (オンラインショッピング)",
    "distractorsJa": [
      "トースト",
      "親，(parentsで)両親",
      "パーティー"
    ],
    "distractorsEn": [
      "toast",
      "parent",
      "party"
    ],
    "sentenceEn": [
      "I",
      "often",
      "do",
      "shopping",
      "online."
    ],
    "sentenceJa": "私はよくオンラインで買い物をする",
    "sentenceDistractors": [
      "once",
      "afraid"
    ]
  },
  {
    "num": "0074",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "present",
    "phonetic": "[préz(ə)nt]",
    "partOfSpeech": "名詞",
    "japanese": "贈り物，プレゼント、を贈る",
    "tip": "[読み: プレゼント] / カテゴリ: 趣味・休日 / フレーズ例: a Christmas present (クリスマスプレゼント)",
    "distractorsJa": [
      "俳優",
      "アパート",
      "トースト"
    ],
    "distractorsEn": [
      "actor",
      "apartment",
      "toast"
    ],
    "sentenceEn": [
      "Thank",
      "you",
      "very",
      "much",
      "for",
      "your",
      "nice",
      "present."
    ],
    "sentenceJa": "すてきな贈り物をどうもありがとう",
    "sentenceDistractors": [
      "already",
      "save"
    ]
  },
  {
    "num": "0075",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "weekend",
    "phonetic": "[wí:kend]",
    "partOfSpeech": "名詞",
    "japanese": "週末",
    "tip": "[読み: ウィーケンド] / カテゴリ: 趣味・休日",
    "distractorsJa": [
      "パーティー",
      "親，(parentsで)両親",
      "息子"
    ],
    "distractorsEn": [
      "party",
      "parent",
      "son"
    ],
    "sentenceEn": [
      "Are",
      "you",
      "free",
      "this",
      "weekend?"
    ],
    "sentenceJa": "あなたは今度の週末はひまですか",
    "sentenceDistractors": [
      "produce",
      "wow"
    ]
  },
  {
    "num": "0076",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "holiday",
    "phonetic": "[hɑ́(:)lədei]",
    "partOfSpeech": "名詞",
    "japanese": "祝日，休暇",
    "tip": "[読み: ハ(ー)リデイ] / カテゴリ: 趣味・休日 / 類義/関連: 同意語:vacation(休み，休暇) / フレーズ例: on holiday (休暇で)",
    "distractorsJa": [
      "ハンバーガー",
      "病院",
      "コーヒー"
    ],
    "distractorsEn": [
      "hamburger",
      "hospital",
      "coffee"
    ],
    "sentenceEn": [
      "Saturday",
      "is",
      "not",
      "a",
      "holiday",
      "at",
      "my",
      "school."
    ],
    "sentenceJa": "私の学校では土曜日は休みではない。",
    "sentenceDistractors": [
      "drum",
      "traffic"
    ]
  },
  {
    "num": "0077",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "movie",
    "phonetic": "[mú:vi]",
    "partOfSpeech": "名詞",
    "japanese": "映画",
    "tip": "[読み: ムーヴィ] / カテゴリ: 趣味・休日 / 類義/関連: 同意語:film(映画)",
    "distractorsJa": [
      "パンケーキ",
      "顔",
      "コーヒー"
    ],
    "distractorsEn": [
      "pancake",
      "face",
      "coffee"
    ],
    "sentenceEn": [
      "Can",
      "you",
      "go",
      "to",
      "a",
      "movie",
      "with",
      "me",
      "this",
      "Saturday?"
    ],
    "sentenceJa": "今度の土曜日，私と映画に行きませんか",
    "sentenceDistractors": [
      "anything",
      "able"
    ]
  },
  {
    "num": "0078",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "program",
    "phonetic": "[próugræm]",
    "partOfSpeech": "名詞",
    "japanese": "番組，計画",
    "tip": "[読み: プロウグラム] / カテゴリ: 趣味・休日 / フレーズ例: an interesting program (おもしろい番組)",
    "distractorsJa": [
      "週末",
      "医者",
      "ジュース"
    ],
    "distractorsEn": [
      "weekend",
      "doctor",
      "juice"
    ],
    "sentenceEn": [
      "The",
      "TV",
      "program",
      "had",
      "many",
      "funny",
      "jokes."
    ],
    "sentenceJa": "そのテレビ番組は笑えるジョークが多かった",
    "sentenceDistractors": [
      "spend",
      "fish"
    ]
  },
  {
    "num": "0079",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "trip",
    "phonetic": "[trip]",
    "partOfSpeech": "名詞",
    "japanese": "(短期間の)旅行",
    "tip": "[読み: トゥリップ] / カテゴリ: 趣味・休日 / 類義/関連: 同意語:travel(旅行) / フレーズ例: go on a trip (旅行に行く)",
    "distractorsJa": [
      "息子",
      "サラダ",
      "ジュース"
    ],
    "distractorsEn": [
      "son",
      "salad",
      "juice"
    ],
    "sentenceEn": [
      "Let’s",
      "take",
      "a",
      "trip",
      "to",
      "Canada",
      "this",
      "summer."
    ],
    "sentenceJa": "今年の夏はカナダへ旅行しましょう",
    "sentenceDistractors": [
      "song",
      "bird"
    ]
  },
  {
    "num": "0080",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "camera",
    "phonetic": "[kǽm(ə)rə]",
    "partOfSpeech": "名詞",
    "japanese": "カメラ",
    "tip": "[読み: キャメラ] / カテゴリ: 趣味・休日 / 類義/関連: 参考表現:a digital camera(デジタルカメラ)",
    "distractorsJa": [
      "祝日，休暇",
      "科学者",
      "コーヒー"
    ],
    "distractorsEn": [
      "holiday",
      "scientist",
      "coffee"
    ],
    "sentenceEn": [
      "Can",
      "I",
      "use",
      "your",
      "camera",
      "this",
      "afternoon?"
    ],
    "sentenceJa": "(今日の午後, あなたのカメラを使ってもいいですか)",
    "sentenceDistractors": [
      "toy",
      "supermarket"
    ]
  },
  {
    "num": "0081",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "picnic",
    "phonetic": "[píknik]",
    "partOfSpeech": "名詞",
    "japanese": "ピクニック，遠足",
    "tip": "[読み: ピクニック] / カテゴリ: 趣味・休日",
    "distractorsJa": [
      "俳優",
      "メニュー",
      "買い物"
    ],
    "distractorsEn": [
      "actor",
      "menu",
      "shopping"
    ],
    "sentenceEn": [
      "We",
      "had",
      "a",
      "fun",
      "picnic",
      "in",
      "the",
      "park."
    ],
    "sentenceJa": "私たちは公園で楽しいピクニックをしました。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0082",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "fishing",
    "phonetic": "[fíʃiŋ]",
    "partOfSpeech": "名詞",
    "japanese": "魚釣り",
    "tip": "[読み: フィッシング] / カテゴリ: 趣味・休日",
    "distractorsJa": [
      "メニュー",
      "歯科医",
      "事務所，会社，役所"
    ],
    "distractorsEn": [
      "menu",
      "dentist",
      "office"
    ],
    "sentenceEn": [
      "I",
      "often",
      "go",
      "to",
      "the",
      "lake",
      "for",
      "fishing."
    ],
    "sentenceJa": "（私はよく釣りをしに湖へ行く）",
    "sentenceDistractors": [
      "common",
      "adult"
    ]
  },
  {
    "num": "0083",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "camp",
    "phonetic": "[kæmp]",
    "partOfSpeech": "名詞",
    "japanese": "キャンプ，キャンプ場、キャンプする",
    "tip": "[読み: キャンプ] / カテゴリ: 趣味・休日 / フレーズ例: go camping (キャンプに行く)",
    "distractorsJa": [
      "ボランティア，進んでやる人",
      "俳優",
      "コーヒー"
    ],
    "distractorsEn": [
      "volunteer",
      "actor",
      "coffee"
    ],
    "sentenceEn": [
      "Our",
      "club",
      "goes",
      "camping",
      "every",
      "summer."
    ],
    "sentenceJa": "私たちのクラブは毎年夏にキャンプに行く",
    "sentenceDistractors": [
      "arm",
      "note"
    ]
  },
  {
    "num": "0084",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "hobby",
    "phonetic": "[hɑ́(:)bi]",
    "partOfSpeech": "名詞",
    "japanese": "趣味",
    "tip": "[読み: ハ(ー)ビィ] / カテゴリ: 趣味・休日",
    "distractorsJa": [
      "ホテル",
      "髪の毛，毛",
      "銀行"
    ],
    "distractorsEn": [
      "hotel",
      "hair",
      "bank"
    ],
    "sentenceEn": [
      "My",
      "hobby",
      "is",
      "reading",
      "books."
    ],
    "sentenceJa": "私の趣味は読書です。",
    "sentenceDistractors": [
      "decrease",
      "effective"
    ]
  },
  {
    "num": "0085",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "face",
    "phonetic": "[feis]",
    "partOfSpeech": "名詞",
    "japanese": "顔",
    "tip": "[読み: フェイス] / カテゴリ: 身体",
    "distractorsJa": [
      "趣味",
      "庭，庭園",
      "銀行"
    ],
    "distractorsEn": [
      "hobby",
      "garden",
      "bank"
    ],
    "sentenceEn": [
      "Maya",
      "had",
      "a",
      "big",
      "smile",
      "on",
      "her",
      "face."
    ],
    "sentenceJa": "マヤは顔ににっこりと笑みを浮かべた",
    "sentenceDistractors": [
      "actually",
      "red"
    ]
  },
  {
    "num": "0086",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "eye",
    "phonetic": "[ai]",
    "partOfSpeech": "名詞",
    "japanese": "目",
    "tip": "[読み: アイ] / カテゴリ: 身体",
    "distractorsJa": [
      "パンケーキ",
      "俳優",
      "トースト"
    ],
    "distractorsEn": [
      "pancake",
      "actor",
      "toast"
    ],
    "sentenceEn": [
      "Close",
      "your",
      "eyes",
      "and",
      "imagine",
      "a",
      "beautiful",
      "beach."
    ],
    "sentenceJa": "目を閉じてきれいな浜辺を思い浮かべてください",
    "sentenceDistractors": [
      "build",
      "off"
    ]
  },
  {
    "num": "0087",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "hair",
    "phonetic": "[heər]",
    "partOfSpeech": "名詞",
    "japanese": "髪の毛，毛",
    "tip": "[読み: ヘア] / カテゴリ: 身体",
    "distractorsJa": [
      "親，(parentsで)両親",
      "パンケーキ",
      "祖父，おじいさん"
    ],
    "distractorsEn": [
      "parent",
      "pancake",
      "grandfather"
    ],
    "sentenceEn": [
      "Dry",
      "your",
      "hair",
      "after",
      "you",
      "take",
      "a",
      "shower."
    ],
    "sentenceJa": "シャワーを浴びたら，髪を乾かしなさい",
    "sentenceDistractors": [
      "chair",
      "bicycle"
    ]
  },
  {
    "num": "0088",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "arm",
    "phonetic": "[ɑ́:rm]",
    "partOfSpeech": "名詞",
    "japanese": "腕",
    "tip": "[読み: アーム] / カテゴリ: 身体",
    "distractorsJa": [
      "映画",
      "番組，計画",
      "野菜"
    ],
    "distractorsEn": [
      "movie",
      "program",
      "vegetable"
    ],
    "sentenceEn": [
      "Yumi",
      "broke",
      "her",
      "right",
      "arm",
      "yesterday."
    ],
    "sentenceJa": "(ユミは昨日, 右腕を骨折した)",
    "sentenceDistractors": [
      "national",
      "jump"
    ]
  },
  {
    "num": "0089",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "fever",
    "phonetic": "[fí:vər]",
    "partOfSpeech": "名詞",
    "japanese": "熱",
    "tip": "[読み: フィーヴァ] / カテゴリ: 身体",
    "distractorsJa": [
      "仕事，職",
      "遊び，ゲーム，試合",
      "野菜"
    ],
    "distractorsEn": [
      "job",
      "game",
      "vegetable"
    ],
    "sentenceEn": [
      "He",
      "stayed",
      "home",
      "because",
      "he",
      "had",
      "a",
      "fever."
    ],
    "sentenceJa": "彼は熱があったので家にいました。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0090",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "job",
    "phonetic": "[dʒɑ(:)b]",
    "partOfSpeech": "名詞",
    "japanese": "仕事，職",
    "tip": "[読み: ヂャ(ー)ブ] / カテゴリ: 人・職業",
    "distractorsJa": [
      "ハンバーガー",
      "プール",
      "ジュース"
    ],
    "distractorsEn": [
      "hamburger",
      "pool",
      "juice"
    ],
    "sentenceEn": [
      "My",
      "mother",
      "is",
      "looking",
      "for",
      "a",
      "new",
      "job."
    ],
    "sentenceJa": "母は新しい仕事をさがしている",
    "sentenceDistractors": [
      "together",
      "mean"
    ]
  },
  {
    "num": "0091",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "doctor",
    "phonetic": "[dɑ́(:)ktər]",
    "partOfSpeech": "名詞",
    "japanese": "医者",
    "tip": "[読み: ダ(ー)クタァ] / カテゴリ: 人・職業",
    "distractorsJa": [
      "会社",
      "パーティー",
      "ホテル"
    ],
    "distractorsEn": [
      "company",
      "party",
      "hotel"
    ],
    "sentenceEn": [
      "The",
      "doctor",
      "told",
      "me",
      "to",
      "take",
      "this",
      "medicine."
    ],
    "sentenceJa": "医者は私にこの薬を飲むようにと言った",
    "sentenceDistractors": [
      "useful",
      "keep"
    ]
  },
  {
    "num": "0092",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "dentist",
    "phonetic": "[déntist]",
    "partOfSpeech": "名詞",
    "japanese": "歯科医",
    "tip": "[読み: デンティスト] / カテゴリ: 人・職業",
    "distractorsJa": [
      "動物園",
      "親，(parentsで)両親",
      "ボランティア，進んでやる人"
    ],
    "distractorsEn": [
      "zoo",
      "parent",
      "volunteer"
    ],
    "sentenceEn": [
      "I",
      "went",
      "to",
      "see",
      "a",
      "dentist",
      "yesterday."
    ],
    "sentenceJa": "私は昨日、歯科医に診てもらいに行きました。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0093",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "scientist",
    "phonetic": "[sáiəntəst]",
    "partOfSpeech": "名詞",
    "japanese": "科学者",
    "tip": "[読み: サイエンティスト] / カテゴリ: 人・職業",
    "distractorsJa": [
      "祖母，おばあさん",
      "趣味",
      "医者"
    ],
    "distractorsEn": [
      "grandmother",
      "hobby",
      "doctor"
    ],
    "sentenceEn": [
      "The",
      "scientist",
      "is",
      "very",
      "famous",
      "in",
      "my",
      "country."
    ],
    "sentenceJa": "その科学者は私の国ではとても有名だ",
    "sentenceDistractors": [
      "brother",
      "light"
    ]
  },
  {
    "num": "0094",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "pilot",
    "phonetic": "[páilət]",
    "partOfSpeech": "名詞",
    "japanese": "パイロット",
    "tip": "[読み: パイロット] / カテゴリ: 人・職業",
    "distractorsJa": [
      "ホテル",
      "目",
      "顔"
    ],
    "distractorsEn": [
      "hotel",
      "eye",
      "face"
    ],
    "sentenceEn": [
      "He",
      "is",
      "a",
      "pilot",
      "for",
      "a",
      "major",
      "airline."
    ],
    "sentenceJa": "彼は大手航空会社のパイロットです。",
    "sentenceDistractors": [
      "operation",
      "volcano"
    ]
  },
  {
    "num": "0095",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "actor",
    "phonetic": "[ǽktər]",
    "partOfSpeech": "名詞",
    "japanese": "俳優",
    "tip": "[読み: アクター] / カテゴリ: 人・職業",
    "distractorsJa": [
      "仕事，職",
      "食べ物",
      "パーティー"
    ],
    "distractorsEn": [
      "job",
      "food",
      "party"
    ],
    "sentenceEn": [
      "He",
      "is",
      "a",
      "famous",
      "movie",
      "actor."
    ],
    "sentenceJa": "彼は有名な映画俳優です。",
    "sentenceDistractors": [
      "secret",
      "taxi"
    ]
  },
  {
    "num": "0096",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "volunteer",
    "phonetic": "[vɑ̀(:)ləntíər]",
    "partOfSpeech": "名詞",
    "japanese": "ボランティア，進んでやる人",
    "tip": "[読み: ヴァ(ー)ランティア] / カテゴリ: 人・職業 / メモ: アクセント注意",
    "distractorsJa": [
      "トースト",
      "祖父，おじいさん",
      "キャンプ，キャンプ場、キャンプする"
    ],
    "distractorsEn": [
      "toast",
      "grandfather",
      "camp"
    ],
    "sentenceEn": [
      "I",
      "worked",
      "as",
      "a",
      "volunteer",
      "at",
      "a",
      "hospital",
      "this",
      "summer."
    ],
    "sentenceJa": "この夏，私は病院でボランティアとして働いた",
    "sentenceDistractors": [
      "bird",
      "robot"
    ]
  },
  {
    "num": "0097",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "grandmother",
    "phonetic": "[grǽn(d)mʌ̀ðər]",
    "partOfSpeech": "名詞",
    "japanese": "祖母，おばあさん",
    "tip": "[読み: グラン(ド)マざァ] / カテゴリ: 家族 / 類義/関連: 同意語:grandma(おばあちゃん)",
    "distractorsJa": [
      "買い物",
      "遊び，ゲーム，試合",
      "アパート"
    ],
    "distractorsEn": [
      "shopping",
      "game",
      "apartment"
    ],
    "sentenceEn": [
      "I",
      "wrote",
      "a",
      "New",
      "Year's",
      "card",
      "to",
      "my",
      "grandmother."
    ],
    "sentenceJa": "私は祖母に年賀状を書いた",
    "sentenceDistractors": [
      "body",
      "message"
    ]
  },
  {
    "num": "0098",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "grandfather",
    "phonetic": "[grǽn(d)fɑ̀:ðər]",
    "partOfSpeech": "名詞",
    "japanese": "祖父，おじいさん",
    "tip": "[読み: グラン(ド)ふァーざァ] / カテゴリ: 家族 / 類義/関連: 同意語:grandpa(おじいちゃん)",
    "distractorsJa": [
      "パイロット",
      "(短期間の)旅行",
      "町"
    ],
    "distractorsEn": [
      "pilot",
      "trip",
      "town"
    ],
    "sentenceEn": [
      "My",
      "grandfather",
      "will",
      "be",
      "seventy",
      "next",
      "year."
    ],
    "sentenceJa": "祖父は来年70歳になる",
    "sentenceDistractors": [
      "strong",
      "often"
    ]
  },
  {
    "num": "0099",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "parent",
    "phonetic": "[pé(ə)r(ə)nt]",
    "partOfSpeech": "名詞",
    "japanese": "親，(parentsで)両親",
    "tip": "[読み: ペ(ア)レント] / カテゴリ: 家族",
    "distractorsJa": [
      "祖父，おじいさん",
      "仕事，職",
      "メニュー"
    ],
    "distractorsEn": [
      "grandfather",
      "job",
      "menu"
    ],
    "sentenceEn": [
      "My",
      "parents",
      "often",
      "took",
      "me",
      "to",
      "the",
      "zoo."
    ],
    "sentenceJa": "両親はよく私を動物園に連れていった",
    "sentenceDistractors": [
      "its",
      "Australia"
    ]
  },
  {
    "num": "0100",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "husband",
    "phonetic": "[hʌ́zbənd]",
    "partOfSpeech": "名詞",
    "japanese": "夫",
    "tip": "[読み: ハズバンド] / カテゴリ: 家族 / 類義/関連: 参考表現:wife(妻)",
    "distractorsJa": [
      "チョコレート",
      "映画",
      "魚釣り"
    ],
    "distractorsEn": [
      "chocolate",
      "movie",
      "fishing"
    ],
    "sentenceEn": [
      "Mrs.",
      "Endo",
      "is",
      "older",
      "than",
      "her",
      "husband."
    ],
    "sentenceJa": "エンドウさんは彼女の夫より年上だ",
    "sentenceDistractors": [
      "bicycle",
      "cheap"
    ]
  },
  {
    "num": "0101",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "son",
    "phonetic": "sʌ́n",
    "partOfSpeech": "名詞",
    "japanese": "息子",
    "tip": "[読み: サン] / カテゴリ: 家族 / 類義/関連: 関連語:daughter(娘) / メモ: 発音注意",
    "distractorsJa": [
      "事務所，会社，役所",
      "プール",
      "髪の毛，毛"
    ],
    "distractorsEn": [
      "office",
      "pool",
      "hair"
    ],
    "sentenceEn": [
      "Is",
      "your",
      "son",
      "a",
      "high",
      "school",
      "student?"
    ],
    "sentenceJa": "（息子さんは高校生ですか）",
    "sentenceDistractors": [
      "abroad",
      "China"
    ]
  },
  {
    "num": "0102",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "aunt",
    "phonetic": "ǽnt",
    "partOfSpeech": "名詞",
    "japanese": "おば",
    "tip": "[読み: アント] / カテゴリ: 家族 / 類義/関連: 関連語:uncle(おじ)",
    "distractorsJa": [
      "ジュース",
      "コーヒー",
      "親，(parentsで)両親"
    ],
    "distractorsEn": [
      "juice",
      "coffee",
      "parent"
    ],
    "sentenceEn": [
      "My",
      "aunt",
      "lives",
      "with",
      "my",
      "grandparents."
    ],
    "sentenceJa": "おばは私の祖父母と一緒に暮らしている",
    "sentenceDistractors": [
      "waste",
      "theater"
    ]
  },
  {
    "num": "0103",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "food",
    "phonetic": "fúːd",
    "partOfSpeech": "名詞",
    "japanese": "食べ物",
    "tip": "[読み: フード] / カテゴリ: 食べ物など",
    "distractorsJa": [
      "野菜",
      "(大型の)船",
      "祖父，おじいさん"
    ],
    "distractorsEn": [
      "vegetable",
      "ship",
      "grandfather"
    ],
    "sentenceEn": [
      "Japanese",
      "food",
      "is",
      "becoming",
      "more",
      "popular."
    ],
    "sentenceJa": "日本食はより人気が高くなってきている",
    "sentenceDistractors": [
      "new",
      "really"
    ]
  },
  {
    "num": "0104",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "pizza",
    "phonetic": "píːtsə",
    "partOfSpeech": "名詞",
    "japanese": "ピザ",
    "tip": "[読み: ピーツァ] / カテゴリ: 食べ物など",
    "distractorsJa": [
      "銀行",
      "目",
      "夫"
    ],
    "distractorsEn": [
      "bank",
      "eye",
      "husband"
    ],
    "sentenceEn": [
      "Let's",
      "order",
      "a",
      "pizza",
      "for",
      "dinner."
    ],
    "sentenceJa": "夕食にピザを注文しましょう。",
    "sentenceDistractors": [
      "funny",
      "Asia"
    ]
  },
  {
    "num": "0105",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "cheese",
    "phonetic": "tʃíːz",
    "partOfSpeech": "名詞",
    "japanese": "チーズ",
    "tip": "[読み: チーズ] / カテゴリ: 食べ物など / フレーズ例: a slice of cheese (1切れのチーズ)",
    "distractorsJa": [
      "親，(parentsで)両親",
      "ジュース",
      "俳優"
    ],
    "distractorsEn": [
      "parent",
      "juice",
      "actor"
    ],
    "sentenceEn": [
      "I",
      "put",
      "a",
      "slice",
      "of",
      "cheese",
      "on",
      "my",
      "bread."
    ],
    "sentenceJa": "私はパンの上にチーズを1切れのせました。",
    "sentenceDistractors": [
      "parent",
      "juice"
    ]
  },
  {
    "num": "0106",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "soup",
    "phonetic": "súːp",
    "partOfSpeech": "名詞",
    "japanese": "スープ",
    "tip": "[読み: スープ] / カテゴリ: 食べ物など",
    "distractorsJa": [
      "パーティー",
      "魚釣り",
      "ジュース"
    ],
    "distractorsEn": [
      "party",
      "fishing",
      "juice"
    ],
    "sentenceEn": [
      "I",
      "like",
      "to",
      "eat",
      "tomato",
      "soup."
    ],
    "sentenceJa": "私はトマトスープを食べるのが好きです。",
    "sentenceDistractors": [
      "daily",
      "whose"
    ]
  },
  {
    "num": "0107",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "salad",
    "phonetic": "sǽləd",
    "partOfSpeech": "名詞",
    "japanese": "サラダ",
    "tip": "[読み: サラダ] / カテゴリ: 食べ物など",
    "distractorsJa": [
      "食べ物",
      "病院",
      "腕"
    ],
    "distractorsEn": [
      "food",
      "hospital",
      "arm"
    ],
    "sentenceEn": [
      "I",
      "had",
      "a",
      "salad",
      "for",
      "lunch."
    ],
    "sentenceJa": "昼食にサラダを食べました。",
    "sentenceDistractors": [
      "reuse",
      "tray"
    ]
  },
  {
    "num": "0108",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "vegetable",
    "phonetic": "védʒtəbl",
    "partOfSpeech": "名詞",
    "japanese": "野菜",
    "tip": "[読み: ヴェジタブル] / カテゴリ: 食べ物など / メモ: ふつうvegetablesと複数形で使う",
    "distractorsJa": [
      "(大型の)船",
      "熱",
      "祝日，休暇"
    ],
    "distractorsEn": [
      "ship",
      "fever",
      "holiday"
    ],
    "sentenceEn": [
      "My",
      "grandmother",
      "grows",
      "vegetables",
      "in",
      "the",
      "garden."
    ],
    "sentenceJa": "祖母は菜園で野菜を育てている",
    "sentenceDistractors": [
      "pass",
      "third"
    ]
  },
  {
    "num": "0109",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "toast",
    "phonetic": "tóust",
    "partOfSpeech": "名詞",
    "japanese": "トースト",
    "tip": "[読み: トゥスト] / カテゴリ: 食べ物など",
    "distractorsJa": [
      "パンケーキ",
      "趣味",
      "番組，計画"
    ],
    "distractorsEn": [
      "pancake",
      "hobby",
      "program"
    ],
    "sentenceEn": [
      "She",
      "usually",
      "eats",
      "toast",
      "and",
      "eggs",
      "for",
      "breakfast."
    ],
    "sentenceJa": "彼女は普段、朝食にトーストと卵を食べます。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0110",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "hamburger",
    "phonetic": "hǽmbəːrɡər",
    "partOfSpeech": "名詞",
    "japanese": "ハンバーガー",
    "tip": "[読み: ハンバーガァ] / カテゴリ: 食べ物など",
    "distractorsJa": [
      "おば",
      "ポップコーン",
      "町"
    ],
    "distractorsEn": [
      "aunt",
      "popcorn",
      "town"
    ],
    "sentenceEn": [
      "I",
      "want",
      "a",
      "hamburger",
      "for",
      "lunch."
    ],
    "sentenceJa": "私は昼食にハンバーガーが食べたい。",
    "sentenceDistractors": [
      "guess",
      "race"
    ]
  },
  {
    "num": "0111",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "pancake",
    "phonetic": "pǽnkeik",
    "partOfSpeech": "名詞",
    "japanese": "パンケーキ",
    "tip": "[読み: パンケイク] / カテゴリ: 食べ物など",
    "distractorsJa": [
      "遊び，ゲーム，試合",
      "番組，計画",
      "庭，庭園"
    ],
    "distractorsEn": [
      "game",
      "program",
      "garden"
    ],
    "sentenceEn": [
      "My",
      "mother",
      "made",
      "delicious",
      "pancakes",
      "this",
      "morning."
    ],
    "sentenceJa": "母は今朝おいしいパンケーキを作ってくれました。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0112",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "chocolate",
    "phonetic": "tʃɔ́ːklət",
    "partOfSpeech": "名詞",
    "japanese": "チョコレート",
    "tip": "[読み: チョークレット] / カテゴリ: 食べ物など / メモ: アクセント注意",
    "distractorsJa": [
      "祝日，休暇",
      "銀行",
      "俳優"
    ],
    "distractorsEn": [
      "holiday",
      "bank",
      "actor"
    ],
    "sentenceEn": [
      "I",
      "got",
      "some",
      "chocolate",
      "on",
      "Valentine's",
      "Day."
    ],
    "sentenceJa": "僕はバレンタインデーにチョコレートをもらった。",
    "sentenceDistractors": [
      "soldier",
      "steal"
    ]
  },
  {
    "num": "0113",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "coffee",
    "phonetic": "kɔ́ːfi",
    "partOfSpeech": "名詞",
    "japanese": "コーヒー",
    "tip": "[読み: コ(ー)フィ] / カテゴリ: 食べ物など",
    "distractorsJa": [
      "チョコレート",
      "スープ",
      "トースト"
    ],
    "distractorsEn": [
      "chocolate",
      "soup",
      "toast"
    ],
    "sentenceEn": [
      "Here",
      "is",
      "a",
      "cup",
      "of",
      "coffee",
      "for",
      "you."
    ],
    "sentenceJa": "コーヒーを１杯どうぞ",
    "sentenceDistractors": [
      "zoo",
      "natural"
    ]
  },
  {
    "num": "0114",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "juice",
    "phonetic": "dʒúːs",
    "partOfSpeech": "名詞",
    "japanese": "ジュース",
    "tip": "[読み: デュース] / カテゴリ: 食べ物など",
    "distractorsJa": [
      "チーズ",
      "ハンバーガー",
      "趣味"
    ],
    "distractorsEn": [
      "cheese",
      "hamburger",
      "hobby"
    ],
    "sentenceEn": [
      "Can",
      "I",
      "have",
      "a",
      "glass",
      "of",
      "orange",
      "juice?"
    ],
    "sentenceJa": "(オレンジジュースを1杯もらえますか)",
    "sentenceDistractors": [
      "touch",
      "invite"
    ]
  },
  {
    "num": "0115",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "popcorn",
    "phonetic": "pɑ́ːpkɔːrn",
    "partOfSpeech": "名詞",
    "japanese": "ポップコーン",
    "tip": "[読み: パ(ー)ップコーン] / カテゴリ: 食べ物など",
    "distractorsJa": [
      "庭，庭園",
      "野菜",
      "食べ物"
    ],
    "distractorsEn": [
      "garden",
      "vegetable",
      "food"
    ],
    "sentenceEn": [
      "We",
      "ate",
      "popcorn",
      "while",
      "watching",
      "the",
      "movie."
    ],
    "sentenceJa": "私たちは映画を見ながらポップコーンを食べた。",
    "sentenceDistractors": [
      "logic",
      "electric"
    ]
  },
  {
    "num": "0116",
    "level": 2,
    "stageSlug": "eiken4_stage02",
    "english": "menu",
    "phonetic": "ménjuː",
    "partOfSpeech": "名詞",
    "japanese": "メニュー",
    "tip": "[読み: メニュー] / カテゴリ: 食べ物など",
    "distractorsJa": [
      "動物園",
      "(短期間の)旅行",
      "ポップコーン"
    ],
    "distractorsEn": [
      "zoo",
      "trip",
      "popcorn"
    ],
    "sentenceEn": [
      "Could",
      "I",
      "see",
      "the",
      "menu,",
      "please?"
    ],
    "sentenceJa": "メニューを見せていただけますか？",
    "sentenceDistractors": [
      "directly",
      "collection"
    ]
  },
  {
    "num": "0117",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "dish",
    "phonetic": "díʃ",
    "partOfSpeech": "名詞",
    "japanese": "皿, 料理",
    "tip": "[読み: ディッシュ] / カテゴリ: 食べ物など / 類義/関連: 関連語:dishwasher(食器洗い機)",
    "distractorsJa": [
      "水",
      "ジョギング",
      "(テニスなどの)ラケット"
    ],
    "distractorsEn": [
      "water",
      "jogging",
      "racket"
    ],
    "sentenceEn": [
      "His",
      "mother",
      "asked",
      "him",
      "to",
      "wash",
      "the",
      "dishes."
    ],
    "sentenceJa": "彼の母親は彼に皿を洗うように頼んだ",
    "sentenceDistractors": [
      "Monday",
      "throw"
    ]
  },
  {
    "num": "0118",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "weather",
    "phonetic": "wéðər",
    "partOfSpeech": "名詞",
    "japanese": "天気, 天候",
    "tip": "[読み: ウェザー] / カテゴリ: 自然・生き物 / 類義/関連: 関連語:climate(気候)",
    "distractorsJa": [
      "バスケットボール, バスケットボールのボール",
      "物語, 話",
      "バイオリン"
    ],
    "distractorsEn": [
      "basketball",
      "story",
      "violin"
    ],
    "sentenceEn": [
      "The",
      "weather",
      "will",
      "be",
      "good",
      "tomorrow."
    ],
    "sentenceJa": "明日は天気がよくなるだろう",
    "sentenceDistractors": [
      "cause",
      "communication"
    ]
  },
  {
    "num": "0119",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "rain",
    "phonetic": "réin",
    "partOfSpeech": "名詞",
    "japanese": "雨、雨が降る",
    "tip": "[読み: レイン] / カテゴリ: 自然・生き物",
    "distractorsJa": [
      "皿, 料理",
      "花",
      "ミュージカル、音楽の"
    ],
    "distractorsEn": [
      "dish",
      "flower",
      "musical"
    ],
    "sentenceEn": [
      "It",
      "started",
      "to",
      "rain",
      "during",
      "the",
      "game."
    ],
    "sentenceJa": "試合の途中で雨が降り始めた",
    "sentenceDistractors": [
      "end",
      "forget"
    ]
  },
  {
    "num": "0120",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "water",
    "phonetic": "wɔ́ːtər",
    "partOfSpeech": "名詞",
    "japanese": "水",
    "tip": "[読み: ウォータァ] / カテゴリ: 自然・生き物 / フレーズ例: hot water (湯)",
    "distractorsJa": [
      "種類",
      "色、に色をつける",
      "例"
    ],
    "distractorsEn": [
      "kind",
      "color",
      "example"
    ],
    "sentenceEn": [
      "Could",
      "you",
      "bring",
      "me",
      "some",
      "water?"
    ],
    "sentenceJa": "私に水を持ってきていただけますか",
    "sentenceDistractors": [
      "three",
      "answer"
    ]
  },
  {
    "num": "0121",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "river",
    "phonetic": "rívər",
    "partOfSpeech": "名詞",
    "japanese": "川, 河",
    "tip": "[読み: リヴァ] / カテゴリ: 自然・生き物",
    "distractorsJa": [
      "音楽会, コンサート",
      "(サッカーなどの)ゴール, (ゴールに入れた)得点, 目標",
      "アフリカ"
    ],
    "distractorsEn": [
      "concert",
      "goal",
      "Africa"
    ],
    "sentenceEn": [
      "Our",
      "city",
      "is",
      "between",
      "two",
      "large",
      "rivers."
    ],
    "sentenceJa": "私たちの市は2つの大きな川にはさまれている",
    "sentenceDistractors": [
      "sit",
      "speech"
    ]
  },
  {
    "num": "0122",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "beach",
    "phonetic": "bíːtʃ",
    "partOfSpeech": "名詞",
    "japanese": "浜, 海辺",
    "tip": "[読み: ビーチ] / カテゴリ: 自然・生き物",
    "distractorsJa": [
      "雨、雨が降る",
      "ポスター",
      "バラ"
    ],
    "distractorsEn": [
      "rain",
      "poster",
      "rose"
    ],
    "sentenceEn": [
      "The",
      "beach",
      "is",
      "full",
      "of",
      "young",
      "people."
    ],
    "sentenceJa": "浜辺は若者たちでいっぱいだ",
    "sentenceDistractors": [
      "rice",
      "farm"
    ]
  },
  {
    "num": "0123",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "mountain",
    "phonetic": "máunt(ə)n",
    "partOfSpeech": "名詞",
    "japanese": "山, (mountainsで)山脈",
    "tip": "[読み: マウントゥン] / カテゴリ: 自然・生き物",
    "distractorsJa": [
      "会, 会議",
      "練習、(を)練習する",
      "ドレス, 服装"
    ],
    "distractorsEn": [
      "meeting",
      "practice",
      "dress"
    ],
    "sentenceEn": [
      "It",
      "is",
      "hard",
      "to",
      "climb",
      "the",
      "mountain",
      "in",
      "this",
      "weather."
    ],
    "sentenceJa": "この天候ではその山に登るのは難しい",
    "sentenceDistractors": [
      "easy",
      "few"
    ]
  },
  {
    "num": "0124",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "star",
    "phonetic": "stɑ́ːr",
    "partOfSpeech": "名詞",
    "japanese": "星",
    "tip": "[読み: スター] / カテゴリ: 自然・生き物",
    "distractorsJa": [
      "切符, チケット",
      "サッカー",
      "(テニスなどの)ラケット"
    ],
    "distractorsEn": [
      "ticket",
      "soccer",
      "racket"
    ],
    "sentenceEn": [
      "The",
      "night",
      "sky",
      "is",
      "full",
      "of",
      "stars."
    ],
    "sentenceJa": "夜空には星がいっぱいだ",
    "sentenceDistractors": [
      "quickly",
      "bed"
    ]
  },
  {
    "num": "0125",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "flower",
    "phonetic": "fláuər",
    "partOfSpeech": "名詞",
    "japanese": "花",
    "tip": "[読み: フラウア] / カテゴリ: 自然・生き物",
    "distractorsJa": [
      "紫色、紫色の",
      "線, 行列, (電車などの)路線",
      "道, 方向, 方法"
    ],
    "distractorsEn": [
      "purple",
      "line",
      "way"
    ],
    "sentenceEn": [
      "There",
      "are",
      "many",
      "beautiful",
      "flowers",
      "in",
      "the",
      "garden."
    ],
    "sentenceJa": "庭には美しい花がたくさんある",
    "sentenceDistractors": [
      "choose",
      "event"
    ]
  },
  {
    "num": "0126",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "rose",
    "phonetic": "róuz",
    "partOfSpeech": "名詞",
    "japanese": "バラ",
    "tip": "[読み: ロウズ] / カテゴリ: 自然・生き物",
    "distractorsJa": [
      "物, こと",
      "スペイン",
      "イングランド"
    ],
    "distractorsEn": [
      "thing",
      "Spain",
      "England"
    ],
    "sentenceEn": [
      "My",
      "grandmother",
      "grows",
      "roses",
      "in",
      "her",
      "garden."
    ],
    "sentenceJa": "(祖母は庭でバラを育てている)",
    "sentenceDistractors": [
      "discover",
      "set"
    ]
  },
  {
    "num": "0127",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "animal",
    "phonetic": "ǽnəm(ə)l",
    "partOfSpeech": "名詞",
    "japanese": "動物",
    "tip": "[読み: アニマル] / カテゴリ: 自然・生き物",
    "distractorsJa": [
      "正面, 前面",
      "楽しみ",
      "計画、(を)計画する"
    ],
    "distractorsEn": [
      "front",
      "fun",
      "plan"
    ],
    "sentenceEn": [
      "What",
      "animals",
      "did",
      "you",
      "see",
      "at",
      "the",
      "zoo?"
    ],
    "sentenceJa": "動物園ではどんな動物を見ましたか",
    "sentenceDistractors": [
      "best",
      "stay"
    ]
  },
  {
    "num": "0128",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "practice",
    "phonetic": "prǽktis",
    "partOfSpeech": "名詞",
    "japanese": "練習、(を)練習する",
    "tip": "[読み: プラクティス] / カテゴリ: 音楽",
    "distractorsJa": [
      "線, 行列, (電車などの)路線",
      "種類",
      "道, 方向, 方法"
    ],
    "distractorsEn": [
      "line",
      "kind",
      "way"
    ],
    "sentenceEn": [
      "How",
      "often",
      "do",
      "you",
      "practice",
      "the",
      "guitar?"
    ],
    "sentenceJa": "どのくらいの頻度でギターを練習しますか",
    "sentenceDistractors": [
      "mean",
      "team"
    ]
  },
  {
    "num": "0129",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "guitar",
    "phonetic": "ɡitɑ́ːr",
    "partOfSpeech": "名詞",
    "japanese": "ギター",
    "tip": "[読み: ギター] / カテゴリ: 音楽 / メモ: アクセント注意",
    "distractorsJa": [
      "ドレス, 服装",
      "星",
      "スペイン"
    ],
    "distractorsEn": [
      "dress",
      "star",
      "Spain"
    ],
    "sentenceEn": [
      "My",
      "sister",
      "likes",
      "playing",
      "the",
      "guitar."
    ],
    "sentenceJa": "姉はギターをひくのが好きです",
    "sentenceDistractors": [
      "presentation",
      "February"
    ]
  },
  {
    "num": "0130",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "violin",
    "phonetic": "vàiəlín",
    "partOfSpeech": "名詞",
    "japanese": "バイオリン",
    "tip": "[読み: ヴァイオリン] / カテゴリ: 音楽 / メモ: アクセント注意",
    "distractorsJa": [
      "水",
      "アフリカ",
      "終わり"
    ],
    "distractorsEn": [
      "water",
      "Africa",
      "end"
    ],
    "sentenceEn": [
      "She",
      "plays",
      "the",
      "violin",
      "beautifully."
    ],
    "sentenceJa": "彼女はバイオリンを美しく弾きます。",
    "sentenceDistractors": [
      "monkey",
      "exhibition"
    ]
  },
  {
    "num": "0131",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "sound",
    "phonetic": "sáund",
    "partOfSpeech": "名詞",
    "japanese": "音、(〜のように)聞こえる",
    "tip": "[読み: サウンド] / カテゴリ: 音楽",
    "distractorsJa": [
      "行事, できごと",
      "インド",
      "アフリカ"
    ],
    "distractorsEn": [
      "event",
      "India",
      "Africa"
    ],
    "sentenceEn": [
      "Can",
      "you",
      "hear",
      "the",
      "sound",
      "of",
      "the",
      "piano",
      "next",
      "door?"
    ],
    "sentenceJa": "あなたはお隣のピアノの音が聞こえますか",
    "sentenceDistractors": [
      "girl",
      "high school"
    ]
  },
  {
    "num": "0132",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "concert",
    "phonetic": "kɑ́ːnsərt",
    "partOfSpeech": "名詞",
    "japanese": "音楽会, コンサート",
    "tip": "[読み: カ(ー)ンサト] / カテゴリ: 音楽",
    "distractorsJa": [
      "ジョギング",
      "バイオリン",
      "物語, 話"
    ],
    "distractorsEn": [
      "jogging",
      "violin",
      "story"
    ],
    "sentenceEn": [
      "We",
      "are",
      "going",
      "to",
      "give",
      "a",
      "concert",
      "in",
      "the",
      "park."
    ],
    "sentenceJa": "私たちは公園でコンサートを開く予定だ",
    "sentenceDistractors": [
      "gift",
      "among"
    ]
  },
  {
    "num": "0133",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "musical",
    "phonetic": "mjúːzik(ə)l",
    "partOfSpeech": "名詞",
    "japanese": "ミュージカル、音楽の",
    "tip": "[読み: ミューズィカル] / カテゴリ: 音楽",
    "distractorsJa": [
      "アフリカ",
      "文化",
      "ジョギング"
    ],
    "distractorsEn": [
      "Africa",
      "culture",
      "jogging"
    ],
    "sentenceEn": [
      "We",
      "watched",
      "a",
      "famous",
      "musical",
      "in",
      "London."
    ],
    "sentenceJa": "私たちはロンドンで有名なミュージカルを見ました。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0134",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "shirt",
    "phonetic": "ʃə́ːrt",
    "partOfSpeech": "名詞",
    "japanese": "ワイシャツ, シャツ",
    "tip": "[読み: シャート] / カテゴリ: 衣服・色など",
    "distractorsJa": [
      "ジョギング",
      "花",
      "物, こと"
    ],
    "distractorsEn": [
      "jogging",
      "flower",
      "thing"
    ],
    "sentenceEn": [
      "I'm",
      "wearing",
      "a",
      "white",
      "shirt."
    ],
    "sentenceJa": "私は白いシャツを着ています。",
    "sentenceDistractors": [
      "search",
      "means"
    ]
  },
  {
    "num": "0135",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "dress",
    "phonetic": "drés",
    "partOfSpeech": "名詞",
    "japanese": "ドレス, 服装",
    "tip": "[読み: ドレス] / カテゴリ: 衣服・色など / 類義/関連: 同意語:clothes(衣服)",
    "distractorsJa": [
      "動物",
      "楽しみ",
      "物語, 話"
    ],
    "distractorsEn": [
      "animal",
      "fun",
      "story"
    ],
    "sentenceEn": [
      "She",
      "is",
      "wearing",
      "a",
      "beautiful",
      "dress."
    ],
    "sentenceJa": "彼女は美しいドレスを着ています。",
    "sentenceDistractors": [
      "character",
      "release"
    ]
  },
  {
    "num": "0136",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "color",
    "phonetic": "kʌ́lər",
    "partOfSpeech": "名詞",
    "japanese": "色、に色をつける",
    "tip": "[読み: カラー] / カテゴリ: 衣服・色など",
    "distractorsJa": [
      "計画、(を)計画する",
      "会, 会議",
      "サッカー"
    ],
    "distractorsEn": [
      "plan",
      "meeting",
      "soccer"
    ],
    "sentenceEn": [
      "What",
      "color",
      "is",
      "your",
      "car?"
    ],
    "sentenceJa": "あなたの車は何色ですか",
    "sentenceDistractors": [
      "message",
      "chance"
    ]
  },
  {
    "num": "0137",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "purple",
    "phonetic": "pə́ːrpl",
    "partOfSpeech": "名詞",
    "japanese": "紫色、紫色の",
    "tip": "[読み: パープル] / カテゴリ: 衣服・色など",
    "distractorsJa": [
      "音、(〜のように)聞こえる",
      "山, (mountainsで)山脈",
      "バイオリン"
    ],
    "distractorsEn": [
      "sound",
      "mountain",
      "violin"
    ],
    "sentenceEn": [
      "She",
      "bought",
      "a",
      "cute",
      "purple",
      "bag",
      "yesterday."
    ],
    "sentenceJa": "彼女は昨日かわいい紫色のバッグを買いました。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0138",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "Japan",
    "phonetic": "dʒəpǽn",
    "partOfSpeech": "名詞",
    "japanese": "日本",
    "tip": "[読み: ヂャパン] / カテゴリ: 国・地域 / 類義/関連: 関連語:Japanese(日本語, 日本人, 日本語の, 日本(人)の)",
    "distractorsJa": [
      "(テニスなどの)ラケット",
      "行事, できごと",
      "浜, 海辺"
    ],
    "distractorsEn": [
      "racket",
      "event",
      "beach"
    ],
    "sentenceEn": [
      "Tokyo",
      "is",
      "the",
      "biggest",
      "city",
      "in",
      "Japan."
    ],
    "sentenceJa": "東京は日本でいちばん大きな都市だ",
    "sentenceDistractors": [
      "give",
      "should"
    ]
  },
  {
    "num": "0139",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "Spain",
    "phonetic": "spéin",
    "partOfSpeech": "名詞",
    "japanese": "スペイン",
    "tip": "[読み: スペイン] / カテゴリ: 国・地域 / 類義/関連: 関連語:Spanish(スペイン語, スペイン人, スペイン語の, スペイン(人)の)",
    "distractorsJa": [
      "練習、(を)練習する",
      "ドレス, 服装",
      "ポスター"
    ],
    "distractorsEn": [
      "practice",
      "dress",
      "poster"
    ],
    "sentenceEn": [
      "My",
      "uncle",
      "wants",
      "to",
      "visit",
      "Spain",
      "next",
      "year."
    ],
    "sentenceJa": "私の叔父は来年スペインを訪れたがっています。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0140",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "England",
    "phonetic": "íŋɡlənd",
    "partOfSpeech": "名詞",
    "japanese": "イングランド",
    "tip": "[読み: イングランド] / カテゴリ: 国・地域 / 類義/関連: 関連語:English(英語, 英語の)",
    "distractorsJa": [
      "例",
      "日本",
      "情報"
    ],
    "distractorsEn": [
      "example",
      "Japan",
      "information"
    ],
    "sentenceEn": [
      "England",
      "has",
      "many",
      "strong",
      "soccer",
      "teams."
    ],
    "sentenceJa": "イングランドには強いサッカーチームが多い",
    "sentenceDistractors": [
      "cookie",
      "cute"
    ]
  },
  {
    "num": "0141",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "Africa",
    "phonetic": "ǽfrikə",
    "partOfSpeech": "名詞",
    "japanese": "アフリカ",
    "tip": "[読み: アフリカ] / カテゴリ: 国・地域 / 類義/関連: 関連語:African(アフリカ人, アフリカ(人)の) / メモ: アクセント注意",
    "distractorsJa": [
      "ジョギング",
      "雨、雨が降る",
      "バラ"
    ],
    "distractorsEn": [
      "jogging",
      "rain",
      "rose"
    ],
    "sentenceEn": [
      "There",
      "are",
      "many",
      "interesting",
      "animals",
      "in",
      "Africa."
    ],
    "sentenceJa": "（アフリカには多くの興味深い動物がいる）",
    "sentenceDistractors": [
      "road",
      "cause"
    ]
  },
  {
    "num": "0142",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "India",
    "phonetic": "índiə",
    "partOfSpeech": "名詞",
    "japanese": "インド",
    "tip": "[読み: インディア] / カテゴリ: 国・地域 / 類義/関連: 関連語:Indian(インド人, インド(人)の)",
    "distractorsJa": [
      "ミュージカル、音楽の",
      "バドミントン",
      "種類"
    ],
    "distractorsEn": [
      "musical",
      "badminton",
      "kind"
    ],
    "sentenceEn": [
      "India",
      "has",
      "a",
      "large",
      "population."
    ],
    "sentenceJa": "インドは人口が多い",
    "sentenceDistractors": [
      "corner",
      "bread"
    ]
  },
  {
    "num": "0143",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "soccer",
    "phonetic": "sɑ́ːkər",
    "partOfSpeech": "名詞",
    "japanese": "サッカー",
    "tip": "[読み: サ(ー)カァ] / カテゴリ: スポーツ / フレーズ例: soccer ball (サッカーボール)",
    "distractorsJa": [
      "星",
      "会, 会議",
      "動物"
    ],
    "distractorsEn": [
      "star",
      "meeting",
      "animal"
    ],
    "sentenceEn": [
      "Which",
      "do",
      "you",
      "like",
      "better,",
      "soccer",
      "or",
      "baseball?"
    ],
    "sentenceJa": "サッカーと野球のどちらが好きですか",
    "sentenceDistractors": [
      "restaurant",
      "birthday"
    ]
  },
  {
    "num": "0144",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "basketball",
    "phonetic": "bǽskitbɔːl",
    "partOfSpeech": "名詞",
    "japanese": "バスケットボール, バスケットボールのボール",
    "tip": "[読み: バスケットボール] / カテゴリ: スポーツ",
    "distractorsJa": [
      "ギター",
      "インド",
      "終わり"
    ],
    "distractorsEn": [
      "guitar",
      "India",
      "end"
    ],
    "sentenceEn": [
      "Basketball",
      "is",
      "very",
      "popular",
      "in",
      "my",
      "class."
    ],
    "sentenceJa": "バスケットボールは私のクラスではとても人気がある",
    "sentenceDistractors": [
      "vegetable",
      "twenty"
    ]
  },
  {
    "num": "0145",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "volleyball",
    "phonetic": "vɑ́ːlibɔːl",
    "partOfSpeech": "名詞",
    "japanese": "バレーボール, バレーボールのボール",
    "tip": "[読み: ヴァ(ー)リボーる] / カテゴリ: スポーツ",
    "distractorsJa": [
      "物, こと",
      "バラ",
      "サッカー"
    ],
    "distractorsEn": [
      "thing",
      "rose",
      "soccer"
    ],
    "sentenceEn": [
      "We",
      "enjoyed",
      "playing",
      "volleyball",
      "on",
      "the",
      "beach."
    ],
    "sentenceJa": "私たちは浜辺でバレーボールをして楽しんだ",
    "sentenceDistractors": [
      "September",
      "sweet"
    ]
  },
  {
    "num": "0146",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "badminton",
    "phonetic": "bǽdmint(ə)n",
    "partOfSpeech": "名詞",
    "japanese": "バドミントン",
    "tip": "[読み: バドミントン] / カテゴリ: スポーツ / メモ: アクセント注意",
    "distractorsJa": [
      "線, 行列, (電車などの)路線",
      "インド",
      "会, 会議"
    ],
    "distractorsEn": [
      "line",
      "India",
      "meeting"
    ],
    "sentenceEn": [
      "Let's",
      "play",
      "badminton",
      "in",
      "the",
      "gym",
      "after",
      "school."
    ],
    "sentenceJa": "放課後に体育館でバドミントンをしましょう。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0147",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "racket",
    "phonetic": "rǽkit",
    "partOfSpeech": "名詞",
    "japanese": "(テニスなどの)ラケット",
    "tip": "[読み: ラケット] / カテゴリ: スポーツ",
    "distractorsJa": [
      "アフリカ",
      "動物",
      "お金"
    ],
    "distractorsEn": [
      "Africa",
      "animal",
      "money"
    ],
    "sentenceEn": [
      "I",
      "bought",
      "a",
      "new",
      "tennis",
      "racket",
      "yesterday."
    ],
    "sentenceJa": "私は昨日新しいテニスラケットを買った。",
    "sentenceDistractors": [
      "clever",
      "fry"
    ]
  },
  {
    "num": "0148",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "jogging",
    "phonetic": "dʒɑ́ːɡiŋ",
    "partOfSpeech": "名詞",
    "japanese": "ジョギング",
    "tip": "[読み: ヂャ(ー)ギング] / カテゴリ: スポーツ",
    "distractorsJa": [
      "皿, 料理",
      "行事, できごと",
      "サッカー"
    ],
    "distractorsEn": [
      "dish",
      "event",
      "soccer"
    ],
    "sentenceEn": [
      "My",
      "grandfather",
      "goes",
      "jogging",
      "every",
      "morning."
    ],
    "sentenceJa": "私の祖父は毎朝ジョギングに行きます。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0149",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "goal",
    "phonetic": "ɡóul",
    "partOfSpeech": "名詞",
    "japanese": "(サッカーなどの)ゴール, (ゴールに入れた)得点, 目標",
    "tip": "[読み: ゴウル] / カテゴリ: スポーツ",
    "distractorsJa": [
      "終わり",
      "携帯電話",
      "インド"
    ],
    "distractorsEn": [
      "end",
      "cell phone",
      "India"
    ],
    "sentenceEn": [
      "My",
      "sister",
      "scored",
      "a",
      "goal",
      "in",
      "the",
      "game."
    ],
    "sentenceJa": "妹はその試合でゴールを決めた",
    "sentenceDistractors": [
      "test",
      "fine"
    ]
  },
  {
    "num": "0150",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "kind",
    "phonetic": "káind",
    "partOfSpeech": "名詞",
    "japanese": "種類",
    "tip": "[読み: カインド] / カテゴリ: その他 / フレーズ例: a kind of ~ (一種の〜)",
    "distractorsJa": [
      "切符, チケット",
      "正面, 前面",
      "例"
    ],
    "distractorsEn": [
      "ticket",
      "front",
      "example"
    ],
    "sentenceEn": [
      "She",
      "was",
      "kind",
      "to",
      "me",
      "when",
      "I",
      "was",
      "sick."
    ],
    "sentenceJa": "私が病気のとき，彼女は私に親切にしてくれた",
    "sentenceDistractors": [
      "write",
      "today"
    ]
  },
  {
    "num": "0151",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "e-mail",
    "phonetic": "[íːmeil]",
    "partOfSpeech": "名詞",
    "japanese": "電子メール, Eメール",
    "tip": "[読み: イーメイル] / カテゴリ: その他 / 類義/関連: 同意語:E-mail, email(電子メール)",
    "distractorsJa": [
      "バスケットボール, バスケットボールのボール",
      "行事, できごと",
      "(テニスなどの)ラケット"
    ],
    "distractorsEn": [
      "basketball",
      "event",
      "racket"
    ],
    "sentenceEn": [
      "Send",
      "me",
      "an",
      "e-mail",
      "with",
      "your",
      "picture."
    ],
    "sentenceJa": "あなたの写真をつけて E メールを送ってください",
    "sentenceDistractors": [
      "cake",
      "sign"
    ]
  },
  {
    "num": "0152",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "information",
    "phonetic": "[ìnfərméiʃ(ə)n]",
    "partOfSpeech": "名詞",
    "japanese": "情報",
    "tip": "[読み: インフォメイション] / カテゴリ: その他",
    "distractorsJa": [
      "ギター",
      "川, 河",
      "星"
    ],
    "distractorsEn": [
      "guitar",
      "river",
      "star"
    ],
    "sentenceEn": [
      "I",
      "got",
      "a",
      "lot",
      "of",
      "information",
      "about",
      "the",
      "new",
      "computer."
    ],
    "sentenceJa": "私はその新しいコンピュータについてたくさんの情報を得た",
    "sentenceDistractors": [
      "sister",
      "hold"
    ]
  },
  {
    "num": "0153",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "thing",
    "phonetic": "[θiŋ]",
    "partOfSpeech": "名詞",
    "japanese": "物, こと",
    "tip": "[読み: スィング] / カテゴリ: その他",
    "distractorsJa": [
      "携帯電話",
      "正面, 前面",
      "販売, 特売, バーゲンセール"
    ],
    "distractorsEn": [
      "cell phone",
      "front",
      "sale"
    ],
    "sentenceEn": [
      "I",
      "have",
      "many",
      "things",
      "to",
      "do",
      "before",
      "the",
      "trip."
    ],
    "sentenceJa": "旅行の前にすべきことがたくさんある",
    "sentenceDistractors": [
      "look",
      "talk"
    ]
  },
  {
    "num": "0154",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "story",
    "phonetic": "[stɔ́ːri]",
    "partOfSpeech": "名詞",
    "japanese": "物語, 話",
    "tip": "[読み: ストーリィ] / カテゴリ: その他",
    "distractorsJa": [
      "動物",
      "携帯電話",
      "練習、(を)練習する"
    ],
    "distractorsEn": [
      "animal",
      "cell phone",
      "practice"
    ],
    "sentenceEn": [
      "The",
      "teacher",
      "told",
      "the",
      "children",
      "an",
      "interesting",
      "story."
    ],
    "sentenceJa": "先生は子どもたちにおもしろい話を聞かせた",
    "sentenceDistractors": [
      "summer",
      "hour"
    ]
  },
  {
    "num": "0155",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "word",
    "phonetic": "[wə́ːrd]",
    "partOfSpeech": "名詞",
    "japanese": "語, 単語, 言葉",
    "tip": "[読み: ワード] / カテゴリ: その他 / フレーズ例: English words (英単語)",
    "distractorsJa": [
      "中心, 中央",
      "電子メール, Eメール",
      "終わり"
    ],
    "distractorsEn": [
      "center",
      "e-mail",
      "end"
    ],
    "sentenceEn": [
      "I",
      "learned",
      "this",
      "English",
      "word",
      "yesterday."
    ],
    "sentenceJa": "私は昨日この英単語を習った",
    "sentenceDistractors": [
      "just",
      "please"
    ]
  },
  {
    "num": "0156",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "future",
    "phonetic": "[fjúːtʃər]",
    "partOfSpeech": "名詞",
    "japanese": "(ふつう the future で)未来, 将来",
    "tip": "[読み: フューチャ] / カテゴリ: その他 / 類義/関連: 参考表現:the past(過去), 参考表現:the present(現在)",
    "distractorsJa": [
      "山, (mountainsで)山脈",
      "水",
      "インド"
    ],
    "distractorsEn": [
      "mountain",
      "water",
      "India"
    ],
    "sentenceEn": [
      "I",
      "want",
      "to",
      "be",
      "a",
      "nurse",
      "in",
      "the",
      "future."
    ],
    "sentenceJa": "私は将来看護師になりたい",
    "sentenceDistractors": [
      "interesting",
      "job"
    ]
  },
  {
    "num": "0157",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "cell phone",
    "phonetic": "[sél fòun]",
    "partOfSpeech": "名詞",
    "japanese": "携帯電話",
    "tip": "[読み: セルフォウン] / カテゴリ: その他",
    "distractorsJa": [
      "日本",
      "バレーボール, バレーボールのボール",
      "種類"
    ],
    "distractorsEn": [
      "Japan",
      "volleyball",
      "kind"
    ],
    "sentenceEn": [
      "Please",
      "turn",
      "off",
      "your",
      "cell",
      "phone",
      "here."
    ],
    "sentenceJa": "ここでは携帯電話の電源を切ってください。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0158",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "event",
    "phonetic": "[ivént]",
    "partOfSpeech": "名詞",
    "japanese": "行事, できごと",
    "tip": "[読み: イヴェント] / カテゴリ: その他",
    "distractorsJa": [
      "音、(〜のように)聞こえる",
      "お金",
      "例"
    ],
    "distractorsEn": [
      "sound",
      "money",
      "example"
    ],
    "sentenceEn": [
      "The",
      "summer",
      "festival",
      "is",
      "a",
      "big",
      "event",
      "in",
      "our",
      "town."
    ],
    "sentenceJa": "夏祭りは私たちの町の大きな行事だ",
    "sentenceDistractors": [
      "river",
      "drink"
    ]
  },
  {
    "num": "0159",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "culture",
    "phonetic": "[kʌ́ltʃər]",
    "partOfSpeech": "名詞",
    "japanese": "文化",
    "tip": "[読み: カルチャ] / カテゴリ: その他",
    "distractorsJa": [
      "ジョギング",
      "花",
      "(サッカーなどの)ゴール, (ゴールに入れた)得点, 目標"
    ],
    "distractorsEn": [
      "jogging",
      "flower",
      "goal"
    ],
    "sentenceEn": [
      "We",
      "studied",
      "Chinese",
      "culture",
      "in",
      "class",
      "today."
    ],
    "sentenceJa": "私たちは今日，授業で中国文化を勉強した",
    "sentenceDistractors": [
      "lose",
      "plant"
    ]
  },
  {
    "num": "0160",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "center",
    "phonetic": "[séntər]",
    "partOfSpeech": "名詞",
    "japanese": "中心, 中央",
    "tip": "[読み: センタァ] / カテゴリ: その他",
    "distractorsJa": [
      "イングランド",
      "星",
      "正面, 前面"
    ],
    "distractorsEn": [
      "England",
      "star",
      "front"
    ],
    "sentenceEn": [
      "The",
      "girl",
      "in",
      "the",
      "center",
      "of",
      "the",
      "photo",
      "is",
      "Miki."
    ],
    "sentenceJa": "写真のまん中にいる少女がミキだ",
    "sentenceDistractors": [
      "meaning",
      "inside"
    ]
  },
  {
    "num": "0161",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "meeting",
    "phonetic": "[míːtiŋ]",
    "partOfSpeech": "名詞",
    "japanese": "会, 会議",
    "tip": "[読み: ミーティング] / カテゴリ: その他",
    "distractorsJa": [
      "携帯電話",
      "紫色、紫色の",
      "音楽会, コンサート"
    ],
    "distractorsEn": [
      "cell phone",
      "purple",
      "concert"
    ],
    "sentenceEn": [
      "Many",
      "people",
      "wanted",
      "to",
      "talk",
      "at",
      "the",
      "meeting."
    ],
    "sentenceJa": "多くの人がその会合で発言したがっていた",
    "sentenceDistractors": [
      "o'clock",
      "abroad"
    ]
  },
  {
    "num": "0162",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "ticket",
    "phonetic": "[tíkət]",
    "partOfSpeech": "名詞",
    "japanese": "切符, チケット",
    "tip": "[読み: ティケット] / カテゴリ: その他",
    "distractorsJa": [
      "会, 会議",
      "行事, できごと",
      "紫色、紫色の"
    ],
    "distractorsEn": [
      "meeting",
      "event",
      "purple"
    ],
    "sentenceEn": [
      "Where",
      "can",
      "I",
      "get",
      "a",
      "train",
      "ticket?"
    ],
    "sentenceJa": "どこで電車の切符を買うことができますか",
    "sentenceDistractors": [
      "ice",
      "control"
    ]
  },
  {
    "num": "0163",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "sale",
    "phonetic": "[seil]",
    "partOfSpeech": "名詞",
    "japanese": "販売, 特売, バーゲンセール",
    "tip": "[読み: セイル] / カテゴリ: その他 / フレーズ例: on sale (特売で)",
    "distractorsJa": [
      "はがき",
      "ポスター",
      "バラ"
    ],
    "distractorsEn": [
      "postcard",
      "poster",
      "rose"
    ],
    "sentenceEn": [
      "This",
      "item",
      "is",
      "on",
      "sale."
    ],
    "sentenceJa": "この商品はセール中です。",
    "sentenceDistractors": [
      "anger",
      "attack"
    ]
  },
  {
    "num": "0164",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "money",
    "phonetic": "[mʌ́ni]",
    "partOfSpeech": "名詞",
    "japanese": "お金",
    "tip": "[読み: マニィ] / カテゴリ: その他",
    "distractorsJa": [
      "音楽会, コンサート",
      "情報",
      "ワイシャツ, シャツ"
    ],
    "distractorsEn": [
      "concert",
      "information",
      "shirt"
    ],
    "sentenceEn": [
      "She",
      "spends",
      "too",
      "much",
      "money",
      "on",
      "clothes."
    ],
    "sentenceJa": "彼女は衣服にお金をたくさん使いすぎる",
    "sentenceDistractors": [
      "animal",
      "difficult"
    ]
  },
  {
    "num": "0165",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "line",
    "phonetic": "[lain]",
    "partOfSpeech": "名詞",
    "japanese": "線, 行列, (電車などの)路線",
    "tip": "[読み: ライン] / カテゴリ: その他",
    "distractorsJa": [
      "電子メール, Eメール",
      "バイオリン",
      "インド"
    ],
    "distractorsEn": [
      "e-mail",
      "violin",
      "India"
    ],
    "sentenceEn": [
      "He",
      "drew",
      "lines",
      "under",
      "important",
      "words."
    ],
    "sentenceJa": "彼は重要な語の下に線を引いた",
    "sentenceDistractors": [
      "piece",
      "milk"
    ]
  },
  {
    "num": "0166",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "end",
    "phonetic": "[end]",
    "partOfSpeech": "名詞",
    "japanese": "終わり",
    "tip": "[読み: エンド] / カテゴリ: その他",
    "distractorsJa": [
      "お金",
      "バラ",
      "ドレス, 服装"
    ],
    "distractorsEn": [
      "money",
      "rose",
      "dress"
    ],
    "sentenceEn": [
      "Don’t",
      "tell",
      "me",
      "the",
      "end",
      "of",
      "the",
      "story."
    ],
    "sentenceJa": "その話の結末は言わないで。",
    "sentenceDistractors": [
      "door",
      "cat"
    ]
  },
  {
    "num": "0167",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "front",
    "phonetic": "[frʌnt]",
    "partOfSpeech": "名詞",
    "japanese": "正面, 前面",
    "tip": "[読み: フラント] / カテゴリ: その他 / 類義/関連: 反意語:back(後ろ) / メモ: 発音注意 / フレーズ例: in front of ~ (〜の前に)",
    "distractorsJa": [
      "ギター",
      "物, こと",
      "皿, 料理"
    ],
    "distractorsEn": [
      "guitar",
      "thing",
      "dish"
    ],
    "sentenceEn": [
      "You",
      "can",
      "leave",
      "your",
      "bicycle",
      "in",
      "front",
      "of",
      "my",
      "house."
    ],
    "sentenceJa": "私の家の前に自転車を置いていっていいですよ",
    "sentenceDistractors": [
      "space",
      "travel"
    ]
  },
  {
    "num": "0168",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "way",
    "phonetic": "[wei]",
    "partOfSpeech": "名詞",
    "japanese": "道, 方向, 方法",
    "tip": "[読み: ウェイ] / カテゴリ: その他",
    "distractorsJa": [
      "ギター",
      "(テニスなどの)ラケット",
      "例"
    ],
    "distractorsEn": [
      "guitar",
      "racket",
      "example"
    ],
    "sentenceEn": [
      "Could",
      "you",
      "tell",
      "me",
      "the",
      "way",
      "to",
      "City",
      "Hall?"
    ],
    "sentenceJa": "市役所へ行く道を教えていただけますか",
    "sentenceDistractors": [
      "become",
      "live"
    ]
  },
  {
    "num": "0169",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "race",
    "phonetic": "[reis]",
    "partOfSpeech": "名詞",
    "japanese": "レース, 競走、競走する",
    "tip": "[読み: レイス] / カテゴリ: その他",
    "distractorsJa": [
      "ギター",
      "山, (mountainsで)山脈",
      "動物"
    ],
    "distractorsEn": [
      "guitar",
      "mountain",
      "animal"
    ],
    "sentenceEn": [
      "Tom",
      "couldn't",
      "run",
      "very",
      "fast",
      "and",
      "lost",
      "the",
      "race."
    ],
    "sentenceJa": "トムはあまり速く走れず，競走に負けた",
    "sentenceDistractors": [
      "receive",
      "worker"
    ]
  },
  {
    "num": "0170",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "plan",
    "phonetic": "[plæn]",
    "partOfSpeech": "名詞",
    "japanese": "計画、(を)計画する",
    "tip": "[読み: プラン] / カテゴリ: その他",
    "distractorsJa": [
      "会, 会議",
      "バイオリン",
      "情報"
    ],
    "distractorsEn": [
      "meeting",
      "violin",
      "information"
    ],
    "sentenceEn": [
      "I",
      "have",
      "a",
      "plan",
      "to",
      "go",
      "abroad",
      "next",
      "year."
    ],
    "sentenceJa": "私には，来年海外に行く計画がある",
    "sentenceDistractors": [
      "Internet",
      "reason"
    ]
  },
  {
    "num": "0171",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "fun",
    "phonetic": "[fʌn]",
    "partOfSpeech": "名詞",
    "japanese": "楽しみ",
    "tip": "[読み: ファン] / カテゴリ: その他",
    "distractorsJa": [
      "文化",
      "線, 行列, (電車などの)路線",
      "紫色、紫色の"
    ],
    "distractorsEn": [
      "culture",
      "line",
      "purple"
    ],
    "sentenceEn": [
      "We",
      "had",
      "a",
      "lot",
      "of",
      "fun",
      "on",
      "the",
      "school",
      "trip."
    ],
    "sentenceJa": "私たちは修学旅行でとても楽しかった",
    "sentenceDistractors": [
      "traditional",
      "warm"
    ]
  },
  {
    "num": "0172",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "example",
    "phonetic": "[igzǽmpl]",
    "partOfSpeech": "名詞",
    "japanese": "例",
    "tip": "[読み: イグザンプル] / カテゴリ: その他 / フレーズ例: for example (たとえば)",
    "distractorsJa": [
      "天気, 天候",
      "正面, 前面",
      "スペイン"
    ],
    "distractorsEn": [
      "weather",
      "front",
      "Spain"
    ],
    "sentenceEn": [
      "Could",
      "you",
      "please",
      "give",
      "us",
      "an",
      "example?"
    ],
    "sentenceJa": "例を示していただけませんか",
    "sentenceDistractors": [
      "sure",
      "town"
    ]
  },
  {
    "num": "0173",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "postcard",
    "phonetic": "[póus(t)kɑːrd]",
    "partOfSpeech": "名詞",
    "japanese": "はがき",
    "tip": "[読み: ポウス(ト)カード] / カテゴリ: その他",
    "distractorsJa": [
      "(サッカーなどの)ゴール, (ゴールに入れた)得点, 目標",
      "川, 河",
      "文化"
    ],
    "distractorsEn": [
      "goal",
      "river",
      "culture"
    ],
    "sentenceEn": [
      "I",
      "sent",
      "a",
      "postcard",
      "to",
      "my",
      "grandmother",
      "from",
      "Kyoto."
    ],
    "sentenceJa": "私は京都から祖母にはがきを送った。",
    "sentenceDistractors": [
      "image",
      "theme"
    ]
  },
  {
    "num": "0174",
    "level": 3,
    "stageSlug": "eiken4_stage03",
    "english": "poster",
    "phonetic": "[póustər]",
    "partOfSpeech": "名詞",
    "japanese": "ポスター",
    "tip": "[読み: ポウスタァ] / カテゴリ: その他",
    "distractorsJa": [
      "スペイン",
      "浜, 海辺",
      "正面, 前面"
    ],
    "distractorsEn": [
      "Spain",
      "beach",
      "front"
    ],
    "sentenceEn": [
      "There",
      "is",
      "a",
      "poster",
      "of",
      "my",
      "favorite",
      "band",
      "on",
      "the",
      "wall."
    ],
    "sentenceJa": "壁に私のお気に入りのバンドのポスターが貼ってあります。",
    "sentenceDistractors": [
      "wing",
      "east"
    ]
  },
  {
    "num": "0175",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "robot",
    "phonetic": "[róubɑ(ː)t]",
    "partOfSpeech": "名詞",
    "japanese": "ロボット",
    "tip": "[読み: ロウバ(ー)ット] / カテゴリ: その他",
    "distractorsJa": [
      "とどまる, 泊まる, 滞在する、滞在",
      "(を)感じる，(と)思う",
      "を望む，(〜だと)いいと思う"
    ],
    "distractorsEn": [
      "stay",
      "feel",
      "hope"
    ],
    "sentenceEn": [
      "This",
      "robot",
      "can",
      "clean",
      "the",
      "floor."
    ],
    "sentenceJa": "このロボットは床をきれいにすることができる",
    "sentenceDistractors": [
      "fast",
      "since"
    ]
  },
  {
    "num": "0176",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "go",
    "phonetic": "[gou]",
    "partOfSpeech": "動詞",
    "japanese": "行く, 進む",
    "tip": "[読み: ゴウ] / カテゴリ: 動詞 / 類義/関連: 反意語:come(来る) / フレーズ例: go to ~ (〜へ行く)",
    "distractorsJa": [
      "(が)見える, に会う",
      "を招待する",
      "(を)呼ぶ，(に)電話する、電話をかけること"
    ],
    "distractorsEn": [
      "see",
      "invite",
      "call"
    ],
    "sentenceEn": [
      "I",
      "go",
      "to",
      "school",
      "by",
      "bus",
      "every",
      "day."
    ],
    "sentenceJa": "（私は毎日，バスで学校へ行く）",
    "sentenceDistractors": [
      "want",
      "from"
    ]
  },
  {
    "num": "0177",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "like",
    "phonetic": "[laik]",
    "partOfSpeech": "動詞",
    "japanese": "が好きである, を好む",
    "tip": "[読み: ライク] / カテゴリ: 動詞",
    "distractorsJa": [
      "住む, 暮らす",
      "(を)飲む、飲み物",
      "泳ぐ、泳ぐこと，水泳"
    ],
    "distractorsEn": [
      "live",
      "drink",
      "swim"
    ],
    "sentenceEn": [
      "I",
      "like",
      "Chinese",
      "food."
    ],
    "sentenceJa": "私は中国料理が好きだ",
    "sentenceDistractors": [
      "them",
      "your"
    ]
  },
  {
    "num": "0178",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "buy",
    "phonetic": "[bai]",
    "partOfSpeech": "動詞",
    "japanese": "を買う",
    "tip": "[読み: バイ] / カテゴリ: 動詞 / 類義/関連: 反意語:sell(を売る)",
    "distractorsJa": [
      "(を)教える",
      "とどまる, 泊まる, 滞在する、滞在",
      "(に)会う"
    ],
    "distractorsEn": [
      "teach",
      "stay",
      "meet"
    ],
    "sentenceEn": [
      "Did",
      "you",
      "buy",
      "a",
      "doll",
      "for",
      "her?"
    ],
    "sentenceJa": "あなたは彼女に人形を買いましたか",
    "sentenceDistractors": [
      "these",
      "oh"
    ]
  },
  {
    "num": "0179",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "get",
    "phonetic": "[get]",
    "partOfSpeech": "動詞",
    "japanese": "を手に入れる",
    "tip": "[読み: ゲット] / カテゴリ: 動詞",
    "distractorsJa": [
      "(絵の具で)をかく，にペンキをぬる",
      "を招待する",
      "を切る"
    ],
    "distractorsEn": [
      "paint",
      "invite",
      "cut"
    ],
    "sentenceEn": [
      "I",
      "want",
      "to",
      "get",
      "an",
      "e-mail",
      "from",
      "her."
    ],
    "sentenceJa": "私は彼女からEメールをもらいたい",
    "sentenceDistractors": [
      "thing",
      "take"
    ]
  },
  {
    "num": "0180",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "visit",
    "phonetic": "[vízət]",
    "partOfSpeech": "動詞",
    "japanese": "(を)訪問する, (を)訪れる、訪問, 見学",
    "tip": "[読み: ヴィジット] / カテゴリ: 動詞",
    "distractorsJa": [
      "を楽しむ",
      "(に)乗る、乗ること",
      "を必要とする"
    ],
    "distractorsEn": [
      "enjoy",
      "ride",
      "need"
    ],
    "sentenceEn": [
      "I'm",
      "going",
      "to",
      "visit",
      "Hong",
      "Kong",
      "on",
      "my",
      "next",
      "trip."
    ],
    "sentenceJa": "私は次の旅行で香港を訪れる予定だ",
    "sentenceDistractors": [
      "home",
      "family"
    ]
  },
  {
    "num": "0181",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "come",
    "phonetic": "[kʌm]",
    "partOfSpeech": "動詞",
    "japanese": "来る, (相手のほうへ)行く",
    "tip": "[読み: カム] / カテゴリ: 動詞 / 類義/関連: 反意語:go(行く)",
    "distractorsJa": [
      "を楽しむ",
      "(を)呼ぶ，(に)電話する、電話をかけること",
      "(を)書く，(に)手紙を書く"
    ],
    "distractorsEn": [
      "enjoy",
      "call",
      "write"
    ],
    "sentenceEn": [
      "She'll",
      "come",
      "to",
      "the",
      "party",
      "tomorrow."
    ],
    "sentenceJa": "（彼女は明日パーティーに来るだろう）",
    "sentenceDistractors": [
      "by",
      "English"
    ]
  },
  {
    "num": "0182",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "see",
    "phonetic": "[siː]",
    "partOfSpeech": "動詞",
    "japanese": "(が)見える, に会う",
    "tip": "[読み: スィー] / カテゴリ: 動詞 / 類義/関連: 同意語:look((注意して)見る), 同意語:watch((を)じっと見る)",
    "distractorsJa": [
      "住む, 暮らす",
      "(を)食べる",
      "が聞こえる"
    ],
    "distractorsEn": [
      "live",
      "eat",
      "hear"
    ],
    "sentenceEn": [
      "From",
      "the",
      "top",
      "of",
      "the",
      "tower,",
      "we",
      "can",
      "see",
      "the",
      "sea."
    ],
    "sentenceJa": "その塔のてっぺんからは，海が見える",
    "sentenceDistractors": [
      "be",
      "know"
    ]
  },
  {
    "num": "0183",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "take",
    "phonetic": "[teik]",
    "partOfSpeech": "動詞",
    "japanese": "を取る, (乗り物に)乗る, を持っていく, を連れていく",
    "tip": "[読み: テイク] / カテゴリ: 動詞 / フレーズ例: take a taxi (タクシーに乗る)",
    "distractorsJa": [
      "(を)読む",
      "(絵の具で)をかく，にペンキをぬる",
      "泳ぐ、泳ぐこと，水泳"
    ],
    "distractorsEn": [
      "read",
      "paint",
      "swim"
    ],
    "sentenceEn": [
      "The",
      "girl",
      "took",
      "a",
      "magazine",
      "from",
      "the",
      "shelf."
    ],
    "sentenceJa": "その女の子は雑誌を棚から取った",
    "sentenceDistractors": [
      "talk",
      "find"
    ]
  },
  {
    "num": "0184",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "make",
    "phonetic": "[meik]",
    "partOfSpeech": "動詞",
    "japanese": "を作る",
    "tip": "[読み: メイク] / カテゴリ: 動詞",
    "distractorsJa": [
      "(と)言う, 話す",
      "来る, (相手のほうへ)行く",
      "を与える，をあげる"
    ],
    "distractorsEn": [
      "say",
      "come",
      "give"
    ],
    "sentenceEn": [
      "My",
      "father",
      "makes",
      "breakfast",
      "every",
      "morning."
    ],
    "sentenceJa": "父は毎朝朝食をつくる",
    "sentenceDistractors": [
      "many",
      "how"
    ]
  },
  {
    "num": "0185",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "look",
    "phonetic": "[luk]",
    "partOfSpeech": "動詞",
    "japanese": "(注意して)見る",
    "tip": "[読み: ルック] / カテゴリ: 動詞 / 類義/関連: 同意語:see((が)見える), 同意語:watch((を)じっと見る)",
    "distractorsJa": [
      "(を)書く，(に)手紙を書く",
      "(を)食べる",
      "(が)見える, に会う"
    ],
    "distractorsEn": [
      "write",
      "eat",
      "see"
    ],
    "sentenceEn": [
      "Look",
      "at",
      "the",
      "blackboard",
      "and",
      "listen",
      "to",
      "me."
    ],
    "sentenceJa": "（黒板を見て，私の言うことを聞きなさい）",
    "sentenceDistractors": [
      "student",
      "Japanese"
    ]
  },
  {
    "num": "0186",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "watch",
    "phonetic": "[wɑ(ː)tʃ]",
    "partOfSpeech": "動詞",
    "japanese": "(を)じっと見る、腕時計",
    "tip": "[読み: ワ(ー)ッチ] / カテゴリ: 動詞 / 類義/関連: 同意語:look((注意して)見る), 同意語:see((が)見える)",
    "distractorsJa": [
      "(を)訪問する, (を)訪れる、訪問, 見学",
      "(に)会う",
      "走る"
    ],
    "distractorsEn": [
      "visit",
      "meet",
      "run"
    ],
    "sentenceEn": [
      "Shall",
      "we",
      "watch",
      "the",
      "news",
      "on",
      "TV?"
    ],
    "sentenceJa": "テレビでニュースを見ましょうか",
    "sentenceDistractors": [
      "where",
      "future"
    ]
  },
  {
    "num": "0187",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "meet",
    "phonetic": "[miːt]",
    "partOfSpeech": "動詞",
    "japanese": "(に)会う",
    "tip": "[読み: ミート] / カテゴリ: 動詞 / 類義/関連: 関連語:meeting(会, 会議)",
    "distractorsJa": [
      "(を)食べる",
      "(を)教える",
      "急ぐ，を急がせる、急ぎ"
    ],
    "distractorsEn": [
      "eat",
      "teach",
      "hurry"
    ],
    "sentenceEn": [
      "Let's",
      "meet",
      "at",
      "the",
      "coffee",
      "shop",
      "near",
      "the",
      "station."
    ],
    "sentenceJa": "駅の近くの喫茶店で会いましょう",
    "sentenceDistractors": [
      "name",
      "room"
    ]
  },
  {
    "num": "0188",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "talk",
    "phonetic": "[tɔ́ːk]",
    "partOfSpeech": "動詞",
    "japanese": "(を)話す",
    "tip": "[読み: トーク] / カテゴリ: 動詞 / フレーズ例: talk to ~ (〜に話す)",
    "distractorsJa": [
      "を持ってくる，を連れてくる",
      "(を)呼ぶ，(に)電話する、電話をかけること",
      "を愛する，が大好きである、愛"
    ],
    "distractorsEn": [
      "bring",
      "call",
      "love"
    ],
    "sentenceEn": [
      "They",
      "are",
      "going",
      "to",
      "talk",
      "about",
      "the",
      "school",
      "trip."
    ],
    "sentenceJa": "彼らは修学旅行について話すつもりだ",
    "sentenceDistractors": [
      "Japanese",
      "after"
    ]
  },
  {
    "num": "0189",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "say",
    "phonetic": "[sei]",
    "partOfSpeech": "動詞",
    "japanese": "(と)言う, 話す",
    "tip": "[読み: セイ] / カテゴリ: 動詞",
    "distractorsJa": [
      "(を)洗う",
      "を楽しむ",
      "泳ぐ、泳ぐこと，水泳"
    ],
    "distractorsEn": [
      "wash",
      "enjoy",
      "swim"
    ],
    "sentenceEn": [
      "What",
      "did",
      "she",
      "say",
      "in",
      "her",
      "speech?"
    ],
    "sentenceJa": "（彼女はスピーチで何と言いましたか）",
    "sentenceDistractors": [
      "there",
      "his"
    ]
  },
  {
    "num": "0190",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "tell",
    "phonetic": "[tel]",
    "partOfSpeech": "動詞",
    "japanese": "(を)話す, 言う",
    "tip": "[読み: テル] / カテゴリ: 動詞 / フレーズ例: tell A B (AにBを話す)",
    "distractorsJa": [
      "を終える，終わる",
      "を望む，(〜だと)いいと思う",
      "を買う"
    ],
    "distractorsEn": [
      "finish",
      "hope",
      "buy"
    ],
    "sentenceEn": [
      "Please",
      "tell",
      "me",
      "the",
      "truth."
    ],
    "sentenceJa": "私に真実を話してください",
    "sentenceDistractors": [
      "or",
      "then"
    ]
  },
  {
    "num": "0191",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "speak",
    "phonetic": "[spiːk]",
    "partOfSpeech": "動詞",
    "japanese": "(を)話す, 演説する",
    "tip": "[読み: スピーク] / カテゴリ: 動詞",
    "distractorsJa": [
      "を招待する",
      "を作る",
      "来る, (相手のほうへ)行く"
    ],
    "distractorsEn": [
      "invite",
      "make",
      "come"
    ],
    "sentenceEn": [
      "I",
      "must",
      "speak",
      "in",
      "front",
      "of",
      "the",
      "class."
    ],
    "sentenceJa": "私はクラスのみんなの前で話さなくてはならない",
    "sentenceDistractors": [
      "change",
      "meet"
    ]
  },
  {
    "num": "0192",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "listen",
    "phonetic": "[lís(ə)n]",
    "partOfSpeech": "動詞",
    "japanese": "(注意して)聞く",
    "tip": "[読み: リスン] / カテゴリ: 動詞 / 類義/関連: 同意語:hear(が聞こえる) / フレーズ例: listen to ~ (〜を聞く)",
    "distractorsJa": [
      "(が)見える, に会う",
      "をためす，(〜しようと)努力する、試み",
      "とどまる, 泊まる, 滞在する、滞在"
    ],
    "distractorsEn": [
      "see",
      "try",
      "stay"
    ],
    "sentenceEn": [
      "I",
      "always",
      "listen",
      "to",
      "the",
      "radio",
      "before",
      "I",
      "go",
      "to",
      "bed."
    ],
    "sentenceJa": "私は寝る前にいつもラジオを聞く",
    "sentenceDistractors": [
      "soon",
      "sorry"
    ]
  },
  {
    "num": "0193",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "hear",
    "phonetic": "[hiər]",
    "partOfSpeech": "動詞",
    "japanese": "が聞こえる",
    "tip": "[読み: ヒァ] / カテゴリ: 動詞 / 類義/関連: 同意語:listen((注意して)聞く)",
    "distractorsJa": [
      "行く, 進む",
      "を手に入れる",
      "心配する，を心配させる"
    ],
    "distractorsEn": [
      "go",
      "get",
      "worry"
    ],
    "sentenceEn": [
      "Can",
      "you",
      "hear",
      "the",
      "sound",
      "of",
      "a",
      "train?"
    ],
    "sentenceJa": "列車の音が聞こえますか",
    "sentenceDistractors": [
      "different",
      "hard"
    ]
  },
  {
    "num": "0194",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "ask",
    "phonetic": "[æsk]",
    "partOfSpeech": "動詞",
    "japanese": "(を)たずねる, 質問する, (を)頼む",
    "tip": "[読み: アスク] / カテゴリ: 動詞 / フレーズ例: ask a question (質問する)",
    "distractorsJa": [
      "を望む，(〜だと)いいと思う",
      "とどまる, 泊まる, 滞在する、滞在",
      "(を)話す, 演説する"
    ],
    "distractorsEn": [
      "hope",
      "stay",
      "speak"
    ],
    "sentenceEn": [
      "May",
      "I",
      "ask",
      "you",
      "a",
      "question?"
    ],
    "sentenceJa": "質問してもよろしいですか",
    "sentenceDistractors": [
      "too",
      "question"
    ]
  },
  {
    "num": "0195",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "answer",
    "phonetic": "[ǽnsər]",
    "partOfSpeech": "動詞",
    "japanese": "(に)答える, (電話・訪問)(に)応じる、答え",
    "tip": "[読み: アンサァ] / カテゴリ: 動詞 / フレーズ例: answer a question (質問に答える)",
    "distractorsJa": [
      "(を)話す, 言う",
      "(を)訪問する, (を)訪れる、訪問, 見学",
      "(に)会う"
    ],
    "distractorsEn": [
      "tell",
      "visit",
      "meet"
    ],
    "sentenceEn": [
      "Can",
      "you",
      "answer",
      "the",
      "question?"
    ],
    "sentenceJa": "あなたはその質問に答えることができますか",
    "sentenceDistractors": [
      "the",
      "you"
    ]
  },
  {
    "num": "0196",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "stay",
    "phonetic": "[stei]",
    "partOfSpeech": "動詞",
    "japanese": "とどまる, 泊まる, 滞在する、滞在",
    "tip": "[読み: ステイ] / カテゴリ: 動詞",
    "distractorsJa": [
      "を見せる、展示会，ショー",
      "をためす，(〜しようと)努力する、試み",
      "(が)見える, に会う"
    ],
    "distractorsEn": [
      "show",
      "try",
      "see"
    ],
    "sentenceEn": [
      "Did",
      "you",
      "stay",
      "at",
      "a",
      "hotel",
      "in",
      "Seattle?"
    ],
    "sentenceJa": "シアトルではホテルに泊まりましたか",
    "sentenceDistractors": [
      "practice",
      "month"
    ]
  },
  {
    "num": "0197",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "live",
    "phonetic": "[liv]",
    "partOfSpeech": "動詞",
    "japanese": "住む, 暮らす",
    "tip": "[読み: リヴ] / カテゴリ: 動詞",
    "distractorsJa": [
      "を買う",
      "着く，到着する",
      "(を)呼ぶ，(に)電話する、電話をかけること"
    ],
    "distractorsEn": [
      "buy",
      "arrive",
      "call"
    ],
    "sentenceEn": [
      "Where",
      "does",
      "Mike",
      "live?"
    ],
    "sentenceJa": "マイクはどこに住んでいるのですか",
    "sentenceDistractors": [
      "child",
      "life"
    ]
  },
  {
    "num": "0198",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "wake",
    "phonetic": "[weik]",
    "partOfSpeech": "動詞",
    "japanese": "目が覚める, を起こす",
    "tip": "[読み: ウェイク] / カテゴリ: 動詞 / 類義/関連: 同意語:get up(起床する)",
    "distractorsJa": [
      "(を)話す, 演説する",
      "(を)飲む、飲み物",
      "を持ってくる，を連れてくる"
    ],
    "distractorsEn": [
      "speak",
      "drink",
      "bring"
    ],
    "sentenceEn": [
      "What",
      "time",
      "did",
      "you",
      "wake",
      "up",
      "this",
      "morning?"
    ],
    "sentenceJa": "(今朝は何時に目がさめましたか)",
    "sentenceDistractors": [
      "perhaps",
      "case"
    ]
  },
  {
    "num": "0199",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "work",
    "phonetic": "[wə́ːrk]",
    "partOfSpeech": "動詞",
    "japanese": "働く, 勉強する、仕事, 勉強, 作品",
    "tip": "[読み: ワーク] / カテゴリ: 動詞",
    "distractorsJa": [
      "(を)知っている",
      "(と)言う, 話す",
      "が聞こえる"
    ],
    "distractorsEn": [
      "know",
      "say",
      "hear"
    ],
    "sentenceEn": [
      "She",
      "works",
      "on",
      "a",
      "farm",
      "in",
      "Hokkaido."
    ],
    "sentenceJa": "彼女は北海道の農場で働いている",
    "sentenceDistractors": [
      "lot",
      "help"
    ]
  },
  {
    "num": "0200",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "eat",
    "phonetic": "[iːt]",
    "partOfSpeech": "動詞",
    "japanese": "(を)食べる",
    "tip": "[読み: イート] / カテゴリ: 動詞 / 類義/関連: 同意語:have(を食べる, を飲む)",
    "distractorsJa": [
      "(を)話す, 言う",
      "泳ぐ、泳ぐこと，水泳",
      "を見せる、展示会，ショー"
    ],
    "distractorsEn": [
      "tell",
      "swim",
      "show"
    ],
    "sentenceEn": [
      "I",
      "don't",
      "eat",
      "meat",
      "very",
      "often."
    ],
    "sentenceJa": "私はあまり頻繁には肉を食べない",
    "sentenceDistractors": [
      "show",
      "before"
    ]
  },
  {
    "num": "0201",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "drink",
    "phonetic": "dríŋk",
    "partOfSpeech": "動詞",
    "japanese": "(を)飲む、飲み物",
    "tip": "[読み: ドリンク] / カテゴリ: 動詞",
    "distractorsJa": [
      "をためす，(〜しようと)努力する、試み",
      "を楽しむ",
      "(を)読む"
    ],
    "distractorsEn": [
      "try",
      "enjoy",
      "read"
    ],
    "sentenceEn": [
      "Do",
      "you",
      "drink",
      "milk",
      "every",
      "day?"
    ],
    "sentenceJa": "あなたは毎日牛乳を飲みますか",
    "sentenceDistractors": [
      "speech",
      "between"
    ]
  },
  {
    "num": "0202",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "give",
    "phonetic": "gív",
    "partOfSpeech": "動詞",
    "japanese": "を与える，をあげる",
    "tip": "[読み: ギヴ] / カテゴリ: 動詞 / フレーズ例: give A B [give B to A] (AにBを与える)",
    "distractorsJa": [
      "を見せる、展示会，ショー",
      "(を)感じる，(と)思う",
      "(を)呼ぶ，(に)電話する、電話をかけること"
    ],
    "distractorsEn": [
      "show",
      "feel",
      "call"
    ],
    "sentenceEn": [
      "I'm",
      "going",
      "to",
      "give",
      "a",
      "book",
      "to",
      "him."
    ],
    "sentenceJa": "私は彼に本をあげるつもりだ",
    "sentenceDistractors": [
      "well",
      "than"
    ]
  },
  {
    "num": "0203",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "bring",
    "phonetic": "bríŋ",
    "partOfSpeech": "動詞",
    "japanese": "を持ってくる，を連れてくる",
    "tip": "[読み: ブリング] / カテゴリ: 動詞 / 類義/関連: 反意語:take(を持っていく，を連れていく)",
    "distractorsJa": [
      "(を)話す",
      "(を)食べる",
      "(を)洗う"
    ],
    "distractorsEn": [
      "talk",
      "eat",
      "wash"
    ],
    "sentenceEn": [
      "Can",
      "you",
      "bring",
      "some",
      "CDs",
      "to",
      "the",
      "party?"
    ],
    "sentenceJa": "パーティーにCDを持ってきてもらえますか。",
    "sentenceDistractors": [
      "hi",
      "nice"
    ]
  },
  {
    "num": "0204",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "love",
    "phonetic": "lʌ́v",
    "partOfSpeech": "動詞",
    "japanese": "を愛する，が大好きである、愛",
    "tip": "[読み: ラヴ] / カテゴリ: 動詞",
    "distractorsJa": [
      "働く, 勉強する、仕事, 勉強, 作品",
      "泳ぐ、泳ぐこと，水泳",
      "が聞こえる"
    ],
    "distractorsEn": [
      "work",
      "swim",
      "hear"
    ],
    "sentenceEn": [
      "I",
      "love",
      "Japanese",
      "food.",
      "It's",
      "delicious",
      "and",
      "healthy."
    ],
    "sentenceJa": "私は日本料理が大好きだ。おいしくて健康的だからだ。",
    "sentenceDistractors": [
      "ago",
      "club"
    ]
  },
  {
    "num": "0205",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "find",
    "phonetic": "fáind",
    "partOfSpeech": "動詞",
    "japanese": "を見つける",
    "tip": "[読み: ファインド] / カテゴリ: 動詞 / 類義/関連: 反意語:lose(をなくす)",
    "distractorsJa": [
      "(を)忘れる",
      "(を)教える",
      "を買う"
    ],
    "distractorsEn": [
      "forget",
      "teach",
      "buy"
    ],
    "sentenceEn": [
      "I",
      "can’t",
      "find",
      "my",
      "glasses",
      "anywhere."
    ],
    "sentenceJa": "私のめがねがどこにも見つからない",
    "sentenceDistractors": [
      "after",
      "lot"
    ]
  },
  {
    "num": "0206",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "need",
    "phonetic": "ní:d",
    "partOfSpeech": "動詞",
    "japanese": "を必要とする",
    "tip": "[読み: ニード] / カテゴリ: 動詞 / フレーズ例: need to do (〜する必要がある)",
    "distractorsJa": [
      "を望む，(〜だと)いいと思う",
      "を見つける",
      "着く，到着する"
    ],
    "distractorsEn": [
      "hope",
      "find",
      "arrive"
    ],
    "sentenceEn": [
      "We",
      "need",
      "a",
      "lot",
      "of",
      "money",
      "for",
      "the",
      "project."
    ],
    "sentenceJa": "私たちはその計画にたくさんのお金を必要とする",
    "sentenceDistractors": [
      "up",
      "every"
    ]
  },
  {
    "num": "0207",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "feel",
    "phonetic": "fí:l",
    "partOfSpeech": "動詞",
    "japanese": "(を)感じる，(と)思う",
    "tip": "[読み: フィール] / カテゴリ: 動詞 / フレーズ例: feel happy (幸せだと思う)",
    "distractorsJa": [
      "(絵の具で)をかく，にペンキをぬる",
      "走る",
      "(を)書く，(に)手紙を書く"
    ],
    "distractorsEn": [
      "paint",
      "run",
      "write"
    ],
    "sentenceEn": [
      "I",
      "felt",
      "angry",
      "when",
      "they",
      "broke",
      "the",
      "window."
    ],
    "sentenceJa": "彼らが窓を割ったとき, 私は怒りを感じた",
    "sentenceDistractors": [
      "today",
      "understand"
    ]
  },
  {
    "num": "0208",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "enjoy",
    "phonetic": "indʒɔ́i",
    "partOfSpeech": "動詞",
    "japanese": "を楽しむ",
    "tip": "[読み: インヂョイ] / カテゴリ: 動詞 / フレーズ例: enjoy doing (〜するのを楽しむ)",
    "distractorsJa": [
      "(に)加わる，参加する",
      "着く，到着する",
      "(を)訪問する, (を)訪れる、訪問, 見学"
    ],
    "distractorsEn": [
      "join",
      "arrive",
      "visit"
    ],
    "sentenceEn": [
      "We",
      "all",
      "enjoyed",
      "the",
      "concert",
      "last",
      "Sunday."
    ],
    "sentenceJa": "この前の日曜日，私たちはみんなコンサートを楽しんだ",
    "sentenceDistractors": [
      "question",
      "become"
    ]
  },
  {
    "num": "0209",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "finish",
    "phonetic": "fíniʃ",
    "partOfSpeech": "動詞",
    "japanese": "を終える，終わる",
    "tip": "[読み: フィニッシ] / カテゴリ: 動詞 / 類義/関連: 反意語:begin(を始める), 反意語:start(を始める) / フレーズ例: finish doing (〜し終える)",
    "distractorsJa": [
      "(が)見える, に会う",
      "(に)会う",
      "をためす，(〜しようと)努力する、試み"
    ],
    "distractorsEn": [
      "see",
      "meet",
      "try"
    ],
    "sentenceEn": [
      "When",
      "are",
      "you",
      "going",
      "to",
      "finish",
      "your",
      "homework?"
    ],
    "sentenceJa": "あなたはいつ宿題を終わらせるつもりですか",
    "sentenceDistractors": [
      "without",
      "earth"
    ]
  },
  {
    "num": "0210",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "lose",
    "phonetic": "lú:z",
    "partOfSpeech": "動詞",
    "japanese": "をなくす，(に)負ける",
    "tip": "[読み: ルーズ] / カテゴリ: 動詞 / 類義/関連: 反意語:find(を見つける), 反意語:win((に)勝つ) / メモ: 発音注意",
    "distractorsJa": [
      "を必要とする",
      "(を)読む",
      "(を)書く，(に)手紙を書く"
    ],
    "distractorsEn": [
      "need",
      "read",
      "write"
    ],
    "sentenceEn": [
      "The",
      "woman",
      "lost",
      "her",
      "son",
      "in",
      "the",
      "war."
    ],
    "sentenceJa": "その女性は戦争で息子を失った",
    "sentenceDistractors": [
      "wonderful",
      "someone"
    ]
  },
  {
    "num": "0211",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "write",
    "phonetic": "ráit",
    "partOfSpeech": "動詞",
    "japanese": "(を)書く，(に)手紙を書く",
    "tip": "[読み: ライト] / カテゴリ: 動詞 / 類義/関連: 関連語:writer(筆者，作家) / フレーズ例: write to 〜 (〜に手紙を書く)",
    "distractorsJa": [
      "を望む，(〜だと)いいと思う",
      "を必要とする",
      "を招待する"
    ],
    "distractorsEn": [
      "hope",
      "need",
      "invite"
    ],
    "sentenceEn": [
      "I'm",
      "going",
      "to",
      "write",
      "a",
      "letter",
      "to",
      "my",
      "uncle."
    ],
    "sentenceJa": "私はおじに手紙を書くつもりだ",
    "sentenceDistractors": [
      "call",
      "out"
    ]
  },
  {
    "num": "0212",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "forget",
    "phonetic": "fərgét",
    "partOfSpeech": "動詞",
    "japanese": "(を)忘れる",
    "tip": "[読み: フォゲット] / カテゴリ: 動詞 / 類義/関連: 反意語:remember((を)覚えている，(を)思い出す)",
    "distractorsJa": [
      "とどまる, 泊まる, 滞在する、滞在",
      "を持ってくる，を連れてくる",
      "を望む，(〜だと)いいと思う"
    ],
    "distractorsEn": [
      "stay",
      "bring",
      "hope"
    ],
    "sentenceEn": [
      "Don't",
      "forget",
      "to",
      "lock",
      "the",
      "door."
    ],
    "sentenceJa": "ドアにかぎをかけるのを忘れないで",
    "sentenceDistractors": [
      "cat",
      "graph"
    ]
  },
  {
    "num": "0213",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "swim",
    "phonetic": "swím",
    "partOfSpeech": "動詞",
    "japanese": "泳ぐ、泳ぐこと，水泳",
    "tip": "[読み: スウィム] / カテゴリ: 動詞",
    "distractorsJa": [
      "(注意して)聞く",
      "行く, 進む",
      "来る, (相手のほうへ)行く"
    ],
    "distractorsEn": [
      "listen",
      "go",
      "come"
    ],
    "sentenceEn": [
      "The",
      "students",
      "will",
      "swim",
      "in",
      "the",
      "pool",
      "tomorrow."
    ],
    "sentenceJa": "生徒たちは明日プールで泳ぐ",
    "sentenceDistractors": [
      "power",
      "welcome"
    ]
  },
  {
    "num": "0214",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "read",
    "phonetic": "rí:d",
    "partOfSpeech": "動詞",
    "japanese": "(を)読む",
    "tip": "[読み: リード] / カテゴリ: 動詞",
    "distractorsJa": [
      "を望む，(〜だと)いいと思う",
      "走る",
      "(を)洗う"
    ],
    "distractorsEn": [
      "hope",
      "run",
      "wash"
    ],
    "sentenceEn": [
      "I",
      "read",
      "a",
      "book",
      "on",
      "the",
      "train",
      "every",
      "day."
    ],
    "sentenceJa": "私は毎日列車の中で本を読む",
    "sentenceDistractors": [
      "start",
      "world"
    ]
  },
  {
    "num": "0215",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "paint",
    "phonetic": "péint",
    "partOfSpeech": "動詞",
    "japanese": "(絵の具で)をかく，にペンキをぬる",
    "tip": "[読み: ペイント] / カテゴリ: 動詞 / 類義/関連: 関連語:painting(絵，絵をかくこと)",
    "distractorsJa": [
      "を必要とする",
      "(を)書く，(に)手紙を書く",
      "住む, 暮らす"
    ],
    "distractorsEn": [
      "need",
      "write",
      "live"
    ],
    "sentenceEn": [
      "The",
      "students",
      "painted",
      "pictures",
      "in",
      "the",
      "park."
    ],
    "sentenceJa": "生徒たちは公園で絵を描いた",
    "sentenceDistractors": [
      "wind",
      "football"
    ]
  },
  {
    "num": "0216",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "cut",
    "phonetic": "kʌ́t",
    "partOfSpeech": "動詞",
    "japanese": "を切る",
    "tip": "[読み: カット] / カテゴリ: 動詞",
    "distractorsJa": [
      "(を)じっと見る、腕時計",
      "(を)書く，(に)手紙を書く",
      "を招待する"
    ],
    "distractorsEn": [
      "watch",
      "write",
      "invite"
    ],
    "sentenceEn": [
      "Jim",
      "cut",
      "his",
      "finger",
      "with",
      "a",
      "knife",
      "by",
      "accident."
    ],
    "sentenceJa": "ジムは誤ってナイフで自分の指を切った",
    "sentenceDistractors": [
      "research",
      "Monday"
    ]
  },
  {
    "num": "0217",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "run",
    "phonetic": "rʌ́n",
    "partOfSpeech": "動詞",
    "japanese": "走る",
    "tip": "[読み: ラン] / カテゴリ: 動詞 / 類義/関連: 類義語:jog(ジョギングをする) / フレーズ例: run away from 〜 (〜から逃げる)",
    "distractorsJa": [
      "来る, (相手のほうへ)行く",
      "(に)会う",
      "(を)訪問する, (を)訪れる、訪問, 見学"
    ],
    "distractorsEn": [
      "come",
      "meet",
      "visit"
    ],
    "sentenceEn": [
      "I",
      "run",
      "in",
      "the",
      "park",
      "every",
      "morning."
    ],
    "sentenceJa": "私は毎朝，公園で走る",
    "sentenceDistractors": [
      "young",
      "over"
    ]
  },
  {
    "num": "0218",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "call",
    "phonetic": "kɔ́:l",
    "partOfSpeech": "動詞",
    "japanese": "(を)呼ぶ，(に)電話する、電話をかけること",
    "tip": "[読み: コール] / カテゴリ: 動詞",
    "distractorsJa": [
      "泳ぐ、泳ぐこと，水泳",
      "(と)言う, 話す",
      "を見つける"
    ],
    "distractorsEn": [
      "swim",
      "say",
      "find"
    ],
    "sentenceEn": [
      "He",
      "called",
      "my",
      "name",
      "on",
      "the",
      "bus."
    ],
    "sentenceJa": "バスの中で彼は私の名前をよんだ",
    "sentenceDistractors": [
      "back",
      "water"
    ]
  },
  {
    "num": "0219",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "drive",
    "phonetic": "dráiv",
    "partOfSpeech": "動詞",
    "japanese": "(自動車など)を運転する、ドライブ",
    "tip": "[読み: ドライヴ] / カテゴリ: 動詞",
    "distractorsJa": [
      "(を)洗う",
      "(を)話す, 演説する",
      "を楽しむ"
    ],
    "distractorsEn": [
      "wash",
      "speak",
      "enjoy"
    ],
    "sentenceEn": [
      "My",
      "mother",
      "usually",
      "drives",
      "to",
      "the",
      "city",
      "for",
      "shopping."
    ],
    "sentenceJa": "母はたいてい車で街まで買い物に行く",
    "sentenceDistractors": [
      "ready",
      "customer"
    ]
  },
  {
    "num": "0220",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "ride",
    "phonetic": "ráid",
    "partOfSpeech": "動詞",
    "japanese": "(に)乗る、乗ること",
    "tip": "[読み: ライド] / カテゴリ: 動詞 / 類義/関連: 類義語:drive(車を運転する)",
    "distractorsJa": [
      "(を)訪問する, (を)訪れる、訪問, 見学",
      "(に)答える, (電話・訪問)(に)応じる、答え",
      "を見せる、展示会，ショー"
    ],
    "distractorsEn": [
      "visit",
      "answer",
      "show"
    ],
    "sentenceEn": [
      "I",
      "want",
      "to",
      "ride",
      "a",
      "motorcycle."
    ],
    "sentenceJa": "私はオートバイに乗りたい",
    "sentenceDistractors": [
      "poor",
      "return"
    ]
  },
  {
    "num": "0221",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "join",
    "phonetic": "dʒɔ́in",
    "partOfSpeech": "動詞",
    "japanese": "(に)加わる，参加する",
    "tip": "[読み: ヂョイン] / カテゴリ: 動詞",
    "distractorsJa": [
      "を持ってくる，を連れてくる",
      "(に)答える, (電話・訪問)(に)応じる、答え",
      "泳ぐ、泳ぐこと，水泳"
    ],
    "distractorsEn": [
      "bring",
      "answer",
      "swim"
    ],
    "sentenceEn": [
      "Why",
      "don’t",
      "you",
      "join",
      "the",
      "tennis",
      "team?"
    ],
    "sentenceJa": "テニスチームに加わりませんか",
    "sentenceDistractors": [
      "remember",
      "hi"
    ]
  },
  {
    "num": "0222",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "invite",
    "phonetic": "inváit",
    "partOfSpeech": "動詞",
    "japanese": "を招待する",
    "tip": "[読み: インヴァイト] / カテゴリ: 動詞 / フレーズ例: invite A to B (AをBに招待する)",
    "distractorsJa": [
      "を望む，(〜だと)いいと思う",
      "(が)見える, に会う",
      "(を)話す, 演説する"
    ],
    "distractorsEn": [
      "hope",
      "see",
      "speak"
    ],
    "sentenceEn": [
      "I",
      "invited",
      "Jun",
      "to",
      "my",
      "house."
    ],
    "sentenceJa": "私は家にジュンを招いた",
    "sentenceDistractors": [
      "symbol",
      "researcher"
    ]
  },
  {
    "num": "0223",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "know",
    "phonetic": "nóu",
    "partOfSpeech": "動詞",
    "japanese": "(を)知っている",
    "tip": "[読み: ノウ] / カテゴリ: 動詞 / メモ: 発音注意",
    "distractorsJa": [
      "(と)言う, 話す",
      "住む, 暮らす",
      "働く, 勉強する、仕事, 勉強, 作品"
    ],
    "distractorsEn": [
      "say",
      "live",
      "work"
    ],
    "sentenceEn": [
      "Do",
      "you",
      "know",
      "the",
      "name",
      "of",
      "that",
      "actor?"
    ],
    "sentenceJa": "あの俳優の名前を知っていますか",
    "sentenceDistractors": [
      "day",
      "come"
    ]
  },
  {
    "num": "0224",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "show",
    "phonetic": "ʃóu",
    "partOfSpeech": "動詞",
    "japanese": "を見せる、展示会，ショー",
    "tip": "[読み: ショウ] / カテゴリ: 動詞 / フレーズ例: show a map (地図を見せる)",
    "distractorsJa": [
      "心配する，を心配させる",
      "を持ってくる，を連れてくる",
      "を切る"
    ],
    "distractorsEn": [
      "worry",
      "bring",
      "cut"
    ],
    "sentenceEn": [
      "Kate",
      "showed",
      "me",
      "her",
      "pictures."
    ],
    "sentenceJa": "ケイトは私に写真を見せてくれた",
    "sentenceDistractors": [
      "high",
      "buy"
    ]
  },
  {
    "num": "0225",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "wash",
    "phonetic": "wɑ́(:)ʃ",
    "partOfSpeech": "動詞",
    "japanese": "(を)洗う",
    "tip": "[読み: ワ(ー)ッシ] / カテゴリ: 動詞",
    "distractorsJa": [
      "を手に入れる",
      "を招待する",
      "を必要とする"
    ],
    "distractorsEn": [
      "get",
      "invite",
      "need"
    ],
    "sentenceEn": [
      "Wash",
      "your",
      "hands",
      "before",
      "you",
      "eat."
    ],
    "sentenceJa": "食べる前に手を洗いなさい",
    "sentenceDistractors": [
      "level",
      "video"
    ]
  },
  {
    "num": "0226",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "teach",
    "phonetic": "tí:tʃ",
    "partOfSpeech": "動詞",
    "japanese": "(を)教える",
    "tip": "[読み: ティーチ] / カテゴリ: 動詞 / フレーズ例: teach A B [teach B to A] (AにBを教える)",
    "distractorsJa": [
      "を買う",
      "を見つける",
      "を終える，終わる"
    ],
    "distractorsEn": [
      "buy",
      "find",
      "finish"
    ],
    "sentenceEn": [
      "She",
      "teaches",
      "us",
      "English."
    ],
    "sentenceJa": "彼女は私たちに英語を教えている",
    "sentenceDistractors": [
      "even",
      "experience"
    ]
  },
  {
    "num": "0227",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "think",
    "phonetic": "θíŋk",
    "partOfSpeech": "動詞",
    "japanese": "(と)思う，考える",
    "tip": "[読み: スィンク] / カテゴリ: 動詞",
    "distractorsJa": [
      "(を)忘れる",
      "着く，到着する",
      "を見つける"
    ],
    "distractorsEn": [
      "forget",
      "arrive",
      "find"
    ],
    "sentenceEn": [
      "I",
      "think",
      "Kanazawa",
      "is",
      "a",
      "beautiful",
      "city."
    ],
    "sentenceJa": "私は金沢は美しい都市だと思う",
    "sentenceDistractors": [
      "like",
      "be"
    ]
  },
  {
    "num": "0228",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "hope",
    "phonetic": "hóup",
    "partOfSpeech": "動詞",
    "japanese": "を望む，(〜だと)いいと思う",
    "tip": "[読み: ホウプ] / カテゴリ: 動詞",
    "distractorsJa": [
      "走る",
      "(注意して)見る",
      "を招待する"
    ],
    "distractorsEn": [
      "run",
      "look",
      "invite"
    ],
    "sentenceEn": [
      "I",
      "hope",
      "to",
      "see",
      "you",
      "again",
      "soon."
    ],
    "sentenceJa": "またすぐにお会いしたいです",
    "sentenceDistractors": [
      "been",
      "library"
    ]
  },
  {
    "num": "0229",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "worry",
    "phonetic": "wə́:ri",
    "partOfSpeech": "動詞",
    "japanese": "心配する，を心配させる",
    "tip": "[読み: ワーリィ] / カテゴリ: 動詞",
    "distractorsJa": [
      "(を)書く，(に)手紙を書く",
      "(を)読む",
      "(を)食べる"
    ],
    "distractorsEn": [
      "write",
      "read",
      "eat"
    ],
    "sentenceEn": [
      "Don’t",
      "worry",
      "about",
      "me."
    ],
    "sentenceJa": "私のことは心配しないで",
    "sentenceDistractors": [
      "robot",
      "science"
    ]
  },
  {
    "num": "0230",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "try",
    "phonetic": "trái",
    "partOfSpeech": "動詞",
    "japanese": "をためす，(〜しようと)努力する、試み",
    "tip": "[読み: トゥライ] / カテゴリ: 動詞 / フレーズ例: try to do (〜しようと努力する)",
    "distractorsJa": [
      "目が覚める, を起こす",
      "(を)飲む、飲み物",
      "(を)呼ぶ，(に)電話する、電話をかけること"
    ],
    "distractorsEn": [
      "wake",
      "drink",
      "call"
    ],
    "sentenceEn": [
      "Ann",
      "tried",
      "to",
      "move",
      "the",
      "heavy",
      "table."
    ],
    "sentenceJa": "アンはその重いテーブルを動かそうとした",
    "sentenceDistractors": [
      "live",
      "something"
    ]
  },
  {
    "num": "0231",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "hurry",
    "phonetic": "hə́:ri",
    "partOfSpeech": "動詞",
    "japanese": "急ぐ，を急がせる、急ぎ",
    "tip": "[読み: ハーリィ] / カテゴリ: 動詞 / フレーズ例: Hurry up. (急いで。)",
    "distractorsJa": [
      "(を)話す",
      "を楽しむ",
      "を買う"
    ],
    "distractorsEn": [
      "talk",
      "enjoy",
      "buy"
    ],
    "sentenceEn": [
      "Hurry",
      "up,",
      "or",
      "you'll",
      "be",
      "late",
      "for",
      "school."
    ],
    "sentenceJa": "(急いで, でないと学校に遅れますよ)",
    "sentenceDistractors": [
      "tool",
      "treasure"
    ]
  },
  {
    "num": "0232",
    "level": 4,
    "stageSlug": "eiken4_stage04",
    "english": "arrive",
    "phonetic": "əráiv",
    "partOfSpeech": "動詞",
    "japanese": "着く，到着する",
    "tip": "[読み: アライヴ] / カテゴリ: 動詞 / 類義/関連: 類義語:reach(に着く) / フレーズ例: arrive at 〜 (〜に着く)",
    "distractorsJa": [
      "を見せる、展示会，ショー",
      "行く, 進む",
      "を必要とする"
    ],
    "distractorsEn": [
      "show",
      "go",
      "need"
    ],
    "sentenceEn": [
      "We",
      "have",
      "to",
      "arrive",
      "at",
      "the",
      "station",
      "by",
      "ten",
      "o’clock."
    ],
    "sentenceJa": "私たちは10時までに駅に到着しなければならない",
    "sentenceDistractors": [
      "United States",
      "Mrs."
    ]
  },
  {
    "num": "0233",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "wear",
    "phonetic": "wɛ́ər",
    "partOfSpeech": "動詞",
    "japanese": "を着ている，を身につけている、衣服",
    "tip": "[読み: ウェア] / カテゴリ: 動詞 / 類義/関連: 類義語:put on 〜((動作として)〜を身につける)",
    "distractorsJa": [
      "を売る",
      "になる",
      "を変える，変わる、変化，おつり"
    ],
    "distractorsEn": [
      "sell",
      "become",
      "change"
    ],
    "sentenceEn": [
      "You",
      "should",
      "wear",
      "a",
      "hat",
      "in",
      "the",
      "strong",
      "sunlight."
    ],
    "sentenceJa": "強い日ざしの中では帽子をかぶるべきだ",
    "sentenceDistractors": [
      "junior high school",
      "glad"
    ]
  },
  {
    "num": "0234",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "change",
    "phonetic": "tʃéindʒ",
    "partOfSpeech": "動詞",
    "japanese": "を変える，変わる、変化，おつり",
    "tip": "[読み: チェインヂ] / カテゴリ: 動詞",
    "distractorsJa": [
      "をまわす，まわる、回転，順番",
      "(を)歌う",
      "をつかまえる"
    ],
    "distractorsEn": [
      "turn",
      "sing",
      "catch"
    ],
    "sentenceEn": [
      "We",
      "changed",
      "our",
      "plans",
      "for",
      "this",
      "summer."
    ],
    "sentenceJa": "私たちは今年の夏の計画を変えた",
    "sentenceDistractors": [
      "beautiful",
      "name"
    ]
  },
  {
    "num": "0235",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "become",
    "phonetic": "bikʌ́m",
    "partOfSpeech": "動詞",
    "japanese": "になる",
    "tip": "[読み: ビカム] / カテゴリ: 動詞",
    "distractorsJa": [
      "を置く",
      "をやめる，止まる、中止，停留所",
      "をこわす，を折る，こわれる、休憩"
    ],
    "distractorsEn": [
      "put",
      "stop",
      "break"
    ],
    "sentenceEn": [
      "He",
      "studied",
      "hard",
      "to",
      "become",
      "a",
      "scientist."
    ],
    "sentenceJa": "彼は科学者になるために熱心に勉強した",
    "sentenceDistractors": [
      "thank",
      "child"
    ]
  },
  {
    "num": "0236",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "catch",
    "phonetic": "kætʃ",
    "partOfSpeech": "動詞",
    "japanese": "をつかまえる",
    "tip": "[読み: キャッチ] / カテゴリ: 動詞",
    "distractorsJa": [
      "(を)歌う",
      "を変える，変わる、変化，おつり",
      "を着ている，を身につけている、衣服"
    ],
    "distractorsEn": [
      "sing",
      "change",
      "wear"
    ],
    "sentenceEn": [
      "We",
      "can",
      "catch",
      "fish",
      "with",
      "our",
      "hands",
      "in",
      "that",
      "river."
    ],
    "sentenceJa": "その川で私たちは手で魚をつかまえることができる",
    "sentenceDistractors": [
      "sun",
      "nothing"
    ]
  },
  {
    "num": "0237",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "put",
    "phonetic": "pút",
    "partOfSpeech": "動詞",
    "japanese": "を置く",
    "tip": "[読み: プット] / カテゴリ: 動詞",
    "distractorsJa": [
      "を売る",
      "を変える，変わる、変化，おつり",
      "をこわす，を折る，こわれる、休憩"
    ],
    "distractorsEn": [
      "sell",
      "change",
      "break"
    ],
    "sentenceEn": [
      "My",
      "mother",
      "put",
      "her",
      "keys",
      "on",
      "the",
      "table."
    ],
    "sentenceJa": "母は，かぎをテーブルの上に置いた",
    "sentenceDistractors": [
      "another",
      "decide"
    ]
  },
  {
    "num": "0238",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "order",
    "phonetic": "ɔ́:rdər",
    "partOfSpeech": "動詞",
    "japanese": "を注文する、注文",
    "tip": "[読み: オーダァ] / カテゴリ: 動詞",
    "distractorsJa": [
      "になる",
      "を売る",
      "を変える，変わる、変化，おつり"
    ],
    "distractorsEn": [
      "become",
      "sell",
      "change"
    ],
    "sentenceEn": [
      "May",
      "I",
      "take",
      "your",
      "order?"
    ],
    "sentenceJa": "ご注文は何になさいますか",
    "sentenceDistractors": [
      "concert",
      "type"
    ]
  },
  {
    "num": "0239",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "sell",
    "phonetic": "sél",
    "partOfSpeech": "動詞",
    "japanese": "を売る",
    "tip": "[読み: セル] / カテゴリ: 動詞 / 類義/関連: 反意語:buy(を買う)",
    "distractorsJa": [
      "をつかまえる",
      "をまわす，まわる、回転，順番",
      "を置く"
    ],
    "distractorsEn": [
      "catch",
      "turn",
      "put"
    ],
    "sentenceEn": [
      "They",
      "sell",
      "sandwiches",
      "and",
      "drinks",
      "at",
      "the",
      "store."
    ],
    "sentenceJa": "その店ではサンドイッチと飲み物を売っている",
    "sentenceDistractors": [
      "blue",
      "classmate"
    ]
  },
  {
    "num": "0240",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "stop",
    "phonetic": "stɑ́(:)p",
    "partOfSpeech": "動詞",
    "japanese": "をやめる，止まる、中止，停留所",
    "tip": "[読み: スタ(ー)ップ] / カテゴリ: 動詞",
    "distractorsJa": [
      "を着ている，を身につけている、衣服",
      "落ちる，転ぶ、落ちること，秋",
      "を注文する、注文"
    ],
    "distractorsEn": [
      "wear",
      "fall",
      "order"
    ],
    "sentenceEn": [
      "My",
      "uncle",
      "stopped",
      "his",
      "car",
      "in",
      "front",
      "of",
      "my",
      "house."
    ],
    "sentenceJa": "おじは私の家の前で車を止めた",
    "sentenceDistractors": [
      "clean",
      "even"
    ]
  },
  {
    "num": "0241",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "sing",
    "phonetic": "síŋ",
    "partOfSpeech": "動詞",
    "japanese": "(を)歌う",
    "tip": "[読み: スィング] / カテゴリ: 動詞",
    "distractorsJa": [
      "を置く",
      "をつかまえる",
      "をやめる，止まる、中止，停留所"
    ],
    "distractorsEn": [
      "put",
      "catch",
      "stop"
    ],
    "sentenceEn": [
      "Tom",
      "likes",
      "to",
      "sing",
      "Japanese",
      "popular",
      "songs."
    ],
    "sentenceJa": "トムは日本の流行歌を歌うのが好きだ",
    "sentenceDistractors": [
      "between",
      "watch"
    ]
  },
  {
    "num": "0242",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "break",
    "phonetic": "bréik",
    "partOfSpeech": "動詞",
    "japanese": "をこわす，を折る，こわれる、休憩",
    "tip": "[読み: ブレイク] / カテゴリ: 動詞",
    "distractorsJa": [
      "を着ている，を身につけている、衣服",
      "落ちる，転ぶ、落ちること，秋",
      "をつかまえる"
    ],
    "distractorsEn": [
      "wear",
      "fall",
      "catch"
    ],
    "sentenceEn": [
      "Did",
      "your",
      "sister",
      "break",
      "the",
      "clock?"
    ],
    "sentenceJa": "あなたの妹はその時計をこわしたのですか",
    "sentenceDistractors": [
      "reason",
      "traditional"
    ]
  },
  {
    "num": "0243",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "fall",
    "phonetic": "fɔ́:l",
    "partOfSpeech": "動詞",
    "japanese": "落ちる，転ぶ、落ちること，秋",
    "tip": "[読み: フォーる] / カテゴリ: 動詞",
    "distractorsJa": [
      "をつかまえる",
      "をまわす，まわる、回転，順番",
      "(を)歌う"
    ],
    "distractorsEn": [
      "catch",
      "turn",
      "sing"
    ],
    "sentenceEn": [
      "The",
      "leaves",
      "of",
      "this",
      "tree",
      "fall",
      "around",
      "November."
    ],
    "sentenceJa": "この木の葉は11月ごろに落ちる",
    "sentenceDistractors": [
      "stand",
      "winter"
    ]
  },
  {
    "num": "0244",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "turn",
    "phonetic": "tə́:rn",
    "partOfSpeech": "動詞",
    "japanese": "をまわす，まわる、回転，順番",
    "tip": "[読み: ターン] / カテゴリ: 動詞",
    "distractorsJa": [
      "(を)歌う",
      "落ちる，転ぶ、落ちること，秋",
      "を着ている，を身につけている、衣服"
    ],
    "distractorsEn": [
      "sing",
      "fall",
      "wear"
    ],
    "sentenceEn": [
      "The",
      "boy",
      "wasn’t",
      "able",
      "to",
      "turn",
      "the",
      "bottle",
      "cap."
    ],
    "sentenceJa": "その男の子はびんのふたを回すことができなかった",
    "sentenceDistractors": [
      "worry",
      "activity"
    ]
  },
  {
    "num": "0245",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "last",
    "phonetic": "lǽst",
    "partOfSpeech": "形容詞",
    "japanese": "最後の，この前の、最後に，この前",
    "tip": "[読み: ラスト] / カテゴリ: 形容詞 / 類義/関連: 反意語:next(今度の)",
    "distractorsJa": [
      "幸福な、楽しい、うれしい",
      "すまないと思って、気の毒で",
      "用意ができて"
    ],
    "distractorsEn": [
      "happy",
      "sorry",
      "ready"
    ],
    "sentenceEn": [
      "Today",
      "is",
      "the",
      "last",
      "day",
      "of",
      "the",
      "year."
    ],
    "sentenceJa": "今日は１年の最後の日だ",
    "sentenceDistractors": [
      "picture",
      "different"
    ]
  },
  {
    "num": "0246",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "first",
    "phonetic": "fə́:rst",
    "partOfSpeech": "形容詞",
    "japanese": "第1の，最初の、第1に，最初に",
    "tip": "[読み: ファースト] / カテゴリ: 形容詞",
    "distractorsJa": [
      "いとしい、親愛なる、(手紙の書き出しで)〜様",
      "(時間・時期が)遅い，遅れた、遅く，遅れて",
      "すまないと思って、気の毒で"
    ],
    "distractorsEn": [
      "dear",
      "late",
      "sorry"
    ],
    "sentenceEn": [
      "My",
      "first",
      "class",
      "on",
      "Monday",
      "is",
      "social",
      "studies."
    ],
    "sentenceJa": "月曜日の私の最初の授業は社会科だ",
    "sentenceDistractors": [
      "learn",
      "book"
    ]
  },
  {
    "num": "0247",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "good",
    "phonetic": "gúd",
    "partOfSpeech": "形容詞",
    "japanese": "よい，おいしい，親切な，楽しい，じょうずな",
    "tip": "[読み: グッド] / カテゴリ: 形容詞",
    "distractorsJa": [
      "暗い、(色が)濃い、黒っぽい",
      "自分自身の",
      "短い、背の低い"
    ],
    "distractorsEn": [
      "dark",
      "own",
      "short"
    ],
    "sentenceEn": [
      "I",
      "have",
      "some",
      "good",
      "news."
    ],
    "sentenceJa": "よい知らせがあります",
    "sentenceDistractors": [
      "their",
      "look"
    ]
  },
  {
    "num": "0248",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "bad",
    "phonetic": "bǽd",
    "partOfSpeech": "形容詞",
    "japanese": "悪い",
    "tip": "[読み: バッド] / カテゴリ: 形容詞",
    "distractorsJa": [
      "暗い、(色が)濃い、黒っぽい",
      "遅い、のろい、ゆっくりと",
      "注意深い"
    ],
    "distractorsEn": [
      "dark",
      "slow",
      "careful"
    ],
    "sentenceEn": [
      "Too",
      "much",
      "sugar",
      "is",
      "bad",
      "for",
      "your",
      "health."
    ],
    "sentenceJa": "砂糖の取りすぎは健康に悪い",
    "sentenceDistractors": [
      "Sunday",
      "flower"
    ]
  },
  {
    "num": "0249",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "late",
    "phonetic": "léit",
    "partOfSpeech": "形容詞",
    "japanese": "(時間・時期が)遅い，遅れた、遅く，遅れて",
    "tip": "[読み: レイト] / カテゴリ: 形容詞",
    "distractorsJa": [
      "悪い",
      "かわいい",
      "速い、速く"
    ],
    "distractorsEn": [
      "bad",
      "cute",
      "fast"
    ],
    "sentenceEn": [
      "My",
      "train",
      "was",
      "late",
      "because",
      "of",
      "snow."
    ],
    "sentenceJa": "私の列車は雪で遅れた",
    "sentenceDistractors": [
      "weekend",
      "area"
    ]
  },
  {
    "num": "0250",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "early",
    "phonetic": "ə́:rli",
    "partOfSpeech": "形容詞",
    "japanese": "早い，初期の、早く",
    "tip": "[読み: アーリィ] / カテゴリ: 形容詞",
    "distractorsJa": [
      "運のよい、幸運な",
      "難しい、かたい、熱心な、一生けんめいに、激しく",
      "暗い、(色が)濃い、黒っぽい"
    ],
    "distractorsEn": [
      "lucky",
      "hard",
      "dark"
    ],
    "sentenceEn": [
      "I",
      "can't",
      "get",
      "up",
      "early",
      "in",
      "the",
      "morning."
    ],
    "sentenceJa": "私は朝早く起きられない",
    "sentenceDistractors": [
      "afternoon",
      "doctor"
    ]
  },
  {
    "num": "0251",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "fast",
    "phonetic": "[fæst]",
    "partOfSpeech": "形容詞",
    "japanese": "速い、速く",
    "tip": "[読み: ファスト] / カテゴリ: 形容詞",
    "distractorsJa": [
      "有名な",
      "自分自身の",
      "難しい、かたい、熱心な、一生けんめいに、激しく"
    ],
    "distractorsEn": [
      "famous",
      "own",
      "hard"
    ],
    "sentenceEn": [
      "Sue",
      "is",
      "a",
      "fast",
      "runner."
    ],
    "sentenceJa": "スーは走るのが速い",
    "sentenceDistractors": [
      "doctor",
      "leave"
    ]
  },
  {
    "num": "0252",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "slow",
    "phonetic": "[slou]",
    "partOfSpeech": "形容詞",
    "japanese": "遅い、のろい、ゆっくりと",
    "tip": "[読み: スロウ] / カテゴリ: 形容詞",
    "distractorsJa": [
      "空腹の、おなかがすいた",
      "自由な、ひまな、無料の",
      "暖かい"
    ],
    "distractorsEn": [
      "hungry",
      "free",
      "warm"
    ],
    "sentenceEn": [
      "The",
      "traffic",
      "was",
      "slow",
      "yesterday."
    ],
    "sentenceJa": "(昨日は交通の速度がゆっくりだった)",
    "sentenceDistractors": [
      "data",
      "raise"
    ]
  },
  {
    "num": "0253",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "favorite",
    "phonetic": "[féiv(ə)rət]",
    "partOfSpeech": "形容詞",
    "japanese": "大好きな、お気に入りの、お気に入り",
    "tip": "[読み: フェイヴ(ァ)リット] / カテゴリ: 形容詞",
    "distractorsJa": [
      "悪い",
      "役に立つ",
      "静かな"
    ],
    "distractorsEn": [
      "bad",
      "useful",
      "quiet"
    ],
    "sentenceEn": [
      "This",
      "is",
      "my",
      "favorite",
      "shirt."
    ],
    "sentenceJa": "これは私のお気に入りのシャツだ",
    "sentenceDistractors": [
      "activity",
      "grandfather"
    ]
  },
  {
    "num": "0254",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "happy",
    "phonetic": "[hǽpi]",
    "partOfSpeech": "形容詞",
    "japanese": "幸福な、楽しい、うれしい",
    "tip": "[読み: ハピィ] / カテゴリ: 形容詞 / 類義/関連: 関連語:happiness(幸福), 反意語:unhappy(不幸な)",
    "distractorsJa": [
      "悪い",
      "病気の、病気で",
      "特別の"
    ],
    "distractorsEn": [
      "bad",
      "sick",
      "special"
    ],
    "sentenceEn": [
      "Aya",
      "looked",
      "happy",
      "when",
      "I",
      "met",
      "her",
      "yesterday."
    ],
    "sentenceJa": "昨日会ったとき, アヤは幸せそうだった",
    "sentenceDistractors": [
      "world",
      "up"
    ]
  },
  {
    "num": "0255",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "lucky",
    "phonetic": "[lʌ́ki]",
    "partOfSpeech": "形容詞",
    "japanese": "運のよい、幸運な",
    "tip": "[読み: ラキィ] / カテゴリ: 形容詞",
    "distractorsJa": [
      "(時間・時期が)遅い，遅れた、遅く，遅れて",
      "短い、背の低い",
      "空腹の、おなかがすいた"
    ],
    "distractorsEn": [
      "late",
      "short",
      "hungry"
    ],
    "sentenceEn": [
      "We",
      "were",
      "lucky",
      "to",
      "get",
      "tickets",
      "for",
      "the",
      "movie."
    ],
    "sentenceJa": "その映画のチケットが取れて私たちは運がよかった",
    "sentenceDistractors": [
      "global",
      "public"
    ]
  },
  {
    "num": "0256",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "free",
    "phonetic": "[friː]",
    "partOfSpeech": "形容詞",
    "japanese": "自由な、ひまな、無料の",
    "tip": "[読み: フリー] / カテゴリ: 形容詞 / 類義/関連: 反意語:busy(忙しい)",
    "distractorsJa": [
      "遅い、のろい、ゆっくりと",
      "よい，おいしい，親切な，楽しい，じょうずな",
      "太陽の照っている"
    ],
    "distractorsEn": [
      "slow",
      "good",
      "sunny"
    ],
    "sentenceEn": [
      "Let’s",
      "watch",
      "this",
      "DVD",
      "if",
      "you",
      "are",
      "free",
      "tomorrow."
    ],
    "sentenceJa": "もし明日ひまなら，このDVDを見よう。",
    "sentenceDistractors": [
      "forget",
      "already"
    ]
  },
  {
    "num": "0257",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "next",
    "phonetic": "[nekst]",
    "partOfSpeech": "形容詞",
    "japanese": "次の、今度の、次に",
    "tip": "[読み: ネクスト] / カテゴリ: 形容詞 / 類義/関連: 反意語:last(この前の) / フレーズ例: next to 〜 (〜のとなりに)",
    "distractorsJa": [
      "よい，おいしい，親切な，楽しい，じょうずな",
      "最後の，この前の、最後に，この前",
      "遅い、のろい、ゆっくりと"
    ],
    "distractorsEn": [
      "good",
      "last",
      "slow"
    ],
    "sentenceEn": [
      "I'll",
      "return",
      "your",
      "book",
      "next",
      "weekend."
    ],
    "sentenceJa": "次の週末にあなたの本を返します",
    "sentenceDistractors": [
      "much",
      "right"
    ]
  },
  {
    "num": "0258",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "all",
    "phonetic": "[ɔːl]",
    "partOfSpeech": "形容詞",
    "japanese": "すべての、すべてのもの",
    "tip": "[読み: オール] / カテゴリ: 形容詞 / フレーズ例: all of 〜 (〜のうちのすべて)",
    "distractorsJa": [
      "暗い、(色が)濃い、黒っぽい",
      "いとしい、親愛なる、(手紙の書き出しで)〜様",
      "ちがった、異なる、いろいろな"
    ],
    "distractorsEn": [
      "dark",
      "dear",
      "different"
    ],
    "sentenceEn": [
      "All",
      "the",
      "students",
      "are",
      "looking",
      "forward",
      "to",
      "seeing",
      "him."
    ],
    "sentenceJa": "生徒全員が彼に会うのを楽しみにしている",
    "sentenceDistractors": [
      "if",
      "or"
    ]
  },
  {
    "num": "0259",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "half",
    "phonetic": "[hæf]",
    "partOfSpeech": "形容詞",
    "japanese": "半分の、半分、2分の1",
    "tip": "[読み: ハフ] / カテゴリ: 形容詞 / フレーズ例: half of 〜 (〜の半分)",
    "distractorsJa": [
      "かわいい",
      "小さい",
      "特別の"
    ],
    "distractorsEn": [
      "cute",
      "small",
      "special"
    ],
    "sentenceEn": [
      "I've",
      "read",
      "almost",
      "half",
      "of",
      "the",
      "books",
      "in",
      "the",
      "library."
    ],
    "sentenceJa": "私は図書館の本のほぼ半分を読んだ",
    "sentenceDistractors": [
      "farm",
      "test"
    ]
  },
  {
    "num": "0260",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "fine",
    "phonetic": "[fain]",
    "partOfSpeech": "形容詞",
    "japanese": "すばらしい、晴れた、健康で",
    "tip": "[読み: ファイン] / カテゴリ: 形容詞",
    "distractorsJa": [
      "第1の，最初の、第1に，最初に",
      "小さい",
      "暗い、(色が)濃い、黒っぽい"
    ],
    "distractorsEn": [
      "first",
      "small",
      "dark"
    ],
    "sentenceEn": [
      "How’s",
      "your",
      "sister?",
      "—",
      "She’s",
      "fine,",
      "thanks."
    ],
    "sentenceJa": "お姉さんはお元気ですか。— 元気です，ありがとう",
    "sentenceDistractors": [
      "point",
      "agree"
    ]
  },
  {
    "num": "0261",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "sick",
    "phonetic": "[sik]",
    "partOfSpeech": "形容詞",
    "japanese": "病気の、病気で",
    "tip": "[読み: スィック] / カテゴリ: 形容詞 / 類義/関連: 反意語:well(健康で)",
    "distractorsJa": [
      "人気のある、流行の",
      "半分の、半分、2分の1",
      "運のよい、幸運な"
    ],
    "distractorsEn": [
      "popular",
      "half",
      "lucky"
    ],
    "sentenceEn": [
      "My",
      "sister",
      "got",
      "sick",
      "during",
      "the",
      "trip."
    ],
    "sentenceJa": "妹は旅行中に病気になった",
    "sentenceDistractors": [
      "warm",
      "machine"
    ]
  },
  {
    "num": "0262",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "hungry",
    "phonetic": "[hʌ́ŋgri]",
    "partOfSpeech": "形容詞",
    "japanese": "空腹の、おなかがすいた",
    "tip": "[読み: ハングリィ] / カテゴリ: 形容詞 / 類義/関連: 反意語:full(満腹で、おなかがいっぱいで)",
    "distractorsJa": [
      "注意深い",
      "病気の、病気で",
      "運のよい、幸運な"
    ],
    "distractorsEn": [
      "careful",
      "sick",
      "lucky"
    ],
    "sentenceEn": [
      "I",
      "was",
      "very",
      "hungry",
      "before",
      "lunch."
    ],
    "sentenceJa": "私は，昼食の前にはとても空腹だった",
    "sentenceDistractors": [
      "egg",
      "behind"
    ]
  },
  {
    "num": "0263",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "sorry",
    "phonetic": "[sɑ́(:)ri]",
    "partOfSpeech": "形容詞",
    "japanese": "すまないと思って、気の毒で",
    "tip": "[読み: サ(ー)リィ] / カテゴリ: 形容詞",
    "distractorsJa": [
      "速い、速く",
      "非常においしい",
      "病気の、病気で"
    ],
    "distractorsEn": [
      "fast",
      "delicious",
      "sick"
    ],
    "sentenceEn": [
      "I'm",
      "sorry.",
      "I",
      "didn't",
      "notice",
      "you",
      "were",
      "here."
    ],
    "sentenceJa": "ごめんなさい。あなたがここにいるとは気づかなかった",
    "sentenceDistractors": [
      "surprised",
      "music"
    ]
  },
  {
    "num": "0264",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "near",
    "phonetic": "[niər]",
    "partOfSpeech": "形容詞",
    "japanese": "(距離・時間が)近い、近くに",
    "tip": "[読み: ニア] / カテゴリ: 形容詞 / 類義/関連: 反意語:far(遠い)",
    "distractorsJa": [
      "ちがった、異なる、いろいろな",
      "幸福な、楽しい、うれしい",
      "太陽の照っている"
    ],
    "distractorsEn": [
      "different",
      "happy",
      "sunny"
    ],
    "sentenceEn": [
      "Is",
      "there",
      "a",
      "bank",
      "near",
      "here?"
    ],
    "sentenceJa": "この近くに銀行はありますか。",
    "sentenceDistractors": [
      "park",
      "such"
    ]
  },
  {
    "num": "0265",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "ready",
    "phonetic": "[rédi]",
    "partOfSpeech": "形容詞",
    "japanese": "用意ができて",
    "tip": "[読み: レディ] / カテゴリ: 形容詞 / フレーズ例: be ready to do (〜する用意ができている)",
    "distractorsJa": [
      "特別の",
      "美しい、すばらしい",
      "自由な、ひまな、無料の"
    ],
    "distractorsEn": [
      "special",
      "beautiful",
      "free"
    ],
    "sentenceEn": [
      "Are",
      "you",
      "ready",
      "to",
      "play",
      "against",
      "the",
      "champion?"
    ],
    "sentenceJa": "チャンピオンと対戦する準備はできていますか",
    "sentenceDistractors": [
      "hungry",
      "friendly"
    ]
  },
  {
    "num": "0266",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "open",
    "phonetic": "[óup(ə)n]",
    "partOfSpeech": "形容詞",
    "japanese": "開いた、を開ける、開く",
    "tip": "[読み: オウプン] / カテゴリ: 形容詞",
    "distractorsJa": [
      "運のよい、幸運な",
      "空腹の、おなかがすいた",
      "役に立つ"
    ],
    "distractorsEn": [
      "lucky",
      "hungry",
      "useful"
    ],
    "sentenceEn": [
      "Shall",
      "I",
      "open",
      "the",
      "window?"
    ],
    "sentenceJa": "窓を開けましょうか",
    "sentenceDistractors": [
      "museum",
      "group"
    ]
  },
  {
    "num": "0267",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "famous",
    "phonetic": "[féiməs]",
    "partOfSpeech": "形容詞",
    "japanese": "有名な",
    "tip": "[読み: フェイマス] / カテゴリ: 形容詞 / フレーズ例: be famous for 〜 (〜で有名だ)",
    "distractorsJa": [
      "おもしろい、興味深い",
      "病気の、病気で",
      "役に立つ"
    ],
    "distractorsEn": [
      "interesting",
      "sick",
      "useful"
    ],
    "sentenceEn": [
      "Shizuoka",
      "is",
      "famous",
      "for",
      "its",
      "tea."
    ],
    "sentenceJa": "静岡はお茶で有名だ",
    "sentenceDistractors": [
      "paper",
      "lose"
    ]
  },
  {
    "num": "0268",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "popular",
    "phonetic": "[pɑ́(:)pjʊlər]",
    "partOfSpeech": "形容詞",
    "japanese": "人気のある、流行の",
    "tip": "[読み: パ(ー)ピュラァ] / カテゴリ: 形容詞 / フレーズ例: be popular among [with] 〜 (〜の間で人気がある)",
    "distractorsJa": [
      "遅い、のろい、ゆっくりと",
      "第1の，最初の、第1に，最初に",
      "早い，初期の、早く"
    ],
    "distractorsEn": [
      "slow",
      "first",
      "early"
    ],
    "sentenceEn": [
      "That",
      "song",
      "was",
      "popular",
      "some",
      "years",
      "ago."
    ],
    "sentenceJa": "その曲は数年前に人気があった",
    "sentenceDistractors": [
      "however",
      "festival"
    ]
  },
  {
    "num": "0269",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "small",
    "phonetic": "[smɔːl]",
    "partOfSpeech": "形容詞",
    "japanese": "小さい",
    "tip": "[読み: スモール] / カテゴリ: 形容詞 / 類義/関連: 同意語:little((小さくて)かわいらしい), 反意語:big(大きい), 反意語:large(大きい)",
    "distractorsJa": [
      "悪い",
      "くもった",
      "雪の降る、雪の積もった"
    ],
    "distractorsEn": [
      "bad",
      "cloudy",
      "snowy"
    ],
    "sentenceEn": [
      "Ayako",
      "has",
      "a",
      "small",
      "white",
      "dog."
    ],
    "sentenceJa": "アヤコは小さな白いイヌを飼っている",
    "sentenceDistractors": [
      "problem",
      "teacher"
    ]
  },
  {
    "num": "0270",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "short",
    "phonetic": "[ʃɔːrt]",
    "partOfSpeech": "形容詞",
    "japanese": "短い、背の低い",
    "tip": "[読み: ショート] / カテゴリ: 形容詞 / 類義/関連: 反意語:long(長い), 反意語:tall(背の高い)",
    "distractorsJa": [
      "高価な",
      "(時間・時期が)遅い，遅れた、遅く，遅れて",
      "特別の"
    ],
    "distractorsEn": [
      "expensive",
      "late",
      "special"
    ],
    "sentenceEn": [
      "The",
      "girl",
      "with",
      "short",
      "hair",
      "over",
      "there",
      "is",
      "Kate."
    ],
    "sentenceJa": "あそこにいる短い髪の女の子はケイトだ",
    "sentenceDistractors": [
      "fact",
      "basketball"
    ]
  },
  {
    "num": "0271",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "beautiful",
    "phonetic": "[bjúːtəf(ə)l]",
    "partOfSpeech": "形容詞",
    "japanese": "美しい、すばらしい",
    "tip": "[読み: ビューティフル] / カテゴリ: 形容詞",
    "distractorsJa": [
      "早い，初期の、早く",
      "暗い、(色が)濃い、黒っぽい",
      "遅い、のろい、ゆっくりと"
    ],
    "distractorsEn": [
      "early",
      "dark",
      "slow"
    ],
    "sentenceEn": [
      "Look",
      "at",
      "those",
      "beautiful",
      "flowers."
    ],
    "sentenceJa": "あの美しい花を見てごらん",
    "sentenceDistractors": [
      "OK / O.K.",
      "example"
    ]
  },
  {
    "num": "0272",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "cute",
    "phonetic": "[kjuːt]",
    "partOfSpeech": "形容詞",
    "japanese": "かわいい",
    "tip": "[読み: キュート] / カテゴリ: 形容詞 / 類義/関連: 同意語:pretty(きれいな、かわいらしい)",
    "distractorsJa": [
      "すべての、すべてのもの",
      "空腹の、おなかがすいた",
      "他の、別の、他の物、他の人"
    ],
    "distractorsEn": [
      "all",
      "hungry",
      "other"
    ],
    "sentenceEn": [
      "You",
      "have",
      "a",
      "cute",
      "dog!"
    ],
    "sentenceJa": "(かわいいイヌを飼っているね！)",
    "sentenceDistractors": [
      "cow",
      "hurt"
    ]
  },
  {
    "num": "0273",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "sunny",
    "phonetic": "[sʌ́ni]",
    "partOfSpeech": "形容詞",
    "japanese": "太陽の照っている",
    "tip": "[読み: サニィ] / カテゴリ: 形容詞",
    "distractorsJa": [
      "幸福な、楽しい、うれしい",
      "特別の",
      "難しい"
    ],
    "distractorsEn": [
      "happy",
      "special",
      "difficult"
    ],
    "sentenceEn": [
      "We",
      "had",
      "several",
      "sunny",
      "days",
      "this",
      "week."
    ],
    "sentenceJa": "(今週は何か快晴の日があった)",
    "sentenceDistractors": [
      "police",
      "dry"
    ]
  },
  {
    "num": "0274",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "cloudy",
    "phonetic": "[kláudi]",
    "partOfSpeech": "形容詞",
    "japanese": "くもった",
    "tip": "[読み: クラウディ] / カテゴリ: 形容詞",
    "distractorsJa": [
      "幸福な、楽しい、うれしい",
      "速い、速く",
      "ちがった、異なる、いろいろな"
    ],
    "distractorsEn": [
      "happy",
      "fast",
      "different"
    ],
    "sentenceEn": [
      "It",
      "was",
      "cloudy",
      "yesterday."
    ],
    "sentenceJa": "昨日は曇りでした。",
    "sentenceDistractors": [
      "zone",
      "noon"
    ]
  },
  {
    "num": "0275",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "snowy",
    "phonetic": "[snóui]",
    "partOfSpeech": "形容詞",
    "japanese": "雪の降る、雪の積もった",
    "tip": "[読み: スノウイ] / カテゴリ: 形容詞",
    "distractorsJa": [
      "役に立つ",
      "空腹の、おなかがすいた",
      "太陽の照っている"
    ],
    "distractorsEn": [
      "useful",
      "hungry",
      "sunny"
    ],
    "sentenceEn": [
      "It",
      "was",
      "cold",
      "and",
      "snowy",
      "yesterday."
    ],
    "sentenceJa": "昨日は寒くて雪が降っていました。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0276",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "warm",
    "phonetic": "[wɔːrm]",
    "partOfSpeech": "形容詞",
    "japanese": "暖かい",
    "tip": "[読み: ウォーム] / カテゴリ: 形容詞 / 類義/関連: 同意語:hot(熱い、暑い), 反意語:cool(涼しい)",
    "distractorsJa": [
      "美しい、すばらしい",
      "第1の，最初の、第1に，最初に",
      "半分の、半分、2分の1"
    ],
    "distractorsEn": [
      "beautiful",
      "first",
      "half"
    ],
    "sentenceEn": [
      "That",
      "coat",
      "looks",
      "very",
      "warm."
    ],
    "sentenceJa": "あのコートはとても暖かそうだ",
    "sentenceDistractors": [
      "draw",
      "newspaper"
    ]
  },
  {
    "num": "0277",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "quiet",
    "phonetic": "[kwáiət]",
    "partOfSpeech": "形容詞",
    "japanese": "静かな",
    "tip": "[読み: クワイエット] / カテゴリ: 形容詞 / 類義/関連: 反意語:noisy(うるさい)",
    "distractorsJa": [
      "自分自身の",
      "すべての、すべてのもの",
      "有名な"
    ],
    "distractorsEn": [
      "own",
      "all",
      "famous"
    ],
    "sentenceEn": [
      "Be",
      "quiet.",
      "The",
      "baby",
      "is",
      "sleeping."
    ],
    "sentenceJa": "(静かにしなさい。赤ちゃんが寝ているのよ)",
    "sentenceDistractors": [
      "glass",
      "similar"
    ]
  },
  {
    "num": "0278",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "dark",
    "phonetic": "[dɑːrk]",
    "partOfSpeech": "形容詞",
    "japanese": "暗い、(色が)濃い、黒っぽい",
    "tip": "[読み: ダーク] / カテゴリ: 形容詞 / 類義/関連: 反意語:light(明るい)",
    "distractorsJa": [
      "暖かい",
      "有名な",
      "第1の，最初の、第1に，最初に"
    ],
    "distractorsEn": [
      "warm",
      "famous",
      "first"
    ],
    "sentenceEn": [
      "The",
      "sky",
      "is",
      "getting",
      "very",
      "dark."
    ],
    "sentenceJa": "（空がすごく暗くなってきている）",
    "sentenceDistractors": [
      "head",
      "cooking"
    ]
  },
  {
    "num": "0279",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "interesting",
    "phonetic": "[ínt(ə)rəstiŋ]",
    "partOfSpeech": "形容詞",
    "japanese": "おもしろい、興味深い",
    "tip": "[読み: インタレスティング] / カテゴリ: 形容詞 / 類義/関連: 参考表現:funny(おかしな、おもしろい)",
    "distractorsJa": [
      "太陽の照っている",
      "暗い、(色が)濃い、黒っぽい",
      "美しい、すばらしい"
    ],
    "distractorsEn": [
      "sunny",
      "dark",
      "beautiful"
    ],
    "sentenceEn": [
      "I",
      "heard",
      "an",
      "interesting",
      "story",
      "about",
      "a",
      "dog."
    ],
    "sentenceJa": "私はあるイヌにまつわるおもしろい話を聞いた",
    "sentenceDistractors": [
      "room",
      "together"
    ]
  },
  {
    "num": "0280",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "special",
    "phonetic": "[spéʃ(ə)l]",
    "partOfSpeech": "形容詞",
    "japanese": "特別の",
    "tip": "[読み: スペシャル] / カテゴリ: 形容詞",
    "distractorsJa": [
      "難しい、かたい、熱心な、一生けんめいに、激しく",
      "くもった",
      "すばらしい、晴れた、健康で"
    ],
    "distractorsEn": [
      "hard",
      "cloudy",
      "fine"
    ],
    "sentenceEn": [
      "I",
      "want",
      "to",
      "eat",
      "her",
      "special",
      "chocolate",
      "cake",
      "again."
    ],
    "sentenceJa": "彼女の特製チョコレートケーキをまた食べたい",
    "sentenceDistractors": [
      "famous",
      "culture"
    ]
  },
  {
    "num": "0281",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "useful",
    "phonetic": "[júːsf(ə)l]",
    "partOfSpeech": "形容詞",
    "japanese": "役に立つ",
    "tip": "[読み: ユースフル] / カテゴリ: 形容詞 / 類義/関連: 反意語:useless(役に立たない)",
    "distractorsJa": [
      "開いた、を開ける、開く",
      "静かな",
      "美しい、すばらしい"
    ],
    "distractorsEn": [
      "open",
      "quiet",
      "beautiful"
    ],
    "sentenceEn": [
      "The",
      "information",
      "on",
      "the",
      "Internet",
      "was",
      "very",
      "useful."
    ],
    "sentenceJa": "インターネットの情報はとても役に立った",
    "sentenceDistractors": [
      "watch",
      "any"
    ]
  },
  {
    "num": "0282",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "careful",
    "phonetic": "[kɛ́ərfəl]",
    "partOfSpeech": "形容詞",
    "japanese": "注意深い",
    "tip": "[読み: ケアフル] / カテゴリ: 形容詞 / 類義/関連: 反意語:careless(不注意な)",
    "distractorsJa": [
      "役に立つ",
      "大好きな、お気に入りの、お気に入り",
      "非常においしい"
    ],
    "distractorsEn": [
      "useful",
      "favorite",
      "delicious"
    ],
    "sentenceEn": [
      "My",
      "mother",
      "is",
      "a",
      "careful",
      "driver."
    ],
    "sentenceJa": "母は注意深い運転者だ",
    "sentenceDistractors": [
      "nurse",
      "support"
    ]
  },
  {
    "num": "0283",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "difficult",
    "phonetic": "[dífik(ə)lt]",
    "partOfSpeech": "形容詞",
    "japanese": "難しい",
    "tip": "[読み: ディフィカルト] / カテゴリ: 形容詞 / 類義/関連: 反意語:easy(やさしい)",
    "distractorsJa": [
      "半分の、半分、2分の1",
      "速い、速く",
      "すばらしい、晴れた、健康で"
    ],
    "distractorsEn": [
      "half",
      "fast",
      "fine"
    ],
    "sentenceEn": [
      "This",
      "book",
      "is",
      "too",
      "difficult",
      "for",
      "me",
      "to",
      "read."
    ],
    "sentenceJa": "この本は私が読むには難しすぎる",
    "sentenceDistractors": [
      "stay",
      "another"
    ]
  },
  {
    "num": "0284",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "hard",
    "phonetic": "[hɑːrd]",
    "partOfSpeech": "形容詞",
    "japanese": "難しい、かたい、熱心な、一生けんめいに、激しく",
    "tip": "[読み: ハード] / カテゴリ: 形容詞",
    "distractorsJa": [
      "自分自身の",
      "半分の、半分、2分の1",
      "小さい"
    ],
    "distractorsEn": [
      "own",
      "half",
      "small"
    ],
    "sentenceEn": [
      "Sue",
      "practiced",
      "the",
      "guitar",
      "very",
      "hard."
    ],
    "sentenceJa": "スーはとても熱心にギターの練習をした",
    "sentenceDistractors": [
      "woman",
      "just"
    ]
  },
  {
    "num": "0285",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "expensive",
    "phonetic": "[ikspénsiv]",
    "partOfSpeech": "形容詞",
    "japanese": "高価な",
    "tip": "[読み: イクスペンスィヴ] / カテゴリ: 形容詞",
    "distractorsJa": [
      "空腹の、おなかがすいた",
      "暗い、(色が)濃い、黒っぽい",
      "静かな"
    ],
    "distractorsEn": [
      "hungry",
      "dark",
      "quiet"
    ],
    "sentenceEn": [
      "I",
      "got",
      "an",
      "expensive",
      "watch",
      "for",
      "my",
      "birthday."
    ],
    "sentenceJa": "私は誕生日に高価な腕時計をもらった",
    "sentenceDistractors": [
      "notice",
      "paint"
    ]
  },
  {
    "num": "0286",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "delicious",
    "phonetic": "[dilíʃəs]",
    "partOfSpeech": "形容詞",
    "japanese": "非常においしい",
    "tip": "[読み: ディリシャス] / カテゴリ: 形容詞 / 類義/関連: 同意語:good(おいしい)",
    "distractorsJa": [
      "他の、別の、他の物、他の人",
      "空腹の、おなかがすいた",
      "人気のある、流行の"
    ],
    "distractorsEn": [
      "other",
      "hungry",
      "popular"
    ],
    "sentenceEn": [
      "We",
      "had",
      "a",
      "delicious",
      "school",
      "lunch",
      "today."
    ],
    "sentenceJa": "今日、おいしい給食を食べた",
    "sentenceDistractors": [
      "England",
      "king"
    ]
  },
  {
    "num": "0287",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "own",
    "phonetic": "[oun]",
    "partOfSpeech": "形容詞",
    "japanese": "自分自身の",
    "tip": "[読み: オウン] / カテゴリ: 形容詞 / フレーズ例: my own room (私自身の部屋)",
    "distractorsJa": [
      "運のよい、幸運な",
      "高価な",
      "美しい、すばらしい"
    ],
    "distractorsEn": [
      "lucky",
      "expensive",
      "beautiful"
    ],
    "sentenceEn": [
      "My",
      "brother",
      "wants",
      "his",
      "own",
      "bike."
    ],
    "sentenceJa": "弟は自分の自転車をほしがっている",
    "sentenceDistractors": [
      "music",
      "finish"
    ]
  },
  {
    "num": "0288",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "other",
    "phonetic": "[ʌ́ðər]",
    "partOfSpeech": "形容詞",
    "japanese": "他の、別の、他の物、他の人",
    "tip": "[読み: アザァ] / カテゴリ: 形容詞 / フレーズ例: the other day (先日)",
    "distractorsJa": [
      "注意深い",
      "遅い、のろい、ゆっくりと",
      "よい，おいしい，親切な，楽しい，じょうずな"
    ],
    "distractorsEn": [
      "careful",
      "slow",
      "good"
    ],
    "sentenceEn": [
      "Do",
      "you",
      "have",
      "any",
      "other",
      "questions",
      "about",
      "this?"
    ],
    "sentenceJa": "（このことについてほかに質問はありますか）",
    "sentenceDistractors": [
      "our",
      "now"
    ]
  },
  {
    "num": "0289",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "different",
    "phonetic": "[díf(ə)r(ə)nt]",
    "partOfSpeech": "形容詞",
    "japanese": "ちがった、異なる、いろいろな",
    "tip": "[読み: ディファレント] / カテゴリ: 形容詞 / 類義/関連: 関連語:difference(違い) / フレーズ例: different from 〜 (〜と異なった)",
    "distractorsJa": [
      "用意ができて",
      "特別の",
      "速い、速く"
    ],
    "distractorsEn": [
      "ready",
      "special",
      "fast"
    ],
    "sentenceEn": [
      "My",
      "idea",
      "is",
      "different",
      "from",
      "yours."
    ],
    "sentenceJa": "私の考えはあなたのと違う",
    "sentenceDistractors": [
      "house",
      "woman"
    ]
  },
  {
    "num": "0290",
    "level": 5,
    "stageSlug": "eiken4_stage05",
    "english": "dear",
    "phonetic": "[diər]",
    "partOfSpeech": "形容詞",
    "japanese": "いとしい、親愛なる、(手紙の書き出しで)〜様",
    "tip": "[読み: ディア] / カテゴリ: 形容詞",
    "distractorsJa": [
      "よい，おいしい，親切な，楽しい，じょうずな",
      "(時間・時期が)遅い，遅れた、遅く，遅れて",
      "静かな"
    ],
    "distractorsEn": [
      "good",
      "late",
      "quiet"
    ],
    "sentenceEn": [
      "This",
      "is",
      "a",
      "picture",
      "of",
      "my",
      "dear",
      "grandmother."
    ],
    "sentenceJa": "(これは私の親愛なる祖母の写真だ)",
    "sentenceDistractors": [
      "satellite",
      "police"
    ]
  },
  {
    "num": "0291",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "so",
    "phonetic": "[sou]",
    "partOfSpeech": "副詞",
    "japanese": "とても、そのように、それで、だから",
    "tip": "[読み: ソウ] / カテゴリ: 副詞",
    "distractorsJa": [
      "〜もまた",
      "離れて、あちらへ、留守で、遠征先での",
      "まもなく、すぐに"
    ],
    "distractorsEn": [
      "also",
      "away",
      "soon"
    ],
    "sentenceEn": [
      "Don't",
      "walk",
      "so",
      "fast."
    ],
    "sentenceJa": "そんなに速く歩かないで",
    "sentenceDistractors": [
      "did",
      "many"
    ]
  },
  {
    "num": "0292",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "really",
    "phonetic": "[ríː(ə)li]",
    "partOfSpeech": "副詞",
    "japanese": "本当に、(日常会話で)まさか",
    "tip": "[読み: リー(ア)リィ] / カテゴリ: 副詞 / フレーズ例: Oh, really? (まあ、本当に？)",
    "distractorsJa": [
      "後ろへ、後ろに、もとの所へ、後ろの、背中、後ろ",
      "簡単に、楽々と",
      "まもなく、すぐに"
    ],
    "distractorsEn": [
      "back",
      "easily",
      "soon"
    ],
    "sentenceEn": [
      "The",
      "weather",
      "was",
      "really",
      "good",
      "yesterday."
    ],
    "sentenceJa": "昨日は本当に天気がよかった",
    "sentenceDistractors": [
      "important",
      "only"
    ]
  },
  {
    "num": "0293",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "often",
    "phonetic": "[ɔ́(:)f(ə)n]",
    "partOfSpeech": "副詞",
    "japanese": "たびたび、よく",
    "tip": "[読み: オ(ー)フン] / カテゴリ: 副詞",
    "distractorsJa": [
      "とても、そのように、それで、だから",
      "ふたたび、また",
      "たぶん、ひょっとすると"
    ],
    "distractorsEn": [
      "so",
      "again",
      "maybe"
    ],
    "sentenceEn": [
      "Do",
      "you",
      "often",
      "go",
      "to",
      "the",
      "movies?"
    ],
    "sentenceJa": "あなたはよく映画を見に行きますか",
    "sentenceDistractors": [
      "week",
      "beautiful"
    ]
  },
  {
    "num": "0294",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "back",
    "phonetic": "[bæk]",
    "partOfSpeech": "副詞",
    "japanese": "後ろへ、後ろに、もとの所へ、後ろの、背中、後ろ",
    "tip": "[読み: バック] / カテゴリ: 副詞",
    "distractorsJa": [
      "簡単に、楽々と",
      "離れて、あちらへ、留守で、遠征先での",
      "いつ、〜するときに"
    ],
    "distractorsEn": [
      "easily",
      "away",
      "when"
    ],
    "sentenceEn": [
      "He",
      "came",
      "back",
      "from",
      "his",
      "long",
      "trip."
    ],
    "sentenceJa": "彼は長い旅行から戻ってきた",
    "sentenceDistractors": [
      "Ms.",
      "three"
    ]
  },
  {
    "num": "0295",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "soon",
    "phonetic": "[suːn]",
    "partOfSpeech": "副詞",
    "japanese": "まもなく、すぐに",
    "tip": "[読み: スーン] / カテゴリ: 副詞",
    "distractorsJa": [
      "いっしょに、ともに",
      "いつもは、ふつう",
      "今でも、まだ"
    ],
    "distractorsEn": [
      "together",
      "usually",
      "still"
    ],
    "sentenceEn": [
      "It's",
      "noon.",
      "He'll",
      "be",
      "here",
      "soon."
    ],
    "sentenceJa": "正午だ。彼はまもなくここに来るだろう",
    "sentenceDistractors": [
      "course",
      "surprised"
    ]
  },
  {
    "num": "0296",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "together",
    "phonetic": "[təɡéðər]",
    "partOfSpeech": "副詞",
    "japanese": "いっしょに、ともに",
    "tip": "[読み: トゥゲザァ] / カテゴリ: 副詞",
    "distractorsJa": [
      "離れて、去って、脱いで、〜から離れて",
      "ふたたび、また",
      "今夜(は)、今夜"
    ],
    "distractorsEn": [
      "off",
      "again",
      "tonight"
    ],
    "sentenceEn": [
      "Let's",
      "go",
      "to",
      "lunch",
      "together."
    ],
    "sentenceJa": "一緒に昼食を食べに行きましょう",
    "sentenceDistractors": [
      "stop",
      "teach"
    ]
  },
  {
    "num": "0297",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "usually",
    "phonetic": "[júːʒu(ə)li]",
    "partOfSpeech": "副詞",
    "japanese": "いつもは、ふつう",
    "tip": "[読み: ユージュ(ア)リィ] / カテゴリ: 副詞",
    "distractorsJa": [
      "本当に、(日常会話で)まさか",
      "外へ、外に、不在で",
      "たぶん、ひょっとすると"
    ],
    "distractorsEn": [
      "really",
      "out",
      "maybe"
    ],
    "sentenceEn": [
      "What",
      "do",
      "you",
      "usually",
      "do",
      "on",
      "Saturdays?"
    ],
    "sentenceJa": "土曜日にはたいてい何をしますか",
    "sentenceDistractors": [
      "light",
      "smile"
    ]
  },
  {
    "num": "0298",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "tonight",
    "phonetic": "[tənáit]",
    "partOfSpeech": "副詞",
    "japanese": "今夜(は)、今夜",
    "tip": "[読み: トゥナイト] / カテゴリ: 副詞",
    "distractorsJa": [
      "もっと遅く、後で",
      "まもなく、すぐに",
      "ちょうど、ほんの"
    ],
    "distractorsEn": [
      "later",
      "soon",
      "just"
    ],
    "sentenceEn": [
      "I'll",
      "go",
      "to",
      "bed",
      "early",
      "tonight."
    ],
    "sentenceJa": "(私は今夜は早く寝る)",
    "sentenceDistractors": [
      "interest",
      "tomato"
    ]
  },
  {
    "num": "0299",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "once",
    "phonetic": "[wʌns]",
    "partOfSpeech": "副詞",
    "japanese": "1度、1回、かつて",
    "tip": "[読み: ワンス] / カテゴリ: 副詞 / 類義/関連: 参考表現:twice(2度), 参考表現:three times(3度)",
    "distractorsJa": [
      "離れて、あちらへ、留守で、遠征先での",
      "ちょうど、ほんの",
      "とても、そのように、それで、だから"
    ],
    "distractorsEn": [
      "away",
      "just",
      "so"
    ],
    "sentenceEn": [
      "My",
      "family",
      "once",
      "lived",
      "in",
      "Canada."
    ],
    "sentenceJa": "私の家族はかつてカナダに住んでいた",
    "sentenceDistractors": [
      "news",
      "catch"
    ]
  },
  {
    "num": "0300",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "again",
    "phonetic": "[əɡén]",
    "partOfSpeech": "副詞",
    "japanese": "ふたたび、また",
    "tip": "[読み: アゲン] / カテゴリ: 副詞",
    "distractorsJa": [
      "外へ、外に、不在で",
      "ちょうど、ほんの",
      "後ろへ、後ろに、もとの所へ、後ろの、背中、後ろ"
    ],
    "distractorsEn": [
      "out",
      "just",
      "back"
    ],
    "sentenceEn": [
      "It",
      "snowed",
      "again",
      "last",
      "night."
    ],
    "sentenceJa": "昨夜また雪が降った",
    "sentenceDistractors": [
      "a, an",
      "it"
    ]
  },
  {
    "num": "0301",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "just",
    "phonetic": "[dʒʌst]",
    "partOfSpeech": "副詞",
    "japanese": "ちょうど、ほんの",
    "tip": "[読み: ヂャスト] / カテゴリ: 副詞 / フレーズ例: just at noon (ちょうど正午に)",
    "distractorsJa": [
      "もっと遅く、後で",
      "そこに、そこで、そこへ、(There is 〜 / There are 〜で)〜がある、〜がいる",
      "いつもは、ふつう"
    ],
    "distractorsEn": [
      "later",
      "there",
      "usually"
    ],
    "sentenceEn": [
      "The",
      "train",
      "has",
      "just",
      "arrived",
      "at",
      "the",
      "station."
    ],
    "sentenceJa": "電車はちょうど駅に着いたところだ",
    "sentenceDistractors": [
      "each",
      "let"
    ]
  },
  {
    "num": "0302",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "only",
    "phonetic": "[óunli]",
    "partOfSpeech": "副詞",
    "japanese": "ただ〜だけ、ただ1つの、ただ1人の",
    "tip": "[読み: オウンリィ] / カテゴリ: 副詞",
    "distractorsJa": [
      "ふたたび、また",
      "1度、1回、かつて",
      "いつもは、ふつう"
    ],
    "distractorsEn": [
      "again",
      "once",
      "usually"
    ],
    "sentenceEn": [
      "That's",
      "the",
      "only",
      "thing",
      "I",
      "can",
      "do."
    ],
    "sentenceJa": "それは私ができるただ１つのことだ",
    "sentenceDistractors": [
      "last",
      "hear"
    ]
  },
  {
    "num": "0303",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "there",
    "phonetic": "[ðɛər]",
    "partOfSpeech": "副詞",
    "japanese": "そこに、そこで、そこへ、(There is 〜 / There are 〜で)〜がある、〜がいる",
    "tip": "[読み: ゼア] / カテゴリ: 副詞 / フレーズ例: over there (あそこに)",
    "distractorsJa": [
      "今でも、まだ",
      "簡単に、楽々と",
      "たびたび、よく"
    ],
    "distractorsEn": [
      "still",
      "easily",
      "often"
    ],
    "sentenceEn": [
      "I",
      "went",
      "to",
      "Tom's",
      "house,",
      "but",
      "he",
      "wasn't",
      "there."
    ],
    "sentenceJa": "私はトムの家に行ったが，彼はそこにいなかった",
    "sentenceDistractors": [
      "her",
      "me"
    ]
  },
  {
    "num": "0304",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "still",
    "phonetic": "[stíl]",
    "partOfSpeech": "副詞",
    "japanese": "今でも、まだ",
    "tip": "[読み: スティル] / カテゴリ: 副詞",
    "distractorsJa": [
      "後ろへ、後ろに、もとの所へ、後ろの、背中、後ろ",
      "たびたび、よく",
      "外へ、外に、不在で"
    ],
    "distractorsEn": [
      "back",
      "often",
      "out"
    ],
    "sentenceEn": [
      "It's",
      "already",
      "10",
      "o'clock,",
      "but",
      "she",
      "is",
      "still",
      "in",
      "bed."
    ],
    "sentenceJa": "もう 10 時なのに，彼女はまだ寝ている",
    "sentenceDistractors": [
      "few",
      "course"
    ]
  },
  {
    "num": "0305",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "when",
    "phonetic": "[(h)wen]",
    "partOfSpeech": "副詞",
    "japanese": "いつ、〜するときに",
    "tip": "[読み: (フ)ウェン] / カテゴリ: 副詞",
    "distractorsJa": [
      "とても、そのように、それで、だから",
      "1度、1回、かつて",
      "後ろへ、後ろに、もとの所へ、後ろの、背中、後ろ"
    ],
    "distractorsEn": [
      "so",
      "once",
      "back"
    ],
    "sentenceEn": [
      "When",
      "is",
      "your",
      "birthday?"
    ],
    "sentenceJa": "あなたの誕生日はいつですか",
    "sentenceDistractors": [
      "from",
      "very"
    ]
  },
  {
    "num": "0306",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "also",
    "phonetic": "[ɔ́ːlsou]",
    "partOfSpeech": "副詞",
    "japanese": "〜もまた",
    "tip": "[読み: オールソウ] / カテゴリ: 副詞 / 類義/関連: 同意語:too(〜もまた)",
    "distractorsJa": [
      "1度、1回、かつて",
      "いつもは、ふつう",
      "離れて、去って、脱いで、〜から離れて"
    ],
    "distractorsEn": [
      "once",
      "usually",
      "off"
    ],
    "sentenceEn": [
      "Nami",
      "is",
      "kind.",
      "Her",
      "sister",
      "is",
      "also",
      "kind."
    ],
    "sentenceJa": "ナミは親切だ。彼女の妹もまた親切だ",
    "sentenceDistractors": [
      "friend",
      "study"
    ]
  },
  {
    "num": "0307",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "maybe",
    "phonetic": "[méibiː]",
    "partOfSpeech": "副詞",
    "japanese": "たぶん、ひょっとすると",
    "tip": "[読み: メイビ(ー)] / カテゴリ: 副詞",
    "distractorsJa": [
      "ふたたび、また",
      "ちょうど、ほんの",
      "今でも、まだ"
    ],
    "distractorsEn": [
      "again",
      "just",
      "still"
    ],
    "sentenceEn": [
      "Maybe",
      "he'll",
      "come",
      "here",
      "later."
    ],
    "sentenceJa": "（たぶん、彼はあとでここに来るだろう）",
    "sentenceDistractors": [
      "Africa",
      "weather"
    ]
  },
  {
    "num": "0308",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "later",
    "phonetic": "[léitər]",
    "partOfSpeech": "副詞",
    "japanese": "もっと遅く、後で",
    "tip": "[読み: レイタァ] / カテゴリ: 副詞",
    "distractorsJa": [
      "1度、1回、かつて",
      "いつ、〜するときに",
      "とても、そのように、それで、だから"
    ],
    "distractorsEn": [
      "once",
      "when",
      "so"
    ],
    "sentenceEn": [
      "I",
      "need",
      "to",
      "go",
      "home",
      "now.",
      "See",
      "you",
      "later."
    ],
    "sentenceJa": "もう家に帰らなくちゃ。またあとでね",
    "sentenceDistractors": [
      "usually",
      "through"
    ]
  },
  {
    "num": "0309",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "easily",
    "phonetic": "[íːzəli]",
    "partOfSpeech": "副詞",
    "japanese": "簡単に、楽々と",
    "tip": "[読み: イーズィリィ] / カテゴリ: 副詞",
    "distractorsJa": [
      "とても、そのように、それで、だから",
      "1度、1回、かつて",
      "たぶん、ひょっとすると"
    ],
    "distractorsEn": [
      "so",
      "once",
      "maybe"
    ],
    "sentenceEn": [
      "You",
      "can",
      "open",
      "this",
      "bottle",
      "easily."
    ],
    "sentenceJa": "このびんは簡単に開けられる",
    "sentenceDistractors": [
      "math",
      "clothes"
    ]
  },
  {
    "num": "0310",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "away",
    "phonetic": "[əwéi]",
    "partOfSpeech": "副詞",
    "japanese": "離れて、あちらへ、留守で、遠征先での",
    "tip": "[読み: アウェイ] / カテゴリ: 副詞",
    "distractorsJa": [
      "本当に、(日常会話で)まさか",
      "いつもは、ふつう",
      "たぶん、ひょっとすると"
    ],
    "distractorsEn": [
      "really",
      "usually",
      "maybe"
    ],
    "sentenceEn": [
      "Our",
      "school",
      "is",
      "far",
      "away",
      "from",
      "the",
      "station."
    ],
    "sentenceJa": "私たちの学校は駅から遠く離れている",
    "sentenceDistractors": [
      "through",
      "sport"
    ]
  },
  {
    "num": "0311",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "off",
    "phonetic": "[ɔ́(ː)f]",
    "partOfSpeech": "副詞",
    "japanese": "離れて、去って、脱いで、〜から離れて",
    "tip": "[読み: オ(ー)フ] / カテゴリ: 副詞 / 類義/関連: 反意語:on(身につけて)",
    "distractorsJa": [
      "ただ〜だけ、ただ1つの、ただ1人の",
      "本当に、(日常会話で)まさか",
      "簡単に、楽々と"
    ],
    "distractorsEn": [
      "only",
      "really",
      "easily"
    ],
    "sentenceEn": [
      "My",
      "house",
      "is",
      "about",
      "a",
      "mile",
      "off",
      "from",
      "the",
      "station."
    ],
    "sentenceJa": "私の家は駅からおよそ1マイル離れている",
    "sentenceDistractors": [
      "energy",
      "spend"
    ]
  },
  {
    "num": "0312",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "out",
    "phonetic": "[áut]",
    "partOfSpeech": "副詞",
    "japanese": "外へ、外に、不在で",
    "tip": "[読み: アウト] / カテゴリ: 副詞 / 類義/関連: 反意語:in(中へ) / フレーズ例: Don't go out. (外へ出ないように。)",
    "distractorsJa": [
      "そこに、そこで、そこへ、(There is 〜 / There are 〜で)〜がある、〜がいる",
      "1度、1回、かつて",
      "たぶん、ひょっとすると"
    ],
    "distractorsEn": [
      "there",
      "once",
      "maybe"
    ],
    "sentenceEn": [
      "He",
      "didn't",
      "want",
      "to",
      "go",
      "out",
      "in",
      "the",
      "rain."
    ],
    "sentenceJa": "彼は雨の中外へ出たくなかった",
    "sentenceDistractors": [
      "water",
      "problem"
    ]
  },
  {
    "num": "0313",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "at",
    "phonetic": "[æt]",
    "partOfSpeech": "前置詞",
    "japanese": "(場所・位置を示して)〜で、〜に、(時間を示して)〜に",
    "tip": "[読み: アット] / カテゴリ: 前置詞 / フレーズ例: at home (家で)",
    "distractorsJa": [
      "〜といっしょに、(道具・手段・材料を示して)〜で、〜を使って",
      "〜のために、(期間を表して)〜の間",
      "(所有・所属を表して)〜の、(部分を示して)〜の中の[で]"
    ],
    "distractorsEn": [
      "with",
      "for",
      "of"
    ],
    "sentenceEn": [
      "I",
      "met",
      "him",
      "at",
      "the",
      "station."
    ],
    "sentenceJa": "私は駅で彼に会った",
    "sentenceDistractors": [
      "say",
      "this"
    ]
  },
  {
    "num": "0314",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "in",
    "phonetic": "[ín]",
    "partOfSpeech": "前置詞",
    "japanese": "(場所・位置を示して)〜の中に[で、の]、(時間を示して)〜に",
    "tip": "[読み: イン] / カテゴリ: 前置詞 / フレーズ例: in the box (箱の中に)",
    "distractorsJa": [
      "〜の上に、〜を越えて、上方に",
      "〜の後に、〜したあとで",
      "〜の上に、(日時を表して)〜に、(状態)〜中で"
    ],
    "distractorsEn": [
      "over",
      "after",
      "on"
    ],
    "sentenceEn": [
      "My",
      "grandparents",
      "live",
      "in",
      "a",
      "small",
      "town."
    ],
    "sentenceJa": "私の祖父母は小さな町に住んでいる",
    "sentenceDistractors": [
      "it",
      "he"
    ]
  },
  {
    "num": "0315",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "for",
    "phonetic": "[fɔ́ːr]",
    "partOfSpeech": "前置詞",
    "japanese": "〜のために、(期間を表して)〜の間",
    "tip": "[読み: フォー] / カテゴリ: 前置詞 / フレーズ例: buy a present for her (彼女のためにプレゼントを買う)",
    "distractorsJa": [
      "〜の間に、〜の間で、〜の間の",
      "(場所・位置を示して)〜で、〜に、(時間を示して)〜に",
      "〜の上に、(日時を表して)〜に、(状態)〜中で"
    ],
    "distractorsEn": [
      "between",
      "at",
      "on"
    ],
    "sentenceEn": [
      "She",
      "bought",
      "a",
      "nice",
      "cap",
      "for",
      "me."
    ],
    "sentenceJa": "彼女は私にすてきな帽子を買ってくれた",
    "sentenceDistractors": [
      "about",
      "can"
    ]
  },
  {
    "num": "0316",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "on",
    "phonetic": "[ɑ́(ː)n]",
    "partOfSpeech": "前置詞",
    "japanese": "〜の上に、(日時を表して)〜に、(状態)〜中で",
    "tip": "[読み: ア(ー)ン] / カテゴリ: 前置詞 / フレーズ例: on the desk (机の上に)",
    "distractorsJa": [
      "〜の中へ[に]",
      "〜の下に[を]、〜未満の",
      "(場所・位置を示して)〜で、〜に、(時間を示して)〜に"
    ],
    "distractorsEn": [
      "into",
      "under",
      "at"
    ],
    "sentenceEn": [
      "There",
      "is",
      "a",
      "comic",
      "book",
      "on",
      "the",
      "sofa."
    ],
    "sentenceJa": "ソファーの上にマンガ本が１冊ある",
    "sentenceDistractors": [
      "what",
      "did"
    ]
  },
  {
    "num": "0317",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "of",
    "phonetic": "[ʌv]",
    "partOfSpeech": "前置詞",
    "japanese": "(所有・所属を表して)〜の、(部分を示して)〜の中の[で]",
    "tip": "[読み: アヴ] / カテゴリ: 前置詞 / フレーズ例: a member of the class (クラスの一員)",
    "distractorsJa": [
      "〜の上に、〜を越えて、上方に",
      "〜のそばに",
      "〜といっしょに、(道具・手段・材料を示して)〜で、〜を使って"
    ],
    "distractorsEn": [
      "over",
      "beside",
      "with"
    ],
    "sentenceEn": [
      "I",
      "am",
      "a",
      "member",
      "of",
      "the",
      "tennis",
      "team."
    ],
    "sentenceJa": "私はテニスチームの一員だ",
    "sentenceDistractors": [
      "that",
      "about"
    ]
  },
  {
    "num": "0318",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "about",
    "phonetic": "[əbáut]",
    "partOfSpeech": "前置詞",
    "japanese": "〜について(の)、およそ、約",
    "tip": "[読み: アバウト] / カテゴリ: 前置詞 / フレーズ例: about you (あなたについて)",
    "distractorsJa": [
      "〜といっしょに、(道具・手段・材料を示して)〜で、〜を使って",
      "(場所・位置を示して)〜の中に[で、の]、(時間を示して)〜に",
      "〜のそばに、〜によって、〜までに(は)"
    ],
    "distractorsEn": [
      "with",
      "in",
      "by"
    ],
    "sentenceEn": [
      "I",
      "know",
      "a",
      "lot",
      "about",
      "Canada."
    ],
    "sentenceJa": "私はカナダについてたくさん知っている",
    "sentenceDistractors": [
      "at",
      "but"
    ]
  },
  {
    "num": "0319",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "with",
    "phonetic": "[wíð]",
    "partOfSpeech": "前置詞",
    "japanese": "〜といっしょに、(道具・手段・材料を示して)〜で、〜を使って",
    "tip": "[読み: ウィズ] / カテゴリ: 前置詞 / フレーズ例: see a movie with a friend (友だちと一緒に映画を見る)",
    "distractorsJa": [
      "(所有・所属を表して)〜の、(部分を示して)〜の中の[で]",
      "〜の後に、〜したあとで",
      "〜の下に[を]、〜未満の"
    ],
    "distractorsEn": [
      "of",
      "after",
      "under"
    ],
    "sentenceEn": [
      "I",
      "went",
      "to",
      "a",
      "museum",
      "with",
      "Tomoko",
      "last",
      "Sunday."
    ],
    "sentenceJa": "（この前の日曜日，私はトモコと一緒に博物館に行った）",
    "sentenceDistractors": [
      "when",
      "her"
    ]
  },
  {
    "num": "0320",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "after",
    "phonetic": "[ǽftər]",
    "partOfSpeech": "前置詞",
    "japanese": "〜の後に、〜したあとで",
    "tip": "[読み: アフタァ] / カテゴリ: 前置詞 / 類義/関連: 反意語:before(〜の前に) / フレーズ例: after dinner (夕食の後に)",
    "distractorsJa": [
      "〜のそばに",
      "〜まで(ずっと)、〜するときまで",
      "〜の間に、〜の間で、〜の間の"
    ],
    "distractorsEn": [
      "beside",
      "until",
      "between"
    ],
    "sentenceEn": [
      "We",
      "had",
      "dinner",
      "after",
      "the",
      "game."
    ],
    "sentenceJa": "私たちは試合のあとに夕食を食べた",
    "sentenceDistractors": [
      "first",
      "us"
    ]
  },
  {
    "num": "0321",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "by",
    "phonetic": "[bái]",
    "partOfSpeech": "前置詞",
    "japanese": "〜のそばに、〜によって、〜までに(は)",
    "tip": "[読み: バイ] / カテゴリ: 前置詞 / フレーズ例: by bus (バスで)",
    "distractorsJa": [
      "〜の中へ[に]",
      "(場所・位置を示して)〜で、〜に、(時間を示して)〜に",
      "〜の上に、(日時を表して)〜に、(状態)〜中で"
    ],
    "distractorsEn": [
      "into",
      "at",
      "on"
    ],
    "sentenceEn": [
      "He",
      "went",
      "to",
      "the",
      "stadium",
      "by",
      "train."
    ],
    "sentenceJa": "彼は電車でスタジアムに行った",
    "sentenceDistractors": [
      "all",
      "tell"
    ]
  },
  {
    "num": "0322",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "under",
    "phonetic": "[ʌ́ndər]",
    "partOfSpeech": "前置詞",
    "japanese": "〜の下に[を]、〜未満の",
    "tip": "[読み: アンダァ] / カテゴリ: 前置詞 / 類義/関連: 反意語:over(〜の上に) / フレーズ例: under the bridge (橋の下に)",
    "distractorsJa": [
      "〜の上に、〜を越えて、上方に",
      "〜の中へ[に]",
      "(場所・位置を示して)〜の中に[で、の]、(時間を示して)〜に"
    ],
    "distractorsEn": [
      "over",
      "into",
      "in"
    ],
    "sentenceEn": [
      "We",
      "sat",
      "down",
      "under",
      "a",
      "big",
      "tree."
    ],
    "sentenceJa": "私たちは大きな木の下にすわった。",
    "sentenceDistractors": [
      "face",
      "stand"
    ]
  },
  {
    "num": "0323",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "over",
    "phonetic": "[óuvər]",
    "partOfSpeech": "前置詞",
    "japanese": "〜の上に、〜を越えて、上方に",
    "tip": "[読み: オウヴァ] / カテゴリ: 前置詞 / 類義/関連: 反意語:under(〜の下に)",
    "distractorsJa": [
      "〜のまわりを[に]、〜中を、まわりを[に]",
      "(場所・位置を示して)〜の中に[で、の]、(時間を示して)〜に",
      "〜について(の)、およそ、約"
    ],
    "distractorsEn": [
      "around",
      "in",
      "about"
    ],
    "sentenceEn": [
      "Many",
      "swans",
      "were",
      "flying",
      "over",
      "the",
      "lake."
    ],
    "sentenceJa": "たくさんの白鳥が湖の上を飛んでいた",
    "sentenceDistractors": [
      "bring",
      "ago"
    ]
  },
  {
    "num": "0324",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "around",
    "phonetic": "[əráund]",
    "partOfSpeech": "前置詞",
    "japanese": "〜のまわりを[に]、〜中を、まわりを[に]",
    "tip": "[読み: アラウンド] / カテゴリ: 前置詞 / フレーズ例: around the tree (木のまわりに)",
    "distractorsJa": [
      "(所有・所属を表して)〜の、(部分を示して)〜の中の[で]",
      "〜の間に、〜の間で、〜の間の",
      "(場所・位置を示して)〜で、〜に、(時間を示して)〜に"
    ],
    "distractorsEn": [
      "of",
      "between",
      "at"
    ],
    "sentenceEn": [
      "The",
      "children",
      "sat",
      "around",
      "their",
      "grandmother."
    ],
    "sentenceJa": "子どもたちはおばあさんのまわりにすわった",
    "sentenceDistractors": [
      "better",
      "Ms."
    ]
  },
  {
    "num": "0325",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "beside",
    "phonetic": "[bisáid]",
    "partOfSpeech": "前置詞",
    "japanese": "〜のそばに",
    "tip": "[読み: ビサイド] / カテゴリ: 前置詞",
    "distractorsJa": [
      "〜の上に、〜を越えて、上方に",
      "〜の間に、〜の間で、〜の間の",
      "〜のために、(期間を表して)〜の間"
    ],
    "distractorsEn": [
      "over",
      "between",
      "for"
    ],
    "sentenceEn": [
      "He",
      "sat",
      "down",
      "beside",
      "me."
    ],
    "sentenceJa": "彼は私の隣に座りました。",
    "sentenceDistractors": [
      "official",
      "discussion"
    ]
  },
  {
    "num": "0326",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "between",
    "phonetic": "[bitwíːn]",
    "partOfSpeech": "前置詞",
    "japanese": "〜の間に、〜の間で、〜の間の",
    "tip": "[読み: ビトゥウィーン] / カテゴリ: 前置詞 / フレーズ例: between A and B (AとBの間に[で])",
    "distractorsJa": [
      "〜のそばに",
      "〜の中へ[に]",
      "(場所・位置を示して)〜の中に[で、の]、(時間を示して)〜に"
    ],
    "distractorsEn": [
      "beside",
      "into",
      "in"
    ],
    "sentenceEn": [
      "Ryo",
      "sat",
      "down",
      "between",
      "Nao",
      "and",
      "me."
    ],
    "sentenceJa": "リョウはナオと私の間にすわった",
    "sentenceDistractors": [
      "speak",
      "where"
    ]
  },
  {
    "num": "0327",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "into",
    "phonetic": "[íntuː]",
    "partOfSpeech": "前置詞",
    "japanese": "〜の中へ[に]",
    "tip": "[読み: イントゥー] / カテゴリ: 前置詞 / 類義/関連: 反意語:out of(〜の中から外へ) / フレーズ例: go into a room (部屋に入る)",
    "distractorsJa": [
      "〜のために、(期間を表して)〜の間",
      "(場所・位置を示して)〜の中に[で、の]、(時間を示して)〜に",
      "〜の間に、〜の間で、〜の間の"
    ],
    "distractorsEn": [
      "for",
      "in",
      "between"
    ],
    "sentenceEn": [
      "She",
      "put",
      "her",
      "hat",
      "into",
      "the",
      "box."
    ],
    "sentenceJa": "彼女は帽子をその箱の中に入れた",
    "sentenceDistractors": [
      "same",
      "morning"
    ]
  },
  {
    "num": "0328",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "until",
    "phonetic": "[əntíl]",
    "partOfSpeech": "前置詞",
    "japanese": "〜まで(ずっと)、〜するときまで",
    "tip": "[読み: アンティル] / カテゴリ: 前置詞 / 類義/関連: 同意語:till(〜まで) / フレーズ例: until tomorrow (明日まで)",
    "distractorsJa": [
      "(所有・所属を表して)〜の、(部分を示して)〜の中の[で]",
      "(場所・位置を示して)〜で、〜に、(時間を示して)〜に",
      "〜のために、(期間を表して)〜の間"
    ],
    "distractorsEn": [
      "of",
      "at",
      "for"
    ],
    "sentenceEn": [
      "We",
      "were",
      "on",
      "winter",
      "vacation",
      "until",
      "yesterday."
    ],
    "sentenceJa": "私たちは昨日まで冬休みだった",
    "sentenceDistractors": [
      "fun",
      "sick"
    ]
  },
  {
    "num": "0329",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "and",
    "phonetic": "[ænd]",
    "partOfSpeech": "接続詞",
    "japanese": "と、そして",
    "tip": "[読み: アンド] / カテゴリ: 接続詞 / フレーズ例: A, B(,) and C (AとBとC)",
    "distractorsJa": [
      "か〜、かあるいは〜",
      "しかし",
      "(なぜなら)〜だから、〜なので"
    ],
    "distractorsEn": [
      "or",
      "but",
      "because"
    ],
    "sentenceEn": [
      "I",
      "studied",
      "history",
      "and",
      "English",
      "yesterday."
    ],
    "sentenceJa": "私は昨日, 歴史と英語を勉強した",
    "sentenceDistractors": [
      "have",
      "do"
    ]
  },
  {
    "num": "0330",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "but",
    "phonetic": "[bʌt]",
    "partOfSpeech": "接続詞",
    "japanese": "しかし",
    "tip": "[読み: バット] / カテゴリ: 接続詞 / フレーズ例: not A but B (AではなくてB)",
    "distractorsJa": [
      "と、そして",
      "もし〜ならば",
      "か〜、かあるいは〜"
    ],
    "distractorsEn": [
      "and",
      "if",
      "or"
    ],
    "sentenceEn": [
      "This",
      "sweater",
      "is",
      "old,",
      "but",
      "I",
      "like",
      "it."
    ],
    "sentenceJa": "このセーターは古いけれど, 私は気に入っている",
    "sentenceDistractors": [
      "this",
      "think"
    ]
  },
  {
    "num": "0331",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "because",
    "phonetic": "[bikɔ́(ː)z]",
    "partOfSpeech": "接続詞",
    "japanese": "(なぜなら)〜だから、〜なので",
    "tip": "[読み: ビコ(ー)ズ] / カテゴリ: 接続詞",
    "distractorsJa": [
      "しかし",
      "もし〜ならば",
      "か〜、かあるいは〜"
    ],
    "distractorsEn": [
      "but",
      "if",
      "or"
    ],
    "sentenceEn": [
      "The",
      "train",
      "was",
      "late",
      "because",
      "it",
      "snowed."
    ],
    "sentenceJa": "雪が降ったので列車が遅れた",
    "sentenceDistractors": [
      "school",
      "get"
    ]
  },
  {
    "num": "0332",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "if",
    "phonetic": "[if]",
    "partOfSpeech": "接続詞",
    "japanese": "もし〜ならば",
    "tip": "[読み: イフ] / カテゴリ: 接続詞",
    "distractorsJa": [
      "(なぜなら)〜だから、〜なので",
      "か〜、かあるいは〜",
      "(比較級のあとにおいて)〜よりも"
    ],
    "distractorsEn": [
      "because",
      "or",
      "than"
    ],
    "sentenceEn": [
      "If",
      "it",
      "is",
      "fine",
      "tomorrow,",
      "we",
      "will",
      "play",
      "tennis."
    ],
    "sentenceJa": "もし明日がいい天気なら，私たちはテニスをするつもりだ",
    "sentenceDistractors": [
      "work",
      "could"
    ]
  },
  {
    "num": "0333",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "or",
    "phonetic": "[ɔ́ːr]",
    "partOfSpeech": "接続詞",
    "japanese": "か〜、かあるいは〜",
    "tip": "[読み: オー] / カテゴリ: 接続詞 / フレーズ例: A or B (AかB)",
    "distractorsJa": [
      "と、そして",
      "(比較級のあとにおいて)〜よりも",
      "しかし"
    ],
    "distractorsEn": [
      "and",
      "than",
      "but"
    ],
    "sentenceEn": [
      "Which",
      "would",
      "you",
      "like,",
      "tea",
      "or",
      "coffee?"
    ],
    "sentenceJa": "紅茶かコーヒーでは、どちらになさいますか",
    "sentenceDistractors": [
      "could",
      "also"
    ]
  },
  {
    "num": "0334",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "will",
    "phonetic": "[wil]",
    "partOfSpeech": "助動詞",
    "japanese": "(未来への意志を表して)〜するつもりだ、(未来を表して)〜だろう",
    "tip": "[読み: ウィル] / カテゴリ: 助動詞 / 類義/関連: 否定の短縮形:won't(will notの短縮形) / フレーズ例: Will you 〜? (〜してくれませんか。)",
    "distractorsJa": [
      "〜しなければならない、(否定形で)〜してはいけない",
      "(許可を表して)〜してもよい、(推測を表して)〜かもしれない",
      "〜すべきである、〜したほうがよい"
    ],
    "distractorsEn": [
      "must",
      "may",
      "should"
    ],
    "sentenceEn": [
      "Ryo",
      "will",
      "come",
      "back",
      "after",
      "he",
      "finishes",
      "college."
    ],
    "sentenceJa": "リョウは大学を卒業したら帰ってくるだろう",
    "sentenceDistractors": [
      "can",
      "on"
    ]
  },
  {
    "num": "0335",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "may",
    "phonetic": "[mei]",
    "partOfSpeech": "助動詞",
    "japanese": "(許可を表して)〜してもよい、(推測を表して)〜かもしれない",
    "tip": "[読み: メイ] / カテゴリ: 助動詞",
    "distractorsJa": [
      "〜しなければならない、(否定形で)〜してはいけない",
      "(未来への意志を表して)〜するつもりだ、(未来を表して)〜だろう",
      "〜すべきである、〜したほうがよい"
    ],
    "distractorsEn": [
      "must",
      "will",
      "should"
    ],
    "sentenceEn": [
      "May",
      "I",
      "come",
      "in?",
      "—",
      "Yes,",
      "of",
      "course."
    ],
    "sentenceJa": "入ってもいいですか。― ええ, もちろんです",
    "sentenceDistractors": [
      "walk",
      "city"
    ]
  },
  {
    "num": "0336",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "should",
    "phonetic": "[ʃud]",
    "partOfSpeech": "助動詞",
    "japanese": "〜すべきである、〜したほうがよい",
    "tip": "[読み: シュッド] / カテゴリ: 助動詞 / 類義/関連: 否定の短縮形:shouldn't(should notの短縮形)",
    "distractorsJa": [
      "〜しなければならない、(否定形で)〜してはいけない",
      "(Would you 〜?で)〜してくださいませんか",
      "(canの過去形)〜することができた、(Could you 〜?で)〜していただけませんか"
    ],
    "distractorsEn": [
      "must",
      "would",
      "could"
    ],
    "sentenceEn": [
      "You",
      "should",
      "see",
      "a",
      "doctor",
      "right",
      "now."
    ],
    "sentenceJa": "あなたは今すぐにお医者さんにみてもらうべきだ",
    "sentenceDistractors": [
      "than",
      "old"
    ]
  },
  {
    "num": "0337",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "could",
    "phonetic": "[kud]",
    "partOfSpeech": "助動詞",
    "japanese": "(canの過去形)〜することができた、(Could you 〜?で)〜していただけませんか",
    "tip": "[読み: クッド] / カテゴリ: 助動詞 / 類義/関連: 否定の短縮形:couldn't(could notの短縮形)",
    "distractorsJa": [
      "〜すべきである、〜したほうがよい",
      "(許可を表して)〜してもよい、(推測を表して)〜かもしれない",
      "(未来への意志を表して)〜するつもりだ、(未来を表して)〜だろう"
    ],
    "distractorsEn": [
      "should",
      "may",
      "will"
    ],
    "sentenceEn": [
      "Ryo",
      "could",
      "not",
      "sleep",
      "well",
      "last",
      "night."
    ],
    "sentenceJa": "リョウは昨晩よく眠ることができなかった",
    "sentenceDistractors": [
      "help",
      "friend"
    ]
  },
  {
    "num": "0338",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "would",
    "phonetic": "[wud]",
    "partOfSpeech": "助動詞",
    "japanese": "(Would you 〜?で)〜してくださいませんか",
    "tip": "[読み: ウッド] / カテゴリ: 助動詞 / 類義/関連: 短縮形:I'd(I wouldの短縮形), 短縮形:you'd(you wouldの短縮形), 否定の短縮形:wouldn't(would notの短縮形)",
    "distractorsJa": [
      "(未来への意志を表して)〜するつもりだ、(未来を表して)〜だろう",
      "〜しなければならない、(否定形で)〜してはいけない",
      "(許可を表して)〜してもよい、(推測を表して)〜かもしれない"
    ],
    "distractorsEn": [
      "will",
      "must",
      "may"
    ],
    "sentenceEn": [
      "I",
      "thought",
      "she",
      "would",
      "be",
      "back",
      "soon."
    ],
    "sentenceJa": "私は彼女はすぐに戻ってくるだろうと思った",
    "sentenceDistractors": [
      "kind",
      "feel"
    ]
  },
  {
    "num": "0339",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "must",
    "phonetic": "[mʌst]",
    "partOfSpeech": "助動詞",
    "japanese": "〜しなければならない、(否定形で)〜してはいけない",
    "tip": "[読み: マスト] / カテゴリ: 助動詞 / 類義/関連: 否定の短縮形:mustn't(must notの短縮形)",
    "distractorsJa": [
      "(未来への意志を表して)〜するつもりだ、(未来を表して)〜だろう",
      "〜すべきである、〜したほうがよい",
      "(Would you 〜?で)〜してくださいませんか"
    ],
    "distractorsEn": [
      "will",
      "should",
      "would"
    ],
    "sentenceEn": [
      "You",
      "must",
      "take",
      "care",
      "of",
      "your",
      "little",
      "sister."
    ],
    "sentenceJa": "あなたは妹の世話をしなければならない",
    "sentenceDistractors": [
      "soccer",
      "tomorrow"
    ]
  },
  {
    "num": "0340",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "one",
    "phonetic": "[wʌn]",
    "partOfSpeech": "代名詞",
    "japanese": "(前に出た数えられる名詞の代わりとして)もの、1つ、1つの、ある、1",
    "tip": "[読み: ワン] / カテゴリ: 代名詞",
    "distractorsJa": [
      "(肯定文で)何か、あるもの",
      "もう1つ、別のもの、別の人、もう1つの、もう1人の、別の",
      "だれでも、みんな"
    ],
    "distractorsEn": [
      "something",
      "another",
      "everyone"
    ],
    "sentenceEn": [
      "She",
      "has",
      "a",
      "camera,",
      "and",
      "I",
      "want",
      "to",
      "buy",
      "one."
    ],
    "sentenceJa": "彼女はカメラを持っていて、私も1つ買いたい。",
    "sentenceDistractors": [
      "something",
      "another"
    ]
  },
  {
    "num": "0341",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "another",
    "phonetic": "[ənʌ́ðər]",
    "partOfSpeech": "代名詞",
    "japanese": "もう1つ、別のもの、別の人、もう1つの、もう1人の、別の",
    "tip": "[読み: アナザァ] / カテゴリ: 代名詞",
    "distractorsJa": [
      "(前に出た数えられる名詞の代わりとして)もの、1つ、1つの、ある、1",
      "だれでも、みんな",
      "(疑問文, ifの文で)何か、(否定文で)何も、(肯定文で)何でも"
    ],
    "distractorsEn": [
      "one",
      "everyone",
      "anything"
    ],
    "sentenceEn": [
      "I",
      "have",
      "a",
      "car,",
      "but",
      "I",
      "want",
      "another."
    ],
    "sentenceJa": "私は車を持っていますが、もう1台ほしいです。",
    "sentenceDistractors": [
      "one",
      "everyone"
    ]
  },
  {
    "num": "0342",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "something",
    "phonetic": "[sʌ́mθiŋ]",
    "partOfSpeech": "代名詞",
    "japanese": "(肯定文で)何か、あるもの",
    "tip": "[読み: サムスィング] / カテゴリ: 代名詞",
    "distractorsJa": [
      "(疑問文, ifの文で)何か、(否定文で)何も、(肯定文で)何でも",
      "(前に出た数えられる名詞の代わりとして)もの、1つ、1つの、ある、1",
      "だれでも、みんな"
    ],
    "distractorsEn": [
      "anything",
      "one",
      "everyone"
    ],
    "sentenceEn": [
      "Tom",
      "wrote",
      "something",
      "in",
      "his",
      "notebook."
    ],
    "sentenceJa": "トムはノートに何か書いた",
    "sentenceDistractors": [
      "life",
      "show"
    ]
  },
  {
    "num": "0343",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "anything",
    "phonetic": "[éniθiŋ]",
    "partOfSpeech": "代名詞",
    "japanese": "(疑問文, ifの文で)何か、(否定文で)何も、(肯定文で)何でも",
    "tip": "[読み: エニスィング] / カテゴリ: 代名詞",
    "distractorsJa": [
      "(肯定文で)何か、あるもの",
      "もう1つ、別のもの、別の人、もう1つの、もう1人の、別の",
      "(前に出た数えられる名詞の代わりとして)もの、1つ、1つの、ある、1"
    ],
    "distractorsEn": [
      "something",
      "another",
      "one"
    ],
    "sentenceEn": [
      "Is",
      "there",
      "anything",
      "in",
      "the",
      "box?"
    ],
    "sentenceJa": "その箱の中に何か入っていますか",
    "sentenceDistractors": [
      "player",
      "language"
    ]
  },
  {
    "num": "0344",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "everyone",
    "phonetic": "[évriwʌn]",
    "partOfSpeech": "代名詞",
    "japanese": "だれでも、みんな",
    "tip": "[読み: エヴリワン] / カテゴリ: 代名詞 / 類義/関連: 同意語:everybody(だれでも、みんな)",
    "distractorsJa": [
      "(疑問文, ifの文で)何か、(否定文で)何も、(肯定文で)何でも",
      "もう1つ、別のもの、別の人、もう1つの、もう1人の、別の",
      "(肯定文で)何か、あるもの"
    ],
    "distractorsEn": [
      "anything",
      "another",
      "something"
    ],
    "sentenceEn": [
      "Everyone",
      "knows",
      "a",
      "lot",
      "about",
      "the",
      "actor."
    ],
    "sentenceJa": "（だれでもその俳優についていろいろ知っている）",
    "sentenceDistractors": [
      "foreign",
      "easy"
    ]
  },
  {
    "num": "0345",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "better",
    "phonetic": "[bétər]",
    "partOfSpeech": "形容詞",
    "japanese": "(goodの比較級)よりよい、(wellの比較級)よくなって、(wellの比較級)よりじょうずに、より以上に",
    "tip": "[読み: ベタァ] / カテゴリ: 比較表現",
    "distractorsJa": [
      "(many, muchの比較級)もっと多い、(muchの比較級)もっと、(more＋形容詞, 副詞で)もっと〜",
      "たくさんの、たいへん、(比較級または最上級を強めて)ずっと",
      "(good, wellの最上級)最もよい、(wellの最上級)最もよく、最もじょうずに、いちばん〜"
    ],
    "distractorsEn": [
      "more",
      "much",
      "best"
    ],
    "sentenceEn": [
      "This",
      "shirt",
      "is",
      "better",
      "than",
      "that",
      "one."
    ],
    "sentenceJa": "このシャツはあのシャツよりよい",
    "sentenceDistractors": [
      "please",
      "may"
    ]
  },
  {
    "num": "0346",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "best",
    "phonetic": "[best]",
    "partOfSpeech": "形容詞",
    "japanese": "(good, wellの最上級)最もよい、(wellの最上級)最もよく、最もじょうずに、いちばん〜",
    "tip": "[読み: ベスト] / カテゴリ: 比較表現",
    "distractorsJa": [
      "(goodの比較級)よりよい、(wellの比較級)よくなって、(wellの比較級)よりじょうずに、より以上に",
      "(many, muchの比較級)もっと多い、(muchの比較級)もっと、(more＋形容詞, 副詞で)もっと〜",
      "たくさんの、たいへん、(比較級または最上級を強めて)ずっと"
    ],
    "distractorsEn": [
      "better",
      "more",
      "much"
    ],
    "sentenceEn": [
      "This",
      "is",
      "the",
      "best",
      "movie",
      "I",
      "have",
      "ever",
      "seen."
    ],
    "sentenceJa": "これは私が今までに見た最もよい映画だ",
    "sentenceDistractors": [
      "job",
      "practice"
    ]
  },
  {
    "num": "0347",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "much",
    "phonetic": "[mʌtʃ]",
    "partOfSpeech": "形容詞",
    "japanese": "たくさんの、たいへん、(比較級または最上級を強めて)ずっと",
    "tip": "[読み: マッチ] / カテゴリ: 比較表現 / フレーズ例: much younger (ずっと若い)",
    "distractorsJa": [
      "(good, wellの最上級)最もよい、(wellの最上級)最もよく、最もじょうずに、いちばん〜",
      "(many, muchの比較級)もっと多い、(muchの比較級)もっと、(more＋形容詞, 副詞で)もっと〜",
      "(goodの比較級)よりよい、(wellの比較級)よくなって、(wellの比較級)よりじょうずに、より以上に"
    ],
    "distractorsEn": [
      "best",
      "more",
      "better"
    ],
    "sentenceEn": [
      "Do",
      "you",
      "put",
      "much",
      "sugar",
      "in",
      "your",
      "coffee?"
    ],
    "sentenceJa": "あなたはコーヒーにたくさん砂糖を入れますか",
    "sentenceDistractors": [
      "happy",
      "need"
    ]
  },
  {
    "num": "0348",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "more",
    "phonetic": "[mɔ́ːr]",
    "partOfSpeech": "形容詞",
    "japanese": "(many, muchの比較級)もっと多い、(muchの比較級)もっと、(more＋形容詞, 副詞で)もっと〜",
    "tip": "[読み: モー] / カテゴリ: 比較表現 / フレーズ例: more difficult (もっと難しい)",
    "distractorsJa": [
      "(good, wellの最上級)最もよい、(wellの最上級)最もよく、最もじょうずに、いちばん〜",
      "(goodの比較級)よりよい、(wellの比較級)よくなって、(wellの比較級)よりじょうずに、より以上に",
      "たくさんの、たいへん、(比較級または最上級を強めて)ずっと"
    ],
    "distractorsEn": [
      "best",
      "better",
      "much"
    ],
    "sentenceEn": [
      "There",
      "are",
      "more",
      "girls",
      "than",
      "boys",
      "in",
      "our",
      "class."
    ],
    "sentenceJa": "私たちのクラスは男子より女子のほうが多い",
    "sentenceDistractors": [
      "come",
      "our"
    ]
  },
  {
    "num": "0349",
    "level": 6,
    "stageSlug": "eiken4_stage06",
    "english": "than",
    "phonetic": "[ðæn]",
    "partOfSpeech": "接続詞",
    "japanese": "(比較級のあとにおいて)〜よりも",
    "tip": "[読み: ザン] / カテゴリ: 比較表現 / フレーズ例: taller than him (彼よりも背が高い)",
    "distractorsJa": [
      "もし〜ならば",
      "しかし",
      "か〜、かあるいは〜"
    ],
    "distractorsEn": [
      "if",
      "but",
      "or"
    ],
    "sentenceEn": [
      "Aya",
      "is",
      "taller",
      "than",
      "Tom."
    ],
    "sentenceJa": "アヤはトムよりも背が高い",
    "sentenceDistractors": [
      "man",
      "two"
    ]
  },
  {
    "num": "0350",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "shower",
    "phonetic": "[ʃáuər]",
    "partOfSpeech": "名詞",
    "japanese": "シャワー",
    "tip": "[読み: シャウア] / カテゴリ: 家の中 / フレーズ例: take a shower (シャワーを浴びる)",
    "distractorsJa": [
      "絵、絵画、絵をかくこと",
      "消しゴム，黒板消し",
      "芸術家、画家"
    ],
    "distractorsEn": [
      "painting",
      "eraser",
      "artist"
    ],
    "sentenceEn": [
      "I",
      "take",
      "a",
      "shower",
      "every",
      "morning."
    ],
    "sentenceJa": "私は毎朝シャワーを浴びます。",
    "sentenceDistractors": [
      "rainbow",
      "hey"
    ]
  },
  {
    "num": "0351",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "bath",
    "phonetic": "[bǽθ]",
    "partOfSpeech": "名詞",
    "japanese": "風呂",
    "tip": "[読み: バス] / カテゴリ: 家の中 / 類義/関連: 関連語:bathroom(浴室), 関連語:bathtub(浴そう) / フレーズ例: take a bath (風呂に入る)",
    "distractorsJa": [
      "スーパーマーケット",
      "ボート，(小型の)船",
      "制服，ユニフォーム"
    ],
    "distractorsEn": [
      "supermarket",
      "boat",
      "uniform"
    ],
    "sentenceEn": [
      "He",
      "usually",
      "takes",
      "a",
      "bath",
      "at",
      "eleven",
      "o'clock."
    ],
    "sentenceJa": "(彼はふつう11時に入浴する)",
    "sentenceDistractors": [
      "effort",
      "society"
    ]
  },
  {
    "num": "0352",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "bathroom",
    "phonetic": "[bǽθruːm]",
    "partOfSpeech": "名詞",
    "japanese": "浴室，トイレ",
    "tip": "[読み: バスルーム] / カテゴリ: 家の中",
    "distractorsJa": [
      "漫画本，コミック",
      "タクシー",
      "郵便局"
    ],
    "distractorsEn": [
      "comic",
      "taxi",
      "post office"
    ],
    "sentenceEn": [
      "The",
      "bathroom",
      "is",
      "at",
      "the",
      "end",
      "of",
      "the",
      "hall."
    ],
    "sentenceJa": "バスルームは廊下の突き当りにあります。",
    "sentenceDistractors": [
      "bat",
      "Pacific"
    ]
  },
  {
    "num": "0353",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "towel",
    "phonetic": "[táu(ə)l]",
    "partOfSpeech": "名詞",
    "japanese": "タオル",
    "tip": "[読み: タウ(エ)る] / カテゴリ: 家の中 / メモ: 発音注意",
    "distractorsJa": [
      "ガラス，コップ",
      "劇場",
      "犬小屋"
    ],
    "distractorsEn": [
      "glass",
      "theater",
      "doghouse"
    ],
    "sentenceEn": [
      "I",
      "need",
      "a",
      "towel."
    ],
    "sentenceJa": "タオルが必要です。",
    "sentenceDistractors": [
      "avoid",
      "traveler"
    ]
  },
  {
    "num": "0354",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "phone",
    "phonetic": "[foun]",
    "partOfSpeech": "名詞",
    "japanese": "電話、(に)電話をかける",
    "tip": "[読み: フォウン] / カテゴリ: 家の中 / 類義/関連: 同意語:telephone(電話)",
    "distractorsJa": [
      "社会科",
      "農場，農園",
      "タクシー"
    ],
    "distractorsEn": [
      "social studies",
      "farm",
      "taxi"
    ],
    "sentenceEn": [
      "Please",
      "tell",
      "me",
      "your",
      "phone",
      "number."
    ],
    "sentenceJa": "あなたの電話番号を教えてください",
    "sentenceDistractors": [
      "cry",
      "math"
    ]
  },
  {
    "num": "0355",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "radio",
    "phonetic": "[réidiou]",
    "partOfSpeech": "名詞",
    "japanese": "ラジオ",
    "tip": "[読み: レイディオウ] / カテゴリ: 家の中 / メモ: 発音注意",
    "distractorsJa": [
      "戸，ドア",
      "ソファー",
      "飛行機"
    ],
    "distractorsEn": [
      "door",
      "sofa",
      "plane"
    ],
    "sentenceEn": [
      "The",
      "soccer",
      "game",
      "is",
      "on",
      "the",
      "radio",
      "now."
    ],
    "sentenceJa": "今、ラジオでそのサッカーの試合をやっている",
    "sentenceDistractors": [
      "market",
      "middle"
    ]
  },
  {
    "num": "0356",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "newspaper",
    "phonetic": "[núːzpèipər]",
    "partOfSpeech": "名詞",
    "japanese": "新聞",
    "tip": "[読み: ニューズペイパァ] / カテゴリ: 家の中",
    "distractorsJa": [
      "飛行機",
      "写真",
      "戸，ドア"
    ],
    "distractorsEn": [
      "plane",
      "photo",
      "door"
    ],
    "sentenceEn": [
      "I",
      "read",
      "the",
      "story",
      "in",
      "today’s",
      "newspaper."
    ],
    "sentenceJa": "私は今日の新聞でその話を読んだ。",
    "sentenceDistractors": [
      "everything",
      "actually"
    ]
  },
  {
    "num": "0357",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "photo",
    "phonetic": "[fóutou]",
    "partOfSpeech": "名詞",
    "japanese": "写真",
    "tip": "[読み: フォウトウ] / カテゴリ: 家の中 / 類義/関連: 同意語:picture(絵，写真)",
    "distractorsJa": [
      "飛行機",
      "ホームステイ",
      "ソファー"
    ],
    "distractorsEn": [
      "airplane",
      "homestay",
      "sofa"
    ],
    "sentenceEn": [
      "I",
      "will",
      "send",
      "you",
      "a",
      "photo",
      "of",
      "my",
      "family."
    ],
    "sentenceJa": "私はあなたに私の家族の写真を1枚送ります",
    "sentenceDistractors": [
      "juice",
      "flight"
    ]
  },
  {
    "num": "0358",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "comic",
    "phonetic": "[kɑ́(:)mik]",
    "partOfSpeech": "名詞",
    "japanese": "漫画本，コミック",
    "tip": "[読み: カ(ー)ミック] / カテゴリ: 家の中",
    "distractorsJa": [
      "飛行機",
      "日付，デート",
      "運転手、ドライバー"
    ],
    "distractorsEn": [
      "plane",
      "date",
      "driver"
    ],
    "sentenceEn": [
      "Do",
      "you",
      "like",
      "to",
      "read",
      "comics?"
    ],
    "sentenceJa": "(マンガ本を読むのは好きですか)",
    "sentenceDistractors": [
      "soybean",
      "slow"
    ]
  },
  {
    "num": "0359",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "sofa",
    "phonetic": "[sóufə]",
    "partOfSpeech": "名詞",
    "japanese": "ソファー",
    "tip": "[読み: ソウファ] / カテゴリ: 家の中",
    "distractorsJa": [
      "旅行、(を)旅行する",
      "日付，デート",
      "喫茶店，カフェ"
    ],
    "distractorsEn": [
      "travel",
      "date",
      "café"
    ],
    "sentenceEn": [
      "My",
      "cat",
      "is",
      "sleeping",
      "on",
      "the",
      "sofa."
    ],
    "sentenceJa": "私の猫がソファーの上で眠っています。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0360",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "door",
    "phonetic": "[dɔ́ːr]",
    "partOfSpeech": "名詞",
    "japanese": "戸，ドア",
    "tip": "[読み: ドー] / カテゴリ: 家の中",
    "distractorsJa": [
      "ホームステイ",
      "ソファー",
      "自転車"
    ],
    "distractorsEn": [
      "homestay",
      "sofa",
      "bicycle"
    ],
    "sentenceEn": [
      "The",
      "man",
      "opened",
      "the",
      "door",
      "for",
      "me."
    ],
    "sentenceJa": "その男の人は私のためにドアを開けてくれた。",
    "sentenceDistractors": [
      "fall",
      "village"
    ]
  },
  {
    "num": "0361",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "glass",
    "phonetic": "[glǽs]",
    "partOfSpeech": "名詞",
    "japanese": "ガラス，コップ",
    "tip": "[読み: グラス] / カテゴリ: 家の中 / フレーズ例: a glass of ~ (コップ1杯の〜)",
    "distractorsJa": [
      "テント",
      "運転手、ドライバー",
      "ラジオ"
    ],
    "distractorsEn": [
      "tent",
      "driver",
      "radio"
    ],
    "sentenceEn": [
      "This",
      "bottle",
      "is",
      "made",
      "of",
      "glass."
    ],
    "sentenceJa": "(このびんはガラスでできている)",
    "sentenceDistractors": [
      "roll",
      "south"
    ]
  },
  {
    "num": "0362",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "knife",
    "phonetic": "[naif]",
    "partOfSpeech": "名詞",
    "japanese": "ナイフ",
    "tip": "[読み: ナイフ] / カテゴリ: 家の中 / メモ: 発音注意",
    "distractorsJa": [
      "漫画本，コミック",
      "贈り物",
      "絵、絵画、絵をかくこと"
    ],
    "distractorsEn": [
      "comic",
      "gift",
      "painting"
    ],
    "sentenceEn": [
      "Be",
      "careful",
      "with",
      "that",
      "knife."
    ],
    "sentenceJa": "そのナイフには気をつけてください。",
    "sentenceDistractors": [
      "cousin",
      "gesture"
    ]
  },
  {
    "num": "0363",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "wallet",
    "phonetic": "[wɑ́(:)lət]",
    "partOfSpeech": "名詞",
    "japanese": "さいふ，札入れ",
    "tip": "[読み: ワ(ー)レット] / カテゴリ: 家の中 / 類義/関連: 関連語:purse(小銭入れ)",
    "distractorsJa": [
      "郵便局",
      "運転手、ドライバー",
      "黒板"
    ],
    "distractorsEn": [
      "post office",
      "driver",
      "blackboard"
    ],
    "sentenceEn": [
      "I",
      "lost",
      "my",
      "wallet."
    ],
    "sentenceJa": "財布をなくしました。",
    "sentenceDistractors": [
      "score",
      "sale"
    ]
  },
  {
    "num": "0364",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "calendar",
    "phonetic": "[kǽləndər]",
    "partOfSpeech": "名詞",
    "japanese": "カレンダー",
    "tip": "[読み: キャレンダァ] / カテゴリ: 家の中 / メモ: アクセント注意",
    "distractorsJa": [
      "頭痛",
      "地図",
      "農場，農園"
    ],
    "distractorsEn": [
      "headache",
      "map",
      "farm"
    ],
    "sentenceEn": [
      "My",
      "father",
      "hung",
      "the",
      "calendar",
      "on",
      "the",
      "wall."
    ],
    "sentenceJa": "父はそのカレンダーを壁にかけた",
    "sentenceDistractors": [
      "tourist",
      "ice"
    ]
  },
  {
    "num": "0365",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "ruler",
    "phonetic": "[rúːlər]",
    "partOfSpeech": "名詞",
    "japanese": "定規",
    "tip": "[読み: ルーラァ] / カテゴリ: 家の中",
    "distractorsJa": [
      "ドラマ，演劇",
      "消しゴム，黒板消し",
      "ナイフ"
    ],
    "distractorsEn": [
      "drama",
      "eraser",
      "knife"
    ],
    "sentenceEn": [
      "May",
      "I",
      "borrow",
      "your",
      "ruler",
      "for",
      "a",
      "minute?"
    ],
    "sentenceJa": "少しの間あなたの定規を借りてもいいですか。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0366",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "toy",
    "phonetic": "[tɔi]",
    "partOfSpeech": "名詞",
    "japanese": "おもちゃ",
    "tip": "[読み: トイ] / カテゴリ: 家の中",
    "distractorsJa": [
      "浴室，トイレ",
      "制服，ユニフォーム",
      "ラジオ"
    ],
    "distractorsEn": [
      "bathroom",
      "uniform",
      "radio"
    ],
    "sentenceEn": [
      "The",
      "baby",
      "played",
      "with",
      "a",
      "toy."
    ],
    "sentenceJa": "(その赤ちゃんはおもちゃで遊んだ)",
    "sentenceDistractors": [
      "smart",
      "friendship"
    ]
  },
  {
    "num": "0367",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "doghouse",
    "phonetic": "[dɔ́(:)ghàus]",
    "partOfSpeech": "名詞",
    "japanese": "犬小屋",
    "tip": "[読み: ド(ー)グハウス] / カテゴリ: 家の中",
    "distractorsJa": [
      "紙，答案用紙",
      "スーパーマーケット",
      "質問，問題"
    ],
    "distractorsEn": [
      "paper",
      "supermarket",
      "question"
    ],
    "sentenceEn": [
      "We",
      "made",
      "a",
      "new",
      "doghouse",
      "in",
      "the",
      "yard."
    ],
    "sentenceJa": "私たちは庭に新しい犬小屋を作りました。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0368",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "date",
    "phonetic": "[deit]",
    "partOfSpeech": "名詞",
    "japanese": "日付，デート",
    "tip": "[読み: デイト] / カテゴリ: 時間",
    "distractorsJa": [
      "休み，休暇",
      "犬小屋",
      "ホームステイ"
    ],
    "distractorsEn": [
      "vacation",
      "doghouse",
      "homestay"
    ],
    "sentenceEn": [
      "What's",
      "the",
      "date",
      "of",
      "the",
      "school",
      "festival?"
    ],
    "sentenceJa": "(学園祭の日はいつですか)",
    "sentenceDistractors": [
      "repair",
      "respect"
    ]
  },
  {
    "num": "0369",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "noon",
    "phonetic": "[nuːn]",
    "partOfSpeech": "名詞",
    "japanese": "正午，昼の12時",
    "tip": "[読み: ヌーン] / カテゴリ: 時間 / フレーズ例: before noon (正午前に)",
    "distractorsJa": [
      "祭り，〜祭",
      "スーパーマーケット",
      "ホール，ろう下"
    ],
    "distractorsEn": [
      "festival",
      "supermarket",
      "hall"
    ],
    "sentenceEn": [
      "The",
      "meeting",
      "will",
      "start",
      "at",
      "noon."
    ],
    "sentenceJa": "会議は正午に始まります。",
    "sentenceDistractors": [
      "wallet",
      "rope"
    ]
  },
  {
    "num": "0370",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "dictionary",
    "phonetic": "[díkʃənèri]",
    "partOfSpeech": "名詞",
    "japanese": "辞書，辞典",
    "tip": "[読み: ディクショネリィ] / カテゴリ: 学校 / フレーズ例: an English-Japanese dictionary (英和辞典)",
    "distractorsJa": [
      "喜劇、コメディー",
      "歌手",
      "紙，答案用紙"
    ],
    "distractorsEn": [
      "comedy",
      "singer",
      "paper"
    ],
    "sentenceEn": [
      "May",
      "I",
      "use",
      "my",
      "dictionary",
      "in",
      "the",
      "test?"
    ],
    "sentenceJa": "（テストで辞書を使ってもいいですか）",
    "sentenceDistractors": [
      "design",
      "head"
    ]
  },
  {
    "num": "0371",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "paper",
    "phonetic": "[péipər]",
    "partOfSpeech": "名詞",
    "japanese": "紙，答案用紙",
    "tip": "[読み: ペイパァ] / カテゴリ: 学校 / フレーズ例: a piece of paper (1枚の紙)",
    "distractorsJa": [
      "正午，昼の12時",
      "旅行、(を)旅行する",
      "定規"
    ],
    "distractorsEn": [
      "noon",
      "travel",
      "ruler"
    ],
    "sentenceEn": [
      "This",
      "box",
      "is",
      "made",
      "of",
      "paper."
    ],
    "sentenceJa": "この箱は紙でできている",
    "sentenceDistractors": [
      "tomorrow",
      "wonderful"
    ]
  },
  {
    "num": "0372",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "question",
    "phonetic": "[kwéstʃ(ə)n]",
    "partOfSpeech": "名詞",
    "japanese": "質問，問題",
    "tip": "[読み: クウェスチョン] / カテゴリ: 学校 / 類義/関連: 反意語:answer(答え)",
    "distractorsJa": [
      "紙，答案用紙",
      "ガラス，コップ",
      "ソファー"
    ],
    "distractorsEn": [
      "paper",
      "glass",
      "sofa"
    ],
    "sentenceEn": [
      "I",
      "have",
      "a",
      "question",
      "about",
      "this",
      "math",
      "problem."
    ],
    "sentenceJa": "私はこの数学の問題について質問がある",
    "sentenceDistractors": [
      "food",
      "thank"
    ]
  },
  {
    "num": "0373",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "floor",
    "phonetic": "[flɔ́ːr]",
    "partOfSpeech": "名詞",
    "japanese": "床，(建物の)〜階",
    "tip": "[読み: フロー] / カテゴリ: 学校 / フレーズ例: the first floor (1階)",
    "distractorsJa": [
      "ガラス，コップ",
      "正午，昼の12時",
      "郵便局"
    ],
    "distractorsEn": [
      "glass",
      "noon",
      "post office"
    ],
    "sentenceEn": [
      "Be",
      "careful!",
      "The",
      "floor",
      "is",
      "wet."
    ],
    "sentenceJa": "気をつけて！ 床がぬれています",
    "sentenceDistractors": [
      "along",
      "forward"
    ]
  },
  {
    "num": "0374",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "classroom",
    "phonetic": "[klǽsruːm]",
    "partOfSpeech": "名詞",
    "japanese": "教室",
    "tip": "[読み: クラスルーム] / カテゴリ: 学校",
    "distractorsJa": [
      "浴室，トイレ",
      "正午，昼の12時",
      "ガラス，コップ"
    ],
    "distractorsEn": [
      "bathroom",
      "noon",
      "glass"
    ],
    "sentenceEn": [
      "Our",
      "classroom",
      "is",
      "on",
      "the",
      "second",
      "floor."
    ],
    "sentenceJa": "私たちの教室は 2 階にある",
    "sentenceDistractors": [
      "China",
      "evening"
    ]
  },
  {
    "num": "0375",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "blackboard",
    "phonetic": "[blǽkbɔ̀ːrd]",
    "partOfSpeech": "名詞",
    "japanese": "黒板",
    "tip": "[読み: ブラックボード] / カテゴリ: 学校",
    "distractorsJa": [
      "ピアニスト",
      "筆者、作家",
      "自転車"
    ],
    "distractorsEn": [
      "pianist",
      "writer",
      "bicycle"
    ],
    "sentenceEn": [
      "The",
      "teacher",
      "wrote",
      "new",
      "words",
      "on",
      "the",
      "blackboard."
    ],
    "sentenceJa": "先生は黒板に新しい単語を書きました。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0376",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "eraser",
    "phonetic": "[iréisər]",
    "partOfSpeech": "名詞",
    "japanese": "消しゴム，黒板消し",
    "tip": "[読み: イレイサァ] / カテゴリ: 学校",
    "distractorsJa": [
      "人々",
      "犬小屋",
      "日付，デート"
    ],
    "distractorsEn": [
      "people",
      "doghouse",
      "date"
    ],
    "sentenceEn": [
      "I",
      "dropped",
      "my",
      "eraser",
      "under",
      "the",
      "desk."
    ],
    "sentenceJa": "私は机の下に消しゴムを落としました。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0377",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "map",
    "phonetic": "[mǽp]",
    "partOfSpeech": "名詞",
    "japanese": "地図",
    "tip": "[読み: マップ] / カテゴリ: 学校 / フレーズ例: a world map (世界地図)",
    "distractorsJa": [
      "ボート，(小型の)船",
      "飛行機",
      "人々"
    ],
    "distractorsEn": [
      "boat",
      "airplane",
      "people"
    ],
    "sentenceEn": [
      "I'll",
      "draw",
      "you",
      "a",
      "map",
      "to",
      "my",
      "house."
    ],
    "sentenceJa": "私の家までの地図を描いてあげましょう",
    "sentenceDistractors": [
      "left",
      "Africa"
    ]
  },
  {
    "num": "0378",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "uniform",
    "phonetic": "[júːnəfɔ̀ːrm]",
    "partOfSpeech": "名詞",
    "japanese": "制服，ユニフォーム",
    "tip": "[読み: ユーニフォーム] / カテゴリ: 学校",
    "distractorsJa": [
      "地図",
      "ナイフ",
      "テント"
    ],
    "distractorsEn": [
      "map",
      "knife",
      "tent"
    ],
    "sentenceEn": [
      "All",
      "students",
      "must",
      "wear",
      "a",
      "uniform."
    ],
    "sentenceJa": "すべての生徒は制服を着用しなければなりません。",
    "sentenceDistractors": [
      "normal",
      "actor"
    ]
  },
  {
    "num": "0379",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "grade",
    "phonetic": "[greid]",
    "partOfSpeech": "名詞",
    "japanese": "成績の点数，学年",
    "tip": "[読み: グレイド] / カテゴリ: 学校 / フレーズ例: get a good grade (よい成績をとる)",
    "distractorsJa": [
      "自転車",
      "日付，デート",
      "制服，ユニフォーム"
    ],
    "distractorsEn": [
      "bicycle",
      "date",
      "uniform"
    ],
    "sentenceEn": [
      "He",
      "is",
      "in",
      "the",
      "sixth",
      "grade."
    ],
    "sentenceJa": "彼は6年生です。",
    "sentenceDistractors": [
      "chemical",
      "process"
    ]
  },
  {
    "num": "0380",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "drama",
    "phonetic": "[drɑ́ːmə]",
    "partOfSpeech": "名詞",
    "japanese": "ドラマ，演劇",
    "tip": "[読み: ドゥラーマ] / カテゴリ: 学校 / 類義/関連: 同意語:play(劇)",
    "distractorsJa": [
      "質問，問題",
      "おもちゃ",
      "飛行機"
    ],
    "distractorsEn": [
      "question",
      "toy",
      "plane"
    ],
    "sentenceEn": [
      "I",
      "watched",
      "a",
      "historical",
      "drama",
      "on",
      "TV",
      "last",
      "night."
    ],
    "sentenceJa": "昨夜、テレビで時代劇を見ました。",
    "sentenceDistractors": [
      "bottom",
      "empty"
    ]
  },
  {
    "num": "0381",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "social studies",
    "phonetic": "[sóuʃ(ə)l stʌ́diz]",
    "partOfSpeech": "名詞",
    "japanese": "社会科",
    "tip": "[読み: ソウシャル スタディズ] / カテゴリ: 学校",
    "distractorsJa": [
      "犬小屋",
      "喫茶店，カフェ",
      "電話、(に)電話をかける"
    ],
    "distractorsEn": [
      "doghouse",
      "café",
      "phone"
    ],
    "sentenceEn": [
      "Social",
      "studies",
      "is",
      "my",
      "favorite",
      "subject",
      "at",
      "school."
    ],
    "sentenceJa": "社会科は学校で私の一番好きな教科です。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0382",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "bicycle",
    "phonetic": "[báisikl]",
    "partOfSpeech": "名詞",
    "japanese": "自転車",
    "tip": "[読み: バイシクル] / カテゴリ: 町の中 / 類義/関連: 同意語:bike(自転車)",
    "distractorsJa": [
      "生まれ故郷",
      "浴室，トイレ",
      "運転手、ドライバー"
    ],
    "distractorsEn": [
      "hometown",
      "bathroom",
      "driver"
    ],
    "sentenceEn": [
      "Can",
      "you",
      "ride",
      "a",
      "bicycle?"
    ],
    "sentenceJa": "(あなたは自転車に乗れますか)",
    "sentenceDistractors": [
      "stage",
      "introduce"
    ]
  },
  {
    "num": "0383",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "taxi",
    "phonetic": "[tǽksi]",
    "partOfSpeech": "名詞",
    "japanese": "タクシー",
    "tip": "[読み: タクシィ] / カテゴリ: 町の中 / フレーズ例: by taxi (タクシーで)",
    "distractorsJa": [
      "橋",
      "風呂",
      "新聞"
    ],
    "distractorsEn": [
      "bridge",
      "bath",
      "newspaper"
    ],
    "sentenceEn": [
      "Let's",
      "take",
      "a",
      "taxi."
    ],
    "sentenceJa": "タクシーに乗りましょう。",
    "sentenceDistractors": [
      "pain",
      "shock"
    ]
  },
  {
    "num": "0384",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "airplane",
    "phonetic": "[ɛ́ərplèin]",
    "partOfSpeech": "名詞",
    "japanese": "飛行機",
    "tip": "[読み: エアプレイン] / カテゴリ: 町の中",
    "distractorsJa": [
      "カレンダー",
      "さいふ，札入れ",
      "歌手"
    ],
    "distractorsEn": [
      "calendar",
      "wallet",
      "singer"
    ],
    "sentenceEn": [
      "The",
      "airplane",
      "took",
      "off",
      "on",
      "time."
    ],
    "sentenceJa": "その飛行機は時間通りに離陸しました。",
    "sentenceDistractors": [
      "polite",
      "gun"
    ]
  },
  {
    "num": "0385",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "plane",
    "phonetic": "[plein]",
    "partOfSpeech": "名詞",
    "japanese": "飛行機",
    "tip": "[読み: プレイン] / カテゴリ: 町の中",
    "distractorsJa": [
      "黒板",
      "生まれ故郷",
      "紙，答案用紙"
    ],
    "distractorsEn": [
      "blackboard",
      "hometown",
      "paper"
    ],
    "sentenceEn": [
      "Can",
      "I",
      "carry",
      "this",
      "bag",
      "with",
      "me",
      "on",
      "to",
      "the",
      "plane?"
    ],
    "sentenceJa": "このバッグは飛行機に持ち込めますか",
    "sentenceDistractors": [
      "half",
      "goal"
    ]
  },
  {
    "num": "0386",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "boat",
    "phonetic": "[bout]",
    "partOfSpeech": "名詞",
    "japanese": "ボート，(小型の)船",
    "tip": "[読み: ボウト] / カテゴリ: 町の中 / 類義/関連: 同意語:ship((大型の)船)",
    "distractorsJa": [
      "風呂",
      "社会科",
      "歌手"
    ],
    "distractorsEn": [
      "bath",
      "social studies",
      "singer"
    ],
    "sentenceEn": [
      "We",
      "went",
      "fishing",
      "in",
      "a",
      "boat",
      "yesterday."
    ],
    "sentenceJa": "(私たちは昨日, ボートで釣りに行った)",
    "sentenceDistractors": [
      "tournament",
      "gym"
    ]
  },
  {
    "num": "0387",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "bridge",
    "phonetic": "[bridʒ]",
    "partOfSpeech": "名詞",
    "japanese": "橋",
    "tip": "[読み: ブリッヂ] / カテゴリ: 町の中",
    "distractorsJa": [
      "ラジオ",
      "ホール，ろう下",
      "質問，問題"
    ],
    "distractorsEn": [
      "radio",
      "hall",
      "question"
    ],
    "sentenceEn": [
      "Many",
      "cars",
      "and",
      "trucks",
      "go",
      "over",
      "the",
      "bridge."
    ],
    "sentenceJa": "多くの車とトラックがその橋を渡る",
    "sentenceDistractors": [
      "elderly",
      "mine"
    ]
  },
  {
    "num": "0388",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "supermarket",
    "phonetic": "[súːpərmɑ̀ːrkət]",
    "partOfSpeech": "名詞",
    "japanese": "スーパーマーケット",
    "tip": "[読み: スーパーマーケット] / カテゴリ: 町の中",
    "distractorsJa": [
      "胃痛、腹痛",
      "飛行機",
      "タオル"
    ],
    "distractorsEn": [
      "stomachache",
      "plane",
      "towel"
    ],
    "sentenceEn": [
      "My",
      "mother",
      "bought",
      "some",
      "eggs",
      "at",
      "the",
      "supermarket."
    ],
    "sentenceJa": "(母はスーパーマーケットで卵をいくつか買った)",
    "sentenceDistractors": [
      "friendship",
      "tournament"
    ]
  },
  {
    "num": "0389",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "café",
    "phonetic": "[kæféi]",
    "partOfSpeech": "名詞",
    "japanese": "喫茶店，カフェ",
    "tip": "[読み: キャフェイ] / カテゴリ: 町の中",
    "distractorsJa": [
      "郵便局",
      "祭り，〜祭",
      "運転手、ドライバー"
    ],
    "distractorsEn": [
      "post office",
      "festival",
      "driver"
    ],
    "sentenceEn": [
      "We",
      "talked",
      "over",
      "coffee",
      "at",
      "an",
      "outdoor",
      "café."
    ],
    "sentenceJa": "私たちはオープンカフェでコーヒーを飲みながら話した。",
    "sentenceDistractors": [
      "none",
      "colorful"
    ]
  },
  {
    "num": "0390",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "post office",
    "phonetic": "[póust à(:)fəs]",
    "partOfSpeech": "名詞",
    "japanese": "郵便局",
    "tip": "[読み: ポウスト ア(ー)フィス] / カテゴリ: 町の中",
    "distractorsJa": [
      "成績の点数，学年",
      "人々",
      "飛行機"
    ],
    "distractorsEn": [
      "grade",
      "people",
      "airplane"
    ],
    "sentenceEn": [
      "She",
      "went",
      "to",
      "the",
      "post",
      "office",
      "to",
      "buy",
      "some",
      "stamps."
    ],
    "sentenceJa": "彼女は切手を買うために郵便局に行った。",
    "sentenceDistractors": [
      "slow",
      "luck"
    ]
  },
  {
    "num": "0391",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "stadium",
    "phonetic": "[stéidiəm]",
    "partOfSpeech": "名詞",
    "japanese": "スタジアム，競技場，野球場",
    "tip": "[読み: ステイディアム] / カテゴリ: 町の中",
    "distractorsJa": [
      "犬小屋",
      "おもちゃ",
      "浴室，トイレ"
    ],
    "distractorsEn": [
      "doghouse",
      "toy",
      "bathroom"
    ],
    "sentenceEn": [
      "The",
      "stadium",
      "was",
      "crowded",
      "with",
      "soccer",
      "fans."
    ],
    "sentenceJa": "(競技場はサッカーファンで混雑していた)",
    "sentenceDistractors": [
      "relax",
      "community"
    ]
  },
  {
    "num": "0392",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "theater",
    "phonetic": "[θíːətər]",
    "partOfSpeech": "名詞",
    "japanese": "劇場",
    "tip": "[読み: スィアタァ] / カテゴリ: 町の中 / フレーズ例: a movie theater (映画館)",
    "distractorsJa": [
      "歌手",
      "農場，農園",
      "休み，休暇"
    ],
    "distractorsEn": [
      "singer",
      "farm",
      "vacation"
    ],
    "sentenceEn": [
      "Let's",
      "go",
      "to",
      "the",
      "theater",
      "to",
      "see",
      "the",
      "play."
    ],
    "sentenceJa": "その芝居を見に劇場へ行こう",
    "sentenceDistractors": [
      "improve",
      "instead"
    ]
  },
  {
    "num": "0393",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "hall",
    "phonetic": "[hɔ́ːl]",
    "partOfSpeech": "名詞",
    "japanese": "ホール，ろう下",
    "tip": "[読み: ホール] / カテゴリ: 町の中 / フレーズ例: city hall (市役所)",
    "distractorsJa": [
      "飛行機",
      "写真",
      "休み，休暇"
    ],
    "distractorsEn": [
      "airplane",
      "photo",
      "vacation"
    ],
    "sentenceEn": [
      "The",
      "ceremony",
      "was",
      "held",
      "in",
      "the",
      "school",
      "hall."
    ],
    "sentenceJa": "その式典は学校の講堂で行われた",
    "sentenceDistractors": [
      "born",
      "shall"
    ]
  },
  {
    "num": "0394",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "farm",
    "phonetic": "[fɑ́ːrm]",
    "partOfSpeech": "名詞",
    "japanese": "農場，農園",
    "tip": "[読み: ファーム] / カテゴリ: 町の中 / 類義/関連: 関連語:farmer(農場主)",
    "distractorsJa": [
      "角，曲がり角，すみ",
      "旅行、(を)旅行する",
      "風呂"
    ],
    "distractorsEn": [
      "corner",
      "travel",
      "bath"
    ],
    "sentenceEn": [
      "The",
      "main",
      "crop",
      "of",
      "this",
      "farm",
      "is",
      "corn."
    ],
    "sentenceJa": "この農場の主要作物はトウモロコシだ",
    "sentenceDistractors": [
      "season",
      "necessary"
    ]
  },
  {
    "num": "0395",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "corner",
    "phonetic": "[kɔ́ːrnər]",
    "partOfSpeech": "名詞",
    "japanese": "角，曲がり角，すみ",
    "tip": "[読み: コーナァ] / カテゴリ: 町の中 / フレーズ例: around the corner (角を曲がった所に)",
    "distractorsJa": [
      "郵便局",
      "橋",
      "制服，ユニフォーム"
    ],
    "distractorsEn": [
      "post office",
      "bridge",
      "uniform"
    ],
    "sentenceEn": [
      "Turn",
      "to",
      "the",
      "right",
      "at",
      "the",
      "first",
      "corner."
    ],
    "sentenceJa": "(最初の角を右に曲がってください)",
    "sentenceDistractors": [
      "plastic",
      "ski"
    ]
  },
  {
    "num": "0396",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "hometown",
    "phonetic": "[hòumtáun]",
    "partOfSpeech": "名詞",
    "japanese": "生まれ故郷",
    "tip": "[読み: ホウムタウン] / カテゴリ: 町の中",
    "distractorsJa": [
      "ボート，(小型の)船",
      "喫茶店，カフェ",
      "旅行、(を)旅行する"
    ],
    "distractorsEn": [
      "boat",
      "café",
      "travel"
    ],
    "sentenceEn": [
      "I",
      "visit",
      "my",
      "hometown",
      "twice",
      "a",
      "year."
    ],
    "sentenceJa": "私は年に2回故郷を訪れる。",
    "sentenceDistractors": [
      "nearly",
      "painter"
    ]
  },
  {
    "num": "0397",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "vacation",
    "phonetic": "[veikéiʃ(ə)n]",
    "partOfSpeech": "名詞",
    "japanese": "休み，休暇",
    "tip": "[読み: ヴェイケイション] / カテゴリ: 趣味・休日 / 類義/関連: 同意語:holiday(祝日，休暇) / フレーズ例: on vacation (休暇で)",
    "distractorsJa": [
      "ラジオ",
      "定規",
      "制服，ユニフォーム"
    ],
    "distractorsEn": [
      "radio",
      "ruler",
      "uniform"
    ],
    "sentenceEn": [
      "Do",
      "you",
      "have",
      "any",
      "plans",
      "for",
      "the",
      "summer",
      "vacation?"
    ],
    "sentenceJa": "夏休みに何か計画はありますか",
    "sentenceDistractors": [
      "rain",
      "free"
    ]
  },
  {
    "num": "0398",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "travel",
    "phonetic": "[trǽv(ə)l]",
    "partOfSpeech": "名詞",
    "japanese": "旅行、(を)旅行する",
    "tip": "[読み: トゥラヴ(ェ)る] / カテゴリ: 趣味・休日 / 類義/関連: 同意語:trip((短期間の)旅行)",
    "distractorsJa": [
      "角，曲がり角，すみ",
      "喫茶店，カフェ",
      "成績の点数，学年"
    ],
    "distractorsEn": [
      "corner",
      "café",
      "grade"
    ],
    "sentenceEn": [
      "Do",
      "you",
      "like",
      "to",
      "travel",
      "by",
      "plane?"
    ],
    "sentenceJa": "飛行機で旅行するのは好きですか",
    "sentenceDistractors": [
      "bike",
      "afternoon"
    ]
  },
  {
    "num": "0399",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "festival",
    "phonetic": "[féstəv(ə)l]",
    "partOfSpeech": "名詞",
    "japanese": "祭り，〜祭",
    "tip": "[読み: フェスティヴァる] / カテゴリ: 趣味・休日 / フレーズ例: a music festival (音楽祭)",
    "distractorsJa": [
      "浴室，トイレ",
      "地図",
      "紙，答案用紙"
    ],
    "distractorsEn": [
      "bathroom",
      "map",
      "paper"
    ],
    "sentenceEn": [
      "Did",
      "you",
      "enjoy",
      "the",
      "school",
      "festival",
      "last",
      "weekend?"
    ],
    "sentenceJa": "先週末の学園祭は楽しかったですか",
    "sentenceDistractors": [
      "own",
      "enough"
    ]
  },
  {
    "num": "0400",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "homestay",
    "phonetic": "[hóumstei]",
    "partOfSpeech": "名詞",
    "japanese": "ホームステイ",
    "tip": "[読み: ホウムステイ] / カテゴリ: 趣味・休日 / メモ: アクセント注意",
    "distractorsJa": [
      "ピアニスト",
      "カレンダー",
      "定規"
    ],
    "distractorsEn": [
      "pianist",
      "calendar",
      "ruler"
    ],
    "sentenceEn": [
      "I'm",
      "going",
      "to",
      "do",
      "a",
      "homestay",
      "in",
      "Canada."
    ],
    "sentenceJa": "私はカナダでホームステイをする予定です。",
    "sentenceDistractors": [
      "billion",
      "grade"
    ]
  },
  {
    "num": "0401",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "tent",
    "phonetic": "[tent]",
    "partOfSpeech": "名詞",
    "japanese": "テント",
    "tip": "[読み: テント] / カテゴリ: 趣味・休日",
    "distractorsJa": [
      "橋",
      "おもちゃ",
      "戸，ドア"
    ],
    "distractorsEn": [
      "bridge",
      "toy",
      "door"
    ],
    "sentenceEn": [
      "We",
      "slept",
      "in",
      "a",
      "big",
      "tent",
      "by",
      "the",
      "lake."
    ],
    "sentenceJa": "私たちは湖のそばで大きなテントに寝ました。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0402",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "painting",
    "phonetic": "[péintiŋ]",
    "partOfSpeech": "名詞",
    "japanese": "絵、絵画、絵をかくこと",
    "tip": "[読み: ペインティング] / カテゴリ: 趣味・休日",
    "distractorsJa": [
      "喜劇、コメディー",
      "風呂",
      "胃痛、腹痛"
    ],
    "distractorsEn": [
      "comedy",
      "bath",
      "stomachache"
    ],
    "sentenceEn": [
      "The",
      "museum",
      "decided",
      "to",
      "buy",
      "the",
      "famous",
      "painting."
    ],
    "sentenceJa": "(美術館はその有名な絵を購入することに決めた)",
    "sentenceDistractors": [
      "pollution",
      "dead"
    ]
  },
  {
    "num": "0403",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "comedy",
    "phonetic": "[kɑ́(:)mədi]",
    "partOfSpeech": "名詞",
    "japanese": "喜劇、コメディー",
    "tip": "[読み: カ（ー）メディ] / カテゴリ: 趣味・休日 / 類義/関連: 関連語:comedian(喜劇俳優)",
    "distractorsJa": [
      "床，(建物の)〜階",
      "ピアニスト",
      "写真"
    ],
    "distractorsEn": [
      "floor",
      "pianist",
      "photo"
    ],
    "sentenceEn": [
      "We",
      "watched",
      "a",
      "funny",
      "comedy",
      "on",
      "TV."
    ],
    "sentenceJa": "私たちはテレビで面白いコメディーを見ました。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0404",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "gift",
    "phonetic": "[gift]",
    "partOfSpeech": "名詞",
    "japanese": "贈り物",
    "tip": "[読み: ギフト] / カテゴリ: 趣味・休日",
    "distractorsJa": [
      "写真",
      "旅行、(を)旅行する",
      "スタジアム，競技場，野球場"
    ],
    "distractorsEn": [
      "photo",
      "travel",
      "stadium"
    ],
    "sentenceEn": [
      "He",
      "bought",
      "a",
      "CD",
      "as",
      "a",
      "birthday",
      "gift",
      "for",
      "Keiko."
    ],
    "sentenceJa": "彼はケイコの誕生日プレゼントとしてCDを買った",
    "sentenceDistractors": [
      "fruit",
      "medicine"
    ]
  },
  {
    "num": "0405",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "stomachache",
    "phonetic": "[stʌ́məkeik]",
    "partOfSpeech": "名詞",
    "japanese": "胃痛、腹痛",
    "tip": "[読み: スタマケイク] / カテゴリ: 身体 / メモ: 発音注意",
    "distractorsJa": [
      "教室",
      "農場，農園",
      "歌手"
    ],
    "distractorsEn": [
      "classroom",
      "farm",
      "singer"
    ],
    "sentenceEn": [
      "I",
      "have",
      "a",
      "bad",
      "stomachache",
      "today."
    ],
    "sentenceJa": "私は今日ひどい腹痛があります。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0406",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "headache",
    "phonetic": "[hédeik]",
    "partOfSpeech": "名詞",
    "japanese": "頭痛",
    "tip": "[読み: ヘデイク] / カテゴリ: 身体",
    "distractorsJa": [
      "質問，問題",
      "自転車",
      "絵、絵画、絵をかくこと"
    ],
    "distractorsEn": [
      "question",
      "bicycle",
      "painting"
    ],
    "sentenceEn": [
      "She",
      "went",
      "to",
      "bed",
      "early",
      "because",
      "of",
      "a",
      "headache."
    ],
    "sentenceJa": "彼女は頭痛のため早く寝ました。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0407",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "people",
    "phonetic": "[pí:pl]",
    "partOfSpeech": "名詞",
    "japanese": "人々",
    "tip": "[読み: ピープル] / カテゴリ: 人・職業",
    "distractorsJa": [
      "シャワー",
      "テント",
      "絵、絵画、絵をかくこと"
    ],
    "distractorsEn": [
      "shower",
      "tent",
      "painting"
    ],
    "sentenceEn": [
      "Many",
      "people",
      "enjoyed",
      "the",
      "summer",
      "festival."
    ],
    "sentenceJa": "多くの人々が夏祭りを楽しんだ",
    "sentenceDistractors": [
      "go",
      "when"
    ]
  },
  {
    "num": "0408",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "writer",
    "phonetic": "[ráitər]",
    "partOfSpeech": "名詞",
    "japanese": "筆者、作家",
    "tip": "[読み: ライタァ] / カテゴリ: 人・職業 / 類義/関連: 類義語:author(著者)",
    "distractorsJa": [
      "喫茶店，カフェ",
      "犬小屋",
      "質問，問題"
    ],
    "distractorsEn": [
      "café",
      "doghouse",
      "question"
    ],
    "sentenceEn": [
      "The",
      "writer",
      "of",
      "this",
      "book",
      "wasn’t",
      "famous",
      "then."
    ],
    "sentenceJa": "（この本の著者は当時は有名ではなかった）",
    "sentenceDistractors": [
      "else",
      "line"
    ]
  },
  {
    "num": "0409",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "artist",
    "phonetic": "[ɑ́:rtist]",
    "partOfSpeech": "名詞",
    "japanese": "芸術家、画家",
    "tip": "[読み: アーティスト] / カテゴリ: 人・職業",
    "distractorsJa": [
      "正午，昼の12時",
      "農場，農園",
      "テント"
    ],
    "distractorsEn": [
      "noon",
      "farm",
      "tent"
    ],
    "sentenceEn": [
      "Picasso",
      "was",
      "a",
      "great",
      "Spanish",
      "artist."
    ],
    "sentenceJa": "(ピカソはスペインの偉大な芸術家だった)",
    "sentenceDistractors": [
      "ancient",
      "code"
    ]
  },
  {
    "num": "0410",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "singer",
    "phonetic": "[síŋər]",
    "partOfSpeech": "名詞",
    "japanese": "歌手",
    "tip": "[読み: スィンガァ] / カテゴリ: 人・職業",
    "distractorsJa": [
      "スーパーマーケット",
      "テント",
      "黒板"
    ],
    "distractorsEn": [
      "supermarket",
      "tent",
      "blackboard"
    ],
    "sentenceEn": [
      "She",
      "is",
      "a",
      "famous",
      "singer."
    ],
    "sentenceJa": "彼女は有名な歌手です。",
    "sentenceDistractors": [
      "November",
      "figure"
    ]
  },
  {
    "num": "0411",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "pianist",
    "phonetic": "[piǽnəst]",
    "partOfSpeech": "名詞",
    "japanese": "ピアニスト",
    "tip": "[読み: ピアニスト] / カテゴリ: 人・職業",
    "distractorsJa": [
      "生まれ故郷",
      "カレンダー",
      "風呂"
    ],
    "distractorsEn": [
      "hometown",
      "calendar",
      "bath"
    ],
    "sentenceEn": [
      "Her",
      "sister",
      "is",
      "a",
      "famous",
      "pianist."
    ],
    "sentenceJa": "彼女の姉は有名なピアニストです。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0412",
    "level": 7,
    "stageSlug": "eiken4_stage07",
    "english": "driver",
    "phonetic": "[dráivər]",
    "partOfSpeech": "名詞",
    "japanese": "運転手、ドライバー",
    "tip": "[読み: ドゥライヴァ] / カテゴリ: 人・職業",
    "distractorsJa": [
      "祭り，〜祭",
      "橋",
      "風呂"
    ],
    "distractorsEn": [
      "festival",
      "bridge",
      "bath"
    ],
    "sentenceEn": [
      "The",
      "bus",
      "driver",
      "was",
      "very",
      "kind."
    ],
    "sentenceJa": "バスの運転手はとても親切でした。",
    "sentenceDistractors": [
      "surface",
      "artificial"
    ]
  },
  {
    "num": "0413",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "waiter",
    "phonetic": "[wéitər]",
    "partOfSpeech": "名詞",
    "japanese": "ウエーター",
    "tip": "[読み: ウェイタァ] / カテゴリ: 人・職業 / 類義/関連: 関連語:waitress(ウエートレス)",
    "distractorsJa": [
      "牛肉",
      "サクランボ",
      "コート, 上着"
    ],
    "distractorsEn": [
      "beef",
      "cherry",
      "coat"
    ],
    "sentenceEn": [
      "The",
      "waiter",
      "took",
      "our",
      "order."
    ],
    "sentenceJa": "ウェイターが私たちの注文を取りました。",
    "sentenceDistractors": [
      "merchant",
      "crowded"
    ]
  },
  {
    "num": "0414",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "farmer",
    "phonetic": "[fɑ́:rmər]",
    "partOfSpeech": "名詞",
    "japanese": "農場主、農場経営者",
    "tip": "[読み: ふァーマァ] / カテゴリ: 人・職業 / 類義/関連: 関連語:farm(農場)",
    "distractorsJa": [
      "パン",
      "サクランボ",
      "湖"
    ],
    "distractorsEn": [
      "bread",
      "cherry",
      "lake"
    ],
    "sentenceEn": [
      "The",
      "farmers",
      "worked",
      "outside",
      "all",
      "day",
      "long."
    ],
    "sentenceJa": "その農家の人たちは一日中外で働いた",
    "sentenceDistractors": [
      "air",
      "short"
    ]
  },
  {
    "num": "0415",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "coach",
    "phonetic": "[koutʃ]",
    "partOfSpeech": "名詞",
    "japanese": "コーチ、指導者、をコーチ［指導］する",
    "tip": "[読み: コウチ] / カテゴリ: 人・職業",
    "distractorsJa": [
      "パスタ",
      "おじ",
      "パイナップル"
    ],
    "distractorsEn": [
      "pasta",
      "uncle",
      "pineapple"
    ],
    "sentenceEn": [
      "The",
      "coach",
      "told",
      "Tom",
      "to",
      "practice",
      "more."
    ],
    "sentenceJa": "(監督はトムにもっと練習するように言った)",
    "sentenceDistractors": [
      "astronaut",
      "clerk"
    ]
  },
  {
    "num": "0416",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "sir",
    "phonetic": "[sə́:r]",
    "partOfSpeech": "名詞",
    "japanese": "（男性に対して）お客さま",
    "tip": "[読み: サァー] / カテゴリ: 人・職業 / 類義/関連: 関連語:madam(（女性に対して）お客さま) / メモ: 店員などが呼びかけるときに使う",
    "distractorsJa": [
      "太陽, 日光",
      "米、ごはん",
      "いとこ"
    ],
    "distractorsEn": [
      "sun",
      "rice",
      "cousin"
    ],
    "sentenceEn": [
      "May",
      "I",
      "help",
      "you,",
      "sir?"
    ],
    "sentenceJa": "いらっしゃいませ、お客さま。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0417",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "visitor",
    "phonetic": "[vízətər]",
    "partOfSpeech": "名詞",
    "japanese": "訪問客、宿泊客",
    "tip": "[読み: ヴィズィタァ] / カテゴリ: 人・職業",
    "distractorsJa": [
      "ドラム",
      "牛肉",
      "ウエーター"
    ],
    "distractorsEn": [
      "drum",
      "beef",
      "waiter"
    ],
    "sentenceEn": [
      "The",
      "number",
      "of",
      "visitors",
      "to",
      "our",
      "city",
      "is",
      "increasing."
    ],
    "sentenceJa": "（私たちの市への訪問者の数は増加している）",
    "sentenceDistractors": [
      "brain",
      "elephant"
    ]
  },
  {
    "num": "0418",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "wife",
    "phonetic": "[waif]",
    "partOfSpeech": "名詞",
    "japanese": "妻",
    "tip": "[読み: ワイふ] / カテゴリ: 家族 / 類義/関連: 関連語:husband(夫)",
    "distractorsJa": [
      "結婚式、結婚記念日",
      "スパゲッティ",
      "パン"
    ],
    "distractorsEn": [
      "wedding",
      "spaghetti",
      "bread"
    ],
    "sentenceEn": [
      "Does",
      "Mr.",
      "Kato's",
      "wife",
      "work",
      "for",
      "a",
      "car",
      "company?"
    ],
    "sentenceJa": "カトウさんの奥さんは自動車会社で働いているのですか",
    "sentenceDistractors": [
      "carefully",
      "T-shirt"
    ]
  },
  {
    "num": "0419",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "uncle",
    "phonetic": "[ʌ́ŋkl]",
    "partOfSpeech": "名詞",
    "japanese": "おじ",
    "tip": "[読み: アンクル] / カテゴリ: 家族 / 類義/関連: 関連語:aunt(おば)",
    "distractorsJa": [
      "訪問客、宿泊客",
      "トランペット",
      "クッキー"
    ],
    "distractorsEn": [
      "visitor",
      "trumpet",
      "cookie"
    ],
    "sentenceEn": [
      "My",
      "uncle",
      "came",
      "to",
      "see",
      "me",
      "yesterday."
    ],
    "sentenceJa": "昨日、おじが私に会いに来た",
    "sentenceDistractors": [
      "natural",
      "wife"
    ]
  },
  {
    "num": "0420",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "baby",
    "phonetic": "[béibi]",
    "partOfSpeech": "名詞",
    "japanese": "赤ちゃん",
    "tip": "[読み: ベイビィ] / カテゴリ: 家族",
    "distractorsJa": [
      "タマネギ",
      "湖",
      "（男性に対して）お客さま"
    ],
    "distractorsEn": [
      "onion",
      "lake",
      "sir"
    ],
    "sentenceEn": [
      "Mrs.",
      "Baba",
      "has",
      "had",
      "another",
      "baby."
    ],
    "sentenceJa": "ババさんにもう１人赤ちゃんが生まれた。",
    "sentenceDistractors": [
      "present",
      "finally"
    ]
  },
  {
    "num": "0421",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "children",
    "phonetic": "[tʃíldr(ə)n]",
    "partOfSpeech": "名詞",
    "japanese": "子供たち",
    "tip": "[読み: チルドぅレン] / カテゴリ: 家族 / 類義/関連: 単数形:child(子供) / メモ: 発音注意",
    "distractorsJa": [
      "季節",
      "ハムスター",
      "海"
    ],
    "distractorsEn": [
      "season",
      "hamster",
      "sea"
    ],
    "sentenceEn": [
      "Many",
      "children",
      "are",
      "playing",
      "in",
      "the",
      "park."
    ],
    "sentenceJa": "たくさんの子供たちが公園で遊んでいます。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0422",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "daughter",
    "phonetic": "[dɔ́:tər]",
    "partOfSpeech": "名詞",
    "japanese": "娘",
    "tip": "[読み: ドータァ] / カテゴリ: 家族 / 類義/関連: 関連語:son(息子) / メモ: 発音注意",
    "distractorsJa": [
      "イチゴ",
      "湖",
      "訪問客、宿泊客"
    ],
    "distractorsEn": [
      "strawberry",
      "lake",
      "visitor"
    ],
    "sentenceEn": [
      "Mr.",
      "Yamamoto",
      "has",
      "two",
      "daughters."
    ],
    "sentenceJa": "ヤマモトさんには娘が２人いる",
    "sentenceDistractors": [
      "Friday",
      "product"
    ]
  },
  {
    "num": "0423",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "cousin",
    "phonetic": "[kʌ́zn]",
    "partOfSpeech": "名詞",
    "japanese": "いとこ",
    "tip": "[読み: カズン] / カテゴリ: 家族 / メモ: 発音注意",
    "distractorsJa": [
      "牛肉",
      "果物",
      "雪、雪が降る"
    ],
    "distractorsEn": [
      "beef",
      "fruit",
      "snow"
    ],
    "sentenceEn": [
      "My",
      "cousin",
      "is",
      "coming",
      "to",
      "visit",
      "me",
      "next",
      "week."
    ],
    "sentenceJa": "来週、いとこが私を訪ねてきます。",
    "sentenceDistractors": [
      "circle",
      "addition"
    ]
  },
  {
    "num": "0424",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "wedding",
    "phonetic": "[wédiŋ]",
    "partOfSpeech": "名詞",
    "japanese": "結婚式、結婚記念日",
    "tip": "[読み: ウェディング] / カテゴリ: 家族 / フレーズ例: at a wedding (結婚式で)",
    "distractorsJa": [
      "（食用の）肉",
      "ウエーター",
      "ハムスター"
    ],
    "distractorsEn": [
      "meat",
      "waiter",
      "hamster"
    ],
    "sentenceEn": [
      "They",
      "are",
      "having",
      "a",
      "wedding",
      "ceremony",
      "today."
    ],
    "sentenceJa": "彼らは今日、結婚式を挙げています。",
    "sentenceDistractors": [
      "weak",
      "ink"
    ]
  },
  {
    "num": "0425",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "dessert",
    "phonetic": "[dizə́:rt]",
    "partOfSpeech": "名詞",
    "japanese": "デザート",
    "tip": "[読み: ディザート] / カテゴリ: 食べ物など",
    "distractorsJa": [
      "塩",
      "カボチャ",
      "パスタ"
    ],
    "distractorsEn": [
      "salt",
      "pumpkin",
      "pasta"
    ],
    "sentenceEn": [
      "We",
      "had",
      "fruit",
      "cake",
      "for",
      "dessert."
    ],
    "sentenceJa": "私たちはデザートにフルーツケーキを食べました。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0426",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "ice cream",
    "phonetic": "[áis krí:m]",
    "partOfSpeech": "名詞",
    "japanese": "アイスクリーム",
    "tip": "[読み: アイス クリーム] / カテゴリ: 食べ物など",
    "distractorsJa": [
      "パイナップル",
      "(ふつうglovesで)手袋, グローブ",
      "パイ"
    ],
    "distractorsEn": [
      "pineapple",
      "glove",
      "pie"
    ],
    "sentenceEn": [
      "I",
      "want",
      "to",
      "eat",
      "vanilla",
      "ice",
      "cream."
    ],
    "sentenceJa": "私はバニラアイスクリームが食べたいです。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0427",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "candy",
    "phonetic": "[kǽndi]",
    "partOfSpeech": "名詞",
    "japanese": "キャンディ",
    "tip": "[読み: キャンディ] / カテゴリ: 食べ物など",
    "distractorsJa": [
      "米、ごはん",
      "スナック、軽食、おやつ",
      "（男性に対して）お客さま"
    ],
    "distractorsEn": [
      "rice",
      "snack",
      "sir"
    ],
    "sentenceEn": [
      "She",
      "gave",
      "some",
      "candy",
      "to",
      "the",
      "little",
      "boy."
    ],
    "sentenceJa": "彼女はその小さな男の子にキャンディをあげました。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0428",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "doughnut",
    "phonetic": "[dóunʌt]",
    "partOfSpeech": "名詞",
    "japanese": "ドーナツ",
    "tip": "[読み: ドウナット] / カテゴリ: 食べ物など",
    "distractorsJa": [
      "デザート",
      "いとこ",
      "トリ肉、ニワトリ"
    ],
    "distractorsEn": [
      "dessert",
      "cousin",
      "chicken"
    ],
    "sentenceEn": [
      "I",
      "bought",
      "two",
      "doughnuts",
      "at",
      "the",
      "bakery."
    ],
    "sentenceJa": "私はパン屋でドーナツを2つ買いました。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0429",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "cookie",
    "phonetic": "[kúki]",
    "partOfSpeech": "名詞",
    "japanese": "クッキー",
    "tip": "[読み: クッキィ] / カテゴリ: 食べ物など",
    "distractorsJa": [
      "(ふつうglovesで)手袋, グローブ",
      "スパゲッティ",
      "果物"
    ],
    "distractorsEn": [
      "glove",
      "spaghetti",
      "fruit"
    ],
    "sentenceEn": [
      "Would",
      "you",
      "like",
      "some",
      "cookies",
      "with",
      "your",
      "tea?"
    ],
    "sentenceJa": "(紅茶と一緒にクッキーはいかがですか)",
    "sentenceDistractors": [
      "reduce",
      "cow"
    ]
  },
  {
    "num": "0430",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "pie",
    "phonetic": "[pai]",
    "partOfSpeech": "名詞",
    "japanese": "パイ",
    "tip": "[読み: パイ] / カテゴリ: 食べ物など",
    "distractorsJa": [
      "米、ごはん",
      "フルート",
      "サクランボ"
    ],
    "distractorsEn": [
      "rice",
      "flute",
      "cherry"
    ],
    "sentenceEn": [
      "I",
      "like",
      "to",
      "eat",
      "apple",
      "pie."
    ],
    "sentenceJa": "私はアップルパイを食べるのが好きです。",
    "sentenceDistractors": [
      "printer",
      "official"
    ]
  },
  {
    "num": "0431",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "butter",
    "phonetic": "[bʌ́tər]",
    "partOfSpeech": "名詞",
    "japanese": "バター",
    "tip": "[読み: バタァ] / カテゴリ: 食べ物など",
    "distractorsJa": [
      "スナック、軽食、おやつ",
      "海",
      "トリ肉、ニワトリ"
    ],
    "distractorsEn": [
      "snack",
      "sea",
      "chicken"
    ],
    "sentenceEn": [
      "Please",
      "put",
      "some",
      "butter",
      "on",
      "the",
      "hot",
      "bread."
    ],
    "sentenceJa": "温かいパンにバターを少し塗ってください。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0432",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "bread",
    "phonetic": "[bred]",
    "partOfSpeech": "名詞",
    "japanese": "パン",
    "tip": "[読み: ブレッド] / カテゴリ: 食べ物など / フレーズ例: a slice of bread (1切れのパン)",
    "distractorsJa": [
      "ブタ",
      "妻",
      "海ガメ"
    ],
    "distractorsEn": [
      "pig",
      "wife",
      "turtle"
    ],
    "sentenceEn": [
      "Do",
      "you",
      "eat",
      "bread",
      "for",
      "breakfast?"
    ],
    "sentenceJa": "(あなたは朝食にパンを食べますか)",
    "sentenceDistractors": [
      "ski",
      "exercise"
    ]
  },
  {
    "num": "0433",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "sandwich",
    "phonetic": "[sǽn(d)witʃ]",
    "partOfSpeech": "名詞",
    "japanese": "サンドイッチ",
    "tip": "[読み: サン(ド)ウィッチ] / カテゴリ: 食べ物など",
    "distractorsJa": [
      "果物",
      "空",
      "クッキー"
    ],
    "distractorsEn": [
      "fruit",
      "sky",
      "cookie"
    ],
    "sentenceEn": [
      "I",
      "had",
      "a",
      "sandwich",
      "for",
      "lunch."
    ],
    "sentenceJa": "昼食にサンドイッチを食べました。",
    "sentenceDistractors": [
      "grade",
      "truth"
    ]
  },
  {
    "num": "0434",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "spaghetti",
    "phonetic": "[spəgéti]",
    "partOfSpeech": "名詞",
    "japanese": "スパゲッティ",
    "tip": "[読み: スパゲティ] / カテゴリ: 食べ物など",
    "distractorsJa": [
      "海ガメ",
      "パイナップル",
      "訪問客、宿泊客"
    ],
    "distractorsEn": [
      "turtle",
      "pineapple",
      "visitor"
    ],
    "sentenceEn": [
      "My",
      "father",
      "cooked",
      "spaghetti",
      "for",
      "dinner."
    ],
    "sentenceJa": "父は夕食にスパゲッティを作ってくれました。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0435",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "pasta",
    "phonetic": "[pɑ́:stə]",
    "partOfSpeech": "名詞",
    "japanese": "パスタ",
    "tip": "[読み: パースタ] / カテゴリ: 食べ物など",
    "distractorsJa": [
      "ブタ",
      "バター",
      "タマネギ"
    ],
    "distractorsEn": [
      "pig",
      "butter",
      "onion"
    ],
    "sentenceEn": [
      "This",
      "Italian",
      "restaurant",
      "serves",
      "great",
      "pasta."
    ],
    "sentenceJa": "このイタリアンレストランはおいしいパスタを出します。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0436",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "noodle",
    "phonetic": "[nú:dl]",
    "partOfSpeech": "名詞",
    "japanese": "めん類、ヌードル",
    "tip": "[読み: ヌードゥル] / カテゴリ: 食べ物など",
    "distractorsJa": [
      "音楽家, ミュージシャン",
      "ウエーター",
      "イチゴ"
    ],
    "distractorsEn": [
      "musician",
      "waiter",
      "strawberry"
    ],
    "sentenceEn": [
      "I",
      "like",
      "to",
      "eat",
      "ramen",
      "noodles."
    ],
    "sentenceJa": "私はラーメンを食べるのが好きです。",
    "sentenceDistractors": [
      "gram",
      "orchestra"
    ]
  },
  {
    "num": "0437",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "rice",
    "phonetic": "[rais]",
    "partOfSpeech": "名詞",
    "japanese": "米、ごはん",
    "tip": "[読み: ライス] / カテゴリ: 食べ物など",
    "distractorsJa": [
      "ウエーター",
      "訪問客、宿泊客",
      "空"
    ],
    "distractorsEn": [
      "waiter",
      "visitor",
      "sky"
    ],
    "sentenceEn": [
      "Would",
      "you",
      "like",
      "another",
      "bowl",
      "of",
      "rice?"
    ],
    "sentenceJa": "ごはんのおかわりはいかがですか",
    "sentenceDistractors": [
      "communication",
      "season"
    ]
  },
  {
    "num": "0438",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "salt",
    "phonetic": "[sɔ́:lt]",
    "partOfSpeech": "名詞",
    "japanese": "塩",
    "tip": "[読み: ソールト] / カテゴリ: 食べ物など",
    "distractorsJa": [
      "ネクタイ",
      "海ガメ",
      "ドーナツ"
    ],
    "distractorsEn": [
      "tie",
      "turtle",
      "doughnut"
    ],
    "sentenceEn": [
      "I",
      "put",
      "some",
      "salt",
      "in",
      "the",
      "soup."
    ],
    "sentenceJa": "私はスープに塩を入れた",
    "sentenceDistractors": [
      "Tuesday",
      "yellow"
    ]
  },
  {
    "num": "0439",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "beef",
    "phonetic": "[bi:f]",
    "partOfSpeech": "名詞",
    "japanese": "牛肉",
    "tip": "[読み: ビーふ] / カテゴリ: 食べ物など",
    "distractorsJa": [
      "ハムスター",
      "子供たち",
      "タマネギ"
    ],
    "distractorsEn": [
      "hamster",
      "children",
      "onion"
    ],
    "sentenceEn": [
      "We",
      "had",
      "beef",
      "stew",
      "for",
      "dinner."
    ],
    "sentenceJa": "夕食にビーフシチューを食べました。",
    "sentenceDistractors": [
      "apply",
      "trash"
    ]
  },
  {
    "num": "0440",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "chicken",
    "phonetic": "[tʃíkin]",
    "partOfSpeech": "名詞",
    "japanese": "トリ肉、ニワトリ",
    "tip": "[読み: チキン] / カテゴリ: 食べ物など",
    "distractorsJa": [
      "衣服",
      "娘",
      "アイスクリーム"
    ],
    "distractorsEn": [
      "clothes",
      "daughter",
      "ice cream"
    ],
    "sentenceEn": [
      "We",
      "had",
      "fried",
      "chicken",
      "for",
      "dinner."
    ],
    "sentenceJa": "夕食にフライドチキンを食べました。",
    "sentenceDistractors": [
      "eighteen",
      "native"
    ]
  },
  {
    "num": "0441",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "meat",
    "phonetic": "[mi:t]",
    "partOfSpeech": "名詞",
    "japanese": "（食用の）肉",
    "tip": "[読み: ミート] / カテゴリ: 食べ物など",
    "distractorsJa": [
      "フルート",
      "サクランボ",
      "馬"
    ],
    "distractorsEn": [
      "flute",
      "cherry",
      "horse"
    ],
    "sentenceEn": [
      "How",
      "often",
      "do",
      "you",
      "eat",
      "meat?"
    ],
    "sentenceJa": "あなたはどのくらいの頻度で肉を食べますか",
    "sentenceDistractors": [
      "damage",
      "rose"
    ]
  },
  {
    "num": "0442",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "steak",
    "phonetic": "[steik]",
    "partOfSpeech": "名詞",
    "japanese": "ステーキ",
    "tip": "[読み: ステイク] / カテゴリ: 食べ物など / メモ: 発音注意",
    "distractorsJa": [
      "子供たち",
      "ドラム",
      "赤ちゃん"
    ],
    "distractorsEn": [
      "children",
      "drum",
      "baby"
    ],
    "sentenceEn": [
      "We",
      "ate",
      "delicious",
      "steak",
      "at",
      "the",
      "restaurant."
    ],
    "sentenceJa": "私たちはレストランでおいしいステーキを食べました。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0443",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "sausage",
    "phonetic": "[sɔ́(:)sidʒ]",
    "partOfSpeech": "名詞",
    "japanese": "ソーセージ",
    "tip": "[読み: ソ(ー)セッジ] / カテゴリ: 食べ物など",
    "distractorsJa": [
      "妻",
      "イチゴ",
      "タマネギ"
    ],
    "distractorsEn": [
      "wife",
      "strawberry",
      "onion"
    ],
    "sentenceEn": [
      "I",
      "had",
      "two",
      "sausages",
      "and",
      "salad",
      "for",
      "breakfast."
    ],
    "sentenceJa": "私は朝食にソーセージ2本とサラダを食べました。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0444",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "fruit",
    "phonetic": "[fru:t]",
    "partOfSpeech": "名詞",
    "japanese": "果物",
    "tip": "[読み: フルート] / カテゴリ: 食べ物など",
    "distractorsJa": [
      "デザート",
      "アイスクリーム",
      "（男性に対して）お客さま"
    ],
    "distractorsEn": [
      "dessert",
      "ice cream",
      "sir"
    ],
    "sentenceEn": [
      "We",
      "should",
      "buy",
      "more",
      "fruit",
      "at",
      "the",
      "store."
    ],
    "sentenceJa": "私たちはその店でもっと果物を買うほうがよい",
    "sentenceDistractors": [
      "ground",
      "eight"
    ]
  },
  {
    "num": "0445",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "cherry",
    "phonetic": "[tʃéri]",
    "partOfSpeech": "名詞",
    "japanese": "サクランボ",
    "tip": "[読み: チェリィ] / カテゴリ: 食べ物など",
    "distractorsJa": [
      "海ガメ",
      "キャンディ",
      "コーチ、指導者、をコーチ［指導］する"
    ],
    "distractorsEn": [
      "turtle",
      "candy",
      "coach"
    ],
    "sentenceEn": [
      "We",
      "had",
      "a",
      "party",
      "under",
      "a",
      "cherry",
      "tree."
    ],
    "sentenceJa": "私たちは桜の木の下でパーティーを開いた。",
    "sentenceDistractors": [
      "enter",
      "climb"
    ]
  },
  {
    "num": "0446",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "strawberry",
    "phonetic": "[strɔ́:bèri]",
    "partOfSpeech": "名詞",
    "japanese": "イチゴ",
    "tip": "[読み: ストゥローベリィ] / カテゴリ: 食べ物など",
    "distractorsJa": [
      "パスタ",
      "スナック、軽食、おやつ",
      "海ガメ"
    ],
    "distractorsEn": [
      "pasta",
      "snack",
      "turtle"
    ],
    "sentenceEn": [
      "These",
      "red",
      "strawberries",
      "are",
      "very",
      "sweet."
    ],
    "sentenceJa": "これらの赤いイチゴはとても甘いです。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0447",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "pineapple",
    "phonetic": "[páinæ̀pl]",
    "partOfSpeech": "名詞",
    "japanese": "パイナップル",
    "tip": "[読み: パイナプる] / カテゴリ: 食べ物など",
    "distractorsJa": [
      "ドラム",
      "（男性に対して）お客さま",
      "パン"
    ],
    "distractorsEn": [
      "drum",
      "sir",
      "bread"
    ],
    "sentenceEn": [
      "We",
      "ate",
      "fresh",
      "pineapple",
      "in",
      "Hawaii."
    ],
    "sentenceJa": "私たちはハワイで新鮮なパイナップルを食べました。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0448",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "pumpkin",
    "phonetic": "[pʌ́m(p)kin]",
    "partOfSpeech": "名詞",
    "japanese": "カボチャ",
    "tip": "[読み: パン(プ)キン] / カテゴリ: 食べ物など",
    "distractorsJa": [
      "アイスクリーム",
      "パイ",
      "ドラム"
    ],
    "distractorsEn": [
      "ice cream",
      "pie",
      "drum"
    ],
    "sentenceEn": [
      "My",
      "grandmother",
      "made",
      "warm",
      "pumpkin",
      "soup."
    ],
    "sentenceJa": "祖母が温かいカボチャのスープを作ってくれました。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0449",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "onion",
    "phonetic": "[ʌ́njən]",
    "partOfSpeech": "名詞",
    "japanese": "タマネギ",
    "tip": "[読み: アニョン] / カテゴリ: 食べ物など / メモ: 発音注意",
    "distractorsJa": [
      "トランペット",
      "（男性に対して）お客さま",
      "雪、雪が降る"
    ],
    "distractorsEn": [
      "trumpet",
      "sir",
      "snow"
    ],
    "sentenceEn": [
      "Please",
      "cut",
      "these",
      "onions",
      "into",
      "small",
      "pieces."
    ],
    "sentenceJa": "これらのタマネギを小さく切ってください。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0450",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "snack",
    "phonetic": "[snæk]",
    "partOfSpeech": "名詞",
    "japanese": "スナック、軽食、おやつ",
    "tip": "[読み: スナック] / カテゴリ: 食べ物など",
    "distractorsJa": [
      "音楽",
      "サンドイッチ",
      "バター"
    ],
    "distractorsEn": [
      "music",
      "sandwich",
      "butter"
    ],
    "sentenceEn": [
      "Let's",
      "have",
      "a",
      "light",
      "snack",
      "before",
      "studying."
    ],
    "sentenceJa": "勉強する前に軽いおやつを食べましょう。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0451",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "snow",
    "phonetic": "[snou]",
    "partOfSpeech": "名詞",
    "japanese": "雪、雪が降る",
    "tip": "[読み: スノウ] / カテゴリ: 自然・生き物 / フレーズ例: heavy snow (大雪)",
    "distractorsJa": [
      "子供たち",
      "楽団, バンド",
      "季節"
    ],
    "distractorsEn": [
      "children",
      "band",
      "season"
    ],
    "sentenceEn": [
      "We",
      "had",
      "a",
      "lot",
      "of",
      "snow",
      "last",
      "week."
    ],
    "sentenceJa": "先週は雪がたくさん降った",
    "sentenceDistractors": [
      "bottle",
      "themselves"
    ]
  },
  {
    "num": "0452",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "cloud",
    "phonetic": "[klaud]",
    "partOfSpeech": "名詞",
    "japanese": "雲",
    "tip": "[読み: クラウド] / カテゴリ: 自然・生き物",
    "distractorsJa": [
      "めん類、ヌードル",
      "牛肉",
      "トリ肉、ニワトリ"
    ],
    "distractorsEn": [
      "noodle",
      "beef",
      "chicken"
    ],
    "sentenceEn": [
      "There",
      "is",
      "not",
      "a",
      "single",
      "cloud",
      "in",
      "the",
      "sky."
    ],
    "sentenceJa": "空には雲一つありません。",
    "sentenceDistractors": [
      "percentage",
      "peace"
    ]
  },
  {
    "num": "0453",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "sun",
    "phonetic": "[sʌn]",
    "partOfSpeech": "名詞",
    "japanese": "太陽, 日光",
    "tip": "[読み: サン] / カテゴリ: 自然・生き物",
    "distractorsJa": [
      "めん類、ヌードル",
      "ソーセージ",
      "デザート"
    ],
    "distractorsEn": [
      "noodle",
      "sausage",
      "dessert"
    ],
    "sentenceEn": [
      "The",
      "sun",
      "is",
      "shining",
      "in",
      "the",
      "sky."
    ],
    "sentenceJa": "空には太陽が輝いている",
    "sentenceDistractors": [
      "Canada",
      "farmer"
    ]
  },
  {
    "num": "0454",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "sky",
    "phonetic": "[skai]",
    "partOfSpeech": "名詞",
    "japanese": "空",
    "tip": "[読み: スカイ] / カテゴリ: 自然・生き物",
    "distractorsJa": [
      "キャンディ",
      "スパゲッティ",
      "(the oceanで)大洋, 海"
    ],
    "distractorsEn": [
      "candy",
      "spaghetti",
      "ocean"
    ],
    "sentenceEn": [
      "There",
      "are",
      "some",
      "big",
      "white",
      "clouds",
      "in",
      "the",
      "sky."
    ],
    "sentenceJa": "空に大きな白い雲がいくつかある",
    "sentenceDistractors": [
      "follow",
      "sad"
    ]
  },
  {
    "num": "0455",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "season",
    "phonetic": "[sí:z(ə)n]",
    "partOfSpeech": "名詞",
    "japanese": "季節",
    "tip": "[読み: スィーズン] / カテゴリ: 自然・生き物",
    "distractorsJa": [
      "秋",
      "デザート",
      "アイスクリーム"
    ],
    "distractorsEn": [
      "autumn",
      "dessert",
      "ice cream"
    ],
    "sentenceEn": [
      "Summer",
      "is",
      "the",
      "season",
      "to",
      "go",
      "to",
      "the",
      "beach."
    ],
    "sentenceJa": "夏は浜辺に行く季節です",
    "sentenceDistractors": [
      "London",
      "true"
    ]
  },
  {
    "num": "0456",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "autumn",
    "phonetic": "[ɔ́:təm]",
    "partOfSpeech": "名詞",
    "japanese": "秋",
    "tip": "[読み: オータム] / カテゴリ: 自然・生き物 / 類義/関連: 同意語:fall(秋)",
    "distractorsJa": [
      "ドラム",
      "塩",
      "デザート"
    ],
    "distractorsEn": [
      "drum",
      "salt",
      "dessert"
    ],
    "sentenceEn": [
      "The",
      "leaves",
      "turn",
      "red",
      "and",
      "yellow",
      "in",
      "autumn."
    ],
    "sentenceJa": "秋には木の葉が赤や黄色に変わります。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0457",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "sea",
    "phonetic": "[si:]",
    "partOfSpeech": "名詞",
    "japanese": "海",
    "tip": "[読み: スィー] / カテゴリ: 自然・生き物 / 類義/関連: 反意語:land(陸)",
    "distractorsJa": [
      "パイナップル",
      "ハムスター",
      "コーチ、指導者、をコーチ［指導］する"
    ],
    "distractorsEn": [
      "pineapple",
      "hamster",
      "coach"
    ],
    "sentenceEn": [
      "My",
      "mother's",
      "hometown",
      "is",
      "near",
      "the",
      "sea."
    ],
    "sentenceJa": "母の生まれ故郷は海の近くにある",
    "sentenceDistractors": [
      "often",
      "change"
    ]
  },
  {
    "num": "0458",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "ocean",
    "phonetic": "[óuʃ(ə)n]",
    "partOfSpeech": "名詞",
    "japanese": "(the oceanで)大洋, 海",
    "tip": "[読み: オウシャン] / カテゴリ: 自然・生き物",
    "distractorsJa": [
      "おじ",
      "カボチャ",
      "パン"
    ],
    "distractorsEn": [
      "uncle",
      "pumpkin",
      "bread"
    ],
    "sentenceEn": [
      "The",
      "water",
      "of",
      "the",
      "ocean",
      "is",
      "very",
      "cold",
      "in",
      "winter."
    ],
    "sentenceJa": "冬は海の水がとても冷たい",
    "sentenceDistractors": [
      "pull",
      "damage"
    ]
  },
  {
    "num": "0459",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "turtle",
    "phonetic": "[tə́:rtl]",
    "partOfSpeech": "名詞",
    "japanese": "海ガメ",
    "tip": "[読み: タートル] / カテゴリ: 自然・生き物",
    "distractorsJa": [
      "アイスクリーム",
      "海",
      "カボチャ"
    ],
    "distractorsEn": [
      "ice cream",
      "sea",
      "pumpkin"
    ],
    "sentenceEn": [
      "A",
      "turtle",
      "can",
      "live",
      "for",
      "a",
      "very",
      "long",
      "time."
    ],
    "sentenceJa": "カメは非常に長生きすることができます。",
    "sentenceDistractors": [
      "pizza",
      "sightseeing"
    ]
  },
  {
    "num": "0460",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "lake",
    "phonetic": "[leik]",
    "partOfSpeech": "名詞",
    "japanese": "湖",
    "tip": "[読み: レイク] / カテゴリ: 自然・生き物",
    "distractorsJa": [
      "トリ肉、ニワトリ",
      "雲",
      "パイ"
    ],
    "distractorsEn": [
      "chicken",
      "cloud",
      "pie"
    ],
    "sentenceEn": [
      "We",
      "enjoyed",
      "swimming",
      "in",
      "the",
      "lake."
    ],
    "sentenceJa": "私たちは湖で泳いで楽しんだ",
    "sentenceDistractors": [
      "hall",
      "suddenly"
    ]
  },
  {
    "num": "0461",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "horse",
    "phonetic": "[hɔ:rs]",
    "partOfSpeech": "名詞",
    "japanese": "馬",
    "tip": "[読み: ホース] / カテゴリ: 自然・生き物",
    "distractorsJa": [
      "トランペット",
      "ブタ",
      "ステーキ"
    ],
    "distractorsEn": [
      "trumpet",
      "pig",
      "steak"
    ],
    "sentenceEn": [
      "Some",
      "horses",
      "are",
      "walking",
      "on",
      "the",
      "grass."
    ],
    "sentenceJa": "何頭かのウマが芝生を歩いている",
    "sentenceDistractors": [
      "probably",
      "July"
    ]
  },
  {
    "num": "0462",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "pig",
    "phonetic": "[pig]",
    "partOfSpeech": "名詞",
    "japanese": "ブタ",
    "tip": "[読み: ピッグ] / カテゴリ: 自然・生き物 / 類義/関連: 関連語:pork(ブタ肉)",
    "distractorsJa": [
      "米、ごはん",
      "訪問客、宿泊客",
      "パスタ"
    ],
    "distractorsEn": [
      "rice",
      "visitor",
      "pasta"
    ],
    "sentenceEn": [
      "We",
      "saw",
      "many",
      "cute",
      "pigs",
      "on",
      "the",
      "farm."
    ],
    "sentenceJa": "私たちは農場でたくさんのかわいいブタを見ました。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0463",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "hamster",
    "phonetic": "[hǽmstər]",
    "partOfSpeech": "名詞",
    "japanese": "ハムスター",
    "tip": "[読み: ハムスタァ] / カテゴリ: 自然・生き物",
    "distractorsJa": [
      "アイスクリーム",
      "季節",
      "海"
    ],
    "distractorsEn": [
      "ice cream",
      "season",
      "sea"
    ],
    "sentenceEn": [
      "My",
      "sister",
      "keeps",
      "a",
      "small",
      "hamster",
      "as",
      "a",
      "pet."
    ],
    "sentenceJa": "私の妹はペットとして小さなハムスターを飼っています。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0464",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "music",
    "phonetic": "[mjú:zik]",
    "partOfSpeech": "名詞",
    "japanese": "音楽",
    "tip": "[読み: ミューズィック] / カテゴリ: 音楽 / 類義/関連: 関連語:musical(ミュージカル)",
    "distractorsJa": [
      "コート, 上着",
      "楽団, バンド",
      "パスタ"
    ],
    "distractorsEn": [
      "coat",
      "band",
      "pasta"
    ],
    "sentenceEn": [
      "He",
      "was",
      "listening",
      "to",
      "music",
      "on",
      "the",
      "radio."
    ],
    "sentenceJa": "彼はラジオで音楽を聞いていた",
    "sentenceDistractors": [
      "believe",
      "without"
    ]
  },
  {
    "num": "0465",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "musician",
    "phonetic": "[mju:zíʃ(ə)n]",
    "partOfSpeech": "名詞",
    "japanese": "音楽家, ミュージシャン",
    "tip": "[読み: ミュズィシャン] / カテゴリ: 音楽",
    "distractorsJa": [
      "クッキー",
      "果物",
      "パイナップル"
    ],
    "distractorsEn": [
      "cookie",
      "fruit",
      "pineapple"
    ],
    "sentenceEn": [
      "He",
      "is",
      "a",
      "talented",
      "musician."
    ],
    "sentenceJa": "彼は才能のある音楽家です。",
    "sentenceDistractors": [
      "personal",
      "injure"
    ]
  },
  {
    "num": "0466",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "pop music",
    "phonetic": "[pá(:)p mjù:zik]",
    "partOfSpeech": "名詞",
    "japanese": "ポピュラー音楽, ポップス",
    "tip": "[読み: パ(ー)ップ ミューズィック] / カテゴリ: 音楽",
    "distractorsJa": [
      "(the oceanで)大洋, 海",
      "サンドイッチ",
      "赤ちゃん"
    ],
    "distractorsEn": [
      "ocean",
      "sandwich",
      "baby"
    ],
    "sentenceEn": [
      "I",
      "often",
      "listen",
      "to",
      "pop",
      "music",
      "at",
      "home."
    ],
    "sentenceJa": "私は家でよくポップスを聴きます。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0467",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "band",
    "phonetic": "[bænd]",
    "partOfSpeech": "名詞",
    "japanese": "楽団, バンド",
    "tip": "[読み: バンド] / カテゴリ: 音楽",
    "distractorsJa": [
      "トリ肉、ニワトリ",
      "赤ちゃん",
      "馬"
    ],
    "distractorsEn": [
      "chicken",
      "baby",
      "horse"
    ],
    "sentenceEn": [
      "The",
      "rock",
      "band",
      "played",
      "some",
      "songs",
      "on",
      "the",
      "stage."
    ],
    "sentenceJa": "(そのロックバンドは舞台で何曲か演奏した)",
    "sentenceDistractors": [
      "list",
      "least"
    ]
  },
  {
    "num": "0468",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "drum",
    "phonetic": "[drʌm]",
    "partOfSpeech": "名詞",
    "japanese": "ドラム",
    "tip": "[読み: ドラム] / カテゴリ: 音楽",
    "distractorsJa": [
      "サクランボ",
      "馬",
      "カボチャ"
    ],
    "distractorsEn": [
      "cherry",
      "horse",
      "pumpkin"
    ],
    "sentenceEn": [
      "I",
      "played",
      "the",
      "drum",
      "at",
      "the",
      "festival."
    ],
    "sentenceJa": "(私は祭りでたいこを演奏した)",
    "sentenceDistractors": [
      "coach",
      "terrible"
    ]
  },
  {
    "num": "0469",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "flute",
    "phonetic": "[flu:t]",
    "partOfSpeech": "名詞",
    "japanese": "フルート",
    "tip": "[読み: フルート] / カテゴリ: 音楽",
    "distractorsJa": [
      "サンドイッチ",
      "いとこ",
      "クッキー"
    ],
    "distractorsEn": [
      "sandwich",
      "cousin",
      "cookie"
    ],
    "sentenceEn": [
      "She",
      "practices",
      "the",
      "flute",
      "in",
      "the",
      "music",
      "room."
    ],
    "sentenceJa": "彼女は音楽室でフルートの練習をしています。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0470",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "trumpet",
    "phonetic": "[trʌ́mpət]",
    "partOfSpeech": "名詞",
    "japanese": "トランペット",
    "tip": "[読み: トゥランペット] / カテゴリ: 音楽",
    "distractorsJa": [
      "(ふつうglovesで)手袋, グローブ",
      "（男性に対して）お客さま",
      "カボチャ"
    ],
    "distractorsEn": [
      "glove",
      "sir",
      "pumpkin"
    ],
    "sentenceEn": [
      "He",
      "plays",
      "the",
      "trumpet",
      "in",
      "a",
      "band."
    ],
    "sentenceJa": "彼はバンドでトランペットを吹いています。",
    "sentenceDistractors": [
      "fourteen",
      "ourselves"
    ]
  },
  {
    "num": "0471",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "clothes",
    "phonetic": "[klouz]",
    "partOfSpeech": "名詞",
    "japanese": "衣服",
    "tip": "[読み: クロウズ] / カテゴリ: 衣服・色など / 類義/関連: 同意語:dress(ドレス, 服装) / メモ: 発音注意",
    "distractorsJa": [
      "パスタ",
      "音楽家, ミュージシャン",
      "デザート"
    ],
    "distractorsEn": [
      "pasta",
      "musician",
      "dessert"
    ],
    "sentenceEn": [
      "Wear",
      "warm",
      "clothes",
      "when",
      "you",
      "play",
      "outside."
    ],
    "sentenceJa": "外で遊ぶときには，暖かい服を着なさい",
    "sentenceDistractors": [
      "environment",
      "late"
    ]
  },
  {
    "num": "0472",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "coat",
    "phonetic": "[kout]",
    "partOfSpeech": "名詞",
    "japanese": "コート, 上着",
    "tip": "[読み: コウト] / カテゴリ: 衣服・色など",
    "distractorsJa": [
      "パイ",
      "バター",
      "妻"
    ],
    "distractorsEn": [
      "pie",
      "butter",
      "wife"
    ],
    "sentenceEn": [
      "You",
      "should",
      "put",
      "on",
      "your",
      "coat",
      "when",
      "you",
      "go",
      "outside."
    ],
    "sentenceJa": "(外に出るときには上着を着たほうがいいよ)",
    "sentenceDistractors": [
      "ring",
      "lucky"
    ]
  },
  {
    "num": "0473",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "sweater",
    "phonetic": "[swétər]",
    "partOfSpeech": "名詞",
    "japanese": "セーター",
    "tip": "[読み: スウェタァ] / カテゴリ: 衣服・色など / メモ: 発音注意",
    "distractorsJa": [
      "子供たち",
      "ドラム",
      "フルート"
    ],
    "distractorsEn": [
      "children",
      "drum",
      "flute"
    ],
    "sentenceEn": [
      "He",
      "is",
      "wearing",
      "a",
      "warm",
      "sweater",
      "today."
    ],
    "sentenceJa": "彼は今日、暖かいセーターを着ています。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0474",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "glove",
    "phonetic": "[glʌv]",
    "partOfSpeech": "名詞",
    "japanese": "(ふつうglovesで)手袋, グローブ",
    "tip": "[読み: グラヴ] / カテゴリ: 衣服・色など / メモ: 発音注意",
    "distractorsJa": [
      "めん類、ヌードル",
      "コーチ、指導者、をコーチ［指導］する",
      "米、ごはん"
    ],
    "distractorsEn": [
      "noodle",
      "coach",
      "rice"
    ],
    "sentenceEn": [
      "Don't",
      "forget",
      "your",
      "gloves",
      "because",
      "it",
      "is",
      "cold."
    ],
    "sentenceJa": "寒いので手袋を忘れないでください。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0475",
    "level": 8,
    "stageSlug": "eiken4_stage08",
    "english": "tie",
    "phonetic": "[tai]",
    "partOfSpeech": "名詞",
    "japanese": "ネクタイ",
    "tip": "[読み: タイ] / カテゴリ: 衣服・色など",
    "distractorsJa": [
      "秋",
      "音楽",
      "ウエーター"
    ],
    "distractorsEn": [
      "autumn",
      "music",
      "waiter"
    ],
    "sentenceEn": [
      "My",
      "father",
      "wears",
      "a",
      "blue",
      "tie",
      "to",
      "work."
    ],
    "sentenceJa": "私の父は仕事に青いネクタイをして行きます。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0476",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "glasses",
    "phonetic": "[glǽsiz]",
    "partOfSpeech": "名詞",
    "japanese": "メガネ",
    "tip": "[読み: グラスィズ] / カテゴリ: 衣服・色など / メモ: 必ずglassesと複数形で使う",
    "distractorsJa": [
      "大きさ、寸法",
      "国, (theをつけて)いなか",
      "フットボール"
    ],
    "distractorsEn": [
      "size",
      "country",
      "football"
    ],
    "sentenceEn": [
      "Grandfather",
      "needs",
      "his",
      "glasses",
      "to",
      "read",
      "books."
    ],
    "sentenceJa": "祖父は本を読むのにメガネが必要です。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0477",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "sock",
    "phonetic": "[sá(:)k]",
    "partOfSpeech": "名詞",
    "japanese": "(ふつうsocksで)くつ下, ソックス",
    "tip": "[読み: サ(ー)ック] / カテゴリ: 衣服・色など / フレーズ例: a pair of socks (ソックス1足)",
    "distractorsJa": [
      "中国",
      "(米国・カナダなどの貨幣単位)ドル",
      "アメリカ(合衆国)"
    ],
    "distractorsEn": [
      "China",
      "dollar",
      "America"
    ],
    "sentenceEn": [
      "I",
      "bought",
      "three",
      "pairs",
      "of",
      "socks",
      "yesterday."
    ],
    "sentenceJa": "私は昨日くつ下を3足買いました。",
    "sentenceDistractors": [
      "China",
      "dollar"
    ]
  },
  {
    "num": "0478",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "umbrella",
    "phonetic": "[ʌmbrélə]",
    "partOfSpeech": "名詞",
    "japanese": "かさ",
    "tip": "[読み: アンブレラ] / カテゴリ: 衣服・色など",
    "distractorsJa": [
      "イタリア",
      "サーフィン, 波乗り",
      "(アメリカの)ハワイ州, ハワイ島"
    ],
    "distractorsEn": [
      "Italy",
      "surfing",
      "Hawaii"
    ],
    "sentenceEn": [
      "I",
      "left",
      "my",
      "favorite",
      "umbrella",
      "on",
      "the",
      "train."
    ],
    "sentenceJa": "(私のお気に入りのかさを電車の中に置いてきた)",
    "sentenceDistractors": [
      "tonight",
      "encourage"
    ]
  },
  {
    "num": "0479",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "gray",
    "phonetic": "[grei]",
    "partOfSpeech": "名詞",
    "japanese": "灰色, グレー、灰色[グレー]の",
    "tip": "[読み: グレイ] / カテゴリ: 衣服・色など",
    "distractorsJa": [
      "カナダ",
      "リスト、名簿",
      "国, (theをつけて)いなか"
    ],
    "distractorsEn": [
      "Canada",
      "list",
      "country"
    ],
    "sentenceEn": [
      "The",
      "sky",
      "is",
      "gray",
      "today."
    ],
    "sentenceJa": "今日は空が灰色です。",
    "sentenceDistractors": [
      "calm",
      "necklace"
    ]
  },
  {
    "num": "0480",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "gold",
    "phonetic": "[gould]",
    "partOfSpeech": "名詞",
    "japanese": "金、金(製)の",
    "tip": "[読み: ゴウルド] / カテゴリ: 衣服・色など",
    "distractorsJa": [
      "座席",
      "レスリング",
      "世界, 世の中"
    ],
    "distractorsEn": [
      "seat",
      "wrestling",
      "world"
    ],
    "sentenceEn": [
      "Gold",
      "is",
      "used",
      "in",
      "this",
      "watch."
    ],
    "sentenceJa": "（この腕時計には金が使われている）",
    "sentenceDistractors": [
      "land",
      "kite"
    ]
  },
  {
    "num": "0481",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "dollar",
    "phonetic": "[dɑ́(:)lər]",
    "partOfSpeech": "名詞",
    "japanese": "(米国・カナダなどの貨幣単位)ドル",
    "tip": "[読み: ダ(ー)ラァ] / カテゴリ: 単位 / メモ: 記号は$",
    "distractorsJa": [
      "ウェブサイト",
      "(ふつうsocksで)くつ下, ソックス",
      "メキシコ"
    ],
    "distractorsEn": [
      "website",
      "sock",
      "Mexico"
    ],
    "sentenceEn": [
      "The",
      "ticket",
      "for",
      "the",
      "concert",
      "is",
      "fifty",
      "dollars."
    ],
    "sentenceJa": "コンサートのチケットは50ドルだ",
    "sentenceDistractors": [
      "shape",
      "planet"
    ]
  },
  {
    "num": "0482",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "yen",
    "phonetic": "[jen]",
    "partOfSpeech": "名詞",
    "japanese": "円",
    "tip": "[読み: イェン] / カテゴリ: 単位 / メモ: 記号は¥",
    "distractorsJa": [
      "座席",
      "生活、生命、一生、人生",
      "郵便(物)、を郵便で送る"
    ],
    "distractorsEn": [
      "seat",
      "life",
      "mail"
    ],
    "sentenceEn": [
      "I",
      "paid",
      "5,000",
      "yen",
      "for",
      "this",
      "watch."
    ],
    "sentenceJa": "私はこの腕時計に5,000円払った。",
    "sentenceDistractors": [
      "under",
      "fall"
    ]
  },
  {
    "num": "0483",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "world",
    "phonetic": "[wə́:rld]",
    "partOfSpeech": "名詞",
    "japanese": "世界, 世の中",
    "tip": "[読み: ワールド] / カテゴリ: 国・地域 / フレーズ例: all over the world (世界中で[に])",
    "distractorsJa": [
      "アメリカ(合衆国)",
      "リスト、名簿",
      "フットボール"
    ],
    "distractorsEn": [
      "America",
      "list",
      "football"
    ],
    "sentenceEn": [
      "This",
      "is",
      "the",
      "longest",
      "river",
      "in",
      "the",
      "world."
    ],
    "sentenceJa": "これは世界で最も長い川だ",
    "sentenceDistractors": [
      "eat",
      "mother"
    ]
  },
  {
    "num": "0484",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "country",
    "phonetic": "[kʌ́ntri]",
    "partOfSpeech": "名詞",
    "japanese": "国, (theをつけて)いなか",
    "tip": "[読み: カントゥリィ] / カテゴリ: 国・地域 / フレーズ例: live in the country (いなかに住む)",
    "distractorsJa": [
      "クリスマス",
      "メキシコ",
      "サーフィン, 波乗り"
    ],
    "distractorsEn": [
      "Christmas",
      "Mexico",
      "surfing"
    ],
    "sentenceEn": [
      "Our",
      "country",
      "has",
      "many",
      "high",
      "mountains."
    ],
    "sentenceJa": "私たちの国には多くの高い山がある",
    "sentenceDistractors": [
      "try",
      "start"
    ]
  },
  {
    "num": "0485",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "America",
    "phonetic": "[əmérikə]",
    "partOfSpeech": "名詞",
    "japanese": "アメリカ(合衆国)",
    "tip": "[読み: アメリカ] / カテゴリ: 国・地域 / 類義/関連: 関連語:American(アメリカ人, アメリカ(人)の)",
    "distractorsJa": [
      "メキシコ",
      "サーフィン, 波乗り",
      "ニュース、報道"
    ],
    "distractorsEn": [
      "Mexico",
      "surfing",
      "news"
    ],
    "sentenceEn": [
      "America",
      "is",
      "much",
      "larger",
      "than",
      "Japan."
    ],
    "sentenceJa": "アメリカは日本よりはるかに大きい。",
    "sentenceDistractors": [
      "boy",
      "train"
    ]
  },
  {
    "num": "0486",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "Canada",
    "phonetic": "[kǽnədə]",
    "partOfSpeech": "名詞",
    "japanese": "カナダ",
    "tip": "[読み: キャナダ] / カテゴリ: 国・地域 / 類義/関連: 関連語:Canadian(カナダ人, カナダ(人)の)",
    "distractorsJa": [
      "ボウリング",
      "伝言、メッセージ",
      "郵便(物)、を郵便で送る"
    ],
    "distractorsEn": [
      "bowling",
      "message",
      "mail"
    ],
    "sentenceEn": [
      "Canada",
      "is",
      "very",
      "cold",
      "in",
      "winter."
    ],
    "sentenceJa": "カナダは冬はとても寒い",
    "sentenceDistractors": [
      "late",
      "air"
    ]
  },
  {
    "num": "0487",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "Australia",
    "phonetic": "[ɔ:(:)stréiliə]",
    "partOfSpeech": "名詞",
    "japanese": "オーストラリア",
    "tip": "[読み: オ(ー)ストゥレイリア] / カテゴリ: 国・地域 / 類義/関連: 関連語:Australian(オーストラリア人, オーストラリア(人)の)",
    "distractorsJa": [
      "(アメリカの)ハワイ州, ハワイ島",
      "クリスマス",
      "生活、生命、一生、人生"
    ],
    "distractorsEn": [
      "Hawaii",
      "Christmas",
      "life"
    ],
    "sentenceEn": [
      "Winter",
      "in",
      "Australia",
      "is",
      "summer",
      "in",
      "Japan."
    ],
    "sentenceJa": "オーストラリアの冬は日本では夏だ",
    "sentenceDistractors": [
      "tea",
      "bad"
    ]
  },
  {
    "num": "0488",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "France",
    "phonetic": "[fræns]",
    "partOfSpeech": "名詞",
    "japanese": "フランス",
    "tip": "[読み: フランス] / カテゴリ: 国・地域 / 類義/関連: 関連語:French(フランス語, フランス人, フランス語の, フランス(人)の)",
    "distractorsJa": [
      "髪のカット、散髪",
      "レスリング",
      "(the Internetで)インターネット"
    ],
    "distractorsEn": [
      "haircut",
      "wrestling",
      "Internet"
    ],
    "sentenceEn": [
      "France",
      "has",
      "many",
      "wonderful",
      "places",
      "to",
      "visit."
    ],
    "sentenceJa": "フランスには多くの訪れるべきすばらしい場所がある",
    "sentenceDistractors": [
      "conversation",
      "cap"
    ]
  },
  {
    "num": "0489",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "Italy",
    "phonetic": "[ít(ə)li]",
    "partOfSpeech": "名詞",
    "japanese": "イタリア",
    "tip": "[読み: イタリィ] / カテゴリ: 国・地域 / 類義/関連: 関連語:Italian(イタリア語, イタリア人, イタリア語の, イタリア(人)の)",
    "distractorsJa": [
      "フランス",
      "国, (theをつけて)いなか",
      "灰色, グレー、灰色[グレー]の"
    ],
    "distractorsEn": [
      "France",
      "country",
      "gray"
    ],
    "sentenceEn": [
      "Rome",
      "is",
      "the",
      "capital",
      "of",
      "Italy."
    ],
    "sentenceJa": "ローマはイタリアの首都です。",
    "sentenceDistractors": [
      "separate",
      "danger"
    ]
  },
  {
    "num": "0490",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "China",
    "phonetic": "[tʃáinə]",
    "partOfSpeech": "名詞",
    "japanese": "中国",
    "tip": "[読み: チャイナ] / カテゴリ: 国・地域 / 類義/関連: 関連語:Chinese(中国語, 中国人, 中国語の, 中国(人)の)",
    "distractorsJa": [
      "イタリア",
      "ウェブサイト",
      "円"
    ],
    "distractorsEn": [
      "Italy",
      "website",
      "yen"
    ],
    "sentenceEn": [
      "My",
      "computer",
      "was",
      "made",
      "in",
      "China."
    ],
    "sentenceJa": "私のコンピュータは中国でつくられた",
    "sentenceDistractors": [
      "tour",
      "wrong"
    ]
  },
  {
    "num": "0491",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "Korea",
    "phonetic": "[kərí(:)ə]",
    "partOfSpeech": "名詞",
    "japanese": "韓国[朝鮮]",
    "tip": "[読み: コリ(ー)ア] / カテゴリ: 国・地域 / 類義/関連: 関連語:Korean(韓国[朝鮮]語, 韓国[朝鮮]人, 韓国[朝鮮]語の, 韓国[朝鮮](人)の) / メモ: アクセント注意",
    "distractorsJa": [
      "アイススケート",
      "メガネ",
      "サーフィン, 波乗り"
    ],
    "distractorsEn": [
      "ice-skating",
      "glasses",
      "surfing"
    ],
    "sentenceEn": [
      "Seoul",
      "is",
      "the",
      "capital",
      "of",
      "South",
      "Korea."
    ],
    "sentenceJa": "ソウルは韓国の首都です。",
    "sentenceDistractors": [
      "thought",
      "performance"
    ]
  },
  {
    "num": "0492",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "Mexico",
    "phonetic": "[méksikou]",
    "partOfSpeech": "名詞",
    "japanese": "メキシコ",
    "tip": "[読み: メクスィコウ] / カテゴリ: 国・地域 / 類義/関連: 関連語:Mexican(メキシコ人, メキシコ(人)の)",
    "distractorsJa": [
      "かさ",
      "レスリング",
      "考え、アイデア"
    ],
    "distractorsEn": [
      "umbrella",
      "wrestling",
      "idea"
    ],
    "sentenceEn": [
      "My",
      "cousin",
      "went",
      "to",
      "Mexico",
      "last",
      "month."
    ],
    "sentenceJa": "私のいとこは先月メキシコへ行きました。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0493",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "London",
    "phonetic": "[lʌ́ndən]",
    "partOfSpeech": "名詞",
    "japanese": "ロンドン",
    "tip": "[読み: ランドン] / カテゴリ: 国・地域 / メモ: 発音注意",
    "distractorsJa": [
      "郵便(物)、を郵便で送る",
      "国, (theをつけて)いなか",
      "ウェブサイト"
    ],
    "distractorsEn": [
      "mail",
      "country",
      "website"
    ],
    "sentenceEn": [
      "London",
      "is",
      "not",
      "so",
      "far",
      "from",
      "the",
      "sea."
    ],
    "sentenceJa": "ロンドンは海からそれほど遠くない",
    "sentenceDistractors": [
      "party",
      "cook"
    ]
  },
  {
    "num": "0494",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "Hawaii",
    "phonetic": "[həwá:i:]",
    "partOfSpeech": "名詞",
    "japanese": "(アメリカの)ハワイ州, ハワイ島",
    "tip": "[読み: ハワーイー] / カテゴリ: 国・地域 / 類義/関連: 関連語:Hawaiian(ハワイの)",
    "distractorsJa": [
      "リスト、名簿",
      "フランス",
      "国, (theをつけて)いなか"
    ],
    "distractorsEn": [
      "list",
      "France",
      "country"
    ],
    "sentenceEn": [
      "My",
      "family",
      "went",
      "to",
      "Hawaii",
      "during",
      "summer",
      "vacation."
    ],
    "sentenceJa": "私の家族は夏休みにハワイへ行った。",
    "sentenceDistractors": [
      "truth",
      "amazing"
    ]
  },
  {
    "num": "0495",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "golf",
    "phonetic": "[gɑ́:lf]",
    "partOfSpeech": "名詞",
    "japanese": "ゴルフ",
    "tip": "[読み: ゴールフ] / カテゴリ: スポーツ",
    "distractorsJa": [
      "サーフィン, 波乗り",
      "中国",
      "パスポート"
    ],
    "distractorsEn": [
      "surfing",
      "China",
      "passport"
    ],
    "sentenceEn": [
      "My",
      "father",
      "enjoys",
      "playing",
      "golf",
      "on",
      "Sundays."
    ],
    "sentenceJa": "私の父は日曜日にゴルフをするのを楽しんでいます。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0496",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "football",
    "phonetic": "[fútbɔ̀:l]",
    "partOfSpeech": "名詞",
    "japanese": "フットボール",
    "tip": "[読み: フットボール] / カテゴリ: スポーツ",
    "distractorsJa": [
      "ロンドン",
      "(ふつうsocksで)くつ下, ソックス",
      "賞、賞品、賞金"
    ],
    "distractorsEn": [
      "London",
      "sock",
      "prize"
    ],
    "sentenceEn": [
      "My",
      "brother",
      "plays",
      "football",
      "at",
      "college."
    ],
    "sentenceJa": "兄は大学でフットボールをしている",
    "sentenceDistractors": [
      "safe",
      "realize"
    ]
  },
  {
    "num": "0497",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "bowling",
    "phonetic": "[bóuliŋ]",
    "partOfSpeech": "名詞",
    "japanese": "ボウリング",
    "tip": "[読み: ボウリング] / カテゴリ: スポーツ",
    "distractorsJa": [
      "大きさ、寸法",
      "考え、アイデア",
      "韓国[朝鮮]"
    ],
    "distractorsEn": [
      "size",
      "idea",
      "Korea"
    ],
    "sentenceEn": [
      "We",
      "went",
      "bowling",
      "with",
      "our",
      "friends",
      "yesterday."
    ],
    "sentenceJa": "私たちは昨日、友達とボウリングに行きました。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0498",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "match",
    "phonetic": "[mætʃ]",
    "partOfSpeech": "名詞",
    "japanese": "試合, 競争相手",
    "tip": "[読み: マッチ] / カテゴリ: スポーツ",
    "distractorsJa": [
      "金、金(製)の",
      "切手、印、に判を押す",
      "賞、賞品、賞金"
    ],
    "distractorsEn": [
      "gold",
      "stamp",
      "prize"
    ],
    "sentenceEn": [
      "This",
      "tie",
      "doesn't",
      "match",
      "your",
      "shirt."
    ],
    "sentenceJa": "このネクタイはあなたのシャツに合いません。",
    "sentenceDistractors": [
      "worth",
      "fit"
    ]
  },
  {
    "num": "0499",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "ice-skating",
    "phonetic": "[áis skèitiŋ]",
    "partOfSpeech": "名詞",
    "japanese": "アイススケート",
    "tip": "[読み: アイス スケイティング] / カテゴリ: スポーツ",
    "distractorsJa": [
      "メガネ",
      "(米国・カナダなどの貨幣単位)ドル",
      "ボウリング"
    ],
    "distractorsEn": [
      "glasses",
      "dollar",
      "bowling"
    ],
    "sentenceEn": [
      "We",
      "enjoyed",
      "ice-skating",
      "in",
      "winter."
    ],
    "sentenceJa": "私たちは冬にアイススケートを楽しみました。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0500",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "surfing",
    "phonetic": "[sə́:rfiŋ]",
    "partOfSpeech": "名詞",
    "japanese": "サーフィン, 波乗り",
    "tip": "[読み: サーフィング] / カテゴリ: スポーツ / フレーズ例: go surfing (サーフィンに行く)",
    "distractorsJa": [
      "アイススケート",
      "灰色, グレー、灰色[グレー]の",
      "フットボール"
    ],
    "distractorsEn": [
      "ice-skating",
      "gray",
      "football"
    ],
    "sentenceEn": [
      "They",
      "often",
      "go",
      "surfing",
      "at",
      "this",
      "beach."
    ],
    "sentenceJa": "彼らはこのビーチへよくサーフィンに行きます。",
    "sentenceDistractors": [
      "ice-skating",
      "gray"
    ]
  },
  {
    "num": "0501",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "wrestling",
    "phonetic": "[résliŋ]",
    "partOfSpeech": "名詞",
    "japanese": "レスリング",
    "tip": "[読み: レスリング] / カテゴリ: スポーツ",
    "distractorsJa": [
      "大きさ、寸法",
      "(ふつうsocksで)くつ下, ソックス",
      "パスポート"
    ],
    "distractorsEn": [
      "size",
      "sock",
      "passport"
    ],
    "sentenceEn": [
      "He",
      "watched",
      "an",
      "exciting",
      "wrestling",
      "match."
    ],
    "sentenceJa": "彼は白熱したレスリングの試合を見ました。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0502",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "idea",
    "phonetic": "[aidí(:)ə]",
    "partOfSpeech": "名詞",
    "japanese": "考え、アイデア",
    "tip": "[読み: アイディ(ー)ア] / カテゴリ: その他 / メモ: アクセント注意",
    "distractorsJa": [
      "問題",
      "髪のカット、散髪",
      "郵便(物)、を郵便で送る"
    ],
    "distractorsEn": [
      "problem",
      "haircut",
      "mail"
    ],
    "sentenceEn": [
      "Tom",
      "thought",
      "of",
      "a",
      "good",
      "idea."
    ],
    "sentenceJa": "トムはよい考えを思いついた",
    "sentenceDistractors": [
      "word",
      "better"
    ]
  },
  {
    "num": "0503",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "news",
    "phonetic": "[nju:z]",
    "partOfSpeech": "名詞",
    "japanese": "ニュース、報道",
    "tip": "[読み: ニューズ] / カテゴリ: その他",
    "distractorsJa": [
      "オーストラリア",
      "(アメリカの)ハワイ州, ハワイ島",
      "座席"
    ],
    "distractorsEn": [
      "Australia",
      "Hawaii",
      "seat"
    ],
    "sentenceEn": [
      "I",
      "heard",
      "the",
      "news",
      "on",
      "the",
      "radio",
      "this",
      "morning."
    ],
    "sentenceJa": "私は今朝ラジオでそのニュースを聞いた",
    "sentenceDistractors": [
      "nature",
      "sun"
    ]
  },
  {
    "num": "0504",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "problem",
    "phonetic": "[prɑ́(:)bləm]",
    "partOfSpeech": "名詞",
    "japanese": "問題",
    "tip": "[読み: プラ(ー)ブレム] / カテゴリ: その他 / フレーズ例: No problem. (問題ありません[大丈夫です]。)",
    "distractorsJa": [
      "(アメリカの)ハワイ州, ハワイ島",
      "中国",
      "伝言、メッセージ"
    ],
    "distractorsEn": [
      "Hawaii",
      "China",
      "message"
    ],
    "sentenceEn": [
      "There",
      "are",
      "many",
      "problems",
      "in",
      "this",
      "city."
    ],
    "sentenceJa": "この市にはたくさんの問題がある",
    "sentenceDistractors": [
      "answer",
      "to"
    ]
  },
  {
    "num": "0505",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "Internet",
    "phonetic": "[íntərnèt]",
    "partOfSpeech": "名詞",
    "japanese": "(the Internetで)インターネット",
    "tip": "[読み: インタァネット] / カテゴリ: その他 / メモ: アクセント注意",
    "distractorsJa": [
      "カード、はがき、トランプの札",
      "ボウリング",
      "かさ"
    ],
    "distractorsEn": [
      "card",
      "bowling",
      "umbrella"
    ],
    "sentenceEn": [
      "Do",
      "you",
      "play",
      "games",
      "on",
      "the",
      "Internet?"
    ],
    "sentenceJa": "あなたはインターネットでゲームをしますか",
    "sentenceDistractors": [
      "mom",
      "green"
    ]
  },
  {
    "num": "0506",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "website",
    "phonetic": "[wébsàit]",
    "partOfSpeech": "名詞",
    "japanese": "ウェブサイト",
    "tip": "[読み: ウェブサイト] / カテゴリ: その他",
    "distractorsJa": [
      "伝言、メッセージ",
      "かさ",
      "メキシコ"
    ],
    "distractorsEn": [
      "message",
      "umbrella",
      "Mexico"
    ],
    "sentenceEn": [
      "This",
      "English",
      "website",
      "is",
      "useful",
      "for",
      "students."
    ],
    "sentenceJa": "(この英語のウェブサイトは生徒にとって役に立つ)",
    "sentenceDistractors": [
      "chorus",
      "wake"
    ]
  },
  {
    "num": "0507",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "mail",
    "phonetic": "[meil]",
    "partOfSpeech": "名詞",
    "japanese": "郵便(物)、を郵便で送る",
    "tip": "[読み: メイル] / カテゴリ: その他",
    "distractorsJa": [
      "かさ",
      "サーフィン, 波乗り",
      "(the Internetで)インターネット"
    ],
    "distractorsEn": [
      "umbrella",
      "surfing",
      "Internet"
    ],
    "sentenceEn": [
      "Did",
      "you",
      "check",
      "the",
      "mail",
      "this",
      "morning?"
    ],
    "sentenceJa": "今朝、郵便物を確認しましたか。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0508",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "message",
    "phonetic": "[mésidʒ]",
    "partOfSpeech": "名詞",
    "japanese": "伝言、メッセージ",
    "tip": "[読み: メセッヂ] / カテゴリ: その他",
    "distractorsJa": [
      "中国",
      "問題",
      "生活、生命、一生、人生"
    ],
    "distractorsEn": [
      "China",
      "problem",
      "life"
    ],
    "sentenceEn": [
      "Can",
      "I",
      "take",
      "a",
      "message?"
    ],
    "sentenceJa": "伝言をお受けしましょうか",
    "sentenceDistractors": [
      "ever",
      "store"
    ]
  },
  {
    "num": "0509",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "language",
    "phonetic": "[lǽŋgwidʒ]",
    "partOfSpeech": "名詞",
    "japanese": "言語、言葉",
    "tip": "[読み: ラングウェッヂ] / カテゴリ: その他 / メモ: 発音注意",
    "distractorsJa": [
      "中国",
      "アメリカ(合衆国)",
      "サーフィン, 波乗り"
    ],
    "distractorsEn": [
      "China",
      "America",
      "surfing"
    ],
    "sentenceEn": [
      "What",
      "language",
      "is",
      "spoken",
      "in",
      "Brazil?"
    ],
    "sentenceJa": "ブラジルでは何語が話されていますか",
    "sentenceDistractors": [
      "must",
      "paper"
    ]
  },
  {
    "num": "0510",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "card",
    "phonetic": "[kɑ:rd]",
    "partOfSpeech": "名詞",
    "japanese": "カード、はがき、トランプの札",
    "tip": "[読み: カード] / カテゴリ: その他 / フレーズ例: a Christmas card (クリスマスカード)",
    "distractorsJa": [
      "中国",
      "クリスマス",
      "パスポート"
    ],
    "distractorsEn": [
      "China",
      "Christmas",
      "passport"
    ],
    "sentenceEn": [
      "I",
      "sent",
      "him",
      "a",
      "Christmas",
      "card",
      "yesterday."
    ],
    "sentenceJa": "私は昨日，彼にクリスマスカードを送った",
    "sentenceDistractors": [
      "window",
      "ground"
    ]
  },
  {
    "num": "0511",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "stamp",
    "phonetic": "[stǽmp]",
    "partOfSpeech": "名詞",
    "japanese": "切手、印、に判を押す",
    "tip": "[読み: スタンプ] / カテゴリ: その他",
    "distractorsJa": [
      "(the Internetで)インターネット",
      "金、金(製)の",
      "生活、生命、一生、人生"
    ],
    "distractorsEn": [
      "Internet",
      "gold",
      "life"
    ],
    "sentenceEn": [
      "I",
      "collect",
      "stamps",
      "as",
      "a",
      "hobby."
    ],
    "sentenceJa": "私は趣味で切手を集めています。",
    "sentenceDistractors": [
      "artificial",
      "wide"
    ]
  },
  {
    "num": "0512",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "passport",
    "phonetic": "[pǽspɔ:rt]",
    "partOfSpeech": "名詞",
    "japanese": "パスポート",
    "tip": "[読み: パスポート] / カテゴリ: その他",
    "distractorsJa": [
      "リスト、名簿",
      "生活、生命、一生、人生",
      "賞、賞品、賞金"
    ],
    "distractorsEn": [
      "list",
      "life",
      "prize"
    ],
    "sentenceEn": [
      "You",
      "must",
      "show",
      "your",
      "passport",
      "at",
      "the",
      "airport."
    ],
    "sentenceJa": "空港ではパスポートを見せなければなりません。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0513",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "Christmas",
    "phonetic": "[krísməs]",
    "partOfSpeech": "名詞",
    "japanese": "クリスマス",
    "tip": "[読み: クリスマァス] / カテゴリ: その他 / メモ: 発音注意",
    "distractorsJa": [
      "フットボール",
      "ゴルフ",
      "大きさ、寸法"
    ],
    "distractorsEn": [
      "football",
      "golf",
      "size"
    ],
    "sentenceEn": [
      "We",
      "will",
      "have",
      "a",
      "Christmas",
      "party",
      "next",
      "week."
    ],
    "sentenceJa": "私たちは来週クリスマスパーティーを開く",
    "sentenceDistractors": [
      "clear",
      "temperature"
    ]
  },
  {
    "num": "0514",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "dream",
    "phonetic": "[dri:m]",
    "partOfSpeech": "名詞",
    "japanese": "夢、夢を見る",
    "tip": "[読み: ドゥリーム] / カテゴリ: その他 / フレーズ例: have a dream (夢がある)",
    "distractorsJa": [
      "イタリア",
      "部分、役割",
      "円"
    ],
    "distractorsEn": [
      "Italy",
      "part",
      "yen"
    ],
    "sentenceEn": [
      "I",
      "had",
      "a",
      "very",
      "strange",
      "dream",
      "last",
      "night."
    ],
    "sentenceJa": "昨夜とても奇妙な夢を見た",
    "sentenceDistractors": [
      "movie",
      "wait"
    ]
  },
  {
    "num": "0515",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "life",
    "phonetic": "[laif]",
    "partOfSpeech": "名詞",
    "japanese": "生活、生命、一生、人生",
    "tip": "[読み: ライフ] / カテゴリ: その他",
    "distractorsJa": [
      "かさ",
      "アメリカ(合衆国)",
      "メキシコ"
    ],
    "distractorsEn": [
      "umbrella",
      "America",
      "Mexico"
    ],
    "sentenceEn": [
      "How",
      "is",
      "your",
      "school",
      "life?"
    ],
    "sentenceJa": "学校生活はどうですか",
    "sentenceDistractors": [
      "visit",
      "high"
    ]
  },
  {
    "num": "0516",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "list",
    "phonetic": "[list]",
    "partOfSpeech": "名詞",
    "japanese": "リスト、名簿",
    "tip": "[読み: リスト] / カテゴリ: その他",
    "distractorsJa": [
      "賞、賞品、賞金",
      "問題",
      "機械"
    ],
    "distractorsEn": [
      "prize",
      "problem",
      "machine"
    ],
    "sentenceEn": [
      "This",
      "is",
      "the",
      "list",
      "of",
      "our",
      "guests",
      "tonight."
    ],
    "sentenceJa": "(これは今夜の招待客のリストだ)",
    "sentenceDistractors": [
      "airport",
      "although"
    ]
  },
  {
    "num": "0517",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "prize",
    "phonetic": "[praiz]",
    "partOfSpeech": "名詞",
    "japanese": "賞、賞品、賞金",
    "tip": "[読み: プライズ] / カテゴリ: その他",
    "distractorsJa": [
      "大きさ、寸法",
      "考え、アイデア",
      "アイススケート"
    ],
    "distractorsEn": [
      "size",
      "idea",
      "ice-skating"
    ],
    "sentenceEn": [
      "Daisuke",
      "got",
      "a",
      "prize",
      "in",
      "the",
      "contest."
    ],
    "sentenceJa": "ダイスケはコンテストで賞をもらった",
    "sentenceDistractors": [
      "July",
      "amount"
    ]
  },
  {
    "num": "0518",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "haircut",
    "phonetic": "[héərkʌt]",
    "partOfSpeech": "名詞",
    "japanese": "髪のカット、散髪",
    "tip": "[読み: ヘアカット] / カテゴリ: その他",
    "distractorsJa": [
      "カード、はがき、トランプの札",
      "リスト、名簿",
      "クリスマス"
    ],
    "distractorsEn": [
      "card",
      "list",
      "Christmas"
    ],
    "sentenceEn": [
      "I",
      "got",
      "a",
      "new",
      "haircut",
      "last",
      "Saturday."
    ],
    "sentenceJa": "私は先週の土曜日に散髪しました。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0519",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "size",
    "phonetic": "[saiz]",
    "partOfSpeech": "名詞",
    "japanese": "大きさ、寸法",
    "tip": "[読み: サイズ] / カテゴリ: その他",
    "distractorsJa": [
      "生活、生命、一生、人生",
      "かさ",
      "アメリカ(合衆国)"
    ],
    "distractorsEn": [
      "life",
      "umbrella",
      "America"
    ],
    "sentenceEn": [
      "Do",
      "you",
      "have",
      "this",
      "shirt",
      "in",
      "a",
      "smaller",
      "size?"
    ],
    "sentenceJa": "このシャツのもっと小さいサイズはありますか",
    "sentenceDistractors": [
      "fire",
      "rock"
    ]
  },
  {
    "num": "0520",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "part",
    "phonetic": "[pɑ:rt]",
    "partOfSpeech": "名詞",
    "japanese": "部分、役割",
    "tip": "[読み: パート] / カテゴリ: その他",
    "distractorsJa": [
      "ニュース、報道",
      "座席",
      "フットボール"
    ],
    "distractorsEn": [
      "news",
      "seat",
      "football"
    ],
    "sentenceEn": [
      "The",
      "last",
      "part",
      "of",
      "the",
      "movie",
      "wasn't",
      "interesting."
    ],
    "sentenceJa": "その映画の最後の部分はおもしろくなかった",
    "sentenceDistractors": [
      "member",
      "foreign"
    ]
  },
  {
    "num": "0521",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "seat",
    "phonetic": "[si:t]",
    "partOfSpeech": "名詞",
    "japanese": "座席",
    "tip": "[読み: スィート] / カテゴリ: その他",
    "distractorsJa": [
      "クリスマス",
      "ロンドン",
      "アメリカ(合衆国)"
    ],
    "distractorsEn": [
      "Christmas",
      "London",
      "America"
    ],
    "sentenceEn": [
      "Please",
      "go",
      "back",
      "to",
      "your",
      "seat."
    ],
    "sentenceJa": "（どうぞ席にお戻りください）",
    "sentenceDistractors": [
      "dark",
      "land"
    ]
  },
  {
    "num": "0522",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "machine",
    "phonetic": "[məʃí:n]",
    "partOfSpeech": "名詞",
    "japanese": "機械",
    "tip": "[読み: マシーン] / カテゴリ: その他 / メモ: 発音注意 / フレーズ例: a washing machine (洗濯機)",
    "distractorsJa": [
      "かさ",
      "灰色, グレー、灰色[グレー]の",
      "カナダ"
    ],
    "distractorsEn": [
      "umbrella",
      "gray",
      "Canada"
    ],
    "sentenceEn": [
      "Put",
      "the",
      "clothes",
      "in",
      "the",
      "washing",
      "machine."
    ],
    "sentenceJa": "洗濯機に服を入れなさい。",
    "sentenceDistractors": [
      "newspaper",
      "face"
    ]
  },
  {
    "num": "0523",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "cook",
    "phonetic": "[kúk]",
    "partOfSpeech": "動詞",
    "japanese": "(を)料理する、料理をする人、コック",
    "tip": "[読み: クック] / カテゴリ: 動詞",
    "distractorsJa": [
      "(偶然)起こる",
      "踊る、ダンス",
      "を送る"
    ],
    "distractorsEn": [
      "happen",
      "dance",
      "send"
    ],
    "sentenceEn": [
      "Let's",
      "cook",
      "this",
      "fish",
      "for",
      "today's",
      "dinner."
    ],
    "sentenceJa": "この魚を今日の夕食に料理しましょう",
    "sentenceDistractors": [
      "cold",
      "TV"
    ]
  },
  {
    "num": "0524",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "leave",
    "phonetic": "[li:v]",
    "partOfSpeech": "動詞",
    "japanese": "(を)出発する、(を)去る、を置き忘れる",
    "tip": "[読み: リーヴ] / カテゴリ: 動詞 / フレーズ例: leave home (家を出発する)",
    "distractorsJa": [
      "を始める、始まる",
      "を送る",
      "を運ぶ、を持ち歩く"
    ],
    "distractorsEn": [
      "begin",
      "send",
      "carry"
    ],
    "sentenceEn": [
      "I",
      "leave",
      "home",
      "at",
      "seven",
      "every",
      "morning."
    ],
    "sentenceJa": "私は毎朝７時に家を出る",
    "sentenceDistractors": [
      "keep",
      "money"
    ]
  },
  {
    "num": "0525",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "clean",
    "phonetic": "[kli:n]",
    "partOfSpeech": "動詞",
    "japanese": "(を)きれいにする、そうじする、きれいな、清潔な",
    "tip": "[読み: クリーン] / カテゴリ: 動詞",
    "distractorsJa": [
      "を運ぶ、を持ち歩く",
      "眠る、睡眠",
      "(を)出発する、(を)去る、を置き忘れる"
    ],
    "distractorsEn": [
      "carry",
      "sleep",
      "leave"
    ],
    "sentenceEn": [
      "We",
      "have",
      "to",
      "clean",
      "our",
      "classroom",
      "after",
      "school."
    ],
    "sentenceJa": "私たちは放課後，教室をきれいにしなければならない",
    "sentenceDistractors": [
      "move",
      "night"
    ]
  },
  {
    "num": "0526",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "sleep",
    "phonetic": "[sli:p]",
    "partOfSpeech": "動詞",
    "japanese": "眠る、睡眠",
    "tip": "[読み: スリープ] / カテゴリ: 動詞 / 類義/関連: 同意語:go to bed(寝る)",
    "distractorsJa": [
      "を送る",
      "(を)出発する、(を)去る、を置き忘れる",
      "を始める、始まる"
    ],
    "distractorsEn": [
      "send",
      "leave",
      "begin"
    ],
    "sentenceEn": [
      "Last",
      "night",
      "I",
      "slept",
      "for",
      "eight",
      "hours."
    ],
    "sentenceJa": "私は昨夜，８時間眠った",
    "sentenceDistractors": [
      "festival",
      "those"
    ]
  },
  {
    "num": "0527",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "begin",
    "phonetic": "[bigín]",
    "partOfSpeech": "動詞",
    "japanese": "を始める、始まる",
    "tip": "[読み: ビギン] / カテゴリ: 動詞",
    "distractorsJa": [
      "(を)きれいにする、そうじする、きれいな、清潔な",
      "すわる、すわっている",
      "ほほえむ、ほほえみ"
    ],
    "distractorsEn": [
      "clean",
      "sit",
      "smile"
    ],
    "sentenceEn": [
      "The",
      "first",
      "class",
      "begins",
      "at",
      "eight",
      "fifty."
    ],
    "sentenceJa": "1時間目は8時50分に始まる",
    "sentenceDistractors": [
      "experience",
      "America"
    ]
  },
  {
    "num": "0528",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "send",
    "phonetic": "[send]",
    "partOfSpeech": "動詞",
    "japanese": "を送る",
    "tip": "[読み: センド] / カテゴリ: 動詞 / フレーズ例: send A to B (AをBに送る)",
    "distractorsJa": [
      "(を)きれいにする、そうじする、きれいな、清潔な",
      "(を)出発する、(を)去る、を置き忘れる",
      "を動かす、動く、引っ越す"
    ],
    "distractorsEn": [
      "clean",
      "leave",
      "move"
    ],
    "sentenceEn": [
      "I'm",
      "going",
      "to",
      "send",
      "an",
      "e-mail",
      "to",
      "Ann."
    ],
    "sentenceJa": "私はアンにEメールを送るつもりだ",
    "sentenceDistractors": [
      "later",
      "away"
    ]
  },
  {
    "num": "0529",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "learn",
    "phonetic": "[lə́:rn]",
    "partOfSpeech": "動詞",
    "japanese": "(を)学ぶ、(を)習う",
    "tip": "[読み: ラーン] / カテゴリ: 動詞",
    "distractorsJa": [
      "(を)料理する、料理をする人、コック",
      "を驚かせる、をびっくりさせる、びっくりさせること",
      "眠る、睡眠"
    ],
    "distractorsEn": [
      "cook",
      "surprise",
      "sleep"
    ],
    "sentenceEn": [
      "They",
      "began",
      "to",
      "learn",
      "English",
      "in",
      "junior",
      "high",
      "school."
    ],
    "sentenceJa": "彼らは中学校で英語を習い始めた",
    "sentenceDistractors": [
      "should",
      "why"
    ]
  },
  {
    "num": "0530",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "dance",
    "phonetic": "[dǽns]",
    "partOfSpeech": "動詞",
    "japanese": "踊る、ダンス",
    "tip": "[読み: ダンス] / カテゴリ: 動詞 / 類義/関連: 関連語:dancer(ダンサー)",
    "distractorsJa": [
      "を驚かせる、をびっくりさせる、びっくりさせること",
      "(に)勝つ、を勝ち取る",
      "(を)学ぶ、(を)習う"
    ],
    "distractorsEn": [
      "surprise",
      "win",
      "learn"
    ],
    "sentenceEn": [
      "They",
      "danced",
      "to",
      "music",
      "on",
      "the",
      "stage."
    ],
    "sentenceJa": "彼らはステージで音楽に合わせて踊った",
    "sentenceDistractors": [
      "arrive",
      "black"
    ]
  },
  {
    "num": "0531",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "move",
    "phonetic": "[mu:v]",
    "partOfSpeech": "動詞",
    "japanese": "を動かす、動く、引っ越す",
    "tip": "[読み: ムーヴ] / カテゴリ: 動詞",
    "distractorsJa": [
      "(線を)引く、(絵・図を)かく",
      "を驚かせる、をびっくりさせる、びっくりさせること",
      "眠る、睡眠"
    ],
    "distractorsEn": [
      "draw",
      "surprise",
      "sleep"
    ],
    "sentenceEn": [
      "Can",
      "you",
      "move",
      "this",
      "desk",
      "to",
      "the",
      "left?"
    ],
    "sentenceJa": "この机を左に動かしてくれませんか",
    "sentenceDistractors": [
      "over",
      "love"
    ]
  },
  {
    "num": "0532",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "sit",
    "phonetic": "[sit]",
    "partOfSpeech": "動詞",
    "japanese": "すわる、すわっている",
    "tip": "[読み: スィット] / カテゴリ: 動詞 / 類義/関連: 反意語:stand(立つ、立っている) / フレーズ例: sit down (すわる、腰を下ろす)",
    "distractorsJa": [
      "(を)きれいにする、そうじする、きれいな、清潔な",
      "(線を)引く、(絵・図を)かく",
      "ほほえむ、ほほえみ"
    ],
    "distractorsEn": [
      "clean",
      "draw",
      "smile"
    ],
    "sentenceEn": [
      "Let's",
      "sit",
      "on",
      "that",
      "bench",
      "and",
      "eat",
      "lunch."
    ],
    "sentenceJa": "あのベンチにすわって昼食を食べましょう",
    "sentenceDistractors": [
      "grandfather",
      "sea"
    ]
  },
  {
    "num": "0533",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "win",
    "phonetic": "[win]",
    "partOfSpeech": "動詞",
    "japanese": "(に)勝つ、を勝ち取る",
    "tip": "[読み: ウィン] / カテゴリ: 動詞 / 類義/関連: 反意語:lose((に)負ける)",
    "distractorsJa": [
      "踊る、ダンス",
      "(線を)引く、(絵・図を)かく",
      "を驚かせる、をびっくりさせる、びっくりさせること"
    ],
    "distractorsEn": [
      "dance",
      "draw",
      "surprise"
    ],
    "sentenceEn": [
      "Try",
      "hard,",
      "and",
      "you’ll",
      "win",
      "the",
      "game."
    ],
    "sentenceJa": "がんばれば試合に勝てるよ",
    "sentenceDistractors": [
      "fly",
      "American"
    ]
  },
  {
    "num": "0534",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "carry",
    "phonetic": "[kǽri]",
    "partOfSpeech": "動詞",
    "japanese": "を運ぶ、を持ち歩く",
    "tip": "[読み: キャリィ] / カテゴリ: 動詞",
    "distractorsJa": [
      "を始める、始まる",
      "すわる、すわっている",
      "眠る、睡眠"
    ],
    "distractorsEn": [
      "begin",
      "sit",
      "sleep"
    ],
    "sentenceEn": [
      "Can",
      "you",
      "carry",
      "one",
      "of",
      "the",
      "boxes",
      "for",
      "me?"
    ],
    "sentenceJa": "箱の１つを運んでくれませんか",
    "sentenceDistractors": [
      "sick",
      "white"
    ]
  },
  {
    "num": "0535",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "draw",
    "phonetic": "[drɔ:]",
    "partOfSpeech": "動詞",
    "japanese": "(線を)引く、(絵・図を)かく",
    "tip": "[読み: ドゥロー] / カテゴリ: 動詞 / 類義/関連: 同意語:paint((絵の具で)をかく、にペンキをぬる)",
    "distractorsJa": [
      "ほほえむ、ほほえみ",
      "踊る、ダンス",
      "(に)勝つ、を勝ち取る"
    ],
    "distractorsEn": [
      "smile",
      "dance",
      "win"
    ],
    "sentenceEn": [
      "Reiko,",
      "draw",
      "a",
      "picture",
      "of",
      "a",
      "tree",
      "on",
      "the",
      "board."
    ],
    "sentenceJa": "レイコ, 黒板に木の絵を描きなさい",
    "sentenceDistractors": [
      "baby",
      "everything"
    ]
  },
  {
    "num": "0536",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "surprise",
    "phonetic": "[sərpráiz]",
    "partOfSpeech": "動詞",
    "japanese": "を驚かせる、をびっくりさせる、びっくりさせること",
    "tip": "[読み: サプライズ] / カテゴリ: 動詞 / フレーズ例: be surprised at 〜 (〜に驚く)",
    "distractorsJa": [
      "を運ぶ、を持ち歩く",
      "(を)料理する、料理をする人、コック",
      "ほほえむ、ほほえみ"
    ],
    "distractorsEn": [
      "carry",
      "cook",
      "smile"
    ],
    "sentenceEn": [
      "This",
      "is",
      "a",
      "surprise",
      "party!"
    ],
    "sentenceJa": "これはサプライズパーティーです！",
    "sentenceDistractors": [
      "total",
      "trust"
    ]
  },
  {
    "num": "0537",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "happen",
    "phonetic": "[hǽp(ə)n]",
    "partOfSpeech": "動詞",
    "japanese": "(偶然)起こる",
    "tip": "[読み: ハプン] / カテゴリ: 動詞 / フレーズ例: happen to do (偶然〜する)",
    "distractorsJa": [
      "(を)きれいにする、そうじする、きれいな、清潔な",
      "を動かす、動く、引っ越す",
      "(線を)引く、(絵・図を)かく"
    ],
    "distractorsEn": [
      "clean",
      "move",
      "draw"
    ],
    "sentenceEn": [
      "A",
      "big",
      "accident",
      "happened",
      "at",
      "the",
      "corner."
    ],
    "sentenceJa": "その角で大きな事故が起きた",
    "sentenceDistractors": [
      "open",
      "care"
    ]
  },
  {
    "num": "0538",
    "level": 9,
    "stageSlug": "eiken4_stage09",
    "english": "smile",
    "phonetic": "[smail]",
    "partOfSpeech": "動詞",
    "japanese": "ほほえむ、ほほえみ",
    "tip": "[読み: スマイル] / カテゴリ: 動詞",
    "distractorsJa": [
      "(を)きれいにする、そうじする、きれいな、清潔な",
      "を動かす、動く、引っ越す",
      "(に)勝つ、を勝ち取る"
    ],
    "distractorsEn": [
      "clean",
      "move",
      "win"
    ],
    "sentenceEn": [
      "The",
      "old",
      "man",
      "smiled",
      "at",
      "me."
    ],
    "sentenceJa": "その老人は私にほほえみかけた",
    "sentenceDistractors": [
      "letter",
      "parent"
    ]
  },
  {
    "num": "0539",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "relax",
    "phonetic": "[rilǽks]",
    "partOfSpeech": "動詞",
    "japanese": "をくつろがせる、くつろぐ",
    "tip": "[読み: リラァクス] / カテゴリ: 動詞",
    "distractorsJa": [
      "をのがす、がいなくてさびしく思う",
      "に入る",
      "を共有する、を分け合う、分け前"
    ],
    "distractorsEn": [
      "miss",
      "enter",
      "share"
    ],
    "sentenceEn": [
      "They",
      "relaxed",
      "after",
      "they",
      "had",
      "lunch",
      "in",
      "the",
      "park."
    ],
    "sentenceJa": "公園で昼食を食べたあと，彼らはくつろいだ",
    "sentenceDistractors": [
      "coat",
      "appear"
    ]
  },
  {
    "num": "0540",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "check",
    "phonetic": "[tʃek]",
    "partOfSpeech": "動詞",
    "japanese": "をチェックする、を点検する、チェック、点検",
    "tip": "[読み: チェック] / カテゴリ: 動詞",
    "distractorsJa": [
      "を共有する、を分け合う、分け前",
      "(を)理解する",
      "をのがす、がいなくてさびしく思う"
    ],
    "distractorsEn": [
      "share",
      "understand",
      "miss"
    ],
    "sentenceEn": [
      "Could",
      "you",
      "check",
      "my",
      "English",
      "letter,",
      "Ms.",
      "Green?"
    ],
    "sentenceJa": "グリーン先生、私の英語の手紙を点検していただけませんか",
    "sentenceDistractors": [
      "wall",
      "government"
    ]
  },
  {
    "num": "0541",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "remember",
    "phonetic": "[rimémbər]",
    "partOfSpeech": "動詞",
    "japanese": "(を)思い出す、(を)覚えている",
    "tip": "[読み: リメンバァ] / カテゴリ: 動詞 / 類義/関連: 反意語:forget((を)忘れる)",
    "distractorsJa": [
      "をのがす、がいなくてさびしく思う",
      "をくつろがせる、くつろぐ",
      "をチェックする、を点検する、チェック、点検"
    ],
    "distractorsEn": [
      "miss",
      "relax",
      "check"
    ],
    "sentenceEn": [
      "I",
      "know",
      "him,",
      "but",
      "I",
      "can't",
      "remember",
      "his",
      "name."
    ],
    "sentenceJa": "彼のことは知っているが、名前が思い出せない。",
    "sentenceDistractors": [
      "library",
      "part"
    ]
  },
  {
    "num": "0542",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "understand",
    "phonetic": "[ʌ̀ndərstǽnd]",
    "partOfSpeech": "動詞",
    "japanese": "(を)理解する",
    "tip": "[読み: アンダァスタンド] / カテゴリ: 動詞",
    "distractorsJa": [
      "に入る",
      "を共有する、を分け合う、分け前",
      "をチェックする、を点検する、チェック、点検"
    ],
    "distractorsEn": [
      "enter",
      "share",
      "check"
    ],
    "sentenceEn": [
      "Do",
      "you",
      "understand",
      "the",
      "meaning",
      "of",
      "this",
      "word?"
    ],
    "sentenceJa": "あなたはこの単語の意味がわかりますか",
    "sentenceDistractors": [
      "small",
      "most"
    ]
  },
  {
    "num": "0543",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "enter",
    "phonetic": "[éntər]",
    "partOfSpeech": "動詞",
    "japanese": "に入る",
    "tip": "[読み: エンタァ] / カテゴリ: 動詞",
    "distractorsJa": [
      "(を)理解する",
      "(を)思い出す、(を)覚えている",
      "をチェックする、を点検する、チェック、点検"
    ],
    "distractorsEn": [
      "understand",
      "remember",
      "check"
    ],
    "sentenceEn": [
      "Don't",
      "enter",
      "the",
      "room",
      "without",
      "knocking",
      "on",
      "the",
      "door."
    ],
    "sentenceJa": "ドアをノックせずに部屋に入らないでください。",
    "sentenceDistractors": [
      "perfect",
      "across"
    ]
  },
  {
    "num": "0544",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "share",
    "phonetic": "[ʃeər]",
    "partOfSpeech": "動詞",
    "japanese": "を共有する、を分け合う、分け前",
    "tip": "[読み: シェア] / カテゴリ: 動詞 / フレーズ例: share A with B (AをBと分け合う)",
    "distractorsJa": [
      "をチェックする、を点検する、チェック、点検",
      "(を)思い出す、(を)覚えている",
      "に入る"
    ],
    "distractorsEn": [
      "check",
      "remember",
      "enter"
    ],
    "sentenceEn": [
      "I",
      "share",
      "the",
      "room",
      "with",
      "my",
      "sister."
    ],
    "sentenceJa": "私は妹と部屋を共有している",
    "sentenceDistractors": [
      "pet",
      "poor"
    ]
  },
  {
    "num": "0545",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "miss",
    "phonetic": "[mis]",
    "partOfSpeech": "動詞",
    "japanese": "をのがす、がいなくてさびしく思う",
    "tip": "[読み: ミス] / カテゴリ: 動詞 / フレーズ例: miss a bus (バスに乗り遅れる)",
    "distractorsJa": [
      "を共有する、を分け合う、分け前",
      "をチェックする、を点検する、チェック、点検",
      "(を)思い出す、(を)覚えている"
    ],
    "distractorsEn": [
      "share",
      "check",
      "remember"
    ],
    "sentenceEn": [
      "Last",
      "night,",
      "I",
      "missed",
      "the",
      "last",
      "bus",
      "and",
      "took",
      "a",
      "taxi."
    ],
    "sentenceJa": "昨夜，私は最終バスに乗り遅れて，タクシーに乗った",
    "sentenceDistractors": [
      "camp",
      "period"
    ]
  },
  {
    "num": "0546",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "rainy",
    "phonetic": "[réini]",
    "partOfSpeech": "形容詞",
    "japanese": "雨の、雨降りの",
    "tip": "[読み: レイニィ] / カテゴリ: 形容詞",
    "distractorsJa": [
      "大きい, 多数の, 多量の",
      "悲しい",
      "年下の、年下の人"
    ],
    "distractorsEn": [
      "large",
      "sad",
      "junior"
    ],
    "sentenceEn": [
      "It",
      "was",
      "a",
      "rainy",
      "day."
    ],
    "sentenceJa": "雨の日でした。",
    "sentenceDistractors": [
      "shoot",
      "Sydney"
    ]
  },
  {
    "num": "0547",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "windy",
    "phonetic": "[wíndi]",
    "partOfSpeech": "形容詞",
    "japanese": "風の吹く、風の強い",
    "tip": "[読み: ウィンディ] / カテゴリ: 形容詞",
    "distractorsJa": [
      "重い、大量の",
      "甘い、甘い菓子",
      "きれいな, かわいらしい"
    ],
    "distractorsEn": [
      "heavy",
      "sweet",
      "pretty"
    ],
    "sentenceEn": [
      "It",
      "is",
      "very",
      "windy",
      "outside",
      "today."
    ],
    "sentenceJa": "今日は外がとても風が強いです。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0548",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "cool",
    "phonetic": "[ku:l]",
    "partOfSpeech": "形容詞",
    "japanese": "涼しい、冷たい、かっこいい",
    "tip": "[読み: クール] / カテゴリ: 形容詞 / 類義/関連: 反意語:warm(暖かい)",
    "distractorsJa": [
      "甘い、甘い菓子",
      "やさしい、簡単な、気楽な",
      "雨の、雨降りの"
    ],
    "distractorsEn": [
      "sweet",
      "easy",
      "rainy"
    ],
    "sentenceEn": [
      "It",
      "is",
      "cool",
      "in",
      "the",
      "morning",
      "these",
      "days."
    ],
    "sentenceJa": "最近, 午前中は涼しい",
    "sentenceDistractors": [
      "cup",
      "imagine"
    ]
  },
  {
    "num": "0549",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "easy",
    "phonetic": "[í:zi]",
    "partOfSpeech": "形容詞",
    "japanese": "やさしい、簡単な、気楽な",
    "tip": "[読み: イーズィ] / カテゴリ: 形容詞 / 類義/関連: 反意語:difficult(難しい、困難な)",
    "distractorsJa": [
      "同じ",
      "きれいな, かわいらしい",
      "おかしな, おもしろい"
    ],
    "distractorsEn": [
      "same",
      "pretty",
      "funny"
    ],
    "sentenceEn": [
      "It",
      "is",
      "easy",
      "for",
      "my",
      "father",
      "to",
      "catch",
      "fish",
      "in",
      "the",
      "sea."
    ],
    "sentenceJa": "父にとって海で魚をとるのは簡単だ",
    "sentenceDistractors": [
      "sound",
      "down"
    ]
  },
  {
    "num": "0550",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "heavy",
    "phonetic": "[hévi]",
    "partOfSpeech": "形容詞",
    "japanese": "重い、大量の",
    "tip": "[読み: ヘヴィ] / カテゴリ: 形容詞",
    "distractorsJa": [
      "怒った, 腹を立てた",
      "軽い, 明るい、光, 明るさ, 明かり",
      "雨の、雨降りの"
    ],
    "distractorsEn": [
      "angry",
      "light",
      "rainy"
    ],
    "sentenceEn": [
      "The",
      "box",
      "was",
      "too",
      "heavy",
      "for",
      "me",
      "to",
      "carry."
    ],
    "sentenceJa": "(その箱は重すぎて, 私は持ち運ぶことができなかった)",
    "sentenceDistractors": [
      "steal",
      "aurora"
    ]
  },
  {
    "num": "0551",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "light",
    "phonetic": "[láit]",
    "partOfSpeech": "形容詞",
    "japanese": "軽い, 明るい、光, 明るさ, 明かり",
    "tip": "[読み: ライト] / カテゴリ: 形容詞 / 類義/関連: 反意語:dark(暗い)",
    "distractorsJa": [
      "同じ",
      "眠い, 眠そうな",
      "のどがかわいた"
    ],
    "distractorsEn": [
      "same",
      "sleepy",
      "thirsty"
    ],
    "sentenceEn": [
      "Turn",
      "the",
      "light",
      "off",
      "and",
      "go",
      "to",
      "sleep."
    ],
    "sentenceJa": "明かりを消して寝なさい",
    "sentenceDistractors": [
      "dream",
      "letter"
    ]
  },
  {
    "num": "0552",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "large",
    "phonetic": "[lɑ́ːrdʒ]",
    "partOfSpeech": "形容詞",
    "japanese": "大きい, 多数の, 多量の",
    "tip": "[読み: ラージ] / カテゴリ: 形容詞 / 類義/関連: 同意語:big(大きい), 反意語:small(小さい)",
    "distractorsJa": [
      "遠い、遠くに",
      "やさしい、簡単な、気楽な",
      "(人が)興奮した, わくわくした"
    ],
    "distractorsEn": [
      "far",
      "easy",
      "excited"
    ],
    "sentenceEn": [
      "Brazil",
      "is",
      "a",
      "large",
      "country",
      "in",
      "South",
      "America."
    ],
    "sentenceJa": "ブラジルは南アメリカにある大きい国だ",
    "sentenceDistractors": [
      "hold",
      "bag"
    ]
  },
  {
    "num": "0553",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "medium",
    "phonetic": "[míːdiəm]",
    "partOfSpeech": "形容詞",
    "japanese": "中くらいの",
    "tip": "[読み: ミーディアム] / カテゴリ: 形容詞 / 類義/関連: 関連語:small(小さい), 関連語:large(大きい) / メモ: 発音注意 / フレーズ例: medium size (Mサイズ)",
    "distractorsJa": [
      "怒った, 腹を立てた",
      "悪い, 間違った, 調子が悪い",
      "風の吹く、風の強い"
    ],
    "distractorsEn": [
      "angry",
      "wrong",
      "windy"
    ],
    "sentenceEn": [
      "Do",
      "you",
      "have",
      "this",
      "shirt",
      "in",
      "medium",
      "size?"
    ],
    "sentenceJa": "このシャツのMサイズはありますか。",
    "sentenceDistractors": [
      "angry",
      "wrong"
    ]
  },
  {
    "num": "0554",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "little",
    "phonetic": "[lítl]",
    "partOfSpeech": "形容詞",
    "japanese": "小さい, (小さくて)かわいらしい",
    "tip": "[読み: リトゥル] / カテゴリ: 形容詞 / 類義/関連: 反意語:big(大きい), 反意語:large(大きい)",
    "distractorsJa": [
      "いっぱいの, 満腹の",
      "専門職の, プロの、プロ, 専門家",
      "遠い、遠くに"
    ],
    "distractorsEn": [
      "full",
      "professional",
      "far"
    ],
    "sentenceEn": [
      "I",
      "found",
      "a",
      "little",
      "cat",
      "in",
      "the",
      "park."
    ],
    "sentenceJa": "私は公園で小さなネコを見つけた",
    "sentenceDistractors": [
      "put",
      "dog"
    ]
  },
  {
    "num": "0555",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "busy",
    "phonetic": "[bízi]",
    "partOfSpeech": "形容詞",
    "japanese": "忙しい, にぎやかな",
    "tip": "[読み: ビズィ] / カテゴリ: 形容詞 / 類義/関連: 反意語:free(ひまな) / メモ: 発音注意",
    "distractorsJa": [
      "(人を)興奮させる, わくわくさせる",
      "怒った, 腹を立てた",
      "のどがかわいた"
    ],
    "distractorsEn": [
      "exciting",
      "angry",
      "thirsty"
    ],
    "sentenceEn": [
      "I'm",
      "too",
      "busy",
      "to",
      "have",
      "lunch",
      "with",
      "you",
      "today."
    ],
    "sentenceJa": "今日はあまりに忙しいのであなたと昼食をとれない",
    "sentenceDistractors": [
      "rule",
      "continue"
    ]
  },
  {
    "num": "0556",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "tired",
    "phonetic": "[táiərd]",
    "partOfSpeech": "形容詞",
    "japanese": "疲れた, あきた",
    "tip": "[読み: タイアド] / カテゴリ: 形容詞 / フレーズ例: be tired from 〜 (〜で疲れる)",
    "distractorsJa": [
      "低い、低く",
      "忙しい, にぎやかな",
      "重い、大量の"
    ],
    "distractorsEn": [
      "low",
      "busy",
      "heavy"
    ],
    "sentenceEn": [
      "He",
      "was",
      "so",
      "tired",
      "that",
      "he",
      "went",
      "to",
      "bed",
      "early."
    ],
    "sentenceJa": "彼はとても疲れていたので，早く寝た",
    "sentenceDistractors": [
      "baseball",
      "power"
    ]
  },
  {
    "num": "0557",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "sleepy",
    "phonetic": "[slíːpi]",
    "partOfSpeech": "形容詞",
    "japanese": "眠い, 眠そうな",
    "tip": "[読み: スリーピィ] / カテゴリ: 形容詞",
    "distractorsJa": [
      "いっぱいの, 満腹の",
      "悲しい",
      "すばらしい, すてきな"
    ],
    "distractorsEn": [
      "full",
      "sad",
      "wonderful"
    ],
    "sentenceEn": [
      "I",
      "felt",
      "very",
      "sleepy",
      "after",
      "lunch."
    ],
    "sentenceJa": "私は昼食後とても眠く感じました。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0558",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "healthy",
    "phonetic": "[hélθi]",
    "partOfSpeech": "形容詞",
    "japanese": "健康な",
    "tip": "[読み: ヘルスイ] / カテゴリ: 形容詞",
    "distractorsJa": [
      "たいくつな, うんざりさせる",
      "中くらいの",
      "重い、大量の"
    ],
    "distractorsEn": [
      "boring",
      "medium",
      "heavy"
    ],
    "sentenceEn": [
      "The",
      "man",
      "has",
      "a",
      "strong",
      "and",
      "healthy",
      "body."
    ],
    "sentenceJa": "その男の人は強くて健康な体を持っている",
    "sentenceDistractors": [
      "customer",
      "kid"
    ]
  },
  {
    "num": "0559",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "strong",
    "phonetic": "[strɔ́ːŋ]",
    "partOfSpeech": "形容詞",
    "japanese": "強い",
    "tip": "[読み: ストゥロ(ー)ング] / カテゴリ: 形容詞 / 類義/関連: 反意語:weak(弱い)",
    "distractorsJa": [
      "(人を)興奮させる, わくわくさせる",
      "悲しい",
      "すばらしい, すてきな"
    ],
    "distractorsEn": [
      "exciting",
      "sad",
      "wonderful"
    ],
    "sentenceEn": [
      "Our",
      "baseball",
      "team",
      "is",
      "strong",
      "this",
      "year."
    ],
    "sentenceJa": "私たちの野球チームは今年は強い",
    "sentenceDistractors": [
      "into",
      "week"
    ]
  },
  {
    "num": "0560",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "angry",
    "phonetic": "[ǽŋɡri]",
    "partOfSpeech": "形容詞",
    "japanese": "怒った, 腹を立てた",
    "tip": "[読み: アングリィ] / カテゴリ: 形容詞",
    "distractorsJa": [
      "きれいな, かわいらしい",
      "汚い, 汚れた",
      "たいくつな, うんざりさせる"
    ],
    "distractorsEn": [
      "pretty",
      "dirty",
      "boring"
    ],
    "sentenceEn": [
      "The",
      "teacher",
      "got",
      "angry",
      "because",
      "I",
      "came",
      "late."
    ],
    "sentenceJa": "私が遅刻したので、先生は怒った",
    "sentenceDistractors": [
      "basketball",
      "p.m. / P.M."
    ]
  },
  {
    "num": "0561",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "sad",
    "phonetic": "[sǽd]",
    "partOfSpeech": "形容詞",
    "japanese": "悲しい",
    "tip": "[読み: サッド] / カテゴリ: 形容詞 / 類義/関連: 反意語:glad(うれしい), 反意語:happy(うれしい)",
    "distractorsJa": [
      "のどがかわいた",
      "同じ",
      "おかしな, おもしろい"
    ],
    "distractorsEn": [
      "thirsty",
      "same",
      "funny"
    ],
    "sentenceEn": [
      "I",
      "was",
      "very",
      "sad",
      "to",
      "hear",
      "the",
      "news."
    ],
    "sentenceJa": "私はその知らせを聞いてとても悲しかった。",
    "sentenceDistractors": [
      "television",
      "computer"
    ]
  },
  {
    "num": "0562",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "excited",
    "phonetic": "[iksáitid]",
    "partOfSpeech": "形容詞",
    "japanese": "(人が)興奮した, わくわくした",
    "tip": "[読み: イクサイティッド] / カテゴリ: 形容詞",
    "distractorsJa": [
      "(人を)興奮させる, わくわくさせる",
      "ごく近い, 親密な",
      "健康な"
    ],
    "distractorsEn": [
      "exciting",
      "close",
      "healthy"
    ],
    "sentenceEn": [
      "People",
      "in",
      "the",
      "stadium",
      "were",
      "very",
      "excited."
    ],
    "sentenceJa": "スタジアムにいた人々はとても興奮していた",
    "sentenceDistractors": [
      "easily",
      "nature"
    ]
  },
  {
    "num": "0563",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "exciting",
    "phonetic": "[iksáitiŋ]",
    "partOfSpeech": "形容詞",
    "japanese": "(人を)興奮させる, わくわくさせる",
    "tip": "[読み: イクサイティング] / カテゴリ: 形容詞",
    "distractorsJa": [
      "重い、大量の",
      "両方の、両方",
      "眠い, 眠そうな"
    ],
    "distractorsEn": [
      "heavy",
      "both",
      "sleepy"
    ],
    "sentenceEn": [
      "Sports",
      "day",
      "was",
      "very",
      "exciting."
    ],
    "sentenceJa": "体育祭はとてもわくわくするものだった",
    "sentenceDistractors": [
      "evening",
      "sky"
    ]
  },
  {
    "num": "0564",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "boring",
    "phonetic": "[bɔ́ːriŋ]",
    "partOfSpeech": "形容詞",
    "japanese": "たいくつな, うんざりさせる",
    "tip": "[読み: ボーリング] / カテゴリ: 形容詞",
    "distractorsJa": [
      "汚い, 汚れた",
      "遠い、遠くに",
      "年下の、年下の人"
    ],
    "distractorsEn": [
      "dirty",
      "far",
      "junior"
    ],
    "sentenceEn": [
      "This",
      "movie",
      "is",
      "very",
      "boring."
    ],
    "sentenceJa": "この映画はとても退屈です。",
    "sentenceDistractors": [
      "training",
      "speaker"
    ]
  },
  {
    "num": "0565",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "funny",
    "phonetic": "[fʌ́ni]",
    "partOfSpeech": "形容詞",
    "japanese": "おかしな, おもしろい",
    "tip": "[読み: ファニィ] / カテゴリ: 形容詞",
    "distractorsJa": [
      "(人が)興奮した, わくわくした",
      "忙しい, にぎやかな",
      "疲れた, あきた"
    ],
    "distractorsEn": [
      "excited",
      "busy",
      "tired"
    ],
    "sentenceEn": [
      "He",
      "told",
      "a",
      "funny",
      "story."
    ],
    "sentenceJa": "彼は面白い話をしました。",
    "sentenceDistractors": [
      "key",
      "atmosphere"
    ]
  },
  {
    "num": "0566",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "sweet",
    "phonetic": "[swíːt]",
    "partOfSpeech": "形容詞",
    "japanese": "甘い、甘い菓子",
    "tip": "[読み: スウィート] / カテゴリ: 形容詞 / 類義/関連: 反意語:bitter(にがい)",
    "distractorsJa": [
      "ごく近い, 親密な",
      "それぞれの, 各自の、それぞれ, 各自、1個につき, 1人につき",
      "たいくつな, うんざりさせる"
    ],
    "distractorsEn": [
      "close",
      "each",
      "boring"
    ],
    "sentenceEn": [
      "Do",
      "you",
      "often",
      "eat",
      "sweet",
      "things",
      "between",
      "meals?"
    ],
    "sentenceJa": "(あなたはよく食間に, 甘いものを食べますか)",
    "sentenceDistractors": [
      "stadium",
      "April"
    ]
  },
  {
    "num": "0567",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "close",
    "phonetic": "[klous]",
    "partOfSpeech": "形容詞",
    "japanese": "ごく近い, 親密な",
    "tip": "[読み: クロウス] / カテゴリ: 形容詞 / 類義/関連: 同意語:near(近い) / メモ: 発音注意",
    "distractorsJa": [
      "大きい, 多数の, 多量の",
      "悲しい",
      "(速度・動きが)速い, すばやい"
    ],
    "distractorsEn": [
      "large",
      "sad",
      "quick"
    ],
    "sentenceEn": [
      "Close",
      "the",
      "door",
      "and",
      "lock",
      "it",
      "when",
      "you",
      "leave."
    ],
    "sentenceJa": "出かけるときはドアを閉めてかぎをかけてください",
    "sentenceDistractors": [
      "yen",
      "door"
    ]
  },
  {
    "num": "0568",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "far",
    "phonetic": "[fɑ́ːr]",
    "partOfSpeech": "形容詞",
    "japanese": "遠い、遠くに",
    "tip": "[読み: ファー] / カテゴリ: 形容詞 / 類義/関連: 反意語:near(近い) / フレーズ例: far from 〜 (〜から遠い)",
    "distractorsJa": [
      "すばらしい, すてきな",
      "健康な",
      "両方の、両方"
    ],
    "distractorsEn": [
      "wonderful",
      "healthy",
      "both"
    ],
    "sentenceEn": [
      "The",
      "airport",
      "is",
      "far",
      "from",
      "the",
      "center",
      "of",
      "the",
      "city."
    ],
    "sentenceJa": "その空港は市の中心部から遠い",
    "sentenceDistractors": [
      "rich",
      "map"
    ]
  },
  {
    "num": "0569",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "wonderful",
    "phonetic": "[wʌ́ndərf(ə)l]",
    "partOfSpeech": "形容詞",
    "japanese": "すばらしい, すてきな",
    "tip": "[読み: ワンダフル] / カテゴリ: 形容詞",
    "distractorsJa": [
      "重い、大量の",
      "(many, muchの最上級)最も多い、(muchの最上級)最も, (most＋形容詞, 副詞で)最も〜",
      "低い、低く"
    ],
    "distractorsEn": [
      "heavy",
      "most",
      "low"
    ],
    "sentenceEn": [
      "Thank",
      "you",
      "for",
      "the",
      "wonderful",
      "present!"
    ],
    "sentenceJa": "すばらしいプレゼントをありがとう！",
    "sentenceDistractors": [
      "yesterday",
      "turn"
    ]
  },
  {
    "num": "0570",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "same",
    "phonetic": "[seim]",
    "partOfSpeech": "形容詞",
    "japanese": "同じ",
    "tip": "[読み: セイム] / カテゴリ: 形容詞 / フレーズ例: the same A as B (Bと同じA)",
    "distractorsJa": [
      "専門職の, プロの、プロ, 専門家",
      "中くらいの",
      "のどがかわいた"
    ],
    "distractorsEn": [
      "professional",
      "medium",
      "thirsty"
    ],
    "sentenceEn": [
      "We",
      "are",
      "in",
      "the",
      "same",
      "class",
      "this",
      "year."
    ],
    "sentenceJa": "僕らは今年，同じクラスだ",
    "sentenceDistractors": [
      "money",
      "interested"
    ]
  },
  {
    "num": "0571",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "both",
    "phonetic": "[bouθ]",
    "partOfSpeech": "形容詞",
    "japanese": "両方の、両方",
    "tip": "[読み: ボウス] / カテゴリ: 形容詞 / フレーズ例: both of 〜 (〜の両方とも)",
    "distractorsJa": [
      "中くらいの",
      "低い、低く",
      "年下の、年下の人"
    ],
    "distractorsEn": [
      "medium",
      "low",
      "junior"
    ],
    "sentenceEn": [
      "Both",
      "of",
      "my",
      "parents",
      "are",
      "from",
      "Hokkaido."
    ],
    "sentenceJa": "私の親は両方とも北海道の出身だ",
    "sentenceDistractors": [
      "flower",
      "space"
    ]
  },
  {
    "num": "0572",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "each",
    "phonetic": "[íːtʃ]",
    "partOfSpeech": "形容詞",
    "japanese": "それぞれの, 各自の、それぞれ, 各自、1個につき, 1人につき",
    "tip": "[読み: イーチ] / カテゴリ: 形容詞 / フレーズ例: each other (おたがい)",
    "distractorsJa": [
      "いっぱいの, 満腹の",
      "中くらいの",
      "悲しい"
    ],
    "distractorsEn": [
      "full",
      "medium",
      "sad"
    ],
    "sentenceEn": [
      "She",
      "smiled",
      "at",
      "each",
      "student",
      "in",
      "the",
      "class."
    ],
    "sentenceJa": "彼女はクラスの生徒1人1人にほほえんだ",
    "sentenceDistractors": [
      "big",
      "always"
    ]
  },
  {
    "num": "0573",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "full",
    "phonetic": "[ful]",
    "partOfSpeech": "形容詞",
    "japanese": "いっぱいの, 満腹の",
    "tip": "[読み: フル] / カテゴリ: 形容詞 / 類義/関連: 反意語:hungry(空腹の) / フレーズ例: be full of 〜 (〜でいっぱいである)",
    "distractorsJa": [
      "年下の、年下の人",
      "正しい, 正確な, 右の、正しく, ちょうど、右",
      "風の吹く、風の強い"
    ],
    "distractorsEn": [
      "junior",
      "right",
      "windy"
    ],
    "sentenceEn": [
      "The",
      "morning",
      "train",
      "was",
      "full",
      "of",
      "passengers."
    ],
    "sentenceJa": "朝の列車は乗客でいっぱいだった",
    "sentenceDistractors": [
      "themselves",
      "ready"
    ]
  },
  {
    "num": "0574",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "thirsty",
    "phonetic": "[θə́ːrsti]",
    "partOfSpeech": "形容詞",
    "japanese": "のどがかわいた",
    "tip": "[読み: サースティ] / カテゴリ: 形容詞",
    "distractorsJa": [
      "正しい, 正確な, 右の、正しく, ちょうど、右",
      "同じ",
      "強い"
    ],
    "distractorsEn": [
      "right",
      "same",
      "strong"
    ],
    "sentenceEn": [
      "I",
      "was",
      "very",
      "thirsty",
      "after",
      "running."
    ],
    "sentenceJa": "私は走ったあと、とても喉が渇いていました。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0575",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "pretty",
    "phonetic": "[príti]",
    "partOfSpeech": "形容詞",
    "japanese": "きれいな, かわいらしい",
    "tip": "[読み: プリティ] / カテゴリ: 形容詞 / 類義/関連: 同意語:beautiful(美しい)",
    "distractorsJa": [
      "眠い, 眠そうな",
      "中くらいの",
      "正しい, 正確な, 右の、正しく, ちょうど、右"
    ],
    "distractorsEn": [
      "sleepy",
      "medium",
      "right"
    ],
    "sentenceEn": [
      "She",
      "is",
      "a",
      "pretty",
      "girl."
    ],
    "sentenceJa": "彼女は可愛らしい女の子です。",
    "sentenceDistractors": [
      "vending machine",
      "thin"
    ]
  },
  {
    "num": "0576",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "dirty",
    "phonetic": "[də́ːrti]",
    "partOfSpeech": "形容詞",
    "japanese": "汚い, 汚れた",
    "tip": "[読み: ダーティ] / カテゴリ: 形容詞 / 類義/関連: 反意語:clean(きれいな, 清潔な)",
    "distractorsJa": [
      "(人が)興奮した, わくわくした",
      "大きい, 多数の, 多量の",
      "健康な"
    ],
    "distractorsEn": [
      "excited",
      "large",
      "healthy"
    ],
    "sentenceEn": [
      "Your",
      "hands",
      "are",
      "dirty."
    ],
    "sentenceJa": "あなたの手は汚れています。",
    "sentenceDistractors": [
      "pump",
      "telephone"
    ]
  },
  {
    "num": "0577",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "low",
    "phonetic": "[lou]",
    "partOfSpeech": "形容詞",
    "japanese": "低い、低く",
    "tip": "[読み: ロウ] / カテゴリ: 形容詞 / 類義/関連: 反意語:high(高い)",
    "distractorsJa": [
      "眠い, 眠そうな",
      "遠い、遠くに",
      "小さい, (小さくて)かわいらしい"
    ],
    "distractorsEn": [
      "sleepy",
      "far",
      "little"
    ],
    "sentenceEn": [
      "I",
      "don't",
      "like",
      "houses",
      "with",
      "low",
      "roofs."
    ],
    "sentenceJa": "私は屋根が低い家は好きではない",
    "sentenceDistractors": [
      "create",
      "nurse"
    ]
  },
  {
    "num": "0578",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "junior",
    "phonetic": "[dʒúːnjər]",
    "partOfSpeech": "形容詞",
    "japanese": "年下の、年下の人",
    "tip": "[読み: ジューニャ] / カテゴリ: 形容詞 / 類義/関連: 反意語:senior(年上の)",
    "distractorsJa": [
      "怒った, 腹を立てた",
      "正しい, 正確な, 右の、正しく, ちょうど、右",
      "眠い, 眠そうな"
    ],
    "distractorsEn": [
      "angry",
      "right",
      "sleepy"
    ],
    "sentenceEn": [
      "He",
      "is",
      "a",
      "junior",
      "high",
      "school",
      "student."
    ],
    "sentenceJa": "彼は中学生です。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0579",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "right",
    "phonetic": "[rait]",
    "partOfSpeech": "形容詞",
    "japanese": "正しい, 正確な, 右の、正しく, ちょうど、右",
    "tip": "[読み: ライト] / カテゴリ: 形容詞 / 類義/関連: 反意語:left(左(の)) / メモ: 発音注意",
    "distractorsJa": [
      "きれいな, かわいらしい",
      "悲しい",
      "甘い、甘い菓子"
    ],
    "distractorsEn": [
      "pretty",
      "sad",
      "sweet"
    ],
    "sentenceEn": [
      "Is",
      "this",
      "the",
      "right",
      "way",
      "to",
      "the",
      "Green",
      "Hotel?"
    ],
    "sentenceJa": "これはグリーンホテルへ行く正しい道ですか",
    "sentenceDistractors": [
      "need",
      "which"
    ]
  },
  {
    "num": "0580",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "wrong",
    "phonetic": "[rɔ́ːŋ]",
    "partOfSpeech": "形容詞",
    "japanese": "悪い, 間違った, 調子が悪い",
    "tip": "[読み: ロ(ー)ング] / カテゴリ: 形容詞",
    "distractorsJa": [
      "雨の、雨降りの",
      "ごく近い, 親密な",
      "専門職の, プロの、プロ, 専門家"
    ],
    "distractorsEn": [
      "rainy",
      "close",
      "professional"
    ],
    "sentenceEn": [
      "I've",
      "taken",
      "the",
      "wrong",
      "umbrella",
      "from",
      "the",
      "restaurant."
    ],
    "sentenceJa": "私はレストランから違うかさを持ってきた",
    "sentenceDistractors": [
      "mistake",
      "hospital"
    ]
  },
  {
    "num": "0581",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "quick",
    "phonetic": "[kwik]",
    "partOfSpeech": "形容詞",
    "japanese": "(速度・動きが)速い, すばやい",
    "tip": "[読み: クウィック] / カテゴリ: 形容詞 / 類義/関連: 反意語:slow(遅い)",
    "distractorsJa": [
      "雨の、雨降りの",
      "それぞれの, 各自の、それぞれ, 各自、1個につき, 1人につき",
      "年下の、年下の人"
    ],
    "distractorsEn": [
      "rainy",
      "each",
      "junior"
    ],
    "sentenceEn": [
      "We",
      "need",
      "a",
      "quick",
      "decision."
    ],
    "sentenceJa": "私たちは迅速な決定が必要です。",
    "sentenceDistractors": [
      "recognize",
      "personality"
    ]
  },
  {
    "num": "0582",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "professional",
    "phonetic": "[prəféʃ(ə)n(ə)l]",
    "partOfSpeech": "形容詞",
    "japanese": "専門職の, プロの、プロ, 専門家",
    "tip": "[読み: プロフェッショナル] / カテゴリ: 形容詞",
    "distractorsJa": [
      "(人を)興奮させる, わくわくさせる",
      "やさしい、簡単な、気楽な",
      "汚い, 汚れた"
    ],
    "distractorsEn": [
      "exciting",
      "easy",
      "dirty"
    ],
    "sentenceEn": [
      "My",
      "uncle",
      "is",
      "a",
      "professional",
      "golf",
      "player."
    ],
    "sentenceJa": "(おじはプロのゴルフ選手だ)",
    "sentenceDistractors": [
      "a.m. / A.M.",
      "size"
    ]
  },
  {
    "num": "0583",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "well",
    "phonetic": "[wel]",
    "partOfSpeech": "副詞",
    "japanese": "じょうずに, 十分に、健康で、まあ, さて",
    "tip": "[読み: ウェル] / カテゴリ: 副詞",
    "distractorsJa": [
      "遅く, ゆっくりと",
      "〜時",
      "いつも, 常に"
    ],
    "distractorsEn": [
      "slowly",
      "o’clock",
      "always"
    ],
    "sentenceEn": [
      "Aya",
      "can",
      "sing",
      "English",
      "songs",
      "very",
      "well."
    ],
    "sentenceJa": "アヤは英語の歌をとてもじょうずに歌える",
    "sentenceDistractors": [
      "play",
      "man"
    ]
  },
  {
    "num": "0584",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "sometimes",
    "phonetic": "[sʌ́mtaimz]",
    "partOfSpeech": "副詞",
    "japanese": "ときどき, ときには",
    "tip": "[読み: サムタイムズ] / カテゴリ: 副詞",
    "distractorsJa": [
      "いつも, 常に",
      "(未来の)いつか, そのうちに",
      "外に, 外側に、〜の外側に, 〜の外側で"
    ],
    "distractorsEn": [
      "always",
      "someday",
      "outside"
    ],
    "sentenceEn": [
      "I",
      "sometimes",
      "feel",
      "lonely."
    ],
    "sentenceJa": "（私はときどきさびしく感じる）",
    "sentenceDistractors": [
      "mountain",
      "still"
    ]
  },
  {
    "num": "0585",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "twice",
    "phonetic": "[twais]",
    "partOfSpeech": "副詞",
    "japanese": "2度, 2回",
    "tip": "[読み: トゥワイス] / カテゴリ: 副詞 / 類義/関連: 関連語:once(1度), 関連語:three times(3度)",
    "distractorsJa": [
      "外に, 外側に、〜の外側に, 〜の外側で",
      "すでに, もう",
      "じょうずに, 十分に、健康で、まあ, さて"
    ],
    "distractorsEn": [
      "outside",
      "already",
      "well"
    ],
    "sentenceEn": [
      "I",
      "have",
      "been",
      "to",
      "Rome",
      "twice."
    ],
    "sentenceJa": "(私はローマに2度行ったことがある)",
    "sentenceDistractors": [
      "express",
      "impress"
    ]
  },
  {
    "num": "0586",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "always",
    "phonetic": "[ɔ́ːlweiz]",
    "partOfSpeech": "副詞",
    "japanese": "いつも, 常に",
    "tip": "[読み: オールウェイズ] / カテゴリ: 副詞",
    "distractorsJa": [
      "(今から)〜前に",
      "〜時",
      "外に, 外側に、〜の外側に, 〜の外側で"
    ],
    "distractorsEn": [
      "ago",
      "o’clock",
      "outside"
    ],
    "sentenceEn": [
      "She",
      "is",
      "always",
      "late",
      "for",
      "our",
      "dates."
    ],
    "sentenceJa": "彼女はいつもデートに遅れる",
    "sentenceDistractors": [
      "game",
      "a, an"
    ]
  },
  {
    "num": "0587",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "o’clock",
    "phonetic": "[əklɑ́(:)k]",
    "partOfSpeech": "副詞",
    "japanese": "〜時",
    "tip": "[読み: オクラ(ー)ック] / カテゴリ: 副詞",
    "distractorsJa": [
      "2度, 2回",
      "いつも, 常に",
      "じょうずに, 十分に、健康で、まあ, さて"
    ],
    "distractorsEn": [
      "twice",
      "always",
      "well"
    ],
    "sentenceEn": [
      "The",
      "movie",
      "starts",
      "at",
      "seven",
      "o’clock."
    ],
    "sentenceJa": "その映画は7時に始まります。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0588",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "someday",
    "phonetic": "[sʌ́mdei]",
    "partOfSpeech": "副詞",
    "japanese": "(未来の)いつか, そのうちに",
    "tip": "[読み: サムデイ] / カテゴリ: 副詞 / 類義/関連: 同意語:one day((未来の)いつか, そのうちに)",
    "distractorsJa": [
      "じょうずに, 十分に、健康で、まあ, さて",
      "すでに, もう",
      "〜時"
    ],
    "distractorsEn": [
      "well",
      "already",
      "o’clock"
    ],
    "sentenceEn": [
      "Let's",
      "have",
      "dinner",
      "at",
      "the",
      "restaurant",
      "someday."
    ],
    "sentenceJa": "(いつかそのレストランで夕食を食べましょう)",
    "sentenceDistractors": [
      "meter",
      "soybean"
    ]
  },
  {
    "num": "0589",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "already",
    "phonetic": "[ɔːlrédi]",
    "partOfSpeech": "副詞",
    "japanese": "すでに, もう",
    "tip": "[読み: オールレディ] / カテゴリ: 副詞",
    "distractorsJa": [
      "じょうずに, 十分に、健康で、まあ, さて",
      "2度, 2回",
      "(未来の)いつか, そのうちに"
    ],
    "distractorsEn": [
      "well",
      "twice",
      "someday"
    ],
    "sentenceEn": [
      "Aki",
      "has",
      "already",
      "read",
      "that",
      "book."
    ],
    "sentenceJa": "アキはすでにその本を読んだ",
    "sentenceDistractors": [
      "graph",
      "excited"
    ]
  },
  {
    "num": "0590",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "slowly",
    "phonetic": "[slóuli]",
    "partOfSpeech": "副詞",
    "japanese": "遅く, ゆっくりと",
    "tip": "[読み: スロウリィ] / カテゴリ: 副詞",
    "distractorsJa": [
      "〜時",
      "(未来の)いつか, そのうちに",
      "2度, 2回"
    ],
    "distractorsEn": [
      "o’clock",
      "someday",
      "twice"
    ],
    "sentenceEn": [
      "Speak",
      "more",
      "slowly",
      "and",
      "clearly."
    ],
    "sentenceJa": "もっとゆっくり，はっきり話しなさい",
    "sentenceDistractors": [
      "tooth",
      "result"
    ]
  },
  {
    "num": "0591",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "ago",
    "phonetic": "[əɡóu]",
    "partOfSpeech": "副詞",
    "japanese": "(今から)〜前に",
    "tip": "[読み: アゴウ] / カテゴリ: 副詞 / フレーズ例: two hours ago (2時間前に)",
    "distractorsJa": [
      "いつも, 常に",
      "外に, 外側に、〜の外側に, 〜の外側で",
      "じょうずに, 十分に、健康で、まあ, さて"
    ],
    "distractorsEn": [
      "always",
      "outside",
      "well"
    ],
    "sentenceEn": [
      "I",
      "saw",
      "her",
      "two",
      "days",
      "ago."
    ],
    "sentenceJa": "私は２日前に彼女を見かけた",
    "sentenceDistractors": [
      "nice",
      "sometimes"
    ]
  },
  {
    "num": "0592",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "outside",
    "phonetic": "[àutsáid]",
    "partOfSpeech": "副詞",
    "japanese": "外に, 外側に、〜の外側に, 〜の外側で",
    "tip": "[読み: アウトサイド] / カテゴリ: 副詞 / 類義/関連: 反意語:inside(内側に)",
    "distractorsJa": [
      "ときどき, ときには",
      "いつも, 常に",
      "2度, 2回"
    ],
    "distractorsEn": [
      "sometimes",
      "always",
      "twice"
    ],
    "sentenceEn": [
      "Let's",
      "go",
      "outside",
      "and",
      "play",
      "catch."
    ],
    "sentenceJa": "外に出てキャッチボールをしよう",
    "sentenceDistractors": [
      "type",
      "age"
    ]
  },
  {
    "num": "0593",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "before",
    "phonetic": "[bifɔ́ːr]",
    "partOfSpeech": "前置詞",
    "japanese": "〜の前に、〜する前に、前に",
    "tip": "[読み: ビふォー] / カテゴリ: 前置詞 / 類義/関連: 反意語:after(〜の後に, 〜したあとで) / フレーズ例: before breakfast (朝食の前に)",
    "distractorsJa": [
      "〜の間ずっと, 〜のあいだのあるときに",
      "正しい, 正確な, 右の、正しく, ちょうど、右",
      "甘い、甘い菓子"
    ],
    "distractorsEn": [
      "during",
      "right",
      "sweet"
    ],
    "sentenceEn": [
      "I",
      "have",
      "to",
      "go",
      "home",
      "before",
      "dinner."
    ],
    "sentenceJa": "私は夕食前に家に帰らなければならない",
    "sentenceDistractors": [
      "buy",
      "does"
    ]
  },
  {
    "num": "0594",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "during",
    "phonetic": "[dúəriŋ]",
    "partOfSpeech": "前置詞",
    "japanese": "〜の間ずっと, 〜のあいだのあるときに",
    "tip": "[読み: ドゥーリング] / カテゴリ: 前置詞 / 類義/関連: 同意語:for((期間を表して)〜の間)",
    "distractorsJa": [
      "〜の前に、〜する前に、前に",
      "じょうずに, 十分に、健康で、まあ, さて",
      "をのがす、がいなくてさびしく思う"
    ],
    "distractorsEn": [
      "before",
      "well",
      "miss"
    ],
    "sentenceEn": [
      "I",
      "stayed",
      "at",
      "the",
      "hotel",
      "during",
      "that",
      "week."
    ],
    "sentenceJa": "（その週の間ずっと，私はそのホテルに滞在した）",
    "sentenceDistractors": [
      "number",
      "listen"
    ]
  },
  {
    "num": "0595",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "shall",
    "phonetic": "[ʃæl]",
    "partOfSpeech": "助動詞",
    "japanese": "(Shall I 〜? で)〜しましょうか, (Shall we 〜? で)(いっしょに)〜しませんか",
    "tip": "[読み: シャル] / カテゴリ: 助動詞 / 類義/関連: 関連語:Let's 〜(〜しよう。)",
    "distractorsJa": [
      "いつも, 常に",
      "(を)思い出す、(を)覚えている",
      "低い、低く"
    ],
    "distractorsEn": [
      "always",
      "remember",
      "low"
    ],
    "sentenceEn": [
      "Shall",
      "I",
      "do",
      "the",
      "dishes",
      "after",
      "dinner?"
    ],
    "sentenceJa": "夕食後に皿洗いをしましょうか",
    "sentenceDistractors": [
      "collect",
      "side"
    ]
  },
  {
    "num": "0596",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "mine",
    "phonetic": "[main]",
    "partOfSpeech": "代名詞",
    "japanese": "私のもの",
    "tip": "[読み: マイン] / カテゴリ: 代名詞 / メモ: Iの所有代名詞",
    "distractorsJa": [
      "何もかも, みんな",
      "悲しい",
      "午前"
    ],
    "distractorsEn": [
      "everything",
      "sad",
      "a.m."
    ],
    "sentenceEn": [
      "This",
      "big",
      "brown",
      "coat",
      "is",
      "mine."
    ],
    "sentenceJa": "(この大きな茶色のコートは私のだ)",
    "sentenceDistractors": [
      "effect",
      "satellite"
    ]
  },
  {
    "num": "0597",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "everything",
    "phonetic": "[évriθiŋ]",
    "partOfSpeech": "代名詞",
    "japanese": "何もかも, みんな",
    "tip": "[読み: エヴリスィング] / カテゴリ: 代名詞",
    "distractorsJa": [
      "私のもの",
      "のどがかわいた",
      "すでに, もう"
    ],
    "distractorsEn": [
      "mine",
      "thirsty",
      "already"
    ],
    "sentenceEn": [
      "My",
      "grandfather",
      "knows",
      "everything",
      "about",
      "jazz."
    ],
    "sentenceJa": "祖父はジャズについて何でも知っている",
    "sentenceDistractors": [
      "finally",
      "shopping"
    ]
  },
  {
    "num": "0598",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "most",
    "phonetic": "[moust]",
    "partOfSpeech": "形容詞",
    "japanese": "(many, muchの最上級)最も多い、(muchの最上級)最も, (most＋形容詞, 副詞で)最も〜",
    "tip": "[読み: モウスト] / カテゴリ: 比較表現 / フレーズ例: most popular (最も人気のある)",
    "distractorsJa": [
      "ごく近い, 親密な",
      "年下の、年下の人",
      "両方の、両方"
    ],
    "distractorsEn": [
      "close",
      "junior",
      "both"
    ],
    "sentenceEn": [
      "He",
      "is",
      "the",
      "most",
      "popular",
      "singer",
      "in",
      "China."
    ],
    "sentenceJa": "彼は中国で最も人気のある歌手だ",
    "sentenceDistractors": [
      "teacher",
      "I"
    ]
  },
  {
    "num": "0599",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "a.m.",
    "phonetic": "[èi ém]",
    "partOfSpeech": "略語",
    "japanese": "午前",
    "tip": "[読み: エイエム] / カテゴリ: 略語 / 類義/関連: 同意語:A.M.(午前)",
    "distractorsJa": [
      "午後",
      "小さい, (小さくて)かわいらしい",
      "忙しい, にぎやかな"
    ],
    "distractorsEn": [
      "p.m.",
      "little",
      "busy"
    ],
    "sentenceEn": [
      "The",
      "library",
      "opens",
      "at",
      "nine",
      "a.m."
    ],
    "sentenceJa": "図書館は午前9時に開きます。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0600",
    "level": 10,
    "stageSlug": "eiken4_stage10",
    "english": "p.m.",
    "phonetic": "[pìː ém]",
    "partOfSpeech": "略語",
    "japanese": "午後",
    "tip": "[読み: ピーエム] / カテゴリ: 略語 / 類義/関連: 同意語:P.M.(午後)",
    "distractorsJa": [
      "午前",
      "たいくつな, うんざりさせる",
      "涼しい、冷たい、かっこいい"
    ],
    "distractorsEn": [
      "a.m.",
      "boring",
      "cool"
    ],
    "sentenceEn": [
      "Our",
      "club",
      "practice",
      "ends",
      "at",
      "five",
      "p.m."
    ],
    "sentenceJa": "私たちの部活の練習は午後5時に終わります。",
    "sentenceDistractors": [
      "yesterday",
      "always"
    ]
  },
  {
    "num": "0601",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "want to do",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "〜したいと思う",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "〜を探す",
      "Bに向かって(Aを)出発する[離れる，去る]",
      "〜しに行く"
    ],
    "distractorsEn": [
      "look for ~",
      "leave (A) for B",
      "go doing"
    ],
    "sentenceEn": [
      "What",
      "do",
      "you",
      "want",
      "to",
      "eat",
      "for",
      "lunch?"
    ],
    "sentenceJa": "昼ごはんにあなたは何が食べたいですか。",
    "sentenceDistractors": [
      "look",
      "leave"
    ]
  },
  {
    "num": "0602",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "like doing [to do]",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "〜するのが好きだ，〜したい",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "〜を求める",
      "帰宅する",
      "入浴する"
    ],
    "distractorsEn": [
      "ask for ~",
      "go (back) home",
      "take a bath"
    ],
    "sentenceEn": [
      "The",
      "girls",
      "like",
      "making",
      "cookies."
    ],
    "sentenceJa": "その女の子たちはクッキーを作るのが好きです。",
    "sentenceDistractors": [
      "ask",
      "go"
    ]
  },
  {
    "num": "0603",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "want to be ~",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "〜になりたいと思う",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "写真をとる",
      "〜に着く",
      "〜に着く"
    ],
    "distractorsEn": [
      "take a picture",
      "arrive in ~",
      "arrive at ~"
    ],
    "sentenceEn": [
      "I",
      "wanted",
      "to",
      "be",
      "a",
      "pilot",
      "when",
      "I",
      "was",
      "young."
    ],
    "sentenceJa": "私は若い頃パイロットになりたいと思っていました。",
    "sentenceDistractors": [
      "take",
      "arrive"
    ]
  },
  {
    "num": "0604",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "need to do",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "〜する必要がある",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "目が覚める",
      "〜に着く，〜に到着する",
      "帰宅する"
    ],
    "distractorsEn": [
      "wake up",
      "get to ~",
      "get home"
    ],
    "sentenceEn": [
      "You",
      "need",
      "to",
      "bring",
      "lunch."
    ],
    "sentenceJa": "あなたは昼食を持ってくる必要があります。",
    "sentenceDistractors": [
      "wake",
      "get"
    ]
  },
  {
    "num": "0605",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "go (back) home",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "帰宅する",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "〜を待つ",
      "〜に着く，〜に到着する",
      "散歩をする"
    ],
    "distractorsEn": [
      "wait for ~",
      "get to ~",
      "take a walk"
    ],
    "sentenceEn": [
      "I",
      "have",
      "to",
      "go",
      "home",
      "now."
    ],
    "sentenceJa": "私はもう帰宅しなければなりません。",
    "sentenceDistractors": [
      "wait",
      "get"
    ]
  },
  {
    "num": "0606",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "get home",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "帰宅する",
    "tip": "カテゴリ: 動詞の働きをする熟語 / 類義/関連: 同意語:go home(帰宅する)",
    "distractorsJa": [
      "旅行に行く",
      "〜を聞く，〜に耳を傾ける",
      "〜になりたいと思う"
    ],
    "distractorsEn": [
      "go on a trip",
      "listen to ~",
      "want to be ~"
    ],
    "sentenceEn": [
      "Call",
      "me",
      "when",
      "you",
      "get",
      "home."
    ],
    "sentenceJa": "帰宅したら私に電話しなさい。",
    "sentenceDistractors": [
      "go",
      "listen"
    ]
  },
  {
    "num": "0607",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "come home",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "帰宅する",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "〜と話をする",
      "戻る，帰る",
      "帰宅する"
    ],
    "distractorsEn": [
      "talk with ~",
      "get back",
      "get home"
    ],
    "sentenceEn": [
      "Come",
      "home",
      "by",
      "five",
      "o'clock."
    ],
    "sentenceJa": "5時までに帰宅しなさい。",
    "sentenceDistractors": [
      "talk",
      "get"
    ]
  },
  {
    "num": "0608",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "do one's homework",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "宿題をする",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "帰宅する",
      "旅行に行く",
      "〜へ帰ってくる"
    ],
    "distractorsEn": [
      "come home",
      "go on a trip",
      "come back to ~"
    ],
    "sentenceEn": [
      "She",
      "didn't",
      "do",
      "her",
      "homework",
      "yesterday."
    ],
    "sentenceJa": "彼女は昨日宿題をしませんでした。",
    "sentenceDistractors": [
      "come",
      "go"
    ]
  },
  {
    "num": "0609",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "take A to B",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "AをBに連れていく",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "〜と友だちになる",
      "〜することをやめる",
      "〜について聞く"
    ],
    "distractorsEn": [
      "become friends with ~",
      "stop doing",
      "hear about ~"
    ],
    "sentenceEn": [
      "She",
      "took",
      "her",
      "son",
      "to",
      "the",
      "hospital."
    ],
    "sentenceJa": "彼女は息子を病院へ連れていきました。",
    "sentenceDistractors": [
      "become",
      "stop"
    ]
  },
  {
    "num": "0610",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "look for ~",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "〜を探す",
    "tip": "カテゴリ: 動詞の働きをする熟語 / 類義/関連: 参考表現:find(を見つける)",
    "distractorsJa": [
      "旅行に行く",
      "風邪をひいている",
      "〜のことを考える，〜を思い出す"
    ],
    "distractorsEn": [
      "go on a trip",
      "have a cold",
      "think of ~"
    ],
    "sentenceEn": [
      "I'm",
      "looking",
      "for",
      "my",
      "key."
    ],
    "sentenceJa": "私はかぎを探しています。",
    "sentenceDistractors": [
      "go",
      "have"
    ]
  },
  {
    "num": "0611",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "leave (A) for B",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "Bに向かって(Aを)出発する[離れる，去る]",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "旅行に行く",
      "宿題をする",
      "帰宅する"
    ],
    "distractorsEn": [
      "go on a trip",
      "do one's homework",
      "come home"
    ],
    "sentenceEn": [
      "I'll",
      "leave",
      "Tokyo",
      "for",
      "New",
      "York",
      "on",
      "Tuesday."
    ],
    "sentenceJa": "私は火曜日にニューヨークに向かって東京を出発します。",
    "sentenceDistractors": [
      "go",
      "do"
    ]
  },
  {
    "num": "0612",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "have a good time",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "楽しい時を過ごす",
    "tip": "カテゴリ: 動詞の働きをする熟語 / 類義/関連: 同意語:enjoy(を楽しむ), 反意語:have a hard time(つらい時を過ごす)",
    "distractorsJa": [
      "〜するのを楽しむ，楽しんで〜する",
      "〜しに行く",
      "〜を探す"
    ],
    "distractorsEn": [
      "enjoy doing",
      "go doing",
      "look for ~"
    ],
    "sentenceEn": [
      "We",
      "had",
      "a",
      "good",
      "time",
      "at",
      "the",
      "party",
      "last",
      "night."
    ],
    "sentenceJa": "私たちは昨晩パーティーで楽しい時を過ごしました。",
    "sentenceDistractors": [
      "enjoy",
      "go"
    ]
  },
  {
    "num": "0613",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "wait for ~",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "〜を待つ",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "〜する必要がある",
      "宿題をする",
      "〜に着く，〜に到着する"
    ],
    "distractorsEn": [
      "need to do",
      "do one's homework",
      "get to ~"
    ],
    "sentenceEn": [
      "I'll",
      "wait",
      "for",
      "you",
      "at",
      "the",
      "bus",
      "stop."
    ],
    "sentenceJa": "私はバス停であなたを待つつもりです。",
    "sentenceDistractors": [
      "need",
      "do"
    ]
  },
  {
    "num": "0614",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "stay in [at] ~",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "(場所に)泊まる，(場所に)滞在する",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "入浴する",
      "写真をとる",
      "Bに向かって(Aを)出発する[離れる，去る]"
    ],
    "distractorsEn": [
      "take a bath",
      "take a picture",
      "leave (A) for B"
    ],
    "sentenceEn": [
      "She",
      "stayed",
      "in",
      "the",
      "hotel",
      "for",
      "a",
      "week."
    ],
    "sentenceJa": "彼女は1週間そのホテルに泊まりました。",
    "sentenceDistractors": [
      "take",
      "take"
    ]
  },
  {
    "num": "0615",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "stay with ~",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "(人の)所に泊まる，(人の)所に滞在する",
    "tip": "カテゴリ: 動詞の働きをする熟語 / 類義/関連: 同意語:stay at one's home((人の)所に泊まる，(人の)所に滞在する)",
    "distractorsJa": [
      "〜に話をする",
      "(場所に)泊まる，(場所に)滞在する",
      "〜から帰ってくる，〜から戻ってくる"
    ],
    "distractorsEn": [
      "talk to ~",
      "stay in [at] ~",
      "come back from ~"
    ],
    "sentenceEn": [
      "I'm",
      "going",
      "to",
      "stay",
      "with",
      "my",
      "sister",
      "for",
      "a",
      "week."
    ],
    "sentenceJa": "私は1週間姉[妹]の所に泊まる予定です。",
    "sentenceDistractors": [
      "talk",
      "stay"
    ]
  },
  {
    "num": "0616",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "get up",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "起きる，立ち上がる",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "〜し始める",
      "AをBに連れていく",
      "楽しい時を過ごす"
    ],
    "distractorsEn": [
      "start doing [to do]",
      "take A to B",
      "have a good time"
    ],
    "sentenceEn": [
      "Get",
      "up!",
      "It's",
      "already",
      "eight",
      "thirty."
    ],
    "sentenceJa": "起きなさい！もう8時半ですよ。",
    "sentenceDistractors": [
      "start",
      "take"
    ]
  },
  {
    "num": "0617",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "wake up",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "目が覚める",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "Bに向かって(Aを)出発する[離れる，去る]",
      "〜する必要がある",
      "旅行をする"
    ],
    "distractorsEn": [
      "leave (A) for B",
      "need to do",
      "take a trip"
    ],
    "sentenceEn": [
      "She",
      "woke",
      "up",
      "at",
      "seven",
      "this",
      "morning."
    ],
    "sentenceJa": "彼女は今朝7時に目が覚めました。",
    "sentenceDistractors": [
      "leave",
      "need"
    ]
  },
  {
    "num": "0618",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "take a trip",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "旅行をする",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "〜に助けを求める",
      "宿題をする",
      "旅行に行く"
    ],
    "distractorsEn": [
      "ask ~ for help",
      "do one's homework",
      "go on a trip"
    ],
    "sentenceEn": [
      "Why",
      "don't",
      "we",
      "take",
      "a",
      "trip",
      "to",
      "the",
      "city?"
    ],
    "sentenceJa": "その街へ旅行するのはどうですか。",
    "sentenceDistractors": [
      "ask",
      "do"
    ]
  },
  {
    "num": "0619",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "go on a trip",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "旅行に行く",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "〜に話しかける，〜と話す",
      "〜になりたいと思う",
      "〜と友だちになる"
    ],
    "distractorsEn": [
      "speak to ~",
      "want to be ~",
      "become friends with ~"
    ],
    "sentenceEn": [
      "I",
      "want",
      "to",
      "go",
      "on",
      "a",
      "trip",
      "to",
      "Australia."
    ],
    "sentenceJa": "私はオーストラリアへ旅行に行きたいです。",
    "sentenceDistractors": [
      "speak",
      "want"
    ]
  },
  {
    "num": "0620",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "speak to ~",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "〜に話しかける，〜と話す",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "家にいる",
      "〜するのを楽しむ，楽しんで〜する",
      "〜になりたいと思う"
    ],
    "distractorsEn": [
      "stay (at) home",
      "enjoy doing",
      "want to be ~"
    ],
    "sentenceEn": [
      "We",
      "spoke",
      "to",
      "the",
      "new",
      "students",
      "at",
      "lunchtime."
    ],
    "sentenceJa": "私たちは昼食時間に新入生たちに話しかけました。",
    "sentenceDistractors": [
      "stay",
      "enjoy"
    ]
  },
  {
    "num": "0621",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "talk to ~",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "〜に話をする",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "〜しに行く",
      "〜に着く",
      "〜へ帰る，〜へ戻る"
    ],
    "distractorsEn": [
      "go doing",
      "arrive at ~",
      "go back to ~"
    ],
    "sentenceEn": [
      "I",
      "will",
      "talk",
      "to",
      "my",
      "teammates",
      "later."
    ],
    "sentenceJa": "私は後でチームメートに話すつもりです。",
    "sentenceDistractors": [
      "go",
      "arrive"
    ]
  },
  {
    "num": "0622",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "talk with ~",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "〜と話をする",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "戻る，帰る",
      "〜する必要がある",
      "シャワーを浴びる"
    ],
    "distractorsEn": [
      "get back",
      "need to do",
      "take a shower"
    ],
    "sentenceEn": [
      "They",
      "enjoyed",
      "talking",
      "with",
      "their",
      "teacher."
    ],
    "sentenceJa": "彼らは先生と話すのを楽しみました。",
    "sentenceDistractors": [
      "get",
      "need"
    ]
  },
  {
    "num": "0623",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "listen to ~",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "〜を聞く，〜に耳を傾ける",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "入浴する",
      "〜から帰ってくる，〜から戻ってくる",
      "外出する"
    ],
    "distractorsEn": [
      "take a bath",
      "come back from ~",
      "go out"
    ],
    "sentenceEn": [
      "She",
      "listened",
      "to",
      "the",
      "radio",
      "this",
      "morning."
    ],
    "sentenceJa": "彼女は今朝ラジオを聞きました。",
    "sentenceDistractors": [
      "take",
      "come"
    ]
  },
  {
    "num": "0624",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "hear about ~",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "〜について聞く",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "〜に着く，〜に到着する",
      "シャワーを浴びる",
      "〜に着く"
    ],
    "distractorsEn": [
      "get to ~",
      "take a shower",
      "arrive in ~"
    ],
    "sentenceEn": [
      "I",
      "heard",
      "about",
      "his",
      "new",
      "car."
    ],
    "sentenceJa": "私は彼の新しい車について聞きました。",
    "sentenceDistractors": [
      "get",
      "take"
    ]
  },
  {
    "num": "0625",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "go doing",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "〜しに行く",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "楽しい時を過ごす",
      "〜することをやめる",
      "(場所に)泊まる，(場所に)滞在する"
    ],
    "distractorsEn": [
      "have a good time",
      "stop doing",
      "stay in [at] ~"
    ],
    "sentenceEn": [
      "I'll",
      "go",
      "swimming",
      "with",
      "my",
      "friends",
      "on",
      "Saturday."
    ],
    "sentenceJa": "私は土曜日に友だちと泳ぎに行きます。",
    "sentenceDistractors": [
      "have",
      "stop"
    ]
  },
  {
    "num": "0626",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "finish doing",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "〜し終える",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "〜し始める",
      "〜のことを考える，〜を思い出す",
      "風邪をひいている"
    ],
    "distractorsEn": [
      "start doing [to do]",
      "think of ~",
      "have a cold"
    ],
    "sentenceEn": [
      "She",
      "finished",
      "reading",
      "the",
      "book."
    ],
    "sentenceJa": "彼女はその本を読み終えました。",
    "sentenceDistractors": [
      "start",
      "think"
    ]
  },
  {
    "num": "0627",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "enjoy doing",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "〜するのを楽しむ，楽しんで〜する",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "〜に話をする",
      "起きる，立ち上がる",
      "〜し始める"
    ],
    "distractorsEn": [
      "talk to ~",
      "get up",
      "start doing [to do]"
    ],
    "sentenceEn": [
      "She",
      "enjoys",
      "having",
      "dinner",
      "with",
      "her",
      "family."
    ],
    "sentenceJa": "彼女は家族と夕食を食べることを楽しみます。",
    "sentenceDistractors": [
      "talk",
      "get"
    ]
  },
  {
    "num": "0628",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "go back to ~",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "〜へ帰る，〜へ戻る",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "帰宅する",
      "宿題をする",
      "AをBに連れていく"
    ],
    "distractorsEn": [
      "go (back) home",
      "do one's homework",
      "take A to B"
    ],
    "sentenceEn": [
      "Let's",
      "go",
      "back",
      "to",
      "Japan."
    ],
    "sentenceJa": "日本へ帰りましょう。",
    "sentenceDistractors": [
      "go",
      "do"
    ]
  },
  {
    "num": "0629",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "come back to ~",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "〜へ帰ってくる",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "家にいる",
      "〜のことを考える，〜を思い出す",
      "〜に着く"
    ],
    "distractorsEn": [
      "stay (at) home",
      "think of ~",
      "arrive at ~"
    ],
    "sentenceEn": [
      "My",
      "uncle",
      "will",
      "come",
      "back",
      "to",
      "our",
      "town."
    ],
    "sentenceJa": "おじが私たちの町へ帰ってきます。",
    "sentenceDistractors": [
      "stay",
      "think"
    ]
  },
  {
    "num": "0630",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "get back",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "戻る，帰る",
    "tip": "カテゴリ: 動詞の働きをする熟語 / 類義/関連: 同意語:be back(戻ってくる)",
    "distractorsJa": [
      "〜のことを考える，〜を思い出す",
      "写真をとる",
      "〜を求める"
    ],
    "distractorsEn": [
      "think of ~",
      "take a picture",
      "ask for ~"
    ],
    "sentenceEn": [
      "We'll",
      "get",
      "back",
      "soon."
    ],
    "sentenceJa": "私たちはすぐに戻ります。",
    "sentenceDistractors": [
      "think",
      "take"
    ]
  },
  {
    "num": "0631",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "come back from ~",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "〜から帰ってくる，〜から戻ってくる",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "AをBに連れていく",
      "〜になりたいと思う",
      "旅行をする"
    ],
    "distractorsEn": [
      "take A to B",
      "want to be ~",
      "take a trip"
    ],
    "sentenceEn": [
      "He",
      "will",
      "come",
      "back",
      "from",
      "the",
      "U.S.",
      "next",
      "week."
    ],
    "sentenceJa": "彼は来週アメリカから帰ってきます。",
    "sentenceDistractors": [
      "take",
      "want"
    ]
  },
  {
    "num": "0632",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "arrive at ~",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "〜に着く",
    "tip": "カテゴリ: 動詞の働きをする熟語 / メモ: 駅，町など比較的せまい場所のときにatを使う",
    "distractorsJa": [
      "〜し始める",
      "(人の)所に泊まる，(人の)所に滞在する",
      "〜について聞く"
    ],
    "distractorsEn": [
      "start doing [to do]",
      "stay with ~",
      "hear about ~"
    ],
    "sentenceEn": [
      "The",
      "plane",
      "arrived",
      "at",
      "the",
      "airport."
    ],
    "sentenceJa": "その飛行機はその空港に着きました。",
    "sentenceDistractors": [
      "start",
      "stay"
    ]
  },
  {
    "num": "0633",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "arrive in ~",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "〜に着く",
    "tip": "カテゴリ: 動詞の働きをする熟語 / メモ: 大都会や国など比較的広い場所のときにinを使う",
    "distractorsJa": [
      "〜するのが好きだ，〜したい",
      "〜になりたいと思う",
      "起きる，立ち上がる"
    ],
    "distractorsEn": [
      "like doing [to do]",
      "want to be ~",
      "get up"
    ],
    "sentenceEn": [
      "They",
      "will",
      "arrive",
      "in",
      "the",
      "country",
      "at",
      "night."
    ],
    "sentenceJa": "彼らは夜にその国に到着するでしょう。",
    "sentenceDistractors": [
      "like",
      "want"
    ]
  },
  {
    "num": "0634",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "get to ~",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "〜に着く，〜に到着する",
    "tip": "カテゴリ: 動詞の働きをする熟語 / 類義/関連: 同意語:arrive at [in] ~(〜に着く，〜に到着する)",
    "distractorsJa": [
      "入浴する",
      "〜しに行く",
      "〜へ帰る，〜へ戻る"
    ],
    "distractorsEn": [
      "take a bath",
      "go doing",
      "go back to ~"
    ],
    "sentenceEn": [
      "We",
      "just",
      "got",
      "to",
      "Los",
      "Angeles",
      "this",
      "afternoon."
    ],
    "sentenceJa": "私たちは今日の午後ロサンゼルスに着いたところです。",
    "sentenceDistractors": [
      "take",
      "go"
    ]
  },
  {
    "num": "0635",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "start doing [to do]",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "〜し始める",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "〜に着く",
      "〜から帰ってくる，〜から戻ってくる",
      "シャワーを浴びる"
    ],
    "distractorsEn": [
      "arrive at ~",
      "come back from ~",
      "take a shower"
    ],
    "sentenceEn": [
      "I",
      "started",
      "studying",
      "at",
      "a",
      "music",
      "college",
      "last",
      "month."
    ],
    "sentenceJa": "私は先月から音楽大学で学び始めました。",
    "sentenceDistractors": [
      "arrive",
      "come"
    ]
  },
  {
    "num": "0636",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "stop doing",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "〜することをやめる",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "〜を聞く，〜に耳を傾ける",
      "風邪をひいている",
      "〜から帰ってくる，〜から戻ってくる"
    ],
    "distractorsEn": [
      "listen to ~",
      "have a cold",
      "come back from ~"
    ],
    "sentenceEn": [
      "My",
      "father",
      "stopped",
      "smoking",
      "five",
      "years",
      "ago."
    ],
    "sentenceJa": "私の父は5年前にたばこをやめました。",
    "sentenceDistractors": [
      "listen",
      "have"
    ]
  },
  {
    "num": "0637",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "take a picture",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "写真をとる",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "〜したいと思う",
      "〜へ帰ってくる",
      "外出する"
    ],
    "distractorsEn": [
      "want to do",
      "come back to ~",
      "go out"
    ],
    "sentenceEn": [
      "Let's",
      "take",
      "a",
      "picture",
      "together."
    ],
    "sentenceJa": "いっしょに写真をとりましょう。",
    "sentenceDistractors": [
      "want",
      "come"
    ]
  },
  {
    "num": "0638",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "walk to ~",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "〜まで歩いて行く",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "〜しに行く",
      "帰宅する",
      "〜するのを楽しむ，楽しんで〜する"
    ],
    "distractorsEn": [
      "go doing",
      "get home",
      "enjoy doing"
    ],
    "sentenceEn": [
      "He",
      "usually",
      "walks",
      "to",
      "school",
      "on",
      "sunny",
      "days."
    ],
    "sentenceJa": "彼は晴れた日にはたいてい学校まで歩いて行きます。",
    "sentenceDistractors": [
      "go",
      "get"
    ]
  },
  {
    "num": "0639",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "ask ~ for help",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "〜に助けを求める",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "〜に着く",
      "〜するのを楽しむ，楽しんで〜する",
      "〜に話しかける，〜と話す"
    ],
    "distractorsEn": [
      "arrive at ~",
      "enjoy doing",
      "speak to ~"
    ],
    "sentenceEn": [
      "We",
      "asked",
      "our",
      "teacher",
      "for",
      "help."
    ],
    "sentenceJa": "私たちは先生に助けを求めました。",
    "sentenceDistractors": [
      "arrive",
      "enjoy"
    ]
  },
  {
    "num": "0640",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "help A with B",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "AのBを手伝う，AをB(のこと)で助ける",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "家にいる",
      "旅行をする",
      "〜するのが好きだ，〜したい"
    ],
    "distractorsEn": [
      "stay (at) home",
      "take a trip",
      "like doing [to do]"
    ],
    "sentenceEn": [
      "He",
      "sometimes",
      "helps",
      "me",
      "with",
      "my",
      "homework."
    ],
    "sentenceJa": "彼はときどき私の宿題を手伝ってくれます。",
    "sentenceDistractors": [
      "stay",
      "take"
    ]
  },
  {
    "num": "0641",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "ask for ~",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "〜を求める",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "〜したいと思う",
      "(人の)所に泊まる，(人の)所に滞在する",
      "家にいる"
    ],
    "distractorsEn": [
      "want to do",
      "stay with ~",
      "stay (at) home"
    ],
    "sentenceEn": [
      "She",
      "asked",
      "for",
      "help."
    ],
    "sentenceJa": "彼女は助けを求めました。",
    "sentenceDistractors": [
      "want",
      "stay"
    ]
  },
  {
    "num": "0642",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "have a cold",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "風邪をひいている",
    "tip": "カテゴリ: 動詞の働きをする熟語 / 類義/関連: 同意語:catch a cold(風邪をひく)",
    "distractorsJa": [
      "〜まで歩いて行く",
      "目が覚める",
      "〜に着く，〜に到着する"
    ],
    "distractorsEn": [
      "walk to ~",
      "wake up",
      "get to ~"
    ],
    "sentenceEn": [
      "He",
      "has",
      "a",
      "cold."
    ],
    "sentenceJa": "彼は風邪をひいています。",
    "sentenceDistractors": [
      "walk",
      "wake"
    ]
  },
  {
    "num": "0643",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "take a bath",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "入浴する",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "帰宅する",
      "帰宅する",
      "〜し始める"
    ],
    "distractorsEn": [
      "come home",
      "get home",
      "start doing [to do]"
    ],
    "sentenceEn": [
      "He",
      "took",
      "a",
      "long",
      "bath."
    ],
    "sentenceJa": "彼はゆっくりと[長い時間]入浴しました。",
    "sentenceDistractors": [
      "come",
      "get"
    ]
  },
  {
    "num": "0644",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "take a shower",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "シャワーを浴びる",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "風邪をひいている",
      "〜になりたいと思う",
      "起きる，立ち上がる"
    ],
    "distractorsEn": [
      "have a cold",
      "want to be ~",
      "get up"
    ],
    "sentenceEn": [
      "I",
      "usually",
      "take",
      "a",
      "shower",
      "in",
      "the",
      "morning."
    ],
    "sentenceJa": "私はたいてい朝にシャワーを浴びます。",
    "sentenceDistractors": [
      "have",
      "want"
    ]
  },
  {
    "num": "0645",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "take a walk",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "散歩をする",
    "tip": "カテゴリ: 動詞の働きをする熟語 / 類義/関連: 同意語:go for a walk(散歩に行く)",
    "distractorsJa": [
      "戻る，帰る",
      "〜したいと思う",
      "シャワーを浴びる"
    ],
    "distractorsEn": [
      "get back",
      "want to do",
      "take a shower"
    ],
    "sentenceEn": [
      "Let's",
      "take",
      "a",
      "walk",
      "in",
      "the",
      "park."
    ],
    "sentenceJa": "公園を散歩しましょう。",
    "sentenceDistractors": [
      "get",
      "want"
    ]
  },
  {
    "num": "0646",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "go out",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "外出する",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "帰宅する",
      "旅行をする",
      "家にいる"
    ],
    "distractorsEn": [
      "get home",
      "take a trip",
      "stay (at) home"
    ],
    "sentenceEn": [
      "Let's",
      "go",
      "out",
      "for",
      "dinner."
    ],
    "sentenceJa": "夕食をとりに外出しましょう。",
    "sentenceDistractors": [
      "get",
      "take"
    ]
  },
  {
    "num": "0647",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "say goodbye to ~",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "〜に別れのあいさつを言う",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "起きる，立ち上がる",
      "〜を求める",
      "写真をとる"
    ],
    "distractorsEn": [
      "get up",
      "ask for ~",
      "take a picture"
    ],
    "sentenceEn": [
      "I",
      "don't",
      "want",
      "to",
      "say",
      "goodbye",
      "to",
      "my",
      "friends."
    ],
    "sentenceJa": "私は友だちに別れを言いたくありません。",
    "sentenceDistractors": [
      "get",
      "ask"
    ]
  },
  {
    "num": "0648",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "stay (at) home",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "家にいる",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "外出する",
      "〜するのが好きだ，〜したい",
      "風邪をひいている"
    ],
    "distractorsEn": [
      "go out",
      "like doing [to do]",
      "have a cold"
    ],
    "sentenceEn": [
      "I",
      "like",
      "to",
      "stay",
      "home."
    ],
    "sentenceJa": "私は家にいるのが好きです。",
    "sentenceDistractors": [
      "go",
      "like"
    ]
  },
  {
    "num": "0649",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "think of ~",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "〜のことを考える，〜を思い出す",
    "tip": "カテゴリ: 動詞の働きをする熟語 / 類義/関連: 同意語:think about ~(〜のことを考える)",
    "distractorsJa": [
      "〜を探す",
      "〜まで歩いて行く",
      "入浴する"
    ],
    "distractorsEn": [
      "look for ~",
      "walk to ~",
      "take a bath"
    ],
    "sentenceEn": [
      "What",
      "do",
      "you",
      "think",
      "of",
      "this",
      "picture?"
    ],
    "sentenceJa": "あなたはこのようにこの絵のことを考えていますか。",
    "sentenceDistractors": [
      "look",
      "walk"
    ]
  },
  {
    "num": "0650",
    "level": 11,
    "stageSlug": "eiken4_stage11",
    "english": "become friends with ~",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "〜と友だちになる",
    "tip": "カテゴリ: 動詞の働きをする熟語 / 類義/関連: 同意語:make friends with ~(〜と友だちになる)",
    "distractorsJa": [
      "帰宅する",
      "AのBを手伝う，AをB(のこと)で助ける",
      "旅行をする"
    ],
    "distractorsEn": [
      "get home",
      "help A with B",
      "take a trip"
    ],
    "sentenceEn": [
      "He",
      "became",
      "friends",
      "with",
      "the",
      "boy."
    ],
    "sentenceJa": "彼はその少年と友だちになりました。",
    "sentenceDistractors": [
      "get",
      "help"
    ]
  },
  {
    "num": "0651",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "catch a cold",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "風邪をひく",
    "tip": "カテゴリ: 動詞の働きをする熟語 / 類義/関連: 同意語:have a cold(風邪をひいている)",
    "distractorsJa": [
      "〜の存在を信じる，〜を信用する",
      "(Bから)Aに引っ越す",
      "〜のまわりを回る"
    ],
    "distractorsEn": [
      "believe in ~",
      "move to A (from B)",
      "go around [round] ~"
    ],
    "sentenceEn": [
      "I",
      "caught",
      "a",
      "cold",
      "last",
      "week."
    ],
    "sentenceJa": "私は先週風邪をひきました。",
    "sentenceDistractors": [
      "believe",
      "move"
    ]
  },
  {
    "num": "0652",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "get off ~",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "〜から降りる",
    "tip": "カテゴリ: 動詞の働きをする熟語 / 類義/関連: 反意語:get on ~(〜に乗る)",
    "distractorsJa": [
      "気分がよくなる",
      "(Bから)Aに引っ越す",
      "まったくわからない"
    ],
    "distractorsEn": [
      "feel better",
      "move to A (from B)",
      "have no idea"
    ],
    "sentenceEn": [
      "Where",
      "should",
      "I",
      "get",
      "off",
      "the",
      "bus?"
    ],
    "sentenceJa": "どこでバスを降りればいいですか。",
    "sentenceDistractors": [
      "feel",
      "move"
    ]
  },
  {
    "num": "0653",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "give up",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "あきらめる，やめる",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "あたりを見回す",
      "〜に似ている，〜のように見える",
      "〜に手紙を書く"
    ],
    "distractorsEn": [
      "look around",
      "look like ~",
      "write to ~"
    ],
    "sentenceEn": [
      "Don't",
      "give",
      "up.",
      "Try",
      "again!"
    ],
    "sentenceJa": "あきらめないで。もう一度やってみなさい！",
    "sentenceDistractors": [
      "look",
      "look"
    ]
  },
  {
    "num": "0654",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "have no idea",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "まったくわからない",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "あたりを見回す",
      "キャッチボールをする",
      "〜のまわりを回る"
    ],
    "distractorsEn": [
      "look around",
      "play catch",
      "go around [round] ~"
    ],
    "sentenceEn": [
      "I",
      "have",
      "no",
      "idea",
      "on",
      "this",
      "problem."
    ],
    "sentenceJa": "私はこの問題についてまったくわかりません。",
    "sentenceDistractors": [
      "look",
      "play"
    ]
  },
  {
    "num": "0655",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "go around [round] ~",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "〜のまわりを回る",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "まったくわからない",
      "あきらめる，やめる",
      "風邪をひく"
    ],
    "distractorsEn": [
      "have no idea",
      "give up",
      "catch a cold"
    ],
    "sentenceEn": [
      "The",
      "moon",
      "goes",
      "around",
      "the",
      "earth."
    ],
    "sentenceJa": "月は地球のまわりを回っています。",
    "sentenceDistractors": [
      "have",
      "give"
    ]
  },
  {
    "num": "0656",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "look around",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "あたりを見回す",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "〜から降りる",
      "キャッチボールをする",
      "あきらめる，やめる"
    ],
    "distractorsEn": [
      "get off ~",
      "play catch",
      "give up"
    ],
    "sentenceEn": [
      "He",
      "stood",
      "up",
      "and",
      "looked",
      "around."
    ],
    "sentenceJa": "彼は立ち上がってあたりを見回しました。",
    "sentenceDistractors": [
      "get",
      "play"
    ]
  },
  {
    "num": "0657",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "move to A (from B)",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "(Bから)Aに引っ越す",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "返事を書く",
      "〜に手紙を書く",
      "あたりを見回す"
    ],
    "distractorsEn": [
      "write back",
      "write to ~",
      "look around"
    ],
    "sentenceEn": [
      "He",
      "moved",
      "to",
      "Tokyo",
      "from",
      "New",
      "York",
      "two",
      "years",
      "ago."
    ],
    "sentenceJa": "彼は2年前にニューヨークから東京に引っ越しました。",
    "sentenceDistractors": [
      "write",
      "write"
    ]
  },
  {
    "num": "0658",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "write to ~",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "〜に手紙を書く",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "〜から降りる",
      "(Bから)Aに引っ越す",
      "〜の存在を信じる，〜を信用する"
    ],
    "distractorsEn": [
      "get off ~",
      "move to A (from B)",
      "believe in ~"
    ],
    "sentenceEn": [
      "I'll",
      "write",
      "to",
      "you",
      "from",
      "Canada."
    ],
    "sentenceJa": "私はカナダからあなたに手紙を書きます。",
    "sentenceDistractors": [
      "get",
      "move"
    ]
  },
  {
    "num": "0659",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "write back",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "返事を書く",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "〜のことを心配する",
      "〜のまわりを回る",
      "〜から降りる"
    ],
    "distractorsEn": [
      "worry about ~",
      "go around [round] ~",
      "get off ~"
    ],
    "sentenceEn": [
      "He",
      "wrote",
      "back",
      "to",
      "his",
      "friend",
      "in",
      "London."
    ],
    "sentenceJa": "彼はロンドンの友だちに返事を書きました。",
    "sentenceDistractors": [
      "worry",
      "go"
    ]
  },
  {
    "num": "0660",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "slow down",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "速度を落とす，遅くする",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "〜の存在を信じる，〜を信用する",
      "風邪をひく",
      "あたりを見回す"
    ],
    "distractorsEn": [
      "believe in ~",
      "catch a cold",
      "look around"
    ],
    "sentenceEn": [
      "You",
      "are",
      "speaking",
      "too",
      "fast.",
      "Please",
      "slow",
      "down."
    ],
    "sentenceJa": "あなたは速く話しすぎています。速度を落としてください。",
    "sentenceDistractors": [
      "believe",
      "catch"
    ]
  },
  {
    "num": "0661",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "worry about ~",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "〜のことを心配する",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "返事を書く",
      "〜から降りる",
      "風邪をひく"
    ],
    "distractorsEn": [
      "write back",
      "get off ~",
      "catch a cold"
    ],
    "sentenceEn": [
      "Don't",
      "worry",
      "about",
      "the",
      "test."
    ],
    "sentenceJa": "テストのことは心配しないで。",
    "sentenceDistractors": [
      "write",
      "get"
    ]
  },
  {
    "num": "0662",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "look like ~",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "〜に似ている，〜のように見える",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "速度を落とす，遅くする",
      "あたりを見回す",
      "〜の存在を信じる，〜を信用する"
    ],
    "distractorsEn": [
      "slow down",
      "look around",
      "believe in ~"
    ],
    "sentenceEn": [
      "He",
      "really",
      "looks",
      "like",
      "his",
      "brother."
    ],
    "sentenceJa": "彼はお兄さん［弟さん］によく似ています。",
    "sentenceDistractors": [
      "slow",
      "look"
    ]
  },
  {
    "num": "0663",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "believe in ~",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "〜の存在を信じる，〜を信用する",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "〜のまわりを回る",
      "〜のことを心配する",
      "速度を落とす，遅くする"
    ],
    "distractorsEn": [
      "go around [round] ~",
      "worry about ~",
      "slow down"
    ],
    "sentenceEn": [
      "Do",
      "you",
      "believe",
      "in",
      "Santa",
      "Claus?"
    ],
    "sentenceJa": "あなたはサンタクロースの存在を信じますか。",
    "sentenceDistractors": [
      "go",
      "worry"
    ]
  },
  {
    "num": "0664",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "play catch",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "キャッチボールをする",
    "tip": "カテゴリ: 動詞の働きをする熟語 / 類義/関連: 参考表現:play cards(トランプをする)",
    "distractorsJa": [
      "〜のまわりを回る",
      "あきらめる，やめる",
      "気分がよくなる"
    ],
    "distractorsEn": [
      "go around [round] ~",
      "give up",
      "feel better"
    ],
    "sentenceEn": [
      "Come",
      "on,",
      "Dad.",
      "Let's",
      "play",
      "catch!"
    ],
    "sentenceJa": "さあ，お父さん。キャッチボールをしようよ！",
    "sentenceDistractors": [
      "go",
      "give"
    ]
  },
  {
    "num": "0665",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "feel better",
    "phonetic": "",
    "partOfSpeech": "動詞",
    "japanese": "気分がよくなる",
    "tip": "カテゴリ: 動詞の働きをする熟語",
    "distractorsJa": [
      "風邪をひく",
      "〜の存在を信じる，〜を信用する",
      "あきらめる，やめる"
    ],
    "distractorsEn": [
      "catch a cold",
      "believe in ~",
      "give up"
    ],
    "sentenceEn": [
      "You",
      "will",
      "feel",
      "better",
      "soon."
    ],
    "sentenceJa": "あなたはすぐに気分がよくなるでしょう。",
    "sentenceDistractors": [
      "catch",
      "believe"
    ]
  },
  {
    "num": "0666",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "a lot of ~",
    "phonetic": "",
    "partOfSpeech": "形容詞",
    "japanese": "たくさんの〜",
    "tip": "カテゴリ: 形容詞の働きをする熟語 / 類義/関連: 同意語:lots of ~(たくさんの〜)",
    "distractorsJa": [
      "気をつける",
      "〜に遅れる，遅刻する",
      "種類の〜"
    ],
    "distractorsEn": [
      "be careful",
      "be late for ~",
      "kind of ~"
    ],
    "sentenceEn": [
      "He",
      "has",
      "a",
      "lot",
      "of",
      "English",
      "books."
    ],
    "sentenceJa": "彼はたくさんの英語の本を持っています。",
    "sentenceDistractors": [
      "be",
      "be"
    ]
  },
  {
    "num": "0667",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "be late for ~",
    "phonetic": "",
    "partOfSpeech": "形容詞",
    "japanese": "〜に遅れる，遅刻する",
    "tip": "カテゴリ: 形容詞の働きをする熟語",
    "distractorsJa": [
      "カップ1杯の〜",
      "たくさんの〜",
      "コップ1杯の〜"
    ],
    "distractorsEn": [
      "a cup of ~",
      "a lot of ~",
      "a glass of ~"
    ],
    "sentenceEn": [
      "Don't",
      "be",
      "late",
      "for",
      "school",
      "again!"
    ],
    "sentenceJa": "二度と学校に遅れないように！",
    "sentenceDistractors": [
      "a",
      "a"
    ]
  },
  {
    "num": "0668",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "be careful",
    "phonetic": "",
    "partOfSpeech": "形容詞",
    "japanese": "気をつける",
    "tip": "カテゴリ: 形容詞の働きをする熟語",
    "distractorsJa": [
      "カップ1杯の〜",
      "種類の〜",
      "〜に遅れる，遅刻する"
    ],
    "distractorsEn": [
      "a cup of ~",
      "kind of ~",
      "be late for ~"
    ],
    "sentenceEn": [
      "Be",
      "careful",
      "when",
      "you",
      "drive."
    ],
    "sentenceJa": "車を運転するときは気をつけて。",
    "sentenceDistractors": [
      "a",
      "kind"
    ]
  },
  {
    "num": "0669",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "be interested in ~",
    "phonetic": "",
    "partOfSpeech": "形容詞",
    "japanese": "〜に興味を持っている",
    "tip": "カテゴリ: 形容詞の働きをする熟語",
    "distractorsJa": [
      "たくさんの〜",
      "カップ1杯の〜",
      "〜に遅れる，遅刻する"
    ],
    "distractorsEn": [
      "a lot of ~",
      "a cup of ~",
      "be late for ~"
    ],
    "sentenceEn": [
      "Are",
      "you",
      "interested",
      "in",
      "movies?"
    ],
    "sentenceJa": "あなたは映画に興味がありますか。",
    "sentenceDistractors": [
      "a",
      "a"
    ]
  },
  {
    "num": "0670",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "kind of ~",
    "phonetic": "",
    "partOfSpeech": "形容詞",
    "japanese": "種類の〜",
    "tip": "カテゴリ: 形容詞の働きをする熟語",
    "distractorsJa": [
      "気をつける",
      "〜に遅れる，遅刻する",
      "カップ1杯の〜"
    ],
    "distractorsEn": [
      "be careful",
      "be late for ~",
      "a cup of ~"
    ],
    "sentenceEn": [
      "What",
      "kind",
      "of",
      "food",
      "do",
      "you",
      "like?"
    ],
    "sentenceJa": "どんな種類の食べ物が好きですか。",
    "sentenceDistractors": [
      "be",
      "be"
    ]
  },
  {
    "num": "0671",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "a glass of ~",
    "phonetic": "",
    "partOfSpeech": "形容詞",
    "japanese": "コップ1杯の〜",
    "tip": "カテゴリ: 形容詞の働きをする熟語",
    "distractorsJa": [
      "〜に遅れる，遅刻する",
      "気をつける",
      "カップ1杯の〜"
    ],
    "distractorsEn": [
      "be late for ~",
      "be careful",
      "a cup of ~"
    ],
    "sentenceEn": [
      "She",
      "drinks",
      "a",
      "glass",
      "of",
      "milk",
      "every",
      "morning."
    ],
    "sentenceJa": "彼女は毎朝コップ1杯の牛乳を飲みます。",
    "sentenceDistractors": [
      "be",
      "be"
    ]
  },
  {
    "num": "0672",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "a cup of ~",
    "phonetic": "",
    "partOfSpeech": "形容詞",
    "japanese": "カップ1杯の〜",
    "tip": "カテゴリ: 形容詞の働きをする熟語",
    "distractorsJa": [
      "〜に興味を持っている",
      "気をつける",
      "たくさんの〜"
    ],
    "distractorsEn": [
      "be interested in ~",
      "be careful",
      "a lot of ~"
    ],
    "sentenceEn": [
      "I",
      "want",
      "to",
      "drink",
      "a",
      "cup",
      "of",
      "tea."
    ],
    "sentenceJa": "私はカップ1杯の紅茶を飲みたいです。",
    "sentenceDistractors": [
      "be",
      "be"
    ]
  },
  {
    "num": "0673",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "in the morning",
    "phonetic": "",
    "partOfSpeech": "副詞",
    "japanese": "午前中に，朝に",
    "tip": "カテゴリ: 副詞の働きをする熟語 / 類義/関連: 参考表現:in the evening(夕方に)",
    "distractorsJa": [
      "〜から外へ",
      "今すぐに，現在，たった今",
      "AとBの両方とも"
    ],
    "distractorsEn": [
      "out of ~",
      "right now",
      "both A and B"
    ],
    "sentenceEn": [
      "We",
      "have",
      "a",
      "math",
      "class",
      "in",
      "the",
      "morning."
    ],
    "sentenceJa": "私たちは午前中に数学の授業があります。",
    "sentenceDistractors": [
      "out",
      "right"
    ]
  },
  {
    "num": "0674",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "in the afternoon",
    "phonetic": "",
    "partOfSpeech": "副詞",
    "japanese": "午後に",
    "tip": "カテゴリ: 副詞の働きをする熟語",
    "distractorsJa": [
      "1日中",
      "将来",
      "〜のとなりに"
    ],
    "distractorsEn": [
      "all day (long)",
      "in the future",
      "next to ~"
    ],
    "sentenceEn": [
      "They",
      "studied",
      "for",
      "the",
      "exam",
      "in",
      "the",
      "afternoon."
    ],
    "sentenceJa": "彼らは午後に試験のための勉強をしました。",
    "sentenceDistractors": [
      "all",
      "in"
    ]
  },
  {
    "num": "0675",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "in the future",
    "phonetic": "",
    "partOfSpeech": "副詞",
    "japanese": "将来",
    "tip": "カテゴリ: 副詞の働きをする熟語 / 類義/関連: 同意語:someday((未来の)いつか)",
    "distractorsJa": [
      "第1日目に，初日に",
      "…と同じくらい〜",
      "たくさん，ずいぶん"
    ],
    "distractorsEn": [
      "(on) the first day",
      "as ~ as ...",
      "a lot"
    ],
    "sentenceEn": [
      "I",
      "want",
      "to",
      "be",
      "a",
      "teacher",
      "in",
      "the",
      "future."
    ],
    "sentenceJa": "私は将来教師になりたいです。",
    "sentenceDistractors": [
      "(on)",
      "as"
    ]
  },
  {
    "num": "0676",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "how long",
    "phonetic": "",
    "partOfSpeech": "副詞",
    "japanese": "どれくらいの長さ",
    "tip": "カテゴリ: 副詞の働きをする熟語 / 類義/関連: 参考表現:how tall(どれくらいの高さ), 参考表現:how far(どれくらいの距離)",
    "distractorsJa": [
      "長い間",
      "先週",
      "(過去の)ある日，(未来の)いつか"
    ],
    "distractorsEn": [
      "for a long time",
      "last week",
      "one day"
    ],
    "sentenceEn": [
      "How",
      "long",
      "are",
      "you",
      "going",
      "to",
      "stay",
      "in",
      "the",
      "city?"
    ],
    "sentenceJa": "あなたはその街にどれくらい滞在する予定ですか。",
    "sentenceDistractors": [
      "for",
      "last"
    ]
  },
  {
    "num": "0677",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "all day (long)",
    "phonetic": "",
    "partOfSpeech": "副詞",
    "japanese": "1日中",
    "tip": "カテゴリ: 副詞の働きをする熟語 / 類義/関連: 参考表現:all year (round)(1年中，1年を通して)",
    "distractorsJa": [
      "歩いて，徒歩で",
      "ところで",
      "たくさん，ずいぶん"
    ],
    "distractorsEn": [
      "on foot",
      "by the way",
      "a lot"
    ],
    "sentenceEn": [
      "She",
      "was",
      "cleaning",
      "the",
      "house",
      "all",
      "day",
      "long."
    ],
    "sentenceJa": "彼女は1日中家をそうじしていました。",
    "sentenceDistractors": [
      "on",
      "by"
    ]
  },
  {
    "num": "0678",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "for a long time",
    "phonetic": "",
    "partOfSpeech": "副詞",
    "japanese": "長い間",
    "tip": "カテゴリ: 副詞の働きをする熟語",
    "distractorsJa": [
      "将来",
      "無料で，ただで",
      "どれくらいの長さ"
    ],
    "distractorsEn": [
      "in the future",
      "for free",
      "how long"
    ],
    "sentenceEn": [
      "I",
      "waited",
      "for",
      "her",
      "for",
      "a",
      "long",
      "time."
    ],
    "sentenceJa": "私は長い間彼女を待ちました。",
    "sentenceDistractors": [
      "in",
      "for"
    ]
  },
  {
    "num": "0679",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "last week",
    "phonetic": "",
    "partOfSpeech": "副詞",
    "japanese": "先週",
    "tip": "カテゴリ: 副詞の働きをする熟語",
    "distractorsJa": [
      "(過去の)ある日，(未来の)いつか",
      "AとBの両方とも",
      "…と同じくらい〜"
    ],
    "distractorsEn": [
      "one day",
      "both A and B",
      "as ~ as ..."
    ],
    "sentenceEn": [
      "I",
      "visited",
      "my",
      "grandparents",
      "last",
      "week."
    ],
    "sentenceJa": "私は先週祖父母を訪ねました。",
    "sentenceDistractors": [
      "one",
      "both"
    ]
  },
  {
    "num": "0680",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "after work",
    "phonetic": "",
    "partOfSpeech": "副詞",
    "japanese": "仕事の後で",
    "tip": "カテゴリ: 副詞の働きをする熟語 / 類義/関連: 参考表現:after school(放課後に)",
    "distractorsJa": [
      "〜のとなりに",
      "(過去の)ある日，(未来の)いつか",
      "角を曲がった所に"
    ],
    "distractorsEn": [
      "next to ~",
      "one day",
      "(just) around the corner"
    ],
    "sentenceEn": [
      "She",
      "will",
      "get",
      "a",
      "present",
      "for",
      "him",
      "after",
      "work."
    ],
    "sentenceJa": "彼女は仕事の後で彼へのプレゼントを手に入れるつもりです。",
    "sentenceDistractors": [
      "next",
      "one"
    ]
  },
  {
    "num": "0681",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "for example",
    "phonetic": "",
    "partOfSpeech": "副詞",
    "japanese": "たとえば",
    "tip": "カテゴリ: 副詞の働きをする熟語",
    "distractorsJa": [
      "AとBの両方とも",
      "今すぐに，現在，たった今",
      "1日中"
    ],
    "distractorsEn": [
      "both A and B",
      "right now",
      "all day (long)"
    ],
    "sentenceEn": [
      "I",
      "like",
      "Italian",
      "food.",
      "For",
      "example,",
      "spaghetti."
    ],
    "sentenceJa": "私はイタリア料理が好きです。たとえば，スパゲッティが好きです。",
    "sentenceDistractors": [
      "both",
      "right"
    ]
  },
  {
    "num": "0682",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "as ~ as ...",
    "phonetic": "",
    "partOfSpeech": "副詞",
    "japanese": "…と同じくらい〜",
    "tip": "カテゴリ: 副詞の働きをする熟語 / 類義/関連: 参考表現:as tall as ~(〜と同じくらい背が高い(形容詞の働き))",
    "distractorsJa": [
      "世界中で",
      "午前中に，朝に",
      "ますます多くの"
    ],
    "distractorsEn": [
      "all over the world",
      "in the morning",
      "more and more"
    ],
    "sentenceEn": [
      "She",
      "got",
      "to",
      "school",
      "as",
      "early",
      "as",
      "her",
      "teacher."
    ],
    "sentenceJa": "彼女は先生と同じくらい早く学校に着きました。",
    "sentenceDistractors": [
      "all",
      "in"
    ]
  },
  {
    "num": "0683",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "a lot",
    "phonetic": "",
    "partOfSpeech": "副詞",
    "japanese": "たくさん，ずいぶん",
    "tip": "カテゴリ: 副詞の働きをする熟語 / 類義/関連: 参考表現:a lot of ~(たくさんの〜)",
    "distractorsJa": [
      "角を曲がった所に",
      "〜の前に［で］",
      "仕事の後で"
    ],
    "distractorsEn": [
      "(just) around the corner",
      "in front of ~",
      "after work"
    ],
    "sentenceEn": [
      "It",
      "rained",
      "a",
      "lot",
      "yesterday."
    ],
    "sentenceJa": "昨日はたくさん雨が降りました。",
    "sentenceDistractors": [
      "(just)",
      "in"
    ]
  },
  {
    "num": "0684",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "from A to B",
    "phonetic": "",
    "partOfSpeech": "副詞",
    "japanese": "AからBまで，AからBへ",
    "tip": "カテゴリ: 副詞の働きをする熟語",
    "distractorsJa": [
      "午前中に，朝に",
      "午後に",
      "世界中で"
    ],
    "distractorsEn": [
      "in the morning",
      "in the afternoon",
      "all over the world"
    ],
    "sentenceEn": [
      "It",
      "takes",
      "about",
      "two",
      "hours",
      "from",
      "here",
      "to",
      "the",
      "city."
    ],
    "sentenceJa": "ここからその街まで2時間ほどかかります。",
    "sentenceDistractors": [
      "in",
      "in"
    ]
  },
  {
    "num": "0685",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "~ years old",
    "phonetic": "",
    "partOfSpeech": "副詞",
    "japanese": "〜歳",
    "tip": "カテゴリ: 副詞の働きをする熟語",
    "distractorsJa": [
      "午前中に，朝に",
      "…と同じくらい〜",
      "どれくらいの長さ"
    ],
    "distractorsEn": [
      "in the morning",
      "as ~ as ...",
      "how long"
    ],
    "sentenceEn": [
      "He",
      "will",
      "be",
      "20",
      "years",
      "old",
      "next",
      "month."
    ],
    "sentenceJa": "彼は来月20歳になります。",
    "sentenceDistractors": [
      "in",
      "as"
    ]
  },
  {
    "num": "0686",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "in front of ~",
    "phonetic": "",
    "partOfSpeech": "副詞",
    "japanese": "〜の前に［で］",
    "tip": "カテゴリ: 副詞の働きをする熟語 / 類義/関連: 反意語:behind ~(〜の後ろに)",
    "distractorsJa": [
      "将来",
      "仕事の後で",
      "AとBの両方とも"
    ],
    "distractorsEn": [
      "in the future",
      "after work",
      "both A and B"
    ],
    "sentenceEn": [
      "I'll",
      "see",
      "you",
      "in",
      "front",
      "of",
      "the",
      "bookstore."
    ],
    "sentenceJa": "その書店の前で会いましょう。",
    "sentenceDistractors": [
      "in",
      "after"
    ]
  },
  {
    "num": "0687",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "next to ~",
    "phonetic": "",
    "partOfSpeech": "副詞",
    "japanese": "〜のとなりに",
    "tip": "カテゴリ: 副詞の働きをする熟語",
    "distractorsJa": [
      "先週",
      "たくさん，ずいぶん",
      "将来"
    ],
    "distractorsEn": [
      "last week",
      "a lot",
      "in the future"
    ],
    "sentenceEn": [
      "The",
      "family",
      "lives",
      "next",
      "to",
      "our",
      "school."
    ],
    "sentenceJa": "その家族は私たちの学校のとなりに住んでいます。",
    "sentenceDistractors": [
      "last",
      "a"
    ]
  },
  {
    "num": "0688",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "out of ~",
    "phonetic": "",
    "partOfSpeech": "副詞",
    "japanese": "〜から外へ",
    "tip": "カテゴリ: 副詞の働きをする熟語 / 類義/関連: 反意語:into ~(〜の中へ)",
    "distractorsJa": [
      "〜歳",
      "仕事の後で",
      "将来"
    ],
    "distractorsEn": [
      "~ years old",
      "after work",
      "in the future"
    ],
    "sentenceEn": [
      "He",
      "went",
      "out",
      "of",
      "the",
      "room."
    ],
    "sentenceJa": "彼は部屋から外へ出ていきました。",
    "sentenceDistractors": [
      "~",
      "after"
    ]
  },
  {
    "num": "0689",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "both A and B",
    "phonetic": "",
    "partOfSpeech": "副詞",
    "japanese": "AとBの両方とも",
    "tip": "カテゴリ: 副詞の働きをする熟語",
    "distractorsJa": [
      "どれくらいの長さ",
      "午前中に，朝に",
      "1日中"
    ],
    "distractorsEn": [
      "how long",
      "in the morning",
      "all day (long)"
    ],
    "sentenceEn": [
      "She",
      "speaks",
      "both",
      "French",
      "and",
      "English."
    ],
    "sentenceJa": "彼女はフランス語と英語の両方を話します。",
    "sentenceDistractors": [
      "how",
      "in"
    ]
  },
  {
    "num": "0690",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "one day",
    "phonetic": "",
    "partOfSpeech": "副詞",
    "japanese": "(過去の)ある日，(未来の)いつか",
    "tip": "カテゴリ: 副詞の働きをする熟語 / 類義/関連: 参考表現:someday((未来の)いつか), 参考表現:sometime((過去・未来の)いつか)",
    "distractorsJa": [
      "〜から外へ",
      "第1日目に，初日に",
      "AとBの両方とも"
    ],
    "distractorsEn": [
      "out of ~",
      "(on) the first day",
      "both A and B"
    ],
    "sentenceEn": [
      "One",
      "day,",
      "he",
      "went",
      "to",
      "the",
      "park."
    ],
    "sentenceJa": "ある日，彼はその公園に行きました。",
    "sentenceDistractors": [
      "out",
      "(on)"
    ]
  },
  {
    "num": "0691",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "(on) the first day",
    "phonetic": "",
    "partOfSpeech": "副詞",
    "japanese": "第1日目に，初日に",
    "tip": "カテゴリ: 副詞の働きをする熟語",
    "distractorsJa": [
      "ところで",
      "今すぐに，現在，たった今",
      "〜から外へ"
    ],
    "distractorsEn": [
      "by the way",
      "right now",
      "out of ~"
    ],
    "sentenceEn": [
      "On",
      "the",
      "first",
      "day",
      "in",
      "Paris,",
      "we",
      "went",
      "to",
      "the",
      "museum."
    ],
    "sentenceJa": "パリに着いた第1日目に，私たちはその美術館に行きました。",
    "sentenceDistractors": [
      "by",
      "right"
    ]
  },
  {
    "num": "0692",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "on vacation",
    "phonetic": "",
    "partOfSpeech": "副詞",
    "japanese": "休暇で",
    "tip": "カテゴリ: 副詞の働きをする熟語",
    "distractorsJa": [
      "どれくらいの長さ",
      "〜の前に［で］",
      "〜から外へ"
    ],
    "distractorsEn": [
      "how long",
      "in front of ~",
      "out of ~"
    ],
    "sentenceEn": [
      "They",
      "stayed",
      "at",
      "a",
      "nice",
      "hotel",
      "on",
      "vacation."
    ],
    "sentenceJa": "彼らは休暇ですてきなホテルに滞在しました。",
    "sentenceDistractors": [
      "how",
      "in"
    ]
  },
  {
    "num": "0693",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "on foot",
    "phonetic": "",
    "partOfSpeech": "副詞",
    "japanese": "歩いて，徒歩で",
    "tip": "カテゴリ: 副詞の働きをする熟語 / 類義/関連: 参考表現:by bike(自転車で)",
    "distractorsJa": [
      "たくさん，ずいぶん",
      "世界中で",
      "第1日目に，初日に"
    ],
    "distractorsEn": [
      "a lot",
      "all over the world",
      "(on) the first day"
    ],
    "sentenceEn": [
      "We",
      "went",
      "to",
      "the",
      "park",
      "on",
      "foot."
    ],
    "sentenceJa": "私たちは歩いてその公園へ行きました。",
    "sentenceDistractors": [
      "a",
      "all"
    ]
  },
  {
    "num": "0694",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "(just) around the corner",
    "phonetic": "",
    "partOfSpeech": "副詞",
    "japanese": "角を曲がった所に",
    "tip": "カテゴリ: 副詞の働きをする熟語",
    "distractorsJa": [
      "第1日目に，初日に",
      "〜の前に［で］",
      "午後に"
    ],
    "distractorsEn": [
      "(on) the first day",
      "in front of ~",
      "in the afternoon"
    ],
    "sentenceEn": [
      "My",
      "house",
      "is",
      "just",
      "around",
      "the",
      "corner."
    ],
    "sentenceJa": "私の家は角を曲がった所です。",
    "sentenceDistractors": [
      "(on)",
      "in"
    ]
  },
  {
    "num": "0695",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "by the way",
    "phonetic": "",
    "partOfSpeech": "副詞",
    "japanese": "ところで",
    "tip": "カテゴリ: 副詞の働きをする熟語",
    "distractorsJa": [
      "休暇で",
      "長い間",
      "将来"
    ],
    "distractorsEn": [
      "on vacation",
      "for a long time",
      "in the future"
    ],
    "sentenceEn": [
      "By",
      "the",
      "way,",
      "did",
      "you",
      "read",
      "that",
      "book?"
    ],
    "sentenceJa": "ところで，あの本は読みましたか。",
    "sentenceDistractors": [
      "on",
      "for"
    ]
  },
  {
    "num": "0696",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "more and more",
    "phonetic": "",
    "partOfSpeech": "副詞",
    "japanese": "ますます多くの",
    "tip": "カテゴリ: 副詞の働きをする熟語",
    "distractorsJa": [
      "先週",
      "〜のとなりに",
      "午前中に，朝に"
    ],
    "distractorsEn": [
      "last week",
      "next to ~",
      "in the morning"
    ],
    "sentenceEn": [
      "More",
      "and",
      "more",
      "people",
      "use",
      "computers",
      "today."
    ],
    "sentenceJa": "今日，ますます多くの人々がコンピューターを使っています。",
    "sentenceDistractors": [
      "last",
      "next"
    ]
  },
  {
    "num": "0697",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "for free",
    "phonetic": "",
    "partOfSpeech": "副詞",
    "japanese": "無料で，ただで",
    "tip": "カテゴリ: 副詞の働きをする熟語",
    "distractorsJa": [
      "1日中",
      "第1日目に，初日に",
      "〜から外へ"
    ],
    "distractorsEn": [
      "all day (long)",
      "(on) the first day",
      "out of ~"
    ],
    "sentenceEn": [
      "If",
      "you",
      "buy",
      "one",
      "pizza,",
      "you'll",
      "get",
      "another",
      "for",
      "free."
    ],
    "sentenceJa": "もし1枚ピザを買ったら，もう1枚無料でもらえます。",
    "sentenceDistractors": [
      "all",
      "(on)"
    ]
  },
  {
    "num": "0698",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "right now",
    "phonetic": "",
    "partOfSpeech": "副詞",
    "japanese": "今すぐに，現在，たった今",
    "tip": "カテゴリ: 副詞の働きをする熟語",
    "distractorsJa": [
      "〜歳",
      "先週",
      "AとBの両方とも"
    ],
    "distractorsEn": [
      "~ years old",
      "last week",
      "both A and B"
    ],
    "sentenceEn": [
      "You",
      "don't",
      "need",
      "to",
      "go",
      "right",
      "now."
    ],
    "sentenceJa": "あなたは今すぐに行く必要はありません。",
    "sentenceDistractors": [
      "~",
      "last"
    ]
  },
  {
    "num": "0699",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "all over the world",
    "phonetic": "",
    "partOfSpeech": "副詞",
    "japanese": "世界中で",
    "tip": "カテゴリ: 副詞の働きをする熟語",
    "distractorsJa": [
      "午後に",
      "仕事の後で",
      "将来"
    ],
    "distractorsEn": [
      "in the afternoon",
      "after work",
      "in the future"
    ],
    "sentenceEn": [
      "He",
      "is",
      "famous",
      "all",
      "over",
      "the",
      "world."
    ],
    "sentenceJa": "彼は世界中で有名です。",
    "sentenceDistractors": [
      "in",
      "after"
    ]
  },
  {
    "num": "0700",
    "level": 12,
    "stageSlug": "eiken4_stage12",
    "english": "have to do",
    "phonetic": "",
    "partOfSpeech": "助動詞",
    "japanese": "〜しなければならない",
    "tip": "カテゴリ: 助動詞の働きをする熟語 / 類義/関連: 同意語:must(〜しなければならない)",
    "distractorsJa": [
      "コップ1杯の〜",
      "ますます多くの",
      "〜に似ている，〜のように見える"
    ],
    "distractorsEn": [
      "a glass of ~",
      "more and more",
      "look like ~"
    ],
    "sentenceEn": [
      "You",
      "have",
      "to",
      "finish",
      "your",
      "speech",
      "in",
      "three",
      "minutes."
    ],
    "sentenceJa": "あなたは3分間でスピーチを終えなければなりません。",
    "sentenceDistractors": [
      "a",
      "more"
    ]
  }
];

export const EIKEN4_WORDS: (WordItem & {
  level: number;
  num: string;
  stageSlug: string;
})[] = EIKEN4_ENTRIES.map((entry) => ({
  id: `eiken4_${entry.num}`,
  num: entry.num,
  level: entry.level,
  stageSlug: entry.stageSlug,
  english: entry.english,
  japanese: entry.japanese,
  phonetic: entry.phonetic,
  partOfSpeech: `#${entry.num} ${entry.partOfSpeech}`,
  grade: "英検4級",
  distractorsJa: entry.distractorsJa,
  distractorsEn: entry.distractorsEn,
  tip: entry.tip,
  exampleSentenceEn: entry.sentenceEn.join(" "),
  exampleSentenceJa: entry.sentenceJa,
}));

export const EIKEN4_SENTENCES: (SentenceItem & {
  level: number;
  num: string;
  stageSlug: string;
})[] = EIKEN4_ENTRIES.map((entry) => ({
  id: `s_eiken4_${entry.num}`,
  num: entry.num,
  level: entry.level,
  stageSlug: entry.stageSlug,
  englishTokens: entry.sentenceEn,
  distractorTokens: entry.sentenceDistractors,
  japanese: entry.sentenceJa,
  targetWordIds: [`eiken4_${entry.num}`],
  grade: "英検4級",
  grammarPoint: `【英検4級 #${entry.num} / Stage ${String(entry.level).padStart(2, "0")}】${entry.english} ＝ ${entry.japanese}`,
}));
