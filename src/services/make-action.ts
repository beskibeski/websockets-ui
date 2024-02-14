import { WebSocket } from "ws";
import { checkPassword, checkPlayer } from "../database/players";
import IData from "../models/data";
import IPlayer from "../models/player";
import { login, loginWithWrongPassword, registrateNewPlayer } from "./login-registrate";

export const enum Datatype {
  LOGIN = 'reg',
}

const makeActionDependingOndataType = (chunk: Buffer, wsClient: WebSocket): void => {
  const chunkData = JSON.parse(chunk.toString()) as IData;  
  switch (getDataType(chunkData)) {
    case Datatype.LOGIN:
      const playerData = JSON.parse(chunkData.data) as IPlayer;
      if (checkPlayer(playerData)) {
        if (checkPassword(playerData)) {
          login(wsClient, playerData);
          console.log('Login successful');
        } else if (!checkPassword(playerData)){
          loginWithWrongPassword(wsClient, playerData);
          console.log('Wrong password');
        }
      } else {
        registrateNewPlayer(wsClient, playerData);
      };
    break;
    default:
    break;
  }
}

const getDataType = (chunkData: IData): string => chunkData.type;

export default makeActionDependingOndataType;