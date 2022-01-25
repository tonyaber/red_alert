import { PlayerController } from "./playerController";

export class HumanCommander{
  playerController: PlayerController;
  connection: any;

  constructor(playerController:PlayerController, connection:any){
    this.playerController = playerController;
    this.connection = connection;
  }

  handleClientMessage(message){
    if (message == 'add'){
      const privateResponse = ''; //this.playerController.addGameObject()
      this.sendMessage('', privateResponse);
    }
  }

  sendMessage(type: string, message:string){ //send to client
    this.connection.sendUTF(JSON.stringify({type, content: message}));
  }
}