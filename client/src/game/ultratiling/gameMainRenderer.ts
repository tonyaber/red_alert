import { IVector, Vector } from "../../../../common/vector";
import { Camera } from "./camera";
import { GameDebugInfoView } from "./gameDebugInfoView";
import { TilingLayer } from "./tileLayer";
import { BoundingLayer } from "./boundingLayer";
import { IGameObjectData, IObject } from '../dto';
import { builds } from '../builds_and_units/buildMap';
import { InteractiveObject } from "../builds_and_units/interactiveObject";
import { InteractiveList } from "../interactiveList";
import { interactiveList } from "../builds_and_units/interactiveObject";
import { GameCursorStatus } from '../gameCursorStatus';

import { Explosion } from '../builds_and_units/explosion';
import { AbstractBuild } from "../builds_and_units/builds/abstractBuild";
import { mod } from "./mod";
import { Gold } from "../builds_and_units/gold";
import { Rock } from "../builds_and_units/rock";
import { AbstractUnit } from "../builds_and_units/units/abstractUnit";
import { Bullet } from '../builds_and_units/bullet';
export class GameMainRender{
  tilingLayer: TilingLayer; 
  camera: Camera;
  debugInfoView = new GameDebugInfoView();
  objects: Array<InteractiveObject> = [];
  boundingLayer: BoundingLayer;
  res: Record<string, HTMLImageElement>;
  interactiveList: InteractiveList;
  playerId: string;
  cursorStatus: GameCursorStatus;
  cursorPosition: Vector;
  hoveredObjects: InteractiveObject;
  buildsMap: number[][] = [];
  onAddBuild: (position: Vector, name: string) => void;
  onObjectClick: (id: string, name: string, subType: string) => void;
  onChangePosition: (id: string, position: Vector) => void;
  onAttack: (id: string, targetId: string) => void;
  explosions: Explosion[]=[];
  preventSelect: boolean = false;
  bullets: Record<string, Bullet> = {};

  constructor(camera: Camera, width: number, height: number, res: Record<string, HTMLImageElement>, playerId: string) {
    this.res = res;
    this.camera = camera;
    this.playerId = playerId;
    this.buildsMap = new Array(96).fill(null).map((it) => new Array(96).fill(null).map((el) => 0));
    this.cursorStatus = new GameCursorStatus(this.playerId, ()=>{
      return this.getBuildMap();
    },
      () => {
        return this.interactiveList;
      }
    );
    
    this.interactiveList = interactiveList;
    const mp = 100;
    this.tilingLayer = new TilingLayer(mp, mp, camera.getTileSize(), camera.position);
    this.tilingLayer.registred = [
      null, res['grass'],  res['grass'], res['goldMin'], res["goldLow"], res["goldLow"],res['goldMed'],res["goldFull"],res["rock"],res['tree'], res['tree2']
    ]
    let newMap:Array<Array<number>> = new Array(mp).fill(0).map(it=> new Array(mp).fill(1));

    this.tilingLayer.update(this.camera.position, newMap);
    

    this.boundingLayer = new BoundingLayer(mp, mp, camera.getTileSize(), camera.position);
    this.interactiveList.onChangeHovered = (lastTarget:InteractiveObject, currentTarget:InteractiveObject) => {
      this.hoveredObjects = currentTarget;
      this.cursorStatus.hovered = currentTarget ? [currentTarget] : [];
    }

    this.interactiveList.onClick = (current) => {   
      this.interactiveList.list.filter(item=>item.playerId===this.playerId).forEach(item => item.deleteSelected());
      if (current&&current.playerId === this.playerId) {
        this.setSelected(current.id)
        this.cursorStatus.selected = current ? [current] : [];  
      }      
    };

    // for (let i =0; i<50; i++){
    //   //const obj = new GameObject(this.renderer.tilingLayer, res, new Vector(0, 0));
    //   const obj = new GameObject(this.tilingLayer, this.boundingLayer, res, new Vector(Math.floor(Math.random()*(mp-4)), Math.floor(Math.random()*(mp -4))));
    //   this.objects.push(obj);
    // }
  }

  tick(delta:number){
    this.debugInfoView.tick(delta);
    
    /*this.tilingLayer.update(this.camera.position, this.tilingLayer.map.map(it=>it.map(jt=>{
      return (Math.random()<0.005? 1-jt: jt);
    })))*/
    this.camera.tick(delta);
    this.tilingLayer.updateCamera(this.camera.position, this.camera.getTileSize());
    this.boundingLayer.updateCamera(this.camera.position, this.camera.getTileSize());
  }
  getBuildMap(){
    return this.buildsMap;
  }

