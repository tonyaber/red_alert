import { Vector } from "../../../common/vector";
import { BoundingLayer } from "./boundingLayer";
import { TilingLayer } from "./tileLayer";
import { TileObject } from "./tileObject";
import { BuildingInfoView } from "./sprites";

export class GameObject{
  tiles: Array<TileObject> =[];
  //infos: CachedSprite;
  isHovered: boolean = false;
  hovBalance: number = 0;

  constructor(layer:TilingLayer, infoLayer:BoundingLayer/* infoLayer1:BoundingLayer,*/, res:Record<string, HTMLImageElement>, pos:Vector){
    const tileMap = [
      [1,1,1,0],
      [1,1,1,0],
      [0,1,1,1],
      [1,1,1,0],
    ];

    /*const infos = new CachedSprite(tileSize*4, tileSize*4, pos.clone().scale(tileSize));
    infos.ctx.drawImage(res['buildingCenter'], 0, 0, tileSize*4, tileSize*4);
    infoLayer.addItem(infos);
    infos.update();

    const texts = new BuildingInfoView(pos.clone().scale(tileSize));
    infoLayer1.addItem(texts);
    texts.update();
    //console.log(infos.canvas);
    //document.body.appendChild(infos.canvas);*/
    
    tileMap.forEach((it,i)=>it.forEach((jt, j)=>{
      const tilePos = pos.clone().add(new Vector(j, i));
      if (!tileMap[i][j]){
        return;
      }

      const info = new BuildingInfoView(pos.clone());
      info.health = 10;
      info.update();
      infoLayer.objects.push(info);
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

  update(){
    //this.tiles.forEach(it=>it.update());
  }
}