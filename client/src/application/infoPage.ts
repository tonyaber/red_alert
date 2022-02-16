import Control from '../../../common/control';
import style from './popup.css'
import { IClientModel } from '../game/IClientModel';

export default class InfoPage extends Control{
  onBack: () => void;
  onStartGame: (data:string) => void;
  constructor(parentNode:HTMLElement, socket: IClientModel/*titleContent:string, messageContent:string*/ ){
    super(parentNode, 'div', style['popup'] );
    socket.onStartGame = (data: string) => {
      console.log('onStartGame')
      this.onStartGame(data);
  }
    

    const body = new Control(this.node, 'div', style['popup_body']);
    const content = new Control(body.node, 'div', style['popup_content']);
    const title = new Control(content.node, 'div', style['popup_title'], 'Сongratulations!');//`${titleContent}`);
    const message = new Control(content.node, 
      'div', 
      style['popup_message'], 
      `You created new game! </br>
      There are all options of your game: </br>
      Credit: </br>
      Speed: </br>
      Bot's amount:</br>
      If all OK, press button 'create'. </br>
      Good luck!`);//`${messageContent}`);
    const wrapperButton = new Control(content.node, 'div', style['wrapper_button'], '');
    const btnOk = new Control(wrapperButton.node, 'button', style['popup_button'], 'create');
    btnOk.node.onclick = () => {
      console.log('onAddUser')
      socket.addUser();
     // this.onBack();
    }
    const btnCancel = new Control(wrapperButton.node, 'button', style['popup_button'], 'cancel');
    btnCancel.node.onclick = () => {
      this.onBack();
    }



  }
}