import SideNav from '@/components/SideNav';
import { QuizCard } from '@/components/ui/quizCard';

export default function Page() {
  return (
    <main className='flex min-h-screen items-center min-w-full'>
      <SideNav />
      <QuizCard />
    </main>
  );
}
