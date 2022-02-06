import { Vector } from "../../../common/vector";

export class Camera{
  position: Vector;
  velocity: Vector = new Vector(0, 0);
  scale: number;
  baseTileSize:number = 5;

  constructor(){
    this.position = new Vector(0, 0);
    this.scale = 10;
  }

  tick(delta:number){
    this.position.add(this.velocity.clone().scale(delta));
    this.velocity.scale(0.95);
    if (this.velocity.abs()<0.1){
      this.velocity.scale(0);
    }
  }

  getTileSize(){
    return Math.floor(this.baseTileSize * this.scale);
  }
}
