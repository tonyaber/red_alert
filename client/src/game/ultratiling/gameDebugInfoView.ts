import { interactiveList } from "../builds_and_units/interactiveObject";
import { UnitAnimation } from '../builds_and_units/directedAnimation';
import { Vector } from "../../../../common/vector";
export class GameDebugInfoView {
  fps: number = 60;
  //anim: UnitAnimation;

  constructor(){
    //this.anim =  new UnitAnimation(new Vector(0, 0));
  }

  tick(delta:number){
    const dv = 16;
    if (this.fps > 60) {
      this.fps = 60
    }
    this.fps = ((this.fps * (dv - 1)) + (1 / delta * 1000)) / dv;
  }

  render(ctx: CanvasRenderingContext2D){
    ctx.fillStyle = "#fff";
    ctx.fillText('canvas render', 0, 10);
    ctx.fillText('fps: ' + this.fps.toFixed(2), 0, 20);
    ctx.fillText('Interactive: ' + interactiveList.list.length.toString(), 0 , 30);
    //this.anim.render(ctx, new Vector(-100, -100), 16);
    //this.anim.setDirection(2);
  }
}