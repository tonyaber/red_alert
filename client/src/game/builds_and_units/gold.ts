import { Vector } from '../../../../common/vector';
import { IGameObjectContent, IGameObjectData } from '../dto';
import { BoundingLayer } from '../ultratiling/boundingLayer';
import { GoldInfoView } from '../ultratiling/goldInfoView';
import { Camera } from '../ultratiling/camera';
import { TilingLayer } from '../ultratiling/tileLayer';
import { TileObject } from '../ultratiling/tileObject';
import { InteractiveObject } from './interactiveObject';
import { Tile } from '../../../../server/src/tileElement';

export class Gold extends InteractiveObject{
  tiles: Array<TileObject> =[];
  //infos: CachedSprite;
  
  subType: string = 'gold';
  id: string;
  playerId: string = 'initial';
  name: string = 'gold';
  
  info: GoldInfoView;
  infoLayer: any;
  layer: TilingLayer;
  constructor(layer:TilingLayer, infoLayer:BoundingLayer, res:Record<string, HTMLImageElement>, camera: Camera, data: IGameObjectData){
    super();
    this.id = data.objectId;
    this.health = data.content.health
    this.infoLayer = infoLayer;   
    this.camera = camera;
    this.position = Vector.fromIVector(data.content.position);
    this.layer = layer;
    const tile = new TileObject(this.health+3, this.position)
    tile.onUpdate = ()=>{
      layer.updateCacheTile(layer.camera,  this.position.x,  this.position.y, tile.tileType);
    }
    tile.onUpdate();
    // this.info = new GoldInfoView(this.position, res["goldFull"], camera.getTileSize());
    // this.info.update();
    // this.infoLayer.addObject(this.info);  
  }

  processMove(cursor:Vector){
  
  }

  inShape(tile: Vector, cursor: Vector): boolean {
    let pos = this.camera.getTileVector(cursor).clone().sub(new Vector(this.position.x, this.position.y));
     if (pos.abs()<1){
       return true;       
    }
    return false;
  }
  
  updateObject(data: IGameObjectContent) {
    this.layer.updateCacheTile(this.layer.camera,  this.position.x,  this.position.y, data.health+3);
  }

  

  update(){
  }
 
}