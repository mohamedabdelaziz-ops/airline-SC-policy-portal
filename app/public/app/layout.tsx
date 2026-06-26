import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Disruption Desk - Airline Policy Portal',
  description: 'Schedule change and refund policy database.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
