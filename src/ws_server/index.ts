import { WebSocketServer } from 'ws';
import makeActionDependingOndataType from '../services/make-action';
import WebSocketWithId from '../models/websocket';
import crypto from 'crypto';

const WSS_PORT = Number(process.env.WSS_PORT);
export let wsServer: WebSocketServer;

export default {
  start() {
    const wsserver = new WebSocketServer({ port: WSS_PORT });  
    wsServer = wsserver;   
    const onConnect = (wsClient: WebSocketWithId, req: Request) => {      
      console.log(`Websocket is started on ${Object.values(req.headers)[0]} with security key ${Object.values(req.headers)[10]}` );
            
      wsClient.id = crypto.randomUUID();
      
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
