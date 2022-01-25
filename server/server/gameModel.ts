import { IVector, Vector } from "../../client/src/common/vector";
import { createIdGenerator } from "../../client/src/game/idGenerator";
import { IRegisteredPlayerInfo } from "./dto";
import { GameObject } from "./gameObject";
import { PlayerSide } from "./playerSide";
import { TickList } from "./tickList";

export class GameModel{
  players: IRegisteredPlayerInfo[] = [];
  objects: Record<string, GameObject> = {};
  playersSides: Array<PlayerSide> =[];
  onUpdate: (id: string, data: string)=>void;
  onSideUpdate: (id: string, data: string) => void;
  sendPrivateResponse: (id: string, content: string) => void;
  tickList: TickList;
  gameObjects: any;
  nextId: () => string;
  
  constructor(players: IRegisteredPlayerInfo[]) {
    this.tickList = new TickList();
    this.players = players;
     this.nextId = createIdGenerator('object');
    this.players.forEach(item => {
      const playerSide = new PlayerSide(item.id);
      this.tickList.add(playerSide);
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

  getState(playerId: string) {
    return this.playersSides.find(item => item.id === playerId).getState();
  }

  //player methods
  addGameObject(playerId:string, objectType:string, position:IVector, name: string){
    //mapObject
    //проверка, можно ли его добавлять
   
    const gameObject = new GameObject(this.objects, this.playersSides, position, name, this.nextId());
    gameObject.onUpdate = (id, state)=>{
      this.onUpdate(id, state);
    }
    gameObject.update();
    this.gameObjects.push(gameObject);
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

 
}