import Control from '../common/control';
import { IObject } from './dto';

export class BuildButton extends Control{
  button: Control;
  progress: Control;
  constructor(parentNode: HTMLElement) {
    super(parentNode);
    this.button = new Control(this.node, 'div');
    this.node.style.border = '1px solid black';
    this.node.style.padding = '10px';
    this.progress = new Control(this.node, 'div');
  }

  update(item: IObject) {
    //if(item.status)
    this.button.node.textContent = item.object.name;
    this.progress.node.textContent = item.progress.toString();
    
    if (item.status === 'notAvailable') {
      this.node.style.display = 'none'
    } else {
      this.node.style.display = 'block';
    }
    if (item.status === 'isReady') {
      this.progress.node.textContent = 'is Ready';
    }
  }

}