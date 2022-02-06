import { Vector } from "../../../common/vector";

export class Camera{
  position: Vector;
  velocity: Vector;
  scale: number;
  baseTileSize:number = 5;

  constructor(){
    this.position = new Vector(0, 0);
    this.scale = 10;
  }

  tick(delta:number){
    this.position.add(this.velocity.scale(delta));
  }

  getTileSize(){
    return Math.floor(this.baseTileSize * this.scale);
  }
}
