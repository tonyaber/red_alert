import Control from '../../../common/control';
import style from './startPage.css'

export class StartPage extends Control{
  onSinglePlay: () => void;
  onMultiPlay: () => void;
  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', style['main']);
    const selectWrapper = new Control(this.node, 'div', style['select_wrapper']);
    const singlePlay = new Control(selectWrapper.node, 'div', [style['select_item'], style['single_player']].join(' '), '');
    singlePlay.node.onclick = () => {
      this.onSinglePlay();
    }
    const captureSingle = new Control(singlePlay.node, 'div', style['capture'], 'Single Play')
    const multiPlay = new Control(selectWrapper.node, 'div', [style['select_item'], style['multi_player']].join(' '), '');
    multiPlay.node.onclick = () => {
      this.onMultiPlay();
    }

    const captureMulti = new Control(multiPlay.node, 'div', style['capture'], 'Multi Play')
  }
}