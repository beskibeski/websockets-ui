import { WebSocket } from 'ws';
import { checkPassword, checkPlayer } from '../database/players';
import IData from '../models/data';
import IPlayer from '../models/player';
import { login, loginWithWrongPassword, registrateNewPlayer } from './login-registrate';
import Datatype from '../models/types';


const makeActionDependingOndataType = (chunk: Buffer, wsClient: WebSocket): void => {  
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
      console.log(chunkData.type);
    break ;
    case Datatype.PLAY_WITH_BOT:
      console.log(chunkData.type);
    default:      
    break;
  }
}

const getDataType = (chunkData: IData): string => chunkData.type;

export default makeActionDependingOndataType;