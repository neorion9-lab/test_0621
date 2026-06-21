import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "스마트 가정통신문 🚀",
  description: "종이 없는 빠르고 간편한 디지털 회신서 플랫폼",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className={outfit.className}>
        <main className="container mt-4 mb-8">
          {children}
        </main>
      </body>
    </html>
  );
}
