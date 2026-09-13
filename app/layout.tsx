import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SaveMart | Fresh International & South Asian Groceries Denmark',
  description: 'Authentic South Asian spices, fresh produce, lentils, pantry essentials and daily care delivered fast across Denmark.',
  keywords: 'Danish grocery, South Asian food, Indian grocery Denmark, fresh vegetables Copenhagen, spices, lentils, sabziwala',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased selection:bg-sky-200 selection:text-navy">
        {children}
      </body>
    </html>
  );
}
