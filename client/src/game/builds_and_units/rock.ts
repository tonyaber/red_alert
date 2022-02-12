import { Vector } from '../../../../common/vector';
import { IGameObjectContent, IGameObjectData } from '../dto';
import { BoundingLayer } from '../ultratiling/boundingLayer';
import { GoldInfoView } from '../ultratiling/goldInfoView';
import { Camera } from '../ultratiling/camera';
import { TilingLayer } from '../ultratiling/tileLayer';
import { TileObject } from '../ultratiling/tileObject';
import { InteractiveObject } from './interactiveObject';

export class Rock extends InteractiveObject{
  tiles: Array<TileObject> =[];
  //infos: CachedSprite;
  
  subType: string = 'rock';
  id: string;
  playerId: string = 'initial';
  position: Vector;
  name: string = 'rock';
  
  info: GoldInfoView;
  infoLayer: any;
  
  constructor(layer:TilingLayer, infoLayer:BoundingLayer, res:Record<string, HTMLImageElement>, camera: Camera, data: IGameObjectData){
    super();
    this.id = data.objectId;
    this.infoLayer = infoLayer;    
    
    this.info = new GoldInfoView(Vector.fromIVector(data.content.position), res["rocks"], camera.getTileSize());
    this.info.update();
    this.infoLayer.addObject(this.info);
    
  }

  processMove(cursor:Vector){
   
  }

  inShape(tile: Vector, cursor: Vector): boolean {
    return false;
  }
  
  

  update(){
  }
 
}