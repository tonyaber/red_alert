import {IServerResponseMessage} from "./socketInterface";
import {IObject, IObjectInfo} from "../game/dto";
import {Vector} from "./vector";
import { GameObject } from "../game/gameModel";
import Signal from "./signal";
import { createIdGenerator } from "../game/idGenerator";

export class ClientSocketModel {

  public websocket: WebSocket;
  private _websocket: WebSocket;
  getNewBuild: (data: {  object: IObject, name: string, position: Vector }) => void;
  getUpdateObject: (data: string) => void;
  startGame: (data: string) => void;
  getName: (data: string) => void;
  onMessage: Signal<IServerResponseMessage> = new Signal();
  nextId: () => string;

  constructor() {
    this.nextId = createIdGenerator('socketRequest');
    this._websocket = new WebSocket('ws://localhost:3000/');
    this._websocket.onopen = () => {
      console.log("OPEN")
    }
    this._websocket.onmessage = (message) => {
      console.log(message.data);
      const response: IServerResponseMessage = JSON.parse(message.data)
      this.onMessage?.emit(response);
      if (response.type === 'message') {
      }
      if (response.type == 'sendName') {
        this.getName(JSON.parse(response.content))
      }
      if(response.type==='addNewBuild'){
        this.getNewBuild(JSON.parse(response.content))
      }
      if (response.type === 'getUpdateObject') {
        this.getUpdateObject(JSON.parse(response.content))
      }
      if (response.type === 'startGame') {
        this.startGame(JSON.parse(response.content))
      }
      // if (response.type === 'startGame') {
      //   const responseObj: IStartGameData = JSON.parse(response.content)
      //   this.players = responseObj.usersInGame
      //   responseObj.playerName = this.userConnectionName
      //   this.activePlayer = responseObj.activePlayer
      //   this.onOnlineSettings.emit(responseObj);
      //   this.roomId = responseObj.roomId;
      //   this.onStartGame.emit(null)
      //
      // }
    }
    this._websocket.onerror = () => {

    }
    //websocket.close()
  }

  setPlayerName() {
    const name = Math.floor(Math.random() * 50) + 'TestName';
    this.sendRequest('sendName', name);
  }

  addNewBuild(obj: IObject, position: Vector) {
    this.sendRequest('sendNewBuild', JSON.stringify({
      object: obj,
      position: position
    }));
  }

  sendUpdateObject(data: string) {
    this.sendRequest('sendUpdateObject', data);
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