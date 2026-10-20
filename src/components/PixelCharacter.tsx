"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CharacterGender,
  CharacterPartLoadout,
  FiveStats,
} from "@/lib/types";
import {
  detectStatBranch,
  FourColorPalette,
  PRESET_4COLOR_PALETTES,
  resolveAutoLoadout,
} from "@/lib/characterPartsEngine";

interface PixelCharacterProps {
  gender: CharacterGender;
  stage: number; // 1 to 10
  size?: number;
  mood?: "idle" | "happy" | "attack" | "evolve";
  showAura?: boolean;
  stats?: FiveStats;
  loadout?: CharacterPartLoadout;
  animateFrames?: boolean;
  customPalettes?: FourColorPalette[]; // ユーザーがランダム生成・所持しているパレットリスト
}

/**
 * 【学園モノ × 万能勇者DopaEng】
 * 24×24 レトロ4色パレット・ドット絵キャラクター描画エンジン（4コマアニメーション搭載）
 * - キャラクター全体を厳密に「4色のみ（c1暗部, c2明部/肌, c3メイン制服/髪, c4アクセント）」で表現
 * - 4コマ（Frame 0, 1, 2, 3）の呼吸・瞬き・マフラー/髪の揺れ・学園文具ブレードの煌めき＆斬撃
 */
