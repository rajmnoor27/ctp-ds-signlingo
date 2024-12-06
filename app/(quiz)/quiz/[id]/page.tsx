import { quizData } from '@/utils/quizData';
import { Heart, Settings } from 'lucide-react';
import VideoStream from '@/components/VideoStream';

export default function QuizPage({ params }: any) {
  const quizIndex = parseInt(params.id) - 1;

  if (isNaN(quizIndex) || quizIndex < 0 || quizIndex >= quizData.length) {
    return <div>Quiz not found</div>;
  }

  return (
    <div className='min-h-screen bg-gray-50 p-4 flex flex-col gap-4 items-center'>
      <h1 className='text-2xl font-bold'>{quizData[quizIndex].title}</h1>
      {/* Top bar with settings, progress, and lives */}
      <div className='flex items-center gap-4 mb-6 w-[75%]'>
        <Settings className='w-6 h-6 text-gray-600' />

        <div className='flex-1'>
          <div className='w-full bg-gray-200 rounded-full h-2.5'>
            <div
              className='bg-[#6BA6FF] h-2.5 rounded-full'
              style={{ width: '45%' }}
            ></div>
          </div>
        </div>

        <div className='flex items-center gap-1'>
          <Heart className='w-6 h-6 fill-red-500 text-red-500' />
          <span className='font-bold'>5</span>
        </div>
      </div>

      {/* Video Stream */}
      <div className='mb-6'>
        <VideoStream />
      </div>

      <div className='flex gap-4 justify-center'>
        {quizData[quizIndex].letters.map((letter) => (
          <div
            key={letter}
            className='w-16 h-16 flex items-center justify-center rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 border-blue-200'
          >
            <p className='text-2xl font-bold text-gray-700'>{letter}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
