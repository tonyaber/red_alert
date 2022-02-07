import Control from '../../../common/control';
import { SocketModel } from '../game/socketModel';
import { ClientSocket } from '../game/clientSocket';
import { Game } from '../game/game';
import { LocalModel } from '../game/localSocketModel';
import { IClientModel } from '../game/IClientModel';
import { StartPage } from '../game/startPage';
import { Authorization } from '../game/authorization';
import { SettingPage } from '../game/settingPage';
import { SoundManager } from '../game/soundManager'
import { resourceLoader, resources } from '../game/resources';


export class Application extends Control{
  socket: IClientModel;
  constructor(parentNode: HTMLElement) {
    super(parentNode);
    const startPage = new StartPage(this.node);
    SoundManager.preload();
    startPage.onSinglePlay = () => {
      startPage.destroy();
      this.socket = new LocalModel();
      this.startGame();
    }
    startPage.onMultiPlay = () => {
      startPage.destroy();
      const clientSocket = new ClientSocket('ws://localhost:3000/');
      this.socket = new SocketModel(clientSocket);
      this.startGame();      
    }
  }

  startGame() {
    const authorization = new Authorization(this.node, this.socket);
    authorization.onAuth = (name) => {
      authorization.destroy();
      const settingPage = new SettingPage(this.node, this.socket);
      settingPage.onStartGame = (data) => {
        settingPage.destroy();
         resourceLoader.load(resources).then(res=>{
          const game = new Game(this.node, this.socket, name, data, res.textures) 
        })
      }
    }
  }
}
