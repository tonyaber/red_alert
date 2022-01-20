import {IUtf8Message, request} from "websocket";
import {Server} from "http";
import {IConnection, IServerRequestMessage, IServerResponseMessage} from "./serverInterfaces";
import { GameModelServer } from "./gameModelServer";

const websocket = require('websocket')

export class ServerSocket {

  public connections: Array<IConnection> = []
  private name: string;
  private users: IConnection[]=[];

  constructor(server: Server) {
    this.connections = []
    this.name = null
    const wsServer = new websocket.server({
      httpServer: server,
    });
    const gameModel = new GameModelServer();
    
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
                 // connect.connection.sendUTF(JSON.stringify({type: 'sendName', content: response}))
                }
                else {
                  this.users.push(connect);
                  //const names = this.connections.map(c => c.name).filter(el => el !== this.name)
                  connect.connection.sendUTF(JSON.stringify({ type: 'sendName', content: JSON.stringify(this.name) }));
                }
              })
              if (this.users.length >= 2) {
                gameModel.startGame(this.users);
                this.connections.forEach(connect => {
                  connect.connection.sendUTF(JSON.stringify({ type: 'startGame', content: JSON.stringify(gameModel.setAllPlayer()) }));
                })
              }
            }
            if (requestMessage.type === 'sendNewBuild') {
              const ourConnect = this.connections.find(item => item.connection === connection);
              const result = gameModel.addNewBuild(JSON.parse(requestMessage.content), ourConnect.name);
              
              this.connections.forEach(connect => {
                connect.connection.sendUTF(JSON.stringify({type: 'addNewBuild', content: JSON.stringify(result)}))
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

