import os
from PIL import Image

OUT_DIR = "/Users/yosukeino/.gemini/antigravity/brain/d3272431-aa87-451c-b4f2-8a06e52e3c51/catalog"
os.makedirs(OUT_DIR, exist_ok=True)

SIZE = 24

def create_blank():
    return [[None for _ in range(SIZE)] for _ in range(SIZE)]

def set_px(grid, x, y, col):
    if 0 <= x < SIZE and 0 <= y < SIZE:
        grid[y][x] = col

def rect_px(grid, x, y, w, h, col):
    for dy in range(h):
        for dx in range(w):
            set_px(grid, x + dx, y + dy, col)

# --- 共通ベースカラー ---
WHT        = "#FFFFFF"
EYE_BLK    = "#111827"
MOUTH_RED  = "#DC2626"
SKIN_BASE  = "#FFE4C4"
SKIN_DARK  = "#F3BA8B"

# =========================================================================
# 1. 髪型 10パターン（女子 / 男子） 色×カットのセット
# =========================================================================
GIRL_HAIR_DEFS = [
    {"id": "gh_01", "name": "フェアルーン・チェリーボブ", "base": "#D92B3A", "dark": "#9E1B28", "lite": "#FF7A8A", "type": "bob"},
    {"id": "gh_02", "name": "ミルクティー・ツインテール", "base": "#C26D2D", "dark": "#8A4312", "lite": "#E89B58", "type": "twintail"},
    {"id": "gh_03", "name": "ストロベリー・ハーフアップ", "base": "#DB2777", "dark": "#9D174D", "lite": "#F472B6", "type": "halfup"},
    {"id": "gh_04", "name": "漆黒・サラサラストレートロング", "base": "#1E293B", "dark": "#0F172A", "lite": "#475569", "type": "long"},
    {"id": "gh_05", "name": "ハニーゴールド・ポニーテール", "base": "#D97706", "dark": "#92400E", "lite": "#FBBF24", "type": "ponytail"},
    {"id": "gh_06", "name": "プラチナシルバー・ショートウルフ", "base": "#94A3B8", "dark": "#64748B", "lite": "#E2E8F0", "type": "wolf"},
    {"id": "gh_07", "name": "ショコラ・お嬢様縦ロール", "base": "#451A03", "dark": "#2E1002", "lite": "#78350F", "type": "drill"},
    {"id": "gh_08", "name": "パステルミント・お団子ツイン", "base": "#0D9488", "dark": "#115E59", "lite": "#2DD4BF", "type": "odango"},
    {"id": "gh_09", "name": "アメジスト・サイドテール", "base": "#7C3AED", "dark": "#5B21B6", "lite": "#A78BFA", "type": "sidetail"},
    {"id": "gh_10", "name": "サンセット・ゆるふわウェーブ", "base": "#EA580C", "dark": "#9A3412", "lite": "#FB923C", "type": "wave"},
]

BOY_HAIR_DEFS = [
    {"id": "bh_01", "name": "ショコラ・少年勇者ショート", "base": "#3F2B1D", "dark": "#26180E", "lite": "#6A4A32", "type": "spiky"},
    {"id": "bh_02", "name": "スレート・洗練クリーンマッシュ", "base": "#2D3748", "dark": "#1A202C", "lite": "#4A5568", "type": "mush"},
    {"id": "bh_03", "name": "アッシュブロンド・ウルフ", "base": "#CA8A04", "dark": "#854D0E", "lite": "#FACC15", "type": "wolf"},
    {"id": "bh_04", "name": "ジェットブラック・ナチュラル分け", "base": "#0F172A", "dark": "#020617", "lite": "#334155", "type": "part"},
    {"id": "bh_05", "name": "ロイヤルインディゴ・スパイキー", "base": "#3730A3", "dark": "#1E1B4B", "lite": "#6366F1", "type": "spiky2"},
    {"id": "bh_06", "name": "シルバーホワイト・アンニュイマッシュ", "base": "#94A3B8", "dark": "#475569", "lite": "#F1F5F9", "type": "mush2"},
    {"id": "bh_07", "name": "クリムゾン・ツーブロック", "base": "#991B1B", "dark": "#450A0A", "lite": "#DC2626", "type": "undercut"},
    {"id": "bh_08", "name": "キャメル・センターパート", "base": "#B45309", "dark": "#78350F", "lite": "#F59E0B", "type": "center"},
    {"id": "bh_09", "name": "ダークエメラルド・カーリー", "base": "#065F46", "dark": "#022C22", "lite": "#059669", "type": "curly"},
    {"id": "bh_10", "name": "ゴールド・覚醒勇者逆毛", "base": "#EAB308", "dark": "#A16207", "lite": "#FEF08A", "type": "crown"},
]

