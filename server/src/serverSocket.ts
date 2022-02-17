import { Server } from "http";
import { connection, IUtf8Message, request } from "websocket";
import {
  IConnection,
  IServerRequestMessage,
  IServerResponseMessage,
} from "./dto";
// import { GameServer } from "./gameServer";
import { BatchConnection } from "./batchConnection";
import GamesList from "./gamesList";

const websocket = require("websocket");

interface IUser {
  id: string;
  name: string;
}

const TIMEOUT = 10000;
const PINGPERIOD = 5000;
class Session {
  private id: string;
  private _connection: IConnection;
  private _user: IUser | null;
  private _online: boolean = false;
  private ttl: number;
  private tm: NodeJS.Timeout | null;
  private _game: number;

  constructor(msg: IServerRequestMessage, connection: IConnection) {
    this.id = msg.sessionID;
    this._connection = connection || null;
    this.ttl = new Date().getTime();
    this._user = null;
    this.tm = null;
    this._game = -1;
    this.touch();
    try {
      const content = JSON.parse(msg.content);
      this._user = content.user || null;
    } catch (e) {}
    const ping = () => {
      if (!this._online) return;
      const now = new Date().getTime();
      // console.log('ping ', now - this.ttl, this.id)
      this.tm = setTimeout(() => {
        this._online = false;
        console.log("TODO disconnect");
      }, TIMEOUT);
      const response: IServerResponseMessage = {
        sessionID: this.id,
        type: "ping",
        content: JSON.stringify({}),
        requestId: "socket-ping",
      };
      connection.sendUTF(JSON.stringify(response));
    };
    setInterval(() => ping(), PINGPERIOD);
  }
  get connection() {
    return this._connection;
  }
  set connection(c) {
    this._connection = c;
    this.touch();
  }
  get user() {
    return this._user;
  }
  get game() {
    return this._game;
  }
  set game(g) {
    this._game = g;
  }
  touch() {
    this.ttl = new Date().getTime();
    this._online = true;
    clearTimeout(this.tm);
  }
  sendUTF(r: string): void {
    return this.connection.sendUTF(r);
  }
}

export class ServerSocket {
  connections: Map<string, Session> = new Map();
  // connections: Map<connection, string> = new Map();
  //users:  Record<string, /*connection*/any> = {}

  games: GamesList = new GamesList();

  constructor(server: Server) {
    const wsServer = new websocket.server({
      httpServer: server,
    });

    // const game = new GameServer();
    const game = this.games.createGame({
      credits: 9999,
      mapID: 0,
      speed: 3,
      info: "fake setting",
    }).game;
    // this.games.createGame();
    // this.games.createGame();

    wsServer.on("request", (request: request) => {
      const _connection = request.accept(undefined, request.origin);
      const connection = new BatchConnection(_connection);
      console.log("ddd^^^");
      // console.log(connection)
      _connection.on("message", (_message) => {
        if (_message.type === "utf8") {
          const message = _message as IUtf8Message;
          const msg: IServerRequestMessage = JSON.parse(message.utf8Data);
          console.log(msg.type, "msg.sessionID--", msg.sessionID);
          // if (this.connections.has(msg.sessionID)) {
          //   let game = null;
          //   const conn = this.connections.get(msg.sessionID);
          //   conn.connection = connection;
          //   conn.touch();
          //   const gameID = this.connections.get(msg.sessionID).game;
          //   game = this.games.get( gameID) || null;
          // }
          // console.log(msg.type, "gameID--",game);

          if (msg.type === "auth") {
            if (!this.connections.has(msg.sessionID))
              this.connections.set(msg.sessionID, new Session(msg, connection));
            connection.sendUTF(
              JSON.stringify({ type: "auth", content: msg.content })
            );
            const response: IServerResponseMessage = {
              sessionID: msg.sessionID,
              type: "chatMsg",
              content: JSON.stringify({
                user: "system",
                msg: "You are Welcome",
              }),
              requestId: "111111111",
            };
            connection.sendUTF(JSON.stringify(response));
            this.sendGamesList();
          }
          if (msg.type === "createMap") {
            game.createGame(JSON.parse(msg.content));

            const response: IServerResponseMessage = {
              sessionID: msg.sessionID,
              type: "privateResponse",
              content: JSON.stringify("ok"),
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
            //console.log("server gameMove", result);
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
            game.registerPlayer(
              content.playerType,
              playerId,
              this.connections.get(playerId)
            );
            this.sendGamesList();
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
            this.sendUsersList();
          }
          if (msg.type === "createGame") {
            console.log("createGame", msg);
            try {
              this.games.createGame(JSON.parse(msg.content));
              this.sendGamesList();
            } catch (e) {
              console.log("serverSocket:206:error", e);
            }
          }
        }
      });
    });
  }
  sendUsersList() {
    const usersList = Array.from(this.connections.entries()).map((x) => {
      const user = { name: x[1].user.name, id: x[0] };
      return user;
    });
    this.responseAll("usersList", JSON.stringify(usersList), '"usersList"');
  }
  sendGamesList() {
    this.responseAll(
      "gamesList",
      JSON.stringify(this.games.getList()),
      '"gameList"'
    );
  }

  responseAll(type: string, content: string, requestId: string) {
    this.connections.forEach((value, key) => {
      const response: IServerResponseMessage = {
        sessionID: key,
        type: type,
        content: content,
        requestId: requestId,
      };
      this.connections
        .get(response.sessionID)
        .sendUTF(JSON.stringify(response));
    });
  }
  response(response: IServerResponseMessage) {
    this.connections.get(response.sessionID).sendUTF(JSON.stringify(response));
  }
}

export { Session, IUser };
