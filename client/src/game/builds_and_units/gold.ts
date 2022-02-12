import { Vector } from '../../../../common/vector';
import { IGameObjectContent, IGameObjectData } from '../dto';
import { BoundingLayer } from '../ultratiling/boundingLayer';
import { GoldInfoView } from '../ultratiling/goldInfoView';
import { Camera } from '../ultratiling/camera';
import { TilingLayer } from '../ultratiling/tileLayer';
import { TileObject } from '../ultratiling/tileObject';
import { InteractiveObject } from './interactiveObject';

export class Gold extends InteractiveObject{
  tiles: Array<TileObject> =[];
  //infos: CachedSprite;
  
  subType: string = 'gold';
  id: string;
  playerId: string = 'initial';
  name: string = 'gold';
  
  info: GoldInfoView;
  infoLayer: any;
  constructor(layer:TilingLayer, infoLayer:BoundingLayer, res:Record<string, HTMLImageElement>, camera: Camera, data: IGameObjectData){
    super();
    this.id = data.objectId;
    this.infoLayer = infoLayer;   
    this.camera = camera;
    this.position = data.content.position;
    
    this.info = new GoldInfoView(data.content.position.clone(), res["goldFull"], camera.getTileSize());
    this.info.update();
    this.infoLayer.addObject(this.info);  
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
    this.info.health = data.health;
    this.info.update();
    this.infoLayer.updateObject(this.info)
  }

  update(){
  }
 
}