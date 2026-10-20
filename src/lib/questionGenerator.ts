import {
  GeneratedQuestion,
  GradeLevel,
  QuestionFormat,
  SentenceItem,
  WordItem,
  WordMasteryRecord,
} from "./types";
import { getActiveVocabPool } from "./vocabRepository";
import { EIKEN4_STAGES } from "./eiken4Data";
import { TARGET1800_STAGES } from "./target1800Data";

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const IRREGULAR_FORMS: Record<string, string[]> = {
  be: ["am", "is", "are", "was", "were", "been", "being", "be"],
  do: ["did", "done", "doing", "does"],
  override: ["overrode", "overridden", "overriding", "overrides"],
  undergo: ["underwent", "undergone", "undergoing", "undergoes"],
  undertake: ["undertook", "undertaken", "undertaking", "undertakes"],
  uphold: ["upheld", "upholding", "upholds"],
  withstand: ["withstood", "withstanding", "withstands"],
  overcome: ["overcame", "overcoming", "overcomes"],
  forgo: ["forwent", "forgone", "forgoing", "forgoes"],
  go: ["went", "gone", "going", "goes"],
  run: ["ran", "running", "runs"],
  come: ["came", "coming", "comes"],
  see: ["saw", "seen", "seeing", "sees"],
  take: ["took", "taken", "taking", "takes"],
  give: ["gave", "given", "giving", "gives"],
  eat: ["ate", "eaten", "eating", "eats"],
  write: ["wrote", "written", "writing", "writes"],
  speak: ["spoke", "spoken", "speaking", "speaks"],
  break: ["broke", "broken", "breaking", "breaks"],
  choose: ["chose", "chosen", "choosing", "chooses"],
  drive: ["drove", "driven", "driving", "drives"],
  fall: ["fell", "fallen", "falling", "falls"],
  fly: ["flew", "flown", "flying", "flies"],
  forget: ["forgot", "forgotten", "forgetting", "forgets"],
  get: ["got", "gotten", "getting", "gets"],
  grow: ["grew", "grown", "growing", "grows"],
  know: ["knew", "known", "knowing", "knows"],
  ride: ["rode", "ridden", "riding", "rides"],
  ring: ["rang", "rung", "ringing", "rings"],
  rise: ["rose", "risen", "rising", "rises"],
  sing: ["sang", "sung", "singing", "sings"],
  swim: ["swam", "swum", "swimming", "swims"],
  throw: ["threw", "thrown", "throwing", "throws"],
  wake: ["woke", "woken", "waking", "wakes"],
  wear: ["wore", "worn", "wearing", "wears"],
  begin: ["began", "begun", "beginning", "begins"],
  drink: ["drank", "drunk", "drinking", "drinks"],
  buy: ["bought", "buying", "buys"],
  bring: ["brought", "bringing", "brings"],
  think: ["thought", "thinking", "thinks"],
  catch: ["caught", "catching", "catches"],
  teach: ["taught", "teaching", "teaches"],
  build: ["built", "building", "builds"],
  feel: ["felt", "feeling", "feels"],
  find: ["found", "finding", "finds"],
  have: ["had", "having", "has"],
  hear: ["heard", "hearing", "hears"],
  hold: ["held", "holding", "holds"],
  keep: ["kept", "keeping", "keeps"],
  leave: ["left", "leaving", "leaves"],
  lend: ["lent", "lending", "lends"],
  lose: ["lost", "losing", "loses"],
  make: ["made", "making", "makes"],
  mean: ["meant", "meaning", "means"],
  meet: ["met", "meeting", "meets"],
  pay: ["paid", "paying", "pays"],
  say: ["said", "saying", "says"],
  sell: ["sold", "selling", "sells"],
  send: ["sent", "sending", "sends"],
  sit: ["sat", "sitting", "sits"],
  sleep: ["slept", "sleeping", "sleeps"],
  spend: ["spent", "spending", "spends"],
  stand: ["stood", "standing", "stands"],
  tell: ["told", "telling", "tells"],
  understand: ["understood", "understanding", "understands"],
  win: ["won", "winning", "wins"],
  become: ["became", "becoming", "becomes"],
};

