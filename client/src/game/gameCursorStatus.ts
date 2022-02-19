import { IVector, Vector } from '../../../common/vector';
import { AbstractBuild } from './builds_and_units/builds/abstractBuild';
import { AbstractUnit } from './builds_and_units/units/abstractUnit';
import { IObject } from './dto';
import { InteractiveObject } from './builds_and_units/interactiveObject';
import { Rock } from './builds_and_units/rock';
import { InteractiveList } from './interactiveList';
import { findClosestBuild } from './distance';

export class GameCursorStatus{
  pixelPosition:Vector = new Vector(0, 0);
  tilePosition:Vector = new Vector(0, 0);
  multiStart:Vector;
  selected:Array<InteractiveObject> = [];
  hovered:Array<InteractiveObject> = [];
  planned: IObject;
  playerId: string;
    // getPrimaries: () => Record<string, MapObject>;
   getMap: () => Array<Array<number>>;
  // getRealMap: () => Array<Array<number>>;
   getObjects: () => InteractiveList;

  constructor(playerId:string, getMap:()=>Array<Array<number>>, getObject: ()=>InteractiveList/*getPrimaries:()=>Record<string, MapObject>, , getRealMap:()=>Array<Array<number>>*/){
    this.getMap = getMap;
    this.getObjects = getObject;
    // this.getPrimaries = getPrimaries;
     
    // this.getRealMap = getRealMap;
    this.playerId = playerId;
  }

  getAction() {
    let action: string = 'select';
    if (this.planned){
      //action = 'build';
      const mask = this.getBuildMask();
    
      if (mask.flat(1).find(it => it != 0) == null) {
        
        action = 'build';
      } else {
        action = 'no_build';
      }
    } else if (this.selected.length == 0){
      //no selected
      action = 'select';
    } else if (this.selected.find(it => !(it instanceof AbstractUnit)) == null) {
      if (!this.hovered.length && this.selected[0].playerId === this.playerId) {
        action = 'move';
      } else if (!this.hovered.length) {
        action = 'select';
      } else if (this.hovered[0].playerId != this.playerId && !(this.hovered[0] instanceof Rock)) {
        action = 'attack';
      }
    } else if ((this.selected[0] instanceof AbstractBuild)) {
      if (this.hovered[0] == this.selected[0]&&this.hovered[0].playerId===this.playerId&&!this.hovered[0].primary) {
        action = 'primary';
        // if (this.getPrimaries()[this.hovered[0].name] ==this.hovered[0]){
        //   action = 'no'
        // } else {
        //   action = 'primary'
        // }
      }
    }

    return action;
  }

  getBuildMask() {
    
    const mask = checkMap(this.getMap(), this.planned.mtx, this.tilePosition);
    const redMask = this.planned.mtx;
  
    const builds = this.getObjects().list.filter(it => it.playerId === this.playerId&& it instanceof AbstractBuild) as AbstractBuild[];

    const closestBuild = findClosestBuild(this.tilePosition.clone(), builds);
    if (!(!builds.length || closestBuild.distance <= 6)) { 
      //console.log('redMask: ', redMask);
     return redMask;
    }
    // console.log('mask: ', mask);
    return mask;

    /* redMask массив вида
    [[0, 0, 0, 0]
     [1, 1, 0, 0]
     [1, 1, 1, 1]
     [1, 1, 1, 1]]
     mask - такой же массив, состоящий только из нулей
    */
  }

  // isOnlyUnitsSelected(){
  //   return this.selected.find(it=> !(it instanceof AbstractUnit)) == null
  // }

  render(ctx:CanvasRenderingContext2D, camera:Vector, sz: number){
    this.renderCursor(ctx, camera)
    if (this.multiStart){
      this.renderMulti(ctx, camera, sz);
    }
    if (this.planned){
      this.renderBuildPlanned(ctx, camera, sz);
    }
  }

