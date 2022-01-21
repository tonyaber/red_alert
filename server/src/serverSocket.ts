import { connection, IUtf8Message, request } from "websocket";
import { Server } from "http";
import { IConnection, IServerRequestMessage, IServerResponseMessage } from "./serverInterfaces";
import { timeStamp } from "console";
import { json } from "stream/consumers";

const websocket = require('websocket')

function isUtf8(message): message is IUtf8Message {
  return (message.type === 'utf8')
}

class SocketUser {
  connection: connection;
  onSendName: (name: string) => void;
  constructor(connection: connection) {
    this.connection = connection;
    connection.on('message', data => {
      if (isUtf8(data)) {
        const message = data;
        const requestMessage: IServerRequestMessage = JSON.parse(message.utf8Data);
        if (requestMessage.type === 'sendName') {
          this.onSendName?.(requestMessage.content)
        }
      }
    })
  }
}

class GameUser {
  connection: connection;
  onSendNewBuild: (buildData: any) => void;
  onSendUpdateObject: (buildData: any) => void;
  constructor(connection: connection) {
    this.connection = connection;
    connection.on('message', data => {
      if (isUtf8(data)) {
        const message = data;
        const requestMessage: IServerRequestMessage = JSON.parse(message.utf8Data);
        if (requestMessage.type === 'sendNewBuild') {
          const buildData: any = JSON.parse(requestMessage.content);  //указать тип
          this.onSendNewBuild(buildData);
          // this.connections.forEach(connect => {
          //   connect.connection.sendUTF(JSON.stringify({ type: 'addNewBuild', content: JSON.stringify(requestMessage.content) }))
          // })
        }
        if (requestMessage.type === 'sendUpdateObject') {
          const buildData: any = JSON.parse(requestMessage.content);  //указать тип
          this.onSendUpdateObject(buildData);
          // this.connections.forEach(connect => {
          //   connect.connection.sendUTF(JSON.stringify({ type: 'getUpdateObject', content: JSON.stringify(requestMessage.content) }))
          // })
        }
      }
    })

  }
}


export class ServerSocket {

  public connections: Array<IConnection> = []
  //private name: string;
  users: Array<SocketUser> = [];

  constructor(server: Server) {
    this.connections = []
    //this.name = null;
    this.users = [];
    const wsServer = new websocket.server({
      httpServer: server,
    });

    wsServer.on('request', (request: request) => {
      console.log("^^^")
      const connection = request.accept(undefined, request.origin);
      const user = new SocketUser(connection);
      user.onSendName = (name) => {
        this.connections.forEach(connect => {
          if (connect.name !== name) {
            connect.connection.sendUTF(JSON.stringify({ type: 'sendName', content: name }))
          }
          else {
            const names = this.connections.map(c => c.name).filter(el => el !== name)
            connect.connection.sendUTF(JSON.stringify({ type: 'sendName', content: names }))
          }
        })
      }
      this.users.push(user);
      const player = new GameUser(connection);
      player.onSendNewBuild = (buildData) => {
        this.connections.forEach(connect => {
          connect.connection.sendUTF(JSON.stringify({ type: 'addNewBuild', content: JSON.stringify(buildData) }))
        })
      }
      player.onSendUpdateObject = (buildData) => {
        this.connections.forEach(connect => {
          connect.connection.sendUTF(JSON.stringify({ type: 'getUpdateObject', content: JSON.stringify(buildData) }))
        })
      }
      connection.on('message', (_message) => {
        if (isUtf8(_message)) {
          const message = _message;
          const requestMessage: IServerRequestMessage = JSON.parse(
            message.utf8Data
          );
          // if (requestMessage.type === 'message') {
          //   const responseStatus: IServerResponseMessage = {
          //     type: 'message-status',
          //     content: 'ok'
          //   }
          // const responseMessage: IServerResponseMessage = {
          //   type: 'message',
          //   content: message.utf8Data
          // }
          // connection.sendUTF(JSON.stringify(responseStatus))
          // this.connections.forEach(connect => {
          //   connect.connection.sendUTF(message.utf8Data)
          // })
          //}

          // if (requestMessage.type === 'sendNewBuild') {
          //   this.connections.forEach(connect => {
          //     connect.connection.sendUTF(JSON.stringify({ type: 'addNewBuild', content: requestMessage.content }))
          //   })
          // }
          // if (requestMessage.type === 'sendUpdateObject') {
          //   this.connections.forEach(connect => {
          //     connect.connection.sendUTF(JSON.stringify({ type: 'getUpdateObject', content: JSON.stringify(requestMessage.content) }))
          //   })
          // }
        }
        else {
          throw new Error('Not UTF8')
        }
      })
      connection.on('close', (reasonCode, description) => {
        // this.connections = this.connections.filter(client => client.connection !== connection)
        console.log("Disconnect")
      })
    }
    )
  }
}

