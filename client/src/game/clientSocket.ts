import { createIdGenerator } from "./createIdGenerator";
import { IServerRequestMessage, IServerResponseMessage } from "./dto";
import Signal from '../../../common/signal';
export class ClientSocket{
  onMessage: Signal<IServerResponseMessage> = new Signal();
  private _websocket: WebSocket;
  nextId: () => string;

  constructor(url: string) {
    this._websocket = new WebSocket(url);
    this.nextId = createIdGenerator('socketRequest');
    this._websocket.onmessage = (message) => {
      this.onMessage.emit(JSON.parse(message.data));      
    }
  }

  sendMessage(type: string, data: string) {   
    const requestMessage = {
      type: type,
      content: data,
      requestId: this.nextId()
    }
    const result = new Promise<string>((resolve)=>{
      const privateMessageHandler = (message:IServerResponseMessage)=>{
        
        if (message.requestId == requestMessage.requestId &&'privateResponse' == message.type){
          this.onMessage.remove(privateMessageHandler);console.log('private checker', message);
          resolve(message.content);
        }
      }
      this.onMessage.add(privateMessageHandler);
    })
    this._websocket.send(JSON.stringify(requestMessage));
    return result;
  }
}