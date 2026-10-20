"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export type BaseballPose = "stance" | "swing" | "homerun" | "miss";

interface BaseballCharacterProps {
  gender?: "boy" | "girl";
  pose?: BaseballPose;
  size?: number;
  teamColor?: string; // ユニフォーム・帽子のアクセントカラー
  animate?: boolean;
}

const WHT = "#FFFFFF";
const BLK = "#0F172A";
const SKIN = "#FFE4C4";
const SKIN_SHADOW = "#F3BA8B";
const EYE = "#111827";
const MOUTH_RED = "#DC2626";
const WOOD = "#D97706";
const METAL = "#94A3B8";

/**
 * 24x24 ピクセルアート 野球部キャラクター描画エンジン
 * 学園野球部員が打席で構え、スイングし、ホームランの歓喜を表現する
 */
export const BaseballCharacter: React.FC<BaseballCharacterProps> = ({
  gender = "boy",
  pose = "stance",
  size = 140,
  teamColor = "#EF4444", // 燃えるクリムゾンレッド
  animate = true,
}) => {
  const [frame, setFrame] = useState<0 | 1>(0);

  useEffect(() => {
    if (!animate) return;
    const interval = setInterval(() => {
      setFrame((prev) => (prev === 0 ? 1 : 0));
    }, 300);
    return () => clearInterval(interval);
  }, [animate]);

  const isGirl = gender === "girl";
  const hairColor = isGirl ? "#C26D2D" : "#3F2B1D";

  // 24x24 グリッドを生成
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
  // クラウン（頭頂部）
  fillRect(8, 2, 8, 3, teamColor);
  fillRect(7, 4, 10, 2, teamColor);
  // 帽子ツバ (Brim)
  if (pose === "swing") {
    fillRect(14, 5, 5, 1, BLK);
  } else {
    fillRect(5, 5, 5, 1, BLK);
  }
  // 帽子正面の白イニシャルバッジ
  setPixel(11, 3, WHT);
  setPixel(12, 3, WHT);

  // -------------------------------------------------------------
  // 2. 髪の毛 (Hair)
  // -------------------------------------------------------------
  if (isGirl) {
    // 女子：サイドポニー / サイドボブ
    fillRect(6, 6, 2, 5, hairColor);
    fillRect(16, 6, 2, 5, hairColor);
    // 後ろ髪ポニーテール
    fillRect(17, 7, 2, 4, hairColor);
    fillRect(18, 9, 2, 3, hairColor);
  } else {
    // 男子：もみあげ・襟足ショート
    fillRect(6, 6, 2, 4, hairColor);
    fillRect(16, 6, 2, 4, hairColor);
  }

  // -------------------------------------------------------------
  // 3. お顔 (Face)
  // -------------------------------------------------------------
  fillRect(8, 6, 8, 6, SKIN);
  fillRect(8, 12, 8, 1, SKIN_SHADOW);

  // つぶらな黒目
  setPixel(9, 8, EYE);
  setPixel(9, 9, EYE);
  setPixel(14, 8, EYE);
  setPixel(14, 9, EYE);

  // 口（ポーズによる変化）
  if (pose === "homerun") {
    // 大きく開いた笑顔
    fillRect(11, 10, 2, 2, MOUTH_RED);
    setPixel(11, 10, WHT);
  } else if (pose === "miss") {
    // への字口
    setPixel(11, 11, BLK);
    setPixel(12, 11, BLK);
  } else {
    // 気合の口元
    setPixel(11, 11, MOUTH_RED);
    setPixel(12, 11, MOUTH_RED);
  }

  // 頬のチーク（気合の赤み）
  setPixel(7, 9, "#FDA4AF");
  setPixel(16, 9, "#FDA4AF");

  // -------------------------------------------------------------
  // 4. 野球ユニフォーム (Body & Uniform)
  // -------------------------------------------------------------
  // 首元・アンダーシャツ
  fillRect(10, 13, 4, 1, BLK);

  // 胴体ユニフォーム (ホワイト地 + ストライプ)
  fillRect(8, 14, 8, 5, WHT);
  // ピンストライプ
  setPixel(10, 14, teamColor);
  setPixel(10, 15, teamColor);
  setPixel(10, 16, teamColor);
  setPixel(13, 14, teamColor);
  setPixel(13, 15, teamColor);
  setPixel(13, 16, teamColor);

  // 黒ベルト
  fillRect(8, 18, 8, 1, BLK);
  setPixel(11, 18, "#FACC15"); // バックル金

  // ユニフォームパンツ (ホワイト)
  fillRect(8, 19, 3, 3, WHT);
  fillRect(13, 19, 3, 3, WHT);

  // スパイクシューズ (黒)
  fillRect(7, 22, 4, 2, BLK);
  fillRect(13, 22, 4, 2, BLK);

  // -------------------------------------------------------------
  // 5. 腕・バット (Arms & Bat) ポーズ変化
  // -------------------------------------------------------------
  if (pose === "swing") {
    // フルスイング！バットが右上に振り切れている
    fillRect(12, 14, 4, 2, teamColor); // 腕
    fillRect(16, 13, 2, 2, SKIN);      // 手首
    // バット軌跡 (銀色バット)
    setPixel(18, 12, WOOD);
    setPixel(19, 10, METAL);
    setPixel(20, 8, METAL);
    setPixel(21, 6, METAL);
    setPixel(22, 4, METAL);
  } else if (pose === "homerun") {
    // ガッツポーズ！両手を高々と掲げる
    fillRect(6, 12, 2, 4, teamColor);
    fillRect(16, 12, 2, 4, teamColor);
    fillRect(5, 10, 3, 2, SKIN);
    fillRect(16, 10, 3, 2, SKIN);
    // 右手に掲げたバット
    fillRect(19, 6, 2, 7, METAL);
    fillRect(19, 13, 2, 2, WOOD);
  } else if (pose === "miss") {
    // 空振りで前のめり
    fillRect(9, 14, 3, 2, teamColor);
    fillRect(12, 15, 3, 2, SKIN);
    // 地面に落ちかけたバット
    fillRect(15, 18, 2, 4, WOOD);
  } else {
    // 構え (Stance): バットを肩口に構えて揺らす
    const bob = frame === 1 ? -1 : 0;
    fillRect(6, 14 + bob, 3, 2, teamColor);
    fillRect(5, 12 + bob, 2, 3, SKIN);
    // 斜めに構えたバット
    setPixel(4, 11 + bob, WOOD);
    setPixel(3, 9 + bob, METAL);
    setPixel(2, 7 + bob, METAL);
    setPixel(1, 5 + bob, METAL);
    setPixel(1, 4 + bob, METAL);
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        imageRendering: "pixelated",
      }}
      className="relative flex items-center justify-center select-none"
    >
      <svg
        viewBox="0 0 24 24"
        width="100%"
        height="100%"
        style={{ shapeRendering: "crispEdges" }}
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
