import { PlayerController } from "./playerController";
import { PlayerSide } from "./playerSide";
import { IStartGameResponse, IUpdateSidePanel } from './dto';
import { Vector } from "../../client/src/common/vector";
import { TickList } from "./tickList";

export class BotCommander{
  playerController: PlayerController;
  tickList: TickList;
  //sidePanel:PlayerSide;
  

  constructor(playerController:PlayerController){
    this.playerController = playerController;
    this.tickList = new TickList();
    this.tickList.add(this);
  }
  
  private handleClientMessage(type: string, message: string) {    
    if (type === 'startGame') {
      const data:IStartGameResponse = JSON.parse(message);      
      const builds = data.sidePanel.sidePanelData.filter(item => item.status === 'available');         
      this.playerController.startBuilding(builds[Math.floor(Math.random() * builds.length)].object.name);
    }
    if (type === 'updateSidePanel') {     
      const data: IUpdateSidePanel = JSON.parse(message);
      const buildsIsReady = data.sidePanelData.filter(item => item.status === 'isReady');
      const availableBuild = data.sidePanelData.filter(item => item.status === 'available');
      if (buildsIsReady.length) {
        this.playerController.addGameObject(buildsIsReady[Math.floor(Math.random()*buildsIsReady.length)].object.name, new Vector(Math.floor(Math.random()*500), Math.floor(Math.random()*500)))
      }
      if (availableBuild.length) {
        this.playerController.startBuilding(availableBuild[Math.floor(Math.random() * availableBuild.length)].object.name);
      }
    }    
  }

   tick(delta: number){
    
    const privateMessage=0;//this.playerController.addGameObject()
    //
  }

  sendMessage(type: string, message:string){ // self receive
    this.handleClientMessage(type, message)
  }
}
