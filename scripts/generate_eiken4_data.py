import json
import random
import os
import urllib.request
import urllib.error

INPUT_JSON = '/Users/yosukeino/Documents/Dev/pass_tan_4q.json'
OUTPUT_SQL = '/Users/yosukeino/Documents/Dev/DopaBen/supabase/eiken4_seed.sql'

SUPABASE_URL = 'https://ulhkcbixyzfwpwbwwiby.supabase.co'
SUPABASE_KEY = 'sb_publishable_lOuGUxWJpNRI0seCq8CgfQ_kQat3JND'

STAGES_DEF = [
    # 学校で習う単語 (001〜349 / 349語)
    {"slug": "eiken4_stage01", "unit_number": 1, "range": (1, 58), "title": "📗 英検4級【Stage 01】", "subtitle": "学校で習う単語 Part 1 (001〜058 / 58語)", "sort_order": 401},
    {"slug": "eiken4_stage02", "unit_number": 2, "range": (59, 116), "title": "📗 英検4級【Stage 02】", "subtitle": "学校で習う単語 Part 2 (059〜116 / 58語)", "sort_order": 402},
    {"slug": "eiken4_stage03", "unit_number": 3, "range": (117, 174), "title": "📗 英検4級【Stage 03】", "subtitle": "学校で習う単語 Part 3 (117〜174 / 58語)", "sort_order": 403},
    {"slug": "eiken4_stage04", "unit_number": 4, "range": (175, 232), "title": "📗 英検4級【Stage 04】", "subtitle": "学校で習う単語 Part 4 (175〜232 / 58語)", "sort_order": 404},
    {"slug": "eiken4_stage05", "unit_number": 5, "range": (233, 290), "title": "📗 英検4級【Stage 05】", "subtitle": "学校で習う単語 Part 5 (233〜290 / 58語)", "sort_order": 405},
    {"slug": "eiken4_stage06", "unit_number": 6, "range": (291, 349), "title": "📗 英検4級【Stage 06】", "subtitle": "学校で習う単語 Part 6 (291〜349 / 59語)", "sort_order": 406},

    # 英検にでる単語 (350〜600 / 251語)
    {"slug": "eiken4_stage07", "unit_number": 7, "range": (350, 412), "title": "📘 英検4級【Stage 07】", "subtitle": "でる単語 Part 1 (350〜412 / 63語)", "sort_order": 407},
    {"slug": "eiken4_stage08", "unit_number": 8, "range": (413, 475), "title": "📘 英検4級【Stage 08】", "subtitle": "でる単語 Part 2 (413〜475 / 63語)", "sort_order": 408},
    {"slug": "eiken4_stage09", "unit_number": 9, "range": (476, 538), "title": "📘 英検4級【Stage 09】", "subtitle": "でる単語 Part 3 (476〜538 / 63語)", "sort_order": 409},
    {"slug": "eiken4_stage10", "unit_number": 10, "range": (539, 600), "title": "📘 英検4級【Stage 10】", "subtitle": "でる単語 Part 4 (539〜600 / 62語)", "sort_order": 410},

    # 熟語編 (601〜700 / 100語)
    {"slug": "eiken4_stage11", "unit_number": 11, "range": (601, 650), "title": "📙 英検4級【Stage 11】", "subtitle": "重要熟語 Part 1 (601〜650 / 50語)", "sort_order": 411},
    {"slug": "eiken4_stage12", "unit_number": 12, "range": (651, 700), "title": "📙 英検4級【Stage 12】", "subtitle": "重要熟語 Part 2 (651〜700 / 50語)", "sort_order": 412},

    # まとめステージ
    {"slug": "eiken4_sum_school", "unit_number": 13, "range": (1, 349), "title": "🔥 学校単語まとめ【Stage 01〜06】", "subtitle": "学校で習う単語 総復習 (001〜349 / 全349語)", "sort_order": 413},
    {"slug": "eiken4_sum_eiken",  "unit_number": 14, "range": (350, 600), "title": "🔥 でる単語まとめ【Stage 07〜10】", "subtitle": "英検にでる単語 総復習 (350〜600 / 全251語)", "sort_order": 414},
    {"slug": "eiken4_sum_idiom",  "unit_number": 15, "range": (601, 700), "title": "🔥 熟語まとめ【Stage 11〜12】", "subtitle": "重要熟語 総復習 (601〜700 / 全100語)", "sort_order": 415},
    {"slug": "eiken4_final_all",   "unit_number": 16, "range": (1, 700), "title": "👑 英検4級 総合FINAL【全12ステージ】", "subtitle": "でる順パス単英検4級 完全制覇 (全700語)", "sort_order": 416},
]

