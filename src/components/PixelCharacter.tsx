"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CharacterGender,
  CharacterPartLoadout,
  FiveStats,
} from "@/lib/types";
import {
  BOY_HAIR_DEFS,
  GIRL_HAIR_DEFS,
  HairDef,
  resolveEffectiveLoadout,
  UniformDef,
  UNIFORM_DEFS,
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
  customPalettes?: any[]; // legacy compatibility
}

// --- 基本パレット定数（フェアルーン2共通造形） ---
const WHT = "#FFFFFF";
const EYE_BLK = "#111827";
const MOUTH_RED = "#DC2626";
const SKIN_BASE = "#FFE4C4";
const SKIN_DARK = "#F3BA8B";

/**
 * 【フェアルーン2世界観準拠 ドット絵キャラクター描画エンジン】
 * - 24×24 ピクセル
 * - 瞳: まつ毛や過剰なハイライトのない、つぶらな縦2ドット黒スリット目 (x=9, y=8..9 / x=14, y=8..9)
 * - 口: 目の下2行あけた中央にあいた赤口 (x=11..12, y=11)
 * - シルエット: 黒の途切れ途切れ輪郭線を廃し、髪・衣装自体の美しいドット丸みで形成
 * - 3つの軸:
 *   1. レベル開放の飾り (Lv.1〜5 ファンタジー進化)
 *   2. 制服 (20校)
 *   3. 髪型 (男女別 各10選 色×カットセット)
 */
