'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from './button';
import { lessonData } from '@/utils/lessonData';

interface LessonCardProps {
  id: number;
  title: string;
  description: string;
}

export function LessonCard({ id, title, description }: LessonCardProps) {
  return (
    <div className='w-full'>
      <div className='flex items-center justify-between bg-[#6BA6FF] p-4 rounded-lg w-full md:max-w-2xl min-h-[140px] md:min-h-[160px] px-6 md:px-12'>
        <div className='flex flex-col gap-3 text-white flex-1'>
          <h2 className='text-2xl md:text-3xl font-bold'>{title}</h2>
          <div className='flex gap-2 flex-wrap'>
            {lessonData[id - 1].letters.map((letter) => (
              <p key={letter} className='text-base md:text-lg font-bold'>
                {letter}
              </p>
            ))}
          </div>
          <Link href={`/lesson/${id}`} className='w-full sm:w-32'>
            <Button className='bg-feather-green drop-shadow-2xl hover:bg-feather-green/80 text-base md:text-lg py-2 md:py-3 w-full'>
              Start
            </Button>
          </Link>
        </div>
        <div className='flex-shrink-0 ml-4'>
          <Image
            src='/chicken1.png'
            width={80}
            height={80}
            alt='Picture of chicken with thumbs up'
            className='rounded-lg w-20 h-20 md:w-24 md:h-24 object-contain'
          />
        </div>
      </div>
    </div>
  );
}