def load_data():
    with open(INPUT_JSON, 'r', encoding='utf-8') as f:
        return json.load(f)

def get_stage_for_id(item_id):
    for stage in STAGES_DEF[:12]:
        start, end = stage["range"]
        if start <= item_id <= end:
            return stage
    return STAGES_DEF[0]

def build_entries(data):
    # ステージごとにグループ化して誤答選択肢を抽出しやすくする
    stage_to_items = {}
    for item in data:
        stage = get_stage_for_id(item["id"])
        stage_slug = stage["slug"]
        if stage_slug not in stage_to_items:
            stage_to_items[stage_slug] = []
        stage_to_items[stage_slug].append(item)

    entries = []
    for item in data:
        item_id = item["id"]
        stage = get_stage_for_id(item_id)
        stage_slug = stage["slug"]
        unit_num = stage["unit_number"]
        peer_items = stage_to_items[stage_slug]

        # 日本語訳
        meanings_list = item.get("meanings", [])
        if meanings_list:
            japanese = "、".join([m.get("meaning", "").strip() for m in meanings_list if m.get("meaning")]).strip()
        else:
            japanese = item.get("meaning", "").strip()
        if not japanese:
            japanese = item.get("word", "")

        # 記憶ヒント (tip)
        tip_parts = []
        if item.get("katakana"):
            tip_parts.append(f"[読み: {item['katakana'].strip()}]")
        if item.get("category"):
            tip_parts.append(f"カテゴリ: {item['category'].strip()}")
        if item.get("related_words"):
            rw_strs = []
            for rw in item["related_words"]:
                r_word = rw.get("word", "")
                r_meaning = rw.get("meaning", "")
                r_type = rw.get("type", "関連")
                rw_strs.append(f"{r_type}:{r_word}({r_meaning})")
            if rw_strs:
                tip_parts.append("類義/関連: " + ", ".join(rw_strs))
        if item.get("notes") and len(item["notes"]) > 0:
            notes_str = " / ".join([str(n) for n in item["notes"] if str(n).strip()])
            if notes_str:
                tip_parts.append(f"メモ: {notes_str}")
        tip = " / ".join(tip_parts) if tip_parts else f"【英検4級】{item['word']}"

        # 誤答生成 (distractors_ja, distractors_en)
        # 同品詞を優先
        pos = item.get("part_of_speech", "")
        same_pos_peers = [p for p in peer_items if p["id"] != item_id and p.get("part_of_speech") == pos]
        other_peers = [p for p in peer_items if p["id"] != item_id and p.get("part_of_speech") != pos]

        rng = random.Random(item_id * 1009 + 42)
        rng.shuffle(same_pos_peers)
        rng.shuffle(other_peers)

        distractor_candidates = (same_pos_peers + other_peers)[:3]
        if len(distractor_candidates) < 3:
            # 念のため全体から補う
            all_other = [d for d in data if d["id"] != item_id]
            rng.shuffle(all_other)
            distractor_candidates.extend(all_other[:3 - len(distractor_candidates)])

        distractors_ja = []
        distractors_en = []
        for dc in distractor_candidates[:3]:
            dc_m = dc.get("meanings", [])
            dc_ja = "、".join([m.get("meaning", "").strip() for m in dc_m if m.get("meaning")]).strip() if dc_m else dc.get("meaning", "")
            distractors_ja.append(dc_ja)
            distractors_en.append(dc["word"].strip())

        # 例文
        examples = item.get("examples", [])
        sentence_en_tokens = []
        sentence_ja = ""
        sentence_distractor_tokens = []
        if examples and len(examples) > 0:
            ex = examples[0]
            en_text = ex.get("en", "").strip()
            ja_text = ex.get("ja", "").strip()
            if en_text:
                sentence_en_tokens = en_text.split()
                sentence_ja = ja_text
                # ダミートークン（他単語から2語程度）
                if len(distractor_candidates) >= 2:
                    sentence_distractor_tokens = [d["word"].split()[0] for d in distractor_candidates[:2]]

        grammar_point = f"【英検4級 #{item_id:04d} / Stage {unit_num:02d}】{item['word']} ＝ {japanese}"

        entry = {
            "id": f"eiken4_{item_id:04d}",
            "stage_slug": stage_slug,
            "category": "英検4級",
            "unit_number": unit_num,
            "track_number": unit_num,
            "entry_number": f"{item_id:04d}",
            "english": item["word"].strip(),
            "japanese": japanese,
            "phonetic": item.get("phonetic", "").strip(),
            "part_of_speech": pos,
            "tip": tip,
            "distractors_ja": distractors_ja,
            "distractors_en": distractors_en,
            "sentence_en_tokens": sentence_en_tokens,
            "sentence_ja": sentence_ja,
            "sentence_distractor_tokens": sentence_distractor_tokens,
            "grammar_point": grammar_point
        }
        entries.append(entry)

    return entries

