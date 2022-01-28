import { BuildingProgress } from "./buildingInProgress";
import { IObjectInfo } from "./dto";
import { tech } from "./techTree";

export class PlayerSide{
  money:number = 5000;
  buildings: IObjectInfo[] = [];
  buildsInGame: string[] = [];
  onUpdate:(data: string)=>void;
  onReady: (objectType: string, objectSubType: string, spawn: string) => void;
  
  id: string;
  buildsInProgress: BuildingProgress[] = [];
  constructor(id: string){
    this.id = id;
    this.buildings = tech.object.map(item => {
      const newItem = {
        deps: item.deps,
        name: item.name,
        cost: item.cost,
        time: item.time,
        subType: item.subType,
        spawn: item.spawn[0],
      }
      return newItem;
    }).map(item => {
      return {
        object: item,
        status: 'notAvailable',
        progress: 0,
      }
    });
    this.updateAvailableObject();
  }

  updateAvailableObject() {
    const availableObject = Array.from(new Set(this.buildsInGame));
       
    this.buildings.filter(item => item.object.deps.includes('rootAccess'))
      .concat(this.buildings.filter(item => item.object.deps.every(el=>availableObject.includes(el))))
      .filter(item => item.status === 'notAvailable')
      .map(item => item.status = 'available'); 
  }

  getState() {    
    return {sidePanelData: this.buildings, money: this.money};
  }

  removeBuilding(name: string) {
    const index = this.buildsInGame.findIndex(item=>item===name);
    this.buildsInGame.splice(index, 1);
    this.updateAvailableObject();
    this.onUpdate(JSON.stringify({ sidePanelData: this.buildings, money: this.money }));
  }

  setBuilding(name: string) {
    const build = this.buildings.find(item => item.object.name === name);
    build.status = 'available';
    build.progress = 0;
    this.buildsInGame.push(name);
    this.updateAvailableObject()
    this.onUpdate(JSON.stringify({ sidePanelData: this.buildings, money: this.money }));
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
    this.onUpdate(JSON.stringify({ sidePanelData: this.buildings, money: this.money }));
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
          this.onReady(item.object.name, item.object.subType, item.object.spawn)
        }
      })
      this.onUpdate(JSON.stringify({ sidePanelData: this.buildings, money: this.money }));
    }
  }
}


