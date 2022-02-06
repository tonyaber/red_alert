import { Vector } from "../../../common/vector";
import { Camera } from "./camera";
import { GameDebugInfoView } from "./gameDebugInfoView";
import { GameObject } from "./gameObject";
import { TilingLayer } from "./tileLayer";

export class GameMainRender{
  tilingLayer: TilingLayer; 
  camera: Camera;
  debugInfoView = new GameDebugInfoView();
  objects: Array<GameObject> = [];

  constructor(camera:Camera, width:number, height:number, res:Record<string, HTMLImageElement>){
    this.camera = camera;
    console.log(camera.getTileSize())
    const mp = 100;
    this.tilingLayer = new TilingLayer(mp, mp, camera.getTileSize(), camera.position);
    this.tilingLayer.registred = [
      null, res['grass']
    ]
    let newMap:Array<Array<number>> = new Array(mp).fill(0).map(it=> new Array(mp).fill(0));

    this.tilingLayer.update(this.camera.position, newMap);

    for (let i =0; i<1000; i++){
      //const obj = new GameObject(this.renderer.tilingLayer, res, new Vector(0, 0));
      const obj = new GameObject(this.tilingLayer, res, new Vector(Math.floor(Math.random()*(mp-4)), Math.floor(Math.random()*(mp -4))));
      this.objects.push(obj);
    }
  }

  tick(delta:number){
    this.debugInfoView.tick(delta);
    /*this.tilingLayer.update(this.camera.position, this.tilingLayer.map.map(it=>it.map(jt=>{
      return (Math.random()<0.005? 1-jt: jt);
    })))*/
    this.tilingLayer.updateCamera(this.camera.position, this.camera.getTileSize());
  }

  render(ctx: CanvasRenderingContext2D){
    //ctx.drawImage(this.tilingLayer.canvas, this.camera.position.x, this.camera.position.y);
    ctx.drawImage(this.tilingLayer.canvas1, 0, 0);
    this.debugInfoView.render(ctx);
  }

  setCameraPosition(position:Vector){
    this.camera.position = position;
    this.tilingLayer.updateCamera(this.camera.position, this.camera.getTileSize());
  }

  processMove(cursor: Vector){
    const moveCursor = new Vector(
      Math.floor((cursor.x + this.camera.position.x) / this.camera.getTileSize()), 
      Math.floor((cursor.y + this.camera.position.y) / this.camera.getTileSize())
    );
    this.objects.forEach(obj=>obj.processMove(moveCursor));
  }
}