def escape_sql(val):
    if val is None:
        return "NULL"
    return "'" + str(val).replace("'", "''") + "'"

def generate_sql(stages, entries):
    lines = []
    lines.append("-- ============================================================")
    lines.append("-- 『ドパベン (DopaBen)』 英検4級 全16ステージ ＆ 全700単語 Seed SQL")
    lines.append("-- ============================================================")
    lines.append("")
    lines.append("BEGIN;")
    lines.append("")
    lines.append("-- 1. ステージ登録 (12通常ステージ + 3セクションまとめ + 1総合FINAL = 計16ステージ)")
    lines.append("INSERT INTO public.dopaben_stages (slug, category, unit_number, title, subtitle, sort_order, is_active)")
    lines.append("VALUES")
    
    stage_vals = []
    for s in stages:
        val = f"  ({escape_sql(s['slug'])}, '英検4級', {s['unit_number']}, {escape_sql(s['title'])}, {escape_sql(s['subtitle'])}, {s['sort_order']}, true)"
        stage_vals.append(val)
    lines.append(",\n".join(stage_vals))
    lines.append("ON CONFLICT (slug) DO UPDATE SET")
    lines.append("  category = EXCLUDED.category,")
    lines.append("  unit_number = EXCLUDED.unit_number,")
    lines.append("  title = EXCLUDED.title,")
    lines.append("  subtitle = EXCLUDED.subtitle,")
    lines.append("  sort_order = EXCLUDED.sort_order,")
    lines.append("  is_active = EXCLUDED.is_active;")
    lines.append("")
    lines.append("-- 2. 単語＆例文マスターデータ登録 (全700語)")
    lines.append("INSERT INTO public.dopaben_vocab_entries (")
    lines.append("  id, stage_slug, category, unit_number, track_number, entry_number,")
    lines.append("  english, japanese, phonetic, part_of_speech, tip,")
    lines.append("  distractors_ja, distractors_en, sentence_en_tokens, sentence_ja, sentence_distractor_tokens, grammar_point")
    lines.append(") VALUES")

    entry_vals = []
    for e in entries:
        d_ja = json.dumps(e["distractors_ja"], ensure_ascii=False)
        d_en = json.dumps(e["distractors_en"], ensure_ascii=False)
        s_tokens = json.dumps(e["sentence_en_tokens"], ensure_ascii=False)
        s_dist = json.dumps(e["sentence_distractor_tokens"], ensure_ascii=False)

        val = (
            f"  ({escape_sql(e['id'])}, {escape_sql(e['stage_slug'])}, '英検4級', {e['unit_number']}, {e['track_number']}, {escape_sql(e['entry_number'])}, "
            f"{escape_sql(e['english'])}, {escape_sql(e['japanese'])}, {escape_sql(e['phonetic'])}, {escape_sql(e['part_of_speech'])}, {escape_sql(e['tip'])}, "
            f"{escape_sql(d_ja)}::jsonb, {escape_sql(d_en)}::jsonb, {escape_sql(s_tokens)}::jsonb, {escape_sql(e['sentence_ja'])}, {escape_sql(s_dist)}::jsonb, {escape_sql(e['grammar_point'])})"
        )
        entry_vals.append(val)

    lines.append(",\n".join(entry_vals))
    lines.append("ON CONFLICT (id) DO UPDATE SET")
    lines.append("  stage_slug = EXCLUDED.stage_slug,")
    lines.append("  category = EXCLUDED.category,")
    lines.append("  unit_number = EXCLUDED.unit_number,")
    lines.append("  track_number = EXCLUDED.track_number,")
    lines.append("  entry_number = EXCLUDED.entry_number,")
    lines.append("  english = EXCLUDED.english,")
    lines.append("  japanese = EXCLUDED.japanese,")
    lines.append("  phonetic = EXCLUDED.phonetic,")
    lines.append("  part_of_speech = EXCLUDED.part_of_speech,")
    lines.append("  tip = EXCLUDED.tip,")
    lines.append("  distractors_ja = EXCLUDED.distractors_ja,")
    lines.append("  distractors_en = EXCLUDED.distractors_en,")
    lines.append("  sentence_en_tokens = EXCLUDED.sentence_en_tokens,")
    lines.append("  sentence_ja = EXCLUDED.sentence_ja,")
    lines.append("  sentence_distractor_tokens = EXCLUDED.sentence_distractor_tokens,")
    lines.append("  grammar_point = EXCLUDED.grammar_point;")
    lines.append("")
    lines.append("COMMIT;")
    lines.append("")
    return "\n".join(lines)

