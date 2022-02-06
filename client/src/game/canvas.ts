import Control from "../../../common/control";
import { IGameObjectData,IObject } from "./dto";
import { InteractiveObject,interactiveList } from "./interactiveObject";
import { InteractiveList } from "./interactiveList";
import { Vector } from '../../../common/vector';
import { builds } from './builds_and_units/buildMap';
import { GameCursorStatus } from './gameCursorStatus';
import { AbstractUnit } from "./builds_and_units/units/abstractUnit";
import { SoundManager } from "./soundManager";

export class Canvas extends Control{
  //interactiveList: Record<string, InteractiveObject> = {}
  interactiveList: InteractiveList;
  
  onChangePosition: (id: string, position: Vector) => void;
  onGameMove: () => void;
  onClick: (position: Vector) => void;
  onObjectClick: (id: string, name: string, subType: string) => void;
  onAttack: (id: string, targetId: string) => void;
  canvas: Control<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;
  hoveredObjects: InteractiveObject = null;
  fps: number;
  cursorStatus: GameCursorStatus;
  cursorPosition: Vector;
  playerId: string;
  


  constructor(parentNode: HTMLElement, id: string) {
    super(parentNode);
    this.playerId = id;
    this.canvas = new Control(this.node, 'canvas');
    this.canvas.node.width = 500;
    this.canvas.node.height = 500;
    this.canvas.node.style.background = 'green';
    this.ctx = this.canvas.node.getContext('2d');
    this.interactiveList = interactiveList;
    this.cursorStatus = new GameCursorStatus(this.playerId);
    
  

    let preventSelect = false;
    this.canvas.node.onmousedown = (e) => {
      this.cursorPosition = new Vector(e.offsetX, e.offsetY)
      // if (e.button == 2){
      //   this.cursorStatus.planned = null;
      //   this.cursorStatus.selected = [];
      // } else if (e.button == 0){
        if (this.cursorStatus.getAction()!='select') return;
        this.handleMultiSelect(this.cursorPosition, ()=>{
          preventSelect = true;
        });
      
    }

    this.canvas.node.onmousemove = (e) => {
      this.cursorPosition = new Vector(e.offsetX, e.offsetY)
      this.interactiveList.handleMove(this.cursorPosition, this.cursorPosition);
      this.cursorStatus.pixelPosition = this.cursorPosition
    }
    
    
    this.interactiveList.onChangeHovered = (lastTarget:InteractiveObject, currentTarget:InteractiveObject) => {
      this.hoveredObjects = currentTarget;
      this.cursorStatus.hovered = currentTarget ? [currentTarget] : [];
    }

    this.interactiveList.onClick = (current) => {   
      this.interactiveList.list.forEach(item => item.selected = false);
      if (current&&current.playerId === this.playerId) {
        this.setSelected(current.id)
        this.cursorStatus.selected = current ? [current] : [];  
      }
      
    };

    this.canvas.node.onclick = (e: MouseEvent) => {
      this.cursorPosition = new Vector(e.offsetX, e.offsetY);
       if (preventSelect){
        preventSelect = false;
        return;
      }     
      const action = this.cursorStatus.getAction();

      if(action === 'select'){
        this.interactiveList.handleClick(this.cursorPosition, this.cursorPosition)
      }
      if (action === 'build') {
        this.onClick?.(new Vector(e.offsetX, e.offsetY));
        this.cursorStatus.planned = null;
      }
      if (action === 'primary') {
        this.onObjectClick(this.hoveredObjects.id, this.hoveredObjects.type, this.hoveredObjects.subType);
      } 
      if (action === 'move') {
        this.cursorStatus.selected.forEach(item=>this.onChangePosition(item.id, this.cursorPosition))
        //отправлять на сервер this.cursorPosition
        //когда приходит ответ - запускать патч
        //this.cursorStatus.selected.forEach(item => (item as AbstractUnit).moveUnit(this.cursorPosition))
        this.interactiveList.list.filter(item => item.selected===true).map(item=>item.selected=false);
        this.cursorStatus.selected = [];
        SoundManager.soldierMove();}
      if (action === 'attack') {
        this.cursorStatus.selected.forEach(item => this.onAttack(item.id, this.hoveredObjects.id));
        this.interactiveList.list.filter(item => item.selected===true).map(item=>item.selected=false);
        this.cursorStatus.selected = [];
        console.log('attack');
        SoundManager.soldierAttack();
      }
    }
    
    this.startRender();
  }

  updateObject(data:IGameObjectData){
    this.interactiveList.list.find(item=>item.id === data.objectId).updateObject(data.content)
  }

  deleteObject(data:IGameObjectData){

  }

  setSelected(id: string) {
    this.interactiveList.list.find(item => item.id === id).selected = true;
  }

  setPlannedBuild(object:IObject) {
    this.cursorStatus.planned = object;
  }

  addObject(data: IGameObjectData) {
    const BuildConstructor = builds[data.type] || InteractiveObject;
    const interactiveObject = new BuildConstructor(data);
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
    this.cursorStatus.render(ctx, new Vector(0,0));
    this.interactiveList.list.forEach(it => {
      it.render(ctx,
        new Vector(0, 0),        
        it.playerId,
        it.type,
        it.primary, delta,
      );
    })
    
    ctx.fillStyle = "#fff";
    ctx.fillText('fps: ' + this.fps.toFixed(2), 0, 30);
  }

   handleMultiSelect(start:Vector, onSelect:()=>void){
    this.cursorStatus.multiStart = start; //new Vector(e.clientX, e.clientY);
    let listener = ()=>{
      
      let selection = this.interactiveList.list.filter(it=>{
        if ((it instanceof AbstractUnit) == false){
          return false;
        }
      return it.playerId==this.playerId && inBox((it as AbstractUnit).position, this.cursorStatus.multiStart,  this.cursorPosition);
      });
      this.interactiveList.list.forEach(item => item.selected = false);
      selection.forEach(item => item.selected = true);
      
      this.cursorStatus.multiStart = null;
      window.removeEventListener('mouseup', listener);
      if (selection.length){
        this.cursorStatus.selected = selection;
        onSelect();
      }
    }
    window.addEventListener('mouseup', listener);
  }
}
export function inBox(point:Vector, _start:Vector, _end:Vector){
  const start = new Vector(Math.min(_start.x, _end.x), Math.min(_start.y, _end.y));
  const end = new Vector(Math.max(_start.x, _end.x), Math.max(_start.y, _end.y));
  return point.x>start.x && point.y>start.y && point.x<end.x && point.y<end.y;
}