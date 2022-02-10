import { Vector } from "../../../../common/vector";
import { IGameObjectContent } from "../dto";
import { CachedSprite } from './cachedSprite';

interface IBuildingInfoState{
  name: string
  health: number
  playerId: string
  primary: boolean
}
export class BuildingInfoView extends CachedSprite{
  /*private health: number;
  private name: string;
  private isPrimary: boolean;
  private img: HTMLImageElement;
  private playerId: string;*/
  
  private res: Record<string, HTMLImageElement>;

  constructor(position: Vector, res: Record<string, HTMLImageElement>/*, img: HTMLImageElement, name: string, health: number,  playerId: string, isPrimary: boolean*/) {    
    super(200, 200, position);
    this.res = res
    //this.img = img;
    //this.name = name;
    //this.health = health;
    //this.playerId = playerId;
    //this.isPrimary = isPrimary;
  }

  update(nextState:IBuildingInfoState): void {
    const data = nextState;

    const topText = this.ctx.measureText('h').actualBoundingBoxAscent;
    this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#f00";
    
    this.ctx.drawImage(/*this.img*/ this.res['barrack'], 0, 0, 200, 200);
    this.ctx.fillText('health: ' + data.health.toString(), 0, topText);
    this.ctx.fillText('name: ' + data.name, 0, topText * 2);
    this.ctx.fillText(data.playerId, 0, topText * 3);
    
    if (data.primary) {
      this.ctx.fillText('Primary', 0, topText * 4);
    }
    this.onUpdate?.();
  }
}