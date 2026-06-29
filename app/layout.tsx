import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Yufei Liu — Portfolio',
  description: 'Senior Full Stack Developer in Wellington, NZ.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
