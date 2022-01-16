import Signal from '../common/signal';
import { IObjectInfo } from './dto';
import { tech } from './techTree';
import { IProgress } from './dto';

export class GameModel{
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


}

class GameObjectList{

}

class MapInfo{

}

class GamePlayer{
  money: number;
  availableObject: IObjectInfo[];
  buildsInProgress: IObjectInfo[];
  buildsReady: IObjectInfo[];
  onUpdatePlayer: () => void;
  onUpdateProgress: (progress: number, name: string) => void;

  addBuildsInProgress(object: IObjectInfo) {
    this.buildsInProgress.push(object);
    const time = tech.objects.filter(item => item.name = object.name)[0].time;
    const money =  tech.objects.filter(item => item.name = object.name)[0].cost;
    let progress = 0;
    this.onUpdateProgress(progress, object.name);
    const setInt = setInterval(() => {
      progress++;
      this.money-= money/time;
      if (progress >= time) {
        clearInterval(setInt);
        this.buildsInProgress.filter(item => item != object);
        this.buildsReady.push(object);
        this.onUpdateProgress(progress,object.name);
      } else {
        this.onUpdateProgress(progress,object.name);
      }

    }, 500)
   
  }
}
