'use client';

import { useEffect, useRef, useState } from 'react';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { HAND_CONNECTIONS } from '@mediapipe/hands';
import { useWebSocket } from '@/contexts/WebSocketContext';

interface VideoStreamProps {
  onPrediction?: (prediction: string, confidence: number) => void;
}

const FRAME_RATE = 60; // Reduced from 10 for lower resource usage
const FRAME_INTERVAL = 1000 / FRAME_RATE;

// Add video constraints for lower resolution
const VIDEO_CONSTRAINTS = {
  width: { ideal: 640 }, // Back to original size
  height: { ideal: 480 }, // Back to original size
  frameRate: { max: FRAME_RATE },
};

const drawCustomLandmarks = (
  ctx: CanvasRenderingContext2D,
  landmarks: any[],
  options: { color: string; radius: number }
) => {
  landmarks.forEach((landmark) => {
    const x = landmark.x * ctx.canvas.width;
    const y = landmark.y * ctx.canvas.height;

    ctx.beginPath();
    ctx.fillStyle = options.color;
    ctx.arc(x, y, options.radius, 0, 2 * Math.PI);
    ctx.fill();
  });
};

const drawCustomConnectors = (
  ctx: CanvasRenderingContext2D,
  landmarks: any[],
  connections: number[][],
  options: { color: string; lineWidth: number }
) => {
  ctx.strokeStyle = options.color;
  ctx.lineWidth = options.lineWidth;

  connections.forEach(([start, end]) => {
    const startPoint = landmarks[start];
    const endPoint = landmarks[end];

    if (startPoint && endPoint) {
      const startX = startPoint.x * ctx.canvas.width;
      const startY = startPoint.y * ctx.canvas.height;
      const endX = endPoint.x * ctx.canvas.width;
      const endY = endPoint.y * ctx.canvas.height;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
  });
};

export default function VideoStream({ onPrediction }: VideoStreamProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [handLandmarker, setHandLandmarker] = useState<any>(null);
  const [webcamRunning, setWebcamRunning] = useState(false);
  const [prediction, setPrediction] = useState<{
    prediction: string | null;
    confidence: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lastProcessedTime = useRef<number>(0);

  // Use the WebSocket context
  const {
    isConnected,
    error: wsError,
    sendMessage,
    setMessageHandler,
  } = useWebSocket();

  useEffect(() => {
    // Set up message handler for predictions
    setMessageHandler((data) => {
      if (data.error) {
        console.error('Prediction error:', data.error);
        setError(data.error);
      } else {
        setPrediction(data);
        if (onPrediction && data.prediction) {
          onPrediction(data.prediction, data.confidence);
        }
      }
    });
  }, [setMessageHandler, onPrediction]);

  useEffect(() => {
    const initHandLandmarker = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm'
      );

      const detector = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands: 2,
      });

      setHandLandmarker(detector);
    };

    initHandLandmarker();
  }, []);

  const predictWebcam = async () => {
    if (!videoRef.current || !canvasRef.current || !handLandmarker) return;

    const currentTime = performance.now();
    // Check if enough time has passed since last processing
    if (currentTime - lastProcessedTime.current < FRAME_INTERVAL) {
      requestAnimationFrame(predictWebcam);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      requestAnimationFrame(predictWebcam);
      return;
    }

    video.width = video.videoWidth;
    video.height = video.videoHeight;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const startTimeMs = performance.now();
    const results = handLandmarker.detectForVideo(video, startTimeMs);

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.landmarks && results.landmarks.length > 0) {
      // Send landmarks through WebSocket with rate limiting
      sendMessage(results.landmarks);
      lastProcessedTime.current = currentTime;

      for (const landmarks of results.landmarks) {
        drawCustomConnectors(ctx, landmarks, HAND_CONNECTIONS, {
          color: '#00FF00',
          lineWidth: 2,
        });

        drawCustomLandmarks(ctx, landmarks, {
          color: '#FF0000',
          radius: 4,
        });
      }
    }

    ctx.restore();

    if (webcamRunning) {
      requestAnimationFrame(predictWebcam);
    }
  };

  useEffect(() => {
    if (webcamRunning) {
      predictWebcam();
    }
  }, [webcamRunning]);

  // Add a new effect to automatically start the camera when ready
  useEffect(() => {
    if (isConnected && handLandmarker && !webcamRunning) {
      console.log('System ready, starting camera automatically...');
      enableCam();
    }
  }, [isConnected, handLandmarker]);

  const enableCam = async () => {
    if (!handLandmarker || !isConnected) {
      setError('Please wait for the system to initialize...');
      return;
    }

    try {
      const constraints = {
        video: VIDEO_CONSTRAINTS,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setWebcamRunning(true);
        setError(null);
      }
    } catch (err) {
      setError('Failed to access camera. Please check permissions.');
      console.error('Camera access error:', err);
    }
  };

  return (
    <div className='relative w-fit'>
      <div className='flex flex-col items-center gap-2 mb-4'>
        {(error || wsError) && (
          <div className='text-red-500 bg-red-100 p-2 rounded mb-2'>
            {error || wsError}
          </div>
        )}
        <div className='text-md text-gray-600'>
          {!isConnected
            ? 'Connecting to server...'
            : !handLandmarker
            ? 'Loading hand detection...'
            : !webcamRunning
            ? 'Starting camera...'
            : 'Camera active'}
        </div>
      </div>
      <div className='relative w-[640px] h-[480px]'>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          width={640}
          height={480}
          onLoadedData={predictWebcam}
          style={{ transform: 'rotateY(180deg)' }}
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className='absolute top-0 left-0'
          style={{ transform: 'rotateY(180deg)' }}
        />
        {prediction && (
          <div className='absolute top-4 left-4 bg-black/50 text-white p-2 rounded'>
            <p>Sign: {prediction.prediction}</p>
            <p>Confidence: {(prediction.confidence * 100).toFixed(1)}%</p>
          </div>
        )}
      </div>
    </div>
  );
}
