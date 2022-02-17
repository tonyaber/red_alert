import Control from '../../../common/control';
import style from './range.css'
export default class Range extends Control {
  inputUp: Control<HTMLInputElement>;
  maxValueText: Control<HTMLElement>;
  onChange: (value: string) => void;
  constructor(parentNode: HTMLElement, min: string, max: string, step: string) {
    super(parentNode, 'div', style['container-range'])
    this.inputUp = new Control(this.node, 'input', style['range']);
    this.inputUp.node.type = 'range';
    this.inputUp.node.min = min;
    this.inputUp.node.max = max;
    this.inputUp.node.step = step;
    this.inputUp.node.value = max;
  
    this.maxValueText = new Control(this.node, 'span', style['value-range']);
    this.maxValueText.node.textContent = max;
    
    this.inputUp.node.oninput = () => {
      //this.setGradient();   
      this.setValueToSpan();
    }
  

    this.inputUp.node.onchange = () => {
      this.onChange(this.inputUp.node.value)
    }
  }

  setValueToSpan() {
    this.maxValueText.node.textContent = this.inputUp.node.value;
  }

  setGradient() { //TODO сделать прогресс
    const changeValueUp = (+this.inputUp.node.value - +this.inputUp.node.min) * 100 / (+this.inputUp.node.max - +this.inputUp.node.min);
    this.inputUp.node.style.background = `linear-gradient(90deg, #fff ${changeValueUp}%, #f00 ${changeValueUp}%, #f00 100%`;
  }
}