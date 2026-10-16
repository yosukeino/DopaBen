"use client";

import React from "react";
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

  const statPolygon = AXES.map((axis, i) => {
    const val = Math.min(maxStat, Math.max(14, stats[axis.key]));
    const p = getPoint(i, val / maxStat);
    return `${p.x},${p.y}`;
  }).join(" ");

  return (
    <div className="relative flex items-center justify-center">
      <svg viewBox="0 0 220 220" className="w-52 h-52 overflow-visible">
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
          const dot = getPoint(i, val / maxStat);
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
