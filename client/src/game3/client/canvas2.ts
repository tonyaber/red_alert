import Control from "../../common/control";
import { Vector } from "../../common/vector";

class CanvasView extends Control{
  private ctx: CanvasRenderingContext2D;

  constructor(parentNode:HTMLElement){
    super(parentNode);
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    this.node.appendChild(canvas);
    this.ctx = canvas.getContext('2d');
  }

  autoSize(){

  }
}

class TilingLayer{
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  map: Array<Array<number>>;
  registred: Array<CanvasImageSource> = [];
  tileSize: number;

  constructor(width: number, height: number, tileSize:number){
    this.tileSize = tileSize;
    this.canvas = document.createElement('canvas');
    this.canvas.width = width*tileSize;
    this.canvas.height = height*tileSize;
    this.ctx = this.canvas.getContext('2d');
    let newMap:Array<Array<number>> = new Array(width).fill(0).map(it=> new Array(width).fill(0));
    this.map = newMap;
    //this.update(newMap);
  }

  update(map:Array<Array<number>>){
    map.forEach((it,i)=>it.forEach((jt, j)=>{
      if (this.map[i][j] != map[i][j]){
        this.map[i][j] = map[i][j];
        const graphic = this.registred[map[i][j]];
        this.ctx.clearRect(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize);
        if (graphic){
          this.ctx.drawImage(graphic, j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize);
        }
      }
    }))
  }

  updateTile(position:Vector, value: number){
    const {x:tx, y:ty} = position;
    if (this.map[ty][tx] != value){
      this.map[ty][tx] = value;
      const graphic = this.registred[value];
      this.ctx.clearRect(tx*this.tileSize, ty*this.tileSize, this.tileSize, this.tileSize);
      if (graphic){
        this.ctx.drawImage(graphic, tx*this.tileSize, ty*this.tileSize, this.tileSize, this.tileSize);
      }
    }
  }
}

class TileObject{
  tiling: TilingLayer;
  position:Vector;
  tileType:number;
  lastCursor: Vector = new Vector(0,0);
  isHovered: boolean = false;
  onMouseEnter: ()=>void;
  onMouseLeave: ()=>void;

  constructor(tileType:number){
    this.tileType = tileType;
  }

  inShape(cursor:Vector){
    this.lastCursor = cursor.clone();
    return (cursor.x == this.position.x && cursor.y == this.position.y);
  }

  processMove(cursor:Vector){
    if (cursor.x == this.lastCursor.x && cursor.y == this.lastCursor.y){
      return;
    }
    if (!this.isHovered && this.inShape(cursor)){
      this.isHovered = true;
      this.onMouseEnter?.();
    } else if(this.isHovered && !this.inShape(cursor)){
      this.isHovered = false;
      this.onMouseLeave?.();
    } /*else if (this.inShape(cursor)){
      this.onMouseMove();
    }*/
  }

  update(){
    this.tiling.updateTile(this.position, this.tileType);
  }
}

class GameObjectView{
  constructor(){

  }

  update(){
    
  }
}


class Renderer{
  constructor(){

  }
}

class RenderLayers{

}
