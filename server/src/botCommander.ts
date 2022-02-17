import { PlayerController } from "./playerController";
import { IGameObjectData, IStartGameResponse, IUpdateSidePanel } from './dto';
import { Vector, IVector } from "../../common/vector";
import { TickList } from "./tickList";
import { findClosestBuild, getSubtype } from "./distance"; // , findClosestUnit
import { AbstractUnitObject } from "./gameObjects/units/abstractUnitObject";
import { Soldier } from "./gameObjects/units/soldier";
import { AbstractBuildObject } from "./gameObjects/builds/abstractBuildObject";
import { GameObject } from "./gameObjects/gameObject";
import { Console } from "console";

  
export class BotCommander{
  playerController: PlayerController;
  tickList: TickList;
  reloadingTime: number = 1000;
  loading: number = 1000;
  panelInfo: IUpdateSidePanel;
  radius: number = 0; // радиус постройки вокруг инишл здания
  startPoint: Vector = null; // стартовая точка для постройки первого здания
  circlePoints: Array<IVector> = []; // точки на круге
  startAngle: number = 3; // угол отклонения при расчете точек на окружности
  stepBuilding: number = 1; // номер круга постройки  
  minDistance: number = 2; // Минимально допустимое расстояние для постройки
  objectData: Record<string, IGameObjectData> = {};
  // attakedBuildings: Record<string, Array<string>> = {}

  constructor(playerController:PlayerController){
    this.playerController = playerController;
    this.tickList = new TickList()
    this.tickList.add(this);
    // this.attakedBuildings = {}
  }
  
  private handleClientMessage(type: string, message: string) {   // Обработка данных с клиента
    // this.objectData - это все данные о здании, включая айди игрока, которому оно принадлежит
    if(type === 'create'){
      let parsedObject: IGameObjectData = JSON.parse(message);
      this.objectData[parsedObject.objectId] = parsedObject; // получить созданные ботом здания 
      
      // получить координаты первого инишл здания и записать как this.startPoint
      if (this.startPoint === null && getSubtype(parsedObject.type) === 'build') {
        this.startPoint = parsedObject.content.position;
        this.circlePoints = this.getCirclePoints() // Получим точки окружности вокруг первого здания
      }
    }
    if(type === 'update'){
      let parsedObject: IGameObjectData = JSON.parse(message);
      this.objectData[parsedObject.objectId] = parsedObject; // обновить созданные ботом здания 
    }
    if(type === 'delete'){
      let parsedObject: IGameObjectData = JSON.parse(message);
      delete this.objectData[parsedObject.objectId]

      /////
      
      //if (!this.objectData.hasOwnProperty(parsedObject.objectId)) {
         // console.log('%cАтакоемое здание уничтожено ' + parsedObject.objectId+': ', 'color:orange')
          // console.log(this.attakedBuildings[parsedObject.objectId])

        // if (this.attakedBuildings[parsedObject.objectId]) {
        //   //console.log(this.attakedBuildings[parsedObject.objectId])
        //   this.attakedBuildings[parsedObject.objectId].forEach(soldierId => {
        //     if (this.objectData.hasOwnProperty(soldierId)) {
        //       // this.objectData[soldierId].content.action = 'idle';
        //       //console.log('%c ' + soldierId + ' - ' + this.objectData[soldierId].content.action, 'color: green')
        //     }
        //   })
        //   delete this.attakedBuildings[parsedObject.objectId]
        //}
      //}
    }

    if (type === 'addBuild' && !this.startPoint) {
      let parsedObject = JSON.parse(message);
     // console.log('type === addBuild, parsedObject = ', parsedObject)
      this.startPoint = parsedObject.content.position;
    }
    if (type === 'startGame') {
      let parse = JSON.parse(message);
      const data:IStartGameResponse = parse;      
      const builds = data.sidePanel.sidePanelData.filter(item => item.status === 'available');  // Доступные здания
      
      this.playerController.startBuilding(builds[Math.floor(Math.random() * builds.length)].object.name); 
    }   
    if (type === 'updateSidePanel') {
      let parse = JSON.parse(message);
      // console.log('updateSidePanel')
      this.panelInfo = parse;
      const buildsIsReady = this.panelInfo.sidePanelData.filter(item => item.status === 'isReady');  //  && item.object.subType === 'build'
      if (buildsIsReady.length) {
        
        const lastEl = this.circlePoints[this.circlePoints.length - 1]

        if (lastEl !== undefined) {
          // console.log('строим здание на позиции: ', lastEl)
          this.circlePoints.pop();
          let vector = new Vector(lastEl.x, lastEl.y)
          let currentPointAdd = vector.clone().add(vector) // надо клонировать?
          this.playerController.addGameObject(buildsIsReady[Math.floor(Math.random() * buildsIsReady.length)].object.name, currentPointAdd); // this.startPoint
        }
      }
    }
  }

