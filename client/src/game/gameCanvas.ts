import Control from '../common/control';
import { Vector } from '../common/vector';
import { GameModel } from "./gameModel";
import { InteractiveList } from './interactiveList';
import { interactiveList, InteractiveObject } from './interactiveObject';
export class GameCanvas extends Control {
  model: GameModel;
  updateHandler: () => void;
  onClick: (position: Vector) => void;
  
  ctx: CanvasRenderingContext2D;
  canvas: Control<HTMLCanvasElement>;
  interactiveList: InteractiveList;
  fps: number;
  hoveredObjects: InteractiveObject = null;
  onObjectClick: (id: string)=>void;

  constructor(parentNode: HTMLElement, model: GameModel) {
    super(parentNode);
    this.model = model;

    this.updateHandler = () => {
      //blablabla
    }
    this.model.onUpdateCanvas.add(this.updateHandler);
    this.canvas = new Control(this.node, 'canvas');
    this.canvas.node.width = 1000;
    this.canvas.node.height = 500;
    this.canvas.node.style.background = 'green';
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
        console.log('canvas-click', this.hoveredObjects)
        //this.hoveredObjects.gameObject.health--;
        //this.hoveredObjects.gameObject.onObjectUpdate();
        this.onObjectClick(this.hoveredObjects.id);
      }
     

    }
    let lastTime: number = null;
    this.fps = 60;
    const render = () => {
      requestAnimationFrame((timeStamp) => {
        if (!lastTime) {
          lastTime = timeStamp;
        }

        const delta = timeStamp - lastTime;
        const dv = 16;
        if (this.fps > 60) {
          this.fps = 60
        }
        this.fps = ((this.fps * (dv - 1)) + (1 / delta * 1000)) / dv;
        this.render(this.ctx, delta);
        lastTime = timeStamp;
        render();
      })
      
    }
    render();
  }

  renderMap(ctx: CanvasRenderingContext2D, canvasSize: any) {
    
  }

  destroy() {
    this.model.onUpdateCanvas.remove(this.updateHandler);
  
  }
  render(ctx: CanvasRenderingContext2D, delta: number) {
    ctx.fillStyle = "#000";
   
    ctx.fillRect(0, 0, this.canvas.node.width, this.canvas.node.height);
    
    this.interactiveList.list.forEach(it => {
      it.render(ctx,
        new Vector(0, 0),
        delta,
      );
    })
    
    ctx.fillStyle = "#fff";
    ctx.fillText('fps: ' + this.fps.toFixed(2), 0, 30);
  }
}