function buildSingleWordPattern(word: string): string {
  const clean = word.toLowerCase().replace(/[^a-z0-9'’. -]/g, "");
  if (!clean) return "";
  const stem =
    clean.length > 3 && (clean.endsWith("e") || clean.endsWith("y"))
      ? clean.slice(0, -1)
      : clean;
  const escapedFull = clean.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapedStem = stem.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const irregularAlts = (IRREGULAR_FORMS[clean] || []).join("|");
  const irregularPart = irregularAlts ? `|${irregularAlts}` : "";
  return `(?:${escapedFull}[a-z]*|${escapedStem}(?:e|ed|d|s|es|ing|ied|ies|ier|iest|ly)?${irregularPart})`;
}

/**
 * 例文中のターゲット単語・熟語（活用形 -ed, -ing, -s や不規則変化、熟語の ~ / A / B / one's 等を含む）を検出して分割する
 */
export function splitSentenceByTargetWord(
  sentence: string,
  baseWord: string
): { before: string; matched: string; after: string } | null {
  if (!sentence || !baseWord) return null;
  const trimmed = baseWord.trim();

  // 熟語表記（[to do], (back), ~, A, B, do, doing, one's 等）をクリーニングして構成語トークンを抽出
  const cleanedPhrase = trimmed
    .replace(/\[.*?\]/g, "")
    .replace(/\([^)]*\)/g, " ")
    .replace(/[~〜…]{1,3}/g, " ")
    .replace(/\b(?:do|doing|one's|one’s|A|B)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const tokens = cleanedPhrase.split(" ").filter(Boolean);

  // 1. 複数語から成る熟語・複合名詞（例: want to, look for, take A to B, cell phone, social studies）のマッチ
  if (tokens.length >= 2) {
    const parts = tokens.map((t) => buildSingleWordPattern(t)).filter(Boolean);
    if (parts.length >= 2) {
      const phraseRegex = new RegExp(
        `\\b(${parts.join("\\s+(?:[a-zA-Z0-9'’]+\\s+){0,2}")})`,
        "i"
      );
      const phraseMatch = sentence.match(phraseRegex);
      if (phraseMatch && phraseMatch.index !== undefined) {
        return {
          before: sentence.slice(0, phraseMatch.index),
          matched: phraseMatch[0],
          after: sentence.slice(phraseMatch.index + phraseMatch[0].length),
        };
      }
    }
  }

  // 2. 単一語（または熟語の先頭コア語）のマッチ
  const targetToken = tokens[0] || trimmed.toLowerCase();
  const pat = buildSingleWordPattern(targetToken);
  if (!pat) return null;

  const boundaryRegex = new RegExp(`\\b(${pat})\\b`, "i");
  const match =
    sentence.match(boundaryRegex) || sentence.match(new RegExp(`(${pat})`, "i"));
  if (!match || match.index === undefined) {
    return null;
  }

  return {
    before: sentence.slice(0, match.index),
    matched: match[0],
    after: sentence.slice(match.index + match[0].length),
  };
}

/**
 * 1つのWordItemから、指定されたDuolingo×英検式フォーマットの問題を自動生成する
 */
export function buildWordQuestion(
  word: WordItem,
  format: Exclude<QuestionFormat, "sentence_order">,
  options?: {
    isRevengeBounty?: boolean;
    bountyMultiplier?: number;
  }
): GeneratedQuestion {
  const uid = `${word.id}_${format}_${Math.random().toString(36).slice(2, 7)}`;
  const isHardcore = word.grade === "激ムズ" || word.grade === "英検1級";

  // ④ 文脈穴埋め4択（sentence_fill）：例文がある場合のみ生成、なければ ja_to_en にフォールバック
  if (format === "sentence_fill" && word.exampleSentenceEn) {
    const split = splitSentenceByTargetWord(
      word.exampleSentenceEn,
      word.english
    );
    if (split) {
      const maskedSentence = `${split.before}[  ______  ]${split.after}`;
      const choices = shuffleArray([
        {
          id: `${uid}_correct`,
          label: word.english,
          isCorrect: true,
        },
        ...word.distractorsEn.slice(0, 3).map((d, idx) => ({
          id: `${uid}_d_${idx}`,
          label: d,
          isCorrect: false,
        })),
      ]);

      return {
        uid,
        format: "sentence_fill",
        phase: "STAGE1_COMBO",
        word,
        promptTitle: options?.isRevengeBounty
          ? "🔥 REVENGE CLOZE // 文脈穴埋めで倍返し！"
          : "CONTEXT SNIPE // 空欄に入る英単語を選べ！",
        promptMain: maskedSentence,
        promptSub: `${word.exampleSentenceJa || ""}  (${word.partOfSpeech})`,
        audioText: word.english,
        hideAudioBeforeAnswer: true,
        choices,
        isRevengeBounty: options?.isRevengeBounty,
        bountyMultiplier: options?.bountyMultiplier,
        isHardcoreQuestion: isHardcore,
      };
    }
  }

  // ① 英単語(＋発音) ➔ 日本語4択
  if (format === "en_to_ja") {
    const choices = shuffleArray([
      {
        id: `${uid}_correct`,
        label: word.japanese,
        isCorrect: true,
      },
      ...word.distractorsJa.slice(0, 3).map((d, idx) => ({
        id: `${uid}_d_${idx}`,
        label: d,
        isCorrect: false,
      })),
    ]);

    return {
      uid,
      format: "en_to_ja",
      phase: "STAGE1_COMBO",
      word,
      promptTitle: options?.isRevengeBounty
        ? "🔥 REVENGE TARGET // 倍返しチャンス！"
        : "SLASH THE MEANING // 意味を撃ち抜け！",
      promptMain: word.english,
      promptSub: `${word.phonetic ? `${word.phonetic}  |  ` : ""}${word.partOfSpeech}`,
      audioText: word.english,
      choices,
      isRevengeBounty: options?.isRevengeBounty,
      bountyMultiplier: options?.bountyMultiplier,
      isHardcoreQuestion: isHardcore,
    };
  }

  // ② 日本語 ➔ 英単語4択（全選択肢の見た目を統一してヒント漏れを防止＆回答後に発音）
  if (format === "ja_to_en" || format === "sentence_fill") {
    const choices = shuffleArray([
      {
        id: `${uid}_correct`,
        label: word.english,
        isCorrect: true,
      },
      ...word.distractorsEn.slice(0, 3).map((d, idx) => ({
        id: `${uid}_d_${idx}`,
        label: d,
        isCorrect: false,
      })),
    ]);

    return {
      uid,
      format: "ja_to_en",
      phase: "STAGE1_COMBO",
      word,
      promptTitle: options?.isRevengeBounty
        ? "🔥 REVENGE TARGET // 英語に逆転変換！"
        : "REVERSE STRIKE // 英語を選択せよ！",
      promptMain: word.japanese,
      promptSub: `${word.partOfSpeech}`,
      audioText: word.english,
      hideAudioBeforeAnswer: true,
      choices,
      isRevengeBounty: options?.isRevengeBounty,
      bountyMultiplier: options?.bountyMultiplier,
      isHardcoreQuestion: isHardcore,
    };
  }

  // ③ リスニング：音声のみ ➔ 日本語の意味4択（スペルを見せずに純粋な聴覚理解をテスト！）
  const choices = shuffleArray([
    {
      id: `${uid}_correct`,
      label: word.japanese,
      isCorrect: true,
    },
    ...word.distractorsJa.slice(0, 3).map((d, idx) => ({
      id: `${uid}_d_${idx}`,
      label: d,
      isCorrect: false,
    })),
  ]);

  return {
    uid,
    format: "listening",
    phase: "STAGE1_COMBO",
    word,
    promptTitle: options?.isRevengeBounty
      ? "🔥 REVENGE SONAR // 音を聴き分けろ！"
      : "SONAR HACK // 発音だけで意味を撃ち抜け！",
    promptMain: "🔊 LISTEN & LOCK ON",
    promptSub: `音声を聞いて正しい意味を選べ！  (${word.partOfSpeech})`,
    audioText: word.english,
    hideTextForListening: true,
    choices,
    isRevengeBounty: options?.isRevengeBounty,
    bountyMultiplier: options?.bountyMultiplier,
    isHardcoreQuestion: isHardcore,
  };
}

/**
 * 例文データから「総攻撃（ALL-OUT ATTACK）ワードバンク並び替え問題」を生成する
 */
export function buildSentenceQuestion(sentence: SentenceItem): GeneratedQuestion {
  const uid = `${sentence.id}_allout_${Math.random().toString(36).slice(2, 7)}`;
  const allTokens = [...sentence.englishTokens, ...sentence.distractorTokens];
  const shuffledTokens = shuffleArray(
    allTokens.map((text, index) => ({
      id: `${uid}_tok_${index}_${text}`,
      text,
    }))
  );

  return {
    uid,
    format: "sentence_order",
    phase: "STAGE2_ALLOUT",
    sentence,
    promptTitle: "⚡ HOLD UP!! // 総攻撃（チャンク合体フィニッシュ）",
    promptMain: sentence.japanese,
    promptSub: sentence.grammarPoint,
    audioText: sentence.englishTokens.join(" "),
    wordBank: {
      correctTokens: sentence.englishTokens,
      shuffledTokens,
    },
    isHardcoreQuestion: sentence.grade === "激ムズ" || sentence.grade === "英検1級",
  };
}

/**
 * 単語リストを「①苦手(missed > cleared) ➔ ②未出題(cleared === 0) ➔ ③習得済み」の優先順でスマート選出する
 */
function prioritizeWordsByMastery<T extends WordItem>(
  words: T[],
  count: number,
  wordMastery?: Record<string, WordMasteryRecord>,
  onlyWeakWords?: boolean
): T[] {
  const mastery = wordMastery || {};

  if (onlyWeakWords) {
    const weakList = words.filter((w) => {
      const m = mastery[w.id];
      return m && m.missed > 0;
    });
    if (weakList.length >= count) {
      return shuffleArray(weakList).slice(0, count);
    }
    const unseenList = words.filter((w) => !mastery[w.id] || mastery[w.id].cleared === 0);
    return [...shuffleArray(weakList), ...shuffleArray(unseenList)].slice(0, count);
  }

  // Tier 1: ミス回数がクリア回数以上の要注意ワード
  const tier1Weak = shuffleArray(
    words.filter((w) => {
      const m = mastery[w.id];
      return m && m.missed > 0 && m.missed >= m.cleared;
    })
  );

  // Tier 2: まだ一度もクリアしていない未出題ワード
  const tier2Unseen = shuffleArray(
    words.filter((w) => {
      const m = mastery[w.id];
      return !m || (m.cleared === 0 && m.missed === 0);
    })
  );

  // Tier 3: すでにクリア済みのワード（クリア回数が少ない順）
  const tier3Cleared = shuffleArray(
    words.filter((w) => {
      const m = mastery[w.id];
      return m && m.cleared > 0 && m.missed < m.cleared;
    })
  ).sort((a, b) => (mastery[a.id]?.cleared || 0) - (mastery[b.id]?.cleared || 0));

  return [...tier1Weak, ...tier2Unseen, ...tier3Cleared].slice(0, count);
}

/**
 * 選出された単語リストに対応する例文から、ラスト1問の「総攻撃（語順並び替え）」問題を1問選出する
 */
function pickAllOutSentenceQuestion(
  selectedWords: WordItem[],
  sentencesPool: SentenceItem[]
): GeneratedQuestion | null {
  const selectedIds = new Set(selectedWords.map((w) => w.id));
  const matchingSentences = sentencesPool.filter(
    (s) =>
      s.targetWordIds.some((id) => selectedIds.has(id)) &&
      s.englishTokens.length >= 4 &&
      s.englishTokens.length <= 10
  );
  const candidates =
    matchingSentences.length > 0
      ? matchingSentences
      : sentencesPool.filter(
          (s) => s.englishTokens.length >= 4 && s.englishTokens.length <= 10
        );

  if (candidates.length === 0) return null;
  const chosen = shuffleArray(candidates)[0];
  return buildSentenceQuestion(chosen);
}

/**
 * 1プレイのバトルデッキを自動生成する
 * - 全ステージ共通：4形式（①英→日 ②日→英 ③リスニング ④文脈穴埋め）がデフォルトで均等に出現！
 * - 4択6問 ＋ ラスト総攻撃（語順並び替え）1問の二段ロケット構成
 * - 未出題＆苦手ワードを自動優先出題
 */
export function generateBattleDeck(
  grade: GradeLevel,
  includeHardcoreHack: boolean,
  stageOrTrack: number = 0,
  wordMastery?: Record<string, WordMasteryRecord>,
  onlyWeakWords: boolean = false,
  includeListening: boolean = true
): GeneratedQuestion[] {
  const pool = getActiveVocabPool();

  const defaultFormats: Exclude<QuestionFormat, "sentence_order">[] =
    includeListening
      ? shuffleArray([
          "en_to_ja",
          "ja_to_en",
          "listening",
          "sentence_fill",
          "en_to_ja",
          "sentence_fill",
        ])
      : shuffleArray([
          "en_to_ja",
          "ja_to_en",
          "sentence_fill",
          "en_to_ja",
          "ja_to_en",
          "sentence_fill",
        ]);

  // === 1. 新規最優先ステージ：『英検4級 全16ステージ（Stage 01〜12 / 分野別まとめ / 総合FINAL 全700語）』 ===
  if (grade === "英検4級") {
    const stageDef = EIKEN4_STAGES.find(
      (s) => s.unitNumber === (stageOrTrack || 1)
    );
    const activeLevels = stageDef ? stageDef.levels : [1];
    const stageWords = pool.eiken4Words.filter((w) =>
      activeLevels.includes(w.unitNumber)
    );
    const stageSentences = pool.eiken4Sentences.filter((s) =>
      activeLevels.includes(s.unitNumber)
    );

    const candidatePool =
      stageWords.length >= 6 ? stageWords : pool.eiken4Words;

    const selectedEiken4Words = prioritizeWordsByMastery(
      candidatePool,
      6,
      wordMastery,
      onlyWeakWords
    );

    const comboDeck = selectedEiken4Words.map((word, index) =>
      buildWordQuestion(word, defaultFormats[index % defaultFormats.length])
    );

    const allOutQ = pickAllOutSentenceQuestion(
      selectedEiken4Words,
      stageSentences.length > 0 ? stageSentences : pool.eiken4Sentences
    );

    return allOutQ ? [...comboDeck, allOutQ] : comboDeck;
  }

  // === 2. 中学英単語ステージ：『ターゲット1800 全18ステージ（Lv.01〜10 / 2レベルまとめ / 5レベルまとめ / 総合FINAL）』 ===
  if (grade === "ターゲット1800") {
    const stageDef = TARGET1800_STAGES.find(
      (s) => s.unitNumber === (stageOrTrack || 1)
    );
    const activeLevels = stageDef ? stageDef.levels : [1];
    const stageWords = pool.target1800Words.filter((w) =>
      activeLevels.includes(w.unitNumber)
    );
    const stageSentences = pool.target1800Sentences.filter((s) =>
      activeLevels.includes(s.unitNumber)
    );

    const candidatePool =
      stageWords.length >= 6 ? stageWords : pool.target1800Words;

    const selectedTargetWords = prioritizeWordsByMastery(
      candidatePool,
      6,
      wordMastery,
      onlyWeakWords
    );

    const comboDeck = selectedTargetWords.map((word, index) =>
      buildWordQuestion(word, defaultFormats[index % defaultFormats.length])
    );

    const allOutQ = pickAllOutSentenceQuestion(
      selectedTargetWords,
      stageSentences.length > 0 ? stageSentences : pool.target1800Sentences
    );

    return allOutQ ? [...comboDeck, allOutQ] : comboDeck;
  }

  // === 3. 専用ステージ：『英検1級 Unit 01（0001〜0096）』 ===
  if (grade === "英検1級") {
    const trackWords =
      stageOrTrack > 0
        ? pool.eiken1Words.filter((w) => w.track === stageOrTrack)
        : pool.eiken1Words;

    const candidatePool =
      trackWords.length >= 6 ? trackWords : pool.eiken1Words;

    const selectedEikenWords = prioritizeWordsByMastery(
      candidatePool,
      6,
      wordMastery,
      onlyWeakWords
    );

    return selectedEikenWords.map((word, index) =>
      buildWordQuestion(word, defaultFormats[index % defaultFormats.length])
    );
  }

  // === 4. 通常ステージ（中1 / 中2 / 中3 / 全学年MIX） ===
  let poolWords =
    grade === "ALL"
      ? pool.standardWords.filter((w) => w.grade !== "激ムズ")
      : pool.standardWords.filter((w) => w.grade === grade);

  if (poolWords.length < 4) {
    poolWords = pool.standardWords.filter((w) => w.grade !== "激ムズ");
  }

  const normalWordCount = includeHardcoreHack ? 4 : 6;
  let selectedWords = prioritizeWordsByMastery(
    poolWords,
    normalWordCount,
    wordMastery,
    onlyWeakWords
  );

  if (includeHardcoreHack) {
    const hardcoreWords = prioritizeWordsByMastery(
      pool.standardWords.filter((w) => w.grade === "激ムズ"),
      2,
      wordMastery,
      onlyWeakWords
    );
    selectedWords = [...selectedWords, ...hardcoreWords];
  }

  return selectedWords.map((word, index) => {
    const format = defaultFormats[index % defaultFormats.length];
    return buildWordQuestion(word, format);
  });
}
