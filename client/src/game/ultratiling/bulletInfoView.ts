import { Vector } from "../../../../common/vector";
import { CachedSprite } from './cachedSprite';

export class BulletInfoView extends CachedSprite{
  img: HTMLImageElement;

  constructor(position: Vector, img: HTMLImageElement) {    
    super(30, 30, position);
    this.img = img;
  
  }

  update(): void {
    const topText = this.ctx.measureText('h').actualBoundingBoxAscent;
    this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#f00";
  
    this.ctx.drawImage(this.img, 0, 0, 30, 30);
    
    
    this.onUpdate?.();
  }
}