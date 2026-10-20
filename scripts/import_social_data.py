#!/usr/bin/env python3
"""
社会科問題データ (social_qa_db.json) のデータベース投入・変換スクリプト
1. SQLite データベース (social_qa.db) への作成・格納
2. Supabase / PostgreSQL 用のシード SQL (supabase/social_seed.sql) の生成
"""

import json
import sqlite3
import os

JSON_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../src/data/socialQuestions.json"))
SQLITE_DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../social_qa.db"))
SUPABASE_SEED_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../supabase/social_seed.sql"))

def load_questions():
    with open(JSON_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def import_to_sqlite(questions):
    conn = sqlite3.connect(SQLITE_DB_PATH)
    cursor = conn.cursor()

    # テーブル作成
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS social_questions (
        id INTEGER PRIMARY KEY,
        subject TEXT NOT NULL,
        chapter TEXT NOT NULL,
        section TEXT NOT NULL,
        number INTEGER NOT NULL,
        stage INTEGER NOT NULL,
        is_difficult INTEGER NOT NULL,
        question TEXT NOT NULL,
        supplement TEXT,
        answer TEXT NOT NULL,
        answer_kana TEXT
    );
    """)

    cursor.execute("CREATE INDEX IF NOT EXISTS idx_subject ON social_questions(subject);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_chapter ON social_questions(chapter);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_stage ON social_questions(stage);")

    # 既存データをクリア
    cursor.execute("DELETE FROM social_questions;")

    # データ挿入
    insert_sql = """
    INSERT INTO social_questions (
        id, subject, chapter, section, number, stage, is_difficult, question, supplement, answer, answer_kana
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """

    records = [
        (
            q["id"],
            q["subject"],
            q["chapter"],
            q.get("section", ""),
            q["number"],
            q["stage"],
            1 if q.get("is_difficult", False) else 0,
            q["question"],
            q.get("supplement", ""),
            q["answer"],
            q.get("answer_kana", "")
        )
        for q in questions
    ]

    cursor.executemany(insert_sql, records)
    conn.commit()
    conn.close()
    print(f"✅ SQLite へのインポート完了: {len(records)} 件 -> {SQLITE_DB_PATH}")

def generate_supabase_seed(questions):
    def escape_str(s):
        if s is None:
            return "''"
        return "'" + str(s).replace("'", "''") + "'"

    lines = []
    lines.append("-- 中学社会一問一答 シードデータ (全1,331問)")
    lines.append("""
CREATE TABLE IF NOT EXISTS social_questions (
    id SERIAL PRIMARY KEY,
    subject VARCHAR(20) NOT NULL,
    chapter VARCHAR(100) NOT NULL,
    section VARCHAR(100),
    number INTEGER NOT NULL,
    stage INTEGER NOT NULL,
    is_difficult BOOLEAN DEFAULT FALSE,
    question TEXT NOT NULL,
    supplement TEXT,
    answer VARCHAR(255) NOT NULL,
    answer_kana VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_social_subject ON social_questions(subject);
CREATE INDEX IF NOT EXISTS idx_social_chapter ON social_questions(chapter);
CREATE INDEX IF NOT EXISTS idx_social_stage ON social_questions(stage);
""")

    lines.append("INSERT INTO social_questions (id, subject, chapter, section, number, stage, is_difficult, question, supplement, answer, answer_kana) VALUES")

    value_rows = []
    for q in questions:
        diff = "TRUE" if q.get("is_difficult", False) else "FALSE"
        row = f"  ({q['id']}, {escape_str(q['subject'])}, {escape_str(q['chapter'])}, {escape_str(q.get('section', ''))}, {q['number']}, {q['stage']}, {diff}, {escape_str(q['question'])}, {escape_str(q.get('supplement', ''))}, {escape_str(q['answer'])}, {escape_str(q.get('answer_kana', ''))})"
        value_rows.append(row)

    lines.append(",\n".join(value_rows))
    lines.append("ON CONFLICT (id) DO UPDATE SET")
    lines.append("  subject = EXCLUDED.subject,")
    lines.append("  chapter = EXCLUDED.chapter,")
    lines.append("  section = EXCLUDED.section,")
    lines.append("  number = EXCLUDED.number,")
    lines.append("  stage = EXCLUDED.stage,")
    lines.append("  is_difficult = EXCLUDED.is_difficult,")
    lines.append("  question = EXCLUDED.question,")
    lines.append("  supplement = EXCLUDED.supplement,")
    lines.append("  answer = EXCLUDED.answer,")
    lines.append("  answer_kana = EXCLUDED.answer_kana;")

    with open(SUPABASE_SEED_PATH, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    print(f"✅ Supabase シード SQL 生成完了: {SUPABASE_SEED_PATH}")

if __name__ == "__main__":
    qs = load_questions()
    import_to_sqlite(qs)
    generate_supabase_seed(qs)
