import Control from "../common/control";
import { Game } from '../game/game';
export class Application extends Control{
  constructor(parentNode: HTMLElement) {
    super(parentNode);
    const game = new Game(this.node);
    
  }

}