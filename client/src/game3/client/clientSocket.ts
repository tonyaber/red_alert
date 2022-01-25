import { createIdGenerator } from "./createIdGenerator";
import { IServerRequestMessage } from "./dto";

export class ClientSocket{
  onMessage: (mess: IServerRequestMessage) => void;
  private _websocket: WebSocket;
  nextId: () => string;
  constructor(url: string) {
    this._websocket = new WebSocket(url);
    this.nextId = createIdGenerator('socketRequest');
    this._websocket.onmessage = (message) => {
      this.onMessage(JSON.parse(message.data))
      
    }
  }

  sendMessage(type: string, data: string){
  
    return new Promise(() => {
      this.sendRequest(type, data)
    });
  }

  sendRequest(type: string, data: string) {
   
    const requestMessage = {
      type: type,
      content: data,
      requestId: this.nextId()
    }
    this._websocket.send(JSON.stringify(requestMessage))
  }
}