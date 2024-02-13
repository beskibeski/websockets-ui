import { WebSocketServer } from "ws";

export default class Websocket {
  public start = () => {
    const wsserver = new WebSocketServer({  });
        
    wsserver.on('connection', (websocket) => {
      console.log('Start websocket connection!', websocket);
    });
  }
};
