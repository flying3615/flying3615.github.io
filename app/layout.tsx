import type { Metadata } from 'next';
import { Almarai, Instrument_Serif } from 'next/font/google';
import './globals.css';

const almarai = Almarai({
  subsets: ['latin'],
  weight: ['300', '400', '700', '800'],
  variable: '--font-almarai',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
  variable: '--font-instrument-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Yufei Liu — Portfolio',
  description: 'Senior Full Stack Developer in Wellington, NZ.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${almarai.variable} ${instrumentSerif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
