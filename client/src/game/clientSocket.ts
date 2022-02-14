import { createIdGenerator } from "./createIdGenerator";
import {  IServerResponseMessage } from "./dto";
import Signal from '../../../common/signal';
import session from "../application/session";
import { BatchConnection } from "../../../server/src/batchConnection";
import { IConnection } from "../../../server/src/dto";


export class Connection implements IConnection{
  socket: WebSocket;
  onMessage: (data: string) => void;
  constructor(socket: WebSocket) {
    this.socket = socket;
    this.socket.onmessage = (message) => {
     // console.log(message.data)
      this.onMessage(message.data);      
    }
  }  
  sendUTF(data: string) {
    
  }
}

export class ClientSocket{
  onMessage: Signal<IServerResponseMessage> = new Signal();
  private _websocket: WebSocket;
  nextId: () => string;

  constructor(url: string) {
    this._websocket = new WebSocket(url);
    this.nextId = createIdGenerator('socketRequest');
    const batchConnection = new BatchConnection(new Connection(this._websocket));
    batchConnection.onMessage = (message) => {
      const msg = JSON.parse(message);
      if (msg.type && msg.type === "ping") {
        this.sendMessage("pong", "");
      }
      this.onMessage.emit(msg);
    }
    this._websocket.onclose = (_) => {
      console.log("Socket is closed. Reconnect will be attempted in 1 second.");
      console.log('TODO disconnect')
      setTimeout(() => {
        // this.connect();
        console.log('TODO reconnect')
      }, 1000);
    }
    this._websocket.onerror = (err) => {
      console.error("Socket encountered error: ", err, "Closing socket");
    }
  }

  sendMessage(type: string, data: string) {
    const requestMessage = {
      sessionID: session.id,
      type: type, 
      content: data,
      requestId: this.nextId(),
    };
    const result = new Promise<string>((resolve) => {
      const privateMessageHandler = (message: IServerResponseMessage) => {
        if (
          message.requestId == requestMessage.requestId &&
          "privateResponse" == message.type
        ) {
          this.onMessage.remove(privateMessageHandler);
          console.log("private checker", message);
          resolve(message.content);
        }
      };
      this.onMessage.add(privateMessageHandler);
    });
    this._websocket.send(JSON.stringify(requestMessage));
    return result;
  }
}
