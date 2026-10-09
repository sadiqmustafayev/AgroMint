import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AgroMint AI — Agricultural Intelligence Platform',
  description: 'AI-Powered Agricultural Intelligence Platform providing context-aware, farm-specific recommendations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-mint-200 selection:text-mint-900">
        {children}
      </body>
    </html>
  );
}
