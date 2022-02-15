import Control from '../../../common/control';
import style from './popup.css'
import { IClientModel } from '../game/IClientModel';

export default class InfoPage extends Control{
  //onBack: () => void;
  onStartGame: (data:string) => void;
  constructor(parentNode:HTMLElement, socket: IClientModel/*titleContent:string, messageContent:string*/ ){
    super(parentNode, 'div', style['popup'] );
    socket.onStartGame = (data: string) => {
      this.onStartGame(data);
  }
    

    const body = new Control(this.node, 'div', style['popup_body']);
    const content = new Control(body.node, 'div', style['popup_content']);
    const title = new Control(content.node, 'div', style['popup_title'], 'title');//`${titleContent}`);
    const message = new Control(content.node, 'div', style['popup_message'], 'content');//`${messageContent}`);
    const btnOk = new Control(content.node, 'button', style['popup_button'], 'create');
    btnOk.node.onclick = () => {
      socket.addUser();
     // this.onBack();
    }

  }
}