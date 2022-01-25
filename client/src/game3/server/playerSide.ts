import { IObjectInfo } from "./dto";
import { tech } from "./techTree";

export class PlayerSide{
  money:number = 5000;
  buildings: IObjectInfo[] = []
  onUpdate:(data: string)=>void;
  onReady:(objectType:string)=>void;
  id: string;
  constructor(id: string){
    this.id = id;
    this.buildings = tech.object.map(item => {
      const newItem = {
        deps: item.deps,
        name: item.name,
        cost: item.cost,
      }
      return newItem;
    }).map(item => {
      return {
        object: item,
        status: 'notAvailable',
        progress: 0,
      }
    });
    this.getAvailableObject();

    this.onUpdate(JSON.stringify({ data: this.getAvailableObject(), money: this.money }));
  }
  getAvailableObject() {
    return this.buildings;
  }

  setMoney(){
    ///
    this.onUpdate('data');
  }

  startBuilding(objectType: string) {
    this.buildings.find(item => item.object.name === objectType).status = 'inProgress';
    //add to tick
    
    //return 'private'
  }

  pauseBuilding(objectType:string){

  }

  tick(delta){
    //onReady
  }
}