import { Vector } from "../../../../common/vector";
import { CachedSprite } from './cachedSprite';

export class BuildingInfoView extends CachedSprite{
  health: number;
  name: string ;
  isPrimary: boolean;
  img: HTMLImageElement;
  playerId: string;

  constructor(position: Vector, img: HTMLImageElement, name: string, health: number,  playerId: string, isPrimary: boolean) {    
    super(200, 200, position);
    this.img = img;
    this.name = name;
    this.health = health;
    this.playerId = playerId;
    this.isPrimary = isPrimary;
  }

  update(): void {
    const topText = this.ctx.measureText('h').actualBoundingBoxAscent;
    this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#f00";
    
    this.ctx.drawImage(this.img, 0, 0, 200, 200);
    this.ctx.fillRect(0, 0, this.health, 5);
    //this.ctx.fillText('health: ' + this.health.toString(), 0, topText);
    this.ctx.fillText('name: ' + this.name, 0, topText * 2);
    this.ctx.fillText(this.playerId, 0, topText * 3);
    
    if (this.isPrimary) {
      this.ctx.fillText('Primary', 0, topText * 4);
    }
    this.onUpdate?.();
  }
}