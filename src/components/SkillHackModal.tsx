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
    <div className="fixed inset-0 z-50 bg-[#0C0F0A]/90 backdrop-blur-sm flex items-center justify-center p-3">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, rotate: -2 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        className="w-full max-w-md max-h-[90vh] bg-[#141911] border-2 border-white shadow-p5-pink flex flex-col overflow-hidden"
      >
        {/* ヘッダー */}
        <div className="bg-[#FF206E] px-4 py-3 flex items-center justify-between border-b-2 border-white">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#FBFF12]" />
            <h2 className="font-black text-lg tracking-tight italic text-white">
              SYSTEM HACK &amp; EVOLUTION
            </h2>
          </div>
          <button
            onClick={() => {
              soundEngine.playTap();
              onClose();
            }}
            className="bg-[#0C0F0A] text-white p-1.5 border border-white hover:bg-[#FBFF12] hover:text-[#0C0F0A] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* タブ切り替え */}
        <div className="grid grid-cols-2 bg-[#0C0F0A] border-b-2 border-[#2C3527] p-1.5 gap-2">
          <button
            onClick={() => {
              soundEngine.playTap();
              setTab("skills");
            }}
            className={`py-2 font-black text-xs tracking-wider uppercase transition ${
              tab === "skills"
                ? "bg-[#FBFF12] text-[#0C0F0A] -skew-x-6 shadow-[3px_3px_0_#FF206E]"
                : "bg-[#141911] text-[#A3B19B]"
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
            className={`py-2 font-black text-xs tracking-wider uppercase transition ${
              tab === "evolution"
                ? "bg-[#FBFF12] text-[#0C0F0A] -skew-x-6 shadow-[3px_3px_0_#FF206E]"
                : "bg-[#141911] text-[#A3B19B]"
            }`}
          >
            👾 ドット絵10段階図鑑
          </button>
        </div>

        {/* コンテンツ領域 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
          {tab === "skills" ? (
            <>
              <div className="bg-[#0C0F0A] border border-[#2C3527] p-3 text-xs text-[#C8D4C2] leading-relaxed">
                <span className="text-[#FBFF12] font-black">
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
                          ? "bg-[#0C0F0A] border-[#FBFF12] shadow-[4px_4px_0_#FF206E]"
                          : "bg-[#0C0F0A] border-white"
                        : "bg-[#0C0F0A]/60 border-[#2C3527] opacity-65"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-black mb-1 -skew-x-6 ${
                            isUnlocked
                              ? "bg-[#FF206E] text-white"
                              : "bg-[#2C3527] text-[#A3B19B]"
                          }`}
                        >
                          {skill.badge}
                        </span>
                        <h3 className="font-black text-sm text-white flex items-center gap-1.5">
                          {!isUnlocked && (
                            <Lock className="w-3.5 h-3.5 text-[#A3B19B]" />
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
                              ? "bg-[#FBFF12] text-[#0C0F0A] border-[#0C0F0A]"
                              : "bg-[#141911] text-[#A3B19B] border-[#2C3527]"
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
                        <span className="text-[11px] font-black text-[#A3B19B] shrink-0">
                          Lv.{skill.unlockLevel}で解禁
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#C8D4C2] mt-1.5 leading-relaxed">
                      {skill.description}
                    </p>
                    <div className="mt-2 text-[11px] font-extrabold text-[#41EAD4]">
                      ▶ 効果: {skill.effectSummary}
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <>
              <div className="bg-[#0C0F0A] border border-[#2C3527] p-3 text-xs text-[#C8D4C2] flex items-center justify-between">
                <div>
                  現在:{" "}
                  <span className="text-[#FBFF12] font-black">
                    第{Math.min(10, profile.level)}段階進化
                  </span>{" "}
                  ({profile.gender === "boy" ? "男子" : "女子"}ルート)
                </div>
                <span className="text-[11px] text-[#41EAD4]">
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
                          ? "bg-[#0C0F0A] border-[#FBFF12] shadow-[3px_3px_0_#FF206E]"
                          : unlocked
                          ? "bg-[#0C0F0A] border-[#41EAD4] hover:border-white"
                          : "bg-[#0C0F0A]/70 border-[#2C3527] opacity-75 hover:opacity-100"
                      }`}
                    >
                      <div className="w-full flex items-center justify-between text-[10px] font-black mb-1">
                        <span className="bg-[#FF206E] text-white px-1.5 py-0.5">
                          Lv.{st.stage}
                        </span>
                        {isCurrent && (
                          <span className="text-[#FBFF12] flex items-center gap-0.5">
                            <Sparkles className="w-3 h-3" /> NOW
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
                        <div className="text-[9px] text-[#41EAD4] mt-0.5">
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
        <div className="bg-[#0C0F0A] border-t-2 border-[#2C3527] p-3 flex items-center justify-between gap-2">
          <div className="text-[11px] text-[#C8D4C2]">
            <span className="text-[#41EAD4] font-black">
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
              className="bg-[#141911] text-[#A3B19B] hover:text-white font-bold text-xs px-2.5 py-1.5 border border-[#2C3527] hover:border-white transition"
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
              className="bg-[#FBFF12] text-[#0C0F0A] font-black text-xs px-3 py-1.5 border border-white flex items-center gap-1 hover:brightness-110 active:scale-95 transition"
            >
              <Zap className="w-3.5 h-3.5 fill-[#0C0F0A]" />
              Lv.{profile.level >= 10 ? "1へ戻す" : `${profile.level + 1}に進化！`}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
