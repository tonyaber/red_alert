import Signal from '../common/signal';
import { IObject, IObjectInfo ,IObjectList} from './dto';
import { tech } from './techTree';
import { IProgress,ITickable } from './dto';
import { Vector } from '../common/vector';
import { InteractiveObject } from './interactiveObject';
import { InteractiveTile } from './interactiveTile';
import { globalGameInfo } from './globalIdGenerator';

export class GameModel implements ITickable{
  objectList: GameObjectList;
  mapInfo: MapInfo;
  player: GamePlayer;
  onUpdateSidePanel: Signal<void> = new Signal();
  onUpdateCanvas: Signal<void> = new Signal();
  updateModel: (data: string) => void;
  //players: GamePlayer[] = [];
  //onBuild: (build: IObjectInfo) => void;
  constructor(players: string[], playerName: string) {
    this.objectList = new GameObjectList();
    this.mapInfo = new MapInfo();
    // players.map(item => {
    //   const newPlayer = new GamePlayer(item);
    //   this.players.push(newPlayer);
    // })
    //this.player = this.players.find(item=>item.id ===playerName)
    this.player = new GamePlayer('fff')
    this.player.onUpdatePlayer = () => {
      this.onUpdateSidePanel.emit();
    }
  }
  tick(delta: number) {
    this.player.tick(delta);
    this.objectList.tick(delta);
  }

  //создать массив вскх игроков GamePlayer, наш игрок будет в this.player
  addBuild(obj: IObject, position:Vector) {
    obj.status = 'Available';
    obj.progress = 0;
    this.player.buildsInGame.push(obj.object);
    this.player.getAvailableObject();
    this.onUpdateSidePanel.emit();
    const newObject = new GameObject1(obj.object, this.player, new Vector(position.x, position.y));
    newObject.onObjectUpdate = () => {
      this.updateModel(newObject.toJSON())
    }
    this.objectList.add(newObject);
  }

  setNewObject(data: string) {
    const newData = JSON.parse(data);
    this.objectList.list.find(elem => elem.id === newData.id).fromJSON(data);
  }

}

class GameObjectList{
  list: GameObject[] = [];

  add(object:GameObject) {   
    this.list.push(object);
  }

  tick(delta: number) {
    this.list.forEach(item => item.tick(delta));
  }
}

export class GameObject{
  name: string;
  health: number;
  type: "unit" | "build";
  bullet?: number;
  player: GamePlayer;
  position: Vector;
  node: InteractiveObject;
  id: string;
  onObjectUpdate: () => void;
  constructor(object: IObjectInfo, player: GamePlayer, position:Vector) {
    this.name = object.name;
    this.health= 100;
    this.type = object.type;
    this.bullet = 10;
    this.player = player;
    this.position = position.clone();
    this.id = globalGameInfo.nextId();
   //this.node = new InteractiveObject();   
    //this.node.position = position.clone();
  }

  tick(delta: number) {
    
  }

  toJSON() {
    
  }

  fromJSON(data: string) {
    
  }
  
}

class GameObject1 extends GameObject{
  node: InteractiveTile;
  
  constructor(object: IObjectInfo, player: GamePlayer, position:Vector) {
    super(object, player, position);
    this.node = new InteractiveTile();  
    this.node.gameObject = this;
    this.node.position = position.clone();
    this.node.health = this.health;
  }

  tick(delta: number) {
   // this.health -= delta * 0.001;
    //this.node.health = this.health;
    //this.onObjectUpdate()
  }


  
  toJSON() {
    return JSON.stringify({ position: this.position, health: this.health, id: this.id});
  }

  fromJSON(data: string) {
    const newData = JSON.parse(data);
    this.health = newData.health;
    this.node.health = this.health;
  }
}


class MapInfo{

}

export class GamePlayer{
  money: number = 30000;
  allObject: IObject[]=[];
  availableObject: IObjectInfo[]=[];
  buildsInProgress: BuildingProgress[]=[];
  buildsReady: IObjectInfo[] = [];
  buildsInGame: IObjectInfo[]=[]
  onUpdatePlayer: () => void;
  id: string;

  constructor(name: string) {
    this.id = name;
    this.allObject = tech.object.map(item => {
      const newItem:IObjectInfo = {
        deps: item.deps,
        name: item.name,
        cost: item.cost,
        category: 'gg',
        time: item.time,
        type: 'build',
      }
      return newItem;
    }).map(item => {
      return {
        object: item,
        status: 'notAvailable',
        progress: 0,
      }
    })
    this.getAvailableObject();
  }

  pauseBuildProgress(object: IObject) {
    
  }

  resumeBuildProgress(object: IObject) {
    
  }

  addBuildsInProgress(object: IObject) {   
    if (object.status !== 'Available') {
      throw new Error('Invalid data');
      
    }
    object.status = 'InProcess'
    const progress = new BuildingProgress(object.object);    
    this.buildsInProgress.push(progress);
  }

  tick(delta: number) {
    this.buildsInProgress.forEach(item => {
      const nextMoney = item.updateProgress(delta, this.money);
      this.money = nextMoney;
      this.allObject.find(it => it.object.name == item.object.name).progress = item.progress;
      if (item.isReady) {
        this.buildsReady.push(item.object);
        this.allObject.find(it => it.object === item.object).status='isReady';
        this.buildsInProgress = this.buildsInProgress.filter(it => item != it);   
      }
    })
    this.onUpdatePlayer();
  }

  getAvailableObject() {
    const availableObject = Array.from(new Set(this.buildsInGame.map(item => {
      return item.name;
    })));
    
    this.availableObject = [];
    
    this.allObject.filter(item => item.object.deps.includes('rootAccess'))
      .concat(this.allObject.filter(item => item.object.deps.every(el=>availableObject.includes(el))))
      .filter(item => item.status === 'notAvailable')
      .map(item => item.status = 'Available'); 
    
   this.allObject.filter(item => item.status !== 'notAvailable').map(item => {
      this.availableObject.push(item.object)
    })
   
  }
}

class BuildingProgress{
  object: IObjectInfo;
  progress: number = 0;

  get isReady() {
    return this.progress === this.object.time;
  }

  constructor(object: IObjectInfo) {
    this.object = object;
  }

  updateProgress(delta: number, money: number) {
    const segmentOfTime = delta*0.001
    let nextMoney = money - (this.object.cost / (this.object.time / segmentOfTime));
    
    this.progress += segmentOfTime;

    if (this.progress >= this.object.time) {
      const difference = this.progress - this.object.time;
      nextMoney =  nextMoney + (this.object.cost/(this.object.time/difference))
      this.progress = this.object.time;
    } 
    return +nextMoney;
  }
}