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
    <div className='container mx-auto py-8'>
      <h1 className='text-3xl font-bold mb-4'>{lesson.title}</h1>
      <p className='mb-8'>{lesson.description}</p>

      <div className='relative w-full max-w-md mx-auto'>
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
                    <CardContent className='flex flex-col items-center justify-center p-6 aspect-square'>
                      <Image
                        src={`/asl_reference_imgs/${letter}.png`}
                        alt={`ASL Letter ${letter}`}
                        width={200}
                        height={200}
                        className='mb-4'
                      />
                      <span className='text-2xl font-semibold'>
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

      <div className='flex justify-center gap-4 mt-8'>
        <Link href='/'>
          <Button variant='outline'>Back to Home</Button>
        </Link>
        <Link href={`/quiz/${lesson.id}`}>
          <Button className='bg-feather-green text-white hover:bg-wing-overlay'>
            Start Practice
          </Button>
        </Link>
      </div>
    </div>
  );
}
