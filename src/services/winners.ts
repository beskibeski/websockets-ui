import IData from '../models/data';
import Datatype from '../models/types';
import { getWinners } from '../database/winners';
import WebSocketWithId from '../models/websocket';

const updateWinners = (wsClient: WebSocketWithId) => {
  console.log('Winners updated');  
  const data: IData = {
    type: Datatype.UPDATE_WINNERS,
    data: JSON.stringify(getWinners()),
    id: 0,    
  }
  wsClient.send(JSON.stringify(data));  
}

export default updateWinners;