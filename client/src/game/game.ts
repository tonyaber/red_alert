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

import { TickList } from './tickList';
export class Game extends Control{
  sendBuildData: (obj: IObject, position: Vector) => void;
  updateObject: (data: string) => void;
  private model: GameModel;
  constructor(parentNode: HTMLElement, players: string[], name: string, socket:GameSocketClient) {
    super(parentNode);
    this.model = new GameModel(players, name, socket.socket);
    this.model.onUpdateSidePanel.add(()=>{
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
      }
    }
    canvas.onObjectClick = (id) => {
      this.model.damageBuild(id);
    }

    const idGenerator =  createIdGenerator('playerId')
    globalGameInfo.nextId = () => {
      return idGenerator();
    }
  }
}