# =========================================================================
# 2. 制服 20種類（男女共通テーマ、それぞれ固有のスカート/スラックス）
# =========================================================================
UNIFORM_DEFS = [
    {"id": "uni_01", "name": "王道ネイビーブレザー校", "top": "#1E293B", "sub": "#FFFFFF", "acc": "#DC2626", "bot": "#1E293B", "bot_g": "#DC2626"},
    {"id": "uni_02", "name": "名門グレー進学校", "top": "#475569", "sub": "#FFFFFF", "acc": "#2563EB", "bot": "#334155", "bot_g": "#475569"},
    {"id": "uni_03", "name": "伝統セーラー＆漆黒学ラン校", "top": "#0F172A", "sub": "#FFFFFF", "acc": "#DC2626", "bot": "#0F172A", "bot_g": "#0F172A"},
    {"id": "uni_04", "name": "英国風キャメル＆緑チェック校", "top": "#D97706", "sub": "#FFFFFF", "acc": "#059669", "bot": "#78350F", "bot_g": "#047857"},
    {"id": "uni_05", "name": "放課後キャメルカーディガン校", "top": "#B45309", "sub": "#FFFFFF", "acc": "#10B981", "bot": "#991B1B", "bot_g": "#991B1B"},
    {"id": "uni_06", "name": "アスリート選抜ラインジャージ校", "top": "#1D4ED8", "sub": "#FFFFFF", "acc": "#FFFFFF", "bot": "#1E3A8A", "bot_g": "#1D4ED8"},
    {"id": "uni_07", "name": "電脳ハイテク・サイバー工専", "top": "#1E293B", "sub": "#06B6D4", "acc": "#22D3EE", "bot": "#0F172A", "bot_g": "#0F172A"},
    {"id": "uni_08", "name": "海風爽快・湘南マリン校", "top": "#FFFFFF", "sub": "#0284C7", "acc": "#0284C7", "bot": "#0369A1", "bot_g": "#0284C7"},
    {"id": "uni_09", "name": "お嬢様・ボルドー貴族学院", "top": "#831843", "sub": "#FBCFE8", "acc": "#FACC15", "bot": "#500724", "bot_g": "#831843"},
    {"id": "uni_10", "name": "図書室・知性スカラー校", "top": "#312E81", "sub": "#E0E7FF", "acc": "#C084FC", "bot": "#1E1B4B", "bot_g": "#312E81"},
    {"id": "uni_11", "name": "ストリート・オーバーサイズパーカー校", "top": "#111827", "sub": "#E5E7EB", "acc": "#F43F5E", "bot": "#374151", "bot_g": "#991B1B"},
    {"id": "uni_12", "name": "芸術音楽・コンセルヴァトワール", "top": "#0D9488", "sub": "#CCFBF1", "acc": "#F59E0B", "bot": "#115E59", "bot_g": "#0D9488"},
    {"id": "uni_13", "name": "モダン和風・神楽坂ハイカラ校", "top": "#7F1D1D", "sub": "#FEF2F2", "acc": "#15803D", "bot": "#1E293B", "bot_g": "#15803D"},
    {"id": "uni_14", "name": "自然環境・フォレストエコ校", "top": "#15803D", "sub": "#FEF3C7", "acc": "#EAB308", "bot": "#14532D", "bot_g": "#15803D"},
    {"id": "uni_15", "name": "常夏・サマーホワイト開襟校", "top": "#F8FAFC", "sub": "#38BDF8", "acc": "#0284C7", "bot": "#0284C7", "bot_g": "#38BDF8"},
    {"id": "uni_16", "name": "生徒会特注・純白テーラード校", "top": "#FFFFFF", "sub": "#F1F5F9", "acc": "#EAB308", "bot": "#0F172A", "bot_g": "#0F172A"},
    {"id": "uni_17", "name": "ミッドナイト・漆黒バイカー校", "top": "#000000", "sub": "#A855F7", "acc": "#C084FC", "bot": "#1E1B4B", "bot_g": "#581C87"},
    {"id": "uni_18", "name": "学園祭・スターアイドル校", "top": "#EC4899", "sub": "#FFFFFF", "acc": "#FACC15", "bot": "#BE185D", "bot_g": "#DB2777"},
    {"id": "uni_19", "name": "冬期限定・ダッフルコート校", "top": "#78350F", "sub": "#DC2626", "acc": "#FEF08A", "bot": "#1E293B", "bot_g": "#78350F"},
    {"id": "uni_20", "name": "万能勇者アカデミー・黄金マント校", "top": "#CA8A04", "sub": "#FEF08A", "acc": "#DC2626", "bot": "#713F12", "bot_g": "#CA8A04"},
]

