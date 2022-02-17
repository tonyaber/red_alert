import { Vector } from "../../../../common/vector";
import { CachedSprite } from './cachedSprite';
import { UnitAnimation } from '../builds_and_units/directedAnimation';

export class UnitInfoView extends CachedSprite{
  health: number;
  name: string ;
  img: HTMLImageElement;
  playerId: string;
  select: boolean;
  animation:UnitAnimation;
  direction: number;
  selected:boolean= false;

  constructor(position: Vector, img: HTMLImageElement, name: string, health: number,  playerId: string) {    
    super(30, 50, position);
    this.img = img;
    this.name = name;
    this.health = health;
    this.playerId = playerId;
    this.animation = new UnitAnimation(new Vector(0, 0), 2);
  }

  update(): void {
    const topText = this.ctx.measureText('h').actualBoundingBoxAscent;
    this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#f00";
    //this.ctx.fillRect(0,0, this.canvas.width, this.canvas.height);
    //this.ctx.drawImage(this.img, 0, 0, 30, 30);
    this.animation.render(this.ctx, new Vector(-15, -30), 100);
    this.ctx.fillRect(0, 0, this.health, 5);
    //this.ctx.fillText('health: ' + this.health.toString(), 0, topText);
    if (this.selected) {
      this.ctx.fillText('Selected', 0, topText * 2);
    }
    
    //this.ctx.fillText(this.playerId, 0, topText * 3);
    
 //   this.onUpdate?.();
  }
}