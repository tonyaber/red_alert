import {Vector} from '../common/vector';
import { GameObject } from './gameModel';
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
  position: Vector;
  gameObject:GameObject;
  // get position(){
  //   return new Vector(0,0);
  // }
  // set position(val:Vector){
    
  // }

  constructor() {
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

  inShape(tile:Vector, cursor:Vector){
    return false;
  }

  render(ctx:CanvasRenderingContext2D, camera:Vector, ...props:any){
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