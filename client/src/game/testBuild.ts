import { Vector } from "../common/vector";
import { InteractiveObject } from "./interactiveObject";

export class TestBuild extends InteractiveObject{
  constructor() {
    super();
  
  }

  inShape(tile: Vector, cursor: Vector): boolean {
      let pos = cursor.clone().sub(new Vector(this.position.x, this.position.y));
    if (pos.abs()<15){
      return true;
    }
    return false;
  }

  render(ctx: CanvasRenderingContext2D, camera: Vector, ...props: any): void {
    const sz = 10;
    ctx.fillStyle = "#9999"
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(camera.x + this.position.x /*+ (55-10)/2*/, camera.y+ this.position.y /*+ (55-10)/2*/, sz, sz, 0, 0, Math.PI*2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }


}