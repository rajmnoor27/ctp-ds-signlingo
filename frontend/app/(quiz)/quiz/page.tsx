import { QuizCard } from '@/components/ui/quizCard';
import { quizData } from '@/utils/quizData';

export default function Page() {
  return (
    <main className='flex min-w-full min-h-screen'>
      <div className='flex flex-col w-full h-full space-y-4 flex-grow px-4 md:px-16 pt-8 pb-24 md:pb-8 gap-4 overflow-auto'>
        <h1 className='text-4xl md:text-6xl font-bold text-eel text-center'>
          Test your knowledge!
        </h1>
        <div className='flex flex-col gap-4 w-full max-w-3xl mx-auto'>
          {quizData.map((quiz) => (
            <QuizCard key={quiz.id} id={quiz.id} title={quiz.title} />
          ))}
        </div>
      </div>
    </main>
  );
}
