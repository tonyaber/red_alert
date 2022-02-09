import Control from "../../../common/control";
import { Vector } from "../../../common/vector";
import { Canvas } from "./canvasView2";
import { IStartGameResponse } from "./dto";
import { IClientModel } from "./IClientModel";
import { SidePanel } from "./sidePanel";
import { SocketModel } from "./socketModel";
import red from './red.css'

export class Game extends Control{
  constructor(parentNode: HTMLElement, socket: IClientModel, id: string, sidePanelData: string,res:Record<string, HTMLImageElement>) {
    super(parentNode, 'div', red['global_main']);
    const sidePanelInfo: IStartGameResponse = JSON.parse(sidePanelData);
    if (socket instanceof SocketModel && sidePanelInfo.type === 'spectator') {
      sidePanelInfo.players.forEach(item => {
        if (item != id) {
          const buttonPlayer = new Control(this.node, 'button', '', item);
          buttonPlayer.node.onclick = () => {
            socket.setTargetSpectator(item);
          }
        }
      })
    }
   
    const wrapperGameControls = new Control(this.node, 'div', red['wrap_game_controls']);
    const exit = new Control(wrapperGameControls.node, 'button', red['exit_game'], 'exit');
    const pause = new Control(wrapperGameControls.node, 'button', red['pause_game'], 'pause');

    const canvas = new Canvas(this.node, res, id);//id
    const sidePanel = new SidePanel(this.node);
    
    sidePanel.update(sidePanelInfo.sidePanel);
    
    socket.onSideUpdate = (data) => {
      sidePanel.update(data);
    }
    socket.onUpdate = (data) => {
     // console.log(data,'GAme')
      canvas.updateObject(data)
    }
    socket.onAddObject = (data) => {
      canvas.addObject(data);
    }

    sidePanel.onSidePanelClick = (selected, object) => {
      if (selected === 'onAvailableClick') {
        socket.startBuild(object.object.name, id).then((result) => {
          console.log(result);
        })
      } else if (selected === 'onIsReadyClick') {
        canvas.setPlannedBuild(object.object);
        canvas.onClick = (position) => {
          canvas.onClick = null;
          socket.addBuild(object.object.name, position, id).then((result) => {
            console.log(result);
          });
        }
      } else if (selected === 'onInprogressClick') {
        socket.pauseBuilding(object.object.name, id).then((result) => {
          console.log(result);
        });;
      } else if (selected === 'onIsPauseClick') {
        socket.playBuilding(object.object.name, id).then((result) => {
          console.log(result);
        });
      }
    }

    canvas.onObjectClick = (id: string, name: string, subType) => {
      if (subType === 'build') {
        socket.setPrimary(id, name).then((result) => {
          console.log(result);
        });
      }
      if (subType === 'unit') {
        //canvas.setSelected(id);
      }
    }

    canvas.onChangePosition = (id: string, position: Vector,tileSize:number) => {
      socket.moveUnit(id, position,tileSize).then((result) => {
          console.log(result,'UNIT');
        });
    }
    // canvas.onAttack = (id: string, targetId: string) => {
    //   socket.setAttackTarget(id, targetId).then((result) => {
    //     console.log(result)
    //   })
    // }
    

    

  }
}