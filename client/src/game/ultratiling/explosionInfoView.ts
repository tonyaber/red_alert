import { Vector } from "../../../../common/vector";
import { CachedSprite } from './cachedSprite';
import  Animation from '../animation';

export class ExplosionInfoView extends CachedSprite{
  animation:Animation;
  direction: number;
  onDestroy: () => void;

  constructor(position: Vector, res: Record<string, HTMLImageElement>) {    
    super(130, 130, position);
    this.position = position;
    this.animation = new Animation(res['explosion'], 6, 2);
    this.animation.start();
    this.animation.onFinish = () => {
      this.onDestroy();
    }  
  }

  update(): void {
    console.log(this.position)
    this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#f00";
    this.ctx.fillRect(0,0, 100, 100);
    this.animation.render(this.ctx,100, new Vector(0,0));
    
  }
}