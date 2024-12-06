'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className='md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 z-50 px-2'>
      <div className='flex justify-around items-center h-16'>
        {/* Learn */}
        <Link
          href='/lesson'
          className='flex flex-col items-center justify-center w-full'
        >
          <div
            className={`flex flex-col items-center ${
              pathname === '/lesson' ? 'text-macaw' : 'text-wolf'
            }`}
          >
            <HomeIcon className='w-7 h-7' />
            <span className='text-xs mt-1 font-din-rounded font-bold tracking-[0.8px]'>
              LEARN
            </span>
          </div>
        </Link>

        {/* Practice */}
        <Link
          href='/quiz'
          className='flex flex-col items-center justify-center w-full'
        >
          <div
            className={`flex flex-col items-center ${
              pathname === '/quiz' ? 'text-macaw' : 'text-wolf'
            }`}
          >
            <PracticeIcon className='w-7 h-7' />
            <span className='text-xs mt-1 font-din-rounded font-bold tracking-[0.8px]'>
              PRACTICE
            </span>
          </div>
        </Link>

        {/* Leaderboard - Disabled */}
        <div className='flex flex-col items-center justify-center w-full opacity-50 cursor-not-allowed'>
          <div className='flex flex-col items-center text-wolf'>
            <LeaderboardIcon className='w-7 h-7' />
            <span className='text-xs mt-1 font-din-rounded font-bold tracking-[0.8px]'>
              RANK
            </span>
          </div>
        </div>

        {/* Profile/Settings - Disabled */}
        <div className='flex flex-col items-center justify-center w-full opacity-50 cursor-not-allowed'>
          <div className='flex flex-col items-center text-wolf'>
            <SettingsIcon className='w-7 h-7' />
            <span className='text-xs mt-1 font-din-rounded font-bold tracking-[0.8px]'>
              PROFILE
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}

function HomeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 32 32'
      fill='currentColor'
    >
      <path d='M24.5852 25.2658C24.2883 26.8243 22.9257 27.9519 21.3392 27.9519H10.6401C9.05354 27.9519 7.69094 26.8243 7.39408 25.2658L4.98096 12.5969L15.9001 4.52225L26.9988 12.5941L24.5852 25.2658Z' />
    </svg>
  );
}

function PracticeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 46 46'
      fill='currentColor'
    >
      <rect
        x='19.9639'
        y='9.7417'
        width='9'
        height='26'
        rx='4.5'
        transform='rotate(-30 19.9639 9.7417)'
      />
      <rect
        x='5.24219'
        y='18.2417'
        width='9'
        height='26'
        rx='4.5'
        transform='rotate(-30 5.24219 18.2417)'
      />
    </svg>
  );
}

function LeaderboardIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 46 46'
      fill='currentColor'
    >
      <path d='M7 9.5C7 7.84314 8.34315 6.5 10 6.5H36C37.6569 6.5 39 7.84315 39 9.5V23.5C39 32.3366 31.8366 39.5 23 39.5C14.1634 39.5 7 32.3366 7 23.5V9.5Z' />
    </svg>
  );
}

function SettingsIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 46 46'
      fill='currentColor'
    >
      <circle cx='23' cy='23' r='19' stroke='currentColor' strokeWidth='2' />
      <circle cx='15' cy='23' r='2' fill='white' />
      <circle cx='23' cy='23' r='2' fill='white' />
      <circle cx='31' cy='23' r='2' fill='white' />
    </svg>
  );
}