def upsert_to_supabase(stages, entries):
    print("--- Supabase REST API へ直接投入を開始 ---")
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }

    # 1. dopaben_stages
    stages_payload = []
    for s in stages:
        stages_payload.append({
            "slug": s["slug"],
            "category": "英検4級",
            "unit_number": s["unit_number"],
            "title": s["title"],
            "subtitle": s["subtitle"],
            "sort_order": s["sort_order"],
            "is_active": True
        })
    req = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/dopaben_stages",
        data=json.dumps(stages_payload).encode('utf-8'),
        headers=headers,
        method="POST"
    )
    try:
        with urllib.request.urlopen(req) as res:
            print(f"Stages upserted successfully: status {res.status}")
    except urllib.error.HTTPError as e:
        print(f"Error upserting stages: {e.code} {e.read().decode('utf-8')}")
        raise e

    # 2. dopaben_vocab_entries (バッチ分割: 100件ずつ)
    batch_size = 100
    for i in range(0, len(entries), batch_size):
        batch = entries[i:i + batch_size]
        req = urllib.request.Request(
            f"{SUPABASE_URL}/rest/v1/dopaben_vocab_entries",
            data=json.dumps(batch).encode('utf-8'),
            headers=headers,
            method="POST"
        )
        try:
            with urllib.request.urlopen(req) as res:
                print(f"Entries batch {i+1}〜{min(i+batch_size, len(entries))} upserted: status {res.status}")
        except urllib.error.HTTPError as e:
            print(f"Error upserting entries batch {i}: {e.code} {e.read().decode('utf-8')}")
            raise e
    print("全700語のSupabase投入が完了しました！")

def main():
    data = load_data()
    print(f"Loaded {len(data)} items from {INPUT_JSON}")
    entries = build_entries(data)
    print(f"Built {len(entries)} entries across 12 stages")

    # SQLファイル出力
    sql = generate_sql(STAGES_DEF, entries)
    with open(OUTPUT_SQL, "w", encoding="utf-8") as f:
        f.write(sql)
    print(f"SQL file written to {OUTPUT_SQL} (size: {len(sql)} bytes)")

    # Supabaseへ直接投入
    upsert_to_supabase(STAGES_DEF, entries)

if __name__ == "__main__":
    main()
