import os
from PIL import Image

OUT_DIR = "/Users/yosukeino/.gemini/antigravity/brain/d3272431-aa87-451c-b4f2-8a06e52e3c51"
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

# --- 厳選された美しいカラーパレット ---
WHT        = "#FFFFFF"
EYE_BLK    = "#111827"  # 瞳の黒（つぶらなスリット目）
MOUTH_RED  = "#DC2626"  # 開いた赤いお口
SKIN_BASE  = "#FFE4C4"  # フェアルーン特有の明るい美白肌
SKIN_SHADOW= "#F3BA8B"  # 顎下・首のやわらかな影

# 女子A：赤髪ボブ
G_RED_BASE = "#D92B3A"  # 鮮やかチェリーレッド
G_RED_DARK = "#9E1B28"  # 髪の影・エッジ
G_RED_LITE = "#FF7A8A"  # 天使の輪ハイライト
NAVY_UNIF  = "#1E293B"  # セーラーブレザー紺
NAVY_DARK  = "#0F172A"
SERAFU_WHT = "#FFFFFF"  # セーラー白襟
RIB_CHERRY = "#EF4444"  # 胸元リボン
SHOE_BRN   = "#5C2B14"  # ローファー茶

# 女子B：ミルクティーツインテ
G_TEA_BASE = "#C26D2D"  # ミルクティーアンバー
G_TEA_DARK = "#8A4312"  # 髪の影
G_TEA_LITE = "#E89B58"  # ハイライト
CARD_BEIGE = "#D97706"  # キャメルカーディガン
CARD_DARK  = "#92400E"
SKIRT_RED  = "#991B1B"  # 赤チェックプリーツ
RIB_MINT   = "#10B981"  # エメラルドミントリボン

# 男子A：少年勇者ナチュラルショート
B_HAIR_BASE = "#3F2B1D" # 落ち着いたダークショコラブラウン
B_HAIR_DARK = "#26180E" # 髪の影
B_HAIR_LITE = "#6A4A32" # 髪の光沢
B_BLU_BASE  = "#1D4ED8" # 凛々しいロイヤルブルー
B_BLU_DARK  = "#1E3A8A"
PANTS_SLT   = "#334155" # スラックススレート
PANTS_DARK  = "#1E293B"
TIE_RED     = "#DC2626" # ネクタイ赤
GOLD_BTN    = "#FACC15" # 金ボタン

# 男子B：今どきクリーンマッシュ
B_MSH_BASE  = "#2D3748" # 洗練されたダークスレートマッシュ
B_MSH_DARK  = "#1A202C" # 影
B_MSH_LITE  = "#4A5568" # ハイライト
HOOD_TEAL   = "#0D9488" # スタイリッシュティールグリーン
HOOD_DARK   = "#115E59"
HOOD_WHT    = "#F1F5F9" # フード白紐

