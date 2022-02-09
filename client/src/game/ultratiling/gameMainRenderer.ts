import { Vector } from "../../../../common/vector";
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
import {tilesCollection, TilesCollection} from "../../../../server/src/tileCollection";
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
  onAddBuild: (position: Vector) => void;
  onObjectClick: (id: string, name: string, subType: string) => void;
  onChangePosition: (id: string, position: Vector,tileSize:number) => void;

  constructor(camera: Camera, width: number, height: number, res: Record<string, HTMLImageElement>, playerId: string) {
    this.res = res;
    this.camera = camera;
    this.playerId = playerId;
    this.cursorStatus = new GameCursorStatus(this.playerId);
    this.interactiveList = interactiveList;
    const mp = 100;
    this.tilingLayer = new TilingLayer(mp, mp, camera.getTileSize(), camera.position);
    this.tilingLayer.registred = [
      null, res['grass']
    ]
    let newMap:Array<Array<number>> = new Array(mp).fill(0).map(it=> new Array(mp).fill(1));

    this.tilingLayer.update(this.camera.position, newMap);

    this.boundingLayer = new BoundingLayer(mp, mp, camera.getTileSize(), camera.position);
    this.interactiveList.onChangeHovered = (lastTarget:InteractiveObject, currentTarget:InteractiveObject) => {
      this.hoveredObjects = currentTarget;
      this.cursorStatus.hovered = currentTarget ? [currentTarget] : [];
    }

    this.interactiveList.onClick = (current) => {   
      this.interactiveList.list.forEach(item => item.selected = false);
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

  render(ctx: CanvasRenderingContext2D){
    //ctx.drawImage(this.tilingLayer.canvas, this.camera.position.x, this.camera.position.y);
    ctx.drawImage(this.tilingLayer.canvas1, 0, 0);
    ctx.drawImage(this.boundingLayer.canvas1, 0, 0);
    this.debugInfoView.render(ctx);
    this.cursorStatus.render(ctx, new Vector(0,0));
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
    if(interactiveObject.subType==='build'){
      const buildPos=interactiveObject.tiles.map(e=>e.getPosition())
      tilesCollection.addBuild(buildPos)
    }
  }

  updateObject(data:IGameObjectData){
    //console.log('%^',data)
   this.interactiveList.list.find(item=>item.id === data.objectId).updateObject(data.content)
  }

  setPlannedBuild(object:IObject) {
    this.cursorStatus.planned = object;
  }

  setSelected(id: string) {
    this.interactiveList.list.find(item => item.id === id).selected = true;
  }

  handleClick(camera: Vector, tileSize: number) {

    
  }
  handleMouseMove(cursor: Vector) {
    this.interactiveList.handleMove(this.camera.getTileVector(this.camera.position.clone().add(cursor)) ,this.camera.position.clone().add(cursor));
    this.cursorPosition = this.camera.getTileVector(this.camera.position.clone().add(cursor))
    this.cursorStatus.pixelPosition = cursor
  }

  handleMouseDown(cursor: Vector) {
    this.interactiveList.list.forEach(item => item.selected = false);
    this.interactiveList.handleClick(this.camera.getTileVector(this.camera.position.clone().add(cursor)) ,this.camera.position.clone().add(cursor))
    const action = this.cursorStatus.getAction();
    console.log(action)
     if (action === 'build') {
        this.onAddBuild?.(this.camera.position.clone().add(cursor));
        this.cursorStatus.planned = null;
    }
    if (action === 'primary') {
        this.onObjectClick(this.hoveredObjects.id, this.hoveredObjects.name, this.hoveredObjects.subType);
    } 
    if (action === 'move') {
      console.log("move",this.camera.position.clone().add(cursor))
        this.cursorStatus.selected.forEach(item=>this.onChangePosition(
          item.id, this.camera.position.clone().add(cursor),this.camera.getTileSize()))
        //отправлять на сервер this.cursorPosition
        //когда приходит ответ - запускать патч
        //this.cursorStatus.selected.forEach(item => (item as AbstractUnit).moveUnit(this.cursorPosition))
        this.interactiveList.list.filter(item => item.selected===true).map(item=>item.selected=false);
        this.cursorStatus.selected = [];
    }
    //console.log(this.camera.getTileVector(this.camera.position.clone().add(cursor)));
   // console.log(this.camera.position.clone().add(cursor));
  }

}