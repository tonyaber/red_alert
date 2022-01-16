import Control from '../common/control';
import { GameModel } from "./gameModel";

export class GameCanvas extends Control{
  model: GameModel;
  updateHandler: () => void;

  constructor(parentNode: HTMLElement,model: GameModel) {
    super(parentNode);
       this.model = model;

    this.updateHandler = () => {
      //blablabla
    }
    this.model.onUpdateCanvas.add(this.updateHandler);
  }

  destroy() {
    this.model.onUpdateCanvas.remove(this.updateHandler);
  
  }
}