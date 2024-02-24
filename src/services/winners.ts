import IData from '../models/data';
import Datatype from '../models/types';
import { getWinners } from '../database/winners';
import { wsServer } from '../ws_server';

const updateWinners = () => {
  console.log('Winners updated');
  wsServer.clients.forEach((wsClient) => {
    const data: IData = {
      type: Datatype.UPDATE_WINNERS,
      data: JSON.stringify(getWinners()),
      id: 0,    
    }
    wsClient.send(JSON.stringify(data));  
  }) ; 
}

export default updateWinners;