import { IObject, IObjectInfo, IObjectList } from './server-dto';
import { Vector } from '../../client/src/common/vector';
import { IConnection } from './serverInterfaces';
import { connection } from 'websocket';
export class GameModelServer{
  players: GamePlayerServer[] = [];
  objectList: GameObjectList;
  player: GamePlayerServer;
  users: GameUser[] = [];
  newObject: GameObject;
  constructor() {
    //this.player = new GamePlayer();
    this.objectList = new GameObjectList();
    
  }

  addNewUser(connection: IConnection) {
    const user = new GameUser(connection);
    this.users.push(user);
  }
  

  startGame() {
    this.users.forEach((item) => {
      const player = new GamePlayerServer(item);
      this.players.push(player);      
    })
  }

  setAllPlayer() {
    return this.players.map(item=>item.id);
  }

  addNewBuild(data: { position: Vector, object: IObject }, connection: connection) {
    const player = this.players.find(item => item.user.connection.connection === connection);
    //player.builds.push(data.build);
    this.newObject = new GameObject(data.object.object, player, new Vector(data.position.x, data.position.y));
    this.objectList.add(this.newObject);
    this.players.forEach(item=>{
      item.user.sendUTF('addNewBuild', JSON.stringify({
        object: data.object,
        name: player.id,
        position: data.position
      }));
    })
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
    this.health = 100;
    this.type = object.type;
    this.bullet = 10;
    this.player = player;
    this.position = position.clone();
    
    //this.node.position = position.clone();
  }

  
}


class GameUser{
  connection: IConnection;
  constructor(connection: IConnection) {
    this.connection = connection;
  }
  sendUTF(massage: string, content: string) {
    this.connection.connection.sendUTF(JSON.stringify({ type: massage, content: content }));
  }
}

export class GamePlayerServer {
  id: string;
  model: number;
  builds: IObjectInfo[];
  connection: connection;
  user: GameUser;
  constructor(user: GameUser) {
    this.id = user.connection.name;
    this.user = user;
  }
}