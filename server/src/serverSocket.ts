import {IUtf8Message, request} from "websocket";
import {Server} from "http";
import {IConnection, IServerRequestMessage, IServerResponseMessage} from "./serverInterfaces";
import { connect } from "http2";

const websocket = require('websocket')

export class ServerSocket {

  public connections: Array<IConnection> = []
  private name: string;

  constructor(server: Server) {
    this.connections = []
    this.name = null
    const wsServer = new websocket.server({
      httpServer: server,
    });

    wsServer.on('request', (request: request) => {
        console.log("^^^")
        const connection = request.accept(undefined, request.origin);

        connection.on('message', (_message) => {
          if (_message.type === 'utf8') {
            const message = _message as IUtf8Message
            const requestMessage: IServerRequestMessage = JSON.parse(
              message.utf8Data
            );
            if (requestMessage.type === 'message') {
              const responseStatus: IServerResponseMessage = {
                type: 'message-status',
                content: 'ok'
              }
              const responseMessage: IServerResponseMessage = {
                type: 'message',
                content: message.utf8Data
              }
              connection.sendUTF(JSON.stringify(responseStatus))
              this.connections.forEach(connect => {
                connect.connection.sendUTF(message.utf8Data)
              })
            }
            if (requestMessage.type === 'sendName') {
              this.connections.push({name: requestMessage.content, connection})
              
              const response = requestMessage.content

              this.name = response

              this.connections.forEach(connect => {
                if (connect.name !== this.name) {
                  connect.connection.sendUTF(JSON.stringify({type: 'sendName', content: JSON.stringify(new Array(1).fill(this.name))}))
                }
                else {
                  const names = this.connections.map(c => c.name).filter(el => el !== this.name)
                  connect.connection.sendUTF(JSON.stringify({type: 'sendName', content: JSON.stringify(names)}))
                }
              })
              if (this.connections.length > 3) {
                const names = this.connections.map(c => c.name);
                this.connections.forEach(connect => {
                  connect.connection.sendUTF(JSON.stringify({type: 'allPlayer', content: JSON.stringify({allPlayers: names, ourPlayer: connect.name })}))
               })
              }
            }
            if (requestMessage.type === 'sendNewBuild') {
              this.connections.forEach(connect => {
                connect.connection.sendUTF(JSON.stringify({type: 'addNewBuild', content: JSON.stringify(requestMessage.content)}))
              })
            }
            if (requestMessage.type === 'sendUpdateObject') {
               this.connections.forEach(connect => {
                connect.connection.sendUTF(JSON.stringify({type: 'getUpdateObject', content: JSON.stringify(requestMessage.content)}))
              })
            }
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

