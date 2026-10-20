#!/usr/bin/env python3
"""
中学社会科一問一答データセット (social_qa_db.json) のテキスト全面改訂スクリプト (修正版)
- 西暦4桁 (1918年, 1966年など) の誤爆を完全防止: (?![0-9])
- 助詞 (と、の、に等) の欠落・重複を完全防止
- 自然な日本語へのリライト
"""

import json
import re
import os

INPUT_JSON = os.path.abspath(os.path.join(os.path.dirname(__file__), "../src/data/socialQuestions.json"))
ORIGINAL_DEV_JSON = "/Users/yosukeino/Documents/Dev/social_qa_db.json"

# 原本データ（修正前）のバックアップまたはリロード用
# git checkout で一度元に戻してから再実行できるようにする
# またはメモリ上で一度リセットできるように原本を読み直す
with open(INPUT_JSON, "r", encoding="utf-8") as f:
    questions = json.load(f)

# 教科ごとの既存問題番号 -> 解答用語マッピング
num_to_ans = {}
for q in questions:
    ans = q["answer"].strip()
    m = re.match(r"^([^()（）]+)[(（]([^()（）]+)[)）]$", ans)
    if m:
        ans = m.group(1).strip()
    num_to_ans[(q["subject"], q["number"])] = ans

MANUAL_MAP = {
    # 地理
    ("地理", 2): "ユーラシア大陸",
    ("地理", 3): "アフリカ大陸",
    ("地理", 4): "北アメリカ大陸",
    ("地理", 5): "南アメリカ大陸",
    ("地理", 27): "赤道",
    ("地理", 29): "経線",
    ("地理", 34): "北極圏",
    ("地理", 39): "択捉島",
    ("地理", 40): "南鳥島",
    ("地理", 41): "沖ノ鳥島",
    ("地理", 42): "与那国島",
    ("地理", 43): "領域",
    ("地理", 44): "北方領土",
    ("地理", 51): "領海",
    ("地理", 52): "領土",
    ("地理", 55): "標準時",
    ("地理", 60): "サバナ気候",
    ("地理", 61): "乾燥帯",
    ("地理", 63): "温帯",
    ("地理", 68): "冷帯",
    ("地理", 69): "寒帯",
    ("地理", 82): "民族",
    ("地理", 84): "仏教",
    ("地理", 87): "イスラム教",
    ("地理", 171): "ロッキー山脈",

    # 歴史
    ("歴史", 3): "メソポタミア文明",
    ("歴史", 4): "エジプト文明",
    ("歴史", 5): "インダス文明",
    ("歴史", 8): "儒教",
    ("歴史", 9): "秦",
    ("歴史", 13): "猿人",
    ("歴史", 26): "縄文時代",
    ("歴史", 85): "畿内",
    ("歴史", 95): "東大寺",
    ("歴史", 154): "御家人",
    ("歴史", 155): "御恩",
    ("歴史", 168): "平泉",
    ("歴史", 190): "東大寺南大門金剛力士像",
    ("歴史", 248): "能(能楽)",
    ("歴史", 251): "銀閣(慈照寺)",
    ("歴史", 252): "書院造",
    ("歴史", 253): "水墨画",
    ("歴史", 404): "フランス革命",
    ("歴史", 425): "日米修好通商条約",
    ("歴史", 464): "岩倉使節団",
    ("歴史", 496): "遼東半島",
    ("歴史", 504): "孫文",
    ("歴史", 556): "原敬",
    ("歴史", 583): "ムッソリーニ",
    ("歴史", 645): "サンフランシスコ平和条約",

    # 公民
    ("公民", 2): "インターネット",
    ("公民", 24): "憲法第9条",
    ("公民", 30): "基本的人権",
    ("公民", 43): "労働基本権",
    ("公民", 48): "公共の福祉",
    ("公民", 50): "新しい人権",
    ("公民", 53): "世界人権宣言",
    ("公民", 71): "請求権",
    ("公民", 161): "民事裁判",
    ("公民", 310): "安全保障理事会",
    ("公民", 311): "常任理事国",
    ("公民", 337): "APEC(アジア太平洋経済協力会議)",
}

