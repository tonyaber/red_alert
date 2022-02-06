import Control from "../../common/control";
import { IGameObjectData } from "./dto";
import { InteractiveObject,interactiveList } from "./interactiveObject";
import { InteractiveList } from "./interactiveList";
import { Vector } from '../../common/vector';
import Signal from "../../common/signal";

import {TilingLayer} from "./ultratiling/tileLayer";
import { GameObject } from "./ultratiling/gameObject";

class Camera{
  position: Vector;
  velocity: Vector;
  scale: number;
  baseTileSize:number = 5;

  constructor(){
    this.position = new Vector(0, 0);
    this.scale = 5;
  }

  tick(delta:number){
    this.position.add(this.velocity.scale(delta));
  }

  getTileSize(){
    return this.baseTileSize * this.scale;
  }
}

class RenderTicker{
  onTick: Signal<number> = new Signal();

  constructor(){

  }

  startRender(){
    let lastTime: number = null;
    const render = () => {
      requestAnimationFrame((timeStamp) => {
        if (!lastTime) {
          lastTime = timeStamp;
        }
        const delta = timeStamp - lastTime;
        this.onTick.emit(delta);
        lastTime = timeStamp;
        render();
      })
      
    }
    render();
  }
}

class GameDebugInfoView {
  fps: number = 60;

  constructor(){
    
  }

  tick(delta:number){
    const dv = 16;
    if (this.fps > 60) {
      this.fps = 60
    }
    this.fps = ((this.fps * (dv - 1)) + (1 / delta * 1000)) / dv;
  }

  render(ctx: CanvasRenderingContext2D){
    ctx.fillStyle = "#fff";
    ctx.fillText('canvas render', 0, 10);
    ctx.fillText('fps: ' + this.fps.toFixed(2), 0, 20);
  }
}

class GameMainRender{
  tilingLayer: TilingLayer; 
  camera: Camera;
  debugInfoView = new GameDebugInfoView();

  constructor(camera:Camera, width:number, height:number, res:Record<string, HTMLImageElement>){
    this.camera = camera;
    console.log(camera.getTileSize())
    const mp = 200;
    this.tilingLayer = new TilingLayer(mp, mp, camera.getTileSize(), camera.position);
    this.tilingLayer.registred = [
      null, res['grass']
    ]
    let newMap:Array<Array<number>> = new Array(mp).fill(0).map(it=> new Array(mp).fill(0));
    this.tilingLayer.update(this.camera.position, newMap);
  }

  tick(delta:number){
    this.debugInfoView.tick(delta);
    /*this.tilingLayer.update(this.camera.position, this.tilingLayer.map.map(it=>it.map(jt=>{
      return (Math.random()<0.005? 1-jt: jt);
    })))*/
    this.tilingLayer.updateCamera(this.camera.position, this.camera.getTileSize());
  }

  render(ctx: CanvasRenderingContext2D){
    //ctx.drawImage(this.tilingLayer.canvas, this.camera.position.x, this.camera.position.y);
    ctx.drawImage(this.tilingLayer.canvas1, 0, 0);
    this.debugInfoView.render(ctx);
  }

  setCameraPosition(position:Vector){
    this.camera.position = position;
    this.tilingLayer.updateCamera(this.camera.position, this.camera.getTileSize());
  }
}

export class Canvas extends Control{
  interactiveList: InteractiveList;

  onGameMove: () => void;
  onClick: (position: Vector) => void;
  onObjectClick: (id: string, name: string) => void;
  canvas: Control<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;
  hoveredObjects: InteractiveObject = null;

  //camera = new Camera();
  ticker = new RenderTicker();
  renderer:GameMainRender;
  objects: Array<GameObject> = [];

  constructor(parentNode: HTMLElement, res:Record<string, HTMLImageElement>) {
    super(parentNode);
    this.canvas = new Control(this.node, 'canvas');
    this.canvas.node.width = 800;
    this.canvas.node.height = 600;
    this.ctx = this.canvas.node.getContext('2d');
    this.interactiveList = interactiveList;

    this.canvas.node.onmousemove = (e)=>{
      //this.interactiveList.handleMove(new Vector(e.offsetX, e.offsetY), new Vector(e.offsetX, e.offsetY));
      this.renderer.setCameraPosition(new Vector(e.offsetX *20.5 -209, e.offsetY*20.5 -209));
      const moveCursor = new Vector(Math.floor((e.offsetX + camera.position.x) / camera.getTileSize()), Math.floor((e.offsetY + camera.position.y) / camera.getTileSize()))
      this.objects.forEach(obj=>obj.processMove(moveCursor));
      //this.renderer.camera.position = new Vector(e.offsetX -100, e.offsetY -100);
      //this.renderer.tilingLayer.updateCamera(this.renderer.camera.position, this.renderer.camera.getTileSize());
    }
    
    
    this.interactiveList.onChangeHovered = (lastTarget:InteractiveObject, currentTarget:InteractiveObject) => {
      this.hoveredObjects = currentTarget;
    }

 
    //this.interactiveList.add(obj);

    this.canvas.node.onclick = (e: MouseEvent) => {
      if (this.hoveredObjects === null) {
         this.onClick?.(new Vector(e.offsetX, e.offsetY))
      } else {
        this.onObjectClick(this.hoveredObjects.id, this.hoveredObjects.type);
      }
    }

    this.canvas.node.oncontextmenu = (e)=>{
      e.preventDefault();
    }
    this.canvas.node.onmousedown = (e: MouseEvent) => {

    } 

    const camera = new Camera();
    this.renderer = new GameMainRender(camera, this.canvas.node.width, this.canvas.node.height, res);
    this.ticker.onTick.add((delta)=>{
      this.render(this.ctx, delta);
    });
    this.ticker.startRender();
    
    for (let i =0; i<1000; i++){
      //const obj = new GameObject(this.renderer.tilingLayer, res, new Vector(0, 0));
      const obj = new GameObject(this.renderer.tilingLayer, res, new Vector(Math.floor(Math.random()*196), Math.floor(Math.random()*196)));
      this.objects.push(obj);
    }
    //this.renderer.setCameraPosition(new Vector( -209, -209));
    //this.renderer.tilingLayer.updateCamera(this.renderer.camera.position, this.renderer.camera.getTileSize());
    
  }

  updateObject(data:IGameObjectData){
    this.interactiveList.list.find(item=>item.id === data.objectId).updateObject(data.content)
  }

  deleteObject(data:IGameObjectData){

  }

  addObject(data: IGameObjectData) {
    const interactiveObject = new InteractiveObject(data);
  }

  render(ctx: CanvasRenderingContext2D, delta: number) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, this.canvas.node.width, this.canvas.node.height);
    this.renderer.tick(delta);
    this.renderer.render(ctx);
  }
}
