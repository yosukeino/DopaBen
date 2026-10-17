"use client";

import React from "react";
import { motion } from "framer-motion";
import { CharacterGender } from "@/lib/types";
import { EVOLUTION_STAGES } from "@/lib/vocabData";

interface PixelCharacterProps {
  gender: CharacterGender;
  stage: number; // 1 to 10
  size?: number;
  mood?: "idle" | "happy" | "attack" | "evolve";
  showAura?: boolean;
}

/**
 * 温かみのあるレトロ16x16ドット絵キャラクター描画エンジン
 * 男子(boy)・女子(girl) × 10段階進化(Stage 1〜10) をピクセル単位で忠実に描画
 */
export const PixelCharacter: React.FC<PixelCharacterProps> = ({
  gender,
  stage,
  size = 136,
  mood = "idle",
  showAura = true,
}) => {
  const clampedStage = Math.max(1, Math.min(10, stage));
  const stageInfo = EVOLUTION_STAGES[clampedStage - 1];

  // パレット定義（段階ごとに衣装・武器・オーラが豪華に進化）
  const skin = "#FFDCB8";
  const cheek = "#FF8FA3";
  const eye = "#1E1B18";

  // 髪色（進化が進むと覚醒カラーへ段階変化）
  const hairColorsBoy = [
    "#3B281E", // Lv1: 茶髪（寝癖）
    "#2A2421", // Lv2: 黒髪（学生）
    "#1E3A8A", // Lv3: クールネイビー
    "#0F766E", // Lv4: サイバーティール
    "#991B1B", // Lv5: クリムゾン
    "#D97706", // Lv6: サンダーゴールド
    "#E5E7EB", // Lv7: シルバーナイト
    "#7C3AED", // Lv8: バイオレットマスター
    "#EF4444", // Lv9: 覚醒スカーレット
    "#FFE600", // Lv10: スーパーゴールド神
  ];

  const hairColorsGirl = [
    "#5C3A21", // Lv1: 栗色ボブ
    "#312E81", // Lv2: 黒紺ツインテ
    "#DB2777", // Lv3: ストリートピンク
    "#0284C7", // Lv4: ネオンシアン
    "#DC2626", // Lv5: 紅蓮レッド
    "#F59E0B", // Lv6: 琥珀ゴールド
    "#F3F4F6", // Lv7: 白銀ヴァルキリー
    "#9333EA", // Lv8: アメジスト
    "#F43F5E", // Lv9: 紅蓮アークロゼ
    "#FFF04D", // Lv10: 黄金クイーン
  ];

  const outfitPrimary = [
    "#64748B", // Lv1: 部屋着ジャージ
    "#1E293B", // Lv2: 制服ブレザー
    "#10B981", // Lv3: ストリートパーカー
    "#06B6D4", // Lv4: サイバースーツ
    "#E60012", // Lv5: 紅蓮コート
    "#F59E0B", // Lv6: 雷光ベスト
    "#311042", // Lv7: 黒鉄アーマー
    "#111827", // Lv8: 二刀流マスター装束
    "#99000C", // Lv9: アークロード鎧
    "#FFFFFF", // Lv10: 語彙神の神衣（白×金×赤）
  ][clampedStage - 1];

  const outfitAccent = [
    "#CBD5E1", // Lv1
    "#EF4444", // Lv2: 赤ネクタイ/リボン
    "#FBBF24", // Lv3
    "#22D3EE", // Lv4
    "#FFE600", // Lv5
    "#FEF08A", // Lv6
    "#A855F7", // Lv7
    "#EC4899", // Lv8
    "#FF4D4D", // Lv9
    "#FFE600", // Lv10
  ][clampedStage - 1];

  const hair =
    gender === "boy"
      ? hairColorsBoy[clampedStage - 1]
      : hairColorsGirl[clampedStage - 1];

  // ピクセル配列を構築 (16x16 グリッド)
  const pixels: { x: number; y: number; color: string }[] = [];
  const setPx = (x: number, y: number, color: string) => {
    if (x >= 0 && x < 16 && y >= 0 && y < 16) {
      pixels.push({ x, y, color });
    }
  };
  const rectPx = (x1: number, y1: number, w: number, h: number, color: string) => {
    for (let y = y1; y < y1 + h; y++) {
      for (let x = x1; x < x1 + w; x++) {
        setPx(x, y, color);
      }
    }
  };

  // --- 1. 背面エフェクト（マント・翼・二刀流ブレード：Stage 5以上） ---
  if (clampedStage >= 5) {
    const capeColor = clampedStage === 10 ? "#E60012" : clampedStage >= 7 ? "#4C1D95" : "#B91C1C";
    rectPx(3, 8, 10, 6, capeColor);
    setPx(2, 11, capeColor);
    setPx(2, 12, capeColor);
    setPx(13, 11, capeColor);
    setPx(13, 12, capeColor);
  }

  // Stage 9〜10: 紅蓮／黄金のドット翼
  if (clampedStage >= 9) {
    const wingColor = clampedStage === 10 ? "#FFE600" : "#FF1E27";
    const wingInner = clampedStage === 10 ? "#FFFFFF" : "#FF8A8A";
    // 左翼
    setPx(1, 5, wingColor);
    setPx(1, 6, wingColor);
    setPx(2, 6, wingInner);
    setPx(0, 7, wingColor);
    setPx(1, 7, wingInner);
    setPx(2, 7, wingColor);
    setPx(1, 8, wingColor);
    setPx(0, 9, wingColor);
    // 右翼
    setPx(14, 5, wingColor);
    setPx(14, 6, wingColor);
    setPx(13, 6, wingInner);
    setPx(15, 7, wingColor);
    setPx(14, 7, wingInner);
    setPx(13, 7, wingColor);
    setPx(14, 8, wingColor);
    setPx(15, 9, wingColor);
  }

  // --- 2. 頭部・ベース顔 ---
  rectPx(5, 4, 6, 5, skin);

  // ほっぺ（温かみのあるレトロ感）
  setPx(5, 7, cheek);
  setPx(10, 7, cheek);

  // 目（happy時はニッコリ目）
  if (mood === "happy" || mood === "evolve") {
    setPx(6, 6, eye);
    setPx(9, 6, eye);
    setPx(7, 7, "#E60012");
    setPx(8, 7, "#E60012");
  } else {
    setPx(6, 6, eye);
    setPx(9, 6, eye);
    setPx(7, 8, "#C97A63");
    setPx(8, 8, "#C97A63");
  }

  // --- 3. 髪型（男子 vs 女子） ---
  if (gender === "boy") {
    // 男子：ツンツン・スポーティヘア
    rectPx(5, 2, 6, 2, hair);
    setPx(4, 3, hair);
    setPx(11, 3, hair);
    setPx(4, 4, hair);
    setPx(5, 4, hair);
    setPx(8, 4, hair);
    setPx(11, 4, hair);
    // Stage 1は可愛い寝癖ピョコ毛
    if (clampedStage === 1) {
      setPx(7, 1, hair);
      setPx(8, 0, hair);
    } else if (clampedStage >= 6) {
      // 覚醒逆立ちヘア
      setPx(5, 1, hair);
      setPx(7, 1, hair);
      setPx(10, 1, hair);
    }
  } else {
    // 女子：サイドテール／ツインテール＆前髪
    rectPx(5, 2, 6, 2, hair);
    setPx(4, 3, hair);
    setPx(11, 3, hair);
    setPx(4, 4, hair);
    setPx(6, 4, hair);
    setPx(9, 4, hair);
    setPx(11, 4, hair);
    // サイドのロングヘア／ツインテ
    rectPx(3, 4, 1, 5, hair);
    rectPx(12, 4, 1, 5, hair);
    if (clampedStage === 1) {
      // 寝癖アホ毛
      setPx(8, 1, hair);
      setPx(9, 0, hair);
    } else {
      // 可愛い髪飾りリボン
      setPx(3, 3, outfitAccent);
      setPx(12, 3, outfitAccent);
    }
  }

  // --- 4. 頭・顔アクセサリー（進化段階別） ---
  if (clampedStage === 3) {
    // ヘッドホン
    setPx(4, 5, "#EF4444");
    setPx(4, 6, "#EF4444");
    setPx(11, 5, "#EF4444");
    setPx(11, 6, "#EF4444");
    rectPx(5, 1, 6, 1, "#E5E7EB");
  }
  if (clampedStage === 4 || clampedStage === 7) {
    // ネオンバイザー / 怪盗マスク風ゴーグル
    const visorColor = clampedStage === 4 ? "#00F0FF" : "#FFE600";
    rectPx(5, 5, 6, 2, "#111827");
    rectPx(6, 5, 4, 1, visorColor);
  }
  if (clampedStage >= 7 && clampedStage < 10) {
    // ナイト／ヴァルキリー角飾り
    setPx(4, 1, outfitAccent);
    setPx(5, 2, outfitAccent);
    setPx(11, 1, outfitAccent);
    setPx(10, 2, outfitAccent);
  }
  if (clampedStage === 10) {
    // Stage 10: 黄金の王冠 (CROWN)
    rectPx(5, 0, 6, 2, "#FFE600");
    setPx(5, 0, "#FFF");
    setPx(7, 0, "#E60012");
    setPx(8, 0, "#E60012");
    setPx(10, 0, "#FFF");
  }

  // --- 5. ボディ・衣装 ---
  rectPx(5, 9, 6, 4, outfitPrimary);
  // 襟・ネクタイ・リボン・コア装飾
  setPx(7, 9, "#FFFFFF");
  setPx(8, 9, "#FFFFFF");
  setPx(7, 10, outfitAccent);
  setPx(8, 10, outfitAccent);
  if (clampedStage >= 5) {
    setPx(7, 11, outfitAccent);
    setPx(8, 11, outfitAccent);
  }

  // 腕
  rectPx(4, 9, 1, 3, outfitPrimary);
  rectPx(11, 9, 1, 3, outfitPrimary);
  setPx(4, 12, skin);
  setPx(11, 12, skin);

  // 脚・ブーツ
  if (gender === "girl" && clampedStage >= 2 && clampedStage <= 6) {
    // スカート＋ソックス
    rectPx(5, 12, 6, 1, outfitAccent);
    setPx(6, 13, skin);
    setPx(9, 13, skin);
    setPx(6, 14, "#1E293B");
    setPx(9, 14, "#1E293B");
  } else {
    // パンツ＋ブーツ
    setPx(6, 13, "#1E293B");
    setPx(9, 13, "#1E293B");
    setPx(6, 14, outfitAccent);
    setPx(9, 14, outfitAccent);
  }

  // --- 6. 武器・ブレード装備（Stage 5以上） ---
  if (clampedStage >= 5) {
    const bladeColor =
      clampedStage === 10
        ? "#FFE600"
        : clampedStage >= 8
        ? "#00F0FF"
        : "#EF4444";
    // 右手ブレード
    setPx(13, 11, "#9CA3AF");
    setPx(13, 10, bladeColor);
    setPx(13, 9, bladeColor);
    setPx(13, 8, "#FFFFFF");
    if (clampedStage >= 6) {
      setPx(13, 7, bladeColor);
    }
  }
  // Stage 8以上：左にも二刀流ブレード
  if (clampedStage >= 8) {
    const blade2Color = clampedStage === 10 ? "#E60012" : "#FF007F";
    setPx(2, 11, "#9CA3AF");
    setPx(2, 10, blade2Color);
    setPx(2, 9, blade2Color);
    setPx(2, 8, "#FFFFFF");
    setPx(2, 7, blade2Color);
  }

  return (
    <div
      className="relative flex items-center justify-center select-none pointer-events-none touch-pan-y"
      style={{ width: size, height: size }}
    >
      {/* 進化段階に応じた背景オーラ */}
      {showAura && (
        <motion.div
          animate={{
            scale: [1, 1.12, 1],
            rotate: [0, 6, -6, 0],
          }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-2 rounded-full blur-xl opacity-55 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${stageInfo.auraColor} 0%, transparent 72%)`,
          }}
        />
      )}

      {/* Stage 6以上の稲妻・星屑ピクセルパーティクル */}
      {showAura && clampedStage >= 4 && (
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ y: [0, -10, 0], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="w-2 h-2 absolute top-3 left-3"
            style={{ backgroundColor: stageInfo.auraColor }}
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

      {/* レトロドット絵本体（バウンスアニメーション付き） */}
      <motion.svg
        viewBox="0 0 16 16"
        width={size}
        height={size}
        className="pixelated relative z-10 drop-shadow-[0_6px_0_rgba(0,0,0,0.85)] pointer-events-none touch-pan-y"
        animate={
          mood === "happy"
            ? { y: [0, -14, 0, -10, 0], scale: [1, 1.08, 1] }
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
            : { y: [0, -4, 0] }
        }
        transition={
          mood === "idle"
            ? {
                duration: 0.9,
                repeat: Infinity,
                ease: "steps(2)",
              }
            : { duration: 0.45 }
        }
      >
        {pixels.map((p, idx) => (
          <rect
            key={`${p.x}_${p.y}_${idx}`}
            x={p.x}
            y={p.y}
            width={1.02}
            height={1.02}
            fill={p.color}
          />
        ))}
      </motion.svg>
    </div>
  );
};
