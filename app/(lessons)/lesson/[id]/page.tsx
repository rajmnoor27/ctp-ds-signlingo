import { VideoPlayer } from '@/components/video/video-player';

interface LessonPageProps {
  params: {
    id: string;
  };
}

export default function LessonPage({ params }: LessonPageProps) {
  // In a real app, you would fetch lesson data based on the id
  const lessonData = {
    title: `Lesson ${params.id}`,
    videoUrl: '/lesson-video.mp4',
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6'>{lessonData.title}</h1>
      <div className='max-w-4xl mx-auto'>
        <VideoPlayer
          src={lessonData.videoUrl}
          title={lessonData.title}
          onComplete={() => console.log('Video completed')}
        />
      </div>
    </div>
  );
}
