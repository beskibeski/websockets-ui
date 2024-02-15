import { WebSocket } from "ws";
import IData from "../models/data";
import Datatype from "../models/types";
import getRooms from "../database/rooms";

const createRoom = (wsClient: WebSocket, chunkData: IData) => {
  console.log('Room is created');
  wsClient.send(JSON.stringify(chunkData));
}

const updateRoom = (wsClient: WebSocket) => {
  console.log('Rooms updated');
  const data: IData = {
    type: Datatype.UPDATE_ROOM,
    data: JSON.stringify(getRooms()),
    id: 0,    
  }
  wsClient.send(JSON.stringify(data));
}

export { createRoom, updateRoom };