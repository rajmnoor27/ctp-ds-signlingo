'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

interface WebSocketContextType {
  ws: WebSocket | null;
  isConnected: boolean;
  error: string | null;
  sendMessage: (message: any) => void;
  setMessageHandler: (handler: (data: any) => void) => void;
}

const WebSocketContext = createContext<WebSocketContextType>({
  ws: null,
  isConnected: false,
  error: null,
  sendMessage: () => {},
  setMessageHandler: () => {},
});

export const useWebSocket = () => useContext(WebSocketContext);

// Add reconnection backoff settings
const INITIAL_RECONNECT_DELAY = 1000;
const MAX_RECONNECT_DELAY = 30000;
const RECONNECT_BACKOFF_MULTIPLIER = 1.5;

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const messageHandlerRef = useRef<((data: any) => void) | null>(null);
  const reconnectAttempts = useRef<number>(0);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateReconnectDelay = () => {
    const delay =
      INITIAL_RECONNECT_DELAY *
      Math.pow(RECONNECT_BACKOFF_MULTIPLIER, reconnectAttempts.current);
    return Math.min(delay, MAX_RECONNECT_DELAY);
  };

  const sendMessage = (message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify(message));
      } catch (err) {
        console.error('Error sending message:', err);
      }
    }
  };

  const setMessageHandler = (handler: (data: any) => void) => {
    messageHandlerRef.current = handler;
  };

  const connectWebSocket = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    // Clear any existing reconnection timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws';
    console.log('Creating new WebSocket connection to:', wsUrl);
    const ws = new WebSocket(wsUrl);

    // Set a connection timeout
    const connectionTimeout = setTimeout(() => {
      if (ws.readyState !== WebSocket.OPEN) {
        ws.close();
        setError('Connection timeout. Please check your internet connection.');
      }
    }, 10000);

    ws.onopen = () => {
      console.log('WebSocket connected successfully');
      clearTimeout(connectionTimeout);
      setIsConnected(true);
      setError(null);
      reconnectAttempts.current = 0;
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (messageHandlerRef.current) {
          messageHandlerRef.current(data);
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('Failed to connect to the server. Please try again.');
      setIsConnected(false);
    };

    ws.onclose = (event) => {
      console.log('WebSocket connection closed:', event.code, event.reason);
      setIsConnected(false);
      wsRef.current = null;
      clearTimeout(connectionTimeout);

      // Only attempt to reconnect if it wasn't a normal closure
      if (event.code !== 1000 && event.code !== 1001) {
        console.log('Abnormal closure, attempting to reconnect...');
        const delay = calculateReconnectDelay();
        reconnectAttempts.current++;

        reconnectTimeoutRef.current = setTimeout(() => {
          console.log(
            `Attempting to reconnect (attempt ${reconnectAttempts.current})...`
          );
          connectWebSocket();
        }, delay);
      }
    };

    wsRef.current = ws;
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      console.log('Cleaning up WebSocket connection...');
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounting');
        wsRef.current = null;
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider
      value={{
        ws: wsRef.current,
        isConnected,
        error,
        sendMessage,
        setMessageHandler,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}
