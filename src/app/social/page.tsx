"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Sparkles,
  Trophy,
  Flame,
  Zap,
  Shield,
  HelpCircle,
  ExternalLink,
} from "lucide-react";

export default function DopaSocPage() {
  const [gender, setGender] = useState<"boy" | "girl">("boy");

  return (
    <div className="min-h-screen w-full bg-[#0B0D12] bg-halftone text-white flex flex-col items-center justify-start p-4 sm:p-6 select-none">
      <div className="w-full max-w-md space-y-4">
        {/* トップナビゲーション */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="px-3 py-1.5 rounded-lg bg-[#1E293B] hover:bg-[#334155] border border-[#475569] text-[#94A3B8] hover:text-white text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>教科選択へ戻る</span>
          </Link>

          <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40">
            中学社会編 DopaSoc
          </span>
        </div>

        {/* メインヒーローカード */}
        <div className="bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#0B0D12] border-2 border-white p-5 rounded-2xl shadow-p5-red relative overflow-hidden">
          {/* 背景の幾何学装飾 */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#EF4444]/15 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚾</span>
              <div>
                <span className="text-[10px] font-black tracking-widest text-[#EF4444] uppercase">
                  Baseball × Social Studies Battle
                </span>
                <h1 className="text-xl font-black italic text-white tracking-wide">
                  DopaSoc 〜熱闘！社会科ベースボール〜
                </h1>
              </div>
            </div>

            <p className="text-xs text-[#CBD5E1] leading-relaxed">
              歴史の年号、地理の気候・地形、公民の憲法・三権分立を「フルスイング」で打ち返せ！
              キャラクターは全員【学園野球部】！
            </p>

            {/* 男子・女子切り替えピル */}
            <div className="pt-2 flex items-center justify-between border-t border-[#334155]">
              <span className="text-xs font-bold text-[#94A3B8]">性別プレビュー:</span>
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#090D16] border border-[#334155]">
                <button
                  onClick={() => setGender("boy")}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition ${
                    gender === "boy"
                      ? "bg-[#38BDF8] text-slate-950 shadow-sm"
                      : "text-[#94A3B8] hover:text-white"
                  }`}
                >
                  男子 👦
                </button>
                <button
                  onClick={() => setGender("girl")}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition ${
                    gender === "girl"
                      ? "bg-[#F43F5E] text-white shadow-sm"
                      : "text-[#94A3B8] hover:text-white"
                  }`}
                >
                  女子 👧
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 野球部キャラクター ＆ 着せ替え仕様プレビュー */}
        <div className="bg-[#131720] border-2 border-[#334155] p-4 rounded-2xl space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FACC15]" />
              <span>野球部アバター着せ替えシステム（仕様策定中）</span>
            </h2>
            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-[#FACC15]/20 text-[#FACC15]">
              4色パレット対応
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-[#0B0D12] border border-[#262D3D] space-y-1">
              <span className="text-xl">👕</span>
              <div className="font-black text-white text-[11px]">ユニフォーム</div>
              <div className="text-[9px] text-[#94A3B8]">縦縞 / オールド / 特注</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0B0D12] border border-[#262D3D] space-y-1">
              <span className="text-xl">🏏</span>
              <div className="font-black text-white text-[11px]">バット</div>
              <div className="text-[9px] text-[#94A3B8]">木製 / 金属 / Vバット</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0B0D12] border border-[#262D3D] space-y-1">
              <span className="text-xl">🧤</span>
              <div className="font-black text-white text-[11px]">グローブ</div>
              <div className="text-[9px] text-[#94A3B8]">レザー / ミット / 金革</div>
            </div>
          </div>
        </div>

        {/* 開発状況ステータスカード */}
        <div className="bg-gradient-to-br from-[#1E293B] to-[#111827] border-2 border-[#FACC15] p-4 rounded-2xl space-y-2 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-xl">🚀</span>
            <div className="font-black text-sm text-[#FACC15]">
              別スレッドにて本格実装中！
            </div>
          </div>
          <p className="text-xs text-[#CBD5E1] leading-relaxed">
            現在、画像データから抽出された「中学社会（歴史・地理・公民）」の問題データを投入し、
            野球部キャラクターのドット絵と打撃バトルを別スレッドで集中的に作り込んでいます。
          </p>
          <div className="pt-2 flex justify-end">
            <Link
              href="/"
              className="px-4 py-2 rounded-xl bg-[#FACC15] hover:bg-[#FFE600] text-black font-black text-xs active:scale-95 transition shadow-sm inline-flex items-center gap-1.5"
            >
              <span>まずは英語編（DopaEng）を遊ぶ</span>
              <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
