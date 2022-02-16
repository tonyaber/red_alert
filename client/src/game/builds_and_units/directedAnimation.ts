import {InteractiveObject} from './interactiveObject';
import {resourceLoader} from '../resources';
import Animation from '../animation';
import { Vector } from '../../../../common/vector';


export class DirectedAnimation{
  animation: Animation;
  images: HTMLImageElement[];
  position: Vector;
  direction: number;
 
  constructor(position:Vector, images:HTMLImageElement[], scale:number){
    this.position = position.clone();
    this.images = images;
    this.animation = new Animation(this.images[0], 7, scale);
    this.animation.start();
    this.animation.onFinish = () => {
      this.animation.start();
    }
  }

  setDirection(direction:number){
    this.direction = direction;
    this.animation.spritesheet = this.images[this.direction];
  }

  render(ctx:CanvasRenderingContext2D, camera:Vector, delta:number){
    this.animation.render(ctx, delta, this.position.clone().sub(camera));
  } 
}

export class UnitAnimation extends DirectedAnimation{
  constructor(position:Vector, scale:number = 1){
    const t = resourceLoader.textures;
    super(position, [
      t.soldier_left,
      t.soldier_left_top,
      t.soldier_top,
      t.soldier_right_top,
      t.soldier_right,
      t.soldier_right_bottom,
      t.soldier_bottom,
      t.soldier_left_bottom
    ], scale);
  }
}