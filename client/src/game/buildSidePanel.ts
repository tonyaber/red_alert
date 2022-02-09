import Control from '../../../common/control';
import { IObjectInfo } from './dto';
import red from './red.css'

export class buildSidePanel extends Control{
  button: Control;
  progress: Control;
  private data: IObjectInfo = null; 
  onAvailableClick: (data: IObjectInfo) => void;
  onInprogressClick: (data: IObjectInfo) => void;
  onIsReadyClick: (data: IObjectInfo) => void;
  onIsPauseClick: (data: IObjectInfo) => void;
  status: Control<HTMLElement>;
  

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', red['builds_item']);
    this.button = new Control(this.node, 'div', red['name_item']);
   // this.node.style.border = '1px solid black';
    //this.node.style.padding = '10px';
    this.progress = new Control(this.node, 'div', red['progress']);
    this.status = new Control(this.node, 'div', red['status'])
    this.node.onclick = () => {
      if (this.data) {
        if (this.data.status === 'available') {
          this.onAvailableClick(this.data);
        } else if (this.data.status === 'inProgress') {
          this.onInprogressClick(this.data);
        } else if (this.data.status === 'isPause') {
          this.onIsPauseClick(this.data);
        } else if (this.data.status === 'isReady') {
          this.onIsReadyClick(this.data);
        }
      }
    }
  }

  update(item: IObjectInfo) {
    //if(item.status)
    if(item.status === 'isReady') {
      this.node.classList.add(red['builds_item__ready']);
    } else this.node.classList.remove(red['builds_item__ready']);
    this.data = item;
    this.button.node.textContent = item.object.name;
    this.progress.node.textContent = item.progress.toString();
    this.status.node.textContent = item.status;
    if (item.status === 'notAvailable') {
      this.node.style.display = 'none'
    } else {
      this.node.style.display = 'block';
    }
  }

}