import { PlayerController } from "./playerController";
import { PlayerSide } from "./playerSide";
import { IStartGameResponse, IUpdateSidePanel } from './dto';
import { Vector } from "../../client/src/common/vector";
import { TickList } from "./tickList";

export class BotCommander{
  playerController: PlayerController;
  tickList: TickList;
  //sidePanel:PlayerSide;

  panelInfo: IUpdateSidePanel;
  

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
      this.panelInfo = JSON.parse(message);
      const buildsIsReady =  this.panelInfo.sidePanelData.filter(item => item.status === 'isReady');      
      if (buildsIsReady.length) {
        this.playerController.addGameObject(buildsIsReady[Math.floor(Math.random() * buildsIsReady.length)].object.name, new Vector(Math.floor(Math.random() * 500), Math.floor(Math.random() * 500)))
      }
    }
  }

  tick(delta: number) {
    const random = Math.random();
    
    if (random < 0.3) { 
      const availableBuild =  this.panelInfo.sidePanelData.filter(item => item.status === 'available');     
      if (availableBuild.length) {
        this.playerController.startBuilding(availableBuild[Math.floor(Math.random() * availableBuild.length)].object.name);
      }
     } else if (random < 1) {
      //add to attack or some 
      //console.log(this.playerController.getObjects())
    }

    const privateMessage=0;//this.playerController.addGameObject()
    //
  }

  sendMessage(type: string, message:string){ // self receive
    this.handleClientMessage(type, message)
  }
}
