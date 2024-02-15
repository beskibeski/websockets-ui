import IPlayer from '../models/player';
import IData from '../models/data';
import IPlayerResponse from '../models/player-response';
import WebSocket from 'ws';
import crypto from 'crypto';
import { getPlayerIndex, addPlayer } from '../database/players';
import Datatype from '../models/types';
import { updateRoom } from './rooms';
import updateWinners from './winners';

const login = (wsClient: WebSocket, playerData: IPlayer) => {
    const playerDataToSend: IPlayerResponse = {
      name: playerData.name,
      index: getPlayerIndex(playerData),
      error: false,
    };
    const dataToSend: IData = {
      type: Datatype.LOGIN,
      data: JSON.stringify(playerDataToSend),
      id: 0,      
    };
    console.log(`Login for player ${playerData.name} successful`);
    wsClient.send(JSON.stringify(dataToSend));
    updateRoom(wsClient);
    updateWinners(wsClient);
  }
  
  const loginWithWrongPassword = (wsClient: WebSocket, playerData: IPlayer) => {
    const playerDataToSend: IPlayerResponse = {
      name: playerData.name, index: getPlayerIndex(playerData), errorText: 'Wrong login name or password', error: true
    };
    const dataToSend: IData = {
      type: Datatype.LOGIN,
      data: JSON.stringify(playerDataToSend),
      id: 0,      
    };
    console.log('Wrong credentials');
    wsClient.send(JSON.stringify(dataToSend));
  }
  
  const registrateNewPlayer = (wsClient: WebSocket, playerData: IPlayer) => {
    playerData.index = crypto.randomUUID();
    addPlayer(playerData);
    console.log(`Registration of player ${playerData.name} is successful`);
    login(wsClient, playerData);
  }

  export { login, loginWithWrongPassword, registrateNewPlayer };