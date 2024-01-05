declare module 'react-websocket' {
    const WebSocket: React.FC<{ url: string; onMessage: (message: any) => void }>;
    export default WebSocket;
  }
  