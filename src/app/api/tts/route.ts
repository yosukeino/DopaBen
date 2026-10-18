import { NextRequest, NextResponse } from "next/server";

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

/**
 * オンデマンド Google TTS 音声取得プロキシ API
 * - サーバー容量（静的ファイル）を一切消費せず、要求された英単語・英文のMP3バイナリを返す
 * - Cache-Control (immutable) により Vercel Edge CDN にキャッシュされ、同じ単語の再取得時は即座に応答
 */
export async function GET(req: NextRequest) {
  const rawText = req.nextUrl.searchParams.get("q") || "";
  const text = rawText.trim().slice(0, 240);

  if (!text) {
    return new NextResponse("Missing query parameter 'q'", { status: 400 });
  }

  // 1. 第一候補: Google Translate TTS (tw-ob, en)
  const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${encodeURIComponent(
    text
  )}`;

  try {
    const res = await fetch(googleTtsUrl, {
      headers: {
        "User-Agent": USER_AGENT,
        Referer: "https://translate.google.com/",
      },
      next: { revalidate: 31536000 },
    });

    if (res.ok) {
      const arrayBuffer = await res.arrayBuffer();
      if (arrayBuffer.byteLength > 100) {
        return new NextResponse(arrayBuffer, {
          status: 200,
          headers: {
            "Content-Type": "audio/mpeg",
            "Cache-Control":
              "public, max-age=31536000, s-maxage=31536000, immutable",
          },
        });
      }
    }
  } catch {
    // Google TTS 失敗時はフォールバックへ進む
  }

  // 2. 第二候補フォールバック: Youdao Dictionary US Native Audio (type=2: 米音)
  const fallbackUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(
    text
  )}&type=2`;

  try {
    const fallbackRes = await fetch(fallbackUrl, {
      headers: {
        "User-Agent": USER_AGENT,
      },
      next: { revalidate: 31536000 },
    });

    if (fallbackRes.ok) {
      const arrayBuffer = await fallbackRes.arrayBuffer();
      if (arrayBuffer.byteLength > 100) {
        return new NextResponse(arrayBuffer, {
          status: 200,
          headers: {
            "Content-Type": "audio/mpeg",
            "Cache-Control":
              "public, max-age=31536000, s-maxage=31536000, immutable",
          },
        });
      }
    }
  } catch {
    // ignore
  }

  return new NextResponse("TTS audio unavailable", { status: 502 });
}
