import crypto from 'crypto';
import IGame from '../models/game';
import IData from '../models/data';
import Datatype from '../models/types';
import WebSocketWithId from '../models/websocket';
import { wsServer } from '../ws_server';
import IRoom from '../models/room';
import { deleteRoomFromBase, getCurrentRoomFromBase, getRoomsFromBase } from '../database/rooms';
import IAddShips from '../models/ships';
import {
  addShipsToBase,
  checkIfHitInBase,
  checkIfThereArePointWithShips,
  destroyShipArray,
  getPlayerIdsForGame,
  getPlayerTurn,
  missedShipArray,  
} from '../database/game';
import { IGamePlayersShips, IPlayersWithShips, IPoint } from '../models/game-players-ships';
import IRandomAttack from '../models/random-attack';
import IAttack from '../models/attack';
import { IAttackFeedback, IStatus } from '../models/attack-feedback';
import { addWinToWinner } from '../database/winners';
import { getPlayerNameById } from '../database/players';
import { updateRoom } from './rooms';
import updateWinners from './winners';

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
  deleteRoomFromBase(room);
  console.log('Game created');
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
  makeNextTurnForPlayers(gameId);
};

const makeNextTurnForPlayers = (gameId: string) => {
  console.log('Next turn')
  const playerToMakeNextTurn = getPlayerTurn(gameId);  
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

const makeAttack = (chunkData: IData) => {  
  const attack = JSON.parse(chunkData.data) as IAttack;
  const hit = checkIfHitInBase(attack);
  if (!hit) {
    makeNextTurnForPlayers(attack.gameId);
  }
}

const makeHit = (point: IPoint, game: IGamePlayersShips, indexPlayer: string, hitStatus: IStatus, playerField: IPoint[][] = []) => {
  console.log('Attack!!!');  
  const ids = getPlayerIdsForGame(game.gameId);
  ids.forEach((id) => {
    wsServer.clients.forEach((wsClient) => {
      if ((wsClient as WebSocketWithId).id === id) {
        const attackFeedback: IAttackFeedback = {
          position: {
            x: point.x,
            y: point.y,
          },
          currentPlayer: indexPlayer,
          status: hitStatus,
        };
        const data: IData = {
          type: Datatype.ATTACK,
          data: JSON.stringify(attackFeedback),
          id: 0,
        }
        wsClient.send(JSON.stringify(data));
        if (hitStatus === 'killed') {
          destroyShipArray(attackFeedback, playerField).forEach((destroyedPosition) => {
            const attackFeedback: IAttackFeedback = {
              position: {
                x: destroyedPosition.x,
                y: destroyedPosition.y,
              },
              currentPlayer: indexPlayer,
              status: hitStatus,
            };
            const data: IData = {
              type: Datatype.ATTACK,
              data: JSON.stringify(attackFeedback),
              id: 0,
            }
            wsClient.send(JSON.stringify(data));          
          missedShipArray(attackFeedback, playerField).forEach((missedPosition) => {
            if (missedPosition.x !== - 1) {
              const attackFeedback: IAttackFeedback = {
                position: {
                  x: missedPosition.x,
                  y: missedPosition.y,
                },
                currentPlayer: indexPlayer,
                status: 'miss',
              };
              const data: IData = {
                type: Datatype.ATTACK,
                data: JSON.stringify(attackFeedback),
                id: 0,
              }
              wsClient.send(JSON.stringify(data));
            }
          });
          });
          const isWin = checkIfThereArePointWithShips(playerField);
          if (isWin) {
            makeWin(indexPlayer, wsClient as WebSocketWithId);            
          };          
        } 
      }
    });      
  })
}

const makeWin = (playerId: string, wsClient: WebSocketWithId) => {  
  const data: IData = {
    type: Datatype.FINISH,
    data: JSON.stringify({ winPlayer: playerId}),
    id: 0,
  }
  wsClient.send(JSON.stringify(data));  
  if (wsClient.id === playerId) {
    addWinToWinner(getPlayerNameById(playerId));
    console.log('Game finished'); 
    updateRoom();
    updateWinners();
  };  
}

export { createGame, addShipsToGameBoard, startGame, makeRandomAttack, makeAttack, makeHit };