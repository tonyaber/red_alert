import { IVector } from "../../client/src/common/vector";
import { IObjectInfo } from "./dto";
import { GameModel } from "./gameModel";

export class PlayerController{
  gameModel: GameModel;
  playerId: string;
  
  constructor(playerId:string, gameModel:GameModel){
    this.gameModel = gameModel;
    this.playerId = playerId;
  }

  startBuilding(objectType: string) {
   return this.gameModel.startBuilding(this.playerId, objectType);
  }

  pauseBuilding(objectType: string) {
    return this.gameModel.pauseBuilding(this.playerId, objectType);
  }

  playBuilding(objectType: string) {
    return this.gameModel.playBuilding(this.playerId, objectType);
  }

  addGameObject(objectType:string, position:IVector){
    return this.gameModel.addGameObject(this.playerId, objectType, position);
  }

  moveUnits(unitIds:string[], target:IVector){

  }

  updateSidePanel(targetId: string) {
    const state = this.gameModel.getState(targetId);
    this.gameModel.onSideUpdate(this.playerId, JSON.stringify(state));
  }

  getSidePanelState() {
    return this.gameModel.getState(this.playerId)
  }

  getObjects() {
    return this.gameModel.getObjects();
  }

  setAttackTarget(unit:string, target:string){

  }

  setPrimary(buildId: string, name: string) {    
    return this.gameModel.setPrimary(this.playerId, buildId, name);
  }

}