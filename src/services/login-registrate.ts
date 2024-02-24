import IPlayer from '../models/player';
import IData from '../models/data';
import IPlayerResponse from '../models/player-response';
import { addPlayer, getPlayerNameById, setCurrentPlayer} from '../database/players';
import Datatype from '../models/types';
import { updateRoom } from './rooms';
import updateWinners from './winners';
import WebSocketWithId from '../models/websocket';
import { addWinner } from '../database/winners';

const login = (wsClient: WebSocketWithId, playerData: IPlayer) => {
    const playerDataToSend: IPlayerResponse = {
      name: playerData.name,
      index: wsClient.id,
      error: false,
    };
    const dataToSend: IData = {
      type: Datatype.LOGIN,
      data: JSON.stringify(playerDataToSend),
      id: 0,      
    };
    console.log(`Login for player ${playerData.name} successful`);
    wsClient.send(JSON.stringify(dataToSend));    
    updateRoom();
    updateWinners();  
    setCurrentPlayer(playerData);      
  }
  
  const loginWithWrongPassword = (wsClient: WebSocketWithId, playerData: IPlayer) => {
    const playerDataToSend: IPlayerResponse = {
      name: playerData.name, index: wsClient.id, errorText: 'Wrong login name or password', error: true
    };
    const dataToSend: IData = {
      type: Datatype.LOGIN,
      data: JSON.stringify(playerDataToSend),
      id: 0,      
    };
    console.log('Wrong credentials');
    wsClient.send(JSON.stringify(dataToSend));
  }
  
  const registrateNewPlayer = (wsClient: WebSocketWithId, playerData: IPlayer) => {
    playerData.index = wsClient.id;
    addPlayer(playerData);
    addWinner(playerData.name);
    console.log(`Registration of player ${playerData.name} is successful`);
    login(wsClient, playerData);
  }

  export { login, loginWithWrongPassword, registrateNewPlayer };