import Control from "../../../common/control";
import {AnimatedControl} from './animatedControl'
import style from './side.css'
import Range from './range'

export default class Side extends AnimatedControl{
  onExit: () => void;
  onPause: () => void;
  constructor(parentNode:HTMLElement){
    super(parentNode, 'div', {default:style['side'], hidden:style['hide']});//[style['side'], style['hide']].join(' '));
    
    const pause = new Control(this.node, 'button', style['button'], 'pause');
    pause.node.onclick = () => {
      this.onPause();
    }
    const exit = new Control(this.node, 'button', style['button'], 'exit');
    exit.node.onclick = () => {
      this.onExit();
    }
    const soundsSettings = new Control(this.node, 'div', style['volume'], 'music and sounds');
    const volume = new Range(soundsSettings.node, '0', '100', '10');
    

  }
}