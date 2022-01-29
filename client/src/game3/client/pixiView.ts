import Control from "../../common/control";
import { IGameObjectData } from "./dto";
import { InteractiveObject,interactiveList } from "./interactiveObject";
import { InteractiveList } from "./interactiveList";
import { Vector } from '../../common/vector';
import img from '../client/assets/tree2.png';
//import * as PIXITYPE from '../../../node_modules/pixi.js';
import * as PIXI from 'pixi.js';

//PIXITYPE.Application
//const PIXI = _PIXI;
//const Application = PIXI.Application as PIXITYPE.Application;

export class Canvas extends Control{
  //interactiveList: Record<string, InteractiveObject> = {}
  interactiveList: InteractiveList;
  
  onGameMove: () => void;
  onClick: (position: Vector) => void;
  onObjectClick: (id: string, name: string) => void;
  canvas: Control<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;
  hoveredObjects: InteractiveObject = null;
  fps: number;


  constructor(parentNode: HTMLElement) {
    super(parentNode);

    this.canvas = new Control(this.node, 'canvas');
    this.canvas.node.width = 500;
    this.canvas.node.height = 500;
    this.canvas.node.style.background = 'green';

    // Create the application helper and add its render target to the page
    let app = new PIXI.Application({ 
      width: 800, 
      height: 600,
      view: this.canvas.node
    });

    // Create the sprite and add it to the stage
    const sprites:Array<PIXI.Sprite> =[];
    for (let i=0; i<1000; i++){
      let sprite = PIXI.Sprite.from(img);
      app.stage.addChild(sprite);
      sprites.push(sprite);
    }

    const fps = new PIXI.Text('', {fill:"#fff"});
    app.stage.addChild(fps);

    this.fps= 60;
    // Add a ticker callback to move the sprite back and forth
    let elapsed = 0.0;
    app.ticker.add((delta:number) => {

      const dv = 16;
      if (Number.isNaN(this.fps)) {
        this.fps = 60
      }
      this.fps = ((this.fps * (dv - 1)) + (1 / delta * 1000)) / dv;
      fps.text = (this.fps).toString();

      elapsed += delta;
      sprites.forEach((sprite, i)=>{
        sprite.x = 100.0 + Math.cos(elapsed/50.0 - i) * 300.0;
      })
      
    });

    this.ctx = this.canvas.node.getContext('2d');
    this.interactiveList = interactiveList;
    this.canvas.node.onmousemove = (e)=>{
      this.interactiveList.handleMove(new Vector(e.offsetX, e.offsetY), new Vector(e.offsetX, e.offsetY))
    }
    
    
    this.interactiveList.onChangeHovered = (lastTarget:InteractiveObject, currentTarget:InteractiveObject) => {
      this.hoveredObjects = currentTarget;
    }

    this.canvas.node.onclick = (e: MouseEvent) => {
      if (this.hoveredObjects === null) {
         this.onClick?.(new Vector(e.offsetX, e.offsetY))
      } else {
        this.onObjectClick(this.hoveredObjects.id, this.hoveredObjects.type);
      }
  
    }
  }

  updateObject(data:IGameObjectData){
    this.interactiveList.list.find(item=>item.id === data.objectId).updateObject(data.content)
  }

  deleteObject(data:IGameObjectData){

  }

  addObject(data: IGameObjectData) {
    const interactiveObject = new InteractiveObject(data);
  }

}
