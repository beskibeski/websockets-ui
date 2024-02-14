import IPlayer from "../models/player";
import IData from "../models/data";
import IPlayerResponse from "../models/player-response";
import WebSocket from "ws";
import { getPlayerIndex, addPlayer } from "../database/players";
import { Datatype } from "./make-action";

const login = (wsClient: WebSocket, playerData: IPlayer) => {
    const playerDataToSend: IPlayerResponse = {
      name: playerData.name, index: getPlayerIndex(playerData), error: false
    };
    const dataToSend: IData = {
      type: Datatype.LOGIN,
      id: 0,
      data: JSON.stringify(playerDataToSend)
    };
    wsClient.send(JSON.stringify(dataToSend));    
  }
  
  const loginWithWrongPassword = (wsClient: WebSocket, playerData: IPlayer) => {
    const playerDataToSend: IPlayerResponse = {
      name: playerData.name, index: getPlayerIndex(playerData), errorText: 'Wrong login name or password', error: true
    };
    const dataToSend: IData = {
      type: Datatype.LOGIN,
      id: 0,
      data: JSON.stringify(playerDataToSend)
    };    
    wsClient.send(JSON.stringify(dataToSend));
  }
  
  const registrateNewPlayer = (wsClient: WebSocket, playerData: IPlayer) => {
    const playerDataToSend: IPlayerResponse = {
      name: playerData.name, index: getPlayerIndex(playerData), errorText: 'The new user is registrated, please submit with the same credentials', error: true
    };
    const dataToSend: IData = {
      type: Datatype.LOGIN,
      id: 0,
      data: JSON.stringify(playerDataToSend)
    };
    addPlayer(playerData);
    wsClient.send(JSON.stringify(dataToSend));
  }

  export { login, loginWithWrongPassword, registrateNewPlayer };