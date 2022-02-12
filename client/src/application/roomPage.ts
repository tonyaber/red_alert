import Control from '../../../common/control';
import { IClientModel } from '../game/IClientModel';
import style from './roomPage.css'

export class RoomPage/*SettingPage*/ extends Control{   //RoomPage???
  onStartGame: (players: string) => void;
  constructor(parentNode: HTMLElement,socket: IClientModel) {
    super(parentNode, 'div', style['room_main'], 'Room Page');
    const Setting = new Control(this.node, 'div', '', 'чатик....');
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

