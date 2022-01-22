import Control from "../common/control";
import {Game} from '../game/game';
import {ClientSocketModel} from "../common/SocketClient";
import {IObject} from "../game/dto";
import {Vector} from "../common/vector";
import { GameObject } from "../game/gameModel";
import { SocketClient } from "../common/SocketClient1";
import { IServerResponseMessage } from "../common/socketInterface";
import { GameSocketClient } from '../game/gameSocketClient';

export class Application extends Control {
  private clientSocketModel: SocketClient
  private game: Game;

  constructor(parentNode: HTMLElement) {
    super(parentNode);
    this.clientSocketModel = new SocketClient('ws://localhost:3000/');

    const startPageModel = new StartPageSocketModel(this.clientSocketModel)
    const startPage = new StartPage(this.node, startPageModel)
    startPage.onStartPageClick = async (name) => {
      //this.send()
      startPage.destroy();
      const settingPage = new Setting(this.node, this.clientSocketModel);
      
      settingPage.onStartPage = (data) => {
        settingPage.destroy();
        console.log(data)
        const players = data;
        const gameSocketModel = new GameSocketClient(this.clientSocketModel)
        this.game = new Game(this.node, players, name, gameSocketModel);
        this.game.sendBuildData = (obj, position) => {
          //this.sendNewBuild(obj, position)
        }
        this.game.updateObject = (data: string) => {
         // this.sendUpdateObject(data);
        }
      }
      
    }

  }
  
}


class StartPageSocketModel {
  socket: SocketClient;
  private messageHandler: (message: IServerResponseMessage) => void;
  onAuth: (name: string)=>void;

  constructor(socket: SocketClient) {
    this.messageHandler = (message:IServerResponseMessage) => {
      if (message.type = 'sendName') {
        this.onAuth(JSON.parse(message.content));
      }
    }
    socket.onMessage.add(this.messageHandler)
    this.socket = socket;
  }

  sendName(){
    this.socket.sendRequest('sendName', (Math.floor(Math.random() * 100))+'Player');
  }
  destroy() {
    this.socket.onMessage.remove(this.messageHandler);

  }
}
class StartPage extends Control {
  public onStartPageClick: (name: string) => void
  socket: StartPageSocketModel;

  constructor(parentNode: HTMLElement, socket: StartPageSocketModel) {
    super(parentNode);
    
    this.socket = socket;
    const input = new Control<HTMLInputElement>(this.node, 'input')
    const button = new Control(this.node, 'button', '', 'Start')
    button.node.onclick = () => {
      this.socket.sendName();
      
    }
    socket.onAuth = (name) => {
      this.onStartPageClick(name);
    }
  } 

  destroy(): void {
    this.socket.destroy();
    super.destroy();

  }

}


class Setting extends Control {
  public onSettingPageClick: () => void
  socket: SocketClient;
  messageHandler: (message: IServerResponseMessage) => void;
  onStartPage: (message: string[]) => void;

  constructor(parentNode: HTMLElement, socket: SocketClient) {
    super(parentNode);
    const setting = new Control(this.node, 'button', '', 'Setting');
    this.socket = socket;
    this.messageHandler = (message:IServerResponseMessage) => {
      if (message.type === 'startGame') {
        this.onStartPage(JSON.parse(message.content));
      }
    }
    socket.onMessage.add(this.messageHandler)

    
  }
  destroy() {
    this.socket.onMessage.remove(this.messageHandler);
    super.destroy();
  }

}


