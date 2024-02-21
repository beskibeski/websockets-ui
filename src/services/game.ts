import crypto from 'crypto';
import IGame from '../models/game';
import IData from '../models/data';
import Datatype from '../models/types';
import WebSocketWithId from '../models/websocket';
import { wsServer } from '../ws_server';
import IRoom from '../models/room';
import { deleteRoomFromBase, getCurrentRoomFromBase } from '../database/rooms';
import IAddShips from '../models/ships';
import { addShipsToBase, addShipsToField, getPlayerIdsForGame, getPlayerTurn, getPlayerTurnForStart } from '../database/game';
import { IPlayersWithShips } from '../models/game-players-ships';
import IRandomAttack from '../models/random-attack';

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

const startGame = (shipsData: IPlayersWithShips[], gameId: string) => {  
  console.log('Start game');  
  shipsData.forEach((shipData) => {
    wsServer.clients.forEach((wsClient) => {
      if ((wsClient as WebSocketWithId).id === shipData.indexPlayer) {
        const playerWithShips: IPlayersWithShips = shipData;
        const data: IData = {
          type: Datatype.START_GAME,
          data: JSON.stringify(playerWithShips),
          id: 0,
        }
        wsClient.send(JSON.stringify(data));
      }
    })
  })
  makeNextTurnForPlayers(gameId, true);
};

const makeNextTurnForPlayers = (gameId: string, start = false) => {
  let playerToMakeNextTurn = '';
  if (start) {
    playerToMakeNextTurn = getPlayerTurnForStart(gameId);
  } else {
    playerToMakeNextTurn = getPlayerTurn(gameId);
  };
  const ids = getPlayerIdsForGame(gameId);
  ids.forEach((id) => {
    wsServer.clients.forEach((wsClient) => {
      if ((wsClient as WebSocketWithId).id === id) {
        const data: IData = {
          type: Datatype.TURN,
          data: JSON.stringify({ currentPlayer: playerToMakeNextTurn }),
          id: 0,
        }
        wsClient.send(JSON.stringify(data));
      }    
    })
  });  
}

const makeRandomAttack = (chunkData: IData) => {
  const randomAttack = JSON.parse(chunkData.data) as IRandomAttack;
}

export { createGame, addShipsToGameBoard, startGame, makeRandomAttack };