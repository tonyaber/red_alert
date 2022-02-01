import { PlayerController } from "./playerController";

export class SpectatorCommander{
    playerController: PlayerController;
  connection: any;
  targetId: string;

  constructor(playerController:PlayerController, connection:any, targetId: string){
    this.playerController = playerController;
    this.connection = connection;
    this.targetId = targetId;
  }

  handleClientMessage(message) {     
    if (message.type === 'startBuild') {
      //this.playerController.startBuilding(message.content.name);
      this.sendMessage('startBuild', message.content)
    }
    if (message.type === 'addBuild') {
      this.sendMessage('addBuild', message.content)
      //this.playerController.addGameObject(message.content.name, message.content.position);
    }
    if (message.type === 'setPrimary') {
      this.sendMessage('setPrimary', message.content)
      //this.playerController.setPrimary(message.content.id, message.content.name);
    }
    if (message.type === 'setTargetSpectator') {
    
      this.targetId = message.content;
      this.playerController.updateSidePanel(this.targetId);
    }
  }

  sendMessage(type: string, message:string){ //send to client
    this.connection.sendUTF(JSON.stringify({type, content: message}));
  }
}