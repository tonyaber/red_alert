import Control from '../../../common/control';

export class StartPage extends Control{
  onSinglePlay: () => void;
  onMultiPlay: () => void;
  constructor(parentNode: HTMLElement) {
    super(parentNode);
    const singlePlay = new Control(this.node, 'button', '', 'Single Play');
    singlePlay.node.onclick = () => {
      this.onSinglePlay();
    }
    const multiPlay = new Control(this.node, 'button', '', 'Multi Play');
    multiPlay.node.onclick = () => {
      this.onMultiPlay();
    }
  }
}