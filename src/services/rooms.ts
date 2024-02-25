import IData from '../models/data';
import Datatype from '../models/types';
import { getRoomsFromBase, addRoomToBase, addPlayerToRoomBase, checkIfPlayerIsAlreadyInTheRoomAsCreator, getCurrentRoomFromBase, getCurrentRoomFromBaseLength } from '../database/rooms';
import IRoom from '../models/room';
import WebSocketWithId from '../models/websocket';
import { createGame } from './game';
import { wsServer } from '../ws_server';

const createRoom = (wsClient: WebSocketWithId) => {
  console.log('Room is created');  
  const room: IRoom = {
    roomId: crypto.randomUUID(),     
    roomUsers: [],
  }; 
  addRoomToBase(room);
  const data: IData = {
    type: Datatype.CREATE_NEW_ROOM,
    data: JSON.stringify(room),
    id: 0, 
  };
  wsClient.send(JSON.stringify(data));
  addPlayerToRoomBase(room, wsClient);
  updateRoom();
};

const updateRoom = () => {
  console.log('Rooms updated');
  wsServer.clients.forEach((wsClient) => {
    const data: IData = {
      type: Datatype.UPDATE_ROOM,
      data: JSON.stringify(getRoomsFromBase()),
      id: 0,    
    };
    wsClient.send(JSON.stringify(data));
  });  
};

const addToRoom = (wsClient: WebSocketWithId, chunkData: IData) => {
  const indexedRoom = JSON.parse(chunkData.data) as { indexRoom: string };
  const room: IRoom = {
    roomId: indexedRoom.indexRoom,
    roomUsers: [],
  } 
  if (!checkIfPlayerIsAlreadyInTheRoomAsCreator(room, wsClient)) {
    addPlayerToRoomBase(room, wsClient);
  };  
  updateRoom();
  if (getCurrentRoomFromBaseLength(room) > 1) {
    createGame(room);
  };
};

export { createRoom, updateRoom, addToRoom };