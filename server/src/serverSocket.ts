import { Server } from "http";
import { connection, IUtf8Message, request } from "websocket";
import { IServerRequestMessage, IServerResponseMessage } from "./dto";
import { GameServer } from "./gameServer";

const websocket = require("websocket");

interface IUser {
  name: string;
}

class Session {
  _connection: connection;
  user: IUser | null;
  constructor(msg: IServerRequestMessage, connection) {
    this._connection = connection || null;
    this.user = null;
    try {
      const content = JSON.parse(msg.content);
      this.user = content.user || null;
    } catch (e) {}
  }
  get connection() {
    return this._connection;
  }
  sendUTF(r) {
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
      const connection = request.accept(undefined, request.origin);
      console.log("ddd^^^");
      // console.log(connection)
      connection.on("message", (_message) => {
        if (_message.type === "utf8") {
          const message = _message as IUtf8Message;
          const msg: IServerRequestMessage = JSON.parse(message.utf8Data);
          console.log(msg.type, msg.sessionID);
          if (msg.type === "auth") {
            //id
            // this.connections.set(connection, msg.content);
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
            game.registerPlayer(content.playerType, playerId, connection);
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
        }
      });
    });
  }
  response(response: IServerResponseMessage) {
    this.connections.get(response.sessionID).sendUTF(JSON.stringify(response));
  }
}
