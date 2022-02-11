import { PlayerController } from "./playerController";
import { IStartGameResponse, IUpdateSidePanel } from './dto';
import { Vector, IVector } from "../../common/vector";
import { TickList } from "./tickList";

export class BotCommander{
  playerController: PlayerController;
  tickList: TickList;
  reloadingTime: number = 1000;
  loading: number = 1000;
  panelInfo: IUpdateSidePanel;
  radius: number = 0; // радиус постройки вокруг инишл здания
  startPoint: Vector; // стартовая точка для постройки первого здания
  circlePoints: Array<IVector> = []; // точки на круге
  startAngle: number = 4; // угол отклонения при расчете точек на окружности
  stepBuilding: number = 1; // номер круга постройки  
  minDistance: number = 4; // Минимально допустимое расстояние для постройки

  constructor(playerController:PlayerController){
    this.playerController = playerController;
    this.tickList = new TickList();
    this.tickList.add(this);
    // this.startPoint = new Vector(20, 20);
    this.startPoint = new Vector(Math.floor(Math.random() * 500), Math.floor(Math.random() * 500));
  }
  
  private handleClientMessage(type: string, message: string) {    
    if (type === 'startGame') {
      const data:IStartGameResponse = JSON.parse(message);      
      const builds = data.sidePanel.sidePanelData.filter(item => item.status === 'available');  // Доступные здания
      this.playerController.startBuilding(builds[Math.floor(Math.random() * builds.length)].object.name); 
      this.circlePoints = this.getCirclePoints() // Получим точки окружности вокруг первого здания
    }   
    if (type === 'updateSidePanel') {
      this.panelInfo = JSON.parse(message);
      const buildsIsReady = this.panelInfo.sidePanelData.filter(item => item.status === 'isReady');  //  && item.object.subType === 'build'
      if (buildsIsReady.length) {
        // console.log('buildsIsReady: ', buildsIsReady)
        const lastEl = this.circlePoints[this.circlePoints.length - 1]
        this.circlePoints.pop();
        let vector = new Vector(lastEl.x, lastEl.y)
        let currentPointAdd = vector.clone().add(vector) // надо клонировать?
        this.playerController.addGameObject(buildsIsReady[Math.floor(Math.random() * buildsIsReady.length)].object.name, vector); // this.startPoint
      }
    }
  }

  tick(delta: number) {
    
    this.loading -= delta;
    if (this.loading <= 0) {

      this.loading = this.reloadingTime;
      const random = Math.random();
      this.radius += this.radius < 10 ? 1 : 0.5;
      
      // строим здание 
      if (random < 0.3) {
        const availableBuilds = this.panelInfo.sidePanelData.filter(item => item.status === 'available' && item.object.subType === 'build');     // available ?
        if (availableBuilds.length) {
          // console.log('builds: ', availableBuilds)
          this.playerController.startBuilding(availableBuilds[Math.floor(Math.random() * availableBuilds.length)].object.name);
        }
      // строим юнита
      } else if (random < 1) {
        const availableUnits = this.panelInfo.sidePanelData.filter(item => item.status === 'available' && item.object.subType === 'unit');
        if (availableUnits.length) {
          this.playerController.startBuilding(availableUnits[Math.floor(Math.random() * availableUnits.length)].object.name);
        }

      //add to attack or some 
      //console.log(this.playerController.getObjects())
      }

      if (this.circlePoints.length === 0) {
        this.stepBuilding++
        this.circlePoints = this.getCirclePoints()
        // console.log(`точки на ${this.stepBuilding}-й окружности: `, this.circlePoints)
      }
    }
    const privateMessage=0;//this.playerController.addGameObject()
    //
  }

  sendMessage(type: string, message:string){ // self receive
    this.handleClientMessage(type, message)
  }

  getCirclePoints(){
    let arrPoints: Array<IVector> = []
    let angle = (this.startAngle) / this.stepBuilding; //  / 2
    for(let i=0; i <=180; i = i + angle){
      let x: number = this.startPoint.x + this.minDistance * this.stepBuilding * Math.cos(i);
      let y: number = this.startPoint.y + this.minDistance * this.stepBuilding * Math.sin(i);
      
      arrPoints.push({ x: Math.floor(Math.abs(x)), y: Math.floor(Math.abs(y)) })
    }
    console.log(`точки на ${this.stepBuilding}-й окружности: `, arrPoints)
    return arrPoints
  }   
}

/*
0) Если построек еще нет, строим произвольную точку start
1) Получить координаты всех точек, лежащих на окружности с центром start и радиусом this.minDistance 
  (this.minDistance - минимальное допустимое расстояние до постройки - из общих настроек)
  методом полрной засечки (приращение координат по углу и расстоянию).

  getCirclePoints(r: number = 1){
    let arrPoints: Array<IVector> = []
    for(let i=0; i <=180; i=i+10){
      let x:number = this.startPoint.x + this.minDistance * r * Math.cos(i)
      let y:number = this.startPoint.y + this.minDistance * r * Math.sin(i)
      arrPoints.push({ x, y })
    }
    return arrPoints
  } 

2) Обход массива arrPoints. Если 
  - расстояние до ближайшего своего здания > this.minDistance
  - расстояние до ближайшего здания противника > this.minDistance
  - если на этом месте можно строить
  => строим здание

3) По окончанию обхода, построить новую окружность с радиусом this.minDistance * 2 
и повторять шаго 1 и 2
*/