# =========================================================================
# 3. レベル開放の飾り（ファンタジー進化 5段階）
# =========================================================================
# Lv.1: ノーマル（装飾なし、自然体の中学生）
# Lv.2: 英気覚醒（きらめき星屑パーティクル）
# Lv.3: 英知解放（浮遊する万能文具ビット・魔導書・光輪）
# Lv.4: 属性共鳴（激しく揺らめくオーラ・光の刃）
# Lv.5: 全知超越のゴッド（神聖な後光光輪・黄金の六翼光翼）

def apply_aura_effects(g, level, frame, is_girl):
    bob = 1 if frame == 1 else (-1 if frame == 3 else 0)
    sway = 1 if frame in [1, 2] else 0

    if level == 1:
        return # 装飾なし

    if level == 2:
        # Lv.2: わずかなきらめき星屑パーティクル
        stars = [(3, 4), (20, 6), (4, 15), (19, 14)]
        col = "#FACC15" if is_girl else "#38BDF8"
        for i, (sx, sy) in enumerate(stars):
            if (i + frame) % 2 == 0:
                set_px(g, sx, sy + bob, col)
                set_px(g, sx + 1, sy + bob, WHT)

    elif level == 3:
        # Lv.3: 浮遊する必勝文具ビット & 背後の光の輪
        # 左ビット（消しゴム/単語帳）
        h_off = 1 if frame % 2 == 0 else -1
        rect_px(g, 2, 8 + h_off, 2, 3, WHT)
        set_px(g, 2, 8 + h_off, "#38BDF8")
        # 右ビット（光るペンビット）
        rect_px(g, 20, 7 - h_off, 2, 4, "#FACC15")
        set_px(g, 20, 7 - h_off, WHT)
        # 頭上の小さな知性リング
        rect_px(g, 9, 0 + bob, 6, 1, "#FACC15")

    elif level == 4:
        # Lv.4: 属性解放オーラ（激しく燃え盛るエレメンタル炎）
        flame_col = "#F43F5E" if is_girl else "#06B6D4"
        flame_col2 = "#FB7185" if is_girl else "#22D3EE"
        # 左右の燃え盛る炎
        fl_y = [11, 14, 17]
        for idx, fy in enumerate(fl_y):
            fx_l = 3 - (1 if (frame + idx) % 2 == 0 else 0)
            fx_r = 20 + (1 if (frame + idx) % 2 == 0 else 0)
            set_px(g, fx_l, fy + bob, flame_col)
            set_px(g, fx_l + 1, fy + bob, flame_col2)
            set_px(g, fx_r, fy + bob, flame_col)
            set_px(g, fx_r - 1, fy + bob, flame_col2)
        # 背後の双剣ブレード
        rect_px(g, 3, 5 + bob, 1, 6, WHT)
        rect_px(g, 20, 5 + bob, 1, 6, WHT)

    elif level == 5:
        # Lv.5: 【神化】全知共鳴のゴッド・ウィング（黄金の光輪 ＆ 六翼の光翼）
        wy = 4 + bob + (1 if frame % 2 == 1 else 0)
        wing_col = "#FACC15"
        wing_lite = "#FEF08A"
        # 神聖な光輪（頭上）
        rect_px(g, 8, 0 + bob, 8, 1, wing_col)
        set_px(g, 7, 1 + bob, wing_col)
        set_px(g, 16, 1 + bob, wing_col)
        # 巨大な六翼光翼（左翼）
        rect_px(g, 1, wy, 5, 2, wing_col)
        rect_px(g, 2, wy + 2, 4, 3, wing_lite)
        set_px(g, 0, wy + 2, wing_col)
        set_px(g, 1, wy + 5, wing_col)
        # 巨大な六翼光翼（右翼）
        rect_px(g, 18, wy, 5, 2, wing_col)
        rect_px(g, 18, wy + 2, 4, 3, wing_lite)
        set_px(g, 23, wy + 2, wing_col)
        set_px(g, 22, wy + 5, wing_col)
        # 神聖なオーラ粒子
        if frame % 2 == 0:
            set_px(g, 4, 18, WHT)
            set_px(g, 19, 18, WHT)

