import {InteractiveObject} from './interactiveObject';
import { Camera } from '../ultratiling/camera';
import Animation from '../animation';
import { Vector } from '../../../../common/vector';
import { BoundingLayer } from '../ultratiling/boundingLayer';
import { ExplosionInfoView } from '../ultratiling/explosionInfoView';

export class Explosion extends InteractiveObject{
  animation: Animation;
  position: Vector;
  onDestroyed: () => void;
  
  constructor(infoLayer: BoundingLayer, res: Record<string, HTMLImageElement>, camera: Camera, position: Vector) {
    super()
    this.position =position;
    this.infoLayer = infoLayer;
  this.camera = camera;
    this.info = new ExplosionInfoView(this.position.clone(), res);
    this.info.onDestroy = () => {
      this.onDestroyed();
    }
    this.info.update();
    this.infoLayer.addObject(this.info);
  }
  
  inShaped(tile: Vector, cursor: Vector): boolean { 
    return false;
  }

  tick(delta: number) {
     this.infoLayer._clearTile(this.camera.getTileVector(this.camera.position), this.info, this.camera.getTileSize());
    this.info.update();
    this.infoLayer.updateObject(this.info)
  }
 

  // render(ctx:CanvasRenderingContext2D, camera:Vector, delta:number){
  //   this.animation.render(ctx, delta, this.position.clone().sub(camera));
  // } 

   destroy(): void {
    this.infoLayer._clearTile(this.camera.getTileVector(this.camera.position), this.info, this.camera.getTileSize());
    this.infoLayer.deleteObject(this.info);
    super.destroy()
  }
}