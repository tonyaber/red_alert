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
  onUpdate: (state: IGameObjectData, action: string) => void;
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
      playerSide.onReady = (type, subType, spawn) => {
        if (subType === 'unit') {
          this._addUnit(type, spawn, item.id);
        }
        
        //send response onReady to player
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

  private _addUnit(type: string, spawn: string, playerId: string) {
    const position = this.gameObjects.find(item => item.data.playerId === playerId && item.type === spawn && item.data.primary).data.position;
    const newPosition = position.clone().add(new Vector(25,25));
    this.addGameObject(playerId, type, newPosition);
    //position for primary
    //this.addGameObject()
  }

  getState(playerId: string) {
    return this.playersSides.find(item => item.id === playerId).getState();
  }

  getObjects() {
    return this.gameObjects.map(item=>item.getState());
  }

  //player methods
  addGameObject(playerId:string, objectName:string, position:IVector){
    //mapObject
    //проверка, можно ли его добавлять
    const state = {position, playerId }
    const gameObject = new GameObject(this.objects, this.playersSides, this.nextId(), objectName, state);
    gameObject.onUpdate = (state)=>{
      this.onUpdate(state, 'update');
    }
    gameObject.onCreate = (state) => {
      this.playersSides.find(item => item.id === playerId).setBuilding(objectName);
      this.onUpdate(state, 'create');     
      if (!this._getPrimary(playerId, objectName)) {
        gameObject.setState((lastState) => {
          return {
            ...lastState,
          primary: true,
          }
        })
      }
    }
    gameObject.onDelete = (state) => {
       this.playersSides.find(item => item.id === playerId).removeBuilding(objectName);
      this.onUpdate(state, 'delete'); 
    }
    gameObject.create();
    this.gameObjects.push(gameObject);

    return true;
  }

  moveUnits(playerId:string, unitIds:string[], target:IVector){
    //objectt.. setState
  }

  setAttackTarget(playerId:string, unit:string, target:string){

  }

  setPrimary(playerId: string, buildId: string, name: string) {
    const newPrimary = this.gameObjects.find(item => item.objectId === buildId && item.data.playerId === playerId);
    if (newPrimary&&this._getPrimary(playerId, name)) {
      const oldPrimary = this._getPrimary(playerId, name);
      oldPrimary.setState((lastState) => {
        return {
          ...lastState,
          primary: false,
        }
      })
      newPrimary.setState((lastState) => {
        return {
          ...lastState,
          primary: true,
        }
      })
    }
  }

  _getPrimary(playerId: string, name: string) {
    return this.gameObjects.find(item => item.type === name && item.data.primary && item.data.playerId === playerId);
  }

  //

 
}