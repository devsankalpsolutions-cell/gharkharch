import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { FinanceProvider } from '@/context/FinanceContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Famvexa - Smarter Finances for Everyday Living',
  description: 'Famvexa.com - Multi-Tenant SaaS platform to manage personal finances, income, daily expenses, loan EMIs, shared trips, and house ledgers effortlessly. A Devsankalp Solutions product.',
  keywords: ['Famvexa', 'Famvexa.com', 'Smarter Finances', 'Devsankalp Solutions', 'Personal Finance SaaS', 'Expense Manager', 'Splitwise Alternative', 'House Ledger'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased selection:bg-cyan-500 selection:text-white`}>
        <ThemeProvider>
          <AuthProvider>
            <FinanceProvider>{children}</FinanceProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