export const PixelCharacter: React.FC<PixelCharacterProps> = ({
  gender,
  stage,
  size = 136,
  mood = "idle",
  showAura = true,
  loadout,
  animateFrames = true,
}) => {
  const clampedStage = Math.max(1, Math.min(10, stage));

  // 4コマアニメーション (0 -> 1 -> 2 -> 3)
  const [frame, setFrame] = useState<0 | 1 | 2 | 3>(0);

  useEffect(() => {
    if (!animateFrames) {
      setFrame(0);
      return;
    }
    const intervalMs =
      mood === "attack" || mood === "happy" || mood === "evolve" ? 130 : 250;
    const timer = setInterval(() => {
      setFrame((prev) => ((prev + 1) % 4) as 0 | 1 | 2 | 3);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [animateFrames, mood]);

  // ロードアウト解決（髪型、制服、レベル飾り）
  const effective = resolveEffectiveLoadout(gender, clampedStage, loadout);
  const isGirl = gender === "girl";
  const hairDef: HairDef = effective.hair;
  const uniDef: UniformDef = effective.uniform;
  const auraLevel: number = effective.auraLevel;

  // 4コマモーションのオフセット計算
  // Frame 0: 基本立ち
  // Frame 1: 呼吸で1px沈む (bob = 1) + 揺れ
  // Frame 2: 瞬き (blink)
  // Frame 3: 呼吸で1px浮く (bob = -1) + 笑顔/口開け
  const bob =
    mood === "happy"
      ? frame % 2 === 1
        ? -1
        : 1
      : frame === 1
      ? 1
      : frame === 3
      ? -1
      : 0;
  const sway = frame === 1 || frame === 2 ? 1 : 0;

  // 24x24 グリッド生成
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
  // 1. レベル開放の飾り（Lv.1〜5 ファンタジー進化）
  // =========================================================================
  if (auraLevel >= 2) {
    if (auraLevel === 2) {
      // Lv.2: 英気覚醒（きらめく星屑パーティクル）
      const stars = [
        [3, 4],
        [20, 6],
        [4, 15],
        [19, 14],
      ];
      const starCol = isGirl ? "#FACC15" : "#38BDF8";
      stars.forEach(([sx, sy], i) => {
        if ((i + frame) % 2 === 0) {
          setPx(sx, sy + bob, starCol);
          setPx(sx + 1, sy + bob, WHT);
        }
      });
    } else if (auraLevel === 3) {
      // Lv.3: 英知解放（頭上の知性リング & 浮遊する文具ビット）
      const hOff = frame % 2 === 0 ? 1 : -1;
      // 左ビット（単語帳・クリスタル）
      rectPx(2, 8 + hOff, 2, 3, WHT);
      setPx(2, 8 + hOff, "#38BDF8");
      // 右ビット（光るペンビット）
      rectPx(20, 7 - hOff, 2, 4, "#FACC15");
      setPx(20, 7 - hOff, WHT);
      // 頭上の知性光輪
      rectPx(9, 0 + bob, 6, 1, "#FACC15");
    } else if (auraLevel === 4) {
      // Lv.4: 属性共鳴（激しく揺らめくオーラ炎 & 背後の光の双剣）
      const flameCol = isGirl ? "#F43F5E" : "#06B6D4";
      const flameCol2 = isGirl ? "#FB7185" : "#22D3EE";
      const flY = [11, 14, 17];
      flY.forEach((fy, idx) => {
        const fxL = 3 - ((frame + idx) % 2 === 0 ? 1 : 0);
        const fxR = 20 + ((frame + idx) % 2 === 0 ? 1 : 0);
        setPx(fxL, fy + bob, flameCol);
        setPx(fxL + 1, fy + bob, flameCol2);
        setPx(fxR, fy + bob, flameCol);
        setPx(fxR - 1, fy + bob, flameCol2);
      });
      // 背後の双剣
      rectPx(3, 5 + bob, 1, 6, WHT);
      rectPx(20, 5 + bob, 1, 6, WHT);
    } else if (auraLevel >= 5) {
      // Lv.5: 全知超越のゴッド（神聖光輪 ＆ 黄金の六翼光翼）
      const wy = 4 + bob + (frame % 2 === 1 ? 1 : 0);
      const wingCol = "#FACC15";
      const wingLite = "#FEF08A";
      // 神聖な光輪
      rectPx(8, 0 + bob, 8, 1, wingCol);
      setPx(7, 1 + bob, wingCol);
      setPx(16, 1 + bob, wingCol);
      // 左光翼
      rectPx(1, wy, 5, 2, wingCol);
      rectPx(2, wy + 2, 4, 3, wingLite);
      setPx(0, wy + 2, wingCol);
      setPx(1, wy + 5, wingCol);
      // 右光翼
      rectPx(18, wy, 5, 2, wingCol);
      rectPx(18, wy + 2, 4, 3, wingLite);
      setPx(23, wy + 2, wingCol);
      setPx(22, wy + 5, wingCol);
      // オーラ粒子
      if (frame % 2 === 0) {
        setPx(4, 18, WHT);
        setPx(19, 18, WHT);
      }
    }
  }

  // =========================================================================
  // 2. 髪型（後ろ髪）
  // =========================================================================
  const hBase = hairDef.base;
  const hDark = hairDef.dark;
  const hLite = hairDef.lite;
  const hType = hairDef.type;

  if (isGirl) {
    // 女子頭部ベース（丸みのあるシルエット）
    rectPx(8, 2 + bob, 8, 1, hDark);
    rectPx(7, 3 + bob, 10, 2, hBase);
    rectPx(6, 4 + bob, 12, 3, hBase);
    rectPx(8, 3 + bob, 8, 1, hLite); // 天使の輪・艶

    if (hType === "bob") {
      rectPx(5, 6 + bob, 3, 6, hBase);
      rectPx(16, 6 + bob, 3, 6, hBase);
      rectPx(5, 9 + bob, 1, 3, hDark);
      rectPx(18, 9 + bob, 1, 3, hDark);
      setPx(6, 12 + bob, hDark);
      setPx(17, 12 + bob, hDark);
    } else if (hType === "twintail") {
      rectPx(4 - sway, 5 + bob, 2, 2, uniDef.acc);
      rectPx(18 + sway, 5 + bob, 2, 2, uniDef.acc);
      rectPx(3 - sway, 7 + bob, 3, 6, hBase);
      rectPx(18 + sway, 7 + bob, 3, 6, hBase);
      setPx(3 - sway, 12 + bob, hDark);
      setPx(20 + sway, 12 + bob, hDark);
    } else if (hType === "ponytail") {
      rectPx(15, 4 + bob - sway, 2, 2, uniDef.acc);
      rectPx(16, 5 + bob - sway, 4, 4, hBase);
      rectPx(18, 8 + bob - sway, 3, 4, hBase);
      setPx(20, 11 + bob - sway, hDark);
    } else if (hType === "long") {
      rectPx(5, 6 + bob, 3, 9, hBase);
      rectPx(16, 6 + bob, 3, 9, hBase);
      setPx(5, 14 + bob, hDark);
      setPx(18, 14 + bob, hDark);
    } else if (hType === "drill") {
      rectPx(5, 6 + bob, 3, 7, hBase);
      rectPx(16, 6 + bob, 3, 7, hBase);
      setPx(6, 8 + bob, hLite);
      setPx(17, 8 + bob, hLite);
    } else if (hType === "odango") {
      rectPx(4, 3 + bob, 3, 3, hBase);
      rectPx(17, 3 + bob, 3, 3, hBase);
      setPx(5, 3 + bob, uniDef.acc);
      setPx(18, 3 + bob, uniDef.acc);
    } else {
      // halfup / wolf / sidetail / wave
      rectPx(5, 6 + bob, 3, 7, hBase);
      rectPx(16, 6 + bob, 3, 7, hBase);
      setPx(6, 12 + bob, hDark);
      setPx(17, 12 + bob, hDark);
    }
  } else {
    // 男子頭部ベース
    rectPx(8, 2 + bob, 8, 1, hDark);
    rectPx(7, 3 + bob, 10, 3, hBase);
    rectPx(6, 4 + bob, 12, 3, hBase);
    rectPx(8, 3 + bob, 8, 1, hLite);

    if (hType === "spiky" || hType === "spiky2" || hType === "crown") {
      setPx(8, 1 + bob, hBase);
      setPx(13, 1 + bob, hBase);
      if (hType === "crown") {
        setPx(10, 0 + bob, hLite);
        setPx(11, 0 + bob, hLite);
      }
    } else if (hType === "mush" || hType === "mush2") {
      rectPx(7, 6 + bob, 10, 1, hBase);
    }
    rectPx(6, 6 + bob, 1, 3, hBase);
    rectPx(17, 6 + bob, 1, 3, hBase);
  }

  // =========================================================================
  // 3. 顔の肌（フェアルーン2の明るい肌）
  // =========================================================================
  rectPx(8, 6 + bob, 8, 5, SKIN_BASE);
  rectPx(9, 11 + bob, 6, 1, SKIN_DARK);
  if (isGirl) {
    // おでこのセンター抜け（可憐な前髪の透け感）
    setPx(11, 5 + bob, SKIN_BASE);
    setPx(12, 5 + bob, SKIN_BASE);
  } else {
    // 男子の耳
    setPx(7, 8 + bob, SKIN_BASE);
    setPx(16, 8 + bob, SKIN_BASE);
  }

  // =========================================================================
  // 4. 瞳（【フェアルーン2】完全準拠の縦2ドット黒スリット目）
  // =========================================================================
  if (frame === 2 && mood === "idle") {
    // まばたき（下段1ドットのみ）
    setPx(9, 9 + bob, EYE_BLK);
    setPx(14, 9 + bob, EYE_BLK);
  } else if (mood === "happy" || frame === 3) {
    // 笑顔 / 驚き（上段1ドット）
    setPx(9, 8 + bob, EYE_BLK);
    setPx(14, 8 + bob, EYE_BLK);
  } else {
    // 通常時: 純粋な縦2ドット
    setPx(9, 8 + bob, EYE_BLK);
    setPx(9, 9 + bob, EYE_BLK);
    setPx(14, 8 + bob, EYE_BLK);
    setPx(14, 9 + bob, EYE_BLK);
  }

  if (!isGirl) {
    // 男子の凛々しい眉
    setPx(9, 7 + bob, hDark);
    setPx(14, 7 + bob, hDark);
  }

  // =========================================================================
  // 5. 口（フェアルーン2のあいた赤口）
  // =========================================================================
  if (mood === "happy" || frame === 3) {
    rectPx(11, 10 + bob, 2, 2, MOUTH_RED);
  } else {
    setPx(11, 11 + bob, MOUTH_RED);
    setPx(12, 11 + bob, MOUTH_RED);
  }

  // =========================================================================
  // 6. 前髪
  // =========================================================================
  if (!isGirl && (hType === "spiky" || hType === "spiky2" || hType === "undercut" || hType === "part")) {
    setPx(7, 5 + bob, hBase);
    setPx(8, 6 + bob, hBase);
    setPx(10, 6 + bob, hBase);
    setPx(13, 6 + bob, hBase);
    setPx(15, 6 + bob, hBase);
    setPx(16, 5 + bob, hBase);
  }

  // =========================================================================
  // 7. 制服（20校それぞれのデザイン）
  // =========================================================================
  const uTop = uniDef.top;
  const uSub = uniDef.sub;
  const uAcc = uniDef.acc;
  const uBot = isGirl ? uniDef.bot_g : uniDef.bot;

  rectPx(8, 12 + bob, 8, 4, uTop);
  // 胸元（シャツ/セーラー三角/ネクタイ/リボン）
  rectPx(10, 12 + bob, 4, 2, uSub);
  if (isGirl) {
    rectPx(11, 13 + bob, 2, 2, uAcc);
  } else {
    rectPx(11, 13 + bob, 2, 3, uAcc);
    setPx(10, 15 + bob, "#FACC15"); // 金ボタン
  }

  // =========================================================================
  // 8. ボトムス（女子＝プリーツスカート、男子＝スラックス）
  // =========================================================================
  if (isGirl) {
    rectPx(7, 16 + bob, 10, 2, uBot);
    // プリーツの陰影
    setPx(7, 17 + bob, uTop);
    setPx(10, 17 + bob, uTop);
    setPx(13, 17 + bob, uTop);
    setPx(16, 17 + bob, uTop);
    // 足（ソックス＆ローファー）
    rectPx(9, 18, 2, 2, SKIN_BASE);
    rectPx(13, 18, 2, 2, SKIN_BASE);
    rectPx(9, 20, 2, 1, WHT);
    rectPx(13, 20, 2, 1, WHT);
    rectPx(8, 21, 3, 2, "#4A2810");
    rectPx(13, 21, 3, 2, "#4A2810");
  } else {
    rectPx(8, 16 + bob, 8, 2, uBot);
    rectPx(9, 18, 2, 3, uBot);
    rectPx(13, 18, 2, 3, uBot);
    // スニーカー
    rectPx(8, 21, 3, 2, EYE_BLK);
    rectPx(13, 21, 3, 2, EYE_BLK);
    setPx(8, 21, WHT);
    setPx(13, 21, WHT);
  }

  // =========================================================================
  // 9. 両手
  // =========================================================================
  setPx(7, 14 + bob, SKIN_BASE);
  setPx(16, 14 + bob, SKIN_BASE);

  // ランレングス圧縮でSVG rectを生成
  const mergedRects: { x: number; y: number; w: number; color: string }[] = [];
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
      {/* オーラグロー効果 */}
      {showAura && auraLevel >= 2 && (
        <motion.div
          animate={{
            scale: [1, 1.14, 1],
            opacity: [0.35, 0.65, 0.35],
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-2 rounded-full blur-xl pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${
              auraLevel >= 5
                ? "#FACC15"
                : auraLevel >= 4
                ? isGirl
                  ? "#F43F5E"
                  : "#06B6D4"
                : isGirl
                ? "#F472B6"
                : "#38BDF8"
            } 0%, transparent 72%)`,
          }}
        />
      )}

      {/* 24x24 フェアルーン2準拠ドット絵スプライト */}
      <motion.svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        className="pixelated relative z-10 drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] pointer-events-none touch-pan-y"
        animate={
          mood === "happy"
            ? { y: [0, -10, 0, -6, 0], scale: [1, 1.06, 1] }
            : mood === "attack"
            ? { x: [0, 12, -4, 0], scale: [1, 1.12, 1] }
            : mood === "evolve"
            ? {
                scale: [0.85, 1.2, 1],
                rotate: [0, -6, 6, 0],
              }
            : { y: 0 }
        }
        transition={{ duration: 0.4 }}
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
