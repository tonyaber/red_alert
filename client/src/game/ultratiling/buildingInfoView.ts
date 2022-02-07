import { Vector } from "../../../../common/vector";
import { CachedSprite } from './cachedSprite';

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