export const PixelCharacter: React.FC<PixelCharacterProps> = ({
  gender,
  stage,
  size = 136,
  mood = "idle",
  showAura = true,
  stats,
  loadout,
  animateFrames = true,
  customPalettes = [],
}) => {
  const clampedStage = Math.max(1, Math.min(10, stage));

  // 4コマアニメーション状態 (0 -> 1 -> 2 -> 3)
  const [frame, setFrame] = useState<0 | 1 | 2 | 3>(0);

  useEffect(() => {
    if (!animateFrames) {
      setFrame(0);
      return;
    }
    const intervalMs =
      mood === "attack" || mood === "happy" || mood === "evolve" ? 115 : 220;
    const timer = setInterval(() => {
      setFrame((prev) => ((prev + 1) % 4) as 0 | 1 | 2 | 3);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [animateFrames, mood]);

  // 現在の有効ロードアウトを決定（カスタム or 五角形ステータス連動オート進化）
  const activeBranch = loadout?.forcedBranch || detectStatBranch(stats);
  const autoLoadout = resolveAutoLoadout(gender, clampedStage, activeBranch);
  let effectiveLoadout: CharacterPartLoadout =
    loadout && loadout.mode === "custom"
      ? {
          ...autoLoadout,
          ...loadout,
        }
      : loadout?.forcedBranch
      ? resolveAutoLoadout(gender, clampedStage, loadout.forcedBranch)
      : autoLoadout;

  // 女子選択時でパレットが男子用のクラシックネイビーのままの場合、華やかな女子用パレットへ切り替え
  if (gender === "girl" && (!effectiveLoadout.palette || effectiveLoadout.palette === "pal_classic_navy")) {
    effectiveLoadout = { ...effectiveLoadout, palette: "pal_berry_rose" };
  }
  // 女子選択時で男子短髪（hair_spiky）のままの場合、可愛い女子ボブへ切り替え
  if (gender === "girl" && (!effectiveLoadout.hairStyle || effectiveLoadout.hairStyle === "hair_spiky")) {
    effectiveLoadout = { ...effectiveLoadout, hairStyle: "hair_bob" };
  }

  // 4色パレット解決（厳密に4色のみ使用！）
  const palettePool = [...PRESET_4COLOR_PALETTES, ...customPalettes];
  const activePalette: FourColorPalette =
    palettePool.find((p) => p.id === effectiveLoadout.palette) ||
    PRESET_4COLOR_PALETTES[0];

  const c1 = activePalette.c1; // Base Dark (輪郭・影・靴・瞳深部)
  const c2 = activePalette.c2; // Light / Skin (肌色・シャツ白・明るい光)
  const c3 = activePalette.c3; // Main Fabric / Hair (ブレザー制服・髪・メインパーツ)
  const c4 = activePalette.c4; // Accent (ネクタイ・リボン・ペン先・金ボタン・光刃)

  // 4コマのモーションオフセット
  // Frame 0: 基本立ち
  // Frame 1: 呼吸で1px沈む (bobY = 1) + マフラー/髪が外側へ揺れる
  // Frame 2: 基本立ち + 武器の白光グリント (gleam)
  // Frame 3: 瞬き (isBlink)
  const bobY =
    mood === "happy"
      ? frame % 2 === 1
        ? -1
        : 0
      : frame === 1
      ? 1
      : 0;
  const hairSway = frame === 1 || frame === 2 ? 1 : 0;
  const isBlink = frame === 3 && mood === "idle";
  const isGleam = frame === 2 || frame === 3;

  // 24x24 ピクセルグリッド
  const GRID_SIZE = 24;
  const grid: (string | null)[][] = Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill(null)
  );

  const setPx = (x: number, y: number, color: string) => {
    const rx = Math.round(x);
    const ry = Math.round(y);
    if (rx >= 0 && rx < GRID_SIZE && ry >= 0 && ry < GRID_SIZE) {
      grid[ry][rx] = color;
    }
  };

  const rectPx = (
    x1: number,
    y1: number,
    w: number,
    h: number,
    color: string
  ) => {
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        setPx(x1 + dx, y1 + dy, color);
      }
    }
  };

  // =========================================================================
  // LAYER 1: 背面装備 (BackGear: リュック、マフラー、肩掛けニット、マント、勇者光翼)
  // =========================================================================
  const backGear = effectiveLoadout.backGear;

  if (backGear === "back_rucksack") {
    // 通学スクールリュックサック（両肩から後ろへ）
    rectPx(6, 11 + bobY, 3, 6, c3);
    rectPx(15, 11 + bobY, 3, 6, c3);
    rectPx(6, 13 + bobY, 1, 3, c4);
    rectPx(17, 13 + bobY, 1, 3, c4);
  } else if (backGear === "back_scarf") {
    // 風になびく通学マフラー（右後ろへたなびく）
    rectPx(7, 11 + bobY, 10, 2, c4);
    rectPx(16 + hairSway, 12 + bobY, 5, 2, c4);
    rectPx(19 + hairSway, 14 + bobY, 3, 2, c4);
    setPx(21 + hairSway, 13 + bobY, c2);
  } else if (backGear === "back_shoulder_knit") {
    // 肩掛けプロデューサーニット
    rectPx(7, 11 + bobY, 10, 2, c3);
    rectPx(9, 13 + bobY, 2, 4, c3);
    rectPx(13, 13 + bobY, 2, 4, c3);
  } else if (backGear === "back_equalizer") {
    // ネオン音波イコライザー（4コマでバーが躍動）
    const barH = frame === 0 ? [3, 6, 4] : frame === 1 ? [6, 4, 7] : [4, 7, 3];
    for (let i = 0; i < 3; i++) {
      rectPx(3 + i * 2, 15 - barH[i] + bobY, 1, barH[i], c4);
      rectPx(20 - i * 2, 15 - barH[i] + bobY, 1, barH[i], c4);
    }
  } else if (backGear === "back_flying_stationery") {
    // 浮遊する必勝文具ビット（消しゴム・クリップ・三角定規がホバー）
    const hOff = frame % 2 === 0 ? 0 : -1;
    rectPx(3, 8 + hOff, 2, 3, c2);
    setPx(4, 9 + hOff, c4);
    rectPx(19, 7 - hOff, 3, 3, c4);
    setPx(20, 8 - hOff, c2);
  } else if (backGear === "back_speech_banner") {
    // 大会応援スクールフラッグ（背後に掲げる幟）
    rectPx(5, 5 + bobY, 1, 13, c1);
    rectPx(2, 5 + bobY, 4, 5, c4);
    setPx(3, 7 + bobY, c2);
  } else if (backGear === "back_alphabet_aura") {
    // 舞い踊る英単語(A-Z)オーラ
    const letters = [
      [3, 7],
      [5, 12],
      [19, 7],
      [20, 13],
    ];
    letters.forEach(([lx, ly], idx) => {
      if ((idx + frame) % 2 === 0) {
        setPx(lx, ly + bobY, c4);
        setPx(lx + 1, ly + bobY, c2);
      }
    });
  } else if (backGear === "back_brave_cape") {
    // 英語勇者の学園マント
    rectPx(6 - hairSway, 11 + bobY, 12 + hairSway * 2, 8, c3);
    rectPx(7, 12 + bobY, 10, 6, c1);
    rectPx(6 - hairSway, 18 + bobY, 2, 1, c4);
    rectPx(16 + hairSway, 18 + bobY, 2, 1, c4);
  } else if (backGear === "back_brave_wings") {
    // 万能勇者DopaEngの光翼（学園の頂点・覚醒羽）
    const wy = 6 + bobY + (frame === 1 ? -1 : frame === 3 ? 1 : 0);
    // 左光翼
    rectPx(1, wy, 6, 2, c4);
    rectPx(2, wy + 2, 5, 3, c2);
    setPx(1, wy + 4, c4);
    // 右光翼
    rectPx(17, wy, 6, 2, c4);
    rectPx(17, wy + 2, 5, 3, c2);
    setPx(22, wy + 4, c4);
  }

  // =========================================================================
  // LAYER 2: 後ろ髪（ツインテ、ボブ、ポニーテール、ロール等）
  // =========================================================================
  const hairStyle = effectiveLoadout.hairStyle;
  const isGirl = gender === "girl";

  // フェアルーン2風のコロンと丸みのある頭部ベース
  if (isGirl) {
    rectPx(6, 4 + bobY, 12, 7, c3);
    rectPx(7, 3 + bobY, 10, 2, c3);
  } else {
    rectPx(6, 4 + bobY, 12, 4, c3);
    rectPx(7, 3 + bobY, 10, 2, c3);
  }

  if (hairStyle === "hair_bob" || (isGirl && hairStyle === "hair_spiky")) {
    // ふんわり内巻きスクールボブ（女子Lv.1定番！両肩にふんわり下がる）
    rectPx(5, 6 + bobY, 2, 6, c3);
    rectPx(17, 6 + bobY, 2, 6, c3);
    setPx(6, 12 + bobY, c1);
    setPx(17, 12 + bobY, c1);
    setPx(5, 9 + bobY, c2); // 光沢ハイライト
    setPx(18, 9 + bobY, c2);
  } else if (hairStyle === "hair_twintail") {
    // 王道スクールツインテール（ふんわりボリューム＆リボン留め＆スイング）
    // 結び目リボン
    rectPx(4 - hairSway, 5 + bobY, 2, 2, isGirl ? "#F43F5E" : c4);
    rectPx(18 + hairSway, 5 + bobY, 2, 2, isGirl ? "#F43F5E" : c4);
    // ツインテ本体（幅3pxでふんわり）
    rectPx(4 - hairSway, 7 + bobY, 3, 7, c3);
    rectPx(17 + hairSway, 7 + bobY, 3, 7, c3);
    // 毛先のハネ
    setPx(3 - hairSway, 13 + bobY, c3);
    setPx(20 + hairSway, 13 + bobY, c3);
    setPx(5 - hairSway, 14 + bobY, c1);
    setPx(18 + hairSway, 14 + bobY, c1);
  } else if (hairStyle === "hair_ponytail") {
    // 疾風ポニーテール（高め結び ＋ リボン留め ＋ 右後ろになびく）
    rectPx(15, 4 + bobY - hairSway, 2, 2, isGirl ? "#F43F5E" : c4); // リボン
    rectPx(16, 5 + bobY - hairSway, 4, 4, c3);
    rectPx(18, 8 + bobY - hairSway, 3, 4, c3);
    setPx(20, 11 + bobY - hairSway, c1);
  } else if (hairStyle === "hair_drill") {
    // お嬢様ツインロール
    rectPx(5, 6 + bobY, 3, 8, c3);
    rectPx(16, 6 + bobY, 3, 8, c3);
    setPx(6, 8 + bobY, c2);
    setPx(17, 8 + bobY, c2);
    setPx(6, 11 + bobY, c2);
    setPx(17, 11 + bobY, c2);
  } else if (hairStyle === "hair_odango") {
    // ポップお団子ツイン（両サイドのお団子＋ヘアピンリボン）
    rectPx(4, 3 + bobY, 3, 3, c3);
    rectPx(17, 3 + bobY, 3, 3, c3);
    setPx(5, 3 + bobY, isGirl ? "#F43F5E" : c4);
    setPx(18, 3 + bobY, isGirl ? "#F43F5E" : c4);
    setPx(4, 2 + bobY, c2);
    setPx(19, 2 + bobY, c2);
  }

  // =========================================================================
  // LAYER 3: 脚・靴・ボトムス（接地 y=18..21）
  // =========================================================================
  const outfit = effectiveLoadout.outfit;

  if (isGirl) {
    if (outfit === "outfit_jersey") {
      // 女子Lv.1：スポーティ短パンジャージ ＋ すらっと美脚 ＋ 白ソックス＆スニーカー
      rectPx(8, 16 + bobY, 8, 2, c3); // 短パン
      setPx(8, 16 + bobY, c2); // 白サイドライン
      setPx(15, 16 + bobY, c2);
      rectPx(9, 18, 2, 2, c2); // すらっとした健康的な生足
      rectPx(13, 18, 2, 2, c2);
      rectPx(9, 20, 2, 1, "#FFFFFF"); // 清潔な白ソックス
      rectPx(13, 20, 2, 1, "#FFFFFF");
      rectPx(8, 21, 3, 1, c1); // スニーカー
      rectPx(13, 21, 3, 1, c1);
      setPx(8, 21, "#F43F5E"); // スニーカー差し色
      setPx(15, 21, "#F43F5E");
    } else {
      // 女子制服：ふわっと広がるAラインプリーツスカート ＋ ニーハイ/ハイソックス ＋ ローファー
      rectPx(8, 15 + bobY, 8, 1, c1); // ウエストベルトライン（キュッと細身）
      rectPx(7, 16 + bobY, 10, 1, c3); // スカート上部
      rectPx(6, 17 + bobY, 12, 1, c3); // ふわっと広がるスカート裾（幅12px！）
      // プリーツの陰影
      setPx(8, 17 + bobY, c1);
      setPx(11, 17 + bobY, c1);
      setPx(14, 17 + bobY, c1);
      // 裾の愛らしいライン
      setPx(6, 17 + bobY, c4);
      setPx(17, 17 + bobY, c4);
      // すらっとした生足（絶対領域）
      rectPx(9, 18, 2, 1, c2);
      rectPx(13, 18, 2, 1, c2);
      // ニーハイソックス / 紺ハイソックス
      rectPx(9, 19, 2, 2, c1);
      rectPx(13, 19, 2, 2, c1);
      // 上品な学生ローファー
      rectPx(8, 21, 3, 1, c1);
      rectPx(13, 21, 3, 1, c1);
      setPx(9, 21, c3);
      setPx(14, 21, c3);
    }
  } else {
    // 男子：スラックスズボン ＋ スクールスニーカー
    rectPx(9, 18, 2, 2, c3);
    rectPx(13, 18, 2, 2, c3);
    rectPx(8, 20, 3, 2, c1); // 靴
    rectPx(13, 20, 3, 2, c1);
    setPx(8, 20, c2); // スニーカー白ライン
    setPx(13, 20, c2);
  }

  // =========================================================================
  // LAYER 4: 胴体・衣装（制服・ジャージ・パーカー・スーツ）
  // =========================================================================
  rectPx(8, 12 + bobY, 8, 6, c3);

  if (outfit === "outfit_jersey") {
    if (isGirl) {
      // 女子ジャージ（襟元を少し開けて可愛いインナーチラ見せ）
      rectPx(8, 12 + bobY, 1, 4, c2);
      rectPx(15, 12 + bobY, 1, 4, c2);
      rectPx(11, 12 + bobY, 2, 3, c2); // 白インナー
      setPx(11, 13 + bobY, "#F43F5E"); // チェリーチャーム
    } else {
      // 男子部屋着ジャージ（胸に白ライン）
      rectPx(8, 12 + bobY, 1, 6, c2);
      rectPx(15, 12 + bobY, 1, 6, c2);
      rectPx(11, 12 + bobY, 2, 3, c1);
    }
  } else if (outfit === "outfit_uniform") {
    // 学園ブレザー制服
    if (isGirl) {
      // 女子ブレザー：白シャツ ＋ 大きな可愛い蝶結びリボン ＋ 金ボタン
      rectPx(10, 12 + bobY, 4, 3, c2);
      rectPx(10, 13 + bobY, 4, 2, "#F43F5E"); // 大きめチェリーリボン
      setPx(11, 13 + bobY, "#FFFFFF"); // リボンの結び目光沢
      setPx(9, 14 + bobY, c4); // 金ボタン
    } else {
      rectPx(10, 12 + bobY, 4, 3, c2);
      rectPx(11, 13 + bobY, 2, 3, c4);
      setPx(10, 15 + bobY, c4);
    }
  } else if (outfit === "outfit_sailor_gakuran") {
    if (isGirl) {
      // 伝統セーラー服（大きな白襟 ＋ スカーフリボン）
      rectPx(8, 12 + bobY, 8, 2, c2); // セーラー白襟
      rectPx(10, 13 + bobY, 4, 2, "#F43F5E"); // 三角スカーフリボン
      setPx(11, 14 + bobY, "#FFFFFF");
    } else {
      // 学ラン（詰襟ゴールドボタン）
      rectPx(11, 12 + bobY, 2, 1, c2);
      setPx(11, 13 + bobY, c4);
      setPx(11, 15 + bobY, c4);
    }
  } else if (outfit === "outfit_cardigan") {
    // 放課後スクールカーディガン
    if (isGirl) {
      rectPx(10, 12 + bobY, 4, 4, c2);
      rectPx(10, 13 + bobY, 4, 2, "#F43F5E"); // リボン
      setPx(11, 13 + bobY, "#FFFFFF");
    } else {
      rectPx(10, 12 + bobY, 4, 4, c2);
      rectPx(11, 13 + bobY, 2, 2, c4);
    }
  } else if (outfit === "outfit_hoodie") {
    // パーカー制服
    rectPx(9, 12 + bobY, 6, 2, c4);
    rectPx(10, 14 + bobY, 1, 3, c2);
    rectPx(13, 14 + bobY, 1, 3, c2);
  } else if (outfit === "outfit_tuxedo") {
    // 英語弁論大会フォーマルスーツ
    rectPx(10, 12 + bobY, 4, 5, c2);
    rectPx(11, 13 + bobY, 2, 2, c1); // 蝶ネクタイ
    setPx(11, 15 + bobY, c4);
  } else if (outfit === "outfit_scholar_robe") {
    // 図書室スカラー制服
    rectPx(7, 15 + bobY, 10, 3, c3);
    rectPx(10, 12 + bobY, 4, 6, c4);
  } else if (outfit === "outfit_idol_stage") {
    // 学園祭ステージ衣装
    rectPx(9, 12 + bobY, 6, 2, c4);
    rectPx(8, 15 + bobY, 8, 1, c2);
  } else if (outfit === "outfit_council_blazer") {
    // 生徒会特注エンブレム制服
    rectPx(10, 12 + bobY, 4, 3, c2);
    rectPx(11, 13 + bobY, 2, 3, isGirl ? "#F43F5E" : c4);
    rectPx(9, 14 + bobY, 2, 2, c4); // 胸の特注エンブレム
  } else if (outfit === "outfit_ace_blazer") {
    // 学園英語選抜エースブレザー
    rectPx(10, 12 + bobY, 4, 3, c2);
    rectPx(11, 13 + bobY, 2, 3, isGirl ? "#F43F5E" : c4);
    rectPx(7, 12 + bobY, 2, 2, c4); // 肩章
    rectPx(15, 12 + bobY, 2, 2, c4);
  } else if (outfit === "outfit_brave_dopaeng") {
    // 万能勇者DopaEngマント制服（ゴールド装飾＆勇者のエンブレム）
    rectPx(7, 12 + bobY, 2, 3, c4);
    rectPx(15, 12 + bobY, 2, 3, c4);
    rectPx(10, 12 + bobY, 4, 6, c2);
    rectPx(11, 13 + bobY, 2, 4, isGirl ? "#F43F5E" : c4);
  }

  // 両腕＆手（happy時はバンザイ！）
  const armY = mood === "happy" && frame % 2 === 1 ? 10 + bobY : 12 + bobY;
  rectPx(6, armY, 2, 4, c3);
  rectPx(16, armY, 2, 4, c3);
  rectPx(6, armY + 4, 2, 1, c2); // 手（肌）
  rectPx(16, armY + 4, 2, 1, c2);

  // =========================================================================
  // LAYER 5: 頭部・顔・瞳 (Fairune 2 原作完全準拠：縦2ドット黒目 ＋ あいた赤口)
  // =========================================================================
  rectPx(8, 6 + bobY, 8, 6, c2); // 顔の肌
  rectPx(9, 11 + bobY, 6, 1, c1); // 顎下の影
  setPx(7, 8 + bobY, c2); // 耳
  setPx(16, 8 + bobY, c2);

  // おでこ中央の肌の抜け（フェアルーン2主人公特有のヘアスタイル）
  setPx(11, 5 + bobY, c2);
  setPx(12, 5 + bobY, c2);

  // 瞳の描画（【フェアルーン2】完全準拠：縦2ドット×横1ドットの黒スリット目）
  // まつ毛やハイライト等の余計な装飾を排した、原作そのままの愛らしくつぶらな縦長瞳！
  if (isBlink) {
    // 瞬き（1ドットのまばたき線）
    setPx(9, 9 + bobY, c1);
    setPx(14, 9 + bobY, c1);
  } else if (mood === "happy" || mood === "evolve") {
    // ニッコリ笑顔
    setPx(9, 8 + bobY, c1);
    setPx(14, 8 + bobY, c1);
  } else {
    // --- 左目 (x=9, y=8..9) ---
    setPx(9, 8 + bobY, c1);
    setPx(9, 9 + bobY, c1);

    // --- 右目 (x=14, y=8..9) ---
    setPx(14, 8 + bobY, c1);
    setPx(14, 9 + bobY, c1);

    // 男子の眉（目の1ドット上に小さな黒ドット）
    if (!isGirl) {
      setPx(9, 7 + bobY, c1);
      setPx(14, 7 + bobY, c1);
    }
  }

  // 口元（【フェアルーン2】象徴的な愛らしく開いた横2ドットのお口！）
  // 目の下2行あけた中央(x=11..12, y=11)にちょこんと開く赤いお口
  if (mood === "happy" || mood === "evolve") {
    rectPx(11, 10 + bobY, 2, 2, isGirl ? "#F43F5E" : c4);
  } else {
    setPx(11, 11 + bobY, isGirl ? "#F43F5E" : c4);
    setPx(12, 11 + bobY, isGirl ? "#F43F5E" : c4);
  }

  // =========================================================================
  // LAYER 6: 前髪・ヘアスタイル (HairStyle)
  // =========================================================================
  rectPx(7, 3 + bobY, 10, 3, c3);
  rectPx(6, 4 + bobY, 12, 2, c3);

  // おでこ中央の肌抜け（フェアルーン2主人公特有のセンター分け前髪）
  if (isGirl || hairStyle === "hair_center") {
    setPx(11, 5 + bobY, c2);
    setPx(12, 5 + bobY, c2);
  }

  // 女子専用：顔まわりをふんわり包むサイドボブヘア
  if (isGirl) {
    rectPx(5, 6 + bobY, 2, 6, c3); // 左サイド髪
    rectPx(17, 6 + bobY, 2, 6, c3); // 右サイド髪
    setPx(6, 12 + bobY, c1);
    setPx(17, 12 + bobY, c1);
    // 前髪の毛先
    setPx(8, 6 + bobY, c3);
    setPx(10, 6 + bobY, c3);
    setPx(13, 6 + bobY, c3);
    setPx(15, 6 + bobY, c3);
  } else {
    // 男子前髪サイド
    setPx(7, 6 + bobY, c3);
    setPx(16, 6 + bobY, c3);
    setPx(9, 6 + bobY, c3);
    setPx(11, 6 + bobY, c3);
    setPx(12, 6 + bobY, c3);
    setPx(14, 6 + bobY, c3);
  }

  if (hairStyle === "hair_spiky") {
    setPx(7, 3 + bobY, c3);
    setPx(10, 2 + bobY, c3);
    setPx(13, 2 + bobY, c3);
    setPx(16, 3 + bobY, c3);
  } else if (hairStyle === "hair_mush") {
    rectPx(8, 5 + bobY, 8, 2, c3);
  } else if (hairStyle === "hair_center") {
    rectPx(7, 4 + bobY, 4, 3, c3);
    rectPx(13, 4 + bobY, 4, 3, c3);
  } else if (hairStyle === "hair_allback") {
    rectPx(7, 2 + bobY, 10, 2, c3);
    setPx(9, 1 + bobY, c3);
    setPx(14, 1 + bobY, c3);
  } else if (hairStyle === "hair_flame" || hairStyle === "hair_brave_crown") {
    // 逆毛 / 覚醒勇者ヘア
    setPx(7, 2 + bobY, c3);
    rectPx(10, 1 + bobY - hairSway, 4, 2, c3);
    setPx(16, 2 + bobY, c3);
    setPx(11, 3 + bobY, c4); // 勇者の光ハイライト
  }

  // =========================================================================
  // LAYER 7: 頭装備 (Headgear)
  // =========================================================================
  const headgear = effectiveLoadout.headgear;

  if (headgear === "head_ahoge") {
    setPx(11, 2 + bobY, c3);
    setPx(12 + hairSway, 1 + bobY, c3);
    setPx(13 + hairSway, 1 + bobY, c3);
  } else if (headgear === "head_ribbon") {
    // 愛らしい制服ビッグヘアリボン
    rectPx(10, 1 + bobY, 4, 2, isGirl ? "#F43F5E" : c4);
    rectPx(8, 0 + bobY, 2, 2, isGirl ? "#F43F5E" : c4);
    rectPx(14, 0 + bobY, 2, 2, isGirl ? "#F43F5E" : c4);
    setPx(11, 1 + bobY, "#FFFFFF");
  } else if (headgear === "head_glasses") {
    rectPx(8, 8 + bobY, 4, 1, c1);
    rectPx(12, 8 + bobY, 4, 1, c1);
    if (isGleam) {
      setPx(9, 8 + bobY, c2);
      setPx(13, 8 + bobY, c2);
    }
  } else if (headgear === "head_headphones") {
    rectPx(7, 3 + bobY, 10, 1, c1);
    rectPx(6, 7 + bobY, 2, 3, c4);
    rectPx(16, 7 + bobY, 2, 3, c4);
    setPx(6, 8 + bobY, c2);
    setPx(17, 8 + bobY, c2);
  } else if (headgear === "head_cap") {
    rectPx(7, 3 + bobY, 10, 2, c3);
    rectPx(15, 5 + bobY, 4, 1, c4); // つば
  } else if (headgear === "head_smart_glass") {
    rectPx(8, 7 + bobY, 8, 2, c4);
    setPx(9, 8 + bobY, c2);
  } else if (headgear === "head_headband") {
    rectPx(7, 5 + bobY, 10, 1, c2); // 白ハチマキ
    rectPx(17, 5 + bobY - hairSway, 3, 1, c4); // なびく赤紐
  } else if (headgear === "head_laurel") {
    rectPx(6, 4 + bobY, 2, 2, c4);
    rectPx(16, 4 + bobY, 2, 2, c4);
    setPx(11, 2 + bobY, c4);
  } else if (headgear === "head_brave_tiara") {
    rectPx(8, 1 + bobY, 8, 2, c4);
    setPx(11, 0 + bobY, c2);
    setPx(12, 0 + bobY, c2);
  }

  // =========================================================================
  // LAYER 8: 左手装備 (WeaponLeft: 単語帳、スクールバッグ、辞書、シールド)
  // =========================================================================
  const wpLeft = effectiveLoadout.weaponLeft;
  const subHover = frame % 2 === 1 ? -1 : 0;

  if (wpLeft === "sub_word_ring") {
    // 必勝リング単語帳
    rectPx(3, 12 + bobY, 3, 4, c2);
    setPx(3, 12 + bobY, c1); // リング部
    setPx(4, 13 + bobY, c4); // 単語文字
  } else if (wpLeft === "sub_school_bag") {
    // 通学スクールバッグ
    rectPx(2, 13 + bobY, 4, 4, c1);
    rectPx(3, 12 + bobY, 2, 1, c3); // 持ち手
    setPx(4, 14 + bobY, c4);
  } else if (wpLeft === "sub_oxford_dict") {
    // 厚口オックスフォード英英辞典
    rectPx(2, 11 + bobY, 4, 5, c3);
    rectPx(2, 11 + bobY, 1, 5, c4); // 背表紙
    setPx(4, 13 + bobY, c2);
  } else if (wpLeft === "sub_speech_notes") {
    // 英語弁論スピーチ原稿バインダー
    rectPx(2, 11 + bobY, 4, 5, c1);
    rectPx(3, 12 + bobY, 3, 4, c2);
  } else if (wpLeft === "sub_e_dict_pad") {
    // 小型電子辞書パッド
    rectPx(2, 10 + subHover, 4, 4, c1);
    rectPx(3, 11 + subHover, 2, 2, c4);
  } else if (wpLeft === "sub_wireless_earbud") {
    // 重低音スピーカー宝珠
    rectPx(2, 10 + subHover, 4, 4, c1);
    rectPx(3, 11 + subHover, 2, 2, c4);
  } else if (wpLeft === "sub_dual_pen") {
    // 逆手・二刀流赤ペン
    rectPx(2, 14 + bobY, 4, 1, c4);
    setPx(1, 15 + bobY, c2);
  } else if (wpLeft === "sub_brave_crest_shield") {
    // 万能勇者の生徒手帳シールド
    rectPx(2, 11 + bobY, 5, 6, c1);
    rectPx(3, 12 + bobY, 3, 4, c3);
    rectPx(4, 12 + bobY, 1, 4, c4);
    rectPx(3, 13 + bobY, 3, 1, c4);
  }

  // =========================================================================
  // LAYER 9: 右手メイン武器 (WeaponRight: シャーペン、定規、マイク、光筆カリバー)
  // =========================================================================
  const wpRight = effectiveLoadout.weaponRight;

  if (wpRight === "wp_pencil_dagger") {
    // 必勝シャープペンシル
    rectPx(18, 10 + bobY, 2, 6, c4);
    setPx(18, 9 + bobY, c1); // ペン先芯
    rectPx(18, 16 + bobY, 2, 1, c2); // 消しゴム
  } else if (wpRight === "wp_fountain_pen") {
    // インテリ万年筆ブレード
    rectPx(18, 9 + bobY, 2, 7, c1);
    rectPx(18, 7 + bobY, 2, 2, c4); // 金ペン先
    setPx(18, 6 + bobY, c2);
  } else if (wpRight === "wp_ruler_blade") {
    // 30cm定規スラッシャー
    rectPx(18, 5 + bobY, 2, 11, c2);
    for (let m = 6; m < 15; m += 2) {
      setPx(19, m + bobY, c1); // 目盛り
    }
  } else if (wpRight === "wp_speech_mic") {
    // 英語スピーチマイク
    rectPx(19, 9 + bobY, 1, 8, c1);
    rectPx(18, 6 + bobY, 3, 3, c4);
    setPx(19, 7 + bobY, c2);
  } else if (wpRight === "wp_laser_pointer") {
    // レーザーポインターセイバー
    rectPx(18, 13 + bobY, 2, 3, c1);
    rectPx(18, 5 + bobY, 2, 8, c4);
    setPx(18, 5 + bobY, c2);
  } else if (wpRight === "wp_megaphone") {
    // 学園応援メガホン
    rectPx(18, 11 + bobY, 2, 4, c1);
    rectPx(19, 9 + bobY, 3, 6, c4);
    rectPx(22, 8 + bobY, 1, 8, c2);
  } else if (wpRight === "wp_penlight_sabre") {
    // ペンライトツインブレード
    rectPx(18, 13 + bobY, 2, 3, c1);
    rectPx(18, 6 + bobY, 2, 7, c4);
    rectPx(19, 6 + bobY, 1, 6, c2);
  } else if (wpRight === "wp_e_dict_sabre") {
    // 電子辞書プラズマセイバー
    rectPx(18, 13 + bobY, 3, 3, c1);
    rectPx(18, 4 + bobY, 3, 9, c4);
    rectPx(19, 4 + bobY, 1, 8, c2);
  } else if (wpRight === "wp_brave_pen_caliber") {
    // 勇者の光筆ペンシルカリバー（万能勇者DopaEngの聖剣）
    rectPx(17, 14 + bobY, 5, 1, c4);
    rectPx(18, 3 + bobY, 3, 11, c4);
    rectPx(19, 2 + bobY, 1, 12, c2);
    setPx(19, 14 + bobY, c1);
  }

  // アタック時の4コマ・ドット斬撃エフェクト
  if (mood === "attack" && (frame === 1 || frame === 2)) {
    const slashColor = frame === 1 ? c2 : c4;
    setPx(20, 3, slashColor);
    setPx(21, 4, slashColor);
    rectPx(22, 5, 2, 8, slashColor);
    setPx(21, 13, slashColor);
    setPx(20, 14, slashColor);
  }

  // 行単位のランレングス圧縮（同色ピクセルを結合してDOM負荷最小化）
  const mergedRects: {
    x: number;
    y: number;
    w: number;
    color: string;
  }[] = [];

  for (let y = 0; y < GRID_SIZE; y++) {
    let x = 0;
    while (x < GRID_SIZE) {
      const color = grid[y][x];
      if (!color) {
        x++;
        continue;
      }
      let w = 1;
      while (x + w < GRID_SIZE && grid[y][x + w] === color) {
        w++;
      }
      mergedRects.push({ x, y, w, color });
      x += w;
    }
  }

  return (
    <div
      className="relative flex items-center justify-center select-none pointer-events-none touch-pan-y"
      style={{ width: size, height: size }}
    >
      {/* 4色パレットのアクセント色に連動したオーラ */}
      {showAura && (
        <motion.div
          animate={{
            scale: [1, 1.12, 1],
            rotate: [0, 6, -6, 0],
          }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-2 rounded-full blur-xl opacity-50 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${c4} 0%, transparent 72%)`,
          }}
        />
      )}

      {/* 24x24 厳格4色ドット絵スプライト本体 */}
      <motion.svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        className="pixelated relative z-10 drop-shadow-[0_6px_0_rgba(0,0,0,0.85)] pointer-events-none touch-pan-y"
        animate={
          mood === "happy"
            ? { y: [0, -12, 0, -8, 0], scale: [1, 1.08, 1] }
            : mood === "attack"
            ? { x: [0, 14, -6, 0], scale: [1, 1.15, 1] }
            : mood === "evolve"
            ? {
                scale: [0.8, 1.25, 1],
                rotate: [0, -8, 8, 0],
              }
            : { y: 0 }
        }
        transition={{ duration: 0.45 }}
      >
        {mergedRects.map((r, idx) => (
          <rect
            key={`${r.x}_${r.y}_${idx}`}
            x={r.x}
            y={r.y}
            width={r.w + 0.03}
            height={1.04}
            fill={r.color}
          />
        ))}
      </motion.svg>
    </div>
  );
};
