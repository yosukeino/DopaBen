import { NextRequest, NextResponse } from "next/server";

const USER_AGENTS = [
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
];

/**
 * オンデマンド Google TTS 単一ナチュラル音声プロキシ API
 * - 別エンジンの機械音声（Youdao等）へのフォールバックを廃止し、100% Google TTS の自然な単一ボイスに統一
 * - リトライ機構付きで一時的な通信揺らぎを吸収
 * - slow=1 指定時はピッチを変えずに Google TTS ネイティブのゆっくり発音 (ttsspeed=0.24) を取得
 */
export async function GET(req: NextRequest) {
  const rawText = req.nextUrl.searchParams.get("q") || "";
  const isSlow = req.nextUrl.searchParams.get("slow") === "1";
  const text = rawText.trim().slice(0, 240);

  if (!text) {
    return new NextResponse("Missing query parameter 'q'", { status: 400 });
  }

  const ttsSpeed = isSlow ? "0.24" : "1";
  const clients = ["tw-ob", "gtx"];

  for (let attempt = 0; attempt < 3; attempt++) {
    const client = clients[attempt % clients.length];
    const ua = USER_AGENTS[attempt % USER_AGENTS.length];
    const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=${client}&tl=en&ttsspeed=${ttsSpeed}&q=${encodeURIComponent(
      text
    )}`;

    try {
      const res = await fetch(googleTtsUrl, {
        headers: {
          "User-Agent": ua,
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
      // 次の試行へ
    }

    // わずかなウェイトを入れてリトライ
    await new Promise((r) => setTimeout(r, 80 * (attempt + 1)));
  }

  return new NextResponse("Google TTS audio unavailable", { status: 502 });
}
