import { Vector } from "../../common/vector";
import { PlayerController } from "./playerController";

export class HumanCommander{
  playerController: PlayerController;
  connection: any;

  constructor(playerController:PlayerController, connection:any){
    this.playerController = playerController;
    this.connection = connection;
  }

  handleClientMessage(message) {
    if (message.type == 'add'){
      const privateResponse = ''; //this.playerController.addGameObject()
      this.sendMessage('', privateResponse);
    }
    if (message.type === 'startBuild') {
      return this.playerController.startBuilding(message.content.name);
    }
    if (message.type === 'addBuild') {
      return this.playerController.addGameObject(message.content.name, message.content.position);
    }
    if(message.type ==='setPrimary'){
      return this.playerController.setPrimary(message.content.id, message.content.name);
    }
    if (message.type === 'pauseBuild') {
      return this.playerController.pauseBuilding(message.content.name)
    }
    if (message.type === 'playBuild') {
      return this.playerController.playBuilding(message.content.name)
    }
    if (message.type === 'moveUnit') {
      return this.playerController.moveUnits(message.content.id, message.content.position);
    }
  }

  sendMessage(type: string, message:string){ //send to client
    this.connection.sendUTF(JSON.stringify({type, content: message}));
  }
}