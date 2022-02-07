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

  update(){
    this.onUpdate();
  }

}

export class BuildingInfoView extends CachedSprite{
  health: number =0;
  name: string ='gfdf';
  isPrimary: boolean;
  img: HTMLImageElement;

  constructor(position: Vector, img: HTMLImageElement) {    
    super(200, 200, position);
    this.img = img;
  }

  update(): void {
    const topText = this.ctx.measureText('h').actualBoundingBoxAscent;
    this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#f00";
    
    this.ctx.drawImage(this.img, 0, 0, 200, 200);
    this.ctx.fillText('health: ' + this.health.toString(), 0, topText);
    this.ctx.fillText('name: ' + this.name, 0, topText*2);
    if (this.isPrimary){
      this.ctx.fillText('primary', 0, topText*3);
    }
    
    this.onUpdate?.();
  }
}