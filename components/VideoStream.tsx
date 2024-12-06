'use client';

import { useEffect, useRef, useState } from 'react';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { HAND_CONNECTIONS } from '@mediapipe/hands';

export default function VideoStream() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [handLandmarker, setHandLandmarker] = useState<any>(null);
  const [webcamRunning, setWebcamRunning] = useState(false);

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

  const enableCam = async () => {
    if (!handLandmarker) return;

    if (webcamRunning && videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    } else if (videoRef.current) {
      const constraints = { video: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoRef.current.srcObject = stream;
    }

    setWebcamRunning((prev) => !prev);
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

    if (results.landmarks && results.landmarks.length !== 0) {
      console.log('Detection results:', results);
      console.log('Landmark data:', results.landmarks);
    }

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.scale(-1, 1);
    ctx.translate(-canvas.width, 0);

    if (results.landmarks && results.landmarks.length > 0) {
      console.log('Detection results:', results);
      console.log('Landmark data:', results.landmarks);

      for (const landmarks of results.landmarks) {
        landmarks.forEach((landmark: any) => {
          const x = landmark.x * canvas.width;
          const y = landmark.y * canvas.height;

          ctx.beginPath();
          ctx.fillStyle = '#FF0000';
          ctx.arc(x, y, 5, 0, 2 * Math.PI);
          ctx.fill();
        });

        drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
          color: '#00FF00',
          lineWidth: 5,
        });
        drawLandmarks(ctx, landmarks, {
          color: '#FF0000',
          lineWidth: 1,
          radius: 5,
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

  return (
    <div className='relative w-fit '>
      <div className='flex justify-center mb-4'>
        <button
          onClick={enableCam}
          className='px-4 py-2 bg-blue-500 text-white rounded'
        >
          {webcamRunning ? 'Disable' : 'Enable'} Webcam
        </button>
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
          // style={{ transform: 'rotateY(180deg)' }}
        />
      </div>
    </div>
  );
}
