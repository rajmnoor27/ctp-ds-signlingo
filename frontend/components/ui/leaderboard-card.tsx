'use client';

import Image from 'next/image';

interface LeaderboardCardProps {
  rank: number;
  name: string;
  score: number;
}

function getMedal(rank: number) {
  if (rank === 1) return '🥇'; // gold
  if (rank === 2) return '🥈'; // silver
  if (rank === 3) return '🥉'; // bronze
  return null;
}

export function LeaderboardCard({ rank, name, score }: LeaderboardCardProps) {
  return (
    <div className='w-full'>
      <div className='flex items-center justify-between bg-[#FFD966] p-4 rounded-lg w-full md:max-w-2xl min-h-[120px] md:min-h-[140px] px-6 md:px-12'>
        <div className='flex flex-col gap-2 text-black flex-1'>
          <h2 className='text-2xl md:text-3xl font-bold'>
            #{rank} — {name} {getMedal(rank)}
          </h2>
          <p className='text-lg md:text-xl font-semibold'>Score: {score}</p>
        </div>
        
      </div>
    </div>
  );
}
