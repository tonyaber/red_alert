import { createIdGenerator } from "./createIdGenerator";
import { IServerRequestMessage, IServerResponseMessage } from "./dto";
import Signal from "../../../common/signal";
import session from "../application/session";
export class ClientSocket {
  onMessage: Signal<IServerResponseMessage> = new Signal();
  private _websocket: WebSocket;
  nextId: () => string;

  constructor(url: string) {
    this._websocket = new WebSocket(url);
    this.nextId = createIdGenerator("socketRequest");
    this._websocket.onmessage = (message) => {
      const msg = JSON.parse(message.data);
      console.log(msg);
      if (msg.type && msg.type === "ping") {
        this.sendMessage("pong", "");
      }
      this.onMessage.emit(msg);
    };
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
