import { Vector } from "../../../../common/vector";

export class FastSprite{
  position:Vector;
  onUpdate: ()=>void;

  constructor(width: number, height: number, position:Vector){
    this.position = position.clone();
  }  
  render() {
    
  }
}