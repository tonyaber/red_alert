import Control from "../../common/control";
import { IObjectInfo } from "./dto";
import { buildSidePanel } from './buildSidePanel';

export class SidePanel extends Control{
  money: Control;
  buildButtons: any = [];
  onSidePanelClick: (selected: string, object: IObjectInfo)=>void;
  unitNode: Control<HTMLElement>;
  buildNode: Control<HTMLElement>;

  constructor(parentNode: HTMLElement) {
    super(parentNode);
    this.money = new Control(this.node);

    this.buildNode = new Control(this.node, 'div', '', 'Builds');
    this.unitNode = new Control(this.node, 'div', '', 'Units');

  }

  update(data: { sidePanelData: IObjectInfo[], money: number }) {
   
    this.money.node.textContent = data.money.toFixed(2).toString();
    data.sidePanelData.map(item => {
      if (this.buildButtons[item.object.name]) {
        this.buildButtons[item.object.name].update(item)
      } else {
        const nodeParent = item.object.subType === 'build' ? this.buildNode : this.unitNode;
        const obj = new buildSidePanel(nodeParent.node);
        obj.onAvailableClick = (data) => {
          this.onSidePanelClick('onAvailableClick', data)
        }
        obj.onInprogressClick = (data) => {
          this.onSidePanelClick('onInprogressClick', data)
        }

        obj.onIsPauseClick = (data)=>{
          this.onSidePanelClick('onIsPauseClick', data)
        }

        obj.onIsReadyClick = (data) => {
          this.onSidePanelClick('onIsReadyClick', data)
        }
        obj.update(item);
        this.buildButtons[item.object.name] = obj;    
      }      
    })
    const keys = Object.keys(this.buildButtons)
    if (data.sidePanelData.length !== keys.length) {
      keys.map(item => {
        if (!data.sidePanelData.find(it => it.object.name === item)) {
          this.buildButtons[item].destroy();
        }
      })
    }   
  };
}