import Control from '../common/control';
import { GameModel } from "./gameModel";

export class GameCanvas extends Control{
  model: GameModel;
  updateHandler: () => void;
  
  ctx: CanvasRenderingContext2D;
  canvas: Control<HTMLCanvasElement>;

  constructor(parentNode: HTMLElement,model: GameModel) {
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
    
  }

  renderMap(ctx: CanvasRenderingContext2D, canvasSize: any) {
    
  }

  destroy() {
    this.model.onUpdateCanvas.remove(this.updateHandler);
  
  }
}