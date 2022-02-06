import Control from "../../common/control";
import { IGameObjectData } from "./dto";
import { InteractiveObject,interactiveList } from "./interactiveObject";
import { InteractiveList } from "./interactiveList";
import { Vector } from '../../common/vector';


//import img from '../client/assets/tree2.png';

let tileSize = 20;
let baseTileSize = 5;
let scale = 1;
interface IRenderable{
  render: (ctx:CanvasRenderingContext2D)=>void;
  onUpdate: ()=>void;
}

class Sprite {
  img: HTMLImageElement;
  private _position: Vector;
  get position(){
    return this._position;
  }
  set position(value){
    this._position = value;
    this.onUpdate?.();
  }
  onUpdate:()=>void;

  constructor(img:HTMLImageElement){
    this.img = img;
    this.position = new Vector(0, 0);
  }

  render(ctx:CanvasRenderingContext2D){
    ctx.drawImage(this.img, this._position.x, this._position.y);
  }
}

class CachedSprite{
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  position:Vector;
  onUpdate: ()=>void;

  constructor(width: number, height: number, position:Vector){
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d');
    this.position = position.clone();
  }  

  update(){
    this.onUpdate();
  }

}

class BuildingInfoView extends CachedSprite{
  health: number =0;
  name: string ='gfdf';
  isPrimary: boolean;

  constructor(position:Vector){
    super(200, 40, position);
  }

  update(): void {
    const topText = this.ctx.measureText('h').actualBoundingBoxAscent;
    this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#f00";
    this.ctx.fillText('health: ' + this.health.toString(), 0, topText);
    this.ctx.fillText('name: ' + this.name, 0, topText*2);
    if (this.isPrimary){
      this.ctx.fillText('primary', 0, topText*3);
    }
    this.onUpdate();
  }
}

const areRectanglesOverlap = (rect1:[number, number, number, number], rect2:[number, number, number, number]) => {
  let [left1, top1, right1, bottom1] = [rect1[0], rect1[1], rect1[2], rect1[3]],
      [left2, top2, right2, bottom2] = [rect2[0], rect2[1], rect2[2], rect2[3]];
  // The first rectangle is under the second or vice versa
  if (top1 < bottom2 || top2 < bottom1) {
    return false;
  }
  // The first rectangle is to the left of the second or vice versa
  if (right1 < left2 || right2 < left1) {
    return false;
  }
  // Rectangles overlap
  return true;
}

class BoundingLayer{
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  items: Array<CachedSprite> = [];
  shouldUpdate: boolean = false;

  constructor(width: number, height: number){
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d');
  }  

  addItem(item:CachedSprite){
    item.onUpdate = ()=>{
      this.ctx.clearRect(item.position.x, item.position.y, item.canvas.width, item.canvas.height);
      this.ctx.drawImage(item.canvas, item.position.x, item.position.y);
    }
    this.items.push(item);
    //this.update();
  }

  removeItem(item:CachedSprite){
    //use bonding intersect function
    this.ctx.clearRect(item.position.x, item.position.y, item.canvas.width, item.canvas.height);
    this.items = this.items.filter(it=>it!=item);
  }

  fullUpdate(){
    this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
    this.items.forEach(item=>this.ctx.drawImage(item.canvas, item.position.x * scale /4, item.position.y*scale/4, item.canvas.width * scale/4, item.canvas.height * scale/4))
  }
}


class CachedLayer{
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  items: Array<IRenderable> = [];
  shouldUpdate: boolean = false;

  constructor(width: number, height: number){
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d');
  }

  addItem(item:IRenderable){
    item.onUpdate = ()=>{
      if (this.shouldUpdate == false){
        this.shouldUpdate = true;
        requestAnimationFrame(()=>{
          this.update();
        })
      }
    }
    this.items.push(item);
    //this.update();
  }

  removeItem(item:IRenderable){
    this.items = this.items.filter(it=>it!=item);
  }

  update(){
    const ctx = this.ctx;
    //ctx.fillStyle = "#000";
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.items.forEach(it=>it.render(this.ctx));
    this.shouldUpdate = false;
  }
}

class TilingLayer{
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  map: Array<Array<number>>;
  registred: Array<CanvasImageSource> = [];
  tileSize: number;