# =========================================================================
# キャラクター描画メイン関数
# =========================================================================
def render_character(is_girl, hair_def, uni_def, level, frame):
    g = create_blank()
    bob = 1 if frame == 1 else (-1 if frame == 3 else 0)
    sway = 1 if frame in [1, 2] else 0

    # 1. 背面のレベルエフェクト
    apply_aura_effects(g, level, frame, is_girl)

    h_base = hair_def["base"]
    h_dark = hair_def["dark"]
    h_lite = hair_def["lite"]
    h_type = hair_def["type"]

    # 2. 後ろ髪
    if is_girl:
        # 頭部ベース
        rect_px(g, 8, 2 + bob, 8, 1, h_dark)
        rect_px(g, 7, 3 + bob, 10, 2, h_base)
        rect_px(g, 6, 4 + bob, 12, 3, h_base)
        rect_px(g, 8, 3 + bob, 8, 1, h_lite) # 天使の輪

        if h_type == "bob":
            rect_px(g, 5, 6 + bob, 3, 6, h_base)
            rect_px(g, 16, 6 + bob, 3, 6, h_base)
            rect_px(g, 5, 9 + bob, 1, 3, h_dark)
            rect_px(g, 18, 9 + bob, 1, 3, h_dark)
            set_px(g, 6, 12 + bob, h_dark)
            set_px(g, 17, 12 + bob, h_dark)
        elif h_type == "twintail":
            rect_px(g, 4 - sway, 5 + bob, 2, 2, uni_def["acc"])
            rect_px(g, 18 + sway, 5 + bob, 2, 2, uni_def["acc"])
            rect_px(g, 3 - sway, 7 + bob, 3, 6, h_base)
            rect_px(g, 18 + sway, 7 + bob, 3, 6, h_base)
            set_px(g, 3 - sway, 12 + bob, h_dark)
            set_px(g, 20 + sway, 12 + bob, h_dark)
        elif h_type == "ponytail":
            rect_px(g, 15, 4 + bob - sway, 2, 2, uni_def["acc"])
            rect_px(g, 16, 5 + bob - sway, 4, 4, h_base)
            rect_px(g, 18, 8 + bob - sway, 3, 4, h_base)
            set_px(g, 20, 11 + bob - sway, h_dark)
        elif h_type == "long":
            rect_px(g, 5, 6 + bob, 3, 9, h_base)
            rect_px(g, 16, 6 + bob, 3, 9, h_base)
            set_px(g, 5, 14 + bob, h_dark)
            set_px(g, 18, 14 + bob, h_dark)
        elif h_type == "drill":
            rect_px(g, 5, 6 + bob, 3, 7, h_base)
            rect_px(g, 16, 6 + bob, 3, 7, h_base)
            set_px(g, 6, 8 + bob, h_lite)
            set_px(g, 17, 8 + bob, h_lite)
        elif h_type == "odango":
            rect_px(g, 4, 3 + bob, 3, 3, h_base)
            rect_px(g, 17, 3 + bob, 3, 3, h_base)
            set_px(g, 5, 3 + bob, uni_def["acc"])
            set_px(g, 18, 3 + bob, uni_def["acc"])
        else: # default/halfup/wave/sidetail
            rect_px(g, 5, 6 + bob, 3, 7, h_base)
            rect_px(g, 16, 6 + bob, 3, 7, h_base)
            set_px(g, 6, 12 + bob, h_dark)
            set_px(g, 17, 12 + bob, h_dark)
    else:
        # 男子頭部ベース
        rect_px(g, 8, 2 + bob, 8, 1, h_dark)
        rect_px(g, 7, 3 + bob, 10, 3, h_base)
        rect_px(g, 6, 4 + bob, 12, 3, h_base)
        rect_px(g, 8, 3 + bob, 8, 1, h_lite)

        if h_type in ["spiky", "spiky2", "crown"]:
            set_px(g, 8, 1 + bob, h_base)
            set_px(g, 13, 1 + bob, h_base)
            if h_type == "crown":
                set_px(g, 10, 0 + bob, h_lite)
                set_px(g, 11, 0 + bob, h_lite)
        elif h_type in ["mush", "mush2"]:
            rect_px(g, 7, 6 + bob, 10, 1, h_base)
        rect_px(g, 6, 6 + bob, 1, 3, h_base)
        rect_px(g, 17, 6 + bob, 1, 3, h_base)

    # 3. 顔の肌色（フェアルーン2の明るい肌）
    rect_px(g, 8, 6 + bob, 8, 5, SKIN_BASE)
    rect_px(g, 9, 11 + bob, 6, 1, SKIN_DARK)
    if is_girl:
        # おでこのセンター抜け
        set_px(g, 11, 5 + bob, SKIN_BASE)
        set_px(g, 12, 5 + bob, SKIN_BASE)
    else:
        set_px(g, 7, 8 + bob, SKIN_BASE) # 耳
        set_px(g, 16, 8 + bob, SKIN_BASE)

    # 4. 瞳（【フェアルーン2】完全準拠の縦2ドット黒スリット目）
    if frame == 2:
        set_px(g, 9, 9 + bob, EYE_BLK)
        set_px(g, 14, 9 + bob, EYE_BLK)
    elif frame == 3:
        set_px(g, 9, 8 + bob, EYE_BLK)
        set_px(g, 14, 8 + bob, EYE_BLK)
    else:
        set_px(g, 9, 8 + bob, EYE_BLK)
        set_px(g, 9, 9 + bob, EYE_BLK)
        set_px(g, 14, 8 + bob, EYE_BLK)
        set_px(g, 14, 9 + bob, EYE_BLK)

    if not is_girl:
        # 男子眉
        set_px(g, 9, 7 + bob, h_dark)
        set_px(g, 14, 7 + bob, h_dark)

    # 5. 口（フェアルーン2のあいた赤口）
    if frame == 3:
        rect_px(g, 11, 10 + bob, 2, 2, MOUTH_RED)
    else:
        set_px(g, 11, 11 + bob, MOUTH_RED)
        set_px(g, 12, 11 + bob, MOUTH_RED)

    # 6. 前髪
    if not is_girl and h_type in ["spiky", "spiky2", "undercut", "part"]:
        set_px(g, 7, 5 + bob, h_base)
        set_px(g, 8, 6 + bob, h_base)
        set_px(g, 10, 6 + bob, h_base)
        set_px(g, 13, 6 + bob, h_base)
        set_px(g, 15, 6 + bob, h_base)
        set_px(g, 16, 5 + bob, h_base)

    # 7. 胴体・制服（20校それぞれのデザイン）
    u_top = uni_def["top"]
    u_sub = uni_def["sub"]
    u_acc = uni_def["acc"]
    u_bot = uni_def["bot_g"] if is_girl else uni_def["bot"]

    rect_px(g, 8, 12 + bob, 8, 4, u_top)
    # 胸元（シャツ/襟/ネクタイ/リボン）
    rect_px(g, 10, 12 + bob, 4, 2, u_sub)
    if is_girl:
        rect_px(g, 11, 13 + bob, 2, 2, u_acc)
    else:
        rect_px(g, 11, 13 + bob, 2, 3, u_acc)
        set_px(g, 10, 15 + bob, "#FACC15") # 金ボタン

    # 8. ボトムス（女子＝プリーツスカート、男子＝スラックス）
    if is_girl:
        rect_px(g, 7, 16 + bob, 10, 2, u_bot)
        set_px(g, 7, 17 + bob, u_top)
        set_px(g, 10, 17 + bob, u_top)
        set_px(g, 13, 17 + bob, u_top)
        set_px(g, 16, 17 + bob, u_top)
        # 足
        rect_px(g, 9, 18, 2, 2, SKIN_BASE)
        rect_px(g, 13, 18, 2, 2, SKIN_BASE)
        rect_px(g, 9, 20, 2, 1, WHT)
        rect_px(g, 13, 20, 2, 1, WHT)
        rect_px(g, 8, 21, 3, 2, "#4A2810")
        rect_px(g, 13, 21, 3, 2, "#4A2810")
    else:
        rect_px(g, 8, 16 + bob, 8, 2, u_bot)
        rect_px(g, 9, 18, 2, 3, u_bot)
        rect_px(g, 13, 18, 2, 3, u_bot)
        # スニーカー
        rect_px(g, 8, 21, 3, 2, EYE_BLK)
        rect_px(g, 13, 21, 3, 2, EYE_BLK)
        set_px(g, 8, 21, WHT)
        set_px(g, 13, 21, WHT)

    # 9. 両手
    set_px(g, 7, 14 + bob, SKIN_BASE)
    set_px(g, 16, 14 + bob, SKIN_BASE)

    return g

