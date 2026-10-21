"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export type CoachPose = "ready" | "swing";

interface CoachCharacterProps {
  pose?: CoachPose;
  size?: number;
  animate?: boolean;
}

const WHT = "#FFFFFF";
const BLK = "#0F172A";
const SKIN = "#FFE4C4";
const SKIN_SHADOW = "#F3BA8B";
const EYE = "#111827";
const MOUTH = "#DC2626";
const WOOD = "#B45309";
const COACH_RED = "#DC2626"; // 熱血赤ジャージ
const PANTS_GRAY = "#334155";

/**
 * 24x24 ピクセルアート 鬼コーチ描画エンジン
 * 熱血ノックを打ち込む名物コーチ（キャップ、サングラス風の鋭い目元、ノックバット）
 */
export const CoachCharacter: React.FC<CoachCharacterProps> = ({
  pose = "ready",
  size = 72,
  animate = true,
}) => {
  const [frame, setFrame] = useState<0 | 1>(0);

  useEffect(() => {
    if (!animate) return;
    const interval = setInterval(() => {
      setFrame((prev) => (prev === 0 ? 1 : 0));
    }, 320);
    return () => clearInterval(interval);
  }, [animate]);

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

  // 1. 帽子 (Coach Cap)
  fillRect(8, 2, 8, 3, COACH_RED);
  fillRect(7, 4, 10, 2, COACH_RED);
  // ツバ（右向きにノックを打つので右側にツバ）
  fillRect(14, 5, 5, 1, BLK);
  setPixel(11, 3, "#FACC15"); // C (Coach) イニシャル

  // 2. 顔 (Face)
  fillRect(8, 6, 8, 6, SKIN);
  fillRect(8, 12, 8, 1, SKIN_SHADOW);

  // 鋭い眼光 / スポーティサングラス
  fillRect(10, 8, 6, 2, BLK);
  setPixel(11, 8, "#38BDF8"); // サングラスの光沢
  setPixel(14, 8, "#38BDF8");

  // 気合の口元
  if (pose === "swing") {
    // 叫ぶ大口「いくぞぉぉ！！」
    fillRect(12, 10, 3, 2, MOUTH);
    setPixel(12, 10, WHT);
  } else {
    // 引き締まったへの字口
    fillRect(12, 11, 3, 1, MOUTH);
  }

  // 3. 上半身・熱血ジャージ (Coach Jacket)
  fillRect(8, 14, 8, 5, COACH_RED);
  fillRect(11, 14, 2, 5, WHT); // ジッパー白ライン

  // 4. 下半身・ジャージパンツ (Pants)
  fillRect(8, 19, 3, 3, PANTS_GRAY);
  fillRect(13, 19, 3, 3, PANTS_GRAY);
  setPixel(7, 19, WHT); // サイド白ライン
  setPixel(16, 19, WHT);

  // シューズ
  fillRect(7, 22, 4, 2, BLK);
  fillRect(13, 22, 4, 2, BLK);

  // 5. ノックバットと腕 (Bat & Arms)
  if (pose === "swing") {
    // 右へ向かってフルスイング！
    fillRect(13, 14, 4, 2, COACH_RED);
    fillRect(17, 14, 2, 2, SKIN);
    // 右上に振り抜いた長尺ノックバット
    setPixel(19, 13, WOOD);
    setPixel(20, 11, WOOD);
    setPixel(21, 9, WOOD);
    setPixel(22, 7, WOOD);
    setPixel(23, 5, WOOD);
  } else {
    // ノックを構えるポーズ（左肩に担ぐ）
    const bob = frame === 1 ? -1 : 0;
    fillRect(6, 13 + bob, 3, 2, COACH_RED);
    fillRect(5, 12 + bob, 2, 2, SKIN);
    // 斜めに立てたノックバット
    setPixel(4, 11 + bob, WOOD);
    setPixel(3, 9 + bob, WOOD);
    setPixel(2, 7 + bob, WOOD);
    setPixel(1, 5 + bob, WOOD);
    setPixel(1, 4 + bob, WOOD);
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
