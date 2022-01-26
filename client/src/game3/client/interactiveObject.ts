import { Vector } from '../../common/vector';
import { IGameObjectData } from './dto';
//import { GameObject } from './gameModel';
import { InteractiveList } from './interactiveList';

const interactiveList = new InteractiveList();

export class InteractiveObject{
  isHovered: boolean;
  onMouseMove: any;
  onMouseEnter: any;
  onMouseLeave: any;
  onClick: any;
  onDestroyed: () => void;
  getList: () => InteractiveList;
  //position: {x:number, y:number};
  //name:string;
  //type: string = 'interactive';
  id: string;
  playerId: string;
  position: Vector;
  type: string;
  primary: boolean;
  // gameObject:GameObject;
  // get position(){
  //   return new Vector(0,0);
  // }
  // set position(val:Vector){
    
  // }

  constructor(data: IGameObjectData) {
    this.position = data.content.position;
    this.id = data.objectId;
    this.playerId = data.content.playerId;
    this.type = data.type;
    this.primary = data.content.primary;
    
    interactiveList.add(this);
  }

  handleMove(tile:Vector, cursor:Vector){
    if (this.inShape(tile, cursor)){
      this.onMouseMove?.(tile);
      if (!this.isHovered) {
        this.isHovered = true;
        this.onMouseEnter?.(tile);
      }
    } else {
      if (this.isHovered) {
        this.isHovered = false;
        this.onMouseLeave?.(tile);
      }
    }  
  }

  handleClick(tile:Vector, cursor:Vector){
    if (this.inShape(tile, cursor)){
      this.onClick?.(tile, cursor);
    }
  }

 inShape(tile: Vector, cursor: Vector): boolean {
      let pos = cursor.clone().sub(new Vector(this.position.x, this.position.y));
    if (pos.abs()<15){
      return true;
    }
    return false;
  }

  render(ctx: CanvasRenderingContext2D, camera: Vector, ...props: any): void {
    const sz = 10;
    ctx.fillStyle = "#9999"
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(camera.x + this.position.x /*+ (55-10)/2*/, camera.y+ this.position.y /*+ (55-10)/2*/, sz, sz, 0, 0, Math.PI*2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.fillText(this.type, this.position.x + 20, this.position.y + 20);
    if (this.primary) {
      ctx.fillText("Primary", this.position.x + 20, this.position.y);
    }
    
  }

  getAction(hovered:InteractiveObject, mapTile?:number) {
    return "select";
  }

  getDamage(target: InteractiveObject) {
    return 10;    
  }
  
  damage(point: Vector, tile: Vector, unit: InteractiveObject) {
    
  }
}

export { interactiveList };