"use client";

import React, { useEffect, useState } from "react";
import { FiveStats } from "@/lib/types";

interface StarRadarChartProps {
  stats: FiveStats;
  recentGains?: Partial<FiveStats>;
  triggerKey?: number;
  variant?: "home" | "result";
}

const AXES: { key: keyof FiveStats; label: string; sub: string }[] = [
  { key: "vocab", label: "語彙力", sub: "VOCAB" },
  { key: "speed", label: "瞬発力", sub: "SPEED" },
  { key: "grammar", label: "構築力", sub: "BUILD" },
  { key: "guts", label: "度胸", sub: "GUTS" },
  { key: "listening", label: "聴覚力", sub: "SONAR" },
];

export const StarRadarChart: React.FC<StarRadarChartProps> = ({
  stats,
  recentGains,
  triggerKey = 0,
  variant = "home",
}) => {
  const cx = 110;
  const cy = 110;
  const maxR = 66;
  const maxStat = 100;

  const isResult = variant === "result";

  // アニメーション進行状態
  const [animRatio, setAnimRatio] = useState(0);
  const [animProgress, setAnimProgress] = useState(0);
  const [angleOffset, setAngleOffset] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    // トップページ: 0.3秒 (300ms) / リザルト画面: 0.5秒 (500ms) のド派手演出
    const duration = isResult ? 500 : 300;
    let rafId: number;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(1, elapsed / duration);
      setAnimProgress(progress);

      if (isResult) {
        // リザルト専用 0.5秒 (500ms) ド派手バースト：
        // 特大オーバーシュート (最大146%) ＋ 4段階の弾性バウンス ＋ スパイラル回転ロックオン
        const decay = 4.0;
        const omega = 18.8;
        const spring =
          1 - Math.exp(-decay * progress) * Math.cos(omega * progress);
        const twist =
          progress >= 1
            ? 0
            : -0.65 * Math.exp(-5.2 * progress) * Math.cos(12.5 * progress);

        setAnimRatio(progress >= 1 ? 1 : Math.max(0, spring));
        setAngleOffset(twist);
      } else {
        // トップページ用 0.3秒 (300ms) 「ボヨヨ～ン」弾性バウンス
        const decay = 5.2;
        const omega = 14.2;
        const spring =
          1 - Math.exp(-decay * progress) * Math.cos(omega * progress);

        setAnimRatio(progress >= 1 ? 1 : Math.max(0, spring));
        setAngleOffset(0);
      }

      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        setAnimRatio(1);
        setAnimProgress(1);
        setAngleOffset(0);
      }
    };

    setAnimRatio(0);
    setAnimProgress(0);
    setAngleOffset(isResult ? -0.65 : 0);
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [stats, triggerKey, isResult]);

  const getPoint = (index: number, ratio: number, extraAngle: number = 0) => {
    const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2 + extraAngle;
    return {
      x: cx + Math.cos(angle) * maxR * ratio,
      y: cy + Math.sin(angle) * maxR * ratio,
    };
  };

  const outerPolygon = AXES.map((_, i) => {
    const p = getPoint(i, 1);
    return `${p.x},${p.y}`;
  }).join(" ");

  const midPolygon = AXES.map((_, i) => {
    const p = getPoint(i, 0.55);
    return `${p.x},${p.y}`;
  }).join(" ");

  // リザルト画面用の衝撃波五角形リング（0.5秒の間に中心から外枠の外まで突き抜ける！）
  const shockwave1Ratio = isResult ? Math.min(1.48, animProgress * 1.65) : 0;
  const shockwave1Opacity =
    isResult && animProgress < 1 ? Math.max(0, (1 - animProgress) * 0.9) : 0;
  const shockwave1Polygon = AXES.map((_, i) => {
    const p = getPoint(i, shockwave1Ratio, -angleOffset * 0.5);
    return `${p.x},${p.y}`;
  }).join(" ");

  const shockwave2Ratio = isResult
    ? Math.min(1.35, Math.max(0, (animProgress - 0.12) * 1.55))
    : 0;
  const shockwave2Opacity =
    isResult && animProgress > 0.12 && animProgress < 1
      ? Math.max(0, (1 - animProgress) * 0.75)
      : 0;
  const shockwave2Polygon = AXES.map((_, i) => {
    const p = getPoint(i, shockwave2Ratio);
    return `${p.x},${p.y}`;
  }).join(" ");

  // メインの五角形ステータスポリゴン（リザルト時はスパイラル回転＋特大バウンス）
  const statPolygon = AXES.map((axis, i) => {
    const val = Math.min(maxStat, Math.max(14, stats[axis.key]));
    const p = getPoint(i, (val / maxStat) * animRatio, angleOffset);
    return `${p.x},${p.y}`;
  }).join(" ");

  return (
    <div className="relative flex items-center justify-center pointer-events-none select-none touch-pan-y">
      <svg
        viewBox="0 0 220 220"
        className="w-44 h-44 sm:w-52 sm:h-52 overflow-visible pointer-events-none select-none touch-pan-y"
      >
        <defs>
          <radialGradient id="dopaRadarFill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF206E" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#FF206E" stopOpacity="0.45" />
          </radialGradient>
          <radialGradient id="dopaRadarResultFill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FBFF12" stopOpacity="0.92" />
            <stop offset="55%" stopColor="#FF206E" stopOpacity="0.78" />
            <stop offset="100%" stopColor="#41EAD4" stopOpacity="0.55" />
          </radialGradient>
        </defs>

        {/* 背景の斜め五角形グリッド (#0C0F0A ベース × #41EAD4 外枠アクセント) */}
        <polygon
          points={outerPolygon}
          fill="#0C0F0A"
          stroke="#41EAD4"
          strokeWidth="2"
        />
        <polygon
          points={midPolygon}
          fill="none"
          stroke="#2C3527"
          strokeWidth="1.2"
          strokeDasharray="3 3"
        />

        {/* 中心から各頂点への放射線 */}
        {AXES.map((_, i) => {
          const p = getPoint(i, 1);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={p.x}
              y2={p.y}
              stroke="#222A1E"
              strokeWidth="1.2"
            />
          );
        })}

        {/* リザルト専用：中心から外側へ弾ける二重のネオン衝撃波リング */}
        {isResult && shockwave1Opacity > 0.01 && (
          <polygon
            points={shockwave1Polygon}
            fill="none"
            stroke="#FBFF12"
            strokeWidth="3"
            strokeOpacity={shockwave1Opacity}
          />
        )}
        {isResult && shockwave2Opacity > 0.01 && (
          <polygon
            points={shockwave2Polygon}
            fill="none"
            stroke="#41EAD4"
            strokeWidth="2"
            strokeDasharray="6 3"
            strokeOpacity={shockwave2Opacity}
          />
        )}

        {/* プレイヤーの現在のステータス領域 */}
        <polygon
          points={statPolygon}
          fill={isResult ? "url(#dopaRadarResultFill)" : "url(#dopaRadarFill)"}
          stroke="#FBFF12"
          strokeWidth={isResult && animProgress < 1 ? "3.5" : "2.5"}
        />

        {/* 各頂点のドットとラベル */}
        {AXES.map((axis, i) => {
          const val = Math.min(maxStat, Math.max(14, stats[axis.key]));
          const dot = getPoint(i, (val / maxStat) * animRatio, angleOffset);
          const labelPos = getPoint(i, 1.33);
          const gain = recentGains?.[axis.key] || 0;

          return (
            <g key={axis.key}>
              {/* リザルト時：各頂点が光るハローリング */}
              {isResult && animRatio > 1.02 && (
                <circle
                  cx={dot.x}
                  cy={dot.y}
                  r={Math.min(13, 6.5 * animRatio)}
                  fill="none"
                  stroke="#41EAD4"
                  strokeWidth="1.8"
                  strokeOpacity={Math.min(1, (animRatio - 1) * 2.5)}
                />
              )}
              <circle
                cx={dot.x}
                cy={dot.y}
                r={Math.max(
                  3.5,
                  Math.min(
                    isResult ? 7.8 : 6.2,
                    4.5 * (0.8 + (isResult ? 0.45 : 0.25) * animRatio)
                  )
                )}
                fill="#FBFF12"
                stroke="#0C0F0A"
                strokeWidth="1.5"
              />
              <text
                x={labelPos.x}
                y={labelPos.y - 3}
                textAnchor="middle"
                className="fill-white font-black text-[11px] tracking-tighter"
              >
                {axis.label}
              </text>
              <text
                x={labelPos.x}
                y={labelPos.y + 9}
                textAnchor="middle"
                className="fill-[#41EAD4] font-extrabold text-[10px]"
              >
                Lv.{Math.floor(stats[axis.key] / 10) + 1} ({stats[axis.key]})
              </text>
              {gain > 0 && (
                <text
                  x={labelPos.x}
                  y={
                    labelPos.y -
                    15 -
                    (isResult && animRatio > 1 ? (animRatio - 1) * 14 : 0)
                  }
                  textAnchor="middle"
                  className="fill-[#FBFF12] font-black text-[11px]"
                >
                  ♪♪+{gain}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
