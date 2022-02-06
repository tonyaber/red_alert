import { Vector } from "../../../common/vector";
import { copier } from "./copier";

export class TilingLayer{
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  map: Array<Array<number>>;
  registred: Array<CanvasImageSource> = [];
  tileSize: number;
  //viewWidth: number = 700;
  //viewHeight: number = 500;
  //lastViewPort: {top:number, left:number, width:number, height:number};
  lastCamera: Vector;
  ctx1: CanvasRenderingContext2D;
  canvas1: any;
  lastCacheCamera: Vector = new Vector(0, 0);
  camera: Vector;

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

    let newMap:Array<Array<number>> = new Array(width).fill(0).map(it=> new Array(width).fill(0));
    this.map = newMap;
    //this.ctx.fillRect(0,0,1,1);
    //this.update(newMap);
    this.updateCamera(new Vector(0, 0), tileSize);
  }

  updateCamera(camera:Vector, tileSize:number){
    this.camera = camera;
    if (!this.lastCamera){
      this.lastCamera = camera.clone();
    }
    this.updataCache(camera, tileSize);
    const mod = (arg: number, m: number)=>{
      if (arg>=0){
        return arg % m;
      } else {
        if (arg % m == 0 ){
          return 0
        }
        return arg % m + m;
      }
    }

    this.ctx1.clearRect(0, 0, this.canvas1.width, this.canvas1.height);
    this.ctx1.drawImage(this.canvas, 
     /* this.lastCacheCamera.x * tileSize +*/ -mod(camera.x, tileSize)*1, 
     /* this.lastCacheCamera.y * tileSize +*/ -mod(camera.y, tileSize)*1
    );
    //console.log(camera.x, mod(camera.x, tileSize));
  }

  updateCacheTile(camera:Vector, tileX:number, tileY:number, value:number){
    const tileCamera = new Vector(
      Math.floor(camera.x / this.tileSize),
      Math.floor(camera.y / this.tileSize)
    );
    this.map[tileY][tileX] = value;
    this.renderTile(tileCamera, tileX, tileY);  
  }

  renderTile(tilingCamera:Vector, tileX:number, tileY:number){
    const renderX = (-tilingCamera.x + tileX) * this.tileSize; 
    const renderY = (-tilingCamera.y + tileY) * this.tileSize;
    const graphic = this.registred[this.map[tileY] && this.map[tileY][tileX]];
    this.ctx.clearRect(renderX, renderY, this.tileSize, this.tileSize);
    if (graphic){
      this.ctx.drawImage(graphic, renderX, renderY, this.tileSize, this.tileSize);
      this.ctx.fillText(`${tileX}/${tileY}`, renderX, renderY + 10);
    }  
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
      tilingCamera.x + viewTileWidth-1,
      tilingCamera.y + viewTileHeight-1
    );
  }

  updateScreen(tilingCamera:Vector, tileSize:number){
    const lastTile = this.getLastVisibleTile(tilingCamera, tileSize);
    for (let i = /*tilingCamera.y*/0; i<= /*lastTile.y*/this.map.length-1; i++){
      for (let j = /*tilingCamera.x*/0; j<= /*lastTile.x*/ this.map[0].length-1; j++){
        this.renderTile(tilingCamera, j, i);
      }
    }
  }

  updataCache(camera:Vector, tileSize:number){
    const tileCamera = new Vector(
      Math.floor(camera.x / tileSize),
      Math.floor(camera.y / tileSize)
    );
    if (this.tileSize != tileSize){
      this.tileSize = tileSize;
      this.updateScreen(tileCamera, tileSize);
      this.lastCacheCamera = tileCamera.clone();
      return;
    }
    const inc = this.lastCacheCamera.clone().sub(tileCamera);
    //console.log(inc);
    if ((inc.abs()==0)){
      return;
    }

    const mapHeight = this.map.length;
    const mapWidth = this.map[0].length;
    const viewTileHeight = Math.floor(this.canvas.height / tileSize);
    const viewTileWidth =  Math.floor(this.canvas.width / tileSize);
    const renderTileHeight = Math.min(mapHeight, viewTileHeight); //max for all corners
    const renderTileWidth = Math.min(mapWidth, viewTileWidth); //max for all corners

    copier.clearRect(0, 0, copier.canvas.width, copier.canvas.height);
    copier.drawImage(this.canvas, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(copier.canvas, inc.x * tileSize*1, inc.y * tileSize*1);

    /*const renderTile = (renderTileY: number, renderTileX:number, renderX:number, renderY:number) => {
      const graphic = this.registred[this.map[renderTileY] && this.map[renderTileY][renderTileX]];
      this.ctx.clearRect(renderX, renderY, this.tileSize, this.tileSize);
      if (graphic){
        this.ctx.drawImage(graphic, renderX, renderY, this.tileSize, this.tileSize);
       // this.ctx.fillText(`${renderTileX}/${renderTileY}`, renderX, renderY + 10);
      }  
    }*/

    const _renderTile = (tilingCamera:Vector, tileSize:number, tileX:number, tileY:number)=>{
      //console.log(tilingCamera, tileX, tileY);
      //renderTile(tileX, tileY, (-tilingCamera.x + tileX)*tileSize, (-tilingCamera.y + tileY) * tileSize);
      this.renderTile(tileCamera, tileX, tileY);
    }

    //this.map[20][20] = Math.floor(Math.random()*2);
    //_renderTile(tileCamera, this.tileSize, 20, 20);

    const renderCol = (colTile: number, colPos:number)=>{
      for (let j = 0; j< renderTileHeight; j++){
        //renderTile(colTile, tileCamera.y + j, colPos, j* tileSize); 
        _renderTile(tileCamera, this.tileSize, colTile, tileCamera.y +j); 
      }
    }

    const renderRow = (rowTile: number, rowPos:number)=>{
      for (let j = 0; j< renderTileWidth; j++){
        //renderTile(tileCamera.x + j, rowTile, j* tileSize, rowPos);
        _renderTile(tileCamera, this.tileSize, tileCamera.x + j, rowTile);    
      }
    }

    //console.log(viewTileWidth - (mapWidth - tileCamera.x), viewTileHeight - (mapHeight - tileCamera.y) );
    //console.log(viewTileWidth, viewTileHeight, tileCamera.x, tileCamera.y)
    if (inc.x >= 0){
      for (let i = 0; i< inc.x; i++){
        renderCol(tileCamera.x + i, i * tileSize);
      }
    } else {
      for (let i = 0; i< -inc.x; i++){
        renderCol(tileCamera.x+(-i + viewTileWidth-1), (-i + viewTileWidth-1) * tileSize);
      }
    }

    if (inc.y >= 0){
      for (let i = 0; i< inc.y; i++){
        renderRow(tileCamera.y + i, i * tileSize);
      }
    } else {
      for (let i = 0; i< -inc.y; i++){
        renderRow(tileCamera.y +(-i + viewTileHeight-1), (-i + viewTileHeight-1) * tileSize);
      }
    }
    /*for (let i = Math.min(0, inc.x); i< Math.max(0, inc.x); i++){
      renderCol(tileCamera.x, i * tileSize);
      renderCol(tileCamera.x + viewTileWidth, (i + viewTileWidth) * tileSize);
    }*/

    /*for (let i = Math.min(0, inc.y); i< Math.max(0, inc.y); i++){
      renderRow(tileCamera.y, i * tileSize);
      renderRow(tileCamera.y + viewTileHeight, (i + viewTileHeight) * tileSize);
    }*/
    /*for (let i = 0; i< inc.y; i++){
      for (let j = 0; j< renderTileWidth; j++){
        const renderTileX = tileCamera.x + j;
        const renderTileY = tileCamera.y + i;
        const renderX = j * tileSize;
        const renderY = i * tileSize;
        
      }  
    }*/
    /*for (let i = 0; i< renderTileHeight; i++){
      for (let j = 0; j< renderTileWidth; j++){
        const renderTileX = tileCamera.x + j;
        const renderTileY = tileCamera.y + i;
        const renderX = j * tileSize;
        const renderY = i * tileSize;
        //console.log(renderTileY, renderTileX)

        const graphic = this.registred[this.map[renderTileY] && this.map[renderTileY][renderTileX]];
        this.ctx.clearRect(renderX, renderY, this.tileSize, this.tileSize);
        if (graphic){
          this.ctx.drawImage(graphic, renderX, renderY, this.tileSize, this.tileSize);
          this.ctx.fillText(`${renderTileX}/${renderTileY}`, renderX, renderY);
        }
      }
    }*/
    /*if (inc.abs()){
      this.map.forEach((it,i)=>it.forEach((jt, j)=>{
        const graphic = this.registred[this.map[i][j]];
        this.ctx.clearRect((j - tileCamera.x)*this.tileSize, (i - tileCamera.y)*this.tileSize, this.tileSize, this.tileSize);
        if (graphic){
          this.ctx.drawImage(graphic, (j - tileCamera.x)*this.tileSize, (i - tileCamera.y)*this.tileSize , this.tileSize, this.tileSize);
          this.ctx.fillText(`${j}/${i}`, (j- tileCamera.x)*this.tileSize  , (i - tileCamera.y)*this.tileSize );
        }
      }))*/
      this.lastCacheCamera = tileCamera.clone();
    
  }

  /*fullUpdate(tileSize:number){
    this.tileSize = tileSize;
    this.map.forEach((it,i)=>it.forEach((jt, j)=>{
      const graphic = this.registred[this.map[i][j]];
      this.ctx.clearRect(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize);
      if (graphic){
        this.ctx.drawImage(graphic, j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize);
        this.ctx.fillText(`${j}/${i}`, j*this.tileSize, i*this.tileSize +10);
      }
    }))  
  }*/

  update(camera:Vector, map:Array<Array<number>>){
    this.camera = camera;
    map.forEach((it,i)=>it.forEach((jt, j)=>{
      if (this.map[i][j] != map[i][j]){
        /*this.map[i][j] = map[i][j];
        const graphic = this.registred[map[i][j]];
        this.ctx.clearRect(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize);
        if (graphic){
          this.ctx.drawImage(graphic, j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize);
          this.ctx.fillText(`${j}/${i}`, j*this.tileSize, i*this.tileSize+10);
        }*/
        this.updateCacheTile(camera, j, i, map[i][j]);
      }
    }))
  }

  /*updateTile(position:Vector, value: number){
    const {x:tx, y:ty} = position;
    if (this.map[ty][tx] != value){
      this.map[ty][tx] = value;
      const graphic = this.registred[value];
      this.ctx.clearRect(tx*this.tileSize, ty*this.tileSize, this.tileSize, this.tileSize);
      if (graphic){
        this.ctx.drawImage(graphic, tx*this.tileSize, ty*this.tileSize, this.tileSize, this.tileSize);
        this.ctx.fillText(`${tx}/${ty}`, tx*this.tileSize, ty*this.tileSize+10);
      }
    }
  }*/
}