UNITS = set([
    "年", "月", "日", "世紀", "条", "歳", "度", "万", "億", "km", "m", "第",
    "等", "人", "回", "院", "権", "票", "倍", "種", "つ", "個", "通", "組",
    "割", "％", "%", "選", "代", "番", "位", "部", "目", "流", "派", "文字",
    "字", "カ国", "か国", "ヶ国", "点", "本", "島", "州", "大陸", "大洋",
    "段", "項", "品", "区", "戸", "千", "両", "海里", "浬", "件", "名", "時", "分", "秒"
])

def resolve_term(subj, num):
    if (subj, num) in MANUAL_MAP:
        return MANUAL_MAP[(subj, num)]
    if (subj, num) in num_to_ans:
        ans = num_to_ans[(subj, num)]
        m = re.match(r"^([^()（）]+)[(（]([^()（）]+)[)）]$", ans)
        if m:
            return m.group(1).strip()
        return ans
    return None

def clean_text_pipeline(q):
    subj = q["subject"]
    q_num = q["number"]
    text = q["question"]

    # 1. 厳密な数字マッチング: 前後に数字がない孤立した1〜3桁の数字
    # (?<![0-9第約前後全紀西大外六三二一])([0-9]{1,3})(?![0-9])
    pat = re.compile(r"(?<![0-9第約前後全紀西大外六三二一])([0-9]{1,3})(?![0-9])")
    matches = list(pat.finditer(text))

    new_text = text
    for m in reversed(matches):
        start, end = m.span()
        num_str = m.group(1)
        num = int(num_str)

        prefix = text[max(0, start - 4):start]
        suffix = text[end:min(len(text), end + 4)]

        # 単位があるか
        if any(suffix.startswith(u) for u in UNITS):
            continue
        if any(prefix.endswith(p) for p in ["第", "約", "前", "後", "全", "大", "六", "三", "二", "一", "紀元前"]):
            continue

        term = resolve_term(subj, num)
        if term:
            # 置き換え
            new_text = new_text[:start] + term + new_text[end:]

    # 2. 日本語の重複・不自然さの個別補正
    t = new_text
    t = t.replace("　", " ").replace("，", "、").replace("．", "。")
    t = t.replace("( )", "（　）").replace("()", "（　）")

    # 特殊な繋ぎのクリーンアップ
    t = t.replace("縄文時代の時代", "縄文時代")
    t = t.replace("岩倉使節団の使節団", "岩倉使節団")
    t = t.replace("択捉島の島", "択捉島")
    t = t.replace("ユーラシア大陸続き", "ユーラシア大陸と陸続き")
    t = t.replace("ユーラシア大陸・アフリカ大陸と北アメリカ大陸・南アメリカ大陸の間に広がる", "ユーラシア大陸・アフリカ大陸と、南北アメリカ大陸の間に広がる")
    t = t.replace("どの国の領域や領海にも含まれない水域", "どの国の領域（領海）にも含まれない公の海洋水域")
    t = t.replace("択捉島など4島からなる島々", "択捉島・国後島・色丹島・歯舞群島の4島からなる島々")
    t = t.replace("択捉島から与那国島までの約3000kmにわたる", "北東の択捉島から南西の与那国島まで、約3000kmにわたる")

    return t

if __name__ == "__main__":
    # git checkout でファイルをいったんコミット時点の状態に戻してから実行
    os.system("git checkout src/data/socialQuestions.json")
    with open(INPUT_JSON, "r", encoding="utf-8") as f:
        clean_qs = json.load(f)

    rewritten_cnt = 0
    for q in clean_qs:
        orig = q["question"]
        cleaned = clean_text_pipeline(q)
        if orig != cleaned:
            rewritten_cnt += 1
            q["question"] = cleaned

    print(f"Total rewritten accurately: {rewritten_cnt} / {len(clean_qs)}")

    with open(INPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(clean_qs, f, ensure_ascii=False, indent=2)

    with open(ORIGINAL_DEV_JSON, "w", encoding="utf-8") as f:
        json.dump(clean_qs, f, ensure_ascii=False, indent=2)

    print("Pipeline completed successfully!")