# =========================================================================
# 1. 女子パターンA：フェアルーン2直系「愛され赤髪ボブ × セーラーブレザー」
# （無理な黒枠を撤廃し、髪色そのものの綺麗な丸みシルエットに改善）
# =========================================================================
def draw_girl_a(frame):
    g = create_blank()
    bob = 1 if frame == 1 else (-1 if frame == 3 else 0)

    # 後ろ髪・頭部の自然で丸いシルエット（階段状の美しいアール）
    rect_px(g, 8, 2 + bob, 8, 1, G_RED_DARK)
    rect_px(g, 7, 3 + bob, 10, 2, G_RED_BASE)
    rect_px(g, 6, 4 + bob, 12, 3, G_RED_BASE)
    rect_px(g, 8, 3 + bob, 8, 1, G_RED_LITE) # 天使の輪

    # サイドボブ（両肩にふんわり下がる）
    rect_px(g, 5, 6 + bob, 3, 6, G_RED_BASE)
    rect_px(g, 16, 6 + bob, 3, 6, G_RED_BASE)
    # サイド髪の影・内巻きの丸み
    rect_px(g, 5, 9 + bob, 1, 3, G_RED_DARK)
    rect_px(g, 18, 9 + bob, 1, 3, G_RED_DARK)
    set_px(g, 6, 12 + bob, G_RED_DARK)
    set_px(g, 17, 12 + bob, G_RED_DARK)

    # 顔の肌色（明るく温かみのある美白肌）
    rect_px(g, 8, 6 + bob, 8, 5, SKIN_BASE)
    rect_px(g, 9, 11 + bob, 6, 1, SKIN_SHADOW) # 顎のやわらかな影
    # フェアルーン2主人公特有のおでこのセンター抜け
    set_px(g, 11, 5 + bob, SKIN_BASE)
    set_px(g, 12, 5 + bob, SKIN_BASE)

    # 瞳（フェアルーン2直系！縦2x横1のつぶらな黒目）
    if frame == 2:
        # まばたき（1ドットの横線）
        set_px(g, 9, 9 + bob, EYE_BLK)
        set_px(g, 14, 9 + bob, EYE_BLK)
    elif frame == 3:
        # ニッコリ笑顔
        set_px(g, 9, 8 + bob, EYE_BLK)
        set_px(g, 14, 8 + bob, EYE_BLK)
    else:
        # つぶらな黒スリット目
        set_px(g, 9, 8 + bob, EYE_BLK)
        set_px(g, 9, 9 + bob, EYE_BLK)
        set_px(g, 14, 8 + bob, EYE_BLK)
        set_px(g, 14, 9 + bob, EYE_BLK)

    # 口（フェアルーン2象徴のあいたお口！）
    if frame == 3:
        rect_px(g, 11, 10 + bob, 2, 2, MOUTH_RED)
    else:
        set_px(g, 11, 11 + bob, MOUTH_RED)
        set_px(g, 12, 11 + bob, MOUTH_RED)

    # 胴体・制服（セーラー襟ブレザー）
    rect_px(g, 8, 12 + bob, 8, 4, NAVY_UNIF)
    # セーラー白襟＋胸元赤リボン
    rect_px(g, 10, 12 + bob, 4, 1, SERAFU_WHT)
    rect_px(g, 9, 13 + bob, 1, 2, SERAFU_WHT)
    rect_px(g, 14, 13 + bob, 1, 2, SERAFU_WHT)
    rect_px(g, 11, 13 + bob, 2, 2, RIB_CHERRY)
    set_px(g, 11, 13 + bob, WHT) # リボンの光沢

    # スカート（Aラインミニプリーツスカート）
    rect_px(g, 7, 16 + bob, 10, 2, G_RED_BASE)
    set_px(g, 7, 17 + bob, G_RED_DARK)
    set_px(g, 10, 17 + bob, G_RED_DARK)
    set_px(g, 13, 17 + bob, G_RED_DARK)
    set_px(g, 16, 17 + bob, G_RED_DARK)

    # 足（健康的な美脚＋白ソックス＋ローファー）
    rect_px(g, 9, 18, 2, 2, SKIN_BASE)
    rect_px(g, 13, 18, 2, 2, SKIN_BASE)
    rect_px(g, 9, 20, 2, 1, WHT) # 白ソックス
    rect_px(g, 13, 20, 2, 1, WHT)
    rect_px(g, 8, 21, 3, 2, SHOE_BRN)
    rect_px(g, 13, 21, 3, 2, SHOE_BRN)

    # 両手（自然なおしとやか立ち）
    set_px(g, 7, 14 + bob, SKIN_BASE)
    set_px(g, 16, 14 + bob, SKIN_BASE)

    return g

