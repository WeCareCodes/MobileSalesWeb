import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "手機比較王 - 全台灣手機規格比較",
  description: "提供台灣市面上所有手機規格、售價、評測，幫你找到最適合的手機。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
        <footer className="mt-16 border-t border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-gray-500">
            <p>© 2025 手機比較王 · 資料僅供參考，實際售價請洽各經銷商</p>
            <p className="mt-1">
              資料參考來源：
              <a href="https://www.sogi.com.tw" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mx-1">手機王</a>
              ·
              <a href="https://www.jyes.com.tw" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mx-1">傑昇通訊</a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
