import {IServerResponseMessage} from "./socketInterface";
import Signal from "./signal";
import { createIdGenerator } from "../game/idGenerator";
//'ws://localhost:3000/'
export class SocketClient {
  private _websocket: WebSocket;
  onMessage: Signal<IServerResponseMessage> = new Signal();
  onOpen: Signal<void> = new Signal();
  onError: Signal<void> = new Signal();
  onClose:  Signal<void> = new Signal();
  nextId: () => string;

  constructor(url: string) {
    this.nextId = createIdGenerator('socketRequest');
    this._websocket = new WebSocket(url);
    this._websocket.onopen = () => {
      this.onOpen.emit();
    }
    this._websocket.onmessage = (message) => {
      console.log(message.data);
      const response: IServerResponseMessage = JSON.parse(message.data)
      this.onMessage.emit(response);
    }
    this._websocket.onerror = () => {
      this.onError.emit();
    }
    this._websocket.onclose = () => {
      this.onClose.emit();
    }
  }
  sendRequest(type: string, data: string) {
    const requestMessage = {
      type: type,
      content: data,
      requestId: this.nextId()
    }
    const result = new Promise<IServerResponseMessage>((resolve)=>{
      const privateMessageHandler = (message:IServerResponseMessage)=>{
        console.log('private checker', message);
        if (message.requestId == requestMessage.requestId && type+'Private' == message.type){
          this.onMessage.remove(privateMessageHandler);
          resolve(message);
        }
      }
      this.onMessage.add(privateMessageHandler);
    })
    
    this._websocket.send(JSON.stringify(requestMessage));
    return result;
  }
}