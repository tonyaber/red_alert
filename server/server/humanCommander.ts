import { Vector } from "../../client/src/common/vector";
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
      this.playerController.startBuilding(message.content.name);
    }
    if (message.type === 'addBuild') {
      this.playerController.addGameObject(message.content.name, message.content.position);
    }
    if(message.type ==='setPrimary'){
      this.playerController.setPrimary(message.content.id, message.content.name);
    }
  }

  sendMessage(type: string, message:string){ //send to client
    this.connection.sendUTF(JSON.stringify({type, content: message}));
  }
}