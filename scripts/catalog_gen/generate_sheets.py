import os
from PIL import Image, ImageDraw, ImageFont

CATALOG_DIR = "/Users/yosukeino/.gemini/antigravity/brain/d3272431-aa87-451c-b4f2-8a06e52e3c51/catalog"

def create_grid_sheet(gif_filenames, titles, rows, cols, out_filename, card_w=140, card_h=170):
    sheet = Image.new("RGBA", (cols * card_w + 20, rows * card_h + 30), (19, 9, 27, 255))
    draw = ImageDraw.Draw(sheet)

    for idx, (fn, title) in enumerate(zip(gif_filenames, titles)):
        r = idx // cols
        c = idx % cols
        x = 10 + c * card_w
        y = 15 + r * card_h

        # カード枠
        draw.rectangle([x, y, x + card_w - 8, y + card_h - 10], fill=(29, 18, 41, 255), outline=(61, 39, 82, 255), width=2)
        
        # GIFの1フレーム目を読み込み
        gif_path = os.path.join(CATALOG_DIR, fn)
        if os.path.exists(gif_path):
            with Image.open(gif_path) as im:
                im.seek(0)
                frame = im.convert("RGBA")
                # 縮小または配置 (110x110)
                frame = frame.resize((100, 100), Image.Resampling.NEAREST)
                sheet.paste(frame, (x + (card_w - 8 - 100)//2, y + 10), frame)

        # テキスト (シンプルなフォールバック描画)
        draw.text((x + 8, y + 120), f"#{idx+1:02d}", fill=(244, 63, 94, 255))
        # 日本語はデフォルトフォントでは豆腐になる可能性があるので英数字や短縮テキスト
        draw.text((x + 35, y + 120), title[:8], fill=(255, 255, 255, 255))

    sheet.save(os.path.join(CATALOG_DIR, out_filename))
    print(f"Saved sheet: {out_filename}")

# 1. 女子髪型 10種シート (2x5)
gh_files = [f"girl_hair_{i:02d}.gif" for i in range(1, 11)]
gh_titles = ["CherryBob", "MilkyTwin", "BerryHalf", "BlackLong", "GoldPony", "SilverWolf", "DrillRoll", "MintOdango", "SideTail", "WaveLong"]
create_grid_sheet(gh_files, gh_titles, 2, 5, "sheet_girl_hairs.png")

# 2. 男子髪型 10種シート (2x5)
bh_files = [f"boy_hair_{i:02d}.gif" for i in range(1, 11)]
bh_titles = ["HeroShort", "CleanMush", "AshWolf", "JetPart", "IndiSpiky", "WhiteMush", "Crimson2B", "CamelCenter", "EmeraldCurl", "GoldCrown"]
create_grid_sheet(bh_files, bh_titles, 2, 5, "sheet_boy_hairs.png")

# 3. 女子制服 20種シート (4x5)
gu_files = [f"girl_uni_{i:02d}.gif" for i in range(1, 21)]
gu_titles = [
    "SakuraBlaz", "KaichiGray", "SailorNavy", "OxfordCamel", "Cardigan",
    "LineJersey", "CyberHigh", "MarineBlue", "RoseNoble", "SageRobe",
    "StreetHood", "MusicArts", "ModernHaka", "ForestEco", "SummerWhite",
    "WhitePrez", "NightBike", "IdolStar", "CoatMuff", "HeroLegend"
]
create_grid_sheet(gu_files, gu_titles, 4, 5, "sheet_girl_uniforms.png")

# 4. 男子制服 20種シート (4x5)
bu_files = [f"boy_uni_{i:02d}.gif" for i in range(1, 21)]
create_grid_sheet(bu_files, gu_titles, 4, 5, "sheet_boy_uniforms.png")

# 5. レベル5段階進化シート (1x5)
lv_g_files = [f"girl_level_{i}.gif" for i in range(1, 6)]
lv_titles = ["Lv.1 Normal", "Lv.2 Sparkle", "Lv.3 MagicBit", "Lv.4 AuraBlade", "Lv.5 GodWings"]
create_grid_sheet(lv_g_files, lv_titles, 1, 5, "sheet_girl_levels.png")

lv_b_files = [f"boy_level_{i}.gif" for i in range(1, 6)]
create_grid_sheet(lv_b_files, lv_titles, 1, 5, "sheet_boy_levels.png")
