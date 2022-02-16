import { IVector, Vector } from "../../common/vector";
import { createIdGenerator } from "./idGenerator";
import { IGameObjectContent, IGameObjectData, IRegisteredPlayerInfo } from "./dto";
import { GameObject } from "./gameObjects/gameObject";
import { PlayerSide } from "./playerSide";
import { TickList } from "./tickList";
import { gameObjects } from "./gameObjects/gameObjectsMap";
import { AbstractBuildObject } from "./gameObjects/builds/abstractBuildObject";
import { TilesCollection } from "./tileCollection";
import { findClosestBuild } from "./distance";


const BUILDS = ["buildingCenter",
  "barrack",
  "energyPlant",
  "bigEnergyPlant",
  "dogHouse",
  "carFactory",
  "techCenter",
  "radar",
  "repairStation",
  "oreBarrel",
  "oreFactory",
  "defendTower"];
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
  map: number[][];
  builds: any;
  mapForTrace: number[][];
  mapForBuilds: number[][];
  tilesCollection: TilesCollection;
  
  constructor(players: IRegisteredPlayerInfo[], state: { map: number[][], builds: any }) {
    this.tickList = new TickList();
    this.tilesCollection=new TilesCollection()
    this.players = players;
    this.map = state.map;
    this.builds = state.builds;
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
    return 'start building'
  }

  init() {
    this.createMap(this.map);
    this.createBuilds(this.builds);
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

  addInitialObject(playerId:string, objectName:string, position:IVector){
    const state = { position, playerId }
    const gameObjectConstructor = gameObjects[objectName];
    const gameObject = new gameObjectConstructor(this.objects, this.playersSides, this.nextId(), objectName, state);
    gameObject.setMap(this.tilesCollection)
    this.mapForBuilds[position.x][position.y] = -1;
    
    if(objectName==='rock'){
      this.mapForTrace[position.y][position.x] = -1;
    }
    gameObject.onUpdate = (state)=>{
      this.onUpdate(state, 'update');
    }
    gameObject.onCreate = (state) => {      
      this.objects[state.objectId] = gameObject;
      this.onUpdate(state, 'create');     
    }
    gameObject.onDelete = (state) => {
      delete this.objects[state.objectId];
      this.gameObjects = this.gameObjects.filter(it => it.objectId != state.objectId);
      this.mapForBuilds[position.x][position.y] = 0;
      this.onUpdate(state, 'delete'); 
    }

    gameObject.onDamageTile = (targetId, point) => {
      // this.gameObjects.find(it => it.objectId === targetId).damage(point, gameObject);
      // this.onShot(point);
      //gameObjects
    }
    gameObject.create();
    this.gameObjects.push(gameObject);
    //this.tickList.add(gameObject);
  
    return 'add object';
  }

  //player methods
  addGameObject(playerId: string, objectName: string, position: IVector) {
    if (this.checkBuilding(position, playerId) || !BUILDS.includes(objectName)) {
      const state = { position, playerId }
      const gameObjectConstructor = gameObjects[objectName];
      const gameObject = new gameObjectConstructor(this.objects, this.playersSides, this.nextId(), objectName, state);
      gameObject.setMap(this.tilesCollection)

      gameObject.onUpdate = (state)=>{
        this.onUpdate(state, 'update');
      }
      gameObject.onCreate = (state) => {
        this.playersSides.find(item => item.id === playerId).setBuilding(objectName);
        this.objects[state.objectId] = gameObject;
        
        if(gameObject.subType==='build'){        
          this.addMapBuild((gameObject as AbstractBuildObject).data.buildMatrix, position, -1);
          this.tilesCollection.addBuild((gameObject as AbstractBuildObject).data.buildMatrix, position)
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
        
        this.gameObjects = this.gameObjects.filter(it => it.objectId != state.objectId);
        if (gameObject.subType === 'build') { 
           this.addMapBuild(state.content.buildMatrix, state.content.position, 0);
        }
        this.onUpdate(state, 'delete');
        delete this.objects[state.objectId]; 
      }

      gameObject.onDamageTile = (targetId, point) => {
        const obj = this.gameObjects.find(it => it.objectId === targetId);
        if (obj) {
          this.gameObjects.find(it => it.objectId === targetId).damage(point, gameObject);
          this.onShot(point);
        }
        
        //gameObjects
      }
      gameObject.create();
      this.gameObjects.push(gameObject);
      this.tickList.add(gameObject);
    
      return 'add object';
    }
    return 'false';
  }

  checkBuilding(position: IVector, playerId: string) {
    for (let i = 0; i <4; i++){
      for (let j = 0; j < 4; j++){
        if (position.x + j >= this.mapForBuilds.length||
          position.y + i >= this.mapForBuilds[0].length||
          position.x + j < 0 ||
          position.y + i < 0 ||
          this.mapForBuilds[position.x + i][position.y + j] === -1) {
          return false;
        }
      }
    }
    const builds = this.gameObjects.filter(it => it instanceof AbstractBuildObject && it.data.playerId === playerId).map(item => {
      return item.getAllInfo();
    });
  
    const closestBuild = findClosestBuild(Vector.fromIVector(position), builds);
          
    if (!(!builds.length || closestBuild.distance <= 6)) { 
      return false;
    }
    return true;
  }


  addMapBuild(buildMatrix: number[][], position: IVector, state: number) {
    for (let i = 0; i < buildMatrix.length + 2; i++){
      for (let j = 0; j < buildMatrix[0].length + 2; j++){
        if (position.x - 1 + j > 0 &&
          position.y - 1 + i > 0 &&
          position.x - 1 + j < this.mapForBuilds.length &&
          position.y - 1 + i < this.mapForBuilds[0].length) {
          this.mapForBuilds[position.x-1 + j][position.y-1 + i] = state;
        }        
      }
    }    
  }

  moveUnits(playerId: string, unitId: string, target: IVector) {
    this.gameObjects.find(item => item.objectId === unitId && item.data.playerId === playerId).moveUnit(target);

    return 'move unit';
  }

  setAttackTarget(playerId: string, unitId: string, targetId: string) {
    const unit = this.gameObjects.find(item => item.objectId === unitId && item.data.playerId === playerId)
    if (unit) {
      unit.attack(targetId);
      return 'attack';
    }
    return 'false';
  }
    

  setPrimary(playerId: string, buildId: string, name: string) {
  //console.log(playerId, buildId, name)
    const newPrimary = this.gameObjects.find(item => item.objectId === buildId && item.data.playerId === playerId);
    //console.log(newPrimary)
    if (newPrimary&&this._getPrimary(playerId, name)) {
      const oldPrimary = this._getPrimary(playerId, name);
      //console.log(oldPrimary)
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

  createMap(map: number[][]) {
    this.mapForTrace = new Array(map.length).fill(null).map((it)=>new Array(map[0].length).fill(null).map((el)=>Number.MAX_SAFE_INTEGER));
    this.mapForBuilds = new Array(map.length+4).fill(null).map((it)=>new Array(map[0].length+4).fill(null).map((el)=>0));
    map.forEach((el, indX) => {
      el.forEach((it, indY) => {
        if (it === 1) {
          this.addInitialObject('initial', 'gold', { x: indX, y: indY })
        }
        else if (it === 2) {
          this.addInitialObject('initial', 'rock', { x: indX, y: indY });
        }
      });
    });
    this.tilesCollection.createTilesMap(this.mapForTrace)
    return 'addInitialMap'
  }

  createBuilds(builds: any) {
    this.players.forEach((player, index) => {
      builds[index].forEach((build: any)=> {
        this.addGameObject(player.id, build.name, build.position)
      })
    })
  }

  _getPrimary(playerId: string, name: string) {
    return this.gameObjects.find(item => item.type === name && item.data.primary && item.data.playerId === playerId);
  } 
}
