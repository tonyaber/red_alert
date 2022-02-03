import { Vector } from '../../../../../common/vector';
import { IGameObjectContent, IGameObjectData } from '../../dto';
import { InteractiveObject } from '../../interactiveObject';

export class AbstractUnit extends InteractiveObject{
  subType: string = 'unit';
  id: string;
  playerId: string;
  position: Vector;
  type: string;
  primary: boolean = false;
  selected: boolean;
  action: string;
  constructor(data: IGameObjectData) {
    super();
    this.id = data.objectId;
    this.type = data.type;
    this.updateObject(data.content)
    const colors = ['#f00', '#ff0', '#00f', '#0f0', '#ffa500'];
    this.color = this.playerId.includes('bot') ? colors[Math.floor(Math.random()*5)] : '#999';
  }

  updateObject(data: IGameObjectContent) {
    this.position = data.position;
    this.playerId = data.playerId;
  }

   inShape(tile: Vector, cursor: Vector): boolean {
      let pos = cursor.clone().sub(new Vector(this.position.x, this.position.y));
    if (pos.abs()<15){
      return true;
    }
    return false;
   }
  
  render(ctx: CanvasRenderingContext2D, camera: Vector, playerId: string, type: string, primary: boolean): void {
    const sz = 10;
    ctx.fillStyle = this.color;
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(camera.x + this.position.x /*+ (55-10)/2*/, camera.y+ this.position.y /*+ (55-10)/2*/, sz, sz, 0, 0, Math.PI*2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillText(type, this.position.x + 20, this.position.y + 20);
    ctx.fillText(playerId, this.position.x + 20, this.position.y + 10);
    if (this.selected) {
      ctx.fillText("Selected", this.position.x + 20, this.position.y);
    }
  }

  moveUnit(target: Vector) {
    this.action = 'move'
    const direction = target.clone().sub(this.position);
    const interval = setInterval(() => {
      this.position.add(direction.clone().scale(0.01));
      if (Math.round(this.position.x) == target.x && Math.round(this.position.y) == target.y) {
        clearInterval(interval);
        this.selected = false;
        this.action = 'nothing'
      }
    })    
  }

  attack(target: InteractiveObject) {
    this.action = 'move';
    const newPosition = target.position.clone().add(new Vector(20,20))
    const direction = newPosition.clone().sub(this.position);
    const interval = setInterval(() => {
      this.position.add(direction.clone().scale(0.01));
      if (Math.round(this.position.x) == newPosition.x && Math.round(this.position.y) == newPosition.y) {
        clearInterval(interval);
        this.selected = false;
        this.action = 'attack';
      }
    })
  }
  logic() {
    
  }
}
