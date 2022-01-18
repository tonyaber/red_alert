import Control from "../common/control";
import { GameModel } from './gameModel';
import { GameCanvas } from './gameCanvas';
import { GameSidePanel } from './gameSidePanel';
import { IObjectInfo, ITickable } from "./dto";
import { InteractiveObject } from "./interactiveObject";
import { InteractiveTile } from './interactiveTile';
export class Game extends Control{
  constructor(parentNode: HTMLElement) {
    super(parentNode);
    const model = new GameModel();
    const canvas = new GameCanvas(this.node, model);
    const sidePanel = new GameSidePanel(this.node, model);
    const tickList = new TickList();
    tickList.add(model);
    sidePanel.onSelectReady = (obj) => {
      canvas.onClick = (position) => {
        canvas.onClick = null;
        model.addBuild(obj);
        
        const tile = new InteractiveTile();
        tile.position = position;
        
        canvas.interactiveList.add(tile);
      }
    }

  }


}


class TickList {
  setInt: NodeJS.Timer;
  tickable: ITickable[] = [];
  lastTick: number;
  
  constructor() {
    this.lastTick = Date.now();
    this.setInt = setInterval(() => {
      const currentTick = Date.now()
      const delta = currentTick - this.lastTick;
      this.lastTick = currentTick;
      this.tickable.forEach(item => {
        item.tick(delta);
      })
    }, 200)
  }

  add(item:ITickable) {
    this.tickable.push(item);
  }

}