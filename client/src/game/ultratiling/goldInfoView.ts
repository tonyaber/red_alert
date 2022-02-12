import { Vector } from "../../../../common/vector";
import { CachedSprite } from './cachedSprite';

export class GoldInfoView extends CachedSprite{
  health: number;
  img: HTMLImageElement; 
  size: number;

  constructor(position: Vector, img: HTMLImageElement, size: number) {    
    super(size, size, position);
    this.img = img;
    this.size = size
  }

  update(): void {
    
    this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
   
    
    this.ctx.drawImage(this.img, 0, 0, this.size, this.size);
    
    this.onUpdate?.();
  }
}