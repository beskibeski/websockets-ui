import { WebSocket } from "ws";
import IData from "../models/data";
import Datatype from "../models/types";
import { getWinners } from "../database/winners";

const updateWinners = (wsClient: WebSocket) => {
  const data: IData = {
    type: Datatype.UPDATE_WINNERS,
    data: JSON.stringify(getWinners()),
    id: 0,    
  }
  wsClient.send(JSON.stringify(data));
}

export default updateWinners;