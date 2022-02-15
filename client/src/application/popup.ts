import Control from '../../../common/control';
import style from './popup.css'

export default class PopupPage extends Control{
  onBack: () => void;
  constructor(parentNode:HTMLElement, titleContent:string, messageContent:string ){
    super(parentNode, 'div', style['popup'] );
    const body = new Control(this.node, 'div', style['popup_body']);
    const content = new Control(body.node, 'div', style['popup_content']);
    const title = new Control(content.node, 'div', style['popup_title'], `${titleContent}`);
    const message = new Control(content.node, 'div', style['popup_message'], `${messageContent}`);
    const btnOk = new Control(content.node, 'button', style['popup_button'], 'back');
    btnOk.node.onclick = () => {
      this.onBack();
    }
  }
}