  tick(delta: number) {

    this.loading -= delta;
    if (this.loading <= 0 && this.startPoint) {
      this.loading = this.reloadingTime;
      const random = Math.random();
      this.radius += this.radius < 10 ? 1 : 0.5;

      if (this.circlePoints.length === 0) {
        this.stepBuilding++
        this.circlePoints = this.getCirclePoints()
      }

      
      // строим здание 
      if (random < 0.3) {
        const availableBuilds = this.panelInfo.sidePanelData.filter(item => item.status === 'available' && item.object.subType === 'build');     // available ?
        if (availableBuilds.length) {
          this.playerController.startBuilding(availableBuilds[Math.floor(Math.random() * availableBuilds.length)].object.name);
        }
        
        // строим юнита
      } else if (random < 1) {
        const availableUnits = this.panelInfo.sidePanelData.filter(item => item.status === 'available' && item.object.subType === 'unit');
        const countUnits = Object.values(this.objectData).filter(item => item.type === 'soldier' && item.content.playerId === this.playerController.playerId).length;
        if (availableUnits.length&&countUnits<30) {
          this.playerController.startBuilding(availableUnits[Math.floor(Math.random() * availableUnits.length)].object.name);
        }
      }

      // go to attack
      
      // Выбрать бездействующих солдат текущего бота
      const arr = Object.values(this.objectData)
      
      let arrIdleSoldiers = arr.filter(item => {
        return item.type === 'soldier'
          && item.content.playerId === this.playerController.playerId
          && item.content.action === 'idle';
        }
      )
      // console.log('arrIdleSoldiers ', arrIdleSoldiers)
      
      // Здания врагов
      const arrEnemy: IGameObjectData[] = arr.filter(item => {
        return item.content.playerId !== this.playerController.playerId
          && getSubtype(item.type) === 'build'
          && item.content.health !== 0
      }
      )

      if (arrIdleSoldiers.length >= 3&&arrEnemy.length) {
        // console.log(`Посылаю в атаку солдат ${arrIdleSoldiers}`)
        // Послать в атаку каждого юнита
        arrIdleSoldiers.forEach((item, ind) => {
          // Выбрать ближайшего врага
  // const closestBuild = findClosestBuild(item.content.position, arrEnemy);
          //const enemyBuild: IGameObjectData = arrEnemy.find(it => it.objectId === closestBuild.unit.objectId)
          // послать солдата item в атаку на ближайшее к нему здание enemyBuild
          // console.log(`послать солдата ${item.objectId} в атаку на ближайшее к нему здание ${closestBuild} ${enemy.objectId}`)
          this.playerController.setAttackTarget(item.objectId, arrEnemy[0].objectId)
          // if (!this.attakedBuildings[enemyBuild.objectId]) {
          //   this.attakedBuildings[enemyBuild.objectId] = []
          // }
          // this.attakedBuildings[enemyBuild.objectId].push(item.objectId)
        })
      }
    }

    const privateMessage=0;//this.playerController.addGameObject()
  }

  sendMessage(type: string, message:string){ // self receive
    this.handleClientMessage(type, message)
  }

  getCirclePoints(){
    let arrPoints: Array<IVector> = []
    let angle = (this.startAngle) / this.stepBuilding; //  / 2
    for (let i = 0; i <= 180; i = i + angle){
      let x: number = this.startPoint.x + this.minDistance * this.stepBuilding * Math.cos(i);
      let y: number = this.startPoint.y + this.minDistance * this.stepBuilding * Math.sin(i);
      arrPoints.push({ x: Math.floor(Math.abs(x)), y: Math.floor(Math.abs(y)) })
    }
    // console.log(`точки на ${this.stepBuilding}-й окружности: `, arrPoints)
    return arrPoints 
  }   
}
