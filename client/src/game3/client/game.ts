import Control from "../../common/control";
import { Canvas } from "./canvasView2";
import { IObjectContent, IStartGameResponse } from "./dto";
import { IClientModel } from "./IClientModel";
import { SidePanel } from "./sidePanel";
import { SocketModel } from "./socketModel";

export class Game extends Control{
  constructor(parentNode: HTMLElement, socket: IClientModel, id: string, sidePanelData: string, res:Record<string, HTMLImageElement>) {
    super(parentNode);
    const sidePanelInfo: IStartGameResponse = JSON.parse(sidePanelData);
    if (socket instanceof SocketModel&& sidePanelInfo.type === 'spectator') {
      sidePanelInfo.players.forEach(item => {
        const buttonPlayer = new Control(this.node, 'button', '', item);
        buttonPlayer.node.onclick = () => {
          
        }
      })
    }
   
    const canvas = new Canvas(this.node, res);
    const sidePanel = new SidePanel(this.node);
    
    sidePanel.update(sidePanelInfo.sidePanel);
    
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

    canvas.onObjectClick = (id: string, name: string) => {
      socket.setPrimary(id, name)
    }

    

  }
}