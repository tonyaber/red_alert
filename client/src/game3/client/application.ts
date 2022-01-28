import Control from '../../common/control';
import { SocketModel } from './socketModel';
import { ClientSocket } from './clientSocket';
import { Game } from './game';
import { LocalModel } from './localSocketModel';
import { IClientModel } from './IClientModel';
import { TestView } from './testView';
export class Application extends Control{
  socket: IClientModel;
  constructor(parentNode: HTMLElement) {
    super(parentNode);
    const startPage = new StartPage(this.node);
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
    startPage.testCanvas = () => {
      startPage.destroy();
      const testView = new TestView(this.node);
    }
  }

  startGame() {
    const authorization = new Authorization(this.node, this.socket);
    authorization.onAuth = (name) => {
      authorization.destroy();
      const settingPage = new SettingPage(this.node, this.socket);
      settingPage.onStartGame = (data) => {
        settingPage.destroy();
        const game = new Game(this.node, this.socket, name, data) ///players, name?
      }
    }
  }
}

class StartPage extends Control{
  onSinglePlay: () => void;
  onMultiPlay: () => void;
  testCanvas: () => void;
  constructor(parentNode: HTMLElement) {
    super(parentNode);
    const singlePlay = new Control(this.node, 'button', '', 'Single Play');
    singlePlay.node.onclick = () => {
      this.onSinglePlay();
    }
    const multiPlay = new Control(this.node, 'button', '', 'Multi Play');
    multiPlay.node.onclick = () => {
      this.onMultiPlay();
    }
     const testCanvas = new Control(this.node, 'button', '', 'Test');
      testCanvas.node.onclick = () => {
        this.testCanvas();
      }
  }
}
class Authorization extends Control{
  onAuth: (name: string) => void;
  constructor(parentNode: HTMLElement, socket: IClientModel) {
    super(parentNode);
    const button = new Control(this.node, 'button', '', 'Start play');
    button.node.onclick = () => {
      socket.addUser();
    }
    socket.onAuth = (name) => {
      this.onAuth(name);
    }
  }
}




class SettingPage extends Control{
  onStartGame: (players: string) => void;
  constructor(parentNode: HTMLElement,socket: IClientModel) {
    super(parentNode);
    const Setting = new Control(this.node, 'div', '', 'Setting');
    const button = new Control(this.node, 'button', '', 'Register');
    button.node.onclick = () => {
      socket.registerGamePlayer()
    }
    const button2 = new Control(this.node, 'button', '', 'Spectator');
    button2.node.onclick = () => {
      socket.registerSpectator();
    }
    socket.onStartGame = (data: string) => {
      this.onStartGame(data);
    }

  }
}