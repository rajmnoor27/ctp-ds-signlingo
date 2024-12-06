import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import SideNav from '@/components/SideNav';

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
        <main className='flex min-h-screen min-w-full'>
          <SideNav />
          <div className='flex-1'>{children}</div>
        </main>
      </body>
    </html>
  );
}
