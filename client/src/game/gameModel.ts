import Signal from '../common/signal';
import { IObject, IObjectInfo } from './dto';
import { tech } from './techTree';
import { IProgress,ITickable } from './dto';

export class GameModel implements ITickable{
  objectList: GameObjectList;
  mapInfo: MapInfo;
  player: GamePlayer;
  onUpdateSidePanel: Signal<void> = new Signal();
  onUpdateCanvas: Signal<void> = new Signal();
  constructor() {
    this.objectList = new GameObjectList();
    this.mapInfo = new MapInfo();
    this.player = new GamePlayer();
    this.player.onUpdatePlayer = () => {
      this.onUpdateSidePanel.emit();
    }
  }
  tick(delta: number) {
    this.player.tick(delta)
  }

}

class GameObjectList{

}

class MapInfo{

}

class GamePlayer{
  money: number = 30000;
  allObject: IObject[]=[];
  availableObject: IObjectInfo[]=[];
  buildsInProgress: BuildingProgress[]=[];
  buildsReady: IObjectInfo[] = [];
  buildsInGame: IObjectInfo[]=[]
  onUpdatePlayer: () => void;

  constructor() {
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

  addBuildsInProgress(object: IObject) {   
    if (object.status === 'Available') {
      object.status = 'InProcess'
      const progress = new BuildingProgress(object.object);    
      this.buildsInProgress.push(progress);
    } else if (object.status === 'isReady') {
      object.status = 'Available';
      object.progress = 0;
      this.buildsInGame.push(object.object);
      this.getAvailableObject()
      this.onUpdatePlayer();
    }
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
    //this.buildsInProgress = this.buildsInProgress.filter(it => !it.isReady);
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