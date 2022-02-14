import { Server } from "http";
import { connection, IUtf8Message, request } from "websocket";
import { IConnection, IServerRequestMessage, IServerResponseMessage } from "./dto";
import { GameServer } from "./gameServer";
import { BatchConnection } from './batchConnection';

const websocket = require("websocket");

interface IUser {
  name: string;
}

const TIMEOUT = 10000;
const PINGPERIOD = 5000;
class Session {
  private id:string;
  private _connection: IConnection;
  private _user: IUser | null;
  private _online:boolean = false;
  private ttl:number;
  private tm:NodeJS.Timeout | null;

  constructor(msg: IServerRequestMessage, connection:IConnection) {
    this.id = msg.sessionID;
    this._connection = connection || null;
    this._user = null;
    this.tm = null;
    this.touch();
    try {
      const content = JSON.parse(msg.content);
      this._user = content.user || null;
    } catch (e) {}
    const ping = () =>{
      if(!this._online) return;
      const now = new Date().getTime();
      // console.log('ping ', now - this.ttl, this.id)
      this.tm = setTimeout(()=>{
        this._online = false;
        console.log('TODO disconnect');
      },TIMEOUT)
      const response: IServerResponseMessage = {
        sessionID: this.id,
        type: "ping",
        content: JSON.stringify({}),
        requestId: "socket-ping",
      };
      connection.sendUTF(JSON.stringify(response));      
    }
    setInterval(()=>ping(),PINGPERIOD)  
  }
  get connection() { return this._connection; }
  set connection(c) { 
    this._connection = c;
    this.touch();
  }
  get user(){return this._user;}
  touch(){ 
    this.ttl = new Date().getTime();
    this._online = true;
    clearTimeout(this.tm);
  }
  sendUTF(r:string ):void {
    return this.connection.sendUTF(r);
  }
}

export class ServerSocket {
  connections: Map<string, Session> = new Map();
  // connections: Map<connection, string> = new Map();
  //users:  Record<string, /*connection*/any> = {}

  games: any[] = [];

  constructor(server: Server) {
    const wsServer = new websocket.server({
      httpServer: server,
    });
    const game = new GameServer();
    wsServer.on("request", (request: request) => {
      const _connection = request.accept(undefined, request.origin);
      const connection = new BatchConnection(_connection);
      console.log("ddd^^^");
      // console.log(connection)
      _connection.on("message", (_message) => {
        if (_message.type === "utf8") {
          const message = _message as IUtf8Message;
          const msg: IServerRequestMessage = JSON.parse(message.utf8Data);
          // console.log(msg.type, msg.sessionID);
          if(this.connections.has(msg.sessionID)){ 
            const conn = this.connections.get(msg.sessionID)
            this.connections.get(msg.sessionID).touch();
          }
          if (msg.type === "auth") {
            //id
            // this.connections.set(connection, msg.content);
            // console.log(msg);
            if(!this.connections.has(msg.sessionID))
              this.connections.set(msg.sessionID, new Session(msg, connection));
            connection.sendUTF(
              JSON.stringify({ type: "auth", content: msg.content })
            );
            const response: IServerResponseMessage = {
              sessionID: msg.sessionID,
              type: "chatMsg",
              content: JSON.stringify({
                user: "system",
                msg: "You are Welcom",
              }),
              requestId: "111111111",
            };
            connection.sendUTF(JSON.stringify(response));
          } 
          if (msg.type === 'createMap') { 
            
            game.createGame(JSON.parse(msg.content));

            const response: IServerResponseMessage = {
              sessionID: msg.sessionID,
              type: "privateResponse",
              content: JSON.stringify('ok'),
              requestId: msg.requestId,
            };
            connection.sendUTF(JSON.stringify(response));
          }
          if (msg.type === "gameMove") {
            // const playerId = this.connections.get(connection);
            const playerId = msg.sessionID;
            // const gameId = 1 //msg.gameId;
            //find game by id
            const result = game.handleMessage(msg, playerId);
            console.log("server gameMove", result);
            const response: IServerResponseMessage = {
              sessionID: msg.sessionID,
              type: "privateResponse",
              content: JSON.stringify(result),
              requestId: msg.requestId,
            };
            connection.sendUTF(JSON.stringify(response));
          }
          if (msg.type === "registerGamePlayer") {
            // const playerId = this.connections.get(connection);
            const playerId = msg.sessionID;
            //const gameId = 1//msg.gameId;
            //find game by id

            const content = JSON.parse(msg.content);
            game.registerPlayer(content.playerType, playerId, this.connections.get(playerId));
          }
          if (msg.type === "chatSend") {
            const content = JSON.parse(msg.content);
            console.log("chatSend>>>", content);
            this.connections.forEach((value, key) => {
              const response: IServerResponseMessage = {
                sessionID: key,
                type: "chatMsg",
                content: msg.content,
                requestId: msg.requestId,
              };
              this.response(response);
            });
          }
          if (msg.type === "getUsersList") {
            // const usersList = this.connections.keys().map((value, key) => {})
            const usersList = Array.from(this.connections.entries()).map(
              (x) => {
                const user = { name: x[1].user.name, id: x[0] };
                return user;
              }
            );
            this.connections.forEach((value, key) => {
              const response: IServerResponseMessage = {
                sessionID: key,
                type: "usersList",
                content: JSON.stringify(usersList),
                requestId: msg.requestId,
              };
              this.response(response);
            });
          }
        }
      });
    });
  }
  response(response: IServerResponseMessage) {
    this.connections.get(response.sessionID).sendUTF(JSON.stringify(response));
  }
}

export { Session };
