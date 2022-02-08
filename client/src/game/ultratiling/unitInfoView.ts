import { Vector } from "../../../../common/vector";
import { CachedSprite } from './cachedSprite';

export class UnitInfoView extends CachedSprite{
  health: number;
  name: string ;
  img: HTMLImageElement;
  playerId: string;
  select: boolean;

  constructor(position: Vector, img: HTMLImageElement, name: string, health: number,  playerId: string) {    
    super(30, 30, position);
    this.img = img;
    this.name = name;
    this.health = health;
    this.playerId = playerId;
  }

  update(): void {
    const topText = this.ctx.measureText('h').actualBoundingBoxAscent;
    this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#f00";
    
    this.ctx.drawImage(this.img, 0, 0, 30, 30);
    this.ctx.fillText('health: ' + this.health.toString(), 0, topText);
    this.ctx.fillText('name: ' + this.name, 0, topText * 2);
    this.ctx.fillText(this.playerId, 0, topText * 3);
    this.onUpdate?.();
  }
}