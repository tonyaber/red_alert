import Control from "../../common/control";
import { Canvas } from "./canvas";
import { IObjectContent, IStartGameResponse } from "./dto";
import { IClientModel } from "./IClientModel";
import { SidePanel } from "./sidePanel";
import { SocketModel } from "./socketModel";

export class Game extends Control{
  constructor(parentNode: HTMLElement, socket: IClientModel, id: string, sidePanelData: string) {
    super(parentNode);
    const sidePanelInfo: IStartGameResponse = JSON.parse(sidePanelData);
    if (socket instanceof SocketModel&& sidePanelInfo.type === 'spectator') {
      sidePanelInfo.players.forEach(item => {
        if (item != id) {
          const buttonPlayer = new Control(this.node, 'button', '', item);
          buttonPlayer.node.onclick = () => {
            socket.setTargetSpectator(item);
          }         
        }
      })
    }
   
    const canvas = new Canvas(this.node);
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

    sidePanel.onSidePanelClick = (selected, object) => {
      console.log(selected)
      if (selected === 'onAvailableClick') {
        socket.startBuild(object.object.name, id);
      } else if (selected === 'onIsReadyClick') {
        canvas.onClick = (position) => {
           canvas.onClick = null;
          socket.addBuild(object.object.name, position, id);
        }
      } else if (selected === 'onInprogressClick'){
        socket.pauseBuilding(object.object.name, id);
      } else if (selected === 'onIsPauseClick') {
        socket.playBuilding(object.object.name, id)
      }
    }

    canvas.onObjectClick = (id: string, name: string) => {
      socket.setPrimary(id, name)
    }

    

  }
}