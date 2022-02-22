import {Vector, IVector} from "../../../../common/vector";
//import { onLine } from "./lineUtils";

export class AbstractBullet {
  target: Vector;
  position: Vector;
  speed: number = 1;
  onTarget: (id: string) => void;
  isDestroyed: boolean = false;
  onMoveBullet: (position: Vector, id: string)=>void;
  id: string;

  constructor(target: Vector, position: Vector, id: string) {
    this.target = target;
    this.position = position;
    this.id = id;
  }

  step(delta: number) {
    if (this.isDestroyed) return;
    
    const next = this.position.clone().add(this.position.clone().sub(this.target).normalize().scale(-this.speed * delta*0.005));
     //console.log('BULLET', next)
    // console.log('bullet', onLine(this.target, this.position, next))
    // console.log(this.position, this.target, next)
    this.onMoveBullet(next, this.id);
    if (onLine(this.target, this.position, next)) {
      this.onTarget?.(this.id);
      this.isDestroyed = true;
    } else {
      this.position = next;
    }
  }
  // render(ctx:CanvasRenderingContext2D, camera:Vector){
  //   if (this.isDestroyed) return;

  //   const sz = 5;
  //   ctx.fillStyle = "#0ff";
  //   ctx.strokeStyle = "#000";
  //   ctx.lineWidth = 1;
  //   ctx.beginPath();
  //   ctx.ellipse(camera.x + this.position.x + sz/2, camera.y + this.position.y + sz/2, sz, sz, 0, 0, Math.PI*2);
  //   ctx.closePath();
  //   ctx.fill();
  //   ctx.stroke();
  //}
}
export function onLine(v:Vector, vs:Vector, ve:Vector){
  const dline = vs.clone().sub(ve).abs();
  const dve = v.clone().sub(ve).abs();
  const dvs = v.clone().sub(vs).abs();
  return (dve + dvs) <= dline + 0.00001;
}