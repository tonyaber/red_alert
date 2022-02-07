import { Vector } from "../../../../common/vector";

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
    if (this.position.x < -100) {
      this.position.x = -100;
    }
    if (this.position.y < -100) {
      this.position.y = -100;
    }
    if (this.position.x > 100 * this.getTileSize() + 100 -800) {
      this.position.x = 100 * this.getTileSize() + 100 -800;
    }
    if (this.position.y > 100 * this.getTileSize() + 100 -600) {
      this.position.y = 100 * this.getTileSize() + 100-600;
    }
    this.velocity.scale(0.95);
    if (this.velocity.abs()<0.1){
      this.velocity.scale(0);
    }
  }

  
  getTileVector(position:Vector){
    const tileCamera = new Vector(
      Math.floor(position.x / this.getTileSize()),
      Math.floor(position.y / this.getTileSize())
    );  
    return tileCamera;
  }

  getTileSize(){
    return Math.floor(this.baseTileSize * this.scale);
  }
}