  render(ctx: CanvasRenderingContext2D){
    //ctx.drawImage(this.tilingLayer.canvas, this.camera.position.x, this.camera.position.y);
    // ctx.drawImage(this.tilingLayer.canvas1, 0, 0);
    // ctx.drawImage(this.boundingLayer.canvas1, 0, 0);
    ctx.drawImage(this.tilingLayer.canvas, 
      -mod(this.camera.position.x, this.camera.getTileSize())*1, 
      -mod(this.camera.position.y, this.camera.getTileSize())*1
    );
    ctx.drawImage(this.boundingLayer.canvas, 
      -mod(this.camera.position.x, this.camera.getTileSize())*1 - this.camera.getTileSize() * 4, 
      -mod(this.camera.position.y, this.camera.getTileSize())*1 - this.camera.getTileSize() * 4
    ); 
    this.debugInfoView.render(ctx);
    this.explosions.forEach(it => it.render(ctx, this.camera.position, 15));
    
    this.cursorStatus.render(ctx, this.camera.position, this.camera.getTileSize());
   // Object.values(this.bullets).forEach(item => item.render(ctx, this.camera.position));
  }

  setCameraPosition(position:Vector){
    this.camera.position = position;
    this.tilingLayer.updateCamera(this.camera.position, this.camera.getTileSize());
    this.boundingLayer.updateCamera(this.camera.position, this.camera.getTileSize());
  }

  processMove(cursor: Vector){
    const moveCursor = new Vector(
      Math.floor((cursor.x + this.camera.position.x) / this.camera.getTileSize()), 
      Math.floor((cursor.y + this.camera.position.y) / this.camera.getTileSize())
    );
    this.interactiveList.list.forEach(obj=>obj.processMove(moveCursor));
  }

  addObject(data: IGameObjectData) {
    const BuildConstructor = builds[data.type];
    const interactiveObject = new BuildConstructor(this.tilingLayer, this.boundingLayer, this.res, this.camera, data);
    if (interactiveObject instanceof AbstractBuild && data.content.playerId === this.playerId) { this.cursorStatus.planned = null };
    this.changeBuildsMap(interactiveObject, data, 1);
  }

  changeBuildsMap(interactiveObject: InteractiveObject, data: IGameObjectData, state: number) {
   
    if (interactiveObject instanceof Gold || interactiveObject instanceof Rock) {
      this.buildsMap[data.content.position.y][data.content.position.x] = state;
    }
    if (interactiveObject instanceof AbstractBuild) {
      
       for (let i = 0; i < data.content.buildMatrix.length + 2; i++){
         for (let j = 0; j < data.content.buildMatrix[0].length + 2; j++){
           //if (state === 0) { console.log(data.content.position.x - 1 + j, data.content.position.y - 1 + i) }
          if (data.content.position.x - 1 + j > 0 &&
            data.content.position.y - 1 + i > 0 &&
            data.content.position.x - 1 + j < this.buildsMap.length &&
            data.content.position.y - 1 + i < this.buildsMap[0].length) {
            
           this.buildsMap[data.content.position.y-1 + i][data.content.position.x-1 + j] = state;
          }        
        }
      }       
    }
   // if(state===0)console.log(this.buildsMap)
  }

  addShot(data: { position: IVector, id: string }) {
   
    // this.bullets[data.id].destroy();
    // delete this.bullets[data.id]
    const pointPosition =  Vector.fromIVector(data.position)
    const explosion = new Explosion(pointPosition.scale(this.camera.getTileSize()));
    
    explosion.onDestroyed = () => {
      this.explosions = this.explosions.filter(it => it != explosion);
      this.interactiveList.list = this.interactiveList.list.filter(it => it !== explosion);
    }
    this.explosions.push(explosion);

  }
  addBullet(data: { position: IVector, id: string }) {  
    // if (this.bullets[data.id]) {
    //   this.bullets[data.id].updateShot(data.position)
    // } else {
    //   this.bullets[data.id] = new Bullet(this.boundingLayer, this.res, this.camera, data.position, data.id);
      
    // } 
  }

  updateObject(data: IGameObjectData) {
    //console.log('%^',data)
    const interactiveObject = this.interactiveList.list.find(item => item.id === data.objectId);
    if (interactiveObject) {
      interactiveObject.updateObject(data.content)
    }
  }

