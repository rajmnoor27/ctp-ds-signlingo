import { QuizCard } from '@/components/ui/quizCard';
import { quizData } from '@/utils/quizData';

export default function Page() {
  return (
    <main className='flex items-center min-w-full min-h-screen'>
      <div className='flex flex-col items-center h-full space-y-4 flex-grow px-16 pt-8 gap-4 overflow-auto'>
        <h1 className='text-6xl font-bold text-eel'>Test your knowledge!</h1>
        {quizData.map((quiz) => (
          <QuizCard key={quiz.id} id={quiz.id} title={quiz.title} />
        ))}
      </div>
    </main>
  );
}
