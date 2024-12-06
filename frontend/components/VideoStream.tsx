'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { HAND_CONNECTIONS } from '@mediapipe/hands';

interface VideoStreamProps {
  onPrediction?: (prediction: string, confidence: number) => void;
}

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
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const [handLandmarker, setHandLandmarker] = useState<any>(null);
  const [webcamRunning, setWebcamRunning] = useState(false);
  const [prediction, setPrediction] = useState<{
    prediction: string | null;
    confidence: number;
  } | null>(null);
  const [isWsConnected, setIsWsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    // Clear any existing reconnection timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    console.log('Creating new WebSocket connection...');
    const ws = new WebSocket('ws://localhost:8000/ws');

    ws.onopen = () => {
      console.log('WebSocket connected successfully');
      setIsWsConnected(true);
      setError(null);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.error) {
          console.error('Prediction error:', data.error);
          setError(data.error);
        } else {
          console.log('Received prediction:', data);
          setPrediction(data);
          if (onPrediction && data.prediction) {
            onPrediction(data.prediction, data.confidence);
          }
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('Failed to connect to the server. Please try again.');
      setIsWsConnected(false);
    };

    ws.onclose = (event) => {
      console.log('WebSocket connection closed:', event.code, event.reason);
      setIsWsConnected(false);
      wsRef.current = null;

      reconnectTimeoutRef.current = setTimeout(() => {
        console.log('Attempting to reconnect...');
        connectWebSocket();
      }, 100);
    };

    wsRef.current = ws;
  }, [onPrediction]);

  // Initialize WebSocket connection
  useEffect(() => {
    console.log('Initial WebSocket setup...');
    connectWebSocket();

    return () => {
      console.log('Cleaning up WebSocket connection...');
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connectWebSocket]);

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

  // Add cleanup function for camera
  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setWebcamRunning(false);
  }, []);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [stopCamera]);

  const enableCam = async () => {
    if (!handLandmarker || !isWsConnected) {
      setError('Please wait for the system to initialize...');
      return;
    }

    try {
      const constraints = { video: true };
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

  const predictWebcam = async () => {
    if (!videoRef.current || !canvasRef.current || !handLandmarker) return;

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
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        try {
          wsRef.current.send(JSON.stringify(results.landmarks));
        } catch (err) {
          console.error('Error sending landmarks:', err);
          // If we get an error sending, attempt to reconnect
          if (wsRef.current) {
            wsRef.current.close();
          }
        }
      }

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
    if (isWsConnected && handLandmarker && !webcamRunning) {
      console.log('System ready, starting camera automatically...');
      enableCam();
    }
  }, [isWsConnected, handLandmarker]);

  return (
    <div className='relative w-fit'>
      <div className='flex flex-col items-center gap-2 mb-4'>
        {error && (
          <div className='text-red-500 bg-red-100 p-2 rounded mb-2'>
            {error}
          </div>
        )}
        <div className='text-md text-gray-600'>
          {!isWsConnected
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
