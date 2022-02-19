import Control from "../../../common/control";
import { Camera } from "./ultratiling/camera";
import { IGameObjectData, IObject } from "./dto";
import { IVector, Vector } from '../../../common/vector';
import { RenderTicker } from './ultratiling/renderTicker';
import { GameMainRender } from './ultratiling/gameMainRenderer';
import red from './red.css'


export class Canvas extends Control{
  onGameMove: () => void;
  onClick: (position: Vector, name: string) => void;
  onObjectClick: (id: string, name: string, subType: string) => void;
  onChangePosition: (id: string, position: Vector) => void;
  onAttack: (id: string, targetId: string) => void;
  canvas: Control<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;
  ticker = new RenderTicker();
  renderer:GameMainRender;
  playerId: string;
  res: Record<string, HTMLImageElement>;
  private _resizeHandler: ()=>void;

  constructor(parentNode: HTMLElement, res:Record<string, HTMLImageElement>, id: string) {
    super(parentNode, 'div', red['game_field']);
    this.playerId = id;
    this.res = res;
    const camera = new Camera();
    
    this.canvas = new Control(this.node, 'canvas');
    this.canvas.node.width = 1200;
    this.canvas.node.height = 600;
    this.ctx = this.canvas.node.getContext('2d');

    this.canvas.node.onmousemove = (e)=>{
      const mv = new Vector(e.movementX, e.movementY).scale(0.5);
      const maxSpeed = 0.01;
      if (mv.abs()<maxSpeed){
        this.renderer.camera.velocity = mv;
      } else {
         this.renderer.camera.velocity = mv.normalize().scale(maxSpeed);
      }
     
      //this.renderer.setCameraPosition(new Vector(e.offsetX *20.5 -209, e.offsetY*20.5 -209));
      this.renderer.processMove(new Vector(e.offsetX, e.offsetY));
      this.renderer.handleMouseMove(new Vector(e.offsetX, e.offsetY));
    }

    this.canvas.node.onclick = (e: MouseEvent) => {
      this.renderer.handleClick(new Vector(e.offsetX, e.offsetY));
      // this.renderer.camera.scale = this.renderer.camera.scale - 0.2;
      // this.renderer.tilingLayer.updateCamera(this.renderer.camera.position, this.renderer.camera.getTileSize());
      // this.renderer.boundingLayer.updateCamera(this.renderer.camera.position, this.renderer.camera.getTileSize());
      // this.renderer.handleClick(this.renderer.camera.position, this.renderer.camera.getTileSize())
      // if (this.hoveredObjects === null) {
      //     this.onClick?.(this.renderer.camera.position.clone().add(new Vector(e.offsetX, e.offsetY)))
      // } else {
      //   this.onObjectClick(this.hoveredObjects.id, this.hoveredObjects.type);
      // }
    }

    this.canvas.node.oncontextmenu = (e) => {
      e.preventDefault();
    }
    this.canvas.node.onmousedown = (e: MouseEvent) => {
      this.renderer.handleMouseDown(new Vector(e.offsetX, e.offsetY));
    } 

    this.renderer = new GameMainRender(camera, this.canvas.node.width, this.canvas.node.height, res, this.playerId);
    this.ticker.onTick.add((delta)=>{
      this.render(this.ctx, delta);
    });
    this.ticker.startRender();
    this.renderer.setCameraPosition(new Vector(-200, -200));

    this.renderer.onAddBuild = (position, name)=>{
      this.onClick(position, name);
    }

    this.renderer.onObjectClick = (id, name, subType) => {
      this.onObjectClick(id, name, subType);
    }
    this.renderer.onChangePosition = (id, position)=>{
      this.onChangePosition(id, position)
    }

    this.renderer.onAttack = (id, idTarget) => {
      this.onAttack(id, idTarget);
    }

    this._resizeHandler = ()=>{
      this.autoSize();
    }
    window.addEventListener('resize', this._resizeHandler);
    this.autoSize();
  }

  updateObject(data:IGameObjectData){
    this.renderer.updateObject(data);
    //this.interactiveList.list.find(item=>item.id === data.objectId).updateObject(data.content)
  }

  deleteObject(data:IGameObjectData){
    this.renderer.deleteObject(data);
  }

  setPlannedBuild(object: IObject) {
    this.renderer.setPlannedBuild(object);
  }

  addObject(data: IGameObjectData) {
    //console.log(data)
    this.renderer.addObject(data);
    
   
    //const BuildConstructor = builds[data.type] || InteractiveObject;
    //const interactiveObject = new BuildConstructor(data);
  }

  addShot(data: { position: IVector, id: string }) {
    this.renderer.addShot(data);
  }
  addBullet(data: { position: IVector, id: string }) {
    this.renderer.addBullet(data);
  }

  render(ctx: CanvasRenderingContext2D, delta: number) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, this.canvas.node.width, this.canvas.node.height);
    this.renderer.tick(delta);
    this.renderer.render(ctx);
  }

  private autoSize(){
    this.canvas.node.width = this.node.clientWidth;
    this.canvas.node.height = this.node.clientHeight;
    this.renderer.resizeViewPort(this.canvas.node.width, this.canvas.node.height);
  }

  destroy(): void {
    window.removeEventListener('resize', this._resizeHandler);
    super.destroy();
  }

   setScrollDirection(direction:Vector, inertion:number){
    this.renderer.camera.velocity = direction;
    this.renderer.camera.inertion = inertion;
  }
}
