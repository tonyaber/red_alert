import Control from "../../../common/control";
import { Vector } from "../../../common/vector";
import { Canvas } from "./canvasView2";
import { IStartGameResponse } from "./dto";
import { IClientModel } from "./IClientModel";
import { SidePanel } from "./sidePanel";
import { SocketModel } from "./socketModel";
import red from './red.css'


export class Game extends Control{
  onExit: () => void;
  onPause: () => void;
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

   /*
    const wrapperGameControls = new Control(this.node, 'div', red['wrap_game_controls']);
    const exit = new Control(wrapperGameControls.node, 'button', red['exit_game'], 'exit');
    exit.node.onclick = () => {
      this.onExit();
    }
    const pause = new Control(wrapperGameControls.node, 'button', red['pause_game'], 'pause');
    if(sidePanelInfo.type === 'spectator'){ pause.node.setAttribute('disabled', 'true')}
    pause.node.onclick = () => {
      this.onPause(); //TODO сделать попап с паузой
    }
*/
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

    socket.onDeleteObject = (data) => {
      canvas.deleteObject(data)
    }

    socket.onShot = (point) => {
      canvas.addShot(point);
    }
     socket.onMoveBullet = (point) => {
      canvas.addBullet(point);
    }

    sidePanel.onSidePanelClick = (selected, object) => {
      if (selected === 'onAvailableClick') {
        socket.startBuild(object.object.name, id).then((result) => {
          console.log(result);
        })
      } else if (selected === 'onIsReadyClick') {
        canvas.setPlannedBuild(object.object);
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

    canvas.onClick = (position, name) => {
        socket.addBuild(name, position, id).then((result) => {
          console.log(result);
      });
    }

    canvas.onChangePosition = (id: string, position: Vector) => {
      socket.moveUnit(id, position).then((result) => {
          console.log(result,'UNIT');
        });
    }
  canvas.onAttack = (id: string, targetId: string) => {
      socket.setAttackTarget(id, targetId).then((result) => {
        console.log(result)
      })
    }

    
    // const imageData = getImageData(res.map)
    // const mapGame = getMapFromImageData(imageData);

    // socket.createMap(mapGame);

    // sidePanelInfo.players.map((it, index) => {
    //   if (sidePanelInfo.type != 'spectator') {
    //     INITIAL_DATA[index].forEach(el => {
    //       socket.addInitialData(el.name, el.position, it)
    //     })
    //   }      
    // });

    

    this.node.onclick = ()=>{
     // this.node.requestFullscreen();
    }

    const handleBorder = (position:Vector, border:number)=>{
      const scrollVector = new Vector(0, 0);
      if (position.x < border){
        scrollVector.x = -1;
      }
      if (position.y < border){
        scrollVector.y = -1;
      }
      if (position.x > this.node.clientWidth - border){
        scrollVector.x = 1;
      }
      if (position.y > this.node.clientHeight - border){
        scrollVector.y = 1;
      }
      return scrollVector;
    }

    const moveHandler = (e: MouseEvent)=>{
      const border = Math.min(20, this.node.clientWidth / 3, this.node.clientHeight / 3);
      const scrollVector = handleBorder(new Vector(e.clientX, e.clientY), border);
      canvas.setScrollDirection(scrollVector, 1);  
    }

    const mouseLeaveHandler = (e: MouseEvent)=>{
      const border = Math.min(100, this.node.clientWidth / 3, this.node.clientHeight / 3);
      const scrollVector = handleBorder(new Vector(e.offsetX, e.offsetY), border);
      canvas.setScrollDirection(scrollVector, 1);
    }

    const mouseEnterHandler = ()=>{
      const scrollVector = new Vector(0, 0);
      canvas.setScrollDirection(scrollVector, 0.95);
    }

    const handleScrolls = ()=>{
      const isFullScreenMode = window.document.fullscreenElement == this.node
      if (isFullScreenMode){
        this.node.onmouseleave = null;
        this.node.onmouseenter =null;
        this.node.onmousemove = moveHandler;
      } else {
        this.node.onmousemove = null;
        this.node.onmouseleave = mouseLeaveHandler;
        this.node.onmouseenter = mouseEnterHandler;
      }
    }

    this.node.onfullscreenchange = handleScrolls;
    handleScrolls();

  }
}