  constructor(width: number, height: number, tileSize:number){
    this.tileSize = tileSize;
    this.canvas = document.createElement('canvas');
    this.canvas.width = width*tileSize;
    this.canvas.height = height*tileSize;
    this.ctx = this.canvas.getContext('2d');
    let newMap:Array<Array<number>> = new Array(width).fill(0).map(it=> new Array(width).fill(0));
    this.map = newMap;
    //this.update(newMap);
  }

  update(map:Array<Array<number>>){
    map.forEach((it,i)=>it.forEach((jt, j)=>{
      if (this.map[i][j] != map[i][j]){
        this.map[i][j] = map[i][j];
        const graphic = this.registred[map[i][j]];
        this.ctx.clearRect(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize);
        if (graphic){
          this.ctx.drawImage(graphic, j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize);
        }
      }
    }))
  }

  updateTile(position:Vector, value: number){
    const {x:tx, y:ty} = position;
    if (this.map[ty][tx] != value){
      this.map[ty][tx] = value;
      const graphic = this.registred[value];
      this.ctx.clearRect(tx*this.tileSize, ty*this.tileSize, this.tileSize, this.tileSize);
      if (graphic){
        this.ctx.drawImage(graphic, tx*this.tileSize, ty*this.tileSize, this.tileSize, this.tileSize);
      }
    }
  }
}

class TilingLayer1{
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  map: Array<Array<number>>;
  registred: Array<CanvasImageSource> = [];
  tileSize: number;
  viewWidth: number = 700;
  viewHeight: number = 500;
  //lastViewPort: {top:number, left:number, width:number, height:number};
  lastCamera: Vector;
  ctx1: CanvasRenderingContext2D;
  canvas1: any;

  constructor(width: number, height: number, tileSize:number){
    this.tileSize = tileSize;
    this.canvas = document.createElement('canvas');
    this.canvas.width = width*tileSize;
    this.canvas.height = height*tileSize;
    this.ctx = this.canvas.getContext('2d');

    this.canvas1 = document.createElement('canvas');
    this.canvas1.width = width*tileSize;
    this.canvas1.height = height*tileSize;
    this.ctx1 = this.canvas1.getContext('2d');

    let newMap:Array<Array<number>> = new Array(width).fill(0).map(it=> new Array(width).fill(0));
    this.map = newMap;
    //this.update(newMap);
    this.updateCamera(new Vector(0, 0), tileSize);
  }

  updateCamera(camera:Vector, tileSize:number){
    this.tileSize = tileSize;
    const viewTiles = {
      top: Math.floor(camera.y / this.tileSize),
      left: Math.floor(camera.x / this.tileSize),
      width: Math.floor(this.viewWidth / this.tileSize),
      height: Math.floor(this.viewHeight / this.tileSize)
    }

    if (this.lastCamera){
      this.ctx1.clearRect(0, 0, this.canvas1.width, this.canvas1.height);
      this.ctx1.drawImage(this.canvas, 0, 0 );
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      const cam = new Vector(Math.floor((camera.x) / this.tileSize)*this.tileSize, Math.floor((camera.y) / this.tileSize)*this.tileSize);
      this.ctx.drawImage(this.canvas1, this.lastCamera.x - cam.x, this.lastCamera.y - cam.y);
      const lastViewTiles = {
        top: Math.floor(camera.y / this.tileSize),
        left: Math.floor(camera.x / this.tileSize),
        width: Math.floor(this.viewWidth / this.tileSize),
        height: Math.floor(this.viewHeight / this.tileSize)
      }

      for (let i = 0; i< viewTiles.width+1; i++){
        for (let j = 0; j< viewTiles.height+1; j++){
          if ((i <=(this.lastCamera.x - cam.x) || i == viewTiles.width) ||(j <= (this.lastCamera.y - cam.y) || j== viewTiles.height)){ //&& i > Math.min(viewTiles.left + viewTiles.width, lastViewTiles.left + lastViewTiles.width)){
            //if (j < Math.max(viewTiles.top, lastViewTiles.top) || j > Math.min(viewTiles.top + viewTiles.height, lastViewTiles.top + lastViewTiles.height)){
              const graphic = this.map[j + viewTiles.top] && this.registred[this.map[j+ viewTiles.top][i+ viewTiles.left]];
              this.ctx.clearRect(i*this.tileSize - camera.x%this.tileSize*0, j*this.tileSize - camera.y%this.tileSize*0, this.tileSize, this.tileSize);
              if (graphic){
                this.ctx.drawImage(graphic, i*this.tileSize - camera.x%this.tileSize*0, j*this.tileSize-camera.y%this.tileSize*0, this.tileSize, this.tileSize);
            //  }  
            }
         }
        }
      }
      
    } else {
      this.fullUpdate(this.tileSize);
      
    }
    this.lastCamera = new Vector(Math.floor((camera.x) / this.tileSize)*this.tileSize, Math.floor((camera.y) / this.tileSize)*this.tileSize);
  }