# =========================================================================
# 2. 女子パターンB：ミルクティーラテ「王道ツインテール × カーディガン」
# =========================================================================
def draw_girl_b(frame):
    g = create_blank()
    bob = 1 if frame == 1 else (-1 if frame == 3 else 0)
    sway = 1 if frame == 1 else 0

    # ツインテール（ふんわりピョコピョコ揺れる毛束）
    # リボン（エメラルドミント）
    rect_px(g, 4 - sway, 5 + bob, 2, 2, RIB_MINT)
    rect_px(g, 18 + sway, 5 + bob, 2, 2, RIB_MINT)
    # ツインテ本体
    rect_px(g, 3 - sway, 7 + bob, 3, 6, G_TEA_BASE)
    rect_px(g, 18 + sway, 7 + bob, 3, 6, G_TEA_BASE)
    set_px(g, 3 - sway, 12 + bob, G_TEA_DARK)
    set_px(g, 20 + sway, 12 + bob, G_TEA_DARK)

    # 頭部ベース（ふんわり丸い頭）
    rect_px(g, 8, 2 + bob, 8, 1, G_TEA_DARK)
    rect_px(g, 7, 3 + bob, 10, 3, G_TEA_BASE)
    rect_px(g, 6, 4 + bob, 12, 3, G_TEA_BASE)
    rect_px(g, 8, 3 + bob, 8, 1, G_TEA_LITE) # 天使の輪
    rect_px(g, 6, 6 + bob, 2, 5, G_TEA_BASE)  # サイド
    rect_px(g, 16, 6 + bob, 2, 5, G_TEA_BASE)

    # 顔の肌色
    rect_px(g, 8, 6 + bob, 8, 5, SKIN_BASE)
    rect_px(g, 9, 11 + bob, 6, 1, SKIN_SHADOW)

    # 瞳（フェアルーン2風つぶら瞳）
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

    # 口
    if frame == 3:
        rect_px(g, 11, 10 + bob, 2, 2, MOUTH_RED)
    else:
        set_px(g, 11, 11 + bob, MOUTH_RED)
        set_px(g, 12, 11 + bob, MOUTH_RED)

    # 胴体・キャメルカーディガン
    rect_px(g, 8, 12 + bob, 8, 4, CARD_BEIGE)
    rect_px(g, 10, 12 + bob, 4, 2, WHT)
    rect_px(g, 11, 13 + bob, 2, 1, RIB_MINT)
    set_px(g, 11, 15 + bob, CARD_DARK) # ボタン

    # スカート（赤チェックプリーツ）
    rect_px(g, 7, 16 + bob, 10, 2, SKIRT_RED)
    set_px(g, 8, 17 + bob, CARD_DARK)
    set_px(g, 11, 17 + bob, CARD_DARK)
    set_px(g, 14, 17 + bob, CARD_DARK)

    # 足（黒ハイソックス＋ローファー）
    rect_px(g, 9, 18, 2, 1, SKIN_BASE)
    rect_px(g, 13, 18, 2, 1, SKIN_BASE)
    rect_px(g, 9, 19, 2, 2, EYE_BLK)
    rect_px(g, 13, 19, 2, 2, EYE_BLK)
    rect_px(g, 8, 21, 3, 2, SHOE_BRN)
    rect_px(g, 13, 21, 3, 2, SHOE_BRN)

    # 両手
    set_px(g, 7, 14 + bob, CARD_BEIGE)
    set_px(g, 16, 14 + bob, CARD_BEIGE)
    set_px(g, 7, 15 + bob, SKIN_BASE)
    set_px(g, 16, 15 + bob, SKIN_BASE)

    return g

