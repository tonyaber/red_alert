import { IObject, IObjectInfo, IObjectList } from './server-dto';
import { Vector } from '../../client/src/common/vector';
import { IConnection } from './serverInterfaces';
export class GameModelServer{
  players: GamePlayerServer[] = [];
  objectList: GameObjectList;
  player: GamePlayerServer;
  newObject: GameObject;
  constructor() {
    //this.player = new GamePlayer();
    this.objectList = new GameObjectList();
    
  }
  addNewPlayer(name: string) {
    const player = new GamePlayerServer(name);
    this.players.push(player);
  }

  startGame(users: IConnection[]) {
    users.forEach((item) => {
      const player = new GamePlayerServer(item.name);
      this.players.push(player);      
    })
    console.log(this.players)
  }

  setAllPlayer() {
    return this.players;
  }
  addNewBuild(data: { position: Vector, object: IObject }, name: string) {
    const player = this.players.find(item => item.id === name);
    //player.builds.push(data.build);
    this.newObject = new GameObject(data.object.object, player, new Vector(data.position.x, data.position.y));
    this.objectList.add(this.newObject);
    return {
      object: data.object,
      name: name,
      position: data.position
    }
  }

  

 
  setAllBuild(){
    return this.objectList;
  }
}
class GameObjectList{
  list: GameObject[] = [];

  add(object:GameObject) {   
    this.list.push(object);
  }

}

export class GameObject{
  name: string;
  health: number;
  type: "unit" | "build";
  bullet?: number;
  player: GamePlayerServer;
  position: Vector;
  node: string;
  id: string;
  object: IObjectInfo;
  constructor(object: IObjectInfo, player: GamePlayerServer, position: Vector) {
    this.object = object;
    this.name = object.name;
    this.health= 100;
    this.type = object.type;
    this.bullet = 10;
    this.player = player;
    this.position = position.clone();
    
    //this.node.position = position.clone();
  }

 

  
}

export class GamePlayerServer {
  id: string;
  model: number;
  builds: IObjectInfo[];
  constructor(name: string) {
    this.id = name;
  }
}