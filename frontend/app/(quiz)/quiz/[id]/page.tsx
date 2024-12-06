'use client';

import { quizData } from '@/utils/quizData';
import { Heart, Settings } from 'lucide-react';
import VideoStream from '@/components/VideoStream';
import { useState, useEffect, useRef } from 'react';
import { delay } from '@/lib/utils';
import { WebSocketProvider, useWebSocket } from '@/contexts/WebSocketContext';

const HOLD_TIME_REQUIRED = 3000; // 3 seconds in milliseconds
const TRANSITION_DELAY = 2000; // 2 seconds delay

export default function QuizPage({ params }: any) {
  const quizIndex = parseInt(params.id) - 1;
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [lastPrediction, setLastPrediction] = useState<{
    letter: string;
    confidence: number;
  } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [holdStartTime, setHoldStartTime] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(4);
  const [completedLetters, setCompletedLetters] = useState<Set<number>>(
    new Set()
  );
  const { ws } = useWebSocket();

  // Timer effect for tracking hold duration
  useEffect(() => {
    let animationFrame: number;

    const updateHoldProgress = () => {
      if (holdStartTime && !isTransitioning) {
        const holdDuration = Date.now() - holdStartTime;
        const remaining = Math.max(
          HOLD_TIME_REQUIRED / 1000 - holdDuration / 1000,
          0
        );
        setTimeRemaining(remaining);

        if (holdDuration >= HOLD_TIME_REQUIRED) {
          handleLetterCompletion();
          return;
        }

        animationFrame = requestAnimationFrame(updateHoldProgress);
      }
    };

    if (holdStartTime) {
      animationFrame = requestAnimationFrame(updateHoldProgress);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [holdStartTime, isTransitioning]);

  if (isNaN(quizIndex) || quizIndex < 0 || quizIndex >= quizData.length) {
    return <div>Quiz not found</div>;
  }

  const currentQuiz = quizData[quizIndex];
  const expectedLetter = currentQuiz.letters[currentLetterIndex];

  const handlePrediction = async (
    prediction: string | undefined,
    confidence: number
  ) => {
    if (isCompleted || isTransitioning) return;
    if (!prediction) return;

    // Normalize both strings for comparison
    const normalizedPrediction = prediction.trim().toUpperCase();
    const normalizedExpected = expectedLetter.trim().toUpperCase();

    // Find the index of the predicted letter in the quiz letters
    const predictedLetterIndex = currentQuiz.letters.findIndex(
      (letter) => letter.trim().toUpperCase() === normalizedPrediction
    );

    // If the predicted letter is from a previous letter that's already completed, ignore it
    if (completedLetters.has(predictedLetterIndex)) {
      return;
    }

    // Update last prediction for feedback
    if (normalizedPrediction !== '') {
      setLastPrediction({
        letter: normalizedPrediction,
        confidence: confidence,
      });

      // Start or reset timer based on prediction
      if (normalizedPrediction === normalizedExpected) {
        if (!holdStartTime) {
          setHoldStartTime(Date.now());
          setTimeRemaining(4);
        }
      } else {
        setHoldStartTime(null);
        setTimeRemaining(4);
      }
    }
  };

  const handleLetterCompletion = async () => {
    try {
      setIsTransitioning(true);
      setHoldStartTime(null);
      setTimeRemaining(4);

      // Calculate next index
      const nextIndex = currentLetterIndex + 1;
      const isLastLetter = nextIndex >= currentQuiz.letters.length;

      // Only delay if it's not the last letter
      if (!isLastLetter) {
        await delay(TRANSITION_DELAY);
      }

      // Add current letter to completed set
      setCompletedLetters((prev) => new Set(prev).add(currentLetterIndex));

      if (!isLastLetter) {
        // Update progress before changing letter
        const newProgress = (nextIndex / currentQuiz.letters.length) * 100;
        setProgress(newProgress);

        // Reset states
        setLastPrediction(null);

        // Move to next letter
        setCurrentLetterIndex(nextIndex);
      } else {
        // Quiz completed!
        setIsCompleted(true);
        setProgress(100);
        if (ws) {
          ws.close();
        }
      }
    } finally {
      setIsTransitioning(false);
    }
  };

  return (
    <WebSocketProvider>
      <main className='flex min-w-full min-h-screen'>
        <div className='flex flex-col w-full space-y-4 flex-grow px-4 md:px-16 py-8'>
          <div className='max-w-3xl mx-auto w-full'>
            <h1 className='text-2xl font-bold mb-4'>{currentQuiz.title}</h1>

            {/* Top bar with settings, progress, and hearts */}
            <div className='flex items-center gap-4 mb-4'>
              <Settings className='w-6 h-6 text-gray-600' />

              <div className='flex-1'>
                <div className='w-full bg-gray-200 rounded-full h-2.5'>
                  <div
                    className='bg-[#6BA6FF] h-2.5 rounded-full transition-all duration-300'
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              <div className='flex items-center gap-1'>
                <Heart className='w-6 h-6 fill-red-500 text-red-500' />
                <span className='font-bold'>5</span>
              </div>
            </div>

            {isCompleted ? (
              <div className='flex items-center justify-center py-8'>
                <div className='text-center p-8 bg-white rounded-lg shadow-lg w-full max-w-md'>
                  <h2 className='text-4xl font-bold text-green-600 mb-6'>
                    Congratulations! 🎉
                  </h2>
                  <div className='flex gap-4 justify-center mb-8 flex-wrap'>
                    {currentQuiz.letters.map((letter) => (
                      <div
                        key={letter}
                        className='w-12 h-12 flex items-center justify-center bg-green-100 rounded-lg border-2 border-green-500'
                      >
                        <p className='text-xl font-bold text-green-700'>
                          {letter}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className='text-xl text-gray-700 mb-8'>
                    You've mastered all {currentQuiz.letters.length} letters in
                    this quiz!
                  </p>
                  <div className='flex flex-col md:flex-row gap-4 justify-center w-full'>
                    <button
                      onClick={() => window.location.reload()}
                      className='w-full py-6 text-lg bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
                    >
                      Try Again
                    </button>
                    <button
                      onClick={() => (window.location.href = '/quiz')}
                      className='w-full py-6 text-lg bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'
                    >
                      Next Quiz
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className='mb-8 w-full'>
                  <VideoStream onPrediction={handlePrediction} />
                </div>

                {/* Current Letter Indicator */}
                <div className='mb-4 text-center'>
                  <p className='text-gray-600 mb-2'>Sign this letter:</p>
                  <div className='text-4xl font-bold text-blue-600'>
                    {expectedLetter}
                    {holdStartTime && !isTransitioning && (
                      <div className='text-lg text-green-600 mt-2'>
                        {timeRemaining.toFixed(1)}s remaining
                      </div>
                    )}
                  </div>
                  {/* Last Prediction Feedback */}
                  {lastPrediction && (
                    <div
                      className={`mt-2 text-lg ${
                        lastPrediction.letter === expectedLetter
                          ? 'text-green-600'
                          : 'text-gray-600'
                      }`}
                    >
                      Detected: {lastPrediction.letter}
                      <span className='text-sm ml-2'>
                        ({(lastPrediction.confidence * 100).toFixed(1)}%)
                      </span>
                    </div>
                  )}
                  {/* Transition Indicator */}
                  {isTransitioning && (
                    <div className='mt-2 text-green-600 animate-pulse'>
                      Great job! Get ready for the next letter...
                    </div>
                  )}
                </div>

                {/* Letter Progress */}
                <div className='flex gap-4 justify-center flex-wrap'>
                  {currentQuiz.letters.map((letter, index) => (
                    <div
                      key={letter}
                      className={`w-16 h-16 flex items-center justify-center rounded-lg shadow-md transition-all duration-300 ${
                        index === currentLetterIndex
                          ? 'bg-blue-100 border-2 border-blue-500 scale-110'
                          : index < currentLetterIndex
                          ? 'bg-green-100 border-2 border-green-500'
                          : 'bg-white border-2 border-blue-200'
                      }`}
                    >
                      <p className='text-2xl font-bold text-gray-700'>
                        {letter}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </WebSocketProvider>
  );
}