# =========================================================================
# 3. 男子パターンA：フェアルーン少年勇者「ナチュラル少年ショート×ブレザー」
# （不自然なアウトラインを撤廃し、頭の丸みと自然な少年毛束に完全刷新）
# =========================================================================
def draw_boy_a(frame):
    g = create_blank()
    bob = 1 if frame == 1 else (-1 if frame == 3 else 0)

    # 頭部・髪型（フェアルーンの少年勇者のような、丸みのある元気なナチュラルショート！）
    rect_px(g, 8, 2 + bob, 8, 1, B_HAIR_DARK)
    rect_px(g, 7, 3 + bob, 10, 3, B_HAIR_BASE)
    rect_px(g, 6, 4 + bob, 12, 3, B_HAIR_BASE)
    rect_px(g, 8, 3 + bob, 8, 1, B_HAIR_LITE) # 髪の自然な光沢

    # 前髪（額に自然にかかる、スッキリ爽やかな少年バングス）
    set_px(g, 7, 5 + bob, B_HAIR_BASE)
    set_px(g, 8, 6 + bob, B_HAIR_BASE)
    set_px(g, 10, 6 + bob, B_HAIR_BASE)
    set_px(g, 13, 6 + bob, B_HAIR_BASE)
    set_px(g, 15, 6 + bob, B_HAIR_BASE)
    set_px(g, 16, 5 + bob, B_HAIR_BASE)
    # 耳上のサイドショート
    rect_px(g, 6, 6 + bob, 1, 3, B_HAIR_BASE)
    rect_px(g, 17, 6 + bob, 1, 3, B_HAIR_BASE)
    set_px(g, 6, 8 + bob, B_HAIR_DARK)
    set_px(g, 17, 8 + bob, B_HAIR_DARK)

    # 顔の肌色
    rect_px(g, 8, 6 + bob, 8, 5, SKIN_BASE)
    rect_px(g, 9, 11 + bob, 6, 1, SKIN_SHADOW)
    # 耳
    set_px(g, 7, 8 + bob, SKIN_BASE)
    set_px(g, 16, 8 + bob, SKIN_BASE)

    # 瞳（フェアルーン2直系のつぶらな目 ＋ 凛々しい少年勇者の眉！）
    # 眉（目の1ドット上に置くキリッとした少年眉）
    set_px(g, 9, 7 + bob, B_HAIR_DARK)
    set_px(g, 14, 7 + bob, B_HAIR_DARK)

    if frame == 2:
        # まばたき
        set_px(g, 9, 9 + bob, EYE_BLK)
        set_px(g, 14, 9 + bob, EYE_BLK)
    elif frame == 3:
        # 元気な笑顔
        set_px(g, 9, 8 + bob, EYE_BLK)
        set_px(g, 14, 8 + bob, EYE_BLK)
    else:
        # つぶらな黒スリット目
        set_px(g, 9, 8 + bob, EYE_BLK)
        set_px(g, 9, 9 + bob, EYE_BLK)
        set_px(g, 14, 8 + bob, EYE_BLK)
        set_px(g, 14, 9 + bob, EYE_BLK)

    # 口（フェアルーンの元気にあいたお口！）
    if frame == 3:
        rect_px(g, 11, 10 + bob, 2, 2, MOUTH_RED)
    else:
        set_px(g, 11, 11 + bob, MOUTH_RED)
        set_px(g, 12, 11 + bob, MOUTH_RED)

    # 胴体・学園ブレザー（ロイヤルブルー）
    rect_px(g, 8, 12 + bob, 8, 5, B_BLU_BASE)
    # 白シャツ＋赤ネクタイ＋金ボタン
    rect_px(g, 10, 12 + bob, 4, 3, WHT)
    rect_px(g, 11, 13 + bob, 2, 3, TIE_RED)
    set_px(g, 10, 15 + bob, GOLD_BTN)
    # ブレザーの立体感
    set_px(g, 8, 16 + bob, B_BLU_DARK)
    set_px(g, 15, 16 + bob, B_BLU_DARK)

    # スラックスズボン
    rect_px(g, 8, 17 + bob, 8, 2, PANTS_SLT)
    rect_px(g, 9, 19, 2, 2, PANTS_SLT)
    rect_px(g, 13, 19, 2, 2, PANTS_SLT)
    set_px(g, 10, 20, PANTS_DARK)
    set_px(g, 13, 20, PANTS_DARK)

    # スニーカー（白ライン入り）
    rect_px(g, 8, 21, 3, 2, EYE_BLK)
    rect_px(g, 13, 21, 3, 2, EYE_BLK)
    set_px(g, 8, 21, WHT)
    set_px(g, 13, 21, WHT)

    # 両手
    set_px(g, 7, 14 + bob, SKIN_BASE)
    set_px(g, 16, 14 + bob, SKIN_BASE)

    return g

