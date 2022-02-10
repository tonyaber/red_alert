import { Vector } from '../../../../common/vector';
import { IGameObjectContent } from '../dto';
//import { IGameObjectContent } from '../dto';
import { InteractiveList } from '../interactiveList';
// import { IGameObjectData, IGameObjectContent } from '../dto';
// import { BoundingLayer } from '../ultratiling/boundingLayer';
// import { BuildingInfoView } from '../ultratiling/buildingInfoView';
// import { TilingLayer } from '../ultratiling/tileLayer';
//import { TileObject } from '../ultratiling/tileObject';

const interactiveList = new InteractiveList();

export class InteractiveObject{
  onMouseMove: (tile:Vector)=>void;
  onMouseEnter: (tile:Vector)=>void;
  onMouseLeave: (tile:Vector)=>void;
  onClick: (tile:Vector, cursor:Vector)=>void;
  onDestroyed: () => void;

  id: string;
  name:string;
  subType:string;

  get playerId(){
    return this._gameData.playerId;
  }

  get primary(){
    return this._gameData.primary;
  }

  private _selected:boolean;
  get selected(){
    return this._selected;
  }
  set selected(value:boolean){
    if (this._selected != value){
      this._selected = value;
      this.update();
    }
  }

  //real hovered status
  private _hovered:boolean;
  get hovered(){
    return this._hovered;
  }
  set hovered(value:boolean){
    if (this._hovered != value){
      this._hovered = value;
      this.update();
    }
  }

  protected _gameData:IGameObjectContent;
  set gameData(value:IGameObjectContent){
    //maybe use last data to correct update
    this._gameData = value;
    this.update();
  }

  //for interactive list overlap check
  private isHovered: boolean = false;

  constructor(){
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
    if (this.inShape(tile, cursor)) {
      this.onClick?.(tile, cursor);
    }
  }

  //LIFECYCLE METHOD, use it for override!
  protected inShape(tile: Vector, cursor: Vector): boolean {
    return false;
  }

  //LIFECYCLE METHOD, use it for override!
  protected update(){
    //this.tiles.forEach(it=>it.update());
  }

  //LIFECYCLE METHOD, use it for override!
  protected destroy(){

  }
//   isHovered: boolean;
//   onMouseMove: any;
//   onMouseEnter: any;
//   onMouseLeave: any;
//   onClick: any;
//   onDestroyed: () => void;
//   getList: () => InteractiveList;
//   id: string;
//   playerId: string;
//   position: Vector;
//   type: string;
//   primary: boolean;
//   selected: boolean;
//   color: string;
//   subType: string;

//   constructor() {
//     interactiveList.add(this);
//   }

//   updateObject(data: IGameObjectContent) {

//   }

//   handleMove(tile:Vector, cursor:Vector){
//     if (this.inShape(tile, cursor)){
//       this.onMouseMove?.(tile);
//       if (!this.isHovered) {
//         this.isHovered = true;
//         this.onMouseEnter?.(tile);
//       }
//     } else {
//       if (this.isHovered) {
//         this.isHovered = false;
//         this.onMouseLeave?.(tile);
//       }
//     }  
//   }

//   handleClick(tile:Vector, cursor:Vector){
//     if (this.inShape(tile, cursor)){
//       this.onClick?.(tile, cursor);
//     }
//   }

//  inShape(tile: Vector, cursor: Vector): boolean {
//       let pos = cursor.clone().sub(new Vector(this.position.x, this.position.y));
//     if (pos.abs()<15){
//       return true;
//     }
//     return false;
//   }

//   render(ctx: CanvasRenderingContext2D, camera: Vector, ...props: any): void {
   
//   }

//   getAction(hovered:InteractiveObject, mapTile?:number) {
//     return "select";
//   }

//   getDamage(target: InteractiveObject) {
//     return 10;    
//   }
  
//   damage(point: Vector, tile: Vector, unit: InteractiveObject) {
    
//   }
}

export { interactiveList };