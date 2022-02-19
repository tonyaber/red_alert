import {InteractiveObject} from './interactiveObject';
import {resourceLoader} from '../resources';
import Animation from '../animation';
import { Vector } from '../../../../common/vector';


export class Explosion extends InteractiveObject{
  animation: Animation;
  position: Vector;
 
  
  constructor(position:Vector){
    super()
    this.position = position.clone();
    this.animation = new Animation(resourceLoader.textures['explosion'], 6, 0.5);
    this.animation.start();
    this.animation.onFinish = () => {
      this.onDestroyed();
    }
   

  }
  
  inShape(tile: Vector, cursor: Vector): boolean { 
    return false;
  }

  render(ctx:CanvasRenderingContext2D, camera:Vector, delta:number){
    this.animation.render(ctx, delta, this.position.clone().sub(camera));
  } 
}