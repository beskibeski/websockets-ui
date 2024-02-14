import { WebSocket, WebSocketServer } from "ws";
import makeActionDependingOndataType from "../services/make-action";

const WSS_PORT = Number(process.env.WSS_PORT);

export default {
  start() {
    const wsserver = new WebSocketServer({ port: WSS_PORT });  
        
    const onConnect = (wsClient: WebSocket, req: Request) => {      
      console.log(`Websocket is started on ${Object.values(req.headers)[0]} with security key ${Object.values(req.headers)[10]}` );

      wsClient.on('message', (chunk: Buffer) => {   
        makeActionDependingOndataType(chunk, wsClient);
      })

      wsClient.on('close', () => {
        console.log('Websocket is disconnected');
      });
      
    }
    
    wsserver.on('connection', onConnect);    
  }
};
