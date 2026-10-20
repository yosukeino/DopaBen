"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CharacterGender,
  CharacterPartLoadout,
  FiveStats,
} from "@/lib/types";
import {
  COLOR_PALETTES,
  detectStatBranch,
  PaletteColors,
  resolveAutoLoadout,
} from "@/lib/characterPartsEngine";
import { EVOLUTION_STAGES } from "@/lib/vocabData";

interface PixelCharacterProps {
  gender: CharacterGender;
  stage: number; // 1 to 10
  size?: number;
  mood?: "idle" | "happy" | "attack" | "evolve";
  showAura?: boolean;
  stats?: FiveStats;
  loadout?: CharacterPartLoadout;
  animateFrames?: boolean;
}

/**
 * 24×24 高精細モジュラー・ドット絵キャラクター描画エンジン（4コマアニメーション搭載）
 * - 五角形ステータス×Lv.1〜10×男女の「全120形態オート進化」＋「8部位パーツ自由着せ替え（2,388万通り）」対応
 * - 4コマ（Frame 0, 1, 2, 3）の呼吸・瞬き・髪やマントの揺れ・翼の羽ばたき・武器の煌めき＆斬撃エフェクトをプロシージャル描画
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
}) => {
  const clampedStage = Math.max(1, Math.min(10, stage));
  const stageInfo = EVOLUTION_STAGES[clampedStage - 1];

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
  const effectiveLoadout: CharacterPartLoadout =
    loadout && loadout.mode === "custom"
      ? {
          ...autoLoadout,
          ...loadout,
        }
      : loadout?.forcedBranch
      ? resolveAutoLoadout(gender, clampedStage, loadout.forcedBranch)
      : autoLoadout;

  // カラーパレット解決
  const resolvedPalette: PaletteColors = (() => {
    const found = COLOR_PALETTES.find((p) => p.id === effectiveLoadout.palette);
    if (found && found.id !== "pal_stage_default") return found;

    // 進化段階デフォルト（Stage 1〜10 の伝統カラー）
    const hairColorsBoy = [
      "#3B281E",
      "#2A2421",
      "#1E3A8A",
      "#0F766E",
      "#991B1B",
      "#D97706",
      "#E5E7EB",
      "#7C3AED",
      "#EF4444",
      "#FFE600",
    ];
    const hairColorsGirl = [
      "#5C3A21",
      "#312E81",
      "#DB2777",
      "#0284C7",
      "#DC2626",
      "#F59E0B",
      "#F3F4F6",
      "#9333EA",
      "#F43F5E",
      "#FFF04D",
    ];
    const outfitPrimaries = [
      "#64748B",
      "#1E293B",
      "#10B981",
      "#06B6D4",
      "#E60012",
      "#F59E0B",
      "#311042",
      "#111827",
      "#99000C",
      "#FFFFFF",
    ];
    const outfitAccents = [
      "#CBD5E1",
      "#EF4444",
      "#FBBF24",
      "#22D3EE",
      "#FFE600",
      "#FEF08A",
      "#A855F7",
      "#EC4899",
      "#FF4D4D",
      "#FFE600",
    ];
    const idx = clampedStage - 1;
    return {
      id: "pal_stage_default",
      name: "進化段階デフォルト",
      hairBoy: hairColorsBoy[idx],
      hairGirl: hairColorsGirl[idx],
      hairHighlight: "#FEF08A",
      primary: outfitPrimaries[idx],
      secondary: "#0F172A",
      accent: outfitAccents[idx],
      weaponBlade:
        clampedStage === 10
          ? "#FFE600"
          : clampedStage >= 7
          ? "#00F0FF"
          : "#EF4444",
      weaponGlow: "#FFFFFF",
      wingMain: clampedStage === 10 ? "#FFE600" : "#EF4444",
      wingInner: clampedStage === 10 ? "#FFFFFF" : "#FACC15",
      aura: stageInfo.auraColor,
    };
  })();

  const skin = "#FFDCB8";
  const skinShadow = "#F3C398";
  const cheek = "#FF8FA3";
  const hair =
    gender === "boy" ? resolvedPalette.hairBoy : resolvedPalette.hairGirl;
  const hairHi = resolvedPalette.hairHighlight;
  const primary = resolvedPalette.primary;
  const secondary = resolvedPalette.secondary;
  const accent = resolvedPalette.accent;
  const blade = resolvedPalette.weaponBlade;
  const glow = resolvedPalette.weaponGlow;
  const wingMain = resolvedPalette.wingMain;
  const wingInner = resolvedPalette.wingInner;

  // 4コマのモーションオフセット計算
  // Frame 0: 基本立ち
  // Frame 1: 呼吸で1px沈む + 翼UP + 髪/マント外揺れ
  // Frame 2: 基本立ち + 武器の輝き + マント波打ち
  // Frame 3: 瞬き/ウインク + 翼DOWN
  const bobY =
    mood === "happy"
      ? frame % 2 === 1
        ? -1
        : 0
      : frame === 1
      ? 1
      : 0;
  const hairSway = frame === 1 || frame === 2 ? 1 : 0;
  const wingFlap = frame === 1 ? -1 : frame === 3 ? 1 : 0;
  const isBlink = frame === 3 && mood === "idle";
  const isGleam = frame === 2 || frame === 3;

  // 24x24 ピクセルグリッド初期化
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
  // LAYER 1: 背面装備 (BackGear: マント・マフラー・翼・浮遊剣・イコライザー・九尾)
  // =========================================================================
  const backGear = effectiveLoadout.backGear;

  if (backGear === "back_scarf") {
    // 疾風マフラー（右後ろへなびく）
    rectPx(15, 11 + bobY, 5 + hairSway, 2, accent);
    rectPx(17, 13 + bobY - hairSway, 4, 2, accent);
    setPx(21 + hairSway, 12 + bobY, glow);
  } else if (backGear === "back_cape") {
    // 怪盗の深紅マント
    rectPx(6 - hairSway, 11 + bobY, 12 + hairSway * 2, 8, wingMain);
    rectPx(7, 12 + bobY, 10, 6, secondary);
    setPx(5 - hairSway, 17 + bobY, wingMain);
    setPx(18 + hairSway, 17 + bobY, wingMain);
  } else if (backGear === "back_thruster") {
    // サイバーウイング推進器
    rectPx(5, 10 + bobY, 3, 5, "#334155");
    rectPx(16, 10 + bobY, 3, 5, "#334155");
    rectPx(3, 9 + bobY + wingFlap, 3, 2, blade);
    rectPx(18, 9 + bobY + wingFlap, 3, 2, blade);
    // ジェット噴射炎（4コマで伸縮）
    rectPx(5, 15 + bobY, 2, frame % 2 === 1 ? 3 : 2, "#00F0FF");
    rectPx(17, 15 + bobY, 2, frame % 2 === 1 ? 3 : 2, "#00F0FF");
  } else if (backGear === "back_equalizer") {
    // ネオン音波イコライザー翼（4コマでバーの高さがリズミカルに変化！）
    const eqHeights =
      frame === 0
        ? [4, 7, 5]
        : frame === 1
        ? [7, 4, 8]
        : frame === 2
        ? [5, 8, 3]
        : [8, 6, 6];
    for (let i = 0; i < 3; i++) {
      const h = eqHeights[i];
      rectPx(2 + i * 2, 14 - h + bobY, 1, h, i % 2 === 0 ? "#EC4899" : "#00F0FF");
      rectPx(21 - i * 2, 14 - h + bobY, 1, h, i % 2 === 0 ? "#EC4899" : "#00F0FF");
    }
  } else if (backGear === "back_thunder_drums") {
    // 雷神の背面雷鼓リング
    const drumPts = [
      [5, 6],
      [3, 9],
      [4, 13],
      [18, 6],
      [20, 9],
      [19, 13],
    ];
    drumPts.forEach(([dx, dy], idx) => {
      rectPx(dx, dy + bobY, 2, 2, "#FACC15");
      if ((idx + frame) % 2 === 0) {
        setPx(dx, dy + bobY, "#FFFFFF");
      }
    });
  } else if (backGear === "back_floating_swords") {
    // 無限展開・浮遊剣陣（左右に4本の光剣がホバー）
    const hover = frame % 2 === 0 ? 0 : -1;
    // 左側2本
    rectPx(3, 6 + hover, 1, 6, blade);
    setPx(3, 5 + hover, glow);
    rectPx(5, 9 - hover, 1, 6, accent);
    setPx(5, 8 - hover, glow);
    // 右側2本
    rectPx(20, 6 + hover, 1, 6, blade);
    setPx(20, 5 + hover, glow);
    rectPx(18, 9 - hover, 1, 6, accent);
    setPx(18, 8 - hover, glow);
  } else if (backGear === "back_angel_wings") {
    // 純白の熾天使ウイング
    const wy = 7 + bobY + wingFlap;
    // 左翼
    rectPx(2, wy, 5, 3, "#FFFFFF");
    rectPx(1, wy + 2, 6, 3, "#E2E8F0");
    rectPx(3, wy + 5, 4, 2, "#38BDF8");
    // 右翼
    rectPx(17, wy, 5, 3, "#FFFFFF");
    rectPx(17, wy + 2, 6, 3, "#E2E8F0");
    rectPx(17, wy + 5, 4, 2, "#38BDF8");
  } else if (backGear === "back_demon_wings" || backGear === "back_crimson_wings") {
    // 悪魔ウイング / 紅蓮アークドラゴン翼
    const wy = 6 + bobY + wingFlap;
    const wMain = backGear === "back_crimson_wings" ? "#EF4444" : "#4C1D95";
    const wSub = backGear === "back_crimson_wings" ? "#FACC15" : "#DC2626";
    // 左翼
    rectPx(1, wy, 6, 2, wMain);
    rectPx(2, wy + 2, 5, 4, wSub);
    setPx(1, wy + 4, wMain);
    setPx(3, wy + 6, wMain);
    setPx(5, wy + 7, wMain);
    // 右翼
    rectPx(17, wy, 6, 2, wMain);
    rectPx(17, wy + 2, 5, 4, wSub);
    setPx(22, wy + 4, wMain);
    setPx(20, wy + 6, wMain);
    setPx(18, wy + 7, wMain);
  } else if (backGear === "back_nine_tails") {
    // 神秘の九尾狐オーラ
    const ty = 9 + bobY + wingFlap;
    rectPx(2, ty, 5, 7, wingMain);
    rectPx(17, ty, 5, 7, wingMain);
    rectPx(1, ty + 2, 4, 4, wingInner);
    rectPx(19, ty + 2, 4, 4, wingInner);
    setPx(2, ty - 1, glow);
    setPx(21, ty - 1, glow);
  } else if (backGear === "back_seraphim_gold") {
    // 黄金六枚翼・セラフィム（上翼・中翼・下翼の3対＋背面神光輪）
    const wy = 5 + bobY + wingFlap;
    // 背面ハロ（光輪）
    rectPx(8, 2, 8, 1, "#FFE600");
    setPx(7, 3, "#FFE600");
    setPx(16, 3, "#FFE600");
    // 上対翼
    rectPx(1, wy, 6, 2, "#FFE600");
    rectPx(17, wy, 6, 2, "#FFE600");
    // 中対翼
    rectPx(0, wy + 3, 7, 2, "#FFFFFF");
    rectPx(17, wy + 3, 7, 2, "#FFFFFF");
    // 下対翼
    rectPx(2, wy + 6, 5, 3, "#EF4444");
    rectPx(17, wy + 6, 5, 3, "#EF4444");
  }

  // =========================================================================
  // LAYER 2: 後ろ髪（ロングヘア・ツインテール・ポニーテール等）
  // =========================================================================
  const hairStyle = effectiveLoadout.hairStyle;

  if (hairStyle === "hair_twintail") {
    // 王道ツインテール（4コマで毛先が揺れる）
    rectPx(5 - hairSway, 7 + bobY, 2, 7, hair);
    rectPx(17 + hairSway, 7 + bobY, 2, 7, hair);
    setPx(5 - hairSway, 14 + bobY, hairHi);
    setPx(18 + hairSway, 14 + bobY, hairHi);
  } else if (hairStyle === "hair_ponytail") {
    // 疾風ポニーテール（右後ろへ跳ねる）
    rectPx(16, 6 + bobY - hairSway, 4, 3, hair);
    rectPx(18, 8 + bobY - hairSway, 3, 3, hair);
  } else if (hairStyle === "hair_drill") {
    // お嬢様ツイン縦ロール
    rectPx(5, 7 + bobY, 3, 8, hair);
    rectPx(16, 7 + bobY, 3, 8, hair);
    setPx(6, 9 + bobY, hairHi);
    setPx(6, 12 + bobY, hairHi);
    setPx(17, 9 + bobY, hairHi);
    setPx(17, 12 + bobY, hairHi);
  } else if (hairStyle === "hair_long_sage") {
    // 星詠み大賢者ロング
    rectPx(6, 7 + bobY, 12, 9, hair);
    rectPx(5 - hairSway, 11 + bobY, 14 + hairSway * 2, 5, hair);
  } else if (hairStyle === "hair_odango") {
    // ネオ中華お団子ツイン
    rectPx(5, 4 + bobY, 3, 3, hair);
    rectPx(16, 4 + bobY, 3, 3, hair);
    setPx(5, 4 + bobY, accent);
    setPx(18, 4 + bobY, accent);
  }

  // =========================================================================
  // LAYER 3: ボディ・衣装・脚・腕
  // =========================================================================
  const outfit = effectiveLoadout.outfit;

  // 脚＆ブーツ（地面 y=18..21 に接地して安定感を出す）
  if (
    gender === "girl" &&
    (outfit === "outfit_uniform" ||
      outfit === "outfit_idol_rock" ||
      outfit === "outfit_sage")
  ) {
    // スカート＋ソックス＋シューズ
    rectPx(8, 17 + bobY, 8, 2, accent);
    rectPx(9, 19, 2, 1, skin);
    rectPx(13, 19, 2, 1, skin);
    rectPx(9, 20, 2, 2, secondary);
    rectPx(13, 20, 2, 2, secondary);
  } else {
    // パンツ＋アーマーブーツ
    rectPx(9, 18, 2, 2, secondary);
    rectPx(13, 18, 2, 2, secondary);
    rectPx(8, 20, 3, 2, accent);
    rectPx(13, 20, 3, 2, accent);
  }

  // トルソー（胴体 y=12..17）
  rectPx(8, 12 + bobY, 8, 6, primary);

  // 衣装別のディテール装飾
  if (outfit === "outfit_jersey") {
    // 部屋着ジャージ（2本ライン）
    rectPx(8, 12 + bobY, 1, 6, "#FFFFFF");
    rectPx(15, 12 + bobY, 1, 6, "#FFFFFF");
    rectPx(10, 12 + bobY, 4, 2, "#E2E8F0");
  } else if (outfit === "outfit_uniform") {
    // 学園ブレザー制服（白シャツ＋赤ネクタイ/リボン）
    rectPx(10, 12 + bobY, 4, 3, "#FFFFFF");
    rectPx(11, 13 + bobY, 2, 3, "#EF4444");
  } else if (outfit === "outfit_hoodie") {
    // ストリートパーカー
    rectPx(9, 12 + bobY, 6, 2, accent);
    rectPx(10, 14 + bobY, 1, 3, "#FFFFFF");
    rectPx(13, 14 + bobY, 1, 3, "#FFFFFF");
  } else if (outfit === "outfit_cyber") {
    // ネオンサイバースーツ
    rectPx(8, 13 + bobY, 8, 1, "#00F0FF");
    rectPx(11, 14 + bobY, 2, 3, "#00F0FF");
  } else if (outfit === "outfit_phantom") {
    // 怪盗ロングコート
    rectPx(7, 16 + bobY, 10, 3, primary);
    rectPx(11, 12 + bobY, 2, 5, "#EF4444");
    setPx(10, 14 + bobY, "#FACC15");
    setPx(13, 14 + bobY, "#FACC15");
  } else if (outfit === "outfit_shinobi") {
    // 神速の闇忍装束（クロスベルト＆マフラー襟）
    rectPx(8, 12 + bobY, 8, 2, "#EF4444");
    setPx(9, 14 + bobY, accent);
    setPx(10, 15 + bobY, accent);
    setPx(14, 14 + bobY, accent);
    setPx(13, 15 + bobY, accent);
  } else if (outfit === "outfit_sage") {
    // 星詠み大魔導ローブ
    rectPx(7, 15 + bobY, 10, 4, primary);
    rectPx(10, 12 + bobY, 4, 6, accent);
    setPx(11, 14 + bobY, "#FFE600");
    setPx(12, 14 + bobY, "#FFE600");
  } else if (outfit === "outfit_idol_rock") {
    // 超音撃ステージ衣装
    rectPx(9, 12 + bobY, 6, 2, "#EC4899");
    rectPx(8, 15 + bobY, 8, 1, "#00F0FF");
    rectPx(10, 13 + bobY, 4, 2, "#FFE600");
  } else if (outfit === "outfit_paladin") {
    // 白銀の聖騎士アーマー
    rectPx(7, 12 + bobY, 2, 3, "#E2E8F0");
    rectPx(15, 12 + bobY, 2, 3, "#E2E8F0");
    rectPx(11, 12 + bobY, 2, 6, "#FFE600");
    rectPx(9, 14 + bobY, 6, 1, "#10B981");
  } else if (outfit === "outfit_berserker") {
    // 黒炎の狂戦士メイル
    rectPx(7, 12 + bobY, 2, 2, "#EF4444");
    rectPx(15, 12 + bobY, 2, 2, "#EF4444");
    rectPx(9, 13 + bobY, 6, 2, "#991B1B");
    rectPx(10, 15 + bobY, 4, 2, "#FACC15");
  } else if (outfit === "outfit_overlord") {
    // アークロード覇王鎧
    rectPx(6, 11 + bobY, 3, 3, accent);
    rectPx(15, 11 + bobY, 3, 3, accent);
    rectPx(10, 13 + bobY, 4, 4, "#FFE600");
    rectPx(11, 14 + bobY, 2, 2, "#EF4444");
  } else if (outfit === "outfit_god") {
    // 語彙神の黄金神衣
    rectPx(6, 11 + bobY, 3, 3, "#FFE600");
    rectPx(15, 11 + bobY, 3, 3, "#FFE600");
    rectPx(8, 12 + bobY, 8, 6, "#FFFFFF");
    rectPx(10, 12 + bobY, 4, 6, "#FFE600");
    rectPx(11, 13 + bobY, 2, 3, "#E60012");
  }

  // 両腕＆手（happy時はバンザイ！）
  const armY = mood === "happy" && frame % 2 === 1 ? 10 + bobY : 12 + bobY;
  rectPx(6, armY, 2, 4, primary);
  rectPx(16, armY, 2, 4, primary);
  rectPx(6, armY + 4, 2, 1, skin);
  rectPx(16, armY + 4, 2, 1, skin);

  // =========================================================================
  // LAYER 4: 頭部・顔・表情・瞳 (EyeStyle + 4コマ瞬き)
  // =========================================================================
  rectPx(8, 6 + bobY, 8, 6, skin);
  rectPx(9, 11 + bobY, 6, 1, skinShadow);
  // 耳
  setPx(7, 8 + bobY, skin);
  setPx(7, 9 + bobY, skinShadow);
  setPx(16, 8 + bobY, skin);
  setPx(16, 9 + bobY, skinShadow);

  // ほっぺ
  setPx(8, 10 + bobY, cheek);
  setPx(15, 10 + bobY, cheek);

  // 瞳の描画 (EyeStyle)
  const eyeStyle = effectiveLoadout.eyeStyle;
  if (isBlink) {
    // Frame 3: 瞬き（横線）
    rectPx(9, 9 + bobY, 2, 1, "#1E1B18");
    rectPx(13, 9 + bobY, 2, 1, "#1E1B18");
  } else if (mood === "happy" || mood === "evolve") {
    // 歓喜のキラキラ目
    setPx(9, 8 + bobY, "#1E1B18");
    setPx(10, 9 + bobY, "#1E1B18");
    setPx(14, 8 + bobY, "#1E1B18");
    setPx(13, 9 + bobY, "#1E1B18");
  } else {
    let leftEyeColor = "#1E1B18";
    let rightEyeColor = "#1E1B18";
    if (eyeStyle === "eye_determined") {
      leftEyeColor = "#1E1B18";
      rightEyeColor = "#1E1B18";
      // キリッとした眉毛
      setPx(9, 7 + bobY, hair);
      setPx(10, 8 + bobY, hair);
      setPx(14, 7 + bobY, hair);
      setPx(13, 8 + bobY, hair);
    } else if (eyeStyle === "eye_cool") {
      leftEyeColor = "#312E81";
      rightEyeColor = "#312E81";
      rectPx(9, 7 + bobY, 2, 1, hair);
      rectPx(13, 7 + bobY, 2, 1, hair);
    } else if (eyeStyle === "eye_sparkle") {
      leftEyeColor = "#DB2777";
      rightEyeColor = "#DB2777";
    } else if (eyeStyle === "eye_cyber") {
      leftEyeColor = "#00F0FF";
      rightEyeColor = "#00F0FF";
    } else if (eyeStyle === "eye_oddeye") {
      leftEyeColor = "#EF4444";
      rightEyeColor = "#00F0FF";
    } else if (eyeStyle === "eye_crimson") {
      leftEyeColor = "#EF4444";
      rightEyeColor = "#EF4444";
    } else if (eyeStyle === "eye_god") {
      leftEyeColor = "#FFE600";
      rightEyeColor = "#FFE600";
    }

    rectPx(9, 8 + bobY, 2, 2, leftEyeColor);
    rectPx(13, 8 + bobY, 2, 2, rightEyeColor);
    // ハイライト白ドット
    setPx(9, 8 + bobY, "#FFFFFF");
    setPx(13, 8 + bobY, "#FFFFFF");
  }

  // 口元
  if (mood === "happy" || mood === "attack" || mood === "evolve") {
    rectPx(11, 10 + bobY, 2, 1, "#E60012");
  } else {
    rectPx(11, 10 + bobY, 2, 1, "#C97A63");
  }

  // =========================================================================
  // LAYER 5: 前髪・トップヘア (HairStyle)
  // =========================================================================
  // ベース頭頂部
  rectPx(7, 4 + bobY, 10, 2, hair);
  rectPx(8, 3 + bobY, 8, 1, hair);
  // 前髪＆サイドロック
  setPx(7, 6 + bobY, hair);
  setPx(7, 7 + bobY, hair);
  setPx(16, 6 + bobY, hair);
  setPx(16, 7 + bobY, hair);
  setPx(9, 6 + bobY, hair);
  setPx(11, 6 + bobY, hair);
  setPx(12, 6 + bobY, hair);
  setPx(14, 6 + bobY, hair);

  if (hairStyle === "hair_spiky") {
    // ツンツンヒーロー
    setPx(7, 3 + bobY, hair);
    setPx(10, 2 + bobY, hair);
    setPx(13, 2 + bobY, hair);
    setPx(16, 3 + bobY, hair);
  } else if (hairStyle === "hair_bob") {
    // ふんわりショートボブ
    rectPx(6, 5 + bobY, 1, 5, hair);
    rectPx(17, 5 + bobY, 1, 5, hair);
  } else if (hairStyle === "hair_wolf") {
    // クールウルフ
    rectPx(6, 5 + bobY, 1, 6, hair);
    rectPx(17, 5 + bobY, 1, 6, hair);
    setPx(8, 2 + bobY, hair);
    setPx(15, 2 + bobY, hair);
  } else if (hairStyle === "hair_cyber_mesh") {
    // ネオンアシメバング（前髪にネオンメッシュ！）
    rectPx(10, 5 + bobY, 3, 2, accent);
    setPx(11, 7 + bobY, accent);
  } else if (hairStyle === "hair_samurai") {
    // 剣豪サムライ結い（頭頂部マゲ＋結い紐）
    rectPx(10, 1 + bobY, 4, 2, hair);
    rectPx(11, 3 + bobY, 2, 1, accent);
  } else if (hairStyle === "hair_wild_flame" || hairStyle === "hair_god_aura") {
    // 紅蓮バーサーカー逆毛 / 超覚醒・神逆立ちヘア
    const spikeColor = hairStyle === "hair_god_aura" ? "#FFE600" : hair;
    rectPx(7, 2 + bobY, 2, 2, spikeColor);
    rectPx(10, 1 + bobY - hairSway, 4, 2, spikeColor);
    rectPx(15, 2 + bobY, 2, 2, spikeColor);
    setPx(9, 3 + bobY, hairHi);
    setPx(14, 3 + bobY, hairHi);
  }

  // =========================================================================
  // LAYER 6: 頭・顔装備 (Headgear)
  // =========================================================================
  const headgear = effectiveLoadout.headgear;

  if (headgear === "head_ahoge") {
    // 寝癖ピョコ毛（4コマでピョコピョコ動く）
    setPx(11, 2 + bobY, hair);
    setPx(12 + hairSway, 1 + bobY, hair);
    setPx(13 + hairSway, 1 + bobY, hair);
  } else if (headgear === "head_ribbon") {
    // ツインリボン飾り
    rectPx(5, 5 + bobY, 2, 2, "#EF4444");
    rectPx(17, 5 + bobY, 2, 2, "#EF4444");
  } else if (headgear === "head_glasses") {
    // 知略のインテリ眼鏡
    rectPx(8, 8 + bobY, 4, 1, "#38BDF8");
    rectPx(12, 8 + bobY, 4, 1, "#38BDF8");
    if (isGleam) {
      setPx(9, 8 + bobY, "#FFFFFF");
      setPx(13, 8 + bobY, "#FFFFFF");
    }
  } else if (headgear === "head_headphones") {
    // ネオンヘッドホン
    rectPx(7, 3 + bobY, 10, 1, "#E2E8F0");
    rectPx(6, 7 + bobY, 2, 3, "#EC4899");
    rectPx(16, 7 + bobY, 2, 3, "#EC4899");
    setPx(6, 8 + bobY, "#00F0FF");
    setPx(17, 8 + bobY, "#00F0FF");
  } else if (headgear === "head_ninja_band") {
    // 疾風の忍額当て
    rectPx(7, 5 + bobY, 10, 2, "#0F172A");
    rectPx(10, 5 + bobY, 4, 1, "#94A3B8");
    // 後ろになびくハチマキ紐
    rectPx(17, 5 + bobY - hairSway, 3, 1, "#EF4444");
  } else if (headgear === "head_visor") {
    // サイバースカウター
    rectPx(8, 7 + bobY, 8, 2, "#00F0FF");
    rectPx(9, 8 + bobY, 6, 1, "#FFFFFF");
  } else if (headgear === "head_phantom_mask") {
    // 怪盗ファントムマスク
    rectPx(8, 7 + bobY, 8, 2, "#F8FAFC");
    setPx(7, 6 + bobY, "#EF4444");
    setPx(16, 6 + bobY, "#EF4444");
    setPx(9, 8 + bobY, "#EF4444");
    setPx(14, 8 + bobY, "#EF4444");
  } else if (headgear === "head_wizard_hat") {
    // 星詠み魔導クラウン
    rectPx(6, 3 + bobY, 12, 2, "#312E81");
    rectPx(8, 1 + bobY, 8, 2, "#4C1D95");
    rectPx(10, 0, 4, 1, "#6D28D9");
    rectPx(11, 3 + bobY, 2, 1, "#FFE600");
  } else if (headgear === "head_valkyrie_helm") {
    // 聖騎士ヴァルキリー翼冠
    rectPx(5, 3 + bobY, 2, 3, "#FFFFFF");
    rectPx(6, 2 + bobY, 2, 2, "#38BDF8");
    rectPx(17, 3 + bobY, 2, 3, "#FFFFFF");
    rectPx(16, 2 + bobY, 2, 2, "#38BDF8");
    rectPx(10, 4 + bobY, 4, 2, "#FFE600");
  } else if (headgear === "head_demon_horns") {
    // 紅蓮覇王の龍角
    rectPx(6, 2 + bobY, 2, 3, "#EF4444");
    rectPx(5, 1 + bobY, 2, 2, "#FACC15");
    rectPx(16, 2 + bobY, 2, 3, "#EF4444");
    rectPx(17, 1 + bobY, 2, 2, "#FACC15");
  } else if (headgear === "head_god_crown") {
    // 語彙神の黄金王冠＆光輪
    rectPx(8, 1 + bobY, 8, 3, "#FFE600");
    setPx(8, 0 + bobY, "#FFFFFF");
    setPx(11, 0 + bobY, "#FFFFFF");
    setPx(12, 0 + bobY, "#FFFFFF");
    setPx(15, 0 + bobY, "#FFFFFF");
    rectPx(11, 2 + bobY, 2, 1, "#E60012");
  }

  // =========================================================================
  // LAYER 7: 左手サブ装備 (WeaponLeft: 画面左側 x=1..6)
  // =========================================================================
  const wpLeft = effectiveLoadout.weaponLeft;
  const subHover = frame % 2 === 1 ? -1 : 0;

  if (wpLeft === "sub_note_shield") {
    // 必勝単語帳ボード
    rectPx(3, 12 + bobY, 3, 4, "#F8FAFC");
    rectPx(3, 12 + bobY, 1, 4, "#EF4444");
    setPx(4, 13 + bobY, "#1E293B");
  } else if (wpLeft === "sub_grimoire") {
    // 浮遊する古代魔導書
    rectPx(2, 10 + subHover, 4, 4, "#6D28D9");
    rectPx(3, 11 + subHover, 2, 2, "#FEF08A");
    if (isGleam) setPx(3, 9 + subHover, "#00F0FF");
  } else if (wpLeft === "sub_sonic_amp") {
    // 重低音スピーカー宝珠
    rectPx(2, 10 + subHover, 4, 4, "#18181B");
    rectPx(3, 11 + subHover, 2, 2, "#EC4899");
    if (frame % 2 === 1) {
      setPx(1, 9 + subHover, "#00F0FF");
      setPx(1, 14 + subHover, "#00F0FF");
    }
  } else if (wpLeft === "sub_aegis_shield") {
    // 聖盾イージス
    rectPx(2, 11 + bobY, 5, 6, "#E2E8F0");
    rectPx(3, 12 + bobY, 3, 4, "#10B981");
    rectPx(4, 12 + bobY, 1, 4, "#FFE600");
    rectPx(3, 13 + bobY, 3, 1, "#FFE600");
  } else if (wpLeft === "sub_dual_kodachi") {
    // 逆手・二刀流小太刀
    rectPx(4, 14 + bobY, 2, 1, "#94A3B8");
    rectPx(1, 15 + bobY, 4, 1, "#00F0FF");
    rectPx(0, 16 + bobY, 3, 1, "#FFFFFF");
  } else if (wpLeft === "sub_cyber_drone") {
    // 電脳ビットドローン
    rectPx(2, 7 + subHover, 4, 3, "#06B6D4");
    rectPx(3, 8 + subHover, 2, 1, "#FFFFFF");
    setPx(3, 10 + subHover, "#FFE600");
  } else if (wpLeft === "sub_dragon_claw") {
    // 紅蓮の竜爪ガントレット
    rectPx(3, 12 + bobY, 4, 4, "#DC2626");
    setPx(2, 13 + bobY, "#FFE600");
    setPx(2, 15 + bobY, "#FFE600");
  } else if (wpLeft === "sub_dual_laser") {
    // 二刀流・紅蓮レーザー刃
    rectPx(4, 13 + bobY, 2, 2, "#475569");
    rectPx(3, 7 + bobY, 2, 6, "#FF007F");
    rectPx(3, 6 + bobY, 1, 6, "#FFFFFF");
  } else if (wpLeft === "sub_god_orb") {
    // 森羅万象の黄金宝珠
    rectPx(2, 9 + subHover, 4, 4, "#FFE600");
    rectPx(3, 10 + subHover, 2, 2, "#FFFFFF");
    setPx(3, 8 + subHover, "#EF4444");
    setPx(3, 13 + subHover, "#00F0FF");
  }

  // =========================================================================
  // LAYER 8: 右手メイン武器 (WeaponRight: 画面右側 x=17..23) ＋ 4コマ斬撃エフェクト
  // =========================================================================
  const wpRight = effectiveLoadout.weaponRight;
  const gleamColor = isGleam ? "#FFFFFF" : blade;

  if (wpRight === "wp_pencil_dagger") {
    // 必勝ペンシルダガー
    rectPx(18, 11 + bobY, 2, 5, "#FACC15");
    rectPx(18, 9 + bobY, 2, 2, "#FDE68A");
    setPx(18, 8 + bobY, "#1E293B");
    rectPx(18, 16 + bobY, 2, 1, "#F472B6");
  } else if (wpRight === "wp_katana") {
    // 名刀・紫電ブレード
    rectPx(18, 14 + bobY, 2, 2, "#FACC15");
    rectPx(19, 6 + bobY, 1, 8, blade);
    rectPx(20, 5 + bobY, 1, 7, gleamColor);
  } else if (wpRight === "wp_sonic_mic") {
    // 超音撃マイクランス
    rectPx(19, 8 + bobY, 1, 9, "#E2E8F0");
    rectPx(18, 5 + bobY, 3, 3, "#EC4899");
    rectPx(19, 6 + bobY, 1, 1, "#00F0FF");
  } else if (wpRight === "wp_arcane_staff") {
    // 星結晶の魔導杖
    rectPx(19, 7 + bobY, 1, 12, "#92400E");
    rectPx(18, 4 + bobY, 3, 3, "#A855F7");
    setPx(19, 5 + bobY, isGleam ? "#FFFFFF" : "#FFE600");
  } else if (wpRight === "wp_laser_sabre") {
    // ネオンプラズマセイバー
    rectPx(18, 14 + bobY, 2, 3, "#64748B");
    rectPx(18, 5 + bobY, 2, 9, "#00F0FF");
    rectPx(19, 5 + bobY, 1, 8, "#FFFFFF");
  } else if (wpRight === "wp_greatsword") {
    // 聖騎士の白銀大剣
    rectPx(17, 14 + bobY, 5, 1, "#FFE600");
    rectPx(18, 4 + bobY, 3, 10, "#E2E8F0");
    rectPx(19, 3 + bobY, 1, 11, gleamColor);
  } else if (wpRight === "wp_thunder_spear") {
    // 雷神の稲妻スピア
    rectPx(19, 6 + bobY, 1, 13, "#475569");
    rectPx(18, 3 + bobY, 3, 3, "#FACC15");
    setPx(19, 2 + bobY, "#FFFFFF");
  } else if (wpRight === "wp_shuriken_chakram") {
    // 巨大風魔チャクラム（4コマで回転！）
    rectPx(18, 10 + bobY, 5, 5, "#00F0FF");
    rectPx(19, 11 + bobY, 3, 3, "#0F172A");
    if (frame % 2 === 0) {
      setPx(20, 9 + bobY, "#FFFFFF");
      setPx(20, 15 + bobY, "#FFFFFF");
    } else {
      setPx(17, 12 + bobY, "#FFFFFF");
      setPx(23, 12 + bobY, "#FFFFFF");
    }
  } else if (wpRight === "wp_demon_buster") {
    // 紅蓮の断罪バスター剣
    rectPx(17, 14 + bobY, 5, 1, "#FACC15");
    rectPx(18, 3 + bobY, 4, 11, "#991B1B");
    rectPx(19, 4 + bobY, 2, 9, "#EF4444");
    setPx(20, 5 + bobY, isGleam ? "#FFFFFF" : "#FACC15");
  } else if (wpRight === "wp_scythe") {
    // 紅蓮死神の大鎌
    rectPx(19, 4 + bobY, 1, 15, "#334155");
    rectPx(15, 3 + bobY, 7, 2, "#EF4444");
    rectPx(14, 5 + bobY, 3, 1, "#FFFFFF");
  } else if (wpRight === "wp_excalibur") {
    // 神剣エクスカリバーΩ
    rectPx(17, 14 + bobY, 6, 1, "#FFE600");
    rectPx(18, 2 + bobY, 3, 12, "#FFE600");
    rectPx(19, 1 + bobY, 1, 13, "#FFFFFF");
    setPx(19, 14 + bobY, "#E60012");
  }

  // アタック時の4コマ・ドット斬撃エフェクト（三日月スラッシュ軌跡）
  if (mood === "attack" && (frame === 1 || frame === 2)) {
    const slashColor = frame === 1 ? "#FFFFFF" : "#FFE600";
    setPx(20, 3, slashColor);
    setPx(21, 4, slashColor);
    rectPx(22, 5, 2, 8, slashColor);
    setPx(21, 13, slashColor);
    setPx(20, 14, slashColor);
  }

  // 行単位のランレングス圧縮（隣接同色ピクセルを結合して高速＆隙間ゼロ描画）
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
      {/* 進化段階＆パレットに応じた背景オーラ */}
      {showAura && (
        <motion.div
          animate={{
            scale: [1, 1.12, 1],
            rotate: [0, 6, -6, 0],
          }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-2 rounded-full blur-xl opacity-55 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${resolvedPalette.aura} 0%, transparent 72%)`,
          }}
        />
      )}

      {/* Stage 4以上の星屑・稲妻ピクセルパーティクル */}
      {showAura && clampedStage >= 4 && (
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ y: [0, -10, 0], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="w-2 h-2 absolute top-3 left-3"
            style={{ backgroundColor: resolvedPalette.aura }}
          />
          <motion.div
            animate={{ y: [0, -14, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: 0.4 }}
            className="w-2 h-2 absolute bottom-4 right-3"
            style={{ backgroundColor: "#FFE600" }}
          />
          {clampedStage >= 8 && (
            <motion.div
              animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.1, repeat: Infinity }}
              className="w-2.5 h-2.5 absolute top-2 right-5 bg-[#E60012]"
            />
          )}
        </div>
      )}

      {/* 24x24 4コマ・ドット絵スプライト本体 */}
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
                filter: [
                  "brightness(1)",
                  "brightness(2.5)",
                  "brightness(1)",
                ],
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
