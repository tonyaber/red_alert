import {IServerResponseMessage} from "./socketInterface";
import Signal from "./signal";
//'ws://localhost:3000/'
export class SocketClient {
  private _websocket: WebSocket;
  onMessage: Signal<IServerResponseMessage> = new Signal();
  onOpen: Signal<void> = new Signal();
  onError: Signal<void> = new Signal();
  onClose:  Signal<void> = new Signal();
  constructor(url: string) {
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
    }
    this._websocket.send(JSON.stringify(requestMessage))
  }
}