import { lessonData } from '@/utils/lessonData';
import { LessonCard } from '@/components/ui/lesson-card';

export default function Home() {
  return (
    <div className='flex flex-col items-center p-8'>
      <h1 className='mb-8 text-3xl font-bold'>ASL Alphabet Lessons</h1>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {lessonData.map((lesson) => (
          <LessonCard
            key={lesson.id}
            id={lesson.id}
            title={lesson.title}
            description={lesson.description}
          />
        ))}
      </div>
    </div>
  );
}
