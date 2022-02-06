import { Vector } from "../../../common/vector";
import { copier } from "./copier";
import { mod } from "./mod";
import { BuildingInfoView, CachedSprite } from "./sprites";

export class BoundingLayer{
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  map: Array<Array<number>>;
  registred: Array<CanvasImageSource> = [];
  tileSize: number;
  lastCamera: Vector;
  ctx1: CanvasRenderingContext2D;
  canvas1: any;
  lastCacheCamera: Vector = new Vector(0, 0);
  camera: Vector;
  objects: Array<CachedSprite> = [];

  constructor(width: number, height: number, tileSize:number, camera:Vector){
    this.camera = camera;
    this.tileSize = tileSize;
    this.canvas = document.createElement('canvas');
    this.canvas.width = 900;
    this.canvas.height = 700;
    this.ctx = this.canvas.getContext('2d');

    this.canvas1 = document.createElement('canvas');
    this.canvas1.width = 800;//width*tileSize;
    this.canvas1.height = 600;//height*tileSize;
    this.ctx1 = this.canvas1.getContext('2d');

    let newMap:Array<Array<number>> = new Array(height).fill(0).map(it=> new Array(width).fill(0));
    this.map = newMap;

    this.updateCamera(new Vector(0, 0), tileSize);
  }

  updateCamera(camera:Vector, tileSize:number){
    this.camera = camera;
    if (!this.lastCamera){
      this.lastCamera = camera.clone();
    }
    this.updataCache(camera, tileSize);

    this.ctx1.clearRect(0, 0, this.canvas1.width, this.canvas1.height);
    this.ctx1.drawImage(this.canvas, 
      -mod(camera.x, tileSize)*1, 
      -mod(camera.y, tileSize)*1
    );
  }

  updateCacheTile(camera:Vector, tileX:number, tileY:number, value:number){
    const tileCamera = new Vector(
      Math.floor(camera.x / this.tileSize),
      Math.floor(camera.y / this.tileSize)
    );
    this.map[tileY][tileX] = value;
    this.renderTile(this.objects, tileCamera, tileX, tileY);  
  }

  /*_clearTile(tilingCamera:Vector, obj:CachedSprite, tileSize:number){
    const renderX = (-tilingCamera.x * tileSize) + obj.position.x * tileSize; 
    const renderY = (-tilingCamera.y * tileSize) + obj.position.y * tileSize;
    this.ctx.clearRect(renderX, renderY, obj.canvas.width, obj.canvas.height);
  }*/

  _renderTile(tilingCamera:Vector, obj:CachedSprite){
    const renderX = (-tilingCamera.x * this.tileSize) + obj.position.x * this.tileSize; 
    const renderY = (-tilingCamera.y * this.tileSize) + obj.position.y * this.tileSize;
    this.ctx.clearRect(renderX, renderY, obj.canvas.width, obj.canvas.height);
    this.ctx.drawImage(obj.canvas, renderX, renderY);
  }


  renderTile(objects:Array<CachedSprite>, tilingCamera:Vector, tileX:number, tileY:number, lastTileSize?:number){
    const renderX = (-tilingCamera.x + tileX) * this.tileSize; 
    const renderY = (-tilingCamera.y + tileY) * this.tileSize;
    const res = this.objects.filter(it=>{
      //optimize filter to hashmap
      return Math.floor(it.position.x * this.tileSize / this.tileSize) == tileX && Math.floor(it.position.y * this.tileSize / this.tileSize) == tileY
    });
    /*if (lastTileSize){
      res.forEach(it=> {
        this._clearTile(tilingCamera, it, lastTileSize)
        this._renderTile(tilingCamera, it);
      });
    } else {*/
      res.forEach(it=> this._renderTile(tilingCamera, it));
    //}
  }

  getTileCamera(camera:Vector, tileSize:number){
    const tileCamera = new Vector(
      Math.floor(camera.x / tileSize),
      Math.floor(camera.y / tileSize)
    );  
    return tileCamera;
  }

