"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Zap,
  Trophy,
  BookOpen,
  Sword,
  Shield,
  Play,
  Lock,
  ChevronRight,
  Flame,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import { PlayerProfile } from "@/lib/types";
import { PixelCharacter } from "@/components/PixelCharacter";
import { soundEngine } from "@/lib/soundEngine";

const STORAGE_KEY = "dopaben_player_profile_v1";

export default function DopaBenPortalPage() {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setProfile(JSON.parse(raw));
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#0B0D12] bg-halftone text-white flex flex-col items-center justify-start p-3 sm:p-5 select-none">
      <div className="w-full max-w-md space-y-4">
        {/* 1. DopaBen ヘッダーロゴ */}
        <header className="pt-2 pb-1 text-center relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#1E293B] border border-[#FACC15]/40 shadow-inner mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[10px] font-black tracking-widest text-[#FACC15] uppercase">
              DopaBen Academy Portal // 教科選択
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black italic tracking-tighter text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            <span className="text-[#FACC15]">Dopa</span>Ben
          </h1>
          <p className="text-[11px] text-[#94A3B8] font-bold mt-0.5">
            各教科のキャラクターを育成し、学園の大ボスを討伐せよ！
          </p>
        </header>

        {/* 2. プレイヤー統合ステータスバー */}
        <div className="bg-[#131720] border-2 border-white p-3 rounded-2xl shadow-p5-yellow flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#0B0D12] border border-[#FACC15] flex items-center justify-center shrink-0 shadow-inner">
              <GraduationCap className="w-5 h-5 text-[#FACC15]" />
            </div>
            <div>
              <div className="text-[10px] text-[#94A3B8] font-bold">
                学園生ステータス
              </div>
              <div className="text-xs font-black text-white">
                {profile ? `${profile.name} (Lv.${profile.level})` : "英語新入生"}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-[#94A3B8] font-bold">総ストックLXP</div>
            <div className="text-xs font-black text-[#FACC15] flex items-center justify-end gap-1">
              <Zap className="w-3 h-3 fill-[#FACC15]" />
              <span>{(profile?.exp ?? 0).toLocaleString()} LXP</span>
            </div>
          </div>
        </div>

        {/* 3. 教科・ゲーム選択セクション */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black text-[#CBD5E1] tracking-wide flex items-center gap-1.5">
              <span>📚</span>
              <span>受講する教科を選択:</span>
            </span>
            <span className="text-[10px] font-bold text-[#94A3B8]">
              全2教科（順次拡大中）
            </span>
          </div>

          {/* ① 英語編：DopaEng (稼働中・万能勇者) */}
          <Link
            href="/english"
            onClick={() => soundEngine.playTap()}
            className="group block relative bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#0B0D12] border-2 border-white hover:border-[#FACC15] p-4 rounded-2xl shadow-p5-yellow active:scale-[0.99] transition overflow-hidden"
          >
            {/* 背景の幾何学装飾 */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#FACC15]/10 rounded-full blur-xl group-hover:scale-125 transition" />

            <div className="relative z-10 flex items-start gap-3.5">
              {/* DopaEng ミニキャラアバター */}
              <div className="w-16 h-16 rounded-xl bg-[#07090E] border-2 border-[#FACC15] p-1 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition overflow-hidden">
                <PixelCharacter
                  gender={profile?.gender ?? "boy"}
                  stage={profile?.level ?? 1}
                  size={58}
                  mood="idle"
                  showAura={false}
                  animateFrames={true}
                />
              </div>

              {/* カード詳細 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="px-2 py-0.5 rounded text-[9px] font-black bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40">
                    稼働中 PLAYABLE
                  </span>
                  <span className="text-[10px] font-black text-[#FACC15]">
                    Lv.{profile?.level ?? 1} 勇者
                  </span>
                </div>

                <h2 className="text-base font-black italic text-white tracking-wide group-hover:text-[#FACC15] transition">
                  DopaEng 〜万能勇者の英単語〜
                </h2>
                <p className="text-[11px] text-[#94A3B8] line-clamp-1 mt-0.5">
                  英検4級(700語)・ターゲット1800・英検1級
                </p>

                <div className="mt-2 flex items-center justify-between pt-2 border-t border-[#334155]">
                  <span className="text-[10px] text-[#CBD5E1] font-bold">
                    大ボス戦を率いる万能キャラクター
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#FACC15] group-hover:bg-[#FFE600] text-black font-black text-xs flex items-center gap-1 shadow-sm transition">
                    <span>教室へ出撃</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* ② 社会編：DopaSoc (全員野球部) */}
          <Link
            href="/social"
            onClick={() => soundEngine.playTap()}
            className="group block relative bg-gradient-to-br from-[#1E293B] via-[#1A121E] to-[#0B0D12] border-2 border-white hover:border-[#EF4444] p-4 rounded-2xl shadow-p5-red active:scale-[0.99] transition overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#EF4444]/15 rounded-full blur-xl group-hover:scale-125 transition" />

            <div className="relative z-10 flex items-start gap-3.5">
              {/* 野球部アイコン */}
              <div className="w-16 h-16 rounded-xl bg-[#1C0D12] border-2 border-[#EF4444] flex flex-col items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition">
                <span className="text-2xl">⚾</span>
                <span className="text-[8px] font-black text-[#EF4444]">野球部</span>
              </div>

              {/* カード詳細 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="px-2 py-0.5 rounded text-[9px] font-black bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40 animate-pulse">
                    NEW! 鋭意開発中
                  </span>
                  <span className="text-[10px] font-bold text-[#94A3B8]">
                    中学社会
                  </span>
                </div>

                <h2 className="text-base font-black italic text-white tracking-wide group-hover:text-[#EF4444] transition">
                  DopaSoc 〜熱闘！社会科ベースボール〜
                </h2>
                <p className="text-[11px] text-[#94A3B8] line-clamp-1 mt-0.5">
                  歴史・地理・公民の知識でフルスイング！
                </p>

                <div className="mt-2 flex items-center justify-between pt-2 border-t border-[#334155]">
                  <span className="text-[10px] text-[#CBD5E1] font-bold">
                    全員野球部！バット＆グローブ着せ替え
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#EF4444] group-hover:bg-[#F87171] text-white font-black text-xs flex items-center gap-1 shadow-sm transition">
                    <span>グラウンドへ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* ③ 今後の開講予定教科（予告ティザーカード） */}
          <div className="bg-[#111827]/70 border border-[#262D3D] p-3.5 rounded-2xl space-y-2">
            <span className="text-[10px] font-black text-[#94A3B8] uppercase tracking-wider block">
              COMING SOON // 今後開講される教科
            </span>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-xl bg-[#0B0D12] border border-[#1E293B] opacity-70">
                <div className="text-base">🧮</div>
                <div className="text-[10px] font-black text-[#E2E8F0]">DopaMath</div>
                <div className="text-[8px] text-[#64748B]">電脳パズル部</div>
              </div>
              <div className="p-2 rounded-xl bg-[#0B0D12] border border-[#1E293B] opacity-70">
                <div className="text-base">🧪</div>
                <div className="text-[10px] font-black text-[#E2E8F0]">DopaSci</div>
                <div className="text-[8px] text-[#64748B]">錬金実験部</div>
              </div>
              <div className="p-2 rounded-xl bg-[#0B0D12] border border-[#1E293B] opacity-70">
                <div className="text-base">📜</div>
                <div className="text-[10px] font-black text-[#E2E8F0]">DopaJap</div>
                <div className="text-[8px] text-[#64748B]">言霊文芸部</div>
              </div>
            </div>
          </div>

          {/* ④ 学園大ボス討伐戦予告 */}
          <div className="bg-gradient-to-r from-[#180A0A] to-[#1E0F14] border-2 border-[#EF4444]/60 p-3.5 rounded-2xl flex items-center gap-3 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-[#0B0D12] border border-[#EF4444] flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 text-[#EF4444]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white">
                  学園大ボス討伐戦
                </span>
                <span className="px-1.5 py-0.2 rounded text-[8px] font-black bg-[#EF4444]/30 text-[#EF4444]">
                  FINAL BOSS
                </span>
              </div>
              <p className="text-[10px] text-[#94A3B8] mt-0.5">
                全教科の仲間を育成し、集結させて大ボスを討伐せよ！
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
