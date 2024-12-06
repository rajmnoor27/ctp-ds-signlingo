'use client';

import { quizData } from '@/utils/quizData';
import { Heart, Settings } from 'lucide-react';
import VideoStream from '@/components/VideoStream';
import { useState, useEffect, useRef } from 'react';
import { delay } from '@/lib/utils';

// Extend Window interface to include WebSocket
declare global {
  interface Window {
    ws?: WebSocket;
  }
}

const REQUIRED_PREDICTIONS = 10; // Minimum number of correct predictions needed
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
  const [correctPredictionCount, setCorrectPredictionCount] = useState(0);

  if (isNaN(quizIndex) || quizIndex < 0 || quizIndex >= quizData.length) {
    return <div>Quiz not found</div>;
  }

  const currentQuiz = quizData[quizIndex];
  const expectedLetter = currentQuiz.letters[currentLetterIndex];

  const handlePrediction = async (prediction: string, confidence: number) => {
    if (isCompleted || isTransitioning) return; // Don't process predictions if quiz is completed or transitioning

    // Normalize both strings for comparison
    const normalizedPrediction = prediction.trim().toUpperCase();
    const normalizedExpected = expectedLetter.trim().toUpperCase();

    // Update last prediction for feedback
    setLastPrediction({
      letter: normalizedPrediction,
      confidence: confidence,
    });

    console.log(
      `Predicted: "${normalizedPrediction}" (${(confidence * 100).toFixed(
        1
      )}%) Expected: "${normalizedExpected}"`
    );

    // Check if the prediction matches the expected letter
    if (normalizedPrediction === normalizedExpected) {
      // Increment correct prediction count using functional update
      setCorrectPredictionCount((prev) => {
        const newCount = prev + 1;
        console.log(
          `Correct prediction count: ${newCount}/${REQUIRED_PREDICTIONS}`
        );

        // Check if we have reached the required predictions
        if (newCount >= REQUIRED_PREDICTIONS) {
          // We'll handle the transition in a separate effect
          setIsTransitioning(true);
        }

        return newCount;
      });
    } else {
      // Reset counter if prediction is wrong
      setCorrectPredictionCount(0);
    }
  };

  // Handle transition effect
  useEffect(() => {
    const handleTransition = async () => {
      if (isTransitioning) {
        // Wait for delay
        await delay(TRANSITION_DELAY);

        // Move to next letter
        if (currentLetterIndex < currentQuiz.letters.length - 1) {
          setCurrentLetterIndex((prev) => prev + 1);
          setLastPrediction(null); // Clear the last prediction when moving to next letter
          setCorrectPredictionCount(0); // Reset counter for next letter
          // Update progress after moving to next letter
          setProgress(
            ((currentLetterIndex + 1) / (currentQuiz.letters.length - 1)) * 100
          );
        } else {
          // Quiz completed!
          setIsCompleted(true);
          setProgress(100);
          // Close WebSocket connection
          if (window.ws) {
            window.ws.close();
          }
        }

        setIsTransitioning(false); // End transition
      }
    };

    handleTransition();
  }, [isTransitioning, currentLetterIndex, currentQuiz.letters.length]);

  return (
    <div className='min-h-screen bg-gray-50 p-4 flex flex-col gap-4 items-center'>
      <h1 className='text-2xl font-bold'>{currentQuiz.title}</h1>

      {/* Top bar with settings, progress, and hearts */}
      <div className='flex items-center gap-4 w-[75%]'>
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
        <div className='text-center p-8 bg-white rounded-lg shadow-lg'>
          <h2 className='text-4xl font-bold text-green-600 mb-6'>
            Congratulations! 🎉
          </h2>
          <div className='flex gap-4 justify-center mb-8'>
            {currentQuiz.letters.map((letter) => (
              <div
                key={letter}
                className='w-12 h-12 flex items-center justify-center bg-green-100 rounded-lg border-2 border-green-500'
              >
                <p className='text-xl font-bold text-green-700'>{letter}</p>
              </div>
            ))}
          </div>
          <p className='text-xl text-gray-700 mb-8'>
            You've mastered all {currentQuiz.letters.length} letters in this
            quiz!
          </p>
          <div className='flex gap-4 justify-center'>
            <button
              onClick={() => window.location.reload()}
              className='px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
            >
              Try Again
            </button>
            <button
              onClick={() => (window.location.href = '/lesson')}
              className='px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'
            >
              Next Lesson
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Video Stream */}
          <div className='mb-6'>
            <VideoStream onPrediction={handlePrediction} />
          </div>

          {/* Current Letter Indicator */}
          <div className='mb-4 text-center'>
            <p className='text-gray-600 mb-2'>Sign this letter:</p>
            <div className='text-4xl font-bold text-blue-600'>
              {expectedLetter}
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
            {/* Progress Indicator */}
            {correctPredictionCount > 0 && !isTransitioning && (
              <div className='mt-2 text-green-600'>
                Keep holding... {correctPredictionCount}/{REQUIRED_PREDICTIONS}
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
          <div className='flex gap-4 justify-center'>
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
                <p className='text-2xl font-bold text-gray-700'>{letter}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
