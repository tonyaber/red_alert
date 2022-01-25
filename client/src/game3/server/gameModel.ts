import { IVector } from "../../common/vector";
import { IRegisteredPlayerInfo } from "./dto";
import { GameObject } from "./gameObject";
import { PlayerSide } from "./playerSide";

export class GameModel{
  players: IRegisteredPlayerInfo[] = [];
  objects: Record<string, GameObject> = {};
  playersSides: Array<PlayerSide> =[];
  onUpdate: (id: string, data: string)=>void;
  onSideUpdate: (id: string, data: string) => void;
  
  constructor(players: IRegisteredPlayerInfo[]) {
    this.players = players;
    this.players.forEach(item => {
      const playerSide = new PlayerSide(item.id);
      playerSide.onUpdate = (data)=>{
        this.onSideUpdate(item.id, data)
      }
      playerSide.onReady=(type)=>{
        this._addUnit();
      }
      this.playersSides.push(playerSide);
    })
  }
  //player side methods
  startBuilding(playerId: string, objectType: string) {
    this.playersSides.find(item => item.id === playerId).startBuilding(objectType);
    //find by id
    //const playerSide:/*PlayerSide*/ any ={}
   // return 'private'
  }

  pauseBuilding(playerId:string, objectType:string){

  }

  private _completeBuilding(){

  }

  private _addUnit(){

  }

  //player methods
  addGameObject(playerId:string, objectType:string, position:IVector){
    //mapObject
    const gameObject = new GameObject(this.objects, this.playersSides);
    gameObject.onUpdate = (id, state)=>{
      this.onUpdate(id, state);
    }
    gameObject.update();
    //
    return 'private';
  }

  moveUnits(playerId:string, unitIds:string[], target:IVector){
    //objectt.. setState
  }

  setAttackTarget(playerId:string, unit:string, target:string){

  }

  setPrimary(playerId:string, buildId:string){

  }

  //

  tick(delta){
    //objects
    //sides
  }
}