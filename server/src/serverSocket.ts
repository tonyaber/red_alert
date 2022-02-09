import { Server } from "http";
import { connection, IUtf8Message, request } from "websocket";
import { IServerRequestMessage, IServerResponseMessage } from './dto';
import { GameServer } from "./gameServer";

const websocket = require('websocket')

export class ServerSocket{
  
  connections: Map<connection, string> = new Map()
  //users:  Record<string, /*connection*/any> = {}

  games: any[] = [];

  constructor(server: Server) {
    const wsServer = new websocket.server({
      httpServer: server,
    });
    const game = new GameServer();
    wsServer.on('request', (request: request) => {
      console.log("^^^")
      const connection = request.accept(undefined, request.origin);
      connection.on('message', (_message) => {
        if (_message.type === 'utf8') {
          const message = _message as IUtf8Message
          const msg: IServerRequestMessage = JSON.parse(message.utf8Data);
            if (msg.type === 'auth') {              
              //id
              this.connections.set(connection, msg.content);
              connection.sendUTF(JSON.stringify({ type: 'auth', content: msg.content }))
            }

            if (msg.type === 'gameMove') {
              const playerId = this.connections.get(connection);
             // const gameId = 1 //msg.gameId;
              //find game by id
              const result = game.handleMessage(msg, playerId);
              console.log("server gameMove",result)
              const response: IServerResponseMessage = {
                type: 'privateResponse',
                content: JSON.stringify(result),
                requestId: msg.requestId,
              }
              connection.sendUTF(JSON.stringify(response));
            }
            if (msg.type === 'registerGamePlayer') {
              const playerId = this.connections.get(connection);
              //const gameId = 1//msg.gameId;
              //find game by id
              const content = JSON.parse(msg.content);
              game.registerPlayer(content.playerType, playerId, connection)
            }        
        }
      })
    })
  }  
    
    
    
    
    
    
    
    
}