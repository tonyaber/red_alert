import { Server } from "http";
import { connection, IUtf8Message, request } from "websocket";
import { IServerRequestMessage } from './dto';
import { GameServer } from "./gameServer";

const websocket = require('websocket')

export class ServerSocket{
  
  connections: Record<connection, string|null> = {}
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
          const requestMessage: IServerRequestMessage = JSON.parse(
            message.utf8Data
          );
          connection.on('message', (_message) => {
            if (requestMessage.type === 'senName') {
              this.connections.connection = requestMessage.content;
              game.registerPlayer('human', connection, requestMessage.content);
            }
            if (requestMessage.type === 'startBuild') {
              game.startBuilding(JSON.parse(requestMessage.content))
            }

          })
        }

      })
    }
    
    
    
    
    
    
    
    
    const ws:any = {};
    const connection:any = ws.accept();
    connection.onMessage = (msg:any)=>{
      if (msg.type === 'auth'){
        //id
        this.connections[connection] = msg.id;
      }

      if (msg.type === 'gameMove'){
        const playerId = this.connections[connection]
        const gameId = msg.gameId;
        //find game by id
        this.games[gameId].handleMessage(playerId, msg.content);
      }

      // create new room
      // create 0 game
      //

      if (msg.type === 'registerGamePlayer'){
        const playerId = this.connections[connection]
        const gameId = msg.gameId;
        //find game by id
        this.games[gameId].registerPlayer('human', playerId, connection)
      }
    }
  }
}