import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { lessonData } from '@/utils/lessonData';

type Props = {
  params: {
    id: string;
  };
};

export default function LessonPage({ params }: Props) {
  const lessonId = parseInt(params.id);
  const lesson = lessonData.find((l) => l.id === lessonId);

  if (!lesson) {
    notFound();
  }

  return (
    <main className='flex min-w-full h-screen'>
      <div className='flex flex-col w-full h-full space-y-4 flex-grow px-4 md:px-16 pt-8 pb-16'>
        <div className='max-w-2xl mx-auto w-full'>
          <h1 className='text-4xl md:text-5xl font-bold mb-4'>
            {lesson.title}
          </h1>
          <p className='text-lg md:text-xl mb-8'>{lesson.description}</p>

          <div className='relative w-4/5 md:w-1/2 mx-auto'>
            <Carousel
              opts={{
                align: 'start',
                loop: true,
              }}
              className='relative'
            >
              <CarouselContent>
                {lesson.letters.map((letter) => (
                  <CarouselItem key={letter}>
                    <div className='p-1'>
                      <Card>
                        <CardContent className='flex flex-col items-center justify-center p-4 md:p-6 aspect-square'>
                          <div className='relative w-32 h-32 md:w-40 md:h-40'>
                            <Image
                              src={`/asl_reference_imgs/${letter}.png`}
                              alt={`ASL Letter ${letter}`}
                              fill
                              className='object-contain mb-4'
                            />
                          </div>
                          <span className='text-xl md:text-2xl font-semibold mt-4'>
                            Letter {letter}
                          </span>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          <div className='flex flex-col md:flex-row justify-center gap-4 mt-8 w-full'>
            <Link href='/lesson' className='w-full md:w-auto'>
              <Button variant='outline' className='w-full py-6 text-lg'>
                Back to Lessons
              </Button>
            </Link>
            <Link href={`/quiz/${lesson.id}`} className='w-full md:w-auto'>
              <Button className='w-full bg-feather-green text-white hover:bg-wing-overlay py-6 text-lg'>
                Start Practice
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
