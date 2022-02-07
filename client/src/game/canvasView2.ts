import Control from "../../../common/control";
import { IGameObjectData } from "./dto";
import { Vector } from '../../../common/vector';
import { Camera } from "./ultratiling/camera";
import { RenderTicker } from './ultratiling/renderTicker';
import { GameMainRender } from './ultratiling/gameMainRenderer';


export class Canvas extends Control{
  onGameMove: () => void;
  onClick: (position: Vector) => void;
  onObjectClick: (id: string, name: string) => void;
  canvas: Control<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;
  ticker = new RenderTicker();
  renderer:GameMainRender;
  playerId: string;
  res: Record<string, HTMLImageElement>;

  constructor(parentNode: HTMLElement, res:Record<string, HTMLImageElement>, id: string) {
    super(parentNode);
    this.playerId = id;
    this.res = res;
    this.canvas = new Control(this.node, 'canvas');
    this.canvas.node.width = 800;
    this.canvas.node.height = 600;
    this.ctx = this.canvas.node.getContext('2d');

    this.canvas.node.onmousemove = (e)=>{
      const mv = new Vector(e.movementX, e.movementY).scale(0.5);
      const maxSpeed = 10;
      if (mv.abs()<maxSpeed){
        this.renderer.camera.velocity = mv;
      } else {
         this.renderer.camera.velocity = mv.normalize().scale(maxSpeed);
      }
      //this.renderer.setCameraPosition(new Vector(e.offsetX *20.5 -209, e.offsetY*20.5 -209));
      this.renderer.processMove(new Vector(e.offsetX, e.offsetY));
    }

    this.canvas.node.onclick = (e: MouseEvent) => {
      this.renderer.camera.scale = this.renderer.camera.scale - 0.2;
      this.renderer.tilingLayer.updateCamera(this.renderer.camera.position, this.renderer.camera.getTileSize());
      this.renderer.boundingLayer.updateCamera(this.renderer.camera.position, this.renderer.camera.getTileSize());
     // if (this.hoveredObjects === null) {
         this.onClick?.(this.renderer.camera.position.clone().add(new Vector(e.offsetX, e.offsetY)))
      //} else {
       // this.onObjectClick(this.hoveredObjects.id, this.hoveredObjects.type);
      //}
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
    this.renderer.setCameraPosition(new Vector(-200, -200));
  }

  updateObject(data:IGameObjectData){
    //this.interactiveList.list.find(item=>item.id === data.objectId).updateObject(data.content)
  }

  deleteObject(data:IGameObjectData){

  }

  addObject(data: IGameObjectData) {
    console.log(data)
    this.renderer.addObject(data);
    
   
    //const BuildConstructor = builds[data.type] || InteractiveObject;
    //const interactiveObject = new BuildConstructor(data);
  }

  render(ctx: CanvasRenderingContext2D, delta: number) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, this.canvas.node.width, this.canvas.node.height);
    this.renderer.tick(delta);
    this.renderer.render(ctx);
  }
}
