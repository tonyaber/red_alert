import Control from "../common/control";
import { GameModel/* GameObject */} from './gameModel';
import { GameCanvas } from './gameCanvas';
import { GameSidePanel } from './gameSidePanel';
import {IObject, IObjectInfo, ITickable} from "./dto";
import { InteractiveObject } from "./interactiveObject";
import { InteractiveTile } from './interactiveTile';
import { Vector } from "../common/vector";
import { createIdGenerator } from './idGenerator';
import { globalGameInfo } from './globalIdGenerator';
import { GamePlayerServer } from '../../../server/src/gameModelServer';
import {TestListView} from './testListView';
import { ClientSocketModel } from "../common/SocketClient";
import { ListModel, ListSocketClient } from "./list";
import { SocketClient } from "../common/SocketClient1";
import { GameSocketClient } from "./gameSocketClient";
//import { TestListView1 } from "./gameModel1";
import { IListItem } from './gameModel1';
export class Game extends Control{
  sendBuildData: (obj: IObject, position: Vector) => void;
  updateObject: (data: string) => void;
  private model: GameModel;
  constructor(parentNode: HTMLElement, players: string[], name: string, socket:GameSocketClient) {
    super(parentNode);
    this.model = new GameModel(players, name, socket.socket);
    this.model.onUpdateSidePanel.add(()=>{
      console.log('side update');
      sidePanel.update();
    });
    const canvas = new GameCanvas(this.node, this.model);
    const sidePanel = new GameSidePanel(this.node, this.model);
    const tickList = new TickList();
    tickList.add(this.model);

    sidePanel.onSelectReady = (obj) => {
      canvas.onClick = (position) => {
        canvas.onClick = null;
      
        this.model.addBuild({object: obj, playerName:name, position: position.clone()});
        //
       /* listSocketModelClient.addItem({
          position: position,
          health: 100,
          type: obj.object.name,
          player: name,
        });*/
        //socket.sendNewBuild(obj, position.clone());
      }
    }
    canvas.onObjectClick = (id) => {
      this.model.damageBuild(id);
      //listSocketModelClient.updateItem(id, {...listModel.getList()[id], health: 50} )
    }

    // this.model.updateModel = (data: string) => {
    //   socket.updateObject(data)
    // }
    const idGenerator =  createIdGenerator('playerId')
    globalGameInfo.nextId = () => {
      return idGenerator();
    }
    // const testListModel = new ListModel(createIdGenerator('itemId'));
    // const testListAnyModel = new ListSocketClient(socket.socket, testListModel);
    // //const testListAnyModel = new TestListLocalModel(testListModel);
    // const testListView = new TestListView(this.node, testListAnyModel);

    // socket.onAddNewBuild = (data: string) => {
    //   this.model.addBuild(JSON.parse(data));
    // }
    // socket.onGetUpdateObject = (data: string) => {
    //   this.model.setNewObject(JSON.parse(data))
    // }

    //const listModel = new ListModel<IListItem>(createIdGenerator('objectId'))
    //const listSocketModelClient = new ListSocketClient<IListItem>(socket.socket, listModel) 
    //const testListView1 = new TestListView1(listSocketModelClient);
  }

}

class TickList {
  setInt: NodeJS.Timer;
  tickable: ITickable[] = [];
  lastTick: number;
  
  constructor() {
    this.lastTick = Date.now();
    this.setInt = setInterval(() => {
      const currentTick = Date.now()
      const delta = currentTick - this.lastTick;
      this.lastTick = currentTick;
      this.tickable.forEach(item => {
        item.tick(delta);
      })
    }, 200)
  }

  add(item:ITickable) {
    this.tickable.push(item);
  }

}