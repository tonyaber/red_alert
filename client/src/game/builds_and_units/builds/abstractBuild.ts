import { Vector } from '../../../../../common/vector';
import { IGameObjectContent, IGameObjectData } from '../../dto';
import { BoundingLayer } from '../../ultratiling/boundingLayer';
import { BuildingInfoView } from '../../ultratiling/buildingInfoView';
import { Camera } from '../../ultratiling/camera';
import { TilingLayer } from '../../ultratiling/tileLayer';
import { TileObject } from '../../ultratiling/tileObject';
import { InteractiveObject } from '../interactiveObject';

export class AbstractBuild extends InteractiveObject{
  tiles: Array<TileObject> =[];
  //isHovered: boolean = false;
  //hovBalance: number = 0;
  //subType: string = 'build';
  id: string;
  //playerId: string;
  position: Vector;
  //name: string;
  //primary: boolean = false;
  health: number = 100;
  info: BuildingInfoView;
  infoLayer: BoundingLayer;

  constructor(layer:TilingLayer, infoLayer:BoundingLayer, res:Record<string, HTMLImageElement>, camera: Camera, data: IGameObjectData){
    super();
    this.id = data.objectId;
    this.name = data.type;

    const tileMap = [
      [0,1,1,0],
      [0,1,1,0],
      [1,1,1,1],
      [1,1,1,0],
    ];
    const pos = camera.getTileVector(data.content.position)

    //use info layer    
    this.infoLayer = infoLayer;
    this.info = new BuildingInfoView(pos.clone(), res);  
    this.info.onUpdate = ()=>{
      this.infoLayer.updateObject(this.info);
    }
    this.infoLayer.addObject(this.info);
    
    //use tile layer
    tileMap.forEach((it,i)=>it.forEach((jt, j)=>{
      const tilePos = pos.clone().add(new Vector(j, i));
      if (!tileMap[i][j]){
        return;
      }
      const tile = new TileObject(1, tilePos);
      tile.onUpdate = ()=>{
        layer.updateCacheTile(layer.camera, tilePos.x, tilePos.y, tile.tileType);
      }
      tile.onUpdate();
      
      this.tiles.push(tile);
    }));

    //update all layers
    //this.updateObject(data.content);
  }

  //processMove(cursor:Vector){
    //console.log(cursor);
   /* let lastBalance = this.hovBalance;
    this.tiles.forEach(it=>it.processMove(cursor));
    if (lastBalance !==this.hovBalance){
      if (this.hovBalance == 0){
        this.tiles.forEach(it1=>it1.tileType = 1);
      } else if (this.hovBalance == 1){
        this.tiles.forEach(it1=>it1.tileType = 0);
      }
    }*/
  //}

  inShape(tile: Vector, cursor: Vector): boolean {
   // let pos = tile.clone().sub(new Vector(this.position.x, this.position.y));
    if (this.tiles.find(it => it.inShape(tile))) {
      return true;
    }
    return false;
  }
  
  private updateObject(data: IGameObjectContent) {
    if (!data) return;
    this.position = data.position;
    //this.playerId = data.playerId;
    //this.primary = data.primary;
    //this.position = data.position;
    //this.playerId = data.playerId;
    //this.primary = data.primary;
    
    const infoState = {
      name: this.name,
      health: this.health,
      playerId: this.playerId,
      primary: this.primary
    };
    this.info.update(infoState);
  }

  update(){
    if (this.hovered){
      this.tiles.forEach(it1=>it1.tileType = 1);
    } else {
      this.tiles.forEach(it1=>it1.tileType = 0);
    }
    this.updateObject(this._gameData);
    //this.tiles.forEach(it=>it.update());
  }
  // subType: string = 'build';
  // id: string;
  // playerId: string;
  // position: Vector;
  // type: string;
  // primary: boolean;
  // constructor(data: IGameObjectData) {
  //   super();
  //   this.id = data.objectId;
  //   this.type = data.type;
  //   this.updateObject(data.content)
  //   const colors = ['#f00', '#ff0', '#00f', '#0f0', '#ffa500'];
  //   this.color = this.playerId.includes('bot') ? colors[Math.floor(Math.random()*5)] : '#999';
  // }

  // updateObject(data: IGameObjectContent) {
  //   this.position = data.position;
  //   this.playerId = data.playerId;
  //   this.primary = data.primary;
  // }
  //  inShape(tile: Vector, cursor: Vector): boolean {
  //     let pos = cursor.clone().sub(new Vector(this.position.x, this.position.y));
  //   if (pos.abs()<15){
  //     return true;
  //   }
  //   return false;
  //  }
  
  // render(ctx: CanvasRenderingContext2D, camera: Vector, playerId: string, type: string, primary: boolean): void {
  //   const sz = 10;
  //   ctx.fillStyle = this.color;
  //   ctx.strokeStyle = "#000";
  //   ctx.lineWidth = 1;
  //   ctx.beginPath();
  //   ctx.ellipse(camera.x + this.position.x /*+ (55-10)/2*/, camera.y+ this.position.y /*+ (55-10)/2*/, sz, sz, 0, 0, Math.PI*2);
  //   ctx.closePath();
  //   ctx.fill();
  //   ctx.stroke();
  //   ctx.fillText(type, this.position.x + 20, this.position.y + 20);
  //   ctx.fillText(playerId, this.position.x + 20, this.position.y + 10);
  //   if (primary) {
  //     ctx.fillText("Primary", this.position.x + 20, this.position.y);
  //   }
  // }

}