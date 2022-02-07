import { Vector } from "../../../../common/vector";

export class TileObject{
  private position:Vector;
  private lastCursor: Vector;
  private isHovered: boolean = false;

  public onMouseEnter: ()=>void;
  public onMouseLeave: ()=>void;
  public onUpdate: ()=>void;

  private _tileType:number;
  get tileType(){
    return this._tileType;
  }
  set tileType(value:number){
    this._tileType = value;
    this.onUpdate();
  }

  constructor(tileType:number, tilePosition: Vector){
    this._tileType = tileType;
    this.position = tilePosition.clone();
  }

  inShape(cursor:Vector){
    return (cursor.x == this.position.x && cursor.y == this.position.y);
  }

  processMove(cursor:Vector){
    if (this.lastCursor && cursor.x == this.lastCursor.x && cursor.y == this.lastCursor.y){
      return;
    }
    if (!this.isHovered && this.inShape(cursor)){
      this.isHovered = true;
      this.onMouseEnter?.();
    } else if(this.isHovered && !this.inShape(cursor)){
      this.isHovered = false;
      this.onMouseLeave?.();
    }
    this.lastCursor = cursor.clone();
  }
}
