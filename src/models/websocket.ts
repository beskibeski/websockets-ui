import { WebSocket } from 'ws';

interface WebSocketWithId extends WebSocket {
  id: string;
}

export default WebSocketWithId;