import { IVector, Vector } from "../../common/vector";
import { createIdGenerator } from "./idGenerator";
import { IGameObjectContent, IGameObjectData, IRegisteredPlayerInfo } from "./dto";
import { GameObject } from "./gameObjects/gameObject";
import { PlayerSide } from "./playerSide";
import { TickList } from "./tickList";
import { gameObjects } from "./gameObjects/gameObjectsMap";
import { AbstractBuildObject } from "./gameObjects/builds/abstractBuildObject";
import { tilesCollection } from "./tileCollection";

export class GameModel{
  players: IRegisteredPlayerInfo[] = [];
  objects: Record<string, GameObject> = {};
  playersSides: Array<PlayerSide> =[];
  onUpdate: (state: IGameObjectData, action: string) => void;
  onSideUpdate: (id: string, data: string) => void;
  sendPrivateResponse: (id: string, content: string) => void;
  onShot: (point: Vector) => void;
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
    // console.log(playerId,'--',objectType)
    this.playersSides.find(item => item.id === playerId).startBuilding(objectType);
    //find by id
    //const playerSide:/*PlayerSide*/ any ={}
   // return 'private'
    return 'start building'
  }

  pauseBuilding(playerId:string, objectType:string){
    this.playersSides.find(item => item.id === playerId).pauseBuilding(objectType);
    return 'pause build'
  }

  playBuilding(playerId:string, objectType:string){
    this.playersSides.find(item => item.id === playerId).playBuilding(objectType);
    return 'play build'
  }

  private _completeBuilding(){

  }

  private _addUnit(type: string, spawn: string, playerId: string) {
    const el = this.gameObjects.find(item => item.data.playerId === playerId && item.type === spawn && item.data.primary);
    if(el){
      const position = el.data.position;
      const newPosition = position.clone();
      this.addGameObject(playerId, type, newPosition);
    }
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
    // console.log('addGameObjectServer')
    //mapObject
    //проверка, можно ли его добавлять
    //console.log(position)
    const state = { position, playerId }
    // console.log(objectName)
     const gameObjectConstructor = gameObjects[objectName];
    const gameObject = new gameObjectConstructor(this.objects, this.playersSides, this.nextId(), objectName, state);
    gameObject.onUpdate = (state)=>{
      this.onUpdate(state, 'update');
    }
    gameObject.onCreate = (state) => {
      this.playersSides.find(item => item.id === playerId).setBuilding(objectName);
      this.objects[state.objectId] = gameObject;
      console.log(this);
      console.log(gameObject.subType)
    if(gameObject.subType==='build'){
      const buildPos = (gameObject as AbstractBuildObject).buildMatrix.map((it, index) => {
        //  [0,1,1,0]
        //[0,1,1,0]
        return it.map((el, ind) => {
          if (el > 0) {
            return new Vector(position.x + ind, position.y + index)
          }
          return 0;
        }).filter(el => el != 0);
      }).flat() as Vector[];
      tilesCollection.addBuild(buildPos)
    }
      this.onUpdate(state, 'create');     
      if (!this._getPrimary(playerId, objectName)&&gameObject instanceof AbstractBuildObject) {
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
      delete this.objects[state.objectId];
      this.gameObjects = this.gameObjects.filter(it => it.objectId != state.objectId);
      this.onUpdate(state, 'delete'); 
    }

    gameObject.onDamageTile = (targetId, point) => {
      this.gameObjects.find(it => it.objectId === targetId).damage(point);
      this.onShot(point);
      //gameObjects
    }
    gameObject.create();
    this.gameObjects.push(gameObject);
    this.tickList.add(gameObject);
  
    return 'add object';
  }

  moveUnits(playerId: string, unitId: string, target: IVector) {
    this.gameObjects.find(item => item.objectId === unitId && item.data.playerId === playerId).moveUnit(target);
    return 'move unit';
  }

  setAttackTarget(playerId: string, unitId: string, targetId: string) {
    this.gameObjects.find(item => item.objectId === unitId && item.data.playerId === playerId).attack(targetId);
    return 'attack';
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
    return 'set primary'
  }

  _getPrimary(playerId: string, name: string) {
    return this.gameObjects.find(item => item.type === name && item.data.primary && item.data.playerId === playerId);
  }

  //

 
}