import { PlayerController } from "./playerController";
import { IGameObjectData, IStartGameResponse, IUpdateSidePanel } from './dto';
import { Vector, IVector } from "../../common/vector";
import { TickList } from "./tickList";
import { findClosestBuild, getSubtype } from "./distance"; // , findClosestUnit
import { AbstractUnitObject } from "./gameObjects/units/abstractUnitObject";
import { Soldier } from "./gameObjects/units/soldier";
import { AbstractBuildObject } from "./gameObjects/builds/abstractBuildObject";
import { GameObject } from "./gameObjects/gameObject";

  
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
  objectData: Record<string, IGameObjectData> = {};

  constructor(playerController:PlayerController){
    this.playerController = playerController;
    this.tickList = new TickList()
    this.tickList.add(this);
    // this.startPoint = new Vector(20, 20);
    this.startPoint = new Vector(Math.floor(Math.random() * 500), Math.floor(Math.random() * 500));

  }
  
  private handleClientMessage(type: string, message: string) {   // Обработка данных с клиента
    // this.objectData - это все данные о здании, включая айди игрока, которому оно принадлежит
    if(type === 'create'){
      let parsedObject: IGameObjectData = JSON.parse(message);
      this.objectData[parsedObject.objectId] = parsedObject; // получить созданные ботом здания 
    }
    if(type === 'update'){
      let parsedObject: IGameObjectData = JSON.parse(message);
      this.objectData[parsedObject.objectId] = parsedObject; // получить созданные ботом здания 
    }
    if(type === 'delete'){
      let parsedObject: IGameObjectData = JSON.parse(message);
      delete this.objectData[parsedObject.objectId]
    }

    if (type === 'addBuild' && !this.startPoint) {
      let parsedObject = JSON.parse(message);
      this.startPoint = parsedObject.content.position;
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
        
      // строим юнита
      } else if (random < 1) {
        const availableUnits = this.panelInfo.sidePanelData.filter(item => item.status === 'available' && item.object.subType === 'unit');
        if (availableUnits.length) {
          this.playerController.startBuilding(availableUnits[Math.floor(Math.random() * availableUnits.length)].object.name);
        }

      // go to attack
      // console.log('attac this.objectData: ',typeof this.objectData, this.objectData)
      
      
      // Выбрать бездействующих солдат текущего бота
      const arr = Object.values(this.objectData)
      // console.log('arr: ', arr)
      let arrIdleSoldiers = arr.filter(item => {
        return item.type === 'soldier' 
          && item.content.playerId === this.playerController.playerId 
          && item.content.action === null //todo после добавления в стейт изменить на 'idle'
        }
      )
      // Выбрать ближайшего врага
      let arrEnemy = arr.filter(item => {
          return item.content.playerId !== this.playerController.playerId
            && getSubtype(item.type) === 'build'
        }
      )

      if (arrIdleSoldiers.length >= 10) {
        // console.log(this.playerController.playerId + '---------- Пора атаковать-----------')
        // console.log('Здания врагов: ', arrEnemy)
        // console.log('arrIdleSoldiers: ', arrIdleSoldiers)

        // Послать в атаку каждого юнита
        arrIdleSoldiers.forEach((item, ind) => {
          const vector = item.content.position;
          const closestBuild = findClosestBuild(vector, arrEnemy);
          // console.log('Блиайшее здание от ' + ind + ' солдата: ', closestBuild.unit.objectId)

          //послать солдата item в атаку на ближайшее к нему здание closestBuild
          this.playerController.setAttackTarget(item.objectId, closestBuild.unit.objectId, 1) // 1 - временно, т.к. в новом коде это убрали
        })
          
          
      }
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
<<<<<<< HEAD

=======
>>>>>>> ffa0ec199f7664a48639760f3c78f4467c50bc85
2) Обход массива arrPoints. Если 
  - расстояние до ближайшего своего здания > this.minDistance
  - расстояние до ближайшего здания противника > this.minDistance
  - если на этом месте можно строить
  => строим здание
3) По окончанию обхода, построить новую окружность с радиусом this.minDistance * 2 
и повторять шаго 1 и 2
<<<<<<< HEAD

=======
>>>>>>> ffa0ec199f7664a48639760f3c78f4467c50bc85
/// задача
1) Получать и сохранять созданные здания и юнитов objectData
2) Как только набралось 10 солдат - находить ближайшее здание врага
3) посылать в атаку
<<<<<<< HEAD

=======
>>>>>>> ffa0ec199f7664a48639760f3c78f4467c50bc85
*/