import {connection, IUtf8Message, request} from "websocket";
import {Server} from "http";
import {IConnection, IServerRequestMessage, IServerResponseMessage} from "./serverInterfaces";
import { GameModelServer } from "./gameModelServer";
import {TestListModel, TestListSocket} from "./testModel";

const websocket = require('websocket')

export class ServerSocket {

  public connections: Array<connection> = []
  private name: string;
  private users: IConnection[]=[];

  constructor(server: Server) {
    this.connections = []
    this.name = null
    const wsServer = new websocket.server({
      httpServer: server,
    });
    const gameModel = new GameModelServer();

    const listModel = new TestListModel();
    const listSocket = new TestListSocket(listModel, 
      response=>{
        this.connections.forEach(it=>{
          it.sendUTF(JSON.stringify(response));
        })
      }
    );
    listModel.onChange = ()=>{
      //listModel.getList()
    }
    
    wsServer.on('request', (request: request) => {
        console.log("^^^")
        const connection = request.accept(undefined, request.origin);
        this.connections.push(connection);
        connection.on('message', (_message) => {
          if (_message.type === 'utf8') {
            const message = _message as IUtf8Message
            const requestMessage: IServerRequestMessage = JSON.parse(
              message.utf8Data
            );

            listSocket.handleMessage(connection, requestMessage);

            if (requestMessage.type === 'sendName') {
              gameModel.addNewUser({ name: requestMessage.content, connection });
              gameModel.users.find(item => item.connection.connection === connection).sendUTF('sendName', JSON.stringify(requestMessage.content));

              
              if (gameModel.users.length >= 2) {
                gameModel.startGame();
                gameModel.players.forEach(player => {
                  player.user.sendUTF('startGame', JSON.stringify(gameModel.setAllPlayer()));
                })
              }
            }
            /*if (requestMessage.type === 'sendNewBuild') {
              gameModel.addNewBuild(JSON.parse(requestMessage.content), connection);
            }
            if (requestMessage.type === 'sendUpdateObject') {
              gameModel.players.forEach(player => {
                player.user.sendUTF('getUpdateObject', requestMessage.content);
              });
            }*/

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

