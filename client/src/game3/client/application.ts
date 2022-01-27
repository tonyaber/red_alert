import Control from '../../common/control';
import { SocketModel } from './socketModel';
import { ClientSocket } from './clientSocket';
import { Game } from './game';
import { LocalModel } from './localSocketModel';
import { IClientModel } from './IClientModel';
export class Application extends Control{
  socket: IClientModel;
  constructor(parentNode: HTMLElement) {
    super(parentNode);
    const clientSocket = new ClientSocket('ws://localhost:3000/');
    //this.socket = new SocketModel(clientSocket);
    this.socket = new LocalModel();
    const startPage = new StartPage(this.node, this.socket);
    startPage.onAuth = (name) => {
      startPage.destroy();
      const settingPage = new SettingPage(this.node, this.socket);
      settingPage.onStartGame = (data) => {
        settingPage.destroy();
        const game = new Game(this.node, this.socket, name, data) ///players, name?
      }
    }
  }
}

class StartPage extends Control{
  onAuth: (name: string) => void;
  constructor(parentNode: HTMLElement, socket: IClientModel) {
    super(parentNode);
    const button = new Control(this.node, 'button', '', 'Start');
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
    socket.onStartGame = (data: string) => {
      this.onStartGame(data);
    }

  }
}