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
  //infos: CachedSprite;
  isHovered: boolean = false;
  hovBalance: number = 0;
  subType: string = 'build';
  id: string;
  playerId: string;
  position: Vector;
  name: string;
  primary: boolean;
  health: number = 100;
  constructor(layer:TilingLayer, infoLayer:BoundingLayer, res:Record<string, HTMLImageElement>, camera: Camera, data: IGameObjectData){
    super();
    this.id = data.objectId;
    this.name = data.type;
    this.updateObject(data.content)
    const tileMap = [
      [0,1,1,0],
      [1,1,1,0],
      [1,1,1,1],
      [1,1,1,0],
    ];
    const pos = camera.getTileVector(data.content.position)
    /*const infos = new CachedSprite(tileSize*4, tileSize*4, pos.clone().scale(tileSize));
    infos.ctx.drawImage(res['buildingCenter'], 0, 0, tileSize*4, tileSize*4);
    infoLayer.addItem(infos);
    infos.update();

    const texts = new BuildingInfoView(pos.clone().scale(tileSize));
    infoLayer1.addItem(texts);
    texts.update();
    //console.log(infos.canvas);
    //document.body.appendChild(infos.canvas);*/
    const info = new BuildingInfoView(pos.clone(), res["barrack"], this.name, this.health, this.playerId, this.primary);
    info.update();
    infoLayer.addObject(info);
    
    tileMap.forEach((it,i)=>it.forEach((jt, j)=>{
      const tilePos = pos.clone().add(new Vector(j, i));
      if (!tileMap[i][j]){
        return;
      }

      
      //infoLayer.updateScreen();
      
      const tile = new TileObject(1, tilePos);
      //tile.tiling = layer;
      tile.onMouseEnter = ()=>{
        //this.isHovered = true;
        this.hovBalance+=1;
       /* if (this.hovBalance == 1){
          this.tiles.forEach(it1=>it1.tileType = 0);
        }*/
        //texts.health+=1;
        //texts.update();
        //this.update();
      }

      tile.onMouseLeave = ()=>{
        this.hovBalance-=1;
        /*if (this.hovBalance == 0){
          this.tiles.forEach(it1=>it1.tileType = 1);
          //this.update();
        }*/
        //this.tiles.forEach(it=>it.tileType = 0);
      }

      tile.onUpdate = ()=>{
        //layer.updateCamera(layer.camera, layer.tileSize);
        layer.updateCacheTile(layer.camera, tilePos.x, tilePos.y, tile.tileType);
        
        //optimize it, too many updates
        //console.log('upd');
      }
      tile.onUpdate();
      

      //tile.position = pos.clone().add(new Vector(j, i));
      //console.log(tile.position)
      this.tiles.push(tile);
      //updateLayer
    }));
  }

  processMove(cursor:Vector){
    //console.log(cursor);
    let lastBalance = this.hovBalance;
    this.tiles.forEach(it=>it.processMove(cursor));
    if (lastBalance !==this.hovBalance){
      if (this.hovBalance == 0){
        this.tiles.forEach(it1=>it1.tileType = 1);
      } else if (this.hovBalance == 1){
        this.tiles.forEach(it1=>it1.tileType = 0);
      }
    }
  }

  inShape(tile: Vector, cursor: Vector): boolean {
   // let pos = tile.clone().sub(new Vector(this.position.x, this.position.y));
    if (this.tiles.find(it => it.inShape(tile))) {
      return true;
    }
    return false;
  }
  
  updateObject(data: IGameObjectContent) {
    this.position = data.position;
    this.playerId = data.playerId;
    this.primary = data.primary;
  }

  update(){
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