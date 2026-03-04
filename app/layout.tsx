import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'BGM Reservation System',
  description: 'Level up your game nights. Join the ultimate board game club community.',
  generator: 'v0.app', // 이 줄은 삭제해도 무방합니다.
  icons: {
    icon: '/BGMlogo.png?v=1', // public 폴더에 넣은 본인 로고 파일명으로 변경
    apple: '/BGMlogo.png?v=1', // 아이폰 홈화면 추가용 아이콘도 동일하게 변경 가능
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const messages = await getMessages()

  return (
    <html lang="ko">
      <body className="font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  )
}
