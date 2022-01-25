import { Server } from "http";
import { connection, IUtf8Message, request } from "websocket";
import { IServerRequestMessage } from './dto';
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
          const msg: IServerRequestMessage = JSON.parse(
            message.utf8Data
          );

            if (msg.type === 'auth') {
              
              //id
              this.connections.set(connection, msg.content);
              connection.sendUTF(JSON.stringify({ type: 'auth', content: msg.content }))
            }

            if (msg.type === 'gameMove') {
              const playerId = this.connections.get(connection);
             // const gameId = 1 //msg.gameId;
              //find game by id
              game.handleMessage(msg, playerId);
            }
            if (msg.type === 'registerGamePlayer') {
              const playerId = this.connections.get(connection);
              //const gameId = 1//msg.gameId;
              //find game by id
              game.registerPlayer('human', playerId, connection)
            }
            // if (requestMessage.type === 'senName') {
            //   this.connections.connection = requestMessage.content;
            //   game.registerPlayer('human', connection, requestMessage.content);
            // }
            // if (requestMessage.type === 'startBuild') {
            //   game.startBuilding(JSON.parse(requestMessage.content));
            // }

        
        }

      })
    })
  }  
    
    
    
    
    
    
    
    
}