  renderCursor(ctx:CanvasRenderingContext2D, camera:Vector){
    ctx.fillStyle = "#00f";
    ctx.beginPath();
    let r =2;
    ctx.ellipse(this.pixelPosition.x -r, this.pixelPosition.y-r, r*2, r*2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke(); 
    // 
    //let num = this.getRealMap()[this.tilePosition.y][this.tilePosition.x];
    let num = 0;
    let label = 'ground'+num;
    if (this.hovered[0]){
       label = this.hovered[0].name;
    }
    ctx.fillText( label , this.pixelPosition.x, this.pixelPosition.y -10);

    ctx.fillText( this.getAction() , this.pixelPosition.x, this.pixelPosition.y -20);
    //this.drawTile(ctx, this.tilePosition, new Vector(0,0), "#0ff7", 0);
  }

  renderMulti(ctx: CanvasRenderingContext2D, camera:Vector, sz: number){
    ctx.fillStyle = '#fff4';
    ctx.fillRect(this.multiStart.x - camera.x, this.multiStart.y - camera.y, this.pixelPosition.x -this.multiStart.x+camera.x, this.pixelPosition.y -this.multiStart.y+camera.y);
  }

  renderBuildPlanned(ctx: CanvasRenderingContext2D, camera:Vector, sz: number){
    //const cursorTile = this.getTileCursor();
    //this.currentBuilding.render();
    const mask = this.getBuildMask();
    
    this.drawObject(ctx, this.planned.mtx, this.tilePosition, camera, "#ff06", sz);
    this.drawObject(ctx, /*this.planned.mtx*/mask.map(it=>it.map(jt=>jt.toString())), this.tilePosition, camera, "#f00", sz);
  }

  drawObject(ctx:CanvasRenderingContext2D, object:Array<Array<any>>, position:IVector, camera:IVector, color:string, sz:number){
    object.forEach((row, i)=>row.forEach((cell, j)=>{
      if (object[i][j]!='0'){
        this.drawTile(ctx, new Vector(j+position.x, i+position.y), camera, color, sz);
      }
    }));
  }

  drawTile(ctx:CanvasRenderingContext2D, position:IVector, camera:IVector, color:string, sz:number){
    //const sz = this.sz;
    ctx.fillStyle = color;
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    ctx.beginPath();
    
    ctx.rect(position.x * sz - camera.x,position.y *sz - camera.y, sz, sz);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
}

export const checkMap = (map: Array<Array<number>>, obj: Array<Array<number>>, { x, y }: Vector) => {
/*
map: массив из 96 строк и 96 столбцов, занятий 0 и 1. 1 - строить нельзя, 0 - можно
obj: схема объекта
[[0, 0, 0, 0]
 [0, 1, 1, 0]
 [1, 1, 1, 1]
 [1, 1, 1, 1]]
*/
  
  const rowsInObj = obj.length;
  const columnsInObj = obj[0].length;
  // if (y + rowsInObj > map.length) {
  //   throw 'There is no enough rows to place the object';
  // };
  // if (x + columnsInObj > map[0].length) {
  //   throw 'There is no enough columns to place the object';
  // };
  const result: Array<Array<number>> = [];
  

  for (let rowIndex = 0; rowIndex < rowsInObj; rowIndex++) {
    result.push([]);
    for (let columnIndex = 0; columnIndex < columnsInObj; columnIndex++) {
      const cell = obj[rowIndex][columnIndex];
      if (cell === 0) {
        result[rowIndex].push(0);
        continue;
      }
      
      if (rowIndex + y > 0 && rowIndex + y < map.length &&
        columnIndex + x>0&&columnIndex + x<map[0].length&&
        map[rowIndex + y][columnIndex + x] === 0) {
        result[rowIndex].push(0);
        continue;
      } else {
        result[rowIndex].push(1);
      }
    }
  }
  /*result - (если строительство возможно) массив вида: 
  [[0, 0, 0, 0]
   [0, 0, 0, 0]
   [0, 0, 0, 0]
   [0, 0, 0, 0]]
  */
   //console.log('checkMap: ',result);
  return result;
}