  deleteObject(data: IGameObjectData) {
    const interactiveObject = this.interactiveList.list.find(item => item.id === data.objectId);
    this.changeBuildsMap(interactiveObject, data, 0);
    interactiveObject.destroy();
  }

  setPlannedBuild(object: IObject) {
    object.mtx = [[1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1,1,1,1]]
    this.cursorStatus.planned = object;
  }

  setSelected(id: string) {
    this.interactiveList.list.find(item => item.id === id).setSelected();
  }

  handleMouseDown(cursor: Vector) {
    //this.cursorPosition = this.camera.position.clone().add(cursor)
    this.handleMultiSelect(this.cursorPosition, ()=>{
          this.preventSelect = true;
        });
    
  }
  handleMouseMove(cursor: Vector) {
    this.interactiveList.handleMove(this.camera.getTileVector(this.camera.position.clone().add(cursor)) ,this.camera.position.clone().add(cursor));
    this.cursorPosition = this.camera.position.clone().add(cursor)
    this.cursorStatus.pixelPosition = cursor;
    this.cursorStatus.tilePosition =this.camera.getTileVector(this.camera.position.clone().add(cursor)) 
  }

  handleClick(cursor: Vector) {
    if (this.preventSelect){
        this.preventSelect = false;
        return;
      } 
   
    this.interactiveList.list.filter(item=>item.playerId===this.playerId).forEach(item => item.deleteSelected());
    this.interactiveList.handleClick(this.camera.getTileVector(this.camera.position.clone().add(cursor)) ,this.camera.position.clone().add(cursor))
    const action = this.cursorStatus.getAction();
    // console.log(action)
    if (action === 'build') {
      this.onAddBuild?.(this.camera.getTileVector(this.camera.position.clone().add(cursor)),this.cursorStatus.planned.name);
    }
    if (action === 'primary') {
        this.onObjectClick(this.hoveredObjects.id, this.hoveredObjects.name, this.hoveredObjects.subType);
    } 
    if (action === 'move') {
        this.cursorStatus.selected.forEach(item=>this.onChangePosition(
          item.id, this.camera.getTileVector(this.camera.position.clone().add(cursor))))
        //отправлять на сервер this.cursorPosition
        //когда приходит ответ - запускать патч
        //this.cursorStatus.selected.forEach(item => (item as AbstractUnit).moveUnit(this.cursorPosition))
        this.interactiveList.list.filter(item => item.playerId === this.playerId&&item.selected===true).map(item=>item.deleteSelected());
        this.cursorStatus.selected = [];
    }
    if (action === 'attack') {
      this.cursorStatus.selected.forEach(item => this.onAttack(item.id, this.hoveredObjects.id));
      this.interactiveList.list.filter(item => item.playerId === this.playerId&&item.selected===true).map(item=>item.deleteSelected());
      this.cursorStatus.selected = [];
    }
    
    //console.log(this.camera.getTileVector(this.camera.position.clone().add(cursor)));
   // console.log(this.camera.position.clone().add(cursor));
  }

  public resizeViewPort(width:number, height:number){
    this.tilingLayer.resizeViewPort(width, height);
    this.boundingLayer.resizeViewPort(width, height);
  }

  handleMultiSelect(start:Vector, onSelect:()=>void){
    this.cursorStatus.multiStart = start; //new Vector(e.clientX, e.clientY);
    let listener = ()=>{
      
      let selection = this.interactiveList.list.filter(it=>{
        if ((it instanceof AbstractUnit) == false){
          return false;
        }
      return it.playerId==this.playerId && inBox((it as AbstractUnit).position.clone().scale(this.camera.getTileSize()), this.cursorStatus.multiStart,  this.cursorPosition);
      });
      this.interactiveList.list.filter(item=>item.playerId===this.playerId).forEach(item => item.deleteSelected());
      selection.forEach(item => item.setSelected());
      
      this.cursorStatus.multiStart = null;
      window.removeEventListener('mouseup', listener);
      if (selection.length){
        this.cursorStatus.selected = selection;
        onSelect();
      }
    }
    window.addEventListener('mouseup', listener);
  }
}
export function inBox(point:Vector, _start:Vector, _end:Vector){
  const start = new Vector(Math.min(_start.x, _end.x), Math.min(_start.y, _end.y));
  const end = new Vector(Math.max(_start.x, _end.x), Math.max(_start.y, _end.y));
  return point.x>start.x && point.y>start.y && point.x<end.x && point.y<end.y;
}

