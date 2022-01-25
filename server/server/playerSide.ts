import { BuildingProgress } from "./buildingInProgress";
import { IObjectInfo } from "./dto";
import { tech } from "./techTree";

export class PlayerSide{
  money:number = 5000;
  buildings: IObjectInfo[] = [];
  onUpdate:(data: string)=>void;
  onReady:(objectType:string)=>void;
  id: string;
  buildsInProgress: BuildingProgress[] = [];
  constructor(id: string){
    this.id = id;
    this.buildings = tech.object.map(item => {
      const newItem = {
        deps: item.deps,
        name: item.name,
        cost: item.cost,
        time: item.time
      }
      return newItem;
    }).map(item => {
      return {
        object: item,
        status: 'available',
        progress: 0,
      }
    });
    //this.getAvailableObject();
    //this.onUpdate(JSON.stringify({ sidePanelData: this.getAvailableObject(), money: this.money }));
  }


  getAvailableObject() {
    return this.buildings;
  }

  getState() {
    return {sidePanelData: this.buildings, money: this.money};
  }

  setMoney(){
    ///
    this.onUpdate('data');
  }

  startBuilding(objectType: string) {
    const build = this.buildings.find(item => item.object.name === objectType);
    build.status = 'inProgress';
    const progress = new BuildingProgress(build.object);    
    this.buildsInProgress.push(progress);

    this.onUpdate(JSON.stringify({ sidePanelData: this.getAvailableObject(), money: this.money }));
    //return 'private'
    //???
    return {content: 'ok'}
  }

  pauseBuilding(objectType:string){

  }

  tick(delta: number) {
    if (this.buildsInProgress.length) {
      this.buildsInProgress.forEach(item => {
        const nextMoney = item.updateProgress(delta, this.money);
        this.money = nextMoney;
        this.buildings.find(it => it.object.name == item.object.name).progress = item.progress;
        if (item.isReady) {
          this.buildings.find(it => it.object === item.object).status = 'isReady';
          this.buildsInProgress = this.buildsInProgress.filter(it => item != it);
        }
      })
      this.onUpdate(JSON.stringify({ sidePanelData: this.getAvailableObject(), money: this.money }));
    }
  }
}