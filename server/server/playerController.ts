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

  addGameObject(objectType:string, position:IVector){
    return this.gameModel.addGameObject(this.playerId, objectType, position)
  }

  moveUnits(unitIds:string[], target:IVector){

  }

  setAttackTarget(unit:string, target:string){

  }

  setPrimary(buildId:string){

  }
}