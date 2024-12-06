'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from './button';
import { quizData } from '@/utils/quizData';

interface QuizCardProps {
  id: number;
  title: string;
}

export function QuizCard({ id, title }: QuizCardProps) {
  return (
    <div className='w-full h-full'>
      <div className='flex items-center justify-between bg-[#6BA6FF] p-4 rounded-lg min-w-[700px] max-w-[800px] min-h-[200px] px-24'>
        <div className='flex flex-col text-white gap-4'>
          <h2 className='text-4xl font-bold'>{title}</h2>

            {quizData[id - 1].letters.map((letter) => (
              <p key={letter} className='text-lg font-bold'>
                {letter}
              </p>
          ))}
        </div>
        <Link href={`/quiz/${id}`}>
          <Button className='bg-feather-green drop-shadow-2xl hover:bg-feather-green/80'>
              Start
            </Button>
          </Link>
        </div>
        <Image
          className='rounded-lg'
          src='/chicken1.png'
          width={144}
          height={144}
          alt='Picture of chicken with thumbs up'
      />
    </div>
  );
}
