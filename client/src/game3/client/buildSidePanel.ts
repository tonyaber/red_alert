import Control from '../../common/control';
import { IObjectInfo } from './dto';

export class buildSidePanel extends Control{
  button: Control;
  progress: Control;
  private data: IObjectInfo = null; 
  onAvailableClick: (data: IObjectInfo) => void;
  onInprogressClick: (data: IObjectInfo) => void;
  onIsReadyClick: (data: IObjectInfo) => void;
  onIsPauseClick: (data: IObjectInfo) => void;
  
  constructor(parentNode: HTMLElement) {
    super(parentNode);
    this.button = new Control(this.node, 'div');
    this.node.style.border = '1px solid black';
    this.node.style.padding = '10px';
    this.progress = new Control(this.node, 'div');
    this.node.onclick = () => {
      if (this.data) {
        if (this.data.status === 'Available') {
          this.onAvailableClick(this.data);
        } else if (this.data.status === 'InProcess') {
          this.onInprogressClick(this.data);
        } else if (this.data.status === 'isPause') {
          this.onIsPauseClick(this.data);
        }
        else if (this.data.status === 'isReady') {
          this.onIsReadyClick(this.data);
        }
      }
    }
  }

  update(item: IObjectInfo) {
    //if(item.status)
    this.data = item;
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