import { Vector } from "../../../../common/vector";

export class Camera{
  position: Vector;
  velocity: Vector = new Vector(0, 0);
  scale: number;
  baseTileSize: number = 5;
  onUpdatePosition: (position: Vector, lastPosition: Vector) => void;
  onUpdateTileSize: (tileSize: number, lastTileSize: number) => void;
  onUpdate: () => void;

  constructor(){
    this.position = new Vector(0, 0);
    this.scale = 10;
  }

  tick(delta:number){
    if (this.velocity.x === 0 && this.velocity.y === 0) {
      return;
    }

    const position = this.position.clone();
    position.add(this.velocity.clone().scale(delta));
    if (position.x < -100) {
      position.x = -100;
    }
    if (position.y < -100) {
      position.y = -100;
    }
    if (position.x > 100 * this.getTileSize() + 100 - 800) {
      position.x = 100 * this.getTileSize() + 100 - 800;
    }
    if (position.y > 100 * this.getTileSize() + 100 - 600) {
      position.y = 100 * this.getTileSize() + 100 - 600;
    }
    this.velocity.scale(0.95);
    if (this.velocity.abs()<0.1){
      this.velocity.scale(0);
    }

    this.setPosition(position);
  }

  setPosition(position: Vector) {
    const lastPosition = this.position;
    this.position = position;
    this.onUpdatePosition?.(position, lastPosition);
    this.onUpdate();
  }

  setScale(scale: number) {
    const lastTileSize = this.getTileSize();
    this.scale = scale;
    this.onUpdateTileSize(this.getTileSize(), lastTileSize);
    this.onUpdate();
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
