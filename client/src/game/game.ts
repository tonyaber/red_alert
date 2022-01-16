import Control from "../common/control";
import { GameModel } from './gameModel';
import { GameCanvas } from './gameCanvas';
import { GameSidePanel } from './gameSidePanel';
import { ITickable } from "./dto";
export class Game extends Control{
  constructor(parentNode: HTMLElement) {
    super(parentNode);
    const model = new GameModel();
    const canvas = new GameCanvas(this.node, model);
    const sidePanel = new GameSidePanel(this.node, model);
    const tickList = new TickList();
    tickList.add(model);

    //Bot here

  }


}


class TickList {
  setInt: NodeJS.Timer;
  tickable: ITickable[];
  lastTick: number;
  
  constructor() {
    this.lastTick = Date.now();
    this.setInt = setInterval(() => {
      const delta = Date.now() - this.lastTick;
      this.tickable.forEach(item => {
        item.tick(delta);
      })
    }, 200)
  }

  add(item:ITickable) {
    this.tickable.push(item);
  }

}