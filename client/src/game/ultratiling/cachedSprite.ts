import { Vector } from "../../../../common/vector";

export class CachedSprite{
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  position:Vector;
  onUpdate: ()=>void;

  constructor(width: number, height: number, position:Vector){
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d');
    this.position = position.clone();
  }  

  update(nextState:any){
    this.onUpdate();
  }

}