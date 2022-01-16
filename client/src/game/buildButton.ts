import Control from '../common/control';
import { IObject } from './dto';

export class BuildButton extends Control{
  button: Control;
  progress: Control;
  constructor(parentNode: HTMLElement) {
    super(parentNode);
    this.button = new Control(this.node, 'div');
    this.button.node.style.border = '1px solid black';
    this.button.node.style.padding = '10px';
    this.progress = new Control(this.node, 'div');
  }

  update(item:IObject) {
    this.button.node.textContent = item.object.name;
    this.progress.node.textContent = item.progress.toString();
  }

}