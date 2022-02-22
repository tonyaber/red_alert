import { Vector } from "../../../../common/vector";

export class Sprite {
  img: HTMLImageElement;
  private _position: Vector;
  get position(){
    return this._position;
  }
  set position(value){
    this._position = value;
    this.onUpdate?.();
  }
  onUpdate:()=>void;

  constructor(img:HTMLImageElement){
    this.img = img;
    this.position = new Vector(0, 0);
  }

  render(ctx:CanvasRenderingContext2D){
    ctx.drawImage(this.img, this._position.x, this._position.y);
  }
}


