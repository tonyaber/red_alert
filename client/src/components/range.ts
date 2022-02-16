import Control from '../../../common/control';
import style from './range.css'
export default class Range extends Control {
  inputUp: Control<HTMLInputElement>;
  inputDown: Control<HTMLInputElement>;
  minValueText: Control<HTMLElement>;
  maxValueText: Control<HTMLElement>;
  containerRange: Control<HTMLElement>;
  onChange: (type: string, min: string, max: string) => void;
  constructor(parentNode: HTMLElement, type /*money/speed*/: string, min: string, max: string, step: string, minValue: string, maxValue: string) {
    super(parentNode, 'div', style['double-range'])
    this.minValueText = new Control(this.node, 'span', style['value-range']);
    this.minValueText.node.textContent = min;
    
   // this.containerRange = new Control(this.node, 'div', style['container-range']);
    this.inputUp = new Control(this.node, 'input');
    //this.inputDown = new Control(this.containerRange.node, 'input');
    this.inputUp.node.type = 'range';
    //this.inputUp.node.style.width = '75%';
    this.inputUp.node.min = min;
    this.inputUp.node.max = max;
    this.inputUp.node.step = step;
    this.inputUp.node.value = minValue;
    // this.inputDown.node.type = 'range';
    // this.inputDown.node.min = min;
    // this.inputDown.node.max = max;
    // this.inputDown.node.step = step;
    // this.inputDown.node.value = maxValue;

    this.maxValueText = new Control(this.node, 'span', style['value-range']);
    this.maxValueText.node.textContent = max;
    
    this.inputUp.node.oninput = () => {
      //this.setGradient();
      this.setValueToSpan();

      // if (+this.inputUp.node.value > +this.inputDown.node.value) {
      //   this.inputDown.node.value = this.inputUp.node.value;
      // }
    }
  }

    // this.inputDown.node.oninput = () => {
    //   this.setGradient();
    //   this.setValueToSpan();
    //   if (+this.inputDown.node.value < +this.inputUp.node.value) {
    //     this.inputUp.node.value = this.inputDown.node.value;
    //   }
    // }

    // this.inputUp.node.onchange = () => {
    //   this.onChange(type, this.inputUp.node.value, this.inputDown.node.value)
    // }

  //   this.inputDown.node.onchange = () => {
  //    // console.log('max', this.inputDown.node.value);
  //     this.onChange(type, this.inputUp.node.value, this.inputDown.node.value)
  //   }
  // }

  setValueToSpan() {
    //this.maxValueText.node.textContent = this.inputDown.node.value;
    this.maxValueText.node.textContent = this.inputUp.node.value;
  }
  setGradient() {
    const changeValueUp = (+this.inputUp.node.value - +this.inputUp.node.min) * 100 / (+this.inputUp.node.max - +this.inputUp.node.min);
    //const changeValueDown = (+this.inputDown.node.value - +this.inputDown.node.min) * 100 / (+this.inputDown.node.max - +this.inputDown.node.min);//(+this.inputDown.node.value * 100 / +this.inputDown.node.max);
    this.inputUp.node.style.background = `linear-gradient(90deg, #fff ${changeValueUp}%, #f00 ${changeValueUp}%`;
   // this.inputDown.node.style.background = `linear-gradient(90deg, #fff ${changeValueUp}%, #f00 ${changeValueUp}%, #f00 ${changeValueDown}%, #fff ${changeValueDown}%)`;
  }
}