import crypto from 'crypto';
import IGame from '../models/game';
import IData from '../models/data';
import Datatype from '../models/types';
import WebSocketWithId from '../models/websocket';
import { wsServer } from '../ws_server';
import IRoom from '../models/room';
import { deleteRoomFromBase, getCurrentRoomFromBase } from '../database/rooms';
import IAddShips from '../models/ships';
import addShipsToBase from '../database/game';
import { IPlayersWithShips } from '../models/game-players-ships';
import IShip from '../models/ship';

const createGame = (room: IRoom) => {
  const ids: string[] = [];
  const gameId = crypto.randomUUID();
  getCurrentRoomFromBase(room).roomUsers.forEach((player) => {
    ids.push(player.index);
  });
  ids.forEach((id) => {
    wsServer.clients.forEach((wsClient) => {
      if ((wsClient as WebSocketWithId).id === id) {
        const game: IGame = {    
          idGame: gameId,
          idPlayer: id,
        };
        const data: IData = {
          type: Datatype.CREATE_GAME,
          data: JSON.stringify(game),
          id: 0,
        }
        wsClient.send(JSON.stringify(data));
      }
    })
  });
  console.log('Game created');
  deleteRoomFromBase(room);
}

const addShipsToGameBoard = (chunkData: IData) => {  
  const shipsData = JSON.parse(chunkData.data) as IAddShips;
  addShipsToBase(shipsData);
}

const startGame = (shipsData: IPlayersWithShips[]) => {
  console.log('Start game');
  shipsData.forEach((shipData) => {
    wsServer.clients.forEach((wsClient) => {
      if ((wsClient as WebSocketWithId).id === shipData.indexPlayer) {
        const playerWithShips: IPlayersWithShips = {    
          indexPlayer: shipData.indexPlayer,
          ships: shipData.ships
        };
        const data: IData = {
          type: Datatype.START_GAME,
          data: JSON.stringify(playerWithShips),
          id: 0,
        }
        wsClient.send(JSON.stringify(data));
      }
    })
  })  
};

export { createGame, addShipsToGameBoard, startGame };