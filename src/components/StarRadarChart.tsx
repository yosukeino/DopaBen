"use client";

import React, { useEffect, useState } from "react";
import { FiveStats } from "@/lib/types";

interface StarRadarChartProps {
  stats: FiveStats;
  recentGains?: Partial<FiveStats>;
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
}) => {
  const cx = 110;
  const cy = 110;
  const maxR = 66;
  const maxStat = 100;

  // 中心からグインと伸びるアニメーション比率 (0 -> 1, duration: 0.2秒 = 200ms)
  const [animRatio, setAnimRatio] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    const duration = 200; // 0.2秒
    let rafId: number;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(1, elapsed / duration);

      // easeOutBack イージング（中心からグインと勢いよく伸びてピタッと着地）
      const c1 = 1.35;
      const c3 = c1 + 1;
      const eased =
        1 + c3 * Math.pow(progress - 1, 3) + c1 * Math.pow(progress - 1, 2);
      setAnimRatio(Math.max(0, eased));

      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        setAnimRatio(1);
      }
    };

    setAnimRatio(0);
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [stats]);

  const getPoint = (index: number, ratio: number) => {
    const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2;
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

  // animRatioを掛けることで、中心(cx, cy)からグインと外側へ伸びる
  const statPolygon = AXES.map((axis, i) => {
    const val = Math.min(maxStat, Math.max(14, stats[axis.key]));
    const p = getPoint(i, (val / maxStat) * animRatio);
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

        {/* プレイヤーの現在のステータス領域 (#FF206E 塗り × #FBFF12 エッジ) */}
        <polygon
          points={statPolygon}
          fill="url(#dopaRadarFill)"
          stroke="#FBFF12"
          strokeWidth="2.5"
        />

        {/* 各頂点のドットとラベル */}
        {AXES.map((axis, i) => {
          const val = Math.min(maxStat, Math.max(14, stats[axis.key]));
          const dot = getPoint(i, (val / maxStat) * animRatio);
          const labelPos = getPoint(i, 1.33);
          const gain = recentGains?.[axis.key] || 0;

          return (
            <g key={axis.key}>
              <circle
                cx={dot.x}
                cy={dot.y}
                r="4.5"
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
                  y={labelPos.y - 15}
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
