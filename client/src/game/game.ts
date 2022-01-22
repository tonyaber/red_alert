import Control from "../common/control";
import { GameModel, GameObject } from './gameModel';
import { GameCanvas } from './gameCanvas';
import { GameSidePanel } from './gameSidePanel';
import {IObject, IObjectInfo, ITickable} from "./dto";
import { InteractiveObject } from "./interactiveObject";
import { InteractiveTile } from './interactiveTile';
import { Vector } from "../common/vector";
import { createIdGenerator } from './idGenerator';
import { globalGameInfo } from './globalIdGenerator';
import { GamePlayerServer } from '../../../server/src/gameModelServer';
export class Game extends Control{
  sendBuildData: (obj: IObject, position: Vector) => void;
  updateObject: (data: string) => void;
  private model: GameModel;
  constructor(parentNode: HTMLElement, players: string[], name: string) {
    super(parentNode);
    this.model = new GameModel(players, name);
    const canvas = new GameCanvas(this.node, this.model);
    const sidePanel = new GameSidePanel(this.node, this.model);
    const tickList = new TickList();
    tickList.add(this.model);

    sidePanel.onSelectReady = (obj) => {
      canvas.onClick = (position) => {
        canvas.onClick = null;
        //this.model.addBuild(obj, position.clone());
        this.sendBuildData(obj, position.clone())
      }
    }

    this.model.updateModel = (data: string) => {
      this.updateObject(data)
    }
    const idGenerator =  createIdGenerator('playerId')
    globalGameInfo.nextId = () => {
      return idGenerator();
    }
  }

  getNewBuild(data: {  object: IObject, name: string, position: Vector }) {
    this.model.addBuild(data)
  }
  setNewObject(data: string) {
    this.model.setNewObject(data)
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