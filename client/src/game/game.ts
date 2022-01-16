import Control from "../common/control";
import { GameModel } from './gameModel';
import { GameCanvas } from './gameCanvas';
import { GameSidePanel } from './gameSidePanel';

export class Game extends Control{
  constructor(parentNode: HTMLElement) {
    super(parentNode);
    const model = new GameModel();
    const canvas = new GameCanvas(this.node, model);
    const sidePanel = new GameSidePanel(this.node, model);

  }
}