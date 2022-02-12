import Control from '../../../common/control';
import { IClientModel } from '../game/IClientModel';
import style from './authorization.css'

export class Authorization extends Control{
  onAuth: (name: string) => void;
  onHome: () => void;
  
  constructor(parentNode: HTMLElement, socket: IClientModel) {
    super(parentNode, 'div', style['main'], 'AUTHORIZTION');
    
    socket.onAuth = (name) => {
      this.onAuth(name);
    }

    const body = new Control(this.node, 'div', style['body'], ``);

    const content = new Control(body.node, 'div', style['content'], `authorization form`);

    const userName = new Control(content.node, 'div', style['user_name'], `!!!user name!!!`);

    const play = new Control(content.node, 'button', style['play_btn'], 'Start play');
    play.node.onclick = () => {
      socket.addUser();
    }

    const cancel = new Control(content.node, 'button', style['cancel_btn'], 'Cancel');
    cancel.node.onclick = () => {
      this.onHome();
    }
    
  }
}
