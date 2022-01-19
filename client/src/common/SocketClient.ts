import {IServerResponseMessage} from "./socketInterface";
import {IObject} from "../game/dto";
import {Vector} from "./vector";

export class ClientSocketModel {

  public websocket: WebSocket;
  private _websocket: WebSocket;
  getNewBuild:(data:{obj:IObject,position:Vector})=>void

  constructor() {
    console.log("****")
    this._websocket = new WebSocket('ws://localhost:3000/');
    console.log(this._websocket)
    this._websocket.onopen = () => {
      console.log("OPEN")
    }
    this._websocket.onmessage = (message) => {
      const response: IServerResponseMessage = JSON.parse(message.data)
      if (response.type === 'message') {
      }
      if (response.type == 'sendName') {
        console.log(response.content)
      }
      if(response.type==='addNewBuild'){
        console.log('%%%',response.content)
        this.getNewBuild(JSON.parse(response.content))
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
    const name = Math.floor(Math.random() * 50) + 'TestName'
    const requestMessage = {
      type: 'sendName',
      content: name
    }
    this._websocket.send(JSON.stringify(requestMessage))
  }

  addNewBuild(obj: IObject, position: Vector) {
    const requestMessage = {
      type: 'sendNewBuild',
      content: {
        object:obj,
        position:position
      }
    }
    this._websocket.send(JSON.stringify(requestMessage))
  }
}