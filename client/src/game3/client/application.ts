import Control from '../../common/control';
import { SocketModel } from './socketModel';
import { ClientSocket } from './clientSocket';
import { Game } from './game';

export class Application extends Control{
  socket: SocketModel;
  constructor(parentNode: HTMLElement) {
    super(parentNode);
    const clientSocket = new ClientSocket('ws://localhost:3000/');
    this.socket = new SocketModel(clientSocket);
    const startPage = new StartPage(this.node, this.socket);
    startPage.onAuth = (name) => {
      startPage.destroy();
      const settingPage = new SettingPage(this.node, this.socket);
      settingPage.onStartGame = (players) => {
        settingPage.destroy();
        const game = new Game(this.node, this.socket, name) ///players, name?
      }
    }
  }
}

class StartPage extends Control{
  onAuth: (name: string) => void;
  constructor(parentNode: HTMLElement, socket: SocketModel) {
    super(parentNode);
    const button = new Control(this.node, 'button', '', 'Start');
    button.node.onclick = () => {
      socket.addUser();
    }
    socket.auth = (name) => {
      this.onAuth(name);
    }
  }
}

class SettingPage extends Control{
  onStartGame: (players: string) => void;
  constructor(parentNode: HTMLElement,socket: SocketModel) {
    super(parentNode);
    const Setting = new Control(this.node, 'div', '', 'Setting');
    socket.onStartGame = (players: string) => {
      this.onStartGame(players);
    }

  }
}