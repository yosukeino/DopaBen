import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ドパベン (DopaBen) | 脳汁×育成 中学英単語バトル",
  description:
    "スキマ時間3分で脳汁が出るほど英単語が繋がる！スタイリッシュUI × レトロドット絵10段階進化の中学英単語アプリ『ドパベン』",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0C0F0A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="dark">
      <body className="bg-[#0C0F0A] text-white antialiased selection:bg-[#FF206E] selection:text-white">
        {children}
      </body>
    </html>
  );
}
