import Control from '../../common/control';
import tree from '../../../assets/tree2.png';
export class TestView extends Control{
  canvas: Control<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;
  fps: number;
  image: any;
  constructor(parentNode: HTMLElement) {
    super(parentNode);
    this.canvas = new Control(this.node, 'canvas');
    this.canvas.node.width = 1400;
    this.canvas.node.height = 700;
    this.ctx = this.canvas.node.getContext('2d');
   

    this.image = new Image()
    this.image.src = tree;
    this.image.onload = () => {
       this.startRender();
    }
  }
  startRender(){
    let lastTime: number = null;
    this.fps = 60;
    const render = () => {
      requestAnimationFrame((timeStamp) => {
        if (!lastTime) {
          lastTime = timeStamp;
        }

        const delta = timeStamp - lastTime;
        const dv = 16;
        if (this.fps > 60) {
          this.fps = 60
        }
        this.fps = ((this.fps * (dv - 1)) + (1 / delta * 1000)) / dv;
        this.render(this.ctx, delta);
        lastTime = timeStamp;
        render();
      })
      
    }
    render();
  }

  render(ctx: CanvasRenderingContext2D, delta: number) {
    ctx.fillStyle = "#000";
   
    ctx.fillRect(0, 0, this.canvas.node.width, this.canvas.node.height);
    for (let i = 0; i < 500; i++){
      
      const sz = 10;
      ctx.fillStyle = '#900';
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 1;
      // ctx.beginPath();
      const position = {
        x: Math.floor(Math.random() * 1400),
        y:  Math.floor(Math.random() * 700)
      }

      ctx.drawImage(this.image, position.x, position.y);
      // ctx.ellipse( position.x , position.y , sz, sz, 0, 0, Math.PI*2);
      // ctx.closePath();
      //ctx.fillText('TTT', position.x, position.y);
      // ctx.fill();
      // ctx.stroke();
    }
    
    // this.interactiveList.list.forEach(it => {
    //   it.render(ctx,
    //     new Vector(0, 0),
    //     delta,
    //   );
    // })
    
    ctx.fillStyle = "#fff";
    ctx.fillText('fps: ' + this.fps.toFixed(2), 0, 30);
  }
}