  fullUpdate(tileSize:number){
    this.tileSize = tileSize;
    this.map.forEach((it,i)=>it.forEach((jt, j)=>{
      const graphic = this.registred[this.map[i][j]];
      this.ctx.clearRect(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize);
      if (graphic){
        this.ctx.drawImage(graphic, j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize);
      }
    }))  
  }

  update(map:Array<Array<number>>){
    map.forEach((it,i)=>it.forEach((jt, j)=>{
      if (this.map[i][j] != map[i][j]){
        this.map[i][j] = map[i][j];
        const graphic = this.registred[map[i][j]];
        this.ctx.clearRect(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize);
        if (graphic){
          this.ctx.drawImage(graphic, j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize);
        }
      }
    }))
  }

  updateTile(position:Vector, value: number){
    const {x:tx, y:ty} = position;
    if (this.map[ty][tx] != value){
      this.map[ty][tx] = value;
      const graphic = this.registred[value];
      this.ctx.clearRect(tx*this.tileSize, ty*this.tileSize, this.tileSize, this.tileSize);
      if (graphic){
        this.ctx.drawImage(graphic, tx*this.tileSize, ty*this.tileSize, this.tileSize, this.tileSize);
      }
    }
  }
}


class TileObject{
  tiling: TilingLayer;
  position:Vector;
  tileType:number;
  lastCursor: Vector = new Vector(0,0);
  isHovered: boolean = false;
  onMouseEnter: any;
  onMouseLeave: any;

  constructor(tileType:number){
    this.tileType = tileType;
  }

  inShape(cursor:Vector){
    this.lastCursor = cursor.clone();
    return (cursor.x == this.position.x && cursor.y == this.position.y);
  }

  processMove(cursor:Vector){
    if (cursor.x == this.lastCursor.x && cursor.y == this.lastCursor.y){
      return;
    }
    if (!this.isHovered && this.inShape(cursor)){
      this.isHovered = true;
      //this.tileType = 0;
      //console.log('ent');
      //this.update();
      this.onMouseEnter?.();
    } else if(this.isHovered && !this.inShape(cursor)){
      this.isHovered = false;
      //this.tileType = 1;
      //this.update();
      this.onMouseLeave?.();
    } /*else if (this.inShape(cursor)){
      this.onMouseMove();
    }*/
    //console.log(this.tileType);

  }

  update(){
    this.tiling.updateTile(this.position, this.tileType);
  }
}

class GameObject{
  tiles: Array<TileObject> =[];
  //infos: CachedSprite;
  isHovered: boolean = false;
  hovBalance: number = 0;

  constructor(layer:TilingLayer, infoLayer:BoundingLayer, infoLayer1:BoundingLayer, res:Record<string, HTMLImageElement>, pos:Vector){
    const tileMap = [
      [1,1,1,0],
      [1,1,1,0],
      [0,1,1,1],
      [1,1,1,0],
    ];

    const infos = new CachedSprite(tileSize*4, tileSize*4, pos.clone().scale(tileSize));
    infos.ctx.drawImage(res['buildingCenter'], 0, 0, tileSize*4, tileSize*4);
    infoLayer.addItem(infos);
    infos.update();

    const texts = new BuildingInfoView(pos.clone().scale(tileSize));
    infoLayer1.addItem(texts);
    texts.update();
    //console.log(infos.canvas);
    //document.body.appendChild(infos.canvas);
    
    tileMap.forEach((it,i)=>it.forEach((jt, j)=>{
      const tile = new TileObject(1);
      tile.tiling = layer;
      tile.onMouseEnter = ()=>{
        //this.isHovered = true;
        this.hovBalance+=1;
        this.tiles.forEach(it1=>it1.tileType = 0);
        texts.health+=1;
        texts.update();
        this.update();
      }

      tile.onMouseLeave = ()=>{
        this.hovBalance-=1;
        if (this.hovBalance == 0){
          this.tiles.forEach(it1=>it1.tileType = 1);
          this.update();
        }
        //this.tiles.forEach(it=>it.tileType = 0);
      }
      

      tile.position = pos.clone().add(new Vector(j, i));
      //console.log(tile.position)
      this.tiles.push(tile);
    }));
  }

