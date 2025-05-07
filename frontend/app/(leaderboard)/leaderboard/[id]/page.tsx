'use client';

import * as React from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Mock leaderboard data
const leaderboardData = [
  { name: 'Alex M.', score: 98 },
  { name: 'Jamie L.', score: 92 },
  { name: 'Taylor S.', score: 89 },
  { name: 'Jordan B.', score: 85 },
  { name: 'Riley K.', score: 80 },
];

export default function LeaderboardPage() {
  return (
    <main className='flex min-h-screen'>
      <div className='flex flex-col w-full space-y-4 flex-grow px-4 md:px-16 py-8'>
        <div className='max-w-2xl mx-auto w-full'>
          <h1 className='text-3xl md:text-5xl font-bold mb-4'>Leaderboard</h1>
          <p className='text-base md:text-xl mb-8'>
            See where you stand among the top learners.
          </p>

          <div className='flex flex-col gap-4'>
            {leaderboardData.map((entry, index) => (
              <Card key={index}>
                <CardContent className='flex justify-between items-center py-4 px-6'>
                  <span className='text-lg md:text-xl font-semibold'>
                    {index + 1}. {entry.name}
                  </span>
                  <span className='text-lg md:text-xl font-bold text-feather-green'>
                    {entry.score} pts
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className='flex justify-center mt-8'>
            <Link href='/'>
              <Button variant='outline' className='py-4 md:py-6 text-lg'>
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