# --- GIF 生成 ---
def render_to_gif(draw_args, filename, scale=6):
    frames = []
    for f in [0, 1, 2, 3]:
        grid = render_character(*draw_args, frame=f)
        img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
        for y in range(SIZE):
            for x in range(SIZE):
                c = grid[y][x]
                if c:
                    h = c.lstrip('#')
                    rgb = tuple(int(h[i:i+2], 16) for i in (0, 2, 4)) + (255,)
                    img.putpixel((x, y), rgb)
        scaled = img.resize((SIZE * scale, SIZE * scale), Image.Resampling.NEAREST)
        frames.append(scaled)

    frames[0].save(
        filename,
        save_all=True,
        append_images=frames[1:],
        duration=[260, 260, 180, 260],
        loop=0,
        disposal=2
    )

print("Starting batch generation...")

# 1. 髪型10種サンプルの生成 (Lv.1, 王道制服 uni_01)
for idx, h in enumerate(GIRL_HAIR_DEFS):
    fn = os.path.join(OUT_DIR, f"girl_hair_{idx+1:02d}.gif")
    render_to_gif((True, h, UNIFORM_DEFS[0], 1), fn)

for idx, h in enumerate(BOY_HAIR_DEFS):
    fn = os.path.join(OUT_DIR, f"boy_hair_{idx+1:02d}.gif")
    render_to_gif((False, h, UNIFORM_DEFS[0], 1), fn)

# 2. 制服20校サンプルの生成 (Lv.1, デフォルト髪型 gh_01 / bh_01)
for idx, u in enumerate(UNIFORM_DEFS):
    fn_g = os.path.join(OUT_DIR, f"girl_uni_{idx+1:02d}.gif")
    render_to_gif((True, GIRL_HAIR_DEFS[0], u, 1), fn_g)
    fn_b = os.path.join(OUT_DIR, f"boy_uni_{idx+1:02d}.gif")
    render_to_gif((False, BOY_HAIR_DEFS[0], u, 1), fn_b)

# 3. レベル5段階エフェクトの生成 (デフォルト髪・王道制服)
for lv in range(1, 6):
    fn_g = os.path.join(OUT_DIR, f"girl_level_{lv}.gif")
    render_to_gif((True, GIRL_HAIR_DEFS[0], UNIFORM_DEFS[0], lv), fn_g)
    fn_b = os.path.join(OUT_DIR, f"boy_level_{lv}.gif")
    render_to_gif((False, BOY_HAIR_DEFS[0], UNIFORM_DEFS[0], lv), fn_b)

print("All sample GIFs generated successfully!")
