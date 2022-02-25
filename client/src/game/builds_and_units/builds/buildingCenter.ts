import { Vector } from '../../../../../common/vector';
import { IGameObjectContent, IGameObjectData } from '../../dto';
import { BoundingLayer } from '../../ultratiling/boundingLayer';
import { TilingLayer } from '../../ultratiling/tileLayer';
import { AbstractBuild } from './abstractBuild';
import { Camera } from '../../ultratiling/camera';
import { TileObject } from '../../ultratiling/tileObject';
import { BuildingInfoView } from '../../ultratiling/buildingInfoView';

export class BuildingCenter extends AbstractBuild{
  // id: string;
  // playerId: string;
  // position: Vector;
  // type: string;
  // primary: boolean;
  constructor(layer:TilingLayer, infoLayer:BoundingLayer, res:Record<string, HTMLImageElement>, camera: Camera, data: IGameObjectData) {
    super(layer, infoLayer, res, camera, data);
    // const tileMap = data.content.buildMatrix;
    // const pos = data.content.position

    // this.info = new BuildingInfoView(pos.clone(), res["buildingCenter"], this.name, this.health, this.playerId, this.primary);
    // this.info.update();
    // this.infoLayer.addObject(this.info);
    // //console.log(tileMap)
    // tileMap.forEach((it,i)=>it.forEach((jt, j)=>{
    //   const tilePos = pos.clone().add(new Vector(j, i));
    //   if (!tileMap[i][j]){
    //     return;
    //   }     
    //   const tile = new TileObject(1, tilePos);
    //   tile.onMouseEnter = () => {
    //    // console.log(tilePos)
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