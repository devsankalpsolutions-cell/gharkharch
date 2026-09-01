import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { FinanceProvider } from '@/context/FinanceContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ghar Kharch - Household Finance Management Application',
  description: 'Manage monthly income, daily expenses, loan EMIs, and family budget seamlessly from one dashboard.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased selection:bg-emerald-500 selection:text-white`}>
        <ThemeProvider>
          <AuthProvider>
            <FinanceProvider>{children}</FinanceProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
