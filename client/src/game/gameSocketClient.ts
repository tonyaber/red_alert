import { SocketClient } from "../common/SocketClient1";
import { IServerResponseMessage } from "../common/socketInterface";
import { Vector } from "../common/vector";
import { IObject } from "./dto";

export class GameSocketClient{
  socket: SocketClient;
   private messageHandler: (message: IServerResponseMessage) => void;
  onGetUpdateObject: (data: string)=>void;
  onAddNewBuild: (data: string)=>void;
  constructor(socket: SocketClient) {
    this.socket = socket;
    this.messageHandler = (message:IServerResponseMessage) => {
      if (message.type === 'addNewBuild') {
        this.onAddNewBuild(message.content);
      }
     if (message.type === 'getUpdateObject') {
        this.onGetUpdateObject(message.content);
      }
    }
    socket.onMessage.add(this.messageHandler)
  }
   destroy() {
    this.socket.onMessage.remove(this.messageHandler);
   }
  sendNewBuild(object: IObject, position: Vector) {
    this.socket.sendRequest('sendNewBuild', JSON.stringify({object, position}))
  }

  updateObject(data: string) {
    this.socket.sendRequest('sendUpdateObject', data);
}
}