  processMove(cursor:Vector){
    this.tiles.forEach(it=>it.processMove(cursor));
  }

  update(){
    this.tiles.forEach(it=>it.update());
  }
}

//let map:Array<Array<number>> = new Array(100).fill(0).map(it=> new Array(100).fill(0));

export class Canvas extends Control{
  //interactiveList: Record<string, InteractiveObject> = {}
  interactiveList: InteractiveList;
  
  onGameMove: () => void;
  onClick: (position: Vector) => void;
  onObjectClick: (id: string, name: string) => void;
  canvas: Control<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;
  hoveredObjects: InteractiveObject = null;
  fps: number;
  //img:HTMLImageElement;
  elapsed: number = 0;
  layer: CachedLayer;
  layer1: CachedLayer;
  tiling: TilingLayer;
  tiles: GameObject[];
  infoLayer: BoundingLayer;
  infos: BuildingInfoView[] =[];
  camera:Vector = new Vector(0,0);
  infoLayer1: BoundingLayer;

  constructor(parentNode: HTMLElement, res:Record<string, HTMLImageElement>) {
    super(parentNode);
    //this.img = new Image();
    //this.img.src = img;
    this.canvas = new Control(this.node, 'canvas');
    this.canvas.node.width = 800;
    this.canvas.node.height = 600;
    //this.canvas.node.style.background = 'green';
    this.ctx = this.canvas.node.getContext('2d');
    this.interactiveList = interactiveList;
    this.canvas.node.onmousemove = (e)=>{
      this.interactiveList.handleMove(new Vector(e.offsetX, e.offsetY), new Vector(e.offsetX, e.offsetY));
      const tile = new Vector(Math.floor(e.offsetX / tileSize), Math.floor(e.offsetY / tileSize));
      //console.log(tile);
      this.tiles.forEach(it=>it.processMove(tile));
      this.camera = new Vector(e.offsetX, e.offsetY);
    }
    
    
    this.interactiveList.onChangeHovered = (lastTarget:InteractiveObject, currentTarget:InteractiveObject) => {
      this.hoveredObjects = currentTarget;
    }

    this.canvas.node.onclick = (e: MouseEvent) => {
      if (this.hoveredObjects === null) {
         this.onClick?.(new Vector(e.offsetX, e.offsetY))
      } else {
        this.onObjectClick(this.hoveredObjects.id, this.hoveredObjects.type);
      }
    }

    this.canvas.node.oncontextmenu = (e)=>{
      e.preventDefault();
    }
    this.canvas.node.onmousedown = (e: MouseEvent) => {
      console.log('but' + e.buttons)
      if (e.buttons == 1){
        scale += 1;
        if (scale>10){
          scale = 10;
        }
      } else {
        scale -= 1;
        if (scale<1){
          scale = 1;
        }
      }
      tileSize = Math.floor(baseTileSize * scale);
        console.log(tileSize);
        //this.infoLayer.update();
        //this.tiling.fullUpdate(tileSize);
        this.infoLayer.fullUpdate();
        this.infoLayer1.fullUpdate();
    }


    this.layer1 = new CachedLayer(this.canvas.node.width*10, this.canvas.node.height*10);
    for (let i =0; i<1000; i++){
      const sprite = new Sprite(res['rocks']);
      sprite.position = new Vector(Math.random()*8000, Math.random()*6000);
      this.layer1.addItem(sprite);
    }
    this.layer1.update();


   this.layer = new CachedLayer(this.canvas.node.width, this.canvas.node.height);
    for (let i =0; i<10; i++){
      const sprite = new Sprite(res['rocks']);
      sprite.position = new Vector(Math.random()*800, Math.random()*600);
      this.layer.addItem(sprite);
    }
    this.layer.update();

    this.tiling = new TilingLayer(100,100, tileSize);
    this.tiling.registred = [
      null, res['grass']
    ]

    this.infoLayer = new BoundingLayer(800, 600);
    for (let i = 0; i<20; i++){
      /*const info = new BuildingInfoView(new Vector(200, i* 40));
      info.health = i*10;
      info.name = 'name '+ i.toString();
      info.isPrimary = i==3;
      this.infos.push(info);
      this.infoLayer.addItem(info);
      info.update();*/

      const infos = new CachedSprite(tileSize*4, tileSize*4, new Vector(200, i* 40));
      infos.ctx.drawImage(res['buildingCenter'], 0, 0, tileSize*4, tileSize*4);
      this.infoLayer.addItem(infos);
      infos.update();
    }

    this.infoLayer1 = new BoundingLayer(800, 600);

    this.tiles = [];
    for (let i =0; i<1000; i++){
      const sprite = new GameObject(this.tiling, this.infoLayer, this.infoLayer1, res, new Vector(Math.floor(Math.random()*96), Math.floor(Math.random()*96)));
      //sprite.tiling = this.tiling;
      /*sprite.onMouseEnter = ()=>{
        //console.log(i);
      }*/
      //sprite.position = new Vector(Math.floor(Math.random()*100), Math.floor(Math.random()*100));
      sprite.update();
      this.tiles.push(sprite);
    }

    
    
    
    
    //this.img.onload = ()=>{
 
      this.layer1.update();
      this.layer.update();
      /*const map = this.tiling.map.map(it=>it.map(jt=>{
        return Math.floor(Math.random()*2);
      }))*/
      //let map:Array<Array<number>> = new Array(100).fill(0).map(it=> new Array(100).fill(0));
      //this.tiling.update(map);
      this.startRender(); 
  
    //}
    
    
    
  }

