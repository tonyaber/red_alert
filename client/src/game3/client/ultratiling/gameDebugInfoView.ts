export class GameDebugInfoView {
  fps: number = 60;

  constructor(){
    
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
  }
}