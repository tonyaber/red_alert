import { PlayerController } from "./playerController";

export class BotCommander{
  playerController: PlayerController;

  constructor(playerController:PlayerController){
    this.playerController = playerController;
  }

  private tick(delta){
    //logic
    const privateMessage=0;//this.playerController.addGameObject()
    //
  }

  sendMessage(message){ // self receive
    // can read response;
  }
}
