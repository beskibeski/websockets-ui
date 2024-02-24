import IRoom from '../models/room';
import WebSocketWithId from '../models/websocket';
import { getPlayerById } from './players';

let rooms: IRoom[] = [];

const getRoomsFromBase = (): IRoom[] => {
 return rooms;
}

const addRoomToBase = (room: IRoom): void => {  
  rooms.push(room);
}

const addPlayerToRoomBase = (room: IRoom, wsSocket: WebSocketWithId): void => {
  console.log('Player is added to room');  
  rooms.forEach((roomInBase) => {    
    if (roomInBase.roomId === room.roomId && roomInBase.roomUsers.length <= 1) {      
      roomInBase.roomUsers.push(getPlayerById(wsSocket.id));
    }
  });  
}

const deleteRoomFromBase = (roomToDelete: IRoom): void => {
  rooms = rooms.filter((room) => 
    room.roomId !== roomToDelete.roomId
  );
}

const getCurrentRoomFromBase = (currentRoom: IRoom): IRoom=> {
  const roomToGet = rooms.find((room) => room.roomId === currentRoom.roomId);
    if (roomToGet !== undefined) {
      return roomToGet;
    } else return currentRoom;
}

const getCurrentRoomFromBaseLength = (currentRoom: IRoom): number=> {
  const roomToGet = rooms.find((room) => room.roomId === currentRoom.roomId);
    if (roomToGet !== undefined) {
      return roomToGet.roomUsers.length;
    } else return currentRoom.roomUsers.length;
}

const checkIfPlayerIsAlreadyInTheRoomAsCreator = (roomForCheck: IRoom, wsClient: WebSocketWithId):boolean => { 
  let isAlready = false;
  rooms.forEach((room) => {
    if (room.roomId === roomForCheck.roomId) {
      room.roomUsers.forEach((player) => {
        if (player.index === wsClient.id) {
          isAlready = true;
        }       
      })
    }
  });
  return isAlready;
}

export {
  getRoomsFromBase,
  addRoomToBase,
  addPlayerToRoomBase,
  deleteRoomFromBase,
  getCurrentRoomFromBase,
  checkIfPlayerIsAlreadyInTheRoomAsCreator,
  getCurrentRoomFromBaseLength,
};