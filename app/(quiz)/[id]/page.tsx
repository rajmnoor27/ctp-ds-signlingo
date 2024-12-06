import { QuizCard } from '@/components/ui/quizCard';

interface QuizPageProps {
  params: {
    id: string;
  };
}

export default function QuizPage({ params }: QuizPageProps) {
  return (
    <div className='min-h-screen bg-gray-50'>
      <QuizCard />
    </div>
  );
}
