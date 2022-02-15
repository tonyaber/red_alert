import Control from '../../../common/control';
import style from './popup.css'

export default class OptionsPage extends Control{
  onBack: () => void;
  constructor(parentNode:HTMLElement){
    super(parentNode, 'div', style['popup'] );
    const body = new Control(this.node, 'div', style['popup_body']);
    const content = new Control(body.node, 'div', style['popup_content']);
    const title = new Control(content.node, 'div', style['popup_title'], `pause of game`);
    const message = new Control(content.node, 'div', style['popup_message'], `You set game on pause. </br> Harry up!`);
    const btnOk = new Control(content.node, 'button', style['popup_button'], 'back to game');
    btnOk.node.onclick = () => {
      this.onBack();
    }
  }
}