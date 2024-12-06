import SideNav from '@/components/SideNav';
import { LessonCard } from '@/components/ui/lesson-card';

export default function Page() {
  return (
    <main className='flex min-h-screen items-center min-w-full'>
      <SideNav />
      <LessonCard />
    </main>
  );
}
