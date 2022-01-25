import { createIdGenerator } from "./createIdGenerator";

export class ClientSocket{
  private _websocket: WebSocket;
  nextId: () => string;
  constructor(url: string) {
    this._websocket = new WebSocket(url);
    this.nextId = createIdGenerator('socketRequest');
  }

  sendMessage(type: string, data: string){
    ///
    return new Promise(() => {
      this.sendRequest(type, data)
    });
  }

  onMessage(message){
    this.onMessage(message)
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