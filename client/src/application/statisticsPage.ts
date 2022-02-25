import Control from '../../../common/control';
import style from './statisticsPage.css'

export default class StatisticsPage extends Control{
  //onContinue: ()=>void;
  onHome: ()=>void;

  constructor(parentNode:HTMLElement){
    super(parentNode, 'div', style['main'])//, 'div', {default: style["main_wrapper"], hidden: style["hide"]});

    const resultTable = new Control(this.node, 'div', style['table_result'], 'result of game');
    resultTable.node.textContent = 'result result result';
    
    const homeButton = new Control(this.node, 'button', style['btnHome'], 'home');
    homeButton.node.onclick = ()=>{
      this.onHome();
    }
  }
}