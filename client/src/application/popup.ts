import Control from '../../../common/control';
import style from './popup.css'
interface IOptions{
  title:string,
  message:string,
  button:string
}

export default class PopupPage extends Control{
  onBack: () => void;
  onClose: () => void;
  constructor(parentNode:HTMLElement, options:IOptions ){
    super(parentNode, 'div', style['popup'] );
    const body = new Control(this.node, 'div', style['popup_body']);
    const content = new Control(body.node, 'div', style['popup_content']);
    const close = new Control(content.node, 'div', style['close_button'], `X`);
    close.node.onclick = () => {
      this.onClose();
    }
    const title = new Control(content.node, 'div', style['popup_title'], `${options.title}`);
    const message = new Control(content.node, 'div', style['popup_message'], `${options.message}`);
    const btnOk = new Control(content.node, 'button', style['popup_button'], `${options.button}`);
    btnOk.node.onclick = () => {
      this.onBack();
    }
  }
}