  getTilePixelPosition(tilingCamera:Vector, tileX:number, tileY:number){
    return new Vector(
      (-tilingCamera.x + tileX) * this.tileSize,
      (-tilingCamera.y + tileY) * this.tileSize
    )
  }

  getLastVisibleTile(tilingCamera:Vector, tileSize:number){
    const viewTileHeight = Math.floor(this.canvas.height / tileSize);
    const viewTileWidth =  Math.floor(this.canvas.width / tileSize);
    return new Vector(
      tilingCamera.x + viewTileWidth - 1,
      tilingCamera.y + viewTileHeight - 1
    );
  }

  updateScreen(tilingCamera:Vector, tileSize:number, lastTileSize:number){
    const lastTile = this.getLastVisibleTile(tilingCamera, tileSize);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = tilingCamera.y; i <= lastTile.y; i++){
      for (let j = tilingCamera.x; j <= lastTile.x; j++){
        this.renderTile(this.objects, tilingCamera, j, i, lastTileSize);
      }
    }
  }

  updataCache(camera:Vector, tileSize:number){
    const tileCamera = this.getTileCamera(camera, tileSize);/*new Vector(
      Math.floor(camera.x / tileSize),
      Math.floor(camera.y / tileSize)
    );*/
    if (this.tileSize != tileSize){
      const ls = this.tileSize;
      this.tileSize = tileSize;
      this.updateScreen(tileCamera, tileSize, ls);
      
      this.lastCacheCamera = tileCamera.clone();
      return;
    }
    const inc = this.lastCacheCamera.clone().sub(tileCamera);

    if ((inc.abs()==0)){
      return;
    }

    const mapHeight = this.map.length;
    const mapWidth = this.map[0].length;
    const viewTileHeight = Math.floor(this.canvas.height / tileSize);
    const viewTileWidth =  Math.floor(this.canvas.width / tileSize);
    const renderTileHeight = viewTileHeight;//Math.min(mapHeight, viewTileHeight); //max for all corners
    const renderTileWidth = viewTileWidth;//Math.min(mapWidth, viewTileWidth); //max for all corners

    copier.clearRect(0, 0, copier.canvas.width, copier.canvas.height);
    copier.drawImage(this.canvas, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(copier.canvas, inc.x * tileSize*1, inc.y * tileSize*1);

    const _renderTile = (objects:Array<CachedSprite>, tileX:number, tileY:number)=>{
      this.renderTile(objects, tileCamera, tileX, tileY);
    }

    const renderCol = (colTile: number)=>{
      const colObjects = this.objects.filter(it=>Math.floor(it.position.y * this.tileSize / this.tileSize) == colTile)
      for (let j = 0; j< renderTileHeight; j++){
        _renderTile(colObjects, colTile, tileCamera.y +j); 
      }
    }

    const renderRow = (rowTile: number)=>{
      const rowObjects = this.objects.filter(it=>Math.floor(it.position.x * this.tileSize / this.tileSize) == rowTile)
      for (let j = 0; j< renderTileWidth; j++){
        _renderTile(rowObjects, tileCamera.x + j, rowTile);    
      }
    }

    const lastTile = this.getLastVisibleTile(tileCamera, tileSize);

    if (inc.x >= 0){
      for (let i = 0; i< inc.x; i++){
        renderCol(tileCamera.x + i);
      }
    } else {
      for (let i = 0; i< -inc.x; i++){
        renderCol(lastTile.x - i/*tileCamera.x+(-i + viewTileWidth-1)*/);
      }
    }

    if (inc.y >= 0){
      for (let i = 0; i< inc.y; i++){
        renderRow(tileCamera.y + i);
      }
    } else {
      for (let i = 0; i< -inc.y; i++){
        renderRow(lastTile.y - i/*tileCamera.y +(-i + viewTileHeight-1)*/);
      }
    }
    
    this.lastCacheCamera = tileCamera.clone();
  }

  update(camera:Vector, map:Array<Array<number>>){
    this.camera = camera;
    map.forEach((it,i)=>it.forEach((jt, j)=>{
      if (this.map[i][j] != map[i][j]){
        this.updateCacheTile(camera, j, i, map[i][j]);
      }
    }))
  }

}