import { PlayerController } from "./playerController";

export class BotCommander{
  playerController: PlayerController;

  constructor(playerController:PlayerController){
    this.playerController = playerController;
  }

  private tick(delta: number){
    //logic
    const privateMessage=0;//this.playerController.addGameObject()
    //
  }

  sendMessage(type: string, message:string){ // self receive
    // can read response;
  }
}
