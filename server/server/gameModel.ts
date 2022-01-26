import { IVector, Vector } from "../../client/src/common/vector";
import { createIdGenerator } from "../../client/src/game/idGenerator";
import { IGameObjectContent, IGameObjectData, IRegisteredPlayerInfo } from "./dto";
import { GameObject } from "./gameObject";
import { PlayerSide } from "./playerSide";
import { TickList } from "./tickList";

export class GameModel{
  players: IRegisteredPlayerInfo[] = [];
  objects: Record<string, GameObject> = {};
  playersSides: Array<PlayerSide> =[];
  onUpdate: (state: IGameObjectData, action: string)=>void;
  onSideUpdate: (id: string, data: string) => void;
  sendPrivateResponse: (id: string, content: string) => void;
  tickList: TickList;
  gameObjects: GameObject[] = [];
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
  addGameObject(playerId:string, objectType:string, position:IVector){
    //mapObject
    //проверка, можно ли его добавлять
    const state = {position, playerId }
    const gameObject = new GameObject(this.objects, this.playersSides, this.nextId(), objectType, state);
    gameObject.onUpdate = (state)=>{
      this.onUpdate(state, 'update');
    }
    gameObject.onCreate = (state)=>{
      this.onUpdate(state, 'create');
    }
    gameObject.create();
    this.gameObjects.push(gameObject);
    //
    //
    this.playersSides.find(item => item.id === playerId).setBuilding(objectType);

    return true;
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