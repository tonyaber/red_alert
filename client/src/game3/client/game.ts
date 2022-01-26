import Control from "../../common/control";
import { Canvas } from "./canvas";
import { IObjectContent } from "./dto";
import { SidePanel } from "./sidePanel";
import { SocketModel } from "./socketModel";

export class Game extends Control{
  constructor(parentNode: HTMLElement, socket: SocketModel, id: string, sidePanelData: string) {
    super(parentNode);
    const canvas = new Canvas(this.node);
    const sidePanel = new SidePanel(this.node);
    const sidePanelInfo = JSON.parse(sidePanelData);
    sidePanel.update(sidePanelInfo.sidePanelData);
    
    socket.onSideUpdate = (data) => {
      sidePanel.update(data);
    }
    socket.onUpdate = (data)=> {
      canvas.updateObject(data)
    }
    socket.onAddObject = (data) => {
      canvas.addObject(data);
    }

    sidePanel.onSidePanelClick = (selected, object)=> {
      if (selected === 'onAvailableClick') {
        socket.startBuild(object.object.name, id);
      } else if (selected === 'onIsReadyClick') {
        canvas.onClick = (position) => {
           canvas.onClick = null;
          socket.addBuild(object.object.name, position, id);
        }
      }
    }

    

  }
}