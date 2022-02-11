import { IVector } from "../../common/vector";
import { GameModel } from "./gameModel";

export class PlayerController{
  gameModel: GameModel;
  playerId: string;
  
  constructor(playerId:string, gameModel:GameModel){
    this.gameModel = gameModel;
    this.playerId = playerId;
  }

  //  на сайд панели постройку запускает
  startBuilding(objectType: string) {
   return this.gameModel.startBuilding(this.playerId, objectType);
  }

  pauseBuilding(objectType: string) {
    return this.gameModel.pauseBuilding(this.playerId, objectType);
  }

  playBuilding(objectType: string) {
    return this.gameModel.playBuilding(this.playerId, objectType);
  }

  // Добавление объекта на канвас
  addGameObject(objectType: string, position: IVector) {
    console.log("%c"+this.playerId+ ' строит '+ objectType+ ': '+position.x+': '+position.y, 'color: blue')
    return this.gameModel.addGameObject(this.playerId, objectType, position);
  }

  moveUnits(unitId:string, target:IVector,tileSize:number){
    return this.gameModel.moveUnits(this.playerId, unitId, target,tileSize);
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

  setAttackTarget(unitId:string, targetId:string){
    return this.gameModel.setAttackTarget(this.playerId, unitId, targetId)
  }

  setPrimary(buildId: string, name: string) {    
    return this.gameModel.setPrimary(this.playerId, buildId, name);
  }

}