"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BatTier, BAT_EQUIPMENTS } from "@/lib/baseballGrowthEngine";

export type BaseballPose = "stance" | "swing" | "homerun" | "miss" | "catch";

interface BaseballCharacterProps {
  gender?: "boy" | "girl";
  pose?: BaseballPose;
  size?: number;
  teamColor?: string; // ユニフォーム・帽子のアクセントカラー
  level?: number;     // 1〜10 (レベルが高いほど装飾が豪華に)
  batTier?: BatTier;  // 1〜5 (バットの外見進化)
  isFielding?: boolean; // ノック守備モード（グラブを構える）
  animate?: boolean;
  showAura?: boolean;
}

const WHT = "#FFFFFF";
const BLK = "#0F172A";
const SKIN = "#FFE4C4";
const SKIN_SHADOW = "#F3BA8B";
const EYE = "#111827";
const MOUTH_RED = "#DC2626";

/**
 * 進化型 24x24 ピクセルアート 野球部キャラクター描画エンジン
 * - レベルに応じた肩章・ユニフォーム金ライン装飾
 * - バット5段階進化（木製→金属→漆黒カーボン→黄金Vバット→雷神ビームバット）
 * - 闘志オーラ（燃える炎・黄金光彩）
 */
export const BaseballCharacter: React.FC<BaseballCharacterProps> = ({
  gender = "boy",
  pose = "stance",
  size = 140,
  teamColor = "#EF4444",
  level = 1,
  batTier = 1,
  isFielding = false,
  animate = true,
  showAura = true,
}) => {
  const [frame, setFrame] = useState<0 | 1>(0);

  useEffect(() => {
    if (!animate) return;
    const interval = setInterval(() => {
      setFrame((prev) => (prev === 0 ? 1 : 0));
    }, 280);
    return () => clearInterval(interval);
  }, [animate]);

  const isGirl = gender === "girl";
  const hairColor = isGirl ? "#C26D2D" : "#3F2B1D";

  // バット色設定
  const batConfig = BAT_EQUIPMENTS.find((b) => b.tier === batTier) || BAT_EQUIPMENTS[0];
  const batMain = batConfig.color;
  const batSub = batConfig.subColor;

  // 24x24 グリッド
  const grid: (string | null)[][] = Array.from({ length: 24 }, () =>
    Array(24).fill(null)
  );

  const setPixel = (x: number, y: number, color: string) => {
    if (x >= 0 && x < 24 && y >= 0 && y < 24) {
      grid[y][x] = color;
    }
  };

  const fillRect = (
    x: number,
    y: number,
    w: number,
    h: number,
    color: string
  ) => {
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        setPixel(x + dx, y + dy, color);
      }
    }
  };

  // -------------------------------------------------------------
  // 1. 帽子 (Baseball Cap)
  // -------------------------------------------------------------
  fillRect(8, 2, 8, 3, teamColor);
  fillRect(7, 4, 10, 2, teamColor);

  // ツバ
  if (pose === "swing") {
    fillRect(14, 5, 5, 1, BLK);
  } else {
    fillRect(5, 5, 5, 1, BLK);
  }

  // 帽子正面のエンブレム（Lv5以上でゴールドバッジに進化）
  const capBadgeColor = level >= 5 ? "#FACC15" : WHT;
  setPixel(11, 3, capBadgeColor);
  setPixel(12, 3, capBadgeColor);
  if (level >= 8) {
    // 王者の星マーク
    setPixel(11, 2, "#FACC15");
    setPixel(12, 2, "#FACC15");
  }

  // -------------------------------------------------------------
  // 2. 髪の毛 (Hair)
  // -------------------------------------------------------------
  if (isGirl) {
    fillRect(6, 6, 2, 5, hairColor);
    fillRect(16, 6, 2, 5, hairColor);
    fillRect(17, 7, 2, 4, hairColor);
    fillRect(18, 9, 2, 3, hairColor);
  } else {
    fillRect(6, 6, 2, 4, hairColor);
    fillRect(16, 6, 2, 4, hairColor);
  }

  // -------------------------------------------------------------
  // 3. お顔 (Face)
  // -------------------------------------------------------------
  fillRect(8, 6, 8, 6, SKIN);
  fillRect(8, 12, 8, 1, SKIN_SHADOW);

  // つぶらな瞳
  setPixel(9, 8, EYE);
  setPixel(9, 9, EYE);
  setPixel(14, 8, EYE);
  setPixel(14, 9, EYE);

  // 口元
  if (pose === "homerun") {
    fillRect(11, 10, 2, 2, MOUTH_RED);
    setPixel(11, 10, WHT);
  } else if (pose === "miss") {
    setPixel(11, 11, BLK);
    setPixel(12, 11, BLK);
  } else {
    setPixel(11, 11, MOUTH_RED);
    setPixel(12, 11, MOUTH_RED);
  }

  // チーク
  setPixel(7, 9, "#FDA4AF");
  setPixel(16, 9, "#FDA4AF");

  // -------------------------------------------------------------
  // 4. 野球ユニフォーム (Body & Uniform)
  // -------------------------------------------------------------
  fillRect(10, 13, 4, 1, BLK);

  // 胴体
  fillRect(8, 14, 8, 5, WHT);

  // ピンストライプ
  setPixel(10, 14, teamColor);
  setPixel(10, 15, teamColor);
  setPixel(10, 16, teamColor);
  setPixel(13, 14, teamColor);
  setPixel(13, 15, teamColor);
  setPixel(13, 16, teamColor);

  // Lv.4以上で肩にキャプテン/エース章（ゴールドライン）
  if (level >= 4) {
    setPixel(7, 14, "#FACC15");
    setPixel(16, 14, "#FACC15");
  }

  // ベルト
  fillRect(8, 18, 8, 1, BLK);
  const buckleColor = level >= 6 ? "#FACC15" : "#CBD5E1";
  setPixel(11, 18, buckleColor);

  // パンツ
  fillRect(8, 19, 3, 3, WHT);
  fillRect(13, 19, 3, 3, WHT);

  // Lv.7以上でパンツサイドラインがゴールドに
  if (level >= 7) {
    setPixel(7, 19, "#FACC15");
    setPixel(7, 20, "#FACC15");
    setPixel(16, 19, "#FACC15");
    setPixel(16, 20, "#FACC15");
  }

  // スパイクシューズ
  fillRect(7, 22, 4, 2, BLK);
  fillRect(13, 22, 4, 2, BLK);

  // -------------------------------------------------------------
  // 5. 腕・グラブ / 進化バット (Arms, Glove & Evolved Bat)
  // -------------------------------------------------------------
  const GLOVE_BROWN = "#92400E";
  const GLOVE_DARK = "#78350F";

  if (isFielding) {
    // ★ 守備・ノック捕球モード
    if (pose === "catch" || pose === "homerun") {
      // ナイスキャッチ！グラブを高く掲げてガッツポーズ
      fillRect(6, 11, 2, 4, teamColor);
      fillRect(16, 11, 2, 4, teamColor);
      fillRect(5, 9, 3, 2, SKIN);
      // 右手にグラブ（ナイスキャッチ！）
      fillRect(15, 8, 4, 3, GLOVE_BROWN);
      setPixel(16, 7, GLOVE_DARK);
      // キャッチした白球
      setPixel(17, 9, WHT);
    } else if (pose === "miss") {
      // 後逸・エラー
      fillRect(8, 14, 3, 2, teamColor);
      fillRect(13, 14, 3, 2, teamColor);
      fillRect(7, 16, 2, 2, SKIN);
      fillRect(15, 16, 2, 2, GLOVE_BROWN);
    } else {
      // 守備構え（腰を落として両手グラブを前へ）
      const bob = frame === 1 ? 1 : 0;
      fillRect(6, 14 + bob, 3, 2, teamColor);
      fillRect(15, 14 + bob, 3, 2, teamColor);
      fillRect(8, 15 + bob, 2, 2, SKIN);
      // 前に構えたグラブ
      fillRect(13, 14 + bob, 4, 3, GLOVE_BROWN);
      setPixel(14, 13 + bob, GLOVE_DARK);
    }
  } else {
    // 打者モード
    if (pose === "swing") {
      // フルスイング！
      fillRect(12, 14, 4, 2, teamColor);
      fillRect(16, 13, 2, 2, SKIN);

      setPixel(18, 12, batSub);
      setPixel(19, 10, batMain);
      setPixel(20, 8, batMain);
      setPixel(21, 6, batMain);
      setPixel(22, 4, batMain);

      if (batTier === 5) {
        setPixel(20, 7, "#38BDF8");
        setPixel(21, 5, "#C084FC");
      }
    } else if (pose === "homerun") {
      fillRect(6, 12, 2, 4, teamColor);
      fillRect(16, 12, 2, 4, teamColor);
      fillRect(5, 10, 3, 2, SKIN);
      fillRect(16, 10, 3, 2, SKIN);

      fillRect(19, 6, 2, 7, batMain);
      fillRect(19, 13, 2, 2, batSub);

      if (batTier >= 4) {
        setPixel(21, 5, "#FFFFFF");
        setPixel(18, 4, "#FACC15");
      }
    } else if (pose === "miss") {
      fillRect(9, 14, 3, 2, teamColor);
      fillRect(12, 15, 3, 2, SKIN);
      fillRect(15, 18, 2, 4, batSub);
    } else {
      // 構え (Stance)
      const bob = frame === 1 ? -1 : 0;
      fillRect(6, 14 + bob, 3, 2, teamColor);
      fillRect(5, 12 + bob, 2, 3, SKIN);

      setPixel(4, 11 + bob, batSub);
      setPixel(3, 9 + bob, batMain);
      setPixel(2, 7 + bob, batMain);
      setPixel(1, 5 + bob, batMain);
      setPixel(1, 4 + bob, batMain);

      if (batTier === 5) {
        const zapX = frame === 1 ? 0 : 2;
        setPixel(zapX, 3 + bob, "#38BDF8");
      }
    }
  }

  // オーラ判定
  const hasAura = showAura && level >= 3;
  const isAuraGold = level >= 8;
  const isAuraFlame = level >= 5 && !isAuraGold;

  return (
    <div
      style={{
        width: size,
        height: size,
        imageRendering: "pixelated",
      }}
      className="relative flex items-center justify-center select-none"
    >
      {/* 闘志オーラエフェクト */}
      {hasAura && (
        <motion.div
          animate={{
            scale: [0.95, 1.08, 0.95],
            opacity: [0.4, 0.75, 0.4],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute inset-[-12%] rounded-full blur-md pointer-events-none ${
            isAuraGold
              ? "bg-gradient-to-t from-[#EAB308]/40 via-[#FACC15]/30 to-transparent"
              : isAuraFlame
              ? "bg-gradient-to-t from-[#EF4444]/40 via-[#F97316]/30 to-transparent"
              : "bg-gradient-to-t from-[#38BDF8]/30 to-transparent"
          }`}
        />
      )}

      <svg
        viewBox="0 0 24 24"
        width="100%"
        height="100%"
        style={{ shapeRendering: "crispEdges" }}
        className="relative z-10"
      >
        {grid.map((row, y) =>
          row.map((color, x) =>
            color ? (
              <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={color} />
            ) : null
          )
        )}
      </svg>
    </div>
  );
};
