import Control from "../../common/control";
import { IObjectInfo } from "./dto";
import { buildSidePanel } from './buildSidePanel';

export class SidePanel extends Control{
  money: Control;
  buildsButtons: any[];

  buildButtons: any;
  onSidePanelClick: (selected: string, object: IObjectInfo)=>void;

  constructor(parentNode: HTMLElement) {
    super(parentNode);
    this.money = new Control(this.node);

  }

  update(data: { data: IObjectInfo[], money: number }) {
    this.money.node.textContent = data.money.toFixed(2).toString();
    data.data.map(item => {
      if (this.buildButtons[item.object.name]) {
        this.buildButtons[item.object.name].update(item)
      } else {
        const obj = new buildSidePanel(this.node);
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
    if (data.data.length !== keys.length) {
      keys.map(item => {
        if (!data.data.find(it => it.object.name === item)) {
          this.buildButtons[item].destroy();
        }
      })
    }   
  };
}