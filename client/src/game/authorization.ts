import Control from '../../../common/control';
import { IClientModel } from './IClientModel';

export class Authorization extends Control{
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
