import { checkPassword, checkPlayer } from '../database/players';
import IData from '../models/data';
import IPlayer from '../models/player';
import { login, loginWithWrongPassword, registrateNewPlayer } from './login-registrate';
import Datatype from '../models/types';
import { addToRoom, createRoom } from './rooms';
import WebSocketWithId from '../models/websocket';
import { addShipsToGameBoard, makeAttack, makeRandomAttack } from './game';

const makeActionDependingOndataType = (chunk: Buffer, wsClient: WebSocketWithId): void => {  
  const chunkData = JSON.parse(chunk.toString()) as IData;
  switch (getDataType(chunkData)) {
    case Datatype.LOGIN:
      const playerData = JSON.parse(chunkData.data) as IPlayer;
      if (checkPlayer(playerData) && checkPassword(playerData)) {        
        login(wsClient, playerData);          
      } else if (!checkPlayer(playerData)){
        registrateNewPlayer(wsClient, playerData);
      } else {        
        loginWithWrongPassword(wsClient, playerData);  
      };      
    break;
    case Datatype.CREATE_NEW_ROOM:
      createRoom(wsClient);
    break;
    case Datatype.ADD_USER_TO_ROOM:
      addToRoom(wsClient, chunkData);      
    break;
    case Datatype.ADD_SHIPS:
      addShipsToGameBoard(chunkData);
    break;
    case Datatype.ATTACK:
      makeAttack(chunkData);
    break;
    case Datatype.RANDOM_ATTACK:      
      makeRandomAttack(chunkData);
    break;
    case Datatype.PLAY_WITH_BOT:
      console.log(chunkData.type);
    break;
    default:    
    break;
  }
}

const getDataType = (chunkData: IData): string => chunkData.type;

export default makeActionDependingOndataType;