  updateObject(data:IGameObjectData){
    this.interactiveList.list.find(item=>item.id === data.objectId).updateObject(data.content)
  }

  deleteObject(data:IGameObjectData){

  }

  addObject(data: IGameObjectData) {
    const interactiveObject = new InteractiveObject(data);
  }

  startRender(){
    let lastTime: number = null;
    this.fps = 60;
    const render = () => {
      requestAnimationFrame((timeStamp) => {
        if (!lastTime) {
          lastTime = timeStamp;
        }

        const delta = timeStamp - lastTime;
        const dv = 16;
        if (this.fps > 60) {
          this.fps = 60
        }
        this.fps = ((this.fps * (dv - 1)) + (1 / delta * 1000)) / dv;
        this.render(this.ctx, delta);
        lastTime = timeStamp;
        render();
      })
      
    }
    render();
  }

  render(ctx: CanvasRenderingContext2D, delta: number) {
    ctx.fillStyle = "#000";
   
    ctx.fillRect(0, 0, this.canvas.node.width, this.canvas.node.height);
    
    /*this.interactiveList.list.forEach(it => {
      it.render(ctx,
        new Vector(0, 0),
        delta,
      );
    })*/

    /*for (let i =0; i<300; i++){
      this.elapsed += delta;
      ctx.drawImage(this.img, 100.0 + Math.cos(this.elapsed/50.0 - i) * 300.0,0);
    }*/
    this.elapsed += delta / 10;

    //(this.layer.items[this.layer.items.length-1] as Sprite).position = new Vector(300.0 + Math.cos(this.elapsed/50.0) * 300.0, 0);
    this.layer.items.forEach((it, i)=>{
      (it as Sprite).position = new Vector(100.0 + Math.cos(this.elapsed/50.0 + i) * 300.0, 0);
    })

    //for (let i = 0; i<30; i++){
    //ctx.drawImage(this.layer1.canvas, 0, 0);
    ctx.drawImage(this.layer.canvas, 0, 0);
    /*const map = this.tiling.map.map(it=>it.map(jt=>{
      if (Math.random()<0.003){
        return Math.floor(1-jt);
      } else {
        return jt;
      }
    }))*/
    //this.tiling.update(map);
    let kk = 0;
    //this.tiling.updateCamera(this.camera.clone().sub(new Vector(100,100)).scale(-10), tileSize);
    ctx.drawImage(this.tiling.canvas, -this.camera.x*kk, -this.camera.y*kk);
    /*for (let i=1; i<2; i++){
      this.infos[i].health+=1;
      this.infos[i].update();
    }*/
    ctx.drawImage(this.infoLayer.canvas,  -this.camera.x*kk, -this.camera.y*kk);
    ctx.drawImage(this.infoLayer1.canvas,  -this.camera.x*kk, -this.camera.y*kk);
    //}
    

    /*let newMap:Array<Array<number>> = new Array(100).fill(0).map(it=> new Array(100).fill(0));
    map.forEach((it,i)=>it.forEach((jt, j)=>{
      newMap[i][j] = Math.random()* Math.cos(i);
    }))
    map = newMap;*/
    
    ctx.fillStyle = "#fff";
    ctx.fillText('fps: ' + this.fps.toFixed(2), 0, 30);
  }
}
