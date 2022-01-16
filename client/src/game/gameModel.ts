import Signal from '../common/signal';
import { IObject, IObjectInfo } from './dto';
import { tech } from './techTree';
import { IProgress,ITickable } from './dto';

export class GameModel implements ITickable{
  objectList: GameObjectList;
  mapInfo: MapInfo;
  player: GamePlayer;
  onUpdateSidePanel: Signal<void> = new Signal();
  onUpdateSidePanelProgress: Signal<IProgress> = new Signal<IProgress>();
  onUpdateCanvas: Signal<void> = new Signal();
  constructor() {
    this.objectList = new GameObjectList();
    this.mapInfo = new MapInfo();
    this.player = new GamePlayer();
    this.player.onUpdatePlayer = () => {
      this.onUpdateSidePanel.emit();
    }
    this.player.onUpdateProgress = (progress, name) => {
      this.onUpdateSidePanelProgress.emit({ "progress": progress, "name": name })
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
  money: number;
  //this is all object
  allObject: IObject[]=[];
  availableObject: IObjectInfo[]=[];
  buildsInProgress: BuildingProgress[]=[];
  buildsReady: IObjectInfo[]=[];
  onUpdatePlayer: () => void;



  //delete it
  onUpdateProgress: (progress: number, name: string) => void;


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
        status: 'inActive',
        progress: 0,
      }
    })
  }

  addBuildsInProgress(object: IObjectInfo) {
    
    const time = object.time;
    const money =  object.cost;
    const progress = new BuildingProgress(object);
    //progress.onTick = (delta: number) => {

      //progress.progress++;
     // this.onUpdateProgress(progress.progress, object.name);
    //}

    
    this.buildsInProgress.push(progress);
    //this.money-= Math.round(money/time);
    //this.onUpdateProgress(progress, object.name);

  }

  tick(delta: number) {
    this.buildsInProgress.forEach(item => {
      const nextMoney = item.updateProgress(delta, this.money);
      this.money = nextMoney;
      this.allObject.find(it => it.object.name == item.object.name).progress = item.progress;
      if (item.isReady) {
        //удалять с buildsInProgress, добавить в buildsReady
        

      }
    })
    this.buildsInProgress = this.buildsInProgress.filter(it => !it.isReady);
    this.onUpdatePlayer();
    //вызывать апдейт всего и панели
  }
}


class BuildingProgress{
  object: IObjectInfo;
  progress: number = 0;

  //onTick: (delta: number) => void;
  //onReady: () => void;

  get isReady() {
    return this.progress === this.object.time;
  }

  constructor(object: IObjectInfo) {
    this.object = object;
  }

  updateProgress(delta: number, money: number) {
    //уменьшаем деньги

    //this.onTick(delta, money);
    let nextMoney = money;
    this.progress += delta * 0.001;
    //
    console.log(this.progress, this.object.time)
    const time = this.object.time * 100 / delta;
//посчитать чтобы прогресс не перескочил время
    if (this.progress >= this.object.time) {
      this.progress = this.object.time;
//считаю деньги
      
     // return nextMoney;
        //this.buildsInProgress.filter(item => item != object);
        //this.buildsReady.push(object);
       // this.onUpdateProgress(progress,object.name);
    } 
    if (this.progress > this.object.time) {
      
      throw new Error('Invalid progress');
    }
    return nextMoney;
  }
}