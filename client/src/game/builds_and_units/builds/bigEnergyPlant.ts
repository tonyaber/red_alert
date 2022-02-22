import { Vector } from '../../../../../common/vector';
import {  IGameObjectData } from '../../dto';
import { BoundingLayer } from '../../ultratiling/boundingLayer';
import { BuildingInfoView } from '../../ultratiling/buildingInfoView';
import { Camera } from '../../ultratiling/camera';
import { TilingLayer } from '../../ultratiling/tileLayer';
import { TileObject } from '../../ultratiling/tileObject';
import { AbstractBuild } from './abstractBuild';

export class BigEnergyPlant extends AbstractBuild{
  constructor(layer:TilingLayer, infoLayer:BoundingLayer, res:Record<string, HTMLImageElement>, camera: Camera, data: IGameObjectData) {
    super(layer, infoLayer, res, camera, data);
    // const tileMap = data.content.buildMatrix;
    // const pos = data.content.position

    // this.info = new BuildingInfoView(pos.clone(), res["energy"], this.name, this.health, this.playerId, this.primary);
    // this.info.update();
    // this.infoLayer.addObject(this.info);
    
    // tileMap.forEach((it,i)=>it.forEach((jt, j)=>{
    //   const tilePos = pos.clone().add(new Vector(j, i));
    //   if (!tileMap[i][j]){
    //     return;
    //   }     
    //   const tile = new TileObject(1, tilePos);
    //   tile.onMouseEnter = ()=>{
    //     this.hovBalance+=1;
    //   }

    //   tile.onMouseLeave = ()=>{
    //     this.hovBalance -= 1;
    //   }

    //   tile.onUpdate = ()=>{
    //     layer.updateCacheTile(layer.camera, tilePos.x, tilePos.y, tile.tileType);
    //   }
    //   tile.onUpdate();
      
    //   this.tiles.push(tile);
    // }));
  }    
}