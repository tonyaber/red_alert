import { PlayerController } from "./playerController";
import { IGameObjectData, IStartGameResponse, IUpdateSidePanel } from './dto';
import { Vector, IVector } from "../../common/vector";
import { TickList } from "./tickList";
import { findClosestBuild, findClosestUnit } from "./distance"
import { AbstractUnitObject } from "./gameObjects/units/abstractUnitObject";
import { Soldier } from "./gameObjects/units/soldier";
import { AbstractBuildObject } from "./gameObjects/builds/abstractBuildObject";

export class BotCommander{
  playerController: PlayerController;
  tickList: TickList;
  reloadingTime: number = 1000;
  loading: number = 1000;
  panelInfo: IUpdateSidePanel;
  radius: number = 0; // радиус постройки вокруг инишл здания
  startPoint: Vector = null; // стартовая точка для постройки первого здания
  circlePoints: Array<IVector> = []; // точки на круге
  startAngle: number = 4; // угол отклонения при расчете точек на окружности
  stepBuilding: number = 1; // номер круга постройки  
  minDistance: number = 4; // Минимально допустимое расстояние для постройки
  objectData: Array<IGameObjectData> = [];
  ataka: Boolean = false; // Находится ли бот в состоянии Атака
  
  constructor(playerController:PlayerController){
    this.playerController = playerController;
    this.tickList = new TickList()
    this.tickList.add(this);
    // this.startPoint = new Vector(20, 20);
    this.startPoint = new Vector(Math.floor(Math.random() * 500), Math.floor(Math.random() * 500));

  }
  
  private handleClientMessage(type: string, message: string) {   // Обработка данных с клиента
     // IGameObjectData - это все данные о здании, включая айди игрока, которому оно принадлежит
    if(type === 'create'){
      let parse = JSON.parse(message);
      // console.log(JSON.parse(message))
      this.objectData.push(JSON.parse(message)); // получить созданные ботом здания 
      // console.log('this.objectData: ',this.objectData)
    }
    if(type === 'update'){
      async () =>{
        let parse = JSON.parse(message);
        let updObject: IGameObjectData = await this.objectData.find(item => item.content.playerId === parse.content.playerId && item.objectId === parse.objectId)
        updObject.content = parse.content;
      }
    }
    if(type === 'delete'){
      async () =>{
        let parse = JSON.parse(message);      
        let delObject: IGameObjectData = await this.objectData.find(item => item.content.playerId === parse.content.playerId && item.objectId === parse.objectId)
        let delIndex = this.objectData.indexOf(delObject)
        this.objectData.splice(delIndex, 1)
      }
    }

    if (type === 'addBuild' && !this.startPoint) {
      let parse = JSON.parse(message);
      this.startPoint = parse.content.position;
    }
    if (type === 'startGame') {
      let parse = JSON.parse(message);
      const data:IStartGameResponse = parse;      
      const builds = data.sidePanel.sidePanelData.filter(item => item.status === 'available');  // Доступные здания
      
      this.playerController.startBuilding(builds[Math.floor(Math.random() * builds.length)].object.name); 
      this.circlePoints = this.getCirclePoints() // Получим точки окружности вокруг первого здания
    }   
    if (type === 'updateSidePanel') {
      let parse = JSON.parse(message);
      // console.log('updateSidePanel')
      this.panelInfo = parse;
      const buildsIsReady = this.panelInfo.sidePanelData.filter(item => item.status === 'isReady');  //  && item.object.subType === 'build'
      if (buildsIsReady.length) {
        // console.log('buildsIsReady: ', buildsIsReady)
        const lastEl = this.circlePoints[this.circlePoints.length - 1]
        this.circlePoints.pop();
        let vector = new Vector(lastEl.x, lastEl.y)
        let currentPointAdd = vector.clone().add(vector) // надо клонировать?
        this.playerController.addGameObject(buildsIsReady[Math.floor(Math.random() * buildsIsReady.length)].object.name, currentPointAdd); // this.startPoint
      }
    }
  }

  tick(delta: number) {

    this.loading -= delta;
    if (this.loading <= 0 && this.startPoint) {
      this.loading = this.reloadingTime;
      const random = Math.random();
      this.radius += this.radius < 10 ? 1 : 0.5;
      
      // строим здание 
      if (random < 0.3) {
        const availableBuilds = this.panelInfo.sidePanelData.filter(item => item.status === 'available' && item.object.subType === 'build');     // available ?
        if (availableBuilds.length) {
          this.playerController.startBuilding(availableBuilds[Math.floor(Math.random() * availableBuilds.length)].object.name);
        }
        console.log('this.objectData: ', this.objectData)
      // строим юнита
      } else if (random < 1) {
        const availableUnits = this.panelInfo.sidePanelData.filter(item => item.status === 'available' && item.object.subType === 'unit');
        if (availableUnits.length) {
          this.playerController.startBuilding(availableUnits[Math.floor(Math.random() * availableUnits.length)].object.name);
        }

      //add to attack or some 
      // console.log('attac this.objectData: ',typeof this.objectData, this.objectData)
        
        // Выбрать бездействующих солдат текущего бота
        let arrMySoldiers = (this.objectData).filter(item =>
          // item instanceof  AbstractUnitObject
          item instanceof  Soldier
          && item.content.playerId === this.playerController.playerId
          && item.action === 'idle'
        )
        // Выбрать ближайшего врага
        let arrEnemy = (this.objectData).filter(item =>
          item instanceof AbstractBuildObject
          && item.content.playerId !== this.playerController.playerId
        )
        

        console.log('arrMySoldiers: ', arrMySoldiers)
        if (arr.length >= 10) {
          // Послать в атаку каждого юнита
          arr.forEach((item) => {
            // idБлижайшегог врага
            this.playerController.playerId 
            // // playerPosition:Vector, builds:Array<AbstractBuildObject>
            // const builds = this.getObjects().list.filter(it => it.player === player&& it instanceof MapObject) as MapObject[];
            const closestBuild = findClosestBuild(arrMySoldiers[0].content.position.clone(), arrEnemy);
            // this.playerController.setAttackTarget(item.objectId, idБлижайшего врага, 1) // 1 - временно, т.к. в новом коде это убрали
          })
          console.log(this.playerController.playerId + '---------- Пора атаковать-----------')
          
      }
      // console.log(this.playerController.getObjects()) 
      // это все объекты на карте {health: 100  playerId: "bot13"   position: Vector {x: 225, y: 150} primary: true

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
    // console.log(`точки на ${this.stepBuilding}-й окружности: `, arrPoints)
    return arrPoints
  }   
}

/*
0) Если построек еще нет, строим произвольную точку start
1) Получить координаты всех точек, лежащих на окружности с центром start и радиусом this.minDistance 
  (this.minDistance - минимальное допустимое расстояние до постройки - из общих настроек)
  методом полрной засечки (приращение координат по углу и расстоянию).

2) Обход массива arrPoints. Если 
  - расстояние до ближайшего своего здания > this.minDistance
  - расстояние до ближайшего здания противника > this.minDistance
  - если на этом месте можно строить
  => строим здание

3) По окончанию обхода, построить новую окружность с радиусом this.minDistance * 2 
и повторять шаго 1 и 2

/// задача
1) Получать и сохранять созданные здания и юнитов objectData
2) Как только набралось 10 солдат - находить ближайшее здание врага
3) посылать в атаку

*/