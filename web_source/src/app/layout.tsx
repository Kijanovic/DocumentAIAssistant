import { DocumentProvider } from '@/contexts/document-context';
import { GeminiProvider } from '@/contexts/gemini-context';
import { ReferenceProvider } from '@/contexts/reference-context';
import { ConfigProvider } from '@/contexts/config-context';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'DocumentAI Web Assistant',
  description: 'Web application for interacting with documents using Gemini AI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConfigProvider>
          <DocumentProvider>
            <GeminiProvider>
              <ReferenceProvider>
                {children}
              </ReferenceProvider>
            </GeminiProvider>
          </DocumentProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
