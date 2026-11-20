import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Coy | Discover Meaningful Connections',
  description: 'A swipe-based dating & discovery experience with privacy at its core.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-coy-bg text-gray-100 min-h-screen flex flex-col antialiased selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
