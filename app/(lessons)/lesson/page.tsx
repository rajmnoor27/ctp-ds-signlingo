import { lessonData } from '@/utils/lessonData';
import { LessonCard } from '@/components/ui/lesson-card';

export default function Page() {
  return (
    <div className='flex flex-col h-screen'>
      <div className='flex flex-col items-center h-full space-y-4 flex-grow px-16 pt-8 gap-4 overflow-auto'>
        <h1 className='text-6xl font-bold text-eel'>
          Learn American Sign Language
        </h1>
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
