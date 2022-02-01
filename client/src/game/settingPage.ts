import Control from '../../../common/control';
import { IClientModel } from './IClientModel';

export class SettingPage extends Control{
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