# =========================================================================
# 4. 男子パターンB：クール知性派「洗練さらさらマッシュ × ティールパーカー」
# （頭の形を美しいアールに整え、自然なマッシュの毛流れに刷新）
# =========================================================================
def draw_boy_b(frame):
    g = create_blank()
    bob = 1 if frame == 1 else (-1 if frame == 3 else 0)

    # 頭部・さらさらマッシュヘア（コロンと丸く整った頭部シルエット）
    rect_px(g, 8, 2 + bob, 8, 1, B_MSH_DARK)
    rect_px(g, 7, 3 + bob, 10, 3, B_MSH_BASE)
    rect_px(g, 6, 4 + bob, 12, 3, B_MSH_BASE)
    rect_px(g, 8, 3 + bob, 8, 1, B_MSH_LITE) # マッシュの天使の輪

    # マッシュ前髪（目元に少しかかる、クリーンでスタイリッシュなライン）
    rect_px(g, 7, 6 + bob, 10, 1, B_MSH_BASE)
    set_px(g, 9, 7 + bob, B_MSH_BASE)
    set_px(g, 14, 7 + bob, B_MSH_BASE)
    rect_px(g, 6, 6 + bob, 1, 3, B_MSH_DARK)
    rect_px(g, 17, 6 + bob, 1, 3, B_MSH_DARK)

    # 顔の肌色
    rect_px(g, 8, 7 + bob, 8, 4, SKIN_BASE)
    rect_px(g, 9, 11 + bob, 6, 1, SKIN_SHADOW)
    set_px(g, 7, 8 + bob, SKIN_BASE) # 耳
    set_px(g, 16, 8 + bob, SKIN_BASE)

    # 瞳（フェアルーン2風つぶら瞳）
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

    # 口
    if frame == 3:
        rect_px(g, 11, 10 + bob, 2, 2, MOUTH_RED)
    else:
        set_px(g, 11, 11 + bob, MOUTH_RED)
        set_px(g, 12, 11 + bob, MOUTH_RED)

    # 胴体・ティールパーカー制服
    rect_px(g, 8, 12 + bob, 8, 5, HOOD_TEAL)
    # 白フード紐＋インナー
    rect_px(g, 10, 12 + bob, 4, 1, HOOD_WHT)
    set_px(g, 10, 14 + bob, WHT)
    set_px(g, 13, 14 + bob, WHT)
    rect_px(g, 11, 13 + bob, 2, 3, HOOD_DARK) # フロントポケット影

    # スラックス
    rect_px(g, 8, 17 + bob, 8, 2, PANTS_SLT)
    rect_px(g, 9, 19, 2, 2, PANTS_SLT)
    rect_px(g, 13, 19, 2, 2, PANTS_SLT)

    # スニーカー
    rect_px(g, 8, 21, 3, 2, EYE_BLK)
    rect_px(g, 13, 21, 3, 2, EYE_BLK)
    set_px(g, 9, 21, HOOD_TEAL)
    set_px(g, 14, 21, HOOD_TEAL)

    # 両手
    set_px(g, 7, 15 + bob, SKIN_BASE)
    set_px(g, 16, 15 + bob, SKIN_BASE)

    return g

# --- GIF 生成 ---
def render_frames_to_gif(draw_fn, filename, scale=8):
    frames = []
    for f_idx in [0, 1, 2, 3]:
        grid = draw_fn(f_idx)
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
    print(f"Generated: {filename}")

render_frames_to_gif(draw_girl_a, os.path.join(OUT_DIR, "girl_pattern_a_v2.gif"))
render_frames_to_gif(draw_girl_b, os.path.join(OUT_DIR, "girl_pattern_b_v2.gif"))
render_frames_to_gif(draw_boy_a,  os.path.join(OUT_DIR, "boy_pattern_a_v2.gif"))
render_frames_to_gif(draw_boy_b,  os.path.join(OUT_DIR, "boy_pattern_b_v2.gif"))
