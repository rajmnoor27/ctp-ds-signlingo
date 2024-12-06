import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import SideNav from '@/components/SideNav';
import MobileNav from '@/components/MobileNav';

const nunito = Nunito({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ASL Learning App',
  description: 'Learn American Sign Language',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={nunito.className}>
        <div className='flex min-h-screen relative'>
          <SideNav />

          {/* Main Content */}
          <div className='flex-1 p-4 md:p-8 pb-24 md:pb-8'>{children}</div>

          {/* Mobile Navigation */}
          <MobileNav />
        </div>
      </body>
    </html>
  );
}
