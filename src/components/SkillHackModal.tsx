"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Sparkles, Terminal, Check, X, Zap } from "lucide-react";
import { PlayerProfile, SkillHackId } from "@/lib/types";
import { EVOLUTION_STAGES, SKILL_HACKS } from "@/lib/vocabData";
import { PixelCharacter } from "./PixelCharacter";
import { soundEngine } from "@/lib/soundEngine";

interface SkillHackModalProps {
  profile: PlayerProfile;
  onToggleSkill: (skillId: SkillHackId) => void;
  onInstantLevelChange: (newLevel: number) => void;
  onClose: () => void;
}

export const SkillHackModal: React.FC<SkillHackModalProps> = ({
  profile,
  onToggleSkill,
  onInstantLevelChange,
  onClose,
}) => {
  const [tab, setTab] = useState<"skills" | "evolution">("skills");

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0D12]/90 backdrop-blur-sm flex items-center justify-center p-3">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, rotate: -2 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        className="w-full max-w-md max-h-[90vh] bg-[#131720] border-2 border-white shadow-p5-yellow flex flex-col overflow-hidden"
      >
        {/* ヘッダー */}
        <div className="bg-[#131720] px-4 py-3 flex items-center justify-between border-b-2 border-white">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#FACC15]" />
            <h2 className="font-black text-lg tracking-tight italic text-white">
              SYSTEM HACK &amp; EVOLUTION
            </h2>
          </div>
          <button
            onClick={() => {
              soundEngine.playTap();
              onClose();
            }}
            className="bg-[#0B0D12] text-white p-1.5 border border-white hover:bg-[#FACC15] hover:text-[#0B0D12] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* タブ切り替え（選択中＝黄色 #FACC15 に統一） */}
        <div className="grid grid-cols-2 bg-[#0B0D12] border-b-2 border-[#262D3D] p-1.5 gap-2">
          <button
            onClick={() => {
              soundEngine.playTap();
              setTab("skills");
            }}
            className={`py-2 font-black text-xs tracking-wider uppercase border transition ${
              tab === "skills"
                ? "bg-[#FACC15] text-[#0B0D12] border-white -skew-x-6"
                : "bg-[#131720] text-[#94A3B8] border-[#262D3D] hover:text-white"
            }`}
          >
            ⚡ 特権スキルハック (
            {SKILL_HACKS.filter((s) => profile.level >= s.unlockLevel).length}/
            {SKILL_HACKS.length})
          </button>
          <button
            onClick={() => {
              soundEngine.playTap();
              setTab("evolution");
            }}
            className={`py-2 font-black text-xs tracking-wider uppercase border transition ${
              tab === "evolution"
                ? "bg-[#FACC15] text-[#0B0D12] border-white -skew-x-6"
                : "bg-[#131720] text-[#94A3B8] border-[#262D3D] hover:text-white"
            }`}
          >
            👾 ドット絵10段階図鑑
          </button>
        </div>

        {/* コンテンツ領域 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
          {tab === "skills" ? (
            <>
              <div className="bg-[#0B0D12] border border-[#262D3D] p-3 text-xs text-[#94A3B8] leading-relaxed">
                <span className="text-[#FACC15] font-black">
                  【育成×機能ハック】
                </span>{" "}
                キャラのレベルが上がると、ゲームのルール自体を書き換える特権スキル（激ムズ問題挑戦権など）がアンロックされます！
              </div>

              {SKILL_HACKS.map((skill) => {
                const isUnlocked = profile.level >= skill.unlockLevel;
                const isActive = profile.activeSkillHacks.includes(skill.id);

                return (
                  <div
                    key={skill.id}
                    className={`p-3.5 border-2 transition relative ${
                      isUnlocked
                        ? isActive
                          ? "bg-[#0B0D12] border-[#FACC15] shadow-[4px_4px_0_#10B981]"
                          : "bg-[#0B0D12] border-white"
                        : "bg-[#0B0D12]/60 border-[#262D3D] opacity-65"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-black mb-1 -skew-x-6 ${
                            isUnlocked
                              ? "bg-[#10B981] text-[#0B0D12]"
                              : "bg-[#262D3D] text-[#94A3B8]"
                          }`}
                        >
                          {skill.badge}
                        </span>
                        <h3 className="font-black text-sm text-white flex items-center gap-1.5">
                          {!isUnlocked && (
                            <Lock className="w-3.5 h-3.5 text-[#94A3B8]" />
                          )}
                          {skill.name}
                        </h3>
                      </div>

                      {isUnlocked ? (
                        <button
                          onClick={() => {
                            soundEngine.playTap();
                            onToggleSkill(skill.id);
                          }}
                          className={`px-3 py-1.5 font-black text-xs border-2 transition flex items-center gap-1 shrink-0 ${
                            isActive
                              ? "bg-[#FACC15] text-[#0B0D12] border-white"
                              : "bg-[#131720] text-[#94A3B8] border-[#262D3D]"
                          }`}
                        >
                          {isActive ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" /> ON
                            </>
                          ) : (
                            "OFF"
                          )}
                        </button>
                      ) : (
                        <span className="text-[11px] font-black text-[#94A3B8] shrink-0">
                          Lv.{skill.unlockLevel}で解禁
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">
                      {skill.description}
                    </p>
                    <div className="mt-2 text-[11px] font-extrabold text-[#10B981]">
                      ▶ 効果: {skill.effectSummary}
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <>
              <div className="bg-[#0B0D12] border border-[#262D3D] p-3 text-xs text-[#94A3B8] flex items-center justify-between">
                <div>
                  現在:{" "}
                  <span className="text-[#FACC15] font-black">
                    第{Math.min(10, profile.level)}段階進化
                  </span>{" "}
                  ({profile.gender === "boy" ? "男子" : "女子"}ルート)
                </div>
                <span className="text-[11px] text-[#10B981]">
                  タップで任意の段階を試着可能
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {EVOLUTION_STAGES.map((st) => {
                  const unlocked = profile.level >= st.stage;
                  const isCurrent = Math.min(10, profile.level) === st.stage;

                  return (
                    <button
                      key={st.stage}
                      onClick={() => {
                        soundEngine.playEvolutionFanfare();
                        onInstantLevelChange(st.stage);
                      }}
                      className={`p-2.5 border-2 text-left transition flex flex-col items-center relative ${
                        isCurrent
                          ? "bg-[#0B0D12] border-[#FACC15] shadow-[3px_3px_0_#10B981]"
                          : unlocked
                          ? "bg-[#0B0D12] border-[#10B981] hover:border-[#FACC15]"
                          : "bg-[#0B0D12]/70 border-[#262D3D] opacity-75 hover:opacity-100"
                      }`}
                    >
                      <div className="w-full flex items-center justify-between text-[10px] font-black mb-1">
                        <span
                          className={`px-1.5 py-0.5 ${
                            isCurrent
                              ? "bg-[#FACC15] text-[#0B0D12]"
                              : unlocked
                              ? "bg-[#10B981] text-[#0B0D12]"
                              : "bg-[#262D3D] text-[#94A3B8]"
                          }`}
                        >
                          Lv.{st.stage}
                        </span>
                        {isCurrent && (
                          <span className="text-[#FACC15] flex items-center gap-0.5">
                            <Sparkles className="w-3 h-3" /> 選択中
                          </span>
                        )}
                      </div>

                      <PixelCharacter
                        gender={profile.gender}
                        stage={st.stage}
                        size={76}
                        showAura={isCurrent}
                      />

                      <div className="mt-1.5 text-center">
                        <div className="font-black text-xs text-white leading-tight">
                          {profile.gender === "boy"
                            ? st.titleBoy
                            : st.titleGirl}
                        </div>
                        <div className="text-[9px] text-[#94A3B8] mt-0.5">
                          {st.subtitle}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* プロトタイプ検証用：ワンタップ進化＆レベル切替バー */}
        <div className="bg-[#0B0D12] border-t-2 border-[#262D3D] p-3 flex items-center justify-between gap-2">
          <div className="text-[11px] text-[#94A3B8]">
            <span className="text-[#FACC15] font-black">
              🔧 プロトタイプ検証:
            </span>{" "}
            進化段階・特権スキルを即テスト
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                soundEngine.playTap();
                onInstantLevelChange(1);
              }}
              className="bg-[#131720] text-[#94A3B8] hover:text-white font-bold text-xs px-2.5 py-1.5 border border-[#262D3D] hover:border-white transition"
              title="Lv.1 (0 EXP) からやり直す"
            >
              🔄 Lv.1リセット
            </button>
            <button
              onClick={() => {
                const nextLv = profile.level >= 10 ? 1 : profile.level + 1;
                soundEngine.playEvolutionFanfare();
                onInstantLevelChange(nextLv);
              }}
              className="bg-[#FACC15] text-[#0B0D12] font-black text-xs px-3 py-1.5 border border-white flex items-center gap-1 hover:brightness-110 active:scale-95 transition"
            >
              <Zap className="w-3.5 h-3.5 fill-[#0B0D12]" />
              Lv.{profile.level >= 10 ? "1へ戻す" : `${profile.level + 1}に進化！`}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
